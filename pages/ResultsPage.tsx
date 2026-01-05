
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Booking, BookingStatus, UserRole, TrainingSession, Employee, EmployeeRequirement, RacDef, SystemNotification } from '../types';
import { 
  Upload, FileSpreadsheet, Search, Filter, Download, 
  CheckCircle2, XCircle, Award, Users, TrendingUp,
  FileText, Calendar, User, MapPin,
  ChevronLeft, ChevronRight, Briefcase, QrCode, Printer, Phone, AlertTriangle, X, Clock, CreditCard, UserX, ListFilter, LayoutList, Info, Rocket
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, addMonths, isValid } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { OPS_KEYS } from '../constants';
import { db } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';

interface ResultsPageProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  importBookings?: (newBookings: Booking[], sideEffects?: { employee: Employee, aso: string, ops: Record<string, boolean> }[]) => void;
  userRole: UserRole;
  sessions: TrainingSession[];
  currentEmployeeId?: string;
  racDefinitions: RacDef[];
  addNotification: (notif: SystemNotification) => void;
  currentSiteId: string;
  onRefresh?: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ bookings, updateBookingStatus, importBookings, userRole, sessions, currentEmployeeId, racDefinitions, addNotification, currentSiteId, onRefresh }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialQuery = searchParams.get('q') || '';
  const [filter, setFilter] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trainerFilter, setTrainerFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [racFilter, setRacFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<'All' | 'Waitlist'>('All');
  const [isPromoting, setIsPromoting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  const isAdmin = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN || userRole === UserRole.SITE_ADMIN;

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) setFilter(query);
    if (location.state?.filterWaitlist) {
        setViewMode('Waitlist');
        setStatusFilter('waitlisted');
    }
  }, [searchParams, location.state]);

  useEffect(() => {
      setCurrentPage(1);
  }, [filter, statusFilter, trainerFilter, dateFilter, racFilter, viewMode]);

  const uniqueTrainers = useMemo(() => {
      const trainers = new Set<string>();
      bookings.forEach(b => {
          if (b.trainerName) trainers.add(b.trainerName);
      });
      return Array.from(trainers).sort();
  }, [bookings]);

  const getTranslatedRacName = (rawInput: string) => {
      if (!rawInput) return '';
      let code = rawInput;
      if (code.includes(' - ')) code = code.split(' - ')[0];
      else if (code.includes('|')) code = code.split('|')[0];
      const cleanCode = code.replace(/\s+/g, '').toUpperCase().replace('(IMP)', '').replace('(IMP)', '');
      // @ts-ignore
      const translated = t.racDefs?.[cleanCode];
      if (translated) return translated;
      const def = racDefinitions.find(r => r.code.replace(/\s+/g, '').toUpperCase() === cleanCode);
      if (def) return def.name;
      return rawInput;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const siteId = b.employee.siteId || 's1';
      if (currentSiteId !== 'all' && siteId !== currentSiteId) return false;
      if (userRole === UserRole.USER && currentEmployeeId) {
          if (b.employee.id !== currentEmployeeId) return false;
      }
      if (viewMode === 'Waitlist' && b.status !== BookingStatus.WAITLISTED) return false;
      
      const session = sessions.find(s => s.id === b.sessionId);
      const bookingDate = session ? session.date : (b.resultDate || '');
      const bookingTrainer = b.trainerName || (session ? session.instructor : 'TBD');
      
      let bookingRacCode = '';
      if (session) bookingRacCode = session.racType.split(' - ')[0].replace(' ', '');
      else if (b.sessionId.includes('RAC')) bookingRacCode = b.sessionId.split(' - ')[0].replace(' ', '');
      if (!bookingRacCode && b.sessionId.includes('|')) bookingRacCode = b.sessionId.split('|')[0];
      bookingRacCode = bookingRacCode.replace(/(\(imp\))/gi, '').replace(/\s+/g, '').toUpperCase();

      const matchesSearch = String(b.employee.name).toLowerCase().includes(filter.toLowerCase()) || String(b.employee.recordId).includes(filter);
      const matchesStatus = statusFilter === 'All' ? true : b.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesTrainer = trainerFilter === 'All' ? true : bookingTrainer === trainerFilter;
      const matchesDate = dateFilter === '' ? true : bookingDate === dateFilter;
      const matchesRac = racFilter === 'All' ? true : bookingRacCode === racFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesTrainer && matchesDate && matchesRac;
    });
  }, [bookings, filter, statusFilter, trainerFilter, dateFilter, racFilter, sessions, userRole, currentEmployeeId, currentSiteId, viewMode]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePromote = async (booking: Booking) => {
      setIsPromoting(booking.id);
      try {
          await db.promoteFromWaitlist(booking.id, booking.sessionId, booking.employee.id);
          await db.addLog('AUDIT', `PROMOTED_FROM_WAITLIST: ${booking.employee.recordId}`, user?.name || 'Admin');
          addNotification({
              id: uuidv4(),
              type: 'success',
              title: 'Personnel Promoted',
              message: `${booking.employee.name} moved to Confirmed Seat.`,
              timestamp: new Date(),
              isRead: false
          });
          if (onRefresh) onRefresh();
      } catch (err) {
          console.error(err);
      } finally {
          setIsPromoting(null);
      }
  };

  const stats = useMemo(() => {
      const total = filteredBookings.length;
      const passed = filteredBookings.filter(b => b.status === BookingStatus.PASSED).length;
      const failed = filteredBookings.filter(b => b.status === BookingStatus.FAILED).length;
      const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
      return { total, passed, failed, passRate };
  }, [filteredBookings]);

  const handleExportData = () => {
      const headers = ['ID', 'Name', 'Company', 'Department', 'Role', 'Training', 'Date', 'Trainer', 'Status', 'Expiry'];
      const csvRows = filteredBookings.map(b => {
          const session = sessions.find(s => s.id === b.sessionId);
          const rac = session ? session.racType : b.sessionId;
          const date = session ? session.date : (b.resultDate || '');
          const trainer = b.trainerName || (session ? session.instructor : 'TBD');
          return [b.employee.recordId, `"${b.employee.name}"`, b.employee.company, b.employee.department, b.employee.role, rac, date, trainer, b.status, b.expiryDate || ''];
      });
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvRows.map(r => r.join(','))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const isPracticalRequired = (racCode: string) => {
      const def = racDefinitions.find(r => r.code.replace(/\s+/g, '') === racCode || r.name.includes(racCode));
      return def ? !!def.requiresPractical : true;
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full flex flex-col">
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
                <p className="text-xs font-bold text-slate-500 uppercase">Queue Size</p>
                <div className="text-2xl font-black text-amber-500 mt-1">{bookings.filter(b => b.status === BookingStatus.WAITLISTED).length}</div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-10">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                    <button 
                        onClick={() => { setViewMode('All'); setStatusFilter('All'); }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'All' ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        <LayoutList size={14} className="inline mr-2" /> {t.results.viewAll}
                    </button>
                    <button 
                        onClick={() => { setViewMode('Waitlist'); setStatusFilter('waitlisted'); }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'Waitlist' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                        <ListFilter size={14} className="inline mr-2" /> {t.results.viewWaitlist}
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder={t.results.searchPlaceholder} 
                        className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm w-64"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <button onClick={handleExportData} className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                <Download size={16} /> {t.results.export}
            </button>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Personnel</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Module</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                        {paginatedBookings.map((booking) => {
                            const session = sessions.find(s => s.id === booking.sessionId);
                            const racName = getTranslatedRacName(session ? session.racType : booking.sessionId);
                            const isWaitlisted = booking.status === BookingStatus.WAITLISTED;

                            return (
                                <tr key={booking.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isWaitlisted ? 'bg-amber-50/30' : ''}`}>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{booking.employee.name}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">{booking.employee.recordId} • {booking.employee.company}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {racName}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                                        {session ? session.date : (booking.resultDate || '-')}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                            booking.status === BookingStatus.PASSED ? 'bg-green-50 text-green-700' :
                                            booking.status === BookingStatus.WAITLISTED ? 'bg-amber-50 text-amber-700 animate-pulse' :
                                            'bg-blue-50 text-blue-700'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {isWaitlisted && isAdmin && (
                                            <button 
                                                onClick={() => handlePromote(booking)}
                                                disabled={isPromoting === booking.id}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-2 ml-auto disabled:opacity-50"
                                            >
                                                {isPromoting === booking.id ? <Clock size={12} className="animate-spin" /> : <Rocket size={12} />}
                                                PROMOTE
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
                <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1 border rounded disabled:opacity-30"><ChevronLeft size={16} /></button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-1 border rounded disabled:opacity-30"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ResultsPage;
