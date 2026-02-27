/**
 * Vibe Working — Conversation analyzer (client-side)
 * Analyzes pasted conversation text and returns recommendations.
 */

export interface ConversationRecommendation {
  type: 'positive' | 'suggestion' | 'tip';
  title: string;
  text: string;
}

function countMatches(text: string, patterns: RegExp[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const re of patterns) {
    const matches = lower.match(re);
    if (matches) count += matches.length;
  }
  return count;
}

export function analyzeConversation(conversationText: string): ConversationRecommendation[] {
  const recommendations: ConversationRecommendation[] = [];
  const text = conversationText.trim();
  if (!text) {
    return [{ type: 'tip', title: 'No content', text: 'Paste or type a conversation to get recommendations.' }];
  }

  const lines = text.split(/\n+/).filter((l) => l.trim().length > 0);
  const questionPatterns = [/\?/g, /how (do you|did you|are you)/gi, /what (do you|did you)/gi, /why\s/gi, /could you/gi, /would you/gi];
  const thanksPatterns = [/thank you|thanks|appreciate it|grateful/gi];
  const positivePatterns = [/great|awesome|nice|good point|that makes sense|i like that/gi];
  const fullText = lines.join(' ');

  const questionCount = countMatches(fullText, questionPatterns);
  const thanksCount = countMatches(fullText, thanksPatterns);
  const positiveCount = countMatches(fullText, positivePatterns);

  if (questionCount >= 2) {
    recommendations.push({
      type: 'positive',
      title: 'Good use of questions',
      text: `You asked at least ${questionCount} questions — that helps keep the other person engaged and shows you're listening.`,
    });
  } else if (questionCount === 1) {
    recommendations.push({
      type: 'suggestion',
      title: 'Add more questions',
      text: 'Try asking one or two follow-up questions next time. It shows interest and keeps the conversation going.',
    });
  } else {
    recommendations.push({
      type: 'suggestion',
      title: 'Ask a question',
      text: "Asking a question (e.g. 'What do you think?' or 'How did that go?') makes the other person feel heard and deepens the exchange.",
    });
  }

  if (thanksCount > 0) {
    recommendations.push({
      type: 'positive',
      title: 'Gratitude shown',
      text: "You expressed thanks or appreciation — that builds trust and leaves a positive impression.",
    });
  } else {
    recommendations.push({
      type: 'suggestion',
      title: 'Consider saying thanks',
      text: "When appropriate, a simple 'thanks' or 'I appreciate that' reinforces the relationship.",
    });
  }

  if (positiveCount >= 2) {
    recommendations.push({
      type: 'positive',
      title: 'Positive tone',
      text: 'Your replies included positive language — that helps keep the vibe constructive.',
    });
  }

  if (lines.length >= 4) {
    recommendations.push({
      type: 'positive',
      title: 'Back-and-forth',
      text: 'There was real back-and-forth in the conversation. Keep that balance so both people contribute.',
    });
  } else if (lines.length >= 2) {
    recommendations.push({
      type: 'tip',
      title: 'Keep it going',
      text: 'Try to extend the exchange with a follow-up question or a short share so it feels like a dialogue, not just one message each.',
    });
  }

  recommendations.push({
    type: 'tip',
    title: 'Next time',
    text: 'Remember: smile (or warm tone), say hi, ask a question, and leave on a high note. You\'re building the relationship.',
  });

  return recommendations;
}

/** Format recommendations as a single string for storage or display */
export function formatRecommendationsAsText(recommendations: ConversationRecommendation[]): string {
  return recommendations
    .map((r) => `**${r.title}**\n${r.text}`)
    .join('\n\n');
}
