
import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, AlertCircle, Loader2, Globe, Sparkles, ChevronRight, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';
import { db } from '../services/databaseService';
import { User } from '../types';
import RacIcon from '../components/RacIcon';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  
  // Authentication State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Setup Workflow State
  const [setupUser, setSetupUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.authenticate(username, password);
      
      if (response.status === 'needs_setup' && response.user) {
          setSetupUser(response.user);
      } else if (response.status === 'success' && response.user) {
          await db.addLog('AUDIT', 'USER_LOGIN_SUCCESS', response.user.name, { method: 'Standard Form' });
          login(response.user);
      } else {
          await db.addLog('WARN', 'USER_LOGIN_FAILED', username, { method: 'Standard Form' });
          setError(t.login.invalid);
      }
    } catch (err) {
      setError('System Error. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSetup = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!newPassword || newPassword.length < 6) {
          setError(t.login.errorMinChar);
          return;
      }

      if (newPassword !== confirmPassword) {
          setError(t.login.errorMatch);
          return;
      }

      setIsSettingUp(true);
      try {
          if (setupUser) {
              await db.updateUserPassword(setupUser.id, newPassword);
              await db.addLog('AUDIT', 'USER_PASSWORD_SETUP', setupUser.name, { action: 'Initial Setup' });
              login({ ...setupUser, status: 'Active' });
          }
      } catch (err: any) {
          setError(err?.message || t.login.errorSave);
      } finally {
          setIsSettingUp(false);
      }
  };

  const handleLanguageToggle = () => {
      const nextLang = language === 'en' ? 'pt' : 'en';
      setLanguage(nextLang);
  };

  // Decorative Background Icons configuration
  const bgIcons = [
    { code: 'RAC01', pos: 'top-[10%] left-[5%]', size: 100, delay: '0s', dur: '8s' },
    { code: 'RAC02', pos: 'top-[15%] right-[8%]', size: 120, delay: '1s', dur: '10s' },
    { code: 'RAC03', pos: 'bottom-[20%] left-[10%]', size: 90, delay: '2s', dur: '7s' },
    { code: 'RAC06', pos: 'bottom-[15%] right-[12%]', size: 110, delay: '0.5s', dur: '9s' },
    { code: 'RAC08', pos: 'top-[45%] left-[-2%]', size: 80, delay: '3s', dur: '11s' },
    { code: 'RAC05', pos: 'bottom-[40%] right-[-3%]', size: 95, delay: '1.5s', dur: '8.5s' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 font-sans relative overflow-hidden text-white transition-colors duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/5 blur-[120px] rounded-full animate-pulse-slow"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Decorative Floating RAC Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {bgIcons.map((icon, idx) => (
          <div 
            key={idx} 
            className={`absolute ${icon.pos} opacity-20 transition-opacity hover:opacity-40`}
            style={{ 
              animation: `float ${icon.dur} ease-in-out infinite`,
              animationDelay: icon.delay 
            }}
          >
            <RacIcon 
              racCode={icon.code} 
              size={icon.size} 
              className="bg-transparent shadow-none dark:bg-transparent"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        
        {/* Branding Area */}
        <div className="text-center mb-10">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative h-20 w-20 bg-slate-900 rounded-3xl border-2 border-slate-700 flex items-center justify-center shadow-2xl">
              <Shield size={44} className="text-yellow-500" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">
              {t.login.title ? t.login.title.split(' ')[0] : 'CARS'} <span className="text-yellow-500">{t.login.title ? (t.login.title.split(' ')[1] || '') : 'Manager'}</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">{t.login.subtitle}</p>
        </div>

        {/* Login/Setup Form */}
        <div className="bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl ring-1 ring-white/5 overflow-hidden">
          
          {setupUser ? (
              <form onSubmit={handlePasswordSetup} className="space-y-6 animate-slide-in-right">
                  <div className="text-center space-y-2 mb-2">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl w-fit mx-auto border border-indigo-500/30 text-indigo-400">
                        <Key size={32} />
                      </div>
                      <h2 className="text-xl font-black">{t.login.welcome.replace('{name}', setupUser.name)}</h2>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                          {t.login.setupDesc}
                      </p>
                  </div>

                  <div className="space-y-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.login.newKey}</label>
                          <div className="relative group">
                              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500" />
                              <input 
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border-2 border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                placeholder={t.login.newKeyPlaceholder}
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.login.confirmKey}</label>
                          <div className="relative group">
                              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500" />
                              <input 
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border-2 border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                placeholder="••••••••"
                              />
                          </div>
                      </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <AlertCircle size={18} className="shrink-0" />
                      <span className="text-xs font-bold">{error}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSettingUp}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSettingUp ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        <span>{t.login.applying}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        <span>{t.login.activateBtn}</span>
                        <ChevronRight size={20} />
                      </>
                    )}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setSetupUser(null)}
                    className="w-full text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
                  >
                      {t.login.backToLogin}
                  </button>
              </form>
          ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.login.usernameLabel}</label>
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
                      placeholder={t.login.usernamePlaceholder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.login.passwordLabel}</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-800/50 border-2 border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                      placeholder={t.login.passwordPlaceholder}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <AlertCircle size={18} className="shrink-0" />
                    <span className="text-xs font-bold">{error}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 py-4 rounded-2xl font-black text-lg shadow-xl shadow-yellow-500/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>{t.login.establishing}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>{t.login.submitBtn}</span>
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </form>
          )}
        </div>

        {/* Language & Extra Controls */}
        <div className="mt-8 flex justify-between items-center px-4">
          <button 
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <Globe size={14} />
            {language === 'en' ? 'Português' : 'English'}
          </button>
          
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {t.login.version}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
