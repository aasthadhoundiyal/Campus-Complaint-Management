/**
 * src/api.js
 * Thin, authenticated API client for the Campus Complaint backend.
 *
 * All methods accept an optional `token` string (Bearer JWT).
 * Responses are returned as parsed JSON.  Throws on non-2xx.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { token, method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const api = {
  /** Fetch notifications for the current user */
  getNotifications: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/notifications${qs ? '?' + qs : ''}`, { token });
  },

  /** GET /notifications/count  → { unread: n } */
  getNotificationCount: (token) => request('/notifications/count', { token }),

  /** POST /notifications/mark-read  body: { ids } | { all: true } */
  markNotificationsRead: (token, payload) =>
    request('/notifications/mark-read', { token, method: 'POST', body: payload }),

  // ── Analytics ──────────────────────────────────────────────────────────────
  /** GET /analytics/summary */
  getAnalyticsSummary: (token) => request('/analytics/summary', { token }),

  /** GET /analytics/dept */
  getAnalyticsDept: (token) => request('/analytics/dept', { token }),

  /** GET /analytics/trend?days=14 */
  getAnalyticsTrend: (token, days = 14) =>
    request(`/analytics/trend?days=${days}`, { token }),

  // ── Complaints ─────────────────────────────────────────────────────────────
  getComplaints: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/complaints${qs ? '?' + qs : ''}`, { token });
  },

  updateComplaintStatus: (token, id, status, note) =>
    request(`/complaints/${id}/status`, { token, method: 'PATCH', body: { status, note } }),

  submitComplaintFeedback: (token, id, rating, review) =>
    request(`/complaints/${id}/feedback`, { token, method: 'POST', body: { rating, review } }),

  createComplaint: (token, payload) =>
    request('/complaints', { token, method: 'POST', body: payload }),

  // ── Auth ───────────────────────────────────────────────────────────────────
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
};

export default api;
