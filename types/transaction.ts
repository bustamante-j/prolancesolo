export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  clientId?: string;
  taskId?: string;
  description?: string;
  tax?: number;
  paid?: boolean;
  receiptPath?: string | null; // storage path, download URL not stored
  createdAt: Date;
  updatedAt: Date;
}