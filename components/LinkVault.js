import React, { useState, useEffect, useMemo } from 'react';
import { Bookmark, Plus, Search, Moon, Sun, User, LogOut, Trash2, ExternalLink, Globe, Grid, List, Menu, X } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableBookmarkItem = ({ bookmark, onDeleteBookmark }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: bookmark._id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style}>
      <BookmarkCard bookmark={bookmark} onDeleteBookmark={onDeleteBookmark} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
};

const BookmarkCard = ({ bookmark, onDeleteBookmark, dragHandleProps }) => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <div className="relative group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setShowDelete(true)} onMouseLeave={() => setShowDelete(false)}>
      <div className="p-5 flex-grow">
        <div className="flex items-start space-x-4">
          <div {...dragHandleProps} className="flex-shrink-0 pt-1 cursor-grab touch-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zM6 5.25a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zM14 5.25a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
          </div>
          <img src={bookmark.faviconUrl} alt="favicon" className="w-10 h-10 rounded-md object-cover" onError={(e) => e.currentTarget.src = `https://placehold.co/40x40/e2e8f0/64748b?text=${bookmark.title.charAt(0)}`} />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white truncate">{bookmark.title}</h3>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 dark:text-slate-400 hover:underline truncate flex items-center">
              <Globe size={12} className="mr-1 flex-shrink-0"/> {bookmark.url}
            </a>
          </div>
        </div>
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1 tracking-wider">Summary</h5>
          <ul className="space-y-1.5 list-disc list-inside">
            {Array.isArray(bookmark.summary) ? bookmark.summary.map((point, index) => (
              <li key={index}>{point}</li>
            )) : <li>{bookmark.summary}</li>}
          </ul>
        </div>
      </div>
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-300">{tag}</span>
            ))}
          </div>
        </div>
      )}
      <div className={`absolute top-3 right-3 flex items-center space-x-1 transition-opacity duration-300 ${showDelete ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 backdrop-blur-sm"><ExternalLink size={16} /></a>
        <button onClick={() => onDeleteBookmark(bookmark._id)} className="p-1.5 rounded-full bg-red-100/50 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 backdrop-blur-sm"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

export default function LinkVault({ isAuthenticated, bookmarks, onLogin, onSignup, onLogout, onAddBookmark, onDeleteBookmark, onReorder }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('linkvault-darkmode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('linkvault-darkmode', newMode);
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  const allTags = useMemo(() => ['all', ...new Set((bookmarks || []).flatMap(b => b.tags || []))], [bookmarks]);
  
  const filteredBookmarks = useMemo(() => {
    if (!bookmarks) return [];
    return bookmarks
      .filter(b => selectedTag === 'all' || (b.tags && b.tags.includes(selectedTag)))
      .filter(b => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return b.title.toLowerCase().includes(query) || (Array.isArray(b.summary) && b.summary.join(' ').toLowerCase().includes(query));
      });
  }, [bookmarks, selectedTag, searchQuery]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    let success = authMode === 'login' ? await onLogin(email, password) : await onSignup(email, password);
    if (success) {
      setShowAuthModal(false);
    } else {
      alert(`Failed to ${authMode}. Please check your credentials and try again.`);
    }
  };
  
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    const tags = e.target.tags.value;
    const success = await onAddBookmark(url, tags);
    if (success) {
      setShowAddModal(false);
    } else {
      alert('Failed to add bookmark. Please try again.');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = bookmarks.findIndex(item => item._id === active.id);
      const newIndex = bookmarks.findIndex(item => item._id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const newOrder = arrayMove(bookmarks, oldIndex, newIndex);
      onReorder(newOrder.map(item => item._id));
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-slate-900 font-sans transition-colors`}>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">LinkVault</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated && (
                <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Plus size={20} />
                  <span>Add Link</span>
                </button>
              )}
              {isAuthenticated ? (
                <button onClick={onLogout} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <User size={20} />
                  <span>Login / Signup</span>
                </button>
              )}
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <div className="md:hidden"><button onClick={() => setShowMobileMenu(true)} className="p-2 rounded-md text-slate-600 dark:text-slate-300"><Menu /></button></div>
          </div>
        </nav>
      </header>

      <main>
        {isAuthenticated ? (
          <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Search bookmarks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 hidden sm:inline">Filter:</span>
                  {allTags.map(tag => (
                    <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>{tag}</button>
                  ))}
                </div>
                <div className="hidden sm:flex items-center gap-2 p-1 rounded-lg bg-slate-200 dark:bg-slate-700">
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white' : 'text-slate-500'}`}><List size={20} /></button>
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white' : 'text-slate-500'}`}><Grid size={20} /></button>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
              {filteredBookmarks.length > 0 ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filteredBookmarks.map(b => b._id)} strategy={verticalListSortingStrategy} disabled={!!selectedTag || !!searchQuery}>
                    <div className={`mt-6 gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}`}>
                      {filteredBookmarks.map(bookmark => (<SortableBookmarkItem key={bookmark._id} bookmark={bookmark} onDeleteBookmark={onDeleteBookmark} />))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-block p-4 bg-slate-200 dark:bg-slate-700 rounded-full"><Bookmark className="w-12 h-12 text-slate-400 dark:text-slate-500"/></div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">No matching bookmarks found</h3>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search or filter.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 container mx-auto px-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-5xl md:text-6xl">Welcome to LinkVault</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">Your intelligent bookmark manager. Save, summarize, and organize your links.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</button>
              <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Log in <span aria-hidden="true">→</span></button>
            </div>
          </div>
        )}
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X className="w-6 h-6 text-slate-500"/></button>
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">{authMode === 'login' ? 'Login to access your vault.' : 'Start saving links today.'}</p>
            <form className="space-y-4" onSubmit={handleAuthSubmit}>
              <input name="email" type="email" placeholder="Email address" required className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              <button type="submit" className="w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity">{authMode === 'login' ? 'Log In' : 'Sign Up'}</button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">{authMode === 'login' ? "Don't have an account?" : "Already have an account?"}<button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="font-semibold text-blue-600 hover:underline ml-1">{authMode === 'login' ? 'Sign Up' : 'Log In'}</button></p>
          </div>
        </div>
      )}
      {showAddModal && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X className="w-6 h-6 text-slate-500"/></button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Add New Bookmark</h2>
            <form className="space-y-4" onSubmit={handleAddSubmit}>
              <input name="url" type="url" placeholder="https://example.com" required className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              <input name="tags" type="text" placeholder="Tags (comma-separated)" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              <button type="submit" className="w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity">Add Link & Summarize</button>
            </form>
          </div>
        </div>
      )}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)}></div>
            <div className="relative w-72 h-full bg-white dark:bg-slate-800 shadow-xl p-6">
                 <button onClick={() => setShowMobileMenu(false)} className="absolute top-4 right-4 p-2"><X className="w-6 h-6 text-slate-500"/></button>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"><Bookmark className="w-6 h-6 text-white" /></div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">LinkVault</h1>
                </div>
                <nav className="flex flex-col space-y-4">
                    <button onClick={() => { setShowMobileMenu(false); if (isAuthenticated) setShowAddModal(true); else setShowAuthModal(true); }} className="flex items-center space-x-3 text-lg text-slate-700 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><Plus/><span>Add Link</span></button>
                    {isAuthenticated ? (
                      <button onClick={() => { setShowMobileMenu(false); onLogout(); }} className="flex items-center space-x-3 text-lg text-slate-700 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><LogOut/><span>Logout</span></button>
                    ) : (
                      <button onClick={() => { setShowMobileMenu(false); setAuthMode('login'); setShowAuthModal(true); }} className="flex items-center space-x-3 text-lg text-slate-700 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><User/><span>Login / Signup</span></button>
                    )}
                     <button onClick={toggleDarkMode} className="flex items-center space-x-3 text-lg text-slate-700 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        {darkMode ? <Sun/> : <Moon/>}<span>Toggle Theme</span>
                    </button>
                </nav>
            </div>
        </div>
      )}
    </div>
  );
}
