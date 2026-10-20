import React, { useState } from 'react';
import { Search, Menu, LogOut, ChevronDown, UserCheck, Shield } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Header({ 
  user, 
  onLogout, 
  searchQuery, 
  setSearchQuery, 
  setMobileOpen,
  stats,
  notifications = [],
  onMarkAllAsRead,
  onMarkAsRead,
  onSelectNotificationTicket,
  onOpenFeedbackModal,
  onToggleUserRole,
  token = null,
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-xs sticky top-0 z-30">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaint by keyword, ticket ID, or location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] bg-slate-50 text-slate-900 placeholder:text-slate-400 shadow-2xs transition"
          />
        </div>
      </div>

      {/* Right: Notification Dropdown & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher Pill */}
        {onToggleUserRole && (
          <button
            type="button"
            onClick={onToggleUserRole}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-blue-200 bg-[#DBEAFE]/60 hover:bg-[#DBEAFE] text-[#1E3A8A] transition shadow-2xs"
            title="Toggle between Student and Admin perspective"
          >
            {user.role === 'Admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Admin View</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Student View</span>
              </>
            )}
            <span className="text-[10px] text-blue-500 font-normal underline ml-0.5">Switch</span>
          </button>
        )}

        {/* 1) Interactive Notification Dropdown Panel */}
        <NotificationDropdown
          notifications={notifications}
          onMarkAllAsRead={onMarkAllAsRead}
          onMarkAsRead={onMarkAsRead}
          onSelectNotificationTicket={onSelectNotificationTicket}
          onOpenFeedbackModal={onOpenFeedbackModal}
          token={token}
        />

        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 py-1 px-2 text-left rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-[#DBEAFE]">
              {user.avatar || (user.name ? user.name[0] : 'U')}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {user.role} • {user.department}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#1E3A8A] rounded-md border border-blue-200">
                  Role: {user.role}
                </span>
              </div>

              {onToggleUserRole && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleUserRole();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Switch to {user.role === 'Admin' ? 'Student' : 'Admin'}</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                    Toggle
                  </span>
                </button>
              )}

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

