import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Calendar, FileText, ShoppingBag, Download, X, Printer, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Sale } from '../types';

const SalesManagement = () => {
  const { sales, refundSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefund = async () => {
    if (selectedSale) {
      await refundSale(selectedSale.id);
      setShowRefundConfirm(false);
      setSelectedSale(null);
    }
  };

  const handlePrint = () => {
    if (!selectedSale) return;

    const receiptWindow = window.open('', '_blank', 'width=350,height=600');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Receipt ${selectedSale.id}</title>
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; padding: 15px; width: 300px; margin: 0 auto; color: #000; }
              .text-center { text-align: center; }
              .bold { font-weight: bold; }
              .line { border-bottom: 1px dashed #000; margin: 10px 0; }
              .flex { display: flex; justify-content: space-between; }
              .mb-1 { margin-bottom: 4px; }
              .text-xs { font-size: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { text-align: left; font-size: 10px; border-bottom: 1px solid #000; padding-bottom: 4px; }
              td { padding: 4px 0; vertical-align: top; }
            </style>
          </head>
          <body>
            <div class="text-center">
              <h2 class="bold" style="margin:0; font-size: 16px;">CARWO DHAR</h2>
              <p style="margin:4px 0;">Mogadishu, Somalia</p>
              <p style="margin:0;">Tel: +252 61 5000000</p>
            </div>
            <div class="line"></div>
            <div class="mb-1"><span class="bold">Date:</span> ${new Date(selectedSale.date).toLocaleString()}</div>
            <div class="mb-1"><span class="bold">Invoice:</span> ${selectedSale.id}</div>
            <div class="mb-1"><span class="bold">Cashier:</span> Staff</div>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 50%">Item</th>
                  <th style="width: 20%; text-align: center">Qty</th>
                  <th style="width: 30%; text-align: right">Price</th>
                </tr>
              </thead>
              <tbody>
                ${selectedSale.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td style="text-align: center">${item.cartQuantity}</td>
                    <td style="text-align: right">${(item.sellPrice * item.cartQuantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="line"></div>
            
            <div class="flex mb-1">
               <span>Subtotal:</span>
               <span>$${(selectedSale.totalAmount + (selectedSale.discountAmount || 0)).toFixed(2)}</span>
            </div>
            ${selectedSale.discountAmount ? `
            <div class="flex mb-1">
               <span>Discount:</span>
               <span>-$${selectedSale.discountAmount.toFixed(2)}</span>
            </div>` : ''}
            
            <div class="flex bold" style="font-size: 14px; margin-top: 5px;">
               <span>TOTAL:</span>
               <span>$${selectedSale.totalAmount.toFixed(2)}</span>
            </div>
             <div class="flex text-xs" style="margin-top: 5px;">
               <span>Paid via:</span>
               <span>${selectedSale.paymentMethod}</span>
            </div>
            
            <div class="line"></div>
            <div class="text-center">
              <p class="bold" style="margin-bottom: 4px;">Mahadsanid / Thank You!</p>
              <p style="margin:0; font-size: 10px;">Duplicate Receipt</p>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
      receiptWindow.focus();
      receiptWindow.print();
      receiptWindow.close();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>
          <p className="text-sm text-gray-500">Track and manage store transactions & refunds</p>
        </div>
        <button className="bg-white border-2 border-gray-100 text-gray-700 px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-gray-50 font-bold">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Invoice ID or Method..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-600 font-bold text-sm">
              <Calendar size={18} /> Date Range
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Invoice ID</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Method</th>
                <th className="px-8 py-5 text-right">Total Amount</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-primary-900">{sale.id}</td>
                  <td className="px-8 py-6 text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                    <span className="block text-[10px] text-gray-400">{new Date(sale.date).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={14} className="text-blue-500" />
                      <span className="text-sm font-bold text-gray-700">{sale.items.length} Items</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 w-fit ${
                      sale.status === 'Refunded' 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {sale.status === 'Refunded' ? <RotateCcw size={10} /> : <CheckCircle2 size={10} />}
                      {sale.status || 'Completed'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-tighter text-slate-600">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-lg font-black ${sale.status === 'Refunded' ? 'text-gray-400 line-through' : 'text-emerald-600'}`}>
                      ${sale.totalAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedSale(sale)}
                      className="p-2 bg-gray-100 rounded-xl text-gray-400 hover:text-primary-900 transition-colors group-hover:scale-110"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Invoice Details</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{selectedSale.id}</p>
              </div>
              <button onClick={() => setSelectedSale(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                 <div>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Customer Info</p>
                   <p className="text-sm font-bold">Guest Customer</p>
                   <p className="text-xs text-gray-500">Walk-in Transaction</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Date & Time</p>
                   <p className="text-sm font-bold">{new Date(selectedSale.date).toLocaleDateString()}</p>
                   <p className="text-xs text-gray-500">{new Date(selectedSale.date).toLocaleTimeString()}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordered Items</p>
                 <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-3xl overflow-hidden">
                   {selectedSale.items.map((item, idx) => (
                     <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase font-black">{item.category} • {item.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">${item.sellPrice.toFixed(2)} x {item.cartQuantity}</p>
                          <p className="text-xs font-medium text-gray-400">${(item.sellPrice * item.cartQuantity).toFixed(2)}</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
                 <div className="flex justify-between text-sm text-gray-500 font-medium">
                   <span>Subtotal</span>
                   <span>${(selectedSale.totalAmount + (selectedSale.discountAmount || 0)).toFixed(2)}</span>
                 </div>
                 {selectedSale.discountAmount && (
                   <div className="flex justify-between text-sm text-red-500 font-bold italic">
                     <span>Discount</span>
                     <span>-${selectedSale.discountAmount.toFixed(2)}</span>
                   </div>
                 )}
                 <div className="pt-3 border-t border-gray-200 flex justify-between font-black text-2xl text-primary-900">
                   <span>Total</span>
                   <span>${selectedSale.totalAmount.toFixed(2)}</span>
                 </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
               <button 
                onClick={handlePrint}
                className="flex-1 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
               >
                 <Printer size={18} /> Print Receipt
               </button>
               {selectedSale.status !== 'Refunded' ? (
                 <button 
                  onClick={() => setShowRefundConfirm(true)}
                  className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                 >
                   <RotateCcw size={18} /> Refund Sale
                 </button>
               ) : (
                 <div className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-not-allowed italic">
                   Refunded Already
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundConfirm && (
        <div className="fixed inset-0 bg-primary-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-8 animate-in scale-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 italic">ARE YOU SURE?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              This will mark the invoice as <span className="font-bold text-red-600">Refunded</span> and return the items to stock inventory. This action cannot be undone.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleRefund}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all"
              >
                Yes, Refund This
              </button>
              <button 
                onClick={() => setShowRefundConfirm(false)}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;