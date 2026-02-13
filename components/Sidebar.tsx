import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Shirt, 
  Tags, 
  Package, 
  DollarSign, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Landmark,
  Wallet,
  Receipt
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { currentUser, logout } = useStore();
  const [financeOpen, setFinanceOpen] = useState(false);

  // Checks if any finance page is active to keep menu open
  const isFinanceActive = ['finance-treasury', 'finance-expenses', 'finance-payroll'].includes(activePage);

  // Initialize open state if active page is inside finance
  React.useEffect(() => {
    if (isFinanceActive) setFinanceOpen(true);
  }, [activePage]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS & Sales', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Shirt },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'sales-management', label: 'Sales Management', icon: Package },
  ];

  const bottomItems = [
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const financeSubItems = [
    { id: 'finance-treasury', label: 'Treasury & Accounts', icon: Landmark },
    { id: 'finance-expenses', label: 'Expenses', icon: Receipt },
    { id: 'finance-payroll', label: 'Payroll', icon: Wallet },
  ];

  const NavItem = ({ item, isSub = false }: { item: any, isSub?: boolean }) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;
    return (
      <button
        onClick={() => setActivePage(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-accent-500 text-primary-900 font-semibold shadow-lg shadow-accent-500/20' 
            : 'text-gray-300 hover:bg-primary-800 hover:text-white'
        } ${isSub ? 'pl-11 text-sm' : ''}`}
      >
        <Icon size={isSub ? 18 : 20} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-primary-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      <div className="p-6 border-b border-primary-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-accent-500 flex items-center justify-center font-bold text-primary-900">
          C
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Carwo Dhar</h1>
          <p className="text-xs text-gray-400">Fashion POS System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 no-scrollbar">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavItem item={item} />
            </li>
          ))}

          {/* Finance Dropdown */}
          <li>
            <button
              onClick={() => {
                // If opening, navigate to the main finance page automatically
                if (!financeOpen) setActivePage('finance-treasury');
                setFinanceOpen(!financeOpen);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isFinanceActive ? 'bg-primary-800 text-white shadow-inner' : 'text-gray-300 hover:bg-primary-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={20} className={isFinanceActive ? 'text-accent-500' : 'text-gray-400 group-hover:text-white'} />
                <span className={isFinanceActive ? 'font-bold' : ''}>Finance</span>
              </div>
              {financeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${financeOpen ? 'max-h-48 opacity-100 mt-2 pb-2' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-1">
                {financeSubItems.map((sub) => (
                  <li key={sub.id}>
                    <NavItem item={sub} isSub={true} />
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {bottomItems.map((item) => (
             <li key={item.id}>
              <NavItem item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {currentUser && (
        <div className="p-4 bg-primary-800/50 m-3 rounded-2xl border border-white/5 flex items-center gap-3">
           <img src={currentUser.avatar} className="w-10 h-10 rounded-xl object-cover" alt={currentUser.name} />
           <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{currentUser.name}</p>
              <p className="text-[10px] text-accent-500 font-black uppercase tracking-tighter">{currentUser.role}</p>
           </div>
        </div>
      )}

      <div className="p-4 border-t border-primary-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-primary-800 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;