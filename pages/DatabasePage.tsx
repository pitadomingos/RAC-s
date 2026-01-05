
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession, RacDef, SystemNotification, Company } from '../types';
import { Search, CheckCircle, XCircle, Edit, ChevronLeft, ChevronRight, Download, X, Trash2, QrCode, Printer, FileSpreadsheet, Filter, Cloud, CloudOff, Loader2, Archive, ArrowRight, Upload, FileDown, Plus, RefreshCw, Users, ShieldCheck, Database as DbIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import JSZip from 'jszip';
import ConfirmModal from '../components/ConfirmModal';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { isSupabaseConfigured } from '../services/supabaseClient';
import RacIcon from '../components/RacIcon';
import { db } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
  sessions: TrainingSession[];
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  racDefinitions: RacDef[];
  addNotification: (notif: SystemNotification) => void;
  currentSiteId: string;
  companies?: Company[];
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements, sessions, onUpdateEmployee, onDeleteEmployee, racDefinitions, addNotification, currentSiteId, companies = [] }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDestructive: false });

  const getRequirement = (empId: string): EmployeeRequirement => {
    return requirements.find(r => r.employeeId === empId) || { employeeId: empId, asoExpiryDate: '', requiredRacs: {} };
  };

  const getTrainingStatus = (empId: string, racCode: string): string | null => {
    const today = new Date().toISOString().split('T')[0];
    const match = bookings.find(b => b.employee.id === empId && b.status === BookingStatus.PASSED && b.expiryDate && b.expiryDate > today && (b.sessionId.includes(racCode)));
    return match ? match.expiryDate || null : null;
  };

  const handleRequirementChange = (empId: string, racKey: string, isRequired: boolean) => {
    const current = getRequirement(empId);
    const updated = { ...current, requiredRacs: { ...current.requiredRacs, [racKey]: isRequired } };
    updateRequirements(updated);
  };

  const processedData = useMemo(() => {
    const uniqueEmployeesMap = new Map<string, Employee>();
    bookings.forEach(b => { if (!uniqueEmployeesMap.has(b.employee.id)) uniqueEmployeesMap.set(b.employee.id, b.employee); });
    
    return Array.from(uniqueEmployeesMap.values()).map(emp => {
      const req = getRequirement(emp.id);
      const today = new Date().toISOString().split('T')[0];
      const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate >= today);
      const isActive = emp.isActive ?? true;

      let allRacsMet = true;
      racDefinitions.forEach(def => {
          if (req.requiredRacs[def.code]) {
              const status = getTrainingStatus(emp.id, def.code);
              if (!status) allRacsMet = false;
          }
      });

      return { emp, req, status: (isActive && isAsoValid && allRacsMet) ? 'Granted' : 'Blocked' };
    }).filter(item => {
        if (currentSiteId !== 'all' && item.emp.siteId !== currentSiteId) return false;
        
        if (selectedCompany !== 'All') {
            const companyObj = companies.find(c => c.name === item.emp.company);
            const parentFilterObj = companies.find(c => c.name === selectedCompany);
            if (item.emp.company === selectedCompany) return true;
            if (companyObj && parentFilterObj && companyObj.parentId === parentFilterObj.id) return true;
            return false;
        }

        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            return item.emp.name.toLowerCase().includes(low) || item.emp.recordId.toLowerCase().includes(low);
        }
        return true;
    });
  }, [bookings, requirements, racDefinitions, selectedCompany, searchTerm, currentSiteId, companies]);

  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadTemplate = () => {
    const headers = ['Record ID', 'Full Name', 'Company', 'Department', 'Role', 'Medical (ASO) Expiry', 'Required RACs (Comma separated codes e.g. RAC01,RAC02)'];
    const sample = ['VUL-1001', 'Jane Doe', 'Vulcan', 'HSE', 'Safety Officer', format(new Date(), 'yyyy-MM-dd'), 'RAC01,RAC05'];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), sample.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "personnel_registry_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        const lines = text.split('\n');
        const batch: Partial<Employee>[] = [];
        const reqs: EmployeeRequirement[] = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            
            if (cols[0] && cols[1]) {
                const empId = uuidv4();
                batch.push({
                    id: empId,
                    recordId: cols[0],
                    name: cols[1],
                    company: cols[2] || 'Unknown',
                    department: cols[3] || 'N/A',
                    role: cols[4] || 'N/A',
                    siteId: currentSiteId !== 'all' ? currentSiteId : 's1',
                    isActive: true
                });

                const reqRacs: Record<string, boolean> = {};
                if (cols[6]) {
                    cols[6].split(';').forEach(c => reqRacs[c.trim().toUpperCase()] = true);
                }
                
                reqs.push({
                    employeeId: empId, // Note: This mapping needs RecordID match in production dbService, using UUID for now
                    asoExpiryDate: cols[5] || '',
                    requiredRacs: reqRacs
                });
            }
        }

        try {
            await db.bulkUpsertEmployees(batch);
            // Re-sync IDs for requirements if needed, but for simplicity we rely on bulkUpsert success
            addNotification({
                id: uuidv4(),
                type: 'success',
                title: 'Cloud Registry Updated',
                message: `Successfully imported ${batch.length} personnel records into Supabase.`,
                timestamp: new Date(),
                isRead: false
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            window.location.reload();
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-auto md:h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative animate-fade-in">
        
        {/* --- HEADER --- */}
        <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col xl:flex-row justify-between gap-6">
             <div className="flex items-center gap-6">
                 <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-xl shadow-indigo-600/20">
                    <Users size={28} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Personnel Registry</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Authorized Site Access Matrix</p>
                 </div>
             </div>

             <div className="flex flex-wrap items-center gap-3">
                 <div className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 shadow-sm">
                    <Filter size={16} className="text-slate-400" />
                    <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} className="text-sm font-bold bg-transparent outline-none text-slate-800 dark:text-white cursor-pointer pr-4">
                        <option value="All">All Companies</option>
                        {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                 </div>
                 
                 <div className="relative w-64">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="text" placeholder="Search ID or Name..." className="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 </div>

                 <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                 <div className="flex gap-2">
                    <button 
                        onClick={handleDownloadTemplate} 
                        className="p-3 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-all shadow-sm" 
                        title="Download CSV Template"
                    >
                        <FileDown size={20}/>
                    </button>
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isImporting}
                        className="flex items-center gap-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {isImporting ? <RefreshCw size={16} className="animate-spin"/> : <Upload size={16} />}
                        <span>{isImporting ? 'Processing' : 'Import CSV'}</span>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                 </div>
             </div>
        </div>

        {/* --- GRID TABLE --- */}
        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700 border-separate border-spacing-0">
                <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
                    <tr>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Access Identity</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Company & Role</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Medical (ASO)</th>
                        {racDefinitions.slice(0, 8).map(rac => (
                            <th key={rac.id} className="px-2 py-4 text-center text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                                <div className="flex flex-col items-center gap-1.5">
                                    <RacIcon racCode={rac.code} racName={rac.name} size={16} />
                                    <span>{rac.code}</span>
                                </div>
                            </th>
                        ))}
                        <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Audit</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-50 dark:divide-slate-700/50">
                    {paginatedData.map(({ emp, req, status }) => (
                        <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                            <td className="px-8 py-5 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${status === 'Granted' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{emp.name}</div>
                                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">{emp.recordId}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp.role}</div>
                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{emp.company}</div>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className={`text-xs font-black font-mono ${req.asoExpiryDate && req.asoExpiryDate >= new Date().toISOString().split('T')[0] ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {req.asoExpiryDate || 'EXPIRED'}
                                    </span>
                                    <div className="text-[8px] text-slate-400 uppercase font-black">VALIDITY DATE</div>
                                </div>
                            </td>
                            {racDefinitions.slice(0, 8).map(rac => {
                                const expiry = getTrainingStatus(emp.id, rac.code);
                                const isRequired = !!req.requiredRacs[rac.code];
                                return (
                                    <td key={rac.id} className="px-1 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className={`w-3.5 h-3.5 rounded border transition-colors ${isRequired ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                                {isRequired && <CheckCircle size={14} className="text-white -ml-0.5 -mt-0.5" />}
                                            </div>
                                            {isRequired && (
                                                <div className={`text-[8px] font-black px-1.5 rounded uppercase ${expiry ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                    {expiry ? format(new Date(expiry), 'dd/MM/yy') : 'MISSING'}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                            <td className="px-8 py-5 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setQrEmployee(emp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><QrCode size={18}/></button>
                                    <button onClick={() => setEditingEmployee(emp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"><Edit size={18}/></button>
                                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"><Trash2 size={18}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {processedData.length === 0 && (
                        <tr>
                            <td colSpan={12} className="py-24 text-center">
                                <div className="flex flex-col items-center gap-4 text-slate-300">
                                    <Search size={64} className="opacity-20" />
                                    <p className="text-lg font-black uppercase tracking-widest">Zero Matching Personnel Discovered</p>
                                    <p className="text-sm text-slate-400 font-medium">Check your filters or upload a registry via CSV above.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* --- FOOTER PAGINATION --- */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <DbIcon size={14} className="text-slate-300" />
                    <span>Total Workforce Index: {processedData.length}</span>
                </div>
                <div className="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>
                <span>Page {currentPage} of {Math.ceil(processedData.length / itemsPerPage) || 1}</span>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <ChevronLeft size={16} /> Prev
                </button>
                <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage >= Math.ceil(processedData.length / itemsPerPage)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default DatabasePage;
