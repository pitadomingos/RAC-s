import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import CardTemplate from '../components/CardTemplate';
import { Mail, AlertCircle, CheckCircle, CheckSquare, Square } from 'lucide-react';

interface RequestCardsPageProps {
  bookings: Booking[];
}

const RequestCardsPage: React.FC<RequestCardsPageProps> = ({ bookings }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [requestSent, setRequestSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  // Filter only passed bookings
  const eligibleBookings = bookings.filter(b => b && b.status === BookingStatus.PASSED);

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

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Header / Instructions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Request RAC Cards</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select qualified employees below to receive a PDF via email containing their valid RAC cards.
              <br/>The PDF will be formatted with 8 cards per page.
            </p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-slate-800">{selectedIds.size}</div>
             <div className="text-xs text-gray-500 uppercase font-semibold">Selected</div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {requestSent && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-3 shadow-sm animate-fade-in-down">
           <CheckCircle className="flex-shrink-0" size={24} />
           <div>
             <p className="font-bold">Request Sent Successfully!</p>
             <p className="text-sm">A PDF containing {sentCount} cards has been sent to your registered email address.</p>
           </div>
        </div>
      )}

      {/* Main Content: List of Eligible Cards */}
      <div className="flex-1 overflow-auto">
        {eligibleBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            <AlertCircle size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Eligible Records</h3>
            <p>No 'Passed' training records available to generate cards.</p>
          </div>
        ) : (
          <div className="space-y-4">
             {/* Controls */}
             <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <button 
                  onClick={toggleAll}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  {selectedIds.size === eligibleBookings.length && eligibleBookings.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                  <span>Select All</span>
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">Showing {eligibleBookings.length} eligible records</span>
             </div>

             {/* Grid of Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {eligibleBookings.map(booking => {
                 const isSelected = selectedIds.has(booking.id);
                 return (
                   <div 
                    key={booking.id}
                    onClick={() => toggleSelection(booking.id)}
                    className={`
                      relative group cursor-pointer transition-all duration-200 border-2 rounded-xl overflow-hidden
                      ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-transparent hover:border-gray-300'}
                    `}
                   >
                     {/* Selection Overlay */}
                     <div className={`
                       absolute inset-0 bg-slate-900/10 z-10 flex items-center justify-center transition-opacity
                       ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                     `}>
                        <div className={`
                          bg-white rounded-full p-2 shadow-lg transform transition-transform
                          ${isSelected ? 'scale-100' : 'scale-75'}
                        `}>
                          {isSelected ? <CheckCircle className="text-green-500" size={32} /> : <div className="w-8 h-8 rounded-full border-2 border-gray-300" />}
                        </div>
                     </div>

                     {/* Card Preview (Scaled Down) */}
                     <div className="bg-white p-2 pointer-events-none transform scale-100 origin-top-left">
                        <div className="w-full h-[250px] overflow-hidden border border-gray-200 shadow-sm">
                           {/* We render the card template but style it to fit the preview container */}
                           <div className="w-[180%] h-[180%] transform scale-[0.55] origin-top-left">
                              <CardTemplate booking={booking} />
                           </div>
                        </div>
                     </div>
                     
                     <div className="bg-white px-3 py-2 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700 truncate">{booking.employee.name}</span>
                        <span className="text-[10px] text-gray-500">{booking.sessionId.split('-')[0]}</span>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile / Sticky Footer */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-slate-200 flex justify-end items-center z-10">
        <button
          onClick={handleSendRequest}
          disabled={selectedIds.size === 0 || requestSent}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all
            ${selectedIds.size === 0 || requestSent ? 'bg-gray-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-lg'}
          `}
        >
          <Mail size={20} />
          <span>{requestSent ? 'Sending...' : `Request ${selectedIds.size} Cards via Email`}</span>
        </button>
      </div>
    </div>
  );
};

export default RequestCardsPage;