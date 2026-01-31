/**
 * BESPOKE COMPONENT: TheraBadge
 * Status pills and badges matching TheraDash design
 */

import React from 'react';
import tokens from '@/styles/tokens';

export interface TheraBadgeProps {
  /** Badge content */
  children: React.ReactNode;
  
  /** Badge variant/tone */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'coral' | 'purple';
  
  /** Badge size */
  size?: 'small' | 'default';
  
  /** Optional icon */
  icon?: React.ComponentType<{ className?: string }>;
  
  /** Additional className */
  className?: string;
}

export function TheraBadge({
  children,
  variant = 'neutral',
  size = 'default',
  icon: Icon,
  className = '',
}: TheraBadgeProps) {
  // Variant color map
  const variantMap = {
    primary: {
      bg: `${tokens.colors.primary.DEFAULT}1A`,
      text: tokens.colors.primary.DEFAULT,
      border: tokens.colors.primary.light,
    },
    success: {
      bg: `${tokens.colors.status.success}1A`,
      text: tokens.colors.status.success,
      border: tokens.colors.status.success,
    },
    warning: {
      bg: `${tokens.colors.status.warning}1A`,
      text: tokens.colors.status.warning,
      border: tokens.colors.status.warning,
    },
    error: {
      bg: `${tokens.colors.status.error}1A`,
      text: tokens.colors.status.error,
      border: tokens.colors.status.error,
    },
    coral: {
      bg: `${tokens.colors.secondary.coral}1A`,
      text: tokens.colors.secondary.coral,
      border: tokens.colors.secondary.coral,
    },
    purple: {
      bg: `${tokens.colors.secondary.purple}1A`,
      text: tokens.colors.secondary.purple,
      border: tokens.colors.secondary.purple,
    },
    neutral: {
      bg: '#E5E7EB',
      text: tokens.colors.text.secondary,
      border: '#D1D5DB',
    },
  };
  
  // Size map
  const sizeMap = {
    small: {
      padding: '4px 8px',
      fontSize: tokens.typography.fontSize.tiny,
      iconSize: '12px',
    },
    default: {
      padding: '6px 12px',
      fontSize: tokens.typography.fontSize.small,
      iconSize: '14px',
    },
  };
  
  const colors = variantMap[variant];
  const sizing = sizeMap[size];
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${className}`}
      style={{
        padding: sizing.padding,
        fontSize: sizing.fontSize,
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}20`, // 12% opacity on border
      }}
    >
      {Icon && (
        <Icon
          style={{
            width: sizing.iconSize,
            height: sizing.iconSize,
          }}
        />
      )}
      {children}
    </span>
  );
}

/**
 * THERA DOT BADGE
 * Simple colored dot indicator
 */
export interface TheraDotBadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'default';
  className?: string;
}

export function TheraDotBadge({
  variant = 'success',
  size = 'default',
  className = '',
}: TheraDotBadgeProps) {
  const colorMap = {
    primary: tokens.colors.primary.DEFAULT,
    success: tokens.colors.status.success,
    warning: tokens.colors.status.warning,
    error: tokens.colors.status.error,
  };
  
  const sizeMap = {
    small: '6px',
    default: '8px',
  };
  
  return (
    <span
      className={`inline-block rounded-full ${className}`}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        backgroundColor: colorMap[variant],
      }}
    />
  );
}

export default TheraBadge;
