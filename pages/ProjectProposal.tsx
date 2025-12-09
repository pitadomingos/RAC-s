
import React, { useState } from 'react';
import { 
  CheckCircle, Download, Rocket, CreditCard, Upload, Sparkles, 
  Lock, Server, Mail, Users, Briefcase, Wrench, FileText, 
  Shield, UserCog, Monitor, Database, Key
} from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const ProjectProposal: React.FC = () => {
  const { t, language } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const costItems = t.proposal.financials.items.map(i => ({
      ...i,
      cost: '$0.00' // Base formatting
  }));
  
  // Set Costs
  costItems[0].cost = '$15,000.00';
  costItems[1].cost = '$2,500.00';
  costItems[2].cost = '$5,000.00';
  costItems[3].cost = '$3,500.00';
  costItems[4].cost = '$0.00';

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Action Bar - Hidden when printing */}
      <div className="flex justify-end mb-6 no-print bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-30">
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 italic">{t.common.print} / {t.common.save}</span>
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm"
            >
              <Download size={18} />
              <span>{t.common.print} / Save as PDF</span>
            </button>
        </div>
      </div>

      {/* Printable Content Container */}
      <div className="bg-white p-8 md:p-16 shadow-lg print:shadow-none print:p-0 print:m-0 text-slate-800">
        
        {/* Header */}
        <div className="border-b-4 border-slate-900 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <Shield size={32} className="text-yellow-500" />
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">VULCAN</h1>
            </div>
            <h2 className="text-2xl text-slate-700 font-light">{t.proposal.title}</h2>
            <p className="text-sm text-yellow-600 font-bold mt-2 uppercase tracking-widest">{t.proposal.digitalTrans}</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
             <span className="bg-red-50 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full border border-red-200 uppercase tracking-wide print:border-red-500">
               Commercial in Confidence
             </span>
             <div className="text-sm text-gray-500 mt-3 font-mono">
                <p>Ref: VUL-PROP-2024-V3</p>
                <p>{t.common.date}: {new Date().toLocaleDateString()}</p>
             </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="mb-12 break-inside-avoid">
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

        {/* 2. Organogram */}
        <section className="mb-12 break-inside-avoid">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-8 uppercase tracking-wide text-slate-900">
                {t.proposal.organogram.title}
            </h2>
            
            <div className="flex flex-col items-center justify-center py-8 bg-white border border-slate-100 rounded-xl print:border-none">
                
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
        </section>

        {/* 3. Roles */}
        <section className="mb-12 break-inside-avoid">
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
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 print:bg-white print:border-gray-300">
                        <div className="mt-1 bg-blue-100 p-1.5 rounded text-blue-700 print:bg-gray-200 print:text-black"><UserCog size={16}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{r.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 4. Financials */}
        <section className="mb-12 break-inside-avoid">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                {t.proposal.financials.title}
            </h2>
            <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-900 text-white print:bg-slate-200 print:text-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">{t.proposal.financials.item}</th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">{t.proposal.financials.type}</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">{t.proposal.financials.cost}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {costItems.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600">
                            <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                                {item.type}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">{item.cost}</td>
                      </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-slate-300">
                    <tr>
                        <td colSpan={2} className="px-6 py-4 text-sm font-bold text-slate-800 text-right">{t.proposal.financials.total}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">$17,500.00</td>
                    </tr>
                </tfoot>
              </table>
            </div>
        </section>

        {/* 5. Production Roadmap / TODO */}
        <section className="mb-12 break-inside-avoid">
             <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                {t.proposal.roadmap.title}
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden print:border-none">
                 <div className="bg-slate-50 p-4 border-b border-slate-200 text-sm text-slate-600 italic">
                    {t.proposal.roadmap.intro}
                 </div>
                 <div className="divide-y divide-slate-100">
                     
                     {/* Item 1 */}
                     <div className="flex items-start gap-4 p-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <Key size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{t.proposal.roadmap.auth}</h3>
                            <p className="text-sm text-slate-600 mt-1">{t.proposal.roadmap.authDesc}</p>
                        </div>
                     </div>

                     {/* Item 2 */}
                     <div className="flex items-start gap-4 p-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{t.proposal.roadmap.db}</h3>
                            <p className="text-sm text-slate-600 mt-1">{t.proposal.roadmap.dbDesc}</p>
                        </div>
                     </div>

                     {/* Item 3 */}
                     <div className="flex items-start gap-4 p-6">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{t.proposal.roadmap.email}</h3>
                            <p className="text-sm text-slate-600 mt-1">{t.proposal.roadmap.emailDesc}</p>
                        </div>
                     </div>

                     {/* Item 4 */}
                     <div className="flex items-start gap-4 p-6">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{t.proposal.roadmap.hosting}</h3>
                            <p className="text-sm text-slate-600 mt-1">{t.proposal.roadmap.hostingDesc}</p>
                        </div>
                     </div>

                 </div>
            </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-900 font-bold mb-2">Pita Domingos E.I</p>
            <p className="text-xs text-gray-500">
                Estrada Numero 7 Bairro Chingodzi, Tete • cell: +258 845479 • email: pita.domingos@zd044.onmicrosoft.com
            </p>
            <p className="text-[10px] text-gray-400 mt-4">
                Generated by Vulcan System V2.5
            </p>
        </div>

      </div>
    </div>
  );
};

export default ProjectProposal;
