export interface Task {
  id: string;
  title: string;
  description: string;
  clientId: string;
  price: number; // in pesos
  deadline: Date;
  estimatedHours: number;
  actualHours: number;
  notes: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  paid: boolean;
  priorityScore: number;
  order?: number; // manual ordering (optional, for drag & drop)
  hidden?: boolean; // hidden flag for soft delete
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  estimatedHours: number;
  notes: string;
}