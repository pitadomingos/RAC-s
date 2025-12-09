import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession } from '../types';
import { COMPANIES, RAC_KEYS } from '../constants';
import { Search, CheckCircle, XCircle, AlertTriangle, CreditCard, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
  sessions: TrainingSession[];
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements, sessions }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [accessStatusFilter, setAccessStatusFilter] = useState<'All' | 'Granted' | 'Blocked'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const [dlEdits, setDlEdits] = useState<Record<string, { number: string, class: string, expiry: string }>>({});

  const uniqueEmployees = useMemo(() => {
    const map = new Map<string, Employee>();
    bookings.forEach(b => {
      if (!map.has(b.employee.id)) {
        const original = b.employee;
        const edited = dlEdits[original.id];
        const merged = edited ? {
            ...original,
            driverLicenseNumber: edited.number,
            driverLicenseClass: edited.class,
            driverLicenseExpiry: edited.expiry
        } : original;
        map.set(b.employee.id, merged);
      }
    });
    return Array.from(map.values());
  }, [bookings, dlEdits]);

  const getRequirement = (empId: string): EmployeeRequirement => {
    return requirements.find(r => r.employeeId === empId) || {
      employeeId: empId,
      asoExpiryDate: '',
      requiredRacs: {}
    };
  };

  const getTrainingStatus = (empId: string, racKey: string): string | null => {
    // Find latest passed booking for this RAC
    const relevantBookings = bookings.filter(b => {
        if (b.employee.id !== empId) return false;
        if (b.status !== BookingStatus.PASSED) return false;
        
        // Resolve RAC code from session
        let racCode = '';
        if (b.sessionId.includes('RAC')) {
             racCode = b.sessionId.split(' - ')[0].replace(' ', '');
        } else {
            const session = sessions.find(s => s.id === b.sessionId);
            if (session) racCode = session.racType.split(' - ')[0].replace(' ', '');
        }
        return racCode === racKey;
    });

    // Sort by expiry date descending
    relevantBookings.sort((a, b) => {
        return new Date(b.expiryDate || '1970-01-01').getTime() - new Date(a.expiryDate || '1970-01-01').getTime();
    });

    if (relevantBookings.length > 0) {
        return relevantBookings[0].expiryDate || null;
    }
    return null;
  };

  const handleRequirementChange = (empId: string, racKey: string, isRequired: boolean) => {
    const current = getRequirement(empId);
    const updated = {
      ...current,
      employeeId: empId, // Ensure ID is set
      requiredRacs: {
        ...current.requiredRacs,
        [racKey]: isRequired
      }
    };
    updateRequirements(updated);
  };

  const handleAsoChange = (empId: string, date: string) => {
    const current = getRequirement(empId);
    const updated = { ...current, employeeId: empId, asoExpiryDate: date };
    updateRequirements(updated);
  };

  const handleDlUpdate = (empId: string, field: 'number' | 'class' | 'expiry', value: string) => {
     setDlEdits(prev => {
         const emp = uniqueEmployees.find(e => e.id === empId);
         const existing = prev[empId] || { 
             number: emp?.driverLicenseNumber || '',
             class: emp?.driverLicenseClass || '',
             expiry: emp?.driverLicenseExpiry || ''
         };
         return {
             ...prev,
             [empId]: { ...existing, [field]: value }
         };
     });
  };

  const processedData = useMemo(() => {
    return uniqueEmployees.map(emp => {
      const req = getRequirement(emp.id);
      const today = new Date().toISOString().split('T')[0];
      const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
      
      const dlExpiry = emp.driverLicenseExpiry || '';
      const isDlExpired = !!(dlExpiry && dlExpiry <= today);
      
      // Determine overall status
      let allRacsMet = true;
      let hasRac02Req = false;

      RAC_KEYS.forEach(key => {
          if (req.requiredRacs[key]) {
              if (key === 'RAC02') hasRac02Req = true;
              
              const trainingExpiry = getTrainingStatus(emp.id, key);
              if (!trainingExpiry || trainingExpiry <= today) {
                  allRacsMet = false;
              }
          }
      });

      let status: 'Granted' | 'Blocked' = 'Granted';
      if (!isAsoValid || !allRacsMet) status = 'Blocked';
      if (hasRac02Req && isDlExpired) status = 'Blocked';

      return {
          emp,
          req,
          status,
          isAsoValid,
          isDlExpired
      };
    });
  }, [uniqueEmployees, requirements, bookings, sessions]);

  // Filters
  const displayedRows = processedData.filter(item => {
      if (selectedCompany !== 'All' && item.emp.company !== selectedCompany) return false;
      if (accessStatusFilter !== 'All' && item.status !== accessStatusFilter) return false;
      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          return item.emp.name.toLowerCase().includes(lower) || item.emp.recordId.toLowerCase().includes(lower);
      }
      return true;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
             <div>
                 <h2 className="text-xl font-bold text-slate-800">{t.database.title}</h2>
                 <p className="text-sm text-gray-500">{t.database.subtitle}</p>
             </div>
             
             {/* Controls */}
             <div className="flex flex-wrap items-center gap-3">
                 <div className="relative">
                     <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder={t.common.search}
                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-yellow-500 focus:border-yellow-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                     />
                 </div>
                 <select 
                    className="border border-gray-300 rounded-lg p-2 text-sm"
                    value={selectedCompany}
                    onChange={e => setSelectedCompany(e.target.value)}
                 >
                     <option value="All">{t.common.all}</option>
                     {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <select 
                    className="border border-gray-300 rounded-lg p-2 text-sm"
                    value={accessStatusFilter}
                    onChange={e => setAccessStatusFilter(e.target.value as any)}
                 >
                     <option value="All">{t.common.status}</option>
                     <option value="Granted">{t.database.granted}</option>
                     <option value="Blocked">{t.database.blocked}</option>
                 </select>
             </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                     <tr>
                         <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-64">{t.database.employeeInfo}</th>
                         <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase w-32">{t.database.accessStatus}</th>
                         <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase w-40">{t.database.aso}</th>
                         <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase min-w-[300px]">RAC Requirements & Status</th>
                     </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                     {displayedRows.length === 0 ? (
                         <tr><td colSpan={4} className="p-8 text-center text-gray-400">No records found.</td></tr>
                     ) : (
                         displayedRows.map(({ emp, req, status, isAsoValid, isDlExpired }) => (
                             <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                 {/* Employee Column */}
                                 <td className="px-4 py-4">
                                     <div className="flex flex-col">
                                         <span className="font-bold text-slate-800 text-sm">{emp.name}</span>
                                         <span className="text-xs text-gray-500 font-mono">{emp.recordId}</span>
                                         <span className="text-xs text-gray-400">{emp.company}</span>
                                         
                                         {/* DL Section */}
                                         <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                                             <div className="flex items-center gap-1 font-bold text-gray-600 mb-1">
                                                 <CreditCard size={12} /> {t.database.license}
                                             </div>
                                             <div className="grid grid-cols-2 gap-2">
                                                 <input 
                                                     placeholder={t.database.class}
                                                     className="border rounded px-1 py-0.5 w-full bg-white"
                                                     value={dlEdits[emp.id]?.class ?? emp.driverLicenseClass ?? ''}
                                                     onChange={e => handleDlUpdate(emp.id, 'class', e.target.value)}
                                                 />
                                                 <input 
                                                     placeholder={t.database.number}
                                                     className="border rounded px-1 py-0.5 w-full bg-white"
                                                     value={dlEdits[emp.id]?.number ?? emp.driverLicenseNumber ?? ''}
                                                     onChange={e => handleDlUpdate(emp.id, 'number', e.target.value)}
                                                 />
                                             </div>
                                             <div className="mt-1">
                                                  <input 
                                                     type="date"
                                                     className={`border rounded px-1 py-0.5 w-full bg-white ${isDlExpired ? 'text-red-600 border-red-300' : ''}`}
                                                     value={dlEdits[emp.id]?.expiry ?? emp.driverLicenseExpiry ?? ''}
                                                     onChange={e => handleDlUpdate(emp.id, 'expiry', e.target.value)}
                                                 />
                                             </div>
                                         </div>
                                     </div>
                                 </td>

                                 {/* Status Column */}
                                 <td className="px-4 py-4 text-center align-top">
                                     <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border
                                         ${status === 'Granted' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}
                                     `}>
                                         {status === 'Granted' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                         {status === 'Granted' ? t.database.granted : t.database.blocked}
                                     </div>
                                 </td>

                                 {/* ASO Column */}
                                 <td className="px-4 py-4 text-center align-top">
                                     <input 
                                         type="date"
                                         className={`border rounded px-2 py-1 text-sm text-center w-full focus:ring-yellow-500
                                            ${!isAsoValid ? 'border-red-400 bg-red-50 text-red-700 font-bold' : 'border-gray-300'}
                                         `}
                                         value={req.asoExpiryDate || ''}
                                         onChange={e => handleAsoChange(emp.id, e.target.value)}
                                     />
                                     {!isAsoValid && (
                                         <div className="text-[10px] text-red-500 mt-1 flex items-center justify-center gap-1">
                                             <AlertTriangle size={10} /> Expired/Missing
                                         </div>
                                     )}
                                 </td>

                                 {/* RAC Matrix Column */}
                                 <td className="px-4 py-4 align-top">
                                     <div className="flex flex-wrap gap-2">
                                         {RAC_KEYS.map(key => {
                                             const isRequired = req.requiredRacs[key] || false;
                                             const trainingDate = getTrainingStatus(emp.id, key);
                                             const today = new Date().toISOString().split('T')[0];
                                             const isValid = trainingDate && trainingDate > today;
                                             
                                             // Special handling for RAC02 if DL expired
                                             const isRac02Blocked = key === 'RAC02' && isDlExpired;

                                             return (
                                                 <div 
                                                     key={key} 
                                                     className={`
                                                         flex flex-col border rounded-md overflow-hidden w-[70px] transition-all
                                                         ${isRequired 
                                                            ? (isValid && !isRac02Blocked ? 'border-green-200 shadow-sm' : 'border-red-300 shadow-md ring-1 ring-red-100') 
                                                            : 'border-gray-100 opacity-60 hover:opacity-100'
                                                         }
                                                     `}
                                                 >
                                                     <button
                                                         onClick={() => handleRequirementChange(emp.id, key, !isRequired)}
                                                         className={`
                                                            text-[10px] font-bold py-1 text-center w-full
                                                            ${isRequired 
                                                                ? 'bg-slate-800 text-white' 
                                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                            }
                                                         `}
                                                     >
                                                         {key}
                                                     </button>
                                                     
                                                     {isRequired && (
                                                         <div className={`
                                                             text-[9px] text-center py-1 font-mono
                                                             ${isValid && !isRac02Blocked ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600 font-bold'}
                                                         `}>
                                                             {isRac02Blocked ? (
                                                                 <span className="flex items-center justify-center gap-0.5"><ShieldAlert size={8}/> DL EXP</span>
                                                             ) : isValid ? (
                                                                 <span>{trainingDate?.substring(0,4)}</span> // Just Year
                                                             ) : (
                                                                 <span>MISSING</span>
                                                             )}
                                                         </div>
                                                     )}
                                                 </div>
                                             );
                                         })}
                                     </div>
                                 </td>
                             </tr>
                         ))
                     )}
                 </tbody>
             </table>
        </div>
    </div>
  );
};

export default DatabasePage;