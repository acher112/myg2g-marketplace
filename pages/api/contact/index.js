import dbConnect from '../../../lib/mongodb';
import { ContactMessage } from '../../../lib/models';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const adminPassword = req.headers['admin-password'];
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const messages = await ContactMessage.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: messages
      });

    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
