
import React from 'react';
import { 
  Shield, CheckCircle, Target, User, Layers, 
  Calendar, Server, Database, Lock, Monitor,
  Mail, Phone, FileText, Download, DollarSign,
  ChevronRight, Globe, Zap, Smartphone, HardHat,
  Layout, Activity, Users, Box, Cloud, Rocket,
  MapPin, BrainCircuit, Wifi, Key, Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ProjectProposal: React.FC = () => {
  const { t } = useLanguage();

  if (!t || !t.proposal) return <div className="p-10 text-center">Loading Proposal...</div>;

  const handlePrint = () => {
    window.print();
  };

  // --- Financial Calculation Logic (Strict Grouping) ---
  const calculateTotals = () => {
      const items = t.proposal.financials.items;
      const getVal = (idx: number) => {
          if (!items[idx]) return 0;
          return parseFloat(items[idx].cost.replace(/[^0-9.]/g, '') || '0');
      };

      const initial = getVal(0) + getVal(1);   // $20k + $8k = $28,000
      const postUat = getVal(3);               // $10,000
      const monthly = getVal(2) + getVal(4);   // $5k + $15k = $20,000

      return { initial, postUat, monthly };
  };
  
  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 font-sans">
        
        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 print:hidden z-50">
            <button 
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 font-bold border border-blue-400"
            >
                <Download size={24} />
                <span className="hidden md:inline">Download PDF</span>
            </button>
        </div>

        <div className="max-w-5xl mx-auto print:max-w-none">
            
            {/* --- 0. COVER LETTER (A4 Page Break After) --- */}
            <div className="bg-white p-12 md:p-16 mb-8 rounded shadow-lg print:shadow-none print:mb-0 print:break-after-page min-h-[297mm] flex flex-col relative text-slate-800">
                {/* Letterhead Header */}
                <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-12">
                    <div className="flex items-center gap-4">
                        <img src="assets/digisol_logo.png" alt="DigiSol" className="h-12 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900">DIGISOLS</h1>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Innovation in Safety Systems</p>
                        </div>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                        <p>{t.proposal.letter.date}</p>
                    </div>
                </div>

                {/* Recipient */}
                <div className="mb-10 text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                    {t.proposal.letter.to}
                </div>

                {/* Subject */}
                <div className="mb-10">
                    <span className="font-bold text-slate-900 uppercase border-b-2 border-slate-300 pb-1">Subject: {t.proposal.letter.subject}</span>
                </div>

                {/* Body */}
                <div className="space-y-6 text-justify text-base leading-relaxed text-slate-700 flex-1">
                    <p>{t.proposal.letter.greeting}</p>
                    <p>{t.proposal.letter.body1}</p>
                    <p>{t.proposal.letter.body2}</p>
                    <p>{t.proposal.letter.body3}</p>
                    <p>{t.proposal.letter.closing}</p>
                </div>

                {/* Sign Off */}
                <div className="mt-16 mb-12">
                    <p className="whitespace-pre-line font-bold text-slate-900">{t.proposal.letter.signOff}</p>
                </div>

                {/* Footer Contact */}
                <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                        <MapPin size={14}/> {t.proposal.letter.address}
                    </div>
                    <div className="flex gap-6 mt-2 md:mt-0">
                        <span className="flex items-center gap-2"><Mail size={14}/> {t.proposal.thankYou.contact}</span>
                        <span className="flex items-center gap-2"><Phone size={14}/> {t.proposal.thankYou.phone}</span>
                    </div>
                </div>
            </div>

            {/* --- MAIN PROPOSAL DOCUMENT --- */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
                
                {/* --- 1. HERO COVER --- */}
                <div className="bg-slate-900 text-white p-16 relative overflow-hidden min-h-[600px] flex flex-col justify-center print:break-after-page">
                    <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                        <Shield size={600} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-16">
                            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10">
                                <Box size={32} className="text-blue-400" />
                                <span className="font-black text-2xl tracking-tighter">DIGISOLS</span>
                            </div>
                        </div>

                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm font-bold uppercase tracking-widest mb-6">
                            Digital Transformation Initiative
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
                            {t.common.vulcan} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                                Enterprise SaaS
                            </span>
                        </h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-slate-400 border-t border-white/10 pt-10 mt-16">
                            <div>
                                <p className="uppercase font-bold text-slate-500 mb-2 tracking-wider text-xs">Prepared For</p>
                                <p className="text-white text-xl font-bold">Vulcan Mining Operations</p>
                                <p className="text-slate-400">Tete, Mozambique</p>
                            </div>
                            <div className="md:text-right">
                                <p className="uppercase font-bold text-slate-500 mb-2 tracking-wider text-xs">Prepared By</p>
                                <p className="text-white text-xl font-bold">{t.proposal.aboutMe.name}</p>
                                <p className="text-blue-400">{t.proposal.thankYou.contact}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-12 md:p-16 space-y-20">
                    
                    {/* --- 2. EXECUTIVE SUMMARY --- */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {t.proposal.execSummary.title}
                            </h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-10 rounded-[2rem] border border-slate-100 dark:border-slate-700 relative">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-light text-justify">
                                {t.proposal.execSummary.text}
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-px bg-slate-300 dark:bg-slate-600 flex-1"></div>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">{t.proposal.execSummary.quote}</span>
                            </div>
                        </div>
                    </section>

                    {/* --- 3. OBJECTIVES --- */}
                    <section>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                                        <Target size={24} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{t.proposal.objectives.problemTitle}</h4>
                                </div>
                                <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 h-full">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                                        {t.proposal.objectives.problemText}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{t.proposal.objectives.solutionTitle}</h4>
                                </div>
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 h-full">
                                    <ul className="space-y-4">
                                        {t.proposal.objectives.goals.map((goal, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-lg">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>
                                                {goal}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- 4. FUTURE ROADMAP & AI (NEW SECTION) --- */}
                    <section className="break-inside-avoid">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <Rocket size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {t.proposal.roadmap.title} & Innovation
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Key size={18} className="text-blue-500"/> {t.proposal.roadmap.auth}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{t.proposal.roadmap.authDesc}</p>
                                
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 mt-6"><Cloud size={18} className="text-cyan-500"/> {t.proposal.roadmap.db}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{t.proposal.roadmap.dbDesc}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Mail size={18} className="text-pink-500"/> {t.proposal.roadmap.email}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{t.proposal.roadmap.emailDesc}</p>

                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 mt-6"><Smartphone size={18} className="text-green-500"/> {t.proposal.roadmap.hosting}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{t.proposal.roadmap.hostingDesc}</p>
                            </div>
                        </div>

                        {/* AI & Smart Features */}
                        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-10"><BrainCircuit size={200}/></div>
                            <h4 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                <Sparkles className="text-yellow-400"/> {t.proposal.aiFeatures.title}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <h5 className="font-bold text-indigo-300 mb-2">Safety Advisor Chatbot</h5>
                                    <p className="text-sm text-slate-300 leading-relaxed">{t.proposal.aiFeatures.chatbot.split(':')[1]}</p>
                                </div>
                                <div>
                                    <h5 className="font-bold text-indigo-300 mb-2">Automated Reporting</h5>
                                    <p className="text-sm text-slate-300 leading-relaxed">{t.proposal.aiFeatures.reporting.split(':')[1]}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- 5. ALCOHOL & IOT (NEW SECTION) --- */}
                    <section className="break-inside-avoid">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                                <Wifi size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {t.proposal.futureUpdates.title}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                                <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">Module A: Software Integration</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {t.proposal.futureUpdates.moduleA.split('-')[1]}
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Module B: Infrastructure (Separate Contract)</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {t.proposal.futureUpdates.moduleB.split('-')[1]}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* --- 6. TIMELINE --- */}
                    <section className="break-inside-avoid">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <Calendar size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {t.proposal.timeline.title}
                            </h3>
                        </div>
                        <div className="relative border-l-4 border-slate-200 dark:border-slate-700 ml-6 space-y-16">
                            {[
                                { title: t.proposal.timeline.phase1, desc: t.proposal.timeline.phase1desc, color: 'bg-blue-500', icon: Monitor },
                                { title: t.proposal.timeline.phase2, desc: t.proposal.timeline.phase2desc, color: 'bg-indigo-500', icon: Server },
                                { title: t.proposal.timeline.phase3, desc: t.proposal.timeline.phase3desc, color: 'bg-purple-500', icon: Shield },
                                { title: t.proposal.timeline.phase4, desc: t.proposal.timeline.phase4desc, color: 'bg-emerald-500', icon: Rocket },
                                { title: t.proposal.timeline.phase5, desc: t.proposal.timeline.phase5desc, color: 'bg-orange-500', icon: CheckCircle },
                            ].map((phase, i) => {
                                const Icon = phase.icon;
                                return (
                                    <div key={i} className="ml-12 relative group">
                                        <div className={`absolute -left-[66px] top-0 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-md ${phase.color} flex items-center justify-center text-white`}>
                                            <span className="font-bold text-sm">{i+1}</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                                                {phase.title}
                                            </h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-base">{phase.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* --- 7. FINANCIAL INVESTMENT --- */}
                    <section className="break-inside-avoid">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <DollarSign size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {t.proposal.financials.title}
                            </h3>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden mb-10">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-bold text-xs tracking-wider">
                                    <tr>
                                        <th className="px-10 py-6">Item Description</th>
                                        <th className="px-10 py-6">Type</th>
                                        <th className="px-10 py-6 text-right">Cost (USD)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {t.proposal.financials.items.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-10 py-6 font-bold text-base text-slate-800 dark:text-slate-200">
                                                {item.name}
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${item.type.includes('Month') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right font-mono font-bold text-lg text-slate-700 dark:text-slate-300">
                                                {item.cost}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAYMENT SCHEDULE SUMMARY */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Initial */}
                            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-10"><Layers size={100}/></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Phase 1</p>
                                    <h4 className="text-2xl font-bold mb-1">Initial Investment</h4>
                                    <p className="text-sm text-slate-400">Development Start (Items 1 & 2)</p>
                                </div>
                                <div className="text-5xl font-black font-mono mt-8 tracking-tighter">
                                    ${totals.initial.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            {/* Post UAT */}
                            <div className="bg-slate-800 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-10"><CheckCircle size={100}/></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-3">Phase 2</p>
                                    <h4 className="text-2xl font-bold mb-1">After UAT</h4>
                                    <p className="text-sm text-slate-400">Training & Handover (Item 4)</p>
                                </div>
                                <div className="text-5xl font-black font-mono mt-8 tracking-tighter">
                                    ${totals.postUat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            {/* Monthly */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-20"><Activity size={100}/></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">Recurring</p>
                                    <h4 className="text-2xl font-bold mb-1">Monthly Retainer</h4>
                                    <p className="text-sm text-blue-100">Cloud Ops & Support (Items 3 & 5)</p>
                                </div>
                                <div className="text-5xl font-black font-mono mt-8 tracking-tighter">
                                    ${totals.monthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- 8. FOOTER & CONTACT --- */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <img src="assets/digisol_logo.png" alt="DigiSol" className="h-8 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                <Box size={32} className="hidden" />
                            </div>
                            <div>
                                <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">DIGISOLS</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Innovation in Safety Systems</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 text-sm font-bold text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="p-2 bg-blue-100 dark:bg-slate-700 rounded-full text-blue-600"><Mail size={20}/></div> 
                                <span className="text-lg">{t.proposal.thankYou.contact}</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="p-2 bg-green-100 dark:bg-slate-700 rounded-full text-green-600"><Phone size={20}/></div> 
                                <span className="text-lg">{t.proposal.thankYou.phone}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectProposal;
