
import React, { useState } from 'react';
import { Booking, BookingStatus, UserRole } from '../types';

interface ResultsPageProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  userRole: UserRole;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ bookings, updateBookingStatus, userRole }) => {
  const [filter, setFilter] = useState('');
  
  // View Only records - Admin can technically see this page but editing is removed
  // as per requirement "The training records score is automatically declared pass/fail based on the score"

  const filteredBookings = bookings.filter(b => 
    b.employee.name.toLowerCase().includes(filter.toLowerCase()) ||
    b.employee.recordId.includes(filter)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Training Records</h2>
           <p className="text-sm text-gray-500">Historical view of all training activities and results. Status is auto-calculated based on scores.</p>
        </div>
        <div className="w-64">
          <input 
            type="text" 
            placeholder="Search employee..." 
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Theory</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Prac</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No records found matching your search.</td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.employee.name}</div>
                    <div className="text-xs text-gray-500">{booking.employee.recordId}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-600">{booking.sessionId}</span>
                  </td>
                   <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {booking.theoryScore !== undefined ? booking.theoryScore : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {booking.practicalScore !== undefined && booking.practicalScore > 0 ? booking.practicalScore : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === BookingStatus.PASSED ? 'bg-green-100 text-green-800' : 
                        booking.status === BookingStatus.FAILED ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.expiryDate || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsPage;
