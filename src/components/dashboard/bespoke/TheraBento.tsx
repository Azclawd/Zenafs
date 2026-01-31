"use client";

import React from 'react';

interface TheraBentoProps {
  children: React.ReactNode;
  className?: string;
}

export const TheraBento: React.FC<TheraBentoProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 ${className}`}>
      {children}
    </div>
  );
};

type ResponsiveSpan = number | { base?: number; sm?: number; md?: number; lg?: number };

interface TheraCardProps {
  children: React.ReactNode;
  span?: ResponsiveSpan;
  className?: string;
  noPadding?: boolean;
}

export const TheraCard: React.FC<TheraCardProps> = ({
  children,
  span = 12,
  className = '',
  noPadding = false,
}) => {
  const getSpanClasses = (spanConfig: ResponsiveSpan): string => {
    if (typeof spanConfig === 'number') {
      return `col-span-1 sm:col-span-${Math.min(spanConfig, 6)} lg:col-span-${spanConfig}`;
    }

    const { base = 1, sm = base, md = sm, lg = md } = spanConfig;
    
    return `col-span-${base} sm:col-span-${Math.min(sm, 6)} md:col-span-${Math.min(md, 6)} lg:col-span-${lg}`;
  };

  const spanClasses = getSpanClasses(span);

  return (
    <div className={`${noPadding ? '' : 'card-base'} ${spanClasses} ${className}`}>
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
    <div className="flex items-start justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">{title}</h3>
            {badge && (
              <span
                className={`px-2 sm:px-2.5 py-0.5 text-xs font-medium rounded-full border ${badgeColorMap[badgeColor]}`}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0 ml-2">{action}</div>}
    </div>
  );
};
