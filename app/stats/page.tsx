'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/taskService';
import { auth } from '@/lib/auth';
import { formatCurrency } from '@/lib/calculations';
import { Task } from '@/types/task';
import Charts from '@/components/Charts';
import ExportButton from '@/components/ExportButton';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
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
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 px-6 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-6 mb-8">
          <ExportButton tasks={tasks} />
        </div>

        {/* Income Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Expected Income</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(expectedIncome)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Paid</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(paidIncome)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Unpaid</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(unpaidIncome)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-50/50 dark:from-indigo-900/20 dark:to-indigo-900/10">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Today</h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(todayIncome)}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Weekly Income</h3>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(weeklyIncome)}</p>
          </Card>
          <Card className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Income</h3>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(monthlyIncome)}</p>
          </Card>
        </div>

        {/* Charts */}
        <Charts data={chartData} />
      </div>
    </div>
  );
}