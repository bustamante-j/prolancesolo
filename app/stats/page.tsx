'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import { auth } from '@/lib/auth';
import { formatCurrency } from '@/lib/calculations';
import { Task } from '@/types/task';
import Charts from '@/components/Charts';
import ExportButton from '@/components/ExportButton';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function StatsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    };

    loadData();
  }, [router]);

  if (!auth.isAuthenticated()) return null;

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const calculateIncome = (filterFn: (task: Task) => boolean) => {
    return tasks.filter(filterFn).reduce((sum, task) => sum + task.price, 0);
  };

  const expectedIncome = calculateIncome(() => true);
  const paidIncome = calculateIncome(task => task.paid);
  const unpaidIncome = expectedIncome - paidIncome;
  const todayIncome = calculateIncome(task => task.updatedAt.toDateString() === now.toDateString() && task.paid);
  const weeklyIncome = calculateIncome(task =>
    isWithinInterval(task.updatedAt, { start: weekStart, end: weekEnd }) && task.paid
  );
  const monthlyIncome = calculateIncome(task =>
    isWithinInterval(task.updatedAt, { start: monthStart, end: monthEnd }) && task.paid
  );

  // Mock chart data - in real app, calculate from actual data
  const chartData = {
    earnings: [
      { week: 'Week 1', amount: 15000 },
      { week: 'Week 2', amount: 22000 },
      { week: 'Week 3', amount: 18000 },
      { week: 'Week 4', amount: 25000 },
    ],
    hours: [
      { week: 'Week 1', hours: 35 },
      { week: 'Week 2', hours: 42 },
      { week: 'Week 3', hours: 38 },
      { week: 'Week 4', hours: 45 },
    ],
    tasks: [
      { week: 'Week 1', count: 3 },
      { week: 'Week 2', count: 4 },
      { week: 'Week 3', count: 3 },
      { week: 'Week 4', count: 5 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-0 py-3">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Statistics</h1>
        <ExportButton tasks={tasks} />
      </div>

      {/* Income Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Expected Income</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(expectedIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Paid</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(paidIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unpaid</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(unpaidIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Today</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(todayIncome)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Weekly Income</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(weeklyIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Monthly Income</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(monthlyIncome)}</p>
        </div>
      </div>

      {/* Charts */}
      <Charts data={chartData} />
    </div>
  );
}