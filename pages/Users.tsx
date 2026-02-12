
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserPlus, Mail, Shield, MoreVertical, Search, BadgeCheck, X, Check, Trash2, User as UserIcon, RefreshCw, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { User } from '../types';

const Users = () => {
  const { users, addUser, deleteUser, currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    role: 'Staff',
    email: '',
    password: '',
    avatar: 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 100)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await addUser(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        role: 'Staff',
        email: '',
        password: '',
        avatar: 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 100)
      });
      setShowPassword(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
          <p className="text-sm text-gray-500">Manage access and staff roles</p>
        </div>
        <button 
          onClick={() => { setError(null); setIsModalOpen(true); }}
          className="bg-primary-900 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-primary-800 transition-all font-bold"
        >
          <UserPlus size={18} /> Invite User
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder="Search by name or email..." 
               className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500 transition-all"
             />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div key={user.id} className="relative group bg-slate-50 p-6 rounded-[32px] border border-transparent hover:border-accent-500 hover:bg-white hover:shadow-2xl transition-all">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  title="Delete User"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="relative">
                    <img src={user.avatar} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg" alt={user.name} />
                    {user.role === 'Admin' && (
                      <div className="absolute -bottom-1 -right-1 bg-accent-500 text-primary-900 p-1 rounded-lg">
                        <BadgeCheck size={14} />
                      </div>
                    )}
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      {user.name}
                      {user.id === currentUser?.id && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black tracking-widest uppercase">You</span>}
                    </h4>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${user.role === 'Admin' ? 'text-accent-600' : 'text-blue-600'}`}>
                      {user.role}
                    </span>
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Mail size={16} />
                    {user.email}
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Shield size={16} />
                    Status: <span className="text-emerald-500 font-bold">Active</span>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                 <button className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-100 transition-colors">Edit Profile</button>
                 {user.id !== currentUser?.id && (
                   <button 
                    onClick={() => deleteUser(user.id)}
                    className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                   >
                    Remove
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-primary-900">New Team Member</h3>
                <p className="text-sm text-gray-400">Add a new user to the system</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                 <Shield size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => setFormData({...formData, avatar: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 100)}`})}>
                  <img src={formData.avatar} className="w-24 h-24 rounded-[32px] object-cover ring-8 ring-slate-50 shadow-xl" alt="Avatar" />
                  <div className="absolute inset-0 bg-black/40 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <RefreshCw className="text-white" size={24} />
                  </div>
                  <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-full text-center">Click to change</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                   <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Abdullahi Mohamed"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500 transition-all font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        required
                        type="email" 
                        placeholder="staff@carwodhar.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500 transition-all font-bold"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">System Role</label>
                    <select 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500 transition-all font-bold appearance-none"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as 'Admin' | 'Staff'})}
                    >
                      <option value="Staff">Staff (POS)</option>
                      <option value="Admin">Admin (Full Access)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Initial Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        required
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••"
                        className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent-500 transition-all font-bold"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {isLoading ? 'Creating...' : 'Create User Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
