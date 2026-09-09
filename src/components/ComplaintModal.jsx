import React from 'react';
import { X, MapPin, Calendar, User, Wrench, Play, CheckCircle2 } from 'lucide-react';

export default function ComplaintModal({ complaint, onClose, onUpdateStatus }) {
  if (!complaint) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 bg-[#DBEAFE] text-[#2563EB] font-bold text-xs rounded-full font-mono">
              {complaint.id}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {complaint.category}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complaint Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-3 leading-snug">
          {complaint.title}
        </h3>

        {/* Status & Priority Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 block">
              Current Status:
            </span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">
              {complaint.status}
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 block">
              Priority Level:
            </span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">
              {complaint.priority}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-4">
          <span className="text-xs font-bold text-slate-900 block mb-1.5">
            Description:
          </span>
          <div className="bg-[#F1F6FD] rounded-xl p-3.5 border border-[#E1EDFA]">
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {complaint.description}
            </p>
          </div>
        </div>

        {/* 4 Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 mt-4 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <span className="truncate">{complaint.location || 'Campus General'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <span>Filed: {complaint.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <span className="truncate">By: {complaint.submittedBy}</span>
          </div>

          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <span className="truncate">Assigned: {complaint.assignedTo || 'Electrical Works'}</span>
          </div>
        </div>

        {/* Resolution Activity Log */}
        <div className="mt-4">
          <span className="text-xs font-bold text-slate-900 block mb-2">
            Resolution Activity Log:
          </span>
          <div className="space-y-2">
            {complaint.timeline && complaint.timeline.map((event, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-blue-100 shrink-0 mt-1" />
                  {idx < complaint.timeline.length - 1 && (
                    <div className="w-0.5 bg-blue-200 grow my-0.5 min-h-[22px]" />
                  )}
                </div>
                <div className="text-xs pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{event.status}</span>
                    <span className="text-slate-400 text-xs font-mono">
                      {event.date || event.eventDate}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">{event.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-2 flex items-center justify-between gap-3">
          <div>
            {complaint.status === 'Pending' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(complaint.id, 'In Progress');
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-[0.99]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Progress</span>
              </button>
            )}

            {complaint.status === 'In Progress' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(complaint.id, 'Resolved');
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-[0.99]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            )}

            {complaint.status === 'Resolved' && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ticket Resolved</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
