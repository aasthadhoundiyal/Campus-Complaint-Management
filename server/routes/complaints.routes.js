/**
 * routes/complaints.routes.js
 *
 * Role-based access control on GET /api/complaints:
 *   student / faculty  →  only their own tickets  (filtered by submittedById)
 *   admin              →  ALL tickets
 *
 * Endpoints:
 *   GET    /api/complaints               list (role-filtered), supports ?status= ?category= ?search=
 *   GET    /api/complaints/:id           single ticket (own or admin)
 *   POST   /api/complaints               create new complaint
 *   PATCH  /api/complaints/:id/status    update ticket status (owner or admin)
 */

const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { requireAuth } = require('../auth');

// ── GET /api/complaints ───────────────────────────────────────────────────────
router.get('/', requireAuth, (req, res) => {
  const { status, category, search } = req.query;
  const user = req.user;

  // Start with all complaints
  let results = db.get('complaints').value();

  // ── ROLE-BASED FILTER ──────────────────────────────────────────────────────
  // Students and faculty see ONLY their own tickets
  if (user.role !== 'admin') {
    results = results.filter(c => c.submittedById === user.id);
  }

  // ── Optional query filters ─────────────────────────────────────────────────
  if (status && status !== 'all') {
    results = results.filter(c => c.status === status);
  }

  if (category && category !== 'all') {
    results = results.filter(c => c.category === category);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.location || '').toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  results = results.slice().sort((a, b) => (a.date > b.date ? -1 : 1));

  return res.json({
    role:       user.role,
    count:      results.length,
    complaints: results,
  });
});

// ── GET /api/complaints/:id ───────────────────────────────────────────────────
router.get('/:id', requireAuth, (req, res) => {
  const complaint = db.get('complaints').find({ id: req.params.id }).value();

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  // Non-admins can only view their own tickets
  if (req.user.role !== 'admin' && complaint.submittedById !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorised to view this complaint.' });
  }

  return res.json({ complaint });
});

// ── POST /api/complaints ──────────────────────────────────────────────────────
router.post('/', requireAuth, (req, res) => {
  const { title, category, priority, description, location } = req.body;

  if (!title || !category || !priority || !description) {
    return res.status(400).json({
      error: 'title, category, priority, and description are required.',
    });
  }

  const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${validPriorities.join(', ')}` });
  }

  const id    = `CMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const today = new Date().toISOString().split('T')[0];
  const now   = new Date().toLocaleString();

  const newComplaint = {
    id,
    title,
    category,
    priority,
    status:        'Pending',
    description,
    location:      location || 'Campus General',
    submittedById: req.user.id,
    submittedBy:   `${req.user.name} (${req.user.role})`,
    assignedTo:    `${category} Cell`,
    date:          today,
    updatedAt:     today,
    timeline: [
      { status: 'Submitted', eventDate: now, note: `Complaint submitted by ${req.user.name}.` },
    ],
  };

  db.get('complaints').push(newComplaint).write();

  return res.status(201).json({ message: 'Complaint created successfully.', complaint: newComplaint });
});

// ── PATCH /api/complaints/:id/status ─────────────────────────────────────────
router.patch('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
  }

  const complaint = db.get('complaints').find({ id: req.params.id }).value();

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  // Only admin or the ticket owner can update
  if (req.user.role !== 'admin' && complaint.submittedById !== req.user.id) {
    return res.status(403).json({ error: 'Not authorised to update this complaint.' });
  }

  const today = new Date().toISOString().split('T')[0];
  const now   = new Date().toLocaleString();

  // Update status and append timeline event
  db.get('complaints')
    .find({ id: req.params.id })
    .assign({
      status,
      updatedAt: today,
      timeline: [
        ...complaint.timeline,
        {
          status,
          eventDate: now,
          note: `Status updated to "${status}" by ${req.user.name} (${req.user.role}).`,
        },
      ],
    })
    .write();

  const updated = db.get('complaints').find({ id: req.params.id }).value();
  return res.json({ message: `Status updated to "${status}".`, complaint: updated });
});

module.exports = router;
