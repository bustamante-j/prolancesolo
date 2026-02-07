"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import { clientService } from '@/services/clientService';
import { auth } from '@/lib/auth';
import { Task } from '@/types/task';
import { Client } from '@/types/client';
import { format } from 'date-fns';
import { Trash2, History, CheckCircle, XCircle, Clock, User, Calendar, EyeOff, Eye, Circle } from 'lucide-react';
import StatusDropdown from '@/components/ui/StatusDropdown';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      const tasksData = await taskService.getTasks();
      const clientsData = await clientService.getClients();
      // Show all tasks in history, including hidden ones
      setTasks(tasksData);
      setClients(clientsData);
    };

    loadData();
  }, [router]);

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await taskService.updateTask(taskId, { status: newStatus });
    const tasksData = await taskService.getTasks();
    setTasks(tasksData);
  };

  const handleToggleHidden = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newHiddenState = !task.hidden;
    const message = newHiddenState ? 'hide this task?' : 'restore this task?';

    if (confirm(`Are you sure you want to ${message}`)) {
      await taskService.updateTask(taskId, { hidden: newHiddenState });
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    }
  };

  // Permanently delete a previous project/task
  const handleDeleteProject = async (taskId: string) => {
    if (!confirm('Permanently delete this project? This cannot be undone.')) return;
    await taskService.deleteTask(taskId);
    const tasksData = await taskService.getTasks();
    setTasks(tasksData);
  };

  if (!auth.isAuthenticated()) return null;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 px-6 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">


        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="relative group hover:shadow-lg transition-shadow">
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleHidden(task.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    title={task.hidden ? 'Restore' : 'Hide'}
                  >
                    {task.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteProject(task.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status indicator and Paid/Unpaid dropdown */}
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    {task.status === 'done' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : task.status === 'in-progress' ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    ) : task.status === 'cancelled' ? (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${
                    task.status === 'done'
                      ? 'text-green-600 dark:text-green-400'
                      : task.status === 'in-progress'
                      ? 'text-blue-600 dark:text-blue-400'
                      : task.status === 'cancelled'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {task.status === 'done' ? 'Completed' : 
                     task.status === 'in-progress' ? 'In Progress' :
                     task.status === 'cancelled' ? 'Cancelled' : 'Todo'}
                  </span>
                  <StatusDropdown current={task.status} onChange={(newStatus) => handleStatusChange(task.id, newStatus)} />
                  <div className="relative ml-auto">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        taskService.updateTask(task.id, { paid: !task.paid }).then(() => {
                          const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, paid: !t.paid } : t);
                          setTasks(updatedTasks);
                        });
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        task.paid
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                      title="Click to toggle paid/unpaid"
                    >
                      {task.paid ? 'Paid' : 'Unpaid'}
                    </button>
                  </div>
                  {task.hidden && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Task title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {task.title}
                </h3>

                {/* Task details */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{task.clientId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₱</span>
                    <span>{task.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{task.actualHours}h worked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(task.deadline, 'MMM dd')}</span>
                  </div>
                </div>

                {task.paid && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      ✓ Paid
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No tasks yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Your task history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
