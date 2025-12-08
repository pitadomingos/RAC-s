import React from 'react';
import { UserRole } from '../types';
import { User, Shield, MoreVertical, Plus } from 'lucide-react';

const UserManagement: React.FC = () => {
  // Mock Users
  const users = [
    { id: 1, name: 'System Admin', email: 'admin@vulcan.com', role: UserRole.SYSTEM_ADMIN, status: 'Active' },
    { id: 2, name: 'Sarah Connor', email: 'sarah.c@vulcan.com', role: UserRole.RAC_ADMIN, status: 'Active' },
    { id: 3, name: 'John Rambo', email: 'john.r@vulcan.com', role: UserRole.RAC_TRAINER, status: 'Active' },
    { id: 4, name: 'Ellen Ripley', email: 'e.ripley@vulcan.com', role: UserRole.DEPT_ADMIN, status: 'Active' },
    { id: 5, name: 'Regular User', email: 'user@vulcan.com', role: UserRole.USER, status: 'Inactive' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-gray-500">Manage system access and roles.</p>
        </div>
        <button className="flex items-center space-x-2 bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition">
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      <div className="overflow-x-auto">
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
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700">
                    <Shield size={14} className="mr-2 text-gray-400" />
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-500">
                  <button className="hover:text-slate-800"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;