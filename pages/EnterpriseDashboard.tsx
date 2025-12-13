
import React, { useMemo, useState, useEffect } from 'react';
import { Site, Booking, EmployeeRequirement, BookingStatus, UserRole, Company } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  Globe, TrendingUp, AlertTriangle, Users, Building2, 
  Map as MapIcon, Filter, Sparkles, FileText, Briefcase, Zap,
  Server, ShieldCheck
} from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import { generateSafetyReport } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface EnterpriseDashboardProps {
  sites: Site[];
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  userRole?: UserRole;
  contractors?: string[]; // Kept for legacy/Enterprise Admin view
  companies?: Company[]; // Passed from App.tsx for System Admin view
}

// Helper Type for Pre-Calculated Data
interface AggregatedEmployee {
    id: string;
    company: string;
    dept: string;
    siteId: string;
    isCompliant: boolean;
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ 
    sites, 
    bookings, 
    requirements, 
    userRole, 
    contractors = [], 
    companies = [] // List of Tenants (Enterprises)
}) => {
  const { language, t } = useLanguage();
  
  // --- Filters State ---
  // System Admin selects "Tenant". Enterprise Admin is locked to one.
  const [selectedTenantId, setSelectedTenantId] = useState<string>('All');
  
  // "Contractor" here means the subcontractor within the tenant.
  const [selectedContractor, setSelectedContractor] = useState<string>('All');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // --- AUTO-SELECT TENANT FOR SIMULATION ---
  // If user switches to Enterprise Admin, auto-select 'Vulcan' (c1) to simulate context
  useEffect(() => {
      if (userRole === UserRole.ENTERPRISE_ADMIN) {
          // Find Vulcan or default to first company
          const target = companies.find(c => c.name === 'Vulcan') || companies[0];
          if (target && selectedTenantId === 'All') {
              setSelectedTenantId(target.id);
          }
      } else if (userRole === UserRole.SYSTEM_ADMIN && selectedTenantId !== 'All') {
          // Optional: Reset to All when switching back to System Admin
          // setSelectedTenantId('All'); 
      }
  }, [userRole, companies]);

  // --- DERIVED LISTS (DYNAMIC) ---

  // 1. Available Contractors (Depends on Selected Tenant)
  const availableContractors = useMemo(() => {
      if (selectedTenantId === 'All') {
          // Flatten ALL contractors from ALL companies
          const allSubs = companies.flatMap(c => c.subContractors || []);
          return Array.from(new Set(allSubs)).sort();
      } else {
          // Return only this Tenant's contractors
          const tenant = companies.find(c => c.id === selectedTenantId);
          return tenant ? (tenant.subContractors || []) : [];
      }
  }, [companies, selectedTenantId]);

  // --- FILTERING & COMPLIANCE LOGIC (Unified Pipeline) ---
  // Calculates compliance ONCE for every employee, then filters.
  // This guarantees that if an employee is in the "Total", they have a compliance status attached.
  const filteredEmployeeData = useMemo<AggregatedEmployee[]>(() => {
      const empMap = new Map<string, AggregatedEmployee>();
      const today = new Date().toISOString().split('T')[0];
      
      // 1. First pass: Get all unique employees from Requirements (The master list)
      requirements.forEach(req => {
          // Try to find more details from a booking if it exists (to get company/dept)
          const booking = bookings.find(b => b.employee.id === req.employeeId);
          
          const id = req.employeeId;
          const empCompany = booking?.employee.company || 'Unknown'; // This is the Contractor Name
          const dept = booking?.employee.department || 'Operations';
          const siteId = booking?.employee.siteId || 's1'; 

          // --- COMPLIANCE CHECK ---
          const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
          let allRacsMet = true;
          Object.keys(req.requiredRacs).forEach(racKey => {
              if (req.requiredRacs[racKey]) {
                  const validBooking = bookings.find(b => {
                      if (b.employee.id !== id) return false;
                      if (b.status !== BookingStatus.PASSED) return false;
                      if (!b.expiryDate || b.expiryDate <= today) return false;
                      
                      const bRacKey = b.sessionId.includes(' - ') ? b.sessionId.split(' - ')[0] : b.sessionId;
                      return bRacKey.replace(/\s+/g, '') === racKey.replace(/\s+/g, '');
                  });
                  if (!validBooking) allRacsMet = false;
              }
          });
          const isCompliant = isAsoValid && allRacsMet;

          // --- TENANT MATCHING LOGIC ---
          let belongsToSelectedTenant = true;
          if (selectedTenantId !== 'All') {
              const selectedTenant = companies.find(c => c.id === selectedTenantId);
              if (selectedTenant) {
                  const isDirect = selectedTenant.name === empCompany;
                  const isSub = (selectedTenant.subContractors || []).includes(empCompany);
                  
                  // Loose matching
                  const isDirectLoose = selectedTenant.name.toLowerCase() === empCompany.toLowerCase();
                  const isSubLoose = (selectedTenant.subContractors || []).some(sc => sc.toLowerCase() === empCompany.toLowerCase());

                  if (!isDirect && !isSub && !isDirectLoose && !isSubLoose) belongsToSelectedTenant = false;
              }
          }

          const matchesContractor = selectedContractor === 'All' || empCompany === selectedContractor;
          const matchesSite = selectedSiteId === 'All' || siteId === selectedSiteId;
          const matchesDept = selectedDept === 'All' || dept === selectedDept;

          if (belongsToSelectedTenant && matchesContractor && matchesSite && matchesDept) {
              empMap.set(id, { id, company: empCompany, dept, siteId, isCompliant });
          }
      });

      return Array.from(empMap.values());
  }, [bookings, requirements, companies, selectedTenantId, selectedContractor, selectedSiteId, selectedDept]);

  // 2. Calculate Compliance Stats (Aggregated from Filtered Data)
  const complianceStats = useMemo(() => {
      let compliant = 0;
      let nonCompliant = 0;
      
      const byDept: Record<string, { total: number, compliant: number }> = {};
      const byRac: Record<string, { total: number, passed: number }> = {}; // Note: RAC breakdown is slightly different as it needs granularity

      filteredEmployeeData.forEach(emp => {
          if (emp.isCompliant) compliant++;
          else nonCompliant++;

          // Dept Stats
          if (!byDept[emp.dept]) byDept[emp.dept] = { total: 0, compliant: 0 };
          byDept[emp.dept].total++;
          if (emp.isCompliant) byDept[emp.dept].compliant++;
      });

      // Recalculate RAC specific stats (needs access to raw requirements/bookings but constrained to filtered employees)
      const today = new Date().toISOString().split('T')[0];
      filteredEmployeeData.forEach(emp => {
          const req = requirements.find(r => r.employeeId === emp.id);
          if (req) {
              Object.keys(req.requiredRacs).forEach(racKey => {
                  if (req.requiredRacs[racKey]) {
                      if (!byRac[racKey]) byRac[racKey] = { total: 0, passed: 0 };
                      byRac[racKey].total++;

                      const validBooking = bookings.find(b => {
                          if (b.employee.id !== emp.id) return false;
                          if (b.status !== BookingStatus.PASSED) return false;
                          if (!b.expiryDate || b.expiryDate <= today) return false;
                          
                          const bRacKey = b.sessionId.includes(' - ') ? b.sessionId.split(' - ')[0] : b.sessionId;
                          return bRacKey.replace(/\s+/g, '') === racKey.replace(/\s+/g, '');
                      });

                      if (validBooking) byRac[racKey].passed++;
                  }
              });
          }
      });

      return {
          total: filteredEmployeeData.length,
          compliant,
          nonCompliant,
          byDept,
          byRac
      };
  }, [filteredEmployeeData, requirements, bookings]);

  // 3. Platform Tenant Comparison (System Admin Only)
  const tenantPerformanceData = useMemo(() => {
      if (userRole !== UserRole.SYSTEM_ADMIN || selectedTenantId !== 'All') return [];

      return companies.map(tenant => {
          // Find employees belonging to this tenant
          let tenantEmpCount = 0;
          let tenantCompliantCount = 0;

          // Using the raw requirements list to avoid double filtering
          requirements.forEach(req => {
              const booking = bookings.find(b => b.employee.id === req.employeeId);
              const empCompany = booking?.employee.company || '';
              
              const isDirect = tenant.name.toLowerCase() === empCompany.toLowerCase();
              const isSub = (tenant.subContractors || []).some(sc => sc.toLowerCase() === empCompany.toLowerCase());
              
              if (isDirect || isSub) {
                  tenantEmpCount++;
                  
                  // Quick Compliance Check logic duplication for speed/independence
                  const today = new Date().toISOString().split('T')[0];
                  const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
                  let allRacsMet = true;
                  Object.keys(req.requiredRacs).forEach(k => {
                      if (req.requiredRacs[k]) {
                          const has = bookings.some(b => {
                              if (b.employee.id !== req.employeeId || b.status !== 'Passed' || !b.expiryDate || b.expiryDate <= today) return false;
                              const bRacKey = b.sessionId.includes(' - ') ? b.sessionId.split(' - ')[0] : b.sessionId;
                              return bRacKey.replace(/\s+/g, '') === k.replace(/\s+/g, '');
                          });
                          if (!has) allRacsMet = false;
                      }
                  });
                  if (isAsoValid && allRacsMet) tenantCompliantCount++;
              }
          });

          return {
              name: tenant.name,
              rate: tenantEmpCount > 0 ? ((tenantCompliantCount / tenantEmpCount) * 100).toFixed(1) : '0.0',
              total: tenantEmpCount
          };
      }).sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

  }, [companies, requirements, bookings, userRole, selectedTenantId]);

  // 4. Contractor Comparison (Aggregated from filteredEmployeeData)
  const contractorComparisonData = useMemo(() => {
      const compMap = new Map<string, {total: number, compliant: number}>();
      
      filteredEmployeeData.forEach(emp => {
          // Ensure map entry exists
          if (!compMap.has(emp.company)) {
              compMap.set(emp.company, {total: 0, compliant: 0});
          }
          
          const stats = compMap.get(emp.company)!;
          stats.total++;
          if (emp.isCompliant) stats.compliant++;
      });
      
      return Array.from(compMap.entries()).map(([name, data]) => ({
          name,
          rate: data.total > 0 ? Number(((data.compliant / data.total) * 100).toFixed(1)) : 0,
          displayRate: data.total > 0 ? ((data.compliant / data.total) * 100).toFixed(1) : '0.0',
          total: data.total
      })).sort((a, b) => b.rate - a.rate);
  }, [filteredEmployeeData]);

  // 5. Department Heatmap Data
  const deptHeatmapData = useMemo(() => {
      return Object.entries(complianceStats.byDept).map(([dept, data]: [string, { total: number, compliant: number }]) => ({
          name: dept,
          rate: data.total > 0 ? ((data.compliant / data.total) * 100) : 0,
          total: data.total
      })).sort((a, b) => a.rate - b.rate); // Worst performing first
  }, [complianceStats.byDept]);

  // 6. RAC Bottleneck Data
  const racBottleneckData = useMemo(() => {
      return Object.entries(complianceStats.byRac).map(([rac, data]: [string, { total: number, passed: number }]) => ({
          name: rac,
          failRate: data.total > 0 ? (((data.total - data.passed) / data.total) * 100) : 0
      })).sort((a, b) => b.failRate - a.failRate).slice(0, 5); // Top 5 worst
  }, [complianceStats.byRac]);

  const globalHealthScore = complianceStats.total > 0 ? (complianceStats.compliant / complianceStats.total) * 100 : 0;

  // -- AI --
  const handleGenerateExecutiveReport = async () => {
      setIsGenerating(true);
      const roleContext = userRole === UserRole.SYSTEM_ADMIN ? 'System Administrator' : 'HSE Director';
      const systemScope = userRole === UserRole.SYSTEM_ADMIN ? 'Multi-Tenant Platform' : 'Enterprise';

      const context = {
          role: roleContext,
          scope: systemScope,
          filters: { tenant: selectedTenantId, contractor: selectedContractor, dept: selectedDept },
          stats: {
              globalScore: globalHealthScore.toFixed(1) + '%',
              totalWorkforce: complianceStats.total,
              contractorBreakdown: contractorComparisonData.map(c => `${c.name}: ${c.displayRate}%`),
              riskDepartments: deptHeatmapData.slice(0, 3).map(d => `${d.name} (${d.rate.toFixed(1)}%)`),
              trainingBottlenecks: racBottleneckData.map(r => `${r.name} (${r.failRate.toFixed(1)}% Fail)`)
          }
      };
      const report = await generateSafetyReport(context, 'Current Quarter', language);
      setAiReport(report);
      setIsGenerating(false);
  };

  const getHealthColor = (score: number) => {
      if (score >= 90) return 'text-emerald-500';
      if (score >= 75) return 'text-yellow-500';
      return 'text-red-500';
  };

  const selectedTenantName = companies.find(c => c.id === selectedTenantId)?.name || 'All Tenants';

  return (
    <div className="space-y-8 pb-20 animate-fade-in-up">
        
        {/* --- FILTERS HEADER --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col xl:flex-row justify-between gap-6 transition-all sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl shadow-lg text-white ${userRole === UserRole.SYSTEM_ADMIN ? 'bg-gradient-to-br from-slate-700 to-slate-900' : 'bg-gradient-to-br from-indigo-600 to-violet-600'}`}>
                    {userRole === UserRole.SYSTEM_ADMIN ? <Server size={28} /> : <Globe size={28} />}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        {userRole === UserRole.SYSTEM_ADMIN ? 'Platform Command Center' : t.enterprise.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                        {userRole === UserRole.SYSTEM_ADMIN ? 'Multi-Tenant Aggregation Layer' : t.enterprise.subtitle}
                        {userRole === UserRole.ENTERPRISE_ADMIN && (
                            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                                {selectedTenantName} Context
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* 1. Tenant Selector (System Admin Only) */}
                {userRole === UserRole.SYSTEM_ADMIN && (
                    <div className="flex items-center gap-2 bg-slate-900 text-white p-2 rounded-xl border border-slate-700 shadow-md">
                        <Building2 size={16} className="ml-1 text-cyan-400" />
                        <select 
                            value={selectedTenantId}
                            onChange={(e) => {
                                setSelectedTenantId(e.target.value);
                                setSelectedContractor('All'); // Reset
                            }}
                            className="bg-slate-900 text-sm font-bold outline-none cursor-pointer pr-2"
                        >
                            <option className="bg-slate-900" value="All">{t.common.allTenants}</option>
                            {companies.map(c => <option className="bg-slate-900" key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                )}

                {/* 2. Contractor Selector (Filtered by Tenant) */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded-xl border border-slate-200 dark:border-slate-600">
                    <Briefcase size={16} className="text-slate-400 ml-1" />
                    <select 
                        value={selectedContractor}
                        onChange={(e) => setSelectedContractor(e.target.value)}
                        className="bg-transparent dark:bg-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-2"
                    >
                        <option className="dark:bg-slate-700" value="All">{t.common.allContractors}</option>
                        {availableContractors.map(c => <option className="dark:bg-slate-700" key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* 3. Site Selector */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded-xl border border-slate-200 dark:border-slate-600">
                    <MapIcon size={16} className="text-slate-400 ml-1" />
                    <select 
                        value={selectedSiteId}
                        onChange={(e) => setSelectedSiteId(e.target.value)}
                        className="bg-transparent dark:bg-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-2"
                    >
                        <option className="dark:bg-slate-700" value="All">{t.common.allSites}</option>
                        {sites.map(s => <option className="dark:bg-slate-700" key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                {/* 4. Dept Selector */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded-xl border border-slate-200 dark:border-slate-600">
                    <Filter size={16} className="text-slate-400 ml-1" />
                    <select 
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="bg-transparent dark:bg-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-2"
                    >
                        <option className="dark:bg-slate-700" value="All">{t.common.allDepts}</option>
                        {DEPARTMENTS.map(d => <option className="dark:bg-slate-700" key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.enterprise.globalHealth}</p>
                <div className="flex items-end gap-3">
                    <h3 className={`text-4xl font-black ${getHealthColor(globalHealthScore)}`}>{globalHealthScore.toFixed(1)}%</h3>
                    <TrendingUp size={24} className={getHealthColor(globalHealthScore)} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.enterprise.totalWorkforce}</p>
                <div className="flex items-end gap-3">
                    <h3 className="text-4xl font-black text-slate-800 dark:text-white">{complianceStats.total}</h3>
                    <Users size={24} className="text-blue-500" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.enterprise.topPerformer}</p>
                {contractorComparisonData.length > 0 ? (
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 truncate">{contractorComparisonData[0].name}</h3>
                        <span className="text-sm font-bold text-slate-400">{contractorComparisonData[0].displayRate}% Compliance</span>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400 italic">No Data</span>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.enterprise.needsAttention}</p>
                {deptHeatmapData.length > 0 ? (
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black text-red-500 truncate">{deptHeatmapData[0].name}</h3>
                        <span className="text-sm font-bold text-slate-400">{deptHeatmapData[0].rate.toFixed(1)}% Compliance</span>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">No Data</span>
                )}
            </div>
        </div>

        {/* --- SYSTEM ADMIN: TENANT MATRIX (Only if All Tenants selected) --- */}
        {userRole === UserRole.SYSTEM_ADMIN && selectedTenantId === 'All' && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 text-white animate-fade-in-down">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Building2 size={20} className="text-cyan-400"/> {t.enterprise.tenantMatrix}
                    </h3>
                    <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded border border-slate-600">{t.enterprise.systemView}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tenantPerformanceData.map((comp, i) => (
                        <div key={i} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:border-cyan-500/50 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm truncate">{comp.name}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${parseFloat(comp.rate) > 80 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {comp.rate}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-600 h-1.5 rounded-full overflow-hidden mb-2">
                                <div className={`h-full rounded-full ${parseFloat(comp.rate) > 80 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${comp.rate}%`}}></div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-right">{comp.total} employees</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- MAIN CHARTS AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Contractor/Site Comparison Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-indigo-500"/> Contractor Performance
                </h3>
                <div className="h-80 w-full">
                    {contractorComparisonData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={contractorComparisonData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                                {/* IMPORTANT: Use `rate` (number) for dataKey to ensure bars render height */}
                                <Bar dataKey="rate" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                                    {contractorComparisonData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.rate >= 90 ? '#10b981' : entry.rate >= 75 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            Select filters to view comparison
                        </div>
                    )}
                </div>
            </div>

            {/* Department Risk Heatmap */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t.enterprise.deptHeatmap}</h3>
                <p className="text-xs text-slate-500 mb-6">Lowest compliance shown first</p>
                
                <div className="flex-1 space-y-4 overflow-y-auto max-h-80 pr-2">
                    {deptHeatmapData.map((dept, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${dept.rate >= 90 ? 'bg-emerald-500' : dept.rate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}>
                                {dept.rate.toFixed(0)}%
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">{dept.name}</span>
                                    <span className="text-xs text-slate-400">{dept.total} staff</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${dept.rate >= 90 ? 'bg-emerald-500' : dept.rate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                        style={{ width: `${dept.rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- AI & BOTTLENECKS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Executive Summary */}
            <div className="lg:col-span-2 relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${userRole === UserRole.SYSTEM_ADMIN ? 'from-slate-600 to-slate-400' : 'from-violet-500 to-fuchsia-500'}`}></div>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${userRole === UserRole.SYSTEM_ADMIN ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'}`}>
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                    {userRole === UserRole.SYSTEM_ADMIN ? 'System AI Auditor' : 'Executive AI Director'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {userRole === UserRole.SYSTEM_ADMIN ? 'Platform-wide safety intelligence' : `Strategic insights for ${selectedTenantName}`}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleGenerateExecutiveReport}
                            disabled={isGenerating}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg transition-all transform hover:scale-105
                                ${isGenerating ? 'bg-slate-400' : (userRole === UserRole.SYSTEM_ADMIN ? 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500')}
                            `}
                        >
                            {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full"/> : <Sparkles size={14}/>}
                            {isGenerating ? 'Analyzing System Data...' : 'Generate Strategic Report'}
                        </button>
                    </div>

                    <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700 overflow-y-auto min-h-[200px]">
                        {aiReport ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert text-slate-800 dark:text-slate-300">
                                {aiReport.split('\n').map((line, i) => (
                                    <p key={i} className={`
                                        ${line.startsWith('##') ? 'text-lg font-bold text-indigo-900 dark:text-indigo-200 mt-4 mb-2' : 'text-slate-700 dark:text-slate-300 mb-2'}
                                    `}>
                                        {line.replace(/#/g, '').replace(/\*\*/g, '')}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                <Zap size={48} className={`mb-4 ${userRole === UserRole.SYSTEM_ADMIN ? 'text-slate-300' : 'text-violet-300 dark:text-violet-900'}`} />
                                <p className="text-center font-medium">{t.enterprise.clickToGen} <br/> {userRole === UserRole.SYSTEM_ADMIN ? t.enterprise.multiTenantDiag : t.enterprise.safetyIntel}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Training Bottlenecks */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-500" /> {t.enterprise.bottlenecks}
                </h3>
                <div className="space-y-4">
                    {racBottleneckData.map((rac, i) => (
                        <div key={i} className="group p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-slate-800 dark:text-orange-200 text-sm">{rac.name}</span>
                                <span className="text-xs font-black text-red-500">{rac.failRate.toFixed(1)}% Failure</span>
                            </div>
                            <div className="w-full bg-orange-200 dark:bg-orange-900/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full rounded-full" style={{ width: `${rac.failRate}%` }}></div>
                            </div>
                        </div>
                    ))}
                    {racBottleneckData.length === 0 && <p className="text-slate-400 text-sm text-center py-4">{t.enterprise.noBottlenecks}</p>}
                </div>
            </div>

        </div>
    </div>
  );
};

export default EnterpriseDashboard;
