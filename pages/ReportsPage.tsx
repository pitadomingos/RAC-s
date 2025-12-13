import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, TrainingSession, RacDef } from '../types';
import { DEPARTMENTS, RAC_KEYS } from '../constants';
import { generateSafetyReport } from '../services/geminiService';
import { 
  FileText, Calendar, Sparkles, BarChart3, Printer, UserX, 
  AlertCircle, UserCheck, TrendingUp, Users, CheckCircle2, XCircle,
  Award, Filter, Map
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface ReportsPageProps {
  bookings: Booking[];
  sessions: TrainingSession[];
  racDefinitions: RacDef[];
}

type ReportPeriod = 'Weekly' | 'Monthly' | 'YTD' | 'Custom' | 'All Time';

const ReportsPage: React.FC<ReportsPageProps> = ({ bookings, sessions, racDefinitions }) => {
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState<ReportPeriod>('All Time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRac, setSelectedRac] = useState('All');
  
  // Site Filter (Derived from data availability for now)
  const [selectedSite, setSelectedSite] = useState('All');
  const availableSites = useMemo(() => {
      const sites = new Set<string>();
      bookings.forEach(b => {
          if (b.employee.siteId) sites.add(b.employee.siteId);
      });
      // Map IDs to readable names if possible (using mock logic or passed props, here simplified)
      return Array.from(sites);
  }, [bookings]);

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // -- Helpers --
  const getBookingDate = (b: Booking) => {
    if (b.resultDate) return b.resultDate;
    const session = sessions.find(s => s.id === b.sessionId);
    return session ? session.date : '';
  };

  const getRacCode = (b: Booking) => {
    const session = sessions.find(s => s.id === b.sessionId);
    const rawName = session ? session.racType : b.sessionId;
    return rawName.split(' - ')[0].replace(' ', '');
  };

  // -- 1. Data Filtering --
  const filteredBookings = useMemo(() => {
    let start = startDate;
    let end = endDate;

    const today = new Date();
    if (period === 'Weekly') {
       const lastWeek = new Date(today);
       lastWeek.setDate(today.getDate() - 7);
       start = lastWeek.toISOString().split('T')[0];
       end = today.toISOString().split('T')[0];
    } else if (period === 'Monthly') {
       const lastMonth = new Date(today);
       lastMonth.setMonth(today.getMonth() - 1);
       start = lastMonth.toISOString().split('T')[0];
       end = today.toISOString().split('T')[0];
    } else if (period === 'YTD') {
       start = `${today.getFullYear()}-01-01`;
       end = today.toISOString().split('T')[0];
    }
    // 'All Time' leaves start/end as empty or ignored strings

    return bookings.filter(b => {
       const bDate = getBookingDate(b);
       
       // Only filter by date if NOT 'All Time' and bDate exists
       if (period !== 'All Time') {
           if (!bDate) return false;
           if (start && bDate < start) return false;
           if (end && bDate > end) return false;
       }

       if (selectedDept !== 'All' && b.employee.department !== selectedDept) return false;
       if (selectedRac !== 'All' && getRacCode(b) !== selectedRac) return false;
       // Site Filter
       const bSite = b.employee.siteId || 's1'; // Default
       if (selectedSite !== 'All' && bSite !== selectedSite) return false;

       return true;
    });
  }, [bookings, period, startDate, endDate, selectedDept, selectedRac, selectedSite, sessions]);

  // -- 2. Stats Calculation --
  const stats = useMemo(() => {
     const total = filteredBookings.length;
     const passed = filteredBookings.filter(b => b.status === BookingStatus.PASSED).length;
     const failed = filteredBookings.filter(b => b.status === BookingStatus.FAILED).length;
     const attended = filteredBookings.filter(b => b.attendance).length;
     
     const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
     const attendanceRate = total > 0 ? ((attended / total) * 100).toFixed(1) : '0.0';

     const racStats: Record<string, { total: number, passed: number, failed: number }> = {};
     filteredBookings.forEach(b => {
        const code = getRacCode(b);
        if (!racStats[code]) racStats[code] = { total: 0, passed: 0, failed: 0 };
        racStats[code].total++;
        if (b.status === BookingStatus.PASSED) racStats[code].passed++;
        if (b.status === BookingStatus.FAILED) racStats[code].failed++;
     });

     const failingRacs = Object.entries(racStats)
        .map(([key, val]) => ({ key, failRate: (val.failed / val.total) * 100 }))
        .sort((a, b) => b.failRate - a.failRate)
        .slice(0, 3);

     const chartData = Object.keys(racStats).map(key => ({
        name: key,
        Passed: racStats[key].passed,
        Failed: racStats[key].failed
     }));

     const pieData = [
        { name: 'Passed', value: passed, color: '#10b981' }, // Emerald-500
        { name: 'Failed', value: failed, color: '#ef4444' }, // Red-500
        { name: 'Pending', value: total - passed - failed, color: '#f59e0b' } // Amber-500
     ].filter(d => d.value > 0);

     return {
        total, passed, failed, passRate, attendanceRate, racStats, failingRacs, chartData, pieData
     };
  }, [filteredBookings]);

  // -- 3. Trainer Stats --
  const trainerStats = useMemo(() => {
    const tStats: Record<string, { total: number, passed: number, theorySum: number }> = {};

    filteredBookings.forEach(b => {
        const session = sessions.find(s => s.id === b.sessionId);
        if (!session) return;
        const trainer = session.instructor;
        if (!tStats[trainer]) tStats[trainer] = { total: 0, passed: 0, theorySum: 0 };
        tStats[trainer].total++;
        if (b.status === BookingStatus.PASSED) tStats[trainer].passed++;
        tStats[trainer].theorySum += (b.theoryScore || 0);
    });

    return Object.entries(tStats).map(([name, data]) => ({
        name,
        students: data.total,
        passRate: data.total > 0 ? (data.passed / data.total * 100).toFixed(1) : '0.0',
        avgTheory: data.total > 0 ? (data.theorySum / data.total).toFixed(1) : '0.0'
    })).sort((a, b) => parseFloat(b.passRate) - parseFloat(a.passRate));
  }, [filteredBookings, sessions]);

  // -- 4. No Shows --
  const noShowList = useMemo(() => {
    return filteredBookings
        .filter(b => !b.attendance)
        .map(b => ({
            id: String(b.employee.recordId),
            name: String(b.employee.name),
            company: String(b.employee.company),
            rac: String(getRacCode(b)),
            date: String(getBookingDate(b))
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredBookings]);

  // -- AI Gen --
  const handleGenerateReport = async () => {
     setIsGenerating(true);
     const context = {
        period,
        startDate,
        endDate,
        department: selectedDept,
        site: selectedSite,
        metrics: {
            totalBookings: stats.total,
            passRate: stats.passRate + '%',
            attendanceRate: stats.attendanceRate + '%',
            noShowCount: noShowList.length,
            topFailingRacs: stats.failingRacs.map(r => `${r.key} (${r.failRate.toFixed(1)}% fail rate)`),
            racBreakdown: stats.chartData,
            trainerPerformance: trainerStats.map(t => `${t.name}: ${t.passRate}% Pass Rate`)
        }
     };
     const result = await generateSafetyReport(context, period, language);
     setAiReport(result);
     setIsGenerating(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in-up">
       
       {/* --- Control Bar --- */}
       <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col xl:flex-row justify-between gap-6 transition-all sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg text-white">
                <BarChart3 size={28} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t.reports.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{t.reports.subtitle}</p>
             </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
             {/* Period Filter */}
             <div className="flex-1 min-w-[120px]">
                <label className="text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-1 block ml-1">{t.reports.filters.period}</label>
                <div className="relative group">
                   <select 
                     value={period} 
                     onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
                     className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-600 transition-colors"
                   >
                      <option value="All Time">All Time</option>
                      <option value="Weekly">{t.reports.periods.weekly}</option>
                      <option value="Monthly">{t.reports.periods.monthly}</option>
                      <option value="YTD">{t.reports.periods.ytd}</option>
                      <option value="Custom">{t.reports.periods.custom}</option>
                   </select>
                   <Calendar className="absolute right-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors" size={16} />
                </div>
             </div>

             {/* Site Filter (Admin Only Feature) */}
             {availableSites.length > 0 && (
                 <div className="flex-1 min-w-[120px]">
                    <label className="text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-1 block ml-1">Site</label>
                    <div className="relative">
                        <select 
                            value={selectedSite} 
                            onChange={(e) => setSelectedSite(e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                        >
                            <option value="All">{t.common.all}</option>
                            {availableSites.map(s => <option key={s} value={s}>{s === 's1' ? 'Moatize' : s === 's2' ? 'Maputo' : s}</option>)}
                        </select>
                        <Map className="absolute right-3 top-2.5 text-slate-400" size={16} />
                    </div>
                 </div>
             )}

             {period === 'Custom' && (
                <>
                   <div>
                      <label className="text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-1 block ml-1">{t.reports.filters.startDate}</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white" />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-1 block ml-1">{t.reports.filters.endDate}</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white" />
                   </div>
                </>
             )}

             <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-1 block ml-1">{t.reports.filters.department}</label>
                <div className="relative">
                    <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
                        <option value="All">{t.common.all}</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <Filter className="absolute right-3 top-2.5 text-slate-400" size={16} />
                </div>
             </div>

             <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-1 block ml-1">{t.reports.filters.racType}</label>
                <div className="relative">
                    <select value={selectedRac} onChange={(e) => setSelectedRac(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
                        <option value="All">{t.common.all}</option>
                        {racDefinitions.length > 0 ? (
                            racDefinitions.map(def => <option key={def.code} value={def.code}>{def.code}</option>)
                        ) : (
                            RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <Filter className="absolute right-3 top-2.5 text-slate-400" size={16} />
                </div>
             </div>

             <button 
                onClick={() => window.print()}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title={t.reports.printReport}
             >
                <Printer size={20} />
             </button>
          </div>
       </div>

       {/* --- KPI Command Center --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
             title={t.reports.stats.totalTrained} 
             value={stats.total} 
             icon={Users} 
             gradient="from-blue-500 to-cyan-400" 
             subtext="Employees processed"
          />
          <StatCard 
             title={t.reports.stats.passRate} 
             value={`${stats.passRate}%`} 
             icon={CheckCircle2} 
             gradient={Number(stats.passRate) >= 80 ? "from-emerald-500 to-green-400" : "from-orange-500 to-red-400"}
             subtext="Overall success rate"
          />
          <StatCard 
             title={t.reports.stats.attendance} 
             value={`${stats.attendanceRate}%`} 
             icon={UserCheck} 
             gradient="from-violet-500 to-purple-400" 
             subtext="Presence confirmed"
          />
          <StatCard 
             title={t.reports.stats.noShows} 
             value={noShowList.length} 
             icon={UserX} 
             gradient="from-pink-500 to-rose-400" 
             subtext="Absences recorded"
          />
       </div>

       {/* --- Charts Section --- */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* RAC Performance Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <TrendingUp className="text-blue-500" size={20} />
                      {t.reports.charts.performance}
                   </h3>
                   <p className="text-xs text-slate-500">Pass vs Fail count per Module</p>
                </div>
             </div>
             <div className="h-80 w-full" style={{ minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <Tooltip 
                         cursor={{fill: '#f1f5f9'}}
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="Passed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Pass Ratio Donut Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-full">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Outcome Distribution</h3>
             <p className="text-xs text-slate-500 mb-6">Visual breakdown of results</p>
             
             <div className="flex-1 w-full min-h-[250px] relative" style={{ minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                         data={stats.pieData}
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                      >
                         {stats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                         ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36}/>
                   </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                   <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.total}</span>
                   <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                </div>
             </div>
          </div>
       </div>

       {/* --- AI & Trainers Row --- */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Analysis Card */}
          <div className="lg:col-span-2 relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
             {/* Decorative Gradient Border */}
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
             
             <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                         <Sparkles size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.reports.executiveAnalysis}</h3>
                         <p className="text-xs text-slate-500">AI-Powered Insights based on filtered data</p>
                      </div>
                   </div>
                   <button 
                      onClick={handleGenerateReport}
                      disabled={isGenerating || stats.total === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg transition-all transform hover:scale-105
                         ${isGenerating ? 'bg-slate-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}
                      `}
                   >
                      {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full"/> : <Sparkles size={14}/>}
                      {isGenerating ? t.reports.analyzing : t.reports.generate}
                   </button>
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700 overflow-y-auto max-h-80">
                   {aiReport ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert text-slate-800 dark:text-slate-300">
                         {String(aiReport).split('\n').map((line, i) => (
                            <p key={i} className={`
                               ${line.startsWith('##') ? 'text-lg font-bold text-slate-800 dark:text-white mt-4 mb-2' : 'text-slate-700 dark:text-slate-300 mb-2'}
                               ${line.includes('Recommendations') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}
                            `}>
                               {line.replace(/#/g, '').replace(/\*\*/g, '')}
                            </p>
                         ))}
                      </div>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                         <FileText size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
                         <p className="text-center font-medium">Generate a report to see <br/> executive safety summaries.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Trainer Leaderboard */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 flex flex-col h-full">
             <div className="flex items-center gap-2 mb-6">
                <Award className="text-yellow-500" size={24} />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Trainer Leaderboard</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {trainerStats.map((trainer, idx) => (
                   <div key={trainer.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                      <div className={`
                         w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0
                         ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-orange-400' : 'bg-slate-200 text-slate-500'}
                      `}>
                         {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between mb-1">
                            <span className="text-sm font-bold text-slate-800 dark:text-white truncate">{trainer.name}</span>
                            <span className="text-xs font-mono text-slate-500">{trainer.passRate}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div 
                               className={`h-full rounded-full ${Number(trainer.passRate) >= 90 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                               style={{ width: `${trainer.passRate}%` }}
                            />
                         </div>
                         <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                            <span>{trainer.students} Students</span>
                            <span>Avg Theory: {trainer.avgTheory}</span>
                         </div>
                      </div>
                   </div>
                ))}
                {trainerStats.length === 0 && <p className="text-center text-gray-400 text-sm py-10">No data available</p>}
             </div>
          </div>
       </div>

       {/* --- No Shows Alert Zone --- */}
       {noShowList.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/50">
             <div className="flex items-center gap-3 mb-4 text-red-700 dark:text-red-400">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold">Recorded Absences (No-Shows)</h3>
                <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100 text-xs px-2 py-0.5 rounded-full font-bold">
                   {noShowList.length}
                </span>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-red-200 dark:border-red-800 text-xs font-bold text-red-500 dark:text-red-300 uppercase tracking-wider">
                         <th className="pb-2 pl-2">ID</th>
                         <th className="pb-2">Name</th>
                         <th className="pb-2">Company</th>
                         <th className="pb-2">RAC</th>
                         <th className="pb-2">Date</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm">
                      {noShowList.map((item, i) => (
                         <tr key={i} className="hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors">
                            <td className="py-2 pl-2 font-mono text-red-900 dark:text-red-200">{item.id}</td>
                            <td className="py-2 font-bold text-red-900 dark:text-red-200">{item.name}</td>
                            <td className="py-2 text-red-800 dark:text-red-300">{item.company}</td>
                            <td className="py-2 text-red-800 dark:text-red-300">{item.rac}</td>
                            <td className="py-2 text-red-800 dark:text-red-300">{item.date}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       )}

    </div>
  );
};

// --- Sub-Components ---

const StatCard = ({ title, value, icon: Icon, gradient, subtext }: any) => (
   <div className="bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow group">
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl h-full flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <div>
               <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:scale-105 transition-transform origin-left">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transform group-hover:rotate-12 transition-transform`}>
               <Icon size={24} />
            </div>
         </div>
         <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-4 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" /> {subtext}
         </p>
      </div>
   </div>
);

export default ReportsPage;