
import React, { memo } from 'react';
import { Booking, EmployeeRequirement, RacDef, TrainingSession } from '../types';
import { OPS_KEYS, PERMISSION_KEYS, INITIAL_RAC_DEFINITIONS } from '../constants';
import { Phone, Shield, Star } from 'lucide-react';
import { formatDate } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { language } = useLanguage();
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

  const isRac02Mapped = requirement?.requiredRacs ? !!requirement.requiredRacs['RAC02'] : false;

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrUrl = `${appOrigin}${window.location.pathname}#/verify/${safeRecordId}`;

  // BRANDING LOGIC
  // Tenant is CARS Solutions. Others are subcontractors.
  const isTenant = employee.company === 'CARS Solutions';
  const headerBg = isTenant ? '#001a35' : '#f97316'; // Very dark blue vs Orange
  const headerTextColor = 'white';
  
  // Left side shows Tenant Name/Logo. Right side is standard RACS indicator.
  const leftHeaderText = safeCompany;
  const rightHeaderText = 'RACS';

  const today = new Date().toISOString().split('T')[0];
  let maxValidDate = requirement?.asoExpiryDate || '';
  
  const checkDateForMax = (date: string) => {
      if (!date) return;
      if (!maxValidDate || date > maxValidDate) {
          maxValidDate = date;
      }
  };

  const getRacDateInfo = (racKey: string): { dateStr: string, rawDate: string } | null => {
      if (allBookings && allBookings.length > 0) {
          const empId = employee.id;
          const matches = allBookings.filter(b => {
              if (b.employee.id !== empId) return false;
              if (b.status !== 'Passed') return false;
              if (!b.expiryDate) return false;
              let bRacKey = '';
              const session = sessions.find(s => s.id === b.sessionId);
              if (session) {
                  bRacKey = session.racType.split(' - ')[0].replace(' ', '');
              } else {
                  const normalizedKey = racKey.replace('RAC', 'RAC '); 
                  if (b.sessionId.includes(normalizedKey)) return true;
                  if (b.sessionId.includes(racKey)) return true;
                  if (b.sessionId.includes('RAC')) {
                       bRacKey = b.sessionId.split(' - ')[0].replace(' ', '');
                  }
              }
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

  const labelClass = "font-bold text-[7px] pl-[2px] flex items-center bg-gray-50 leading-none";
  const valueClass = "text-[7px] font-bold text-center flex items-center justify-center leading-none";

  interface GridItem {
      code: string;
      label: string;
      isOps: boolean;
  }

  const masterGridItems: GridItem[] = [
      ...racDefinitions.map(def => ({
          code: def.code,
          label: def.code.startsWith('RAC') ? def.code.replace('RAC', 'RAC ') : def.code,
          isOps: false
      })),
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

  const activeGridItems = masterGridItems.filter(item => 
      requirement?.requiredRacs?.[item.code]
  );

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

  const leftColData = Array.from({ length: 13 }).map((_, idx) => {
      const item = activeGridItems[idx];
      return processItem(item);
  });

  const validUntilStr = maxValidDate ? formatDate(maxValidDate) : '';

  return (
    <div style={{ position: 'relative', width: '51mm', height: '81mm' }}>
        <div className="absolute -top-[3mm] -left-[3mm] w-[3mm] h-[3mm] border-r border-b border-black print:block hidden" style={{ borderWidth: '0 0.5px 0.5px 0' }}></div>
        <div className="absolute -top-[3mm] -right-[3mm] w-[3mm] h-[3mm] border-l border-b border-black print:block hidden" style={{ borderWidth: '0 0.5px 0.5px' }}></div>
        <div className="absolute -bottom-[3mm] -left-[3mm] w-[3mm] h-[3mm] border-r border-t border-black print:block hidden" style={{ borderWidth: '0.5px 0.5px 0 0' }}></div>
        <div className="absolute -bottom-[3mm] -right-[3mm] w-[3mm] h-[3mm] border-l border-t border-black print:block hidden" style={{ borderWidth: '0.5px 0 0 0.5px' }}></div>

        <div 
        className="bg-white text-slate-900 relative flex flex-col overflow-hidden box-border h-full w-full" 
        style={{ border: '1px solid black', fontSize: '8px', lineHeight: '1.1' }}
        >
        <div className="flex h-[10mm] border-b-[1px] border-black relative justify-between items-center px-1 overflow-hidden" style={{ backgroundColor: headerBg }}>
            <div className="flex items-center justify-start h-full w-[35mm] relative">
                {/* Header Left: Tenant Name (Company) */}
                <div className="px-2 text-white font-black text-[9px] leading-tight truncate uppercase">
                    {leftHeaderText}
                </div>
            </div>
            
            <div className="flex items-center justify-end h-full flex-1">
                <span className="text-[5px] font-bold text-white/50 absolute top-[1px] right-[2px] z-20">PAD_v8</span>
                {/* Header Right: RACS standard label */}
                <div 
                    className="h-[8mm] px-3 flex items-center justify-center text-[12px] font-bold uppercase border-l border-black/20"
                    style={{ color: headerTextColor }}
                >
                    {rightHeaderText}
                </div>
            </div>
        </div>

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

        <div className="bg-vulcan-warning w-full py-[1px] border-y-[1px] border-black text-center mt-[1px]">
            <p className="text-[7px] font-bold leading-tight">Matenha os seus treinamentos de segurança válidos</p>
        </div>

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

        <div className="bg-vulcan-green text-white h-[3mm] flex items-center justify-between px-1 border-b-[1px] border-black">
            <span className="text-[8px] font-bold leading-none">VALIDADE ASO:</span>
            <span className="text-[8px] font-bold leading-none">{asoDate}</span>
        </div>

        <div className="flex-1 flex text-[5px]">
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
            <div className="flex-1 flex flex-col items-center justify-evenly p-[1mm] relative">
                <div className="flex items-center justify-center w-full h-[50%]">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`} 
                        alt="QR" 
                        className="w-[19mm] h-[19mm] object-contain"
                    />
                </div>
                <div className="flex items-center justify-center w-full h-[50%]">
                    <div className="w-[18mm] h-[20mm] flex flex-col items-center justify-center relative">
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

        <div className="border-t-[1px] border-black">
            <div className="bg-vulcan-green text-white text-[9px] font-bold text-center py-[1px] border-b-[1px] border-black leading-tight">
                VALIDO ATÉ {validUntilStr}
            </div>
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
