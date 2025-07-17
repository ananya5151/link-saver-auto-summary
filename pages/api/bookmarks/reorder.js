// pages/api/bookmarks/reorder.js
import connectDb from '@/utils/db';
import Bookmark from '@/models/Bookmark';
import authMiddleware from '@/utils/auth';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.userId;
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ message: 'Invalid payload: orderedIds must be an array.' });
  }

  await connectDb();

  try {
    // Create an array of update operations
    const updatePromises = orderedIds.map((id, index) => {
      return Bookmark.updateOne(
        { _id: id, user: userId }, // Ensure user can only update their own bookmarks
        { $set: { position: index } }
      );
    });

    // Execute all updates concurrently
    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Bookmarks reordered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder bookmarks.' });
  }
}

export default authMiddleware(handler);