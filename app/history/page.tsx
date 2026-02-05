'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import { clientService } from '@/services/clientService';
import { auth } from '@/lib/auth';
import { Task } from '@/types/task';
import { Client } from '@/types/client';
import { format } from 'date-fns';
import { Trash2, History, CheckCircle, XCircle, Clock, User, Calendar, EyeOff, Eye } from 'lucide-react';
import StatusDropdown from '@/components/ui/StatusDropdown';

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
    <div className="min-h-screen max-w-7xl mx-auto px-0 py-3 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <History className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Task History</h1>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative group"
                >
                  {/* Action button */}
                  {task.hidden ? (
                    <>
                      <button
                        onClick={() => handleToggleHidden(task.id)}
                        className="absolute top-4 right-12 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
                        title="Restore task"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(task.id)}
                        className="absolute top-4 right-4 text-red-600 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleHidden(task.id)}
                        className="absolute top-4 right-12 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                        title="Hide task"
                      >
                        <EyeOff className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(task.id)}
                        className="absolute top-4 right-4 text-red-600 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Status indicator */}
                  <div className="flex items-center space-x-2 mb-4">
                    {task.status === 'done' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : task.status === 'in-progress' ? (
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                    ) : task.status === 'cancelled' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                    )}
                    <span className={`text-sm font-medium ${
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
                    {task.hidden && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </span>
                    )}
                  </div>

                  {/* Task title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {task.title}
                  </h3>

                  {/* Task details */}
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{task.clientId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">₱</span>
                      <span>{task.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{task.actualHours}h worked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {format(task.updatedAt, 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  {/* Status change buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <StatusDropdown current={task.status as any} onChange={(s) => handleStatusChange(task.id, s)} />
                  </div>

                  {/* Payment status */}
                  {task.status === 'done' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.paid
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {task.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar placeholder */}
          <div className="space-y-6 lg:col-span-3">
            {/* Could add summary stats or other content here */}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No completed tasks yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Your completed and cancelled tasks will appear here.
          </p>
        </div>
      )}
    </div>
  );
}