'use client';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = '', ...rest }: Props) {
  return (
    <input {...rest} className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy ${className}`} />
  );
}
