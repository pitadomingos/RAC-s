import React, { useState } from 'react';
import { FileCode, Database, Layers, Terminal, ShieldAlert, Sparkles, Copy } from 'lucide-react';

const TechnicalDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('schema');
  const [copied, setCopied] = useState(false);

  const sections = [
    { id: 'schema', label: 'Production Schema', icon: Database },
    { id: 'branding', label: 'Dynamic Modules', icon: Sparkles },
    { id: 'arch', label: 'Architecture', icon: Layers },
  ];

  const sqlSchema = `-- ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INFRASTRUCTURE
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  app_name TEXT,
  logo_url TEXT,
  safety_logo_url TEXT,
  status TEXT DEFAULT 'Active',
  default_language TEXT DEFAULT 'pt',
  features JSONB DEFAULT '{"alcohol": false}'
);

CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  mandatory_racs TEXT[] DEFAULT '{}'
);

-- 2. DYNAMIC MODULES (PER TENANT)
CREATE TABLE rac_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  validity_months INTEGER DEFAULT 24,
  requires_driver_license BOOLEAN DEFAULT false,
  requires_practical BOOLEAN DEFAULT true
);

-- 3. PERSONNEL
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  record_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  department TEXT,
  role TEXT,
  driver_license_number TEXT,
  driver_license_class TEXT,
  driver_license_expiry DATE,
  is_active BOOLEAN DEFAULT true
);

-- 4. EVALUATIONS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Pending',
  result_date DATE,
  expiry_date DATE,
  theory_score INTEGER,
  practical_score INTEGER,
  attendance BOOLEAN DEFAULT false
);

CREATE TABLE employee_requirements (
  employee_id UUID PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  aso_expiry_date DATE,
  required_racs JSONB DEFAULT '{}'
);

-- 5. IDENTITY & AUDIT
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  company TEXT,
  job_title TEXT,
  site_id TEXT
);

CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  level TEXT NOT NULL,
  message_key TEXT NOT NULL,
  user_name TEXT,
  metadata JSONB DEFAULT '{}'
);`;

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm"><Terminal size={28} className="text-cyan-400" /></div>
                  <h2 className="text-3xl font-black tracking-tight text-white">Production Blueprint</h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl font-medium">Dynamic Relational Mapping for Multi-Tenant Safety Systems.</p>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          <div className="lg:w-64 space-y-2 shrink-0">
              {sections.map(s => {
                  const Icon = s.icon;
                  return (
                      <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === s.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                          <Icon size={18} className={activeSection === s.id ? 'text-cyan-400' : 'text-slate-400'} />{s.label}
                      </button>
                  )
              })}
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 overflow-y-auto">
              {activeSection === 'schema' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 flex justify-between items-end">
                          <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Multi-Tenant Schema</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Optimized for dynamic module handles and site-level isolation.</p>
                          </div>
                          <button onClick={() => handleCopy(sqlSchema)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-slate-800">
                              <Copy size={14} /> {copied ? 'Copied!' : 'Copy SQL'}
                          </button>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-4">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 overflow-x-auto"><pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre">{sqlSchema.trim()}</pre></div>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default TechnicalDocs;