
import React, { useState, useEffect } from 'react';
import { 
  Shield, Database, Calendar, Users, 
  FileText, Activity, AlertTriangle, 
  Settings, CheckCircle, Smartphone,
  ChevronLeft, ChevronRight, Maximize, Minimize, X,
  Lock, Zap, Server, Layout, HelpCircle, Terminal,
  Workflow, CheckCircle2, XCircle, Search, DollarSign,
  User, Building2, Map, Layers, Mail, Phone, MapPin
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

  // Robust Safety check to prevent "Cannot read properties of undefined"
  if (
      !t || 
      !t.adminManual || 
      !t.adminManual.slides || 
      !t.adminManual.content ||
      !t.adminManual.content.objectives
  ) {
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
      { id: 'hierarchy', title: t.adminManual.slides.hierarchy },
      { id: 'objectives', title: t.adminManual.slides.objectives },
      { id: 'logic', title: t.adminManual.slides.logic },
      { id: 'workflow', title: t.adminManual.slides.workflow },
      { id: 'config', title: t.adminManual.slides.config },
      { id: 'booking', title: t.adminManual.slides.booking },
      { id: 'advanced', title: t.adminManual.slides.advanced },
      { id: 'troubleshoot', title: t.adminManual.slides.troubleshoot },
      { id: 'thankYou', title: 'Contact Us' }
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
              {/* Replaced generic Shield with Logo */}
              <img 
                src="assets/DigiSol_Logo.png" 
                alt="DigiSol Orbit" 
                className="w-64 h-auto object-contain relative z-10 animate-float drop-shadow-2xl" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute bottom-0 right-0 bg-yellow-500 text-slate-900 text-sm font-black px-4 py-1.5 rounded-full border-4 border-slate-900 transform translate-x-4 translate-y-4">
                  v2.6.0
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

  const HierarchySlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center tracking-tight">
              {t.adminManual.content.hierarchy.title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* ORGANOGRAM */}
              <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-blue-500/20 backdrop-blur-md relative overflow-hidden">
                  <div className="flex flex-col items-center gap-6">
                      
                      {/* L1 */}
                      <div className="p-4 bg-slate-800 rounded-xl border border-slate-600 w-64 text-center shadow-lg relative z-10">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 rounded-full p-1"><Server size={14} className="text-white"/></div>
                          <div className="text-blue-300 font-bold">{t.adminManual.content.hierarchy.roles.sysAdmin}</div>
                      </div>
                      
                      {/* Connector */}
                      <div className="h-6 w-0.5 bg-slate-600"></div>

                      {/* L2 */}
                      <div className="p-4 bg-slate-800 rounded-xl border border-slate-600 w-64 text-center shadow-lg relative z-10">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 rounded-full p-1"><Building2 size={14} className="text-white"/></div>
                          <div className="text-purple-300 font-bold">{t.adminManual.content.hierarchy.roles.entAdmin}</div>
                      </div>

                      {/* Connector */}
                      <div className="h-6 w-0.5 bg-slate-600"></div>

                      {/* L3 */}
                      <div className="p-4 bg-slate-800 rounded-xl border border-slate-600 w-64 text-center shadow-lg relative z-10">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 rounded-full p-1"><Map size={14} className="text-white"/></div>
                          <div className="text-orange-300 font-bold">{t.adminManual.content.hierarchy.roles.siteAdmin}</div>
                      </div>

                      {/* Connector Branch */}
                      <div className="relative w-48 h-6">
                          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-600 -translate-x-1/2"></div>
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-600"></div>
                      </div>

                      {/* L4 Group */}
                      <div className="flex gap-4">
                          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-xs text-slate-400 font-mono text-center w-32">
                              {t.adminManual.content.hierarchy.roles.ops}
                          </div>
                      </div>

                      {/* L5 - The User */}
                      <div className="mt-4 p-4 bg-green-900/30 rounded-xl border border-green-500/50 w-64 text-center shadow-[0_0_30px_rgba(34,197,94,0.2)] relative z-10 animate-pulse">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 rounded-full p-1"><User size={14} className="text-white"/></div>
                          <div className="text-green-300 font-bold">{t.adminManual.content.hierarchy.roles.user}</div>
                      </div>
                  </div>
              </div>

              {/* ACCESS & INVESTMENT MODEL */}
              <div className="flex flex-col gap-8">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[2.5rem] border border-green-500/30 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                          <DollarSign size={150} />
                      </div>
                      <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-6">
                              <div className="p-3 bg-green-500/20 rounded-2xl text-green-400 border border-green-500/30 shadow-lg">
                                  <Layers size={32} />
                              </div>
                              <h3 className="text-2xl font-black text-white">{t.adminManual.content.hierarchy.billingTitle}</h3>
                          </div>
                          
                          <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">
                              {t.adminManual.content.hierarchy.billingDesc}
                          </p>

                          <div className="flex items-end gap-3 bg-slate-950/50 p-6 rounded-2xl border border-slate-700">
                              <span className="text-4xl font-black text-green-400 tracking-tighter drop-shadow-md">
                                  {t.adminManual.content.hierarchy.cost}
                              </span>
                              <span className="text-sm text-slate-400 font-bold uppercase tracking-wide mb-2 ml-2">
                                  {t.adminManual.content.hierarchy.perUser}
                              </span>
                          </div>
                      </div>
                  </div>

                  <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/30">
                      <h4 className="text-blue-300 font-bold flex items-center gap-2 mb-2">
                          <CheckCircle2 size={18} /> Integrated Admin Access
                      </h4>
                      <p className="text-sm text-blue-200/80">
                          System management roles (Admins, Managers, Trainers) are essential for successful deployment and are included in the foundational investment package.
                      </p>
                  </div>
              </div>
          </div>
      </div>
  );

  const ObjectivesSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center tracking-tight">{t.adminManual.content.objectives.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full max-h-[70vh]">
              
              {/* Problem Column */}
              <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-red-500/20 backdrop-blur-md hover:border-red-500/40 transition-colors flex flex-col h-full overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-red-500/20 sticky top-0 bg-slate-900/95 z-10">
                      <div className="p-3 bg-red-500/10 rounded-xl">
                        <XCircle className="text-red-500" size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-red-100">{t.adminManual.content.objectives.problemTitle}</h3>
                  </div>
                  <div className="space-y-8 flex-1">
                      <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/5">
                          <h4 className="text-red-300 font-bold text-lg mb-2 flex items-center gap-2">
                              <span className="text-red-500 font-black text-xl">01.</span>
                              {t.adminManual.content.objectives.p1Title}
                          </h4>
                          <p className="text-base text-slate-400 leading-relaxed">{t.adminManual.content.objectives.p1Desc}</p>
                      </div>
                      <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/5">
                          <h4 className="text-red-300 font-bold text-lg mb-2 flex items-center gap-2">
                              <span className="text-red-500 font-black text-xl">02.</span>
                              {t.adminManual.content.objectives.p2Title}
                          </h4>
                          <p className="text-base text-slate-400 leading-relaxed">{t.adminManual.content.objectives.p2Desc}</p>
                      </div>
                      <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/5">
                          <h4 className="text-red-300 font-bold text-lg mb-2 flex items-center gap-2">
                              <span className="text-red-500 font-black text-xl">03.</span>
                              {t.adminManual.content.objectives.p3Title}
                          </h4>
                          <p className="text-base text-slate-400 leading-relaxed">{t.adminManual.content.objectives.p3Desc}</p>
                      </div>
                  </div>
              </div>

              {/* Solution Column */}
              <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-green-500/20 backdrop-blur-md hover:border-green-500/40 transition-colors flex flex-col h-full overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-green-500/20 sticky top-0 bg-slate-900/95 z-10">
                      <div className="p-3 bg-green-500/10 rounded-xl">
                        <CheckCircle2 className="text-green-500" size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-green-100">{t.adminManual.content.objectives.solutionTitle}</h3>
                  </div>
                  <div className="space-y-8 flex-1">
                      <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/5">
                          <h4 className="text-green-300 font-bold text-lg mb-2 flex items-center gap-2">
                              <span className="text-green-500 font-black text-xl">01.</span>
                              {t.adminManual.content.objectives.s1Title}
                          </h4>
                          <p className="text-base text-slate-400 leading-relaxed">{t.adminManual.content.objectives.s1Desc}</p>
                      </div>
                      <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/5">
                          <h4 className="text-green-300 font-bold text-lg mb-2 flex items-center gap-2">
                              <span className="text-green-500 font-black text-xl">02.</span>
                              {t.adminManual.content.objectives.s2Title}
                          </h4>
                          <p className="text-base text-slate-400 leading-relaxed">{t.adminManual.content.objectives.s2Desc}</p>
                      </div>
                      <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/5">
                          <h4 className="text-green-300 font-bold text-lg mb-2 flex items-center gap-2">
                              <span className="text-green-500 font-black text-xl">03.</span>
                              {t.adminManual.content.objectives.s3Title}
                          </h4>
                          <p className="text-base text-slate-400 leading-relaxed">{t.adminManual.content.objectives.s3Desc}</p>
                      </div>
                  </div>
              </div>

          </div>
      </div>
  );

  const LogicSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-down">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-base font-bold mb-6">
                  <Activity size={20} /> Architecture
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{t.adminManual.content.formulaTitle}</h2>
          </div>

          <div className="relative group animate-fade-in-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-slate-700 p-12 rounded-[2.5rem] shadow-2xl">
                  
                  {/* The Equation */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 mb-12">
                      <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl flex flex-col items-center">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Input 1</span>
                          <div className="text-blue-400 font-black text-2xl flex items-center gap-2"><CheckCircle size={20}/> {t.adminManual.content.formulaLogic.active}</div>
                      </div>
                      <span className="text-slate-600 font-black text-2xl">+</span>
                      <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl flex flex-col items-center">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Input 2</span>
                          <div className="text-orange-400 font-black text-2xl flex items-center gap-2"><Calendar size={20}/> {t.adminManual.content.formulaLogic.aso}</div>
                      </div>
                      <span className="text-slate-600 font-black text-2xl">+</span>
                      <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl flex flex-col items-center">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Input 3</span>
                          <div className="text-yellow-400 font-black text-2xl flex items-center gap-2"><Database size={20}/> {t.adminManual.content.formulaLogic.racs}</div>
                      </div>
                      <span className="text-slate-600 font-black text-2xl">=</span>
                      <div className="bg-green-500/20 border border-green-500/50 px-10 py-8 rounded-3xl shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                          <div className="text-green-400 font-black text-3xl tracking-wide">{t.adminManual.content.formulaLogic.result}</div>
                      </div>
                  </div>

                  <p className="text-center text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
                      {t.adminManual.content.formulaDesc}
                  </p>
              </div>
          </div>
      </div>
  );

  const WorkflowSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1800px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-16 text-center tracking-tighter">{t.adminManual.content.flowTitle}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
              {[
                  { title: t.adminManual.content.flowSteps.db, icon: Database, desc: t.adminManual.content.flowSteps.dbDesc, color: 'blue' },
                  { title: t.adminManual.content.flowSteps.book, icon: Calendar, desc: t.adminManual.content.flowSteps.bookDesc, color: 'purple' },
                  { title: t.adminManual.content.flowSteps.res, icon: Activity, desc: t.adminManual.content.flowSteps.resDesc, color: 'green' },
                  { title: t.adminManual.content.flowSteps.stat, icon: CheckCircle, desc: t.adminManual.content.flowSteps.statDesc, color: 'orange' },
              ].map((step, i) => (
                  <div key={i} className="relative group flex flex-col h-full">
                      {i < 3 && (
                          <div className="hidden lg:block absolute top-10 -right-5 z-20 text-slate-700/50">
                              <ChevronRight size={40} strokeWidth={3} />
                          </div>
                      )}
                      
                      <div className={`bg-slate-900/80 border border-slate-700 hover:border-${step.color}-500/50 p-8 rounded-[2rem] flex-1 hover:-translate-y-2 transition-all duration-300 backdrop-blur-md flex flex-col shadow-xl`}>
                          <div className={`w-16 h-16 rounded-2xl bg-${step.color}-500/10 flex items-center justify-center text-${step.color}-500 mb-6 shadow-[0_0_20px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-300`}>
                              <step.icon size={32} />
                          </div>
                          <div className="font-black text-xl text-white mb-4 tracking-tight leading-tight">{step.title}</div>
                          <div className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4 mt-auto">
                            {step.desc}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const ConfigSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-6 mb-12">
              <div className="p-5 bg-slate-800 rounded-3xl border border-slate-700 shadow-xl">
                  <Settings size={40} className="text-white" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{t.adminManual.content.configTitle}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-slate-900/80 p-10 rounded-[2.5rem] border border-slate-700 hover:border-blue-500/50 transition-all hover:-translate-y-2 group shadow-2xl flex flex-col">
                  <div className="flex items-center gap-5 mb-6">
                      <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Database size={28} /></div>
                      <h3 className="text-2xl font-bold text-white leading-tight">{t.adminManual.content.configCards.racs}</h3>
                  </div>
                  <p className="text-lg text-slate-400 leading-relaxed mb-8 font-light flex-1">
                      {t.adminManual.content.configCards.racsDesc}
                  </p>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 items-start">
                      <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                      <p className="text-xs text-red-300 leading-relaxed font-bold">CRITICAL: Deleting a RAC drops the Matrix column.</p>
                  </div>
              </div>

              <div className="bg-slate-900/80 p-10 rounded-[2.5rem] border border-slate-700 hover:border-purple-500/50 transition-all hover:-translate-y-2 group shadow-2xl flex flex-col">
                  <div className="flex items-center gap-5 mb-6">
                      <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform"><Layout size={28} /></div>
                      <h3 className="text-2xl font-bold text-white leading-tight">{t.adminManual.content.configCards.rooms}</h3>
                  </div>
                  <p className="text-lg text-slate-400 leading-relaxed font-light flex-1">
                      {t.adminManual.content.configCards.roomsDesc}
                  </p>
              </div>

              <div className="bg-slate-900/80 p-10 rounded-[2.5rem] border border-slate-700 hover:border-green-500/50 transition-all hover:-translate-y-2 group shadow-2xl flex flex-col">
                  <div className="flex items-center gap-5 mb-6">
                      <div className="p-4 bg-green-500/20 rounded-2xl text-green-400 group-hover:scale-110 transition-transform"><Users size={28} /></div>
                      <h3 className="text-2xl font-bold text-white leading-tight">{t.adminManual.content.configCards.trainers}</h3>
                  </div>
                  <p className="text-lg text-slate-400 leading-relaxed font-light flex-1">
                      {t.adminManual.content.configCards.trainersDesc}
                  </p>
              </div>
          </div>
      </div>
  );

  const BookingSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-16 text-center tracking-tighter">{t.adminManual.content.bookingTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left: The Lock */}
              <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-red-500/30 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Lock size={200} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-red-400 mb-6">{t.adminManual.content.matrixLock}</h3>
                    <p className="text-xl text-slate-300 leading-relaxed mb-8 font-light">
                        {t.adminManual.content.matrixDesc}
                    </p>
                  </div>
                  <div className="p-6 bg-red-950/40 rounded-3xl border border-red-900/50 backdrop-blur-md">
                      <p className="text-red-200 font-medium flex gap-4 text-base items-start">
                          <X className="shrink-0 mt-1" size={20} />
                          Restriction: You cannot book an employee for "RAC 01" unless it is marked as <span className="text-white underline font-bold mx-1">Required</span> in their Database profile.
                      </p>
                  </div>
              </div>

              {/* Right: Logic Cards */}
              <div className="space-y-6">
                  <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg">
                      <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3"><Terminal className="text-blue-400" size={24}/> {t.adminManual.content.gradingTitle}</h4>
                      <p className="text-slate-400 text-base leading-relaxed pl-9">{t.adminManual.content.gradingText}</p>
                  </div>
                  
                  <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg">
                      <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3"><AlertTriangle className="text-yellow-400" size={24}/> {t.adminManual.content.rac02Title}</h4>
                      <p className="text-slate-400 text-base leading-relaxed pl-9">{t.adminManual.content.rac02Text}</p>
                  </div>

                  <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg">
                      <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3"><Workflow className="text-green-400" size={24}/> {t.adminManual.content.expiryTitle}</h4>
                      <p className="text-slate-400 text-base leading-relaxed pl-9">{t.adminManual.content.expiryText}</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const AdvancedSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-16 tracking-tighter text-center">{t.adminManual.content.advancedTitle}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="p-10 bg-slate-900/80 border border-purple-500/30 rounded-[2.5rem] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all group hover:-translate-y-2 flex flex-col">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                      <Smartphone size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t.adminManual.content.autoBook}</h3>
                  <p className="text-base text-slate-400 leading-relaxed font-light flex-1">
                      {t.adminManual.content.autoBookDesc}
                  </p>
              </div>

              <div className="p-10 bg-slate-900/80 border border-indigo-500/30 rounded-[2.5rem] hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all group hover:-translate-y-2 flex flex-col">
                  <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                      <FileText size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t.adminManual.content.aiRep}</h3>
                  <p className="text-base text-slate-400 leading-relaxed font-light flex-1">
                      {t.adminManual.content.aiRepDesc}
                  </p>
              </div>

              <div className="p-10 bg-slate-900/80 border border-orange-500/30 rounded-[2.5rem] hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] transition-all group hover:-translate-y-2 flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                      <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t.adminManual.content.alc}</h3>
                  <p className="text-base text-slate-400 leading-relaxed font-light flex-1">
                      {t.adminManual.content.alcDesc}
                  </p>
              </div>
          </div>
      </div>
  );

  const TroubleshootSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-6xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <div className="text-center mb-16">
              <div className="inline-block p-5 bg-slate-800 rounded-full mb-6 shadow-2xl">
                  <HelpCircle size={48} className="text-slate-400" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{t.adminManual.content.tsTitle}</h2>
          </div>

          <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
                  <h4 className="font-bold text-blue-300 text-xl mb-3 flex items-center gap-4">
                      <Search size={24}/> {t.adminManual.content.ts1}
                  </h4>
                  <p className="text-lg text-slate-300 pl-10 font-light">{t.adminManual.content.ts1Desc}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
                  <h4 className="font-bold text-red-300 text-xl mb-3 flex items-center gap-4">
                      <Lock size={24}/> {t.adminManual.content.ts2}
                  </h4>
                  <p className="text-lg text-slate-300 pl-10 font-light">{t.adminManual.content.ts2Desc}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
                  <h4 className="font-bold text-yellow-300 text-xl mb-3 flex items-center gap-4">
                      <Smartphone size={24}/> {t.adminManual.content.ts3}
                  </h4>
                  <p className="text-lg text-slate-300 pl-10 font-light">{t.adminManual.content.ts3Desc}</p>
              </div>
          </div>
      </div>
  );

  const ThankYouSlide = () => (
      <div className="flex flex-col items-center justify-center min-h-full py-20 text-center max-w-6xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <div className="mb-16 p-12 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(255,255,255,0.1)]">
              <Mail size={100} className="text-white" />
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-16 tracking-tighter">{t.proposal.thankYou.title}</h2>
          <div className="flex flex-col gap-10 text-3xl md:text-5xl text-slate-200 font-light">
              <div className="flex items-center gap-6 justify-center">
                  <Phone className="text-green-400 shrink-0" size={48} /> 
                  <span>{t.proposal.thankYou.phone}</span>
              </div>
              <div className="flex items-center gap-6 justify-center">
                  <Mail className="text-blue-400 shrink-0" size={48} /> 
                  <span className="font-bold">{t.proposal.thankYou.contact}</span>
              </div>
              <div className="flex items-center gap-6 justify-center text-2xl md:text-4xl text-slate-400 mt-8">
                  <MapPin className="shrink-0" size={40} /> 
                  <span>{t.proposal.thankYou.address}</span>
              </div>
          </div>
      </div>
  );

  const renderSlide = () => {
      switch(slides[currentSlide].id) {
          case 'intro': return <IntroSlide />;
          case 'hierarchy': return <HierarchySlide />;
          case 'objectives': return <ObjectivesSlide />;
          case 'logic': return <LogicSlide />;
          case 'workflow': return <WorkflowSlide />;
          case 'config': return <ConfigSlide />;
          case 'booking': return <BookingSlide />;
          case 'advanced': return <AdvancedSlide />;
          case 'troubleshoot': return <TroubleshootSlide />;
          case 'thankYou': return <ThankYouSlide />;
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
