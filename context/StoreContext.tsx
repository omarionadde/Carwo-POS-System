import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, User, Category, AuditLog, Expense } from '../types';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  users: User[];
  categories: Category[];
  auditLogs: AuditLog[];
  expenses: Expense[]; 
  currentUser: User | null;
  loading: boolean;
  error: any | null;
  isDemoMode: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  login: (userId: string) => void;
  logout: () => void;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id'>) => Promise<string>;
  refundSale: (saleId: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]); 
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Only set basic user if we don't have one or if the ID changed
        if (!currentUser || currentUser.id !== firebaseUser.uid) {
            const basicUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Staff Member',
            role: 'Staff',
            avatar: firebaseUser.photoURL || 'https://picsum.photos/200/200'
            };
            setCurrentUser(basicUser);
        }
        setLoading(false);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []); // Empty dependency to run once on mount

  // Sync Auth User with Firestore User Data
  useEffect(() => {
    if (auth.currentUser && users.length > 0) {
      const foundUser = users.find(u => u.email === auth.currentUser?.email);
      if (foundUser) {
        // PREVENT INFINITE LOOP: Only update if data is actually different
        // We compare specific fields or use JSON.stringify for a quick check
        const isDifferent = !currentUser || 
                            currentUser.role !== foundUser.role || 
                            currentUser.name !== foundUser.name || 
                            currentUser.avatar !== foundUser.avatar;
        
        if (isDifferent) {
            setCurrentUser(foundUser);
        }
      }
    }
  }, [users, currentUser]);

  // Data Listeners
  useEffect(() => {
    // Only subscribe if we have a user (ID check is safer than object check) or demo mode
    const userId = currentUser?.id;
    
    if (!userId && !isDemoMode) {
      setProducts([]);
      setSales([]);
      setUsers([]);
      setCategories([]);
      setAuditLogs([]);
      setExpenses([]);
      return;
    }

    const handleError = (source: string) => (err: any) => {
      console.error(`${source} fetch error:`, err);
    };

    const unsubProducts = onSnapshot(collection(db, 'products'), (s) => setProducts(s.docs.map(d => ({ ...d.data(), id: d.id } as Product))), handleError('Products'));
    const unsubSales = onSnapshot(query(collection(db, 'sales'), orderBy('date', 'desc')), (s) => setSales(s.docs.map(d => ({ ...d.data(), id: d.id } as Sale))), handleError('Sales'));
    const unsubUsers = onSnapshot(collection(db, 'users'), (s) => setUsers(s.docs.map(d => ({ ...d.data(), id: d.id } as User))), handleError('Users'));
    const unsubCategories = onSnapshot(collection(db, 'categories'), (s) => setCategories(s.docs.map(d => ({ ...d.data(), id: d.id } as Category))), handleError('Categories'));
    const unsubLogs = onSnapshot(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc')), (s) => setAuditLogs(s.docs.map(d => ({ ...d.data(), id: d.id } as AuditLog))), handleError('AuditLogs'));
    const unsubExpenses = onSnapshot(query(collection(db, 'expenses'), orderBy('date', 'desc')), (s) => setExpenses(s.docs.map(d => ({ ...d.data(), id: d.id } as Expense))), handleError('Expenses'));

    return () => {
      unsubProducts(); unsubSales(); unsubUsers(); unsubCategories(); unsubLogs(); unsubExpenses();
    };
    // Depend on ID string rather than the full object to prevent re-subscriptions when profile details update
  }, [currentUser?.id, isDemoMode]);


  const logAction = async (action: string, details: string) => {
    if (isDemoMode) return;
    try {
      await addDoc(collection(db, 'auditLogs'), {
        action, details, userId: currentUser?.id || 'system', userName: currentUser?.name || 'System', timestamp: new Date().toISOString()
      });
    } catch (e) { console.error("Failed to log:", e); }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try { await signInWithEmailAndPassword(auth, email, pass); } 
    catch (err: any) { setLoading(false); throw err; }
  };

  const login = (userId: string) => { console.warn("Use loginWithEmail instead"); };

  const logout = async () => {
    try { await signOut(auth); setCurrentUser(null); } 
    catch (error) { console.error("Logout error", error); }
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    import('../constants').then(m => {
        setProducts(m.MOCK_PRODUCTS);
        setUsers(m.MOCK_USERS);
        setSales(m.MOCK_SALES_HISTORY);
        setCategories(m.MOCK_CATEGORIES);
        setExpenses([
            { id: '1', title: 'Shop Rent', amount: 500, category: 'Rent', date: new Date().toISOString(), recordedBy: 'Admin' },
            { id: '2', title: 'Electricity', amount: 120, category: 'Utilities', date: new Date().toISOString(), recordedBy: 'Admin' }
        ]);
    });
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setProducts([]); setSales([]); setUsers([]); setExpenses([]);
  };

  const addProduct = async (data: Omit<Product, 'id'>) => {
    if (isDemoMode) { setProducts(p => [...p, { ...data, id: Date.now().toString() } as Product]); return; }
    await addDoc(collection(db, 'products'), data);
    await logAction('CREATE_PRODUCT', `Added: ${data.name}`);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (isDemoMode) { setProducts(p => p.map(i => i.id === id ? { ...i, ...updates } : i)); return; }
    await updateDoc(doc(db, 'products', id), updates);
    await logAction('UPDATE_PRODUCT', `Updated ID: ${id}`);
  };

  const deleteProduct = async (id: string) => {
    if (isDemoMode) { setProducts(p => p.filter(i => i.id !== id)); return; }
    const p = products.find(i => i.id === id);
    await deleteDoc(doc(db, 'products', id));
    await logAction('DELETE_PRODUCT', `Deleted: ${p?.name}`);
  };

  const addSale = async (data: Omit<Sale, 'id'>): Promise<string> => {
    const newSale = { ...data, date: new Date().toISOString(), status: 'Completed' as const };
    if (isDemoMode) {
        const demoId = 'DEMO-' + Date.now();
        setSales(p => [ { ...newSale, id: demoId }, ...p]);
        data.items.forEach(item => {
            setProducts(p => p.map(x => x.id === item.id ? { ...x, quantity: Math.max(0, x.quantity - item.cartQuantity) } : x));
        });
        return demoId;
    }
    const docRef = await addDoc(collection(db, 'sales'), newSale);
    for (const item of data.items) {
      const pRef = doc(db, 'products', item.id);
      const curr = products.find(p => p.id === item.id);
      if (curr) await updateDoc(pRef, { quantity: Math.max(0, curr.quantity - item.cartQuantity) });
    }
    await logAction('NEW_SALE', `Sale: $${newSale.totalAmount}`);
    return docRef.id;
  };

  const refundSale = async (id: string) => {
    if (isDemoMode) { setSales(p => p.map(s => s.id === id ? { ...s, status: 'Refunded' } : s)); return; }
    const sale = sales.find(s => s.id === id);
    if (!sale || sale.status === 'Refunded') return;
    await updateDoc(doc(db, 'sales', id), { status: 'Refunded' });
    for (const item of sale.items) {
      const pRef = doc(db, 'products', item.id);
      const curr = products.find(p => p.id === item.id);
      if (curr) await updateDoc(pRef, { quantity: curr.quantity + item.cartQuantity });
    }
    await logAction('REFUND_SALE', `Refunded: ${id}`);
  };

  const addUser = async (data: Omit<User, 'id'>) => {
    if (isDemoMode) { setUsers(p => [...p, { ...data, id: 'DEMO-' + Date.now() }]); return; }
    await addDoc(collection(db, 'users'), data);
    await logAction('CREATE_USER', `User: ${data.name}`);
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    if (isDemoMode) { setUsers(p => p.map(u => u.id === id ? { ...u, ...updates } : u)); return; }
    await updateDoc(doc(db, 'users', id), updates);
    await logAction('UPDATE_USER', `Updated User: ${id}`);
  };

  const deleteUser = async (id: string) => {
    if (isDemoMode) return;
    await deleteDoc(doc(db, 'users', id));
    await logAction('DELETE_USER', `Deleted User: ${id}`);
  };

  const addExpense = async (data: Omit<Expense, 'id'>) => {
    if (isDemoMode) { setExpenses(p => [{ ...data, id: 'EXP-' + Date.now() } as Expense, ...p]); return; }
    await addDoc(collection(db, 'expenses'), data);
    await logAction('ADD_EXPENSE', `Expense: ${data.title} ($${data.amount})`);
  }

  const deleteExpense = async (id: string) => {
    if (isDemoMode) { setExpenses(p => p.filter(e => e.id !== id)); return; }
    await deleteDoc(doc(db, 'expenses', id));
    await logAction('DELETE_EXPENSE', `Removed Expense ID: ${id}`);
  }

  const addCategory = async (name: string) => {
    if (isDemoMode) {
        setCategories(p => [...p, { id: 'CAT-'+Date.now(), name, count: 0 }]);
        return;
    }
    await addDoc(collection(db, 'categories'), { name, count: 0 });
    await logAction('CREATE_CATEGORY', `Created category: ${name}`);
  };

  const deleteCategory = async (id: string) => {
      if (isDemoMode) {
          setCategories(p => p.filter(c => c.id !== id));
          return;
      }
      await deleteDoc(doc(db, 'categories', id));
      await logAction('DELETE_CATEGORY', `Deleted category ID: ${id}`);
  };

  return (
    <StoreContext.Provider value={{ 
      products, sales, users, categories, auditLogs, expenses, currentUser, loading, error, isDemoMode, 
      loginWithEmail, login, logout, enterDemoMode, exitDemoMode, addProduct, updateProduct, deleteProduct, 
      addSale, refundSale, addUser, updateUser, deleteUser, addExpense, deleteExpense,
      addCategory, deleteCategory 
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