import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Categories from './pages/Categories';
import SalesManagement from './pages/SalesManagement';
import Finance from './pages/Finance'; // Serves as Treasury
import Expenses from './pages/Expenses'; // New
import Payroll from './pages/Payroll'; // New
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Cloud, ShieldAlert, X } from 'lucide-react';

const AppContent = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const { loading, isDemoMode, exitDemoMode, currentUser } = useStore();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-primary-900 flex flex-col items-center justify-center text-white z-[9999]">
        <Cloud size={80} className="text-accent-500 animate-pulse mb-4" />
        <p className="text-xl font-black uppercase tracking-widest animate-pulse">Loading System...</p>
      </div>
    );
  }

  if (!currentUser && !isDemoMode) {
    return <Login />;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'pos' && <POS />}
        {activePage === 'products' && <Products />}
        {activePage === 'categories' && <Categories />}
        {activePage === 'sales-management' && <SalesManagement />}
        
        {/* Finance Sub Pages */}
        {activePage === 'finance-treasury' && <Finance />}
        {activePage === 'finance-expenses' && <Expenses />}
        {activePage === 'finance-payroll' && <Payroll />}
        
        {activePage === 'finance' && <Finance />} {/* Fallback */}

        {activePage === 'reports' && <Reports />}
        {activePage === 'users' && <Users />}
        {activePage === 'settings' && <Settings />}
      </main>

      {isDemoMode && (
        <div className="fixed bottom-4 right-4 bg-accent-500 text-primary-900 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 z-50 animate-bounce">
          <ShieldAlert size={14} /> Local Mode
          <button onClick={exitDemoMode} className="ml-2 bg-white/20 p-1 rounded-full hover:bg-white/40"><X size={12} /></button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;