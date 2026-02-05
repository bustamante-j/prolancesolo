import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/auth';
import { Client } from '@/types/client';
import { storage } from '@/lib/storage';
import { mockClients } from '@/lib/mockData';

const CLIENTS_KEY = 'prolance_clients';

export const clientService = {
  getClients: async (): Promise<Client[]> => {
    const user = auth.getCurrentUser();
    if (!user) return [];

    try {
      const clientsRef = collection(db, 'users', user.uid, 'clients');
      const q = query(clientsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const clients: Client[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        clients.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Client);
      });

      return clients;
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
    }
  },

  getClient: async (id: string): Promise<Client | undefined> => {
    const user = auth.getCurrentUser();
    if (!user) return undefined;

    try {
      const clientDoc = await getDocs(query(collection(db, 'users', user.uid, 'clients'), where('__name__', '==', id)));
      if (!clientDoc.empty) {
        const doc = clientDoc.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Client;
      }
    } catch (error) {
      console.error('Error getting client:', error);
    }
    return undefined;
  },

  createClient: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    const user = auth.getCurrentUser();
    if (!user) return null;

    try {
      const clientsRef = collection(db, 'users', user.uid, 'clients');
      const docRef = await addDoc(clientsRef, {
        ...client,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      return {
        id: docRef.id,
        ...client,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  },

  updateClient: async (id: string, updates: Partial<Client>): Promise<Client | null> => {
    const user = auth.getCurrentUser();
    if (!user) return null;

    try {
      const clientRef = doc(db, 'users', user.uid, 'clients', id);
      await updateDoc(clientRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      return await clientService.getClient(id) || null;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  deleteClient: async (id: string): Promise<boolean> => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'clients', id));
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  },
};