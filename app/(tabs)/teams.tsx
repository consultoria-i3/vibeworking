import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTeams } from '../../src/hooks/useTeams';
import { Logo } from '../../src/components/Logo';
import { colors, fonts } from '../../src/theme';
import {
  analyzeConversation,
  formatRecommendationsAsText,
  type ConversationRecommendation,
} from '../../src/lib/conversationAnalyzer';
import { saveConversationAnalysis } from '../../src/services/teams';

const paddingHorizontal = 12;

export default function TeamsScreen() {
  const { user, profile } = useAuth();
  const { teams, loading, error, createTeam, joinTeam, refresh } = useTeams(user?.id);

  const [createName, setCreateName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  const [conversationText, setConversationText] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | ''>('');
  const [otherMemberName, setOtherMemberName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<ConversationRecommendation[] | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleCreateTeam = async () => {
    const name = createName.trim();
    if (!name) return;
    setCreateLoading(true);
    try {
      const team = await createTeam(name);
      setCreateName('');
      Alert.alert('Team created', `Invite others with code: ${team.invite_code}`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not create team');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    const code = inviteCode.trim();
    if (!code) return;
    setJoinError('');
    setJoinLoading(true);
    try {
      await joinTeam(code);
      setInviteCode('');
      Alert.alert('Joined', 'You joined the team.');
    } catch (e) {
      setJoinError(e instanceof Error ? e.message : 'Could not join');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleAnalyze = () => {
    const recs = analyzeConversation(conversationText);
    setRecommendations(recs);
    setAnalyzing(false);
  };

  const handleSaveAnalysis = async () => {
    if (!recommendations?.length) return;
    setSaveLoading(true);
    try {
      await saveConversationAnalysis({
        teamId: selectedTeamId || undefined,
        otherMemberName: otherMemberName.trim() || undefined,
        conversationText: conversationText.trim(),
        recommendationText: formatRecommendationsAsText(recommendations),
      });
      Alert.alert('Saved', 'Analysis saved to your history.');
      setConversationText('');
      setOtherMemberName('');
      setRecommendations(null);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaveLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.topLogo} accessibilityLabel="Go to home">
            <Logo size={32} />
          </TouchableOpacity>
        </Link>
        <View style={styles.centered}>
          <Text style={styles.signInPrompt}>Sign in to use Teams and analyze conversations.</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={styles.topLogo} accessibilityLabel="Go to home">
          <Logo size={32} />
        </TouchableOpacity>
      </Link>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* My Teams */}
        <Text style={styles.sectionTitle}>My Teams</Text>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 16 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : teams.length === 0 ? (
          <Text style={styles.mutedText}>No teams yet. Create one or join with a code.</Text>
        ) : (
          <View style={styles.teamList}>
            {teams.map((t) => (
              <View key={t.id} style={styles.teamCard}>
                <Text style={styles.teamName}>{t.name}</Text>
                <Text style={styles.inviteCode}>Code: {t.invite_code}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Create team */}
        <Text style={styles.sectionTitle}>Create a team</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Team name"
            placeholderTextColor={colors.textMuted}
            value={createName}
            onChangeText={setCreateName}
          />
          <TouchableOpacity
            style={[styles.primaryButton, styles.smallButton]}
            onPress={handleCreateTeam}
            disabled={createLoading || !createName.trim()}
          >
            {createLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Join team */}
        <Text style={styles.sectionTitle}>Join with code</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Invite code (e.g. ABC123)"
            placeholderTextColor={colors.textMuted}
            value={inviteCode}
            onChangeText={(v) => { setInviteCode(v); setJoinError(''); }}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.primaryButton, styles.smallButton]}
            onPress={handleJoinTeam}
            disabled={joinLoading || !inviteCode.trim()}
          >
            {joinLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Join</Text>
            )}
          </TouchableOpacity>
        </View>
        {joinError ? <Text style={styles.errorText}>{joinError}</Text> : null}

        {/* Analyze conversation */}
        <Text style={styles.sectionTitle}>Analyze a conversation</Text>
        <Text style={styles.mutedText}>
          Paste a conversation with a team member (or anyone). We'll suggest how to improve your communication.
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Paste the conversation here..."
          placeholderTextColor={colors.textMuted}
          value={conversationText}
          onChangeText={setConversationText}
          multiline
          numberOfLines={6}
        />
        {teams.length > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Team (optional)</Text>
            <View style={styles.pickerRow}>
              {teams.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.chip,
                    selectedTeamId === t.id && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedTeamId(selectedTeamId === t.id ? '' : t.id)}
                >
                  <Text style={[styles.chipText, selectedTeamId === t.id && styles.chipTextSelected]}>
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Other person's name (optional)"
          placeholderTextColor={colors.textMuted}
          value={otherMemberName}
          onChangeText={setOtherMemberName}
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => { setAnalyzing(true); handleAnalyze(); }}
          disabled={analyzing}
        >
          {analyzing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Get recommendations</Text>
          )}
        </TouchableOpacity>

        {recommendations && recommendations.length > 0 && (
          <View style={styles.recommendations}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {recommendations.map((r, i) => (
              <View key={i} style={[styles.recCard, r.type === 'positive' && styles.recPositive, r.type === 'suggestion' && styles.recSuggestion]}>
                <Text style={styles.recTitle}>{r.title}</Text>
                <Text style={styles.recText}>{r.text}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSaveAnalysis}
              disabled={saveLoading}
            >
              {saveLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.secondaryButtonText}>Save this analysis</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topLogo: {
    paddingHorizontal,
    paddingTop: 56,
    paddingBottom: 8,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal, paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  signInPrompt: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  mutedText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.error,
    marginBottom: 8,
  },
  teamList: { marginBottom: 8 },
  teamCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  teamName: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  inviteCode: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    minHeight: 44,
  },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginBottom: 4 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  chipTextSelected: { color: '#fff' },
  primaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  smallButton: { marginTop: 0, marginBottom: 0, paddingVertical: 10, paddingHorizontal: 16 },
  primaryButtonText: { fontFamily: fonts.regular, fontSize: 15, fontWeight: '500', color: '#4b5563' },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: { fontFamily: fonts.regular, fontSize: 15, fontWeight: '500', color: '#4b5563' },
  recommendations: { marginTop: 16, marginBottom: 24 },
  recCard: {
    backgroundColor: colors.backgroundElevated,
    borderLeftWidth: 4,
    borderLeftColor: colors.textMuted,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  recPositive: { borderLeftColor: colors.success },
  recSuggestion: { borderLeftColor: colors.accent },
  recTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, marginBottom: 4 },
  recText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
});
