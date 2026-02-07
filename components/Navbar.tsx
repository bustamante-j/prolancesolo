'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import SettingsMenu from './Settings/SettingsMenu';
import { LogOut, Plus, Users, BarChart3, CheckSquare, History } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
      setAuthResolved(true);
    });
    return unsub;
  }, []);

  // Hide navbar in focus mode
  if (pathname.startsWith('/focus')) return null;

  // Hide navbar on login and register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') return null;

  // Don't render until we know auth state to avoid flicker/hiding
  if (!authResolved) return null;

  const handleLogout = () => {
    auth.logout();
    router.push('/');
  };

  // Landing page navbar (not authenticated)
  if (!isAuthenticated && pathname === '/') {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-10 py-4 w-full">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={encodeURI('/ChatGPT Image Jan 31, 2026, 06_25_36 PM.png')}
              alt="ProLance Lite logo"
              width={40}
              height={40}
              className="object-cover rounded"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/window.svg'; }}
            />
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">ProLance Lite</span>
          </Link>
          <div className="flex items-center gap-4">
            <SettingsMenu />
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated navbar
  if (isAuthenticated) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-10 py-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/tasks" className="flex items-center gap-3">
              <img
                src={encodeURI('/ChatGPT Image Jan 31, 2026, 06_25_36 PM.png')}
                alt="ProLance Lite logo"
                width={40}
                height={40}
                className="object-cover rounded"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/window.svg'; }}
              />
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">ProLance Lite</span>
            </Link>
            <div className="flex gap-6">
              <Link
                href="/tasks"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/tasks'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tasks</span>
              </Link>
              <Link
                href="/add"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/add'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </Link>
              <Link
                href="/clients"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/clients'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Clients</span>
              </Link>
              <Link
                href="/stats"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/stats'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Stats</span>
              </Link>
              <Link
                href="/history"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/history'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
              <Link
                href="/finance"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/finance'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <span className="text-sm font-medium">₱</span>
                <span>Finance</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SettingsMenu />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Hide navbar on other non-authenticated pages
  return null;
}