'use client';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export default function Textarea({ className = '', ...rest }: Props) {
  return (
    <textarea {...rest} className={`w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy ${className}`} />
  );
}
