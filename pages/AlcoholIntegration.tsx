
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Wine, Activity, Wifi, Lock, UserX, AlertTriangle, 
  Server, Mail, Smartphone,
  CheckCircle2, XCircle, TrendingUp,
  Map as MapIcon, FileText, ArrowRight, FileCode
} from 'lucide-react';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer
} from 'recharts';
import { BreathalyzerTest, SystemNotification } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

interface AlcoholIntegrationProps {
    addNotification?: (notif: SystemNotification) => void;
}

const AlcoholIntegration: React.FC<AlcoholIntegrationProps> = ({ addNotification }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [viewLocalSpecs, setViewLocalSpecs] = useState(false);
  
  // --- STATE FOR SIMULATION ---
  const [tests, setTests] = useState<BreathalyzerTest[]>([]);
  const [devices, setDevices] = useState([
      { id: 'GT-01', name: 'Main Gate Turnstile A', status: 'Online', location: 'Gate 1' },
      { id: 'GT-02', name: 'Main Gate Turnstile B', status: 'Online', location: 'Gate 1' },
      { id: 'GT-03', name: 'Contractor Gate C', status: 'Online', location: 'Gate 2' },
      { id: 'WS-01', name: 'Workshop Entrance', status: 'Online', location: 'Workshop' },
  ]);
  const [activeAlert, setActiveAlert] = useState<BreathalyzerTest | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  // --- MOCK DATA GENERATOR ---
  const generateMockTest = () => {
      const names = ['Paulo Manjate', 'Jose Cossa', 'Maria Silva', 'Antonio Sitoe', 'Sarah Connor', 'John Doe', 'Luis Tete'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      
      // 5% chance of positive test
      const isPositive = Math.random() < 0.05;
      const bac = isPositive ? (Math.random() * 0.15).toFixed(3) : '0.000';
      const now = new Date();

      return {
          id: uuidv4(),
          deviceId: randomDevice.id,
          employeeId: `VUL-${Math.floor(Math.random() * 9000) + 1000}`,
          employeeName: randomName,
          date: now.toISOString().split('T')[0],
          timestamp: now.toLocaleTimeString(),
          result: parseFloat(bac),
          status: isPositive ? 'FAIL' : 'PASS',
      } as BreathalyzerTest;
  };

  // --- SIMULATION LOOP ---
  useEffect(() => {
      if (viewLocalSpecs) return; // Pause simulation if viewing specs

      const interval = setInterval(() => {
          const newTest = generateMockTest();
          setTests(prev => [newTest, ...prev].slice(0, 50)); // Keep last 50

          // Trigger Alert if Positive
          if (newTest.status === 'FAIL') {
              setActiveAlert(newTest);
              // Trigger automated reporting logic
              handleAutomaticReporting(newTest);
          }
      }, 3500); // New test every 3.5 seconds

      return () => clearInterval(interval);
  }, [viewLocalSpecs]);

  const handleAutomaticReporting = (test: BreathalyzerTest) => {
      setIsReporting(true);
      
      // Simulate API Delay for sending emails/SMS
      setTimeout(() => {
          setIsReporting(false);
          if (addNotification) {
              addNotification({
                  id: uuidv4(),
                  type: 'alert',
                  title: t.alcohol.dashboard.alert.title,
                  message: `Access denied for ${test.employeeName}. Supervisor notified via SMS/Email.`,
                  timestamp: new Date(),
                  isRead: false
              });
          }
      }, 3000);
  };

  // --- METRICS ---
  const stats = {
      totalToday: 1240 + tests.length,
      positives: tests.filter(t => t.status === 'FAIL').length,
      avgTime: '1.2s',
      onlineDevices: 4
  };

  const chartData = [
      { time: '06:00', tests: 45, fails: 0 },
      { time: '07:00', tests: 120, fails: 1 },
      { time: '08:00', tests: 350, fails: 2 },
      { time: '09:00', tests: 180, fails: 0 },
      { time: '10:00', tests: 60, fails: 0 },
      { time: '11:00', tests: 40, fails: 0 },
      { time: '12:00', tests: 90, fails: 1 },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full">
      
      {/* --- COMMAND CENTER HEADER --- */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <Activity size={300} />
          </div>
          
          {/* Animated Pulse for Live Status (Only if Dashboard Mode) */}
          <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
              {!viewLocalSpecs && (
                  <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/50 animate-pulse">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-red-200">{t.alcohol.dashboard.live}</span>
                  </div>
              )}
              
              <div className="flex gap-2">
                  <button 
                    onClick={() => setViewLocalSpecs(!viewLocalSpecs)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                  >
                      {viewLocalSpecs ? <Activity size={14} /> : <FileCode size={14} />}
                      {viewLocalSpecs ? t.alcohol.dashboard.backToLive : "Technical Specs"}
                  </button>
                  <button 
                    onClick={() => navigate('/proposal')}
                    className="flex items-center gap-2 text-xs font-bold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/30"
                  >
                      <FileText size={14} /> {t.alcohol.dashboard.viewRoadmap}
                  </button>
              </div>
          </div>

          <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 backdrop-blur-md">
                      <Wine size={32} className="text-indigo-400" />
                  </div>
                  <div>
                      <h1 className="text-3xl font-black tracking-tight">{t.alcohol.dashboard.title}</h1>
                      <p className="text-slate-400">{t.alcohol.dashboard.subtitle}</p>
                  </div>
              </div>

              {!viewLocalSpecs && (
                  /* KPI ROW */
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t.alcohol.dashboard.kpi.total}</p>
                          <div className="text-3xl font-black text-white">{stats.totalToday}</div>
                      </div>
                      <div className="bg-red-900/20 p-4 rounded-2xl border border-red-900/50">
                          <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">{t.alcohol.dashboard.kpi.violations}</p>
                          <div className="text-3xl font-black text-red-500">{stats.positives}</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t.alcohol.dashboard.kpi.throughput}</p>
                          <div className="text-3xl font-black text-blue-400">{stats.avgTime} <span className="text-sm text-slate-500 font-normal">/ {t.alcohol.dashboard.person}</span></div>
                      </div>
                      <div className="bg-emerald-900/20 p-4 rounded-2xl border border-emerald-900/50">
                          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">{t.alcohol.dashboard.kpi.health}</p>
                          <div className="text-3xl font-black text-emerald-500">100% <span className="text-sm text-emerald-400/60 font-normal">{t.alcohol.dashboard.online}</span></div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {viewLocalSpecs ? (
          /* --- TECHNICAL SPECS VIEW --- */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Lock className="text-blue-500" size={24}/> {t.alcohol.protocol.title}
                  </h3>
                  <div className="space-y-6">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-l-4 border-blue-500">
                          <h4 className="font-bold text-slate-800 dark:text-white">{t.alcohol.protocol.positiveTitle}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.alcohol.protocol.positiveDesc}</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-l-4 border-green-500">
                          <h4 className="font-bold text-slate-800 dark:text-white">{t.alcohol.protocol.resetTitle}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.alcohol.protocol.resetDesc}</p>
                      </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <MapIcon className="text-purple-500" size={24}/> {t.alcohol.features.title}
                  </h3>
                  <ul className="space-y-4">
                      <li className="flex gap-4 items-start">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600"><Wifi size={18}/></div>
                          <div>
                              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t.alcohol.features.iotTitle}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{t.alcohol.features.iotDesc}</p>
                          </div>
                      </li>
                      <li className="flex gap-4 items-start">
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600"><Lock size={18}/></div>
                          <div>
                              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t.alcohol.features.accessTitle}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{t.alcohol.features.accessDesc}</p>
                          </div>
                      </li>
                      <li className="flex gap-4 items-start">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600"><FileText size={18}/></div>
                          <div>
                              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t.alcohol.features.complianceTitle}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{t.alcohol.features.complianceDesc}</p>
                          </div>
                      </li>
                  </ul>
              </div>

              <div className="md:col-span-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border border-slate-300 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.alcohol.proposal.header}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                          <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">{t.alcohol.proposal.hardware}</h5>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{t.alcohol.challenges.gateSetup}</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                          <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">{t.alcohol.proposal.software}</h5>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{t.alcohol.proposal.integration}</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                          <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">{t.alcohol.proposal.security}</h5>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{t.alcohol.proposal.faceCap}</p>
                      </div>
                  </div>
              </div>
          </div>
      ) : (
          /* --- LIVE DASHBOARD VIEW --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              
              {/* --- LEFT COL: LIVE FEED --- */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-[500px]">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Wifi size={20} className="text-blue-500" /> {t.alcohol.dashboard.log}
                      </h3>
                      <div className="flex gap-2">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded">{t.alcohol.dashboard.mqtt}</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-auto p-0">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 uppercase font-bold sticky top-0 z-10">
                              <tr>
                                  <th className="px-6 py-3">{t.common.date}</th>
                                  <th className="px-6 py-3">{t.common.time}</th>
                                  <th className="px-6 py-3">{t.alcohol.dashboard.table.device}</th>
                                  <th className="px-6 py-3">{t.results.table.employee}</th>
                                  <th className="px-6 py-3">{t.alcohol.dashboard.table.result}</th>
                                  <th className="px-6 py-3">{t.common.status}</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                              {tests.map((test) => (
                                  <tr key={test.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${test.status === 'FAIL' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                                      <td className="px-6 py-3 font-mono text-slate-600 dark:text-slate-400">{test.date}</td>
                                      <td className="px-6 py-3 font-mono text-slate-600 dark:text-slate-400">{test.timestamp}</td>
                                      <td className="px-6 py-3 text-slate-800 dark:text-white font-medium">{test.deviceId}</td>
                                      <td className="px-6 py-3">
                                          <div className="font-bold text-slate-800 dark:text-white">{test.employeeName}</div>
                                          <div className="text-[10px] text-slate-500">{test.employeeId}</div>
                                      </td>
                                      <td className="px-6 py-3">
                                          <span className={`font-mono font-bold ${test.result > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                                              {test.result.toFixed(3)}%
                                          </span>
                                      </td>
                                      <td className="px-6 py-3">
                                          {test.status === 'PASS' ? (
                                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                                  <CheckCircle2 size={12} /> {t.alcohol.dashboard.table.ok}
                                              </span>
                                          ) : (
                                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold animate-pulse">
                                                  <XCircle size={12} /> {t.alcohol.dashboard.table.blocked}
                                              </span>
                                          )}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* --- RIGHT COL: ANALYTICS --- */}
              <div className="space-y-6">
                  {/* Chart */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
                      <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <TrendingUp size={20} className="text-indigo-500" /> {t.alcohol.dashboard.throughputChart}
                      </h3>
                      <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData}>
                                  <defs>
                                      <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <Tooltip 
                                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                  />
                                  <Area type="monotone" dataKey="tests" stroke="#6366f1" fillOpacity={1} fill="url(#colorTests)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Device Status */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
                      <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <Server size={20} className="text-emerald-500" /> {t.alcohol.dashboard.deviceStatus}
                      </h3>
                      <div className="space-y-3">
                          {devices.map(d => (
                              <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                      <div>
                                          <div className="font-bold text-xs text-slate-800 dark:text-white">{d.name}</div>
                                          <div className="text-[10px] text-slate-500">{d.location} • {d.id}</div>
                                      </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">{t.alcohol.dashboard.online}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- ALERT MODAL (SIMULATED) --- */}
      {activeAlert && (
          <div className="fixed inset-0 z-50 bg-red-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-2 border-red-500 relative">
                  
                  {/* Header */}
                  <div className="bg-red-600 p-6 flex justify-between items-center text-white">
                      <div className="flex items-center gap-3">
                          <AlertTriangle size={32} className="animate-bounce" />
                          <div>
                              <h2 className="text-xl font-black uppercase tracking-wider">{t.alcohol.dashboard.alert.title}</h2>
                              <p className="text-xs text-red-100">{t.alcohol.dashboard.alert.desc}</p>
                          </div>
                      </div>
                      <button onClick={() => setActiveAlert(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><XCircle size={24} /></button>
                  </div>

                  <div className="p-8">
                      <div className="flex gap-6 mb-8">
                          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 shadow-inner border border-slate-300 dark:border-slate-600">
                              <UserX size={48} />
                          </div>
                          <div>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{activeAlert.employeeName}</h3>
                              <p className="text-sm font-mono text-slate-500 mb-4">{activeAlert.employeeId}</p>
                              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800">
                                  <span className="text-xs font-bold uppercase">{t.alcohol.dashboard.alert.measured}</span>
                                  <span className="text-lg font-black">{activeAlert.result.toFixed(3)}%</span>
                              </div>
                          </div>
                      </div>

                      {/* Automated Actions Log */}
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">{t.alcohol.dashboard.actions}</h4>
                          
                          <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full"><Lock size={14}/></div>
                              <span dangerouslySetInnerHTML={{ __html: t.alcohol.dashboard.actionLog.locked.replace('Locked', '<strong>Locked</strong>').replace('Bloqueada', '<strong>Bloqueada</strong>') }}></span>
                          </div>

                          <div className={`flex items-center gap-3 text-sm transition-all duration-500 ${isReporting ? 'opacity-50' : 'opacity-100 text-slate-700 dark:text-slate-300'}`}>
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                                  {isReporting ? <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <Mail size={14}/>}
                              </div>
                              <span>
                                  {isReporting ? t.alcohol.dashboard.actionLog.generating : t.alcohol.dashboard.actionLog.logged}
                              </span>
                          </div>

                          <div className={`flex items-center gap-3 text-sm transition-all duration-500 delay-150 ${isReporting ? 'opacity-30' : 'opacity-100 text-slate-700 dark:text-slate-300'}`}>
                              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full"><Smartphone size={14}/></div>
                              <span>
                                  {isReporting ? t.alcohol.dashboard.actionLog.contacting : <strong>{t.alcohol.dashboard.actionLog.sent}</strong>}
                              </span>
                          </div>
                      </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                      <button 
                        onClick={() => setActiveAlert(null)}
                        className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                          {t.alcohol.dashboard.close}
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AlcoholIntegration;
