# Linear Issue — Stranger Count Feature

**Click to create this issue in Linear** (opens with title pre-filled; paste description from below):

https://linear.new?title=Feature%3A+Daily+stranger+count+-+track+how+many+strangers+you+spoke+to+each+day&priority=medium

---

## Title
Feature: Daily stranger count — track how many strangers you spoke to each day

---

## Description

### TL;DR
Add a daily "strangers spoken to" counter so users can track new people they talked to that day. Display on home alongside streak badge, with manual input + Supabase persistence.

### Current state
- Home shows streak badge 🔥 and check-in status (X/6 check-ins)
- No tracking of strangers / new connections

### Expected outcome
- User can log how many strangers they spoke to today
- Home displays a second badge/metric next to streak (e.g. "👋 X strangers today")
- Count persisted per user per day, viewable on Profile / history

### Relevant files
1. `app/(tabs)/index.tsx` — add stranger-count display and quick-log input
2. `supabase/migrations/` — new table or profile column for daily stranger counts
3. `src/hooks/useStrangerCount.ts` (new) — fetch today's count, increment, persist

### Notes
- **Definition:** Stranger = someone you didn't know before (user decides)
- **Input:** Manual only — no automatic detection
- **Scope:** Start simple — daily number only; no list of people or notes

---

## Labels
- Type: Feature
- Priority: Normal
- Effort: Medium
