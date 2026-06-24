import React, { useMemo } from 'react';
import { UnsafeCondition, Company } from '../../types';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line 
} from 'recharts';
import { Activity, CheckCircle, AlertOctagon, Clock, MapPin, List, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  conditions: UnsafeCondition[];
  companies: Company[];
}

export default function AnalyticsDashboard({ conditions }: Props) {
  const navigate = useNavigate();
  
  // Calculate KPI metrics
  const total = conditions.length;
  const resolved = conditions.filter(c => c.state === 'Resolvido').length;
  const pending = total - resolved;
  const delayed = conditions.filter(c => c.mapStatus === 'Atrasado').length;

  // Pie chart: Situação dos RECs
  const pieData = [
    { name: 'Resolvido', value: resolved, color: '#22c55e', bgClass: 'bg-[#22c55e]' },
    { name: 'Pendente', value: pending, color: '#eab308', bgClass: 'bg-[#eab308]' },
    { name: 'Atrasado', value: delayed, color: '#ef4444', bgClass: 'bg-[#ef4444]' }
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
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [conditions]);

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

  const MetricCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</div>
        <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto p-6 space-y-6">
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">SafeSite Dashboard</h1>
          <p className="text-slate-500 mt-2">Comprehensive decisive overview of unsafe conditions and resolution metrics.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all"
          >
            <ArrowLeft size={18} />
            Back to Gateway
          </button>
          <button 
            onClick={() => navigate('/safemap/global')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl font-bold transition-all"
          >
            <MapPin size={18} />
            Global Map
          </button>
          <button 
            onClick={() => navigate('/safemap/report')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl font-bold transition-all"
          >
            <List size={18} />
            Reporting Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <MetricCard title="Total Reported" value={total} icon={Activity} color="bg-blue-100 text-blue-600" />
        <MetricCard title="Resolved" value={resolved} icon={CheckCircle} color="bg-green-100 text-green-600" />
        <MetricCard title="Pending" value={pending} icon={Clock} color="bg-yellow-100 text-yellow-600" />
        <MetricCard title="Delayed (SLA Breach)" value={delayed} icon={AlertOctagon} color="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Situação dos RECs</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${d.bgClass}`}></div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Distribuição por Estado</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Evolução de Relatos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
}
