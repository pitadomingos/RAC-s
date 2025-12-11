
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
          EXEC_CRED: 'Exec. Cred',
          EMIT_PTS: 'Emitente PTS',
          LOB_OPS: 'LOB-OPS',
          ART: 'ART',
          APR_ART: 'Aprovad. ART',
          LOB_MOV: 'LOB-MOV'
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
    advisor: { button: 'Safety Advisor', title: 'Vulcan AI Safety Advisor', sender: 'Vulcan Advisor', emptyState: 'How can I assist?', placeholder: 'Ask about RAC standards...' },
    results: { title: 'Training Records', subtitle: 'View results.', searchPlaceholder: 'Search...', table: { employee: 'Employee', session: 'Session', date: 'Date', trainer: 'Trainer', room: 'Room', dlRac02: 'DL (RAC 02)', theory: 'Theory', prac: 'Practical', status: 'Status', expiry: 'Expiry' } },
    cards: { title: 'Safety Cards', showing: 'Showing', subtitle: 'Select employees.', goToPrint: 'Go to Print View', selected: 'Selected', successTitle: 'Request Sent', successMsg: 'Card request forwarded.', noRecords: 'No Eligible Records', noRecordsSub: 'Only passed records appear here.', selectAll: 'Select All', sending: 'Sending...', requestButton: 'Request Cards', validation: { ineligible: 'Ineligible employee.', maxSelection: 'Max 8 cards.', incomplete: 'Incomplete' } },
    trainer: { title: 'Trainer Input', subtitle: 'Enter grades.', passMark: 'Pass: 70%', loggedInAs: 'Logged in as', selectSession: 'Select Session', noSessions: 'No sessions.', chooseSession: 'Choose session...', dlWarning: 'Verify DL for RAC 02.', saveResults: 'Save Results', table: { employee: 'Employee', attendance: 'Attended', dlCheck: 'DL Check', verified: 'Verified', theory: 'Theory', practical: 'Practical', rac02Only: '(RAC 02)', status: 'Status' } },
    users: { title: 'User Management', subtitle: 'Manage access.', addUser: 'Add User', table: { user: 'User', role: 'Role', status: 'Status', actions: 'Actions' }, modal: { title: 'Add User', name: 'Name', email: 'Email', createUser: 'Create' } },
    schedule: { title: 'Training Schedule', subtitle: 'Manage sessions.', newSession: 'New Session', table: { date: 'Date/Time', rac: 'RAC', room: 'Location', trainer: 'Instructor' }, modal: { title: 'Schedule', racType: 'RAC', date: 'Date', startTime: 'Start', location: 'Loc', capacity: 'Cap', instructor: 'Instr', saveSession: 'Save', language: 'Language', english: 'English', portuguese: 'Portuguese' } },
    settings: { title: 'Settings', subtitle: 'Config.', saveAll: 'Save', saving: 'Saving...', tabs: { general: 'General', trainers: 'Trainers', racs: 'RACs' }, rooms: { title: 'Rooms', name: 'Name', capacity: 'Cap', new: 'New Room' }, trainers: { title: 'Trainers', name: 'Name', qualifiedRacs: 'RACs', new: 'New Trainer' }, racs: { title: 'RACs', code: 'Code', description: 'Desc', new: 'New RAC' } },
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start', endDate: 'End' }, periods: { weekly: 'Weekly', monthly: 'Monthly', ytd: 'YTD', custom: 'Custom' }, generate: 'Generate AI', analyzing: 'Analyzing...', stats: { totalTrained: 'Total', passRate: 'Pass Rate', attendance: 'Attendance', noShows: 'No Shows' }, charts: { performance: 'Performance' }, executiveAnalysis: 'Executive AI Analysis', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prac' } },
    manuals: { title: 'Manuals', subtitle: 'Docs', sysAdmin: { title: 'Sys Admin', sec1: 'Setup', sec1text: '...', step1: 'Settings', step2: 'Trainers', step3: 'RACs', sec2: 'Import', sec2text: '...', step4: 'Template', step5: 'CSV', step6: 'Upload' }, racAdmin: { title: 'RAC Admin', sec1: 'Schedule', sec1text: '...', step1: 'Sched', step2: 'New', sec2: 'Monitor', sec2text: '...', alert: 'Alert', step3: 'Check', step4: 'Renew' }, racTrainer: { title: 'Trainer', sec1: 'Grading', sec1text: '...', alert: 'DL Check', step1: 'Login', step2: 'Select', step3: 'Grade', step4: 'Save' }, deptAdmin: { title: 'Dept Admin', sec1: 'Print', sec1text: '...', step1: 'Request', step2: 'Print', sec2: 'Reports', sec2text: '...', step3: 'Reports', step4: 'Filter' }, user: { title: 'User', sec1: 'Status', sec1text: '...', compliant: 'Green', nonCompliant: 'Red', sec2: 'Request', sec2text: '...' } },
    alcohol: { title: 'Alcohol Control', subtitle: 'Roadmap', banner: { title: 'Coming Soon', desc: 'IoT Integration', status: 'Dev' }, features: { title: 'Vision', iotTitle: 'IoT', iotDesc: 'Direct integration with industrial breathalyzers to capture results in real-time.', accessTitle: 'Automated Lockout', accessDesc: 'Automatically block turnstile access if alcohol is detected or training is expired.', complianceTitle: 'Compliance Reporting', complianceDesc: 'Unified logs for both safety training and fitness-for-duty checks.' }, protocol: { title: 'Protocol', positiveTitle: 'Positive Test Protocol', positiveDesc: 'If a positive test (>0.00%) is detected, the turnstile locks immediately. The employee is marked as "Blocked" in the database.', resetTitle: '02:00 AM Reset Rule', resetDesc: 'The system automatically unlocks the employee at exactly 02:00:00 hrs the following day, allowing re-entry if sober.' }, challenges: { title: 'Current Challenges', oemIssue: 'Current breathalyzers send data to an external OEM Cloud. This poses data sovereignty risks.', gateSetup: 'Main gate physical layout requires modification.' }, proposal: { title: 'Proposed Solution', faceCap: 'Purchase models with Face Capture.', integration: 'Develop middleware to intercept data.', projectScope: 'Independent project involving Civil & Electrical.' } },
    logs: { title: 'Audit Logs', subtitle: 'Tracking.', levels: { all: 'All', info: 'Info', warn: 'Warn', error: 'Error', audit: 'Audit' }, table: { level: 'Level', timestamp: 'Time', user: 'User', message: 'Msg' } },
    proposal: {
        title: 'Project Proposal: Vulcan Safety Manager',
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
                features: ['Automated scheduling based on expiry (<7 days)', 'Fluxo de Aprovação do Admin RAC', 'Evita tempo de inatividade operacional devido a credenciais expiradas']
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
            }
        },
        conclusion: {
            title: '12. Conclusion',
            text: 'The Vulcan Safety Manager represents a significant step forward for operational safety excellence. By digitizing these critical workflows, Vulcan Mining will not only ensure compliance but also foster a culture of transparency and efficiency. We are committed to delivering a world-class solution that meets your rigorous standards.'
        }
    },
    ai: { systemPromptAdvice: '...', systemPromptReport: '...' }
  },
  pt: {
    nav: {
      dashboard: 'Painel Principal',
      database: 'Base de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Entrada do Instrutor',
      records: 'Registros',
      users: 'Gestão de Usuários',
      schedule: 'Cronograma de Treinos',
      settings: 'Configurações',
      requestCards: 'Solicitar Cartões CARs',
      manuals: 'Manuais do Usuário',
      logs: 'Logs do Sistema',
      proposal: 'Proposta do Projeto',
      presentation: 'Modo Apresentação',
      alcohol: 'Controle de Álcool'
    },
    notifications: {
        expiryTitle: 'Treinamento Expirando',
        expiryMsg: 'Treinamento de {name} ({rac}) expira em {days} dias.',
        autoBookTitle: 'Auto-Agendamento Criado',
        autoBookMsg: '{name} foi auto-agendado para {rac} em {date}.',
        autoBookFailTitle: 'Falha no Auto-Agendamento',
        autoBookFailMsg: 'Não foi possível auto-agendar.',
        capacityTitle: 'Sessão Cheia - Reagendamento',
        capacityMsg: 'funcionários movidos para a próxima sessão em',
        demandTitle: 'Alerta de Alta Demanda',
        demandMsg: 'Alta demanda detectada para',
        duplicateTitle: 'Reserva Duplicada',
        duplicateMsg: 'Usuário já agendado para este tipo de treinamento.'
    },
    common: {
      vulcan: 'Gestor CARs',
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
      title: 'Passaporte Digital',
      verified: 'VERIFICADO',
      notVerified: 'NÃO CONFORME',
      notFound: 'NÃO ENCONTRADO',
      employeeDetails: 'Detalhes',
      activeRacs: 'Certificações Ativas',
      asoStatus: 'Médico (ASO)',
      dlStatus: 'Carta de Condução',
      validUntil: 'Válido Até',
      scanTime: 'Verificado às'
    },
    dashboard: {
      title: 'Visão Geral',
      subtitle: 'Métricas em tempo real.',
      kpi: {
        adherence: 'Adesão HSE',
        certifications: 'Total Certificações',
        pending: 'Pendente Avaliação',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade por RAC',
        complianceSubtitle: 'Verde = Válido.',
        accessTitle: 'Status Geral',
        compliant: 'Conforme',
        missing: 'Ausente',
        nonCompliant: 'Não Conforme'
      },
      upcoming: {
        title: 'Próximas Sessões',
        viewSchedule: 'Ver Cronograma',
        capacity: 'Capacidade',
        status: 'Status',
        date: 'Data',
        session: 'Sessão'
      },
      booked: {
        title: 'Agendados',
        tableEmployee: 'Funcionário',
        tableRac: 'RAC',
        tableDate: 'Data',
        tableRoom: 'Sala',
        noData: 'Sem dados'
      },
      renewal: {
        title: 'Ação Necessária',
        message: 'funcionários expirando.',
        button: 'Agendar'
      }
    },
    database: {
      title: 'Base de Dados',
      subtitle: 'Gerenciar requisitos.',
      filters: 'Filtros',
      accessStatus: 'Status',
      granted: 'Concedido',
      blocked: 'Bloqueado',
      employeeInfo: 'Info',
      aso: 'ASO',
      license: 'Carta',
      class: 'Classe',
      number: 'Número',
      expired: 'EXP',
      active: 'Ativo',
      importCsv: 'Importar',
      downloadTemplate: 'Modelo',
      opsMatrix: 'Matriz Operacional',
      transfer: { title: 'Transferir', subtitle: '...', update: 'Atualizar' },
      ops: { PTS: 'PTS', EXEC_CRED: 'Exec. Cred', EMIT_PTS: 'Emitente PTS', LOB_OPS: 'LOB-OPS', ART: 'ART', APR_ART: 'Aprov. ART', LOB_MOV: 'LOB-MOV' }
    },
    booking: {
      title: 'Agendar Treino',
      secureMode: 'Modo Seguro',
      manageSchedule: 'Gerenciar',
      dlRequired: 'Carta Obrigatória para RAC 02',
      success: 'Sucesso!',
      selectSession: 'Selecionar Sessão',
      chooseSession: 'Escolha...',
      table: { no: 'Nº', nameId: 'Nome/ID', details: 'Detalhes', dlNoClass: 'Carta', dlExpiry: 'Validade', action: 'Ação' },
      addRow: 'Adicionar',
      submitBooking: 'Enviar'
    },
    advisor: { button: 'Consultor', title: 'Consultor AI', sender: 'Vulcan', emptyState: 'Como ajudar?', placeholder: 'Pergunte...' },
    results: { title: 'Registros', subtitle: 'Ver resultados.', searchPlaceholder: 'Pesquisar...', table: { employee: 'Funcionário', session: 'Sessão', date: 'Data', trainer: 'Instrutor', room: 'Sala', dlRac02: 'Carta (RAC02)', theory: 'Teoria', prac: 'Prática', status: 'Status', expiry: 'Validade' } },
    cards: { title: 'Cartões', showing: 'Exibindo', subtitle: 'Selecione.', goToPrint: 'Imprimir', selected: 'Selecionados', successTitle: 'Enviado', successMsg: 'Solicitação enviada.', noRecords: 'Sem Registros', noRecordsSub: 'Apenas aprovados.', selectAll: 'Todos', sending: 'Enviando...', requestButton: 'Solicitar', validation: { ineligible: 'Inelegível.', maxSelection: 'Max 8.', incomplete: 'Incompleto' } },
    trainer: { title: 'Portal Instrutor', subtitle: 'Notas.', passMark: 'Aprovação: 70%', loggedInAs: 'Logado como', selectSession: 'Selecione Sessão', noSessions: 'Sem sessões.', chooseSession: 'Escolha...', dlWarning: 'Verificar Carta.', saveResults: 'Salvar', table: { employee: 'Nome', attendance: 'Presença', dlCheck: 'Verif. Carta', verified: 'Verif.', theory: 'Teoria', practical: 'Prática', rac02Only: '(RAC02)', status: 'Status' } },
    users: { title: 'Usuários', subtitle: 'Gestão.', addUser: 'Novo Usuário', table: { user: 'Usuário', role: 'Função', status: 'Status', actions: 'Ações' }, modal: { title: 'Adicionar', name: 'Nome', email: 'Email', createUser: 'Criar' } },
    schedule: { title: 'Cronograma', subtitle: 'Gerenciar.', newSession: 'Nova Sessão', table: { date: 'Data', rac: 'RAC', room: 'Local', trainer: 'Instrutor' }, modal: { title: 'Agendar', racType: 'RAC', date: 'Data', startTime: 'Início', location: 'Local', capacity: 'Cap', instructor: 'Instr', saveSession: 'Salvar', language: 'Idioma', english: 'Inglês', portuguese: 'Português' } },
    settings: { title: 'Configurações', subtitle: 'Global.', saveAll: 'Salvar', saving: 'Salvando...', tabs: { general: 'Geral', trainers: 'Instrutores', racs: 'RACs' }, rooms: { title: 'Salas', name: 'Nome', capacity: 'Cap', new: 'Nova' }, trainers: { title: 'Instrutores', name: 'Nome', qualifiedRacs: 'RACs', new: 'Novo' }, racs: { title: 'RACs', code: 'Código', description: 'Desc', new: 'Novo' } },
    reports: { title: 'Relatórios', subtitle: 'Análises.', printReport: 'Imprimir', filters: { period: 'Período', department: 'Depto', racType: 'RAC', startDate: 'Início', endDate: 'Fim' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Ano', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Aprovação', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva', trainerMetrics: { title: 'Métricas', name: 'Instrutor', sessions: 'Sessões', passRate: 'Aprov.', avgTheory: 'Teoria', avgPrac: 'Prática' } },
    manuals: { title: 'Manuais', subtitle: 'Docs', sysAdmin: { title: 'Admin', sec1: 'Config', sec1text: '...', step1: '...', step2: '...', step3: '...', sec2: 'Import', sec2text: '...', step4: '...', step5: '...', step6: '...' }, racAdmin: { title: 'RAC Admin', sec1: '...', sec1text: '...', step1: '...', step2: '...', sec2: '...', sec2text: '...', alert: '...', step3: '...', step4: '...' }, racTrainer: { title: 'Instrutor', sec1: '...', sec1text: '...', alert: '...', step1: '...', step2: '...', step3: '...', step4: '...' }, deptAdmin: { title: 'Dept Admin', sec1: '...', sec1text: '...', step1: '...', step2: '...', sec2: '...', sec2text: '...', step3: '...', step4: '...' }, user: { title: 'Geral', sec1: '...', sec1text: '...', compliant: '...', nonCompliant: '...', sec2: '...', sec2text: '...' } },
    alcohol: { title: 'Álcool', subtitle: 'Roteiro', banner: { title: 'Em Breve', desc: 'IoT', status: 'Dev' }, features: { title: 'Visão', iotTitle: 'IoT', iotDesc: 'Integração direta com bafômetros industriais para capturar resultados em tempo real.', accessTitle: 'Bloqueio', accessDesc: 'Bloqueia automaticamente o acesso ao torniquete se álcool for detectado.', complianceTitle: 'Relatório', complianceDesc: 'Logs unificados para treinamento de segurança e verificações.' }, protocol: { title: 'Protocolo', positiveTitle: 'Protocolo de Teste Positivo', positiveDesc: 'Se positivo (>0,00%), o torniquete bloqueia imediatamente. O funcionário é marcado como "Bloqueado".', resetTitle: 'Regra 02:00 AM', resetDesc: 'O sistema desbloqueia automaticamente às 02:00:00 do dia seguinte.' }, challenges: { title: 'Desafios', oemIssue: 'Os bafômetros atuais usam nuvem OEM externa (Risco de Dados).', gateSetup: 'O layout do portão requer modificação física.' }, proposal: { title: 'Proposta', faceCap: 'Captura Facial', integration: 'API Direta', projectScope: 'Engenharia Civil/Elétrica' } },
    logs: { title: 'Logs', subtitle: 'Auditoria.', levels: { all: 'Todos', info: 'Info', warn: 'Aviso', error: 'Erro', audit: 'Auditoria' }, table: { level: 'Nível', timestamp: 'Data', user: 'Usuário', message: 'Msg' } },
    proposal: {
        title: 'Proposta de Projeto: Gestor de Segurança Vulcan',
        digitalTrans: 'Iniciativa de Transformação Digital',
        aboutMe: {
            title: 'Sobre o Desenvolvedor',
            name: 'Pita Antonio Domingos',
            preferred: 'Pita Domingos',
            role: 'Gestor de Contratos (Jachris - Obra Mota Engil)',
            cert: 'Profissional de Ciência de Dados Certificado pela IBM',
            bio: 'Minha jornada em ciência de dados começou com Excel e Power BI, evoluindo para Python, NodeJS e ReactJS. Desenvolvi várias soluções de software, notadamente EduDesk e H365, which are comprehensive SaaS applications featuring tiered subscription models. Meu portfólio também inclui SwiftPOS, MicroFin e JacTrac (Rastreamento de Mangueiras Hidráulicas).',
            portfolio: 'Portfólio: EduDesk (SaaS), H365 (SaaS), SwiftPOS, MicroFin, JacTrac'
        },
        thankYou: {
            title: 'Obrigado',
            message: 'Agradecemos o seu tempo e consideração.',
            contact: 'pita.domingos@zd044.onmicrosoft.com',
            phone: '+258 845479481'
        },
        letter: {
            recipient: 'Para: Equipe de Gestão',
            role: 'Operações de Mineração Vulcan',
            company: 'Tete, Moçambique',
            subject: 'Assunto: Proposta para Implementação do Sistema Digital de Gestão de Segurança',
            salutation: 'Prezada Equipe de Gestão,',
            intro: 'Temos o prazer de submeter esta proposta para o desenvolvimento e implementação do Gestor de Segurança Vulcan (Gestor CARs). Esta solução digital abrangente foi projetada para otimizar a gestão de treinamento de Requisições de Atividade Crítica (RAC), garantindo 100% de visibilidade de conformidade e eficiência operacional.',
            body1: 'Nossa solução aborda os desafios atuais de rastreamento manual, dados fragmentados e relatórios atrasados. Ao centralizar dados de funcionários, registros de treinamento e emissão de credenciais digitais, visamos reduzir significativamente a sobrecarga administrativa e melhorar os padrões de segurança do local.',
            body2: 'O sistema proposto inclui recursos avançados, como relatórios baseados em IA, painéis em tempo real e controle de acesso seguro baseado em funções, adaptados especificamente para o contexto do ambiente de mineração.',
            closing: 'Aguardamos a oportunidade de fazer parceria com a Vulcan Mining nesta iniciativa crítica de segurança.',
            signoff: 'Atenciosamente,',
            team: 'Equipe DigiSols'
        },
        execSummary: {
            title: '1. Resumo Executivo',
            text: 'O Gestor de Segurança Vulcan é uma plataforma web personalizada projetada para digitalizar o processo de ponta a ponta da gestão de treinamento de segurança. Desde o agendamento de sessões até a avaliação de resultados e emissão de cartões de identificação, o sistema fornece uma única fonte de verdade para a conformidade HSE. Ele substitui planilhas manuais e registros em papel por uma base de dados segura e automatizada acessível por Administradores do Sistema, Instrutores RAC e Líderes de Departamento.',
            quote: '"Segurança não é apenas uma prioridade, é um valor fundamental. Nossas ferramentas digitais devem refletir o mesmo padrão de excelência que nosso maquinário operacional."'
        },
        objectives: {
            title: '2. Objetivos do Projeto',
            problemTitle: 'Problema Atual',
            problemText: 'A dependência de planilhas manuais leva à inconsistência de dados, dificuldade em rastrear certificações expirando e atrasos na emissão de cartões físicos. Não há visibilidade em tempo real sobre a prontidão da força de trabalho.',
            solutionTitle: 'Nossa Solução',
            goals: [
                'Base de Dados Centralizada para 15.000+ Funcionários',
                'Notificações Automatizadas de Expiração',
                'Emissão de Cartões Digitais e Físicos',
                'Controle de Acesso Baseado em Função (RBAC)',
                'Análises de Segurança Impulsionadas por IA'
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
            deptAdmin: { title: 'Admin de Depto', desc: 'Acesso somente leitura para seu departamento. Pode solicitar cartões para sua equipe.' },
            racTrainer: { title: 'Instrutor RAC', desc: 'Pode apenas visualizar sessões atribuídas e inserir notas/presença.' },
            user: { title: 'Usuário Geral', desc: 'Pode visualizar seu próprio status e solicitar substituição de cartão.' }
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
            }
        },
        conclusion: {
            title: '12. Conclusão',
            text: 'O Gestor de Segurança Vulcan representa um passo significativo para a excelência em segurança operacional. Ao digitalizar esses fluxos de trabalho críticos, a Vulcan Mining não apenas garantirá a conformidade, mas também promoverá uma cultura de transparência e eficiência. Estamos comprometidos em entregar uma solução de classe mundial que atenda aos seus rigorosos padrões.'
        }
    },
    ai: { systemPromptAdvice: '...', systemPromptReport: '...' }
  }
};