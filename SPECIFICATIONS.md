# Vibe Working — Specifications Summary

## Implementation Status
- ✅ Home screen: header, streak, check-in slider (hidden after 6), status, 2×2 category grid
- ✅ Check-in: 5 questions/session, 12-hour rotation, 6/day limit, slider 1–5, detail input, coaching for low scores
- ✅ Database: migration 002 (detail_text, 6/day), migration 003 (38 questions + advice)
- ✅ Persistence: daily_checkins + checkin_answers to Supabase


## 1. App Overview
- **Target:** New grads 18–24, first jobs
- **Tone:** Casual, relatable ("lol", "real talk", "fr")
- **Features:** Workplace tips, daily check-ins, community forums, mentor matching

## 2. Home Screen Layout (Top → Bottom)
| Section | Spec |
|---------|------|
| Header | "Good morning / Welcome back! 👋" + streak badge 🔥 |
| Check-in Slider | "How Did You Do Today? 📝" — 1–5 scale. **Hidden after 6 check-ins.** |
| Check-in Status | "X/6 check-ins today" or "All 6 check-ins complete!" |
| Category Grid | 2×2: 👔 Boss, 🤝 Teammates, 🎓 Classmates, 💬 Ask All of Us |

## 3. Check-in System
- **38 questions** across 14 skill categories
- **5 questions per session** — seeded shuffle
- **Rotation:** Every 12 hours
- **Limit:** 6 check-ins per day max
- **Slider:** 1–5 ("Extremely Failed" ↔ "Extremely Well")
- **Detail input** after each slider: "💬 Let me know the details"
- **Low score (1–3):** "💡 Try this" coaching box
- **High score (4–5):** Praise / encouragement
- **Persistence:** All data to Supabase, full history in Profile

## 4. Linear Issues
- ANAI-48: Home — Check-in Slider
- ANAI-49: Home — Category Quick Links
- ANAI-50: Check-in — 6 Per Day
- ANAI-51: Check-in — 38 Questions, 12-Hour Rotation
- ANAI-52: Check-in — Detail Chat Input
- ANAI-53: Check-in — Results with Coaching Advice
- ANAI-54: Check-in — Persist to Database
- ANAI-55: Content — 38 Questions
- ANAI-56: Content — 38 Coaching Advice
- ANAI-57: Migration 002 — Check-in System Database
