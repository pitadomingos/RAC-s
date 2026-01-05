
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, ChevronLeft, ChevronRight, X, Maximize, Minimize,
  Target, Zap, HardHat, Smartphone, CalendarClock,
  Database, Monitor, Lock, Server, Key, Mail,
  Rocket, Code, CheckCircle, CheckCircle2,
  User, Users, Award, Briefcase, HeartHandshake, Phone, GraduationCap, Activity, CreditCard, Wallet, Wrench, Layers,
  Play, MapPin, GitMerge, Sparkles, TrendingUp, Building2, Server as ServerIcon, Globe, Factory, BrainCircuit,
  ScanFace, AlertTriangle, ArrowRight, History, ShieldAlert, Cpu,
  CheckSquare, XCircle, Search, Terminal, Binary, FileSpreadsheet, Eye, EyeOff,
  BarChart3, Cloud, ShieldCheck, Timer, ListFilter, Bell, ArrowDown, QrCode
} from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const PresentationPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [skipFinancials, setSkipFinancials] = useState(false);

  // Security Guard: Presentation is for System Admin eyes only.
  if (!isAuthenticated || user?.role !== UserRole.SYSTEM_ADMIN) {
      return <Navigate to="/" replace />;
  }

  // Safety check for translation data
  if (!t || !t.proposal || !t.proposal.aboutMe || !t.proposal.objectives || !t.proposal.techStack || !t.proposal.financials) {
      return (
          <div className="p-8 text-white bg-slate-900 h-screen flex items-center justify-center">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  Initializing Global Strategy...
              </div>
          </div>
      );
  }

  // Define Slides Structure
  const slides = [
    { id: 'title', type: 'title' },
    { id: 'aboutMe', type: 'aboutMe', title: t.proposal.aboutMe.title },
    { id: 'scenario', type: 'scenario', title: t.proposal.scenario.title },
    { id: 'summary', type: 'content', title: t.proposal.execSummary.title },
    { id: 'objectives', type: 'objectives', title: t.proposal.objectives.title },
    { id: 'workflow', type: 'workflow', title: t.proposal.workflow.title },
    { id: 'integration', type: 'integration', title: t.proposal.integration.title },
    { id: 'waitlist', type: 'waitlist', title: t.proposal.waitlist.title },
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
        console.error("Fullscreen toggle failed", e);
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
  }, [currentSlide, skipFinancials]);

  const nextSlide = () => {
      if (currentSlide === 10 && skipFinancials) {
          setCurrentSlide(12);
          return;
      }
      if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
      if (currentSlide === 12 && skipFinancials) {
          setCurrentSlide(10);
          return;
      }
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
              <span className="text-sm md:text-base font-bold text-slate-300 uppercase tracking-widest">{t.proposal.aboutMe.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></span>
              <span className="text-sm md:text-base font-mono text-yellow-500 tracking-widest uppercase">DigiSols Architecture</span>
          </div>
      </div>
  );

  const AboutMeSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-[1500px] mx-auto px-6 relative z-10 animate-fade-in-up py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 space-y-8">
                  <div className="flex items-center gap-6">
                      <div className="p-5 bg-gradient-to-tr from-yellow-500/30 to-amber-500/30 rounded-3xl border border-yellow-500/40 text-yellow-400 shadow-xl shadow-yellow-500/10">
                          <User size={48} />
                      </div>
                      <div>
                          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t.proposal.aboutMe.name}</h2>
                          <p className="text-xl text-yellow-500 font-serif italic">"{t.proposal.aboutMe.preferred}"</p>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/30 flex items-center gap-4 group hover:bg-blue-500/20 transition-all shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 opacity-5"><Shield size={40} /></div>
                          <Award className="text-blue-400 animate-pulse shrink-0" size={32} />
                          <span className="text-lg font-black text-blue-100 tracking-tight leading-tight">{t.proposal.aboutMe.cert}</span>
                      </div>
                      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700 flex items-center gap-4">
                          <Briefcase className="text-emerald-400 shrink-0" size={24} />
                          <span className="text-md text-slate-300 font-bold uppercase tracking-wide">{t.proposal.aboutMe.role}</span>
                      </div>
                  </div>
                  <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-transparent opacity-50"></div>
                      <p className="text-lg text-slate-400 leading-relaxed font-light text-justify pl-6">{t.proposal.aboutMe.bio}</p>
                  </div>
              </div>
              <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                      <Layers className="text-indigo-500" size={24} />
                      <h4 className="text-xl font-black text-white uppercase tracking-widest">{t.proposal.aboutMe.portfolioTitle}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                          { name: 'EduDesk', sub: t.proposal.aboutMe.portfolio.edudesk, icon: GraduationCap, color: 'indigo' },
                          { name: 'H365', sub: t.proposal.aboutMe.portfolio.h365, icon: Activity, color: 'rose' },
                          { name: 'SwiftPOS', sub: t.proposal.aboutMe.portfolio.swiftpos, icon: CreditCard, color: 'emerald' },
                          { name: 'MicroFin', sub: t.proposal.aboutMe.portfolio.microfin, icon: Wallet, color: 'amber' },
                          { name: 'Sentinel', sub: t.proposal.aboutMe.portfolio.sentinel, icon: Eye, color: 'blue' },
                          { name: 'Data Unification', sub: t.proposal.aboutMe.portfolio.dataUnif, icon: GitMerge, color: 'purple' },
                      ].map((item, i) => (
                          <div key={i} className="group relative p-5 bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm hover:border-indigo-500/50 transition-all hover:bg-slate-900/80 shadow-lg">
                              <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 mb-3 group-hover:scale-110 transition-transform shadow-inner`}>
                                  <item.icon size={24} />
                              </div>
                              <div className="font-black text-white text-lg tracking-tight">{item.name}</div>
                              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1 group-hover:text-slate-300 transition-colors">{item.sub}</div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const ObjectivesSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-6xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.proposal.objectives.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-6">
                      <Target size={40} className="text-red-500" />
                      <h3 className="text-2xl font-bold text-white">{t.proposal.objectives.problemTitle}</h3>
                  </div>
                  <p className="text-lg text-slate-300 leading-relaxed">{t.proposal.objectives.problemText}</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-6">
                      <CheckCircle size={40} className="text-emerald-500" />
                      <h3 className="text-2xl font-bold text-white">{t.proposal.objectives.solutionTitle}</h3>
                  </div>
                  <ul className="space-y-4">
                      {t.proposal.objectives.goals.map((goal: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300 text-lg">
                              <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>
                              {goal}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
  );

  const WorkflowSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up py-6">
          <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">{t.proposal.workflow.title}</h2>
              <p className="text-slate-400 mt-2 font-medium">{t.proposal.workflow.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 relative">
              {/* Animated Connection Paths (Visible on Desktop) */}
              <svg className="absolute top-1/4 left-0 w-full h-1/2 pointer-events-none hidden md:block opacity-20" overflow="visible">
                  <path d="M 250,80 L 550,80 M 850,80 L 1150,80 M 1150,300 L 850,300 M 550,300 L 250,300" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10 10" className="animate-dash" />
              </svg>

              {[
                  { id: 1, title: t.proposal.workflow.step1, sub: t.proposal.workflow.step1sub, icon: FileSpreadsheet, color: 'bg-blue-600', actor: t.proposal.workflow.step1actor, text: t.proposal.workflow.step1desc },
                  { id: 2, title: t.proposal.workflow.step2, sub: t.proposal.workflow.step2sub, icon: CalendarClock, color: 'bg-indigo-600', actor: t.proposal.workflow.step2actor, text: t.proposal.workflow.step2desc },
                  { id: 3, title: t.proposal.workflow.step3, sub: t.proposal.workflow.step3sub, icon: GraduationCap, color: 'bg-purple-600', actor: t.proposal.workflow.step3actor, text: t.proposal.workflow.step3desc },
                  { id: 4, title: t.proposal.workflow.step4, sub: t.proposal.workflow.step4sub, icon: BrainCircuit, color: 'bg-amber-600', actor: t.proposal.workflow.step4actor, text: t.proposal.workflow.step4desc },
                  { id: 5, title: t.proposal.workflow.step5, sub: t.proposal.workflow.step5sub, icon: CreditCard, color: 'bg-emerald-600', actor: t.proposal.workflow.step5actor, text: t.proposal.workflow.step5desc },
                  { id: 6, title: t.proposal.workflow.step6, sub: t.proposal.workflow.step6sub, icon: QrCode, color: 'bg-cyan-600', actor: t.proposal.workflow.step6actor, text: t.proposal.workflow.step6desc },
              ].map((step, idx) => (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group">
                      <div className={`w-24 h-24 rounded-[2rem] ${step.color} text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-6 ring-4 ring-white/5`}>
                          <step.icon size={40} />
                      </div>
                      
                      <div className="mt-6 text-center max-w-[280px]">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Phase 0{step.id}</div>
                          <h4 className="text-xl font-black text-white mb-1">{step.title}</h4>
                          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3 bg-white/5 px-2 py-0.5 rounded inline-block">{step.actor}</div>
                          <p className="text-sm text-slate-400 leading-relaxed font-medium">{step.text}</p>
                      </div>
                      
                      {/* Mobile Arrow */}
                      <div className="md:hidden mt-4">
                          <ArrowDown className="text-slate-700 animate-bounce" size={24} />
                      </div>
                  </div>
              ))}
          </div>
          
          <div className="mt-16 py-4 bg-white/5 border border-white/10 rounded-full text-center max-w-2xl mx-auto px-8 backdrop-blur-sm">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                  <ShieldCheck size={16} /> 100% Data Traceability • Unified Compliance Lifecycle
              </p>
          </div>
      </div>
  );

  const IntegrationSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-7xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center tracking-tight">Unified Data Architecture</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Source Systems */}
              <div className="space-y-6">
                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/30 flex items-center gap-4">
                      <div className="p-3 bg-blue-900/50 rounded-xl"><Users size={24} className="text-blue-400"/></div>
                      <div>
                          <h4 className="font-bold text-white text-lg">HR Database</h4>
                          <p className="text-slate-400 text-sm">Permanent Staff (SuccessFactors)</p>
                      </div>
                  </div>
                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-orange-500/30 flex items-center gap-4">
                      <div className="p-3 bg-orange-900/50 rounded-xl"><HardHat size={24} className="text-orange-400"/></div>
                      <div>
                          <h4 className="font-bold text-white text-lg">Célula de Contracto</h4>
                          <p className="text-slate-400 text-sm">Contractor Management DB</p>
                      </div>
                  </div>
              </div>

              {/* Middleware Engine */}
              <div className="flex flex-col items-center">
                  <div className="h-10 w-0.5 bg-gradient-to-b from-transparent via-slate-500 to-slate-500 lg:hidden"></div>
                  <div className="hidden lg:flex items-center gap-2 mb-4 animate-pulse">
                      <span className="h-0.5 w-16 bg-slate-500"></span>
                      <ChevronRight size={24} className="text-slate-500"/>
                  </div>

                  <div className="bg-slate-800 p-8 rounded-full border-4 border-slate-700 shadow-[0_0_50px_rgba(99,102,241,0.3)] relative z-10">
                      <GitMerge size={64} className="text-indigo-400" />
                  </div>
                  <div className="mt-6 text-center">
                      <h3 className="text-2xl font-black text-indigo-300">CARS Middleware</h3>
                      <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                          Nightly synchronization engine utilizing Read-Only APIs to merge & normalize datasets.
                      </p>
                  </div>

                  <div className="hidden lg:flex items-center gap-2 mt-4 animate-pulse">
                      <ChevronRight size={24} className="text-slate-500"/>
                      <span className="h-0.5 w-16 bg-slate-500"></span>
                  </div>
                  <div className="h-10 w-0.5 bg-gradient-to-b from-slate-500 to-transparent lg:hidden"></div>
              </div>

              {/* CARS Application */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2.5rem] border border-indigo-500/50 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Database size={100} />
                  </div>
                  <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-indigo-500 rounded-xl text-white shadow-lg">
                              <Shield size={32} />
                          </div>
                          <h3 className="text-3xl font-black text-white">CARS Manager</h3>
                      </div>
                      <p className="text-lg text-slate-300 leading-relaxed mb-6">
                          A single, unified "Source of Truth" for site safety.
                      </p>
                      <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-slate-300">
                              <CheckCircle size={18} className="text-green-400" />
                              <span>Auto-Updates (No manual entry)</span>
                          </li>
                          <li className="flex items-center gap-3 text-slate-300">
                              <CheckCircle size={18} className="text-green-400" />
                              <span>Conflict Resolution (VUL vs CON)</span>
                          </li>
                          <li className="flex items-center gap-3 text-slate-300">
                              <CheckCircle size={18} className="text-green-400" />
                              <span>Live Status Calculation</span>
                          </li>
                      </ul>
                  </div>
              </div>

          </div>
      </div>
  );

  const WaitlistSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-7xl mx-auto px-6 relative z-10 animate-fade-in-up py-12">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">{t.proposal.waitlist.title}</h2>
              <p className="text-xl text-amber-500 font-bold mt-2">{t.proposal.waitlist.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-slate-900/60 p-8 rounded-[3rem] border border-amber-500/30 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/60 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><ListFilter size={120} /></div>
                  <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-500"><Timer size={32} /></div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.proposal.waitlist.capacityTitle}</h3>
                  </div>
                  <p className="text-lg text-slate-300 leading-relaxed font-light">{t.proposal.waitlist.capacityDesc}</p>
                  <div className="mt-8 flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-widest">
                      <CheckCircle size={14} /> FIFO Logic Active
                  </div>
              </div>

              <div className="bg-slate-900/60 p-8 rounded-[3rem] border border-blue-500/30 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/60 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Bell size={120} /></div>
                  <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-500"><Zap size={32} /></div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.proposal.waitlist.demandTitle}</h3>
                  </div>
                  <p className="text-lg text-slate-300 leading-relaxed font-light">{t.proposal.waitlist.demandDesc}</p>
                  <div className="mt-8 flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest">
                      <ShieldCheck size={14} /> High Pressure Alert Trigger
                  </div>
              </div>
          </div>

          <div className="mt-12 bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
              <h4 className="text-2xl font-black text-emerald-400 mb-2">{t.proposal.waitlist.outcome}</h4>
              <p className="text-slate-400 font-medium">{t.proposal.waitlist.outcomeDesc}</p>
          </div>
      </div>
  );

  const ScenarioSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-[1400px] mx-auto px-12 relative z-10 animate-fade-in-up py-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center tracking-tight">{t.proposal.scenario.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
              <div className="group relative bg-slate-950 border border-red-500/20 p-10 rounded-[3rem] shadow-2xl flex flex-col">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500"><History size={120} /></div>
                  <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                          <ShieldAlert size={32} />
                      </div>
                      <div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.proposal.scenario.challenge}</h3>
                          <span className="text-xs font-black text-red-500 uppercase tracking-widest">{t.proposal.scenario.challengeSub}</span>
                      </div>
                  </div>
                  <div className="flex-1 space-y-6">
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                          <p className="text-lg text-slate-400 italic leading-relaxed">"{t.proposal.scenario.challengeText.replace('{days}', '3')}"</p>
                      </div>
                  </div>
              </div>
              <div className="group relative bg-indigo-950/20 border border-emerald-500/30 p-10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 opacity-50 blur-3xl"></div>
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500"><Zap size={120} /></div>
                  <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                              <Sparkles size={32} />
                          </div>
                          <div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.proposal.scenario.automation}</h3>
                              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{t.proposal.scenario.automationSub}</span>
                          </div>
                      </div>
                      <div className="space-y-6">
                          <div className="flex gap-4 items-start bg-emerald-900/20 p-5 rounded-2xl border border-emerald-500/20">
                              <div className="mt-1 p-1 bg-emerald-500 rounded text-black"><Search size={14} /></div>
                              <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                                <strong>Predictive Sync:</strong> {t.proposal.scenario.automationText1.replace('{days}', '14')}
                              </p>
                          </div>
                          <div className="flex gap-4 items-start bg-indigo-900/20 p-5 rounded-2xl border border-indigo-500/20 translate-x-4">
                              <div className="mt-1 p-1 bg-indigo-500 rounded text-white"><CalendarClock size={14} /></div>
                              <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                                <strong>Automated Mitigation:</strong> {t.proposal.scenario.automationText2}
                              </p>
                          </div>
                          <div className="flex gap-4 items-start bg-blue-900/20 p-5 rounded-2xl border border-blue-500/20 translate-x-8">
                              <div className="mt-1 p-1 bg-blue-500 rounded text-white"><ArrowRight size={14} /></div>
                              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-bold">{t.proposal.scenario.automationOutcome}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const SummarySlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-5xl mx-auto text-center px-4 relative z-10 animate-fade-in-up py-12">
          <div className="mb-10">
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-600 mb-6 tracking-tight">{t.proposal.execSummary.title}</h2>
              <div className="w-20 h-1.5 bg-yellow-500 mx-auto rounded-full shadow-[0_0_15px_#eab308]"></div>
          </div>
          <div className="bg-slate-900/40 p-10 md:p-14 rounded-[3.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative group hover:bg-slate-900/60 transition-colors">
              <div className="absolute -top-6 -left-6 text-7xl text-yellow-500/20 font-serif group-hover:text-yellow-500/40 transition-colors">"</div>
              <div className="text-lg md:text-3xl text-slate-200 leading-relaxed font-light">{t.proposal.execSummary.text}</div>
              <div className="absolute -bottom-6 -right-6 text-7xl text-yellow-500/20 font-serif rotate-180 group-hover:text-yellow-500/40 transition-colors">"</div>
          </div>
          <div className="mt-10 text-slate-400 italic text-xl animate-pulse">{t.proposal.execSummary.quote}</div>
      </div>
  );

  const FinancialsSlide = () => (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-5xl mx-auto px-4 relative z-10 animate-fade-in-up py-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center tracking-tight">{t.proposal.financials.title}</h2>
          <div className="bg-slate-900/60 rounded-[3rem] border border-slate-700 overflow-hidden shadow-2xl backdrop-blur-3xl">
              <div className="divide-y divide-slate-800">
                  <div className="grid grid-cols-12 p-4 bg-slate-800/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <div className="col-span-1 text-center font-mono">#</div>
                      <div className="col-span-8">{t.proposal.financials.headers.desc}</div>
                      <div className="col-span-3 text-right pr-4">{t.proposal.financials.headers.cost}</div>
                  </div>
                  {[
                      { name: t.proposal.financials.items.item1, cost: '$12,000.00' },
                      { name: t.proposal.financials.items.item2, cost: '$6,000.00' },
                      { name: t.proposal.financials.items.item3, cost: '$2,500.00' },
                      { name: t.proposal.financials.items.item4, cost: '$1,500.00' }
                  ].map((item, i) => (
                      <div key={i} className="grid grid-cols-12 p-6 hover:bg-white/5 transition-all items-center">
                          <div className="col-span-1 text-center font-mono text-slate-600 text-sm">{i+1}</div>
                          <div className="col-span-8 text-white font-bold text-lg tracking-tight">{item.name}</div>
                          <div className="col-span-3 text-right font-mono text-xl text-yellow-500 font-black pr-4">{item.cost}</div>
                      </div>
                  ))}
              </div>
              <div className="bg-gradient-to-r from-slate-950 to-indigo-950 p-10 flex flex-col md:flex-row justify-between items-stretch text-white relative overflow-hidden gap-6 border-t border-slate-700">
                  <div className="flex-1 bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/30 relative">
                      <div className="text-[10px] uppercase font-black text-emerald-500 mb-1 tracking-widest">{t.proposal.financials.initialInvest}</div>
                      <div className="text-3xl font-black font-mono text-white">$18,000.00</div>
                  </div>
                  <div className="flex-1 bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 relative">
                      <div className="text-[10px] uppercase font-black text-blue-500 mb-1 tracking-widest">{t.proposal.financials.recurring}</div>
                      <div className="text-3xl font-black font-mono text-white">$4,000.00</div>
                  </div>
              </div>
          </div>
      </div>
  );

  const ConclusionSlide = () => (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative z-10 animate-fade-in-up">
          <Shield size={120} className="text-emerald-500 mb-12 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse" />
          <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">{t.proposal.conclusion.title}</h2>
          <div className="w-48 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-200 rounded-full mb-10 mx-auto"></div>
          <p className="text-2xl md:text-4xl text-slate-300 font-light max-w-5xl leading-relaxed mx-auto">"{t.proposal.conclusion.text}"</p>
      </div>
  );

  const ThankYouSlide = () => (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative z-10 animate-fade-in-up">
          <div className="mb-12">
              <div className="inline-block p-10 bg-slate-900 border border-slate-800 rounded-full mb-10 shadow-2xl animate-pulse"><HeartHandshake size={90} className="text-yellow-500" /></div>
              <h2 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter">{t.proposal.thankYou.title}</h2>
              <p className="text-xl md:text-3xl text-slate-400 font-light max-w-2xl mx-auto">{t.proposal.thankYou.subtitle}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-6">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 px-10 py-6 rounded-3xl flex items-center gap-4 hover:border-blue-500/50 transition-all group">
                  <Mail size={28} className="text-blue-400 group-hover:scale-110 transition-transform"/>
                  <span className="text-lg md:text-xl font-bold text-slate-200">{t.proposal.thankYou.email}</span>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 px-10 py-6 rounded-3xl flex items-center gap-4 hover:border-green-500/50 transition-all group">
                  <Phone size={28} className="text-green-400 group-hover:scale-110 transition-transform"/>
                  <span className="text-lg md:text-xl font-bold text-slate-200">{t.proposal.thankYou.phone}</span>
              </div>
          </div>
      </div>
  );

  const renderSlide = () => {
      switch(slides[currentSlide].id) {
          case 'title': return <TitleSlide />;
          case 'aboutMe': return <AboutMeSlide />;
          case 'scenario': return <ScenarioSlide />;
          case 'summary': return <SummarySlide />;
          case 'objectives': return <ObjectivesSlide />;
          case 'workflow': return <WorkflowSlide />;
          case 'integration': return <IntegrationSlide />;
          case 'waitlist': return <WaitlistSlide />;
          case 'organogram': return <OrganogramSlide />;
          case 'timeline': return <TimelineSlide />;
          case 'tech': return <TechSlide />;
          case 'financials': return <FinancialsSlide />;
          case 'roadmap': return <RoadmapSlide />;
          case 'alcohol': return <AlcoholSlide />;
          case 'enhanced': return <EnhancedSlide />;
          case 'conclusion': return <ConclusionSlide />;
          case 'thankYou': return <ThankYouSlide />;
          default: return <div className="flex items-center justify-center min-h-[70vh] text-slate-500 italic">Documentation Slide {currentSlide + 1} Content alignment check...</div>;
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden font-sans select-none flex flex-col">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col">
            <div className="flex-1 w-full flex flex-col justify-center px-4 md:px-12 py-16">{renderSlide()}</div>
            <div className="h-32 w-full shrink-0"></div>
        </div>
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-full flex items-center px-4 shadow-2xl z-50 ring-1 ring-white/5 transition-all hover:bg-slate-900/80">
            <button onClick={prevSlide} disabled={currentSlide === 0} className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white transition-all active:scale-90"><ChevronLeft size={32} /></button>
            <div className="px-6 md:px-12 flex flex-col items-center min-w-[160px] md:min-w-[220px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Slide Track</span>
                <span className="text-xl md:text-2xl font-mono font-bold text-white leading-none">{currentSlide + 1} <span className="text-slate-600 font-light">/</span> {slides.length}</span>
            </div>
            <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white transition-all active:scale-90"><ChevronRight size={32} /></button>
            <div className="w-px h-10 bg-white/10 mx-4 hidden md:block"></div>
            <button onClick={() => setSkipFinancials(!skipFinancials)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${skipFinancials ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-white/10 text-slate-400'}`} title={skipFinancials ? "Showing Audience Mode (Privacy ON)" : "Showing Enterprise Mode (Privacy OFF)"}>{skipFinancials ? <EyeOff size={24} /> : <Eye size={24} />}</button>
            <button onClick={toggleFullScreen} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-2">{isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}</button>
            <button onClick={() => navigate('/')} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-all ml-2"><X size={24} /></button>
        </div>
        <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-700 ease-in-out z-[110] shadow-[0_0_15px_rgba(245,158,11,0.4)]" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}></div>
    </div>
  );
};

const TechCard = ({ icon: Icon, title, desc, color }: any) => (
    <div className="flex items-center gap-6 p-8 bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-sm hover:border-slate-600 transition-all group">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform ${
            color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
            color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
            color === 'amber' ? 'bg-amber-500/10 text-amber-500' :
            'bg-rose-500/10 text-rose-500'
        }`}>
            <Icon size={40} />
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-slate-400 font-mono text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

const OrganogramSlide = () => {
    const { t } = useLanguage();
    return (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-5xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.proposal.organogram.title}</h2>
          <div className="flex flex-col items-center gap-8">
              <div className="p-6 bg-slate-800 border border-blue-500 rounded-2xl w-64 text-center shadow-lg shadow-blue-500/20">
                  <User size={32} className="mx-auto mb-2 text-blue-400" />
                  <div className="font-bold text-white">Pita Domingos</div>
                  <div className="text-blue-300 text-sm">Lead Architect</div>
              </div>
              <div className="h-8 w-0.5 bg-slate-600"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                  <div className="p-6 bg-slate-800/50 border border-slate-600 rounded-2xl w-64 text-center">
                      <Code size={24} className="mx-auto mb-2 text-purple-400" />
                      <div className="font-bold text-white">{t.proposal.organogram.tech1}</div>
                  </div>
                  <div className="p-6 bg-slate-800/50 border border-slate-600 rounded-2xl w-64 text-center">
                      <ServerIcon size={24} className="mx-auto mb-2 text-green-400" />
                      <div className="font-bold text-white">{t.proposal.organogram.tech2}</div>
                  </div>
              </div>
          </div>
      </div>
    );
};

const TimelineSlide = () => {
    const { t } = useLanguage();
    return (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-5xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.proposal.timeline.title}</h2>
          <div className="space-y-6">
              {[
                  { title: t.proposal.timeline.phase1, desc: t.proposal.timeline.phase1desc, color: 'bg-blue-500' },
                  { title: t.proposal.timeline.phase2, desc: t.proposal.timeline.phase2desc, color: 'bg-indigo-500' },
                  { title: t.proposal.timeline.phase3, desc: t.proposal.timeline.phase3desc, color: 'bg-purple-500' },
                  { title: t.proposal.timeline.phase4, desc: t.proposal.timeline.phase4desc, color: 'bg-emerald-500' },
                  { title: t.proposal.timeline.phase5, desc: t.proposal.timeline.phase5desc, color: 'bg-orange-500' },
              ].map((phase, i) => (
                  <div key={i} className="flex gap-6 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors">
                      <div className={`w-12 h-12 rounded-full ${phase.color} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
                          {i + 1}
                      </div>
                      <div>
                          <h4 className="text-xl font-bold text-white mb-1">{phase.title}</h4>
                          <p className="text-slate-400 text-sm">{phase.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    );
};

const TechSlide = () => {
    const { t } = useLanguage();
    return (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-7xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16">{t.proposal.techStack.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TechCard icon={Monitor} title={t.proposal.techStack.frontendTitle} desc={t.proposal.techStack.frontend} color="blue" />
              <TechCard icon={ServerIcon} title={t.proposal.techStack.backendTitle} desc={t.proposal.techStack.backend} color="emerald" />
              <TechCard icon={Database} title={t.proposal.techStack.databaseTitle} desc={t.proposal.techStack.database} color="amber" />
              <TechCard icon={Lock} title={t.proposal.techStack.securityTitle} desc={t.proposal.techStack.security} color="rose" />
          </div>
      </div>
    );
};

const RoadmapSlide = () => {
    const { t } = useLanguage();
    return (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-7xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center">{t.proposal.roadmap.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                  <Key size={32} className="text-blue-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{t.proposal.roadmap.auth}</h4>
                  <p className="text-slate-400">{t.proposal.roadmap.auth}</p>
              </div>
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                  <Rocket size={32} className="text-cyan-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{t.proposal.roadmap.db}</h4>
                  <p className="text-slate-400">{t.proposal.roadmap.dbDesc}</p>
              </div>
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                  <Mail size={32} className="text-pink-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{t.proposal.roadmap.email}</h4>
                  <p className="text-slate-400">{t.proposal.roadmap.emailDesc}</p>
              </div>
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                  <Smartphone size={32} className="text-green-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{t.proposal.roadmap.hosting}</h4>
                  <p className="text-slate-400">{t.proposal.roadmap.hostingDesc}</p>
              </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-900 to-blue-900 p-8 rounded-3xl border border-indigo-700 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10"><BrainCircuit size={150} /></div>
              <div className="relative z-10 flex items-center gap-4 mb-4">
                  <Sparkles className="text-yellow-400" size={32} />
                  <h3 className="text-2xl font-bold text-white">{t.proposal.aiFeatures.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <p className="text-slate-200">{t.proposal.aiFeatures.chatbot}</p>
                  <p className="text-slate-200">{t.proposal.aiFeatures.reporting}</p>
              </div>
          </div>
      </div>
    );
};

const AlcoholSlide = () => {
    const { t } = useLanguage();
    return (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-6xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.proposal.futureUpdates.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-amber-500/10 border border-amber-500/30 p-10 rounded-[3rem] backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                      <Code size={40} className="text-amber-500" />
                      <h3 className="text-3xl font-bold text-white">Module A</h3>
                  </div>
                  <h4 className="text-xl text-amber-200 mb-4 font-bold">Software Integration</h4>
                  <p className="text-lg text-slate-300 leading-relaxed">
                      {t.proposal.futureUpdates.moduleA.split('-')[1] || t.proposal.futureUpdates.moduleADesc}
                  </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-600 p-10 rounded-[3rem] backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                      <HardHat size={40} className="text-slate-400" />
                      <h3 className="text-3xl font-bold text-white">Module B</h3>
                  </div>
                  <h4 className="text-xl text-slate-300 mb-4 font-bold">Physical Infrastructure</h4>
                  <p className="text-lg text-slate-300 leading-relaxed">
                      {t.proposal.futureUpdates.moduleB.split('-')[1] || t.proposal.futureUpdates.moduleBDesc}
                  </p>
              </div>
          </div>
      </div>
    );
};

const EnhancedSlide = () => {
    const { t } = useLanguage();
    return (
      <div className="flex flex-col justify-center min-h-[70vh] max-w-7xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{t.proposal.enhancedCaps.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 hover:border-blue-500 transition-colors">
                  <ScanFace size={48} className="text-blue-500 mb-6" />
                  <h4 className="text-xl font-bold text-white mb-3">{t.proposal.enhancedCaps.mobileVerify.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{t.proposal.enhancedCaps.mobileVerify.desc}</p>
              </div>
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 hover:border-green-500 transition-colors">
                  <CalendarClock size={48} className="text-green-500 mb-6" />
                  <h4 className="text-xl font-bold text-white mb-3">{t.proposal.enhancedCaps.autoBooking.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{t.proposal.enhancedCaps.autoBooking.desc}</p>
              </div>
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 hover:border-purple-500 transition-colors">
                  <Database size={48} className="text-purple-500 mb-6" />
                  <h4 className="text-xl font-bold text-white mb-3">{t.proposal.enhancedCaps.massData.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{t.proposal.enhancedCaps.massData.desc}</p>
              </div>
          </div>
      </div>
    );
};

export default PresentationPage;
