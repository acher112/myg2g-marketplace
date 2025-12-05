import dbConnect from '../../../lib/mongodb';
import { ContactMessage } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { name, email, orderId, issue, message } = req.body;

    if (!name || !email || !issue || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      orderId: orderId || null,
      issue,
      message,
      status: 'new'
    });

    console.log('✅ New contact message received from:', email);

    return res.status(200).json({
      success: true,
      message: 'Message received successfully',
      data: contactMessage
    });

  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
