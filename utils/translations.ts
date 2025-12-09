
export type Language = 'en' | 'pt';

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
      proposal: 'Project Proposal'
    },
    common: {
      vulcan: 'VULCAN',
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
      department: 'Department',
      yes: 'Yes',
      no: 'No',
      required: 'Required',
      optional: 'Optional',
      download: 'Download',
      upload: 'Upload',
      template: 'Template',
      import: 'Import Data',
      print: 'Print'
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
      license: 'License',
      class: 'Class',
      number: 'Number',
      expired: 'EXP'
    },
    booking: {
      title: 'Book Training Session',
      secureMode: 'Secure Data Entry Mode',
      manageSchedule: 'Manage Schedule',
      selectSession: 'Select Training Schedule',
      chooseSession: '-- Choose a Session --',
      dlRequired: 'Driver License details required for RAC 02.',
      table: {
        no: 'No.',
        nameId: 'Name & ID',
        details: 'Details',
        dlNoClass: 'DL No. / Class',
        dlExpiry: 'DL Expiry',
        action: 'Action'
      },
      addRow: 'Add Row',
      submitBooking: 'Submit Booking',
      success: 'Booking submitted successfully!'
    },
    trainer: {
      title: 'Trainer Input Portal',
      subtitle: 'Record attendance and exam results.',
      passMark: 'Pass Mark: 70%',
      loggedInAs: 'Logged in as:',
      selectSession: 'Select Active Session',
      noSessions: 'No training sessions are currently assigned to you.',
      chooseSession: '-- Select a Session to Grade --',
      table: {
        employee: 'Employee',
        attendance: 'Attendance',
        dlCheck: 'DL Check',
        verified: 'Verified',
        theory: 'Theory (70%+)',
        practical: 'Practical (70%+)',
        rac02Only: '(RAC 02 Only)',
        status: 'Status'
      },
      saveResults: 'Save Results',
      dlWarning: 'DL Check is mandatory for RAC 02. Unchecked employees will fail.'
    },
    results: {
      title: 'Training Records',
      subtitle: 'Historical view of all training activities. Import legacy data below.',
      searchPlaceholder: 'Search employee...',
      table: {
        employee: 'Employee',
        session: 'Session',
        dlRac02: 'Driver License (RAC 02)',
        theory: 'Theory',
        prac: 'Prac',
        status: 'Status',
        expiry: 'Expiry'
      }
    },
    cards: {
      title: 'Request CARs Cards',
      subtitle: 'Select qualified employees below to receive a PDF via email.',
      goToPrint: 'Go to Print View (A4)',
      selected: 'Selected',
      successTitle: 'Request Sent Successfully!',
      successMsg: 'A PDF containing cards has been sent to your email.',
      noRecords: 'No Eligible Records',
      noRecordsSub: 'No Passed training records available to generate cards.',
      selectAll: 'Select All',
      showing: 'Showing eligible records',
      requestButton: 'Request Cards',
      sending: 'Sending...'
    },
    users: {
      title: 'User Management',
      subtitle: 'Manage system access and roles.',
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
    schedule: {
      title: 'Training Schedule',
      subtitle: 'Upcoming sessions.',
      newSession: 'New Session',
      table: {
        date: 'Date',
        rac: 'RAC',
        room: 'Room',
        trainer: 'Trainer'
      },
      modal: {
        title: 'Add New Session',
        racType: 'RAC Type',
        date: 'Date',
        startTime: 'Start Time',
        location: 'Location',
        capacity: 'Capacity',
        instructor: 'Instructor',
        saveSession: 'Save Session'
      }
    },
    settings: {
      title: 'System Configuration',
      subtitle: 'Manage Room Capacities, Trainers, and Global Settings.',
      saveAll: 'Save All Configurations',
      saving: 'Saving...',
      tabs: {
        general: 'General & Rooms',
        trainers: 'Trainers',
        racs: 'RAC Definitions'
      },
      rooms: {
        title: 'Room Configurations',
        name: 'Room Name',
        capacity: 'Capacity',
        new: 'New Room Name'
      },
      trainers: {
        title: 'Authorized Trainers',
        name: 'Name',
        qualifiedRacs: 'Qualified RACs',
        new: 'New Trainer Name'
      },
      racs: {
        title: 'RAC Definitions',
        code: 'Code',
        description: 'Description',
        new: 'RAC Code'
      }
    },
    reports: {
      title: 'Safety Reports & Analytics',
      subtitle: 'Generate insights using AI based on training data.',
      printReport: 'Print Report',
      filters: {
        period: 'Period',
        department: 'Department',
        racType: 'RAC Type'
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
        performance: 'Performance by RAC'
      },
      executiveAnalysis: 'Executive Analysis',
      trainerMetrics: {
        title: 'Trainer Performance Metrics',
        name: 'Trainer Name',
        sessions: 'Sessions / Students',
        passRate: 'Pass Rate',
        avgTheory: 'Avg Theory',
        avgPrac: 'Avg Practical'
      }
    },
    logs: {
      title: 'System Logs',
      subtitle: 'Audit trail and system events.',
      table: {
        level: 'Level',
        timestamp: 'Timestamp',
        user: 'User',
        message: 'Message'
      },
      levels: {
        all: 'All Levels',
        info: 'Info',
        warn: 'Warning',
        error: 'Error',
        audit: 'Audit'
      }
    },
    advisor: {
      button: 'Safety Advisor',
      title: 'AI Safety Assistant',
      sender: 'Advisor',
      placeholder: 'Ask about safety...',
      emptyState: 'Ask about RAC protocols, PPE requirements, or general safety guidelines.'
    },
    proposal: {
      title: 'Critical Activity Requisitions (RAC) Management System',
      digitalTrans: 'Digital Transformation Proposal',
      execSummary: {
        title: '1. Executive Summary',
        text: 'The Vulcan RAC Manager is a specialized enterprise application designed to streamline the safety training lifecycle for Critical Activity Requisitions (RAC 01 - RAC 10). By migrating from manual spreadsheets to a centralized digital platform, Vulcan Mining aims to eliminate compliance gaps, automate expiry management, and enforce strict access control protocols.',
        quote: '"A smart safety engine that not only tracks training but actively manages compliance through automated booking intervention and intelligent gate access logic."'
      },
      organogram: {
        title: '2. Project Team Structure (Organogram)',
        pm: 'Project Manager',
        delivery: 'Overall Delivery',
        tech1: 'Site Technician 1',
        tech2: 'Site Technician 2',
        regime: 'ADM Regime',
        days: '5 Days / Week'
      },
      roles: {
        title: '3. User Roles & Access Control',
        sysAdmin: { title: 'System Admin', desc: 'Full system control, configuration, user management, and mass data operations.' },
        racAdmin: { title: 'RAC Admin', desc: 'Manages training schedules, defines RAC parameters, and oversees operational compliance.' },
        deptAdmin: { title: 'Departmental Admin', desc: 'View-only access to reports and card requests for their specific department.' },
        racTrainer: { title: 'RAC Trainer', desc: 'Conducts sessions, grades employees, verifies Driver Licenses, and records attendance.' },
        user: { title: 'User (Employee)', desc: 'Personal dashboard access to view training status and request own digital cards.' }
      },
      financials: {
        title: '4. Financial Proposal',
        item: 'Item',
        type: 'Type',
        cost: 'Cost',
        items: [
           { name: 'Software Development', type: 'Once-off' },
           { name: 'Cloud Infrastructure Setup', type: 'Once-off' },
           { name: 'Cloud Tier Subscription', type: 'Monthly' },
           { name: 'New Features after Deployment', type: 'On-demand' },
           { name: 'Seasonal updates', type: 'Seasonal' }
        ],
        total: 'Total Initial Investment (Items 1 + 2)'
      },
      roadmap: {
        title: '5. Post-Approval Implementation Roadmap (TODO)',
        intro: 'The following critical components will be finalized and deployed immediately following the approval of this proposal and settlement of the initial Software Development fee:',
        auth: '1. User Authentication Module',
        authDesc: 'Implementation of secure Login/Logout functionality with role-based access control (RBAC), replacing the current simulation mode with secure credential validation.',
        db: '2. Persistent Database Integration',
        dbDesc: 'Migration of data structure from prototype memory to a scalable Production Database (PostgreSQL/Cloud SQL) to ensure data persistence and integrity.',
        email: '3. SMTP Email Gateway',
        emailDesc: 'Activation of the live email service to deliver PDF CARs cards and automated expiry notifications to real user email addresses.',
        hosting: '4. Production Hosting & Security',
        hostingDesc: 'Deployment of the finalized application to a secure cloud environment with SSL encryption, domain configuration, and load balancing.'
      }
    },
    manuals: {
      title: 'Operational Manuals',
      subtitle: 'Select a role to view instructions.',
      sysAdmin: {
        title: 'System Administrator Manual',
        sec1: '1. System Configuration',
        sec1text: 'Navigate to the System Settings page to configure core parameters.',
        step1: 'Manage Rooms: Click the "General" tab to Add or Edit room capacities.',
        step2: 'Authorize Trainers: Go to "Trainers" tab. Add new trainers and assign their qualified RACs.',
        step3: 'Save Changes: Ensure you click "Save All Configurations" to persist changes to the database.',
        sec2: '2. Mass Data Import',
        sec2text: 'Use the Database page to bulk upload historical records.',
        step4: 'Download Template: Click the template button to get the correct CSV format.',
        step5: 'Prepare Data: Fill the CSV. For RAC 02, ensure DL Number and Class are included.',
        step6: 'Upload: Click "Import Data" and select your file.'
      },
      racAdmin: {
        title: 'RAC Administrator Manual',
        sec1: '1. Scheduling Training',
        sec1text: 'Plan upcoming sessions via the Schedule Trainings page.',
        step1: 'Create Session: Click "New Session" button.',
        step2: 'Define Parameters: Select RAC Type, Date, Time, and Room. The system checks capacity.',
        sec2: '2. Monitoring Compliance',
        sec2text: 'Use the Dashboard to track expiry risks.',
        alert: 'Automatic Actions: The system sends warning emails at 30 days and auto-books training at 7 days remaining.',
        step3: 'Review Expiring: Check the "Expiring (30 Days)" card.',
        step4: 'Manual Renewal: Click "Book Renewals" to auto-fill the booking form with at-risk employees.'
      },
      racTrainer: {
        title: 'RAC Trainer Manual',
        sec1: '1. Grading & Verification',
        sec1text: 'Access the Trainer Input portal to manage live sessions.',
        alert: 'CRITICAL: For RAC 02, you MUST physically inspect the Driver License.',
        step1: 'Select Session: Choose your active class from the dropdown.',
        step2: 'Mark Attendance: Check the box for present employees.',
        step3: 'RAC 02 DL Check: Verify License Validtity and check the "Verified" box. If unchecked, the user Fails.',
        step4: 'Enter Scores: Input Theory (and Practical) scores. Pass mark is 70%.'
      },
      deptAdmin: {
        title: 'Departmental Admin Manual',
        sec1: '1. Generating Cards',
        sec1text: 'Go to Request CARs Cards.',
        step1: 'Select Employees: Click cards to select them (Green Checkmark appears).',
        step2: 'Generate PDF: Click "Request Cards" to trigger email delivery or "Go to Print View" for immediate printing.',
        sec2: '2. Reports',
        sec2text: 'Use Reports & Analytics to monitor your team.',
        step3: 'Filter Data: Select your Department from the dropdown.',
        step4: 'Check Absences: Review the "No Show" table on the right.'
      },
      user: {
        title: 'Employee User Manual',
        sec1: '1. Dashboard Overview',
        sec1text: 'Your Dashboard shows your live compliance status.',
        compliant: 'Compliant (Green) - You are safe to work.',
        nonCompliant: 'Non-Compliant (Red) - Contact your supervisor immediately.',
        sec2: '2. Digital Card',
        sec2text: 'Your physical card contains a QR Code. Security can scan this to verify your training in real-time.'
      }
    },
    notifications: {
      expiryTitle: 'Expiry Warning Email Sent',
      expiryMsg: 'Email sent to {name} & Dept Admin: {rac} expires in {days} days.',
      autoBookTitle: 'Auto-Booking & Email Sent',
      autoBookMsg: 'CRITICAL: {name} expiring in {days} days. Auto-booked for {date}.',
      autoBookFailTitle: 'Auto-Booking Failed',
      autoBookFailMsg: 'Could not auto-book {name} for {rac}. No future sessions available!'
    },
    ai: {
        systemPromptAdvice: 'You are an expert Industrial Safety Consultant for Vulcan Mining. Provide concise, actionable safety advice regarding {rac}. Focus on Critical Activity Requirements (RAC). Keep answers under 100 words. Please answer in {language}.',
        systemPromptReport: 'You are a Senior Safety Data Analyst for Vulcan Mining. Generate a professional, formatted safety training report. Report should include Executive Summary, Key Metrics, Trends, and Recommendations. Format with Markdown. Please write the report in {language}.'
    }
  },
  pt: {
    nav: {
      dashboard: 'Painel de Controle',
      database: 'Banco de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Portal do Instrutor',
      records: 'Registros',
      users: 'Gestão de Usuários',
      schedule: 'Agendar Sessões',
      settings: 'Config do Sistema',
      requestCards: 'Solicitar Cartões',
      manuals: 'Manuais do Usuário',
      logs: 'Logs do Sistema',
      proposal: 'Proposta do Projeto'
    },
    common: {
      vulcan: 'VULCAN',
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
      status: 'Estado',
      name: 'Nome',
      email: 'Email',
      id: 'ID',
      company: 'Empresa',
      department: 'Departamento',
      yes: 'Sim',
      no: 'Não',
      required: 'Obrigatório',
      optional: 'Opcional',
      download: 'Baixar',
      upload: 'Carregar',
      template: 'Modelo',
      import: 'Importar Dados',
      print: 'Imprimir'
    },
    dashboard: {
      title: 'Visão Geral Operacional',
      subtitle: 'Métricas de segurança em tempo real.',
      kpi: {
        adherence: 'Aderência HST',
        certifications: 'Total Certificados',
        pending: 'Avaliação Pendente',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade de Treinamento por RAC e ASO',
        complianceSubtitle: 'Mostra status obrigatório. Verde = Válido. Vermelho = Faltante/Expirado.',
        accessTitle: 'Status de Acesso da Força de Trabalho',
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
        tableRac: 'RAC Agendado',
        tableDate: 'Data',
        tableRoom: 'Sala',
        noData: 'Nenhum agendamento encontrado'
      },
      renewal: {
        title: 'Ação Necessária: Renovação de Treinamento',
        message: 'funcionários têm treinamentos críticos expirando em 30 dias.',
        button: 'Agendar Renovações'
      }
    },
    database: {
      title: 'Banco de Dados Mestre',
      subtitle: 'Gerenciar requisitos. RAC 02 é auto-desativado se a Carta estiver expirada.',
      filters: 'Filtros',
      accessStatus: 'Status de Acesso',
      granted: 'Concedido',
      blocked: 'Bloqueado',
      employeeInfo: 'Info Func. e Carta',
      aso: 'ASO (Médico)',
      license: 'Carta',
      class: 'Classe',
      number: 'Número',
      expired: 'EXP'
    },
    booking: {
      title: 'Agendar Sessão de Treinamento',
      secureMode: 'Modo de Entrada Segura',
      manageSchedule: 'Gerenciar Agenda',
      selectSession: 'Selecionar Sessão de Treinamento',
      chooseSession: '-- Escolha uma Sessão --',
      dlRequired: 'Detalhes da Carta de Condução obrigatórios para RAC 02.',
      table: {
        no: 'Nº',
        nameId: 'Nome e ID',
        details: 'Detalhes',
        dlNoClass: 'Nº Carta / Classe',
        dlExpiry: 'Validade Carta',
        action: 'Ação'
      },
      addRow: 'Adicionar Linha',
      submitBooking: 'Enviar Agendamento',
      success: 'Agendamento enviado com sucesso!'
    },
    trainer: {
      title: 'Portal do Instrutor',
      subtitle: 'Registrar presença e resultados de exames.',
      passMark: 'Nota de Aprovação: 70%',
      loggedInAs: 'Logado como:',
      selectSession: 'Selecionar Sessão Ativa',
      noSessions: 'Nenhuma sessão de treinamento atribuída a você no momento.',
      chooseSession: '-- Selecione uma Sessão para Avaliar --',
      table: {
        employee: 'Funcionário',
        attendance: 'Presença',
        dlCheck: 'Verif. Carta',
        verified: 'Verificado',
        theory: 'Teoria (70%+)',
        practical: 'Prática (70%+)',
        rac02Only: '(Apenas RAC 02)',
        status: 'Estado'
      },
      saveResults: 'Salvar Resultados',
      dlWarning: 'Verificação da Carta é obrigatória para RAC 02. Funcionários não verificados reprovarão.'
    },
    results: {
      title: 'Registros de Treinamento',
      subtitle: 'Visão histórica de todas as atividades. Importe dados legados abaixo.',
      searchPlaceholder: 'Pesquisar funcionário...',
      table: {
        employee: 'Funcionário',
        session: 'Sessão',
        dlRac02: 'Carta Condução (RAC 02)',
        theory: 'Teoria',
        prac: 'Prát',
        status: 'Estado',
        expiry: 'Validade'
      }
    },
    cards: {
      title: 'Solicitar Cartões CARs',
      subtitle: 'Selecione funcionários qualificados abaixo para receber um PDF por email.',
      goToPrint: 'Ir para Visualização de Impressão (A4)',
      selected: 'Selecionado',
      successTitle: 'Solicitação Enviada com Sucesso!',
      successMsg: 'Um PDF contendo cartões foi enviado para o seu email.',
      noRecords: 'Nenhum Registro Elegível',
      noRecordsSub: 'Nenhum registro de treinamento "Aprovado" disponível para gerar cartões.',
      selectAll: 'Selecionar Tudo',
      showing: 'Mostrando registros elegíveis',
      requestButton: 'Solicitar Cartões',
      sending: 'Enviando...'
    },
    users: {
      title: 'Gestão de Usuários',
      subtitle: 'Gerenciar acesso ao sistema e funções.',
      addUser: 'Adicionar Usuário',
      table: {
        user: 'Usuário',
        role: 'Função',
        status: 'Estado',
        actions: 'Ações'
      },
      modal: {
        title: 'Adicionar Novo Usuário',
        name: 'Nome Completo',
        email: 'Endereço de Email',
        createUser: 'Criar Usuário'
      }
    },
    schedule: {
      title: 'Cronograma de Treinamento',
      subtitle: 'Próximas sessões.',
      newSession: 'Nova Sessão',
      table: {
        date: 'Data',
        rac: 'RAC',
        room: 'Sala',
        trainer: 'Instrutor'
      },
      modal: {
        title: 'Adicionar Nova Sessão',
        racType: 'Tipo de RAC',
        date: 'Data',
        startTime: 'Hora de Início',
        location: 'Localização',
        capacity: 'Capacidade',
        instructor: 'Instrutor',
        saveSession: 'Salvar Sessão'
      }
    },
    settings: {
      title: 'Configuração do Sistema',
      subtitle: 'Gerenciar Capacidades de Sala, Instrutores e Configurações Globais.',
      saveAll: 'Salvar Todas as Configurações',
      saving: 'Salvando...',
      tabs: {
        general: 'Geral e Salas',
        trainers: 'Instrutores',
        racs: 'Definições RAC'
      },
      rooms: {
        title: 'Configurações de Sala',
        name: 'Nome da Sala',
        capacity: 'Capacidade',
        new: 'Novo Nome de Sala'
      },
      trainers: {
        title: 'Instrutores Autorizados',
        name: 'Nome',
        qualifiedRacs: 'RACs Qualificados',
        new: 'Novo Nome de Instrutor'
      },
      racs: {
        title: 'Definições de RAC',
        code: 'Código',
        description: 'Descrição',
        new: 'Código RAC'
      }
    },
    reports: {
      title: 'Relatórios e Análises de Segurança',
      subtitle: 'Gerar insights usando IA com base nos dados de treinamento.',
      printReport: 'Imprimir Relatório',
      filters: {
        period: 'Período',
        department: 'Departamento',
        racType: 'Tipo de RAC'
      },
      periods: {
        weekly: 'Últimos 7 Dias',
        monthly: 'Últimos 30 Dias',
        ytd: 'Ano até Data',
        custom: 'Intervalo Personalizado'
      },
      generate: 'Gerar Relatório IA',
      analyzing: 'Analisando...',
      stats: {
        totalTrained: 'Total Treinado',
        passRate: 'Taxa de Aprovação',
        attendance: 'Presença',
        noShows: 'Não Comparecimentos'
      },
      charts: {
        performance: 'Desempenho por RAC'
      },
      executiveAnalysis: 'Análise Executiva',
      trainerMetrics: {
        title: 'Métricas de Desempenho do Instrutor',
        name: 'Nome do Instrutor',
        sessions: 'Sessões / Alunos',
        passRate: 'Taxa de Aprovação',
        avgTheory: 'Média Teoria',
        avgPrac: 'Média Prática'
      }
    },
    logs: {
      title: 'Logs do Sistema',
      subtitle: 'Trilha de auditoria e eventos do sistema.',
      table: {
        level: 'Nível',
        timestamp: 'Carimbo de Tempo',
        user: 'Usuário',
        message: 'Mensagem'
      },
      levels: {
        all: 'Todos os Níveis',
        info: 'Info',
        warn: 'Aviso',
        error: 'Erro',
        audit: 'Auditoria'
      }
    },
    advisor: {
      button: 'Consultor de Segurança',
      title: 'Assistente de Segurança IA',
      sender: 'Consultor',
      placeholder: 'Pergunte sobre segurança...',
      emptyState: 'Pergunte sobre protocolos RAC, requisitos de EPI ou diretrizes gerais de segurança.'
    },
    proposal: {
      title: 'Sistema de Gestão de Requisições de Atividade Crítica (RAC)',
      digitalTrans: 'Proposta de Transformação Digital',
      execSummary: {
        title: '1. Resumo Executivo',
        text: 'O Vulcan RAC Manager é um aplicativo corporativo especializado projetado para otimizar o ciclo de vida do treinamento de segurança para Requisições de Atividade Crítica (RAC 01 - RAC 10). Ao migrar de planilhas manuais para uma plataforma digital centralizada, a Vulcan Mining visa eliminar lacunas de conformidade, automatizar o gerenciamento de validade e impor protocolos rígidos de controle de acesso.',
        quote: '"Um mecanismo de segurança inteligente que não apenas rastreia o treinamento, mas gerencia ativamente a conformidade por meio de intervenção automatizada de agendamento e lógica de acesso inteligente à portaria."'
      },
      organogram: {
        title: '2. Estrutura da Equipe do Projeto (Organograma)',
        pm: 'Gerente de Projeto',
        delivery: 'Entrega Geral',
        tech1: 'Técnico de Site 1',
        tech2: 'Técnico de Site 2',
        regime: 'Regime ADM',
        days: '5 Dias / Semana'
      },
      roles: {
        title: '3. Funções de Usuário e Controle de Acesso',
        sysAdmin: { title: 'Admin do Sistema', desc: 'Controle total do sistema, configuração, gestão de usuários e operações de dados em massa.' },
        racAdmin: { title: 'Admin RAC', desc: 'Gerencia cronogramas de treinamento, define parâmetros RAC e supervisiona a conformidade operacional.' },
        deptAdmin: { title: 'Admin Departamental', desc: 'Acesso apenas visualização a relatórios e solicitações de cartão para seu departamento específico.' },
        racTrainer: { title: 'Instrutor RAC', desc: 'Conduz sessões, avalia funcionários, verifica Cartas de Condução e registra presença.' },
        user: { title: 'Usuário (Funcionário)', desc: 'Acesso ao painel pessoal para ver status de treinamento e solicitar seus próprios cartões digitais.' }
      },
      financials: {
        title: '4. Proposta Financeira',
        item: 'Item',
        type: 'Tipo',
        cost: 'Custo',
        items: [
           { name: 'Desenvolvimento de Software', type: 'Pagamento Único' },
           { name: 'Configuração de Infraestrutura em Nuvem', type: 'Pagamento Único' },
           { name: 'Assinatura de Nível de Nuvem', type: 'Mensal' },
           { name: 'Novos Recursos após Implantação', type: 'Sob Demanda' },
           { name: 'Atualizações Sazonais', type: 'Sazonal' }
        ],
        total: 'Investimento Inicial Total (Itens 1 + 2)'
      },
      roadmap: {
        title: '5. Roteiro de Implementação Pós-Aprovação (A FAZER)',
        intro: 'Os seguintes componentes críticos serão finalizados e implantados imediatamente após a aprovação desta proposta e o pagamento da taxa inicial de Desenvolvimento de Software:',
        auth: '1. Módulo de Autenticação de Usuário',
        authDesc: 'Implementação de funcionalidade segura de Login/Logout com controle de acesso baseado em função (RBAC), substituindo o modo de simulação atual por validação segura de credenciais.',
        db: '2. Integração de Banco de Dados Persistente',
        dbDesc: 'Migração da estrutura de dados da memória do protótipo para um Banco de Dados de Produção escalável (PostgreSQL/Cloud SQL) para garantir persistência e integridade dos dados.',
        email: '3. Gateway de Email SMTP',
        emailDesc: 'Ativação do serviço de email ao vivo para entregar cartões CARs em PDF e notificações automáticas de validade para endereços de email reais dos usuários.',
        hosting: '4. Hospedagem e Segurança de Produção',
        hostingDesc: 'Implantação do aplicativo finalizado em um ambiente de nuvem seguro com criptografia SSL, configuração de domínio e balanceamento de carga.'
      }
    },
    manuals: {
      title: 'Manuais Operacionais',
      subtitle: 'Selecione uma função para ver instruções.',
      sysAdmin: {
        title: 'Manual do Administrador do Sistema',
        sec1: '1. Configuração do Sistema',
        sec1text: 'Navegue até a página Configurações do Sistema para configurar parâmetros principais.',
        step1: 'Gerenciar Salas: Clique na aba "Geral" para Adicionar ou Editar capacidades de sala.',
        step2: 'Autorizar Instrutores: Vá para a aba "Instrutores". Adicione novos instrutores e atribua seus RACs qualificados.',
        step3: 'Salvar Alterações: Certifique-se de clicar em "Salvar Todas as Configurações" para persistir as alterações no banco de dados.',
        sec2: '2. Importação de Dados em Massa',
        sec2text: 'Use a página Banco de Dados para carregar registros históricos em massa.',
        step4: 'Baixar Modelo: Clique no botão de modelo para obter o formato CSV correto.',
        step5: 'Preparar Dados: Preencha o CSV. Para RAC 02, certifique-se de que o Número e Classe da Carta estejam incluídos.',
        step6: 'Carregar: Clique em "Importar Dados" e selecione seu arquivo.'
      },
      racAdmin: {
        title: 'Manual do Administrador RAC',
        sec1: '1. Agendamento de Treinamento',
        sec1text: 'Planeje as próximas sessões através da página Cronograma de Treinamento.',
        step1: 'Criar Sessão: Clique no botão "Nova Sessão".',
        step2: 'Definir Parâmetros: Selecione Tipo de RAC, Data, Hora e Sala. O sistema verifica a capacidade.',
        sec2: '2. Monitoramento de Conformidade',
        sec2text: 'Use o Painel de Controle para rastrear riscos de validade.',
        alert: 'Ações Automáticas: O sistema envia emails de aviso aos 30 dias e agenda automaticamente o treinamento aos 7 dias restantes.',
        step3: 'Revisar Expirando: Verifique o cartão "Expirando (30 Dias)".',
        step4: 'Renovação Manual: Clique em "Agendar Renovações" para preencher automaticamente o formulário de agendamento com funcionários em risco.'
      },
      racTrainer: {
        title: 'Manual do Instrutor RAC',
        sec1: '1. Avaliação e Verificação',
        sec1text: 'Acesse o portal de Entrada do Instrutor para gerenciar sessões ao vivo.',
        alert: 'CRÍTICO: Para RAC 02, você DEVE inspecionar fisicamente a Carta de Condução.',
        step1: 'Selecionar Sessão: Escolha sua turma ativa no menu suspenso.',
        step2: 'Marcar Presença: Marque a caixa para funcionários presentes.',
        step3: 'RAC 02 DL Check: Verifique a validade da Carta e marque a caixa "Verificado". Se desmarcado, o usuário Reprova.',
        step4: 'Inserir Notas: Insira notas de Teoria (e Prática). A nota de aprovação é 70%.'
      },
      deptAdmin: {
        title: 'Manual do Admin Departamental',
        sec1: '1. Geração de Cartões',
        sec1text: 'Vá para Solicitar Cartões CARs.',
        step1: 'Selecionar Funcionários: Clique nos cartões para selecioná-los (Marca de Seleção Verde aparece).',
        step2: 'Gerar PDF: Clique em "Solicitar Cartões" para acionar a entrega por email ou "Ir para Visualização de Impressão" para impressão imediata.',
        sec2: '2. Relatórios',
        sec2text: 'Use Relatórios e Análises para monitorar sua equipe.',
        step3: 'Filtrar Dados: Selecione seu Departamento no menu suspenso.',
        step4: 'Verificar Ausências: Revise a tabela "Não Comparecimentos" à direita.'
      },
      user: {
        title: 'Manual do Usuário (Funcionário)',
        sec1: '1. Visão Geral do Painel',
        sec1text: 'Seu Painel mostra seu status de conformidade ao vivo.',
        compliant: 'Conforme (Verde) - Você está seguro para trabalhar.',
        nonCompliant: 'Não Conforme (Vermelho) - Contate seu supervisor imediatamente.',
        sec2: '2. Cartão Digital',
        sec2text: 'Seu cartão físico contém um Código QR. A segurança pode escaneá-lo para verificar seu treinamento em tempo real.'
      }
    },
    notifications: {
      expiryTitle: 'Aviso de Expiração Enviado',
      expiryMsg: 'Email enviado para {name} e Admin Dept: {rac} expira em {days} dias.',
      autoBookTitle: 'Auto-Agendamento e Email Enviado',
      autoBookMsg: 'CRÍTICO: {name} expirando em {days} dias. Auto-agendado para {date}.',
      autoBookFailTitle: 'Falha no Auto-Agendamento',
      autoBookFailMsg: 'Não foi possível auto-agendar {name} para {rac}. Nenhuma sessão futura disponível!'
    },
    ai: {
        systemPromptAdvice: 'Você é um Consultor de Segurança Industrial especialista para a Vulcan Mining. Forneça conselhos de segurança concisos e acionáveis sobre {rac}. Foque nos Requisitos de Atividade Crítica (RAC). Mantenha as respostas com menos de 100 palavras. Por favor, responda em Português.',
        systemPromptReport: 'Você é um Analista de Dados de Segurança Sênior da Vulcan Mining. Gere um relatório de treinamento de segurança profissional e formatado. O relatório deve incluir Resumo Executivo, Métricas Principais, Tendências e Recomendações. Formate com Markdown. Por favor, escreva o relatório em Português.'
    }
  }
};
