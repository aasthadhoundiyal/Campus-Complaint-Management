export const CATEGORIES = [
  'Hostel & Housing',
  'IT & Campus WiFi',
  'Infrastructure & Maintenance',
  'Academics & Faculty',
  'Cafeteria & Dining',
  'Security & Safety',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const STATUSES = ['Pending', 'In Progress', 'Resolved'];

export const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-2026-001',
    title: 'High-speed Wi-Fi down in Einstein Hall (Block C, 3rd Floor)',
    category: 'IT & Campus WiFi',
    priority: 'High',
    status: 'In Progress',
    description: 'Students preparing for midterm exams are unable to connect to the campus mesh network or access academic portals since yesterday afternoon.',
    location: 'Hostel Block C - Room 304 corridor',
    submittedBy: 'Aastha Dhoundiyal (Student ID: CS-2023-882)',
    date: '2026-09-07',
    assignedTo: 'Network Operations Team',
    timeline: [
      { status: 'Submitted', date: '2026-09-07 14:10', note: 'Ticket created by Aastha Dhoundiyal' },
      { status: 'In Progress', date: '2026-09-08 09:30', note: 'Technician dispatched to replace router access point' },
    ]
  },
  {
    id: 'CMP-2026-002',
    title: 'Water leakage in Engineering Lab 402 ceiling',
    category: 'Infrastructure & Maintenance',
    priority: 'Urgent',
    status: 'Pending',
    description: 'Continuous dripping near computer racks after heavy morning rain. Poses a potential short-circuit hazard to lab equipment.',
    location: 'Academic Complex, 4th Floor Lab 402',
    submittedBy: 'Prof. Michael Vance (Dept. of EE)',
    date: '2026-09-08',
    assignedTo: 'Civil Maintenance Dept',
    timeline: [
      { status: 'Submitted', date: '2026-09-08 08:45', note: 'Urgent ticket logged with photo attachment' }
    ]
  },
  {
    id: 'CMP-2026-003',
    title: 'Faulty projector HDMI audio in Seminar Hall B',
    category: 'Academics & Faculty',
    priority: 'Medium',
    status: 'In Progress',
    description: 'The projector keeps flickering when switching to laptop HDMI audio, delaying guest lectures and project presentations.',
    location: 'Central Library, Ground Floor Seminar Hall B',
    submittedBy: 'Sarah Jenkins (Student Council Rep)',
    date: '2026-09-06',
    assignedTo: 'AV Support Team',
    timeline: [
      { status: 'Submitted', date: '2026-09-06 11:20', note: 'Reported by Student Council' },
      { status: 'In Progress', date: '2026-09-07 15:00', note: 'Testing new HDMI extender & splitter' },
    ]
  },
  {
    id: 'CMP-2026-004',
    title: 'Broken hot water geyser in Girls Hostel Block B',
    category: 'Hostel & Housing',
    priority: 'High',
    status: 'Pending',
    description: 'Geyser on the second-floor common washroom has tripped the circuit breaker and is not functioning.',
    location: 'Girls Hostel B, 2nd Floor Washroom',
    submittedBy: 'Priya Sharma (Resident Student)',
    date: '2026-09-08',
    assignedTo: 'Electrical Works',
    timeline: [
      { status: 'Submitted', date: '2026-09-08 10:15', note: 'Ticket assigned to duty electrician' }
    ]
  },
  {
    id: 'CMP-2026-005',
    title: 'Cold food served at North Campus Cafeteria lunch counter',
    category: 'Cafeteria & Dining',
    priority: 'Low',
    status: 'Resolved',
    description: 'Food warmers were switched off during peak lunch hours (1:00 PM to 2:00 PM), causing meals to be lukewarm.',
    location: 'North Dining Hall, Counter 2',
    submittedBy: 'David Kim (Undergrad Year 2)',
    date: '2026-09-05',
    assignedTo: 'Dining Services Manager',
    feedback: {
      rating: 4,
      comments: 'Heating elements calibrated and cafeteria supervisor ensured warm lunch meals today.',
      tags: ['⚡ Fast Turnaround', '👨‍💼 Polite & Professional'],
      submittedAt: '2026-09-06T10:15:00.000Z',
      submittedBy: 'David Kim (Student)'
    },
    timeline: [
      { status: 'Submitted', date: '2026-09-05 13:30', note: 'Reported by student diner' },
      { status: 'In Progress', date: '2026-09-05 14:15', note: 'Inspected cafeteria heating units' },
      { status: 'Resolved', date: '2026-09-06 10:00', note: 'Heating elements calibrated and vendor warned' },
    ]
  },
  {
    id: 'CMP-2026-006',
    title: 'Broken street lamp near South Gate bicycle parking',
    category: 'Security & Safety',
    priority: 'Medium',
    status: 'In Progress',
    description: 'Area is completely dark after 7:30 PM, raising safety concerns for students walking back from late evening library sessions.',
    location: 'South Perimeter Road near Gate 3',
    submittedBy: 'Campus Watch & Patrol',
    date: '2026-09-07',
    assignedTo: 'Campus Security & Facilities',
    timeline: [
      { status: 'Submitted', date: '2026-09-07 19:40', note: 'Reported during evening security rounds' },
      { status: 'In Progress', date: '2026-09-08 11:10', note: 'Solar lamp pole replacement ordered' },
    ]
  },
  {
    id: 'CMP-2026-007',
    title: 'Air conditioning malfunction in Central Library 2nd Floor',
    category: 'Infrastructure & Maintenance',
    priority: 'Medium',
    status: 'Resolved',
    description: 'Central chiller unit shut down causing stuffy conditions in the quiet study wing during finals study week.',
    location: 'Central Library, 2nd Floor Quiet Study Area',
    submittedBy: 'Sarah Jenkins (Student)',
    date: '2026-09-04',
    assignedTo: 'HVAC Maintenance Cell',
    feedback: {
      rating: 5,
      comments: 'AC fan coil cleaned and temperature restored within 4 hours. Much appreciated!',
      tags: ['⚡ Fast Turnaround', '🛠️ Thorough Fix', '📢 Clear Communication'],
      submittedAt: '2026-09-04T16:30:00.000Z',
      submittedBy: 'Sarah Jenkins (Student)'
    },
    timeline: [
      { status: 'Submitted', date: '2026-09-04 09:15', note: 'Ticket logged by Sarah Jenkins' },
      { status: 'In Progress', date: '2026-09-04 11:00', note: 'Refrigerant valves serviced' },
      { status: 'Resolved', date: '2026-09-04 15:45', note: 'Chiller cooling test passed' },
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    ticketId: 'CMP-2026-007',
    title: 'Ticket Marked Resolved',
    message: 'Library AC repair was successfully verified by HVAC Cell. Please share your rating!',
    type: 'resolved',
    time: '15m ago',
    read: false,
    canFeedback: false,
  },
  {
    id: 'notif-2',
    ticketId: 'CMP-2026-001',
    title: 'Progress Update: Wi-Fi Access Point',
    message: 'Technician dispatched to replace router access point on Einstein Hall 3rd Floor.',
    type: 'in_progress',
    time: '1h ago',
    read: false,
    canFeedback: false,
  },
  {
    id: 'notif-3',
    ticketId: 'CMP-2026-002',
    title: 'Urgent Hazard Assigned',
    message: 'Water leakage in Lab 402 routed to Civil Maintenance Department for immediate isolation.',
    type: 'urgent',
    time: '3h ago',
    read: false,
    canFeedback: false,
  },
  {
    id: 'notif-4',
    ticketId: 'CMP-2026-005',
    title: 'Resolution Feedback Recorded',
    message: 'Thank you! Your 4-star feedback on Cafeteria warmers was forwarded to Quality Control.',
    type: 'feedback_prompt',
    time: 'Yesterday',
    read: true,
    canFeedback: false,
  }
];

