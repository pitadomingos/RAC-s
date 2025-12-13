
import React, { useState, useEffect, useMemo } from 'react';
import DashboardStats from '../components/DashboardStats';
import { Booking, UserRole, EmployeeRequirement, TrainingSession, BookingStatus, RacDef } from '../types';
import { COMPANIES, DEPARTMENTS, OPS_KEYS, RAC_KEYS } from '../constants';
import { Calendar, Clock, MapPin, ChevronRight, Filter, Timer, User, CheckCircle, XCircle, ChevronLeft, Zap, Layers, Briefcase, Printer, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  sessions: TrainingSession[];
  userRole: UserRole;
  onApproveAutoBooking?: (bookingId: string) => void;
  onRejectAutoBooking?: (bookingId: string) => void;
  racDefinitions?: RacDef[];
  contractors?: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  bookings, 
  requirements, 
  sessions, 
  userRole, 
  onApproveAutoBooking,
  onRejectAutoBooking,
  racDefinitions = [],
  contractors = []
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Use passed contractors list if available, otherwise fallback to constants
  const companyList = contractors.length > 0 ? contractors : COMPANIES;

  // -- GLOBAL FILTERS --
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

  // --- CORE LOGIC: Access Status Calculation (Replicated from DatabasePage) ---
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

          // Use racDefinitions if available, else fallback to constants
          const definitions = racDefinitions.length > 0 ? racDefinitions : RAC_KEYS.map(k => ({ code: k }));

          definitions.forEach((def: any) => {
              const key = def.code;
              if (req.requiredRacs[key]) {
                  if (key === 'RAC02') hasRac02Req = true;
                  
                  // Check for valid booking
                  const validBooking = bookings.find(b => {
                      if (b.employee.id !== emp.id) return false;
                      if (b.status !== BookingStatus.PASSED) return false;
                      if (!b.expiryDate || b.expiryDate <= today) return false;
                      
                      // Match RAC Key - Consistent with DatabasePage Logic
                      let bRacKey = '';
                      const session = sessions.find(s => s.id === b.sessionId);
                      if (session) {
                          bRacKey = session.racType;
                      } else {
                          bRacKey = b.sessionId;
                      }
                      
                      // Normalize
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
              requirements: req // Attach requirement for Matrix counting
          };
      });
  }, [bookings, requirements, sessions, racDefinitions]);

  // --- FILTERING ---
  const filteredEmployees = useMemo(() => {
      return employeesWithStatus.filter(e => {
          if (selectedCompany !== 'All' && e.company !== selectedCompany) return false;
          if (selectedDepartment !== 'All' && e.department !== selectedDepartment) return false;
          if (selectedAccessStatus !== 'All' && e.accessStatus !== selectedAccessStatus) return false;
          return true;
      });
  }, [employeesWithStatus, selectedCompany, selectedDepartment, selectedAccessStatus]);

  // Filtered Bookings & Requirements for Stats
  const filteredBookingsForStats = useMemo(() => {
      const allowedIds = new Set(filteredEmployees.map(e => e.id));
      return bookings.filter(b => allowedIds.has(b.employee.id));
  }, [bookings, filteredEmployees]);

  const filteredRequirements = useMemo(() => {
      const allowedIds = new Set(filteredEmployees.map(e => e.id));
      return requirements.filter(r => allowedIds.has(r.employeeId));
  }, [requirements, filteredEmployees]);

  // --- OPERATIONAL MATRIX COUNTS ---
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


  // Sort sessions by date (closest first) for the "Upcoming" view
  const upcomingSessions = [...sessions]
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
    .slice(0, 10); 

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
            return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600">Completed</span>;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (isNaN(days)) return null;

        return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
            <Timer size={12} /> {String(days)}d : {String(hours)}h left
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

  // Identify auto-bookings waiting for approval
  const autoBookings = useMemo(() => {
      return bookings.filter(b => b.isAutoBooked && b.status === BookingStatus.PENDING);
  }, [bookings]);

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
              driverLicenseNumber: b.employee.driverLicenseNumber || '',
              driverLicenseClass: b.employee.driverLicenseClass || '',
              driverLicenseExpiry: b.employee.driverLicenseExpiry || ''
          });
      });

      const batches = Object.keys(groupedBatch).map(key => ({
          racType: key,
          employees: groupedBatch[key]
      }));

      const firstBatch = batches[0];
      const remaining = batches.slice(1);

      navigate('/booking', { 
          state: { 
              prefill: firstBatch.employees,
              targetRac: firstBatch.racType,
              remainingBatches: remaining
          } 
      });
  };

  const filteredBookingsTable = useMemo(() => {
      return bookings.filter(b => {
          const session = sessions.find(s => s.id === b.sessionId);
          const racType = session ? session.racType : (b.sessionId.includes('RAC') ? b.sessionId.split(' - ')[0] : b.sessionId);
          
          if (empFilterCompany !== 'All' && b.employee.company !== empFilterCompany) return false;
          if (empFilterRac !== 'All' && !racType.includes(empFilterRac)) return false;
          if (empFilterDate && session?.date !== empFilterDate && b.resultDate !== empFilterDate) return false;
          return true;
      }).slice(0, 10);
  }, [bookings, sessions, empFilterCompany, empFilterRac, empFilterDate]);

  return (
    <div className="space-y-8 pb-20 animate-fade-in-up">
      {/* Filters & Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition-colors">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">{t.dashboard.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.dashboard.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Company Select */}
            <div className="relative group flex-1 md:flex-none">
                <select 
                    value={selectedCompany} 
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 pl-4 pr-10 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    <option className="dark:bg-slate-800" value="All">{t.common.allCompanies}</option>
                    {companyList.map(c => <option className="dark:bg-slate-800" key={c} value={c}>{c}</option>)}
                </select>
                <Briefcase className="absolute right-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" size={14} />
            </div>

            {/* Department Select */}
            <div className="relative group flex-1 md:flex-none">
                <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 pl-4 pr-10 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    <option className="dark:bg-slate-800" value="All">{t.common.allDepts}</option>
                    {DEPARTMENTS.map(d => <option className="dark:bg-slate-800" key={d} value={d}>{d}</option>)}
                </select>
                <Layers className="absolute right-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" size={14} />
            </div>

            {/* Access Status Select */}
            <div className="relative group flex-1 md:flex-none">
                <select 
                    value={selectedAccessStatus} 
                    onChange={(e) => setSelectedAccessStatus(e.target.value as any)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 pl-4 pr-10 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    <option className="dark:bg-slate-800" value="All">{t.common.allStatus}</option>
                    <option className="dark:bg-slate-800" value="Granted">{t.database.granted}</option>
                    <option className="dark:bg-slate-800" value="Blocked">{t.database.blocked}</option>
                </select>
                <Filter className="absolute right-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" size={14} />
            </div>
        </div>
      </div>

      {/* --- USER ROLE PASSPORT SHORTCUT --- */}
      {userRole === UserRole.USER && (
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-down">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                      <ShieldCheck size={32} className="text-white" />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold">My Digital Passport</h3>
                      <p className="text-indigo-100 text-sm">View, print, or download your verified safety credentials.</p>
                  </div>
              </div>
              <button 
                onClick={() => navigate('/request-cards')}
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2"
              >
                  <Printer size={18} />
                  Access Passport
              </button>
          </div>
      )}

      {/* --- Notification Banner: Auto-Booking Approval --- */}
      {autoBookings.length > 0 && (userRole === UserRole.RAC_ADMIN || userRole === UserRole.SYSTEM_ADMIN) && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 animate-fade-in-down">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Zap size={32} className="animate-pulse" />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold">{t.dashboard.autoBooking.title}</h3>
                      <p className="text-white/90 text-sm">
                          {t.dashboard.autoBooking.subPart1} <span className="font-black bg-white/20 px-1 rounded">{autoBookings.length}</span> {t.dashboard.autoBooking.subPart2}
                      </p>
                  </div>
              </div>
              
              <div className="w-full lg:w-auto bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-80">Pending Queue</span>
                      <div className="flex gap-2">
                          <button onClick={() => setAbPage(Math.max(1, abPage - 1))} disabled={abPage === 1} className="p-1 hover:bg-white/20 rounded disabled:opacity-50"><ChevronLeft size={16}/></button>
                          <span className="text-xs font-mono">{abPage}/{totalAbPages}</span>
                          <button onClick={() => setAbPage(Math.min(totalAbPages, abPage + 1))} disabled={abPage === totalAbPages} className="p-1 hover:bg-white/20 rounded disabled:opacity-50"><ChevronRight size={16}/></button>
                      </div>
                  </div>
                  <div className="space-y-2">
                      {paginatedAutoBookings.map(b => (
                          <div key={b.id} className="flex items-center gap-3 bg-white/10 p-2 rounded-lg text-xs">
                              <span className="font-bold flex-1 truncate">{b.employee.name}</span>
                              <span className="opacity-75">{b.sessionId}</span>
                              <div className="flex gap-1">
                                  <button onClick={() => onApproveAutoBooking?.(b.id)} className="p-1 bg-green-500 hover:bg-green-400 rounded text-white"><CheckCircle size={14}/></button>
                                  <button onClick={() => onRejectAutoBooking?.(b.id)} className="p-1 bg-red-500 hover:bg-red-400 rounded text-white"><XCircle size={14}/></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* --- DASHBOARD METRICS --- */}
      <DashboardStats 
        bookings={filteredBookingsForStats} 
        requirements={filteredRequirements} 
        onBookRenewals={handleBookRenewals}
        racDefinitions={racDefinitions}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- UPCOMING SESSIONS (Left Col) --- */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <Calendar size={20} className="text-blue-500" />
                    {t.dashboard.upcoming.title}
                </h3>
                {userRole === UserRole.SYSTEM_ADMIN && (
                    <button onClick={() => navigate('/schedule')} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        {t.dashboard.upcoming.viewSchedule}
                    </button>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {upcomingSessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Calendar size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">No upcoming sessions</p>
                    </div>
                ) : (
                    upcomingSessions.map(session => {
                        const bookedCount = getBookingCount(session.id);
                        const isFull = bookedCount >= session.capacity;
                        const statusBadge = getSessionStatus(session.date, session.startTime);

                        return (
                            <div key={session.id} className="group relative bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all hover:shadow-md">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{session.racType}</h4>
                                    {statusBadge}
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                        <Clock size={12} /> {session.date} • {session.startTime}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} /> {session.location}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${(bookedCount / session.capacity) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={`font-bold ${isFull ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {bookedCount}/{session.capacity}
                                        </span>
                                    </div>
                                    {userRole !== UserRole.USER && !isFull && (
                                        <button 
                                            onClick={() => navigate('/booking')}
                                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                                        >
                                            Book <ChevronRight size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        {/* --- BOOKED EMPLOYEES TABLE (Right Col) --- */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <User size={20} className="text-purple-500" />
                    {t.dashboard.booked.title}
                </h3>
                
                <div className="flex gap-2">
                    {/* Small Filters for Table */}
                    <div className="relative group">
                        <select 
                            value={empFilterCompany}
                            onChange={(e) => setEmpFilterCompany(e.target.value)}
                            className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs rounded-lg py-1.5 pl-2 pr-6 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                        >
                            <option className="dark:bg-slate-800" value="All">{t.common.allCompanies}</option>
                            {companyList.map(c => <option className="dark:bg-slate-800" key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    
                    <div className="relative group">
                        <select 
                            value={empFilterRac}
                            onChange={(e) => setEmpFilterRac(e.target.value)}
                            className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs rounded-lg py-1.5 pl-2 pr-6 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                        >
                            <option className="dark:bg-slate-800" value="All">{t.common.allRacs}</option>
                            {racDefinitions.length > 0 ? (
                                racDefinitions.map(def => <option className="dark:bg-slate-800" key={def.code} value={def.code}>{def.code}</option>)
                            ) : (
                                RAC_KEYS.map(r => <option className="dark:bg-slate-800" key={r} value={r}>{r}</option>)
                            )}
                        </select>
                    </div>

                    <input 
                        type="date" 
                        className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs rounded-lg py-1.5 px-2 outline-none focus:ring-2 focus:ring-purple-500"
                        value={empFilterDate}
                        onChange={(e) => setEmpFilterDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0 z-10 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b border-slate-100 dark:border-slate-700">{t.dashboard.booked.tableEmployee}</th>
                            <th className="p-4 border-b border-slate-100 dark:border-slate-700">{t.dashboard.booked.tableRac}</th>
                            <th className="p-4 border-b border-slate-100 dark:border-slate-700">{t.dashboard.booked.tableDate}</th>
                            <th className="p-4 border-b border-slate-100 dark:border-slate-700 hidden sm:table-cell">{t.dashboard.booked.tableRoom}</th>
                            <th className="p-4 border-b border-slate-100 dark:border-slate-700">{t.dashboard.booked.tableTrainer}</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs text-slate-700 dark:text-slate-300">
                        {filteredBookingsTable.length > 0 ? (
                            filteredBookingsTable.map((booking) => {
                                const session = sessions.find(s => s.id === booking.sessionId);
                                const rac = session ? session.racType : booking.sessionId;
                                const date = session ? session.date : (booking.resultDate || '-');
                                const room = session ? session.location : '-';
                                const trainer = session ? session.instructor : '-';

                                return (
                                    <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{booking.employee.name}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{booking.employee.company}</div>
                                        </td>
                                        <td className="p-4 font-medium">{rac}</td>
                                        <td className="p-4">{date}</td>
                                        <td className="p-4 hidden sm:table-cell">{room}</td>
                                        <td className="p-4">{trainer}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                                    {t.dashboard.booked.noData}
                                </td>
                            </tr>
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
