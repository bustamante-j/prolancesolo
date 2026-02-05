import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth as firebaseAuth } from './firebase';
import { User } from '@/types/user';

export const auth = {
  register: async (email: string, password: string): Promise<boolean> => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  login: async (email: string, password: string): Promise<FirebaseUser | null> => {
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: (): FirebaseUser | null => {
    return firebaseAuth.currentUser;
  },

  isAuthenticated: (): boolean => {
    return !!firebaseAuth.currentUser;
  },

  onAuthStateChange: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(firebaseAuth, callback);
  },
};