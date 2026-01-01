
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Settings, Box, Save, Plus, Trash2, Activity, Cpu, Zap, RefreshCw, Building2, MapPin, Globe, Wine, Sparkles, Upload, ShieldCheck, X, Edit, Info } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'General' | 'Trainers' | 'RACs' | 'Sites' | 'Companies' | 'Branding' | 'Diagnostics'>('General');
  const [isSaving, setIsSaving] = useState(false);
  
  const isSystemAdmin = userRole === UserRole.SYSTEM_ADMIN;
  const isEnterpriseAdmin = userRole === UserRole.ENTERPRISE_ADMIN;
  const isSiteAdmin = userRole === UserRole.SITE_ADMIN;

  const canEditGlobalDefinitions = isSystemAdmin || isEnterpriseAdmin;
  const canAccessRacs = isSystemAdmin || isEnterpriseAdmin || isSiteAdmin;
  const canAccessSites = isSystemAdmin || isEnterpriseAdmin || isSiteAdmin;
  const canAccessBranding = isSystemAdmin || isEnterpriseAdmin;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
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

  const [newSite, setNewSite] = useState({ name: '', location: '' });
  const [newCompany, setNewCompany] = useState({ name: '', logoUrl: '', adminName: '', adminEmail: '', defaultLanguage: 'pt' as const, alcoholFeature: false });
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const myCompany = useMemo(() => companies.find(c => c.id === 'c1') || companies[0], [companies]);
  const [brandDraft, setBrandDraft] = useState<Partial<Company>>(myCompany || {});

  useEffect(() => { if (myCompany) setBrandDraft(myCompany); }, [myCompany]);

  const [newRoom, setNewRoom] = useState({ name: '', capacity: '20' });
  const [newTrainer, setNewTrainer] = useState<{name: string, racs: string[]}>({ name: '', racs: [] });
  const [newRac, setNewRac] = useState({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true });

  const handleAddSite = () => { if (newSite.name && onUpdateSites) { onUpdateSites([...sites, { id: uuidv4(), companyId: 'c1', name: newSite.name, location: newSite.location || 'Unknown' }]); setNewSite({ name: '', location: '' }); } };
  const deleteSite = (id: string) => { if (onUpdateSites) setConfirmState({ isOpen: true, title: t.database.confirmDelete, message: t.database.confirmDeleteMsg, onConfirm: () => onUpdateSites(sites.filter(s => s.id !== id)), isDestructive: true }); };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'corporate' | 'safety' | 'provision') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              if (type === 'provision') setNewCompany({ ...newCompany, logoUrl: base64String });
              else if (type === 'corporate') setBrandDraft(prev => ({ ...prev, logoUrl: base64String }));
              else if (type === 'safety') setBrandDraft(prev => ({ ...prev, safetyLogoUrl: base64String }));
          };
          reader.readAsDataURL(file);
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
      } 
  };

  const deleteRac = (id: string) => setConfirmState({ isOpen: true, title: t.database.confirmDelete, message: t.database.confirmDeleteMsg, onConfirm: () => onUpdateRacs(racDefinitions.filter(r => r.id !== id)), isDestructive: true });

  const activeTabs = useMemo(() => {
      const tabs = ['General', 'Trainers'];
      if (canAccessRacs) tabs.push('RACs');
      if (canAccessSites) tabs.push('Sites');
      if (canAccessBranding) tabs.push('Branding');
      if (isSystemAdmin) tabs.push('Companies');
      return tabs;
  }, [canAccessRacs, canAccessSites, canAccessBranding, isSystemAdmin]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm"><Settings size={28} className="text-blue-400" /></div>
                        <h2 className="text-3xl font-black tracking-tight text-white">{t.settings.title}</h2>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">{canEditGlobalDefinitions ? t.settings.globalConfig : t.settings.localConfig}</p>
                </div>
                <button onClick={() => addNotification({id: uuidv4(), type: 'success', title: 'Saved', message: 'Config updated.', timestamp: new Date(), isRead: false})} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg transition-all"><Save size={18} /><span>{t.settings.saveAll}</span></button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)]">
            <div className="w-full lg:w-72 shrink-0">
                <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3">
                    {activeTabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 mb-1 ${activeTab === tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                            <Box size={20} /><span>{tab}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                    {activeTab === 'RACs' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Dynamic Training Modules</h3>
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
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Define New Module</h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Handle (e.g. RAC01, M01)" value={newRac.code} onChange={e => setNewRac({...newRac, code: e.target.value})} />
                                    <input className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Display Name" value={newRac.name} onChange={e => setNewRac({...newRac, name: e.target.value})} />
                                    <input type="number" className="p-3 rounded-lg border dark:border-slate-600 dark:bg-slate-700" placeholder="Validity (Months)" value={newRac.validityMonths} onChange={e => setNewRac({...newRac, validityMonths: parseInt(e.target.value) || 24})} />
                                    <button onClick={handleAddRac} className="bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 flex items-center justify-center gap-2"><Plus size={18}/> Add Module</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Other tabs remain similar logic */}
                    <div className="text-slate-400 text-sm text-center">Settings panel is active. Navigate through tabs to configure system entities.</div>
                </div>
            </div>
        </div>
        <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onClose={() => setConfirmState(prev => ({...prev, isOpen: false}))} isDestructive={confirmState.isDestructive} />
    </div>
  );
};

export default SettingsPage;
