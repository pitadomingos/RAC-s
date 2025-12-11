
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Shield, MoreVertical, Plus, X, Trash2, Edit, Users, Lock, Key, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { COMPANIES } from '../constants';

interface UserManagementProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
      name: '', email: '', role: UserRole.USER, status: 'Active', company: COMPANIES[0], jobTitle: ''
  });
  const [openActionId, setOpenActionId] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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

  // Pagination Logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      {/* Header Command Center */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Users size={200} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <Shield size={32} className="text-green-400" />
                  {t.users.title}
               </h2>
               <p className="text-slate-400 mt-2 text-sm max-w-xl">
                  {t.users.subtitle}
               </p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-slate-900 px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5"
            >
                <Plus size={20} />
                <span>{t.users.addUser}</span>
            </button>
         </div>
         {/* Stats Row */}
         <div className="flex gap-8 mt-8 border-t border-white/10 pt-6">
             <div>
                 <div className="text-3xl font-black">{users.length}</div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Users</div>
             </div>
             <div>
                 <div className="text-3xl font-black text-green-400">{users.filter(u => u.status === 'Active').length}</div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Active</div>
             </div>
             <div>
                 <div className="text-3xl font-black text-blue-400">{users.filter(u => u.role === UserRole.SYSTEM_ADMIN).length}</div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Admins</div>
             </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">{t.users.table.user}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">{t.common.company}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">{t.common.jobTitle}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">{t.users.table.role}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">{t.users.table.status}</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-black uppercase tracking-wider">{t.users.table.actions}</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {paginatedUsers.map((user) => {
                const bgColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
                const colorClass = bgColors[user.id % bgColors.length];
                return (
                <tr key={String(user.id)} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center text-white font-bold shadow-md`}>
                        {String(user.name).charAt(0)}
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{String(user.name)}</div>
                        <div className="text-xs text-slate-500 font-mono">{String(user.email)}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">
                    {String(user.company || '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {String(user.jobTitle || '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full w-fit border border-slate-200">
                        <Key size={12} className="mr-2 text-slate-500" />
                        {String(user.role)}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-[10px] leading-4 font-black uppercase tracking-wider rounded-full 
                        ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {String(user.status)}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-500 relative">
                    <button 
                        onClick={() => setOpenActionId(openActionId === user.id ? null : user.id)}
                        className="hover:text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        <MoreVertical size={18} />
                    </button>
                    {/* Dropdown Action Menu */}
                    {openActionId === user.id && (
                        <div className="absolute right-10 top-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 text-left overflow-hidden animate-fade-in-up">
                            <button className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 text-slate-700 transition-colors">
                                <Edit size={14} /> {t.common.edit}
                            </button>
                            <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors border-t border-slate-100"
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
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-600">Rows per page:</span>
                 <select 
                    value={itemsPerPage}
                    onChange={handlePageSizeChange}
                    className="text-xs border border-slate-300 rounded bg-white text-slate-800 px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                 >
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={30}>30</option>
                     <option value={50}>50</option>
                     <option value={100}>100</option>
                     <option value={120}>120</option>
                 </select>
             </div>

             <div className="flex items-center gap-4">
                <div className="text-xs text-slate-600">
                    Page {currentPage} of {Math.max(1, totalPages)} ({users.length} total)
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronLeft size={16} /></button>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronRight size={16} /></button>
                </div>
             </div>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-2xl font-bold text-slate-800">{t.users.modal.title}</h3>
                       <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-full"><X size={20} /></button>
                   </div>
                   <div className="space-y-4">
                       <div>
                           <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.users.modal.name}</label>
                           <input 
                             className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                             value={String(newUser.name)}
                             onChange={e => setNewUser({...newUser, name: e.target.value})}
                           />
                       </div>
                       {/* ... rest of form ... */}
                       <div>
                           <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.users.modal.email}</label>
                           <input 
                             className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                             value={String(newUser.email)}
                             onChange={e => setNewUser({...newUser, email: e.target.value})}
                           />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.common.company}</label>
                               <select 
                                   className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                   value={String(newUser.company)}
                                   onChange={e => setNewUser({...newUser, company: e.target.value})}
                               >
                                   {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.common.role}</label>
                               <select 
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                    value={String(newUser.role)}
                                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                >
                                    {Object.values(UserRole).map(r => <option key={String(r)} value={String(r)}>{String(r)}</option>)}
                                </select>
                           </div>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.common.jobTitle}</label>
                           <input 
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                value={String(newUser.jobTitle)}
                                onChange={e => setNewUser({...newUser, jobTitle: e.target.value})}
                            />
                       </div>
                   </div>
                   <button onClick={handleAddUser} className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg">
                       {t.users.modal.createUser}
                   </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserManagement;
