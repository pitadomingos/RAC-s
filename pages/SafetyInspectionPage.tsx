import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    ClipboardList, Plus, Trash2, ChevronDown, ChevronUp, Save,
    Camera, CheckSquare, FileText, Hash, CalendarDays, AlignLeft,
    ListChecks, Search, Filter, Eye, ShieldCheck, ShieldX, AlertTriangle,
    GripVertical, Check, X, Download, BarChart3, Zap, Edit3, Layers
} from 'lucide-react';
import type {
    InspectionField, InspectionTemplate, InspectionRecord, InspectionPhoto,
    InspectionFieldType, RecruitmentProcess
} from '../types';
import { RecruitmentStatus } from '../types';

// ─── Local Storage helpers ────────────────────────────────────────────────────
const LS_TEMPLATES = 'safety_inspection_templates';
const LS_RECORDS   = 'safety_inspection_records';

function loadTemplates(): InspectionTemplate[] {
    try { return JSON.parse(localStorage.getItem(LS_TEMPLATES) || 'null') || DEFAULT_TEMPLATES; }
    catch { return DEFAULT_TEMPLATES; }
}
function saveTemplates(t: InspectionTemplate[]) {
    localStorage.setItem(LS_TEMPLATES, JSON.stringify(t));
}
function loadRecords(): InspectionRecord[] {
    try { return JSON.parse(localStorage.getItem(LS_RECORDS) || '[]'); }
    catch { return []; }
}
function saveRecords(r: InspectionRecord[]) {
    localStorage.setItem(LS_RECORDS, JSON.stringify(r));
}

// ─── Default Templates ────────────────────────────────────────────────────────
const DEFAULT_TEMPLATES: InspectionTemplate[] = [
    {
        id: 'tpl-1',
        equipmentType: 'Haul Truck',
        name: 'Haul Truck Pre-Shift Inspection',
        createdBy: 'Safety Department',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        isActive: true,
        fields: [
            { id: 'f1', label: 'Tyres — visual inspection (no cuts, bulges)', type: 'checkbox', required: true },
            { id: 'f2', label: 'Engine oil level', type: 'select', required: true, options: ['OK', 'Low', 'Critical'] },
            { id: 'f3', label: 'Brake system functional check', type: 'checkbox', required: true },
            { id: 'f4', label: 'Lights and indicators operational', type: 'checkbox', required: true },
            { id: 'f5', label: 'Hydraulic system pressure reading (bar)', type: 'number', required: false },
            { id: 'f6', label: 'Upload tyre photo', type: 'photo', required: false },
            { id: 'f7', label: 'Comments / Findings', type: 'textarea', required: false },
        ]
    },
    {
        id: 'tpl-2',
        equipmentType: 'Crane',
        name: 'Crane Daily Safety Inspection',
        createdBy: 'Safety Department',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        isActive: true,
        fields: [
            { id: 'f1', label: 'Hook, latch and swivel in good condition', type: 'checkbox', required: true },
            { id: 'f2', label: 'Wire rope condition (no broken strands)', type: 'checkbox', required: true },
            { id: 'f3', label: 'Boom angle indicator working', type: 'checkbox', required: true },
            { id: 'f4', label: 'Load chart posted and legible', type: 'checkbox', required: true },
            { id: 'f5', label: 'Photo of hook assembly', type: 'photo', required: true },
            { id: 'f6', label: 'SWL (Safe Working Load) visible on equipment', type: 'checkbox', required: true },
            { id: 'f7', label: 'Additional notes', type: 'textarea', required: false },
        ]
    },
    {
        id: 'tpl-3',
        equipmentType: 'Fire Extinguisher',
        name: 'Fire Extinguisher Monthly Check',
        createdBy: 'Safety Department',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        isActive: true,
        fields: [
            { id: 'f1', label: 'Extinguisher location', type: 'text', required: true, description: 'e.g. Workshop Bay A, Column 3' },
            { id: 'f2', label: 'Pressure gauge in green zone', type: 'checkbox', required: true },
            { id: 'f3', label: 'Pin and tamper seal intact', type: 'checkbox', required: true },
            { id: 'f4', label: 'Expiry date (on label)', type: 'date', required: true },
            { id: 'f5', label: 'Label legible and complete', type: 'checkbox', required: true },
            { id: 'f6', label: 'Photo of gauge', type: 'photo', required: true },
        ]
    },
    {
        id: 'tpl-4',
        equipmentType: 'Excavator',
        name: 'Excavator Pre-Shift Check',
        createdBy: 'Safety Department',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        isActive: true,
        fields: [
            { id: 'f1', label: 'Bucket teeth condition (no missing teeth)', type: 'checkbox', required: true },
            { id: 'f2', label: 'Track tension correct', type: 'checkbox', required: true },
            { id: 'f3', label: 'Swing bearing greased', type: 'checkbox', required: true },
            { id: 'f4', label: 'Hydraulic hose condition (no leaks)', type: 'checkbox', required: true },
            { id: 'f5', label: 'Hydraulic oil level (litres)', type: 'number', required: false },
            { id: 'f6', label: 'Upload photo of undercarriage', type: 'photo', required: false },
            { id: 'f7', label: 'Defects or concerns', type: 'textarea', required: false },
        ]
    }
];

// ─── Field type metadata ──────────────────────────────────────────────────────
const FIELD_TYPES: { type: InspectionFieldType; label: string; icon: React.ElementType }[] = [
    { type: 'checkbox',  label: 'Yes / No Check',   icon: CheckSquare },
    { type: 'text',      label: 'Short Text',        icon: FileText },
    { type: 'number',    label: 'Number / Reading',  icon: Hash },
    { type: 'select',    label: 'Dropdown Options',  icon: ListChecks },
    { type: 'textarea',  label: 'Long Text / Notes', icon: AlignLeft },
    { type: 'photo',     label: 'Photo Upload',      icon: Camera },
    { type: 'date',      label: 'Date Field',        icon: CalendarDays },
];

const statusColors: Record<string, string> = {
    Pass:        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    Fail:        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    Conditional: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function SafetyInspectionPage() {
    const [activeTab, setActiveTab] = useState<'builder' | 'conduct' | 'history'>('builder');
    const [templates, setTemplates] = useState<InspectionTemplate[]>(loadTemplates);
    const [records,   setRecords]   = useState<InspectionRecord[]>(loadRecords);

    // Mobilization processes for Equipment Access workflow integration
    const [processes, setProcesses] = useState<RecruitmentProcess[]>([]);
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

    React.useEffect(() => {
        try {
            const saved = localStorage.getItem('mobilization_processes');
            if (saved) {
                setProcesses(JSON.parse(saved));
            }
        } catch (e) {
            console.error(e);
        }
    }, [activeTab]);

    // Builder state
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(templates[0]?.id || null);
    const [isEditingTemplate,  setIsEditingTemplate]  = useState(false);
    const [draftTemplate,      setDraftTemplate]      = useState<InspectionTemplate | null>(null);
    const [newEquipType,       setNewEquipType]       = useState('');

    // Conduct inspection state
    const [conductTemplateId, setConductTemplateId] = useState<string>(templates[0]?.id || '');
    const [equipmentId,       setEquipmentId]       = useState('');
    const [inspectorName,     setInspectorName]     = useState('');
    const [conductSite,       setConductSite]       = useState('Main Site');
    const [responses,         setResponses]         = useState<Record<string, string | boolean>>({});
    const [photos,            setPhotos]            = useState<InspectionPhoto[]>([]);
    const [inspectionStatus,  setInspectionStatus]  = useState<'Pass' | 'Fail' | 'Conditional'>('Pass');
    const [findings,          setFindings]          = useState('');
    const [correctiveAction,  setCorrectiveAction]  = useState('');
    const [submitSuccess,     setSubmitSuccess]     = useState(false);

    // History state
    const [filterStatus,    setFilterStatus]    = useState<string>('All');
    const [filterType,      setFilterType]      = useState<string>('All');
    const [historySearch,   setHistorySearch]   = useState('');
    const [viewingRecord,   setViewingRecord]   = useState<InspectionRecord | null>(null);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const [pendingPhotoFieldId, setPendingPhotoFieldId] = useState<string>('');

    // ─── Template Builder Helpers ─────────────────────────────────────────────
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || null;

    const startNewTemplate = () => {
        const blank: InspectionTemplate = {
            id: uuidv4(),
            equipmentType: newEquipType || 'New Equipment Type',
            name: `${newEquipType || 'New Equipment'} Inspection`,
            createdBy: 'Safety Team',
            createdAt: new Date().toISOString(),
            fields: [],
            isActive: true
        };
        setDraftTemplate(blank);
        setIsEditingTemplate(true);
        setNewEquipType('');
    };

    const editTemplate = (t: InspectionTemplate) => {
        setDraftTemplate(JSON.parse(JSON.stringify(t)));
        setIsEditingTemplate(true);
    };

    const saveTemplate = () => {
        if (!draftTemplate) return;
        const updated = templates.find(t => t.id === draftTemplate.id)
            ? templates.map(t => t.id === draftTemplate.id ? draftTemplate : t)
            : [...templates, draftTemplate];
        setTemplates(updated);
        saveTemplates(updated);
        setSelectedTemplateId(draftTemplate.id);
        setIsEditingTemplate(false);
        setDraftTemplate(null);
    };

    const addField = (type: InspectionFieldType) => {
        if (!draftTemplate) return;
        const newField: InspectionField = {
            id: uuidv4(),
            label: `New ${type} field`,
            type,
            required: false,
            options: type === 'select' ? ['Option A', 'Option B'] : undefined
        };
        setDraftTemplate({ ...draftTemplate, fields: [...draftTemplate.fields, newField] });
    };

    const updateField = (id: string, changes: Partial<InspectionField>) => {
        if (!draftTemplate) return;
        setDraftTemplate({
            ...draftTemplate,
            fields: draftTemplate.fields.map(f => f.id === id ? { ...f, ...changes } : f)
        });
    };

    const removeField = (id: string) => {
        if (!draftTemplate) return;
        setDraftTemplate({ ...draftTemplate, fields: draftTemplate.fields.filter(f => f.id !== id) });
    };

    const moveField = (id: string, dir: 'up' | 'down') => {
        if (!draftTemplate) return;
        const idx = draftTemplate.fields.findIndex(f => f.id === id);
        if (dir === 'up' && idx === 0) return;
        if (dir === 'down' && idx === draftTemplate.fields.length - 1) return;
        const arr = [...draftTemplate.fields];
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
        setDraftTemplate({ ...draftTemplate, fields: arr });
    };

    const deleteTemplate = (id: string) => {
        if (!window.confirm('Delete this template permanently?')) return;
        const updated = templates.filter(t => t.id !== id);
        setTemplates(updated);
        saveTemplates(updated);
        if (selectedTemplateId === id) setSelectedTemplateId(updated[0]?.id || null);
    };

    // ─── Conduct Inspection Helpers ───────────────────────────────────────────
    const conductTemplate = templates.find(t => t.id === conductTemplateId) || null;

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !pendingPhotoFieldId) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const newPhoto: InspectionPhoto = {
                id: uuidv4(),
                fieldId: pendingPhotoFieldId,
                dataUrl: ev.target?.result as string,
                caption: file.name,
                takenAt: new Date().toISOString()
            };
            setPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const triggerPhotoUpload = (fieldId: string) => {
        setPendingPhotoFieldId(fieldId);
        setTimeout(() => photoInputRef.current?.click(), 50);
    };

    const submitInspection = () => {
        if (!conductTemplate || !equipmentId || !inspectorName) {
            alert('Please fill in Equipment ID and Inspector Name.');
            return;
        }
        const record: InspectionRecord = {
            id: uuidv4(),
            templateId: conductTemplate.id,
            equipmentType: conductTemplate.equipmentType,
            equipmentId,
            inspectorName,
            inspectedAt: new Date().toISOString(),
            site: conductSite,
            status: inspectionStatus,
            responses,
            photos,
            findings: findings || undefined,
            correctiveAction: correctiveAction || undefined,
            signedOff: false
        };
        const updated = [record, ...records];
        setRecords(updated);
        saveRecords(updated);

        // Update mobilization process if linked
        if (selectedProcessId) {
            try {
                const saved = localStorage.getItem('mobilization_processes');
                const list = saved ? JSON.parse(saved) : [];
                const nextStatus = inspectionStatus === 'Pass' ? RecruitmentStatus.SECURITY_PENDING : RecruitmentStatus.FAILED;
                const updatedList = list.map((p: RecruitmentProcess) => {
                    if (p.id === selectedProcessId) {
                        return {
                            ...p,
                            status: nextStatus,
                            safetyInspectionCleared: inspectionStatus === 'Pass',
                            safetyInspectionComments: findings || correctiveAction || 'Physical inspection completed.',
                            safetyInspectionRecordId: record.id
                        };
                    }
                    return p;
                });
                localStorage.setItem('mobilization_processes', JSON.stringify(updatedList));
                setSelectedProcessId(null);
            } catch (e) {
                console.error(e);
            }
        }

        // Reset form
        setResponses({});
        setPhotos([]);
        setEquipmentId('');
        setFindings('');
        setCorrectiveAction('');
        setInspectionStatus('Pass');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
        setActiveTab('history');
    };

    // ─── History Helpers ──────────────────────────────────────────────────────
    const filteredRecords = records.filter(r => {
        const matchStatus = filterStatus === 'All' || r.status === filterStatus;
        const matchType   = filterType === 'All' || r.equipmentType === filterType;
        const search      = historySearch.toLowerCase();
        const matchSearch = !search || r.equipmentId.toLowerCase().includes(search) ||
            r.inspectorName.toLowerCase().includes(search) ||
            r.equipmentType.toLowerCase().includes(search);
        return matchStatus && matchType && matchSearch;
    });

    const equipmentTypes = [...new Set(records.map(r => r.equipmentType))];
    const passRate = records.length
        ? Math.round((records.filter(r => r.status === 'Pass').length / records.length) * 100)
        : 0;

    const tabs = [
        { id: 'builder',  label: 'Form Builder',        icon: Edit3 },
        { id: 'conduct',  label: 'Conduct Inspection',   icon: ClipboardList },
        { id: 'history',  label: 'History & Reports',    icon: BarChart3 },
    ] as const;

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <ClipboardList size={20} className="text-white" />
                        </div>
                        Safety Inspection Module
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-14">
                        Build custom inspection forms · Conduct field inspections with photos · Track compliance history
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-center shadow-sm">
                        <div className="text-xl font-black text-slate-900 dark:text-white">{records.length}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inspections</div>
                    </div>
                    <div className={`bg-white dark:bg-slate-800 border rounded-2xl px-4 py-2.5 text-center shadow-sm ${passRate >= 80 ? 'border-emerald-200 dark:border-emerald-800' : 'border-amber-200 dark:border-amber-800'}`}>
                        <div className={`text-xl font-black ${passRate >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{passRate}%</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pass Rate</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-center shadow-sm">
                        <div className="text-xl font-black text-slate-900 dark:text-white">{templates.length}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Templates</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── FORM BUILDER ─────────────────────────────────────────────────── */}
            {activeTab === 'builder' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: equipment type list */}
                    <div className="lg:col-span-3 space-y-3">
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Layers size={11} /> Equipment Types
                            </div>
                            <div className="space-y-1.5">
                                {templates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setSelectedTemplateId(t.id); setIsEditingTemplate(false); }}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                                            selectedTemplateId === t.id && !isEditingTemplate
                                            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="font-black">{t.equipmentType}</div>
                                        <div className="text-[9px] text-slate-400 mt-0.5">{t.fields.length} fields</div>
                                    </button>
                                ))}
                            </div>

                            {/* New equipment type */}
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                                <input
                                    type="text"
                                    placeholder="New equipment type..."
                                    value={newEquipType}
                                    onChange={e => setNewEquipType(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none focus:border-orange-400 transition-all"
                                />
                                <button
                                    onClick={startNewTemplate}
                                    className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-xl transition-all"
                                >
                                    <Plus size={13} /> Create Form
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: template editor / viewer */}
                    <div className="lg:col-span-9">
                        {isEditingTemplate && draftTemplate ? (
                            /* ── EDITOR MODE ── */
                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
                                    <div className="space-y-1">
                                        <input
                                            type="text"
                                            value={draftTemplate.name}
                                            onChange={e => setDraftTemplate({ ...draftTemplate, name: e.target.value })}
                                            className="text-lg font-black text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-transparent focus:border-orange-400 transition-all"
                                        />
                                        <div className="text-[10px] text-orange-600 font-black uppercase tracking-widest">
                                            {draftTemplate.equipmentType} · {draftTemplate.fields.length} fields
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setIsEditingTemplate(false); setDraftTemplate(null); }}
                                            className="px-4 py-2 rounded-xl text-xs font-black uppercase border border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={saveTemplate}
                                            className="px-5 py-2 rounded-xl text-xs font-black uppercase bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-orange-500/20"
                                        >
                                            <Save size={13} /> Save Template
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Field list */}
                                    {draftTemplate.fields.length === 0 && (
                                        <div className="text-center py-12 text-slate-400">
                                            <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                                            <p className="text-xs">No fields yet. Add fields using the panel below.</p>
                                        </div>
                                    )}

                                    {draftTemplate.fields.map((field, idx) => (
                                        <FieldEditor
                                            key={field.id}
                                            field={field}
                                            idx={idx}
                                            total={draftTemplate.fields.length}
                                            onChange={changes => updateField(field.id, changes)}
                                            onRemove={() => removeField(field.id)}
                                            onMove={dir => moveField(field.id, dir)}
                                        />
                                    ))}

                                    {/* Add field buttons */}
                                    <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-5">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Add Field</div>
                                        <div className="flex flex-wrap gap-2">
                                            {FIELD_TYPES.map(ft => (
                                                <button
                                                    key={ft.type}
                                                    onClick={() => addField(ft.type)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold transition-all"
                                                >
                                                    <ft.icon size={12} /> {ft.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : selectedTemplate ? (
                            /* ── VIEW MODE ── */
                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900 dark:text-white">{selectedTemplate.name}</h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest">{selectedTemplate.equipmentType}</span>
                                            <span className="text-[10px] text-slate-400">{selectedTemplate.fields.length} fields</span>
                                            <span className="text-[10px] text-slate-400">by {selectedTemplate.createdBy}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteTemplate(selectedTemplate.id)}
                                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                            title="Delete template"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => editTemplate(selectedTemplate)}
                                            className="px-5 py-2 rounded-xl text-xs font-black uppercase bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-orange-500/20"
                                        >
                                            <Edit3 size={13} /> Edit Form
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-3">
                                    {selectedTemplate.fields.map((field, idx) => (
                                        <div key={field.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-black flex items-center justify-center">{idx + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{field.label}</div>
                                                {field.description && <div className="text-[10px] text-slate-400 mt-0.5">{field.description}</div>}
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    {(() => {
                                                        const ft = FIELD_TYPES.find(f => f.type === field.type);
                                                        return ft ? (
                                                            <span className="flex items-center gap-1 text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-black uppercase">
                                                                <ft.icon size={9} /> {ft.label}
                                                            </span>
                                                        ) : null;
                                                    })()}
                                                    {field.required && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-black uppercase">Required</span>}
                                                    {field.options && <span className="text-[9px] text-slate-400">{field.options.join(' / ')}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => { setConductTemplateId(selectedTemplate.id); setActiveTab('conduct'); }}
                                        className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-orange-500/20"
                                    >
                                        <ClipboardList size={16} /> Use This Form — Start Inspection
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400">
                                <Edit3 size={40} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm">Select a template on the left or create a new one</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── CONDUCT INSPECTION ───────────────────────────────────────────── */}
            {activeTab === 'conduct' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left sidebar: template + meta */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Pending Access Inspections Section */}
                        {processes.filter(p => p.status === RecruitmentStatus.SAFETY_PENDING).length > 0 && (
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-[2rem] border border-orange-200 dark:border-orange-900 p-5 shadow-sm space-y-3">
                                <div className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <AlertTriangle size={12} /> Pending Equipment Access Inspections
                                </div>
                                <div className="space-y-2">
                                    {processes.filter(p => p.status === RecruitmentStatus.SAFETY_PENDING).map(p => (
                                        <div key={p.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-orange-100 dark:border-orange-900/60 shadow-xs flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                                                    {p.equipmentType} ({p.equipmentId})
                                                </div>
                                                <div className="text-[9px] text-slate-400 mt-0.5">
                                                    Co: {p.contractorCompany || p.primeCompany}
                                                </div>
                                                {p.responsiblePersonName && (
                                                    <div className="text-[9px] text-slate-500 font-medium">
                                                        Resp: {p.responsiblePersonName}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setEquipmentId(p.equipmentId || '');
                                                    setInspectorName('Safety Inspector');
                                                    const matched = templates.find(t => t.equipmentType.toLowerCase() === (p.equipmentType || '').toLowerCase());
                                                    if (matched) setConductTemplateId(matched.id);
                                                    setSelectedProcessId(p.id);
                                                }}
                                                className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg border transition-all ${
                                                    selectedProcessId === p.id
                                                    ? 'bg-orange-600 text-white border-orange-600'
                                                    : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
                                                }`}
                                            >
                                                {selectedProcessId === p.id ? 'Inspecting...' : 'Inspect'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inspection Setup</div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Form Template</label>
                                <select
                                    value={conductTemplateId}
                                    onChange={e => { setConductTemplateId(e.target.value); setResponses({}); setPhotos([]); }}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all"
                                >
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.equipmentType} — {t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Equipment ID / Tag</label>
                                <input
                                    type="text"
                                    placeholder="e.g. TRK-001, CRN-003"
                                    value={equipmentId}
                                    onChange={e => setEquipmentId(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Inspector Name</label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={inspectorName}
                                    onChange={e => setInspectorName(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Site</label>
                                <input
                                    type="text"
                                    value={conductSite}
                                    onChange={e => setConductSite(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all"
                                />
                            </div>

                            {/* Overall status */}
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Overall Result</label>
                                <div className="flex gap-2">
                                    {(['Pass', 'Conditional', 'Fail'] as const).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setInspectionStatus(s)}
                                            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase border transition-all ${
                                                inspectionStatus === s
                                                ? s === 'Pass' ? 'bg-emerald-600 text-white border-emerald-600'
                                                    : s === 'Fail' ? 'bg-red-600 text-white border-red-600'
                                                    : 'bg-amber-500 text-white border-amber-500'
                                                : 'border-slate-200 dark:border-slate-600 text-slate-500'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(inspectionStatus === 'Fail' || inspectionStatus === 'Conditional') && (
                                <>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Findings / Defects</label>
                                        <textarea
                                            rows={3}
                                            value={findings}
                                            onChange={e => setFindings(e.target.value)}
                                            placeholder="Describe findings..."
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Corrective Action Required</label>
                                        <textarea
                                            rows={2}
                                            value={correctiveAction}
                                            onChange={e => setCorrectiveAction(e.target.value)}
                                            placeholder="Action required..."
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all resize-none"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Photos uploaded summary */}
                        {photos.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Camera size={11} /> Uploaded Photos ({photos.length})
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {photos.map(p => (
                                        <div key={p.id} className="relative group">
                                            <img src={p.dataUrl} alt={p.caption} className="w-full h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                                            <button
                                                onClick={() => setPhotos(prev => prev.filter(ph => ph.id !== p.id))}
                                                className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full items-center justify-center text-[9px] hidden group-hover:flex"
                                            >×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: the actual form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            {conductTemplate ? (
                                <>
                                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
                                        <h2 className="font-black text-slate-900 dark:text-white">{conductTemplate.name}</h2>
                                        <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mt-0.5">{conductTemplate.equipmentType}</p>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        {conductTemplate.fields.map((field, idx) => (
                                            <div key={field.id} className="border border-slate-100 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-start gap-2 flex-1">
                                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[9px] font-black flex items-center justify-center mt-0.5">{idx+1}</span>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                                {field.label}
                                                                {field.required && <span className="ml-1.5 text-[9px] text-red-500 font-black">*</span>}
                                                            </div>
                                                            {field.description && <div className="text-[10px] text-slate-400 mt-0.5">{field.description}</div>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Field input by type */}
                                                {field.type === 'checkbox' && (
                                                    <div className="flex gap-2 mt-1 ml-7">
                                                        {[true, false].map(val => (
                                                            <button
                                                                key={String(val)}
                                                                onClick={() => setResponses(r => ({ ...r, [field.id]: val }))}
                                                                className={`px-5 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                                                                    responses[field.id] === val
                                                                    ? val ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-red-600 text-white border-red-600'
                                                                    : 'border-slate-200 dark:border-slate-600 text-slate-500'
                                                                }`}
                                                            >
                                                                {val ? <><Check size={11}/> Pass / Yes</> : <><X size={11}/> Fail / No</>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {field.type === 'select' && (
                                                    <select
                                                        value={(responses[field.id] as string) || ''}
                                                        onChange={e => setResponses(r => ({ ...r, [field.id]: e.target.value }))}
                                                        className="ml-7 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all"
                                                    >
                                                        <option value="">— Select —</option>
                                                        {field.options?.map(o => <option key={o}>{o}</option>)}
                                                    </select>
                                                )}

                                                {(field.type === 'text' || field.type === 'number') && (
                                                    <input
                                                        type={field.type}
                                                        value={(responses[field.id] as string) || ''}
                                                        onChange={e => setResponses(r => ({ ...r, [field.id]: e.target.value }))}
                                                        placeholder={field.type === 'number' ? '0.00' : 'Enter value...'}
                                                        className="ml-7 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all w-full max-w-xs"
                                                    />
                                                )}

                                                {field.type === 'date' && (
                                                    <input
                                                        type="date"
                                                        value={(responses[field.id] as string) || ''}
                                                        onChange={e => setResponses(r => ({ ...r, [field.id]: e.target.value }))}
                                                        className="ml-7 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all"
                                                    />
                                                )}

                                                {field.type === 'textarea' && (
                                                    <textarea
                                                        rows={3}
                                                        value={(responses[field.id] as string) || ''}
                                                        onChange={e => setResponses(r => ({ ...r, [field.id]: e.target.value }))}
                                                        placeholder="Enter notes..."
                                                        className="ml-7 w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:border-orange-400 transition-all resize-none"
                                                    />
                                                )}

                                                {field.type === 'photo' && (
                                                    <div className="ml-7 space-y-2">
                                                        <button
                                                            onClick={() => triggerPhotoUpload(field.id)}
                                                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-xl text-xs font-black text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
                                                        >
                                                            <Camera size={14} /> Upload Photo
                                                        </button>
                                                        {photos.filter(p => p.fieldId === field.id).map(p => (
                                                            <div key={p.id} className="flex items-center gap-2">
                                                                <img src={p.dataUrl} alt={p.caption} className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                                                                <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{p.caption}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Submit */}
                                        <button
                                            onClick={submitInspection}
                                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-orange-500/20 mt-4"
                                        >
                                            <ShieldCheck size={18} /> Submit Inspection Record
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center text-slate-400">
                                    <ClipboardList size={40} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm">No templates available. Create one in the Form Builder tab.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── HISTORY ──────────────────────────────────────────────────────── */}
            {activeTab === 'history' && (
                <div className="space-y-5">
                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center gap-4 shadow-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <Search size={14} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by equipment, inspector..."
                                value={historySearch}
                                onChange={e => setHistorySearch(e.target.value)}
                                className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none"
                        >
                            <option value="All">All Statuses</option>
                            <option>Pass</option>
                            <option>Conditional</option>
                            <option>Fail</option>
                        </select>

                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none"
                        >
                            <option value="All">All Equipment</option>
                            {equipmentTypes.map(t => <option key={t}>{t}</option>)}
                        </select>

                        <div className="text-xs text-slate-400 font-bold">{filteredRecords.length} records</div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Inspections', value: records.length, color: 'text-slate-800 dark:text-white' },
                            { label: 'Passed',      value: records.filter(r => r.status === 'Pass').length,        color: 'text-emerald-600' },
                            { label: 'Conditional', value: records.filter(r => r.status === 'Conditional').length, color: 'text-amber-600' },
                            { label: 'Failed',      value: records.filter(r => r.status === 'Fail').length,        color: 'text-red-600' },
                        ].map(s => (
                            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 p-4 shadow-sm text-center">
                                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Records table */}
                    {filteredRecords.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400">
                            <BarChart3 size={40} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm">No inspection records yet. Conduct your first inspection.</p>
                            <button
                                onClick={() => setActiveTab('conduct')}
                                className="mt-4 px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-all"
                            >
                                Start Inspection
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            {['Date & Time', 'Equipment Type', 'Equipment ID', 'Inspector', 'Site', 'Status', 'Photos', ''].map(h => (
                                                <th key={h} className="text-left px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRecords.map(record => (
                                            <tr key={record.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <div className="font-bold text-slate-800 dark:text-slate-200">{new Date(record.inspectedAt).toLocaleDateString()}</div>
                                                    <div className="text-[10px] text-slate-400">{new Date(record.inspectedAt).toLocaleTimeString()}</div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-lg">{record.equipmentType}</span>
                                                </td>
                                                <td className="px-5 py-3.5 font-black text-slate-900 dark:text-white">{record.equipmentId}</td>
                                                <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-bold">{record.inspectorName}</td>
                                                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{record.site || '—'}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase ${statusColors[record.status]}`}>
                                                        {record.status === 'Pass' ? '✓ ' : record.status === 'Fail' ? '✗ ' : '⚠ '}{record.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {record.photos.length > 0 && (
                                                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                                                            <Camera size={11} /> {record.photos.length}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => setViewingRecord(record)}
                                                        className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                                                    >
                                                        <Eye size={11} /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden photo file input */}
            <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
            />

            {/* ── Record Detail Modal ───────────────────────────────────────── */}
            {viewingRecord && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingRecord(null)}>
                    <div
                        className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="sticky top-0 px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 rounded-t-[2rem]">
                            <div>
                                <div className="font-black text-slate-900 dark:text-white">{viewingRecord.equipmentType} — {viewingRecord.equipmentId}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                    {new Date(viewingRecord.inspectedAt).toLocaleString()} · {viewingRecord.inspectorName}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-black px-3 py-1.5 rounded-full ${statusColors[viewingRecord.status]}`}>
                                    {viewingRecord.status}
                                </span>
                                <button onClick={() => setViewingRecord(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                    <X size={16} className="text-slate-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Responses */}
                            <div className="space-y-3">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inspection Responses</div>
                                {Object.entries(viewingRecord.responses).map(([fieldId, value]) => {
                                    const tpl = templates.find(t => t.id === viewingRecord.templateId);
                                    const field = tpl?.fields.find(f => f.id === fieldId);
                                    return (
                                        <div key={fieldId} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{field?.label || fieldId}</span>
                                            <span className={`text-xs font-black ${
                                                value === true ? 'text-emerald-600' :
                                                value === false ? 'text-red-600' : 'text-slate-800 dark:text-white'
                                            }`}>
                                                {value === true ? '✓ Pass/Yes' : value === false ? '✗ Fail/No' : String(value)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Photos */}
                            {viewingRecord.photos.length > 0 && (
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Camera size={11}/> Photos ({viewingRecord.photos.length})</div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {viewingRecord.photos.map(p => (
                                            <div key={p.id}>
                                                <img src={p.dataUrl} alt={p.caption} className="w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                                                <div className="text-[9px] text-slate-400 mt-1 truncate">{p.caption}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Findings */}
                            {viewingRecord.findings && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1.5"><AlertTriangle size={11}/> Findings</div>
                                    <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">{viewingRecord.findings}</p>
                                </div>
                            )}
                            {viewingRecord.correctiveAction && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                                    <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Corrective Action</div>
                                    <p className="text-xs text-red-800 dark:text-red-200 font-medium">{viewingRecord.correctiveAction}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success toast */}
            {submitSuccess && (
                <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
                    <ShieldCheck size={20} />
                    <span className="font-black text-sm">Inspection Submitted Successfully!</span>
                </div>
            )}
        </div>
    );
}

// ─── Field Editor Sub-component ───────────────────────────────────────────────
function FieldEditor({
    field, idx, total, onChange, onRemove, onMove
}: React.Attributes & {
    field: InspectionField;
    idx: number;
    total: number;
    onChange: (c: Partial<InspectionField>) => void;
    onRemove: () => void;
    onMove: (dir: 'up' | 'down') => void;
}) {
    const ft = FIELD_TYPES.find(f => f.type === field.type);
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="border border-slate-200 dark:border-slate-600 rounded-2xl overflow-hidden">
            <div
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                onClick={() => setExpanded(!expanded)}
            >
                <GripVertical size={14} className="text-slate-300 shrink-0" />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {ft && <ft.icon size={13} className="text-orange-500 shrink-0" />}
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{field.label}</span>
                    {field.required && <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded font-black shrink-0">Required</span>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <button onClick={e => { e.stopPropagation(); onMove('up'); }} disabled={idx === 0} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-all">
                        <ChevronUp size={13} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); onMove('down'); }} disabled={idx === total - 1} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-all">
                        <ChevronDown size={13} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); onRemove(); }} className="p-1 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        <Trash2 size={13} />
                    </button>
                    {expanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
                </div>
            </div>

            {expanded && (
                <div className="px-4 pb-4 pt-2 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 space-y-3">
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Label / Question</label>
                        <input
                            type="text"
                            value={field.label}
                            onChange={e => onChange({ label: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none focus:border-orange-400 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Helper text (optional)</label>
                        <input
                            type="text"
                            value={field.description || ''}
                            onChange={e => onChange({ description: e.target.value })}
                            placeholder="e.g. Check for wear marks..."
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none focus:border-orange-400 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Field Type</label>
                            <select
                                value={field.type}
                                onChange={e => onChange({ type: e.target.value as InspectionFieldType })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none"
                            >
                                {FIELD_TYPES.map(ft => <option key={ft.type} value={ft.type}>{ft.label}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id={`req-${field.id}`}
                                checked={field.required}
                                onChange={e => onChange({ required: e.target.checked })}
                                className="w-4 h-4 accent-orange-500"
                            />
                            <label htmlFor={`req-${field.id}`} className="text-xs font-bold text-slate-600 dark:text-slate-400">Required</label>
                        </div>
                    </div>

                    {field.type === 'select' && (
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Options (comma separated)</label>
                            <input
                                type="text"
                                value={(field.options || []).join(', ')}
                                onChange={e => onChange({ options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="Option A, Option B, Option C"
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold outline-none focus:border-orange-400 transition-all"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
