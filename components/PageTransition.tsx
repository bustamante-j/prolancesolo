// Page transition wrapper component for smooth slide animations
// Provides different animations for forward/backward navigation

'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    const prevPathname = prevPathnameRef.current;

    const animationsEnabled = typeof document !== 'undefined' && document.documentElement.classList.contains('animations-enabled');

    // Simple direction detection - you could enhance this with a navigation history stack
    if (pathname !== prevPathname) {
      setIsTransitioning(true);

      // For demo purposes, let's assume forward navigation
      // In a real app, you'd track navigation history
      setDirection('forward');

      // Update children immediately for the new page
      setDisplayChildren(children);

      const timeout = animationsEnabled ? 350 : 0;
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, timeout);

      prevPathnameRef.current = pathname;
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isTransitioning
          ? direction === 'forward'
            ? 'transform translate-x-8 opacity-0 scale-95'
            : 'transform -translate-x-8 opacity-0 scale-95'
          : 'transform translate-x-0 opacity-100 scale-100'
      }`}
    >
      {displayChildren}
    </div>
  );
}