
import React, { useState, useEffect, useMemo } from 'react';
import DashboardStats from '../components/DashboardStats';
import { Booking, UserRole, EmployeeRequirement, TrainingSession, BookingStatus, RacDef } from '../types';
import { COMPANIES, DEPARTMENTS, OPS_KEYS, RAC_KEYS } from '../constants';
import { Calendar, Clock, MapPin, ChevronRight, Filter, Timer, User, CheckCircle, XCircle, ChevronLeft, Zap, Layers, Briefcase, Printer, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';
import { useMessages } from '../contexts/MessageContext';
import { sendSms } from '../services/smsService';

interface DashboardProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  sessions: TrainingSession[];
  userRole: UserRole;
  onApproveAutoBooking?: (bookingId: string) => void;
  onRejectAutoBooking?: (bookingId: string) => void;
  racDefinitions?: RacDef[];
  currentSiteId: string; // GLOBAL FILTER CONTEXT
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
  const { addMessage } = useMessages();
  
  // -- GLOBAL FILTERS (LOCAL TO PAGE) --
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedAccessStatus, setSelectedAccessStatus] = useState<'All' | 'Granted' | 'Blocked'>('All');

  // Trigger re-render every minute to update countdowns
  const [, setTick] = useState(0);

  // Pagination state for Auto-Booking Table
  const [abPage, setAbPage] = useState(1);
  const AB_ROWS_PER_PAGE = 5; 

  // Filters for Employee Bookings Table
  const [empFilterCompany, setEmpFilterCompany] = useState<string>('All');
  const [empFilterRac, setEmpFilterRac] = useState<string>('All');
  const [empFilterDate, setEmpFilterDate] = useState<string>('');

  const [isSendingSms, setIsSendingSms] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Safety check for translations
  if (!t || !t.dashboard || !t.dashboard.upcoming || !t.dashboard.booked) {
      return (
          <div className="flex items-center justify-center h-full p-20 text-slate-500">
              Loading Dashboard Resources...
          </div>
      );
  }

  // --- HELPER: Translate RACs ---
  const getTranslatedRacName = (racType: string) => {
      const racCode = racType.split(' - ')[0].replace(/\s+/g, '');
      // @ts-ignore
      return t.racDefs?.[racCode] || racType;
  };

  // --- CORE LOGIC: Access Status Calculation ---
  const employeesWithStatus = useMemo(() => {
      // 1. Get Unique Employees
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
          const dlExpiry = emp.driverLicenseExpiry || '';
          const isDlExpired = !!(dlExpiry && dlExpiry <= today);
          const isActive = emp.isActive ?? true;

          let allRacsMet = true;
          let hasRac02Req = false;

          const definitions = racDefinitions.length > 0 ? racDefinitions : RAC_KEYS.map(k => ({ code: k }));

          definitions.forEach((def: any) => {
              const key = def.code;
              if (req.requiredRacs[key]) {
                  if (key === 'RAC02') hasRac02Req = true;
                  
                  const validBooking = bookings.find(b => {
                      if (b.employee.id !== emp.id) return false;
                      if (b.status !== BookingStatus.PASSED) return false;
                      if (!b.expiryDate || b.expiryDate <= today) return false;
                      
                      let bRacKey = '';
                      const session = sessions.find(s => s.id === b.sessionId);
                      if (session) {
                          bRacKey = session.racType;
                      } else {
                          bRacKey = b.sessionId;
                      }
                      
                      if (bRacKey.includes('|')) bRacKey = bRacKey.split('|')[0];
                      bRacKey = bRacKey.replace('(Imp)', '');
                      if (bRacKey.includes('-')) bRacKey = bRacKey.split('-')[0];
                      bRacKey = bRacKey.replace(/\s+/g, '').trim().toUpperCase();
                      
                      const targetKey = key.replace(/\s+/g, '').trim().toUpperCase();
                      return bRacKey === targetKey;
                  });

                  if (!validBooking) {
                      allRacsMet = false;
                  }
              }
          });

          let status: 'Granted' | 'Blocked' = 'Granted';
          if (!isActive) status = 'Blocked';
          else if (!isAsoValid || !allRacsMet) status = 'Blocked';
          else if (hasRac02Req && isDlExpired) status = 'Blocked';

          return {
              ...emp,
              accessStatus: status,
              requirements: req,
              siteId: emp.siteId || 's1'
          };
      });
  }, [bookings, requirements, sessions, racDefinitions]);

  const filteredEmployees = useMemo(() => {
      return employeesWithStatus.filter(e => {
          if (currentSiteId !== 'all' && e.siteId !== currentSiteId) return false;
          if (selectedCompany !== 'All' && e.company !== selectedCompany) return false;
          if (selectedDepartment !== 'All' && e.department !== selectedDepartment) return false;
          if (selectedAccessStatus !== 'All' && e.accessStatus !== selectedAccessStatus) return false;
          return true;
      });
  }, [employeesWithStatus, selectedCompany, selectedDepartment, selectedAccessStatus, currentSiteId]);

  const filteredBookingsForStats = useMemo(() => {
      const allowedIds = new Set(filteredEmployees.map(e => e.id));
      return bookings.filter(b => allowedIds.has(b.employee.id));
  }, [bookings, filteredEmployees]);

  const filteredRequirements = useMemo(() => {
      const allowedIds = new Set(filteredEmployees.map(e => e.id));
      return requirements.filter(r => allowedIds.has(r.employeeId));
  }, [requirements, filteredEmployees]);

  const matrixCounts = useMemo(() => {
      const counts: Record<string, number> = {};
      OPS_KEYS.forEach(k => counts[k] = 0);

      filteredEmployees.forEach(emp => {
          const req = emp.requirements;
          if (req && req.requiredRacs) {
              OPS_KEYS.forEach(key => {
                  if (req.requiredRacs[key]) {
                      counts[key] = (counts[key] || 0) + 1;
                  }
              });
          }
      });
      return counts;
  }, [filteredEmployees]);

  const upcomingSessions = useMemo(() => {
      let relevantSessions = sessions;
      if (currentSiteId !== 'all') {
          relevantSessions = sessions.filter(s => {
              const sSiteId = s.siteId || 's1';
              return sSiteId === currentSiteId;
          });
      }

      return [...relevantSessions]
        .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
        .slice(0, 10); 
  }, [sessions, currentSiteId]);

  const getBookingCount = (sessionId: string) => {
    return bookings.filter(b => b.sessionId === sessionId).length;
  };

  const getSessionStatus = (dateStr: string, timeStr: string) => {
    try {
        const fullDateStr = `${dateStr}T${timeStr}`;
        const sessionDate = new Date(fullDateStr);
        const now = new Date();
        
        if (isNaN(sessionDate.getTime())) return null;
        const diff = sessionDate.getTime() - now.getTime();

        if (diff <= 0) {
            return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600">{t.common.completed}</span>;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
            <Timer size={12} /> {String(days)}d : {String(hours)}h {t.common.timeLeft}
        </span>
        );
    } catch (e) { return null; }
  };

  const expiringBookings = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return filteredBookingsForStats.filter(b => {
      if (!b.expiryDate) return false;
      const expDate = new Date(b.expiryDate);
      return expDate > today && expDate <= thirtyDaysFromNow;
    });
  }, [filteredBookingsForStats]);

  const autoBookings = useMemo(() => {
      return bookings.filter(b => {
          const empSite = b.employee.siteId || 's1';
          if (currentSiteId !== 'all' && empSite !== currentSiteId) return false;
          return b.isAutoBooked && b.status === BookingStatus.PENDING;
      });
  }, [bookings, currentSiteId]);

  const paginatedAutoBookings = useMemo(() => {
      const start = (abPage - 1) * AB_ROWS_PER_PAGE;
      return autoBookings.slice(start, start + AB_ROWS_PER_PAGE);
  }, [autoBookings, abPage]);
  
  const totalAbPages = Math.ceil(autoBookings.length / AB_ROWS_PER_PAGE);

  const handleBookRenewals = () => {
      if (expiringBookings.length === 0) return;
      const groupedBatch: Record<string, any[]> = {};
      expiringBookings.forEach(b => {
          let racType = 'Unknown Training';
          const session = sessions.find(s => s.id === b.sessionId);
          if (session) racType = session.racType;
          else if (b.sessionId.includes('RAC')) racType = b.sessionId.split(' - ')[0]; 
          else racType = b.sessionId;

          if (!groupedBatch[racType]) groupedBatch[racType] = [];
          groupedBatch[racType].push({
              id: uuidv4(),
              name: b.employee.name,
              recordId: b.employee.recordId,
              company: b.employee.company,
              department: b.employee.department,
              role: b.employee.role,
              phoneNumber: b.employee.phoneNumber,
              driverLicenseNumber: b.employee.driverLicenseNumber || '',
              driverLicenseClass: b.employee.driverLicenseClass || '',
              driverLicenseExpiry: b.employee.driverLicenseExpiry || ''
          });
      });

      const batchQueue = Object.entries(groupedBatch).map(([racType, employees]) => ({ racType, employees }));
      if (batchQueue.length > 0) {
          navigate('/booking', { state: { prefill: batchQueue[0].employees, targetRac: batchQueue[0].racType, remainingBatches: batchQueue.slice(1) } });
      }
  };

  const handleSendSmsBlast = async () => {
      if (expiringBookings.length === 0 && autoBookings.length === 0) return;
      setIsSendingSms(true);

      const brand = language === 'pt' ? 'RACS' : 'CARS';

      let sentCount = 0;
      const uniqueExpiring = new Set<string>();
      
      for (const b of expiringBookings) {
          if (b.employee.phoneNumber && !uniqueExpiring.has(b.employee.id)) {
              const msg = `${brand} SAFETY: Hi ${b.employee.name}, your training is expiring soon. Please contact HSE.`;
              await sendSms(b.employee.phoneNumber, msg);
              
              addMessage({
                  type: 'SMS',
                  recipient: b.employee.phoneNumber,
                  recipientName: b.employee.name,
                  content: msg
              });

              uniqueExpiring.add(b.employee.id);
              sentCount++;
          }
      }

      const uniqueCritical = new Set<string>();
      for (const b of autoBookings) {
          if (b.employee.phoneNumber && !uniqueCritical.has(b.employee.id)) {
              if (!uniqueExpiring.has(b.employee.id)) {
                  const msg = `${brand} CRITICAL: ${b.employee.name}, you have been auto-booked to prevent lockout. Check schedule immediately.`;
                  await sendSms(b.employee.phoneNumber, msg);
                  
                  addMessage({
                      type: 'SMS',
                      recipient: b.employee.phoneNumber,
                      recipientName: b.employee.name,
                      content: msg
                  });

                  uniqueCritical.add(b.employee.id);
                  sentCount++;
              }
          }
      }

      if (sentCount > 0) {
          addMessage({
              type: 'EMAIL',
              recipient: 'manager@cars-system.com',
              recipientName: 'Site Manager',
              subject: 'Daily Expiry Notification Report',
              content: `System Report:\n\nSent ${sentCount} SMS reminders to employees expiring within 30 days.\n\nPlease check the dashboard for details.`
          });
      }

      setIsSendingSms(false);
      alert(`SMS Blast Complete. Sent notifications to ${sentCount} employees.`);
  };

  const employeeBookingsList = useMemo(() => {
    return filteredBookingsForStats.map(b => {
      const session = sessions.find(s => s.id === b.sessionId);
      let racName = session ? session.racType : b.sessionId;
      const racCode = racName.split(' - ')[0].replace(' ', '');
      
      return {
        ...b,
        racName,
        racCode,
        sessionDate: session ? session.date : '',
        sessionRoom: session ? session.location : 'TBD',
        sessionTrainer: session ? session.instructor : 'TBD'
      };
    });
  }, [filteredBookingsForStats, sessions]);

  const finalFilteredBookings = employeeBookingsList.filter(item => {
    if (empFilterCompany !== 'All' && item.employee.company !== empFilterCompany) return false;
    if (empFilterRac !== 'All' && item.racCode !== empFilterRac) return false;
    if (empFilterDate && item.sessionDate !== empFilterDate) return false;
    return true;
  });

  const canManageAutoBookings = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN;

  return (
    <div className="space-y-6 pb-20">
      
      <style>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print, .sticky { display: none !important; }
          .overflow-hidden { overflow: visible !important; }
          .overflow-auto { overflow: visible !important; height: auto !important; }
          .h-\[500px\] { height: auto !important; }
          .recharts-responsive-container { width: 100% !important; min-height: 300px !important; }
        }
      `}</style>

      {/* --- FILTER CONTROL BAR --- */}
      <div className="md:sticky md:top-0 z-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t.dashboard.title}</h2>
          <p className="text-sm text-slate-700 dark:text-gray-400">{t.dashboard.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 flex-1 min-w-[200px]">
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

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 flex-1 min-w-[200px]">
                <Briefcase size={16} className="text-slate-400 ml-2" />
                <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-white outline-none cursor-pointer"
                >
                    <option value="All">{t.common.all} {t.common.department}</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 flex-1 min-w-[150px]">
                {selectedAccessStatus === 'Granted' ? <CheckCircle size={16} className="text-green-500 ml-2"/> : selectedAccessStatus === 'Blocked' ? <XCircle size={16} className="text-red-500 ml-2"/> : <Layers size={16} className="text-slate-400 ml-2" />}
                <select 
                    value={selectedAccessStatus} 
                    onChange={(e) => setSelectedAccessStatus(e.target.value as any)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-white outline-none cursor-pointer"
                >
                    <option value="All">{t.common.all} Status</option>
                    <option value="Granted">{t.database.granted}</option>
                    <option value="Blocked">{t.database.blocked}</option>
                </select>
            </div>

            <button 
                onClick={() => window.print()}
                className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
                title="Print Dashboard"
            >
                <Printer size={20} />
            </button>
        </div>
      </div>

      <div className="print:block">
        <DashboardStats 
            bookings={filteredBookingsForStats} 
            requirements={filteredRequirements} 
            onBookRenewals={handleBookRenewals}
        />
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers size={14} /> {t.common.operationalMatrix}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {Object.entries(matrixCounts).map(([key, count]) => {
                  let label = key;
                  if (key === 'LIB_OPS') label = 'LIB-OPS';
                  if (key === 'LIB_MOV') label = 'LIB-MOV';
                  if (key === 'DONO_AREA_PTS') label = t.common.owner;
                  
                  return (
                      <div key={key} className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-600 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase truncate w-full text-center" title={key}>{label}</span>
                          <span className="text-xl font-black text-slate-800 dark:text-white">{count}</span>
                      </div>
                  );
              })}
          </div>
      </div>

       {canManageAutoBookings && autoBookings.length > 0 && onApproveAutoBooking && onRejectAutoBooking && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-orange-300 dark:border-orange-700 overflow-hidden ring-4 ring-orange-100 dark:ring-orange-900/20 animate-pulse-slow no-print">
             <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40 border-b border-orange-200 dark:border-orange-800 flex justify-between items-center">
                 <div>
                     <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                        <Zap size={20} className="fill-orange-500 text-orange-600" />
                        <h3 className="font-black text-lg uppercase tracking-tight">{t.dashboard.autoBooking.title}</h3>
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm animate-bounce">
                            {autoBookings.length}
                        </span>
                     </div>
                     <p className="text-xs text-orange-800 dark:text-orange-300 mt-1 font-medium">
                        {t.dashboard.autoBooking.subPart1} (<strong className="underline">{"< 7 days"}</strong>) {t.dashboard.autoBooking.subPart2}
                     </p>
                 </div>
                 
                 {totalAbPages > 1 && (
                     <div className="flex items-center gap-2">
                         <button 
                             onClick={() => setAbPage(p => Math.max(1, p - 1))}
                             disabled={abPage === 1}
                             className="p-1 rounded hover:bg-orange-200 dark:hover:bg-orange-800 disabled:opacity-30 text-orange-700 dark:text-orange-400"
                         >
                             <ChevronLeft size={16} />
                         </button>
                         <span className="text-xs font-mono font-bold text-orange-700 dark:text-orange-400">
                             {abPage} / {totalAbPages}
                         </span>
                         <button 
                             onClick={() => setAbPage(p => Math.min(totalAbPages, p + 1))}
                             disabled={abPage === totalAbPages}
                             className="p-1 rounded hover:bg-orange-200 dark:hover:bg-orange-800 disabled:opacity-30 text-orange-700 dark:text-orange-400"
                         >
                             <ChevronRight size={16} />
                         </button>
                     </div>
                 )}
             </div>

             <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-orange-100 dark:divide-orange-900/30">
                     <thead className="bg-orange-50/50 dark:bg-orange-900/10 md:sticky md:top-0 z-10">
                         <tr>
                             <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 dark:text-orange-300 uppercase">{t.common.name}</th>
                             <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 dark:text-orange-300 uppercase">Session / RAC</th>
                             <th className="px-4 py-3 text-left text-xs font-bold text-orange-800 dark:text-orange-300 uppercase">{t.common.date}</th>
                             <th className="px-4 py-3 text-right text-xs font-bold text-orange-800 dark:text-orange-300 uppercase">{t.common.actions}</th>
                         </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-50 dark:divide-slate-700">
                         {paginatedAutoBookings.map(booking => {
                             const session = sessions.find(s => s.id === booking.sessionId);
                             return (
                                 <tr key={booking.id} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors">
                                     <td className="px-4 py-3">
                                         <div className="text-sm font-black text-slate-900 dark:text-slate-200">{booking.employee.name}</div>
                                         <div className="text-xs text-slate-500 dark:text-gray-400 font-mono">{booking.employee.company} • {booking.employee.recordId}</div>
                                     </td>
                                     <td className="px-4 py-3">
                                         <span className="inline-block bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs font-bold border border-orange-200 dark:border-orange-800">
                                            {session ? session.racType : booking.sessionId}
                                         </span>
                                     </td>
                                     <td className="px-4 py-3">
                                         <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {session ? session.date : 'TBD'}
                                         </div>
                                         <div className="text-xs text-slate-500 dark:text-gray-400">
                                            {session ? session.startTime : ''}
                                         </div>
                                     </td>
                                     <td className="px-4 py-3 text-right">
                                         <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => onApproveAutoBooking && onApproveAutoBooking(booking.id)} 
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                                title="Approve Booking"
                                            >
                                                <CheckCircle size={16} />
                                                <span className="text-xs font-bold">{t.common.yes}</span>
                                            </button>
                                            <button 
                                                onClick={() => onRejectAutoBooking && onRejectAutoBooking(booking.id)} 
                                                className="flex items-center gap-1 px-3 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Reject & Delete"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                         </div>
                                     </td>
                                 </tr>
                             );
                         })}
                     </tbody>
                 </table>
             </div>
          </div>
       )}

      {expiringBookings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg flex flex-col md:flex-row justify-between items-start md:items-center animate-fade-in-down">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400">{t.dashboard.renewal.title}</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {String(expiringBookings.length)} {t.dashboard.renewal.message} 
              {expiringBookings.length <= 5 && (
                  <span className="font-bold ml-1">
                      ({expiringBookings.map(e => e.employee.name).join(', ')})
                  </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
              <button 
                onClick={handleSendSmsBlast}
                disabled={isSendingSms}
                className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-700 dark:hover:bg-slate-600 transition shadow-sm text-sm font-medium flex items-center gap-2"
              >
                {isSendingSms ? t.common.sending : <><MessageCircle size={16} /> {t.common.smsBlast}</>}
              </button>
              <button 
                onClick={handleBookRenewals}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition shadow-sm text-sm font-medium"
              >
                {t.dashboard.renewal.button}
              </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 print:grid-cols-1">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors h-[500px]">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2">
                <Calendar className="text-yellow-600 dark:text-yellow-500" size={20} />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t.dashboard.upcoming.title}</h3>
             </div>
             <button onClick={() => navigate('/schedule')} className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center hover:underline no-print">
               {t.dashboard.upcoming.viewSchedule} <ChevronRight size={14} />
             </button>
          </div>
          
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-white dark:bg-slate-800 md:sticky md:top-0 z-10 shadow-sm">
                 <tr>
                   <th className="px-4 py-3 text-left text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.date}</th>
                   <th className="px-4 py-3 text-left text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.session}</th>
                   <th className="px-4 py-3 text-center text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.capacity}</th>
                   <th className="px-4 py-3 text-center text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.status}</th>
                 </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {upcomingSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{String(session.date)}</div>
                      <div className="text-xs text-slate-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                         <Clock size={12} /> {String(session.startTime)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{getTranslatedRacName(session.racType)}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {String(session.location)}</span>
                        <span className="flex items-center gap-1"><User size={12} /> {String(session.instructor)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                           {getBookingCount(session.id)}/{String(session.capacity)}
                       </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {getSessionStatus(session.date, session.startTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] transition-colors">
           <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 shrink-0">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                   <User className="text-blue-600 dark:text-blue-500" size={20} />
                   <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t.dashboard.booked.title}</h3>
                </div>
                <div className="text-xs text-gray-400">
                  {finalFilteredBookings.length} {t.common.recordsFound}
                </div>
             </div>
             
             <div className="flex flex-wrap gap-2 no-print">
                <select 
                   value={empFilterCompany}
                   onChange={(e) => setEmpFilterCompany(e.target.value)}
                   className="text-xs border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                >
                   <option value="All">{t.common.all} {t.common.company}</option>
                   {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select 
                   value={empFilterRac}
                   onChange={(e) => setEmpFilterRac(e.target.value)}
                   className="text-xs border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                >
                   <option value="All">{t.common.all} RACs</option>
                   {RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <input 
                   type="date"
                   value={empFilterDate}
                   onChange={(e) => setEmpFilterDate(e.target.value)}
                   className="text-xs border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                   placeholder="Filter Date"
                />
             </div>
           </div>

           <div className="overflow-auto flex-1 relative">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800 md:sticky md:top-0 shadow-sm z-10">
                   <tr>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-black dark:text-gray-400 uppercase tracking-wider">ID</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableEmployee}</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableRac}</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableDate}</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableRoom}</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableTrainer}</th>
                   </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                   {finalFilteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                          {t.dashboard.booked.noData}
                        </td>
                      </tr>
                   ) : (
                      finalFilteredBookings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                           <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-black dark:text-gray-400">
                             {String(item.employee.recordId)}
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap">
                             <div className="text-xs font-bold text-slate-900 dark:text-white">{String(item.employee.name)}</div>
                             <div className="text-[10px] text-slate-500 dark:text-gray-400 truncate max-w-[120px]" title={item.employee.company}>{String(item.employee.company)}</div>
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap">
                             <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                               {String(item.racCode)}
                             </span>
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-800 dark:text-gray-400">
                             {item.sessionDate ? String(item.sessionDate) : <span className="text-gray-300 italic">--</span>}
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-800 dark:text-gray-400">
                             {item.sessionRoom ? String(item.sessionRoom) : <span className="text-gray-300 italic">--</span>}
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-800 dark:text-gray-400">
                             {item.sessionTrainer ? String(item.sessionTrainer) : <span className="text-gray-300 italic">--</span>}
                           </td>
                        </tr>
                      ))
                   )}
                </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
