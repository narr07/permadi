---
name: laws-of-ux-2
description: Use when designing, reviewing, or refining UI/UX with Laws of UX plus UX foundations, professional UI delivery, BuddyUp/v0-ai product design spec, and design-governance checklists. Covers UX psychology, visual/interaction/copy/component consistency, accessibility, onboarding tours, frontend implementation, P0-P3 findings, Keep/Fix/Quick Wins, metric plans, visual evidence, 设计规范, 视觉统一, UI 审查, and acceptance checks. Trigger for UX review, UI critique, frontend review, Figma review, usability audit, product flow design, onboarding, checkout, dashboard, settings, form, IA, interaction states, cognitive load, design acceptance, and "is this easy to use?" tasks.
---

# Laws of UX

Use this skill when the user asks to follow Laws of UX, improve usability, critique a UI, design a product flow, implement a frontend, enforce **设计规范**, run **UI 审查**, align **视觉/交互一致性**, or turn UX psychology principles into concrete interface choices.

For **BuddyUp / v0-ai** work, treat this skill as the unified design authority: UX laws supply rationale; `references/buddyup-product-design-spec.md` supplies tokens, components, flows, and tours; `references/design-governance-workflow.md` supplies the mandatory audit checklist.

For agentic, AI-generation, import, sync, indexing, checkout-substitution, recommendation, or other long-running flows, read `references/agentic-long-task-ux.md`. Review the flow by decision rights: what the system may do automatically, what it must merely report, and where it should pause for user choice.

For visual design, landing pages, dashboards, admin panels, mobile-first screens, or frontend delivery quality, read `references/professional-ui-delivery.md`. Use it to choose a fit-for-purpose visual direction and to catch common UI delivery failures before handoff.

For beginner-friendly UX framing, early product discovery, usability basics, user interviews, UX research planning, mobile web fundamentals, or data-visualization reviews, read `references/ux-foundations-idf.md`. Use it to ground recommendations in plain UX fundamentals before applying sharper Laws of UX language.

This skill distills Laws of UX into a working method. Do not recite the laws unless the user asks. Apply the smallest useful set of laws to the design decision in front of you.

Treat Laws of UX as a systematic UX thinking tool: a collection of psychological and behavioral design principles for understanding user perception, cognition, attention, memory, motivation, and behavioral responses in interfaces. The goal is to turn experience into reusable product judgment.

Act as a practical UX reviewer and product designer, not a psychology lecturer. The output should help the user change a screen, ship a safer flow, or make an implementation pass.

This skill is self-iterating. After substantial use, review `references/self-iteration-workflow.md` and update `.learnings/` when the session reveals a reusable correction, product-specific UX pattern, failed recommendation, evidence gap, or missing capability. Keep logs concise and sanitized; do not store secrets, private screenshots, full transcripts, or user-sensitive details.

For proactive growth, run the daily UX research intake in `references/self-iteration-workflow.md` when asked to self-iterate, learn new UX knowledge, collect cases, or maintain this skill over time.

Use the user's taxonomy:

- Primary laws are the default decision frame. Use these first for core product, interaction, and usability calls.
- Secondary laws are diagnostic and supporting tools. Use these to explain edge cases, refine hierarchy, reduce friction, or add nuance.

## Evidence Boundaries

When applying any law, explicitly separate:

- Well-supported core claim (high confidence).
- Context-dependent interpretation (medium confidence).
- Product-specific inference you are making (assumption).

Do not present disputed numeric thresholds as universal truth. Example:

- Miller's Law should be treated as "working memory is limited; prefer chunking and recognition."
- Avoid hard-coding "7 +/- 2" as a fixed design rule. Prefer "about 3-5 chunks is often safer for active memory tasks."

## Core Workflow

1. Identify intent and task type:
   - **New design**: structure, hierarchy, interaction states, copy.
   - **UI review / 设计规范**: friction, inconsistency, spec drift, accessibility gaps.
   - **Frontend implementation**: encode decisions in layout, components, defaults, states, validation.
   - **Product flow**: reduce decision cost, improve recovery, show progress (问卷 → 匹配 → 工作台 → 文书).
2. **If scope is BuddyUp / v0-ai** (or user mentions 设计规范): read `references/buddyup-product-design-spec.md` for tokens, components, shortcuts, tours; run `references/design-governance-workflow.md` five-domain audit.
3. **If scope is visual/UI build quality**: read `references/professional-ui-delivery.md` for priority checks, style fit, accessibility, responsive, and pre-delivery rules.
4. **If scope is foundational UX, research, usability, mobile, or data visualization**: read `references/ux-foundations-idf.md`.
5. Choose **3–7 laws** from `references/laws-map.md` (Primary first, Secondary to sharpen).
6. Convert laws + product spec into interface decisions:
   - What should be visible first?
   - What should be grouped, hidden, deferred, or removed?
   - What should be default, constrained, confirmed, reversible, or automated?
   - What state must the UI communicate before, during, and after action?
7. Check against the UX acceptance checklist below **and** product spec §10–12 (experience, onboarding) when applicable.
   - For AI/agentic or long-running flows, also run `references/agentic-long-task-ux.md`.
8. Deliver in product language unless the user asked for theory.
9. Tag each major recommendation: `Validated` | `Contextual` | `Experimental`.
10. For meaningful design work, run the self-iteration pass:
   - Did any UX claim prove wrong, too broad, or unsupported?
   - Did the product context reveal a reusable design pattern?
   - Did visual/implementation verification expose a recurring failure mode?
   - Did the user request a capability the skill does not yet support?
   Log the result using `.learnings/LEARNINGS.md`, `.learnings/ERRORS.md`, or `.learnings/FEATURE_REQUESTS.md` as described in `references/self-iteration-workflow.md`.

### Design Governance Mode (设计规范 / UI 审查)

When the user wants alignment or audit (not only theory):

1. Lock scope: component / page / flow + baseline file if ambiguous.
2. Execute `references/design-governance-workflow.md` checklist in order.
3. Classify findings P0–P3; fix P0 → P1 → P2 → P3.
4. Prefer minimal diffs; remove redundant UI before adding; tokens only from `app/globals.css`.
5. Report using `templates/buddyup-design-review-template.md` or the UX review output pattern below.

## Context Protocol

Before judging a design, gather or infer the minimum useful context:

- User task: what the user is trying to finish.
- Surface: page, flow, device, and state under review.
- Goal: conversion, comprehension, speed, trust, retention, safety, or error reduction.
- Constraints: engineering, compliance, brand, accessibility, data availability, or expert-user needs.
- Evidence: screenshots, prototype, analytics, recordings, support tickets, user quotes, or implementation details.

If context is missing and the task is broad, proceed with clearly labeled assumptions instead of blocking on questions. Ask only when the missing context would change the recommendation materially.

For a specific existing product, company, law, regulation, metric benchmark, or current platform behavior that may have changed, verify with current sources before making factual claims.

## Fallback For Vague Briefs

When the user says only "make it better", "review this", "optimize UX", or "好不好用", use a fast default audit:

1. State 2-4 assumptions about user, task, and device.
2. Run the six review passes in `references/review-rubric.md`.
3. Return no more than 5 findings, sorted by severity.
4. Include 3 Quick Wins that can be implemented without redesigning the whole product.
5. Add the one metric most likely to show whether the recommendation worked.

Do not turn vague briefs into long theory dumps. Make the first answer usable.

## UX Acceptance Checklist

Before marking a UI or flow complete, verify:

- Primary action is visually obvious and placed where users naturally finish reading or scanning.
- Secondary actions are available but lower emphasis than the primary path.
- Related controls and information are grouped; unrelated items are separated.
- The screen does not ask users to compare, remember, or decide among too many options at once.
- The experience covers foundational UX factors: useful, usable, findable, credible, desirable, accessible, and valuable.
- Defaults are helpful, safe, and easy to override.
- Feedback appears immediately after user action: loading, success, error, empty, disabled, and partial states are designed.
- Long-running operations show useful progress, allow safe pause/cancel/resume when feasible, and preserve the user's place.
- Agentic or automated decisions expose what was decided, what remains uncertain, and where user confirmation is required.
- Destructive or high-cost actions are prevented, confirmed, or reversible.
- The interface uses familiar patterns for the domain unless a clear product reason justifies novelty.
- Important text is concise, concrete, and close to the thing it explains.
- Layout works at realistic desktop and mobile sizes with no overlap, truncation, or unstable controls.
- Professional UI delivery checks pass: no emoji-as-icons, no invisible light-mode glass, no layout-shifting hover, no hidden content behind fixed elements, and no mobile horizontal scroll.

## Practical Heuristics

### Reduce Choice And Memory Load

- Put the common path first, make uncommon paths available later.
- Use recognition over recall: visible labels, examples, previews, recent items, templates, and inline hints.
- Collapse advanced settings until the user demonstrates need.
- Use progressive disclosure for complex forms, dashboards, and configuration tools.

Relevant laws: Hick's Law, Miller's Law, Tesler's Law, Jakob's Law, Choice Overload, Chunking, Working Memory.

### Make Actions Feel Immediate And Recoverable

- Show instant feedback even when the real operation takes longer.
- Use optimistic UI only when failure is low-risk and recovery is clear.
- Make undo, retry, edit, and backtracking obvious for consequential actions.
- Prefer guardrails over blame-heavy error messages.
- For long-running work, distinguish status-only moments from user-choice moments; make pause, cancel, resume, and safe background continuation explicit when useful.

Relevant laws: Doherty Threshold, Peak-End Rule, Postel's Law, Zeigarnik Effect, Flow, Parkinson's Law.

### Design For Attention

- One screen should have one strongest visual priority.
- Use size, contrast, spacing, and placement to guide attention before adding explanatory text.
- Keep urgent information visually distinct from ordinary decoration.
- Avoid decorative motion or color that competes with task-critical information.

Relevant laws: Von Restorff Effect, Fitts's Law, Prägnanz, Selective Attention, Common Region.

### Align With Expectations

- Reuse platform and domain conventions for navigation, forms, filters, tables, account flows, and commerce flows.
- Put controls where users expect them, especially close to the object they affect.
- Make labels match user vocabulary, not implementation vocabulary.
- When the product must behave unexpectedly, explain before the surprise.

Relevant laws: Jakob's Law, Mental Models, Serial Position Effect, Proximity, Similarity, Cognitive Bias.

### Manage Complexity Honestly

- Do not merely hide necessary complexity; move it to the right moment.
- Break long flows into named steps with visible progress.
- Use summaries and previews before submission.
- Preserve user input when validation fails.
- Progressive disclosure should preserve orientation: hidden content needs clear triggers, nearby context, and a visible path back.

Relevant laws: Tesler's Law, Goal-Gradient Effect, Cognitive Load, Zeigarnik Effect, Pareto Principle, Occam's Razor.

### Protect User Agency In Agentic Flows

- Define the agent's decision rights before judging speed or automation quality.
- Use accessible status messages for non-blocking progress updates.
- Pause at meaningful, preference-sensitive, high-cost, or materially ambiguous choices.
- Avoid both extremes: silent automation that makes hidden decisions, and excessive confirmations that destroy flow.

Relevant laws: Postel's Law, Doherty Threshold, Zeigarnik Effect, Peak-End Rule, Goal-Gradient Effect, Mental Models.

## Output Patterns

For a UX review, use:

```markdown
**Verdict**
- Score: X/10
- Release risk: low / medium / high
- Main UX issue: one sentence.

**Keep**
- What already works and should not be broken.

**Findings**
- [Severity] Issue: impact. Recommendation.

**Quick Wins**
- [ ] Small fix with high leverage.

**Applied Laws**
- Law name: why it matters here.

**Acceptance Checks**
- What to verify in implementation.

**Evidence Tags**
- Recommendation -> Validated / Contextual / Experimental

**Metrics**
- Primary metric(s):
- Guardrail metric(s):

**Visual Evidence**
- Before/after/screenshot/flow/chart references when available.
```

For a design or implementation task, use:

```markdown
**UX Direction**
Short design rationale in product language.

**Key Decisions**
- Layout / hierarchy
- Interaction states
- Defaults and constraints
- Recovery and feedback

**Verification**
- Desktop/mobile visual check
- Interaction and state check

**Evidence Tags**
- Decision -> Validated / Contextual / Experimental
```

## Do Not Misapply The Laws

- Do not use aesthetics to justify weak IA or unclear interaction.
- Do not over-prioritize familiarity when domain risk requires explicit confirmation.
- Do not simplify away critical professional controls for expert workflows.
- Do not claim "best practice" if it conflicts with measured behavior in this product.

## Trigger Phrases

Invoke proactively when the user mentions:

- Laws of UX / usability / heuristic review
- **设计规范** / **设计规范整理** / **视觉统一** / **交互一致性**
- **UI 审查** / UI 整理 / 信息层级优化 / **无障碍检查**
- Align pages with product standards / shadcn / Notion-style UI
- self-iterate / 自我迭代 / 每天找 UX 知识和案例 / daily UX research intake

## References

| File | When to read |
|------|----------------|
| `references/laws-map.md` | Select laws or explain rationale |
| `references/ux-thinking.md` | Overall philosophy for applying laws |
| `references/review-rubric.md` | UX review severity and review passes |
| `references/design-governance-workflow.md` | 设计规范 audit, P0–P3 workflow, PR self-check |
| `references/buddyup-product-design-spec.md` | BuddyUp/v0-ai tokens, components, interaction, tours |
| `references/agentic-long-task-ux.md` | Agentic, AI-generation, import, sync, and long-running flow review |
| `references/professional-ui-delivery.md` | Professional visual UI, style-fit, frontend delivery, and pre-handoff checks |
| `references/ux-foundations-idf.md` | IDF-inspired UX fundamentals: 7 factors, usability, research, interaction design, mobile, information visualization |
| `references/cn-open-ux-notes.md` | Chinese examples and explainer framing |
| `references/metrics-mapping.md` | Tie recommendations to measurable metrics |
| `references/visual-evidence-guide.md` | Screenshots, flows, charts as evidence |
| `references/self-iteration-workflow.md` | How this skill records learnings, errors, feature gaps, and promotion candidates |
| `references/research-sources.md` | Priority sources for daily UX research intake |
| `templates/ux-review-template.md` | Generic UX review structure |
| `templates/buddyup-design-review-template.md` | BuddyUp combined law + spec review |
| `.learnings/LEARNINGS.md` | Running log of reusable UX/design-governance learnings |
| `.learnings/ERRORS.md` | Running log of failed checks, broken assumptions, and tool/verification errors |
| `.learnings/FEATURE_REQUESTS.md` | Running log of requested capabilities or missing templates |
| `examples/ecommerce-checkout-review.md` | Sample severity-tagged review |

Source basis: Laws of UX (Jon Yablonski), product design spec from BuddyUp/v0-ai codebase, and design-governance practice. Practical distillation, not verbatim copy.
