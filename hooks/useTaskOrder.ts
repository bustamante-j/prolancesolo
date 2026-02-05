// Custom hook for managing task ordering with drag-and-drop functionality
// Maintains task order state and provides methods for reordering, adding, updating, and removing tasks
// Integrates with @dnd-kit for drag-and-drop operations

import { useState, useCallback } from 'react';
import { Task } from '@/types/task';
import { sortTasksByOrder, updateTaskOrders } from '@/lib/orderUtils';

export const useTaskOrder = (initialTasks: Task[] = []) => {
  // State for maintaining ordered tasks, initialized with sorted tasks
  const [tasks, setTasks] = useState<Task[]>(() => sortTasksByOrder(initialTasks));

  // Update tasks and maintain sorting order
  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(sortTasksByOrder(newTasks));
  }, []);

  // Handle drag end event from @dnd-kit library
  // Reorders tasks based on drag-and-drop interaction
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;

    // Exit if no valid drop target or dropped on same item
    if (!over || active.id === over.id) {
      return;
    }

    setTasks((currentTasks) => {
      // Find indices of dragged and target items
      const oldIndex = currentTasks.findIndex((task) => task.id === active.id);
      const newIndex = currentTasks.findIndex((task) => task.id === over.id);

      // Exit if indices not found
      if (oldIndex === -1 || newIndex === -1) {
        return currentTasks;
      }

      // Perform array reordering
      const reorderedTasks = [...currentTasks];
      const [movedTask] = reorderedTasks.splice(oldIndex, 1);
      reorderedTasks.splice(newIndex, 0, movedTask);

      // Update order numbers for all tasks after reordering
      return updateTaskOrders(reorderedTasks);
    });
  }, []);

  // Add a new task with appropriate order number
  const addTask = useCallback((newTask: Task) => {
    setTasks((currentTasks) => {
      const updatedTasks = [...currentTasks, { ...newTask, order: currentTasks.length }];
      return sortTasksByOrder(updatedTasks);
    });
  }, []);

  // Update an existing task while maintaining order
  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return sortTasksByOrder(updatedTasks);
    });
  }, []);

  // Remove a task and reorder remaining tasks
  const removeTask = useCallback((taskId: string) => {
    setTasks((currentTasks) => {
      const filteredTasks = currentTasks.filter((task) => task.id !== taskId);
      // Reorder remaining tasks after removal
      return updateTaskOrders(filteredTasks);
    });
  }, []);

  // Clear manual ordering and reset to automatic sorting
  const clearOrdering = useCallback(() => {
    setTasks((currentTasks) => {
      const clearedTasks = currentTasks.map((task) => ({
        ...task,
        order: undefined,
      }));
      return sortTasksByOrder(clearedTasks);
    });
  }, []);

  // Return hook interface
  return {
    tasks,
    updateTasks,
    handleDragEnd,
    addTask,
    updateTask,
    removeTask,
    clearOrdering,
  };
};