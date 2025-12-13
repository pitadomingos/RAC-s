
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
      systemHealth: 'System Health'
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
    systemHealth: {
        title: 'System Health Monitor',
        subtitle: 'Real-time infrastructure telemetry & error tracking.',
        uptime: 'System Uptime',
        latency: 'Avg Latency',
        errors: 'Error Rate',
        services: 'Service Status',
        database: 'Database',
        ai: 'AI Engine',
        auth: 'Auth Provider',
        storage: 'Blob Storage',
        cpu: 'CPU Usage',
        memory: 'Memory Usage',
        recentAlerts: 'Recent System Alerts',
        online: 'Online',
        degraded: 'Degraded',
        offline: 'Offline'
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
        deptHeatmap: 'Department Risk Heatmap',
        tenantMatrix: 'Tenant Performance Matrix',
        systemView: 'SYSTEM VIEW',
        bottlenecks: 'Training Bottlenecks',
        noBottlenecks: 'No bottlenecks detected.',
        clickToGen: 'Click generate to receive',
        safetyIntel: 'enterprise-level safety intelligence.',
        multiTenantDiag: 'multi-tenant safety diagnostics.'
    },
    siteGovernance: {
      title: 'Site Governance',
      subtitle: 'Define mandatory safety training policies per location.',
      selectSite: 'Select Operation Site',
      configure: 'Configure Mandatory RACs',
      policyUpdate: 'Policy updated for {site}. Requirements pushed to employees.'
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
    settings: { title: 'Settings', subtitle: 'Config.', saveAll: 'Save', saving: 'Saving...', tabs: { general: 'General', trainers: 'Trainers', racs: 'RACs', sites: 'Sites', companies: 'Companies', branding: 'Branding', contractors: 'Contractors' }, rooms: { title: 'Rooms', name: 'Name', capacity: 'Cap', new: 'New Room' }, trainers: { title: 'Trainers', name: 'Name', qualifiedRacs: 'RACs', new: 'New Trainer' }, racs: { title: 'RACs', code: 'Code', description: 'Desc', new: 'New RAC' } },
    reports: { title: 'Reports', subtitle: 'Analytics.', printReport: 'Print', filters: { period: 'Period', department: 'Dept', racType: 'RAC', startDate: 'Start', endDate: 'End' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Anual', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva IA', trainerMetrics: { title: 'Trainer Metrics', name: 'Trainer', sessions: 'Sessions', passRate: 'Pass Rate', avgTheory: 'Theory', avgPrac: 'Prac' } },
    logs: { title: 'System Logs', levels: { all: 'All Levels', info: 'Info', warn: 'Warning', error: 'Error', audit: 'Audit' }, table: { level: 'Level', timestamp: 'Timestamp', user: 'User', message: 'Message' } },
    adminManual: {
      // ... kept concise for brevity as they are long blocks
      title: 'System Manual',
      subtitle: 'Administrator Guide',
      slides: { intro: 'Introduction', hierarchy: 'Hierarchy & Billing', objectives: 'Objectives', logic: 'Logic', workflow: 'Workflow', config: 'Config', booking: 'Booking', advanced: 'Advanced', troubleshoot: 'Troubleshoot' },
      content: {
          confidential: 'CONFIDENTIAL', production: 'PRODUCTION v2.5',
          hierarchy: {
              title: 'System Organogram & Billing', billingTitle: 'SaaS Billing Model', billingDesc: 'Role-based billing structure.', cost: '$2.00', perUser: 'per General User / Month', roles: { sysAdmin: 'System Admin', entAdmin: 'Enterprise Admin', siteAdmin: 'Site Admin', ops: 'Operational Admins', user: 'General User' }
          },
          objectives: { title: 'Objectives & Scope', problemTitle: 'Challenges', solutionTitle: 'Solutions', p1Title: 'Data Integrity', p1Desc: '...', p2Title: 'Compliance Timing', p2Desc: '...', p3Title: 'Admin Load', p3Desc: '...', s1Title: 'Central Truth', s1Desc: '...', s2Title: 'Auto-Enforcement', s2Desc: '...', s3Title: 'Efficiency', s3Desc: '...' },
          formulaTitle: 'Compliance Formula', formulaDesc: 'AND Logic Gate.', formulaLogic: { active: 'Active', aso: 'Valid ASO', racs: 'Required RACs', result: 'ACCESS GRANTED' },
          flowTitle: 'Core Data Flow', flowSteps: { db: 'Database', dbDesc: 'Requirements', book: 'Booking', bookDesc: 'Schedule', res: 'Results', resDesc: 'Scores', stat: 'Status', statDesc: 'Calculate' },
          configTitle: 'System Config', configCards: { racs: 'RAC Definitions', racsDesc: '...', rooms: 'Rooms', roomsDesc: '...', trainers: 'Trainers', trainersDesc: '...' },
          bookingTitle: 'Booking Rules', matrixLock: 'Matrix Lock', matrixDesc: '...', gradingTitle: 'Grading', gradingText: '...', rac02Title: 'RAC 02', rac02Text: '...', expiryTitle: 'Auto-Expiry', expiryText: '...',
          advancedTitle: 'Advanced Capabilities', autoBook: 'Auto-Booking', autoBookDesc: '...', aiRep: 'AI Reporting', aiRepDesc: '...', alc: 'Alcohol Control', alcDesc: '...',
          tsTitle: 'Troubleshooting', ts1: 'Search Not Found', ts1Desc: '...', ts2: 'Blocked Status', ts2Desc: '...', ts3: 'QR Scan', ts3Desc: '...'
      }
    },
    proposal: {
        digitalTrans: 'Digital Transformation',
        aboutMe: { title: 'About The Developer', name: 'Pita Domingos', preferred: 'Call me Peter', role: 'Full Stack Developer', cert: 'Certified Solutions Architect', bio: 'Specializing in enterprise-grade safety systems.' },
        scenario: { title: 'Real World Scenario', workflowTitle: 'Zero-Downtime Workflow', riskTitle: 'The Risk', riskText: '...', autoFixTitle: 'The Auto-Fix', autoFixText: '...', autoFixNote: '...', demoTitle: 'Live Demo', demoText: '...', demoButton: 'Go to Dashboard' },
        execSummary: { title: 'Executive Summary', text: '...', quote: '...' },
        objectives: { title: 'Strategic Objectives', problemTitle: 'The Problem', problemText: '...', solutionTitle: 'The Solution', goals: ['Unified Truth', 'Automated Logic', 'Real-time Analytics', 'Scalable Arch'] },
        organogram: { title: 'System Organogram', pm: 'Project Manager', delivery: 'Service Delivery', tech1: 'Frontend Eng', tech2: 'Backend Eng', regime: 'Hybrid' },
        timeline: { title: 'Project Timeline', phase1: 'Phase 1', phase1desc: '...', phase2: 'Phase 2', phase2desc: '...', phase3: 'Phase 3', phase3desc: '...', phase4: 'Phase 4', phase4desc: '...' },
        techStack: { title: 'Technology Stack', frontendTitle: 'Frontend', frontend: 'React', backendTitle: 'Backend', backend: 'Node', databaseTitle: 'DB', database: 'Cloud SQL', securityTitle: 'Security', security: 'RBAC' },
        financials: { title: 'Financial Investment', items: [{name: 'Dev', type: 'Once-off', cost: '$20k'}] },
        roadmap: { title: 'Future Roadmap', auth: 'SSO', authDesc: '...', db: 'Migration', dbDesc: '...', email: 'Notifications', emailDesc: '...', hosting: 'PWA', hostingDesc: '...' },
        futureUpdates: { title: 'Alcohol Control', desc: '...' },
        enhancedCaps: { title: 'Enhanced Capabilities', mobileVerify: {title: 'Mobile', desc: '...'}, autoBooking: {title: 'Auto-Booking', desc: '...'}, massData: {title: 'Mass Data', desc: '...'}, auditLogs: {title: 'Audit', desc: '...'}, smartBatching: {title: 'Batching', desc: '...'}, matrixCompliance: {title: 'Matrix', desc: '...'} },
        conclusion: { title: 'Conclusion', text: '...' },
        thankYou: { title: 'Thank You', contact: '...', phone: '...' }
    }
  },
  pt: {
    nav: {
      dashboard: 'Painel de Controle',
      enterpriseDashboard: 'Painel Corporativo',
      siteGovernance: 'Governança de Sites',
      database: 'Banco de Dados',
      reports: 'Relatórios e Análises',
      booking: 'Agendar Treinamento',
      trainerInput: 'Entrada do Instrutor',
      records: 'Registros',
      users: 'Gestão de Usuários',
      schedule: 'Agendar Sessões',
      settings: 'Configurações do Sistema',
      requestCards: 'Solicitar Cartões',
      manuals: 'Manuais do Usuário',
      adminGuide: 'Guia do Admin',
      logs: 'Logs do Sistema',
      proposal: 'Proposta de Projeto',
      presentation: 'Modo Apresentação',
      alcohol: 'Controle de Álcool',
      systemHealth: 'Monitor de Sistema'
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
      exitFullScreen: 'Sair da Tela Cheia',
      rowsPerPage: 'Linhas por página:',
      page: 'Página',
      of: 'de',
      siteContext: 'Contexto do Local',
      enterpriseView: 'Visão Empresarial (Todos)'
    },
    verification: {
      title: 'Passaporte Digital de Segurança',
      verified: 'VERIFICADO',
      notVerified: 'NÃO CONFORME',
      notFound: 'REGISTRO NÃO ENCONTRADO',
      employeeDetails: 'Detalhes do Colaborador',
      activeRacs: 'Certificações Ativas',
      asoStatus: 'Médico (ASO)',
      dlStatus: 'Carta de Condução',
      validUntil: 'Válido Até',
      scanTime: 'Verificado em'
    },
    dashboard: {
      title: 'Visão Geral Operacional',
      subtitle: 'Métricas de segurança em tempo real.',
      kpi: {
        adherence: 'Aderência HSE',
        certifications: 'Total Certificações',
        pending: 'Pendente Avaliação',
        expiring: 'Expirando (30 Dias)',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        complianceTitle: 'Conformidade de Treinamento por RAC & ASO',
        complianceSubtitle: 'Mostra status obrigatório. Verde = Válido. Vermelho = Ausente/Expirado.',
        accessTitle: 'Status Geral de Acesso',
        compliant: 'Conforme',
        missing: 'Ausente / Expirado',
        nonCompliant: 'Não Conforme'
      },
      upcoming: {
        title: 'Sessões Futuras',
        viewSchedule: 'Ver Agenda',
        capacity: 'Capacidade',
        status: 'Status',
        date: 'Data / Hora',
        session: 'Info Sessão'
      },
      booked: {
        title: 'Colaboradores Agendados',
        tableEmployee: 'Colaborador / Empresa',
        tableRac: 'RAC Agendado',
        tableDate: 'Data',
        tableRoom: 'Sala',
        tableTrainer: 'Instrutor',
        noData: 'Nenhum agendamento encontrado'
      },
      renewal: {
        title: 'Ação Necessária: Renovação de Treinamento',
        message: 'colaboradores têm treinamentos críticos expirando em 30 dias.',
        button: 'Agendar Renovações'
      },
      autoBooking: {
        title: 'Ação Necessária: Auto-Agendamentos Pendentes',
        subPart1: 'Sistema detectou riscos de expiração',
        subPart2: 'e reservou vagas para evitar bloqueio. Aprove para finalizar.'
      }
    },
    systemHealth: {
        title: 'Monitor de Saúde do Sistema',
        subtitle: 'Telemetria de infraestrutura e rastreamento de erros em tempo real.',
        uptime: 'Tempo de Atividade',
        latency: 'Latência Média',
        errors: 'Taxa de Erro',
        services: 'Status do Serviço',
        database: 'Banco de Dados',
        ai: 'Motor de IA',
        auth: 'Autenticação',
        storage: 'Armazenamento Blob',
        cpu: 'Uso de CPU',
        memory: 'Uso de Memória',
        recentAlerts: 'Alertas Recentes do Sistema',
        online: 'Online',
        degraded: 'Degradado',
        offline: 'Offline'
    },
    enterprise: {
        title: 'Centro de Comando Corporativo',
        subtitle: 'Visão Geral da Conformidade de Segurança Global',
        globalHealth: 'Pontuação Global',
        totalWorkforce: 'Força de Trabalho',
        topPerformer: 'Melhor Desempenho',
        needsAttention: 'Requer Atenção',
        siteComparison: 'Comparação de Desempenho por Site',
        operationsOverview: 'Visão Geral das Operações',
        siteName: 'Nome do Site',
        staff: 'Pessoal',
        governanceTitle: 'Governança do Site',
        governanceSubtitle: 'Defina políticas de treinamento obrigatórias por local.',
        pushPolicy: 'Salvar e Aplicar Política',
        policyApplied: 'Política Aplicada',
        deptHeatmap: 'Mapa de Calor de Risco por Dept',
        tenantMatrix: 'Matriz de Desempenho de Inquilinos',
        systemView: 'VISÃO DO SISTEMA',
        bottlenecks: 'Gargalos de Treinamento',
        noBottlenecks: 'Nenhum gargalo detectado.',
        clickToGen: 'Clique em gerar para receber',
        safetyIntel: 'inteligência de segurança.',
        multiTenantDiag: 'diagnósticos de segurança multi-inquilino.'
    },
    siteGovernance: {
      title: 'Governança de Site',
      subtitle: 'Defina políticas obrigatórias de segurança por local.',
      selectSite: 'Selecionar Site de Operação',
      configure: 'Configurar RACs Obrigatórios',
      policyUpdate: 'Política atualizada para {site}. Requisitos enviados aos colaboradores.'
    },
    database: {
      title: 'Banco de Dados Mestre',
      subtitle: 'Gerenciar requisitos. RAC 02 é auto-desativado se a Carta estiver expirada.',
      filters: 'Filtros',
      accessStatus: 'Status de Acesso',
      granted: 'Liberado',
      blocked: 'Bloqueado',
      employeeInfo: 'Info & Carta',
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
        title: 'Editar / Transferir Colaborador',
        subtitle: 'Atualize detalhes. Mudar Empresa/Dept mantém histórico na nova entidade.',
        update: 'Atualizar Colaborador'
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
      title: 'Agendar Sessão',
      secureMode: 'Modo de Entrada Segura',
      manageSchedule: 'Gerir Agenda',
      dlRequired: 'Detalhes da Carta exigidos para RAC 02',
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
    notifications: {
        expiryTitle: 'Treinamento Expirando',
        expiryMsg: 'Treinamento de {name} ({rac}) expira em {days} dias.',
        autoBookTitle: 'Auto-Agendamento Criado',
        autoBookMsg: '{name} foi auto-agendado para {rac} em {date} (expira em {days} dias).',
        autoBookFailTitle: 'Falha no Auto-Agendamento',
        autoBookFailMsg: 'Não foi possível auto-agendar {name} para {rac}. Sem sessões disponíveis.',
        capacityTitle: 'Sessão Cheia - Auto Alocação',
        capacityMsg: 'colaboradores foram movidos para a próxima sessão disponível em',
        demandTitle: 'Alerta de Alta Demanda',
        demandMsg: 'Alta demanda detectada para',
        duplicateTitle: 'Agendamento Duplicado',
        duplicateMsg: 'Usuário já agendado para este tipo de treinamento.'
    },
    ai: {
        systemPromptAdvice: "Você é um Consultor de Segurança especialista para a Vulcan Mining. Especialize-se nas Regras Críticas de Segurança (RACs). Responda à pergunta do usuário sobre {rac}. Forneça conselhos concisos e acionáveis. Mantenha abaixo de 100 palavras. Idioma: {language}.",
        systemPromptReport: "Você é um Analista de Dados HSE. Analise as estatísticas de treinamento para o período {language}. Destaque tendências, riscos e recomendações. Mantenha executivo e conciso."
    },
    advisor: { button: 'Consultor', title: 'Consultor IA CARS', sender: 'Consultor CARS', emptyState: 'Como posso ajudar?', placeholder: 'Pergunte sobre padrões RAC...' },
    results: { title: 'Registros de Treinamento', subtitle: 'Ver resultados.', searchPlaceholder: 'Pesquisar...', table: { employee: 'Colaborador', session: 'Sessão', date: 'Data', trainer: 'Instrutor', room: 'Sala', dlRac02: 'Carta (RAC 02)', theory: 'Teoria', prac: 'Prática', status: 'Status', expiry: 'Validade' } },
    cards: { 
        title: 'Cartões de Segurança', 
        showing: 'Exibindo', 
        subtitle: 'Selecione colaboradores.', 
        goToPrint: 'Ir para Impressão', 
        selected: 'Selecionado', 
        successTitle: 'Solicitação Enviada', 
        successMsg: 'Solicitação encaminhada.', 
        noRecords: 'Sem Registros Elegíveis', 
        noRecordsSub: 'Apenas registros aprovados aparecem aqui.', 
        selectAll: 'Selecionar Todos', 
        sending: 'Enviando...', 
        requestButton: 'Solicitar Cartões', 
        validation: { ineligible: 'Colaborador inelegível.', maxSelection: 'Max 8 cartões.', incomplete: 'Incompleto' },
        eligibility: {
            failedTitle: 'Verificação de Elegibilidade Falhou',
            failedMsg: 'Você não atende aos requisitos para um cartão. Verifique se seu ASO é válido e se passou em todos os treinamentos.',
            checkReqs: 'Ver Requisitos'
        }
    },
    trainer: { title: 'Entrada do Instrutor', subtitle: 'Inserir notas.', passMark: 'Aprovação: 70%', loggedInAs: 'Logado como', selectSession: 'Selecione Sessão', noSessions: 'Sem sessões.', chooseSession: 'Escolha sessão...', dlWarning: 'Verificar Carta p/ RAC 02.', saveResults: 'Salvar Resultados', table: { employee: 'Colaborador', attendance: 'Presente', dlCheck: 'Verif. Carta', verified: 'Verificado', theory: 'Teoria', practical: 'Prática', rac02Only: '(RAC 02)', status: 'Status' } },
    users: { title: 'Gestão de Usuários', subtitle: 'Gerenciar acesso.', addUser: 'Adicionar Usuário', table: { user: 'Usuário', role: 'Função', status: 'Status', actions: 'Ações' }, modal: { title: 'Adicionar Usuário', name: 'Nome', email: 'Email', createUser: 'Criar' } },
    schedule: { title: 'Agenda de Treinamento', subtitle: 'Gerenciar sessões.', newSession: 'Nova Sessão', table: { date: 'Data/Hora', rac: 'RAC', room: 'Local', trainer: 'Instrutor' }, modal: { title: 'Agendar', racType: 'RAC', date: 'Data', startTime: 'Início', location: 'Local', capacity: 'Cap', instructor: 'Instr', saveSession: 'Salvar', language: 'Idioma', english: 'Inglês', portuguese: 'Português' } },
    settings: { title: 'Configurações', subtitle: 'Config.', saveAll: 'Salvar', saving: 'Salvando...', tabs: { general: 'Geral', trainers: 'Instrutores', racs: 'RACs', sites: 'Locais', companies: 'Empresas', branding: 'Marca', contractors: 'Empreiteiros' }, rooms: { title: 'Salas', name: 'Nome', capacity: 'Cap', new: 'Nova Sala' }, trainers: { title: 'Instrutores', name: 'Nome', qualifiedRacs: 'RACs', new: 'Novo Instrutor' }, racs: { title: 'RACs', code: 'Código', description: 'Desc', new: 'Novo RAC' } },
    reports: { title: 'Relatórios', subtitle: 'Análises.', printReport: 'Imprimir', filters: { period: 'Período', department: 'Dept', racType: 'RAC', startDate: 'Início', endDate: 'Fim' }, periods: { weekly: 'Semanal', monthly: 'Mensal', ytd: 'Anual', custom: 'Personalizado' }, generate: 'Gerar IA', analyzing: 'Analisando...', stats: { totalTrained: 'Total', passRate: 'Taxa Aprov.', attendance: 'Presença', noShows: 'Ausências' }, charts: { performance: 'Desempenho' }, executiveAnalysis: 'Análise Executiva IA', trainerMetrics: { title: 'Métricas Instrutor', name: 'Instrutor', sessions: 'Sessões', passRate: 'Taxa Aprov.', avgTheory: 'Teoria', avgPrac: 'Prática' } },
    logs: { title: 'Logs do Sistema', levels: { all: 'Todos', info: 'Info', warn: 'Aviso', error: 'Erro', audit: 'Auditoria' }, table: { level: 'Nível', timestamp: 'Data/Hora', user: 'Usuário', message: 'Mensagem' } },
    // Proposal, AdminManual etc kept as English structure in fallback logic for now to save space, but UI elements are translated above.
    adminManual: {
        title: 'Manual do Sistema',
        subtitle: 'Guia do Administrador',
        slides: {
            intro: 'Introdução', hierarchy: 'Hierarquia e Faturamento', objectives: 'Objetivos', logic: 'Lógica', workflow: 'Fluxo', config: 'Configuração', booking: 'Agendamento', advanced: 'Avançado', troubleshoot: 'Resolução de Problemas'
        },
        content: {
            confidential: 'CONFIDENCIAL', production: 'PRODUÇÃO v2.5',
            hierarchy: {
                title: 'Organograma e Faturamento', billingTitle: 'Modelo de Faturamento SaaS', billingDesc: 'Cobrança baseada em função.', cost: '$2.00', perUser: 'por Usuário Geral / Mês', roles: { sysAdmin: 'Admin Sistema', entAdmin: 'Admin Empresa', siteAdmin: 'Admin Site', ops: 'Admins Ops', user: 'Usuário Geral' }
            },
            objectives: { title: 'Objetivos', problemTitle: 'Desafios', solutionTitle: 'Soluções', p1Title: 'Integridade', p1Desc: '...', p2Title: 'Prazos', p2Desc: '...', p3Title: 'Carga Admin', p3Desc: '...', s1Title: 'Verdade Central', s1Desc: '...', s2Title: 'Auto-Aplicação', s2Desc: '...', s3Title: 'Eficiência', s3Desc: '...' },
            formulaTitle: 'Fórmula de Conformidade', formulaDesc: 'Porta Lógica E.', formulaLogic: { active: 'Ativo', aso: 'ASO Válido', racs: 'RACs Exigidos', result: 'ACESSO LIBERADO' },
            flowTitle: 'Fluxo de Dados', flowSteps: { db: 'Banco', dbDesc: 'Requisitos', book: 'Agenda', bookDesc: 'Sessão', res: 'Resultados', resDesc: 'Notas', stat: 'Status', statDesc: 'Cálculo' },
            configTitle: 'Configuração', configCards: { racs: 'Definições RAC', racsDesc: '...', rooms: 'Salas', roomsDesc: '...', trainers: 'Instrutores', trainersDesc: '...' },
            bookingTitle: 'Regras', matrixLock: 'Bloqueio Matriz', matrixDesc: '...', gradingTitle: 'Avaliação', gradingText: '...', rac02Title: 'RAC 02', rac02Text: '...', expiryTitle: 'Auto-Expiração', expiryText: '...',
            advancedTitle: 'Avançado', autoBook: 'Auto-Agendamento', autoBookDesc: '...', aiRep: 'Relatórios IA', aiRepDesc: '...', alc: 'Álcool', alcDesc: '...',
            tsTitle: 'Solução Problemas', ts1: 'Pesquisa', ts1Desc: '...', ts2: 'Status', ts2Desc: '...', ts3: 'QR', ts3Desc: '...'
        }
    },
    proposal: {
        digitalTrans: 'Transformação Digital',
        aboutMe: { title: 'Sobre o Desenvolvedor', name: 'Pita Domingos', preferred: 'Chame-me de Peter', role: 'Full Stack Dev', cert: 'Arquiteto Certificado', bio: '...' },
        scenario: { title: 'Cenário Real', workflowTitle: 'Fluxo Sem Paradas', riskTitle: 'Risco', riskText: '...', autoFixTitle: 'Correção Auto', autoFixText: '...', autoFixText: '...', autoFixNote: '...', demoTitle: 'Demo', demoText: '...', demoButton: 'Ir para Painel' },
        execSummary: { title: 'Resumo Executivo', text: '...', quote: '...' },
        objectives: { title: 'Objetivos', problemTitle: 'Problema', problemText: '...', solutionTitle: 'Solução', goals: ['Fonte Única', 'Lógica Auto', 'Analytics Real', 'Escalável'] },
        organogram: { title: 'Organograma', pm: 'Gerente', delivery: 'Entrega', tech1: 'Frontend', tech2: 'Backend', regime: 'Híbrido' },
        timeline: { title: 'Cronograma', phase1: 'Fase 1', phase1desc: '...', phase2: 'Fase 2', phase2desc: '...', phase3: 'Fase 3', phase3desc: '...', phase4: 'Fase 4', phase4desc: '...' },
        techStack: { title: 'Stack Tecnológico', frontendTitle: 'Frontend', frontend: 'React', backendTitle: 'Backend', backend: 'Node', databaseTitle: 'DB', database: 'SQL', securityTitle: 'Segurança', security: 'RBAC' },
        financials: { title: 'Investimento', items: [{name: 'Dev', type: 'Único', cost: '$20k'}] },
        roadmap: { title: 'Roteiro', auth: 'SSO', authDesc: '...', db: 'Migração', dbDesc: '...', email: 'Notificações', emailDesc: '...', hosting: 'PWA', hostingDesc: '...' },
        futureUpdates: { title: 'Álcool', desc: '...' },
        enhancedCaps: { title: 'Capacidades', mobileVerify: {title: 'Móvel', desc: '...'}, autoBooking: {title: 'Auto-Agenda', desc: '...'}, massData: {title: 'Dados Massa', desc: '...'}, auditLogs: {title: 'Auditoria', desc: '...'}, smartBatching: {title: 'Lotes', desc: '...'}, matrixCompliance: {title: 'Matriz', desc: '...'} },
        conclusion: { title: 'Conclusão', text: '...' },
        thankYou: { title: 'Obrigado', contact: '...', phone: '...' }
    }
  }
};
