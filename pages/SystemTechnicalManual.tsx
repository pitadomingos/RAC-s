import React from 'react';
import { 
  FileText, Shield, Database, Network, GitMerge, Lock, 
  Cpu, Zap, Printer, ArrowLeft, Layers, Globe, Server, 
  Smartphone, Code, CheckCircle, AlertTriangle, Building2,
  ListFilter, Activity, Binary, ChevronRight
} from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole } from '../types';

const SystemTechnicalManual: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Security Lock
  if (!isAuthenticated || user?.role !== UserRole.SYSTEM_ADMIN) {
      return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  const tm = t.technicalManual;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 overflow-auto">
      {/* Control Bar (Hidden on Print) */}
      <div className="no-print sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{tm.header.title}</h1>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{tm.header.confidential}</p>
          </div>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
        >
          <Printer size={18} />
          {tm.header.printBtn}
        </button>
      </div>

      {/* DOCUMENT CANVAS */}
      <div className="max-w-[210mm] mx-auto bg-white p-[20mm] shadow-2xl mt-10 mb-20 print:shadow-none print:m-0 print:p-[15mm] text-slate-800">
        
        {/* Title Header */}
        <div className="border-b-4 border-slate-900 pb-10 mb-12 flex justify-between items-end">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-slate-900 p-3 rounded-xl">
                        <Shield size={40} className="text-white" />
                    </div>
                    <span className="text-4xl font-black tracking-tighter uppercase italic">CARS <span className="text-slate-500">v2.5</span></span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 mb-2">{tm.header.specTitle}</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">{tm.header.specSubtitle}</p>
            </div>
            <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{tm.header.status}</div>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200">{tm.header.statusValue}</div>
            </div>
        </div>

        {/* Index / Table of Contents */}
        <div className="bg-slate-50 p-8 rounded-3xl mb-12 border border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">{tm.index.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm font-bold text-slate-700">
                <a href="#onboarding" className="flex justify-between items-center hover:text-indigo-600"><span>{tm.index.s1}</span> <span className="text-slate-300">01</span></a>
                <a href="#sync" className="flex justify-between items-center hover:text-indigo-600"><span>{tm.index.s2}</span> <span className="text-slate-300">02</span></a>
                <a href="#logic" className="flex justify-between items-center hover:text-indigo-600"><span>{tm.index.s3}</span> <span className="text-slate-300">03</span></a>
                <a href="#scheduling" className="flex justify-between items-center hover:text-indigo-600"><span>{tm.index.s4}</span> <span className="text-slate-300">04</span></a>
                <a href="#security" className="flex justify-between items-center hover:text-indigo-600"><span>{tm.index.s5}</span> <span className="text-slate-300">05</span></a>
                <a href="#iot" className="flex justify-between items-center hover:text-indigo-600"><span>{tm.index.s6}</span> <span className="text-slate-300">06</span></a>
            </div>
        </div>

        {/* SECTION 1: ONBOARDING */}
        <section id="onboarding" className="mb-20">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                <Building2 className="text-indigo-600" size={24} />
                {tm.onboarding.title}
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                <p>{tm.onboarding.text}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-indigo-500 mb-2 uppercase">Step 1</div>
                        <h4 className="font-bold text-slate-800 mb-1">{tm.onboarding.step1}</h4>
                        <p className="text-xs">{tm.onboarding.step1desc}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-indigo-500 mb-2 uppercase">Step 2</div>
                        <h4 className="font-bold text-slate-800 mb-1">{tm.onboarding.step2}</h4>
                        <p className="text-xs">{tm.onboarding.step2desc}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-indigo-500 mb-2 uppercase">Step 3</div>
                        <h4 className="font-bold text-slate-800 mb-1">{tm.onboarding.step3}</h4>
                        <p className="text-xs">{tm.onboarding.step3desc}</p>
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION 2: DATA SYNC */}
        <section id="sync" className="mb-20">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                <GitMerge className="text-emerald-600" size={24} />
                {tm.sync.title}
            </h2>
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white mb-8">
                <div className="flex justify-between items-center gap-8 mb-10">
                    <div className="flex-1 flex flex-col items-center gap-2 p-4 border border-white/10 rounded-2xl">
                        <Server size={32} className="text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Source A</span>
                        <span className="font-black text-xs uppercase">SuccessFactors</span>
                    </div>
                    <ChevronRight size={32} className="text-slate-700" />
                    <div className="flex-1 flex flex-col items-center gap-2 p-4 bg-indigo-600 rounded-2xl shadow-xl">
                        <Cpu size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Middleware</span>
                        <span className="font-black text-xs uppercase text-white italic underline">{tm.sync.middleware}</span>
                    </div>
                    <ChevronRight size={32} className="text-slate-700" />
                    <div className="flex-1 flex flex-col items-center gap-2 p-4 border border-white/10 rounded-2xl">
                        <Database size={32} className="text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Source B</span>
                        <span className="font-black text-xs uppercase">Célula Contrato</span>
                    </div>
                </div>
                <div className="text-center text-slate-400 text-xs font-mono leading-relaxed">
                    {tm.sync.logic}
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{tm.sync.text}</p>
        </section>

        {/* SECTION 3: COMPLIANCE LOGIC */}
        <section id="logic" className="mb-20">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                <Binary className="text-indigo-600" size={24} />
                {tm.logic.title}
            </h2>
            <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 font-mono text-sm space-y-6">
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">1</div>
                    <div className="flex-1">
                        <div className="font-black text-slate-900 mb-1">{tm.logic.step1}</div>
                        <p className="text-xs text-slate-500 italic">{tm.logic.step1desc}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">2</div>
                    <div className="flex-1">
                        <div className="font-black text-slate-900 mb-1">{tm.logic.step2}</div>
                        <p className="text-xs text-slate-500 italic">{tm.logic.step2desc}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">3</div>
                    <div className="flex-1">
                        <div className="font-black text-slate-900 mb-1">{tm.logic.step3}</div>
                        <p className="text-xs text-slate-500 italic">{tm.logic.step3desc}</p>
                    </div>
                </div>
                <div className="pt-6 border-t border-slate-200">
                    <div className="bg-emerald-600 text-white p-4 rounded-xl text-center font-black text-lg shadow-lg">
                        STATUS = GRANTED
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION 4: IOT GATEWAY */}
        <section id="iot" className="mb-20">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                <Smartphone className="text-blue-600" size={24} />
                {tm.iot.title}
            </h2>
            <div className="space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed">{tm.iot.text}</p>
                <div className="border-l-4 border-blue-500 pl-6 space-y-4 py-2">
                    <h4 className="font-black text-slate-800 text-sm">{tm.iot.handshake}:</h4>
                    <ul className="list-disc text-xs space-y-2 ml-4 text-slate-500">
                        <li>{tm.iot.p1}</li>
                        <li>{tm.iot.p2}</li>
                        <li>{tm.iot.p3}</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* SECTION 5: SCHEDULING */}
        <section id="scheduling" className="mb-20">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-3">
                <ListFilter className="text-orange-600" size={24} />
                {tm.scheduling.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{tm.scheduling.text}</p>
            <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-[10px] leading-relaxed">
                {tm.scheduling.log}
            </div>
        </section>

        {/* DOCUMENT FOOTER */}
        <footer className="mt-32 pt-10 border-t border-slate-200 flex justify-between items-end">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {tm.footer.line1}<br/>
                {tm.footer.line2}
            </div>
            <div className="flex items-center gap-3 opacity-20">
                <div className="h-10 w-px bg-slate-900"></div>
                <Shield size={32} className="text-slate-900" />
            </div>
        </footer>

      </div>

      <style>{`
        @media print {
            body { 
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .no-print { display: none !important; }
            a { text-decoration: none !important; color: inherit !important; }
            section { page-break-inside: avoid; }
            @page {
                size: A4;
                margin: 0;
            }
        }
      `}</style>
    </div>
  );
};

export default SystemTechnicalManual;