import axios from 'axios';
import dbConnect from '../../../lib/mongodb';
import { Order, Listing } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { listingId, buyer } = req.body;

    if (!listingId || !buyer?.name || !buyer?.email || !buyer?.whatsapp) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing || !listing.inStock) {
      return res.status(404).json({
        success: false,
        error: 'Listing not available'
      });
    }

    const orderId = `ORD-${Date.now()}`;
    const order = await Order.create({
      orderId,
      listingId: listing._id,
      listingSnapshot: {
        title: listing.title,
        description: listing.description,
        category: listing.category,
        price: listing.price
      },
      buyer,
      amount: listing.price,
      status: 'pending'
    });

    const coinbaseApiKey = process.env.COINBASE_COMMERCE_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!coinbaseApiKey || coinbaseApiKey.includes('your_api_key')) {
      return res.status(200).json({
        success: true,
        demo: true,
        orderId: order.orderId,
        message: 'Demo mode - Coinbase Commerce not configured',
        paymentUrl: `${appUrl}/order/${orderId}`,
        order
      });
    }

    // Create charge using Coinbase Commerce REST API
    const chargeData = {
      name: listing.title,
      description: `Order #${orderId} - ${listing.description}`,
      pricing_type: 'fixed_price',
      local_price: {
        amount: listing.price.toString(),
        currency: 'USD'
      },
      metadata: {
        order_id: orderId,
        customer_name: buyer.name,
        customer_email: buyer.email,
        customer_whatsapp: buyer.whatsapp
      },
      redirect_url: `${appUrl}/?order=${orderId}&status=success`,
      cancel_url: `${appUrl}/?order=${orderId}&status=cancel`
    };

    console.log('📤 Creating Coinbase charge:', chargeData);

    const response = await axios.post(
      'https://api.commerce.coinbase.com/charges',
      chargeData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CC-Api-Key': coinbaseApiKey,
          'X-CC-Version': '2018-03-22'
        }
      }
    );

    const charge = response.data.data;
    console.log('✅ Charge created:', charge.id);

    // Update order with payment details
    order.paymentDetails = {
      chargeId: charge.id,
      chargeCode: charge.code,
      hostedUrl: charge.hosted_url
    };
    await order.save();

    return res.status(200).json({
      success: true,
      orderId: order.orderId,
      paymentUrl: charge.hosted_url,
      chargeId: charge.id,
      chargeCode: charge.code
    });

  } catch (error) {
    console.error('❌ Payment error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message
    });
  }
}
