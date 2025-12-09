
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Monitor, Shield, Briefcase, Users, UserCog, 
  Settings, Database, Plus, Save, Upload, Download, 
  CheckCircle, AlertTriangle, Printer, Search, Bell
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const UserManualsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.SYSTEM_ADMIN);

  const roles = [
    { id: UserRole.SYSTEM_ADMIN, label: t.proposal.roles.sysAdmin.title, icon: Monitor, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: UserRole.RAC_ADMIN, label: t.proposal.roles.racAdmin.title, icon: Shield, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: UserRole.RAC_TRAINER, label: t.proposal.roles.racTrainer.title, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { id: UserRole.DEPT_ADMIN, label: t.proposal.roles.deptAdmin.title, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: UserRole.USER, label: t.proposal.roles.user.title, icon: UserCog, color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
           <h2 className="text-lg font-bold text-slate-800">{t.manuals.title}</h2>
           <p className="text-xs text-gray-500 mt-1">{t.manuals.subtitle}</p>
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
               <Header title={t.manuals.sysAdmin.title} icon={Monitor} color="blue" />
               
               <Section title={t.manuals.sysAdmin.sec1}>
                  <p>{t.manuals.sysAdmin.sec1text}</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text={t.manuals.sysAdmin.step1} 
                        visual={<div className="btn-mock"><Plus size={12}/> {t.settings.rooms.new}</div>}
                     />
                     <Step 
                        num="2" 
                        text={t.manuals.sysAdmin.step2} 
                        visual={<div className="badge-mock">RAC01, RAC05</div>} 
                     />
                     <Step 
                        num="3" 
                        text={t.manuals.sysAdmin.step3} 
                        visual={<div className="btn-primary-mock"><Save size={12}/> {t.settings.saveAll}</div>}
                     />
                  </ul>
               </Section>

               <Section title={t.manuals.sysAdmin.sec2}>
                  <p>{t.manuals.sysAdmin.sec2text}</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text={t.manuals.sysAdmin.step4} 
                        visual={<div className="btn-mock">{t.common.template}</div>}
                     />
                     <Step 
                        num="2" 
                        text={t.manuals.sysAdmin.step5} 
                     />
                     <Step 
                        num="3" 
                        text={t.manuals.sysAdmin.step6} 
                        visual={<div className="btn-blue-mock"><Upload size={12}/> {t.common.import}</div>}
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* RAC Admin Manual */}
         {activeRole === UserRole.RAC_ADMIN && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title={t.manuals.racAdmin.title} icon={Shield} color="yellow" />
               
               <Section title={t.manuals.racAdmin.sec1}>
                  <p>{t.manuals.racAdmin.sec1text}</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text={t.manuals.racAdmin.step1} 
                        visual={<div className="btn-black-mock"><Plus size={12}/> {t.schedule.newSession}</div>}
                     />
                     <Step 
                        num="2" 
                        text={t.manuals.racAdmin.step2} 
                     />
                  </ul>
               </Section>

               <Section title={t.manuals.racAdmin.sec2}>
                  <p>{t.manuals.racAdmin.sec2text}</p>
                  <AlertBox type="warning">
                      <strong>{t.manuals.racAdmin.alert}</strong>
                  </AlertBox>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text={t.manuals.racAdmin.step3} 
                        visual={<div className="flex gap-2"><Bell size={14}/> {t.dashboard.renewal.title}</div>}
                     />
                     <Step 
                        num="2" 
                        text={t.manuals.racAdmin.step4} 
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* RAC Trainer Manual */}
         {activeRole === UserRole.RAC_TRAINER && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title={t.manuals.racTrainer.title} icon={Briefcase} color="green" />
               
               <Section title={t.manuals.racTrainer.sec1}>
                  <p>{t.manuals.racTrainer.sec1text}</p>
                  <AlertBox type="error">
                      <strong>{t.manuals.racTrainer.alert}</strong>
                  </AlertBox>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text={t.manuals.racTrainer.step1} 
                     />
                     <Step 
                        num="2" 
                        text={t.manuals.racTrainer.step2} 
                        visual={<div className="checkbox-mock checked" />}
                     />
                     <Step 
                        num="3" 
                        text={t.manuals.racTrainer.step3} 
                        visual={<div className="checkbox-red-mock checked" />}
                     />
                     <Step 
                        num="4" 
                        text={t.manuals.racTrainer.step4} 
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* Dept Admin Manual */}
         {activeRole === UserRole.DEPT_ADMIN && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title={t.manuals.deptAdmin.title} icon={Users} color="purple" />
               
               <Section title={t.manuals.deptAdmin.sec1}>
                  <p>{t.manuals.deptAdmin.sec1text}</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text={t.manuals.deptAdmin.step1} 
                        visual={<CheckCircle size={16} className="text-green-500" />}
                     />
                     <Step 
                        num="2" 
                        text={t.manuals.deptAdmin.step2} 
                        visual={<div className="btn-black-mock"><Printer size={12}/> {t.cards.goToPrint}</div>}
                     />
                  </ul>
               </Section>

               <Section title={t.manuals.deptAdmin.sec2}>
                  <p>{t.manuals.deptAdmin.sec2text}</p>
                  <ul className="step-list">
                     <Step 
                        num="1" 
                        text={t.manuals.deptAdmin.step3} 
                     />
                     <Step 
                        num="2" 
                        text={t.manuals.deptAdmin.step4} 
                     />
                  </ul>
               </Section>
            </div>
         )}

         {/* User Manual */}
         {activeRole === UserRole.USER && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <Header title={t.manuals.user.title} icon={UserCog} color="gray" />
               
               <Section title={t.manuals.user.sec1}>
                  <p>{t.manuals.user.sec1text}</p>
                  <div className="flex gap-4 my-4">
                     <div className="badge-green-mock">{t.manuals.user.compliant}</div>
                  </div>
                  <div className="flex gap-4 mb-4">
                     <div className="badge-red-mock">{t.manuals.user.nonCompliant}</div>
                  </div>
               </Section>

               <Section title={t.manuals.user.sec2}>
                  <p>{t.manuals.user.sec2text}</p>
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
