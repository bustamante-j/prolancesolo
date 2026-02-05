import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { Task } from '@/types/task';
import { exportToCSV } from '@/lib/exportCsv';
import { exportToPDF } from '@/lib/exportPdf';

interface ExportButtonProps {
  tasks: Task[];
  className?: string;
}

export default function ExportButton({ tasks, className = '' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    setIsOpen(false);

    try {
      if (format === 'csv') {
        exportToCSV(tasks);
      } else if (format === 'pdf') {
        exportToPDF(tasks);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || tasks.length === 0}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export Report'}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 mr-3 text-green-600" />
                Export as CSV
                <span className="ml-auto text-xs text-gray-500">Spreadsheet</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-3 text-red-600" />
                Export as PDF
                <span className="ml-auto text-xs text-gray-500">Document</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}