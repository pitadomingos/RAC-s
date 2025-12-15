
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
      feedbackAdmin: 'Feedback Manager'
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
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start', endDate: 'End' }, periods: { weekly: 'Semanal', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, generate: 'Generate AI', analyzing: 'Analyzing...', stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, charts: { performance: 'Performance' }, executiveAnalysis: 'Executive AI Analysis', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prac' } },
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
    proposal: {
      title: 'Our Proposed Solution',
      header: 'Technical Proposal',
      hardware: 'Hardware',
      software: 'Software',
      security: 'Security',
      faceCap: 'Face Capture: Verify identity during breath test.',
      integration: 'Direct API Integration: Bypass OEM cloud for real-time data.',
      projectScope: 'Project Scope: Requires separate contract for hardware installation.',
      digitalTrans: 'Enterprise SaaS Platform',
      aboutMe: {
        title: 'About DigiSols',
        name: 'Pita Domingos',
        preferred: 'Lead Architect',
        role: 'Full Stack Developer',
        cert: 'Certified Solutions Architect',
        bio: 'DigiSols specializes in enterprise-grade safety systems and digital transformation for the mining sector. Focused on zero-downtime compliance architectures and scalable SaaS solutions.'
      },
      letter: {
        date: "12/11/2025",
        to: "The Management Team\nVulcan Mining Operations\nTete, Mozambique",
        subject: "Proposal for Implementation of Digital Safety Management System",
        greeting: "Dear Management Team,",
        body1: "We are pleased to submit this proposal for the development and implementation of the Vulcan Safety Manager (CARS Manager). This comprehensive digital solution is designed to optimize the management of Critical Activity Requirements (RAC) training, ensuring 100% compliance visibility and operational efficiency.",
        body2: "Our solution addresses the current challenges of manual tracking, fragmented data, and delayed reporting. By centralizing employee data, training records, and digital credential issuance, we aim to significantly reduce administrative overhead and improve site safety standards.",
        body3: "The proposed system includes advanced features such as AI-driven reporting, real-time dashboards, and secure role-based access control, specifically tailored for the mining environment context.",
        closing: "We look forward to the opportunity to partner with Vulcan Mining on this critical safety initiative.",
        signOff: "Sincerely,\nDigiSols Team\nPITA DOMINGOS",
        address: "Near O Puarrou - Bairro Chingodzi, Tete"
      },
      execSummary: {
        title: 'Executive Summary',
        text: 'The CARS Manager is a specialized web application meticulously designed to revolutionize the safety training lifecycle for Critical Activity Requirements (RAC 01 - RAC 10). This innovative system directly addresses the inefficiencies inherent in traditional manual processes, such as disparate spreadsheets and fragmented communication channels. By consolidating these into a centralized digital platform, CARS Manager provides a comprehensive solution for managing every aspect of safety training—from initial scheduling and rigorous result tracking to the seamless issuance of certifications (CARs) and continuous compliance monitoring. This integrated approach ensures that all critical safety training data is easily accessible, accurate, and up-to-date, thereby significantly enhancing operational safety and regulatory adherence. The system\'s design prioritizes user experience while delivering robust functionality, making it an indispensable tool for organizations committed to maintaining the highest standards of workplace safety.',
        quote: '"Safety is not just a priority, it is a core value. Our digital tools must reflect the same standard of excellence as our operational machinery."'
      },
      objectives: {
        title: 'Core Objectives',
        problemTitle: 'Key Goals',
        problemText: 'The CARS Manager is driven by a set of clearly defined core objectives, each meticulously designed to transform and elevate the safety training management process. The primary goal is Digitalization, aiming to completely eliminate reliance on paper-based scheduling systems and manual card issuance. This transition to a fully digital workflow not only enhances efficiency but also significantly reduces human error.',
        solutionTitle: 'Benefits',
        goals: [
          'Digitalization: Eliminate paper scheduling and manual cards.',
          'Compliance: 100% visibility on validity/expiry.',
          'Role-Based Security: Segregation of duties (Admin/Trainer/Viewer).',
          'Efficiency: 90% reduction in admin time for card generation.'
        ]
      },
      organogram: {
        title: 'Project Organogram',
        pm: 'Project Manager',
        delivery: 'Service Delivery',
        tech1: 'Frontend Engineer',
        tech2: 'Backend Engineer',
        regime: 'Hybrid Regime'
      },
      timeline: {
        title: '11-Week Implementation Plan',
        phase1: 'Phase 1: Discovery & Prototype (Weeks 1-2)',
        phase1desc: 'Comprehensive requirement gathering, review of existing high-fidelity prototype with stakeholders, and finalizing database schema.',
        phase2: 'Phase 2: Core Development (Weeks 3-6)',
        phase2desc: 'Implementation of critical functionalities: Role-Based Access Control (RBAC), Scheduling Logic, and Trainer Input modules.',
        phase3: 'Phase 3: Advanced Features (Weeks 7-8)',
        phase3desc: 'PDF Card Generation, Automated Email Notifications, and Reporting/KPI Dashboards.',
        phase4: 'Phase 4: UAT & Deployment (Weeks 9-10)',
        phase4desc: 'User Acceptance Testing (UAT) by end-users, bug fixing, and production deployment.',
        phase5: 'Phase 5: Training & Handover (Week 11)',
        phase5desc: 'Staff training sessions tailored for all user roles and distribution of comprehensive User Manuals.'
      },
      techStack: {
        title: 'Technical Architecture',
        frontendTitle: 'Frontend Application',
        frontend: 'Built on React.js (JavaScript library) with Tailwind CSS for utility-first styling. Features Client-Side PDF Generation for instant cards.',
        backendTitle: 'Backend & Database',
        backend: 'Serverless Cloud Architecture (Node.js Functions) for event-driven processing and cost efficiency.',
        databaseTitle: 'Data Persistence',
        database: 'Real-time NoSQL Database for high performance, low latency, and efficient handling of large datasets.',
        securityTitle: 'Infrastructure & Security',
        security: 'Global CDN for low-latency access. Secure Authentication (Email/SSO) and granular Role-Based Access Control (RBAC).'
      },
      financials: {
        title: 'Financial Investment',
        items: [
          { name: 'Software Architecture & Development', type: 'One-Time', cost: '$20,000.00' },
          { name: 'UI/UX Design & Prototyping', type: 'One-Time', cost: '$8,000.00' },
          { name: 'Cloud Infrastructure Setup & Subscription', type: 'Monthly', cost: '$5,000.00' },
          { name: 'Training & Documentation', type: 'One-Time', cost: '$10,000.00' },
          { name: 'Maintenance/Support & Management Fee', type: 'Monthly', cost: '$15,000.00' }
        ]
      },
      roadmap: {
        title: 'Future Roadmap',
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
        title: 'AI & Smart Features',
        chatbot: 'Safety Advisor Chatbot: Embedded AI assistant for queries on RAC standards.',
        reporting: 'Automated Reporting: AI analyzes monthly trends to identify high-risk departments.'
      },
      futureUpdates: {
        title: 'Alcohol & IoT Integration Scope',
        moduleA: 'Module A: Software Integration - API Endpoints for Breathalyzer Data, "Fitness for Duty" Dashboard Widget, Logic to block card issuance.',
        moduleB: 'Module B: Infrastructure (Independent Project) - Civil Works (Turnstiles), Cabling, Breathalyzer Hardware with Face-ID.'
      },
      enhancedCaps: {
        title: 'Enhanced Operational Capabilities',
        mobileVerify: { title: 'Mobile Verification (Digital Passport)', desc: 'Field security officers can verify employee compliance instantly by scanning the QR code on the safety card using any smartphone. Returns secure "Digital Passport" in real-time.' },
        autoBooking: { title: 'Intelligent Auto-Booking', desc: 'System proactively monitors expiration dates. When a certification is < 7 days from expiring, the system automatically schedules a slot. Includes Admin Approval Flow.' },
        massData: { title: 'Mass Data Management', desc: 'Efficiently handle large workforce datasets with bulk CSV import/export capabilities. Includes Automatic Record Matching.' },
        auditLogs: { title: 'System Audit Trails', desc: 'Comprehensive logging of all system activities ensures accountability and security. Includes Timestamped Change Logs.' },
        smartBatching: { title: 'SaaS Scalability', desc: 'Multi-tenant architecture allows managing multiple client companies and sites from a single dashboard.' },
        matrixCompliance: { title: 'Site Governance', desc: 'Define and enforce mandatory training policies specific to each operational site.' }
      },
      conclusion: {
        title: 'Conclusion',
        text: 'The Vulcan Safety Manager represents a significant step towards operational safety excellence. By digitizing these critical workflows, Vulcan Mining will not only ensure compliance but also foster a culture of transparency and efficiency. We are committed to delivering a world-class solution that meets your rigorous standards.'
      },
      thankYou: {
        title: 'Contact Us',
        contact: 'pita.domingos@zd044.onmicrosoft.com',
        phone: '+258 84 547 9481'
      }
    },
    alcohol: {
        banner: {
            title: 'IoT Alcohol Control',
            desc: 'Real-time integration with industrial breathalyzer hardware and turnstile access control systems.',
            status: 'Roadmap v3.0'
        },
        features: {
            title: 'Core Capabilities',
            iotTitle: 'IoT Connectivity',
            iotDesc: 'Direct MQTT communication with AlcoCheck breathalyzer devices.',
            accessTitle: 'Access Denial',
            accessDesc: 'Positive results (>0.00) trigger immediate site lockout.',
            complianceTitle: 'Data Compliance',
            complianceDesc: 'Encrypted log storage for Legal & HR auditing.'
        },
        protocol: {
            title: 'Security Protocol',
            positiveTitle: 'Positive Detected',
            positiveDesc: 'If alcohol level exceeds 0.00%, the turnstile locks and card access is suspended.',
            resetTitle: 'Auto-Reset',
            resetDesc: 'Access remains revoked until 02:00 AM the next day or manual Admin override.'
        },
        challenges: {
            title: 'Challenges & Mitigation',
            oemIssue: 'OEM Cloud Restrictions: Current hardware requires proprietary middleware.',
            gateSetup: 'Physical Gate Setup: Requires dedicated LAN network infrastructure at the gate.'
        },
        proposal: {
            title: 'Our Proposed Solution',
            header: 'Technical Proposal',
            hardware: 'Hardware',
            software: 'Software',
            security: 'Security',
            faceCap: 'Face Capture: Verify identity during breath test.',
            integration: 'Direct API Integration: Bypass OEM cloud for real-time data.',
            projectScope: 'Project Scope: Requires separate contract for hardware installation.'
        },
        dashboard: {
            title: 'IoT Alcohol Control Center',
            subtitle: 'Real-time Turnstile Integration & Automated Reporting',
            live: 'Live Feed',
            viewRoadmap: 'View Project Roadmap',
            backToLive: 'Back to Live Dashboard',
            kpi: {
                total: 'Total Readings',
                violations: 'Violations Detected',
                throughput: 'Gate Throughput',
                health: 'Device Health'
            },
            log: 'Live Access Log',
            throughputChart: 'Hourly Throughput',
            deviceStatus: 'Device Status',
            online: 'ONLINE',
            offline: 'OFFLINE',
            mqtt: 'MQTT Connected',
            table: {
                device: 'Device',
                result: 'Result (BAC)',
                ok: 'OK',
                blocked: 'BLOCKED'
            },
            alert: {
                title: 'Access Denied',
                desc: 'Zero Tolerance Policy Violation',
                measured: 'Measured BAC:'
            },
            actions: 'Automated Actions',
            actionLog: {
                locked: 'Turnstile Locked Immediately',
                generating: 'Generating Incident Report...',
                logged: 'Incident Report Logged to DB',
                contacting: 'Contacting Supervisor...',
                sent: 'SMS Alert Sent to Supervisor (Maputo HQ)'
            },
            close: 'Close Alert',
            simActive: 'Simulation Active',
            person: 'Person'
        }
    }
  },
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
      feedbackAdmin: 'Gestor de Feedback'
    },
    common: {
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
      of: 'de',
      siteContext: 'Contexto do Site',
      enterpriseView: 'Visão Empresarial (Todos os Sites)'
    },
    feedback: {
        button: 'Enviar Feedback',
        title: 'Compartilhe sua Experiência',
        subtitle: 'Ajude-nos a melhorar o Gestor CARS.',
        typeLabel: 'Tipo de Feedback',
        messageLabel: 'Sua Mensagem',
        msgPlaceholder: 'Descreva o erro, melhoria ou experiência...',
        success: 'Obrigado! Seu feedback foi registrado.',
        adminTitle: 'Registros de Feedback do Usuário',
        adminSubtitle: 'Acompanhe problemas e sugestões reportados por usuários.',
        types: {
            Bug: 'Relatório de Erro',
            Improvement: 'Melhoria',
            General: 'Comentário Geral'
        },
        status: {
            New: 'Novo',
            InProgress: 'Em Progresso',
            Resolved: 'Resolvido',
            Dismissed: 'Dispensado'
        },
        actionable: 'Acionável',
        notActionable: 'Não Acionável',
        markActionable: 'Marcar como Acionável',
        markNotActionable: 'Marcar como Não Acionável'
    },
    verification: {
      title: 'Passaporte Digital de Segurança',
      verified: 'VERIFICADO',
      notVerified: 'NÃO COMPLIANTE',
      notFound: 'REGISTRO NÃO ENCONTRADO',
      employeeDetails: 'Detalhes do Funcionário',
      activeRacs: 'Certificações Ativas',
      asoStatus: 'Médico (ASO)',
      dlStatus: 'Carta de Condução',
      validUntil: 'Válido Até',
      scanTime: 'Verificado às'
    },
    dashboard: {
      title: 'Visão Geral Operacional',
      subtitle: 'Métricas de treinamento de segurança em tempo real.',
      kpi: {
        adherence: 'Aderência HSE',
        certifications: 'Total de Certificações',
        pending: 'Avaliação Pendente',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade de Treinamento por RAC & ASO',
        complianceSubtitle: 'Mostra status obrigatório. Verde = Válido. Vermelho = Faltante/Expirado.',
        accessTitle: 'Status Geral de Acesso da Força de Trabalho',
        compliant: 'Conforme',
        missing: 'Faltante / Expirado',
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
        tableRac: 'RAC Agendada',
        tableDate: 'Data',
        tableRoom: 'Sala',
        tableTrainer: 'Formador',
        noData: 'Nenhum agendamento corresponde aos filtros'
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
    enterprise: {
        title: 'Centro de Comando Corporativo',
        subtitle: 'Visão Geral Global de Conformidade de Segurança',
        globalHealth: 'Pontuação Global de Saúde',
        totalWorkforce: 'Força de Trabalho Total',
        topPerformer: 'Melhor Desempenho',
        needsAttention: 'Precisa de Atenção',
        siteComparison: 'Comparação de Desempenho do Site',
        operationsOverview: 'Visão Geral das Operações',
        siteName: 'Nome do Site',
        staff: 'Equipe',
        governanceTitle: 'Governança do Site',
        governanceSubtitle: 'Definir políticas de treinamento de segurança obrigatórias por local.',
        pushPolicy: 'Salvar e Aplicar Política',
        policyApplied: 'Política Aplicada'
    },
    database: {
      title: 'Base de Dados Mestra de Funcionários',
      subtitle: 'Gerenciar requisitos. RAC 02 é desativado automaticamente se a Carta estiver expirada.',
      filters: 'Filtros',
      accessStatus: 'Status de Acesso',
      granted: 'Concedido',
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
        subtitle: 'Atualizar detalhes. Mudar a Empresa/Depto manterá o histórico de treinamento sob a nova entidade.',
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
      manageSchedule: 'Gerenciar Cronograma',
      dlRequired: 'Detalhes da Carta de Condução obrigatórios para RAC 02',
      success: 'Agendamento enviado com sucesso!',
      selectSession: 'Selecionar Sessão de Treinamento',
      chooseSession: 'Escolha uma sessão...',
      table: {
        no: 'Nº',
        nameId: 'Nome / ID',
        details: 'Empresa / Depto',
        dlNoClass: 'Nº Carta / Classe',
        dlExpiry: 'Validade Carta',
        action: 'Ação'
      },
      addRow: 'Adicionar Linha',
      submitBooking: 'Enviar Agendamento'
    },
    notifications: {
        expiryTitle: 'Treinamento Expirando',
        expiryMsg: 'O treinamento de {name} ({rac}) expira em {days} dias.',
        autoBookTitle: 'Auto-Agendamento Criado',
        autoBookMsg: '{name} foi auto-agendado para {rac} em {date} (expira em {days} dias).',
        autoBookFailTitle: 'Falha no Auto-Agendamento',
        autoBookFailMsg: 'Não foi possível auto-agendar {name} para {rac}. Nenhuma sessão disponível encontrada.',
        capacityTitle: 'Sessão Cheia - Alocação Automática',
        capacityMsg: 'funcionários foram movidos para a próxima sessão disponível em',
        demandTitle: 'Alerta de Alta Demanda',
        demandMsg: 'Alta demanda detectada para',
        duplicateTitle: 'Agendamento Duplicado',
        duplicateMsg: 'Usuário já agendado para este tipo de treinamento.'
    },
    ai: {
        systemPromptAdvice: "Você é um Consultor de Segurança especialista para a Mineração Vulcan. Você se especializa nas Regras Críticas de Segurança (RACs). Responda à pergunta do usuário sobre {rac}. Forneça conselhos concisos e acionáveis. Mantenha menos de 100 palavras. Idioma: {language}.",
        systemPromptReport: "Você é um Analista de Dados HSE. Analise as seguintes estatísticas de treinamento para o período {language}. Destaque as principais tendências, riscos e recomendações. Mantenha executivo e conciso."
    },
    advisor: { button: 'Consultor de Segurança', title: 'Consultor IA CARS', sender: 'Consultor CARS', emptyState: 'Como posso ajudar?', placeholder: 'Pergunte sobre padrões RAC...' },
    results: { title: 'Registros de Treinamento', subtitle: 'Ver resultados.', searchPlaceholder: 'Pesquisar...', table: { employee: 'Funcionário', session: 'Sessão', date: 'Data', trainer: 'Formador', room: 'Sala', dlRac02: 'Carta (RAC 02)', theory: 'Teoria', prac: 'Prática', status: 'Estado', expiry: 'Validade' } },
    cards: { 
        title: 'Cartões de Segurança', 
        showing: 'Mostrando', 
        subtitle: 'Selecione funcionários.', 
        goToPrint: 'Ir para Impressão', 
        selected: 'Selecionado', 
        successTitle: 'Solicitação Enviada', 
        successMsg: 'Solicitação de cartão encaminhada.', 
        noRecords: 'Nenhum Registro Elegível', 
        noRecordsSub: 'Apenas registros aprovados aparecem aqui.', 
        selectAll: 'Selecionar Tudo', 
        sending: 'Enviando...', 
        requestButton: 'Solicitar Cartões', 
        validation: { ineligible: 'Funcionário inelegível.', maxSelection: 'Máx 8 cartões.', incomplete: 'Incompleto' },
        eligibility: {
            failedTitle: 'Falha na Verificação de Elegibilidade',
            failedMsg: 'Você não atende atualmente aos requisitos para um cartão de segurança. Certifique-se de que seu ASO é válido e que você passou em todos os treinamentos necessários.',
            checkReqs: 'Verificar Requisitos'
        }
    },
    trainer: { title: 'Área do Formador', subtitle: 'Inserir notas.', passMark: 'Aprovação: 70%', loggedInAs: 'Logado como', selectSession: 'Selecionar Sessão', noSessions: 'Nenhuma sessão.', chooseSession: 'Escolha a sessão...', dlWarning: 'Verificar Carta para RAC 02.', saveResults: 'Salvar Resultados', table: { employee: 'Funcionário', attendance: 'Presente', dlCheck: 'Verif. Carta', verified: 'Verificado', theory: 'Teoria', practical: 'Prática', rac02Only: '(RAC 02)', status: 'Estado' } },
    users: { title: 'Gestão de Usuários', subtitle: 'Gerenciar acesso.', addUser: 'Adicionar Usuário', table: { user: 'Usuário', role: 'Função', status: 'Estado', actions: 'Ações' }, modal: { title: 'Adicionar Usuário', name: 'Nome', email: 'Email', createUser: 'Criar' } },
    schedule: { title: 'Cronograma de Treinamento', subtitle: 'Gerenciar sessões.', newSession: 'Nova Sessão', table: { date: 'Data/Hora', rac: 'RAC', room: 'Local', trainer: 'Instrutor' }, modal: { title: 'Agendar', racType: 'RAC', date: 'Data', startTime: 'Início', location: 'Local', capacity: 'Cap', instructor: 'Instr', saveSession: 'Salvar Sessão', language: 'Idioma', english: 'Inglês', portuguese: 'Português' } },
    settings: { title: 'Configurações', subtitle: 'Config.', saveAll: 'Salvar Tudo', saving: 'Salvando...', tabs: { general: 'Geral', trainers: 'Formadores', racs: 'RACs', sites: 'Sites', companies: 'Empresas' }, rooms: { title: 'Salas', name: 'Nome', capacity: 'Cap', new: 'Nova Sala' }, trainers: { title: 'Formadores', name: 'Nome', qualifiedRacs: 'RACs', new: 'Novo Formador' }, racs: { title: 'RACs', code: 'Código', description: 'Desc', new: 'Nova RAC' } },
    reports: { title: 'Relatórios', subtitle: 'Análises.', printReport: 'Imprimir', filters: { period: 'Período', department: 'Depto', racType: 'RAC', startDate: 'Início', endDate: 'Fim' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'YTD', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva IA', trainerMetrics: { title: 'Métricas do Formador', name: 'Formador', sessions: 'Sessões', passRate: 'Taxa Aprov.', avgTheory: 'Teoria', avgPrac: 'Prática' } },
    logs: { title: 'Logs do Sistema', levels: { all: 'Todos os Níveis', info: 'Info', warn: 'Aviso', error: 'Erro', audit: 'Auditoria' }, table: { level: 'Nível', timestamp: 'Carimbo de data/hora', user: 'Usuário', message: 'Mensagem' } },
    adminManual: {
      title: 'Manual do Sistema',
      subtitle: 'Guia do Administrador para Configuração e Lógica do Sistema',
      slides: {
        intro: 'Introdução',
        objectives: 'Objetivos e Escopo',
        logic: 'Lógica de Conformidade',
        workflow: 'Fluxo de Dados Principal',
        config: 'Configuração do Sistema',
        booking: 'Regras de Agendamento',
        advanced: 'Capacidades Avançadas',
        troubleshoot: 'Solução de Problemas',
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
          p1Desc: 'Planilhas fragmentadas levam a lacunas de conformidade e registros perdidos.',
          p2Title: 'Tempo de Conformidade',
          p2Desc: 'O rastreamento manual falha em detectar expirações antes que ocorra o bloqueio do site.',
          p3Title: 'Carga Administrativa',
          p3Desc: 'As equipes de HSE gastam 40% do tempo cruzando listas manualmente.',
          s1Title: 'Verdade Central',
          s1Desc: 'Banco de dados imutável único para todos os dados de treinamento, saúde e operacionais.',
          s2Title: 'Auto-Aplicação',
          s2Desc: 'Porta lógica bloqueia automaticamente o acesso se qualquer requisito expirar.',
          s3Title: 'Eficiência',
          s3Desc: 'Tempo administrativo reduzido em 85% via processamento em lote e auto-agendamento.'
        },
        formulaTitle: 'A Fórmula de Conformidade',
        formulaLogic: {
          active: 'Status Ativo',
          aso: 'ASO Válido',
          racs: 'RACs Necessárias',
          result: 'ACESSO CONCEDIDO'
        },
        flowTitle: 'Fluxo de Dados Principal',
        flowSteps: {
          db: 'Banco de Dados',
          dbDesc: 'Definir Requisitos do Funcionário',
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
          racsDesc: 'Defina os módulos (ex: RAC 01, PTS). Aviso: Excluir uma RAC aqui remove a coluna da matriz do banco de dados.',
          rooms: 'Salas e Capacidade',
          roomsDesc: 'Defina limites físicos para salas de aula para evitar overbooking durante a fase de agendamento.',
          trainers: 'Formadores e Aut',
          trainersDesc: 'Registre instrutores e autorize-os para módulos específicos. Apenas formadores autorizados aparecem nos menus suspensos.'
        },
        bookingTitle: 'Regras de Agendamento',
        matrixLock: 'Bloqueio de Matriz',
        matrixDesc: 'O sistema impede o agendamento de treinamentos que não são exigidos pelo perfil do funcionário.',
        gradingTitle: 'Padrões de Avaliação',
        gradingText: 'A nota de aprovação é 70%. A presença é obrigatória. Tentativas falhas exigem re-agendamento.',
        rac02Title: 'Específicos da RAC 02',
        rac02Text: 'Requer verificação da Carta de Condução. Se a Carta estiver expirada, o sistema reprova automaticamente o aluno.',
        expiryTitle: 'Auto-Expiração',
        expiryText: 'Certificações são válidas por 2 anos. O re-treinamento é sinalizado 30 dias antes.',
        advancedTitle: 'Capacidades Avançadas',
        autoBook: 'Motor de Auto-Agendamento',
        autoBookDesc: 'O sistema detecta funcionários expirando em < 7 dias e auto-reserva a próxima vaga disponível para evitar bloqueio.',
        aiRep: 'Relatórios IA',
        aiRepDesc: 'Gera resumos executivos usando Gemini 1.5 Pro para identificar departamentos de alto risco.',
        alc: 'Controle de Álcool',
        alcDesc: 'Roteiro de integração IoT para intertravamento de bafômetro com catracas.',
        tsTitle: 'Solução de Problemas',
        ts1: 'Pesquisa Não Encontrada?',
        ts1Desc: 'Certifique-se de que o ID do Funcionário corresponda exatamente à importação do CSV.',
        ts2: 'Status Bloqueado?',
        ts2Desc: 'Verifique a data do ASO (Médico). ASO expirado bloqueia o acesso independentemente do treinamento.',
        ts3: 'Erro de Scan QR?',
        ts3Desc: 'Verifique se o dispositivo tem acesso à internet para consultar o banco de dados ao vivo.',
        hierarchy: {
            title: 'Organograma do Sistema e Faturamento',
            billingTitle: 'Modelo de Faturamento SaaS',
            billingDesc: 'A plataforma usa uma estrutura de faturamento baseada em funções. Assentos administrativos são gratuitos. Cobranças aplicam-se apenas aos usuários finais rastreados no sistema.',
            cost: '$2.00',
            perUser: 'por Usuário Geral / Mês',
            roles: {
                sysAdmin: 'Admin do Sistema (Dono SaaS)',
                entAdmin: 'Admin Empresarial (Sede Cliente)',
                siteAdmin: 'Admin do Site (Gerente Local)',
                ops: 'Admins Operacionais (RAC/Depto/Formadores)',
                user: 'Usuário Geral (Faturável)'
            }
        }
      }
    },
    proposal: {
      title: 'Nossa Solução Proposta',
      header: 'Proposta Técnica',
      hardware: 'Hardware',
      software: 'Software',
      security: 'Segurança',
      faceCap: 'Captura Facial: Verificar identidade durante o teste de sopro.',
      integration: 'Integração via API Direta: Ignorar nuvem OEM para dados em tempo real.',
      projectScope: 'Escopo do Projeto: Requer contrato separado para instalação de hardware.',
      digitalTrans: 'Plataforma SaaS Empresarial',
      aboutMe: {
        title: 'Sobre a DigiSols',
        name: 'Pita Domingos',
        preferred: 'Arquiteto Líder',
        role: 'Desenvolvedor Full Stack',
        cert: 'Arquiteto de Soluções Certificado',
        bio: 'A DigiSols é especializada em sistemas de segurança de nível empresarial e transformação digital para o setor de mineração. Focada em arquiteturas de conformidade sem tempo de inatividade e soluções SaaS escaláveis.'
      },
      letter: {
        date: "12/11/2025",
        to: "A Equipe de Gestão\nOperações de Mineração Vulcan\nTete, Moçambique",
        subject: "Proposta para Implementação do Sistema de Gestão de Segurança Digital",
        greeting: "Prezada Equipe de Gestão,",
        body1: "Temos o prazer de submeter esta proposta para o desenvolvimento e implementação do Gestor de Segurança Vulcan (Gestor de RACS). Esta solução digital abrangente foi projetada para otimizar a gestão de treinamentos de Requisitos de Atividade Crítica (RAC), garantindo 100% de visibilidade de conformidade e eficiência operacional.",
        body2: "Nossa solução aborda os desafios atuais de rastreamento manual, dados fragmentados e relatórios atrasados. Ao centralizar dados de funcionários, registros de treinamento e emissão de credenciais digitais, visamos reduzir significativamente a sobrecarga administrativa e melhorar os padrões de segurança do local.",
        body3: "O sistema proposto inclui recursos avançados como relatórios impulsionados por IA, painéis em tempo real e controle de acesso seguro baseado em função, adaptados especificamente para o contexto do ambiente de mineração.",
        closing: "Aguardamos a oportunidade de fazer parceria com a Mineração Vulcan nesta iniciativa crítica de segurança.",
        signOff: "Atenciosamente,\nEquipe DigiSols\nPITA DOMINGOS",
        address: "Perto de O Puarrou - Bairro Chingodzi, Tete"
      },
      execSummary: {
        title: 'Resumo Executivo',
        text: 'O Gestor de RACS é uma aplicação web especializada meticulosamente projetada para revolucionar o ciclo de vida do treinamento de segurança para Requisitos de Atividade Crítica (RAC 01 - RAC 10). Este sistema inovador aborda diretamente as ineficiências inerentes aos processos manuais tradicionais, como planilhas díspares e canais de comunicação fragmentados. Ao consolidar isso em uma plataforma digital centralizada, o Gestor de RACS fornece uma solução abrangente para gerenciar todos os aspectos do treinamento de segurança, desde o agendamento inicial e rastreamento rigoroso de resultados até a emissão perfeita de certificações (CARs) e monitoramento contínuo de conformidade. Essa abordagem integrada garante que todos os dados críticos de treinamento de segurança sejam facilmente acessíveis, precisos e atualizados, melhorando significativamente a segurança operacional e a adesão regulatória. O design do sistema prioriza a experiência do usuário enquanto oferece funcionalidade robusta, tornando-o uma ferramenta indispensável para organizações comprometidas em manter os mais altos padrões de segurança no local de trabalho.',
        quote: '"Segurança não é apenas uma prioridade, it é um valor fundamental. Nossas ferramentas digitais devem refletir o mesmo padrão de excelência de nosso maquinário operacional."'
      },
      objectives: {
        title: 'Objetivos Principais',
        problemTitle: 'Metas Chave',
        problemText: 'O Gestor de RACS é impulsionado por um conjunto de objetivos principais claramente definidos, cada um meticulosamente projetado para transformar e elevar o processo de gestão de treinamento de segurança. O objetivo principal é a Digitalização, visando eliminar completamente a dependência de sistemas de agendamento baseados em papel e emissão manual de cartões. Essa transição para um fluxo de trabalho totalmente digital não apenas aumenta a eficiência, mas também reduz significativamente o erro humano.',
        solutionTitle: 'Benefícios',
        goals: [
          'Digitalização: Eliminar agendamento em papel e cartões manuais.',
          'Conformidade: 100% de visibilidade sobre validade/expiração.',
          'Segurança Baseada em Função: Segregação de deveres (Admin/Formador/Visualizador).',
          'Eficiência: Redução de 90% no tempo administrativo para geração de cartões.'
        ]
      },
      organogram: {
        title: 'Organograma do Projeto',
        pm: 'Gerente de Projeto',
        delivery: 'Entrega de Serviço',
        tech1: 'Engenheiro Frontend',
        tech2: 'Engenheiro Backend',
        regime: 'Regime Híbrido'
      },
      timeline: {
        title: 'Plano de Implementação de 11 Semanas',
        phase1: 'Fase 1: Descoberta e Protótipo (Semanas 1-2)',
        phase1desc: 'Levantamento abrangente de requisitos, revisão do protótipo de alta fidelidade existente com as partes interessadas e finalização do esquema do banco de dados.',
        phase2: 'Fase 2: Desenvolvimento Principal (Semanas 3-6)',
        phase2desc: 'Implementação de funcionalidades críticas: Controle de Acesso Baseado em Função (RBAC), Lógica de Agendamento e módulos de Entrada do Formador.',
        phase3: 'Fase 3: Recursos Avançados (Semanas 7-8)',
        phase3desc: 'Geração de Cartão PDF, Notificações por Email Automatizadas e Painéis de Relatórios/KPI.',
        phase4: 'Fase 4: UAT e Implantação (Semanas 9-10)',
        phase4desc: 'Teste de Aceitação do Usuário (UAT) pelos usuários finais, correção de bugs e implantação em produção.',
        phase5: 'Fase 5: Treinamento e Entrega (Semana 11)',
        phase5desc: 'Sessões de treinamento da equipe adaptadas para todas as funções de usuário e distribuição de Manuais do Usuário abrangentes.'
      },
      techStack: {
        title: 'Arquitetura Técnica',
        frontendTitle: 'Aplicação Frontend',
        frontend: 'Construído em React.js (biblioteca JavaScript) com Tailwind CSS para estilo utilitário. Apresenta Geração de PDF no Lado do Cliente para cartões instantâneos.',
        backendTitle: 'Backend e Banco de Dados',
        backend: 'Arquitetura de Nuvem Serverless (Funções Node.js) para processamento orientado a eventos e eficiência de custos.',
        databaseTitle: 'Persistência de Dados',
        database: 'Banco de Dados NoSQL em Tempo Real para alto desempenho, baixa latência e manuseio eficiente de grandes conjuntos de dados.',
        securityTitle: 'Infraestrutura e Segurança',
        security: 'CDN Global para acesso de baixa latência. Autenticação Segura (Email/SSO) e Controle de Acesso Baseado em Função (RBAC) granular.'
      },
      financials: {
        title: 'Investimento Financeiro',
        items: [
          { name: 'Arquitetura de Software e Desenvolvimento', type: 'Único', cost: '$20,000.00' },
          { name: 'Design UI/UX e Prototipagem', type: 'Único', cost: '$8,000.00' },
          { name: 'Configuração e Assinatura da Estrutura de Nuvem', type: 'Mensal', cost: '$5,000.00' },
          { name: 'Treinamento e Documentação', type: 'Único', cost: '$10,000.00' },
          { name: 'Manutenção/Suporte e Taxa de Gestão', type: 'Mensal', cost: '$15,000.00' }
        ]
      },
      roadmap: {
        title: 'Roteiro Futuro',
        auth: 'Integração SSO',
        authDesc: 'Conectar com Azure AD para Single Sign-On.',
        db: 'Migração para Nuvem',
        dbDesc: 'Mover de local para Azure/AWS para escalabilidade.',
        email: 'Emails Automatizados',
        emailDesc: 'Enviar certificados PDF diretamente para o email do funcionário.',
        hosting: 'App Móvel',
        hostingDesc: 'App nativo Android/iOS para verificação em campo.'
      },
      aiFeatures: {
        title: 'IA e Recursos Inteligentes',
        chatbot: 'Chatbot Consultor de Segurança: Assistente de IA incorporado para perguntas sobre padrões RAC.',
        reporting: 'Relatórios Automatizados: A IA analisa tendências mensais para identificar departamentos de alto risco.'
      },
      futureUpdates: {
        title: 'Escopo de Integração de Álcool e IoT',
        moduleA: 'Módulo A: Integração de Software - Endpoints de API para Dados do Bafômetro, Widget de Painel "Aptidão para o Trabalho", Lógica para bloquear emissão de cartão.',
        moduleB: 'Módulo B: Infraestrutura (Projeto Independente) - Obras Civis (Catracas), Cabeamento, Hardware de Bafômetro com Face-ID.'
      },
      enhancedCaps: {
        title: 'Capacidades Operacionais Aprimoradas',
        mobileVerify: { title: 'Verificação Móvel (Passaporte Digital)', desc: 'Oficiais de segurança de campo podem verificar a conformidade do funcionário instantaneamente escaneando o código QR no cartão de segurança usando qualquer smartphone. Retorna "Passaporte Digital" seguro em tempo real.' },
        autoBooking: { title: 'Auto-Agendamento Inteligente', desc: 'O sistema monitora proativamente as datas de expiração. Quando uma certificação está a < 7 dias de expirar, o sistema agenda automaticamente uma vaga. Inclui Fluxo de Aprovação de Admin.' },
        massData: { title: 'Gestão de Dados em Massa', desc: 'Lide eficientemente com grandes conjuntos de dados da força de trabalho com recursos de importação/exportação em massa via CSV. Inclui Correspondência Automática de Registros.' },
        auditLogs: { title: 'Trilhas de Auditoria do Sistema', desc: 'Registro abrangente de todas as atividades do sistema garante responsabilidade e segurança. Inclui Logs de Alteração com Carimbo de Data/Hora.' },
        smartBatching: { title: 'Escalabilidade SaaS', desc: 'A arquitetura multi-tenant permite gerenciar várias empresas clientes e sites a partir de um único painel.' },
        matrixCompliance: { title: 'Governança do Site', desc: 'Definir e aplicar políticas de treinamento obrigatórias específicas para cada site operacional.' }
      },
      conclusion: {
        title: 'Conclusão',
        text: 'O Gestor de Segurança Vulcan representa um passo significativo para a excelência em segurança operacional. Ao digitalizar esses fluxos de trabalho críticos, a Mineração Vulcan não apenas garantirá a conformidade, mas também promoverá uma cultura de transparência e eficiência. Estamos comprometidos em entregar uma solução de classe mundial que atenda aos seus rigorosos padrões.'
      },
      thankYou: {
        title: 'Contate-nos',
        contact: 'pita.domingos@zd044.onmicrosoft.com',
        phone: '+258 84 547 9481'
      }
    },
    alcohol: {
        banner: {
            title: 'Controle de Álcool IoT',
            desc: 'Integração em tempo real com hardware de bafômetro industrial e sistemas de controle de acesso de catraca.',
            status: 'Roadmap v3.0'
        },
        features: {
            title: 'Recursos Principais',
            iotTitle: 'Conectividade IoT',
            iotDesc: 'Comunicação MQTT direta com dispositivos de bafômetro AlcoCheck.',
            accessTitle: 'Negação de Acesso',
            accessDesc: 'Resultados positivos (>0.00) acionam bloqueio imediato do site.',
            complianceTitle: 'Conformidade de Dados',
            complianceDesc: 'Armazenamento de logs criptografados para auditorias legais e RH.'
        },
        protocol: {
            title: 'Protocolo de Segurança',
            positiveTitle: 'Positivo Detectado',
            positiveDesc: 'Se o nível de álcool exceder 0.00%, a catraca trava e o acesso do cartão é suspenso.',
            resetTitle: 'Reset Automático',
            resetDesc: 'O acesso permanece revogado até as 02:00 AM do dia seguinte ou cancelamento manual do Admin.'
        },
        challenges: {
            title: 'Desafios & Mitigações',
            oemIssue: 'Restrições de Nuvem OEM: O hardware atual requer middleware proprietário.',
            gateSetup: 'Configuração Física do Portão: Requer infraestrutura de rede LAN dedicada no portão.'
        },
        proposal: {
            title: 'Nossa Solução Proposta',
            header: 'Proposta Técnica',
            hardware: 'Hardware',
            software: 'Software',
            security: 'Segurança',
            faceCap: 'Captura Facial: Verificar identidade durante o teste de sopro.',
            integration: 'Integração via API Direta: Ignorar nuvem OEM para dados em tempo real.',
            projectScope: 'Escopo do Projeto: Requer contrato separado para instalação de hardware.'
        },
        dashboard: {
            title: 'Centro de Controle de Álcool IoT',
            subtitle: 'Integração de Catracas em Tempo Real e Relatórios Automatizados',
            live: 'Transmissão ao Vivo',
            viewRoadmap: 'Ver Roteiro do Projeto',
            backToLive: 'Voltar ao Painel ao Vivo',
            kpi: {
                total: 'Total de Leituras',
                violations: 'Violações Detectadas',
                throughput: 'Fluxo da Portaria',
                health: 'Saúde dos Dispositivos'
            },
            log: 'Registro de Acesso ao Vivo',
            throughputChart: 'Fluxo Horário',
            deviceStatus: 'Status do Dispositivo',
            online: 'ONLINE',
            offline: 'OFFLINE',
            mqtt: 'MQTT Conectado',
            table: {
                device: 'Dispositivo',
                result: 'Resultado (TAS)',
                ok: 'OK',
                blocked: 'BLOQUEADO'
            },
            alert: {
                title: 'Acesso Negado',
                desc: 'Violação da Política de Tolerância Zero',
                measured: 'TAS Medida:'
            },
            actions: 'Ações Automatizadas',
            actionLog: {
                locked: 'Catraca Bloqueada Imediatamente',
                generating: 'Gerando Relatório de Incidente...',
                logged: 'Relatório de Incidente Registrado no BD',
                contacting: 'Contatando Supervisor...',
                sent: 'Alerta SMS Enviado ao Supervisor (Maputo HQ)'
            },
            close: 'Fechar Alerta',
            simActive: 'Simulação Ativa',
            person: 'Pessoa'
        }
    }
  }
};
