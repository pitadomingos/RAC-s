
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
    Settings, Box, Save, Plus, Trash2, Activity, Cpu, Zap, 
    RefreshCw, Building2, MapPin, Globe, Wine, Sparkles, 
    Upload, ShieldCheck, X, Edit, Info, UserPlus, Home, 
    CheckCircle2, AlertTriangle, Users, BookOpen, Layers,
    Clock, CheckSquare, Square, ShieldAlert, ChevronRight,
    Users2, LayoutList, Search, Filter, Shield, ToggleLeft, ToggleRight
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
  
  // Search and Local Filters
  const [searchQuery, setSearchQuery] = useState('');

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
          onUpdateSites([...sites, { id: uuidv4(), companyId: (myCompany?.id || 'c1'), name: newSite.name, location: newSite.location || 'Unknown' }]); 
          setNewSite({ name: '', location: '' }); 
          addNotification({ id: uuidv4(), type: 'success', title: 'Site Added', message: `${newSite.name} registered.`, timestamp: new Date(), isRead: false });
      } else {
          addNotification({ id: uuidv4(), type: 'warning', title: 'Invalid Input', message: 'Please provide a site name.', timestamp: new Date(), isRead: false });
      }
  };

  const handleAddRoom = () => {
      if (newRoom.name) {
          onUpdateRooms([...rooms, { id: uuidv4(), name: newRoom.name, capacity: parseInt(newRoom.capacity) || 20, siteId: currentSiteId !== 'all' ? currentSiteId : 's1' }]);
          setNewRoom({ name: '', capacity: '20' });
          addNotification({ id: uuidv4(), type: 'success', title: 'Room Added', message: `${newRoom.name} created.`, timestamp: new Date(), isRead: false });
      } else {
          addNotification({ id: uuidv4(), type: 'warning', title: 'Invalid Input', message: 'Please provide a room name.', timestamp: new Date(), isRead: false });
      }
  };

  const handleAddTrainer = () => {
      if (newTrainer.name && newTrainer.siteId) {
          onUpdateTrainers([...trainers, { 
              id: uuidv4(), 
              name: newTrainer.name, 
              racs: newTrainer.racs,
              siteId: newTrainer.siteId 
          }]);
          setNewTrainer({ ...newTrainer, name: '', racs: [] });
          addNotification({ id: uuidv4(), type: 'success', title: 'Trainer Added', message: `${newTrainer.name} registered.`, timestamp: new Date(), isRead: false });
      } else {
          addNotification({ id: uuidv4(), type: 'warning', title: 'Invalid Input', message: 'Please provide a name and site.', timestamp: new Date(), isRead: false });
      }
  };

  const handleAddRac = () => { 
      if (newRac.code && newRac.name) { 
          onUpdateRacs([...racDefinitions, { 
              id: uuidv4(), 
              companyId: myCompany?.id, 
              code: newRac.code.toUpperCase(), 
              name: newRac.name, 
              validityMonths: newRac.validityMonths, 
              requiresDriverLicense: newRac.requiresDriverLicense, 
              requiresPractical: newRac.requiresPractical 
          }]); 
          setNewRac({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true }); 
          addNotification({ id: uuidv4(), type: 'success', title: 'Module Created', message: `${newRac.code} is now active.`, timestamp: new Date(), isRead: false });
      } else {
          addNotification({ id: uuidv4(), type: 'warning', title: 'Invalid Input', message: 'Please provide a code and name.', timestamp: new Date(), isRead: false });
      }
  };

  const deleteTrainer = (id: string, name: string) => {
    setConfirmState({
        isOpen: true,
        title: 'Remove Instructor?',
        message: `Are you sure you want to remove ${name} from the authorized list?`,
        isDestructive: true,
        onConfirm: () => {
            onUpdateTrainers(trainers.filter(t => t.id !== id));
            addNotification({ id: uuidv4(), type: 'info', title: 'Trainer Removed', message: `${name} has been unregistered.`, timestamp: new Date(), isRead: false });
        }
    });
  };

  const deleteRac = (id: string, code: string) => {
      setConfirmState({
          isOpen: true,
          title: 'Delete Module?',
          message: `Are you sure you want to remove ${code}? This may affect compliance reporting.`,
          isDestructive: true,
          onConfirm: () => {
              onUpdateRacs(racDefinitions.filter(r => r.id !== id));
              addNotification({ id: uuidv4(), type: 'info', title: 'Module Removed', message: `${code} deactivated.`, timestamp: new Date(), isRead: false });
          }
      });
  };

  const deleteSite = (id: string, name: string) => {
      if (onUpdateSites) {
          setConfirmState({
              isOpen: true,
              title: 'Remove Site?',
              message: `Confirm decommissioning of ${name}. This cannot be undone.`,
              isDestructive: true,
              onConfirm: () => {
                  onUpdateSites(sites.filter(s => s.id !== id));
                  addNotification({ id: uuidv4(), type: 'info', title: 'Site Removed', message: `${name} decommissioned.`, timestamp: new Date(), isRead: false });
              }
          });
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

  // Filtered lists for UX
  const filteredTrainers = useMemo(() => trainers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())), [trainers, searchQuery]);
  const filteredRACs = useMemo(() => racDefinitions.filter(r => r.code.toLowerCase().includes(searchQuery.toLowerCase()) || r.name.toLowerCase().includes(searchQuery.toLowerCase())), [racDefinitions, searchQuery]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-6 animate-fade-in pb-4">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden border border-slate-800 shrink-0">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none"><Settings size={250} /></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30 text-blue-400">
                            <Settings size={32} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">{t.settings.title}</h2>
                    </div>
                    <p className="text-slate-400 text-sm font-medium ml-1">
                        {canEditGlobalDefinitions ? "Managing global enterprise standards and platform entities." : "Local site configuration only."}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    {activeTab === 'Branding' && (
                        <button 
                            onClick={handleSaveBranding} 
                            disabled={isSaving} 
                            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{t.settings.saveAll}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* --- MAIN LAYOUT GRID --- */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
            
            {/* LEFT SIDEBAR: TABS */}
            <div className="w-full lg:w-72 shrink-0">
                <nav className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 h-full">
                    <div className="space-y-2">
                        {activeTabs.map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => { setActiveTab(tab as any); setSearchQuery(''); }} 
                                className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all flex items-center gap-4 ${
                                    activeTab === tab 
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <TabIcon name={tab} />
                                <span>{tab}</span>
                                {activeTab === tab && <ChevronRight size={16} className="ml-auto opacity-50" />}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            {/* RIGHT AREA: CONTENT PANEL */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    
                    {/* TABS CONTENT */}
                    
                    {activeTab === 'General' && (
                        <div className="max-w-3xl space-y-12 animate-fade-in">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Platform Thresholds</h3>
                                <p className="text-slate-500 text-sm font-medium">Configure global calculation logic for compliance scoring.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 group hover:border-blue-400 transition-all">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Default Validity (Months)</label>
                                    <div className="flex items-center gap-4">
                                        <input type="number" defaultValue={24} className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-2xl font-black w-full outline-none focus:border-blue-500 transition-all shadow-inner" />
                                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600"><Clock size={24} /></div>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 group hover:border-yellow-400 transition-all">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Pass Mark (%)</label>
                                    <div className="flex items-center gap-4">
                                        <input type="number" defaultValue={70} className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-2xl font-black w-full outline-none focus:border-yellow-500 transition-all shadow-inner" />
                                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl text-yellow-600"><Zap size={24} /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-6 rounded-3xl flex gap-4">
                                <Info className="text-blue-500 shrink-0" size={24} />
                                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                                    Global parameters define how certification expiry is calculated for all modules. Site-specific overrides can be configured in Site Governance.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Trainers' && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                    <UserPlus className="text-blue-500" size={24} /> Onboard Instructor
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                                        <input className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="e.g. Jacinto Zacarias" value={newTrainer.name} onChange={e => setNewTrainer({...newTrainer, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Site</label>
                                        <select className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold appearance-none cursor-pointer" value={newTrainer.siteId} onChange={e => setNewTrainer({...newTrainer, siteId: e.target.value})}>
                                            <option value="">Choose Site...</option>
                                            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="lg:col-span-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">{newTrainer.racs.length} Approved RACS</div>
                                        <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto p-1 bg-white dark:bg-slate-800 border rounded-xl">
                                            {racDefinitions.map(rac => (
                                                <button key={rac.id} onClick={() => setNewTrainer(prev => ({ ...prev, racs: prev.racs.includes(rac.code) ? prev.racs.filter(r => r !== rac.code) : [...prev.racs, rac.code] }))} className={`px-2 py-1 rounded text-[9px] font-black transition-all ${newTrainer.racs.includes(rac.code) ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                                                    {rac.code}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleAddTrainer} className="bg-blue-600 hover:bg-blue-500 text-white h-[48px] rounded-xl font-black shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Register
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Active Faculty</h4>
                                    <div className="relative w-64">
                                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input type="text" placeholder="Search faculty..." className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredTrainers.map(t => (
                                        <div key={t.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-blue-500">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-sm">{t.name.charAt(0)}</div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-900 dark:text-white text-sm truncate w-32">{t.name}</h5>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase">{sites.find(s => s.id === t.siteId)?.name || 'Central Hub'}</div>
                                                    </div>
                                                </div>
                                                <button onClick={() => deleteTrainer(t.id, t.name)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 h-12 overflow-y-auto pr-1">
                                                {t.racs.map(r => <span key={r} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-[9px] font-black text-slate-500 rounded uppercase">{r}</span>)}
                                            </div>
                                        </div>
                                    ))}
                                    {filteredTrainers.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-slate-400 italic">No faculty records found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'RACs' && (
                        <div className="space-y-10 animate-fade-in">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                    <Activity className="text-indigo-500" size={24} /> Deploy Module
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Module Code</label>
                                        <input className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-black uppercase" placeholder="RAC11" value={newRac.code} onChange={e => setNewRac({...newRac, code: e.target.value.toUpperCase()})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Title</label>
                                        <input className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="Height Safety" value={newRac.name} onChange={e => setNewRac({...newRac, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Validity (M)</label>
                                        <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold text-center" value={newRac.validityMonths} onChange={e => setNewRac({...newRac, validityMonths: parseInt(e.target.value) || 24})} />
                                    </div>
                                    <button onClick={handleAddRac} className="bg-indigo-600 hover:bg-indigo-500 text-white h-[48px] rounded-xl font-black shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Deploy
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Requirement Logic</h4>
                                    <div className="relative w-64">
                                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                        <input type="text" placeholder="Search modules..." className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredRACs.map(rac => (
                                        <div key={rac.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-indigo-500">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-3">
                                                    <RacIcon racCode={rac.code} size={20} />
                                                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm tracking-widest">{rac.code}</span>
                                                </div>
                                                <button onClick={() => deleteRac(rac.id, rac.code)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                            <h5 className="font-bold text-slate-800 dark:text-white text-xs truncate mb-4">{rac.name}</h5>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 border-t border-slate-50 dark:border-slate-700 pt-3">
                                                <span>Validity: {rac.validityMonths}M</span>
                                                <span className={rac.requiresPractical ? 'text-blue-500' : 'text-slate-400'}>{rac.requiresPractical ? 'Practical Req' : 'Theory Only'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Sites' && (
                        <div className="max-w-4xl space-y-12 animate-fade-in">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                    <MapPin className="text-emerald-500" size={24} /> Operational Node Registration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Title</label>
                                        <input className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="e.g. Port of Maputo" value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region</label>
                                        <input className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="Mozambique" value={newSite.location} onChange={e => setNewSite({...newSite, location: e.target.value})} />
                                    </div>
                                    <button onClick={handleAddSite} className="bg-emerald-600 hover:bg-emerald-500 text-white h-[48px] rounded-xl font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Register
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sites.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-emerald-400 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 shadow-sm"><MapPin size={24}/></div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.name}</div>
                                                <div className="text-xs font-medium text-slate-400">{s.location}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteSite(s.id, s.name)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Rooms' && (
                        <div className="max-w-4xl space-y-12 animate-fade-in">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                    <Home className="text-orange-500" size={24} /> New Training Venue
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Name</label>
                                        <input className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" placeholder="e.g. Simulator Hub A" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Capacity</label>
                                        <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 font-bold" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} />
                                    </div>
                                    <button onClick={handleAddRoom} className="bg-orange-600 hover:bg-orange-500 text-white h-[48px] rounded-xl font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Add Venue
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {rooms.map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-orange-400 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 shadow-sm"><Home size={24}/></div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{r.name}</div>
                                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{r.capacity} Seats Available</div>
                                            </div>
                                        </div>
                                        <button onClick={() => onUpdateRooms(rooms.filter(rm => rm.id !== r.id))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Branding' && (
                        <div className="max-w-4xl space-y-12 animate-fade-in">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Corporate Identity</h3>
                                <p className="text-slate-500 text-sm font-medium">Personalize the CARS environment for your enterprise node.</p>
                            </div>

                            <div className="space-y-10">
                                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block ml-1">Application Branding Title</label>
                                    <div className="relative">
                                        <input type="text" className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-5 text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="e.g. VULCAN SAFEWORK" value={brandDraft.appName || ''} onChange={e => setBrandDraft({...brandDraft, appName: e.target.value})} />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500/20"><Sparkles size={40} /></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Primary Navigation Logo</label>
                                        <div className="p-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-6 group hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer" onClick={() => logoRef.current?.click()}>
                                            {brandDraft.logoUrl ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <img src={brandDraft.logoUrl} className="h-16 object-contain" />
                                                    <button onClick={(e) => { e.stopPropagation(); setBrandDraft({...brandDraft, logoUrl: ''}) }} className="text-[10px] font-black text-red-500 uppercase tracking-widest">Remove Logo</button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-500">
                                                    <Upload size={40} />
                                                    <span className="text-xs font-black uppercase tracking-widest">Select Image</span>
                                                </div>
                                            )}
                                            <input type="file" ref={logoRef} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'corporate')} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Sidebar Safety Badge</label>
                                        <div className="p-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-6 group hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer" onClick={() => safetyLogoRef.current?.click()}>
                                            {brandDraft.safetyLogoUrl ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <img src={brandDraft.safetyLogoUrl} className="h-20 w-20 object-contain" />
                                                    <button onClick={(e) => { e.stopPropagation(); setBrandDraft({...brandDraft, safetyLogoUrl: ''}) }} className="text-[10px] font-black text-red-500 uppercase tracking-widest">Remove Badge</button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-indigo-500">
                                                    <ShieldCheck size={40} />
                                                    <span className="text-xs font-black uppercase tracking-widest">Select Icon</span>
                                                </div>
                                            )}
                                            <input type="file" ref={safetyLogoRef} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'safety')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Companies' && (
                        <div className="max-w-4xl space-y-10 animate-fade-in">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Tenant Entities</h3>
                                    <p className="text-slate-500 text-sm font-medium">Managing multi-client operational nodes.</p>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-blue-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5">
                                    <Plus size={20} /> Provision Client
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {companies.map(c => (
                                    <div key={c.id} className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] flex justify-between items-center group hover:shadow-lg transition-all">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 shadow-inner p-2">
                                                {c.logoUrl ? <img src={c.logoUrl} className="w-full h-full object-contain" /> : <Building2 className="text-slate-300" size={32} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">{c.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${c.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{c.status}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    <span className="flex items-center gap-1.5"><Globe size={10}/> {c.defaultLanguage?.toUpperCase()}</span>
                                                    <span className="flex items-center gap-1.5"><Wine size={10}/> Alcohol Link: {c.features?.alcohol ? 'Active' : 'Off'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                                            <button className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>

        {/* Confirmation Modal Overlay */}
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
