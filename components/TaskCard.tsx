'use client';

import { Task } from '@/types/task';
import { Client } from '@/types/client';
import { formatCurrency, getDeadlineRisk } from '@/lib/calculations';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, User } from 'lucide-react';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
  client?: Client;
}

export default function TaskCard({ task, client }: TaskCardProps) {
  const risk = getDeadlineRisk(task.deadline);
  const riskColor = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }[risk];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColor}`}>
          {risk === 'green' ? 'On Track' : risk === 'yellow' ? 'Due Soon' : 'Overdue'}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{task.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{client?.name || 'No Client'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(task.price)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {format(task.deadline, 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {task.actualHours}/{task.estimatedHours}h
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          task.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }`}>
          {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Done'}
        </span>
        {task.paid && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Paid
          </span>
        )}
      </div>

      <div className="mt-4">
        <Link
          href={`/focus/${task.id}`}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
        >
          Focus Mode →
        </Link>
      </div>
    </div>
  );
}