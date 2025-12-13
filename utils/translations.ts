
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

export const translations = {
  en: {
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
      alcohol: 'Alcohol Control'
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
      enterpriseView: 'Enterprise View (All Sites)'
    },
    // ... existing translations ...
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
        policyApplied: 'Policy Applied',
        deptHeatmap: 'Department Risk Heatmap',
        tenantMatrix: 'Tenant Performance Matrix',
        systemView: 'SYSTEM VIEW',
        bottlenecks: 'Training Bottlenecks',
        noBottlenecks: 'No bottlenecks detected.',
        clickToGen: 'Click generate to receive',
        safetyIntel: 'enterprise-level safety intelligence.',
        multiTenantDiag: 'multi-tenant safety diagnostics.'
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
    settings: { title: 'Settings', subtitle: 'Config.', saveAll: 'Save', saving: 'Saving...', tabs: { general: 'General', trainers: 'Trainers', racs: 'RACs', sites: 'Sites', companies: 'Companies' }, rooms: { title: 'Rooms', name: 'Name', capacity: 'Cap', new: 'New Room' }, trainers: { title: 'Trainers', name: 'Name', qualifiedRacs: 'RACs', new: 'New Trainer' }, racs: { title: 'RACs', code: 'Code', description: 'Desc', new: 'New RAC' } },
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start', endDate: 'End' }, periods: { weekly: 'Weekly', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, generate: 'Generate AI', analyzing: 'Analyzing...', stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, charts: { performance: 'Performance' }, executiveAnalysis: 'Executive AI Analysis', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prac' } },
    logs: { title: 'System Logs', levels: { all: 'All Levels', info: 'Info', warn: 'Warning', error: 'Error', audit: 'Audit' }, table: { level: 'Level', timestamp: 'Timestamp', user: 'User', message: 'Message' } },
    adminManual: {
      title: 'System Manual',
      subtitle: 'Administrator Guide for System Configuration & Logic',
      slides: {
        intro: 'Introduction',
        objectives: 'Objectives & Scope',
        logic: 'Compliance Logic',
        workflow: 'Core Data Flow',
        config: 'System Configuration',
        booking: 'Booking Rules',
        advanced: 'Advanced Capabilities',
        troubleshoot: 'Troubleshooting',
        hierarchy: 'Hierarchy & Billing'
      },
      content: {
        confidential: 'CONFIDENTIAL',
        production: 'PRODUCTION v2.5',
        objectives: {
          title: 'Objectives & Scope',
          problemTitle: 'Current Challenges',
          solutionTitle: 'System Solutions',
          p1Title: 'Data Integrity',
          p1Desc: 'Fragmented Excel sheets lead to compliance gaps and lost records.',
          p2Title: 'Compliance Timing',
          p2Desc: 'Manual tracking fails to catch expiries before site lockout occurs.',
          p3Title: 'Administrative Load',
          p3Desc: 'HSE teams spend 40% of time cross-referencing lists manually.',
          s1Title: 'Central Truth',
          s1Desc: 'Single immutable database for all training, health, and operational data.',
          s2Title: 'Auto-Enforcement',
          s2Desc: 'Logic gate automatically blocks access if any requirement expires.',
          s3Title: 'Efficiency',
          s3Desc: 'Reduced admin time by 85% via batch processing and auto-booking.'
        },
        formulaTitle: 'The Compliance Formula',
        formulaDesc: 'The system strictly enforces an AND logic gate. If any single variable (Status, ASO Date, or any required RAC Training) is missing or expired, the result defaults to BLOCKED.',
        formulaLogic: {
          active: 'Active Status',
          aso: 'Valid ASO',
          racs: 'Required RACs',
          result: 'ACCESS GRANTED'
        },
        flowTitle: 'Core Data Flow',
        flowSteps: {
          db: 'Database',
          dbDesc: 'Define Employee Requirements',
          book: 'Booking',
          bookDesc: 'Schedule Training Session',
          res: 'Results',
          resDesc: 'Capture Score & Attendance',
          stat: 'Status',
          statDesc: 'Auto-Calculate Compliance'
        },
        configTitle: 'System Configuration',
        configCards: {
          racs: 'RAC Definitions',
          racsDesc: 'Define the modules (e.g., RAC 01, PTS). Warning: Deleting a RAC here removes the column from the database matrix.',
          rooms: 'Rooms & Capacity',
          roomsDesc: 'Set physical limits for classrooms to prevent overbooking during the scheduling phase.',
          trainers: 'Trainers & Auth',
          trainersDesc: 'Register instructors and authorize them for specific modules. Only authorized trainers appear in dropdowns.'
        },
        bookingTitle: 'Booking Rules',
        matrixLock: 'Matrix Lock',
        matrixDesc: 'The system prevents booking trainings that are not required by the employee profile.',
        gradingTitle: 'Grading Standards',
        gradingText: 'Pass mark is 70%. Attendance is mandatory. Failed attempts require re-booking.',
        rac02Title: 'RAC 02 Specifics',
        rac02Text: 'Requires Driver License verification. If DL is expired, the system auto-fails the student.',
        expiryTitle: 'Auto-Expiry',
        expiryText: 'Certifications are valid for 2 years. Re-training is flagged 30 days prior.',
        advancedTitle: 'Advanced Capabilities',
        autoBook: 'Auto-Booking Engine',
        autoBookDesc: 'System detects employees expiring in < 7 days and auto-reserves next available slot to prevent lockout.',
        aiRep: 'AI Reporting',
        aiRepDesc: 'Generates executive summaries using Gemini 1.5 Pro to identify high-risk departments.',
        alc: 'Alcohol Control',
        alcDesc: 'IoT integration roadmap for breathalyzer interlock with turnstiles.',
        tsTitle: 'Troubleshooting',
        ts1: 'Search Not Found?',
        ts1Desc: 'Ensure Employee ID matches the CSV import exactly.',
        ts2: 'Status Blocked?',
        ts2Desc: 'Check ASO (Medical) date. Expired ASO blocks access regardless of training.',
        ts3: 'QR Scan Error?',
        ts3Desc: 'Verify the device has internet access to query the live database.',
        hierarchy: {
            title: 'System Organogram & Billing',
            billingTitle: 'SaaS Billing Model',
            billingDesc: 'The platform uses a role-based billing structure. Administrative seats are free. Charges apply only to end-users tracked in the system.',
            cost: '$2.00',
            perUser: 'per General User / Month',
            roles: {
                sysAdmin: 'System Admin (SaaS Owner)',
                entAdmin: 'Enterprise Admin (Client HQ)',
                siteAdmin: 'Site Admin (Location Manager)',
                ops: 'Operational Admins (RAC/Dept/Trainers)',
                user: 'General User (Billable)'
            }
        }
      }
    },
    manuals: {
      title: 'User Manuals',
      subtitle: 'Select role to view guide.',
      sysAdmin: { title: 'System Admin', subtitle: 'Platform Configuration', configTitle: 'Initial Config', configDesc: 'Set up the environment before onboarding.', rooms: 'Define Rooms & Capacity', trainers: 'Register Trainers', racs: 'Define RAC Modules', dbTitle: 'Database Management', dbDesc: 'The Master Record for all employees.', restrictionWarning: 'CRITICAL: You cannot book training for an employee unless the RAC is marked "Required" in their profile.', csv: 'Use the CSV Template for mass imports.', active: 'Toggle "Active" status to archive users.' },
      racAdmin: { title: 'RAC Admin', subtitle: 'Scheduling & Oversight', schedTitle: 'Scheduling', schedDesc: 'Manage the training calendar.', create: 'Create Sessions', lang: 'Set Language (Eng/Port)', autoTitle: 'Auto-Booking', autoDesc: 'The system auto-books expiring employees (< 7 days).', approve: 'You must Approve/Reject auto-bookings on Dashboard.', renewTitle: 'Renewals', renewDesc: 'Use "Book Renewals" button to process 30-day expiries.' },
      racTrainer: { title: 'RAC Trainer', subtitle: 'Grading & Attendance', inputTitle: 'Trainer Input', inputDesc: 'Mark attendance and scores.', grading: 'Pass Mark: 70%', rac02: 'RAC 02: Verify Driver License. If expired, student fails automatically.', save: 'Click Save to commit results.' },
      deptAdmin: { title: 'Dept Admin', subtitle: 'Requests & Reporting', reqTitle: 'Card Requests', reqDesc: 'Issue IDs for compliant staff.', search: 'Search Employee', print: 'Print Card (PDF)', repTitle: 'Reporting', repDesc: 'View compliance stats for your department.' },
      user: { title: 'General User', subtitle: 'Self-Service Portal', statusTitle: 'Check Status', statusDesc: 'View your own compliance.', filterAlert: 'Note: You only see trainings required for your role.', green: 'Green = Compliant', red: 'Red = Action Required', qr: 'Download your Digital Passport QR.' }
    },
    proposal: {
      digitalTrans: 'Digital Transformation',
      aboutMe: {
        title: 'About The Developer',
        name: 'Pita Domingos',
        preferred: 'Call me Peter',
        role: 'Full Stack Developer',
        cert: 'Certified Solutions Architect',
        bio: 'Specializing in enterprise-grade safety systems and digital transformation for the mining sector. Focused on zero-downtime compliance architectures.'
      },
      scenario: {
        title: 'Real World Scenario',
        workflowTitle: 'Zero-Downtime Workflow',
        riskTitle: 'The Risk',
        riskText: 'Operator Paulo Manjate has a Critical RAC 02 certification expiring in 3 days. Access denial is imminent.',
        autoFixTitle: 'The Auto-Fix',
        autoFixText: 'System detects risk < 7 Days. Automatically reserves a seat in the next available session (Tomorrow).',
        autoFixNote: '// No human intervention required.',
        demoTitle: 'Live Demo',
        demoText: 'Check the Dashboard. You should see a Pending Action alert for Paulo Manjate.',
        demoButton: 'Go to Dashboard'
      },
      execSummary: {
        title: 'Executive Summary',
        text: 'The CARS Manager centralizes safety data, automating compliance logic to eliminate human error and prevent site lockouts.',
        quote: '"Safety is not just a priority, it is an operational constant."'
      },
      objectives: {
        title: 'Strategic Objectives',
        problemTitle: 'The Problem',
        problemText: 'Manual tracking via Excel leads to data fragmentation, missed expiries, and administrative bottlenecks.',
        solutionTitle: 'The Solution',
        goals: [
          'Unified Truth Source',
          'Automated Compliance Logic',
          'Real-time Analytics',
          'Scalable Architecture'
        ]
      },
      organogram: {
        title: 'System Organogram',
        pm: 'Project Manager',
        delivery: 'Service Delivery',
        tech1: 'Frontend Engineer',
        tech2: 'Backend Engineer',
        regime: 'Hybrid Regime'
      },
      timeline: {
        title: 'Project Timeline',
        phase1: 'Phase 1: Foundation',
        phase1desc: 'Database Design & Core Logic',
        phase2: 'Phase 2: Development',
        phase2desc: 'Frontend & API Integration',
        phase3: 'Phase 3: Testing',
        phase3desc: 'UAT & Security Audit',
        phase4: 'Phase 4: Deployment',
        phase4desc: 'Go-Live & Training'
      },
      techStack: {
        title: 'Technology Stack',
        frontendTitle: 'Frontend',
        frontend: 'React + TypeScript + Tailwind',
        backendTitle: 'Backend Logic',
        backend: 'Node.js (Serverless Ready)',
        databaseTitle: 'Data Persistence',
        database: 'Scalable Cloud Database',
        securityTitle: 'Security',
        security: 'RBAC & Encryption'
      },
      financials: {
        title: 'Financial Investment',
        items: [
          { name: 'Software Architecture & Development', type: 'Once-off', cost: '$20,000.00' },
          { name: 'UI/UX Design & Prototyping', type: 'Once-off', cost: '$8,000.00' },
          { name: 'Cloud Infrastructure Setup', type: 'Monthly', cost: '$5,000.00' },
          { name: 'Training & Documentation', type: 'Once-off', cost: '$10,000.00' },
          { name: 'Maintenance & Management Fee', type: 'Monthly', cost: '$15,000.00' }
        ]
      },
      roadmap: {
        title: 'Future Roadmap',
        auth: 'SSO Integration',
        authDesc: 'Connect with Corporate AD',
        db: 'Migration',
        dbDesc: 'Move to Enterprise SQL',
        email: 'Notifications',
        emailDesc: 'Automated Email Alerts',
        hosting: 'PWA Support',
        hostingDesc: 'Offline Mobile Access'
      },
      futureUpdates: {
        title: 'Alcohol Control Module',
        desc: 'Integration with IoT Breathalyzers to automate gate access.'
      },
      enhancedCaps: {
        title: 'Enhanced Capabilities',
        mobileVerify: { title: 'Mobile Verification', desc: 'Field inspectors can verify status instantly via QR scan.' },
        autoBooking: { title: 'Auto-Booking', desc: 'System reserves slots for expiring employees automatically.' },
        massData: { title: 'Mass Data Ops', desc: 'Import/Export thousands of records via CSV.' },
        auditLogs: { title: 'Audit Trails', desc: 'Every action is logged for accountability.' },
        smartBatching: { title: 'Smart Batching', desc: 'Group employees by expiry date for renewal sessions.' },
        matrixCompliance: { title: 'Matrix Compliance', desc: 'Visual heatmap of compliance across departments.' }
      },
      conclusion: {
        title: 'Conclusion',
        text: 'This system transforms safety from a reactive burden into a proactive strategic asset.'
      },
      thankYou: {
        title: 'Thank You',
        contact: 'peter@digisols.com',
        phone: '+258 84 5479 481'
      }
    }
  },
  pt: {
    // ... pt translations match en structure
    nav: {
      dashboard: 'Painel de Controle',
      enterpriseDashboard: 'Painel Corporativo',
      siteGovernance: 'Governança de Sites',
      database: 'Banco de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Entrada do Instrutor',
      records: 'Registros',
      users: 'Gestão de Usuários',
      schedule: 'Agendar Sessões',
      settings: 'Configurações do Sistema',
      requestCards: 'Solicitar Cartões',
      manuals: 'Manuais do Usuário',
      adminGuide: 'Guia do Admin',
      logs: 'Logs do Sistema',
      proposal: 'Proposta de Projeto',
      presentation: 'Modo Apresentação',
      alcohol: 'Controle de Álcool'
    },
    common: {
      vulcan: 'Gestor CARS',
      safetySystem: 'Sistema de Gestão de Segurança',
      role: 'Função',
      activeSession: 'Sessão Ativa',
      notifications: 'Notificações',
      clearAll: 'Limpar Tudo',
      noNotifications: 'Sem novas notificações',
      viewProposal: 'Ver Proposta',
      simulateRole: 'Simular Função',
      superuser: 'Acesso Superusuário',
      restricted: 'Acesso Restrito',
      loading: 'Carregando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      actions: 'Ações',
      edit: 'Editar',
      delete: 'Excluir',
      submit: 'Enviar',
      search: 'Pesquisar...',
      all: 'Todos',
      date: 'Data',
      time: 'Hora',
      status: 'Status',
      name: 'Nome',
      email: 'Email',
      id: 'ID',
      company: 'Empresa',
      jobTitle: 'Cargo',
      department: 'Departamento',
      yes: 'Sim',
      no: 'Não',
      required: 'Obrigatório',
      optional: 'Opcional',
      download: 'Baixar',
      upload: 'Carregar',
      template: 'Modelo',
      import: 'Importar Dados',
      print: 'Imprimir',
      fullScreen: 'Tela Cheia',
      exitFullScreen: 'Sair da Tela Cheia',
      rowsPerPage: 'Linhas por página:',
      page: 'Página',
      of: 'de',
      siteContext: 'Contexto do Local',
      enterpriseView: 'Visão Empresarial (Todos)'
    },
    // ... verification ...
    verification: {
      title: 'Passaporte Digital de Segurança',
      verified: 'VERIFICADO',
      notVerified: 'NÃO CONFORME',
      notFound: 'REGISTRO NÃO ENCONTRADO',
      employeeDetails: 'Detalhes do Colaborador',
      activeRacs: 'Certificações Ativas',
      asoStatus: 'Médico (ASO)',
      dlStatus: 'Carta de Condução',
      validUntil: 'Válido Até',
      scanTime: 'Verificado em'
    },
    // ... dashboard ...
    dashboard: {
      title: 'Visão Geral Operacional',
      subtitle: 'Métricas de segurança em tempo real.',
      kpi: {
        adherence: 'Aderência HSE',
        certifications: 'Total Certificações',
        pending: 'Pendente Avaliação',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade de Treinamento por RAC & ASO',
        complianceSubtitle: 'Mostra status obrigatório. Verde = Válido. Vermelho = Ausente/Expirado.',
        accessTitle: 'Status Geral de Acesso',
        compliant: 'Conforme',
        missing: 'Ausente / Expirado',
        nonCompliant: 'Não Conforme'
      },
      upcoming: {
        title: 'Sessões Futuras',
        viewSchedule: 'Ver Agenda',
        capacity: 'Capacidade',
        status: 'Status',
        date: 'Data / Hora',
        session: 'Info Sessão'
      },
      booked: {
        title: 'Colaboradores Agendados',
        tableEmployee: 'Colaborador / Empresa',
        tableRac: 'RAC Agendado',
        tableDate: 'Data',
        tableRoom: 'Sala',
        tableTrainer: 'Instrutor',
        noData: 'Nenhum agendamento encontrado'
      },
      renewal: {
        title: 'Ação Necessária: Renovação de Treinamento',
        message: 'colaboradores têm treinamentos críticos expirando em 30 dias.',
        button: 'Agendar Renovações'
      },
      autoBooking: {
        title: 'Ação Necessária: Auto-Agendamentos Pendentes',
        subPart1: 'Sistema detectou riscos de expiração',
        subPart2: 'e reservou vagas para evitar bloqueio. Aprove para finalizar.'
      }
    },
    enterprise: {
        title: 'Centro de Comando Corporativo',
        subtitle: 'Visão Geral da Conformidade de Segurança Global',
        globalHealth: 'Pontuação Global',
        totalWorkforce: 'Força de Trabalho',
        topPerformer: 'Melhor Desempenho',
        needsAttention: 'Requer Atenção',
        siteComparison: 'Comparação de Desempenho por Site',
        operationsOverview: 'Visão Geral das Operações',
        siteName: 'Nome do Site',
        staff: 'Pessoal',
        governanceTitle: 'Governança do Site',
        governanceSubtitle: 'Defina políticas de treinamento obrigatórias por local.',
        pushPolicy: 'Salvar e Aplicar Política',
        policyApplied: 'Política Aplicada',
        deptHeatmap: 'Mapa de Calor de Risco por Dept',
        tenantMatrix: 'Matriz de Desempenho de Inquilinos',
        systemView: 'VISÃO DO SISTEMA',
        bottlenecks: 'Gargalos de Treinamento',
        noBottlenecks: 'Nenhum gargalo detectado.',
        clickToGen: 'Clique em gerar para receber',
        safetyIntel: 'inteligência de segurança.',
        multiTenantDiag: 'diagnósticos de segurança multi-inquilino.'
    },
    database: {
      title: 'Banco de Dados Mestre',
      subtitle: 'Gerenciar requisitos. RAC 02 é auto-desativado se a Carta estiver expirada.',
      filters: 'Filtros',
      accessStatus: 'Status de Acesso',
      granted: 'Liberado',
      blocked: 'Bloqueado',
      employeeInfo: 'Info & Carta',
      aso: 'ASO (Médico)',
      license: 'Carta',
      class: 'Classe',
      number: 'Número',
      expired: 'EXP',
      active: 'Ativo',
      importCsv: 'Importar CSV',
      downloadTemplate: 'Modelo CSV',
      opsMatrix: 'Matriz Operacional',
      transfer: {
        title: 'Editar / Transferir Colaborador',
        subtitle: 'Atualize detalhes. Mudar Empresa/Dept mantém histórico na nova entidade.',
        update: 'Atualizar Colaborador'
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
      title: 'Agendar Sessão',
      secureMode: 'Modo de Entrada Segura',
      manageSchedule: 'Gerir Agenda',
      dlRequired: 'Detalhes da Carta exigidos para RAC 02',
      success: 'Agendamento enviado com sucesso!',
      selectSession: 'Selecionar Sessão',
      chooseSession: 'Escolha uma sessão...',
      table: {
        no: 'Nº',
        nameId: 'Nome / ID',
        details: 'Empresa / Dept',
        dlNoClass: 'Carta Nº / Classe',
        dlExpiry: 'Validade Carta',
        action: 'Ação'
      },
      addRow: 'Adicionar Linha',
      submitBooking: 'Enviar Agendamento'
    },
    notifications: {
        expiryTitle: 'Treinamento Expirando',
        expiryMsg: 'Treinamento de {name} ({rac}) expira em {days} dias.',
        autoBookTitle: 'Auto-Agendamento Criado',
        autoBookMsg: '{name} foi auto-agendado para {rac} em {date} (expira em {days} dias).',
        autoBookFailTitle: 'Falha no Auto-Agendamento',
        autoBookFailMsg: 'Não foi possível auto-agendar {name} para {rac}. Sem sessões disponíveis.',
        capacityTitle: 'Sessão Cheia - Auto Alocação',
        capacityMsg: 'colaboradores foram movidos para a próxima sessão disponível em',
        demandTitle: 'Alerta de Alta Demanda',
        demandMsg: 'Alta demanda detectada para',
        duplicateTitle: 'Agendamento Duplicado',
        duplicateMsg: 'Usuário já agendado para este tipo de treinamento.'
    },
    // ... ai, advisor ...
    ai: {
        systemPromptAdvice: "Você é um Consultor de Segurança especialista para a Vulcan Mining. Especialize-se nas Regras Críticas de Segurança (RACs). Responda à pergunta do usuário sobre {rac}. Forneça conselhos concisos e acionáveis. Mantenha abaixo de 100 palavras. Idioma: {language}.",
        systemPromptReport: "Você é um Analista de Dados HSE. Analise as estatísticas de treinamento para o período {language}. Destaque tendências, riscos e recomendações. Mantenha executivo e conciso."
    },
    advisor: { button: 'Consultor', title: 'Consultor IA CARS', sender: 'Consultor CARS', emptyState: 'Como posso ajudar?', placeholder: 'Pergunte sobre padrões RAC...' },
    results: { title: 'Registros de Treinamento', subtitle: 'Ver resultados.', searchPlaceholder: 'Pesquisar...', table: { employee: 'Colaborador', session: 'Sessão', date: 'Data', trainer: 'Instrutor', room: 'Sala', dlRac02: 'Carta (RAC 02)', theory: 'Teoria', prac: 'Prática', status: 'Status', expiry: 'Validade' } },
    cards: { 
        title: 'Cartões de Segurança', 
        showing: 'Exibindo', 
        subtitle: 'Selecione colaboradores.', 
        goToPrint: 'Ir para Impressão', 
        selected: 'Selecionado', 
        successTitle: 'Solicitação Enviada', 
        successMsg: 'Solicitação encaminhada.', 
        noRecords: 'Sem Registros Elegíveis', 
        noRecordsSub: 'Apenas registros aprovados aparecem aqui.', 
        selectAll: 'Selecionar Todos', 
        sending: 'Enviando...', 
        requestButton: 'Solicitar Cartões', 
        validation: { ineligible: 'Colaborador inelegível.', maxSelection: 'Max 8 cartões.', incomplete: 'Incompleto' },
        eligibility: {
            failedTitle: 'Verificação de Elegibilidade Falhou',
            failedMsg: 'Você não atende aos requisitos para um cartão. Verifique se seu ASO é válido e se passou em todos os treinamentos.',
            checkReqs: 'Ver Requisitos'
        }
    },
    trainer: { title: 'Entrada do Instrutor', subtitle: 'Inserir notas.', passMark: 'Aprovação: 70%', loggedInAs: 'Logado como', selectSession: 'Selecione Sessão', noSessions: 'Sem sessões.', chooseSession: 'Escolha sessão...', dlWarning: 'Verificar Carta p/ RAC 02.', saveResults: 'Salvar Resultados', table: { employee: 'Colaborador', attendance: 'Presente', dlCheck: 'Verif. Carta', verified: 'Verificado', theory: 'Teoria', practical: 'Prática', rac02Only: '(RAC 02)', status: 'Status' } },
    users: { title: 'Gestão de Usuários', subtitle: 'Gerenciar acesso.', addUser: 'Adicionar Usuário', table: { user: 'Usuário', role: 'Função', status: 'Status', actions: 'Ações' }, modal: { title: 'Adicionar Usuário', name: 'Nome', email: 'Email', createUser: 'Criar' } },
    schedule: { title: 'Agenda de Treinamento', subtitle: 'Gerenciar sessões.', newSession: 'Nova Sessão', table: { date: 'Data/Hora', rac: 'RAC', room: 'Local', trainer: 'Instrutor' }, modal: { title: 'Agendar', racType: 'RAC', date: 'Data', startTime: 'Início', location: 'Local', capacity: 'Cap', instructor: 'Instr', saveSession: 'Salvar', language: 'Idioma', english: 'Inglês', portuguese: 'Português' } },
    settings: { title: 'Configurações', subtitle: 'Config.', saveAll: 'Salvar', saving: 'Salvando...', tabs: { general: 'Geral', trainers: 'Instrutores', racs: 'RACs', sites: 'Locais', companies: 'Empresas' }, rooms: { title: 'Salas', name: 'Nome', capacity: 'Cap', new: 'Nova Sala' }, trainers: { title: 'Instrutores', name: 'Nome', qualifiedRacs: 'RACs', new: 'Novo Instrutor' }, racs: { title: 'RACs', code: 'Código', description: 'Desc', new: 'Novo RAC' } },
    reports: { title: 'Relatórios', subtitle: 'Análises.', printReport: 'Imprimir', filters: { period: 'Período', department: 'Dept', racType: 'RAC', startDate: 'Início', endDate: 'Fim' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Anual', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva IA', trainerMetrics: { title: 'Métricas Instrutor', name: 'Instrutor', sessions: 'Sessões', passRate: 'Taxa Aprov.', avgTheory: 'Teoria', avgPrac: 'Prática' } },
    logs: { title: 'Logs do Sistema', levels: { all: 'Todos', info: 'Info', warn: 'Aviso', error: 'Erro', audit: 'Auditoria' }, table: { level: 'Nível', timestamp: 'Data/Hora', user: 'Usuário', message: 'Mensagem' } },
    adminManual: {
      title: 'Manual do Sistema',
      subtitle: 'Guia do Administrador para Configuração e Lógica',
      slides: {
        intro: 'Introdução',
        objectives: 'Objetivos e Escopo',
        logic: 'Lógica de Conformidade',
        workflow: 'Fluxo de Dados',
        config: 'Configuração do Sistema',
        booking: 'Regras de Agendamento',
        advanced: 'Recursos Avançados',
        troubleshoot: 'Resolução de Problemas',
        hierarchy: 'Hierarquia e Faturamento'
      },
      content: {
        confidential: 'CONFIDENCIAL',
        production: 'PRODUÇÃO v2.5',
        objectives: {
          title: 'Objetivos e Escopo',
          problemTitle: 'Desafios Atuais',
          solutionTitle: 'Soluções do Sistema',
          p1Title: 'Integridade de Dados',
          p1Desc: 'Planilhas Excel fragmentadas levam a falhas de conformidade e perda de registros.',
          p2Title: 'Prazos de Conformidade',
          p2Desc: 'O rastreamento manual falha em detectar vencimentos antes do bloqueio do site.',
          p3Title: 'Carga Administrativa',
          p3Desc: 'Equipes de HSE gastam 40% do tempo cruzando listas manualmente.',
          s1Title: 'Verdade Central',
          s1Desc: 'Banco de dados único e imutável para todos os dados de treinamento, saúde e operacionais.',
          s2Title: 'Auto-Aplicação',
          s2Desc: 'O bloqueio lógico impede automaticamente o acesso se qualquer requisito expirar.',
          s3Title: 'Eficiência',
          s3Desc: 'Redução de 85% no tempo administrativo via processamento em lote e auto-agendamento.'
        },
        formulaTitle: 'A Fórmula de Conformidade',
        formulaDesc: 'O sistema aplica estritamente uma porta lógica E. Se qualquer variável (Status, Data ASO, ou qualquer Treinamento RAC exigido) estiver faltando ou expirado, o resultado padrão é BLOQUEADO.',
        formulaLogic: {
          active: 'Status Ativo',
          aso: 'ASO Válido',
          racs: 'RACs Exigidos',
          result: 'ACESSO LIBERADO'
        },
        flowTitle: 'Fluxo de Dados Principal',
        flowSteps: {
          db: 'Banco de Dados',
          dbDesc: 'Definir Requisitos do Colaborador',
          book: 'Agendamento',
          bookDesc: 'Agendar Sessão de Treinamento',
          res: 'Resultados',
          resDesc: 'Capturar Nota e Presença',
          stat: 'Status',
          statDesc: 'Auto-Calcular Conformidade'
        },
        configTitle: 'Configuração do Sistema',
        configCards: {
          racs: 'Definições de RAC',
          racsDesc: 'Defina os módulos (ex: RAC 01, PTS). Aviso: Excluir um RAC aqui remove a coluna da matriz do banco de dados.',
          rooms: 'Salas e Capacidade',
          roomsDesc: 'Defina limites físicos para salas de aula para evitar superlotação durante a fase de agendamento.',
          trainers: 'Instrutores e Aut.',
          trainersDesc: 'Registre instrutores e autorize-os para módulos específicos. Apenas instrutores autorizados aparecem nas listas.'
        },
        bookingTitle: 'Regras de Agendamento',
        matrixLock: 'Bloqueio da Matriz',
        matrixDesc: 'O sistema impede o agendamento de treinamentos que não são exigidos pelo perfil do colaborador.',
        gradingTitle: 'Padrões de Avaliação',
        gradingText: 'Nota de corte é 70%. Presença é obrigatória. Tentativas falhas exigem re-agendamento.',
        rac02Title: 'Específicos RAC 02',
        rac02Text: 'Requer verificação da Carta de Condução. Se expirada, o sistema reprova o aluno automaticamente.',
        expiryTitle: 'Auto-Expiração',
        expiryText: 'Certificações são válidas por 2 anos. O re-treinamento é sinalizado 30 dias antes.',
        advancedTitle: 'Recursos Avançados',
        autoBook: 'Motor de Auto-Agendamento',
        autoBookDesc: 'O sistema detecta colaboradores expirando em < 7 dias e reserva automaticamente a próxima vaga.',
        aiRep: 'Relatórios IA',
        aiRepDesc: 'Gera resumos executivos usando Gemini 1.5 Pro para identificar departamentos de alto risco.',
        alc: 'Controle de Álcool',
        alcDesc: 'Roteiro de integração IoT para bloqueio de bafômetro em catracas.',
        tsTitle: 'Resolução de Problemas',
        ts1: 'Pesquisa não encontrada?',
        ts1Desc: 'Garanta que o ID do Colaborador corresponda exatamente à importação CSV.',
        ts2: 'Status Bloqueado?',
        ts2Desc: 'Verifique a data do ASO (Médico). ASO expirado bloqueia o acesso independentemente do treinamento.',
        ts3: 'Erro no Scan QR?',
        ts3Desc: 'Verifique se o dispositivo tem acesso à internet para consultar o banco de dados ao vivo.',
        hierarchy: {
            title: 'Organograma e Faturamento',
            billingTitle: 'Modelo de Faturamento SaaS',
            billingDesc: 'A plataforma usa uma estrutura de faturamento baseada em função. Assentos administrativos são gratuitos. Cobranças aplicam-se apenas a usuários finais rastreados no sistema.',
            cost: '$2.00',
            perUser: 'por Usuário Geral / Mês',
            roles: {
                sysAdmin: 'Admin do Sistema (Dono SaaS)',
                entAdmin: 'Admin Corporativo (HQ Cliente)',
                siteAdmin: 'Admin de Site (Gestor Local)',
                ops: 'Admins Operacionais (RAC/Dept/Instrutores)',
                user: 'Usuário Geral (Faturável)'
            }
        }
      }
    },
    // ... proposal ...
    proposal: {
      digitalTrans: 'Transformação Digital',
      aboutMe: {
        title: 'Sobre o Desenvolvedor',
        name: 'Pita Domingos',
        preferred: 'Chame-me de Peter',
        role: 'Desenvolvedor Full Stack',
        cert: 'Arquiteto de Soluções Certificado',
        bio: 'Especialista em sistemas de segurança de nível empresarial e transformação digital para o setor de mineração. Focado em arquiteturas de conformidade sem tempo de inatividade.'
      },
      scenario: {
        title: 'Cenário Real',
        workflowTitle: 'Fluxo Sem Interrupções',
        riskTitle: 'O Risco',
        riskText: 'O operador Paulo Manjate tem uma certificação crítica RAC 02 expirando em 3 dias. Bloqueio iminente.',
        autoFixTitle: 'A Correção',
        autoFixText: 'Sistema detecta risco < 7 Dias. Reserva automaticamente vaga na próxima sessão (Amanhã).',
        autoFixNote: '// Sem intervenção humana.',
        demoTitle: 'Demo Ao Vivo',
        demoText: 'Verifique o Painel. Você verá um alerta de Ação Pendente para Paulo Manjate.',
        demoButton: 'Ir para Painel'
      },
      execSummary: {
        title: 'Resumo Executivo',
        text: 'O Gestor CARS centraliza dados de segurança, automatizando a lógica de conformidade para eliminar erros humanos e evitar bloqueios de site.',
        quote: '"Segurança não é apenas uma prioridade, é uma constante operacional."'
      },
      objectives: {
        title: 'Objetivos Estratégicos',
        problemTitle: 'O Problema',
        problemText: 'O rastreamento manual via Excel leva à fragmentação de dados, vencimentos perdidos e gargalos administrativos.',
        solutionTitle: 'A Solução',
        goals: [
          'Fonte de Verdade Unificada',
          'Lógica de Conformidade Automatizada',
          'Análise em Tempo Real',
          'Arquitetura Escalável'
        ]
      },
      organogram: {
        title: 'Organograma do Sistema',
        pm: 'Gerente de Projeto',
        delivery: 'Entrega de Serviço',
        tech1: 'Engenheiro Frontend',
        tech2: 'Engenheiro Backend',
        regime: 'Regime Híbrido'
      },
      timeline: {
        title: 'Cronograma do Projeto',
        phase1: 'Fase 1: Fundação',
        phase1desc: 'Design de Banco de Dados & Lógica Central',
        phase2: 'Fase 2: Desenvolvimento',
        phase2desc: 'Frontend & Integração API',
        phase3: 'Fase 3: Testes',
        phase3desc: 'UAT & Auditoria de Segurança',
        phase4: 'Fase 4: Implantação',
        phase4desc: 'Go-Live & Treinamento'
      },
      techStack: {
        title: 'Stack Tecnológico',
        frontendTitle: 'Frontend',
        frontend: 'React + TypeScript + Tailwind',
        backendTitle: 'Lógica Backend',
        backend: 'Node.js (Pronto para Serverless)',
        databaseTitle: 'Persistência de Dados',
        database: 'Banco de Dados em Nuvem Escalável',
        securityTitle: 'Segurança',
        security: 'RBAC & Criptografia'
      },
      financials: {
        title: 'Investimento Financeiro',
        items: [
          { name: 'Arquitetura e Desenvolvimento de Software', type: 'Único', cost: '$20,000.00' },
          { name: 'Design UI/UX e Prototipagem', type: 'Único', cost: '$8,000.00' },
          { name: 'Configuração de Infraestrutura em Nuvem', type: 'Mensal', cost: '$5,000.00' },
          { name: 'Treinamento e Documentação', type: 'Único', cost: '$10,000.00' },
          { name: 'Taxa de Manutenção e Gestão', type: 'Mensal', cost: '$15,000.00' }
        ]
      },
      roadmap: {
        title: 'Roteiro Futuro',
        auth: 'Integração SSO',
        authDesc: 'Conectar com AD Corporativo',
        db: 'Migração',
        dbDesc: 'Mover para SQL Empresarial',
        email: 'Notificações',
        emailDesc: 'Alertas de Email Automatizados',
        hosting: 'Suporte PWA',
        hostingDesc: 'Acesso Móvel Offline'
      },
      futureUpdates: {
        title: 'Módulo de Controle de Álcool',
        desc: 'Integração com Bafômetros IoT para automatizar acesso em catracas.'
      },
      enhancedCaps: {
        title: 'Capacidades Aprimoradas',
        mobileVerify: { title: 'Verificação Móvel', desc: 'Inspetores de campo podem verificar status instantaneamente via scan QR.' },
        autoBooking: { title: 'Auto-Agendamento', desc: 'O sistema reserva vagas para colaboradores expirando automaticamente.' },
        massData: { title: 'Ops de Dados em Massa', desc: 'Importar/Exportar milhares de registros via CSV.' },
        auditLogs: { title: 'Trilhas de Auditoria', desc: 'Cada ação é registrada para responsabilidade.' },
        smartBatching: { title: 'Lote Inteligente', desc: 'Agrupar colaboradores por data de validade para sessões de renovação.' },
        matrixCompliance: { title: 'Conformidade de Matriz', desc: 'Mapa de calor visual de conformidade entre departamentos.' }
      },
      conclusion: {
        title: 'Conclusão',
        text: 'Este sistema transforma a segurança de um fardo reativo em um ativo estratégico proativo.'
      },
      thankYou: {
        title: 'Obrigado',
        contact: 'peter@digisols.com',
        phone: '+258 84 5479 481'
      }
    }
  }
};
