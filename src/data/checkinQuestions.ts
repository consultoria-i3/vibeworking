/**
 * Vibe Working — 38 Check-in Questions + Coaching Advice
 * Used client-side for rotation logic; DB seed in 003_seed_checkin_questions.sql
 */

export interface CheckinQuestionData {
  id: string;
  sortOrder: number;
  question: string;
  emoji: string;
  category: string;
  advice: string;
}

export const CHECKIN_QUESTIONS: CheckinQuestionData[] = [
  { id: 'q1', sortOrder: 1, emoji: '😊', category: 'Warmth', question: 'Did you give someone a real smile today? Not the fake one lol', advice: 'Tomorrow, try smiling at one person before they smile at you. Sounds small but it changes the whole vibe.' },
  { id: 'q2', sortOrder: 2, emoji: '👋', category: 'Warmth', question: 'Did you actually say hi to people today?', advice: 'Hold a door, grab someone a coffee, pass a pen — tiny favors build trust without even trying.' },
  { id: 'q3', sortOrder: 3, emoji: '🙏', category: 'Warmth', question: 'Did you tell someone thanks and actually mean it? Express that gratitude!', advice: 'Just a simple \'hey, how\'s it going?\' goes further than you think. Don\'t overthink it.' },
  { id: 'q4', sortOrder: 4, emoji: '🫂', category: 'Warmth', question: 'Did you say hello to everyone? Like actually everyone?', advice: 'Ask people what shows they watch, where they eat, what music they\'re into. You\'ll find overlap fast.' },
  { id: 'q5', sortOrder: 5, emoji: '🏠', category: 'Warmth', question: 'Did you treat people like family today? Hospitality and empathy go a long way', advice: 'Use people\'s names, remember small details, bring up past convos. Makes people feel seen.' },
  { id: 'q6', sortOrder: 6, emoji: '🤝', category: 'Reciprocity', question: 'Did you do a little favor for someone just because?', advice: 'When things get tense, try a joke, change the subject, or just acknowledge it — \'well that was awkward lol.\'' },
  { id: 'q7', sortOrder: 7, emoji: '🙌', category: 'Reciprocity', question: 'Did you casually help someone out without making it a big thing?', advice: 'Next time you want someone to do something, make it sound exciting. Energy is contagious.' },
  { id: 'q8', sortOrder: 8, emoji: '📋', category: 'Reciprocity', question: 'Did you ask someone for a tiny favor? That\'s reciprocity — it actually works!', advice: 'Share a story, give a compliment, celebrate a small win with someone. Emotions connect people.' },
  { id: 'q9', sortOrder: 9, emoji: '🔍', category: 'Connection', question: 'Did you find something in common with someone? That\'s seeking familiarity!', advice: 'Bring a random snack, share a weird fact, tell an unexpected story. People remember the surprise.' },
  { id: 'q10', sortOrder: 10, emoji: '🌱', category: 'Connection', question: 'Did you make someone feel like they belong? That\'s encouraging familiarity', advice: 'Record yourself talking sometime — you might be surprised. Try matching the energy of who you\'re talking to.' },
  { id: 'q11', sortOrder: 11, emoji: '🪞', category: 'Connection', question: 'Did you find out you and someone have random stuff in common? Incidental similarities!', advice: 'See someone struggling? Jump in for 30 seconds. That\'s all it takes to be the person people remember.' },
  { id: 'q12', sortOrder: 12, emoji: '🕊️', category: 'Emotional', question: 'Things got awkward — did you help defuse the tension?', advice: 'Listen for little things — same hometown, same phone, same coffee order. Point it out when you find it!' },
  { id: 'q13', sortOrder: 13, emoji: '💫', category: 'Emotional', question: 'Did you make someone feel something good today? That\'s landing them into emotion', advice: 'Practice looking at someone\'s eyes long enough to notice their color. That\'s the right amount of contact.' },
  { id: 'q14', sortOrder: 14, emoji: '⚡', category: 'Influence', question: 'Did you hype someone up to actually go do something? Land them into action!', advice: 'Text someone right now and say thanks for something specific. Watch what happens.' },
  { id: 'q15', sortOrder: 15, emoji: '↗️', category: 'Influence', question: 'Did you flip a convo in a new direction? That\'s inflection — change the trajectory!', advice: 'Start your next convo with something positive. Compliment their work, their idea, anything real.' },
  { id: 'q16', sortOrder: 16, emoji: '🎁', category: 'Surprise', question: 'Did you surprise someone with something unexpected in a convo?', advice: 'Before you walk away from a convo, say something memorable or kind. Leave them smiling.' },
  { id: 'q17', sortOrder: 17, emoji: '🎭', category: 'Surprise', question: 'Did you break the script? Do something nobody expected?', advice: 'When someone tells you something, don\'t switch topics. Ask \'wait, tell me more about that.\'' },
  { id: 'q18', sortOrder: 18, emoji: '🎪', category: 'Surprise', question: 'Did you go off-script and just let a convo happen naturally?', advice: 'Do one thing tomorrow that feels a little bold or outside your comfort zone. That\'s the exercise.' },
  { id: 'q19', sortOrder: 19, emoji: '🗣️', category: 'Communication', question: 'How was your tone of voice today? Chill? Warm? Cold?', advice: 'When you don\'t understand, just say \'what do you mean by that?\' People respect it.' },
  { id: 'q20', sortOrder: 20, emoji: '🖼️', category: 'Communication', question: 'Did you try a framing statement? Say something, explain why, then back it up', advice: 'Challenge yourself: say hi to every single person you see tomorrow. Even the quiet ones.' },
  { id: 'q21', sortOrder: 21, emoji: '🔗', category: 'Listening', question: 'Did you keep asking questions based on what they just said? Chain those questions!', advice: 'Next convo, try holding eye contact just a beat longer than usual. It builds real connection.' },
  { id: 'q22', sortOrder: 22, emoji: '❓', category: 'Listening', question: 'When you didn\'t get it, did you ask clarifying questions?', advice: 'Talk out loud about something near you, then pull someone in: \'have you tried this?\' Works every time.' },
  { id: 'q23', sortOrder: 23, emoji: '🔄', category: 'Listening', question: 'When someone said something, did you ask a follow-up about it?', advice: 'Put a sticker on your laptop, wear something that starts convos. Let your stuff do the talking.' },
  { id: 'q24', sortOrder: 24, emoji: '👁️', category: 'Presence', question: 'Real talk — did you actually make eye contact with people?', advice: 'Share where you\'re from, what you did this weekend, a hobby. Small personal details = big trust.' },
  { id: 'q25', sortOrder: 25, emoji: '👀', category: 'Presence', question: 'Did you look someone in the eyes and really connect? That\'s oxytocin!', advice: 'Ask someone to hold your drink, watch your stuff, grab you a napkin. Small asks build bonds.' },
  { id: 'q26', sortOrder: 26, emoji: '🧱', category: 'Presence', question: 'Did you walk in like you\'ve been there forever? Don\'t look new!', advice: 'Tomorrow, respond to \'how are you?\' with something unexpected. See what happens.' },
  { id: 'q27', sortOrder: 27, emoji: '🦁', category: 'Presence', question: 'Did you take up space and own it? Don\'t play small!', advice: 'When someone finishes talking, ask about the last thing they said. Shows you were actually listening.' },
  { id: 'q28', sortOrder: 28, emoji: '💬', category: 'Initiative', question: 'Did you talk to yourself out loud, pull someone in, and drop something positive? Try it!', advice: 'Stop planning what to say next. Just listen and respond naturally. Convos flow better that way.' },
  { id: 'q29', sortOrder: 29, emoji: '🏷️', category: 'Environment', question: 'Got any stickers, logos, or cool stuff on display? Ornamentation sparks convos!', advice: 'Try this: make a statement, explain why you think that, then ask what they think. Structured but natural.' },
  { id: 'q30', sortOrder: 30, emoji: '📖', category: 'Vulnerability', question: 'Did you share something personal? Even a small detail builds trust', advice: 'Drop a \'honestly, I...\' into your next convo. Being casually real is magnetic.' },
  { id: 'q31', sortOrder: 31, emoji: '🤫', category: 'Vulnerability', question: 'Did you casually drop something personal into a convo? Opens doors!', advice: 'Admit you don\'t know something. Say \'I messed up.\' People trust vulnerable people way more.' },
  { id: 'q32', sortOrder: 32, emoji: '💜', category: 'Vulnerability', question: 'Did you let your guard down a bit? Showing vulnerability is powerful', advice: 'Next time you know the answer, ask someone else what they think first. Let them shine.' },
  { id: 'q33', sortOrder: 33, emoji: '🤷', category: 'Humility', question: 'Did you chill on the know-it-all vibes? Nobody likes that person', advice: 'Treat the next stranger you meet like a friend of a friend. Warm, open, welcoming.' },
  { id: 'q34', sortOrder: 34, emoji: '🤲', category: 'Humility', question: 'Did you stay open to other ideas? Don\'t be the person who\'s always right', advice: 'Walk in with purpose. Know where you\'re going. Confidence makes you look like you belong.' },
  { id: 'q35', sortOrder: 35, emoji: '🚪', category: 'Belonging', question: 'Did you blend in like you belong? Don\'t be the outsider!', advice: 'Use \'we\' and \'us\' instead of \'I\' and \'them.\' Language shapes how people see you.' },
  { id: 'q36', sortOrder: 36, emoji: '✨', category: 'Energy', question: 'Did you put good energy out there? Give positivity to get positivity back', advice: 'Speak a little louder, take up a little more space. You earned your spot — own it.' },
  { id: 'q37', sortOrder: 37, emoji: '🎵', category: 'Impression', question: 'Did you leave a convo on a high note? That last impression matters', advice: 'Try saying \'that\'s a good point\' more often. Being open makes people want to talk to you.' },
  { id: 'q38', sortOrder: 38, emoji: '🍸', category: 'Practice', question: 'Did you try the espresso martini exercise? Mix something bold into your day!', advice: 'When a convo is going nowhere, ask a totally different question. Shift the energy.' },
];

const SLIDER_LABELS = ['Extremely Failed', 'Failed', 'Okay', 'Well', 'Extremely Well'] as const;
const SLIDER_COLORS = ['#E8634A', '#E8A94A', '#E8E84A', '#7BE84A', '#4A90D9'] as const;

/** Seeded shuffle: pick 5 questions for current 12-hour window */
export function getQuestionsForRotation(): CheckinQuestionData[] {
  const msPer12h = 12 * 60 * 60 * 1000;
  const seed = Math.floor(Date.now() / msPer12h);
  const shuffled = [...CHECKIN_QUESTIONS].sort((a, b) => {
    const ha = hash(seed + a.sortOrder);
    const hb = hash(seed + b.sortOrder);
    return ha - hb;
  });
  return shuffled.slice(0, 5);
}

function hash(n: number): number {
  return (n * 2654435761) % 2147483647;
}

export function getSliderLabel(value: number): string {
  return SLIDER_LABELS[Math.max(0, Math.min(value - 1, 4))] ?? 'Okay';
}

export function getSliderColor(value: number): string {
  return SLIDER_COLORS[Math.max(0, Math.min(value - 1, 4))] ?? '#E8E84A';
}
