"use client";

import React from 'react';

interface TheraBentoProps {
  children: React.ReactNode;
  className?: string;
}

export const TheraBento: React.FC<TheraBentoProps> = ({ children, className = '' }) => {
  return (
    <div className={`bento-grid ${className}`}>
      {children}
    </div>
  );
};

interface TheraCardProps {
  children: React.ReactNode;
  span?: 3 | 4 | 6 | 8 | 9 | 12;
  className?: string;
  noPadding?: boolean;
}

export const TheraCard: React.FC<TheraCardProps> = ({
  children,
  span = 12,
  className = '',
  noPadding = false,
}) => {
  const spanClass = `bento-col-span-${span}`;

  return (
    <div className={`${noPadding ? '' : 'card-base'} ${spanClass} ${className}`}>
      {children}
    </div>
  );
};

interface TheraCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: 'teal' | 'coral' | 'purple' | 'green';
  action?: React.ReactNode;
}

export const TheraCardHeader: React.FC<TheraCardHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  badgeColor = 'teal',
  action,
}) => {
  const badgeColorMap = {
    teal: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    coral: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && <div>{icon}</div>}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {badge && (
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${badgeColorMap[badgeColor]}`}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
