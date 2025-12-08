import React from 'react';
import { CheckCircle, FileText, ShieldCheck, Download } from 'lucide-react';

const ProjectProposal: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Action Bar - Hidden when printing */}
      <div className="flex justify-end mb-6 no-print">
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm"
        >
          <Download size={18} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Content Container */}
      <div 
        className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0"
      >
        
        {/* Prototype Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start gap-3 print:bg-green-50 print:border-green-200">
          <CheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-green-800 text-lg">Prototype Ready for Review</h3>
            <p className="text-green-700 text-sm">
              A fully functional high-fidelity prototype has already been developed to demonstrate the core capabilities of this system. 
              Stakeholders are invited to review the existing interface, booking logic, and card generation features immediately.
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
             <p className="text-sm text-gray-500 mt-2">Document ID: VUL-PROP-2024-04</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-800">
          
          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">1. Executive Summary</h2>
            <p className="leading-relaxed text-gray-700 mb-4">
              The Vulcan RAC Manager is a specialized web application designed to streamline the safety training lifecycle for Critical Activity Requisitions (RAC 01 - RAC 10). The system replaces manual spreadsheets and fragmented communication with a centralized digital platform that handles booking, results tracking, certification issuance (CARs), compliance monitoring, and **automated site access control**.
            </p>
            <p className="leading-relaxed text-gray-700 font-medium">
              <strong>Note:</strong> As mentioned above, a working prototype has been created to mitigate project risk and allow stakeholders to visualize the end-state solution prior to full investment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">2. Core Objectives</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li><strong>Digitalization:</strong> Eliminate paper-based booking and manual card issuance.</li>
              <li><strong>Compliance:</strong> Ensure 100% visibility of training validity and expiry.</li>
              <li><strong>Physical Security:</strong> Automatically deny gate access to non-compliant personnel.</li>
              <li><strong>Role-Based Security:</strong> Segregate duties between Admins, Trainers, and Departmental viewers.</li>
              <li><strong>Efficiency:</strong> Reduce administrative time for card generation by 90% via batch processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">3. Technical Architecture</h2>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 print:bg-gray-50">
              <p className="mb-4 text-gray-700">The application utilizes a modern, serverless cloud architecture to ensure scalability, security, and low maintenance.</p>
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-bold text-slate-900 border-b border-gray-300 pb-1 mb-2">Frontend Application</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                      <li>React.js (Component-based architecture)</li>
                      <li>Tailwind CSS (Responsive & Modern Styling)</li>
                      <li>Client-Side PDF Generation (No server delay)</li>
                      <li>Context API for Global State Management</li>
                      <li>Google Gemini AI Integration (Safety Advisor)</li>
                      <li>Recharts for Data Visualization</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900 border-b border-gray-300 pb-1 mb-2">Backend & Database</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                      <li>Cloud Platform (Scalable Infrastructure)</li>
                      <li>NoSQL Realtime Database (High performance)</li>
                      <li>Secure Authentication (Email/Password & SSO)</li>
                      <li>Role-Based Access Control (RBAC) Rules</li>
                      <li>Global CDN (Low latency access)</li>
                      <li>Serverless Cloud Functions (Automated logic)</li>
                    </ul>
                 </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">4. Project Timeline</h2>
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-2">
              
              <div className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white ring-2 ring-green-100 print:bg-green-500"></span>
                <h3 className="font-bold text-slate-900">Phase 1: Discovery & Prototype Review</h3>
                <p className="text-xs text-gray-500 font-mono mb-1">Weeks 1-2</p>
                <p className="text-sm text-gray-600">Requirement gathering, review of existing prototype, and finalization of database schema.</p>
              </div>

              <div className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 bg-slate-400 w-4 h-4 rounded-full border-2 border-white print:bg-slate-400"></span>
                <h3 className="font-bold text-slate-900">Phase 2: Core Development</h3>
                <p className="text-xs text-gray-500 font-mono mb-1">Weeks 3-6</p>
                <p className="text-sm text-gray-600">Implementation of advanced RBAC, Booking logic, and Trainer Input modules.</p>
              </div>

              <div className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 bg-slate-400 w-4 h-4 rounded-full border-2 border-white print:bg-slate-400"></span>
                <h3 className="font-bold text-slate-900">Phase 3: Advanced Features</h3>
                <p className="text-xs text-gray-500 font-mono mb-1">Weeks 7-8</p>
                <p className="text-sm text-gray-600">PDF Card Generation logic, Automated Email Notifications, and Reporting/KPIs.</p>
              </div>

              <div className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 bg-slate-400 w-4 h-4 rounded-full border-2 border-white print:bg-slate-400"></span>
                <h3 className="font-bold text-slate-900">Phase 4: UAT & Deployment</h3>
                <p className="text-xs text-gray-500 font-mono mb-1">Weeks 9-10</p>
                <p className="text-sm text-gray-600">User Acceptance Testing (UAT), bug fixes, and final deployment to production environment.</p>
              </div>

              <div className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 bg-slate-400 w-4 h-4 rounded-full border-2 border-white print:bg-slate-400"></span>
                <h3 className="font-bold text-slate-900">Phase 5: Training & Handover</h3>
                <p className="text-xs text-gray-500 font-mono mb-1">Week 11</p>
                <p className="text-sm text-gray-600">
                  Staff training sessions for all roles and distribution of User Manuals.
                </p>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">5. Project Costs</h2>
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 print:bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">1. Software Development</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Once off Payment</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">$12,500.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">2. Cloud Infrastructure</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Monthly</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">$2,000.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">3. Annual Maintenance</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Annually</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">$5,000.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">4. New Feature Request after Deployment</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">On-demand</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">$3,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">6. User Roles & Permissions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-gray-50">
                <h3 className="font-bold text-slate-900 mb-2">System Admin</h3>
                <p className="text-sm text-gray-600">Full system access, configuration, and project oversight.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-gray-50">
                <h3 className="font-bold text-slate-900 mb-2">RAC Admin</h3>
                <p className="text-sm text-gray-600">Schedule management, booking oversight, and compliance reporting.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-gray-50">
                <h3 className="font-bold text-slate-900 mb-2">RAC Trainer</h3>
                <p className="text-sm text-gray-600">Attendance marking, grading (Theory/Practical), and result submission.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-gray-50">
                <h3 className="font-bold text-slate-900 mb-2">Department Admin / User</h3>
                <p className="text-sm text-gray-600">Booking requests, viewing records, and requesting cards.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">7. Documentation & Training Deliverables</h2>
            <p className="text-gray-700 mb-4">
              To ensure smooth adoption, specific User Manuals will be created and delivered for each user role.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 transition">
                  <FileText className="text-blue-600 shrink-0" size={20} />
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">System Admin Guide</h4>
                     <p className="text-xs text-gray-500">Comprehensive guide on user management, system configuration, and data maintenance.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 transition">
                  <FileText className="text-blue-600 shrink-0" size={20} />
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">RAC Admin Operations Manual</h4>
                     <p className="text-xs text-gray-500">Guide for scheduling sessions, managing bookings, and generating compliance reports.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 transition">
                  <FileText className="text-blue-600 shrink-0" size={20} />
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">Trainer Handbook</h4>
                     <p className="text-xs text-gray-500">Step-by-step instructions for marking attendance and inputting assessment scores.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 transition">
                  <FileText className="text-blue-600 shrink-0" size={20} />
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">End User / Dept Admin Guide</h4>
                     <p className="text-xs text-gray-500">Simple visual guide for booking training sessions and requesting CARs cards.</p>
                  </div>
               </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3 mb-4 uppercase tracking-wide">8. Main Gate Access Integration</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg print:bg-blue-50">
               <div className="flex items-start gap-4">
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600 print:bg-white print:border print:border-blue-200">
                   <ShieldCheck size={32} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 text-lg mb-2">Automated Physical Access Control</h3>
                   <p className="text-gray-700 mb-4">
                     The web application will be directly interconnected with the site's <strong>Main Gate Access Control System</strong> to physically enforce safety compliance.
                   </p>
                   <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                     <li><strong>Real-time Sync:</strong> The gate system queries the "Access Status" from the Master Database instantly when a badge is scanned.</li>
                     <li><strong>Automated Blocking:</strong> If an employee's status is <span className="text-red-600 font-bold">BLOCKED</span> (due to expired ASO or missing required RACs), the turnstile/gate will automatically deny entry.</li>
                     <li><strong>Seamless Entry:</strong> Employees with <span className="text-green-600 font-bold">GRANTED</span> status experience no delay.</li>
                     <li><strong>Safety Assurance:</strong> Eliminates human error by physically preventing non-compliant personnel from entering hazardous operational areas.</li>
                   </ul>
                 </div>
               </div>
            </div>
          </section>

        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          &copy; 2024 Vulcan Safety Systems. Internal Document. Do not distribute.
        </div>
      </div>
    </div>
  );
};

export default ProjectProposal;