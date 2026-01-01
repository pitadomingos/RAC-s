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
      proposal: 'Proposal',
      integration: 'Connectors'
    },
    integrationHub: {
      title: 'Data Integration Hub',
      subtitle: 'Connect to external employee databases (SAP, Excel, SQL)',
      newConnector: 'New Connector',
      activeConnectors: 'Active Connectors',
      syncHistory: 'Sync History',
      lastSync: 'Last Sync',
      healthy: 'Healthy',
      error: 'Error',
      idle: 'Idle',
      syncNow: 'Sync Now',
      dryRun: 'Dry Run',
      validateMapping: 'Validate Mapping',
      scheduler: 'Sync Schedule',
      wizard: {
        step1Title: 'Select Source Type',
        step1Desc: 'Choose how your employee data is stored.',
        step2Title: 'Configuration',
        step2Desc: 'Enter connection details or upload file.',
        step3Title: 'Visual Column Mapper',
        step3Desc: 'Bridge your data fields with the CARS system.',
        step4Title: 'Validation & Preview',
        step4Desc: 'Verify data integrity before finalizing.',
        systemField: 'System Field',
        sourceField: 'Source Column',
        mappingSuccess: 'Mapping Validated'
      },
      types: {
        excel: 'Excel / CSV',
        database: 'SQL Database',
        api: 'Custom App / API'
      },
      conflicts: {
        title: 'Conflict Resolution',
        desc: 'Duplicate records found across sources. Select the master data.',
        trustSource: 'Trust Hierarchy',
        manualReview: 'Review Conflict',
        resolveAll: 'Auto-Resolve All',
        keepSource: 'Keep Source',
        keepSystem: 'Keep System'
      }
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
        integration: 'Integration',
        branding: 'Branding',
        diagnostics: 'Diagnostics'
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
      branding: {
        title: 'Tenant Branding',
        subtitle: 'Update application identity and safety logos.',
        save: 'Save Branding',
        brandName: 'Brand Name',
        appName: 'Application Name',
        appNameDesc: 'This name appears in the sidebar and main header.',
        corporateLogo: 'Corporate Logo',
        safetyLogo: 'Safety First Logo',
        safetyLogoDesc: 'Typically a "Safety First" or RAC-specific badge.',
        upload: 'Upload Logo'
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
        deviceHealth: 'Device Health',
        alert: {
          title: 'ALCOHOL DETECTED',
          desc: 'Positive reading detected.',
          measured: 'Measured'
        },
        actions: 'Actions',
        actionLog: {
          locked: 'Locked',
          generating: 'Generating...',
          logged: 'Logged',
          contacting: 'Contacting...',
          sent: 'Sent'
        },
        close: 'Close'
      },
      protocol: {
        title: 'Protocol',
        positiveTitle: 'Positive',
        positiveDesc: 'Lockout.',
        resetTitle: 'Reset',
        resetDesc: 'Manual.'
      },
      features: {
        title: 'Features',
        iotTitle: 'IoT',
        iotDesc: 'Connected.',
        accessTitle: 'Access',
        accessDesc: 'Barriers.',
        complianceTitle: 'Compliance',
        complianceDesc: 'Rules.'
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
        robotics: '6. Robotic Protocols',
        troubleshoot: '7. Troubleshooting',
        architecture: '8. System Architecture'
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
          d: { title: 'Output', steps: ['KPI Panel', 'Access Control', 'Notifications'] }
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
          gateDesc: 'Checks User Role',
          logic: '[ LOGIC ENGINE ]',
          checkCap: 'Check Capacity',
          checkMatrix: 'Check Matrix Lock',
          checkDl: 'Check DL Validity',
          dbState: '[ DATABASE STATE ]',
          updateRecord: 'Updates Record',
          automation: '[ AUTOMATION ]',
          emailTrig: '📧 Email/SMS',
          printTrig: '🖨️ Auto-Print',
          aiTrig: '🤖 AI Analysis'
        },
        robotics: {
          title: 'Robotic Self-Healing Protocols',
          subtitle: 'Automated resilience and diagnostic systems.',
          crash: {
            title: 'Auto-Recovery Engine',
            desc: 'The system utilizes a React Error Boundary wrapper. Intercepts crashes and attempts state recovery.'
          },
          diagnostics: {
            title: 'Active Diagnostics',
            desc: 'System Admins can manually trigger the "RoboTech Healer Protocol" to optimize memory and shards.'
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
        bio: 'Experienced developer specializing in enterprise safety systems.'
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
        phase1: 'Discovery',
        phase1desc: 'Requirements',
        phase2: 'Development',
        phase2desc: 'Build',
        phase3: 'Testing',
        phase3desc: 'UAT',
        phase4: 'Deployment',
        phase4desc: 'Live',
        phase5: 'Support',
        phase5desc: 'Maintenance'
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
        security: 'JWT'
      },
      financials: {
        title: 'Financial Proposal',
        items: [
          { name: 'Initial Development', type: 'One-time', cost: '$12,000.00' },
          { name: 'Development & Setup', type: 'One-time', cost: '$6,000.00' },
          { name: 'Cloud Infrastructure', type: 'Monthly', cost: '$2,500.00' },
          { name: 'Training & Documentation', type: 'One-time', cost: '$2,500.00' },
          { name: 'Maintenance & Support', type: 'Monthly', cost: '$1,500.00' }
        ]
      },
      roadmap: {
        title: 'Strategic Roadmap',
        auth: 'Authentication',
        authDesc: 'SSO',
        db: 'Database',
        dbDesc: 'Cloud',
        email: 'Notifications',
        emailDesc: 'Gateway',
        hosting: 'Hosting',
        hostingDesc: 'Cloud'
      },
      aiFeatures: {
        title: 'AI Integration',
        chatbot: 'Advisor',
        reporting: 'Reports'
      },
      futureUpdates: {
        title: 'Future Modules',
        moduleA: 'A - ERP',
        moduleB: 'B - Hardware'
      },
      enhancedCaps: {
        title: 'Enhanced Capabilities',
        mobileVerify: { desc: 'Mobile App' },
        autoBooking: { desc: 'Auto-Booking' },
        massData: { desc: 'Analytics' }
      },
      conclusion: {
        title: 'Conclusion',
        text: 'This system represents a significant leap forward.'
      },
      thankYou: {
        title: 'Thank You',
        contact: 'Contact us',
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
      aiPromptSystem: 'Analyzing multi-tenant risk vectors.',
      aiPromptEnterprise: 'Analyzing site compliance.',
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
      proposal: 'Proposta',
      integration: 'Conectores'
    },
    integrationHub: {
      title: 'Hub de Integração de Dados',
      subtitle: 'Conecte bases externas de funcionários (SAP, Excel, SQL)',
      newConnector: 'Novo Conector',
      activeConnectors: 'Conectores Ativos',
      syncHistory: 'Histórico de Sincronização',
      lastSync: 'Última Sinc.',
      healthy: 'Saudável',
      error: 'Erro',
      idle: 'Inativo',
      syncNow: 'Sincronizar Agora',
      dryRun: 'Simulação',
      validateMapping: 'Validar Mapeamento',
      scheduler: 'Agendamento',
      wizard: {
        step1Title: 'Tipo de Origem',
        step1Desc: 'Como seus dados estão armazenados.',
        step2Title: 'Configuração',
        step2Desc: 'Detalhes de conexão ou arquivo.',
        step3Title: 'Mapeador Visual',
        step3Desc: 'Ligue seus campos ao sistema RACS.',
        step4Title: 'Validação e Prévia',
        step4Desc: 'Verifique a integridade antes de finalizar.',
        systemField: 'Campo do Sistema',
        sourceField: 'Coluna de Origem',
        mappingSuccess: 'Mapeamento Validado'
      },
      types: {
        excel: 'Excel / CSV',
        database: 'Banco SQL',
        api: 'App Customizado / API'
      },
      conflicts: {
        title: 'Resolução de Conflitos',
        desc: 'Registros duplicados encontrados. Selecione a fonte mestre.',
        trustSource: 'Hierarquia de Confiança',
        manualReview: 'Revisar Conflito',
        resolveAll: 'Auto-Resolver Tudo',
        keepSource: 'Manter Origem',
        keepSystem: 'Manter Sistema'
      }
    },
    dashboard: {
      title: 'Painel',
      subtitle: 'Visão Geral',
      upcoming: {
        title: 'Sessões Futuras',
        viewSchedule: 'Ver Cronograma',
        date: 'Date',
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
        integration: 'Integração',
        branding: 'Marca',
        diagnostics: 'Diagnósticos'
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
      branding: {
        title: 'Marca do Locatário',
        subtitle: 'Atualize a identidade do aplicativo e logotipos de segurança.',
        save: 'Salvar Marca',
        brandName: 'Nome da Marca',
        appName: 'Nome do Aplicativo',
        appNameDesc: 'Este nome aparece na barra lateral e no cabeçalho principal.',
        corporateLogo: 'Logotipo Corporativo',
        safetyLogo: 'Logotipo Safety First',
        safetyLogoDesc: 'Geralmente um distintivo "Safety First" ou específico de RAC.',
        upload: 'Carregar Logotipo'
      },
      integrationPage: {
        title: 'Integração de Dados',
        sourceA: 'Fonte A',
        sourceB: 'Fonte B',
        middleware: 'Status do Middleware',
        processing: 'Processando...',
        syncNow: 'Sincronizar Agora',
        waiting: 'Aguardando comando...'
      },
      saving: 'Salvando...',
      saveAll: 'Salvar Alterações'
    },
    cards: {
      title: 'Impressão de Cartões',
      requestButton: 'Solicitar Cartões',
      sending: 'Enviando Solicitação...',
      eligibility: {
        failedTitle: 'Não Elegível',
        failedMsg: 'Você não atende aos requisitos.',
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
      subtitle: 'Documentação do Sistema',
      sysAdmin: {
        title: 'Manual Admin do Sistema',
        subtitle: 'Controle Completo',
        configTitle: 'Configuração',
        configDesc: 'Dados fundamentais.',
        rooms: 'Configurar Salas',
        trainers: 'Gerenciar Formadores',
        racs: 'Definiir RACs',
        dbTitle: 'Gerenciamento BD',
        dbDesc: 'Registros de funcionários.',
        restrictionWarning: 'Nota: Restrições de matriz.',
        csv: 'Importação CSV.',
        active: 'Garantir status ativo.'
      },
      racAdmin: {
        title: 'Manual Admin RAC',
        subtitle: 'Operações de Treinamento',
        schedTitle: 'Agendamento',
        schedDesc: 'Calendários.',
        create: 'Criar Sessão',
        lang: 'Idioma',
        autoTitle: 'Auto-Agendamento',
        autoDesc: 'Manuseio.',
        approve: 'Aprovar ou Rejeitar.',
        renewTitle: 'Renovações',
        renewDesc: 'Filas.'
      },
      racTrainer: {
        title: 'Manual do Formador',
        subtitle: 'Avaliação',
        inputTitle: 'Resultados',
        inputDesc: 'Inserção.',
        grading: 'Presença e notas.',
        rac02: 'Regra RAC 02.',
        save: 'Salvar.'
      },
      deptAdmin: {
        title: 'Manual Admin Dept',
        subtitle: 'Supervisão',
        reqTitle: 'Cartões',
        reqDesc: 'Emissão.',
        search: 'Pesquisar.',
        print: 'Imprimir.',
        repTitle: 'Relatórios',
        repDesc: 'Análises.'
      },
      user: {
        title: 'Manual do Usuário',
        subtitle: 'Autoatendimento',
        statusTitle: 'Verificando Status',
        statusDesc: 'Painel.',
        filterAlert: 'Filtros.',
        green: 'Conforme.',
        red: 'Atenção.',
        qr: 'QR Digital.'
      }
    },
    feedback: {
      title: 'Feedback',
      subtitle: 'Ajude-nos a melhorar',
      typeLabel: 'Tipo',
      types: {
        Bug: 'Erro',
        Improvement: 'Recurso',
        General: 'Comentário'
      },
      messageLabel: 'Mensagem',
      msgPlaceholder: 'Descreva...',
      button: 'Enviar',
      adminTitle: 'Administração',
      manage: 'Gerenciar Feedback',
      status: {
        New: 'Novo',
        InProgress: 'Em Progresso',
        Resolved: 'Resolvido',
        Dismissed: 'Dispensado'
      },
      actionable: 'Acionável',
      noSelection: 'Nenhum item',
      selectPrompt: 'Selecione.',
      submittedBy: 'Enviado Por',
      internalNotes: 'Notas',
      visibleAdmin: 'Admins',
      deleteRecord: 'Excluir',
      markedActionable: 'Actionable',
      markActionable: 'Acionável',
      workflow: 'Status',
      priority: 'Prioridade'
    },
    communications: {
      title: 'Comunicações',
      subtitle: 'Log de Mensagens',
      clear: 'Limpar',
      search: 'Pesquisar...',
      empty: 'Vazio',
      select: 'Selecione.',
      sms: 'Notificação SMS',
      gateway: 'Gateway',
      to: 'Para',
      automated: 'Automático.'
    },
    alcohol: {
      dashboard: {
        title: 'Controle de Álcool',
        subtitle: 'Painel IoT',
        live: 'AO VIVO',
        backToLive: 'Voltar ao Vivo',
        specs: 'Especificações',
        kpi: {
          total: 'Total',
          violations: 'Violações',
          health: 'Saúde'
        },
        online: 'Online',
        hourlyTrend: 'Tendência Horária',
        dailyTrend: 'Tendência Diária',
        deviceLoad: 'Carga',
        complianceRatio: 'Taxa',
        liveStream: 'Real-time',
        mqtt: 'MQTT',
        deviceHealth: 'Saúde Dispositivo',
        alert: {
          title: 'ÁLCOOL',
          desc: 'Positivo.',
          measured: 'Medido'
        },
        actions: 'Ações',
        actionLog: {
          locked: 'Bloqueado',
          generating: 'Gerando...',
          logged: 'Registrado',
          contacting: 'Contatando...',
          sent: 'Enviado'
        },
        close: 'Fechar'
      },
      protocol: {
        title: 'Protocolo',
        positiveTitle: 'Positivo',
        positiveDesc: 'Bloqueio.',
        resetTitle: 'Reset',
        resetDesc: 'Manual.'
      },
      features: {
        title: 'Recursos',
        iotTitle: 'IoT',
        iotDesc: 'Conectado.',
        accessTitle: 'Acesso',
        accessDesc: 'Barriers.',
        complianceTitle: 'Conformidade',
        complianceDesc: 'Regras.'
      }
    },
    logs: {
      title: 'Logs',
      levels: {
        all: 'Todos',
        info: 'Info',
        warn: 'Aviso',
        error: 'Erro',
        audit: 'Auditoria'
      },
      table: {
        level: 'Nível',
        timestamp: 'Timestamp',
        user: 'Usuário',
        message: 'Mensagem'
      }
    },
    adminManual: {
      title: 'Manual Admin',
      subtitle: 'Guia do Sistema',
      slides: {
        intro: '1. Introdução',
        logic: '2. Motor Lógico',
        dashboard: '3. Painel',
        workflows: '4. Fluxos',
        advanced: '5. Config',
        robotics: '6. Protocolos',
        troubleshoot: '7. Solução',
        architecture: '8. Arquitetura'
      },
      content: {
        confidential: 'CONFIDENTIAL',
        production: 'PRODUÇÃO',
        logic: {
          title: 'Conformidade',
          desc: 'Matriz booleana.',
          active: 'Ativo',
          aso: 'ASO',
          racs: 'RACs',
          result: 'STATUS'
        },
        dashboard: {
          operational: {
            title: 'Operacional',
            kpi: 'KPIs',
            renewal: 'Renovação',
            auto: 'Auto-Agendamento'
          },
          enterprise: {
            title: 'Empresarial',
            global: 'Visão Global',
            risk: 'Mapas de Risco',
            ai: 'IA'
          }
        },
        workflows: {
          a: { title: 'Ingestão', steps: ['Fonte A', 'Fonte B', 'Sync'] },
          b: { title: 'Processo', steps: ['Normalização', 'Conflitos', 'Status'] },
          c: { title: 'Análise', steps: ['Taxas', 'Tendências', 'Relatórios IA'] },
          d: { title: 'Saída', steps: ['KPIs', 'Acesso', 'Alertas'] }
        },
        advanced: {
          gov: { title: 'Governança', desc: 'Regras por local.' },
          alcohol: { title: 'IoT Álcool', desc: 'Integração catracas.' }
        },
        troubleshoot: {
          0: { issue: 'Login', solution: 'Rede.' },
          1: { issue: 'Sync', solution: 'Middleware.' },
          2: { issue: 'Lento', solution: 'Cache.' },
          3: { issue: 'Mobile', solution: 'Gire.' },
          4: { issue: 'Outros', solution: 'Suporte.' }
        },
        architecture: {
          ui: '[ UI ]',
          gate: '[ GATE ]',
          gateDesc: 'Regras.',
          logic: '[ ENGINE ]',
          checkCap: 'Capacidade',
          checkMatrix: 'Matriz',
          checkDl: 'Carta',
          dbState: '[ DB ]',
          updateRecord: 'Atualiza.',
          automation: '[ AUTOMAÇÃO ]',
          emailTrig: '📧 Email/SMS',
          printTrig: '🖨️ Impressão',
          aiTrig: '🤖 Análise IA'
        },
        robotics: {
          title: 'Cura Robótica',
          subtitle: 'Resiliência automática.',
          crash: {
            title: 'Recuperação',
            desc: 'Intercepta falhas.'
          },
          diagnostics: {
            title: 'Ativo',
            desc: 'Otimização.'
          }
        }
      }
    },
    proposal: {
      aboutMe: {
        title: 'Sobre',
        name: 'Pita Domingos',
        preferred: 'Pita',
        cert: 'Full Stack',
        role: 'Arquiteto',
        bio: 'Experiente em segurança.'
      },
      execSummary: {
        title: 'Resumo',
        text: 'Solução digital.',
        quote: '"Segurança é valor."'
      },
      objectives: {
        title: 'Objetivos',
        problemTitle: 'Problema',
        problemText: 'Manuais.',
        solutionTitle: 'Solução',
        goals: ['Centralizado', 'Automático', 'Real-time']
      },
      organogram: {
        title: 'Técnico',
        tech1: 'Frontend',
        tech2: 'Backend'
      },
      timeline: {
        title: 'Cronograma',
        phase1: 'Fase 1',
        phase1desc: 'Discovery',
        phase2: 'Fase 2',
        phase2desc: 'Build',
        phase3: 'Fase 3',
        phase3desc: 'Testes',
        phase4: 'Fase 4',
        phase4desc: 'Live',
        phase5: 'Fase 5',
        phase5desc: 'Suporte'
      },
      techStack: {
        title: 'Tecnologia',
        frontendTitle: 'Frontend',
        frontend: 'React',
        backendTitle: 'Backend',
        backend: 'Node.js',
        databaseTitle: 'BD',
        database: 'PostgreSQL',
        securityTitle: 'Segurança',
        security: 'JWT'
      },
      financials: {
        title: 'Financeiro',
        items: [
          { name: 'Initial', type: 'Unico', cost: '$12,000' },
          { name: 'Setup', type: 'Unico', cost: '$6,000' },
          { name: 'Cloud', type: 'Mensal', cost: '$2,500' },
          { name: 'Training', type: 'Unico', cost: '$2,500' },
          { name: 'Maintenance', type: 'Mensal', cost: '$1,500' }
        ]
      },
      roadmap: {
        title: 'Estratégico',
        auth: 'Auth',
        authDesc: 'SSO',
        db: 'BD',
        dbDesc: 'Nuvem',
        email: 'Alertas',
        emailDesc: 'Gateway',
        hosting: 'Nuvem',
        hostingDesc: 'Nuvem'
      },
      aiFeatures: {
        title: 'Recursos IA',
        chatbot: 'Chatbot',
        reporting: 'Insights'
      },
      futureUpdates: {
        title: 'Módulos',
        moduleA: 'ERP',
        moduleB: 'IoT'
      },
      enhancedCaps: {
        title: 'Capacidades',
        mobileVerify: { desc: 'App Verificação' },
        autoBooking: { desc: 'Auto-Agendamento' },
        massData: { desc: 'Big Data' }
      },
      conclusion: {
        title: 'Conclusion',
        text: 'Grande avanço.'
      },
      thankYou: {
        title: 'Obrigado',
        contact: 'Contato',
        phone: '+258 84 123 4567'
      },
      digitalTrans: 'Iniciativa de Transformação Digital'
    },
    ai: {
      systemPromptAdvice: 'Especialista. Conselhos sobre {rac} em {language}.',
      systemPromptReport: 'Analista. Relatório em {language}.'
    },
    advisor: {
      button: 'Consultor',
      title: 'Consultor Gemini',
      sender: 'Gemini',
      emptyState: 'Como posso ajudar?',
      placeholder: 'RACs, procedimentos...'
    },
    enterprise: {
      systemTitle: 'Comando Empresarial',
      systemSubtitle: 'Multi-Tenant SaaS',
      title: 'Painel Empresarial',
      subtitle: 'Operações Globais',
      siteName: 'Site',
      globalHealth: 'Saúde Global',
      totalWorkforce: 'Total Pessoal',
      topPerformer: 'Melhor Unidade',
      needsAttention: 'Requer Atenção',
      noData: 'Vazio',
      tenantMatrix: 'Matriz de Locatários',
      systemView: 'Sistema',
      siteComparison: 'Comparação Sites',
      riskHeatmap: 'Risco por Depto',
      selectPrompt: 'Selecione "Todos".',
      aiAuditor: 'Auditor IA',
      aiDirector: 'Diretor IA',
      systemIntelligence: 'Inteligência',
      companyIntelligence: 'Para',
      aiPrompt: 'Gerando...',
      aiPromptSystem: 'Analisando vetores.',
      aiPromptEnterprise: 'Analisando conformidade.',
      bottlenecks: 'Gargalos Treinamento',
      failure: 'Falha'
    },
    racDefs: {
        RAC01: 'RAC 01 - Trabalho em Altura',
        RAC02: 'RAC 02 - Veículos e Equipamentos',
        RAC03: 'RAC 03 - Bloqueio',
        RAC04: 'RAC 04 - Proteção',
        RAC05: 'RAC 05 - Confinado',
        RAC06: 'RAC 06 - Içamento',
        RAC07: 'RAC 07 - Solo',
        RAC08: 'RAC 08 - Elétrica',
        RAC09: 'RAC 09 - Explosivos',
        RAC10: 'RAC 10 - Metal',
        RAC11: 'RAC 11 - Tráfego',
        PTS: 'PTS - Permissão',
        ART: 'ART - Análise',
        LIB_OPS: 'LIB-OPS - Operacional',
        LIB_MOV: 'LIB-MOV - Movimentação'
    },
    notifications: {
        capacityTitle: 'Capacidade',
        capacityMsg: 'Movidos para'
    }
  }
};