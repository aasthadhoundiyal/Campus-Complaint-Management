import React, { useState } from 'react';
import { ArrowUpDown, Eye, Star, MessageSquare } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function ComplaintsTable({ 
  complaints, 
  onSelectComplaint, 
  onUpdateStatus,
  onOpenFeedback,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  user
}) {
  const [sortAsc, setSortAsc] = useState(false);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#DBEAFE] text-[#1E3A8A] border border-blue-200">
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200">
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority) => {
    const map = {
      Urgent: 'text-red-700 font-bold bg-red-50 border-red-200',
      High: 'text-amber-700 font-semibold bg-amber-50 border-amber-200',
      Medium: 'text-blue-700 font-semibold bg-blue-50 border-blue-200',
      Low: 'text-slate-600 font-medium bg-slate-50 border-slate-200',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-md border ${map[priority] || 'text-slate-700'}`}>
        {priority}
      </span>
    );
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    return sortAsc 
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Table Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Submitted Complaints
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {complaints.length} records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          >
            <option value="all">All Departments</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clean Modern Blue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Subject & Location</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-[#1E3A8A] select-none"
                onClick={() => setSortAsc(!sortAsc)}
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {sortedComplaints.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                  No complaints found matching current filters.
                </td>
              </tr>
            ) : (
              sortedComplaints.map((item) => (
                <tr 
                  key={item.id}
                  onClick={() => onSelectComplaint(item)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {/* ID */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-[#DBEAFE] px-2 py-0.5 rounded-md border border-blue-200">
                      {item.id}
                    </span>
                  </td>

                  {/* Subject & Location */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 leading-snug">
                      {item.title}
                    </div>
                    {item.location && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.location}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-xs text-slate-700 whitespace-nowrap font-medium">
                    {item.category}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderPriorityBadge(item.priority)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(item.id, 'In Progress')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-xs transition-colors"
                        >
                          Start Progress
                        </button>
                      )}
                      {item.status === 'In Progress' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(item.id, 'Resolved')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#10B981] hover:bg-[#059669] text-white shadow-xs transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}

                      {/* Post-Resolution Rating Button or Rating Badge */}
                      {item.status === 'Resolved' && (
                        item.feedback ? (
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold cursor-pointer hover:bg-amber-100 transition shadow-2xs"
                            title={`Feedback: "${item.feedback.comments || item.feedback.review || 'Satisfied'}"`}
                            onClick={() => onOpenFeedback && onOpenFeedback(item)}
                          >
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{item.feedback.rating}/5</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenFeedback && onOpenFeedback(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors active:scale-95"
                            title="Submit 1-5 star resolution feedback"
                          >
                            <Star className="w-3 h-3 fill-current" />
                            <span>Rate</span>
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectComplaint(item)}
                        className="text-slate-400 hover:text-[#3B82F6] p-1.5 rounded-lg hover:bg-slate-100 transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
