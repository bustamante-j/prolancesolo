'use client';

import { useEffect } from 'react';
import { applyTheme } from '@/lib/theme';

const ANIM_KEY = 'prolance:animationsEnabled';
const RESPECT_KEY = 'prolance:respectReducedMotion';
const COMPACT_KEY = 'prolance:compactMode';
const ENHANCED_KEY = 'prolance:enhancedUI';

export default function GlobalAnimator() {
  useEffect(() => {
    const apply = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const respect = localStorage.getItem(RESPECT_KEY);
      const respectSystem = respect === null ? 'true' : respect;
      const allowWhenSystemReduced = respectSystem === 'false';

      const animationsEnabled = localStorage.getItem(ANIM_KEY);
      const enabled = animationsEnabled === null ? (prefersReduced ? false : true) : animationsEnabled === 'true';

      const finalEnabled = prefersReduced && !allowWhenSystemReduced ? false : enabled;

      document.documentElement.classList.toggle('animations-enabled', !!finalEnabled);

      const compact = localStorage.getItem(COMPACT_KEY) === 'true';
      document.documentElement.classList.toggle('compact-mode', compact);

      const enhanced = localStorage.getItem(ENHANCED_KEY) === 'true';
      document.documentElement.classList.toggle('enhanced-ui', enhanced);

      // Also apply theme
      const theme = localStorage.getItem('theme');
      const effectiveTheme = theme === 'dark' || theme === 'light' || theme === 'system' ? theme : null;
      applyTheme(effectiveTheme as any);
    };

    apply();

    const onStorage = (e: StorageEvent) => {
      if (e.key === ANIM_KEY || e.key === RESPECT_KEY || e.key === COMPACT_KEY || e.key === ENHANCED_KEY || e.key === 'theme') apply();
    };

    window.addEventListener('storage', onStorage);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqHandler = () => apply();
    mq.addEventListener('change', mqHandler);

    return () => {
      window.removeEventListener('storage', onStorage);
      mq.removeEventListener('change', mqHandler);
    };
  }, []);

  return null;
}
