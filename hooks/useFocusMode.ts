// Custom hook for managing focus mode functionality
// Allows focusing on a single task to reduce distractions and improve productivity

import { useState, useMemo } from 'react';
import { Task } from '@/types/task';

export function useFocusMode(tasks: Task[]) {
  // State for the currently focused task ID (null means no focus mode)
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  // Computed boolean indicating if focus mode is active
  const isFocusMode = focusedTaskId !== null;

  // Memoized filtered tasks - returns single focused task or all tasks
  const filteredTasks = useMemo(() => {
    if (!isFocusMode) return tasks;
    const focusedTask = tasks.find(task => task.id === focusedTaskId);
    return focusedTask ? [focusedTask] : [];
  }, [tasks, focusedTaskId, isFocusMode]);

  // Toggle focus mode for a specific task or exit focus mode
  const toggleFocusMode = (taskId?: string) => {
    if (isFocusMode && focusedTaskId === taskId) {
      // If clicking the same task that's already focused, exit focus mode
      setFocusedTaskId(null);
    } else if (taskId) {
      // Enter focus mode with the specified task
      setFocusedTaskId(taskId);
    } else {
      // Exit focus mode
      setFocusedTaskId(null);
    }
  };

  // Explicitly exit focus mode
  const exitFocusMode = () => {
    setFocusedTaskId(null);
  };

  // Return hook interface
  return {
    isFocusMode,
    focusedTaskId,
    filteredTasks,
    toggleFocusMode,
    exitFocusMode
  };
}