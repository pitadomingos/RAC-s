
import React, { useState } from 'react';
import { ScrollText, Filter, AlertTriangle, CheckCircle, Info, ShieldAlert, Clock } from 'lucide-react';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

interface LogEntry {
    id: string;
    level: LogLevel;
    message: string;
    user: string;
    timestamp: string;
}

const MOCK_LOGS: LogEntry[] = [
    { id: '1', level: 'AUDIT', message: 'User System Admin updated System Configuration (Room Capacity)', user: 'System Admin', timestamp: '2024-05-20 09:30:15' },
    { id: '2', level: 'INFO', message: 'Auto-booking service ran successfully. 0 bookings created.', user: 'SYSTEM', timestamp: '2024-05-20 08:00:00' },
    { id: '3', level: 'WARN', message: 'Expiry Notification sent to e.ripley@vulcan.com', user: 'SYSTEM', timestamp: '2024-05-19 14:20:00' },
    { id: '4', level: 'ERROR', message: 'Failed to generate AI report: API Timeout', user: 'Sarah Connor', timestamp: '2024-05-19 10:15:22' },
    { id: '5', level: 'AUDIT', message: 'User Sarah Connor manually added 5 bookings', user: 'Sarah Connor', timestamp: '2024-05-19 09:10:05' },
    { id: '6', level: 'INFO', message: 'User John Doe logged in', user: 'John Doe', timestamp: '2024-05-19 08:05:10' },
    { id: '7', level: 'AUDIT', message: 'User System Admin deleted User ID 45', user: 'System Admin', timestamp: '2024-05-18 16:45:00' },
];

const LogsPage: React.FC = () => {
    const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');

    const filteredLogs = filterLevel === 'ALL' 
        ? MOCK_LOGS 
        : MOCK_LOGS.filter(log => log.level === filterLevel);

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
                        System Logs
                    </h2>
                    <p className="text-sm text-gray-500">Audit trail and system events.</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select 
                        className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value as any)}
                    >
                        <option value="ALL">All Levels</option>
                        <option value="INFO">Info</option>
                        <option value="WARN">Warning</option>
                        <option value="ERROR">Error</option>
                        <option value="AUDIT">Audit</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
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
                                    {log.message}
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
