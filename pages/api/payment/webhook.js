import crypto from 'crypto';
import dbConnect from '../../../lib/mongodb';
import { Order } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    // Verify NOWPayments signature
    const receivedSignature = req.headers['x-nowpayments-sig'];
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

    if (ipnSecret) {
      const sortedBody = sortObject(req.body);
      const bodyString = JSON.stringify(sortedBody);
      const expectedSignature = crypto
        .createHmac('sha512', ipnSecret)
        .update(bodyString)
        .digest('hex');

      if (receivedSignature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    // Process payment notification
    const { order_id, payment_status, price_amount, pay_amount, pay_currency, outcome_amount, payment_id } = req.body;

    const order = await Order.findOne({ orderId: order_id });
    if (!order) {
      console.error('Order not found:', order_id);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status based on payment status
    let newStatus = order.status;
    
    switch (payment_status) {
      case 'waiting':
        newStatus = 'pending';
        break;
      case 'confirming':
        newStatus = 'pending';
        break;
      case 'confirmed':
      case 'finished':
        newStatus = 'paid';
        break;
      case 'failed':
      case 'refunded':
      case 'expired':
        newStatus = 'cancelled';
        break;
    }

    order.status = newStatus;
    order.paymentDetails = {
      ...order.paymentDetails,
      paymentId: payment_id,
      paymentStatus: payment_status,
      paymentAmount: pay_amount,
      paymentCurrency: pay_currency,
      outcomeAmount: outcome_amount
    };
    order.updatedAt = Date.now();

    await order.save();

    // TODO: Send email/WhatsApp notification to buyer and admin
    if (newStatus === 'paid') {
      console.log(`✅ Order ${order_id} marked as PAID. Send account credentials to:`, order.buyer.email);
      // You can integrate email service here (Nodemailer, SendGrid, etc.)
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Helper function to sort object keys for signature verification
function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

// Disable body parser for raw body signature verification
export const config = {
  api: {
    bodyParser: true, // NOWPayments needs parsed body
  },
};