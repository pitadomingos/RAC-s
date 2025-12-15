
import React, { useState } from 'react';
import { Settings, Users, Box, Save, Plus, Trash2, Tag, Edit2, Check, X, AlertCircle, Sliders, MapPin, User as UserIcon, Hash, LayoutGrid, Building2, Map, ShieldCheck, Mail, Lock, Calendar, MessageSquare, Clock } from 'lucide-react';
import { RacDef, Room, Trainer, Site, Company, UserRole, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
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
    users?: User[];
    onUpdateUsers?: (newUsers: User[]) => void;
    feedbackConfig?: { mode: string, expiry: string | null };
    onUpdateFeedbackConfig?: (mode: string) => void;
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
    onUpdateFeedbackConfig
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'General' | 'Trainers' | 'RACs' | 'Sites' | 'Companies'>('General');
  const [isSaving, setIsSaving] = useState(false);

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

  // --- SITES CRUD ---
  const [newSite, setNewSite] = useState({ name: '', location: '' });

  const handleAddSite = () => {
      if (!newSite.name || !onUpdateSites) return;
      const site: Site = {
          id: uuidv4(),
          companyId: 'c1',
          name: newSite.name,
          location: newSite.location || 'Unknown'
      };
      onUpdateSites([...sites, site]);
      setNewSite({ name: '', location: '' });
  };

  const deleteSite = (id: string) => {
      if (!onUpdateSites) return;
      setConfirmState({
          isOpen: true,
          title: 'Delete Site?',
          message: 'This will remove the site from the system.',
          onConfirm: () => onUpdateSites(sites.filter(s => s.id !== id)),
          isDestructive: true
      });
  };

  // --- COMPANIES CRUD ---
  const [newCompany, setNewCompany] = useState({ name: '', adminName: '', adminEmail: '' });
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  const handleAddCompany = () => {
      if (!newCompany.name || !onUpdateCompanies || !onUpdateSites || !onUpdateUsers) return;
      if (!newCompany.adminName || !newCompany.adminEmail) {
          alert("Please provide Admin details.");
          return;
      }

      const companyId = uuidv4();
      const company: Company = { id: companyId, name: newCompany.name, status: 'Active' };
      const siteId = uuidv4();
      const defaultSite: Site = { id: siteId, companyId: companyId, name: 'Main Headquarters', location: 'Primary Location', mandatoryRacs: [] };
      const adminUser: User = {
          id: Date.now(),
          name: newCompany.adminName,
          email: newCompany.adminEmail,
          role: UserRole.ENTERPRISE_ADMIN,
          status: 'Active',
          company: newCompany.name,
          jobTitle: 'Enterprise Administrator'
      };

      onUpdateCompanies([...companies, company]);
      onUpdateSites([...sites, defaultSite]);
      onUpdateUsers([...users, adminUser]);

      setNewCompany({ name: '', adminName: '', adminEmail: '' });
      setProvisionSuccess(`Enterprise "${company.name}" provisioned successfully.`);
      setTimeout(() => setProvisionSuccess(null), 5000);
  };

  // --- ROOMS CRUD ---
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 0 });
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editRoomData, setEditRoomData] = useState<Partial<Room>>({});

  const handleAddRoom = () => {
      if (!newRoom.name) return;
      const room: Room = { id: uuidv4(), name: newRoom.name, capacity: newRoom.capacity > 0 ? newRoom.capacity : 20 };
      onUpdateRooms([...rooms, room]);
      setNewRoom({ name: '', capacity: 0 });
  };

  const startEditRoom = (room: Room) => {
      setEditingRoomId(room.id);
      setEditRoomData(room);
  };

  const saveRoom = () => {
      if (editingRoomId && editRoomData.name) {
          onUpdateRooms(rooms.map(r => r.id === editingRoomId ? { ...r, ...editRoomData } as Room : r));
          setEditingRoomId(null);
      }
  };

  const deleteRoom = (id: string) => {
      setConfirmState({
          isOpen: true,
          title: 'Delete Room?',
          message: 'Are you sure?',
          onConfirm: () => onUpdateRooms(rooms.filter(r => r.id !== id)),
          isDestructive: true
      });
  };

  // --- TRAINERS CRUD ---
  const [newTrainer, setNewTrainer] = useState<{name: string, racs: string[]}>({ name: '', racs: [] });
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const [editTrainerData, setEditTrainerData] = useState<{name: string, racs: string[]}>({ name: '', racs: [] });

  const toggleNewTrainerRac = (racCode: string) => {
      setNewTrainer(prev => ({
          ...prev,
          racs: prev.racs.includes(racCode) ? prev.racs.filter(r => r !== racCode) : [...prev.racs, racCode]
      }));
  };

  const toggleEditTrainerRac = (racCode: string) => {
      setEditTrainerData(prev => ({
          ...prev,
          racs: prev.racs.includes(racCode) ? prev.racs.filter(r => r !== racCode) : [...prev.racs, racCode]
      }));
  };

  const handleAddTrainer = () => {
      if (!newTrainer.name) return;
      const trainer: Trainer = { id: uuidv4(), name: newTrainer.name, racs: newTrainer.racs };
      onUpdateTrainers([...trainers, trainer]);
      setNewTrainer({ name: '', racs: [] });
  };

  const startEditTrainer = (trainer: Trainer) => {
      setEditingTrainerId(trainer.id);
      setEditTrainerData({ name: trainer.name, racs: trainer.racs });
  };

  const saveTrainer = () => {
      if (editingTrainerId && editTrainerData.name) {
          onUpdateTrainers(trainers.map(t => t.id === editingTrainerId ? { ...t, name: editTrainerData.name, racs: editTrainerData.racs } : t));
          setEditingTrainerId(null);
      }
  };

  const deleteTrainer = (id: string) => {
      setConfirmState({
          isOpen: true,
          title: 'Delete Trainer?',
          message: 'Are you sure?',
          onConfirm: () => onUpdateTrainers(trainers.filter(t => t.id !== id)),
          isDestructive: true
      });
  };

  // --- RACS CRUD ---
  const [newRac, setNewRac] = useState({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true });
  const [editingRacId, setEditingRacId] = useState<string | null>(null);
  const [editRacData, setEditRacData] = useState<Partial<RacDef>>({});

  const handleAddRac = () => {
      if (!newRac.code || !newRac.name) return;
      const rac: RacDef = {
          id: uuidv4(),
          code: newRac.code,
          name: newRac.name,
          validityMonths: newRac.validityMonths || 24,
          requiresDriverLicense: newRac.requiresDriverLicense,
          requiresPractical: newRac.requiresPractical
      };
      onUpdateRacs([...racDefinitions, rac]);
      setNewRac({ code: '', name: '', validityMonths: 24, requiresDriverLicense: false, requiresPractical: true });
  };

  const startEditRac = (rac: RacDef) => {
      setEditingRacId(rac.id);
      setEditRacData(rac);
  };

  const saveRac = () => {
      if (editingRacId && editRacData.code) {
          onUpdateRacs(racDefinitions.map(r => r.id === editingRacId ? { ...r, ...editRacData } as RacDef : r));
          setEditingRacId(null);
      }
  };

  const deleteRac = (id: string) => {
      setConfirmState({
          isOpen: true,
          title: 'Delete RAC Definition?',
          message: 'Deleting this will affect matrix columns.',
          onConfirm: () => onUpdateRacs(racDefinitions.filter(r => r.id !== id)),
          isDestructive: true
      });
  };
  
  const handleGlobalSave = () => {
      setIsSaving(true);
      setTimeout(() => {
          setIsSaving(false);
          alert('Configuration saved.');
      }, 800);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up relative h-full">
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
                        {canEditGlobalDefinitions ? "Global System Configuration & Source of Truth" : "Local Operational Settings"}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)]">
            
            {/* Sidebar */}
            <div className="w-full lg:w-72 space-y-3 h-fit">
                <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3">
                    <button 
                        onClick={() => setActiveTab('General')}
                        className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group ${activeTab === 'General' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                    >
                        <Box size={20} />
                        <span>{t.settings.tabs.general}</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('Trainers')}
                        className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2 ${activeTab === 'Trainers' ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                    >
                        <Users size={20} />
                        <span>{t.settings.tabs.trainers}</span>
                    </button>

                    {canEditGlobalDefinitions && (
                        <button 
                            onClick={() => setActiveTab('RACs')}
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2 ${activeTab === 'RACs' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            <Tag size={20} />
                            <span>{t.settings.tabs.racs}</span>
                        </button>
                    )}

                    {canEditGlobalDefinitions && (
                        <button 
                            onClick={() => setActiveTab('Sites')}
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2 ${activeTab === 'Sites' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            <Map size={20} />
                            <span>Operation Sites</span>
                        </button>
                    )}

                    {isSystemAdmin && (
                        <button 
                            onClick={() => setActiveTab('Companies')}
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2 ${activeTab === 'Companies' ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            <Building2 size={20} />
                            <span>Companies</span>
                        </button>
                    )}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                    
                    {activeTab === 'General' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.settings.rooms.title}</h3>
                            
                            {(isSystemAdmin || isEnterpriseAdmin) && (
                                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200 dark:border-slate-600">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Feedback Config</h4>
                                    <div className="flex gap-2">
                                        {['disabled', '1_week', '1_month', 'always'].map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => onUpdateFeedbackConfig && onUpdateFeedbackConfig(m)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all capitalize ${feedbackConfig.mode === m ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-600 text-slate-500 dark:text-slate-300'}`}
                                            >
                                                {m.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl mb-8 flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">New Room</label>
                                    <input className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} placeholder="Room Name" />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cap</label>
                                    <input type="number" className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})} placeholder="20" />
                                </div>
                                <button onClick={handleAddRoom} className="bg-slate-900 dark:bg-blue-600 text-white p-3 rounded-xl"><Plus size={20}/></button>
                            </div>

                            <div className="grid gap-3">
                                {rooms.map(room => (
                                    <div key={room.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border rounded-xl">
                                        {editingRoomId === room.id ? (
                                            <div className="flex gap-2">
                                                <input className="border p-1 rounded" value={editRoomData.name} onChange={e => setEditRoomData({...editRoomData, name: e.target.value})} />
                                                <input type="number" className="border p-1 rounded w-20" value={editRoomData.capacity} onChange={e => setEditRoomData({...editRoomData, capacity: parseInt(e.target.value)})} />
                                                <button onClick={saveRoom}><Check size={16}/></button>
                                                <button onClick={() => setEditingRoomId(null)}><X size={16}/></button>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-800 dark:text-white">{room.name}</div>
                                                    <div className="text-xs text-slate-500">Cap: {room.capacity}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => startEditRoom(room)} className="text-slate-400 hover:text-blue-500"><Edit2 size={16}/></button>
                                                    <button onClick={() => deleteRoom(room.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Trainers' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.settings.trainers.title}</h3>
                             <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl mb-8">
                                <div className="flex gap-4 mb-4">
                                    <input className="flex-1 bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newTrainer.name} onChange={e => setNewTrainer({...newTrainer, name: e.target.value})} placeholder="Trainer Name" />
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {racDefinitions.map(rac => (
                                        <button key={rac.id} onClick={() => toggleNewTrainerRac(rac.code)} className={`px-2 py-1 text-xs border rounded ${newTrainer.racs.includes(rac.code) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{rac.code}</button>
                                    ))}
                                </div>
                                <button onClick={handleAddTrainer} className="bg-slate-900 dark:bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Add Trainer</button>
                             </div>
                             <div className="grid gap-3">
                                {trainers.map(trainer => (
                                    <div key={trainer.id} className="p-4 bg-white dark:bg-slate-800 border rounded-xl flex justify-between">
                                        <div>
                                            <div className="font-bold text-slate-800 dark:text-white">{trainer.name}</div>
                                            <div className="flex gap-1 mt-1">{trainer.racs.map(r => <span key={r} className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1 rounded">{r}</span>)}</div>
                                        </div>
                                        <button onClick={() => deleteTrainer(trainer.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {activeTab === 'RACs' && canEditGlobalDefinitions && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.settings.racs.title}</h3>
                             <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl mb-8">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input className="bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newRac.code} onChange={e => setNewRac({...newRac, code: e.target.value})} placeholder="Code (e.g. RAC01)" />
                                    <input className="bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newRac.name} onChange={e => setNewRac({...newRac, name: e.target.value})} placeholder="Description" />
                                </div>
                                <div className="flex gap-6 items-center mb-4">
                                    <div className="w-32">
                                        <label className="text-xs block mb-1">Validity (Mo)</label>
                                        <input type="number" className="w-full bg-white dark:bg-slate-800 border rounded-xl p-2 text-sm" value={newRac.validityMonths} onChange={e => setNewRac({...newRac, validityMonths: parseInt(e.target.value)})} />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newRac.requiresDriverLicense} onChange={e => setNewRac({...newRac, requiresDriverLicense: e.target.checked})} /> Requires DL</label>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newRac.requiresPractical} onChange={e => setNewRac({...newRac, requiresPractical: e.target.checked})} /> Practical Exam</label>
                                </div>
                                <button onClick={handleAddRac} className="bg-slate-900 dark:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Add RAC</button>
                             </div>
                             <div className="grid gap-3">
                                {racDefinitions.map(rac => (
                                    <div key={rac.id} className="p-4 bg-white dark:bg-slate-800 border rounded-xl flex justify-between items-center">
                                        <div>
                                            <div className="flex gap-2 items-center">
                                                <span className="font-mono font-bold text-slate-800 dark:text-white">{rac.code}</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">{rac.name}</span>
                                            </div>
                                            <div className="flex gap-3 mt-1 text-[10px] text-slate-400 font-bold uppercase">
                                                <span>{rac.validityMonths} Months</span>
                                                {rac.requiresDriverLicense && <span className="text-red-500">Requires DL</span>}
                                                {rac.requiresPractical && <span className="text-blue-500">Practical</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEditRac(rac)} className="text-slate-400 hover:text-blue-500"><Edit2 size={16}/></button>
                                            <button onClick={() => deleteRac(rac.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {activeTab === 'Sites' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Sites</h3>
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl mb-8 flex gap-4 items-end">
                                <input className="flex-1 bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} placeholder="Site Name" />
                                <input className="flex-1 bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newSite.location} onChange={e => setNewSite({...newSite, location: e.target.value})} placeholder="Location" />
                                <button onClick={handleAddSite} className="bg-slate-900 dark:bg-orange-600 text-white p-3 rounded-xl"><Plus size={20}/></button>
                            </div>
                            <div className="grid gap-3">
                                {sites.map(s => (
                                    <div key={s.id} className="p-4 bg-white dark:bg-slate-800 border rounded-xl flex justify-between">
                                        <div><div className="font-bold text-slate-800 dark:text-white">{s.name}</div><div className="text-xs text-slate-500">{s.location}</div></div>
                                        <button onClick={() => deleteSite(s.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Companies' && isSystemAdmin && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Companies</h3>
                            {provisionSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{provisionSuccess}</div>}
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl mb-8 space-y-4">
                                <input className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} placeholder="Company Name" />
                                <div className="flex gap-4">
                                    <input className="flex-1 bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newCompany.adminName} onChange={e => setNewCompany({...newCompany, adminName: e.target.value})} placeholder="Admin Name" />
                                    <input className="flex-1 bg-white dark:bg-slate-800 border rounded-xl p-3 text-sm" value={newCompany.adminEmail} onChange={e => setNewCompany({...newCompany, adminEmail: e.target.value})} placeholder="Admin Email" />
                                </div>
                                <button onClick={handleAddCompany} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-3 rounded-xl font-bold text-sm">Provision</button>
                            </div>
                            <div className="grid gap-3">
                                {companies.map(c => (
                                    <div key={c.id} className="p-4 bg-white dark:bg-slate-800 border rounded-xl flex justify-between">
                                        <div className="font-bold text-slate-800 dark:text-white">{c.name}</div>
                                        <span className="text-xs text-green-500 font-bold">{c.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 flex justify-end">
                    <button onClick={handleGlobalSave} disabled={isSaving} className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all">
                        <Save size={20} /> {isSaving ? t.settings.saving : t.settings.saveAll}
                    </button>
                </div>
            </div>
        </div>
        <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onClose={() => setConfirmState(prev => ({...prev, isOpen: false}))} isDestructive={confirmState.isDestructive} />
    </div>
  );
};

export default SettingsPage;
