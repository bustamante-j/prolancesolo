import { Task } from '@/types/task';
import { Client } from '@/types/client';
import { differenceInDays, isAfter } from 'date-fns';

export const calculatePriorityScore = (task: Task, client: Client | undefined): number => {
  const now = new Date();
  const daysRemaining = differenceInDays(task.deadline, now);
  const urgency = daysRemaining < 0 ? 10 : Math.max(0, 10 - daysRemaining); // higher if overdue or close
  const priceWeight = task.price / 1000; // normalize
  const clientImportance = client ? client.importance * 2 : 0; // weighted multiplier
  return (urgency * 3) + priceWeight + clientImportance - daysRemaining;
};

export const formatCurrency = (amount: number): string => {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getDeadlineRisk = (deadline: Date): 'green' | 'yellow' | 'red' => {
  const days = differenceInDays(deadline, new Date());
  if (days > 7) return 'green';
  if (days >= 3) return 'yellow';
  return 'red';
};

export const calculateDailyHours = (tasks: Task[]): number => {
  const today = new Date().toDateString();
  return tasks
    .filter(task => task.status === 'done' && new Date(task.updatedAt).toDateString() === today)
    .reduce((sum, task) => sum + task.actualHours, 0);
};

export const sortTasksByPriority = (tasks: Task[], clients: Client[]): Task[] => {
  return tasks.sort((a, b) => {
    const clientA = clients.find(c => c.id === a.clientId);
    const clientB = clients.find(c => c.id === b.clientId);
    const scoreA = calculatePriorityScore(a, clientA);
    const scoreB = calculatePriorityScore(b, clientB);
    return scoreB - scoreA; // higher first
  });
};