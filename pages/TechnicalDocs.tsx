
import React, { useState } from 'react';
import { FileCode, Database, Layers, Terminal, ShieldAlert, Sparkles, Copy, ListFilter } from 'lucide-react';

const TechnicalDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('schema');
  const [copied, setCopied] = useState(false);

  const sections = [
    { id: 'schema', label: 'Base Schema', icon: Database },
    { id: 'waitlist', label: 'Waitlist Table', icon: ListFilter },
    { id: 'arch', label: 'Architecture', icon: Layers },
  ];

  const sqlSchema = `-- 1. INFRASTRUCTURE & PERSONNEL
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
  location TEXT
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  record_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  department TEXT,
  role TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 2. EVALUATIONS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Pending',
  result_date DATE,
  expiry_date DATE,
  theory_score INTEGER DEFAULT 0,
  practical_score INTEGER DEFAULT 0,
  attendance BOOLEAN DEFAULT false
);`;

  const waitlistMigration = `-- CREATE DEDICATED QUEUE TABLE
CREATE TABLE waiting_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  priority_rank INTEGER DEFAULT 0,
  notes TEXT
);

-- Index for performance
CREATE INDEX idx_waitlist_session ON waiting_list(session_id);

-- Optional: Function to auto-promote (Advanced logic)
-- For now, handled via the Web App logic layer.`;

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full">
      <div className="bg-slate-900 rounded-3xl p-8 text-white border border-slate-700">
         <h2 className="text-3xl font-black flex items-center gap-3"><Terminal className="text-cyan-400" /> Database Schema</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 space-y-2">
              {sections.map(s => {
                  const Icon = s.icon;
                  return (
                      <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === s.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>
                          <Icon size={18} />{s.label}
                      </button>
                  )
              })}
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-8 overflow-y-auto shadow-xl">
              {activeSection === 'schema' && (
                  <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Base Infrastructure</h3>
                        <button onClick={() => handleCopy(sqlSchema)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                            <Copy size={14} /> {copied ? 'Copied!' : 'Copy SQL'}
                        </button>
                      </div>
                      <pre className="bg-slate-900 text-cyan-400 p-6 rounded-xl text-xs overflow-x-auto">{sqlSchema}</pre>
                  </div>
              )}
              {activeSection === 'waitlist' && (
                  <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Waiting List Table</h3>
                        <button onClick={() => handleCopy(waitlistMigration)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                            <Copy size={14} /> {copied ? 'Copied!' : 'Copy SQL'}
                        </button>
                      </div>
                      <pre className="bg-slate-900 text-indigo-400 p-6 rounded-xl text-xs overflow-x-auto">{waitlistMigration}</pre>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default TechnicalDocs;
