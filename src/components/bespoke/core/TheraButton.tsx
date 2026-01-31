/**
 * BESPOKE COMPONENT: TheraButton
 * Button system matching TheraDash design
 * 
 * NO SHADCN - Built from scratch with exact design specs
 */

import React from 'react';
import { motion } from 'framer-motion';
import tokens from '@/styles/tokens';

export interface TheraButtonProps {
  /** Button content */
  children: React.ReactNode;
  
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /** Button size */
  size?: 'small' | 'default' | 'large';
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Icon (Lucide component) */
  icon?: React.ComponentType<{ className?: string }>;
  
  /** Icon position */
  iconPosition?: 'left' | 'right';
  
  /** Click handler */
  onClick?: () => void;
  
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  
  /** Additional className */
  className?: string;
}

export function TheraButton({
  children,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
}: TheraButtonProps) {
  // Size styles
  const sizeStyles = {
    small: {
      padding: '8px 16px',
      fontSize: tokens.typography.fontSize.small,
      height: '32px',
      iconSize: '16px',
    },
    default: {
      padding: '12px 24px',
      fontSize: tokens.typography.fontSize.body,
      height: '40px',
      iconSize: '18px',
    },
    large: {
      padding: '16px 32px',
      fontSize: tokens.typography.fontSize.h3,
      height: '48px',
      iconSize: '20px',
    },
  };
  
  // Variant styles
  const variantStyles = {
    primary: {
      background: tokens.colors.primary.DEFAULT,
      color: '#FFFFFF',
      border: 'none',
      hover: {
        background: tokens.colors.primary.dark,
      },
    },
    secondary: {
      background: tokens.colors.status.success,
      color: '#FFFFFF',
      border: 'none',
      hover: {
        background: '#22C55E',
      },
    },
    outline: {
      background: 'transparent',
      color: tokens.colors.text.primary,
      border: `1px solid ${tokens.colors.border.DEFAULT}`,
      hover: {
        background: tokens.colors.background.page,
        borderColor: tokens.colors.border.hover,
      },
    },
    ghost: {
      background: 'transparent',
      color: tokens.colors.text.secondary,
      border: 'none',
      hover: {
        background: tokens.colors.background.page,
        color: tokens.colors.text.primary,
      },
    },
  };
  
  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-xl
        transition-all duration-150
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        padding: currentSize.padding,
        height: currentSize.height,
        fontSize: currentSize.fontSize,
        backgroundColor: currentVariant.background,
        color: currentVariant.color,
        border: currentVariant.border || 'none',
      }}
      whileHover={
        !disabled && !loading
          ? {
              backgroundColor: currentVariant.hover.background,
              borderColor: currentVariant.hover?.borderColor,
              color: currentVariant.hover?.color,
              scale: 1.02,
            }
          : undefined
      }
      whileTap={
        !disabled && !loading
          ? {
              scale: 0.98,
            }
          : undefined
      }
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      
      {/* Left icon */}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon
          className="flex-shrink-0"
          style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
        />
      )}
      
      {/* Button text */}
      {!loading && children}
      
      {/* Right icon */}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon
          className="flex-shrink-0"
          style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
        />
      )}
    </motion.button>
  );
}

/**
 * THERA ICON BUTTON
 * Icon-only button (square)
 */
export interface TheraIconButtonProps {
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>;
  
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /** Button size */
  size?: 'small' | 'default' | 'large';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Accessibility label */
  ariaLabel: string;
  
  /** Additional className */
  className?: string;
}

export function TheraIconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'default',
  disabled = false,
  onClick,
  ariaLabel,
  className = '',
}: TheraIconButtonProps) {
  // Size styles
  const sizeStyles = {
    small: {
      size: '32px',
      iconSize: '16px',
    },
    default: {
      size: '40px',
      iconSize: '20px',
    },
    large: {
      size: '48px',
      iconSize: '24px',
    },
  };
  
  // Same variant styles as TheraButton
  const variantStyles = {
    primary: {
      background: tokens.colors.primary.DEFAULT,
      color: '#FFFFFF',
      hover: {
        background: tokens.colors.primary.dark,
      },
    },
    secondary: {
      background: tokens.colors.status.success,
      color: '#FFFFFF',
      hover: {
        background: '#22C55E',
      },
    },
    outline: {
      background: 'transparent',
      color: tokens.colors.text.primary,
      border: `1px solid ${tokens.colors.border.DEFAULT}`,
      hover: {
        background: tokens.colors.background.page,
      },
    },
    ghost: {
      background: 'transparent',
      color: tokens.colors.text.secondary,
      hover: {
        background: tokens.colors.background.page,
        color: tokens.colors.text.primary,
      },
    },
  };
  
  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        rounded-xl
        transition-all duration-150
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        width: currentSize.size,
        height: currentSize.size,
        backgroundColor: currentVariant.background,
        color: currentVariant.color,
        border: currentVariant.border || 'none',
      }}
      whileHover={
        !disabled
          ? {
              backgroundColor: currentVariant.hover.background,
              color: currentVariant.hover?.color,
              scale: 1.05,
            }
          : undefined
      }
      whileTap={
        !disabled
          ? {
              scale: 0.95,
            }
          : undefined
      }
    >
      <Icon style={{ width: currentSize.iconSize, height: currentSize.iconSize }} />
    </motion.button>
  );
}

export default TheraButton;
