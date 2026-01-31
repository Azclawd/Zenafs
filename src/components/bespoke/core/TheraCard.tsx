/**
 * BESPOKE COMPONENT: TheraCard
 * Base card system matching TheraDash design exactly
 * 
 * NO SHADCN - Built from scratch with exact design specs
 */

import React from 'react';
import { motion } from 'framer-motion';
import tokens from '@/styles/tokens';

export interface TheraCardProps {
  /** Card content */
  children: React.ReactNode;
  
  /** Card padding variant */
  padding?: 'small' | 'default' | 'large';
  
  /** Enable hover effect */
  hoverable?: boolean;
  
  /** Click handler (makes card interactive) */
  onClick?: () => void;
  
  /** Additional className */
  className?: string;
  
  /** Disable default shadow */
  noShadow?: boolean;
  
  /** Background color override */
  backgroundColor?: string;
}

export function TheraCard({
  children,
  padding = 'default',
  hoverable = false,
  onClick,
  className = '',
  noShadow = false,
  backgroundColor,
}: TheraCardProps) {
  // Padding map
  const paddingMap = {
    small: tokens.spacing.card.small,
    default: tokens.spacing.card.DEFAULT,
    large: tokens.spacing.card.large,
  };
  
  const isInteractive = Boolean(onClick || hoverable);
  
  return (
    <motion.div
      className={`rounded-2xl ${isInteractive ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backgroundColor: backgroundColor || tokens.colors.background.card,
        padding: paddingMap[padding],
        boxShadow: noShadow ? 'none' : tokens.shadows.card,
        border: `1px solid ${tokens.colors.border.light}`,
      }}
      onClick={onClick}
      whileHover={
        isInteractive
          ? {
              boxShadow: tokens.shadows.hover,
              y: -2,
            }
          : undefined
      }
      whileTap={
        onClick
          ? {
              scale: 0.98,
            }
          : undefined
      }
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </motion.div>
  );
}

/**
 * THERA CARD HEADER
 * Standardized header for cards
 */
export interface TheraCardHeaderProps {
  /** Header title */
  title: string;
  
  /** Optional subtitle */
  subtitle?: string;
  
  /** Icon component (Lucide icon) */
  icon?: React.ComponentType<{ className?: string }>;
  
  /** Icon background color */
  iconColor?: 'primary' | 'coral' | 'purple' | 'yellow' | 'success';
  
  /** Right-side action */
  action?: React.ReactNode;
  
  /** Additional className */
  className?: string;
}

export function TheraCardHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'primary',
  action,
  className = '',
}: TheraCardHeaderProps) {
  // Icon background color map
  const iconColorMap = {
    primary: tokens.colors.primary.DEFAULT,
    coral: tokens.colors.secondary.coral,
    purple: tokens.colors.secondary.purple,
    yellow: tokens.colors.secondary.yellow,
    success: tokens.colors.status.success,
  };
  
  // Icon background with 10% opacity
  const iconBgColor = iconColorMap[iconColor];
  const iconBgRgba = `${iconBgColor}1A`; // Add 10% opacity
  
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: iconBgRgba,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: iconBgColor }}
            />
          </div>
        )}
        
        <div>
          <h3
            className="font-semibold"
            style={{
              fontSize: tokens.typography.fontSize.h3,
              color: tokens.colors.text.primary,
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="mt-1"
              style={{
                fontSize: tokens.typography.fontSize.small,
                color: tokens.colors.text.secondary,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * THERA CARD SECTION
 * Standardized section divider within cards
 */
export interface TheraCardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function TheraCardSection({ children, className = '' }: TheraCardSectionProps) {
  return (
    <div
      className={className}
      style={{
        borderTop: `1px solid ${tokens.colors.border.light}`,
        paddingTop: tokens.spacing.component,
        marginTop: tokens.spacing.component,
      }}
    >
      {children}
    </div>
  );
}

/**
 * THERA CARD FOOTER
 * Standardized footer for cards (e.g., "View all →")
 */
export interface TheraCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function TheraCardFooter({ children, className = '' }: TheraCardFooterProps) {
  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={{
        borderTop: `1px solid ${tokens.colors.border.light}`,
        paddingTop: tokens.spacing.component,
        marginTop: tokens.spacing.component,
      }}
    >
      {children}
    </div>
  );
}

export default TheraCard;
