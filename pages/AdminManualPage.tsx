
import React, { useState, useEffect } from 'react';
import { 
  Shield, Database, Calendar, Users, 
  FileText, Activity, AlertTriangle, 
  CheckCircle, Smartphone,
  ChevronLeft, ChevronRight, Maximize, Minimize, X,
  Lock, Server, CheckCircle2, XCircle, Search,
  Building2, Map, Layout, Zap, Terminal, Workflow, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const AdminManualPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const toggleFullScreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    } catch (e) {
        console.error("Fullscreen toggle failed", e);
    }
  };

  // Robust Safety check
  if (!t || !t.adminManual || !t.adminManual.slides || !t.adminManual.content) {
      return (
          <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Loading Admin Manual...</p>
              </div>
          </div>
      );
  }

  const slides = [
      { id: 'intro', title: t.adminManual.slides.intro },
      { id: 'logic', title: t.adminManual.slides.logic },
      { id: 'dashboard', title: t.adminManual.slides.dashboard },
      { id: 'workflows', title: t.adminManual.slides.workflows },
      { id: 'advanced', title: t.adminManual.slides.advanced },
      { id: 'troubleshoot', title: t.adminManual.slides.troubleshoot },
      { id: 'architecture', title: t.adminManual.slides.architecture }
  ];

  const nextSlide = () => {
      if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
      if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  // --- SLIDE COMPONENTS ---

  const IntroSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 relative z-10 animate-fade-in-up">
          <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-30 animate-pulse-slow"></div>
              <Shield size={180} className="text-white relative z-10 drop-shadow-[0_0_50px_rgba(59,130,246,0.6)] animate-float" />
              <div className="absolute bottom-0 right-0 bg-yellow-500 text-slate-900 text-sm font-black px-4 py-1.5 rounded-full border-4 border-slate-900 transform translate-x-4 translate-y-4">
                  v2.5.0
              </div>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter mb-8 leading-tight">
              {t.adminManual.title}
          </h1>
          
          <p className="text-xl md:text-3xl text-blue-200 font-light max-w-4xl leading-relaxed">
              {t.adminManual.subtitle}
          </p>

          <div className="mt-16 flex gap-6">
              <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <Lock size={24} className="text-red-400" />
                  <span className="text-lg font-bold text-slate-300">{t.adminManual.content.confidential}</span>
              </div>
              <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <Server size={24} className="text-green-400" />
                  <span className="text-lg font-bold text-slate-300">{t.adminManual.content.production}</span>
              </div>
          </div>
      </div>
  );

  const LogicSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-down">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">{t.adminManual.content.logic.title}</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">{t.adminManual.content.logic.desc}</p>
          </div>

          <div className="relative group animate-fade-in-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-slate-700 p-12 rounded-[2.5rem] shadow-2xl">
                  
                  {/* The Equation */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 mb-12">
                      <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl flex flex-col items-center">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Input 1</span>
                          <div className="text-blue-400 font-black text-2xl flex items-center gap-2"><CheckCircle size={20}/> {t.adminManual.content.logic.active}</div>
                      </div>
                      <span className="text-slate-600 font-black text-2xl">+</span>
                      <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl flex flex-col items-center">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Input 2</span>
                          <div className="text-orange-400 font-black text-2xl flex items-center gap-2"><Calendar size={20}/> {t.adminManual.content.logic.aso}</div>
                      </div>
                      <span className="text-slate-600 font-black text-2xl">+</span>
                      <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl flex flex-col items-center">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Input 3</span>
                          <div className="text-yellow-400 font-black text-2xl flex items-center gap-2"><Database size={20}/> {t.adminManual.content.logic.racs}</div>
                      </div>
                      <span className="text-slate-600 font-black text-2xl">=</span>
                      <div className="bg-green-500/20 border border-green-500/50 px-10 py-8 rounded-3xl shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                          <div className="text-green-400 font-black text-3xl tracking-wide">{t.adminManual.content.logic.result}</div>
                      </div>
                  </div>

                  <p className="text-center text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed border-l-4 border-red-500 pl-4 bg-red-900/10 p-4 rounded-r-xl">
                      <strong>⚠️ Important:</strong> The system enforces strict AND logic. If any required RAC is missing or expired, status turns <span className="text-red-500 font-bold">RED (Blocked)</span>.
                  </p>
              </div>
          </div>
      </div>
  );

  const DashboardSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.adminManual.slides.dashboard}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Operational */}
              <div className="bg-slate-900/80 p-8 rounded-[2rem] border border-blue-500/30 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Layout size={32}/></div>
                      <h3 className="text-2xl font-bold text-blue-100">{t.adminManual.content.dashboard.operational.title}</h3>
                  </div>
                  <ul className="space-y-4 text-slate-300">
                      <li className="flex gap-3"><Activity size={20} className="text-blue-500 shrink-0"/> {t.adminManual.content.dashboard.operational.kpi}</li>
                      <li className="flex gap-3"><AlertTriangle size={20} className="text-yellow-500 shrink-0"/> {t.adminManual.content.dashboard.operational.renewal}</li>
                      <li className="flex gap-3"><Zap size={20} className="text-orange-500 shrink-0"/> {t.adminManual.content.dashboard.operational.auto}</li>
                  </ul>
              </div>

              {/* Enterprise */}
              <div className="bg-slate-900/80 p-8 rounded-[2rem] border border-purple-500/30 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Building2 size={32}/></div>
                      <h3 className="text-2xl font-bold text-purple-100">{t.adminManual.content.dashboard.enterprise.title}</h3>
                  </div>
                  <ul className="space-y-4 text-slate-300">
                      <li className="flex gap-3"><Map size={20} className="text-purple-500 shrink-0"/> {t.adminManual.content.dashboard.enterprise.global}</li>
                      <li className="flex gap-3"><Users size={20} className="text-red-500 shrink-0"/> {t.adminManual.content.dashboard.enterprise.risk}</li>
                      <li className="flex gap-3"><Terminal size={20} className="text-green-500 shrink-0"/> {t.adminManual.content.dashboard.enterprise.ai}</li>
                  </ul>
              </div>
          </div>
      </div>
  );

  const WorkflowsSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1800px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center">{t.adminManual.slides.workflows}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[60vh]">
              {[
                  { section: t.adminManual.content.workflows.a, color: 'blue', icon: Database },
                  { section: t.adminManual.content.workflows.b, color: 'purple', icon: Calendar },
                  { section: t.adminManual.content.workflows.c, color: 'green', icon: Activity },
                  { section: t.adminManual.content.workflows.d, color: 'orange', icon: CheckCircle },
              ].map((wf, i) => (
                  <div key={i} className={`bg-slate-900/80 border border-slate-700 hover:border-${wf.color}-500/50 p-6 rounded-[2rem] flex flex-col hover:-translate-y-2 transition-all duration-300 shadow-xl`}>
                      <div className={`w-12 h-12 rounded-xl bg-${wf.color}-500/10 flex items-center justify-center text-${wf.color}-500 mb-4`}>
                          <wf.icon size={24} />
                      </div>
                      <h3 className="font-bold text-xl text-white mb-4">{wf.section.title}</h3>
                      <ul className="space-y-3 text-sm text-slate-400 flex-1">
                          {wf.section.steps.map((step: string, idx: number) => (
                              <li key={idx} className="flex gap-2">
                                  <span className={`text-${wf.color}-500 font-bold`}>•</span>
                                  {step}
                              </li>
                          ))}
                      </ul>
                  </div>
              ))}
          </div>
      </div>
  );

  const AdvancedSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-5xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.adminManual.slides.advanced}</h2>
          
          <div className="space-y-8">
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-indigo-500/30 flex gap-6 items-start hover:bg-slate-800 transition-colors">
                  <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 shrink-0"><Settings size={32}/></div>
                  <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{t.adminManual.content.advanced.gov.title}</h3>
                      <p className="text-lg text-slate-300">{t.adminManual.content.advanced.gov.desc}</p>
                  </div>
              </div>

              <div className="bg-slate-800/50 p-8 rounded-3xl border border-red-500/30 flex gap-6 items-start hover:bg-slate-800 transition-colors">
                  <div className="p-4 bg-red-500/20 rounded-2xl text-red-400 shrink-0"><Lock size={32}/></div>
                  <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{t.adminManual.content.advanced.alcohol.title}</h3>
                      <p className="text-lg text-slate-300">{t.adminManual.content.advanced.alcohol.desc}</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const TroubleshootSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-6xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.adminManual.slides.troubleshoot}</h2>
          
          <div className="bg-slate-900/80 rounded-[2rem] border border-slate-700 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 bg-slate-800 p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-4 pl-4">Issue</div>
                  <div className="col-span-1 text-center">Visual</div>
                  <div className="col-span-7">Solution</div>
              </div>
              <div className="divide-y divide-slate-700/50">
                  {Object.values(t.adminManual.content.troubleshoot).map((item: any, i: number) => (
                      <div key={i} className="grid grid-cols-12 p-6 items-center hover:bg-slate-800/30 transition-colors">
                          <div className="col-span-4 pl-4 font-bold text-white text-lg">{item.issue}</div>
                          <div className="col-span-1 text-center text-2xl">
                              {i === 0 ? '❌' : i === 1 ? '🔒' : i === 2 ? '🚗' : i === 3 ? '📱' : '🐌'}
                          </div>
                          <div className="col-span-7 text-slate-300 text-base">{item.solution}</div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const ArchitectureSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-4xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center">{t.adminManual.slides.architecture}</h2>
          
          <div className="bg-slate-950 p-12 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden font-mono">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Workflow size={200} /></div>
              
              <div className="flex flex-col items-center gap-6 relative z-10 text-slate-300">
                  <div className="px-6 py-3 bg-slate-800 rounded-lg border border-slate-600 w-64 text-center font-bold text-white shadow-lg">[ USER INTERFACE ]</div>
                  <div className="h-8 w-0.5 bg-slate-600"></div>
                  <div className="px-6 py-3 bg-slate-800 rounded-lg border border-slate-600 w-64 text-center font-bold text-white shadow-lg">[ PERMISSION GATE ]</div>
                  <div className="h-8 w-0.5 bg-slate-600"></div>
                  
                  <div className="p-6 bg-slate-900 rounded-xl border border-blue-500/30 w-full text-center relative shadow-lg shadow-blue-900/20">
                      <div className="font-bold text-blue-400 text-xl mb-4">[ LOGIC ENGINE ]</div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                          <div className="bg-slate-800 p-2 rounded border border-slate-700">Check Capacity</div>
                          <div className="bg-slate-800 p-2 rounded border border-slate-700">Check Matrix Lock</div>
                          <div className="bg-slate-800 p-2 rounded border border-slate-700">Check DL Validity</div>
                      </div>
                  </div>

                  <div className="h-8 w-0.5 bg-slate-600"></div>
                  <div className="px-6 py-3 bg-slate-800 rounded-lg border border-slate-600 w-64 text-center font-bold text-white shadow-lg">[ DATABASE STATE ]</div>
                  <div className="h-8 w-0.5 bg-slate-600"></div>

                  <div className="grid grid-cols-3 gap-4 w-full">
                      <div className="bg-slate-900 p-3 rounded-lg border border-green-500/30 text-center text-xs text-green-300 shadow-lg">📧 Email/SMS</div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-green-500/30 text-center text-xs text-green-300 shadow-lg">🖨️ Auto-Print</div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-green-500/30 text-center text-xs text-green-300 shadow-lg">🤖 AI Analysis</div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderSlide = () => {
      switch(slides[currentSlide].id) {
          case 'intro': return <IntroSlide />;
          case 'logic': return <LogicSlide />;
          case 'dashboard': return <DashboardSlide />;
          case 'workflows': return <WorkflowsSlide />;
          case 'advanced': return <AdvancedSlide />;
          case 'troubleshoot': return <TroubleshootSlide />;
          case 'architecture': return <ArchitectureSlide />;
          default: return <IntroSlide />;
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden font-sans select-none">
        
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
        </div>

        {/* Slide Content */}
        <div className="relative z-10 h-full w-full overflow-y-auto pb-32 scrollbar-hide">
            <div className="min-h-full flex flex-col justify-center p-4 md:p-8 lg:p-16">
                {renderSlide()}
            </div>
        </div>

        {/* Navigation Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center px-4 shadow-2xl z-50 ring-1 ring-white/5 transition-all hover:bg-white/10">
            <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white transition-all active:scale-90"
            >
                <ChevronLeft size={32} />
            </button>
            
            <div className="px-8 flex flex-col items-center min-w-[180px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Admin Guide</span>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold text-white leading-none">
                        {currentSlide + 1} <span className="text-slate-600">/</span> {slides.length}
                    </span>
                </div>
            </div>

            <button 
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white transition-all active:scale-90"
            >
                <ChevronRight size={32} />
            </button>

            <div className="w-px h-10 bg-white/10 mx-4"></div>

            <button 
                onClick={toggleFullScreen}
                className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                title="Fullscreen"
            >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>

            <button 
                onClick={() => navigate('/')}
                className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-all ml-2"
                title="Exit Guide"
            >
                <X size={24} />
            </button>
        </div>
        
        {/* Progress Bar Top */}
        <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out z-50 shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}></div>
    </div>
  );
};

export default AdminManualPage;
