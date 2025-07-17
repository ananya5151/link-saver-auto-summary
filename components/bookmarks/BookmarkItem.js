// components/bookmarks/BookmarkItem.js
export default function BookmarkItem({ bookmark, onDeleteBookmark, dragHandleProps }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/bookmarks/${bookmark._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      onDeleteBookmark(bookmark._id);
    } else {
      alert('Failed to delete bookmark.');
    }
  };

  return (
    <li className="flex items-center space-x-4 bg-white rounded-lg shadow dark:bg-gray-800">
      {/* The drag handle receives the dragHandleProps */}
      <div {...dragHandleProps} className="p-2 cursor-grab touch-none">
          {/* --- CORRECTED SVG ATTRIBUTES --- */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
            <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zM6 5.25a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zM14 5.25a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
      </div>

      <div className="flex-grow flex items-start space-x-4 p-5 pl-0">
        <img src={bookmark.faviconUrl} alt="favicon" className="flex-shrink-0 w-8 h-8 mt-1" />
        <div className="flex-grow">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{bookmark.title}</h4>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 truncate hover:underline">
            {bookmark.url}
          </a>
          <div className="mt-3">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Summary</h5>
            <ul className="mt-1 space-y-1 text-gray-600 list-disc list-inside dark:text-gray-400">
              {Array.isArray(bookmark.summary) ? bookmark.summary.map((point, index) => (
                <li key={index} className="text-sm">{point}</li>
              )) : <li className="text-sm">{bookmark.summary}</li>}
            </ul>
          </div>
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {bookmark.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleDelete} title="Delete bookmark" className="p-2 text-gray-400 rounded-full self-start hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {/* --- CORRECTED SVG ATTRIBUTES --- */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
      </div>
    </li>
  );
}