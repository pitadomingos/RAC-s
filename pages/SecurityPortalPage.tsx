import React, { useState } from 'react';
import {
    Shield, BadgeCheck, Clock, CheckCircle2, AlertTriangle,
    Search, Upload, FileText, RefreshCw, Inbox, History,
    Building2, Phone, Mail, Calendar, Briefcase, Hash,
    UserCheck, Users, Lock, Unlock, Camera, ShieldAlert,
    ShieldCheck, ShieldX, Fingerprint, Eye, X, Check,
    FileCheck, FileScan, BarChart3, TrendingUp, Zap
} from 'lucide-react';
import { DEMO_RECRUITMENT_PROCESSES } from '../mockData';
import { RecruitmentProcess, RecruitmentStatus } from '../types';

// ─── Shared localStorage helpers ─────────────────────────────────────────────
const LS_KEY = 'mobilization_processes';
function loadProcesses(): RecruitmentProcess[] {
    try {
        const saved = localStorage.getItem(LS_KEY);
        return saved ? JSON.parse(saved) : DEMO_RECRUITMENT_PROCESSES;
    } catch { return DEMO_RECRUITMENT_PROCESSES; }
}
function saveProcesses(p: RecruitmentProcess[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
}

function timeSince(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}
function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusBadge: Record<string, string> = {
    [RecruitmentStatus.AM_REQUESTED]: 'bg-slate-100 text-slate-600',
    [RecruitmentStatus.HR_PENDING]: 'bg-amber-100 text-amber-700',
    [RecruitmentStatus.SECURITY_PENDING]: 'bg-blue-100 text-blue-700',
    [RecruitmentStatus.PARALLEL_CLEARANCE_PENDING]: 'bg-purple-100 text-purple-700',
    [RecruitmentStatus.CLINIC_PENDING]: 'bg-teal-100 text-teal-700',
    [RecruitmentStatus.INDUCTION_PENDING]: 'bg-indigo-100 text-indigo-700',
    [RecruitmentStatus.TRAINING_PENDING]: 'bg-orange-100 text-orange-700',
    [RecruitmentStatus.COMPLETED]: 'bg-emerald-100 text-emerald-700',
};

const BADGE_PREFIXES = ['TEMP', 'SEC', 'PRV', 'SITE', 'MAIN', 'PROC'];

function generateBadgeNo() {
    const prefix = BADGE_PREFIXES[Math.floor(Math.random() * BADGE_PREFIXES.length)];
    const num = Math.floor(1000 + Math.random() * 8999);
    return `${prefix}-ACCESS-${num}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SecurityPortalPage() {
    const [processes, setProcesses] = useState<RecruitmentProcess[]>(loadProcesses);
    const [activeTab, setActiveTab] = useState<'queue' | 'cleared' | 'badges'>('queue');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [badgeInput, setBadgeInput] = useState('');
    const [accessNotes, setAccessNotes] = useState('');
    const [accessZones, setAccessZones] = useState<string[]>([]);

    const ALL_ZONES = ['Main Gate', 'Mine Pit', 'Processing Plant', 'Workshop', 'Explosives Magazine', 'Admin Block', 'Fuel Depot', 'Canteen'];

    // Security queue: SECURITY_PENDING and PARALLEL_CLEARANCE_PENDING (where security not yet cleared)
    const queue = processes.filter(p =>
        p.status === RecruitmentStatus.SECURITY_PENDING ||
        (p.status === RecruitmentStatus.PARALLEL_CLEARANCE_PENDING && !p.securityCleared)
    );
    const cleared = processes.filter(p =>
        p.securityCleared ||
        [RecruitmentStatus.INDUCTION_PENDING, RecruitmentStatus.TRAINING_PENDING, RecruitmentStatus.COMPLETED].includes(p.status)
    );
    const allWithBadge = processes.filter(p => p.temporaryBadgeNumber);

    const selected = processes.find(p => p.id === selectedId) || null;

    const filtered = (list: RecruitmentProcess[]) =>
        list.filter(p =>
            !search ||
            p.candidateName.toLowerCase().includes(search.toLowerCase()) ||
            p.role.toLowerCase().includes(search.toLowerCase()) ||
            (p.temporaryBadgeNumber || '').toLowerCase().includes(search.toLowerCase())
        );

    function update(updated: RecruitmentProcess) {
        const list = processes.map(p => p.id === updated.id ? updated : p);
        setProcesses(list);
        saveProcesses(list);
    }

    function toast(msg: string) { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); }

    function issueBadge(p: RecruitmentProcess) {
        const badge = badgeInput.trim() || generateBadgeNo();

        if (p.requestType === 'PersonnelAccess') {
            update({ ...p, temporaryBadgeNumber: badge, securityCleared: true, status: RecruitmentStatus.COMPLETED });
            toast(`Access Badge ${badge} issued for Personnel. Access Granted!`);
        } else if (p.requestType === 'EquipmentAccess') {
            update({ ...p, temporaryBadgeNumber: badge, securityCleared: true, status: RecruitmentStatus.COMPLETED });
            toast(`Access Tag ${badge} issued for Equipment. Access Granted!`);
        } else if (p.workerType === 'Contractor') {
            // Parallel: mark securityCleared; check if clinic also cleared → advance
            const clinicDone = p.clinicFitnessCleared === true;
            const nextStatus = clinicDone
                ? RecruitmentStatus.INDUCTION_PENDING
                : RecruitmentStatus.PARALLEL_CLEARANCE_PENDING;
            update({ ...p, temporaryBadgeNumber: badge, securityCleared: true, status: nextStatus });
            toast(`Badge ${badge} issued. ${clinicDone ? 'Both cleared → Induction!' : 'Waiting for Clinic clearance.'}`);
        } else {
            // Prime: SECURITY_PENDING → CLINIC_PENDING
            update({ ...p, temporaryBadgeNumber: badge, securityCleared: true, status: RecruitmentStatus.CLINIC_PENDING });
            toast(`Badge ${badge} issued. Forwarded to Clinic.`);
        }
        setBadgeInput('');
        setAccessZones([]);
        setAccessNotes('');
    }

    function revokeBadge(p: RecruitmentProcess) {
        if (!window.confirm(`Revoke badge ${p.temporaryBadgeNumber} for ${p.candidateName}?`)) return;
        update({ ...p, temporaryBadgeNumber: undefined, securityCleared: false });
        toast(`Badge revoked for ${p.candidateName}.`);
    }

    const stats = [
        { label: 'Awaiting Clearance', value: queue.length, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
        { label: 'Security Cleared', value: cleared.length, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { label: 'Active Badges', value: allWithBadge.length, color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
        { label: 'Contractors', value: processes.filter(p => p.workerType === 'Contractor').length, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    ];

    const tabs = [
        { id: 'queue', label: 'Pending Clearance', icon: ShieldAlert, count: queue.length },
        { id: 'cleared', label: 'Cleared', icon: ShieldCheck, count: cleared.length },
        { id: 'badges', label: 'Badge Registry', icon: BadgeCheck, count: allWithBadge.length },
    ] as const;

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Shield size={20} className="text-white" />
                        </div>
                        Security Clearance Portal
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-14">
                        Issue access badges · Manage site clearances · Track security verifications
                    </p>
                </div>
                <button onClick={() => { setProcesses(loadProcesses()); toast('Refreshed.'); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-blue-400 transition-all">
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className={`${s.bg} dark:bg-slate-800/60 border ${s.border} dark:border-slate-700 rounded-[1.5rem] p-4 shadow-sm`}>
                        <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <tab.icon size={13} /> {tab.label}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Badge Registry — special full-width view */}
            {activeTab === 'badges' ? (
                <BadgeRegistryView processes={allWithBadge} onRevoke={revokeBadge} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left list */}
                    <div className="lg:col-span-4 space-y-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 shadow-sm">
                            <Search size={14} className="text-slate-400 shrink-0" />
                            <input type="text" placeholder="Search by name, badge..." value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400" />
                        </div>

                        <div className="space-y-2">
                            {filtered(activeTab === 'queue' ? queue : cleared).map(p => (
                                <button key={p.id} onClick={() => setSelectedId(p.id)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedId === p.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-200'}`}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className="font-black text-sm text-slate-900 dark:text-white truncate">
                                                {p.requestType === 'EquipmentAccess' ? `${p.equipmentType} (${p.equipmentId})` : p.candidateName}
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">
                                                {p.requestType === 'EquipmentAccess' ? `${p.contractorCompany || p.primeCompany}` : `${p.role} · ${p.company}`}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${statusBadge[p.status] || 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                                                {p.requestType && (
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                                        p.requestType === 'PersonnelAccess' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                                        p.requestType === 'EquipmentAccess' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                        {p.requestType === 'PersonnelAccess' ? 'Personnel Access' :
                                                         p.requestType === 'EquipmentAccess' ? 'Equipment Access' : 'Recruitment'}
                                                    </span>
                                                )}
                                                {p.workerType === 'Contractor' && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Contractor</span>}
                                                {p.securityCleared && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1"><ShieldCheck size={8}/> Cleared</span>}
                                            </div>
                                        </div>
                                        <div className="text-[9px] text-slate-400 shrink-0">{timeSince(p.requestedAt)}</div>
                                    </div>
                                    {p.temporaryBadgeNumber && (
                                        <div className="mt-2 text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg flex items-center gap-1">
                                            <BadgeCheck size={9} /> {p.temporaryBadgeNumber}
                                        </div>
                                    )}
                                </button>
                            ))}
                            {filtered(activeTab === 'queue' ? queue : cleared).length === 0 && (
                                <div className="text-center py-12 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <ShieldCheck size={32} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">No records in this section</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right detail */}
                    <div className="lg:col-span-8">
                        {selected ? (
                            <SecurityClearanceDetail
                                process={selected}
                                badgeInput={badgeInput}
                                setBadgeInput={setBadgeInput}
                                accessZones={accessZones}
                                setAccessZones={setAccessZones}
                                accessNotes={accessNotes}
                                setAccessNotes={setAccessNotes}
                                allZones={ALL_ZONES}
                                onIssueBadge={issueBadge}
                                onRevoke={revokeBadge}
                            />
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-16 text-center text-slate-400 shadow-sm h-full flex flex-col items-center justify-center">
                                <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-bold">Select a candidate</p>
                                <p className="text-xs mt-1">to issue badge and manage site access</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {successMsg && (
                <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50">
                    <ShieldCheck size={18} /><span className="font-black text-sm">{successMsg}</span>
                </div>
            )}
        </div>
    );
}

// ─── Security Clearance Detail ────────────────────────────────────────────────
function SecurityClearanceDetail({
    process: p, badgeInput, setBadgeInput, accessZones, setAccessZones,
    accessNotes, setAccessNotes, allZones, onIssueBadge, onRevoke
}: {
    process: RecruitmentProcess;
    badgeInput: string; setBadgeInput: (v: string) => void;
    accessZones: string[]; setAccessZones: (v: string[]) => void;
    accessNotes: string; setAccessNotes: (v: string) => void;
    allZones: string[];
    onIssueBadge: (p: RecruitmentProcess) => void;
    onRevoke: (p: RecruitmentProcess) => void;
}) {
    const canIssue = p.status === RecruitmentStatus.SECURITY_PENDING ||
        (p.status === RecruitmentStatus.PARALLEL_CLEARANCE_PENDING && !p.securityCleared);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                            {p.requestType === 'EquipmentAccess' ? '🚜' : p.candidateName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                {p.requestType === 'EquipmentAccess' ? `${p.equipmentType} Clearance` : p.candidateName}
                            </h2>
                            <div className="text-sm text-blue-600 font-bold mt-0.5">
                                {p.requestType === 'EquipmentAccess' ? `ID: ${p.equipmentId} · ${p.contractorCompany || p.primeCompany}` : `${p.role} · ${p.company}`}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${statusBadge[p.status] || 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                                {p.workerType === 'Contractor' && (
                                    <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">🤝 Contractor</span>
                                )}
                                {p.securityCleared && (
                                    <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                        <ShieldCheck size={9} /> Security Cleared
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6 max-h-[580px] overflow-y-auto">
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                    {p.requestType === 'EquipmentAccess' ? (
                        [
                            { icon: Hash, label: 'Equipment ID/Tag', value: p.equipmentId || '—' },
                            { icon: Shield, label: 'Equipment Type', value: p.equipmentType || '—' },
                            { icon: Building2, label: 'Contractor Company', value: p.contractorCompany || p.primeCompany },
                            { icon: UserCheck, label: 'Responsible Person', value: p.responsiblePersonName || '—' },
                            { icon: Phone, label: 'Responsible Phone', value: p.responsiblePersonPhone || '—' },
                            { icon: Calendar, label: 'Requested', value: fmtDate(p.requestedAt) },
                        ].map(item => (
                            <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700">
                                <item.icon size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[9px] font-black text-slate-400 uppercase">{item.label}</div>
                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.value}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        [
                            { icon: Mail, label: 'Email', value: p.candidateEmail },
                            { icon: Phone, label: 'Phone', value: p.candidatePhone },
                            { icon: Building2, label: 'Company', value: p.contractorCompany || p.primeCompany },
                            { icon: Calendar, label: 'Requested', value: fmtDate(p.requestedAt) },
                            { icon: Briefcase, label: 'Requested By', value: p.requestedBy },
                            { icon: Hash, label: 'Record ID', value: p.recordId || '—' },
                        ].map(item => (
                            <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700">
                                <item.icon size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[9px] font-black text-slate-400 uppercase">{item.label}</div>
                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.value}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Safety inspection status (equipment only) */}
                {p.requestType === 'EquipmentAccess' && (
                    <div className={`p-4 rounded-2xl border ${p.safetyInspectionCleared ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'}`}>
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <ShieldCheck size={14} className={p.safetyInspectionCleared ? 'text-emerald-600' : 'text-amber-600'} />
                            Safety Inspection Status
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {p.safetyInspectionCleared ? (
                                <span>Passed inspection: <strong>{p.safetyInspectionRecordId || 'Cleared'}</strong></span>
                            ) : (
                                <span>Pending inspection or failed</span>
                            )}
                        </div>
                        {p.safetyInspectionComments && (
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                "{p.safetyInspectionComments}"
                            </div>
                        )}
                    </div>
                )}

                {/* Parallel clearance progress (contractor only) */}
                {p.workerType === 'Contractor' && p.requestType !== 'EquipmentAccess' && p.requestType !== 'PersonnelAccess' && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl">
                        <div className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-3">Parallel Clearance Status</div>
                        <div className="flex gap-4">
                            <div className={`flex-1 p-3 rounded-xl border text-center ${p.securityCleared ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                                <ShieldCheck size={20} className={`mx-auto mb-1 ${p.securityCleared ? 'text-emerald-600' : 'text-slate-300'}`} />
                                <div className="text-[9px] font-black uppercase">Security</div>
                                <div className={`text-[10px] font-bold mt-0.5 ${p.securityCleared ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {p.securityCleared ? 'Cleared ✓' : 'Pending'}
                                </div>
                            </div>
                            <div className={`flex-1 p-3 rounded-xl border text-center ${p.clinicFitnessCleared ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                                <Users size={20} className={`mx-auto mb-1 ${p.clinicFitnessCleared ? 'text-emerald-600' : 'text-slate-300'}`} />
                                <div className="text-[9px] font-black uppercase">Clinic</div>
                                <div className={`text-[10px] font-bold mt-0.5 ${p.clinicFitnessCleared ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {p.clinicFitnessCleared ? 'Cleared ✓' : 'Pending'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current badge */}
                {p.temporaryBadgeNumber && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BadgeCheck size={24} className="text-blue-600" />
                            <div>
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                    {p.requestType === 'EquipmentAccess' ? 'Active Equipment Tag' : 'Active Access Badge'}
                                </div>
                                <div className="font-black text-slate-900 dark:text-white text-lg">{p.temporaryBadgeNumber}</div>
                            </div>
                        </div>
                        <button onClick={() => onRevoke(p)}
                            className="flex items-center gap-1.5 text-[9px] font-black text-red-600 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 uppercase transition-all">
                            <ShieldX size={11} /> Revoke
                        </button>
                    </div>
                )}

                {/* Issue Badge form */}
                {canIssue && (
                    <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <BadgeCheck size={11} /> {p.requestType === 'EquipmentAccess' ? 'Issue Equipment Access Tag' : 'Issue Access Badge'}
                        </div>

                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">
                                {p.requestType === 'EquipmentAccess' ? 'Equipment Tag Number (leave blank to auto-generate)' : 'Badge Number (leave blank to auto-generate)'}
                            </label>
                            <div className="flex gap-2">
                                <input type="text" value={badgeInput} onChange={e => setBadgeInput(e.target.value)}
                                    placeholder={p.requestType === 'EquipmentAccess' ? 'e.g. TAG-EX-901' : 'e.g. TEMP-ACCESS-1234'}
                                    className="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-blue-400 transition-all" />
                                <button type="button" onClick={() => setBadgeInput((p.requestType === 'EquipmentAccess' ? 'TAG-' : 'TEMP-') + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 8999))}
                                    className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl text-[9px] font-black hover:bg-blue-100 transition-all">
                                    <Zap size={13} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Permitted Access Zones</label>
                            <div className="flex flex-wrap gap-2">
                                {allZones.map(zone => (
                                    <button key={zone} type="button"
                                        onClick={() => setAccessZones(accessZones.includes(zone) ? accessZones.filter(z => z !== zone) : [...accessZones, zone])}
                                        className={`text-[9px] font-black px-2.5 py-1.5 rounded-xl border transition-all ${accessZones.includes(zone) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                                        {zone}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Security Notes</label>
                            <textarea rows={2} value={accessNotes} onChange={e => setAccessNotes(e.target.value)}
                                placeholder="Any restrictions or notes..."
                                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-blue-400 transition-all resize-none" />
                        </div>

                        <button onClick={() => onIssueBadge(p)}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-blue-500/20">
                            <BadgeCheck size={16} /> {p.requestType === 'EquipmentAccess' ? 'Issue Tag & Clear Access' : 'Issue Badge & Clear Access'}
                        </button>
                    </div>
                )}

                {/* Documents from HR */}
                {((p.documents || []).length > 0 || (p.amDocuments || []).length > 0) && (
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verified Documents</div>
                        <div className="space-y-2">
                            {[...(p.amDocuments || []), ...(p.documents || [])].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <FileCheck size={14} className="text-indigo-500" />
                                        <div>
                                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{doc.name}</div>
                                            <div className="text-[9px] text-slate-400">{doc.type} · {doc.fileSize}</div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black">{doc.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Badge Registry View ──────────────────────────────────────────────────────
function BadgeRegistryView({ processes, onRevoke }: { processes: RecruitmentProcess[], onRevoke: (p: RecruitmentProcess) => void }) {
    const [search, setSearch] = useState('');
    const filtered = processes.filter(p =>
        !search ||
        p.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        (p.temporaryBadgeNumber || '').toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 flex items-center justify-between gap-4">
                <div className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2"><BadgeCheck size={16} className="text-blue-600" /> Access Badge Registry</div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                    <Search size={13} className="text-slate-400" />
                    <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent text-xs font-bold outline-none w-40 text-slate-700 dark:text-slate-300 placeholder:text-slate-400" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            {['Name / ID', 'Company', 'Role / Type', 'Badge / Tag Number', 'Type', 'Status', ''].map(h => (
                                <th key={h} className="text-left px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-5 py-3.5 font-black text-slate-900 dark:text-white whitespace-nowrap">
                                    {p.requestType === 'EquipmentAccess' ? `${p.equipmentType} (${p.equipmentId})` : p.candidateName}
                                </td>
                                <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">{p.contractorCompany || p.primeCompany}</td>
                                <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                                    {p.requestType === 'EquipmentAccess' ? 'Equipment' : p.role}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="font-black text-blue-700 dark:text-blue-400 text-xs bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">{p.temporaryBadgeNumber}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                        p.requestType === 'PersonnelAccess' ? 'bg-indigo-100 text-indigo-700' :
                                        p.requestType === 'EquipmentAccess' ? 'bg-amber-100 text-amber-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>{p.requestType || 'Recruitment'}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${statusBadge[p.status] || 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <button onClick={() => onRevoke(p)}
                                        className="text-[9px] font-black text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-all">Revoke</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                        <BadgeCheck size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-xs">No active badges found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
