
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus } from '../types';
import { MOCK_SESSIONS, DEPARTMENTS, RAC_KEYS } from '../constants';
import { generateSafetyReport } from '../services/geminiService';
import { FileText, Calendar, Sparkles, BarChart3, Printer, UserX, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ReportsPageProps {
  bookings: Booking[];
}

type ReportPeriod = 'Weekly' | 'Monthly' | 'YTD' | 'Custom';

const ReportsPage: React.FC<ReportsPageProps> = ({ bookings }) => {
  const [period, setPeriod] = useState<ReportPeriod>('Monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRac, setSelectedRac] = useState('All');
  
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to resolve booking date
  const getBookingDate = (b: Booking) => {
    // If it has a result date, use that
    if (b.resultDate) return b.resultDate;
    // Otherwise try to find session date
    const session = MOCK_SESSIONS.find(s => s.id === b.sessionId);
    return session ? session.date : '';
  };

  // Helper to resolve RAC code
  const getRacCode = (b: Booking) => {
    const session = MOCK_SESSIONS.find(s => s.id === b.sessionId);
    const rawName = session ? session.racType : b.sessionId;
    return rawName.split(' - ')[0].replace(' ', '');
  };

  // 1. Filter Data
  const filteredBookings = useMemo(() => {
    let start = startDate;
    let end = endDate;

    // Auto-set dates if not custom (Simplified logic for demo)
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

    return bookings.filter(b => {
       const bDate = getBookingDate(b);
       if (!bDate) return false;
       
       if (start && bDate < start) return false;
       if (end && bDate > end) return false;

       if (selectedDept !== 'All' && b.employee.department !== selectedDept) return false;
       if (selectedRac !== 'All' && getRacCode(b) !== selectedRac) return false;

       return true;
    });
  }, [bookings, period, startDate, endDate, selectedDept, selectedRac]);

  // 2. Calculate Stats
  const stats = useMemo(() => {
     const total = filteredBookings.length;
     const passed = filteredBookings.filter(b => b.status === BookingStatus.PASSED).length;
     const failed = filteredBookings.filter(b => b.status === BookingStatus.FAILED).length;
     const attended = filteredBookings.filter(b => b.attendance).length;
     
     const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
     const attendanceRate = total > 0 ? ((attended / total) * 100).toFixed(1) : '0.0';

     // Stats by RAC
     const racStats: Record<string, { total: number, passed: number, failed: number }> = {};
     filteredBookings.forEach(b => {
        const code = getRacCode(b);
        if (!racStats[code]) racStats[code] = { total: 0, passed: 0, failed: 0 };
        racStats[code].total++;
        if (b.status === BookingStatus.PASSED) racStats[code].passed++;
        if (b.status === BookingStatus.FAILED) racStats[code].failed++;
     });

     // Top Failing RACs
     const failingRacs = Object.entries(racStats)
        .map(([key, val]) => ({ key, failRate: (val.failed / val.total) * 100 }))
        .sort((a, b) => b.failRate - a.failRate)
        .slice(0, 3);

     // Chart Data
     const chartData = Object.keys(racStats).map(key => ({
        name: key,
        Passed: racStats[key].passed,
        Failed: racStats[key].failed
     }));

     return {
        total, passed, failed, passRate, attendanceRate, racStats, failingRacs, chartData
     };
  }, [filteredBookings]);

  // 3. No Show (Absentee) List
  const noShowList = useMemo(() => {
    return filteredBookings
        .filter(b => !b.attendance)
        .map(b => ({
            id: String(b.employee.recordId || ''),
            name: String(b.employee.name || ''),
            company: String(b.employee.company || ''),
            rac: String(getRacCode(b) || ''),
            date: String(getBookingDate(b) || '')
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredBookings]);

  const handleGenerateReport = async () => {
     setIsGenerating(true);
     // Prepare context for AI
     const context = {
        period,
        startDate,
        endDate,
        department: selectedDept,
        metrics: {
            totalBookings: stats.total,
            passRate: stats.passRate + '%',
            attendanceRate: stats.attendanceRate + '%',
            noShowCount: noShowList.length,
            topFailingRacs: stats.failingRacs.map(r => `${r.key} (${r.failRate.toFixed(1)}% fail rate)`),
            racBreakdown: stats.chartData
        }
     };

     const result = await generateSafetyReport(context, period);
     setAiReport(result);
     setIsGenerating(false);
  };

  return (
    <div className="flex flex-col space-y-6">
       {/* Header & Controls */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 no-print">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h2 className="text-xl font-bold text-slate-800">Safety Reports & Analytics</h2>
                <p className="text-sm text-gray-500">Generate insights using AI based on training data.</p>
             </div>
             <button onClick={() => window.print()} className="flex items-center gap-2 text-gray-600 hover:text-slate-900">
                <Printer size={18} />
                <span className="text-sm font-medium">Print Report</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {/* Period Selector */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Period</label>
                <div className="relative">
                   <select 
                     value={period} 
                     onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
                     className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                   >
                      <option value="Weekly">Last 7 Days</option>
                      <option value="Monthly">Last 30 Days</option>
                      <option value="YTD">Year to Date</option>
                      <option value="Custom">Custom Range</option>
                   </select>
                   <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
             </div>

             {/* Dept Filter */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                <select 
                     value={selectedDept} 
                     onChange={(e) => setSelectedDept(e.target.value)}
                     className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                   >
                      <option value="All">All Departments</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
             </div>

             {/* RAC Filter */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">RAC Type</label>
                <select 
                     value={selectedRac} 
                     onChange={(e) => setSelectedRac(e.target.value)}
                     className="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                   >
                      <option value="All">All RACs</option>
                      {RAC_KEYS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
             </div>
             
             {/* Generate Button */}
             <div className="flex items-end">
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating || stats.total === 0}
                  className={`w-full flex items-center justify-center gap-2 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all
                     ${isGenerating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                     ${stats.total === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isGenerating ? (
                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                     <Sparkles size={18} />
                  )}
                  <span>{isGenerating ? 'Analyzing...' : 'Generate AI Report'}</span>
                </button>
             </div>
          </div>
          {stats.total === 0 && (
             <p className="text-xs text-red-500 mt-2">No data found for the selected criteria.</p>
          )}
       </div>

       {/* Report Content Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Column 1: Stats & Charts */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-6">
             {/* Summary Cards */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-xs text-gray-500 uppercase font-bold">Total Trained</p>
                   <p className="text-2xl font-bold text-slate-800">{String(stats.total)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-xs text-gray-500 uppercase font-bold">Pass Rate</p>
                   <p className={`text-2xl font-bold ${Number(stats.passRate) >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                      {String(stats.passRate)}%
                   </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-xs text-gray-500 uppercase font-bold">Attendance</p>
                   <p className="text-2xl font-bold text-blue-600">{String(stats.attendanceRate)}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-xs text-gray-500 uppercase font-bold">No Shows</p>
                   <p className="text-2xl font-bold text-red-600">{String(noShowList.length)}</p>
                </div>
             </div>

             {/* Chart */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-80">
                <div className="flex items-center gap-2 mb-4">
                   <BarChart3 size={16} className="text-gray-400" />
                   <h3 className="text-sm font-bold text-slate-700">Performance by RAC</h3>
                </div>
                <ResponsiveContainer width="100%" height="90%">
                   <BarChart data={stats.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} interval={0} />
                      <YAxis fontSize={10} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Passed" fill="#059669" stackId="a" />
                      <Bar dataKey="Failed" fill="#ef4444" stackId="a" />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Column 2 & 3: AI Analysis */}
          <div className="lg:col-span-2 xl:col-span-2">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white rounded-t-xl flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <FileText className="text-indigo-600" size={20} />
                      <h3 className="font-bold text-slate-800">Executive Analysis</h3>
                   </div>
                   {!aiReport && <span className="text-xs text-gray-400 italic">Ready to generate</span>}
                </div>
                
                <div className="p-8 flex-1 overflow-auto">
                   {aiReport ? (
                      <div className="prose prose-sm max-w-none text-slate-700">
                         {String(aiReport).split('\n').map((line, i) => (
                            <p key={i} className={`
                               ${line.startsWith('##') ? 'text-lg font-bold text-slate-900 mt-4 mb-2' : ''}
                               ${line.startsWith('-') ? 'ml-4' : ''}
                               ${line.includes('Recommendations') ? 'text-indigo-900' : ''}
                            `}>
                               {line.replace(/#/g, '').replace(/\*\*/g, '')}
                            </p>
                         ))}
                      </div>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                         <Sparkles size={48} className="mb-4" />
                         <p className="text-center">Click "Generate AI Report" to receive <br/>a detailed safety analysis.</p>
                      </div>
                   )}
                </div>
                
                {aiReport && (
                   <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                      Analysis generated by Gemini AI based on {String(stats.total)} records. Verify critical data manually.
                   </div>
                )}
             </div>
          </div>

          {/* Column 4: No Show Table */}
          <div className="lg:col-span-3 xl:col-span-1">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-red-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <UserX className="text-red-600" size={20} />
                        <h3 className="font-bold text-red-900">No Show</h3>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 font-bold">
                        {String(noShowList.length)}
                    </span>
                </div>
                
                <div className="flex-1 overflow-auto">
                    {noShowList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <AlertCircle size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">No absences in this period.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">RAC</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {noShowList.map((item, idx) => (
                                    <tr key={`${item.id}-${idx}`} className="hover:bg-red-50/30">
                                        <td className="px-3 py-2 text-xs text-gray-500 font-mono">{String(item.id)}</td>
                                        <td className="px-3 py-2 text-xs font-bold text-slate-800">{String(item.name)}</td>
                                        <td className="px-3 py-2 text-xs text-gray-600">{String(item.company)}</td>
                                        <td className="px-3 py-2 text-[10px] text-slate-500">{String(item.rac)}</td>
                                        <td className="px-3 py-2 text-[10px] text-gray-400">{String(item.date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

export default ReportsPage;
