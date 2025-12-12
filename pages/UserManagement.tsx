
import React, { useState, useRef } from 'react';
import { UserRole, User } from '../types';
import { Shield, MoreVertical, Plus, X, Trash2, Edit, Users, Lock, Key, ChevronLeft, ChevronRight, Mail, Briefcase, CheckCircle2, XCircle, Search, Upload, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { COMPANIES } from '../constants';
import { AdvisorTrigger } from '../components/GeminiAdvisor';

interface UserManagementProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [newUser, setNewUser] = useState<Partial<User>>({
      name: '', email: '', role: UserRole.USER, status: 'Active', company: COMPANIES[0], jobTitle: ''
  });
  const [openActionId, setOpenActionId] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleAddUser = () => {
      if (!newUser.name || !newUser.email) {
          alert("Name and Email required");
          return;
      }
      const userToAdd: User = {
          id: Date.now(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role || UserRole.USER,
          status: newUser.status || 'Active',
          company: newUser.company || 'Unknown',
          jobTitle: newUser.jobTitle || 'N/A'
      };
      setUsers([...users, userToAdd]);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', role: UserRole.USER, status: 'Active', company: COMPANIES[0], jobTitle: '' });
  };

  const handleDeleteUser = (id: number) => {
      if (confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== id));
      }
      setOpenActionId(null);
  };

  const handleDownloadTemplate = () => {
      const headers = ['Name', 'Email', 'Role (System Admin/RAC Admin/RAC Trainer/Departmental Admin/User)', 'Status (Active/Inactive)', 'Company', 'Job Title'];
      const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "user_import_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
          const text = evt.target?.result as string;
          if (!text) return;

          const lines = text.split('\n');
          
          // Region Proof: Detect Separator
          const firstLine = lines[0] || '';
          const separator = firstLine.includes(';') ? ';' : ',';

          const dataRows = lines.slice(1);
          const newUsers: User[] = [];

          dataRows.forEach((line, index) => {
              if (!line.trim()) return;
              const cols = line.split(separator).map(c => c?.trim().replace(/^"|"$/g, ''));
              
              if (cols.length < 2) return; // Need at least Name and Email

              const name = cols[0];
              const email = cols[1];
              
              // Validate minimal data
              if (name && email) {
                  // Resolve Role Enum
                  let role = UserRole.USER;
                  const roleStr = cols[2]?.toLowerCase() || '';
                  if (roleStr.includes('system')) role = UserRole.SYSTEM_ADMIN;
                  else if (roleStr.includes('rac admin')) role = UserRole.RAC_ADMIN;
                  else if (roleStr.includes('trainer')) role = UserRole.RAC_TRAINER;
                  else if (roleStr.includes('dept')) role = UserRole.DEPT_ADMIN;

                  newUsers.push({
                      id: Date.now() + index, // Simple ID gen
                      name,
                      email,
                      role,
                      status: cols[3]?.toLowerCase() === 'inactive' ? 'Inactive' : 'Active',
                      company: cols[4] || 'Unknown',
                      jobTitle: cols[5] || 'N/A'
                  });
              }
          });

          if (newUsers.length > 0) {
              setUsers(prev => [...prev, ...newUsers]);
              alert(`Successfully imported ${newUsers.length} users.`);
          } else {
              alert("No valid user records found.");
          }
          if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsText(file);
  };

  // Filter Logic
  const filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(filterQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Pagination Logic
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
          case UserRole.RAC_ADMIN: return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
          case UserRole.RAC_TRAINER: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
          case UserRole.DEPT_ADMIN: return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
          default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up relative h-full">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
         <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
            <Users size={400} />
         </div>
         {/* Ambient Glow */}
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
                  {t.users.subtitle}
               </p>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-bold backdrop-blur-sm border border-white/10 transition-all text-xs"
                >
                    <Download size={16} /> Template
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-bold backdrop-blur-sm border border-white/10 transition-all text-xs"
                >
                    <Upload size={16} /> Import CSV
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5 text-sm"
                >
                    <Plus size={18} />
                    <span>{t.users.addUser}</span>
                </button>
            </div>
         </div>

         {/* Stats Row */}
         <div className="flex gap-8 mt-8 border-t border-white/10 pt-6">
             <div>
                 <div className="text-3xl font-black">{users.length}</div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Users</div>
             </div>
             <div className="w-px bg-white/10 h-10"></div>
             <div>
                 <div className="text-3xl font-black text-green-400">{users.filter(u => u.status === 'Active').length}</div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Active</div>
             </div>
             <div className="w-px bg-white/10 h-10"></div>
             <div>
                 <div className="text-3xl font-black text-blue-400">{users.filter(u => u.role === UserRole.SYSTEM_ADMIN).length}</div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Admins</div>
             </div>
         </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden relative min-h-[500px]">
        
        {/* Control Bar */}
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
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
        </div>

        {/* User Table */}
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
                        <div className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-slate-700`}>
                        {String(user.name).charAt(0)}
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{String(user.name)}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <Mail size={10} />
                            {String(user.email)}
                        </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{String(user.company || '-')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <Briefcase size={14} className="text-slate-400" />
                            {String(user.jobTitle || '-')}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getRoleColor(user.role)}`}>
                        <Key size={10} />
                        {String(user.role)}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                <CheckCircle2 size={12} /> Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                                <XCircle size={12} /> Inactive
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button 
                        onClick={() => setOpenActionId(openActionId === user.id ? null : user.id)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <MoreVertical size={18} />
                    </button>
                    {/* Dropdown Action Menu */}
                    {openActionId === user.id && (
                        <div className="absolute right-10 top-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                            <button className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors">
                                <Edit size={14} /> {t.common.edit}
                            </button>
                            <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors border-t border-slate-100 dark:border-slate-700"
                            >
                                <Trash2 size={14} /> {t.common.delete}
                            </button>
                        </div>
                    )}
                    </td>
                </tr>
                )})}
            </tbody>
            </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-4">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                     Page {currentPage} of {Math.max(1, totalPages)} • {users.length} Total
                 </div>
                 <AdvisorTrigger />
             </div>

             <div className="flex gap-2">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors text-slate-600 dark:text-slate-300"><ChevronLeft size={16} /></button>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors text-slate-600 dark:text-slate-300"><ChevronRight size={16} /></button>
             </div>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-0 overflow-hidden transform transition-all scale-100 border border-slate-200 dark:border-slate-700">
                   
                   <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                       <div>
                           <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.users.modal.title}</h3>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Create a new system user profile.</p>
                       </div>
                       <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors">
                           <X size={20} />
                       </button>
                   </div>

                   <div className="p-8 space-y-5">
                       <div>
                           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.users.modal.name}</label>
                           <input 
                             className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white transition-all" 
                             value={String(newUser.name)}
                             onChange={e => setNewUser({...newUser, name: e.target.value})}
                             placeholder="Full Name"
                           />
                       </div>
                       
                       <div>
                           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.users.modal.email}</label>
                           <input 
                             className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white transition-all" 
                             value={String(newUser.email)}
                             onChange={e => setNewUser({...newUser, email: e.target.value})}
                             placeholder="email@example.com"
                           />
                       </div>

                       <div className="grid grid-cols-2 gap-5">
                           <div>
                               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.common.company}</label>
                               <select 
                                   className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white appearance-none"
                                   value={String(newUser.company)}
                                   onChange={e => setNewUser({...newUser, company: e.target.value})}
                               >
                                   {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.common.role}</label>
                               <select 
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white appearance-none"
                                    value={String(newUser.role)}
                                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                >
                                    {Object.values(UserRole).map(r => <option key={String(r)} value={String(r)}>{String(r)}</option>)}
                                </select>
                           </div>
                       </div>
                       
                       <div>
                           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.common.jobTitle}</label>
                           <input 
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white transition-all"
                                value={String(newUser.jobTitle)}
                                onChange={e => setNewUser({...newUser, jobTitle: e.target.value})}
                                placeholder="e.g. Safety Officer"
                            />
                       </div>
                   </div>

                   <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                       <button 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                       <button 
                            onClick={handleAddUser} 
                            className="px-8 py-3 text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                           <Plus size={18} /> {t.users.modal.createUser}
                       </button>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserManagement;
