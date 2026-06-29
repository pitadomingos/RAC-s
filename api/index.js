const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ─── DB CONNECTION ─────────────────────────────────────────────
let pool;

function getPool() {
    if (!pool) {
        let sslConfig = false;

        try {
            const caPath = path.join(__dirname, 'ca.pem');
            if (fs.existsSync(caPath)) {
                const caCert = fs.readFileSync(caPath, 'utf8');
                sslConfig = { rejectUnauthorized: true, ca: caCert };
            }
        } catch (err) {
            console.log("CA cert not found");
        }

        if (process.env.DB_CA_CERT) {
            sslConfig = {
                rejectUnauthorized: true,
                ca: process.env.DB_CA_CERT
            };
        }

        pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: sslConfig,
            max: 5
        });

        pool.on('error', (err) => {
            console.error('DB Pool Error:', err.message);
        });
    }

    return pool;
}

// ─── HELPERS ─────────────────────────────────────────────
function send(res, code, data) {
    res.status(code).json(data);
}

function matchRoute(method, route, reqMethod, path) {
    if (method !== reqMethod) return false;
    return route === path;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────
module.exports = async (req, res) => {

    // ✅ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = getPool();

    // ✅ FIXED PATH HANDLING (THIS SOLVES YOUR 404 PROBLEM)
    let pathname = req.url.split('?')[0];

    // Normalize path (VERY IMPORTANT)
    if (!pathname.startsWith('/api')) {
        pathname = '/api' + pathname;
    }

    console.log("REQUEST:", req.method, pathname);

    const body = req.body || {};

    try {

        // ✅ HEALTH CHECK
        if (matchRoute('GET', '/api/health', req.method, pathname)) {
            const { rows } = await db.query('SELECT NOW()');
            return send(res, 200, { status: "ok", time: rows[0].now });
        }

        // ✅ COMPANIES
        if (matchRoute('GET', '/api/companies', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM companies ORDER BY name');
            return send(res, 200, rows);
        }

        // ✅ USERS
        if (matchRoute('GET', '/api/users', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM users ORDER BY name');
            return send(res, 200, rows);
        }

        // ✅ SITES
        if (matchRoute('GET', '/api/sites', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM sites ORDER BY name');
            return send(res, 200, rows);
        }

        // ✅ EMPLOYEES
        if (matchRoute('GET', '/api/employees', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM employees ORDER BY name');
            return send(res, 200, rows);
        }

        // ✅ SESSIONS
        if (matchRoute('GET', '/api/sessions', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM training_sessions ORDER BY date ASC');
            return send(res, 200, rows);
        }

        // ✅ BOOKINGS
        if (matchRoute('GET', '/api/bookings', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM records');
            return send(res, 200, rows);
        }

        // ✅ WAITLIST
        if (matchRoute('GET', '/api/waitlist', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM waiting_list');
            return send(res, 200, rows);
        }

        // ✅ REQUIREMENTS
        if (matchRoute('GET', '/api/requirements', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM employee_requirements');
            return send(res, 200, rows);
        }

        // ✅ ROOMS
        if (matchRoute('GET', '/api/rooms', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM rooms');
            return send(res, 200, rows);
        }

        // ✅ RAC DEFINITIONS
        if (matchRoute('GET', '/api/rac-definitions', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM rac_definitions');
            return send(res, 200, rows);
        }

        // ✅ TRAINERS
        if (matchRoute('GET', '/api/trainers', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM trainers');
            return send(res, 200, rows);
        }

        // ✅ UNSAFE CONDITIONS
        if (matchRoute('GET', '/api/unsafe-conditions', req.method, pathname)) {
            const { rows } = await db.query('SELECT * FROM unsafe_conditions');
            return send(res, 200, rows);
        }

        // ❌ NOT FOUND
        return send(res, 404, { error: "Route not found", path: pathname });

    } catch (err) {
        console.error("ERROR:", err);
        return send(res, 500, { error: err.message });
    }
};