
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, User, Category } from '../types';
import { db, auth } from '../firebase';
import { MOCK_PRODUCTS, MOCK_SALES_HISTORY, MOCK_USERS, MOCK_CATEGORIES } from '../constants';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  writeBatch,
  FirestoreError,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  users: User[];
  categories: Category[];
  currentUser: User | null;
  loading: boolean;
  error: FirestoreError | null;
  isDemoMode: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  login: (userId: string) => void;
  logout: () => void;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  refundSale: (saleId: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('carwo_pos_demo_active') === 'true';
  });

  // Handle Login
  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // 1. First check if user exists in our Firestore users collection (Added by Admin)
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const foundUser = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as User;
        if (foundUser.password === pass) {
          setCurrentUser(foundUser);
          localStorage.setItem('pos_current_user_email', email);
          setLoading(false);
          return;
        }
      }

      // 2. If not found in custom list, try Firebase Auth
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = async () => {
    if (!isDemoMode) {
      try {
        await signOut(auth);
      } catch (e) {}
    }
    setCurrentUser(null);
    localStorage.removeItem('pos_current_user_email');
  };

  const enterDemoMode = () => {
    localStorage.setItem('carwo_pos_demo_active', 'true');
    setIsDemoMode(true);
    setProducts(MOCK_PRODUCTS);
    setSales(MOCK_SALES_HISTORY.map(s => ({ ...s, status: 'Completed' })));
    setUsers(MOCK_USERS);
    setCategories(MOCK_CATEGORIES);
    setCurrentUser(MOCK_USERS[0]);
    setError(null);
    setLoading(false);
  };

  const exitDemoMode = () => {
    localStorage.removeItem('carwo_pos_demo_active');
    setIsDemoMode(false);
    window.location.reload();
  };

  // Sync session on load
  useEffect(() => {
    const checkSession = async () => {
      const savedEmail = localStorage.getItem('pos_current_user_email');
      if (savedEmail && !currentUser && !isDemoMode) {
        const q = query(collection(db, 'users'), where('email', '==', savedEmail));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setCurrentUser({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User);
        }
      }
    };
    checkSession();
  }, [isDemoMode]);

  // Firebase Auth sync
  useEffect(() => {
    if (isDemoMode) return;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!currentUser) {
          const q = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setCurrentUser({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as User);
          } else {
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown',
              role: 'Staff',
              email: firebaseUser.email || '',
              avatar: 'https://picsum.photos/100/100'
            });
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [isDemoMode, currentUser]);

  useEffect(() => {
    if (isDemoMode) {
      setProducts(MOCK_PRODUCTS);
      setSales(MOCK_SALES_HISTORY.map(s => ({ ...s, status: 'Completed' })));
      setUsers(MOCK_USERS);
      setCategories(MOCK_CATEGORIES);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handleError = (err: FirestoreError) => {
      setError(err);
      setLoading(false);
    };

    try {
      const unsubProducts = onSnapshot(collection(db, 'products'), (s) => {
        setProducts(s.docs.map(d => ({ id: d.id, ...d.data() })) as Product[]);
        setLoading(false);
      }, handleError);

      const unsubSales = onSnapshot(query(collection(db, 'sales'), orderBy('date', 'desc')), (s) => {
        setSales(s.docs.map(d => ({ id: d.id, ...d.data() })) as Sale[]);
      }, handleError);

      const unsubUsers = onSnapshot(collection(db, 'users'), (s) => {
        setUsers(s.docs.map(d => ({ id: d.id, ...d.data() })) as User[]);
      }, handleError);

      const unsubCategories = onSnapshot(collection(db, 'categories'), (s) => {
        setCategories(s.docs.map(d => ({ id: d.id, ...d.data() })) as Category[]);
      }, handleError);

      return () => {
        unsubProducts(); unsubSales(); unsubUsers(); unsubCategories();
      };
    } catch (e) {
      setLoading(false);
    }
  }, [isDemoMode]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (isDemoMode) {
      setProducts(prev => [{ ...product, id: `L-${Date.now()}` } as Product, ...prev]);
      return;
    }
    await addDoc(collection(db, 'products'), product);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (isDemoMode) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return;
    }
    await updateDoc(doc(db, 'products', id), updates);
  };

  const deleteProduct = async (id: string) => {
    if (isDemoMode) {
      setProducts(prev => prev.filter(p => p.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'products', id));
  };

  const addSale = async (saleData: Omit<Sale, 'id'>) => {
    const finalSale = { ...saleData, date: new Date().toISOString(), status: 'Completed' as const };
    if (isDemoMode) {
      setSales(prev => [{ ...finalSale, id: `INV-${Date.now()}` } as Sale, ...prev]);
      return;
    }
    const batch = writeBatch(db);
    const saleRef = doc(collection(db, 'sales'));
    batch.set(saleRef, finalSale);
    saleData.items.forEach(item => {
      const p = products.find(prod => prod.id === item.id);
      if (p) batch.update(doc(db, 'products', item.id), { quantity: Math.max(0, p.quantity - item.cartQuantity) });
    });
    await batch.commit();
  };

  const refundSale = async (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale || sale.status === 'Refunded') return;
    if (isDemoMode) {
      setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: 'Refunded' } : s));
      return;
    }
    const batch = writeBatch(db);
    batch.update(doc(db, 'sales', saleId), { status: 'Refunded' });
    sale.items.forEach(item => {
      const p = products.find(prod => prod.id === item.id);
      if (p) batch.update(doc(db, 'products', item.id), { quantity: p.quantity + item.cartQuantity });
    });
    await batch.commit();
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    if (isDemoMode) {
      setUsers(prev => [{ ...userData, id: `U-${Date.now()}` } as User, ...prev]);
      return;
    }
    await addDoc(collection(db, 'users'), userData);
  };

  const deleteUser = async (id: string) => {
    if (isDemoMode) {
      setUsers(prev => prev.filter(u => u.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'users', id));
  };

  return (
    <StoreContext.Provider value={{ 
      products, sales, users, categories, currentUser, loading, error, isDemoMode, 
      loginWithEmail, login, logout, enterDemoMode, exitDemoMode, addProduct, updateProduct, deleteProduct, 
      addSale, refundSale, addUser, deleteUser
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
