/**
 * BESPOKE COMPONENT: TheraStatCard
 * Metric display cards for therapist side panel
 * 
 * Based on TheraDash design patterns from research
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TheraCard } from '../core/TheraCard';
import tokens from '@/styles/tokens';

export interface TheraStatCardProps {
  /** Stat label */
  label: string;
  
  /** Main value to display */
  value: string | number;
  
  /** Helper text below value */
  helper?: string;
  
  /** Icon component (Lucide icon) */
  icon: React.ComponentType<{ className?: string }>;
  
  /** Icon/accent color */
  tone?: 'primary' | 'coral' | 'purple' | 'yellow' | 'success';
  
  /** Optional trend indicator */
  trend?: {
    value: number;
    isPositive: boolean;
  };
  
  /** Click handler */
  onClick?: () => void;
  
  /** Additional className */
  className?: string;
}

export function TheraStatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'primary',
  trend,
  onClick,
  className = '',
}: TheraStatCardProps) {
  // Tone color map
  const toneColorMap = {
    primary: tokens.colors.primary.DEFAULT,
    coral: tokens.colors.secondary.coral,
    purple: tokens.colors.secondary.purple,
    yellow: tokens.colors.secondary.yellow,
    success: tokens.colors.status.success,
  };
  
  // Get tone color with 10% opacity for background
  const toneColor = toneColorMap[tone];
  const toneBgColor = `${toneColor}1A`; // 10% opacity
  
  return (
    <TheraCard
      padding="default"
      hoverable={Boolean(onClick)}
      onClick={onClick}
      className={className}
    >
      <div className="flex items-start justify-between">
        {/* Left: Label + Value */}
        <div className="min-w-0 flex-1">
          {/* Label */}
          <div
            className="font-medium"
            style={{
              fontSize: tokens.typography.fontSize.small,
              color: tokens.colors.text.secondary,
            }}
          >
            {label}
          </div>
          
          {/* Value */}
          <motion.div
            className="mt-2 font-semibold tracking-tight"
            style={{
              fontSize: '32px',
              color: tokens.colors.text.primary,
              lineHeight: tokens.typography.lineHeight.tight,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {value}
          </motion.div>
          
          {/* Helper text */}
          {helper && (
            <div
              className="mt-1"
              style={{
                fontSize: tokens.typography.fontSize.small,
                color: tokens.colors.text.muted,
              }}
            >
              {helper}
            </div>
          )}
          
          {/* Trend indicator */}
          {trend && (
            <motion.div
              className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                backgroundColor: trend.isPositive
                  ? `${tokens.colors.status.success}1A`
                  : `${tokens.colors.status.error}1A`,
                fontSize: tokens.typography.fontSize.tiny,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: trend.isPositive
                  ? tokens.colors.status.success
                  : tokens.colors.status.error,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </motion.div>
          )}
        </div>
        
        {/* Right: Icon */}
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: toneBgColor,
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: toneColor }}
          />
        </div>
      </div>
    </TheraCard>
  );
}

/**
 * THERA QUICK STAT
 * Inline stat (no card wrapper) for compact displays
 */
export interface TheraQuickStatProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: 'primary' | 'coral' | 'purple' | 'yellow' | 'success';
  className?: string;
}

export function TheraQuickStat({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  className = '',
}: TheraQuickStatProps) {
  const toneColorMap = {
    primary: tokens.colors.primary.DEFAULT,
    coral: tokens.colors.secondary.coral,
    purple: tokens.colors.secondary.purple,
    yellow: tokens.colors.secondary.yellow,
    success: tokens.colors.status.success,
  };
  
  const toneColor = toneColorMap[tone];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Icon && (
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: `${toneColor}1A`,
          }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: toneColor }}
          />
        </div>
      )}
      
      <div className="min-w-0">
        <div
          className="font-semibold truncate"
          style={{
            fontSize: tokens.typography.fontSize.body,
            color: tokens.colors.text.primary,
          }}
        >
          {value}
        </div>
        <div
          className="truncate"
          style={{
            fontSize: tokens.typography.fontSize.tiny,
            color: tokens.colors.text.muted,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/**
 * THERA STAT GRID
 * Grid layout for multiple quick stats
 */
export interface TheraStatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function TheraStatGrid({
  children,
  columns = 2,
  className = '',
}: TheraStatGridProps) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}

export default TheraStatCard;
