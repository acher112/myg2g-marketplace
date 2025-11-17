import axios from 'axios';
import dbConnect from '../../../lib/mongodb';
import { Order, Listing } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { listingId, buyer, payCurrency } = req.body;

    // Validate input
    if (!listingId || !buyer?.name || !buyer?.email || !buyer?.whatsapp) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Get listing
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.inStock) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not available' 
      });
    }

    // Create order in database first
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

    // Create NOWPayments invoice
    const nowPaymentsKey = process.env.NOWPAYMENTS_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!nowPaymentsKey) {
      // Demo mode - return mock data
      return res.status(200).json({
        success: true,
        demo: true,
        orderId: order.orderId,
        message: 'Demo mode - NOWPayments not configured',
        paymentUrl: `${appUrl}/order/${order.orderId}`,
        order: order
      });
    }

    const invoicePayload = {
      price_amount: listing.price,
      price_currency: 'usd',
      pay_currency: payCurrency || 'usdttrc20', // Default to USDT TRC20
      order_id: orderId,
      order_description: `${listing.title} - ${listing.category}`,
      ipn_callback_url: `${appUrl}/api/payment/webhook`,
      success_url: `${appUrl}/order/${orderId}/success`,
      cancel_url: `${appUrl}/order/${orderId}/cancel`
    };

    const response = await axios.post(
      'https://api.nowpayments.io/v1/invoice',
      invoicePayload,
      {
        headers: {
          'x-api-key': nowPaymentsKey,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update order with payment details
    order.paymentDetails = {
      invoiceId: response.data.id,
      paymentAddress: response.data.pay_address,
      paymentCurrency: response.data.pay_currency,
      paymentAmount: response.data.pay_amount
    };
    await order.save();

    return res.status(200).json({
      success: true,
      orderId: order.orderId,
      paymentUrl: response.data.invoice_url,
      paymentAddress: response.data.pay_address,
      paymentAmount: response.data.pay_amount,
      payCurrency: response.data.pay_currency
    });

  } catch (error) {
    console.error('Create invoice error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
    });
  }
}