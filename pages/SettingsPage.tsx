
import React, { useState } from 'react';
import { Settings, Users, Box, Save, Plus, Trash2, Tag, Edit2, Check, X, AlertCircle, Sliders, MapPin, User as UserIcon, Hash, LayoutGrid, Building2, Map, ShieldCheck, Mail } from 'lucide-react';
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
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    racDefinitions, onUpdateRacs, 
    rooms, onUpdateRooms, 
    trainers, onUpdateTrainers,
    sites = [], onUpdateSites,
    companies = [], onUpdateCompanies,
    userRole = UserRole.SYSTEM_ADMIN,
    users = [], onUpdateUsers
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'General' | 'Trainers' | 'RACs' | 'Sites' | 'Companies'>('General');
  const [isSaving, setIsSaving] = useState(false);

  // Confirmation Modal State
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
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [editSiteData, setEditSiteData] = useState<Partial<Site>>({});

  const handleAddSite = () => {
      if (!newSite.name || !onUpdateSites) return;
      const site: Site = {
          id: uuidv4(),
          companyId: 'c1', // Default to Vulcan for mock
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
          message: 'This will remove the site from the system. Linked data may become inaccessible.',
          onConfirm: () => onUpdateSites(sites.filter(s => s.id !== id)),
          isDestructive: true
      });
  };

  // --- COMPANIES CRUD & AUTO-PROVISIONING ---
  const [newCompany, setNewCompany] = useState({ name: '', adminName: '', adminEmail: '' });
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  const handleAddCompany = () => {
      if (!newCompany.name || !onUpdateCompanies || !onUpdateSites || !onUpdateUsers) {
          alert("Internal Error: Missing update functions");
          return;
      }
      
      if (!newCompany.adminName || !newCompany.adminEmail) {
          alert("Please provide Admin details to provision the enterprise.");
          return;
      }

      // 1. Create Company
      const companyId = uuidv4();
      const company: Company = {
          id: companyId,
          name: newCompany.name,
          status: 'Active'
      };

      // 2. Create Default Site
      const siteId = uuidv4();
      const defaultSite: Site = {
          id: siteId,
          companyId: companyId,
          name: 'Main Headquarters',
          location: 'Primary Location',
          mandatoryRacs: []
      };

      // 3. Create Enterprise Admin User
      const adminUser: User = {
          id: Date.now(), // Simple ID
          name: newCompany.adminName,
          email: newCompany.adminEmail,
          role: UserRole.ENTERPRISE_ADMIN,
          status: 'Active',
          company: newCompany.name,
          jobTitle: 'Enterprise Administrator'
      };

      // Execute Updates
      onUpdateCompanies([...companies, company]);
      onUpdateSites([...sites, defaultSite]);
      onUpdateUsers([...users, adminUser]);

      setNewCompany({ name: '', adminName: '', adminEmail: '' });
      setProvisionSuccess(`Enterprise "${company.name}" provisioned successfully. Admin "${adminUser.name}" created with AI & Reporting access.`);
      
      setTimeout(() => setProvisionSuccess(null), 5000);
  };

  // ... existing CRUD handlers ...
  // --- ROOMS CRUD ---
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 0 });
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editRoomData, setEditRoomData] = useState<Partial<Room>>({});

  const handleAddRoom = () => {
      if (!newRoom.name) return;
      const room: Room = {
          id: uuidv4(),
          name: newRoom.name,
          capacity: newRoom.capacity > 0 ? newRoom.capacity : 20
      };
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
          message: 'Are you sure you want to delete this room configuration?',
          onConfirm: () => onUpdateRooms(rooms.filter(r => r.id !== id)),
          isDestructive: true
      });
  };


  // --- TRAINERS STATE & CRUD ---
  const [newTrainer, setNewTrainer] = useState({ name: '', racs: '' });
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const [editTrainerData, setEditTrainerData] = useState<{name: string, racs: string}>({ name: '', racs: '' });

  const handleAddTrainer = () => {
      if (!newTrainer.name) return;
      const racList = newTrainer.racs.split(',').map(s => s.trim()).filter(s => s);
      const trainer: Trainer = {
          id: uuidv4(),
          name: newTrainer.name,
          racs: racList.length > 0 ? racList : ['General']
      };
      onUpdateTrainers([...trainers, trainer]);
      setNewTrainer({ name: '', racs: '' });
  };

  const startEditTrainer = (trainer: Trainer) => {
      setEditingTrainerId(trainer.id);
      setEditTrainerData({ name: trainer.name, racs: trainer.racs.join(', ') });
  };

  const saveTrainer = () => {
      if (editingTrainerId && editTrainerData.name) {
          const racList = editTrainerData.racs.split(',').map(s => s.trim()).filter(s => s);
          onUpdateTrainers(trainers.map(t => t.id === editingTrainerId ? { ...t, name: editTrainerData.name, racs: racList } : t));
          setEditingTrainerId(null);
      }
  };

  const deleteTrainer = (id: string) => {
      setConfirmState({
          isOpen: true,
          title: 'Delete Trainer?',
          message: 'Are you sure you want to remove this trainer from the system?',
          onConfirm: () => onUpdateTrainers(trainers.filter(t => t.id !== id)),
          isDestructive: true
      });
  };


  // --- RACS STATE & CRUD (Now using Props) ---
  const [newRac, setNewRac] = useState({ code: '', name: '' });
  const [editingRacId, setEditingRacId] = useState<string | null>(null);
  const [editRacData, setEditRacData] = useState<Partial<RacDef>>({});

  const handleAddRac = () => {
      if (!newRac.code || !newRac.name) return;
      const rac: RacDef = {
          id: uuidv4(),
          code: newRac.code,
          name: newRac.name
      };
      onUpdateRacs([...racDefinitions, rac]);
      setNewRac({ code: '', name: '' });
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
          message: 'Warning: Deleting this RAC Definition will affect the database matrix columns. Are you sure?',
          onConfirm: () => onUpdateRacs(racDefinitions.filter(r => r.id !== id)),
          isDestructive: true
      });
  };
  
  const handleGlobalSave = () => {
      setIsSaving(true);
      // Simulate API delay and logging
      logger.audit('System Configuration Updated', 'Current Admin User', {
          roomsCount: rooms.length,
          trainersCount: trainers.length,
          racsCount: racDefinitions.length
      });
      
      setTimeout(() => {
          setIsSaving(false);
          alert('Configuration saved successfully to production database.');
      }, 800);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up relative h-full">
        {/* --- HERO HEADER --- */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
            <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                <Sliders size={400} />
            </div>
            {/* Ambient Glow */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                            <Settings size={28} className="text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-white">
                            {t.settings.title}
                        </h2>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">
                        {t.settings.subtitle}
                    </p>
                </div>
                
                <div className="flex gap-2 text-xs font-mono text-slate-500 bg-black/20 p-2 rounded-lg border border-white/5">
                    <span>v2.5.0</span>
                    <span className="text-slate-700">|</span>
                    <span className="text-green-500">SYSTEM ONLINE</span>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)]">
            
            {/* --- NAVIGATION SIDEBAR --- */}
            <div className="w-full lg:w-72 space-y-3 h-fit">
                <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3">
                    <button 
                        onClick={() => setActiveTab('General')}
                        className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group
                            ${activeTab === 'General' 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}
                        `}
                    >
                        <Box size={20} className={activeTab === 'General' ? 'text-white' : 'text-slate-400 group-hover:text-blue-500 transition-colors'} />
                        <div className="flex flex-col">
                            <span>{t.settings.tabs.general}</span>
                            <span className={`text-[10px] font-normal ${activeTab === 'General' ? 'text-blue-100' : 'text-slate-400'}`}>Locations & Capacity</span>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('Trainers')}
                        className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2
                            ${activeTab === 'Trainers' 
                                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 transform scale-[1.02]' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}
                        `}
                    >
                        <Users size={20} className={activeTab === 'Trainers' ? 'text-white' : 'text-slate-400 group-hover:text-purple-500 transition-colors'} />
                        <div className="flex flex-col">
                            <span>{t.settings.tabs.trainers}</span>
                            <span className={`text-[10px] font-normal ${activeTab === 'Trainers' ? 'text-purple-100' : 'text-slate-400'}`}>Staff & Qualifications</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => setActiveTab('RACs')}
                        className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2
                            ${activeTab === 'RACs' 
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 transform scale-[1.02]' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}
                        `}
                    >
                        <Tag size={20} className={activeTab === 'RACs' ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500 transition-colors'} />
                        <div className="flex flex-col">
                            <span>{t.settings.tabs.racs}</span>
                            <span className={`text-[10px] font-normal ${activeTab === 'RACs' ? 'text-emerald-100' : 'text-slate-400'}`}>Module Definitions</span>
                        </div>
                    </button>

                    {/* NEW: SITES (RAC Admin+) */}
                    {[UserRole.SYSTEM_ADMIN, UserRole.ENTERPRISE_ADMIN].includes(userRole!) && (
                        <button 
                            onClick={() => setActiveTab('Sites')}
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2
                                ${activeTab === 'Sites' 
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 transform scale-[1.02]' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}
                            `}
                        >
                            <Map size={20} className={activeTab === 'Sites' ? 'text-white' : 'text-slate-400 group-hover:text-orange-500 transition-colors'} />
                            <div className="flex flex-col">
                                <span>Operation Sites</span>
                                <span className={`text-[10px] font-normal ${activeTab === 'Sites' ? 'text-orange-100' : 'text-slate-400'}`}>Manage Locations</span>
                            </div>
                        </button>
                    )}

                    {/* NEW: COMPANIES (System Admin Only) */}
                    {userRole === UserRole.SYSTEM_ADMIN && (
                        <button 
                            onClick={() => setActiveTab('Companies')}
                            className={`w-full text-left px-4 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group mt-2
                                ${activeTab === 'Companies' 
                                    ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg transform scale-[1.02]' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}
                            `}
                        >
                            <Building2 size={20} className={activeTab === 'Companies' ? 'text-white' : 'text-slate-400 group-hover:text-gray-900 transition-colors'} />
                            <div className="flex flex-col">
                                <span>Companies</span>
                                <span className={`text-[10px] font-normal ${activeTab === 'Companies' ? 'text-gray-300' : 'text-slate-400'}`}>Tenants & Clients</span>
                            </div>
                        </button>
                    )}
                </nav>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">System Status</p>
                    <div className="flex justify-center gap-4">
                        <div className="text-center">
                            <div className="text-lg font-black text-slate-800 dark:text-white">{sites.length}</div>
                            <div className="text-[9px] text-slate-500">Sites</div>
                        </div>
                        <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="text-center">
                            <div className="text-lg font-black text-slate-800 dark:text-white">{trainers.length}</div>
                            <div className="text-[9px] text-slate-500">Trainers</div>
                        </div>
                        <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="text-center">
                            <div className="text-lg font-black text-slate-800 dark:text-white">{racDefinitions.length}</div>
                            <div className="text-[9px] text-slate-500">RACs</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden relative">
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                    {/* General Rooms Tab */}
                    {activeTab === 'General' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.settings.rooms.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage physical locations and capacity limits.</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-800 flex items-center gap-2">
                                    <AlertCircle size={14} /> Capacity Limits Active
                                </div>
                            </div>

                            {/* Create Room Card */}
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-600 mb-8 flex flex-col md:flex-row gap-4 items-end shadow-sm">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <MapPin size={12} /> {t.settings.rooms.new}
                                    </label>
                                    <input 
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all" 
                                        placeholder="e.g. Training Lab 4"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <Users size={12} /> Cap
                                    </label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all text-center" 
                                        placeholder="20"
                                        value={newRoom.capacity || ''}
                                        onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                                <button 
                                    onClick={handleAddRoom}
                                    className="w-full md:w-auto bg-slate-900 dark:bg-blue-600 text-white p-3 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Rooms List */}
                            <div className="grid gap-3">
                                {rooms.map(room => (
                                    <div key={room.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                <Box size={18} />
                                            </div>
                                            {editingRoomId === room.id ? (
                                                <input 
                                                    className="border-b-2 border-blue-500 bg-transparent px-1 py-0.5 text-sm font-bold text-slate-900 dark:text-white outline-none w-full"
                                                    value={String(editRoomData.name)}
                                                    onChange={(e) => setEditRoomData({...editRoomData, name: e.target.value})}
                                                    autoFocus
                                                />
                                            ) : (
                                                <div>
                                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{room.name}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Location ID: {room.id.substring(0,6)}</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center">
                                                {editingRoomId === room.id ? (
                                                    <input 
                                                        type="number"
                                                        className="border-b-2 border-blue-500 bg-transparent text-center text-sm font-bold w-12 outline-none text-slate-900 dark:text-white"
                                                        value={String(editRoomData.capacity)}
                                                        onChange={(e) => setEditRoomData({...editRoomData, capacity: parseInt(e.target.value) || 0})}
                                                    />
                                                ) : (
                                                    <span className="text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 min-w-[3rem] text-center">
                                                        {room.capacity}
                                                    </span>
                                                )}
                                                <span className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase">Seats</span>
                                            </div>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {editingRoomId === room.id ? (
                                                    <>
                                                        <button onClick={saveRoom} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={16}/></button>
                                                        <button onClick={() => setEditingRoomId(null)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"><X size={16}/></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEditRoom(room)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"><Edit2 size={16}/></button>
                                                        <button onClick={() => deleteRoom(room.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trainers Tab */}
                    {activeTab === 'Trainers' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                             <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.settings.trainers.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authorize personnel to conduct specific training modules.</p>
                                </div>
                             </div>

                             {/* Create Trainer Form */}
                             <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-600 mb-8 flex flex-col md:flex-row gap-4 items-end shadow-sm">
                                <div className="w-full md:w-1/3">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <UserIcon size={12} /> {t.settings.trainers.new}
                                    </label>
                                    <input 
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all" 
                                        placeholder="Full Name"
                                        value={newTrainer.name}
                                        onChange={(e) => setNewTrainer({...newTrainer, name: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <Tag size={12} /> {t.settings.trainers.qualifiedRacs}
                                    </label>
                                    <input 
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all" 
                                        placeholder="e.g. RAC01, RAC02"
                                        value={newTrainer.racs}
                                        onChange={(e) => setNewTrainer({...newTrainer, racs: e.target.value})}
                                    />
                                </div>
                                <button 
                                    onClick={handleAddTrainer}
                                    className="w-full md:w-auto bg-slate-900 dark:bg-purple-600 text-white p-3 rounded-xl hover:bg-slate-800 dark:hover:bg-purple-500 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Trainers List */}
                            <div className="grid gap-3">
                                {trainers.map(trainer => (
                                    <div key={trainer.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-500 hover:shadow-md transition-all gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-sm border border-purple-100 dark:border-purple-800">
                                                {trainer.name.charAt(0)}
                                            </div>
                                            {editingTrainerId === trainer.id ? (
                                                <input 
                                                    className="border-b-2 border-purple-500 bg-transparent px-1 py-0.5 text-sm font-bold text-slate-900 dark:text-white outline-none w-full"
                                                    value={String(editTrainerData.name)}
                                                    onChange={(e) => setEditTrainerData({...editTrainerData, name: e.target.value})}
                                                    autoFocus
                                                />
                                            ) : (
                                                <div className="font-bold text-slate-800 dark:text-white text-sm">{trainer.name}</div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {editingTrainerId === trainer.id ? (
                                                <input 
                                                    className="border-b-2 border-purple-500 bg-transparent px-1 py-0.5 text-sm w-full outline-none text-slate-900 dark:text-white"
                                                    placeholder="RAC01, RAC02"
                                                    value={String(editTrainerData.racs)}
                                                    onChange={(e) => setEditTrainerData({...editTrainerData, racs: e.target.value})}
                                                />
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {trainer.racs.map(r => (
                                                        <span key={r} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                                            {r}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-center">
                                            {editingTrainerId === trainer.id ? (
                                                <>
                                                    <button onClick={saveTrainer} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={16}/></button>
                                                    <button onClick={() => setEditingTrainerId(null)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"><X size={16}/></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEditTrainer(trainer)} className="p-2 hover:bg-purple-50 text-slate-400 hover:text-purple-600 rounded-lg transition-colors"><Edit2 size={16}/></button>
                                                    <button onClick={() => deleteTrainer(trainer.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* RACs Tab */}
                    {activeTab === 'RACs' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.settings.racs.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define training modules. Changes here affect the database matrix.</p>
                                </div>
                            </div>
                            
                            {/* Create RAC Form */}
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-600 mb-8 flex flex-col md:flex-row gap-4 items-end shadow-sm">
                                <div className="w-32">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <Hash size={12} /> {t.settings.racs.code}
                                    </label>
                                    <input 
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-mono font-semibold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all uppercase" 
                                        placeholder="RAC11" 
                                        value={newRac.code}
                                        onChange={(e) => setNewRac({...newRac, code: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <LayoutGrid size={12} /> {t.settings.racs.description}
                                    </label>
                                    <input 
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all" 
                                        placeholder="Hazard Description" 
                                        value={newRac.name}
                                        onChange={(e) => setNewRac({...newRac, name: e.target.value})}
                                    />
                                </div>
                                <button 
                                    onClick={handleAddRac}
                                    className="w-full md:w-auto bg-slate-900 dark:bg-emerald-600 text-white p-3 rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* RAC List */}
                            <div className="grid gap-3">
                                {racDefinitions.map(rac => (
                                    <div key={rac.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500 hover:shadow-md transition-all gap-4">
                                        <div className="w-32 flex-shrink-0">
                                             {editingRacId === rac.id ? (
                                                <input 
                                                    className="border-b-2 border-emerald-500 bg-transparent px-1 py-0.5 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none w-full uppercase"
                                                    value={String(editRacData.code)}
                                                    onChange={(e) => setEditRacData({...editRacData, code: e.target.value})}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800 block w-fit text-center">
                                                    {rac.code}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {editingRacId === rac.id ? (
                                                <input 
                                                    className="border-b-2 border-emerald-500 bg-transparent px-1 py-0.5 text-sm font-bold text-slate-900 dark:text-white outline-none w-full"
                                                    value={String(editRacData.name)}
                                                    onChange={(e) => setEditRacData({...editRacData, name: e.target.value})}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{rac.name}</div>
                                            )}
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {editingRacId === rac.id ? (
                                                <>
                                                    <button onClick={saveRac} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={16}/></button>
                                                    <button onClick={() => setEditingRacId(null)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"><X size={16}/></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEditRac(rac)} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"><Edit2 size={16}/></button>
                                                    <button onClick={() => deleteRac(rac.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SITES Tab */}
                    {activeTab === 'Sites' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Operation Sites</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage physical locations for the organization.</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-600 mb-8 flex flex-col md:flex-row gap-4 items-end shadow-sm">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <Building2 size={12} /> Site Name
                                    </label>
                                    <input 
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none text-slate-800 dark:text-white transition-all" 
                                        placeholder="e.g. Moatize Mine"
                                        value={newSite.name}
                                        onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                                    />
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                        <MapPin size={12} /> Location
                                    </label>
                                    <input 
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none text-slate-800 dark:text-white transition-all" 
                                        placeholder="City/Region"
                                        value={newSite.location}
                                        onChange={(e) => setNewSite({...newSite, location: e.target.value})}
                                    />
                                </div>
                                <button 
                                    onClick={handleAddSite}
                                    className="w-full md:w-auto bg-slate-900 dark:bg-orange-600 text-white p-3 rounded-xl hover:bg-slate-800 dark:hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="grid gap-3">
                                {sites.map(site => (
                                    <div key={site.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-500 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-300 border border-orange-100 dark:border-orange-800">
                                                <Map size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white text-sm">{site.name}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wide">{site.location}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => deleteSite(site.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* COMPANIES Tab (System Admin Only) */}
                    {activeTab === 'Companies' && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tenant Companies</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage client organizations and provision initial admins.</p>
                                </div>
                            </div>

                            {/* Provision Success Message */}
                            {provisionSuccess && (
                                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl flex items-center gap-3 animate-fade-in-down">
                                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-300">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-sm text-green-800 dark:text-green-300 font-medium">
                                        {provisionSuccess}
                                    </div>
                                </div>
                            )}

                            {/* Add Company Form */}
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-600 mb-8 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Building2 size={14} /> New Enterprise Provisioning
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block ml-1">Company Name</label>
                                        <input 
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-gray-500 outline-none text-slate-800 dark:text-white transition-all" 
                                            placeholder="e.g. Acme Corp"
                                            value={newCompany.name}
                                            onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block ml-1">Admin Name</label>
                                        <input 
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-gray-500 outline-none text-slate-800 dark:text-white transition-all" 
                                            placeholder="Full Name"
                                            value={newCompany.adminName}
                                            onChange={(e) => setNewCompany({...newCompany, adminName: e.target.value})}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block ml-1">Admin Email</label>
                                        <div className="relative">
                                            <input 
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 pl-10 text-sm font-semibold focus:ring-2 focus:ring-gray-500 outline-none text-slate-800 dark:text-white transition-all" 
                                                placeholder="admin@company.com"
                                                value={newCompany.adminEmail}
                                                onChange={(e) => setNewCompany({...newCompany, adminEmail: e.target.value})}
                                            />
                                            <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={handleAddCompany}
                                        className="w-full md:w-auto bg-slate-900 dark:bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-gray-500 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 font-bold text-sm"
                                    >
                                        <Plus size={18} /> Provision Enterprise
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {companies.map(comp => (
                                    <div key={comp.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                <Building2 size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white text-sm">{comp.name}</div>
                                                <div className="text-[10px] text-green-500 uppercase tracking-wide font-bold">{comp.status}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
                
                {/* Global Save Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 flex justify-end backdrop-blur-md sticky bottom-0 z-20">
                    <button 
                        onClick={handleGlobalSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold shadow-xl transition-all transform hover:-translate-y-1
                          ${isSaving ? 'opacity-70 cursor-wait' : 'hover:bg-slate-800 hover:shadow-2xl'}
                        `}
                    >
                        {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" /> : <Save size={20} />}
                        <span className="tracking-wide">{isSaving ? t.settings.saving : t.settings.saveAll}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* --- CONFIRMATION MODAL --- */}
        <ConfirmModal 
            isOpen={confirmState.isOpen}
            title={confirmState.title}
            message={confirmState.message}
            onConfirm={confirmState.onConfirm}
            onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
            isDestructive={confirmState.isDestructive}
            confirmText="Delete"
        />
    </div>
  );
};

export default SettingsPage;
