const http = require('http');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

// ─── Load .env file manually (no dotenv dependency) ─────────────────────────

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim();
            if (!process.env[key]) process.env[key] = val;
        }
    });
}

// ─── PostgreSQL Connection ─────────────────────────────────────────────────────

const caCert = fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf8');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'defaultdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: { rejectUnauthorized: true, ca: caCert },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
    console.error('Unexpected pool error:', err.message);
});

// ─── Helpers ────────────────────────────────────────────────────────────────────

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch (e) { reject(new Error('Invalid JSON')); }
        });
        req.on('error', reject);
    });
}

function sendJson(res, code, data) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function sendError(res, code, msg) {
    sendJson(res, code, { error: msg });
}

// ─── Route helpers ──────────────────────────────────────────────────────────────

function matchRoute(method, pathname, reqMethod, reqPath) {
    if (reqMethod !== method) return null;
    // Static path
    if (!pathname.includes(':')) return reqPath === pathname ? {} : null;
    // Parameterized path e.g. /api/employees/:id
    const patternParts = pathname.split('/');
    const reqParts = reqPath.split('/');
    if (patternParts.length !== reqParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = reqParts[i];
        } else if (patternParts[i] !== reqParts[i]) {
            return null;
        }
    }
    return params;
}

// ─── Server ─────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    let params;

    try {
        // ════════════════════════════════════════════════════════════════════════
        //  COMPANIES
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/companies', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM companies ORDER BY name');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/companies', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO companies (id, name, app_name, logo_url, safety_logo_url, status, default_language, parent_id, tier, features)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 ON CONFLICT (id) DO UPDATE SET
                    name=EXCLUDED.name, app_name=EXCLUDED.app_name, logo_url=EXCLUDED.logo_url,
                    safety_logo_url=EXCLUDED.safety_logo_url, status=EXCLUDED.status,
                    default_language=EXCLUDED.default_language, parent_id=EXCLUDED.parent_id,
                    tier=EXCLUDED.tier, features=EXCLUDED.features
                 RETURNING *`,
                [body.id, body.name, body.app_name, body.logo_url, body.safety_logo_url,
                 body.status || 'Active', body.default_language || 'en', body.parent_id || null,
                 body.tier || 'Prime', body.features ? JSON.stringify(body.features) : '{"alcohol":false}']
            );
            return sendJson(res, 200, rows[0]);
        }

        if ((params = matchRoute('DELETE', '/api/companies/:id', req.method, pathname))) {
            await pool.query('DELETE FROM companies WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  SITES
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/sites', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM sites ORDER BY name');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/sites', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO sites (id, company_id, name, location, mandatory_racs)
                 VALUES ($1,$2,$3,$4,$5)
                 ON CONFLICT (id) DO UPDATE SET
                    company_id=EXCLUDED.company_id, name=EXCLUDED.name,
                    location=EXCLUDED.location, mandatory_racs=EXCLUDED.mandatory_racs
                 RETURNING *`,
                [body.id, body.company_id || null, body.name, body.location,
                 body.mandatory_racs ? JSON.stringify(body.mandatory_racs) : '[]']
            );
            return sendJson(res, 200, rows[0]);
        }

        if ((params = matchRoute('DELETE', '/api/sites/:id', req.method, pathname))) {
            await pool.query('DELETE FROM sites WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  EMPLOYEES
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/employees', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM employees ORDER BY name');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/employees', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO employees (id, record_id, name, company, department, role, site_id, email, phone_number, photo_url, driver_license_number, driver_license_class, driver_license_expiry, is_active)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
                 ON CONFLICT (id) DO UPDATE SET
                    record_id=EXCLUDED.record_id, name=EXCLUDED.name, company=EXCLUDED.company,
                    department=EXCLUDED.department, role=EXCLUDED.role, site_id=EXCLUDED.site_id,
                    email=EXCLUDED.email, phone_number=EXCLUDED.phone_number, photo_url=EXCLUDED.photo_url,
                    driver_license_number=EXCLUDED.driver_license_number, driver_license_class=EXCLUDED.driver_license_class,
                    driver_license_expiry=EXCLUDED.driver_license_expiry, is_active=EXCLUDED.is_active
                 RETURNING *`,
                [body.id, body.record_id, body.name, body.company, body.department, body.role,
                 body.site_id || null, body.email, body.phone_number, body.photo_url,
                 body.driver_license_number, body.driver_license_class,
                 body.driver_license_expiry || null, body.is_active !== false]
            );
            return sendJson(res, 200, rows[0]);
        }

        // Upsert by record_id (for imports)
        if ((params = matchRoute('POST', '/api/employees/upsert', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO employees (id, record_id, name, company, department, role, site_id, phone_number, driver_license_number, driver_license_class, driver_license_expiry, is_active)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
                 ON CONFLICT (record_id) DO UPDATE SET
                    name=EXCLUDED.name, company=EXCLUDED.company, department=EXCLUDED.department,
                    role=EXCLUDED.role, site_id=EXCLUDED.site_id, phone_number=EXCLUDED.phone_number,
                    driver_license_number=EXCLUDED.driver_license_number, driver_license_class=EXCLUDED.driver_license_class,
                    driver_license_expiry=EXCLUDED.driver_license_expiry, is_active=EXCLUDED.is_active
                 RETURNING id, record_id`,
                [body.id, body.record_id, body.name, body.company, body.department, body.role,
                 body.site_id || null, body.phone_number, body.driver_license_number,
                 body.driver_license_class, body.driver_license_expiry || null, body.is_active !== false]
            );
            return sendJson(res, 200, rows[0]);
        }

        // Bulk upsert employees
        if ((params = matchRoute('POST', '/api/employees/bulk', req.method, pathname))) {
            const body = await parseBody(req);
            const results = [];
            for (const emp of (body.employees || [])) {
                const { rows } = await pool.query(
                    `INSERT INTO employees (id, record_id, name, company, department, role, site_id, phone_number, driver_license_number, driver_license_class, driver_license_expiry, is_active)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
                     ON CONFLICT (record_id) DO UPDATE SET
                        name=EXCLUDED.name, company=EXCLUDED.company, department=EXCLUDED.department,
                        role=EXCLUDED.role, site_id=EXCLUDED.site_id, phone_number=EXCLUDED.phone_number,
                        driver_license_number=EXCLUDED.driver_license_number, driver_license_class=EXCLUDED.driver_license_class,
                        driver_license_expiry=EXCLUDED.driver_license_expiry, is_active=EXCLUDED.is_active
                     RETURNING id, record_id`,
                    [emp.id, emp.record_id, emp.name, emp.company, emp.department, emp.role,
                     emp.site_id || null, emp.phone_number, emp.driver_license_number,
                     emp.driver_license_class, emp.driver_license_expiry || null, emp.is_active !== false]
                );
                results.push(rows[0]);
            }
            return sendJson(res, 200, results);
        }

        if ((params = matchRoute('DELETE', '/api/employees/:id', req.method, pathname))) {
            await pool.query('DELETE FROM employees WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  USERS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/users', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM users ORDER BY name');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/users', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO users (name, email, password, role, status, company, job_title, phone_number, department, site_id, app_module)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                 ON CONFLICT (email) DO UPDATE SET
                    name=EXCLUDED.name, password=COALESCE(EXCLUDED.password, users.password),
                    role=EXCLUDED.role, status=EXCLUDED.status, company=EXCLUDED.company,
                    job_title=EXCLUDED.job_title, phone_number=EXCLUDED.phone_number,
                    department=EXCLUDED.department, site_id=EXCLUDED.site_id, app_module=EXCLUDED.app_module
                 RETURNING *`,
                [body.name, body.email, body.password || null, body.role || 'User',
                 body.status || 'Active', body.company, body.job_title, body.phone_number,
                 body.department, body.site_id || 'all', body.app_module || null]
            );
            return sendJson(res, 200, rows[0]);
        }

        if ((params = matchRoute('PUT', '/api/users/:id/password', req.method, pathname))) {
            const body = await parseBody(req);
            await pool.query('UPDATE users SET password = $1 WHERE id = $2', [body.password, params.id]);
            return sendJson(res, 200, { success: true });
        }

        if ((params = matchRoute('DELETE', '/api/users/:id', req.method, pathname))) {
            await pool.query('DELETE FROM users WHERE id = $1', [parseInt(params.id)]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  TRAINING SESSIONS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/sessions', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM training_sessions ORDER BY date ASC');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/sessions', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO training_sessions (id, rac_type, date, start_time, location, instructor, capacity, session_language, site_id)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                 ON CONFLICT (id) DO UPDATE SET
                    rac_type=EXCLUDED.rac_type, date=EXCLUDED.date, start_time=EXCLUDED.start_time,
                    location=EXCLUDED.location, instructor=EXCLUDED.instructor, capacity=EXCLUDED.capacity,
                    session_language=EXCLUDED.session_language, site_id=EXCLUDED.site_id
                 RETURNING *`,
                [body.id, body.rac_type, body.date, body.start_time || '09:00', body.location,
                 body.instructor, body.capacity || 20, body.session_language || 'English', body.site_id || null]
            );
            return sendJson(res, 200, rows[0]);
        }

        if ((params = matchRoute('DELETE', '/api/sessions/:id', req.method, pathname))) {
            await pool.query('DELETE FROM training_sessions WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  RECORDS (Bookings)
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/bookings', req.method, pathname))) {
            const { rows } = await pool.query(
                `SELECT r.*, row_to_json(e.*) as employee
                 FROM records r
                 LEFT JOIN employees e ON r.employee_id = e.id
                 ORDER BY r.created_at DESC`
            );
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/bookings', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO records (id, session_id, employee_id, status, result_date, expiry_date, theory_score, practical_score, attendance, driver_license_verified, is_auto_booked, comments, trainer_name)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                 ON CONFLICT (id) DO UPDATE SET
                    session_id=EXCLUDED.session_id, employee_id=EXCLUDED.employee_id, status=EXCLUDED.status,
                    result_date=EXCLUDED.result_date, expiry_date=EXCLUDED.expiry_date,
                    theory_score=EXCLUDED.theory_score, practical_score=EXCLUDED.practical_score,
                    attendance=EXCLUDED.attendance, driver_license_verified=EXCLUDED.driver_license_verified,
                    is_auto_booked=EXCLUDED.is_auto_booked, comments=EXCLUDED.comments, trainer_name=EXCLUDED.trainer_name
                 RETURNING *`,
                [body.id, body.session_id || null, body.employee_id, body.status || 'Pending',
                 body.result_date || null, body.expiry_date || null,
                 body.theory_score || 0, body.practical_score || 0,
                 body.attendance || false, body.driver_license_verified || false,
                 body.is_auto_booked || false, body.comments || null, body.trainer_name || null]
            );
            return sendJson(res, 200, rows[0]);
        }

        // Bulk upsert bookings
        if ((params = matchRoute('POST', '/api/bookings/bulk', req.method, pathname))) {
            const body = await parseBody(req);
            for (const b of (body.bookings || [])) {
                await pool.query(
                    `INSERT INTO records (id, session_id, employee_id, status, result_date, expiry_date, theory_score, practical_score, attendance, trainer_name, comments)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                     ON CONFLICT (id) DO UPDATE SET
                        session_id=EXCLUDED.session_id, employee_id=EXCLUDED.employee_id, status=EXCLUDED.status,
                        result_date=EXCLUDED.result_date, expiry_date=EXCLUDED.expiry_date,
                        theory_score=EXCLUDED.theory_score, practical_score=EXCLUDED.practical_score,
                        attendance=EXCLUDED.attendance, trainer_name=EXCLUDED.trainer_name, comments=EXCLUDED.comments`,
                    [b.id, b.session_id || null, b.employee_id, b.status || 'Pending',
                     b.result_date || null, b.expiry_date || null,
                     b.theory_score || 0, b.practical_score || 0,
                     b.attendance || false, b.trainer_name || null, b.comments || null]
                );
            }
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  WAITING LIST
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/waitlist', req.method, pathname))) {
            const { rows } = await pool.query(
                `SELECT w.*, row_to_json(e.*) as employee
                 FROM waiting_list w
                 LEFT JOIN employees e ON w.employee_id = e.id
                 ORDER BY w.created_at ASC`
            );
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/waitlist', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO waiting_list (session_id, employee_id) VALUES ($1, $2) RETURNING *`,
                [body.session_id, body.employee_id]
            );
            return sendJson(res, 200, rows[0]);
        }

        // Promote from waitlist to booking
        if ((params = matchRoute('POST', '/api/waitlist/:id/promote', req.method, pathname))) {
            const body = await parseBody(req);
            await pool.query(
                `INSERT INTO records (session_id, employee_id, status) VALUES ($1, $2, 'Pending')`,
                [body.session_id, body.employee_id]
            );
            await pool.query('DELETE FROM waiting_list WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        if ((params = matchRoute('DELETE', '/api/waitlist/:id', req.method, pathname))) {
            await pool.query('DELETE FROM waiting_list WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  EMPLOYEE REQUIREMENTS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/requirements', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM employee_requirements');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/requirements', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO employee_requirements (employee_id, aso_expiry_date, required_racs)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (employee_id) DO UPDATE SET
                    aso_expiry_date=EXCLUDED.aso_expiry_date, required_racs=EXCLUDED.required_racs
                 RETURNING *`,
                [body.employee_id, body.aso_expiry_date || null,
                 body.required_racs ? JSON.stringify(body.required_racs) : '{}']
            );
            return sendJson(res, 200, rows[0]);
        }

        // Bulk upsert requirements
        if ((params = matchRoute('POST', '/api/requirements/bulk', req.method, pathname))) {
            const body = await parseBody(req);
            for (const r of (body.requirements || [])) {
                await pool.query(
                    `INSERT INTO employee_requirements (employee_id, aso_expiry_date, required_racs)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (employee_id) DO UPDATE SET
                        aso_expiry_date=EXCLUDED.aso_expiry_date, required_racs=EXCLUDED.required_racs`,
                    [r.employee_id, r.aso_expiry_date || null,
                     r.required_racs ? JSON.stringify(r.required_racs) : '{}']
                );
            }
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  RAC DEFINITIONS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/rac-definitions', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM rac_definitions ORDER BY code');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/rac-definitions', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO rac_definitions (id, company_id, code, name, validity_months, requires_driver_license, requires_practical, pass_score)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                 ON CONFLICT (id) DO UPDATE SET
                    company_id=EXCLUDED.company_id, code=EXCLUDED.code, name=EXCLUDED.name,
                    validity_months=EXCLUDED.validity_months, requires_driver_license=EXCLUDED.requires_driver_license,
                    requires_practical=EXCLUDED.requires_practical, pass_score=EXCLUDED.pass_score
                 RETURNING *`,
                [body.id, body.company_id || null, body.code, body.name,
                 body.validity_months, body.requires_driver_license || false,
                 body.requires_practical || false, body.pass_score || 70]
            );
            return sendJson(res, 200, rows[0]);
        }

        if ((params = matchRoute('DELETE', '/api/rac-definitions/:id', req.method, pathname))) {
            await pool.query('DELETE FROM rac_definitions WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  ROOMS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/rooms', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM rooms ORDER BY name');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/rooms', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO rooms (id, name, capacity, site_id) VALUES ($1,$2,$3,$4)
                 ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, capacity=EXCLUDED.capacity, site_id=EXCLUDED.site_id
                 RETURNING *`,
                [body.id, body.name, body.capacity || 20, body.site_id || null]
            );
            return sendJson(res, 200, rows[0]);
        }

        if ((params = matchRoute('DELETE', '/api/rooms/:id', req.method, pathname))) {
            await pool.query('DELETE FROM rooms WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  TRAINERS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/trainers', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM trainers ORDER BY name');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/trainers', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO trainers (id, name, authorized_racs, site_id) VALUES ($1,$2,$3,$4)
                 ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, authorized_racs=EXCLUDED.authorized_racs, site_id=EXCLUDED.site_id
                 RETURNING *`,
                [body.id, body.name, body.authorized_racs ? JSON.stringify(body.authorized_racs) : '[]', body.site_id || null]
            );
            return sendJson(res, 200, rows[0]);
        }

        if ((params = matchRoute('DELETE', '/api/trainers/:id', req.method, pathname))) {
            await pool.query('DELETE FROM trainers WHERE id = $1', [params.id]);
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  DATA CONNECTORS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/connectors', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM data_connectors ORDER BY name');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/connectors', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO data_connectors (id, name, type, last_sync, status, color, source, config, mapping, module_mapping)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 ON CONFLICT (id) DO UPDATE SET
                    name=EXCLUDED.name, type=EXCLUDED.type, last_sync=EXCLUDED.last_sync,
                    status=EXCLUDED.status, color=EXCLUDED.color, source=EXCLUDED.source,
                    config=EXCLUDED.config, mapping=EXCLUDED.mapping, module_mapping=EXCLUDED.module_mapping
                 RETURNING *`,
                [body.id, body.name, body.type, body.last_sync || null, body.status || 'Idle',
                 body.color, body.source, JSON.stringify(body.config || {}),
                 JSON.stringify(body.mapping || {}), JSON.stringify(body.module_mapping || {})]
            );
            return sendJson(res, 200, rows[0]);
        }

        // ════════════════════════════════════════════════════════════════════════
        //  FEEDBACK
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('POST', '/api/feedback', req.method, pathname))) {
            const body = await parseBody(req);
            await pool.query(
                `INSERT INTO feedback (id, user_id, user_name, type, message, status, is_actionable, admin_notes)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                 ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status, admin_notes=EXCLUDED.admin_notes`,
                [body.id, body.user_id, body.user_name, body.type, body.message,
                 body.status || 'New', body.is_actionable || false, body.admin_notes || null]
            );
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  SYSTEM LOGS
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/logs', req.method, pathname))) {
            const { rows } = await pool.query(
                'SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 100'
            );
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/logs', req.method, pathname))) {
            const body = await parseBody(req);
            await pool.query(
                `INSERT INTO system_logs (level, message_key, user_name, metadata)
                 VALUES ($1, $2, $3, $4)`,
                [body.level || 'INFO', body.message_key, body.user_name,
                 body.metadata ? JSON.stringify(body.metadata) : '{}']
            );
            return sendJson(res, 200, { success: true });
        }

        // ════════════════════════════════════════════════════════════════════════
        //  UNSAFE CONDITIONS (SafeMap)
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/unsafe-conditions', req.method, pathname))) {
            const { rows } = await pool.query('SELECT * FROM unsafe_conditions ORDER BY created_at DESC');
            return sendJson(res, 200, rows);
        }

        if ((params = matchRoute('POST', '/api/unsafe-conditions', req.method, pathname))) {
            const body = await parseBody(req);
            const { rows } = await pool.query(
                `INSERT INTO unsafe_conditions (id, latitude, longitude, function_location, condition_type, responsible_area, description, action_plan, initial_photos, correction_photos, observer_id, observer_name, ssma_focal_point_id, ssma_focal_point_name, area_responsible_id, area_responsible_name, area_manager_id, area_manager_name, state, map_status, resolved_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
                 ON CONFLICT (id) DO UPDATE SET
                    description=EXCLUDED.description, action_plan=EXCLUDED.action_plan,
                    correction_photos=EXCLUDED.correction_photos, state=EXCLUDED.state,
                    map_status=EXCLUDED.map_status, resolved_at=EXCLUDED.resolved_at,
                    ssma_focal_point_id=EXCLUDED.ssma_focal_point_id, ssma_focal_point_name=EXCLUDED.ssma_focal_point_name,
                    area_responsible_id=EXCLUDED.area_responsible_id, area_responsible_name=EXCLUDED.area_responsible_name,
                    area_manager_id=EXCLUDED.area_manager_id, area_manager_name=EXCLUDED.area_manager_name
                 RETURNING *`,
                [body.id, body.latitude, body.longitude, body.function_location, body.condition_type,
                 body.responsible_area, body.description, body.action_plan,
                 JSON.stringify(body.initial_photos || []), JSON.stringify(body.correction_photos || []),
                 body.observer_id, body.observer_name, body.ssma_focal_point_id, body.ssma_focal_point_name,
                 body.area_responsible_id, body.area_responsible_name, body.area_manager_id, body.area_manager_name,
                 body.state || 'Criado', body.map_status || 'Recente', body.resolved_at || null]
            );
            return sendJson(res, 200, rows[0]);
        }

        // ════════════════════════════════════════════════════════════════════════
        //  EXEC SQL (FormBuilder)
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('POST', '/api/exec-sql', req.method, pathname))) {
            const body = await parseBody(req);
            try {
                await pool.query(body.sql);
                return sendJson(res, 200, { success: true });
            } catch (e) {
                return sendJson(res, 200, { success: false, error: e.message });
            }
        }

        // ════════════════════════════════════════════════════════════════════════
        //  HEALTH CHECK
        // ════════════════════════════════════════════════════════════════════════

        if ((params = matchRoute('GET', '/api/health', req.method, pathname))) {
            try {
                const { rows } = await pool.query('SELECT NOW() as time');
                return sendJson(res, 200, { status: 'ok', time: rows[0].time, tables: 18 });
            } catch (e) {
                return sendJson(res, 500, { status: 'error', error: e.message });
            }
        }

        // 404
        sendError(res, 404, 'Route not found');

    } catch (err) {
        console.error('API Error:', err.message);
        sendError(res, 500, err.message || 'Internal server error');
    }
});

server.listen(PORT, () => {
    console.log(`⚡ ZeroGate API Server running at http://localhost:${PORT}`);
    console.log(`   Database: Aiven PostgreSQL (pg-f823343-pita13035-8e24.l.aivencloud.com)`);
    console.log(`   Endpoints: /api/companies, /api/employees, /api/sessions, ...`);
});
