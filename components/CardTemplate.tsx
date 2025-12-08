import React from 'react';
import { Booking } from '../types';
import { MOCK_SESSIONS } from '../constants';

interface CardTemplateProps {
  booking: Booking;
}

const CardTemplate: React.FC<CardTemplateProps> = ({ booking }) => {
  if (!booking || !booking.employee) {
    return <div className="text-red-500 text-[8px]">Invalid Data</div>;
  }

  const { employee, expiryDate } = booking;
  
  // Ensure we are working with safe strings
  const safeName = typeof employee.name === 'string' ? employee.name : '';
  const safeRecordId = typeof employee.recordId === 'string' ? employee.recordId : '';
  const safeRole = typeof employee.role === 'string' ? employee.role : '';
  const safeGa = typeof employee.ga === 'string' ? employee.ga : '';
  const safeExpiry = typeof expiryDate === 'string' ? expiryDate : '';

  // Helper to check if this card is for the specific RAC number
  const isRacForSession = (racNumber: number) => {
    let sessionIdOrName = booking.sessionId;
    
    // Resolve ID to RAC String if possible (Handles new booking system using IDs)
    const session = MOCK_SESSIONS.find(s => s.id === booking.sessionId);
    if (session) {
        sessionIdOrName = session.racType;
    }

    if (typeof sessionIdOrName !== 'string') return false;

    const numStr = String(racNumber).padStart(2, '0');
    // Check for "RAC01", "RAC1", "RAC 01" patterns
    return sessionIdOrName.includes(`RAC${numStr}`) || sessionIdOrName.includes(`RAC ${numStr}`);
  };

  return (
    <div className="w-full h-full border-2 border-slate-800 bg-white flex flex-col text-[10px] leading-tight overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-vulcan-yellow h-14 flex items-center justify-between px-2 border-b-2 border-slate-800">
        <div className="font-black text-xl italic tracking-tighter text-slate-900">Vulcan</div>
        <div className="text-right font-bold text-xs">
          PAD_V04
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-2 flex flex-col gap-1">
        
        {/* Identity Section */}
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <div className="space-y-1">
            <div className="flex">
              <span className="font-bold w-16">NOME:</span>
              <span className="uppercase border-b border-gray-300 flex-1 truncate">{safeName}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-16">MATRÍCULA:</span>
              <span className="uppercase border-b border-gray-300 flex-1">{safeRecordId}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-16">CARGO:</span>
              <span className="uppercase border-b border-gray-300 flex-1 truncate">{safeRole}</span>
            </div>
            <div className="flex">
              <span className="font-bold w-16">GA:</span>
              <span className="uppercase border-b border-gray-300 flex-1 truncate">{safeGa}</span>
            </div>
          </div>
          {/* Photo Placeholder */}
          <div className="bg-gray-200 border border-gray-400 h-20 w-full flex items-center justify-center text-gray-400 text-[8px] text-center">
            PHOTO
          </div>
        </div>

        {/* Warning Stripe */}
        <div className="bg-vulcan-yellow font-bold text-center py-1 mt-1 border border-slate-800 text-[9px]">
          Mantenha os seus treinamentos de segurança válidos
        </div>

        {/* Training Grid */}
        <div className="border border-slate-800 mt-1">
          {/* Header Row */}
          <div className="flex border-b border-slate-800 font-bold bg-white">
            <div className="w-1/3 p-1 border-r border-slate-800">Carta Condução</div>
            <div className="w-1/3 p-1 border-r border-slate-800 text-center">Número</div>
            <div className="w-1/3 p-1 text-center">Validade</div>
          </div>
          <div className="flex h-4 border-b border-slate-800">
             <div className="w-1/3 border-r border-slate-800"></div>
             <div className="w-1/3 border-r border-slate-800"></div>
             <div className="w-1/3"></div>
          </div>

          {/* ASO Section */}
          <div className="bg-emerald-600 text-white font-bold px-1 text-[9px]">VALIDADE ASO:</div>
          
          {/* RAC Grid */}
          <div className="grid grid-cols-2">
            {/* Left Column */}
            <div className="border-r border-slate-800">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="flex border-b border-slate-800 h-4 items-center">
                    <div className="w-16 px-1 font-bold border-r border-slate-800 bg-gray-50">RAC {String(i).padStart(2, '0')}</div>
                    <div className="flex-1 text-center font-medium">
                      {isRacForSession(i) ? safeExpiry : ''}
                    </div>
                 </div>
               ))}
            </div>
            {/* Right Column */}
            <div>
               {[6, 7, 8, 9, 10].map(i => (
                 <div key={i} className="flex border-b border-slate-800 h-4 items-center">
                    <div className="w-16 px-1 font-bold border-r border-slate-800 bg-gray-50">RAC {String(i).padStart(2, '0')}</div>
                    <div className="flex-1 text-center font-medium">
                       {isRacForSession(i) ? safeExpiry : ''}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Signatures */}
      <div className="px-2 pb-1">
         <div className="text-[8px] font-bold">EMISSÃO: <span className="font-normal">{new Date().toLocaleDateString()}</span></div>
         <div className="text-[8px] font-bold mt-1">ASSINATURA E CARIMBO:</div>
         <div className="h-6 border border-slate-400 mt-1 mb-1"></div>
         
         <div className="flex items-end justify-between relative">
             <div className="w-3/4">
                 <div className="text-[8px] font-bold">Liberado por:</div>
                 <div className="h-4 border-b border-slate-800"></div>
             </div>
             
             {/* Security Icon Placeholder */}
             <div className="absolute right-0 bottom-6 w-12 h-12">
                 <svg viewBox="0 0 100 100" className="w-full h-full text-vulcan-yellow fill-current">
                     <path d="M50 0 L100 25 V60 C100 85 50 100 50 100 C50 100 0 85 0 60 V25 Z" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-slate-900 text-center leading-none pt-2">
                     10 Regras<br/>de Ouro
                 </div>
             </div>
         </div>
      </div>

      {/* Emergency Bar */}
      <div className="h-8 bg-gradient-to-r from-emerald-600 to-emerald-500 mt-1 flex items-center justify-center text-white font-bold relative overflow-hidden">
          <div className="absolute left-2 top-1 bottom-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              📞
          </div>
          <div className="text-center">
              <div className="text-[8px] uppercase">Em caso de emergência ligue</div>
              <div className="text-[10px]">822030 / 842030</div>
          </div>
      </div>

    </div>
  );
};

export default CardTemplate;