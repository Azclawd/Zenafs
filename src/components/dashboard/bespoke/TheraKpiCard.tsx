"use client";

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface TheraKpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    positive?: boolean;
  };
  icon?: LucideIcon;
  iconColor?: 'teal' | 'coral' | 'purple' | 'green';
  statusDot?: 'confirmed' | 'pending' | 'cancelled';
  subtitle?: string;
}

const TheraKpiCard: React.FC<TheraKpiCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'teal',
  statusDot,
  subtitle,
}) => {
  const iconColorMap = {
    teal: 'icon-circle-teal',
    coral: 'icon-circle-coral',
    purple: 'icon-circle-purple',
    green: 'icon-circle-green',
  };

  const statusDotColorMap = {
    confirmed: 'status-dot-confirmed',
    pending: 'status-dot-pending',
    cancelled: 'status-dot-cancelled',
  };

  return (
    <div className="card-base group">
      {/* Header with status dot */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {statusDot && (
            <span className={`status-dot ${statusDotColorMap[statusDot]}`} />
          )}
          <span className="metric-label">{title}</span>
        </div>
        {Icon && (
          <div className={`icon-circle ${iconColorMap[iconColor]} opacity-90 group-hover:opacity-100 transition-opacity`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="metric-value mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Change indicator or subtitle */}
      {change && (
        <div className="flex items-center gap-1.5">
          {change.positive !== undefined && (
            change.positive ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-500" />
            )
          )}
          <span
            className={`text-sm font-semibold ${
              change.positive === undefined
                ? 'text-slate-600'
                : change.positive
                ? 'text-emerald-600'
                : 'text-rose-500'
            }`}
          >
            {change.value > 0 ? '+' : ''}
            {change.value}%
          </span>
          <span className="text-xs text-slate-500">{change.period}</span>
        </div>
      )}

      {subtitle && !change && (
        <p className="text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
};

export default TheraKpiCard;
