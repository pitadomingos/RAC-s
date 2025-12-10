
import React, { useState, useEffect, useMemo } from 'react';
import DashboardStats from '../components/DashboardStats';
import { Booking, UserRole, EmployeeRequirement, TrainingSession } from '../types';
import { COMPANIES, RAC_KEYS } from '../constants';
import { Calendar, Clock, MapPin, ChevronRight, Filter, Timer, User, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
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
}

const Dashboard: React.FC<DashboardProps> = ({ 
  bookings, 
  requirements, 
  sessions, 
  userRole,
  onApproveAutoBooking,
  onRejectAutoBooking
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  // Trigger re-render every minute to update countdowns
  const [, setTick] = useState(0);

  // Pagination state for Auto-Booking Table
  const [abPage, setAbPage] = useState(1);
  const AB_ROWS_PER_PAGE = 5; // Kept compact to save dashboard vertical space

  // Filters for Employee Bookings Table
  const [empFilterCompany, setEmpFilterCompany] = useState<string>('All');
  const [empFilterRac, setEmpFilterRac] = useState<string>('All');
  const [empFilterDate, setEmpFilterDate] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter bookings based on selected company (for Stats)
  const filteredBookingsForStats = selectedCompany === 'All' 
    ? bookings 
    : bookings.filter(b => b.employee.company === selectedCompany);

  const filteredRequirements = selectedCompany === 'All'
    ? requirements
    : requirements.filter(r => {
        const empBooking = bookings.find(b => b.employee.id === r.employeeId);
        return empBooking ? empBooking.employee.company === selectedCompany : false; 
    });

  // Sort sessions by date (closest first) for the "Upcoming" view
  const upcomingSessions = [...sessions]
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
    .slice(0, 5);

  const getBookingCount = (sessionId: string) => {
    return bookings.filter(b => b.sessionId === sessionId).length;
  };

  const getSessionStatus = (dateStr: string, timeStr: string) => {
    try {
        const fullDateStr = `${dateStr}T${timeStr}`;
        const sessionDate = new Date(fullDateStr);
        const now = new Date();
        
        // Handle invalid dates gracefully
        if (isNaN(sessionDate.getTime())) return null;

        const diff = sessionDate.getTime() - now.getTime();

        if (diff <= 0) {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            Completed
            </span>
        );
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        // Ensure we don't display NaNs if calculation fails
        if (isNaN(days) || isNaN(hours) || isNaN(minutes)) return null;

        return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
            <Timer size={12} />
            {String(days)}d : {String(hours)}h : {String(minutes)}m left
        </span>
        );
    } catch (e) {
        return null;
    }
  };

  // Identify expiring bookings for the auto-fill feature
  const expiringBookings = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return bookings.filter(b => {
      if (!b.expiryDate) return false;
      const expDate = new Date(b.expiryDate);
      return expDate > today && expDate <= thirtyDaysFromNow;
    });
  }, [bookings]);

  // Identify auto-bookings waiting for approval
  const autoBookings = useMemo(() => {
      return bookings.filter(b => b.isAutoBooked);
  }, [bookings]);

  // Paginated Auto Bookings
  const paginatedAutoBookings = useMemo(() => {
      const start = (abPage - 1) * AB_ROWS_PER_PAGE;
      return autoBookings.slice(start, start + AB_ROWS_PER_PAGE);
  }, [autoBookings, abPage]);
  
  const totalAbPages = Math.ceil(autoBookings.length / AB_ROWS_PER_PAGE);

  const handleBookRenewals = () => {
      // Create new booking templates from expiring employees
      const renewalList = expiringBookings.map(b => ({
          id: uuidv4(),
          name: b.employee.name,
          recordId: b.employee.recordId,
          company: b.employee.company,
          department: b.employee.department,
          role: b.employee.role,
          driverLicenseNumber: b.employee.driverLicenseNumber || '',
          driverLicenseClass: b.employee.driverLicenseClass || '',
          driverLicenseExpiry: b.employee.driverLicenseExpiry || ''
      }));

      // Navigate to booking form with state
      navigate('/booking', { state: { prefill: renewalList } });
  };

  // --- Logic for Employee Bookings Table ---
  const employeeBookingsList = useMemo(() => {
    return bookings.map(b => {
      // Resolve Session Details
      const session = sessions.find(s => s.id === b.sessionId);
      
      let racName = b.sessionId;
      let sessionDate = '';
      let sessionRoom = 'TBD';

      if (session) {
        racName = session.racType;
        sessionDate = session.date;
        sessionRoom = session.location;
      } else {
         // Fallback for raw string IDs in mock data
         // If sessionId looks like "RAC01 - ...", use it as name
         if (b.sessionId.includes('RAC')) {
            racName = b.sessionId;
         }
      }

      // Simplify RAC name for filtering (e.g. "RAC 01 - Height" -> "RAC01")
      const racCode = racName.split(' - ')[0].replace(' ', '');

      return {
        ...b,
        racName,
        racCode,
        sessionDate,
        sessionRoom
      };
    });
  }, [bookings, sessions]);

  const filteredEmployeeBookings = employeeBookingsList.filter(item => {
    // Filter by Company
    if (empFilterCompany !== 'All' && item.employee.company !== empFilterCompany) return false;
    
    // Filter by RAC
    if (empFilterRac !== 'All' && item.racCode !== empFilterRac) return false;

    // Filter by Date
    if (empFilterDate && item.sessionDate !== empFilterDate) return false;

    return true;
  });

  const canManageAutoBookings = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t.dashboard.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select 
            value={selectedCompany} 
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm border p-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="All">All Companies</option>
            {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <DashboardStats 
        bookings={filteredBookingsForStats} 
        requirements={filteredRequirements} 
        onBookRenewals={handleBookRenewals}
      />

       {/* Auto-Booking Approval Table (Paginated) - Only visible to Admins */}
       {canManageAutoBookings && autoBookings.length > 0 && onApproveAutoBooking && onRejectAutoBooking && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-orange-200 dark:border-orange-900/50 overflow-hidden">
             <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800 flex justify-between items-center">
                 <div>
                     <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                        <Clock size={20} />
                        <h3 className="font-bold">Pending Auto-Bookings</h3>
                        <span className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs px-2 py-0.5 rounded-full font-bold">
                            {autoBookings.length}
                        </span>
                     </div>
                     <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
                        System generated schedules based on imminent expiry (7 days).
                     </p>
                 </div>
                 
                 {/* Pagination Controls */}
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
                     <thead className="bg-white dark:bg-slate-800">
                         <tr>
                             <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                             <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Session / RAC</th>
                             <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Scheduled Date</th>
                             <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Action</th>
                         </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-50 dark:divide-slate-700">
                         {paginatedAutoBookings.map(booking => {
                             const session = sessions.find(s => s.id === booking.sessionId);
                             return (
                                 <tr key={booking.id} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors">
                                     <td className="px-4 py-2">
                                         <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{booking.employee.name}</div>
                                         <div className="text-xs text-gray-400">{booking.employee.company}</div>
                                     </td>
                                     <td className="px-4 py-2">
                                         <div className="text-sm text-slate-600 dark:text-slate-300">
                                            {session ? session.racType : booking.sessionId}
                                         </div>
                                     </td>
                                     <td className="px-4 py-2">
                                         <div className="text-sm font-mono text-slate-600 dark:text-slate-300">
                                            {session ? session.date : 'TBD'}
                                         </div>
                                         <div className="text-xs text-gray-400">
                                            {session ? session.startTime : ''}
                                         </div>
                                     </td>
                                     <td className="px-4 py-2 text-right">
                                         <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => onApproveAutoBooking(booking.id)} 
                                                className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 transition-colors"
                                                title="Approve Booking"
                                            >
                                                <CheckCircle size={14} />
                                                <span className="text-xs font-bold">Approve</span>
                                            </button>
                                            <button 
                                                onClick={() => onRejectAutoBooking(booking.id)} 
                                                className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors"
                                                title="Reject & Delete"
                                            >
                                                <XCircle size={14} />
                                                <span className="text-xs font-bold">Reject</span>
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

      {/* Main Content Grid: Upcoming Sessions (Left) vs Employee Bookings (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column: Upcoming Sessions (Session Centric) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Calendar className="text-yellow-600 dark:text-yellow-500" size={20} />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t.dashboard.upcoming.title}</h3>
             </div>
             <button onClick={() => navigate('/schedule')} className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center hover:underline">
               {t.dashboard.upcoming.viewSchedule} <ChevronRight size={14} />
             </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-white dark:bg-slate-800">
                 <tr>
                   <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.date}</th>
                   <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.session}</th>
                   <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.capacity}</th>
                   <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.upcoming.status}</th>
                 </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {upcomingSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{String(session.date)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                         <Clock size={12} /> {String(session.startTime)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{String(session.racType)}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
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

        {/* Right Column: Employees Booked (Person Centric) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] transition-colors">
           <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                   <User className="text-blue-600 dark:text-blue-500" size={20} />
                   <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t.dashboard.booked.title}</h3>
                </div>
                <div className="text-xs text-gray-400">
                  {filteredEmployeeBookings.length} records
                </div>
             </div>
             
             {/* Filters for Employee Table */}
             <div className="flex flex-wrap gap-2">
                <select 
                   value={empFilterCompany}
                   onChange={(e) => setEmpFilterCompany(e.target.value)}
                   className="text-xs border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                >
                   <option value="All">All Companies</option>
                   {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select 
                   value={empFilterRac}
                   onChange={(e) => setEmpFilterRac(e.target.value)}
                   className="text-xs border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                >
                   <option value="All">All RACs</option>
                   {RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <input 
                   type="date"
                   value={empFilterDate}
                   onChange={(e) => setEmpFilterDate(e.target.value)}
                   className="text-xs border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                   placeholder="Filter Date"
                />
             </div>
           </div>

           <div className="overflow-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0 shadow-sm z-10">
                   <tr>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableEmployee}</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableRac}</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableDate}</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.dashboard.booked.tableRoom}</th>
                   </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                   {filteredEmployeeBookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                          {t.dashboard.booked.noData}
                        </td>
                      </tr>
                   ) : (
                      filteredEmployeeBookings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                           <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-500 dark:text-gray-400">
                             {String(item.employee.recordId)}
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap">
                             <div className="text-xs font-bold text-slate-800 dark:text-white">{String(item.employee.name)}</div>
                             <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]" title={item.employee.company}>{String(item.employee.company)}</div>
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap">
                             <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                               {String(item.racCode)}
                             </span>
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                             {item.sessionDate ? String(item.sessionDate) : <span className="text-gray-300 italic">--</span>}
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                             {item.sessionRoom ? String(item.sessionRoom) : <span className="text-gray-300 italic">--</span>}
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
