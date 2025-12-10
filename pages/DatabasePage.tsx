
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession, RacDef } from '../types';
import { COMPANIES, DEPARTMENTS, ROLES } from '../constants';
import { Search, CheckCircle, XCircle, CreditCard, Edit, Save, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
  sessions: TrainingSession[];
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  racDefinitions: RacDef[];
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements, sessions, onUpdateEmployee, onDeleteEmployee, racDefinitions }) => {
  const { t } = useLanguage();
  
  // -- State --
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [accessStatusFilter, setAccessStatusFilter] = useState<'All' | 'Granted' | 'Blocked'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Editing / Transfer State
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // -- Derived Data Logic --

  // 1. Unify Employees
  const uniqueEmployees = useMemo(() => {
    const map = new Map<string, Employee>();
    bookings.forEach(b => {
      if (!map.has(b.employee.id)) {
        map.set(b.employee.id, b.employee);
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  const getRequirement = (empId: string): EmployeeRequirement => {
    return requirements.find(r => r.employeeId === empId) || {
      employeeId: empId,
      asoExpiryDate: '',
      requiredRacs: {}
    };
  };

  const getTrainingStatus = (empId: string, racKey: string): string | null => {
    const relevantBookings = bookings.filter(b => {
        if (b.employee.id !== empId) return false;
        if (b.status !== BookingStatus.PASSED) return false;
        
        let racCode = '';
        if (b.sessionId.includes('RAC')) {
             racCode = b.sessionId.split(' - ')[0].replace(' ', '');
        } else {
            const session = sessions.find(s => s.id === b.sessionId);
            if (session) racCode = session.racType.split(' - ')[0].replace(' ', '');
        }
        return racCode === racKey;
    });

    relevantBookings.sort((a, b) => {
        return new Date(b.expiryDate || '1970-01-01').getTime() - new Date(a.expiryDate || '1970-01-01').getTime();
    });

    return relevantBookings.length > 0 ? relevantBookings[0].expiryDate || null : null;
  };

  const handleRequirementChange = (empId: string, racKey: string, isRequired: boolean) => {
    const current = getRequirement(empId);
    const updated = {
      ...current,
      employeeId: empId,
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
  
  const handleActiveToggle = (empId: string, currentStatus: boolean) => {
      // If currently active (true) and clicking to uncheck (false) -> Delete
      if (currentStatus === true) {
          if (confirm("Marking as Inactive will delete this employee from the database to save space. Are you sure?")) {
              onDeleteEmployee(empId);
          }
      } 
      // Note: Since we delete on inactive, we don't really need a logic to turn it back on because the record is gone.
  };

  const handleSaveEdit = () => {
      if (editingEmployee) {
          onUpdateEmployee(editingEmployee.id, {
              name: editingEmployee.name,
              recordId: editingEmployee.recordId,
              company: editingEmployee.company,
              department: editingEmployee.department,
              role: editingEmployee.role,
              driverLicenseNumber: editingEmployee.driverLicenseNumber,
              driverLicenseClass: editingEmployee.driverLicenseClass,
              driverLicenseExpiry: editingEmployee.driverLicenseExpiry
          });
          setEditingEmployee(null);
      }
  };

  const handleDelete = () => {
      if (editingEmployee && confirm('Are you sure you want to delete this employee? This will remove all associated training records.')) {
          onDeleteEmployee(editingEmployee.id);
          setEditingEmployee(null);
      }
  };

  // -- Processing & Filtering --
  const processedData = useMemo(() => {
    return uniqueEmployees.map(emp => {
      const req = getRequirement(emp.id);
      const today = new Date().toISOString().split('T')[0];
      const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
      
      const dlExpiry = emp.driverLicenseExpiry || '';
      const isDlExpired = !!(dlExpiry && dlExpiry <= today);
      
      // Default to true if undefined, as existing records are active
      const isActive = emp.isActive ?? true;

      let allRacsMet = true;
      let hasRac02Req = false;

      // Use prop racDefinitions instead of static RAC_KEYS
      racDefinitions.forEach(def => {
          const key = def.code;
          if (req.requiredRacs[key]) {
              if (key === 'RAC02') hasRac02Req = true;
              const trainingExpiry = getTrainingStatus(emp.id, key);
              if (!trainingExpiry || trainingExpiry <= today) {
                  allRacsMet = false;
              }
          }
      });

      let status: 'Granted' | 'Blocked' = 'Granted';
      
      if (!isActive) {
          status = 'Blocked';
      } else if (!isAsoValid || !allRacsMet) {
          status = 'Blocked';
      } else if (hasRac02Req && isDlExpired) {
          status = 'Blocked';
      }

      return {
          emp,
          req,
          status,
          isAsoValid,
          isDlExpired,
          isActive,
          hasRac02Req
      };
    }).filter(item => {
        if (selectedCompany !== 'All' && item.emp.company !== selectedCompany) return false;
        if (accessStatusFilter !== 'All' && item.status !== accessStatusFilter) return false;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            return item.emp.name.toLowerCase().includes(lower) || item.emp.recordId.toLowerCase().includes(lower);
        }
        return true;
    });
  }, [uniqueEmployees, requirements, bookings, sessions, selectedCompany, accessStatusFilter, searchTerm, racDefinitions]);

  // -- Pagination Logic --
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
      const p = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(p);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative transition-colors">
        
        {/* Header Control Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex flex-col xl:flex-row justify-between gap-4">
             <div>
                 <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     {t.database.title}
                     <span className="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-slate-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                         {processedData.length} records
                     </span>
                 </h2>
                 <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">{t.database.subtitle}</p>
             </div>
             
             {/* Filters */}
             <div className="flex flex-wrap items-center gap-2">
                 <div className="relative">
                     <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder={t.common.search}
                        className="pl-9 pr-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md text-xs w-48 focus:ring-yellow-500 focus:border-yellow-500"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                     />
                 </div>
                 
                 <div className="flex items-center gap-2 border-l border-gray-300 dark:border-slate-600 pl-3 ml-1">
                     <Filter size={14} className="text-gray-400" />
                     <select 
                        className="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md py-1.5 px-2 text-xs"
                        value={selectedCompany}
                        onChange={e => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
                     >
                         <option value="All">{t.common.all}</option>
                         {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <select 
                        className="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md py-1.5 px-2 text-xs"
                        value={accessStatusFilter}
                        onChange={e => { setAccessStatusFilter(e.target.value as any); setCurrentPage(1); }}
                     >
                         <option value="All">{t.common.status}</option>
                         <option value="Granted">{t.database.granted}</option>
                         <option value="Blocked">{t.database.blocked}</option>
                     </select>
                     <select 
                        className="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md py-1.5 px-2 text-xs hidden md:block"
                        value={itemsPerPage}
                        onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                     >
                         <option value={20}>20 / page</option>
                         <option value={50}>50 / page</option>
                         <option value={100}>100 / page</option>
                     </select>
                 </div>
             </div>
        </div>

        {/* High Density Table */}
        <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                 <thead className="bg-gray-100 dark:bg-slate-700 sticky top-0 z-10 shadow-sm">
                     <tr>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-20">ID</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-36">{t.common.name}</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-28 hidden md:table-cell">{t.common.company}</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-28 hidden lg:table-cell">{t.common.jobTitle}</th>
                         {/* ACTIVE COLUMN REPOSITIONED HERE */}
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-12">{t.database.active}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-24">{t.database.accessStatus}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-24">{t.database.aso}</th>
                         {/* 3 DL COLUMNS ADDED */}
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-12">DL Cls</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-20">DL No</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-20">DL Exp</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase">RAC Matrix</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase w-12">Edit</th>
                     </tr>
                 </thead>
                 <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                     {paginatedData.length === 0 ? (
                         <tr><td colSpan={12} className="p-8 text-center text-gray-400">No records found.</td></tr>
                     ) : (
                         paginatedData.map(({ emp, req, status, isAsoValid, isDlExpired, isActive, hasRac02Req }) => (
                             <tr key={emp.id} className={`hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors`}>
                                 
                                 {/* ID */}
                                 <td className="px-2 py-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                                     {emp.recordId}
                                 </td>

                                 {/* Name */}
                                 <td className="px-2 py-2">
                                     <span className={`text-xs font-bold truncate max-w-[150px] text-slate-800 dark:text-slate-200`}>
                                         {emp.name}
                                     </span>
                                 </td>

                                 {/* Company */}
                                 <td className="px-2 py-2 text-[10px] text-gray-600 dark:text-gray-400 hidden md:table-cell truncate max-w-[120px]" title={emp.company}>
                                     {emp.company}
                                 </td>

                                 {/* Job Title / Dept */}
                                 <td className="px-2 py-2 text-[10px] text-gray-500 dark:text-gray-400 hidden lg:table-cell truncate max-w-[120px]">
                                     {emp.role}
                                 </td>

                                 {/* Active Toggle (Now Delete) */}
                                 <td className="px-2 py-2 text-center bg-gray-50 dark:bg-slate-700/50">
                                     <input 
                                        type="checkbox" 
                                        className="h-3 w-3 text-slate-900 rounded cursor-pointer"
                                        checked={isActive}
                                        onChange={() => handleActiveToggle(emp.id, isActive)}
                                        title="Uncheck to delete from database"
                                     />
                                 </td>

                                 {/* Status */}
                                 <td className="px-2 py-2 text-center">
                                     <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border
                                         ${status === 'Granted' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'}
                                     `}>
                                         {status === 'Granted' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                         {status === 'Granted' ? t.database.granted : t.database.blocked}
                                     </div>
                                 </td>

                                 {/* ASO Date */}
                                 <td className="px-2 py-2 text-center">
                                     <input 
                                         type="date"
                                         className={`border dark:border-slate-600 rounded px-1 py-0.5 text-[10px] text-center w-24 bg-transparent focus:ring-1 focus:ring-yellow-500
                                            ${!isAsoValid ? 'text-red-600 font-bold bg-red-50 dark:bg-red-900/10' : 'text-gray-700 dark:text-gray-300'}
                                         `}
                                         value={req.asoExpiryDate || ''}
                                         onChange={e => handleAsoChange(emp.id, e.target.value)}
                                     />
                                 </td>

                                 {/* DL Class */}
                                 <td className="px-2 py-2 text-center text-[10px] font-mono text-gray-600 dark:text-gray-400">
                                     {emp.driverLicenseClass || '-'}
                                 </td>

                                 {/* DL Number */}
                                 <td className="px-2 py-2 text-center text-[10px] font-mono text-gray-600 dark:text-gray-400 truncate max-w-[80px]" title={emp.driverLicenseNumber}>
                                     {emp.driverLicenseNumber || '-'}
                                 </td>

                                 {/* DL Expiry */}
                                 <td className={`px-2 py-2 text-center text-[10px] font-mono ${isDlExpired && emp.driverLicenseExpiry ? 'text-red-600 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                                     {emp.driverLicenseExpiry || '-'}
                                 </td>

                                 {/* RAC Matrix - Horizontal Scroll if needed */}
                                 <td className="px-2 py-2">
                                     <div className="flex flex-wrap gap-1 w-full min-w-[300px]">
                                         {racDefinitions.map(def => {
                                             const key = def.code;
                                             const isRequired = req.requiredRacs[key] || false;
                                             const trainingDate = getTrainingStatus(emp.id, key);
                                             const today = new Date().toISOString().split('T')[0];
                                             const isValid = trainingDate && trainingDate > today;
                                             const isRac02Blocked = key === 'RAC02' && isDlExpired;

                                             // Compact color logic
                                             let bgClass = 'bg-gray-100 dark:bg-slate-700 text-gray-300'; // Default disabled
                                             if (isRequired) {
                                                if (isValid && !isRac02Blocked) bgClass = 'bg-green-500 text-white shadow-sm';
                                                else bgClass = 'bg-red-500 text-white shadow-sm';
                                             } else {
                                                 // Optional/Not Required style
                                                 bgClass = 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-slate-700';
                                             }
                                             
                                             return (
                                                 <button
                                                     key={key}
                                                     onClick={() => handleRequirementChange(emp.id, key, !isRequired)}
                                                     className={`
                                                        text-[9px] font-bold w-12 h-6 rounded flex items-center justify-center transition-all
                                                        ${bgClass}
                                                     `}
                                                     title={`${def.name} - ${isRequired ? (isValid ? 'Valid' : 'Invalid') : 'Not Required'}`}
                                                 >
                                                     {key.replace('RAC', 'R')}
                                                 </button>
                                             );
                                         })}
                                     </div>
                                 </td>
                                 
                                 {/* Edit Action */}
                                 <td className="px-2 py-2 text-center">
                                     <button 
                                        onClick={() => setEditingEmployee(emp)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-600 transition-colors"
                                     >
                                         <Edit size={14} />
                                     </button>
                                 </td>
                             </tr>
                         ))
                     )}
                 </tbody>
             </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages} ({processedData.length} items)
            </div>
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => goToPage(1)} 
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronsLeft size={16} />
                </button>
                <button 
                    onClick={() => goToPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} />
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                         // Logic to show generic window of pages
                         let pNum = i + 1;
                         if (totalPages > 5) {
                             if (currentPage > 3) pNum = currentPage - 2 + i;
                             if (pNum > totalPages) pNum = totalPages - 4 + i; // simplistic clamp
                         }
                         if (pNum > 0 && pNum <= totalPages) {
                             return (
                                <button
                                    key={pNum}
                                    onClick={() => goToPage(pNum)}
                                    className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold 
                                        ${currentPage === pNum ? 'bg-slate-900 text-white dark:bg-yellow-500 dark:text-slate-900' : 'bg-white border hover:bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300'}
                                    `}
                                >
                                    {pNum}
                                </button>
                             );
                         }
                         return null;
                    })}
                </div>

                <button 
                    onClick={() => goToPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={16} />
                </button>
                <button 
                    onClick={() => goToPage(totalPages)} 
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>

        {/* Transfer/Edit Modal */}
        {editingEmployee && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg animate-fade-in-up border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                             <Edit size={18} className="text-blue-500" />
                             {t.database.transfer.title}
                        </h3>
                        <button onClick={() => setEditingEmployee(null)} className="text-gray-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t.common.name}</label>
                                <input 
                                    className="w-full border rounded p-2 text-sm bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={editingEmployee.name}
                                    onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Record ID</label>
                                <input 
                                    className="w-full border rounded p-2 text-sm bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-mono"
                                    value={editingEmployee.recordId}
                                    onChange={e => setEditingEmployee({...editingEmployee, recordId: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t.common.company}</label>
                                <select 
                                    className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={editingEmployee.company}
                                    onChange={e => setEditingEmployee({...editingEmployee, company: e.target.value})}
                                >
                                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t.common.department}</label>
                                <select 
                                    className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={editingEmployee.department}
                                    onChange={e => setEditingEmployee({...editingEmployee, department: e.target.value})}
                                >
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t.common.role}</label>
                                <select 
                                    className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={editingEmployee.role}
                                    onChange={e => setEditingEmployee({...editingEmployee, role: e.target.value})}
                                >
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <hr className="dark:border-slate-700" />
                        
                        {/* DL Section */}
                        <div>
                             <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                <CreditCard size={16} /> Driver License Details
                             </h4>
                             <div className="grid grid-cols-3 gap-4">
                                  <div className="col-span-1">
                                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t.database.class}</label>
                                      <input 
                                          className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                          value={editingEmployee.driverLicenseClass || ''}
                                          onChange={e => setEditingEmployee({...editingEmployee, driverLicenseClass: e.target.value})}
                                      />
                                  </div>
                                  <div className="col-span-2">
                                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t.database.number}</label>
                                      <input 
                                          className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                          value={editingEmployee.driverLicenseNumber || ''}
                                          onChange={e => setEditingEmployee({...editingEmployee, driverLicenseNumber: e.target.value})}
                                      />
                                  </div>
                                  <div className="col-span-3">
                                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t.results.table.expiry}</label>
                                      <input 
                                          type="date"
                                          className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                          value={editingEmployee.driverLicenseExpiry || ''}
                                          onChange={e => setEditingEmployee({...editingEmployee, driverLicenseExpiry: e.target.value})}
                                      />
                                  </div>
                             </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex justify-between gap-3 bg-gray-50 dark:bg-slate-800/50 rounded-b-xl sticky bottom-0">
                         <button 
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg font-medium flex items-center gap-2"
                        >
                            <Trash2 size={16} /> {t.common.delete}
                        </button>
                        
                        <div className="flex gap-2">
                             <button 
                                onClick={() => setEditingEmployee(null)}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg font-medium"
                            >
                                {t.common.cancel}
                            </button>
                            <button 
                                onClick={handleSaveEdit}
                                className="px-4 py-2 text-sm bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 rounded-lg font-bold flex items-center gap-2"
                            >
                                <Save size={16} /> {t.database.transfer.update}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default DatabasePage;
