import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { LogIn, Shirt, ShieldAlert, Mail, Lock, Eye, EyeOff, Loader2, PlayCircle } from 'lucide-react';

const Login = () => {
  const { loginWithEmail, enterDemoMode } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setErrorMsg('Network error. Check your internet connection.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Too many attempts. Please try again later.');
      } else {
        setErrorMsg('Login failed. Please check credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] border-[40px] border-white rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-accent-500 rounded-[20px] flex items-center justify-center shadow-2xl shadow-accent-500/40 transform -rotate-6 mb-4">
            <Shirt size={40} className="text-primary-900" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter leading-none">CARWO DHAR</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-500 mt-2">Professional POS</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
          <p className="text-slate-400 text-sm text-center mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl font-medium animate-in slide-in-from-top-2 flex items-center gap-2">
                <ShieldAlert size={16} />
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-accent-500 text-primary-900 py-5 rounded-2xl font-black uppercase tracking-wider hover:bg-accent-600 shadow-xl shadow-accent-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
             <button 
                onClick={enterDemoMode}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest"
             >
                <PlayCircle size={16} /> Launch Demo Mode
             </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Powered by Carwo Dhar Tech v4.2</p>
        </div>
      </div>
    </div>
  );
};

export default Login;