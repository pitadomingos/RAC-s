
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Settings, Box, Save, Plus, Trash2, Activity, Cpu, Zap, RefreshCw, Building2, MapPin, Globe, Wine, Sparkles, Upload, ShieldCheck, X, Edit, Info, UserPlus, Home, CheckCircle2 } from 'lucide-react';
import { RacDef, Room, Trainer, Site, Company, UserRole, User, SystemNotification } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';
import ConfirmModal from '../components/ConfirmModal';

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
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    racDefinitions, onUpdateRacs, 
    rooms, onUpdateRooms, 
    trainers, onUpdateTrainers,
    sites = [], onUpdateSites,
    companies = [], onUpdateCompanies,
    userRole = UserRole.SYSTEM_ADMIN,
    addNotification
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
  const [newTrainer, setNewTrainer] = useState<{name: string, racs: string[]}>({ name: '', racs: [] });
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
      setIsSaving(false);
      addNotification({ id: uuidv4(), type: 'success', title: 'Branding Updated', message: 'Corporate identity synced successfully.', timestamp: new Date(), isRead: false });
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
          onUpdateRooms([...rooms, { id: uuidv4(), name: newRoom.name, capacity: parseInt(newRoom.capacity) || 20 }]);
          setNewRoom({ name: '', capacity: '20' });
          addNotification({ id: uuidv4(), type: 'success', title: 'Room Added', message: `${newRoom.name} created.`, timestamp: new Date(), isRead: false });
      }
  };

  const handleAddTrainer = () => {
      if (newTrainer.name) {
          onUpdateTrainers([...trainers, { id: uuidv4(), name: newTrainer.name, racs: newTrainer.racs }]);
          setNewTrainer({ name: '', racs: [] });
          addNotification({ id: uuidv4(), type: 'success', title: 'Trainer Added', message: `${newTrainer.name} registered.`, timestamp: new Date(), isRead: false });
      }
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

  // Added deleteRac helper function to resolve missing name error
  const deleteRac = (id: string) => {
      onUpdateRacs(racDefinitions.filter(r => r.id !== id));
      addNotification({ id: uuidv4(), type: 'info', title: 'Module Removed', message: 'The training module has been deactivated.', timestamp: new Date(), isRead: false });
  };

  // Added deleteSite helper function to resolve missing name error
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
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm"><Settings size={28} className="text-blue-400" /></div>
                        <h2 className="text-3xl font-black tracking-tight text-white">{t.settings.title}</h2>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">{canEditGlobalDefinitions ? t.settings.globalConfig : t.settings.localConfig}</p>
                </div>
                {activeTab === 'Branding' && (
                    <button onClick={handleSaveBranding} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50">
                        {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{t.settings.saveAll}</span>
                    </button>
                )}
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
            <div className="w-full lg:w-72 shrink-0">
                <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3 sticky top-4">
                    {activeTabs.map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as any)} 
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 mb-1 ${activeTab === tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            <TabIcon name={tab} />
                            <span>{tab}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                    
                    {/* GENERAL TAB */}
                    {activeTab === 'General' && (
                        <div className="max-w-3xl animate-fade-in space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Global System Parameters</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Configure core logic thresholds for the entire tenant.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Default Validity (Months)</label>
                                    <input type="number" defaultValue={24} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 text-lg font-bold" />
                                </div>
                                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Pass Mark (%)</label>
                                    <input type="number" defaultValue={70} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 text-lg font-bold" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TRAINERS TAB */}
                    {activeTab === 'Trainers' && (
                        <div className="max-w-4xl animate-fade-in space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Certified Evaluators</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage authorized instructors and their RAC specializations.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {trainers.map(t => (
                                    <div key={t.id} className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl flex justify-between items-center group hover:border-indigo-400 transition-all shadow-sm">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{t.name}</div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {t.racs.map(r => <span key={r} className="text-[9px] font-black bg-slate-100 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded">{r}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => onUpdateTrainers(trainers.filter(trn => trn.id !== t.id))} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Register New Trainer</h4>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input className="flex-1 p-3 rounded-xl border dark:border-slate-600 dark:bg-slate-700 font-bold" placeholder="Trainer Name" value={newTrainer.name} onChange={e => setNewTrainer({...newTrainer, name: e.target.value})} />
                                    <button onClick={handleAddTrainer} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 flex items-center justify-center gap-2"><Plus size={18}/> Add</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ROOMS TAB */}
                    {activeTab === 'Rooms' && (
                        <div className="max-w-4xl animate-fade-in space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Training Facilities</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Define locations and physical capacity limits for sessions.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {rooms.map(r => (
                                    <div key={r.id} className="p-5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl flex justify-between items-center group hover:border-blue-400 transition-all shadow-sm">
                                        <div className="flex gap-4 items-center">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400"><Home size={20}/></div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{r.name}</div>
                                                <div className="text-xs text-slate-500">Cap: {r.capacity} seats</div>
                                            </div>
                                        </div>
                                        <button onClick={() => onUpdateRooms(rooms.filter(rm => rm.id !== r.id))} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Add Room</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input className="md:col-span-2 p-3 rounded-xl border dark:border-slate-600 dark:bg-slate-700 font-bold" placeholder="Room Name (e.g. Training Room A)" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} />
                                    <input type="number" className="p-3 rounded-xl border dark:border-slate-600 dark:bg-slate-700 font-bold" placeholder="Capacity" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} />
                                    <button onClick={handleAddRoom} className="md:col-span-3 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 flex items-center justify-center gap-2"><Plus size={18}/> Add Facility</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RACS TAB */}
                    {activeTab === 'RACs' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Dynamic Training Modules</h3>
                            <div className="space-y-3 mb-8">
                                {racDefinitions.map(rac => (
                                    <div key={rac.id} className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex justify-between items-center group hover:border-blue-300">
                                        <div className="flex gap-4 items-center">
                                            <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-sm font-black text-slate-600 dark:text-slate-300">{rac.code}</div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-800 dark:text-white">{rac.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{rac.validityMonths} Months</div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteRac(rac.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Define New Module</h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Handle (e.g. RAC01, M01)" value={newRac.code} onChange={e => setNewRac({...newRac, code: e.target.value})} />
                                    <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Display Name" value={newRac.name} onChange={e => setNewRac({...newRac, name: e.target.value})} />
                                    <input type="number" className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Validity (Months)" value={newRac.validityMonths} onChange={e => setNewRac({...newRac, validityMonths: parseInt(e.target.value) || 24})} />
                                    <button onClick={handleAddRac} className="bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 flex items-center justify-center gap-2"><Plus size={18}/> Add Module</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SITES TAB */}
                    {activeTab === 'Sites' && (
                        <div className="max-w-4xl animate-fade-in space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Operational Locations</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage geographic sites linked to this tenant.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sites.map(s => (
                                    <div key={s.id} className="p-5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl flex justify-between items-center group hover:border-teal-400 transition-all shadow-sm">
                                        <div className="flex gap-4 items-center">
                                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400"><MapPin size={20}/></div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{s.name}</div>
                                                <div className="text-xs text-slate-500">{s.location}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteSite(s.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Add Site</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input className="p-3 rounded-xl border dark:border-slate-600 dark:bg-slate-700 font-bold" placeholder="Site Name" value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} />
                                    <input className="p-3 rounded-xl border dark:border-slate-600 dark:bg-slate-700 font-bold" placeholder="Location (City/Province)" value={newSite.location} onChange={e => setNewSite({...newSite, location: e.target.value})} />
                                    <button onClick={handleAddSite} className="md:col-span-2 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-500 flex items-center justify-center gap-2"><Plus size={18}/> Add Operation</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BRANDING TAB */}
                    {activeTab === 'Branding' && (
                        <div className="max-w-4xl animate-fade-in space-y-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Corporate Identity</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Personalize the environment for your enterprise and site users.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Application Display Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xl font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                                        placeholder="e.g. VULCAN RACS"
                                        value={brandDraft.appName || ''}
                                        onChange={e => setBrandDraft({...brandDraft, appName: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">Corporate Logo</label>
                                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-4 group">
                                            {brandDraft.logoUrl ? (
                                                <div className="relative">
                                                    <img src={brandDraft.logoUrl} alt="Logo Preview" className="h-16 object-contain" />
                                                    <button onClick={() => setBrandDraft({...brandDraft, logoUrl: ''})} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"><X size={12}/></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform"><Upload size={24} /></div>
                                                    <p className="text-xs text-slate-400 font-bold">PNG or SVG supported</p>
                                                </>
                                            )}
                                            <input type="file" ref={logoRef} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'corporate')} />
                                            <button onClick={() => logoRef.current?.click()} className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline">SELECT FILE</button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">Safety Badge / Logo</label>
                                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-4 group">
                                            {brandDraft.safetyLogoUrl ? (
                                                <div className="relative">
                                                    <img src={brandDraft.safetyLogoUrl} alt="Safety Badge Preview" className="h-16 object-contain" />
                                                    <button onClick={() => setBrandDraft({...brandDraft, safetyLogoUrl: ''})} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"><X size={12}/></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
                                                    <p className="text-xs text-slate-400 font-bold">Square aspect recommended</p>
                                                </>
                                            )}
                                            <input type="file" ref={safetyLogoRef} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'safety')} />
                                            <button onClick={() => safetyLogoRef.current?.click()} className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline">SELECT FILE</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COMPANIES TAB (SYSTEM ADMIN ONLY) */}
                    {activeTab === 'Companies' && (
                        <div className="max-w-4xl animate-fade-in space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Enterprise Clients</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage multi-tenant enterprise accounts on this platform.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {companies.map(c => (
                                    <div key={c.id} className="p-6 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl flex justify-between items-center group shadow-sm">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                                {c.logoUrl ? <img src={c.logoUrl} className="w-full h-full object-contain p-1" /> : <Building2 className="text-slate-400" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {c.id} • {c.status}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
        <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onClose={() => setConfirmState(prev => ({...prev, isOpen: false}))} isDestructive={confirmState.isDestructive} />
    </div>
  );
};

export default SettingsPage;
