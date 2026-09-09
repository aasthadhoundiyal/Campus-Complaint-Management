import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, User, Eye, EyeOff, ChevronDown } from 'lucide-react';

export default function AuthView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Student',
    department: 'Computer Science',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: formData.fullName || (formData.role === 'Student' ? 'Aastha Dhoundiyal' : 'Prof. Michael Vance'),
      email: formData.email || (formData.role === 'Student' ? 'aastha.dhoundiyal@campus.edu' : 'm.vance@campus.edu'),
      role: formData.role,
      department: formData.department || 'Computer Science & Engineering',
      avatar: formData.role === 'Student' ? 'AD' : 'MV'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D2E4F8] via-[#E1EDFA] to-[#CFE3F8] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 text-slate-800 font-sans">
      {/* Soft glowing ambient orbs matching reference */}
      <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-blue-300/45 blur-2xl pointer-events-none" />
      <div className="absolute top-8 right-12 w-80 h-80 rounded-full bg-blue-400/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-8 w-80 h-80 rounded-full bg-blue-300/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-blue-400/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-white/40 blur-2xl pointer-events-none" />

      {/* Main Login Card with straddling top badge */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-[28px] max-w-[440px] w-full pt-10 pb-8 px-8 sm:px-10 shadow-2xl shadow-blue-900/10 border border-white/90">
        
        {/* Floating Top Badge Icon straddling top edge */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-[#1B365D] text-white flex items-center justify-center shadow-lg shadow-blue-950/20 border-2 border-white">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>

        {/* Portal Title */}
        <div className="text-center mb-6 pt-1">
          <h1 className="text-xl sm:text-[22px] font-bold text-[#1E3A8A] tracking-tight">
            University Complaint Portal
          </h1>
        </div>

        {/* Tabs: Sign In / New Registration */}
        <div className="flex items-center justify-around border-b border-slate-100 mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold transition-all relative ${
              isLogin
                ? 'text-[#2563EB]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
            {isLogin && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              !isLogin
                ? 'text-[#2563EB]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            New Registration
            {!isLogin && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-full" />
            )}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              University Email / Roll No.
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Campus Designation
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition appearance-none cursor-pointer shadow-xs font-medium"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty / Professor</option>
                <option value="Staff">Administrative Staff</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-[0.99]"
          >
            {isLogin ? 'Sign In to Account' : 'Register Account'}
          </button>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
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
              className="text-xs font-medium text-[#2563EB] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
