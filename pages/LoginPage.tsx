
import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, AlertCircle, Loader2, Globe, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await authService.authenticate(username, password);
      if (user) {
        login(user);
      } else {
        setError(language === 'en' ? 'Invalid credentials. Access denied.' : 'Credenciais inválidas. Acesso negado.');
      }
    } catch (err) {
      setError('System Error. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/5 blur-[120px] rounded-full animate-pulse-slow"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        
        {/* Branding Area */}
        <div className="text-center mb-10">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative h-20 w-20 bg-slate-900 rounded-3xl border-2 border-slate-700 flex items-center justify-center shadow-2xl">
              <Shield size={44} className="text-yellow-500" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">CARS <span className="text-yellow-500">MANAGER</span></h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Safety Compliance Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl ring-1 ring-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username / Personnel ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                  placeholder="e.g. Pita Domingos"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Key</label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-shake">
                <AlertCircle size={18} className="shrink-0" />
                <span className="text-xs font-bold">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 py-4 rounded-2xl font-black text-lg shadow-xl shadow-yellow-500/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Establish Link</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Language & Extra Controls */}
        <div className="mt-8 flex justify-between items-center px-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <Globe size={14} />
            {language === 'en' ? 'Português' : 'English'}
          </button>
          
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            v2.5 Architecture • Encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
