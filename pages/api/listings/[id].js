import dbConnect from '../../../lib/mongodb';
import { Listing } from '../../../lib/models';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;  // Get the ID from URL

  // GET single listing (public)
  if (req.method === 'GET') {
    try {
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({ success: false, error: 'Listing not found' });
      }
      return res.status(200).json({ success: true, data: listing });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // PUT - Update listing (admin only)
  if (req.method === 'PUT') {
    try {
      const adminPassword = req.headers['admin-password'];
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const listing = await Listing.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });

      if (!listing) {
        return res.status(404).json({ success: false, error: 'Listing not found' });
      }

      return res.status(200).json({ success: true, data: listing });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // DELETE listing (admin only)
  if (req.method === 'DELETE') {
    try {
      const adminPassword = req.headers['admin-password'];
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const listing = await Listing.findByIdAndDelete(id);
      if (!listing) {
        return res.status(404).json({ success: false, error: 'Listing not found' });
      }

      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
