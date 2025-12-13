
import React, { useState, useMemo, useEffect } from 'react';
import { Booking, BookingStatus, EmployeeRequirement, RacDef, TrainingSession, UserRole, Employee } from '../types';
import CardTemplate from '../components/CardTemplate';
import { Mail, AlertCircle, CheckCircle2, Printer, Search, X, ZoomIn, Filter, Trash2, User, Sparkles, CreditCard, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { sendBrowserNotification } from '../utils/browserNotifications';

interface RequestCardsPageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  racDefinitions: RacDef[];
  sessions: TrainingSession[];
  userRole: UserRole;
  currentEmployeeId?: string; // Passed from App.tsx
}

interface ComplianceResult {
    isCompliant: boolean;
    reasons: string[];
}

const RequestCardsPage: React.FC<RequestCardsPageProps> = ({ bookings, requirements, racDefinitions, sessions, userRole, currentEmployeeId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [requestSent, setRequestSent] = useState(false);
  
  // -- BATCH BUILDER STATE --
  // Initialize from location state if returning from print page
  const [slotInputs, setSlotInputs] = useState<string[]>(() => {
      return location.state?.savedInputs || Array(8).fill('');
  });
  
  const [zoomedBookingId, setZoomedBookingId] = useState<string | null>(null);

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  
  const isSelfService = userRole === UserRole.USER;

  // --- COMPLIANCE ENGINE ---
  const checkCompliance = (empId: string): ComplianceResult => {
      const reasons: string[] = [];
      const req = requirements.find(r => r.employeeId === empId);
      
      // 1. Check if Requirements Exist
      if (!req) {
          reasons.push("No training requirements defined in Database.");
          return { isCompliant: false, reasons };
      }

      const today = new Date().toISOString().split('T')[0];
      
      // 2. ASO Valid
      if (!req.asoExpiryDate) {
          reasons.push("Missing Medical (ASO) Expiry Date.");
      } else if (req.asoExpiryDate <= today) {
          reasons.push(`ASO Expired on ${req.asoExpiryDate}.`);
      }

      // 3. RACs Valid (Iterate over ALL defined RACs)
      let allRacsMet = true;
      let hasRac02Req = false;

      racDefinitions.forEach(def => {
         const key = def.code;
         if (req.requiredRacs[key]) {
             if (key === 'RAC02') hasRac02Req = true;
             
             // Check if they have a passed booking for this RAC
             const passedBookings = safeBookings.filter(b => {
                 if (b.employee.id !== empId) return false;
                 if (b.status !== BookingStatus.PASSED) return false;
                 
                 let racCode = '';
                 // Try to resolve from Session Object first (Reliable)
                 const session = sessions.find(s => s.id === b.sessionId);
                 if (session) {
                     racCode = session.racType.split(' - ')[0].replace(' ', '');
                 } else {
                     // Fallback to string parsing
                     if (b.sessionId.includes('RAC')) {
                         racCode = b.sessionId.split(' - ')[0].replace(' ', '');
                     } else {
                         // Direct Key match (e.g. "PTS")
                         if (b.sessionId.includes(key)) racCode = key;
                     }
                 }
                 return racCode === key;
             });

             // Sort by expiry desc
             passedBookings.sort((a, b) => new Date(b.expiryDate || '').getTime() - new Date(a.expiryDate || '').getTime());
             const latest = passedBookings[0];

             if (!latest) {
                 reasons.push(`Missing valid training for ${key}.`);
                 allRacsMet = false;
             } else if (!latest.expiryDate || latest.expiryDate <= today) {
                 reasons.push(`${key} expired on ${latest.expiryDate || 'Unknown'}.`);
                 allRacsMet = false;
             }
         }
      });

      // 4. DL Valid if RAC 02 required
      if (hasRac02Req) {
          const empBooking = safeBookings.find(b => b.employee.id === empId); // Get any booking to find generic emp data
          if (empBooking && empBooking.employee) {
              const dlExpiry = empBooking.employee.driverLicenseExpiry;
              if (!dlExpiry) {
                  reasons.push("Driver License details missing.");
              } else if (dlExpiry <= today) {
                  reasons.push(`Driver License expired on ${dlExpiry}.`);
              }
          } else {
              // Should be caught above, but safety check
              reasons.push("Driver License data unavailable.");
          }
      }

      return {
          isCompliant: reasons.length === 0,
          reasons
      };
  };

  // Build a searchable map of ALL known employees (from bookings)
  // We want to allow searching ANYONE to show why they fail
  const allEmployeesMap = useMemo(() => {
     const map = new Map<string, { employee: Employee, booking?: Booking }>();
     safeBookings.forEach(b => {
         if (b.employee && !map.has(b.employee.id)) {
             map.set(b.employee.id, { employee: b.employee, booking: b });
         }
     });
     return Array.from(map.values());
  }, [safeBookings]);

  // SELF-SERVICE LOGIC: Override slots if user
  const slots = useMemo(() => {
      if (isSelfService && currentEmployeeId) {
          const match = allEmployeesMap.find(m => m.employee.id === currentEmployeeId);
          if (match) {
              const compliance = checkCompliance(match.employee.id);
              return [{ 
                  ...match, 
                  compliance 
              }];
          }
          return [];
      }

      return slotInputs.map(input => {
          if (!input.trim()) return null;
          const lower = input.toLowerCase();
          
          // Flexible Search: ID or Name
          const match = allEmployeesMap.find(item => 
              item.employee.recordId.toLowerCase() === lower ||
              item.employee.name.toLowerCase() === lower || 
              item.employee.recordId.toLowerCase().includes(lower) ||
              item.employee.name.toLowerCase().includes(lower)
          );

          if (match) {
              const compliance = checkCompliance(match.employee.id);
              return { ...match, compliance };
          }
          return null;
      });
  }, [slotInputs, allEmployeesMap, isSelfService, currentEmployeeId, requirements]); // Added requirements dep to refresh on change

  // Side Effect: Trigger Notification when an ineligible user is selected
  useEffect(() => {
      slots.forEach(slot => {
          if (slot && !slot.compliance.isCompliant) {
              // We'll rely on browser notifications if needed, but avoid spamming on render
          }
      });
  }, [slots]);

  const activeCount = slots.filter(s => s !== null && s.compliance.isCompliant).length;

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
    if (!isSelfService) setSlotInputs(Array(8).fill(''));
    setTimeout(() => {
      setRequestSent(false);
    }, 4000);
  };

  const handleGoToPrint = () => {
      // ONLY send COMPLIANT slots
      const selectedBookings = slots
        .filter(s => s !== null && s.compliance.isCompliant && s.booking)
        .map(s => s!.booking!);
        
      if (selectedBookings.length > 0) {
          navigate('/print-cards', { 
              state: { 
                  selectedBookings, 
                  savedInputs: slotInputs 
              } 
          });
      } else {
          alert("Please select at least one eligible employee to print.");
      }
  };

  const handleIneligibleClick = (name: string, reasons: string[]) => {
      const msg = `Eligibility Check Failed for ${name}:\n\n- ${reasons.join('\n- ')}`;
      sendBrowserNotification("Eligibility Check Failed", `${name} is not eligible for a card.`); // Browser native
      alert(msg); // Direct Interrupt
  };

  const getRequirement = (empId: string) => {
      if (!Array.isArray(requirements)) return undefined;
      return requirements.find(r => r.employeeId === empId);
  };

  const zoomedBooking = bookings.find(b => b.id === zoomedBookingId);

  return (
    <div className="flex flex-col h-full space-y-6 relative pb-24">
      
      {/* --- ELEGANT HEADER / BATCH COMPOSER --- */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 sticky top-0 z-30 transition-all">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
          
          {/* Title Section */}
          <div className="flex-shrink-0 min-w-[240px]">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl shadow-lg shadow-pink-500/30 text-white">
                    <CreditCard size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t.cards.title}</h2>
                    <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">Issuance Studio</span>
                </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              {isSelfService ? "Review and request your digital safety credential." : "Curate your print batch. Select up to 8 eligible personnel."}
            </p>
            
            <div className="mt-6 flex items-center gap-4">
                {!isSelfService && (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Batch Capacity</span>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-black ${activeCount === 8 ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>{activeCount}</span>
                            <span className="text-slate-400 text-sm font-medium">/ 8</span>
                        </div>
                    </div>
                )}
                
                {(activeCount > 0) && (
                    <>
                        {!isSelfService && <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>}
                        <button 
                            onClick={handleGoToPrint}
                            className="group flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 font-bold text-sm"
                        >
                            <Printer size={18} className="group-hover:scale-110 transition-transform"/>
                            <span>{isSelfService ? "Print Passport" : "Print Preview"}</span>
                        </button>
                    </>
                )}
            </div>
          </div>

          {/* BATCH GRID (HIDDEN FOR SELF SERVICE) */}
          {!isSelfService && (
              <div className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {slotInputs.map((input, idx) => {
                          const match = slots[idx];
                          const hasInput = input.length > 0;
                          const isError = match && !match.compliance.isCompliant;

                          return (
                              <div 
                                key={idx} 
                                className={`
                                    relative flex items-center p-1.5 rounded-xl border-2 transition-all duration-300 group h-[52px]
                                    ${match 
                                        ? isError
                                            ? 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-pointer'
                                            : 'border-green-400 bg-green-50 dark:bg-green-900/10 shadow-sm shadow-green-200/50 dark:shadow-none' 
                                        : hasInput 
                                            ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/10' 
                                            : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500'}
                                `}
                                onClick={() => isError && handleIneligibleClick(match.employee.name, match.compliance.reasons)}
                              >
                                  <div className={`
                                      absolute -left-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm z-10 transition-colors
                                      ${match ? (isError ? 'bg-red-500 text-white' : 'bg-green-500 text-white') : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}
                                  `}>
                                      {idx + 1}
                                  </div>
                                  
                                  {match ? (
                                      // MATCH FOUND STATE
                                      <div className="flex-1 flex justify-between items-center px-2 min-w-0">
                                          <div className="flex flex-col min-w-0 overflow-hidden pr-2">
                                              <span className={`text-xs font-black truncate ${isError ? 'text-red-700 dark:text-red-300' : 'text-slate-800 dark:text-white'}`}>{match.employee.name}</span>
                                              <span className={`text-[10px] font-mono truncate ${isError ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                                  {isError ? 'NOT ELIGIBLE' : match.employee.recordId}
                                              </span>
                                          </div>
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); clearSlot(idx); }} 
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded transition-colors"
                                            title="Clear Slot"
                                          >
                                              <X size={14} />
                                          </button>
                                      </div>
                                  ) : (
                                      // SEARCH INPUT STATE
                                      <>
                                        <div className="flex-shrink-0 pl-2 pr-2 text-slate-400">
                                            <Search size={14} />
                                        </div>
                                        <input 
                                            type="text"
                                            autoComplete="off"
                                            className="w-full bg-transparent text-sm font-bold outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400/70"
                                            placeholder="Search ID/Name..."
                                            value={input}
                                            onChange={(e) => handleSlotChange(idx, e.target.value)}
                                        />
                                        <div className="pr-2">
                                            {hasInput ? (
                                                <div className="w-4 h-4 rounded-full border-2 border-orange-300 border-t-orange-600 animate-spin" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-600" />
                                            )}
                                        </div>
                                      </>
                                  )}
                              </div>
                          );
                      })}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                      <p className="text-[10px] text-slate-400 italic">
                          * Red slots indicate non-compliant employees. Click them for details.
                      </p>
                      <button onClick={() => setSlotInputs(Array(8).fill(''))} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                          <Trash2 size={12} /> CLEAR BATCH
                      </button>
                  </div>
              </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-24 right-6 z-50 pointer-events-none">
          {requestSent && (
            <div className="bg-white dark:bg-slate-800 border-l-4 border-green-500 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-in-right pointer-events-auto max-w-sm">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Request Successful</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your card batch has been forwarded to the print queue.</p>
                </div>
            </div>
          )}
      </div>

      {/* --- PREVIEW CANVAS --- */}
      <div className="flex-1 min-h-[500px] relative">
        
        {/* Background Decor */}
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>

        {activeCount === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            {isSelfService ? (
               <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-md backdrop-blur-sm relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                   <div className="bg-red-50 dark:bg-red-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <AlertCircle size={40} className="text-red-500" />
                   </div>
                   <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{t.cards.eligibility.failedTitle}</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                       {slots[0]?.compliance.reasons.join(' ') || t.cards.eligibility.failedMsg}
                   </p>
                   <button onClick={() => navigate('/manuals')} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                       {t.cards.eligibility.checkReqs}
                   </button>
               </div>
            ) : (
                <div className="opacity-40 flex flex-col items-center">
                    <Layers size={64} className="text-slate-400 mb-4 animate-pulse" />
                    <h3 className="text-xl font-bold text-slate-500">Canvas Empty</h3>
                    <p className="text-sm text-slate-400">Add eligible employees to the batch above to preview cards.</p>
                </div>
            )}
          </div>
        ) : (
          <div className={`relative z-10 grid gap-8 p-8 ${isSelfService ? 'place-items-center' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'}`}>
               {slots.map((match, idx) => {
                   if (!match || !match.compliance.isCompliant || !match.booking) return null;
                   
                   const booking = match.booking;

                   return (
                   <div 
                    key={String(booking.id)}
                    className="group relative perspective-1000"
                   >
                     {/* Floating Actions */}
                     <div className="absolute -top-3 -right-3 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        {!isSelfService && (
                            <button 
                                onClick={() => clearSlot(idx)}
                                className="bg-white dark:bg-slate-800 text-red-500 p-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                title="Remove"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <button 
                            onClick={() => setZoomedBookingId(booking.id)}
                            className="bg-white dark:bg-slate-800 text-blue-500 p-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            title="Inspect"
                        >
                            <ZoomIn size={16} />
                        </button>
                     </div>

                     {/* Card Container */}
                     <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                        
                        {/* Slot Badge */}
                        {!isSelfService && (
                            <div className="absolute top-4 left-4 z-20">
                                <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm backdrop-blur-md">
                                    SLOT {idx + 1}
                                </span>
                            </div>
                        )}

                        {/* Valid Indicator */}
                        <div className="absolute top-4 right-4 z-20">
                            <div className="bg-green-500 text-white p-1 rounded-full shadow-lg shadow-green-500/40">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>

                        {/* Card Render Area */}
                        <div className="bg-slate-100 dark:bg-slate-800 p-6 flex justify-center items-center h-[320px] relative">
                            {/* Reflection Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                            
                            <div className="transform scale-[0.85] origin-center shadow-lg transition-transform duration-500">
                                <CardTemplate 
                                    booking={booking} 
                                    requirement={getRequirement(booking.employee.id)} 
                                    allBookings={bookings}
                                    racDefinitions={racDefinitions}
                                    sessions={sessions}
                                />
                            </div>
                        </div>
                        
                        {/* Footer Info */}
                        <div className="px-5 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{booking.employee.name}</h4>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{booking.employee.recordId}</span>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{booking.employee.company}</span>
                            </div>
                        </div>
                     </div>
                   </div>
                 );
               })}
          </div>
        )}
      </div>

      {/* --- FLOATING ACTION DOCK --- */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-full shadow-2xl border border-white/20 dark:border-slate-700 ring-1 ring-black/5 flex items-center gap-2">
            <button
                onClick={handleSendRequest}
                disabled={activeCount === 0 || requestSent}
                className={`
                    relative group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-300
                    ${activeCount === 0 || requestSent 
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 hover:shadow-blue-500/30'}
                `}
            >
                {requestSent ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                ) : (
                    <Mail size={20} className={activeCount > 0 ? "group-hover:rotate-12 transition-transform" : ""} />
                )}
                <span className="tracking-wide">
                    {requestSent ? t.cards.sending : t.cards.requestButton}
                </span>
                {!isSelfService && activeCount > 0 && (
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-1">
                        {activeCount}
                    </span>
                )}
            </button>
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {zoomedBooking && (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setZoomedBookingId(null)}>
              <div className="relative transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setZoomedBookingId(null)}
                    className="absolute -top-16 right-0 md:-right-16 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
                  >
                      <X size={24} />
                  </button>
                  <div className="transform scale-[1.5] md:scale-[1.8] origin-center shadow-2xl rounded-lg overflow-hidden ring-8 ring-white/10">
                      <CardTemplate 
                        booking={zoomedBooking} 
                        requirement={getRequirement(zoomedBooking.employee.id)} 
                        allBookings={bookings}
                        racDefinitions={racDefinitions}
                        sessions={sessions}
                      />
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default RequestCardsPage;
