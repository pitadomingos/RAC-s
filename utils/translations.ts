
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
      timeLeft: 'left'
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
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start', endDate: 'End' }, periods: { weekly: 'Weekly', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, generate: 'Generate AI', analyzing: 'Analyzing...', stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, charts: { performance: 'Performance' }, executiveAnalysis: 'Executive AI Analysis', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prac' } },
    logs: { title: 'System Logs', levels: { all: 'All Levels', info: 'Info', warn: 'Warning', error: 'Error', audit: 'Audit' }, table: { level: 'Level', timestamp: 'Timestamp', user: 'User', message: 'Message' } },
    adminManual: {
        title: 'System Administrator Manual',
        subtitle: 'Comprehensive guide for maintaining the CARS Manager Ecosystem.',
        slides: {
            intro: 'Introduction',
            hierarchy: 'System Hierarchy',
            objectives: 'Core Objectives',
            logic: 'Access Logic',
            workflow: 'Data Workflow',
            config: 'Configuration',
            booking: 'Booking Rules',
            advanced: 'Advanced Features',
            troubleshoot: 'Troubleshooting'
        },
        content: {
            confidential: 'CONFIDENTIAL',
            production: 'PRODUCTION',
            hierarchy: {
                title: 'User Role Hierarchy',
                roles: {
                    sysAdmin: 'System Admin',
                    entAdmin: 'Enterprise Admin',
                    siteAdmin: 'Site Admin',
                    ops: 'Operational Roles',
                    user: 'General User'
                },
                billingTitle: 'SaaS Billing Model',
                billingDesc: 'The system uses a per-active-user billing model. Only General Users are billable.',
                cost: '$2.00',
                perUser: 'Per User / Month'
            },
            objectives: {
                title: 'System Objectives',
                problemTitle: 'The Problem',
                problemText: 'Fragmented data sources and manual processes lead to compliance risks.',
                p1Title: 'Data Silos',
                p1Desc: 'HR and Safety data live in disconnected systems.',
                p2Title: 'Manual Entry',
                p2Desc: 'High risk of human error during data entry.',
                p3Title: 'Latency',
                p3Desc: 'Delays in access revocation for expired certifications.',
                solutionTitle: 'The Solution',
                s1Title: 'Unified Database',
                s1Desc: 'Single source of truth for all employee data.',
                s2Title: 'Automation',
                s2Desc: 'Automated booking and expiry notifications.',
                s3Title: 'Real-time Access',
                s3Desc: 'Instant access control updates based on compliance status.',
                goals: ['Centralized Data', 'Automated Workflows', 'Real-time Compliance']
            },
            formulaTitle: 'Access Logic Formula',
            formulaLogic: {
                active: 'Active Status',
                aso: 'Valid ASO',
                racs: 'Required RACs',
                result: 'ACCESS GRANTED'
            },
            flowTitle: 'Data Workflow',
            flowSteps: {
                db: 'Database',
                dbDesc: 'Employee data is synchronized from HR/Contractor systems.',
                book: 'Booking',
                bookDesc: 'Training sessions are scheduled and employees are booked.',
                res: 'Results',
                resDesc: 'Trainers input results (Pass/Fail).',
                stat: 'Status',
                statDesc: 'System updates access status based on results.'
            },
            configTitle: 'System Configuration',
            configCards: {
                racs: 'RAC Definitions',
                racsDesc: 'Define Critical Safety Rules, validity periods, and requirements.',
                rooms: 'Training Rooms',
                roomsDesc: 'Manage training locations and capacities.',
                trainers: 'Trainers',
                trainersDesc: 'Manage qualified trainers and their certifications.'
            },
            bookingTitle: 'Booking Logic',
            matrixLock: 'Matrix Lock',
            matrixDesc: 'The system enforces a Matrix Lock to ensure compliance.',
            gradingTitle: 'Grading',
            gradingText: 'Passing score is 70%. Attendance is mandatory.',
            rac02Title: 'RAC 02 Logic',
            rac02Text: 'Requires valid Driver License details.',
            expiryTitle: 'Expiry Logic',
            expiryText: 'Certifications valid for defined period (e.g. 2 years).',
            advancedTitle: 'Advanced Features',
            autoBook: 'Auto-Booking',
            autoBookDesc: 'System automatically books expiring employees.',
            aiRep: 'AI Reporting',
            aiRepDesc: 'Generate executive summaries using AI.',
            alc: 'Alcohol Control',
            alcDesc: 'Integration with breathalyzer devices.',
            tsTitle: 'Troubleshooting',
            ts1: 'Search Issues',
            ts1Desc: 'Check spelling and ID format.',
            ts2: 'Access Denied',
            ts2Desc: 'Verify ASO and RAC status in Database.',
            ts3: 'System Error',
            ts3Desc: 'Check browser console and network connection.'
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
            text: 'CARS Manager is a comprehensive safety management platform designed to streamline training, compliance, and access control.',
            quote: 'Safety is not just a priority, it is a value.'
        },
        objectives: {
            title: 'Project Objectives',
            problemTitle: 'Challenges',
            problemText: 'Current systems are inefficient and prone to error.',
            solutionTitle: 'Our Solution',
            goals: ['Efficiency', 'Accuracy', 'Compliance']
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
            title: 'Financial Overview',
            items: [
                { name: 'Development', cost: '$5,000' },
                { name: 'Infrastructure', cost: '$500' },
                { name: 'Maintenance', cost: '$200/mo' },
                { name: 'Training', cost: '$1,000' },
                { name: 'Support', cost: '$100/mo' }
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
    proposal: enTranslations.proposal,
    alcohol: enTranslations.alcohol,
    manuals: enTranslations.manuals
  }
};
