
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
      alcohol: 'Alcohol Control',
      systemHealth: 'System Health'
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
      allTenants: 'All Tenants',
      allCompanies: 'All Companies',
      allContractors: 'All Contractors',
      allSites: 'All Sites',
      allDepts: 'All Departments',
      allRacs: 'All RACs',
      allStatus: 'All Status',
      allTrainers: 'All Trainers',
      selectSite: 'Select Site',
      selectRoom: 'Select Room',
      selectInstructor: 'Select Instructor',
      unknown: 'Unknown',
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
      tenants: 'Tenants',
      contractors: 'Contractors',
      sites: 'Sites',
      depts: 'Departments'
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
    systemHealth: {
        title: 'System Health Monitor',
        subtitle: 'Real-time infrastructure telemetry & error tracking.',
        uptime: 'System Uptime',
        latency: 'Avg Latency',
        errors: 'Error Rate',
        services: 'Service Status',
        database: 'Database',
        ai: 'AI Engine',
        auth: 'Auth Provider',
        storage: 'Blob Storage',
        cpu: 'CPU Usage',
        memory: 'Memory Usage',
        recentAlerts: 'Recent System Alerts',
        online: 'Online',
        degraded: 'Degraded',
        offline: 'Offline'
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
    siteGovernance: {
      title: 'Site Governance',
      subtitle: 'Define mandatory safety training policies per location.',
      selectSite: 'Select Operation Site',
      configure: 'Configure Mandatory RACs',
      policyUpdate: 'Policy updated for {site}. Requirements pushed to employees.'
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
    users: { 
        title: 'User Management', 
        subtitle: 'Manage access and roles.', 
        addUser: 'Add User', 
        table: { user: 'User', role: 'Role', status: 'Status', actions: 'Actions' }, 
        modal: { title: 'Add User', name: 'Name', email: 'Email', createUser: 'Create', selectSite: 'Assign Site', siteRequired: 'Site assignment required for this role', count: 'Current Admins' },
        limitError: 'Limit Reached: Maximum 3 RAC Admins allowed per site. Please contact the System Admin to request an increase for this Enterprise.'
    },
    schedule: { title: 'Training Schedule', subtitle: 'Manage sessions.', newSession: 'New Session', table: { date: 'Date/Time', rac: 'RAC', room: 'Location', trainer: 'Instructor' }, modal: { title: 'Schedule', racType: 'RAC', date: 'Date', startTime: 'Start', location: 'Loc', capacity: 'Cap', instructor: 'Instr', saveSession: 'Save', language: 'Language', english: 'English', portuguese: 'Portuguese' } },
    settings: { title: 'Settings', subtitle: 'Config.', saveAll: 'Save', saving: 'Saving...', tabs: { general: 'Geral', trainers: 'Trainers', racs: 'RACs', sites: 'Sites', companies: 'Companies', branding: 'Branding', contractors: 'Contractors' }, rooms: { title: 'Rooms', name: 'Name', capacity: 'Cap', new: 'New Room' }, trainers: { title: 'Trainers', name: 'Name', qualifiedRacs: 'RACs', new: 'New Trainer' }, racs: { title: 'RACs', code: 'Code', description: 'Desc', new: 'New RAC' } },
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Início', endDate: 'Fim' }, periods: { weekly: 'Weekly', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, generate: 'Generate AI', analyzing: 'Analyzing...', stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, charts: { performance: 'Performance' }, executiveAnalysis: 'Executive AI Analysis', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prática' } },
    logs: { title: 'System Logs', levels: { all: 'All Levels', info: 'Info', warn: 'Warning', error: 'Error', audit: 'Audit' }, table: { level: 'Level', timestamp: 'Timestamp', user: 'User', message: 'Message' } },
    manuals: {
      title: 'User Manuals',
      subtitle: 'Role-based guides for system usage.',
      sysAdmin: {
        title: 'System Administrator',
        subtitle: 'Full System Control',
        configTitle: 'System Configuration',
        configDesc: 'Setup initial parameters for the entire platform.',
        rooms: 'Define Training Rooms',
        trainers: 'Register Trainers',
        racs: 'Configure RAC Definitions',
        dbTitle: 'Database Management',
        dbDesc: 'Manage the master employee records.',
        restrictionWarning: 'Ensure Matrix Columns align with RAC definitions.',
        csv: 'Use the import template for bulk data.',
        active: 'Toggle Active Status to manage licenses.'
      },
      racAdmin: {
        title: 'RAC Administrator',
        subtitle: 'Training Schedule Management',
        schedTitle: 'Scheduling',
        schedDesc: 'Create and manage training sessions.',
        create: 'Create Session',
        lang: 'Set Language (PT/EN)',
        autoTitle: 'Auto-Booking',
        autoDesc: 'Handle system-generated bookings.',
        approve: 'Review and approve auto-bookings promptly.',
        renewTitle: 'Renewals',
        renewDesc: 'Process expiring certifications.'
      },
      racTrainer: {
        title: 'RAC Trainer',
        subtitle: 'Grading & Attendance',
        inputTitle: 'Result Input',
        inputDesc: 'Enter scores and verify attendance.',
        grading: 'Mark Attendance & Scores',
        rac02: 'RAC 02 requires Driver License Verification.',
        save: 'Save Results to update Database.'
      },
      deptAdmin: {
        title: 'Department Admin',
        subtitle: 'View & Request',
        reqTitle: 'Card Requests',
        reqDesc: 'Request physical cards for compliant staff.',
        search: 'Filter by Department',
        print: 'Generate Print Batch',
        repTitle: 'Reporting',
        repDesc: 'View department compliance stats.'
      },
      user: {
        title: 'General User',
        subtitle: 'Self-Service Portal',
        statusTitle: 'My Status',
        statusDesc: 'Check your current compliance status.',
        filterAlert: 'You can only view your own records.',
        green: 'Access Granted',
        red: 'Access Denied',
        qr: 'Download Digital Passport'
      }
    },
    alcohol: {
      banner: {
        title: 'IoT Alcohol Integration',
        desc: 'Automated access control via breathalyzer integration.',
        status: 'System Ready'
      },
      features: {
        title: 'Core Features',
        iotTitle: 'IoT Connectivity',
        iotDesc: 'Direct connection to breathalyzer devices.',
        accessTitle: 'Access Control',
        accessDesc: 'Auto-block on positive reading.',
        complianceTitle: 'Compliance Log',
        complianceDesc: 'Historical record of all tests.'
      },
      protocol: {
        title: 'Safety Protocol',
        positiveTitle: 'Positive Reading',
        positiveDesc: 'Immediate gate lockout and notification to supervisor.',
        resetTitle: 'Reset Procedure',
        resetDesc: 'Manual reset required by HSE officer after secondary test.'
      },
      challenges: {
        title: 'Integration Challenges',
        oemIssue: 'Legacy hardware compatibility.',
        gateSetup: 'Physical turnstile latency.'
      },
      proposal: {
        title: 'Implementation Plan',
        faceCap: 'Facial Recognition Integration',
        integration: 'API Development',
        projectScope: 'Hardware & Cabling'
      }
    },
    proposal: {
      title: 'Digital Safety Orbit',
      subtitle: 'Technical & Commercial Proposal',
      header: {
        ref: 'Ref: VUL-DSO-2024',
        date: 'May 2024',
        subject: 'Subject: Digital Safety Transformation Proposal'
      },
      foreword: {
        title: 'Executive Summary',
        intro: 'We are pleased to present this proposal for the complete digitization of Vulcan Mining\'s Safety Training Management System. Our solution, "CARS Manager", streamlines compliance tracking, automates scheduling, and leverages AI for predictive safety insights.',
        overviewTitle: 'Project Overview',
        overviewText: 'The goal is to replace legacy spreadsheets with a centralized, multi-tenant cloud platform that enforces critical safety rules (RACs) and provides real-time visibility into workforce readiness.'
      },
      objectives: {
        title: 'Project Objectives',
        problem: 'Current manual processes lead to compliance gaps, lost records, and training bottlenecks.',
        items: [
          { title: 'Centralization', desc: 'Single source of truth for all safety data.' },
          { title: 'Automation', desc: 'Auto-renewal and expiry notifications.' },
          { title: 'Intelligence', desc: 'AI-driven reporting and risk analysis.' },
          { title: 'Mobility', desc: 'Digital ID cards and mobile verification.' }
        ]
      },
      organogram: {
        title: 'Project Organogram',
        pm: 'Project Manager',
        tech1: 'Technician 1',
        tech2: 'Technician 2'
      },
      roles: {
        title: 'Key Roles & Responsibilities',
        items: [
          { role: 'Project Manager', desc: 'Overall delivery ownership, client liaison, and timeline management.' },
          { role: 'Lead Developer', desc: 'System architecture, backend logic, and security implementation.' },
          { role: 'Support Technician', desc: 'On-site deployment, user training, and hardware integration.' }
        ]
      },
      timeline: {
        title: 'Implementation Timeline',
        subtitle: 'Phased rollout strategy',
        phases: [
          { title: 'Phase 1: Discovery & Setup', weeks: 'Weeks 1-2', desc: 'Requirements gathering and environment provisioning.' },
          { title: 'Phase 2: Development', weeks: 'Weeks 3-8', desc: 'Core module development and integration.' },
          { title: 'Phase 3: Testing & Training', weeks: 'Weeks 9-10', desc: 'UAT and user onboarding sessions.' },
          { title: 'Phase 4: Go Live', weeks: 'Week 11', desc: 'Production deployment and handover.' }
        ]
      },
      techStack: {
        title: 'Technology Stack',
        items: [
          { name: 'React', desc: 'Frontend Framework' },
          { name: 'TypeScript', desc: 'Type Safety' },
          { name: 'Tailwind CSS', desc: 'Styling Engine' },
          { name: 'Gemini AI', desc: 'Artificial Intelligence' }
        ]
      },
      costs: {
        title: 'Investment Summary',
        subtitle: 'Proposed Budget',
        items: [
          { item: 'Software License (Annual)', type: 'SaaS Subscription', cost: '$12,000' },
          { item: 'Implementation & Setup', type: 'One-time Fee', cost: '$5,000' },
          { item: 'Custom Development', type: 'Professional Services', cost: '$3,500' },
          { item: 'Training & Onboarding', type: 'Professional Services', cost: '$2,000' }
        ]
      },
      roadmap: {
        title: 'Future Roadmap',
        items: [
          { title: 'IoT Integration', desc: 'Connect breathalyzers and access gates.' },
          { title: 'Mobile App', desc: 'Native iOS and Android application.' },
          { title: 'Advanced Analytics', desc: 'Predictive safety modeling.' },
          { title: 'Global Expansion', desc: 'Multi-region support.' }
        ]
      },
      ai: {
        title: 'AI Integration Strategy',
        items: [
          { title: 'Predictive Analysis', desc: 'Forecast training needs and bottlenecks.' },
          { title: 'Automated Support', desc: '24/7 AI Safety Advisor chatbot.' },
          { title: 'Smart Reporting', desc: 'Natural language report generation.' }
        ]
      },
      alcohol: {
        title: 'Alcohol Control Module',
        items: [
          { title: 'Real-time Monitoring', desc: 'Instant breathalyzer results sync.' },
          { title: 'Access Lockout', desc: 'Auto-block gate access on positive test.' },
          { title: 'Audit Trail', desc: 'Immutable log of all tests.' }
        ]
      },
      enhanced: {
        title: 'Enhanced Capabilities',
        items: [
          { title: 'Offline Mode', desc: 'PWA support for low connectivity.' },
          { title: 'Biometric Auth', desc: 'Secure login via fingerprint/face.' }
        ]
      },
      conclusion: {
        title: 'Conclusion',
        text: 'This proposal outlines a comprehensive path to modernizing Vulcan\'s safety operations. By adopting the CARS Manager, you ensure not just compliance, but a safer, more efficient working environment for all.'
      },
      thankYou: {
        title: 'Thank You',
        company: 'DigiSol Orbit',
        contact: 'Pita Domingos',
        phone: '+258 84 123 4567',
        address: 'Tete, Mozambique'
      }
    },
    adminManual: {
      title: 'Administrator Manual',
      subtitle: 'Comprehensive System Documentation',
      slides: {
        intro: 'Introduction',
        hierarchy: 'System Hierarchy',
        objectives: 'Key Objectives',
        logic: 'Core Logic',
        workflow: 'System Workflow',
        config: 'Configuration',
        booking: 'Booking Rules',
        advanced: 'Advanced Features',
        troubleshoot: 'Troubleshooting'
      },
      content: {
        confidential: 'Confidential',
        production: 'Production Ready',
        hierarchy: {
          title: 'System Hierarchy & Roles',
          roles: {
            sysAdmin: 'System Admin',
            entAdmin: 'Enterprise Admin',
            siteAdmin: 'Site Admin',
            ops: 'Operational Roles',
            user: 'End User'
          },
          billingTitle: 'Licensing Model',
          billingDesc: 'Flexible tiered pricing based on active users.',
          cost: '$2.00',
          perUser: 'Per Active User / Month'
        },
        objectives: {
          title: 'Operational Objectives',
          problemTitle: 'Current Challenges',
          p1Title: 'Fragmented Data',
          p1Desc: 'Information siloed across spreadsheets.',
          p2Title: 'Manual Compliance',
          p2Desc: 'Risk of human error in checking requirements.',
          p3Title: 'Reactive Reporting',
          p3Desc: 'Delayed insights into safety gaps.',
          solutionTitle: 'System Solutions',
          s1Title: 'Centralized DB',
          s1Desc: 'Unified employee records.',
          s2Title: 'Auto-Compliance',
          s2Desc: 'System-enforced rules for booking and access.',
          s3Title: 'Proactive AI',
          s3Desc: 'Predictive analytics for decision support.'
        },
        formulaTitle: 'Compliance Logic',
        formulaLogic: {
          active: 'Active Status',
          aso: 'Valid ASO',
          racs: 'Required RACs',
          result: 'ACCESS GRANTED'
        },
        formulaDesc: 'Access is only granted when the employee is Active, has a valid Medical Certificate (ASO), and has passed ALL mandatory RAC trainings defined for their role.',
        flowTitle: 'Workflow Process',
        flowSteps: {
          db: 'Database',
          dbDesc: 'Define requirements & import staff.',
          book: 'Booking',
          bookDesc: 'Schedule training sessions.',
          res: 'Results',
          resDesc: 'Input grades & attendance.',
          stat: 'Status',
          statDesc: 'System updates compliance.'
        },
        configTitle: 'System Configuration',
        configCards: {
          racs: 'RAC Modules',
          racsDesc: 'Define the Critical Safety Rules available for training.',
          rooms: 'Rooms',
          roomsDesc: 'Manage training locations and capacities.',
          trainers: 'Trainers',
          trainersDesc: 'Authorize staff to conduct specific modules.'
        },
        bookingTitle: 'Booking Restrictions',
        matrixLock: 'Matrix Lock',
        matrixDesc: 'Bookings are restricted based on the Employee Requirements Matrix.',
        gradingTitle: 'Grading Logic',
        gradingText: 'Pass mark is 70%. Attendance is mandatory.',
        rac02Title: 'RAC 02 Rule',
        rac02Text: 'Requires Driver License verification.',
        expiryTitle: 'Expiry Rules',
        expiryText: 'Certifications valid for 2 years.',
        advancedTitle: 'Advanced Features',
        autoBook: 'Auto-Booking',
        autoBookDesc: 'Automatically reserves slots for expiring staff.',
        aiRep: 'AI Reporting',
        aiRepDesc: 'Generates executive summaries using Gemini.',
        alc: 'Alcohol Integration',
        alcDesc: 'Connects with IoT breathalyzers.',
        tsTitle: 'Troubleshooting',
        ts1: 'User Not Found',
        ts1Desc: 'Check spelling or import status.',
        ts2: 'Access Denied',
        ts2Desc: 'Verify ASO date and RAC completion.',
        ts3: 'System Error',
        ts3Desc: 'Check internet connection and server logs.'
      }
    }
  },
  pt: {
    nav: {
      dashboard: 'Painel',
      enterpriseDashboard: 'Painel Corporativo',
      siteGovernance: 'Governança de Sites',
      database: 'Banco de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Entrada do Instrutor',
      records: 'Registros',
      users: 'Gestão de Usuários',
      schedule: 'Agendar Treinamentos',
      settings: 'Configurações do Sistema',
      requestCards: 'Solicitar Cartões CARs',
      manuals: 'Manuais do Usuário',
      adminGuide: 'Guia do Administrador',
      logs: 'Logs do Sistema',
      proposal: 'Proposta de Projeto',
      presentation: 'Modo Apresentação',
      alcohol: 'Controle de Álcool',
      systemHealth: 'Saúde do Sistema'
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
      allTenants: 'Todos Locatários',
      allCompanies: 'Todas Empresas',
      allContractors: 'Todas Contratadas',
      allSites: 'Todos Locais',
      allDepts: 'Todos Departamentos',
      allRacs: 'Todos RACs',
      allStatus: 'Todos Status',
      allTrainers: 'Todos Instrutores',
      selectSite: 'Selecionar Local',
      selectRoom: 'Selecionar Sala',
      selectInstructor: 'Selecionar Instrutor',
      unknown: 'Desconhecido',
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
      upload: 'Enviar',
      template: 'Modelo',
      import: 'Importar Dados',
      print: 'Imprimir',
      fullScreen: 'Tela Cheia',
      exitFullScreen: 'Sair da Tela Cheia',
      rowsPerPage: 'Linhas por página:',
      page: 'Página',
      of: 'de',
      siteContext: 'Contexto do Site',
      enterpriseView: 'Visão Empresarial (Todos os Sites)',
      tenants: 'Locatários',
      contractors: 'Contratadas',
      sites: 'Locais',
      depts: 'Departamentos'
    },
    verification: {
      title: 'Digital Safety Passport',
      verified: 'VERIFICADO',
      notVerified: 'NÃO CONFORME',
      notFound: 'REGISTRO NÃO ENCONTRADO',
      employeeDetails: 'Detalhes do Funcionário',
      activeRacs: 'Certificações Ativas',
      asoStatus: 'Médico (ASO)',
      dlStatus: 'Carta de Condução',
      validUntil: 'Válido Até',
      scanTime: 'Escaneado em'
    },
    dashboard: {
      title: 'Visão Geral Operacional',
      subtitle: 'Métricas de treinamento de segurança em tempo real.',
      kpi: {
        adherence: 'Adesão HSE',
        certifications: 'Total de Certificações',
        pending: 'Correção Pendente',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade de Treinamento por RAC & ASO',
        complianceSubtitle: 'Mostra status obrigatório. Verde = Válido. Vermelho = Ausente/Expirado.',
        accessTitle: 'Status Geral de Acesso da Força de Trabalho',
        compliant: 'Conforme',
        missing: 'Ausente / Expirado',
        nonCompliant: 'Não Conforme'
      },
      upcoming: {
        title: 'Próximas Sessões',
        viewSchedule: 'Ver Agenda',
        capacity: 'Capacidade',
        status: 'Status',
        date: 'Data / Hora',
        session: 'Info da Sessão'
      },
      booked: {
        title: 'Funcionários Agendados',
        tableEmployee: 'Funcionário / Empresa',
        tableRac: 'RAC Agendado',
        tableDate: 'Data',
        tableRoom: 'Sala',
        tableTrainer: 'Instrutor',
        noData: 'Nenhum agendamento correspondente aos filtros'
      },
      renewal: {
        title: 'Ação Necessária: Renovação de Treinamento',
        message: 'funcionários têm treinamentos críticos expirando em 30 dias.',
        button: 'Agendar Renovações'
      },
      autoBooking: {
        title: 'Ação Necessária: Auto-Agendamentos Pendentes',
        subPart1: 'O sistema detectou riscos de expiração',
        subPart2: 'e reservou vagas para evitar bloqueio. Aprove para finalizar.'
      }
    },
    systemHealth: {
        title: 'Monitor de Saúde do Sistema',
        subtitle: 'Telemetria de infraestrutura em tempo real e rastreamento de erros.',
        uptime: 'Tempo de Atividade',
        latency: 'Latência Média',
        errors: 'Taxa de Erros',
        services: 'Status do Serviço',
        database: 'Banco de Dados',
        ai: 'Motor de IA',
        auth: 'Provedor de Autenticação',
        storage: 'Armazenamento Blob',
        cpu: 'Uso de CPU',
        memory: 'Uso de Memória',
        recentAlerts: 'Alertas Recentes do Sistema',
        online: 'Online',
        degraded: 'Degradado',
        offline: 'Offline'
    },
    enterprise: {
        title: 'Painel de Comando Corporativo',
        subtitle: 'Visão Geral Global de Conformidade de Segurança',
        globalHealth: 'Pontuação Global de Saúde',
        totalWorkforce: 'Força de Trabalho Total',
        topPerformer: 'Melhor Desempenho',
        needsAttention: 'Requer Atenção',
        siteComparison: 'Comparação de Desempenho do Site',
        operationsOverview: 'Visão Geral de Operações',
        siteName: 'Nome do Site',
        staff: 'Equipe',
        governanceTitle: 'Governança de Sites',
        governanceSubtitle: 'Definir políticas de treinamento de segurança obrigatórias por local.',
        pushPolicy: 'Salvar e Enviar Política',
        policyApplied: 'Política Aplicada',
        deptHeatmap: 'Mapa de Calor de Risco por Departamento',
        tenantMatrix: 'Matriz de Desempenho do Locatário',
        systemView: 'VISÃO DO SISTEMA',
        bottlenecks: 'Gargalos de Treinamento',
        noBottlenecks: 'Nenhum gargalo detectado.',
        clickToGen: 'Clique em gerar para receber',
        safetyIntel: 'inteligência de segurança em nível empresarial.',
        multiTenantDiag: 'diagnóstico de segurança multi-locatário.'
    },
    siteGovernance: {
      title: 'Governança de Sites',
      subtitle: 'Definir políticas de treinamento de segurança obrigatórias por local.',
      selectSite: 'Selecionar Local de Operação',
      configure: 'Configurar RACs Obrigatórios',
      policyUpdate: 'Política atualizada para {site}. Requisitos enviados para funcionários.'
    },
    database: {
      title: 'Banco de Dados Mestre de Funcionários',
      subtitle: 'Gerenciar requisitos. RAC 02 é desativado automaticamente se DL estiver expirado.',
      filters: 'Filtros',
      accessStatus: 'Status de Acesso',
      granted: 'Concedido',
      blocked: 'Bloqueado',
      employeeInfo: 'Informações do Funcionário e DL',
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
        title: 'Editar / Transferir Funcionário',
        subtitle: 'Atualizar detalhes do funcionário. Mudar a Empresa/Depto manterá registros históricos de treinamento sob a nova entidade.',
        update: 'Atualizar Funcionário'
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
      title: 'Agendar Sessão de Treinamento',
      secureMode: 'Modo de Entrada de Dados Seguro',
      manageSchedule: 'Gerenciar Agenda',
      dlRequired: 'Detalhes da Carta de Condução necessários para RAC 02',
      success: 'Agendamento enviado com sucesso!',
      selectSession: 'Selecionar Sessão de Treinamento',
      chooseSession: 'Escolha uma sessão...',
      table: {
        no: 'Nº',
        nameId: 'Nome / ID',
        details: 'Empresa / Depto',
        dlNoClass: 'Nº DL / Classe',
        dlExpiry: 'Validade DL',
        action: 'Ação'
      },
      addRow: 'Adicionar Linha',
      submitBooking: 'Enviar Agendamento'
    },
    notifications: {
        expiryTitle: 'Treinamento Expirando',
        expiryMsg: 'Treinamento para {name} ({rac}) expira em {days} dias.',
        autoBookTitle: 'Auto-Agendamento Criado',
        autoBookMsg: '{name} foi agendado automaticamente para {rac} em {date} (expira em {days} dias).',
        autoBookFailTitle: 'Falha no Auto-Agendamento',
        autoBookFailMsg: 'Não foi possível agendar automaticamente {name} para {rac}. Nenhuma sessão disponível encontrada.',
        capacityTitle: 'Sessão Cheia - Alocação Automática',
        capacityMsg: 'funcionários foram movidos para a próxima sessão disponível em',
        demandTitle: 'Alerta de Alta Demanda',
        demandMsg: 'Alta demanda detectada para',
        duplicateTitle: 'Agendamento Duplicado',
        duplicateMsg: 'Usuário já agendado para este tipo de treinamento.'
    },
    ai: {
        systemPromptAdvice: "Você é um Consultor de Segurança especialista para a Vulcan Mining. Você se especializa nas Regras de Atividade Crítica (RACs). Responda à pergunta do usuário sobre {rac}. Forneça conselhos concisos e acionáveis. Mantenha menos de 100 palavras. Idioma: {language}.",
        systemPromptReport: "Você é um Analista de Dados de HSE. Analise as seguintes estatísticas de treinamento para o período {language}. Destaque as principais tendências, riscos e recomendações. Mantenha executivo e conciso."
    },
    advisor: { button: 'Consultor de Segurança', title: 'Consultor de Segurança IA CARS', sender: 'Consultor CARS', emptyState: 'Como posso ajudar?', placeholder: 'Pergunte sobre padrões RAC...' },
    results: { title: 'Registros de Treinamento', subtitle: 'Ver resultados.', searchPlaceholder: 'Pesquisar...', table: { employee: 'Funcionário', session: 'Sessão', date: 'Data', trainer: 'Instrutor', room: 'Sala', dlRac02: 'DL (RAC 02)', theory: 'Teoria', prac: 'Prática', status: 'Status', expiry: 'Validade' } },
    cards: { 
        title: 'Cartões de Segurança', 
        showing: 'Exibindo', 
        subtitle: 'Selecione funcionários.', 
        goToPrint: 'Ir para Visualização de Impressão', 
        selected: 'Selecionado', 
        successTitle: 'Solicitação Enviada', 
        successMsg: 'Solicitação de cartão encaminhada.', 
        noRecords: 'Nenhum Registro Elegível', 
        noRecordsSub: 'Apenas registros aprovados aparecem aqui.', 
        selectAll: 'Selecionar Todos', 
        sending: 'Enviando...', 
        requestButton: 'Solicitar Cartões', 
        validation: { ineligible: 'Funcionário inelegível.', maxSelection: 'Máx 8 cartões.', incomplete: 'Incompleto' },
        eligibility: {
            failedTitle: 'Falha na Verificação de Elegibilidade',
            failedMsg: 'Você não atende atualmente aos requisitos para um cartão de segurança. Certifique-se de que seu ASO é válido e que você passou em todos os treinamentos obrigatórios.',
            checkReqs: 'Verificar Requisitos'
        }
    },
    trainer: { title: 'Entrada do Instrutor', subtitle: 'Inserir notas.', passMark: 'Aprovação: 70%', loggedInAs: 'Logado como', selectSession: 'Selecionar Sessão', noSessions: 'Nenhuma sessão.', chooseSession: 'Escolha a sessão...', dlWarning: 'Verificar DL para RAC 02.', saveResults: 'Salvar Resultados', table: { employee: 'Funcionário', attendance: 'Presente', dlCheck: 'Verif. DL', verified: 'Verificado', theory: 'Teoria', practical: 'Prática', rac02Only: '(RAC 02)', status: 'Status' } },
    users: { 
        title: 'Gestão de Usuários', 
        subtitle: 'Gerenciar acesso e funções.', 
        addUser: 'Adicionar Usuário', 
        table: { user: 'Usuário', role: 'Função', status: 'Status', actions: 'Ações' }, 
        modal: { title: 'Adicionar Usuário', name: 'Nome', email: 'Email', createUser: 'Criar', selectSite: 'Atribuir Site', siteRequired: 'Atribuição de site necessária para esta função', count: 'Admins Atuais' },
        limitError: 'Limite Alcançado: Máximo de 3 Admins de RAC permitidos por site. Entre em contato com o Admin do Sistema para solicitar um aumento para esta Empresa.'
    },
    schedule: { title: 'Agenda de Treinamento', subtitle: 'Gerenciar sessões.', newSession: 'Nova Sessão', table: { date: 'Data/Hora', rac: 'RAC', room: 'Local', trainer: 'Instrutor' }, modal: { title: 'Agendar', racType: 'RAC', date: 'Data', startTime: 'Início', location: 'Local', capacity: 'Cap', instructor: 'Instr', saveSession: 'Salvar', language: 'Idioma', english: 'Inglês', portuguese: 'Português' } },
    settings: { title: 'Configurações', subtitle: 'Config.', saveAll: 'Salvar', saving: 'Salvando...', tabs: { general: 'Geral', trainers: 'Trainers', racs: 'RACs', sites: 'Locais', companies: 'Empresas', branding: 'Branding', contractors: 'Contratadas' }, rooms: { title: 'Salas', name: 'Nome', capacity: 'Cap', new: 'Nova Sala' }, trainers: { title: 'Instrutores', name: 'Nome', qualifiedRacs: 'RACs', new: 'Novo Instrutor' }, racs: { title: 'RACs', code: 'Código', description: 'Desc', new: 'Novo RAC' } },
    reports: { title: 'Relatórios', subtitle: 'Análises.', printReport: 'Imprimir', filters: { period: 'Período', department: 'Depto', racType: 'RAC', startDate: 'Início', endDate: 'Fim' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Anual', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva IA', trainerMetrics: { title: 'Métricas do Instrutor', name: 'Instrutor', sessions: 'Sessões', passRate: 'Taxa Aprov.', avgTheory: 'Teoria', avgPrac: 'Prática' } },
    logs: { title: 'Logs do Sistema', levels: { all: 'Todos Níveis', info: 'Info', warn: 'Aviso', error: 'Erro', audit: 'Auditoria' }, table: { level: 'Nível', timestamp: 'Carimbo de Data/Hora', user: 'Usuário', message: 'Mensagem' } },
    manuals: {
      title: 'Manuais do Usuário',
      subtitle: 'Guias baseados em função para uso do sistema.',
      sysAdmin: {
        title: 'Administrador do Sistema',
        subtitle: 'Controle Total do Sistema',
        configTitle: 'Configuração do Sistema',
        configDesc: 'Configurar parâmetros iniciais para toda a plataforma.',
        rooms: 'Definir Salas de Treinamento',
        trainers: 'Registrar Instrutores',
        racs: 'Configurar Definições de RAC',
        dbTitle: 'Gestão de Banco de Dados',
        dbDesc: 'Gerenciar os registros mestres de funcionários.',
        restrictionWarning: 'Garanta que as Colunas da Matriz estejam alinhadas com as definições de RAC.',
        csv: 'Use o modelo de importação para dados em massa.',
        active: 'Alternar Status Ativo para gerenciar licenças.'
      },
      racAdmin: {
        title: 'Administrador de RAC',
        subtitle: 'Gestão de Cronograma de Treinamento',
        schedTitle: 'Agendamento',
        schedDesc: 'Criar e gerenciar sessões de treinamento.',
        create: 'Criar Sessão',
        lang: 'Definir Idioma (PT/EN)',
        autoTitle: 'Auto-Agendamento',
        autoDesc: 'Lidar com agendamentos gerados pelo sistema.',
        approve: 'Revisar e aprovar auto-agendamentos prontamente.',
        renewTitle: 'Renovações',
        renewDesc: 'Processar certificações expirando.'
      },
      racTrainer: {
        title: 'Instrutor RAC',
        subtitle: 'Avaliação & Presença',
        inputTitle: 'Entrada de Resultados',
        inputDesc: 'Inserir notas e verificar presença.',
        grading: 'Marcar Presença & Notas',
        rac02: 'RAC 02 requer Verificação de Carta de Condução.',
        save: 'Salvar Resultados para atualizar Banco de Dados.'
      },
      deptAdmin: {
        title: 'Admin de Departamento',
        subtitle: 'Visualizar & Solicitar',
        reqTitle: 'Solicitações de Cartão',
        reqDesc: 'Solicitar cartões físicos para equipe conforme.',
        search: 'Filtrar por Departamento',
        print: 'Gerar Lote de Impressão',
        repTitle: 'Relatórios',
        repDesc: 'Ver estatísticas de conformidade do departamento.'
      },
      user: {
        title: 'Usuário Geral',
        subtitle: 'Portal de Autoatendimento',
        statusTitle: 'Meu Status',
        statusDesc: 'Verifique seu status atual de conformidade.',
        filterAlert: 'Você só pode visualizar seus próprios registros.',
        green: 'Acesso Concedido',
        red: 'Acesso Negado',
        qr: 'Baixar Passaporte Digital'
      }
    },
    alcohol: {
      banner: {
        title: 'Integração de Álcool IoT',
        desc: 'Controle de acesso automatizado via integração de bafômetro.',
        status: 'Sistema Pronto'
      },
      features: {
        title: 'Recursos Principais',
        iotTitle: 'Conectividade IoT',
        iotDesc: 'Conexão direta com dispositivos de bafômetro.',
        accessTitle: 'Controle de Acesso',
        accessDesc: 'Bloqueio automático em leitura positiva.',
        complianceTitle: 'Log de Conformidade',
        complianceDesc: 'Registro histórico de todos os testes.'
      },
      protocol: {
        title: 'Protocolo de Segurança',
        positiveTitle: 'Leitura Positiva',
        positiveDesc: 'Bloqueio imediato do portão e notificação ao supervisor.',
        resetTitle: 'Procedimento de Redefinição',
        resetDesc: 'Redefinição manual necessária pelo oficial de HSE após teste secundário.'
      },
      challenges: {
        title: 'Desafios de Integração',
        oemIssue: 'Compatibilidade de hardware legado.',
        gateSetup: 'Latência física do torniquete.'
      },
      proposal: {
        title: 'Plano de Implementação',
        faceCap: 'Integração de Reconhecimento Facial',
        integration: 'Desenvolvimento de API',
        projectScope: 'Hardware e Cabeamento'
      }
    },
    proposal: {
      title: 'Órbita de Segurança Digital',
      subtitle: 'Proposta Técnica e Comercial',
      header: {
        ref: 'Ref: VUL-DSO-2024',
        date: 'Maio 2024',
        subject: 'Assunto: Proposta de Transformação de Segurança Digital'
      },
      foreword: {
        title: 'Resumo Executivo',
        intro: 'Temos o prazer de apresentar esta proposta para a completa digitalização do Sistema de Gestão de Treinamento de Segurança da Vulcan Mining. Nossa solução, "Gestor CARS", agiliza o rastreamento de conformidade, automatiza o agendamento e utiliza IA para insights de segurança preditiva.',
        overviewTitle: 'Visão Geral do Projeto',
        overviewText: 'O objetivo é substituir planilhas legadas por uma plataforma centralizada na nuvem multi-locatário que aplica regras críticas de segurança (RACs) e fornece visibilidade em tempo real sobre a prontidão da força de trabalho.'
      },
      objectives: {
        title: 'Objetivos do Projeto',
        problem: 'Processos manuais atuais levam a lacunas de conformidade, perda de registros e gargalos de treinamento.',
        items: [
          { title: 'Centralização', desc: 'Fonte única de verdade para todos os dados de segurança.' },
          { title: 'Automação', desc: 'Renovação automática e notificações de expiração.' },
          { title: 'Inteligência', desc: 'Relatórios e análise de risco baseados em IA.' },
          { title: 'Mobilidade', desc: 'Cartões de identificação digitais e verificação móvel.' }
        ]
      },
      organogram: {
        title: 'Organograma do Projeto',
        pm: 'Gerente de Projeto',
        tech1: 'Técnico 1',
        tech2: 'Técnico 2'
      },
      roles: {
        title: 'Papéis e Responsabilidades Chave',
        items: [
          { role: 'Gerente de Projeto', desc: 'Propriedade geral da entrega, contato com cliente e gestão de cronograma.' },
          { role: 'Desenvolvedor Líder', desc: 'Arquitetura do sistema, lógica de backend e implementação de segurança.' },
          { role: 'Técnico de Suporte', desc: 'Implantação no local, treinamento de usuários e integração de hardware.' }
        ]
      },
      timeline: {
        title: 'Cronograma de Implementação',
        subtitle: 'Estratégia de lançamento em fases',
        phases: [
          { title: 'Fase 1: Descoberta e Configuração', weeks: 'Semanas 1-2', desc: 'Levantamento de requisitos e provisionamento de ambiente.' },
          { title: 'Fase 2: Desenvolvimento', weeks: 'Semanas 3-8', desc: 'Desenvolvimento de módulos principais e integração.' },
          { title: 'Fase 3: Testes e Treinamento', weeks: 'Semanas 9-10', desc: 'UAT e sessões de integração de usuários.' },
          { title: 'Fase 4: Go Live', weeks: 'Semana 11', desc: 'Implantação em produção e entrega.' }
        ]
      },
      techStack: {
        title: 'Pilha Tecnológica',
        items: [
          { name: 'React', desc: 'Framework Frontend' },
          { name: 'TypeScript', desc: 'Segurança de Tipo' },
          { name: 'Tailwind CSS', desc: 'Motor de Estilo' },
          { name: 'Gemini IA', desc: 'Inteligência Artificial' }
        ]
      },
      costs: {
        title: 'Resumo de Investimento',
        subtitle: 'Orçamento Proposto',
        items: [
          { item: 'Licença de Software (Anual)', type: 'Assinatura SaaS', cost: '$12,000' },
          { item: 'Implementação e Configuração', type: 'Taxa Única', cost: '$5,000' },
          { item: 'Desenvolvimento Personalizado', type: 'Serviços Profissionais', cost: '$3,500' },
          { item: 'Treinamento e Integração', type: 'Serviços Profissionais', cost: '$2,000' }
        ]
      },
      roadmap: {
        title: 'Roteiro Futuro',
        items: [
          { title: 'Integração IoT', desc: 'Conectar bafômetros e portões de acesso.' },
          { title: 'Aplicativo Móvel', desc: 'Aplicativo nativo iOS e Android.' },
          { title: 'Análise Avançada', desc: 'Modelagem de segurança preditiva.' },
          { title: 'Expansão Global', desc: 'Suporte multi-região.' }
        ]
      },
      ai: {
        title: 'Estratégia de Integração de IA',
        items: [
          { title: 'Análise Preditiva', desc: 'Prever necessidades de treinamento e gargalos.' },
          { title: 'Suporte Automatizado', desc: 'Chatbot Consultor de Segurança IA 24/7.' },
          { title: 'Relatórios Inteligentes', desc: 'Geração de relatórios em linguagem natural.' }
        ]
      },
      alcohol: {
        title: 'Módulo de Controle de Álcool',
        items: [
          { title: 'Monitoramento em Tempo Real', desc: 'Sincronização instantânea de resultados de bafômetro.' },
          { title: 'Bloqueio de Acesso', desc: 'Bloqueio automático de portão em teste positivo.' },
          { title: 'Trilha de Auditoria', desc: 'Registro imutável de todos os testes.' }
        ]
      },
      enhanced: {
        title: 'Capacidades Aprimoradas',
        items: [
          { title: 'Modo Offline', desc: 'Suporte PWA para baixa conectividade.' },
          { title: 'Auth Biométrica', desc: 'Login seguro via impressão digital/rosto.' }
        ]
      },
      conclusion: {
        title: 'Conclusão',
        text: 'Esta proposta delineia um caminho abrangente para modernizar as operações de segurança da Vulcan. Ao adotar o Gestor CARS, você garante não apenas a conformidade, mas um ambiente de trabalho mais seguro e eficiente para todos.'
      },
      thankYou: {
        title: 'Obrigado',
        company: 'DigiSol Orbit',
        contact: 'Pita Domingos',
        phone: '+258 84 123 4567',
        address: 'Tete, Moçambique'
      }
    },
    adminManual: {
      title: 'Manual do Administrador',
      subtitle: 'Documentação Abrangente do Sistema',
      slides: {
        intro: 'Introdução',
        hierarchy: 'Hierarquia do Sistema',
        objectives: 'Objetivos Chave',
        logic: 'Lógica Central',
        workflow: 'Fluxo de Trabalho do Sistema',
        config: 'Configuração',
        booking: 'Regras de Agendamento',
        advanced: 'Recursos Avançados',
        troubleshoot: 'Solução de Problemas'
      },
      content: {
        confidential: 'Confidencial',
        production: 'Pronto para Produção',
        hierarchy: {
          title: 'Hierarquia do Sistema e Funções',
          roles: {
            sysAdmin: 'Admin do Sistema',
            entAdmin: 'Admin da Empresa',
            siteAdmin: 'Admin do Local',
            ops: 'Funções Operacionais',
            user: 'Usuário Final'
          },
          billingTitle: 'Modelo de Licenciamento',
          billingDesc: 'Preços flexíveis por níveis baseados em usuários ativos.',
          cost: '$2.00',
          perUser: 'Por Usuário Ativo / Mês'
        },
        objectives: {
          title: 'Objetivos Operacionais',
          problemTitle: 'Desafios Atuais',
          p1Title: 'Dados Fragmentados',
          p1Desc: 'Informações isoladas em planilhas.',
          p2Title: 'Conformidade Manual',
          p2Desc: 'Risco de erro humano na verificação de requisitos.',
          p3Title: 'Relatórios Reativos',
          p3Desc: 'Insights atrasados sobre lacunas de segurança.',
          solutionTitle: 'Soluções do Sistema',
          s1Title: 'BD Centralizado',
          s1Desc: 'Registros unificados de funcionários.',
          s2Title: 'Auto-Conformidade',
          s2Desc: 'Regras aplicadas pelo sistema para agendamento e acesso.',
          s3Title: 'IA Proativa',
          s3Desc: 'Análise preditiva para suporte à decisão.'
        },
        formulaTitle: 'Lógica de Conformidade',
        formulaLogic: {
          active: 'Status Ativo',
          aso: 'ASO Válido',
          racs: 'RACs Obrigatórios',
          result: 'ACESSO CONCEDIDO'
        },
        formulaDesc: 'O acesso é concedido apenas quando o funcionário está Ativo, possui um Certificado Médico (ASO) válido e passou em TODOS os treinamentos RAC obrigatórios definidos para sua função.',
        flowTitle: 'Processo de Fluxo de Trabalho',
        flowSteps: {
          db: 'Banco de Dados',
          dbDesc: 'Definir requisitos e importar equipe.',
          book: 'Agendamento',
          bookDesc: 'Agendar sessões de treinamento.',
          res: 'Resultados',
          resDesc: 'Inserir notas e presença.',
          stat: 'Status',
          statDesc: 'O sistema atualiza a conformidade.'
        },
        configTitle: 'Configuração do Sistema',
        configCards: {
          racs: 'Módulos RAC',
          racsDesc: 'Definir as Regras de Atividade Crítica disponíveis para treinamento.',
          rooms: 'Salas',
          roomsDesc: 'Gerenciar locais de treinamento e capacidades.',
          trainers: 'Instrutores',
          trainersDesc: 'Autorizar funcionários a conduzir módulos específicos.'
        },
        bookingTitle: 'Restrições de Agendamento',
        matrixLock: 'Bloqueio de Matriz',
        matrixDesc: 'Agendamentos são restritos com base na Matriz de Requisitos do Funcionário.',
        gradingTitle: 'Lógica de Avaliação',
        gradingText: 'Nota de aprovação é 70%. Presença é obrigatória.',
        rac02Title: 'Regra RAC 02',
        rac02Text: 'Requer verificação de Carta de Condução.',
        expiryTitle: 'Regras de Expiração',
        expiryText: 'Certificações válidas por 2 anos.',
        advancedTitle: 'Recursos Avançados',
        autoBook: 'Auto-Agendamento',
        autoBookDesc: 'Reserva automaticamente vagas para equipe expirando.',
        aiRep: 'Relatórios IA',
        aiRepDesc: 'Gera resumos executivos usando Gemini.',
        alc: 'Integração de Álcool',
        alcDesc: 'Conecta com bafômetros IoT.',
        tsTitle: 'Solução de Problemas',
        ts1: 'Usuário Não Encontrado',
        ts1Desc: 'Verifique a ortografia ou status de importação.',
        ts2: 'Acesso Negado',
        ts2Desc: 'Verifique a data do ASO e conclusão do RAC.',
        ts3: 'Erro do Sistema',
        ts3Desc: 'Verifique a conexão com a internet e logs do servidor.'
      }
    }
  }
};
