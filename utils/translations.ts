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
      absent: 'Absent',
      waitlisted: 'Waitlisted',
      enterpriseView: 'Enterprise View',
      complianceRate: 'Compliance Rate',
      testsProcessed: 'Tests Processed',
      active: 'Active',
      parentCompany: 'Main Contractor',
      subcontractor: 'Subcontractor',
      tier: 'Hierarchy Tier',
      stats: {
        totalRecords: 'Total Records',
        passRate: 'Pass Rate',
        passed: 'Passed',
        failed: 'Failed',
        totalUsers: 'Total Users',
        active: 'Active',
        admins: 'Admins'
      }
    },
    login: {
      title: 'CARS Manager',
      subtitle: 'Safety Compliance Portal',
      usernameLabel: 'Username / Personnel ID',
      passwordLabel: 'Master Key',
      usernamePlaceholder: 'e.g. Pita Domingos',
      passwordPlaceholder: 'Leave empty for first login',
      establishing: 'Authorizing...',
      submitBtn: 'Establish Link',
      version: 'v2.5 Architecture • Encrypted',
      welcome: 'Welcome, {name}!',
      setupDesc: 'This is your first login. Please create a secure password to activate your access link.',
      newKey: 'New Master Key',
      newKeyPlaceholder: 'Min. 6 characters',
      confirmKey: 'Confirm Key',
      activateBtn: 'Activate Portal',
      backToLogin: 'Go Back to Login',
      invalid: 'Invalid credentials. Access denied.',
      applying: 'Applying...',
      errorMinChar: 'Password must be at least 6 characters.',
      errorMatch: 'Passwords do not match.',
      errorSave: 'Failed to save password.'
    },
    nav: {
      dashboard: 'Dashboard',
      booking: 'Requisitions',
      records: 'Records',
      database: 'Database',
      reports: 'Reports',
      enterpriseDashboard: 'Enterprise',
      alcohol: 'Alcohol Control',
      requestCards: 'Request Cards',
      communications: 'Communications',
      schedule: 'Schedule',
      siteGovernance: 'Governance',
      trainerInput: 'Instructor Input',
      users: 'Users',
      settings: 'Settings',
      logs: 'Logs',
      manuals: 'Manuals',
      integration: 'Integration',
      presentation: 'Proposal Presentation',
      techDocs: 'Technical Docs',
      blueprint: 'System Blueprint'
    },
    technicalManual: {
      header: {
        title: 'System Architecture Blueprint',
        confidential: 'Confidential / Internal Use Only',
        status: 'Document Status',
        statusValue: 'Production Ready',
        specTitle: 'Technical Specification',
        specSubtitle: 'Autonomous Safety & Compliance Infrastructure',
        printBtn: 'Print to PDF'
      },
      index: {
        title: 'Blueprints Index',
        s1: '1. Multi-Tenant Onboarding',
        s2: '2. Data Sync & Normalization',
        s3: '3. Compliance Logic Matrix',
        s4: '4. Zero-Touch Scheduling',
        s5: '5. RLS & Encryption Layers',
        s6: '6. IoT Gateway & Gate Control'
      },
      onboarding: {
        title: '1. Multi-Tenant Provisioning',
        text: 'The system utilizes a multi-tenant architecture where each Company (Enterprise Node) acts as a logical data partition.',
        step1: 'Node Creation',
        step1desc: 'Database entry in public.companies defining the UUID and app alias.',
        step2: 'Site Mapping',
        step2desc: 'Recursive site allocation under the company parent for physical location isolation.',
        step3: 'Identity Inject',
        step3desc: 'Provisioning of local Enterprise Admins via the User Management gateway.'
      },
      sync: {
        title: '2. Data Normalization Flow',
        text: 'The sync engine executes nightly batch updates. It compares the local employees table against the restful response from SuccessFactors. If a Record ID is found, the system performs a partial patch on non-critical metadata. If not found, a new profile is provisioned.',
        middleware: 'CARS Engine',
        logic: 'SYNC_LOGIC: Map [VUL_ID] and [CONTRACTOR_ID] -> Global [RECORD_ID]'
      },
      logic: {
        title: '3. The Compliance Logic Formula',
        step1: 'Identity Check',
        step1desc: 'IF employee.is_active IS FALSE -> RETURN BLOCKED',
        step2: 'Medical (ASO) Validation',
        step2desc: 'IF current_date > req.aso_expiry_date -> RETURN BLOCKED',
        step3: 'RAC Proficiency Array',
        step3desc: 'FOR EACH key IN req.required_racs: IF bookings.filter(passed, !expired).length == 0 -> RETURN BLOCKED'
      },
      iot: {
        title: '4. IoT Gateway & Gate Control Integration',
        text: 'CARS provides a REST API Layer specifically for turnstile hardware and breathalyzer integration. Integration is handled via Consumer API Keys with System-to-System (S2S) scope.',
        handshake: 'Handshake Protocol',
        p1: 'Polling Mode: Device sends Record ID to /api/v1/verify/{id}.',
        p2: 'Push Mode: IoT Hub posts positive BAC results to /api/v1/alcohol/log.',
        p3: 'Security: All hardware calls must present x-api-key in the request header.'
      },
      scheduling: {
        title: '5. Zero-Touch Scheduling Engine',
        text: 'The autonomous engine eliminates manual booking by monitoring the Expiry Vector. When a certification enters the RED ZONE (Expiry < 14 Days):',
        log: 'ENGINE scanning employee_requirements table... FOUND: [Paulo Manjate, RAC02, Expiry: D+12]'
      },
      footer: {
        line1: 'CARS Core Documentation',
        line2: 'Proprietary Logic • Version 2.5.0'
      }
    },
    dashboard: {
      title: 'Safety Command Center',
      subtitle: 'Critical Activity Requisition System (CARS)',
      systemStatus: 'Global Readiness Status',
      newRequisition: 'New Requisition',
      executiveOverview: 'Executive Overview',
      globalReadiness: 'Global Readiness',
      systemDescription: 'Critical Activity Requisition Matrix (Enterprise View). Real-time compliance monitoring across all site operations.',
      complianceAnalytics: 'Compliance Analytics',
      renewalManagement: 'Renewal Management',
      renewalDescription: 'System identified {count} staff members with certifications expiring in the next 30 days.',
      autoBookRenewals: 'Auto-Book Renewals',
      liveWorkforceMatrix: 'Live Workforce Matrix',
      personnelStatus: 'Active Personnel Status',
      waitlistAnalytics: 'Waitlist Pressure Index',
      waitlistSub: 'Modules requiring additional sessions',
      highDemand: 'HIGH DEMAND',
      upcoming: {
        title: 'Upcoming Scheduled Sessions',
        viewSchedule: 'View Schedule',
        date: 'Date',
        session: 'Session',
        capacity: 'Capacity',
        faculty: 'Instructor',
        empty: 'No upcoming sessions scheduled.'
      },
      booked: {
        title: 'Upcoming Bookings',
        personnel: 'Personnel',
        requirement: 'Requirement',
        details: 'Details',
        schedule: 'Schedule',
        registered: 'Registered',
        empty: 'No personnel booked for the upcoming sessions.'
      },
      kpi: {
        adherence: 'Workforce Adherence',
        certifications: 'Certifications',
        pending: 'Pending Reqs',
        expiring: 'Expiring Soon',
        scheduled: 'Scheduled Sessions',
        accessGranted: 'Access Granted'
      },
      charts: {
        compliant: 'Authorized',
        nonCompliant: 'Blocked',
        complianceTitle: 'Training Compliance Matrix',
        complianceSubtitle: 'Requirement Adherence by Module',
        accessTitle: 'Site Access Permissions',
        missing: 'Missing Requirements',
        accessLegend: '"{compliant}" = Valid ASO + All Required RACs passed. "{nonCompliant}" = Expired ASO or Missing Required RACs.'
      }
    },
    booking: {
      title: 'New Requisition',
      selfServiceTitle: 'Self-Service Requisition',
      secureMode: 'Secure Matrix Active',
      success: 'Requisition Submitted Successfully',
      selectSession: 'Select Training Session',
      chooseSession: 'Choose a session...',
      addRow: 'Add Personnel',
      submitBooking: 'Submit Requisition',
      waitlistWarning: 'Capacity Alert: Selected session is at full capacity. New students will be added to the Waiting List.',
      demandAlertTitle: 'Waitlist Threshold Reached',
      demandAlertMsg: 'Module {rac} has {count} people waitlisted. Please consider scheduling a new session.'
    },
    results: {
      searchPlaceholder: 'Search by Name or ID...',
      passport: 'My Passport',
      export: 'Export CSV',
      viewWaitlist: 'Queue Management',
      viewAll: 'All Records',
      table: {
        employee: 'Personnel',
        session: 'Requirement',
        date: 'Evaluation Date',
        trainer: 'Evaluator',
        theory: 'Theory',
        status: 'Authorization',
        expiry: 'Expiry'
      }
    },
    database: {
        active: 'Active',
        importSuccess: 'Import successful',
        importCsv: 'Import CSV',
        confirmDelete: 'Are you sure?',
        confirmDeleteMsg: 'This action cannot be undone.'
    },
    users: {
        title: 'User Management',
        subtitle: 'Manage system access and permissions.',
        addUser: 'Add User',
        modal: {
            title: 'New User',
            name: 'Name',
            email: 'Email',
            createUser: 'Create User'
        },
        table: {
            user: 'User',
            role: 'Role',
            status: 'Status',
            actions: 'Actions'
        }
    },
    schedule: {
        title: 'Training Schedule',
        subtitle: 'Manage upcoming training sessions.',
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
    settings: {
        title: 'System Settings',
        globalConfig: 'Global Configuration',
        localConfig: 'Local Site Configuration',
        saveAll: 'Save Changes',
        tabs: {
            branding: 'Branding'
        },
        branding: {
            title: 'Tenant Branding',
            appName: 'Application Name',
            safetyLogo: 'Safety Badge'
        }
    },
    alcohol: {
        dashboard: {
            title: 'Alcohol Control',
            subtitle: 'Real-time monitoring',
            live: 'Live Feed',
            online: 'Online',
            specs: 'Technical Specs',
            backToLive: 'Back to Live',
            onlineStatus: 'Online',
            hourlyTrend: 'Hourly Trend',
            dailyTrend: 'Daily Trend',
            deviceLoad: 'Device Load',
            complianceRatio: 'Compliance Ratio',
            liveStream: 'Live Stream',
            mqtt: 'MQTT Protocol',
            deviceHealth: 'Device Health',
            close: 'Close',
            actions: 'Automated Actions',
            kpi: {
                total: 'Total Tests',
                violations: 'Violations',
                health: 'System Health'
            },
            alert: {
                title: 'POSITIVE DETECTION',
                desc: 'Access sequence halted',
                measured: 'Measured BAC'
            },
            actionLog: {
                locked: 'Locked gate sequence initiated',
                logged: 'Logged to employee record',
                generating: 'Generating AI risk report...',
                contacting: 'Contacting onsite security...',
                sent: 'Alert sent'
            }
        },
        protocol: {
            title: 'Control Protocols',
            positiveTitle: 'Positive Protocol',
            positiveDesc: 'Immediate gate lockout and supervisor notification.',
            resetTitle: 'Reset Protocol',
            resetDesc: 'Requires HR verification for clearance.'
        },
        features: {
            title: 'Integrated Features',
            iotTitle: 'IoT Connection',
            iotDesc: 'Direct hardware sync.',
            accessTitle: 'Access Denial',
            accessDesc: 'Instant lockout.',
            complianceTitle: 'Compliance Link',
            complianceDesc: 'Automatic result logging.'
        }
    },
    enterprise: {
        title: 'Enterprise Dashboard',
        subtitle: 'Global analytics across all operations',
        systemTitle: 'Platform Command',
        systemSubtitle: 'Multi-tenant infrastructure view',
        globalHealth: 'Global Health',
        totalWorkforce: 'Total Workforce',
        topPerformer: 'Better Performance',
        needsAttention: 'Needs Attention',
        noData: 'No data',
        tenantMatrix: 'Tenant Matrix',
        systemView: 'System Admin View',
        siteComparison: 'Site Comparison',
        selectPrompt: 'Select a filter to compare sites',
        riskHeatmap: 'Risk Heatmap',
        aiAuditor: 'AI Safety Auditor',
        aiDirector: 'AI Director',
        systemIntelligence: 'System Intelligence',
        companyIntelligence: 'Analytics for',
        aiPrompt: 'Request analysis',
        aiPromptSystem: 'Generate global safety report',
        aiPromptEnterprise: 'Generate enterprise report',
        bottlenecks: 'Training Bottlenecks',
        failure: 'Failure Rate',
        siteName: 'Site',
        supplyChain: 'Supply Chain Compliance',
        primeVendor: 'Prime Vendor'
    },
    proposal: {
        digitalTrans: 'Digital Safety Transformation',
        autoScheduling: {
            title: 'Zero-Touch Autonomous Scheduling',
            subtitle: 'Predictive Resource Optimization',
            triggerTitle: 'Continuous Listening',
            triggerDesc: 'System monitors 4 key operational risk signals 24/7.',
            brainTitle: 'AI Decision Logic',
            brainDesc: 'Autonomous capacity matching, instructor balancing, and venue routing.',
            outputTitle: 'Zero-Touch Delivery',
            outputDesc: 'Calendar events, SMS invites, and room bookings created without human input.',
            outcomeNote: 'From Manual Entry to Autonomous Reliability',
            triggers: {
                new: 'New Hires (Blocked)',
                expired: 'Expiries < 14 Days',
                failed: 'Retake Queues',
                absent: 'Attendance Recall'
            },
            features: {
                creation: 'Auto-Session Creation',
                creationDesc: 'System generates new RAC sessions based on waitlist pressure.',
                invites: 'Closed-Loop Invites',
                invitesDesc: 'Automated SMS/Email coordination with trainees.',
                resolution: 'Constraint Resolution',
                resolutionDesc: 'Ensures no double-booking of rooms or instructors.'
            }
        },
        scenario: {
            title: 'Operational Readiness Scenario',
            challenge: 'The Legacy Challenge',
            challengeSub: 'Disconnected Datasets',
            challengeText: 'Operator Paulo Manjate has a RAC 01 expiring in {days} days. HSE only discovers this during a gate lockout.',
            automation: 'Integrated Readiness',
            automationSub: 'Predictive Sync',
            automationText1: 'Sync Engine identifies Paulo\'s {days}-day window and checks medical status.',
            automationText2: 'System validates room capacity and auto-reserves a renewal slot.',
            automationOutcome: 'Zero Production Downtime. Paulo is trained 48 hours BEFORE lockout.'
        },
        execSummary: {
            title: 'Executive Summary',
            text: 'CARS v2.5 is an autonomous digital safety ecosystem that transforms Critical Activity Requisitions (RAC 01-11) from manual tracking into a predictive operational pilot. By merging real-time IoT hardware telemetry with a zero-touch scheduling engine and Gemini AI intelligence, the platform ensures that 100% of the workforce is medically fit, certified, and physically authorized before they ever reach the risk zone.',
            quote: 'Converting reactive safety into autonomous operational resilience.'
        },
        objectives: {
            title: 'Primary Objectives',
            problemTitle: 'Current Barriers',
            problemText: 'Fragmented contractor data, manual certification tracking, and lack of real-time visibility into site-wide compliance levels.',
            solutionTitle: 'The Future State',
            goals: [
                'Automated HR & Contractor Data Normalization',
                'Autonomous Zero-Touch Predictive Scheduling',
                'IoT Physical Access & Alcohol Control Link',
                'AI-Driven HSE Forecasting & Risk Analytics'
            ]
        },
        integration: {
            title: 'Unified Data Ecosystem',
            staffSource: 'SuccessFactors / HR',
            staff: 'Permanent Staff',
            contractorSource: 'Contract Manager',
            contractor: 'Third-Party Vendors',
            middlewareTitle: 'Integration Hub',
            middlewareDesc: 'Restful API layer merging contractor and permanent datasets.',
            sourceTitle: 'CARS: Source of Truth',
            noManual: 'No Manual Onboarding',
            isolation: 'Logical Data Isolation',
            liveMatrix: 'Live Compliance Matrix'
        },
        organogram: {
            title: 'Project Structure',
            tech1: 'Architecture & DevOps',
            tech2: 'Cloud Data Engineer'
        },
        timeline: {
            title: 'Implementation Roadmap',
            phase1: 'Discovery & API Audit',
            phase1desc: 'Audit of HR and Contractor data sources.',
            phase2: 'Integration Layer',
            phase2desc: 'Developing the CARS Middleware for sync.',
            phase3: 'Module Deployment',
            phase3desc: 'Customizing RAC 01-11 evaluation logic.',
            phase4: 'Pilot Program',
            phase4desc: 'UAT testing at a single operational site.',
            phase5: 'Enterprise Scale',
            phase5desc: 'Global rollout to all departments.'
        },
        techStack: {
            title: 'Modern Architecture',
            frontendTitle: 'User Experience',
            frontend: 'React 19 • TypeScript • Tailwind',
            backendTitle: 'System Logic',
            backend: 'Node.js • Cloud Functions • Supabase',
            databaseTitle: 'Data Persistence',
            database: 'PostgreSQL • Vector Storage (AI)',
            securityTitle: 'Access Control',
            security: 'JWT • SSL • RLS Policy'
        },
        financials: {
            title: 'Investment Summary',
            headers: { desc: 'Description', cost: 'Investment' },
            items: {
                item1: 'Core Architecture & Initial Development',
                item2: 'System Setup & API Integration Layer',
                item3: 'Cloud Infrastructure & Managed SaaS',
                item4: 'Ongoing Maintenance & AI Engine'
            },
            initialInvest: 'Total Initial Investment',
            recurring: 'Monthly Recurring Services'
        },
        roadmap: {
            title: 'Strategic Roadmap',
            auth: 'Biometric Link',
            authDesc: 'Face-ID for field verify.',
            db: 'Predictive AI',
            dbDesc: 'Forecasting training load.',
            email: 'Automated SMS',
            emailDesc: 'Direct student notifications.',
            hosting: 'Mobile App',
            hostingDesc: 'Native iOS/Android build.'
        },
        aiFeatures: {
            title: 'Gemini Safety Intelligence',
            chatbot: 'Real-time safety advisor for RAC protocols.',
            reporting: 'Executive AI summaries of site-wide risks.'
        },
        futureUpdates: {
            title: 'V2 Expansion: IoT Access',
            moduleA: 'Alcohol Control Software',
            moduleADesc: 'Live breathalyzer integration with gate locking logic.',
            moduleB: 'Physical Infrastructure',
            moduleBDesc: 'Hardware deployment of connected turnstiles.'
        },
        enhancedCaps: {
            title: 'Enhanced Capabilities',
            mobileVerify: { title: 'Mobile Verification', desc: 'HSE officers can verify any passport instantly via QR scan.' },
            autoBooking: { title: 'Auto-Booking', desc: 'Predictive enrollment for expiring certifications.' },
            massData: { title: 'Mass Import', desc: 'Bulk processing of legacy contractor certificates.' }
        },
        conclusion: {
            title: 'The Path Forward',
            text: 'CARS is not just a training tool; it is an operational safeguard. It ensures that only those who are fit, trained, and authorized can enter the risk zone.'
        },
        thankYou: {
            title: 'Thank You',
            subtitle: 'Ready for Operational Deployment',
            email: 'pita.domingos@zd044.onmicrosoft.com',
            phone: '+258 84 547 9481'
        },
        waitlist: {
            title: 'Queue Intelligence',
            subtitle: 'Proactive Demand Management',
            capacityTitle: 'Capacity Guard',
            capacityDesc: 'Automatic redirection of overflow personnel to a FIFO waiting list.',
            demandTitle: 'Admin Notifications',
            demandDesc: 'Threshold-based alerts (e.g. 5+ waiting) to schedule new sessions.',
            outcome: 'Full Visibility',
            outcomeDesc: 'Never lose a requisition in email threads.'
        },
        workflow: {
            title: 'System Workflow Diagram',
            subtitle: 'End-to-End Data Lifecycle',
            step1: 'Submission',
            step1sub: 'HSE Requisition',
            step1actor: 'HSE / Contractor Admin',
            step1desc: 'Personnel requirements submitted for validation.',
            step2: 'Scheduling',
            step2sub: 'Allocation & Queue',
            step2actor: 'Training Dept',
            step2desc: 'Automated seat allocation or priority Waitlist entry.',
            step3: 'Evaluation',
            step3sub: 'Grading (Pass/Fail)',
            step3actor: 'RAC Instructor',
            step3desc: 'Trainer grading with real-time score auditing (Pass/Fail).',
            step4: 'Access Logic',
            step4sub: 'Matrix Compliance',
            step4actor: 'System Core',
            step4desc: 'Logic Merge: [Active] + [ASO] + [RAC Result] = Status.',
            step5: 'Certification',
            step5sub: 'Passport Issuance',
            step5actor: 'HSE Office',
            step5desc: 'Certification generation & secure digital card issuance.',
            step6: 'Verification',
            step6sub: 'Field QR Audit',
            step6actor: 'Field Safety Team',
            step6desc: 'Instant QR audit verifies authorization at risk zones.'
        },
        aboutMe: {
            title: 'System Architect Profile',
            name: 'Pita Domingos',
            preferred: 'Software Engineer & Safety Architect',
            bio: 'Over 8 years of experience building mission-critical enterprise systems. Specialized in integrating complex operational data into streamlined, high-performance web architectures that prioritize user safety and data integrity.',
            cert: 'Certified Cloud Solutions Architect',
            role: 'Founder & Lead Engineer at DigiSols',
            portfolioTitle: 'Enterprise Portfolio',
            portfolio: {
                edudesk: 'Higher Ed Management',
                h365: 'Medical Data Hub',
                swiftpos: 'Cloud Retail OS',
                microfin: 'Lending Analytics',
                sentinel: 'HSE Observation Tool',
                dataUnif: 'Integration Middleware'
            },
            archPhil: 'Architecture Philosophy',
            archPhilText: 'Logic should be invisible. Experience should be intuitive. Data must be absolute.'
        }
    },
    feedback: {
        title: 'User Feedback',
        subtitle: 'We value your input',
        adminTitle: 'Feedback Command',
        manage: 'Manage system reports',
        typeLabel: 'Feedback Type',
        messageLabel: 'Your message',
        msgPlaceholder: 'Describe your suggestion or issue...',
        button: 'Send Feedback',
        actionable: 'Actionable',
        noSelection: 'Select an entry to inspect',
        workflow: 'Workflow',
        priority: 'Priority',
        markActionable: 'Mark Actionable',
        markedActionable: 'Actionable Set',
        submittedBy: 'Submitted by',
        internalNotes: 'Internal Notes',
        visibleAdmin: 'Visible only to admins',
        deleteRecord: 'Delete Record',
        status: {
            New: 'New',
            InProgress: 'In Progress',
            Resolved: 'Resolved',
            Dismissed: 'Dismissed'
        },
        types: {
            Bug: 'Bug',
            Improvement: 'Improvement',
            General: 'General'
        }
    },
    trainer: {
        title: 'Instructor Input',
        loggedInAs: 'Instructor:',
        noSessions: 'No pending sessions',
        selectSession: 'Select Session',
        chooseSession: 'Choose an active session',
        saveResults: 'Commit Results'
    },
    communications: {
        title: 'Communication Hub',
        subtitle: 'Automated logs',
        clear: 'Clear logs',
        search: 'Search messages',
        empty: 'No messages logged',
        select: 'Select a message to preview',
        sms: 'SMS Message',
        to: 'To',
        automated: 'This is an automated system message',
        gateway: 'CARS SMS Gateway',
    },
    logs: {
        title: 'System Logs',
        levels: {
            all: 'All Levels',
            info: 'INFO',
            warn: 'WARN',
            error: 'ERROR',
            audit: 'AUDIT'
        },
        table: {
            level: 'Level',
            timestamp: 'Timestamp',
            user: 'User',
            message: 'Message'
        }
    },
    reports: {
        title: 'Safety Analytics',
        subtitle: 'RACS Performance Metrics',
        generate: 'Generate Report',
        analyzing: 'Analisando...',
        executiveAnalysis: 'AI Executive Summary',
        stats: {
            totalTrained: 'Total Personnel',
            passRate: 'Success Rate',
            attendance: 'Attendance',
            noShows: 'No Shows'
        },
        filters: {
            period: 'Period',
            department: 'Department',
            racType: 'RAC Module',
            startDate: 'Start Date',
            endDate: 'End Date'
        },
        periods: {
            weekly: 'Weekly',
            monthly: 'Monthly',
            ytd: 'Year to Date',
            custom: 'Custom Range'
        },
        charts: {
            performance: 'Training Success',
            distributionTitle: 'Compliance Distribution',
            distributionSubtitle: 'Pass/Fail Ratio',
            aiSubtitle: 'Contextual Safety Intelligence',
            breakdownTitle: 'Specific evaluation results per module'
        },
        leaderboard: 'Evaluator Performance',
        printReport: 'Print Statistics',
        trainerMetrics: {
            students: 'Students',
            avgTheory: 'Avg Theory'
        },
        notes: {
            totalRecords: 'Total Records',
            passRate: 'Pass Rate',
            passed: 'Passed',
            failed: 'Failed',
            totalUsers: 'Total Users',
            active: 'Active',
            admins: 'Admins'
        },
        noShowsTitle: 'Unauthorized Absences'
    },
    racDefs: {
        RAC01: 'RAC 01 - Working at Height',
        RAC02: 'RAC 02 - Vehicles & Equipment',
        RAC03: 'RAC 03 - Energy Isolation',
        RAC04: 'RAC 04 - Machine Guarding',
        RAC05: 'RAC 05 - Confined Spaces',
        RAC06: 'RAC 06 - Lifting Operations',
        RAC07: 'RAC 07 - Ground Stability',
        RAC08: 'RAC 08 - Electrical Safety',
        RAC09: 'RAC 09 - Explosives Control',
        RAC10: 'RAC 10 - Molten Metal',
        RAC11: 'RAC 11 - Traffic Rules',
        PTS: 'PTS - Work Permit',
        ART: 'ART - Risk Assessment'
    },
    ai: {
        systemPromptAdvice: "You are a Safety Expert. Provide clear advice on {rac} in {language}.",
        systemPromptReport: "Analyze the following safety stats and provide an executive summary in {language}."
    }
  },
  pt: {
    common: {
      vulcan: 'CARS',
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
      save: 'Gravar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      print: 'Imprimir',
      download: 'Descarregar',
      import: 'Importar',
      template: 'Modelo',
      yes: 'Sim',
      no: 'Não',
      time: 'Hora',
      status: 'Estado',
      recordsFound: 'registos encontrados',
      completed: 'Concluído',
      timeLeft: 'restante',
      passed: 'Aprovado',
      failed: 'Reprovado',
      pending: 'Pendente',
      absent: 'Faltou',
      waitlisted: 'Lista de Espera',
      enterpriseView: 'Vista Corporativa',
      complianceRate: 'Taxa de Conformidade',
      testsProcessed: 'Testes Processados',
      active: 'Ativo',
      parentCompany: 'Empreiteiro Principal',
      subcontractor: 'Subempreiteiro',
      tier: 'Nível de Hierarquia',
      stats: {
        totalRecords: 'Total de Registos',
        passRate: 'Taxa de Aprovação',
        passed: 'Aprovados',
        failed: 'Reprovados',
        totalUsers: 'Total de Utilizadores',
        active: 'Ativos',
        admins: 'Admins'
      }
    },
    login: {
      title: 'Gestor CARS',
      subtitle: 'Portal de Conformidade de Segurança',
      usernameLabel: 'Utilizador / ID de Pessoal',
      passwordLabel: 'Chave Mestra',
      usernamePlaceholder: 'ex: Pita Domingos',
      passwordPlaceholder: 'Deixe vazio no primeiro acesso',
      establishing: 'Autorizando...',
      submitBtn: 'Estabelecer Link',
      version: 'Arquitetura v2.5 • Encriptado',
      welcome: 'Bem-vindo, {name}!',
      setupDesc: 'Este é o seu primeiro acesso. Por favor, crie uma senha segura para ativar o seu link.',
      newKey: 'Nova Chave Mestra',
      newKeyPlaceholder: 'Mín. 6 caracteres',
      confirmKey: 'Confirmar Chave',
      activateBtn: 'Ativar Portal',
      backToLogin: 'Voltar ao Login',
      invalid: 'Credenciais inválidas. Acesso negado.',
      applying: 'Aplicando...',
      errorMinChar: 'A senha deve ter pelo menos 6 caracteres.',
      errorMatch: 'As senhas não coincidem.',
      errorSave: 'Erro ao gravar senha.'
    },
    nav: {
      dashboard: 'Painel',
      booking: 'Requisições',
      records: 'Registos',
      database: 'Base de Dados',
      reports: 'Relatórios',
      enterpriseDashboard: 'Corporativo',
      alcohol: 'Controlo de Álcool',
      requestCards: 'Solicitar Cartões',
      communications: 'Comunicações',
      schedule: 'Agenda',
      siteGovernance: 'Governação',
      trainerInput: 'Entrada Instrutor',
      users: 'Utilizadores',
      settings: 'Definições',
      logs: 'Logs',
      manuals: 'Manuais',
      integration: 'Integração',
      presentation: 'Apresentação da Proposta',
      techDocs: 'Docs Técnicos',
      blueprint: 'Esquema do Sistema'
    },
    technicalManual: {
      header: {
        title: 'Esquema de Arquitetura do Sistema',
        confidential: 'Confidencial / Apenas para Uso Interno',
        status: 'Estado do Documento',
        statusValue: 'Pronto para Produção',
        specTitle: 'Especificação Técnica',
        specSubtitle: 'Infraestrutura Autónoma de Segurança e Conformidade',
        printBtn: 'Imprimir para PDF'
      },
      index: {
        title: 'Índice de Esquemas',
        s1: '1. Integração Multi-Cliente',
        s2: '2. Sincronização e Normalização',
        s3: '3. Matriz de Lógica de Conformidade',
        s4: '4. Agendamento Autónomo',
        s5: '5. Camadas de RLS e Encriptação',
        s6: '6. Gateway IoT e Controlo de Portaria'
      },
      onboarding: {
        title: '1. Aprovisionamento de Múltiplos Clientes',
        text: 'O sistema utiliza uma arquitetura multi-cliente onde cada Empresa (Nó Corporativo) atua como uma partição lógica de dados.',
        step1: 'Criação de Nó',
        step1desc: 'Entrada na base de dados em public.companies definindo o UUID e o pseudónimo da aplicação.',
        step2: 'Mapeamento de Sites',
        step2desc: 'Alocação recursiva de sites sob o nó pai da empresa para isolamento de localização física.',
        step3: 'Injeção de Identidade',
        step3desc: 'Provisionamento de Admins Corporativos locais através do gateway de Gestão de Utilizadores.'
      },
      sync: {
        title: '2. Fluxo de Normalização de Dados',
        text: 'O motor de sincronização executa atualizações em lote noturnas. Compara a tabela local de funcionários com a resposta restful do SuccessFactors. Se for encontrado um ID de Registo, o sistema executa um patch parcial nos metadados não críticos. Caso contrário, um novo perfil é aprovisionado.',
        middleware: 'Motor CARS',
        logic: 'LÓGICA_SYNC: Mapear [VUL_ID] e [CONTRACTOR_ID] -> Global [RECORD_ID]'
      },
      logic: {
        title: '3. A Fórmula da Lógica de Conformidade',
        step1: 'Verificação de Identidade',
        step1desc: 'SE colaborador.is_active FOR FALSO -> RETORNAR BLOQUEADO',
        step2: 'Validação Médica (ASO)',
        step2desc: 'SE data_atual > data_expiracao_aso -> RETORNAR BLOQUEADO',
        step3: 'Matriz de Proficiência RAC',
        step3desc: 'PARA CADA chave EM req.racs_obrigatorios: SE total_aprovados_nao_expirados == 0 -> RETORNAR BLOQUEADO'
      },
      iot: {
        title: '4. Integração de Gateway IoT e Controlo de Portaria',
        text: 'O CARS fornece uma Camada de API REST especificamente para hardware de catracas e integração de bafômetros. A integração é gerida através de Chaves de API de Consumidor com escopo Sistema-para-Sistema (S2S).',
        handshake: 'Protocolo de Handshake',
        p1: 'Modo de Consulta: O dispositivo envia o ID para /api/v1/verify/{id}.',
        p2: 'Modo Push: O Hub IoT publica resultados positivos de TAS para /api/v1/alcohol/log.',
        p3: 'Segurança: Todas as chamadas de hardware devem apresentar x-api-key no cabeçalho.'
      },
      scheduling: {
        title: '5. Motor de Agendamento Sem Intervenção',
        text: 'O motor autónomo elimina a reserva manual monitorizando o Vector de Expiração. Quando uma certificação entra na ZONA VERMELHA (Expiração < 14 Dias):',
        log: 'MOTOR a analisar tabela de requisitos... ENCONTRADO: [Paulo Manjate, RAC02, Exp: D+12]'
      },
      footer: {
        line1: 'Documentação Principal CARS',
        line2: 'Lógica Proprietária • Versão 2.5.0'
      }
    },
    dashboard: {
      title: 'Centro de Comando de Segurança',
      subtitle: 'Sistema de Requisição de Atividades Críticas (CARS)',
      systemStatus: 'Estado de Prontidão Global',
      newRequisition: 'Nova Requisição',
      executiveOverview: 'Resumo Executivo',
      globalReadiness: 'Prontidão Global',
      systemDescription: 'Matriz de Requisição de Atividade Crítica (Vista Corporativa). Monitorização de conformidade em tempo real.',
      complianceAnalytics: 'Analítica de Conformidade',
      renewalManagement: 'Gestão de Renovações',
      renewalDescription: 'O sistema identificou {count} colaboradores com certificações a expirar nos próximos 30 dias.',
      autoBookRenewals: 'Auto-Agendar Renovações',
      liveWorkforceMatrix: 'Matriz de Pessoal em Tempo Real',
      personnelStatus: 'Estado do Pessoal Ativo',
      waitlistAnalytics: 'Pressão da Lista de Espera',
      waitlistSub: 'Módulos que necessitam de sessões extras',
      highDemand: 'ALTA DEMANDA',
      upcoming: {
        title: 'Próximas Sessões Agendadas',
        viewSchedule: 'Ver Agenda',
        date: 'Data',
        session: 'Sessão',
        capacity: 'Capacidade',
        faculty: 'Instrutor',
        empty: 'Nenhuma sessão agendada em breve.'
      },
      booked: {
        title: 'Inscrições Recentes',
        personnel: 'Pessoal',
        requirement: 'Requisito',
        details: 'Detalhes',
        schedule: 'Agenda',
        registered: 'Inscritos',
        empty: 'Nenhum pessoal inscrito para as próximas sessões.'
      },
      kpi: {
        adherence: 'Aderência do Pessoal',
        certifications: 'Certificações',
        pending: 'Reqs Pendentes',
        expiring: 'Expira em Breve',
        scheduled: 'Sessões Marcadas',
        accessGranted: 'Acesso Concedido'
      },
      charts: {
        compliant: 'Autorizado',
        nonCompliant: 'Bloqueado',
        complianceTitle: 'Matriz de Conformidade de Treino',
        complianceSubtitle: 'Aderência aos Requisitos por Módulo',
        accessTitle: 'Permissões de Acesso ao Site',
        missing: 'Requisitos em Falta',
        accessLegend: '"{compliant}" = ASO Válido + Todos RACs necessários aprovados. "{nonCompliant}" = ASO Expirado ou RACs em falta.'
      }
    },
    booking: {
      title: 'Nova Requisição',
      selfServiceTitle: 'Auto-Requisição',
      secureMode: 'Matriz Segura Ativa',
      success: 'Requisição Submetida com Sucesso',
      selectSession: 'Selecionar Sessão de Treino',
      chooseSession: 'Escolha uma sessão...',
      addRow: 'Adicionar Pessoal',
      submitBooking: 'Submeter Requisição',
      waitlistWarning: 'Alerta de Capacidade: A sessão selecionada está lotada. Novos alunos serão adicionados à Lista de Espera.',
      demandAlertTitle: 'Limite de Espera Atingido',
      demandAlertMsg: 'Módulo {rac} tem {count} pessoas em espera. Considere agendar uma nova sessão.'
    },
    results: {
      searchPlaceholder: 'Pesquisar por Nome ou ID...',
      passport: 'Meu Passaporte',
      export: 'Exportar CSV',
      viewWaitlist: 'Gestão de Fila',
      viewAll: 'Todos os Registos',
      table: {
        employee: 'Pessoal',
        session: 'Requisito',
        date: 'Data de Avaliação',
        trainer: 'Avaliador',
        theory: 'Teoria',
        status: 'Autorização',
        expiry: 'Validade'
      }
    },
    database: {
        active: 'Ativo',
        importSuccess: 'Importação bem-sucedida',
        importCsv: 'Importar CSV',
        confirmDelete: 'Tem a certeza?',
        confirmDeleteMsg: 'Esta ação não pode ser desfeita.'
    },
    users: {
        title: 'Gestão de Utilizadores',
        subtitle: 'Gerir acessos e permissões do sistema.',
        addUser: 'Adicionar Utilizador',
        modal: {
            title: 'Novo Utilizador',
            name: 'Nome',
            email: 'E-mail',
            createUser: 'Criar Utilizador'
        },
        table: {
            user: 'Utilizador',
            role: 'Função',
            status: 'Estado',
            actions: 'Ações'
        }
    },
    schedule: {
        title: 'Agenda de Treinos',
        subtitle: 'Gerir próximas sessões de formação.',
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
            saveSession: 'Gravar Sessão'
        }
    },
    settings: {
        title: 'Definições do Sistema',
        globalConfig: 'Configuração Global',
        localConfig: 'Configuração Local do Site',
        saveAll: 'Gravar Alterações',
        tabs: {
            branding: 'Identidade'
        },
        branding: {
            title: 'Identidade do Cliente',
            appName: 'Nome da Aplicação',
            safetyLogo: 'Emblema de Segurança'
        }
    },
    alcohol: {
        dashboard: {
            title: 'Controlo de Álcool',
            subtitle: 'Monitorização em tempo real',
            live: 'Feed ao Vivo',
            online: 'Online',
            specs: 'Especificações Técnicas',
            backToLive: 'Voltar ao Vivo',
            onlineStatus: 'Online',
            hourlyTrend: 'Tendência Horária',
            dailyTrend: 'Tendência Diária',
            deviceLoad: 'Carga do Dispositivo',
            complianceRatio: 'Rácio de Conformidade',
            liveStream: 'Transmissão em Direto',
            mqtt: 'Protocolo MQTT',
            deviceHealth: 'Estado do Dispositivo',
            close: 'Fechar',
            actions: 'Ações Automáticas',
            kpi: {
                total: 'Total de Testes',
                violations: 'Violações',
                health: 'Saúde do Sistema'
            },
            alert: {
                title: 'DETEÇÃO POSITIVA',
                desc: 'Sequência de acesso interrompida',
                measured: 'TAS Medida'
            },
            actionLog: {
                locked: 'Iniciada sequência de bloqueio de portaria',
                logged: 'Registado no perfil do colaborador',
                generating: 'A gerar relatório de risco IA...',
                contacting: 'A contactar segurança local...',
                sent: 'Alert enviado'
            }
        },
        protocol: {
            title: 'Protocolos de Controlo',
            positiveTitle: 'Protocolo Positivo',
            positiveDesc: 'Bloqueio imediato da cancela e notificação do supervisor.',
            resetTitle: 'Protocolo de Reinício',
            resetDesc: 'Requer verificação de RH para desbloqueio.'
        },
        features: {
            title: 'Funcionalidades Integradas',
            iotTitle: 'Conexão IoT',
            iotDesc: 'Sincronização direta de hardware.',
            accessTitle: 'Negação de Acesso',
            accessDesc: 'Bloqueio instantâneo.',
            complianceTitle: 'Link de Conformidade',
            complianceDesc: 'Registo automático de resultados.'
        }
    },
    enterprise: {
        title: 'Painel Corporativo',
        subtitle: 'Analítica global em todas as operações',
        systemTitle: 'Comando da Plataforma',
        systemSubtitle: 'Vista de infraestrutura multi-cliente',
        globalHealth: 'Saúde Global',
        totalWorkforce: 'Força de Trabalho Total',
        topPerformer: 'Melhor Desempenho',
        needsAttention: 'Necessita Atenção',
        noData: 'Sem dados',
        tenantMatrix: 'Matriz de Clientes',
        systemView: 'Vista Admin do Sistema',
        siteComparison: 'Comparação de Sites',
        selectPrompt: 'Selecione um filtro para comparar sites',
        riskHeatmap: 'Mapa de Calor de Risco',
        aiAuditor: 'Arquiteto de Segurança IA',
        aiDirector: 'Diretor IA',
        systemIntelligence: 'Inteligência do Sistema',
        companyIntelligence: 'Analítica para',
        aiPrompt: 'Solicitar análise',
        aiPromptSystem: 'Gerar relatório de segurança global',
        aiPromptEnterprise: 'Gerar relatório corporativo',
        bottlenecks: 'Gargalos de Treino',
        failure: 'Taxa de Falha',
        siteName: 'Site',
        supplyChain: 'Conformidade da Cadeia de Suprimentos',
        primeVendor: 'Vendedor Principal'
    },
    proposal: {
        digitalTrans: 'Transformação Digital de Segurança',
        autoScheduling: {
            title: 'Agendamento Autónomo (Zero-Touch)',
            subtitle: 'Otimização Preditiva de Recursos',
            triggerTitle: 'Escuta Contínua',
            triggerDesc: 'O sistema monitoriza 4 sinais de risco operacional 24h por dia.',
            brainTitle: 'Cérebro de Decisão IA',
            brainDesc: 'Correspondência autónoma de capacidade, balanceamento de instrutores e rotas de locais.',
            outputTitle: 'Entrega Sem Intervenção',
            outputDesc: 'Convites e reservas de salas criados sem intervenção humana.',
            outcomeNote: 'Da Entrada Manual à Fiabilidade Autónoma',
            triggers: {
                new: 'Novos Colaboradores (Bloqueados)',
                expired: 'Expirações < 14 Dias',
                failed: 'Filas de Reprovação',
                absent: 'Recall de Assiduidade'
            },
            features: {
                creation: 'Criação Auto de Sessão',
                creationDesc: 'Sistema gera novas sessões RAC baseadas na pressão da lista de espera.',
                invites: 'Convites em Ciclo Fechado',
                invitesDesc: 'Coordenação automatizada por SMS/Email com os formandos.',
                resolution: 'Resolução de Conflitos',
                resolutionDesc: 'Garante que não haja marcações duplicadas de salas ou instrutores.'
            }
        },
        scenario: {
            title: 'Cenário de Prontidão Operacional',
            challenge: 'O Desafio Legado',
            challengeSub: 'Dados Desconectados',
            challengeText: 'O operador Paulo Manjate tem um RAC 01 a expirar em {days} dias. O HSE só descobre durante um bloqueio de portaria.',
            automation: 'Prontidão Integrada',
            automationSub: 'Sincronização Preditiva',
            automationText1: 'O Motor de Sincronização identifica a janela de {days} dias do Paulo e verifica o estado médico.',
            automationText2: 'O sistema valida a capacidade da sala e auto-reserva uma vaga de renovação.',
            automationOutcome: 'Zero Tempo de Inatividade. Paulo é treinado 48 horas ANTES do bloqueio.'
        },
        execSummary: {
            title: 'Resumo Executivo',
            text: 'O CARS v2.5 é um ecossistema digital autónomo de segurança que transforma as Requisições de Atividades Críticas (RAC 01-11) de uma gestão manual num piloto operacional preditivo. Ao fundir a telemetria de hardware IoT em tempo real com um motor de agendamento zero-touch e a inteligência IA Gemini, a plataforma garante que 100% da força de trabalho esteja clinicamente apta, certificada e fisicamente autorizada antes mesmo de chegar à zona de risco.',
            quote: 'Convertendo segurança reativa em resiliência operacional autónoma.'
        },
        objectives: {
            title: 'Objetivos Primários',
            problemTitle: 'Barreiras Atuais',
            problemText: 'Dados de empreiteiros fragmentados, rastreio manual de certificações e falta de visibilidade em tempo real sobre os níveis de conformidade.',
            solutionTitle: 'Estado Futuro',
            goals: [
                'Normalização Automática de Dados de RH e Empreiteiros',
                'Motor de Agendamento Preditivo Autónomo Zero-Touch',
                'Link IoT de Controlo de Acesso Físico e Alcoolemia',
                'Analítica de Risco e Previsão HSE Baseada em IA'
            ]
        },
        integration: {
            title: 'Ecossistema de Dados Unificado',
            staffSource: 'SuccessFactors / RH',
            staff: 'Pessoal Permanente',
            contractorSource: 'Gestor de Contratos',
            contractor: 'Vendedores Externos',
            middlewareTitle: 'Hub de Integração',
            middlewareDesc: 'Camada API Restful fundindo dados de empreiteiros e permanentes.',
            sourceTitle: 'CARS: Fonte Única de Verdade',
            noManual: 'Sem Integração Manual',
            isolation: 'Isolamento Lógico de Dados',
            liveMatrix: 'Matriz de Conformidade em Tempo Real'
        },
        organogram: {
            title: 'Estrutura do Projecto',
            tech1: 'Arquitetura e DevOps',
            tech2: 'Engenheiro de Dados Cloud'
        },
        timeline: {
            title: 'Roteiro de Implementação',
            phase1: 'Descoberta e Auditoria API',
            phase1desc: 'Auditoria das fontes de dados de RH e Empreiteiros.',
            phase2: 'Camada de Integração',
            phase2desc: 'Desenvolvimento do Middleware CARS para sincronização.',
            phase3: 'Implementação de Módulos',
            phase3desc: 'Customização da lógica de avaliação RAC 01-11.',
            phase4: 'Programa Piloto',
            phase4desc: 'Testes UAT num único site operacional.',
            phase5: 'Escala Corporativa',
            phase5desc: 'Lançamento global para todos os departamentos.'
        },
        techStack: {
            title: 'Arquitetura Moderna',
            frontendTitle: 'Experiência do Utilizador',
            frontend: 'React 19 • TypeScript • Tailwind',
            backendTitle: 'Lógica do Sistema',
            backend: 'Node.js • Cloud Functions • Supabase',
            databaseTitle: 'Persistência de Dados',
            database: 'PostgreSQL • Vector Storage (IA)',
            securityTitle: 'Controlo de Acesso',
            security: 'JWT • SSL • RLS Policy'
        },
        financials: {
            title: 'Resumo de Investimento',
            headers: { desc: 'Descrição', cost: 'Investimento' },
            items: {
                item1: 'Arquitetura Core e Desenvolvimento Inicial',
                item2: 'Configuração e Camada de Integração API',
                item3: 'Infraestrutura Cloud e SaaS Gerido',
                item4: 'Manutenção Contínua e Motor de IA'
            },
            initialInvest: 'Investimento Inicial Total',
            recurring: 'Serviços Mensais Recorrentes'
        },
        roadmap: {
            title: 'Roteiro Estratégico',
            auth: 'Link Biométrico',
            authDesc: 'Face-ID para verificação em campo.',
            db: 'IA Preditiva',
            dbDesc: 'Previsão de carga de treino.',
            email: 'SMS Automatizado',
            emailDesc: 'Notificações diretas aos alunos.',
            hosting: 'App Móvel',
            hostingDesc: 'Versão nativa iOS/Android.'
        },
        aiFeatures: {
            title: 'Inteligência de Segurança Gemini',
            chatbot: 'Conselheiro de segurança em tempo real para protocolos RAC.',
            reporting: 'Resumos executivos IA sobre riscos nos sites.'
        },
        futureUpdates: {
            title: 'Expansão V2: Acesso IoT',
            moduleA: 'Software de Controlo de Álcool',
            moduleADesc: 'Integração em tempo real de bafômetros com lógica de portaria.',
            moduleB: 'Infraestrutura Física',
            moduleBDesc: 'Instalação de catracas conectadas.'
        },
        enhancedCaps: {
            title: 'Capacidades Avançadas',
            mobileVerify: { title: 'Verificação Móvel', desc: 'Fiscais HSE podem verificar qualquer passaporte via QR code.' },
            autoBooking: { title: 'Auto-Agendamento', desc: 'Inscrição preditiva para certificações a expirar.' },
            massData: { title: 'Importação em Massa', desc: 'Preocessamento de certificados legados.' }
        },
        conclusion: {
            title: 'O Caminho em Frente',
            text: 'O CARS não é apenas uma ferramenta de treino; é uma salvaguarda operacional. Garante que apenas quem está apto, treinado e autorizado possa entrar na zona de risco.'
        },
        thankYou: {
            title: 'Obrigado',
            subtitle: 'Pronto para Implementação Operacional',
            email: 'pita.domingos@zd044.onmicrosoft.com',
            phone: '+258 84 547 9481'
        },
        waitlist: {
            title: 'Inteligência de Fila',
            subtitle: 'Gestão Proativa de Demanda',
            capacityTitle: 'Guarda de Capacidade',
            capacityDesc: 'Redirecionamento automático de pessoal excedente para uma lista de espera FIFO.',
            demandTitle: 'Notificações Admin',
            demandDesc: 'Alertas baseados em limite (ex: 5+ em espera) para agendar novas sessões.',
            outcome: 'Visibilidade Total',
            outcomeDesc: 'Nunca perca uma requisição em cadeias de e-mail.'
        },
        workflow: {
            title: 'Diagrama de Fluxo do Sistema',
            subtitle: 'Ciclo de Vida de Dados de Ponta a Ponta',
            step1: 'Submissão',
            step1sub: 'Requisição HSE',
            step1actor: 'HSE / Admin de Empreiteiro',
            step1desc: 'Requisitos de pessoal submetidos para validação.',
            step2: 'Agendamento',
            step2sub: 'Alocação e Fila',
            step2actor: 'Depto de Formação',
            step2desc: 'Alocação automática de vagas ou entrada em Fila de Espera prioritária.',
            step3: 'Avaliação',
            step3sub: 'Graduação (Aprov/Repr)',
            step3actor: 'Instrutor RAC',
            step3desc: 'Graduação pelo formador com auditoria de pontuação em tempo real (Aprov/Repr).',
            step4: 'Lógica de Acesso',
            step4sub: 'Conformidade de Matriz',
            step4actor: 'Core do Sistema',
            step4desc: 'Fusão Lógica: [Ativo] + [ASO] + [Resultado RAC] = Estado.',
            step5: 'Certificação',
            step5sub: 'Emissão de Passaporte',
            step5actor: 'Escritório HSE',
            step5desc: 'Geração de certificação e emissão de cartões digitais seguros.',
            step6: 'Verificação',
            step6sub: 'Auditoria de Campo QR',
            step6actor: 'Equipa de Segurança de Campo',
            step6desc: 'Auditoria QR instantânea verifica autorização em zonas de risco.'
        },
        aboutMe: {
            title: 'Perfil do Arquiteto do Sistema',
            name: 'Pita Domingos',
            preferred: 'Engenheiro de Software e Arquiteto de Segurança',
            bio: 'Mais de 8 anos de experiência na construção de sistemas empresariais de missão crítica. Especializado na integração de dados operacionais complexos em arquiteturas web simplificadas e de alto desempenho, priorizando a segurança do utilizador e a integridade dos dados.',
            cert: 'Arquiteto de Soluções Cloud Certificado',
            role: 'Founder e Engenheiro Chefe na DigiSols',
            portfolioTitle: 'Portfólio Corporativo',
            portfolio: {
                edudesk: 'Gestão de Ensino Superior',
                h365: 'Hub de Dados Médicos',
                swiftpos: 'OS de Retalho Cloud',
                microfin: 'Analítica de Empréstimos',
                sentinel: 'Ferramenta de Observação HSE',
                dataUnif: 'Middleware de Integração'
            },
            archPhil: 'Filosofia de Arquitetura',
            archPhilText: 'A lógica deve ser invisível. A experiência deve ser intuitiva. Os dados devem ser absolutos.'
        }
    },
    feedback: {
        title: 'Feedback do Utilizador',
        subtitle: 'Valorizamos a sua opinião',
        adminTitle: 'Comando de Feedback',
        manage: 'Gerir relatórios do sistema',
        typeLabel: 'Tipo de Feedback',
        messageLabel: 'Sua mensagem',
        msgPlaceholder: 'Descreva a sua sugestão ou problema...',
        button: 'Enviar Feedback',
        actionable: 'Acionável',
        noSelection: 'Selecione uma entrada para inspecionar',
        workflow: 'Fluxo de Trabalho',
        priority: 'Priority',
        markActionable: 'Marcar como Acionável',
        markedActionable: 'Definido como Acionável',
        submittedBy: 'Enviado por',
        internalNotes: 'Notas Internas',
        visibleAdmin: 'Visível apenas para admins',
        deleteRecord: 'Eliminar Registo',
        status: {
            New: 'Novo',
            InProgress: 'Em Progresso',
            Resolved: 'Resolvido',
            Dismissed: 'Ignorado'
        },
        types: {
            Bug: 'Erro',
            Improvement: 'Melhoria',
            General: 'Geral'
        }
    },
    trainer: {
        title: 'Entrada do Instrutor',
        loggedInAs: 'Instrutor:',
        noSessions: 'Sem sessões pendentes',
        selectSession: 'Selecionar Sessão',
        chooseSession: 'Escolha uma sessão ativa',
        saveResults: 'Confirmar Resultados'
    },
    communications: {
        title: 'Centro de Comunicação',
        subtitle: 'Logs automáticos',
        clear: 'Limpar logs',
        search: 'Pesquisar mensagens',
        empty: 'Sem mensagens registadas',
        select: 'Selecione uma mensagem para pré-visualizar',
        sms: 'Mensagem SMS',
        to: 'Para',
        automated: 'Esta é uma mensagem automática do sistema',
        gateway: 'Gateway SMS CARS',
    },
    logs: {
        title: 'Logs do Sistema',
        levels: {
            all: 'Todos os Níveis',
            info: 'INFO',
            warn: 'AVISO',
            error: 'ERRO',
            audit: 'AUDITORIA'
        },
        table: {
            level: 'Nível',
            timestamp: 'Timestamp',
            user: 'Utilizador',
            message: 'Mensagem'
        }
    },
    reports: {
        title: 'Analítica de Segurança',
        subtitle: 'Métricas de Desempenho RACS',
        generate: 'Gerar Relatório',
        analyzing: 'Analisando...',
        executiveAnalysis: 'Resumo Executivo IA',
        stats: {
            totalTrained: 'Total de Pessoal',
            passRate: 'Taxa de Sucesso',
            attendance: 'Assiduidade',
            noShows: 'Faltas'
        },
        filters: {
            period: 'Período',
            department: 'Departamento',
            racType: 'Módulo RAC',
            startDate: 'Data Início',
            endDate: 'End Date'
        },
        periods: {
            weekly: 'Semanal',
            monthly: 'Mensal',
            ytd: 'Ano até à data',
            custom: 'Intervalo Personalizado'
        },
        charts: {
            performance: 'Sucesso de Formação',
            distributionTitle: 'Distribuição de Conformidade',
            distributionSubtitle: 'Rácio Aprovado/Reprovado',
            aiSubtitle: 'Inteligência de Segurança Contextual',
            breakdownTitle: 'Resultados de avaliação por módulo'
        },
        leaderboard: 'Desempenho de Formadores',
        printReport: 'Imprimir Estatísticas',
        trainerMetrics: {
            students: 'Alunos',
            avgTheory: 'Média Teoria'
        },
        noShowsTitle: 'Ausências Não Autorizadas'
    },
    racDefs: {
        RAC01: 'RAC 01 - Trabalho em Altura',
        RAC02: 'RAC 02 - Veículos e Equipamentos',
        RAC03: 'RAC 03 - Isolamento de Energia',
        RAC04: 'RAC 04 - Proteção de Máquinas',
        RAC05: 'RAC 05 - Espaços Confinados',
        RAC06: 'RAC 06 - Operações de Içamento',
        RAC07: 'RAC 07 - Estabilidade de Solo',
        RAC08: 'RAC 08 - Segurança Elétrica',
        RAC09: 'RAC 09 - Controlo de Explosivos',
        RAC10: 'RAC 10 - Metal Fundido',
        RAC11: 'RAC 11 - Regras de Trânsito',
        PTS: 'PTS - Permissão de Trabalho',
        ART: 'ART - Análise de Risco'
    },
    ai: {
        systemPromptAdvice: "É um Especialista em Segurança. Forneça conselhos claros sobre {rac} em {language}.",
        systemPromptReport: "Analise as seguintes estatísticas de segurança e forneça um resumo executivo em {language}."
    }
  }
};