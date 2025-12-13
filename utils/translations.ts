
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
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start', endDate: 'End' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Anual', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva IA', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessões', passRate: 'Taxa Aprov.', avgTheory: 'Teoria', avgPrac: 'Prática' } },
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
    adminManual: {
      title: 'System Manual',
      subtitle: 'Administrator Guide',
      slides: { intro: 'Introduction', hierarchy: 'Hierarchy & Access Model', objectives: 'Objectives', logic: 'Logic', workflow: 'Workflow', config: 'Config', booking: 'Booking', advanced: 'Advanced', troubleshoot: 'Troubleshoot' },
      content: {
          confidential: 'CONFIDENTIAL', production: 'PRODUCTION v2.5',
          hierarchy: {
              title: 'System Organogram & Access Model', 
              billingTitle: 'Investment & Subscriptions', 
              billingDesc: 'Core administrative roles (System, Enterprise, Site Admins, and Trainers) are integrated into the core investment plan to ensure successful system implementation. General User access (Self-Service) is an optional subscription based on company policy.', 
              cost: 'Included', 
              perUser: 'Core Roles Integrated', 
              roles: { sysAdmin: 'System Admin', entAdmin: 'Enterprise Admin', siteAdmin: 'Site Admin', ops: 'Operational Admins', user: 'General User (Subscription)' }
          },
          objectives: { title: 'Objectives & Scope', problemTitle: 'Challenges', solutionTitle: 'Solutions', p1Title: 'Data Integrity', p1Desc: 'Decentralized spreadsheets led to version conflicts.', p2Title: 'Compliance Timing', p2Desc: 'Gap between training completion and site access.', p3Title: 'Admin Load', p3Desc: 'Manual data entry consumed 40+ hrs/week.', s1Title: 'Central Truth', s1Desc: 'Single cloud-based database for all entities.', s2Title: 'Auto-Enforcement', s2Desc: 'Real-time expiry calculation prevents unauthorized access.', s3Title: 'Efficiency', s3Desc: 'Self-service tools and auto-booking reduce admin load by 80%.' },
          formulaTitle: 'Compliance Formula', formulaDesc: 'AND Logic Gate.', formulaLogic: { active: 'Active', aso: 'Valid ASO', racs: 'Required RACs', result: 'ACCESS GRANTED' },
          flowTitle: 'Core Data Flow', flowSteps: { db: 'Database', dbDesc: 'Requirements', book: 'Booking', bookDesc: 'Schedule', res: 'Results', resDesc: 'Scores', stat: 'Status', statDesc: 'Calculate' },
          configTitle: 'System Config', configCards: { racs: 'RAC Definitions', racsDesc: 'Define critical safety modules.', rooms: 'Rooms', roomsDesc: 'Manage physical capacity.', trainers: 'Trainers', trainersDesc: 'Authorize grading staff.' },
          bookingTitle: 'Booking Rules', matrixLock: 'Matrix Lock', matrixDesc: 'Prevent booking of non-required trainings to save costs.', gradingTitle: 'Grading', gradingText: 'Automated Pass/Fail thresholds.', rac02Title: 'RAC 02', rac02Text: 'Strict DL verification required.', expiryTitle: 'Auto-Expiry', expiryText: '2-Year validity set automatically.',
          advancedTitle: 'Advanced Capabilities', autoBook: 'Auto-Booking', autoBookDesc: 'Proactive expiry management.', aiRep: 'AI Reporting', aiRepDesc: 'Generative insights on safety trends.', alc: 'Alcohol Control', alcDesc: 'IoT integration roadmap for breathalyzers.',
          tsTitle: 'Troubleshooting', ts1: 'Search Not Found', ts1Desc: 'Verify Record ID spelling.', ts2: 'Blocked Status', ts2Desc: 'Check ASO and DL dates.', ts3: 'QR Scan', ts3Desc: 'Requires network access.'
      }
    },
    proposal: {
        title: "Project Proposal: CARS Manager",
        subtitle: "Digital Transformation Initiative",
        header: {
            to: "To: The Management Team\nVulcan Mining Operations\nTete, Mozambique",
            date: "12/11/2025",
            ref: "VUL-PROP-2025-V4",
            subject: "Subject: Proposal for Digital Safety Management System Implementation"
        },
        foreword: {
          title: "1. Executive Summary",
          intro: "We are pleased to submit this proposal for the development and implementation of the CARS Manager. This comprehensive digital solution is designed to streamline your Critical Activity Requisitions (RAC) training management, ensuring 100% compliance visibility and operational efficiency.",
          overviewTitle: "Overview & SaaS Capabilities",
          overviewText: "The CARS Manager is a bespoke web-based platform designed to digitize the end-to-end process of safety training management. From scheduling sessions to grading results and issuing ID cards, the system provides a single source of truth for HSE compliance. It replaces manual spreadsheets and paper records with a secure, automated database accessible by System Admins, RAC Trainers, and Department Leads. Now evolved into a Multi-Tenant SaaS platform, it enables centralized management for multiple enterprises while maintaining strict data isolation."
        },
        objectives: {
          title: "2. Project Objectives",
          subtitle: "Current Problem vs Our Solution",
          problem: "Reliance on manual spreadsheets leads to data inconsistency, difficulty in tracking expiring certifications, and delays in issuing physical cards. There is no real-time visibility into workforce readiness.",
          items: [
            { title: "Centralized Database", desc: "For 15,000+ Employees across multiple tenants." },
            { title: "Automated Expiration", desc: "Notifications and status updates." },
            { title: "Digital & Physical Cards", desc: "Unified issuance workflow." },
            { title: "RBAC", desc: "Role-Based Access Control for security." },
            { title: "AI-Powered Analytics", desc: "Safety insights via Gemini AI." },
            { title: "SaaS Multi-Tenancy", desc: "Scalable architecture for Enterprise management." }
          ]
        },
        organogram: {
            title: "3. Project Organogram",
            pm: "Project Manager (Delivery Lead)",
            tech1: "Technician 1 (Full-Stack Dev)",
            tech2: "Technician 2 (Database/Deploy)"
        },
        roles: {
          title: "4. User Roles & Permissions",
          items: [
            { role: "System Admin", desc: "Full access to all settings, user management, and configuration." },
            { role: "Enterprise Admin", desc: "Client HQ level. Manages sites, sub-contractors, and branding." },
            { role: "RAC Admin", desc: "Manages training schedules, approves results, and oversees compliance." },
            { role: "Dept Admin", desc: "Read-only access for their department. Can request cards for their team." },
            { role: "RAC Trainer", desc: "Can only view assigned sessions and input grades/attendance." },
            { role: "General User", desc: "Can view their own status and request card replacement." }
          ]
        },
        timeline: {
          title: "5. Implementation Timeline",
          subtitle: "12-Week Delivery Plan",
          phases: [
            { title: "Phase 1: Discovery & Design", weeks: "Weeks 1-2", desc: "Requirement gathering, UI/UX prototyping, and database schema design." },
            { title: "Phase 2: Core Development", weeks: "Weeks 3-8", desc: "Development of Scheduling Module, Database, and Grading System." },
            { title: "Phase 3: Testing & QA", weeks: "Weeks 9-10", desc: "User Acceptance Testing (UAT), bug fixing, and load testing." },
            { title: "Phase 4: Deployment", weeks: "Weeks 11-12", desc: "Production deployment, admin training sessions, and handover." }
          ]
        },
        techStack: {
            title: "6. Technical Stack",
            items: [
                { name: "Frontend", desc: "React (TypeScript), Tailwind CSS, Lucide Icons" },
                { name: "Backend Logic", desc: "Node.js, RESTful Architecture, Serverless Functions" },
                { name: "Database", desc: "PostgreSQL / SQL Server (Production Ready)" },
                { name: "Security", desc: "JWT Authentication, Role-Based Access Control, Data Encryption" }
            ]
        },
        costs: {
          title: "7. Financial Investment",
          subtitle: "Initial: $38,000.00 | Monthly: $20,000.00",
          items: [
            { item: "Software Architecture & Development", type: "Once-off (Initial Payment)", cost: "$20,000.00" },
            { item: "UI/UX Design & Prototyping", type: "Once-off (Initial Payment)", cost: "$8,000.00" },
            { item: "Cloud Structure Setup & Subscription", type: "Monthly (Starts Post-UAT)", cost: "$5,000.00" },
            { item: "Training & Documentation", type: "Once-off (Post-Deployment)", cost: "$10,000.00" },
            { item: "Maintenance & Management Fee", type: "Monthly", cost: "$15,000.00" }
          ]
        },
        roadmap: {
            title: "8. Future Roadmap",
            items: [
                { title: "SSO Integration", desc: "Connect with Azure AD for Single Sign-On." },
                { title: "Cloud Migration", desc: "Move from on-premise to Azure/AWS for scalability." },
                { title: "Automated Emails", desc: "Send PDF certificates directly to employee email." },
                { title: "Mobile App", desc: "Native Android/iOS app for field verification." }
            ]
        },
        ai: {
            title: "9. AI & Smart Features",
            items: [
                { title: "Safety Advisor Chatbot", desc: "An embedded AI assistant that answers questions about RAC standards and safety protocols." },
                { title: "Automated Reporting", desc: "AI analyzes monthly trends to identify high-risk departments and suggest interventions." }
            ]
        },
        alcohol: {
            title: "10. Alcohol & IoT Integration",
            items: [
                { title: "Software Integration", desc: "API Endpoints for Breathalyzer Data, 'Fitness-for-Duty' Dashboard Widget." },
                { title: "Infrastructure", desc: "Civil Works (Turnstile modification), Electrical & Cabling, Face-ID Breathalyzer Hardware." }
            ]
        },
        enhanced: {
            title: "11. Enhanced Operational Capabilities",
            items: [
                { title: "Mobile Verification", desc: "Digital Passport scanning via QR." },
                { title: "Intelligent Auto-Booking", desc: "Automated scheduling based on expiry (<7 days)." },
                { title: "Mass Data Management", desc: "Bulk CSV import/export tools." },
                { title: "System Audit Trails", desc: "Comprehensive logging of all system activities." }
            ]
        },
        conclusion: {
            title: "12. Conclusion",
            text: "The CARS Manager represents a significant step forward for operational safety excellence. By digitizing these critical workflows, Vulcan Mining will not only ensure compliance but also foster a culture of transparency and efficiency. We are committed to delivering a world-class solution that meets your rigorous standards."
        },
        thankYou: { 
            title: 'Contact Us', 
            contact: 'pita.domingos@zd044.onmicrosoft.com', 
            phone: '+258 845479481',
            address: 'Perto de O Puarrou - Bairro Chingodzi, Tete',
            company: 'DigiSol Orbit'
        }
    }
  },
  pt: {
    proposal: {
        title: "Proposta de Projeto: Gestor de RACS",
        subtitle: "Iniciativa de Transformação Digital",
        header: {
            to: "Para: A Equipe de Gestão\nOperações de Mineração Vulcan\nTete, Moçambique",
            date: "12/11/2025",
            ref: "VUL-PROP-2025-V4",
            subject: "Assunto: Proposta para Implementação do Sistema de Gestão de Segurança Digital"
        },
        foreword: {
          title: "1. Resumo Executivo",
          intro: "Temos o prazer de submeter esta proposta para o desenvolvimento e implementação do Gestor de RACS (CARS Manager). Esta solução digital abrangente foi projetada para otimizar a gestão de treinamentos de Requisitos de Atividade Crítica (RAC), garantindo 100% de visibilidade de conformidade e eficiência operacional.",
          overviewTitle: "Visão Geral e Capacidades SaaS",
          overviewText: "O Gestor de RACS é uma plataforma baseada na web feita sob medida para digitalizar o processo de ponta a ponta da gestão de treinamento de segurança. Desde o agendamento de sessões até a classificação de resultados e emissão de cartões de identificação, o sistema fornece uma única fonte de verdade para a conformidade de HSE. Ele substitui planilhas manuais e registros em papel por um banco de dados seguro e automatizado acessível por Administradores de Sistema, Treinadores de RAC e Líderes de Departamento."
        },
        conclusion: {
            title: "12. Conclusão",
            text: "O Gestor de RACS representa um passo significativo para a excelência em segurança operacional. Ao digitalizar esses fluxos de trabalho críticos, a Vulcan Mining não apenas garantirá a conformidade, mas também promoverá uma cultura de transparência e eficiência. Estamos comprometidos em fornecer uma solução de classe mundial que atenda aos seus rigorosos padrões."
        }
    }
  }
};
