
import React, { useState, useRef, useMemo } from 'react';
import { UserRole, User, Site, Company } from '../types';
import { Shield, Plus, X, Trash2, Users, Lock, ChevronLeft, ChevronRight, Mail, Briefcase, CheckCircle2, XCircle, Search, Upload, Download, MapPin, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { COMPANIES } from '../constants';
import ConfirmModal from '../components/ConfirmModal';

interface UserManagementProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    contractors?: string[];
    sites?: Site[];
    companies?: Company[];
    currentUserRole: UserRole;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
    users, 
    setUsers, 
    contractors = [], 
    sites = [], 
    companies = [],
    currentUserRole 
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  
  const simulatedUserContext = useMemo(() => {
      if (currentUserRole === UserRole.ENTERPRISE_ADMIN) {
          return { companyId: 'c1', companyName: 'Vulcan', siteId: null };
      }
      if (currentUserRole === UserRole.SITE_ADMIN) {
          return { companyId: 'c1', companyName: 'Vulcan', siteId: 's1' }; // Moatize Mine
      }
      return { companyId: null, companyName: null, siteId: null }; // System Admin has no restrictions
  }, [currentUserRole]);

  const allowedRolesToCreate = useMemo(() => {
      const roles = [
          { value: UserRole.USER, label: 'General User (Worker)' },
          { value: UserRole.RAC_TRAINER, label: 'RAC Trainer' },
          { value: UserRole.RAC_ADMIN, label: 'RAC Admin' },
          { value: UserRole.DEPT_ADMIN, label: 'Department Admin' },
      ];

      if (currentUserRole === UserRole.SYSTEM_ADMIN) {
          return [
              { value: UserRole.SYSTEM_ADMIN, label: 'System Admin' },
              { value: UserRole.ENTERPRISE_ADMIN, label: 'Enterprise Admin' },
              { value: UserRole.SITE_ADMIN, label: 'Site Admin' },
              ...roles
          ];
      }
      if (currentUserRole === UserRole.ENTERPRISE_ADMIN) {
          return [
              { value: UserRole.SITE_ADMIN, label: 'Site Admin' },
              ...roles
          ];
      }
      return roles;
  }, [currentUserRole]);

  const allowedCompanies = useMemo(() => {
      if (currentUserRole === UserRole.SYSTEM_ADMIN) {
          const allTenants = companies.map(c => c.name);
          const allSubs = companies.flatMap(c => c.subContractors || []);
          return Array.from(new Set([...allTenants, ...allSubs, ...COMPANIES]));
      }

      const myTenantId = simulatedUserContext.companyId;
      const myTenant = companies.find(c => c.id === myTenantId);
      
      if (myTenant) {
          return [myTenant.name, ...(myTenant.subContractors || [])];
      }
      
      return contractors.length > 0 ? contractors : COMPANIES;
  }, [currentUserRole, companies, contractors, simulatedUserContext]);

  const allowedSites = useMemo(() => {
      if (currentUserRole === UserRole.SYSTEM_ADMIN || currentUserRole === UserRole.ENTERPRISE_ADMIN) {
          return sites; 
      }
      if (currentUserRole === UserRole.SITE_ADMIN && simulatedUserContext.siteId) {
          return sites.filter(s => s.id === simulatedUserContext.siteId);
      }
      return sites;
  }, [currentUserRole, sites, simulatedUserContext]);

  const defaultCompany = allowedCompanies[0] || 'Unknown';
  const defaultSiteId = simulatedUserContext.siteId || '';

  const [newUser, setNewUser] = useState<Partial<User>>({
      name: '', email: '', role: UserRole.USER, status: 'Active', company: defaultCompany, jobTitle: '', siteId: defaultSiteId
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const handleAddUser = () => {
      if (!newUser.name || !newUser.email) {
          alert("Name and Email required");
          return;
      }

      if (newUser.role === UserRole.RAC_ADMIN) {
          if (!newUser.siteId) {
              alert("Please select a site for the RAC Admin.");
              return;
          }
          const existingAdminsAtSite = users.filter(u => u.role === UserRole.RAC_ADMIN && u.siteId === newUser.siteId).length;
          if (existingAdminsAtSite >= 3) {
              alert(t.users.limitError);
              return;
          }
      }

      const userToAdd: User = {
          id: Date.now(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role || UserRole.USER,
          status: newUser.status || 'Active',
          company: newUser.company || defaultCompany,
          jobTitle: newUser.jobTitle || 'N/A',
          siteId: newUser.siteId || undefined
      };
      setUsers([...users, userToAdd]);
      setIsModalOpen(false);
      setNewUser({ 
          name: '', email: '', role: UserRole.USER, status: 'Active', 
          company: defaultCompany, jobTitle: '', siteId: defaultSiteId 
      });
  };

  const handleDeleteUser = (id: number) => {
      setConfirmState({
          isOpen: true,
          title: 'Delete User Account?',
          message: 'Are you sure you want to delete this user? This action cannot be undone.',
          onConfirm: () => setUsers(users.filter(u => u.id !== id)),
          isDestructive: true
      });
  };

  const handleDownloadTemplate = () => {}; 
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {}; 

  const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
                            u.email.toLowerCase().includes(filterQuery.toLowerCase()) ||
                            u.role.toLowerCase().includes(filterQuery.toLowerCase()) ||
                            u.company?.toLowerCase().includes(filterQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (currentUserRole === UserRole.SYSTEM_ADMIN) return true;
      
      if (currentUserRole === UserRole.ENTERPRISE_ADMIN) {
          return allowedCompanies.includes(u.company || '');
      }

      if (currentUserRole === UserRole.SITE_ADMIN) {
          if (u.siteId === simulatedUserContext.siteId) return true;
          return false; 
      }

      return false;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
  };

  const getRoleColor = (role: UserRole) => {
      switch(role) {
          case UserRole.SYSTEM_ADMIN: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
          case UserRole.ENTERPRISE_ADMIN: return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
          case UserRole.SITE_ADMIN: return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
          case UserRole.RAC_TRAINER: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
          case UserRole.RAC_ADMIN: return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
          default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up relative h-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
         <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
            <Users size={400} />
         </div>
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm">
                    <Shield size={28} className="text-green-400" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                      {t.users.title}
                  </h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">
                  {currentUserRole === UserRole.SYSTEM_ADMIN 
                    ? "Manage all tenants and system users." 
                    : currentUserRole === UserRole.ENTERPRISE_ADMIN 
                        ? `Manage users for ${simulatedUserContext.companyName} and sub-contractors.`
                        : `Manage site operations for ${sites.find(s => s.id === simulatedUserContext.siteId)?.name || 'your site'}.`
                  }
               </p>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5 text-sm"
                >
                    <Plus size={18} />
                    <span>{t.users.addUser}</span>
                </button>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden relative min-h-[500px]">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
                  value={filterQuery}
                  onChange={(e) => { setFilterQuery(e.target.value); setCurrentPage(1); }}
                />
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rows</span>
                    <select 
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="text-sm font-bold bg-transparent outline-none text-slate-800 dark:text-white cursor-pointer"
                    >
                        <option className="dark:bg-slate-800" value={10}>10</option>
                        <option className="dark:bg-slate-800" value={20}>20</option>
                        <option className="dark:bg-slate-800" value={50}>50</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.users.table.user}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">{t.common.company}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">{t.common.jobTitle}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.users.table.role}</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.users.table.status}</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.users.table.actions}</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                {paginatedUsers.map((user) => {
                const bgColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'];
                const colorClass = bgColors[user.id % bgColors.length];
                return (
                <tr key={String(user.id)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${colorClass}`}>
                            {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Mail size={10} /> {user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{user.company}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{user.jobTitle}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full uppercase border ${getRoleColor(user.role)}`}>
                            {user.role}
                        </span>
                        {user.siteId && (
                            <div className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                                <MapPin size={8} /> {sites.find(s => s.id === user.siteId)?.name || 'Unknown Site'}
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md text-xs font-bold border border-green-200 dark:border-green-900/50">
                                <CheckCircle2 size={12} /> Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-600">
                                <XCircle size={12} /> Inactive
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDeleteUser(user.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 size={18} />
                        </button>
                    </td>
                </tr>
                )})}
            </tbody>
            </table>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <div>Page {currentPage} of {Math.max(1, totalPages)}</div>
            <div className="flex gap-2">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"><ChevronLeft size={16}/></button>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.users.modal.title}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{t.users.modal.name}</label>
                            <div className="relative">
                                <input 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                                    placeholder="Full Name"
                                    value={newUser.name}
                                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                                />
                                <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{t.users.modal.email}</label>
                            <div className="relative">
                                <input 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                                    placeholder="Email Address"
                                    value={newUser.email}
                                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                                />
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Role</label>
                            <div className="relative">
                                <select 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white appearance-none cursor-pointer"
                                    value={newUser.role}
                                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                >
                                    {allowedRolesToCreate.map(r => (
                                        <option className="dark:bg-slate-800" key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Company</label>
                            <div className="relative">
                                <select 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white appearance-none cursor-pointer"
                                    value={newUser.company}
                                    onChange={e => setNewUser({...newUser, company: e.target.value})}
                                >
                                    {allowedCompanies.map(c => <option className="dark:bg-slate-800" key={c} value={c}>{c}</option>)}
                                </select>
                                <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                            </div>
                        </div>
                    </div>

                    {(newUser.role === UserRole.RAC_ADMIN || newUser.role === UserRole.SITE_ADMIN || newUser.role === UserRole.RAC_TRAINER) && (
                        <div className="animate-fade-in-up">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{t.users.modal.selectSite}</label>
                            <div className="relative">
                                <select 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white appearance-none cursor-pointer"
                                    value={newUser.siteId || ''}
                                    onChange={e => setNewUser({...newUser, siteId: e.target.value})}
                                    disabled={currentUserRole === UserRole.SITE_ADMIN}
                                >
                                    <option className="dark:bg-slate-800" value="">-- {t.users.modal.selectSite} --</option>
                                    {allowedSites.map(s => <option className="dark:bg-slate-800" key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
                                </select>
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                            </div>
                            
                            {newUser.role === UserRole.RAC_ADMIN && (
                                <p className="text-[10px] text-slate-400 mt-1 ml-1 flex justify-between">
                                    <span>{t.users.modal.siteRequired}</span>
                                    {newUser.siteId && (
                                        <span className={users.filter(u => u.role === UserRole.RAC_ADMIN && u.siteId === newUser.siteId).length >= 3 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                                            {t.users.modal.count}: {users.filter(u => u.role === UserRole.RAC_ADMIN && u.siteId === newUser.siteId).length}/3
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Job Title</label>
                        <input 
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            placeholder="e.g. Safety Officer"
                            value={newUser.jobTitle}
                            onChange={e => setNewUser({...newUser, jobTitle: e.target.value})}
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        {t.common.cancel}
                    </button>
                    <button 
                        onClick={handleAddUser}
                        className="px-8 py-2 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5"
                    >
                        {t.users.modal.createUser}
                    </button>
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

export default UserManagement;
