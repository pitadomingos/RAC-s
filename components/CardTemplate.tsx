
import React, { memo } from 'react';
import { Booking, EmployeeRequirement, RacDef, TrainingSession } from '../types';
import { OPS_KEYS, PERMISSION_KEYS, INITIAL_RAC_DEFINITIONS } from '../constants';
import { Phone, Shield, Star } from 'lucide-react';
import { formatDate } from '../utils/translations';

interface CardTemplateProps {
  booking: Booking;
  requirement?: EmployeeRequirement;
  allBookings?: Booking[];
  racDefinitions?: RacDef[]; 
  sessions?: TrainingSession[];
  printedBy?: string;
}

const CardTemplate: React.FC<CardTemplateProps> = memo(({ 
  booking, 
  requirement, 
  allBookings,
  racDefinitions = INITIAL_RAC_DEFINITIONS,
  sessions = [],
  printedBy = 'System'
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
  // Ensure the hash router path is correct for the QR
  const qrUrl = `${appOrigin}${window.location.pathname}#/verify/${safeRecordId}`;

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

  // Bumped font sizes for Grid
  const labelClass = "font-bold text-[7px] pl-[2px] flex items-center bg-gray-50 leading-none";
  const valueClass = "text-[7px] font-bold text-center flex items-center justify-center leading-none";

  // --- Combined List Construction ---
  interface GridItem {
      code: string;
      label: string;
      isOps: boolean;
  }

  // 1. Define Master List in Database Order
  const masterGridItems: GridItem[] = [
      // Normal RACs (RAC01-10 + PTS, ART, LIBs)
      ...racDefinitions.map(def => ({
          code: def.code,
          label: def.code.startsWith('RAC') ? def.code.replace('RAC', 'RAC ') : def.code,
          isOps: false
      })),
      // Operational Designations
      ...OPS_KEYS.map(key => {
          let displayLabel = key;
          if (key === 'EMI_PTS') displayLabel = 'Emi-PTS';
          if (key === 'APR_ART') displayLabel = 'Apr-ART';
          if (key === 'DONO_AREA_PTS') displayLabel = 'Dono-AreaPTS';
          if (key === 'EXEC') displayLabel = 'Exec';
          return {
              code: key,
              label: displayLabel,
              isOps: true
          };
      })
  ];

  // 2. Filter to COMPACT list (Remove gaps/unrequired items)
  const activeGridItems = masterGridItems.filter(item => 
      requirement?.requiredRacs?.[item.code]
  );

  // Logic to process a single grid row item
  const processItem = (item: GridItem | undefined) => {
      if (!item) return { label: '', val: '' };

      const key = item.code;
      let val = '';

      if (item.isOps && PERMISSION_KEYS.includes(key)) {
          val = '-SIM-';
      } else {
          const info = getRacDateInfo(key);
          if (info) {
              val = info.dateStr;
              checkDateForMax(info.rawDate);
          } else {
              val = '';
          }
      }

      return { label: item.label, val };
  };

  // --- Split into Columns ---
  // Left: 13 Slots (Increased to hold most items)
  const leftColData = Array.from({ length: 13 }).map((_, idx) => {
      const item = activeGridItems[idx];
      return processItem(item);
  });

  const validUntilStr = maxValidDate ? formatDate(maxValidDate) : '';

  return (
    // Outer Container for Crop Marks (Relative)
    <div style={{ position: 'relative', width: '51mm', height: '81mm' }}>
        
        {/* Crop Marks - Positioned outside the main card area */}
        {/* Top Left */}
        <div className="absolute -top-[3mm] -left-[3mm] w-[3mm] h-[3mm] border-r border-b border-black print:block hidden" style={{ borderWidth: '0 0.5px 0.5px 0' }}></div>
        {/* Top Right */}
        <div className="absolute -top-[3mm] -right-[3mm] w-[3mm] h-[3mm] border-l border-b border-black print:block hidden" style={{ borderWidth: '0 0 0.5px 0.5px' }}></div>
        {/* Bottom Left */}
        <div className="absolute -bottom-[3mm] -left-[3mm] w-[3mm] h-[3mm] border-r border-t border-black print:block hidden" style={{ borderWidth: '0.5px 0.5px 0 0' }}></div>
        {/* Bottom Right */}
        <div className="absolute -bottom-[3mm] -right-[3mm] w-[3mm] h-[3mm] border-l border-t border-black print:block hidden" style={{ borderWidth: '0.5px 0 0 0.5px' }}></div>

        {/* --- MAIN CARD CONTENT --- */}
        <div 
        className="bg-white text-slate-900 relative flex flex-col overflow-hidden box-border h-full w-full" 
        style={{ 
            border: '1px solid black', // Main Cut Line
            fontSize: '8px',
            lineHeight: '1.1'
        }}
        >
        
        {/* Header - FLUSH TO TOP EDGE */}
        <div className="flex h-[10mm] border-b-[1px] border-black relative justify-between items-center px-1 overflow-hidden">
            {/* Logo - Aligned Left and Enlarged */}
            <div className="flex items-center justify-start h-full w-[24mm] relative">
                {/* Fallback Text if Image fails, but Image preferred */}
                <img 
                    src="assets/vulcan.png" 
                    alt="Vulcan" 
                    className="h-[9.5mm] w-auto object-contain object-left"
                    style={{ display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            </div>
            
            {/* Centered Company Bar */}
            <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
                <div className="flex flex-col items-center justify-start w-full">
                    <span className="text-[5px] font-bold text-gray-500 absolute top-[1px] right-[2px] z-20">PAD_v7</span>
                    
                    <div 
                        className="w-[24mm] min-h-[6mm] flex items-center justify-center text-[12px] font-bold uppercase overflow-hidden shadow-sm border-b-[0.5px] border-x-[0.5px] border-black leading-[0.9]"
                        style={{ backgroundColor: headerBg, color: headerTextColor }}
                    >
                        <span className="px-1 text-center whitespace-normal break-words w-full">
                            {headerText}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-1"></div>
        </div>

        {/* NEW: Issue Info Bar (Immediately below header) */}
        <div className="flex items-center justify-between px-1 h-[3mm] border-b-[1px] border-black bg-gray-50">
            <div className="text-[7px] flex items-center gap-1">
                <span className="font-bold">EMISSÃO:</span>
                <span>{new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-[7px] flex items-center gap-1">
                <span className="font-bold">REQ. POR:</span>
                <span className="uppercase font-bold">{printedBy.split(' ')[0]}</span>
            </div>
        </div>

        {/* Identity Details - Font Sizes Increased */}
        <div className="px-1 py-[1px] space-y-[0.5px] mt-[1px]">
            <div className="flex items-baseline">
                <span className="font-bold w-[16mm] text-[7px]">NOME:</span>
                <span className="font-bold text-[9px] uppercase truncate flex-1 leading-none">{safeName}</span>
            </div>
            <div className="flex items-baseline">
                <span className="font-bold w-[16mm] text-[7px]">MATRÍCULA:</span>
                <span className="font-bold text-[9px] uppercase truncate flex-1 bg-gray-200 px-1 leading-none">{safeRecordId}</span>
            </div>
            <div className="flex items-baseline">
                <span className="font-bold w-[16mm] text-[7px]">CARGO:</span>
                <span className="font-bold text-[8px] uppercase truncate flex-1 leading-none">{safeRole}</span>
            </div>
            <div className="flex items-baseline">
                <span className="font-bold w-[16mm] text-[7px]">DEPARTMENT:</span>
                <span className="font-bold text-[8px] uppercase truncate flex-1 leading-none">{safeDept}</span>
            </div>
        </div>

        {/* Yellow Banner */}
        <div className="bg-vulcan-warning w-full py-[1px] border-y-[1px] border-black text-center mt-[1px]">
            <p className="text-[7px] font-bold leading-tight">Matenha os seus treinamentos de segurança válidos</p>
        </div>

        {/* Driver License Section - Sizes Increased, Carta text adjusted */}
        <div className="border-b-[1px] border-black h-[6mm] flex flex-col">
            <div className="flex h-1/2">
                    <div className="w-[25%] border-r-[0.5px] border-black text-[5px] font-bold pl-1 flex items-center bg-gray-50 leading-none tracking-tight">Carta Condução</div>
                    <div className="w-[40%] border-r-[0.5px] border-black text-[7px] font-bold text-center flex items-center justify-center leading-none">Número</div>
                    <div className="w-[35%] text-[7px] font-bold text-center flex items-center justify-center leading-none">Validade</div>
            </div>
            {isRac02Mapped ? (
                <div className="flex h-1/2 border-t-[0.5px] border-black">
                        <div className="w-[25%] border-r-[0.5px] border-black text-[9px] font-bold pl-1 flex items-center leading-none">{dlClass}</div>
                        <div className="w-[40%] border-r-[0.5px] border-black text-[9px] font-bold text-center flex items-center justify-center underline leading-none">{dlNum}</div>
                        <div className="w-[35%] text-[9px] font-bold text-center flex items-center justify-center leading-none">{dlExp}</div>
                </div>
            ) : (
                <div className="flex h-1/2 border-t-[0.5px] border-black bg-gray-100 items-center justify-center text-[7px] leading-none">N/A</div>
            )}
        </div>

        {/* ASO Section - Sizes Increased */}
        <div className="bg-vulcan-green text-white h-[3mm] flex items-center justify-between px-1 border-b-[1px] border-black">
            <span className="text-[8px] font-bold leading-none">VALIDADE ASO:</span>
            <span className="text-[8px] font-bold leading-none">{asoDate}</span>
        </div>

        {/* RAC Grid */}
        <div className="flex-1 flex text-[5px]">
            {/* Left Column - 13 Rows */}
            <div className="w-[58%] border-r-[1px] border-black">
                {leftColData.map((row, idx) => (
                        <div key={`left-${idx}`} className="flex h-[3.1mm] border-b-[0.5px] border-black last:border-b-0">
                            <div className={`w-[13mm] ${labelClass} border-r-[0.5px] border-black`}>
                            {row.label}
                            </div>
                            <div className={`flex-1 ${valueClass}`}>
                            {row.val}
                            </div>
                        </div>
                ))}
            </div>
            
            {/* Right Column - Graphics Only */}
            <div className="flex-1 flex flex-col items-center justify-evenly p-[1mm] relative">
                {/* QR Code */}
                <div className="flex items-center justify-center w-full h-[50%]">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`} 
                        alt="QR" 
                        className="w-[19mm] h-[19mm] object-contain"
                    />
                </div>
                
                {/* Golden Rules Shield - VECTOR REPLACEMENT */}
                <div className="flex items-center justify-center w-full h-[50%]">
                    <div className="w-[18mm] h-[20mm] flex flex-col items-center justify-center relative">
                        {/* Custom Shield Shape via CSS/SVG */}
                        <div className="relative text-[#d97706]">
                            <Shield size={50} fill="currentColor" strokeWidth={1.5} />
                            <div className="absolute inset-0 flex items-center justify-center pb-2">
                                <Star size={24} className="text-white" fill="white" />
                            </div>
                        </div>
                        <div className="text-[5px] font-black uppercase text-[#d97706] mt-[1px] tracking-tight text-center leading-none">
                            Golden<br/>Rules
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Area - Valid Until & Emergency - Sizes Increased */}
        <div className="border-t-[1px] border-black">
            {/* Valid Until Strip */}
            <div className="bg-vulcan-green text-white text-[9px] font-bold text-center py-[1px] border-b-[1px] border-black leading-tight">
                VALIDO ATÉ {validUntilStr}
            </div>

            {/* Emergency Strip */}
            <div className="h-[5mm] bg-[#65a30d] flex items-center pl-1 relative">
                <div className="w-[4mm] h-[4mm] bg-orange-500 rounded-full flex items-center justify-center border-[1px] border-white z-20 shadow-sm">
                    <Phone size={10} className="text-white fill-white" />
                </div>
                <div className="text-center text-slate-900 leading-none ml-2 flex flex-col items-center flex-1 pr-[10mm]">
                    <div className="text-[7px] font-bold">EM CASO DE EMERGÊNCIA LIGUE</div>
                    <div className="text-[10px] font-black tracking-widest leading-none mt-[1px]">842030</div>
                </div>
            </div>
        </div>

        </div>
    </div>
  );
});

export default CardTemplate;
