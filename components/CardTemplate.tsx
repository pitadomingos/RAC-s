
import React from 'react';
import { Booking, EmployeeRequirement } from '../types';
import { MOCK_SESSIONS, RAC_KEYS } from '../constants';
import { Phone } from 'lucide-react';
import { formatDate } from '../utils/translations';

interface CardTemplateProps {
  booking: Booking;
  requirement?: EmployeeRequirement;
  allBookings?: Booking[]; // Added to support looking up other RAC dates
}

const CardTemplate: React.FC<CardTemplateProps> = ({ booking, requirement, allBookings }) => {
  if (!booking || !booking.employee) return null;

  const { employee } = booking;
  
  const safeName = String(employee.name || '').toUpperCase();
  const safeRecordId = String(employee.recordId || '');
  const safeRole = String(employee.role || '').toUpperCase();
  const safeDept = String(employee.department || '').toUpperCase();
  const safeCompany = String(employee.company || '').toUpperCase();
  
  const dlNum = String(employee.driverLicenseNumber || '');
  const dlClass = String(employee.driverLicenseClass || '');
  const dlExp = employee.driverLicenseExpiry ? formatDate(employee.driverLicenseExpiry) : '';
  const asoDate = requirement?.asoExpiryDate ? formatDate(requirement.asoExpiryDate) : '';

  // Logic: Show DL details only if RAC02 is effectively mapped/required.
  const isRac02Mapped = requirement?.requiredRacs ? !!requirement.requiredRacs['RAC02'] : false;

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrUrl = `${appOrigin}/#/verify/${safeRecordId}`;

  // Company Header Logic
  const isVulcan = safeCompany.includes('VULCAN');
  const headerBg = isVulcan ? '#1e3a8a' : '#f59e0b'; // Dark Blue vs Yellow
  const headerTextColor = isVulcan ? 'white' : 'black';
  const headerText = isVulcan ? 'VULCAN' : safeCompany;

  // Helper to find date across all bookings if provided, fallback to current booking logic
  const getRacDate = (racKey: string): string => {
      // 1. If we have access to the full booking list, search for the latest passed record
      if (allBookings && allBookings.length > 0) {
          const empId = employee.id;
          const matches = allBookings.filter(b => {
              if (b.employee.id !== empId) return false;
              if (b.status !== 'Passed') return false;
              if (!b.expiryDate) return false;

              // Check if this booking matches the requested RAC Key
              // Normalize Session ID / Name to Key
              let bRacKey = '';
              if (b.sessionId.includes('RAC')) {
                   // e.g. "RAC01 - Height" or "RAC 01 - Height"
                   bRacKey = b.sessionId.split(' - ')[0].replace(' ', '');
              } else {
                   // Fallback check using inclusion
                   const normalizedKey = racKey.replace('RAC', 'RAC '); // RAC01 -> RAC 01
                   if (b.sessionId.includes(normalizedKey)) return true;
                   if (b.sessionId.includes(racKey)) return true;
              }
              return bRacKey === racKey;
          });

          if (matches.length > 0) {
               // Sort by expiry date descending (latest expiry first)
               matches.sort((a, b) => new Date(b.expiryDate!).getTime() - new Date(a.expiryDate!).getTime());
               return formatDate(matches[0].expiryDate!);
          }
          return '';
      }

      // 2. Fallback: Only check the current booking prop (Limited)
      let currentBookingRac = '';
      if (booking.sessionId && booking.sessionId.includes('RAC')) {
           const parts = booking.sessionId.split(' - ');
           currentBookingRac = parts[0].replace(' ', '');
      } else {
          const s = MOCK_SESSIONS.find(session => session.id === booking.sessionId);
          if (s) currentBookingRac = s.racType.split(' - ')[0].replace(' ', '');
      }

      if (currentBookingRac === racKey && booking.status === 'Passed') {
          return formatDate(booking.expiryDate || '');
      }
      
      return ''; 
  };

  const cellBorder = "border-[0.5px] border-black";
  const labelClass = "font-bold text-[5px] pl-[2px] flex items-center bg-gray-50 leading-none";
  const valueClass = "text-[5px] font-bold text-center flex items-center justify-center leading-none";

  // Data for Right Column (8 Rows)
  const rightColData = [
      { label: 'PTS', val: '12-02-2027' },
      { label: 'Exec. Cred', val: '-SIM-' },
      { label: 'Emitente PTS', val: '-SIM-' },
      { label: 'LOB-OPS', val: '03-01-2027' },
      { label: 'ART', val: '25-04-2027' },
      { label: 'Aprovad. ART', val: '-SIM-' },
      { label: 'LOB-MOV', val: '12-12-2027' },
      { label: '', val: '' }, // 8th row blank
  ];

  // Determine Active RACs based on Database Requirements
  // We filter the master list to get only those marked as True
  const activeRacs = RAC_KEYS.filter(key => requirement?.requiredRacs?.[key]);

  // We need to render exactly 11 rows in the left column
  // Fill the start with Active RACs, leave the rest blank
  const totalLeftRows = 11;

  return (
    <div 
      className="bg-white text-slate-900 relative flex flex-col overflow-hidden box-border" 
      style={{ 
        width: '54mm', 
        height: '86mm', 
        border: '1px solid black',
        fontSize: '8px',
        lineHeight: '1.1'
      }}
    >
      
      {/* Header */}
      <div className="flex h-[11mm] border-b-[1px] border-black relative justify-between items-center px-1">
          {/* Logo Section */}
          <div className="flex flex-col justify-center">
             <div className="flex items-baseline">
                <span className="text-[12px] font-black italic tracking-tighter text-slate-900">Vulcan</span>
                <span className="ml-[1px] text-slate-500 text-[6px] align-top">▼</span>
             </div>
          </div>
          
          {/* Centered Company Bar Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center justify-center pt-2">
                  <span className="text-[4px] font-bold self-end mb-[1px] text-gray-500 absolute top-[1px] right-[2px]">PAD_v5e</span>
                  <div 
                    className="w-[18mm] h-[4.5mm] flex items-center justify-center text-[5px] font-bold uppercase overflow-hidden whitespace-nowrap shadow-sm border-[0.5px] border-black mt-2"
                    style={{ backgroundColor: headerBg, color: headerTextColor }}
                  >
                     <span className="px-1 truncate w-full text-center">{headerText}</span>
                  </div>
              </div>
          </div>
          
          {/* Spacer to balance flex layout if needed, or empty */}
          <div className="w-1"></div>
      </div>

      {/* Identity Details */}
      <div className="px-1 py-[1px] space-y-[0.5px]">
          <div className="flex items-baseline">
              <span className="font-bold w-[15mm] text-[6px]">NOME:</span>
              <span className="font-bold text-[7px] uppercase truncate flex-1">{safeName}</span>
          </div>
          <div className="flex items-baseline">
              <span className="font-bold w-[15mm] text-[6px]">MATRÍCULA:</span>
              <span className="font-bold text-[7px] uppercase truncate flex-1 bg-gray-200 px-1">{safeRecordId}</span>
          </div>
          <div className="flex items-baseline">
              <span className="font-bold w-[15mm] text-[6px]">CARGO:</span>
              <span className="font-bold text-[6px] uppercase truncate flex-1">{safeRole}</span>
          </div>
          <div className="flex items-baseline">
              <span className="font-bold w-[15mm] text-[6px]">DEPARTMENT:</span>
              <span className="font-bold text-[6px] uppercase truncate flex-1">{safeDept}</span>
          </div>
      </div>

      {/* Yellow Banner */}
      <div className="bg-vulcan-warning w-full py-[1px] border-y-[1px] border-black text-center mt-[1px]">
          <p className="text-[5px] font-bold">Matenha os seus treinamentos de segurança válidos</p>
      </div>

      {/* Driver License Section */}
      <div className="border-b-[1px] border-black h-[6.5mm] flex flex-col">
           <div className="flex h-1/2">
                <div className="w-[25%] border-r-[0.5px] border-black text-[5px] font-bold pl-1 flex items-center bg-gray-50">Carta Condução</div>
                <div className="w-[40%] border-r-[0.5px] border-black text-[5px] font-bold text-center flex items-center justify-center">Número</div>
                <div className="w-[35%] text-[5px] font-bold text-center flex items-center justify-center">Validade</div>
           </div>
           {isRac02Mapped ? (
               <div className="flex h-1/2 border-t-[0.5px] border-black">
                    <div className="w-[25%] border-r-[0.5px] border-black text-[6px] font-bold pl-1 flex items-center">{dlClass}</div>
                    <div className="w-[40%] border-r-[0.5px] border-black text-[6px] font-bold text-center flex items-center justify-center underline">{dlNum}</div>
                    <div className="w-[35%] text-[6px] font-bold text-center flex items-center justify-center">{dlExp}</div>
               </div>
           ) : (
               <div className="flex h-1/2 border-t-[0.5px] border-black bg-gray-100 items-center justify-center text-[5px]">N/A</div>
           )}
      </div>

      {/* ASO Section */}
      <div className="bg-vulcan-green text-white h-[3.5mm] flex items-center justify-between px-1 border-b-[1px] border-black">
          <span className="text-[6px] font-bold">VALIDADE ASO:</span>
          <span className="text-[6px] font-bold">{asoDate}</span>
      </div>

      {/* RAC Grid */}
      <div className="flex-1 flex text-[5px] border-b-[1px] border-black">
          {/* Left Column - 11 Rows - Dynamic Ordering */}
          <div className="w-1/2 border-r-[1px] border-black">
              {Array.from({ length: totalLeftRows }).map((_, idx) => {
                  // Get the RAC key for this slot if available
                  const racKey = activeRacs[idx];
                  
                  // Label formatting: RAC01 -> RAC 01
                  const label = racKey ? racKey.replace('RAC', 'RAC ') : '';
                  const dateVal = racKey ? getRacDate(racKey) : '';

                  return (
                    <div key={`left-${idx}`} className="flex h-[3.5mm] border-b-[0.5px] border-black last:border-b-0">
                        <div className={`w-[12mm] ${labelClass} border-r-[0.5px] border-black`}>
                           {label}
                        </div>
                        <div className={`flex-1 ${valueClass}`}>
                           {dateVal}
                        </div>
                    </div>
                  );
              })}
          </div>
          
          {/* Right Column - 8 Rows + QR */}
          <div className="w-1/2 flex flex-col">
               {/* 8 Data Rows */}
               <div>
                   {rightColData.map((row, idx) => (
                        <div key={`right-${idx}`} className="flex h-[3.5mm] border-b-[0.5px] border-black">
                            <div className={`w-[16mm] ${labelClass} border-r-[0.5px] border-black`}>
                               {row.label}
                            </div>
                            <div className={`flex-1 ${valueClass}`}>
                               {row.val}
                            </div>
                        </div>
                   ))}
               </div>
               
               {/* QR Container takes remaining space */}
               <div className="flex-1 flex items-center justify-start pl-1 relative">
                   <img 
                       src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrUrl)}`} 
                       alt="QR" 
                       className="w-[10mm] h-[10mm]"
                   />
               </div>
          </div>
      </div>

      {/* Footer / Signature */}
      <div className="h-[9mm] px-1 relative flex flex-col justify-start pt-[1px]">
           <div className="text-[5px] flex items-center gap-1">
               <span className="font-bold">EMISSÃO:</span>
               <span>{new Date().toLocaleString('en-GB')}</span>
           </div>
           
           <div className="text-[5px] flex items-end gap-1 mb-[2px]">
               <span className="font-bold">Riquisitado por:</span>
               <span>{safeName.split(' ')[0]}</span>
           </div>

           {/* 10 Golden Rules Shield - Bottom Right Overlay */}
           {/* Anchored bottom right */}
           <div className="absolute -right-[1px] -bottom-[6mm] w-[14mm] h-[16mm] z-20">
               {/* Vector representation of 10 Golden Rules Shield */}
               <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-md">
                   {/* Main Shield Shape */}
                   <path d="M50 5 L95 25 V50 C95 85 50 115 50 115 C50 115 5 85 5 50 V25 Z" fill="#4B5563" stroke="#fff" strokeWidth="2"/>
                   
                   {/* Colored Sections */}
                   <path d="M50 5 L95 25 V45 H50 V5 Z" fill="#F59E0B" /> {/* Yellow Top */}
                   <path d="M95 45 V50 C95 70 80 90 50 115 V80 H95" fill="#DC2626" /> {/* Red Right */}
                   <path d="M5 45 V50 C5 70 20 90 50 115 V80 H5" fill="#2563EB" /> {/* Blue Left */}
                   
                   {/* Center Text Area */}
                   <path d="M50 25 L80 35 V50 C80 75 50 100 50 100 C50 100 20 75 20 50 V35 Z" fill="#374151" opacity="0.9"/>
                   
                   <text x="50" y="55" fontSize="22" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial">10</text>
                   <text x="50" y="68" fontSize="8" textAnchor="middle" fill="white" fontFamily="Arial">Regras</text>
                   <text x="50" y="76" fontSize="8" textAnchor="middle" fill="white" fontFamily="Arial">de Ouro</text>
               </svg>
           </div>
      </div>

      {/* Valid Until Strip - Green */}
      <div className="bg-vulcan-green text-white text-[7px] font-bold text-center py-[1px]">
          VALIDO ATÉ {asoDate ? asoDate : '16-02-2026'}
      </div>

      {/* Emergency Strip */}
      <div className="h-[6mm] bg-[#65a30d] flex items-center pl-1 relative border-t-[1px] border-white">
          <div className="w-[4mm] h-[4mm] bg-orange-500 rounded-full flex items-center justify-center border-[1px] border-white z-20 shadow-sm">
             <Phone size={8} className="text-white fill-white" />
          </div>
          <div className="text-center text-slate-900 leading-none ml-2 flex flex-col items-center flex-1 pr-[12mm]">
              <div className="text-[5px] font-bold">EM CASO DE EMERGÊNCIA LIGUE</div>
              <div className="text-[7px] font-black tracking-widest">822030 / 842030</div>
          </div>
      </div>

    </div>
  );
};

export default CardTemplate;
