
import React, { useState } from 'react';
import { 
  FileCode, Database, Layers, Code, Terminal, AlertTriangle, 
  Cpu, GitBranch, Shield, Key, FolderOpen, ChevronRight, FileText,
  Rocket, CloudLightning, Wifi, Smartphone, Lock, Server, Radio,
  Globe, CreditCard, LayoutTemplate
} from 'lucide-react';

const TechnicalDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('arch');

  const sections = [
    { id: 'arch', label: 'Architecture (Current)', icon: Layers },
    { id: 'files', label: 'File Structure', icon: FolderOpen },
    { id: 'data', label: 'Data Models', icon: Database },
    { id: 'roadmap', label: 'Future Roadmap', icon: Rocket }, 
    { id: 'state', label: 'State & Logic', icon: Cpu },
    { id: 'debug', label: 'Debugging', icon: Terminal },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up h-full">
      {/* --- HERO HEADER --- */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
         <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none">
            <FileCode size={400} />
         </div>
         {/* Ambient Glow */}
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
                    <Terminal size={28} className="text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                      System Documentation
                  </h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">
                  Developer guide for maintaining, debugging, and extending the CARS Manager.
               </p>
            </div>
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-cyan-400">
                Authorized Access: SYSTEM_ADMIN
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          {/* Sidebar Nav */}
          <div className="lg:w-64 space-y-2">
              {sections.map(s => {
                  const Icon = s.icon;
                  return (
                      <button 
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeSection === s.id 
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                            : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                          <Icon size={18} className={activeSection === s.id ? 'text-cyan-400' : 'text-slate-400'} />
                          {s.label}
                      </button>
                  )
              })}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 overflow-y-auto">
              
              {/* SECTION: ARCHITECTURE */}
              {activeSection === 'arch' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Architecture Overview</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">React 18 • Vite • TypeScript • Tailwind CSS</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
                                  <Database size={18} className="text-blue-500"/> Multi-Tenant State
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                  The application uses a hierarchical data structure to support Multi-Tenancy.
                                  <br/><br/>
                                  <strong>Hierarchy:</strong> Company &gt; Site &gt; Employee.
                                  <br/>
                                  Data isolation is handled via `siteId` filtering in the `App.tsx` state selector logic.
                              </p>
                          </div>

                          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
                                  <Key size={18} className="text-yellow-500"/> Role Hierarchy & Billing
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                  <strong>Organogram:</strong>
                                  <ul className="list-disc ml-4 mt-2 space-y-1 text-xs">
                                      <li><strong>System Admin</strong> (SaaS Owner)</li>
                                      <li><strong>Enterprise Admin</strong> (Client HQ)</li>
                                      <li><strong>Site Admin</strong> (Location Manager)</li>
                                      <li><strong>Operational Admins</strong> (RAC Admin, Dept Admin, Trainer)</li>
                                      <li><strong>General User</strong> (Billable End-User)</li>
                                  </ul>
                                  <br/>
                                  <strong>Billing Model:</strong> Charges apply ONLY to <code>General User</code> role at $2/month. All admin tiers are free management seats.
                              </p>
                          </div>
                      </div>
                  </div>
              )}

              {/* SECTION: FILE STRUCTURE */}
              {activeSection === 'files' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">File Structure & Purpose</h3>
                      </div>

                      <div className="space-y-4">
                          <FileEntry 
                            name="App.tsx" 
                            desc="The root component. Contains the 'Mock Database' (state), Route definitions, and RBAC redirects. Acts as the controller." 
                            important 
                          />
                          <FileEntry 
                            name="types.ts" 
                            desc="TypeScript definitions. Defines the shape of Booking, Employee, User, and RAC enums. ALWAYS update this when changing data structures." 
                            important
                          />
                          <FileEntry 
                            name="constants.ts" 
                            desc="Static configuration. Companies list, Department list, Mock Data seed, and RAC Definitions." 
                          />
                          <FileEntry 
                            name="pages/Dashboard.tsx" 
                            desc="Main view. Contains logic for KPI calculations, 'Upcoming Sessions' table, and 'Employees Booked' table." 
                          />
                          <FileEntry 
                            name="pages/DatabasePage.tsx" 
                            desc="The Master Matrix. Calculates compliance (Grant/Block) based on ASO + RAC requirements. Handles CSV Import." 
                          />
                          <FileEntry 
                            name="pages/EnterpriseDashboard.tsx" 
                            desc="Corporate-level aggregations. Displays performance metrics across multiple sites." 
                          />
                          <FileEntry 
                            name="pages/SiteGovernancePage.tsx" 
                            desc="Policy Engine. Allows Enterprise Admins to define mandatory RACs for specific sites." 
                          />
                          <FileEntry 
                            name="components/CardTemplate.tsx" 
                            desc="The visual representation of the ID Card. Contains the printable layout and logic to display the *latest* valid date for each RAC." 
                          />
                      </div>
                  </div>
              )}

              {/* SECTION: DATA MODELS */}
              {activeSection === 'data' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Core Data Models</h3>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                          <CodeBlock title="Multi-Tenancy Models" code={`
interface Company {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

interface Site {
  id: string;
  companyId: string;
  name: string;
  location: string;
  mandatoryRacs?: string[]; // Policy Engine
}
                          `} />

                          <CodeBlock title="Booking Interface (The core record)" code={`
interface Booking {
  id: string;           // UUID
  sessionId: string;    // Links to TrainingSession OR a raw string for legacy imports
  employee: Employee;   // Embedded employee snapshot (denormalized for simplicity)
  status: 'Pending' | 'Passed' | 'Failed';
  resultDate?: string;  // Date of completion
  expiryDate?: string;  // Valid for 2 years from resultDate
  attendance?: boolean; 
  theoryScore?: number;
  practicalScore?: number;
}
                          `} />

                          <CodeBlock title="EmployeeRequirement (The rules engine)" code={`
interface EmployeeRequirement {
  employeeId: string;
  asoExpiryDate: string; // The Medical Certificate expiry
  requiredRacs: Record<string, boolean>; // Matrix: { 'RAC01': true, 'RAC02': false }
}
// Used in DatabasePage to calculate "Access Status".
// If requiredRacs['RAC01'] is true, the system looks for a valid Booking with RAC01 code.
                          `} />
                      </div>
                  </div>
              )}

              {/* SECTION: FUTURE ROADMAP (NEW) */}
              {activeSection === 'roadmap' && (
                  <div className="space-y-10 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3">
                              <Rocket className="text-orange-500" />
                              Production Architecture Roadmap
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                              Migration plan from React State to Enterprise Cloud Ecosystem, SaaS Transformation, and IoT.
                          </p>
                      </div>

                      {/* 1. Cloud Database Migration */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                              <Database className="text-yellow-500" /> 
                              1. Cloud Database Migration (Multi-Provider)
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                              Transitioning from in-memory state to a persistent cloud database. The architecture will support various providers to prevent vendor lock-in.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                  <span className="font-bold text-sm block mb-1">Option A: NoSQL (Real-time)</span>
                                  <p className="text-xs text-slate-500">Firebase Realtime DB or Firestore. Best for live updates and chat features.</p>
                              </div>
                              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                  <span className="font-bold text-sm block mb-1">Option B: SQL (Relational)</span>
                                  <p className="text-xs text-slate-500">PostgreSQL (via Supabase, Google Cloud SQL, or Azure SQL). Best for complex reporting and SaaS structure.</p>
                              </div>
                          </div>
                      </div>

                      {/* 2. Cloud Hosting */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                              <CloudLightning className="text-blue-500" /> 
                              2. Cloud Hosting & Infrastructure
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                              The application is Docker-ready and can be deployed to any major cloud provider.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-bold">Google Cloud Run</span>
                              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-bold">Azure App Service</span>
                              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-bold">AWS Amplify</span>
                              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-bold">Vercel / Netlify</span>
                          </div>
                      </div>

                      {/* 3. SaaS Transformation */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                          <h4 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                              <Globe className="text-indigo-500" /> 
                              3. SaaS Transformation Strategy
                          </h4>
                          <p className="text-sm text-indigo-800 dark:text-indigo-300 mb-6">
                              Roadmap to convert the internal Vulcan tool into a public-facing B2B SaaS platform ("SafetyOS").
                          </p>
                          
                          <div className="space-y-4">
                              <div className="flex gap-4">
                                  <div className="mt-1"><LayoutTemplate size={20} className="text-indigo-500"/></div>
                                  <div>
                                      <h5 className="font-bold text-sm text-indigo-900 dark:text-white">Phase 1: Public Landing Page</h5>
                                      <p className="text-xs text-indigo-700 dark:text-indigo-300">Develop a marketing frontend (Next.js/Astro) showcasing features, pricing tiers, and case studies.</p>
                                  </div>
                              </div>
                              <div className="flex gap-4">
                                  <div className="mt-1"><Server size={20} className="text-indigo-500"/></div>
                                  <div>
                                      <h5 className="font-bold text-sm text-indigo-900 dark:text-white">Phase 2: Multi-Tenancy Architecture</h5>
                                      <p className="text-xs text-indigo-700 dark:text-indigo-300">Update database schema to segregate data by <code>organizationId</code>. Ensure strict data isolation between clients (e.g., Vulcan Mining vs. Global Logistics).</p>
                                  </div>
                              </div>
                              <div className="flex gap-4">
                                  <div className="mt-1"><CreditCard size={20} className="text-indigo-500"/></div>
                                  <div>
                                      <h5 className="font-bold text-sm text-indigo-900 dark:text-white">Phase 3: Subscription Billing</h5>
                                      <p className="text-xs text-indigo-700 dark:text-indigo-300">Integrate Stripe or LemonSqueezy for recurring billing. Implement plan limits (e.g., "Basic: 50 Users", "Pro: Unlimited").</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 4. IoT Integration */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                              <Wifi className="text-green-500" /> 
                              4. IoT Alcohol Control Architecture
                          </h4>
                          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-center w-full md:w-1/4">
                                  <Server className="mx-auto mb-2 text-slate-400"/>
                                  <span className="font-bold text-xs">Breathalyzer Device</span>
                                  <div className="text-[10px] text-slate-500">ESP32 / Industrial PLC</div>
                              </div>
                              <div className="hidden md:block text-slate-400">→ (MQTT/HTTP) →</div>
                              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-center w-full md:w-1/4">
                                  <CloudLightning className="mx-auto mb-2 text-yellow-500"/>
                                  <span className="font-bold text-xs">Cloud Function</span>
                                  <div className="text-[10px] text-slate-500">Node.js Listener</div>
                              </div>
                              <div className="hidden md:block text-slate-400">→ (Write) →</div>
                              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-center w-full md:w-1/4">
                                  <Database className="mx-auto mb-2 text-blue-500"/>
                                  <span className="font-bold text-xs">Real-time DB</span>
                                  <div className="text-[10px] text-slate-500">/access_logs</div>
                              </div>
                          </div>
                          <CodeBlock title="IoT Payload Example (Device -> Cloud)" code={`
{
  "deviceId": "GATE_MAIN_01",
  "employeeRecordId": "VUL-8852",
  "alcoholLevel": 0.00, 
  "timestamp": 1715602000,
  "faceMatchConfidence": 98.5
}
// If alcoholLevel > 0.00, Cloud Function immediately sets /employees/{id}/accessStatus = "Blocked"
                          `} />
                      </div>

                      {/* 5. SMS Notifications */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                              <Smartphone className="text-purple-500" /> 
                              5. Automated SMS Notifications
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                              Serverless Cloud Functions will trigger SMS alerts via gateway (Twilio or Local Gateway API).
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
                                  <h5 className="font-bold text-purple-800 dark:text-purple-300 text-sm mb-2">Trigger 1: Booking Confirmation</h5>
                                  <p className="text-xs text-purple-700 dark:text-purple-400">
                                      Event: <code>{"database.ref('/bookings/{id}').onCreate"}</code><br/>
                                      Action: Send "You are booked for RAC01 on [Date] at [Room]."
                                  </p>
                              </div>
                              <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                                  <h5 className="font-bold text-red-800 dark:text-red-300 text-sm mb-2">Trigger 2: Expiry Warning</h5>
                                  <p className="text-xs text-red-700 dark:text-red-400">
                                      Event: <code>Scheduled Cron Job (Daily 08:00)</code><br/>
                                      Action: Query DB for expiry &lt; 30 days. Send "Your RAC01 expires in 30 days. Contact Admin."
                                  </p>
                              </div>
                          </div>
                      </div>

                  </div>
              )}

              {/* SECTION: STATE & LOGIC */}
              {activeSection === 'state' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Complex Logic Flows</h3>
                      </div>

                      <div className="space-y-6">
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl">
                              <h4 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> RAC 02 Driver License Logic</h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                  In <code>TrainerInputPage.tsx</code> and <code>BookingForm.tsx</code>, special logic exists for "RAC02".
                                  <br/>
                                  1. <strong>Booking</strong>: Requires entering DL Number, Class, and Expiry.
                                  <br/>
                                  2. <strong>Grading</strong>: Trainer MUST check "DL Verified". If unchecked, status defaults to Failed regardless of score.
                                  <br/>
                                  3. <strong>Database</strong>: Access is blocked if <code>driverLicenseExpiry</code> is past today.
                              </p>
                          </div>

                          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-900/30 rounded-xl">
                              <h4 className="font-bold text-indigo-800 dark:text-indigo-400 mb-2 flex items-center gap-2"><GitBranch size={18}/> Session ID vs RAC Type</h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                  A <code>Booking</code> links to a <code>sessionId</code>. 
                                  <br/>
                                  However, sometimes we import CSVs where no session exists. In these cases, the <code>sessionId</code> field stores the Raw RAC Code (e.g., "RAC01").
                                  <br/>
                                  <strong>Logic in ReportsPage/ResultsPage:</strong>
                                  <pre className="mt-2 bg-black/10 p-2 rounded text-xs">
{`const session = sessions.find(s => s.id === b.sessionId);
// If session found -> use session.racType
// If not found -> use b.sessionId (Legacy/Imported mode)`}
                                  </pre>
                              </p>
                          </div>
                      </div>
                  </div>
              )}

              {/* SECTION: DEBUGGING */}
              {activeSection === 'debug' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Debugging Guide</h3>
                      </div>

                      <div className="space-y-4">
                          <DebugTip 
                            title="Cards Not Showing?" 
                            desc="The RequestCardsPage only shows employees who are 100% compliant. Check: 1) ASO Date > Today. 2) All Required RACs have a PASSED booking with Expiry > Today. 3) If RAC02 is required, DL Expiry > Today."
                          />
                          <DebugTip 
                            title="Search Not Working?" 
                            desc="Ensure you are searching by the exact Record ID format used in the CSV. Some legacy data might have spaces. The filter usually performs a .toLowerCase() comparison."
                          />
                          <DebugTip 
                            title="Notifications Duplication?" 
                            desc="Demand Analytics in App.tsx runs on every render/update of bookings. Ensure strict equality checks are used before adding a new notification to the state array."
                          />
                          <DebugTip 
                            title="'Restricted Access' on Pages?" 
                            desc="Check the <Routes> definitions in App.tsx. If userRole is set to 'User', they are redirected from /dashboard, /database, etc. Ensure the simulation dropdown in the Sidebar is set correctly."
                          />
                      </div>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};

// Sub-components for styling
const FileEntry = ({ name, desc, important = false }: { name: string, desc: string, important?: boolean }) => (
    <div className={`p-4 rounded-lg border flex items-start gap-4 ${important ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-slate-50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-700'}`}>
        <FileText size={20} className={important ? 'text-blue-600 dark:text-blue-400 mt-1' : 'text-slate-400 mt-1'} />
        <div>
            <span className={`font-mono text-sm font-bold block mb-1 ${important ? 'text-blue-800 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{name}</span>
            <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
        </div>
    </div>
);

const CodeBlock = ({ title, code }: { title: string, code: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
            {title}
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-slate-700 dark:text-slate-300">{code.trim()}</pre>
        </div>
    </div>
);

const DebugTip = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
        <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg h-fit text-rose-600 dark:text-rose-400">
            <Shield size={18} />
        </div>
        <div>
            <h5 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{title}</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default TechnicalDocs;
