
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
    Settings, Box, Save, Plus, Trash2, Activity, Cpu, Zap, 
    RefreshCw, Building2, MapPin, Globe, Wine, Sparkles, 
    Upload, ShieldCheck, X, Edit, Info, UserPlus, Home, 
    CheckCircle2, AlertTriangle, Users, BookOpen, Layers,
    Clock, CheckSquare, Square, ShieldAlert, ChevronRight,
    Users2, LayoutList
} from 'lucide-react';
import { RacDef, Room, Trainer, Site, Company, UserRole, SystemNotification } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';
import ConfirmModal from '../components/ConfirmModal';
import RacIcon from '../components/RacIcon';

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
    addNotification: (notif: SystemNotification) => void;
    currentSiteId: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    racDefinitions, onUpdateRacs, 
    rooms, onUpdateRooms, 
    trainers, onUpdateTrainers,
    sites = [], onUpdateSites,
    companies = [], onUpdateCompanies,
    userRole = UserRole.SYSTEM_ADMIN,
    addNotification,
    currentSiteId
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'General' | 'Trainers' | 'Rooms' | 'RACs' | 'Sites' | 'Companies' | 'Branding'>('General');
  const [isSaving, setIsSaving] = useState(false);
  
  const isSystemAdmin = userRole === UserRole.SYSTEM_ADMIN;
  const isEnterpriseAdmin = userRole === UserRole.ENTERPRISE_ADMIN;
  const isSiteAdmin = userRole === UserRole.SITE_ADMIN;

  const canEditGlobalDefinitions = isSystemAdmin || isEnterpriseAdmin;
  const canAccessRacs = isSystemAdmin || isEnterpriseAdmin || isSiteAdmin;
  const canAccessSites = isSystemAdmin || isEnterpriseAdmin || isSiteAdmin;
  const canAccessBranding = isSystemAdmin || isEnterpriseAdmin;

  const logoRef = useRef<HTMLInputElement>(null);
  const safetyLogoRef = useRef<HTMLInputElement>(null);

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

  // Entity Forms State
  const [newSite, setNewSite] = useState({ name: '', location: '' });
  const [newRoom, setNewRoom] = useState({ name: '', capacity: '20' });
  const [newTrainer, setNewTrainer] = useState<{name: string, racs: string[], siteId: string}>({ 
      name: '', 
      racs: [], 
      siteId: currentSiteId !== 'all' ? currentSiteId : (sites[0]?.id || '') 
  });
  const [newRac, setNewRac] = useState({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true });
  
  // Branding State
  const myCompany = useMemo(() => companies.find(c => c.id === 'c1') || companies[0], [companies]);
  const [brandDraft, setBrandDraft] = useState<Partial<Company>>(myCompany || {});

  useEffect(() => { if (myCompany) setBrandDraft(myCompany); }, [myCompany]);

  // Actions
  const handleSaveBranding = async () => {
      if (!onUpdateCompanies || !myCompany) return;
      setIsSaving(true);
      const updated = companies.map(c => c.id === myCompany.id ? { ...c, ...brandDraft } as Company : c);
      await onUpdateCompanies(updated);
      setTimeout(() => {
          setIsSaving(false);
          addNotification({ id: uuidv4(), type: 'success', title: 'Branding Updated', message: 'Corporate identity synced successfully.', timestamp: new Date(), isRead: false });
      }, 800);
  };

  const handleAddSite = () => { 
      if (newSite.name && onUpdateSites) { 
          onUpdateSites([...sites, { id: uuidv4(), companyId: 'c1', name: newSite.name, location: newSite.location || 'Unknown' }]); 
          setNewSite({ name: '', location: '' }); 
          addNotification({ id: uuidv4(), type: 'success', title: 'Site Added', message: `${newSite.name} registered.`, timestamp: new Date(), isRead: false });
      } 
  };

  const handleAddRoom = () => {
      if (newRoom.name) {
          onUpdateRooms([...rooms, { id: uuidv4(), name: newRoom.name, capacity: parseInt(newRoom.capacity) || 20, siteId: currentSiteId !== 'all' ? currentSiteId : 's1' }]);
          setNewRoom({ name: '', capacity: '20' });
          addNotification({ id: uuidv4(), type: 'success', title: 'Room Added', message: `${newRoom.name} created.`, timestamp: new Date(), isRead: false });
      }
  };

  const handleAddTrainer = () => {
      if (newTrainer.name) {
          onUpdateTrainers([...trainers, { 
              id: uuidv4(), 
              name: newTrainer.name, 
              racs: newTrainer.racs,
              siteId: newTrainer.siteId 
          }]);
          setNewTrainer({ ...newTrainer, name: '', racs: [] });
          addNotification({ id: uuidv4(), type: 'success', title: 'Trainer Added', message: `${newTrainer.name} registered.`, timestamp: new Date(), isRead: false });
      }
  };

  const handleToggleTrainerRac = (code: string) => {
      setNewTrainer(prev => ({
          ...prev,
          racs: prev.racs.includes(code) 
            ? prev.racs.filter(r => r !== code) 
            : [...prev.racs, code]
      }));
  };

  const handleDeleteTrainer = (id: string, name: string) => {
      setConfirmState({
          isOpen: true,
          title: 'Unregister Trainer?',
          message: `Are you sure you want to remove ${name}? This will revoke their authorization to grade training sessions.`,
          isDestructive: true,
          onConfirm: () => {
              onUpdateTrainers(trainers.filter(t => t.id !== id));
              addNotification({ id: uuidv4(), type: 'info', title: 'Trainer Removed', message: `${name} has been unregistered.`, timestamp: new Date(), isRead: false });
          }
      });
  };

  const handleAddRac = () => { 
      if (newRac.code && newRac.name) { 
          onUpdateRacs([...racDefinitions, { 
              id: uuidv4(), 
              companyId: myCompany?.id, 
              code: newRac.code, 
              name: newRac.name, 
              validityMonths: newRac.validityMonths, 
              requiresDriverLicense: newRac.requiresDriverLicense, 
              requiresPractical: newRac.requiresPractical 
          }]); 
          setNewRac({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true }); 
          addNotification({ id: uuidv4(), type: 'success', title: 'Module Created', message: `${newRac.code} is now active.`, timestamp: new Date(), isRead: false });
      } 
  };

  const deleteRac = (id: string) => {
      onUpdateRacs(racDefinitions.filter(r => r.id !== id));
      addNotification({ id: uuidv4(), type: 'info', title: 'Module Removed', message: 'The training module has been deactivated.', timestamp: new Date(), isRead: false });
  };

  const deleteSite = (id: string) => {
      if (onUpdateSites) {
          onUpdateSites(sites.filter(s => s.id !== id));
          addNotification({ id: uuidv4(), type: 'info', title: 'Site Removed', message: 'The operational site has been unregistered.', timestamp: new Date(), isRead: false });
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'corporate' | 'safety') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              if (type === 'corporate') setBrandDraft(prev => ({ ...prev, logoUrl: base64String }));
              else if (type === 'safety') setBrandDraft(prev => ({ ...prev, safetyLogoUrl: base64String }));
          };
          reader.readAsDataURL(file);
      }
  };

  const activeTabs = useMemo(() => {
      const tabs = ['General', 'Trainers', 'Rooms'];
      if (canAccessRacs) tabs.push('RACs');
      if (canAccessSites) tabs.push('Sites');
      if (canAccessBranding) tabs.push('Branding');
      if (isSystemAdmin) tabs.push('Companies');
      return tabs;
  }, [canAccessRacs, canAccessSites, canAccessBranding, isSystemAdmin]);

  const TabIcon = ({ name }: { name: string }) => {
      switch(name) {
          case 'General': return <Settings size={20} />;
          case 'Trainers': return <UserPlus size={20} />;
          case 'Rooms': return <Home size={20} />;
          case 'RACs': return <Activity size={20} />;
          case 'Sites': return <MapPin size={20} />;
          case 'Companies': return <Building2 size={20} />;
          case 'Branding': return <Sparkles size={20} />;
          default: return <Box size={20} />;
      }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full flex flex-col">
        {/* --- HEADER --- */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
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
                {activeTab === 'Branding' && (
                    <button 
                        onClick={handleSaveBranding} 
                        disabled={isSaving} 
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{t.settings.saveAll}</span>
                    </button>
                )}
            </div>
        </div>

        {/* --- TABS & CONTENT --- */}
        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
            {/* TAB LIST */}
            <div className="w-full lg:w-72 shrink-0">
                <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3 sticky top-0">
                    {activeTabs.map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as any)} 
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 mb-1 ${
                                activeTab === tab 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <TabIcon name={tab} />
                            <span>{tab}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* TAB CONTENT PANEL */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    
                    {/* GENERAL TAB */}
                    {activeTab === 'General' && (
                        <div className="max-w-3xl animate-fade-in space-y-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Core Parameters</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Configure operational thresholds for compliance calculations.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Default RAC Validity (Months)</label>
                                    <div className="relative group">
                                        <input type="number" defaultValue={24} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xl font-black outline-none focus:border-indigo-500 transition-all" />
                                        <Clock className="absolute right-4 top-4 text-slate-300 group-focus-within:text-indigo-500" size={24} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-3 font-bold">Standard renewal interval for all safety certifications.</p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Evaluation Pass Mark (%)</label>
                                    <div className="relative group">
                                        <input type="number" defaultValue={70} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xl font-black outline-none focus:border-indigo-500 transition-all" />
                                        <Zap className="absolute right-4 top-4 text-slate-300 group-focus-within:text-indigo-500" size={24} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-3 font-bold">Minimum grade required for both theory and practical exams.</p>
                                </div>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800 flex gap-4">
                                <Info className="text-amber-600 shrink-0" size={24} />
                                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                                    Changes to these parameters affect <strong>future</strong> evaluation records. Existing certifications maintain their original expiry dates unless manually re-processed.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TRAINERS TAB */}
                    {activeTab === 'Trainers' && (
                        <div className="max-w-5xl animate-fade-in space-y-10">
                            {/* --- FORM AT TOP --- */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Users2 size={120} /></div>
                                <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                                    <div className="lg:w-1/3 space-y-6">
                                        <div>
                                            <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                                                <UserPlus size={24} className="text-blue-500" />
                                                Register Instructor
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">Authorized personnel for safety evaluations.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <input className="w-full p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold text-sm" placeholder="Full Name" value={newTrainer.name} onChange={e => setNewTrainer({...newTrainer, name: e.target.value})} />
                                            <select className="w-full p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold text-sm outline-none" value={newTrainer.siteId} onChange={e => setNewTrainer({...newTrainer, siteId: e.target.value})}>
                                                <option value="">Primary Site</option>
                                                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                            <button onClick={handleAddTrainer} disabled={!newTrainer.name || !newTrainer.siteId} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-black shadow-lg disabled:bg-slate-300 transition-all">Add Trainer</button>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorization Matrix</label>
                                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase">{newTrainer.racs.length} Selected</span>
                                        </div>
                                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2 max-h-[180px] overflow-y-auto pr-2 scrollbar-hide">
                                            {racDefinitions.map(rac => {
                                                const isSelected = newTrainer.racs.includes(rac.code);
                                                return (
                                                    <button key={rac.id} onClick={() => handleToggleTrainerRac(rac.code)} className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'}`}>
                                                        <RacIcon racCode={rac.code} size={16} className={`mb-1 bg-transparent shadow-none ${isSelected ? 'text-white' : ''}`} />
                                                        <span className="text-[9px] font-black">{rac.code}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- LIST AT BOTTOM --- */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <LayoutList size={14} /> Registered Directory
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{trainers.length} Records</span>
                                </div>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {trainers.map(t => (
                                        <div key={t.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-sm">{t.name.charAt(0)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-slate-900 dark:text-white truncate">{t.name}</div>
                                                    <div className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin size={10} /> {sites.find(s => s.id === t.siteId)?.name || 'Multi-Site'}</div>
                                                </div>
                                                <div className="hidden md:flex flex-wrap gap-1 max-w-[300px]">
                                                    {t.racs.map(r => <span key={r} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-[9px] font-black text-slate-500 rounded uppercase">{r}</span>)}
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteTrainer(t.id, t.name)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    ))}
                                    {trainers.length === 0 && <div className="p-12 text-center text-slate-400 italic text-sm">No trainers registered yet.</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ROOMS TAB */}
                    {activeTab === 'Rooms' && (
                        <div className="max-w-4xl animate-fade-in space-y-10">
                            {/* --- FORM AT TOP --- */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700">
                                <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 mb-6">
                                    <Home size={24} className="text-emerald-500" />
                                    New Training Venue
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="md:col-span-1 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Title</label>
                                        <input className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="e.g. Simulation Hub A" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                                        <input type="number" className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} />
                                    </div>
                                    <button onClick={handleAddRoom} className="bg-emerald-600 hover:bg-emerald-500 text-white h-[50px] rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Add Venue
                                    </button>
                                </div>
                            </div>

                            {/* --- LIST AT BOTTOM --- */}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {rooms.map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-emerald-400 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600"><Home size={20}/></div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{r.name}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase">{r.capacity} Seats Available</div>
                                            </div>
                                        </div>
                                        <button onClick={() => onUpdateRooms(rooms.filter(rm => rm.id !== r.id))} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* RACS TAB */}
                    {activeTab === 'RACs' && (
                        <div className="max-w-4xl animate-fade-in space-y-10">
                            {/* --- FORM AT TOP --- */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700">
                                <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 mb-6">
                                    <Activity size={24} className="text-indigo-500" />
                                    Configure Logic Module
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</label>
                                        <input className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold uppercase" placeholder="RAC11" value={newRac.code} onChange={e => setNewRac({...newRac, code: e.target.value.toUpperCase()})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                                        <input className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="Traffic Safety" value={newRac.name} onChange={e => setNewRac({...newRac, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity (M)</label>
                                        <input type="number" className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold text-center" value={newRac.validityMonths} onChange={e => setNewRac({...newRac, validityMonths: parseInt(e.target.value) || 24})} />
                                    </div>
                                    <button onClick={handleAddRac} className="bg-indigo-600 hover:bg-indigo-500 text-white h-[45px] rounded-lg font-black shadow-md flex items-center justify-center gap-2">
                                        <Plus size={16} /> Deploy
                                    </button>
                                </div>
                            </div>

                            {/* --- LIST AT BOTTOM --- */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {racDefinitions.map(rac => (
                                    <div key={rac.id} className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-indigo-400 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-black text-slate-600 dark:text-slate-300">{rac.code}</div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-800 dark:text-white">{rac.name}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase">{rac.validityMonths} Months Validity • {rac.requiresPractical ? 'Practical Req' : 'Theory Only'}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteRac(rac.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SITES TAB */}
                    {activeTab === 'Sites' && (
                        <div className="max-w-4xl animate-fade-in space-y-10">
                            {/* --- FORM AT TOP --- */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700">
                                <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 mb-6">
                                    <MapPin size={24} className="text-teal-500" />
                                    Operational site registration
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Title</label>
                                        <input className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="e.g. Port of Maputo" value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region</label>
                                        <input className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="Mozambique" value={newSite.location} onChange={e => setNewSite({...newSite, location: e.target.value})} />
                                    </div>
                                    <button onClick={handleAddSite} className="bg-teal-600 hover:bg-teal-500 text-white h-[50px] rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Register Site
                                    </button>
                                </div>
                            </div>

                            {/* --- LIST AT BOTTOM --- */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {sites.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-teal-400 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-xl text-teal-600"><MapPin size={20}/></div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{s.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400">{s.location}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteSite(s.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BRANDING TAB */}
                    {activeTab === 'Branding' && (
                        <div className="max-w-4xl animate-fade-in space-y-12">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Corporate Identity</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Personalize the CARS environment to match your enterprise standards.</p>
                            </div>

                            <div className="space-y-10">
                                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 block ml-1">System Display Alias</label>
                                    <div className="relative">
                                        <input type="text" className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-5 text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all shadow-inner" placeholder="e.g. VULCAN SAFEWORK" value={brandDraft.appName || ''} onChange={e => setBrandDraft({...brandDraft, appName: e.target.value})} />
                                        <div className="absolute right-5 top-5 p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg text-indigo-600"><Sparkles size={20} /></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Main Header Logo</label>
                                        <div className="p-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-6 group hover:bg-white transition-all">
                                            {brandDraft.logoUrl ? (
                                                <div className="flex flex-col items-center gap-4"><img src={brandDraft.logoUrl} className="h-12 object-contain" /><button onClick={() => setBrandDraft({...brandDraft, logoUrl: ''})} className="text-[10px] font-black text-red-500 uppercase">Discard</button></div>
                                            ) : (
                                                <button onClick={() => logoRef.current?.click()} className="px-6 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-full font-bold text-xs shadow-sm">Choose File</button>
                                            )}
                                            <input type="file" ref={logoRef} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'corporate')} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Sidebar Safety Badge</label>
                                        <div className="p-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-6 group hover:bg-white transition-all">
                                            {brandDraft.safetyLogoUrl ? (
                                                <div className="flex flex-col items-center gap-4"><img src={brandDraft.safetyLogoUrl} className="h-20 w-20 object-contain" /><button onClick={() => setBrandDraft({...brandDraft, safetyLogoUrl: ''})} className="text-[10px] font-black text-red-500 uppercase">Discard</button></div>
                                            ) : (
                                                <button onClick={() => safetyLogoRef.current?.click()} className="px-6 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-full font-bold text-xs shadow-sm">Choose File</button>
                                            )}
                                            <input type="file" ref={safetyLogoRef} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'safety')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COMPANIES TAB (SYSTEM ADMIN ONLY) */}
                    {activeTab === 'Companies' && (
                        <div className="max-w-4xl animate-fade-in space-y-10">
                            {/* --- FORM AT TOP --- */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700">
                                <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 mb-6">
                                    <Building2 size={24} className="text-blue-500" />
                                    Enterprise Tenant Onboarding
                                </h4>
                                <button className="w-full py-4 rounded-xl border-4 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all font-black text-sm flex items-center justify-center gap-3 group">
                                    <Plus size={20} /> Open Onboarding Wizard
                                </button>
                            </div>

                            {/* --- LIST AT BOTTOM --- */}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {companies.map(c => (
                                    <div key={c.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex justify-between items-center group shadow-sm hover:shadow-md transition-all">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 shadow-inner">
                                                {c.logoUrl ? <img src={c.logoUrl} className="w-full h-full object-contain p-1" /> : <Building2 className="text-slate-400" size={18} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-black text-sm text-slate-900 dark:text-white">{c.name}</h4>
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${c.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{c.status}</span>
                                                </div>
                                                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">ID: {c.id.slice(0,12)}...</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors"><Edit size={14}/></button>
                                            <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>

        {/* Modal handling */}
        <ConfirmModal 
            isOpen={confirmState.isOpen} 
            title={confirmState.title} 
            message={confirmState.message} 
            onConfirm={confirmState.onConfirm} 
            onClose={() => setConfirmState(prev => ({...prev, isOpen: false}))} 
            isDestructive={confirmState.isDestructive} 
        />
    </div>
  );
};

export default SettingsPage;
