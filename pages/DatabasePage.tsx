
// ... existing imports ...
import React, { useState, useMemo, useRef } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession, RacDef } from '../types';
import { COMPANIES, DEPARTMENTS, ROLES, OPS_KEYS, PERMISSION_KEYS } from '../constants';
import { Search, CheckCircle, XCircle, CreditCard, Edit, Save, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Trash2, Download, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { v4 as uuidv4 } from 'uuid';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
  sessions: TrainingSession[];
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  // Updated signature to handle full matrix import
  onImportEmployees?: (data: { employee: Employee, req: EmployeeRequirement }[]) => void;
  racDefinitions: RacDef[];
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements, sessions, onUpdateEmployee, onDeleteEmployee, onImportEmployees, racDefinitions }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        // 1. Try Session Object (Most Reliable)
        const session = sessions.find(s => s.id === b.sessionId);
        if (session) {
            // e.g. "RAC 01 - Height" -> "RAC01"
            racCode = session.racType.split(' - ')[0].replace(/\s+/g, '');
        } else {
            // 2. Fallback to String Parsing (if imported/legacy)
            // Remove spaces to match: "RAC 01" -> "RAC01", "RAC01" -> "RAC01"
            racCode = b.sessionId.split(' - ')[0].replace(/\s+/g, '');
        }
        return racCode === racKey;
    });

    // STRICT SORT: Latest expiry date first
    relevantBookings.sort((a, b) => {
        const dateA = new Date(a.expiryDate || '1970-01-01').getTime();
        const dateB = new Date(b.expiryDate || '1970-01-01').getTime();
        return dateB - dateA; // Descending (Newest first)
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

  // --- CSV Logic Implementation ---
  
  const handleDownloadTemplate = () => {
    // Dynamic Header Construction
    const baseHeaders = [
        "Full Name", "Record ID", "Company", "Department", "Role", "Active", 
        "ASO Expiry (YYYY-MM-DD)", "DL Number", "DL Class", "DL Expiry (YYYY-MM-DD)"
    ];
    
    const racHeaders = racDefinitions.map(r => r.code); // RAC01, RAC02...
    const opsHeaders = OPS_KEYS; // PTS, ART...
    
    const headers = [...baseHeaders, ...racHeaders, ...opsHeaders];
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vulcan_database_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;
        
        const lines = text.split('\n');
        // Extract headers to map dynamic columns
        const headerRow = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1);
        
        const importPayload: { employee: Employee, req: EmployeeRequirement }[] = [];

        // Helper to find index of a header
        const getIdx = (name: string) => headerRow.findIndex(h => h.toLowerCase() === name.toLowerCase());
        
        // Base Indices (Dynamic lookup is safer)
        const idxName = 0;
        const idxId = 1;
        const idxComp = 2;
        const idxDept = 3;
        const idxRole = 4;
        const idxActive = 5;
        const idxAso = 6;
        const idxDlNum = 7;
        const idxDlClass = 8;
        const idxDlExp = 9;
        
        // Matrix Start Index (After DL Exp)
        const matrixStartIndex = 10;

        dataRows.forEach(line => {
            const cols = line.split(',');
            if (cols.length < 2) return;

            const name = cols[idxName]?.trim();
            const recordId = cols[idxId]?.trim();
            
            if (name && recordId) {
                const empId = uuidv4();
                
                // 1. Build Employee Object
                const employee: Employee = {
                    id: empId,
                    name,
                    recordId,
                    company: cols[idxComp]?.trim() || 'Unknown',
                    department: cols[idxDept]?.trim() || 'Operations',
                    role: cols[idxRole]?.trim() || 'Staff',
                    isActive: cols[idxActive]?.trim().toLowerCase() === 'false' ? false : true,
                    driverLicenseNumber: cols[idxDlNum]?.trim(),
                    driverLicenseClass: cols[idxDlClass]?.trim(),
                    driverLicenseExpiry: cols[idxDlExp]?.trim(),
                };

                // 2. Build Requirements Object
                const requiredRacs: Record<string, boolean> = {};
                
                // Parse RAC Columns from header
                racDefinitions.forEach(def => {
                    const colIdx = headerRow.indexOf(def.code);
                    if (colIdx >= 0) {
                        const val = cols[colIdx]?.trim().toLowerCase();
                        requiredRacs[def.code] = (val === '1' || val === 'true' || val === 'yes');
                    }
                });

                // Parse OPS Columns from header
                OPS_KEYS.forEach(key => {
                    const colIdx = headerRow.indexOf(key);
                    if (colIdx >= 0) {
                        const val = cols[colIdx]?.trim().toLowerCase();
                        requiredRacs[key] = (val === '1' || val === 'true' || val === 'yes');
                    }
                });

                const req: EmployeeRequirement = {
                    employeeId: empId,
                    asoExpiryDate: cols[idxAso]?.trim() || '',
                    requiredRacs
                };

                importPayload.push({ employee, req });
            }
        });

        if (importPayload.length > 0 && onImportEmployees) {
            onImportEmployees(importPayload);
            alert(`Successfully imported ${importPayload.length} employees with matrix settings.`);
        } else {
            alert("No valid data found or import function missing.");
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // -- Processing & Filtering --
  const processedData = useMemo(() => {
    return uniqueEmployees.map(emp => {
      const req = getRequirement(emp.id);
      const today = new Date().toISOString().split('T')[0];
      const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
      
      const dlExpiry = emp.driverLicenseExpiry || '';
      const isDlExpired = !!(dlExpiry && dlExpiry <= today);
      const isActive = emp.isActive ?? true;

      let allRacsMet = true;
      let hasRac02Req = false;

      // Check standard RACs
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

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1); // Reset to first page when page size changes
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
             
             {/* Filters & Actions */}
             <div className="flex flex-wrap items-center gap-2">
                 {/* ... existing filters ... */}
                 <div className="relative">
                     <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder={t.common.search}
                        className="pl-9 pr-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded-md text-xs w-40 focus:ring-yellow-500 focus:border-yellow-500"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                     />
                 </div>
                 
                 {onImportEmployees && (
                     <>
                        <button 
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                        >
                            <Download size={14} /> {t.database.downloadTemplate}
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 bg-yellow-500 text-slate-900 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-yellow-400"
                        >
                            <Upload size={14} /> {t.database.importCsv}
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                     </>
                 )}
             </div>
        </div>

        {/* High Density Table */}
        <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                 {/* ... table content same as before ... */}
                 <thead className="bg-gray-100 dark:bg-slate-700 sticky top-0 z-10 shadow-sm">
                     <tr>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-20">ID</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-36">{t.common.name}</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-28 hidden md:table-cell">{t.common.company}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-12">{t.database.active}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-24">{t.database.accessStatus}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-24">{t.database.aso}</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase pl-4 border-l border-gray-300 dark:border-slate-600">RAC Matrix (Left)</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase pl-4 border-l border-gray-300 dark:border-slate-600">{t.database.opsMatrix} (Right)</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-12">Edit</th>
                     </tr>
                 </thead>
                 <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                     {paginatedData.length === 0 ? (
                         <tr><td colSpan={12} className="p-8 text-center text-gray-400">No records found.</td></tr>
                     ) : (
                         paginatedData.map(({ emp, req, status, isAsoValid, isDlExpired, isActive, hasRac02Req }) => (
                             <tr key={emp.id} className={`hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors`}>
                                 <td className="px-2 py-2 text-xs font-mono text-black dark:text-gray-400">{emp.recordId}</td>
                                 <td className="px-2 py-2"><span className={`text-xs font-bold truncate max-w-[150px] text-slate-900 dark:text-slate-200`}>{emp.name}</span></td>
                                 <td className="px-2 py-2 text-[10px] text-black dark:text-gray-400 hidden md:table-cell truncate max-w-[120px]" title={emp.company}>{emp.company}</td>
                                 <td className="px-2 py-2 text-center bg-gray-50 dark:bg-slate-700/50">
                                     <input type="checkbox" className="h-3 w-3 text-slate-900 rounded cursor-pointer" checked={isActive} onChange={() => handleActiveToggle(emp.id, isActive)} />
                                 </td>
                                 <td className="px-2 py-2 text-center">
                                     <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${status === 'Granted' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'}`}>
                                         {status === 'Granted' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                         {status === 'Granted' ? t.database.granted : t.database.blocked}
                                     </div>
                                 </td>
                                 <td className="px-2 py-2 text-center">
                                     <input type="date" className={`border dark:border-slate-600 rounded px-1 py-0.5 text-[10px] text-center w-24 bg-transparent focus:ring-1 focus:ring-yellow-500 ${!isAsoValid ? 'text-red-600 font-bold bg-red-50 dark:bg-red-900/10' : 'text-black dark:text-gray-300'}`} value={req.asoExpiryDate || ''} onChange={e => handleAsoChange(emp.id, e.target.value)} />
                                 </td>
                                 <td className="px-2 py-2 border-l border-gray-100 dark:border-slate-700">
                                     <div className="flex flex-wrap gap-1 w-full min-w-[250px]">
                                         {racDefinitions.map(def => {
                                             const key = def.code;
                                             const isRequired = req.requiredRacs[key] || false;
                                             const trainingDate = getTrainingStatus(emp.id, key);
                                             const today = new Date().toISOString().split('T')[0];
                                             const isValid = trainingDate && trainingDate > today;
                                             const isRac02Blocked = key === 'RAC02' && isDlExpired;
                                             let bgClass = 'bg-gray-100 dark:bg-slate-700 text-gray-300';
                                             if (isRequired) {
                                                if (isValid && !isRac02Blocked) bgClass = 'bg-green-500 text-white shadow-sm';
                                                else bgClass = 'bg-red-500 text-white shadow-sm';
                                             } else {
                                                 bgClass = 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-slate-700';
                                             }
                                             return <button key={key} onClick={() => handleRequirementChange(emp.id, key, !isRequired)} className={`text-[9px] font-bold w-10 h-6 rounded flex items-center justify-center transition-all ${bgClass}`} title={def.name}>{key.replace('RAC', 'R')}</button>;
                                         })}
                                     </div>
                                 </td>
                                 <td className="px-2 py-2 border-l border-gray-100 dark:border-slate-700">
                                     <div className="flex flex-wrap gap-1 w-full min-w-[250px]">
                                         {OPS_KEYS.map(key => {
                                             const isRequired = req.requiredRacs[key] || false;
                                             const isPermission = PERMISSION_KEYS.includes(key);
                                             let isValid = false;
                                             if (isPermission) isValid = isRequired; 
                                             else {
                                                 const trainingDate = getTrainingStatus(emp.id, key);
                                                 const today = new Date().toISOString().split('T')[0];
                                                 isValid = !!(trainingDate && trainingDate > today);
                                             }
                                             let bgClass = 'bg-gray-100 dark:bg-slate-700 text-gray-300';
                                             if (isRequired) {
                                                 if (isPermission) bgClass = 'bg-blue-600 text-white shadow-sm';
                                                 else if (isValid) bgClass = 'bg-green-500 text-white shadow-sm';
                                                 else bgClass = 'bg-red-500 text-white shadow-sm';
                                             } else {
                                                 bgClass = 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-slate-700';
                                             }
                                             return <button key={key} onClick={() => handleRequirementChange(emp.id, key, !isRequired)} className={`text-[9px] font-bold w-12 h-6 rounded flex items-center justify-center transition-all ${bgClass}`} title={t.database.ops[key as keyof typeof t.database.ops]}>{key.substring(0, 3)}</button>;
                                         })}
                                     </div>
                                 </td>
                                 <td className="px-2 py-2 text-center">
                                     <button onClick={() => setEditingEmployee(emp)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-600 transition-colors"><Edit size={14} /></button>
                                 </td>
                             </tr>
                         ))
                     )}
                 </tbody>
             </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
             
             {/* Rows per page selector */}
             <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-600 dark:text-gray-400">{t.common.rowsPerPage}</span>
                 <select 
                    value={itemsPerPage}
                    onChange={handlePageSizeChange}
                    className="text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-2 py-1 outline-none focus:ring-1 focus:ring-yellow-500"
                 >
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={30}>30</option>
                     <option value={50}>50</option>
                     <option value={100}>100</option>
                     <option value={120}>120</option>
                 </select>
             </div>

             <div className="flex items-center gap-4">
                <div className="text-xs text-slate-600 dark:text-gray-400">
                    {t.common.page} {currentPage} {t.common.of} {totalPages} ({processedData.length} items)
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronLeft size={16} /></button>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronRight size={16} /></button>
                </div>
             </div>
        </div>

        {/* Transfer/Edit Modal */}
        {editingEmployee && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold text-lg dark:text-white">Edit Employee</h3>
                        <button onClick={() => setEditingEmployee(null)}><X size={20} className="dark:text-white"/></button>
                    </div>
                    {/* Simplified for brevity - fields implied from context */}
                    <div className="space-y-3">
                        <input className="w-full border rounded p-2 text-black" value={editingEmployee.name} onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})} placeholder="Name" />
                        <div className="flex gap-2">
                            <input className="flex-1 border rounded p-2 text-black" value={editingEmployee.recordId} onChange={e => setEditingEmployee({...editingEmployee, recordId: e.target.value})} placeholder="ID" />
                            <select className="flex-1 border rounded p-2 text-black" value={editingEmployee.company} onChange={e => setEditingEmployee({...editingEmployee, company: e.target.value})}>
                                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {/* Driver License Fields in Modal */}
                        <div className="border-t pt-2 mt-2">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Driver License Details</p>
                            <div className="grid grid-cols-3 gap-2">
                                <input className="border rounded p-2 text-xs text-black" placeholder="Number" value={editingEmployee.driverLicenseNumber || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseNumber: e.target.value})} />
                                <input className="border rounded p-2 text-xs text-black" placeholder="Class" value={editingEmployee.driverLicenseClass || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseClass: e.target.value})} />
                                <input type="date" className="border rounded p-2 text-xs text-black" value={editingEmployee.driverLicenseExpiry || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseExpiry: e.target.value})} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 mt-6 border-t pt-4">
                        <button onClick={handleDelete} className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm font-bold flex items-center gap-2"><Trash2 size={16}/> Delete</button>
                        <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-bold">Save Changes</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default DatabasePage;
