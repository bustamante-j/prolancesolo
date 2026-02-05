import { Task, TaskTemplate } from '@/types/task';
import { Client } from '@/types/client';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign company website with modern UI',
    clientId: '1',
    price: 50000,
    deadline: new Date('2026-02-15'),
    estimatedHours: 40,
    actualHours: 35,
    notes: 'Use React and Tailwind',
    status: 'in-progress',
    paid: false,
    priorityScore: 0,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Build iOS and Android app',
    clientId: '2',
    price: 100000,
    deadline: new Date('2026-03-01'),
    estimatedHours: 80,
    actualHours: 0,
    notes: 'React Native',
    status: 'todo',
    paid: false,
    priorityScore: 0,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    notes: 'Large client, pays on time',
    importance: 5,
    paymentBehavior: 'excellent',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '2',
    name: 'StartupXYZ',
    notes: 'New client, growing fast',
    importance: 3,
    paymentBehavior: 'good',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
];

export const mockTemplates: TaskTemplate[] = [
  {
    id: '1',
    name: 'Web Development',
    title: 'Website Development',
    description: 'Full-stack web development project',
    estimatedHours: 50,
    notes: 'Includes frontend and backend',
  },
];