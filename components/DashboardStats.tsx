
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Booking, BookingStatus, EmployeeRequirement } from '../types';
import { MOCK_SESSIONS, RAC_KEYS } from '../constants';
import { AlertTriangle, Users, CheckCircle, Clock, Activity, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardStatsProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  onBookRenewals?: () => void;
}

// Fixed colors by index: 0 = Compliant (Green), 1 = Non-Compliant (Red)
const PIE_COLORS = ['#059669', '#ef4444'];

const DashboardStats: React.FC<DashboardStatsProps> = ({ bookings, requirements, onBookRenewals }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // 1. Basic Counts
  const passed = bookings.filter(b => b.status === BookingStatus.PASSED).length;
  const pending = bookings.filter(b => b.status === BookingStatus.PENDING).length;
  
  // Expiring Logic
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiring = bookings.filter(b => {
    if (!b.expiryDate) return false;
    const expDate = new Date(b.expiryDate);
    return expDate > today && expDate <= thirtyDaysFromNow;
  });

  // 2. Compliance Logic (Requirements vs Actuals)
  
  // Get Unique Employees from Bookings or Requirements
  const uniqueEmployeeIds = Array.from(new Set([
    ...bookings.map(b => b.employee.id),
    ...requirements.map(r => r.employeeId)
  ]));

  let compliantCount = 0;
  let nonCompliantCount = 0;
  
  // ASO Stats (Medical)
  let asoCompliant = 0;
  let asoMissing = 0;
  
  // Store data for Stacked Bar Chart (By RAC)
  // Format: { 'RAC01': { required: 10, compliant: 8 }, ... }
  const racComplianceStats: Record<string, { required: number, compliant: number, missing: number }> = {};
  RAC_KEYS.forEach(k => racComplianceStats[k] = { required: 0, compliant: 0, missing: 0 });

  uniqueEmployeeIds.forEach(empId => {
    // Get Req
    const req = requirements.find(r => r.employeeId === empId) || { 
      employeeId: empId, asoExpiryDate: '', requiredRacs: {} 
    };

    // Check ASO
    const isAsoValid = req.asoExpiryDate && req.asoExpiryDate > todayStr;
    if (isAsoValid) {
        asoCompliant++;
    } else {
        asoMissing++;
    }
    
    // Check RACs
    let allRacsMet = true;
    
    RAC_KEYS.forEach(racKey => {
       const isRequired = req.requiredRacs[racKey];
       if (isRequired) {
         racComplianceStats[racKey].required++;
         
         // Check if they have a passed booking
         const hasTraining = bookings.some(b => {
             if (b.employee.id !== empId) return false;
             if (b.status !== BookingStatus.PASSED) return false;
             if (!b.expiryDate || b.expiryDate <= todayStr) return false;
             
             // Resolve Session Name to RAC Key
             const session = MOCK_SESSIONS.find(s => s.id === b.sessionId);
             const sessionName = session ? session.racType : b.sessionId;
             const bookingRacKey = sessionName.split(' - ')[0].replace(' ', ''); // "RAC 01" -> "RAC01"
             
             return bookingRacKey === racKey;
         });

         if (hasTraining) {
            racComplianceStats[racKey].compliant++;
         } else {
            racComplianceStats[racKey].missing++;
            allRacsMet = false;
         }
       }
    });

    if (isAsoValid && allRacsMet) {
      compliantCount++;
    } else {
      nonCompliantCount++;
    }
  });

  // Data for Pie Chart - Using translated names
  const complianceData = [
    { name: t.dashboard.charts.compliant, value: compliantCount },
    { name: t.dashboard.charts.nonCompliant, value: nonCompliantCount }
  ];

  // Data for Stacked Bar Chart - Now includes ASO
  const racStackData = [
    {
        name: 'ASO',
        Compliant: asoCompliant,
        Missing: asoMissing
    },
    ...RAC_KEYS.map(key => ({
        name: key,
        Compliant: racComplianceStats[key].compliant,
        Missing: racComplianceStats[key].missing
    }))
  ];

  // Adherence %
  const totalEmployees = uniqueEmployeeIds.length;
  const adherencePercentage = totalEmployees > 0 
    ? ((compliantCount / totalEmployees) * 100).toFixed(1) 
    : '0.0';

  const handleRenewalClick = () => {
    if (onBookRenewals) {
      onBookRenewals();
    } else {
      navigate('/booking');
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Adherence Card (Most Important) */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 lg:col-span-1 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.dashboard.kpi.adherence}</p>
              <div className="flex items-baseline gap-1">
                 <p className={`text-2xl font-bold ${Number(adherencePercentage) > 85 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                   {String(adherencePercentage)}%
                 </p>
                 <span className="text-[10px] text-gray-400">Access Granted</span>
              </div>
            </div>
            <div className={`p-2 rounded-full ${Number(adherencePercentage) > 85 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
              <ShieldAlert size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.dashboard.kpi.certifications}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{String(passed)}</p>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.dashboard.kpi.pending}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{String(pending)}</p>
            </div>
            <div className="p-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.dashboard.kpi.expiring}</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{String(expiring.length)}</p>
            </div>
            <div className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.dashboard.kpi.scheduled}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{String(MOCK_SESSIONS.length)}</p>
            </div>
            <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
              <Activity size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Stacked Training vs Requirements */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.dashboard.charts.complianceTitle}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={racStackData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis dataKey="name" fontSize={10} interval={0} stroke="currentColor" className="text-gray-500 dark:text-gray-400" />
                <YAxis stroke="currentColor" className="text-gray-500 dark:text-gray-400" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="Compliant" stackId="a" fill="#059669" name={t.dashboard.charts.compliant} />
                <Bar dataKey="Missing" stackId="a" fill="#ef4444" name={t.dashboard.charts.missing} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            {t.dashboard.charts.complianceSubtitle}
          </p>
        </div>

        {/* Chart 2: Total Compliance Status */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.dashboard.charts.accessTitle}</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  stroke="none"
                >
                  {complianceData.map((entry, index) => (
                    // Use index for consistent coloring: 0=Green, 1=Red
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            <p>"{t.dashboard.charts.compliant}" = Valid ASO + All Required RACs passed.</p>
            <p>"{t.dashboard.charts.nonCompliant}" = Expired ASO or Missing Required RACs.</p>
          </div>
        </div>
      </div>

      {/* Expiring Notification - Below Charts */}
      {expiring.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg flex flex-col md:flex-row justify-between items-start md:items-center animate-fade-in-down">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400">{t.dashboard.renewal.title}</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {String(expiring.length)} {t.dashboard.renewal.message}
            </p>
          </div>
          <button 
            onClick={handleRenewalClick}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition shadow-sm text-sm font-medium"
          >
            {t.dashboard.renewal.button}
          </button>
        </div>
      )}

    </div>
  );
};

export default DashboardStats;
