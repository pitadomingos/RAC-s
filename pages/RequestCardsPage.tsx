
import React, { useState } from 'react';
import { Booking, BookingStatus, EmployeeRequirement } from '../types';
import CardTemplate from '../components/CardTemplate';
import { Mail, AlertCircle, CheckCircle, CheckSquare, Square, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequestCardsPageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
}

const RequestCardsPage: React.FC<RequestCardsPageProps> = ({ bookings, requirements }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [requestSent, setRequestSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  // Safeguard: Ensure bookings exists and filter safe values
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  
  // Filter only passed bookings
  const eligibleBookings = safeBookings.filter(b => b && b.status === BookingStatus.PASSED && b.employee);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === eligibleBookings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(eligibleBookings.map(b => b.id)));
    }
  };

  const handleSendRequest = () => {
    if (selectedIds.size === 0) return;
    
    // Capture count before clearing
    setSentCount(selectedIds.size);

    // Simulate API call / Email sending
    setRequestSent(true);
    setSelectedIds(new Set()); // Clear selection immediately
    
    setTimeout(() => {
      setRequestSent(false);
    }, 4000);
  };

  const getRequirement = (empId: string) => {
      if (!Array.isArray(requirements)) return undefined;
      return requirements.find(r => r.employeeId === empId);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Header / Instructions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Request CARs Cards</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select qualified employees below to receive a PDF via email containing their valid RAC cards.
              <br/>The PDF will be formatted with 8 cards per page.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <button 
                onClick={() => navigate('/print-cards')}
                className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition shadow-sm text-sm border border-slate-200"
             >
                <Printer size={16} />
                <span>Go to Print View (A4)</span>
             </button>
             <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">{String(selectedIds.size)}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Selected</div>
             </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {requestSent && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-3 shadow-sm animate-fade-in-down">
           <CheckCircle className="flex-shrink-0" size={24} />
           <div>
             <p className="font-bold">Request Sent Successfully!</p>
             <p className="text-sm">A PDF containing {String(sentCount)} cards has been sent to your registered email address.</p>
           </div>
        </div>
      )}

      {/* Main Content: List of Eligible Cards */}
      <div className="flex-1 overflow-auto p-1">
        {eligibleBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            <AlertCircle size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Eligible Records</h3>
            <p>No 'Passed' training records available to generate cards.</p>
          </div>
        ) : (
          <div className="space-y-4">
             {/* Controls */}
             <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-200 sticky top-0 z-20">
                <button 
                  onClick={toggleAll}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  {selectedIds.size === eligibleBookings.length && eligibleBookings.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                  <span>Select All</span>
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">Showing {String(eligibleBookings.length)} eligible records</span>
             </div>

             {/* Grid of Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
               {eligibleBookings.map(booking => {
                 const isSelected = selectedIds.has(booking.id);
                 return (
                   <div 
                    key={String(booking.id)}
                    onClick={() => toggleSelection(booking.id)}
                    className={`
                      relative group cursor-pointer transition-all duration-200 border-2 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md
                      ${isSelected ? 'border-yellow-500 ring-4 ring-yellow-500/20' : 'border-gray-200 hover:border-gray-300'}
                    `}
                   >
                     {/* Selection Overlay Checkmark */}
                     <div className={`
                       absolute top-2 right-2 z-20 transition-all duration-200
                       ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-50'}
                     `}>
                        <div className="bg-white rounded-full shadow-md">
                           <CheckCircle className={isSelected ? "text-green-500 fill-white" : "text-gray-300"} size={32} />
                        </div>
                     </div>

                     {/* Card Preview Container */}
                     <div className="bg-gray-100 p-4 flex justify-center items-center h-[340px] overflow-hidden relative">
                        {/* We scale the actual CardTemplate to fit the preview box. 
                            Card is 54mm (~204px) x 86mm (~325px). 
                            Container is flex centered. 
                        */}
                        <div className="transform scale-[0.85] origin-center shadow-lg bg-white">
                             <CardTemplate booking={booking} requirement={getRequirement(booking.employee.id)} />
                        </div>
                     </div>
                     
                     <div className="bg-white px-4 py-3 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-800 truncate">{String(booking.employee.name)}</span>
                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded">{String(booking.employee.recordId)}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                            {String(booking.employee.role)}
                        </div>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile / Sticky Footer */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={handleSendRequest}
          disabled={selectedIds.size === 0 || requestSent}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-white shadow-xl transition-all transform hover:scale-105
            ${selectedIds.size === 0 || requestSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-slate-900 to-slate-800'}
          `}
        >
          <Mail size={20} />
          <span>{requestSent ? 'Sending...' : `Request ${String(selectedIds.size)} Cards`}</span>
        </button>
      </div>
    </div>
  );
};

export default RequestCardsPage;
