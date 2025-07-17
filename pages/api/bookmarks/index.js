import connectDb from '@/utils/db';
import Bookmark from '@/models/Bookmark';
import authMiddleware from '@/utils/auth';

/**
 * FINAL ENHANCED: An advanced text-processing function that cleans raw
 * webpage text and formats it into a high-quality bullet-point summary
 * without using an external AI model.
 * @param {string} rawText - The raw, messy text from the Jina API.
 * @returns {{title: string, bulletPoints: string[]}>}
 */
function enhancedCleanAndBulletize(rawText) {
  // 1. Get a clean title using our established method.
  const lines = rawText.split('\n');
  const titleLine = lines.find(line => line.startsWith('Title:')) || 'No title found';
  let title = titleLine.replace('Title:', '').trim();
  const commonSeparators = [' - ', ' | '];
  for (const sep of commonSeparators) {
    if (title.includes(sep)) {
      title = title.split(sep)[0].trim();
      break;
    }
  }

  // 2. Aggressively remove common web page clutter with RegEx.
  let content = rawText
    // Remove all markdown links but keep the link text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove all standalone URLs
    .replace(/(https?:\/\/[^\s]+|www\.[^\s]+)/g, '')
    // Remove metadata like (35 KB (3,850 words) - 22:06, 29 May 2025)
    .replace(/\d+\s*KB\s*\([^)]+\)\s*-\s*[\d:]+,\s*\d+\s*\w+\s*\d+/g, '')
    // Remove image tags and other markdown artifacts
    .replace(/!\[[^\]]*\]\([^)]*\)|###|===|\[x\]/g, '')
    // Remove common navigation/UI text
    .replace(/Jump to content|Main menu|Toggle navigation|Search results|Log in|Sign up|About Wikipedia|Contact us|Donate|Help/gi, '')
    // Remove lines that are mostly non-alphanumeric (likely nav bars)
    .split('\n').filter(line => (line.match(/[a-zA-Z]/g) || []).length / line.length > 0.5)
    .join('\n');

  // 3. Find the most "content-rich" part of the text.
  // We assume the longest line is likely part of the main content.
  const contentLines = content.split('\n').filter(Boolean);
  let longestLineIndex = 0;
  contentLines.forEach((line, index) => {
    if (line.length > contentLines[longestLineIndex].length) {
      longestLineIndex = index;
    }
  });
  
  // Take a slice of the text around the longest line to focus on the main body.
  const contentSlice = contentLines.slice(Math.max(0, longestLineIndex - 10), longestLineIndex + 10).join(' ');

  // 4. Split the focused content into sentences and create bullet points.
  const bulletPoints = contentSlice
    // Split by period, question mark, or asterisk (for lists)
    .split(/(?<=[.?!])\s+|\s\*\s/)
    .map(sentence => sentence.replace(/^\s*\*\s*/, '').trim()) // Clean up list markers
    .filter(sentence => {
      // Keep sentences that are a reasonable length and contain spaces (to filter out junk)
      return sentence.length > 25 && sentence.includes(' ');
    });

  if (bulletPoints.length === 0) {
    return { title, bulletPoints: ["A concise summary could not be extracted from this page."] };
  }

  // 5. Return the best 5-7 bullet points.
  return { title, bulletPoints: bulletPoints.slice(0, 7) };
}


async function handler(req, res) {
  const userId = req.userId;
  await connectDb();

  if (req.method === 'GET') {
    try {
      const bookmarks = await Bookmark.find({ user: userId }).sort({ position: 1 });
      return res.status(200).json({ bookmarks });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch bookmarks.' });
    }
  }

  if (req.method === 'POST') {
    const { url, tags } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required.' });
    try {
      // Step 1: Get raw text from Jina
      const targetUrl = encodeURIComponent(url);
      const summaryRes = await fetch(`https://r.jina.ai/${targetUrl}`);
      if (!summaryRes.ok) throw new Error('Failed to fetch page content.');
      const rawSummaryText = await summaryRes.text();

      // Step 2: Generate a high-quality summary using our new enhanced function
      const { title, bulletPoints } = enhancedCleanAndBulletize(rawSummaryText);
      
      const domain = new URL(url).hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean) : [];
      
      const newBookmark = new Bookmark({
        url, title, summary: bulletPoints, faviconUrl, tags: tagsArray, position: Date.now(), user: userId,
      });

      await newBookmark.save();
      return res.status(201).json({ bookmark: newBookmark });
    } catch (error)      {
      console.error("Error in POST /api/bookmarks:", error);
      return res.status(500).json({ message: 'Failed to create bookmark.' });
    }
  }
}

export default authMiddleware(handler);
