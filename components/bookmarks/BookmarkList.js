import BookmarkItem from './BookmarkItem';

function BookmarkList({ bookmarks, onDeleteBookmark }) {
  return (
    <ul>
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark._id}
          bookmark={bookmark}
          onDeleteBookmark={onDeleteBookmark}
        />
      ))}
    </ul>
  );
}

export default BookmarkList;