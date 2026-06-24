import React, { useMemo } from 'react';
import { UnsafeCondition, Company } from '../../types';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line 
} from 'recharts';
import { Activity, CheckCircle, AlertOctagon, Clock, MapPin, List, ArrowLeft, TrendingUp, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  conditions: UnsafeCondition[];
  companies: Company[];
}

export default function AnalyticsDashboard({ conditions }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Calculate KPI metrics
  const total = conditions.length;
  const resolved = conditions.filter(c => c.state === 'Resolvido').length;
  const pending = total - resolved;
  const delayed = conditions.filter(c => c.mapStatus === 'Atrasado').length;

  // Pie chart: Situação dos RECs
  const pieData = [
    { name: t.safesite.dashboard.resolved, value: resolved, color: '#10b981', bgClass: 'bg-[#10b981]' },
    { name: t.safesite.dashboard.pending, value: pending, color: '#f59e0b', bgClass: 'bg-[#f59e0b]' },
    { name: t.safesite.dashboard.delayed, value: delayed, color: '#ef4444', bgClass: 'bg-[#ef4444]' }
  ];

  // Bar chart: Distribuição por Estado (Workflow State)
  const stateData = useMemo(() => {
    const counts: Record<string, number> = {
      'Criado': 0,
      'Em Correção': 0,
      'Submetido ao Gerente': 0,
      'Análise SSMA': 0,
      'Resolvido': 0
    };
    conditions.forEach(c => {
      if (counts[c.state] !== undefined) counts[c.state]++;
    });
    return [
      { name: t.safesite.workflow.created, value: counts['Criado'] },
      { name: t.safesite.workflow.inCorrection, value: counts['Em Correção'] },
      { name: t.safesite.workflow.submittedManager, value: counts['Submetido ao Gerente'] },
      { name: t.safesite.workflow.hseAnalysis, value: counts['Análise SSMA'] },
      { name: t.safesite.workflow.resolved, value: counts['Resolvido'] }
    ];
  }, [conditions, t]);

  // Line chart: Evolução Mensal (mocked trend data based on creation dates)
  const trendData = useMemo(() => {
    const counts: Record<string, number> = {};
    conditions.forEach(c => {
      const date = new Date(c.createdAt).toLocaleDateString('default', { month: 'short', day: 'numeric' });
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).map(([date, count]) => ({
      date,
      count
    }));
  }, [conditions]);

  const MetricCard = ({ title, value, icon: Icon, colorClass, gradientClass }: any) => (
    <div className={`relative overflow-hidden rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl group transition-all duration-300 hover:-translate-y-1 ${gradientClass}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
        <Icon size={120} className={colorClass.split(' ')[1]} />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-20 backdrop-blur-md border border-white/20`}>
            <Icon size={24} className={colorClass.split(' ')[1]} />
          </div>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-sm font-black uppercase tracking-widest mb-1">{title}</div>
        <div className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto p-4 md:p-8 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t.safesite.dashboard.title}</h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">{t.safesite.dashboard.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} />
            {t.safesite.nav.backToGateway}
          </button>
          <button 
            onClick={() => navigate('/safemap/global')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <MapPin size={18} />
            {t.safesite.nav.globalMap}
          </button>
          <button 
            onClick={() => navigate('/safemap/report')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <List size={18} />
            {t.safesite.nav.reportingTable}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title={t.safesite.dashboard.totalReported} value={total} icon={Activity} colorClass="bg-indigo-100 text-indigo-600" gradientClass="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-800" />
        <MetricCard title={t.safesite.dashboard.resolved} value={resolved} icon={CheckCircle} colorClass="bg-emerald-100 text-emerald-600" gradientClass="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-800" />
        <MetricCard title={t.safesite.dashboard.pending} value={pending} icon={Clock} colorClass="bg-amber-100 text-amber-600" gradientClass="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-800" />
        <MetricCard title={t.safesite.dashboard.delayed} value={delayed} icon={AlertOctagon} colorClass="bg-rose-100 text-rose-600" gradientClass="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 bg-white dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{t.safesite.dashboard.situationChart}</h3>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl"><PieChartIcon size={18} className="text-slate-500" /></div>
          </div>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px 20px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{total}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${d.bgClass} shadow-sm shadow-${d.color}/50`}></div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{d.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-8">
            <div className="flex-1 bg-white dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{t.safesite.dashboard.stateChart}</h3>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><BarChartIcon size={18} className="text-indigo-500" /></div>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#64748b'}} />
                    <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px 20px', fontWeight: 'bold'}} />
                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-8 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 transform group-hover:scale-150"><TrendingUp size={200} className="text-white" /></div>
            <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white">{t.safesite.dashboard.trendChart}</h3>
            </div>
            <div className="h-48 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.1} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{borderRadius: '16px', backgroundColor: '#1e293b', border: '1px solid #334155', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', padding: '12px 20px', color: '#f8fafc', fontWeight: 'bold'}} itemStyle={{ color: '#38bdf8' }} />
                    <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={4} dot={{r: 5, strokeWidth: 2, fill: '#0f172a'}} activeDot={{r: 8, fill: '#38bdf8', stroke: '#fff', strokeWidth: 3}} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>
      </div>
      
    </div>
  );
}
