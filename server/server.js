/**
 * server.js — Main Express application entry point
 *
 * API Base: http://localhost:4000/api
 *
 * Routes:
 *   /api/auth/login        POST  — login, returns { token, user }
 *   /api/auth/logout       POST  — destroy session
 *   /api/auth/me           GET   — current session info
 *
 *   /api/complaints        GET   — list (role-filtered)
 *   /api/complaints        POST  — create new complaint
 *   /api/complaints/:id    GET   — single complaint
 *   /api/complaints/:id/status  PATCH  — update status
 *
 *   /api/users             GET   — list users (admin only)
 *   /api/health            GET   — health check
 */

const express = require('express');
const cors    = require('cors');
const db      = require('./db');
const { requireAuth, requireAdmin } = require('./auth');

const authRoutes       = require('./routes/auth.routes');
const complaintsRoutes = require('./routes/complaints.routes');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/complaints', complaintsRoutes);

// ── GET /api/health ────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const counts = {
    users:      db.get('users').value().length,
    complaints: db.get('complaints').value().length,
  };
  res.json({ status: 'ok', timestamp: new Date().toISOString(), data: counts });
});

// ── GET /api/users  (admin only) ───────────────────────────────────────────
app.get('/api/users', requireAuth, requireAdmin, (req, res) => {
  const users = db.get('users').value().map(u => ({
    id:         u.id,
    name:       u.name,
    email:      u.email,
    role:       u.role,
    department: u.department,
  }));
  res.json({ count: users.length, users });
});

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const counts = {
    users:      db.get('users').value().length,
    complaints: db.get('complaints').value().length,
  };
  console.log(`\n🎓  Campus Complaint API running on http://localhost:${PORT}`);
  console.log(`   Loaded: ${counts.users} users | ${counts.complaints} complaints`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
