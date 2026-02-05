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
    <div className=" min-h-screen max-w-7xl mx-auto px-0 py-3">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add Task</h1>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
        >
          Use Template
        </button>
      </div>

      {showTemplates && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Task Templates</h2>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.title}</p>
              </button>
            ))}
            {templates.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No templates available. Templates will be saved here when you create them later.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client
            </label>
            <Select id="clientId" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (₱)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Hours
            </label>
            <input
              type="number"
              id="estimatedHours"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Create Task</span>
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}