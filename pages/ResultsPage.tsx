
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Booking, BookingStatus, UserRole, TrainingSession, Employee, EmployeeRequirement } from '../types';
import { 
  Upload, FileSpreadsheet, Search, Filter, Download, 
  CheckCircle2, XCircle, Award, Users, TrendingUp,
  FileText, Calendar, User, MapPin,
  ChevronLeft, ChevronRight, Briefcase, QrCode, Printer, AlertTriangle, X
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, addYears, isValid } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { RAC_KEYS } from '../constants';

interface ResultsPageProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  importBookings?: (newBookings: Booking[], sideEffects?: { employee: Employee, aso: string, ops: Record<string, boolean> }[]) => void;
  userRole: UserRole;
  sessions: TrainingSession[];
  currentEmployeeId?: string;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ bookings, updateBookingStatus, importBookings, userRole, sessions, currentEmployeeId }) => {
  const [searchParams] = useSearchParams();
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
  
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) setFilter(query);
  }, [searchParams]);

  useEffect(() => {
      setCurrentPage(1);
  }, [filter, statusFilter, trainerFilter, dateFilter, racFilter]);

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

  const currentUserEmployee = useMemo(() => {
      if (userRole === UserRole.USER && currentEmployeeId) {
          const booking = bookings.find(b => b.employee.id === currentEmployeeId);
          return booking ? booking.employee : null;
      }
      return null;
  }, [bookings, userRole, currentEmployeeId]);

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

  const parseImportDate = (dateStr: string): Date | null => {
      if (!dateStr) return null;
      const isoMatch = dateStr.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
      if (isoMatch) {
          const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
          if (isValid(d)) return d;
      }
      const dmYMatch = dateStr.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
      if (dmYMatch) {
          const d = new Date(parseInt(dmYMatch[3]), parseInt(dmYMatch[2]) - 1, parseInt(dmYMatch[1]));
          if (isValid(d)) return d;
      }
      const fallback = new Date(dateStr);
      return isValid(fallback) ? fallback : null;
  };

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
    const baseHeaders = [
      'Full Name', 'Record ID', 'Company', 'Department', 'Job Title', 
      'RAC Code (e.g. RAC01)', 'Date (YYYY-MM-DD)', 'Trainer', 'Room', 
      'Status (Passed/Failed)', 'Theory Score', 'Practical Score', 
      'DL Number', 'DL Class', 'DL Expiry (YYYY-MM-DD)',
      'ASO Expiry (YYYY-MM-DD)'
    ];
    const matrixHeaders = ['PTS', 'ART', 'LIB_OPS', 'LIB_MOV', 'EMI_PTS', 'APR_ART', 'DONO_AREA_PTS', 'EXEC'];
    const headers = [...baseHeaders, ...matrixHeaders];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vulcan_records_template_enhanced.csv");
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
      const firstLine = lines[0] || '';
      const separator = firstLine.includes(';') ? ';' : ',';

      const headerRow = firstLine.split(separator).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      const dataRows = lines.slice(1);
      
      const newBookings: Booking[] = [];
      const sideEffects: { employee: Employee, aso: string, ops: Record<string, boolean> }[] = [];
      
      let skippedCount = 0;

      const existingEmployeeMap = new Map<string, Employee>();
      const existingBookingFingerprints = new Set<string>();

      bookings.forEach(b => {
          if (b.employee && b.employee.recordId) {
              existingEmployeeMap.set(b.employee.recordId.toLowerCase(), b.employee);
          }
          const session = sessions.find(s => s.id === b.sessionId);
          const racCode = session ? session.racType.split(' - ')[0] : b.sessionId.split('|')[0];
          const date = session ? session.date : (b.resultDate || '');
          const normalizedRac = racCode.replace(/\(imp\)/gi, '').replace(/\s+/g, '').toUpperCase();
          const fingerprint = `${b.employee.recordId.toLowerCase()}|${normalizedRac}|${date}`;
          existingBookingFingerprints.add(fingerprint);
      });

      const getIdx = (patterns: string[]) => {
          return headerRow.findIndex(h => {
              const normH = h.replace(/[\s\-_]/g, '');
              return patterns.some(p => normH.includes(p.toLowerCase()));
          });
      };

      const idxName = getIdx(['fullname', 'name', 'nome']);
      const idxId = getIdx(['recordid', 'id', 'matricula']);
      
      if (idxName === -1 || idxId === -1) {
          alert("Error: Template must contain Name and ID columns.");
          return;
      }

      const idxComp = getIdx(['company']);
      const idxDept = getIdx(['department']);
      const idxRole = getIdx(['job', 'role']);
      const idxRac = getIdx(['raccode', 'training']);
      const idxDate = getIdx(['date']);
      const idxTrainer = getIdx(['trainer']);
      const idxRoom = getIdx(['room']);
      const idxStatus = getIdx(['status']);
      const idxTheory = getIdx(['theory']);
      const idxPrac = getIdx(['practical']);
      const idxDlNum = getIdx(['dlnumber']);
      const idxDlClass = getIdx(['dlclass']);
      const idxDlExp = getIdx(['dlexpiry']);
      const idxAso = getIdx(['asoexpiry', 'aso']);
      const opsKeysToCheck = ['PTS', 'ART', 'LIB_OPS', 'LIB_MOV', 'EMI_PTS', 'APR_ART', 'DONO_AREA_PTS', 'EXEC'];
      const opsIndices: Record<string, number> = {};
      opsKeysToCheck.forEach(k => {
          opsIndices[k] = getIdx([k]);
      });

      dataRows.forEach(line => {
        if (!line.trim()) return;
        const cols = line.split(separator).map(c => c?.trim().replace(/^"|"$/g, ''));
        
        const name = cols[idxName];
        const recordId = cols[idxId];
        const racCodeRaw = idxRac > -1 ? cols[idxRac] : '';

        if (!name || !recordId) return; 

        // Resolve or Create Employee Object
        const existingEmp = existingEmployeeMap.get(recordId.toLowerCase());
        const empId = existingEmp ? existingEmp.id : uuidv4();
        
        const employeeObj: Employee = existingEmp || {
            id: empId,
            name,
            recordId,
            company: idxComp > -1 ? cols[idxComp] || 'Unknown' : 'Unknown',
            department: idxDept > -1 ? cols[idxDept] || 'Operations' : 'Operations',
            role: idxRole > -1 ? cols[idxRole] || 'Staff' : 'Staff',
            driverLicenseNumber: idxDlNum > -1 ? cols[idxDlNum] : '',
            driverLicenseClass: idxDlClass > -1 ? cols[idxDlClass] : '',
            driverLicenseExpiry: idxDlExp > -1 ? cols[idxDlExp] : '',
            isActive: true
        };

        // --- 1. HANDLE BOOKING CREATION ---
        if (racCodeRaw) {
            let cleanRac = racCodeRaw.replace(/[\(\[\{]?imp[\)\]\}]?/gi, ''); 
            cleanRac = cleanRac.replace(/[\s\-_]/g, '').toUpperCase(); 

            const dateRaw = idxDate > -1 ? cols[idxDate] : '';
            const parsedDate = parseImportDate(dateRaw);
            const dateFormatted = parsedDate ? format(parsedDate, 'yyyy-MM-dd') : '';

            const fingerprint = `${recordId.toLowerCase()}|${cleanRac}|${dateFormatted}`;
            
            if (!existingBookingFingerprints.has(fingerprint)) {
                const statusRaw = idxStatus > -1 ? cols[idxStatus] : 'Passed';
                const status = statusRaw?.toLowerCase() === 'passed' ? BookingStatus.PASSED : BookingStatus.FAILED;
                
                let expiryDate = '';
                if (status === BookingStatus.PASSED && parsedDate) {
                    expiryDate = format(addYears(parsedDate, 2), 'yyyy-MM-dd');
                }

                const trainer = idxTrainer > -1 ? cols[idxTrainer] : 'Unknown';
                const room = idxRoom > -1 ? cols[idxRoom] : 'Unknown';
                const sessionString = `${cleanRac}|Historical|${trainer}|${room}`;

                const newBooking: Booking = {
                    id: uuidv4(),
                    sessionId: sessionString,
                    status: status,
                    resultDate: dateFormatted,
                    expiryDate: expiryDate,
                    theoryScore: idxTheory > -1 ? (parseInt(cols[idxTheory]) || 0) : 0,
                    practicalScore: idxPrac > -1 ? (parseInt(cols[idxPrac]) || 0) : 0,
                    attendance: true,
                    employee: employeeObj
                };
                newBookings.push(newBooking);
                existingBookingFingerprints.add(fingerprint);
            } else {
                skippedCount++;
            }
        }

        // --- 2. HANDLE SIDE EFFECTS (Matrix/ASO Updates) ---
        const asoRaw = idxAso > -1 ? cols[idxAso] : '';
        const opsUpdates: Record<string, boolean> = {};
        
        Object.entries(opsIndices).forEach(([key, idx]) => {
            if (idx > -1) {
                const val = cols[idx]?.toLowerCase();
                if (val === '1' || val === 'true' || val === 'yes' || val === 'sim' || val === 'x') {
                    opsUpdates[key] = true;
                }
            }
        });

        if (asoRaw || Object.keys(opsUpdates).length > 0) {
             const parsedAso = parseImportDate(asoRaw);
             sideEffects.push({
                 employee: employeeObj,
                 aso: parsedAso ? format(parsedAso, 'yyyy-MM-dd') : '',
                 ops: opsUpdates
             });
        }
      });

      if ((newBookings.length > 0 || sideEffects.length > 0) && importBookings) {
          importBookings(newBookings, sideEffects);
          
          let msg = `Processing Complete.`;
          if (newBookings.length > 0) msg += `\n- Imported ${newBookings.length} new training records.`;
          if (sideEffects.length > 0) msg += `\n- Updated Database Matrix for ${sideEffects.length} employees (ASO/Ops).`;
          if (skippedCount > 0) msg += `\n- Skipped ${skippedCount} duplicate training records.`;
          alert(msg);
      } else {
          if (skippedCount > 0) alert(`No new records found. Skipped ${skippedCount} duplicates.`);
          else alert(`No valid data found. Check if template matches enhanced format.`);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
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
          alert("Error downloading QR Code. Please try printing instead.");
      }
  };

  const getRacDetails = (sessionId: string) => {
      if (sessionId.includes('RAC02') || sessionId.includes('RAC 02')) return { isRac02: true };
      const session = sessions.find(s => s.id === sessionId);
      if (session && (session.racType.includes('RAC02') || session.racType.includes('RAC 02'))) return { isRac02: true };
      return { isRac02: false };
  };

  const ScoreCircle = ({ score }: { score: number }) => {
      const radius = 10;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (score / 100) * circumference;
      const color = score >= 80 ? 'text-emerald-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500';
      return (
          <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                  <circle cx="16" cy="16" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200" />
                  <circle cx="16" cy="16" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`${color} transition-all duration-1000 ease-out`} />
              </svg>
              <span className="absolute text-[8px] font-bold text-slate-700 dark:text-slate-300">{score}</span>
          </div>
      );
  };

  return (
    <div className="flex flex-col h-auto md:h-[calc(100vh-6rem)] space-y-6 animate-fade-in-up">
        {/* Header Section */}
        <div className="shrink-0 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <FileText size={32} className="text-yellow-500" />
                            {userRole === UserRole.USER ? 'My Training Records' : t.results.title}
                        </h2>
                        <p className="text-slate-400 mt-2 text-sm max-w-xl">
                            {userRole === UserRole.USER 
                                ? 'View your personal training history and certification status.'
                                : 'High-definition view of all training records.'}
                        </p>
                    </div>
                    {userRole === UserRole.SYSTEM_ADMIN && (
                        <div className="flex gap-3">
                            <button onClick={handleExportData} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"><Download size={16} /> Export Records</button>
                            <button onClick={handleDownloadTemplate} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-bold backdrop-blur-sm border border-white/10 flex items-center gap-2 transition-all"><FileSpreadsheet size={16} />{t.common.template}</button>
                            <button onClick={() => fileInputRef.current?.click()} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"><Upload size={16} />{t.common.import}</button>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                        </div>
                    )}
                    {userRole === UserRole.USER && currentUserEmployee && (
                        <button 
                            onClick={() => setShowQrModal(true)}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                            <QrCode size={20} />
                            My Digital Passport
                        </button>
                    )}
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 relative z-10">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Total Records</p>
                        <div className="flex items-end justify-between"><span className="text-2xl font-black">{stats.total}</span><Users size={18} className="text-blue-400 mb-1" /></div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Pass Rate</p>
                        <div className="flex items-end justify-between"><span className={`text-2xl font-black ${Number(stats.passRate) >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{stats.passRate}%</span><TrendingUp size={18} className={Number(stats.passRate) >= 80 ? 'text-green-400' : 'text-yellow-400 mb-1'} /></div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Avg Score</p>
                        <div className="flex items-end justify-between"><span className="text-2xl font-black">{stats.avgTheory}</span><Award size={18} className="text-purple-400 mb-1" /></div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Certifications</p>
                        <div className="flex items-end justify-between"><span className="text-2xl font-black text-white">{stats.passed}</span><CheckCircle2 size={18} className="text-green-400 mb-1" /></div>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 transition-all">
                <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
                    {userRole !== UserRole.USER && (
                        <div className="relative flex-1 min-w-[200px] w-full md:w-auto group">
                            <Search className="absolute left-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors" size={18} />
                            <input type="text" placeholder={t.results.searchPlaceholder} className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white transition-all" value={filter} onChange={(e) => setFilter(e.target.value)} />
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 min-w-[120px]">
                            <select className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-black dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="All">{t.common.all} Status</option><option value="Passed">Passed</option><option value="Failed">Failed</option><option value="Pending">Pending</option>
                            </select>
                            <Filter size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1 min-w-[120px]">
                            <select className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-black dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer" value={racFilter} onChange={(e) => setRacFilter(e.target.value)}>
                                <option value="All">All RACs</option>{RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <Filter size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1 min-w-[140px]">
                            <select className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-black dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer" value={trainerFilter} onChange={(e) => setTrainerFilter(e.target.value)}>
                                <option value="All">All Trainers</option>{uniqueTrainers.map(tr => <option key={tr} value={tr}>{tr}</option>)}
                            </select>
                            <User size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1 min-w-[130px]">
                            <input type="date" className="w-full pl-3 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-black dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full whitespace-nowrap">
                    {filteredBookings.length} records found
                </div>
            </div>
        </div>

        {/* Data Grid */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col relative h-[600px] md:h-auto md:overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 md:sticky md:top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.employee}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.common.department}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.common.jobTitle}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.session}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.date}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.trainer}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.room}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.dlRac02}</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider w-24">{t.results.table.theory}</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider w-24">{t.results.table.prac}</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider w-32">{t.results.table.status}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.expiry}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                        {paginatedBookings.length === 0 ? (
                            <tr><td colSpan={12} className="px-6 py-12 text-center text-gray-400">No records found</td></tr>
                        ) : (
                            paginatedBookings.map((booking) => {
                                const { isRac02 } = getRacDetails(booking.sessionId);
                                const dlExpiry = booking.employee.driverLicenseExpiry || '';
                                const isDlExpired = dlExpiry && new Date(dlExpiry) < new Date();
                                const dlClass = String(booking.employee.driverLicenseClass || '-');
                                const dlExpStr = String(dlExpiry || '-');
                                const initials = booking.employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                
                                const session = sessions.find(s => s.id === booking.sessionId);
                                const displayDate = session ? session.date : (booking.resultDate || '-');
                                let displayTrainer = session ? session.instructor : '-';
                                let displayRoom = session ? session.location : '-';
                                
                                if (!session && booking.sessionId.includes('|')) {
                                    const parts = booking.sessionId.split('|');
                                    if (parts.length >= 3) displayTrainer = parts[2];
                                    if (parts.length >= 4) displayRoom = parts[3];
                                }

                                let displaySessionName = booking.sessionId;
                                if (session) {
                                    displaySessionName = session.racType;
                                } else if (booking.sessionId.includes('|')) {
                                    displaySessionName = booking.sessionId.split('|')[0] + ' (Imp)';
                                } else {
                                    displaySessionName = booking.sessionId.split(' - ')[0];
                                }

                                const bgColors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-pink-100 text-pink-600', 'bg-indigo-100 text-indigo-600', 'bg-orange-100 text-orange-600'];
                                const colorClass = bgColors[booking.employee.name.length % bgColors.length];

                                return (
                                    <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-default">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mr-4 ${colorClass}`}>{initials}</div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{String(booking.employee.name)}</div>
                                                    <div className="text-xs text-slate-600 dark:text-blue-300 font-mono flex items-center gap-1">{String(booking.employee.recordId)}<span className="text-slate-300">•</span><span className="truncate max-w-[100px]">{booking.employee.company}</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{booking.employee.department}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-1"><Briefcase size={12} className="text-slate-400" />{booking.employee.role}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col"><span className="text-sm font-medium text-slate-800 dark:text-slate-300">{displaySessionName}</span></div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{displayDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-1"><User size={12} className="text-slate-400" />{displayTrainer}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" />{displayRoom}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isRac02 ? (
                                                <div className="flex flex-col text-xs">
                                                    <div className="flex gap-2 mb-0.5"><span className="font-bold text-slate-700 dark:text-slate-400">Cls:</span><span className="text-slate-900 dark:text-slate-300 font-mono">{dlClass}</span></div>
                                                    <div className={`${isDlExpired ? 'text-red-600 font-bold flex items-center gap-1' : 'text-slate-600 dark:text-slate-400'}`}>{isDlExpired && <XCircle size={10} />}<span>Exp: {dlExpStr}</span></div>
                                                </div>
                                            ) : <span className="text-xs text-slate-300 italic">N/A</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center"><div className="flex justify-center"><ScoreCircle score={booking.theoryScore || 0} /></div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">{booking.practicalScore !== undefined && booking.practicalScore > 0 ? <div className="flex justify-center"><ScoreCircle score={booking.practicalScore} /></div> : <span className="text-slate-300 text-xs">-</span>}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${booking.status === BookingStatus.PASSED ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : booking.status === BookingStatus.FAILED ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'}`}>
                                                {booking.status === BookingStatus.PASSED && <CheckCircle2 size={12} />}{booking.status === BookingStatus.FAILED && <XCircle size={12} />}{String(booking.status).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{booking.expiryDate ? <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-400"><Calendar size={14} className="text-slate-400" />{String(booking.expiryDate)}</div> : <span className="text-slate-300 text-xs">-</span>}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center bg-slate-50 dark:bg-slate-800/50 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Rows per page:</span>
                        <select value={itemsPerPage} onChange={handlePageSizeChange} className="text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
                            <option value={10}>10</option><option value={20}>20</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option><option value={120}>120</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4 border-l border-slate-300 dark:border-slate-600 pl-4">
                        <div className="text-xs text-slate-500">Page {currentPage} of {Math.max(1, totalPages)} ({filteredBookings.length} total)</div>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 transition-colors"><ChevronLeft size={16} /></button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 transition-colors"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- QR / PASSPORT MODAL (User Profile) --- */}
        {showQrModal && currentUserEmployee && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowQrModal(false)}>
                <div className="bg-white rounded-3xl shadow-2xl p-0 overflow-hidden max-w-2xl w-full flex flex-col md:flex-row relative" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Desktop Close X */}
                    <button 
                        onClick={() => setShowQrModal(false)} 
                        className="absolute top-4 right-4 z-50 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Preview */}
                    <div className="p-8 bg-slate-100 flex-1 flex flex-col items-center justify-center border-r border-slate-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Digital Passport View</h3>
                        
                        {/* THE CARD BACK (Standardized View) */}
                        <div id="card-back-print" className="bg-white w-[85.6mm] h-[54mm] rounded-lg shadow-xl border border-slate-200 relative overflow-hidden flex flex-col" style={{ transform: 'scale(1.2)' }}>
                            {/* Header */}
                            <div className="bg-slate-900 text-white h-[8mm] flex items-center justify-center">
                                <span className="text-[10px] font-black tracking-widest">SAFETY PASSPORT / PASSAPORTE</span>
                            </div>
                            
                            {/* Body */}
                            <div className="flex-1 flex items-center justify-center p-2 relative">
                                {/* Large QR */}
                                <img 
                                    src={getQrUrl(currentUserEmployee.recordId)} 
                                    alt="QR Code"
                                    className="w-[28mm] h-[28mm]" 
                                />
                                
                                {/* Right Side Info */}
                                <div className="ml-4 flex flex-col justify-center h-full space-y-2">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase">Employee ID</div>
                                    <div className="text-sm font-black text-slate-900">{currentUserEmployee.recordId}</div>
                                    
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
                    <div className="p-8 w-full md:w-72 bg-white flex flex-col justify-center space-y-4">
                        <div className="mb-4">
                            <h2 className="text-xl font-black text-slate-900">{currentUserEmployee.name}</h2>
                            <p className="text-sm text-slate-500 font-mono">{currentUserEmployee.recordId}</p>
                        </div>

                        <button 
                            onClick={() => handleDownloadQr(currentUserEmployee.recordId, currentUserEmployee.name)}
                            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download size={18} /> Save QR Image
                        </button>

                        <button 
                            onClick={() => {
                                const win = window.open('', '', 'width=800,height=600');
                                if (win) {
                                    win.document.write(`
                                        <html>
                                            <head>
                                                <title>Print Passport - ${currentUserEmployee.recordId}</title>
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
                                                        <img src="${getQrUrl(currentUserEmployee.recordId)}" class="qr" />
                                                        <div class="info">
                                                            <div class="label">Employee ID</div>
                                                            <div class="value">${currentUserEmployee.recordId}</div>
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

                        <button 
                            onClick={() => setShowQrModal(false)}
                            className="w-full py-3 px-4 text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ResultsPage;
