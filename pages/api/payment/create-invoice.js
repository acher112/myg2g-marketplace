import dbConnect from '../../../lib/mongodb';
import { Order, Listing } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { listingId, buyer, paymentMethod } = req.body;

    if (!listingId || !buyer?.name || !buyer?.email || !buyer?.whatsapp) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (!paymentMethod || !['USDT', 'LTC'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Please select a payment method (USDT or LTC)'
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
    
    // Create order
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
      status: 'pending_payment',
      paymentDetails: {
        method: paymentMethod,
        amountUSD: listing.price,
        createdAt: new Date()
      }
    });

    console.log('✅ Order created:', orderId, 'Payment method:', paymentMethod);

    return res.status(200).json({
      success: true,
      orderId: order.orderId,
      paymentMethod,
      amountUSD: listing.price,
      message: 'Order created. Redirecting to payment instructions...'
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
