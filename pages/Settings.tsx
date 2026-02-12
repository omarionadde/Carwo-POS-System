
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Globe, 
  Shield, 
  Save, 
  Lock, 
  Database, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Check,
  Loader2,
  RefreshCw
} from 'lucide-react';

const Settings = () => {
  const { currentUser, updateUser, products, sales, users, categories } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState(currentUser?.password || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [language, setLanguage] = useState('so');
  const [currency, setCurrency] = useState('$');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await updateUser(currentUser.id, { name, password });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Robust deep cleaning function to handle circular references and Firestore objects
  const deepClean = (input: any, visited = new WeakSet()): any => {
    if (input === null || input === undefined) return input;
    if (typeof input !== 'object') return input;
    
    // Check for cycles
    if (visited.has(input)) return '[Circular]';
    visited.add(input);

    // Handle Date
    if (input instanceof Date) return input.toISOString();

    // Handle Arrays
    if (Array.isArray(input)) {
      return input.map(item => deepClean(item, visited));
    }

    // Handle Firestore Timestamp (has toDate method) or similar objects
    if (input && typeof input.toDate === 'function') {
        try {
            return input.toDate().toISOString();
        } catch (e) {
            return input.toString();
        }
    }

    // Handle Plain Objects
    const cleanObj: any = {};
    // Only iterate enumerable properties
    Object.keys(input).forEach(key => {
       const value = input[key];
       
       // Filter out potentially problematic keys or DOM nodes
       // Firestore internal properties often start with _ or contain 'delegate'
       if (key.startsWith('_') || key === 'auth' || key === 'storage' || key === 'firestore' || typeof value === 'function') return;
       
       // Explicit check for DOM nodes to be safe
       if (value && typeof value === 'object' && value.nodeType) return;

       cleanObj[key] = deepClean(value, visited);
    });

    return cleanObj;
  };

  const downloadMasterBackup = () => {
    try {
      const backupData = {
        store: "Carwo Dhar Fashion",
        version: "4.2.0",
        timestamp: new Date().toISOString(),
        data: {
          products: deepClean(products),
          sales: deepClean(sales),
          users: deepClean(users),
          categories: deepClean(categories)
        }
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CarwoDhar_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Backup failed:", error);
      alert("Failed to generate backup. Please check console for details.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-primary-900 tracking-tight">HAYEELKA (SETTINGS)</h1>
          <p className="text-slate-500 font-medium">Habeey xogtaada, luuqadda, iyo amniga system-ka.</p>
        </div>
        <div className="px-5 py-2 bg-accent-500/10 text-accent-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-accent-500/20 flex items-center gap-2">
           <Database className="w-4 h-4" /> Cloud Sync: Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* PROFILE SECTION */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
               <User className="w-40 h-40" />
            </div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-xl font-black text-primary-900 tracking-tight uppercase italic">Xogtaada Gaarka Ah</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="px-6 py-2.5 bg-slate-50 text-accent-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-50 transition-all border border-slate-100"
                >
                  Wax ka bedel
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="flex items-center gap-8 relative z-10">
                <div className="relative">
                   <img src={currentUser?.avatar} className="w-28 h-28 rounded-[2.5rem] object-cover bg-slate-50 border-4 border-white shadow-xl" alt="" />
                   <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                      <CheckCircle className="w-4 h-4" />
                   </div>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-primary-900 tracking-tight">{currentUser?.name}</h4>
                  <p className="text-slate-500 font-bold mt-1">{currentUser?.email}</p>
                  <div className="flex gap-2 mt-4">
                     <span className="px-4 py-1.5 bg-primary-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-900/20">{currentUser?.role}</span>
                     <span className="px-4 py-1.5 bg-accent-500 text-primary-900 rounded-xl text-[10px] font-black uppercase tracking-widest">Verified ID</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-accent-500 transition-all" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Password</label>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-accent-500 transition-all" 
                        placeholder="••••••••" 
                      />
                   </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="flex-1 py-5 bg-primary-900 text-white font-black rounded-2xl shadow-xl shadow-primary-900/20 disabled:opacity-50 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    {isSaving ? 'Kaydinaya...' : 'Kaydi Isbedelada'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                  >
                    Jooji
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* MASTER BACKUP */}
          <div className="bg-primary-900 rounded-[3rem] p-10 text-white border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
               <Database className="w-40 h-40" />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-2 uppercase italic">Master System Backup</h3>
                <p className="text-slate-400 text-sm font-medium mb-8 max-w-lg leading-relaxed">
                  Soo deji dhammaan xogta dukaanka (Products, Sales, Users, Categories) oo isku duuban. Waxaad u isticmaali kartaa inaad ku keydiso computer kale ama aad dib ugu soo celiso haddii wax xumaadaan.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                     onClick={downloadMasterBackup}
                     className="px-8 py-4 bg-accent-500 text-primary-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-600 transition-all flex items-center justify-center gap-2 shadow-xl"
                   >
                     <Download className="w-4 h-4" /> Generate JSON Backup
                   </button>
                   <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <AlertTriangle className="w-4 h-4 text-accent-500" /> Recommendation: Backup Weekly
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR PREFERENCES */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-primary-900 tracking-tight flex items-center gap-2 uppercase italic">
              <Globe className="w-5 h-5 text-accent-500" /> Regional Dookhyada
            </h3>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Luuqadda System-ka</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-sm shadow-sm appearance-none border border-transparent focus:border-accent-500 transition-all"
                  >
                    <option value="so">Somali (Default)</option>
                    <option value="en">English (POS)</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lacagta (Currency)</label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)} 
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-sm shadow-sm appearance-none border border-transparent focus:border-accent-500 transition-all"
                  >
                    <option value="$">USD ($) - Default</option>
                    <option value="SOS">SOS - Somalia Shilling</option>
                  </select>
               </div>
            </div>
          </div>

          <div className="bg-accent-500 rounded-[2.5rem] p-8 text-primary-900 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield className="w-32 h-32" />
             </div>
             <h4 className="text-lg font-black mb-4 tracking-tight relative z-10 uppercase italic">Security Status</h4>
             <p className="text-primary-900/70 text-xs font-medium leading-relaxed relative z-10 mb-6">
                Carwo Dhar uses professional-grade Firebase SSL encryption and real-time database syncing.
             </p>
             <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                   <span className="text-[10px] font-black uppercase tracking-widest">SSL Sync</span>
                   <span className="px-3 py-1 bg-primary-900 text-white rounded-lg text-[9px] font-black uppercase">Active</span>
                </div>
                <div className="flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                   <span className="text-[10px] font-black uppercase tracking-widest">Cloud Backup</span>
                   <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase">Enabled</span>
                </div>
             </div>
          </div>

          <div className="bg-primary-900/5 p-6 rounded-[2rem] border border-dashed border-primary-900/20 text-center">
             <p className="text-[10px] font-black text-primary-900/30 uppercase tracking-[0.3em]">Carwo Dhar POS v4.2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
