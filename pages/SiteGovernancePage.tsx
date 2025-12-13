
import React, { useState } from 'react';
import { Site, RacDef, Booking, EmployeeRequirement, Employee } from '../types';
import { Shield, CheckSquare, Save, Building2, MapPin, AlertCircle, Info, RefreshCw, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SiteGovernancePageProps {
  sites: Site[];
  setSites: React.Dispatch<React.SetStateAction<Site[]>>;
  racDefinitions: RacDef[];
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
}

const SiteGovernancePage: React.FC<SiteGovernancePageProps> = ({ 
    sites, setSites, racDefinitions, bookings, requirements, updateRequirements 
}) => {
  const { t } = useLanguage();
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);

  const selectedSite = sites.find(s => s.id === selectedSiteId);

  // Local state for the form before saving
  const [localRequirements, setLocalRequirements] = useState<string[]>(
      selectedSite?.mandatoryRacs || []
  );

  // Update local state when site selection changes
  React.useEffect(() => {
      if (selectedSite) {
          setLocalRequirements(selectedSite.mandatoryRacs || []);
      }
  }, [selectedSiteId, selectedSite]);

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
      // Find all employees at this site
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

  if (!selectedSite) return <div className="p-8">Please select a site.</div>;

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
            
            {/* Site Selector Dropdown Area */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Building2 size={24} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            {t.siteGovernance.selectSite}
                        </label>
                        <div className="relative group min-w-[280px]">
                            <select
                                value={selectedSiteId}
                                onChange={(e) => setSelectedSiteId(e.target.value)}
                                className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-bold rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                            >
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>
                                        {site.name} ({site.location})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" size={18} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full md:border-l border-slate-200 dark:border-slate-700 md:pl-6">
                    <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <p>
                            Defining mandatory RACs for <strong>{selectedSite.name}</strong> will automatically flag these requirements for all personnel assigned to this location.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content: Checklist */}
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
        </div>
    </div>
  );
};

export default SiteGovernancePage;
