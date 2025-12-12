
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
    logs: { title: 'Audit Logs', subtitle: 'Tracking.', levels: { all: 'All', info: 'Info', warn: 'Warn', error: 'Error', audit: 'Audit' }, table: { level: 'Level', timestamp: 'Time', user: 'User', message: 'Msg' } },
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
            title: '4. User Roles & Permissions',
            sysAdmin: { title: 'System Admin', desc: 'Full access to all settings, user management, and configuration.' },
            racAdmin: { title: 'RAC Admin', desc: 'Manages training schedules, approves results, and oversees compliance.' },
            deptAdmin: { title: 'Dept Admin', desc: 'Read-only access for their department. Can request cards for their team.' },
            racTrainer: { title: 'RAC Trainer', desc: 'Can only view assigned sessions and input grades/attendance.' },
            user: { title: 'General User', desc: 'Can view their own status and request card replacement.' }
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
            backend: 'Node.js (Browser-Simulated for Prototype), RESTful Architecture',
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
            }
        },
        conclusion: {
            title: '12. Conclusão',
            text: 'O Gestor de RACS representa um passo significativo para a excelência em segurança operacional. Ao digitalizar esses fluxos de trabalho críticos, a Vulcan Mining não apenas garantirá a conformidade, mas também promoverá uma cultura de transparência e eficiência. Estamos comprometidos em entregar uma solução de classe mundial que atenda aos seus rigorosos padrões.'
        }
    },
    ai: { systemPromptAdvice: '...', systemPromptReport: '...' }
  }
};
