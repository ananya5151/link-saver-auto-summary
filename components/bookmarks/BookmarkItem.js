function BookmarkItem({ bookmark, onDeleteBookmark }) {
  async function handleDelete() {
    const response = await fetch(`/api/bookmarks/${bookmark._id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      onDeleteBookmark(bookmark._id);
    } else {
      const data = await response.json();
      alert(data.message);
    }
  }

  return (
    <li>
      <img src={bookmark.favicon} alt="" />
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        {bookmark.title}
      </a>
      <p>{bookmark.summary}</p>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default BookmarkItem;