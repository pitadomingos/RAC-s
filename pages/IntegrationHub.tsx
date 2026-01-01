
import React, { useState, useMemo } from 'react';
import { 
    GitMerge, Database, FileSpreadsheet, Globe, ChevronRight, 
    CheckCircle2, AlertCircle, RefreshCw, Plus, X, Trash2,
    Settings, ArrowRight, Zap, Layers, Server, Terminal,
    Upload, Link as LinkIcon, Key, Info, Activity, AlertTriangle,
    History, Calendar, CheckSquare
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ConnectorType, DataConnector, SyncResult, UserRole } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface IntegrationHubProps {
    userRole: UserRole;
}

const IntegrationHub: React.FC<IntegrationHubProps> = ({ userRole }) => {
    const { t } = useLanguage();
    const [activeView, setActiveView] = useState<'Connectors' | 'Conflicts'>('Connectors');
    
    // --- STATE MANAGEMENT ---
    const [connectors, setConnectors] = useState<DataConnector[]>([
        { 
            id: 'c1', name: 'Corporate SAP HR', type: 'API', status: 'Healthy', lastSync: '2024-05-20 02:00',
            config: { url: 'https://sap.corporate.com/api/v2' },
            mapping: { 'name': 'FULL_NAME', 'recordId': 'EMP_UID', 'department': 'AREA_CODE' }
        },
        { 
            id: 'c2', name: 'Contractor Excel Share', type: 'Excel', status: 'Idle', lastSync: '2024-05-19 14:30',
            config: { filePath: '//VULCAN-FS/HSE/Contractors.xlsx' },
            mapping: { 'name': 'Name', 'recordId': 'ID', 'company': 'Partner' }
        }
    ]);

    const [syncHistory, setSyncHistory] = useState<SyncResult[]>([
        { id: 's1', connectorId: 'c1', timestamp: '2024-05-20 02:00', added: 12, updated: 45, errors: 0, status: 'Success', log: ['Connected', 'Fetched 57 records', 'Sync complete'] },
        { id: 's2', connectorId: 'c2', timestamp: '2024-05-19 14:30', added: 2, updated: 10, errors: 1, status: 'Partial', log: ['File opened', 'Row 45 invalid format', 'Mapped 12 records'] }
    ]);

    const [conflicts, setConflicts] = useState([
        { 
            id: 'con1', 
            employeeId: 'VUL-998', 
            name: 'Paulo Manjate',
            field: 'Status',
            sourceA: { name: 'SAP HR', value: 'Active' },
            sourceB: { name: 'Contractor DB', value: 'Inactive' }
        },
        { 
            id: 'con2', 
            employeeId: 'VUL-442', 
            name: 'Maria Silva',
            field: 'Department',
            sourceA: { name: 'SAP HR', value: 'HSE' },
            sourceB: { name: 'Contractor DB', value: 'Mine Ops' }
        }
    ]);

    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [isSyncing, setIsSyncing] = useState<string | null>(null);

    // Wizard Form State
    const [newConnector, setNewConnector] = useState<Partial<DataConnector>>({
        name: '',
        type: 'Excel',
        config: {},
        mapping: {}
    });

    const [sampleHeaders] = useState(['EMPLOYEE_ID', 'GIVEN_NAME', 'SURNAME', 'DEPARTMENT', 'ORG_UNIT', 'JOIN_DATE', 'PHONE_OFFICE']);

    const systemFields = [
        { id: 'recordId', label: 'Record ID / Matricula', required: true },
        { id: 'name', label: 'Full Name', required: true },
        { id: 'company', label: 'Company Name', required: false },
        { id: 'department', label: 'Department', required: false },
        { id: 'role', label: 'Job Title / Role', required: false },
        { id: 'phone', label: 'Phone Number', required: false }
    ];

    // --- ACTIONS ---

    const handleSync = (id: string) => {
        setIsSyncing(id);
        const connector = connectors.find(c => c.id === id);
        
        setTimeout(() => {
            const timestamp = new Date().toLocaleString();
            const addedCount = Math.floor(Math.random() * 5);
            const updatedCount = Math.floor(Math.random() * 20) + 10;
            
            // Update Connector Status
            setConnectors(prev => prev.map(c => 
                c.id === id ? { ...c, status: 'Healthy', lastSync: timestamp } : c
            ));

            // Append to History
            const newSyncResult: SyncResult = {
                id: uuidv4(),
                connectorId: id,
                timestamp: timestamp,
                added: addedCount,
                updated: updatedCount,
                errors: 0,
                status: 'Success',
                log: [`Heartbeat from ${connector?.name}`, `Identified ${addedCount + updatedCount} changes`, 'Write-back successful']
            };
            setSyncHistory(prev => [newSyncResult, ...prev]);
            
            setIsSyncing(null);
        }, 2000);
    };

    const handleResolveConflict = (conflictId: string, chosenValue: string) => {
        // In a real app, this would perform an API update to the master database.
        // For GUI feedback, we remove it from the list with an animation.
        setConflicts(prev => prev.filter(c => c.id !== conflictId));
        console.log(`Resolved conflict ${conflictId} with value: ${chosenValue}`);
    };

    const handleSkipConflict = (conflictId: string) => {
        setConflicts(prev => prev.filter(c => c.id !== conflictId));
    };

    const handleCreateConnector = () => {
        if (!newConnector.name) {
            alert("Please enter a name for the connector.");
            return;
        }

        const connector: DataConnector = {
            id: uuidv4(),
            name: newConnector.name,
            type: newConnector.type || 'Excel',
            status: 'Idle',
            config: newConnector.config || {},
            mapping: newConnector.mapping || {}
        };
        
        setConnectors(prev => [...prev, connector]);
        setIsWizardOpen(false);
        setWizardStep(1);
        setNewConnector({ name: '', type: 'Excel', config: {}, mapping: {} });
    };

    const handleDeleteConnector = (id: string) => {
        if (confirm("Remove this connector? This will stop automated syncs from this source.")) {
            setConnectors(prev => prev.filter(c => c.id !== id));
            setSyncHistory(prev => prev.filter(s => s.connectorId !== id));
        }
    };

    return (
        <div className="space-y-6 pb-24 animate-fade-in-up">
            
            {/* --- HERO HEADER --- */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
                <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none">
                    <GitMerge size={400} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 backdrop-blur-sm">
                                <LinkIcon size={28} className="text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">{t.integrationHub.title}</h2>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xl font-medium">
                            {t.integrationHub.subtitle}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setActiveView(activeView === 'Connectors' ? 'Conflicts' : 'Connectors')}
                            className={`px-6 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center gap-3 ${activeView === 'Conflicts' ? 'bg-orange-600 text-white shadow-orange-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}
                        >
                            {activeView === 'Conflicts' ? <Activity size={20} /> : <AlertTriangle size={20} />}
                            <span>{activeView === 'Conflicts' ? 'Active Sources' : t.integrationHub.conflicts.title}</span>
                            {activeView === 'Connectors' && conflicts.length > 0 && (
                                <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">{conflicts.length}</span>
                            )}
                        </button>
                        <button 
                            onClick={() => setIsWizardOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-1 flex items-center gap-3"
                        >
                            <Plus size={20} />
                            <span>{t.integrationHub.newConnector}</span>
                        </button>
                    </div>
                </div>
            </div>

            {activeView === 'Connectors' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- CONNECTORS LIST --- */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                            <Activity size={14} /> {t.integrationHub.activeConnectors}
                        </h3>
                        
                        <div className="grid gap-4">
                            {connectors.length === 0 ? (
                                <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-400">
                                    <Database size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No external sources connected. Click "New Connector" to begin.</p>
                                </div>
                            ) : (
                                connectors.map(c => (
                                    <div key={c.id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center group hover:shadow-lg transition-all">
                                        <div className="flex gap-4 items-center mb-4 md:mb-0">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                                                c.type === 'Excel' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' :
                                                c.type === 'Database' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                                                'bg-purple-50 text-purple-600 dark:bg-purple-900/20'
                                            }`}>
                                                {c.type === 'Excel' ? <FileSpreadsheet size={24} /> :
                                                c.type === 'Database' ? <Database size={24} /> :
                                                <Server size={24} />}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{c.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                                        c.status === 'Healthy' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                                        c.status === 'Idle' ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/40'
                                                    }`}>
                                                        {t.integrationHub[c.status.toLowerCase() as keyof typeof t.integrationHub] || c.status}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{t.integrationHub.lastSync}: {c.lastSync || 'Never'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            <button 
                                                onClick={() => handleSync(c.id)}
                                                disabled={isSyncing === c.id}
                                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                                                    isSyncing === c.id 
                                                    ? 'bg-slate-100 text-slate-400 cursor-wait' 
                                                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40'
                                                }`}
                                            >
                                                <RefreshCw size={16} className={isSyncing === c.id ? 'animate-spin' : ''} />
                                                <span>{isSyncing === c.id ? 'Syncing...' : t.integrationHub.syncNow}</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteConnector(c.id)}
                                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* --- SYNC LOGS PANEL --- */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                            <Terminal size={14} /> {t.integrationHub.syncHistory}
                        </h3>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-[500px] overflow-y-auto">
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {syncHistory.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400 italic text-sm">No history yet.</div>
                                ) : (
                                    syncHistory.map(sync => (
                                        <div key={sync.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors animate-fade-in-down">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-mono text-slate-400 uppercase">{sync.timestamp}</span>
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                                                    sync.status === 'Success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                                                }`}>{sync.status}</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-center">
                                                    <div className="text-xs font-black text-green-500">+{sync.added}</div>
                                                    <div className="text-[8px] text-slate-400 font-bold uppercase">New</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs font-black text-blue-500">{sync.updated}</div>
                                                    <div className="text-[8px] text-slate-400 font-bold uppercase">Updated</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs font-black text-red-500">{sync.errors}</div>
                                                    <div className="text-[8px] text-slate-400 font-bold uppercase">Errors</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- CONFLICT RESOLUTION CENTER --- */
                <div className="animate-fade-in space-y-6">
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 p-6 rounded-[2rem] flex items-center gap-4">
                        <AlertTriangle size={32} className="text-orange-500" />
                        <div>
                            <h3 className="text-lg font-black text-orange-900 dark:text-orange-200">{t.integrationHub.conflicts.title}</h3>
                            <p className="text-sm text-orange-800/70 dark:text-orange-300/70">{t.integrationHub.conflicts.desc}</p>
                        </div>
                    </div>

                    {conflicts.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
                            <CheckSquare size={48} className="mx-auto text-green-500 mb-4" />
                            <h4 className="text-xl font-black text-slate-900 dark:text-white">All Clear</h4>
                            <p className="text-slate-500 mt-2">No data conflicts identified across sources.</p>
                            <button onClick={() => setActiveView('Connectors')} className="mt-6 text-indigo-600 font-bold hover:underline">Back to Connectors</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {conflicts.map(conflict => (
                                <div key={conflict.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 relative group overflow-hidden animate-fade-in-up">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform"><AlertTriangle size={80}/></div>
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{conflict.name}</h4>
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{conflict.employeeId}</span>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-wider border dark:border-slate-600">
                                            Field: {conflict.field}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button 
                                            onClick={() => handleResolveConflict(conflict.id, conflict.sourceA.value)}
                                            className="flex flex-col items-center p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all text-center group/btn"
                                        >
                                            <span className="text-[10px] font-black text-slate-400 uppercase mb-2">{conflict.sourceA.name}</span>
                                            <span className="text-lg font-bold text-slate-800 dark:text-white group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400">{conflict.sourceA.value}</span>
                                            <span className="mt-3 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                                {t.integrationHub.conflicts.keepSource}
                                            </span>
                                        </button>
                                        <button 
                                            onClick={() => handleResolveConflict(conflict.id, conflict.sourceB.value)}
                                            className="flex flex-col items-center p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all text-center group/btn"
                                        >
                                            <span className="text-[10px] font-black text-slate-400 uppercase mb-2">{conflict.sourceB.name}</span>
                                            <span className="text-lg font-bold text-slate-800 dark:text-white group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400">{conflict.sourceB.value}</span>
                                            <span className="mt-3 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                                {t.integrationHub.conflicts.keepSource}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => handleSkipConflict(conflict.id)}
                                            className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1"
                                        >
                                            <X size={10} /> Skip Record
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- CONNECTOR WIZARD MODAL --- */}
            {isWizardOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20">
                        
                        {/* Wizard Progress Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {wizardStep === 1 ? t.integrationHub.wizard.step1Title : 
                                         wizardStep === 2 ? t.integrationHub.wizard.step2Title : 
                                         wizardStep === 3 ? t.integrationHub.wizard.step3Title :
                                         t.integrationHub.wizard.step4Title}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {wizardStep === 1 ? t.integrationHub.wizard.step1Desc : 
                                         wizardStep === 2 ? t.integrationHub.wizard.step2Desc : 
                                         wizardStep === 3 ? t.integrationHub.wizard.step3Desc :
                                         t.integrationHub.wizard.step4Desc}
                                    </p>
                                </div>
                                <button onClick={() => setIsWizardOpen(false)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors">
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>
                            
                            {/* Visual Progress Bar */}
                            <div className="flex items-center gap-4">
                                {[1, 2, 3, 4].map(step => (
                                    <React.Fragment key={step}>
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                                            wizardStep >= step ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-300'
                                        }`}>
                                            <span className="text-sm font-black">{step}</span>
                                            {wizardStep > step && <CheckCircle2 size={16} />}
                                        </div>
                                        {step < 4 && <div className={`flex-1 h-1 rounded-full ${wizardStep > step ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10">
                            
                            {/* STEP 1: SOURCE TYPE */}
                            {wizardStep === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                                    <button 
                                        onClick={() => { setNewConnector({...newConnector, type: 'Excel'}); setWizardStep(2); }}
                                        className="p-8 rounded-[2rem] border-4 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 text-center transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-green-50 text-green-600 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <FileSpreadsheet size={32} />
                                        </div>
                                        <h4 className="font-black text-slate-800 dark:text-white">{t.integrationHub.types.excel}</h4>
                                        <p className="text-xs text-slate-500 mt-2">Shared drive or local upload</p>
                                    </button>

                                    <button 
                                        onClick={() => { setNewConnector({...newConnector, type: 'Database'}); setWizardStep(2); }}
                                        className="p-8 rounded-[2rem] border-4 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 text-center transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Database size={32} />
                                        </div>
                                        <h4 className="font-black text-slate-800 dark:text-white">{t.integrationHub.types.database}</h4>
                                        <p className="text-xs text-slate-500 mt-2">SQL, Oracle, or Azure AD</p>
                                    </button>

                                    <button 
                                        onClick={() => { setNewConnector({...newConnector, type: 'API'}); setWizardStep(2); }}
                                        className="p-8 rounded-[2rem] border-4 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 text-center transition-all group"
                                    >
                                        <div className="w-16 h-16 bg-purple-50 text-purple-600 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Globe size={32} />
                                        </div>
                                        <h4 className="font-black text-slate-800 dark:text-white">{t.integrationHub.types.api}</h4>
                                        <p className="text-xs text-slate-500 mt-2">REST API / Webhooks (JSON)</p>
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: CONFIGURATION */}
                            {wizardStep === 2 && (
                                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Connector Display Name</label>
                                        <input 
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-lg font-bold outline-none focus:border-indigo-500 transition-all shadow-inner dark:text-white"
                                            placeholder="e.g. Maputo Site HR Data"
                                            value={newConnector.name}
                                            onChange={(e) => setNewConnector({...newConnector, name: e.target.value})}
                                        />
                                    </div>

                                    {newConnector.type === 'Excel' && (
                                        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center group cursor-pointer hover:bg-indigo-50/30 transition-all">
                                            <Upload size={48} className="mx-auto text-slate-300 mb-4 group-hover:text-indigo-500 transition-colors" />
                                            <h5 className="text-lg font-bold text-slate-800 dark:text-white">Upload File for Mapping</h5>
                                            <p className="text-sm text-slate-500 mt-1">We will scan the headers to setup the bridge.</p>
                                        </div>
                                    )}

                                    {newConnector.type === 'API' && (
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Endpoint URL</label>
                                                <input className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 pl-12 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white" placeholder="https://api.system.com/employees" />
                                                <Globe size={18} className="absolute left-4 top-[3.2rem] text-slate-400" />
                                            </div>
                                            <div className="relative">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Secret Key / Bearer Token</label>
                                                <input type="password" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 pl-12 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white" placeholder="••••••••••••••••" />
                                                <Key size={18} className="absolute left-4 top-[3.2rem] text-slate-400" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: MAPPING */}
                            {wizardStep === 3 && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-3">
                                        <Zap size={20} className="text-indigo-600" />
                                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                                            Found <strong>7 columns</strong> in your source. Map them to CARS fields below.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Mapping Bridge */}
                                        <div className="space-y-4">
                                            {systemFields.map(field => (
                                                <div key={field.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-indigo-300 transition-all">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-black text-slate-800 dark:text-white">{field.label}</span>
                                                            {field.required && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-black">REQ</span>}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.integrationHub.wizard.systemField}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                                        <select 
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                                                            onChange={(e) => setNewConnector({
                                                                ...newConnector, 
                                                                mapping: { ...newConnector.mapping, [field.id]: e.target.value }
                                                            })}
                                                        >
                                                            <option value="">-- {t.common.all} --</option>
                                                            {sampleHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Validation Panel */}
                                        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center text-indigo-500 mb-6 border border-slate-100 dark:border-slate-700">
                                                <Layers size={40} />
                                            </div>
                                            <h5 className="text-lg font-black text-slate-800 dark:text-white">Validation Summary</h5>
                                            <p className="text-sm text-slate-500 mt-2 mb-8">System fields mapped: <strong>{Object.keys(newConnector.mapping || {}).length}</strong></p>
                                            
                                            <div className="w-full space-y-3">
                                                <div className="flex items-center gap-3 text-xs text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                                                    <CheckCircle2 size={16} />
                                                    <span className="font-bold">ID mapping validated</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-amber-600 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100">
                                                    <Info size={16} />
                                                    <span className="font-bold">Phone Number will be skipped</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: PREVIEW / DRY RUN */}
                            {wizardStep === 4 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <History size={20} className="text-indigo-500" />
                                            Sample Data Extraction (Dry Run)
                                        </h4>
                                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Limit: 3 Records</span>
                                    </div>

                                    <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black text-slate-400">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">Record ID</th>
                                                    <th className="px-4 py-3 text-left">Full Name</th>
                                                    <th className="px-4 py-3 text-left">Department</th>
                                                    <th className="px-4 py-3 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                                    <td className="px-4 py-4 font-mono text-slate-500">VUL-102</td>
                                                    <td className="px-4 py-4 text-slate-900 dark:text-white">Antonio Sitoe</td>
                                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">Mine Operations</td>
                                                    <td className="px-4 py-4 text-center"><span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-black uppercase tracking-widest border border-green-200">Valid</span></td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                                    <td className="px-4 py-4 font-mono text-slate-500">VUL-103</td>
                                                    <td className="px-4 py-4 text-slate-900 dark:text-white">Maria Silva</td>
                                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">HSE</td>
                                                    <td className="px-4 py-4 text-center"><span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-black uppercase tracking-widest border border-green-200">Valid</span></td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 bg-red-50/20">
                                                    <td className="px-4 py-4 font-mono text-red-500">INVALID</td>
                                                    <td className="px-4 py-4 text-slate-400 italic">No Name Found</td>
                                                    <td className="px-4 py-4 text-slate-400 italic">-</td>
                                                    <td className="px-4 py-4 text-center"><span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-black uppercase tracking-widest border border-red-200">Error</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700 mt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h5 className="text-white font-bold flex items-center gap-2">
                                                <Calendar size={18} className="text-blue-400" />
                                                Sync Scheduler (Optional)
                                            </h5>
                                        </div>
                                        <div className="flex gap-4">
                                            {['Manual', 'Daily (02:00)', 'Weekly'].map(opt => (
                                                <button key={opt} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${opt === 'Manual' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                            <button 
                                onClick={() => wizardStep === 1 ? setIsWizardOpen(false) : setWizardStep(wizardStep - 1)}
                                className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                {wizardStep === 1 ? t.common.cancel : 'Back'}
                            </button>
                            <button 
                                onClick={() => wizardStep === 4 ? handleCreateConnector() : setWizardStep(wizardStep + 1)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-xl font-black shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-3"
                            >
                                <span>{wizardStep === 4 ? 'Save Connector' : 'Continue'}</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntegrationHub;
