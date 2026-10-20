/**
 * server.js — Main Express application entry point
 *
 * API Base: http://localhost:4000/api
 *
 * Auth routes:
 *   POST  /api/auth/login                      — login, returns { token, user }
 *   POST  /api/auth/logout                     — destroy session
 *   GET   /api/auth/me                         — current session info
 *
 * Complaint routes:
 *   GET   /api/complaints                      — list (role-filtered); ?status ?category ?search
 *   POST  /api/complaints                      — create + auto-route to dept queue
 *   GET   /api/complaints/:id                  — single complaint (owner or admin)
 *   PATCH /api/complaints/:id/status           — transition status (admin, forward-only)
 *   POST  /api/complaints/:id/feedback         — submit rating 1-5 (owner, Resolved only)
 *   GET   /api/complaints/:id/feedback         — read feedback (owner or admin)
 *   GET   /api/complaints/routing/table        — routing table inspect (admin)
 *   GET   /api/complaints/activity-log         — paginated audit log (admin)
 *
 * Notification routes:
 *   GET   /api/notifications                   — fetch notifications for current user
 *   GET   /api/notifications/count             — unread count { unread: n }
 *   POST  /api/notifications/mark-read         — mark IDs read; body: { ids } | { all:true }
 *
 * Analytics routes (admin only):
 *   GET   /api/analytics/summary               — totals, by-status, avg resolution time, SLA
 *   GET   /api/analytics/dept                  — per-department breakdown
 *   GET   /api/analytics/trend                 — daily submitted/resolved (?days=14)
 *
 * Admin routes:
 *   GET   /api/users                           — list users (admin only)
 *   GET   /api/health                          — health check
 */

const express = require('express');
const cors    = require('cors');
const db      = require('./db');
const { requireAuth, requireAdmin } = require('./auth');

const authRoutes          = require('./routes/auth.routes');
const complaintsRoutes    = require('./routes/complaints.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const analyticsRoutes     = require('./routes/analytics.routes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/complaints',    complaintsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/analytics',     analyticsRoutes);

// ── GET /api/health ────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const counts = {
    users:       db.get('users').value().length,
    complaints:  db.get('complaints').value().length,
    activityLog: db.get('activityLog').value().length,
    feedback:    db.get('feedback').value().length,
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
  let userCount = 0;
  try {
    userCount = (db.get('users').value() || []).length;
  } catch (_e) {
    userCount = 0;
  }

  if (userCount === 0) {
    console.log('⚡ Empty database detected. Auto-seeding initial demo data...');
    try {
      require('./seed');
    } catch (err) {
      console.error('Failed to auto-seed demo data:', err.message);
    }
  }

  const counts = {
    users:       (db.get('users').value() || []).length,
    complaints:  (db.get('complaints').value() || []).length,
    activityLog: (db.get('activityLog').value() || []).length,
    feedback:    (db.get('feedback').value() || []).length,
  };
  console.log(`\n🎓  Campus Complaint API running on http://localhost:${PORT}`);
  console.log(`   Loaded: ${counts.users} users | ${counts.complaints} complaints | ${counts.activityLog} log entries | ${counts.feedback} feedback`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
