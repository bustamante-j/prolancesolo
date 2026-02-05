export interface Client {
  id: string;
  name: string;
  notes: string;
  importance: number; // 1-5
  paymentBehavior: 'excellent' | 'good' | 'average' | 'poor';
  createdAt: Date;
  updatedAt: Date;
}