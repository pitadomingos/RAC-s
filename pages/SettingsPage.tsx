
import React, { useState } from 'react';
import { Settings, Users, Box, Save, Plus, Trash2, Tag, Edit2, Check, X, AlertCircle, Sliders, MapPin, User as UserIcon, Hash, LayoutGrid, Building2, Map, ShieldCheck, Mail, Lock, Calendar, MessageSquare, Clock, GitMerge, RefreshCw, Terminal, CheckCircle, ChevronLeft, ChevronRight, Activity, Cpu, Zap, Power } from 'lucide-react';
import { RacDef, Room, Trainer, Site, Company, UserRole, User, SystemNotification } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';
import ConfirmModal from '../components/ConfirmModal';
import { RAW_HR_SOURCE, RAW_CONTRACTOR_SOURCE } from '../constants';

interface SettingsPageProps {
    racDefinitions: RacDef[];
    onUpdateRacs: (newDefs: RacDef[]) => void;
    rooms: Room[];
    onUpdateRooms: (newRooms: Room[]) => void;
    trainers: Trainer[];
    onUpdateTrainers: (newTrainers: Trainer[]) => void;
    sites?: Site[];
    onUpdateSites?: (newSites: Site[]) => void;
    companies?: Company[];
    onUpdateCompanies?: (newCompanies: Company[]) => void;
    userRole?: UserRole;
    users?: User[];
    onUpdateUsers?: (newUsers: User[]) => void;
    feedbackConfig?: { mode: string, expiry: string | null };
    onUpdateFeedbackConfig?: (mode: string) => void;
    onSyncDatabases?: () => { added: number, msg: string }; 
    addNotification: (notif: SystemNotification) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    racDefinitions, onUpdateRacs, 
    rooms, onUpdateRooms, 
    trainers, onUpdateTrainers,
    sites = [], onUpdateSites,
    companies = [], onUpdateCompanies,
    userRole = UserRole.SYSTEM_ADMIN,
    users = [], onUpdateUsers,
    feedbackConfig = { mode: 'always', expiry: null },
    onUpdateFeedbackConfig,
    onSyncDatabases,
    addNotification
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'General' | 'Trainers' | 'RACs' | 'Sites' | 'Companies' | 'Integration' | 'Diagnostics'>('General');
  const [isSaving, setIsSaving] = useState(false);
  
  // Integration State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // Self-Healing State
  const [isHealing, setIsHealing] = useState(false);
  const [isHealed, setIsHealed] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);
  const [healingStep, setHealingStep] = useState('Initializing Diagnostics...');
  const [systemHealth, setSystemHealth] = useState(98);
  
  const isSystemAdmin = userRole === UserRole.SYSTEM_ADMIN;
  const isEnterpriseAdmin = userRole === UserRole.ENTERPRISE_ADMIN;
  const canEditGlobalDefinitions = isSystemAdmin || isEnterpriseAdmin;

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false
  });

  const [newSite, setNewSite] = useState({ name: '', location: '' });
  const [newCompany, setNewCompany] = useState({ name: '', adminName: '', adminEmail: '' });
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 0 });
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editRoomData, setEditRoomData] = useState<Partial<Room>>({});
  const [newTrainer, setNewTrainer] = useState<{name: string, racs: string[]}>({ name: '', racs: [] });
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const [editTrainerData, setEditTrainerData] = useState<{name: string, racs: string[]}>({ name: '', racs: [] });
  const [newRac, setNewRac] = useState({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true });
  const [editingRacId, setEditingRacId] = useState<string | null>(null);
  const [editRacData, setEditRacData] = useState<Partial<RacDef>>({});

  const handleAddSite = () => { if (newSite.name && onUpdateSites) { onUpdateSites([...sites, { id: uuidv4(), companyId: 'c1', name: newSite.name, location: newSite.location || 'Unknown' }]); setNewSite({ name: '', location: '' }); } };
  const deleteSite = (id: string) => { if (onUpdateSites) setConfirmState({ isOpen: true, title: t.database.confirmDelete, message: t.database.confirmDeleteMsg, onConfirm: () => onUpdateSites(sites.filter(s => s.id !== id)), isDestructive: true }); };
  const handleAddCompany = () => { if (newCompany.name && onUpdateCompanies) { onUpdateCompanies([...companies, { id: uuidv4(), name: newCompany.name, status: 'Active' }]); setNewCompany({ name: '', adminName: '', adminEmail: '' }); setProvisionSuccess(`Company ${newCompany.name} added.`); } };
  const handleAddRoom = () => { if (newRoom.name) { onUpdateRooms([...rooms, { id: uuidv4(), name: newRoom.name, capacity: newRoom.capacity || 20 }]); setNewRoom({ name: '', capacity: 0 }); } };
  const startEditRoom = (room: Room) => { setEditingRoomId(room.id); setEditRoomData(room); };
  const saveRoom = () => { if (editingRoomId) { onUpdateRooms(rooms.map(r => r.id === editingRoomId ? { ...r, ...editRoomData } as Room : r)); setEditingRoomId(null); } };
  const deleteRoom = (id: string) => setConfirmState({ isOpen: true, title: t.database.confirmDelete, message: t.database.confirmDeleteMsg, onConfirm: () => onUpdateRooms(rooms.filter(r => r.id !== id)), isDestructive: true });
  const handleAddTrainer = () => { if (newTrainer.name) { onUpdateTrainers([...trainers, { id: uuidv4(), name: newTrainer.name, racs: newTrainer.racs }]); setNewTrainer({ name: '', racs: [] }); } };
  const deleteTrainer = (id: string) => setConfirmState({ isOpen: true, title: t.database.confirmDelete, message: t.database.confirmDeleteMsg, onConfirm: () => onUpdateTrainers(trainers.filter(t => t.id !== id)), isDestructive: true });
  const startEditTrainer = (trainer: Trainer) => { setEditingTrainerId(trainer.id); setEditTrainerData({ name: trainer.name, racs: trainer.racs }); };
  const saveTrainer = () => { if (editingTrainerId) { onUpdateTrainers(trainers.map(t => t.id === editingTrainerId ? { ...t, name: editTrainerData.name, racs: editTrainerData.racs } : t)); setEditingTrainerId(null); } };
  const toggleNewTrainerRac = (c: string) => setNewTrainer(p => ({ ...p, racs: p.racs.includes(c) ? p.racs.filter(r => r !== c) : [...p.racs, c] }));
  const handleAddRac = () => { if (newRac.code) { onUpdateRacs([...racDefinitions, { id: uuidv4(), code: newRac.code, name: newRac.name, validityMonths: newRac.validityMonths, requiresDriverLicense: newRac.requiresDriverLicense, requiresPractical: newRac.requiresPractical }]); setNewRac({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true }); } };
  const deleteRac = (id: string) => setConfirmState({ isOpen: true, title: t.database.confirmDelete, message: t.database.confirmDeleteMsg, onConfirm: () => onUpdateRacs(racDefinitions.filter(r => r.id !== id)), isDestructive: true });
  const startEditRac = (rac: RacDef) => { setEditingRacId(rac.id); setEditRacData(rac); };
  const saveRac = () => { if (editingRacId) { onUpdateRacs(racDefinitions.map(r => r.id === editingRacId ? { ...r, ...editRacData } as RacDef : r)); setEditingRacId(null); } };

  const handleGlobalSave = () => {
      setIsSaving(true);
      setTimeout(() => { setIsSaving(false); addNotification({ id: uuidv4(), type: 'success', title: 'Saved', message: 'Configuration saved.', timestamp: new Date(), isRead: false }); }, 800);
  };

  const runIntegrationSync = () => {
      if (!onSyncDatabases) return;
      setIsSyncing(true);
      setSyncLogs([]);
      let step = 0;
      const steps = ["Connecting...", "Auth Source A...", "Auth Source B...", "Fetching...", "Merging..."];
      const interval = setInterval(() => {
          if (step < steps.length) { setSyncLogs(p => [...p, steps[step]]); step++; } 
          else { clearInterval(interval); const res = onSyncDatabases(); setSyncLogs(p => [...p, res.msg]); setIsSyncing(false); }
      }, 500);
  };

  // --- ROBOTIC SELF-HEALING SIMULATION (UPDATED) ---
  const runSelfHealing = () => {
      setIsHealing(true);
      setHealingProgress(0);
      setIsHealed(false);
      
      const steps = [
          "Scanning Neural Pathways...",
          "Optimizing Memory Shards...",
          "Defragmenting User State...",
          "Flushing Session Cache...", // REAL WORLD STEP
          "Re-calibrating Operational Matrix...",
          "Verifying System Integrity...",
          "Applying Security Patch #994..."
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
          setHealingProgress(prev => {
              const next = prev + (Math.random() * 8); 
              
              if (Math.floor(next / 15) > stepIndex && stepIndex < steps.length - 1) {
                  stepIndex++;
                  setHealingStep(steps[stepIndex]);
              }

              if (next >= 100) {
                  clearInterval(interval);
                  
                  // REAL WORLD LOGIC: Clear session storage to force a clean slate reload
                  try {
                      sessionStorage.clear();
                  } catch (e) { console.error(e); }

                  setIsHealed(true);
                  setHealingStep("SYSTEM OPTIMIZED");
                  return 100;
              }
              return next;
          });
      }, 200);
  };

  const handleManualReboot = () => {
      try {
          window.location.reload();
      } catch {
          window.location.href = window.location.href;
      }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up relative h-full">
        {/* FULL SCREEN HEALING OVERLAY */}
        {isHealing && (
            <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 font-mono overflow-hidden text-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="relative z-10 max-w-2xl w-full">
                    <div className="flex justify-center mb-10 relative">
                        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${isHealed ? 'bg-green-500/40' : 'bg-cyan-500/30 animate-pulse'}`}></div>
                        <div className={`relative h-32 w-32 bg-slate-900 rounded-full border-4 flex items-center justify-center shadow-2xl ${isHealed ? 'border-green-500 shadow-green-500/50' : 'border-cyan-500 shadow-cyan-500/50'}`}>
                            {isHealed ? <CheckCircle size={64} className="text-green-400 animate-bounce-in" /> : <Cpu size={64} className="text-cyan-400 animate-spin-slow" />}
                        </div>
                    </div>
                    <div className="text-center mb-8 space-y-4">
                        <h1 className="text-3xl font-black tracking-[0.2em] text-white">{isHealed ? 'SYSTEM OPTIMIZED' : 'ROBOTECH PROTOCOL'}</h1>
                        <p className={`text-sm ${isHealed ? 'text-green-400' : 'text-cyan-400 animate-pulse'}`}>{isHealed ? 'Maintenance Complete. Reboot Required.' : 'DIAGNOSTIC IN PROGRESS'}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs uppercase font-bold tracking-wider">
                            <span className={isHealed ? 'text-green-600' : 'text-cyan-600'}>Repair Status</span>
                            <span className="text-cyan-400">{Math.floor(healingProgress)}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
                            <div className={`h-full transition-all duration-100 ease-out relative overflow-hidden ${isHealed ? 'bg-green-500' : 'bg-cyan-500'}`} style={{ width: `${healingProgress}%` }}></div>
                        </div>
                    </div>
                    <div className="mt-8 bg-black/80 rounded-lg border border-slate-800 p-4 font-mono text-xs h-32 overflow-hidden flex flex-col justify-end shadow-inner">
                        <div className="text-cyan-500 font-bold flex items-center gap-2"><Terminal size={12} /> {healingStep} <span className="animate-pulse">_</span></div>
                    </div>
                    
                    {/* MANUAL REBOOT BUTTON */}
                    {isHealed && (
                        <div className="mt-10 text-center animate-fade-in-up">
                            <button 
                                onClick={handleManualReboot}
                                className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg shadow-green-500/30 flex items-center gap-3 mx-auto transition-all hover:scale-105"
                            >
                                <Power size={24} /> REBOOT SYSTEM
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
            <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                <Sliders size={400} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                            <Settings size={28} className="text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-white">{t.settings.title}</h2>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">
                        {canEditGlobalDefinitions ? t.settings.globalConfig : t.settings.localConfig}
                    </p>
                </div>
                
                {/* Save Button */}
                <button 
                    onClick={handleGlobalSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                        isSaving 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-green-500/20 transform hover:-translate-y-0.5'
                    }`}
                >
                    {isSaving ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18} />}
                    <span>{isSaving ? t.settings.saving : t.settings.saveAll}</span>
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)]">
            {/* Sidebar */}
            <div className="w-full lg:w-72 space-y-3 h-fit">
                <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3">
                    {['General', 'Trainers', ...(canEditGlobalDefinitions ? ['RACs', 'Sites'] : []), ...(isSystemAdmin ? ['Companies', 'Integration', 'Diagnostics'] : [])].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mb-1 ${activeTab === tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            {tab === 'Diagnostics' ? <Activity size={20} /> : <Box size={20} />}
                            <span>{tab}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                    {activeTab === 'General' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.settings.rooms.title}</h3>
                            <div className="grid gap-3">
                                {rooms.map(room => (
                                    <div key={room.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border rounded-xl">
                                        <div className="font-bold text-sm text-slate-800 dark:text-white">{room.name} (Cap: {room.capacity})</div>
                                        <button onClick={() => deleteRoom(room.id)} className="text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input className="border p-2 rounded" placeholder="New Room" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} />
                                <button onClick={handleAddRoom} className="bg-blue-600 text-white p-2 rounded"><Plus size={20}/></button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Diagnostics' && isSystemAdmin && (
                        <div className="max-w-5xl mx-auto animate-fade-in">
                            <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                        <Activity size={28} className="text-cyan-500" />
                                        Robotic Self-Healing System
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Automated diagnostic and repair protocols powered by RoboTech AI.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">System Health</p>
                                    <span className="text-lg font-black text-green-500">{systemHealth}%</span>
                                </div>
                            </div>

                            <div className="bg-black rounded-2xl shadow-2xl overflow-hidden border border-slate-800 font-mono relative">
                                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                                    <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                                    <span className="text-xs text-slate-500">root@cars-manager:~</span>
                                </div>
                                <div className="p-6 h-[300px] flex flex-col items-center justify-center text-slate-700 opacity-50">
                                    <Cpu size={64} className="mb-4" />
                                    <p>System Standard Operating Mode.</p>
                                </div>
                                <div className="bg-slate-900 p-6 border-t border-slate-800 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${isHealing ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{isHealing ? 'PROTOCOL ACTIVE' : 'STANDBY'}</span>
                                    </div>
                                    <button 
                                        onClick={runSelfHealing}
                                        disabled={isHealing}
                                        className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${isHealing ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/30'}`}
                                    >
                                        {isHealing ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                                        {isHealing ? 'Running Diagnostics...' : 'Initiate RoboTech Protocol'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onClose={() => setConfirmState(prev => ({...prev, isOpen: false}))} isDestructive={confirmState.isDestructive} confirmText={t.common.delete} cancelText={t.common.cancel} />
    </div>
  );
};

export default SettingsPage;
