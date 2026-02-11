import React, { useState } from 'react';
import { Settings as SettingsIcon, Store, Bell, Shield, Cloud, CreditCard, Save } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Store General', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'sync', label: 'Cloud Sync', icon: Cloud },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
          <p className="text-sm text-gray-500">Configure your store environment</p>
        </div>
        <button className="bg-primary-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-900/20">
          <Save size={18} /> Save All Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-72 space-y-2">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                 activeTab === tab.id 
                  ? 'bg-primary-900 text-white shadow-xl' 
                  : 'text-gray-500 hover:bg-white hover:text-gray-900'
               }`}
             >
               <tab.icon size={20} />
               <span>{tab.label}</span>
             </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
           {activeTab === 'general' && (
             <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Store Name</label>
                      <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500" defaultValue="Carwo Dhar Fashion" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Currency Symbol</label>
                      <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500" defaultValue="$ (USD)" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Primary Contact Email</label>
                      <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500" defaultValue="manager@carwodhar.com" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Tax Percentage (%)</label>
                      <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500" defaultValue="5.0" />
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                   <h4 className="font-bold text-gray-900 mb-4">Receipt Template</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border-2 border-accent-500 bg-accent-50 p-4 rounded-2xl text-center">
                         <p className="font-bold text-accent-600">Professional</p>
                      </div>
                      <div className="border-2 border-gray-100 p-4 rounded-2xl text-center text-gray-400">
                         <p className="font-bold">Compact</p>
                      </div>
                      <div className="border-2 border-gray-100 p-4 rounded-2xl text-center text-gray-400">
                         <p className="font-bold">Modern</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[32px] text-white">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-500/20 text-accent-500 rounded-xl flex items-center justify-center">
                         <SettingsIcon size={24} />
                      </div>
                      <div>
                         <p className="font-bold">Maintenance Mode</p>
                         <p className="text-xs text-white/50">Restrict access to Admin only during updates.</p>
                      </div>
                   </div>
                   <button className="w-12 h-6 bg-white/10 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </button>
                </div>
             </div>
           )}

           {activeTab !== 'general' && (
             <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                <SettingsIcon size={48} className="mb-4 opacity-10 animate-spin-slow" />
                <p className="text-sm font-bold uppercase tracking-widest italic">Module Optimization in Progress</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Settings;