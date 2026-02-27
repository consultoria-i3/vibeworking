/**
 * Contact categories for Circle of Contacts and contacts calculator.
 * Capacities based on Dunbar-style social layers (Family → Work Colleagues).
 */

export type ContactCategorySlug =
  | 'family'
  | 'extended_family'
  | 'friends'
  | 'extended_friends'
  | 'work_colleagues';

export interface ContactCategory {
  slug: ContactCategorySlug;
  title: string;
  label: string;
  emoji: string;
  sortOrder: number;
  ring: number;
  capacity: number;
  color: string;
  bg: string;
  description: string;
}

export const CONTACT_CATEGORIES: ContactCategory[] = [
  {
    slug: 'family',
    title: 'Family',
    label: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    sortOrder: 1,
    ring: 1,
    capacity: 5,
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.12)',
    description: "Your innermost circle — those you'd call at 3am",
  },
  {
    slug: 'extended_family',
    title: 'Extended Family',
    label: 'Extended Family',
    emoji: '🏠',
    sortOrder: 2,
    ring: 2,
    capacity: 15,
    color: '#FF9F43',
    bg: 'rgba(255,159,67,0.12)',
    description: 'Close relatives and trusted household connections',
  },
  {
    slug: 'friends',
    title: 'Friends',
    label: 'Friends',
    emoji: '👋',
    sortOrder: 3,
    ring: 3,
    capacity: 50,
    color: '#F7DC6F',
    bg: 'rgba(247,220,111,0.12)',
    description: 'Real friends you invest time in regularly',
  },
  {
    slug: 'extended_friends',
    title: 'Extended Friends',
    label: 'Extended Friends',
    emoji: '🌐',
    sortOrder: 4,
    ring: 4,
    capacity: 150,
    color: '#48C9B0',
    bg: 'rgba(72,201,176,0.12)',
    description: 'Acquaintances and wider social network',
  },
  {
    slug: 'work_colleagues',
    title: 'Work Colleagues',
    label: 'Work Colleagues',
    emoji: '💼',
    sortOrder: 5,
    ring: 5,
    capacity: 500,
    color: '#7FB3D3',
    bg: 'rgba(127,179,211,0.12)',
    description: 'Professional contacts and collaborators',
  },
];

export const CONTACT_CATEGORY_SLUGS: ContactCategorySlug[] = CONTACT_CATEGORIES.map(
  (c) => c.slug
);

/** Colors per contact category (for UI cards and chart). */
export const CONTACT_CATEGORY_COLORS: Record<ContactCategorySlug, string> = {
  family: '#FF6B6B',
  extended_family: '#FF9F43',
  friends: '#F7DC6F',
  extended_friends: '#48C9B0',
  work_colleagues: '#7FB3D3',
};
