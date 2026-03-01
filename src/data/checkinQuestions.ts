/**
 * Vibe Working — 205 Check-in Questions + Coaching Advice
 * Classified by relationship: boss | teammates | classmates
 * Used client-side for rotation logic; DB seed in 003_seed_checkin_questions.sql
 */
import { getLocale } from '../i18n';
import { getT } from '../i18n';
import { CHECKIN_QUESTIONS_ES } from './checkinQuestions_es';

export type RelationshipCategory = 'boss' | 'teammates' | 'classmates';

export interface CheckinQuestionData {
  id: string;
  sortOrder: number;
  question: string;
  example?: string;
  emoji: string;
  category: string;
  relationshipCategory: RelationshipCategory;
  advice: string;
}

/** Locale-aware relationship labels */
export function getRelationshipLabels(): Record<RelationshipCategory, string> {
  const t = getT();
  return t.relationships;
}

/** @deprecated Use getRelationshipLabels() for locale-aware labels */
export const RELATIONSHIP_LABELS: Record<RelationshipCategory, string> = {
  boss: 'Boss',
  teammates: 'Your Teammates',
  classmates: 'Your Classmates',
};

/** Returns a localized copy of a CheckinQuestionData based on current locale */
export function getLocalizedQuestion(q: CheckinQuestionData): CheckinQuestionData {
  if (getLocale() !== 'es') return q;
  const es = CHECKIN_QUESTIONS_ES[q.id];
  if (!es) return q;
  return {
    ...q,
    question: es.question,
    example: es.example ?? q.example,
    advice: es.advice,
  };
}

/** Score below this shows the coach tip; tip auto-appears when slider moves below this. */
export const LOW_SCORE_THRESHOLD = 3.5;

export const CHECKIN_QUESTIONS: CheckinQuestionData[] = [
  { id: 'q1', sortOrder: 1, emoji: '😊', category: 'Warmth', relationshipCategory: 'boss', question: 'Give your boss a real smile today?', example: 'e.g. Smiling when you saw your boss in the standup or in the hallway.', advice: 'Next time: smile at your boss before they smile at you. Small thing. Big impact.' },
  { id: 'q2', sortOrder: 2, emoji: '👋', category: 'Warmth', relationshipCategory: 'teammates', question: 'Say hi to people today?', example: 'e.g. Waving at a colleague in the elevator or saying good morning in the break room.', advice: 'Hold a door. Pass a pen. Grab someone a coffee. Little stuff like that — that\'s how we build the team.' },
  { id: 'q3', sortOrder: 3, emoji: '🙏', category: 'Warmth', relationshipCategory: 'classmates', question: 'Thank someone and mean it?', example: 'e.g. Thanking a peer for holding the door or for a quick favor.', advice: 'A simple "hey, how\'s it going?" goes a long way. Don\'t overthink it.' },
  { id: 'q4', sortOrder: 4, emoji: '🫂', category: 'Warmth', relationshipCategory: 'teammates', question: 'Say hello to everyone?', example: 'e.g. Nodding or saying hi to each person when you joined the call or entered the room.', advice: 'Ask what they watch, what they eat, what they\'re into. Find something in common. You got this.' },
  { id: 'q5', sortOrder: 5, emoji: '🏠', category: 'Warmth', relationshipCategory: 'boss', question: 'Treat your boss like part of the team today?', example: 'e.g. Asking your boss how the launch went or inviting them into a casual conversation.', advice: 'Use their name. Remember one small detail. Bring it up next time. Makes your boss feel seen.' },
  { id: 'q6', sortOrder: 6, emoji: '🤝', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Do a little favor for someone just because?', example: 'e.g. Forwarding an article they might like or offering to grab lunch together.', advice: 'When things get tense, try a joke or change the subject. Or just say "that was awkward" and move on.' },
  { id: 'q7', sortOrder: 7, emoji: '🙌', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Help someone out without making it a big deal?', example: 'e.g. Walking someone through a quick fix or sharing a tip and moving on.', advice: 'When you want someone to do something, make it sound fun. Energy is contagious.' },
  { id: 'q8', sortOrder: 8, emoji: '📋', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Ask your boss for a small favor?', example: 'e.g. Asking your boss to double-check a draft or to loop someone in.', advice: 'Share a story. Give your boss a real compliment. Celebrate a win with them. That\'s how we connect.' },
  { id: 'q9', sortOrder: 9, emoji: '🔍', category: 'Connection', relationshipCategory: 'classmates', question: 'Find something in common with someone?', example: 'e.g. Realizing you both run, game, or follow the same podcast.', advice: 'Bring a snack. Share a fun fact. Tell a short story. People remember the surprise.' },
  { id: 'q10', sortOrder: 10, emoji: '🌱', category: 'Connection', relationshipCategory: 'teammates', question: 'Make someone feel like they belong?', example: 'e.g. Saying "we" when talking about the project or asking their opinion in the meeting.', advice: 'Match their energy. If they\'re calm, be calm. If they\'re up, be up. Try it next time.' },
  { id: 'q11', sortOrder: 11, emoji: '🪞', category: 'Connection', relationshipCategory: 'classmates', question: 'Find something you and someone have in common?', example: 'e.g. Same music taste, same side project, or both into hiking.', advice: 'See someone stuck? Jump in for 30 seconds. That\'s all it takes to be the person they remember.' },
  { id: 'q12', sortOrder: 12, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'boss', question: 'Help ease the tension when things got awkward?', example: 'e.g. Making a light joke, taking a breath, or shifting to a neutral topic.', advice: 'Listen for little things — same town, same show, same coffee. Point it out when you find it.' },
  { id: 'q13', sortOrder: 13, emoji: '💫', category: 'Emotional', relationshipCategory: 'teammates', question: 'Make someone feel good today?', example: 'e.g. Pointing out a strong point they made or saying you appreciated their update.', advice: 'Look them in the eyes long enough to notice their eye color. That\'s the right amount. Try it.' },
  { id: 'q14', sortOrder: 14, emoji: '⚡', category: 'Influence', relationshipCategory: 'boss', question: 'Pump your boss up to do something?', example: 'e.g. Saying "you\'ve got this" before their pitch or backing their idea in the room.', advice: 'Text your boss. Say thanks for one specific thing. See what happens.' },
  { id: 'q15', sortOrder: 15, emoji: '↗️', category: 'Influence', relationshipCategory: 'teammates', question: 'Turn a conversation in a new direction?', example: 'e.g. Asking "what would make this easier?" or "what\'s the one thing to try first?"', advice: 'Start your next chat with something positive. Compliment their work or their idea. Keep it real.' },
  { id: 'q16', sortOrder: 16, emoji: '🎁', category: 'Surprise', relationshipCategory: 'classmates', question: 'Surprise someone with something unexpected?', example: 'e.g. Remembering a detail they shared last week or bringing a snack to share.', advice: 'Before you walk away, say something nice or memorable. Leave them smiling.' },
  { id: 'q17', sortOrder: 17, emoji: '🎭', category: 'Surprise', relationshipCategory: 'teammates', question: 'Do something nobody expected?', example: 'e.g. Volunteering first in a brainstorm or sharing a personal story when it fit.', advice: 'When someone tells you something, don\'t jump to a new topic. Ask: "Wait, tell me more about that."' },
  { id: 'q18', sortOrder: 18, emoji: '🎪', category: 'Surprise', relationshipCategory: 'classmates', question: 'Let a conversation happen naturally?', example: 'e.g. Following their thread instead of jumping to your own topic.', advice: 'Do one thing tomorrow that feels a little bold. Step outside your comfort zone. You can do it.' },
  { id: 'q19', sortOrder: 19, emoji: '🗣️', category: 'Communication', relationshipCategory: 'boss', question: 'Tone today: warm, chill, or off?', example: 'e.g. Patient in the 1:1 vs. clipped or rushed when under pressure.', advice: 'When you don\'t get it, just say "What do you mean by that?" People respect that.' },
  { id: 'q20', sortOrder: 20, emoji: '🖼️', category: 'Communication', relationshipCategory: 'teammates', question: 'Say something, explain why, then back it up?', example: 'e.g. Stating your view, giving one reason, then offering to follow up with details.', advice: 'Tomorrow: say hi to every person you see. Even the quiet ones. That\'s the drill.' },
  { id: 'q21', sortOrder: 21, emoji: '🔗', category: 'Listening', relationshipCategory: 'classmates', question: 'Ask follow-up questions based on what they said?', example: 'e.g. They brought up a trip — you asked where they went or how it was.', advice: 'Next time, hold eye contact just a beat longer than usual. It builds connection.' },
  { id: 'q22', sortOrder: 22, emoji: '❓', category: 'Listening', relationshipCategory: 'boss', question: 'Ask your boss when you didn\'t get it?', example: 'e.g. "Just to confirm — you mean…?" or "What would good look like for you?"', advice: 'Ask your boss to clarify. "Have you tried this?" or "What would you do?" Works every time.' },
  { id: 'q23', sortOrder: 23, emoji: '🔄', category: 'Listening', relationshipCategory: 'teammates', question: 'Ask a follow-up when someone said something?', example: 'e.g. They mentioned a meeting — you asked how it went or what came out of it.', advice: 'Put a sticker on your stuff. Wear something that starts conversations. Let your stuff do the talking.' },
  { id: 'q24', sortOrder: 24, emoji: '👁️', category: 'Presence', relationshipCategory: 'boss', question: 'Make eye contact with your boss?', example: 'e.g. Looking at your boss when they spoke instead of at your notes or laptop.', advice: 'Share where you\'re from. What you did this weekend. A hobby. Small details build trust.' },
  { id: 'q25', sortOrder: 25, emoji: '👀', category: 'Presence', relationshipCategory: 'teammates', question: 'Look someone in the eyes and really connect?', example: 'e.g. In a hallway chat or call, pausing to listen instead of multitasking.', advice: 'Ask someone to hold your drink, watch your stuff, or grab you something. Small asks build bonds.' },
  { id: 'q26', sortOrder: 26, emoji: '🧱', category: 'Presence', relationshipCategory: 'classmates', question: 'Walk in like you belong?', example: 'e.g. Sitting at the table, not against the wall; saying hi before waiting to be noticed.', advice: 'Next time someone says "how are you?", say something unexpected. See what happens.' },
  { id: 'q27', sortOrder: 27, emoji: '🦁', category: 'Presence', relationshipCategory: 'teammates', question: 'Take up space and own it?', example: 'e.g. Adding one clear point in the meeting or volunteering to own a next step.', advice: 'When someone finishes talking, ask about the last thing they said. Shows you were listening.' },
  { id: 'q28', sortOrder: 28, emoji: '💬', category: 'Initiative', relationshipCategory: 'classmates', question: 'Say something out loud and pull someone in positively?', example: 'e.g. "That\'s a solid idea" in the room or "What would you add?" to bring them in.', advice: 'Stop planning what to say next. Just listen and respond. Conversations flow better that way.' },
  { id: 'q29', sortOrder: 29, emoji: '🏷️', category: 'Environment', relationshipCategory: 'teammates', question: 'Stickers, logos, or cool stuff on display?', example: 'e.g. A book on your desk, a poster, or something that invites a "what\'s that?"', advice: 'Try this: say what you think, explain why, then ask what they think. Simple and natural.' },
  { id: 'q30', sortOrder: 30, emoji: '📖', category: 'Vulnerability', relationshipCategory: 'boss', question: 'Share something personal with your boss?', example: 'e.g. Mentioning a weekend plan, a book you\'re reading, or a goal you\'re working toward.', advice: 'Next time, try "Honestly, I..." and share one real thing with your boss. Being real builds trust.' },
  { id: 'q31', sortOrder: 31, emoji: '🤫', category: 'Vulnerability', relationshipCategory: 'teammates', question: 'Share something personal in a conversation?', example: 'e.g. "I struggled with that at first" or "I\'m still working on that too."', advice: 'Admit when you don\'t know. Say "I messed up" when you did. People trust that.' },
  { id: 'q32', sortOrder: 32, emoji: '💜', category: 'Vulnerability', relationshipCategory: 'classmates', question: 'Let your guard down a little?', example: 'e.g. Saying "I\'m not sure" or "I could use a second opinion" instead of pretending you had it all figured out.', advice: 'Next time you know the answer, ask someone else what they think first. Let them shine.' },
  { id: 'q33', sortOrder: 33, emoji: '🤷', category: 'Humility', relationshipCategory: 'boss', question: 'Ease up on know-it-all stuff with your boss?', example: 'e.g. Saying "I hadn\'t thought of it that way" or asking their view before giving yours.', advice: 'Treat your boss like a collaborator. Warm. Open. You got this.' },
  { id: 'q34', sortOrder: 34, emoji: '🤲', category: 'Humility', relationshipCategory: 'teammates', question: 'Stay open to other ideas?', example: 'e.g. Pausing before disagreeing or saying "that could work" and building on it.', advice: 'Walk in with purpose. Know where you\'re going. Confidence makes you look like you belong.' },
  { id: 'q35', sortOrder: 35, emoji: '🚪', category: 'Belonging', relationshipCategory: 'classmates', question: 'Show up like you belong?', example: 'e.g. Saying "our team" or "our project" and contributing without being called on.', advice: 'Use "we" and "us" instead of "I" and "them." That\'s how we talk as a team.' },
  { id: 'q36', sortOrder: 36, emoji: '✨', category: 'Energy', relationshipCategory: 'teammates', question: 'Bring good energy?', example: 'e.g. Leaning in, nodding, or adding one constructive comment instead of staying silent or negative.', advice: 'Speak a little louder. Take up a little more space. You earned your spot — own it.' },
  { id: 'q37', sortOrder: 37, emoji: '🎵', category: 'Impression', relationshipCategory: 'boss', question: 'Leave the conversation with your boss on a high note?', example: 'e.g. Closing with "thanks, I\'ll follow up" or "looking forward to next steps" instead of a gripe.', advice: 'Say "that\'s a good point" more often. Being open makes your boss want to keep the dialogue going.' },
  { id: 'q38', sortOrder: 38, emoji: '🍸', category: 'Practice', relationshipCategory: 'classmates', question: 'Try something bold today?', example: 'e.g. Asking a question in a big meeting, raising a concern, or offering to lead something.', advice: 'When a conversation is going nowhere, ask a totally different question. Change the energy.' },
  // Your Boss — additional questions (39–77)
  { id: 'q39', sortOrder: 39, emoji: '👋', category: 'Warmth', relationshipCategory: 'boss', question: 'Greet your boss in a natural, confident way?', example: 'e.g. A warm "hey" or "good morning" when you saw them, without overdoing it.', advice: 'Keep it simple. A genuine smile and eye contact go a long way.' },
  { id: 'q40', sortOrder: 40, emoji: '😌', category: 'Warmth', relationshipCategory: 'boss', question: 'Help create an easy, comfortable tone with your boss?', example: 'e.g. Asking how their week is going or commenting on something neutral before the agenda.', advice: 'Match their energy. If they\'re calm, don\'t rush. If they\'re upbeat, meet them there.' },
  { id: 'q41', sortOrder: 41, emoji: '💡', category: 'Connection', relationshipCategory: 'boss', question: 'Learn something new about how your boss thinks or works?', example: 'e.g. Picking up on what they repeat, what they question, or what they get excited about.', advice: 'Listen for what they repeat or get excited about. That tells you what matters.' },
  { id: 'q42', sortOrder: 42, emoji: '📛', category: 'Warmth', relationshipCategory: 'boss', question: 'Use your boss\'s name naturally in conversation?', example: 'e.g. Using their name when you hand off a summary or ask for their input.', advice: 'Use it once or twice when it fits. Not every sentence — just when it feels natural.' },
  { id: 'q43', sortOrder: 43, emoji: '🙏', category: 'Warmth', relationshipCategory: 'boss', question: 'Thank your boss for their time, guidance, or feedback?', example: 'e.g. Saying thanks before you leave or in a quick follow-up message.', advice: 'Be specific when you can: "Thanks for the feedback on X."' },
  { id: 'q44', sortOrder: 44, emoji: '✅', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Acknowledge to your boss how their input helped you improve?', example: 'e.g. "The feedback you gave on X made a difference — here\'s how I used it."', advice: 'People like to see their impact. One concrete example is enough.' },
  { id: 'q45', sortOrder: 45, emoji: '🤝', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Offer support or take initiative that helped your boss?', example: 'e.g. Prepping a doc they needed or saying "I can own that" for a follow-up.', advice: 'One small thing that saves them time or stress counts.' },
  { id: 'q46', sortOrder: 46, emoji: '❓', category: 'Listening', relationshipCategory: 'boss', question: 'Ask your boss for clarification with curiosity?', example: 'e.g. "When you say X, do you mean…?" or "What\'s the priority here?"', advice: 'Asking once clearly is better than guessing wrong.' },
  { id: 'q47', sortOrder: 47, emoji: '👂', category: 'Listening', relationshipCategory: 'boss', question: 'Show genuine interest in your boss\'s perspective?', example: 'e.g. "How would you approach this?" or "What\'s your read on the timeline?"', advice: 'One real question that shows you care about their view.' },
  { id: 'q48', sortOrder: 48, emoji: '🎯', category: 'Influence', relationshipCategory: 'boss', question: 'Look for alignment between your priorities and your boss\'s?', example: 'e.g. Framing your update around their goals or the metrics they care about.', advice: 'Reference something they said. "Since you mentioned X, I focused on…"' },
  { id: 'q49', sortOrder: 49, emoji: '🤝', category: 'Connection', relationshipCategory: 'boss', question: 'Treat your boss like a collaborator?', example: 'e.g. Saying "we could try" or "one option is" instead of "you need to."', advice: 'Use "we" and "us." It signals you\'re on the same team.' },
  { id: 'q50', sortOrder: 50, emoji: '🔄', category: 'Listening', relationshipCategory: 'boss', question: 'Use your boss\'s last point to ask a thoughtful follow-up?', example: 'e.g. They mentioned a deadline — you asked what would need to happen first.', advice: 'Pick the last thing they said and go one level deeper.' },
  { id: 'q51', sortOrder: 51, emoji: '💬', category: 'Vulnerability', relationshipCategory: 'boss', question: 'Share something appropriate and personal to build connection with your boss?', example: 'e.g. A quick mention of a weekend plan or a skill you\'re trying to improve.', advice: 'One small real detail. Keep it appropriate and brief.' },
  { id: 'q52', sortOrder: 52, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'boss', question: 'Help reset the tone when a moment felt tense with your boss?', example: 'e.g. Taking a breath, asking a clarifying question, or suggesting a short break.', advice: 'Stay calm. One steady sentence can change the temperature.' },
  { id: 'q53', sortOrder: 53, emoji: '⏳', category: 'Humility', relationshipCategory: 'boss', question: 'Stay patient when your communication style differed from your boss\'s?', example: 'e.g. Letting them finish their thought or waiting a beat before jumping in.', advice: 'Match their pace. Let them finish. Then respond.' },
  { id: 'q54', sortOrder: 54, emoji: '🎚️', category: 'Communication', relationshipCategory: 'boss', question: 'Adjust your tone to match the situation with your boss?', example: 'e.g. More direct in a crisis, more exploratory in a brainstorm.', advice: 'Read the room. One meeting at a time.' },
  { id: 'q55', sortOrder: 55, emoji: '🧘', category: 'Presence', relationshipCategory: 'boss', question: 'Remain calm, steady, and professional with your boss?', example: 'e.g. Responding with "I hear you" or "I\'ll work on that" instead of arguing back.', advice: 'Breathe before you answer. Steady wins.' },
  { id: 'q56', sortOrder: 56, emoji: '🔗', category: 'Listening', relationshipCategory: 'boss', question: 'Follow up with your boss on something they mentioned earlier?', example: 'e.g. "You asked about X — here\'s the update" or "That thing you mentioned, I looked into it."', advice: 'It shows you listen. One callback is enough.' },
  { id: 'q57', sortOrder: 57, emoji: '✨', category: 'Humility', relationshipCategory: 'boss', question: 'Build on your boss\'s ideas instead of competing?', example: 'e.g. "Adding to that…" or "We could also…" instead of "Actually, I think we should…"', advice: 'Add, don\'t replace. "Yes, and…" goes far.' },
  { id: 'q58', sortOrder: 58, emoji: '❓', category: 'Listening', relationshipCategory: 'boss', question: 'Ask your boss smart, constructive follow-up questions?', example: 'e.g. "What\'s the biggest risk here?" or "Who else should be in the loop?"', advice: 'One clear question that moves the conversation forward.' },
  { id: 'q59', sortOrder: 59, emoji: '🤲', category: 'Humility', relationshipCategory: 'boss', question: 'Leave space for flexibility when you disagreed with your boss?', example: 'e.g. Sharing your take, then "I\'m happy to go with your call" or "What do you think?"', advice: 'Say your piece. Then let them decide. No repeat pushes.' },
  { id: 'q60', sortOrder: 60, emoji: '📐', category: 'Communication', relationshipCategory: 'boss', question: 'Explain your reasoning to your boss in a way that built alignment?', example: 'e.g. Leading with the outcome, then one clear reason or constraint.', advice: 'Short and clear. One reason often beats three.' },
  { id: 'q61', sortOrder: 61, emoji: '🙌', category: 'Warmth', relationshipCategory: 'boss', question: 'Give your boss credit for their direction, insight, or support?', example: 'e.g. "Your input on the approach made the difference" or naming them when sharing the win.', advice: 'Be specific. One real example beats a generic thanks.' },
  { id: 'q62', sortOrder: 62, emoji: '👁️', category: 'Presence', relationshipCategory: 'boss', question: 'Maintain good eye contact and presence with your boss?', example: 'e.g. Putting your phone away and facing them during the important parts.', advice: 'Put the device down for the hard parts. They\'ll notice.' },
  { id: 'q63', sortOrder: 63, emoji: '📌', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Demonstrate reliability to your boss in small ways?', example: 'e.g. Hitting the deadline you gave or sending the recap you promised.', advice: 'Do what you said. Every time. That\'s the baseline.' },
  { id: 'q64', sortOrder: 64, emoji: '✔️', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Follow through on what you told your boss you would do?', example: 'e.g. Doing the follow-up you said you\'d do or sending the summary by when you said.', advice: 'One follow-through builds trust. Miss it and they remember.' },
  { id: 'q65', sortOrder: 65, emoji: '🚫', category: 'Communication', relationshipCategory: 'boss', question: 'Avoid oversharing or venting prematurely with your boss?', example: 'e.g. Saving the long story for later and keeping the meeting focused.', advice: 'When in doubt, keep it professional. You can share more later.' },
  { id: 'q66', sortOrder: 66, emoji: '📋', category: 'Communication', relationshipCategory: 'boss', question: 'Leave conversations with your boss with clear next steps?', example: 'e.g. Repeating back who does what and by when before you hang up or leave.', advice: 'One sentence: who does what by when. Say it out loud.' },
  { id: 'q67', sortOrder: 67, emoji: '🛠️', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Make your boss\'s job easier, not harder?', example: 'e.g. Answering a question before they asked or sending a one-pager so they didn\'t have to dig.', advice: 'One less thing on their plate today. That counts.' },
  { id: 'q68', sortOrder: 68, emoji: '⚡', category: 'Energy', relationshipCategory: 'boss', question: 'Bring consistent, steady energy into interactions with your boss?', example: 'e.g. Not spiraling when something went wrong or over-celebrating when it went right.', advice: 'No drama. Steady and clear. They\'ll trust you more.' },
  { id: 'q69', sortOrder: 69, emoji: '🎵', category: 'Impression', relationshipCategory: 'boss', question: 'Close the conversation with your boss on a positive note?', example: 'e.g. Ending with a clear next step or a short thank-you instead of trailing off.', advice: 'End with the next step or a thank you. Leave them feeling clear.' },
  { id: 'q70', sortOrder: 70, emoji: '💜', category: 'Vulnerability', relationshipCategory: 'boss', question: 'Share something you genuinely value or care about with your boss?', example: 'e.g. A skill you\'re building or a part of the project you\'re especially invested in.', advice: 'One real thing. It builds connection without oversharing.' },
  { id: 'q71', sortOrder: 71, emoji: '👥', category: 'Presence', relationshipCategory: 'boss', question: 'Participate in team moments so your boss could see your engagement?', example: 'e.g. Adding one useful point in the all-hands or helping set up for a team event.', advice: 'Show up. One clear contribution. Quality over quantity.' },
  { id: 'q72', sortOrder: 72, emoji: '🎯', category: 'Presence', relationshipCategory: 'boss', question: 'Show commitment in front of your boss (prepared, focused, on time)?', example: 'e.g. Showing up with the doc ready or the numbers they asked for.', advice: 'Prep one thing ahead. It shows you care.' },
  { id: 'q73', sortOrder: 73, emoji: '🦁', category: 'Initiative', relationshipCategory: 'boss', question: 'Volunteer for visible or challenging work that matters to your boss?', example: 'e.g. Raising your hand for a deliverable they care about or a meeting they can\'t make.', advice: 'One clear yes. Make it something they care about.' },
  { id: 'q74', sortOrder: 74, emoji: '🌟', category: 'Warmth', relationshipCategory: 'boss', question: 'Give your boss sincere, appropriate compliments when deserved?', example: 'e.g. "That question you asked in the meeting really clarified things."', advice: 'Be specific and genuine. One is enough.' },
  { id: 'q75', sortOrder: 75, emoji: '⚖️', category: 'Emotional', relationshipCategory: 'boss', question: 'Stay neutral and composed in sensitive situations with your boss?', example: 'e.g. Not venting about the situation to others or reacting in the room; processing later if needed.', advice: 'Stay calm. Listen. Respond later if you need to.' },
  { id: 'q76', sortOrder: 76, emoji: '🌱', category: 'Humility', relationshipCategory: 'boss', question: 'Demonstrate a growth mindset to your boss, even on routine tasks?', example: 'e.g. Asking for feedback on one thing or mentioning something you\'re learning.', advice: 'One sign you\'re learning. They notice.' },
  { id: 'q77', sortOrder: 77, emoji: '🤝', category: 'Connection', relationshipCategory: 'boss', question: 'Make an effort to connect with your boss so you can work well together?', example: 'e.g. Finding common ground, asking about their priorities, or collaborating on a shared goal.', advice: 'One real connection. It shows you\'re on the same team.' },
  // Your Teammates — additional questions (78–116)
  { id: 'q78', sortOrder: 78, emoji: '👋', category: 'Warmth', relationshipCategory: 'teammates', question: 'Greet your teammates in a natural, confident way?', example: 'e.g. A quick wave or "hey" when you joined the call or walked by their desk.', advice: 'Keep it simple. A smile and their name when it fits.' },
  { id: 'q79', sortOrder: 79, emoji: '😌', category: 'Warmth', relationshipCategory: 'teammates', question: 'Help create an easy, comfortable tone with your teammates?', example: 'e.g. Opening with "how\'s your week?" or a light comment before the agenda.', advice: 'Match their energy. Ease in before the heavy stuff.' },
  { id: 'q80', sortOrder: 80, emoji: '💡', category: 'Connection', relationshipCategory: 'teammates', question: 'Learn something new about how your teammates think or work?', example: 'e.g. Picking up on how they prefer to get updates or what they get excited about.', advice: 'Listen for what they repeat or get excited about.' },
  { id: 'q81', sortOrder: 81, emoji: '📛', category: 'Warmth', relationshipCategory: 'teammates', question: 'Use your teammates\' names naturally in conversation?', example: 'e.g. Using their name when you tag them or when you hand off a task.', advice: 'Use names when it fits. Not every sentence — just natural.' },
  { id: 'q82', sortOrder: 82, emoji: '🙏', category: 'Warmth', relationshipCategory: 'teammates', question: 'Thank your teammates for their time, effort, or input?', example: 'e.g. A quick "thanks for doing that" in chat or at the end of a call.', advice: 'Be specific when you can: "Thanks for jumping in on X."' },
  { id: 'q83', sortOrder: 83, emoji: '✅', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Acknowledge to your teammates how their contribution helped?', example: 'e.g. "Your fix unblocked us" or "That summary saved me a lot of time."', advice: 'One concrete example. They\'ll remember it.' },
  { id: 'q84', sortOrder: 84, emoji: '🤝', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Offer support or take initiative to help teammates without being asked?', example: 'e.g. "I can cover that" or "Want me to run that by them?"', advice: 'One unprompted offer. Small things build trust.' },
  { id: 'q85', sortOrder: 85, emoji: '❓', category: 'Listening', relationshipCategory: 'teammates', question: 'Ask your teammates for clarification with curiosity and respect?', example: 'e.g. "When you say X, do you mean…?" or "Can you walk me through that part?"', advice: 'Ask once, clearly. No blame — just understanding.' },
  { id: 'q86', sortOrder: 86, emoji: '👂', category: 'Listening', relationshipCategory: 'teammates', question: 'Show genuine interest in your teammates\' perspectives?', example: 'e.g. "What\'s your take?" or "How would you handle this?"', advice: 'One real question that shows you value their view.' },
  { id: 'q87', sortOrder: 87, emoji: '🎯', category: 'Influence', relationshipCategory: 'teammates', question: 'Look for alignment and shared goals with your teammates?', example: 'e.g. "We\'re both trying to hit the same deadline — what if we…?"', advice: 'Find one shared goal. Build from there.' },
  { id: 'q88', sortOrder: 88, emoji: '🤝', category: 'Connection', relationshipCategory: 'teammates', question: 'Treat your teammates like true collaborators?', example: 'e.g. "We could try" or "What do you think if we…?" instead of "You need to."', advice: 'Use "we." It signals you\'re in it together.' },
  { id: 'q89', sortOrder: 89, emoji: '🔄', category: 'Listening', relationshipCategory: 'teammates', question: 'Use something a teammate said to ask a thoughtful follow-up?', example: 'e.g. They mentioned a deadline — you asked what would help them hit it.', advice: 'Pick one thing they said. Go one level deeper.' },
  { id: 'q90', sortOrder: 90, emoji: '💬', category: 'Vulnerability', relationshipCategory: 'teammates', question: 'Share something appropriate and personal to build connection with teammates?', example: 'e.g. A quick "I had a crazy weekend" or "I\'m trying to get better at X."', advice: 'One small real detail. Keeps it human.' },
  { id: 'q91', sortOrder: 91, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'teammates', question: 'Help reset the tone when a moment felt tense with your teammates?', example: 'e.g. Taking a breath, asking "what would help?" or shifting to the next topic.', advice: 'Stay calm. One steady sentence can change the vibe.' },
  { id: 'q92', sortOrder: 92, emoji: '⏳', category: 'Humility', relationshipCategory: 'teammates', question: 'Stay patient when communication styles differed from yours?', example: 'e.g. Letting them finish their thought or waiting for their message instead of pinging again.', advice: 'Match their pace. Let them finish. Then respond.' },
  { id: 'q93', sortOrder: 93, emoji: '🎚️', category: 'Communication', relationshipCategory: 'teammates', question: 'Adjust your tone to match the situation with your teammates?', example: 'e.g. Lighter in the group chat, more direct in the incident channel.', advice: 'Read the room. One situation at a time.' },
  { id: 'q94', sortOrder: 94, emoji: '🧘', category: 'Presence', relationshipCategory: 'teammates', question: 'Remain calm, steady, and professional with your teammates?', example: 'e.g. Responding with "got it" or "I\'ll look into it" instead of snapping back.', advice: 'Breathe before you answer. Steady wins.' },
  { id: 'q95', sortOrder: 95, emoji: '🔗', category: 'Listening', relationshipCategory: 'teammates', question: 'Follow up on something a teammate mentioned earlier?', example: 'e.g. "You were working on X — how did it turn out?" or "That thing you mentioned, any update?"', advice: 'It shows you listen. One callback is enough.' },
  { id: 'q96', sortOrder: 96, emoji: '✨', category: 'Humility', relationshipCategory: 'teammates', question: 'Build on your teammates\' ideas instead of competing?', example: 'e.g. "Adding to that…" or "We could also…" instead of "Actually, I think we should do the opposite."', advice: 'Add, don\'t replace. "Yes, and…" goes far.' },
  { id: 'q97', sortOrder: 97, emoji: '❓', category: 'Listening', relationshipCategory: 'teammates', question: 'Ask your teammates constructive follow-up questions?', example: 'e.g. "What do you need from me?" or "What\'s the next step?"', advice: 'One clear question that moves things forward.' },
  { id: 'q98', sortOrder: 98, emoji: '🤲', category: 'Humility', relationshipCategory: 'teammates', question: 'Leave room for flexibility when you disagreed with a teammate?', example: 'e.g. Sharing your view, then "I\'m fine either way" or "What do you prefer?"', advice: 'Say your piece. Then make space. No repeat pushes.' },
  { id: 'q99', sortOrder: 99, emoji: '📐', category: 'Communication', relationshipCategory: 'teammates', question: 'Explain your reasoning in a way that built understanding with teammates?', example: 'e.g. Giving one clear reason or constraint when you made a call.', advice: 'Short and clear. One reason often beats three.' },
  { id: 'q100', sortOrder: 100, emoji: '🙌', category: 'Warmth', relationshipCategory: 'teammates', question: 'Give your teammates credit where it was due?', example: 'e.g. Tagging them in the doc or naming them when you shared the win with the group.', advice: 'Be specific. One real shout-out counts.' },
  { id: 'q101', sortOrder: 101, emoji: '👁️', category: 'Presence', relationshipCategory: 'teammates', question: 'Maintain good eye contact and presence with your teammates?', example: 'e.g. Camera on and focused when they were speaking, or not typing while they shared.', advice: 'Put the device down for the important parts.' },
  { id: 'q102', sortOrder: 102, emoji: '📌', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Demonstrate reliability to your teammates in small ways?', example: 'e.g. Sending the link you promised or being on the call when you said you would.', advice: 'Do what you said. Every time.' },
  { id: 'q103', sortOrder: 103, emoji: '✔️', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Follow through on what you told your teammates you would do?', example: 'e.g. Doing the review you said you\'d do or sending the summary by EOD.', advice: 'One follow-through builds trust.' },
  { id: 'q104', sortOrder: 104, emoji: '🚫', category: 'Communication', relationshipCategory: 'teammates', question: 'Avoid oversharing or venting prematurely with your teammates?', example: 'e.g. Saving the long story for a 1:1 instead of the group channel.', advice: 'When in doubt, keep it professional.' },
  { id: 'q105', sortOrder: 105, emoji: '📋', category: 'Communication', relationshipCategory: 'teammates', question: 'Leave conversations with your teammates with clear next steps?', example: 'e.g. Summarizing who does what and when before you leave the call.', advice: 'One sentence: who does what by when.' },
  { id: 'q106', sortOrder: 106, emoji: '🛠️', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Make it easier — not harder — for teammates to work with you?', example: 'e.g. Giving a heads-up before a change or documenting the handoff.', advice: 'One less friction point. They\'ll notice.' },
  { id: 'q107', sortOrder: 107, emoji: '⚡', category: 'Energy', relationshipCategory: 'teammates', question: 'Bring consistent, steady energy into interactions with your teammates?', example: 'e.g. Not dumping stress on them or over-celebrating and derailing the thread.', advice: 'No drama. Steady and clear.' },
  { id: 'q108', sortOrder: 108, emoji: '🎵', category: 'Impression', relationshipCategory: 'teammates', question: 'Close conversations with your teammates on a positive note?', example: 'e.g. Ending with "thanks" or "catch you next sync" instead of just leaving.', advice: 'End with the next step or a thank you.' },
  { id: 'q109', sortOrder: 109, emoji: '💜', category: 'Vulnerability', relationshipCategory: 'teammates', question: 'Share something you genuinely value or care about with your teammates?', example: 'e.g. A side project you care about or a part of the work you\'re excited about.', advice: 'One real thing. Builds connection.' },
  { id: 'q110', sortOrder: 110, emoji: '🎂', category: 'Presence', relationshipCategory: 'teammates', question: 'Participate in team moments (birthdays or small celebrations)?', example: 'e.g. Reacting in the celebration thread or showing up for the quick cake in the kitchen.', advice: 'Show up for the small stuff. It matters.' },
  { id: 'q111', sortOrder: 111, emoji: '🎯', category: 'Presence', relationshipCategory: 'teammates', question: 'Show commitment to your teammates (prepared, focused, on time)?', example: 'e.g. Having your section done for the doc or your update ready for standup.', advice: 'Prep one thing ahead. It shows you care.' },
  { id: 'q112', sortOrder: 112, emoji: '🦁', category: 'Initiative', relationshipCategory: 'teammates', question: 'Volunteer for visible or challenging work that supports the team?', example: 'e.g. Owning the recap, leading the retro, or taking the tricky follow-up.', advice: 'One clear yes. Make it count.' },
  { id: 'q113', sortOrder: 113, emoji: '🌟', category: 'Warmth', relationshipCategory: 'teammates', question: 'Give your teammates sincere, appropriate compliments when deserved?', example: 'e.g. "That slide deck was really clear" or "Good catch on that bug."', advice: 'Be specific and genuine.' },
  { id: 'q114', sortOrder: 114, emoji: '⚖️', category: 'Emotional', relationshipCategory: 'teammates', question: 'Stay neutral and composed in sensitive situations with your teammates?', example: 'e.g. Not adding fuel in the group chat or reacting before you had the full picture.', advice: 'Stay calm. Listen. Respond later if needed.' },
  { id: 'q115', sortOrder: 115, emoji: '🌱', category: 'Humility', relationshipCategory: 'teammates', question: 'Demonstrate a growth mindset, even on routine tasks that affect teammates?', example: 'e.g. Asking "how could we streamline this?" or sharing something you\'re learning.', advice: 'One sign you\'re learning. They notice.' },
  { id: 'q116', sortOrder: 116, emoji: '🤝', category: 'Connection', relationshipCategory: 'teammates', question: 'Make an effort to connect with teammates who are very different from you?', example: 'e.g. Pairing with someone from another discipline or time zone.', advice: 'One real connection. Diversity of thought wins.' },
  // Your Classmates — additional questions (117–155)
  { id: 'q117', sortOrder: 117, emoji: '👋', category: 'Warmth', relationshipCategory: 'classmates', question: 'Greet your classmates in a natural, confident way?', example: 'e.g. A smile or "hey" when you sat down or passed them in the hall.', advice: 'Keep it simple. A smile and their name when it fits.' },
  { id: 'q118', sortOrder: 118, emoji: '😌', category: 'Warmth', relationshipCategory: 'classmates', question: 'Help create a comfortable, open tone during study sessions or class?', example: 'e.g. Asking "what did everyone get for that one?" or sharing your answer first.', advice: 'Match the room. Ease people in before the hard stuff.' },
  { id: 'q119', sortOrder: 119, emoji: '💡', category: 'Connection', relationshipCategory: 'classmates', question: 'Learn something new about how your classmates think or study?', example: 'e.g. Picking up on their study hack or how they break down a problem.', advice: 'Listen for how they explain things. You\'ll learn from it.' },
  { id: 'q120', sortOrder: 120, emoji: '📛', category: 'Warmth', relationshipCategory: 'classmates', question: 'Use your classmates\' names naturally in conversation?', example: 'e.g. Using their name when you ask for their notes or when you form a group.', advice: 'Use names when it fits. Makes people feel seen.' },
  { id: 'q121', sortOrder: 121, emoji: '🙏', category: 'Warmth', relationshipCategory: 'classmates', question: 'Thank your classmates for their help, explanations, or shared notes?', example: 'e.g. "Thanks, that made sense" or "I really needed that — thanks."', advice: 'Be specific: "Thanks for explaining X — that clicked."' },
  { id: 'q122', sortOrder: 122, emoji: '✅', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Acknowledge how a classmate\'s explanation helped you understand better?', example: 'e.g. "Your example clicked for me" or "That way of putting it helped."', advice: 'One concrete example. They\'ll remember it.' },
  { id: 'q123', sortOrder: 123, emoji: '🤝', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Offer help with studying or assignments without being asked?', example: 'e.g. "Want to run through the practice problems?" or "I can send you the outline."', advice: 'One unprompted offer. Small things build the group.' },
  { id: 'q124', sortOrder: 124, emoji: '❓', category: 'Listening', relationshipCategory: 'classmates', question: 'Ask your classmates for clarification with curiosity and respect?', example: 'e.g. "Can you explain that part again?" or "So the main idea is…?"', advice: 'Ask once, clearly. No blame — just understanding.' },
  { id: 'q125', sortOrder: 125, emoji: '👂', category: 'Listening', relationshipCategory: 'classmates', question: 'Show genuine interest in your classmates\' ideas or interpretations?', example: 'e.g. "How did you read that passage?" or "What\'s your take on the prompt?"', advice: 'One real question that shows you value their view.' },
  { id: 'q126', sortOrder: 126, emoji: '🎯', category: 'Influence', relationshipCategory: 'classmates', question: 'Look for shared academic goals or common challenges with classmates?', example: 'e.g. "We\'re both aiming for the same deadline — want to sync?"', advice: 'Find one shared goal. Build from there.' },
  { id: 'q127', sortOrder: 127, emoji: '🤝', category: 'Connection', relationshipCategory: 'classmates', question: 'Treat your classmates like study partners rather than competitors?', example: 'e.g. "We could split the chapters" or "What if we quiz each other?"', advice: 'Use "we." You\'re in it together.' },
  { id: 'q128', sortOrder: 128, emoji: '🔄', category: 'Listening', relationshipCategory: 'classmates', question: 'Use something a classmate said to ask a thoughtful follow-up?', example: 'e.g. They mentioned a professor — you asked what their class was like.', advice: 'Pick one thing they said. Go one level deeper.' },
  { id: 'q129', sortOrder: 129, emoji: '💬', category: 'Vulnerability', relationshipCategory: 'classmates', question: 'Share something appropriate about your own learning struggles or progress?', example: 'e.g. "I was lost on that too" or "The way I remember it is…"', advice: 'One small real detail. Makes the space safer.' },
  { id: 'q130', sortOrder: 130, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'classmates', question: 'Help ease the tension when a moment felt awkward in class or study group?', example: 'e.g. Making a light joke, changing the subject, or saying "let\'s try the next one."', advice: 'Stay calm. One steady move can change the vibe.' },
  { id: 'q131', sortOrder: 131, emoji: '⏳', category: 'Humility', relationshipCategory: 'classmates', question: 'Stay patient when classmates learned at a different pace than you?', example: 'e.g. Re-explaining without sighing or giving them a minute to think.', advice: 'Match their pace. Let them get there.' },
  { id: 'q132', sortOrder: 132, emoji: '🎚️', category: 'Communication', relationshipCategory: 'classmates', question: 'Adjust your tone to be supportive and collaborative?', example: 'e.g. "That\'s one way — we could also…" instead of "No, that\'s wrong."', advice: 'Supportive tone. One moment at a time.' },
  { id: 'q133', sortOrder: 133, emoji: '🧘', category: 'Presence', relationshipCategory: 'classmates', question: 'Remain calm and respectful during academic disagreements?', example: 'e.g. "I had a different read" or "What if we looked at it this way?"', advice: 'State your view. Stay respectful. No put-downs.' },
  { id: 'q134', sortOrder: 134, emoji: '🔗', category: 'Listening', relationshipCategory: 'classmates', question: 'Follow up on something a classmate mentioned about an exam or assignment?', example: 'e.g. "How did the presentation go?" or "Did you get your grade back?"', advice: 'It shows you listen. One callback is enough.' },
  { id: 'q135', sortOrder: 135, emoji: '✨', category: 'Humility', relationshipCategory: 'classmates', question: 'Build on your classmates\' ideas instead of trying to outshine them?', example: 'e.g. "Adding to that…" or "Yeah, and we could also…"', advice: 'Add, don\'t replace. "Yes, and…" goes far.' },
  { id: 'q136', sortOrder: 136, emoji: '❓', category: 'Listening', relationshipCategory: 'classmates', question: 'Ask constructive follow-up questions that deepened understanding?', example: 'e.g. "What made you think that?" or "How does that fit with the reading?"', advice: 'One question that pushes the thinking further.' },
  { id: 'q137', sortOrder: 137, emoji: '🤲', category: 'Humility', relationshipCategory: 'classmates', question: 'Leave room for different interpretations when you disagreed?', example: 'e.g. "I had a different interpretation — what was yours?"', advice: 'Say your view. Then make space for theirs.' },
  { id: 'q138', sortOrder: 138, emoji: '📐', category: 'Communication', relationshipCategory: 'classmates', question: 'Explain your reasoning clearly to help others understand your thinking?', example: 'e.g. Walking through your steps or giving one clear reason for your answer.', advice: 'Short and clear. One reason often beats three.' },
  { id: 'q139', sortOrder: 139, emoji: '🙌', category: 'Warmth', relationshipCategory: 'classmates', question: 'Give your classmates credit for good ideas in group work?', example: 'e.g. "That was their idea" when presenting or naming them in the write-up.', advice: 'Be specific. One real shout-out counts.' },
  { id: 'q140', sortOrder: 140, emoji: '👁️', category: 'Presence', relationshipCategory: 'classmates', question: 'Stay present and engaged during conversations or study sessions?', example: 'e.g. Not scrolling during the discussion or actually listening when they explained.', advice: 'Be there. They\'ll feel it.' },
  { id: 'q141', sortOrder: 141, emoji: '📌', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Demonstrate reliability in group assignments?', example: 'e.g. Submitting your section by the deadline or showing up to the library when you said.', advice: 'Do what you said. Every time.' },
  { id: 'q142', sortOrder: 142, emoji: '✔️', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Do your part of the work on time?', example: 'e.g. Finishing your slides or your part of the lab report by the check-in.', advice: 'One on-time delivery builds trust.' },
  { id: 'q143', sortOrder: 143, emoji: '🚫', category: 'Communication', relationshipCategory: 'classmates', question: 'Avoid complaining or negative talk that could drain the group?', example: 'e.g. Saving the "this class is impossible" for later and staying focused in the group.', advice: 'When in doubt, keep it constructive.' },
  { id: 'q144', sortOrder: 144, emoji: '📋', category: 'Communication', relationshipCategory: 'classmates', question: 'Leave study sessions with clear next steps?', example: 'e.g. Saying who will do what and when you\'ll meet again before you pack up.', advice: 'One sentence: who does what by when.' },
  { id: 'q145', sortOrder: 145, emoji: '🛠️', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Make it easier — not harder — for classmates to collaborate with you?', example: 'e.g. Answering the group chat, sharing your part in the shared doc, not ghosting.', advice: 'One less friction point. They\'ll notice.' },
  { id: 'q146', sortOrder: 146, emoji: '⚡', category: 'Energy', relationshipCategory: 'classmates', question: 'Bring steady, positive energy into class or group work?', example: 'e.g. Not spiraling before the exam or bringing everyone down with "we\'re gonna fail."', advice: 'No drama. Steady and clear.' },
  { id: 'q147', sortOrder: 147, emoji: '🎵', category: 'Impression', relationshipCategory: 'classmates', question: 'End study sessions on a focused or encouraging note?', example: 'e.g. "We\'re in good shape" or "See you Thursday — we got this."', advice: 'End with the next step or a quick boost.' },
  { id: 'q148', sortOrder: 148, emoji: '💜', category: 'Vulnerability', relationshipCategory: 'classmates', question: 'Share something you genuinely find interesting about the subject?', example: 'e.g. "I thought that part was cool" or "I\'m still wondering about…"', advice: 'One real interest. It\'s contagious.' },
  { id: 'q149', sortOrder: 149, emoji: '🎓', category: 'Presence', relationshipCategory: 'classmates', question: 'Participate in class or group moments instead of staying silent?', example: 'e.g. Raising your hand once, answering a poll, or adding to the chat.', advice: 'One contribution. Quality over quantity.' },
  { id: 'q150', sortOrder: 150, emoji: '🎯', category: 'Presence', relationshipCategory: 'classmates', question: 'Show commitment by coming prepared to class or meetings?', example: 'e.g. Having the reading done or your section drafted before the group met.', advice: 'Prep one thing ahead. It shows you care.' },
  { id: 'q151', sortOrder: 151, emoji: '🦁', category: 'Initiative', relationshipCategory: 'classmates', question: 'Volunteer for challenging parts of group assignments?', example: 'e.g. "I\'ll do the intro" or "I can put the deck together."', advice: 'One clear yes. Make it count.' },
  { id: 'q152', sortOrder: 152, emoji: '🌟', category: 'Warmth', relationshipCategory: 'classmates', question: 'Give sincere compliments when a classmate explained something well?', example: 'e.g. "That helped" or "You explained that way better than the book."', advice: 'Be specific and genuine.' },
  { id: 'q153', sortOrder: 153, emoji: '⚖️', category: 'Emotional', relationshipCategory: 'classmates', question: 'Stay neutral and mature during academic conflicts?', example: 'e.g. Not talking behind their back or escalating in the group chat.', advice: 'Stay calm. Listen. Respond later if needed.' },
  { id: 'q154', sortOrder: 154, emoji: '🌱', category: 'Humility', relationshipCategory: 'classmates', question: 'Maintain a growth mindset, even when the material felt boring or difficult?', example: 'e.g. "We can figure this out" or "What if we try a different strategy?"', advice: 'One sign you\'re still learning. They notice.' },
  { id: 'q155', sortOrder: 155, emoji: '🤝', category: 'Connection', relationshipCategory: 'classmates', question: 'Make an effort to connect with classmates who are very different from you?', example: 'e.g. Forming a group with someone you don\'t usually sit with or from another year.', advice: 'One real connection. Different perspectives help.' },
  // Your Boss — additional questions (156–205)
  { id: 'q156', sortOrder: 156, emoji: '👁️', category: 'Connection', relationshipCategory: 'boss', question: 'Notice how your relationship with your boss shapes how the team sees you?', example: 'e.g. The way you reference them in meetings or how you react when they speak.', advice: 'Your vibe with your boss sets the tone. One small shift can change how the team sees you.' },
  { id: 'q157', sortOrder: 157, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'boss', question: 'Catch yourself assuming your boss was hostile when they were just direct?', example: 'e.g. Not taking a short email or a quick "we need to fix this" as an attack.', advice: 'Assume good intent first. Ask once: "Just so I’m clear, you mean…?"' },
  { id: 'q158', sortOrder: 158, emoji: '🧑', category: 'Warmth', relationshipCategory: 'boss', question: 'Treat your boss like a person, not just a title?', example: 'e.g. Noticing their mood, their weekend, or something they care about outside work.', advice: 'One human moment. See the person, not just the role.' },
  { id: 'q159', sortOrder: 159, emoji: '📋', category: 'Presence', relationshipCategory: 'boss', question: 'Identify key tasks for building trust before your last one-on-one?', example: 'e.g. Deciding to share one win, ask one real question, or close one loop.', advice: 'Prep one trust-building action per meeting. Small and clear.' },
  { id: 'q160', sortOrder: 160, emoji: '🤝', category: 'Connection', relationshipCategory: 'boss', question: 'Reflect on how including your boss\'s perspective strengthens your relationship?', example: 'e.g. Thinking about their pressures or priorities before you ask for something.', advice: 'Their perspective plus yours = alignment. Reflect once, then act.' },
  { id: 'q161', sortOrder: 161, emoji: '✨', category: 'Impression', relationshipCategory: 'boss', question: 'Pay attention to the first impression you give your boss each day or meeting?', example: 'e.g. Your energy when you walk in, your first sentence, or whether you’re present or distracted.', advice: 'First 10 seconds matter. One intentional greeting.' },
  { id: 'q162', sortOrder: 162, emoji: '🔗', category: 'Connection', relationshipCategory: 'boss', question: 'Think about how your boss\'s network could become your network?', example: 'e.g. Paying attention when they name people, teams, or partners they respect.', advice: 'One introduction or shared contact can open doors. Notice who they value.' },
  { id: 'q163', sortOrder: 163, emoji: '🎯', category: 'Presence', relationshipCategory: 'boss', question: 'Set a clear intention before a difficult conversation with your boss?', example: 'e.g. "I want to leave with alignment" or "I will listen first."', advice: 'One sentence of intention. It steadies you.' },
  { id: 'q164', sortOrder: 164, emoji: '🤝', category: 'Connection', relationshipCategory: 'boss', question: 'Show your boss you\'re an ally, not a competitor?', example: 'e.g. Backing their decision in the room or making their goal part of your update.', advice: 'One clear "I’m with you" moment. No competing, just contributing.' },
  { id: 'q165', sortOrder: 165, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'boss', question: 'Use a small, genuine gesture to ease tension after a disagreement with your boss?', example: 'e.g. A quick "wanted to make sure we’re aligned" or a follow-up that showed you heard them.', advice: 'One small gesture. Don’t let tension sit.' },
  { id: 'q166', sortOrder: 166, emoji: '💜', category: 'Warmth', relationshipCategory: 'boss', question: 'Notice how a simple act of loyalty can change your boss\'s trust in you?', example: 'e.g. Backing them in a meeting or not bad-mouthing when they’re not there.', advice: 'One act of loyalty. They notice.' },
  { id: 'q167', sortOrder: 167, emoji: '🙏', category: 'Warmth', relationshipCategory: 'boss', question: 'Find a natural way to show your boss you have good intentions?', example: 'e.g. Volunteering for an unglamorous task or giving a teammate credit in front of your boss.', advice: 'One genuine move. No performance — just real.' },
  { id: 'q168', sortOrder: 168, emoji: '🧘', category: 'Presence', relationshipCategory: 'boss', question: 'Pay attention to your body language during a tense meeting with your boss?', example: 'e.g. Uncrossing your arms, nodding when they speak, or leaning in slightly.', advice: 'Body language speaks. One adjustment: relax your shoulders.' },
  { id: 'q169', sortOrder: 169, emoji: '🎚️', category: 'Communication', relationshipCategory: 'boss', question: 'Keep your tone calm and steady when your boss challenged your work?', example: 'e.g. Answering in a level voice or saying "I hear you" before responding.', advice: 'Breathe. Pause. Then answer. One calm response.' },
  { id: 'q170', sortOrder: 170, emoji: '⏱️', category: 'Humility', relationshipCategory: 'boss', question: 'Respect your boss\'s space and time instead of constantly seeking their attention?', example: 'e.g. Sending one summary instead of five updates or waiting for office hours.', advice: 'One less interruption. Respect their boundaries.' },
  { id: 'q171', sortOrder: 171, emoji: '🛡️', category: 'Emotional', relationshipCategory: 'boss', question: 'Notice yourself sending defensive signals when receiving feedback from your boss?', example: 'e.g. Jumping to explain, folding your arms, or talking over them.', advice: 'Notice it. Then one non-defensive response: "Thanks, I’ll work on that."' },
  { id: 'q172', sortOrder: 172, emoji: '📢', category: 'Communication', relationshipCategory: 'boss', question: 'Catch yourself over-communicating in a way that overwhelmed your boss?', example: 'e.g. Slacking after every small step or sending a novel when a bullet list would do.', advice: 'One update instead of five. Less can be more.' },
  { id: 'q173', sortOrder: 173, emoji: '😌', category: 'Presence', relationshipCategory: 'boss', question: 'Stay composed and approachable even when your boss was stressed?', example: 'e.g. Keeping your voice even and your next step clear instead of matching their panic.', advice: 'Be the calm in the room. One steady presence.' },
  { id: 'q174', sortOrder: 174, emoji: '🤲', category: 'Humility', relationshipCategory: 'boss', question: 'Allow your boss to lead in their own style without silently judging?', example: 'e.g. Going with their process even when you’d do it differently, without the eyeroll.', advice: 'Their style is their style. One moment of acceptance.' },
  { id: 'q175', sortOrder: 175, emoji: '🚫', category: 'Warmth', relationshipCategory: 'boss', question: 'Resist the urge to criticize your boss\'s decisions behind their back?', example: 'e.g. Not piling on when people complain about management or changing the subject when the topic comes up.', advice: 'What you say behind their back gets back. One silence counts.' },
  { id: 'q176', sortOrder: 176, emoji: '🙏', category: 'Humility', relationshipCategory: 'boss', question: 'Show respect for your boss\'s approach even when it differs from yours?', example: 'e.g. "I see why you’re going that way" instead of "That won’t work."', advice: 'One moment of respect. You don’t have to agree to respect.' },
  { id: 'q177', sortOrder: 177, emoji: '🎛️', category: 'Humility', relationshipCategory: 'boss', question: 'Catch yourself managing up in a controlling rather than supportive way?', example: 'e.g. Demanding a specific outcome instead of "here are a few options."', advice: 'Support, don’t steer. One offer instead of one demand.' },
  { id: 'q178', sortOrder: 178, emoji: '🔗', category: 'Connection', relationshipCategory: 'boss', question: 'Look for a shared interest or goal that connects you with your boss beyond tasks?', example: 'e.g. Same sport, same podcast, or similar view on work-life.', advice: 'One thing in common. Build from there.' },
  { id: 'q179', sortOrder: 179, emoji: '📐', category: 'Communication', relationshipCategory: 'boss', question: 'Adjust your communication style to match how your boss prefers information?', example: 'e.g. Sending a 3-line summary instead of a long email, or vice versa.', advice: 'Match their style once. They’ll absorb it better.' },
  { id: 'q180', sortOrder: 180, emoji: '😊', category: 'Warmth', relationshipCategory: 'boss', question: 'Start a conversation with your boss with a genuine smile before business?', example: 'e.g. "Good to see you" or "How’s your week going?" before agenda.', advice: 'One human opening. Then get to work.' },
  { id: 'q181', sortOrder: 181, emoji: '✨', category: 'Surprise', relationshipCategory: 'boss', question: 'Break the routine and bring something fresh to a meeting or check-in?', example: 'e.g. One slide that reframes the problem or a question no one has asked yet.', advice: 'One fresh element. It stands out.' },
  { id: 'q182', sortOrder: 182, emoji: '🎁', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Do a small, unrequested favor for your boss before they noticed the need?', example: 'e.g. Updating a deck they\'ll need or catching an error before it went out.', advice: 'One invisible fix. They notice when they don’t have to ask.' },
  { id: 'q183', sortOrder: 183, emoji: '🪞', category: 'Connection', relationshipCategory: 'boss', question: 'Discover something you and your boss have in common outside of work?', example: 'e.g. Same hobby, same genre of books, or same kind of weekend.', advice: 'One shared thing. Makes the relationship real.' },
  { id: 'q184', sortOrder: 184, emoji: '🙌', category: 'Warmth', relationshipCategory: 'boss', question: 'Acknowledge something your boss did well — out loud, in a meeting or thread?', example: 'e.g. "That framing really helped" in the all-hands or in a group thread.', advice: 'One public credit. Be specific.' },
  { id: 'q185', sortOrder: 185, emoji: '📌', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Avoid doing anything unpredictable that could make your boss question your reliability?', example: 'e.g. No disappearing acts, no surprise pivots without a heads-up.', advice: 'Predictable = trustworthy. One steady move.' },
  { id: 'q186', sortOrder: 186, emoji: '💫', category: 'Presence', relationshipCategory: 'boss', question: 'Use your personal touch — humor, style — to stand out positively with your boss?', example: 'e.g. A well-timed joke, a different angle on the problem, or a memorable one-liner.', advice: 'One authentic touch. Don’t perform — be you.' },
  { id: 'q187', sortOrder: 187, emoji: '🔗', category: 'Listening', relationshipCategory: 'boss', question: 'Connect something from an earlier conversation with your boss to a current one?', example: 'e.g. "Last time you mentioned X — here’s how that landed."', advice: 'One callback. It proves you listen.' },
  { id: 'q188', sortOrder: 188, emoji: '⚡', category: 'Energy', relationshipCategory: 'boss', question: 'Bring positive energy into a tough day for your boss?', example: 'e.g. One steady, forward-looking line or a brief "we can figure this out."', advice: 'One positive move. Energy is contagious.' },
  { id: 'q189', sortOrder: 189, emoji: '💬', category: 'Vulnerability', relationshipCategory: 'boss', question: 'Share an unexpected insight or emotion that deepened your boss\'s trust in you?', example: 'e.g. "I was nervous about X" or "Here’s what I really think."', advice: 'One real moment. Vulnerability builds trust.' },
  { id: 'q190', sortOrder: 190, emoji: '🎁', category: 'Reciprocity', relationshipCategory: 'boss', question: 'Leave something of value with your boss without being asked?', example: 'e.g. One resource or solution they didn’t have to ask for.', advice: 'One gift of value. No strings attached.' },
  { id: 'q191', sortOrder: 191, emoji: '🙏', category: 'Warmth', relationshipCategory: 'boss', question: 'Express sincere gratitude to your boss for something that often goes unnoticed?', example: 'e.g. "I don’t say it enough — thanks for X."', advice: 'One specific thanks for the invisible stuff.' },
  { id: 'q192', sortOrder: 192, emoji: '🤷', category: 'Humility', relationshipCategory: 'boss', question: 'Catch yourself sounding like you know more than your boss and pull back?', example: 'e.g. Saying "what do you think?" instead of "here\'s what we should do."', advice: 'Notice it. One pull-back. Let them lead.' },
  { id: 'q193', sortOrder: 193, emoji: '🎵', category: 'Impression', relationshipCategory: 'boss', question: 'End your last interaction with your boss on a high note?', example: 'e.g. Closing with the one thing you\'ll do next or a short thank-you.', advice: 'Last words stick. One strong closer.' },
  { id: 'q194', sortOrder: 194, emoji: '🤝', category: 'Connection', relationshipCategory: 'boss', question: 'Think about what your boss needs before bringing up what you need?', example: 'e.g. Asking "what\'s most useful for you?" before your own ask.', advice: 'Their needs first, once. Then yours. They’ll notice.' },
  { id: 'q195', sortOrder: 195, emoji: '🪑', category: 'Presence', relationshipCategory: 'boss', question: 'Walk into a leadership meeting acting as if you belong at the table?', example: 'e.g. Sitting at the table, adding one point, or asking one question.', advice: 'You’re there for a reason. One confident move.' },
  { id: 'q196', sortOrder: 196, emoji: '👥', category: 'Presence', relationshipCategory: 'boss', question: 'Do something specific to avoid looking like an outsider alongside your boss?', example: 'e.g. Engaging with your boss, dressing or acting the part, or showing you belong.', advice: 'One move that says "I belong here."' },
  { id: 'q197', sortOrder: 197, emoji: '💪', category: 'Presence', relationshipCategory: 'boss', question: 'Project confidence in front of your boss without seeming arrogant or dismissive?', example: 'e.g. Stating your view clearly but leaving space for theirs.', advice: 'Confident + humble. One sentence that does both.' },
  { id: 'q198', sortOrder: 198, emoji: '📊', category: 'Influence', relationshipCategory: 'boss', question: 'Demonstrate your value to your boss without over-selling or bragging?', example: 'e.g. One concrete result or update, stated simply.', advice: 'Let the work speak. One fact, no spin.' },
  { id: 'q199', sortOrder: 199, emoji: '📤', category: 'Initiative', relationshipCategory: 'boss', question: 'Proactively share a win, resource, or insight with your boss this week?', example: 'e.g. One email or message with something useful.', advice: 'One proactive share. No waiting to be asked.' },
  { id: 'q200', sortOrder: 200, emoji: '✨', category: 'Influence', relationshipCategory: 'boss', question: 'Make it easy for your boss to see you as someone who contributes, not just executes?', example: 'e.g. Offering an idea or improvement, not only doing the task.', advice: 'One "here’s what I’m thinking" moment.' },
  { id: 'q201', sortOrder: 201, emoji: '🎯', category: 'Practice', relationshipCategory: 'boss', question: 'Apply any of these strategies in a real interaction with your boss this week?', example: 'e.g. One thing you tried from this list in a real conversation.', advice: 'One strategy, one conversation. Then reflect.' },
  { id: 'q202', sortOrder: 202, emoji: '🆕', category: 'Practice', relationshipCategory: 'boss', question: 'Try the Strangers Theory approach after a new role or new boss?', example: 'e.g. Treating the relationship like a fresh start — curious, open, no old baggage.', advice: 'New role = new start. One "stranger" move: ask one real question.' },
  { id: 'q203', sortOrder: 203, emoji: '📌', category: 'Practice', relationshipCategory: 'boss', question: 'Identify which connection strategy is hardest with your boss — and practice it?', example: 'e.g. One strategy you’re weak at and one attempt this week.', advice: 'Pick the hardest one. Practice it once.' },
  { id: 'q204', sortOrder: 204, emoji: '🗣️', category: 'Initiative', relationshipCategory: 'boss', question: 'Push yourself to speak up with your boss when your instinct was to stay quiet?', example: 'e.g. One comment, question, or idea you shared when you’d usually hold back.', advice: 'One time you spoke when silence was easier.' },
  { id: 'q205', sortOrder: 205, emoji: '📋', category: 'Practice', relationshipCategory: 'boss', question: 'Choose three strategies to focus on in your next meeting with your boss?', example: 'e.g. Three from this list + one sentence on why each matters for you.', advice: 'Three is enough. Know why. Then do them.' },
  // Your Teammates — additional questions (206–255)
  { id: 'q206', sortOrder: 206, emoji: '👁️', category: 'Connection', relationshipCategory: 'teammates', question: 'Notice how your relationships with teammates shape how you show up at work?', example: 'e.g. Whether you speak up in standup or how you respond in the group chat.', advice: 'Your vibe with the team sets your day. One small shift can change the whole dynamic.' },
  { id: 'q207', sortOrder: 207, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'teammates', question: 'Catch yourself assuming a teammate was hostile when they were just having a bad day?', example: 'e.g. Pausing before reacting to a sharp comment or short reply.', advice: 'Assume context first. One check-in: "Rough day? Want to talk or just focus?"' },
  { id: 'q208', sortOrder: 208, emoji: '🧑', category: 'Warmth', relationshipCategory: 'teammates', question: 'Treat a teammate like a real person, not just someone at their desk?', example: 'e.g. Asking how they are or acknowledging something personal.', advice: 'One human moment. See the person, not just the role.' },
  { id: 'q209', sortOrder: 209, emoji: '📋', category: 'Presence', relationshipCategory: 'teammates', question: 'Identify what you need to do to build trust before joining a new team project?', example: 'e.g. Deciding to send one early update or ask one clarifying question in the kickoff.', advice: 'One trust-building move before the first meeting. Small and clear.' },
  { id: 'q210', sortOrder: 210, emoji: '🤝', category: 'Connection', relationshipCategory: 'teammates', question: 'Reflect on how including every teammate\'s voice makes the team stronger?', example: 'e.g. Calling on someone who hasn\'t spoken or asking "anyone else?" before moving on.', advice: 'Every voice adds something. One moment of inclusion changes the room.' },
  { id: 'q211', sortOrder: 211, emoji: '✨', category: 'Impression', relationshipCategory: 'teammates', question: 'Pay attention to the first impression you give teammates each day?', example: 'e.g. Your first message in the channel or how you show up on camera.', advice: 'First 10 seconds matter. One intentional greeting.' },
  { id: 'q212', sortOrder: 212, emoji: '🔗', category: 'Connection', relationshipCategory: 'teammates', question: 'Think about how a teammate\'s connections could benefit you — and vice versa?', example: 'e.g. Who they know, what they’re good at, and what you could share back.', advice: 'One exchange of value. Give first, then ask.' },
  { id: 'q213', sortOrder: 213, emoji: '🎯', category: 'Presence', relationshipCategory: 'teammates', question: 'Set a clear intention to be collaborative before your last team meeting?', example: 'e.g. "I want to listen more" or "I want to support at least one idea that isn’t mine."', advice: 'One sentence of intention. It steadies you and shifts the vibe.' },
  { id: 'q214', sortOrder: 214, emoji: '🤝', category: 'Connection', relationshipCategory: 'teammates', question: 'Show a teammate you\'re on the same side, not competing?', example: 'e.g. Backing their idea, sharing credit, or saying "we" instead of "I."', advice: 'One clear "I’m with you" moment. No competing, just contributing.' },
  { id: 'q215', sortOrder: 215, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'teammates', question: 'Use a small, genuine gesture to ease tension after a disagreement with a teammate?', example: 'e.g. A quick check-in, a coffee, or "I want to make sure we’re good."', advice: 'One small gesture. Don’t let tension sit.' },
  { id: 'q216', sortOrder: 216, emoji: '💜', category: 'Warmth', relationshipCategory: 'teammates', question: 'Notice how one act of support can change a teammate\'s willingness to collaborate?', example: 'e.g. Offering help, covering for them, or defending their idea once.', advice: 'One act of support. They remember.' },
  { id: 'q217', sortOrder: 217, emoji: '🙏', category: 'Warmth', relationshipCategory: 'teammates', question: 'Find a natural way to show a teammate your intentions are good?', example: 'e.g. Offering help without being asked or sharing credit.', advice: 'One genuine move. No performance — just real.' },
  { id: 'q218', sortOrder: 218, emoji: '🧘', category: 'Presence', relationshipCategory: 'teammates', question: 'Pay attention to your body language during a heated team discussion?', example: 'e.g. Uncrossing your arms, nodding, or keeping your voice even.', advice: 'Body language speaks. One adjustment: relax your shoulders.' },
  { id: 'q219', sortOrder: 219, emoji: '🎚️', category: 'Communication', relationshipCategory: 'teammates', question: 'Keep your tone calm when a teammate disagreed with your idea?', example: 'e.g. Saying "good point" or "tell me more" instead of talking over them.', advice: 'Breathe. Pause. Then respond. One calm reply.' },
  { id: 'q220', sortOrder: 220, emoji: '⏱️', category: 'Humility', relationshipCategory: 'teammates', question: 'Respect a teammate\'s boundaries instead of constantly pushing them to engage?', example: 'e.g. Batching your asks or not @-ing them in every thread.', advice: 'One less push. Respect their boundaries.' },
  { id: 'q221', sortOrder: 221, emoji: '🛡️', category: 'Emotional', relationshipCategory: 'teammates', question: 'Notice yourself crossing your arms or shutting down when a teammate challenged you?', example: 'e.g. Catching yourself folding your arms or giving one-word answers.', advice: 'Notice it. Then one open response: "Good point — tell me more."' },
  { id: 'q222', sortOrder: 222, emoji: '📢', category: 'Communication', relationshipCategory: 'teammates', question: 'Catch yourself dominating a conversation and not leaving space for quieter teammates?', example: 'e.g. Making room for one other person to speak before you add again.', advice: 'One pause. Make space for one other voice.' },
  { id: 'q223', sortOrder: 223, emoji: '😌', category: 'Presence', relationshipCategory: 'teammates', question: 'Stay open and approachable even when team dynamics were tense?', example: 'e.g. Keeping your tone neutral and your body language open instead of closed off.', advice: 'Be the calm in the room. One steady presence.' },
  { id: 'q224', sortOrder: 224, emoji: '🤲', category: 'Humility', relationshipCategory: 'teammates', question: 'Allow a teammate to work in their own style without trying to correct them?', example: 'e.g. Letting them run their part their way instead of "here\'s how I\'d do it."', advice: 'Their style is their style. One moment of acceptance.' },
  { id: 'q225', sortOrder: 225, emoji: '🚫', category: 'Warmth', relationshipCategory: 'teammates', question: 'Resist the urge to talk about a teammate\'s habits or quirks behind their back?', example: 'e.g. Not joining in when someone vented about them or changing the subject.', advice: 'What you say behind their back gets back. One silence counts.' },
  { id: 'q226', sortOrder: 226, emoji: '🙏', category: 'Humility', relationshipCategory: 'teammates', question: 'Show respect for a teammate\'s process even when it\'s different from yours?', example: 'e.g. "I see why that works for you" instead of "That’s inefficient."', advice: 'One moment of respect. You don’t have to agree to respect.' },
  { id: 'q227', sortOrder: 227, emoji: '🎛️', category: 'Humility', relationshipCategory: 'teammates', question: 'Catch yourself micromanaging a teammate instead of trusting them?', example: 'e.g. Handing off the task and not asking for play-by-play updates.', advice: 'Trust, don’t control. One hand-off without hovering.' },
  { id: 'q228', sortOrder: 228, emoji: '🔗', category: 'Connection', relationshipCategory: 'teammates', question: 'Look for a shared interest or value with a teammate beyond work tasks?', example: 'e.g. Same game, same podcast, or similar view on work-life balance.', advice: 'One thing in common. Build from there.' },
  { id: 'q229', sortOrder: 229, emoji: '📐', category: 'Communication', relationshipCategory: 'teammates', question: 'Adjust how you communicate to match what works best for a specific teammate?', example: 'e.g. Sending bullets instead of paragraphs, or a quick call instead of a long thread.', advice: 'Match their style once. They’ll absorb it better.' },
  { id: 'q230', sortOrder: 230, emoji: '😊', category: 'Warmth', relationshipCategory: 'teammates', question: 'Start a conversation with a teammate with a genuine smile before a request?', example: 'e.g. "Hey, how’s it going?" before "Can you…?"', advice: 'One human opening. Then get to the ask.' },
  { id: 'q231', sortOrder: 231, emoji: '✨', category: 'Surprise', relationshipCategory: 'teammates', question: 'Break the routine and bring something unexpected to a team interaction?', example: 'e.g. One light moment in a heavy meeting or a new format for the standup.', advice: 'One fresh element. It stands out.' },
  { id: 'q232', sortOrder: 232, emoji: '🎁', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Do a small, unrequested favor for a teammate before they asked?', example: 'e.g. Sharing a template they needed or flagging something before it became a problem.', advice: 'One invisible help. They notice when they don’t have to ask.' },
  { id: 'q233', sortOrder: 233, emoji: '🪞', category: 'Connection', relationshipCategory: 'teammates', question: 'Discover something you have in common with a teammate outside of work?', example: 'e.g. Same hobby, same music, or same kind of vacation.', advice: 'One shared thing. Makes the relationship real.' },
  { id: 'q235', sortOrder: 235, emoji: '📌', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Avoid doing anything unpredictable that could make a teammate question your reliability?', example: 'e.g. Showing up when you said you would and giving a heads-up if something changed.', advice: 'Predictable = trustworthy. One steady move.' },
  { id: 'q236', sortOrder: 236, emoji: '💫', category: 'Presence', relationshipCategory: 'teammates', question: 'Use your personal style to make team interactions more enjoyable?', example: 'e.g. A tasteful joke when the room was tense or one angle only you would raise.', advice: 'One authentic touch. Don’t perform — be you.' },
  { id: 'q237', sortOrder: 237, emoji: '🔗', category: 'Listening', relationshipCategory: 'teammates', question: 'Reference something from a past conversation with a teammate?', example: 'e.g. "Last time you mentioned X — here’s how that landed."', advice: 'One callback. It proves you listen.' },
  { id: 'q238', sortOrder: 238, emoji: '⚡', category: 'Energy', relationshipCategory: 'teammates', question: 'Bring positive energy to your team on a difficult day?', example: 'e.g. One "we can figure this out" or a brief moment of humor that landed.', advice: 'One positive move. Energy is contagious.' },
  { id: 'q239', sortOrder: 239, emoji: '💬', category: 'Vulnerability', relationshipCategory: 'teammates', question: 'Share a personal insight or emotion that deepened a teammate\'s trust in you?', example: 'e.g. "I was nervous about that too" or "Here’s what I really think."', advice: 'One real moment. Vulnerability builds trust.' },
  { id: 'q240', sortOrder: 240, emoji: '🎁', category: 'Reciprocity', relationshipCategory: 'teammates', question: 'Leave something of value with a teammate without being asked?', example: 'e.g. One link, one intro, or one idea they didn’t have to ask for.', advice: 'One gift of value. No strings attached.' },
  { id: 'q241', sortOrder: 241, emoji: '🙏', category: 'Warmth', relationshipCategory: 'teammates', question: 'Express sincere gratitude to a teammate for something that often goes unnoticed?', example: 'e.g. "I don’t say it enough — thanks for X."', advice: 'One specific thanks for the invisible stuff.' },
  { id: 'q242', sortOrder: 242, emoji: '🤷', category: 'Humility', relationshipCategory: 'teammates', question: 'Catch yourself sounding like the expert and step back to let a teammate shine?', example: 'e.g. Asking their opinion or passing them the floor.', advice: 'Notice it. One step back. Let them lead.' },
  { id: 'q243', sortOrder: 243, emoji: '🎵', category: 'Impression', relationshipCategory: 'teammates', question: 'End your last interaction with a teammate on a high note?', example: 'e.g. Closing with "thanks" or "I\'ll follow up by Friday" instead of trailing off.', advice: 'Last words stick. One strong closer.' },
  { id: 'q244', sortOrder: 244, emoji: '🤝', category: 'Connection', relationshipCategory: 'teammates', question: 'Think about what a teammate needs before bringing up what you need?', example: 'e.g. Asking "what do you need from me?" before "here\'s what I need."', advice: 'Their needs first, once. Then yours. They’ll notice.' },
  { id: 'q245', sortOrder: 245, emoji: '🪑', category: 'Presence', relationshipCategory: 'teammates', question: 'Walk into a team setting acting as if you belong, even if you\'re the newest member?', example: 'e.g. Sitting at the table, adding one point, or asking one question like everyone else.', advice: 'You’re there for a reason. One confident move.' },
  { id: 'q246', sortOrder: 246, emoji: '👥', category: 'Presence', relationshipCategory: 'teammates', question: 'Do something specific to integrate with your teammates instead of staying on the sidelines?', example: 'e.g. Saying yes to coffee, speaking up once in the retro, or volunteering for a small task.', advice: 'One move that says "I’m part of this team."' },
  { id: 'q247', sortOrder: 247, emoji: '💪', category: 'Presence', relationshipCategory: 'teammates', question: 'Project confidence among your teammates without making anyone feel diminished?', example: 'e.g. "I think we could…" and then "what do you all think?" instead of talking over people.', advice: 'Confident + humble. One sentence that does both.' },
  { id: 'q248', sortOrder: 248, emoji: '📊', category: 'Influence', relationshipCategory: 'teammates', question: 'Demonstrate your value to the team without overshadowing others?', example: 'e.g. Sharing one result or update and naming who else helped get there.', advice: 'Let the work speak. One fact, no spin.' },
  { id: 'q249', sortOrder: 249, emoji: '📤', category: 'Initiative', relationshipCategory: 'teammates', question: 'Proactively share a win, tool, or insight that made a teammate\'s work easier this week?', example: 'e.g. Sending a link, a shortcut, or a "heads-up" they could use.', advice: 'One proactive share. No waiting to be asked.' },
  { id: 'q250', sortOrder: 250, emoji: '✨', category: 'Influence', relationshipCategory: 'teammates', question: 'Make it easy for teammates to see you as someone who lifts the team?', example: 'e.g. "I can take that" or "That was their idea" in a way others notice.', advice: 'One "here’s how I can help" moment.' },
  { id: 'q251', sortOrder: 251, emoji: '🎯', category: 'Practice', relationshipCategory: 'teammates', question: 'Apply any of these strategies in a real interaction with a teammate this week?', example: 'e.g. Picking one question from here and acting on it in a real chat or meeting.', advice: 'One strategy, one conversation. Then reflect.' },
  { id: 'q252', sortOrder: 252, emoji: '🆕', category: 'Practice', relationshipCategory: 'teammates', question: 'Try the Strangers Theory approach when a new person joined your team?', example: 'e.g. Introducing yourself and asking one real question instead of waiting for them to break the ice.', advice: 'New person = new start. One "stranger" move: ask one real question.' },
  { id: 'q253', sortOrder: 253, emoji: '📌', category: 'Practice', relationshipCategory: 'teammates', question: 'Identify which connection strategy is hardest with teammates — and practice it?', example: 'e.g. One strategy you’re weak at and one attempt this week.', advice: 'Pick the hardest one. Practice it once.' },
  { id: 'q254', sortOrder: 254, emoji: '🗣️', category: 'Initiative', relationshipCategory: 'teammates', question: 'Push yourself to connect with a teammate you usually don\'t interact with?', example: 'e.g. Reaching out in DMs, asking them something in a meeting, or offering to pair.', advice: 'One time you reached out when it would have been easier not to.' },
  { id: 'q255', sortOrder: 255, emoji: '📋', category: 'Practice', relationshipCategory: 'teammates', question: 'Choose three strategies to focus on in your next team meeting?', example: 'e.g. Picking three questions here and writing one reason each matters for you.', advice: 'Three is enough. Know why. Then do them.' },
  // Your Classmates — additional questions (256–305)
  { id: 'q256', sortOrder: 256, emoji: '👁️', category: 'Connection', relationshipCategory: 'classmates', question: 'Notice how your relationships with classmates shape your school experience?', example: 'e.g. Whether you raise your hand or how you show up to study groups.', advice: 'Your vibe with classmates sets your day. One small shift can change the whole experience.' },
  { id: 'q257', sortOrder: 257, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'classmates', question: 'Catch yourself assuming a classmate was unfriendly when they were just shy or distracted?', example: 'e.g. Pausing before judging their silence or short replies.', advice: 'Assume context first. One smile or "Hey, how\'s it going?" can open the door.' },
  { id: 'q258', sortOrder: 258, emoji: '🧑', category: 'Warmth', relationshipCategory: 'classmates', question: 'Treat a classmate like a real person, not just someone you sit next to?', example: 'e.g. Asking how they are or acknowledging something about them.', advice: 'One human moment. See the person, not just the seat next to you.' },
  { id: 'q259', sortOrder: 259, emoji: '📋', category: 'Presence', relationshipCategory: 'classmates', question: 'Think about what it takes to build trust before joining a group project or study group?', example: 'e.g. Deciding to do your part by the deadline or to ask one real question in the first meeting.', advice: 'One trust-building move before the first meeting. Small and clear.' },
  { id: 'q260', sortOrder: 260, emoji: '🤝', category: 'Connection', relationshipCategory: 'classmates', question: 'Reflect on how including every classmate makes the class stronger?', example: 'e.g. Asking someone who hasn\'t spoken yet or inviting a different viewpoint.', advice: 'Every voice adds something. One moment of inclusion changes the room.' },
  { id: 'q261', sortOrder: 261, emoji: '✨', category: 'Impression', relationshipCategory: 'classmates', question: 'Pay attention to the first impression you give classmates each semester or class?', example: 'e.g. Your first words when you sit down or whether you smile and make eye contact.', advice: 'First 10 seconds matter. One intentional greeting.' },
  { id: 'q262', sortOrder: 262, emoji: '🔗', category: 'Connection', relationshipCategory: 'classmates', question: 'Think about how a classmate\'s connections could help you grow?', example: 'e.g. Who they know, what they\'re into, and what you could share back.', advice: 'One exchange of value. Give first, then ask.' },
  { id: 'q263', sortOrder: 263, emoji: '🎯', category: 'Presence', relationshipCategory: 'classmates', question: 'Set a clear intention to be open and friendly before walking into class today?', example: 'e.g. "I\'m going to talk to someone I don\'t know" or "I\'ll ask one question today."', advice: 'One sentence of intention. It steadies you and shifts the vibe.' },
  { id: 'q264', sortOrder: 264, emoji: '🤝', category: 'Connection', relationshipCategory: 'classmates', question: 'Show a classmate you\'re approachable, not someone to avoid?', example: 'e.g. Making eye contact, saying hi first, or moving your bag so they can sit nearby.', advice: 'One clear "I\'m open" moment. No walls — just warmth.' },
  { id: 'q265', sortOrder: 265, emoji: '🕊️', category: 'Emotional', relationshipCategory: 'classmates', question: 'Use a small, genuine gesture to break the ice with a classmate you\'ve never spoken to?', example: 'e.g. "How did you do on that last one?" or "What did you get for the reading?"', advice: 'One small gesture. Don\'t wait for them to make the first move.' },
  { id: 'q266', sortOrder: 266, emoji: '💜', category: 'Warmth', relationshipCategory: 'classmates', question: 'Notice how one friendly moment can change a classmate\'s willingness to talk to you?', example: 'e.g. One smile, one "how are you," or one shared laugh.', advice: 'One friendly moment. They remember.' },
  { id: 'q267', sortOrder: 267, emoji: '🙏', category: 'Warmth', relationshipCategory: 'classmates', question: 'Find a natural way to show a classmate you\'re someone they can trust?', example: 'e.g. Keeping a small confidence, following through on a promise, or being consistent.', advice: 'One genuine move. No performance — just real.' },
  { id: 'q268', sortOrder: 268, emoji: '🧘', category: 'Presence', relationshipCategory: 'classmates', question: 'Pay attention to your body language when sitting next to a classmate you don\'t know well?', example: 'e.g. Putting your phone away, turning slightly toward them, or not blocking the aisle.', advice: 'Body language speaks. One adjustment: look up and smile once.' },
  { id: 'q269', sortOrder: 269, emoji: '🎚️', category: 'Communication', relationshipCategory: 'classmates', question: 'Keep your tone relaxed when a classmate disagreed with you during a class discussion?', example: 'e.g. Saying "I see your point" or "That\'s another way to look at it."', advice: 'Breathe. Pause. Then respond. One calm reply.' },
  { id: 'q270', sortOrder: 270, emoji: '⏱️', category: 'Humility', relationshipCategory: 'classmates', question: 'Respect a classmate\'s personal space instead of being too intense or invasive?', example: 'e.g. Not leaning over their notes or asking too many personal questions.', advice: 'One step back. Respect their boundaries.' },
  { id: 'q271', sortOrder: 271, emoji: '🛡️', category: 'Emotional', relationshipCategory: 'classmates', question: 'Notice yourself giving off closed-off signals around classmates?', example: 'e.g. Taking out one earbud when someone sat down or looking up when they walked by.', advice: 'Notice it. Then one open signal: eye contact or a quick hi.' },
  { id: 'q272', sortOrder: 272, emoji: '📢', category: 'Communication', relationshipCategory: 'classmates', question: 'Catch yourself taking up too much space without letting quieter classmates speak?', example: 'e.g. Making room for one other person to answer before you jump in again.', advice: 'One pause. Make space for one other voice.' },
  { id: 'q273', sortOrder: 273, emoji: '😌', category: 'Presence', relationshipCategory: 'classmates', question: 'Stay warm and approachable even on a day when you weren\'t in the best mood?', example: 'e.g. Saying hi or smiling once even when you wanted to put your head down.', advice: 'Be the warmth in the room. One steady move.' },
  { id: 'q274', sortOrder: 274, emoji: '🤲', category: 'Humility', relationshipCategory: 'classmates', question: 'Allow a classmate to be themselves without judging their style or opinions?', example: 'e.g. Letting them have a different take or a different way of studying without "actually…"', advice: 'Their way is their way. One moment of acceptance.' },
  { id: 'q275', sortOrder: 275, emoji: '🚫', category: 'Warmth', relationshipCategory: 'classmates', question: 'Resist the urge to gossip or talk negatively about a classmate behind their back?', example: 'e.g. Not piling on when someone vented or changing the subject instead of adding to it.', advice: 'What you say behind their back gets back. One silence counts.' },
  { id: 'q276', sortOrder: 276, emoji: '🙏', category: 'Humility', relationshipCategory: 'classmates', question: 'Show respect for a classmate\'s way of thinking even when it\'s different from yours?', example: 'e.g. "I hadn\'t thought of it that way" or "That\'s a different angle."', advice: 'One moment of respect. You don\'t have to agree to respect.' },
  { id: 'q277', sortOrder: 277, emoji: '🎛️', category: 'Humility', relationshipCategory: 'classmates', question: 'Catch yourself pressuring a classmate to fit in instead of accepting who they are?', example: 'e.g. Asking them to join without "you should really…" or "why don\'t you just…"', advice: 'Include, don\'t mold. One invitation as they are.' },
  { id: 'q278', sortOrder: 278, emoji: '🔗', category: 'Connection', relationshipCategory: 'classmates', question: 'Look for a shared interest with a classmate beyond schoolwork?', example: 'e.g. Same show, same game, same kind of weekend, or same post-grad goal.', advice: 'One thing in common. Build from there.' },
  { id: 'q279', sortOrder: 279, emoji: '📐', category: 'Communication', relationshipCategory: 'classmates', question: 'Adjust how you talk to match the vibe of a classmate you were getting to know?', example: 'e.g. Talking more or less depending on how much they shared, or matching their tone.', advice: 'Match their vibe once. They\'ll open up more.' },
  { id: 'q280', sortOrder: 280, emoji: '😊', category: 'Warmth', relationshipCategory: 'classmates', question: 'Start a conversation with a classmate with a genuine smile instead of waiting for them?', example: 'e.g. Saying "hey" or "how\'s the class going?" before asking for notes or help.', advice: 'One human opening. Then get to the topic.' },
  { id: 'q281', sortOrder: 281, emoji: '✨', category: 'Surprise', relationshipCategory: 'classmates', question: 'Break the usual routine and say something unexpected that made a classmate laugh or think?', example: 'e.g. A joke, a fun fact, or a different way to look at the material.', advice: 'One fresh element. It stands out.' },
  { id: 'q282', sortOrder: 282, emoji: '🎁', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Do a small, casual favor for a classmate without expecting anything back?', example: 'e.g. One small act of help with no strings attached.', advice: 'One invisible help. They notice when they don\'t have to ask.' },
  { id: 'q283', sortOrder: 283, emoji: '🪞', category: 'Connection', relationshipCategory: 'classmates', question: 'Discover something surprising you have in common with a classmate you barely knew?', example: 'e.g. Same show, same game, same struggle, same goal.', advice: 'One shared thing. Makes the relationship real.' },
  { id: 'q284', sortOrder: 284, emoji: '🙌', category: 'Warmth', relationshipCategory: 'classmates', question: 'Compliment a classmate out loud in front of others?', example: 'e.g. "That was a great point" or "I liked how you did that."', advice: 'One public compliment. Be specific.' },
  { id: 'q285', sortOrder: 285, emoji: '📌', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Avoid doing anything unpredictable that could make a classmate uncomfortable about you?', example: 'e.g. No sudden drama, no weird jokes that could land wrong.', advice: 'Predictable = trustworthy. One steady move.' },
  { id: 'q286', sortOrder: 286, emoji: '💫', category: 'Presence', relationshipCategory: 'classmates', question: 'Use your personal style to start conversations with classmates?', example: 'e.g. One thing that makes you you and gives others a hook to talk.', advice: 'One authentic touch. Don\'t perform — be you.' },
  { id: 'q287', sortOrder: 287, emoji: '🔗', category: 'Listening', relationshipCategory: 'classmates', question: 'Bring up something from a past conversation with a classmate?', example: 'e.g. "Last time you said X — how did that go?"', advice: 'One callback. It proves you listen.' },
  { id: 'q288', sortOrder: 288, emoji: '⚡', category: 'Energy', relationshipCategory: 'classmates', question: 'Bring positive energy to a group of classmates on a stressful day?', example: 'e.g. One calm or light comment when everyone was stressed.', advice: 'One positive move. Energy is contagious.' },
  { id: 'q289', sortOrder: 289, emoji: '💬', category: 'Vulnerability', relationshipCategory: 'classmates', question: 'Share something personal or unexpected that made a classmate feel closer to you?', example: 'e.g. "I was nervous about that too" or "Here\'s something I don\'t usually share."', advice: 'One real moment. Vulnerability builds trust.' },
  { id: 'q290', sortOrder: 290, emoji: '🎁', category: 'Reciprocity', relationshipCategory: 'classmates', question: 'Leave something of value with a classmate without being asked?', example: 'e.g. One link, one tip, or one "you\'ve got this."', advice: 'One gift of value. No strings attached.' },
  { id: 'q291', sortOrder: 291, emoji: '🙏', category: 'Warmth', relationshipCategory: 'classmates', question: 'Express sincere gratitude to a classmate for something that often goes unnoticed?', example: 'e.g. "I don\'t say it enough — thanks for X."', advice: 'One specific thanks for the invisible stuff.' },
  { id: 'q292', sortOrder: 292, emoji: '🤷', category: 'Humility', relationshipCategory: 'classmates', question: 'Catch yourself acting like the smartest person and step back to let a classmate shine?', example: 'e.g. Asking their opinion or passing them the floor.', advice: 'Notice it. One step back. Let them lead.' },
  { id: 'q293', sortOrder: 293, emoji: '🎵', category: 'Impression', relationshipCategory: 'classmates', question: 'End your last conversation with a classmate on a high note?', example: 'e.g. A thank you, a "see you next time," or something forward-looking.', advice: 'Last words stick. One strong closer.' },
  { id: 'q294', sortOrder: 294, emoji: '🤝', category: 'Connection', relationshipCategory: 'classmates', question: 'Think about what a classmate might be going through before focusing on your own problems?', example: 'e.g. "You okay?" or "How\'s your week been?" before your own stuff.', advice: 'Their world first, once. Then yours. They\'ll notice.' },
  { id: 'q295', sortOrder: 295, emoji: '🪑', category: 'Presence', relationshipCategory: 'classmates', question: 'Walk into a new class or group acting as if you belong, even if you didn\'t know anyone?', example: 'e.g. Confident posture, saying hi first, sitting where you can connect.', advice: 'You belong there. One confident move.' },
  { id: 'q296', sortOrder: 296, emoji: '👥', category: 'Presence', relationshipCategory: 'classmates', question: 'Do something specific to stop feeling like an outsider?', example: 'e.g. One action that said "I\'m part of this."', advice: 'One move that says "I belong here."' },
  { id: 'q297', sortOrder: 297, emoji: '💪', category: 'Presence', relationshipCategory: 'classmates', question: 'Project confidence among classmates without making anyone feel left out?', example: 'e.g. Sharing your view while leaving space for others.', advice: 'Confident + inclusive. One sentence that does both.' },
  { id: 'q298', sortOrder: 298, emoji: '📊', category: 'Influence', relationshipCategory: 'classmates', question: 'Show what you\'re good at without coming across as a show-off?', example: 'e.g. One concrete contribution, stated simply, with room for others.', advice: 'Let your work speak. One fact, no bragging.' },
  { id: 'q299', sortOrder: 299, emoji: '📤', category: 'Initiative', relationshipCategory: 'classmates', question: 'Proactively help a classmate this week?', example: 'e.g. One offer to help without being asked.', advice: 'One proactive help. No waiting to be asked.' },
  { id: 'q300', sortOrder: 300, emoji: '✨', category: 'Influence', relationshipCategory: 'classmates', question: 'Make it easy for classmates to see you as someone who contributes to the group?', example: 'e.g. Sharing notes, leading once, or offering to help.', advice: 'One "here\'s how I can help" moment.' },
  { id: 'q301', sortOrder: 301, emoji: '🎯', category: 'Practice', relationshipCategory: 'classmates', question: 'Apply any of these strategies in a real interaction with a classmate this week?', example: 'e.g. One thing you tried from this list in a real conversation.', advice: 'One strategy, one conversation. Then reflect.' },
  { id: 'q302', sortOrder: 302, emoji: '🆕', category: 'Practice', relationshipCategory: 'classmates', question: 'Try the Strangers Theory approach on the first day of a new class or when a new student arrived?', example: 'e.g. Treating them like a fresh start — curious, welcoming, no assumptions.', advice: 'New class or new face = new start. One "stranger" move: ask one real question.' },
  { id: 'q303', sortOrder: 303, emoji: '📌', category: 'Practice', relationshipCategory: 'classmates', question: 'Identify which connection strategy is hardest with classmates — and practice it?', example: 'e.g. One strategy you\'re weak at and one attempt this week.', advice: 'Pick the hardest one. Practice it once.' },
  { id: 'q304', sortOrder: 304, emoji: '🗣️', category: 'Initiative', relationshipCategory: 'classmates', question: 'Push yourself to talk to a classmate you usually ignore or avoid?', example: 'e.g. One conversation, one question, or one "hey."', advice: 'One time you reached out when it would have been easier not to.' },
  { id: 'q305', sortOrder: 305, emoji: '📋', category: 'Practice', relationshipCategory: 'classmates', question: 'Choose three strategies to focus on tomorrow at school?', example: 'e.g. Three from this list + one sentence on why each matters for you.', advice: 'Three is enough. Know why. Then do them.' },
];

/** sort_order -> relationshipCategory for mapping DB answers to category averages */
export const SORT_ORDER_TO_RELATIONSHIP: Record<number, RelationshipCategory> = Object.fromEntries(
  CHECKIN_QUESTIONS.map((q) => [q.sortOrder, q.relationshipCategory])
) as Record<number, RelationshipCategory>;

/** Synonyms for question variety (phrase-safe). Applied per question via seeded random. */
const QUESTION_SYNONYMS: [RegExp, string][] = [
  [/\bsay hi\b/gi, 'greet'],
  [/\bpeople\b/g, 'folks'],
  [/\bsomeone\b/g, 'somebody'],
  [/\beveryone\b/g, 'everybody'],
  [/\breally\b/g, 'actually'],
  [/\bsmall\b/g, 'little'],
  [/\bgood\b/g, 'solid'],
  [/\btalk\b/g, 'speak'],
  [/\bconversation\b/g, 'chat'],
  [/\bconversations\b/g, 'chats'],
  [/\bfind something in common\b/gi, 'find something you share'],
  [/\bleave the conversation\b/gi, 'end the chat'],
  [/\bpersonal\b/g, 'real'],
];

/** Seeded random 0..1 from string (stable per question so variant doesn't flip on re-render). */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

/** Returns a display version of the question with mixed word order or synonyms (stable per question id). */
export function getDisplayQuestion(q: CheckinQuestionData): string {
  // For Spanish, return the localized question as-is (no synonym swaps)
  const localized = getLocalizedQuestion(q);
  if (getLocale() === 'es') return localized.question;

  const r1 = seededRandom(q.id);
  const r2 = seededRandom(q.id + 'a');
  let text = q.question;
  if (r1 < 0.35 && / today\?$/i.test(text)) {
    text = 'Today, ' + text.replace(/ today\?$/i, '?');
  } else if (r1 < 0.55 && r1 >= 0.35 && /^Did you /.test(text)) {
    text = text.replace(/^Did you /, 'You — did you ');
  }
  if (r2 < 0.5) {
    for (const [regex, replacement] of QUESTION_SYNONYMS) {
      if (regex.test(text)) {
        text = text.replace(regex, replacement);
        break;
      }
    }
  }
  return text;
}

/** Labels per 0.5 step from 1 to 5 (1=Very slightly, 5=Really well) */
const SLIDER_LABELS = [
  'Very slightly', /* 1.0 */
  'Slightly',      /* 1.5 */
  'Somewhat',      /* 2.0 */
  'Moderately',    /* 2.5 */
  'Fairly',        /* 3.0 */
  'Quite',         /* 3.5 */
  'Very',          /* 4.0 */
  'Really',        /* 4.5 */
  'Extremely',     /* 5.0 */
] as const;
/** One color per 0.5 step (1, 1.5, 2, …, 5): index 0 = red, index 8 = light green */
const SLIDER_COLORS = [
  '#E8634A', /* 1 */
  '#E07A42', /* 1.5 */
  '#E8A94A', /* 2 */
  '#D4B84A', /* 2.5 */
  '#E8E84A', /* 3 */
  '#B8D84A', /* 3.5 */
  '#7BE84A', /* 4 */
  '#5AD95A', /* 4.5 */
  '#90EE90', /* 5 */
] as const;

const LOW_CATEGORY_THRESHOLD = 3.5;
const EXTRA_QUESTIONS_PER_LOW_CATEGORY = 1;

/** Get extra questions for categories whose average is <= threshold (default 3.5). Excludes already-asked question ids. */
export function getExtraQuestionsForLowCategories(
  currentQuestions: CheckinQuestionData[],
  answers: { value: number }[],
  options?: { threshold?: number; maxPerCategory?: number }
): CheckinQuestionData[] {
  const threshold = options?.threshold ?? LOW_CATEGORY_THRESHOLD;
  const maxPer = options?.maxPerCategory ?? EXTRA_QUESTIONS_PER_LOW_CATEGORY;
  const usedIds = new Set(currentQuestions.map((q) => q.id));
  const byCat: Record<RelationshipCategory, number[]> = { boss: [], teammates: [], classmates: [] };
  currentQuestions.forEach((q, i) => {
    const v = answers[i]?.value;
    if (v != null && q.relationshipCategory && byCat[q.relationshipCategory]) {
      byCat[q.relationshipCategory].push(v);
    }
  });
  const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null);
  const lowCategories: RelationshipCategory[] = (['boss', 'teammates', 'classmates'] as const).filter(
    (c) => (avg(byCat[c]) ?? 5) <= threshold
  );
  if (lowCategories.length === 0) return [];
  const poolByCat: Record<RelationshipCategory, CheckinQuestionData[]> = {
    boss: CHECKIN_QUESTIONS.filter((q) => q.relationshipCategory === 'boss' && !usedIds.has(q.id)),
    teammates: CHECKIN_QUESTIONS.filter((q) => q.relationshipCategory === 'teammates' && !usedIds.has(q.id)),
    classmates: CHECKIN_QUESTIONS.filter((q) => q.relationshipCategory === 'classmates' && !usedIds.has(q.id)),
  };
  const seed = Math.floor(Date.now() / 60000);
  const shuffle = (arr: CheckinQuestionData[]): CheckinQuestionData[] =>
    [...arr].sort((a, b) => (hash(seed + a.sortOrder) - hash(seed + b.sortOrder)));
  const extra: CheckinQuestionData[] = [];
  for (const cat of lowCategories) {
    const pool = shuffle(poolByCat[cat]);
    for (let i = 0; i < Math.min(maxPer, pool.length); i++) {
      extra.push(pool[i]);
      usedIds.add(pool[i].id);
    }
  }
  return extra;
}

/** Max questions for signed-in users (visitors get 5). */
export const MAX_QUESTIONS_SIGNED_IN = 20;

/** Seeded shuffle: pick questions for current 12-hour window, balanced across boss/teammates/classmates. Default 5 (visitors), pass maxCount for signed-in (e.g. 20). */
export function getQuestionsForRotation(maxCount: number = 5): CheckinQuestionData[] {
  const msPer12h = 12 * 60 * 60 * 1000;
  const seed = Math.floor(Date.now() / msPer12h);
  const byRelationship: Record<RelationshipCategory, CheckinQuestionData[]> = {
    boss: CHECKIN_QUESTIONS.filter((q) => q.relationshipCategory === 'boss'),
    teammates: CHECKIN_QUESTIONS.filter((q) => q.relationshipCategory === 'teammates'),
    classmates: CHECKIN_QUESTIONS.filter((q) => q.relationshipCategory === 'classmates'),
  };
  const shuffle = (arr: CheckinQuestionData[]): CheckinQuestionData[] =>
    [...arr].sort((a, b) => hash(seed + a.sortOrder) - hash(seed + b.sortOrder));
  const pick = (arr: CheckinQuestionData[], n: number) => shuffle(arr).slice(0, n);
  const result: CheckinQuestionData[] = [];
  if (maxCount <= 3) {
    result.push(...pick(byRelationship.boss, 1));
    result.push(...pick(byRelationship.teammates, 1));
    result.push(...pick(byRelationship.classmates, 1));
  } else if (maxCount <= 5) {
    result.push(...pick(byRelationship.boss, 2));
    result.push(...pick(byRelationship.teammates, 2));
    result.push(...pick(byRelationship.classmates, 1));
  } else {
    const n = Math.min(maxCount, 20);
    const per = Math.ceil(n / 3);
    result.push(...pick(byRelationship.boss, per));
    result.push(...pick(byRelationship.teammates, per));
    result.push(...pick(byRelationship.classmates, per));
  }
  return shuffle(result).slice(0, maxCount);
}

function hash(n: number): number {
  return (n * 2654435761) % 2147483647;
}

/** Value is 1–5 in 0.5 steps. Maps to adjective label. */
export function getSliderLabel(value: number): string {
  const index = Math.min(8, Math.max(0, Math.round((value - 1) * 2)));
  if (getLocale() === 'es') {
    const t = getT();
    const esLabels = [
      t.sliderLabels.verySlightly,
      t.sliderLabels.slightly,
      t.sliderLabels.somewhat,
      t.sliderLabels.moderately,
      t.sliderLabels.fairly,
      t.sliderLabels.quite,
      t.sliderLabels.very,
      t.sliderLabels.really,
      t.sliderLabels.extremely,
    ];
    return esLabels[index] ?? t.sliderLabels.fairly;
  }
  return SLIDER_LABELS[index] ?? 'Fairly';
}

/** Value is 1–5 in 0.5 steps. One color per 0.5 (1=red, 5=light green). */
export function getSliderColor(value: number): string {
  const index = Math.min(8, Math.max(0, Math.round((value - 1) * 2)));
  return SLIDER_COLORS[index] ?? '#E8E84A';
}

/** All allowed slider values: 1, 1.5, 2, …, 5 */
export const SLIDER_VALUES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

/** Fireside scale: 4 options only. No default, user must select. */
export const FIRESIDE_SLIDER_LABELS: Record<number, string> = {
  1: 'Barely',
  2: 'Not often',
  3: 'Regularly',
  4: 'All the time',
};

/** Ordered labels for display (1–4). Words only, no slider. */
export const FIRESIDE_OPTION_LABELS = [
  'Barely',
  'Not often',
  'Regularly',
  'All the time',
] as const;

/** Emoji for each fireside option (1–4). */
export const FIRESIDE_OPTION_EMOJIS = ['🫥', '🙂', '😊', '✨'] as const;

export function getFiresideSliderLabel(value: number): string {
  if (value >= 1 && value <= 4) {
    if (getLocale() === 'es') {
      const t = getT();
      const esLabels: Record<number, string> = {
        1: t.fireside.barely,
        2: t.fireside.notOften,
        3: t.fireside.regularly,
        4: t.fireside.allTheTime,
      };
      return esLabels[Math.round(value)] ?? '';
    }
    return FIRESIDE_SLIDER_LABELS[Math.round(value)] ?? '';
  }
  return '';
}

/** Locale-aware fireside option labels (1–4) */
export function getFiresideOptionLabels(): readonly string[] {
  if (getLocale() === 'es') {
    const t = getT();
    return [t.fireside.barely, t.fireside.notOften, t.fireside.regularly, t.fireside.allTheTime];
  }
  return FIRESIDE_OPTION_LABELS;
}
