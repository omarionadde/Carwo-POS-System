import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Plus, Minus, CreditCard, ShoppingBag, X, Ruler, Check, DollarSign, Tag, Smartphone, Printer, ArrowRight } from 'lucide-react';
import { Product, CartItem, Sale } from '../types';

const POS = () => {
  const { products, addSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [applyTax, setApplyTax] = useState(true);

  // Success / Receipt Modal State
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Mobile Money'>('Cash');

  // Discount State
  const [discountValue, setDiscountValue] = useState<string>('0');

  // Yardage Modal State
  const [yardageModalOpen, setYardageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [yardAmount, setYardAmount] = useState<string>('1');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleProductClick = (product: Product) => {
    if (product.quantity <= 0) return;

    if (product.unit === 'Yard') {
      setSelectedProduct(product);
      setYardAmount('1');
      setYardageModalOpen(true);
    } else {
      addToCart(product, 1);
    }
  };

  const confirmYardage = () => {
    const amount = parseFloat(yardAmount);
    if (selectedProduct && amount > 0) {
      addToCart(selectedProduct, amount);
      setYardageModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.quantity <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        const newTotal = existing.cartQuantity + quantity;
        if (newTotal > product.quantity) {
             alert(`Not enough stock. Only ${product.quantity} available.`);
             return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, cartQuantity: newTotal } : item
        );
      }
      
      if (quantity > product.quantity) {
          alert(`Not enough stock. Only ${product.quantity} available.`);
          return prev;
      }

      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.cartQuantity + delta;
        const roundedQty = Math.round(newQty * 100) / 100;
        
        if (roundedQty > item.quantity) {
             return item; 
        }
        return roundedQty > 0 ? { ...item, cartQuantity: roundedQty } : item;
      }
      return item;
    }));
  };
  
  const handleManualQuantityChange = (id: string, val: string) => {
      const qty = parseFloat(val);
      if (isNaN(qty) || qty < 0) return;
      
       setCart(prev => prev.map(item => {
        if (item.id === id) {
           if (qty > item.quantity) return item; 
           return { ...item, cartQuantity: qty };
        }
        return item;
       }));
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.sellPrice * item.cartQuantity), 0);
  const tax = applyTax ? subtotal * 0.05 : 0; 

  const discountAmount = useMemo(() => {
    return parseFloat(discountValue) || 0;
  }, [discountValue]);

  const total = Math.max(0, subtotal + tax - discountAmount);

  const handleCheckout = async () => {
    const saleData = {
      items: cart,
      totalAmount: total,
      discountAmount: discountAmount,
      date: new Date().toISOString(),
      paymentMethod: paymentMethod,
      status: 'Completed' as const
    };
    
    const saleId = await addSale(saleData);
    
    // Store complete sale object with ID for printing
    setLastSale({ ...saleData, id: saleId });
    
    // Reset Cart & UI but show success modal
    setCart([]);
    setDiscountValue('0');
    setPaymentMethod('Cash');
    setShowCheckout(false);
    setShowSuccess(true);
  };

  const printReceipt = () => {
    if (!lastSale) return;

    const receiptWindow = window.open('', '_blank', 'width=350,height=600');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Receipt ${lastSale.id}</title>
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; padding: 15px; width: 300px; margin: 0 auto; color: #000; }
              .text-center { text-align: center; }
              .bold { font-weight: bold; }
              .text-right { text-align: right; }
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
            <div class="mb-1"><span class="bold">Date:</span> ${new Date(lastSale.date).toLocaleString()}</div>
            <div class="mb-1"><span class="bold">Invoice:</span> ${lastSale.id}</div>
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
                ${lastSale.items.map(item => `
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
               <span>$${(lastSale.totalAmount + (lastSale.discountAmount || 0)).toFixed(2)}</span>
            </div>
            ${lastSale.discountAmount ? `
            <div class="flex mb-1">
               <span>Discount:</span>
               <span>-$${lastSale.discountAmount.toFixed(2)}</span>
            </div>` : ''}
            
            <div class="flex bold" style="font-size: 14px; margin-top: 5px;">
               <span>TOTAL:</span>
               <span>$${lastSale.totalAmount.toFixed(2)}</span>
            </div>
             <div class="flex text-xs" style="margin-top: 5px;">
               <span>Paid via:</span>
               <span>${lastSale.paymentMethod}</span>
            </div>
            
            <div class="line"></div>
            <div class="text-center">
              <p class="bold" style="margin-bottom: 4px;">Mahadsanid / Thank You!</p>
              <p style="margin:0; font-size: 10px;">No refunds after 24 hours.</p>
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
    <div className="flex h-[calc(100vh-2rem)] gap-6 relative">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Search Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products by name or category..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
            <option>Fabrics</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-2">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => handleProductClick(product)}
              className={`bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-lg flex flex-col h-full group ${product.quantity === 0 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="relative w-full aspect-square mb-3 bg-white rounded-xl overflow-hidden flex items-center justify-center">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                
                {product.quantity === 0 && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-gray-800 font-bold text-sm backdrop-blur-sm">
                    Out of Stock
                  </div>
                )}
                
                {product.unit === 'Yard' && (
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Ruler size={10} /> Yard
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <h4 className="font-bold text-gray-900 text-[15px] leading-tight mb-1 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-auto">
                  {product.category}
                </p>

                <div className="flex items-center justify-between mt-4 pt-2">
                  <span className="font-bold text-gray-900 text-lg">
                    ${product.sellPrice.toFixed(2)}
                  </span>
                  
                  <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ${
                    product.quantity <= 10 
                      ? 'bg-red-50 text-red-500' 
                      : 'bg-blue-50 text-blue-500'
                  }`}>
                    Stock: {product.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-blue-500" /> Current Order
          </h2>
          <button onClick={() => setCart([])} className="text-xs text-red-500 hover:text-red-700">Clear All</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <ShoppingBag size={48} className="mb-2 opacity-20" />
              <p>Cart is empty</p>
              <p className="text-xs">Select products to start a sale</p>
            </div>
          ) : (
            cart.map(item => {
                const step = item.unit === 'Yard' ? 0.25 : 1;
                return (
              <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg group hover:bg-gray-100 transition-colors">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-white" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500">${item.sellPrice} / {item.unit}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 px-1 py-0.5">
                      <button onClick={() => updateQuantity(item.id, -step)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><Minus size={12} /></button>
                      <input 
                        type="number"
                        className="w-12 text-center text-sm font-medium focus:outline-none bg-transparent"
                        value={item.cartQuantity}
                        onChange={(e) => handleManualQuantityChange(item.id, e.target.value)}
                      />
                      <button onClick={() => updateQuantity(item.id, step)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><Plus size={12} /></button>
                    </div>
                    <span className="font-bold text-gray-800">${(item.sellPrice * item.cartQuantity).toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                  title="Remove Item"
                >
                  <X size={16} />
                </button>
              </div>
            )})
          )}
        </div>

        {/* Pricing Summary */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
          
          {/* Discount Section - Only Fixed Amount */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-primary-900 font-bold text-xs uppercase tracking-wider">
                <Tag size={14} className="text-accent-500" /> Apply Discount
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">Discount Amount</div>
            </div>
            <div className="relative">
              <input 
                type="number" 
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent-500"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign size={14} />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            {/* VAT Toggle & Display */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <button 
                  onClick={() => setApplyTax(!applyTax)}
                  className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${applyTax ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${applyTax ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-xs text-gray-500">VAT (5%)</span>
               </div>
               <span className={`font-medium ${applyTax ? 'text-gray-800' : 'text-gray-300 line-through'}`}>${tax.toFixed(2)}</span>
            </div>

            {/* Discount Display */}
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-500 font-bold italic animate-in slide-in-from-right-2">
                <span className="flex items-center gap-1">
                  <Tag size={12} /> Discount
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-xl text-primary-900">
              <span>Total</span>
              <span className="text-accent-600">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-primary-900 text-white py-4 rounded-2xl font-bold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary-900/10"
          >
            <CreditCard size={20} /> Process Payment
          </button>
        </div>
      </div>

      {/* Yardage Selection Modal */}
      {yardageModalOpen && selectedProduct && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-[24px]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-in fade-in zoom-in duration-200 border border-gray-100">
             <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-lg text-gray-900">Select Yards</h3>
                  <p className="text-xs text-gray-500">{selectedProduct.name}</p>
               </div>
               <button onClick={() => setYardageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X size={20} />
               </button>
             </div>
             
             <div className="mb-6">
                <div className="flex items-center border-2 border-primary-900 rounded-xl overflow-hidden mb-3">
                   <button 
                     onClick={() => {
                        const val = parseFloat(yardAmount) || 0;
                        if(val > 0.5) setYardAmount((val - 0.5).toFixed(2));
                     }}
                     className="bg-gray-100 px-4 py-3 hover:bg-gray-200 font-bold text-xl"
                   >-</button>
                   <input 
                      type="number" 
                      step="0.1"
                      className="flex-1 py-3 text-center text-2xl font-bold focus:outline-none"
                      value={yardAmount}
                      onChange={(e) => setYardAmount(e.target.value)}
                   />
                   <button 
                      onClick={() => {
                        const val = parseFloat(yardAmount) || 0;
                        setYardAmount((val + 0.5).toFixed(2));
                     }}
                      className="bg-gray-100 px-4 py-3 hover:bg-gray-200 font-bold text-xl"
                   >+</button>
                </div>
                <div className="flex gap-2">
                   {[1, 2, 3, 5].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setYardAmount(amt.toString())}
                        className="flex-1 py-1 text-xs font-bold border border-gray-200 rounded-lg hover:bg-primary-900 hover:text-white transition-colors"
                      >
                        {amt}y
                      </button>
                   ))}
                </div>
             </div>

             <button 
                onClick={confirmYardage}
                className="w-full bg-primary-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-800"
             >
                <Check size={18} /> Add to Order
             </button>
          </div>
        </div>
      )}

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black italic tracking-tighter">CHECKOUT</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="text-center py-8 bg-slate-50 rounded-3xl mb-8 border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Amount Due</p>
              <h1 className="text-5xl font-black text-primary-900 tracking-tighter">${total.toFixed(2)}</h1>
              {discountAmount > 0 && (
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
                  <Tag size={12} /> Applied Saved: ${discountAmount.toFixed(2)}
                </div>
              )}
            </div>

            <p className="text-sm font-bold text-slate-800 mb-4">Select Payment Method</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setPaymentMethod('Cash')}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl font-bold transition-all hover:scale-[1.02] ${
                  paymentMethod === 'Cash' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' 
                    : 'border-slate-100 bg-white text-slate-400 hover:border-emerald-200'
                }`}
              >
                <DollarSign className="mb-2" size={24} />
                Cash
              </button>
              <button 
                onClick={() => setPaymentMethod('Mobile Money')}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl font-bold transition-all hover:scale-[1.02] ${
                   paymentMethod === 'Mobile Money' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                    : 'border-slate-100 bg-white text-slate-400 hover:border-blue-200'
                }`}
              >
                <Smartphone className="mb-2" size={24} />
                Mobile / Card
              </button>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-primary-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-800 shadow-xl shadow-primary-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Check size={20} /> Complete Sale
            </button>
          </div>
        </div>
      )}

      {/* Success / Print Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-primary-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-8 animate-in zoom-in duration-300 text-center">
             <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/40 animate-bounce">
                <Check size={40} className="text-white" />
             </div>
             <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter mb-2">PAYMENT SUCCESS!</h2>
             <p className="text-gray-500 text-sm mb-8 font-medium">Transaction has been recorded successfully.</p>
             
             <div className="space-y-3">
                <button 
                  onClick={printReceipt}
                  className="w-full bg-primary-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-800 flex items-center justify-center gap-2 shadow-xl shadow-primary-900/20"
                >
                  <Printer size={18} /> Print Receipt
                </button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  New Sale <ArrowRight size={16} />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;