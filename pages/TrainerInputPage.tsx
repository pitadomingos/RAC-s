
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, RAC, TrainingSession, UserRole, RacDef } from '../types';
import { Save, AlertCircle, CheckCircle, Lock, Users, ClipboardList, ShieldAlert, UserCheck, GraduationCap, CheckCircle2, Search, CheckSquare, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { addMonths, format } from 'date-fns';

interface TrainerInputPageProps {
  bookings: Booking[];
  updateBookings: (updates: Booking[]) => void;
  sessions: TrainingSession[];
  userRole?: UserRole;
  currentUserName?: string;
  racDefinitions: RacDef[];
}

const TrainerInputPage: React.FC<TrainerInputPageProps> = ({ 
  bookings, 
  updateBookings, 
  sessions,
  userRole = UserRole.SYSTEM_ADMIN,
  currentUserName = '',
  racDefinitions
}) => {
  const { t } = useLanguage();
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [sessionBookings, setSessionBookings] = useState<Booking[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // --- SECURITY FILTER & PENDING LOGIC ---
  const availableSessions = useMemo(() => {
      // 1. Filter by Instructor (If Trainer)
      let relevantSessions = sessions;
      if (userRole === UserRole.RAC_TRAINER) {
          relevantSessions = sessions.filter(s => s.instructor === currentUserName);
      }

      // 2. Filter by "Pending Marking"
      // A session is considered "Pending" if it has at least one booking with status PENDING.
      // Sessions with NO bookings or ALL completed bookings are hidden.
      return relevantSessions.filter(session => {
          const sessionBookings = bookings.filter(b => b.sessionId === session.id);
          
          if (sessionBookings.length === 0) return false; // Empty session, nothing to mark

          const hasPending = sessionBookings.some(b => b.status === BookingStatus.PENDING);
          return hasPending;
      });
  }, [sessions, bookings, userRole, currentUserName]);

  // When session changes, load bookings into local state
  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSelectedSessionId(sId);
    if (sId) {
      const filtered = bookings.filter(b => b.sessionId === sId && b.status === BookingStatus.PENDING);
      const initialized = filtered.map(b => ({
        ...b,
        attendance: b.attendance ?? false,
        theoryScore: b.theoryScore ?? 0,
        practicalScore: b.practicalScore ?? 0,
        driverLicenseVerified: b.driverLicenseVerified ?? false
      }));
      setSessionBookings(initialized);
    } else {
      setSessionBookings([]);
    }
    setHasUnsavedChanges(false);
    setSuccessMsg('');
    setStudentSearch('');
  };

  // Helper: Auto-calculate Status
  const calculateStatus = (booking: Booking, isRac02: boolean): BookingStatus => {
    if (!booking.attendance) return BookingStatus.FAILED;
    if (isRac02) {
      if (!booking.driverLicenseVerified) return BookingStatus.FAILED;
    }
    const theory = booking.theoryScore || 0;
    const practical = booking.practicalScore || 0;

    if (isRac02) {
      if (theory < 70) return BookingStatus.FAILED;
      if (practical < 70) return BookingStatus.FAILED;
      return BookingStatus.PASSED;
    }
    if (theory >= 70) return BookingStatus.PASSED;
    return BookingStatus.FAILED;
  };

  const handleInputChange = (id: string, field: keyof Booking, value: any) => {
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    const isRac02 = selectedSession?.racType.includes('RAC 02') || selectedSession?.racType.includes('RAC02') || false;

    setSessionBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updatedBooking = { ...b, [field]: value };
      
      // Auto-logic for RAC02: If Theory fail, Practical is 0/Locked visually
      if (isRac02 && field === 'theoryScore') {
        const score = parseInt(value) || 0;
        if (score < 70) updatedBooking.practicalScore = 0;
      }
      
      updatedBooking.status = calculateStatus(updatedBooking, isRac02);
      return updatedBooking;
    }));
    setHasUnsavedChanges(true);
  };

  const handleBulkAttendance = () => {
      const selectedSession = sessions.find(s => s.id === selectedSessionId);
      const isRac02 = selectedSession?.racType.includes('RAC 02') || selectedSession?.racType.includes('RAC02') || false;

      setSessionBookings(prev => prev.map(b => {
          const updated = { ...b, attendance: true };
          updated.status = calculateStatus(updated, isRac02);
          return updated;
      }));
      setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Inject Expiry Dates for Passed Records
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    const sessionDateStr = selectedSession?.date || new Date().toISOString().split('T')[0];
    
    // Find the RAC definition to get dynamic validity
    let racValidity = 24; // Default
    if (selectedSession) {
        // Try to match exact RAC Type name (e.g. "RAC 01 - ...")
        const foundRac = racDefinitions.find(r => r.name === selectedSession.racType);
        if (foundRac && foundRac.validityMonths) {
            racValidity = foundRac.validityMonths;
        } else {
            // Try to match code (e.g. "RAC01") by splitting session racType
            const code = selectedSession.racType.split(' - ')[0].replace(/\s/g, '');
            const foundByCode = racDefinitions.find(r => r.code === code);
            if (foundByCode && foundByCode.validityMonths) {
                racValidity = foundByCode.validityMonths;
            }
        }
    }

    // Calculate Expiry Date (Session Date + Validity Months)
    let expiryDateStr = '';
    try {
        const d = new Date(sessionDateStr);
        expiryDateStr = format(addMonths(d, racValidity), 'yyyy-MM-dd');
    } catch(e) {
        expiryDateStr = sessionDateStr; // Fallback
    }

    const bookingsToSave = sessionBookings.map(b => {
        if (b.status === BookingStatus.PASSED) {
            return { 
                ...b, 
                resultDate: sessionDateStr, 
                expiryDate: expiryDateStr 
            };
        }
        return b;
    });

    updateBookings(bookingsToSave);
    
    // Remove processed bookings from the local list since they are no longer "Pending"
    // But we might want to keep showing them momentarily to confirm.
    // However, if we refresh the list from props, they will disappear because filter checks for PENDING.
    
    setSuccessMsg(String(t.booking.success).replace('Booking submitted', 'Results saved'));
    setHasUnsavedChanges(false);
    
    // After a short delay, refresh the view (which will likely clear the table as they are no longer pending)
    setTimeout(() => {
        setSuccessMsg('');
        setSelectedSessionId(''); // Force reset
        setSessionBookings([]);
    }, 1500);
  };

  const selectedSessionDetails = sessions.find(s => s.id === selectedSessionId);
  const isRac02 = selectedSessionDetails?.racType.includes('RAC 02') || selectedSessionDetails?.racType.includes('RAC02');

  const filteredStudents = useMemo(() => {
      if (!studentSearch) return sessionBookings;
      return sessionBookings.filter(b => 
          b.employee.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          b.employee.recordId.toLowerCase().includes(studentSearch.toLowerCase())
      );
  }, [sessionBookings, studentSearch]);

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      
      {/* Header Command Center */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden border border-slate-700">
         <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <GraduationCap size={200} />
         </div>
         <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <ClipboardList size={32} className="text-yellow-500" />
                        {t.trainer.title}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm flex items-center gap-2">
                        <UserCheck size={16} />
                        {t.trainer.loggedInAs} <span className="text-white font-bold">{currentUserName || 'Admin'}</span>
                    </p>
                </div>
                
                {selectedSessionId && (
                    <div className="flex gap-4">
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm text-center min-w-[100px]">
                            <div className="text-2xl font-bold">{sessionBookings.length}</div>
                            <div className="text-[10px] uppercase text-slate-400 font-bold">Pending</div>
                        </div>
                        <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30 backdrop-blur-sm text-center min-w-[100px]">
                            <div className="text-2xl font-bold text-green-400">{sessionBookings.filter(b => b.status === 'Passed').length}</div>
                            <div className="text-[10px] uppercase text-green-300 font-bold">Passed</div>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden p-6 md:p-8">
          {/* Session Selector */}
          <div className="mb-8 max-w-2xl mx-auto">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center">{t.trainer.selectSession}</label>
            {availableSessions.length === 0 ? (
                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-200 flex items-center justify-center gap-2">
                    <AlertCircle size={16} />
                    <span>{t.trainer.noSessions}</span>
                </div>
            ) : (
                <div className="relative group">
                    <select 
                        value={selectedSessionId} 
                        onChange={handleSessionChange}
                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-4 pl-12 text-lg font-medium appearance-none cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-600"
                    >
                        <option value="">{t.trainer.chooseSession}</option>
                        {availableSessions.map(session => (
                            <option key={session.id} value={session.id}>
                            {session.racType} • {session.date} • {session.location}
                            </option>
                        ))}
                    </select>
                    <ClipboardList className="absolute left-4 top-4.5 text-slate-400 group-hover:text-yellow-500 transition-colors" size={24} />
                </div>
            )}
          </div>

          {selectedSessionId && sessionBookings.length > 0 ? (
            <div className="space-y-4">
                {/* Classroom Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find student..." 
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black dark:text-white"
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={handleBulkAttendance}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
                    >
                        <CheckSquare size={16} />
                        Mark All Present
                    </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700 md:sticky md:top-0 z-10">
                    <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.trainer.table.employee}</th>
                        {/* NEW COLUMNS */}
                        <th className="px-4 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">{t.common.company}</th>
                        <th className="px-4 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">{t.common.department}</th>
                        <th className="px-4 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">{t.common.jobTitle}</th>
                        
                        <th className="px-4 py-4 text-center text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider w-24">{t.trainer.table.attendance}</th>
                        {isRac02 && <th className="px-4 py-4 text-center text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider w-28 bg-red-50 dark:bg-red-900/20">{t.trainer.table.dlCheck}</th>}
                        <th className="px-4 py-4 text-center text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider w-32">{t.trainer.table.theory}</th>
                        <th className="px-4 py-4 text-center text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider w-32">{t.trainer.table.practical}</th>
                        <th className="px-4 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider w-40">{t.trainer.table.status}</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredStudents.map((booking) => {
                        const theory = booking.theoryScore || 0;
                        const practicalLocked = isRac02 && theory < 70;
                        const isDisqualified = isRac02 && !booking.driverLicenseVerified;

                        return (
                        <tr key={booking.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                            <td className="px-4 py-4">
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{booking.employee.name}</div>
                                <div className="text-xs text-slate-500 font-mono">{booking.employee.recordId}</div>
                                {/* Mobile-only extra info */}
                                <div className="md:hidden text-[10px] text-slate-400 mt-1">
                                    {booking.employee.company} • {booking.employee.role}
                                </div>
                            </td>
                            
                            {/* NEW COLUMNS DATA */}
                            <td className="px-4 py-4 hidden md:table-cell text-xs text-slate-600 dark:text-slate-300">
                                {booking.employee.company}
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell text-xs text-slate-600 dark:text-slate-300">
                                {booking.employee.department}
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell text-xs text-slate-600 dark:text-slate-300">
                                {booking.employee.role}
                            </td>

                            <td className="px-4 py-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={booking.attendance || false} onChange={(e) => handleInputChange(booking.id, 'attendance', e.target.checked)} />
                                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            </td>
                            
                            {isRac02 && (
                                <td className="px-4 py-4 text-center bg-red-50/30 dark:bg-red-900/10">
                                    <input 
                                        type="checkbox" 
                                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-red-300 rounded cursor-pointer"
                                        checked={booking.driverLicenseVerified || false}
                                        onChange={(e) => handleInputChange(booking.id, 'driverLicenseVerified', e.target.checked)}
                                    />
                                </td>
                            )}

                            <td className="px-4 py-4">
                            <input 
                                type="number" 
                                min="0" max="100"
                                disabled={isDisqualified}
                                className={`w-full text-center border-2 rounded-lg shadow-sm text-lg font-bold p-2 outline-none focus:ring-2 focus:ring-offset-1 transition-all
                                ${isDisqualified 
                                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 border-slate-200 dark:border-slate-600' 
                                    : (booking.theoryScore || 0) < 70 
                                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 focus:ring-red-500' 
                                        : 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-700 focus:ring-green-500'
                                }
                                `}
                                value={booking.theoryScore}
                                onChange={(e) => handleInputChange(booking.id, 'theoryScore', parseInt(e.target.value) || 0)}
                            />
                            </td>
                            <td className="px-4 py-4 relative">
                            <input 
                                type="number" 
                                min="0" max="100"
                                disabled={!isRac02 || practicalLocked || isDisqualified}
                                className={`w-full text-center border-2 rounded-lg shadow-sm text-lg font-bold p-2 outline-none focus:ring-2 focus:ring-offset-1 transition-all
                                ${!isRac02 
                                    ? 'bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 border-slate-200 dark:border-slate-600' 
                                    : practicalLocked 
                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed border-slate-200' 
                                        : (booking.practicalScore || 0) < 70 
                                            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 focus:ring-red-500' 
                                            : 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-700 focus:ring-green-500'
                                }
                                `}
                                value={booking.practicalScore}
                                onChange={(e) => handleInputChange(booking.id, 'practicalScore', parseInt(e.target.value) || 0)}
                            />
                            {(practicalLocked || (!isRac02 && !booking.practicalScore)) && isRac02 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                <Lock size={14} className="text-slate-500" />
                                </div>
                            )}
                            </td>
                            <td className="px-4 py-4">
                            <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-black rounded-full shadow-sm border
                                ${booking.status === BookingStatus.PASSED ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
                                    booking.status === BookingStatus.FAILED ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 
                                    'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'}`}>
                                {booking.status.toUpperCase()}
                            </span>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-4 md:sticky md:bottom-0 z-10">
                 {successMsg && (
                    <span className="text-green-600 font-bold text-sm animate-pulse flex items-center gap-2">
                        <CheckCircle2 size={16} /> {successMsg}
                    </span>
                 )}
                 <button 
                   onClick={handleSave}
                   disabled={!hasUnsavedChanges}
                   className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105
                     ${hasUnsavedChanges ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'}
                   `}
                 >
                   <Save size={20} />
                   <span>{t.trainer.saveResults}</span>
                 </button>
              </div>
            </div>
          ) : (
             <div className="text-center py-20 text-slate-400">
                 <div className="bg-slate-50 dark:bg-slate-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-600">
                    <ClipboardList size={40} className="text-slate-300 dark:text-slate-500" />
                 </div>
                 <p className="font-medium">
                    {availableSessions.length === 0 
                        ? "No pending sessions found assigned to you."
                        : "Select a pending session to begin grading."}
                 </p>
             </div>
          )}
      </div>
    </div>
  );
};

export default TrainerInputPage;
