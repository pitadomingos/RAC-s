
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, ChevronLeft, ChevronRight, X, Maximize, Minimize,
  Target, Zap, HardHat, Smartphone, CalendarClock,
  Database, Monitor, Lock, Server, Key, Mail,
  Rocket, Code, CheckCircle,
  User, Award, Briefcase, HeartHandshake, FileText, Phone, GraduationCap, Activity, CreditCard, Wallet, Wrench, Layers,
  AlertTriangle, Play, CheckSquare, Wifi, ScanFace, Bluetooth, FileSpreadsheet, ScrollText, Grid, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PresentationPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Safety check
  if (!t || !t.proposal) return <div className="p-8 text-white bg-slate-900 h-screen flex items-center justify-center">Loading Presentation...</div>;

  // Define Slides Structure
  const slides = [
    { id: 'title', type: 'title' },
    { id: 'aboutMe', type: 'aboutMe', title: t.proposal.aboutMe.title },
    { id: 'scenario', type: 'scenario', title: 'Real World Scenario' },
    { id: 'summary', type: 'content', title: t.proposal.execSummary.title },
    { id: 'objectives', type: 'objectives', title: t.proposal.objectives.title },
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

  const nextSlide = () => {
      if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
      if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  // --- Slide Components ---

  const TitleSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 relative z-10 animate-fade-in-up">
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
          
          <div className="relative mb-16 group">
              <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
              <Shield size={220} className="text-yellow-500 relative z-10 drop-shadow-[0_0_50px_rgba(234,179,8,0.5)] animate-float" />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter mb-8 leading-none drop-shadow-2xl">
              {t.common.vulcan}
          </h1>
          
          <div className="h-2 w-48 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-12 shadow-[0_0_20px_rgba(249,115,22,0.6)]"></div>

          <h2 className="text-3xl md:text-5xl text-slate-300 font-light uppercase tracking-[0.4em] animate-slide-in-right">
              {t.proposal.digitalTrans}
          </h2>
          
          <div className="mt-20 flex items-center gap-6 px-10 py-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors shadow-2xl">
              <span className="text-xl font-bold text-slate-300">PITA DOMINGOS</span>
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></span>
              <span className="text-xl font-mono text-yellow-500 tracking-widest">DigiSols</span>
          </div>
      </div>
  );

  const ScenarioSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1800px] mx-auto px-8 md:px-16 relative z-10">
          <div className="flex items-center gap-8 mb-20 animate-fade-in-down">
              <div className="p-6 bg-orange-500/10 rounded-[2rem] border border-orange-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(249,115,22,0.2)]">
                  <Play size={64} className="text-orange-500" />
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter">Zero-Downtime Workflow</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12 relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {/* Decorative Line */}
                  <div className="absolute left-10 top-10 bottom-10 w-1 bg-gradient-to-b from-red-500/50 via-slate-700 to-green-500/50"></div>

                  <div className="bg-slate-900/40 p-10 pl-16 rounded-[3rem] border border-red-500/30 backdrop-blur-sm relative ml-0 hover:bg-slate-900/60 transition-colors group">
                      <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 border-4 border-red-500 rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                          <AlertTriangle size={18} className="text-red-500" />
                      </div>
                      <h3 className="text-4xl font-bold text-red-400 mb-4 group-hover:text-red-300 transition-colors">The Risk</h3>
                      <p className="text-2xl text-slate-300 leading-relaxed font-light">
                          Operator <strong>Paulo Manjate</strong> has a Critical RAC 02 certification expiring in <strong className="text-white bg-red-500/20 px-3 py-1 rounded border border-red-500/30">3 days</strong>.
                          Access denial is imminent.
                      </p>
                  </div>

                  <div className="bg-slate-900/40 p-10 pl-16 rounded-[3rem] border border-green-500/30 backdrop-blur-sm relative ml-0 hover:bg-slate-900/60 transition-colors group">
                      <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 border-4 border-green-500 rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                          <Zap size={18} className="text-green-500" />
                      </div>
                      <h3 className="text-4xl font-bold text-green-400 mb-4 group-hover:text-green-300 transition-colors">The Auto-Fix</h3>
                      <p className="text-2xl text-slate-300 leading-relaxed font-light">
                          System detects risk &lt; 7 Days.
                          <br/>
                          Automatically <strong className="text-green-400">reserves a seat</strong> in the next available session (Tomorrow). 
                          <span className="block mt-4 text-lg text-slate-500 font-mono">// No human intervention required.</span>
                      </p>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-[3rem] shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 animate-float">
                  <div className="bg-slate-950 rounded-[2.5rem] p-16 flex flex-col justify-center items-center text-center h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                      
                      <div className="w-40 h-40 bg-blue-600 rounded-full flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(37,99,235,0.4)] animate-pulse">
                          <CalendarClock size={80} className="text-white" />
                      </div>
                      <h3 className="text-5xl font-black text-white mb-6">Live Demo</h3>
                      <p className="text-slate-400 mb-12 text-2xl max-w-lg leading-relaxed">
                          Check the Dashboard. You should see a <span className="text-orange-400 font-bold">Pending Action</span> alert for Paulo Manjate.
                      </p>
                      <button 
                        onClick={() => navigate('/')}
                        className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-2xl overflow-hidden shadow-2xl hover:shadow-white/20 transition-all"
                      >
                          <span className="relative z-10">Go to Dashboard</span>
                          <ChevronRight size={32} className="relative z-10 group-hover:translate-x-2 transition-transform"/>
                          <div className="absolute inset-0 bg-blue-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  const AboutMeSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 h-full items-center">
              
              {/* Left: Profile Card */}
              <div className="lg:col-span-5 flex flex-col justify-center animate-slide-in-right">
                  <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                      <div className="relative bg-slate-900 border border-slate-800 p-12 rounded-[3rem] shadow-2xl">
                          <div className="flex items-center gap-6 mb-10">
                              <div className="p-6 bg-slate-800 rounded-3xl text-yellow-500 border border-slate-700 shadow-inner">
                                  <User size={64} />
                              </div>
                              <div>
                                  <h3 className="text-4xl font-black text-white tracking-tight mb-2">{t.proposal.aboutMe.name}</h3>
                                  <p className="text-2xl text-slate-400 font-serif italic">"{t.proposal.aboutMe.preferred}"</p>
                              </div>
                          </div>
                          
                          <div className="space-y-6 mb-10">
                              <div className="flex items-center gap-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                                  <Award className="text-blue-400 shrink-0" size={32} />
                                  <span className="text-xl font-bold text-slate-200">{t.proposal.aboutMe.cert}</span>
                              </div>
                              <div className="flex items-center gap-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                                  <Briefcase className="text-green-400 shrink-0" size={32} />
                                  <span className="text-xl text-slate-200">{t.proposal.aboutMe.role}</span>
                              </div>
                          </div>

                          <p className="text-xl text-slate-400 leading-relaxed text-justify border-t border-slate-800 pt-8 font-light">
                              {t.proposal.aboutMe.bio}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Right: Portfolio Grid */}
              <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h4 className="text-4xl font-bold text-white mb-12 flex items-center gap-4">
                      <Layers className="text-yellow-500" size={40} /> Portfolio & Stack
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {[
                          { name: 'EduDesk', sub: 'Education SaaS', icon: GraduationCap, color: 'indigo' },
                          { name: 'H365', sub: 'Health SaaS', icon: Activity, color: 'rose' },
                          { name: 'SwiftPOS', sub: 'Retail Point of Sale', icon: CreditCard, color: 'emerald' },
                          { name: 'MicroFin', sub: 'Finance Tracker', icon: Wallet, color: 'amber' },
                          { name: 'JacTrac', sub: 'Asset Tracking', icon: Wrench, color: 'orange' },
                      ].map((item, i) => (
                          <div key={i} className={`p-8 bg-slate-800/40 border border-slate-700 hover:border-${item.color}-500/50 rounded-3xl hover:bg-slate-800 transition-all cursor-default group backdrop-blur-sm`}>
                              <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.2)]`}>
                                  <item.icon size={32} />
                              </div>
                              <div className="font-bold text-white text-2xl">{item.name}</div>
                              <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mt-2">{item.sub}</div>
                          </div>
                      ))}
                  </div>

                  <div className="mt-12 p-8 bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-md">
                      <div className="flex justify-between text-lg text-slate-400 font-mono mb-4">
                          <span>Full Stack Proficiency</span>
                          <span className="text-white font-bold">React • Node • Python</span>
                      </div>
                      <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-[95%] animate-pulse"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const SummarySlide = () => (
      <div className="flex flex-col justify-center h-full max-w-7xl mx-auto text-center px-6 relative z-10 animate-fade-in-up">
          <div className="mb-16">
              <h2 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 mb-8 drop-shadow-sm tracking-tighter">
                  {t.proposal.execSummary.title}
              </h2>
              <div className="w-40 h-2 bg-yellow-500 mx-auto rounded-full shadow-[0_0_20px_#eab308]"></div>
          </div>
          
          <div className="bg-slate-900/50 p-16 rounded-[4rem] border border-white/10 backdrop-blur-xl shadow-2xl relative group hover:bg-slate-900/60 transition-colors">
              <div className="absolute -top-10 -left-10 text-9xl text-yellow-500/20 font-serif group-hover:text-yellow-500/40 transition-colors">"</div>
              <div className="text-3xl md:text-5xl text-slate-200 leading-relaxed font-light">
                  {t.proposal.execSummary.text}
              </div>
              <div className="absolute -bottom-10 -right-10 text-9xl text-yellow-500/20 font-serif rotate-180 group-hover:text-yellow-500/40 transition-colors">"</div>
          </div>

          <div className="mt-16 text-slate-400 italic text-2xl animate-pulse font-serif">
              {t.proposal.execSummary.quote}
          </div>
      </div>
  );

  const ObjectivesSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1800px] mx-auto px-8 md:px-16 relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-24 text-center animate-fade-in-down tracking-tighter">{t.proposal.objectives.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              {/* Problem Card */}
              <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                  <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative bg-slate-900/80 p-16 rounded-[3rem] border border-red-500/30 backdrop-blur-md h-full hover:border-red-500/50 transition-colors shadow-2xl">
                      <div className="w-24 h-24 bg-red-500/20 rounded-3xl flex items-center justify-center text-red-500 mb-10 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                          <Target size={48} />
                      </div>
                      <h3 className="text-5xl font-bold text-white mb-8 uppercase tracking-wide">{t.proposal.objectives.problemTitle}</h3>
                      <p className="text-2xl text-slate-400 leading-relaxed font-light">
                          {t.proposal.objectives.problemText}
                      </p>
                  </div>
              </div>

              {/* Solution Card */}
              <div className="group relative animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                  <div className="absolute inset-0 bg-green-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative bg-slate-900/80 p-16 rounded-[3rem] border border-green-500/30 backdrop-blur-md h-full hover:border-green-500/50 transition-colors shadow-2xl">
                      <div className="w-24 h-24 bg-green-500/20 rounded-3xl flex items-center justify-center text-green-500 mb-10 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                          <CheckCircle size={48} />
                      </div>
                      <h3 className="text-5xl font-bold text-white mb-8 uppercase tracking-wide">{t.proposal.objectives.solutionTitle}</h3>
                      <ul className="space-y-6">
                          {t.proposal.objectives.goals.map((goal, i) => (
                              <li key={i} className="flex items-center gap-6 text-2xl text-slate-300">
                                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_#22c55e]"></div>
                                  {goal}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  );

  const OrganogramSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-24 text-center tracking-tighter">{t.proposal.organogram.title}</h2>
          
          <div className="flex flex-col items-center scale-75 md:scale-100 origin-top">
                {/* PM Node */}
                <div className="relative z-10 bg-slate-800 p-12 rounded-[3rem] border-4 border-yellow-500 shadow-[0_0_60px_rgba(234,179,8,0.3)] text-center w-[28rem] hover:scale-105 transition-transform">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-xl text-slate-900">
                        <User size={40} />
                    </div>
                    <div className="text-4xl font-bold text-white mt-4 mb-2">{t.proposal.organogram.pm}</div>
                    <div className="text-yellow-500 font-mono text-xl">{t.proposal.organogram.delivery}</div>
                </div>
                
                {/* Connector */}
                <div className="h-24 w-1 bg-gradient-to-b from-yellow-500 to-slate-600"></div>
                
                {/* Branch Line */}
                <div className="relative w-[800px] border-t-4 border-slate-600 flex justify-between h-12">
                    <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-600 rounded-full"></div>
                    <div className="w-1 h-full bg-slate-600"></div> {/* Left drop */}
                    <div className="w-1 h-full bg-slate-600"></div> {/* Right drop */}
                </div>

                {/* Tech Nodes */}
                <div className="flex gap-24 w-[1000px] justify-between">
                    <div className="bg-slate-900/80 p-8 rounded-[2rem] border border-slate-700 w-96 text-center backdrop-blur-sm hover:border-blue-500 transition-all hover:scale-105 hover:shadow-2xl">
                        <div className="text-blue-400 font-bold text-3xl mb-3">{t.proposal.organogram.tech1}</div>
                        <div className="text-slate-500 text-lg font-mono bg-slate-950 py-2 rounded-xl">{t.proposal.organogram.regime}</div>
                    </div>

                    <div className="bg-slate-900/80 p-8 rounded-[2rem] border border-slate-700 w-96 text-center backdrop-blur-sm hover:border-blue-500 transition-all hover:scale-105 hover:shadow-2xl">
                        <div className="text-blue-400 font-bold text-3xl mb-3">{t.proposal.organogram.tech2}</div>
                        <div className="text-slate-500 text-lg font-mono bg-slate-950 py-2 rounded-xl">{t.proposal.organogram.regime}</div>
                    </div>
                </div>
          </div>
      </div>
  );

  const TimelineSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1800px] mx-auto px-8 md:px-16 relative z-10 animate-fade-in-up">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-28 tracking-tighter">{t.proposal.timeline.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                  { icon: Monitor, title: t.proposal.timeline.phase1, desc: t.proposal.timeline.phase1desc, color: 'blue' },
                  { icon: Code, title: t.proposal.timeline.phase2, desc: t.proposal.timeline.phase2desc, color: 'purple' },
                  { icon: CheckCircle, title: t.proposal.timeline.phase3, desc: t.proposal.timeline.phase3desc, color: 'green' },
                  { icon: Rocket, title: t.proposal.timeline.phase4, desc: t.proposal.timeline.phase4desc, color: 'orange' },
              ].map((phase, i) => (
                  <div key={i} className="relative group">
                      {/* Connecting Line (Desktop) */}
                      {i < 3 && (
                          <div className="hidden md:block absolute top-12 left-1/2 w-full h-2 bg-slate-800 -z-10 group-hover:bg-slate-700 transition-colors"></div>
                      )}
                      
                      <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] h-full hover:-translate-y-4 transition-transform duration-300 relative overflow-hidden backdrop-blur-md shadow-xl">
                          <div className={`absolute top-0 left-0 w-full h-2 bg-${phase.color}-500`}></div>
                          
                          <div className={`w-24 h-24 rounded-3xl bg-${phase.color}-500/10 flex items-center justify-center text-${phase.color}-500 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.3)]`}>
                              <phase.icon size={48} />
                          </div>
                          
                          <h3 className="text-3xl font-bold text-white mb-4">Phase {i + 1}</h3>
                          <h4 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-4">{phase.title.split(':')[0]}</h4>
                          <p className="text-slate-500 text-lg leading-relaxed">{phase.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const TechSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-24 tracking-tighter">{t.proposal.techStack.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <TechCard icon={Monitor} title={t.proposal.techStack.frontendTitle} desc={t.proposal.techStack.frontend} color="blue" />
              <TechCard icon={Server} title={t.proposal.techStack.backendTitle} desc={t.proposal.techStack.backend} color="green" />
              <TechCard icon={Database} title={t.proposal.techStack.databaseTitle} desc={t.proposal.techStack.database} color="yellow" />
              <TechCard icon={Lock} title={t.proposal.techStack.securityTitle} desc={t.proposal.techStack.security} color="red" />
          </div>
      </div>
  );

  const TechCard = ({ icon: Icon, title, desc, color }: any) => (
      <div className="flex items-center gap-10 p-12 bg-slate-900/60 rounded-[3rem] border border-slate-800 backdrop-blur-sm hover:border-slate-600 transition-all group hover:-translate-y-2 hover:shadow-2xl">
          <div className={`w-32 h-32 rounded-[2rem] bg-${color}-500/10 flex items-center justify-center text-${color}-500 shadow-[0_0_50px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform`}>
              <Icon size={64} />
          </div>
          <div>
              <h3 className="text-4xl font-bold text-white mb-4">{title}</h3>
              <p className="text-slate-400 font-mono text-xl">{desc}</p>
          </div>
      </div>
  );

  const FinancialsSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1400px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-20 tracking-tighter">{t.proposal.financials.title}</h2>
          
          <div className="bg-slate-900/80 rounded-[3rem] border border-slate-700 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-12 bg-slate-950 p-10 border-b border-slate-800 text-slate-400 font-bold uppercase text-lg tracking-wider">
                  <div className="col-span-8">Item Description</div>
                  <div className="col-span-4 text-right">Cost (USD)</div>
              </div>
              
              <div className="divide-y divide-slate-800">
                  {t.proposal.financials.items.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 p-10 hover:bg-slate-800/50 transition-colors items-center">
                          <div className="col-span-8">
                              <div className="text-white font-medium text-3xl">{item.name}</div>
                              <div className="text-slate-500 text-lg mt-2 bg-slate-800 inline-block px-4 py-1 rounded-full border border-slate-700 font-bold">{item.type}</div>
                          </div>
                          <div className="col-span-4 text-right font-mono text-3xl text-slate-300">
                              {item.cost}
                          </div>
                      </div>
                  ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-12 flex justify-between items-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                  <div className="text-3xl font-bold uppercase tracking-wider opacity-90 relative z-10">Total Investment</div>
                  <div className="text-6xl font-black font-mono tracking-tight relative z-10 shadow-black drop-shadow-md">$17,500.00</div>
              </div>
          </div>
      </div>
  );

  const RoadmapSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-20 tracking-tighter">{t.proposal.roadmap.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                  { icon: Key, title: t.proposal.roadmap.auth, desc: t.proposal.roadmap.authDesc },
                  { icon: Database, title: t.proposal.roadmap.db, desc: t.proposal.roadmap.dbDesc },
                  { icon: Mail, title: t.proposal.roadmap.email, desc: t.proposal.roadmap.emailDesc },
                  { icon: Smartphone, title: t.proposal.roadmap.hosting, desc: t.proposal.roadmap.hostingDesc }
              ].map((item, i) => (
                  <div key={i} className="group p-12 bg-slate-900/50 border border-slate-800 rounded-[3rem] hover:bg-slate-800 transition-all backdrop-blur-sm shadow-xl">
                      <div className="flex items-start justify-between mb-8">
                          <div className="p-6 bg-blue-500/10 rounded-[2rem] text-blue-400 group-hover:text-blue-300 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                              <item.icon size={48} />
                          </div>
                          <span className="text-slate-600 font-black text-7xl opacity-20 group-hover:opacity-40 transition-opacity">0{i+1}</span>
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-6">{item.title}</h3>
                      <p className="text-slate-400 text-xl leading-relaxed">{item.desc}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const AlcoholSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1600px] mx-auto px-6 relative z-10 animate-fade-in-up">
          <div className="mb-20">
              <div className="flex items-center gap-6 mb-6">
                  <span className="bg-yellow-500/20 text-yellow-500 px-6 py-2 rounded-full text-lg font-bold uppercase tracking-wider border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]">Future Module</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter">{t.proposal.futureUpdates.title}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="bg-slate-900/80 p-16 rounded-[3rem] border border-blue-500/30 relative overflow-hidden group hover:bg-slate-900 transition-colors backdrop-blur-md shadow-2xl">
                  <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Wifi size={250} />
                  </div>
                  <h3 className="text-4xl font-bold text-blue-400 mb-10 flex items-center gap-6">
                      <Zap size={48}/> Software Scope
                  </h3>
                  <ul className="space-y-8">
                      <li className="flex items-center gap-6 text-2xl text-slate-300">
                          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]"><Bluetooth size={32}/></div>
                          API Endpoints for Breathalyzers
                      </li>
                      <li className="flex items-center gap-6 text-2xl text-slate-300">
                          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]"><Activity size={32}/></div>
                          Fitness-for-Duty Dashboard
                      </li>
                      <li className="flex items-center gap-6 text-2xl text-slate-300">
                          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]"><Lock size={32}/></div>
                          Automated Lockout Logic
                      </li>
                  </ul>
              </div>

              <div className="bg-slate-900/80 p-16 rounded-[3rem] border border-orange-500/30 relative overflow-hidden group hover:bg-slate-900 transition-colors backdrop-blur-md shadow-2xl">
                  <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity">
                      <HardHat size={250} />
                  </div>
                  <h3 className="text-4xl font-bold text-orange-400 mb-10 flex items-center gap-6">
                      <Wrench size={48}/> Infra Scope
                  </h3>
                  <ul className="space-y-8">
                      <li className="flex items-center gap-6 text-2xl text-slate-300">
                          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]"><HardHat size={32}/></div>
                          Turnstile Modifications
                      </li>
                      <li className="flex items-center gap-6 text-2xl text-slate-300">
                          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]"><Zap size={32}/></div>
                          Electrical & Cabling
                      </li>
                      <li className="flex items-center gap-6 text-2xl text-slate-300">
                          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]"><ScanFace size={32}/></div>
                          Face-ID Breathalyzers
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  );

  const EnhancedCapsSlide = () => (
      <div className="flex flex-col justify-center h-full max-w-[1800px] mx-auto px-8 relative z-10 animate-fade-in-up">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-24 text-center tracking-tighter">{t.proposal.enhancedCaps.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                  { icon: UserCheck, title: t.proposal.enhancedCaps.selfService.title, desc: t.proposal.enhancedCaps.selfService.desc, color: 'teal' },
                  { icon: Smartphone, title: t.proposal.enhancedCaps.mobileVerify.title, desc: t.proposal.enhancedCaps.mobileVerify.desc, color: 'purple' },
                  { icon: CalendarClock, title: t.proposal.enhancedCaps.autoBooking.title, desc: t.proposal.enhancedCaps.autoBooking.desc, color: 'blue' },
                  { icon: FileSpreadsheet, title: t.proposal.enhancedCaps.massData.title, desc: t.proposal.enhancedCaps.massData.desc, color: 'green' },
                  { icon: ScrollText, title: t.proposal.enhancedCaps.auditLogs.title, desc: t.proposal.enhancedCaps.auditLogs.desc, color: 'orange' },
                  { icon: Grid, title: t.proposal.enhancedCaps.matrixCompliance.title, desc: t.proposal.enhancedCaps.matrixCompliance.desc, color: 'red' }
              ].map((item, i) => (
                  <div key={i} className="bg-slate-900/60 p-12 rounded-[2.5rem] border border-slate-800 hover:border-slate-600 transition-colors group backdrop-blur-sm shadow-xl hover:shadow-2xl">
                      <div className={`w-20 h-20 rounded-3xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                          <item.icon size={40} />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-6 leading-tight">{item.title}</h3>
                      <p className="text-slate-400 text-lg leading-relaxed line-clamp-4 group-hover:text-slate-300 transition-colors">{item.desc}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const ConclusionSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-6xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <div className="w-48 h-48 bg-green-500/20 rounded-full flex items-center justify-center mb-16 animate-pulse-slow shadow-[0_0_60px_rgba(34,197,94,0.3)]">
              <Shield size={96} className="text-green-500" />
          </div>
          <h2 className="text-6xl md:text-9xl font-black text-white mb-16 leading-tight tracking-tighter">
              Operational Excellence <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Achieved.</span>
          </h2>
          <p className="text-3xl md:text-4xl text-slate-300 leading-relaxed max-w-5xl font-light">
              {t.proposal.conclusion.text}
          </p>
      </div>
  );

  const ThankYouSlide = () => (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-6xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <HeartHandshake size={140} className="text-pink-500 mb-12 drop-shadow-[0_0_40px_rgba(236,72,153,0.5)] animate-float" />
          <h1 className="text-8xl md:text-[10rem] font-black text-white mb-12 tracking-tighter">{t.proposal.thankYou.title}</h1>
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-16 rounded-[4rem] w-full max-w-4xl shadow-2xl">
              <div className="flex flex-col gap-10 items-center">
                  <div className="flex items-center gap-6 text-3xl md:text-4xl text-blue-300 hover:text-white transition-colors cursor-pointer group">
                      <div className="p-5 bg-blue-500/20 rounded-full group-hover:scale-110 transition-transform"><Mail size={40} /></div>
                      <span className="font-mono">{t.proposal.thankYou.contact}</span>
                  </div>
                  <div className="w-full h-px bg-white/10"></div>
                  <div className="flex items-center gap-6 text-3xl md:text-4xl text-green-300 hover:text-white transition-colors cursor-pointer group">
                      <div className="p-5 bg-green-500/20 rounded-full group-hover:scale-110 transition-transform"><Phone size={40} /></div>
                      <span className="font-mono">{t.proposal.thankYou.phone}</span>
                  </div>
              </div>
          </div>
          <p className="text-slate-500 mt-20 font-mono text-xl uppercase tracking-[0.2em] font-bold">DigiSols • Tete, Mozambique</p>
      </div>
  );

  const renderSlide = () => {
      const Content = () => {
          switch(slides[currentSlide].id) {
              case 'title': return <TitleSlide />;
              case 'aboutMe': return <AboutMeSlide />;
              case 'scenario': return <ScenarioSlide />;
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
          <div key={currentSlide} className="h-full w-full">
              <Content />
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden font-sans select-none">
        
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-0">
            {/* Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900"></div>
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            {/* Moving Glow Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[150px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Slide Content */}
        <div className="relative z-10 h-full w-full overflow-y-auto pb-24 scrollbar-hide">
            <div className="min-h-full flex flex-col justify-center p-4 md:p-8 lg:p-16">
                {renderSlide()}
            </div>
        </div>

        {/* Navigation Bar - Glassmorphism Dock */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center px-4 shadow-2xl z-50 ring-1 ring-white/5 transition-all hover:bg-white/10">
            <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 text-white transition-all active:scale-90"
            >
                <ChevronLeft size={32} />
            </button>
            
            <div className="px-8 flex flex-col items-center min-w-[150px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Slide</span>
                <span className="text-2xl font-mono font-bold text-white leading-none">
                    {currentSlide + 1} <span className="text-slate-600">/</span> {slides.length}
                </span>
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
                title="Exit Presentation"
            >
                <X size={24} />
            </button>
        </div>
        
        {/* Progress Bar Top */}
        <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out z-50 shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}></div>
    </div>
  );
};

export default PresentationPage;
