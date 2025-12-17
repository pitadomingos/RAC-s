
import React, { useState, useEffect } from 'react';
import { ScrollText, Filter, AlertTriangle, CheckCircle, Info, ShieldAlert, Clock, Terminal, ChevronLeft, ChevronRight, Zap, Bot, Skull, Activity, CheckCircle2, Cpu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

interface LogEntry {
    id: string;
    level: LogLevel;
    messageKey: string; 
    params?: any; 
    user: string;
    timestamp: string;
    aiFix?: string; // New field for Gemini fixes
}

const MOCK_LOGS_DATA: LogEntry[] = [
    { id: '1', level: 'AUDIT', messageKey: 'User System Admin updated System Configuration', user: 'System Admin', timestamp: '2024-05-20 09:30:15' },
    { id: '2', level: 'INFO', messageKey: 'Auto-booking service ran successfully', user: 'SYSTEM', timestamp: '2024-05-20 08:00:00' },
    { id: '3', level: 'WARN', messageKey: 'Expiry Notification sent', user: 'SYSTEM', timestamp: '2024-05-19 14:20:00' },
    { id: '4', level: 'ERROR', messageKey: 'Failed to generate AI report', user: 'Sarah Connor', timestamp: '2024-05-19 10:15:22' },
    { id: '5', level: 'AUDIT', messageKey: 'User Sarah Connor manually added 5 bookings', user: 'Sarah Connor', timestamp: '2024-05-19 09:10:05' },
    { id: '6', level: 'INFO', messageKey: 'User John Doe logged in', user: 'John Doe', timestamp: '2024-05-19 08:05:10' },
    { id: '7', level: 'AUDIT', messageKey: 'User System Admin deleted User ID 45', user: 'System Admin', timestamp: '2024-05-18 16:45:00' },
];

// Helper component to actually throw the error for the Boundary to catch
const CrashTrigger = () => {
    throw new Error("MANUAL SYSTEM CRASH: UAT Simulation Initiated by Admin");
};

const LogsPage: React.FC = () => {
    const { t, language } = useLanguage();
    const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
    const [allLogs, setAllLogs] = useState<LogEntry[]>(MOCK_LOGS_DATA);
    
    // State to trigger the crash component
    const [shouldCrash, setShouldCrash] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Load AI-detected logs from LocalStorage (Simulating DB persist)
    useEffect(() => {
        try {
            const backlog = localStorage.getItem('sys_logs_backlog');
            if (backlog) {
                const parsed = JSON.parse(backlog);
                // Merge and deduplicate simple logic
                setAllLogs(prev => {
                    const combined = [...parsed, ...prev];
                    // Simple sort by time descending (assuming string ISO or close enough for mock)
                    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                });
            }
        } catch (e) {
            console.error("Failed to load system logs", e);
        }
    }, []);

    const getTranslatedMessage = (log: LogEntry) => {
        if (language === 'pt') {
            if (log.messageKey.includes('System Configuration')) return 'Admin do Sistema atualizou Configuração do Sistema';
            if (log.messageKey.includes('Auto-booking')) return 'Serviço de auto-agendamento executado com sucesso';
            if (log.messageKey.includes('Expiry Notification')) return 'Notificação de Expiração enviada';
            if (log.messageKey.includes('AI report')) return 'Falha ao gerar relatório IA';
            if (log.messageKey.includes('manually added')) return 'Usuário adicionou manualmente 5 agendamentos';
            if (log.messageKey.includes('logged in')) return 'Usuário fez login';
            if (log.messageKey.includes('deleted User')) return 'Admin do Sistema excluiu Usuário ID 45';
        }
        return log.messageKey;
    };

    const filteredLogs = filterLevel === 'ALL' 
        ? allLogs 
        : allLogs.filter(log => log.level === filterLevel);

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const getIcon = (level: LogLevel) => {
        switch (level) {
            case 'INFO': return <Info size={16} className="text-blue-500" />;
            case 'WARN': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'ERROR': return <ShieldAlert size={16} className="text-red-500" />;
            case 'AUDIT': return <CheckCircle size={16} className="text-green-500" />;
        }
    };

    // If simulating, render the CrashTrigger which throws immediately,
    // activating the ErrorBoundary parent.
    if (shouldCrash) {
        return <CrashTrigger />;
    }

    return (
        <div className="space-y-6 pb-20 animate-fade-in-up h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                    <Terminal size={150} />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <ScrollText size={28} className="text-purple-400" />
                            {t.logs.title}
                        </h2>
                        <p className="text-slate-400 mt-1 text-sm font-mono">
                            /var/log/vulcan-safety.log
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setShouldCrash(true)}
                            className="flex items-center gap-2 bg-red-900/50 hover:bg-red-800 text-red-200 px-4 py-2 rounded-xl border border-red-800 transition-colors text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-red-900/20"
                            title="Safe Test of Self-Healing System (Triggers ErrorBoundary)"
                        >
                            <Skull size={16} /> Simulate Crash
                        </button>

                        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                            <Filter size={16} className="text-slate-400 ml-2" />
                            <select 
                                className="bg-transparent text-white text-sm font-bold focus:outline-none p-1.5 cursor-pointer"
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value as any)}
                            >
                                <option value="ALL">{t.logs.levels.all}</option>
                                <option value="INFO">{t.logs.levels.info}</option>
                                <option value="WARN">{t.logs.levels.warn}</option>
                                <option value="ERROR">{t.logs.levels.error}</option>
                                <option value="AUDIT">{t.logs.levels.audit}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col transition-colors">
                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider w-32">{t.logs.table.level}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider w-48">{t.logs.table.timestamp}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider w-48">{t.logs.table.user}</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">{t.logs.table.message}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700 font-mono text-xs">
                            {paginatedLogs.map((log) => {
                                const isAiFixed = !!log.aiFix;
                                return (
                                    <tr key={log.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group ${isAiFixed ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {getIcon(log.level)}
                                                <span className={`font-bold px-2 py-0.5 rounded border
                                                    ${log.level === 'INFO' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' : ''}
                                                    ${log.level === 'WARN' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800' : ''}
                                                    ${log.level === 'ERROR' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' : ''}
                                                    ${log.level === 'AUDIT' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' : ''}
                                                `}>
                                                    {log.level}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-slate-900 dark:text-slate-400 flex items-center gap-2">
                                            <Clock size={12} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                                            {log.timestamp}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-slate-900 dark:text-white font-bold flex items-center gap-2">
                                            {log.user === 'RoboTech AI' && <Bot size={14} className="text-indigo-500" />}
                                            {log.user}
                                        </td>
                                        <td className="px-6 py-3 text-slate-800 dark:text-slate-300">
                                            {getTranslatedMessage(log)}
                                            {isAiFixed && (
                                                <div className="mt-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg flex gap-3 items-start animate-pulse-slow">
                                                    <div className="mt-0.5 text-cyan-600 dark:text-cyan-400"><Zap size={14} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-cyan-700 dark:text-cyan-300 uppercase mb-0.5 tracking-wider">RoboTech Resolution:</p>
                                                        <p className="text-slate-600 dark:text-slate-400">{log.aiFix}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 dark:text-slate-400">{t.common.rowsPerPage}</span>
                            <select 
                                value={itemsPerPage}
                                onChange={handlePageSizeChange}
                                className="text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={120}>120</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-4 border-l border-slate-300 dark:border-slate-600 pl-4">
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                {t.common.page} {currentPage} {t.common.of} {Math.max(1, totalPages)} ({filteredLogs.length} total)
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300"><ChevronLeft size={16} /></button>
                                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsPage;
