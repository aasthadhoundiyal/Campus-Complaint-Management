/**
 * routes/notifications.routes.js
 *
 * GET  /api/notifications          -- fetch notifications for current user
 *      ?since=<ISO>  only newer than timestamp
 *      ?unread=true  only unread
 *      ?limit=<n>    max results (default 30)
 * POST /api/notifications/mark-read -- mark IDs as read; body: { ids:[...] } | { all:true }
 * GET  /api/notifications/count    -- returns { unread: n }
 */
const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { requireAuth } = require('../auth');

function buildMessage(entry) {
  if (!entry.fromStatus) return 'Complaint ' + entry.complaintId + ' was submitted and routed to queue.';
  return 'Complaint ' + entry.complaintId + ' moved from "' + entry.fromStatus + '" to "' + entry.toStatus + '".';
}

function isRelevant(entry, user, complaints) {
  if (user.role === 'admin') return entry.fromStatus !== null;
  const c = complaints.find(c => c.id === entry.complaintId);
  return c ? c.submittedById === user.id : false;
}

function ensureReads() {
  if (!db.has('notificationReads').value()) db.set('notificationReads', []).write();
}

// GET /api/notifications
router.get('/', requireAuth, (req, res) => {
  ensureReads();
  const user       = req.user;
  const since      = req.query.since || null;
  const onlyUnread = req.query.unread === 'true';
  const limit      = Math.min(100, Math.max(1, parseInt(req.query.limit || '30', 10)));
  const complaints = db.get('complaints').value();
  const reads      = db.get('notificationReads').value();
  const readSet    = new Set(reads.filter(r => r.userId === user.id).map(r => r.logId));

  let log = db.get('activityLog').value().filter(e => isRelevant(e, user, complaints));
  if (since) log = log.filter(e => e.timestamp > since);
  log = log.slice().sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

  let notifications = log.map(e => ({
    id: e.logId, complaintId: e.complaintId,
    type: e.fromStatus === null ? 'created' : 'status_change',
    fromStatus: e.fromStatus, toStatus: e.toStatus,
    message: buildMessage(e), actor: e.actor, actorRole: e.actorRole,
    timestamp: e.timestamp, read: readSet.has(e.logId),
  }));

  if (onlyUnread) notifications = notifications.filter(n => !n.read);
  notifications = notifications.slice(0, limit);
  return res.json({ count: notifications.length, unread: notifications.filter(n => !n.read).length, notifications });
});

// GET /api/notifications/count
router.get('/count', requireAuth, (req, res) => {
  ensureReads();
  const user       = req.user;
  const complaints = db.get('complaints').value();
  const reads      = db.get('notificationReads').value();
  const readSet    = new Set(reads.filter(r => r.userId === user.id).map(r => r.logId));
  const unread     = db.get('activityLog').value()
    .filter(e => isRelevant(e, user, complaints))
    .filter(e => !readSet.has(e.logId)).length;
  return res.json({ unread });
});

// POST /api/notifications/mark-read
router.post('/mark-read', requireAuth, (req, res) => {
  ensureReads();
  const user         = req.user;
  const { ids, all } = req.body;

  if (all) {
    const complaints = db.get('complaints').value();
    const logIds     = db.get('activityLog').value()
      .filter(e => isRelevant(e, user, complaints)).map(e => e.logId);
    const reads      = db.get('notificationReads').value();
    const readSet    = new Set(reads.filter(r => r.userId === user.id).map(r => r.logId));
    const newEntries = logIds.filter(id => !readSet.has(id)).map(logId => ({ userId: user.id, logId }));
    if (newEntries.length > 0) db.get('notificationReads').push(...newEntries).write();
    return res.json({ marked: newEntries.length, message: 'All notifications marked as read.' });
  }

  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: 'Provide ids array or all:true.' });

  const reads      = db.get('notificationReads').value();
  const readSet    = new Set(reads.filter(r => r.userId === user.id).map(r => r.logId));
  const newEntries = ids.filter(id => !readSet.has(id)).map(logId => ({ userId: user.id, logId }));
  if (newEntries.length > 0) db.get('notificationReads').push(...newEntries).write();
  return res.json({ marked: newEntries.length, message: newEntries.length + ' notification(s) marked as read.' });
});

module.exports = router;
