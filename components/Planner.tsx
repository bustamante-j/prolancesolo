'use client';

// Compact planner component showing today's top 5 prioritized tasks
// Displays tasks sorted by priority with estimated hours and pricing

import { Task } from '@/types/task';
import { Client } from '@/types/client';
import { sortTasksByPriority } from '@/lib/calculations';
import TaskCard from './TaskCard';

interface PlannerProps {
  tasks: Task[];
  clients: Client[];
}

export default function Planner({ tasks, clients }: PlannerProps) {
  // Sort tasks by priority and filter to show only top 5 incomplete tasks
  const sortedTasks = sortTasksByPriority(tasks, clients);
  const todayTasks = sortedTasks.filter(task => task.status !== 'done').slice(0, 5); // top 5

  return (
    // Planner container with subtle background
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* Section header */}
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Today's Plan
      </h2>
      {todayTasks.length === 0 ? (
        // Empty state when no tasks are available
        <p className="text-xs text-gray-500 dark:text-gray-400">No tasks planned.</p>
      ) : (
        // List of prioritized tasks with numbering
        <div className="space-y-2">
          {todayTasks.map((task, index) => (
            <div key={task.id} className="flex items-start space-x-3">
              {/* Priority number indicator */}
              <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  {index + 1}
                </span>
              </div>
              {/* Task details */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {task.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {task.estimatedHours}h • ₱{task.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}