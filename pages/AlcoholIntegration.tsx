
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Wine, Zap, Lock, Activity, Thermometer, 
  Bluetooth, Smartphone, ShieldCheck, AlertOctagon,
  AlertTriangle, HardHat, ServerOff, ScanFace,
  Wifi, Database, UserX, Clock, UserMinus, RotateCcw
} from 'lucide-react';

const AlcoholIntegration: React.FC = () => {
  const { t } = useLanguage();

  if (!t || !t.alcohol) {
    return <div className="p-6">Loading translations...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Wine className="text-orange-500" size={24} />
          {t.alcohol.title}
        </h2>
        <p className="text-sm text-gray-500">{t.alcohol.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-12 text-center relative overflow-hidden">
           {/* Background Decorative Icons */}
           <Activity className="absolute left-10 top-10 text-white/5" size={120} />
           <Lock className="absolute right-10 bottom-0 text-white/5" size={120} />

           <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/20">
                 <Zap size={48} className="text-yellow-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight uppercase">
                {t.alcohol.banner.title}
              </h1>
              <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
                {t.alcohol.banner.desc}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full text-sm font-bold border border-yellow-500/50 text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                {t.alcohol.banner.status}
              </div>
           </div>
        </div>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
            
            {/* System Vision / Features Section (The "Old Text" Restored) */}
            <div>
               <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Activity size={24} className="text-blue-500" />
                  {t.alcohol.features.title}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature 1: IoT */}
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl hover:shadow-md transition-shadow">
                     <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <Wifi size={24} />
                     </div>
                     <h4 className="font-bold text-slate-800 mb-2">{t.alcohol.features.iotTitle}</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">{t.alcohol.features.iotDesc}</p>
                  </div>

                  {/* Feature 2: Automated Lockout */}
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl hover:shadow-md transition-shadow">
                     <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center text-red-600 mb-4">
                        <UserX size={24} />
                     </div>
                     <h4 className="font-bold text-slate-800 mb-2">{t.alcohol.features.accessTitle}</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">{t.alcohol.features.accessDesc}</p>
                  </div>

                   {/* Feature 3: Reporting */}
                   <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl hover:shadow-md transition-shadow">
                     <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
                        <Database size={24} />
                     </div>
                     <h4 className="font-bold text-slate-800 mb-2">{t.alcohol.features.complianceTitle}</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">{t.alcohol.features.complianceDesc}</p>
                  </div>
               </div>
            </div>

            {/* NEW SECTION: Business Logic / Protocol */}
            <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10">
                    <Clock size={200} />
                </div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                    <RotateCcw className="text-yellow-400" />
                    {t.alcohol.protocol.title}
                </h3>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    {/* Step 1 */}
                    <div className="flex-1 bg-slate-800/50 p-6 rounded-lg border border-slate-700 w-full">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="bg-red-600 p-2 rounded-lg"><UserMinus size={24} /></div>
                            <h4 className="font-bold text-lg text-red-400">{t.alcohol.protocol.positiveTitle}</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {t.alcohol.protocol.positiveDesc}
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <RotateCcw className="text-slate-600" size={32} />
                    </div>

                    {/* Step 2 */}
                    <div className="flex-1 bg-slate-800/50 p-6 rounded-lg border border-slate-700 w-full">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="bg-green-600 p-2 rounded-lg"><Clock size={24} /></div>
                            <h4 className="font-bold text-lg text-green-400">{t.alcohol.protocol.resetTitle}</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {t.alcohol.protocol.resetDesc}
                        </p>
                    </div>
                </div>
            </div>


            {/* Warning Section - Current Challenges */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle size={28} className="text-orange-600" />
                    <h3 className="text-xl font-bold text-slate-800">{t.alcohol.challenges.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-3">
                        <ServerOff className="text-orange-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-bold text-slate-800 text-sm">OEM Cloud Issue</p>
                            <p className="text-sm text-gray-700 leading-relaxed mt-1">{t.alcohol.challenges.oemIssue}</p>
                        </div>
                    </div>
                     <div className="flex gap-3">
                        <AlertOctagon className="text-orange-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Gate Workflow</p>
                            <p className="text-sm text-gray-700 leading-relaxed mt-1">{t.alcohol.challenges.gateSetup}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Proposal Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">{t.alcohol.proposal.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                        <ScanFace size={32} className="text-blue-600 mb-3" />
                        <p className="font-bold text-slate-700 text-sm">Face Capture</p>
                        <p className="text-xs text-gray-500 mt-2">{t.alcohol.proposal.faceCap}</p>
                     </div>
                     <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                        <Bluetooth size={32} className="text-blue-600 mb-3" />
                        <p className="font-bold text-slate-700 text-sm">Direct API</p>
                        <p className="text-xs text-gray-500 mt-2">{t.alcohol.proposal.integration}</p>
                     </div>
                     <div className="bg-slate-800 p-5 rounded-lg shadow-sm text-white">
                        <HardHat size={32} className="text-yellow-400 mb-3" />
                        <p className="font-bold text-white text-sm">Civil & Electrical</p>
                        <p className="text-xs text-gray-300 mt-2">{t.alcohol.proposal.projectScope}</p>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AlcoholIntegration;
