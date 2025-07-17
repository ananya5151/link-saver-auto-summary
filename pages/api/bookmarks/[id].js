// pages/api/bookmarks/[id].js
import connectDb from '@/utils/db';
import Bookmark from '@/models/Bookmark';
import authMiddleware from '@/utils/auth';

async function handler(req, res) {
  const { id } = req.query;
  const userId = req.userId;

  await connectDb();

  if (req.method === 'DELETE') {
    try {
      const bookmark = await Bookmark.findOneAndDelete({ _id: id, user: userId });

      if (!bookmark) {
        return res.status(404).json({ message: 'Bookmark not found or you do not have permission to delete it.' });
      }

      return res.status(200).json({ message: 'Bookmark deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error while deleting bookmark.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);