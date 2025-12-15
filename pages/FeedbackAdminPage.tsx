
import React, { useState } from 'react';
import { Feedback, FeedbackStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    MessageSquare, CheckCircle, XCircle, Clock, 
    Filter, Search, AlertCircle, ThumbsUp, Trash2, 
    MoreVertical, Flag, Zap
} from 'lucide-react';

interface FeedbackAdminPageProps {
    feedbackList: Feedback[];
    onUpdateFeedback: (id: string, updates: Partial<Feedback>) => void;
    onDeleteFeedback: (id: string) => void;
}

const FeedbackAdminPage: React.FC<FeedbackAdminPageProps> = ({ feedbackList, onUpdateFeedback, onDeleteFeedback }) => {
    const { t } = useLanguage();
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterActionable, setFilterActionable] = useState<string>('All'); // All, Yes, No
    const [searchQuery, setSearchQuery] = useState('');
    const [openActionId, setOpenActionId] = useState<string | null>(null);

    const filteredList = feedbackList.filter(item => {
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesActionable = filterActionable === 'All' 
            ? true 
            : filterActionable === 'Yes' ? item.isActionable : !item.isActionable;
        const matchesSearch = item.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.userName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesActionable && matchesSearch;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const getStatusColor = (status: FeedbackStatus) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'In Progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'Dismissed': return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusIcon = (status: FeedbackStatus) => {
        switch (status) {
            case 'New': return <AlertCircle size={14} />;
            case 'In Progress': return <Clock size={14} />;
            case 'Resolved': return <CheckCircle size={14} />;
            case 'Dismissed': return <XCircle size={14} />;
        }
    };

    return (
        <div className="space-y-6 pb-24 animate-fade-in-up h-full">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden border border-slate-700">
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                    <MessageSquare size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 backdrop-blur-sm">
                                <ThumbsUp size={28} className="text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-white">{t.feedback.adminTitle}</h2>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">
                            {t.feedback.adminSubtitle}
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-center min-w-[100px]">
                            <div className="text-2xl font-black text-white">{feedbackList.filter(f => f.status === 'New').length}</div>
                            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">New</div>
                        </div>
                        <div className="bg-green-500/20 px-4 py-2 rounded-xl backdrop-blur-md border border-green-500/30 text-center min-w-[100px]">
                            <div className="text-2xl font-black text-green-400">{feedbackList.filter(f => f.status === 'Resolved').length}</div>
                            <div className="text-[10px] font-bold text-green-200 uppercase tracking-wider">Resolved</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-20">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={t.common.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                    />
                </div>
                
                <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-xl border border-slate-200 dark:border-slate-600">
                        <Filter size={14} className="text-slate-400 ml-2" />
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-2"
                        >
                            <option value="All">All Status</option>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Dismissed">Dismissed</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-xl border border-slate-200 dark:border-slate-600">
                        <Flag size={14} className="text-slate-400 ml-2" />
                        <select 
                            value={filterActionable} 
                            onChange={(e) => setFilterActionable(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-2"
                        >
                            <option value="All">All Priority</option>
                            <option value="Yes">Actionable Only</option>
                            <option value="No">Not Actionable</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Feedback List */}
            <div className="grid gap-4">
                {filteredList.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                        <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No feedback entries found.</p>
                    </div>
                ) : (
                    filteredList.map(item => (
                        <div key={item.id} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${item.isActionable ? 'border-indigo-200 dark:border-indigo-900/50' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${item.type === 'Bug' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400' : item.type === 'Improvement' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                            {item.type}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                        {item.isActionable && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                                                <Zap size={10} fill="currentColor" /> ACTIONABLE
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed mb-4">
                                        "{item.message}"
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                            {item.userName.charAt(0)}
                                        </div>
                                        <span>Submitted by <strong>{item.userName}</strong></span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(item.status)}`}>
                                        {getStatusIcon(item.status)}
                                        {item.status}
                                    </div>
                                    
                                    <div className="relative">
                                        <button 
                                            onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        
                                        {openActionId === item.id && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in-up">
                                                <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">Set Status</p>
                                                    {['New', 'In Progress', 'Resolved', 'Dismissed'].map((s) => (
                                                        <button 
                                                            key={s}
                                                            onClick={() => { onUpdateFeedback(item.id, { status: s as FeedbackStatus }); setOpenActionId(null); }}
                                                            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between ${item.status === s ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300'}`}
                                                        >
                                                            {s}
                                                            {item.status === s && <CheckCircle size={12} />}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="p-2">
                                                    <button 
                                                        onClick={() => { onUpdateFeedback(item.id, { isActionable: !item.isActionable }); setOpenActionId(null); }}
                                                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 mb-1"
                                                    >
                                                        {item.isActionable ? t.feedback.markNotActionable : t.feedback.markActionable}
                                                    </button>
                                                    <button 
                                                        onClick={() => { onDeleteFeedback(item.id); setOpenActionId(null); }}
                                                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                                                    >
                                                        Delete Entry
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedbackAdminPage;
