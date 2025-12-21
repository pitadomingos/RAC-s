
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession, RacDef, SystemNotification } from '../types';
import { COMPANIES, OPS_KEYS, PERMISSION_KEYS, DEPARTMENTS, RAC_KEYS } from '../constants';
import { Search, CheckCircle, XCircle, Edit, ChevronLeft, ChevronRight, Download, X, Trash2, QrCode, Printer, Phone, AlertTriangle, Loader2, Archive, Filter, Smartphone, FileSpreadsheet, ArrowRight, Settings, Database as DbIcon, ShieldCheck, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import JSZip from 'jszip';
import ConfirmModal from '../components/ConfirmModal';
import { v4 as uuidv4 } from 'uuid';
import { format, addMonths, isValid, parseISO } from 'date-fns';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
  sessions: TrainingSession[];
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  racDefinitions: RacDef[];
  importBookings?: (newBookings: Booking[], sideEffects?: { employee: Employee, aso: string, ops: Record<string, boolean> }[]) => void;
  addNotification: (notif: SystemNotification) => void;
  currentSiteId: string;
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements, sessions, onUpdateEmployee, onDeleteEmployee, racDefinitions, importBookings, addNotification, currentSiteId }) => {
  const { t, language } = useLanguage();
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [accessStatusFilter, setAccessStatusFilter] = useState<'All' | 'Granted' | 'Blocked'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [importPreview, setImportPreview] = useState<string[][]>([]); 
  const [columnMapping, setColumnMapping] = useState<{
      recordId: string;
      name: string;
      company: string;
      department: string;
      role: string;
      phone: string;
      asoExpiry: string;
      dlNumber: string;
      dlClass: string;
      dlExpiry: string;
      racs: Record<string, string>; 
  }>({
      recordId: '', name: '', company: '', department: '', role: '', phone: '',
      asoExpiry: '', dlNumber: '', dlClass: '', dlExpiry: '', racs: {}
  });

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

  const validateDateInput = (dateStr: string): boolean => {
      if (!dateStr) return true;
      if (dateStr.includes('/')) return false; 
      const parts = dateStr.split('-');
      if (parts.length !== 3) return false;
      const year = parseInt(parts[0]);
      if (year < 1900 || year > 2100) return false;
      return true;
  };

  const parseImportDate = (dateStr: string): Date | null => {
      if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') return null;
      try {
        const cleanStr = dateStr.trim();
        if (cleanStr.match(/^\d{4}-\d{2}-\d{2}$/)) return parseISO(cleanStr);
        const dmY = cleanStr.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
        if (dmY) {
            return new Date(parseInt(dmY[3]), parseInt(dmY[2]) - 1, parseInt(dmY[1]));
        }
        const d = new Date(cleanStr);
        return isValid(d) ? d : null;
      } catch { return null; }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (confirmState.isOpen) setConfirmState(prev => ({ ...prev, isOpen: false }));
            else if (qrEmployee) setQrEmployee(null);
            else if (editingEmployee) setEditingEmployee(null);
            else if (showImportModal) setShowImportModal(false);
        }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [qrEmployee, editingEmployee, confirmState.isOpen, showImportModal]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result;
          if (typeof text !== 'string') return;
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length < 2) {
              addNotification({
                  id: uuidv4(),
                  type: 'alert',
                  title: 'Import Error',
                  message: 'Invalid CSV: Not enough data rows.',
                  timestamp: new Date(),
                  isRead: false
              });
              return;
          }
          const firstLine = lines[0];
          const separator = firstLine.includes(';') ? ';' : ',';
          const headers = firstLine.split(separator).map(h => h.trim().replace(/^"|"$/g, ''));
          setCsvHeaders(headers);
          const preview = lines.slice(1, 4).map(l => l.split(separator).map(c => c.trim().replace(/^"|"$/g, '')));
          setImportPreview(preview);
          const newMapping = { 
              recordId: '', name: '', company: '', department: '', role: '', phone: '',
              asoExpiry: '', dlNumber: '', dlClass: '', dlExpiry: '', racs: {} as Record<string, string>
          };
          const findHeader = (keywords: string[]) => headers.find(h => keywords.some(k => h.toLowerCase().includes(k.toLowerCase()))) || '';
          newMapping.recordId = findHeader(['id', 'record', 'matricula', 'number', 'employee_id']);
          newMapping.name = findHeader(['name', 'nome', 'full', 'employee_name']);
          newMapping.company = findHeader(['company', 'empresa', 'source']);
          newMapping.department = findHeader(['dept', 'departamento', 'area']);
          newMapping.role = findHeader(['role', 'job', 'funcao', 'cargo']);
          newMapping.phone = findHeader(['phone', 'celular', 'mobile']);
          newMapping.asoExpiry = findHeader(['aso', 'medical', 'medico', 'exam']);
          newMapping.dlNumber = findHeader(['dl num', 'carta num', 'licence']);
          newMapping.dlClass = findHeader(['class', 'classe']);
          newMapping.dlExpiry = findHeader(['dl exp', 'carta val']);
          racDefinitions.forEach(rac => {
              const match = headers.find(h => {
                  const normalizedHeader = h.toLowerCase().replace(/[\s-_]/g, '');
                  const normalizedCode = rac.code.toLowerCase().replace(/[\s-_]/g, '');
                  return normalizedHeader.includes(normalizedCode);
              });
              if (match) newMapping.racs[rac.code] = match;
          });
          OPS_KEYS.forEach(key => {
               const match = headers.find(h => h.toLowerCase().includes(key.toLowerCase()));
               if (match) newMapping.racs[key] = match;
          });
          setColumnMapping(newMapping);
          setShowImportModal(true);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processImport = () => {
      if (!importFile) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result;
          if (typeof text !== 'string') return;
          try {
            const lines = text.split('\n').filter(l => l.trim().length > 0);
            const separator = lines[0].includes(';') ? ';' : ',';
            const headers = lines[0].split(separator).map(h => h.trim().replace(/^"|"$/g, ''));
            const dataRows = lines.slice(1);
            const newBookings: Booking[] = [];
            const sideEffects: { employee: Employee, aso: string, ops: Record<string, boolean> }[] = [];
            let updatedCount = 0;
            let skippedRows = 0;
            const getIdx = (headerName: string) => headers.indexOf(headerName);
            dataRows.forEach(line => {
                const cols = line.split(separator).map(c => c.trim().replace(/^"|"$/g, ''));
                const idVal = columnMapping.recordId ? (cols[getIdx(columnMapping.recordId)] || '') : '';
                const nameVal = columnMapping.name ? (cols[getIdx(columnMapping.name)] || '') : '';
                if (!idVal || !nameVal) {
                    skippedRows++;
                    return;
                }
                const emp: Employee = {
                    id: idVal,
                    recordId: idVal,
                    name: nameVal,
                    company: columnMapping.company ? (cols[getIdx(columnMapping.company)] || 'Unknown') : 'Unknown',
                    department: columnMapping.department ? (cols[getIdx(columnMapping.department)] || 'Operations') : 'Operations',
                    role: columnMapping.role ? (cols[getIdx(columnMapping.role)] || 'Staff') : 'Staff',
                    phoneNumber: columnMapping.phone ? (cols[getIdx(columnMapping.phone)] || '') : '',
                    driverLicenseNumber: columnMapping.dlNumber ? (cols[getIdx(columnMapping.dlNumber)] || '') : '',
                    driverLicenseClass: columnMapping.dlClass ? (cols[getIdx(columnMapping.dlClass)] || '') : '',
                    driverLicenseExpiry: '',
                    isActive: true,
                    siteId: currentSiteId !== 'all' ? currentSiteId : 's1'
                };
                const dlExpRaw = columnMapping.dlExpiry ? (cols[getIdx(columnMapping.dlExpiry)] || '') : '';
                const dlDate = parseImportDate(dlExpRaw);
                if (dlDate) emp.driverLicenseExpiry = format(dlDate, 'yyyy-MM-dd');
                const asoRaw = columnMapping.asoExpiry ? (cols[getIdx(columnMapping.asoExpiry)] || '') : '';
                const asoDate = parseImportDate(asoRaw);
                const asoStr = asoDate ? format(asoDate, 'yyyy-MM-dd') : '';
                Object.entries(columnMapping.racs).forEach(([racCode, headerName]) => {
                    const hName = headerName as string;
                    if (!hName) return;
                    const colIdx = getIdx(hName);
                    if (colIdx === -1) return;
                    const val = cols[colIdx] || '';
                    if (!val || val.trim() === '') return;
                    let status = BookingStatus.PENDING;
                    let resultDate = '';
                    let expiryDate = '';
                    let isTrainingRecord = false;
                    const dateVal = parseImportDate(val);
                    if (dateVal) {
                        status = BookingStatus.PASSED;
                        expiryDate = format(dateVal, 'yyyy-MM-dd');
                        const resD = new Date(dateVal);
                        resD.setFullYear(resD.getFullYear() - 2);
                        resultDate = format(resD, 'yyyy-MM-dd');
                        isTrainingRecord = true;
                    } else if (['yes', 'sim', 'ok', '1', 'true', 'valid'].includes(val.toLowerCase())) {
                        status = BookingStatus.PASSED;
                        resultDate = new Date().toISOString().split('T')[0];
                        expiryDate = format(addMonths(new Date(), 24), 'yyyy-MM-dd');
                        isTrainingRecord = true;
                    }
                    if (isTrainingRecord) {
                        newBookings.push({
                            id: uuidv4(),
                            sessionId: racCode,
                            employee: { ...emp, id: uuidv4() },
                            status: status,
                            resultDate,
                            expiryDate,
                            attendance: true
                        });
                    }
                });
                const ops: Record<string, boolean> = {};
                Object.keys(columnMapping.racs).forEach(key => {
                    const hName = columnMapping.racs[key] as string;
                    if (hName) {
                        const colIdx = getIdx(hName);
                        if (colIdx !== -1) {
                            const val = cols[colIdx] || '';
                            if (val && val.trim().length > 0) {
                                ops[key] = true;
                            }
                        }
                    }
                });
                sideEffects.push({ employee: emp, aso: asoStr, ops });
                updatedCount++;
            });
            if (importBookings) {
                importBookings(newBookings, sideEffects);
                addNotification({
                    id: uuidv4(),
                    type: 'success',
                    title: t.database.importSuccess,
                    message: `Processed ${updatedCount} employees. Created ${newBookings.length} records.`,
                    timestamp: new Date(),
                    isRead: false
                });
                setShowImportModal(false);
            }
          } catch (e) {
              addNotification({
                  id: uuidv4(),
                  type: 'alert',
                  title: 'Import Failed',
                  message: 'Error processing file.',
                  timestamp: new Date(),
                  isRead: false
              });
          }
      };
      reader.readAsText(importFile);
  };

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
        const session = sessions.find(s => s.id === b.sessionId);
        if (session) racCode = session.racType;
        else racCode = b.sessionId;
        if (racCode.includes('|')) racCode = racCode.split('|')[0];
        racCode = racCode.replace(/\s*\(imp\)\s*/gi, '');
        if (racCode.includes('-')) racCode = racCode.split('-')[0];
        racCode = racCode.replace(/\s+/g, '').trim().toUpperCase();
        const targetKey = racKey.replace(/\s+/g, '').trim().toUpperCase();
        return racCode === targetKey;
    });
    relevantBookings.sort((a, b) => {
        const dateA = new Date(a.expiryDate || '1970-01-01').getTime();
        const dateB = new Date(b.expiryDate || '1970-01-01').getTime();
        return dateB - dateA;
    });
    return relevantBookings.length > 0 ? relevantBookings[0].expiryDate || null : null;
  };

  const handleRequirementChange = (empId: string, racKey: string, isRequired: boolean) => {
    const current = getRequirement(empId);
    const newRequiredRacs = { ...current.requiredRacs, [racKey]: isRequired };
    if (isRequired) {
        if (racKey === 'LIB_OPS') newRequiredRacs['LIB_MOV'] = false;
        else if (racKey === 'LIB_MOV') newRequiredRacs['LIB_OPS'] = false;
    }
    const updated = { ...current, employeeId: empId, requiredRacs: newRequiredRacs };
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
              title: t.database.confirmDeactivate,
              message: t.database.confirmDeactivateMsg,
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
              phoneNumber: editingEmployee.phoneNumber,
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
              title: t.database.confirmDelete,
              message: t.database.confirmDeleteMsg,
              onConfirm: () => {
                  onDeleteEmployee(editingEmployee.id);
                  setEditingEmployee(null);
              },
              isDestructive: true
          });
      }
  };

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
          addNotification({ id: uuidv4(), type: 'alert', title: 'Download Error', message: 'Error downloading QR Code.', timestamp: new Date(), isRead: false });
      }
  };

  const handleBulkQrDownload = async () => {
      if (processedData.length === 0) return;
      const confirmMsg = String(t.database.bulkQrMessage || '').replace('{count}', String(processedData.length));
      if (!confirm(confirmMsg)) return;

      setIsZipping(true);
      const zip = new JSZip();
      const brand = language === 'pt' ? 'racs' : 'cars';
      const folder = zip.folder(`${brand}_safety_qrs`);

      try {
          const limit = 500; 
          const dataToProcess = processedData.slice(0, limit);
          for (const item of dataToProcess) {
              const { emp } = item;
              const url = getQrUrl(emp.recordId);
              try {
                  const response = await fetch(url);
                  if (response.ok) {
                      const blob = await response.blob();
                      const safeName = emp.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                      const safeId = emp.recordId.replace(/[^a-z0-9]/gi, '_');
                      folder?.file(`${safeName}_${safeId}.png`, blob);
                  }
              } catch (e) {}
          }
          const content = await zip.generateAsync({ type: "blob" });
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(content);
          downloadLink.download = `${brand}_qr_batch_${new Date().toISOString().split('T')[0]}.zip`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      } catch (err) {
          addNotification({ id: uuidv4(), type: 'alert', title: 'Archive Error', message: 'An error occurred generating archive.', timestamp: new Date(), isRead: false });
      } finally {
          setIsZipping(false);
      }
  };

  const handleExportDatabase = () => {
      const baseHeaders = ["Full Name", "Record ID", "Company", "Department", "Role", "Active", "Access Status", "Phone Number", "ASO Expiry", "DL Number", "DL Class", "DL Expiry"];
      const racHeaders = racDefinitions.map(r => r.code);
      const opsHeaders = OPS_KEYS;
      const headers = [...baseHeaders, ...racHeaders, ...opsHeaders];
      const brand = language === 'pt' ? 'racs' : 'cars';
      
      const rows = processedData.map(({ emp, req, status }) => {
          const racValues = racDefinitions.map(r => req.requiredRacs[r.code] ? 'TRUE' : 'FALSE');
          const opsValues = OPS_KEYS.map(k => req.requiredRacs[k] ? 'TRUE' : 'FALSE');
          return [`"${emp.name}"`, emp.recordId, emp.company, emp.department, emp.role, emp.isActive ? 'TRUE' : 'FALSE', status, emp.phoneNumber || '', req.asoExpiryDate || '', emp.driverLicenseNumber || '', emp.driverLicenseClass || '', emp.driverLicenseExpiry || '', ...racValues, ...opsValues];
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${brand}_database_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const processedData = useMemo(() => {
    return uniqueEmployees.map(emp => {
      const req = getRequirement(emp.id);
      const today = new Date().toISOString().split('T')[0];
      const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
      const dlExpiry = emp.driverLicenseExpiry || '';
      const isDlExpired = !!(dlExpiry && dlExpiry <= today) || !dlExpiry;
      const isActive = emp.isActive ?? true;

      // COMPLEX RAC 02 / DRIVING LOGIC
      let allRacsMet = true;
      const mappedRacs = Object.entries(req.requiredRacs).filter(([_, val]) => val === true).map(([k]) => k);
      
      const drivingRacs = ['RAC02', 'RAC11', 'LIB_MOV'];
      // Multiskilled workers have non-driving RACs mapped.
      const isMultiskilled = mappedRacs.some(k => !drivingRacs.includes(k) && !OPS_KEYS.includes(k));

      racDefinitions.forEach(def => {
          const key = def.code;
          if (!req.requiredRacs[key]) return;

          // If it's a driving requirement
          if (drivingRacs.includes(key)) {
              if (isDlExpired) {
                  // Only block if they aren't multiskilled (i.e. they are exclusively a driver)
                  if (!isMultiskilled) {
                      allRacsMet = false;
                  }
              } else {
                  // Check training standard
                  const trainingExpiry = getTrainingStatus(emp.id, key);
                  if (!trainingExpiry || trainingExpiry <= today) allRacsMet = false;
              }
          } else {
              // Standard RAC checking
              const trainingExpiry = getTrainingStatus(emp.id, key);
              if (!trainingExpiry || trainingExpiry <= today) allRacsMet = false;
          }
      });

      let status: 'Granted' | 'Blocked' = 'Granted';
      if (!isActive) status = 'Blocked';
      else if (!isAsoValid || !allRacsMet) status = 'Blocked';

      return { emp, req, status, isAsoValid, isDlExpired, isActive };
    }).filter(item => {
        if (currentSiteId !== 'all' && item.emp.siteId !== currentSiteId) {
            const sId = item.emp.siteId || 's1';
            if (sId !== currentSiteId) return false;
        }
        if (selectedCompany !== 'All' && item.emp.company !== selectedCompany) return false;
        if (selectedDepartment !== 'All' && item.emp.department !== selectedDepartment) return false;
        if (accessStatusFilter !== 'All' && item.status !== accessStatusFilter) return false;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            return item.emp.name.toLowerCase().includes(lower) || item.emp.recordId.toLowerCase().includes(lower);
        }
        return true;
    });
  }, [uniqueEmployees, requirements, bookings, sessions, selectedCompany, selectedDepartment, accessStatusFilter, searchTerm, racDefinitions, currentSiteId]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
             
             <div className="flex flex-wrap items-center gap-2">
                 <div className="relative group">
                     <select 
                        value={selectedCompany} 
                        onChange={(e) => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
                        className="pl-3 pr-8 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded-md text-xs font-medium outline-none focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer appearance-none hover:bg-white dark:hover:bg-slate-600 transition-colors"
                     >
                        <option value="All">{t.common.all}</option>
                        {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <Filter size={12} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                 </div>

                 <div className="relative group">
                     <select 
                        value={selectedDepartment} 
                        onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
                        className="pl-3 pr-8 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-black dark:text-white rounded-md text-xs font-medium outline-none focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer appearance-none hover:bg-white dark:hover:bg-slate-600 transition-colors"
                     >
                        <option value="All">{t.common.all}</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                     <Filter size={12} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                 </div>

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
                    {isZipping ? t.database.zipping : t.database.massQr}
                </button>

                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-500 shadow-sm"
                >
                    <FileSpreadsheet size={14} /> {t.database.wizard}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileSelect} />

                 <button 
                    onClick={handleExportDatabase}
                    className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-emerald-500 shadow-sm"
                >
                    <Download size={14} /> {t.database.exportDb}
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-900/50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">ASO Expiry</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-red-500 uppercase tracking-wider">DL Number</th>
                        <th className="px-2 py-3 text-center text-[10px] font-bold text-red-500 uppercase tracking-wider">Class</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-red-500 uppercase tracking-wider">DL Expiry</th>
                        {racDefinitions.map(rac => (
                            <th key={rac.id} className="px-2 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">{rac.code}</th>
                        ))}
                        {OPS_KEYS.map(key => (
                            <th key={key} className="px-2 py-3 text-center text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{key}</th>
                        ))}
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                    {paginatedData.map(({ emp, req, status, isAsoValid, isDlExpired, isActive }) => (
                        <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                                {status === 'Granted' ? (
                                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                        <CheckCircle size={14} /> {t.database.granted}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
                                        <XCircle size={14} /> {t.database.blocked}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</div>
                                <div className="text-xs text-slate-500 font-mono">{emp.recordId} • {emp.company}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <input 
                                    type="date" 
                                    value={req.asoExpiryDate}
                                    onChange={(e) => handleAsoChange(emp.id, e.target.value)}
                                    className={`text-xs border rounded p-1 outline-none ${isAsoValid ? 'border-gray-200 dark:border-slate-600' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}
                                />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-600 dark:text-slate-400">
                                {emp.driverLicenseNumber || '-'}
                            </td>
                            <td className="px-2 py-3 text-center whitespace-nowrap text-xs font-bold text-slate-600 dark:text-slate-400">
                                {emp.driverLicenseClass || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs font-mono">
                                <span className={isDlExpired ? 'text-red-500 font-bold' : 'text-slate-600 dark:text-slate-400'}>
                                    {emp.driverLicenseExpiry || '-'}
                                </span>
                            </td>
                            {racDefinitions.map(rac => {
                                const expiry = getTrainingStatus(emp.id, rac.code);
                                const isRequired = !!req.requiredRacs[rac.code];
                                const isExpired = expiry && expiry <= new Date().toISOString().split('T')[0];
                                
                                return (
                                    <td key={rac.id} className="px-1 py-3 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <input 
                                                type="checkbox"
                                                checked={isRequired}
                                                onChange={(e) => handleRequirementChange(emp.id, rac.code, e.target.checked)}
                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            {isRequired && (
                                                <span className={`text-[9px] font-bold px-1 rounded ${!expiry ? 'text-red-500' : isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                    {expiry ? format(new Date(expiry), 'dd/MM/yy') : 'MISSING'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                            {OPS_KEYS.map(key => (
                                <td key={key} className="px-1 py-3 text-center">
                                    <input 
                                        type="checkbox"
                                        checked={!!req.requiredRacs[key]}
                                        onChange={(e) => handleRequirementChange(emp.id, key, e.target.checked)}
                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                </td>
                            ))}
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setQrEmployee(emp)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors" title="QR Code"><QrCode size={16}/></button>
                                    <button onClick={() => setEditingEmployee(emp)} className="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors" title="Edit"><Edit size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="shrink-0 p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{t.common.rowsPerPage}</span>
                <select value={itemsPerPage} onChange={handlePageSizeChange} className="text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-black dark:text-white px-2 py-1">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{t.common.page} {currentPage} {t.common.of} {Math.max(1, totalPages)}</span>
                <div className="flex gap-1">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronLeft size={16}/></button>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronRight size={16}/></button>
                </div>
            </div>
        </div>

        <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onClose={() => setConfirmState(prev => ({...prev, isOpen: false}))} isDestructive={confirmState.isDestructive} />

        {editingEmployee && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-slate-800 dark:text-white">{t.database.editModal}</h3>
                        <button onClick={() => setEditingEmployee(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                <input type="text" value={editingEmployee.name} onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm outline-none focus:ring-2 focus:ring-yellow-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Record ID</label>
                                <input type="text" value={editingEmployee.recordId} onChange={e => setEditingEmployee({...editingEmployee, recordId: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm outline-none focus:ring-2 focus:ring-yellow-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Company</label>
                                <select value={editingEmployee.company} onChange={e => setEditingEmployee({...editingEmployee, company: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm">
                                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Department</label>
                                <select value={editingEmployee.department} onChange={e => setEditingEmployee({...editingEmployee, department: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm">
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <h4 className="text-xs font-bold text-indigo-600 mb-3 flex items-center gap-2"><Smartphone size={14}/> {t.database.contactInfo}</h4>
                            <input type="text" placeholder={t.database.cell} value={editingEmployee.phoneNumber || ''} onChange={e => setEditingEmployee({...editingEmployee, phoneNumber: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm" />
                        </div>
                        <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <h4 className="text-xs font-bold text-red-600 mb-3 flex items-center gap-2"><CreditCard size={14}/> {t.database.dlDetails}</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <input type="text" placeholder={t.database.number} value={editingEmployee.driverLicenseNumber || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseNumber: e.target.value})} className="p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm" />
                                <input type="text" placeholder={t.database.class} value={editingEmployee.driverLicenseClass || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseClass: e.target.value})} className="p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm" />
                                <input type="date" value={editingEmployee.driverLicenseExpiry || ''} onChange={e => setEditingEmployee({...editingEmployee, driverLicenseExpiry: e.target.value})} className="p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded text-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                        <button onClick={handleDelete} className="flex items-center gap-1 text-red-600 text-xs font-bold hover:underline"><Trash2 size={14}/> {t.common.delete}</button>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingEmployee(null)} className="px-4 py-2 text-sm text-gray-500 font-bold hover:bg-gray-200 rounded">{t.common.cancel}</button>
                            <button onClick={handleSaveEdit} className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-bold shadow-md hover:bg-blue-500">{t.common.save}</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {qrEmployee && (
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setQrEmployee(null)}>
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-indigo-600 font-black tracking-tighter">
                            <ShieldCheck size={20} /> RACS SAFETY
                        </div>
                        <button onClick={() => setQrEmployee(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 mb-6">
                        <img src={getQrUrl(qrEmployee.recordId)} alt="QR" className="w-48 h-48" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{qrEmployee.name}</h3>
                    <p className="text-sm font-mono text-slate-500 mb-8">{qrEmployee.recordId}</p>

                    <div className="flex gap-3 w-full">
                        <button onClick={() => handleDownloadQr(qrEmployee.recordId, qrEmployee.name)} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg">
                            <Download size={16}/> {t.common.download}
                        </button>
                        <button onClick={() => window.print()} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                            <Printer size={20} className="text-slate-600"/>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showImportModal && (
            <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
                    <div className="p-6 border-b bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white">{t.database.mappingTitle}</h3>
                            <p className="text-xs text-gray-500">{t.database.mappingSubtitle}</p>
                        </div>
                        <button onClick={() => setShowImportModal(false)}><X/></button>
                    </div>
                    <div className="flex-1 overflow-auto p-6 flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 border-b pb-2">{t.database.coreData}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(columnMapping).filter(k => k !== 'racs').map(key => (
                                    <div key={key}>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{key}</label>
                                        <select 
                                            value={(columnMapping as any)[key]} 
                                            onChange={(e) => setColumnMapping({...columnMapping, [key]: e.target.value})}
                                            className="w-full text-xs p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                        >
                                            <option value="">-- Skip --</option>
                                            {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 border-b pb-2 mt-8">{t.database.complianceTrain}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {racDefinitions.map(rac => (
                                    <div key={rac.id}>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{rac.code}</label>
                                        <select 
                                            value={columnMapping.racs[rac.code] || ''} 
                                            onChange={(e) => setColumnMapping({
                                                ...columnMapping, 
                                                racs: { ...columnMapping.racs, [rac.code]: e.target.value }
                                            })}
                                            className="w-full text-xs p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                        >
                                            <option value="">-- Skip --</option>
                                            {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-80 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100">
                             <h4 className="font-bold text-xs text-slate-400 mb-4">{t.database.preview}</h4>
                             <div className="space-y-4">
                                 {importPreview.map((row, i) => (
                                     <div key={i} className="text-[9px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200 truncate">
                                         {row.join(' | ')}
                                     </div>
                                 ))}
                             </div>
                             <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100">
                                 <h5 className="font-bold text-blue-800 text-[10px] mb-2">PRO TIP</h5>
                                 <p className="text-[10px] text-blue-600 leading-relaxed">
                                     Dates should be in <strong>YYYY-MM-DD</strong> format. If a RAC column contains 'Sim' or 'Yes', it will be marked as passed today.
                                 </p>
                             </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                        <button onClick={() => setShowImportModal(false)} className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded">{t.common.cancel}</button>
                        <button onClick={processImport} className="px-8 py-2 bg-indigo-600 text-white rounded text-sm font-black shadow-lg hover:bg-indigo-50 flex items-center gap-2">
                             <CheckCircle size={18}/> {t.database.processImport}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default DatabasePage;
