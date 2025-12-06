import dbConnect from '../../../lib/mongodb';
import { Listing } from '../../../lib/models';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { category } = req.query;
      
      // Remove inStock filter - show ALL products
      const query = category ? { category } : {};
      const listings = await Listing.find(query).sort({ createdAt: -1 });
      
      return res.status(200).json({ success: true, data: listings });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const adminPassword = req.headers['admin-password'];
      
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const listing = await Listing.create(req.body);
      return res.status(201).json({ success: true, data: listing });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
