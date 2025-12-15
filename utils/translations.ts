
export type Language = 'en' | 'pt';

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

const enTranslations = {
    nav: {
      dashboard: 'Dashboard',
      enterpriseDashboard: 'Corporate Dashboard',
      siteGovernance: 'Site Governance',
      database: 'Database',
      reports: 'Reports & Analytics',
      booking: 'Book Training',
      trainerInput: 'Trainer Input',
      records: 'Records',
      users: 'User Management',
      schedule: 'Schedule Trainings',
      settings: 'System Settings',
      requestCards: 'Request CARs Cards',
      manuals: 'User Manuals',
      adminGuide: 'Admin Guide',
      logs: 'System Logs',
      proposal: 'Project Proposal',
      presentation: 'Presentation Mode',
      alcohol: 'Alcohol Control',
      feedbackAdmin: 'Feedback Manager',
      communications: 'Communications'
    },
    common: {
      vulcan: 'CARS Manager',
      safetySystem: 'Safety Management System',
      role: 'Role',
      activeSession: 'Active Session',
      notifications: 'Notifications',
      clearAll: 'Clear All',
      noNotifications: 'No new notifications',
      viewProposal: 'View Proposal',
      simulateRole: 'Simulate Role',
      superuser: 'Superuser Access',
      restricted: 'Restricted Access',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      submit: 'Submit',
      search: 'Search...',
      all: 'All',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      name: 'Name',
      email: 'Email',
      id: 'ID',
      company: 'Company',
      jobTitle: 'Job Title',
      department: 'Department',
      yes: 'Yes',
      no: 'No',
      required: 'Required',
      optional: 'Optional',
      download: 'Download',
      upload: 'Upload',
      template: 'Template',
      import: 'Import Data',
      print: 'Print',
      fullScreen: 'Full Screen',
      exitFullScreen: 'Exit Full Screen',
      rowsPerPage: 'Rows per page:',
      page: 'Page',
      of: 'of',
      siteContext: 'Site Context',
      enterpriseView: 'Enterprise View (All Sites)',
      completed: 'Completed',
      timeLeft: 'left',
      recordsFound: 'records found',
      operationalMatrix: 'Operational Matrix',
      owner: 'Owner',
      smsBlast: 'SMS Blast',
      sending: 'Sending...'
    },
    feedback: {
        button: 'Send Feedback',
        title: 'Share Your Experience',
        subtitle: 'Help us improve the CARS Manager.',
        typeLabel: 'Feedback Type',
        messageLabel: 'Your Message',
        msgPlaceholder: 'Describe the bug, improvement, or experience...',
        success: 'Thank you! Your feedback has been logged.',
        adminTitle: 'User Feedback Logs',
        adminSubtitle: 'Track user reported issues and suggestions.',
        types: {
            Bug: 'Bug Report',
            Improvement: 'Improvement',
            General: 'General Comment'
        },
        status: {
            New: 'New',
            InProgress: 'In Progress',
            Resolved: 'Resolved',
            Dismissed: 'Dismissed'
        },
        actionable: 'Actionable',
        notActionable: 'Not Actionable',
        markActionable: 'Mark Actionable',
        markNotActionable: 'Mark Not Actionable'
    },
    verification: {
      title: 'Digital Safety Passport',
      verified: 'VERIFIED',
      notVerified: 'NOT COMPLIANT',
      notFound: 'RECORD NOT FOUND',
      employeeDetails: 'Employee Details',
      activeRacs: 'Active Certifications',
      asoStatus: 'Medical (ASO)',
      dlStatus: 'Driver License',
      validUntil: 'Valid Until',
      scanTime: 'Scanned at'
    },
    dashboard: {
      title: 'Operational Overview',
      subtitle: 'Real-time safety training metrics.',
      kpi: {
        adherence: 'HSE Adherence',
        certifications: 'Total Certifications',
        pending: 'Pending Grading',
        expiring: 'Expiring (30 Days)',
        scheduled: 'Scheduled Sessions'
      },
      charts: {
        complianceTitle: 'Training Compliance by RAC & ASO',
        complianceSubtitle: 'Shows mandatory status. Green = Valid. Red = Missing/Expired.',
        accessTitle: 'Overall Workforce Access Status',
        compliant: 'Compliant',
        missing: 'Missing / Expired',
        nonCompliant: 'Non-Compliant'
      },
      upcoming: {
        title: 'Upcoming Sessions',
        viewSchedule: 'View Schedule',
        capacity: 'Capacity',
        status: 'Status',
        date: 'Date / Time',
        session: 'Session Info'
      },
      booked: {
        title: 'Employees Booked',
        tableEmployee: 'Employee / Company',
        tableRac: 'RAC Booked',
        tableDate: 'Date',
        tableRoom: 'Room',
        tableTrainer: 'Trainer',
        noData: 'No bookings matching filters'
      },
      renewal: {
        title: 'Action Required: Training Renewal',
        message: 'employees have critical training expiring within 30 days.',
        button: 'Book Renewals'
      },
      autoBooking: {
        title: 'Action Required: Pending Auto-Bookings',
        subPart1: 'System detected expiry risks',
        subPart2: 'and reserved slots to prevent lockout. Approve to finalize.'
      }
    },
    enterprise: {
        title: 'Corporate Command Center',
        subtitle: 'Global Safety Compliance Overview',
        globalHealth: 'Global Health Score',
        totalWorkforce: 'Total Workforce',
        topPerformer: 'Top Performer',
        needsAttention: 'Needs Attention',
        siteComparison: 'Site Performance Comparison',
        operationsOverview: 'Operations Overview',
        siteName: 'Site Name',
        staff: 'Staff',
        governanceTitle: 'Site Governance',
        governanceSubtitle: 'Define mandatory safety training policies per location.',
        pushPolicy: 'Save & Push Policy',
        policyApplied: 'Policy Applied'
    },
    database: {
      title: 'Master Employee Database',
      subtitle: 'Manage requirements. RAC 02 is auto-disabled if DL is expired.',
      filters: 'Filters',
      accessStatus: 'Access Status',
      granted: 'Granted',
      blocked: 'Blocked',
      employeeInfo: 'Employee Info & DL',
      aso: 'ASO (Medical)',
      license: 'Carta',
      class: 'Class',
      number: 'Number',
      expired: 'EXP',
      active: 'Active',
      importCsv: 'Import CSV',
      downloadTemplate: 'CSV Template',
      opsMatrix: 'Operational Matrix',
      massQr: 'Mass QRs',
      zipping: 'Zipping...',
      wizard: 'Import Wizard',
      exportDb: 'Export DB',
      editModal: 'Edit Employee',
      contactInfo: 'Contact Info',
      cell: 'Celular',
      dlDetails: 'Driver License Details',
      mappingTitle: 'Import Column Mapping',
      mappingSubtitle: 'Map CSV columns to system fields.',
      preview: 'File Preview',
      coreData: 'Core Employee Data',
      complianceTrain: 'License, Medical & Training',
      sourceCol: 'Source Column',
      processImport: 'Process Import',
      cardBack: 'Card Back Preview',
      confirmDeactivate: 'Deactivate Employee?',
      confirmDeactivateMsg: 'Marking as Inactive will hide this employee from searches. Continue?',
      confirmDelete: 'Delete Record?',
      confirmDeleteMsg: 'This will permanently remove the employee and all training records. This cannot be undone.',
      importSuccess: 'Import Successful',
      bulkQrMessage: 'This will generate and download {count} QR codes. This might take a while.',
      transfer: {
        title: 'Edit / Transfer Employee',
        subtitle: 'Update employee details. Changing the Company/Dept will maintain historical training records under the new entity.',
        update: 'Update Employee'
      },
      ops: {
          PTS: 'PTS',
          ART: 'ART',
          LIB_OPS: 'LIB-OPS',
          LIB_MOV: 'LIB-MOV',
          EMI_PTS: 'Emi-PTS',
          APR_ART: 'Apr-ART',
          DONO_AREA_PTS: 'Dono-AreaPTS',
          EXEC: 'Exec'
      }
    },
    booking: {
      title: 'Book Training Session',
      secureMode: 'Secure Data Entry Mode',
      manageSchedule: 'Manage Schedule',
      dlRequired: 'Driver License details required for RAC 02',
      success: 'Booking submitted successfully!',
      selectSession: 'Select Training Session',
      chooseSession: 'Choose a session...',
      table: {
        no: 'No.',
        nameId: 'Name / ID',
        details: 'Company / Dept',
        dlNoClass: 'DL No. / Class',
        dlExpiry: 'DL Expiry',
        action: 'Action'
      },
      addRow: 'Add Row',
      submitBooking: 'Submit Booking'
    },
    notifications: {
        expiryTitle: 'Training Expiring',
        expiryMsg: 'Training for {name} ({rac}) expires in {days} days.',
        autoBookTitle: 'Auto-Booking Created',
        autoBookMsg: '{name} has been auto-booked for {rac} on {date} (expires in {days} days).',
        autoBookFailTitle: 'Auto-Booking Failed',
        autoBookFailMsg: 'Could not auto-book {name} for {rac}. No available sessions found.',
        capacityTitle: 'Session Full - Auto Slotting',
        capacityMsg: 'employees were moved to next available session on',
        demandTitle: 'High Demand Alert',
        demandMsg: 'High demand detected for',
        duplicateTitle: 'Duplicate Booking',
        duplicateMsg: 'User already booked for this training type.'
    },
    ai: {
        systemPromptAdvice: "You are an expert Safety Advisor for Vulcan Mining. You specialize in the Critical Safety Rules (RACs). Answer the user's question about {rac}. Provide concise, actionable advice. Keep it under 100 words. Language: {language}.",
        systemPromptReport: "You are an HSE Data Analyst. Analyze the following training statistics for the {language} period. Highlight key trends, risks, and recommendations. Keep it executive and concise."
    },
    advisor: { button: 'Safety Advisor', title: 'CARS AI Safety Advisor', sender: 'CARS Advisor', emptyState: 'How can I assist?', placeholder: 'Ask about RAC standards...' },
    results: { title: 'Training Records', subtitle: 'View results.', searchPlaceholder: 'Search...', table: { employee: 'Employee', session: 'Session', date: 'Date', trainer: 'Trainer', room: 'Room', dlRac02: 'DL (RAC 02)', theory: 'Theory', prac: 'Practical', status: 'Status', expiry: 'Expiry' } },
    cards: { 
        title: 'Safety Cards', 
        showing: 'Showing', 
        subtitle: 'Select employees.', 
        goToPrint: 'Go to Print View', 
        selected: 'Selected', 
        successTitle: 'Request Sent', 
        successMsg: 'Card request forwarded.', 
        noRecords: 'No Eligible Records', 
        noRecordsSub: 'Only passed records appear here.', 
        selectAll: 'Select All', 
        sending: 'Sending...', 
        requestButton: 'Request Cards', 
        validation: { ineligible: 'Ineligible employee.', maxSelection: 'Max 8 cards.', incomplete: 'Incomplete' },
        eligibility: {
            failedTitle: 'Eligibility Check Failed',
            failedMsg: 'You do not currently meet the requirements for a safety card. Please ensure your ASO is valid and you have passed all required trainings.',
            checkReqs: 'Check Requirements'
        }
    },
    trainer: { title: 'Trainer Input', subtitle: 'Enter grades.', passMark: 'Pass: 70%', loggedInAs: 'Logged in as', selectSession: 'Select Session', noSessions: 'No sessions.', chooseSession: 'Choose session...', dlWarning: 'Verify DL for RAC 02.', saveResults: 'Save Results', table: { employee: 'Employee', attendance: 'Attended', dlCheck: 'DL Check', verified: 'Verified', theory: 'Theory', practical: 'Practical', rac02Only: '(RAC 02)', status: 'Status' } },
    users: { title: 'User Management', subtitle: 'Manage access.', addUser: 'Add User', table: { user: 'User', role: 'Role', status: 'Status', actions: 'Actions' }, modal: { title: 'Add User', name: 'Name', email: 'Email', createUser: 'Create' } },
    schedule: { title: 'Training Schedule', subtitle: 'Manage sessions.', newSession: 'New Session', table: { date: 'Date/Time', rac: 'RAC', room: 'Location', trainer: 'Instructor' }, modal: { title: 'Schedule', racType: 'RAC', date: 'Date', startTime: 'Start', location: 'Loc', capacity: 'Cap', instructor: 'Instr', saveSession: 'Save', language: 'Language', english: 'English', portuguese: 'Portuguese' } },
    settings: { 
        title: 'Settings', 
        subtitle: 'Config.', 
        saveAll: 'Save All', 
        saving: 'Saving...', 
        globalConfig: 'Global System Configuration & Source of Truth',
        localConfig: 'Local Operational Settings',
        feedbackConfig: 'Feedback Config',
        integration: 'Data Integration',
        tabs: { general: 'General', trainers: 'Trainers', racs: 'RACs', sites: 'Sites', companies: 'Companies', integration: 'Integration' }, 
        rooms: { title: 'Rooms', name: 'Name', capacity: 'Cap', new: 'New Room' }, 
        trainers: { title: 'Trainers', name: 'Name', qualifiedRacs: 'RACs', new: 'New Trainer' }, 
        racs: { title: 'RACs', code: 'Code', description: 'Desc', new: 'New RAC' },
        integrationPage: {
            title: 'Data Integration (Simulation)',
            middleware: 'CARS Middleware Engine',
            syncNow: 'Run Sync Now',
            processing: 'Processing...',
            waiting: 'Waiting for job trigger...',
            sourceA: 'Source A: HR Database',
            sourceB: 'Source B: Contractor DB',
            logs: 'Synchronization Logs'
        }
    },
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start Date', endDate: 'End Date' }, periods: { weekly: 'Weekly', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, generate: 'Generate AI', analyzing: 'Analyzing...', stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, charts: { performance: 'Performance' }, executiveAnalysis: 'Executive AI Analysis', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prac' } },
    logs: { title: 'System Logs', levels: { all: 'All Levels', info: 'Info', warn: 'Warning', error: 'Error', audit: 'Audit' }, table: { level: 'Level', timestamp: 'Timestamp', user: 'User', message: 'Message' } },
    adminManual: {
        title: 'System Administrator Manual',
        subtitle: 'Comprehensive guide for maintaining the CARS Manager Ecosystem.',
        slides: {
            intro: 'Introduction',
            logic: '1. System Logic Overview',
            dashboard: '2. Dashboard Navigation',
            workflows: '3. Core Workflows',
            advanced: '4. Advanced Configurations',
            troubleshoot: '5. Troubleshooting Guide',
            architecture: '6. System Architecture'
        },
        content: {
            confidential: 'CONFIDENTIAL',
            production: 'PRODUCTION',
            logic: {
                title: 'System Logic: The Traffic Light',
                desc: 'The CARS Manager is a Logic Engine. Compliance is calculated dynamically based on three core pillars.',
                active: 'User Active?',
                aso: 'ASO Valid? (Medical)',
                racs: 'RACs Valid? (Training)',
                result: 'ACCESS GRANTED'
            },
            dashboard: {
                operational: {
                    title: 'Operational Dashboard',
                    kpi: 'KPI Cards: Real-time counts for Certifications, Pending, and Expiring.',
                    renewal: 'Renewal Widget: Alert for <30 days expiry. "Book Renewals" auto-loads wizard.',
                    auto: 'Auto-Booking: Approvals for system-generated bookings (<7 days expiry).'
                },
                enterprise: {
                    title: 'Enterprise Dashboard',
                    global: 'Global Health Score: Aggregate compliance %.',
                    risk: 'Risk Heatmap: Low compliance departments.',
                    ai: 'AI Analysis: Generates executive text summary.'
                }
            },
            workflows: {
                a: {
                    title: 'A. Onboarding & Matrix',
                    steps: [
                        'Go to Database -> Import Wizard (CSV).',
                        'Set Matrix: Toggle RAC columns to Green (Required).',
                        'Result: Employee blocked until specific RAC passed.'
                    ]
                },
                b: {
                    title: 'B. Scheduling & Booking',
                    steps: [
                        'Schedule -> Create Session.',
                        'Book Training -> Select Session -> Add Employees.',
                        'Smart Capacity: Overflow auto-routed to next session or Waitlist.'
                    ]
                },
                c: {
                    title: 'C. Grading (Trainer Input)',
                    steps: [
                        'Select Session -> Mark Attendance.',
                        'Enter Scores (Theory < 70% = Fail).',
                        'RAC 02 Rule: "DL Verified" checkbox is mandatory.'
                    ]
                },
                d: {
                    title: 'D. Issuing Cards',
                    steps: [
                        'Request Cards -> Filter Compliant Employees.',
                        'Batch Print (8 per page).',
                        'Back of Card: Print from Database (QR).'
                    ]
                }
            },
            advanced: {
                gov: {
                    title: 'Site Governance',
                    desc: 'Define mandatory RACs per location. "Push Policy" updates all site employees instantly.'
                },
                alcohol: {
                    title: 'Alcohol Control (IoT)',
                    desc: 'Real-time MQTT stream. Positive test triggers immediate block and alert.'
                }
            },
            troubleshoot: {
                t1: { issue: 'Access Denied but Trained', solution: 'Check ASO Date. Expired medical blocks access even with valid training.' },
                t2: { issue: 'Cannot Book Employee', solution: 'Check Matrix in Database. Training must be marked "Required".' },
                t3: { issue: 'RAC 02 Failed Auto', solution: 'Driver License expired in database. Update DL info.' },
                t4: { issue: 'QR Code "Not Found"', solution: 'Record ID mismatch. Ensure exact case (VUL-101).' },
                t5: { issue: 'System Sluggish', solution: 'Check Logs. Wait for Middleware Sync to finish.' }
            }
        }
    },
    proposal: {
        digitalTrans: 'Digital Transformation',
        aboutMe: {
            title: 'About the Architect',
            name: 'Pita Domingos',
            preferred: 'Preferred Name',
            cert: 'Full Stack Developer',
            role: 'Lead Architect',
            bio: 'Experienced developer specializing in safety management systems.'
        },
        execSummary: {
            title: 'Executive Summary',
            text: "The CARS Manager is a specialized web application meticulously engineered to revolutionize the safety training lifecycle for Critical Activity Requisitions (RAC 01 - RAC 10). This innovative system directly addresses the inefficiencies inherent in traditional, manual processes, such as disparate spreadsheets and fragmented communication channels. By consolidating these into a centralized digital platform, the CARS Manager provides a comprehensive solution for managing every aspect of safety training, from initial booking and rigorous results tracking to the seamless issuance of certifications (CARs) and continuous compliance monitoring. This integrated approach ensures that all critical safety training data is readily accessible, accurate, and up-to-date, significantly enhancing operational safety and regulatory adherence. The system's design prioritizes user experience while delivering robust functionality, making it an indispensable tool for organizations committed to maintaining the highest standards of workplace safety.",
            quote: 'Safety is not just a priority, it is a value.'
        },
        objectives: {
            title: 'Project Objectives',
            problemTitle: 'Current Problem',
            problemText: 'Reliance on manual spreadsheets leads to data inconsistency, difficulty in tracking expiring certifications, and delays in issuing physical cards. There is no real-time visibility into workforce readiness.',
            solutionTitle: 'Our Solution',
            goals: [
                'Centralized Database for 15,000+ Employees', 
                'Automated Expiration Notifications', 
                'Digital & Physical Card Issuance',
                'Role-Based Access Control (RBAC)',
                'AI-Powered Safety Analytics'
            ]
        },
        organogram: {
            title: 'Project Structure',
            tech1: 'Frontend',
            tech2: 'Backend'
        },
        timeline: {
            title: 'Project Timeline',
            phase1: 'Phase 1',
            phase1desc: 'Requirement Gathering',
            phase2: 'Phase 2',
            phase2desc: 'Design & Prototyping',
            phase3: 'Phase 3',
            phase3desc: 'Development',
            phase4: 'Phase 4',
            phase4desc: 'Testing & QA',
            phase5: 'Phase 5',
            phase5desc: 'Deployment'
        },
        techStack: {
            title: 'Technology Stack',
            frontendTitle: 'Frontend',
            frontend: 'React, TypeScript, Tailwind',
            backendTitle: 'Backend',
            backend: 'Node.js, Express',
            databaseTitle: 'Database',
            database: 'PostgreSQL',
            securityTitle: 'Security',
            security: 'OAuth2, JWT'
        },
        financials: {
            title: 'Financial Proposal',
            items: [
                { name: 'Software Architecture & Development', type: 'Once-off', cost: '$20,000.00' },
                { name: 'UI/UX Design & Prototyping', type: 'Once-off', cost: '$8,000.00' },
                { name: 'Cloud Structure Setup & Subscription', type: 'Monthly', cost: '$5,000.00' },
                { name: 'Training & Documentation', type: 'Once-off', cost: '$10,000.00' },
                { name: 'Maintenance & Management Fee', type: 'Monthly', cost: '$15,000.00' }
            ]
        },
        roadmap: {
            title: 'Product Roadmap',
            auth: 'Authentication',
            authDesc: 'SSO Integration',
            db: 'Database',
            dbDesc: 'Cloud Migration',
            email: 'Notifications',
            emailDesc: 'Email & SMS',
            hosting: 'Hosting',
            hostingDesc: 'Cloud Deployment'
        },
        aiFeatures: {
            title: 'AI Capabilities',
            chatbot: 'Safety Advisor Chatbot',
            reporting: 'Automated Insights'
        },
        futureUpdates: {
            title: 'Future Modules',
            moduleA: 'Module A - Risk Management',
            moduleB: 'Module B - Incident Reporting'
        },
        enhancedCaps: {
            title: 'Enhanced Capabilities',
            mobileVerify: { desc: 'Mobile App for field verification.' },
            autoBooking: { desc: 'Automated scheduling for renewals.' },
            massData: { desc: 'Bulk import and export tools.' }
        },
        conclusion: {
            title: 'Conclusion',
            text: 'CARS Manager is the future of safety compliance.'
        },
        thankYou: {
            title: 'Thank You',
            contact: 'contact@example.com',
            phone: '+258 84 123 4567'
        }
    },
    alcohol: {
        dashboard: {
            title: 'Alcohol Control',
            subtitle: 'Real-time monitoring.',
            live: 'Live Feed',
            backToLive: 'Back to Live',
            kpi: { total: 'Total Tests', violations: 'Violations', health: 'System Health' },
            online: 'Online',
            mqtt: 'MQTT Stream',
            alert: { title: 'Alcohol Violation', desc: 'Positive breathalyzer result detected.', measured: 'Measured BAC' },
            actions: 'Automated Actions',
            actionLog: {
                locked: 'Turnstile Locked',
                generating: 'Generating Incident Report...',
                logged: 'Incident Logged',
                contacting: 'Contacting Supervisor...',
                sent: 'Alert Sent'
            },
            close: 'Close Alert'
        },
        protocol: {
            title: 'Safety Protocol',
            positiveTitle: 'Positive Result Protocol',
            positiveDesc: 'Immediate access denial and supervisor notification.',
            resetTitle: 'System Reset',
            resetDesc: 'Manual reset required after violation.'
        },
        features: {
            title: 'System Features',
            iotTitle: 'IoT Integration',
            iotDesc: 'Connects with standard breathalyzers.',
            accessTitle: 'Access Control',
            accessDesc: 'Integrates with turnstile systems.',
            complianceTitle: 'Compliance Logging',
            complianceDesc: 'All tests are logged for audit.'
        }
    },
    manuals: {
        title: 'User Manuals',
        subtitle: 'Guides for all user roles.',
        sysAdmin: {
            title: 'System Administrator',
            subtitle: 'Full system control.',
            configTitle: 'Configuration',
            configDesc: 'Manage system settings.',
            rooms: 'Manage Rooms',
            trainers: 'Manage Trainers',
            racs: 'Manage RACs',
            dbTitle: 'Database Management',
            dbDesc: 'Maintain employee records.',
            restrictionWarning: 'Ensure correct permissions.',
            csv: 'Supports CSV Import.',
            active: 'Active Status Management'
        },
        racAdmin: {
            title: 'RAC Administrator',
            subtitle: 'Manage training schedules.',
            schedTitle: 'Scheduling',
            schedDesc: 'Create and manage sessions.',
            create: 'Create Session',
            lang: 'Select Language',
            autoTitle: 'Auto-Booking',
            autoDesc: 'Handle automated bookings.',
            approve: 'Approve pending bookings.',
            renewTitle: 'Renewals',
            renewDesc: 'Process renewals.'
        },
        racTrainer: {
            title: 'RAC Trainer',
            subtitle: 'Grading and attendance.',
            inputTitle: 'Input Results',
            inputDesc: 'Enter scores and attendance.',
            grading: 'Grading Process',
            rac02: 'RAC 02 Requirements',
            save: 'Save Results'
        },
        deptAdmin: {
            title: 'Department Admin',
            subtitle: 'View and request cards.',
            reqTitle: 'Request Cards',
            reqDesc: 'Request safety cards for employees.',
            search: 'Search Employees',
            print: 'Print Cards',
            repTitle: 'Reporting',
            repDesc: 'View department reports.'
        },
        user: {
            title: 'General User',
            subtitle: 'View personal status.',
            statusTitle: 'My Status',
            statusDesc: 'Check your compliance status.',
            filterAlert: 'Ensure filters are cleared.',
            green: 'Compliant',
            red: 'Non-Compliant',
            qr: 'Digital QR Code'
        }
    }
};

export const translations = {
  en: enTranslations,
  pt: {
    nav: {
      dashboard: 'Painel Operacional',
      enterpriseDashboard: 'Painel Corporativo',
      siteGovernance: 'Governança de Site',
      database: 'Base de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Área do Formador',
      records: 'Histórico',
      users: 'Gestão de Usuários',
      schedule: 'Cronograma de Aulas',
      settings: 'Configurações do Sistema',
      requestCards: 'Solicitar Cartões',
      manuals: 'Manuais do Usuário',
      adminGuide: 'Guia do Administrador',
      logs: 'Logs do Sistema',
      proposal: 'Proposta do Projeto',
      presentation: 'Modo Apresentação',
      alcohol: 'Controle de Álcool',
      feedbackAdmin: 'Gestor de Feedback',
      communications: 'Comunicações'
    },
    common: enTranslations.common,
    feedback: enTranslations.feedback,
    verification: enTranslations.verification,
    dashboard: enTranslations.dashboard,
    enterprise: enTranslations.enterprise,
    database: enTranslations.database,
    booking: enTranslations.booking,
    notifications: enTranslations.notifications,
    ai: enTranslations.ai,
    advisor: enTranslations.advisor,
    results: enTranslations.results,
    cards: enTranslations.cards,
    trainer: enTranslations.trainer,
    users: enTranslations.users,
    schedule: enTranslations.schedule,
    settings: enTranslations.settings,
    reports: enTranslations.reports,
    logs: enTranslations.logs,
    adminManual: enTranslations.adminManual,
    proposal: {
        ...enTranslations.proposal,
        execSummary: {
            title: 'Sumário Executivo',
            text: "O Gestor de RACS é uma aplicação web especializada, meticulosamente projetada para revolucionar o ciclo de vida do treinamento de segurança para Requisitos de Atividades Críticas (RAC 01 - RAC 10). Este sistema inovador aborda diretamente as ineficiências inerentes aos processos manuais tradicionais, como planilhas díspares e canais de comunicação fragmentados. Ao consolidar esses elementos em uma plataforma digital centralizada, o Gestor de RACS fornece uma solução abrangente para gerenciar todos os aspectos do treinamento de segurança, desde o agendamento inicial e rastreamento rigoroso de resultados até a emissão perfeita de certificações (CARs) e monitoramento contínuo de conformidade. Essa abordagem integrada garante que todos os dados críticos de treinamento de segurança sejam facilmente acessíveis, precisos e atualizados, melhorando significativamente a segurança operacional e a adesão regulatória. O design do sistema prioriza a experiência do usuário enquanto oferece funcionalidade robusta, tornando-o uma ferramenta indispensável para organizações comprometidas em manter os mais altos padrões de segurança no local de trabalho.",
            quote: 'Segurança não é apenas uma prioridade, é um valor.'
        },
        objectives: {
            title: 'Objetivos do Projeto',
            problemTitle: 'Problema Atual',
            problemText: 'A dependência de planilhas manuais leva à inconsistência de dados, dificuldade em rastrear certificações expirando e atrasos na emissão de cartões físicos. Não há visibilidade em tempo real da prontidão da força de trabalho.',
            solutionTitle: 'Nossa Solução',
            goals: [
                'Base de Dados Centralizada para 15.000+ Funcionários',
                'Notificações Automatizadas de Expiração',
                'Emissão de Cartões Físicos e Digitais',
                'Controle de Acesso Baseado em Função (RBAC)',
                'Análise de Segurança Impulsionada por IA'
            ]
        }
    },
    alcohol: enTranslations.alcohol,
    manuals: enTranslations.manuals
  }
};
