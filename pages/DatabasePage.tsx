
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee, TrainingSession } from '../types';
import { COMPANIES, RAC_KEYS } from '../constants';
import { Search, CheckCircle, XCircle, AlertTriangle, Filter, CreditCard, ShieldAlert } from 'lucide-react';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
  sessions: TrainingSession[];
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements, sessions }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [accessStatusFilter, setAccessStatusFilter] = useState<'All' | 'Granted' | 'Blocked'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state to hold edited DL details
  const [dlEdits, setDlEdits] = useState<Record<string, { number: string, class: string, expiry: string }>>({});

  // 1. Consolidate Unique Employees
  const uniqueEmployees = useMemo(() => {
    const map = new Map<string, Employee>();
    bookings.forEach(b => {
      if (!map.has(b.employee.id)) {
        // Merge with local edits
        const original = b.employee;
        const edited = dlEdits[original.id];
        const merged = edited ? {
            ...original,
            driverLicenseNumber: edited.number,
            driverLicenseClass: edited.class,
            driverLicenseExpiry: edited.expiry
        } : original;
        map.set(b.employee.id, merged);
      }
    });
    return Array.from(map.values());
  }, [bookings, dlEdits]);

  // Helper to get requirement
  const getRequirement = (empId: string): EmployeeRequirement => {
    return requirements.find(r => r.employeeId === empId) || {
      employeeId: empId,
      asoExpiryDate: '',
      requiredRacs: {}
    };
  };

  // Helper to get training status
  const getTrainingStatus = (empId: string, racKey: string): string | null => {
    const validBooking = bookings.find(b => {
        if (b.employee.id !== empId) return false;
        if (b.status !== BookingStatus.PASSED) return false;
        
        let racCode = '';
        const session = sessions.find(s => s.id === b.sessionId);
        if (session) {
            racCode = session.racType.split(' - ')[0].replace(' ', '');
        } else {
             const parts = b.sessionId ? b.sessionId.split(' - ') : [];
             if (parts.length > 0) {
                 racCode = parts[0].replace(' ', '');
             }
        }
        return racCode === racKey;
    });

    if (validBooking && typeof validBooking.expiryDate === 'string') {
        return validBooking.expiryDate;
    }
    return null;
  };

  const handleRequirementChange = (empId: string, racKey: string, isRequired: boolean) => {
    const current = getRequirement(empId);
    const updated = {
      ...current,
      requiredRacs: {
        ...current.requiredRacs,
        [racKey]: isRequired
      }
    };
    updateRequirements(updated);
  };

  const handleAsoChange = (empId: string, date: string) => {
    const current = getRequirement(empId);
    const updated = { ...current, asoExpiryDate: date };
    updateRequirements(updated);
  };

  const handleDlUpdate = (empId: string, field: 'number' | 'class' | 'expiry', value: string) => {
     setDlEdits(prev => {
         const existing = prev[empId] || { 
             number: uniqueEmployees.find(e => e.id === empId)?.driverLicenseNumber || '',
             class: uniqueEmployees.find(e => e.id === empId)?.driverLicenseClass || '',
             expiry: uniqueEmployees.find(e => e.id === empId)?.driverLicenseExpiry || ''
         };
         return {
             ...prev,
             [empId]: { ...existing, [field]: value }
         };
     });
  };

  // 4. Pre-process data
  const processedData = useMemo(() => {
    return uniqueEmployees.map(emp => {
      const req = getRequirement(emp.id);
      const today = new Date().toISOString().split('T')[0];
      const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
      
      // Driver License Check
      const dlExpiry = emp.driverLicenseExpiry || '';
      const isDlExpired = !!(dlExpiry && dlExpiry <= today);
      const rac02Required = !!req.requiredRacs['RAC02'];

      // AUTO DE-MAP Logic:
      // If RAC02 is required BUT DL is expired, we "Demap" it for access control purposes
      const effectiveRequiredRacs = { ...req.requiredRacs };
      let rac02AutoDemapped = false;
      
      if (isDlExpired && rac02Required) {
          effectiveRequiredRacs['RAC02'] = false; 
          rac02AutoDemapped = true;
      }

      const racDetails = RAC_KEYS.map(rac => {
          const isRequired = !!req.requiredRacs[rac]; // Original Requirement
          const isEffectivelyRequired = !!effectiveRequiredRacs[rac]; // For Access Calculation
          
          const expiryDate = getTrainingStatus(emp.id, rac);
          const isValid = !!(expiryDate && expiryDate > today); 
          
          // Ensure we return strings or strict booleans, no objects
          return { 
              rac, 
              isRequired, 
              isEffectivelyRequired, 
              isValid, 
              expiry: expiryDate ? String(expiryDate) : '' 
          };
      });

      const allRequiredMet = racDetails.every(r => !r.isEffectivelyRequired || r.isValid);
      const accessGranted = isAsoValid && allRequiredMet;

      return {
        emp,
        req,
        isAsoValid,
        racDetails,
        accessGranted,
        rac02AutoDemapped,
        isDlExpired
      };
    });
  }, [uniqueEmployees, requirements, bookings, dlEdits, sessions]);


  // 5. Apply Filters
  const filteredData = processedData.filter(({ emp, accessGranted }) => {
    const matchSearch = String(emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        String(emp.recordId || '').includes(searchTerm);
    if (!matchSearch) return false;
    if (selectedCompany !== 'All' && emp.company !== selectedCompany) return false;
    if (accessStatusFilter === 'Granted' && !accessGranted) return false;
    if (accessStatusFilter === 'Blocked' && accessGranted) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Master Employee Database</h2>
            <p className="text-sm text-gray-500">Manage requirements. <span className="text-yellow-600 font-bold">RAC 02 is auto-disabled if DL is expired to prevent Site Lockout.</span></p>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-yellow-500 focus:border-yellow-500 w-64"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
               <Filter size={16} />
               <span>Filters:</span>
            </div>
            <select 
               value={selectedCompany}
               onChange={(e) => setSelectedCompany(e.target.value)}
               className="py-1.5 pl-3 pr-8 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50"
             >
               <option value="All">All Companies</option>
               {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
               value={accessStatusFilter}
               onChange={(e) => setAccessStatusFilter(e.target.value as any)}
               className="py-1.5 pl-3 pr-8 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50"
             >
               <option value="All">All Access Status</option>
               <option value="Granted">Access Granted</option>
               <option value="Blocked">Access Blocked</option>
            </select>
            <div className="ml-auto text-xs text-gray-400">
               Showing {String(filteredData.length)} records
            </div>
        </div>
      </div>

      {/* Database Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[250px] sticky left-0 border-r border-slate-200">Employee Info & DL</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[120px]">ASO (Medical)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[120px]">Access Status</th>
              {RAC_KEYS.map(rac => (
                <th key={rac} className={`px-2 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[140px] border-l border-gray-200 ${rac === 'RAC02' ? 'bg-yellow-50' : ''}`}>
                  {String(rac)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map(({ emp, req, isAsoValid, racDetails, accessGranted, rac02AutoDemapped, isDlExpired }) => {
              const safeName = String(emp.name || '');
              const safeRecId = String(emp.recordId || '');
              const safeCompany = String(emp.company || '');
              
              return (
                <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${accessGranted ? 'bg-green-50/30' : 'bg-red-50/20'}`}>
                  {/* Fixed Column: Employee Info */}
                  <td className="px-3 py-3 whitespace-nowrap sticky left-0 bg-inherit border-r border-gray-200">
                    <div className="text-sm font-bold text-slate-900">{safeName}</div>
                    <div className="text-xs text-gray-500 mb-2">{safeRecId} | {safeCompany}</div>
                    
                    {/* Editable Driver License Section */}
                    <div className="bg-white bg-opacity-60 border border-gray-200 rounded p-1.5 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                               <CreditCard size={10} /> License
                            </span>
                            {isDlExpired ? <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold">EXP</span> : null}
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <input 
                                type="text" placeholder="Class" 
                                className="text-[10px] border rounded px-1 py-0.5 w-full"
                                value={String(emp.driverLicenseClass || '')}
                                onChange={(e) => handleDlUpdate(emp.id, 'class', e.target.value)}
                            />
                            <input 
                                type="text" placeholder="Number" 
                                className="text-[10px] border rounded px-1 py-0.5 w-full"
                                value={String(emp.driverLicenseNumber || '')}
                                onChange={(e) => handleDlUpdate(emp.id, 'number', e.target.value)}
                            />
                        </div>
                        <input 
                            type="date"
                            className={`text-[10px] border rounded px-1 py-0.5 w-full ${isDlExpired ? 'border-red-300 text-red-600' : ''}`}
                            value={String(emp.driverLicenseExpiry || '')}
                            onChange={(e) => handleDlUpdate(emp.id, 'expiry', e.target.value)}
                        />
                    </div>
                  </td>

                  {/* ASO Column */}
                  <td className="px-3 py-3 whitespace-nowrap text-center align-top pt-5">
                    <input 
                      type="date" 
                      value={String(req.asoExpiryDate || '')}
                      onChange={(e) => handleAsoChange(emp.id, e.target.value)}
                      className={`text-xs border rounded p-1 w-28 text-center focus:ring-yellow-500 
                        ${!isAsoValid ? 'border-red-300 bg-red-50 text-red-700 font-bold' : 'border-green-300 bg-green-50 text-green-700'}
                      `}
                    />
                  </td>

                  {/* Access Status */}
                  <td className="px-3 py-3 whitespace-nowrap text-center align-top pt-5">
                    {accessGranted ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle size={12} className="mr-1" /> GRANTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                        <XCircle size={12} className="mr-1" /> BLOCKED
                      </span>
                    )}
                  </td>

                  {/* RAC Columns */}
                  {racDetails.map(({ rac, isRequired, isEffectivelyRequired, isValid, expiry }) => {
                    const isRac02 = rac === 'RAC02';
                    const showDemapWarning = isRac02 && rac02AutoDemapped;
                    
                    return (
                        <td key={rac} className={`px-2 py-3 whitespace-nowrap border-l border-gray-100 text-center align-top pt-4 relative ${isRac02 ? 'bg-yellow-50/30' : ''}`}>
                          <div className="flex flex-col items-center gap-1">
                            <label className="flex items-center gap-1 text-[10px] text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded">
                              <input 
                                type="checkbox"
                                checked={isRequired}
                                onChange={(e) => handleRequirementChange(emp.id, rac, e.target.checked)}
                                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 h-3 w-3"
                              />
                              Required
                            </label>
                            
                            {/* Auto-Demap Warning for RAC02 */}
                            {showDemapWarning ? (
                                <div className="flex items-center gap-1 text-[9px] bg-orange-100 text-orange-700 px-1 py-0.5 rounded border border-orange-200 mb-1" title="RAC02 requirements disabled due to Expired DL to allow site access">
                                    <ShieldAlert size={10} />
                                    <span>DL Demap</span>
                                </div>
                            ) : null}

                            {/* Status Pill */}
                            {isValid ? (
                              <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                {String(expiry)}
                              </div>
                            ) : isRequired ? (
                                showDemapWarning ? (
                                   <div className="text-[9px] text-gray-400 italic">Skipped</div>
                                ) : (
                                  <div className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                                    <AlertTriangle size={10} /> Missing
                                  </div>
                                )
                            ) : (
                              <div className="text-[10px] text-gray-300">-</div>
                            )}
                          </div>
                        </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatabasePage;
