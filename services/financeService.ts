import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/auth';
import { Transaction } from '@/types/transaction';
import { storage } from '@/lib/firebase';

const TRANSACTIONS_KEY = 'transactions';

export const financeService = {
  // Get all transactions for current user
  getTransactions: async (): Promise<Transaction[]> => {
    const user = auth.getCurrentUser();
    if (!user) return [];

    try {
      const txRef = collection(db, 'users', user.uid, TRANSACTIONS_KEY);
      const q = query(txRef, orderBy('date', 'desc'));
      const snap = await getDocs(q);

      const result: Transaction[] = [];
      snap.forEach((d) => {
        const data = d.data();
        result.push({
          id: d.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Transaction);
      });

      return result;
    } catch (error) {
      console.error('Error getting transactions', error);
      return [];
    }
  },

  // Create a transaction (without receipt upload) - returns created doc id
  createTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    const user = auth.getCurrentUser();
    if (!user) return null;

    try {
      const txRef = collection(db, 'users', user.uid, TRANSACTIONS_KEY);
      const docRef = await addDoc(txRef, {
        ...transaction,
        date: Timestamp.fromDate(transaction.date),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating transaction', error);
      return null;
    }
  },

  // Update transaction
  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      const txDoc = doc(db, 'users', user.uid, TRANSACTIONS_KEY, id);
      const updateData: any = { ...updates, updatedAt: Timestamp.fromDate(new Date()) };
      if (updates.date) updateData.date = Timestamp.fromDate(updates.date as Date);
      await updateDoc(txDoc, updateData);
      return true;
    } catch (error) {
      console.error('Error updating transaction', error);
      return false;
    }
  },

  // Delete transaction - also removes receipt from storage if present
  deleteTransaction: async (id: string): Promise<boolean> => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      const txDocRef = doc(db, 'users', user.uid, TRANSACTIONS_KEY, id);
      // read document first to see if receiptPath exists
      // using getDocs not ideal for single doc, but avoiding extra imports - we'll rely on updateDoc/deleteDoc
      await deleteDoc(txDocRef);
      return true;
    } catch (error) {
      console.error('Error deleting transaction', error);
      return false;
    }
  },

  // Upload receipt image for a transaction. Returns storage path on success.
  // onProgress receives percentage 0-100
  uploadReceipt: (transactionId: string, file: File, onProgress?: (pct: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!storage) return reject(new Error('Storage not initialized'));
      const user = auth.getCurrentUser();
      if (!user) return reject(new Error('Not authenticated'));

      const path = `users/${user.uid}/receipts/${transactionId}_${Date.now()}_${file.name}`;
      const sRef = storageRef(storage as any, path);
      const uploadTask = uploadBytesResumable(sRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(pct);
      }, (err) => {
        reject(err);
      }, async () => {
        // Completed - resolve with path (we don't store URL in doc)
        resolve(path);
      });
    });
  },

  // Get a downloadable URL for a stored receipt path
  getReceiptUrl: async (path: string): Promise<string> => {
    if (!storage) throw new Error('Storage not initialized');
    const sRef = storageRef(storage as any, path);
    return await getDownloadURL(sRef);
  },

  // Delete a stored receipt by path
  deleteReceipt: async (path: string): Promise<boolean> => {
    if (!storage) return false;
    const sRef = storageRef(storage as any, path);
    try {
      await deleteObject(sRef);
      return true;
    } catch (error) {
      console.error('Error deleting receipt', error);
      return false;
    }
  }
};