import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { id } = req.query;  // Changed from orderId to id
    const { transactionId } = req.body;

    const order = await Order.findOne({ orderId: id });  // Find by orderId field

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'awaiting_verification';
    order.paymentDetails = {
      ...order.paymentDetails,
      transactionId,
      submittedAt: new Date()
    };

    await order.save();

    console.log('✅ Payment confirmation received for order:', id);

    return res.status(200).json({
      success: true,
      message: 'Payment confirmation received'
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    return res.status(500).json({ error: error.message });
  }
}
