
import React from 'react';
import { Booking, EmployeeRequirement } from '../types';
import { MOCK_SESSIONS } from '../constants';
import { Phone } from 'lucide-react';

interface CardTemplateProps {
  booking: Booking;
  requirement?: EmployeeRequirement;
}

const CardTemplate: React.FC<CardTemplateProps> = ({ booking, requirement }) => {
  // Robust guard clause: returns null if essential data is missing, preventing crashes
  if (!booking || !booking.employee) {
    return null;
  }

  const { employee } = booking;
  
  // Safe strings to prevent React Error #130 (Object as child)
  const safeName = String(employee.name || '').toUpperCase();
  const safeRecordId = String(employee.recordId || '');
  const safeRole = String(employee.role || '').toUpperCase();
  
  // Driver License Data - explicitly cast to string
  const dlNum = String(employee.driverLicenseNumber || '');
  const dlClass = String(employee.driverLicenseClass || '');
  const dlExp = String(employee.driverLicenseExpiry || '');

  // Logic: Show DL details only if RAC02 is effectively mapped/required.
  // requirement?.requiredRacs might be undefined, access safely.
  const isRac02Mapped = requirement?.requiredRacs ? !!requirement.requiredRacs['RAC02'] : false;
  
  // ASO Date - explicitly cast to string
  const asoDate = String(requirement?.asoExpiryDate || '');

  // Generate QR Code Link
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrUrl = `${appOrigin}/#/results?q=${safeRecordId}`;

  // Helper to get date for a specific RAC - returns strict string
  const getRacDate = (racKey: string): string => {
      // 1. Is it mapped?
      if (!requirement?.requiredRacs || !requirement.requiredRacs[racKey]) return ''; 

      // 2. We need to find the LATEST Passed booking for this RAC for this employee.
      // FOR PROTOTYPE: We will show the booking date if it matches the current `booking.sessionId` RAC type.
      
      let currentBookingRac = '';
      if (booking.sessionId && booking.sessionId.includes('RAC')) {
           const parts = booking.sessionId.split(' - ');
           currentBookingRac = parts[0].replace(' ', '');
      } else {
          // Try to find from mock sessions
          const s = MOCK_SESSIONS.find(session => session.id === booking.sessionId);
          if (s) currentBookingRac = s.racType.split(' - ')[0].replace(' ', '');
      }

      // If this is the RAC for the current passed booking, show its expiry.
      if (currentBookingRac === racKey && booking.status === 'Passed') {
          return String(booking.expiryDate || '');
      }
      
      return ''; 
  };

  // Border style for cells
  const cellBorder = "border-[0.5px] border-black";
  const labelClass = "font-bold text-[6px] pl-[2px] flex items-center bg-gray-50";
  const valueClass = "text-[6px] font-bold text-center flex items-center justify-center";

  // Dimensions: 54mm x 86mm (Vertical ID-1)
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
      <div className="flex h-[11mm] border-b-[1px] border-black">
          {/* Logo Section */}
          <div className="w-[60%] pl-1 flex flex-col justify-center">
             <div className="flex items-baseline">
                <span className="text-[12px] font-black italic tracking-tighter text-slate-900">Vulcan</span>
                <span className="ml-[1px] text-slate-500 text-[6px] align-top">▼</span>
             </div>
          </div>
          {/* Top Right Box */}
          <div className="w-[40%] flex flex-col items-end">
              <span className="text-[5px] font-bold pr-1 pt-[1px]">PAD_V04</span>
              <div className="w-[15mm] h-[4mm] bg-vulcan-headerYellow mt-auto mr-[2px] mb-[2px]"></div>
          </div>
      </div>

      {/* Identity Details */}
      <div className="px-1 py-[2px] space-y-[1px]">
          <div className="flex items-baseline">
              <span className="font-bold w-[13mm] text-[6px]">NOME:</span>
              <span className="font-bold text-[7px] uppercase truncate flex-1">{safeName}</span>
          </div>
          <div className="flex items-baseline">
              <span className="font-bold w-[13mm] text-[6px]">MATRÍCULA:</span>
              <span className="font-bold text-[7px] uppercase truncate flex-1 bg-gray-200 px-1">{safeRecordId}</span>
          </div>
          <div className="flex items-baseline">
              <span className="font-bold w-[13mm] text-[6px]">CARGO:</span>
              <span className="font-bold text-[7px] uppercase truncate flex-1">{safeRole}</span>
          </div>
      </div>

      {/* Yellow Banner */}
      <div className="bg-vulcan-warning w-full py-[1px] border-y-[1px] border-black text-center mt-[1px]">
          <p className="text-[6px] font-bold">Matenha os seus treinamentos de segurança válidos</p>
      </div>

      {/* Driver License Section - Only if RAC 02 */}
      {isRac02Mapped ? (
        <div className="border-b-[1px] border-black">
            <div className={`flex ${cellBorder} border-t-0 border-x-0`}>
                <div className="w-[30%] text-[5px] font-bold pl-1 bg-gray-50 border-r-[0.5px] border-black">Carta Condução</div>
                <div className="w-[40%] text-[5px] font-bold text-center border-r-[0.5px] border-black">Número</div>
                <div className="w-[30%] text-[5px] font-bold text-center">Validade</div>
            </div>
            <div className="flex h-[3.5mm]">
                <div className="w-[30%] text-[6px] font-bold pl-1 border-r-[0.5px] border-black flex items-center">{dlClass}</div>
                <div className="w-[40%] text-[6px] font-bold text-center border-r-[0.5px] border-black flex items-center justify-center">{dlNum}</div>
                <div className="w-[30%] text-[6px] font-bold text-center flex items-center justify-center">{dlExp}</div>
            </div>
        </div>
      ) : (
        // Spacer if no DL
        <div className="h-[7mm] border-b-[1px] border-black bg-gray-100 flex items-center justify-center text-[5px] text-gray-400">
            N/A
        </div>
      )}

      {/* ASO Section */}
      <div className="bg-vulcan-green text-white text-[7px] font-bold px-1 py-[0.5px] border-b-[0.5px] border-black">
          VALIDADE ASO:
      </div>
      
      <div className="flex h-[8mm] border-b-[1px] border-black">
           {/* Left Block for Date */}
           <div className="w-1/2 border-r-[0.5px] border-black p-1">
               <div className="w-full h-full border-[0.5px] border-black flex items-center justify-center font-bold text-[8px]">
                  {asoDate}
               </div>
           </div>
           {/* Right Block Blank */}
           <div className="w-1/2 p-1">
              <div className="w-full h-full border-[0.5px] border-black"></div>
           </div>
      </div>

      {/* RAC Grid */}
      <div className="flex-1 flex text-[5px]">
          {/* Column 1 (RAC 01 - 05) */}
          <div className="w-1/2 border-r-[0.5px] border-black">
              {[1, 2, 3, 4, 5].map(num => {
                  const key = `RAC${String(num).padStart(2, '0')}`;
                  const isMapped = requirement?.requiredRacs ? !!requirement.requiredRacs[key] : false;
                  
                  return (
                    <div key={key} className={`flex h-[4mm] border-b-[0.5px] border-black last:border-b-0`}>
                        <div className={`w-[10mm] ${labelClass} border-r-[0.5px] border-black`}>
                           {isMapped ? `RAC ${String(num).padStart(2, '0')}` : ''}
                        </div>
                        <div className={`flex-1 ${valueClass}`}>
                           {isMapped ? getRacDate(key) : ''}
                        </div>
                    </div>
                  );
              })}
          </div>
          
          {/* Column 2 (RAC 06 - 10) */}
          <div className="w-1/2">
               {[6, 7, 8, 9, 10].map(num => {
                  const key = `RAC${String(num).padStart(2, '0')}`;
                  const isMapped = requirement?.requiredRacs ? !!requirement.requiredRacs[key] : false;

                  return (
                    <div key={key} className={`flex h-[4mm] border-b-[0.5px] border-black last:border-b-0`}>
                        <div className={`w-[10mm] ${labelClass} border-r-[0.5px] border-black`}>
                           {isMapped ? `RAC ${String(num).padStart(2, '0')}` : ''}
                        </div>
                        <div className={`flex-1 ${valueClass}`}>
                           {isMapped ? getRacDate(key) : ''}
                        </div>
                    </div>
                  );
              })}
          </div>
      </div>

      {/* Footer */}
      <div className="px-1 pt-[1px] relative text-[5px]">
           <div className="font-bold">EMISSÃO: <span className="font-normal">{new Date().toLocaleDateString()}</span></div>
           <div className="mt-[2px] font-bold">ASSINATURA E CARIMBO:</div>
           {/* Adjusted box width to allow space for QR code */}
           <div className="h-[4mm] w-[28mm] border-[0.5px] border-black mb-[1px]"></div>
           <div className="flex items-end mb-[2px]">
               <span className="font-bold mr-1">Liberado por:</span>
               <div className="border-b-[1px] border-dotted border-black w-[18mm]"></div>
           </div>

           {/* Shield Logo Graphic (SVG) */}
           <div className="absolute right-[2px] bottom-[2px] w-[12mm] h-[14mm] z-10">
                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-sm">
                     <path d="M50 0 L100 25 V50 C100 85 50 120 50 120 C50 120 0 85 0 50 V25 Z" fill="#fff" stroke="#d97706" strokeWidth="4"/>
                     <path d="M50 10 L90 30 V50 C90 80 50 110 50 110 C50 110 10 80 10 50 V30 Z" fill="#78350f" /> 
                     <path d="M50 10 L90 30 V50 C90 80 50 110 50 110 C50 110 50 80 50 50 Z" fill="#92400e" opacity="0.5" />
                     <text x="50" y="55" fontSize="24" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial">10</text>
                     <text x="50" y="70" fontSize="10" textAnchor="middle" fill="white" fontFamily="Arial">Regras</text>
                     <text x="50" y="80" fontSize="10" textAnchor="middle" fill="white" fontFamily="Arial">de Ouro</text>
                </svg>
           </div>

           {/* QR Code - Linking to employee record */}
           <div className="absolute right-[14mm] bottom-[2px] w-[10mm] h-[10mm] z-10 bg-white p-[0.5mm]">
               <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrUrl)}`} 
                   alt="QR" 
                   className="w-full h-full object-contain"
               />
           </div>
      </div>

      {/* Emergency Strip */}
      <div className="h-[5mm] bg-vulcan-green flex items-center pl-1 relative">
          <div className="w-[3.5mm] h-[3.5mm] bg-yellow-400 rounded-full flex items-center justify-center border-[1px] border-white z-20">
             <Phone size={6} className="text-white fill-white" />
          </div>
          <div className="text-center text-white leading-none ml-2 flex flex-col items-start">
              <div className="text-[4px] font-bold uppercase">EM CASO DE EMERGÊNCIA LIGUE</div>
              <div className="text-[6px] font-black tracking-widest bg-vulcan-green pl-1">822030 / 842030</div>
          </div>
          {/* Dashed line effect */}
          <div className="absolute bottom-[2px] left-0 w-full border-b-[1px] border-dotted border-white opacity-30"></div>
      </div>

    </div>
  );
};

export default CardTemplate;
