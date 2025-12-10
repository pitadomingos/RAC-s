

import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, EmployeeRequirement } from '../types';
import CardTemplate from '../components/CardTemplate';
import { Mail, AlertCircle, CheckCircle, CheckSquare, Square, Printer, Search, X, ZoomIn, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { RAC_KEYS } from '../constants';

interface RequestCardsPageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
}

const RequestCardsPage: React.FC<RequestCardsPageProps> = ({ bookings, requirements }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [requestSent, setRequestSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [limitWarning, setLimitWarning] = useState(false);
  
  // Zoom State
  const [zoomedBookingId, setZoomedBookingId] = useState<string | null>(null);

  // Safeguard: Ensure bookings exists and filter safe values
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  
  // Function to check strict compliance
  const isEmployeeCompliant = (empId: string): boolean => {
      const req = requirements.find(r => r.employeeId === empId);
      if (!req) return false; // No requirements defined? Safety says no.

      const today = new Date().toISOString().split('T')[0];
      
      // 1. ASO Valid
      if (!req.asoExpiryDate || req.asoExpiryDate <= today) return false;

      // 2. RACs Valid
      let allRacsMet = true;
      let hasRac02Req = false;

      RAC_KEYS.forEach(key => {
         if (req.requiredRacs[key]) {
             if (key === 'RAC02') hasRac02Req = true;
             
             // Check if they have a passed booking for this RAC
             const passedBooking = safeBookings.find(b => {
                 if (b.employee.id !== empId) return false;
                 if (b.status !== BookingStatus.PASSED) return false;
                 
                 let racCode = '';
                 if (b.sessionId.includes('RAC')) {
                     racCode = b.sessionId.split(' - ')[0].replace(' ', '');
                 }
                 return racCode === key;
             });

             if (!passedBooking || !passedBooking.expiryDate || passedBooking.expiryDate <= today) {
                 allRacsMet = false;
             }
         }
      });

      if (!allRacsMet) return false;

      // 3. DL Valid if RAC 02 required
      if (hasRac02Req) {
          // Find employee object to get DL info (any booking has the employee data)
          const empBooking = safeBookings.find(b => b.employee.id === empId);
          if (empBooking) {
              const dlExpiry = empBooking.employee.driverLicenseExpiry;
              if (!dlExpiry || dlExpiry <= today) return false;
          } else {
              return false;
          }
      }

      return true;
  };

  // Filter only passed AND fully compliant bookings
  const eligibleBookings = useMemo(() => {
     // Get unique employees who have at least one passed booking
     const uniqueMap = new Map<string, Booking>();
     safeBookings.forEach(b => {
         if (b && b.status === BookingStatus.PASSED && b.employee && !uniqueMap.has(b.employee.id)) {
             uniqueMap.set(b.employee.id, b);
         }
     });

     // Now filter those by strict compliance
     return Array.from(uniqueMap.values()).filter(b => isEmployeeCompliant(b.employee.id));
  }, [safeBookings, requirements]);

  // Check if search matches someone who is Ineligible (for notification)
  const ineligibleMatch = useMemo(() => {
      if (!searchQuery) return false;
      const lowerQ = searchQuery.toLowerCase();
      // Find someone who matches search BUT is not in eligibleBookings
      const matchInAll = safeBookings.find(b => 
          b.employee.name.toLowerCase().includes(lowerQ) || 
          b.employee.recordId.toLowerCase().includes(lowerQ)
      );

      if (matchInAll) {
          const isEligible = eligibleBookings.some(eb => eb.employee.id === matchInAll.employee.id);
          return !isEligible;
      }
      return false;
  }, [searchQuery, safeBookings, eligibleBookings]);


  // Filter visual list based on search
  const filteredBookings = useMemo(() => {
      if (!searchQuery) return eligibleBookings;
      const lowerQ = searchQuery.toLowerCase();
      return eligibleBookings.filter(b => 
          b.employee.name.toLowerCase().includes(lowerQ) || 
          b.employee.recordId.toLowerCase().includes(lowerQ)
      );
  }, [eligibleBookings, searchQuery]);

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent zoom trigger
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      // LIMIT MAX 8
      if (newSelection.size >= 8) {
          setLimitWarning(true);
          setTimeout(() => setLimitWarning(false), 3000);
          return;
      }
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredBookings.length) {
      setSelectedIds(new Set());
    } else {
      // Max 8 logic for select all
      const allIds = filteredBookings.map(b => b.id).slice(0, 8);
      if (filteredBookings.length > 8) {
          setLimitWarning(true);
          setTimeout(() => setLimitWarning(false), 3000);
      }
      setSelectedIds(new Set(allIds));
    }
  };

  const handleSendRequest = () => {
    if (selectedIds.size === 0) return;
    
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

  const zoomedBooking = bookings.find(b => b.id === zoomedBookingId);

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      
      {/* Header / Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-30">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t.cards.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select employees to print. Max 8 fit on one page.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
             <div className="flex items-center gap-2 w-full">
                 <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder={t.common.search}
                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-yellow-500 focus:border-yellow-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <button 
                    onClick={() => navigate('/print-cards')}
                    className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm text-sm"
                 >
                    <Printer size={16} />
                    <span className="hidden md:inline">{t.cards.goToPrint}</span>
                 </button>
             </div>
             <div className="flex items-center gap-2 mt-2">
                <div className={`text-sm font-bold ${selectedIds.size === 8 ? 'text-red-600' : 'text-slate-800'}`}>
                    {String(selectedIds.size)} / 8 <span className="text-gray-400 font-normal text-xs">(Max)</span>
                </div>
                <div className="text-xs text-gray-500 uppercase font-semibold">{t.cards.selected}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-2 fixed top-20 right-6 z-50 w-96">
          {requestSent && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-3 shadow-lg animate-fade-in-down">
            <CheckCircle className="flex-shrink-0" size={24} />
            <div>
                <p className="font-bold">{t.cards.successTitle}</p>
                <p className="text-sm">{t.cards.successMsg}</p>
            </div>
            </div>
          )}
          
          {limitWarning && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-3 shadow-lg animate-fade-in-down">
            <AlertCircle className="flex-shrink-0" size={24} />
            <div>
                <p className="font-bold">Limit Reached</p>
                <p className="text-sm">{t.cards.validation.maxSelection}</p>
            </div>
            </div>
          )}
      </div>

      {/* Ineligible Warning */}
      {ineligibleMatch && (
         <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg flex items-center space-x-3 shadow-sm mx-1">
             <ShieldAlert className="flex-shrink-0" size={24} />
             <div>
                <p className="font-bold">{t.cards.validation.incomplete}</p>
                <p className="text-sm">{t.cards.validation.ineligible}</p>
             </div>
         </div>
      )}

      {/* Main Content: List of Eligible Cards */}
      <div className="flex-1 overflow-auto p-1">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            <AlertCircle size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">{t.cards.noRecords}</h3>
            <p>{t.cards.noRecordsSub}</p>
          </div>
        ) : (
          <div className="space-y-4">
             {/* Bulk Action Bar */}
             <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-lg border border-gray-200 sticky top-0 z-20">
                <button 
                  onClick={toggleAll}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-slate-900 px-2"
                >
                  {selectedIds.size === Math.min(filteredBookings.length, 8) && selectedIds.size > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                  <span>{t.cards.selectAll} (Max 8)</span>
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">{t.cards.showing} {String(filteredBookings.length)}</span>
             </div>

             {/* Grid of Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
               {filteredBookings.map(booking => {
                 const isSelected = selectedIds.has(booking.id);
                 return (
                   <div 
                    key={String(booking.id)}
                    className={`
                      relative group border-2 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all
                      ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-gray-200 hover:border-gray-300'}
                    `}
                   >
                     {/* Selection Area (Top) */}
                     <div 
                        className="absolute inset-0 z-10 cursor-pointer" 
                        onClick={(e) => toggleSelection(booking.id, e)} 
                     />
                     
                     {/* Checkmark Overlay */}
                     <div className={`
                       absolute top-3 right-3 z-20 transition-all duration-200 pointer-events-none
                       ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-50'}
                     `}>
                        <div className="bg-white rounded-full shadow-md">
                           <CheckCircle className={isSelected ? "text-green-500 fill-white" : "text-gray-300"} size={28} />
                        </div>
                     </div>

                     {/* Zoom Trigger Button */}
                     <button 
                        onClick={(e) => { e.stopPropagation(); setZoomedBookingId(booking.id); }}
                        className="absolute top-3 left-3 z-20 bg-white/90 p-1.5 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                        title="Zoom Card"
                     >
                        <ZoomIn size={18} />
                     </button>

                     {/* Card Preview Container */}
                     <div className="bg-gray-100 p-4 flex justify-center items-center h-[340px] overflow-hidden relative pointer-events-none">
                        <div className="transform scale-[0.85] origin-center shadow-lg bg-white">
                             <CardTemplate 
                               booking={booking} 
                               requirement={getRequirement(booking.employee.id)} 
                               allBookings={bookings} // Pass all bookings
                             />
                        </div>
                     </div>
                     
                     <div className="bg-white px-4 py-3 border-t border-gray-100 relative z-20 pointer-events-none">
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

      {/* Floating Action Button (Z-Index Adjusted) */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={handleSendRequest}
          disabled={selectedIds.size === 0 || requestSent}
          className={`
            flex items-center space-x-2 px-6 py-4 rounded-full font-bold text-white shadow-2xl transition-all transform hover:scale-105 border border-white/20
            ${selectedIds.size === 0 || requestSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600'}
          `}
        >
          <Mail size={24} />
          <span className="text-lg">{requestSent ? t.cards.sending : `${t.cards.requestButton} (${selectedIds.size})`}</span>
        </button>
      </div>

      {/* Zoom Modal */}
      {zoomedBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setZoomedBookingId(null)}>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setZoomedBookingId(null)}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                  >
                      <X size={32} />
                  </button>
                  <div className="transform scale-150 origin-center bg-white shadow-2xl rounded-lg overflow-hidden">
                      <CardTemplate 
                        booking={zoomedBooking} 
                        requirement={getRequirement(zoomedBooking.employee.id)} 
                        allBookings={bookings}
                      />
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default RequestCardsPage;
