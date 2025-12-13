
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Booking, BookingStatus, UserRole, TrainingSession, Employee, EmployeeRequirement, RacDef } from '../types';
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
  racDefinitions: RacDef[];
}

const ResultsPage: React.FC<ResultsPageProps> = ({ bookings, updateBookingStatus, importBookings, userRole, sessions, currentEmployeeId, racDefinitions = [] }) => {
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

  // Identify Current User Employee Data for Printing
  const currentUserEmployee = useMemo(() => {
      if (userRole === UserRole.USER && currentEmployeeId) {
          const booking = bookings.find(b => b.employee.id === currentEmployeeId);
          return booking?.employee;
      }
      return null;
  }, [userRole, currentEmployeeId, bookings]);

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

  // --- QR FUNCTIONS ---
  const getQrUrl = (recordId: string) => {
      const appOrigin = window.location.origin + window.location.pathname;
      const verificationUrl = `${appOrigin}#/verify/${recordId}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verificationUrl)}`;
  };

  const handleDownloadQr = async () => {
      if (!currentUserEmployee) return;
      const url = getQrUrl(currentUserEmployee.recordId);
      try {
          const response = await fetch(url);
          const blob = await response.blob();
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `QR_${currentUserEmployee.name.replace(/\s+/g, '_')}_${currentUserEmployee.recordId}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      } catch (e) {
          alert("Error downloading QR Code.");
      }
  };

  const handleDownloadTemplate = () => {
    const baseHeaders = [
      'Full Name', 'Record ID', 'Company', 'Department', 'Job Title', 
      'RAC (Code)', 'Date (YYYY-MM-DD)', 'Trainer', 'Status (Passed/Failed)', 'Score', 'Expiry (YYYY-MM-DD)'
    ];
    const csvContent = "data:text/csv;charset=utf-8," + baseHeaders.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "training_import_template.csv");
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
          // Skip header
          const dataRows = lines.slice(1);
          const newBookings: Booking[] = [];
          const sideEffects: { employee: Employee, aso: string, ops: Record<string, boolean> }[] = [];

          dataRows.forEach((line) => {
              if (!line.trim()) return;
              // CSV parsing logic (simplified)
              const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
              if (cols.length < 2) return;

              // Basic mapping based on template
              const empName = cols[0];
              const recordId = cols[1];
              const company = cols[2] || 'Unknown';
              const dept = cols[3] || 'Operations';
              const role = cols[4] || 'Worker';
              const racCode = cols[5];
              const dateStr = cols[6];
              const trainer = cols[7];
              const statusRaw = cols[8];
              const score = parseInt(cols[9]) || 0;
              const expiryStr = cols[10];

              if (recordId && racCode) {
                  const emp: Employee = {
                      id: recordId.toLowerCase(), // Use recordId as ID for simplicity in import
                      name: empName,
                      recordId: recordId,
                      company: company,
                      department: dept,
                      role: role,
                      isActive: true
                  };

                  let status = BookingStatus.PENDING;
                  if (statusRaw?.toLowerCase().includes('pass')) status = BookingStatus.PASSED;
                  else if (statusRaw?.toLowerCase().includes('fail')) status = BookingStatus.FAILED;

                  newBookings.push({
                      id: uuidv4(),
                      sessionId: `${racCode}|${dateStr}|${trainer}`, // Store raw data in sessionId if no session exists
                      employee: emp,
                      status: status,
                      resultDate: dateStr,
                      expiryDate: expiryStr,
                      theoryScore: score,
                      attendance: true
                  });
                  
                  // Side effect to ensure employee exists in DB with requirement
                  sideEffects.push({
                      employee: emp,
                      aso: '', // Unknown from simple training import
                      ops: {} 
                  });
              }
          });

          if (importBookings) {
              importBookings(newBookings, sideEffects);
              alert(`Imported ${newBookings.length} records.`);
          }
      };
      reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.results.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.results.subtitle}</p>
            </div>
            <div className="flex gap-2">
                {userRole === UserRole.SYSTEM_ADMIN && (
                    <>
                        <button 
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            <FileSpreadsheet size={16} /> {t.common.template}
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                            <Upload size={16} /> {t.common.import}
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept=".csv" 
                            onChange={handleFileUpload} 
                        />
                    </>
                )}
                
                {userRole !== UserRole.USER && (
                    <button 
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        <Download size={16} /> Export
                    </button>
                )}

                {userRole === UserRole.USER && currentUserEmployee && (
                    <button 
                        onClick={() => setShowQrModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        <Printer size={16} /> Print Card Back
                    </button>
                )}
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder={t.results.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            
            <div className="relative">
                <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <select 
                    className="pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-slate-800 dark:text-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">{t.common.allStatus}</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            <div className="relative">
                <select 
                    className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-slate-800 dark:text-white"
                    value={racFilter}
                    onChange={(e) => setRacFilter(e.target.value)}
                >
                    <option value="All">{t.common.allRacs}</option>
                    {racDefinitions.length > 0 ? (
                        racDefinitions.map(def => <option key={def.code} value={def.code}>{def.code}</option>)
                    ) : (
                        RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)
                    )}
                </select>
            </div>

            <div className="relative">
                <select 
                    className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-slate-800 dark:text-white"
                    value={trainerFilter}
                    onChange={(e) => setTrainerFilter(e.target.value)}
                >
                    <option value="All">{t.common.allTrainers}</option>
                    {uniqueTrainers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <input 
                type="date"
                className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
            />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Total Records</div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">{stats.total}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Pass Rate</div>
                <div className="text-2xl font-black text-green-600 dark:text-green-400">{stats.passRate}%</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Avg Theory</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.avgTheory}%</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Failed</div>
                <div className="text-2xl font-black text-red-600 dark:text-red-400">{stats.failed}</div>
            </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="overflow-auto flex-1">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.results.table.employee}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.results.table.session}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.results.table.date}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">{t.results.table.trainer}</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.results.table.theory}</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.results.table.status}</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.results.table.expiry}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                        {paginatedBookings.map(b => {
                            const session = sessions.find(s => s.id === b.sessionId);
                            const rac = session ? session.racType : (b.sessionId.includes('RAC') ? b.sessionId.split('|')[0] : b.sessionId);
                            const date = session ? session.date : (b.resultDate || '-');
                            const trainer = session ? session.instructor : (b.sessionId.split('|')[2] || '-');

                            return (
                                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{b.employee.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{b.employee.recordId}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 font-medium">{rac}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{date}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">{trainer}</td>
                                    <td className="px-4 py-3 text-center text-sm font-bold text-slate-700 dark:text-slate-300">{b.theoryScore || '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-bold border ${
                                            b.status === 'Passed' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                            b.status === 'Failed' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                            'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-400">{b.expiryDate || '-'}</td>
                                </tr>
                            );
                        })}
                        {paginatedBookings.length === 0 && (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-400">No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <span>{t.common.rowsPerPage}</span>
                    <select 
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 outline-none"
                    >
                        <option className="dark:bg-slate-800" value={20}>20</option>
                        <option className="dark:bg-slate-800" value={50}>50</option>
                        <option className="dark:bg-slate-800" value={100}>100</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <span>{t.common.page} {currentPage} {t.common.of} {Math.max(1, totalPages)}</span>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronLeft size={16}/></button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30"><ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>
        </div>

        {/* QR Modal for User */}
        {showQrModal && currentUserEmployee && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowQrModal(false)}>
                <div className="bg-white rounded-3xl shadow-2xl p-0 overflow-hidden max-w-2xl w-full flex flex-col md:flex-row relative" onClick={(e) => e.stopPropagation()}>
                    
                    <button 
                        onClick={() => setShowQrModal(false)} 
                        className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors md:hidden"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 bg-slate-100 flex-1 flex flex-col items-center justify-center border-r border-slate-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Card Back Preview</h3>
                        
                        <div id="card-back-print" className="bg-white w-[85.6mm] h-[54mm] rounded-lg shadow-xl border border-slate-200 relative overflow-hidden flex flex-col" style={{ transform: 'scale(1.2)' }}>
                            <div className="bg-slate-900 text-white h-[8mm] flex items-center justify-center">
                                <span className="text-[10px] font-black tracking-widest">SAFETY PASSPORT / PASSAPORTE</span>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center p-2 relative">
                                <img 
                                    src={getQrUrl(currentUserEmployee.recordId)} 
                                    alt="QR Code"
                                    className="w-[28mm] h-[28mm]" 
                                />
                                
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

                            <div className="bg-gray-100 border-t border-gray-300 h-[6mm] flex items-center justify-center text-[6px] text-gray-500 text-center px-2">
                                IF FOUND PLEASE RETURN TO VULCAN SECURITY DEPARTMENT
                            </div>
                        </div>
                    </div>

                    <div className="p-8 w-full md:w-72 bg-white flex flex-col justify-center space-y-4 relative">
                        <button 
                            onClick={() => setShowQrModal(false)} 
                            className="absolute top-4 right-4 hidden md:flex p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-4">
                            <h2 className="text-xl font-black text-slate-900">{currentUserEmployee.name}</h2>
                            <p className="text-sm text-slate-500 font-mono">{currentUserEmployee.recordId}</p>
                        </div>

                        <button 
                            onClick={handleDownloadQr}
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
                                                <title>Print Back - ${currentUserEmployee.recordId}</title>
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
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ResultsPage;
