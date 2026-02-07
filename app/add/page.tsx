'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import { clientService } from '@/services/clientService';
import { auth } from '@/lib/auth';
import { Task, TaskTemplate } from '@/types/task';
import { Client } from '@/types/client';
import { format } from 'date-fns';
import { Save, X } from 'lucide-react';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function AddTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [notes, setNotes] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      const clientsData = await clientService.getClients();
      const templatesData = await taskService.getTemplates();
      setClients(clientsData);
      setTemplates(templatesData);
    };

    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'priorityScore'> = {
      title,
      description,
      clientId,
      price: parseFloat(price) || 0,
      deadline: new Date(deadline),
      estimatedHours: parseFloat(estimatedHours) || 0,
      actualHours: 0,
      notes,
      status: 'todo',
      paid: false,
    };
    const newTask = await taskService.createTask(task);
    if (newTask) {
      router.push('/tasks');
    } else {
      alert('Failed to create task');
    }
  };

  const applyTemplate = (template: TaskTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setEstimatedHours(template.estimatedHours.toString());
    setNotes(template.notes);
    setShowTemplates(false);
  };

  if (!auth.isAuthenticated()) return null;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 px-6 md:px-8 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-sm"
          >
            📋 Use Template
          </button>
        </div>

        {showTemplates && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.title}</p>
                </button>
              ))}
              {templates.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                  No templates yet. Save tasks as templates for faster creation.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Task Title *
                </label>
                <Input
                  type="text"
                  id="title"
                  placeholder="e.g., Website redesign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Add details about this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="clientId" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Client
                  </label>
                  <Select id="clientId" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Price (₱)
                  </label>
                  <Input
                    type="number"
                    id="price"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Deadline *
                  </label>
                  <Input
                    type="date"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Estimated Hours
                  </label>
                  <Input
                    type="number"
                    id="estimatedHours"
                    placeholder="0"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    step="0.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="inline-flex items-center gap-2">
              <Save className="w-5 h-5" />
              Create Task
            </Button>
            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}