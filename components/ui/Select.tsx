'use client';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Select({ children, className = '', ...rest }: Props) {
  return (
    <select
      {...rest}
      className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
    >
      {children}
    </select>
  );
}
