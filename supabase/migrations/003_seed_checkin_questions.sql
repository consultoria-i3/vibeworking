-- ============================================================================
-- Vibe Working — Seed 38 Check-in Questions + Coaching Advice
-- ANAI-55, ANAI-56
-- ============================================================================

-- Clear existing (idempotent if re-run)
DELETE FROM checkin_question_tips;
DELETE FROM checkin_questions;

-- Insert 38 questions with coaching tips (low-score advice: max_value=3)
-- Format: (question, emoji, category, sort_order), (advice for score 1-3)
INSERT INTO checkin_questions (question, emoji, category, sort_order) VALUES
('Did you give someone a real smile today? Not the fake one lol', '😊', 'Warmth', 1),
('Did you actually say hi to people today?', '👋', 'Warmth', 2),
('Did you tell someone thanks and actually mean it? Express that gratitude!', '🙏', 'Warmth', 3),
('Did you say hello to everyone? Like actually everyone?', '🫂', 'Warmth', 4),
('Did you treat people like family today? Hospitality and empathy go a long way', '🏠', 'Warmth', 5),
('Did you do a little favor for someone just because?', '🤝', 'Reciprocity', 6),
('Did you casually help someone out without making it a big thing?', '🙌', 'Reciprocity', 7),
('Did you ask someone for a tiny favor? That''s reciprocity — it actually works!', '📋', 'Reciprocity', 8),
('Did you find something in common with someone? That''s seeking familiarity!', '🔍', 'Connection', 9),
('Did you make someone feel like they belong? That''s encouraging familiarity', '🌱', 'Connection', 10),
('Did you find out you and someone have random stuff in common? Incidental similarities!', '🪞', 'Connection', 11),
('Things got awkward — did you help defuse the tension?', '🕊️', 'Emotional', 12),
('Did you make someone feel something good today? That''s landing them into emotion', '💫', 'Emotional', 13),
('Did you hype someone up to actually go do something? Land them into action!', '⚡', 'Influence', 14),
('Did you flip a convo in a new direction? That''s inflection — change the trajectory!', '↗️', 'Influence', 15),
('Did you surprise someone with something unexpected in a convo?', '🎁', 'Surprise', 16),
('Did you break the script? Do something nobody expected?', '🎭', 'Surprise', 17),
('Did you go off-script and just let a convo happen naturally?', '🎪', 'Surprise', 18),
('How was your tone of voice today? Chill? Warm? Cold?', '🗣️', 'Communication', 19),
('Did you try a framing statement? Say something, explain why, then back it up', '🖼️', 'Communication', 20),
('Did you keep asking questions based on what they just said? Chain those questions!', '🔗', 'Listening', 21),
('When you didn''t get it, did you ask clarifying questions?', '❓', 'Listening', 22),
('When someone said something, did you ask a follow-up about it?', '🔄', 'Listening', 23),
('Real talk — did you actually make eye contact with people?', '👁️', 'Presence', 24),
('Did you look someone in the eyes and really connect? That''s oxytocin!', '👀', 'Presence', 25),
('Did you walk in like you''ve been there forever? Don''t look new!', '🧱', 'Presence', 26),
('Did you take up space and own it? Don''t play small!', '🦁', 'Presence', 27),
('Did you talk to yourself out loud, pull someone in, and drop something positive? Try it!', '💬', 'Initiative', 28),
('Got any stickers, logos, or cool stuff on display? Ornamentation sparks convos!', '🏷️', 'Environment', 29),
('Did you share something personal? Even a small detail builds trust', '📖', 'Vulnerability', 30),
('Did you casually drop something personal into a convo? Opens doors!', '🤫', 'Vulnerability', 31),
('Did you let your guard down a bit? Showing vulnerability is powerful', '💜', 'Vulnerability', 32),
('Did you chill on the know-it-all vibes? Nobody likes that person', '🤷', 'Humility', 33),
('Did you stay open to other ideas? Don''t be the person who''s always right', '🤲', 'Humility', 34),
('Did you blend in like you belong? Don''t be the outsider!', '🚪', 'Belonging', 35),
('Did you put good energy out there? Give positivity to get positivity back', '✨', 'Energy', 36),
('Did you leave a convo on a high note? That last impression matters', '🎵', 'Impression', 37),
('Did you try the espresso martini exercise? Mix something bold into your day!', '🍸', 'Practice', 38);

-- Insert coaching tips (max_value=3 means show when score <= 3)
INSERT INTO checkin_question_tips (question_id, max_value, label, color, text, sort_order)
SELECT q.id, 3, '💡 Try this', '#E8A94A', v.advice, 1
FROM (VALUES
  (1::int, 'Tomorrow, try smiling at one person before they smile at you. Sounds small but it changes the whole vibe.'),
  (2, 'Hold a door, grab someone a coffee, pass a pen — tiny favors build trust without even trying.'),
  (3, 'Just a simple ''hey, how''s it going?'' goes further than you think. Don''t overthink it.'),
  (4, 'Ask people what shows they watch, where they eat, what music they''re into. You''ll find overlap fast.'),
  (5, 'Use people''s names, remember small details, bring up past convos. Makes people feel seen.'),
  (6, 'When things get tense, try a joke, change the subject, or just acknowledge it — ''well that was awkward lol.'''),
  (7, 'Next time you want someone to do something, make it sound exciting. Energy is contagious.'),
  (8, 'Share a story, give a compliment, celebrate a small win with someone. Emotions connect people.'),
  (9, 'Bring a random snack, share a weird fact, tell an unexpected story. People remember the surprise.'),
  (10, 'Record yourself talking sometime — you might be surprised. Try matching the energy of who you''re talking to.'),
  (11, 'See someone struggling? Jump in for 30 seconds. That''s all it takes to be the person people remember.'),
  (12, 'Listen for little things — same hometown, same phone, same coffee order. Point it out when you find it!'),
  (13, 'Practice looking at someone''s eyes long enough to notice their color. That''s the right amount of contact.'),
  (14, 'Text someone right now and say thanks for something specific. Watch what happens.'),
  (15, 'Start your next convo with something positive. Compliment their work, their idea, anything real.'),
  (16, 'Before you walk away from a convo, say something memorable or kind. Leave them smiling.'),
  (17, 'When someone tells you something, don''t switch topics. Ask ''wait, tell me more about that.'''),
  (18, 'Do one thing tomorrow that feels a little bold or outside your comfort zone. That''s the exercise.'),
  (19, 'When you don''t understand, just say ''what do you mean by that?'' People respect it.'),
  (20, 'Challenge yourself: say hi to every single person you see tomorrow. Even the quiet ones.'),
  (21, 'Next convo, try holding eye contact just a beat longer than usual. It builds real connection.'),
  (22, 'Talk out loud about something near you, then pull someone in: ''have you tried this?'' Works every time.'),
  (23, 'Put a sticker on your laptop, wear something that starts convos. Let your stuff do the talking.'),
  (24, 'Share where you''re from, what you did this weekend, a hobby. Small personal details = big trust.'),
  (25, 'Ask someone to hold your drink, watch your stuff, grab you a napkin. Small asks build bonds.'),
  (26, 'Tomorrow, respond to ''how are you?'' with something unexpected. See what happens.'),
  (27, 'When someone finishes talking, ask about the last thing they said. Shows you were actually listening.'),
  (28, 'Stop planning what to say next. Just listen and respond naturally. Convos flow better that way.'),
  (29, 'Try this: make a statement, explain why you think that, then ask what they think. Structured but natural.'),
  (30, 'Drop a ''honestly, I...'' into your next convo. Being casually real is magnetic.'),
  (31, 'Admit you don''t know something. Say ''I messed up.'' People trust vulnerable people way more.'),
  (32, 'Next time you know the answer, ask someone else what they think first. Let them shine.'),
  (33, 'Treat the next stranger you meet like a friend of a friend. Warm, open, welcoming.'),
  (34, 'Walk in with purpose. Know where you''re going. Confidence makes you look like you belong.'),
  (35, 'Use ''we'' and ''us'' instead of ''I'' and ''them.'' Language shapes how people see you.'),
  (36, 'Speak a little louder, take up a little more space. You earned your spot — own it.'),
  (37, 'Try saying ''that''s a good point'' more often. Being open makes people want to talk to you.'),
  (38, 'When a convo is going nowhere, ask a totally different question. Shift the energy.')
) AS v(ord, advice)
JOIN checkin_questions q ON q.sort_order = v.ord;
