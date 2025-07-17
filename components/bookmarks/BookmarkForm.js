import { useState } from 'react';

function BookmarkForm({ onAddBookmark }) {
  const [url, setUrl] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (response.ok) {
      onAddBookmark(data.bookmark);
      setUrl('');
    } else {
      alert(data.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />
      <button type="submit">Add Bookmark</button>
    </form>
  );
}

export default BookmarkForm;