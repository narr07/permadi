# BuddyUp / v0-ai Design Review

**Scope**: [component | page | flow] — [path or screen name]  
**Goal**: [align spec | new feature | cleanup | UX critique]  
**Date**:

---

## Context

- User task on this surface:
- Primary success metric (if known):
- Baseline reference screen/file:

---

## Findings

| Sev | Issue | Impact | Recommendation | Evidence |
|-----|-------|--------|----------------|----------|
| P0 | | | | Validated / Contextual / Experimental |
| P1 | | | | |
| P2 | | | | |
| P3 | | | | |

---

## Applied Laws (3–7 max)

- **Law name**: why it matters here → concrete UI change

---

## Product Spec Checks

### Visual hierarchy
- [ ] One primary CTA; no duplicate metrics
- [ ] Token colors only; hierarchy clear

### Interaction
- [ ] States complete; shortcuts safe in inputs
- [ ] Modals correct (AlertDialog vs Dialog)
- [ ] Fixed bars do not block CTA

### Components & forms
- [ ] `@/components/ui` reused
- [ ] Field layout; empty state has next action

### Copy & flow
- [ ] Terminology matches 问卷→匹配→工作台→文书
- [ ] Local/guest storage perceptible if applicable

### Onboarding (if relevant)
- [ ] `data-tour` registered
- [ ] Storage key in onboarding-keys

### Accessibility
- [ ] Icon labels; keyboard; focus-visible; not color-only state

---

## Acceptance Checks

- [ ] Desktop layout OK
- [ ] Mobile layout OK
- [ ] Core path: entry → action → feedback → next step
- [ ] Lint clean on touched files

---

## Residual Risks / Deferred

-
