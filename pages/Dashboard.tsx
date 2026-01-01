
import React, { useState, useEffect, useMemo } from 'react';
import DashboardStats from '../components/DashboardStats';
import { Booking, UserRole, EmployeeRequirement, TrainingSession, BookingStatus, RacDef } from '../types';
import { COMPANIES, DEPARTMENTS, OPS_KEYS, RAC_KEYS } from '../constants';
import { 
    Calendar, Clock, MapPin, ChevronRight, Filter, Timer, User, 
    CheckCircle, XCircle, ChevronLeft, Zap, Layers, Briefcase, 
    Printer, MessageCircle, Send, ShieldAlert, AlertTriangle, ArrowRight, Activity,
    ShieldCheck, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';
import { useMessages } from '../contexts/MessageContext';

interface DashboardProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  sessions: TrainingSession[];
  userRole: UserRole;
  onApproveAutoBooking?: (bookingId: string) => void;
  onRejectAutoBooking?: (bookingId: string) => void;
  racDefinitions?: RacDef[];
  currentSiteId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  bookings, 
  requirements, 
  sessions, 
  userRole, 
  onApproveAutoBooking,
  onRejectAutoBooking,
  racDefinitions = [],
  currentSiteId
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  const employeesWithStatus = useMemo(() => {
      const empMap = new Map<string, any>();
      bookings.forEach(b => {
          if (!empMap.has(b.employee.id)) {
              empMap.set(b.employee.id, b.employee);
          }
      });
      const uniqueEmployees = Array.from(empMap.values());

      return uniqueEmployees.map(emp => {
          const req = requirements.find(r => r.employeeId === emp.id) || { employeeId: emp.id, asoExpiryDate: '', requiredRacs: {} };
          const today = new Date().toISOString().split('T')[0];
          const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
          const isActive = emp.isActive ?? true;

          let allRacsMet = true;
          const mappedRacs = Object.entries(req.requiredRacs)
              .filter(([_, val]) => val === true)
              .map(([key]) => key);

          mappedRacs.forEach((key) => {
              const validBooking = bookings.find(b => {
                  if (b.employee.id !== emp.id) return false;
                  if (b.status !== BookingStatus.PASSED) return false;
                  if (!b.expiryDate || b.expiryDate <= today) return false;
                  
                  let bRacCode = '';
                  const s = sessions.find(s => s.id === b.sessionId);
                  if (s) bRacCode = s.racType.split(' - ')[0].replace(/\s+/g, '').toUpperCase();
                  else bRacCode = b.sessionId.split('-')[0].replace(/\s+/g, '').toUpperCase();

                  return bRacCode === key.toUpperCase();
              });
              if (!validBooking) allRacsMet = false;
          });

          let status: 'Granted' | 'Blocked' = 'Granted';
          if (!isActive || !isAsoValid || !allRacsMet) status = 'Blocked';

          return {
              ...emp,
              accessStatus: status,
              requirements: req,
              siteId: emp.siteId || 's1'
          };
      });
  }, [bookings, requirements, sessions]);

  const globalStats = useMemo(() => {
      const filtered = employeesWithStatus.filter(e => {
          if (currentSiteId !== 'all' && e.siteId !== currentSiteId) return false;
          return true;
      });
      const total = filtered.length;
      const compliant = filtered.filter(e => e.accessStatus === 'Granted').length;
      return { total, compliant, rate: total > 0 ? Math.round((compliant / total) * 100) : 0 };
  }, [employeesWithStatus, currentSiteId]);

  const filteredEmployees = useMemo(() => {
      return employeesWithStatus.filter(e => {
          if (currentSiteId !== 'all' && e.siteId !== currentSiteId) return false;
          if (selectedCompany !== 'All' && e.company !== selectedCompany) return false;
          if (selectedDepartment !== 'All' && e.department !== selectedDepartment) return false;
          return true;
      });
  }, [employeesWithStatus, selectedCompany, selectedDepartment, currentSiteId]);

  const filteredBookingsForStats = useMemo(() => {
      const allowedIds = new Set(filteredEmployees.map(e => e.id));
      return bookings.filter(b => allowedIds.has(b.employee.id));
  }, [bookings, filteredEmployees]);

  const filteredRequirements = useMemo(() => {
      const allowedIds = new Set(filteredEmployees.map(e => e.id));
      return requirements.filter(r => allowedIds.has(r.employeeId));
  }, [requirements, filteredEmployees]);

  const upcomingSessions = useMemo(() => {
      let relevantSessions = sessions;
      if (currentSiteId !== 'all') {
          relevantSessions = sessions.filter(s => (s.siteId || 's1') === currentSiteId);
      }
      return [...relevantSessions]
        .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
        .slice(0, 10); 
  }, [sessions, currentSiteId]);

  const handleBookRenewals = () => {
      const today = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(today.getDate() + 30);
      
      const expiring = filteredBookingsForStats.filter(b => b.expiryDate && new Date(b.expiryDate) > today && new Date(b.expiryDate) <= thirtyDays);
      if (expiring.length === 0) return;
      
      navigate('/booking', { state: { prefill: expiring.map(b => b.employee) } });
  };

  const getTranslatedRacName = (racType: string) => {
    const racCode = racType.split(' - ')[0].replace(/\s+/g, '');
    // @ts-ignore
    return t.racDefs?.[racCode] || racType;
  };

  return (
    <div className="space-y-6 pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl shadow-xl border border-slate-700 overflow-hidden flex flex-col md:flex-row p-1 relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <TrendingUp size={200} />
              </div>

              <div className="p-8 flex flex-col justify-center items-center text-white md:w-56 shrink-0 relative z-10">
                  <div className="h-24 w-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow"></div>
                      <span className="text-3xl font-black">{globalStats.rate}%</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 text-center">Global Readiness</span>
              </div>

              <div className="flex-1 p-8 flex flex-col justify-between relative z-10 border-l border-white/5">
                  <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Executive Overview</h3>
                      <p className="text-slate-400 text-sm max-w-md">Critical Activity Requisition Matrix (Enterprise View). Real-time compliance monitoring across all site operations.</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4">
                      <button 
                        onClick={() => navigate('/booking')}
                        className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                      >
                        <Zap size={18} fill="currentColor" /> {t.dashboard.newRequisition}
                      </button>
                      <button 
                        onClick={() => navigate('/reports')}
                        className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all"
                      >
                        Compliance Analytics
                      </button>
                  </div>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 flex flex-col justify-between border border-slate-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div>
                  <div className="flex items-center gap-2 text-indigo-600 mb-4">
                      <AlertTriangle size={20} />
                      <h3 className="font-black text-xs uppercase tracking-widest">Renewal Management</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      System identified <strong className="text-slate-800 dark:text-white">5</strong> staff members with certifications expiring in the next 7 days.
                  </p>
              </div>
              <button 
                onClick={handleBookRenewals}
                className="w-full bg-slate-900 text-white dark:bg-slate-700 hover:bg-indigo-600 dark:hover:bg-indigo-900/30 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                  Auto-Book Renewals <ArrowRight size={16} />
              </button>
          </div>
      </div>

      <div className="md:sticky md:top-0 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 no-print transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Live Workforce Matrix</h2>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-xl border border-slate-200 dark:border-slate-600 flex-1 min-w-[200px]">
                <Filter size={16} className="text-slate-400 ml-2" />
                <select 
                    value={selectedCompany} 
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-white outline-none cursor-pointer"
                >
                    <option value="All">{t.common.all} {t.common.company}</option>
                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <button 
                onClick={() => window.print()}
                className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300 shadow-sm"
            >
                <Printer size={20} />
            </button>
        </div>
      </div>

      <DashboardStats 
          bookings={filteredBookingsForStats} 
          requirements={filteredRequirements} 
          onBookRenewals={handleBookRenewals}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[450px]">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Next Scheduled Requisitions</h3>
             </div>
          </div>
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-white dark:bg-slate-800 sticky top-0 z-10">
                 <tr>
                   <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dashboard.upcoming.date}</th>
                   <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dashboard.upcoming.session}</th>
                   <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dashboard.upcoming.capacity}</th>
                 </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700/50">
                {upcomingSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{session.date}</div>
                      <div className="text-[10px] font-mono text-slate-400">{session.startTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{getTranslatedRacName(session.racType)}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10}/> {session.location}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                           {bookings.filter(b => b.sessionId === session.id).length} / {session.capacity}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Personnel Records */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[450px]">
           <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
             <div className="flex items-center gap-2">
                <User className="text-blue-600 dark:text-blue-400" size={20} />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Active Personnel Status</h3>
             </div>
           </div>
           <div className="overflow-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0 z-10">
                   <tr>
                     <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorization</th>
                   </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700/50">
                   {filteredBookingsForStats.slice(0, 15).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                       <td className="px-6 py-4">
                         <div className="text-sm font-bold text-slate-900 dark:text-white">{item.employee.name}</div>
                         <div className="text-[10px] text-slate-500 font-mono">{item.employee.recordId}</div>
                       </td>
                       <td className="px-6 py-4">
                         <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase">
                           {sessions.find(s => s.id === item.sessionId)?.racType.split(' - ')[0] || item.sessionId.split('|')[0]}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase flex items-center gap-1 ${item.status === 'Passed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                             {item.status === 'Passed' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                             {item.status}
                          </span>
                       </td>
                    </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
