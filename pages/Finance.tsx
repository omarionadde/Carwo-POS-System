import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Wallet, Smartphone, ArrowDownRight, ArrowUpRight, ShieldCheck, TrendingDown, Landmark } from 'lucide-react';

const Finance = () => {
  const { sales, expenses } = useStore();

  const financialData = useMemo(() => {
    // 1. Calculate Expenses & Payroll
    const payrollTotal = expenses.filter(e => e.category === 'Salary').reduce((sum, e) => sum + e.amount, 0);
    const otherExpenses = expenses.filter(e => e.category !== 'Salary').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = payrollTotal + otherExpenses;

    // 2. Calculate Cash Flow (Physical Drawer)
    // Sales marked as 'Cash'
    const cashSales = sales.filter(s => s.paymentMethod === 'Cash' && s.status !== 'Refunded');
    const cashRefunds = sales.filter(s => s.paymentMethod === 'Cash' && s.status === 'Refunded');
    
    const cashIn = cashSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const cashRefundAmount = cashRefunds.reduce((sum, s) => sum + s.totalAmount, 0);
    const netCashBalance = cashIn - cashRefundAmount;

    // 3. Calculate Merchant Flow (EVC Plus / Zaad / Card)
    // Any sale NOT 'Cash' goes here (Mobile Money, Card, etc.)
    const digitalSales = sales.filter(s => s.paymentMethod !== 'Cash' && s.status !== 'Refunded');
    const digitalRefunds = sales.filter(s => s.paymentMethod !== 'Cash' && s.status === 'Refunded');

    const digitalGross = digitalSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const digitalRefundAmount = digitalRefunds.reduce((sum, s) => sum + s.totalAmount, 0);
    
    // VAT Calculation (Assuming 5% is included in the total price: Total / 1.05 = Base, Total - Base = Tax)
    // Or strictly 5% of the gross for government compliance view
    const vatAmount = digitalGross - (digitalGross / 1.05); 
    
    // Merchant Net = Gross - VAT - Refunds
    const merchantNetBalance = digitalGross - vatAmount - digitalRefundAmount;

    // 4. Global Totals
    // Total Net Available = Cash + Merchant Net (Expenses are usually paid out of this, but visual shows Balance available)
    const totalNetBalance = netCashBalance + merchantNetBalance;

    return {
      cashIn,
      cashRefundAmount,
      netCashBalance,
      digitalGross,
      digitalRefundAmount,
      vatAmount,
      merchantNetBalance,
      totalNetBalance,
      totalExpenses,
      payrollTotal,
      otherExpenses
    };
  }, [sales, expenses]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Treasury & Accounts</h2>
          <p className="text-sm text-gray-500 font-medium">Track cash flow and merchant balances.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
           <ShieldCheck size={14} /> VAT 5% AUTO-DEDUCTED
        </div>
      </div>

      {/* Main Hero Card (Dark) */}
      <div className="bg-primary-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Total Net Balance</p>
            <h1 className="text-6xl font-black tracking-tighter mb-8">${financialData.totalNetBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Cash Summary */}
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Cash Drawer</p>
                  <p className="text-xl font-bold">${financialData.netCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
               </div>

               {/* Merchant Summary */}
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Merchant (Net)</p>
                  <p className="text-xl font-bold text-emerald-400">${financialData.merchantNetBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
               </div>

               {/* Expense Summary (Red) */}
               <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Total Expenses</p>
                  <p className="text-xl font-bold text-red-400">-${financialData.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
               </div>
            </div>
         </div>
         
         <Landmark className="absolute bottom-8 right-8 text-white/5 w-40 h-40" />
      </div>

      {/* Row 2: Cash Drawer & Merchant Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Card 1: Sanduuqa Caddaanka */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h3 className="text-xl font-bold text-gray-900">Cash Drawer</h3>
                  <p className="text-xl font-medium text-gray-500">Physical Cash Drawer</p>
               </div>
               <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <Wallet size={20} />
               </div>
            </div>

            <div className="space-y-5 flex-1">
               <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 text-xs uppercase tracking-wide">Sales (Cash In)</span>
                  <span className="font-bold text-emerald-600">+${financialData.cashIn.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 text-xs uppercase tracking-wide">Refunds</span>
                  <span className="font-bold text-red-500">-${financialData.cashRefundAmount.toFixed(0)}</span>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cash Balance Available</p>
               <h2 className="text-4xl font-black text-primary-900 tracking-tighter">${financialData.netCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>
         </div>

         {/* Card 2: Merchant Account */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h3 className="text-xl font-bold text-gray-900">Merchant Account</h3>
                  <p className="text-xl font-medium text-gray-500">EVC-Plus / Zaad Ledger</p>
               </div>
               <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Smartphone size={20} />
               </div>
            </div>

            <div className="space-y-5 flex-1">
               <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 text-xs uppercase tracking-wide">Total Received (Gross)</span>
                  <span className="font-bold text-gray-900">${financialData.digitalGross.toFixed(3)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                     <ArrowDownRight size={14} className="text-red-500" />
                     <span className="font-black text-red-500 text-xs uppercase tracking-wide">Govt Tax (VAT 5%)</span>
                  </div>
                  <span className="font-bold text-red-500">-${financialData.vatAmount.toFixed(3)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-400 text-xs uppercase tracking-wide">Reversals/Refunds</span>
                  <span className="font-bold text-gray-400">-${financialData.digitalRefundAmount.toFixed(0)}</span>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
               <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Real Merchant Balance</p>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <h2 className="text-4xl font-black text-primary-900 tracking-tighter">${financialData.merchantNetBalance.toLocaleString(undefined, { minimumFractionDigits: 3 })}</h2>
               <p className="text-[10px] text-gray-400 mt-2 font-medium">This is your actual remaining balance after VAT.</p>
            </div>
         </div>
      </div>

      {/* Row 3: Outflow & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Operational Outflow */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-red-500">
               <TrendingDown size={20} />
               <h3 className="text-lg font-black text-primary-900 uppercase">Operational Outflow</h3>
            </div>
            
            <div className="space-y-6">
               <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-500">Expenses</span>
                  <span className="text-lg font-black text-gray-900">${financialData.otherExpenses.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Payroll</span>
                  <span className="text-lg font-black text-gray-900">${financialData.payrollTotal.toLocaleString()}</span>
               </div>
            </div>
         </div>

         {/* Government Compliance (Green Card) */}
         <div className="bg-emerald-600 p-8 rounded-[32px] shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
            
            <div className="relative z-10">
               <h3 className="text-lg font-bold mb-2">Government Compliance</h3>
               <p className="text-emerald-100 text-xs leading-relaxed max-w-sm">
                  5% VAT is calculated on all merchant sales. This helps you track your Net Income accurately.
               </p>
            </div>

            <div className="relative z-10 mt-6">
               <h2 className="text-4xl font-black tracking-tighter">${financialData.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 3 })}</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mt-1">VAT Accumulated</p>
            </div>
         </div>

      </div>

    </div>
  );
};

export default Finance;