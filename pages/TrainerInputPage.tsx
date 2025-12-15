
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, TrainingSession, UserRole, RacDef } from '../types';
import { 
    Save, AlertCircle, CheckCircle, Lock, Users, ClipboardList, 
    UserCheck, GraduationCap, CheckCircle2, Search, CheckSquare, 
    X, Filter, ArrowUpDown, MessageSquare, Sliders, ChevronDown, Printer
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { addMonths, format } from 'date-fns';

interface TrainerInputPageProps {
  bookings: Booking[];
  updateBookings: (updates: Booking[]) => void;
  sessions: TrainingSession[];
  userRole?: UserRole;
  currentUserName?: string;
  racDefinitions: RacDef[];
}

const TrainerInputPage: React.FC<TrainerInputPageProps> = ({ 
  bookings, 
  updateBookings, 
  sessions,
  userRole = UserRole.SYSTEM_ADMIN,
  currentUserName = '',
  racDefinitions
}) => {
  const { t } = useLanguage();
  
  // -- SELECTION STATE --
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [sessionBookings, setSessionBookings] = useState<Booking[]>([]);
  
  // -- UI STATE --
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // -- FILTERS & SORTING --
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Passed' | 'Failed'>('All');
  const [sortBy, setSortBy] = useState<'Name' | 'ID' | 'Company' | 'Score'>('Name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // -- BULK OPERATIONS STATE --
  const [bulkTheory, setBulkTheory] = useState<string>('');
  const [bulkPractical, setBulkPractical] = useState<string>('');
  const [showBulkTools, setShowBulkTools] = useState(false);

  // --- DERIVED DATA ---
  const availableSessions = useMemo(() => {
      let relevantSessions = sessions;
      if (userRole === UserRole.RAC_TRAINER) {
          relevantSessions = sessions.filter(s => s.instructor === currentUserName);
      }
      return relevantSessions.filter(session => {
          const count = bookings.filter(b => b.sessionId === session.id && b.status === BookingStatus.PENDING).length;
          return count > 0; // Only show sessions with pending students
      });
  }, [sessions, bookings, userRole, currentUserName]);

  // --- LOGIC: Requirements Check ---
  const getRacRequirements = (sessionId: string) => {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return { needsDl: false, needsPractical: true }; 
      
      const racCode = session.racType.split(' - ')[0].replace(/\s/g, '');
      const def = racDefinitions.find(r => r.name === session.racType || r.code === racCode);
      
      return {
          needsDl: def ? !!def.requiresDriverLicense : false,
          needsPractical: def ? !!def.requiresPractical : true
      };
  };

  const reqs = useMemo(() => getRacRequirements(selectedSessionId), [selectedSessionId]);
  const currentSession = sessions.find(s => s.id === selectedSessionId);

  const calculateStatus = (booking: Booking): BookingStatus => {
    if (!booking.attendance) return BookingStatus.FAILED;
    if (reqs.needsDl && !booking.driverLicenseVerified) return BookingStatus.FAILED;
    
    const theory = booking.theoryScore || 0;
    const practical = booking.practicalScore || 0;

    if (theory < 70) return BookingStatus.FAILED;
    if (reqs.needsPractical && practical < 70) return BookingStatus.FAILED;
    
    return BookingStatus.PASSED;
  };

  // --- HANDLERS ---

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSelectedSessionId(sId);
    if (sId) {
      const filtered = bookings.filter(b => b.sessionId === sId && b.status === BookingStatus.PENDING);
      setSessionBookings(filtered.map(b => ({
        ...b,
        attendance: b.attendance ?? false,
        theoryScore: b.theoryScore ?? 0,
        practicalScore: b.practicalScore ?? 0,
        driverLicenseVerified: b.driverLicenseVerified ?? false,
        comments: b.comments || ''
      })));
    } else {
      setSessionBookings([]);
    }
    setHasUnsavedChanges(false);
    setSuccessMsg('');
    setSearchQuery('');
    setBulkTheory('');
    setBulkPractical('');
  };

  const handleInputChange = (id: string, field: keyof Booking, value: any) => {
    setSessionBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      
      const updatedBooking = { ...b, [field]: value };
      
      // Auto-fail practical if theory fails (optional logic)
      if (reqs.needsPractical && field === 'theoryScore') {
        const score = parseInt(value) || 0;
        if (score < 70) updatedBooking.practicalScore = 0;
      }
      
      updatedBooking.status = calculateStatus(updatedBooking);
      return updatedBooking;
    }));
    setHasUnsavedChanges(true);
  };

  // --- BULK ACTIONS ---
  const handleBulkAttendance = () => {
      setSessionBookings(prev => prev.map(b => {
          const updated = { ...b, attendance: true };
          updated.status = calculateStatus(updated);
          return updated;
      }));
      setHasUnsavedChanges(true);
  };

  const handleBulkScoreApply = () => {
      const tScore = parseInt(bulkTheory);
      const pScore = parseInt(bulkPractical);

      setSessionBookings(prev => prev.map(b => {
          // Only update filtered/visible students? No, usually applies to session context.
          // Let's apply to ALL in session for consistency, or strictly filtered.
          // Applying to filtered view is safer UX.
          if (!processedBookings.find(pb => pb.id === b.id)) return b;

          const updated = { ...b };
          if (!isNaN(tScore)) updated.theoryScore = tScore;
          if (reqs.needsPractical && !isNaN(pScore)) updated.practicalScore = pScore;
          
          updated.status = calculateStatus(updated);
          return updated;
      }));
      setHasUnsavedChanges(true);
      setShowBulkTools(false);
  };

  // --- SAVE ---
  const handleSave = () => {
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    const sessionDateStr = selectedSession?.date || new Date().toISOString().split('T')[0];
    
    // Determine Validity
    let racValidity = 24; 
    if (selectedSession) {
        const racCode = selectedSession.racType.split(' - ')[0].replace(/\s/g, '');
        const def = racDefinitions.find(r => r.code === racCode || r.name === selectedSession.racType);
        if (def && def.validityMonths) racValidity = def.validityMonths;
    }

    const bookingsToSave = sessionBookings.map(b => {
        if (b.status === BookingStatus.PASSED) {
            try {
                const d = new Date(sessionDateStr);
                const expiry = format(addMonths(d, racValidity), 'yyyy-MM-dd');
                return { ...b, resultDate: sessionDateStr, expiryDate: expiry };
            } catch {
                return { ...b, resultDate: sessionDateStr, expiryDate: sessionDateStr };
            }
        }
        return b; // Failed bookings get updated status but no expiry
    });

    updateBookings(bookingsToSave);
    setSuccessMsg('Results saved successfully!');
    setHasUnsavedChanges(false);
    
    // Auto-print after state update ensures the "Unsaved" badge is gone and "Success" is visible
    setTimeout(() => {
        window.print();
    }, 100);
    
    setTimeout(() => {
        setSuccessMsg('');
        // Reset selection to force refresh of lists.
        setSelectedSessionId('');
        setSessionBookings([]);
    }, 1500);
  };

  // --- PROCESSING PIPELINE (Filter & Sort) ---
  const processedBookings = useMemo(() => {
      let data = [...sessionBookings];

      // 1. Search
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          data = data.filter(b => 
              b.employee.name.toLowerCase().includes(q) || 
              b.employee.recordId.toLowerCase().includes(q)
          );
      }

      // 2. Filter Status
      if (statusFilter !== 'All') {
          data = data.filter(b => 
              statusFilter === 'Passed' ? b.status === BookingStatus.PASSED : b.status === BookingStatus.FAILED
          );
      }

      // 3. Sort
      data.sort((a, b) => {
          let valA: any = '';
          let valB: any = '';

          switch(sortBy) {
              case 'Name': valA = a.employee.name; valB = b.employee.name; break;
              case 'ID': valA = a.employee.recordId; valB = b.employee.recordId; break;
              case 'Company': valA = a.employee.company; valB = b.employee.company; break;
              case 'Score': valA = a.theoryScore || 0; valB = b.theoryScore || 0; break;
          }

          if (valA < valB) return sortDir === 'asc' ? -1 : 1;
          if (valA > valB) return sortDir === 'asc' ? 1 : -1;
          return 0;
      });

      return data;
  }, [sessionBookings, searchQuery, statusFilter, sortBy, sortDir]);

  // --- HEADER SORT HANDLER ---
  const handleHeaderClick = (field: typeof sortBy) => {
      if (sortBy === field) {
          setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
          setSortBy(field);
          setSortDir('asc');
      }
  };

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up">
      {/* Hero Header - NO PRINT */}
      <div className="no-print bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden border border-slate-700">
         <div className="absolute top-0 right-0 opacity-10 pointer-events-none"><GraduationCap size={200} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <ClipboardList size={32} className="text-yellow-500" />
                    {t.trainer.title}
                </h2>
                <p className="text-slate-400 mt-2 text-sm flex items-center gap-2">
                    <UserCheck size={16} />{t.trainer.loggedInAs} <span className="text-white font-bold">{currentUserName || 'Admin'}</span>
                </p>
            </div>
            {selectedSessionId && (
                <div className="flex gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm text-center min-w-[100px]">
                        <div className="text-2xl font-bold">{sessionBookings.length}</div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Total</div>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30 backdrop-blur-sm text-center min-w-[100px]">
                        <div className="text-2xl font-bold text-green-400">{sessionBookings.filter(b => b.status === BookingStatus.PASSED).length}</div>
                        <div className="text-[10px] uppercase text-green-300 font-bold">Passing</div>
                    </div>
                </div>
            )}
         </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[600px] print:shadow-none print:border-none print:min-h-0">
          
          {/* --- SESSION SELECTOR (No Print) --- */}
          <div className="no-print p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            {availableSessions.length === 0 ? (
                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-200 flex items-center justify-center gap-2">
                    <AlertCircle size={16} /><span>{t.trainer.noSessions}</span>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                        {t.trainer.selectSession}
                    </label>
                    <div className="relative group">
                        <select 
                            value={selectedSessionId} 
                            onChange={handleSessionChange} 
                            className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl shadow-sm focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 p-4 pl-12 text-lg font-bold appearance-none cursor-pointer transition-all"
                        >
                            <option value="">{t.trainer.chooseSession}</option>
                            {availableSessions.map(session => (
                                <option key={session.id} value={session.id}>{session.racType} • {session.date} • {session.location} ({session.capacity} Cap)</option>
                            ))}
                        </select>
                        <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors" size={24} />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                </div>
            )}
          </div>

          {selectedSessionId && sessionBookings.length > 0 ? (
            <>
                {/* --- PRINT HEADER --- */}
                <div className="hidden print:block p-8 border-b-2 border-black mb-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <img src="assets/vulcan.png" alt="Vulcan" className="h-16 w-auto" />
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight text-black">Training Result Register</h1>
                                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Critical Activity Requirements (RAC)</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-black">{currentSession?.racType}</div>
                            <div className="text-sm font-mono">{currentSession?.id}</div>
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-4 gap-4 text-sm border-t border-gray-300 pt-4">
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-500">Date</span>
                            <span className="font-bold text-black">{currentSession?.date}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-500">Time</span>
                            <span className="font-bold text-black">{currentSession?.startTime}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-500">Location</span>
                            <span className="font-bold text-black">{currentSession?.location}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-500">Instructor</span>
                            <span className="font-bold text-black">{currentSession?.instructor}</span>
                        </div>
                    </div>
                </div>

                {/* --- TOOLBAR --- */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-20 shadow-sm no-print">
                    {/* Left: Filters */}
                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Find student..." 
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-transparent focus:bg-white dark:focus:bg-slate-600 border focus:border-blue-500 rounded-lg text-sm transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                            {['All', 'Passed', 'Failed'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter as any)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === filter ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            <Printer size={16} /> Print Register
                        </button>
                        <button 
                            onClick={() => setShowBulkTools(!showBulkTools)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${showBulkTools ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Sliders size={16} /> Batch Operations
                        </button>
                    </div>
                </div>

                {/* --- BATCH TOOLS PANEL --- */}
                {showBulkTools && (
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-800 p-4 animate-fade-in-down flex flex-wrap items-center gap-4 no-print">
                        <button onClick={handleBulkAttendance} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 shadow-sm">
                            <CheckSquare size={16} /> Mark All Present
                        </button>
                        <div className="h-6 w-px bg-indigo-200 dark:bg-indigo-700 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">Bulk Score:</span>
                            <input 
                                type="number" 
                                placeholder="Theory" 
                                className="w-20 px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                                value={bulkTheory}
                                onChange={(e) => setBulkTheory(e.target.value)}
                            />
                            {reqs.needsPractical && (
                                <input 
                                    type="number" 
                                    placeholder="Prac" 
                                    className="w-20 px-2 py-1.5 text-xs border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                                    value={bulkPractical}
                                    onChange={(e) => setBulkPractical(e.target.value)}
                                />
                            )}
                            <button 
                                onClick={handleBulkScoreApply}
                                disabled={!bulkTheory && !bulkPractical}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                )}

                {/* --- DATA TABLE --- */}
                <div className="flex-1 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800 print:bg-gray-100">
                            <tr>
                                <th onClick={() => handleHeaderClick('Name')} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 group print:text-black print:border-b print:border-black">
                                    <div className="flex items-center gap-1">Student <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 ${sortBy === 'Name' ? 'opacity-100' : ''} no-print`}/></div>
                                </th>
                                <th onClick={() => handleHeaderClick('ID')} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 group hidden md:table-cell print:table-cell print:text-black print:border-b print:border-black">
                                    <div className="flex items-center gap-1">ID <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 ${sortBy === 'ID' ? 'opacity-100' : ''} no-print`}/></div>
                                </th>
                                <th onClick={() => handleHeaderClick('Company')} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 group hidden lg:table-cell print:table-cell print:text-black print:border-b print:border-black">
                                    <div className="flex items-center gap-1">Company <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 ${sortBy === 'Company' ? 'opacity-100' : ''} no-print`}/></div>
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16 print:text-black print:border-b print:border-black">Present</th>
                                {reqs.needsDl && <th className="px-4 py-3 text-center text-xs font-bold text-red-500 uppercase tracking-wider w-16 bg-red-50 dark:bg-red-900/10 print:bg-transparent print:text-black print:border-b print:border-black">DL Ver</th>}
                                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24 print:text-black print:border-b print:border-black">Theory</th>
                                {reqs.needsPractical && <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24 print:text-black print:border-b print:border-black">Practical</th>}
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32 print:text-black print:border-b print:border-black">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48 no-print">Remarks</th>
                                <th className="hidden print:table-cell px-4 py-3 text-center text-xs font-bold text-black uppercase tracking-wider w-32 border-b border-black">Signature</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800 print:divide-gray-300">
                            {processedBookings.map((booking) => {
                                const isDisqualified = reqs.needsDl && !booking.driverLicenseVerified;
                                const isPassed = booking.status === BookingStatus.PASSED;
                                
                                return (
                                <tr key={booking.id} className={`transition-colors ${isPassed ? 'bg-green-50/30 dark:bg-green-900/5 hover:bg-green-50/50 print:bg-transparent' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 print:bg-transparent'} print:break-inside-avoid`}>
                                    <td className="px-4 py-3 print:py-2 print:border-b print:border-gray-200">
                                        <div className="font-bold text-slate-800 dark:text-white text-sm print:text-black">{booking.employee.name}</div>
                                        <div className="text-xs text-slate-500 md:hidden print:hidden">{booking.employee.recordId}</div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell text-sm font-mono text-slate-600 dark:text-slate-300 print:table-cell print:text-black print:py-2 print:border-b print:border-gray-200">{booking.employee.recordId}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500 print:table-cell print:text-black print:py-2 print:border-b print:border-gray-200">{booking.employee.company}</td>
                                    
                                    <td className="px-4 py-3 text-center print:py-2 print:border-b print:border-gray-200">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer print:appearance-auto print:h-4 print:w-4"
                                            checked={booking.attendance || false}
                                            onChange={(e) => handleInputChange(booking.id, 'attendance', e.target.checked)}
                                        />
                                    </td>

                                    {reqs.needsDl && (
                                        <td className="px-4 py-3 text-center bg-red-50/30 dark:bg-red-900/10 print:bg-transparent print:py-2 print:border-b print:border-gray-200">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 rounded text-red-600 focus:ring-red-500 border-gray-300 cursor-pointer print:appearance-auto print:h-4 print:w-4"
                                                checked={booking.driverLicenseVerified || false}
                                                onChange={(e) => handleInputChange(booking.id, 'driverLicenseVerified', e.target.checked)}
                                            />
                                        </td>
                                    )}

                                    <td className="px-4 py-3 print:py-2 print:border-b print:border-gray-200">
                                        <input 
                                            type="number" min="0" max="100"
                                            className={`w-full text-center p-1.5 text-sm font-bold border rounded-lg outline-none focus:ring-2 transition-all 
                                                print:border-none print:bg-transparent print:p-0 print:text-black
                                                ${isDisqualified ? 'bg-slate-100 text-slate-400 cursor-not-allowed print:text-gray-300' : 
                                                (booking.theoryScore || 0) >= 70 ? 'border-green-300 bg-green-50 text-green-700 focus:ring-green-500 print:text-black' : 'border-red-300 bg-red-50 text-red-700 focus:ring-red-500 print:text-black'}
                                            `}
                                            value={booking.theoryScore}
                                            disabled={isDisqualified}
                                            onChange={(e) => handleInputChange(booking.id, 'theoryScore', parseInt(e.target.value) || 0)}
                                        />
                                    </td>

                                    {reqs.needsPractical && (
                                        <td className="px-4 py-3 relative print:py-2 print:border-b print:border-gray-200">
                                            {isDisqualified || (booking.theoryScore || 0) < 70 ? (
                                                <div className="absolute inset-0 flex items-center justify-center print:hidden">
                                                    <Lock size={14} className="text-slate-300" />
                                                </div>
                                            ) : (
                                                <input 
                                                    type="number" min="0" max="100"
                                                    className={`w-full text-center p-1.5 text-sm font-bold border rounded-lg outline-none focus:ring-2 transition-all 
                                                        print:border-none print:bg-transparent print:p-0 print:text-black
                                                        ${(booking.practicalScore || 0) >= 70 ? 'border-green-300 bg-green-50 text-green-700 focus:ring-green-500' : 'border-red-300 bg-red-50 text-red-700 focus:ring-red-500'}
                                                    `}
                                                    value={booking.practicalScore}
                                                    onChange={(e) => handleInputChange(booking.id, 'practicalScore', parseInt(e.target.value) || 0)}
                                                />
                                            )}
                                        </td>
                                    )}

                                    <td className="px-4 py-3 print:py-2 print:border-b print:border-gray-200">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm print:border-none print:shadow-none print:px-0 print:text-black print:bg-transparent ${
                                            isPassed 
                                            ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
                                            : 'bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
                                        }`}>
                                            {isPassed ? <CheckCircle2 size={12} className="print:hidden"/> : <X size={12} className="print:hidden"/>}
                                            {booking.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 no-print">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Add remarks..."
                                                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-xs py-1 text-slate-600 dark:text-slate-300"
                                                value={booking.comments || ''}
                                                onChange={(e) => handleInputChange(booking.id, 'comments', e.target.value)}
                                            />
                                            <MessageSquare size={10} className="absolute right-0 top-1.5 text-slate-300 pointer-events-none" />
                                        </div>
                                    </td>

                                    {/* Signature Column - Print Only */}
                                    <td className="hidden print:table-cell px-4 py-3 border-b border-gray-200"></td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* --- PRINT FOOTER --- */}
                <div className="hidden print:flex mt-12 pt-8 border-t-2 border-black justify-between gap-20 page-break-inside-avoid">
                    <div className="flex-1">
                        <div className="border-t border-black w-full pt-2">
                            <p className="font-bold text-sm text-black">Instructor Signature</p>
                            <p className="text-xs text-gray-500">I certify that the above results are accurate and true.</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="border-t border-black w-full pt-2">
                            <p className="font-bold text-sm text-black">HSE Reviewer / Supervisor</p>
                            <p className="text-xs text-gray-500">Validation of training record.</p>
                        </div>
                    </div>
                </div>

                {/* --- STICKY FOOTER ACTION BAR (No Print) --- */}
                <div className="sticky bottom-0 z-30 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center no-print">
                    <div className="text-xs text-slate-500 font-medium">
                        {hasUnsavedChanges ? <span className="text-amber-600 font-bold flex items-center gap-1"><AlertCircle size={14}/> Unsaved changes pending...</span> : <span className="text-green-600 flex items-center gap-1">{successMsg && <CheckCircle size={14}/>} {successMsg}</span>}
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={!hasUnsavedChanges}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                            hasUnsavedChanges 
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-yellow-500/30' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        <Save size={18} /> {t.trainer.saveResults}
                    </button>
                </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-full mb-4">
                    <ClipboardList size={48} className="text-slate-300 dark:text-slate-500" />
                 </div>
                 <p className="font-medium text-lg">No pending sessions selected.</p>
                 <p className="text-sm">Choose a session above to start grading.</p>
             </div>
          )}
      </div>
    </div>
  );
};

export default TrainerInputPage;
