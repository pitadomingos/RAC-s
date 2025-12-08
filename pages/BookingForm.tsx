import React, { useState } from 'react';
import { Employee, BookingStatus, Booking, UserRole } from '../types';
import { COMPANIES, DEPARTMENTS, ROLES, MOCK_SESSIONS } from '../constants';
import { Plus, Trash2, Save, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface BookingFormProps {
  addBookings: (newBookings: Booking[]) => void;
  userRole: UserRole;
}

const BookingForm: React.FC<BookingFormProps> = ({ addBookings, userRole }) => {
  const [selectedSession, setSelectedSession] = useState('');
  
  const canManageSessions = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN;

  // Initialize with 10 empty rows as per requirement
  const initialRows = Array.from({ length: 10 }).map(() => ({
    id: uuidv4(),
    name: '',
    recordId: '',
    company: COMPANIES[0],
    department: DEPARTMENTS[0],
    role: ROLES[0],
    ga: ''
  }));

  const [rows, setRows] = useState(initialRows);
  const [submitted, setSubmitted] = useState(false);

  const handleRowChange = (index: number, field: keyof Employee, value: string) => {
    const newRows = [...rows];
    // @ts-ignore
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, {
      id: uuidv4(),
      name: '',
      recordId: '',
      company: COMPANIES[0],
      department: DEPARTMENTS[0],
      role: ROLES[0],
      ga: ''
    }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) {
      alert("Please select a training session.");
      return;
    }

    // Filter out empty rows (must have Name and ID)
    const validRows = rows.filter(r => r.name.trim() !== '' && r.recordId.trim() !== '');

    if (validRows.length === 0) {
      alert("Please enter at least one employee.");
      return;
    }

    const newBookings: Booking[] = validRows.map(row => ({
      id: uuidv4(),
      sessionId: selectedSession,
      employee: { ...row },
      status: BookingStatus.PENDING,
    }));

    addBookings(newBookings);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    // Reset form
    setRows(initialRows);
    setSelectedSession('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-start">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Book Training Session</h2>
           <p className="text-sm text-gray-500">Register employees for upcoming RAC training. Default 10 slots.</p>
        </div>
        {canManageSessions && (
            <button className="flex items-center gap-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors">
                <Settings size={14} />
                <span>Manage Schedule</span>
            </button>
        )}
      </div>

      {submitted && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          Booking submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Session Selector */}
        <div className="mb-6 max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Training Schedule</label>
          <select 
            value={selectedSession} 
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-2 border"
            required
          >
            <option value="">-- Choose a Session --</option>
            {MOCK_SESSIONS.map(session => (
              <option key={session.id} value={session.id}>
                {session.racType} - {session.date} ({session.location})
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Grid */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">ID / Company No.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">GA</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                      placeholder="Full Name"
                      value={row.name}
                      onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                      placeholder="Record ID"
                      value={row.recordId}
                      onChange={(e) => handleRowChange(index, 'recordId', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                     <select 
                      className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm border p-1"
                      value={row.company}
                      onChange={(e) => handleRowChange(index, 'company', e.target.value)}
                    >
                      {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select 
                      className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm border p-1"
                      value={row.department}
                      onChange={(e) => handleRowChange(index, 'department', e.target.value)}
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                     <select 
                      className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm border p-1"
                      value={row.role}
                      onChange={(e) => handleRowChange(index, 'role', e.target.value)}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input 
                      type="text" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                      placeholder="Area"
                      value={row.ga}
                      onChange={(e) => handleRowChange(index, 'ga', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button 
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <button 
            type="button" 
            onClick={addRow}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} />
            <span>Add Row</span>
          </button>

          <button 
            type="submit"
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-2 rounded-lg font-bold shadow-sm transition-colors"
          >
            <Save size={18} />
            <span>Submit Booking</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;