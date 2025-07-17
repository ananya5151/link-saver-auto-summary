// components/bookmarks/BookmarkForm.js
import { useState } from 'react';

export default function BookmarkForm({ onBookmarkAdded }) {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState(''); // <-- Add state for tags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // --- NEW: Send tags in the request body ---
      body: JSON.stringify({ url, tags }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onBookmarkAdded(data.bookmark);
      setUrl('');
      setTags(''); // <-- Clear tags input on success
    } else {
      setError(data.message || 'Failed to add bookmark.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-8 bg-white rounded-lg shadow dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Add a new link</h3>
      <div className="space-y-4">
        <div className="flex-grow">
          <label htmlFor="url" className="sr-only">URL</label>
          <input
            id="url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* --- NEW: Tags Input Field --- */}
        <div className="flex-grow">
          <label htmlFor="tags" className="sr-only">Tags</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated, e.g., work, reading)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 mt-4 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        {loading ? 'Saving...' : 'Save & Summarize'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}