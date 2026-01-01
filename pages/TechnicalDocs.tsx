import React, { useState } from 'react';
import { 
  FileCode, Database, Layers, Code, Terminal, AlertTriangle, 
  Cpu, GitBranch, Shield, Key, FolderOpen, ChevronRight, FileText,
  Rocket, CloudLightning, Wifi, Smartphone, Lock, Server, Radio,
  Globe, CreditCard, LayoutTemplate, GitMerge, RefreshCw, Bot, Zap, Activity, Sparkles
} from 'lucide-react';

const TechnicalDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('arch');

  const sections = [
    { id: 'arch', label: 'Architecture', icon: Layers },
    { id: 'branding', label: 'Dynamic Branding', icon: Sparkles },
    { id: 'translation', label: 'Resilient Translation', icon: Globe },
    { id: 'robotics', label: 'Robotics & AI', icon: Bot },
    { id: 'roadmap', label: 'Future Roadmap', icon: Rocket },
    { id: 'debug', label: 'Debugging', icon: Terminal },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
         <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none"><FileCode size={400} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm"><Terminal size={28} className="text-cyan-400" /></div>
                  <h2 className="text-3xl font-black tracking-tight text-white">System Documentation</h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">Developer guide for maintaining and extending the CARS Manager.</p>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          <div className="lg:w-64 space-y-2">
              {sections.map(s => {
                  const Icon = s.icon;
                  return (
                      <button 
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeSection === s.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                          <Icon size={18} className={activeSection === s.id ? 'text-cyan-400' : 'text-slate-400'} />
                          {s.label}
                      </button>
                  )
              })}
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 overflow-y-auto">
              
              {activeSection === 'branding' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Dynamic Branding Engine</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Tenant-specific UI personalization via Company Overrides.</p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                          Enterprise Admins can override core system branding (Name and Safety Logo) without affecting global system code. 
                          These overrides are stored in the <code>Company</code> object and consumed by the <code>Layout.tsx</code> component.
                      </p>
                      <CodeBlock title="Layout Branding Logic" code={`
// Inside Layout.tsx
const currentCompany = companies.find(c => c.id === 'c1');
const dynamicAppName = currentCompany?.appName || t.common.vulcan;
const safetyLogo = currentCompany?.safetyLogoUrl || defaultIcon;
                      `} />
                  </div>
              )}

              {activeSection === 'translation' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Resilient Translation Layer</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Strict template-matching to prevent undefined property crashes.</p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                          To prevent "crushing" errors when keys are missing in Portuguese, the <code>LanguageContext</code> now uses a 
                          Defensive Deep Merge. It iterates through English (the source of truth) and only overlays Portuguese strings where they exist.
                      </p>
                      <CodeBlock title="Resilient Deep Merge" code={`
const deepMerge = (target, source) => {
  const output = { ...target };
  Object.keys(target).forEach(key => {
    if (isObject(target[key])) {
      output[key] = deepMerge(target[key], source[key] || {});
    } else {
      output[key] = source[key] ?? target[key];
    }
  });
  return output;
};
                      `} />
                  </div>
              )}

              {activeSection === 'arch' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Architecture Overview</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">React 18 • Vite • TypeScript • Tailwind CSS</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200">
                              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3"><Database size={18} className="text-blue-500"/> Multi-Tenant State</h4>
                              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">Hierarchy: Company > Site > Employee. Data isolation handled via siteId filtering.</p>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

const CodeBlock = ({ title, code }: { title: string, code: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-4">
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-500">{title}</div>
        <div className="bg-slate-50 dark:bg-slate-900 p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-slate-700 dark:text-slate-300">{code.trim()}</pre>
        </div>
    </div>
);

export default TechnicalDocs;