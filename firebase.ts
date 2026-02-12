
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAAm1IfrQsWtHJ6ArHSA4G4hmJxppD8rbA",
  authDomain: "carwo-pos.firebaseapp.com",
  projectId: "carwo-pos",
  storageBucket: "carwo-pos.firebasestorage.app",
  messagingSenderId: "623570482980",
  appId: "1:623570482980:web:25e830118188a29d9e65b1",
  measurementId: "G-QYHSXQGTM5"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence enabled
// This prevents "Could not reach Cloud Firestore backend" errors from breaking the app
// by serving data from the local IndexedDB cache when the network is unstable.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
