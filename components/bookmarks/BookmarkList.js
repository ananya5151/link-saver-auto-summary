// components/bookmarks/BookmarkList.js
import SortableBookmarkItem from './SortableBookmarkItem';

export default function BookmarkList({ bookmarks, onDeleteBookmark }) {
  return (
    <ul className="mt-6 space-y-4">
      {bookmarks.map((bookmark) => (
        <SortableBookmarkItem
          key={bookmark._id}
          bookmark={bookmark}
          onDeleteBookmark={onDeleteBookmark}
        />
      ))}
    </ul>
  );
}