
import React, { useState } from 'react';
import { ScrollText, Filter, AlertTriangle, CheckCircle, Info, ShieldAlert, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

interface LogEntry {
    id: string;
    level: LogLevel;
    messageKey: string; // Key to look up in translation or raw message
    params?: any; // Params for translation
    user: string;
    timestamp: string;
}

// Mock logs updated to be language agnostic (simulated)
// In a real app, logs are usually immutable strings, but for this prototype we simulate translation
const MOCK_LOGS_DATA: LogEntry[] = [
    { id: '1', level: 'AUDIT', messageKey: 'User System Admin updated System Configuration', user: 'System Admin', timestamp: '2024-05-20 09:30:15' },
    { id: '2', level: 'INFO', messageKey: 'Auto-booking service ran successfully', user: 'SYSTEM', timestamp: '2024-05-20 08:00:00' },
    { id: '3', level: 'WARN', messageKey: 'Expiry Notification sent', user: 'SYSTEM', timestamp: '2024-05-19 14:20:00' },
    { id: '4', level: 'ERROR', messageKey: 'Failed to generate AI report', user: 'Sarah Connor', timestamp: '2024-05-19 10:15:22' },
    { id: '5', level: 'AUDIT', messageKey: 'User Sarah Connor manually added 5 bookings', user: 'Sarah Connor', timestamp: '2024-05-19 09:10:05' },
    { id: '6', level: 'INFO', messageKey: 'User John Doe logged in', user: 'John Doe', timestamp: '2024-05-19 08:05:10' },
    { id: '7', level: 'AUDIT', messageKey: 'User System Admin deleted User ID 45', user: 'System Admin', timestamp: '2024-05-18 16:45:00' },
];

const LogsPage: React.FC = () => {
    const { t, language } = useLanguage();
    const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');

    const getTranslatedMessage = (log: LogEntry) => {
        // Simple mock translation logic for prototype
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
        ? MOCK_LOGS_DATA 
        : MOCK_LOGS_DATA.filter(log => log.level === filterLevel);

    const getIcon = (level: LogLevel) => {
        switch (level) {
            case 'INFO': return <Info size={16} className="text-blue-500" />;
            case 'WARN': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'ERROR': return <ShieldAlert size={16} className="text-red-500" />;
            case 'AUDIT': return <CheckCircle size={16} className="text-green-600" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[calc(100vh-100px)] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <ScrollText className="text-slate-500" />
                        {t.logs.title}
                    </h2>
                    <p className="text-sm text-gray-500">{t.logs.subtitle}</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select 
                        className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
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

            <div className="flex-1 overflow-auto p-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">{t.logs.table.level}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">{t.logs.table.timestamp}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">{t.logs.table.user}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.logs.table.message}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 font-mono text-sm">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {getIcon(log.level)}
                                        <span className={`font-bold text-xs px-2 py-0.5 rounded border
                                            ${log.level === 'INFO' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                            ${log.level === 'WARN' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                            ${log.level === 'ERROR' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                            ${log.level === 'AUDIT' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        `}>
                                            {log.level}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-gray-500 flex items-center gap-2">
                                    <Clock size={12} />
                                    {log.timestamp}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-slate-700 font-bold">
                                    {log.user}
                                </td>
                                <td className="px-6 py-3 text-slate-600">
                                    {getTranslatedMessage(log)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsPage;
