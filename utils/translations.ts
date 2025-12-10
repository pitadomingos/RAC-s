

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
      logs: 'System Logs',
      proposal: 'Project Proposal',
      presentation: 'Presentation Mode',
      alcohol: 'Alcohol Control'
    },
    common: {
      vulcan: 'CARs Manager',
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
      exitFullScreen: 'Exit Full Screen'
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
        noData: 'No bookings matching filters'
      },
      renewal: {
        title: 'Action Required: Training Renewal',
        message: 'employees have critical training expiring within 30 days.',
        button: 'Book Renewals'
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
      transfer: {
        title: 'Edit / Transfer Employee',
        subtitle: 'Update employee details. Changing the Company/Dept will maintain historical training records under the new entity.',
        update: 'Update Employee'
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
    advisor: {
        button: 'Safety Advisor',
        title: 'Vulcan AI Safety Advisor',
        sender: 'Vulcan Advisor',
        emptyState: 'How can I assist with safety procedures today?',
        placeholder: 'Ask about RAC standards, safety protocols...'
    },
    results: {
        title: 'Training Records',
        subtitle: 'View and manage employee training results.',
        searchPlaceholder: 'Search by Name or ID...',
        table: {
            employee: 'Employee',
            session: 'Session',
            dlRac02: 'DL (RAC 02)',
            theory: 'Theory',
            prac: 'Practical',
            status: 'Status',
            expiry: 'Expiry'
        }
    },
    cards: {
        title: 'Safety Cards',
        showing: 'Showing',
        subtitle: 'Select employees to print or request cards.',
        goToPrint: 'Go to Print View',
        selected: 'Selected',
        successTitle: 'Request Sent',
        successMsg: 'Card request has been forwarded to the printing department.',
        noRecords: 'No Eligible Records Found',
        noRecordsSub: 'Only employees with passed training records will appear here.',
        selectAll: 'Select All',
        sending: 'Sending...',
        requestButton: 'Request Cards',
        validation: {
            ineligible: 'Employee found but ineligible due to incomplete/expired training or invalid ASO.',
            maxSelection: 'Maximum 8 cards allowed per print batch.',
            incomplete: 'Incomplete Training'
        }
    },
    notifications: {
        expiryTitle: 'Training Expiring',
        expiryMsg: 'Training for {name} ({rac}) expires in {days} days.',
        autoBookTitle: 'Auto-Booking Created',
        autoBookMsg: '{name} has been auto-booked for {rac} on {date} (expires in {days} days).',
        autoBookFailTitle: 'Auto-Booking Failed',
        autoBookFailMsg: 'Could not auto-book {name} for {rac}. No available sessions found.'
    },
    trainer: {
        title: 'Trainer Input Portal',
        subtitle: 'Enter grades and attendance.',
        passMark: 'Pass Mark: 70%',
        loggedInAs: 'Logged in as',
        selectSession: 'Select Session',
        noSessions: 'No sessions found or assigned.',
        chooseSession: 'Choose a session to grade...',
        dlWarning: 'Ensure Driver License is verified for RAC 02.',
        saveResults: 'Save Results',
        table: {
            employee: 'Employee',
            attendance: 'Attended',
            dlCheck: 'DL Check',
            verified: 'Verified',
            theory: 'Theory',
            practical: 'Practical',
            rac02Only: '(RAC 02 Only)',
            status: 'Status'
        }
    },
    users: {
        title: 'User Management',
        subtitle: 'Manage system access and roles.',
        addUser: 'Add New User',
        table: {
            user: 'User',
            role: 'Role',
            status: 'Status',
            actions: 'Ações'
        },
        modal: {
            title: 'Add User',
            name: 'Full Name',
            email: 'Email Address',
            createUser: 'Create User'
        }
    },
    schedule: {
        title: 'Training Schedule',
        subtitle: 'Manage upcoming training sessions.',
        newSession: 'New Session',
        table: {
            date: 'Date / Time',
            rac: 'RAC Module',
            room: 'Location',
            trainer: 'Instructor'
        },
        modal: {
            title: 'Schedule Session',
            racType: 'RAC Type',
            date: 'Date',
            startTime: 'Start Time',
            location: 'Location (Room)',
            capacity: 'Capacity',
            instructor: 'Instructor',
            saveSession: 'Save Session'
        }
    },
    settings: {
        title: 'System Settings',
        subtitle: 'Configure global parameters.',
        saveAll: 'Save Configuration',
        saving: 'Saving...',
        tabs: {
            general: 'General / Rooms',
            trainers: 'Trainers',
            racs: 'RAC Definitions'
        },
        rooms: {
            title: 'Training Locations',
            name: 'Room Name',
            capacity: 'Max Capacity',
            new: 'New Room'
        },
        trainers: {
            title: 'Trainer Registry',
            name: 'Trainer Name',
            qualifiedRacs: 'Qualified RACs',
            new: 'New Trainer'
        },
        racs: {
            title: 'RAC Standards',
            code: 'RAC Code',
            description: 'Description',
            new: 'New RAC'
        }
    },
    reports: {
        title: 'Safety Reports',
        subtitle: 'Generate insights and analytics.',
        printReport: 'Print Report',
        filters: {
            period: 'Time Period',
            department: 'Department',
            racType: 'RAC Module',
            startDate: 'Start Date',
            endDate: 'End Date'
        },
        periods: {
            weekly: 'Last 7 Days',
            monthly: 'Last 30 Days',
            ytd: 'Year to Date',
            custom: 'Custom Range'
        },
        generate: 'Generate AI Report',
        analyzing: 'Analyzing...',
        stats: {
            totalTrained: 'Total Trained',
            passRate: 'Pass Rate',
            attendance: 'Attendance',
            noShows: 'No Shows'
        },
        charts: {
            performance: 'Pass vs Fail Performance'
        },
        executiveAnalysis: 'Executive AI Analysis',
        trainerMetrics: {
            title: 'Trainer Performance Metrics',
            name: 'Trainer',
            sessions: 'Sessions',
            passRate: 'Pass Rate',
            avgTheory: 'Avg Theory',
            avgPrac: 'Avg Prac'
        }
    },
    manuals: {
        title: 'User Manuals',
        subtitle: 'Role-based documentation.',
        sysAdmin: {
            title: 'System Administrator Manual',
            sec1: '1. Initial System Setup',
            sec1text: 'Configure the foundational data before users begin booking.',
            step1: 'Go to Settings > Rooms to define training locations and capacities.',
            step2: 'Define authorized Trainers and their qualified RACs.',
            step3: 'Ensure RAC Definitions match the current corporate standard.',
            sec2: '2. Data Import & Migration',
            sec2text: 'Import existing records to populate the system.',
            step4: 'Go to Records > Download Template.',
            step5: 'Populate the CSV with historical data (passed training).',
            step6: 'Upload the CSV to verify and commit records.'
        },
        racAdmin: {
            title: 'RAC Administrator Manual',
            sec1: '1. Scheduling Training',
            sec1text: 'Create sessions for the upcoming month.',
            step1: 'Navigate to Schedule Trainings.',
            step2: 'Click "New Session" and assign a Trainer and Room.',
            sec2: '2. Monitoring Expirations',
            sec2text: 'Manage renewals proactively.',
            alert: 'The system automatically notifies when 30 days remain.',
            step3: 'Check the Dashboard for the "Action Required" banner.',
            step4: 'Click "Book Renewals" to auto-fill booking forms.'
        },
        racTrainer: {
            title: 'Trainer Manual',
            sec1: '1. Grading Sessions',
            sec1text: 'Enter results immediately after training.',
            alert: 'RAC 02 requires Driver License verification.',
            step1: 'Log in and go to "Trainer Input".',
            step2: 'Select your session.',
            step3: 'Mark Attendance and enter scores.',
            step4: 'Click "Save Results". Cards become available immediately.'
        },
        deptAdmin: {
            title: 'Department Admin Manual',
            sec1: '1. Printing Cards',
            sec1text: 'Issue physical credentials to your team.',
            step1: 'Go to "Request CARs Cards".',
            step2: 'Select passed employees and click Print.',
            sec2: '2. Compliance Reporting',
            sec2text: 'Check your department status.',
            step3: 'Go to Reports.',
            step4: 'Filter by your Department to view specific metrics.'
        },
        user: {
            title: 'General User Manual',
            sec1: '1. Understanding Your Status',
            sec1text: 'Your Dashboard shows your current standing.',
            compliant: 'Green: You are fully compliant.',
            nonCompliant: 'Red: You have expired training or missing medicals.',
            sec2: '2. Requesting a Card',
            sec2text: 'If you lost your card, go to "Request Cards" and submit a request to your admin.'
        }
    },
    alcohol: {
        title: 'Integrated Alcohol Interface',
        subtitle: 'Future Roadmap & System Architecture',
        banner: {
            title: 'Coming Soon: Alcohol & IoT Integration',
            desc: 'A unified interface connecting breathalyzers, turnstiles, and the Vulcan Safety Database for automated site access control.',
            status: 'In Development'
        },
        features: {
            title: 'System Vision',
            iotTitle: 'IoT Device Connection',
            iotDesc: 'Direct integration with industrial breathalyzers to capture results in real-time.',
            accessTitle: 'Automated Lockout',
            accessDesc: 'Automatically block turnstile access if alcohol is detected or training is expired.',
            complianceTitle: 'Compliance Reporting',
            complianceDesc: 'Unified logs for both safety training and fitness-for-duty checks.'
        },
        challenges: {
            title: 'Current Challenges & Risks',
            oemIssue: 'Current breathalyzers send data to an external OEM Cloud. This poses data sovereignty risks and creates latency.',
            gateSetup: 'Main gate physical layout requires modification to support the new "Test-then-Enter" workflow.'
        },
        proposal: {
            title: 'Proposed Solution Scope',
            faceCap: 'Purchase models with Face Capture to prevent "buddy punching".',
            integration: 'Develop middleware to intercept device data locally (Edge Computing).',
            projectScope: 'This is an independent project involving Civil & Electrical engineering teams.'
        }
    },
    logs: {
        title: 'System Audit Logs',
        subtitle: 'Track all system activities and security events.',
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
    proposal: {
        title: 'Project Proposal: Vulcan Safety Manager',
        digitalTrans: 'Digital Transformation Initiative',
        letter: {
            recipient: 'To: The Management Team',
            role: 'Vulcan Mining Operations',
            company: 'Tete, Mozambique',
            subject: 'Subject: Proposal for Digital Safety Management System Implementation',
            salutation: 'Dear Management Team,',
            intro: 'We are pleased to submit this proposal for the development and implementation of the Vulcan Safety Manager (CARs Manager). This comprehensive digital solution is designed to streamline your Critical Activity Requisitions (RAC) training management, ensuring 100% compliance visibility and operational efficiency.',
            body1: 'Our solution addresses the current challenges of manual tracking, fragmented data, and delayed reporting. By centralizing employee data, training records, and issuance of digital credentials, we aim to significantly reduce administrative overhead and improve site safety standards.',
            body2: 'The proposed system includes advanced features such as AI-driven reporting, real-time dashboards, and secure role-based access control, tailored specifically for the mining environment context.',
            closing: 'We look forward to the opportunity to partner with Vulcan Mining on this critical safety initiative.',
            signoff: 'Sincerely,',
            team: 'DigiSols Team'
        },
        execSummary: {
            title: '1. Executive Summary',
            text: 'The Vulcan Safety Manager is a bespoke web-based platform designed to digitize the end-to-end process of safety training management. From scheduling sessions to grading results and issuing ID cards, the system provides a single source of truth for HSE compliance. It replaces manual spreadsheets and paper records with a secure, automated database accessible by System Admins, RAC Trainers, and Department Leads.',
            quote: '"Safety is not just a priority, it is a core value. Our digital tools must reflect the same standard of excellence as our operational machinery."'
        },
        objectives: {
            title: '2. Project Objectives',
            problemTitle: 'Current Problem',
            problemText: 'Reliance on manual spreadsheets leads to data inconsistency, difficulty in tracking expiring certifications, and delays in issuing physical cards. There is no real-time visibility into workforce readiness.',
            solutionTitle: 'Nossa Solução',
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
            pmRole: 'Responsible for overall delivery, stakeholder management, and requirement gathering. Ensures the project stays on time and within budget.',
            techRole: 'Responsible for full-stack development, database optimization, and on-site deployment. Will work on a rotating roster to ensure continuous support.'
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
            phase2desc: 'Development of Scheduling Module, Database, and Grading System.',
            phase3: 'Phase 3: Testing & QA (Weeks 9-10)',
            phase3desc: 'User Acceptance Testing (UAT), bug fixing, and load testing.',
            phase4: 'Phase 4: Deployment & Training (Weeks 11-12)',
            phase4desc: 'Production deployment, admin training sessions, and handover.'
        },
        techStack: {
            title: '6. Technical Stack',
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
                { name: 'Software Development & Customization', type: 'Once-off', cost: '$15,000.00' },
                { name: 'Cloud Infrastructure Setup & Data Migration', type: 'Once-off', cost: '$2,500.00' },
                { name: 'Cloud Tier Subscription, Maintenance & Management Fees', type: 'Monthly', cost: '$10,000.00' },
                { name: 'New Features Development', type: 'On-demand', cost: '$3,500.00' },
                { name: 'Seasonal Security Updates', type: 'Seasonal', cost: '$0.00' }
            ]
        },
        roadmap: {
            title: '8. Future Roadmap',
            intro: 'Beyond the initial launch, we propose the following enhancements:',
            auth: 'SSO Integration',
            authDesc: 'Connect with Azure AD for Single Sign-On.',
            db: 'Cloud Migration',
            dbDesc: 'Move from on-premise to Azure/AWS for scalability.',
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
                feat2: 'New "Fitness-for-Duty" Dashboard Widget',
                feat3: 'Logic to block card issuance if alcohol flag is active'
            },
            infraScope: {
                title: 'Module B: Infrastructure (Independent Project)',
                desc: 'Physical installation and hardware required at the main gate. Treated as a separate contract.',
                feat1: 'Civil Works (Turnstile modification)',
                feat2: 'Electrical & Cabling (Cat6/Power)',
                feat3: 'Face-ID Breathalyzer Hardware Procurement'
            }
        },
        enhancedCaps: {
            title: '11. Enhanced Operational Capabilities',
            intro: 'Beyond the core training modules, the system now includes advanced operational tools designed for real-time compliance verification and administrative automation.',
            mobileVerify: {
                title: 'Mobile Verification (Digital Passport)',
                desc: 'Field safety officers can now verify employee compliance instantly by scanning the QR code on the safety card using any smartphone. The system returns a secure, real-time "Digital Passport" page.',
                features: ['Real-time Status Check (Live DB Query)', 'Visual Compliance Indicator (Green Tick / Red Cross)', 'Displays ASO & Driver License Validity']
            },
            autoBooking: {
                title: 'Intelligent Auto-Booking',
                desc: 'To prevent compliance gaps, the system proactively monitors training expiry dates. When a certification is 7 days from expiring, the system automatically books a slot in the next available training session.',
                features: ['Automated scheduling based on expiry (<7 days)', 'RAC Admin Approval Workflow', 'Prevents operational downtime due to expired credentials']
            }
        },
        conclusion: {
            title: '12. Conclusion',
            text: 'The Vulcan Safety Manager represents a significant step forward for operational safety excellence. By digitizing these critical workflows, Vulcan Mining will not only ensure compliance but also foster a culture of transparency and efficiency. We are committed to delivering a world-class solution that meets your rigorous standards.'
        }
    },
    ai: {
        systemPromptAdvice: 'You are an expert Health, Safety, and Environment (HSE) advisor for a mining company called Vulcan. You are helpful, professional, and concise. Answer questions specifically about Critical Activity Requisitions (RAC). Current Context is RAC: {rac}. Language: {language}.',
        systemPromptReport: 'You are a data analyst for a mining safety department. Analyze the provided training statistics and generate a professional executive summary. Highlight trends in pass rates, attendance, and specific RAC modules that are failing. Provide 3 actionable recommendations to improve safety compliance. Language: {language}.'
    }
  },
  pt: {
    nav: {
      dashboard: 'Painel de Controle',
      database: 'Banco de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Entrada do Instrutor',
      records: 'Registros',
      users: 'Gestão de Usuários',
      schedule: 'Cronograma de Treinos',
      settings: 'Configurações',
      requestCards: 'Solicitar Cartões',
      manuals: 'Manuais do Usuário',
      logs: 'Logs do Sistema',
      proposal: 'Proposta de Projeto',
      presentation: 'Modo Apresentação',
      alcohol: 'Controle de Álcool'
    },
    common: {
      vulcan: 'Gestor CARs',
      safetySystem: 'Sistema de Gestão de Segurança',
      role: 'Função',
      activeSession: 'Sessão Ativa',
      notifications: 'Notificações',
      clearAll: 'Limpar Tudo',
      noNotifications: 'Nenhuma nova notificação',
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
      exitFullScreen: 'Sair da Tela Cheia'
    },
    verification: {
      title: 'Passaporte Digital de Segurança',
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
        pending: 'Pendente de Nota',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade por RAC & ASO',
        complianceSubtitle: 'Mostra status obrigatório. Verde = Válido. Vermelho = Ausente/Expirado.',
        accessTitle: 'Status de Acesso Geral',
        compliant: 'Conforme',
        missing: 'Ausente / Expirado',
        nonCompliant: 'Não Conforme'
      },
      upcoming: {
        title: 'Próximas Sessões',
        viewSchedule: 'Ver Cronograma',
        capacity: 'Lotação',
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
        noData: 'Nenhum agendamento encontrado'
      },
      renewal: {
        title: 'Ação Necessária: Renovação',
        message: 'funcionários têm treinamento crítico expirando em 30 dias.',
        button: 'Agendar Renovações'
      }
    },
    database: {
      title: 'Banco de Dados Mestre',
      subtitle: 'Gerencie requisitos. RAC 02 é desativado se a Carta estiver expirada.',
      filters: 'Filtros',
      accessStatus: 'Status de Acesso',
      granted: 'Concedido',
      blocked: 'Bloqueado',
      employeeInfo: 'Info Funcionário & DL',
      aso: 'ASO (Médico)',
      license: 'Carta',
      class: 'Classe',
      number: 'Número',
      expired: 'EXP',
      active: 'Ativo',
      transfer: {
        title: 'Editar / Transferir Funcionário',
        subtitle: 'Atualize os detalhes. Alterar a Empresa/Dept manterá o histórico sob a nova entidade.',
        update: 'Atualizar Funcionário'
      }
    },
    booking: {
      title: 'Agendar Sessão',
      secureMode: 'Modo de Entrada Segura',
      manageSchedule: 'Gerenciar Agenda',
      dlRequired: 'Detalhes da Carta necessários para RAC 02',
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
    advisor: {
        button: 'Consultor de Segurança',
        title: 'Consultor Vulcan AI',
        sender: 'Consultor Vulcan',
        emptyState: 'Como posso ajudar com procedimentos de segurança hoje?',
        placeholder: 'Pergunte sobre padrões RAC, protocolos...'
    },
    results: {
        title: 'Registros de Treinamento',
        subtitle: 'Visualize e gerencie resultados de treinamento.',
        searchPlaceholder: 'Buscar por Nome ou ID...',
        table: {
            employee: 'Funcionário',
            session: 'Sessão',
            dlRac02: 'Carta (RAC 02)',
            theory: 'Teoria',
            prac: 'Prática',
            status: 'Status',
            expiry: 'Validade'
        }
    },
    cards: {
        title: 'Cartões de Segurança',
        showing: 'Mostrando',
        subtitle: 'Selecione funcionários para imprimir ou solicitar cartões.',
        goToPrint: 'Ir para Impressão',
        selected: 'Selecionado',
        successTitle: 'Solicitação Enviada',
        successMsg: 'A solicitação do cartão foi encaminhada para o departamento de impressão.',
        noRecords: 'Nenhum Registro Elegível',
        noRecordsSub: 'Apenas funcionários com treinamento aprovado aparecerão aqui.',
        selectAll: 'Selecionar Todos',
        sending: 'Enviando...',
        requestButton: 'Solicitar Cartões',
        validation: {
            ineligible: 'Funcionário encontrado, mas inelegível devido a treinamento incompleto/expirado ou ASO inválido.',
            maxSelection: 'Máximo de 8 cartões permitidos por lote de impressão.',
            incomplete: 'Treinamento Incompleto'
        }
    },
    notifications: {
        expiryTitle: 'Treinamento Expirando',
        expiryMsg: 'O treinamento de {name} ({rac}) expira em {days} dias.',
        autoBookTitle: 'Auto-Agendamento Criado',
        autoBookMsg: '{name} foi agendado automaticamente para {rac} em {date} (expira em {days} dias).',
        autoBookFailTitle: 'Auto-Agendamento Falhou',
        autoBookFailMsg: 'Não foi possível agendar {name} para {rac}. Nenhuma sessão disponível.'
    },
    trainer: {
        title: 'Portal do Instrutor',
        subtitle: 'Insira notas e presença.',
        passMark: 'Nota de Aprovação: 70%',
        loggedInAs: 'Logado como',
        selectSession: 'Selecionar Sessão',
        noSessions: 'Nenhuma sessão encontrada ou atribuída.',
        chooseSession: 'Escolha uma sessão para avaliar...',
        dlWarning: 'Certifique-se de que a Carta de Condução foi verificada para RAC 02.',
        saveResults: 'Salvar Resultados',
        table: {
            employee: 'Funcionário',
            attendance: 'Presente',
            dlCheck: 'Verif. Carta',
            verified: 'Verificado',
            theory: 'Teoria',
            practical: 'Prática',
            rac02Only: '(Apenas RAC 02)',
            status: 'Status'
        }
    },
    users: {
        title: 'Gestão de Usuários',
        subtitle: 'Gerenciar acesso e funções do sistema.',
        addUser: 'Adicionar Usuário',
        table: {
            user: 'Usuário',
            role: 'Função',
            status: 'Status',
            actions: 'Ações'
        },
        modal: {
            title: 'Adicionar Usuário',
            name: 'Nome Completo',
            email: 'Endereço de Email',
            createUser: 'Criar Usuário'
        }
    },
    schedule: {
        title: 'Cronograma de Treinamento',
        subtitle: 'Gerenciar próximas sessões.',
        newSession: 'Nova Sessão',
        table: {
            date: 'Data / Hora',
            rac: 'Módulo RAC',
            room: 'Local',
            trainer: 'Instrutor'
        },
        modal: {
            title: 'Agendar Sessão',
            racType: 'Tipo RAC',
            date: 'Data',
            startTime: 'Hora Início',
            location: 'Local (Sala)',
            capacity: 'Capacidade',
            instructor: 'Instrutor',
            saveSession: 'Salvar Sessão'
        }
    },
    settings: {
        title: 'Configurações do Sistema',
        subtitle: 'Configurar parâmetros globais.',
        saveAll: 'Salvar Configuração',
        saving: 'Salvando...',
        tabs: {
            general: 'Geral / Salas',
            trainers: 'Instrutores',
            racs: 'Definições RAC'
        },
        rooms: {
            title: 'Locais de Treinamento',
            name: 'Nome da Sala',
            capacity: 'Capacidade Máx',
            new: 'Nova Sala'
        },
        trainers: {
            title: 'Registro de Instrutores',
            name: 'Nome do Instrutor',
            qualifiedRacs: 'RACs Qualificados',
            new: 'Novo Instrutor'
        },
        racs: {
            title: 'Padrões RAC',
            code: 'Código RAC',
            description: 'Descrição',
            new: 'Novo RAC'
        }
    },
    reports: {
        title: 'Relatórios de Segurança',
        subtitle: 'Gerar insights e análises.',
        printReport: 'Imprimir Relatório',
        filters: {
            period: 'Período',
            department: 'Departamento',
            racType: 'Módulo RAC',
            startDate: 'Data Início',
            endDate: 'Data Fim'
        },
        periods: {
            weekly: 'Últimos 7 Dias',
            monthly: 'Últimos 30 Dias',
            ytd: 'Ano até Agora',
            custom: 'Personalizado'
        },
        generate: 'Gerar Relatório IA',
        analyzing: 'Analisando...',
        stats: {
            totalTrained: 'Total Treinado',
            passRate: 'Taxa Aprovação',
            attendance: 'Presença',
            noShows: 'Ausências'
        },
        charts: {
            performance: 'Desempenho Aprovação vs Reprovação'
        },
        executiveAnalysis: 'Análise Executiva IA',
        trainerMetrics: {
            title: 'Métricas de Desempenho do Instrutor',
            name: 'Instrutor',
            sessions: 'Sessões',
            passRate: 'Aprovação',
            avgTheory: 'Méd Teoria',
            avgPrac: 'Méd Prática'
        }
    },
    manuals: {
        title: 'Manuais do Usuário',
        subtitle: 'Documentação baseada em função.',
        sysAdmin: {
            title: 'Manual do Administrador do Sistema',
            sec1: '1. Configuração Inicial do Sistema',
            sec1text: 'Configure os dados fundamentais antes que os usuários comecem a agendar.',
            step1: 'Vá para Configurações > Salas para definir locais e capacidades.',
            step2: 'Defina Instrutores autorizados e seus RACs qualificados.',
            step3: 'Garanta que as Definições RAC correspondam ao padrão corporativo atual.',
            sec2: '2. Importação e Migração de Dados',
            sec2text: 'Importe registros existentes para popular o sistema.',
            step4: 'Vá para Registros > Baixar Modelo.',
            step5: 'Preencha o CSV com dados históricos (treinamentos aprovados).',
            step6: 'Carregue o CSV para verificar e confirmar os registros.'
        },
        racAdmin: {
            title: 'Manual do Administrador RAC',
            sec1: '1. Agendamento de Treinamento',
            sec1text: 'Crie sessões para o próximo mês.',
            step1: 'Navegue para Cronograma de Treinos.',
            step2: 'Clique em "Nova Sessão" e atribua um Instrutor e Sala.',
            sec2: '2. Monitoramento de Expirações',
            sec2text: 'Gerencie renovações proativamente.',
            alert: 'O sistema notifica automaticamente quando restam 30 dias.',
            step3: 'Verifique o Painel para o banner "Ação Necessária".',
            step4: 'Clique em "Agendar Renovações" para preencher formulários automaticamente.'
        },
        racTrainer: {
            title: 'Manual do Instrutor',
            sec1: '1. Avaliando Sessões',
            sec1text: 'Insira os resultados imediatamente após o treinamento.',
            alert: 'RAC 02 requer verificação da Carta de Condução.',
            step1: 'Faça login e vá para "Entrada do Instrutor".',
            step2: 'Selecione sua sessão.',
            step3: 'Marque Presença e insira as notas.',
            step4: 'Clique em "Salvar Resultados". Os cartões ficam disponíveis imediatamente.'
        },
        deptAdmin: {
            title: 'Manual do Admin de Departamento',
            sec1: '1. Impressão de Cartões',
            sec1text: 'Emita credenciais físicas para sua equipe.',
            step1: 'Vá para "Solicitar Cartões".',
            step2: 'Selecione funcionários aprovados e clique em Imprimir.',
            sec2: '2. Relatórios de Conformidade',
            sec2text: 'Verifique o status do seu departamento.',
            step3: 'Vá para Relatórios.',
            step4: 'Filtre pelo seu Departamento para ver métricas específicas.'
        },
        user: {
            title: 'Manual do Usuário Geral',
            sec1: '1. Entendendo Seu Status',
            sec1text: 'Seu Painel mostra sua situação atual.',
            compliant: 'Verde: Você está totalmente em conformidade.',
            nonCompliant: 'Vermelho: Você tem treinamento expirado ou exames médicos pendentes.',
            sec2: '2. Solicitando um Cartão',
            sec2text: 'Se você perdeu seu cartão, vá para "Solicitar Cartões" e envie um pedido ao seu admin.'
        }
    },
    alcohol: {
        title: 'Interface Integrada de Álcool',
        subtitle: 'Roteiro Futuro e Arquitetura do Sistema',
        banner: {
            title: 'Em Breve: Integração Álcool e IoT',
            desc: 'Uma interface unificada conectando bafômetros, torniquetes e o Banco de Dados de Segurança Vulcan para controle de acesso automatizado.',
            status: 'Em Desenvolvimento'
        },
        features: {
            title: 'Visão do Sistema',
            iotTitle: 'Conexão de Dispositivos IoT',
            iotDesc: 'Integração direta com bafômetros industriais para capturar resultados em tempo real.',
            accessTitle: 'Bloqueio Automatizado',
            accessDesc: 'Bloquear automaticamente o acesso ao torniquete se álcool for detectado ou treinamento estiver expirado.',
            complianceTitle: 'Relatórios de Conformidade',
            complianceDesc: 'Logs unificados para treinamento de segurança e verificações de aptidão para o trabalho.'
        },
        challenges: {
            title: 'Desafios e Riscos Atuais',
            oemIssue: 'Os bafômetros atuais enviam dados para uma nuvem OEM externa. Isso cria riscos de soberania de dados e latência.',
            gateSetup: 'O layout físico do portão principal requer modificação para suportar o novo fluxo de trabalho "Testar-depois-Entrar".'
        },
        proposal: {
            title: 'Escopo da Solução Proposta',
            faceCap: 'Adquirir modelos com Captura Facial para evitar fraudes.',
            integration: 'Desenvolver middleware para interceptar dados do dispositivo localmente (Edge Computing).',
            projectScope: 'Este é um projeto independente envolvendo equipes de engenharia Civil e Elétrica.'
        }
    },
    logs: {
        title: 'Logs de Auditoria do Sistema',
        subtitle: 'Rastreie todas as atividades do sistema e eventos de segurança.',
        levels: {
            all: 'Todos os Níveis',
            info: 'Info',
            warn: 'Aviso',
            error: 'Erro',
            audit: 'Auditoria'
        },
        table: {
            level: 'Nível',
            timestamp: 'Data/Hora',
            user: 'Usuário',
            message: 'Mensagem'
        }
    },
    proposal: {
        title: 'Proposta de Projeto: Vulcan Safety Manager',
        digitalTrans: 'Iniciativa de Transformação Digital',
        letter: {
            recipient: 'Para: Equipe de Gestão',
            role: 'Operações de Mineração Vulcan',
            company: 'Tete, Moçambique',
            subject: 'Assunto: Proposta para Implementação do Sistema de Gestão de Segurança Digital',
            salutation: 'Prezada Equipe de Gestão,',
            intro: 'Temos o prazer de submeter esta proposta para o desenvolvimento e implementação do Vulcan Safety Manager (Gestor CARs). Esta solução digital abrangente foi projetada para otimizar sua gestão de treinamento de Requisições de Atividade Crítica (RAC), garantindo 100% de visibilidade de conformidade e eficiência operacional.',
            body1: 'Nossa solução aborda os desafios atuais de rastreamento manual, dados fragmentados e relatórios atrasados. Ao centralizar dados de funcionários, registros de treinamento e emissão de credenciais digitais, visamos reduzir significativamente a sobrecarga administrativa e melhorar os padrões de segurança do local.',
            body2: 'O sistema proposto inclui recursos avançados como relatórios impulsionados por IA, painéis em tempo real e controle de acesso seguro baseado em função, adaptados especificamente para o contexto do ambiente de mineração.',
            closing: 'Aguardamos a oportunidade de fazer parceria com a Vulcan Mining nesta iniciativa crítica de segurança.',
            signoff: 'Atenciosamente,',
            team: 'Equipe DigiSols'
        },
        execSummary: {
            title: '1. Resumo Executivo',
            text: 'O Vulcan Safety Manager é uma plataforma web projetada para digitalizar o processo de ponta a ponta da gestão de treinamento de segurança. Desde o agendamento de sessões até a avaliação de resultados e emissão de cartões de identificação, o sistema fornece uma única fonte de verdade para a conformidade HSE. Ele substitui planilhas e registros manuais por um banco de dados seguro e automatizado, acessível por Admins do Sistema, Instrutores RAC e Líderes de Departamento.',
            quote: '"Segurança não é apenas uma prioridade, é um valor fundamental. Nossas ferramentas digitais devem refletir o mesmo padrão de excelência de nosso maquinário operacional."'
        },
        objectives: {
            title: '2. Objetivos do Projeto',
            problemTitle: 'Problema Atual',
            problemText: 'A dependência de planilhas manuais leva à inconsistência de dados, dificuldade em rastrear certificações expirando e atrasos na emissão de cartões físicos. Não há visibilidade em tempo real da prontidão da força de trabalho.',
            solutionTitle: 'Nossa Solução',
            goals: [
                'Banco de Dados Centralizado para 15.000+ Funcionários',
                'Notificações Automatizadas de Expiração',
                'Emissão de Cartão Digital e Físico',
                'Controle de Acesso Baseado em Função (RBAC)',
                'Análise de Segurança com IA'
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
            techRole: 'Responsável pelo desenvolvimento full-stack, otimização de banco de dados e implantação no local. Trabalharão em regime rotativo para garantir suporte contínuo.'
        },
        roles: {
            title: '4. Funções e Permissões de Usuário',
            sysAdmin: { title: 'Admin do Sistema', desc: 'Acesso total a todas as configurações, gestão de usuários e configuração.' },
            racAdmin: { title: 'Admin RAC', desc: 'Gerencia agendas de treinamento, aprova resultados e supervisiona conformidade.' },
            deptAdmin: { title: 'Admin de Dept', desc: 'Acesso apenas visualização para seu departamento. Pode solicitar cartões para sua equipe.' },
            racTrainer: { title: 'Instrutor RAC', desc: 'Pode ver apenas sessões atribuídas e inserir notas/presença.' },
            user: { title: 'Usuário Geral', desc: 'Pode ver seu próprio status e solicitar substituição de cartão.' }
        },
        timeline: {
            title: '5. Cronograma de Implementação',
            intro: 'O projeto será entregue em 4 fases ao longo de 12 semanas.',
            phase1: 'Fase 1: Descoberta e Design (Semanas 1-2)',
            phase1desc: 'Levantamento de requisitos, prototipagem UI/UX e design do esquema de banco de dados.',
            phase2: 'Fase 2: Desenvolvimento Central (Semanas 3-8)',
            phase2desc: 'Desenvolvimento do Módulo de Agendamento, Banco de Dados e Sistema de Avaliação.',
            phase3: 'Fase 3: Testes e QA (Semanas 9-10)',
            phase3desc: 'Teste de Aceitação do Usuário (UAT), correção de bugs e teste de carga.',
            phase4: 'Fase 4: Implantação e Treinamento (Semanas 11-12)',
            phase4desc: 'Implantação em produção, sessões de treinamento para admins e entrega.'
        },
        techStack: {
            title: '6. Stack Técnico',
            frontendTitle: 'Frontend',
            frontend: 'React (TypeScript), Tailwind CSS, Ícones Lucide',
            backendTitle: 'Lógica Backend',
            backend: 'Node.js (Simulado no Navegador para Protótipo), Arquitetura RESTful',
            databaseTitle: 'Banco de Dados',
            database: 'PostgreSQL / SQL Server (Pronto para Produção)',
            securityTitle: 'Segurança',
            security: 'Autenticação JWT, Controle de Acesso Baseado em Função, Criptografia de Dados'
        },
        financials: {
            title: '7. Investimento Financeiro',
            item: 'Descrição do Item',
            type: 'Tipo',
            cost: 'Custo (USD)',
            total: 'Investimento Total Estimado (Itens 1 + 2)',
            items: [
                { name: 'Software Development & Customization', type: 'Once-off', cost: '$15,000.00' },
                { name: 'Cloud Infrastructure Setup & Data Migration', type: 'Once-off', cost: '$2,500.00' },
                { name: 'Cloud Tier Subscription, Maintenance & Management Fees', type: 'Monthly', cost: '$10,000.00' },
                { name: 'New Features Development', type: 'On-demand', cost: '$3,500.00' },
                { name: 'Seasonal Security Updates', type: 'Seasonal', cost: '$0.00' }
            ]
        },
        roadmap: {
            title: '8. Roteiro Futuro',
            intro: 'Além do lançamento inicial, propomos as seguintes melhorias:',
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
            title: '9. IA e Recursos Inteligentes',
            intro: 'Aproveitando Google Gemini AI para inteligência de segurança.',
            advisor: 'Chatbot Consultor de Segurança',
            advisorDesc: 'Um assistente de IA integrado que responde perguntas sobre padrões RAC e protocolos de segurança em linguagem natural.',
            analysis: 'Relatórios Automatizados',
            analysisDesc: 'A IA analisa tendências mensais para identificar departamentos de alto risco e sugerir intervenções de treinamento direcionadas.'
        },
        futureUpdates: {
            title: '10. Escopo de Integração Álcool e IoT',
            softwareScope: {
                title: 'Módulo A: Integração de Software',
                desc: 'Atualizações nesta aplicação web para suportar ingestão de dados e relatórios.',
                feat1: 'Endpoints API para Dados de Bafômetro',
                feat2: 'Novo Widget de Painel "Aptidão para o Trabalho"',
                feat3: 'Lógica para bloquear emissão de cartão se flag de álcool estiver ativo'
            },
            infraScope: {
                title: 'Módulo B: Infraestrutura (Projeto Independente)',
                desc: 'Instalação física e de hardware necessária no portão principal. Tratado como um contrato separado.',
                feat1: 'Obras Civis (Modificação de torniquete)',
                feat2: 'Elétrica e Cabeamento (Cat6/Energia)',
                feat3: 'Aquisição de Bafômetros com Face-ID'
            }
        },
        enhancedCaps: {
            title: '11. Capacidades Operacionais Aprimoradas',
            intro: 'Além dos módulos principais de treinamento, o sistema agora inclui ferramentas operacionais avançadas projetadas para verificação de conformidade em tempo real e automação administrativa.',
            mobileVerify: {
                title: 'Verificação Móvel (Passaporte Digital)',
                desc: 'Oficiais de segurança de campo agora podem verificar a conformidade dos funcionários instantaneamente escaneando o código QR no cartão de segurança usando qualquer smartphone. O sistema retorna uma página segura e em tempo real de "Passaporte Digital".',
                features: ['Verificação de status em tempo real (Consulta BD ao vivo)', 'Indicador Visual de Conformidade (Visto Verde / Cruz Vermelha)', 'Exibe validade de ASO e Carta de Condução']
            },
            autoBooking: {
                title: 'Agendamento Automático Inteligente',
                desc: 'Para evitar lacunas de conformidade, o sistema monitora proativamente as datas de expiração do treinamento. Quando uma certificação está a 7 dias de expirar, o sistema reserva automaticamente uma vaga na próxima sessão de treinamento disponível.',
                features: ['Agendamento automatizado baseado em expiração (<7 dias)', 'Fluxo de Aprovação do Admin RAC', 'Previne inatividade operacional devido a credenciais expiradas']
            }
        },
        conclusion: {
            title: '12. Conclusão',
            text: 'O Vulcan Safety Manager representa um passo significativo para a excelência em segurança operacional. Ao digitalizar esses fluxos de trabalho críticos, a Vulcan Mining não apenas garantirá conformidade, mas também promoverá uma cultura de transparência e eficiência. Estamos comprometidos em entregar uma solução de classe mundial que atenda aos seus rigorosos padrões.'
        }
    },
    ai: {
        systemPromptAdvice: 'Você é um consultor especialista em Saúde, Segurança e Meio Ambiente (HSE) para uma empresa de mineração chamada Vulcan. Você é útil, profissional e conciso. Responda a perguntas especificamente sobre Requisições de Atividade Crítica (RAC). O contexto atual é o RAC: {rac}. Idioma: {language}.',
        systemPromptReport: 'Você é um analista de dados de um departamento de segurança de mineração. Analise as estatísticas de treinamento fornecidas e gere um resumo executivo profissional. Destaque tendências nas taxas de aprovação, presença e módulos RAC específicos que estão falhando. Forneça 3 recomendações acionáveis para melhorar a conformidade de segurança. Idioma: {language}.'
    }
  }
};
