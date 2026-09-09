import React from 'react';
import { Files, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function StatsCards({ stats, onFilterChange, activeFilter }) {
  const cards = [
    {
      id: 'all',
      label: 'Total Complaints',
      value: stats.total,
      filter: 'all',
      icon: Files,
      isTotalCard: true,
    },
    {
      id: 'Pending',
      label: 'Pending Review',
      value: stats.pending,
      filter: 'Pending',
      icon: AlertCircle,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value: stats.inProgress,
      filter: 'In Progress',
      icon: Clock,
      badgeClass: 'bg-[#DBEAFE] text-[#1E3A8A] border-blue-200',
    },
    {
      id: 'Resolved',
      label: 'Resolved Tickets',
      value: stats.resolved,
      filter: 'Resolved',
      icon: CheckCircle2,
      badgeClass: 'bg-emerald-50 text-[#10B981] border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.filter;

        if (card.isTotalCard) {
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onFilterChange(card.filter)}
              className={`p-4 rounded-xl border text-left transition-all duration-150 shadow-sm relative overflow-hidden bg-[#DBEAFE] border-blue-200 ${
                isSelected
                  ? 'ring-2 ring-[#3B82F6] shadow-md'
                  : 'hover:brightness-95'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
                  {card.label}
                </span>
                <div className="p-1.5 rounded-lg bg-[#3B82F6] text-white shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A] tracking-tight">
                {card.value}
              </div>
            </button>
          );
        }

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterChange(card.filter)}
            className={`p-4 rounded-xl border text-left transition-all duration-150 shadow-sm bg-white border-slate-200 ${
              isSelected
                ? 'ring-2 ring-[#3B82F6] shadow-md'
                : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-700">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg border text-xs font-medium ${card.badgeClass || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {card.value}
            </div>
          </button>
        );
      })}
    </div>
  );
}
