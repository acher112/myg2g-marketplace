import dbConnect from '../../../../lib/mongodb';
import { ContactMessage } from '../../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const adminPassword = req.headers['admin-password'];
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { id } = req.query;
    const { status } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    return res.status(200).json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Error updating message status:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
