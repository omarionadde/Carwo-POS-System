import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Categories from './pages/Categories';
import SalesManagement from './pages/SalesManagement';
import Finance from './pages/Finance';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { CloudSync, AlertCircle, Copy, ExternalLink, RefreshCw, PlayCircle, ShieldAlert, WifiOff, Lock } from 'lucide-react';

const PermissionErrorScreen = ({ code }: { code: string }) => {
  const { enterDemoMode } = useStore();
  const rules = `service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(rules);
    alert("Security rules copied! Paste them in the 'Rules' tab.");
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in my-8">
        <div className="bg-primary-900 p-10 text-white flex flex-col items-center justify-center md:w-[40%] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="w-24 h-24 bg-red-500/20 rounded-3xl flex items-center justify-center mb-8 border border-red-500/30">
            <Lock size={48} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-3 leading-tight">Access Locked</h2>
          <p className="text-slate-400 text-center text-sm mb-12 leading-relaxed">
            Firebase settings are blocking your data. (Console-ka ka eneble garee Rules-ka).
          </p>
          <div className="w-full space-y-4 relative z-10">
            <button 
              onClick={enterDemoMode}
              className="w-full bg-accent-500 text-primary-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent-600 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <PlayCircle size={22} /> Start Demo Mode
            </button>
          </div>
        </div>
        <div className="p-10 flex-1 bg-slate-50">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2 underline decoration-accent-500 decoration-4 underline-offset-4">Halkee ka "Enable" dhahaa? (How to Fix)</h3>
            <p className="text-slate-500 text-sm">Follow these 3 simple steps in your Firebase Console:</p>
          </div>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-2xl bg-primary-900 text-white flex items-center justify-center font-bold shrink-0 shadow-lg">1</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Visit Firebase Console</p>
                <p className="text-xs text-slate-500 mt-1">Go to Build > Firestore Database</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-2xl bg-primary-900 text-white flex items-center justify-center font-bold shrink-0 shadow-lg">2</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Click the "Rules" Tab</p>
                <div className="relative group mt-2">
                  <pre className="bg-slate-900 text-emerald-400 p-5 rounded-2xl text-[11px] overflow-x-auto font-mono">
                    {rules}
                  </pre>
                  <button onClick={copyRules} className="absolute top-3 right-3 p-2 bg-accent-500 text-primary-900 rounded-lg hover:bg-accent-600">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex gap-4">
            <button onClick={() => window.location.reload()} className="flex-1 bg-white border-2 border-slate-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              <RefreshCw size={20} /> Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const { loading, error, isDemoMode, exitDemoMode, currentUser } = useStore();

  if (error?.code === 'permission-denied' && !isDemoMode) {
    return <PermissionErrorScreen code={error.code} />;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-primary-900 flex flex-col items-center justify-center text-white z-[9999]">
        <CloudSync size={80} className="text-accent-500 animate-pulse mb-4" />
        <h1 className="text-4xl font-black italic tracking-tighter">CARWO DHAR</h1>
      </div>
    );
  }

  // If no user is logged in, show Login Screen
  if (!currentUser) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'pos': return <POS />;
      case 'products': return <Products />;
      case 'categories': return <Categories />;
      case 'sales-management': return <SalesManagement />;
      case 'finance': return <Finance />;
      case 'reports': return <Reports />;
      case 'users': return <Users />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-accent-500 selection:text-primary-900">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative no-scrollbar">
        {isDemoMode && (
          <div className="sticky top-0 z-50 -mt-4 mb-6 flex items-center justify-between bg-amber-50/80 backdrop-blur-md border border-amber-200 p-4 rounded-3xl shadow-sm animate-fade-in">
            <div className="flex items-center gap-4">
              <ShieldAlert className="text-amber-600" size={20} />
              <p className="text-xs font-black text-amber-900 uppercase">Demo Mode: Using Local Browser Storage</p>
            </div>
            <button onClick={exitDemoMode} className="text-[11px] font-bold text-white bg-amber-600 px-5 py-2.5 rounded-xl uppercase">Connect Cloud</button>
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
};

const App = () => <StoreProvider><AppContent /></StoreProvider>;

export default App;