import React, { useState, useEffect } from 'react';
import { 
    Users, Briefcase, FileText, ShieldAlert, CheckCircle2, AlertTriangle, 
    Send, Smartphone, Mail, Download, ShieldCheck, HelpCircle, 
    Upload, File, Check, RefreshCw, BadgeAlert, Plus, Trash2, Calendar, 
    Heart, Eye, Activity, Info, Clock, CheckSquare, Square, ChevronRight, UserMinus
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMessages } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/databaseService';
import { DEMO_RECRUITMENT_PROCESSES } from '../mockData';
import { RecruitmentProcess, RecruitmentStatus, RecruitDocument, MedicalExam, Employee, BookingStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

const MobilizationDashboard: React.FC = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const { addMessage } = useMessages();
    
    // Core Workflow State
    const [processes, setProcesses] = useState<RecruitmentProcess[]>(() => {
        const saved = localStorage.getItem('mobilization_processes');
        return saved ? JSON.parse(saved) : DEMO_RECRUITMENT_PROCESSES;
    });

    // Active tab in Mobilization: 'AM' | 'HR' | 'Security' | 'Clinic' | 'Environment'
    const [activeTab, setActiveTab] = useState<'AM' | 'HR' | 'Security' | 'Clinic' | 'Environment'>('AM');

    // UI States
    const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
    const [newRequest, setNewRequest] = useState({
        candidateName: '',
        candidateEmail: '',
        candidatePhone: '',
        company: 'Vulcan Resources Mozambique',
        department: 'Mine Operations',
        role: 'Operator',
        requiredRacs: [] as string[]
    });

    // HR Upload Simulations State
    const [hrUploads, setHrUploads] = useState<{ id: boolean; passport: boolean; permit: boolean }>({ id: false, passport: false, permit: false });
    const [hrUploading, setHrUploading] = useState<{ id: boolean; passport: boolean; permit: boolean }>({ id: false, passport: false, permit: false });

    // Security State
    const [badgeNo, setBadgeNo] = useState('');

    // Clinic Medical State
    const [medBP, setMedBP] = useState('120/80');
    const [medHR, setMedHR] = useState(72);
    const [medVision, setMedVision] = useState<'Pass' | 'Fail'>('Pass');
    const [medDrugs, setMedDrugs] = useState<'Negative' | 'Positive'>('Negative');
    const [medFit, setMedFit] = useState(true);
    const [medComments, setMedComments] = useState('');
    const [inductionDate, setInductionDate] = useState('');

    // Environment Induction Checklist
    const [indGeneral, setIndGeneral] = useState(false);
    const [indEnv, setIndEnv] = useState(false);
    const [indEvac, setIndEvac] = useState(false);
    const [indPPE, setIndPPE] = useState(false);

    // Persist processes state
    useEffect(() => {
        localStorage.setItem('mobilization_processes', JSON.stringify(processes));
    }, [processes]);

    const activeProcess = processes.find(p => p.id === selectedProcessId);

    // Auto-select first process for details if none selected
    useEffect(() => {
        if (!selectedProcessId && processes.length > 0) {
            setSelectedProcessId(processes[0].id);
        }
    }, [processes, selectedProcessId]);

    // Available RAC categories
    const AVAILABLE_RACS = [
        { code: 'RAC01', name: 'RAC 01 - Working at Height' },
        { code: 'RAC02', name: 'RAC 02 - Vehicles & Mobile Eq.' },
        { code: 'RAC03', name: 'RAC 03 - Energy Isolation (LOTO)' },
        { code: 'RAC05', name: 'RAC 05 - Confined Spaces' },
        { code: 'RAC08', name: 'RAC 08 - Electrical Safety' },
        { code: 'RAC11', name: 'RAC 11 - Mine Traffic Rules' },
        { code: 'PTS', name: 'PTS - Work Permit Issuer' },
        { code: 'ART', name: 'ART - Risk Assessment' }
    ];

    // Helper: Determine bottleneck department and responsible party
    const getBottleneckInfo = (status: RecruitmentStatus) => {
        switch(status) {
            case RecruitmentStatus.AM_REQUESTED:
                return { dept: 'HR Department', role: 'HR Specialist', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
            case RecruitmentStatus.HR_PENDING:
                return { dept: 'HR Department', role: 'HR Specialist', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
            case RecruitmentStatus.SECURITY_PENDING:
                return { dept: 'Security Office', role: 'Security Controller', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
            case RecruitmentStatus.CLINIC_PENDING:
                return { dept: 'Occupational Clinic', role: 'Clinic Doctor', bg: 'bg-red-500/10 text-red-500 border-red-500/20' };
            case RecruitmentStatus.INDUCTION_PENDING:
                return { dept: 'Environment / HSE', role: 'Safety Inductor', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
            case RecruitmentStatus.TRAINING_PENDING:
                return { dept: 'CARS Training System', role: 'RAC Training Lead', bg: 'bg-violet-500/10 text-violet-500 border-violet-500/20' };
            case RecruitmentStatus.COMPLETED:
                return { dept: 'Area Manager', role: 'Area Manager (Receipt confirmation)', bg: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
            case RecruitmentStatus.RECEIVED:
                return { dept: 'None', role: 'Mobilized', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/10' };
        }
    };

    // Stage descriptions
    const getStageNumber = (status: RecruitmentStatus): number => {
        switch(status) {
            case RecruitmentStatus.AM_REQUESTED: return 1;
            case RecruitmentStatus.HR_PENDING: return 2;
            case RecruitmentStatus.SECURITY_PENDING: return 3;
            case RecruitmentStatus.CLINIC_PENDING: return 4;
            case RecruitmentStatus.INDUCTION_PENDING: return 4; // Induction sits between clinic check and training
            case RecruitmentStatus.TRAINING_PENDING: return 5;
            case RecruitmentStatus.COMPLETED: return 5; // Certificate passed, Stage 5 completed
            case RecruitmentStatus.RECEIVED: return 6; // Confirmed receipt
        }
    };

    // --- WORKFLOW ACTIONS ---

    // Stage 1: Area Manager requests recruit
    const handleCreateRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRequest.candidateName || !newRequest.candidateEmail) return;

        const newEmpId = `emp-${uuidv4().slice(0, 8)}`;
        const recordId = `VUL-${newRequest.company.toLowerCase().includes('mota') ? 'ME' : newRequest.company.toLowerCase().includes('belabel') ? 'BL' : 'VUL'}-${Math.floor(1000 + Math.random() * 9000)}`;

        const requestObj: RecruitmentProcess = {
            id: `rp-${uuidv4().slice(0, 8)}`,
            candidateName: newRequest.candidateName,
            candidateEmail: newRequest.candidateEmail,
            candidatePhone: newRequest.candidatePhone || '+258 84 000 0000',
            company: newRequest.company,
            department: newRequest.department,
            role: newRequest.role,
            requiredRacs: newRequest.requiredRacs,
            status: RecruitmentStatus.AM_REQUESTED, // Start at Stage 1: Requisition
            requestedBy: user?.name || 'Area Manager',
            requestedAt: new Date().toISOString(),
            documents: [],
            nudgeCount: 0,
            employeeId: newEmpId,
            recordId: recordId
        };

        const updated = [requestObj, ...processes];
        setProcesses(updated);
        setSelectedProcessId(requestObj.id);
        setIsAddRequestOpen(false);
        setNewRequest({
            candidateName: '',
            candidateEmail: '',
            candidatePhone: '',
            company: 'Vulcan Resources Mozambique',
            department: 'Mine Operations',
            role: 'Operator',
            requiredRacs: []
        });

        // Trigger autonomous email notification from system to HR
        addMessage({
            type: 'EMAIL',
            recipient: 'hr.specialist@vulcan.co.mz',
            recipientName: 'HR Specialist',
            subject: `ACTION REQUIRED: New Recruitment Requested - ${requestObj.candidateName}`,
            content: `Dear HR Onboarding Team,\n\nArea Manager ${requestObj.requestedBy} has submitted a mobilization request for candidate ${requestObj.candidateName} as a ${requestObj.role} in ${requestObj.department}.\n\nPlease log in to the CARS Onboarding portal, accept the requisition, and start the recruitment process to verify documents.\n\nBest regards,\nCARS Automated Onboarding Gateway`
        });

        db.addLog('INFO', `RECRUITMENT_REQUISITION: ${requestObj.candidateName} requested by ${requestObj.requestedBy}`, user?.name || 'AM');
    };

    // Nudge Action: Area Manager pushes responsible department
    const handleNudge = (id: string) => {
        const process = processes.find(p => p.id === id);
        if (!process) return;

        const bottleneck = getBottleneckInfo(process.status);
        const nudgeCount = (process.nudgeCount || 0) + 1;

        const updated = processes.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    nudgeCount,
                    lastNudgeAt: new Date().toISOString()
                };
            }
            return p;
        });

        setProcesses(updated);

        // Send simulated notification based on bottleneck
        let recipientContact = '';
        let recipientName = bottleneck.role;
        let content = '';

        if (process.status === RecruitmentStatus.HR_PENDING || process.status === RecruitmentStatus.AM_REQUESTED) {
            recipientContact = 'hr.onboarding@vulcan.co.mz';
            content = `URGENT REMINDER: Area Manager is waiting for HR document verification for recruit ${process.candidateName}. Please complete document uploads.`;
        } else if (process.status === RecruitmentStatus.SECURITY_PENDING) {
            recipientContact = 'security.badge@vulcan.co.mz';
            content = `URGENT REMINDER: Temporary access badge is pending for recruit ${process.candidateName}. Please issue badge credentials.`;
        } else if (process.status === RecruitmentStatus.CLINIC_PENDING) {
            recipientContact = 'clinic.medicals@vulcan.co.mz';
            content = `URGENT REMINDER: Occupational medical clearance exam is pending for ${process.candidateName}. Please schedule clinical checks.`;
        } else if (process.status === RecruitmentStatus.INDUCTION_PENDING) {
            recipientContact = 'hse.induction@vulcan.co.mz';
            content = `URGENT REMINDER: Site HSE/Environment induction is pending for recruit ${process.candidateName}. Please certify physical orientation.`;
        } else if (process.status === RecruitmentStatus.TRAINING_PENDING) {
            recipientContact = 'training.center@vulcan.co.mz';
            content = `SYSTEM REMINDER: Recruit ${process.candidateName} is scheduled for RACS trainings. Please synchronize passed test credentials.`;
        }

        addMessage({
            type: 'EMAIL',
            recipient: recipientContact,
            recipientName: recipientName,
            subject: `EXPEDITE REMINDER: Onboarding Pending - ${process.candidateName}`,
            content: `Dear ${recipientName},\n\nThis is an automated reminder regarding the onboarding pipeline for ${process.candidateName}.\n\nStage: ${process.status}\nRequested By: ${process.requestedBy}\nNudge Level: #${nudgeCount}\n\nArea Manager has requested that you process your department's actions as a matter of priority.\n\nMessage Detail:\n"${content}"\n\nAccess the portal: http://localhost:3000/#/recruitment\n\nThank you,\nOnboarding Tracking Service`
        });

        db.addLog('WARN', `AM_NUDGE_TRIGGERED: Target ${bottleneck.role} for ${process.candidateName}`, user?.name || 'AM');
    };

    // Stage 1 -> Stage 2: HR accepts the requisition request
    const handleAcceptRequisition = (id: string) => {
        const process = processes.find(p => p.id === id);
        if (!process) return;

        const updated = processes.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: RecruitmentStatus.HR_PENDING
                };
            }
            return p;
        });

        setProcesses(updated);

        // Notify HR onboarding specialist
        addMessage({
            type: 'EMAIL',
            recipient: 'hr.specialist@vulcan.co.mz',
            recipientName: 'HR Specialist',
            subject: `ONBOARDING STARTED: Requisition Accepted - ${process.candidateName}`,
            content: `Dear Area Manager,\n\nHR has accepted your recruitment request for ${process.candidateName}. The onboarding process has officially started and we are now verifying identification documents.\n\nBest regards,\nHR Department`
        });

        db.addLog('INFO', `REQUISITION_ACCEPTED: Onboarding started for ${process.candidateName}`, 'HR Department');
    };

    // Stage 2: HR completes upload and review
    const handleSimulateUpload = (id: string, docType: 'id' | 'passport' | 'permit') => {
        const process = processes.find(p => p.id === id);
        if (!process) return;

        setHrUploading(prev => ({ ...prev, [docType]: true }));
        setTimeout(() => {
            setHrUploading(prev => ({ ...prev, [docType]: false }));
            
            const docName = `${process.candidateName.toLowerCase().replace(/\s+/g, '_')}_${docType === 'id' ? 'national_id' : docType === 'passport' ? 'passport' : 'work_permit'}.pdf`;
            const docTypeMapped: 'ID' | 'Passport' | 'Work Permit' = docType === 'id' ? 'ID' : docType === 'passport' ? 'Passport' : 'Work Permit';
            const newDoc: RecruitDocument = {
                name: docName,
                type: docTypeMapped,
                uploadedAt: new Date().toISOString(),
                fileSize: docType === 'passport' ? '2.9 MB' : docType === 'permit' ? '1.7 MB' : '1.4 MB',
                status: 'Verified'
            };

            setProcesses(prev => prev.map(p => {
                if (p.id === id) {
                    const filteredDocs = (p.documents || []).filter(d => d.type !== docTypeMapped);
                    return {
                        ...p,
                        documents: [...filteredDocs, newDoc]
                    };
                }
                return p;
            }));
        }, 1200);
    };

    const handleCompleteHR = (id: string) => {
        const process = processes.find(p => p.id === id);
        if (!process) return;

        if (!process.documents || process.documents.length === 0) {
            alert('Please upload at least one document to proceed.');
            return;
        }

        const updated = processes.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: RecruitmentStatus.SECURITY_PENDING
                };
            }
            return p;
        });

        setProcesses(updated);

        // Trigger autonomous notification to Security
        addMessage({
            type: 'EMAIL',
            recipient: 'security.turnstiles@vulcan.co.mz',
            recipientName: 'Security Access Control',
            subject: `ACTION REQUIRED: Issue Access Card - ${process.candidateName}`,
            content: `Dear Security Department,\n\nHR documentation has been uploaded and verified for new recruit ${process.candidateName} (${process.company}).\n\nPlease log in to the CARS Security Portal to assign a Temporary Access Card / Badge Number to enable access for clinic checkups and HSE inductions.\n\nBest regards,\nCARS Automated Onboarding Gateway`
        });

        db.addLog('INFO', `HR_STAGE_COMPLETED: Docs verified for ${process.candidateName}`, 'HR Department');
    };

    // Stage 3: Security issues temporary badge
    const handleIssueBadge = (id: string) => {
        if (!badgeNo.trim()) {
            alert('Please enter a Temporary Badge Number.');
            return;
        }

        const process = processes.find(p => p.id === id);
        if (!process) return;

        const updated = processes.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: RecruitmentStatus.CLINIC_PENDING,
                    temporaryBadgeNumber: badgeNo
                };
            }
            return p;
        });

        setProcesses(updated);
        setBadgeNo('');

        // Trigger autonomous message to Clinic
        addMessage({
            type: 'EMAIL',
            recipient: 'mine.clinic@vulcan.co.mz',
            recipientName: 'Occupational Health Clinic',
            subject: `ACTION REQUIRED: Medical Clearance Request - ${process.candidateName}`,
            content: `Dear Clinical Staff,\n\nTemporary site access badge (${badgeNo}) has been issued for recruit ${process.candidateName}.\n\nThe candidate is authorized to report to the Medical Center for physical suitability evaluation, drug screening, and vital checks.\n\nUpon examination, please log in to record fitness-for-work status and schedule the HSE/Environment induction.\n\nBest regards,\nCARS Onboarding Gateway`
        });

        db.addLog('INFO', `SECURITY_ACCESS_GRANTED: Badge ${badgeNo} registered for ${process.candidateName}`, 'Security Department');
    };

    // Stage 4: Clinic clearance & Induction Booking
    const handleCompleteClinic = (id: string) => {
        if (!inductionDate) {
            alert('Please specify a date for the Safety/Environment Induction.');
            return;
        }

        const process = processes.find(p => p.id === id);
        if (!process) return;

        const medicalExam: MedicalExam = {
            bloodPressure: medBP,
            heartRate: Number(medHR),
            visionTest: medVision,
            drugScreen: medDrugs,
            fitForWork: medFit,
            checkedAt: new Date().toISOString(),
            comments: medComments || 'Vitals cleared by clinical doctor.'
        };

        const updated = processes.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: RecruitmentStatus.INDUCTION_PENDING,
                    medicalExam,
                    inductionDate
                };
            }
            return p;
        });

        setProcesses(updated);
        setMedBP('120/80');
        setMedHR(72);
        setMedVision('Pass');
        setMedDrugs('Negative');
        setMedFit(true);
        setMedComments('');
        setInductionDate('');

        // Send simulated notification to HSE / Environment
        addMessage({
            type: 'EMAIL',
            recipient: 'hse.inductions@vulcan.co.mz',
            recipientName: 'HSE Environment Team',
            subject: `ACTION REQUIRED: HSE Induction Scheduled - ${process.candidateName}`,
            content: `Dear Environment & Safety Team,\n\nRecruit ${process.candidateName} has passed clinical evaluation (Medical clearance fit-for-work verified) and is scheduled for Site HSE Induction on ${inductionDate}.\n\nPlease coordinate the physical orientation session. Confirm safety guidelines compliance, environmental rules, and PPE issuance inside the Environment portal upon completion.\n\nBest regards,\nCARS Onboarding Coordinator`
        });

        db.addLog('INFO', `CLINIC_EXAM_COMPLETED: Fit-for-work cleared for ${process.candidateName}`, 'Occupational Clinic');
    };

    // Stage 5a: Environment Induction sign-off
    const handleConfirmInduction = (id: string) => {
        if (!indGeneral || !indEnv || !indEvac || !indPPE) {
            alert('All safety orientation steps must be verified and checked.');
            return;
        }

        const process = processes.find(p => p.id === id);
        if (!process) return;

        const updated = processes.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: RecruitmentStatus.TRAINING_PENDING,
                    inductionConfirmed: true
                };
            }
            return p;
        });

        setProcesses(updated);
        setIndGeneral(false);
        setIndEnv(false);
        setIndEvac(false);
        setIndPPE(false);

        // Notify RACS / CARS Training Department
        addMessage({
            type: 'EMAIL',
            recipient: 'cars.training@vulcan.co.mz',
            recipientName: 'CARS Training Coordinator',
            subject: `ACTION REQUIRED: Initialize RAC Certification - ${process.candidateName}`,
            content: `Dear CARS Training Administrator,\n\nCandidate ${process.candidateName} has successfully completed safety and environmental induction.\n\nThe required RAC training modules requested for this employee are: ${process.requiredRacs.join(', ') || 'General Safety'}.\n\nPlease schedule training evaluation sessions. Once training scores are logged and passed, the certificate will be made available for download.\n\nBest regards,\nCARS Automated Onboarding Gateway`
        });

        db.addLog('INFO', `HSE_INDUCTION_COMPLETED: Safety checklist certified for ${process.candidateName}`, 'Environment & HSE');
    };

    // Helper: Register the recruit as an active employee in the CARS system database
    const registerProcessInDatabase = async (p: RecruitmentProcess) => {
        const empId = p.employeeId || `emp-${uuidv4().slice(0, 8)}`;
        const recordId = p.recordId || `VUL-${p.company.includes('Mota') ? 'ME' : p.company.includes('Belabel') ? 'BL' : 'VUL'}-${Math.floor(1000 + Math.random() * 9000)}`;

        const employeePayload: Employee = {
            id: empId,
            name: p.candidateName,
            recordId: recordId,
            company: p.company,
            department: p.department,
            role: p.role,
            isActive: true,
            siteId: 's-moatize',
            phoneNumber: p.candidatePhone
        };

        const newBookings: any[] = [];
        const requiredRacsObject: Record<string, boolean> = {};

        p.requiredRacs.forEach((rac, index) => {
            requiredRacsObject[rac] = true;
            newBookings.push({
                id: `bk-auto-${uuidv4().slice(0, 8)}`,
                sessionId: `sess-${rac.toLowerCase()}-${index}`,
                employee: employeePayload,
                status: BookingStatus.PASSED,
                resultDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(Date.now() + 365 * 2 * 24 * 3600000).toISOString().split('T')[0], // 2 years validity
                attendance: true,
                theoryScore: 95,
                practicalScore: 95,
                driverLicenseVerified: true
            });
        });

        await db.bulkUpsertEmployees([employeePayload]);
        await db.bulkUpsertBookings(newBookings);
        await db.bulkUpsertRequirements([{
            employeeId: empId,
            asoExpiryDate: new Date(Date.now() + 365 * 24 * 3600000).toISOString().split('T')[0], // 1 year ASO
            requiredRacs: requiredRacsObject
        }]);

        return { empId, recordId };
    };

    // Stage 5b: Simulate CARS RAC training completion (Passed certification)
    const handleSimulateTraining = async (id: string) => {
        const process = processes.find(p => p.id === id);
        if (!process) return;

        try {
            const { empId, recordId } = await registerProcessInDatabase(process);

            // Update process status to COMPLETED
            const updated = processes.map(p => {
                if (p.id === id) {
                    return {
                        ...p,
                        status: RecruitmentStatus.COMPLETED,
                        trainingCompletedAt: new Date().toISOString(),
                        employeeId: empId,
                        recordId: recordId
                    };
                }
                return p;
            });
            setProcesses(updated);

            // Send process complete notification to Area Manager
            addMessage({
                type: 'EMAIL',
                recipient: 'area.manager@vulcan.co.mz',
                recipientName: process.requestedBy,
                subject: `SUCCESS: Onboarding & RAC Training Complete - ${process.candidateName}`,
                content: `Dear ${process.requestedBy},\n\nWe are pleased to inform you that the onboarding process and mandatory RAC certifications for ${process.candidateName} have been completed successfully.\n\nSummary of Credentials:\n- HR Verification: PASSED\n- Security Access: ACTIVE (Badge ${process.temporaryBadgeNumber})\n- Clinic Medical Check: CLEARED Fit-for-Work\n- HSE Site Induction: SIGNED OFF\n- CARS RAC Modules: PASSED (${process.requiredRacs.join(', ') || 'N/A'})\n\nYou can now log in to the CARS Mobilization dashboard to download the Final Certificate and confirm the official receipt of the employee.\n\nKeep working safely,\nCARS Training & Compliance System`
            });

            db.addLog('INFO', `CARS_TRAINING_PASSED: Certified for ${process.candidateName}`, 'CARS System');

        } catch (e) {
            console.error('Error simulating training sync', e);
        }
    };

    // Stage 6: Area Manager confirms receipt of employee (Final Promotion)
    const handleConfirmReceipt = async (id: string) => {
        const process = processes.find(p => p.id === id);
        if (!process) return;

        try {
            const { empId, recordId } = await registerProcessInDatabase(process);

            const updated = processes.map(p => {
                if (p.id === id) {
                    return {
                        ...p,
                        status: RecruitmentStatus.RECEIVED,
                        receivedAt: new Date().toISOString(),
                        employeeId: empId,
                        recordId: recordId
                    };
                }
                return p;
            });

            setProcesses(updated);

            // SMS notification to the recruit
            addMessage({
                type: 'SMS',
                recipient: process.candidatePhone,
                recipientName: process.candidateName,
                content: `CARS ACCESS NOTICE: Welcome ${process.candidateName}! Your mobilization has been finalized. Your temporary badge ${process.temporaryBadgeNumber} is now fully activated for site entry. Report to ${process.department} supervisor.`
            });

            db.addLog('AUDIT', `EMPLOYEE_MOBILIZATION_SUCCESS: ${process.candidateName} fully onboarded and received`, 'Area Manager');
            alert(`${process.candidateName} is now officially registered, active, and fully authorized in the CARS system!`);
        } catch (e) {
            console.error('Error confirming receipt', e);
        }
    };

    // Fast-track selected recruit through all stages autonomously
    const handleFastTrack = async (id: string) => {
        const process = processes.find(p => p.id === id);
        if (!process) return;

        if (process.status === RecruitmentStatus.RECEIVED) return;

        try {
            // 1. Generate verified HR docs
            const docs: RecruitDocument[] = process.documents.length > 0 ? process.documents : [
                { name: `${process.candidateName.toLowerCase().replace(/\s+/g, '_')}_national_id.pdf`, type: 'ID', uploadedAt: new Date().toISOString(), fileSize: '1.4 MB', status: 'Verified' },
                { name: `${process.candidateName.toLowerCase().replace(/\s+/g, '_')}_passport.pdf`, type: 'Passport', uploadedAt: new Date().toISOString(), fileSize: '2.9 MB', status: 'Verified' }
            ];

            // 2. Issue temporary Security Access badge
            const badge = process.temporaryBadgeNumber || `TEMP-ACCESS-${Math.floor(1000 + Math.random() * 9000)}`;

            // 3. Complete Occupational Clinic Medical checkup
            const medicalExam: MedicalExam = process.medicalExam || {
                bloodPressure: '120/80',
                heartRate: 72,
                visionTest: 'Pass',
                drugScreen: 'Negative',
                fitForWork: true,
                checkedAt: new Date().toISOString(),
                comments: 'Fit-for-work cleared automatically via fast track.'
            };

            const updatedProcessObj = {
                ...process,
                documents: docs,
                temporaryBadgeNumber: badge,
                medicalExam,
                inductionConfirmed: true
            };

            const { empId, recordId } = await registerProcessInDatabase(updatedProcessObj);

            // Add autonomous notification alerts
            addMessage({
                type: 'EMAIL',
                recipient: 'hr.specialist@vulcan.co.mz',
                recipientName: 'HR Specialist',
                subject: `ACTION REQUIRED: New Recruitment Requested - ${process.candidateName}`,
                content: `Area Manager Hélio Tembe requested mobilization for ${process.candidateName}.`
            });
            addMessage({
                type: 'EMAIL',
                recipient: 'security.turnstiles@vulcan.co.mz',
                recipientName: 'Security Access Control',
                subject: `ACTION REQUIRED: Issue Access Card - ${process.candidateName}`,
                content: `HR documentation uploaded. Temporary Access Card assignment pending for ${process.candidateName}.`
            });
            addMessage({
                type: 'EMAIL',
                recipient: 'mine.clinic@vulcan.co.mz',
                recipientName: 'Occupational Health Clinic',
                subject: `ACTION REQUIRED: Medical Clearance Request - ${process.candidateName}`,
                content: `Access Card ${badge} assigned. Medical evaluation pending for ${process.candidateName}.`
            });
            addMessage({
                type: 'EMAIL',
                recipient: 'hse.inductions@vulcan.co.mz',
                recipientName: 'HSE Environment Team',
                subject: `ACTION REQUIRED: HSE Induction Scheduled - ${process.candidateName}`,
                content: `Medical cleared. Safety and environmental induction scheduled for ${process.candidateName}.`
            });
            addMessage({
                type: 'EMAIL',
                recipient: 'cars.training@vulcan.co.mz',
                recipientName: 'CARS Training Coordinator',
                subject: `ACTION REQUIRED: Initialize RAC Certification - ${process.candidateName}`,
                content: `Site Induction passed. Certifying RAC compliance training for ${process.candidateName}.`
            });
            addMessage({
                type: 'EMAIL',
                recipient: 'area.manager@vulcan.co.mz',
                recipientName: process.requestedBy,
                subject: `SUCCESS: Onboarding & RAC Training Complete - ${process.candidateName}`,
                content: `Dear ${process.requestedBy},\n\nWe are pleased to inform you that onboarding and compliance modules for ${process.candidateName} have been completed successfully. final credentials certificate is ready.`
            });
            addMessage({
                type: 'SMS',
                recipient: process.candidatePhone,
                recipientName: process.candidateName,
                content: `CARS ACCESS: Welcome ${process.candidateName}! Onboarding finalized. Badge ${badge} is now active.`
            });

            // 5. Update process state
            setProcesses(prev => prev.map(p => {
                if (p.id === id) {
                    return {
                        ...p,
                        status: RecruitmentStatus.RECEIVED,
                        documents: docs,
                        temporaryBadgeNumber: badge,
                        medicalExam,
                        inductionConfirmed: true,
                        trainingCompletedAt: new Date().toISOString(),
                        receivedAt: new Date().toISOString(),
                        employeeId: empId,
                        recordId: recordId
                    };
                }
                return p;
            }));

            db.addLog('AUDIT', `FAST_TRACK_ONBOARDING: ${process.candidateName} fully onboarded via automation`, 'System');
        } catch (e) {
            console.error('Error fast tracking candidate', e);
        }
    };

    // Fast-track all pending candidates in list
    const handleFastTrackAll = async () => {
        if (!window.confirm('Fast-track all pending candidates to received status and activate them in CARS database?')) return;
        
        let count = 0;
        for (const p of processes) {
            if (p.status !== RecruitmentStatus.RECEIVED) {
                await handleFastTrack(p.id);
                count++;
            }
        }
        alert(`Successfully fast-tracked ${count} pending candidates through all onboarding, medicals, HSE orientation, and RAC training certifications!`);
    };

    // Clean process (for presentation reset)
    const handleResetProcesses = () => {
        if (window.confirm('Reset mobilization workflow to demo defaults?')) {
            localStorage.removeItem('mobilization_processes');
            setProcesses(DEMO_RECRUITMENT_PROCESSES);
            setSelectedProcessId(DEMO_RECRUITMENT_PROCESSES[0].id);
        }
    };

    // Remove candidate
    const handleDeleteProcess = (id: string) => {
        if (window.confirm('Remove this candidate from the recruitment pipeline?')) {
            const updated = processes.filter(p => p.id !== id);
            setProcesses(updated);
            if (selectedProcessId === id && updated.length > 0) {
                setSelectedProcessId(updated[0].id);
            } else if (updated.length === 0) {
                setSelectedProcessId(null);
            }
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            {/* Header banner */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-indigo-800/40">
                <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg border border-indigo-400/20">
                            <Users size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight uppercase italic">Mobilization <span className="text-indigo-400">& Onboarding</span></h1>
                            <p className="text-indigo-300 font-bold uppercase tracking-widest text-[10px]">6-Stage Autonomous Readiness Control System</p>
                        </div>
                    </div>

                    {/* Department / View Switcher */}
                    <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/60 shadow-inner">
                        {[
                            { id: 'AM', label: 'Area Manager', color: 'indigo' },
                            { id: 'HR', label: 'HR Dept', color: 'blue' },
                            { id: 'Security', label: 'Security', color: 'amber' },
                            { id: 'Clinic', label: 'Med Clinic', color: 'red' },
                            { id: 'Environment', label: 'Env / HSE', color: 'emerald' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTab === t.id 
                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Workspace Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Panel: Candidate List & Detailed Tracker */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                        
                        {/* Panel Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Briefcase className="text-indigo-600 dark:text-indigo-400" size={20} />
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Active Recruitment pipeline</h3>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsAddRequestOpen(true)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow hover:scale-105 transition-all flex items-center gap-1.5"
                                >
                                    <Plus size={14} /> New Request
                                </button>
                                <button 
                                    onClick={handleResetProcesses}
                                    className="border border-slate-200 dark:border-slate-600 text-slate-500 px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    title="Reset Demo State"
                                >
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Candidate Pipeline Cards */}
                        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                            {processes.map(p => {
                                const bottleneck = getBottleneckInfo(p.status);
                                const stageNum = getStageNumber(p.status);
                                return (
                                    <div 
                                        key={p.id}
                                        onClick={() => setSelectedProcessId(p.id)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                            selectedProcessId === p.id 
                                            ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-500/50 shadow-md' 
                                            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                                                {p.candidateName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {p.candidateName}
                                                    {p.nudgeCount && p.nudgeCount > 0 ? (
                                                        <span className="flex items-center gap-0.5 text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">
                                                            <BadgeAlert size={10}/> Nudged {p.nudgeCount}x
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium">
                                                    {p.company} • <span className="font-bold">{p.role}</span> ({p.department})
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stages Stepper Quick View */}
                                        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                            {[1, 2, 3, 4, 5, 6].map(s => (
                                                <div 
                                                    key={s} 
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono transition-all ${
                                                        stageNum > s 
                                                        ? 'bg-emerald-500 text-white' 
                                                        : stageNum === s 
                                                        ? 'bg-indigo-600 text-white animate-pulse' 
                                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                                                    }`}
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Status & Bottleneck Indicator */}
                                        <div className="text-right shrink-0">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${bottleneck.bg}`}>
                                                {p.status === RecruitmentStatus.RECEIVED ? 'Mobilized' : bottleneck.dept}
                                            </span>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                {p.status === RecruitmentStatus.RECEIVED ? 'Onsite' : `Current: ${p.status}`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {processes.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <Briefcase size={48} className="mx-auto mb-4 opacity-25"/>
                                    <p className="font-bold">No active recruitment processes in the system.</p>
                                    <p className="text-xs mt-1">Click "New Request" to initiate a process.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stage Tracker & Visual Workflow Details */}
                    {activeProcess && (
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Onboarding Timeline & Stepper</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Candidate: {activeProcess.candidateName}</p>
                                </div>
                                <button onClick={() => handleDeleteProcess(activeProcess.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <UserMinus size={18} />
                                </button>
                            </div>

                            {/* Detailed Step Progression Graph */}
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
                                {[
                                    { step: 1, title: 'Requisition', desc: 'Requested by AM', activeStatus: [RecruitmentStatus.AM_REQUESTED] },
                                    { step: 2, title: 'HR Documents', desc: 'ID, Passport verified', activeStatus: [RecruitmentStatus.HR_PENDING] },
                                    { step: 3, title: 'Access Card', desc: 'Temporary Access', activeStatus: [RecruitmentStatus.SECURITY_PENDING] },
                                    { step: 4, title: 'Medicals', desc: 'Vitals & Fit Exam', activeStatus: [RecruitmentStatus.CLINIC_PENDING, RecruitmentStatus.INDUCTION_PENDING] },
                                    { step: 5, title: 'Induction', desc: 'Safety Orientation', activeStatus: [RecruitmentStatus.TRAINING_PENDING] },
                                    { step: 6, title: 'Mobilized', desc: 'CARS Active', activeStatus: [RecruitmentStatus.COMPLETED, RecruitmentStatus.RECEIVED] }
                                ].map((s, idx) => {
                                    const stageNum = getStageNumber(activeProcess.status);
                                    const isComplete = stageNum > s.step || (s.step === 5 && activeProcess.inductionConfirmed && stageNum >= 5);
                                    const isActive = stageNum === s.step;
                                    
                                    return (
                                        <div key={idx} className="flex flex-col items-center text-center relative space-y-3">
                                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black transition-all ${
                                                isComplete 
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' 
                                                : isActive 
                                                ? 'bg-indigo-600 border-indigo-500 text-white animate-pulse shadow-lg ring-4 ring-indigo-500/20' 
                                                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                                            }`}>
                                                {isComplete ? <Check size={20}/> : s.step}
                                            </div>
                                            <div>
                                                <div className={`text-xs font-black uppercase ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{s.title}</div>
                                                <div className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">{s.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action Card specific to AM view (Bottleneck Analysis) */}
                            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Bottleneck Department</div>
                                    {activeProcess.status === RecruitmentStatus.RECEIVED ? (
                                        <div className="text-emerald-500 font-black text-lg flex items-center gap-2">
                                            <ShieldCheck size={22}/> Complete! Employee is active and onsite.
                                        </div>
                                    ) : (
                                        <div className="text-slate-800 dark:text-white font-black text-lg flex items-center gap-2">
                                            <Clock className="text-indigo-500" size={20}/>
                                            Pending: <span className="text-indigo-600 dark:text-indigo-400">{getBottleneckInfo(activeProcess.status).role}</span>
                                        </div>
                                    )}
                                    <p className="text-xs text-slate-500 leading-normal max-w-md">
                                        The onboarding process automatically pauses here until the responsible specialist processes their department approvals.
                                    </p>
                                </div>
                                {activeProcess.status !== RecruitmentStatus.RECEIVED && (
                                    <div className="flex flex-wrap gap-2 shrink-0 self-start md:self-center">
                                        {activeProcess.status !== RecruitmentStatus.COMPLETED && (
                                            <button 
                                                onClick={() => handleNudge(activeProcess.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                <Send size={14}/> Nudge Department
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleFastTrack(activeProcess.id)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            <ShieldCheck size={14}/> Fast-Track Onboarding
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Functional Dashboards & simulated notifications */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Active Dashboard panel depending on functional tab */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        
                        {/* Tab Indicator */}
                        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex items-center gap-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 animate-ping"></span>
                            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-xs">
                                {activeTab === 'AM' && 'Area Manager Portal'}
                                {activeTab === 'HR' && 'HR Document Review'}
                                {activeTab === 'Security' && 'Security Access Desk'}
                                {activeTab === 'Clinic' && 'Occupational Clinic'}
                                {activeTab === 'Environment' && 'HSE Induction Portal'}
                            </h4>
                        </div>

                        <div className="p-6">
                            {/* --- AREA MANAGER PANEL --- */}
                            {activeTab === 'AM' && (
                                <div className="space-y-6">
                                    <div className="text-slate-500 text-xs leading-normal">
                                        As the Area Manager, you can request new recruits for mobilization, view certificates, and confirm arrival.
                                    </div>
                                    
                                    {activeProcess && activeProcess.status === RecruitmentStatus.COMPLETED && (
                                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-5 rounded-2xl space-y-4">
                                            <div className="flex gap-3 text-emerald-800 dark:text-emerald-400">
                                                <ShieldCheck size={20} className="shrink-0"/>
                                                <div>
                                                    <div className="font-bold text-sm">Onboarding Complete!</div>
                                                    <div className="text-xs">RAC certifications and medical fit tests passed. Ready for site receipt.</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleConfirmReceipt(activeProcess.id)}
                                                    className="flex-1 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow"
                                                >
                                                    Confirm Receipt
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeProcess && activeProcess.status === RecruitmentStatus.RECEIVED && (
                                        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-bold text-center">
                                            ✓ Onboarding completed. Recipient has arrived on-site.
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => setIsAddRequestOpen(true)}
                                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        <Plus size={18}/> Request New Recruitment
                                    </button>

                                    <button 
                                        onClick={handleFastTrackAll}
                                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
                                    >
                                        <ShieldCheck size={18} className="text-indigo-400" /> Auto-Onboard All Pending
                                    </button>
                                </div>
                            )}

                            {/* --- HR DASHBOARD --- */}
                            {activeTab === 'HR' && (
                                <div className="space-y-6">
                                    {!activeProcess || (activeProcess.status !== RecruitmentStatus.AM_REQUESTED && activeProcess.status !== RecruitmentStatus.HR_PENDING) ? (
                                        <div className="text-center p-8 text-slate-400 text-xs">
                                            <Info size={32} className="mx-auto mb-2 opacity-30" />
                                            No candidates currently pending HR review or acceptance. Select a candidate with "AM Requested" or "HR Pending" status in the list.
                                        </div>
                                    ) : activeProcess.status === RecruitmentStatus.AM_REQUESTED ? (
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <h5 className="font-bold text-sm text-slate-800 dark:text-white uppercase">{activeProcess.candidateName}</h5>
                                                <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">New Onboarding Requisition</p>
                                            </div>

                                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Requisition details</div>
                                                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 font-bold">Company:</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-black">{activeProcess.company}</span>
                                                </div>
                                                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 font-bold">Department:</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-black">{activeProcess.department}</span>
                                                </div>
                                                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 font-bold">Role:</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-black">{activeProcess.role}</span>
                                                </div>
                                                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                                    <span className="text-slate-500 font-bold">Requested By:</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-black">{activeProcess.requestedBy}</span>
                                                </div>
                                                <div className="flex justify-between py-1.5">
                                                    <span className="text-slate-500 font-bold">Required RACs:</span>
                                                    <span className="text-indigo-600 dark:text-indigo-400 font-black">{activeProcess.requiredRacs.join(', ') || 'None'}</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleAcceptRequisition(activeProcess.id)}
                                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all animate-pulse"
                                            >
                                                <CheckCircle2 size={18}/> Accept Requisition & Start Onboarding
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <h5 className="font-bold text-sm text-slate-800 dark:text-white uppercase">{activeProcess.candidateName}</h5>
                                                <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">{activeProcess.role}</p>
                                            </div>

                                            {/* Document checklist */}
                                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Required Documentation</div>
                                                
                                                {[
                                                    { key: 'id' as const, label: 'National ID card', typeMapped: 'ID' },
                                                    { key: 'passport' as const, label: 'Valid Passport', typeMapped: 'Passport' },
                                                    { key: 'permit' as const, label: 'Work Permit (Dire)', typeMapped: 'Work Permit' }
                                                ].map(doc => {
                                                    const isUploaded = (activeProcess.documents || []).some(d => d.type === doc.typeMapped);
                                                    return (
                                                        <div key={doc.key} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{doc.label}</span>
                                                            {isUploaded ? (
                                                                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase flex items-center gap-1"><Check size={10}/> Uploaded</span>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleSimulateUpload(activeProcess.id, doc.key)}
                                                                    disabled={hrUploading[doc.key]}
                                                                    className="text-[9px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg font-black uppercase border border-indigo-100 transition-colors"
                                                                >
                                                                    {hrUploading[doc.key] ? 'Uploading...' : 'Upload'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <button 
                                                onClick={() => handleCompleteHR(activeProcess.id)}
                                                className="w-full bg-slate-950 text-white dark:bg-indigo-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                                            >
                                                Complete HR Phase
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- SECURITY DASHBOARD --- */}
                            {activeTab === 'Security' && (
                                <div className="space-y-6">
                                    {!activeProcess || activeProcess.status !== RecruitmentStatus.SECURITY_PENDING ? (
                                        <div className="text-center p-8 text-slate-400 text-xs">
                                            <Info size={32} className="mx-auto mb-2 opacity-30" />
                                            No candidates currently pending temporary access badges.
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <h5 className="font-bold text-sm text-slate-800 dark:text-white uppercase">{activeProcess.candidateName}</h5>
                                                <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">{activeProcess.company}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Temporary Badge ID</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. TEMP-ACCESS-5509"
                                                    value={badgeNo}
                                                    onChange={e => setBadgeNo(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none focus:border-amber-500 transition-all"
                                                />
                                            </div>

                                            <button 
                                                onClick={() => handleIssueBadge(activeProcess.id)}
                                                className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/10 hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
                                            >
                                                Issue Card & Grant Access
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- CLINIC DASHBOARD --- */}
                            {activeTab === 'Clinic' && (
                                <div className="space-y-6">
                                    {!activeProcess || activeProcess.status !== RecruitmentStatus.CLINIC_PENDING ? (
                                        <div className="text-center p-8 text-slate-400 text-xs">
                                            <Info size={32} className="mx-auto mb-2 opacity-30" />
                                            No candidates currently pending vital health exams.
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="space-y-1">
                                                <h5 className="font-bold text-sm text-slate-800 dark:text-white uppercase">{activeProcess.candidateName}</h5>
                                                <p className="text-[10px] text-red-500 uppercase font-black tracking-widest">Medical Verification</p>
                                            </div>

                                            {/* Medical inputs */}
                                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Blood Pressure</label>
                                                        <input type="text" value={medBP} onChange={e => setMedBP(e.target.value)} className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Heart Rate (bpm)</label>
                                                        <input type="number" value={medHR} onChange={e => setMedHR(Number(e.target.value))} className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Vision Test</label>
                                                        <select value={medVision} onChange={e => setMedVision(e.target.value as any)} className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold">
                                                            <option>Pass</option>
                                                            <option>Fail</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Drug Screen</label>
                                                        <select value={medDrugs} onChange={e => setMedDrugs(e.target.value as any)} className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold">
                                                            <option>Negative</option>
                                                            <option>Positive</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Scheduled Induction Date</label>
                                                    <input type="date" value={inductionDate} onChange={e => setInductionDate(e.target.value)} className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white" />
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleCompleteClinic(activeProcess.id)}
                                                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                Cleared - Book Induction
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- ENVIRONMENT PORTAL --- */}
                            {activeTab === 'Environment' && (
                                <div className="space-y-6">
                                    {!activeProcess || activeProcess.status !== RecruitmentStatus.INDUCTION_PENDING ? (
                                        <div className="text-center p-8 text-slate-400 text-xs">
                                            <Info size={32} className="mx-auto mb-2 opacity-30" />
                                            No candidates currently awaiting environmental and safety induction.
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <h5 className="font-bold text-sm text-slate-800 dark:text-white uppercase">{activeProcess.candidateName}</h5>
                                                <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Scheduled Date: {activeProcess.inductionDate}</p>
                                            </div>

                                            {/* Induction checklists */}
                                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Induction Sign-off list</div>
                                                
                                                {[
                                                    { state: indGeneral, setState: setIndGeneral, label: 'General Site Safety Orientation' },
                                                    { state: indEnv, setState: setIndEnv, label: 'Environmental Rules & Waste' },
                                                    { state: indEvac, setState: setIndEvac, label: 'Emergency Evacuation Assembly' },
                                                    { state: indPPE, setState: setIndPPE, label: 'Personal Protective Equipment Check' }
                                                ].map((item, idx) => (
                                                    <div 
                                                        key={idx}
                                                        onClick={() => item.setState(!item.state)}
                                                        className="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    >
                                                        {item.state ? (
                                                            <CheckSquare className="text-emerald-500" size={18} />
                                                        ) : (
                                                            <Square className="text-slate-300 dark:text-slate-600" size={18} />
                                                        )}
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                onClick={() => handleConfirmInduction(activeProcess.id)}
                                                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                Certify Induction Complete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Simulation tools for RACS Training stage */}
                    {activeProcess && activeProcess.status === RecruitmentStatus.TRAINING_PENDING && (
                        <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2.5rem] p-6 text-white space-y-4 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><RefreshCw size={100} /></div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-indigo-400" size={20}/>
                                <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-400">CARS System Interfacing</h5>
                            </div>
                            <p className="text-xs text-slate-400 leading-normal">
                                Recruit is awaiting compliance training for: <span className="font-bold text-slate-200">{activeProcess.requiredRacs.join(', ') || 'N/A'}</span>.
                            </p>
                            <button 
                                onClick={() => handleSimulateTraining(activeProcess.id)}
                                className="w-full bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-indigo-500 shadow-md hover:shadow-lg transition-all"
                            >
                                Simulate CARS RACS Passed
                            </button>
                        </div>
                    )}

                    {/* Exporter for completed onboarding process */}
                    {activeProcess && (activeProcess.status === RecruitmentStatus.COMPLETED || activeProcess.status === RecruitmentStatus.RECEIVED) && (
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                <Download size={18}/>
                                <h5 className="font-black text-xs uppercase tracking-wide">Credential Certificate</h5>
                            </div>
                            
                            {/* Certificate Preview Card */}
                            <div className="border border-slate-100 dark:border-slate-700 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 font-mono text-[10px] space-y-3 relative overflow-hidden select-none">
                                <div className="absolute top-0 right-0 p-2 opacity-10"><ShieldCheck size={60} /></div>
                                <div className="text-center font-bold border-b border-dashed border-slate-200 dark:border-slate-700 pb-2 text-[11px]">
                                    CARS ONBOARDING COMPLIANCE
                                </div>
                                <div className="space-y-1">
                                    <div>NAME: {activeProcess.candidateName}</div>
                                    <div>COMP: {activeProcess.company}</div>
                                    <div>ROLE: {activeProcess.role}</div>
                                    <div>DEPT: {activeProcess.department}</div>
                                    <div>BADGE: {activeProcess.temporaryBadgeNumber}</div>
                                </div>
                                <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-2 space-y-0.5">
                                    <div className="text-emerald-500">✓ HR IDENTITY: VERIFIED</div>
                                    <div className="text-emerald-500">✓ BADGE ACCESS: ENROLLED</div>
                                    <div className="text-emerald-500">✓ CLINIC VITALS: PASSED</div>
                                    <div className="text-emerald-500">✓ HSE INDUCTION: PASSED</div>
                                    <div className="text-emerald-500">✓ RAC CODES: PASSED ({activeProcess.requiredRacs.join(', ')})</div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    window.print();
                                }}
                                className="w-full bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-slate-800"
                            >
                                <Download size={14}/> Exporter (Print Credential)
                            </button>
                        </div>
                    )}

                </div>

            </div>

            {/* ADD CANDIDATE REQUEST FORM MODAL */}
            {isAddRequestOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <form onSubmit={handleCreateRequest} className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Request Recruitment</h3>
                            <button type="button" onClick={() => setIsAddRequestOpen(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><UserMinus size={24} /></button>
                        </div>
                        
                        <div className="p-8 space-y-5 max-h-[450px] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Candidate Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        placeholder="e.g. Mateus Nhaca"
                                        value={newRequest.candidateName}
                                        onChange={e => setNewRequest({...newRequest, candidateName: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                                    <input 
                                        required 
                                        type="email" 
                                        placeholder="candidate@work.com"
                                        value={newRequest.candidateEmail}
                                        onChange={e => setNewRequest({...newRequest, candidateEmail: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Phone Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="+258 84..."
                                        value={newRequest.candidatePhone}
                                        onChange={e => setNewRequest({...newRequest, candidatePhone: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Company Entity</label>
                                    <select 
                                        value={newRequest.company}
                                        onChange={e => setNewRequest({...newRequest, company: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                    >
                                        <option>Vulcan Resources Mozambique</option>
                                        <option>Mota-Engil Africa</option>
                                        <option>Belabel Logistics</option>
                                        <option>Escopil Engineering</option>
                                        <option>Jachris Services</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Department</label>
                                    <select 
                                        value={newRequest.department}
                                        onChange={e => setNewRequest({...newRequest, department: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                    >
                                        <option>Mine Operations</option>
                                        <option>Plant Maintenance</option>
                                        <option>HSE</option>
                                        <option>Logistics</option>
                                        <option>Administration</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Job Role</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Haul Truck Driver"
                                        value={newRequest.role}
                                        onChange={e => setNewRequest({...newRequest, role: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Required RACS selector */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Required RAC Training Modules</label>
                                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    {AVAILABLE_RACS.map(rac => {
                                        const isSelected = newRequest.requiredRacs.includes(rac.code);
                                        return (
                                            <div 
                                                key={rac.code}
                                                onClick={() => {
                                                    const updated = isSelected 
                                                        ? newRequest.requiredRacs.filter(r => r !== rac.code) 
                                                        : [...newRequest.requiredRacs, rac.code];
                                                    setNewRequest({...newRequest, requiredRacs: updated});
                                                }}
                                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold ${
                                                    isSelected 
                                                    ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400' 
                                                    : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent'
                                                }`}
                                            >
                                                <input type="checkbox" checked={isSelected} readOnly className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500" />
                                                <span>{rac.code}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsAddRequestOpen(false)}
                                className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow shadow-indigo-600/20 active:scale-95 transition-all"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MobilizationDashboard;
