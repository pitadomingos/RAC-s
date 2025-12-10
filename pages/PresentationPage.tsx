
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, ChevronLeft, ChevronRight, X, Maximize, 
  Target, Zap, HardHat, Smartphone, CalendarClock,
  Database, Monitor, Lock, Server, Key, Mail,
  Rocket, Code, CheckCircle, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PresentationPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Safety check
  if (!t || !t.proposal) return <div className="p-8 text-white">Loading Presentation...</div>;

  // Define Slides Structure
  const slides = [
    { id: 'title', type: 'title' },
    { id: 'summary', type: 'content', title: t.proposal.execSummary.title },
    { id: 'objectives', type: 'objectives', title: t.proposal.objectives.title },
    { id: 'organogram', type: 'organogram', title: t.proposal.organogram.title },
    { id: 'timeline', type: 'timeline', title: t.proposal.timeline.title },
    { id: 'tech', type: 'tech', title: t.proposal.techStack.title },
    { id: 'financials', type: 'financials', title: t.proposal.financials.title },
    { id: 'roadmap', type: 'roadmap', title: t.proposal.roadmap.title },
    { id: 'alcohol', type: 'content', title: t.proposal.futureUpdates.title }, // Re-using content layout or custom
    { id: 'conclusion', type: 'conclusion', title: t.proposal.conclusion.title },
  ];

  // Full Screen on Mount
  useEffect(() => {
    const enterFullScreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (e) {
            console.error("Fullscreen denied", e);
        }
    };
    enterFullScreen();
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextSlide();
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

  // --- Slide Renderers ---

  const TitleSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
          <Shield size={120} className="text-yellow-500 mb-8 filter drop-shadow-lg" />
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-4">
              {t.common.vulcan}
          </h1>
          <h2 className="text-2xl md:text-4xl text-slate-300 font-light uppercase tracking-widest">
              {t.proposal.digitalTrans}
          </h2>
          <div className="mt-12 text-sm font-mono text-slate-500">
              PITA DOMINGOS • DigiSols
          </div>
      </div>
  );

  const SummarySlide = () => (
      <div className="flex flex-col justify-center h-full max-w-6xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-12 border-l-8 border-white pl-6">
              {t.proposal.execSummary.title}
          </h2>
          <div className="text-2xl md:text-3xl text-slate-200 leading-relaxed mb-12 text-justify">
              {t.proposal.execSummary.text}
          </div>
          <div className="bg-slate-800/50 p-8 rounded-xl border-l-4 border-yellow-500 italic text-xl md:text-2xl text-slate-300">
              {t.proposal.execSummary.quote}
          </div>
      </div>
  );

  const ObjectivesSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-12">{t.proposal.objectives.title}</h2>
          <div className="grid grid-cols-2 gap-12">
              <div className="bg-red-900/30 p-10 rounded-3xl border border-red-500/30">
                  <h3 className="text-3xl font-bold text-red-400 mb-6 uppercase flex items-center gap-4">
                      <Target size={40}/> {t.proposal.objectives.problemTitle}
                  </h3>
                  <p className="text-xl text-slate-300 leading-relaxed">
                      {t.proposal.objectives.problemText}
                  </p>
              </div>
              <div className="bg-green-900/30 p-10 rounded-3xl border border-green-500/30">
                  <h3 className="text-3xl font-bold text-green-400 mb-6 uppercase flex items-center gap-4">
                      <CheckCircle size={40}/> {t.proposal.objectives.solutionTitle}
                  </h3>
                  <ul className="space-y-4">
                      {t.proposal.objectives.goals.map((goal, i) => (
                          <li key={i} className="text-xl text-slate-200 flex items-start gap-3">
                              <span className="text-green-500">✓</span> {goal}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
  );

  const OrganogramSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-12 text-center">{t.proposal.organogram.title}</h2>
          
          <div className="flex flex-col items-center justify-center space-y-8 scale-125 origin-top">
                {/* PM Node */}
                <div className="bg-slate-800 border-2 border-yellow-500 p-6 rounded-2xl w-80 text-center shadow-2xl z-10 relative">
                    <div className="text-yellow-500 font-bold text-2xl mb-1">{t.proposal.organogram.pm}</div>
                    <div className="text-slate-400">{t.proposal.organogram.delivery}</div>
                </div>
                
                <div className="h-16 w-1 bg-slate-600"></div>
                
                {/* Tech Nodes Container */}
                <div className="relative pt-8 border-t-4 border-slate-600 w-[600px] flex justify-between">
                    <div className="absolute -top-1 left-1/2 w-1 h-4 bg-slate-600 -translate-x-1/2"></div>
                    
                    {/* Tech 1 */}
                    <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl w-64 text-center">
                        <div className="text-blue-400 font-bold text-xl mb-1">{t.proposal.organogram.tech1}</div>
                        <div className="text-slate-500 text-sm">{t.proposal.organogram.regime}</div>
                    </div>

                    {/* Tech 2 */}
                    <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl w-64 text-center">
                        <div className="text-blue-400 font-bold text-xl mb-1">{t.proposal.organogram.tech2}</div>
                        <div className="text-slate-500 text-sm">{t.proposal.organogram.regime}</div>
                    </div>
                </div>
          </div>
      </div>
  );

  const TimelineSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-16">{t.proposal.timeline.title}</h2>
          
          <div className="grid grid-cols-4 gap-6">
              {[
                  { icon: Monitor, title: t.proposal.timeline.phase1, desc: t.proposal.timeline.phase1desc },
                  { icon: Code, title: t.proposal.timeline.phase2, desc: t.proposal.timeline.phase2desc },
                  { icon: CheckCircle, title: t.proposal.timeline.phase3, desc: t.proposal.timeline.phase3desc },
                  { icon: Rocket, title: t.proposal.timeline.phase4, desc: t.proposal.timeline.phase4desc },
              ].map((phase, i) => (
                  <div key={i} className="bg-slate-800 p-6 rounded-2xl border-t-8 border-blue-600 h-80 flex flex-col">
                      <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 -mt-14 border-4 border-blue-600 shadow-lg">
                          <phase.icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{phase.title}</h3>
                      <p className="text-slate-400 text-lg leading-snug">{phase.desc}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const TechSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-12">{t.proposal.techStack.title}</h2>
          <div className="grid grid-cols-2 gap-8">
              <div className="bg-slate-800 p-8 rounded-2xl flex gap-6 items-center border border-slate-700">
                  <Monitor size={64} className="text-blue-500" />
                  <div>
                      <h3 className="text-3xl font-bold text-white">{t.proposal.techStack.frontendTitle}</h3>
                      <p className="text-xl text-slate-400 mt-2">{t.proposal.techStack.frontend}</p>
                  </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl flex gap-6 items-center border border-slate-700">
                  <Server size={64} className="text-green-500" />
                  <div>
                      <h3 className="text-3xl font-bold text-white">{t.proposal.techStack.backendTitle}</h3>
                      <p className="text-xl text-slate-400 mt-2">{t.proposal.techStack.backend}</p>
                  </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl flex gap-6 items-center border border-slate-700">
                  <Database size={64} className="text-purple-500" />
                  <div>
                      <h3 className="text-3xl font-bold text-white">{t.proposal.techStack.databaseTitle}</h3>
                      <p className="text-xl text-slate-400 mt-2">{t.proposal.techStack.database}</p>
                  </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl flex gap-6 items-center border border-slate-700">
                  <Lock size={64} className="text-red-500" />
                  <div>
                      <h3 className="text-3xl font-bold text-white">{t.proposal.techStack.securityTitle}</h3>
                      <p className="text-xl text-slate-400 mt-2">{t.proposal.techStack.security}</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const FinancialsSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-6xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-12">{t.proposal.financials.title}</h2>
          <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-2xl">
                  <thead className="bg-slate-200 text-slate-900">
                      <tr>
                          <th className="p-6 text-left">{t.proposal.financials.item}</th>
                          <th className="p-6 text-right">{t.proposal.financials.cost}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {t.proposal.financials.items.map((item, i) => (
                          <tr key={i} className="border-b border-slate-200">
                              <td className="p-6 font-medium text-slate-900">{item.name}</td>
                              <td className="p-6 text-right font-mono text-slate-700">{item.cost}</td>
                          </tr>
                      ))}
                      <tr className="bg-slate-900 text-white font-bold text-3xl">
                          <td className="p-8">Total Initial Investment (Items 1 + 2)</td>
                          <td className="p-8 text-right font-mono text-yellow-400">$17,500.00</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  );

  const RoadmapSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-12">{t.proposal.roadmap.title}</h2>
          <div className="grid grid-cols-2 gap-8">
              {[
                  { icon: Key, title: t.proposal.roadmap.auth, desc: t.proposal.roadmap.authDesc },
                  { icon: Database, title: t.proposal.roadmap.db, desc: t.proposal.roadmap.dbDesc },
                  { icon: Mail, title: t.proposal.roadmap.email, desc: t.proposal.roadmap.emailDesc },
                  { icon: Smartphone, title: t.proposal.roadmap.hosting, desc: t.proposal.roadmap.hostingDesc }
              ].map((item, i) => (
                  <div key={i} className="bg-slate-800 p-8 rounded-2xl flex items-start gap-6 border border-slate-700">
                      <div className="bg-blue-600/20 p-4 rounded-xl text-blue-400">
                          <item.icon size={40} />
                      </div>
                      <div>
                          <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-xl text-slate-400">{item.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const AlcoholSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in">
          <h2 className="text-5xl font-bold text-yellow-500 mb-8">{t.proposal.futureUpdates.title}</h2>
          <p className="text-2xl text-slate-300 mb-12">{t.alcohol.banner.desc}</p>
          
          <div className="grid grid-cols-2 gap-12">
                <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700">
                    <h3 className="text-3xl font-bold text-blue-400 mb-6 flex items-center gap-4">
                        <Zap size={32} /> {t.proposal.futureUpdates.softwareScope.title}
                    </h3>
                    <ul className="space-y-4 text-xl text-slate-300">
                        <li>• {t.proposal.futureUpdates.softwareScope.feat1}</li>
                        <li>• {t.proposal.futureUpdates.softwareScope.feat2}</li>
                        <li>• {t.proposal.futureUpdates.softwareScope.feat3}</li>
                    </ul>
                </div>
                <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700">
                    <h3 className="text-3xl font-bold text-orange-400 mb-6 flex items-center gap-4">
                        <HardHat size={32} /> {t.proposal.futureUpdates.infraScope.title}
                    </h3>
                    <ul className="space-y-4 text-xl text-slate-300">
                        <li>• {t.proposal.futureUpdates.infraScope.feat1}</li>
                        <li>• {t.proposal.futureUpdates.infraScope.feat2}</li>
                        <li>• {t.proposal.futureUpdates.infraScope.feat3}</li>
                    </ul>
                </div>
          </div>
      </div>
  );

  const ConclusionSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-5xl mx-auto animate-fade-in">
          <Shield size={100} className="text-green-500 mb-8" />
          <h2 className="text-6xl font-bold text-white mb-12">{t.proposal.conclusion.title}</h2>
          <p className="text-3xl text-slate-300 leading-relaxed mb-16">
              {t.proposal.conclusion.text}
          </p>
          <div className="text-xl text-slate-500 font-mono">
              END OF PRESENTATION
          </div>
      </div>
  );

  const renderSlide = () => {
      switch(slides[currentSlide].id) {
          case 'title': return <TitleSlide />;
          case 'summary': return <SummarySlide />;
          case 'objectives': return <ObjectivesSlide />;
          case 'organogram': return <OrganogramSlide />;
          case 'timeline': return <TimelineSlide />;
          case 'tech': return <TechSlide />;
          case 'financials': return <FinancialsSlide />;
          case 'roadmap': return <RoadmapSlide />;
          case 'alcohol': return <AlcoholSlide />;
          case 'conclusion': return <ConclusionSlide />;
          default: return <SummarySlide />;
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden font-sans">
        
        {/* Slide Content */}
        <div className="h-full w-full p-8 md:p-16">
            {renderSlide()}
        </div>

        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-t border-slate-700 flex justify-between items-center px-8">
            <div className="text-slate-400 font-mono text-sm">
                SLIDE {currentSlide + 1} / {slides.length}
            </div>
            
            <div className="flex gap-4">
                <button 
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 disabled:opacity-30 transition-all text-white"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="p-3 bg-yellow-500 rounded-full hover:bg-yellow-400 disabled:opacity-30 transition-all text-slate-900"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <button 
                onClick={() => {
                    if (document.exitFullscreen) document.exitFullscreen();
                    navigate('/');
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold uppercase"
            >
                <X size={18} /> Exit
            </button>
        </div>
    </div>
  );
};

export default PresentationPage;
