
export type Language = 'en' | 'pt';

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  } catch (e) {
    return dateString;
  }
};

export const translations = {
  en: {
    common: {
      vulcan: 'CARS',
      all: 'All',
      search: 'Search...',
      rowsPerPage: 'Rows per page:',
      page: 'Page',
      of: 'of',
      name: 'Name',
      id: 'ID',
      // Added missing date property
      date: 'Date',
      company: 'Company',
      department: 'Department',
      jobTitle: 'Job Title',
      role: 'Role',
      actions: 'Actions',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      print: 'Print',
      download: 'Download',
      import: 'Import',
      template: 'Template',
      yes: 'Yes',
      no: 'No',
      time: 'Time',
      status: 'Status',
      recordsFound: 'records found',
      completed: 'Completed',
      timeLeft: 'left',
      passed: 'Passed',
      failed: 'Failed',
      pending: 'Pending',
      complianceRate: 'Compliance Rate',
      testsProcessed: 'Tests Processed',
      stats: {
        totalRecords: 'Total Records',
        passRate: 'Pass Rate',
        passed: 'Passed',
        failed: 'Failed',
        totalUsers: 'Total Users',
        active: 'Active',
        admins: 'Admins'
      },
      operationalMatrix: 'Operational Matrix',
      owner: 'Owner',
      sending: 'Sending...',
      smsBlast: 'SMS Blast',
      simulateRole: 'Simulate Role',
      superuser: 'Superuser Access',
      restricted: 'Restricted Access',
      enterpriseView: 'Enterprise View',
      exitFullScreen: 'Exit Full Screen',
      fullScreen: 'Full Screen',
      notifications: 'Notifications',
      noNotifications: 'No notifications',
      clearAll: 'Clear All'
    },
    nav: {
      dashboard: 'Dashboard',
      booking: 'Booking',
      records: 'Records',
      database: 'Database',
      reports: 'Reports',
      enterpriseDashboard: 'Enterprise',
      alcohol: 'Alcohol Control',
      requestCards: 'Request Cards',
      communications: 'Communications',
      schedule: 'Schedule',
      siteGovernance: 'Governance',
      trainerInput: 'Trainer Input',
      users: 'Users',
      settings: 'Settings',
      logs: 'Logs',
      manuals: 'Manuals',
      feedbackAdmin: 'Feedback',
      adminGuide: 'Admin Guide',
      presentation: 'Presentation',
      proposal: 'Proposal'
    },
    auth: {
      login: 'Login',
      logout: 'Logout'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview',
      upcoming: {
        title: 'Upcoming Sessions',
        viewSchedule: 'View Schedule',
        date: 'Date',
        session: 'Session',
        capacity: 'Capacity',
        status: 'Status'
      },
      booked: {
        title: 'Booked Employees',
        tableEmployee: 'Employee',
        tableRac: 'RAC',
        tableDate: 'Date',
        tableRoom: 'Room',
        tableTrainer: 'Trainer',
        noData: 'No bookings found'
      },
      kpi: {
        adherence: 'Adherence',
        certifications: 'Certifications',
        pending: 'Pending',
        expiring: 'Expiring',
        scheduled: 'Scheduled'
      },
      charts: {
        compliant: 'Compliant',
        nonCompliant: 'Non-Compliant',
        complianceTitle: 'Compliance Overview',
        complianceSubtitle: 'By RAC Type',
        accessTitle: 'Access Status',
        missing: 'Missing Requirements'
      },
      renewal: {
        title: 'Renewal Alerts',
        message: 'employees with training expiring within 30 days.',
        button: 'Process Renewals'
      },
      autoBooking: {
        title: 'Auto-Booking Triggered',
        subPart1: 'Employees with Critical expiry',
        subPart2: 'have been auto-booked.'
      }
    },
    booking: {
      title: 'New Booking',
      selfServiceTitle: 'Self Service Booking',
      selfServiceDesc: 'Book your own training session.',
      secureMode: 'Secure Mode Active',
      manageSchedule: 'Manage Schedule',
      success: 'Booking Submitted Successfully',
      selectSession: 'Select Session',
      chooseSession: 'Choose a session...',
      dlRequired: 'Driver License details are required for this module.',
      addRow: 'Add Employee',
      submitBooking: 'Submit Booking'
    },
    results: {
      searchPlaceholder: 'Search by Name or ID...',
      passport: 'My Passport',
      export: 'Export CSV',
      table: {
        employee: 'Employee',
        session: 'Session',
        date: 'Date',
        trainer: 'Trainer',
        theory: 'Theory',
        status: 'Status',
        expiry: 'Expiry'
      }
    },
    database: {
      title: 'Database',
      subtitle: 'Master Records',
      mappingTitle: 'Import Mapping',
      mappingSubtitle: 'Map CSV columns to system fields',
      preview: 'File Preview',
      coreData: 'Core Data',
      complianceTrain: 'Compliance & Training',
      sourceCol: 'Source Column',
      processImport: 'Process Import',
      importSuccess: 'Import Successful',
      active: 'Active',
      granted: 'Granted',
      blocked: 'Blocked',
      accessStatus: 'Access Status',
      aso: 'ASO Expiry',
      opsMatrix: 'OPS Matrix',
      cardBack: 'Card Back Preview',
      contactInfo: 'Contact Info',
      cell: 'Cell Phone',
      dlDetails: 'Driver License Details',
      number: 'Number',
      class: 'Class',
      editModal: 'Edit Employee',
      confirmDelete: 'Confirm Delete',
      confirmDeleteMsg: 'Are you sure you want to delete this record? This action cannot be undone.',
      confirmDeactivate: 'Deactivate User',
      confirmDeactivateMsg: 'Are you sure you want to deactivate this user? They will lose system access.',
      massQr: 'Mass QR Download',
      zipping: 'Zipping...',
      exportDb: 'Export DB',
      wizard: 'Import Wizard',
      importCsv: 'Import CSV',
      ops: {
          EMI_PTS: 'Emi-PTS',
          APR_ART: 'Apr-ART',
          DONO_AREA_PTS: 'Dono-Area',
          EXEC: 'Exec'
      },
      bulkQrMessage: 'This will generate and download {count} QR codes. Continue?'
    },
    reports: {
      title: 'Reports & Analytics',
      subtitle: 'Performance Metrics',
      executiveAnalysis: 'Executive AI Analysis',
      analyzing: 'Analyzing...',
      generate: 'Generate Report',
      leaderboard: 'Trainer Leaderboard',
      noShowsTitle: 'No Shows Alert',
      filters: {
        period: 'Period',
        startDate: 'Start Date',
        endDate: 'End Date',
        department: 'Department',
        racType: 'RAC Type'
      },
      periods: {
        weekly: 'Weekly',
        monthly: 'Monthly',
        ytd: 'Year to Date',
        custom: 'Custom Range'
      },
      stats: {
        totalTrained: 'Total Trained',
        passRate: 'Pass Rate',
        attendance: 'Attendance Rate',
        noShows: 'No Shows'
      },
      charts: {
        performance: 'Performance by Module',
        breakdownTitle: 'Pass vs Fail Breakdown',
        distributionTitle: 'Overall Distribution',
        distributionSubtitle: 'Global Pass/Fail Ratio',
        aiSubtitle: 'Powered by Gemini 2.5'
      },
      trainerMetrics: {
        students: 'Students',
        avgTheory: 'Avg Theory'
      },
      printReport: 'Print Report'
    },
    schedule: {
      title: 'Training Schedule',
      subtitle: 'Manage Sessions',
      newSession: 'New Session',
      modal: {
        title: 'Schedule Session',
        racType: 'RAC Type',
        date: 'Date',
        startTime: 'Start Time',
        location: 'Location',
        capacity: 'Capacity',
        instructor: 'Instructor',
        language: 'Language',
        portuguese: 'Portuguese',
        english: 'English',
        saveSession: 'Save Session'
      }
    },
    trainer: {
      title: 'Trainer Input',
      loggedInAs: 'Logged in as',
      noSessions: 'No pending sessions found.',
      selectSession: 'Select Session to Grade',
      chooseSession: 'Choose a session...',
      saveResults: 'Save Results'
    },
    users: {
      title: 'User Management',
      subtitle: 'Manage system access and roles',
      addUser: 'Add User',
      table: {
        user: 'User',
        role: 'Role',
        status: 'Status',
        actions: 'Actions'
      },
      modal: {
        title: 'Add New User',
        name: 'Full Name',
        email: 'Email Address',
        createUser: 'Create User'
      }
    },
    settings: {
      title: 'System Settings',
      globalConfig: 'Global Configuration',
      localConfig: 'Local Configuration',
      feedbackConfig: 'Feedback Widget Configuration',
      tabs: {
        general: 'General',
        trainers: 'Trainers',
        racs: 'RAC Definitions',
        sites: 'Sites',
        companies: 'Companies',
        integration: 'Integration'
      },
      rooms: {
        title: 'Training Rooms',
        new: 'New Room',
        name: 'Room Name',
        capacity: 'Capacity'
      },
      trainers: {
        title: 'Qualified Trainers',
        name: 'Trainer Name',
        new: 'New Trainer'
      },
      racs: {
        title: 'RAC Standards',
        code: 'Code',
        description: 'Description'
      },
      integrationPage: {
        title: 'Data Integration',
        sourceA: 'Source A',
        sourceB: 'Source B',
        middleware: 'Middleware Status',
        processing: 'Processing...',
        syncNow: 'Sync Now',
        waiting: 'Waiting for sync command...'
      },
      saving: 'Saving...',
      saveAll: 'Save All Changes'
    },
    cards: {
      title: 'Card Printing',
      requestButton: 'Request Cards',
      sending: 'Sending Request...',
      eligibility: {
        failedTitle: 'Not Eligible',
        failedMsg: 'You do not meet the requirements for a card.',
        checkReqs: 'Check Requirements'
      }
    },
    verification: {
      title: 'Verification',
      notFound: 'Record Not Found',
      verified: 'VERIFIED',
      notVerified: 'NOT VERIFIED',
      scanTime: 'Scan Time',
      asoStatus: 'ASO Status',
      dlStatus: 'DL Status'
    },
    manuals: {
      title: 'User Manuals',
      subtitle: 'System Documentation & Guides',
      sysAdmin: {
        title: 'System Admin Manual',
        subtitle: 'Complete System Control',
        configTitle: 'System Configuration',
        configDesc: 'Setting up the foundational data.',
        rooms: 'Configure Rooms',
        trainers: 'Manage Trainers',
        racs: 'Define RACs',
        dbTitle: 'Database Management',
        dbDesc: 'Managing employee records.',
        restrictionWarning: 'Note: Matrix restrictions apply.',
        csv: 'Supports CSV Import.',
        active: 'Ensure active status.'
      },
      racAdmin: {
        title: 'RAC Admin Manual',
        subtitle: 'Training Operations',
        schedTitle: 'Scheduling',
        schedDesc: 'Creating training calendars.',
        create: 'Create Session',
        lang: 'Set Language',
        autoTitle: 'Auto-Booking',
        autoDesc: 'Handling automated bookings.',
        approve: 'Approve or Reject pending bookings.',
        renewTitle: 'Renewals',
        renewDesc: 'Process renewal queues.'
      },
      racTrainer: {
        title: 'Trainer Manual',
        subtitle: 'Grading & Attendance',
        inputTitle: 'Result Input',
        inputDesc: 'Entering session results.',
        grading: 'Mark attendance and scores.',
        rac02: 'Special Rule: RAC 02 requires DL verification.',
        save: 'Save and finalize.'
      },
      deptAdmin: {
        title: 'Dept Admin Manual',
        subtitle: 'Department Oversight',
        reqTitle: 'Card Requests',
        reqDesc: 'Managing card issuance.',
        search: 'Search for employees.',
        print: 'Select and Print.',
        repTitle: 'Reports',
        repDesc: 'View department analytics.'
      },
      user: {
        title: 'User Manual',
        subtitle: 'Employee Self-Service',
        statusTitle: 'Checking Status',
        statusDesc: 'Understanding your dashboard.',
        filterAlert: 'Use filters to find specific records.',
        green: 'Green means Compliant.',
        red: 'Red means Attention Needed.',
        qr: 'Digital QR Passport.'
      }
    },
    feedback: {
      title: 'Feedback',
      subtitle: 'Help us improve',
      typeLabel: 'Feedback Type',
      types: {
        Bug: 'Bug Report',
        Improvement: 'Feature Request',
        General: 'General Comment'
      },
      messageLabel: 'Message',
      msgPlaceholder: 'Describe your issue or idea...',
      button: 'Send Feedback',
      adminTitle: 'Feedback Administration',
      manage: 'Manage User Feedback',
      status: {
        New: 'New',
        InProgress: 'In Progress',
        Resolved: 'Resolved',
        Dismissed: 'Dismissed'
      },
      actionable: 'Actionable',
      noSelection: 'No feedback selected',
      selectPrompt: 'Select a feedback item to view details',
      submittedBy: 'Submitted By',
      internalNotes: 'Internal Notes',
      visibleAdmin: 'Visible to Admins Only',
      deleteRecord: 'Delete Record',
      markedActionable: 'Marked Actionable',
      markActionable: 'Mark as Actionable',
      workflow: 'Workflow Status',
      priority: 'Priority'
    },
    communications: {
      title: 'Communications',
      subtitle: 'Message Log',
      clear: 'Clear Log',
      search: 'Search messages...',
      empty: 'No messages found',
      select: 'Select a message to view details',
      sms: 'SMS Notification',
      gateway: 'Sent via Gateway',
      to: 'To',
      automated: 'This is an automated system message.'
    },
    alcohol: {
      dashboard: {
        title: 'Alcohol Control',
        subtitle: 'IoT Monitoring Dashboard',
        live: 'LIVE FEED',
        backToLive: 'Back to Live',
        specs: 'Tech Specs',
        kpi: {
          total: 'Total Tests',
          violations: 'Violations',
          health: 'System Health'
        },
        online: 'Online',
        hourlyTrend: 'Hourly Trend',
        dailyTrend: 'Daily Trend',
        deviceLoad: 'Device Load',
        complianceRatio: 'Compliance Ratio',
        liveStream: 'Real-time Stream',
        mqtt: 'MQTT Protocol',
        deviceHealth: 'Device Fleet Health',
        alert: {
          title: 'ALCOHOL DETECTED',
          desc: 'Positive reading detected at gate.',
          measured: 'Measured BAC'
        },
        actions: 'Automated Actions',
        actionLog: {
          locked: 'Turnstile Locked',
          generating: 'Generating Incident Report...',
          logged: 'Incident Logged',
          contacting: 'Contacting Supervisor...',
          sent: 'Alert Sent'
        },
        close: 'Dismiss Alert'
      },
      protocol: {
        title: 'Safety Protocol',
        positiveTitle: 'Positive Test (> 0.000)',
        positiveDesc: 'Immediate turnstile lockout. Supervisor notified.',
        resetTitle: 'System Reset',
        resetDesc: 'Manual reset required by HSE officer.'
      },
      features: {
        title: 'System Features',
        iotTitle: 'IoT Integration',
        iotDesc: 'Real-time synchronization with breathalyzers.',
        accessTitle: 'Access Control',
        accessDesc: 'Physical barrier integration.',
        complianceTitle: 'Zero Tolerance',
        complianceDesc: 'Strict compliance enforcement.'
      }
    },
    logs: {
      title: 'System Logs',
      levels: {
        all: 'All Levels',
        info: 'Info',
        warn: 'Warning',
        error: 'Error',
        audit: 'Audit'
      },
      table: {
        level: 'Level',
        timestamp: 'Timestamp',
        user: 'User',
        message: 'Message'
      }
    },
    adminManual: {
      title: 'Admin Manual',
      subtitle: 'Comprehensive System Guide',
      slides: {
        intro: '1. Introduction',
        logic: '2. Logic Engine',
        dashboard: '3. Dashboard',
        workflows: '4. Workflows',
        advanced: '5. Advanced Config',
        robotics: '7. Robotic Protocols',
        troubleshoot: '8. Troubleshooting',
        architecture: '6. System Architecture'
      },
      content: {
        confidential: 'CONFIDENTIAL',
        production: 'PRODUCTION SYSTEM',
        logic: {
          title: 'Compliance Logic',
          desc: 'The system uses a boolean matrix to determine access.',
          active: 'Active Status',
          aso: 'ASO Validity',
          racs: 'RAC Certifications',
          result: 'ACCESS STATUS'
        },
        dashboard: {
          operational: {
            title: 'Operational Dashboard',
            kpi: 'Real-time KPIs',
            renewal: 'Renewal Tracking',
            auto: 'Auto-Booking Engine'
          },
          enterprise: {
            title: 'Enterprise Dashboard',
            global: 'Global Overview',
            risk: 'Risk Heatmaps',
            ai: 'AI Insights'
          }
        },
        workflows: {
          a: { title: 'Data Ingestion', steps: ['Source A (SAP)', 'Source B (Contractor)', 'Middleware Sync'] },
          b: { title: 'Processing', steps: ['ID Normalization', 'Conflict Resolution', 'Status Calculation'] },
          c: { title: 'Analytics', steps: ['Compliance Rate', 'Trend Analysis', 'AI Reporting'] },
          d: { title: 'Saída', steps: ['KPI do Painel', 'Controle de Acesso', 'Notificações'] }
        },
        advanced: {
          gov: { title: 'Site Governance', desc: 'Define mandatory RACs per site.' },
          alcohol: { title: 'Alcohol IoT', desc: 'Integration with breathalyzer turnstiles.' }
        },
        troubleshoot: {
          0: { issue: 'Login Failed', solution: 'Check network connection and credentials.' },
          1: { issue: 'Sync Error', solution: 'Check Middleware logs in Settings > Integration.' },
          2: { issue: 'Slow Dashboard', solution: 'Clear browser cache or check internet speed.' },
          3: { issue: 'Mobile Layout', solution: 'Rotate device to landscape for tables.' },
          4: { issue: 'Other Issues', solution: 'Contact System Support.' }
        },
        architecture: {
          ui: '[ USER INTERFACE ]',
          gate: '[ PERMISSION GATE ]',
          gateDesc: 'Checks User Role (System Admin vs User)',
          logic: '[ LOGIC ENGINE ]',
          checkCap: 'Check Capacity',
          checkMatrix: 'Check Matrix Lock',
          checkDl: 'Check DL Validity',
          dbState: '[ DATABASE STATE ]',
          updateRecord: 'Updates Booking / Employee Record',
          automation: '[ AUTOMATION ]',
          emailTrig: '📧 Email/SMS Trigger',
          printTrig: '🖨️ Auto-Print Register',
          aiTrig: '🤖 AI Analysis Update'
        },
        robotics: {
          title: 'Robotic Self-Healing Protocols',
          subtitle: 'Automated resilience and diagnostic systems.',
          crash: {
            title: 'Auto-Recovery Engine',
            desc: 'The system utilizes a React Error Boundary wrapper. If a critical runtime error occurs (e.g., memory leak or unhandled exception), the "RoboTech" protocol intercepts the crash, displays a diagnostic visualization to the user, and attempts a soft-reload of the state to prevent a hard browser crash.'
          },
          diagnostics: {
            title: 'Active Diagnostics',
            desc: 'System Admins can manually trigger the "RoboTech Healer Protocol" from the Settings page. This runs a background thread that scans for database latency, optimizes memory shards, and verifies API integrity without interrupting active users.'
          }
        }
      }
    },
    proposal: {
      aboutMe: {
        title: 'About the Developer',
        name: 'Pita Domingos',
        preferred: 'Pita',
        cert: 'Full Stack Developer',
        role: 'Lead Architect',
        bio: 'Experienced developer specializing in enterprise safety systems and digital transformation.'
      },
      execSummary: {
        title: 'Executive Summary',
        text: 'A comprehensive solution to digitize and automate safety compliance.',
        quote: '"Safety is not just a priority, it is a value."'
      },
      objectives: {
        title: 'Project Objectives',
        problemTitle: 'The Problem',
        problemText: 'Manual processes, fragmented data, and compliance risks.',
        solutionTitle: 'The Solution',
        goals: ['Centralized Data', 'Automated Compliance', 'Real-time Reporting']
      },
      organogram: {
        title: 'Technical Organogram',
        tech1: 'Frontend Architecture',
        tech2: 'Backend Services'
      },
      timeline: {
        title: 'Implementation Timeline',
        phase1: 'Phase 1: Discovery',
        phase1desc: 'Requirements gathering',
        phase2: 'Phase 2: Development',
        phase2desc: 'Core system build',
        phase3: 'Phase 3: Testing',
        phase3desc: 'UAT & Bug fixes',
        phase4: 'Phase 4: Deployment',
        phase4desc: 'Go Live',
        phase5: 'Phase 5: Support',
        phase5desc: 'Maintenance'
      },
      techStack: {
        title: 'Technology Stack',
        frontendTitle: 'Frontend',
        frontend: 'React, TypeScript, Tailwind',
        backendTitle: 'Backend',
        backend: 'Node.js, Express',
        databaseTitle: 'Database',
        database: 'PostgreSQL / Supabase',
        securityTitle: 'Security',
        security: 'JWT, Role-Based Access'
      },
      financials: {
        title: 'Financial Proposal',
        items: [
          { name: 'Initial Development', type: 'One-time', cost: '$15,000.00' },
          { name: 'Development & Setup', type: 'One-time', cost: '$3,000.00' },
          { name: 'Cloud Infrastructure', type: 'Monthly', cost: '$3,500.00' },
          { name: 'Training & Documentation', type: 'One-time', cost: '$2,500.00' },
          { name: 'Maintenance & Support', type: 'Monthly', cost: '$3,000.00' }
        ]
      },
      roadmap: {
        title: 'Strategic Roadmap',
        auth: 'Authentication',
        authDesc: 'SSO Integration',
        db: 'Database',
        dbDesc: 'Cloud Migration',
        email: 'Notifications',
        emailDesc: 'Email/SMS Gateway',
        hosting: 'Hosting',
        hostingDesc: 'Scalable Cloud'
      },
      aiFeatures: {
        title: 'AI Integration',
        chatbot: 'Safety Advisor Chatbot',
        reporting: 'Automated Insight Reports'
      },
      futureUpdates: {
        title: 'Future Modules',
        moduleA: 'Module A - ERP Integration',
        moduleB: 'Module B - Biometric Hardware'
      },
      enhancedCaps: {
        title: 'Enhanced Capabilities',
        mobileVerify: { desc: 'Mobile Verification App' },
        autoBooking: { desc: 'Automated Booking Engine' },
        massData: { desc: 'Big Data Analytics' }
      },
      conclusion: {
        title: 'Conclusion',
        text: 'This system represents a significant leap forward in safety management efficiency and compliance.'
      },
      thankYou: {
        title: 'Thank You',
        contact: 'Contact us for more info',
        phone: '+258 84 123 4567'
      },
      digitalTrans: 'Digital Transformation Initiative'
    },
    ai: {
      systemPromptAdvice: 'You are a safety expert. Provide advice on {rac} in {language}.',
      systemPromptReport: 'You are a safety data analyst. Generate a report in {language}.'
    },
    advisor: {
      button: 'Safety Advisor',
      title: 'Gemini Safety Advisor',
      sender: 'Gemini',
      emptyState: 'How can I help you with safety standards today?',
      placeholder: 'Ask about RACs, procedures...'
    },
    enterprise: {
      systemTitle: 'Enterprise Command Center',
      systemSubtitle: 'Multi-Tenant SaaS Administration',
      title: 'Enterprise Dashboard',
      subtitle: 'Global Operations Overview',
      siteName: 'Site',
      globalHealth: 'Global Health Score',
      totalWorkforce: 'Total Workforce',
      topPerformer: 'Top Performing Site',
      needsAttention: 'Needs Attention',
      noData: 'No data available',
      tenantMatrix: 'Tenant Performance Matrix',
      systemView: 'System View',
      siteComparison: 'Site Comparison',
      riskHeatmap: 'Department Risk Heatmap',
      selectPrompt: 'Select "All Sites" to view comparison',
      aiAuditor: 'AI System Auditor',
      aiDirector: 'AI Safety Director',
      systemIntelligence: 'Platform-wide Intelligence',
      companyIntelligence: 'Intelligence for',
      aiPrompt: 'Generating AI Insights...',
      aiPromptSystem: 'Analyzing multi-tenant risk vectors across all enterprises.',
      aiPromptEnterprise: 'Analyzing site-specific compliance trends and bottlenecks.',
      bottlenecks: 'Training Bottlenecks',
      failure: 'Fail Rate'
    },
    racDefs: {
        RAC01: 'RAC 01 - Working at Height',
        RAC02: 'RAC 02 - Vehicles and Mobile Equipment',
        RAC03: 'RAC 03 - Mobile Equipment Lockout',
        RAC04: 'RAC 04 - Machine Guarding',
        RAC05: 'RAC 05 - Confined Space',
        RAC06: 'RAC 06 - Lifting Operations',
        RAC07: 'RAC 07 - Ground Stability',
        RAC08: 'RAC 08 - Electricity',
        RAC09: 'RAC 09 - Explosives',
        RAC10: 'RAC 10 - Liquid Metal',
        RAC11: 'RAC 11 - Mine Traffic',
        PTS: 'PTS - Permissão de Trabalho Seguro',
        ART: 'ART - Análise de Risco da Tarefa',
        LIB_OPS: 'LIB-OPS - Liberação Operacional',
        LIB_MOV: 'LIB-MOV - Liberação de Movimentação'
    },
    notifications: {
        capacityTitle: 'Capacity Warning',
        capacityMsg: 'Some bookings were auto-moved to the next available session on'
    }
  },
  pt: {
    common: {
      vulcan: 'RACS',
      all: 'Todos',
      search: 'Pesquisar...',
      rowsPerPage: 'Linhas por página:',
      page: 'Página',
      of: 'de',
      name: 'Nome',
      id: 'ID',
      // Added missing date property
      date: 'Data',
      company: 'Empresa',
      department: 'Departamento',
      jobTitle: 'Cargo',
      role: 'Função',
      actions: 'Ações',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Ver',
      print: 'Imprimir',
      download: 'Baixar',
      import: 'Importar',
      template: 'Modelo',
      yes: 'Sim',
      no: 'Não',
      time: 'Hora',
      status: 'Status',
      recordsFound: 'registros encontrados',
      completed: 'Concluído',
      timeLeft: 'restante',
      passed: 'Aprovado',
      failed: 'Reprovado',
      pending: 'Pendente',
      complianceRate: 'Taxa de Conformidade',
      testsProcessed: 'Testes Processados',
      stats: {
        totalRecords: 'Total de Registros',
        passRate: 'Taxa de Aprovação',
        passed: 'Aprovados',
        failed: 'Reprovados',
        totalUsers: 'Total de Usuários',
        active: 'Ativos',
        admins: 'Admins'
      },
      operationalMatrix: 'Matriz Operacional',
      owner: 'Proprietário',
      sending: 'Enviando...',
      smsBlast: 'Disparo de SMS',
      simulateRole: 'Simular Função',
      superuser: 'Acesso Superusuário',
      restricted: 'Acesso Restrito',
      enterpriseView: 'Visão Empresarial',
      exitFullScreen: 'Sair da Tela Cheia',
      fullScreen: 'Tela Cheia',
      notifications: 'Notificações',
      noNotifications: 'Sem notificações',
      clearAll: 'Limpar Tudo'
    },
    nav: {
      dashboard: 'Painel',
      booking: 'Agendamento',
      records: 'Registros',
      database: 'Banco de Dados',
      reports: 'Relatórios',
      enterpriseDashboard: 'Empresa',
      alcohol: 'Controle de Álcool',
      requestCards: 'Solicitar Cartões',
      communications: 'Comunicações',
      schedule: 'Cronograma',
      siteGovernance: 'Governança',
      trainerInput: 'Input do Formador',
      users: 'Usuários',
      settings: 'Configurações',
      logs: 'Logs',
      manuals: 'Manuais',
      feedbackAdmin: 'Feedback',
      adminGuide: 'Guia do Admin',
      presentation: 'Apresentação',
      proposal: 'Proposta'
    },
    auth: {
      login: 'Entrar',
      logout: 'Sair'
    },
    dashboard: {
      title: 'Painel',
      subtitle: 'Visão Geral',
      upcoming: {
        title: 'Sessões Futuras',
        viewSchedule: 'Ver Cronograma',
        date: 'Data',
        session: 'Sessão',
        capacity: 'Capacidade',
        status: 'Status'
      },
      booked: {
        title: 'Funcionários Agendados',
        tableEmployee: 'Funcionário',
        tableRac: 'RAC',
        tableDate: 'Data',
        tableRoom: 'Sala',
        tableTrainer: 'Formador',
        noData: 'Nenhum agendamento encontrado'
      },
      kpi: {
        adherence: 'Aderência',
        certifications: 'Certificações',
        pending: 'Pendente',
        expiring: 'Expirando',
        scheduled: 'Agendado'
      },
      charts: {
        compliant: 'Conforme',
        nonCompliant: 'Não Conforme',
        complianceTitle: 'Visão Geral de Conformidade',
        complianceSubtitle: 'Por Tipo de RAC',
        accessTitle: 'Status de Acesso',
        missing: 'Requisitos Ausentes'
      },
      renewal: {
        title: 'Alertas de Renovação',
        message: 'funcionários com treinamento expirando em 30 dias.',
        button: 'Processar Renovações'
      },
      autoBooking: {
        title: 'Auto-Agendamento Acionado',
        subPart1: 'Funcionários com validade Crítica',
        subPart2: 'foram agendados automaticamente.'
      }
    },
    // Portuguese Translations aligned with English Structure
    booking: {
      title: 'Novo Agendamento',
      selfServiceTitle: 'Autoatendimento',
      selfServiceDesc: 'Agende sua própria sessão de treinamento.',
      secureMode: 'Modo Seguro Ativo',
      manageSchedule: 'Gerenciar Cronograma',
      success: 'Agendamento Enviado com Sucesso',
      selectSession: 'Selecionar Sessão',
      chooseSession: 'Escolha uma sessão...',
      dlRequired: 'Detalhes da Carta de Condução são obrigatórios para este módulo.',
      addRow: 'Adicionar Funcionário',
      submitBooking: 'Enviar Agendamento'
    },
    results: {
      searchPlaceholder: 'Pesquisar por Nome ou ID...',
      passport: 'Meu Passaporte',
      export: 'Exportar CSV',
      table: {
        employee: 'Funcionário',
        session: 'Sessão',
        date: 'Data',
        trainer: 'Formador',
        theory: 'Teoria',
        status: 'Status',
        expiry: 'Validade'
      }
    },
    database: {
      title: 'Banco de Dados',
      subtitle: 'Registros Mestres',
      mappingTitle: 'Mapeamento de Importação',
      mappingSubtitle: 'Mapear colunas CSV para campos do sistema',
      preview: 'Pré-visualização do Arquivo',
      coreData: 'Dados Principais',
      complianceTrain: 'Conformidade e Treinamento',
      sourceCol: 'Coluna de Origem',
      processImport: 'Processar Importação',
      importSuccess: 'Importação Bem-sucedida',
      active: 'Ativo',
      granted: 'Concedido',
      blocked: 'Bloqueado',
      accessStatus: 'Status de Acesso',
      aso: 'Validade ASO',
      opsMatrix: 'Matriz OPS',
      cardBack: 'Pré-visualização do Verso do Cartão',
      contactInfo: 'Informações de Contato',
      cell: 'Celular',
      dlDetails: 'Detalhes da Carta de Condução',
      number: 'Número',
      class: 'Classe',
      editModal: 'Editar Funcionário',
      confirmDelete: 'Confirmar Exclusão',
      confirmDeleteMsg: 'Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita.',
      confirmDeactivate: 'Desativar Usuário',
      confirmDeactivateMsg: 'Tem certeza de que deseja desativar este usuário? Ele perderá o acesso ao sistema.',
      massQr: 'Baixar QR em Massa',
      zipping: 'Compactando...',
      exportDb: 'Exportar BD',
      wizard: 'Assistente de Importação',
      importCsv: 'Importar CSV',
      ops: {
          EMI_PTS: 'Emi-PTS',
          APR_ART: 'Apr-ART',
          DONO_AREA_PTS: 'Dono-Area',
          EXEC: 'Exec'
      },
      bulkQrMessage: 'Isso irá gerar e baixar {count} códigos QR. Continuar?'
    },
    reports: {
      title: 'Relatórios e Análises',
      subtitle: 'Métricas de Desempenho',
      executiveAnalysis: 'Análise Executiva IA',
      analyzing: 'Analisando...',
      generate: 'Gerar Relatório',
      leaderboard: 'Classificação de Formadores',
      noShowsTitle: 'Alerta de Ausências',
      filters: {
        period: 'Período',
        startDate: 'Data Início',
        endDate: 'Data Fim',
        department: 'Departamento',
        racType: 'Tipo de RAC'
      },
      periods: {
        weekly: 'Semanal',
        monthly: 'Mensal',
        ytd: 'Ano até a Data',
        custom: 'Intervalo Personalizado'
      },
      stats: {
        totalTrained: 'Total Treinado',
        passRate: 'Taxa de Aprovação',
        attendance: 'Taxa de Presença',
        noShows: 'Ausências'
      },
      charts: {
        performance: 'Desempenho por Módulo',
        breakdownTitle: 'Aprovação vs Reprovação',
        distributionTitle: 'Distribuição Geral',
        distributionSubtitle: 'Razão Global Aprov/Reprov',
        aiSubtitle: 'Alimentado por Gemini 2.5'
      },
      trainerMetrics: {
        students: 'Alunos',
        avgTheory: 'Média Teoria'
      },
      printReport: 'Imprimir Relatório'
    },
    schedule: {
      title: 'Cronograma de Treinamento',
      subtitle: 'Gerenciar Sessões',
      newSession: 'Nova Sessão',
      modal: {
        title: 'Agendar Sessão',
        racType: 'Tipo de RAC',
        date: 'Data',
        startTime: 'Hora de Início',
        location: 'Local',
        capacity: 'Capacidade',
        instructor: 'Instrutor',
        language: 'Idioma',
        portuguese: 'Português',
        english: 'Inglês',
        saveSession: 'Salvar Sessão'
      }
    },
    trainer: {
      title: 'Input do Formador',
      loggedInAs: 'Logado como',
      noSessions: 'Nenhuma sessão pendente encontrada.',
      selectSession: 'Selecionar Sessão para Avaliar',
      chooseSession: 'Escolha uma sessão...',
      saveResults: 'Salvar Resultados'
    },
    users: {
      title: 'Gerenciamento de Usuários',
      subtitle: 'Gerenciar acesso e funções do sistema',
      addUser: 'Adicionar Usuário',
      table: {
        user: 'Usuário',
        role: 'Função',
        status: 'Status',
        actions: 'Ações'
      },
      modal: {
        title: 'Adicionar Novo Usuário',
        name: 'Nome Completo',
        email: 'Endereço de E-mail',
        createUser: 'Criar Usuário'
      }
    },
    settings: {
      title: 'Configurações do Sistema',
      globalConfig: 'Configuração Global',
      localConfig: 'Configuração Local',
      feedbackConfig: 'Configuração do Widget de Feedback',
      tabs: {
        general: 'Geral',
        trainers: 'Formadores',
        racs: 'Definições RAC',
        sites: 'Locais',
        companies: 'Empresas',
        integration: 'Integração'
      },
      rooms: {
        title: 'Salas de Treinamento',
        new: 'Nova Sala',
        name: 'Nome da Sala',
        capacity: 'Capacidade'
      },
      trainers: {
        title: 'Formadores Qualificados',
        name: 'Nome do Formador',
        new: 'Novo Formador'
      },
      racs: {
        title: 'Padrões RAC',
        code: 'Código',
        description: 'Descrição'
      },
      integrationPage: {
        title: 'Integração de Dados',
        sourceA: 'Fonte A',
        sourceB: 'Fonte B',
        middleware: 'Status do Middleware',
        processing: 'Processing...',
        syncNow: 'Sincronizar Agora',
        waiting: 'Aguardando comando de sincronização...'
      },
      saving: 'Salvando...',
      saveAll: 'Salvar Todas as Alterações'
    },
    cards: {
      title: 'Impressão de Cartões',
      requestButton: 'Solicitar Cartões',
      sending: 'Enviando Solicitação...',
      eligibility: {
        failedTitle: 'Não Elegível',
        failedMsg: 'Você não atende aos requisitos para um cartão.',
        checkReqs: 'Verificar Requisitos'
      }
    },
    verification: {
      title: 'Verificação',
      notFound: 'Registro Não Encontrado',
      verified: 'VERIFICADO',
      notVerified: 'NÃO VERIFICADO',
      scanTime: 'Hora da Leitura',
      asoStatus: 'Status ASO',
      dlStatus: 'Status Carta'
    },
    manuals: {
      title: 'Manuais do Usuário',
      subtitle: 'Documentação do Sistema e Guias',
      sysAdmin: {
        title: 'Manual Admin do Sistema',
        subtitle: 'Controle Completo do Sistema',
        configTitle: 'Configuração do Sistema',
        configDesc: 'Configurando os dados fundamentais.',
        rooms: 'Configurar Salas',
        trainers: 'Gerenciar Formadores',
        racs: 'Definir RACs',
        dbTitle: 'Gerenciamento de Banco de Dados',
        dbDesc: 'Gerenciando registros de funcionários.',
        restrictionWarning: 'Nota: Restrições de matriz se aplicam.',
        csv: 'Suporta Importação CSV.',
        active: 'Garantir status ativo.'
      },
      racAdmin: {
        title: 'Manual Admin RAC',
        subtitle: 'Operações de Treinamento',
        schedTitle: 'Agendamento',
        schedDesc: 'Criando calendários de treinamento.',
        create: 'Criar Sessão',
        lang: 'Definir Idioma',
        autoTitle: 'Auto-Agendamento',
        autoDesc: 'Lidando com agendamentos automáticos.',
        approve: 'Aprovar ou Rejeitar agendamentos pendentes.',
        renewTitle: 'Renovações',
        renewDesc: 'Processar filas de renovação.'
      },
      racTrainer: {
        title: 'Manual do Formador',
        subtitle: 'Avaliação e Presença',
        inputTitle: 'Entrada de Resultados',
        inputDesc: 'Inserindo resultados da sessão.',
        grading: 'Marcar presença e notas.',
        rac02: 'Regra Especial: RAC 02 requer verificação de Carta.',
        save: 'Salvar e finalizar.'
      },
      deptAdmin: {
        title: 'Manual Admin Dept',
        subtitle: 'Supervisão do Departamento',
        reqTitle: 'Solicitações de Cartão',
        reqDesc: 'Gerenciando emissão de cartões.',
        search: 'Pesquisar funcionários.',
        print: 'Selecionar e Imprimir.',
        repTitle: 'Relatórios',
        repDesc: 'Ver análises do departamento.'
      },
      user: {
        title: 'Manual do Usuário',
        subtitle: 'Autoatendimento do Funcionário',
        statusTitle: 'Verificando Status',
        statusDesc: 'Entendendo seu painel.',
        filterAlert: 'Use filtros para encontrar registros específicos.',
        green: 'Verde significa Conforme.',
        red: 'Vermelho significa Atenção Necessária.',
        qr: 'Passaporte Digital QR.'
      }
    },
    feedback: {
      title: 'Feedback',
      subtitle: 'Ajude-nos a melhorar',
      typeLabel: 'Tipo de Feedback',
      types: {
        Bug: 'Relatório de Erro',
        Improvement: 'Solicitação de Recurso',
        General: 'Comentário Geral'
      },
      messageLabel: 'Mensagem',
      msgPlaceholder: 'Descreva seu problema ou ideia...',
      button: 'Enviar Feedback',
      adminTitle: 'Administração de Feedback',
      manage: 'Gerenciar Feedback do Usuário',
      status: {
        New: 'Novo',
        InProgress: 'Em Progresso',
        Resolved: 'Resolvido',
        Dismissed: 'Dispensado'
      },
      actionable: 'Acionável',
      noSelection: 'Nenhum feedback selecionado',
      selectPrompt: 'Selecione um item de feedback para ver detalhes',
      submittedBy: 'Enviado Por',
      internalNotes: 'Notas Internas',
      visibleAdmin: 'Visível Apenas para Admins',
      deleteRecord: 'Excluir Registro',
      markedActionable: 'Marked Actionable',
      markActionable: 'Marcar como Acionável',
      workflow: 'Status do Fluxo de Trabalho',
      priority: 'Prioridade'
    },
    communications: {
      title: 'Comunicações',
      subtitle: 'Log de Mensagens',
      clear: 'Limpar Log',
      search: 'Pesquisar mensagens...',
      empty: 'Nenhuma mensagem encontrada',
      select: 'Selecione uma mensagem para ver detalhes',
      sms: 'Notificação SMS',
      gateway: 'Enviado via Gateway',
      to: 'Para',
      automated: 'Esta é uma mensagem automática do sistema.'
    },
    alcohol: {
      dashboard: {
        title: 'Controle de Álcool',
        subtitle: 'Painel de Monitoramento IoT',
        live: 'TRANSMISSÃO AO VIVO',
        backToLive: 'Voltar ao Vivo',
        specs: 'Especificações Técnicas',
        kpi: {
          total: 'Total de Testes',
          violations: 'Violações',
          health: 'Saúde do Sistema'
        },
        online: 'Online',
        hourlyTrend: 'Tendência Horária',
        dailyTrend: 'Tendência Diária',
        deviceLoad: 'Carga do Dispositivo',
        complianceRatio: 'Taxa de Conformidade',
        liveStream: 'Transmissão em Tempo Real',
        mqtt: 'Protocolo MQTT',
        deviceHealth: 'Saúde da Frota de Dispositivos',
        alert: {
          title: 'ÁLCOOL DETECTADO',
          desc: 'Leitura positiva detectada no portão.',
          measured: 'BAC Medido'
        },
        actions: 'Ações Automatizadas',
        actionLog: {
          locked: 'Catraca Bloqueada',
          generating: 'Gerando Relatório de Incidente...',
          logged: 'Incidente Registrado',
          contacting: 'Contatando Supervisor...',
          sent: 'Alerta Enviado'
        },
        close: 'Dispensar Alerta'
      },
      protocol: {
        title: 'Protocolo de Segurança',
        positiveTitle: 'Teste Positivo (> 0.000)',
        positiveDesc: 'Bloqueio imediato da catraca. Supervisor notificado.',
        resetTitle: 'Reinicialização do Sistema',
        resetDesc: 'Reinicialização manual necessária pelo oficial de HSE.'
      },
      features: {
        title: 'Recursos do Sistema',
        iotTitle: 'Integração IoT',
        iotDesc: 'Sincronização em tempo real com bafômetros.',
        accessTitle: 'Controle de Acesso',
        accessDesc: 'Integração com barreira física.',
        complianceTitle: 'Tolerância Zero',
        complianceDesc: 'Aplicação estrita de conformidade.'
      }
    },
    logs: {
      title: 'Logs do Sistema',
      levels: {
        all: 'Todos os Níveis',
        info: 'Info',
        warn: 'Aviso',
        error: 'Erro',
        audit: 'Auditoria'
      },
      table: {
        level: 'Nível',
        timestamp: 'Carimbo de Data/Hora',
        user: 'Usuário',
        message: 'Mensagem'
      }
    },
    adminManual: {
      title: 'Manual Admin',
      subtitle: 'Guia Abrangente do Sistema',
      slides: {
        intro: '1. Introdução',
        logic: '2. Motor Lógico',
        dashboard: '3. Painel',
        workflows: '4. Fluxos de Trabalho',
        advanced: '5. Config Avançada',
        robotics: '7. Protocolos Robóticos',
        troubleshoot: '8. Solução de Problemas',
        architecture: '6. Arquitetura do Sistema'
      },
      content: {
        confidential: 'CONFIDENCIAL',
        production: 'SISTEMA DE PRODUÇÃO',
        logic: {
          title: 'Lógica de Conformidade',
          desc: 'O sistema usa uma matriz booleana para determinar o acesso.',
          active: 'Status Ativo',
          aso: 'Validade ASO',
          racs: 'Certificações RAC',
          result: 'STATUS DE ACESSO'
        },
        dashboard: {
          operational: {
            title: 'Painel Operacional',
            kpi: 'KPIs em Tempo Real',
            renewal: 'Rastreamento de Renovação',
            auto: 'Motor de Auto-Agendamento'
          },
          enterprise: {
            title: 'Painel Empresarial',
            global: 'Visão Global',
            risk: 'Mapas de Calor de Risco',
            ai: 'Insights de IA'
          }
        },
        workflows: {
          a: { title: 'Ingestão de Dados', steps: ['Fonte A (SAP)', 'Fonte B (Empreiteiro)', 'Sincronização Middleware'] },
          b: { title: 'Processamento', steps: ['Normalização de ID', 'Resolução de Conflitos', 'Cálculo de Status'] },
          c: { title: 'Análise', steps: ['Taxa de Conformidade', 'Análise de Tendência', 'Relatórios IA'] },
          d: { title: 'Saída', steps: ['KPI do Painel', 'Controle de Acesso', 'Notificações'] }
        },
        advanced: {
          gov: { title: 'Governança de Local', desc: 'Definir RACs obrigatórios por local.' },
          alcohol: { title: 'IoT de Álcool', desc: 'Integração com catracas de bafômetro.' }
        },
        troubleshoot: {
          0: { issue: 'Falha no Login', solution: 'Verifique a conexão de rede e credenciais.' },
          1: { issue: 'Erro de Sincronização', solution: 'Verifique os logs do Middleware em Configurações > Integração.' },
          2: { issue: 'Painel Lento', solution: 'Limpe o cache do navegador ou verifique a velocidade da internet.' },
          3: { issue: 'Layout Móvel', solution: 'Gire o dispositivo para paisagem para tabelas.' },
          4: { issue: 'Outros Problemas', solution: 'Contate o Suporte do Sistema.' }
        },
        architecture: {
          ui: '[ INTERFACE DE USUÁRIO ]',
          gate: '[ PORTÃO DE PERMISSÃO ]',
          gateDesc: 'Verifica Função do Usuário (Admin do Sistema vs Usuário)',
          logic: '[ MOTOR LÓGICO ]',
          checkCap: 'Verificar Capacidade',
          checkMatrix: 'Verificar Bloqueio Matriz',
          checkDl: 'Verificar Validade Carta',
          dbState: '[ ESTADO DO BANCO DE DADOS ]',
          updateRecord: 'Atualiza Registro de Agendamento / Funcionário',
          automation: '[ AUTOMAÇÃO ]',
          emailTrig: '📧 Gatilho Email/SMS',
          printTrig: '🖨️ Registro Auto-Impressão',
          aiTrig: '🤖 Atualização de Análise IA'
        },
        robotics: {
          title: 'Protocolos de Autocura Robótica',
          subtitle: 'Sistemas automatizados de resiliência e diagnóstico.',
          crash: {
            title: 'Motor de Auto-Recuperação',
            desc: 'O sistema utiliza um wrapper React Error Boundary. Se ocorrer um erro crítico de tempo de execução (por exemplo, vazamento de memória ou exceção não tratada), o protocolo "RoboTech" intercepta a falha, exibe uma visualização de diagnóstico ao usuário e tenta um recarregamento suave do estado para evitar uma falha total do navegador.'
          },
          diagnostics: {
            title: 'Diagnósticos Ativos',
            desc: 'Administradores do Sistema podem acionar manualmente o "Protocolo de Cura RoboTech" na página de Configurações. Isso executa um thread em segundo plano que verifica a latência do banco de dados, otimiza fragmentos de memória e verifica a integridade da API sem interromper os usuários ativos.'
          }
        }
      }
    },
    proposal: {
      aboutMe: {
        title: 'Sobre o Desenvolvedor',
        name: 'Pita Domingos',
        preferred: 'Pita',
        cert: 'Full Stack Developer',
        role: 'Arquiteto Líder',
        bio: 'Desenvolvedor experiente especializado em sistemas de segurança empresarial e transformação digital.'
      },
      execSummary: {
        title: 'Resumo Executivo',
        text: 'Uma solução abrangente para digitalizar e automatizar a conformidade de segurança.',
        quote: '"Segurança não é apenas uma prioridade, é um valor."'
      },
      objectives: {
        title: 'Objetivos do Projeto',
        problemTitle: 'The Problem',
        problemText: 'Processos manuais, dados fragmentados e riscos de conformidade.',
        solutionTitle: 'A Solução',
        goals: ['Dados Centralizados', 'Conformidade Automatizada', 'Relatórios em Tempo Real']
      },
      organogram: {
        title: 'Organograma Técnico',
        tech1: 'Arquitetura Frontend',
        tech2: 'Serviços Backend'
      },
      timeline: {
        title: 'Cronograma de Implementação',
        phase1: 'Fase 1: Descoberta',
        phase1desc: 'Levantamento de requisitos',
        phase2: 'Fase 2: Desenvolvimento',
        phase2desc: 'Construção do sistema principal',
        phase3: 'Fase 3: Testes',
        phase3desc: 'UAT e correções de bugs',
        phase4: 'Fase 4: Implantação',
        phase4desc: 'Entrada em operação',
        phase5: 'Fase 5: Suporte',
        phase5desc: 'Manutenção'
      },
      techStack: {
        title: 'Pilha Tecnológica',
        frontendTitle: 'Frontend',
        frontend: 'React, TypeScript, Tailwind',
        backendTitle: 'Backend',
        backend: 'Node.js, Express',
        databaseTitle: 'Banco de Dados',
        database: 'PostgreSQL / Supabase',
        securityTitle: 'Segurança',
        security: 'JWT, Acesso Baseado em Função'
      },
      financials: {
        title: 'Proposta Financeira',
        items: [
          { name: 'Desenvolvimento Inicial', type: 'Pagamento Único', cost: '$15,000.00' },
          { name: 'Desenvolvimento e Configuração', type: 'Pagamento Único', cost: '$3,000.00' },
          { name: 'Infraestrutura em Nuvem', type: 'Mensal', cost: '$3,500.00' },
          { name: 'Treinamento e Documentação', type: 'Pagamento Único', cost: '$2,500.00' },
          { name: 'Manutenção e Suporte', type: 'Mensal', cost: '$3,000.00' }
        ]
      },
      roadmap: {
        title: 'Roteiro Estratégico',
        auth: 'Autenticação',
        authDesc: 'Integração SSO',
        db: 'Banco de Dados',
        dbDesc: 'Migração para Nuvem',
        email: 'Notificações',
        emailDesc: 'Gateway de Email/SMS',
        hosting: 'Hospedagem',
        hostingDesc: 'Nuvem Escalável'
      },
      aiFeatures: {
        title: 'Integração IA',
        chatbot: 'Chatbot Consultor de Segurança',
        reporting: 'Relatórios de Insights Automatizados'
      },
      futureUpdates: {
        title: 'Módulos Futuros',
        moduleA: 'Módulo A - Integração ERP',
        moduleB: 'Módulo B - Hardware Biométrico'
      },
      enhancedCaps: {
        title: 'Capacidades Aprimoradas',
        mobileVerify: { desc: 'App de Verificação Móvel' },
        autoBooking: { desc: 'Motor de Agendamento Automático' },
        massData: { desc: 'Análise de Big Data' }
      },
      conclusion: {
        title: 'Conclusão',
        text: 'Este sistema representa um salto significativo na eficiência e conformidade do gerenciamento de segurança.'
      },
      thankYou: {
        title: 'Obrigado',
        contact: 'Contate-nos para mais informações',
        phone: '+258 84 123 4567'
      },
      digitalTrans: 'Iniciativa de Transformação Digital'
    },
    ai: {
      systemPromptAdvice: 'Você é um especialista em segurança. Forneça conselhos sobre {rac} em {language}.',
      systemPromptReport: 'Você é um analista de dados de segurança. Gere um relatório em {language}.'
    },
    advisor: {
      button: 'Consultor de Segurança',
      title: 'Consultor de Segurança Gemini',
      sender: 'Gemini',
      emptyState: 'Como posso ajudar com padrões de segurança hoje?',
      placeholder: 'Pergunte sobre RACs, procedimentos...'
    },
    enterprise: {
      systemTitle: 'Centro de Comando Empresarial',
      systemSubtitle: 'Administração SaaS Multi-Locatário',
      title: 'Painel Empresarial',
      subtitle: 'Visão Geral das Operações Globais',
      siteName: 'Local',
      globalHealth: 'Pontuação Global de Saúde',
      totalWorkforce: 'Força de Trabalho Total',
      topPerformer: 'Local com Melhor Desempenho',
      needsAttention: 'Precisa de Atenção',
      noData: 'Sem dados disponíveis',
      tenantMatrix: 'Matriz de Desempenho do Locatário',
      systemView: 'Visão do Sistema',
      siteComparison: 'Comparação de Locais',
      riskHeatmap: 'Mapa de Calor de Risco do Departamento',
      selectPrompt: 'Selecione "Todos os Locais" para ver a comparação',
      aiAuditor: 'Auditor de Sistema IA',
      aiDirector: 'Diretor de Segurança IA',
      systemIntelligence: 'Inteligência em Toda a Plataforma',
      companyIntelligence: 'Inteligência para',
      aiPrompt: 'Gerando Insights de IA...',
      aiPromptSystem: 'Analisando vetores de risco multi-locatário em todas as empresas.',
      aiPromptEnterprise: 'Analisando tendências de conformidade específicas do local e gargalos.',
      bottlenecks: 'Gargalos de Treinamento',
      failure: 'Taxa de Reprovação'
    },
    racDefs: {
        RAC01: 'RAC 01 - Trabalho em Altura',
        RAC02: 'RAC 02 - Veículos e Equipamentos Móveis',
        RAC03: 'RAC 03 - Bloqueio de Equipamentos Móveis',
        RAC04: 'RAC 04 - Proteção de Máquinas',
        RAC05: 'RAC 05 - Espaço Confinado',
        RAC06: 'RAC 06 - Operações de Içamento',
        RAC07: 'RAC 07 - Estabilidade do Solo',
        RAC08: 'RAC 08 - Eletricidade',
        RAC09: 'RAC 09 - Explosivos',
        RAC10: 'RAC 10 - Metal Líquido',
        RAC11: 'RAC 11 - Tráfego de Mina',
        PTS: 'PTS - Permissão de Trabalho Seguro',
        ART: 'ART - Análise de Risco da Tarefa',
        LIB_OPS: 'LIB-OPS - Liberação Operacional',
        LIB_MOV: 'LIB-MOV - Liberação de Movimentação'
    },
    notifications: {
        capacityTitle: 'Aviso de Capacidade',
        capacityMsg: 'Alguns agendamentos foram movidos automaticamente para a próxima sessão disponível em'
    }
  }
};
