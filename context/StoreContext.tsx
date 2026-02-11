import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Sale, User } from '../types';
import { MOCK_PRODUCTS, MOCK_SALES_HISTORY, MOCK_USERS } from '../constants';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  users: User[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addSale: (sale: Sale) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES_HISTORY);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addSale = (sale: Sale) => {
    setSales([sale, ...sales]);
    // Deduct stock
    sale.items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        updateProduct(product.id, { quantity: product.quantity - item.cartQuantity });
      }
    });
  };

  return (
    <StoreContext.Provider value={{ products, sales, users, addProduct, updateProduct, addSale, deleteProduct }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};