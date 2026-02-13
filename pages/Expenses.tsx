import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Search, Trash2, X, Check } from 'lucide-react';
import { Expense } from '../types';

const Expenses = () => {
  const { expenses, addExpense, deleteExpense, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Expense, 'id' | 'date' | 'recordedBy'>>({
    title: '',
    amount: 0,
    category: 'Other',
    description: ''
  });

  const filteredExpenses = expenses.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.amount <= 0) return;
    
    await addExpense({
      ...formData,
      date: new Date().toISOString(),
      recordedBy: currentUser?.name || 'System'
    });
    
    setFormData({ title: '', amount: 0, category: 'Other', description: '' });
    setIsModalOpen(false);
  };

  // Stats Calculations
  const totalOutflow = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const uniqueCategories = new Set(expenses.map(e => e.category)).size;
  const totalEntries = expenses.length;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Expense Tracking</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage operational costs and store overheads.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#e11d48] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#be123c] transition-all font-bold shadow-lg shadow-rose-500/20 text-xs uppercase tracking-widest"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Card 1: Total Outflow */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Outflow</p>
            <h3 className="text-5xl font-black text-primary-900 tracking-tighter">${totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
         </div>

         {/* Card 2: Categories */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Categories</p>
            <h3 className="text-5xl font-black text-primary-900 tracking-tighter">{uniqueCategories}</h3>
         </div>

         {/* Card 3: Total Entries */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Entries</p>
            <h3 className="text-5xl font-black text-primary-900 tracking-tighter">{totalEntries}</h3>
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar - Kept for functionality but styled cleanly */}
        <div className="p-6 border-b border-gray-100">
           <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-rose-500 transition-all text-sm font-bold text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-white text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                <tr>
                   <th className="px-8 py-6">Description</th>
                   <th className="px-8 py-6">Category</th>
                   <th className="px-8 py-6">Date</th>
                   <th className="px-8 py-6 text-right">Amount</th>
                   <th className="px-8 py-6 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredExpenses.map(expense => (
                   <tr key={expense.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                         <p className="font-bold text-gray-900 text-sm">{expense.title}</p>
                         {expense.description && <p className="text-[10px] text-gray-400 mt-1">{expense.description}</p>}
                      </td>
                      <td className="px-8 py-6">
                         <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-600">
                            {expense.category}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-gray-500">
                         {new Date(expense.date).toISOString().split('T')[0]}
                      </td>
                      <td className="px-8 py-6 text-right font-black text-[#e11d48] text-sm">
                         -${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                           onClick={() => deleteExpense(expense.id)}
                           className="p-2 text-gray-300 hover:text-[#e11d48] hover:bg-rose-50 rounded-xl transition-all"
                           title="Delete Entry"
                        >
                           <Trash2 size={16} />
                         </button>
                      </td>
                   </tr>
                ))}
                {filteredExpenses.length === 0 && (
                   <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 font-medium">No expense records found</td>
                   </tr>
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Keeping existing functionality with matching styles */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 animate-in zoom-in-95 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900 uppercase italic">Add Expense</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={18} /></button>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                     <input 
                        required 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#e11d48] font-bold"
                        placeholder="e.g. Shop Electricity Bill"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Amount ($)</label>
                        <input 
                           required 
                           type="number" 
                           min="0"
                           step="0.01"
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#e11d48] font-bold text-[#e11d48]"
                           placeholder="0.00"
                           value={formData.amount}
                           onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                        <select 
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#e11d48] font-bold"
                           value={formData.category}
                           onChange={e => setFormData({...formData, category: e.target.value as any})}
                        >
                           <option>Rent</option>
                           <option>Utilities</option>
                           <option>Maintenance</option>
                           <option>Marketing</option>
                           <option>Salary</option>
                           <option>Other</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Notes (Optional)</label>
                     <textarea 
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#e11d48] font-medium text-sm"
                        placeholder="Additional details..."
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                     />
                  </div>

                  <button type="submit" className="w-full py-4 bg-[#e11d48] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#be123c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20">
                     <Check size={18} /> Save Record
                  </button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Expenses;