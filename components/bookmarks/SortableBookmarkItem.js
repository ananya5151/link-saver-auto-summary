// components/bookmarks/SortableBookmarkItem.js
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BookmarkItem from './BookmarkItem';

export default function SortableBookmarkItem({ bookmark, onDeleteBookmark }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: bookmark._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} >
      <BookmarkItem
        bookmark={bookmark}
        onDeleteBookmark={onDeleteBookmark}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}