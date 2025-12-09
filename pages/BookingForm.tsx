import React, { useState, useEffect } from 'react';
import { Employee, BookingStatus, Booking, UserRole, TrainingSession } from '../types';
import { COMPANIES, DEPARTMENTS, ROLES } from '../constants';
import { Plus, Trash2, Save, Settings, ShieldCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom';
import { sanitizeInput } from '../utils/security';
import { logger } from '../utils/logger';

interface BookingFormProps {
  addBookings: (newBookings: Booking[]) => void;
  sessions: TrainingSession[];
  userRole: UserRole;
}

const BookingForm: React.FC<BookingFormProps> = ({ addBookings, sessions, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSession, setSelectedSession] = useState('');
  
  const canManageSessions = userRole === UserRole.SYSTEM_ADMIN || userRole === UserRole.RAC_ADMIN;

  const initialRows = Array.from({ length: 5 }).map(() => ({
    id: uuidv4(),
    name: '',
    recordId: '',
    company: COMPANIES[0],
    department: DEPARTMENTS[0],
    role: ROLES[0],
    driverLicenseNumber: '',
    driverLicenseClass: '',
    driverLicenseExpiry: ''
  }));

  const [rows, setRows] = useState(initialRows);
  const [submitted, setSubmitted] = useState(false);

  // Effect to handle pre-fill data from "Renewals"
  useEffect(() => {
    if (location.state && location.state.prefill) {
        setRows(location.state.prefill);
        // Clear state history so refresh doesn't duplicate
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleRowChange = (index: number, field: keyof Employee, value: string) => {
    // Sanitize input for free-text fields
    const safeValue = (field === 'name' || field === 'recordId' || field === 'driverLicenseNumber' || field === 'driverLicenseClass') 
        ? sanitizeInput(value) 
        : value;

    const newRows = [...rows];
    // @ts-ignore
    newRows[index][field] = safeValue;
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
      driverLicenseNumber: '',
      driverLicenseClass: '',
      driverLicenseExpiry: ''
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

    const validRows = rows.filter(r => r.name.trim() !== '' && r.recordId.trim() !== '');

    if (validRows.length === 0) {
      alert("Please enter at least one employee.");
      return;
    }

    try {
        const newBookings: Booking[] = validRows.map(row => ({
            id: uuidv4(),
            sessionId: selectedSession,
            employee: { ...row },
            status: BookingStatus.PENDING,
        }));

        addBookings(newBookings);
        logger.audit('Manual Booking Submitted', userRole, { count: newBookings.length, session: selectedSession });

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setRows(initialRows);
        setSelectedSession('');
    } catch (err) {
        logger.error('Error submitting booking', err);
        alert('An error occurred while processing the booking.');
    }
  };

  // Check if RAC02 is selected to highlight DL fields
  const sessionData = sessions.find(s => s.id === selectedSession);
  const isRac02Selected = sessionData?.racType.includes('RAC02') || sessionData?.racType.includes('RAC 02');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-start">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Book Training Session</h2>
           <p className="text-sm text-gray-500 flex items-center gap-1">
             <ShieldCheck size={14} className="text-green-600" />
             Secure Data Entry Mode
           </p>
           {isRac02Selected && <p className="text-xs text-red-500 font-bold mt-1">Driver License details required for RAC 02.</p>}
        </div>
        {canManageSessions && (
            <button 
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
            >
                <Settings size={14} />
                <span>Manage Schedule</span>
            </button>
        )}
      </div>

      {submitted && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-fade-in-up">
          Booking submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Training Schedule</label>
          <select 
            value={selectedSession} 
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-2 border"
            required
          >
            <option value="">-- Choose a Session --</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>
                {session.racType} - {session.date} ({session.location})
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Name & ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                {isRac02Selected && (
                  <>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-red-600 font-bold">
                        DL No. / Class
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-red-600 font-bold">
                        DL Expiry
                    </th>
                  </>
                )}
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-3 py-2 space-y-2">
                    <input 
                      type="text" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                      placeholder="Full Name"
                      value={row.name}
                      onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                      placeholder="Record ID"
                      value={row.recordId}
                      onChange={(e) => handleRowChange(index, 'recordId', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 space-y-1">
                     <select 
                      className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm border p-1"
                      value={row.company}
                      onChange={(e) => handleRowChange(index, 'company', e.target.value)}
                    >
                      {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select 
                      className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm border p-1"
                      value={row.department}
                      onChange={(e) => handleRowChange(index, 'department', e.target.value)}
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  
                  {/* DL Fields - Only visible if RAC 02 */}
                  {isRac02Selected && (
                    <>
                      <td className="px-3 py-2 space-y-1 bg-red-50/50">
                         <input 
                            type="text" 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                            placeholder="DL Number"
                            value={row.driverLicenseNumber}
                            onChange={(e) => handleRowChange(index, 'driverLicenseNumber', e.target.value)}
                          />
                          <input 
                            type="text" 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                            placeholder="Class"
                            value={row.driverLicenseClass}
                            onChange={(e) => handleRowChange(index, 'driverLicenseClass', e.target.value)}
                          />
                      </td>
                      <td className="px-3 py-2 bg-red-50/50">
                          <input 
                            type="date" 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border p-1"
                            value={row.driverLicenseExpiry}
                            onChange={(e) => handleRowChange(index, 'driverLicenseExpiry', e.target.value)}
                          />
                      </td>
                    </>
                  )}

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