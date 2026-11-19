import React from 'react';
import { CrowdLevel } from '../../types';

interface OccupancyBarProps {
  current: number;
  capacity: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const OccupancyBar: React.FC<OccupancyBarProps> = ({
  current,
  capacity,
  showDetails = true,
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.round((current / capacity) * 100));

  let crowdLevel: CrowdLevel = 'Low';
  let barColor = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
  let textColor = 'text-emerald-400';

  if (percentage >= 90) {
    crowdLevel = 'Full';
    barColor = 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]';
    textColor = 'text-rose-400';
  } else if (percentage >= 70) {
    crowdLevel = 'High';
    barColor = 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
    textColor = 'text-amber-400';
  } else if (percentage >= 40) {
    crowdLevel = 'Moderate';
    barColor = 'bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.4)]';
    textColor = 'text-sky-400';
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${barColor}`} />
            Occupancy: <strong className={textColor}>{crowdLevel}</strong> ({percentage}%)
          </span>
          <span className="text-slate-300 font-semibold tabular-nums">
            {current} <span className="text-slate-500">/ {capacity} seats</span>
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/60 ${heights[size]}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
