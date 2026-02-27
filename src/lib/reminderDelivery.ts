/**
 * Vibe Working — Open SMS or WhatsApp with a reminder message
 * Asks for no device permissions; opens the system SMS/WhatsApp app with pre-filled text.
 */
import { Linking, Platform, Alert } from 'react-native';

export type ReminderVia = 'sms' | 'whatsapp' | null;

/** Format phone for URL: strip non-digits, ensure country code */
export function formatPhoneForUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && !phone.startsWith('+')) return `1${digits}`; // US default
  return digits.startsWith('1') ? digits : `1${digits}`;
}

/** Open SMS app with pre-filled message. Optional number opens new message to that number. */
export async function openSmsWithMessage(message: string, phone?: string | null): Promise<boolean> {
  try {
    const body = encodeURIComponent(message);
    const url = phone
      ? `sms:${formatPhoneForUrl(phone)}?body=${body}`
      : `sms:?body=${body}`;
    const can = await Linking.canOpenURL(url);
    if (can) {
      await Linking.openURL(url);
      return true;
    }
  } catch (_) {
    // fallback: try without number
    if (phone) {
      return openSmsWithMessage(message, null);
    }
  }
  return false;
}

/** Open WhatsApp with pre-filled message. Phone required for wa.me (full intl format, no +). */
export async function openWhatsAppWithMessage(message: string, phone: string): Promise<boolean> {
  try {
    const num = formatPhoneForUrl(phone); // e.g. 15551234567 for US
    const text = encodeURIComponent(message);
    const url = `https://wa.me/${num}?text=${text}`;
    const can = await Linking.canOpenURL(url);
    if (can) {
      await Linking.openURL(url);
      return true;
    }
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return true;
    }
  } catch (_) {}
  return false;
}

/** Open the appropriate app (SMS or WhatsApp) with the reminder message. */
export async function sendReminderToPhone(
  via: ReminderVia,
  phone: string | null | undefined,
  message: string,
): Promise<void> {
  if (!via || !phone?.trim()) {
    Alert.alert(
      'Set up delivery',
      'Go to Profile and allow reminders via SMS or WhatsApp, and add your phone number.',
    );
    return;
  }
  if (via === 'sms') {
    const ok = await openSmsWithMessage(message, phone.trim());
    if (!ok) Alert.alert('Could not open SMS', 'Your device may not support opening the Messages app.');
  } else {
    const ok = await openWhatsAppWithMessage(message, phone.trim());
    if (!ok) Alert.alert('Could not open WhatsApp', 'Make sure WhatsApp is installed or try SMS in Profile.');
  }
}
