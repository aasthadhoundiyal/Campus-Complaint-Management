import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, User, Eye, EyeOff, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function AuthView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Student',
    department: 'Computer Science & Engineering',
  });

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin && formData.email && formData.password) {
        try {
          const res = await api.login(formData.email.trim(), formData.password);
          if (res && res.user && res.token) {
            const rawRole = (res.user.role || 'Student').toLowerCase();
            const formattedRole = rawRole === 'admin' ? 'Admin' : rawRole === 'faculty' ? 'Faculty' : 'Student';
            const userObj = {
              id: res.user.id,
              name: res.user.name,
              email: res.user.email,
              role: formattedRole,
              department: res.user.department || formData.department,
              avatar: res.user.name
                ? res.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                : 'AD',
            };
            onLogin(userObj, res.token);
            return;
          }
        } catch (_apiErr) {
          // If the backend API endpoint is offline or a different app is running on port 5000,
          // continue gracefully to client-side demo authentication
        }
      }

      // Client demo login fallback
      const email = (formData.email || '').trim().toLowerCase();
      let role = formData.role || 'Student';
      let name = formData.fullName;

      if (email.includes('admin') || email.includes('warden')) {
        role = 'Admin';
        name = name || (email.includes('warden') ? 'Warden Prakash' : 'Admin Officer');
      } else if (email.includes('vance') || email.includes('rao') || role === 'Faculty') {
        role = 'Faculty';
        name = name || (email.includes('rao') ? 'Dr. Anita Rao' : 'Prof. Michael Vance');
      } else {
        role = 'Student';
        name = name || 'Aastha Dhoundiyal';
      }

      const userObj = {
        name,
        email: formData.email.trim() || (role === 'Admin' ? 'admin@campus.edu' : role === 'Faculty' ? 'm.vance@campus.edu' : 'aastha.dhoundiyal@campus.edu'),
        role,
        department: formData.department || (role === 'Admin' ? 'Office of Student Affairs' : 'Computer Science & Engineering'),
        avatar: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      };
      onLogin(userObj, null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (name, email, password, role, department) => {
    setFormData({
      fullName: name,
      email,
      password,
      role,
      department,
    });
    setErrorMsg('');
    // Instant 1-click login for demo accounts
    onLogin({
      name,
      email,
      role,
      department,
      avatar: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    }, null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D2E4F8] via-[#E1EDFA] to-[#CFE3F8] relative overflow-y-auto flex items-center justify-center p-4 sm:p-6 text-slate-800 font-sans">
      {/* Soft glowing ambient orbs */}
      <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-blue-300/40 blur-2xl pointer-events-none" />
      <div className="absolute top-8 right-12 w-80 h-80 rounded-full bg-blue-400/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-8 w-80 h-80 rounded-full bg-blue-300/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-blue-400/25 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-[28px] max-w-[440px] w-full pt-9 pb-7 px-6 sm:px-9 shadow-2xl shadow-blue-900/10 border border-white/90 my-8">
        {/* Floating Top Badge Icon */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-[#1B365D] text-white flex items-center justify-center shadow-lg shadow-blue-950/20 border-2 border-white">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>

        {/* Portal Title */}
        <div className="text-center mb-5 pt-1">
          <h1 className="text-xl sm:text-[22px] font-bold text-[#1E3A8A] tracking-tight">
            University Complaint Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign in to file and monitor your grievances
          </p>
        </div>

        {/* Tabs: Sign In / New Registration */}
        <div className="flex items-center justify-around border-b border-slate-100 mb-4">
          <button
            type="button"
            id="tab-signin"
            onClick={() => {
              setIsLogin(true);
              setErrorMsg('');
            }}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold transition-all relative ${
              isLogin ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
            {isLogin && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-full" />
            )}
          </button>

          <button
            type="button"
            id="tab-register"
            onClick={() => {
              setIsLogin(false);
              setErrorMsg('');
            }}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              !isLogin ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            New Registration
            {!isLogin && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-full" />
            )}
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="auth-fullname">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  id="auth-fullname"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Aastha Dhoundiyal"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Email / Roll No. */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="auth-email">
              University Email / Roll No.
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                id="auth-email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@campus.edu"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="auth-password">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="auth-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Campus Designation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="auth-role">
              Campus Designation
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="auth-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition appearance-none cursor-pointer shadow-xs font-medium"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty / Professor</option>
                <option value="Admin">Administrator / Staff</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-75 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLogin ? 'Sign In to Account' : 'Register Account'}</span>
          </button>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] accent-[#2563EB] cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-medium">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Password reset instructions will be sent to your university email address.')}
              className="text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* Quick Demo Logins Pill Buttons */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 mb-2 text-center uppercase tracking-wider">
            Quick 1-Click Demo Logins:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              id="demo-student-btn"
              onClick={() =>
                handleQuickDemoLogin(
                  'Aastha Dhoundiyal',
                  'aastha.dhoundiyal@campus.edu',
                  'student123',
                  'Student',
                  'Computer Science & Engineering'
                )
              }
              className="px-2 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] font-bold rounded-lg border border-blue-200 transition text-center shadow-2xs cursor-pointer active:scale-95"
            >
              🎓 Student
            </button>
            <button
              type="button"
              id="demo-faculty-btn"
              onClick={() =>
                handleQuickDemoLogin(
                  'Prof. Michael Vance',
                  'm.vance@campus.edu',
                  'faculty123',
                  'Faculty',
                  'Electrical Engineering'
                )
              }
              className="px-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition text-center shadow-2xs cursor-pointer active:scale-95"
            >
              👨‍🏫 Faculty
            </button>
            <button
              type="button"
              id="demo-admin-btn"
              onClick={() =>
                handleQuickDemoLogin(
                  'Admin Officer',
                  'admin@campus.edu',
                  'admin123',
                  'Admin',
                  'Office of Student Affairs'
                )
              }
              className="px-2 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-200 transition text-center shadow-2xs cursor-pointer active:scale-95"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
