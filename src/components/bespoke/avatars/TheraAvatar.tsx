/**
 * BESPOKE COMPONENT: TheraAvatar
 * Healthcare-appropriate avatar system using DiceBear
 * 
 * NO SHADCN - Built from scratch to match TheraDash design
 */

import React from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/avataaars';
import { lorelei } from '@dicebear/lorelei';
import { motion } from 'framer-motion';
import { getAvatarColors } from '@/styles/tokens';

export interface TheraAvatarProps {
  /** Unique identifier (used as seed for deterministic generation) */
  userId: string;
  
  /** Avatar size in pixels */
  size?: number;
  
  /** Avatar variant determines color palette */
  variant?: 'therapist' | 'patient' | 'admin';
  
  /** Avatar style */
  style?: 'avataaars' | 'lorelei';
  
  /** Show online indicator */
  isOnline?: boolean;
  
  /** Additional className */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
}

export function TheraAvatar({
  userId,
  size = 48,
  variant = 'patient',
  style = 'avataaars',
  isOnline = false,
  className = '',
  onClick,
}: TheraAvatarProps) {
  // Get colors for this variant
  const colors = getAvatarColors(variant);
  
  // Select style package
  const stylePackage = style === 'lorelei' ? lorelei : avataaars;
  
  // Generate avatar
  const avatar = React.useMemo(() => {
    return createAvatar(stylePackage, {
      seed: userId,
      size: size,
      backgroundColor: colors,
      // Additional customizations can be added here
    });
  }, [userId, size, colors, stylePackage]);
  
  // Convert to SVG string
  const svgString = avatar.toString();
  
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Avatar Image */}
      <div
        className="rounded-full overflow-hidden border-2 border-white shadow-sm"
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
      
      {/* Online Indicator */}
      {isOnline && (
        <motion.div
          className="absolute bottom-0 right-0 rounded-full border-2 border-white"
          style={{
            width: size * 0.25,
            height: size * 0.25,
            backgroundColor: '#34D399', // Mint green (success color)
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
}

/**
 * AVATAR GROUP
 * Display multiple avatars in a stack
 */
export interface TheraAvatarGroupProps {
  /** Array of user IDs */
  userIds: string[];
  
  /** Avatar size */
  size?: number;
  
  /** Avatar variant */
  variant?: 'therapist' | 'patient' | 'admin';
  
  /** Maximum avatars to show before "+X" */
  max?: number;
  
  /** Additional className */
  className?: string;
}

export function TheraAvatarGroup({
  userIds,
  size = 40,
  variant = 'patient',
  max = 5,
  className = '',
}: TheraAvatarGroupProps) {
  const visibleUsers = userIds.slice(0, max);
  const remainingCount = userIds.length - max;
  
  // Calculate overlap (each avatar overlaps by 25%)
  const overlap = size * 0.25;
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex" style={{ marginLeft: -overlap }}>
        {visibleUsers.map((userId, index) => (
          <div
            key={userId}
            style={{
              marginLeft: index === 0 ? 0 : -overlap,
              zIndex: visibleUsers.length - index,
            }}
          >
            <TheraAvatar
              userId={userId}
              size={size}
              variant={variant}
            />
          </div>
        ))}
      </div>
      
      {/* Show "+X" indicator if there are more */}
      {remainingCount > 0 && (
        <motion.div
          className="flex items-center justify-center rounded-full border-2 border-white shadow-sm text-sm font-semibold"
          style={{
            width: size,
            height: size,
            backgroundColor: '#E5E7EB',
            color: '#6B7280',
            marginLeft: -overlap,
            zIndex: 0,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: visibleUsers.length * 0.05 }}
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  );
}

/**
 * AVATAR WITH TEXT
 * Avatar with name and optional subtitle
 */
export interface TheraAvatarWithTextProps {
  userId: string;
  name: string;
  subtitle?: string;
  size?: number;
  variant?: 'therapist' | 'patient' | 'admin';
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

export function TheraAvatarWithText({
  userId,
  name,
  subtitle,
  size = 48,
  variant = 'patient',
  isOnline = false,
  className = '',
  onClick,
}: TheraAvatarWithTextProps) {
  return (
    <div
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <TheraAvatar
        userId={userId}
        size={size}
        variant={variant}
        isOnline={isOnline}
      />
      
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">
          {name}
        </div>
        {subtitle && (
          <div className="text-xs text-slate-500 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export default TheraAvatar;
