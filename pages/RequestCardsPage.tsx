
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, RacDef } from '../types';
import CardTemplate from '../components/CardTemplate';
import { Mail, AlertCircle, CheckCircle, Printer, Search, X, ZoomIn, UserPlus, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface RequestCardsPageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  racDefinitions: RacDef[];
}

const RequestCardsPage: React.FC<RequestCardsPageProps> = ({ bookings, requirements, racDefinitions }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [requestSent, setRequestSent] = useState(false);
  
  // -- BATCH BUILDER STATE --
  const [slotInputs, setSlotInputs] = useState<string[]>(Array(8).fill(''));
  const [zoomedBookingId, setZoomedBookingId] = useState<string | null>(null);

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  
  // Function to check strict compliance using DYNAMIC RAC definitions
  const isEmployeeCompliant = (empId: string): boolean => {
      const req = requirements.find(r => r.employeeId === empId);
      if (!req) return false;

      const today = new Date().toISOString().split('T')[0];
      
      // 1. ASO Valid
      if (!req.asoExpiryDate || req.asoExpiryDate <= today) return false;

      // 2. RACs Valid (Iterate over ALL defined RACs)
      let allRacsMet = true;
      let hasRac02Req = false;

      racDefinitions.forEach(def => {
         const key = def.code;
         if (req.requiredRacs[key]) {
             if (key === 'RAC02') hasRac02Req = true;
             
             // Check if they have a passed booking for this RAC
             const passedBooking = safeBookings.find(b => {
                 if (b.employee.id !== empId) return false;
                 if (b.status !== BookingStatus.PASSED) return false;
                 
                 let racCode = '';
                 if (b.sessionId.includes('RAC')) {
                     racCode = b.sessionId.split(' - ')[0].replace(' ', '');
                 } else {
                     if (b.sessionId.includes(key)) racCode = key;
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

  const allEligibleBookings = useMemo(() => {
     const uniqueMap = new Map<string, Booking>();
     safeBookings.forEach(b => {
         if (b && b.status === BookingStatus.PASSED && b.employee && !uniqueMap.has(b.employee.id)) {
             uniqueMap.set(b.employee.id, b);
         }
     });
     return Array.from(uniqueMap.values()).filter(b => isEmployeeCompliant(b.employee.id));
  }, [safeBookings, requirements, racDefinitions]);

  const slots = useMemo(() => {
      return slotInputs.map(input => {
          if (!input.trim()) return null;
          const lower = input.toLowerCase();
          return allEligibleBookings.find(b => 
              b.employee.recordId.toLowerCase() === lower ||
              b.employee.name.toLowerCase() === lower || 
              b.employee.recordId.toLowerCase().includes(lower) 
          ) || null;
      });
  }, [slotInputs, allEligibleBookings]);

  const activeCount = slots.filter(s => s !== null).length;

  const handleSlotChange = (index: number, value: string) => {
      const newInputs = [...slotInputs];
      newInputs[index] = value;
      setSlotInputs(newInputs);
  };

  const clearSlot = (index: number) => {
      const newInputs = [...slotInputs];
      newInputs[index] = '';
      setSlotInputs(newInputs);
  };

  const handleSendRequest = () => {
    if (activeCount === 0) return;
    setRequestSent(true);
    setSlotInputs(Array(8).fill(''));
    setTimeout(() => {
      setRequestSent(false);
    }, 4000);
  };

  const handleGoToPrint = () => {
      const selectedBookings = slots.filter(b => b !== null) as Booking[];
      if (selectedBookings.length > 0) {
          navigate('/print-cards', { state: { selectedBookings } });
      } else {
          alert("Please select at least one employee to print.");
      }
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
        <div className="flex flex-col xl:flex-row justify-between items-start gap-6">
          <div className="flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-800">{t.cards.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Build your print batch. Max 8 cards per sheet.
            </p>
            <div className="flex items-center gap-2 mt-4">
                <div className={`text-2xl font-black ${activeCount === 8 ? 'text-green-600' : 'text-slate-700'}`}>
                    {activeCount} / 8
                </div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Cards Ready</div>
                <button 
                    onClick={handleGoToPrint}
                    disabled={activeCount === 0}
                    className={`ml-4 flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm text-sm font-bold ${activeCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                    <Printer size={16} />
                    <span>{t.cards.goToPrint}</span>
                 </button>
            </div>
          </div>

          {/* BATCH BUILDER GRID (8 FILTERS) */}
          <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {slotInputs.map((input, idx) => {
                      const match = slots[idx];
                      const hasInput = input.length > 0;
                      return (
                          <div key={idx} className={`relative flex items-center p-1 rounded-lg border-2 transition-all ${match ? 'border-green-500 bg-green-50' : hasInput ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                              <div className="absolute left-2 text-[10px] font-bold text-slate-400">#{idx + 1}</div>
                              <input 
                                  type="text"
                                  className="w-full pl-8 pr-8 py-2 bg-transparent text-sm font-bold outline-none text-slate-800 placeholder-slate-400"
                                  placeholder="ID or Name..."
                                  value={input}
                                  onChange={(e) => handleSlotChange(idx, e.target.value)}
                              />
                              {match ? (
                                  <CheckCircle size={16} className="absolute right-2 text-green-600" />
                              ) : hasInput ? (
                                  <div className="absolute right-2 text-red-400 flex items-center" title="Not found or ineligible">
                                      <AlertCircle size={16} />
                                  </div>
                              ) : (
                                  <Search size={16} className="absolute right-2 text-slate-300" />
                              )}
                              {match && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-green-200 rounded shadow-lg p-2 z-20 text-xs">
                                      <div className="font-bold truncate">{match.employee.name}</div>
                                      <div className="text-slate-500">{match.employee.recordId}</div>
                                  </div>
                              )}
                          </div>
                      );
                  })}
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
      </div>

      {/* Preview Grid */}
      <div className="flex-1 overflow-auto p-1 bg-slate-100 rounded-xl border border-slate-200 min-h-[400px]">
        {activeCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <Filter size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-slate-600 mb-2">No Cards Selected</h3>
            <p className="text-sm">Use the filters above to select employees for printing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
               {slots.map((booking, idx) => {
                   // If nothing matched in this slot, DO NOT RENDER A PLACEHOLDER. 
                   if (!booking) return null;

                   return (
                   <div 
                    key={String(booking.id)}
                    className="relative group border-2 border-green-500 rounded-xl overflow-hidden bg-white shadow-md transition-all ring-4 ring-green-500/10"
                   >
                     <div className="absolute top-3 right-3 z-20">
                        <div className="bg-green-500 text-white rounded-full p-1 shadow-md">
                           <CheckCircle size={20} />
                        </div>
                     </div>

                     <button 
                        onClick={() => clearSlot(idx)}
                        className="absolute top-3 right-12 z-20 bg-white text-red-500 p-1.5 rounded-full shadow-sm border border-red-100 hover:bg-red-50 transition-colors"
                        title="Remove from batch"
                     >
                        <Trash2 size={16} />
                     </button>

                     <button 
                        onClick={() => setZoomedBookingId(booking.id)}
                        className="absolute top-3 left-3 z-20 bg-white/90 p-1.5 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                        title="Zoom Card"
                     >
                        <ZoomIn size={18} />
                     </button>

                     <div className="bg-gray-100 p-4 flex justify-center items-center h-[340px] overflow-hidden relative pointer-events-none">
                        <div className="transform scale-[0.85] origin-center shadow-lg bg-white">
                             <CardTemplate 
                               booking={booking} 
                               requirement={getRequirement(booking.employee.id)} 
                               allBookings={bookings}
                               racDefinitions={racDefinitions}
                             />
                        </div>
                     </div>
                     
                     <div className="bg-white px-4 py-3 border-t border-gray-100 relative z-20 pointer-events-none">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-800 truncate">{String(booking.employee.name)}</span>
                            <span className="text-xs text-white font-bold bg-slate-900 px-2 py-0.5 rounded-full">Slot #{idx + 1}</span>
                        </div>
                     </div>
                   </div>
                 );
               })}
          </div>
        )}
      </div>

      {/* Button Positioned Center-Bottom */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={handleSendRequest}
          disabled={activeCount === 0 || requestSent}
          className={`
            flex items-center space-x-2 px-6 py-4 rounded-full font-bold text-white shadow-2xl transition-all transform hover:scale-105 border border-white/20
            ${activeCount === 0 || requestSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600'}
          `}
        >
          <Mail size={24} />
          <span className="text-lg">{requestSent ? t.cards.sending : `${t.cards.requestButton} (${activeCount})`}</span>
        </button>
      </div>

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
                        racDefinitions={racDefinitions}
                      />
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default RequestCardsPage;
