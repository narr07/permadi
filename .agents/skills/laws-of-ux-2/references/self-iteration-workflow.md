# Self-Iteration Workflow

This skill improves by turning real design work into small, reusable learnings. The goal is not to log everything. The goal is to preserve the moments where the skill became more accurate, more useful, or more product-aware.

## When To Log

Log only when a session reveals something reusable:

- A UX law was applied too broadly, incorrectly, or with weak evidence.
- A recommendation changed after visual inspection, user feedback, or implementation.
- A recurring UI failure appeared: overlap, unclear hierarchy, missing state, inaccessible contrast, confusing copy, unstable layout, or inconsistent component use.
- A product-specific pattern emerged, especially for BuddyUp, v0-ai, study-abroad workflows, dashboards, forms, onboarding, or agent-memory tools.
- A tool, screenshot, browser check, or build verification failed in a way future agents should know.
- The user requested a new review mode, template, checklist, metric mapping, or output format.

Skip logging if the observation is one-off, private, obvious, or already captured.

## Where To Log

Use the files in `.learnings/`:

- `LEARNINGS.md` for corrections, insights, best practices, and evidence refinements.
- `ERRORS.md` for failed checks, broken assumptions, tool failures, or verification issues.
- `FEATURE_REQUESTS.md` for requested capabilities, missing templates, and future extensions.

Keep entries short. Redact sensitive project details. Link to public or local repo paths only when useful.

## Learning Entry Format

Append to `.learnings/LEARNINGS.md`:

```markdown
## [LRN-YYYYMMDD-XXX] category

**Logged**: ISO-8601 timestamp
**Priority**: low | medium | high | critical
**Status**: pending
**Area**: ux-law | visual-design | interaction | accessibility | copy | governance | implementation

### Summary
One-line reusable lesson.

### Details
What changed in the design judgment, and why.

### Suggested Action
How to update the skill, checklist, template, or future behavior.

### Metadata
- Source: user_feedback | visual_check | implementation | review | research
- Related Files: path/to/file
- Tags: tag1, tag2
- Evidence: Validated | Contextual | Experimental

---
```

Use categories:

- `correction`: the skill or agent got something wrong.
- `insight`: a useful product/design pattern appeared.
- `best_practice`: a repeatable workflow improved the result.
- `evidence_gap`: a recommendation needs stronger evidence or better verification.

## Error Entry Format

Append to `.learnings/ERRORS.md`:

```markdown
## [ERR-YYYYMMDD-XXX] short-name

**Logged**: ISO-8601 timestamp
**Priority**: low | medium | high | critical
**Status**: pending
**Area**: browser | build | screenshot | accessibility | design-review | repo

### Summary
What failed.

### Context
- Operation attempted:
- Expected:
- Actual:

### Suggested Fix
What future agents should try first.

### Metadata
- Reproducible: yes | no | unknown
- Related Files: path/to/file

---
```

## Feature Request Format

Append to `.learnings/FEATURE_REQUESTS.md`:

```markdown
## [REQ-YYYYMMDD-XXX] capability-name

**Logged**: ISO-8601 timestamp
**Priority**: low | medium | high | critical
**Status**: pending
**Area**: template | review-mode | metrics | automation | examples | references

### Summary
Requested capability.

### Use Case
When this would help.

### Suggested Shape
File, checklist, template, or workflow to add.

### Metadata
- Source: user_request | recurring_gap | review
- Related Files: path/to/file

---
```

## Promotion Loop

During repo maintenance, scan `.learnings/` and promote mature items:

1. Merge repeated lessons into `SKILL.md` if they change default behavior.
2. Add detailed procedures to `references/` when they are too long for the skill entrypoint.
3. Add review output structures to `templates/`.
4. Add worked examples to `examples/`.
5. Close or update the original learning entry with a short note.

Promote only when the pattern is stable enough to help future work. Keep experimental ideas in `.learnings/` until they repeat.

## Daily UX Research Intake

Use this loop for proactive self-iteration, especially from a daily automation.

Before searching broadly, read `references/research-sources.md` and prioritize the user-specified learning sources listed there. If a source is private or inaccessible, do not infer its private contents; use the source title as a theme and supplement with public, durable references.

### Search Targets

Each run should gather a small, high-signal set of fresh or useful material:

- 1 UX principle, research note, or psychology concept that can improve product judgment.
- 1 product/interface case study, teardown, or release note with concrete UI decisions.
- 1 visual or interaction pattern worth reusing, avoiding, or testing.
- Optional: 1 counterexample where a common UX law was misused or did not fit the context.

Prefer primary or durable sources when possible: product changelogs, design system docs, official accessibility guidance, Nielsen Norman Group, Baymard, W3C/WCAG, platform HIG/Material guidance, public postmortems, and well-documented case studies. For trend-driven examples, include the date and source.

### Daily Output

Append a short entry to `.learnings/LEARNINGS.md` using this shape:

```markdown
## [LRN-YYYYMMDD-XXX] insight

**Logged**: ISO-8601 timestamp
**Priority**: low | medium | high
**Status**: pending
**Area**: ux-law | visual-design | interaction | accessibility | copy | governance | implementation

### Summary
One useful UX lesson from today's research.

### Details
- Source:
- Case:
- What changed in product judgment:
- Where this skill should apply it:

### Suggested Action
Keep, test in a future review, or promote into a specific file.

### Metadata
- Source: research
- Related Files: references/self-iteration-workflow.md
- Tags: daily-intake, ux-research
- Evidence: Validated | Contextual | Experimental

---
```

Keep the daily note compact. Do not dump full articles. Save the source link, the product lesson, and the exact way it should change future UX reviews.

### Weekly Promotion

Once a week, scan the daily entries:

1. Promote repeated lessons into `SKILL.md` if they change default behavior.
2. Add richer reusable knowledge to `references/`.
3. Add a worked teardown to `examples/` if a case is especially clear.
4. Update `templates/` if the research implies a better review output.
5. Mark promoted learning entries as `Status: promoted`.

Do not promote every daily item. The skill should get sharper, not heavier.

## Quick Self-Review Questions

At the end of a substantial review or implementation, ask:

- Did the strongest recommendation come from evidence, or from taste?
- Did the output separate validated principles from contextual assumptions?
- Did visual verification change the recommendation?
- Did the user use a phrase or workflow this skill should recognize next time?
- Would a future agent benefit from one sentence about what happened?

If the answer to the last question is yes, log it.
