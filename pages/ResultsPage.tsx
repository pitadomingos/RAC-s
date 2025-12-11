
// ... existing imports ...
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Booking, BookingStatus, UserRole, TrainingSession } from '../types';
import { 
  Upload, FileSpreadsheet, Search, Filter, Download, 
  CheckCircle2, XCircle, Award, Users, TrendingUp,
  FileText, ArrowUpRight, MoreVertical, Calendar, User, MapPin,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, addYears } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { RAC_KEYS } from '../constants';

interface ResultsPageProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  importBookings?: (newBookings: Booking[]) => void;
  userRole: UserRole;
  sessions: TrainingSession[];
}

const ResultsPage: React.FC<ResultsPageProps> = ({ bookings, updateBookingStatus, importBookings, userRole, sessions }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  // -- Filter States --
  const [filter, setFilter] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trainerFilter, setTrainerFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [racFilter, setRacFilter] = useState<string>('All');

  // -- Pagination State --
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  // ... useEffects and logic for filtering (same as before) ...
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) setFilter(query);
  }, [searchParams]);

  useEffect(() => {
      setCurrentPage(1);
  }, [filter, statusFilter, trainerFilter, dateFilter, racFilter]);

  const uniqueTrainers = useMemo(() => {
      const trainers = new Set<string>();
      sessions.forEach(s => {
          if (s.instructor && s.instructor !== 'TBD') trainers.add(s.instructor);
      });
      return Array.from(trainers).sort();
  }, [sessions]);

  // -- LOGIC: Filtering --
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const session = sessions.find(s => s.id === b.sessionId);
      const bookingDate = session ? session.date : (b.resultDate || '');
      // Lookup trainer from session OR from historical record encoded in sessionId
      let bookingTrainer = session ? session.instructor : '';
      if (!bookingTrainer && b.sessionId.includes('|')) {
          const parts = b.sessionId.split('|');
          if (parts.length >= 3) bookingTrainer = parts[2];
      }

      let bookingRacCode = '';
      if (session) bookingRacCode = session.racType.split(' - ')[0].replace(' ', '');
      else if (b.sessionId.includes('RAC')) bookingRacCode = b.sessionId.split(' - ')[0].replace(' ', '');
      if (!bookingRacCode && b.sessionId.includes('|')) bookingRacCode = b.sessionId.split('|')[0];

      const matchesSearch = String(b.employee.name).toLowerCase().includes(filter.toLowerCase()) || String(b.employee.recordId).includes(filter);
      const matchesStatus = statusFilter === 'All' ? true : b.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesTrainer = trainerFilter === 'All' ? true : bookingTrainer === trainerFilter;
      const matchesDate = dateFilter === '' ? true : bookingDate === dateFilter;
      const matchesRac = racFilter === 'All' ? true : bookingRacCode === racFilter;

      return matchesSearch && matchesStatus && matchesTrainer && matchesDate && matchesRac;
    });
  }, [bookings, filter, statusFilter, trainerFilter, dateFilter, racFilter, sessions]);

  // -- LOGIC: Pagination --
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
  };

  // -- LOGIC: Stats (same as before) --
  const stats = useMemo(() => {
      const total = filteredBookings.length;
      const passed = filteredBookings.filter(b => b.status === BookingStatus.PASSED).length;
      const failed = filteredBookings.filter(b => b.status === BookingStatus.FAILED).length;
      const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
      const theorySum = filteredBookings.reduce((acc, curr) => acc + (curr.theoryScore || 0), 0);
      const avgTheory = total > 0 ? (theorySum / total).toFixed(1) : '0.0';
      return { total, passed, failed, passRate, avgTheory };
  }, [filteredBookings]);

  // -- ACTIONS --
  const handleDownloadTemplate = () => {
    const headers = [
      'Full Name', 'Record ID', 'Company', 'Department', 'Role',
      'RAC Code (e.g. RAC01)', 'Date (YYYY-MM-DD)', 'Trainer', 'Room', 
      'Status (Passed/Failed)', 'Theory Score', 'Practical Score', 
      'DL Number', 'DL Class', 'DL Expiry (YYYY-MM-DD)'
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vulcan_records_template.csv");
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
      const dataRows = lines.slice(1);
      const newBookings: Booking[] = [];

      dataRows.forEach(line => {
        const cols = line.split(',');
        if (cols.length < 9) return; 

        // Map columns based on new template
        const [
            name, recordId, company, dept, role,
            racCode, date, trainer, room, statusRaw, theory, practical, dlNum, dlClass, dlExp
        ] = cols.map(c => c?.trim());

        if (!name || !recordId || !racCode) return;

        const status = statusRaw?.toLowerCase() === 'passed' ? BookingStatus.PASSED : BookingStatus.FAILED;
        let expiryDate = '';
        
        if (status === BookingStatus.PASSED && date) {
             try {
                const d = new Date(date);
                expiryDate = format(addYears(d, 2), 'yyyy-MM-dd');
             } catch(e) {}
        }

        // Encode historical metadata into sessionId string
        // Format: RAC01|Historical|John Doe|Room 101
        const sessionString = `${racCode}|Historical|${trainer || 'Unknown'}|${room || 'Unknown'}`;

        const newBooking: Booking = {
            id: uuidv4(),
            sessionId: sessionString,
            status: status,
            resultDate: date,
            expiryDate: expiryDate,
            theoryScore: parseInt(theory) || 0,
            practicalScore: parseInt(practical) || 0,
            attendance: true,
            employee: {
                id: uuidv4(),
                name,
                recordId,
                company: company || 'Unknown',
                department: dept || 'Operations',
                role: role || 'Staff',
                driverLicenseNumber: dlNum,
                driverLicenseClass: dlClass,
                driverLicenseExpiry: dlExp
            }
        };
        newBookings.push(newBooking);
      });

      if (newBookings.length > 0 && importBookings) {
          importBookings(newBookings);
          alert(`Successfully imported ${newBookings.length} records.`);
      } else {
          alert("No valid records found in file.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
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
    <div className="space-y-8 pb-12 animate-fade-in-up">
        {/* ... KPI HEADER ... */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <FileText size={32} className="text-yellow-500" />
                        {t.results.title}
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm max-w-xl">High-definition view of all training records.</p>
                </div>
                {/* Admin Actions */}
                {userRole === UserRole.SYSTEM_ADMIN && (
                    <div className="flex gap-3">
                        <button onClick={handleDownloadTemplate} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-bold backdrop-blur-sm border border-white/10 flex items-center gap-2 transition-all"><FileSpreadsheet size={16} />{t.common.template}</button>
                        <button onClick={() => fileInputRef.current?.click()} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"><Upload size={16} />{t.common.import}</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                    </div>
                )}
            </div>
            {/* Stats Cards Row */}
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

        {/* --- CONTROL BAR --- */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 sticky top-4 z-20 transition-all">
            <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
                <div className="relative flex-1 min-w-[200px] w-full md:w-auto group">
                    <Search className="absolute left-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors" size={18} />
                    <input type="text" placeholder={t.results.searchPlaceholder} className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white transition-all" value={filter} onChange={(e) => setFilter(e.target.value)} />
                </div>
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

        {/* --- DATA GRID --- */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="px-6 py-4 text-left text-xs font-bold text-black dark:text-slate-400 uppercase tracking-wider">{t.results.table.employee}</th>
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
                            <tr><td colSpan={10} className="px-6 py-12 text-center text-gray-400">No records found</td></tr>
                        ) : (
                            paginatedBookings.map((booking) => {
                                const { isRac02 } = getRacDetails(booking.sessionId);
                                const dlExpiry = booking.employee.driverLicenseExpiry || '';
                                const isDlExpired = dlExpiry && new Date(dlExpiry) < new Date();
                                const dlClass = String(booking.employee.driverLicenseClass || '-');
                                const dlExpStr = String(dlExpiry || '-');
                                const initials = booking.employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                
                                const session = sessions.find(s => s.id === booking.sessionId);
                                
                                // Resolve Date
                                const displayDate = session ? session.date : (booking.resultDate || '-');
                                
                                // Resolve Trainer & Room: Try Session -> Try Encoded string -> Default
                                let displayTrainer = session ? session.instructor : '-';
                                let displayRoom = session ? session.location : '-';
                                
                                if (!session && booking.sessionId.includes('|')) {
                                    const parts = booking.sessionId.split('|');
                                    // Encoded: RAC01|Historical|John Doe|Room 101
                                    if (parts.length >= 3) displayTrainer = parts[2];
                                    if (parts.length >= 4) displayRoom = parts[3];
                                }

                                // Display Session Name (Cleaned)
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
                                                    <div className="text-xs text-slate-600 font-mono flex items-center gap-1">{String(booking.employee.recordId)}<span className="text-slate-300">•</span><span className="truncate max-w-[100px]">{booking.employee.company}</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col"><span className="text-sm font-medium text-slate-800 dark:text-slate-300">{displaySessionName}</span></div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{displayDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-1"><User size={12} className="text-slate-400" />{displayTrainer}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" />{displayRoom}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isRac02 ? (
                                                <div className="flex flex-col text-xs">
                                                    <div className="flex gap-2 mb-0.5"><span className="font-bold text-slate-700">Cls:</span><span className="text-slate-900 dark:text-slate-300 font-mono">{dlClass}</span></div>
                                                    <div className={`${isDlExpired ? 'text-red-600 font-bold flex items-center gap-1' : 'text-slate-600'}`}>{isDlExpired && <XCircle size={10} />}<span>Exp: {dlExpStr}</span></div>
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

            {/* --- PAGINATION FOOTER --- */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center bg-slate-50 dark:bg-slate-800/50 gap-4">
                <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-600 dark:text-slate-400">Rows per page:</span>
                     <select value={itemsPerPage} onChange={handlePageSizeChange} className="text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
                         <option value={10}>10</option><option value={20}>20</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option><option value={120}>120</option>
                     </select>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-slate-500">Page {currentPage} of {Math.max(1, totalPages)} ({filteredBookings.length} total)</div>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 transition-colors"><ChevronLeft size={16} /></button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ResultsPage;
