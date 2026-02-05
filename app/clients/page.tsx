'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientService } from '@/services/clientService';
import { auth } from '@/lib/auth';
import { Client } from '@/types/client';
import ClientCard from '@/components/ClientCard';
import { Plus, Edit, Save, X } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    notes: string;
    importance: number;
    paymentBehavior: 'excellent' | 'good' | 'average' | 'poor';
  }>({
    name: '',
    notes: '',
    importance: 3,
    paymentBehavior: 'average',
  });
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    };

    loadData();
  }, [router]);

  const resetForm = () => {
    setFormData({
      name: '',
      notes: '',
      importance: 3,
      paymentBehavior: 'average',
    });
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingClient(null);
    resetForm();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowAddForm(true);
    setFormData({
      name: client.name,
      notes: client.notes,
      importance: client.importance,
      paymentBehavior: client.paymentBehavior,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      await clientService.updateClient(editingClient.id, formData);
    } else {
      await clientService.createClient(formData);
    }
    const clientsData = await clientService.getClients();
    setClients(clientsData);
    setShowAddForm(false);
    resetForm();
    setEditingClient(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    resetForm();
    setEditingClient(null);
  };

  if (!auth.isAuthenticated()) return null;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-0 py-3">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Clients</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {editingClient ? 'Edit Client' : 'Add Client'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="importance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Importance (1-5)
                </label>
                <input
                  type="number"
                  id="importance"
                  min="1"
                  max="5"
                  value={formData.importance}
                  onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) || 3 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="paymentBehavior" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Behavior
                </label>
                <select
                  id="paymentBehavior"
                  value={formData.paymentBehavior}
                  onChange={(e) => setFormData({ ...formData, paymentBehavior: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{editingClient ? 'Update' : 'Create'} Client</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={handleEdit}
          />
        ))}
        {clients.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No clients yet</p>
            <button
              onClick={handleAdd}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              Add your first client →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}