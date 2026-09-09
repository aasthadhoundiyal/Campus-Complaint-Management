/**
 * routes/auth.routes.js  —  POST /api/auth/login | POST /api/auth/logout | GET /api/auth/me
 */

const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { createSession, destroySession, requireAuth } = require('../auth');

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required.' });
  }

  const user = db.get('users').find({ email }).value();

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = createSession(user);

  return res.json({
    token,
    user: {
      id:         user.id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      department: user.department,
    },
  });
});

// ── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', requireAuth, (req, res) => {
  const token = (req.headers['authorization'] || '').slice(7);
  destroySession(token);
  res.json({ message: 'Logged out successfully.' });
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
