import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useT } from '../../src/i18n';
import { colors, fonts } from '../../src/theme';

type ReminderVia = 'sms' | 'whatsapp' | null;

export default function ProfileScreen() {
  const { profile, user, signOut, updateProfile } = useAuth();
  const t = useT();
  const [reminderVia, setReminderVia] = useState<ReminderVia>(profile?.reminder_via ?? null);
  const [reminderPhone, setReminderPhone] = useState(profile?.reminder_phone ?? '');
  const [savingReminder, setSavingReminder] = useState(false);
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    setReminderVia(profile?.reminder_via ?? null);
    setReminderPhone(profile?.reminder_phone ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile?.reminder_via, profile?.reminder_phone, profile?.phone]);

  const handleSignOut = () => {
    Alert.alert(t.auth.signOut, t.profile.signOutConfirm, [
      { text: t.profile.cancel, style: 'cancel' },
      { text: t.auth.signOut, style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={styles.headerHomeLink}>
          <Text style={styles.headerHomeLinkText}>{t.nav.home}</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {((profile?.display_name ?? user?.email ?? '?') || '?').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>
          {profile?.display_name || t.profile.noNameSet}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>
            {profile?.subscription_tier === 'pro' ? t.profile.pro : t.profile.free}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.streak_count ?? 0}</Text>
          <Text style={styles.statLabel}>{t.profile.dayStreak}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profile?.onboarding_completed ? '✅' : '⬜'}
          </Text>
          <Text style={styles.statLabel}>{t.profile.onboarded}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.profile.account}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.profile.jobTitle}</Text>
          <Text style={styles.infoValue}>
            {profile?.job_title || t.profile.notSet}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.profile.industry}</Text>
          <Text style={styles.infoValue}>
            {profile?.industry || t.profile.notSet}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.profile.type}</Text>
          <Text style={styles.infoValue}>
            {profile?.graduation_type
              ? profile.graduation_type === 'college'
                ? t.profile.collegeGrad
                : t.profile.highSchoolGrad
              : t.profile.notSet}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.profile.phone}</Text>
          <Text style={styles.infoValue}>{profile?.phone || t.profile.notSet}</Text>
        </View>
        <Text style={styles.phoneEditLabel}>{t.profile.updatePhone}</Text>
        <TextInput
          style={styles.phoneEditInput}
          placeholder={t.profile.phonePlaceholder}
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={styles.phoneSaveButton}
          onPress={() => { setSavingPhone(true); updateProfile({ phone: phone.trim() || null }).finally(() => setSavingPhone(false)); }}
          disabled={savingPhone}
        >
          <Text style={styles.phoneSaveButtonText}>{savingPhone ? t.profile.savingPhone : t.profile.savePhone}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.profile.reminderDelivery}</Text>
        <Text style={styles.reminderConsent}>
          {t.profile.reminderConsent}
        </Text>
        <View style={styles.reminderOptions}>
          <TouchableOpacity
            style={[styles.reminderOption, reminderVia === null && styles.reminderOptionActive]}
            onPress={() => { setReminderVia(null); setSavingReminder(true); updateProfile({ reminder_via: null, reminder_phone: null }).finally(() => setSavingReminder(false)); }}
          >
            <Text style={[styles.reminderOptionText, reminderVia === null && styles.reminderOptionTextActive]}>{t.profile.inAppOnly}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reminderOption, reminderVia === 'sms' && styles.reminderOptionActive]}
            onPress={() => setReminderVia('sms')}
          >
            <Text style={[styles.reminderOptionText, reminderVia === 'sms' && styles.reminderOptionTextActive]}>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reminderOption, reminderVia === 'whatsapp' && styles.reminderOptionActive]}
            onPress={() => setReminderVia('whatsapp')}
          >
            <Text style={[styles.reminderOptionText, reminderVia === 'whatsapp' && styles.reminderOptionTextActive]}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
        {(reminderVia === 'sms' || reminderVia === 'whatsapp') && (
          <>
            <Text style={styles.reminderPhoneLabel}>{t.profile.phoneNumber}</Text>
            <TextInput
              style={styles.reminderPhoneInput}
              placeholder={t.profile.phonePlaceholder}
              placeholderTextColor={colors.textMuted}
              value={reminderPhone}
              onChangeText={setReminderPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.reminderSaveButton}
              onPress={() => { setSavingReminder(true); updateProfile({ reminder_via: reminderVia, reminder_phone: reminderPhone.trim() || null }).finally(() => setSavingReminder(false)); }}
              disabled={savingReminder}
            >
              <Text style={styles.reminderSaveButtonText}>{savingReminder ? t.profile.savingReminder : t.profile.saveAllowReminders}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>{t.auth.signOut}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerContent: {
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerHomeLink: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerHomeLinkText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text,
  },
  name: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tierBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  tierText: {
    color: colors.logoYellow,
    fontSize: 13,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.cardBorder,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  phoneEditLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  phoneEditInput: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  phoneSaveButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  phoneSaveButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  signOutText: {
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '500',
  },
  reminderConsent: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  reminderOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reminderOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  reminderOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '18',
  },
  reminderOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  reminderOptionTextActive: {
    color: colors.primary,
  },
  reminderPhoneLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  reminderPhoneInput: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  reminderSaveButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  reminderSaveButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
});
