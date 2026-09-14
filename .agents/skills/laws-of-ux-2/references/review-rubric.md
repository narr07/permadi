# UX Review Rubric

Use this rubric when reviewing a UI, product flow, Figma design, frontend implementation, or prototype.

## Review Output

```markdown
**Verdict**
- Score: X/10
- Release risk: low / medium / high
- Main UX issue: one sentence.

**Keep**
- Do not break these working patterns.

**Findings**
- [P0/P1/P2/P3] Issue: impact. Recommendation.

**Quick Wins**
- [ ] Highest leverage small fix.
- [ ] Second fix.
- [ ] Third fix.

**Applied Laws**
- Law: why it matters here.

**Acceptance Checks**
- Concrete condition to verify.

**Evidence Tags**
- Recommendation -> Validated / Contextual / Experimental

**Metrics**
- Primary metric(s):
- Guardrail metric(s):

**Visual Evidence**
- Screenshot, diagram, funnel, or flow reference if available.
```

## Severity

- P0: Blocks task completion, causes serious data loss, or creates a high-risk action with no recovery.
- P1: Causes major confusion, high abandonment risk, or repeated errors in a core flow.
- P2: Adds noticeable friction, cognitive load, or inconsistency but has a workaround.
- P3: Polish, clarity, consistency, or edge-case improvement.

## Score Guide

Use scoring only when it helps compare options or communicate release risk.

- 9-10: Clear task path, strong hierarchy, low error risk, polished states, and measurable confidence.
- 7-8: Usable and mostly clear, with a few fixable friction points.
- 5-6: Understandable but effortful; users must pause, compare, remember, or recover too often.
- 3-4: Core flow is unreliable or confusing for many users.
- 1-2: Users are likely blocked, misled, or exposed to serious unrecoverable errors.

Score dimensions:

- Task clarity: can users tell what this screen is for and what to do next?
- Decision load: are choices grouped, sequenced, defaulted, or explained?
- Action ergonomics: are primary actions reachable, stateful, and recoverable?
- Feedback quality: does the interface respond clearly before, during, and after action?
- Fit to expectations: does the design match familiar domain and platform patterns?
- Craft and responsiveness: does layout survive realistic desktop/mobile sizes?
- Professional UI delivery: do visual quality, accessibility, interaction states, and responsive details survive handoff?
- Foundational UX: is the experience useful, usable, findable, credible, desirable, accessible, and valuable?

## Keep / Fix / Quick Wins

- `Keep`: name the patterns that already reduce effort or build trust. This prevents redesigns from destroying useful existing behavior.
- `Fix`: list material problems sorted by P0-P3 severity, with user impact and implementation direction.
- `Quick Wins`: choose small, shippable changes with high leverage; avoid vague items like "improve visual hierarchy."

## Review Passes

### First-Use Clarity

- Can a new user identify the page purpose within a few seconds?
- Is the primary action obvious?
- Are familiar patterns used where users expect them?
- Are terms user-facing rather than implementation-facing?

Relevant laws: Jakob's Law, Mental Model, Hick's Law, Cognitive Load.

### Foundational UX Fit

- Is the experience useful, usable, findable, credible, desirable, accessible, and valuable?
- Does the review distinguish usability from broader UX value and trust?
- Are research, assumptions, and user context clear enough for the design decision?
- If the surface includes data, does the visualization support exploration, confirmation, or explanation honestly?
- If the surface is mobile, does it account for small screens, touch input, interruptions, and unstable connections?

Relevant laws: Jakob's Law, Fitts's Law, Miller's Law, Hick's Law, Postel's Law, Aesthetic-Usability Effect.

Reference: `references/ux-foundations-idf.md`.

### Visual Grouping

- Are related items closer to each other than unrelated items?
- Are groups visually clear without extra labels?
- Does responsive layout preserve relationships?
- Are same-level actions styled consistently?

Relevant laws: Proximity, Common Region, Similarity, Uniform Connectedness, Prägnanz.

### Professional UI Delivery

- Does the visual direction match the product type, audience, and task intensity?
- Are icons, typography, color, spacing, shadows, borders, and containers consistent?
- Are light and dark modes legible, especially muted text, glass surfaces, borders, and charts?
- Do hover, focus, loading, disabled, error, empty, and success states feel complete?
- Are fixed elements, sticky bars, and responsive reflow checked at realistic widths?

Relevant laws: Aesthetic-Usability Effect, Jakob's Law, Fitts's Law, Proximity, Von Restorff Effect.

Reference: `references/professional-ui-delivery.md`.

### Action Ergonomics

- Are frequent and primary controls easy to reach and large enough?
- Are destructive or high-cost actions separated from routine actions?
- Are disabled, loading, error, and success states clear?
- Does every action have feedback?

Relevant laws: Fitts's Law, Doherty Threshold, Postel's Law, Peak-End Rule.

### Agentic And Long-Task Control

- Does the interface distinguish automatic actions, status-only updates, and moments that require user choice?
- Are AI, import, sync, generation, or background tasks specific about what is happening and what changed?
- Can the user pause, cancel, resume, retry, inspect, or correct the result when meaningful?
- Are preference-sensitive, high-cost, or low-confidence decisions staged for approval instead of silently applied?
- Are status updates accessible without forcing focus changes?

Relevant laws: Doherty Threshold, Postel's Law, Zeigarnik Effect, Peak-End Rule, Goal-Gradient Effect.

Reference: `references/agentic-long-task-ux.md`.

### Decision Load

- Are users asked to choose from too many options at once?
- Are defaults, recommendations, filters, or grouping used to reduce comparison effort?
- Is advanced complexity deferred until needed?
- Does the interface preserve control while reducing effort?

Relevant laws: Hick's Law, Choice Overload, Miller's Law, Tesler's Law, Occam's Razor.

### Memory And Momentum

- Does the user need to remember information from another screen?
- Are progress, drafts, next steps, and completion states visible?
- Does the flow protect partially completed work?
- Does the ending leave the user confident about what happened?

Relevant laws: Working Memory, Zeigarnik Effect, Goal-Gradient Effect, Peak-End Rule.

### Innovation Cost

- Which convention is being changed?
- What benefit does the new pattern create after learning?
- How often will users repeat the task?
- Is there onboarding, gradual rollout, opt-out, or rollback?

Relevant laws: Jakob's Law, Learning Curve, Cognitive Load, Paradox of the Active User.

## Product Spec Pass (BuddyUp / v0-ai)

When reviewing this product, also verify against `references/buddyup-product-design-spec.md`:

- Tokens and semantic colors come from `app/globals.css` (no stray hex).
- Primary flow vocabulary is consistent: 问卷 → 匹配 → 工作台 → 文书.
- List rows use `interactive-hover` / `interactive-active`; one primary CTA per screen.
- ⌘K / ⌘B shortcuts respect input focus and `data-skip-workspace-cmdk`.
- Irreversible actions use `AlertDialog`; empty states include a next action.
- Icon-only controls have `aria-label`; clickable cards support Enter/Space.
- Guest/local storage is perceptible when data is not cloud-synced.
- New onboarding uses `data-tour` + centralized storage keys.

Run `references/design-governance-workflow.md` for full five-domain audit and PR self-check.

### Visual Evidence

- Is there a screenshot or prototype state for the issue?
- Can the finding be shown as before/after, flow, funnel, or annotated region?
- Does the visual evidence support the recommendation rather than decorate it?
- Are captions specific about the user impact?

Relevant laws: Selective Attention, Von Restorff Effect, Proximity, Common Region.

## Acceptance Checklist

- Primary action is visible, reachable, and visually dominant.
- Secondary actions are present but visually subordinate.
- Labels, controls, helper text, and errors sit near the relevant object.
- The UI avoids forcing users to compare too many choices at once.
- Foundational UX factors are considered: useful, usable, findable, credible, desirable, accessible, valuable.
- Feedback appears immediately after every important action.
- Long-running actions expose progress, preserve place, and provide pause/cancel/resume or recovery when feasible.
- Agentic decisions clarify what was automated, what needs review, and what can be corrected.
- Users can recover from mistakes through undo, edit, retry, or saved drafts.
- Responsive layouts preserve grouping and task order.
- Novel interactions have a clear user benefit and support first-time learning.
- Professional delivery checks pass: contrast, focus, touch targets, icon consistency, no layout-shifting hover, no mobile horizontal scroll.
