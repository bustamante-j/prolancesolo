'use client';

import { useEffect, useMemo, useState } from 'react';
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
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

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
    clientId: '',
    taskId: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

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
    if (previewUrl) {
      try { URL.revokeObjectURL(previewUrl); } catch {};
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const removeFile = () => {
    if (previewUrl) {
      try { URL.revokeObjectURL(previewUrl); } catch {}
    }
    setPreviewUrl(null);
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const txToCreate = {
      date: new Date(form.date),
      amount: Number(form.amount),
      type: form.type,
      clientId: form.clientId || undefined,
      taskId: form.taskId || undefined,
      description: form.description || undefined,
      tax: undefined,
      paid: false,
      receiptPath: null,
    } as any;

    const id = await financeService.createTransaction(txToCreate);
    if (!id) { alert('Error creating transaction — make sure you are logged in and Firestore is reachable'); return; }

    if (file) {
      setUploadProgress(0);
      try {
        const path = await financeService.uploadReceipt(id, file, (pct) => setUploadProgress(pct));
        await financeService.updateTransaction(id, { receiptPath: path });
      } catch (err: any) {
        console.error('Receipt upload error', err);
        alert('Receipt upload failed: ' + (err?.message || JSON.stringify(err)));
      } finally {
        setUploadProgress(0);
        removeFile();
      }
    }

    // Reset form and refresh list
    setForm({ date: new Date().toISOString().slice(0,10), amount: 0, type: 'expense', clientId: '', taskId: '', description: '' });
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" style={{marginTop: '-0.5rem'}}>
        <div className="lg:col-span-2">
        </div>
        <div className="flex items-center justify-end space-x-4">
          <div className="px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">Income</div>
            <div className="text-lg font-semibold">₱ {incomeTotal.toLocaleString()}</div>
          </div>
          <div className="px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">Expenses</div>
            <div className="text-lg font-semibold">₱ {expenseTotal.toLocaleString()}</div>
          </div>
          <div className="px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">Balance</div>
            <div className="text-lg font-semibold">₱ {(incomeTotal - expenseTotal).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">New Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Amount</label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: Number(e.target.value)})} className="mt-1" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Type</label>
              <Select value={form.type} onChange={(e) => setForm({...form, type: e.target.value as any})} className="mt-1">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
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
              <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="mt-1" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Receipt (image only, max 5MB)</label>
              <div className="mt-2 flex items-center space-x-3">
                <label className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700">
                  Upload
                  <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                </label>
                {previewUrl ? (
                  <div className="flex items-center space-x-2">
                    <img src={previewUrl} alt="preview" className="w-20 h-14 object-cover rounded border" />
                    <div className="flex flex-col">
                      <button type="button" onClick={removeFile} className="text-sm text-red-600 hover:underline">Remove</button>
                      {uploadProgress > 0 && (
                        <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded mt-2 h-2 overflow-hidden">
                          <div className="bg-indigo-600 h-2" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No file selected</div>
                )}
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">Add Transaction</Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
              <Button variant="ghost" onClick={refresh}>Refresh</Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            {loading ? <div>Loading...</div> : (
              <div className="space-y-3">
                {transactions.length === 0 && <div className="text-gray-500">No transactions yet.</div>}
                {transactions.map(tx => (
                  <TransactionCard key={tx.id} transaction={tx} onDelete={handleDeleteTx} onUpdate={async (id, updates) => { await financeService.updateTransaction(id, updates); await refresh(); }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}