import React, { useState, useEffect, useMemo } from 'react';
import DashboardStats from '../components/DashboardStats';
import { Booking, UserRole, EmployeeRequirement } from '../types';
import { MOCK_SESSIONS, COMPANIES, RAC_KEYS } from '../constants';
import { Calendar, Clock, MapPin, ChevronRight, Filter, Timer, User, Search, Building } from 'lucide-react';

interface DashboardProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, requirements, userRole }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  // Trigger re-render every minute to update countdowns
  const [, setTick] = useState(0);

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
  const upcomingSessions = [...MOCK_SESSIONS]
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
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
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
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
            <Timer size={12} />
            {String(days)}d : {String(hours)}h : {String(minutes)}m left
        </span>
        );
    } catch (e) {
        return null;
    }
  };

  // --- Logic for Employee Bookings Table ---
  const employeeBookingsList = useMemo(() => {
    return bookings.map(b => {
      // Resolve Session Details
      const session = MOCK_SESSIONS.find(s => s.id === b.sessionId);
      
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
  }, [bookings]);

  const filteredEmployeeBookings = employeeBookingsList.filter(item => {
    // Filter by Company
    if (empFilterCompany !== 'All' && item.employee.company !== empFilterCompany) return false;
    
    // Filter by RAC
    if (empFilterRac !== 'All' && item.racCode !== empFilterRac) return false;

    // Filter by Date
    if (empFilterDate && item.sessionDate !== empFilterDate) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Operational Overview</h2>
          <p className="text-sm text-gray-500">Real-time safety training metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select 
            value={selectedCompany} 
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border-gray-300 rounded-lg text-sm border p-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="All">All Companies</option>
            {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <DashboardStats bookings={filteredBookingsForStats} requirements={filteredRequirements} />

      {/* Main Content Grid: Upcoming Sessions (Left) vs Employee Bookings (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column: Upcoming Sessions (Session Centric) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-gray-50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Calendar className="text-yellow-600" size={20} />
                <h3 className="font-bold text-slate-800 text-lg">Upcoming Sessions</h3>
             </div>
             <button className="text-xs text-blue-600 font-semibold flex items-center hover:underline">
               View Schedule <ChevronRight size={14} />
             </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                 <tr>
                   <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date / Time</th>
                   <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Session Info</th>
                   <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity</th>
                   <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{session.date}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                         <Clock size={12} /> {session.startTime}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-slate-700">{session.racType}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {session.location}</span>
                        <span className="flex items-center gap-1"><User size={12} /> {session.instructor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                           {getBookingCount(session.id)}/{session.capacity}
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
           <div className="px-6 py-4 border-b border-slate-200 bg-gray-50">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                   <User className="text-blue-600" size={20} />
                   <h3 className="font-bold text-slate-800 text-lg">Employees Booked</h3>
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
                   className="text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                >
                   <option value="All">All Companies</option>
                   {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select 
                   value={empFilterRac}
                   onChange={(e) => setEmpFilterRac(e.target.value)}
                   className="text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                >
                   <option value="All">All RACs</option>
                   {RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <input 
                   type="date"
                   value={empFilterDate}
                   onChange={(e) => setEmpFilterDate(e.target.value)}
                   className="text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1"
                   placeholder="Filter Date"
                />
             </div>
           </div>

           <div className="overflow-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 shadow-sm z-10">
                   <tr>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">ID</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee / Company</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">RAC Booked</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                     <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Room</th>
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   {filteredEmployeeBookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                          No bookings matching filters
                        </td>
                      </tr>
                   ) : (
                      filteredEmployeeBookings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                           <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-500">
                             {item.employee.recordId}
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap">
                             <div className="text-xs font-bold text-slate-800">{item.employee.name}</div>
                             <div className="text-[10px] text-gray-500 truncate max-w-[120px]" title={item.employee.company}>{item.employee.company}</div>
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap">
                             <span className="text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                               {item.racCode}
                             </span>
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                             {item.sessionDate || <span className="text-gray-300 italic">--</span>}
                           </td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                             {item.sessionRoom || <span className="text-gray-300 italic">--</span>}
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