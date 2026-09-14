# Learnings

Corrections, insights, best practices, and evidence gaps captured while using this skill.

**Categories**: correction | insight | best_practice | evidence_gap

Use `references/self-iteration-workflow.md` for entry format and promotion rules.

---

## [LRN-20260702-001] insight

**Logged**: 2026-07-02T08:42:52Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Authentication UX should reduce recall and transcription work before adding new security ceremony.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Grow with Google page, accessed 2026-07-02, frames UX work around empathizing with users, prototyping, research, accessibility, and testing designs: https://grow.google/certificates/ux-design/
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple Passkeys overview and WWDC passkey guidance, accessed 2026-07-02, frame passkeys as a familiar sign-in flow using AutoFill, Face ID, or Touch ID while avoiding password creation and reuse: https://developer.apple.com/passkeys/ and https://developer.apple.com/videos/play/wwdc2022/10092/
- Source: W3C WCAG 2.2 Understanding SC 3.3.8 Accessible Authentication (Minimum), accessed 2026-07-02, says authentication should not require cognitive-function tests and must allow paste/autofill for codes when codes are used: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- Case: GOV.UK's password input gives users a show/hide control, supports autocomplete, allows copy/paste, avoids confirm-password fields, and keeps password-specific labels distinct for assistive tech: https://design-system.service.gov.uk/components/password-input/
- Pattern: For login, signup, import keys, API tokens, and local-first sync setup, support password managers and passkeys where possible, allow paste/autofill for passwords and OTPs, expose password requirements before error, provide show/hide with accessible labels, and keep recovery paths visible without leaking whether username or password failed.
- Counterexample: A visually clean auth form that blocks paste, hides requirements until submit, demands confirm-password re-entry, or forces email OTP app-switching for every login can look secure while increasing abandonment and excluding users with memory, attention, or motor constraints.
- What changed in product judgment: Reviews should treat authentication as a recovery-and-accessibility flow, not just a security gate; extra friction is only justified when it measurably reduces risk and still preserves assisted entry.
- Where this skill should apply it: login/signup, passkey upgrade prompts, browser extensions, AI memory sync, API key setup, admin dashboards, account recovery, and any flow that asks users to prove identity or enter secrets.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeatedly find blocked paste/autofill, hidden password rules, or login forms without accessible recovery.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, authentication, passkeys, password-input, accessibility, recovery
- Evidence: Validated

---

## [LRN-20260701-001] insight

**Logged**: 2026-07-01T22:05:33Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Permission requests should ask for the smallest useful access and show how users can revise the scope later.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Grow with Google page, accessed 2026-07-01, frames UX work around user-centered research, prototyping, testing, and accessibility: https://grow.google/certificates/ux-design/
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Privacy, accessed 2026-07-01, frames privacy as transparency about requested data and protection of what people allow: https://developer.apple.com/design/human-interface-guidelines/privacy
- Source: Android Developers Blog, Choosing the right storage experience, accessed 2026-07-01, describes Android 14 Selected Photos Access for granting specific images/videos instead of all media: https://android-developers.googleblog.com/2023/08/choosing-right-storage-experience.html
- Case: Android 14 media access lets users choose partial photo/video access and recommends apps handle re-selection so people can update which media the app can use.
- Pattern: Request permissions at the moment of need, explain the benefit in user language, offer partial or task-scoped access when possible, and keep a visible way to edit granted scope later.
- Counterexample: A gallery, AI memory, browser extension, or import tool that asks for broad access upfront before showing value makes the user decide under uncertainty and can look privacy-hostile even when technically legitimate.
- What changed in product judgment: Permission UX should be reviewed as a scope-negotiation flow, not a one-time modal copy problem.
- Where this skill should apply it: browser extensions, AI memory capture, file/photo imports, integrations, location features, notifications, and any product that requests access to private user data.

### Suggested Action
Keep as a daily research note; promote into privacy/agentic review guidance if future audits repeatedly find broad upfront permission requests or missing re-scope controls.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, permissions, privacy, access-scope, user-control
- Evidence: Validated

---

## [LRN-20260630-001] insight

**Logged**: 2026-06-30T08:03:35Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Search and autocomplete should teach users how to query, not only accelerate typing.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Grow with Google page, accessed 2026-06-30, frames UX work around empathizing with user needs, prototyping, research, and testing concepts early: https://grow.google/certificates/ux-design/
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Search fields, accessed 2026-06-30, was used as the platform-pattern theme for predictable search placement, clear placeholder guidance, and cancellation behavior: https://developer.apple.com/design/human-interface-guidelines/search-fields
- Source: Nielsen Norman Group, Search: Visible and Simple, accessed 2026-06-30, emphasizes making search easy to find and reducing query formulation burden: https://www.nngroup.com/articles/search-visible-and-simple/
- Case: Algolia Autocomplete's public documentation shows query suggestions based on popular searches, recent searches that help recall, multiple result types in separate sections, and keyboard navigation as an accessibility requirement: https://www.algolia.com/doc/ui-libraries/autocomplete/guides/adding-suggested-searches, https://www.algolia.com/doc/ui-libraries/autocomplete/guides/adding-recent-searches, https://www.algolia.com/doc/ui-libraries/autocomplete/guides/including-multiple-result-types, and https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/keyboard-navigation
- Pattern: For search-heavy products, show examples or scoped placeholders before input, update suggestions near the field, separate suggestions by type when useful, keep recent items editable/removable, and preserve a plain full-search path.
- Counterexample: A visually polished omnibox that mixes commands, records, filters, and AI actions without type labels can increase cognitive load because users must guess which syntax or result class the system expects.
- What changed in product judgment: Reviews should inspect whether search UI improves query formulation and result confidence, not just whether autocomplete exists.
- Where this skill should apply it: memory libraries, AI chat archives, command palettes, dashboards, ecommerce search, docs search, and any interface where users must retrieve known or half-remembered items.

### Suggested Action
Keep as a daily research note; promote into the review checklist if future audits repeatedly find hidden search, ambiguous omniboxes, or suggestions without result-type clarity.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, search, autocomplete, query-formulation, findability
- Evidence: Validated

---

## [LRN-20260626-001] insight

**Logged**: 2026-06-26T13:40:12Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Forms should reuse known information and preserve entered data; repeated entry is a UX and accessibility failure, not just minor friction.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Google certificate page, accessed 2026-06-26, frames UX work around user pain points, wireframes/prototypes, usability studies, accessibility, and iteration: https://grow.google/certificates/ux-design/
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Entering Data, accessed 2026-06-26, recommends helping people enter data efficiently and verifying values as people enter them: https://developer.apple.com/design/human-interface-guidelines/entering-data
- Source: W3C WCAG 2.2 Understanding SC 3.3.7 Redundant Entry, accessed 2026-06-26, says information already entered in the same process should be auto-populated or available to select unless re-entry is essential: https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html
- Case: GOV.UK Design System error-message guidance explicitly says not to clear any form fields after an error, keeping recovery local instead of making users retype known answers: https://design-system.service.gov.uk/components/error-message/
- Pattern: In multi-step forms, checkout, onboarding, imports, and settings, carry forward known values, expose "same as..." reuse controls, preserve partially valid input, and only ask again when freshness, security, or legal confirmation truly requires it.
- Counterexample: Asking users to retype address, passport, school, or configuration data after a validation error increases abandonment risk and disproportionately hurts users with memory, motor, fatigue, or assistive-technology constraints.
- What changed in product judgment: Form reviews should flag redundant entry and cleared fields as higher-severity failures when the system already has the data or can safely offer reuse.
- Where this skill should apply it: checkout, sign-up, study-abroad applications, profile/settings forms, AI setup flows, import wizards, and any multi-step process with repeated user data.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeatedly find repeated fields, lost form state, or missing "same as previous" controls.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, forms, redundant-entry, accessibility, recovery
- Evidence: Validated

---

## [LRN-20260619-001] insight

**Logged**: 2026-06-19T01:21:16Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Empty states should explain the situation and give the next useful action; they are not decorative blank-space fillers.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Coursera page, accessed 2026-06-19, frames UX around empathizing with users, defining pain points, prototyping, testing, accessibility, and iteration: https://www.coursera.org/professional-certificates/google-ux-design
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Tab Bars, accessed 2026-06-19, says an empty section should explain why content is unavailable: https://developer.apple.com/design/human-interface-guidelines/tab-bars
- Source: NN/g, Designing Empty States in Complex Applications, accessed 2026-06-19, recommends using empty states to communicate system status, improve learnability, and provide direct pathways for key tasks: https://www.nngroup.com/articles/empty-state-interface-design/
- Case: GitLab Pajamas treats empty states as a reusable pattern for feature adoption, learnability, and usability; it also distinguishes no-results search copy from action-oriented first-use empty states: https://design.gitlab.com/patterns/empty-states
- Pattern: For first-use, no-data, no-results, unavailable, or permission-limited states, state why the area is empty, keep one primary next action when appropriate, and avoid making the illustration or mascot carry the meaning.
- Counterexample: A polished illustration with "Nothing here yet" can still fail if users cannot tell whether the system is loading, filters are too narrow, access is missing, or setup is required.
- What changed in product judgment: Empty-state review should check diagnosis, actionability, and copy specificity before judging visual polish.
- Where this skill should apply it: dashboards, tables, search/filter results, onboarding setup, permissions, import/indexing, AI memory inboxes, and product areas with sparse early user data.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeatedly find blank dashboards, unclear no-results screens, or decorative empty states without recovery paths.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, empty-states, learnability, system-status, onboarding
- Evidence: Validated

---

## [LRN-20260621-001] insight

**Logged**: 2026-06-21T01:32:03Z
**Priority**: medium
**Status**: pending
**Area**: copy

### Summary
Validation errors should preserve the user's work, identify the exact field, and say how to fix the input.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; Google's public certificate page, accessed 2026-06-21, emphasizes personas, journey maps, usability studies, prototypes, testing, and iteration: https://grow.google/certificates/ux-design/
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Entering Data, accessed 2026-06-21, recommends verifying values as people enter them and giving feedback when a problem is detected: https://developer.apple.com/design/human-interface-guidelines/entering-data
- Source: W3C WCAG 2.2 Understanding SC 3.3.1 Error Identification and SC 3.3.3 Error Suggestion, accessed 2026-06-21, require text identification of detected input errors and correction suggestions when known: https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html and https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html
- Case: GOV.UK Design System places error messages next to the relevant field and in an error summary, visually connects the message to the question, and explicitly says not to clear any form fields after an error: https://design-system.service.gov.uk/components/error-message/
- Pattern: Keep valid and invalid answers in place, put specific text beside the field, mirror the field label in the message, summarize page-level errors when needed, and avoid blame, jargon, or "invalid" labels without a repair instruction.
- Counterexample: A red border plus "Invalid input" after submit forces users to search, remember their previous answer, and guess the acceptable format; validating while the user is still typing can also feel punitive for fields like email or dates.
- What changed in product judgment: Error review should check recovery cost and accessibility before judging whether the message is visually prominent enough.
- Where this skill should apply it: sign-up, checkout, study-abroad forms, settings, imports, filters, AI setup prompts, and any flow where user-entered data can fail validation.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeatedly find vague validation copy, cleared fields, or inaccessible error summaries.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, validation, error-messages, accessibility, form-ux
- Evidence: Validated

---

## [LRN-20260603-001] best_practice

**Logged**: 2026-06-03T00:17:26Z
**Priority**: medium
**Status**: promoted
**Area**: governance

### Summary
A skill-level self-iteration system should start as explicit behavior plus local logs, not heavy automation.

### Details
For a UX/design skill, the useful minimum loop is: make `SKILL.md` tell agents when to reflect, provide `.learnings/` files for learnings/errors/feature requests, and document a promotion path from repeated logs back into `SKILL.md`, `references/`, `templates/`, or `examples/`.

### Suggested Action
Keep future self-iteration additions small until a pattern repeats in real design work.

### Metadata
- Source: implementation
- Related Files: SKILL.md, references/self-iteration-workflow.md, README.md
- Tags: self-iteration, skill-governance, local-first
- Evidence: Contextual

---

## [LRN-20260603-002] insight

**Logged**: 2026-06-03T01:11:44Z
**Priority**: medium
**Status**: promoted
**Area**: interaction

### Summary
Progress feedback should move from "the app is busy" to "the user can judge, wait, pause, cancel, or continue elsewhere."

### Details
- Source: Google UX Design Professional Certificate public Coursera page, accessed 2026-06-03, frames UX work as empathize/define/ideate/prototype/test and includes usability studies, accessibility, and iteration: https://www.coursera.org/professional-certificates/google-ux-design
- Source: Apple Human Interface Guidelines, Progress indicators, accessed 2026-06-03, says determinate indicators are preferable when duration is knowable, progress should remain accurate and moving, descriptions should be concrete, and pause/cancel should appear when interruption is feasible: https://developer.apple.com/design/human-interface-guidelines/progress-indicators
- Source: Apple Human Interface Guidelines, Loading, change log includes June 9, 2025 guidance revision for storing downloads and large background assets: https://developer.apple.com/design/human-interface-guidelines/loading
- Case: Apple's Mail refresh control pattern keeps the refresh affordance near the content being updated and can show value-adding context like last update time; this is better than forcing users to initiate every refresh manually.
- Pattern: Use a stable progress location plus a determinate bar/ring once scope is knowable; pair long operations with concise task-specific copy and Pause/Cancel when safe.
- Counterexample: A spinner that sits still, switches shape mid-task, or says only "Loading..." gives no estimate and can feel stalled or deceptive, especially if the final percent takes much longer than the early percent.
- What changed in product judgment: In UX reviews, loading states should be judged as decision-supporting controls, not just visual reassurance.
- Where this skill should apply it: imports, file conversion, AI generation, onboarding setup, search/indexing, background sync, and any flow where waiting blocks the next user decision.

### Suggested Action
Promoted into `SKILL.md`, `references/review-rubric.md`, `references/design-governance-workflow.md`, and `references/agentic-long-task-ux.md` as long-task progress and recovery checks.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, progress-feedback, apple-hig, google-ux
- Evidence: Validated

---

## [LRN-20260610-001] insight

**Logged**: 2026-06-10T12:22:58Z
**Priority**: high
**Status**: promoted
**Area**: interaction

### Summary
Agentic and long-running interfaces should pause at meaningful choice points, not only report that work is happening.

### Details
- Source: Google UX Design Professional Certificate public Coursera page, accessed 2026-06-10, frames UX as empathize, define, ideate, prototype, test, and iteration around user pain points: https://www.coursera.org/professional-certificates/google-ux-design
- Source: W3C WCAG 2.2 Understanding SC 4.1.3 Status Messages, accessed 2026-06-10, requires important non-focus status changes to be programmatically determinable without unnecessarily interrupting work: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- Source: Nielsen Norman Group, Response Times: The 3 Important Limits, accessed 2026-06-10, recommends feedback and interruptibility for operations that exceed attention limits: https://www.nngroup.com/articles/response-times-3-important-limits/
- Source: Morae: Proactively Pausing UI Agents for User Choices, ACM UIST 2025 / arXiv, accessed 2026-06-10, shows a mixed-initiative UI agent pausing during real web tasks so blind and low-vision users can choose among meaningful alternatives: https://arxiv.org/abs/2508.21456
- Case: In Morae's shopping example, an agent asked to buy the cheapest sparkling water picked one automatically, missing user-relevant alternatives such as flavor and rating; the improved pattern pauses when options are materially equivalent or preference-sensitive.
- Pattern: For AI agents, imports, checkout, search, matching, or setup flows, classify status moments into "inform only" versus "needs user choice"; use accessible status messages for the former and explicit pause/resume choice surfaces for the latter.
- Counterexample: Treating every intermediate uncertainty as either silent automation or a blocking modal can both fail: silent automation reduces agency, while excessive confirmation destroys flow.
- What changed in product judgment: UX reviews should evaluate automation by decision rights, not just task completion speed.
- Where this skill should apply it: agent-memory tools, browser extensions, AI generation, recommendation/matching flows, checkout substitutions, and any interface that acts on behalf of users.

### Suggested Action
Promoted into `SKILL.md`, `references/review-rubric.md`, `references/design-governance-workflow.md`, and `references/agentic-long-task-ux.md` as a decision-rights model for agentic flows.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, agentic-ux, accessibility, status-messages, user-agency
- Evidence: Contextual

---

## [LRN-20260614-001] insight

**Logged**: 2026-06-14T01:54:48Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Progressive disclosure should preserve orientation and decision context, not merely hide complexity.

### Details
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Disclosure Controls, accessed 2026-06-14, frames disclosure controls as reveal/hide mechanisms for related information or functionality: https://developer.apple.com/design/human-interface-guidelines/disclosure-controls
- Source: Google UX Design Certificate public Google page, accessed 2026-06-14, emphasizes user-centered foundations, wireframes/prototypes, usability studies, and test-and-iterate practice: https://grow.google/certificates/ux-design/
- Source: NN/g, Few Guesses, More Success: 4 Principles to Reduce Cognitive Load in Forms, accessed 2026-06-14, recommends showing only what is relevant at the current step while making requirements and progress transparent: https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/
- Case: Shopify Polaris IA uses "one home and many doors" for Help Center content: shipping help lives in one canonical place, but contextual links from admin settings give merchants access when the extra context becomes relevant: https://polaris-react.shopify.com/foundations/information-architecture
- Pattern: Keep the primary path visible, reveal secondary details near the object they explain, use descriptive icon+text triggers, and maintain breadcrumbs/progress/context so the user knows where the hidden detail fits.
- Counterexample: GitHub Primer cautions that disclosure should be used sparingly and should not disorient the user's initial focus; GitLab Pajamas warns that three or more nested disclosure levels can signal that the feature itself is too complex: https://primer.style/product/ui-patterns/progressive-disclosure/ and https://design.gitlab.com/patterns/progressive-disclosure/
- What changed in product judgment: In reviews, collapses, accordions, "more" menus, and step flows should be judged by orientation and recoverability, not by screen cleanliness alone.
- Where this skill should apply it: long forms, settings, filters, dashboards, onboarding, help links, AI/agent setup, and dense product-admin workflows.

### Suggested Action
Keep as a daily research note; promote if future reviews repeatedly find hidden controls, nested accordions, or "clean" screens that lose user context.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, progressive-disclosure, information-architecture, apple-hig, google-ux
- Evidence: Validated

---

## [LRN-20260616-001] insight

**Logged**: 2026-06-16T01:38:15Z
**Priority**: medium
**Status**: pending
**Area**: accessibility

### Summary
Tap-target quality is about the whole activation area and spacing, not the visible icon size.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Coursera page, accessed 2026-06-16, frames UX foundations around user-centered design, accessibility, equity-focused design, research, prototyping, and usability testing: https://www.coursera.org/professional-certificates/google-ux-design
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Buttons, accessed 2026-06-16, recommends a hit region of at least 44x44 pt for buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
- Source: W3C WCAG 2.2 Understanding SC 2.5.8 Target Size (Minimum), accessed 2026-06-16, sets a 24x24 CSS pixel AA floor or sufficient spacing for pointer targets: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Source: Material Design 3 Touch Targets, accessed 2026-06-16, recommends touch targets of at least 48x48dp for most platforms: https://m3.material.io/foundations/designing/structure
- Case: Baymard's promoted-filter research shows mobile product-list filters can reduce trips into a separate filter panel, but only if chips and remove/apply controls remain easy to hit and are still available in their normal filter location: https://baymard.com/blog/promoting-product-filters
- Pattern: In dense mobile toolbars, filter chips, card actions, and inline icon buttons, inspect the tappable box and neighbor spacing separately from the visual glyph; allow invisible padding when visual density matters.
- Counterexample: A row of tiny close icons on selected filters can look clean but makes accidental filter removal likely, especially one-handed or on moving transport.
- What changed in product judgment: In reviews, Fitts's Law should be checked as a measurable target/spacing issue before praising compact visual hierarchy.
- Where this skill should apply it: mobile filters, chip rows, icon-only buttons, carousels, table row actions, quick actions, and any control cluster near screen edges.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeat small icon-only controls or crowded chip rows.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, accessibility, target-size, fitts-law, mobile-filters
- Evidence: Validated

---

## [LRN-20260616-002] best_practice

**Logged**: 2026-06-16T08:08:15Z
**Priority**: high
**Status**: promoted
**Area**: implementation

### Summary
External UI/UX checklist skills should be absorbed as repo-local review references, not copied with unusable tool paths.

### Details
The attached `ui-ux-pro-max` draft contributed a useful professional UI delivery priority order: accessibility, touch/interaction, performance, responsive layout, typography/color, animation, style fit, and charts/data. Its `.claude/skills/.../scripts/search.py` workflow does not exist in this repo, so the reusable value is the static delivery checklist and pre-handoff quality bar, not the unavailable CLI.

### Suggested Action
Promoted into `SKILL.md`, `references/professional-ui-delivery.md`, `references/review-rubric.md`, `references/design-governance-workflow.md`, `templates/ux-review-template.md`, and `README.md`.

### Metadata
- Source: user_request
- Related Files: SKILL.md, references/professional-ui-delivery.md, references/review-rubric.md, references/design-governance-workflow.md, templates/ux-review-template.md, README.md
- Tags: ui-delivery, visual-quality, accessibility, responsive, professional-ui
- Evidence: Contextual

---

## [LRN-20260617-002] best_practice

**Logged**: 2026-06-17T02:34:09Z
**Priority**: medium
**Status**: promoted
**Area**: ux-law

### Summary
Beginner UX source material should become a compact foundations checklist, not a long book summary.

### Details
The local Interaction Design Foundation PDF covers UX definition, design thinking, Morville's seven UX factors, usability, interviews, research techniques, interaction design, mobile web, and information visualization. The reusable skill value is a beginner-friendly diagnostic layer that can explain UX basics to nontechnical collaborators before applying specific Laws of UX.

### Suggested Action
Promoted into `references/ux-foundations-idf.md`, `SKILL.md`, `references/review-rubric.md`, and `README.md`.

### Metadata
- Source: research
- Related Files: references/ux-foundations-idf.md, SKILL.md, references/review-rubric.md, README.md
- Tags: idf, ux-foundations, usability, research, mobile-ux, information-visualization
- Evidence: Contextual

---

## [LRN-20260617-001] insight

**Logged**: 2026-06-17T02:00:06Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Destructive-action UX should match the recovery model: prevent irreversible harm, but prefer lightweight undo when recovery is reliable.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Coursera page, accessed 2026-06-17, emphasizes testing, iteration, accessibility, and user pain points in the design process: https://www.coursera.org/professional-certificates/google-ux-design
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Alerts, accessed 2026-06-17, says destructive alerts need a clear safe Cancel path: https://developer.apple.com/design/human-interface-guidelines/alerts
- Source: Nielsen Norman Group, Error Prevention, accessed 2026-06-17, frames prevention as designing systems so slips and mistakes are less likely before they happen: https://www.nngroup.com/articles/error-prevention/
- Source: Material Design 3 Snackbars, accessed 2026-06-17, supports brief feedback with optional actions such as undo/retry when the task can continue without a blocking dialog: https://m3.material.io/components/snackbar/guidelines
- Case: Shopify Polaris common actions separates delete from ordinary actions, uses destructive styling, places delete at the bottom of action lists, and warns against ambiguous "x" icons for deletion: https://polaris-react.shopify.com/patterns/common-actions
- Pattern: For delete/archive/remove flows, first classify reversibility. If the action is hard to undo, use explicit destructive styling, specific object names, and a safe Cancel path. If the action is reliably reversible, use immediate feedback plus Undo near the affected context instead of adding modal friction.
- Counterexample: A generic "Are you sure?" dialog before every low-risk remove action teaches users to click through confirmations, while a snackbar undo for permanent account deletion under-protects the user.
- What changed in product judgment: In reviews, confirmation dialogs should not be judged as automatically safer; the safer pattern depends on reversibility, consequence, and whether the UI can preserve recovery state.
- Where this skill should apply it: bulk deletes, archive/remove actions, filter-chip removal, account/settings changes, AI-generated content replacement, and any workflow where user work can be lost.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeatedly confuse confirmation, undo, and destructive styling.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, destructive-actions, error-prevention, undo, recovery
- Evidence: Validated

---

## [LRN-20260627-001] insight

**Logged**: 2026-06-27T08:03:57Z
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Back, close, and cancel controls should preserve orientation by making the return destination and recovery cost predictable.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Grow with Google page, accessed 2026-06-27, frames UX work around empathizing with needs, journey maps, wireframes/prototypes, UX research, and testing early concepts: https://grow.google/certificates/ux-design/
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG / WWDC navigation guidance, accessed 2026-06-27, emphasizes familiar navigation structures, hierarchy, modality, standard Back/Close controls, and preventing unnecessary confusion: https://developer.apple.com/videos/play/wwdc2022/10001/ and https://developer.apple.com/design/human-interface-guidelines/toolbars
- Source: Android Developers Predictive Back, accessed 2026-06-27 and last updated 2026-06-18, lets users preview where a back swipe will take them and recommends moving custom back handling to supported callbacks: https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture
- Source: Nielsen Norman Group, User Control and Freedom, accessed 2026-06-27, says users need a clear exit from unwanted states plus undo/redo for recovery: https://www.nngroup.com/articles/user-control-and-freedom/
- Case: Baymard's ecommerce research found common overlays, filtering/sorting, accordion checkout, and product-list return patterns can violate browser Back expectations; the 2020 benchmark reported 59% of ecommerce sites missed at least one core Back expectation: https://baymard.com/blog/back-button-expectations
- Pattern: Treat Back/Close/Cancel as a contract: label or animate the destination when possible, preserve list/filter/form state, warn only when recovery cost is real, and test platform back gestures in addition to visible buttons.
- Counterexample: A polished modal, filter drawer, or custom single-page transition can look simple but break the user's mental model if Back skips the expected intermediate state or discards entered work.
- What changed in product judgment: Reviews should inspect the navigation stack and state restoration, not just whether a visible back button exists.
- Where this skill should apply it: mobile apps, modals/sheets, filters, search result pages, checkout accordions, multi-step forms, AI setup flows, and any custom router or overlay.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeatedly find broken back-stack behavior, lost list position, or ambiguous close/cancel exits.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, navigation, back-button, recovery, user-control
- Evidence: Validated

---

## [LRN-20260628-001] best_practice

**Logged**: 2026-06-28T22:31:17Z
**Priority**: high
**Status**: pending
**Area**: governance

### Summary
Agentic/local-first dashboard reviews should verify the real core workflow and mobile first viewport before ranking UX findings.

### Details
A review of a local AI todo/memory workbench became sharper only after opening the running viewer at desktop and 390px mobile sizes. The first screenshot showed that the desktop dashboard was clean, but the mobile top navigation overflowed and the core "todo review" path was weaker than the generic dashboard stats. For agentic tools, judge the action loop first: capture/source -> extract/organize -> review evidence -> decide/complete. Do not let a polished overview screen hide weak empty states, unclear AI-generated labels, or missing next-step actions.

### Suggested Action
For future UX reviews of AI agents, memory tools, todo extractors, or local-first workbenches, start with three checks: real running product, mobile first viewport, and the primary decision loop. Then label recommendations as visual evidence, source/code evidence, or product inference.

### Metadata
- Source: visual_check
- Related Files: references/self-iteration-workflow.md
- Tags: agentic-ux, local-first, dashboard, mobile, evidence, todo-review
- Evidence: Contextual

---

## [LRN-20260629-001] insight

**Logged**: 2026-06-29T00:30:58+01:00
**Priority**: high
**Status**: pending
**Area**: visual-design

### Summary
For nontechnical AI workbench UIs, prefer recognizable icons for repeat actions and status, while keeping text only where recognition would otherwise fail.

### Details
During AI Todo viewer iteration, the Settings panel initially used many English text controls and small explanatory copy. User feedback clarified that the product should reduce English visual weight: close, save, status, grouping, refresh, field categories, and repeated actions should use familiar icon affordances when possible. However, form field labels still need concise text because icon-only configuration fields create recall burden and ambiguity. The practical rule is icon-first for repeated commands and states, icon-plus-label for primary or consequential actions, and text labels for fields whose meaning is not universally recognizable.

### Suggested Action
Promote this into future UI review checks for AI Todo, Agentmemory, and local-first agent workbenches: scan every button/status/filter and ask whether a familiar icon can carry the recognition load without turning the UI into a guessing game.

### Metadata
- Source: user_feedback
- Related Files: /Users/szn/记忆/AI-Todo/src/viewer/parts/app/60-actions-todo.js, /Users/szn/记忆/AI-Todo/src/viewer/parts/style/70-legacy-crystal-modal-settings-timeline.css
- Tags: icon-first, nontechnical-ui, settings, ai-workbench, visual-hierarchy
- Evidence: Contextual

---

## [LRN-20260629-002] insight

**Logged**: 2026-06-29T09:17:24+01:00
**Priority**: medium
**Status**: pending
**Area**: interaction

### Summary
Binary settings need explicit state, scope, and consequence; a polished switch is not enough.

### Details
- Source: Google UX Design Professional Certificate private Notion source was treated as an inaccessible theme; the public Grow with Google page, accessed 2026-06-29, frames UX design around empathizing with users, prototyping, research, and testing design decisions: https://grow.google/certificates/ux-design/
- Source: Apple Design private Notion source was treated as an inaccessible theme; Apple HIG Toggles, accessed 2026-06-29, was used as the platform-pattern theme but could not be read directly in the CLI because the page requires JavaScript: https://developer.apple.com/design/human-interface-guidelines/toggles
- Source: W3C WCAG 2.2 Understanding SC 1.4.1 Use of Color, accessed 2026-06-29, requires meaning to be conveyed with more than color alone: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- Case: GitHub Primer's ToggleSwitch component requires an accessible label, supports On/Off text, loading state, custom contextual labels, and screen-reader loading announcements; Material Web's switch docs require labels or aria labels and support icons to emphasize selected state: https://primer.style/product/components/toggle-switch/ and https://material-web.dev/components/switch/
- Pattern: For switches in settings, permissions, privacy, sync, AI automation, and notifications, pair the control with a concrete label, visible state text or icon, nearby consequence copy when impact is not obvious, disabled/loading feedback, and an accessible programmatic label.
- Counterexample: A row of unlabeled color-only switches can look minimal but force users to infer whether the label describes the current state, the action after tap, or the setting scope.
- What changed in product judgment: Reviews should inspect switch semantics before praising visual polish: is this truly immediate and binary, is the state visible without color, and does the user know what object or workflow changes?
- Where this skill should apply it: settings panels, notification preferences, sync/import controls, AI-agent autonomy levels, permission gates, privacy toggles, and feature flags.

### Suggested Action
Keep as a daily research note; promote into the acceptance checklist if future reviews repeatedly find ambiguous toggles, color-only states, or switches used for non-immediate decisions.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md, references/research-sources.md
- Tags: daily-intake, ux-research, toggles, settings, accessibility, state-visibility
- Evidence: Validated

---
