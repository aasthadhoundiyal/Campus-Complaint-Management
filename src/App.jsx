import React, { useState, useMemo, useEffect } from 'react';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ComplaintForm from './components/ComplaintForm';
import ComplaintsTable from './components/ComplaintsTable';
import ComplaintModal from './components/ComplaintModal';
import FeedbackModal from './components/FeedbackModal';
import AdminAnalytics from './components/AdminAnalytics';
import { INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { PlusCircle, HelpCircle, Phone, BarChart3, AlertCircle } from 'lucide-react';
import { api } from './api';

export default function App() {
  // Start with null user so application opens directly on the Login page
  const [user, setUser] = useState(null);

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [feedbackTicket, setFeedbackTicket] = useState(null);
  const [apiToken, setApiToken] = useState(null); // JWT for backend API calls

  // Handle successful login from AuthView
  const handleLogin = async (loggedInUser, token) => {
    setUser(loggedInUser);
    if (token) {
      setApiToken(token);
      try {
        const compRes = await api.getComplaints(token);
        if (compRes && Array.isArray(compRes.complaints) && compRes.complaints.length > 0) {
          setComplaints(compRes.complaints);
        }
      } catch (err) {
        console.warn('Backend fetch complaints warning:', err);
      }
    }
  };

  // Handle logout: return directly to login page
  const handleLogout = () => {
    setUser(null);
    setApiToken(null);
    setActiveTab('dashboard');
    setStatusFilter('all');
  };

  // Toggle user role between Student and Admin
  const handleToggleUserRole = () => {
    setUser((prev) => {
      if (!prev) return null;
      if (prev.role === 'Admin') {
        return {
          name: 'Aastha Dhoundiyal',
          email: 'aastha.dhoundiyal@campus.edu',
          role: 'Student',
          department: 'Computer Science',
          avatar: 'AD',
        };
      }
      return {
        name: 'Admin Officer',
        email: 'admin@campus.edu',
        role: 'Admin',
        department: 'Office of Student Affairs',
        avatar: 'AO',
      };
    });
  };

  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  }), [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (activeTab === 'pending' && c.status !== 'Pending') return false;
      if (activeTab === 'in-progress' && c.status !== 'In Progress') return false;
      if (activeTab === 'resolved' && c.status !== 'Resolved') return false;

      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.location || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complaints, activeTab, statusFilter, categoryFilter, searchQuery]);

  // Add new complaint + append real-time alert
  const handleAddComplaint = (newComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);

    // Real-time alert for new ticket
    const newAlert = {
      id: `notif-${Date.now()}`,
      ticketId: newComplaint.id,
      title: 'New Complaint Registered',
      message: `"${newComplaint.title}" queued for ${newComplaint.assignedTo || newComplaint.category}.`,
      type: newComplaint.priority === 'Urgent' ? 'urgent' : 'default',
      time: 'Just now',
      read: false,
      canFeedback: false,
    };
    setNotifications((prev) => [newAlert, ...prev]);

    // Persist to backend if token available
    if (apiToken) {
      api.createComplaint(apiToken, {
        title: newComplaint.title,
        category: newComplaint.category,
        priority: newComplaint.priority,
        description: newComplaint.description,
        location: newComplaint.location,
      }).then(res => {
        if (res && res.complaint) {
          setComplaints(prev => prev.map(c => c.id === newComplaint.id ? { ...c, ...res.complaint } : c));
        }
      }).catch(err => console.warn('Backend create complaint warning:', err));
    }

    setTimeout(() => {
      setActiveTab('complaints');
      setStatusFilter('all');
    }, 1200);
  };

  // Status transitions + append real-time notification
  const handleUpdateStatus = (id, newStatus) => {
    let targetTitle = '';
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          targetTitle = c.title;
          const updatedTimeline = [
            ...(c.timeline || []),
            {
              status: newStatus,
              date: new Date().toLocaleDateString(),
              note: `Status updated to "${newStatus}" by ${user ? user.name : 'Officer'}`
            }
          ];
          return { ...c, status: newStatus, timeline: updatedTimeline };
        }
        return c;
      })
    );

    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
    }

    // Call backend status transition endpoint
    if (apiToken) {
      api.updateComplaintStatus(apiToken, id, newStatus)
        .catch(err => console.warn('Backend status update warning:', err));
    }

    // Generate real-time alert in notifications dropdown
    const isResolved = newStatus === 'Resolved';
    const statusAlert = {
      id: `notif-${Date.now()}`,
      ticketId: id,
      title: isResolved ? 'Ticket Marked Resolved' : `Ticket Moved to ${newStatus}`,
      message: isResolved
        ? `Grievance "${targetTitle || id}" was resolved. Click to rate service quality.`
        : `Investigation underway for "${targetTitle || id}".`,
      type: isResolved ? 'resolved' : 'in_progress',
      time: 'Just now',
      read: false,
      canFeedback: isResolved,
    };
    setNotifications((prev) => [statusAlert, ...prev]);

    // If resolved, prompt student with the feedback modal
    if (isResolved) {
      const match = complaints.find(c => c.id === id);
      if (match) {
        setFeedbackTicket({ ...match, status: 'Resolved' });
      }
    }
  };

  // Handle post-resolution feedback submission
  const handleSubmitFeedback = (complaintId, feedbackPayload) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return { ...c, feedback: feedbackPayload };
        }
        return c;
      })
    );

    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint((prev) => ({ ...prev, feedback: feedbackPayload }));
    }

    // Call backend feedback endpoint
    if (apiToken) {
      api.submitComplaintFeedback(
        apiToken,
        complaintId,
        feedbackPayload.rating,
        feedbackPayload.comments || feedbackPayload.review || ''
      ).catch(err => console.warn('Backend feedback warning:', err));
    }

    // Add confirmation notification
    const feedbackAlert = {
      id: `notif-${Date.now()}`,
      ticketId: complaintId,
      title: 'Feedback Recorded',
      message: `Your ${feedbackPayload.rating}-star review was submitted for ${complaintId}.`,
      type: 'feedback_prompt',
      time: 'Just now',
      read: false,
      canFeedback: false,
    };
    setNotifications((prev) => [feedbackAlert, ...prev]);
  };

  // Notification actions
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleSelectNotificationTicket = (ticketId) => {
    const found = complaints.find((c) => c.id === ticketId);
    if (found) {
      setSelectedComplaint(found);
    }
  };

  const handleOpenFeedbackModal = (ticketOrId) => {
    if (typeof ticketOrId === 'string') {
      const found = complaints.find((c) => c.id === ticketOrId);
      if (found) setFeedbackTicket(found);
    } else {
      setFeedbackTicket(ticketOrId);
    }
  };

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 antialiased overflow-hidden font-sans">
      {/* Modern Blue Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (['pending', 'in-progress', 'resolved'].includes(tab)) {
            setStatusFilter(tab === 'pending' ? 'Pending' : tab === 'in-progress' ? 'In Progress' : 'Resolved');
          } else if (tab === 'complaints' || tab === 'dashboard') {
            setStatusFilter('all');
          }
        }}
        stats={stats}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
      />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F8FAFC]">
        {/* Header with Notification Dropdown & Role Switcher */}
        <Header
          user={user}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          stats={stats}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAsRead={handleMarkAsRead}
          onSelectNotificationTicket={handleSelectNotificationTicket}
          onOpenFeedbackModal={handleOpenFeedbackModal}
          onToggleUserRole={handleToggleUserRole}
          token={apiToken}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-5">
          {/* Page Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl font-extrabold text-[#1E3A8A] tracking-tight">
                {activeTab === 'lodge'
                  ? 'Submit New Grievance'
                  : activeTab === 'analytics'
                  ? 'Campus Resolution Analytics'
                  : activeTab === 'faq'
                  ? 'Campus Emergency Contacts & FAQ'
                  : 'Grievance Redressal Dashboard'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'analytics'
                  ? 'Executive workload, SLA compliance, and student satisfaction breakdown.'
                  : 'University Student Affairs Redressal Portal • Academic Year 2026–27'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {activeTab !== 'analytics' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-[#1E3A8A] border border-blue-200 text-xs font-bold rounded-lg shadow-2xs transition active:scale-[0.99]"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>View Analytics</span>
                </button>
              )}

              {activeTab !== 'lodge' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('lodge')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-[0.99]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ File Complaint</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Views */}
          {activeTab === 'analytics' ? (
            /* 3) Admin Analytics Section */
            <AdminAnalytics
              complaints={complaints}
              onSelectComplaint={(item) => setSelectedComplaint(item)}
              token={apiToken}
            />
          ) : activeTab === 'lodge' ? (
            <ComplaintForm
              user={user}
              onSubmitComplaint={handleAddComplaint}
              onCancel={() => setActiveTab('dashboard')}
            />
          ) : activeTab === 'faq' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#3B82F6]" />
                University Support & Escalation Channels
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-[#1E3A8A] mb-1">Campus Security Control Room</h3>
                  <p className="text-slate-600">Dial extension 2222 or call 011-2555-0199 for night security and physical emergency.</p>
                </div>
                <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-[#1E3A8A] mb-1">Estate & Maintenance Office</h3>
                  <p className="text-slate-600">Civil repairs, plumbing, electrical faults are serviced Monday to Saturday, 9 AM to 5 PM.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Bar with Total Complaints Ice Blue Card */}
              <StatsCards
                stats={stats}
                activeFilter={statusFilter}
                onFilterChange={(filter) => {
                  setStatusFilter(filter);
                  setActiveTab('complaints');
                }}
              />

              <ComplaintsTable
                complaints={filteredComplaints}
                onSelectComplaint={(item) => setSelectedComplaint(item)}
                onUpdateStatus={handleUpdateStatus}
                onOpenFeedback={handleOpenFeedbackModal}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                user={user}
              />
            </>
          )}
        </main>
      </div>

      {/* Ticket Details Modal */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdateStatus={handleUpdateStatus}
          onOpenFeedback={handleOpenFeedbackModal}
        />
      )}

      {/* 2) Post-Resolution Feedback Modal */}
      {feedbackTicket && (
        <FeedbackModal
          complaint={feedbackTicket}
          onClose={() => setFeedbackTicket(null)}
          onSubmitFeedback={handleSubmitFeedback}
          user={user}
        />
      )}
    </div>
  );
}

