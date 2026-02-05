'use client';

import { useEffect, useState } from 'react';
import { financeService } from '@/services/financeService';
import { clientService } from '@/services/clientService';
import { taskService } from '@/services/taskService';
import { Client } from '@/types/client';
import { Task } from '@/types/task';
import { Transaction } from '@/types/transaction';
import TransactionCard from '@/components/Finance/TransactionCard';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Select from '@/components/ui/Select';

export default function FinancePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    amount: 0,
    type: 'expense' as 'expense' | 'income',
    category: '',
    clientId: '',
    taskId: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const clientsData = await clientService.getClients();
      const tasksData = await taskService.getTasks();
      const tx = await financeService.getTransactions();
      setClients(clientsData);
      setTasks(tasksData);
      setTransactions(tx);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const refresh = async () => {
    const tx = await financeService.getTransactions();
    setTransactions(tx);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) { setFile(null); return; }
    // Validate type and size
    if (!f.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB');
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const txToCreate = {
      date: new Date(form.date),
      amount: Number(form.amount),
      type: form.type,
      category: form.category || undefined,
      clientId: form.clientId || undefined,
      taskId: form.taskId || undefined,
      description: form.description || undefined,
      tax: undefined,
      paid: false,
      receiptPath: null,
    } as any;

    const id = await financeService.createTransaction(txToCreate);
    if (!id) { alert('Error creating transaction'); return; }

    if (file) {
      setUploadProgress(0);
      try {
        const path = await financeService.uploadReceipt(id, file, (pct) => setUploadProgress(pct));
        await financeService.updateTransaction(id, { receiptPath: path });
      } catch (err) {
        console.error(err);
        alert('Receipt upload failed');
      } finally {
        setUploadProgress(0);
        setFile(null);
      }
    }

    // Reset form and refresh list
    setForm({ date: new Date().toISOString().slice(0,10), amount: 0, type: 'expense', category: '', clientId: '', taskId: '', description: '' });
    await refresh();
  };

  const handleDeleteTx = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    await financeService.deleteTransaction(id);
    await refresh();
  };

  const incomeTotal = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  if (!auth.isAuthenticated()) return null;

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Finance</h1>
        <div className="space-x-4 text-right">
          <div className="text-sm text-gray-500">Income <span className="font-semibold">₱ {incomeTotal.toLocaleString()}</span></div>
          <div className="text-sm text-gray-500">Expenses <span className="font-semibold">₱ {expenseTotal.toLocaleString()}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4">New Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 rounded-lg mt-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Amount</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg mt-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Type</label>
              <Select value={form.type} onChange={(e) => setForm({...form, type: e.target.value as any})} className="mt-1">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 rounded-lg mt-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Client</label>
              <Select value={form.clientId} onChange={(e) => setForm({...form, clientId: e.target.value})} className="mt-1">
                <option value="">(none)</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Task</label>
              <Select value={form.taskId} onChange={(e) => setForm({...form, taskId: e.target.value})} className="mt-1">
                <option value="">(none)</option>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg mt-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Receipt (image only, max 5MB)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mt-2 text-sm text-gray-600 dark:text-gray-300" />
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded mt-2 h-3 overflow-hidden">
                  <div className="bg-indigo-600 h-3 rounded" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
            <div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition">Add Transaction</button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          {loading ? <div>Loading...</div> : (
            <div className="space-y-4">
              {transactions.map(tx => (
                <TransactionCard key={tx.id} transaction={tx} onDelete={handleDeleteTx} onUpdate={async (id, updates) => { await financeService.updateTransaction(id, updates); await refresh(); }} />
              ))}
              {transactions.length === 0 && <div className="text-gray-500">No transactions yet.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}