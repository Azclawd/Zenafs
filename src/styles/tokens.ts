/**
 * ZENAFS DESIGN TOKENS
 * Based on TheraDash design system
 * 
 * DO NOT use shadcn defaults - these are our bespoke tokens
 */

export const tokens = {
  /**
   * COLOR PALETTE (TheraDash Healthcare)
   */
  colors: {
    // Primary
    primary: {
      DEFAULT: '#06B6D4',      // Teal (main accent)
      light: '#22C55E',        // Mint green
      dark: '#0891B2',         // Darker teal
    },
    
    // Secondary
    secondary: {
      coral: '#F87171',        // Warm coral
      salmon: '#FB923C',       // Salmon orange
      yellow: '#FBBF24',       // Soft yellow
      purple: '#818CF8',       // Lavender
      lavender: '#A78BFA',     // Light purple
      blue: '#60A5FA',         // Sky blue
    },
    
    // Status
    status: {
      success: '#34D399',      // Mint green
      warning: '#FBBF24',      // Yellow
      error: '#F87171',        // Coral red
      info: '#60A5FA',         // Blue
    },
    
    // Background
    background: {
      gradient: {
        from: '#FDF2F8',       // Soft pink
        to: '#E0F2FE',         // Light blue
      },
      page: '#F8FAFC',         // Off-white
      card: '#FFFFFF',         // Pure white
    },
    
    // Text
    text: {
      primary: '#1F2937',      // Dark gray (almost black)
      secondary: '#6B7280',    // Medium gray
      muted: '#64748B',        // Slate gray
      light: '#9CA3AF',        // Light gray
    },
    
    // Borders
    border: {
      DEFAULT: '#E5E7EB',      // Light gray
      light: 'rgba(229, 231, 235, 0.6)',
      hover: '#D1D5DB',
    },
    
    // Avatar backgrounds (for DiceBear)
    avatar: {
      therapist: ['06B6D4', '34D399', 'A78BFA'], // Teal, mint, lavender
      patient: ['F87171', 'FB923C', 'FBBF24'],   // Coral, orange, yellow
      admin: ['818CF8', '60A5FA'],               // Purple, blue
    },
  },
  
  /**
   * SPACING SYSTEM
   */
  spacing: {
    // Card padding
    card: {
      DEFAULT: '24px',
      large: '32px',
      small: '20px',
    },
    
    // Section gaps
    section: '32px',
    
    // Component gaps
    component: '16px',
    componentLarge: '24px',
    componentSmall: '12px',
    
    // Grid gaps
    grid: '20px',
    gridTight: '16px',
  },
  
  /**
   * SHADOWS
   */
  shadows: {
    // Card shadows (multi-layer for depth)
    card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.02)',
    
    // Elevated elements
    elevated: '0 10px 40px rgba(0, 0, 0, 0.08)',
    
    // Hover states
    hover: '0 12px 24px rgba(0, 0, 0, 0.08)',
    
    // Subtle
    subtle: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  
  /**
   * BORDER RADIUS
   */
  radius: {
    card: '16px',
    cardLarge: '20px',
    button: '12px',
    input: '8px',
    badge: '8px',
    avatar: '9999px',     // Full circle
  },
  
  /**
   * TYPOGRAPHY
   */
  typography: {
    // Font families
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Georgia, serif', // If needed for logo
      mono: '"JetBrains Mono", monospace', // For metrics
    },
    
    // Font sizes
    fontSize: {
      logo: '18px',
      h1: '28px',
      h2: '20px',
      h3: '16px',
      body: '14px',
      small: '12px',
      tiny: '11px',
    },
    
    // Font weights
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Line heights
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  /**
   * ANIMATIONS
   */
  animations: {
    // Durations
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '600ms',
      reveal: '800ms',
    },
    
    // Easing
    easing: {
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
    
    // Stagger delays
    stagger: {
      cards: '50ms',
      items: '100ms',
    },
  },
  
  /**
   * BREAKPOINTS
   */
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  /**
   * Z-INDEX SCALE
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

/**
 * Helper function to get color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Convert hex to rgb
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Helper to get avatar colors for DiceBear
 */
export function getAvatarColors(type: 'therapist' | 'patient' | 'admin') {
  return tokens.colors.avatar[type];
}

export default tokens;
