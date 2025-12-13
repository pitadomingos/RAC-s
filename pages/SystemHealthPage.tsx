
import React, { useState, useEffect } from 'react';
import { 
  Activity, Server, Database, CloudLightning, ShieldCheck, 
  AlertTriangle, Clock, HardDrive, Cpu, Zap, Wifi
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

const SystemHealthPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock Data Generators
  const [metrics, setMetrics] = useState({
      uptime: 99.98,
      latency: 45,
      errors: 0.02,
      activeUsers: 12
  });

  const [loadData, setLoadData] = useState<any[]>([]);
  const [errorLog, setErrorLog] = useState<any[]>([]);

  // Simulation Effect
  useEffect(() => {
      // Initial Data
      const initialData = Array.from({ length: 20 }, (_, i) => ({
          time: i,
          cpu: 20 + Math.random() * 15,
          memory: 40 + Math.random() * 10
      }));
      setLoadData(initialData);

      const initialErrors = [
          { id: 1, time: '10:42:05', type: 'WARN', msg: 'API Rate Limit Approaching (Gemini)' },
          { id: 2, time: '09:15:00', type: 'INFO', msg: 'Database Backup Completed' }
      ];
      setErrorLog(initialErrors);

      const interval = setInterval(() => {
          // Update Scalar Metrics
          setMetrics(prev => ({
              uptime: 99.98,
              latency: Math.floor(40 + Math.random() * 20), // 40-60ms
              errors: Number((Math.random() * 0.05).toFixed(3)),
              activeUsers: Math.floor(10 + Math.random() * 5)
          }));

          // Update Chart Data
          setLoadData(prev => {
              const newData = [...prev.slice(1)];
              newData.push({
                  time: prev[prev.length - 1].time + 1,
                  cpu: 20 + Math.random() * 30, // Spike occasionally
                  memory: 40 + Math.random() * 5
              });
              return newData;
          });

          // Randomly add warning
          if (Math.random() > 0.9) {
              const newLog = {
                  id: Date.now(),
                  time: new Date().toLocaleTimeString(),
                  type: 'WARN',
                  msg: 'High latency detected in us-east-1'
              };
              setErrorLog(prev => [newLog, ...prev].slice(0, 5));
          }

      }, 2000);

      return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Online': return 'text-green-500 bg-green-500/10 border-green-500/20';
          case 'Degraded': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
          case 'Offline': return 'text-red-500 bg-red-500/10 border-red-500/20';
          default: return 'text-slate-500';
      }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Activity size={300} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Activity size={32} className="text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">{t.systemHealth.title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="text-sm text-cyan-200/80 font-mono">{t.systemHealth.subtitle}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
                label={t.systemHealth.uptime} 
                value={`${metrics.uptime}%`} 
                icon={Clock} 
                color="green" 
                subtext="Last 30 Days"
            />
            <KpiCard 
                label={t.systemHealth.latency} 
                value={`${metrics.latency}ms`} 
                icon={Zap} 
                color={metrics.latency > 100 ? "yellow" : "cyan"}
                subtext="Global Avg" 
            />
            <KpiCard 
                label={t.systemHealth.errors} 
                value={`${metrics.errors}%`} 
                icon={AlertTriangle} 
                color={metrics.errors > 1 ? "red" : "blue"}
                subtext="HTTP 5xx Rate" 
            />
            <KpiCard 
                label="Active Sessions" 
                value={String(metrics.activeUsers)} 
                icon={Wifi} 
                color="purple" 
                subtext="Concurrent Users"
            />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Service Status */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Server size={16} /> {t.systemHealth.services}
                </h3>
                
                <div className="space-y-4">
                    <ServiceRow name={t.systemHealth.database} status="Online" icon={Database} />
                    <ServiceRow name={t.systemHealth.auth} status="Online" icon={ShieldCheck} />
                    <ServiceRow name={t.systemHealth.ai} status="Online" icon={CloudLightning} />
                    <ServiceRow name={t.systemHealth.storage} status="Online" icon={HardDrive} />
                </div>
            </div>

            {/* Live Load Chart */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <Cpu size={16} /> Server Load Telemetry
                    </h3>
                    <div className="flex gap-4 text-[10px] font-mono">
                        <span className="flex items-center gap-1 text-cyan-300"><div className="w-2 h-2 bg-cyan-500 rounded-full"></div> CPU</span>
                        <span className="flex items-center gap-1 text-purple-300"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> MEM</span>
                    </div>
                </div>

                <div className="h-64 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={loadData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ fontSize: '12px' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="cpu" 
                                stroke="#06b6d4" 
                                strokeWidth={2} 
                                dot={false} 
                                activeDot={{ r: 4, fill: '#fff' }}
                                animationDuration={500}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="memory" 
                                stroke="#a855f7" 
                                strokeWidth={2} 
                                dot={false} 
                                animationDuration={500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            </div>
        </div>

        {/* Error Feed */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle size={16} /> {t.systemHealth.recentAlerts}
            </h3>
            
            <div className="space-y-2">
                {errorLog.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${log.type === 'ERROR' ? 'bg-red-500/10 text-red-500 border-red-500/20' : log.type === 'WARN' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                {log.type}
                            </span>
                            <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{log.msg}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{log.time}</span>
                    </div>
                ))}
                {errorLog.length === 0 && <div className="text-slate-400 text-sm text-center py-4">System Healthy. No alerts.</div>}
            </div>
        </div>

    </div>
  );
};

// --- Sub-Components ---

const KpiCard = ({ label, value, icon: Icon, color, subtext }: any) => {
    const colorStyles = {
        green: 'text-green-500 bg-green-500/10',
        cyan: 'text-cyan-500 bg-cyan-500/10',
        red: 'text-red-500 bg-red-500/10',
        yellow: 'text-yellow-500 bg-yellow-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
        blue: 'text-blue-500 bg-blue-500/10'
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">{value}</h2>
                <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorStyles[color as keyof typeof colorStyles]} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
        </div>
    );
};

const ServiceRow = ({ name, status, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 shadow-sm">
                <Icon size={18} />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{name}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></span>
            <span className={`text-xs font-bold ${status === 'Online' ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>{status}</span>
        </div>
    </div>
);

export default SystemHealthPage;
