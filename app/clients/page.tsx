'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientService } from '@/services/clientService';
import { auth } from '@/lib/auth';
import { Client } from '@/types/client';
import ClientCard from '@/components/ClientCard';
import { Plus, Edit, Save, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

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
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 px-6 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-6 mb-8">
          <Button onClick={handleAdd} className="md:w-auto">
            <Plus className="w-5 h-5" />
            Add Client
          </Button>
        </div>

        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Client Name *
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter client name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this client..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="importance" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Importance Level (1-5)
                  </label>
                  <Input
                    type="number"
                    id="importance"
                    min="1"
                    max="5"
                    value={formData.importance}
                    onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) || 3 })}
                  />
                </div>

                <div>
                  <label htmlFor="paymentBehavior" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Payment Behavior
                  </label>
                  <Select id="paymentBehavior" value={formData.paymentBehavior} onChange={(e) => setFormData({ ...formData, paymentBehavior: e.target.value as any })}>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="submit" className="inline-flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {editingClient ? 'Update' : 'Create'} Client
                </Button>
                <Button variant="ghost" type="button" onClick={handleCancel}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No clients yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding your first client</p>
            <Button onClick={handleAdd}>Add Client</Button>
          </div>
        )}
      </div>
    </div>
  );
}