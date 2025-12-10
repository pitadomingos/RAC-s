







import React, { useState } from 'react';
import { 
  CheckCircle, Download, Rocket, CreditCard, Upload, Sparkles, 
  Lock, Server, Mail, Users, Briefcase, Wrench, FileText, 
  Shield, UserCog, Monitor, Database, Key, Target, Calendar, Code, CheckSquare, Zap, AlertTriangle, HardHat, Wifi, Smartphone, CalendarClock
} from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const ProjectProposal: React.FC = () => {
  const { t, language } = useLanguage();

  // Safety check for translations
  if (!t || !t.proposal || !t.proposal.financials || !t.proposal.financials.items) {
    return <div className="p-8 text-center text-gray-500">Loading Proposal Data...</div>;
  }

  // Use items directly from translations
  const costItems = t.proposal.financials.items;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Force Portrait for Proposal */}
      <style>{`
        @media print {
          @page { size: portrait; margin: 15mm 10mm 15mm 10mm; }
          body { -webkit-print-color-adjust: exact; }
          .break-after-page { break-after: page; page-break-after: always; }
          /* Reduce margins/padding on print to fit A4 better */
          .print-compact { padding: 0 !important; margin: 0 !important; }
          .print-hide { display: none !important; }
          /* Ensure backgrounds print */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      
      {/* Action Bar - Hidden when printing */}
      <div className="flex justify-end mb-6 no-print bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-30">
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 italic">{t.common.print} / {t.common.save}</span>
            <button 
              type="button"
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm cursor-pointer"
            >
              <Download size={18} />
              <span>{t.common.print} / Save as PDF</span>
            </button>
        </div>
      </div>

      {/* Printable Content Container */}
      <div className="bg-white p-8 md:p-16 shadow-lg print:shadow-none print:p-0 print:m-0 text-slate-800">
        
        {/* === PAGE 1: COVER LETTER === */}
        <div className="mb-20 break-after-page print:break-after-page min-h-[90vh] print:min-h-0 flex flex-col justify-center">
           <div className="flex justify-between items-start mb-12 print:mb-8">
               <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">PITA DOMINGOS</h1>
                  <p className="text-yellow-600 font-bold uppercase tracking-widest text-sm">DigiSols</p>
               </div>
               <div className="text-right text-sm text-gray-500">
                  <p>{new Date().toLocaleDateString()}</p>
               </div>
           </div>

           <div className="mb-8 font-medium text-slate-800">
              <p>{t.proposal.letter.recipient}</p>
              <p>{t.proposal.letter.role}</p>
              <p>{t.proposal.letter.company}</p>
           </div>

           <div className="mb-8 font-bold underline text-slate-900">
              {t.proposal.letter.subject}
           </div>

           <div className="space-y-6 text-slate-700 leading-relaxed text-justify">
              <p>{t.proposal.letter.salutation}</p>
              <p>{t.proposal.letter.intro}</p>
              <p>{t.proposal.letter.body1}</p>
              <p>{t.proposal.letter.body2}</p>
              <p>{t.proposal.letter.closing}</p>
           </div>

           <div className="mt-12 text-slate-800">
              <p>{t.proposal.letter.signoff}</p>
              <p className="font-bold mt-2">{t.proposal.letter.team}</p>
              <div className="text-sm text-gray-500 mt-2">
                  <p className="font-semibold text-slate-700">PITA DOMINGOS</p>
                  <p>Perto de O Puarrou - Bairro Chingodzi, Tete</p>
                  <p>Email: pita.domingos@zd044.onmicrosoft.com</p>
                  <p>Cell: +258 845479481</p>
              </div>
           </div>
        </div>

        {/* === PAGE 2: SUMMARY & OBJECTIVES === */}
        <div className="print:break-after-page break-after-page">
            {/* Header */}
            <div className="border-b-4 border-slate-900 pb-8 mb-10 print:mb-6 flex flex-col md:flex-row justify-between items-start">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Shield size={32} className="text-yellow-500" />
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">PITA DOMINGOS</h1>
                </div>
                <h2 className="text-2xl text-slate-700 font-light">{t.proposal.title}</h2>
                <p className="text-sm text-yellow-600 font-bold mt-2 uppercase tracking-widest">{t.proposal.digitalTrans}</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
                <span className="bg-red-50 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full border border-red-200 uppercase tracking-wide print:border-red-500">
                Commercial in Confidence
                </span>
                <div className="text-sm text-gray-500 mt-3 font-mono">
                    <p>Ref: VUL-PROP-2025-V4</p>
                    <p>{t.common.date}: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            </div>

            {/* 1. Executive Summary */}
            <section className="mb-12 print:mb-8">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.execSummary.title}
                </h2>
                <p className="leading-relaxed text-gray-700 text-justify mb-4">
                {t.proposal.execSummary.text}
                </p>
                <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-400 italic text-slate-700 print:bg-gray-50">
                    {t.proposal.execSummary.quote}
                </div>
            </section>

            {/* 2. Project Objectives */}
            <section className="mb-12 print:mb-8">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.objectives.title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
                <div className="bg-red-50 p-6 print:p-4 rounded-xl border border-red-100 print:bg-white print:border-red-200 break-inside-avoid">
                    <div className="flex items-center gap-2 mb-3 text-red-700">
                        <Target size={20} />
                        <h3 className="font-bold uppercase">{t.proposal.objectives.problemTitle}</h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed text-justify">
                        {t.proposal.objectives.problemText}
                    </p>
                </div>

                <div className="bg-green-50 p-6 print:p-4 rounded-xl border border-green-100 print:bg-white print:border-green-200 break-inside-avoid">
                    <div className="flex items-center gap-2 mb-3 text-green-700">
                        <CheckCircle size={20} />
                        <h3 className="font-bold uppercase">{t.proposal.objectives.solutionTitle}</h3>
                    </div>
                    <ul className="space-y-3">
                        {t.proposal.objectives.goals.map((goal, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                <CheckSquare size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                {goal}
                            </li>
                        ))}
                    </ul>
                </div>
                </div>
            </section>
        </div>

        {/* === PAGE 3: ORGANOGRAM & ROLES === */}
        <div className="print:break-after-page break-after-page">
            {/* 3. Organogram */}
            <section className="mb-12 print:mb-8 break-inside-avoid">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-8 uppercase tracking-wide text-slate-900">
                    {t.proposal.organogram.title}
                </h2>
                
                <div className="flex flex-col items-center justify-center py-8 bg-white border border-slate-100 rounded-xl print:border-none print:py-4">
                    
                    {/* Level 1: PM */}
                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-48 bg-slate-900 text-white p-4 rounded-lg shadow-md flex flex-col items-center text-center print:border print:border-slate-900 print:text-slate-900 print:bg-white">
                            <Briefcase size={24} className="mb-2 text-yellow-400 print:text-slate-900" />
                            <span className="font-bold text-sm uppercase">{t.proposal.organogram.pm}</span>
                            <span className="text-xs text-slate-400 mt-1 print:text-slate-600">{t.proposal.organogram.delivery}</span>
                        </div>
                        {/* Vertical Line */}
                        <div className="h-12 w-0.5 bg-slate-300"></div>
                    </div>

                    {/* Connector Bar */}
                    <div className="w-[300px] h-6 border-t-2 border-l-2 border-r-2 border-slate-300 rounded-t-xl"></div>

                    {/* Level 2: Technicians */}
                    <div className="flex gap-16 -mt-1">
                        {/* Tech 1 */}
                        <div className="flex flex-col items-center">
                            <div className="h-4 w-0.5 bg-slate-300"></div>
                            <div className="w-40 bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                                <Wrench size={20} className="mb-2 text-blue-600" />
                                <span className="font-bold text-xs uppercase text-slate-800">{t.proposal.organogram.tech1}</span>
                                <span className="text-[10px] text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded">{t.proposal.organogram.regime}</span>
                                <span className="text-[10px] text-gray-500 mt-0.5">{t.proposal.organogram.days}</span>
                            </div>
                        </div>

                        {/* Tech 2 */}
                        <div className="flex flex-col items-center">
                            <div className="h-4 w-0.5 bg-slate-300"></div>
                            <div className="w-40 bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                                <Wrench size={20} className="mb-2 text-blue-600" />
                                <span className="font-bold text-xs uppercase text-slate-800">{t.proposal.organogram.tech2}</span>
                                <span className="text-[10px] text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded">{t.proposal.organogram.regime}</span>
                                <span className="text-[10px] text-gray-500 mt-0.5">{t.proposal.organogram.days}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organogram Role Descriptions (NEW) */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">{t.proposal.organogram.pm}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{t.proposal.organogram.pmRole}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">{t.proposal.organogram.tech1} / {t.proposal.organogram.tech2}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{t.proposal.organogram.techRole}</p>
                    </div>
                </div>
            </section>

            {/* 4. Roles */}
            <section className="mb-12 print:mb-8">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.roles.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        t.proposal.roles.sysAdmin,
                        t.proposal.roles.racAdmin,
                        t.proposal.roles.deptAdmin,
                        t.proposal.roles.racTrainer,
                        t.proposal.roles.user
                    ].map((r, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 print:bg-white print:border-gray-300 print:p-2 break-inside-avoid">
                            <div className="mt-1 bg-blue-100 p-1.5 rounded text-blue-700 print:bg-gray-200 print:text-black"><UserCog size={16}/></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{r.title}</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* === PAGE 4: TIMELINE & TECH STACK === */}
        <div className="print:break-after-page break-after-page">
            {/* 5. Project Timeline */}
            <section className="mb-12 print:mb-8">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.timeline.title}
                </h2>
                <p className="text-sm text-gray-600 mb-6">{t.proposal.timeline.intro}</p>
                
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-10 print:space-y-6 pb-4">
                {/* Phase 1 */}
                <div className="ml-6 relative break-inside-avoid">
                    <div className="absolute -left-[31px] top-0 bg-white border-2 border-slate-300 rounded-full p-1.5 z-10">
                        <Calendar size={14} className="text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">{t.proposal.timeline.phase1}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{t.proposal.timeline.phase1desc}</p>
                </div>
                
                {/* Phase 2 */}
                <div className="ml-6 relative break-inside-avoid">
                    <div className="absolute -left-[31px] top-0 bg-slate-900 border-2 border-slate-900 rounded-full p-1.5 z-10">
                        <Code size={14} className="text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-slate-800">{t.proposal.timeline.phase2}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{t.proposal.timeline.phase2desc}</p>
                </div>

                    {/* Phase 3 */}
                <div className="ml-6 relative break-inside-avoid">
                    <div className="absolute -left-[31px] top-0 bg-white border-2 border-slate-300 rounded-full p-1.5 z-10">
                        <CheckCircle size={14} className="text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">{t.proposal.timeline.phase3}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{t.proposal.timeline.phase3desc}</p>
                </div>

                    {/* Phase 4 */}
                <div className="ml-6 relative break-inside-avoid">
                    <div className="absolute -left-[31px] top-0 bg-white border-2 border-slate-300 rounded-full p-1.5 z-10">
                        <Rocket size={14} className="text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">{t.proposal.timeline.phase4}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{t.proposal.timeline.phase4desc}</p>
                </div>
                </div>
            </section>

            {/* 6. Tech Stack */}
            <section className="mb-12 print:mb-8 break-inside-avoid">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.techStack.title}
                </h2>
                <div className="bg-slate-900 text-gray-300 p-8 rounded-xl print:bg-white print:border print:border-gray-200 print:text-slate-800 print:p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4 text-sm">
                        <div className="flex gap-3">
                            <div className="mt-1 bg-blue-500/10 p-2 rounded text-blue-400 print:text-blue-600 print:bg-blue-50">
                                <Monitor size={20} /> 
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1 print:text-slate-900">{t.proposal.techStack.frontendTitle}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed print:text-gray-600">{t.proposal.techStack.frontend}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <div className="mt-1 bg-green-500/10 p-2 rounded text-green-400 print:text-green-600 print:bg-green-50">
                                <Server size={20} /> 
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1 print:text-slate-900">{t.proposal.techStack.backendTitle}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed print:text-gray-600">{t.proposal.techStack.backend}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="mt-1 bg-yellow-500/10 p-2 rounded text-yellow-400 print:text-yellow-600 print:bg-yellow-50">
                                <Database size={20} /> 
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1 print:text-slate-900">{t.proposal.techStack.databaseTitle}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed print:text-gray-600">{t.proposal.techStack.database}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="mt-1 bg-red-500/10 p-2 rounded text-red-400 print:text-red-600 print:bg-red-50">
                                <Lock size={20} /> 
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1 print:text-slate-900">{t.proposal.techStack.securityTitle}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed print:text-gray-600">{t.proposal.techStack.security}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* === PAGE 5: FINANCIALS & ROADMAP === */}
        <div className="print:break-after-page break-after-page">
            {/* 7. Financials */}
            <section className="mb-12 print:mb-8 break-inside-avoid">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.financials.title}
                </h2>
                <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-900">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">{t.proposal.financials.item}</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-white">{t.proposal.financials.type}</th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-white">{t.proposal.financials.cost}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                    {costItems.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-center text-slate-900">{item.type}</td>
                        <td className="px-6 py-4 text-sm text-right font-mono text-slate-900 font-bold">{item.cost}</td>
                        </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                        <td className="px-6 py-4 text-slate-900">{t.proposal.financials.total}</td>
                        <td className="px-6 py-4 text-center text-slate-500">-</td>
                        <td className="px-6 py-4 text-right text-slate-900 font-mono text-lg">$17,500.00</td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic text-right">* All prices exclude VAT.</p>
            </section>

            {/* 8. Roadmap */}
            <section className="mb-12 print:mb-8">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.roadmap.title}
                </h2>
                <p className="mb-6 text-gray-600">{t.proposal.roadmap.intro}</p>

                <div className="space-y-6">
                    <div className="flex gap-4 items-start break-inside-avoid">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg print:border print:border-gray-200">
                            <Key size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{t.proposal.roadmap.auth}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t.proposal.roadmap.authDesc}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start break-inside-avoid">
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg print:border print:border-gray-200">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{t.proposal.roadmap.db}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t.proposal.roadmap.dbDesc}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start break-inside-avoid">
                        <div className="p-2 bg-green-100 text-green-700 rounded-lg print:border print:border-gray-200">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{t.proposal.roadmap.email}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t.proposal.roadmap.emailDesc}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start break-inside-avoid">
                        <div className="p-2 bg-orange-100 text-orange-700 rounded-lg print:border print:border-gray-200">
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{t.proposal.roadmap.hosting}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t.proposal.roadmap.hostingDesc}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* === PAGE 6: AI FEATURES, UPDATES & CONCLUSION === */}
        <div className="print:break-after-page break-after-page">
            
            {/* 9. AI Features */}
            <section className="mb-12 print:mb-8 break-inside-avoid">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.aiFeatures.title}
                </h2>
                <p className="text-sm text-gray-600 mb-6">{t.proposal.aiFeatures.intro}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 print:bg-white print:border-gray-200">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700">
                            <Sparkles size={20} />
                            <h3 className="font-bold">{t.proposal.aiFeatures.advisor}</h3>
                        </div>
                        <p className="text-xs text-slate-700">{t.proposal.aiFeatures.advisorDesc}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 print:bg-white print:border-gray-200">
                        <div className="flex items-center gap-2 mb-2 text-blue-700">
                            <FileText size={20} />
                            <h3 className="font-bold">{t.proposal.aiFeatures.analysis}</h3>
                        </div>
                        <p className="text-xs text-slate-700">{t.proposal.aiFeatures.analysisDesc}</p>
                    </div>
                </div>
            </section>

             {/* 10. Future Updates (Alcohol Testing) */}
             <section className="mb-12 print:mb-8 break-inside-avoid">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.futureUpdates.title}
                </h2>
                
                {/* Dual Column Layout: Software vs Infra */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Software Scope */}
                    <div className="bg-white p-6 rounded-xl border-2 border-slate-100 print:border-gray-200">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                             <Zap size={24} />
                             <h3 className="font-bold">{t.proposal.futureUpdates.softwareScope.title}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-4 h-12">{t.proposal.futureUpdates.softwareScope.desc}</p>
                        
                        <ul className="space-y-2">
                             {[
                                t.proposal.futureUpdates.softwareScope.feat1,
                                t.proposal.futureUpdates.softwareScope.feat2,
                                t.proposal.futureUpdates.softwareScope.feat3
                             ].map((feat, i) => (
                                 <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-blue-50 p-2 rounded border border-blue-100">
                                    <Wifi size={14} className="text-blue-500 mt-0.5" />
                                    {feat}
                                 </li>
                             ))}
                        </ul>
                    </div>

                    {/* Infrastructure Scope */}
                    <div className="bg-white p-6 rounded-xl border-2 border-orange-100 print:border-gray-200">
                        <div className="flex items-center gap-2 mb-4 text-orange-600">
                             <HardHat size={24} />
                             <h3 className="font-bold">{t.proposal.futureUpdates.infraScope.title}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-4 h-12">{t.proposal.futureUpdates.infraScope.desc}</p>

                        <ul className="space-y-2">
                             {[
                                t.proposal.futureUpdates.infraScope.feat1,
                                t.proposal.futureUpdates.infraScope.feat2,
                                t.proposal.futureUpdates.infraScope.feat3
                             ].map((feat, i) => (
                                 <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-orange-50 p-2 rounded border border-orange-100">
                                    <AlertTriangle size={14} className="text-orange-500 mt-0.5" />
                                    {feat}
                                 </li>
                             ))}
                        </ul>
                    </div>
                </div>
            </section>

             {/* 11. Enhanced Capabilities */}
             <section className="mb-12 print:mb-8 break-inside-avoid">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.enhancedCaps.title}
                </h2>
                <p className="text-sm text-gray-600 mb-6">{t.proposal.enhancedCaps.intro}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mobile Verification */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none">
                         <div className="flex items-center gap-3 mb-4 text-purple-600">
                                <Smartphone size={24} />
                                <h3 className="font-bold text-slate-800">{t.proposal.enhancedCaps.mobileVerify.title}</h3>
                         </div>
                         <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                            {t.proposal.enhancedCaps.mobileVerify.desc}
                         </p>
                         <ul className="space-y-2">
                            {t.proposal.enhancedCaps.mobileVerify.features.map((feat: string, i: number) => (
                                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                                {feat}
                                </li>
                            ))}
                         </ul>
                    </div>

                    {/* Auto Booking */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none">
                         <div className="flex items-center gap-3 mb-4 text-blue-600">
                                <CalendarClock size={24} />
                                <h3 className="font-bold text-slate-800">{t.proposal.enhancedCaps.autoBooking.title}</h3>
                         </div>
                         <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                            {t.proposal.enhancedCaps.autoBooking.desc}
                         </p>
                         <ul className="space-y-2">
                            {t.proposal.enhancedCaps.autoBooking.features.map((feat: string, i: number) => (
                                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                                {feat}
                                </li>
                            ))}
                         </ul>
                    </div>
                </div>
            </section>

            {/* 12. Conclusion */}
            <section className="mb-12 print:mb-8 break-inside-avoid">
                 <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                    {t.proposal.conclusion.title}
                </h2>
                <div className="text-sm text-slate-700 leading-relaxed text-justify">
                    <p>{t.proposal.conclusion.text}</p>
                </div>
            </section>
        </div>

      </div>
    </div>
  );
};

export default ProjectProposal;
