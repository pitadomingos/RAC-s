
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Booking, BookingStatus, UserRole, TrainingSession, Employee, EmployeeRequirement, RacDef, SystemNotification } from '../types';
import { 
  Upload, FileSpreadsheet, Search, Filter, Download, 
  CheckCircle2, XCircle, Award, Users, TrendingUp,
  FileText, Calendar, User, MapPin,
  ChevronLeft, ChevronRight, Briefcase, QrCode, Printer, Phone, AlertTriangle, X, Clock
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, addMonths, isValid } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { RAC_KEYS, OPS_KEYS } from '../constants';

interface ResultsPageProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  // Updated signature to accept full Employee object in side effects
  importBookings?: (newBookings: Booking[], sideEffects?: { employee: Employee, aso: string, ops: Record<string, boolean> }[]) => void;
  userRole: UserRole;
  sessions: TrainingSession[];
  currentEmployeeId?: string;
  racDefinitions: RacDef[];
  addNotification: (notif: SystemNotification) => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ bookings, updateBookingStatus, importBookings, userRole, sessions, currentEmployeeId, racDefinitions, addNotification }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const [filter, setFilter] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trainerFilter, setTrainerFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [racFilter, setRacFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  // QR State for User
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) setFilter(query);
  }, [searchParams]);

  useEffect(() => {
      setCurrentPage(1);
  }, [filter, statusFilter, trainerFilter, dateFilter, racFilter]);

  // -- Esc Key for Modal --
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowQrModal(false);
        }
    };
    if (showQrModal) {
        window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showQrModal]);

  const uniqueTrainers = useMemo(() => {
      const trainers = new Set<string>();
      sessions.forEach(s => {
          if (s.instructor && s.instructor !== 'TBD') trainers.add(s.instructor);
      });
      return Array.from(trainers).sort();
  }, [sessions]);

  // --- Translation Helper ---
  const getTranslatedRacName = (rawInput: string) => {
      if (!rawInput) return '';
      
      let code = rawInput;
      let isImport = false;

      // Extract Code
      if (code.includes(' - ')) {
          code = code.split(' - ')[0];
      } else if (code.includes('|')) {
          code = code.split('|')[0];
          isImport = true;
      }
      
      // Normalize: "RAC 01" -> "RAC01"
      const cleanCode = code.replace(/\s+/g, '').toUpperCase().replace('(IMP)', '').replace('(IMP)', '');
      
      // 1. Try Translation Source of Truth
      // @ts-ignore
      const translated = t.racDefs?.[cleanCode];
      if (translated) return translated;

      // 2. Try Dynamic Global Definitions
      const def = racDefinitions.find(r => r.code.replace(/\s+/g, '').toUpperCase() === cleanCode);
      if (def) return def.name;

      // 3. Fallback to clean code
      return isImport ? cleanCode : rawInput;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (userRole === UserRole.USER && currentEmployeeId) {
          if (b.employee.id !== currentEmployeeId) return false;
      }
      const session = sessions.find(s => s.id === b.sessionId);
      const bookingDate = session ? session.date : (b.resultDate || '');
      let bookingTrainer = session ? session.instructor : '';
      if (!bookingTrainer && b.sessionId.includes('|')) {
          const parts = b.sessionId.split('|');
          if (parts.length >= 3) bookingTrainer = parts[2];
      }
      let bookingRacCode = '';
      if (session) bookingRacCode = session.racType.split(' - ')[0].replace(' ', '');
      else if (b.sessionId.includes('RAC')) bookingRacCode = b.sessionId.split(' - ')[0].replace(' ', '');
      if (!bookingRacCode && b.sessionId.includes('|')) bookingRacCode = b.sessionId.split('|')[0];
      bookingRacCode = bookingRacCode.replace(/(\(imp\))/gi, '').replace(/\s+/g, '');

      const matchesSearch = String(b.employee.name).toLowerCase().includes(filter.toLowerCase()) || String(b.employee.recordId).includes(filter);
      const matchesStatus = statusFilter === 'All' ? true : b.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesTrainer = trainerFilter === 'All' ? true : bookingTrainer === trainerFilter;
      const matchesDate = dateFilter === '' ? true : bookingDate === dateFilter;
      const matchesRac = racFilter === 'All' ? true : bookingRacCode === racFilter;

      return matchesSearch && matchesStatus && matchesTrainer && matchesDate && matchesRac;
    });
  }, [bookings, filter, statusFilter, trainerFilter, dateFilter, racFilter, sessions, userRole, currentEmployeeId]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
  };

  const stats = useMemo(() => {
      const total = filteredBookings.length;
      const passed = filteredBookings.filter(b => b.status === BookingStatus.PASSED).length;
      const failed = filteredBookings.filter(b => b.status === BookingStatus.FAILED).length;
      const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
      const theorySum = filteredBookings.reduce((acc, curr) => acc + (curr.theoryScore || 0), 0);
      const avgTheory = total > 0 ? (theorySum / total).toFixed(1) : '0.0';
      return { total, passed, failed, passRate, avgTheory };
  }, [filteredBookings]);

  const handleExportData = () => {
      const headers = [
          'ID', 'Name', 'Company', 'Department', 'Role', 
          'Training', 'Date', 'Trainer', 'Status', 'Score', 'Expiry'
      ];
      const rows = filteredBookings.map(b => {
          const session = sessions.find(s => s.id === b.sessionId);
          const rac = session ? session.racType : b.sessionId;
          const date = session ? session.date : (b.resultDate || '');
          const trainer = session ? session.instructor : 'Unknown';
          return [
              b.employee.recordId,
              `"${b.employee.name}"`, 
              b.employee.company,
              b.employee.department,
              b.employee.role,
              rac,
              date,
              trainer,
              b.status,
              String(b.theoryScore || 0),
              b.expiryDate || ''
          ];
      });
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `training_records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    // Specific headers requested by user
    const headers = [
      'Record ID', 'Full Name', 'Company', 'Department', 'Job Title', 
      'RAC Code (e.g. RAC01)', 'Date (YYYY-MM-DD)', 'Trainer', 'Room', 
      'Status (Passed/Failed)', 'Theory Score', 'Practical Score', 
      'DL Number', 'DL Class', 'DL Expiry (YYYY-MM-DD)', 
      'ASO Expiry (YYYY-MM-DD)', 
      'PTS', 'ART', 'LIB_OPS', 'LIB_MOV', 
      'EMI_PTS', 'APR_ART', 'EXEC', 'Dono_Area_PTS'
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CARS_Comprehensive_Import_Template.csv");
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

          try {
              const lines = text.split('\n');
              const separator = lines[0].includes(';') ? ';' : ',';
              const headers = lines[0].split(separator).map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
              
              // --- CRITICAL FIX: MAP EXISTING IDs ---
              // Build a map of RecordID -> UUID to ensure we update existing profiles 
              // instead of creating duplicates which causes the 'Not Found' / 'Old Data' bug.
              const existingIdMap = new Map<string, string>();
              bookings.forEach(b => {
                  if (b.employee && b.employee.recordId) {
                      existingIdMap.set(b.employee.recordId.trim().toLowerCase(), b.employee.id);
                  }
              });

              const newBookings: Booking[] = [];
              const sideEffects: { employee: Employee, aso: string, ops: Record<string, boolean> }[] = [];
              
              // Helper to find index using multiple possible keywords
              const getIdx = (keys: string[]) => headers.findIndex(h => keys.some(k => h === k.toLowerCase() || h.includes(k.toLowerCase())));
              
              const idxId = getIdx(['record id', 'record_id', 'matricula']);
              const idxName = getIdx(['full name', 'name', 'nome']);
              const idxComp = getIdx(['company', 'empresa']);
              const idxDept = getIdx(['department', 'departamento']);
              const idxJob = getIdx(['job title', 'job', 'funcao']);
              
              const idxRac = getIdx(['rac code', 'code', 'training']);
              const idxDate = getIdx(['date', 'data']);
              const idxTrainer = getIdx(['trainer', 'formador']);
              const idxRoom = getIdx(['room', 'sala']);
              const idxStatus = getIdx(['status', 'resultado']);
              const idxTheory = getIdx(['theory score', 'theory']);
              const idxPrac = getIdx(['practical score', 'practical']);
              
              const idxDlNum = getIdx(['dl number', 'dl_number', 'carta']);
              const idxDlClass = getIdx(['dl class', 'dl_class', 'classe']);
              const idxDlExp = getIdx(['dl expiry', 'dl_expiry', 'validade carta']);
              const idxAsoExp = getIdx(['aso expiry', 'aso', 'medico']);

              // Map OPS keys dynamically
              const opsIndices: Record<string, number> = {};
              OPS_KEYS.forEach(key => {
                  // handle special case formatting if needed
                  opsIndices[key] = getIdx([key.toLowerCase(), key.replace('_', ' ').toLowerCase(), key.replace('_', '').toLowerCase()]);
              });

              if (idxId === -1 || idxRac === -1) {
                  addNotification({
                      id: uuidv4(),
                      type: 'warning',
                      title: 'Invalid Format',
                      message: 'CSV must contain "Record ID" and "RAC Code" columns.',
                      timestamp: new Date(),
                      isRead: false
                  });
                  return;
              }

              let count = 0;
              lines.slice(1).forEach(line => {
                  if (!line.trim()) return;
                  const cols = line.split(separator).map(c => c.trim().replace(/^"|"$/g, ''));
                  
                  const recordId = cols[idxId];
                  if (!recordId) return;

                  const normRecordId = recordId.trim().toLowerCase();
                  
                  // RESOLVE ID: Use existing UUID if available, else generate new
                  let empUuid = existingIdMap.get(normRecordId);
                  if (!empUuid) {
                      empUuid = uuidv4();
                      existingIdMap.set(normRecordId, empUuid); // Add to map for subsequent rows in this file
                  }

                  const name = idxName !== -1 ? cols[idxName] : 'Imported Employee';
                  const rac = cols[idxRac];
                  const date = idxDate !== -1 ? cols[idxDate] : new Date().toISOString().split('T')[0];
                  
                  // Scores
                  const scoreT = idxTheory !== -1 ? parseInt(cols[idxTheory]) || 0 : 0;
                  const scoreP = idxPrac !== -1 ? parseInt(cols[idxPrac]) || 0 : 0;
                  
                  // Status
                  const statusRaw = idxStatus !== -1 ? cols[idxStatus].toLowerCase() : 'passed';
                  const status = statusRaw.includes('fail') ? BookingStatus.FAILED : BookingStatus.PASSED;

                  // Metadata for Session
                  const trainer = idxTrainer !== -1 ? cols[idxTrainer] : 'TBD';
                  const room = idxRoom !== -1 ? cols[idxRoom] : 'TBD';
                  
                  // DL Details
                  const dlNum = idxDlNum !== -1 ? cols[idxDlNum] : '';
                  const dlClass = idxDlClass !== -1 ? cols[idxDlClass] : '';
                  const dlExp = idxDlExp !== -1 ? cols[idxDlExp] : '';

                  // ASO - Optional
                  const asoDate = idxAsoExp !== -1 ? cols[idxAsoExp] : '';

                  // OPS Matrix - Extract Trues
                  const ops: Record<string, boolean> = {};
                  OPS_KEYS.forEach(key => {
                      const idx = opsIndices[key];
                      if (idx !== -1) {
                          const val = cols[idx]?.toLowerCase() || '';
                          if (['true', 'yes', '1', 'sim', 'ok', 'y'].includes(val)) {
                              ops[key] = true;
                          }
                      }
                  });

                  if (rac) {
                      // Construct ID specifically to allow session linking if needed
                      const sessionId = `${rac}|${date}|${trainer}|${room}`;
                      
                      const employeeObj: Employee = {
                          id: empUuid, // USE RESOLVED ID
                          recordId: recordId,
                          name: name,
                          company: idxComp !== -1 ? cols[idxComp] : 'Imported',
                          department: idxDept !== -1 ? cols[idxDept] : 'Imported',
                          role: idxJob !== -1 ? cols[idxJob] : 'Imported',
                          isActive: true,
                          driverLicenseNumber: dlNum,
                          driverLicenseClass: dlClass,
                          driverLicenseExpiry: dlExp
                      };

                      newBookings.push({
                          id: uuidv4(),
                          sessionId: sessionId, // Store metadata in ID string for imported records
                          employee: employeeObj,
                          status: status,
                          resultDate: date,
                          expiryDate: status === BookingStatus.PASSED && date ? format(addMonths(new Date(date), 24), 'yyyy-MM-dd') : '',
                          attendance: true,
                          theoryScore: scoreT,
                          practicalScore: scoreP
                      });

                      // Collect side effects (DL updates, OPS updates)
                      sideEffects.push({
                          employee: employeeObj,
                          aso: asoDate,
                          ops: ops
                      });

                      count++;
                  }
              });

              if (importBookings && newBookings.length > 0) {
                  importBookings(newBookings, sideEffects);
                  addNotification({
                      id: uuidv4(),
                      type: 'success',
                      title: 'Import Successful',
                      message: `Imported ${count} training records and updated DB.`,
                      timestamp: new Date(),
                      isRead: false
                  });
              } else {
                   addNotification({
                      id: uuidv4(),
                      type: 'warning',
                      title: 'Import Failed',
                      message: 'No valid records found.',
                      timestamp: new Date(),
                      isRead: false
                  });
              }
          } catch (error) {
              console.error(error);
              addNotification({
                  id: uuidv4(),
                  type: 'alert',
                  title: 'Import Error',
                  message: 'Failed to process file. Check format.',
                  timestamp: new Date(),
                  isRead: false
              });
          }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Determine current user's record ID for the "My Digital Passport" feature
  const currentUserRecordId = useMemo(() => {
      if (userRole === UserRole.USER && currentEmployeeId) {
          const booking = bookings.find(b => b.employee.id === currentEmployeeId);
          return booking?.employee.recordId;
      }
      return null;
  }, [userRole, currentEmployeeId, bookings]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full flex flex-col">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase">{t.common.stats.totalRecords}</p>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase">{t.common.stats.passRate}</p>
                <div className="text-2xl font-black text-green-500 mt-1">{stats.passRate}%</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase">{t.common.passed}</p>
                <div className="text-2xl font-black text-blue-500 mt-1">{stats.passed}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase">{t.common.failed}</p>
                <div className="text-2xl font-black text-red-500 mt-1">{stats.failed}</div>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-10">
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder={t.results.searchPlaceholder} 
                        className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-200 dark:border-slate-600">
                    <Filter size={16} className="text-slate-400" />
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                    >
                        <option value="All">{t.common.all} {t.common.status}</option>
                        <option value="passed">{t.common.passed}</option>
                        <option value="failed">{t.common.failed}</option>
                        <option value="pending">{t.common.pending}</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-200 dark:border-slate-600">
                    <User size={16} className="text-slate-400" />
                    <select 
                        value={trainerFilter} 
                        onChange={(e) => setTrainerFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer max-w-[150px]"
                    >
                        <option value="All">{t.common.all} Trainers</option>
                        {uniqueTrainers.map(tr => <option key={tr} value={tr}>{tr}</option>)}
                    </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-200 dark:border-slate-600">
                    <Briefcase size={16} className="text-slate-400" />
                    <select 
                        value={racFilter} 
                        onChange={(e) => setRacFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer max-w-[150px]"
                    >
                        <option value="All">{t.common.all} RACs</option>
                        {RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* --- Add Passport Button for User Role --- */}
                {userRole === UserRole.USER && currentUserRecordId && (
                    <button 
                        onClick={() => navigate(`/verify/${currentUserRecordId}`)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                        title={t.results.passport}
                    >
                        <QrCode size={16} /> {t.results.passport}
                    </button>
                )}

                <button 
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                    title="Download Comprehensive CSV Template"
                >
                    <FileSpreadsheet size={16} /> Template
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                    title={t.common.import}
                >
                    <Upload size={16} /> {t.common.import}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                
                <button 
                    onClick={handleExportData}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                    <Download size={16} /> {t.results.export}
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.results.table.employee}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.results.table.session}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.results.table.date}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.results.table.trainer}</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{t.results.table.theory}</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{t.results.table.status}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t.results.table.expiry}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                        {paginatedBookings.map((booking) => {
                            const session = sessions.find(s => s.id === booking.sessionId);
                            const racName = getTranslatedRacName(session ? session.racType : booking.sessionId);
                            const trainerName = session ? session.instructor : (booking.sessionId.includes('|') ? booking.sessionId.split('|')[2] : 'TBD');
                            
                            return (
                                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{booking.employee.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{booking.employee.recordId}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {racName}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        {session ? session.date : (booking.resultDate || '-')}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        {trainerName}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {booking.theoryScore || '-'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                            booking.status === BookingStatus.PASSED ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' :
                                            booking.status === BookingStatus.FAILED ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                            {booking.status === BookingStatus.PASSED ? <CheckCircle2 size={12} /> : booking.status === BookingStatus.FAILED ? <XCircle size={12} /> : <Clock size={12} />}
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        {booking.expiryDate || '-'}
                                    </td>
                                </tr>
                            );
                        })}
                        
                        {filteredBookings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                                    No records found matching filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{t.common.rowsPerPage}</span>
                    <select 
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-2 py-1 outline-none"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-medium">
                        Page {currentPage} of {Math.max(1, totalPages)}
                    </span>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronLeft size={16} /></button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ResultsPage;
