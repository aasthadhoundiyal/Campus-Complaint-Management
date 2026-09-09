/**
 * seed.js — Populate campus.json with realistic seed data.
 * Run: node seed.js
 * Safe to re-run; clears previous data first.
 */

const db = require('./db');

// ── 1. Clear existing data ────────────────────────────────────────────────────
db.set('users', []).set('complaints', []).write();

// ── 2. Seed Users ─────────────────────────────────────────────────────────────
// NOTE: Passwords are plain-text only for demo purposes.
const users = [
  // Students
  { id: 1, name: 'Aastha Dhoundiyal', email: 'aastha.dhoundiyal@campus.edu', password: 'student123', role: 'student', department: 'Computer Science & Engineering' },
  { id: 2, name: 'Priya Sharma',      email: 'priya.sharma@campus.edu',  password: 'student123', role: 'student', department: 'Electronics & Communication' },
  { id: 3, name: 'David Kim',         email: 'david.kim@campus.edu',     password: 'student123', role: 'student', department: 'Mechanical Engineering' },
  { id: 4, name: 'Sarah Jenkins',     email: 'sarah.jenkins@campus.edu', password: 'student123', role: 'student', department: 'Business Administration' },
  // Faculty
  { id: 5, name: 'Prof. Michael Vance', email: 'm.vance@campus.edu',     password: 'faculty123', role: 'faculty', department: 'Electrical Engineering' },
  { id: 6, name: 'Dr. Anita Rao',     email: 'a.rao@campus.edu',         password: 'faculty123', role: 'faculty', department: 'Computer Science & Engineering' },
  // Admins
  { id: 7, name: 'Admin Officer',     email: 'admin@campus.edu',         password: 'admin123',   role: 'admin',   department: 'Office of Student Affairs' },
  { id: 8, name: 'Warden Prakash',    email: 'warden@campus.edu',        password: 'admin123',   role: 'admin',   department: 'Hostel Administration' },
];

db.set('users', users).write();

// ── 3. Seed Complaints ─────────────────────────────────────────────────────────
const complaints = [
  {
    id: 'CMP-2026-001',
    title: 'High-speed Wi-Fi down in Einstein Hall (Block C, 3rd Floor)',
    category: 'IT & Campus WiFi',
    priority: 'High',
    status: 'In Progress',
    description: 'Students preparing for midterm exams cannot connect to the campus mesh network or access academic portals since yesterday afternoon.',
    location: 'Hostel Block C - Room 304 corridor',
    submittedById: 1,
    submittedBy: 'Aastha Dhoundiyal (student)',
    assignedTo: 'Network Operations Team',
    date: '2026-09-07',
    updatedAt: '2026-09-08',
    timeline: [
      { status: 'Submitted',   eventDate: '2026-09-07 14:10', note: 'Ticket created by Aastha Dhoundiyal.' },
      { status: 'In Progress', eventDate: '2026-09-08 09:30', note: 'Technician dispatched to replace router access point.' },
    ],
  },
  {
    id: 'CMP-2026-002',
    title: 'Water leakage in Engineering Lab 402 ceiling',
    category: 'Infrastructure & Maintenance',
    priority: 'Urgent',
    status: 'Pending',
    description: 'Continuous dripping near computer racks after heavy morning rain. Poses a potential short-circuit hazard to lab equipment.',
    location: 'Academic Complex, 4th Floor Lab 402',
    submittedById: 5,
    submittedBy: 'Prof. Michael Vance (faculty)',
    assignedTo: 'Civil Maintenance Department',
    date: '2026-09-08',
    updatedAt: '2026-09-08',
    timeline: [
      { status: 'Submitted', eventDate: '2026-09-08 08:45', note: 'Urgent ticket logged by Prof. Michael Vance.' },
    ],
  },
  {
    id: 'CMP-2026-003',
    title: 'Faulty projector HDMI audio in Seminar Hall B',
    category: 'Academics & Faculty',
    priority: 'Medium',
    status: 'In Progress',
    description: 'The projector keeps flickering when switching to laptop HDMI audio, disrupting guest lectures and presentations.',
    location: 'Central Library, Ground Floor Seminar Hall B',
    submittedById: 4,
    submittedBy: 'Sarah Jenkins (student)',
    assignedTo: 'AV Support Team',
    date: '2026-09-06',
    updatedAt: '2026-09-07',
    timeline: [
      { status: 'Submitted',   eventDate: '2026-09-06 11:20', note: 'Reported by Sarah Jenkins (Student Council Rep).' },
      { status: 'In Progress', eventDate: '2026-09-07 15:00', note: 'Testing new HDMI extender and splitter.' },
    ],
  },
  {
    id: 'CMP-2026-004',
    title: 'Broken hot water geyser in Girls Hostel Block B',
    category: 'Hostel & Housing',
    priority: 'High',
    status: 'Pending',
    description: 'Geyser on the second-floor common washroom has tripped the circuit breaker and is not functioning.',
    location: 'Girls Hostel B, 2nd Floor Washroom',
    submittedById: 2,
    submittedBy: 'Priya Sharma (student)',
    assignedTo: 'Electrical Works',
    date: '2026-09-08',
    updatedAt: '2026-09-08',
    timeline: [
      { status: 'Submitted', eventDate: '2026-09-08 10:15', note: 'Ticket assigned to duty electrician.' },
    ],
  },
  {
    id: 'CMP-2026-005',
    title: 'Cold food served at North Campus Cafeteria lunch counter',
    category: 'Cafeteria & Dining',
    priority: 'Low',
    status: 'Resolved',
    description: 'Food warmers were switched off during peak lunch hours (1 PM to 2 PM), causing meals to be lukewarm.',
    location: 'North Dining Hall, Counter 2',
    submittedById: 3,
    submittedBy: 'David Kim (student)',
    assignedTo: 'Dining Services Manager',
    date: '2026-09-05',
    updatedAt: '2026-09-06',
    timeline: [
      { status: 'Submitted',   eventDate: '2026-09-05 13:30', note: 'Reported by David Kim.' },
      { status: 'In Progress', eventDate: '2026-09-05 14:15', note: 'Cafeteria heating units inspected.' },
      { status: 'Resolved',    eventDate: '2026-09-06 10:00', note: 'Heating elements calibrated and vendor warned.' },
    ],
  },
  {
    id: 'CMP-2026-006',
    title: 'Broken street lamp near South Gate bicycle parking',
    category: 'Security & Safety',
    priority: 'Medium',
    status: 'In Progress',
    description: 'Area is completely dark after 7:30 PM, raising safety concerns for students walking back from late evening library sessions.',
    location: 'South Perimeter Road near Gate 3',
    submittedById: 1,
    submittedBy: 'Aastha Dhoundiyal (student)',
    assignedTo: 'Campus Security & Facilities',
    date: '2026-09-07',
    updatedAt: '2026-09-08',
    timeline: [
      { status: 'Submitted',   eventDate: '2026-09-07 19:40', note: 'Reported during evening security rounds.' },
      { status: 'In Progress', eventDate: '2026-09-08 11:10', note: 'Solar lamp pole replacement ordered.' },
    ],
  },
  {
    id: 'CMP-2026-007',
    title: 'Library AC making loud grinding noise on 2nd floor',
    category: 'Infrastructure & Maintenance',
    priority: 'Medium',
    status: 'Pending',
    description: 'The AC unit near the periodicals section produces a loud grinding sound, disrupting students studying for final exams.',
    location: 'Central Library, 2nd Floor Reading Room',
    submittedById: 1,
    submittedBy: 'Aastha Dhoundiyal (student)',
    assignedTo: 'Electrical & HVAC Maintenance',
    date: '2026-09-08',
    updatedAt: '2026-09-08',
    timeline: [
      { status: 'Submitted', eventDate: '2026-09-08 09:00', note: 'Reported by Aastha Dhoundiyal.' },
    ],
  },
  {
    id: 'CMP-2026-008',
    title: 'Attendance portal giving 502 error for CSE Dept students',
    category: 'IT & Campus WiFi',
    priority: 'High',
    status: 'Pending',
    description: 'The faculty attendance submission module throws a 502 Bad Gateway error on Chrome and Firefox. Affecting all CSE 3rd year students.',
    location: 'Online Portal - campus.edu/attendance',
    submittedById: 6,
    submittedBy: 'Dr. Anita Rao (faculty)',
    assignedTo: 'IT Helpdesk - Software Cell',
    date: '2026-09-08',
    updatedAt: '2026-09-08',
    timeline: [
      { status: 'Submitted', eventDate: '2026-09-08 10:00', note: 'Reported by Dr. Anita Rao, CS Department.' },
    ],
  },
];

db.set('complaints', complaints).write();

// ── 4. Summary ────────────────────────────────────────────────────────────────
const totalUsers      = db.get('users').value().length;
const totalComplaints = db.get('complaints').value().length;

console.log('\n✅  Seed complete!');
console.log(`   Users:      ${totalUsers}`);
console.log(`   Complaints: ${totalComplaints}\n`);
console.log('Demo accounts to test with:');
console.log('  Student  → aastha.dhoundiyal@campus.edu / student123   (sees CMP-001, 006, 007)');
console.log('  Student  → priya.sharma@campus.edu / student123   (sees CMP-004)');
console.log('  Student  → david.kim@campus.edu    / student123   (sees CMP-005)');
console.log('  Student  → sarah.jenkins@campus.edu / student123  (sees CMP-003)');
console.log('  Faculty  → m.vance@campus.edu      / faculty123   (sees CMP-002)');
console.log('  Admin    → admin@campus.edu         / admin123     (sees ALL tickets)\n');
