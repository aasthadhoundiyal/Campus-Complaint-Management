import React, { useState } from 'react';
import { Search, Menu, LogOut, ChevronDown, Bell } from 'lucide-react';

export default function Header({ 
  user, 
  onLogout, 
  searchQuery, 
  setSearchQuery, 
  setMobileOpen,
  stats
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-sm">
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

        {/* Minimal Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaint by keyword, ticket ID, or location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] bg-slate-50 text-slate-900 placeholder:text-slate-400 shadow-sm transition"
          />
        </div>
      </div>

      {/* Right: Academic User Info & Sign Out */}
      <div className="flex items-center gap-3">
        {/* Simple Institutional Notice */}
        <span className="hidden md:inline text-xs text-slate-500 font-medium">
          Academic Year 2026–27
        </span>

        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 py-1 px-2 text-left rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#DBEAFE]">
              {user.avatar || 'U'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {user.role} • {user.department}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-800">{user.name}</p>
                <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
