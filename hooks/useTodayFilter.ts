// Custom hook for filtering tasks to show only today's tasks
// Provides toggle functionality and counts for today's tasks

import { useState, useMemo } from 'react';
import { Task } from '@/types/task';
import { isToday } from 'date-fns';

export const useTodayFilter = (tasks: Task[]) => {
  // State for whether to show only today's tasks
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  // Memoized filtered tasks - returns all tasks or only today's tasks
  const filteredTasks = useMemo(() => {
    if (!showTodayOnly) {
      return tasks;
    }

    return tasks.filter(task => isToday(task.deadline));
  }, [tasks, showTodayOnly]);

  // Memoized count of tasks due today
  const todayCount = useMemo(() => {
    return tasks.filter(task => isToday(task.deadline)).length;
  }, [tasks]);

  // Toggle function to switch between showing all tasks and today's tasks only
  const toggleTodayFilter = () => {
    setShowTodayOnly(!showTodayOnly);
  };

  // Return hook interface
  return {
    showTodayOnly,
    filteredTasks,
    todayCount,
    toggleTodayFilter,
  };
};