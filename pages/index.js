// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null); // We can add user info later

  useEffect(() => {
    const token = localStorage.getItem('token');
    // If no token is found, redirect to the login page
    if (!token) {
      router.replace('/login');
    } else {
      // In a real app, you'd verify the token with the backend
      // and decode it to get user info. For now, we'll just confirm they are "logged in".
      setUserEmail('user@example.com'); // Placeholder
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  // While checking for the token, you can show a loading state
  if (!userEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Once authenticated, show the dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container flex items-center justify-between px-6 py-4 mx-auto">
          <h1 className="text-xl font-bold text-indigo-600">Link Saver</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-semibold text-indigo-600 bg-transparent border border-indigo-500 rounded hover:bg-indigo-500 hover:text-white hover:border-transparent"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="container px-6 py-8 mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800">Your Saved Links</h2>
        <div className="mt-8">
          {/* Bookmark form and list will go here in the next step */}
          <p className="p-4 text-center bg-white rounded-md shadow">
            Your saved bookmarks will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}