
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Wine, Zap, Lock, Activity, 
  Bluetooth, AlertOctagon,
  AlertTriangle, HardHat, ServerOff, ScanFace,
  Wifi, Database, UserX, Clock, RotateCcw,
  ShieldCheck, ArrowRight
} from 'lucide-react';

const AlcoholIntegration: React.FC = () => {
  const { t } = useLanguage();

  if (!t || !t.alcohol) {
    return <div className="p-6 text-slate-500">Loading module...</div>;
  }

  return (
    <div className="flex flex-col h-full space-y-8 pb-24 animate-fade-in-up">
      
      {/* --- HERO SECTION --- */}
      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 text-white min-h-[450px] flex items-center justify-center p-8 md:p-16 border border-slate-800">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
              <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse-slow delay-700"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="mb-8 p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl inline-block transform hover:scale-105 transition-transform duration-500">
                  <Wine size={64} className="text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                  {t.alcohol.banner.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 max-w-3xl font-light">
                  {t.alcohol.banner.desc}
              </p>

              <div className="flex items-center gap-4 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 font-bold text-sm tracking-widest uppercase backdrop-blur-md shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </div>
                  {t.alcohol.banner.status}
              </div>
          </div>
      </div>

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: VISION & FEATURES */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Vision Cards */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Activity size={32} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                          {t.alcohol.features.title}
                      </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FeatureCard 
                          icon={Wifi} 
                          color="blue" 
                          title={t.alcohol.features.iotTitle} 
                          desc={t.alcohol.features.iotDesc} 
                      />
                      <FeatureCard 
                          icon={UserX} 
                          color="red" 
                          title={t.alcohol.features.accessTitle} 
                          desc={t.alcohol.features.accessDesc} 
                      />
                      <FeatureCard 
                          icon={Database} 
                          color="green" 
                          title={t.alcohol.features.complianceTitle} 
                          desc={t.alcohol.features.complianceDesc} 
                      />
                  </div>
              </div>

              {/* Protocol Flow */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 shadow-2xl border border-slate-700 text-white relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700 transform group-hover:rotate-12">
                      <RotateCcw size={300} />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck size={32} />
                      </div>
                      <h3 className="text-3xl font-black tracking-tight">
                          {t.alcohol.protocol.title}
                      </h3>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      {/* Step 1: Positive */}
                      <div className="flex-1 bg-red-500/10 border border-red-500/30 p-8 rounded-[2rem] backdrop-blur-sm hover:bg-red-500/20 transition-colors">
                          <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                  <AlertTriangle size={28} />
                              </div>
                              <h4 className="font-bold text-xl text-red-200 tracking-tight">{t.alcohol.protocol.positiveTitle}</h4>
                          </div>
                          <p className="text-slate-400 text-base leading-relaxed font-medium">
                              {t.alcohol.protocol.positiveDesc}
                          </p>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center justify-center text-slate-600">
                          <ArrowRight size={40} strokeWidth={3} />
                      </div>

                      {/* Step 2: Reset */}
                      <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-[2rem] backdrop-blur-sm hover:bg-emerald-500/20 transition-colors">
                          <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                  <Clock size={28} />
                              </div>
                              <h4 className="font-bold text-xl text-emerald-200 tracking-tight">{t.alcohol.protocol.resetTitle}</h4>
                          </div>
                          <p className="text-slate-400 text-base leading-relaxed font-medium">
                              {t.alcohol.protocol.resetDesc}
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          {/* RIGHT COL: CHALLENGES & SOLUTIONS */}
          <div className="space-y-8">
              
              {/* Challenges */}
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-[2.5rem] p-8 border border-amber-100 dark:border-amber-900/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-500">
                        <AlertOctagon size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400 tracking-tight">
                          {t.alcohol.challenges.title}
                      </h3>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-2">
                              <ServerOff size={16} className="text-amber-500"/> OEM Cloud Issue
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                              {t.alcohol.challenges.oemIssue}
                          </p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-2">
                              <Lock size={16} className="text-amber-500"/> Gate Workflow
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                              {t.alcohol.challenges.gateSetup}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Solution Stack */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                        <Zap size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                          {t.alcohol.proposal.title}
                      </h3>
                  </div>

                  <div className="space-y-6 flex-1">
                      <SolutionItem 
                          icon={ScanFace} 
                          title="Face Capture" 
                          desc={t.alcohol.proposal.faceCap} 
                          color="indigo" 
                      />
                      <SolutionItem 
                          icon={Bluetooth} 
                          title="Direct API" 
                          desc={t.alcohol.proposal.integration} 
                          color="blue" 
                      />
                      <SolutionItem 
                          icon={HardHat} 
                          title="Infrastructure" 
                          desc={t.alcohol.proposal.projectScope} 
                          color="slate" 
                      />
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const FeatureCard = ({ icon: Icon, color, title, desc }: any) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800',
        red: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-100 dark:border-rose-800',
        green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
    };

    return (
        <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 group shadow-sm hover:shadow-lg">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border ${colorStyles[color as keyof typeof colorStyles]} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
        </div>
    );
};

const SolutionItem = ({ icon: Icon, title, desc, color }: any) => {
    const colorStyles = {
        indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
    };

    return (
        <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${colorStyles[color as keyof typeof colorStyles]}`}>
                <Icon size={24} />
            </div>
            <div>
                <h5 className="font-bold text-slate-800 dark:text-white text-base mb-1">{title}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

export default AlcoholIntegration;
