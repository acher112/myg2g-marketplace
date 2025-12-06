import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const adminPassword = req.headers['admin-password'];
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { id } = req.query;

    const order = await Order.findOneAndDelete({ orderId: id });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
