import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, Employee } from '../types';
import { COMPANIES, RAC_KEYS, MOCK_SESSIONS } from '../constants';
import { Search, CheckCircle, XCircle, AlertTriangle, Filter } from 'lucide-react';

interface DatabasePageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  updateRequirements: (req: EmployeeRequirement) => void;
}

const DatabasePage: React.FC<DatabasePageProps> = ({ bookings, requirements, updateRequirements }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [accessStatusFilter, setAccessStatusFilter] = useState<'All' | 'Granted' | 'Blocked'>('All');
  const [racIssueFilter, setRacIssueFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Consolidate Unique Employees from Bookings
  const uniqueEmployees = useMemo(() => {
    const map = new Map<string, Employee>();
    bookings.forEach(b => {
      if (!map.has(b.employee.id)) {
        map.set(b.employee.id, b.employee);
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  // 2. Helper to get or create requirement object
  const getRequirement = (empId: string): EmployeeRequirement => {
    return requirements.find(r => r.employeeId === empId) || {
      employeeId: empId,
      asoExpiryDate: '',
      requiredRacs: {}
    };
  };

  // 3. Helper to check if employee has valid PASS for a specific RAC
  // Define this outside the loop to be used inside useMemo
  const getTrainingStatus = (empId: string, racKey: string): string | null => {
    // Find a booking for this employee that matches the RAC Key (e.g. RAC01)
    const validBooking = bookings.find(b => {
        if (b.employee.id !== empId) return false;
        if (b.status !== BookingStatus.PASSED) return false;
        
        // Match RAC Key to Session Info
        let racCode = '';
        const session = MOCK_SESSIONS.find(s => s.id === b.sessionId);
        if (session) {
            racCode = session.racType.split(' - ')[0].replace(' ', ''); // "RAC 01" -> "RAC01"
        } else {
             const parts = b.sessionId ? b.sessionId.split(' - ') : [];
             if (parts.length > 0) {
                 racCode = parts[0].replace(' ', '');
             }
        }
        return racCode === racKey;
    });

    // STRICT SAFETY CHECK: Ensure we return a string or null, never an object or undefined
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

  // 4. Pre-process data for filtering
  // We calculate status for everyone first, so we can filter by "Blocked", "Missing RAC01", etc.
  const processedData = useMemo(() => {
    return uniqueEmployees.map(emp => {
      const req = getRequirement(emp.id);
      const today = new Date().toISOString().split('T')[0];
      const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
      
      const missingRacs: string[] = [];
      let allRequiredMet = true;

      const racDetails = RAC_KEYS.map(rac => {
          const isRequired = !!req.requiredRacs[rac]; // Ensure boolean
          const expiry = getTrainingStatus(emp.id, rac);
          // Ensure isValid is boolean and expiry is safe string or null
          const isValid = !!(expiry && expiry > today); 
          
          if (isRequired && !isValid) {
              allRequiredMet = false;
              missingRacs.push(rac);
          }
          return { rac, isRequired, isValid, expiry };
      });

      const accessGranted = isAsoValid && allRequiredMet;

      return {
        emp,
        req,
        isAsoValid,
        racDetails,
        accessGranted,
        missingRacs
      };
    });
  }, [uniqueEmployees, requirements, bookings]);


  // 5. Apply Filters
  const filteredData = processedData.filter(({ emp, isAsoValid, accessGranted, missingRacs }) => {
    // Text Search
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        emp.recordId.includes(searchTerm);
    if (!matchSearch) return false;

    // Company
    if (selectedCompany !== 'All' && emp.company !== selectedCompany) return false;

    // Access Status
    if (accessStatusFilter === 'Granted' && !accessGranted) return false;
    if (accessStatusFilter === 'Blocked' && accessGranted) return false;

    // Specific Issue Filter
    if (racIssueFilter !== 'All') {
      if (racIssueFilter === 'ASO') {
        // User wants to see people with Invalid ASO
        if (isAsoValid) return false; 
      } else {
        // User wants to see people missing a specific RAC (e.g. RAC01)
        // 'missingRacs' array contains only required-but-invalid RACs
        if (!missingRacs.includes(racIssueFilter)) return false;
      }
    }

    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Master Employee Database</h2>
            <p className="text-sm text-gray-500">Manage compliance requirements and view access status.</p>
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

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
               <Filter size={16} />
               <span>Filters:</span>
            </div>

            {/* Company Filter */}
            <select 
               value={selectedCompany}
               onChange={(e) => setSelectedCompany(e.target.value)}
               className="py-1.5 pl-3 pr-8 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50"
             >
               <option value="All">All Companies</option>
               {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Access Status Filter */}
            <select 
               value={accessStatusFilter}
               onChange={(e) => setAccessStatusFilter(e.target.value as any)}
               className="py-1.5 pl-3 pr-8 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50"
             >
               <option value="All">All Access Status</option>
               <option value="Granted">Access Granted</option>
               <option value="Blocked">Access Blocked</option>
            </select>

            {/* Specific Issue Filter */}
            <select 
               value={racIssueFilter}
               onChange={(e) => setRacIssueFilter(e.target.value)}
               className="py-1.5 pl-3 pr-8 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50"
             >
               <option value="All">Any / No Issues</option>
               <option value="ASO" className="text-red-600 font-bold">Missing/Expired ASO</option>
               {RAC_KEYS.map(rac => (
                 <option key={rac} value={rac}>Missing {rac}</option>
               ))}
            </select>

            {/* Results Count */}
            <div className="ml-auto text-xs text-gray-400">
               Showing {filteredData.length} records
            </div>
        </div>
      </div>

      {/* Database Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[200px] sticky left-0 border-r border-slate-200">Employee Info</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[120px]">ASO (Medical)</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[120px]">Access Status</th>
              {RAC_KEYS.map(rac => (
                <th key={rac} className="px-2 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 min-w-[140px] border-l border-gray-200">
                  {rac}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map(({ emp, req, isAsoValid, racDetails, accessGranted }) => {
              // Ensure name/id are strings before rendering
              const safeName = String(emp.name || '');
              const safeRecId = String(emp.recordId || '');
              const safeCompany = String(emp.company || '');

              return (
                <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${accessGranted ? 'bg-green-50/30' : ''}`}>
                  {/* Fixed Column: Employee Info */}
                  <td className="px-3 py-3 whitespace-nowrap sticky left-0 bg-inherit border-r border-gray-200">
                    <div className="text-sm font-bold text-slate-900">{safeName}</div>
                    <div className="text-xs text-gray-500">{safeRecId} | {safeCompany}</div>
                    <div className="text-[10px] text-gray-400">{String(emp.department || '')}</div>
                  </td>

                  {/* ASO Column */}
                  <td className="px-3 py-3 whitespace-nowrap text-center">
                    <input 
                      type="date" 
                      value={req.asoExpiryDate || ''}
                      onChange={(e) => handleAsoChange(emp.id, e.target.value)}
                      className={`text-xs border rounded p-1 w-28 text-center focus:ring-yellow-500 
                        ${!isAsoValid ? 'border-red-300 bg-red-50 text-red-700 font-bold' : 'border-green-300 bg-green-50 text-green-700'}
                      `}
                    />
                  </td>

                  {/* Access Status */}
                  <td className="px-3 py-3 whitespace-nowrap text-center">
                    {accessGranted ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" /> GRANTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        <XCircle size={12} className="mr-1" /> BLOCKED
                      </span>
                    )}
                  </td>

                  {/* RAC Columns */}
                  {racDetails.map(({ rac, isRequired, isValid, expiry }) => (
                    <td key={rac} className="px-2 py-3 whitespace-nowrap border-l border-gray-100 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {/* Requirement Checkbox */}
                        <label className="flex items-center gap-1 text-[10px] text-gray-500 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={isRequired}
                            onChange={(e) => handleRequirementChange(emp.id, rac, e.target.checked)}
                            className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 h-3 w-3"
                          />
                          Required
                        </label>
                        
                        {/* Validity Display */}
                        {isValid ? (
                          <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            Valid: {String(expiry || '')}
                          </div>
                        ) : isRequired ? (
                          <div className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                            <AlertTriangle size={10} /> Missing
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-300">-</div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-2 bg-gray-50 text-xs text-center text-gray-500 border-t border-gray-200">
         Tip: Check "Required" to enforce compliance. Use the filters above to find employees missing specific requirements (e.g. "Missing RAC01").
      </div>
    </div>
  );
};

export default DatabasePage;