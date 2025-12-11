
import React from 'react';
import { Booking, EmployeeRequirement, RacDef, TrainingSession } from '../types';
import { OPS_KEYS, PERMISSION_KEYS, INITIAL_RAC_DEFINITIONS } from '../constants';
import { Phone } from 'lucide-react';
import { formatDate } from '../utils/translations';

interface CardTemplateProps {
  booking: Booking;
  requirement?: EmployeeRequirement;
  allBookings?: Booking[];
  racDefinitions?: RacDef[]; 
  sessions?: TrainingSession[];
}

const CardTemplate: React.FC<CardTemplateProps> = ({ 
  booking, 
  requirement, 
  allBookings,
  racDefinitions = INITIAL_RAC_DEFINITIONS,
  sessions = []
}) => {
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

  const today = new Date().toISOString().split('T')[0];

  // --- Date Calculation State ---
  let maxValidDate = requirement?.asoExpiryDate || '';
  
  const checkDateForMax = (date: string) => {
      if (!date) return;
      if (!maxValidDate || date > maxValidDate) {
          maxValidDate = date;
      }
  };

  // Helper to find date across all bookings if provided
  const getRacDateInfo = (racKey: string): { dateStr: string, rawDate: string } | null => {
      if (allBookings && allBookings.length > 0) {
          const empId = employee.id;
          const matches = allBookings.filter(b => {
              if (b.employee.id !== empId) return false;
              if (b.status !== 'Passed') return false;
              if (!b.expiryDate) return false;

              // Check if this booking matches the requested RAC Key
              let bRacKey = '';
              // 1. Try Session Object (Most Reliable)
              const session = sessions.find(s => s.id === b.sessionId);
              if (session) {
                  bRacKey = session.racType.split(' - ')[0].replace(' ', '');
              } else {
                  // 2. Fallback to String Parsing
                  const normalizedKey = racKey.replace('RAC', 'RAC '); 
                  if (b.sessionId.includes(normalizedKey)) return true; // Direct match
                  if (b.sessionId.includes(racKey)) return true; // Direct match
                  if (b.sessionId.includes('RAC')) {
                       bRacKey = b.sessionId.split(' - ')[0].replace(' ', '');
                  }
              }
              
              // If we resolved a code, compare it
              if (bRacKey) return bRacKey === racKey;
              
              return false;
          });

          if (matches.length > 0) {
               matches.sort((a, b) => new Date(b.expiryDate!).getTime() - new Date(a.expiryDate!).getTime());
               const best = matches[0];
               if (best.expiryDate && best.expiryDate > today) {
                   return { dateStr: formatDate(best.expiryDate), rawDate: best.expiryDate };
               }
          }
      }
      return null; 
  };

  const labelClass = "font-bold text-[5px] pl-[2px] flex items-center bg-gray-50 leading-none";
  const valueClass = "text-[5px] font-bold text-center flex items-center justify-center leading-none";

  // Data for Right Column (8 Rows - Mapped from OPS_KEYS)
  const rightColData = Array.from({ length: 8 }).map((_, idx) => {
      const key = OPS_KEYS[idx];
      if (!key) return { label: '', val: '' };

      const isRequired = requirement?.requiredRacs?.[key];
      
      // Strict Visibility: If not mapped, show nothing
      if (!isRequired) return { label: '', val: '' };

      let val = '';
      if (PERMISSION_KEYS.includes(key)) {
          val = '-SIM-';
      } else {
          const info = getRacDateInfo(key);
          if (info) {
              val = info.dateStr;
              checkDateForMax(info.rawDate);
          } else {
              // Mapped but Invalid/Expired -> Show Nothing (empty cell)
              return { label: '', val: '' };
          }
      }

      let displayLabel = key;
      if (key === 'EXEC_CRED') displayLabel = 'Exec. Cred';
      if (key === 'EMIT_PTS') displayLabel = 'Emitente PTS';
      if (key === 'APR_ART') displayLabel = 'Aprovad. ART';

      return { label: displayLabel, val };
  });

  // Data for Left Column
  const totalLeftRows = 11;
  const leftColData = Array.from({ length: totalLeftRows }).map((_, idx) => {
      const racDef = racDefinitions[idx];
      if (!racDef) return { label: '', val: '' };
      
      const key = racDef.code;
      const isRequired = requirement?.requiredRacs?.[key];
      const label = key.replace('RAC', 'RAC ');
      
      // Strict Visibility
      if (!isRequired) return { label: '', val: '' };

      const info = getRacDateInfo(key);
      if (info) {
          checkDateForMax(info.rawDate);
          return { label, val: info.dateStr };
      }
      
      // Required but not valid -> Empty
      return { label: '', val: '' };
  });

  const validUntilStr = maxValidDate ? formatDate(maxValidDate) : '';

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
      
      {/* Header - FLUSH TO TOP EDGE */}
      <div className="flex h-[11mm] border-b-[1px] border-black relative justify-between items-center px-1 overflow-hidden">
          {/* Logo Section - Relative Path */}
          <div className="flex flex-col justify-center h-full w-[15mm] relative">
             <img 
                src="assets/vulcan.png" 
                alt="Vulcan" 
                className="max-h-[10mm] object-contain"
                style={{ display: 'block' }}
                onError={(e) => console.error("Failed to load Vulcan logo", e.currentTarget.src)}
             />
          </div>
          
          {/* Centered Company Bar Container - STARTS AT TOP EDGE (top-0) */}
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
              <div className="flex flex-col items-center justify-start w-full">
                  <span className="text-[4px] font-bold text-gray-500 absolute top-[1px] right-[2px] z-20">PAD_v5e</span>
                  
                  {/* The Bar */}
                  <div 
                    className="w-[24mm] min-h-[6mm] flex items-center justify-center text-[5px] font-bold uppercase overflow-hidden shadow-sm border-b-[0.5px] border-x-[0.5px] border-black leading-tight"
                    style={{ backgroundColor: headerBg, color: headerTextColor }}
                  >
                     {/* Text Wrapping Enabled */}
                     <span className="px-1 text-center whitespace-normal break-words w-full">
                        {headerText}
                     </span>
                  </div>
              </div>
          </div>
          
          <div className="w-1"></div>
      </div>

      {/* Identity Details */}
      <div className="px-1 py-[1px] space-y-[0.5px] mt-[1px]">
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
          {/* Left Column - 11 Rows */}
          <div className="w-1/2 border-r-[1px] border-black">
              {leftColData.map((row, idx) => (
                    <div key={`left-${idx}`} className="flex h-[3.5mm] border-b-[0.5px] border-black last:border-b-0">
                        <div className={`w-[12mm] ${labelClass} border-r-[0.5px] border-black`}>
                           {row.label}
                        </div>
                        <div className={`flex-1 ${valueClass}`}>
                           {row.val}
                        </div>
                    </div>
              ))}
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
               
               {/* QR Container */}
               <div className="flex-1 flex items-center justify-start pl-[2px] relative overflow-hidden">
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
           
           <div className="flex flex-col mb-[2px]">
               <div className="text-[5px] flex items-end gap-1">
                   <span className="font-bold">Riquisitado por:</span>
                   <span>{safeName.split(' ')[0]}</span>
               </div>
               <div className="text-[4px] text-gray-500 font-mono leading-none">
                   System: RAC MANAGER
               </div>
           </div>
      </div>

      {/* Valid Until Strip - Green (Calculated MAX date) */}
      <div className="bg-vulcan-green text-white text-[7px] font-bold text-center py-[1px]">
          VALIDO ATÉ {validUntilStr}
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

      {/* 10 Golden Rules Shield - IMAGE ASSET - Relative Path */}
      <div className="absolute -right-[1px] bottom-[8.5mm] w-[13mm] h-[15mm] z-30">
           <img 
              src="assets/Golden_Rules.png" 
              alt="Golden Rules"
              className="w-full h-full object-contain filter drop-shadow-sm"
              style={{ display: 'block' }}
              onError={(e) => console.error("Failed to load Golden Rules", e.currentTarget.src)}
           />
      </div>

    </div>
  );
};

export default CardTemplate;
