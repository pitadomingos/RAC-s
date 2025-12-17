
import React, { useState } from 'react';
import { Settings, Users, Box, Save, Plus, Trash2, Tag, Edit2, Check, X, AlertCircle, Sliders, MapPin, User as UserIcon, Hash, LayoutGrid, Building2, Map, ShieldCheck, Mail, Lock, Calendar, MessageSquare, Clock, GitMerge, RefreshCw, Terminal, CheckCircle, ChevronLeft, ChevronRight, Activity, Cpu, Zap, Power, UploadCloud, Globe, Wine, Edit } from 'lucide-react';
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
  const isSiteAdmin = userRole === UserRole.SITE_ADMIN;

  const canEditGlobalDefinitions = isSystemAdmin || isEnterpriseAdmin;
  // Specific permission for RACs tab: System, Enterprise, OR Site Admin
  const canAccessRacs = isSystemAdmin || isEnterpriseAdmin || isSiteAdmin;
  // Specific permission for Sites tab: System, Enterprise, OR Site Admin
  const canAccessSites = isSystemAdmin || isEnterpriseAdmin || isSiteAdmin;

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
  
  // COMPANY STATE
  const [newCompany, setNewCompany] = useState<{name: string, adminName: string, adminEmail: string, defaultLanguage: 'en' | 'pt', alcoholFeature: boolean}>({ 
      name: '', adminName: '', adminEmail: '', defaultLanguage: 'pt', alcoholFeature: false
  });
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);
  
  // Edit Company State
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  
  // ROOM STATE (Fixed Capacity)
  const [newRoom, setNewRoom] = useState<{ name: string; capacity: string }>({ name: '', capacity: '20' });
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
  
  // --- COMPANY CRUD ---
  const handleAddCompany = () => { 
      if (newCompany.name && onUpdateCompanies) { 
          onUpdateCompanies([...companies, { 
              id: uuidv4(), 
              name: newCompany.name, 
              status: 'Active', 
              defaultLanguage: newCompany.defaultLanguage,
              features: { alcohol: newCompany.alcoholFeature } // Set feature flag
          }]); 
          setNewCompany({ name: '', adminName: '', adminEmail: '', defaultLanguage: 'pt', alcoholFeature: false }); 
          setProvisionSuccess(`Company ${newCompany.name} added.`);
          setTimeout(() => setProvisionSuccess(null), 3000);
      } 
  };

  const handleUpdateCompany = () => {
      if (editingCompany && onUpdateCompanies) {
          onUpdateCompanies(companies.map(c => c.id === editingCompany.id ? editingCompany : c));
          setEditingCompany(null);
          addNotification({ id: uuidv4(), type: 'success', title: 'Updated', message: 'Tenant updated successfully', timestamp: new Date(), isRead: false });
      }
  };

  const handleDeleteCompany = (id: string) => {
      if (onUpdateCompanies) {
          setConfirmState({ 
              isOpen: true, 
              title: t.database.confirmDelete, 
              message: "This will permanently remove the tenant and all associated data.", 
              onConfirm: () => onUpdateCompanies(companies.filter(c => c.id !== id)), 
              isDestructive: true 
          });
      }
  };
  
  // --- ROOM HANDLERS ---
  const handleAddRoom = () => { 
      if (newRoom.name) { 
          const capacity = parseInt(newRoom.capacity) || 20;
          onUpdateRooms([...rooms, { id: uuidv4(), name: newRoom.name, capacity }]); 
          setNewRoom({ name: '', capacity: '20' }); 
      } else {
          addNotification({ id: uuidv4(), type: 'warning', title: 'Input Error', message: 'Room Name is required', timestamp: new Date(), isRead: false });
      }
  };
  
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

  // --- ROBOTIC SELF-HEALING SIMULATION ---
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
                    {['General', 'Trainers', ...(canAccessRacs ? ['RACs'] : []), ...(canAccessSites ? ['Sites'] : []), ...(isSystemAdmin ? ['Companies', 'Integration', 'Diagnostics'] : [])].map((tab) => (
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
                                        <button onClick={() => deleteRoom(room.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            {/* FIXED ROOM INPUT */}
                            <div className="mt-6 flex gap-2 items-center bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border dark:border-slate-700">
                                <input 
                                    className="flex-1 border dark:border-slate-600 dark:bg-slate-700 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                                    placeholder={t.settings.rooms.name} 
                                    value={newRoom.name} 
                                    onChange={e => setNewRoom({...newRoom, name: e.target.value})} 
                                />
                                <input 
                                    type="number"
                                    className="w-24 border dark:border-slate-600 dark:bg-slate-700 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" 
                                    placeholder={t.settings.rooms.capacity} 
                                    value={newRoom.capacity} 
                                    onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} 
                                />
                                <button 
                                    onClick={handleAddRoom} 
                                    type="button" 
                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-colors w-10 flex items-center justify-center shadow-lg"
                                >
                                    <Plus size={20}/>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Trainers' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.settings.trainers.title}</h3>
                            <div className="space-y-4">
                                {trainers.map(trainer => (
                                    <div key={trainer.id} className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex justify-between items-center shadow-sm">
                                        <div>
                                            <div className="font-bold text-slate-800 dark:text-white">{trainer.name}</div>
                                            <div className="flex gap-2 mt-1">
                                                {trainer.racs.map(r => <span key={r} className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">{r}</span>)}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteTrainer(trainer.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-sm font-bold mb-3">{t.settings.trainers.new}</h4>
                                <input 
                                    className="w-full p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700 mb-4" 
                                    placeholder="Trainer Name" 
                                    value={newTrainer.name} 
                                    onChange={e => setNewTrainer({...newTrainer, name: e.target.value})} 
                                />
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {racDefinitions.map(rac => (
                                        <button 
                                            type="button"
                                            key={rac.code} 
                                            onClick={() => toggleNewTrainerRac(rac.code)}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${newTrainer.racs.includes(rac.code) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600'}`}
                                        >
                                            {rac.code}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handleAddTrainer} className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors"><Plus size={16} className="inline mr-2"/> Add Trainer</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'RACs' && canAccessRacs && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.settings.racs.title}</h3>
                            <div className="space-y-3">
                                {racDefinitions.map(rac => (
                                    <div key={rac.id} className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex justify-between items-center group hover:border-blue-300 transition-colors">
                                        <div className="flex gap-4 items-center">
                                            <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-sm font-black text-slate-600 dark:text-slate-300">{rac.code}</div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-800 dark:text-white">{rac.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5 flex gap-3">
                                                    <span>{rac.validityMonths} Months Validity</span>
                                                    {rac.requiresDriverLicense && <span className="text-red-400 flex items-center gap-1"><AlertCircle size={10}/> DL Required</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteRac(rac.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                                <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Code (e.g. RAC99)" value={newRac.code} onChange={e => setNewRac({...newRac, code: e.target.value})} />
                                <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Description" value={newRac.name} onChange={e => setNewRac({...newRac, name: e.target.value})} />
                                <div className="col-span-2 flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" checked={newRac.requiresDriverLicense} onChange={e => setNewRac({...newRac, requiresDriverLicense: e.target.checked})} /> Requires DL</label>
                                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" checked={newRac.requiresPractical} onChange={e => setNewRac({...newRac, requiresPractical: e.target.checked})} /> Requires Practical</label>
                                    <button onClick={handleAddRac} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"><Plus size={16}/></button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Sites' && canAccessSites && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Operational Sites</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {sites.map(site => (
                                    <div key={site.id} className="p-5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm relative group">
                                        <button onClick={() => deleteSite(site.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={16}/></button>
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-white">{site.name}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {site.location}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input className="flex-1 p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Site Name" value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} />
                                <input className="flex-1 p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Location" value={newSite.location} onChange={e => setNewSite({...newSite, location: e.target.value})} />
                                <button onClick={handleAddSite} className="px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"><Plus size={20}/></button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Companies' && isSystemAdmin && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tenant Companies</h3>
                            {provisionSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2"><CheckCircle size={16}/> {provisionSuccess}</div>}
                            
                            <div className="space-y-3 mb-8">
                                {companies.map(comp => (
                                    <div key={comp.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl hover:border-indigo-300 transition-colors">
                                        <div className="font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                            <Building2 size={20} className="text-slate-400"/> 
                                            {comp.name}
                                            <div className="flex gap-1">
                                                <span className="text-[10px] text-slate-400 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 ml-2">
                                                    {comp.defaultLanguage === 'pt' ? '🇵🇹 PT' : '🇺🇸 EN'}
                                                </span>
                                                {comp.features?.alcohol && (
                                                    <span className="text-[10px] text-purple-500 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded px-1.5 py-0.5 flex items-center gap-1">
                                                        <Wine size={10} /> Alcohol
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${comp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{comp.status}</span>
                                            <button 
                                                onClick={() => setEditingCompany(comp)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCompany(comp.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-sm font-bold mb-4 uppercase text-slate-500 tracking-wider">Provision New Tenant</h4>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Company Name" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} />
                                        <div className="relative">
                                            <Globe size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                            <select 
                                                className="w-full p-3 pl-9 rounded-lg border dark:border-slate-600 dark:bg-slate-700 text-slate-700 dark:text-white bg-white appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
                                                value={newCompany.defaultLanguage}
                                                onChange={e => setNewCompany({...newCompany, defaultLanguage: e.target.value as 'en'|'pt'})}
                                            >
                                                <option value="pt">Portuguese (Default)</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Admin Name" value={newCompany.adminName} onChange={e => setNewCompany({...newCompany, adminName: e.target.value})} />
                                        <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Admin Email" value={newCompany.adminEmail} onChange={e => setNewCompany({...newCompany, adminEmail: e.target.value})} />
                                    </div>
                                    
                                    {/* ALCOHOL MODULE TOGGLE */}
                                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                        <input 
                                            type="checkbox" 
                                            id="alcToggle"
                                            className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                                            checked={newCompany.alcoholFeature}
                                            onChange={e => setNewCompany({...newCompany, alcoholFeature: e.target.checked})}
                                        />
                                        <label htmlFor="alcToggle" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer select-none">
                                            <Wine size={16} className="text-purple-500"/>
                                            Enable Alcohol Control Module (IoT)
                                        </label>
                                    </div>

                                    <button onClick={handleAddCompany} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all">Provision Tenant Environment</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Integration' && isSystemAdmin && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.settings.integrationPage.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={64}/></div>
                                    <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-2">{t.settings.integrationPage.sourceA}</h4>
                                    <div className="text-2xl font-black text-slate-800 dark:text-white mb-4">HR Database</div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Connected</span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{RAW_HR_SOURCE.length} Records</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={64}/></div>
                                    <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-2">{t.settings.integrationPage.sourceB}</h4>
                                    <div className="text-2xl font-black text-slate-800 dark:text-white mb-4">Contractor DB</div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Connected</span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{RAW_CONTRACTOR_SOURCE.length} Records</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black rounded-xl p-6 font-mono text-xs text-green-400 h-64 overflow-y-auto border border-slate-800 shadow-inner">
                                <div className="mb-2 text-slate-500">Middleware Console Output:</div>
                                {syncLogs.length === 0 && <div className="text-slate-600 italic">{t.settings.integrationPage.waiting}</div>}
                                {syncLogs.map((log, i) => <div key={i}>&gt; {log}</div>)}
                                {isSyncing && <div className="animate-pulse">&gt; {t.settings.integrationPage.processing}</div>}
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={runIntegrationSync}
                                    disabled={isSyncing}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isSyncing ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
                                >
                                    <GitMerge size={18} /> {t.settings.integrationPage.syncNow}
                                </button>
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
        
        {/* EDIT COMPANY MODAL */}
        {editingCompany && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setEditingCompany(null)}>
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Edit Tenant</h3>
                        <button onClick={() => setEditingCompany(null)}><X className="text-slate-400 hover:text-slate-600"/></button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Company Name</label>
                            <input 
                                className="w-full p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={editingCompany.name}
                                onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Default Language</label>
                            <select 
                                className="w-full p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={editingCompany.defaultLanguage}
                                onChange={(e) => setEditingCompany({...editingCompany, defaultLanguage: e.target.value as 'en'|'pt'})}
                            >
                                <option value="pt">Portuguese</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                            <input 
                                type="checkbox" 
                                id="editAlcToggle"
                                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                                checked={editingCompany.features?.alcohol || false}
                                onChange={(e) => setEditingCompany({
                                    ...editingCompany, 
                                    features: { ...editingCompany.features, alcohol: e.target.checked }
                                })}
                            />
                            <label htmlFor="editAlcToggle" className="text-sm font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2 cursor-pointer select-none">
                                <Wine size={18} /> Enable Alcohol Control Module
                            </label>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                        <button onClick={() => setEditingCompany(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400">Cancel</button>
                        <button onClick={handleUpdateCompany} className="px-8 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg">Save Changes</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SettingsPage;
