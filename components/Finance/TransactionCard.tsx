import { useEffect, useState } from 'react';
import { Transaction } from '@/types/transaction';
import { financeService } from '@/services/financeService';
import { Trash2, Download, Eye } from 'lucide-react';

interface Props {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Transaction>) => void;
}

export default function TransactionCard({ transaction, onDelete, onUpdate }: Props) {
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (transaction.receiptPath) {
        try {
          const url = await financeService.getReceiptUrl(transaction.receiptPath);
          if (mounted) setReceiptUrl(url);
        } catch (err) {
          console.error('Error loading receipt url', err);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [transaction.receiptPath]);

  const handleDeleteReceipt = async () => {
    if (!transaction.receiptPath) return;
    if (!confirm('Delete receipt?')) return;
    await financeService.deleteReceipt(transaction.receiptPath);
    await onUpdate?.(transaction.id, { receiptPath: null });
    setReceiptUrl(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium">{transaction.category || (transaction.type === 'income' ? 'Income' : 'Expense')}</span>
            <span className="text-sm text-gray-500">• {transaction.clientId || '—'}</span>
          </div>
          <div className="text-xl font-semibold">₱ {transaction.amount.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{transaction.description}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">{new Date(transaction.date).toLocaleDateString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            {receiptUrl ? (
              <>
                <a href={receiptUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700">
                  <Eye className="w-4 h-4" />
                </a>
                <button onClick={handleDeleteReceipt} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-400">No receipt</span>
            )}
            {onDelete && (
              <button onClick={() => onDelete(transaction.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      {receiptUrl && (
        <div className="mt-3">
          <img src={receiptUrl} className="max-w-full h-36 object-contain rounded-md border" alt="receipt" />
        </div>
      )}
    </div>
  );
}