// pages/index.js
import { useEffect, useState } from 'react';
import LinkVault from '@/components/LinkVault';

// This is the "Container" component. Its only job is to manage real data.
export default function DashboardContainer() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // This hook fetches real data from your API on the client-side
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetch('/api/bookmarks', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => {
          if (res.ok) return res.json();
          // If token is invalid, log out
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          return { bookmarks: [] };
        })
        .then(data => {
          const sortedBookmarks = Array.isArray(data.bookmarks) 
            ? data.bookmarks.sort((a, b) => (a.position || 0) - (b.position || 0))
            : [];
          setBookmarks(sortedBookmarks);
          setLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const handleLogin = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      // Re-fetch bookmarks after login
      const bookmarksRes = await fetch('/api/bookmarks', { headers: { 'Authorization': `Bearer ${token}` } });
      if (bookmarksRes.ok) {
        const data = await bookmarksRes.json();
        setBookmarks(data.bookmarks.sort((a, b) => (a.position || 0) - (b.position || 0)) || []);
      }
      return true;
    }
    return false;
  };

  const handleSignup = async (email, password) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      // Automatically log in after successful signup
      return handleLogin(email, password);
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setBookmarks([]);
  };

  const handleAddBookmark = async (url, tags) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ url, tags }),
    });
    if (res.ok) {
      const { bookmark } = await res.json();
      setBookmarks(prev => [bookmark, ...prev]);
      return true;
    }
    return false;
  };

  const handleDeleteBookmark = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/bookmarks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setBookmarks(prev => prev.filter(b => b._id !== id));
    } else {
      alert('Failed to delete bookmark.');
    }
  };
  
  const handleReorder = async (activeId, overId) => {
    setBookmarks((items) => {
      const oldIndex = items.findIndex(item => item._id === activeId);
      const newIndex = items.findIndex(item => item._id === overId);
      if (oldIndex === -1 || newIndex === -1) return items;
      const newOrder = arrayMove(items, oldIndex, newIndex);
      
      const token = localStorage.getItem('token');
      fetch('/api/bookmarks/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ orderedIds: newOrder.map(item => item._id) }),
      });
      return newOrder;
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center"><p>Loading LinkVault...</p></div>;
  }

  return (
    <LinkVault
      isAuthenticated={isAuthenticated}
      bookmarks={bookmarks}
      onLogin={handleLogin}
      onSignup={handleSignup}
      onLogout={handleLogout}
      onAddBookmark={handleAddBookmark}
      onDeleteBookmark={handleDeleteBookmark}
      onReorder={handleReorder}
    />
  );
}