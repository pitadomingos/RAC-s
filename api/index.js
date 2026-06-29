const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ✅ DB Pool (singleton)
let pool;

function getPool() {
    if (!pool) {
        let sslConfig = false;

        try {
            // ✅ Try reading local cert (if exists)
            const caPath = path.join(__dirname, 'ca.pem');
            if (fs.existsSync(caPath)) {
                const caCert = fs.readFileSync(caPath, 'utf8');
                sslConfig = { rejectUnauthorized: true, ca: caCert };
            }
        } catch (err) {
            console.log("No CA file found, using default SSL");
        }

        // ✅ Also allow ENV override (recommended)
        if (process.env.DB_CA_CERT) {
            sslConfig = {
                rejectUnauthorized: true,
                ca: process.env.DB_CA_CERT,
            };
        }

        pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: sslConfig,
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000
        });

        pool.on('error', (err) => {
            console.error('Unexpected DB error:', err.message);
        });
    }

    return pool;
}

// ✅ Helpers
function send(res, code, data) {
    res.status(code).json(data);
}

// ✅ Main handler (Vercel will call this)
module.exports = async (req, res) => {

    console.log("Incoming request:", req.method, req.url);

    // ✅ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = getPool();

    const pathname = req.url.split('?')[0];
    const body = req.body || {};

    try {

        // ✅ HEALTH CHECK
        if (req.method === 'GET' && pathname === '/api/health') {
            const { rows } = await db.query('SELECT NOW()');
            return send(res, 200, {
                status: "ok",
                time: rows[0].now
            });
        }

        // ✅ USERS Example
        if (req.method === 'GET' && pathname === '/api/users') {
            const { rows } = await db.query('SELECT * FROM users');
            return send(res, 200, rows);
        }

        if (req.method === 'POST' && pathname === '/api/users') {
            const { name, email } = body;

            const { rows } = await db.query(
                `INSERT INTO users (name, email)
                 VALUES ($1, $2)
                 RETURNING *`,
                [name, email]
            );

            return send(res, 200, rows[0]);
        }

        // ✅ DEFAULT RESPONSE
        return send(res, 404, { error: "Route not found" });

    } catch (err) {
        console.error("API ERROR:", err);
        return send(res, 500, { error: err.message });
    }
};