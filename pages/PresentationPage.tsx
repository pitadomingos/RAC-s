
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, ChevronLeft, ChevronRight, X, Maximize, Minimize,
  Target, Zap, Calendar, Database, Server, Code, Users, 
  DollarSign, CheckCircle, BookOpen, Mail, Phone, MapPin,
  Cpu, Wine
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PresentationPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!t || !t.proposal || !t.proposal.foreword || !t.proposal.thankYou) {
      return <div className="text-white p-10">Loading...</div>;
  }

  // Updated Slides based on new JSON structure
  const slides = [
    { id: 'title', type: 'title' },
    { id: 'exec', type: 'exec', title: t.proposal.foreword.title },
    { id: 'objectives', type: 'objectives', title: t.proposal.objectives.title },
    { id: 'organogram', type: 'organogram', title: t.proposal.organogram.title },
    { id: 'roles', type: 'roles', title: t.proposal.roles.title },
    { id: 'timeline', type: 'timeline', title: t.proposal.timeline.title },
    { id: 'tech', type: 'tech', title: t.proposal.techStack.title },
    { id: 'costs', type: 'costs', title: t.proposal.costs.title },
    { id: 'roadmap', type: 'roadmap', title: t.proposal.roadmap.title },
    { id: 'ai', type: 'ai', title: t.proposal.ai.title },
    { id: 'alcohol', type: 'alcohol', title: t.proposal.alcohol.title },
    { id: 'enhanced', type: 'enhanced', title: t.proposal.enhanced.title },
    { id: 'conclusion', type: 'conclusion', title: t.proposal.conclusion.title },
    { id: 'contact', type: 'contact', title: t.proposal.thankYou.title },
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
      <div className="flex flex-col items-center justify-center min-h-full py-20 text-center px-4 relative z-10 animate-fade-in-up">
          <div className="relative mb-16 group">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] opacity-40 animate-pulse-slow"></div>
              {/* Replaced generic Shield with actual Logo */}
              <img 
                src="assets/DigiSol_Logo.png" 
                alt="DigiSol Orbit" 
                className="w-72 md:w-96 lg:w-[30rem] h-auto object-contain relative z-10 animate-float drop-shadow-2xl"
                onError={(e) => { 
                    e.currentTarget.style.display = 'none'; 
                    // Fallback if image fails - show nothing or alt
                }}
              />
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight max-w-6xl tracking-tighter drop-shadow-lg">
              {t.proposal.title}
          </h1>
          
          <div className="h-2 w-48 bg-yellow-500 rounded-full mb-10 shadow-[0_0_20px_rgba(234,179,8,0.5)]"></div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl text-slate-200 font-light uppercase tracking-[0.2em] animate-slide-in-right">
              {t.proposal.subtitle}
          </h2>
      </div>
  );

  const GenericListSlide = ({ title, items, icon: Icon }: any) => (
      <div className="flex flex-col justify-center min-h-full py-10 max-w-[90%] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-20 text-center tracking-tight drop-shadow-md">
              {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {items.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-900/60 p-10 rounded-3xl border border-slate-600/50 hover:border-blue-500 hover:bg-slate-800/80 transition-all backdrop-blur-sm">
                      <h4 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-4">
                          {Icon && <div className="p-3 bg-blue-500/20 rounded-xl"><Icon size={40} className="text-blue-400" /></div>} 
                          {item.title || item.name || item.role}
                      </h4>
                      <p className="text-slate-300 text-xl md:text-2xl leading-relaxed font-light">
                          {item.desc}
                      </p>
                  </div>
              ))}
          </div>
      </div>
  );

  const CostsSlide = () => (
      <div className="flex flex-col justify-center min-h-full py-20 max-w-[85%] mx-auto px-6 relative z-10 animate-fade-in-up">
          <div className="text-center mb-20">
              <h2 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">{t.proposal.costs.title}</h2>
              <p className="text-3xl md:text-4xl text-slate-400 font-light">{t.proposal.costs.subtitle}</p>
          </div>
          <div className="bg-slate-900/80 rounded-[2.5rem] border border-slate-600 overflow-hidden shadow-2xl backdrop-blur-md">
              {t.proposal.costs.items.map((item: any, i: number) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-10 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/50 transition-colors gap-4">
                      <div className="flex items-start gap-6">
                          <div className="p-4 bg-green-500/10 rounded-2xl text-green-400 shrink-0 mt-1"><DollarSign size={40} /></div>
                          <div>
                              <span className="text-3xl md:text-4xl font-bold text-slate-100 block mb-2">{item.item}</span>
                              <span className="text-lg md:text-xl text-slate-500 uppercase tracking-wider font-bold">{item.type}</span>
                          </div>
                      </div>
                      <span className="text-4xl md:text-5xl font-mono font-bold text-green-400 text-right">{item.cost}</span>
                  </div>
              ))}
          </div>
      </div>
  );

  const ConclusionSlide = () => (
      <div className="flex flex-col items-center justify-center min-h-full py-20 px-6 max-w-6xl mx-auto relative z-10 animate-fade-in-up text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tight">{t.proposal.conclusion.title}</h2>
          <p className="text-2xl md:text-4xl text-slate-300 font-light leading-relaxed max-w-5xl">
              "{t.proposal.conclusion.text}"
          </p>
      </div>
  );

  const ContactSlide = () => (
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
      // Data Transformation for Organogram Slide - Remove Hardcoded English
      const organogramItems = [
          { name: t.proposal.organogram.pm, desc: '' },
          { name: t.proposal.organogram.tech1, desc: '' },
          { name: t.proposal.organogram.tech2, desc: '' }
      ];

      switch(slides[currentSlide].id) {
          case 'title': return <TitleSlide />;
          case 'exec': return <GenericListSlide title={t.proposal.foreword.title} items={[{title: t.proposal.foreword.overviewTitle, desc: t.proposal.foreword.overviewText}]} icon={BookOpen} />;
          case 'objectives': return <GenericListSlide title={t.proposal.objectives.title} items={t.proposal.objectives.items} icon={Target} />;
          case 'organogram': return <GenericListSlide title={t.proposal.organogram.title} items={organogramItems} icon={Users} />;
          case 'roles': return <GenericListSlide title={t.proposal.roles.title} items={t.proposal.roles.items} icon={Users} />;
          case 'timeline': return <GenericListSlide title={t.proposal.timeline.title} items={t.proposal.timeline.phases} icon={Calendar} />;
          case 'tech': return <GenericListSlide title={t.proposal.techStack.title} items={t.proposal.techStack.items} icon={Code} />;
          case 'costs': return <CostsSlide />;
          case 'roadmap': return <GenericListSlide title={t.proposal.roadmap.title} items={t.proposal.roadmap.items} icon={Zap} />;
          case 'ai': return <GenericListSlide title={t.proposal.ai.title} items={t.proposal.ai.items} icon={Cpu} />;
          case 'alcohol': return <GenericListSlide title={t.proposal.alcohol.title} items={t.proposal.alcohol.items} icon={Wine} />;
          case 'enhanced': return <GenericListSlide title={t.proposal.enhanced.title} items={t.proposal.enhanced.items} icon={CheckCircle} />;
          case 'conclusion': return <ConclusionSlide />;
          case 'contact': return <ContactSlide />;
          default: return <TitleSlide />;
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden font-sans select-none">
        {/* Background */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full w-full overflow-y-auto pb-32 scrollbar-hide">
            <div className="min-h-full flex flex-col justify-center p-4 md:p-8 lg:p-16">
                {renderSlide()}
            </div>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center px-4 shadow-2xl z-50 ring-1 ring-white/5 transition-all hover:bg-white/10">
            <button onClick={prevSlide} disabled={currentSlide === 0} className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white"><ChevronLeft size={32} /></button>
            <div className="px-8 flex flex-col items-center min-w-[160px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slide</span>
                <span className="text-2xl font-mono font-bold text-white leading-none">{currentSlide + 1} <span className="text-slate-600">/</span> {slides.length}</span>
            </div>
            <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white"><ChevronRight size={32} /></button>
            <div className="w-px h-10 bg-white/10 mx-4"></div>
            <button onClick={toggleFullScreen} className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all">{isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}</button>
            <button onClick={() => navigate('/')} className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-all ml-2"><X size={28} /></button>
        </div>
    </div>
  );
};

export default PresentationPage;
