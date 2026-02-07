'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Theme, getStoredTheme, setStoredTheme, applyTheme } from '@/lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) setTheme(stored);
    applyTheme(stored || 'system');

    // respond to storage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const s = getStoredTheme();
        setTheme(s || 'system');
        applyTheme(s || 'system');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const cycle = () => {
    const next: Theme = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
    setTheme(next);
    setStoredTheme(next);
    applyTheme(next);
  };

  const icon = theme === 'dark' ? <Sun className="w-5 h-5" /> : theme === 'light' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />;

  return (
    <button
      onClick={cycle}
      title={`Theme: ${theme}`}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {icon}
    </button>
  );
}