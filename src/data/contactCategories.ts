/**
 * Contact categories for Circle of Contacts and contacts calculator.
 * Capacities based on Dunbar-style social layers (Family → Work Colleagues).
 */
import { getT } from '../i18n';

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

/** Static structural data (no translatable strings) */
const CATEGORY_DATA: Omit<ContactCategory, 'title' | 'label' | 'description'>[] = [
  { slug: 'family', emoji: '👨‍👩‍👧‍👦', sortOrder: 1, ring: 1, capacity: 5, color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)' },
  { slug: 'extended_family', emoji: '🏠', sortOrder: 2, ring: 2, capacity: 15, color: '#FF9F43', bg: 'rgba(255,159,67,0.12)' },
  { slug: 'friends', emoji: '👋', sortOrder: 3, ring: 3, capacity: 50, color: '#F7DC6F', bg: 'rgba(247,220,111,0.12)' },
  { slug: 'extended_friends', emoji: '🌐', sortOrder: 4, ring: 4, capacity: 150, color: '#48C9B0', bg: 'rgba(72,201,176,0.12)' },
  { slug: 'work_colleagues', emoji: '💼', sortOrder: 5, ring: 5, capacity: 500, color: '#7FB3D3', bg: 'rgba(127,179,211,0.12)' },
];

/** Map slug → i18n label key and description key */
const SLUG_TO_I18N: Record<ContactCategorySlug, { labelKey: keyof ReturnType<typeof getT>['contacts']; descKey: keyof ReturnType<typeof getT>['contacts'] }> = {
  family: { labelKey: 'catFamily', descKey: 'catFamilyDesc' },
  extended_family: { labelKey: 'catExtendedFamily', descKey: 'catExtendedFamilyDesc' },
  friends: { labelKey: 'catFriends', descKey: 'catFriendsDesc' },
  extended_friends: { labelKey: 'catExtendedFriends', descKey: 'catExtendedFriendsDesc' },
  work_colleagues: { labelKey: 'catWorkColleagues', descKey: 'catWorkColleaguesDesc' },
};

/** Returns locale-aware contact categories */
export function getContactCategories(): ContactCategory[] {
  const t = getT();
  return CATEGORY_DATA.map((cat) => {
    const keys = SLUG_TO_I18N[cat.slug];
    const label = t.contacts[keys.labelKey] as string;
    const description = t.contacts[keys.descKey] as string;
    return { ...cat, title: label, label, description };
  });
}

/**
 * Default export for backward compatibility.
 * Uses getT() at call time so locale is resolved correctly.
 */
export const CONTACT_CATEGORIES: ContactCategory[] = getContactCategories();

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
