
import React, { useState, useEffect } from 'react';
import { Site, RacDef, Booking, EmployeeRequirement } from '../types';
import { Shield, CheckSquare, Save, Building2, MapPin, AlertCircle, Info, RefreshCw, ChevronDown, Plus, Edit2, Trash2, X, Hash, LayoutGrid, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { v4 as uuidv4 } from 'uuid';
import ConfirmModal from '../components/ConfirmModal';

interface SiteGovernancePageProps {
  sites: Site[];
  setSites: React.Dispatch<React.SetStateAction<Site[]>>;
  racDefinitions: RacDef[];
  onUpdateRacs: (racs: RacDef[]) => void;
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
}

const SiteGovernancePage: React.FC<SiteGovernancePageProps> = ({ 
    sites, setSites, racDefinitions, onUpdateRacs, bookings, requirements, updateRequirements 
}) => {
  const { t } = useLanguage();
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);

  // CRUD State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [siteForm, setSiteForm] = useState({ name: '', location: '' });

  // RAC CRUD State (New)
  const [isRacModalOpen, setIsRacModalOpen] = useState(false);
  const [newRac, setNewRac] = useState({ code: '', name: '' });
  const [editingRacId, setEditingRacId] = useState<string | null>(null);
  const [editRacData, setEditRacData] = useState<Partial<RacDef>>({});

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

  const selectedSite = sites.find(s => s.id === selectedSiteId);

  // Local state for the policy form
  const [localRequirements, setLocalRequirements] = useState<string[]>(
      selectedSite?.mandatoryRacs || []
  );

  useEffect(() => {
      if (selectedSite) {
          setLocalRequirements(selectedSite.mandatoryRacs || []);
      }
  }, [selectedSiteId, selectedSite, sites]);

  const toggleRac = (racCode: string) => {
      setLocalRequirements(prev => 
          prev.includes(racCode) 
            ? prev.filter(r => r !== racCode) 
            : [...prev, racCode]
      );
  };

  const handleSavePolicy = () => {
      if (!selectedSite) return;
      setIsSaving(true);

      // 1. Update Site Definition
      setSites(prev => prev.map(s => 
          s.id === selectedSiteId ? { ...s, mandatoryRacs: localRequirements } : s
      ));

      // 2. Simulate "Push Policy" to existing employees
      const siteEmployees = new Set<string>();
      bookings.forEach(b => {
          if (b.employee.siteId === selectedSiteId) siteEmployees.add(b.employee.id);
      });

      // Update their requirements matrix
      siteEmployees.forEach(empId => {
          const currentReq = requirements.find(r => r.employeeId === empId);
          if (currentReq) {
              const newRacs = { ...currentReq.requiredRacs };
              // Set mandatory ones to true
              localRequirements.forEach(code => {
                  newRacs[code] = true;
              });
              updateRequirements({ ...currentReq, requiredRacs: newRacs });
          }
      });

      setTimeout(() => {
          setIsSaving(false);
          const msg = t.siteGovernance.policyUpdate.replace('{site}', selectedSite.name);
          alert(`${msg} (${siteEmployees.size} employees)`);
      }, 800);
  };

  // --- SITE CRUD HANDLERS ---
  const openAddModal = () => {
      setSiteForm({ name: '', location: '' });
      setIsAddModalOpen(true);
  };

  const handleAddSite = () => {
      if (!siteForm.name) return;
      const newId = uuidv4();
      const newSite: Site = {
          id: newId,
          companyId: 'c1', // Default context
          name: siteForm.name,
          location: siteForm.location || 'Remote',
          mandatoryRacs: []
      };
      setSites(prev => [...prev, newSite]);
      setSelectedSiteId(newId);
      setIsAddModalOpen(false);
  };

  const openEditModal = () => {
      if (!selectedSite) return;
      setSiteForm({ name: selectedSite.name, location: selectedSite.location });
      setIsEditModalOpen(true);
  };

  const handleUpdateSite = () => {
      if (!selectedSite || !siteForm.name) return;
      setSites(prev => prev.map(s => s.id === selectedSite.id ? { ...s, ...siteForm } : s));
      setIsEditModalOpen(false);
  };

  const handleDeleteSite = () => {
      if (!selectedSite) return;
      setConfirmState({
          isOpen: true,
          title: 'Delete Site?',
          message: `Are you sure you want to delete ${selectedSite.name}? This will remove configuration for this location.`,
          onConfirm: () => {
              const remainingSites = sites.filter(s => s.id !== selectedSite.id);
              setSites(remainingSites);
              setSelectedSiteId(remainingSites.length > 0 ? remainingSites[0].id : '');
              setIsEditModalOpen(false);
          },
          isDestructive: true
      });
  };

  // --- RAC MODULE CRUD HANDLERS ---
  const handleAddRac = () => {
      if (!newRac.code || !newRac.name) return;
      const rac: RacDef = {
          id: uuidv4(),
          code: newRac.code.toUpperCase(),
          name: newRac.name
      };
      onUpdateRacs([...racDefinitions, rac]);
      setNewRac({ code: '', name: '' });
  };

  const handleSaveRacEdit = () => {
      if (editingRacId && editRacData.code) {
          onUpdateRacs(racDefinitions.map(r => r.id === editingRacId ? { ...r, ...editRacData } as RacDef : r));
          setEditingRacId(null);
      }
  };

  const handleDeleteRac = (id: string, code: string) => {
      setConfirmState({
          isOpen: true,
          title: 'Delete Training Module?',
          message: `Warning: Deleting ${code} will remove it from all site policies and reports. Are you sure?`,
          onConfirm: () => {
              // 1. Remove from definitions
              onUpdateRacs(racDefinitions.filter(r => r.id !== id));
              // 2. Remove from ALL site mandatory lists (Cleanup)
              setSites(prev => prev.map(s => ({
                  ...s,
                  mandatoryRacs: (s.mandatoryRacs || []).filter(c => c !== code)
              })));
              // 3. Update local state if needed
              setLocalRequirements(prev => prev.filter(c => c !== code));
          },
          isDestructive: true
      });
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                <Shield size={300} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Shield size={32} className="text-indigo-400" />
                        {t.siteGovernance.title}
                    </h1>
                    <p className="text-indigo-200 mt-2 max-w-xl">
                        {t.siteGovernance.subtitle}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-6">
            
            {/* Control Bar: Site Selector & Module Management */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Building2 size={24} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            {t.siteGovernance.selectSite}
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative group min-w-[280px]">
                                <select
                                    value={selectedSiteId}
                                    onChange={(e) => setSelectedSiteId(e.target.value)}
                                    className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-bold rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                                >
                                    <option className="dark:bg-slate-800" value="" disabled>Select a site</option>
                                    {sites.map(site => (
                                        <option className="dark:bg-slate-800" key={site.id} value={site.id}>
                                            {site.name} ({site.location})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" size={18} />
                            </div>
                            
                            <button 
                                onClick={openAddModal}
                                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-md transition-all"
                                title="Add New Site"
                            >
                                <Plus size={20} />
                            </button>
                            
                            {selectedSite && (
                                <button 
                                    onClick={openEditModal}
                                    className="p-3 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
                                    title="Edit Site Details"
                                >
                                    <Edit2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full md:border-l border-slate-200 dark:border-slate-700 md:pl-6 flex items-center justify-between">
                    <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="max-w-xs text-xs">
                            Define mandatory modules below. To add new types of training to the system, use the manager.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setIsRacModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                    >
                        <GraduationCap size={16} /> Manage Modules
                    </button>
                </div>
            </div>

            {/* Main Content: Checklist */}
            {selectedSite ? (
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <MapPin size={24} className="text-indigo-500" />
                                {selectedSite.name} Policy
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">{t.siteGovernance.configure}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs font-bold border border-yellow-200 dark:border-yellow-800">
                            <AlertCircle size={16} />
                            Changes apply immediately upon save
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {racDefinitions.map(rac => {
                            const isSelected = localRequirements.includes(rac.code);
                            return (
                                <div 
                                    key={rac.id}
                                    onClick={() => toggleRac(rac.code)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3 hover:shadow-md ${
                                        isSelected 
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
                                    }`}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white dark:bg-slate-700'
                                    }`}>
                                        {isSelected && <CheckSquare size={14} className="text-white" />}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {rac.code}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rac.name.split(' - ')[1] || rac.name}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-700">
                        <button 
                            onClick={handleSavePolicy}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                                isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500'
                            }`}
                        >
                            {isSaving ? <RefreshCw size={20} className="animate-spin"/> : <Save size={20} />}
                            <span>{isSaving ? 'Applying Policy...' : t.enterprise.pushPolicy}</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <div className="text-slate-400 mb-4 flex justify-center"><Building2 size={48} /></div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">No Site Selected</h3>
                    <p className="text-slate-500 dark:text-slate-400">Please select a site to manage its governance policies.</p>
                </div>
            )}
        </div>

        {/* --- MODALS --- */}
        
        {/* ADD SITE MODAL */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            <Plus size={18} /> Add New Site
                        </h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Site Name</label>
                            <input 
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                placeholder="e.g. Moatize Mine"
                                value={siteForm.name}
                                onChange={e => setSiteForm({...siteForm, name: e.target.value})}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Location</label>
                            <input 
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                placeholder="e.g. Tete"
                                value={siteForm.location}
                                onChange={e => setSiteForm({...siteForm, location: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                        <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleAddSite} className="px-8 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/30 transition-all">Create Site</button>
                    </div>
                </div>
            </div>
        )}

        {/* EDIT SITE MODAL */}
        {isEditModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            <Edit2 size={18} /> Edit Site Details
                        </h3>
                        <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Site Name</label>
                            <input 
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                value={siteForm.name}
                                onChange={e => setSiteForm({...siteForm, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Location</label>
                            <input 
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                value={siteForm.location}
                                onChange={e => setSiteForm({...siteForm, location: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between gap-3">
                        <button 
                            onClick={handleDeleteSite} 
                            className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleUpdateSite} className="px-8 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/30 transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* MANAGE RAC MODULES MODAL */}
        {isRacModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh]">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            <GraduationCap size={20} className="text-indigo-500"/> Manage Training Modules
                        </h3>
                        <button onClick={() => setIsRacModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Add New Section */}
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-600 mb-8 flex flex-col md:flex-row gap-4 items-end shadow-sm">
                            <div className="w-32">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                    <Hash size={12} /> Code
                                </label>
                                <input 
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-mono font-semibold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all uppercase" 
                                    placeholder="RAC15" 
                                    value={newRac.code}
                                    onChange={(e) => setNewRac({...newRac, code: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-2">
                                    <LayoutGrid size={12} /> Description
                                </label>
                                <input 
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all" 
                                    placeholder="e.g. Advanced Fire Safety" 
                                    value={newRac.name}
                                    onChange={(e) => setNewRac({...newRac, name: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleAddRac}
                                className="w-full md:w-auto bg-slate-900 dark:bg-emerald-600 text-white p-3 rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* List Section */}
                        <div className="grid gap-3">
                            {racDefinitions.map(rac => (
                                <div key={rac.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-md transition-all gap-4">
                                    <div className="w-32 flex-shrink-0">
                                            {editingRacId === rac.id ? (
                                            <input 
                                                className="border-b-2 border-indigo-500 bg-transparent px-1 py-0.5 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none w-full uppercase"
                                                value={String(editRacData.code)}
                                                onChange={(e) => setEditRacData({...editRacData, code: e.target.value})}
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 block w-fit text-center">
                                                {rac.code}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        {editingRacId === rac.id ? (
                                            <input 
                                                className="border-b-2 border-indigo-500 bg-transparent px-1 py-0.5 text-sm font-bold text-slate-900 dark:text-white outline-none w-full"
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
                                                <button onClick={handleSaveRacEdit} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><CheckSquare size={16}/></button>
                                                <button onClick={() => setEditingRacId(null)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"><X size={16}/></button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => { setEditingRacId(rac.id); setEditRacData(rac); }} 
                                                    className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16}/>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRac(rac.id, rac.code)} 
                                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                        <button onClick={() => setIsRacModalOpen(false)} className="text-sm font-bold text-indigo-600 hover:underline">Done</button>
                    </div>
                </div>
            </div>
        )}

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

export default SiteGovernancePage;
