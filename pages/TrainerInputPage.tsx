import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, RAC } from '../types';
import { MOCK_SESSIONS } from '../constants';
import { Save, AlertCircle, CheckCircle, Lock, Users, ClipboardList } from 'lucide-react';

interface TrainerInputPageProps {
  bookings: Booking[];
  updateBookings: (updates: Booking[]) => void;
}

const TrainerInputPage: React.FC<TrainerInputPageProps> = ({ bookings, updateBookings }) => {
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [sessionBookings, setSessionBookings] = useState<Booking[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // When session changes, load bookings into local state
  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSelectedSessionId(sId);
    if (sId) {
      const filtered = bookings.filter(b => b.sessionId === sId);
      // Initialize scores if undefined
      const initialized = filtered.map(b => ({
        ...b,
        attendance: b.attendance ?? false,
        theoryScore: b.theoryScore ?? 0,
        practicalScore: b.practicalScore ?? 0
      }));
      setSessionBookings(initialized);
    } else {
      setSessionBookings([]);
    }
    setHasUnsavedChanges(false);
    setSuccessMsg('');
  };

  // Helper: Auto-calculate Status based on logic
  const calculateStatus = (booking: Booking, isRac02: boolean): BookingStatus => {
    // If absent, cannot pass (could be FAILED or PENDING, let's say FAILED if graded)
    if (!booking.attendance) return BookingStatus.FAILED;

    const theory = booking.theoryScore || 0;
    const practical = booking.practicalScore || 0;

    // RAC 02 Specific Logic
    if (isRac02) {
      // Must pass theory (70) to even be considered for practical
      if (theory < 70) return BookingStatus.FAILED;
      // Must pass practical (70) as well
      if (practical < 70) return BookingStatus.FAILED;
      return BookingStatus.PASSED;
    }

    // Standard Logic (Theory only)
    if (theory >= 70) return BookingStatus.PASSED;
    return BookingStatus.FAILED;
  };

  const handleInputChange = (id: string, field: keyof Booking, value: any) => {
    const selectedSession = MOCK_SESSIONS.find(s => s.id === selectedSessionId);
    const isRac02 = selectedSession?.racType.includes('RAC 02') || selectedSession?.racType.includes('RAC02') || false;

    setSessionBookings(prev => prev.map(b => {
      if (b.id !== id) return b;

      const updatedBooking = { ...b, [field]: value };

      // Specialized Logic for RAC 02 Theory Change
      if (isRac02 && field === 'theoryScore') {
        const score = parseInt(value) || 0;
        // If Theory < 70, Practical is effectively void/disabled. Reset it? 
        // User requirement: "If one failed theory, he has no right to proceed to practical."
        if (score < 70) {
          updatedBooking.practicalScore = 0;
        }
      }

      // Auto-calculate Status
      updatedBooking.status = calculateStatus(updatedBooking, isRac02);

      return updatedBooking;
    }));
    
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    updateBookings(sessionBookings);
    setHasUnsavedChanges(false);
    setSuccessMsg('Results saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getSessionStats = (sessionId: string) => {
    const sessionList = bookings.filter(b => b.sessionId === sessionId);
    const total = sessionList.length;
    const pending = sessionList.filter(b => b.status === BookingStatus.PENDING).length;
    return { total, pending };
  };

  const selectedSessionDetails = MOCK_SESSIONS.find(s => s.id === selectedSessionId);
  const isRac02 = selectedSessionDetails?.racType.includes('RAC 02') || selectedSessionDetails?.racType.includes('RAC02');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Trainer Input Portal</h2>
          <p className="text-sm text-gray-500">Record attendance and exam results. <span className="font-bold text-yellow-600">Pass Mark: 70%</span></p>
        </div>
        {successMsg && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg text-sm font-medium animate-pulse">
                <CheckCircle size={16} />
                {successMsg}
            </div>
        )}
      </div>

      {/* Session Selector */}
      <div className="mb-8 max-w-xl">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Active Session</label>
        <div className="relative">
          <select 
            value={selectedSessionId} 
            onChange={handleSessionChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-2 border pl-10"
          >
            <option value="">-- Select a Session to Grade --</option>
            {MOCK_SESSIONS.map(session => {
              const { total, pending } = getSessionStats(session.id);
              return (
                <option key={session.id} value={session.id}>
                  {session.racType} - {session.date} • {total} Attendees {pending > 0 ? `(${pending} Pending)` : ''}
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <ClipboardList size={18} />
          </div>
        </div>
      </div>

      {/* Grading Table */}
      {selectedSessionId && sessionBookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Employee</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase w-24">Attendance</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase w-32">Theory (70%+)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase w-32">
                  Practical (70%+)
                  {!isRac02 && <span className="block text-[9px] font-normal text-gray-400">(RAC 02 Only)</span>}
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-40">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessionBookings.map((booking) => {
                // Determine if practical is locked for this specific user
                const theory = booking.theoryScore || 0;
                const practicalLocked = isRac02 && theory < 70;

                return (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-900">{booking.employee.name}</div>
                      <div className="text-xs text-slate-500">ID: {booking.employee.recordId}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                        checked={booking.attendance || false}
                        onChange={(e) => handleInputChange(booking.id, 'attendance', e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        min="0" max="100"
                        className={`w-full text-center border rounded-md shadow-sm text-sm p-1
                          ${(booking.theoryScore || 0) < 70 ? 'border-red-300 bg-red-50 text-red-900' : 'border-green-300 bg-green-50 text-green-900'}
                        `}
                        value={booking.theoryScore}
                        onChange={(e) => handleInputChange(booking.id, 'theoryScore', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-3 bg-gray-50 relative">
                      <input 
                        type="number" 
                        min="0" max="100"
                        disabled={!isRac02 || practicalLocked}
                        className={`w-full text-center border rounded-md shadow-sm text-sm p-1
                          ${!isRac02 ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300' : 
                            practicalLocked ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300' :
                            (booking.practicalScore || 0) < 70 ? 'border-red-300 bg-red-50 text-red-900' : 'border-green-300 bg-green-50 text-green-900'
                          }
                        `}
                        value={booking.practicalScore}
                        onChange={(e) => handleInputChange(booking.id, 'practicalScore', parseInt(e.target.value) || 0)}
                      />
                      {practicalLocked && isRac02 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                           <Lock size={12} className="text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                          ${booking.status === BookingStatus.PASSED ? 'bg-green-100 text-green-800' : 
                            booking.status === BookingStatus.FAILED ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {booking.status.toUpperCase()}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="mt-6 flex justify-end">
             <button 
               onClick={handleSave}
               disabled={!hasUnsavedChanges}
               className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold shadow-sm transition-all
                 ${hasUnsavedChanges ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
               `}
             >
               <Save size={18} />
               <span>Save Results</span>
             </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Note: Status is auto-calculated. Passing requires 70%+ in Theory (and Practical for RAC 02).</p>
          </div>

        </div>
      ) : selectedSessionId ? (
         <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 animate-fade-in-up">
             <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Users size={48} className="text-yellow-500" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-1">No Bookings Found</h3>
             <p className="max-w-xs text-center text-sm mb-4">
               There are currently no employees registered for this training session.
             </p>
             <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-100">
               Tip: Go to "Book Training" to add participants.
             </div>
         </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 border border-dashed rounded-lg bg-gray-50">
           <ClipboardList size={48} className="text-gray-300 mb-3" />
           <p>Please select a session from the dropdown above to begin grading.</p>
        </div>
      )}
    </div>
  );
};

export default TrainerInputPage;