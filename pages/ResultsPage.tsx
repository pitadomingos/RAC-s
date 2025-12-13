
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
                <button 
                    onClick={handleExportData}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                    <Download size={16} /> Export
                </button>
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
    </div>
  );
};

export default ResultsPage;
