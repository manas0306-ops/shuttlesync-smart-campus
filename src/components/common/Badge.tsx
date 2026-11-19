import React from 'react';
import { ShuttleStatus, CrowdLevel } from '../../types';
import { Clock, AlertTriangle, Users, CheckCircle2, Navigation2, Zap } from 'lucide-react';

interface BadgeProps {
  status?: ShuttleStatus;
  crowdLevel?: CrowdLevel;
  text?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, crowdLevel, text, className = '' }) => {
  if (status) {
    switch (status) {
      case 'On Time':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {text || 'On Time'}
          </span>
        );
      case 'Delayed':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 ${className}`}>
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            {text || 'Delayed'}
          </span>
        );
      case 'Crowded':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}>
            <Users className="w-3.5 h-3.5" />
            {text || 'Crowded'}
          </span>
        );
      case 'Approaching':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 animate-pulse ${className}`}>
            <Navigation2 className="w-3.5 h-3.5" />
            {text || 'Approaching'}
          </span>
        );
      case 'Boarding':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 ${className}`}>
            <Zap className="w-3.5 h-3.5" />
            {text || 'Boarding'}
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30 ${className}`}>
            <Clock className="w-3.5 h-3.5" />
            {text || status}
          </span>
        );
    }
  }

  if (crowdLevel) {
    switch (crowdLevel) {
      case 'Low':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 ${className}`}>
            Plenty of Seats
          </span>
        );
      case 'Moderate':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/15 text-sky-400 border border-sky-500/25 ${className}`}>
            Moderate Capacity
          </span>
        );
      case 'High':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/25 ${className}`}>
            Standing Room Only
          </span>
        );
      case 'Full':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/25 ${className}`}>
            Full / Overcrowded
          </span>
        );
    }
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
      {text}
    </span>
  );
};
