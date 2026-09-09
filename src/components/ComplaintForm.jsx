import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../data/mockData';

export default function ComplaintForm({ onSubmitComplaint, onCancel, user }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newComplaint = {
      id: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      category,
      priority,
      status: 'Pending',
      location: location.trim() || 'Campus General',
      description: description.trim(),
      submittedBy: user ? `${user.name} (${user.role})` : 'Aastha Dhoundiyal (Student)',
      date: new Date().toISOString().split('T')[0],
      assignedTo: `${category} Cell`,
      timeline: [
        {
          status: 'Submitted',
          date: new Date().toLocaleDateString(),
          note: `Complaint registered by ${user ? user.name : 'Aastha Dhoundiyal'}.`
        }
      ]
    };

    onSubmitComplaint(newComplaint);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setDescription('');
      setLocation('');
      setPriority('Medium');
      if (onCancel) onCancel();
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="border-b border-slate-200 pb-4 mb-5">
        <h2 className="text-lg font-bold text-[#1E3A8A]">
          File a New Complaint
        </h2>
      </div>

      {submitted ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#1E3A8A]">
            Complaint Submitted Successfully
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Your complaint has been queued with status <span className="font-bold text-amber-700">Pending</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Complaint Subject / Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken bench in Lecture Hall 3"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] bg-white text-slate-900"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category / Department <span className="text-red-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campus Location / Room
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block B, 2nd Floor, Room 204"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Urgency / Priority <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-4">
              {PRIORITIES.map((p) => (
                <label key={p} className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                    className="accent-[#3B82F6] text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  <span className="font-medium">{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Description <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={4}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the problem clearly, including timing, symptoms, and who is affected..."
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] bg-white text-slate-900 resize-none"
            />
            <span className="text-[11px] text-slate-400 block text-right">
              {description.length}/500
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3.5 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
