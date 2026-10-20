/**
 * routes/complaints.routes.js
 *
 * Endpoints
 * ─────────────────────────────────────────────────────────────────────────────
 * GET    /api/complaints                  List (role-filtered); ?status= ?category= ?search=
 * GET    /api/complaints/:id              Single ticket (owner or admin)
 * POST   /api/complaints                  Create — auto-routes to department queue
 * PATCH  /api/complaints/:id/status       Admin only — enforces Pending→InProgress→Resolved
 * POST   /api/complaints/:id/feedback     Ticket owner — submit rating (1-5) once Resolved
 * GET    /api/complaints/:id/feedback     Owner or admin — read feedback for a ticket
 * GET    /api/complaints/routing/table    Admin only — inspect full routing table
 * GET    /api/complaints/activity-log     Admin only — paginated global activity log
 */

const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../db');
const { requireAuth, requireAdmin } = require('../auth');
const { resolveRoute, getRoutingTable } = require('../routing');

// ── Helpers ───────────────────────────────────────────────────────────────────

/** ISO-8601 timestamp, e.g. "2026-10-18T13:45:00.000Z" */
const ts = () => new Date().toISOString();

/** Valid status values and the allowed forward-only transitions */
const STATUS_ORDER = ['Pending', 'In Progress', 'Resolved'];

/**
 * Returns true when moving from `from` → `to` is a legal forward transition.
 * Admins may not skip steps or revert.
 */
function isValidTransition(from, to) {
  const fromIdx = STATUS_ORDER.indexOf(from);
  const toIdx   = STATUS_ORDER.indexOf(to);
  return fromIdx !== -1 && toIdx !== -1 && toIdx === fromIdx + 1;
}

// ── GET /api/complaints/routing/table  (admin) ────────────────────────────────
// NOTE: must be declared before /:id so Express matches it correctly.
router.get('/routing/table', requireAuth, requireAdmin, (_req, res) => {
  res.json({ routingTable: getRoutingTable() });
});

// ── GET /api/complaints/activity-log  (admin) ─────────────────────────────────
router.get('/activity-log', requireAuth, requireAdmin, (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page  || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));

  const all    = db.get('activityLog').value()
    .slice()
    .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

  const total  = all.length;
  const items  = all.slice((page - 1) * limit, page * limit);

  res.json({ total, page, limit, items });
});

// ── GET /api/complaints ───────────────────────────────────────────────────────
router.get('/', requireAuth, (req, res) => {
  const { status, category, search } = req.query;
  const user = req.user;

  let results = db.get('complaints').value();

  // Role-based filter — students / faculty only see their own tickets
  if (user.role !== 'admin') {
    results = results.filter(c => c.submittedById === user.id);
  }

  if (status && status !== 'all') {
    results = results.filter(c => c.status === status);
  }
  if (category && category !== 'all') {
    results = results.filter(c => c.category === category);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(c =>
      c.title.toLowerCase().includes(q)       ||
      c.id.toLowerCase().includes(q)          ||
      c.description.toLowerCase().includes(q) ||
      (c.location || '').toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }

  results = results.slice().sort((a, b) => (a.date > b.date ? -1 : 1));
  return res.json({ role: user.role, count: results.length, complaints: results });
});

// ── GET /api/complaints/:id ───────────────────────────────────────────────────
router.get('/:id', requireAuth, (req, res) => {
  const complaint = db.get('complaints').find({ id: req.params.id }).value();

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }
  if (req.user.role !== 'admin' && complaint.submittedById !== req.user.id) {
    return res.status(403).json({ error: 'Not authorised to view this complaint.' });
  }

  return res.json({ complaint });
});

// ── POST /api/complaints — Create with auto-routing ───────────────────────────
router.post('/', requireAuth, (req, res) => {
  const { title, category, priority, description, location } = req.body;

  if (!title || !category || !priority || !description) {
    return res.status(400).json({
      error: 'title, category, priority, and description are required.',
    });
  }

  const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: `priority must be one of: ${validPriorities.join(', ')}`,
    });
  }

  // ── Auto-routing ──────────────────────────────────────────────────────────
  const route = resolveRoute(category);

  const id  = `CMP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  const now = ts();

  const newComplaint = {
    id,
    title,
    category,
    priority,
    status:          'Pending',
    description,
    location:        location || 'Campus General',
    submittedById:   req.user.id,
    submittedBy:     `${req.user.name} (${req.user.role})`,
    // Routing fields populated automatically
    assignedQueue:   route.queue,
    assignedDept:    route.department,
    escalationEmail: route.escalationEmail,
    slaHours:        route.slaHours,
    slaDeadline:     new Date(Date.now() + route.slaHours * 3_600_000).toISOString(),
    date:            now.split('T')[0],
    updatedAt:       now,
    timeline: [
      {
        status:    'Submitted',
        timestamp: now,
        note:      `Complaint submitted by ${req.user.name}. Auto-routed to "${route.queue}".`,
        actor:     req.user.name,
        actorRole: req.user.role,
      },
    ],
  };

  db.get('complaints').push(newComplaint).write();

  // Write to global activity log
  db.get('activityLog').push({
    logId:       uuidv4(),
    complaintId: id,
    fromStatus:  null,
    toStatus:    'Pending',
    timestamp:   now,
    actor:       req.user.name,
    actorId:     req.user.id,
    actorRole:   req.user.role,
    note:        `Complaint created and routed to "${route.queue}".`,
  }).write();

  return res.status(201).json({
    message:   'Complaint created and routed successfully.',
    complaint: newComplaint,
    routing:   route,
  });
});

// ── PATCH /api/complaints/:id/status  (admin only) ───────────────────────────
router.patch('/:id/status', requireAuth, requireAdmin, (req, res) => {
  const { status, note } = req.body;

  if (!STATUS_ORDER.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${STATUS_ORDER.join(', ')}`,
    });
  }

  const complaint = db.get('complaints').find({ id: req.params.id }).value();
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  // ── Enforce forward-only transition ──────────────────────────────────────
  if (!isValidTransition(complaint.status, status)) {
    return res.status(422).json({
      error: `Invalid transition: "${complaint.status}" → "${status}". ` +
             `Allowed next status: "${STATUS_ORDER[STATUS_ORDER.indexOf(complaint.status) + 1] || 'none (already Resolved)'}"`,
    });
  }

  const now = ts();
  const actorNote = note?.trim() ||
    `Status updated to "${status}" by ${req.user.name} (${req.user.role}).`;

  const timelineEntry = {
    status,
    timestamp: now,
    note:      actorNote,
    actor:     req.user.name,
    actorRole: req.user.role,
  };

  // ── Persist status change ─────────────────────────────────────────────────
  db.get('complaints')
    .find({ id: req.params.id })
    .assign({
      status,
      updatedAt: now,
      timeline:  [...complaint.timeline, timelineEntry],
    })
    .write();

  // ── Append to global activity log ─────────────────────────────────────────
  const logEntry = {
    logId:       uuidv4(),
    complaintId: req.params.id,
    fromStatus:  complaint.status,
    toStatus:    status,
    timestamp:   now,
    actor:       req.user.name,
    actorId:     req.user.id,
    actorRole:   req.user.role,
    note:        actorNote,
  };
  db.get('activityLog').push(logEntry).write();

  const updated = db.get('complaints').find({ id: req.params.id }).value();
  return res.json({
    message:      `Status transitioned "${complaint.status}" → "${status}".`,
    complaint:    updated,
    activityLog:  logEntry,
  });
});

// ── POST /api/complaints/:id/feedback  (ticket owner, Resolved only) ─────────
router.post('/:id/feedback', requireAuth, (req, res) => {
  const { rating, review } = req.body;
  const complaintId = req.params.id;

  const complaint = db.get('complaints').find({ id: complaintId }).value();
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  // Only the submitter can leave feedback
  if (complaint.submittedById !== req.user.id) {
    return res.status(403).json({
      error: 'Only the complaint submitter can leave feedback.',
    });
  }

  // Feedback allowed only once the ticket is Resolved
  if (complaint.status !== 'Resolved') {
    return res.status(422).json({
      error: `Feedback can only be submitted for Resolved tickets. Current status: "${complaint.status}".`,
    });
  }

  // Prevent duplicate feedback
  const existing = db.get('feedback').find({ complaintId }).value();
  if (existing) {
    return res.status(409).json({
      error: 'Feedback already submitted for this complaint.',
      feedback: existing,
    });
  }

  // Validate rating
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'rating must be an integer between 1 and 5.' });
  }

  const now = ts();
  const feedbackEntry = {
    feedbackId:  uuidv4(),
    complaintId,
    submittedBy: req.user.name,
    submitterId: req.user.id,
    rating:      ratingNum,
    review:      (review || '').trim().slice(0, 1000), // max 1000 chars
    timestamp:   now,
  };

  db.get('feedback').push(feedbackEntry).write();

  // Stamp the complaint with aggregate feedback data
  db.get('complaints')
    .find({ id: complaintId })
    .assign({ feedback: { rating: ratingNum, review: feedbackEntry.review, submittedAt: now } })
    .write();

  return res.status(201).json({
    message:  'Feedback submitted successfully.',
    feedback: feedbackEntry,
  });
});

// ── GET /api/complaints/:id/feedback  (owner or admin) ───────────────────────
router.get('/:id/feedback', requireAuth, (req, res) => {
  const complaintId = req.params.id;

  const complaint = db.get('complaints').find({ id: complaintId }).value();
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  if (req.user.role !== 'admin' && complaint.submittedById !== req.user.id) {
    return res.status(403).json({ error: 'Not authorised to view feedback for this complaint.' });
  }

  const entry = db.get('feedback').find({ complaintId }).value();
  if (!entry) {
    return res.status(404).json({ error: 'No feedback submitted yet for this complaint.' });
  }

  return res.json({ feedback: entry });
});

module.exports = router;

