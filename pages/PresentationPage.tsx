import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, ChevronLeft, ChevronRight, X, Maximize, Minimize,
  Target, Zap, HardHat, Smartphone, CalendarClock,
  Database, Monitor, Lock, Server, Key, Mail,
  Rocket, Code, CheckCircle,
  User, Users, Award, Briefcase, HeartHandshake, FileText, Phone, GraduationCap, Activity, CreditCard, Wallet, Wrench, Layers,
  AlertTriangle, RotateCcw, Play, CheckSquare, Wifi, ScanFace, Bluetooth, FileSpreadsheet, ScrollText, Grid,
  Globe, Building2, BrainCircuit, Sparkles, MapPin, Search,
  GitMerge, RefreshCw, Link2, Factory
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PresentationPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Safety check
  if (!t || !t.proposal || !t.proposal.aboutMe || !t.proposal.objectives) {
      return (
          <div className="p-8 text-white bg-slate-900 h-screen flex items-center justify-center">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  Initializing Presentation...
              </div>
          </div>
      );
  }

  // Define Slides Structure
  const slides = [
    { id: 'title', type: 'title' },
    { id: 'aboutMe', type: 'aboutMe', title: t.proposal.aboutMe.title },
    { id: 'scenario', type: 'scenario', title: 'Real World Scenario' },
    { id: 'summary', type: 'content', title: t.proposal.execSummary.title },
    { id: 'objectives', type: 'objectives', title: t.proposal.objectives.title },
    { id: 'integration', type: 'integration', title: 'Unified Data Integration' },
    { id: 'organogram', type: 'organogram', title: t.proposal.organogram.title },
    { id: 'timeline', type: 'timeline', title: t.proposal.timeline.title },
    { id: 'tech', type: 'tech', title: t.proposal.techStack.title },
    { id: 'financials', type: 'financials', title: t.proposal.financials.title },
    { id: 'roadmap', type: 'roadmap', title: t.proposal.roadmap.title },
    { id: 'alcohol', type: 'alcohol', title: t.proposal.futureUpdates.title },
    { id: 'enhanced', type: 'enhanced', title: t.proposal.enhancedCaps.title },
    { id: 'conclusion', type: 'conclusion', title: t.proposal.conclusion.title },
    { id: 'thankYou', type: 'thankYou', title: t.proposal.thankYou.title },
  ];

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
        console.error("Fullscreen toggled failed", e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
      if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
      if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  // --- Slide Components ---

  const TitleSlide = () => (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative z-10 animate-fade-in-up">
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
          
          <div className="relative mb-10 group">
              <div className="absolute inset-0 bg-yellow-500 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
              <Shield size={130} className="text-yellow-500 relative z-10 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] animate-float" />
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tight mb-6 leading-tight">
              {t.common.vulcan}
          </h1>
          
          <div className="h-2 w-32 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-8 shadow-lg shadow-orange-500/50"></div>

          <h2 className="text-lg md:text-3xl text-slate-300 font-light uppercase tracking-[0.4em] animate-slide-in-right">
              {t.proposal.digitalTrans}
          </h2>
          
          <div className="mt-12 flex items-center gap-4 px-8 py-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
              <span className="text-sm md:text-base font-bold text-slate-300 uppercase tracking-widest">Pita Domingos</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></span>
              <span className="text-sm md:text-base font-mono text-yellow-500 tracking-widest uppercase">DigiSols Architecture</span>
          </div>
      </div>
  );

  const SummarySlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-5xl mx-auto text-center px-4 relative z-10 animate-fade-in-up py-12">
          <div className="mb-10">
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-600 mb-6 tracking-tight">
                  {t.proposal.execSummary.title}
              </h2>
              <div className="w-20 h-1.5 bg-yellow-500 mx-auto rounded-full shadow-[0_0_15px_#eab308]"></div>
          </div>
          
          <div className="bg-slate-900/40 p-10 md:p-14 rounded-[3.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative group hover:bg-slate-900/60 transition-colors">
              <div className="absolute -top-6 -left-6 text-7xl text-yellow-500/20 font-serif group-hover:text-yellow-500/40 transition-colors">"</div>
              <div className="text-lg md:text-3xl text-slate-200 leading-relaxed font-light">
                  {t.proposal.execSummary.text}
              </div>
              <div className="absolute -bottom-6 -right-6 text-7xl text-yellow-500/20 font-serif rotate-180 group-hover:text-yellow-500/40 transition-colors">"</div>
          </div>

          <div className="mt-10 text-slate-400 italic text-xl animate-pulse">
              {t.proposal.execSummary.quote}
          </div>
      </div>
  );

  const IntegrationSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-7xl mx-auto px-6 relative z-10 animate-fade-in-up py-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center tracking-tight">Unified Data Architecture</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="space-y-6">
                  <div className="bg-slate-900/80 p-6 rounded-3xl border border-blue-500/20 flex items-center gap-4 hover:border-blue-500/50 transition-all">
                      <div className="p-3 bg-blue-900/40 rounded-2xl"><Users size={24} className="text-blue-400"/></div>
                      <div>
                          <h4 className="font-bold text-white text-lg tracking-tight">HR Database</h4>
                          <p className="text-slate-400 text-xs uppercase font-black tracking-widest">SuccessFactors API</p>
                      </div>
                  </div>
                  <div className="bg-slate-900/80 p-6 rounded-3xl border border-orange-500/20 flex items-center gap-4 hover:border-orange-500/50 transition-all">
                      <div className="p-3 bg-orange-900/40 rounded-2xl"><HardHat size={24} className="text-orange-400"/></div>
                      <div>
                          <h4 className="font-bold text-white text-lg tracking-tight">Célula de Contracto</h4>
                          <p className="text-slate-400 text-xs uppercase font-black tracking-widest">Contractor Management</p>
                      </div>
                  </div>
              </div>

              <div className="flex flex-col items-center">
                  <div className="bg-slate-800 p-8 rounded-full border-4 border-slate-700 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative z-10">
                      <GitMerge size={50} className="text-indigo-400 animate-pulse" />
                  </div>
                  <div className="mt-6 text-center">
                      <h3 className="text-xl font-black text-indigo-300 uppercase tracking-widest">CARS Middleware</h3>
                      <p className="text-slate-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                          Nightly synchronization engine utilizing Read-Only APIs to merge & normalize datasets across all sites.
                      </p>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Database size={100} /></div>
                  <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center gap-3 mb-6">
                          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><Shield size={28} /></div>
                          <h3 className="text-2xl font-black text-white tracking-tight">Source of Truth</h3>
                      </div>
                      <ul className="space-y-4 text-sm font-bold text-slate-300">
                          <li className="flex items-center justify-center gap-3 bg-white/5 py-2 rounded-xl">
                              <CheckCircle size={14} className="text-green-400" />
                              <span>ZERO Manual Entry</span>
                          </li>
                          <li className="flex items-center justify-center gap-3 bg-white/5 py-2 rounded-xl">
                              <CheckCircle size={14} className="text-green-400" />
                              <span>Site-Level Data Isolation</span>
                          </li>
                          <li className="flex items-center justify-center gap-3 bg-white/5 py-2 rounded-xl">
                              <CheckCircle size={14} className="text-green-400" />
                              <span>Live Compliance Matrices</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  );

  const ObjectivesSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-6xl mx-auto px-4 relative z-10 animate-fade-in-up py-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center tracking-tight">{t.proposal.objectives.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-red-500/5 border border-red-500/20 p-10 rounded-[3rem] backdrop-blur-xl">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-red-500/20 rounded-2xl text-red-500"><Target size={32} /></div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t.proposal.objectives.problemTitle}</h3>
                  </div>
                  <p className="text-lg text-slate-400 leading-relaxed font-light">{t.proposal.objectives.problemText}</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[3rem] backdrop-blur-xl">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-500"><CheckCircle size={32} /></div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t.proposal.objectives.solutionTitle}</h3>
                  </div>
                  <ul className="space-y-4">
                      {t.proposal.objectives.goals.map((goal: string, i: number) => (
                          <li key={i} className="flex items-start gap-4 text-slate-300 text-lg font-medium">
                              <div className="mt-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                              {goal}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
  );

  const FinancialsSlide = () => {
      // Updated Financials based on latest requirements
      const updatedItems = [
          { name: 'Architecture & Initial Development', cost: '$12,000.00' },
          { name: 'Core Setup & Integration Layer', cost: '$6,000.00' },
          { name: 'Monthly Enterprise License (Cloud/SaaS)', cost: '$2,500.00' },
          { name: 'Ongoing Maintenance & Robotic Updates', cost: '$1,500.00' }
      ];

      return (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-5xl mx-auto px-4 relative z-10 animate-fade-in-up py-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center tracking-tight">{t.proposal.financials.title}</h2>
          
          <div className="bg-slate-900/60 rounded-[3rem] border border-slate-700 overflow-hidden shadow-2xl backdrop-blur-3xl">
              <div className="divide-y divide-slate-800">
                  <div className="grid grid-cols-12 p-5 bg-slate-800/80 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-8">Description</div>
                      <div className="col-span-3 text-right pr-4">Investment</div>
                  </div>
                  {updatedItems.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 p-6 hover:bg-white/5 transition-all items-center">
                          <div className="col-span-1 text-center font-mono text-slate-600 text-sm">{i+1}</div>
                          <div className="col-span-8 text-white font-bold text-lg tracking-tight">{item.name}</div>
                          <div className="col-span-3 text-right font-mono text-xl text-yellow-500 font-black pr-4">{item.cost}</div>
                      </div>
                  ))}
              </div>

              <div className="bg-gradient-to-r from-slate-950 to-indigo-950 p-10 flex flex-col md:flex-row justify-between items-stretch text-white relative overflow-hidden gap-6 border-t border-slate-700">
                  <div className="flex-1 bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/30 relative">
                      <div className="text-[10px] uppercase font-black text-emerald-500 mb-1 tracking-widest">Initial Investment</div>
                      <div className="text-3xl font-black font-mono text-white">$18,000.00</div>
                  </div>
                  <div className="flex-1 bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 relative">
                      <div className="text-[10px] uppercase font-black text-blue-500 mb-1 tracking-widest">Monthly Recurring</div>
                      <div className="text-3xl font-black font-mono text-white">$4,000.00</div>
                  </div>
              </div>
          </div>
      </div>
      );
  };

  const ThankYouSlide = () => (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative z-10">
          <div className="mb-12">
              <div className="inline-block p-10 bg-slate-900 border border-slate-800 rounded-full mb-10 shadow-2xl animate-pulse">
                  <HeartHandshake size={90} className="text-yellow-500" />
              </div>
              <h2 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter">Muito Obrigado</h2>
              <p className="text-xl md:text-3xl text-slate-400 font-light max-w-2xl mx-auto">Let's build a safer, more automated future for our workforce together.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-6">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 px-10 py-6 rounded-3xl flex items-center gap-4 hover:border-blue-500/50 transition-all">
                  <Mail size={28} className="text-blue-400"/>
                  <span className="text-lg md:text-xl font-bold text-slate-200">pita.domingos@example.com</span>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 px-10 py-6 rounded-3xl flex items-center gap-4 hover:border-green-500/50 transition-all">
                  <Phone size={28} className="text-green-400"/>
                  <span className="text-lg md:text-xl font-bold text-slate-200">+258 84 123 4567</span>
              </div>
          </div>
      </div>
  );

  const renderSlide = () => {
      switch(slides[currentSlide].id) {
          case 'title': return <TitleSlide />;
          case 'summary': return <SummarySlide />;
          case 'objectives': return <ObjectivesSlide />;
          case 'integration': return <IntegrationSlide />;
          case 'financials': return <FinancialsSlide />;
          case 'thankYou': return <ThankYouSlide />;
          default: return <div className="flex items-center justify-center min-h-[70vh] text-slate-500 italic">Documentation Slide {currentSlide + 1} Alignment Check...</div>;
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden font-sans select-none flex flex-col">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        </div>

        {/* Scrollable Content wrapper to fix "out of alignment" clipping */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col">
            <div className="flex-1 w-full flex flex-col justify-center px-4 md:px-12 py-16">
                {renderSlide()}
            </div>
            {/* Safe space at bottom for nav bar */}
            <div className="h-32 w-full shrink-0"></div>
        </div>

        {/* Global Navigation Controller */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-full flex items-center px-4 shadow-2xl z-50 ring-1 ring-white/5 transition-all hover:bg-slate-900/80">
            <button 
                onClick={prevSlide} 
                disabled={currentSlide === 0} 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white transition-all active:scale-90"
            >
                <ChevronLeft size={32} />
            </button>
            <div className="px-6 md:px-12 flex flex-col items-center min-w-[160px] md:min-w-[220px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Slide Track</span>
                <span className="text-xl md:text-2xl font-mono font-bold text-white leading-none">
                    {currentSlide + 1} <span className="text-slate-600 font-light">/</span> {slides.length}
                </span>
            </div>
            <button 
                onClick={nextSlide} 
                disabled={currentSlide === slides.length - 1} 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white transition-all active:scale-90"
            >
                <ChevronRight size={32} />
            </button>
            <div className="w-px h-10 bg-white/10 mx-4 hidden md:block"></div>
            <button 
                onClick={toggleFullScreen} 
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                title="Full Presentation Mode"
            >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
            <button 
                onClick={() => navigate('/')} 
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-all ml-2"
                title="Exit Presentation"
            >
                <X size={24} />
            </button>
        </div>

        {/* Global Progress Line */}
        <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-700 ease-in-out z-[110] shadow-[0_0_15px_rgba(245,158,11,0.4)]" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}></div>
    </div>
  );
};

export default PresentationPage;