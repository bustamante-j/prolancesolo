import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBaRddzJMuVam8M_EaWUrFZPgBSZ0ZK4Ss",
  authDomain: "prolancesolo.firebaseapp.com",
  projectId: "prolancesolo",
  storageBucket: "prolancesolo.firebasestorage.app",
  messagingSenderId: "830178260334",
  appId: "1:830178260334:web:1b9f7e0016ab630f3dfd7f",
  measurementId: "G-N0E32YJDLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Cloud Storage (used for receipt uploads)
import { getStorage } from 'firebase/storage';
const storage = typeof window !== 'undefined' ? getStorage(app) : undefined;

export { analytics, storage };