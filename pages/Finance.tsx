import React from 'react';
import { useStore } from '../context/StoreContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Banknote, Landmark, ReceiptText } from 'lucide-react';

const Finance = () => {
  const { sales, products } = useStore();

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCost = sales.reduce((acc, s) => {
    return acc + s.items.reduce((itemAcc, item) => itemAcc + (item.buyPrice * item.cartQuantity), 0);
  }, 0);
  const grossProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
        <p className="text-sm text-gray-500">Revenue, profit and expense tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-primary-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Wallet size={28} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-accent-500 text-primary-900 px-3 py-1 rounded-full">Active Balance</span>
          </div>
          <p className="text-white/60 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
          <h3 className="text-5xl font-black italic tracking-tighter">${totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <ArrowUpCircle size={28} />
            </div>
            <Landmark size={24} className="opacity-20" />
          </div>
          <p className="text-white/60 text-sm font-bold uppercase tracking-wider mb-1">Estimated Profit</p>
          <h3 className="text-5xl font-black italic tracking-tighter">${grossProfit.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-8 rounded-[40px] border-2 border-gray-100 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <ArrowDownCircle size={28} />
            </div>
            <ReceiptText size={24} className="text-gray-200" />
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Expenses</p>
          <h3 className="text-5xl font-black italic tracking-tighter text-gray-900">${totalCost.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black uppercase tracking-tight mb-6">Profit Breakdown</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b-2 border-dashed border-gray-100 pb-4">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Revenue (Sales)</p>
                <p className="text-2xl font-bold text-primary-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-emerald-500 font-bold text-sm">+100%</div>
            </div>
            <div className="flex justify-between items-end border-b-2 border-dashed border-gray-100 pb-4">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">COGS (Stock Cost)</p>
                <p className="text-2xl font-bold text-red-500">-${totalCost.toFixed(2)}</p>
              </div>
              <div className="text-red-500 font-bold text-sm">Outgoing</div>
            </div>
            <div className="flex justify-between items-end pt-2">
              <div>
                <p className="text-xs font-black text-accent-500 uppercase tracking-widest">Net Operating Profit</p>
                <p className="text-4xl font-black text-primary-900 italic tracking-tighter">${grossProfit.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Banknote size={40} className="text-gray-300" />
           </div>
           <h4 className="text-xl font-bold text-gray-800 mb-2">Detailed Financial Reports</h4>
           <p className="text-gray-500 text-sm mb-6 max-w-xs">Download professional PDF reports for tax and audit purposes.</p>
           <button className="bg-primary-900 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all">Generate Full Report</button>
        </div>
      </div>
    </div>
  );
};

export default Finance;