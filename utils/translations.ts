
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
      sending: 'Sending...',
      passed: 'Passed',
      failed: 'Failed',
      pending: 'Pending',
      complianceRate: 'Compliance Rate',
      testsProcessed: 'Tests Processed',
      stats: {
          totalUsers: 'Total Users',
          active: 'Active',
          admins: 'Admins',
          totalRecords: 'Total Records',
          passRate: 'Pass Rate',
          avgScore: 'Avg Score',
          certifications: 'Certifications'
      }
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
        PTS: 'PTS - Safe Work Permit',
        ART: 'ART - Task Risk Analysis',
        LIB_OPS: 'LIB-OPS - Operational Release',
        LIB_MOV: 'LIB-MOV - Movement Release'
    },
    communications: {
        title: 'Communication Center',
        subtitle: 'Real-time log of automated system notifications (SMS & Email).',
        clear: 'Clear Log',
        search: 'Search logs...',
        empty: 'No messages found.',
        select: 'Select a message to view details',
        sms: 'Text Message',
        email: 'Email',
        gateway: 'Sent via Gateway',
        automated: 'This is an automated notification. Please do not reply.',
        to: 'To'
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
        markedActionable: 'Marked as Actionable',
        internalNotes: 'Internal Notes',
        visibleAdmin: 'Notes are only visible to system administrators.',
        deleteRecord: 'Delete Record',
        noSelection: 'No Feedback Selected',
        selectPrompt: 'Select an item from the list to view details.',
        priority: 'Priority Action',
        workflow: 'Workflow Status',
        manage: 'Manage user reports and suggestions',
        submittedBy: 'Submitted User'
    },
    alcohol: {
        dashboard: {
            title: 'Alcohol Control',
            subtitle: 'Real-time monitoring.',
            live: 'Live Feed',
            backToLive: 'Back to Live',
            specs: 'Module Specs',
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
            close: 'Close Alert',
            hourlyTrend: 'Hourly Activity Trend',
            dailyTrend: 'Daily Trend',
            deviceLoad: 'Device Load',
            complianceRatio: 'Compliance Ratio',
            deviceHealth: 'Device Health',
            liveStream: 'Live Stream'
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
        riskHeatmap: 'Department Risk Heatmap',
        trainerLeaderboard: 'Trainer Leaderboard',
        noData: 'No Data',
        systemTitle: 'System Command Center',
        systemSubtitle: 'Multi-Tenant Platform Compliance Overview',
        tenantMatrix: 'Tenant Performance Matrix',
        systemView: 'SYSTEM VIEW',
        aiAuditor: 'System AI Auditor',
        aiDirector: 'Executive AI Director',
        systemIntelligence: 'Platform-wide safety intelligence',
        companyIntelligence: 'Strategic insights for',
        bottlenecks: 'Training Bottlenecks',
        failure: 'Failure',
        selectPrompt: 'Select "All Sites" to view comparison',
        aiPrompt: 'Click generate to receive',
        aiPromptSystem: 'multi-tenant safety diagnostics.',
        aiPromptEnterprise: 'enterprise-level safety intelligence.'
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
      selfServiceTitle: 'Self-Service Booking',
      secureMode: 'Full Schedule Access (Secure Mode)',
      selfServiceDesc: 'View only trainings mapped to you.',
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
    results: { 
        title: 'Training Records', 
        myRecords: 'My Training Records',
        myRecordsDesc: 'View your personal training history and certification status.',
        adminDesc: 'High-definition view of all training records.',
        export: 'Export Records',
        passport: 'My Digital Passport',
        subtitle: 'View results.', 
        searchPlaceholder: 'Search...', 
        table: { employee: 'Employee', session: 'Session', date: 'Date', trainer: 'Trainer', room: 'Room', dlRac02: 'DL (RAC 02)', theory: 'Theory', prac: 'Practical', status: 'Status', expiry: 'Expiry' } 
    },
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
    reports: { 
        title: 'Reports', 
        subtitle: 'Analytics.', 
        printReport: 'Print', 
        filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start Date', endDate: 'End Date' }, 
        periods: { weekly: 'Weekly', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, 
        generate: 'Generate AI', 
        analyzing: 'Analyzing...', 
        stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, 
        charts: { 
            performance: 'Performance',
            breakdownTitle: 'Pass vs Fail count per Module',
            distributionTitle: 'Outcome Distribution',
            distributionSubtitle: 'Visual breakdown of results',
            aiSubtitle: 'AI-Powered Insights based on filtered data'
        }, 
        executiveAnalysis: 'Executive AI Analysis', 
        leaderboard: 'Trainer Leaderboard',
        noShowsTitle: 'Recorded Absences (No-Shows)',
        trainerMetrics: { 
            title: 'Trainer Metrics', 
            name: 'Trainer', 
            sessions: 'Sessions', 
            passRate: 'Pass Rate', 
            avgTheory: 'Avg Theory', 
            avgPrac: 'Avg Practical',
            students: 'Students'
        } 
    },
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
    common: {
      ...enTranslations.common,
      vulcan: 'Gestor de RACS',
      safetySystem: 'Sistema de Gestão de Segurança',
      role: 'Função',
      activeSession: 'Sessão Ativa',
      notifications: 'Notificações',
      clearAll: 'Limpar Tudo',
      noNotifications: 'Sem novas notificações',
      viewProposal: 'Ver Proposta',
      simulateRole: 'Simular Função',
      superuser: 'Acesso de Superusuário',
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
      siteContext: 'Contexto do Site',
      enterpriseView: 'Visão Corporativa (Todos Sites)',
      completed: 'Concluído',
      timeLeft: 'restantes',
      recordsFound: 'registros encontrados',
      operationalMatrix: 'Matriz Operacional',
      owner: 'Dono',
      smsBlast: 'Envio de SMS',
      sending: 'Enviando...',
      passed: 'Aprovado',
      failed: 'Reprovado',
      pending: 'Pendente',
      complianceRate: 'Taxa de Conformidade',
      testsProcessed: 'Testes Processados',
      stats: {
          totalUsers: 'Total de Usuários',
          active: 'Ativo',
          admins: 'Admins',
          totalRecords: 'Total de Registros',
          passRate: 'Taxa de Aprovação',
          avgScore: 'Nota Média',
          certifications: 'Certificações'
      }
    },
    racDefs: {
        RAC01: 'RAC 01 - Trabalhos em Altura',
        RAC02: 'RAC 02 - Veículos e Equipamentos Móveis',
        RAC03: 'RAC 03 - Bloqueio de Equipamentos Móveis',
        RAC04: 'RAC 04 - Proteção de Máquinas',
        RAC05: 'RAC 05 - Espaço Confinado',
        RAC06: 'RAC 06 - Operações de Elevação',
        RAC07: 'RAC 07 - Estabilidade de Terreno',
        RAC08: 'RAC 08 - Eletricidade',
        RAC09: 'RAC 09 - Explosivos',
        RAC10: 'RAC 10 - Metal Líquido',
        RAC11: 'RAC 11 - Tráfego na Mina',
        PTS: 'PTS - Permissão de Trabalho Seguro',
        ART: 'ART - Análise de Risco da Tarefa',
        LIB_OPS: 'LIB-OPS - Liberação Operacional',
        LIB_MOV: 'LIB-MOV - Liberação de Movimentação'
    },
    communications: {
        title: 'Centro de Comunicações',
        subtitle: 'Log em tempo real de notificações automatizadas (SMS e Email).',
        clear: 'Limpar Log',
        search: 'Pesquisar logs...',
        empty: 'Nenhuma mensagem encontrada.',
        select: 'Selecione uma mensagem para ver detalhes',
        sms: 'Mensagem de Texto',
        email: 'Email',
        gateway: 'Enviado via Gateway',
        automated: 'Esta é uma notificação automática. Por favor, não responda.',
        to: 'Para'
    },
    feedback: {
        ...enTranslations.feedback,
        button: 'Enviar Feedback',
        title: 'Compartilhe sua Experiência',
        subtitle: 'Ajude-nos a melhorar o Gestor de RACS.',
        typeLabel: 'Tipo de Feedback',
        messageLabel: 'Sua Mensagem',
        msgPlaceholder: 'Descreva o erro, melhoria ou experiência...',
        success: 'Obrigado! Seu feedback foi registrado.',
        adminTitle: 'Logs de Feedback do Usuário',
        adminSubtitle: 'Rastreie problemas e sugestões reportados por usuários.',
        types: {
            Bug: 'Relatório de Erro',
            Improvement: 'Melhoria',
            General: 'Comentário Geral'
        },
        status: {
            New: 'Novo',
            InProgress: 'Em Andamento',
            Resolved: 'Resolvido',
            Dismissed: 'Ignorado'
        },
        actionable: 'Acionável',
        notActionable: 'Não Acionável',
        markActionable: 'Marcar como Acionável',
        markedActionable: 'Marcado como Acionável',
        markNotActionable: 'Marcar como Não Acionável',
        internalNotes: 'Notas Internas',
        visibleAdmin: 'Notas visíveis apenas para administradores do sistema.',
        deleteRecord: 'Excluir Registro',
        noSelection: 'Nenhum Feedback Selecionado',
        selectPrompt: 'Selecione um item da lista para ver detalhes.',
        priority: 'Ação Prioritária',
        workflow: 'Status do Fluxo',
        manage: 'Gerenciar relatórios e sugestões de usuários',
        submittedBy: 'Usuário Remetente'
    },
    verification: {
      ...enTranslations.verification,
      title: 'Passaporte de Segurança Digital',
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
        adherence: 'Adesão SMS',
        certifications: 'Total Certificações',
        pending: 'Pendentes Avaliação',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade por RAC e ASO',
        complianceSubtitle: 'Mostra status obrigatório. Verde = Válido. Vermelho = Ausente/Expirado.',
        accessTitle: 'Status de Acesso da Força de Trabalho',
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
        session: 'Info Sessão'
      },
      booked: {
        title: 'Funcionários Agendados',
        tableEmployee: 'Funcionário / Empresa',
        tableRac: 'RAC Agendado',
        tableDate: 'Data',
        tableRoom: 'Sala',
        tableTrainer: 'Formador',
        noData: 'Nenhum agendamento encontrado'
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
    enterprise: {
        ...enTranslations.enterprise,
        title: 'Centro de Comando Corporativo',
        subtitle: 'Visão Geral da Conformidade de Segurança Global',
        globalHealth: 'Pontuação Global de Saúde',
        totalWorkforce: 'Força de Trabalho Total',
        topPerformer: 'Melhor Desempenho',
        needsAttention: 'Precisa de Atenção',
        siteComparison: 'Comparação de Desempenho do Site',
        operationsOverview: 'Visão Geral das Operações',
        siteName: 'Nome do Site',
        staff: 'Equipe',
        governanceTitle: 'Governança do Site',
        governanceSubtitle: 'Defina políticas de treinamento de segurança obrigatórias por local.',
        pushPolicy: 'Salvar e Aplicar Política',
        policyApplied: 'Política Aplicada',
        riskHeatmap: 'Mapa de Risco por Departamento',
        trainerLeaderboard: 'Classificação de Formadores',
        noData: 'Sem Dados',
        systemTitle: 'Centro de Comando do Sistema',
        systemSubtitle: 'Visão Geral da Conformidade da Plataforma Multi-Inquilino',
        tenantMatrix: 'Matriz de Desempenho de Inquilinos',
        systemView: 'VISÃO DO SISTEMA',
        aiAuditor: 'Auditor IA do Sistema',
        aiDirector: 'Diretor Executivo de IA',
        systemIntelligence: 'Inteligência de segurança em toda a plataforma',
        companyIntelligence: 'Insights estratégicos para',
        bottlenecks: 'Gargalos de Treinamento',
        failure: 'Reprovação',
        selectPrompt: 'Selecione "Todos os Sites" para ver a comparação',
        aiPrompt: 'Clique em gerar para receber',
        aiPromptSystem: 'diagnósticos de segurança multi-inquilino.',
        aiPromptEnterprise: 'inteligência de segurança de nível empresarial.'
    },
    database: {
        ...enTranslations.database,
        title: 'Base de Dados Mestre de Funcionários',
        subtitle: 'Gerencie requisitos. RAC 02 é desativado automaticamente se a Carta estiver expirada.',
        filters: 'Filtros',
        accessStatus: 'Status de Acesso',
        granted: 'Concedido',
        blocked: 'Bloqueado',
        employeeInfo: 'Info Funcionário e Carta',
        aso: 'ASO (Médico)',
        license: 'Carta',
        class: 'Classe',
        number: 'Número',
        expired: 'EXP',
        active: 'Ativo',
        importCsv: 'Importar CSV',
        downloadTemplate: 'Modelo CSV',
        opsMatrix: 'Matriz Operacional',
        massQr: 'QRs em Massa',
        zipping: 'Compactando...',
        wizard: 'Assistente de Importação',
        exportDb: 'Exportar BD',
        editModal: 'Editar Funcionário',
        contactInfo: 'Info de Contato',
        cell: 'Celular',
        dlDetails: 'Detalhes da Carta de Condução',
        mappingTitle: 'Mapeamento de Colunas de Importação',
        mappingSubtitle: 'Mapeie colunas CSV para campos do sistema.',
        preview: 'Pré-visualização do Arquivo',
        coreData: 'Dados Principais do Funcionário',
        complianceTrain: 'Licença, Médico e Treinamento',
        sourceCol: 'Coluna de Origem',
        processImport: 'Processar Importação',
        cardBack: 'Pré-visualização do Verso do Cartão',
        confirmDeactivate: 'Desativar Funcionário?',
        confirmDeactivateMsg: 'Marcar como Inativo ocultará este funcionário das pesquisas. Continuar?',
        confirmDelete: 'Excluir Registro?',
        confirmDeleteMsg: 'Isso removerá permanentemente o funcionário e todos os registros de treinamento. Isso não pode ser desfeito.',
        importSuccess: 'Importação Bem-sucedida',
        bulkQrMessage: 'Isso gerará e baixará {count} códigos QR. Isso pode demorar um pouco.'
    },
    booking: {
        ...enTranslations.booking,
        title: 'Agendar Sessão de Treinamento',
        selfServiceTitle: 'Auto-Agendamento',
        secureMode: 'Acesso Total à Agenda (Modo Seguro)',
        selfServiceDesc: 'Veja apenas os treinamentos mapeados para você.',
        manageSchedule: 'Gerenciar Agenda',
        dlRequired: 'Detalhes da Carta de Condução obrigatórios para RAC 02',
        success: 'Agendamento enviado com sucesso!',
        selectSession: 'Selecionar Sessão de Treinamento',
        chooseSession: 'Escolha uma sessão...',
        table: {
            no: 'Nº',
            nameId: 'Nome / ID',
            details: 'Empresa / Dept',
            dlNoClass: 'Nº Carta / Classe',
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
        autoBookFailMsg: 'Não foi possível auto-agendar {name} para {rac}. Nenhuma sessão disponível.',
        capacityTitle: 'Sessão Cheia - Realocação Automática',
        capacityMsg: 'funcionários foram movidos para a próxima sessão disponível em',
        demandTitle: 'Alerta de Alta Demanda',
        demandMsg: 'Alta demanda detectada para',
        duplicateTitle: 'Agendamento Duplicado',
        duplicateMsg: 'Usuário já agendado para este tipo de treinamento.'
    },
    ai: {
        systemPromptAdvice: "Você é um Consultor de Segurança especialista para a Vulcan Mining. Você se especializa nas Regras Críticas de Segurança (RACs). Responda à pergunta do usuário sobre {rac}. Forneça conselhos concisos e acionáveis. Mantenha menos de 100 palavras. Idioma: {language}.",
        systemPromptReport: "Você é um Analista de Dados de HSE. Analise as seguintes estatísticas de treinamento para o período {language}. Destaque as principais tendências, riscos e recomendações. Mantenha executivo e conciso."
    },
    advisor: { 
        button: 'Consultor de Segurança', 
        title: 'Consultor IA de Segurança CARS', 
        sender: 'Consultor CARS', 
        emptyState: 'Como posso ajudar?', 
        placeholder: 'Pergunte sobre padrões RAC...' 
    },
    results: { 
        title: 'Histórico de Treinamento', 
        myRecords: 'Meus Treinamentos',
        myRecordsDesc: 'Veja seu histórico pessoal e status das certificações.',
        adminDesc: 'Visão detalhada de todos os registros de treinamento.',
        export: 'Exportar Registros',
        passport: 'Meu Passaporte Digital',
        subtitle: 'Resultados e certificados.', 
        searchPlaceholder: 'Pesquisar...', 
        table: { employee: 'Funcionário', session: 'Sessão', date: 'Data', trainer: 'Formador', room: 'Sala', dlRac02: 'Carta (RAC 02)', theory: 'Teoria', prac: 'Prática', status: 'Status', expiry: 'Validade' } 
    },
    cards: { 
        title: 'Cartões de Segurança', 
        showing: 'Mostrando', 
        subtitle: 'Selecione funcionários.', 
        goToPrint: 'Ir para Impressão', 
        selected: 'Selecionado', 
        successTitle: 'Solicitação Enviada', 
        successMsg: 'Solicitação de cartão encaminhada.', 
        noRecords: 'Sem Registros Elegíveis', 
        noRecordsSub: 'Apenas registros aprovados aparecem aqui.', 
        selectAll: 'Selecionar Tudo', 
        sending: 'Enviando...', 
        requestButton: 'Solicitar Cartões', 
        validation: { ineligible: 'Funcionário inelegível.', maxSelection: 'Máx 8 cartões.', incomplete: 'Incompleto' },
        eligibility: {
            failedTitle: 'Verificação de Elegibilidade Falhou',
            failedMsg: 'Você não atende aos requisitos para um cartão de segurança. Verifique se o ASO é válido e se passou em todos os treinamentos obrigatórios.',
            checkReqs: 'Verificar Requisitos'
        }
    },
    trainer: { 
        title: 'Entrada do Formador', 
        subtitle: 'Inserir notas.', 
        passMark: 'Aprovação: 70%', 
        loggedInAs: 'Logado como', 
        selectSession: 'Selecionar Sessão', 
        noSessions: 'Sem sessões.', 
        chooseSession: 'Escolha uma sessão...', 
        dlWarning: 'Verificar Carta para RAC 02.', 
        saveResults: 'Salvar Resultados', 
        table: { employee: 'Funcionário', attendance: 'Presente', dlCheck: 'Verif. Carta', verified: 'Verificado', theory: 'Teoria', practical: 'Prática', rac02Only: '(RAC 02)', status: 'Status' } 
    },
    users: { 
        title: 'Gestão de Usuários', 
        subtitle: 'Gerenciar acesso.', 
        addUser: 'Adic. Usuário', 
        table: { user: 'Usuário', role: 'Função', status: 'Status', actions: 'Ações' }, 
        modal: { title: 'Adic. Usuário', name: 'Nome', email: 'Email', createUser: 'Criar' } 
    },
    schedule: { 
        title: 'Cronograma de Treinamento', 
        subtitle: 'Gerenciar sessões.', 
        newSession: 'Nova Sessão', 
        table: { date: 'Data/Hora', rac: 'RAC', room: 'Local', trainer: 'Instrutor' }, 
        modal: { title: 'Agendar', racType: 'RAC', date: 'Data', startTime: 'Início', location: 'Local', capacity: 'Cap', instructor: 'Instr', saveSession: 'Salvar', language: 'Idioma', english: 'Inglês', portuguese: 'Português' } 
    },
    settings: { 
        title: 'Configurações', 
        subtitle: 'Config.', 
        saveAll: 'Salvar Tudo', 
        saving: 'Salvando...', 
        globalConfig: 'Configuração Global do Sistema & Fonte da Verdade',
        localConfig: 'Configurações Operacionais Locais',
        feedbackConfig: 'Config. de Feedback',
        integration: 'Integração de Dados',
        tabs: { general: 'Geral', trainers: 'Formadores', racs: 'RACs', sites: 'Sites', companies: 'Empresas', integration: 'Integração' }, 
        rooms: { title: 'Salas', name: 'Nome', capacity: 'Cap', new: 'Nova Sala' }, 
        trainers: { title: 'Formadores', name: 'Nome', qualifiedRacs: 'RACs', new: 'Novo Formador' }, 
        racs: { title: 'RACs', code: 'Código', description: 'Desc', new: 'Novo RAC' },
        integrationPage: {
            title: 'Integração de Dados (Simulação)',
            middleware: 'Motor Middleware CARS',
            syncNow: 'Sincronizar Agora',
            processing: 'Processando...',
            waiting: 'Aguardando gatilho...',
            sourceA: 'Fonte A: BD RH',
            sourceB: 'Fonte B: BD Empreiteiras',
            logs: 'Logs de Sincronização'
        }
    },
    reports: { 
        title: 'Relatórios', 
        subtitle: 'Análises.', 
        printReport: 'Imprimir', 
        filters: { period: 'Período', department: 'Dept', racType: 'RAC', startDate: 'Data Início', endDate: 'Data Fim' }, 
        periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Anual (YTD)', custom: 'Personalizado' }, 
        generate: 'Gerar IA', 
        analyzing: 'Analisando...', 
        stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Faltas' }, 
        charts: { 
            performance: 'Desempenho',
            breakdownTitle: 'Aprovados vs Reprovados por Módulo',
            distributionTitle: 'Distribuição de Resultados',
            distributionSubtitle: 'Detalhamento visual dos resultados',
            aiSubtitle: 'Insights de IA baseados em dados filtrados'
        }, 
        executiveAnalysis: 'Análise Executiva IA', 
        leaderboard: 'Classificação de Formadores',
        noShowsTitle: 'Ausências Registradas (Faltas)',
        trainerMetrics: { 
            title: 'Métricas do Formador', 
            name: 'Formador', 
            sessions: 'Sessões', 
            passRate: 'Taxa Aprov.', 
            avgTheory: 'Média Teoria', 
            avgPrac: 'Média Prática',
            students: 'Alunos'
        } 
    },
    logs: { 
        title: 'Logs do Sistema', 
        levels: { all: 'Todos Níveis', info: 'Info', warn: 'Aviso', error: 'Erro', audit: 'Auditoria' }, 
        table: { level: 'Nível', timestamp: 'Carimbo de Data/Hora', user: 'Usuário', message: 'Mensagem' } 
    },
    adminManual: {
        title: 'Manual do Administrador do Sistema',
        subtitle: 'Guia completo para manutenção do Ecossistema CARS Manager.',
        slides: {
            intro: 'Introdução',
            logic: '1. Visão Geral da Lógica do Sistema',
            dashboard: '2. Navegação no Painel',
            workflows: '3. Fluxos de Trabalho Principais',
            advanced: '4. Configurações Avançadas',
            troubleshoot: '5. Troubleshooting Guide',
            architecture: '6. Arquitetura do Sistema'
        },
        content: {
            confidential: 'CONFIDENCIAL',
            production: 'PRODUÇÃO',
            logic: {
                title: 'Lógica do Sistema: O Semáforo',
                desc: 'O CARS Manager é um Motor Lógico. A conformidade é calculada dinamicamente com base em três pilares principais.',
                active: 'Usuário Ativo?',
                aso: 'ASO Válido? (Médico)',
                racs: 'RACs Válidos? (Treinamento)',
                result: 'ACESSO CONCEDIDO'
            },
            dashboard: {
                operational: {
                    title: 'Painel Operacional',
                    kpi: 'Cartões KPI: Contagens em tempo real para Certificações, Pendentes e Expirando.',
                    renewal: 'Widget de Renovação: Alerta para expiração < 30 dias. "Agendar Renovações" carrega automaticamente o assistente.',
                    auto: 'Auto-Agendamento: Aprovações para agendamentos gerados pelo sistema (expiração < 7 dias).'
                },
                enterprise: {
                    title: 'Painel Corporativo',
                    global: 'Pontuação Global de Saúde: % de conformidade agregada.',
                    risk: 'Mapa de Calor de Risco: Departamentos com baixa conformidade.',
                    ai: 'Análise IA: Gera resumo de texto executivo.'
                }
            },
            workflows: {
                a: {
                    title: 'A. Integração & Matriz',
                    steps: [
                        'Vá para Base de Dados -> Assistente de Importação (CSV).',
                        'Definir Matriz: Alterne as colunas RAC para Verde (Obrigatório).',
                        'Resultado: Funcionário bloqueado até que o RAC específico seja aprovado.'
                    ]
                },
                b: {
                    title: 'B. Agendamento & Marcação',
                    steps: [
                        'Cronograma -> Criar Sessão.',
                        'Agendar Treinamento -> Selecionar Sessão -> Adicionar Funcionários.',
                        'Capacidade Inteligente: Excesso auto-roteado para próxima sessão ou Lista de Espera.'
                    ]
                },
                c: {
                    title: 'C. Avaliação (Entrada do Formador)',
                    steps: [
                        'Selecionar Sessão -> Marcar Presença.',
                        'Inserir Pontuações (Teoria < 70% = Reprovado).',
                        'Regra RAC 02: Caixa de seleção "Carta Verificada" é obrigatória.'
                    ]
                },
                d: {
                    title: 'D. Emissão de Cartões',
                    steps: [
                        'Solicitar Cartões -> Filtrar Funcionários Conformes.',
                        'Impressão em Lote (8 por página).',
                        'Verso do Cartão: Imprimir da Base de Dados (QR).'
                    ]
                }
            },
            advanced: {
                gov: {
                    title: 'Governança de Site',
                    desc: 'Defina RACs obrigatórios por local. "Aplicar Política" atualiza todos os funcionários do site instantaneamente.'
                },
                alcohol: {
                    title: 'Controle de Álcool (IoT)',
                    desc: 'Fluxo MQTT em tempo real. Teste positivo aciona bloqueio imediato e alerta.'
                }
            },
            troubleshoot: {
                t1: { issue: 'Acesso Negado mas Treinado', solution: 'Verifique a Data do ASO. Exame médico vencido bloqueia o acesso mesmo com treinamento válido.' },
                t2: { issue: 'Não é possível agendar funcionário', solution: 'Verifique a Matriz na Base de Dados. O treinamento deve estar marcado como "Obrigatório".' },
                t3: { issue: 'RAC 02 Reprovado Automaticamente', solution: 'Carta de Condução expirada na base de dados. Atualize as informações da Carta.' },
                t4: { issue: 'Código QR "Não Encontrado"', solution: 'Incompatibilidade de ID de Registro. Garanta o caso exato (VUL-101).' },
                t5: { issue: 'Sistema Lento', solution: 'Verifique os Logs. Aguarde a conclusão da sincronização do Middleware.' }
            },
            architecture: {
                ui: '[ INTERFACE DO USUÁRIO ]',
                gate: '[ PORTAL DE PERMISSÃO ]',
                gateDesc: 'Verifica Função (Admin vs Usuário)',
                logic: '[ MOTOR LÓGICO ]',
                checkCap: 'Verificar Capacidade',
                checkMatrix: 'Verificar Matriz',
                checkDl: 'Verificar Validade Carta',
                dbState: '[ ESTADO DA BASE DE DADOS ]',
                updateRecord: 'Atualiza Registro de Agendamento',
                automation: '[ AUTOMAÇÃO ]',
                emailTrig: '📧 Gatilho Email/SMS',
                printTrig: '🖨️ Auto-Impressão',
                aiTrig: '🤖 Atualização Análise IA'
            }
        }
    },
    proposal: {
        digitalTrans: 'Transformação Digital',
        aboutMe: {
            title: 'Sobre o Arquiteto',
            name: 'Pita Domingos',
            preferred: 'Nome Preferido',
            cert: 'Desenvolvedor Full Stack',
            role: 'Arquiteto Líder',
            bio: 'Desenvolvedor experiente especializado em sistemas de gestão de segurança.'
        },
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
        },
        organogram: {
            title: 'Estrutura do Projeto',
            tech1: 'Frontend',
            tech2: 'Backend'
        },
        timeline: {
            title: 'Cronograma do Projeto',
            phase1: 'Fase 1',
            phase1desc: 'Levantamento de Requisitos',
            phase2: 'Fase 2',
            phase2desc: 'Design e Prototipagem',
            phase3: 'Fase 3',
            phase3desc: 'Desenvolvimento',
            phase4: 'Fase 4',
            phase4desc: 'Testes e QA',
            phase5: 'Fase 5',
            phase5desc: 'Implantação'
        },
        techStack: {
            title: 'Stack Tecnológico',
            frontendTitle: 'Frontend',
            frontend: 'React, TypeScript, Tailwind',
            backendTitle: 'Backend',
            backend: 'Node.js, Express',
            databaseTitle: 'Base de Dados',
            database: 'PostgreSQL',
            securityTitle: 'Segurança',
            security: 'OAuth2, JWT'
        },
        financials: {
            title: 'Proposta Financeira',
            items: [
                { name: 'Arquitetura e Desenvolvimento de Software', type: 'Pagamento Único', cost: '$20,000.00' },
                { name: 'Design UI/UX e Prototipagem', type: 'Pagamento Único', cost: '$8,000.00' },
                { name: 'Configuração de Estrutura Cloud e Assinatura', type: 'Mensal', cost: '$5,000.00' },
                { name: 'Treinamento e Documentação', type: 'Pagamento Único', cost: '$10,000.00' },
                { name: 'Taxa de Manutenção e Gestão', type: 'Mensal', cost: '$15,000.00' }
            ]
        },
        roadmap: {
            title: 'Roteiro do Produto',
            auth: 'Autenticação',
            authDesc: 'Integração SSO',
            db: 'Base de Dados',
            dbDesc: 'Migração para Cloud',
            email: 'Notificações',
            emailDesc: 'Email e SMS',
            hosting: 'Hospedagem',
            hostingDesc: 'Implantação Cloud'
        },
        aiFeatures: {
            title: 'Capacidades de IA',
            chatbot: 'Chatbot Consultor de Segurança',
            reporting: 'Insights Automatizados'
        },
        futureUpdates: {
            title: 'Módulos Futuros',
            moduleA: 'Módulo A - Gestão de Riscos',
            moduleB: 'Módulo B - Relatório de Incidentes'
        },
        enhancedCaps: {
            title: 'Capacidades Aprimoradas',
            mobileVerify: { desc: 'App Móvel para verificação em campo.' },
            autoBooking: { desc: 'Agendamento automatizado para renovações.' },
            massData: { desc: 'Ferramentas de importação e exportação em massa.' }
        },
        conclusion: {
            title: 'Conclusão',
            text: 'O Gestor de RACS é o futuro da conformidade de segurança.'
        },
        thankYou: {
            title: 'Obrigado',
            contact: 'contacto@exemplo.com',
            phone: '+258 84 123 4567'
        }
    },
    manuals: {
        title: 'Manuais do Usuário',
        subtitle: 'Guias para todas as funções.',
        sysAdmin: {
            title: 'Administrador do Sistema',
            subtitle: 'Controle total do sistema.',
            configTitle: 'Configuração',
            configDesc: 'Gerenciar configurações do sistema.',
            rooms: 'Gerenciar Salas',
            trainers: 'Gerenciar Formadores',
            racs: 'Gerenciar RACs',
            dbTitle: 'Gestão de Base de Dados',
            dbDesc: 'Manter registros de funcionários.',
            restrictionWarning: 'Garanta as permissões corretas.',
            csv: 'Suporta Importação CSV.',
            active: 'Gestão de Status Ativo'
        },
        racAdmin: {
            title: 'Administrador RAC',
            subtitle: 'Gerenciar cronogramas de treinamento.',
            schedTitle: 'Agendamento',
            schedDesc: 'Criar e gerenciar sessões.',
            create: 'Criar Sessão',
            lang: 'Selecionar Idioma',
            autoTitle: 'Auto-Agendamento',
            autoDesc: 'Lidar com agendamentos automatizados.',
            approve: 'Aprovar agendamentos pendentes.',
            renewTitle: 'Renovações',
            renewDesc: 'Processar renovações.'
        },
        racTrainer: {
            title: 'Formador RAC',
            subtitle: 'Avaliação e presença.',
            inputTitle: 'Inserir Resultados',
            inputDesc: 'Inserir notas e presença.',
            grading: 'Processo de Avaliação',
            rac02: 'Requisitos RAC 02',
            save: 'Salvar Resultados'
        },
        deptAdmin: {
            title: 'Admin de Dept.',
            subtitle: 'Ver e solicitar cartões.',
            reqTitle: 'Solicitar Cartões',
            reqDesc: 'Solicitar cartões de segurança.',
            search: 'Pesquisar Funcionários',
            print: 'Imprimir Cartões',
            repTitle: 'Relatórios',
            repDesc: 'Ver relatórios de departamento.'
        },
        user: {
            title: 'Usuário Geral',
            subtitle: 'Ver status pessoal.',
            statusTitle: 'Meu Status',
            statusDesc: 'Verifique seu status de conformidade.',
            filterAlert: 'Certifique-se de que os filtros estão limpos.',
            green: 'Conforme',
            red: 'Não Conforme',
            qr: 'Código QR Digital'
        }
    }
  }
};
