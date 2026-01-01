
import React, { useState, useEffect, useMemo } from 'react';
import { Employee, BookingStatus, Booking, UserRole, TrainingSession, SystemNotification, EmployeeRequirement, RacDef, Company } from '../types';
import { DEPARTMENTS, ROLES } from '../constants';
import { 
    Plus, Trash2, Save, Settings, ShieldCheck, Calendar, UserPlus, 
    FileSignature, CheckCircle2, AlertCircle, Search, UserCheck, 
    RefreshCw, Lock, Layers, UserMinus, ArrowRight, ClipboardList 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom';
import { sanitizeInput } from '../utils/security';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/databaseService';

interface BookingFormProps {
  addBookings: (newBookings: Booking[]) => void;
  sessions: TrainingSession[];
  userRole: UserRole;
  existingBookings?: Booking[];
  addNotification: (notification: SystemNotification) => void; 
  currentEmployeeId?: string;
  requirements?: EmployeeRequirement[];
  racDefinitions: RacDef[];
  companies?: Company[];
}

interface RenewalBatch {
    racType: string;
    employees: Employee[];
}

const BookingForm: React.FC<BookingFormProps> = ({ addBookings, sessions, userRole, existingBookings = [], addNotification, currentEmployeeId, requirements = [], racDefinitions, companies = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedSession] = useState('');
  const [activeSessionId, setActiveSessionId] = useState('');
  
  const [targetRac, setTargetRac] = useState<string>('');
  const [renewalQueue, setRenewalQueue] = useState<RenewalBatch[]>([]);
  
  const canManageSessions = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN;
  const isSelfService = userRole === UserRole.USER;

  const defaultCompany = useMemo(() => companies[0]?.name || 'Internal', [companies]);

  const initialRows = useMemo(() => Array.from({ length: isSelfService ? 1 : 5 }).map(() => ({
    id: uuidv4(),
    name: '',
    recordId: '',
    company: defaultCompany,
    department: DEPARTMENTS[0],
    role: ROLES[0],
    driverLicenseNumber: '',
    driverLicenseClass: '',
    driverLicenseExpiry: ''
  })), [isSelfService, defaultCompany]);

  const [rows, setRows] = useState(initialRows);
  const [submitted, setSubmitted] = useState(false);

  // Filter available sessions
  const availableSessions = useMemo(() => {
      const sorted = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (isSelfService && currentEmployeeId) {
          const myReq = requirements.find(r => r.employeeId === currentEmployeeId);
          if (!myReq) return [];
          return sorted.filter(session => {
              const racKey = session.racType.split(' - ')[0].replace(/\s+/g, '');
              return myReq.requiredRacs[racKey] === true;
          });
      }
      return sorted;
  }, [sessions, isSelfService, currentEmployeeId, requirements]);

  useEffect(() => {
    const state = location.state as { prefill?: any[]; targetRac?: string; remainingBatches?: RenewalBatch[] } | null;
    if (state) {
        if (state.prefill) setRows(state.prefill.map(e => ({ ...e, id: uuidv4() })));
        if (state.targetRac) {
            setTargetRac(state.targetRac);
            // Auto-select first session matching target if available
            const match = availableSessions.find(s => s.racType.includes(state.targetRac!));
            if (match) setActiveSessionId(match.id);
        }
        if (state.remainingBatches) setRenewalQueue(state.remainingBatches);
        window.history.replaceState({}, document.title);
    }
  }, [location, availableSessions]);

  const handleRowChange = (index: number, field: keyof Employee, value: string) => {
    const safeValue = (field === 'name' || field === 'recordId') ? sanitizeInput(value) : value;
    const newRows = [...rows];
    // @ts-ignore
    newRows[index][field] = safeValue;
    setRows(newRows);
  };

  const handleIdBlur = (index: number) => {
      const enteredId = rows[index].recordId.trim().toLowerCase();
      if (!enteredId) return;
      const match = existingBookings.find(b => b.employee.recordId.toLowerCase() === enteredId)?.employee;
      if (match) {
          const newRows = [...rows];
          newRows[index] = { ...newRows[index], ...match, id: newRows[index].id };
          setRows(newRows);
      }
  };

  const addRow = () => {
    setRows([...rows, { ...initialRows[0], id: uuidv4() }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSessionId) {
      addNotification({ id: uuidv4(), type: 'warning', title: 'Input Error', message: 'Please select a session.', timestamp: new Date(), isRead: false });
      return;
    }

    const validRows = rows.filter(r => r.name.trim() !== '' && r.recordId.trim() !== '');
    if (validRows.length === 0) return;

    const session = availableSessions.find(s => s.id === activeSessionId);

    const newBookings: Booking[] = validRows.map(row => ({
        id: uuidv4(),
        sessionId: activeSessionId,
        employee: { ...row },
        status: BookingStatus.PENDING,
        isAutoBooked: false
    }));

    addBookings(newBookings);
    await db.addLog('AUDIT', `NEW_REQUISITION_CREATED: ${newBookings.length} employees for ${session?.racType}`, user?.name || 'System', { sessionId: activeSessionId });

    setSubmitted(true);
    addNotification({ id: uuidv4(), type: 'success', title: 'Success', message: `Requisition for ${newBookings.length} personnel sent.`, timestamp: new Date(), isRead: false });
    
    setTimeout(() => {
        setSubmitted(false);
        setRows(initialRows);
        setActiveSessionId('');
        if (renewalQueue.length === 0) navigate('/');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in-up">
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700">
         <div className="absolute top-0 right-0 opacity-5 pointer-events-none"><ClipboardList size={300} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                    <FileSignature size={28} className="text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white">{isSelfService ? t.booking.selfServiceTitle : t.booking.title}</h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl flex items-center gap-2 font-medium">
                  <ShieldCheck size={16} className="text-green-400" />
                  {t.booking.secureMode}
               </p>
            </div>
         </div>
      </div>

      {submitted && (
        <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-3 animate-bounce-in">
            <CheckCircle2 size={24} />
            <span className="font-bold text-lg">{t.booking.success}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                  {t.booking.selectSession}
               </label>
               <div className="relative">
                   <select 
                      value={activeSessionId} 
                      onChange={(e) => setActiveSessionId(e.target.value)}
                      className={`w-full bg-white dark:bg-slate-700 border-2 rounded-2xl p-4 text-xl font-bold appearance-none cursor-pointer transition-all ${targetRac ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500'}`}
                      required
                    >
                      <option value="">-- {t.booking.chooseSession} --</option>
                      {availableSessions.map(session => (
                        <option key={session.id} value={session.id}>
                            {session.racType} • {session.date} • {session.location} (Cap: {session.capacity})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Calendar size={24} /></div>
               </div>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-3">ID Number</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td className="px-2 py-3">
                        <input 
                            className="w-full bg-slate-50 dark:bg-slate-700 border-transparent focus:bg-white border focus:border-indigo-500 rounded-lg p-2 text-sm font-mono" 
                            placeholder="VUL-XXXX"
                            value={row.recordId} 
                            onChange={(e) => handleRowChange(index, 'recordId', e.target.value)}
                            onBlur={() => handleIdBlur(index)}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <input className="w-full bg-slate-50 dark:bg-slate-700 border-transparent focus:bg-white border focus:border-indigo-500 rounded-lg p-2 text-sm font-bold" placeholder="Full Name" value={row.name} onChange={(e) => handleRowChange(index, 'name', e.target.value)} />
                      </td>
                      <td className="px-2 py-3">
                        <select className="w-full bg-slate-50 dark:bg-slate-700 border-transparent rounded-lg p-2 text-xs" value={row.department} onChange={(e) => handleRowChange(index, 'department', e.target.value)}>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-3">
                        <select className="w-full bg-slate-50 dark:bg-slate-700 border-transparent rounded-lg p-2 text-xs" value={row.company} onChange={(e) => handleRowChange(index, 'company', e.target.value)}>
                            {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button type="button" onClick={() => setRows(rows.filter((_, i) => i !== index))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={addRow} className="mt-4 flex items-center gap-2 text-indigo-600 font-bold text-sm px-4 py-2 hover:bg-indigo-50 rounded-xl transition-all">
                <Plus size={16}/> {t.booking.addRow}
              </button>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-lg px-12 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-1">
                <Save size={20} className="inline mr-2" /> {t.booking.submitBooking}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default BookingForm;
