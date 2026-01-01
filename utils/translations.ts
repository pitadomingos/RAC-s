
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
      enterpriseView: 'Enterprise View',
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
      }
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
      trainerInput: 'Trainer Input',
      users: 'Users',
      settings: 'Settings',
      logs: 'Logs',
      manuals: 'Manuals',
      integration: 'Integration'
    },
    dashboard: {
      title: 'Safety Command Center',
      subtitle: 'Critical Activity Requisition System (CARS)',
      systemStatus: 'Global Readiness Status',
      newRequisition: 'New Requisition',
      upcoming: {
        title: 'Upcoming Sessions',
        viewSchedule: 'View Schedule',
        date: 'Date',
        session: 'Session',
        capacity: 'Capacity'
      },
      booked: {
        title: 'Recently Requisitioned'
      },
      kpi: {
        adherence: 'Workforce Adherence',
        certifications: 'Certifications',
        pending: 'Pending Reqs',
        expiring: 'Expiring Soon',
        scheduled: 'Scheduled Sessions'
      },
      charts: {
        compliant: 'Authorized',
        nonCompliant: 'Blocked',
        complianceTitle: 'Training Compliance Matrix',
        complianceSubtitle: 'Requirement Adherence by Module',
        accessTitle: 'Site Access Permissions',
        missing: 'Missing Requirements'
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
      submitBooking: 'Submit Requisition'
    },
    results: {
      searchPlaceholder: 'Search by Name or ID...',
      passport: 'My Passport',
      export: 'Export CSV',
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
    cards: {
        title: 'Certification Cards',
        requestButton: 'Request Cards',
        sending: 'Sending Requisition...',
        eligibility: {
            failedTitle: 'Compliance Error',
            failedMsg: 'You are currently not authorized to generate a card. Please ensure all mandatory RACs and ASO are valid.',
            checkReqs: 'Check Requirements'
        }
    },
    advisor: {
        title: 'Safety AI Advisor',
        button: 'Ask AI Advisor',
        sender: 'AI Guide',
        placeholder: 'Ask about safety rules...',
        emptyState: 'How can I help with your safety requisition today?'
    },
    verification: {
        title: 'Digital Verification',
        verified: 'AUTHORIZED',
        notVerified: 'ACCESS DENIED',
        notFound: 'RECORD NOT FOUND',
        scanTime: 'Verification Time',
        asoStatus: 'Medical (ASO)',
        dlStatus: 'Driver License'
    },
    reports: {
        title: 'Safety Analytics',
        subtitle: 'CARS Performance Metrics',
        generate: 'Generate Report',
        analyzing: 'Analyzing...',
        executiveAnalysis: 'Executive AI Summary',
        stats: {
            totalTrained: 'Total Personnel',
            passRate: 'Success Rate',
            attendance: 'Attendance',
            noShows: 'No-Shows'
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
            distributionTitle: 'Compliance Breakdown',
            distributionSubtitle: 'Pass/Fail ratio for current selection',
            aiSubtitle: 'Contextual Safety Intelligence',
            breakdownTitle: 'Module specific evaluation results'
        },
        leaderboard: 'Evaluator Performance',
        printReport: 'Print Statistics',
        trainerMetrics: {
            students: 'Students',
            avgTheory: 'Avg. Theory'
        },
        noShowsTitle: 'Unauthorized Absences'
    },
    proposal: {
        digitalTrans: 'Digital Safety Transformation',
        aboutMe: {
            title: 'About The Architect',
            name: 'Pita Domingos',
            preferred: 'Pita',
            role: 'Lead System Architect',
            cert: 'Full Stack & AI Engineer',
            bio: 'Specializing in high-reliability safety systems and automated compliance frameworks.'
        },
        execSummary: {
            title: 'Executive Summary',
            text: 'CARS Manager is a next-generation safety compliance platform designed to automate the requisition of critical activity evaluations and site access controls.',
            quote: 'Building safety through automation.'
        },
        objectives: {
            title: 'Strategic Objectives',
            problemTitle: 'The Challenge',
            problemText: 'Manual evaluation tracking and fragmented data sources lead to site access delays and safety risks.',
            solutionTitle: 'The Solution',
            goals: ['Automate Evaluator Inputs', 'Centralize Workforce Registry', 'Real-time Compliance Reporting']
        },
        organogram: {
            title: 'Project Structure',
            tech1: 'Frontend Development',
            tech2: 'Cloud Architecture'
        },
        timeline: {
            title: 'Development Roadmap',
            phase1: 'Requirement Analysis',
            phase1desc: 'Identifying site-specific safety constraints.',
            phase2: 'Core Development',
            phase2desc: 'Building evaluation and booking engines.',
            phase3: 'Integration Layer',
            phase3desc: 'Connecting HR and Contractor databases.',
            phase4: 'Pilot Program',
            phase4desc: 'UAT testing at Moatize site.',
            phase5: 'Full Deployment',
            phase5desc: 'Global rollout across all sites.'
        },
        techStack: {
            title: 'Technology Stack',
            frontendTitle: 'Web Interface',
            frontend: 'React 19 & Tailwind CSS',
            backendTitle: 'Data Management',
            backend: 'Supabase & PostgreSQL',
            databaseTitle: 'Storage Layer',
            database: 'Cloud Realtime DB',
            securityTitle: 'Access Control',
            security: 'JWT & Multi-tenant RBAC'
        },
        financials: {
            title: 'Project Investment'
        },
        roadmap: {
            title: 'Future Roadmap',
            auth: 'Enhanced Authentication',
            authDesc: 'Biometric and SSO integration.',
            db: 'Scalable Database',
            dbDesc: 'Sharded data for millions of records.',
            email: 'Auto-Notifications',
            emailDesc: 'Predictive expiry alerts via Email/SMS.',
            hosting: 'Global CDN',
            hostingDesc: 'Edge computing for low-latency site access.'
        },
        aiFeatures: {
            title: 'AI Enhancements',
            chatbot: 'Conversational Safety Advisor',
            reporting: 'Predictive Risk Analysis'
        },
        futureUpdates: {
            title: 'Module Integration',
            moduleA: 'A - IoT Alcohol Control',
            moduleB: 'B - Site Gate Integration'
        },
        enhancedCaps: {
            title: 'Enhanced Capabilities',
            mobileVerify: { desc: 'Instant QR verification for field supervisors.' },
            autoBooking: { desc: 'Smart algorithms to book sessions before expiry.' },
            massData: { desc: 'Efficient processing of historical training data.' }
        },
        conclusion: {
            title: 'Conclusion',
            text: 'Transforming site safety from a manual task to an automated asset.'
        },
        thankYou: {
            title: 'Thank You'
        }
    },
    adminManual: {
        title: 'System Administrator Manual',
        subtitle: 'Enterprise Configuration & Governance Guide',
        slides: {
            intro: 'Introduction',
            logic: 'Compliance Logic',
            dashboard: 'Command Dashboard',
            workflows: 'Standard Workflows',
            advanced: 'Advanced Config',
            robotics: 'Self-Healing System',
            troubleshoot: 'Troubleshooting',
            architecture: 'System Architecture'
        },
        content: {
            logic: {
                title: 'Compliance Matrix Logic',
                desc: 'The system grants access based on a strict AND conditional set.',
                active: 'Active Status',
                aso: 'Valid Medical (ASO)',
                racs: 'Mandatory RACs Passed',
                result: 'Access Granted'
            }
        }
    },
    manuals: {
        title: 'Documentation Center',
        subtitle: 'Role-based operation guides',
        sysAdmin: {
            title: 'System Admin Guide',
            subtitle: 'Global infrastructure management',
            configTitle: 'System Configuration',
            configDesc: 'Manage global entities and requirements.',
            rooms: 'Manage training rooms and capacity',
            trainers: 'Register and authorize evaluators',
            racs: 'Define RAC validity and rules',
            dbTitle: 'Database & Registry',
            dbDesc: 'Master registry for all site personnel.',
            restrictionWarning: 'Changes to matrix rules affect global compliance rates.',
            csv: 'Bulk import using standard CSV templates.',
            active: 'Toggle employee active status for site blocking.'
        },
        racAdmin: {
            title: 'RAC Admin Guide',
            subtitle: 'Session scheduling and coordination',
            schedTitle: 'Scheduling Engine',
            schedDesc: 'Plan and publish evaluation sessions.',
            create: 'Create recurring slots',
            lang: 'Select evaluation language (EN/PT)',
            autoTitle: 'Auto-Booking Coordination',
            autoDesc: 'Manage system-generated requisitions.',
            approve: 'Review and confirm auto-bookings',
            renewTitle: 'Renewal Management',
            renewDesc: 'Track expiring certifications per site.'
        },
        racTrainer: {
            title: 'RAC Trainer Guide',
            subtitle: 'Evaluation input and results',
            inputTitle: 'Result Entry',
            inputDesc: 'Direct grading and evaluation log.',
            grading: 'Pass/Fail and Score input',
            rac02: 'RAC 02 requires Driver License verification.',
            save: 'Finalize results to update Digital Passports.'
        },
        deptAdmin: {
            title: 'Dept Admin Guide',
            subtitle: 'Departmental oversight',
            reqTitle: 'Requisitioning',
            reqDesc: 'Book training for your department staff.',
            search: 'Search and filter eligible personnel',
            print: 'Generate batch cards for shift teams',
            repTitle: 'Departmental Reports',
            repDesc: 'Monitor departmental compliance KPIs.'
        },
        user: {
            title: 'General User Guide',
            subtitle: 'Self-service and status tracking',
            statusTitle: 'Compliance Status',
            statusDesc: 'Check your personal site access readiness.',
            filterAlert: 'Filter by your ID to see evaluated modules.',
            green: 'Authorization Active (All modules valid)',
            red: 'Access Blocked (Action required)',
            qr: 'Download your personal QR for field evaluation.'
        }
    },
    enterprise: {
        title: 'Enterprise Analytics',
        subtitle: 'Global workforce compliance overview',
        systemTitle: 'Platform Master Dashboard',
        systemSubtitle: 'Multi-tenant health monitoring',
        siteName: 'Operational Site',
        globalHealth: 'Global Health Score',
        totalWorkforce: 'Total Workforce',
        topPerformer: 'Top Performing Site',
        needsAttention: 'Risk Area (Dept)',
        noData: 'No Data Available',
        tenantMatrix: 'Tenant Compliance Matrix',
        systemView: 'System-Wide Monitoring',
        siteComparison: 'Site Performance Benchmark',
        selectPrompt: 'Select a site to view specific analytics',
        riskHeatmap: 'Departmental Risk Heatmap',
        aiAuditor: 'AI Compliance Auditor',
        aiDirector: 'Executive AI Director',
        systemIntelligence: 'Platform-level analytics engine',
        companyIntelligence: 'Enterprise analysis for',
        aiPrompt: 'Select parameters and generate',
        aiPromptSystem: 'to initiate platform-wide audit.',
        aiPromptEnterprise: 'to initiate enterprise safety summary.',
        bottlenecks: 'Critical Training Bottlenecks',
        failure: 'Failure Rate'
    },
    feedback: {
        title: 'System Feedback',
        subtitle: 'Report bugs or suggest improvements',
        adminTitle: 'Feedback Command Center',
        manage: 'Manage user reports and system improvements',
        typeLabel: 'Feedback Category',
        messageLabel: 'Your Message',
        msgPlaceholder: 'Describe the issue or suggestion in detail...',
        button: 'Submit Feedback',
        types: {
            Bug: 'Technical Bug',
            Improvement: 'Improvement',
            General: 'General Inquiry'
        },
        status: {
            New: 'New',
            InProgress: 'In Progress',
            Resolved: 'Resolved',
            Dismissed: 'Dismissed'
        },
        actionable: 'Actionable',
        noSelection: 'Select an entry from the list to view details',
        workflow: 'Resolution Workflow',
        priority: 'Strategic Priority',
        markActionable: 'Mark as Actionable',
        markedActionable: 'Actionable Item',
        submittedBy: 'Submitted By',
        internalNotes: 'Internal Resolution Notes',
        visibleAdmin: 'Notes are only visible to System Administrators',
        deleteRecord: 'Delete Feedback Record'
    },
    settings: {
        title: 'System Settings',
        subtitle: 'Configure core application logic',
        globalConfig: 'Global Configuration (Enterprise Level)',
        localConfig: 'Local Site Configuration',
        saving: 'Saving...',
        saveAll: 'Save All Changes',
        tabs: {
            general: 'General',
            trainers: 'Trainers',
            racs: 'RAC Definitions',
            sites: 'Operational Sites',
            companies: 'Tenant Companies',
            branding: 'Branding',
            integration: 'Data Integration',
            diagnostics: 'AI Diagnostics'
        },
        rooms: {
            title: 'Evaluation Rooms',
            name: 'Room Name',
            capacity: 'Capacity'
        },
        trainers: {
            title: 'Authorized Evaluators',
            new: 'Register New Trainer'
        },
        racs: {
            title: 'RAC Safety Modules'
        },
        branding: {
            title: 'Corporate Identity',
            subtitle: 'Personalize the environment for your tenant',
            brandName: 'Corporate Brand Name',
            appName: 'Portal Application Title',
            appNameDesc: 'Visible in Sidebar and Browser Tab',
            corporateLogo: 'Corporate Identity (Logo)',
            safetyLogo: 'Safety Branding (Badge)',
            safetyLogoDesc: 'Visible in the top-left safety shield zone',
            upload: 'Upload New File',
            save: 'Update Tenant Identity'
        },
        integrationPage: {
            title: 'Middleware Integration Hub',
            sourceA: 'Source System A (Internal)',
            sourceB: 'Source System B (Contractors)',
            waiting: 'Ready for synchronization...',
            processing: 'Processing middleware logic...',
            syncNow: 'Initiate Global Sync'
        }
    },
    logs: {
        title: 'System Event Logs',
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
            user: 'Subject',
            message: 'Event Description'
        }
    },
    trainer: {
        title: 'Evaluation Input Matrix',
        loggedInAs: 'Evaluator Account:',
        noSessions: 'No pending evaluation sessions found for your account.',
        selectSession: 'Operational Session Selector',
        chooseSession: 'Select a published session to start grading...',
        saveResults: 'Commit Results & Update Passports'
    },
    schedule: {
        title: 'Training Schedule',
        subtitle: 'Plan and publish evaluation slots',
        newSession: 'Schedule New Slot',
        modal: {
            title: 'Publish Evaluation Session',
            racType: 'Safety Module',
            date: 'Date',
            startTime: 'Start Time',
            location: 'Room/Venue',
            capacity: 'Max Students',
            instructor: 'Lead Evaluator',
            language: 'Session Language',
            portuguese: 'Portuguese',
            english: 'English',
            saveSession: 'Publish Session'
        }
    },
    users: {
        title: 'User Access Control',
        subtitle: 'Manage administrative accounts and permissions',
        addUser: 'Provision New User',
        table: {
            user: 'Personnel',
            role: 'Access Level',
            status: 'System Status',
            actions: 'Management'
        },
        modal: {
            title: 'Create System User',
            name: 'Full Name',
            email: 'Corporate Email',
            createUser: 'Authorize User'
        }
    },
    database: {
        confirmDelete: 'Confirm Deletion',
        confirmDeleteMsg: 'This action is irreversible. All associated data will be removed from cloud storage.',
        importCsv: 'Import Records',
        importSuccess: 'Data Import Successful',
        active: 'Active'
    },
    communications: {
        title: 'Communication Logs',
        subtitle: 'History of automated SMS and Email alerts',
        clear: 'Clear History',
        search: 'Search messages...',
        empty: 'No communication records found.',
        select: 'Select a message to view the transmission preview.',
        sms: 'SMS Message',
        gateway: 'Delivered via DigiSols SMS Gateway',
        to: 'To',
        automated: 'This is an automated system notification.'
    },
    alcohol: {
        dashboard: {
            title: 'Alcohol Control Center',
            subtitle: 'IoT Breathalyzer Real-time Monitoring',
            live: 'Live Feed Active',
            specs: 'View Integration Specs',
            backToLive: 'Back to Dashboard',
            online: 'Devices Online',
            hourlyTrend: 'Hourly Test Volume',
            dailyTrend: 'Daily Testing History',
            deviceLoad: 'Tests per Access Point',
            complianceRatio: 'Workforce Sobriety Rate',
            liveStream: 'Real-time MQTT Stream',
            mqtt: 'MQTT Protocol',
            deviceHealth: 'IoT Node Integrity',
            kpi: {
                total: 'Total Tests',
                violations: 'Positive Violations',
                health: 'System Health'
            },
            alert: {
                title: 'CRITICAL VIOLATION',
                desc: 'Positive BAC Detected at Gate',
                measured: 'Measured BAC'
            },
            actions: 'Automated Response Log',
            actionLog: {
                locked: 'Turnstile GT-01 Locked Locally',
                generating: 'Generating incident report...',
                logged: 'Violation logged to HSE database',
                contacting: 'Contacting supervisor...',
                sent: 'Alert sent to HSE Superintendent'
            },
            close: 'Acknowledge & Clear'
        },
        protocol: {
            title: 'Safety Interceptor Protocol',
            positiveTitle: 'Positive BAC Detection',
            positiveDesc: 'Turnstiles automatically lock. System sends real-time SMS to HSE/Security.',
            resetTitle: 'Protocol Reset',
            resetDesc: 'Only an HSE Manager can unlock the user record after disciplinary review.'
        },
        features: {
            title: 'Smart Features',
            iotTitle: 'IoT Enabled',
            iotDesc: 'Industrial grade sensors with cloud connectivity.',
            accessTitle: 'Instant Block',
            accessDesc: 'Physical access denial in < 500ms.',
            complianceTitle: 'Compliance Export',
            complianceDesc: 'Automatic reporting for audit trails.'
        }
    },
    ai: {
        systemPromptAdvice: "You are a Safety Expert. Provide clear advice on {rac} in {language}.",
        systemPromptReport: "Analyze the following safety stats and provide an executive summary in {language}."
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
      enterpriseView: 'Visão Enterprise',
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
      }
    },
    nav: {
      dashboard: 'Painel',
      booking: 'Requisições',
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
      integration: 'Integração'
    },
    dashboard: {
      title: 'Centro de Comando de Segurança',
      subtitle: 'Sistema de Requisição de Atividades Críticas (RACS)',
      systemStatus: 'Status de Prontidão Global',
      newRequisition: 'Nova Requisição',
      upcoming: {
        title: 'Próximas Sessões',
        viewSchedule: 'Ver Cronograma',
        date: 'Data',
        session: 'Sessão',
        capacity: 'Capacidade'
      },
      booked: {
        title: 'Requisitados Recentemente'
      },
      kpi: {
        adherence: 'Aderência da Força de Trabalho',
        certifications: 'Certificações',
        pending: 'Requis. Pendentes',
        expiring: 'Expirando em Breve',
        scheduled: 'Sessões Agendadas'
      },
      charts: {
        compliant: 'Autorizado',
        nonCompliant: 'Bloqueado',
        complianceTitle: 'Matriz de Conformidade',
        complianceSubtitle: 'Aderência por Módulo',
        accessTitle: 'Permissões de Acesso ao Site',
        missing: 'Requisitos Ausentes'
      }
    },
    booking: {
      title: 'Nova Requisição',
      selfServiceTitle: 'Auto-Requisição',
      secureMode: 'Matriz de Segurança Ativa',
      success: 'Requisição Enviada com Sucesso',
      selectSession: 'Selecionar Sessão de Treinamento',
      chooseSession: 'Escolha uma sessão...',
      addRow: 'Adicionar Pessoal',
      submitBooking: 'Enviar Requisição'
    },
    results: {
      searchPlaceholder: 'Pesquisar por Nome ou ID...',
      passport: 'Meu Passaporte',
      export: 'Exportar CSV',
      table: {
        employee: 'Pessoal',
        session: 'Requisito',
        date: 'Data de Avaliação',
        trainer: 'Avaliador',
        theory: 'Teoria',
        status: 'Autorização',
        expiry: 'Expiração'
      }
    },
    reports: {
        title: 'Análises de Segurança',
        subtitle: 'Métricas de Desempenho RACS',
        generate: 'Gerar Relatório',
        analyzing: 'Analisando...',
        executiveAnalysis: 'Resumo Executivo IA',
        stats: {
            totalTrained: 'Total de Pessoal',
            passRate: 'Taxa de Sucesso',
            attendance: 'Presença',
            noShows: 'Faltas'
        },
        filters: {
            period: 'Período',
            department: 'Departamento',
            racType: 'Módulo RAC',
            startDate: 'Data Início',
            endDate: 'Data Fim'
        },
        periods: {
            weekly: 'Semanal',
            monthly: 'Mensal',
            ytd: 'Ano Corrente',
            custom: 'Intervalo Personalizado'
        },
        charts: {
            performance: 'Sucesso do Treinamento',
            distributionTitle: 'Distribuição de Conformidade',
            distributionSubtitle: 'Relação Aprovação/Reprovação',
            aiSubtitle: 'Inteligência de Segurança Contextual',
            breakdownTitle: 'Resultados de avaliação específicos por módulo'
        },
        leaderboard: 'Desempenho do Avaliador',
        printReport: 'Imprimir Estatísticas',
        trainerMetrics: {
            students: 'Alunos',
            avgTheory: 'Média Teoria'
        },
        noShowsTitle: 'Ausências Não Autorizadas'
    },
    advisor: {
        title: 'Consultor de Segurança IA',
        button: 'Consultar IA',
        sender: 'Guia IA',
        placeholder: 'Pergunte sobre segurança...',
        emptyState: 'Como posso ajudar com sua requisição de segurança hoje?'
    },
    cards: {
        title: 'Cartões de Certificação',
        requestButton: 'Solicitar Cartões',
        sending: 'Enviando Requisição...',
        eligibility: {
            failedTitle: 'Erro de Conformidade',
            failedMsg: 'Você não está autorizado a gerar um cartão. Certifique-se de que todos os RACs obrigatórios e o ASO estão válidos.',
            checkReqs: 'Verificar Requisitos'
        }
    },
    verification: {
        title: 'Verificação Digital',
        verified: 'AUTORIZADO',
        notVerified: 'ACESSO NEGADO',
        asoStatus: 'Exame Médico (ASO)',
        dlStatus: 'Carta de Condução'
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
        PTS: 'PTS - Permissão',
        ART: 'ART - Análise'
    },
    ai: {
        systemPromptAdvice: "Você é um Especialista em Segurança. Forneça conselhos claros sobre {rac} em {language}.",
        systemPromptReport: "Analise as seguintes estatísticas de segurança e forneça um resumo executivo em {language}."
    }
  }
};
