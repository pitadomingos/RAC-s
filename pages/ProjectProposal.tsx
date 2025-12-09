
import React, { useRef } from 'react';
import { CheckCircle, ShieldCheck, Download, Sparkles, QrCode, CreditCard, Settings, Upload, Server, Lock, Mail, Rocket } from 'lucide-react';
import ReactToPrint from 'react-to-print';

const ProjectProposal: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Action Bar - Hidden when printing */}
      <div className="flex justify-end mb-6 no-print">
        <ReactToPrint
          trigger={() => (
            <button 
              className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm"
            >
              <Download size={18} />
              <span>Print / Save as PDF</span>
            </button>
          )}
          content={() => componentRef.current}
          documentTitle="Vulcan_Project_Proposal_Final"
          pageStyle="@page { size: auto; margin: 20mm; } body { -webkit-print-color-adjust: exact; }"
        />
      </div>

      {/* Printable Content Container */}
      <div 
        ref={componentRef}
        className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0"
      >
        
        {/* Prototype Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start gap-3 print:bg-green-50 print:border-green-200">
          <CheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-green-800 text-lg">Fully Operational Prototype V2.5</h3>
            <p className="text-green-700 text-sm">
              The application is now feature-complete for demonstration. It includes <strong>Mass CSV Import</strong>, <strong>Automated Compliance Logic (30-day/7-day rules)</strong>, <strong>Driver License Integration</strong>, and <strong>AI Reporting</strong>. Stakeholders can validate the full end-to-end workflow.
            </p>
          </div>
        </div>

        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Proposal</h1>
            <p className="text-xl text-yellow-600 font-medium">Critical Activity Requisitions (RAC) Management System</p>
          </div>
          <div className="text-right">
             <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200 uppercase tracking-wide print:bg-red-100 print:text-red-800">
               Confidential
             </span>
             <p className="text-sm text-gray-500 mt-2">Document ID: VUL-FINAL-2024 (Rev C)</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-800">
          
          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">1. Executive Summary</h2>
            <p className="leading-relaxed text-gray-700 mb-4">
              The Vulcan RAC Manager is a specialized web application designed to streamline the safety training lifecycle for Critical Activity Requisitions (RAC 01 - RAC 10). The system replaces manual spreadsheets with a centralized digital platform that handles booking, results tracking, and certification issuance. 
            </p>
            <p className="leading-relaxed text-gray-700">
              <strong>Current Status:</strong> The system acts as a "Smart Safety Engine," featuring <strong>auto-booking capabilities</strong> for expiring certificates, <strong>AI-driven safety insights</strong>, and strict <strong>Gate Access logic</strong> based on Driver License validity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">2. Core Objectives</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li><strong>Digitalization:</strong> Eliminate paper-based booking and manual card issuance.</li>
              <li><strong>Proactive Compliance:</strong> System automatically notifies and books employees 7 days before expiry.</li>
              <li><strong>Smart Access Control:</strong> "Soft-blocking" logic allows site access even if DL expires (via RAC 02 de-mapping), preventing operational bottlenecks.</li>
              <li><strong>Field Verification:</strong> Enable instant status checks via QR codes printed on CARs cards.</li>
              <li><strong>Data Integrity:</strong> Centralized database with CSV Mass Import for legacy record migration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">3. Technical Architecture</h2>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 print:bg-gray-50">
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-bold text-slate-900 border-b border-gray-300 pb-1 mb-2">Frontend & AI</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                      <li><strong>React 19:</strong> High-performance component architecture.</li>
                      <li><strong>Google Gemini AI:</strong> Integrated for 'Safety Advisor' and 'Report Analysis'.</li>
                      <li><strong>React-to-Print:</strong> Precision A4 landscape card layout (8 cards/page).</li>
                      <li><strong>QR Server API:</strong> Dynamic generation of verification links.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900 border-b border-gray-300 pb-1 mb-2">Backend & Logic</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                      <li><strong>Auto-Scheduler:</strong> Daily checks for 30-day warnings and 7-day auto-booking.</li>
                      <li><strong>Smart Validation:</strong> Specific logic for DL Class/Expiry verification.</li>
                      <li><strong>Role-Based Access:</strong> Granular permissions for Admins vs Trainers.</li>
                      <li><strong>CSV Parser:</strong> Bulk data ingestion engine.</li>
                    </ul>
                 </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">4. Feature Spotlight (Enhancements)</h2>
            <div className="grid md:grid-cols-2 gap-4">
               
               {/* Auto Compliance */}
               <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-slate-900">
                     <Rocket size={20} className="text-green-600" />
                     <h3 className="font-bold">Automated Compliance Engine</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                     <strong>30 Days:</strong> Warning emails sent. <br/>
                     <strong>7 Days:</strong> System <em>automatically</em> books the employee into the next available session to prevent certification lapse.
                  </p>
               </div>

               {/* RAC 02 Logic */}
               <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-slate-900">
                     <CreditCard size={20} className="text-yellow-600" />
                     <h3 className="font-bold">RAC 02 Smart Logic</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                     If a Driver License expires, the system automatically <strong>de-maps RAC 02</strong>. This allows the employee to pass the main gate (Access Granted) but invalidates their driving privileges.
                  </p>
               </div>

               {/* Mass Import */}
               <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-slate-900">
                     <Upload size={20} className="text-blue-600" />
                     <h3 className="font-bold">Mass Data Import</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                     Admins can upload historical CSV data to bulk-populate the system, ensuring seamless migration from legacy spreadsheets.
                  </p>
               </div>

               {/* AI Reporting */}
               <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-slate-900">
                     <Sparkles size={20} className="text-indigo-600" />
                     <h3 className="font-bold">AI Safety Analyst</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                     Integrated Gemini AI analyzes "No Show" reports and failure rates to generate executive summaries and strategic recommendations.
                  </p>
               </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">5. User Roles & Permissions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-gray-50">
                <h3 className="font-bold text-slate-900 mb-2">System Admin</h3>
                <p className="text-sm text-gray-600">Full access: Settings, Mass Import, User Management.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-gray-50">
                <h3 className="font-bold text-slate-900 mb-2">RAC Trainer</h3>
                <p className="text-sm text-gray-600">
                   Attendance, grading, and <strong className="text-slate-800">mandatory Driver License verification</strong> for RAC 02.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">6. Project Costs</h2>
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 print:bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">Initial Software Development Fee (Prototype & Logic)</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">$12,500.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">Cloud Infrastructure Setup (One-time)</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">$2,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* New Roadmap Section */}
          <section className="break-inside-avoid">
             <h2 className="text-xl font-bold border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wide text-blue-900">
                8. Production Roadmap (Post-Approval)
             </h2>
             <div className="bg-slate-900 text-slate-200 rounded-xl p-6 print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
                <p className="mb-4 font-medium border-b border-slate-700 pb-2 print:border-slate-300">
                   The following implementation steps will commence immediately after the <strong>Initial Software Development Fee</strong> has been paid in full:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                         <div className="flex items-start gap-3">
                             <div className="bg-blue-600 p-2 rounded text-white print:bg-slate-200 print:text-slate-800">
                                <Lock size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-white print:text-slate-900">1. Secure Authentication</h4>
                                <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                                    Implementation of a robust Login System (SSO or JWT) to replace current simulation mode. Securing API endpoints.
                                </p>
                             </div>
                         </div>
                         <div className="flex items-start gap-3">
                             <div className="bg-green-600 p-2 rounded text-white print:bg-slate-200 print:text-slate-800">
                                <Server size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-white print:text-slate-900">2. Production Database</h4>
                                <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                                    Migration from Mock Data to a persistent SQL/NoSQL cloud database (PostgreSQL or Firestore) with daily backups.
                                </p>
                             </div>
                         </div>
                    </div>
                    <div className="space-y-3">
                         <div className="flex items-start gap-3">
                             <div className="bg-yellow-600 p-2 rounded text-white print:bg-slate-200 print:text-slate-800">
                                <Mail size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-white print:text-slate-900">3. Live Notifications</h4>
                                <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                                    Integration with SMTP provider (e.g., SendGrid/AWS SES) to send real emails for 30-day warnings and booking confirmations.
                                </p>
                             </div>
                         </div>
                         <div className="flex items-start gap-3">
                             <div className="bg-purple-600 p-2 rounded text-white print:bg-slate-200 print:text-slate-800">
                                <Upload size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-white print:text-slate-900">4. Hosting & Deployment</h4>
                                <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                                    SSL Certificate installation, Domain configuration, and final production build deployment.
                                </p>
                             </div>
                         </div>
                    </div>
                </div>
             </div>
          </section>

        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          &copy; 2024 Vulcan Safety Systems. Commercial in Confidence.
        </div>
      </div>
    </div>
  );
};

export default ProjectProposal;
