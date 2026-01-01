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
      active: 'Active',
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
      trainerInput: 'Trainer Input',
      users: 'Users',
      settings: 'Settings',
      logs: 'Logs',
      manuals: 'Manuals',
      integration: 'Integration',
      presentation: 'Proposal Presentation',
      techDocs: 'Technical Docs'
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
      upcoming: {
        title: 'Next Scheduled Requisitions',
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
        topPerformer: 'Top Performer',
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
        siteName: 'Site'
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
        title: 'Trainer Input',
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
        analyzing: 'Analyzing...',
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
        noShowsTitle: 'Unauthorized Absences'
    },
    proposal: {
        aboutMe: {
            title: 'Architect Profile',
            name: 'Pita Domingos',
            preferred: 'DigiSols Lead',
            cert: 'Senior Fullstack Architect',
            role: 'Product Strategy',
            bio: 'Expert in designing multi-tenant infrastructure for heavy industry. Specializing in digital transformation and automated safety compliance.'
        },
        objectives: {
            title: 'Strategic Goals',
            problemTitle: 'Core Challenges',
            problemText: 'Manual data entry and fragmented safety silos lead to production delays and unmitigated risks.',
            solutionTitle: 'The Solution',
            goals: [
                'Automated Site Entry Validation',
                'Unified "Source of Truth"',
                'Real-time Risk Dashboards'
            ]
        },
        execSummary: {
            title: 'Executive Summary',
            text: 'Transitioning from manual requisitions to an autonomous logic engine that ensures zero downtime for compliant staff.',
            quote: 'Safety through automation.'
        },
        organogram: {
            title: 'Project Structure',
            tech1: 'Backend / Security',
            tech2: 'Cloud / UI-UX'
        },
        timeline: {
            title: 'Rollout Roadmap',
            phase1: 'Architecture',
            phase1desc: 'Infrastructure setup',
            phase2: 'Integration',
            phase2desc: 'API implementation',
            phase3: 'UAT',
            phase3desc: 'Testing phase',
            phase4: 'Production',
            phase4desc: 'Live rollout',
            phase5: 'Managed Services',
            phase5desc: 'Maintenance'
        },
        techStack: {
          title: 'Technological Blueprint',
          frontendTitle: 'Frontend Tier',
          frontend: 'React 19 with Tailwind CSS for high-performance responsive UI.',
          backendTitle: 'Data Layer',
          backend: 'Supabase Realtime for secure, distributed cloud storage.',
          databaseTitle: 'Intelligence',
          database: 'Google Gemini 2.0 for automated safety diagnostics.',
          securityTitle: 'Identity',
          security: 'Encrypted Master Key protocols with session persistence.'
        },
        financials: {
          title: 'Investment Model'
        },
        roadmap: {
            title: 'Feature Roadmap',
            auth: 'Identity',
            authDesc: 'Azure AD link',
            db: 'Scalability',
            dbDesc: 'Distributed nodes',
            email: 'Alerts',
            emailDesc: 'Direct notification',
            hosting: 'Mobile',
            hostingDesc: 'Progressive Web App'
        },
        aiFeatures: {
            title: 'Next Gen AI',
            chatbot: 'Integrated safety guide.',
            reporting: 'Executive summaries.'
        },
        futureUpdates: {
            title: 'Advanced Modules',
            moduleA: 'A - IoT Hub',
            moduleB: 'B - Hardware Sync'
        },
        enhancedCaps: {
            title: 'Enhanced Capabilities',
            mobileVerify: { desc: 'Instant QR scanning.' },
            autoBooking: { desc: 'Smart reservation.' },
            massData: { desc: 'Mass CSV import.' }
        },
        conclusion: {
            title: 'The Future of HSE',
            text: 'Standardizing safety through architecture.'
        },
        thankYou: {
            title: 'Q&A Session'
        },
        digitalTrans: 'Digital Transformation Proposal'
    },
    adminManual: {
        title: 'Admin Manual',
        subtitle: 'Master System Operations',
        slides: {
            intro: 'Introduction',
            logic: 'Core Logic',
            dashboard: 'Dashboards',
            workflows: 'Workflows',
            advanced: 'Advanced Tools',
            robotics: 'RoboTech Self-Healing',
            troubleshoot: 'Troubleshooting',
            architecture: 'Platform Architecture'
        },
        content: {
            logic: {
                title: 'Access Permission Logic',
                desc: 'The system uses a 3-point validation check.',
                active: 'Active Status',
                aso: 'Medical (ASO)',
                racs: 'Training (RACs)',
                result: 'SITE ACCESS GRANTED'
            }
        }
    },
    manuals: {
        title: 'Operator Manuals',
        subtitle: 'System usage documentation',
        sysAdmin: {
            title: 'System Administrator',
            subtitle: 'Full platform management',
            configTitle: 'System Configuration',
            configDesc: 'Manage high-level entities to ensure operational continuity.',
            rooms: 'Define training rooms and their capacity limits.',
            trainers: 'Assign authorized RAC modules to specific evaluators.',
            racs: 'Configure validity months and practical requirements for each RAC.',
            dbTitle: 'Database Management',
            dbDesc: 'CARS operates as a unified repository for all personnel.',
            restrictionWarning: 'Note: Database filters restrict data by the selected operational site.',
            csv: 'Use the CSV Import wizard to sync with external HR systems.',
            active: 'Toggle "Active" status to block access for terminated staff.'
        },
        racAdmin: {
            title: 'RAC Coordinator',
            subtitle: 'Evaluation scheduling',
            schedTitle: 'Session Scheduling',
            schedDesc: 'Planning training cohorts based on room availability.',
            create: 'Create new sessions by selecting RAC Type and Date.',
            lang: 'Select session language (English/Portuguese) for instruction.',
            autoTitle: 'Auto-Booking Logic',
            autoDesc: 'System automatically books staff expiring in < 7 days.',
            approve: 'Admins must review and confirm auto-booked candidates.',
            renewTitle: 'Renewal Tracking',
            renewDesc: 'Dashboards highlight candidates in the "Expiring Soon" red zone.'
        },
        racTrainer: {
            title: 'Safety Instructor',
            subtitle: 'Grading and register',
            inputTitle: 'Result Entry',
            inputDesc: 'Entering theoretical and practical evaluation scores.',
            grading: 'Passing requires >= 70% in both components.',
            rac02: 'RAC 02 requires a valid Driver License verification check.',
            save: 'Click "Save Results" to trigger digital certificate updates.'
        },
        deptAdmin: {
            title: 'Department Manager',
            subtitle: 'Operational compliance',
            reqTitle: 'Tracking Compliance',
            reqDesc: 'Monitor the readiness of your specific workforce segment.',
            search: 'Search for staff members by Personnel ID.',
            print: 'Print current rosters for site entry audit.',
            repTitle: 'Analytics',
            repDesc: 'Analyze failure trends to identify training bottlenecks.'
        },
        user: {
            title: 'General User',
            subtitle: 'Personal safety record',
            statusTitle: 'Compliance Status',
            statusDesc: 'Check your current readiness for critical tasks.',
            filterAlert: 'Alert: Ensure you check the "Site Filter" to see data for your location.',
            green: 'Green status means you are fully authorized for site entry.',
            red: 'Red status indicates missing training or an expired medical (ASO).',
            qr: 'Scan the Passport QR code at gate terminals for instant verification.'
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
      active: 'Ativo',
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
    login: {
      title: 'Gestor RACS',
      subtitle: 'Portal de Conformidade de Segurança',
      usernameLabel: 'Usuário / ID de Pessoal',
      passwordLabel: 'Chave Mestra',
      usernamePlaceholder: 'ex: Pita Domingos',
      passwordPlaceholder: 'Deixe vazio no primeiro acesso',
      establishing: 'Autorizando...',
      submitBtn: 'Estabelecer Ligação',
      version: 'Arquitetura v2.5 • Encriptado',
      welcome: 'Bem-vindo, {name}!',
      setupDesc: 'Este é o seu primeiro acesso. Por favor, crie uma senha segura para ativar o seu link de acesso.',
      newKey: 'Nova Chave Mestra',
      newKeyPlaceholder: 'Mín. 6 caracteres',
      confirmKey: 'Confirmar Chave',
      activateBtn: 'Ativar Portal',
      backToLogin: 'Voltar ao Login',
      invalid: 'Credenciais inválidas. Acesso negado.',
      applying: 'Aplicando...',
      errorMinChar: 'A senha deve ter pelo menos 6 caracteres.',
      errorMatch: 'As senhas não coincidem.',
      errorSave: 'Falha ao salvar a senha.'
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
      integration: 'Integração',
      presentation: 'Apresentação da Proposta',
      techDocs: 'Docs Técnicos'
    },
    dashboard: {
      title: 'Centro de Comando de Segurança',
      subtitle: 'Sistema de Requisição de Atividades Críticas (RACS)',
      systemStatus: 'Status de Prontidão Global',
      newRequisition: 'Nova Requisição',
      executiveOverview: 'Visão Executiva',
      globalReadiness: 'Prontidão Global',
      systemDescription: 'Matriz de Requisição de Atividades Críticas (Visão Enterprise). Monitoramento de conformidade em tempo real.',
      complianceAnalytics: 'Análise de Conformidade',
      renewalManagement: 'Gestão de Renovações',
      renewalDescription: 'O sistema identificou {count} funcionários com certificações a expirar nos próximos 30 dias.',
      autoBookRenewals: 'Agendar Renovações Auto',
      liveWorkforceMatrix: 'Matriz da Força de Trabalho',
      personnelStatus: 'Status do Pessoal Ativo',
      upcoming: {
        title: 'Próximas Requisições Agendadas',
        viewSchedule: 'Ver Cronograma',
        date: 'Data',
        session: 'Sessão',
        capacity: 'Capacity'
      },
      booked: {
        title: 'Requisitados Recentemente'
      },
      kpi: {
        adherence: 'Aderência da Força de Trabalho',
        certifications: 'Certificações',
        pending: 'Requis. Pendentes',
        expiring: 'Expirando em Breve',
        scheduled: 'Sessões Agendadas',
        accessGranted: 'Acesso Autorizado'
      },
      charts: {
        compliant: 'Autorizado',
        nonCompliant: 'Bloqueado',
        complianceTitle: 'Matriz de Conformidade',
        complianceSubtitle: 'Aderência por Módulo',
        accessTitle: 'Permissões de Acesso ao Site',
        missing: 'Requisitos Ausentes',
        accessLegend: '"{compliant}" = ASO Válido + Todos os RACS obrigatórios aprovados. "{nonCompliant}" = ASO Expirado ou RACS ausentes.'
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
    database: {
        active: 'Ativo',
        importSuccess: 'Importação concluída',
        importCsv: 'Importar CSV',
        confirmDelete: 'Tem certeza?',
        confirmDeleteMsg: 'Esta ação não pode ser desfeita.'
    },
    users: {
        title: 'Gestão de Usuários',
        subtitle: 'Gerenciar acessos e permissões do sistema.',
        addUser: 'Adicionar Usuário',
        modal: {
            title: 'Novo Usuário',
            name: 'Nome',
            email: 'Email',
            createUser: 'Criar Usuário'
        },
        table: {
            user: 'Usuário',
            role: 'Função',
            status: 'Status',
            actions: 'Ações'
        }
    },
    schedule: {
        title: 'Agenda de Treinamento',
        subtitle: 'Gerenciar próximas sessões de treinamento.',
        newSession: 'Nova Sessão',
        modal: {
            title: 'Agendar Sessão',
            racType: 'Tipo RAC',
            date: 'Data',
            startTime: 'Hora Início',
            location: 'Local',
            capacity: 'Capacidade',
            instructor: 'Instrutor',
            language: 'Idioma',
            portuguese: 'Português',
            english: 'Inglês',
            saveSession: 'Salvar Sessão'
        }
    },
    settings: {
        title: 'Configurações',
        globalConfig: 'Configuração Global',
        localConfig: 'Configuração Local do Site',
        saveAll: 'Salvar Alterações',
        tabs: {
            branding: 'Marca'
        },
        branding: {
            title: 'Marca do Cliente',
            appName: 'Nome da Aplicação',
            safetyLogo: 'Logotipo de Segurança'
        }
    },
    enterprise: {
        title: 'Painel Enterprise',
        subtitle: 'Análise global de todas as operações',
        systemTitle: 'Comando da Plataforma',
        systemSubtitle: 'Visão de infraestrutura multi-tenant',
        globalHealth: 'Saúde Global',
        totalWorkforce: 'Força de Trabalho Total',
        topPerformer: 'Melhor Performance',
        needsAttention: 'Precisa de Atenção',
        noData: 'Sem dados',
        tenantMatrix: 'Matriz de Clientes',
        systemView: 'Visão do Admin do Sistema',
        siteComparison: 'Comparação de Sites',
        selectPrompt: 'Selecione um filtro para comparar sites',
        riskHeatmap: 'Mapa de Calor de Risco',
        aiAuditor: 'Auditor de Segurança IA',
        aiDirector: 'Diretor IA',
        systemIntelligence: 'Inteligência do Sistema',
        companyIntelligence: 'Análise para',
        aiPrompt: 'Solicitar análise',
        aiPromptSystem: 'Gerar relatório de segurança global',
        aiPromptEnterprise: 'Gerar relatório enterprise',
        bottlenecks: 'Gargalos de Treinamento',
        failure: 'Taxa de Reprovação',
        siteName: 'Site'
    },
    feedback: {
        title: 'Feedback do Usuário',
        subtitle: 'Valorizamos sua opinião',
        adminTitle: 'Comando de Feedback',
        manage: 'Gerenciar relatórios do sistema',
        typeLabel: 'Tipo de Feedback',
        messageLabel: 'Sua mensagem',
        msgPlaceholder: 'Descreva sua sugestão ou problema...',
        button: 'Enviar Feedback',
        actionable: 'Acionável',
        noSelection: 'Selecione uma entrada para inspecionar',
        workflow: 'Fluxo de Trabalho',
        priority: 'Priority',
        markActionable: 'Marcar como Acionável',
        markedActionable: 'Acionável Definido',
        submittedBy: 'Enviado por',
        internalNotes: 'Notas Internas',
        visibleAdmin: 'Visível apenas para admins',
        deleteRecord: 'Excluir Registro',
        status: {
            New: 'Novo',
            InProgress: 'Em Progresso',
            Resolved: 'Resolvido',
            Dismissed: 'Descartado'
        },
        types: {
            Bug: 'Erro',
            Improvement: 'Melhoria',
            General: 'Geral'
        }
    },
    trainer: {
        title: 'Input do Formador',
        loggedInAs: 'Instrutor:',
        noSessions: 'Sem sessões pendentes',
        selectSession: 'Selecionar Sessão',
        chooseSession: 'Escolha uma sessão ativa',
        saveResults: 'Confirmar Resultados'
    },
    communications: {
        title: 'Central de Comunicação',
        subtitle: 'Logs automatizados',
        clear: 'Limpar logs',
        search: 'Pesquisar mensagens',
        empty: 'Nenhuma mensagem registrada',
        select: 'Selecione uma mensagem para visualizar',
        sms: 'Mensagem SMS',
        to: 'Para',
        automated: 'Esta é uma mensagem automática do sistema',
        gateway: 'Gateway SMS RACS',
    },
    logs: {
        title: 'Logs do Sistema',
        levels: {
            all: 'Todos os Níveis',
            info: 'INFO',
            warn: 'WARN',
            error: 'ERRO',
            audit: 'AUDITORIA'
        },
        table: {
            level: 'Nível',
            timestamp: 'Timestamp',
            user: 'Usuário',
            message: 'Mensagem'
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
    proposal: {
        aboutMe: {
            title: 'Perfil do Arquiteto',
            name: 'Pita Domingos',
            preferred: 'Líder DigiSols',
            cert: 'Arquiteto Sénior Fullstack',
            role: 'Estratégia de Produto',
            bio: 'Especialista em design de infraestrutura multi-tenant para indústria pesada. Especializado em transformação digital e conformidade de segurança automatizada.'
        },
        objectives: {
            title: 'Objetivos Estratégicos',
            problemTitle: 'Desafios Centrais',
            problemText: 'A entrada manual de dados e os silos de segurança fragmentados levam a atrasos na produção e riscos não mitigados.',
            solutionTitle: 'A Solução',
            goals: [
                'Validação Automática de Entrada no Site',
                'Fonte Única de Verdade Unificada',
                'Painéis de Risco em Tempo Real'
            ]
        },
        execSummary: {
            title: 'Resumo Executivo',
            text: 'Transição de requisições manuais para um motor de lógica autónomo que garante tempo de inatividade zero para pessoal em conformidade.',
            quote: 'Segurança através da automação.'
        },
        organogram: {
            title: 'Estrutura do Projeto',
            tech1: 'Backend / Segurança',
            tech2: 'Cloud / UI-UX'
        },
        timeline: {
            title: 'Cronograma de Implementação',
            phase1: 'Arquitetura',
            phase1desc: 'Configuração da infraestrutura',
            phase2: 'Integration',
            phase2desc: 'Implementação de APIs',
            phase3: 'UAT',
            phase3desc: 'Fase de testes',
            phase4: 'Produção',
            phase4desc: 'Lançamento ao vivo',
            phase5: 'Serviços Geridos',
            phase5desc: 'Manutenção'
        },
        techStack: {
          title: 'Projeto Tecnológico',
          frontendTitle: 'Camada Frontend',
          frontend: 'React 19 com Tailwind CSS para uma interface responsiva de alta performance.',
          backendTitle: 'Camada de Dados',
          backend: 'Supabase Realtime para armazenamento seguro em nuvem distribuída.',
          databaseTitle: 'Inteligência',
          database: 'Google Gemini 2.0 para diagnósticos de segurança automatizados.',
          securityTitle: 'Identidade',
          security: 'Protocolos de Chave Mestra encriptados com persistência de sessão.'
        },
        financials: {
          title: 'Modelo de Investimento'
        },
        roadmap: {
            title: 'Roteiro de Funcionalidades',
            auth: 'Identidade',
            authDesc: 'Link Azure AD',
            db: 'Scalability',
            dbDesc: 'Nós distribuídos',
            email: 'Alertas',
            emailDesc: 'Notificação direta',
            hosting: 'Mobile',
            hostingDesc: 'Web App Progressivo'
        },
        aiFeatures: {
            title: 'IA de Próxima Geração',
            chatbot: 'Guia de segurança integrado.',
            reporting: 'Resumos executivos.'
        },
        futureUpdates: {
            title: 'Módulos Avançados',
            moduleA: 'A - IoT Hub',
            moduleB: 'B - Sync de Hardware'
        },
        enhancedCaps: {
            title: 'Capacidades Aprimoradas',
            mobileVerify: { desc: 'Digitalização instantânea de QR.' },
            autoBooking: { desc: 'Reserva inteligente.' },
            massData: { desc: 'Importação em massa de CSV.' }
        },
        conclusion: {
            title: 'O Futuro do HSE',
            text: 'Standardizando a segurança através da arquitetura.'
        },
        thankYou: {
            title: 'Sessão de P&R'
        },
        digitalTrans: 'Proposta de Transformação Digital'
    },
    adminManual: {
        title: 'Manual do Administrador',
        subtitle: 'Operações Mestras do Sistema',
        slides: {
            intro: 'Introdução',
            logic: 'Lógica Central',
            dashboard: 'Painéis',
            workflows: 'Fluxos de Trabalho',
            advanced: 'Ferramentas Avançadas',
            robotics: 'Auto-Cura RoboTech',
            troubleshoot: 'Resolução de Problemas',
            architecture: 'Arquitetura da Plataforma'
        },
        content: {
            logic: {
                title: 'Lógica de Permissão de Acesso',
                desc: 'O sistema utiliza uma verificação de validação de 3 pontos.',
                active: 'Status Ativo',
                aso: 'Exame Médico (ASO)',
                racs: 'Treinamento (RACs)',
                result: 'ACESSO AO SITE AUTORIZADO'
            }
        }
    },
    manuals: {
      title: 'Manuais do Operador',
      subtitle: 'Documentação de uso do sistema',
      sysAdmin: {
          title: 'Administrador do Sistema',
          subtitle: 'Gestão total da plataforma',
          configTitle: 'Configuração do Sistema',
          configDesc: 'Gerencie entidades de alto nível para garantir a continuidade operacional.',
          rooms: 'Defina salas de treinamento e seus limites de capacidade.',
          trainers: 'Atribua módulos RAC autorizados a avaliadores específicos.',
          racs: 'Configure meses de validade e requisitos práticos para cada RAC.',
          dbTitle: 'Gestão de Base de Dados',
          dbDesc: 'O RACS opera como um repositório unificado para todo o pessoal.',
          restrictionWarning: 'Nota: Os filtros de base de dados restringem os dados pelo site operacional selecionado.',
          csv: 'Use o assistente de Importação CSV para sincronizar com sistemas de RH externos.',
          active: 'Alterne o status "Ativo" para bloquear o acesso de funcionários desligados.'
      },
      racAdmin: {
          title: 'Coordenador RAC',
          subtitle: 'Agendamento de avaliações',
          schedTitle: 'Agendamento de Sessões',
          schedDesc: 'Planeamento de coortes de treinamento com base na disponibilidade de salas.',
          create: 'Crie novas sessões selecionando o Tipo de RAC e a Data.',
          lang: 'Selecione o idioma da sessão (Inglês/Português) para instrução.',
          autoTitle: 'Lógica de Auto-Agendamento',
          autoDesc: 'O sistema agenda automaticamente pessoal com expiração < 7 dias.',
          approve: 'Os administradores devem revisar e confirmar candidatos auto-agendados.',
          renewTitle: 'Acompanhamento de Renovações',
          renewDesc: 'Os painéis destacam candidatos na zona vermelha "Expirando em Breve".'
      },
      racTrainer: {
          title: 'Instrutor de Segurança',
          subtitle: 'Graduação e registo',
          inputTitle: 'Entrada de Resultados',
          inputDesc: 'Inserção de pontuações de avaliação teórica e prática.',
          grading: 'A aprovação requer >= 70% em ambos os componentes.',
          rac02: 'O RAC 02 requer uma verificação de validade da Carta de Condução.',
          save: 'Clique em "Salvar Resultados" para acionar atualizações de certificados digitais.'
      },
      deptAdmin: {
          title: 'Gestor de Departamento',
          subtitle: 'Conformidade operacional',
          reqTitle: 'Acompanhamento de Conformidade',
          reqDesc: 'Monitorize a prontidão do seu segmento específico da força de trabalho.',
          search: 'Pesquise membros da equipa pelo ID de Pessoal.',
          print: 'Imprima listas atuais para auditoria de entrada no site.',
          repTitle: 'Análises',
          repDesc: 'Analise tendências de reprovação para identificar gargalos de treinamento.'
      },
      user: {
          title: 'Utilizador Geral',
          subtitle: 'Registo pessoal de segurança',
          statusTitle: 'Status de Conformidade',
          statusDesc: 'Verifique a sua prontidão atual para tarefas críticas.',
          filterAlert: 'Alerta: Certifique-se de verificar o "Filtro de Site" para ver os dados da sua localização.',
          green: 'O status verde significa que está totalmente autorizado para entrada no site.',
          red: 'O status vermelho indica treinamento em falta ou exame médico (ASO) expirado.',
          qr: 'Digitalize o QR do Passaporte nos terminais de entrada para verificação instantânea.'
      }
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
    advisor: {
        title: 'Consultor de Segurança IA',
        button: 'Consultar IA',
        sender: 'Guia IA',
        placeholder: 'Pergunte sobre segurança...',
        emptyState: 'Como posso ajudar com sua requisição de segurança hoje?'
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
        RAC11: 'RAC 11 - Tráfego',
        PTS: 'PTS - Permissão',
        ART: 'ART - Análise'
    },
    ai: {
        systemPromptAdvice: "Você é um Especialista em Segurança. Forneça conselhos claros sobre {rac} em {language}.",
        systemPromptReport: "Analise as seguintes estatísticas de segurança e forneça um resumo executivo em {language}."
    }
  }
};