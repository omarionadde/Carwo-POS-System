import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Edit2, Trash2, Search, Tag, X, Check } from 'lucide-react';

const Categories = () => {
  const { categories, products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <p className="text-sm text-gray-500">Manage your store product groups</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-900 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-primary-800 transition-all font-bold"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-900/5 flex items-center justify-center text-primary-900">
                <Tag size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16} /></button>
                <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{cat.name}</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-accent-500/10 text-accent-600 rounded-full text-xs font-bold uppercase tracking-widest">
                {getProductCount(cat.name)} Products
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Category</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <input 
              autoFocus
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl mb-6 outline-none focus:border-accent-500 transition-colors"
              placeholder="Category Name (e.g. Winter Wear)"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button className="w-full bg-primary-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Check size={20} /> Save Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;