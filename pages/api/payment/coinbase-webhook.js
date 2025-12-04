import dbConnect from '../../../lib/mongodb';
import { Order } from '../../../lib/models';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false
  }
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', reject);
  });
}

function verifySignature(payload, signature, secret) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-cc-webhook-signature'];
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;

    console.log('📩 Coinbase webhook received');

    // Verify webhook signature
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    console.log('✅ Webhook verified');

    const event = JSON.parse(rawBody);
    const charge = event.data;
    const orderId = charge.metadata?.order_id;

    console.log('📦 Event type:', event.type);
    console.log('📦 Order ID:', orderId);

    if (!orderId) {
      console.log('⚠️ No order_id in metadata');
      return res.status(200).json({ received: true });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      console.log('⚠️ Order not found:', orderId);
      return res.status(200).json({ received: true });
    }

    // Update order based on event type
    if (event.type === 'charge:confirmed') {
      order.status = 'paid';
      order.paymentDetails = {
        ...order.paymentDetails,
        chargeId: charge.id,
        confirmedAt: new Date(),
        payments: charge.payments
      };
      await order.save();
      console.log('✅ Order marked as paid:', orderId);
    }

    if (event.type === 'charge:failed') {
      order.status = 'cancelled';
      await order.save();
      console.log('❌ Order marked as failed:', orderId);
    }

    return res.status(200).json({ received: true, orderId });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
