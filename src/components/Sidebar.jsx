import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  HelpCircle, 
  X,
  BarChart3,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  mobileOpen, 
  setMobileOpen,
  user
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'All Complaints', icon: FileText, count: stats.total },
    { id: 'pending', label: 'Pending Review', icon: AlertCircle, count: stats.pending },
    { id: 'in-progress', label: 'In Progress', icon: Clock, count: stats.inProgress },
    { id: 'resolved', label: 'Resolved Tickets', icon: CheckCircle2, count: stats.resolved },
    { id: 'analytics', label: 'Admin Analytics', icon: BarChart3, highlight: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#1E3A8A] border-r border-blue-950/40 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Institution Header */}
          <div className="p-5 border-b border-blue-900/50 flex items-center justify-between bg-[#1E3A8A]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white leading-tight tracking-tight">
                  Campus Complaint Cell
                </h1>
                <p className="text-xs text-blue-200/90 font-medium">Student Affairs Portal</p>
              </div>
            </div>

            <button 
              type="button" 
              className="lg:hidden p-1 text-blue-200 hover:text-white rounded"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clean Navigation Menu */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto bg-[#1E3A8A]">
            <div className="px-3 py-1.5 text-[11px] font-bold text-blue-300/80 uppercase tracking-wider">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition text-left ${
                    isActive
                      ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-200'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                      isActive ? 'bg-white text-[#1E3A8A]' : 'bg-blue-950/60 text-blue-200 border border-blue-800/50'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-blue-900/50">
              <div className="px-3 py-1 text-[11px] font-bold text-blue-300/80 uppercase tracking-wider">
                Support
              </div>
              <button
                type="button"
                onClick={() => { setActiveTab('faq'); setMobileOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition text-left ${
                  activeTab === 'faq'
                    ? 'bg-[#3B82F6] text-white font-semibold shadow-sm'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white font-medium'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-blue-200" />
                <span>Emergency Contacts</span>
              </button>
            </div>
          </nav>

          {/* Simple Academic Footer */}
          <div className="p-4 border-t border-blue-950/50 text-xs bg-[#172554] text-blue-200">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-white">Office of Student Affairs</p>
              {user && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-800">
                  {user.role}
                </span>
              )}
            </div>
            <p className="text-blue-300/80 text-[11px]">Admin Block, Room 104 • 2026–27</p>
          </div>
        </div>
      </aside>
    </>
  );
}
