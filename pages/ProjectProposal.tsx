
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Printer, Shield, Layers, Calendar, DollarSign, Users, BookOpen, 
  ChevronRight, Database, Code, Server, Lock, Cpu, Wine, Zap,
  CheckCircle2, AlertTriangle, Smartphone, Map, Briefcase
} from 'lucide-react';

const ProjectProposal: React.FC = () => {
  const { t } = useLanguage();

  const handlePrint = () => {
      window.print();
  };

  if (!t.proposal.foreword) return <div>Loading...</div>;

  return (
    <div className="max-w-[210mm] mx-auto pb-24 bg-gray-50 min-h-screen font-sans">
        
        {/* Floating Print Button */}
        <div className="fixed bottom-8 right-8 z-50 no-print">
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:bg-slate-800 transition-all transform hover:scale-105"
            >
                <Printer size={20} /> Print Document
            </button>
        </div>

        {/* --- PAGE 1: COVER PAGE (Dark Mode) --- */}
        <div className="bg-slate-900 h-[297mm] relative flex flex-col justify-between p-16 text-white overflow-hidden shadow-xl print:shadow-none mb-8 print:mb-0 print:break-after-page">
            
            {/* Top Branding */}
            <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter mb-2 text-white">
                    Pita Domingos
                </h1>
                <p className="text-sm font-medium text-slate-400 tracking-widest mb-1 italic">
                    Powering the next orbit of your digital evolution.
                </p>
            </div>

            {/* Central Graphic Element */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-0 bg-slate-800 rounded-full opacity-50 blur-3xl scale-75"></div>
                 {/* Replaced generic Shield with actual Logo */}
                 <img 
                    src="assets/DigiSol_Logo.png" 
                    alt="DigiSol Orbit" 
                    className="w-72 h-auto object-contain relative z-10 animate-float drop-shadow-2xl" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 <div className="mt-12 text-center relative z-10">
                     <h3 className="text-4xl font-bold text-white mb-2">{t.proposal.title}</h3>
                     <p className="text-xl text-slate-400 font-light uppercase tracking-widest">{t.proposal.subtitle}</p>
                 </div>
            </div>

            {/* Footer Details */}
            <div className="border-t-4 border-slate-700 pt-8">
                <div className="flex justify-between items-end">
                    <div className="text-sm font-medium space-y-1 text-slate-400">
                        <p>{t.proposal.header.ref}</p>
                        <p>{t.proposal.header.date}</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-yellow-500 text-white px-4 py-1 font-bold text-xs uppercase rounded-sm mb-2">
                            Commercial In Confidence
                        </div>
                        <p className="text-xs text-slate-500">DigiSol Orbit • Tete, Mozambique</p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- PAGE 2: LETTER & EXECUTIVE SUMMARY --- */}
        <div className="bg-white h-auto min-h-[297mm] p-16 relative shadow-xl print:shadow-none mb-8 print:mb-0 text-slate-800 print:break-before-page">
            
            {/* Letter Header */}
            <div className="mb-12 font-mono text-sm text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">To: The Management Team</p>
                <p>Vulcan Mining Operations</p>
                <p>Tete, Mozambique</p>
                <br/>
                <p className="font-bold underline">{t.proposal.header.subject}</p>
                <p className="mt-4">Dear Management Team,</p>
            </div>

            {/* Section 1 */}
            <div className="border-l-4 border-yellow-500 pl-6 mb-12">
                <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-wide">{t.proposal.foreword.title}</h2>
                <p className="text-justify leading-relaxed text-slate-600 mb-6">
                    {t.proposal.foreword.intro}
                </p>
                <h4 className="font-bold text-slate-800 mb-2">{t.proposal.foreword.overviewTitle}</h4>
                <p className="text-justify leading-relaxed text-slate-600 mb-6">
                    {t.proposal.foreword.overviewText}
                </p>
                <div className="bg-slate-50 p-6 rounded-lg italic text-slate-500 border border-slate-100">
                    "Safety is not just a priority, it is a core value. Our digital tools must reflect the same standard of excellence as our operational machinery."
                </div>
            </div>

            {/* Section 2 */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.objectives.title}
                </h2>
                
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 mb-6">
                    <h4 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                        <AlertTriangle size={18}/> Current Problem
                    </h4>
                    <p className="text-red-700 text-sm leading-relaxed">
                        {t.proposal.objectives.problem}
                    </p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-800 flex items-center gap-2 mb-4">
                        <CheckCircle2 size={18}/> Our Solution
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {t.proposal.objectives.items.map((item: any, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-green-900">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                                <span><strong>{item.title}</strong>: {item.desc}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* --- PAGE 3: ORGANOGRAM & ROLES --- */}
        <div className="bg-white h-auto min-h-[297mm] p-16 relative shadow-xl print:shadow-none mb-8 print:mb-0 text-slate-800 print:break-before-page">
            
            {/* Section 3 */}
            <div className="mb-16">
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.organogram.title}
                </h2>
                
                <div className="flex flex-col items-center gap-8">
                    <div className="p-4 border-2 border-slate-900 rounded-lg text-center w-64 shadow-md bg-white relative z-10">
                        <Briefcase size={24} className="mx-auto mb-2 text-slate-700" />
                        <div className="font-black uppercase text-sm">{t.proposal.organogram.pm}</div>
                        <div className="text-xs text-slate-500">Delivery Lead</div>
                    </div>
                    
                    <div className="h-8 w-px bg-slate-300 -mt-8"></div>
                    <div className="w-96 h-px bg-slate-300"></div>
                    
                    <div className="flex justify-between w-full max-w-2xl">
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-px bg-slate-300"></div>
                            <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg text-center w-48 mt-0 shadow-sm">
                                <div className="font-bold text-sm text-slate-700">Technician 1</div>
                                <div className="text-xs text-slate-500">Local Regime (20/10)</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-px bg-slate-300"></div>
                            <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg text-center w-48 mt-0 shadow-sm">
                                <div className="font-bold text-sm text-slate-700">Technician 2</div>
                                <div className="text-xs text-slate-500">Local Regime (20/10)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4 */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.roles.title}
                </h2>
                <div className="grid gap-4">
                    {t.proposal.roles.items.map((role: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 border-b border-slate-100 items-start">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{role.role}</h4>
                                <p className="text-sm text-slate-500">{role.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- PAGE 4: TIMELINE & TECH --- */}
        <div className="bg-white h-auto min-h-[297mm] p-16 relative shadow-xl print:shadow-none mb-8 print:mb-0 text-slate-800 print:break-before-page">
            
            {/* Section 5 */}
            <div className="mb-16">
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.timeline.title}
                </h2>
                <p className="text-slate-500 mb-6">{t.proposal.timeline.subtitle}</p>
                
                <div className="space-y-6 relative border-l-2 border-slate-200 ml-3 pl-8 py-2">
                    {t.proposal.timeline.phases.map((phase: any, idx: number) => (
                        <div key={idx} className="relative">
                            <div className="absolute -left-[41px] top-0 bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-4 border-white">
                                {idx + 1}
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg">{phase.title}</h4>
                            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">{phase.weeks}</span>
                            <p className="text-sm text-slate-600 mt-2">{phase.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 6 */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.techStack.title}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {t.proposal.techStack.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h4>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- PAGE 5: FINANCIALS & ROADMAP --- */}
        <div className="bg-white h-auto min-h-[297mm] p-16 relative shadow-xl print:shadow-none mb-8 print:mb-0 text-slate-800 print:break-before-page">
            
            {/* Section 7 */}
            <div className="mb-16">
                <div className="flex justify-between items-center mb-8 border-l-4 border-yellow-500 pl-6">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">
                        {t.proposal.costs.title}
                    </h2>
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">
                        {t.proposal.costs.subtitle}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">Item Description</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-right">Cost (USD)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {t.proposal.costs.items.map((item: any, idx: number) => (
                                <tr key={idx} className={item.cost === "$0.00" ? "text-slate-400 italic" : "text-slate-700"}>
                                    <td className="p-4 font-bold">{item.item}</td>
                                    <td className="p-4 text-xs">{item.type}</td>
                                    <td className="p-4 text-right font-mono">{item.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-right">* All prices exclude VAT.</p>
            </div>

            {/* Section 8 */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.roadmap.title}
                </h2>
                <div className="grid grid-cols-2 gap-6">
                    {t.proposal.roadmap.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 h-fit">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- PAGE 6: AI, ALCOHOL & CONCLUSION --- */}
        <div className="bg-white h-auto min-h-[297mm] p-16 relative shadow-xl print:shadow-none mb-8 print:mb-0 text-slate-800 print:break-before-page">
            
            {/* Section 9 */}
            <div className="mb-10">
                <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.ai.title}
                </h2>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                    <p className="text-sm text-slate-600 mb-4">Leveraging Google Gemini AI for safety intelligence.</p>
                    <div className="space-y-4">
                        {t.proposal.ai.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-3">
                                <Cpu size={18} className="text-purple-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-slate-800 text-sm">{item.title}:</span>
                                    <span className="text-slate-600 text-sm ml-1">{item.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
                <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.alcohol.title}
                </h2>
                <div className="space-y-4">
                    {t.proposal.alcohol.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-xl flex gap-4">
                            <Wine className="text-slate-400" size={24} />
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 11 - Enhanced Caps */}
            <div className="mb-12">
                <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide border-l-4 border-yellow-500 pl-6">
                    {t.proposal.enhanced.title}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {t.proposal.enhanced.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm">
                            <strong className="block text-slate-900">{item.title}</strong>
                            <span className="text-slate-500">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conclusion */}
            <div className="border-t-2 border-slate-100 pt-8">
                <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-wide">
                    {t.proposal.conclusion.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                    {t.proposal.conclusion.text}
                </p>
                <div className="mt-8 flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div>
                        <p className="font-bold text-slate-900">Sincerely,</p>
                        <p className="text-slate-600">DigiSol Orbit Team</p>
                        <div className="mt-4 font-mono text-sm text-slate-500">
                            <p>{t.proposal.thankYou.company}</p>
                            <p className="font-bold">{t.proposal.thankYou.contact}</p>
                            <p>{t.proposal.thankYou.phone}</p>
                        </div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                        <p>Address:</p>
                        <p>{t.proposal.thankYou.address}</p>
                    </div>
                </div>
            </div>

        </div>

    </div>
  );
};

export default ProjectProposal;
