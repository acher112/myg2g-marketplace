import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../lib/models';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const order = await Order.findOne({ orderId: id });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      // Check if request has admin password
      const adminPassword = req.headers['admin-password'];
      const isAdmin = adminPassword === process.env.ADMIN_PASSWORD;

      // Return appropriate data based on user type
      if (isAdmin) {
        // Full data for admin
        return res.status(200).json({ success: true, data: order });
      } else {
        // Public view - limited data
        return res.status(200).json({
          success: true,
          data: {
            orderId: order.orderId,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            listingSnapshot: order.listingSnapshot,
            paymentDetails: {
              method: order.paymentDetails?.method,
              amountUSD: order.paymentDetails?.amountUSD
            },
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
          }
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const adminPassword = req.headers['admin-password'];
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { status, deliveryNotes } = req.body;

      const order = await Order.findOneAndUpdate(
        { orderId: id },
        { 
          status, 
          deliveryNotes,
          updatedAt: Date.now() 
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
