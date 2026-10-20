/**
 * routes/analytics.routes.js
 *
 * Admin-only analytics API.
 *
 * GET /api/analytics/summary   -- total complaints, by-status counts,
 *                                  avg resolution time, SLA breaches, avg rating
 * GET /api/analytics/dept      -- per-department breakdown + resolution rate + avg rating
 * GET /api/analytics/trend     -- daily submitted/resolved counts
 *                                  ?days=<n> trailing days (default 14, max 90)
 */
const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { requireAuth, requireAdmin } = require('../auth');
const { resolveRoute } = require('../routing');

// GET /api/analytics/summary
router.get('/summary', requireAuth, requireAdmin, (_req, res) => {
  const complaints  = db.get('complaints').value();
  const feedbackAll = db.get('feedback').value();
  const log         = db.get('activityLog').value();

  const total    = complaints.length;
  const byStatus = { Pending: 0, 'In Progress': 0, Resolved: 0 };
  complaints.forEach(c => { if (byStatus[c.status] !== undefined) byStatus[c.status]++; });

  // Avg resolution time for Resolved tickets (hrs between submission date and resolution log entry)
  let totalHrs = 0, countRes = 0;
  complaints.filter(c => c.status === 'Resolved').forEach(c => {
    const resolvedEntry = log
      .filter(e => e.complaintId === c.id && e.toStatus === 'Resolved')
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))[0];
    if (resolvedEntry && c.date) {
      const hrs = (new Date(resolvedEntry.timestamp) - new Date(c.date + 'T00:00:00Z')) / 3600000;
      if (hrs >= 0) { totalHrs += hrs; countRes++; }
    }
  });
  const avgResolutionHrs = countRes ? parseFloat((totalHrs / countRes).toFixed(2)) : null;

  // SLA breaches: past deadline and not yet Resolved
  const now         = new Date().toISOString();
  const slaBreaches = complaints.filter(c =>
    c.slaDeadline && c.status !== 'Resolved' && now > c.slaDeadline
  ).length;

  // Avg feedback rating
  const avgRating = feedbackAll.length
    ? parseFloat((feedbackAll.reduce((s, f) => s + f.rating, 0) / feedbackAll.length).toFixed(2))
    : null;

  return res.json({ total, byStatus, avgResolutionHrs, slaBreaches, feedback: { count: feedbackAll.length, avgRating } });
});

// GET /api/analytics/dept
router.get('/dept', requireAuth, requireAdmin, (_req, res) => {
  const complaints  = db.get('complaints').value();
  const feedbackAll = db.get('feedback').value();

  const deptMap = {};
  complaints.forEach(c => {
    const route = c.category ? resolveRoute(c.category) : null;
    const dept = c.assignedDept || (route ? route.department : 'Unassigned');
    const queue = c.assignedQueue || (route ? route.queue : dept);
    if (!deptMap[dept]) deptMap[dept] = { department: dept, queue, total: 0, pending: 0, inProgress: 0, resolved: 0, feedbackCount: 0, feedbackSum: 0 };
    deptMap[dept].total++;
    if (c.status === 'Pending')     deptMap[dept].pending++;
    if (c.status === 'In Progress') deptMap[dept].inProgress++;
    if (c.status === 'Resolved')    deptMap[dept].resolved++;
  });

  feedbackAll.forEach(f => {
    const complaint = complaints.find(c => c.id === f.complaintId);
    if (!complaint) return;
    const dept = complaint.assignedDept || (complaint.category ? resolveRoute(complaint.category).department : 'Unassigned');
    if (deptMap[dept]) { deptMap[dept].feedbackCount++; deptMap[dept].feedbackSum += f.rating; }
  });

  const departments = Object.values(deptMap).map(d => ({
    department:     d.department,
    queue:          d.queue,
    total:          d.total,
    pending:        d.pending,
    inProgress:     d.inProgress,
    resolved:       d.resolved,
    resolutionRate: d.total ? parseFloat(((d.resolved / d.total) * 100).toFixed(1)) : 0,
    avgRating:      d.feedbackCount ? parseFloat((d.feedbackSum / d.feedbackCount).toFixed(2)) : null,
  })).sort((a, b) => b.total - a.total);

  return res.json({ count: departments.length, departments });
});

// GET /api/analytics/trend
router.get('/trend', requireAuth, requireAdmin, (req, res) => {
  const days = Math.min(90, Math.max(1, parseInt(req.query.days || '14', 10)));
  const complaints = db.get('complaints').value();
  const log        = db.get('activityLog').value();

  const today    = new Date();
  const dateList = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dateList.push(d.toISOString().split('T')[0]);
  }

  const submittedByDay = {};
  complaints.forEach(c => { if (c.date) submittedByDay[c.date] = (submittedByDay[c.date] || 0) + 1; });

  const resolvedByDay = {};
  log.filter(e => e.toStatus === 'Resolved').forEach(e => {
    const day = e.timestamp.split('T')[0];
    resolvedByDay[day] = (resolvedByDay[day] || 0) + 1;
  });

  const trend = dateList.map(date => ({
    date,
    submitted: submittedByDay[date] || 0,
    resolved:  resolvedByDay[date]  || 0,
  }));

  return res.json({ days, trend });
});

module.exports = router;
