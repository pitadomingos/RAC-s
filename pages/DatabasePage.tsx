
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession, RacDef, SystemNotification, Company } from '../types';
import { OPS_KEYS, PERMISSION_KEYS } from '../constants';
import { Search, CheckCircle, XCircle, Edit, ChevronLeft, ChevronRight, Download, X, Trash2, QrCode, Printer, FileSpreadsheet, Filter, Cloud, CloudOff, Loader2, Archive } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import JSZip from 'jszip';
import ConfirmModal from '../components/ConfirmModal';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { isSupabaseConfigured } from '../services/supabaseClient';
import RacIcon from '../components/RacIcon';

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
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);
  const [isZipping, setIsZipping] = useState(false);
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
        if (selectedCompany !== 'All' && item.emp.company !== selectedCompany) return false;
        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            return item.emp.name.toLowerCase().includes(low) || item.emp.recordId.toLowerCase().includes(low);
        }
        return true;
    });
  }, [bookings, requirements, racDefinitions, selectedCompany, searchTerm, currentSiteId]);

  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col h-auto md:h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex flex-col xl:flex-row justify-between gap-4">
             <div className="flex items-center gap-4">
                 <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Personnel Safety Registry</h2>
                    <p className="text-xs text-slate-500">Dynamic evaluation matrix for current operations.</p>
                 </div>
                 <div className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {isSupabaseConfigured ? 'Cloud Active' : 'Offline Mode'}
                 </div>
             </div>
             <div className="flex flex-wrap items-center gap-2">
                 <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} className="p-2 border rounded text-xs bg-white dark:bg-slate-700">
                    <option value="All">All Companies</option>
                    {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                 </select>
                 <div className="relative"><Search size={14} className="absolute left-3 top-2.5 text-slate-400"/><input type="text" placeholder="Search..." className="pl-9 pr-3 py-2 border rounded text-xs w-40" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                 <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded text-xs font-bold"><FileSpreadsheet size={14} /> Import</button>
             </div>
        </div>

        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-900/50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Employee</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Medical (ASO)</th>
                        {racDefinitions.map(rac => (
                            <th key={rac.id} className="px-2 py-3 text-center text-[10px] font-bold text-indigo-500 uppercase">
                              <div className="flex flex-col items-center gap-1">
                                <RacIcon racCode={rac.code} racName={rac.name} size={18} />
                                <span>{rac.code}</span>
                              </div>
                            </th>
                        ))}
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                    {paginatedData.map(({ emp, req, status }) => (
                        <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                                {status === 'Granted' ? <span className="text-emerald-600 font-bold text-xs">Granted</span> : <span className="text-red-600 font-bold text-xs">Blocked</span>}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</div>
                                <div className="text-[10px] text-slate-500">{emp.recordId} • {emp.company}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <input type="date" value={req.asoExpiryDate} onChange={e => updateRequirements({...req, asoExpiryDate: e.target.value})} className="text-xs border rounded p-1" />
                            </td>
                            {racDefinitions.map(rac => {
                                const expiry = getTrainingStatus(emp.id, rac.code);
                                const isRequired = !!req.requiredRacs[rac.code];
                                return (
                                    <td key={rac.id} className="px-1 py-3 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <input type="checkbox" checked={isRequired} onChange={(e) => handleRequirementChange(emp.id, rac.code, e.target.checked)} className="w-4 h-4 text-blue-600" />
                                            {isRequired && <span className={`text-[8px] font-bold px-1 rounded ${expiry ? 'bg-green-100 text-green-700' : 'text-red-500'}`}>{expiry ? format(new Date(expiry), 'dd/MM/yy') : 'MISSING'}</span>}
                                        </div>
                                    </td>
                                );
                            })}
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2"><button onClick={() => setQrEmployee(emp)} className="p-1.5 text-slate-400 hover:text-blue-500"><QrCode size={16}/></button><button onClick={() => setEditingEmployee(emp)} className="p-1.5 text-slate-400 hover:text-indigo-500"><Edit size={16}/></button></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center text-xs text-slate-500">
            <span>Page {currentPage} of {Math.ceil(processedData.length / itemsPerPage)}</span>
            <div className="flex gap-1"><button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="p-1 border rounded"><ChevronLeft size={16}/></button><button onClick={() => setCurrentPage(p => p+1)} className="p-1 border rounded"><ChevronRight size={16}/></button></div>
        </div>
    </div>
  );
};

export default DatabasePage;
