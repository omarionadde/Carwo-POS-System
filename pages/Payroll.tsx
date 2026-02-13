import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Wallet, Search, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface PayrollRowProps {
  user: User;
  onUpdateSalary: (id: string, val: number) => void;
  onPay: (id: string, name: string, val: number) => void;
}

// Separate component to handle individual row state prevents re-rendering entire table on input
const PayrollRow: React.FC<PayrollRowProps> = ({ user, onUpdateSalary, onPay }) => {
  const [localSalary, setLocalSalary] = useState(user.salary?.toString() || '');

  useEffect(() => {
    setLocalSalary(user.salary?.toString() || '');
  }, [user.salary]);

  const handleBlur = () => {
    const val = parseFloat(localSalary);
    if (!isNaN(val) && val !== user.salary) {
      onUpdateSalary(user.id, val);
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-8 py-4">
          <div className="flex items-center gap-3">
            <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
            <div>
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
      </td>
      <td className="px-8 py-4">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'Admin' ? 'bg-accent-100 text-accent-700' : 'bg-blue-50 text-blue-600'}`}>
            {user.role}
          </span>
      </td>
      <td className="px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">$</span>
            <input 
                type="number" 
                className="w-24 p-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-800 focus:outline-none focus:border-accent-500 transition-colors"
                value={localSalary}
                placeholder="0.00"
                onChange={(e) => setLocalSalary(e.target.value)}
                onBlur={handleBlur}
            />
          </div>
      </td>
      <td className="px-8 py-4">
          {user.lastPaidDate ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 size={14} />
                {new Date(user.lastPaidDate).toLocaleDateString()}
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">Not recorded</span>
          )}
      </td>
      <td className="px-8 py-4 text-right">
          <button 
            onClick={() => onPay(user.id, user.name, parseFloat(localSalary) || 0)}
            className="bg-primary-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-800 transition-all flex items-center gap-2 ml-auto"
          >
            <Wallet size={14} /> Pay Now
          </button>
      </td>
    </tr>
  );
};

const Payroll = () => {
  const { users, updateUser, addExpense, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePaySalary = async (userId: string, name: string, salary: number) => {
    if (!salary || salary <= 0) {
      alert("Please set a salary amount first.");
      return;
    }
    
    const confirm = window.confirm(`Are you sure you want to record a salary payment of $${salary} for ${name}?`);
    if (!confirm) return;

    // 1. Record as an expense
    await addExpense({
      title: `Salary Payment: ${name}`,
      amount: salary,
      category: 'Salary',
      date: new Date().toISOString(),
      description: `Monthly salary payment processed by ${currentUser?.name}`,
      recordedBy: currentUser?.name || 'System'
    });

    // 2. Update user's last paid date
    await updateUser(userId, { lastPaidDate: new Date().toISOString() });
  };

  const updateSalary = async (userId: string, newSalary: number) => {
    await updateUser(userId, { salary: newSalary });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Payroll</h2>
          <p className="text-sm text-gray-500">Manage employee salaries and payments</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                   <th className="px-8 py-5">Employee</th>
                   <th className="px-8 py-5">Role</th>
                   <th className="px-8 py-5">Base Salary ($)</th>
                   <th className="px-8 py-5">Last Paid</th>
                   <th className="px-8 py-5 text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                   <PayrollRow 
                     key={user.id} 
                     user={user} 
                     onUpdateSalary={updateSalary} 
                     onPay={handlePaySalary} 
                   />
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;