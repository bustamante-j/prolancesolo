'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { CheckCircle, PlayCircle, XCircle, Circle } from 'lucide-react';

type Status = 'todo' | 'in-progress' | 'done' | 'cancelled';

interface Props {
  current: Status;
  onChange: (status: Status) => void;
  className?: string;
}

const options: { key: Status; label: string; icon: React.ReactNode }[] = [
  { key: 'todo', label: 'Todo', icon: <Circle className="w-4 h-4" /> },
  { key: 'in-progress', label: 'In Progress', icon: <PlayCircle className="w-4 h-4 text-blue-400" /> },
  { key: 'done', label: 'Done', icon: <CheckCircle className="w-4 h-4 text-green-400" /> },
  { key: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4 text-red-400" /> },
];

export default function StatusDropdown({ current, onChange, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSelect = (k: Status) => {
    setOpen(false);
    if (k !== current) onChange(k);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* show simple indicator */}
        {current === 'done' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
         current === 'in-progress' ? <PlayCircle className="w-4 h-4 text-blue-600" /> :
         current === 'cancelled' ? <XCircle className="w-4 h-4 text-red-600" /> :
         <Circle className="w-4 h-4 text-gray-500" />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 status-dropdown custom-scrollbar" role="menu">
          {options.map((opt) => (
            <button key={opt.key} role="menuitem" onClick={() => handleSelect(opt.key as Status)} className="flex items-center">
              <span className="w-5 h-5 mr-2">{opt.icon}</span>
              <span className="label">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
