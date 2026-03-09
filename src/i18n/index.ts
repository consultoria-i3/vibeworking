/**
 * Lightweight i18n — detects locale from hostname.
 * 1es10.com → Spanish, everything else → English.
 */
import { Platform } from 'react-native';
import { en, type Translations } from './en';
import { es } from './es';

export type Locale = 'en' | 'es';

let _locale: Locale | null = null;

/** Detect locale once based on hostname */
export function getLocale(): Locale {
  if (_locale) return _locale;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location?.hostname ?? '';
    const params = new URLSearchParams(window.location?.search ?? '');
    if (host.includes('1es10') || host.includes('relacion') || params.get('lang') === 'es') {
      _locale = 'es';
      return _locale;
    }
  }

  // Check env override (useful for dev/testing)
  // @ts-ignore
  const envLocale = process.env.EXPO_PUBLIC_LOCALE;
  if (envLocale === 'es') {
    _locale = 'es';
    return _locale;
  }

  _locale = 'en';
  return _locale;
}

const translations: Record<Locale, Translations> = { en, es };

/** Get the full translation object for the current locale */
export function getT(): Translations {
  return translations[getLocale()];
}

/** React hook — returns the translation object */
export function useT(): Translations {
  return getT();
}

/** Check if current locale is Spanish */
export function isSpanish(): boolean {
  return getLocale() === 'es';
}

export { en, es };
export type { Translations };
