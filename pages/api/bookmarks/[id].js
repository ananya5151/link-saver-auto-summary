import { getSession } from 'next-auth/react';
import Bookmark from '../../../models/Bookmark';
import dbConnect from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { id } = req.query;

  await dbConnect();

  try {
    await Bookmark.findOneAndDelete({ _id: id, user: session.user.id });
    res.status(200).json({ message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}