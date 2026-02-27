/**
 * Vibe Working — Theme based on institutoi3.edu.co
 * Colors: institutional blue, white, orange accent; logo palette (purple, yellow, green)
 * Font: SF Compact / system UI
 */

import { Platform } from 'react-native';

export const colors = {
  // Institutoi3.edu.co — primary institutional palette
  primary: '#003B7C',
  primaryLight: '#004A99',
  primaryDark: '#002855',

  // CTA / accent — orange (institutoi3 + logo)
  accent: '#FF6B00',
  accentLight: '#FF8C33',
  accentDark: '#E85D04',

  // Backgrounds — light gray for all sections
  background: '#f9f9f9',
  backgroundElevated: '#f9f9f9',
  card: '#f9f9f9',
  cardBorder: '#E2E8F0',

  // Text — dark purple
  text: '#2D1B4E',
  textSecondary: '#4A3F6B',
  textMuted: '#6B5B7D',

  // Logo palette accents
  logoPurple: '#6B4C9A',
  logoYellow: '#FBBF24',
  logoGreen: '#22C55E',
  logoOrange: '#F97316',

  // UI
  error: '#EF4444',
  success: '#22C55E',
  border: '#334155',
};

export const fonts = {
  regular: Platform.OS === 'web' ? "-apple-system, BlinkMacSystemFont, 'SF Compact Text', 'Segoe UI', sans-serif" : 'System',
  medium: Platform.OS === 'web' ? "-apple-system, BlinkMacSystemFont, 'SF Compact Text', 'Segoe UI', sans-serif" : 'System',
  bold: Platform.OS === 'web' ? "-apple-system, BlinkMacSystemFont, 'SF Compact Text', 'Segoe UI', sans-serif" : 'System',
};
