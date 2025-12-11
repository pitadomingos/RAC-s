
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, ChevronLeft, ChevronRight, X, Maximize, 
  Target, Zap, HardHat, Smartphone, CalendarClock,
  Database, Monitor, Lock, Server, Key, Mail,
  Rocket, Code, CheckCircle, BarChart3, FileSpreadsheet, ScrollText,
  User, Award, Briefcase, HeartHandshake, FileText, Phone, GraduationCap, Activity, CreditCard, Wallet, Wrench
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
    { id: 'aboutMe', type: 'aboutMe', title: t.proposal.aboutMe.title },
    { id: 'summary', type: 'content', title: t.proposal.execSummary.title },
    { id: 'objectives', type: 'objectives', title: t.proposal.objectives.title },
    { id: 'organogram', type: 'organogram', title: t.proposal.organogram.title },
    { id: 'timeline', type: 'timeline', title: t.proposal.timeline.title },
    { id: 'tech', type: 'tech', title: t.proposal.techStack.title },
    { id: 'financials', type: 'financials', title: t.proposal.financials.title },
    { id: 'roadmap', type: 'roadmap', title: t.proposal.roadmap.title },
    { id: 'alcohol', type: 'content', title: t.proposal.futureUpdates.title },
    { id: 'enhanced', type: 'enhanced', title: t.proposal.enhancedCaps.title },
    { id: 'conclusion', type: 'conclusion', title: t.proposal.conclusion.title },
    { id: 'thankYou', type: 'thankYou', title: t.proposal.thankYou.title },
  ];

  // Full Screen on Mount (Desktop only usually, mobile browsers block auto-fullscreen)
  useEffect(() => {
    const enterFullScreen = async () => {
        try {
            if (!document.fullscreenElement && window.innerWidth > 768) {
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
      <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up px-4">
          <Shield size={80} className="text-yellow-500 mb-6 md:mb-8 filter drop-shadow-lg md:w-[120px] md:h-[120px]" />
          <h1 className="text-4xl md:text-8xl font-black text-white tracking-tight mb-4 leading-tight">
              {t.common.vulcan}
          </h1>
          <h2 className="text-lg md:text-4xl text-slate-300 font-light uppercase tracking-widest">
              {t.proposal.digitalTrans}
          </h2>
          <div className="mt-8 md:mt-12 text-xs md:text-sm font-mono text-slate-500">
              PITA DOMINGOS • DigiSols
          </div>
      </div>
  );

  const AboutMeSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-12 flex items-center gap-4">
              <User size={48} className="text-yellow-500" />
              {t.proposal.aboutMe.title}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Left Column: Role & Bio */}
              <div className="space-y-6">
                  <div>
                      <h3 className="text-2xl md:text-4xl font-black text-white">{t.proposal.aboutMe.name}</h3>
                      <p className="text-lg md:text-xl text-slate-400 font-medium italic mt-1">
                          "{t.proposal.aboutMe.preferred}"
                      </p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 bg-blue-900/30 p-4 rounded-xl border border-blue-500/30">
                          <Award className="text-blue-400 flex-shrink-0" size={32} />
                          <span className="text-lg md:text-xl font-bold text-blue-100">{t.proposal.aboutMe.cert}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-800 p-4 rounded-xl border border-slate-700">
                          <Briefcase className="text-slate-400 flex-shrink-0" size={32} />
                          <span className="text-lg md:text-xl text-slate-200">{t.proposal.aboutMe.role}</span>
                      </div>
                  </div>

                  <p className="text-base md:text-lg text-slate-300 leading-relaxed text-justify">
                      {t.proposal.aboutMe.bio}
                  </p>
                  
                  {/* Visual Portfolio Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 flex items-center gap-3">
                            <div className="bg-indigo-500/20 p-2 rounded text-indigo-400"><GraduationCap size={20}/></div>
                            <div>
                                <div className="font-bold text-white text-sm">EduDesk</div>
                                <div className="text-[10px] text-slate-400">SaaS • Education</div>
                            </div>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 flex items-center gap-3">
                            <div className="bg-rose-500/20 p-2 rounded text-rose-400"><Activity size={20}/></div>
                            <div>
                                <div className="font-bold text-white text-sm">H365</div>
                                <div className="text-[10px] text-slate-400">SaaS • Health</div>
                            </div>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 flex items-center gap-3">
                            <div className="bg-emerald-500/20 p-2 rounded text-emerald-400"><CreditCard size={20}/></div>
                            <div>
                                <div className="font-bold text-white text-sm">SwiftPOS</div>
                                <div className="text-[10px] text-slate-400">Retail App</div>
                            </div>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 flex items-center gap-3">
                            <div className="bg-amber-500/20 p-2 rounded text-amber-400"><Wallet size={20}/></div>
                            <div>
                                <div className="font-bold text-white text-sm">MicroFin</div>
                                <div className="text-[10px] text-slate-400">Finance App</div>
                            </div>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 flex items-center gap-3">
                            <div className="bg-orange-500/20 p-2 rounded text-orange-400"><Wrench size={20}/></div>
                            <div>
                                <div className="font-bold text-white text-sm">JacTrac</div>
                                <div className="text-[10px] text-slate-400">Hydraulic Tracking</div>
                            </div>
                        </div>
                  </div>
              </div>

              {/* Right Column: Visual Stack Journey */}
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  
                  <h4 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                      <Code size={24} className="text-yellow-500"/> Technical Journey
                  </h4>
                  
                  <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center text-green-400 border border-green-700">
                              <FileSpreadsheet size={24} />
                          </div>
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="w-full h-full bg-green-600/50"></div>
                          </div>
                          <span className="font-bold text-green-400">Excel / PowerBI</span>
                      </div>

                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center text-yellow-400 border border-yellow-700">
                              <Monitor size={24} />
                          </div>
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="w-full h-full bg-yellow-600/50"></div>
                          </div>
                          <span className="font-bold text-yellow-400">Python</span>
                      </div>

                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-400 border border-blue-700">
                              <Code size={24} />
                          </div>
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="w-full h-full bg-blue-500 animate-pulse"></div>
                          </div>
                          <span className="font-bold text-blue-400">React & Node.js</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const SummarySlide = () => (
      <div className="flex flex-col justify-center h-full max-w-6xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-6 md:mb-12 border-l-4 md:border-l-8 border-white pl-4 md:pl-6">
              {t.proposal.execSummary.title}
          </h2>
          <div className="text-lg md:text-3xl text-slate-200 leading-relaxed mb-8 md:mb-12 text-justify">
              {t.proposal.execSummary.text}
          </div>
          <div className="bg-slate-800/50 p-6 md:p-8 rounded-xl border-l-4 border-yellow-500 italic text-lg md:text-2xl text-slate-300">
              {t.proposal.execSummary.quote}
          </div>
      </div>
  );

  const ObjectivesSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-12">{t.proposal.objectives.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              <div className="bg-red-900/30 p-6 md:p-10 rounded-3xl border border-red-500/30">
                  <h3 className="text-xl md:text-3xl font-bold text-red-400 mb-4 md:mb-6 uppercase flex items-center gap-4">
                      <Target size={30} className="md:w-[40px] md:h-[40px]"/> {t.proposal.objectives.problemTitle}
                  </h3>
                  <p className="text-base md:text-xl text-slate-300 leading-relaxed">
                      {t.proposal.objectives.problemText}
                  </p>
              </div>
              <div className="bg-green-900/30 p-6 md:p-10 rounded-3xl border border-green-500/30">
                  <h3 className="text-xl md:text-3xl font-bold text-green-400 mb-4 md:mb-6 uppercase flex items-center gap-4">
                      <CheckCircle size={30} className="md:w-[40px] md:h-[40px]"/> {t.proposal.objectives.solutionTitle}
                  </h3>
                  <ul className="space-y-3 md:space-y-4">
                      {t.proposal.objectives.goals.map((goal, i) => (
                          <li key={i} className="text-base md:text-xl text-slate-200 flex items-start gap-3">
                              <span className="text-green-500 mt-1">✓</span> {goal}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
  );

  const OrganogramSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-12 text-center">{t.proposal.organogram.title}</h2>
          
          {/* Mobile View: Stacked Cards */}
          <div className="md:hidden flex flex-col gap-4">
               <div className="bg-slate-800 border-2 border-yellow-500 p-4 rounded-xl text-center shadow-lg">
                    <div className="text-yellow-500 font-bold text-lg">{t.proposal.organogram.pm}</div>
                    <div className="text-slate-400 text-sm">{t.proposal.organogram.delivery}</div>
                </div>
                <div className="flex flex-col gap-4 border-l-2 border-slate-600 pl-4 ml-4">
                    <div className="bg-slate-800 border border-slate-600 p-4 rounded-xl">
                        <div className="text-blue-400 font-bold">{t.proposal.organogram.tech1}</div>
                        <div className="text-slate-500 text-xs">{t.proposal.organogram.regime}</div>
                    </div>
                    <div className="bg-slate-800 border border-slate-600 p-4 rounded-xl">
                        <div className="text-blue-400 font-bold">{t.proposal.organogram.tech2}</div>
                        <div className="text-slate-500 text-xs">{t.proposal.organogram.regime}</div>
                    </div>
                </div>
          </div>

          {/* Desktop View: Tree Structure */}
          <div className="hidden md:flex flex-col items-center justify-center space-y-8 scale-100 lg:scale-125 origin-top">
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
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-16">{t.proposal.timeline.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                  { icon: Monitor, title: t.proposal.timeline.phase1, desc: t.proposal.timeline.phase1desc },
                  { icon: Code, title: t.proposal.timeline.phase2, desc: t.proposal.timeline.phase2desc },
                  { icon: CheckCircle, title: t.proposal.timeline.phase3, desc: t.proposal.timeline.phase3desc },
                  { icon: Rocket, title: t.proposal.timeline.phase4, desc: t.proposal.timeline.phase4desc },
              ].map((phase, i) => (
                  <div key={i} className="bg-slate-800 p-6 rounded-2xl border-l-8 md:border-l-0 md:border-t-8 border-blue-600 flex flex-row md:flex-col items-center md:items-start gap-4 md:h-80">
                      <div className="bg-slate-900 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-0 md:mb-6 md:-mt-14 border-2 md:border-4 border-blue-600 shadow-lg flex-shrink-0">
                          <phase.icon size={24} className="text-white md:w-[32px] md:h-[32px]" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-4">{phase.title}</h3>
                        <p className="text-slate-400 text-sm md:text-lg leading-snug">{phase.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const TechSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-12">{t.proposal.techStack.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-slate-800 p-6 md:p-8 rounded-2xl flex gap-4 md:gap-6 items-center border border-slate-700">
                  <Monitor size={40} className="text-blue-500 md:w-[64px] md:h-[64px]" />
                  <div>
                      <h3 className="text-xl md:text-3xl font-bold text-white">{t.proposal.techStack.frontendTitle}</h3>
                      <p className="text-sm md:text-xl text-slate-400 mt-1 md:mt-2">{t.proposal.techStack.frontend}</p>
                  </div>
              </div>
              <div className="bg-slate-800 p-6 md:p-8 rounded-2xl flex gap-4 md:gap-6 items-center border border-slate-700">
                  <Server size={40} className="text-green-500 md:w-[64px] md:h-[64px]" />
                  <div>
                      <h3 className="text-xl md:text-3xl font-bold text-white">{t.proposal.techStack.backendTitle}</h3>
                      <p className="text-sm md:text-xl text-slate-400 mt-1 md:mt-2">{t.proposal.techStack.backend}</p>
                  </div>
              </div>
              <div className="bg-slate-800 p-6 md:p-8 rounded-2xl flex gap-4 md:gap-6 items-center border border-slate-700">
                  <Database size={40} className="text-purple-500 md:w-[64px] md:h-[64px]" />
                  <div>
                      <h3 className="text-xl md:text-3xl font-bold text-white">{t.proposal.techStack.databaseTitle}</h3>
                      <p className="text-sm md:text-xl text-slate-400 mt-1 md:mt-2">{t.proposal.techStack.database}</p>
                  </div>
              </div>
              <div className="bg-slate-800 p-6 md:p-8 rounded-2xl flex gap-4 md:gap-6 items-center border border-slate-700">
                  <Lock size={40} className="text-red-500 md:w-[64px] md:h-[64px]" />
                  <div>
                      <h3 className="text-xl md:text-3xl font-bold text-white">{t.proposal.techStack.securityTitle}</h3>
                      <p className="text-sm md:text-xl text-slate-400 mt-1 md:mt-2">{t.proposal.techStack.security}</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const FinancialsSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-6xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-12">{t.proposal.financials.title}</h2>
          <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
              <table className="w-full text-sm md:text-2xl">
                  <thead className="bg-slate-200 text-slate-900">
                      <tr>
                          <th className="p-4 md:p-6 text-left text-slate-900">{t.proposal.financials.item}</th>
                          <th className="p-4 md:p-6 text-right text-slate-900">{t.proposal.financials.cost}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {t.proposal.financials.items.map((item, i) => (
                          <tr key={i} className="border-b border-slate-200">
                              <td className="p-4 md:p-6 font-medium text-slate-900">{item.name}</td>
                              <td className="p-4 md:p-6 text-right font-mono text-slate-700 whitespace-nowrap">{item.cost}</td>
                          </tr>
                      ))}
                      <tr className="bg-slate-900 text-white font-bold text-lg md:text-3xl">
                          <td className="p-4 md:p-8">Total Initial Investment (Items 1 + 2)</td>
                          <td className="p-4 md:p-8 text-right font-mono text-yellow-400 whitespace-nowrap">$17,500.00</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  );

  const RoadmapSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-12">{t.proposal.roadmap.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {[
                  { icon: Key, title: t.proposal.roadmap.auth, desc: t.proposal.roadmap.authDesc },
                  { icon: Database, title: t.proposal.roadmap.db, desc: t.proposal.roadmap.dbDesc },
                  { icon: Mail, title: t.proposal.roadmap.email, desc: t.proposal.roadmap.emailDesc },
                  { icon: Smartphone, title: t.proposal.roadmap.hosting, desc: t.proposal.roadmap.hostingDesc }
              ].map((item, i) => (
                  <div key={i} className="bg-slate-800 p-6 md:p-8 rounded-2xl flex items-start gap-4 md:gap-6 border border-slate-700">
                      <div className="bg-blue-600/20 p-3 md:p-4 rounded-xl text-blue-400">
                          <item.icon size={24} className="md:w-[40px] md:h-[40px]" />
                      </div>
                      <div>
                          <h3 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">{item.title}</h3>
                          <p className="text-sm md:text-xl text-slate-400">{item.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const AlcoholSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-4 md:mb-8">{t.proposal.futureUpdates.title}</h2>
          <p className="text-lg md:text-2xl text-slate-300 mb-8 md:mb-12 leading-relaxed">{t.alcohol.banner.desc}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                <div className="bg-slate-800 p-6 md:p-10 rounded-3xl border border-slate-700">
                    <h3 className="text-xl md:text-3xl font-bold text-blue-400 mb-4 md:mb-6 flex items-center gap-4">
                        <Zap size={24} className="md:w-[32px] md:h-[32px]"/> {t.proposal.futureUpdates.softwareScope.title}
                    </h3>
                    <ul className="space-y-2 md:space-y-4 text-base md:text-xl text-slate-300">
                        <li>• {t.proposal.futureUpdates.softwareScope.feat1}</li>
                        <li>• {t.proposal.futureUpdates.softwareScope.feat2}</li>
                        <li>• {t.proposal.futureUpdates.softwareScope.feat3}</li>
                    </ul>
                </div>
                <div className="bg-slate-800 p-6 md:p-10 rounded-3xl border border-slate-700">
                    <h3 className="text-xl md:text-3xl font-bold text-orange-400 mb-4 md:mb-6 flex items-center gap-4">
                        <HardHat size={24} className="md:w-[32px] md:h-[32px]"/> {t.proposal.futureUpdates.infraScope.title}
                    </h3>
                    <ul className="space-y-2 md:space-y-4 text-base md:text-xl text-slate-300">
                        <li>• {t.proposal.futureUpdates.infraScope.feat1}</li>
                        <li>• {t.proposal.futureUpdates.infraScope.feat2}</li>
                        <li>• {t.proposal.futureUpdates.infraScope.feat3}</li>
                    </ul>
                </div>
          </div>
      </div>
  );

  const EnhancedCapsSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto animate-fade-in px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-8 md:mb-12">{t.proposal.enhancedCaps.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <Smartphone size={24} /> {t.proposal.enhancedCaps.mobileVerify.title}
                  </h3>
                  <p className="text-sm md:text-lg text-slate-300 leading-relaxed">
                      {t.proposal.enhancedCaps.mobileVerify.desc}
                  </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                      <CalendarClock size={24} /> {t.proposal.enhancedCaps.autoBooking.title}
                  </h3>
                  <p className="text-sm md:text-lg text-slate-300 leading-relaxed">
                      {t.proposal.enhancedCaps.autoBooking.desc}
                  </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-3 flex items-center gap-2">
                      <FileSpreadsheet size={24} /> {t.proposal.enhancedCaps.massData.title}
                  </h3>
                  <p className="text-sm md:text-lg text-slate-300 leading-relaxed">
                      {t.proposal.enhancedCaps.massData.desc}
                  </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl md:text-2xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                      <ScrollText size={24} /> {t.proposal.enhancedCaps.auditLogs.title}
                  </h3>
                  <p className="text-sm md:text-lg text-slate-300 leading-relaxed">
                      {t.proposal.enhancedCaps.auditLogs.desc}
                  </p>
              </div>
          </div>
      </div>
  );

  const ConclusionSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-5xl mx-auto animate-fade-in px-4">
          <Shield size={60} className="text-green-500 mb-6 md:mb-8 md:w-[100px] md:h-[100px]" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 md:mb-12 leading-tight">{t.proposal.conclusion.title}</h2>
          <p className="text-lg md:text-3xl text-slate-300 leading-relaxed mb-12 md:mb-16">
              {t.proposal.conclusion.text}
          </p>
      </div>
  );

  const ThankYouSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-5xl mx-auto animate-fade-in px-4">
          <HeartHandshake size={80} className="text-pink-500 mb-6 md:mb-8 md:w-[120px] md:h-[120px]" />
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight">{t.proposal.thankYou.title}</h1>
          <p className="text-xl md:text-3xl text-slate-300 mb-12">{t.proposal.thankYou.message}</p>
          
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm">
              <div className="flex flex-col gap-4 items-center">
                  <div className="flex items-center gap-3 text-lg md:text-2xl text-blue-400">
                      <Mail size={32} />
                      <span className="font-mono">{t.proposal.thankYou.contact}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg md:text-2xl text-green-400">
                      <Phone size={32} />
                      <span className="font-mono">{t.proposal.thankYou.phone}</span>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderSlide = () => {
      switch(slides[currentSlide].id) {
          case 'title': return <TitleSlide />;
          case 'aboutMe': return <AboutMeSlide />;
          case 'summary': return <SummarySlide />;
          case 'objectives': return <ObjectivesSlide />;
          case 'organogram': return <OrganogramSlide />;
          case 'timeline': return <TimelineSlide />;
          case 'tech': return <TechSlide />;
          case 'financials': return <FinancialsSlide />;
          case 'roadmap': return <RoadmapSlide />;
          case 'alcohol': return <AlcoholSlide />;
          case 'enhanced': return <EnhancedCapsSlide />;
          case 'conclusion': return <ConclusionSlide />;
          case 'thankYou': return <ThankYouSlide />;
          default: return <SummarySlide />;
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden font-sans">
        
        {/* Slide Content with Scroll capability for mobile */}
        <div className="h-full w-full overflow-y-auto pb-24">
            <div className="min-h-full flex flex-col justify-center p-4 md:p-16">
                {renderSlide()}
            </div>
        </div>

        {/* Navigation Bar - Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-t border-slate-700 flex justify-between items-center px-4 md:px-8 shadow-2xl z-50">
            <div className="text-slate-400 font-mono text-xs md:text-sm">
                SLIDE {currentSlide + 1} / {slides.length}
            </div>
            
            <div className="flex gap-4">
                <button 
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-2 md:p-3 bg-slate-800 rounded-full hover:bg-slate-700 disabled:opacity-30 transition-all text-white active:scale-95"
                >
                    <ChevronLeft size={20} className="md:w-6 md:h-6" />
                </button>
                <button 
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="p-2 md:p-3 bg-yellow-500 rounded-full hover:bg-yellow-400 disabled:opacity-30 transition-all text-slate-900 active:scale-95"
                >
                    <ChevronRight size={20} className="md:w-6 md:h-6" />
                </button>
            </div>

            <button 
                onClick={() => {
                    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
                    navigate('/');
                }}
                className="flex items-center gap-1 md:gap-2 text-slate-400 hover:text-white text-xs md:text-sm font-bold uppercase"
            >
                <X size={16} className="md:w-[18px] md:h-[18px]" /> Exit
            </button>
        </div>
    </div>
  );
};

export default PresentationPage;
