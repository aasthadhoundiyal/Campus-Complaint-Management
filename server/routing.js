/**
 * routing.js — Automated department routing table.
 *
 * When a complaint is submitted, resolveRoute(category) is called to
 * assign the correct department queue, escalation contact, and SLA hours.
 *
 * Adding a new category: insert one entry in ROUTING_TABLE — no other
 * file needs changing.
 */

/**
 * @typedef {Object} RouteConfig
 * @property {string} queue           — Queue label stored on the complaint.
 * @property {string} department      — Owning department (matches user.department).
 * @property {string} escalationEmail — Contact if SLA is breached.
 * @property {number} slaHours        — Target resolution time in hours.
 */

/** @type {Record<string, RouteConfig>} */
const ROUTING_TABLE = {
  'IT & Campus WiFi': {
    queue:           'IT Helpdesk – Network & Systems',
    department:      'IT Services',
    escalationEmail: 'it-escalation@campus.edu',
    slaHours:        24,
  },
  'Infrastructure & Maintenance': {
    queue:           'Civil & Mechanical Maintenance',
    department:      'Facilities Management',
    escalationEmail: 'facilities@campus.edu',
    slaHours:        48,
  },
  'Academics & Faculty': {
    queue:           'Academic Affairs Office',
    department:      'Office of the Dean (Academics)',
    escalationEmail: 'dean-academics@campus.edu',
    slaHours:        72,
  },
  'Hostel & Housing': {
    queue:           'Hostel Administration',
    department:      'Hostel Administration',
    escalationEmail: 'warden@campus.edu',
    slaHours:        24,
  },
  'Cafeteria & Dining': {
    queue:           'Dining Services',
    department:      'Student Welfare',
    escalationEmail: 'dining@campus.edu',
    slaHours:        12,
  },
  'Security & Safety': {
    queue:           'Campus Security & Safety Cell',
    department:      'Security Office',
    escalationEmail: 'security@campus.edu',
    slaHours:        6,
  },
  'Health & Medical': {
    queue:           'Campus Health Centre',
    department:      'Medical Services',
    escalationEmail: 'health@campus.edu',
    slaHours:        4,
  },
  'Transport & Commute': {
    queue:           'Transport Management Office',
    department:      'Transport Services',
    escalationEmail: 'transport@campus.edu',
    slaHours:        24,
  },
  'Library & Resources': {
    queue:           'Library Administration',
    department:      'Central Library',
    escalationEmail: 'library@campus.edu',
    slaHours:        48,
  },
};

/** Fallback route for unknown / unmapped categories */
const FALLBACK_ROUTE = {
  queue:           'General Administration',
  department:      'Office of Student Affairs',
  escalationEmail: 'admin@campus.edu',
  slaHours:        72,
};

/**
 * Resolve routing config for a given complaint category.
 * Never returns null — falls back to General Administration.
 *
 * @param {string} category
 * @returns {RouteConfig}
 */
function resolveRoute(category) {
  return ROUTING_TABLE[category] ?? FALLBACK_ROUTE;
}

/**
 * Returns the full routing table (for admin inspection).
 * @returns {Record<string, RouteConfig>}
 */
function getRoutingTable() {
  return { ...ROUTING_TABLE };
}

module.exports = { resolveRoute, getRoutingTable, FALLBACK_ROUTE };
