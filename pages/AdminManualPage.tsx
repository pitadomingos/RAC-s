
import React, { useState, useEffect } from 'react';
import { 
  Shield, Database, Calendar, Users, 
  FileText, Activity, AlertTriangle, 
  Settings, CheckCircle, Smartphone,
  ChevronLeft, ChevronRight, Maximize, Minimize, X,
  Lock, Zap, Server, Layout, HelpCircle, Terminal,
  Workflow, CheckCircle2, XCircle, Search
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

  const slides = [
      { id: 'intro', title: t.adminManual.slides.intro },
      { id: 'objectives', title: t.adminManual.slides.objectives },
      { id: 'logic', title: t.adminManual.slides.logic },
      { id: 'workflow', title: t.adminManual.slides.workflow },
      { id: 'config', title: t.adminManual.slides.config },
      { id: 'booking', title: t.adminManual.slides.booking },
      { id: 'advanced', title: t.adminManual.slides.advanced },
      { id: 'troubleshoot', title: t.adminManual.slides.troubleshoot }
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
          
          <p className="text-2xl md:text-3xl text-blue-200 font-light max-w-4xl leading-relaxed">
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

  const ObjectivesSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-16 text-center tracking-tight">{t.adminManual.content.objectives.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Problem Column */}
              <div className="bg-slate-900/60 p-10 rounded-[2rem] border border-red-500/20 backdrop-blur-md hover:border-red-500/40 transition-colors">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-red-500/20">
                      <XCircle className="text-red-500" size={40} />
                      <h3 className="text-3xl font-bold text-red-100">{t.adminManual.content.objectives.problemTitle}</h3>
                  </div>
                  <div className="space-y-10">
                      <div>
                          <h4 className="text-red-300 font-bold text-xl mb-2 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500"></div>{t.adminManual.content.objectives.p1Title}</h4>
                          <p className="text-lg text-slate-400 leading-relaxed pl-5">{t.adminManual.content.objectives.p1Desc}</p>
                      </div>
                      <div>
                          <h4 className="text-red-300 font-bold text-xl mb-2 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500"></div>{t.adminManual.content.objectives.p2Title}</h4>
                          <p className="text-lg text-slate-400 leading-relaxed pl-5">{t.adminManual.content.objectives.p2Desc}</p>
                      </div>
                      <div>
                          <h4 className="text-red-300 font-bold text-xl mb-2 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500"></div>{t.adminManual.content.objectives.p3Title}</h4>
                          <p className="text-lg text-slate-400 leading-relaxed pl-5">{t.adminManual.content.objectives.p3Desc}</p>
                      </div>
                  </div>
              </div>

              {/* Solution Column */}
              <div className="bg-slate-900/60 p-10 rounded-[2rem] border border-green-500/20 backdrop-blur-md hover:border-green-500/40 transition-colors">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-green-500/20">
                      <CheckCircle2 className="text-green-500" size={40} />
                      <h3 className="text-3xl font-bold text-green-100">{t.adminManual.content.objectives.solutionTitle}</h3>
                  </div>
                  <div className="space-y-10">
                      <div>
                          <h4 className="text-green-300 font-bold text-xl mb-2 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500"></div>{t.adminManual.content.objectives.s1Title}</h4>
                          <p className="text-lg text-slate-400 leading-relaxed pl-5">{t.adminManual.content.objectives.s1Desc}</p>
                      </div>
                      <div>
                          <h4 className="text-green-300 font-bold text-xl mb-2 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500"></div>{t.adminManual.content.objectives.s2Title}</h4>
                          <p className="text-lg text-slate-400 leading-relaxed pl-5">{t.adminManual.content.objectives.s2Desc}</p>
                      </div>
                      <div>
                          <h4 className="text-green-300 font-bold text-xl mb-2 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500"></div>{t.adminManual.content.objectives.s3Title}</h4>
                          <p className="text-lg text-slate-400 leading-relaxed pl-5">{t.adminManual.content.objectives.s3Desc}</p>
                      </div>
                  </div>
              </div>

          </div>
      </div>
  );

  const LogicSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-in-down">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-base font-bold mb-6">
                  <Activity size={20} /> Architecture
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter">{t.adminManual.content.formulaTitle}</h2>
          </div>

          <div className="relative group animate-fade-in-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-slate-700 p-12 md:p-16 rounded-[2.5rem] shadow-2xl">
                  <div className="font-mono text-2xl md:text-4xl leading-relaxed text-slate-300">
                      <span className="text-green-400 font-bold">{t.adminManual.content.formulaLogic.result}</span> <span className="text-slate-500 mx-4">=</span> <br className="lg:hidden"/>
                      <div className="pl-0 lg:pl-20 mt-8 space-y-6">
                          <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                              <CheckCircle className="text-blue-500 shrink-0" size={32} />
                              <span>(<span className="text-blue-400 font-bold">{t.adminManual.content.formulaLogic.active}</span> == <span className="text-purple-400">TRUE</span>)</span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-500 justify-center lg:justify-start"><span className="text-lg font-bold">{t.adminManual.content.formulaLogic.and}</span></div>
                          <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                              <Calendar className="text-orange-500 shrink-0" size={32} />
                              <span>(<span className="text-orange-400 font-bold">{t.adminManual.content.formulaLogic.aso}</span> &gt; <span className="text-white">{t.adminManual.content.formulaLogic.today}</span>)</span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-500 justify-center lg:justify-start"><span className="text-lg font-bold">{t.adminManual.content.formulaLogic.and}</span></div>
                          <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                              <Database className="text-yellow-500 shrink-0" size={32} />
                              <span>(<span className="text-yellow-400 font-bold">{t.adminManual.content.formulaLogic.racs}</span>)</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const WorkflowSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-24 text-center tracking-tighter">{t.adminManual.content.flowTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                  { title: t.adminManual.content.flowSteps.db, icon: Database, desc: t.adminManual.content.flowSteps.dbDesc, color: 'blue' },
                  { title: t.adminManual.content.flowSteps.book, icon: Calendar, desc: t.adminManual.content.flowSteps.bookDesc, color: 'purple' },
                  { title: t.adminManual.content.flowSteps.res, icon: Activity, desc: t.adminManual.content.flowSteps.resDesc, color: 'green' },
                  { title: t.adminManual.content.flowSteps.stat, icon: CheckCircle, desc: t.adminManual.content.flowSteps.statDesc, color: 'orange' },
              ].map((step, i) => (
                  <div key={i} className="relative group">
                      {i < 3 && (
                          <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-slate-800 -z-10 group-hover:bg-slate-700 transition-colors">
                              <div className="absolute right-0 -top-2.5 text-slate-800 group-hover:text-slate-700 transition-colors"><ChevronRight size={24}/></div>
                          </div>
                      )}
                      
                      <div className="bg-slate-900/60 border border-slate-700 hover:border-slate-500 p-10 rounded-[2.5rem] h-full hover:-translate-y-4 transition-all duration-300 backdrop-blur-md flex flex-col items-center text-center shadow-2xl">
                          <div className={`w-24 h-24 rounded-3xl bg-${step.color}-500/10 flex items-center justify-center text-${step.color}-500 mb-8 shadow-[0_0_40px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-300`}>
                              <step.icon size={48} />
                          </div>
                          <div className="font-bold text-3xl text-white mb-3 tracking-tight">{step.title}</div>
                          <div className="text-slate-400 text-lg leading-snug">{step.desc}</div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const ConfigSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-8 mb-16">
              <div className="p-6 bg-slate-800 rounded-3xl border border-slate-700 shadow-xl">
                  <Settings size={48} className="text-white" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{t.adminManual.content.configTitle}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-900/80 p-12 rounded-[2.5rem] border border-slate-700 hover:border-blue-500/50 transition-all hover:-translate-y-2 group shadow-2xl">
                  <div className="flex items-center gap-5 mb-8">
                      <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Database size={32} /></div>
                      <h3 className="text-3xl font-bold text-white">{t.adminManual.content.configCards.racs}</h3>
                  </div>
                  <p className="text-xl text-slate-400 leading-relaxed mb-8 font-light">
                      {t.adminManual.content.configCards.racsDesc}
                  </p>
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4">
                      <AlertTriangle className="text-red-500 shrink-0" size={24} />
                      <p className="text-sm text-red-300 leading-relaxed"><strong>Warning:</strong> Deleting a RAC here removes the column from the Database Matrix permanently.</p>
                  </div>
              </div>

              <div className="bg-slate-900/80 p-12 rounded-[2.5rem] border border-slate-700 hover:border-purple-500/50 transition-all hover:-translate-y-2 group shadow-2xl">
                  <div className="flex items-center gap-5 mb-8">
                      <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform"><Layout size={32} /></div>
                      <h3 className="text-3xl font-bold text-white">{t.adminManual.content.configCards.rooms}</h3>
                  </div>
                  <p className="text-xl text-slate-400 leading-relaxed font-light">
                      {t.adminManual.content.configCards.roomsDesc}
                  </p>
              </div>

              <div className="bg-slate-900/80 p-12 rounded-[2.5rem] border border-slate-700 hover:border-green-500/50 transition-all hover:-translate-y-2 group shadow-2xl">
                  <div className="flex items-center gap-5 mb-8">
                      <div className="p-4 bg-green-500/20 rounded-2xl text-green-400 group-hover:scale-110 transition-transform"><Users size={32} /></div>
                      <h3 className="text-3xl font-bold text-white">{t.adminManual.content.configCards.trainers}</h3>
                  </div>
                  <p className="text-xl text-slate-400 leading-relaxed font-light">
                      {t.adminManual.content.configCards.trainersDesc}
                  </p>
              </div>
          </div>
      </div>
  );

  const BookingSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-20 text-center tracking-tighter">{t.adminManual.content.bookingTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="bg-slate-900/80 p-12 rounded-[3rem] border border-red-500/30 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Lock size={200} />
                  </div>
                  <h3 className="text-4xl font-bold text-red-400 mb-8">{t.adminManual.content.matrixLock}</h3>
                  <p className="text-2xl text-slate-300 leading-relaxed mb-10 font-light">
                      {t.adminManual.content.matrixDesc}
                  </p>
                  <div className="p-8 bg-red-950/30 rounded-3xl border border-red-900/50">
                      <p className="text-red-200 font-medium flex gap-4 text-lg items-start">
                          <X className="shrink-0 mt-1" size={24} />
                          You cannot book an employee for "RAC 01" unless it is marked as <span className="text-white underline font-bold mx-1">Required</span> in their Database profile.
                      </p>
                  </div>
              </div>

              <div className="space-y-8">
                  <div className="bg-slate-900/60 p-10 rounded-[2.5rem] border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg">
                      <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-4"><Terminal className="text-blue-400" size={28}/> {t.adminManual.content.gradingTitle}</h4>
                      <p className="text-slate-400 text-lg leading-relaxed pl-11">{t.adminManual.content.gradingText}</p>
                  </div>
                  
                  <div className="bg-slate-900/60 p-10 rounded-[2.5rem] border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg">
                      <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-4"><AlertTriangle className="text-yellow-400" size={28}/> {t.adminManual.content.rac02Title}</h4>
                      <p className="text-slate-400 text-lg leading-relaxed pl-11">{t.adminManual.content.rac02Text}</p>
                  </div>

                  <div className="bg-slate-900/60 p-10 rounded-[2.5rem] border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg">
                      <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-4"><Workflow className="text-green-400" size={28}/> {t.adminManual.content.expiryTitle}</h4>
                      <p className="text-slate-400 text-lg leading-relaxed pl-11">{t.adminManual.content.expiryText}</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const AdvancedSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-20 tracking-tighter">{t.adminManual.content.advancedTitle}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="p-12 bg-slate-900/80 border border-purple-500/30 rounded-[2.5rem] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all group hover:-translate-y-2">
                  <div className="w-20 h-20 bg-purple-500/20 rounded-3xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
                      <Smartphone size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">{t.adminManual.content.autoBook}</h3>
                  <p className="text-xl text-slate-400 leading-relaxed font-light">
                      {t.adminManual.content.autoBookDesc}
                  </p>
              </div>

              <div className="p-12 bg-slate-900/80 border border-indigo-500/30 rounded-[2.5rem] hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all group hover:-translate-y-2">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 transition-transform">
                      <FileText size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">{t.adminManual.content.aiRep}</h3>
                  <p className="text-xl text-slate-400 leading-relaxed font-light">
                      {t.adminManual.content.aiRepDesc}
                  </p>
              </div>

              <div className="p-12 bg-slate-900/80 border border-orange-500/30 rounded-[2.5rem] hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] transition-all group hover:-translate-y-2">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-400 mb-8 group-hover:scale-110 transition-transform">
                      <AlertTriangle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">{t.adminManual.content.alc}</h3>
                  <p className="text-xl text-slate-400 leading-relaxed font-light">
                      {t.adminManual.content.alcDesc}
                  </p>
              </div>
          </div>
      </div>
  );

  const TroubleshootSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-6xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <div className="text-center mb-16">
              <div className="inline-block p-6 bg-slate-800 rounded-full mb-6 shadow-2xl">
                  <HelpCircle size={64} className="text-slate-400" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{t.adminManual.content.tsTitle}</h2>
          </div>

          <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
                  <h4 className="font-bold text-blue-300 text-2xl mb-3 flex items-center gap-4">
                      <Search size={28}/> {t.adminManual.content.ts1}
                  </h4>
                  <p className="text-xl text-slate-300 pl-11 font-light">{t.adminManual.content.ts1Desc}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
                  <h4 className="font-bold text-red-300 text-2xl mb-3 flex items-center gap-4">
                      <Lock size={28}/> {t.adminManual.content.ts2}
                  </h4>
                  <p className="text-xl text-slate-300 pl-11 font-light">{t.adminManual.content.ts2Desc}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
                  <h4 className="font-bold text-yellow-300 text-2xl mb-3 flex items-center gap-4">
                      <Smartphone size={28}/> {t.adminManual.content.ts3}
                  </h4>
                  <p className="text-xl text-slate-300 pl-11 font-light">{t.adminManual.content.ts3Desc}</p>
              </div>
          </div>
      </div>
  );

  const renderSlide = () => {
      switch(slides[currentSlide].id) {
          case 'intro': return <IntroSlide />;
          case 'objectives': return <ObjectivesSlide />;
          case 'logic': return <LogicSlide />;
          case 'workflow': return <WorkflowSlide />;
          case 'config': return <ConfigSlide />;
          case 'booking': return <BookingSlide />;
          case 'advanced': return <AdvancedSlide />;
          case 'troubleshoot': return <TroubleshootSlide />;
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
