import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';

// Placeholder components for other pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-gray-600">{title} Module</h2>
    <p className="mt-2">This feature is coming soon to Carwo Dhar.</p>
  </div>
);

const AppContent = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'pos': return <POS />;
      case 'products': return <Products />;
      case 'categories': return <PlaceholderPage title="Categories" />;
      case 'stock': return <PlaceholderPage title="Stock Management" />;
      case 'finance': return <PlaceholderPage title="Finance" />;
      case 'reports': return <PlaceholderPage title="Reports" />;
      case 'users': return <PlaceholderPage title="Users" />;
      case 'settings': return <PlaceholderPage title="Settings" />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {renderPage()}
      </main>
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