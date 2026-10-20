/**
 * NotificationDropdown.jsx
 *
 * Interactive notification panel triggered by the bell icon.
 * - Polls /api/notifications every 20 s when the dropdown is open and
 *   /api/notifications/count every 30 s in the background for the badge.
 * - Falls back to prop-supplied `notifications` if no token is available
 *   (demo / guest mode).
 * - Supports mark-as-read (individual + "mark all") via the backend API.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Bell, CheckCircle2, Clock, AlertCircle, Star, Check, X, ChevronRight, Inbox,
  Wifi, ShieldCheck, Utensils, BookOpen, Home, Wrench,
} from 'lucide-react';
import { api } from '../api';

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(isoString) {
  if (!isoString) return '';
  const diffMs  = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)  return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)  return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function getTypeFromNotif(n) {
  if (n.toStatus === 'Resolved' || n.type === 'resolved') return 'resolved';
  if (n.toStatus === 'In Progress' || n.type === 'in_progress') return 'in_progress';
  if (n.type === 'urgent') return 'urgent';
  if (n.type === 'feedback_prompt') return 'feedback_prompt';
  if (n.type && n.type !== 'status_change') return n.type;
  return 'default';
}

function NotifIcon({ type }) {
  const cls = 'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs';
  switch (type) {
    case 'resolved':       return <div className={`${cls} bg-emerald-100 text-emerald-600 ring-2 ring-emerald-200/50`}><CheckCircle2 className="w-4 h-4" /></div>;
    case 'in_progress':    return <div className={`${cls} bg-blue-100 text-[#2563EB] ring-2 ring-blue-200/50`}><Clock className="w-4 h-4" /></div>;
    case 'feedback_prompt':return <div className={`${cls} bg-amber-100 text-amber-600 ring-2 ring-amber-200/50`}><Star className="w-4 h-4 fill-amber-400 text-amber-500" /></div>;
    case 'urgent':         return <div className={`${cls} bg-red-100 text-red-600 ring-2 ring-red-200/50`}><AlertCircle className="w-4 h-4" /></div>;
    default:               return <div className={`${cls} bg-blue-100 text-[#1E3A8A] ring-2 ring-blue-200/50`}><Bell className="w-4 h-4" /></div>;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotificationDropdown({
  notifications: propNotifications = [],
  onMarkAllAsRead,
  onMarkAsRead,
  onSelectNotificationTicket,
  onOpenFeedbackModal,
  token = null,
}) {
  const [isOpen,     setIsOpen]     = useState(false);
  const [filter,     setFilter]     = useState('all');
  const [liveNotifs, setLiveNotifs] = useState(null);  // null = not yet fetched
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading,    setLoading]    = useState(false);
  const dropdownRef = useRef(null);
  const pollRef     = useRef(null);
  const badgePollRef = useRef(null);

  // Seamlessly merge live backend notifications and session alerts
  const notifications = useMemo(() => {
    if (liveNotifs === null) return propNotifications;
    const liveIds = new Set(liveNotifs.map(n => n.complaintId || n.ticketId || n.id));
    const sessionOnly = propNotifications.filter(n => !liveIds.has(n.ticketId) && !liveIds.has(n.id) && !liveIds.has(n.complaintId));
    return [...sessionOnly, ...liveNotifs];
  }, [liveNotifs, propNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // ── Fetch notifications from backend ────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await api.getNotifications(token, { limit: 30 });
      setLiveNotifs(data.notifications || []);
      setBadgeCount(data.unread || 0);
    } catch (_) { /* silently ignore — fall back to prop data */ }
    finally { setLoading(false); }
  }, [token]);

  const fetchBadgeCount = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getNotificationCount(token);
      setBadgeCount(data.unread || 0);
    } catch (_) {}
  }, [token]);

  // Badge polling — always active (30 s interval)
  useEffect(() => {
    if (!token) return;
    fetchBadgeCount();
    badgePollRef.current = setInterval(fetchBadgeCount, 30_000);
    return () => clearInterval(badgePollRef.current);
  }, [fetchBadgeCount, token]);

  // Notification list polling — only when open (20 s interval)
  useEffect(() => {
    if (!token) return;
    if (isOpen) {
      fetchNotifications();
      pollRef.current = setInterval(fetchNotifications, 20_000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [isOpen, fetchNotifications, token]);

  // Click-outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ── Mark as read ─────────────────────────────────────────────────────────────
  const handleMarkAsRead = async (id) => {
    if (token) {
      try {
        await api.markNotificationsRead(token, { ids: [id] });
        setLiveNotifs(prev => prev ? prev.map(n => n.id === id ? { ...n, read: true } : n) : prev);
        setBadgeCount(prev => Math.max(0, prev - 1));
      } catch (_) {}
    }
    if (onMarkAsRead) onMarkAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    if (token) {
      try {
        await api.markNotificationsRead(token, { all: true });
        setLiveNotifs(prev => prev ? prev.map(n => ({ ...n, read: true })) : prev);
        setBadgeCount(0);
      } catch (_) {}
    }
    if (onMarkAllAsRead) onMarkAllAsRead();
  };

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'resolved') {
      const t = getTypeFromNotif(n);
      return t === 'resolved' || t === 'feedback_prompt';
    }
    return true;
  });

  const localUnread = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className={`relative p-2 rounded-xl transition-all duration-150 border ${
          isOpen
            ? 'bg-[#DBEAFE] text-[#1E3A8A] border-blue-300 ring-2 ring-[#3B82F6]/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white'
        }`}
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notif-dropdown absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/20">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Ticket Alerts</h3>
                <p className="text-[11px] text-blue-200 font-medium">Real-time status tracking</p>
              </div>
              {localUnread > 0 && (
                <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                  {localUnread} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {localUnread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] text-blue-200 hover:text-white flex items-center gap-1 px-2 py-1 rounded transition hover:bg-white/10"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold">
            {[
              { id: 'all',      label: `All (${notifications.length})` },
              { id: 'unread',   label: `Unread (${localUnread})` },
              { id: 'resolved', label: 'Resolved' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === tab.id
                    ? 'bg-white text-[#1E3A8A] shadow border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {loading && (
              <span className="ml-auto text-[10px] text-slate-400 pr-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Syncing…
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Inbox className="w-9 h-9 text-slate-200 mx-auto mb-2 stroke-1" />
                <p className="text-xs font-semibold text-slate-700">No alerts found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {filter === 'unread' ? 'All caught up! ✓' : 'Complaint events will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map(item => {
                const type = getTypeFromNotif(item);
                const time = item.timestamp ? relativeTime(item.timestamp) : (item.time || '');
                return (
                  <div
                    key={item.id}
                    onClick={() => { if (!item.read) handleMarkAsRead(item.id); }}
                    className={`p-3.5 transition-colors cursor-pointer relative ${
                      item.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <NotifIcon type={type} />

                      <div className="flex-1 min-w-0">
                        {/* Ticket ID + time */}
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-mono text-[11px] font-bold text-[#1E3A8A] bg-[#DBEAFE] px-1.5 py-0.5 rounded border border-blue-200">
                            {item.complaintId || item.ticketId}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">{time}</span>
                        </div>

                        {/* Title */}
                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {item.title || (item.fromStatus
                            ? `Status: ${item.fromStatus} → ${item.toStatus}`
                            : `Ticket ${item.toStatus || 'updated'}`)}
                        </p>

                        {/* Message */}
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                          {item.message}
                        </p>

                        {/* Action buttons */}
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          {(item.canFeedback || type === 'resolved' || item.toStatus === 'Resolved') && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                if (onOpenFeedbackModal) onOpenFeedbackModal(item.complaintId || item.ticketId);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition active:scale-95"
                            >
                              <Star className="w-3 h-3 fill-current" />
                              <span>Rate Resolution</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              if (onSelectNotificationTicket) onSelectNotificationTicket(item.complaintId || item.ticketId);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                          >
                            <span>View Ticket</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-3.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium text-slate-600">Live alerts active</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {token ? 'Polling every 20s' : 'Demo mode'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
