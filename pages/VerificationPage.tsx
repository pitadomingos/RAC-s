import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Booking, BookingStatus, EmployeeRequirement, Employee, RacDef, TrainingSession } from '../types';
import { INITIAL_RAC_DEFINITIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, XCircle, ShieldCheck, User, Calendar, CreditCard, Activity, ArrowLeft } from 'lucide-react';

interface VerificationPageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
  racDefinitions?: RacDef[];
  sessions: TrainingSession[];
}

const VerificationPage: React.FC<VerificationPageProps> = ({ 
    bookings, 
    requirements, 
    racDefinitions = INITIAL_RAC_DEFINITIONS,
    sessions
}) => {
  const { recordId } = useParams<{ recordId: string }>();
  const { t } = useLanguage();

  const foundBooking = bookings.find(b => b.employee.recordId === recordId);
  const employee: Employee | undefined = foundBooking?.employee;
  const employeeId = employee?.id;
  
  // Helper to extract RAC key from booking
  const getRacKeyFromBooking = (booking: Booking): string => {
      // 1. Try to find via Session Object (Most Reliable)
      const session = sessions.find(s => s.id === booking.sessionId);
      if (session) {
          // "RAC 01 - Working at Height" -> "RAC01"
          return session.racType.split(' - ')[0].replace(/\s+/g, '');
      }
      // 2. Fallback to direct string parsing if legacy or direct code
      // "RAC 01 - ..." -> "RAC01"
      return booking.sessionId.split(' - ')[0].replace(/\s+/g, '');
  };

  const complianceStatus = useMemo(() => {
    if (!employee || !employeeId) return 'NotFound';

    const req = requirements.find(r => r.employeeId === employeeId) || {
        employeeId, asoExpiryDate: '', requiredRacs: {}
    };

    const today = new Date().toISOString().split('T')[0];
    const isAsoValid = !!(req.asoExpiryDate && req.asoExpiryDate > today);
    const dlExpiry = employee.driverLicenseExpiry || '';
    const isDlExpired = !!(dlExpiry && dlExpiry <= today);
    const isActive = employee.isActive ?? true;

    // Check RACs (Dynamic)
    let allRacsMet = true;
    let hasRac02Req = false;

    racDefinitions.forEach(def => {
        const key = def.code; // e.g. "RAC01"
        if (req.requiredRacs[key]) {
            if (key === 'RAC02') hasRac02Req = true;
            
            // --- STRICT LATEST RECORD LOGIC ---
            // 1. Find all PASSED bookings for this RAC
            const passedBookings = bookings.filter(b => {
                 if (b.employee.id !== employeeId) return false;
                 if (b.status !== BookingStatus.PASSED) return false;
                 
                 const code = getRacKeyFromBooking(b);
                 return code === key;
            });

            // 2. Sort by Expiry Date Descending (Newest Expiry First)
            passedBookings.sort((a, b) => {
                const dateA = new Date(a.expiryDate || '1970-01-01').getTime();
                const dateB = new Date(b.expiryDate || '1970-01-01').getTime();
                return dateB - dateA; 
            });

            // 3. Pick the latest record
            const latestBooking = passedBookings[0];

            const expiry = latestBooking?.expiryDate || '';
            if (!expiry || expiry <= today) {
                allRacsMet = false;
            }
        }
    });

    if (!isActive) return 'Inactive';
    if (!isAsoValid || !allRacsMet) return 'NonCompliant';
    if (hasRac02Req && isDlExpired) return 'NonCompliant';
    
    return 'Compliant';

  }, [employee, employeeId, requirements, bookings, racDefinitions, sessions]);

  const req = requirements.find(r => r.employeeId === employeeId);
  
  const activeCertifications = useMemo(() => {
      if (!employeeId) return [];
      const certs: { rac: string, expiry: string }[] = [];
      const today = new Date().toISOString().split('T')[0];

      racDefinitions.forEach(def => {
         const key = def.code;
         if (req?.requiredRacs[key]) {
             // --- STRICT LATEST RECORD LOGIC FOR DISPLAY ---
             const passedBookings = bookings.filter(b => {
                 if (b.employee.id !== employeeId) return false;
                 if (b.status !== BookingStatus.PASSED) return false;
                 const code = getRacKeyFromBooking(b);
                 return code === key;
             });

             passedBookings.sort((a, b) => {
                const dateA = new Date(a.expiryDate || '1970-01-01').getTime();
                const dateB = new Date(b.expiryDate || '1970-01-01').getTime();
                return dateB - dateA; 
             });

             const latest = passedBookings[0];

             if (latest && latest.expiryDate && latest.expiryDate > today) {
                 certs.push({ rac: key, expiry: latest.expiryDate });
             }
         }
      });
      return certs;
  }, [employeeId, bookings, req, racDefinitions, sessions]);


  if (!employee) {
      return (
          <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center">
                  <XCircle size={64} className="text-gray-400 mb-4" />
                  <h1 className="text-2xl font-black text-slate-800 mb-2">{t.verification.notFound}</h1>
                  <p className="text-gray-500 mb-6">ID: {recordId}</p>
                  <Link to="/" className="text-blue-600 font-bold text-sm">Return to Home</Link>
              </div>
          </div>
      );
  }

  const isCompliant = complianceStatus === 'Compliant';

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 md:p-8 font-sans ${isCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
        
        {/* Header */}
        <div className="w-full max-w-md flex justify-between items-center mb-6">
             <Link to="/" className="p-2 bg-white/50 rounded-full hover:bg-white transition">
                 <ArrowLeft size={20} className="text-slate-700" />
             </Link>
             <div className="flex flex-col items-end">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vulcan Safety</span>
                 <span className="text-sm font-black text-slate-800">{t.verification.title}</span>
             </div>
        </div>

        {/* Main Card */}
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            
            {/* Status Banner */}
            <div className={`py-8 flex flex-col items-center justify-center ${isCompliant ? 'bg-green-500' : 'bg-red-500'}`}>
                {isCompliant ? (
                    <div className="bg-white p-4 rounded-full shadow-lg mb-3 animate-bounce">
                        <CheckCircle size={64} className="text-green-500" />
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-full shadow-lg mb-3">
                        <XCircle size={64} className="text-red-500" />
                    </div>
                )}
                <h1 className="text-3xl font-black text-white tracking-wider">
                    {isCompliant ? t.verification.verified : t.verification.notVerified}
                </h1>
                <p className="text-white/80 text-xs font-mono mt-2">
                    {t.verification.scanTime}: {new Date().toLocaleTimeString()}
                </p>
            </div>

            {/* Employee Info */}
            <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 shadow-inner">
                        <User size={40} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{employee.name}</h2>
                        <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-600 mb-2">
                            {employee.recordId}
                        </span>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                        <p className="text-xs text-gray-400 uppercase font-bold">{employee.company}</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                    {/* ASO Status */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-700">
                             <Activity size={18} className="text-blue-500" />
                             <span className="font-bold text-sm">{t.verification.asoStatus}</span>
                        </div>
                        <span className={`text-sm font-mono font-bold ${req?.asoExpiryDate && req.asoExpiryDate > new Date().toISOString().split('T')[0] ? 'text-green-600' : 'text-red-600'}`}>
                            {req?.asoExpiryDate || 'N/A'}
                        </span>
                    </div>

                    {/* DL Status (If applicable) */}
                    {employee.driverLicenseNumber && (
                        <div className="flex justify-between items-center">
                             <div className="flex items-center gap-2 text-slate-700">
                                <CreditCard size={18} className="text-purple-500" />
                                <span className="font-bold text-sm">{t.verification.dlStatus}</span>
                             </div>
                             <div className="text-right">
                                 <div className="text-xs font-bold text-slate-800">{employee.driverLicenseClass}</div>
                                 <div className={`text-xs font-mono ${employee.driverLicenseExpiry && employee.driverLicenseExpiry > new Date().toISOString().split('T')[0] ? 'text-green-600' : 'text-red-600'}`}>
                                     {employee.driverLicenseExpiry}
                                 </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Certifications List */}
                <div className="mt-6">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ShieldCheck size={14} /> {t.verification.activeRacs}
                     </h3>
                     
                     {activeCertifications.length === 0 ? (
                         <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
                             No Active Certifications
                         </div>
                     ) : (
                         <div className="grid grid-cols-2 gap-2">
                             {activeCertifications.map(cert => (
                                 <div key={cert.rac} className="bg-green-50 border border-green-100 p-2 rounded-lg flex flex-col items-center text-center">
                                     <span className="font-black text-green-700 text-sm">{cert.rac}</span>
                                     <span className="text-[10px] text-green-600 flex items-center gap-1 mt-1">
                                         <Calendar size={8} /> {cert.expiry}
                                     </span>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 text-center border-t border-gray-100">
                 <p className="text-[10px] text-gray-400">
                     System Verification ID: {Math.random().toString(36).substring(7).toUpperCase()}
                 </p>
            </div>
        </div>
    </div>
  );
};

export default VerificationPage;