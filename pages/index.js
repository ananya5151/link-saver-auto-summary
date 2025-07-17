import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import BookmarkForm from '../components/bookmarks/BookmarkForm';
import BookmarkList from '../components/bookmarks/BookmarkList';

function HomePage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/bookmarks')
        .then((response) => response.json())
        .then((data) => setBookmarks(data.bookmarks));
    }
  }, [status]);

  function handleAddBookmark(newBookmark) {
    setBookmarks((prevBookmarks) => [...prevBookmarks, newBookmark]);
  }

  function handleDeleteBookmark(bookmarkId) {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.filter((bookmark) => bookmark._id !== bookmarkId)
    );
  }

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <h1>Not signed in</h1>
        <a href="/login">Sign In</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Bookmarks</h1>
      <button onClick={() => signOut()}>Sign Out</button>
      <BookmarkForm onAddBookmark={handleAddBookmark} />
      <BookmarkList
        bookmarks={bookmarks}
        onDeleteBookmark={handleDeleteBookmark}
      />
    </div>
  );
}

export default HomePage;