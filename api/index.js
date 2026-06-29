import pg from 'pg';
const { Pool } = pg;

// ───────── DB CONNECTION ─────────
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }, // safe for most hosted DBs
    });
  }
  return pool;
}

// ───────── HELPER ─────────
function send(res, status, data) {
  res.status(status).json(data);
}

// ───────── MAIN HANDLER ─────────
export default async function handler(req, res) {

  // ✅ CORS (important)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getPool();

  // ✅ CLEAN & FIX PATH (CRITICAL)
  let path = req.url.split('?')[0];

  // remove trailing slash
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  // ensure /api prefix
  if (!path.startsWith('/api')) {
    path = '/api' + path;
  }

  console.log("REQUEST:", req.method, path);

  try {

    // ✅ HEALTH CHECK
    if (req.method === 'GET' && path === '/api/health') {
      return send(res, 200, { status: "ok" });
    }

    // ✅ COMPANIES
    if (req.method === 'GET' && path === '/api/companies') {
      const { rows } = await db.query('SELECT * FROM companies');
      return send(res, 200, rows);
    }

    // ✅ USERS
    if (req.method === 'GET' && path === '/api/users') {
      const { rows } = await db.query('SELECT * FROM users');
      return send(res, 200, rows);
    }

    // ✅ SITES
    if (req.method === 'GET' && path === '/api/sites') {
      const { rows } = await db.query('SELECT * FROM sites');
      return send(res, 200, rows);
    }

    // ✅ EMPLOYEES
    if (req.method === 'GET' && path === '/api/employees') {
      const { rows } = await db.query('SELECT * FROM employees');
      return send(res, 200, rows);
    }

    // ✅ SESSIONS
    if (req.method === 'GET' && path === '/api/sessions') {
      const { rows } = await db.query('SELECT * FROM training_sessions');
      return send(res, 200, rows);
    }

    // ✅ BOOKINGS
    if (req.method === 'GET' && path === '/api/bookings') {
      const { rows } = await db.query('SELECT * FROM records');
      return send(res, 200, rows);
    }

    // ✅ WAITLIST
    if (req.method === 'GET' && path === '/api/waitlist') {
      const { rows } = await db.query('SELECT * FROM waiting_list');
      return send(res, 200, rows);
    }

    // ✅ REQUIREMENTS
    if (req.method === 'GET' && path === '/api/requirements') {
      const { rows } = await db.query('SELECT * FROM employee_requirements');
      return send(res, 200, rows);
    }

    // ✅ ROOMS
    if (req.method === 'GET' && path === '/api/rooms') {
      const { rows } = await db.query('SELECT * FROM rooms');
      return send(res, 200, rows);
    }

    // ✅ RAC DEFINITIONS
    if (req.method === 'GET' && path === '/api/rac-definitions') {
      const { rows } = await db.query('SELECT * FROM rac_definitions');
      return send(res, 200, rows);
    }

    // ✅ TRAINERS
    if (req.method === 'GET' && path === '/api/trainers') {
      const { rows } = await db.query('SELECT * FROM trainers');
      return send(res, 200, rows);
    }

    // ✅ UNSAFE CONDITIONS
    if (req.method === 'GET' && path === '/api/unsafe-conditions') {
      const { rows } = await db.query('SELECT * FROM unsafe_conditions');
      return send(res, 200, rows);
    }

    // ❌ NOT FOUND
    return send(res, 404, { error: "Route not found", path });

  } catch (err) {
    console.error("ERROR:", err.message);
    return send(res, 200, { 
      error: err.message, 
      stack: err.stack,
      env: {
        DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
        DB_PORT: process.env.DB_PORT ? 'SET' : 'NOT SET',
        DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT SET',
        DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
        DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
        DB_HOS: process.env.DB_HOS ? 'SET' : 'NOT SET'
      },
      env_keys: Object.keys(process.env)
    });
  }
}