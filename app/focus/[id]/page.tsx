'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import { auth } from '@/lib/auth';
import { Task } from '@/types/task';
import Timer from '@/components/Timer';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function FocusPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadTask = async () => {
      const taskData = await taskService.getTask(params.id as string);
      if (!taskData) {
        router.push('/tasks');
        return;
      }
      setTask(taskData);
    };

    loadTask();
  }, [params.id, router]);

  const handleTimeUpdate = async (hours: number) => {
    if (task) {
      const newActualHours = task.actualHours + hours;
      await taskService.updateTask(task.id, { actualHours: newActualHours });
      setTask({ ...task, actualHours: newActualHours });
    }
  };

  const handleComplete = async () => {
    if (task) {
      await taskService.updateTask(task.id, { status: 'done', paid: true }); // assume paid when completed
      router.push('/tasks');
    }
  };

  if (!auth.isAuthenticated() || !task) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <button
              onClick={() => router.push('/tasks')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Tasks</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Focus Mode
            </h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-400">
              {task.title}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {task.notes || 'No notes provided.'}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <Timer onTimeUpdate={handleTimeUpdate} initialHours={task.actualHours} />

            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Mark as Complete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}