# Implementation Plan: Contacts Calculator

## Objective

Add a **contacts calculator** that shows users an estimated number of contacts/connections (e.g. "Estimated contacts") on the home screen. The number is derived from existing data (check-ins, streaks, category engagement) so we ship without new DB tables; the formula can be tuned or replaced later (e.g. user-editable count).

## Scope

- **In scope:** Derive an estimate from existing data; new service + hook; display on home (and optionally profile); reuse existing theme/styles.
- **Out of scope:** Storing a real contacts list; syncing with device contacts; new Supabase tables for v1 (unless we add a single "contacts_override" field later).

## Implementation Steps

### Phase 1: Calculator logic and data

- [ ] **Step 1 — Define formula and service** (~1–2 h)  
  - Add `src/services/contactsCalculator.ts`.  
  - Implement `getContactsEstimate(userId: string): Promise<number>`.  
  - Formula v1: e.g. `(unique check-in days in last 30 days) * 3` or `(streak_count + 1) * 5`, or combine category engagement (boss/teammates/classmates activity). Use existing Supabase client and tables only (`daily_checkins`, `checkin_answers`, `profiles.streak_count`).  
  - Export a simple interface, e.g. `{ estimate: number; source: 'derived' }` for future extension (e.g. `source: 'user_override'`).

- [ ] **Step 2 — Hook for UI** (~0.5 h)  
  - Add `src/hooks/useContactsEstimate.ts`.  
  - Mirror `useCategoryAverages`: take `userId`, call `getContactsEstimate(userId)`, return `{ estimate, loading, refresh }`.  
  - Use in home (and later profile if desired).

### Phase 2: Home screen UI

- [ ] **Step 3 — Home block for contacts** (~1–2 h)  
  - In `app/(tabs)/index.tsx`: import `useContactsEstimate`, call it with `user?.id`.  
  - Add a small section (card or row) that shows "Estimated contacts" (or "Connections") and the number; only render when `user` is present.  
  - Reuse existing styles (e.g. `gridCard`, `gridTitleRow`, or a compact stat row) and `colors`/`fonts` from `src/theme`.  
  - Handle loading (skeleton or "—") and refresh after check-in if needed (e.g. call `refresh()` when check-in submit succeeds).

- [ ] **Step 4 — Copy and accessibility** (~0.5 h)  
  - Finalize label: e.g. "Estimated contacts" or "Connections" and optional short subtitle.  
  - Add `accessibilityLabel` so the number is announced correctly.

## Technical Decisions

- **Derived-only v1:** No new table; estimate computed from `daily_checkins`, `checkin_answers`, and `profiles`. Keeps scope small and allows formula iteration.
- **Service in `src/services`:** Keeps checkins.ts focused; contacts calculator is a separate concern and can later call an API or use a stored override.
- **Hook pattern:** Same as `useCategoryAverages` for consistency and easy refresh after check-in.

## Files to Create/Modify

| File | Action |
|------|--------|
| `vibeworking/src/services/contactsCalculator.ts` | **Create** — `getContactsEstimate(userId)`, formula, Supabase reads. |
| `vibeworking/src/hooks/useContactsEstimate.ts` | **Create** — Hook returning `{ estimate, loading, refresh }`. |
| `vibeworking/app/(tabs)/index.tsx` | **Modify** — Use hook, render contacts block on home when logged in. |

Optional later:

- `vibeworking/app/(tabs)/profile.tsx` — Show same estimate if desired.
- `vibeworking/src/types/database.ts` — Only if we add a stored override (e.g. `profiles.contacts_override`).

## Dependencies

- Existing: `getSupabaseOrNull`, `daily_checkins`, `checkin_answers`, `profiles` (and possibly `checkin_questions` if mapping by category). No new npm packages.

## Risks

- **Formula feels arbitrary:** Mitigate by using clear, documentable logic (e.g. "last 30 days check-in days × 3") and easy-to-change constants in one place; consider in-app tooltip or help text later.
- **Performance:** Calculator runs once per load + after check-in; if we add heavier logic, consider caching or moving to an Edge Function later.

## Definition of Done

- [ ] `getContactsEstimate(userId)` returns a number using only existing tables.
- [ ] Home screen shows "Estimated contacts" (or agreed label) and the number when user is signed in.
- [ ] Loading state and refresh (e.g. after check-in) work; no regressions on existing home UI.
- [ ] Copy and accessibility are in place; formula and file locations documented (e.g. in this plan or in code comments).
