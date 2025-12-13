
import React, { useState, useMemo, useEffect } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession, RacDef } from '../types';
import { OPS_KEYS, PERMISSION_KEYS, DEPARTMENTS } from '../constants';
import { Search, CheckCircle, XCircle, Edit, ChevronLeft, ChevronRight, Download, X, Trash2, QrCode, Printer, Phone, AlertTriangle, Loader2, Archive, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import JSZip from 'jszip';
import ConfirmModal from '../components/ConfirmModal';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
  sessions: TrainingSession[];
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  racDefinitions: RacDef[];
  contractors?: string[];
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements, sessions, onUpdateEmployee, onDeleteEmployee, racDefinitions, contractors = [] }) => {
  const { t } = useLanguage();
  
  // -- State --
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [accessStatusFilter, setAccessStatusFilter] = useState<'All' | 'Granted' | 'Blocked'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Editing / Transfer State
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // QR / Back of Card State
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);
  
  // Mass Download State
  const [isZipping, setIsZipping] = useState(false);

  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false
  });

  // -- Date Validation Helper --
  const validateDateInput = (dateStr: string): boolean => {
      if (!dateStr) return true; // Allow clearing
      
      // Handle Excel formats or DD/MM/YYYY if accidentally pasted
      if (dateStr.includes('/')) return false; 

      const parts = dateStr.split('-');
      if (parts.length !== 3) return false;
      
      const year = parseInt(parts[0]);
      if (year < 1900 || year > 2100) return false;
      if (parts[0].length > 4) return false;

      return true;
  };

  // -- ESC Key Listener for Modals --
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (confirmState.isOpen) setConfirmState(prev => ({ ...prev, isOpen: false }));
            else if (qrEmployee) setQrEmployee(null);
            else if (editingEmployee) setEditingEmployee(null);
        }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [qrEmployee, editingEmployee, confirmState.isOpen]);

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

  // --- CRITICAL FIX: Robust RAC Matching (Case Insensitive for (imp)) ---
  const getTrainingStatus = (empId: string, racKey: string): string | null => {
    const relevantBookings = bookings.filter(b => {
        if (b.employee.id !== empId) return false;
        if (b.status !== BookingStatus.PASSED) return false;
        
        let racCode = '';
        const session = sessions.find(s => s.id === b.sessionId);
        
        if (session) {
            // Case 1: Linked to a real session -> "RAC 01 - Working at Height"
            racCode = session.racType;
        } else {
            // Case 2: Imported Record -> "RAC01|Historical" OR "RAC 01 (Imp)" OR "RAC01"
            racCode = b.sessionId;
        }

        // --- NORMALIZATION LOGIC ---
        // 1. Remove Pipe metadata (e.g. "|Historical...")
        if (racCode.includes('|')) racCode = racCode.split('|')[0];
        
        // 2. Remove (Imp) suffix if present (CASE INSENSITIVE Regex, flexible spacing)
        // Matches "(imp)", "(Imp)", "(IMP)", " (imp)", etc.
        racCode = racCode.replace(/\s*\(imp\)\s*/gi, '');
        
        // 3. Remove dashes (e.g. "RAC 01 - Name" -> "RAC 01  Name")
        if (racCode.includes('-')) racCode = racCode.split('-')[0];
        
        // 4. Remove ALL spaces to ensure "RAC 01" matches "RAC01"
        racCode = racCode.replace(/\s+/g, '').trim().toUpperCase();
        
        const targetKey = racKey.replace(/\s+/g, '').trim().toUpperCase();

        return racCode === targetKey;
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
    
    const newRequiredRacs = { ...current.requiredRacs, [racKey]: isRequired };

    if (isRequired) {
        if (racKey === 'LIB_OPS') {
            newRequiredRacs['LIB_MOV'] = false;
        } else if (racKey === 'LIB_MOV') {
            newRequiredRacs['LIB_OPS'] = false;
        }
    }

    const updated = {
      ...current,
      employeeId: empId,
      requiredRacs: newRequiredRacs
    };
    updateRequirements(updated);
  };

  const handleAsoChange = (empId: string, date: string) => {
    if (!validateDateInput(date)) return;
    const current = getRequirement(empId);
    const updated = { ...current, employeeId: empId, asoExpiryDate: date };
    updateRequirements(updated);
  };
  
  const handleActiveToggle = (empId: string, currentStatus: boolean) => {
      if (currentStatus === true) {
          setConfirmState({
              isOpen: true,
              title: 'Deactivate Employee?',
              message: 'Marking as Inactive will delete this employee from the database to save space. Are you sure?',
              onConfirm: () => onDeleteEmployee(empId),
              isDestructive: true
          });
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
      if (editingEmployee) {
          setConfirmState({
              isOpen: true,
              title: 'Delete Employee Record?',
              message: `Are you sure you want to delete ${editingEmployee.name}? This will remove all associated training records permanently.`,
              onConfirm: () => {
                  onDeleteEmployee(editingEmployee.id);
                  setEditingEmployee(null);
              },
              isDestructive: true
          });
      }
  };

  // --- QR Helper Functions ---
  const getQrUrl = (recordId: string) => {
      const appOrigin = window.location.origin + window.location.pathname;
      const verificationUrl = `${appOrigin}#/verify/${recordId}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verificationUrl)}`;
  };

  const handleDownloadQr = async (recordId: string, name: string) => {
      const url = getQrUrl(recordId);
      try {
          const response = await fetch(url);
          const blob = await response.blob();
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `QR_${name.replace(/\s+/g, '_')}_${recordId}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      } catch (e) {
          alert("Error downloading QR Code. Please try printing instead.");
      }
  };

  // --- MASS DOWNLOAD LOGIC ---
  const handleBulkQrDownload = async () => {
      if (processedData.length === 0) {
          alert("No records to download.");
          return;
      }
      
      const confirmMsg = `This will generate and download QR codes for ${processedData.length} employees currently visible in the table. This might take a moment. Continue?`;
      if (!confirm(confirmMsg)) return;

      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder("vulkan_safety_qrs");

      try {
          // Limit to prevent browser crash on huge datasets, though standard use is fine
          const limit = 500; 
          const dataToProcess = processedData.slice(0, limit);
          
          if (processedData.length > limit) {
              alert(`Note: Dataset too large. Downloading first ${limit} records to prevent browser timeout.`);
          }

          // Fetch sequentially to avoid rate limiting or browser connection limits
          for (const item of dataToProcess) {
              const { emp } = item;
              const url = getQrUrl(emp.recordId);
              try {
                  const response = await fetch(url);
                  if (response.ok) {
                      const blob = await response.blob();
                      // Sanitize filename
                      const safeName = emp.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                      const safeId = emp.recordId.replace(/[^a-z0-9]/gi, '_');
                      folder?.file(`${safeName}_${safeId}.png`, blob);
                  }
              } catch (e) {
                  console.error(`Failed to fetch QR for ${emp.recordId}`, e);
              }
          }

          const content = await zip.generateAsync({ type: "blob" });
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(content);
          downloadLink.download = `vulkan_qr_batch_${new Date().toISOString().split('T')[0]}.zip`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

      } catch (err) {
          console.error("Zip Error", err);
          alert("An error occurred while generating the bulk archive.");
      } finally {
          setIsZipping(false);
      }
  };

  const handleExportDatabase = () => {
      const baseHeaders = [
          "Full Name", "Record ID", "Company", "Department", "Role", "Active", "Access Status",
          "ASO Expiry", "DL Number", "DL Class", "DL Expiry"
      ];
      
      const racHeaders = racDefinitions.map(r => r.code);
      const opsHeaders = OPS_KEYS;
      
      const headers = [...baseHeaders, ...racHeaders, ...opsHeaders];
      
      const rows = processedData.map(({ emp, req, status }) => {
          const racValues = racDefinitions.map(r => req.requiredRacs[r.code] ? 'TRUE' : 'FALSE');
          const opsValues = OPS_KEYS.map(k => req.requiredRacs[k] ? 'TRUE' : 'FALSE');
          
          return [
              `"${emp.name}"`,
              emp.recordId,
              emp.company,
              emp.department,
              emp.role,
              emp.isActive ? 'TRUE' : 'FALSE',
              status,
              req.asoExpiryDate || '',
              emp.driverLicenseNumber || '',
              emp.driverLicenseClass || '',
              emp.driverLicenseExpiry || '',
              ...racValues,
              ...opsValues
          ];
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `vulcan_database_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        if (selectedDepartment !== 'All' && item.emp.department !== selectedDepartment) return false;
        if (accessStatusFilter !== 'All' && item.status !== accessStatusFilter) return false;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            return item.emp.name.toLowerCase().includes(lower) || item.emp.recordId.toLowerCase().includes(lower);
        }
        return true;
    });
  }, [uniqueEmployees, requirements, bookings, sessions, selectedCompany, selectedDepartment, accessStatusFilter, searchTerm, racDefinitions]);

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
      setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-auto md:h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative transition-colors">
        
        {/* Header Control Bar */}
        <div className="shrink-0 p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex flex-col xl:flex-row justify-between gap-4">
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
                 
                 {/* Company Filter */}
                 <div className="relative group">
                     <select 
                        value={selectedCompany} 
                        onChange={(e) => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
                        className="pl-3 pr-8 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded-md text-xs font-medium outline-none focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer appearance-none hover:bg-white dark:hover:bg-slate-600 transition-colors"
                     >
                        <option className="dark:bg-slate-800" value="All">{t.common.allCompanies}</option>
                        {contractors.map(c => <option className="dark:bg-slate-800" key={c} value={c}>{c}</option>)}
                     </select>
                     <Filter size={12} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                 </div>

                 {/* Department Filter */}
                 <div className="relative group">
                     <select 
                        value={selectedDepartment} 
                        onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
                        className="pl-3 pr-8 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded-md text-xs font-medium outline-none focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer appearance-none hover:bg-white dark:hover:bg-slate-600 transition-colors"
                     >
                        <option className="dark:bg-slate-800" value="All">{t.common.allDepts}</option>
                        {DEPARTMENTS.map(d => <option className="dark:bg-slate-800" key={d} value={d}>{d}</option>)}
                     </select>
                     <Filter size={12} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                 </div>

                 {/* Search Box */}
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
                 
                 <button 
                    onClick={handleBulkQrDownload}
                    disabled={isZipping || processedData.length === 0}
                    className={`flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-purple-500 shadow-sm transition-all
                        ${isZipping ? 'opacity-70 cursor-wait' : ''}
                    `}
                >
                    {isZipping ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
                    {isZipping ? 'Zipping...' : 'Mass QRs'}
                </button>

                 <button 
                    onClick={handleExportDatabase}
                    className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-emerald-500 shadow-sm"
                >
                    <Download size={14} /> Export DB
                </button>
             </div>
        </div>

        {/* High Density Table */}
        <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                 <thead className="bg-gray-100 dark:bg-slate-700 md:sticky md:top-0 z-10 shadow-sm">
                     <tr>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-20">ID</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-32">{t.common.name}</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-24">Dept</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-24">Job Title</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase w-24 hidden md:table-cell">{t.common.company}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-12">{t.database.active}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-24">{t.database.accessStatus}</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-24">{t.database.aso}</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase pl-4 border-l border-gray-300 dark:border-slate-600">RAC Matrix (Left)</th>
                         <th className="px-2 py-2 text-left text-[10px] font-bold text-black dark:text-gray-300 uppercase pl-4 border-l border-gray-300 dark:border-slate-600">{t.database.opsMatrix} (Right)</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-12">Edit</th>
                         <th className="px-2 py-2 text-center text-[10px] font-bold text-black dark:text-gray-300 uppercase w-12">QR</th>
                     </tr>
                 </thead>
                 <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                     {paginatedData.length === 0 ? (
                         <tr><td colSpan={13} className="p-8 text-center text-gray-400">No records found.</td></tr>
                     ) : (
                         paginatedData.map(({ emp, req, status, isAsoValid, isDlExpired, isActive, hasRac02Req }) => (
                             <tr key={emp.id} className={`hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors`}>
                                 <td className="px-2 py-2 text-xs font-mono text-black dark:text-gray-400">{emp.recordId}</td>
                                 <td className="px-2 py-2"><span className={`text-xs font-bold truncate max-w-[150px] text-slate-900 dark:text-slate-200`}>{emp.name}</span></td>
                                 <td className="px-2 py-2 text-[10px] text-slate-600 dark:text-gray-400 truncate max-w-[100px]">{emp.department}</td>
                                 <td className="px-2 py-2 text-[10px] text-slate-600 dark:text-gray-400 truncate max-w-[100px]">{emp.role}</td>
                                 <td className="px-2 py-2 text-[10px] text-black dark:text-gray-400 hidden md:table-cell truncate max-w-[100px]" title={emp.company}>{emp.company}</td>
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
                                     <input 
                                        type="date" 
                                        min="1900-01-01"
                                        max="2100-12-31"
                                        className={`border dark:border-slate-600 rounded px-1 py-0.5 text-[10px] text-center w-24 bg-transparent focus:ring-1 focus:ring-yellow-500 ${!isAsoValid ? 'text-red-600 font-bold bg-red-50 dark:bg-red-900/10' : 'text-black dark:text-gray-300'}`} 
                                        value={req.asoExpiryDate || ''} 
                                        onChange={e => handleAsoChange(emp.id, e.target.value)} 
                                     />
                                 </td>
                                 <td className="px-2 py-2 border-l border-gray-100 dark:border-slate-700">
                                     <div className="flex flex-wrap gap-1 w-full min-w-[250px]">
                                         {racDefinitions.map(def => {
                                             const key = def.code;
                                             // AUTOMATICALLY ENABLE CHECK IF A VALID RECORD EXISTS (Visual Fix)
                                             const trainingDate = getTrainingStatus(emp.id, key);
                                             const today = new Date().toISOString().split('T')[0];
                                             const isValid = trainingDate && trainingDate > today;
                                             
                                             // IMPORTANT: "Required" logic visual update.
                                             // If it's valid, it should show Green regardless of "requiredRacs" state, implying it's "Mapped"
                                             const isRequired = req.requiredRacs[key] || isValid; 
                                             
                                             const isRac02Blocked = key === 'RAC02' && isDlExpired;
                                             let bgClass = 'bg-gray-100 dark:bg-slate-700 text-gray-300';
                                             if (isRequired) {
                                                if (isValid && !isRac02Blocked) bgClass = 'bg-green-50 text-white shadow-sm';
                                                else bgClass = 'bg-red-50 text-white shadow-sm';
                                             } else {
                                                 bgClass = 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-slate-700';
                                             }
                                             return <button key={key} onClick={() => handleRequirementChange(emp.id, key, !req.requiredRacs[key])} className={`text-[9px] font-bold w-10 h-6 rounded flex items-center justify-center transition-all ${bgClass}`} title={def.name}>{key.replace('RAC', 'R')}</button>;
                                         })}
                                     </div>
                                 </td>
                                 <td className="px-2 py-2 border-l border-gray-100 dark:border-slate-700">
                                     <div className="flex flex-wrap gap-1 w-full min-w-[250px]">
                                         {OPS_KEYS.map(key => {
                                             const isPermission = PERMISSION_KEYS.includes(key);
                                             let isValid = false;
                                             if (isPermission) {
                                                 isValid = req.requiredRacs[key] || false; 
                                             } else {
                                                 const trainingDate = getTrainingStatus(emp.id, key);
                                                 const today = new Date().toISOString().split('T')[0];
                                                 isValid = !!(trainingDate && trainingDate > today);
                                             }
                                             
                                             // Same logic: If Valid record found (for non-permissions), implied mapped
                                             const isRequired = req.requiredRacs[key] || (!isPermission && isValid);

                                             let bgClass = 'bg-gray-100 dark:bg-slate-700 text-gray-300';
                                             if (isRequired) {
                                                 if (isPermission && isValid) bgClass = 'bg-blue-600 text-white shadow-sm';
                                                 else if (!isPermission && isValid) bgClass = 'bg-green-50 text-white shadow-sm';
                                                 else bgClass = 'bg-red-50 text-white shadow-sm';
                                             } else {
                                                 bgClass = 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-slate-700';
                                             }
                                             const label = t.database.ops[key as keyof typeof t.database.ops] || key;
                                             return <button key={key} onClick={() => handleRequirementChange(emp.id, key, !req.requiredRacs[key])} className={`text-[9px] font-bold px-2 h-6 min-w-[2.5rem] rounded flex items-center justify-center transition-all whitespace-nowrap ${bgClass}`} title={label}>{label}</button>;
                                         })}
                                     </div>
                                 </td>
                                 <td className="px-2 py-2 text-center">
                                     <button onClick={() => setEditingEmployee(emp)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-600 transition-colors"><Edit size={14} /></button>
                                 </td>
                                 <td className="px-2 py-2 text-center">
                                     <button onClick={() => setQrEmployee(emp)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-purple-600 transition-colors"><QrCode size={14} /></button>
                                 </td>
                             </tr>
                         ))
                     )}
                 </tbody>
             </table>
        </div>

        <div className="shrink-0 p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-600 dark:text-gray-400">{t.common.rowsPerPage}</span>
                     <select 
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-2 py-1 outline-none focus:ring-1 focus:ring-yellow-500"
                     >
                         <option className="dark:bg-slate-800" value={10}>10</option>
                         <option className="dark:bg-slate-800" value={20}>20</option>
                         <option className="dark:bg-slate-800" value={30}>30</option>
                         <option className="dark:bg-slate-800" value={50}>50</option>
                         <option className="dark:bg-slate-800" value={100}>100</option>
                         <option className="dark:bg-slate-800" value={120}>120</option>
                     </select>
                 </div>
                 
                 <div className="flex items-center gap-4 border-l border-slate-300 dark:border-slate-600 pl-4">
                    <div className="text-xs text-slate-600 dark:text-gray-400">
                        {t.common.page} {currentPage} {t.common.of} {totalPages} ({processedData.length} items)
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronLeft size={16} /></button>
                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronRight size={16} /></button>
                    </div>
                 </div>
             </div>
        </div>

        {/* --- CONFIRMATION MODAL --- */}
        <ConfirmModal 
            isOpen={confirmState.isOpen}
            title={confirmState.title}
            message={confirmState.message}
            onConfirm={confirmState.onConfirm}
            onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
            isDestructive={confirmState.isDestructive}
            confirmText={confirmState.isDestructive ? 'Delete' : 'Confirm'}
        />

        {/* --- EDIT MODAL --- */}
        {editingEmployee && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingEmployee(null)}>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold text-lg dark:text-white">Edit Employee</h3>
                        <button onClick={() => setEditingEmployee(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                            <X size={20}/>
                        </button>
                    </div>
                    <div className="space-y-3">
                        <input className="w-full border rounded p-2 text-black dark:bg-slate-700 dark:text-white dark:border-slate-600" value={editingEmployee.name} onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})} placeholder="Name" />
                        <div className="flex gap-2">
                            <input className="flex-1 border rounded p-2 text-black dark:bg-slate-700 dark:text-white dark:border-slate-600" value={editingEmployee.recordId} onChange={e => setEditingEmployee({...editingEmployee, recordId: e.target.value})} placeholder="ID" />
                            <select className="flex-1 border rounded p-2 text-black dark:bg-slate-700 dark:text-white dark:border-slate-600" value={editingEmployee.company} onChange={e => setEditingEmployee({...editingEmployee, company: e.target.value})}>
                                {contractors.length > 0 ? (
                                    contractors.map(c => <option className="dark:bg-slate-700" key={c} value={c}>{c}</option>)
                                ) : (
                                    <option className="dark:bg-slate-700" value="Unknown">Unknown</option>
                                )}
                            </select>
                        </div>
                        <div className="border-t pt-2 mt-2 dark:border-slate-600">
                            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-2">Driver License Details</p>
                            <div className="grid grid-cols-3 gap-2">
                                <input className="border rounded p-2 text-xs text-black dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="Number" value={editingEmployee.driverLicenseNumber || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseNumber: e.target.value})} />
                                <input className="border rounded p-2 text-xs text-black dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="Class" value={editingEmployee.driverLicenseClass || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseClass: e.target.value})} />
                                <input 
                                    type="date" 
                                    min="1900-01-01"
                                    max="2100-12-31"
                                    className="border rounded p-2 text-xs text-black dark:bg-slate-700 dark:text-white dark:border-slate-600" 
                                    value={editingEmployee.driverLicenseExpiry || ''} 
                                    onChange={e => {
                                        if (validateDateInput(e.target.value)) {
                                            setEditingEmployee({...editingEmployee, driverLicenseExpiry: e.target.value});
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 mt-6 border-t pt-4 dark:border-slate-600">
                        <button onClick={handleDelete} className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"><Trash2 size={16}/> Delete</button>
                        <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-500">Save Changes</button>
                    </div>
                </div>
            </div>
        )}

        {/* --- ID CARD BACK MODAL (QR & Emergency) --- */}
        {qrEmployee && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setQrEmployee(null)}>
                <div className="bg-white rounded-3xl shadow-2xl p-0 overflow-hidden max-w-2xl w-full flex flex-col md:flex-row relative" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Close X (Absolute) */}
                    <button 
                        onClick={() => setQrEmployee(null)} 
                        className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors md:hidden"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Preview */}
                    <div className="p-8 bg-slate-100 flex-1 flex flex-col items-center justify-center border-r border-slate-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Card Back Preview</h3>
                        
                        {/* THE CARD BACK (CR80 Aspect Ratio ~ 85.6 x 54) -> Scaled up for screen */}
                        <div id="card-back-print" className="bg-white w-[85.6mm] h-[54mm] rounded-lg shadow-xl border border-slate-200 relative overflow-hidden flex flex-col" style={{ transform: 'scale(1.2)' }}>
                            {/* Header */}
                            <div className="bg-slate-900 text-white h-[8mm] flex items-center justify-center">
                                <span className="text-[10px] font-black tracking-widest">SAFETY PASSPORT / PASSAPORTE</span>
                            </div>
                            
                            {/* Body */}
                            <div className="flex-1 flex items-center justify-center p-2 relative">
                                {/* Large QR */}
                                <img 
                                    src={getQrUrl(qrEmployee.recordId)} 
                                    alt="QR Code"
                                    className="w-[28mm] h-[28mm]" 
                                />
                                
                                {/* Right Side Info */}
                                <div className="ml-4 flex flex-col justify-center h-full space-y-2">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase">Employee ID</div>
                                    <div className="text-sm font-black text-slate-900">{qrEmployee.recordId}</div>
                                    
                                    <div className="h-px bg-slate-200 w-full my-2"></div>
                                    
                                    <div className="flex items-center gap-1 text-red-600">
                                        <AlertTriangle size={10} />
                                        <span className="text-[7px] font-bold uppercase">Emergency / Emergência</span>
                                    </div>
                                    <div className="text-xs font-black text-slate-900">842030</div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-100 border-t border-gray-300 h-[6mm] flex items-center justify-center text-[6px] text-gray-500 text-center px-2">
                                IF FOUND PLEASE RETURN TO VULCAN SECURITY DEPARTMENT
                            </div>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="p-8 w-full md:w-72 bg-white flex flex-col justify-center space-y-4 relative">
                        {/* Desktop Close X */}
                        <button 
                            onClick={() => setQrEmployee(null)} 
                            className="absolute top-4 right-4 hidden md:flex p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-4">
                            <h2 className="text-xl font-black text-slate-900">{qrEmployee.name}</h2>
                            <p className="text-sm text-slate-500 font-mono">{qrEmployee.recordId}</p>
                        </div>

                        <button 
                            onClick={() => handleDownloadQr(qrEmployee.recordId, qrEmployee.name)}
                            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download size={18} /> Download QR
                        </button>

                        <button 
                            onClick={() => {
                                const win = window.open('', '', 'width=800,height=600');
                                if (win) {
                                    win.document.write(`
                                        <html>
                                            <head>
                                                <title>Print Back - ${qrEmployee.recordId}</title>
                                                <style>
                                                    @page { size: 85.6mm 54mm; margin: 0; }
                                                    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: sans-serif; }
                                                    .card { width: 85.6mm; height: 54mm; position: relative; background: white; overflow: hidden; display: flex; flex-direction: column; }
                                                    .header { background: #0f172a; color: white; height: 8mm; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; letter-spacing: 2px; }
                                                    .body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2mm; }
                                                    .qr { width: 28mm; height: 28mm; }
                                                    .info { margin-left: 4mm; display: flex; flex-direction: column; justify-content: center; }
                                                    .label { font-size: 8px; font-weight: bold; color: #94a3b8; text-transform: uppercase; }
                                                    .value { font-size: 14px; font-weight: 900; color: #0f172a; }
                                                    .divider { height: 1px; background: #e2e8f0; width: 100%; margin: 2mm 0; }
                                                    .alert { display: flex; align-items: center; gap: 2px; color: #dc2626; font-size: 7px; font-weight: bold; text-transform: uppercase; }
                                                    .emergency { font-size: 12px; font-weight: 900; color: #0f172a; }
                                                    .footer { background: #f1f5f9; border-top: 1px solid #cbd5e1; height: 6mm; display: flex; align-items: center; justify-content: center; font-size: 6px; color: #64748b; text-align: center; padding: 0 2mm; }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="card">
                                                    <div class="header">SAFETY PASSPORT</div>
                                                    <div class="body">
                                                        <img src="${getQrUrl(qrEmployee.recordId)}" class="qr" />
                                                        <div class="info">
                                                            <div class="label">Employee ID</div>
                                                            <div class="value">${qrEmployee.recordId}</div>
                                                            <div class="divider"></div>
                                                            <div class="alert">EMERGENCY / EMERGÊNCIA</div>
                                                            <div class="emergency">842030</div>
                                                        </div>
                                                    </div>
                                                    <div class="footer">IF FOUND PLEASE RETURN TO VULCAN SECURITY DEPARTMENT</div>
                                                </div>
                                                <script>window.onload = function() { window.print(); window.close(); }</script>
                                            </body>
                                        </html>
                                    `);
                                    win.document.close();
                                }
                            }}
                            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                            <Printer size={18} /> Print Card Back
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default DatabasePage;
