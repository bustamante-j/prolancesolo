import { Task } from '@/types/task';

/**
 * Sort tasks by manual order first, then by priority score
 * Tasks with manual order take precedence over automatic sorting
 */
export const sortTasksByOrder = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // If both have manual order, sort by order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }

    // If only one has manual order, it comes first
    if (a.order !== undefined && b.order === undefined) {
      return -1;
    }
    if (a.order === undefined && b.order !== undefined) {
      return 1;
    }

    // If neither has manual order, sort by priority score (descending)
    return b.priorityScore - a.priorityScore;
  });
};

/**
 * Update task orders after drag and drop
 * Assigns sequential order numbers starting from 0
 */
export const updateTaskOrders = (tasks: Task[]): Task[] => {
  return tasks.map((task, index) => ({
    ...task,
    order: index,
  }));
};

/**
 * Check if tasks have manual ordering
 */
export const hasManualOrdering = (tasks: Task[]): boolean => {
  return tasks.some(task => task.order !== undefined);
};

/**
 * Clear manual ordering (reset to automatic sorting)
 */
export const clearManualOrdering = (tasks: Task[]): Task[] => {
  return tasks.map(task => ({
    ...task,
    order: undefined,
  }));
};