import React, { useState, useMemo } from 'react';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ComplaintForm from './components/ComplaintForm';
import ComplaintsTable from './components/ComplaintsTable';
import ComplaintModal from './components/ComplaintModal';
import { INITIAL_COMPLAINTS } from './data/mockData';
import { PlusCircle, HelpCircle, Phone } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState({
    name: 'Aastha Dhoundiyal',
    email: 'aastha.dhoundiyal@campus.edu',
    role: 'Student',
    department: 'Computer Science',
    avatar: 'AD'
  });

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

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

  const handleAddComplaint = (newComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    setTimeout(() => {
      setActiveTab('complaints');
      setStatusFilter('all');
    }, 1200);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedTimeline = [
            ...(c.timeline || []),
            {
              status: newStatus,
              date: new Date().toLocaleDateString(),
              note: `Status updated to ${newStatus} by ${user ? user.name : 'Officer'}`
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
  };

  if (!user) {
    return <AuthView onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 antialiased overflow-hidden font-sans">
      {/* Modern Blue Sidebar in Dark Navy Blue */}
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
      />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F8FAFC]">
        <Header
          user={user}
          onLogout={() => setUser(null)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          stats={stats}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-5">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl font-extrabold text-[#1E3A8A] tracking-tight">
                {activeTab === 'lodge'
                  ? 'Submit New Grievance'
                  : activeTab === 'faq'
                  ? 'Campus Emergency Contacts & FAQ'
                  : 'Grievance Redressal Dashboard'}
              </h1>
            </div>

            {activeTab !== 'lodge' && (
              <button
                type="button"
                onClick={() => setActiveTab('lodge')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-lg shadow-sm transition self-start sm:self-auto active:scale-[0.99]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ File Complaint</span>
              </button>
            )}
          </div>

          {/* Overview Bar with Total Complaints Ice Blue Card */}
          <StatsCards
            stats={stats}
            activeFilter={statusFilter}
            onFilterChange={(filter) => {
              setStatusFilter(filter);
              setActiveTab('complaints');
            }}
          />

          {/* Views */}
          {activeTab === 'lodge' ? (
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
            <ComplaintsTable
              complaints={filteredComplaints}
              onSelectComplaint={(item) => setSelectedComplaint(item)}
              onUpdateStatus={handleUpdateStatus}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          )}
        </main>
      </div>

      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
