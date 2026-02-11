import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Edit2, Trash2, Search, Filter, Upload, X, Image as ImageIcon, Ruler } from 'lucide-react';
import { Product } from '../types';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', category: 'Men', size: 'M', color: '', buyPrice: 0, sellPrice: 0, quantity: 0, image: '', unit: 'Piece'
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData(product);
    } else {
      setEditingId(null);
      // Initialize with empty image so upload UI is shown by default
      setFormData({ name: '', category: 'Men', size: 'M', color: '', buyPrice: 0, sellPrice: 0, quantity: 0, image: '', unit: 'Piece' });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      // Use a placeholder if no image is uploaded
      image: formData.image || 'https://placehold.co/200x200?text=No+Image',
      unit: formData.unit || 'Piece'
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct({ ...productData, id: Date.now().toString() } as Product);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-800 shadow-lg shadow-primary-900/20"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
           <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Attributes</th>
                <th className="px-6 py-4 font-medium">Stock / Unit</th>
                <th className="px-6 py-4 font-medium">Price (Buy/Sell)</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                      {product.size}
                    </span>
                    <span className="text-gray-500">{product.color}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.quantity > 10 ? 'bg-green-500' : product.quantity > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm font-medium text-gray-700">{product.quantity}</span>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                        per {product.unit}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">${product.sellPrice}</span>
                      <span className="text-xs text-gray-400">Buy: ${product.buyPrice}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="flex items-start gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  {formData.image ? (
                    <div className="relative group shrink-0">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-20 h-20 rounded-lg object-cover shadow-sm bg-white" 
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  
                  <div className="flex-1 pt-1">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="image-upload"
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                      <label 
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Upload size={16} />
                        Choose Image
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports JPG, PNG and GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                    <option>Accessories</option>
                    <option>Fabrics</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                   <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all appearance-none bg-white" 
                      value={formData.unit} 
                      onChange={e => setFormData({...formData, unit: e.target.value as 'Piece' | 'Yard'})}
                    >
                      <option value="Piece">Piece (Item)</option>
                      <option value="Yard">Yard (Fabric)</option>
                    </select>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                </div>
                <div>
                  {/* DYNAMIC LABEL HERE: Changes based on Unit */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.unit === 'Yard' ? 'Total Stock (Yards)' : 'Quantity (Pieces)'}
                  </label>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    step={formData.unit === 'Yard' ? "0.1" : "1"}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input required type="number" min="0" step="0.01" className="w-full pl-6 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all" value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: Number(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input required type="number" min="0" step="0.01" className="w-full pl-6 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all" value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 font-medium shadow-lg shadow-primary-900/20 transition-all">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;