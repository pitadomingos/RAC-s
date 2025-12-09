
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Monitor, Shield, Briefcase, Users, UserCog, 
  Settings, Database, Plus, Save, Upload, Download, 
  CheckCircle, AlertTriangle, Printer, Search, Bell
} from 'lucide-react';

const UserManualsPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);

  const roles = [
    { id: UserRole.SYSTEM_ADMIN, label: 'System Admin', icon: Monitor, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: UserRole.RAC_ADMIN, label: 'RAC Admin', icon: Shield, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: UserRole.RAC_TRAINER, label: 'RAC Trainer', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { id: UserRole.DEPT_ADMIN, label: 'Dept. Admin', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: UserRole.USER, label: 'Employee / User', icon: UserCog, color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
           <h2 className="text-lg font-bold text-slate-800">Operational Manuals</h2>
           <p className="text-xs text-gray-500 mt-1">Select a role to view instructions.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {roles.map((role) => {
             const Icon = role.icon;
             const isActive = activeRole === role.id;
             return (
               <button
                 key={role.id}
                 onClick={() => setActiveRole(role.id)}
                 className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-gray-500 hover:bg-gray-100 hover:text-slate-700'}
                 `}
               >
                 <div className={`p-1.5 rounded-md ${role.bg} ${role.color}`}>
                    <Icon size={16} />
                 </div>
                 <span>{role.label}</span>
               </button>
             );
           })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 bg-white scroll-smooth">
         
         {/* System Admin Manual */}
         {activeRole === UserRole.SYSTEM_ADMIN && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title="System Administrator Manual" icon={Monitor} color="blue" />
               
               <Section title="1. System Configuration">
                  <p>Navigate to the <span className="font-bold text-slate-800">System Settings</span> page to configure core parameters.</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text="Manage Rooms: Click the 'General' tab to Add or Edit room capacities." 
                        visual={<div className="btn-mock"><Plus size={12}/> New Room</div>}
                     />
                     <Step 
                        num="2" 
                        text="Authorize Trainers: Go to 'Trainers' tab. Add new trainers and assign their qualified RACs." 
                        visual={<div className="badge-mock">RAC01, RAC05</div>} 
                     />
                     <Step 
                        num="3" 
                        text="Save Changes: Ensure you click 'Save All Configurations' to persist changes to the database." 
                        visual={<div className="btn-primary-mock"><Save size={12}/> Save All</div>}
                     />
                  </ul>
               </Section>

               <Section title="2. Mass Data Import">
                  <p>Use the <span className="font-bold text-slate-800">Database</span> page to bulk upload historical records.</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text="Download Template: Click the template button to get the correct CSV format." 
                        visual={<div className="btn-mock">Template</div>}
                     />
                     <Step 
                        num="2" 
                        text="Prepare Data: Fill the CSV. For RAC 02, ensure DL Number and Class are included." 
                     />
                     <Step 
                        num="3" 
                        text="Upload: Click 'Import Data' and select your file." 
                        visual={<div className="btn-blue-mock"><Upload size={12}/> Import Data</div>}
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* RAC Admin Manual */}
         {activeRole === UserRole.RAC_ADMIN && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title="RAC Administrator Manual" icon={Shield} color="yellow" />
               
               <Section title="1. Scheduling Training">
                  <p>Plan upcoming sessions via the <span className="font-bold text-slate-800">Schedule Trainings</span> page.</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text="Create Session: Click 'New Session' button." 
                        visual={<div className="btn-black-mock"><Plus size={12}/> New Session</div>}
                     />
                     <Step 
                        num="2" 
                        text="Define Parameters: Select RAC Type, Date, Time, and Room. The system checks capacity." 
                     />
                  </ul>
               </Section>

               <Section title="2. Monitoring Compliance">
                  <p>Use the <span className="font-bold text-slate-800">Dashboard</span> to track expiry risks.</p>
                  <AlertBox type="warning">
                      <strong>Automatic Actions:</strong> The system sends warning emails at 30 days and auto-books training at 7 days remaining.
                  </AlertBox>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text="Review Expiring: Check the 'Expiring (30 Days)' card." 
                        visual={<div className="flex gap-2"><Bell size={14}/> Action Required</div>}
                     />
                     <Step 
                        num="2" 
                        text="Manual Renewal: Click 'Book Renewals' to auto-fill the booking form with at-risk employees." 
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* RAC Trainer Manual */}
         {activeRole === UserRole.RAC_TRAINER && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title="RAC Trainer Manual" icon={Briefcase} color="green" />
               
               <Section title="1. Grading & Verification">
                  <p>Access the <span className="font-bold text-slate-800">Trainer Input</span> portal to manage live sessions.</p>
                  <AlertBox type="error">
                      <strong>CRITICAL:</strong> For RAC 02, you MUST physically inspect the Driver License.
                  </AlertBox>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text="Select Session: Choose your active class from the dropdown." 
                     />
                     <Step 
                        num="2" 
                        text="Mark Attendance: Check the box for present employees." 
                        visual={<div className="checkbox-mock checked" />}
                     />
                     <Step 
                        num="3" 
                        text="RAC 02 DL Check: Verify License Validtity and check the 'Verified' box. If unchecked, the user Fails." 
                        visual={<div className="checkbox-red-mock checked" />}
                     />
                     <Step 
                        num="4" 
                        text="Enter Scores: Input Theory (and Practical) scores. Pass mark is 70%." 
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* Dept Admin Manual */}
         {activeRole === UserRole.DEPT_ADMIN && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title="Departmental Admin Manual" icon={Users} color="purple" />
               
               <Section title="1. Generating Cards">
                  <p>Go to <span className="font-bold text-slate-800">Request CARs Cards</span>.</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text="Select Employees: Click cards to select them (Green Checkmark appears)." 
                        visual={<CheckCircle size={16} className="text-green-500" />}
                     />
                     <Step 
                        num="2" 
                        text="Generate PDF: Click 'Request Cards' to trigger email delivery or 'Go to Print View' for immediate printing." 
                        visual={<div className="btn-black-mock"><Printer size={12}/> Print View</div>}
                     />
                  </ul>
               </Section>

               <Section title="2. Reports">
                  <p>Use <span className="font-bold text-slate-800">Reports & Analytics</span> to monitor your team.</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text="Filter Data: Select your Department from the dropdown." 
                     />
                     <Step 
                        num="2" 
                        text="Check Absences: Review the 'No Show' table on the right." 
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* User Manual */}
         {activeRole === UserRole.USER && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title="Employee User Manual" icon={UserCog} color="gray" />
               
               <Section title="1. Dashboard Overview">
                  <p>Your <span className="font-bold text-slate-800">Dashboard</span> shows your live compliance status.</p>
                  <div className="flex gap-4 my-4">
                     <div className="badge-green-mock">Compliant (Green)</div>
                     <span className="text-sm text-gray-500">You are safe to work.</span>
                  </div>
                  <div className="flex gap-4 mb-4">
                     <div className="badge-red-mock">Non-Compliant (Red)</div>
                     <span className="text-sm text-gray-500">Contact your supervisor immediately.</span>
                  </div>
               </Section>

               <Section title="2. Digital Card">
                  <p>Your physical card contains a QR Code. Security can scan this to verify your training in real-time.</p>
               </Section>
            </div>
         )}

      </div>
    </div>
  );
};

// --- Helper Components for Styling ---

const Header = ({ title, icon: Icon, color }: any) => (
   <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
      <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
         <Icon size={24} />
      </div>
      <h1 className="text-2xl font-black text-slate-900">{title}</h1>
   </div>
);

const Section = ({ title, children }: any) => (
   <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
      <div className="text-sm text-slate-600 leading-relaxed space-y-3">
         {children}
      </div>
   </div>
);

const Step = ({ num, text, visual }: any) => (
   <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mt-0.5">
         {num}
      </div>
      <div className="flex-1">
         <p className="text-sm text-slate-700">{text}</p>
         {visual && <div className="mt-2">{visual}</div>}
      </div>
   </li>
);

const AlertBox = ({ type, children }: any) => {
   const styles = type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800';
   const Icon = type === 'error' ? AlertTriangle : Bell;
   return (
      <div className={`p-4 rounded-lg border flex gap-3 text-sm my-4 ${styles}`}>
         <Icon size={18} className="flex-shrink-0 mt-0.5" />
         <div>{children}</div>
      </div>
   );
};

export default UserManualsPage;
