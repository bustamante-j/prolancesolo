'use client';

import { useEffect, useRef, useState } from 'react';
import { Settings, Check, Moon, Sun, Zap } from 'lucide-react';
import { setStoredTheme, applyTheme } from '@/lib/theme';

const ANIM_KEY = 'prolance:animationsEnabled';
const RESPECT_KEY = 'prolance:respectReducedMotion';
const COMPACT_KEY = 'prolance:compactMode';
const ENHANCED_KEY = 'prolance:enhancedUI';

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [animations, setAnimations] = useState<boolean>(true);
  const [respectSystem, setRespectSystem] = useState<boolean>(true);
  const [compact, setCompact] = useState<boolean>(false);
  const [theme, setTheme] = useState<'system' | 'dark' | 'light'>('system');
  const [enhanced, setEnhanced] = useState<boolean>(true);

  useEffect(() => {
    const a = localStorage.getItem(ANIM_KEY);
    const r = localStorage.getItem(RESPECT_KEY);
    const c = localStorage.getItem(COMPACT_KEY);
    const t = localStorage.getItem('theme');
    const e = localStorage.getItem(ENHANCED_KEY);

    setRespectSystem(r === null ? true : r === 'true');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setAnimations(a === null ? !prefersReduced : a === 'true');
    setCompact(c === 'true');
    setTheme(t === 'dark' || t === 'light' || t === 'system' ? (t as any) : 'system');
    setEnhanced(e === null ? true : e === 'true');
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const recomputeAnimations = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const respect = localStorage.getItem(RESPECT_KEY);
    const respectSystem = respect === null ? 'true' : respect;
    const allowWhenSystemReduced = respectSystem === 'false';

    const animationsEnabled = localStorage.getItem(ANIM_KEY);
    const enabled = animationsEnabled === null ? (prefersReduced ? false : true) : animationsEnabled === 'true';

    const finalEnabled = prefersReduced && !allowWhenSystemReduced ? false : enabled;
    document.documentElement.classList.toggle('animations-enabled', !!finalEnabled);
  };

  const toggleAnimations = () => {
    const next = !animations;
    setAnimations(next);
    localStorage.setItem(ANIM_KEY, next ? 'true' : 'false');
    recomputeAnimations();
    window.dispatchEvent(new StorageEvent('storage', { key: ANIM_KEY, newValue: next ? 'true' : 'false' } as any));
  };

  const toggleRespect = () => {
    const next = !respectSystem;
    setRespectSystem(next);
    localStorage.setItem(RESPECT_KEY, next ? 'true' : 'false');
    recomputeAnimations();
    window.dispatchEvent(new StorageEvent('storage', { key: RESPECT_KEY, newValue: next ? 'true' : 'false' } as any));
  };

  const toggleCompact = () => {
    const next = !compact;
    setCompact(next);
    localStorage.setItem(COMPACT_KEY, next ? 'true' : 'false');
    document.documentElement.classList.toggle('compact-mode', next);
    window.dispatchEvent(new StorageEvent('storage', { key: COMPACT_KEY, newValue: next ? 'true' : 'false' } as any));
  };

  const resetDefaults = () => {
    localStorage.removeItem(ANIM_KEY);
    localStorage.removeItem(RESPECT_KEY);
    localStorage.removeItem(COMPACT_KEY);
    localStorage.removeItem('theme');
    setRespectSystem(true);
    setAnimations(true);
    setCompact(false);
    setTheme('system');
    // reset DOM classes
    document.documentElement.classList.toggle('animations-enabled', true);
    document.documentElement.classList.toggle('compact-mode', false);
    document.documentElement.classList.toggle('enhanced-ui', true);
    // reset theme to system
    setStoredTheme(null);
    applyTheme(null);
    window.dispatchEvent(new StorageEvent('storage', { key: ANIM_KEY } as any));
    window.dispatchEvent(new StorageEvent('storage', { key: RESPECT_KEY } as any));
    window.dispatchEvent(new StorageEvent('storage', { key: COMPACT_KEY } as any));
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme' } as any));
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        aria-expanded={open}
        aria-haspopup
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-semibold">Settings</div>
                <div className="text-xs text-gray-500">Appearance & preferences</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500">Done</button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Animations</div>
                <div className="text-xs text-gray-500">Enable site-wide motion</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={animations} onChange={toggleAnimations} className="sr-only" />
                <span className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition ${animations ? 'after:translate-x-5 bg-indigo-600' : ''}`} />
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${animations ? 'translate-x-5' : ''}`}></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Respect system motion</div>
                <div className="text-xs text-gray-500">Disable animations when system prefers reduced motion</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={respectSystem} onChange={toggleRespect} className="sr-only" />
                <span className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition ${respectSystem ? 'after:translate-x-5 bg-indigo-600' : ''}`} />
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${respectSystem ? 'translate-x-5' : ''}`}></span>
              </label>
            </div>

            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-gray-500 mb-2">Choose your theme preference</div>
              <div className="flex gap-2">
                <button className={`px-3 py-1 rounded-md text-sm border ${theme === 'system' ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`} onClick={() => { setTheme('system'); setStoredTheme('system'); applyTheme('system'); window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'system' } as any)); }}>
                  System
                </button>
                <button className={`px-3 py-1 rounded-md text-sm border ${theme === 'dark' ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`} onClick={() => { setTheme('dark'); setStoredTheme('dark'); applyTheme('dark'); window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' } as any)); }}>
                  Dark
                </button>
                <button className={`px-3 py-1 rounded-md text-sm border ${theme === 'light' ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`} onClick={() => { setTheme('light'); setStoredTheme('light'); applyTheme('light'); window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' } as any)); }}>
                  Light
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Compact mode</div>
                <div className="text-xs text-gray-500">Reduce spacing for dense layout</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={compact} onChange={toggleCompact} className="sr-only" />
                <span className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition ${compact ? 'after:translate-x-5 bg-indigo-600' : ''}`} />
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${compact ? 'translate-x-5' : ''}`}></span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div>
                <div className="text-sm font-medium">Enhanced UI</div>
                <div className="text-xs text-gray-500">Enable the bold ProLance visual theme</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={enhanced} onChange={() => { const next = !enhanced; setEnhanced(next); localStorage.setItem(ENHANCED_KEY, next ? 'true' : 'false'); document.documentElement.classList.toggle('enhanced-ui', next); window.dispatchEvent(new StorageEvent('storage', { key: ENHANCED_KEY, newValue: next ? 'true' : 'false' } as any)); }} className="sr-only" />
                <span className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition ${enhanced ? 'after:translate-x-5 bg-indigo-600' : ''}`} />
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${enhanced ? 'translate-x-5' : ''}`}></span>
              </label>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <button onClick={resetDefaults} className="w-full text-sm text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition">Reset to defaults</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
