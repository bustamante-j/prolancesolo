// Task service for Firebase operations
// Handles CRUD operations for tasks and task templates with priority score calculations
// All operations are scoped to the current authenticated user

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/auth';
import { Task, TaskTemplate } from '@/types/task';
import { calculatePriorityScore } from '@/lib/calculations';
import { clientService } from './clientService';

// Collection keys for Firestore
const TASKS_KEY = 'prolance_tasks';
const TEMPLATES_KEY = 'prolance_templates';

export const taskService = {
  // Retrieve all tasks for the current user, ordered by creation date (newest first)
  // Calculates priority scores for each task based on client data
  getTasks: async (): Promise<Task[]> => {
    const user = auth.getCurrentUser();
    if (!user) return [];

    try {
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const q = query(tasksRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          ...data,
          deadline: data.deadline.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Task);
      });

      // Calculate priority scores
      const clients = await clientService.getClients();
      return tasks.map(task => ({
        ...task,
        priorityScore: calculatePriorityScore(task, clients.find(c => c.id === task.clientId)),
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  // Retrieve a single task by ID
  getTask: async (id: string): Promise<Task | undefined> => {
    const user = auth.getCurrentUser();
    if (!user) return undefined;

    try {
      const taskDoc = await getDocs(query(collection(db, 'users', user.uid, 'tasks'), where('__name__', '==', id)));
      if (!taskDoc.empty) {
        const doc = taskDoc.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          deadline: data.deadline.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Task;
      }
    } catch (error) {
      console.error('Error getting task:', error);
    }
    return undefined;
  },

  // Create a new task with automatic timestamps and priority score calculation
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'priorityScore'>): Promise<Task | null> => {
    const user = auth.getCurrentUser();
    if (!user) return null;

    try {
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const docRef = await addDoc(tasksRef, {
        ...task,
        deadline: Timestamp.fromDate(task.deadline),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      const newTask: Task = {
        id: docRef.id,
        ...task,
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityScore: 0,
      };

      // Calculate priority score
      const clients = await clientService.getClients();
      newTask.priorityScore = calculatePriorityScore(newTask, clients.find(c => c.id === newTask.clientId));

      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  // Update an existing task with partial data
  // Automatically updates the updatedAt timestamp and recalculates priority score
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task | null> => {
    const user = auth.getCurrentUser();
    if (!user) return null;

    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', id);
      const updateData: any = { ...updates, updatedAt: Timestamp.fromDate(new Date()) };

      if (updates.deadline) {
        updateData.deadline = Timestamp.fromDate(updates.deadline);
      }

      await updateDoc(taskRef, updateData);

      // Get updated task
      const updatedTask = await taskService.getTask(id);
      if (updatedTask) {
        // Recalculate priority score
        const clients = await clientService.getClients();
        updatedTask.priorityScore = calculatePriorityScore(updatedTask, clients.find(c => c.id === updatedTask.clientId));
      }

      return updatedTask || null;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  // Hide a task (soft delete) by setting the hidden flag
  hideTask: async (id: string): Promise<boolean> => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', id), {
        hidden: true,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error hiding task:', error);
      return false;
    }
  },

  // Permanently delete a task and its associated data
  deleteTask: async (id: string): Promise<boolean> => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  // Retrieve all task templates for the current user, ordered alphabetically by name
  getTemplates: async (): Promise<TaskTemplate[]> => {
    const user = auth.getCurrentUser();
    if (!user) return [];

    try {
      const templatesRef = collection(db, 'users', user.uid, 'templates');
      const q = query(templatesRef, orderBy('name'));
      const querySnapshot = await getDocs(q);

      const templates: TaskTemplate[] = [];
      querySnapshot.forEach((doc) => {
        templates.push({
          id: doc.id,
          ...doc.data(),
        } as TaskTemplate);
      });

      return templates;
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  },

  // Create a new task template
  createTemplate: async (template: Omit<TaskTemplate, 'id'>): Promise<TaskTemplate | null> => {
    const user = auth.getCurrentUser();
    if (!user) return null;

    try {
      const templatesRef = collection(db, 'users', user.uid, 'templates');
      const docRef = await addDoc(templatesRef, template);

      return {
        id: docRef.id,
        ...template,
      };
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  },

  // Delete a task template by ID
  deleteTemplate: async (id: string): Promise<boolean> => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'templates', id));
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  },

  // Subtask operations (stored under users/{uid}/tasks/{taskId}/subtasks)
  getSubtasks: async (taskId: string) => {
    const user = auth.getCurrentUser();
    if (!user) return [];

    try {
      const subtasksRef = collection(db, 'users', user.uid, 'tasks', taskId, 'subtasks');
      const q = query(subtasksRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const subs: any[] = [];
      snap.forEach(d => {
        const data = d.data();
        subs.push({ id: d.id, ...data, createdAt: data.createdAt.toDate(), updatedAt: data.updatedAt.toDate() });
      });
      return subs;
    } catch (error) {
      console.error('Error getting subtasks', error);
      return [];
    }
  },

  addSubtask: async (taskId: string, text: string) => {
    const user = auth.getCurrentUser();
    if (!user) return null;

    try {
      const subtasksRef = collection(db, 'users', user.uid, 'tasks', taskId, 'subtasks');
      const docRef = await addDoc(subtasksRef, {
        text,
        completed: false,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });
      return { id: docRef.id };
    } catch (error) {
      console.error('Error creating subtask', error);
      return null;
    }
  },

  updateSubtask: async (taskId: string, subtaskId: string, updates: Partial<any>) => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      const subRef = doc(db, 'users', user.uid, 'tasks', taskId, 'subtasks', subtaskId);
      const updateData: any = { ...updates, updatedAt: Timestamp.fromDate(new Date()) };
      await updateDoc(subRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating subtask', error);
      return false;
    }
  },

  deleteSubtask: async (taskId: string, subtaskId: string) => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId, 'subtasks', subtaskId));
      return true;
    } catch (error) {
      console.error('Error deleting subtask', error);
      return false;
    }
  }
};