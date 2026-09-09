/**
 * auth.js — Minimal session/token helpers
 *
 * Strategy: On login, the server stores the session in a plain JS Map
 * (keyed by a random token string). The token is returned to the client
 * and sent back on every request via the Authorization header.
 *
 * This is intentionally kept simple (no JWT, no bcrypt) to match the
 * project's scope while still demonstrating proper role-based access.
 */

const crypto = require('crypto');

// In-memory session store  { token → user row }
const sessions = new Map();

/**
 * Create a session for a user row and return a token.
 * @param {object} user
 * @returns {string} token
 */
function createSession(user) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, {
    id:         user.id,
    name:       user.name,
    email:      user.email,
    role:       user.role,
    department: user.department,
  });
  return token;
}

/**
 * Look up a session by token.
 * @param {string} token
 * @returns {object|undefined}
 */
function getSession(token) {
  return sessions.get(token);
}

/**
 * Express middleware: authenticate request.
 * Attaches req.user if valid, otherwise sends 401.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Send Authorization: Bearer <token>' });
  }

  const user = getSession(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  req.user = user;
  next();
}

/**
 * Express middleware: require admin role.
 * Must be used after requireAuth.
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

/**
 * Destroy a session (logout).
 */
function destroySession(token) {
  sessions.delete(token);
}

module.exports = { createSession, getSession, requireAuth, requireAdmin, destroySession };
