
import React, { useState, useEffect, useMemo } from 'react';
import { Employee, BookingStatus, Booking, UserRole, TrainingSession, SystemNotification, EmployeeRequirement, RacDef } from '../types';
import { COMPANIES, DEPARTMENTS, ROLES } from '../constants';
import { Plus, Trash2, Save, Settings, ShieldCheck, Calendar, UserPlus, FileSignature, CheckCircle2, AlertCircle, Search, UserCheck, RefreshCw, Lock, Layers } from 'lucide-react';
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
  currentEmployeeId?: string;
  requirements?: EmployeeRequirement[];
  racDefinitions: RacDef[];
}

interface RenewalBatch {
    racType: string;
    employees: Employee[];
}

const BookingForm: React.FC<BookingFormProps> = ({ addBookings, sessions, userRole, existingBookings = [], addNotification, currentEmployeeId, requirements = [], racDefinitions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [selectedSession, setSelectedSession] = useState('');
  
  // -- QUEUE STATE --
  const [targetRac, setTargetRac] = useState<string>('');
  const [renewalQueue, setRenewalQueue] = useState<RenewalBatch[]>([]);
  
  const canManageSessions = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN;
  const isSelfService = userRole === UserRole.USER;

  const initialRows = Array.from({ length: isSelfService ? 1 : 5 }).map(() => ({
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

  // Build lookup
  const employeeLookup = useMemo(() => {
      const map = new Map<string, Employee>();
      existingBookings.forEach(b => {
          if (b.employee && b.employee.recordId) {
              const key = b.employee.recordId.trim().toLowerCase();
              if (key && !map.has(key)) map.set(key, b.employee);
              map.set(b.employee.id, b.employee);
          }
      });
      return map;
  }, [existingBookings]);

  // Filter available sessions
  const availableSessions = useMemo(() => {
      if (isSelfService && currentEmployeeId) {
          const myReq = requirements.find(r => r.employeeId === currentEmployeeId);
          if (!myReq) return [];
          return sessions.filter(session => {
              const racKey = session.racType.split(' - ')[0].replace(/\s+/g, '');
              return myReq.requiredRacs[racKey] === true;
          });
      }
      return sessions;
  }, [sessions, isSelfService, currentEmployeeId, requirements]);

  useEffect(() => {
    const state = location.state as { prefill?: any[]; targetRac?: string; remainingBatches?: RenewalBatch[] } | null;
    if (state) {
        if (state.prefill) setRows(state.prefill);
        if (state.targetRac) setTargetRac(state.targetRac);
        if (state.remainingBatches) setRenewalQueue(state.remainingBatches);
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
      if (isSelfService && currentEmployeeId) {
          const found = employeeLookup.get(currentEmployeeId) || 
                        Array.from(employeeLookup.values()).find((e: Employee) => e.id === currentEmployeeId);
          
          if (found) {
              setRows([{ 
                  ...found, 
                  id: uuidv4(),
                  driverLicenseNumber: found.driverLicenseNumber || '',
                  driverLicenseClass: found.driverLicenseClass || '',
                  driverLicenseExpiry: found.driverLicenseExpiry || ''
              }]); 
          }
      }
  }, [isSelfService, currentEmployeeId, employeeLookup]);

  const sessionData = availableSessions.find(s => s.id === selectedSession);
  
  // DYNAMIC REQUIREMENT CHECK
  const isDlRequired = useMemo(() => {
      if (!sessionData) return false;
      // Match session type to RAC Definition
      // Try by full name or code
      const racCode = sessionData.racType.split(' - ')[0].replace(/\s/g, '');
      const def = racDefinitions.find(r => r.name === sessionData.racType || r.code === racCode);
      return def ? !!def.requiresDriverLicense : false;
  }, [sessionData, racDefinitions]);

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

  const loadNextBatch = () => {
      if (renewalQueue.length === 0) return;
      const nextBatch = renewalQueue[0];
      const newQueue = renewalQueue.slice(1);

      setRows(nextBatch.employees.map(e => ({
          ...e,
          driverLicenseNumber: e.driverLicenseNumber || '',
          driverLicenseClass: e.driverLicenseClass || '',
          driverLicenseExpiry: e.driverLicenseExpiry || ''
      })));
      setTargetRac(nextBatch.racType);
      setRenewalQueue(newQueue);
      setSelectedSession('');
      alert(`Batch Saved! Loading renewals for: ${nextBatch.racType}`);
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

    const racKey = sessionData.racType.split(' - ')[0].replace(/\s+/g, '');

    // VALIDATION LOOP
    for (const row of validRows) {
        const empRecord = employeeLookup.get(row.recordId.trim().toLowerCase());
        if (!empRecord) {
            alert(`Booking Blocked: Employee "${row.name}" (${row.recordId}) is not registered in the system database.`);
            return;
        }
        const empReq = requirements.find(r => r.employeeId === empRecord.id);
        if (!empReq || !empReq.requiredRacs[racKey]) {
            alert(`Booking Blocked: Employee "${row.name}" is NOT mapped for ${racKey} in the database.`);
            return;
        }
    }

    if (isDlRequired) {
        const incompleteDl = validRows.find(r => !r.driverLicenseNumber || !r.driverLicenseClass || !r.driverLicenseExpiry);
        if (incompleteDl) {
            alert(`Driver License details are mandatory for this module.\n\nPlease complete details for: ${incompleteDl.name}`);
            return;
        }
    }

    // Capacity Check
    const currentBookingsCount = existingBookings.filter(b => b.sessionId === selectedSession).length;
    const availableSlots = sessionData.capacity - currentBookingsCount;
    const requestedSlots = validRows.length;

    let finalBookings: Booking[] = [];
    let overflowEmployees: Employee[] = [];

    if (requestedSlots > availableSlots) {
        const fittingRows = validRows.slice(0, availableSlots);
        const extraRows = validRows.slice(availableSlots);
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
        finalBookings = validRows.map(row => ({
            id: uuidv4(),
            sessionId: selectedSession,
            employee: { ...row },
            status: BookingStatus.PENDING,
        }));
    }

    // Duplicate Check
    const uniqueBookings = finalBookings.filter(newBooking => {
        const duplicate = existingBookings.find(b => {
            if (b.employee.recordId.toLowerCase() !== newBooking.employee.recordId.toLowerCase()) return false;
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

    if (uniqueBookings.length > 0) {
        addBookings(uniqueBookings);
        logger.audit('Manual Booking Submitted', userRole, { count: uniqueBookings.length, session: selectedSession });
        setSubmitted(true);
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
        setTimeout(() => {
            setSubmitted(false);
            if (renewalQueue.length > 0) {
                loadNextBatch();
            } else {
                if (!isSelfService) setRows(initialRows);
                setSelectedSession('');
                setTargetRac('');
            }
        }, 1500);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in-up">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700">
         <div className="absolute top-0 right-0 opacity-5 pointer-events-none"><FileSignature size={300} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-500/20 rounded-lg backdrop-blur-sm border border-yellow-500/30">
                    <UserPlus size={28} className="text-yellow-500" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white">{isSelfService ? 'Self-Service Booking' : t.booking.title}</h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl flex items-center gap-2 font-medium">
                  <ShieldCheck size={16} className="text-green-400" />
                  {isSelfService ? "View only trainings mapped to you." : "Full Schedule Access (Secure Mode)"}
               </p>
            </div>
            {canManageSessions && (
                <button onClick={() => navigate('/settings')} className="group bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-sm font-bold border border-slate-700 hover:border-slate-600 flex items-center gap-3 transition-all">
                    <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>{t.booking.manageSchedule}</span>
                </button>
            )}
         </div>
      </div>

      {submitted && (
        <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 animate-bounce-in">
            <CheckCircle2 size={24} className="text-white" />
            <span className="font-bold text-lg">{t.booking.success}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
               <div className="flex justify-between items-center mb-3">
                   <label className="text-xs font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 ml-1">
                      <Calendar size={14} />{t.booking.selectSession}
                   </label>
                   {!isSelfService && (
                       <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                           <Layers size={10} /> Full View
                       </span>
                   )}
               </div>
               <div className="relative group">
                   <select 
                      value={selectedSession} 
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className={`w-full bg-white dark:bg-slate-700 border-2 text-slate-900 dark:text-white rounded-2xl shadow-sm p-4 pl-5 text-xl font-bold transition-all appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-500 ${targetRac ? 'border-blue-300 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-600 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20'}`}
                      required
                    >
                      <option value="">-- {t.booking.chooseSession} --</option>
                      {availableSessions.map(session => {
                        const count = existingBookings.filter(b => b.sessionId === session.id).length;
                        const isFull = count >= session.capacity;
                        const isMatch = targetRac && session.racType.includes(targetRac);
                        return (
                            <option key={session.id} value={session.id} className={`${isFull ? 'text-red-500' : ''} ${isMatch ? 'bg-blue-100 font-black' : ''}`}>
                            {isMatch ? '★ ' : ''}{session.racType} • {session.date} • {session.location} • (Cap: {count}/{session.capacity}) {isFull ? '(FULL)' : ''}
                            </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Calendar size={24} /></div>
               </div>
                {isSelfService && availableSessions.length === 0 && <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1"><AlertCircle size={12}/> No eligible training sessions available.</p>}
                {isDlRequired && (
                    <div className="mt-4 flex items-start gap-3 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-900/50 animate-fade-in-down">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <div><p className="font-bold text-sm">Critical Requirement</p><p className="text-xs opacity-90">{t.booking.dlRequired}</p></div>
                    </div>
                )}
            </div>

            <div className="p-4 md:p-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-12 rounded-l-lg">#</th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-36">{t.common.id} <span className="text-yellow-500">*</span></th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider w-32">{t.common.name}</th>
                    {isDlRequired && (
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
                    const isKnownId = !!(row.recordId && employeeLookup.has(row.recordId.toLowerCase()));
                    const isLocked = isSelfService;
                    return (
                    <tr key={row.id} className="group transition-transform duration-200 hover:scale-[1.002]">
                      <td className="align-middle"><div className="w-6 h-6 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-400 flex items-center justify-center font-bold text-[10px] border border-slate-200 dark:border-slate-600">{index + 1}</div></td>
                      <td className="px-2 py-2">
                        <div className="relative">
                            <input type="text" className={`w-full border rounded-lg px-3 py-2 text-xs font-mono transition-all outline-none ${isLocked ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed' : isKnownId ? 'bg-green-50 dark:bg-green-900/20 border-green-200 text-green-700 dark:text-green-300 focus:ring-2 focus:ring-green-500' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500'}`} placeholder="Search ID..." value={row.recordId} onChange={(e) => handleRowChange(index, 'recordId', e.target.value)} onBlur={() => handleIdBlur(index)} readOnly={isLocked} />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">{isLocked ? <Lock size={12} className="text-gray-400"/> : isKnownId ? <UserCheck size={14} className="text-green-500" /> : <Search size={12} className="text-slate-300" />}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2"><input type="text" className={`w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 outline-none disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed ${isLocked ? 'cursor-not-allowed bg-gray-100 dark:bg-slate-800' : ''}`} placeholder={t.common.name} value={row.name} onChange={(e) => handleRowChange(index, 'name', e.target.value)} disabled={isKnownId || isLocked} /></td>
                      {isDlRequired && (
                        <>
                          <td className="px-1 py-2"><input type="text" className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-red-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Num" value={row.driverLicenseNumber} onChange={(e) => handleRowChange(index, 'driverLicenseNumber', e.target.value)} /></td>
                          <td className="px-1 py-2"><input type="text" className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-red-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Cls" value={row.driverLicenseClass} onChange={(e) => handleRowChange(index, 'driverLicenseClass', e.target.value)} /></td>
                          <td className="px-1 py-2"><input type="date" className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-red-500 outline-none" value={row.driverLicenseExpiry} onChange={(e) => handleRowChange(index, 'driverLicenseExpiry', e.target.value)} /></td>
                        </>
                      )}
                      <td className="px-2 py-2"><select className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 outline-none disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500" value={row.company} onChange={(e) => handleRowChange(index, 'company', e.target.value)} disabled={isKnownId || isLocked}>{COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}</select></td>
                      <td className="px-2 py-2"><select className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 outline-none disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500" value={row.department} onChange={(e) => handleRowChange(index, 'department', e.target.value)} disabled={isKnownId || isLocked}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></td>
                      <td className="px-2 py-2"><select className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-2 text-xs text-slate-900 dark:text-slate-300 outline-none disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500" value={row.role} onChange={(e) => handleRowChange(index, 'role', e.target.value)} disabled={isKnownId || isLocked}>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></td>
                      <td className="px-2 py-2 text-center">{!isLocked && <button type="button" onClick={() => removeRow(index)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={16} /></button>}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
            <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50 dark:bg-slate-800/50">
              {!isSelfService && <button type="button" onClick={addRow} className="flex items-center gap-2 text-slate-700 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold px-6 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all shadow-sm hover:shadow-md"><Plus size={20} /><span>{t.booking.addRow}</span></button>}
              <button type="submit" className={`w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 text-lg px-10 py-4 rounded-2xl font-black shadow-xl shadow-yellow-500/20 transition-all transform hover:-translate-y-1 active:scale-95 ${isSelfService ? 'mx-auto' : ''}`}><Save size={24} /><span>{t.booking.submitBooking}</span></button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default BookingForm;
