
import React, { useState, useEffect, useMemo } from 'react';
import { Employee, BookingStatus, Booking, UserRole, TrainingSession, SystemNotification } from '../types';
import { COMPANIES, DEPARTMENTS, ROLES } from '../constants';
import { Plus, Trash2, Save, Settings, ShieldCheck, Calendar, UserPlus, FileSignature, CheckCircle2, AlertCircle, Search, UserCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom';
import { sanitizeInput } from '../utils/security';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingFormProps {
  addBookings: (newBookings: Booking[]) => void;
  sessions: TrainingSession[];
  userRole: UserRole;
  existingBookings?: Booking[];
  addNotification?: (notification: SystemNotification) => void; 
}

const BookingForm: React.FC<BookingFormProps> = ({ addBookings, sessions, userRole, existingBookings = [], addNotification }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [selectedSession, setSelectedSession] = useState('');
  
  const canManageSessions = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN;

  const initialRows = Array.from({ length: 5 }).map(() => ({
    id: uuidv4(),
    name: '',
    recordId: '',
    company: COMPANIES[0],
    department: DEPARTMENTS[0],
    role: ROLES[0],
    driverLicenseNumber: '',
    driverLicenseClass: '',
    driverLicenseExpiry: ''
  }));

  const [rows, setRows] = useState(initialRows);
  const [submitted, setSubmitted] = useState(false);

  // Build a lookup map of existing employees for auto-population
  const employeeLookup = useMemo(() => {
      const map = new Map<string, Employee>();
      existingBookings.forEach(b => {
          if (b.employee && b.employee.recordId) {
              const key = b.employee.recordId.trim().toLowerCase();
              if (key && !map.has(key)) {
                  map.set(key, b.employee);
              }
          }
      });
      return map;
  }, [existingBookings]);

  useEffect(() => {
    if (location.state && location.state.prefill) {
        setRows(location.state.prefill);
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  const sessionData = sessions.find(s => s.id === selectedSession);
  const isRac02Selected = sessionData?.racType.includes('RAC02') || sessionData?.racType.includes('RAC 02');

  const handleRowChange = (index: number, field: keyof Employee, value: string) => {
    const safeValue = (field === 'name' || field === 'recordId' || field === 'driverLicenseNumber' || field === 'driverLicenseClass') 
        ? sanitizeInput(value) 
        : value;

    const newRows = [...rows];
    // @ts-ignore
    newRows[index][field] = safeValue;
    setRows(newRows);
  };

  const handleIdBlur = (index: number) => {
      const enteredId = rows[index].recordId.trim().toLowerCase();
      if (!enteredId) return;

      const match = employeeLookup.get(enteredId);
      if (match) {
          const newRows = [...rows];
          newRows[index] = {
              ...newRows[index],
              name: match.name,
              company: match.company,
              department: match.department,
              role: match.role,
              driverLicenseNumber: match.driverLicenseNumber || newRows[index].driverLicenseNumber,
              driverLicenseClass: match.driverLicenseClass || newRows[index].driverLicenseClass,
              driverLicenseExpiry: match.driverLicenseExpiry || newRows[index].driverLicenseExpiry
          };
          setRows(newRows);
      }
  };

  const addRow = () => {
    setRows([...rows, {
      id: uuidv4(),
      name: '',
      recordId: '',
      company: COMPANIES[0],
      department: DEPARTMENTS[0],
      role: ROLES[0],
      driverLicenseNumber: '',
      driverLicenseClass: '',
      driverLicenseExpiry: ''
    }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !sessionData) {
      alert("Please select a training session.");
      return;
    }

    const hasPartialRows = rows.some(r => 
        (r.recordId.trim() !== '' && r.name.trim() === '') || 
        (r.recordId.trim() === '' && r.name.trim() !== '')
    );

    if (hasPartialRows) {
        alert("Found incomplete rows. Please ensure all employees have both an ID and a Name.");
        return;
    }

    const validRows = rows.filter(r => r.name.trim() !== '' && r.recordId.trim() !== '');

    if (validRows.length === 0) {
      alert("Please enter at least one employee.");
      return;
    }

    if (isRac02Selected) {
        const incompleteDl = validRows.find(r => !r.driverLicenseNumber || !r.driverLicenseClass || !r.driverLicenseExpiry);
        if (incompleteDl) {
            alert(`Driver License details are mandatory for RAC 02 bookings.\n\nPlease complete details for: ${incompleteDl.name}`);
            return;
        }
    }

    // 1. Check Capacity
    const currentBookingsCount = existingBookings.filter(b => b.sessionId === selectedSession).length;
    const availableSlots = sessionData.capacity - currentBookingsCount;
    const requestedSlots = validRows.length;

    let finalBookings: Booking[] = [];
    let overflowEmployees: Employee[] = [];

    if (requestedSlots > availableSlots) {
        // We have overflow
        const fittingRows = validRows.slice(0, availableSlots);
        const extraRows = validRows.slice(availableSlots);
        
        // Prepare valid bookings
        fittingRows.forEach(row => {
             finalBookings.push({
                id: uuidv4(),
                sessionId: selectedSession,
                employee: { ...row },
                status: BookingStatus.PENDING,
            });
        });

        overflowEmployees = extraRows.map(r => ({ ...r }));
    } else {
        // All fit
        finalBookings = validRows.map(row => ({
            id: uuidv4(),
            sessionId: selectedSession,
            employee: { ...row },
            status: BookingStatus.PENDING,
        }));
    }

    // 2. Check Duplicates (One booking per RAC type per person)
    const uniqueBookings = finalBookings.filter(newBooking => {
        // Check if employee has a pending or passed booking for THIS RAC type (even if different session ID)
        const duplicate = existingBookings.find(b => {
            if (b.employee.recordId.toLowerCase() !== newBooking.employee.recordId.toLowerCase()) return false;
            
            // Resolve RAC Type of existing booking
            const existingSession = sessions.find(s => s.id === b.sessionId);
            const bRacType = existingSession ? existingSession.racType : (b.sessionId.includes(sessionData.racType) ? sessionData.racType : '');
            
            if (bRacType === sessionData.racType && (b.status === BookingStatus.PENDING || b.status === BookingStatus.PASSED)) {
                return true;
            }
            return false;
        });

        if (duplicate) {
            alert(`${t.notifications.duplicateMsg}: ${newBooking.employee.name} (${sessionData.racType})`);
            return false;
        }
        return true;
    });

    // 3. Process Overflow (Find next session)
    if (overflowEmployees.length > 0) {
        // Find next session of same RAC type, after today
        const nextSession = sessions
            .filter(s => s.racType === sessionData.racType && s.id !== selectedSession && new Date(s.date) > new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        if (nextSession) {
            overflowEmployees.forEach(emp => {
                 // Check dupes for overflow too
                 const existing = existingBookings.find(b => b.employee.recordId === emp.recordId && b.sessionId === nextSession.id);
                 if (!existing) {
                     uniqueBookings.push({
                        id: uuidv4(),
                        sessionId: nextSession.id,
                        employee: emp,
                        status: BookingStatus.PENDING
                     });
                 }
            });
            
            if (addNotification) {
                addNotification({
                    id: uuidv4(),
                    type: 'warning',
                    title: t.notifications.capacityTitle,
                    message: `${overflowEmployees.length} ${t.notifications.capacityMsg} ${nextSession.date}.`,
                    timestamp: new Date(),
                    isRead: false
                });
            }
            alert(`Note: Session full. ${overflowEmployees.length} employees were auto-booked to next available session: ${nextSession.date}.`);
        } else {
            alert(`Session Full! Could not find a future session for ${overflowEmployees.length} employees. Please contact Admin.`);
        }
    }

    if (uniqueBookings.length > 0) {
        try {
            addBookings(uniqueBookings);
            logger.audit('Manual Booking Submitted', userRole, { count: uniqueBookings.length, session: selectedSession });

            setSubmitted(true);
            
            // Notify User
            if (addNotification) {
                addNotification({
                    id: uuidv4(),
                    type: 'success',
                    title: 'Booking Confirmed',
                    message: `Successfully booked ${uniqueBookings.length} employees.`,
                    timestamp: new Date(),
                    isRead: false
                });
            }

            setTimeout(() => setSubmitted(false), 3000);
            setRows(initialRows);
            setSelectedSession('');
        } catch (err) {
            logger.error('Error submitting booking', err);
            alert('An error occurred while processing the booking.');
        }
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in-up">
      {/* Header Command Center */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <FileSignature size={300} />
         </div>
         <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-500/20 rounded-lg backdrop-blur-sm border border-yellow-500/30">
                    <UserPlus size={28} className="text-yellow-500" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                      {t.booking.title}
                  </h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl flex items-center gap-2 font-medium">
                  <ShieldCheck size={16} className="text-green-400" />
                  {t.booking.secureMode}
               </p>
            </div>
            
            {canManageSessions && (
                <button 
                    onClick={() => navigate('/settings')}
                    className="group bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-sm font-bold border border-slate-700 hover:border-slate-600 flex items-center gap-3 transition-all"
                >
                    <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>{t.booking.manageSchedule}</span>
                </button>
            )}
         </div>
      </div>

      {/* Success Notification */}
      {submitted && (
        <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 animate-bounce-in">
            <CheckCircle2 size={24} className="text-white" />
            <span className="font-bold text-lg">{t.booking.success}</span>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            
            {/* Session Selector Zone */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
               <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 ml-1">
                  <Calendar size={14} />
                  {t.booking.selectSession}
               </label>
               
               <div className="relative group">
                   <select 
                      value={selectedSession} 
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl shadow-sm focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 p-4 pl-5 text-xl font-bold transition-all appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-500"
                      required
                    >
                      <option value="">-- {t.booking.chooseSession} --</option>
                      {sessions.map(session => {
                        const count = existingBookings.filter(b => b.sessionId === session.id).length;
                        const isFull = count >= session.capacity;
                        const langLabel = session.sessionLanguage === 'English' ? 'Eng' : 'Port';
                        const displayLang = session.sessionLanguage ? `[${langLabel}]` : '';
                        
                        return (
                            <option key={session.id} value={session.id} disabled={isFull && false} className={isFull ? 'text-red-500' : ''}>
                            {session.racType} {displayLang} • {session.date} • {session.location} • (Cap: {count}/{session.capacity}) {isFull ? '(FULL)' : ''}
                            </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Calendar size={24} />
                    </div>
               </div>

                {isRac02Selected && (
                    <div className="mt-4 flex items-start gap-3 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-900/50 animate-fade-in-down">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Critical Requirement</p>
                            <p className="text-xs opacity-90">{t.booking.dlRequired}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* High-Density Input Grid */}
            <div className="p-4 md:p-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-12 rounded-l-lg">#</th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-36">
                        {t.common.id} <span className="text-yellow-500">*</span>
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-32">{t.common.name}</th>
                    
                    {/* CONDITIONAL DL COLUMNS - BETWEEN NAME AND COMPANY */}
                    {isRac02Selected && (
                      <>
                        <th className="px-2 py-3 text-left text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider w-24">DL Num <span className="text-red-600">*</span></th>
                        <th className="px-2 py-3 text-left text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider w-16">Class <span className="text-red-600">*</span></th>
                        <th className="px-2 py-3 text-left text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider w-28">Expiry <span className="text-red-600">*</span></th>
                      </>
                    )}

                    <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-40">{t.common.company}</th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-36">{t.common.department}</th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-32">{t.common.role}</th>
                    
                    <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-12 rounded-r-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    // Check if current ID exists in DB
                    const isKnownId = !!(row.recordId && employeeLookup.has(row.recordId.toLowerCase()));

                    return (
                    <tr key={row.id} className="group transition-transform duration-200 hover:scale-[1.002]">
                      
                      {/* Row Number */}
                      <td className="align-middle">
                          <div className="w-6 h-6 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-400 flex items-center justify-center font-bold text-[10px] border border-slate-200 dark:border-slate-600">
                              {index + 1}
                          </div>
                      </td>
                      
                      {/* ID Field (Auto-Pop Trigger) */}
                      <td className="px-2 py-2">
                        <div className="relative">
                            <input 
                              type="text" 
                              className={`w-full border rounded-lg px-3 py-2 text-xs font-mono transition-all outline-none
                                ${isKnownId 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 text-green-700 dark:text-green-300 focus:ring-2 focus:ring-green-500' 
                                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500'
                                }`}
                              placeholder="Search ID..."
                              value={row.recordId}
                              onChange={(e) => handleRowChange(index, 'recordId', e.target.value)}
                              onBlur={() => handleIdBlur(index)}
                            />
                            {/* Visual indicator for search/found */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                {isKnownId ? (
                                    <UserCheck size={14} className="text-green-500" />
                                ) : (
                                    <Search size={12} className="text-slate-300" />
                                )}
                            </div>
                        </div>
                      </td>

                      {/* Name Field */}
                      <td className="px-2 py-2">
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                          placeholder={t.common.name}
                          value={row.name}
                          onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                          disabled={isKnownId}
                        />
                      </td>

                      {/* CONDITIONAL DL INPUTS - BETWEEN NAME AND COMPANY */}
                      {isRac02Selected && (
                        <>
                          <td className="px-1 py-2">
                             <input 
                                type="text" 
                                className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-red-300 focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="Num"
                                value={row.driverLicenseNumber}
                                onChange={(e) => handleRowChange(index, 'driverLicenseNumber', e.target.value)}
                              />
                          </td>
                          <td className="px-1 py-2">
                              <input 
                                type="text" 
                                className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-red-300 focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="Cls"
                                value={row.driverLicenseClass}
                                onChange={(e) => handleRowChange(index, 'driverLicenseClass', e.target.value)}
                              />
                          </td>
                          <td className="px-1 py-2">
                              <input 
                                type="date" 
                                className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-red-500 outline-none"
                                value={row.driverLicenseExpiry}
                                onChange={(e) => handleRowChange(index, 'driverLicenseExpiry', e.target.value)}
                              />
                          </td>
                        </>
                      )}

                      {/* Company Select */}
                      <td className="px-2 py-2">
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer truncate disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={row.company}
                          onChange={(e) => handleRowChange(index, 'company', e.target.value)}
                          disabled={isKnownId}
                        >
                          {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>

                      {/* Department Select */}
                      <td className="px-2 py-2">
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer truncate disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={row.department}
                          onChange={(e) => handleRowChange(index, 'department', e.target.value)}
                          disabled={isKnownId}
                        >
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </td>

                      {/* Role Select */}
                      <td className="px-2 py-2">
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer truncate disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={row.role}
                          onChange={(e) => handleRowChange(index, 'role', e.target.value)}
                          disabled={isKnownId}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>

                      <td className="px-2 py-2 text-center">
                        <button 
                          type="button"
                          onClick={() => removeRow(index)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Remove Row"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Footer Actions */}
            <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50 dark:bg-slate-800/50">
              <button 
                type="button" 
                onClick={addRow}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold px-6 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all shadow-sm hover:shadow-md"
              >
                <Plus size={20} />
                <span>{t.booking.addRow}</span>
              </button>

              <button 
                type="submit"
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 text-lg px-10 py-4 rounded-2xl font-black shadow-xl shadow-yellow-500/20 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <Save size={24} />
                <span>{t.booking.submitBooking}</span>
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default BookingForm;