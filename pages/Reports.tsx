import React from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart3, PieChart, TrendingUp, Calendar, Zap, Target } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const Reports = () => {
  const { sales, products } = useStore();

  const salesByCategory = products.reduce((acc: any, p) => {
    const totalSold = sales.reduce((sAcc, s) => {
      const item = s.items.find(i => i.id === p.id);
      return sAcc + (item ? item.cartQuantity : 0);
    }, 0);
    
    const existing = acc.find((a: any) => a.name === p.category);
    if (existing) {
      existing.value += totalSold;
    } else {
      acc.push({ name: p.category, value: totalSold });
    }
    return acc;
  }, []);

  const colors = ['#0f172a', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
          <p className="text-sm text-gray-500">Business performance metrics</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-gray-100 p-2.5 rounded-xl"><Calendar size={20} className="text-gray-400" /></button>
          <button className="bg-primary-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm">Share Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
             <TrendingUp size={28} />
           </div>
           <div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Average Ticket</p>
             <h4 className="text-2xl font-bold text-gray-900">${(sales.reduce((a,b)=>a+b.totalAmount,0) / (sales.length || 1)).toFixed(2)}</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
             <Zap size={28} />
           </div>
           <div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Conversion Rate</p>
             <h4 className="text-2xl font-bold text-gray-900">3.4%</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
             <Target size={28} />
           </div>
           <div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Growth Target</p>
             <h4 className="text-2xl font-bold text-gray-900">85%</h4>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3">
             <BarChart3 className="text-primary-900" /> Category Performance
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {salesByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-primary-900 p-8 rounded-[40px] text-white shadow-2xl flex flex-col">
           <div className="flex items-center gap-3 mb-8">
             <PieChart className="text-accent-500" />
             <h3 className="text-xl font-bold italic">Stock Distribution</h3>
           </div>
           <div className="space-y-6 flex-1">
             {salesByCategory.map((cat: any, i: number) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                   <span>{cat.name}</span>
                   <span>{cat.value} Sales</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-accent-500 rounded-full" 
                    style={{ width: `${Math.min(100, (cat.value / 50) * 100)}%` }}
                   />
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Insight</p>
              <p className="text-sm font-medium">You should restock on Top Sellers soon.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;