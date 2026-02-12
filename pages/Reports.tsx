
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BarChart3, TrendingUp, TrendingDown, Package, Wallet, ShoppingBag, 
  Calendar, FileSpreadsheet, Download, History, Tag, ArrowRightLeft, DollarSign,
  ShieldCheck, Search, Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const Reports = () => {
  const { sales, products, auditLogs } = useStore();
  
  // Date states
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [reportRange, setReportRange] = useState('This Month');
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayStr);

  const [activeTab, setActiveTab] = useState<'analytics' | 'transactions' | 'audit'>('analytics');
  const [auditSearch, setAuditSearch] = useState('');

  // Filtering Logic
  const filteredSales = useMemo(() => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    const now = new Date();

    if (reportRange === 'Today') {
      start = new Date(now.setHours(0,0,0,0));
      end = new Date(now.setHours(23,59,59,999));
    } else if (reportRange === 'Specific Day') {
      start = new Date(startDate);
      start.setHours(0,0,0,0);
      end = new Date(startDate);
      end.setHours(23,59,59,999);
    } else if (reportRange === 'This Month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date();
    } else if (reportRange === 'Last Month') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (reportRange === 'Custom') {
       start = new Date(startDate);
       end = new Date(endDate);
       end.setHours(23,59,59,999);
    }

    return sales.filter(sale => {
      const d = new Date(sale.date);
      return d >= start && d <= end;
    });
  }, [sales, reportRange, startDate, endDate]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => 
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) || 
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase())
    );
  }, [auditLogs, auditSearch]);

  const stats = useMemo(() => {
    const totalRev = filteredSales.reduce((a, b) => a + b.totalAmount, 0);
    
    // Calculate cost based on items sold in these sales
    let totalCost = 0;
    filteredSales.forEach(sale => {
        sale.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const buyPrice = product ? product.buyPrice : (item.buyPrice || 0);
            totalCost += (buyPrice * item.cartQuantity);
        });
    });

    const profit = totalRev - totalCost;
    const itemsSold = filteredSales.reduce((a, b) => a + b.items.reduce((ia, ib) => ia + ib.cartQuantity, 0), 0);
    const avgTicket = filteredSales.length > 0 ? totalRev / filteredSales.length : 0;
    
    return { totalRev, profit, itemsSold, avgTicket };
  }, [filteredSales, products]);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    // Flatten data for CSV
    const flattened = data.map(s => {
      // Handle both Sales and Audit Log objects dynamically
      if ('action' in s) {
        return {
          Date: new Date(s.timestamp).toLocaleString(),
          User: s.userName,
          Action: s.action,
          Details: s.details
        };
      } else {
        return {
          ID: s.id,
          Date: new Date(s.date).toLocaleDateString(),
          Total: s.totalAmount,
          Method: s.paymentMethod,
          ItemsCount: s.items.length,
          Status: s.status || 'Completed'
        };
      }
    });

    const headers = Object.keys(flattened[0]).join(',');
    const rows = flattened.map(obj => 
      Object.values(obj).map(val => `"${val}"`).join(',')
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart Data: Sales by Category
  const categoryData = useMemo(() => {
    const data: {[key: string]: number} = {};
    filteredSales.forEach(sale => {
        sale.items.forEach(item => {
            if (!data[item.category]) data[item.category] = 0;
            data[item.category] += (item.sellPrice * item.cartQuantity);
        });
    });
    
    const colors = ['#0f172a', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
    return Object.keys(data).map((key, index) => ({
        name: key,
        value: data[key],
        color: colors[index % colors.length]
    }));
  }, [filteredSales]);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary-900 tracking-tight">System Reports</h1>
          <p className="text-slate-500 font-medium">Historical analysis, financial performance, and audit tracking.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('analytics')} 
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-primary-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Analytics
           </button>
           <button 
             onClick={() => setActiveTab('transactions')} 
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-primary-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Transactions
           </button>
           <button 
             onClick={() => setActiveTab('audit')} 
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'audit' ? 'bg-primary-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <ShieldCheck size={14} /> Audit Trail
           </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <>
          <div className="flex flex-wrap gap-2 items-center">
             <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap gap-2">
                {['Today', 'Specific Day', 'This Month', 'Last Month', 'Custom'].map(range => (
                  <button 
                    key={range}
                    onClick={() => setReportRange(range)}
                    className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${reportRange === range ? 'bg-accent-500 text-primary-900 shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    {range}
                  </button>
                ))}
             </div>
             <div className="flex gap-2 ml-auto">
                <button onClick={() => exportToCSV(filteredSales, 'Sales_Report')} className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100">
                   <FileSpreadsheet className="w-4 h-4" /> Export Sales
                </button>
             </div>
          </div>

          {(reportRange === 'Custom' || reportRange === 'Specific Day') && (
            <div className="bg-primary-900/5 p-6 rounded-[2.5rem] border border-primary-900/10 flex flex-wrap gap-6 items-end animate-in slide-in-from-top-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-primary-900/50 uppercase tracking-widest ml-1">{reportRange === 'Specific Day' ? 'Select Date' : 'Start Date'}</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-accent-500" />
               </div>
               {reportRange === 'Custom' && (
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-primary-900/50 uppercase tracking-widest ml-1">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-accent-500" />
                 </div>
               )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             <ReportCard title="Revenue" value={`$${stats.totalRev.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} color="primary" />
             <ReportCard title="Net Profit (Est)" value={`$${stats.profit.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} color="emerald" />
             <ReportCard title="Items Sold" value={stats.itemsSold.toString()} icon={<Package className="w-5 h-5" />} color="accent" />
             <ReportCard title="Avg Ticket" value={`$${stats.avgTicket.toFixed(2)}`} icon={<Tag className="w-5 h-5" />} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-[500px]">
                <h3 className="text-xl font-black text-primary-900 mb-8 flex items-center gap-3 uppercase italic">
                   <BarChart3 className="w-5 h-5 text-accent-500" /> Category Performance
                </h3>
                <div className="flex-1">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <Tooltip contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}} cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                          {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-primary-900 flex items-center gap-3 uppercase italic">
                     <History className="w-5 h-5 text-emerald-600" /> Recent Activity
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                   {filteredSales.slice(0, 10).map((sale) => (
                     <div key={sale.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-colors ${sale.paymentMethod === 'Cash' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white'}`}>
                              <DollarSign size={18} />
                           </div>
                           <div>
                              <p className="font-black text-primary-900 text-sm leading-tight">{sale.id}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{new Date(sale.date).toLocaleTimeString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-primary-900 text-lg">${sale.totalAmount.toFixed(2)}</p>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sale.items.length} Items</span>
                        </div>
                     </div>
                   ))}
                   {filteredSales.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                        <ShoppingBag size={48} className="mb-2" />
                        <p className="text-sm font-bold">No sales in this period</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in zoom-in-95">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-xl font-black text-primary-900 flex items-center gap-3 uppercase italic">
                 <ArrowRightLeft className="w-6 h-6 text-slate-400" /> Transactions Log
              </h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                       <th className="px-10 py-5">Invoice ID</th>
                       <th className="px-10 py-5">Date & Time</th>
                       <th className="px-10 py-5">Payment</th>
                       <th className="px-10 py-5">Items</th>
                       <th className="px-10 py-5">Amount</th>
                       <th className="px-10 py-5">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredSales.map((sale) => (
                       <tr key={sale.id} className="hover:bg-slate-50/80 transition-all text-xs group">
                          <td className="px-10 py-6 font-black text-primary-900 whitespace-nowrap">
                             {sale.id}
                          </td>
                          <td className="px-10 py-6 font-bold text-slate-500">
                             {new Date(sale.date).toLocaleString()}
                          </td>
                          <td className="px-10 py-6">
                             <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                                {sale.paymentMethod}
                             </span>
                          </td>
                          <td className="px-10 py-6 font-bold text-slate-500">{sale.items.length} Items</td>
                          <td className="px-10 py-6 font-black text-emerald-600 text-sm">${sale.totalAmount.toFixed(2)}</td>
                          <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              sale.status === 'Refunded' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {sale.status || 'Completed'}
                            </span>
                          </td>
                       </tr>
                    ))}
                    {filteredSales.length === 0 && (
                       <tr>
                          <td colSpan={6} className="px-10 py-20 text-center text-slate-400 font-bold italic">No transactions found for selected period.</td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in zoom-in-95">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/30 gap-4">
             <div>
               <h3 className="text-xl font-black text-primary-900 flex items-center gap-3 uppercase italic">
                  <ShieldCheck className="w-6 h-6 text-slate-400" /> Audit Trail Logs
               </h3>
               <p className="text-xs text-slate-400 mt-1">Showing last 100 system actions</p>
             </div>
             
             <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-900 w-64"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => exportToCSV(filteredAuditLogs, 'Audit_Log')}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download size={14} /> Export CSV
                </button>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   <tr>
                      <th className="px-10 py-5">Action Type</th>
                      <th className="px-10 py-5">User</th>
                      <th className="px-10 py-5">Details</th>
                      <th className="px-10 py-5 text-right">Timestamp</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredAuditLogs.map((log) => {
                     // Color coding based on action type
                     let badgeColor = "bg-slate-100 text-slate-600";
                     if (log.action.includes("DELETE")) badgeColor = "bg-red-50 text-red-600";
                     else if (log.action.includes("CREATE") || log.action.includes("ADD")) badgeColor = "bg-emerald-50 text-emerald-600";
                     else if (log.action.includes("UPDATE")) badgeColor = "bg-blue-50 text-blue-600";
                     else if (log.action.includes("REFUND")) badgeColor = "bg-amber-50 text-amber-600";

                     return (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-all text-xs">
                         <td className="px-10 py-4">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${badgeColor}`}>
                               {log.action}
                            </span>
                         </td>
                         <td className="px-10 py-4 font-bold text-primary-900 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                               {log.userName.charAt(0)}
                            </div>
                            {log.userName}
                         </td>
                         <td className="px-10 py-4 font-medium text-slate-600 max-w-md truncate" title={log.details}>
                            {log.details}
                         </td>
                         <td className="px-10 py-4 text-right font-bold text-slate-400 flex items-center justify-end gap-2">
                           <Clock size={12} />
                           {new Date(log.timestamp).toLocaleString()}
                         </td>
                      </tr>
                   )})}
                   {filteredAuditLogs.length === 0 && (
                      <tr>
                         <td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-bold italic">No logs found matching your criteria.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
      )}
    </div>
  );
};

const ReportCard = ({ title, value, icon, color }: any) => {
  const colors: any = {
    primary: 'bg-primary-900 text-white border-primary-900', // Revenue
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    accent: 'bg-accent-500 text-primary-900 border-accent-500', // Items
  };
  
  // Handling white text for primary background
  const iconBg = color === 'primary' ? 'bg-white/10 text-white' : 
                 color === 'accent' ? 'bg-primary-900/10 text-primary-900' :
                 `bg-${color === 'emerald' ? 'emerald' : 'blue'}-100 text-${color === 'emerald' ? 'emerald' : 'blue'}-600`;

  return (
    <div className={`p-8 rounded-[2.5rem] border ${colors[color]} shadow-sm flex flex-col gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden`}>
       {color === 'primary' && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>}
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform relative z-10`}>
          {icon}
       </div>
       <div className="relative z-10">
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${color === 'primary' ? 'text-white/60' : 'text-slate-400'}`}>{title}</p>
          <h2 className="text-3xl font-black tracking-tighter">{value}</h2>
       </div>
    </div>
  );
};

export default Reports;
