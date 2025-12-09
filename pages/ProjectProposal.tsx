
import React, { useState } from 'react';
import { 
  CheckCircle, Download, Rocket, CreditCard, Upload, Sparkles, 
  Lock, Server, Mail, Users, Briefcase, Wrench, FileText, 
  Shield, UserCog, Monitor
} from 'lucide-react';
import { UserRole } from '../types';

const ProjectProposal: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const costItems = [
    { item: 'Software Development', type: 'Once-off', cost: '$15,000.00' },
    { item: 'Cloud Infrastructure Setup', type: 'Once-off', cost: '$2,500.00' },
    { item: 'Cloud Tier Subscription', type: 'Monthly', cost: '$5,000.00' },
    { item: 'New Features after Deployment', type: 'On-demand', cost: '$3,500.00' },
    { item: 'Seasonal updates', type: 'Seasonal', cost: '$0.00' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Action Bar - Hidden when printing */}
      <div className="flex justify-end mb-6 no-print bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-30">
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 italic">To download as PDF, click Print and select "Save as PDF" as the destination.</span>
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm"
            >
              <Download size={18} />
              <span>Print / Save as PDF</span>
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
            <h2 className="text-2xl text-slate-700 font-light">Critical Activity Requisitions (RAC) Management System</h2>
            <p className="text-sm text-yellow-600 font-bold mt-2 uppercase tracking-widest">Digital Transformation Proposal</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
             <span className="bg-red-50 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full border border-red-200 uppercase tracking-wide print:border-red-500">
               Commercial in Confidence
             </span>
             <div className="text-sm text-gray-500 mt-3 font-mono">
                <p>Ref: VUL-PROP-2024-V3</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
             </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="mb-12 break-inside-avoid">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                1. Executive Summary
            </h2>
            <p className="leading-relaxed text-gray-700 text-justify mb-4">
              The Vulcan RAC Manager is a specialized enterprise application designed to streamline the safety training lifecycle for Critical Activity Requisitions (RAC 01 - RAC 10). By migrating from manual spreadsheets to a centralized digital platform, Vulcan Mining aims to eliminate compliance gaps, automate expiry management, and enforce strict access control protocols.
            </p>
            <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-400 italic text-slate-700 print:bg-gray-50">
                "A smart safety engine that not only tracks training but actively manages compliance through automated booking intervention and intelligent gate access logic."
            </div>
        </section>

        {/* 2. Organogram */}
        <section className="mb-12 break-inside-avoid">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-8 uppercase tracking-wide text-slate-900">
                2. Project Team Structure (Organogram)
            </h2>
            
            <div className="flex flex-col items-center justify-center py-8 bg-white border border-slate-100 rounded-xl print:border-none">
                
                {/* Level 1: PM */}
                <div className="flex flex-col items-center relative z-10">
                    <div className="w-48 bg-slate-900 text-white p-4 rounded-lg shadow-md flex flex-col items-center text-center print:border print:border-slate-900 print:text-slate-900 print:bg-white">
                        <Briefcase size={24} className="mb-2 text-yellow-400 print:text-slate-900" />
                        <span className="font-bold text-sm uppercase">Project Manager</span>
                        <span className="text-xs text-slate-400 mt-1 print:text-slate-600">Overall Delivery</span>
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
                            <span className="font-bold text-xs uppercase text-slate-800">Site Technician 1</span>
                            <span className="text-[10px] text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded">ADM Regime</span>
                            <span className="text-[10px] text-gray-500 mt-0.5">5 Days / Week</span>
                        </div>
                    </div>

                    {/* Tech 2 */}
                    <div className="flex flex-col items-center">
                         <div className="h-4 w-0.5 bg-slate-300"></div>
                         <div className="w-40 bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm flex flex-col items-center text-center">
                            <Wrench size={20} className="mb-2 text-blue-600" />
                            <span className="font-bold text-xs uppercase text-slate-800">Site Technician 2</span>
                            <span className="text-[10px] text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded">ADM Regime</span>
                            <span className="text-[10px] text-gray-500 mt-0.5">5 Days / Week</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 3. Roles */}
        <section className="mb-12 break-inside-avoid">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                3. User Roles & Access Control
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { role: 'System Admin', desc: 'Full system control, configuration, user management, and mass data operations.' },
                    { role: 'RAC Admin', desc: 'Manages training schedules, defines RAC parameters, and oversees operational compliance.' },
                    { role: 'Departmental Admin', desc: 'View-only access to reports and card requests for their specific department.' },
                    { role: 'RAC Trainer', desc: 'Conducts sessions, grades employees, verifies Driver Licenses, and records attendance.' },
                    { role: 'User (Employee)', desc: 'Personal dashboard access to view training status and request own digital cards.' }
                ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 print:bg-white print:border-gray-300">
                        <div className="mt-1 bg-blue-100 p-1.5 rounded text-blue-700 print:bg-gray-200 print:text-black"><UserCog size={16}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{r.role}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 4. Financials */}
        <section className="mb-12 break-inside-avoid">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6 uppercase tracking-wide text-slate-900">
                4. Financial Proposal
            </h2>
            <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-900 text-white print:bg-slate-200 print:text-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {costItems.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.item}</td>
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
                        <td colSpan={2} className="px-6 py-4 text-sm font-bold text-slate-800 text-right">Total Initial Investment (Items 1 + 2)</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">$17,500.00</td>
                    </tr>
                </tfoot>
              </table>
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
