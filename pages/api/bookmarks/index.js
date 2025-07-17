import { getSession } from 'next-auth/react';
import Bookmark from '../../../models/Bookmark';
import dbConnect from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  await dbConnect();

  const { url } = req.body;

  if (!url) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  try {
    // Fetch title and favicon
    const response = await fetch(url);
    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';
    const faviconMatch = html.match(/<link rel="icon" href="(.*?)"/);
    const favicon = faviconMatch ? faviconMatch[1] : '';

    // Fetch summary from Jina AI
    const jinaResponse = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
    const summary = await jinaResponse.text();

    const newBookmark = new Bookmark({
      url,
      title,
      favicon,
      summary,
      user: session.user.id,
    });

    const bookmark = await newBookmark.save();

    res.status(201).json({ bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

if (req.method === 'GET') {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  await dbConnect();

  const bookmarks = await Bookmark.find({ user: session.user.id });

  res.status(200).json({ bookmarks });
}