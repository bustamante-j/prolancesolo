'use client';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition transform hover:-translate-y-0.5';
  const variants: Record<string, string> = {
    primary: 'bg-brand-navy text-white hover:bg-black/80',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
