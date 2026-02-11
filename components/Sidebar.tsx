import React from 'react';
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
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS & Sales', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Shirt },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'stock', label: 'Stock Mgmt', icon: Package },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent-500 text-primary-900 font-semibold shadow-lg shadow-accent-500/20' 
                      : 'text-gray-300 hover:bg-primary-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-primary-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-primary-800 hover:text-red-300 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;