
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
      of: 'of'
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
    advisor: { button: 'Safety Advisor', title: 'CARS AI Safety Advisor', sender: 'CARS Advisor', emptyState: 'How can I assist?', placeholder: 'Ask about RAC standards...' },
    results: { title: 'Training Records', subtitle: 'View results.', searchPlaceholder: 'Search...', table: { employee: 'Employee', session: 'Session', date: 'Date', trainer: 'Trainer', room: 'Room', dlRac02: 'DL (RAC 02)', theory: 'Theory', prac: 'Practical', status: 'Status', expiry: 'Expiry' } },
    cards: { title: 'Safety Cards', showing: 'Showing', subtitle: 'Select employees.', goToPrint: 'Go to Print View', selected: 'Selected', successTitle: 'Request Sent', successMsg: 'Card request forwarded.', noRecords: 'No Eligible Records', noRecordsSub: 'Only passed records appear here.', selectAll: 'Select All', sending: 'Sending...', requestButton: 'Request Cards', validation: { ineligible: 'Ineligible employee.', maxSelection: 'Max 8 cards.', incomplete: 'Incomplete' } },
    trainer: { title: 'Trainer Input', subtitle: 'Enter grades.', passMark: 'Pass: 70%', loggedInAs: 'Logged in as', selectSession: 'Select Session', noSessions: 'No sessions.', chooseSession: 'Choose session...', dlWarning: 'Verify DL for RAC 02.', saveResults: 'Save Results', table: { employee: 'Employee', attendance: 'Attended', dlCheck: 'DL Check', verified: 'Verified', theory: 'Theory', practical: 'Practical', rac02Only: '(RAC 02)', status: 'Status' } },
    users: { title: 'User Management', subtitle: 'Manage access.', addUser: 'Add User', table: { user: 'User', role: 'Role', status: 'Status', actions: 'Actions' }, modal: { title: 'Add User', name: 'Name', email: 'Email', createUser: 'Create' } },
    schedule: { title: 'Training Schedule', subtitle: 'Manage sessions.', newSession: 'New Session', table: { date: 'Date/Time', rac: 'RAC', room: 'Location', trainer: 'Instructor' }, modal: { title: 'Schedule', racType: 'RAC', date: 'Date', startTime: 'Start', location: 'Loc', capacity: 'Cap', instructor: 'Instr', saveSession: 'Save', language: 'Language', english: 'English', portuguese: 'Portuguese' } },
    settings: { title: 'Settings', subtitle: 'Config.', saveAll: 'Save', saving: 'Saving...', tabs: { general: 'General', trainers: 'Trainers', racs: 'RACs' }, rooms: { title: 'Rooms', name: 'Name', capacity: 'Cap', new: 'New Room' }, trainers: { title: 'Trainers', name: 'Name', qualifiedRacs: 'RACs', new: 'New Trainer' }, racs: { title: 'RACs', code: 'Code', description: 'Desc', new: 'New RAC' } },
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start', endDate: 'End' }, periods: { weekly: 'Weekly', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, generate: 'Generate AI', analyzing: 'Analyzing...', stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, charts: { performance: 'Performance' }, executiveAnalysis: 'Executive AI Analysis', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prac' } },
    adminManual: {
        title: 'System Admin Manual',
        subtitle: 'The definitive guide to configuring, maintaining, and operating the CARS Manager ecosystem.',
        slides: {
            intro: 'System Overview',
            objectives: 'Objectives & Solutions',
            logic: 'The Compliance Logic',
            workflow: 'Core Workflows',
            config: 'Configuration',
            booking: 'Booking Rules',
            advanced: 'Advanced Features',
            troubleshoot: 'Troubleshooting'
        },
        content: {
            confidential: 'CONFIDENTIAL',
            production: 'PRODUCTION',
            formulaTitle: 'The Compliance Formula',
            formulaLogic: {
                active: 'IsActive',
                aso: 'ASO_Expiry',
                today: 'Today',
                racs: 'ALL Required_RACs',
                and: 'AND',
                result: 'ACCESS_GRANTED'
            },
            objectives: {
                title: 'Current Challenges vs. Solutions',
                problemTitle: 'Current Operational Problems',
                solutionTitle: 'CARS System Capabilities',
                p1Title: 'Fragmented Data Silos',
                p1Desc: 'Training records, medical (ASO) dates, and operational permissions are currently tracked in disconnected spreadsheets, leading to version control issues and data loss.',
                s1Title: 'Unified Source of Truth',
                s1Desc: 'A centralized SQL-structured database consolidates Employee Health, Safety Training, and Access Permissions into a single, real-time master record.',
                p2Title: 'Reactive Compliance Management',
                p2Desc: 'Managers often realize an employee is non-compliant only after they are blocked at the gate or when a certificate has already expired, causing downtime.',
                s2Title: 'Proactive Auto-Booking Engine',
                s2Desc: 'The system automatically scans for certifications expiring in < 7 days and auto-reserves a training slot, ensuring zero downtime.',
                p3Title: 'Administrative Overhead',
                p3Desc: 'Generating monthly safety reports and issuing cards requires hours of manual data collation and formatting.',
                s3Title: 'Automated Intelligence',
                s3Desc: 'One-click AI-powered Executive Reports and batch generation of QR-coded ID cards reduce administrative time by 90%.',
                p4Title: 'Lack of Field Verification',
                p4Desc: 'Physical cards can be forged or may not reflect the most recent revocation of access rights.',
                s4Title: 'Digital Passport Verification',
                s4Desc: 'Live QR codes allow field officers to scan any badge and view the real-time, tamper-proof database status of that employee.'
            },
            flowTitle: 'Core Data Flow',
            flowSteps: {
                db: 'Database',
                dbDesc: 'Define Requirements (Input)',
                book: 'Booking',
                bookDesc: 'Schedule Training (Process)',
                res: 'Results',
                resDesc: 'Grade & Certify (Output)',
                stat: 'Status',
                statDesc: 'Real-time Compliance'
            },
            configTitle: 'System Configuration',
            configCards: {
                racs: 'RAC Definitions',
                racsDesc: 'Define the core training modules (e.g., RAC 01, RAC 02).',
                rooms: 'Rooms',
                roomsDesc: 'Define physical locations and capacity limits.',
                trainers: 'Trainers',
                trainersDesc: 'Authorize instructors for specific modules.'
            },
            bookingTitle: 'Critical Booking Rules',
            matrixLock: 'The Matrix Lock',
            matrixDesc: 'The Booking Module strictly enforces the Database Matrix. You cannot book an employee for "RAC 01" unless it is marked as Required in their Database profile.',
            gradingTitle: 'Grading Logic',
            gradingText: 'Pass mark is 70%. Attendance is mandatory. If Theory score < 70, Practical input is locked.',
            rac02Title: 'RAC 02 Driver License',
            rac02Text: 'Requires "DL Verified" check by trainer. If unchecked, student fails automatically regardless of score.',
            expiryTitle: 'Auto-Expiry',
            expiryText: 'Successful results set an expiry date of 2 Years from the session date automatically.',
            advancedTitle: 'Advanced Features',
            autoBook: 'Auto-Booking Engine',
            autoBookDesc: 'Scans for employees expiring in < 7 Days. Automatically reserves slots.',
            aiRep: 'AI Reporting',
            aiRepDesc: 'Generates executive summaries using Google Gemini AI.',
            alc: 'Alcohol Control',
            alcDesc: 'Integration Roadmap: Link with turnstiles.',
            tsTitle: 'Troubleshooting',
            ts1: "Why can't I find an employee in the Booking Form?",
            ts1Desc: "Ensure the employee exists in the Database first.",
            ts2: 'Employee "Blocked" even after passing training?',
            ts2Desc: "Check their ASO (Medical) date.",
            ts3: 'QR Code shows "Record Not Found"',
            ts3Desc: "The QR code links to the employee's Record ID."
        }
    },
    manuals: { 
        title: 'User Manuals', 
        subtitle: 'Role-based documentation',
        sysAdmin: { 
            title: 'System Administrator Manual',
            subtitle: 'Global Configuration & Data',
            configTitle: '1. Global Configuration (Settings)',
            configDesc: 'The Settings page controls system-wide dropdowns.',
            rooms: 'Managing Rooms: Define locations and their capacity. This limits bookings in the "Book Training" module to prevent overcrowding.',
            trainers: 'Managing Trainers: Add instructors and assign their qualified RACs. This populates the instructor dropdown in the Schedule.',
            racs: 'Defining RACs: Define the core training modules. Warning: Deleting a RAC here removes its column from the Database Matrix.',
            dbTitle: '2. Database & CSV Import',
            dbDesc: 'The Database is the master record for compliance.',
            csv: 'CSV Import: Use the "Download Template" button. The matrix columns (RAC01, etc.) expect "1" or "TRUE" for required training.',
            active: 'Active Status: Unchecking "Active" triggers a deletion prompt to keep the database clean.',
            restrictionWarning: "CRITICAL RESTRICTION: The Booking Module strictly enforces the Database Matrix. You cannot book an employee for a training (e.g., RAC 01) unless it is marked as 'Required' in their Database profile. This prevents unauthorized training."
        },
        racAdmin: { 
            title: 'RAC Administrator Manual',
            subtitle: 'Scheduling & Compliance',
            schedTitle: '1. Scheduling Training',
            schedDesc: 'Create the calendar slots for employees.',
            create: 'Create Session: Go to "Schedule Trainings". Select RAC Type, Date, Time, and Room. Capacity is auto-filled from Settings.',
            lang: 'Language: Specify if the session is English or Portuguese.',
            autoTitle: '2. Auto-Booking Management',
            autoDesc: 'The system auto-books employees expiring in <7 days.',
            approve: 'Approval Queue: On the Dashboard, review the orange "Pending Auto-Bookings" table. Click Approve to confirm or Reject to cancel.',
            renewTitle: '3. Bulk Renewals',
            renewDesc: 'Use the Dashboard "Book Renewals" button to load a batch queue of expiring employees into the Booking Form.'
        },
        racTrainer: { 
            title: 'Trainer Portal Manual',
            subtitle: 'Grading & Attendance',
            inputTitle: '1. Inputting Results',
            inputDesc: 'Navigate to "Trainer Input". You will only see sessions assigned to you.',
            grading: 'Grading Logic: Pass mark is 70%. If Theory is <70, Practical is locked. Attendance must be checked.',
            rac02: 'RAC 02 Special Rule: You must verify the Driver License physically and check the "DL Verified" box. If unchecked, the student fails automatically regardless of score.',
            save: 'Saving: Clicking "Save Results" updates the main database and sets the expiry date to 2 years from the session date.'
        },
        deptAdmin: { 
            title: 'Department Admin Manual',
            subtitle: 'Reporting & Card Requests',
            reqTitle: '1. Requesting Cards',
            reqDesc: 'Build a print batch for your team.',
            search: 'Search Slots: Use the 8 search slots. Green Check = Eligible (Passed + Valid ASO). Red Alert = Ineligible.',
            print: 'Print View: Click "Go to Print View" to see the 8-up grid. Ensure printer is set to "Landscape" and "Background Graphics" is ON.',
            repTitle: '2. Compliance Reports',
            repDesc: 'Use the Reports page to filter by your Department and check Pass Rates and expiring certifications.'
        },
        user: { 
            title: 'General User Manual',
            subtitle: 'My Status',
            statusTitle: '1. Compliance Status',
            statusDesc: 'Your site access depends on your status.',
            green: 'Compliant: Valid ASO + All Required RACs passed.',
            red: 'Non-Compliant: Expired ASO, Missing RAC, or Expired Driver License (if RAC 02 holder).',
            qr: 'Digital Passport: Scanning your card QR code reveals your real-time status from the database.',
            filterAlert: "NOTE: Your booking options are filtered. You will ONLY see training sessions that are assigned to your specific Job Role/Matrix. If you do not see a session, you are not authorized to book it."
        }
    },
    alcohol: { title: 'Alcohol Control', subtitle: 'Roadmap', banner: { title: 'Coming Soon', desc: 'IoT Integration', status: 'Dev' }, features: { title: 'Vision', iotTitle: 'IoT', iotDesc: 'Direct integration with industrial breathalyzers to capture results in real-time.', accessTitle: 'Automated Lockout', accessDesc: 'Automatically block turnstile access if alcohol is detected or training is expired.', complianceTitle: 'Compliance Reporting', complianceDesc: 'Unified logs for both safety training and fitness-for-duty checks.' }, protocol: { title: 'Protocol', positiveTitle: 'Positive Test Protocol', positiveDesc: 'If a positive test (>0.00%) is detected, the turnstile locks immediately. The employee is marked as "Blocked" in the database.', resetTitle: '02:00 AM Reset Rule', resetDesc: 'The system automatically unlocks the employee at exactly 02:00:00 hrs the following day, allowing re-entry if sober.' }, challenges: { title: 'Current Challenges', oemIssue: 'Current breathalyzers send data to an external OEM Cloud. This poses data sovereignty risks.', gateSetup: 'Main gate physical layout requires modification.' }, proposal: { title: 'Proposed Solution', faceCap: 'Purchase models with Face Capture.', integration: 'Develop middleware to intercept data.', projectScope: 'Independent project involving Civil & Electrical.' } },
    logs: { title: 'Audit Logs', subtitle: 'Tracking.', levels: { all: 'All', info: 'Info', warn: 'Warn', error: 'Error', audit: 'Audit' }, table: { level: 'Nível', timestamp: 'Time', user: 'User', message: 'Msg' } },
    proposal: {
        title: 'Project Proposal: CARS Manager',
        digitalTrans: 'Digital Transformation Initiative',
        aboutMe: {
            title: 'About The Developer',
            name: 'Pita Antonio Domingos',
            preferred: 'Pita Domingos',
            role: 'Contract Manager (Jachris - Mota Engil Site)',
            cert: 'IBM Certified Data Science Professional',
            bio: 'My data science journey started with Excel and Power BI, then upgraded to Python, NodeJS, and ReactJS. I have developed various software solutions, notably EduDesk and H365, which are comprehensive SaaS applications featuring tiered subscription models. My portfolio also includes SwiftPOS, MicroFin, and JacTrac (Hydraulic Hose Tracking).',
            portfolio: 'Portfolio: EduDesk (SaaS), H365 (SaaS), SwiftPOS, MicroFin, JacTrac'
        },
        thankYou: {
            title: 'Thank You',
            message: 'We appreciate your time and consideration.',
            contact: 'pita.domingos@zd044.onmicrosoft.com',
            phone: '+258 845479481'
        },
        letter: {
            recipient: 'To: The Management Team',
            role: 'Vulcan Mining Operations',
            company: 'Tete, Mozambique',
            subject: 'Subject: Proposal for Digital Safety Management System Implementation',
            salutation: 'Dear Management Team,',
            intro: 'We are pleased to submit this proposal for the development and implementation of the CARS Manager. This comprehensive digital solution is designed to streamline your Critical Activity Requisitions (RAC) training management, ensuring 100% compliance visibility and operational efficiency.',
            body1: 'Our solution addresses the current challenges of manual tracking, fragmented data, and delayed reporting. By centralizing employee data, training records, and issuance of digital credentials, we aim to significantly reduce administrative overhead and improve site safety standards.',
            body2: 'The proposed system includes advanced features such as AI-driven reporting, real-time dashboards, and secure role-based access control, tailored specifically for the mining environment context.',
            closing: 'We look forward to the opportunity to partner with Vulcan Mining on this critical safety initiative.',
            signoff: 'Sincerely,',
            team: 'DigiSols Team'
        },
        execSummary: {
            title: '1. Executive Summary',
            text: 'The CARS Manager is a bespoke web-based platform designed to digitize the end-to-end process of safety training management. From scheduling sessions to grading results and issuing ID cards, the system provides a single source of truth for HSE compliance. It replaces manual spreadsheets and paper records with a secure, automated database accessible by System Admins, RAC Trainers, and Department Leads.',
            quote: '"Safety is not just a priority, it is a core value. Our digital tools must reflect the same standard of excellence as our operational machinery."'
        },
        objectives: {
            title: '2. Project Objectives',
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
            title: '3. Project Organogram',
            pm: 'Project Manager',
            delivery: 'Delivery Lead',
            tech1: 'Technician 1',
            tech2: 'Technician 2',
            regime: 'Local Regime',
            days: '20 days on / 10 off',
            pmRole: 'Responsible for overall delivery, stakeholder management, and requirement gathering. Ensures the project stays on track and within budget.',
            techRole: 'Responsible for full-stack development, database optimization, and on-site deployment. Will work on a rotating schedule to ensure continuous support.'
        },
        roles: {
            title: '4. User Roles & Permissions',
            sysAdmin: { title: 'System Admin', desc: 'Full access to all settings, user management, and configuration.' },
            racAdmin: { title: 'RAC Admin', desc: 'Manages training schedules, approves results, and oversees compliance.' },
            deptAdmin: { title: 'Dept Admin', desc: 'Read-only access for their department. Can request cards for their team.' },
            racTrainer: { title: 'RAC Trainer', desc: 'Can only view assigned sessions and input grades/attendance.' },
            user: { title: 'General User', desc: 'Can view their own status and request card replacement.' }
        },
        timeline: {
            title: '5. Implementation Timeline',
            intro: 'The project will be delivered in 4 phases over a 12-week period.',
            phase1: 'Phase 1: Discovery & Design (Weeks 1-2)',
            phase1desc: 'Requirement gathering, UI/UX prototyping, and database schema design.',
            phase2: 'Phase 2: Core Development (Weeks 3-8)',
            phase2desc: 'Development of Booking Module, Database, and Grading System.',
            phase3: 'Phase 3: Testing & QA (Weeks 9-10)',
            phase3desc: 'User Acceptance Testing (UAT), bug fixing, and load testing.',
            phase4: 'Phase 4: Deployment & Training (Weeks 11-12)',
            phase4desc: 'Production deployment, admin training sessions, and handover.'
        },
        techStack: {
            title: '6. Tech Stack',
            frontendTitle: 'Frontend',
            frontend: 'React (TypeScript), Tailwind CSS, Lucide Icons',
            backendTitle: 'Backend Logic',
            backend: 'Node.js (Browser-Simulated for Prototype), RESTful Architecture',
            databaseTitle: 'Database',
            database: 'PostgreSQL / SQL Server (Production Ready)',
            securityTitle: 'Security',
            security: 'JWT Authentication, Role-Based Access Control, Data Encryption'
        },
        financials: {
            title: '7. Financial Investment',
            item: 'Item Description',
            type: 'Type',
            cost: 'Cost (USD)',
            total: 'Total Initial Investment (Items 1 + 2)',
            items: [
                { name: 'Software Development & Customization', type: 'One-time', cost: '$15,000.00' },
                { name: 'Cloud Infrastructure Setup & Data Migration', type: 'One-time', cost: '$2,500.00' },
                { name: 'Cloud Tier Subscription, Maintenance & Management Fees', type: 'Monthly', cost: '$10,000.00' },
                { name: 'New Feature Development', type: 'On-Demand', cost: '$3,500.00' },
                { name: 'Seasonal Security Updates', type: 'Seasonal', cost: '$0.00' }
            ]
        },
        roadmap: {
            title: '8. Future Roadmap',
            intro: 'Beyond the initial launch, we propose the following enhancements:',
            auth: 'SSO Integration',
            authDesc: 'Connect with Azure AD for Single Sign-On.',
            db: 'Cloud Migration',
            dbDesc: 'Move from on-prem to Azure/AWS for scalability.',
            email: 'Automated Emails',
            emailDesc: 'Send PDF certificates directly to employee email.',
            hosting: 'Mobile App',
            hostingDesc: 'Native Android/iOS app for field verification.'
        },
        aiFeatures: {
            title: '9. AI & Smart Features',
            intro: 'Leveraging Google Gemini AI for safety intelligence.',
            advisor: 'Safety Advisor Chatbot',
            advisorDesc: 'An embedded AI assistant that answers questions about RAC standards and safety protocols in natural language.',
            analysis: 'Automated Reporting',
            analysisDesc: 'AI analyzes monthly trends to identify high-risk departments and suggest targeted training interventions.'
        },
        futureUpdates: {
            title: '10. Alcohol & IoT Integration Scope',
            softwareScope: {
                title: 'Module A: Software Integration',
                desc: 'Updates to this web application to support data ingestion and reporting.',
                feat1: 'API Endpoints for Breathalyzer Data',
                feat2: 'New "Fitness for Duty" Dashboard Widget',
                feat3: 'Logic to block card issuance if alcohol flag is active'
            },
            infraScope: {
                title: 'Module B: Infrastructure (Independent Project)',
                desc: 'Physical installation and hardware required at the main gate. Handled as a separate contract.',
                feat1: 'Civil Works (Turnstile Modification)',
                feat2: 'Electrical & Cabling (Cat6/Power)',
                feat3: 'Breathalyzer Hardware Procurement with Face-ID'
            }
        },
        enhancedCaps: {
            title: '11. Enhanced Operational Capabilities',
            intro: 'In addition to core training modules, the system now includes advanced operational tools designed for real-time compliance verification and administrative automation.',
            mobileVerify: {
                title: 'Mobile Verification (Digital Passport)',
                desc: 'Field safety officers can now verify employee compliance instantly by scanning the QR code on the safety card using any smartphone. The system returns a secure, real-time "Digital Passport" page.',
                features: ['Real-time Status Check (DB Query)', 'Visual Compliance Indicator (Green Tick / Red Cross)', 'Displays ASO & Driver License Validity']
            },
            autoBooking: {
                title: 'Intelligent Auto-Booking',
                desc: 'To prevent compliance gaps, the system proactively monitors training expiration dates. When a certification is within 7 days of expiry, the system automatically books a slot in the next available training session.',
                features: ['Automated scheduling based on expiry (<7 days)', 'RAC Admin Approval Workflow', 'Prevents operational downtime due to expired credentials']
            },
            massData: {
                title: 'Mass Data Management',
                desc: 'Efficiently handle large workforce datasets with bulk import/export capabilities via CSV.',
                features: ['Bulk Employee Registration', 'Historical Data Migration', 'Automated Record Matching']
            },
            auditLogs: {
                title: 'System Audit Trails',
                desc: 'Comprehensive logging of all system activities ensures accountability and security.',
                features: ['User Action Tracking', 'Security Event Monitoring', 'Timestamped Change Logs']
            },
            smartBatching: {
                title: 'Smart Batch Processing',
                desc: 'To handle high-volume sites, the system includes a dedicated batch processor. It groups expiring certifications by training type (RAC) and creates a sequential, guided booking queue.',
                features: ['Sequential Renewal Queue', 'Visual Card Batch Builder', 'Conflict-free Session Allocation']
            },
            matrixCompliance: {
                title: 'Matrix-Locked Booking Engine',
                desc: 'To ensure absolute compliance, the booking engine is hard-locked to the Database Matrix. Admins and Users cannot bypass safety requirements—bookings are only permitted if the specific RAC is marked as mandatory.',
                features: ['Prevents unauthorized training', 'Enforces role-based safety matrix', 'Reduces training waste']
            },
            selfService: {
                title: 'Employee Self-Service Portal',
                desc: 'Empowers employees to manage their own compliance. Staff can log in to view their status, check requirement gaps, and download their digital passport, significantly reducing administrative inquiries.',
                features: ['Personal Compliance Dashboard', 'Digital Card Download', 'Requirement Gap Analysis']
            }
        },
        conclusion: {
            title: '12. Conclusion',
            text: 'The CARS Manager represents a significant step towards operational safety excellence. By digitizing these critical workflows, Vulcan Mining will not only ensure compliance but also foster a culture of transparency and efficiency. We are committed to delivering a world-class solution that meets your rigorous standards.'
        }
    },
    ai: { systemPromptAdvice: 'You are a safety expert...', systemPromptReport: 'Analyze...' }
  },
  pt: {
    nav: {
      dashboard: 'Painel',
      database: 'Base de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Entrada do Instrutor',
      records: 'Registros',
      users: 'Gestão de Usuários',
      schedule: 'Agendar Sessões',
      settings: 'Configurações',
      requestCards: 'Solicitar Cartões',
      manuals: 'Manuais do Usuário',
      adminGuide: 'Guia do Admin',
      logs: 'Logs do Sistema',
      proposal: 'Proposta do Projeto',
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
      status: 'Estado',
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
      of: 'de'
    },
    verification: {
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
      subtitle: 'Métricas de segurança em tempo real.',
      kpi: {
        adherence: 'Adesão HSE',
        certifications: 'Total de Certificações',
        pending: 'Avaliação Pendente',
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
        viewSchedule: 'Ver Cronograma',
        capacity: 'Capacidade',
        status: 'Estado',
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
        noData: 'Nenhum agendamento encontrado'
      },
      renewal: {
        title: 'Ação Necessária: Renovação de Treinamento',
        message: 'funcionários têm treinamento crítico expirando em 30 dias.',
        button: 'Agendar Renovações'
      },
      autoBooking: {
        title: 'Ação Necessária: Auto-Agendamentos Pendentes',
        subPart1: 'O sistema detectou riscos de expiração',
        subPart2: 'e reservou vagas para evitar bloqueio. Aprove para finalizar.'
      }
    },
    database: {
      title: 'Base de Dados Mestre',
      subtitle: 'Gerencie requisitos. RAC 02 é auto-desativado se a Carta estiver expirada.',
      filters: 'Filtros',
      accessStatus: 'Status de Acesso',
      granted: 'Permitido',
      blocked: 'Bloqueado',
      employeeInfo: 'Info do Funcionário & Carta',
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
        subtitle: 'Atualize os detalhes. Mudar Empresa/Dept manterá o histórico sob a nova entidade.',
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
      secureMode: 'Modo de Entrada Segura',
      manageSchedule: 'Gerenciar Cronograma',
      dlRequired: 'Detalhes da Carta necessários para RAC 02',
      success: 'Agendamento enviado com sucesso!',
      selectSession: 'Selecionar Sessão',
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
        expiryMsg: 'Treinamento para {name} ({rac}) expira em {days} dias.',
        autoBookTitle: 'Auto-Agendamento Criado',
        autoBookMsg: '{name} foi auto-agendado para {rac} em {date} (expira em {days} dias).',
        autoBookFailTitle: 'Falha no Auto-Agendamento',
        autoBookFailMsg: 'Não foi possível agendar {name} para {rac}. Nenhuma sessão disponível.',
        capacityTitle: 'Sessão Cheia - Realocação',
        capacityMsg: 'funcionários foram movidos para a próxima sessão disponível em',
        demandTitle: 'Alerta de Alta Demanda',
        demandMsg: 'Alta demanda detectada para',
        duplicateTitle: 'Agendamento Duplicado',
        duplicateMsg: 'Usuário já agendado para este tipo de treinamento.'
    },
    advisor: { button: 'Consultor de Segurança', title: 'Consultor IA CARS', sender: 'Consultor CARS', emptyState: 'Como posso ajudar?', placeholder: 'Pergunte sobre padrões RAC...' },
    results: { title: 'Registros de Treinamento', subtitle: 'Ver resultados.', searchPlaceholder: 'Pesquisar...', table: { employee: 'Funcionário', session: 'Sessão', date: 'Data', trainer: 'Instrutor', room: 'Sala', dlRac02: 'Carta (RAC 02)', theory: 'Teoria', prac: 'Prática', status: 'Estado', expiry: 'Validade' } },
    cards: { title: 'Cartões de Segurança', showing: 'Exibindo', subtitle: 'Selecione funcionários.', goToPrint: 'Ir para Impressão', selected: 'Selecionado', successTitle: 'Solicitação Enviada', successMsg: 'Solicitação encaminhada.', noRecords: 'Sem Registros Elegíveis', noRecordsSub: 'Apenas registros aprovados aparecem aqui.', selectAll: 'Selecionar Tudo', sending: 'Enviando...', requestButton: 'Solicitar Cartões', validation: { ineligible: 'Funcionário inelegível.', maxSelection: 'Máx 8 cartões.', incomplete: 'Incompleto' } },
    trainer: { title: 'Entrada do Instrutor', subtitle: 'Inserir notas.', passMark: 'Aprovação: 70%', loggedInAs: 'Logado como', selectSession: 'Selecionar Sessão', noSessions: 'Nenhuma sessão.', chooseSession: 'Escolha a sessão...', dlWarning: 'Verificar Carta para RAC 02.', saveResults: 'Salvar Resultados', table: { employee: 'Funcionário', attendance: 'Presença', dlCheck: 'Verif. Carta', verified: 'Verificado', theory: 'Teoria', practical: 'Prática', rac02Only: '(RAC 02)', status: 'Estado' } },
    users: { title: 'Gestão de Usuários', subtitle: 'Gerenciar acesso.', addUser: 'Adicionar Usuário', table: { user: 'Usuário', role: 'Função', status: 'Estado', actions: 'Ações' }, modal: { title: 'Adicionar Usuário', name: 'Nome', email: 'Email', createUser: 'Criar' } },
    schedule: { title: 'Cronograma de Treinamento', subtitle: 'Gerenciar sessões.', newSession: 'Nova Sessão', table: { date: 'Data/Hora', rac: 'RAC', room: 'Local', trainer: 'Instrutor' }, modal: { title: 'Agendar', racType: 'RAC', date: 'Data', startTime: 'Início', location: 'Local', capacity: 'Cap', instructor: 'Instrutor', saveSession: 'Salvar', language: 'Idioma', english: 'Inglês', portuguese: 'Português' } },
    settings: { title: 'Configurações', subtitle: 'Config.', saveAll: 'Salvar', saving: 'Salvando...', tabs: { general: 'Geral', trainers: 'Instrutores', racs: 'RACs' }, rooms: { title: 'Salas', name: 'Nome', capacity: 'Cap', new: 'Nova Sala' }, trainers: { title: 'Instrutores', name: 'Nome', qualifiedRacs: 'RACs', new: 'Novo Instrutor' }, racs: { title: 'RACs', code: 'Código', description: 'Desc', new: 'Novo RAC' } },
    reports: { title: 'Relatórios', subtitle: 'Analíticos.', printReport: 'Imprimir', filters: { period: 'Período', department: 'Dept', racType: 'RAC', startDate: 'Início', endDate: 'Fim' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Anual', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva IA', trainerMetrics: { title: 'Métricas do Instrutor', name: 'Instrutor', sessions: 'Sessões', passRate: 'Aprovação', avgTheory: 'Teoria', avgPrac: 'Prática' } },
    adminManual: {
        title: 'Manual do Administrador',
        subtitle: 'O guia definitivo para configurar, manter e operar o ecossistema CARS Manager.',
        slides: {
            intro: 'Visão Geral',
            objectives: 'Objetivos e Soluções',
            logic: 'A Lógica de Conformidade',
            workflow: 'Fluxos de Trabalho',
            config: 'Configuração',
            booking: 'Regras de Agendamento',
            advanced: 'Recursos Avançados',
            troubleshoot: 'Solução de Problemas'
        },
        content: {
            confidential: 'CONFIDENCIAL',
            production: 'PRODUÇÃO',
            formulaTitle: 'A Fórmula de Conformidade',
            formulaLogic: {
                active: 'EstaAtivo',
                aso: 'Validade_ASO',
                today: 'Hoje',
                racs: 'TODOS RACs_Obrigatorios',
                and: 'E',
                result: 'ACESSO_PERMITIDO'
            },
            objectives: {
                title: 'Desafios Atuais vs. Soluções',
                problemTitle: 'Problemas Operacionais Atuais',
                solutionTitle: 'Capacidades do Sistema CARS',
                p1Title: 'Silos de Dados Fragmentados',
                p1Desc: 'A dependência de planilhas desconectadas leva a conflitos de versão e perda de dados.',
                s1Title: 'Fonte Única da Verdade',
                s1Desc: 'Banco de dados centralizado garante que todos os departamentos vejam o status em tempo real.',
                p2Title: 'Gestão Reativa de Conformidade',
                p2Desc: 'Gestores só percebem a não conformidade quando um funcionário é barrado no portão.',
                s2Title: 'Motor de Auto-Agendamento',
                s2Desc: 'O sistema verifica certificações expirando em < 7 dias e reserva vaga automaticamente.',
                p3Title: 'Sobrecarga Administrativa',
                p3Desc: 'Gerar relatórios mensais e emitir cartões exige horas de trabalho manual.',
                s3Title: 'Inteligência Automatizada',
                s3Desc: 'Relatórios executivos via IA e emissão de cartões com QR reduzem o tempo administrativo em 90%.',
                p4Title: 'Falta de Verificação em Campo',
                p4Desc: 'Cartões físicos podem ser falsificados ou não refletir a revogação recente de acesso.',
                s4Title: 'Passaporte Digital',
                s4Desc: 'Códigos QR permitem que oficiais escaneiem qualquer crachá e vejam o status real no banco de dados.'
            },
            flowTitle: 'Fluxo de Dados Principal',
            flowSteps: {
                db: 'Base de Dados',
                dbDesc: 'Definir Requisitos (Entrada)',
                book: 'Agendamento',
                bookDesc: 'Agendar Treino (Processo)',
                res: 'Resultados',
                resDesc: 'Avaliar & Certificar (Saída)',
                stat: 'Estado',
                statDesc: 'Conformidade em Tempo Real'
            },
            configTitle: 'Configuração do Sistema',
            configCards: {
                racs: 'Definições RAC',
                racsDesc: 'Defina os módulos de treinamento principais (ex: RAC 01, RAC 02).',
                rooms: 'Salas',
                roomsDesc: 'Defina locais físicos e limites de capacidade.',
                trainers: 'Instrutores',
                trainersDesc: 'Autorize instrutores para módulos específicos.'
            },
            bookingTitle: 'Regras Críticas de Agendamento',
            matrixLock: 'O Bloqueio da Matriz',
            matrixDesc: 'O Módulo de Agendamento impõe estritamente a Matriz da Base de Dados. Você não pode agendar um funcionário para "RAC 01" a menos que esteja marcado como Obrigatório no perfil dele.',
            gradingTitle: 'Lógica de Avaliação',
            gradingText: 'Nota de aprovação é 70%. Presença é obrigatória. Se Teoria < 70, Prática bloqueada.',
            rac02Title: 'Carta de Condução RAC 02',
            rac02Text: 'Requer verificação física da Carta. Se desmarcado, reprovação automática.',
            expiryTitle: 'Validade Automática',
            expiryText: 'Resultados aprovados definem validade de 2 Anos automaticamente.',
            advancedTitle: 'Recursos Avançados',
            autoBook: 'Motor de Auto-Agendamento',
            autoBookDesc: 'Verifica funcionários expirando em < 7 Dias. Reserva vagas automaticamente.',
            aiRep: 'Relatórios IA',
            aiRepDesc: 'Gera resumos executivos usando Google Gemini AI.',
            alc: 'Controle de Álcool',
            alcDesc: 'Roteiro de Integração: Link com torniquetes.',
            tsTitle: 'Solução de Problemas',
            ts1: "Por que não encontro um funcionário no formulário?",
            ts1Desc: "Certifique-se de que o funcionário existe na Base de Dados primeiro.",
            ts2: 'Funcionário "Bloqueado" mesmo após passar no treino?',
            ts2Desc: "Verifique a data do ASO (Médico).",
            ts3: 'Código QR mostra "Registro Não Encontrado"',
            ts3Desc: "O código QR está vinculado ao ID de Registro do funcionário."
        }
    },
    manuals: { 
        title: 'Manuais do Usuário', 
        subtitle: 'Documentação baseada em função',
        sysAdmin: { 
            title: 'Manual do Administrador do Sistema',
            subtitle: 'Configuração Global e Dados',
            configTitle: '1. Configuração Global (Configurações)',
            configDesc: 'A página de Configurações controla os menus suspensos de todo o sistema.',
            rooms: 'Gerenciando Salas: Defina locais e sua capacidade. Isso limita os agendamentos no módulo "Agendar Treinamento" para evitar superlotação.',
            trainers: 'Gerenciando Instrutores: Adicione instrutores e atribua seus RACs qualificados. Isso preenche o menu de instrutores no Cronograma.',
            racs: 'Definindo RACs: Defina os módulos principais. Aviso: Excluir um RAC aqui remove sua coluna da Matriz da Base de Dados.',
            dbTitle: '2. Base de Dados e Importação CSV',
            dbDesc: 'A Base de Dados é o registro mestre de conformidade.',
            csv: 'Importação CSV: Use o botão "Baixar Modelo". As colunas da matriz (RAC01, etc.) esperam "1" ou "TRUE" para treinamento obrigatório.',
            active: 'Status Ativo: Desmarcar "Ativo" aciona um aviso de exclusão para manter a base de dados limpa.',
            restrictionWarning: "RESTRIÇÃO CRÍTICA: O Módulo de Agendamento impõe estritamente a Matriz da Base de Dados. Você não pode agendar um funcionário para um treinamento (ex: RAC 01) a menos que esteja marcado como 'Obrigatório' em seu perfil. Isso evita treinamentos não autorizados."
        },
        racAdmin: { 
            title: 'Manual do Administrador RAC',
            subtitle: 'Agendamento e Conformidade',
            schedTitle: '1. Agendando Treinamento',
            schedDesc: 'Crie os horários no calendário para os funcionários.',
            create: 'Criar Sessão: Vá para "Agendar Sessões". Selecione Tipo RAC, Data, Hora e Sala. A capacidade é preenchida automaticamente.',
            lang: 'Idioma: Especifique se a sessão é em Inglês ou Português.',
            autoTitle: '2. Gestão de Auto-Agendamento',
            autoDesc: 'O sistema agenda automaticamente funcionários expirando em <7 dias.',
            approve: 'Fila de Aprovação: No Painel, revise a tabela laranja "Auto-Agendamentos Pendentes". Clique em Aprovar para confirmar ou Rejeitar para cancelar.',
            renewTitle: '3. Renovações em Massa',
            renewDesc: 'Use o botão "Agendar Renovações" no Painel para carregar uma fila de funcionários expirando no Formulário de Agendamento.'
        },
        racTrainer: { 
            title: 'Manual do Portal do Instrutor',
            subtitle: 'Avaliação e Presença',
            inputTitle: '1. Inserindo Resultados',
            inputDesc: 'Navegue para "Entrada do Instrutor". Você verá apenas as sessões atribuídas a você.',
            grading: 'Lógica de Avaliação: Nota de aprovação é 70%. Se Teoria for <70, Prática é bloqueada. Presença deve ser marcada.',
            rac02: 'Regra Especial RAC 02: Você deve verificar a Carta de Condução fisicamente e marcar a caixa "Carta Verificada". Se desmarcado, o aluno reprova automaticamente.',
            save: 'Salvar: Clicar em "Salvar Resultados" atualiza a base de dados principal e define a validade para 2 anos a partir da data da sessão.'
        },
        deptAdmin: { 
            title: 'Manual do Admin de Departamento',
            subtitle: 'Relatórios e Solicitação de Cartões',
            reqTitle: '1. Solicitando Cartões',
            reqDesc: 'Crie um lote de impressão para sua equipe.',
            search: 'Slots de Pesquisa: Use os 8 slots. Verde = Elegível (Aprovado + ASO Válido). Vermelho = Inelegível.',
            print: 'Visualização de Impressão: Clique em "Ir para Impressão" para ver a grade de 8. Certifique-se de que a impressora esteja configurada para "Paisagem" e "Gráficos de Fundo" esteja ATIVADO.',
            repTitle: '2. Relatórios de Conformidade',
            repDesc: 'Use a página de Relatórios para filtrar pelo seu Departamento e verificar Taxas de Aprovação e certificações expirando.'
        },
        user: { 
            title: 'Manual do Usuário Geral',
            subtitle: 'Meu Status',
            statusTitle: '1. Status de Conformidade',
            statusDesc: 'Seu acesso ao local depende do seu status.',
            green: 'Conforme: ASO Válido + Todos os RACs Obrigatórios aprovados.',
            red: 'Não Conforme: ASO Expirado, RAC Ausente ou Carta Expirada (se portador de RAC 02).',
            qr: 'Passaporte Digital: Escanear o código QR do seu cartão revela seu status em tempo real da base de dados.',
            filterAlert: "NOTA: Suas opções de agendamento são filtradas. Você verá APENAS sessões de treinamento atribuídas à sua Função/Matriz específica. Se você não vir uma sessão, não está autorizado a agendá-la."
        }
    },
    alcohol: { title: 'Controle de Álcool', subtitle: 'Roteiro', banner: { title: 'Em Breve', desc: 'Integração IoT', status: 'Dev' }, features: { title: 'Visão', iotTitle: 'IoT', iotDesc: 'Integração direta com bafômetros industriais para capturar resultados em tempo real.', accessTitle: 'Bloqueio Automático', accessDesc: 'Bloquear automaticamente o acesso ao torniquete se álcool for detectado ou treinamento estiver expirado.', complianceTitle: 'Relatórios de Conformidade', complianceDesc: 'Logs unificados para verificações de segurança e aptidão para o trabalho.' }, protocol: { title: 'Protocolo', positiveTitle: 'Protocolo de Teste Positivo', positiveDesc: 'Se um teste positivo (>0.00%) for detectado, o torniquete trava imediatamente. O funcionário é marcado como "Bloqueado" na base de dados.', resetTitle: 'Regra de Redefinição 02:00 AM', resetDesc: 'O sistema desbloqueia automaticamente o funcionário exatamente às 02:00:00 do dia seguinte, permitindo reentrada se sóbrio.' }, challenges: { title: 'Desafios Atuais', oemIssue: 'Bafômetros atuais enviam dados para uma nuvem OEM externa. Isso representa riscos de soberania de dados.', gateSetup: 'Layout físico do portão principal requer modificação.' }, proposal: { title: 'Solução Proposta', faceCap: 'Adquirir modelos com Captura Facial.', integration: 'Desenvolver middleware para interceptar dados.', projectScope: 'Projeto independente envolvendo Civil e Elétrica.' } },
    logs: { title: 'Logs de Auditoria', subtitle: 'Rastreamento.', levels: { all: 'Todos', info: 'Info', warn: 'Aviso', error: 'Erro', audit: 'Auditoria' }, table: { level: 'Nível', timestamp: 'Hora', user: 'Usuário', message: 'Msg' } },
    proposal: {
        title: 'Proposta de Projeto: Gestor CARS',
        digitalTrans: 'Iniciativa de Transformação Digital',
        aboutMe: {
            title: 'Sobre o Desenvolvedor',
            name: 'Pita Antonio Domingos',
            preferred: 'Pita Domingos',
            role: 'Gerente de Contrato (Jachris - Site Mota Engil)',
            cert: 'Profissional de Ciência de Dados Certificado pela IBM',
            bio: 'Minha jornada em ciência de dados começou com Excel e Power BI, depois evoluiu para Python, NodeJS e ReactJS. Desenvolvi várias soluções de software, notavelmente EduDesk e H365, que são aplicativos SaaS abrangentes com modelos de assinatura em camadas. Meu portfólio também inclui SwiftPOS, MicroFin e JacTrac (Rastreamento de Mangueiras Hidráulicas).',
            portfolio: 'Portfólio: EduDesk (SaaS), H365 (SaaS), SwiftPOS, MicroFin, JacTrac'
        },
        thankYou: {
            title: 'Obrigado',
            message: 'Agradecemos seu tempo e consideração.',
            contact: 'pita.domingos@zd044.onmicrosoft.com',
            phone: '+258 845479481'
        },
        letter: {
            recipient: 'Para: A Equipe de Gestão',
            role: 'Operações de Mineração Vulcan',
            company: 'Tete, Moçambique',
            subject: 'Assunto: Proposta para Implementação de Sistema Digital de Gestão de Segurança',
            salutation: 'Prezada Equipe de Gestão,',
            intro: 'Temos o prazer de enviar esta proposta para o desenvolvimento e implementação do Gestor CARS. Esta solução digital abrangente foi projetada para otimizar sua gestão de treinamento de Requisitos de Atividade Crítica (RAC), garantindo 100% de visibilidade de conformidade e eficiência operacional.',
            body1: 'Nossa solução aborda os desafios atuais de rastreamento manual, dados fragmentados e relatórios atrasados. Ao centralizar dados de funcionários, registros de treinamento e emissão de credenciais digitais, visamos reduzir significativamente a sobrecarga administrativa e melhorar os padrões de segurança do local.',
            body2: 'O sistema proposto inclui recursos avançados, como relatórios baseados em IA, painéis em tempo real e controle de acesso seguro baseado em função, adaptados especificamente para o contexto do ambiente de mineração.',
            closing: 'Aguardamos a oportunidade de fazer parceria com a Vulcan Mining nesta iniciativa crítica de segurança.',
            signoff: 'Atenciosamente,',
            team: 'Equipe DigiSols'
        },
        execSummary: {
            title: '1. Resumo Executivo',
            text: 'O Gestor CARS é uma plataforma web personalizada projetada para digitalizar o processo de ponta a ponta da gestão de treinamento de segurança. Desde o agendamento de sessões até a avaliação de resultados e emissão de cartões de identificação, o sistema fornece uma única fonte de verdade para conformidade HSE. Ele substitui planilhas manuais e registros em papel por uma base de dados segura e automatizada acessível por Administradores do Sistema, Instrutores RAC e Líderes de Departamento.',
            quote: '"Segurança não é apenas uma prioridade, it é um valor fundamental. Nossas ferramentas digitais devem refletir o mesmo padrão de excelência de nosso maquinário operacional."'
        },
        objectives: {
            title: '2. Objetivos do Projeto',
            problemTitle: 'Problema Atual',
            problemText: 'A dependência de planilhas manuais leva à inconsistência de dados, dificuldade em rastrear certificações expirando e atrasos na emissão de cartões físicos. Não há visibilidade em tempo real da prontidão da força de trabalho.',
            solutionTitle: 'Nossa Solução',
            goals: [
                'Base de Dados Centralizada para 15.000+ Funcionários',
                'Notificações Automatizadas de Expiração',
                'Emissão de Cartões Digitais e Físicos',
                'Controle de Acesso Baseado em Função (RBAC)',
                'Análise de Segurança Impulsionada por IA'
            ]
        },
        organogram: {
            title: '3. Organograma do Projeto',
            pm: 'Gerente de Projeto',
            delivery: 'Líder de Entrega',
            tech1: 'Técnico 1',
            tech2: 'Técnico 2',
            regime: 'Regime Local',
            days: '20 dias on / 10 off',
            pmRole: 'Responsável pela entrega geral, gestão de stakeholders e levantamento de requisitos. Garante que o projeto permaneça no prazo e dentro do orçamento.',
            techRole: 'Responsável pelo desenvolvimento full-stack, otimização de banco de dados e implantação no local. Trabalhará em uma escala rotativa para garantir suporte contínuo.'
        },
        roles: {
            title: '4. Funções e Permissões de Usuário',
            sysAdmin: { title: 'Admin do Sistema', desc: 'Acesso total a todas as configurações, gestão de usuários e configuração.' },
            racAdmin: { title: 'Admin RAC', desc: 'Gerencia cronogramas de treinamento, aprova resultados e supervisiona a conformidade.' },
            deptAdmin: { title: 'Admin de Dept', desc: 'Acesso somente leitura para seu departamento. Pode solicitar cartões para sua equipe.' },
            racTrainer: { title: 'Instrutor RAC', desc: 'Pode ver apenas sessões atribuídas e inserir notas/presença.' },
            user: { title: 'Usuário Geral', desc: 'Pode ver seu próprio status e solicitar substituição de cartão.' }
        },
        timeline: {
            title: '5. Cronograma de Implementação',
            intro: 'O projeto será entregue em 4 fases ao longo de um período de 12 semanas.',
            phase1: 'Fase 1: Descoberta e Design (Semanas 1-2)',
            phase1desc: 'Levantamento de requisitos, prototipagem de UI/UX e design do esquema do banco de dados.',
            phase2: 'Fase 2: Desenvolvimento Central (Semanas 3-8)',
            phase2desc: 'Desenvolvimento do Módulo de Agendamento, Base de Dados e Sistema de Avaliação.',
            phase3: 'Fase 3: Testes e QA (Semanas 9-10)',
            phase3desc: 'Teste de Aceitação do Usuário (UAT), correção de bugs e teste de carga.',
            phase4: 'Fase 4: Implantação e Treinamento (Semanas 11-12)',
            phase4desc: 'Implantação em produção, sessões de treinamento para administradores e entrega.'
        },
        techStack: {
            title: '6. Stack Técnico',
            frontendTitle: 'Frontend',
            frontend: 'React (TypeScript), Tailwind CSS, Lucide Icons',
            backendTitle: 'Lógica Backend',
            backend: 'Node.js (Simulado no Navegador para Protótipo), Arquitetura RESTful',
            databaseTitle: 'Base de Dados',
            database: 'PostgreSQL / SQL Server (Pronto para Produção)',
            securityTitle: 'Segurança',
            security: 'Autenticação JWT, Controle de Acesso Baseado em Função, Criptografia de Dados'
        },
        financials: {
            title: '7. Investimento Financeiro',
            item: 'Descrição do Item',
            type: 'Tipo',
            cost: 'Custo (USD)',
            total: 'Investimento Inicial Total (Itens 1 + 2)',
            items: [
                { name: 'Desenvolvimento e Personalização de Software', type: 'Único', cost: '$15,000.00' },
                { name: 'Configuração de Infraestrutura em Nuvem e Migração de Dados', type: 'Único', cost: '$2,500.00' },
                { name: 'Assinatura de Camada em Nuvem, Manutenção e Taxas de Gestão', type: 'Mensal', cost: '$10,000.00' },
                { name: 'Desenvolvimento de Novos Recursos', type: 'Sob Demanda', cost: '$3,500.00' },
                { name: 'Atualizações de Segurança Sazonais', type: 'Sazonal', cost: '$0.00' }
            ]
        },
        roadmap: {
            title: '8. Roteiro Futuro',
            intro: 'Além do lançamento inicial, propomos as seguintes melhorias:',
            auth: 'Integração SSO',
            authDesc: 'Conectar com Azure AD para Login Único.',
            db: 'Migração para Nuvem',
            dbDesc: 'Mover de local para Azure/AWS para escalabilidade.',
            email: 'Emails Automatizados',
            emailDesc: 'Enviar certificados em PDF diretamente para o email do funcionário.',
            hosting: 'App Móvel',
            hostingDesc: 'App nativo Android/iOS para verificação em campo.'
        },
        aiFeatures: {
            title: '9. IA e Recursos Inteligentes',
            intro: 'Aproveitando o Google Gemini AI para inteligência de segurança.',
            advisor: 'Chatbot Consultor de Segurança',
            advisorDesc: 'Um assistente de IA incorporado que responde a perguntas sobre padrões RAC e protocolos de segurança em linguagem natural.',
            analysis: 'Relatórios Automatizados',
            analysisDesc: 'IA analisa tendências mensais para identificar departamentos de alto risco e sugerir intervenções de treinamento direcionadas.'
        },
        futureUpdates: {
            title: '10. Escopo de Integração de Álcool e IoT',
            softwareScope: {
                title: 'Módulo A: Integração de Software',
                desc: 'Atualizações neste aplicativo web para suportar ingestão de dados e relatórios.',
                feat1: 'Endpoints de API para Dados de Bafômetro',
                feat2: 'Novo Widget de Painel "Aptidão para o Trabalho"',
                feat3: 'Lógica para bloquear emissão de cartão se flag de álcool estiver ativo'
            },
            infraScope: {
                title: 'Módulo B: Infraestrutura (Projeto Independente)',
                desc: 'Instalação física e hardware necessários no portão principal. Tratado como um contrato separado.',
                feat1: 'Obras Civis (Modificação de Torniquete)',
                feat2: 'Elétrica e Cabeamento (Cat6/Energia)',
                feat3: 'Aquisição de Hardware de Bafômetro com Face-ID'
            }
        },
        enhancedCaps: {
            title: '11. Capacidades Operacionais Aprimoradas',
            intro: 'Além dos módulos principais de treinamento, o sistema agora inclui ferramentas operacionais avançadas projetadas para verificação de conformidade em tempo real e automação administrativa.',
            mobileVerify: {
                title: 'Verificação Móvel (Passaporte Digital)',
                desc: 'Oficiais de segurança de campo agora podem verificar a conformidade dos funcionários instantaneamente escaneando o código QR no cartão de segurança usando qualquer smartphone. O sistema retorna uma página de "Passaporte Digital" segura e em tempo real.',
                features: ['Verificação de Status em Tempo Real (Consulta ao BD)', 'Indicador Visual de Conformidade (Tique Verde / Cruz Vermelha)', 'Exibe Validade de ASO e Carta de Condução']
            },
            autoBooking: {
                title: 'Auto-Agendamento Inteligente',
                desc: 'Para evitar lacunas de conformidade, o sistema monitora proativamente as datas de expiração do treinamento. Quando uma certificação está a 7 dias de expirar, o sistema agenda automaticamente uma vaga na próxima sessão de treinamento disponível.',
                features: ['Agendamento automatizado com base na expiração (<7 dias)', 'Fluxo de Aprovação do Admin RAC', 'Evita tempo de inatividade operacional devido a credenciais expiradas']
            },
            massData: {
                title: 'Gestão de Dados em Massa',
                desc: 'Lide eficientemente com grandes conjuntos de dados de força de trabalho com recursos de importação/exportação em massa via CSV.',
                features: ['Registro de Funcionários em Massa', 'Migração de Dados Históricos', 'Correspondência Automatizada de Registros']
            },
            auditLogs: {
                title: 'Trilhas de Auditoria do Sistema',
                desc: 'Registro abrangente de todas as atividades do sistema garante responsabilidade e segurança.',
                features: ['Rastreamento de Ação do Usuário', 'Monitoramento de Eventos de Segurança', 'Logs de Alteração com Carimbo de Tempo']
            },
            smartBatching: {
                title: 'Processamento em Lote Inteligente',
                desc: 'Para lidar com locais de grande volume, o sistema inclui um processador de lote dedicado. Ele agrupa certificações expirando por tipo de treinamento (RAC) e cria uma fila de agendamento sequencial e guiada.',
                features: ['Fila de Renovação Sequencial', 'Construtor Visual de Lotes de Cartões', 'Alocação de Sessão sem Conflitos']
            },
            matrixCompliance: {
                title: 'Motor de Agendamento Bloqueado por Matriz',
                desc: 'Para garantir conformidade absoluta, o motor de agendamento é travado na Matriz da Base de Dados. Administradores e Usuários não podem ignorar os requisitos de segurança — agendamentos só são permitidos se o RAC específico for marcado como obrigatório.',
                features: ['Previne treinamento não autorizado', 'Impõe matriz de segurança baseada em função', 'Reduz desperdício de treinamento']
            },
            selfService: {
                title: 'Portal de Autoatendimento do Funcionário',
                desc: 'Capacita os funcionários a gerenciar sua própria conformidade. O pessoal pode fazer login para visualizar seu status, verificar lacunas de requisitos e baixar seu passaporte digital, reduzindo significativamente as consultas administrativas.',
                features: ['Painel de Conformidade Pessoal', 'Download de Cartão Digital', 'Análise de Lacunas de Requisitos']
            }
        },
        conclusion: {
            title: '12. Conclusão',
            text: 'O Gestor de RACS representa um passo significativo para a excelência em segurança operacional. Ao digitalizar esses fluxos de trabalho críticos, a Vulcan Mining não apenas garantirá a conformidade, mas também promoverá uma cultura de transparência e eficiência. Estamos comprometidos em entregar uma solução de classe mundial que atenda aos seus rigorosos padrões.'
        }
    },
    ai: { systemPromptAdvice: 'Você é um especialista em segurança...', systemPromptReport: 'Analise...' }
  }
};
