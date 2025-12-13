
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
          <div className="relative mb-12 group">
              <div className="absolute inset-0 bg-vulcan-green blur-[80px] opacity-30 animate-pulse-slow"></div>
              <Shield size={160} className="text-white relative z-10 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-float" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight max-w-5xl">{t.proposal.title}</h1>
          <div className="h-1.5 w-32 bg-yellow-500 rounded-full mb-8"></div>
          <h2 className="text-xl md:text-3xl text-slate-300 font-light uppercase tracking-widest animate-slide-in-right">{t.proposal.subtitle}</h2>
      </div>
  );

  const GenericListSlide = ({ title, items, icon: Icon }: any) => (
      <div className="flex flex-col justify-center min-h-full py-20 max-w-7xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-900/80 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors">
                      <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                          {Icon && <Icon size={24} className="text-blue-400" />} {item.title || item.name || item.role}
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const CostsSlide = () => (
      <div className="flex flex-col justify-center min-h-full py-20 max-w-5xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">{t.proposal.costs.title}</h2>
              <p className="text-2xl text-slate-400 font-light">{t.proposal.costs.subtitle}</p>
          </div>
          <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
              {t.proposal.costs.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-8 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><DollarSign size={24} /></div>
                          <div>
                              <span className="text-xl font-bold text-slate-200 block">{item.item}</span>
                              <span className="text-xs text-slate-500 uppercase">{item.type}</span>
                          </div>
                      </div>
                      <span className="text-2xl font-mono font-bold text-white">{item.cost}</span>
                  </div>
              ))}
          </div>
      </div>
  );

  const ContactSlide = () => (
      <div className="flex flex-col items-center justify-center min-h-full py-20 text-center max-w-5xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <div className="mb-12 p-8 bg-white/5 rounded-full border border-white/10 backdrop-blur-md"><Mail size={64} className="text-white" /></div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-12">{t.proposal.thankYou.title}</h2>
          <div className="flex flex-col gap-6 text-xl md:text-2xl text-slate-300">
              <div className="flex items-center gap-4 justify-center"><Phone className="text-green-400" /> {t.proposal.thankYou.phone}</div>
              <div className="flex items-center gap-4 justify-center"><Mail className="text-blue-400" /> {t.proposal.thankYou.contact}</div>
              <div className="flex items-center gap-4 justify-center text-lg text-slate-500 mt-4"><MapPin size={20} /> {t.proposal.thankYou.address}</div>
          </div>
      </div>
  );

  const renderSlide = () => {
      // Data Transformation for Organogram Slide
      const organogramItems = [
          { name: t.proposal.organogram.pm, desc: 'Project Manager (Delivery Lead)' },
          { name: t.proposal.organogram.tech1, desc: 'Technician 1 (Full-Stack Dev)' },
          { name: t.proposal.organogram.tech2, desc: 'Technician 2 (Database/Deploy)' }
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center px-2 shadow-2xl z-50 ring-1 ring-white/5 transition-all hover:bg-white/10">
            <button onClick={prevSlide} disabled={currentSlide === 0} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white"><ChevronLeft size={24} /></button>
            <div className="px-6 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slide</span>
                <span className="text-lg font-mono font-bold text-white leading-none">{currentSlide + 1} <span className="text-slate-600">/</span> {slides.length}</span>
            </div>
            <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white"><ChevronRight size={24} /></button>
            <div className="w-px h-8 bg-white/10 mx-2"></div>
            <button onClick={toggleFullScreen} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all">{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</button>
            <button onClick={() => navigate('/')} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-all ml-1"><X size={20} /></button>
        </div>
    </div>
  );
};

export default PresentationPage;
