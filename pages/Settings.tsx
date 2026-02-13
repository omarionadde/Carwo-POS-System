import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Globe, 
  Shield, 
  Database, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Check,
  Loader2,
  Cloud
} from 'lucide-react';

const Settings = () => {
  const { currentUser, updateUser, products, sales, users, categories } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState(currentUser?.password || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('$');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await updateUser(currentUser.id, { name });
      // Password update requires Auth API call usually, ignored here for simplicity in Firestore update
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-primary-900 tracking-tight">SETTINGS</h1>
          <p className="text-slate-500 font-medium">Manage your data, language, and security.</p>
        </div>
        <div className="px-5 py-2 bg-emerald-100 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-200 flex items-center gap-2">
           <Cloud className="w-4 h-4" /> Cloud Sync Active
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
              <h3 className="text-xl font-black text-primary-900 tracking-tight uppercase italic">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="px-6 py-2.5 bg-slate-50 text-accent-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-50 transition-all border border-slate-100"
                >
                  Edit Profile
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
                     <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Firebase Account</span>
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
                   {/* Password change hidden for simplicity in this version */}
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="flex-1 py-5 bg-primary-900 text-white font-black rounded-2xl shadow-xl shadow-primary-900/20 disabled:opacity-50 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* SIDEBAR PREFERENCES */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-primary-900 tracking-tight flex items-center gap-2 uppercase italic">
              <Globe className="w-5 h-5 text-accent-500" /> Regional Preferences
            </h3>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Language</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-sm shadow-sm appearance-none border border-transparent focus:border-accent-500 transition-all"
                  >
                    <option value="en">English (POS)</option>
                    <option value="so">Somali</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
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

          <div className="bg-emerald-50 rounded-[2.5rem] p-8 text-emerald-900 shadow-inner relative overflow-hidden border border-emerald-100">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cloud className="w-32 h-32" />
             </div>
             <h4 className="text-lg font-black mb-4 tracking-tight relative z-10 uppercase italic">System Status</h4>
             <p className="text-emerald-700 text-xs font-medium leading-relaxed relative z-10 mb-6">
                System is running Online. Data is synchronized with Google Firebase servers in real-time.
             </p>
             <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-emerald-100">
                   <span className="text-[10px] font-black uppercase tracking-widest">Database</span>
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase">Firestore</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-emerald-100">
                   <span className="text-[10px] font-black uppercase tracking-widest">Cloud Sync</span>
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase">Active</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;