
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Shield, MoreVertical, Plus, X, Trash2, Edit } from 'lucide-react';

interface UserManagementProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
      name: '', email: '', role: UserRole.USER, status: 'Active'
  });
  const [openActionId, setOpenActionId] = useState<number | null>(null);

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
          status: newUser.status || 'Active'
      };
      setUsers([...users, userToAdd]);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', role: UserRole.USER, status: 'Active' });
  };

  const handleDeleteUser = (id: number) => {
      if (confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== id));
      }
      setOpenActionId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-gray-500">Manage system access and roles.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
        >
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      <div className="overflow-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={String(user.id)} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                      {String(user.name).charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{String(user.name)}</div>
                      <div className="text-sm text-gray-500">{String(user.email)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700">
                    <Shield size={14} className="mr-2 text-gray-400" />
                    {String(user.role)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {String(user.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-500 relative">
                  <button 
                    onClick={() => setOpenActionId(openActionId === user.id ? null : user.id)}
                    className="hover:text-slate-800 p-1 rounded-full hover:bg-gray-100"
                  >
                      <MoreVertical size={18} />
                  </button>
                  {/* Dropdown Action Menu */}
                  {openActionId === user.id && (
                      <div className="absolute right-8 top-8 w-32 bg-white border border-gray-200 rounded shadow-lg z-20 text-left">
                          <button className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2">
                              <Edit size={12} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                              <Trash2 size={12} /> Delete
                          </button>
                      </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-fade-in-up">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="text-lg font-bold">Add New User</h3>
                       <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
                   </div>
                   <div className="space-y-3">
                       <input 
                         className="w-full border rounded p-2 text-sm" 
                         placeholder="Full Name"
                         value={String(newUser.name)}
                         onChange={e => setNewUser({...newUser, name: e.target.value})}
                       />
                       <input 
                         className="w-full border rounded p-2 text-sm" 
                         placeholder="Email Address"
                         value={String(newUser.email)}
                         onChange={e => setNewUser({...newUser, email: e.target.value})}
                       />
                       <select 
                         className="w-full border rounded p-2 text-sm"
                         value={String(newUser.role)}
                         onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                       >
                           {Object.values(UserRole).map(r => <option key={String(r)} value={String(r)}>{String(r)}</option>)}
                       </select>
                   </div>
                   <button 
                    onClick={handleAddUser}
                    className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm"
                   >
                       Create User
                   </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserManagement;
