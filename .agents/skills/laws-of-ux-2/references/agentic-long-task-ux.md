# Agentic And Long-Task UX

Use this reference when reviewing AI agents, AI generation, imports, sync, indexing, recommendations, checkout substitutions, setup flows, background jobs, or any interface that acts on behalf of the user or keeps the user waiting.

The central question is not "is the system fast?" It is: can the user understand what is happening, keep agency over meaningful choices, and recover when the system is wrong?

## Decision-Rights Model

Classify each system action before recommending UI:

| Moment | System role | UX pattern |
|---|---|---|
| Routine, low-risk, reversible | Act automatically | Inline status, undo or edit, concise completion summary |
| Slow but predictable | Report progress | Determinate progress when possible, specific copy, safe background continuation |
| Preference-sensitive | Pause for choice | Compare options, explain tradeoffs, remember user preference when appropriate |
| High-cost or destructive | Ask confirmation | Preview impact, require explicit confirm, provide cancel/recovery |
| Ambiguous or low-confidence | Ask or stage result | Show draft/recommendation, let user approve or refine |
| Failed or partially complete | Help recovery | Show what succeeded, what failed, retry path, preserved inputs |

## Review Pass

- Is the user's goal and current phase visible without reading a log?
- Does status copy say what is happening, not just "loading" or "working"?
- Is progress determinate when scope is knowable, or honestly indeterminate when it is not?
- Can the user pause, cancel, resume, or continue elsewhere when waiting is meaningful?
- Are preference-sensitive decisions paused instead of silently decided?
- Are routine decisions summarized after automation so the user can inspect and correct them?
- Are failures recoverable without losing the user's prior work?
- Are status changes accessible without stealing focus unnecessarily?
- Does the final state answer: what happened, what changed, and what should I do next?

## Patterns To Reuse

- Use a stable progress region near the object being changed.
- Pair progress with concrete verbs: "Importing 42 files", "Checking duplicates", "Generating 3 variants".
- Use staged results for AI output: draft, preview, approve, apply.
- Add a lightweight activity summary for background work.
- Let users set durable preferences after repeated choices, but keep them editable.
- Separate "Stop now" from "Discard everything" when cancellation can preserve partial work.

## Anti-Patterns

- A spinner with no task-specific context.
- Percent complete that moves quickly at first and stalls near the end.
- Blocking modals for every low-risk uncertainty.
- Silent automation for flavor, price, destination, recipient, privacy, billing, or deletion choices.
- Hiding long-task progress in a global toast that disappears before the task ends.
- Saying "done" without explaining partial failures or next steps.

## Evidence Tags

- `Validated`: supported by direct usability evidence, accessibility guidance, or observed product behavior.
- `Contextual`: likely useful, but depends on domain risk, task frequency, and user expertise.
- `Experimental`: worth prototyping or A/B testing before making a default.

## Metrics

- Primary: task completion rate, successful recovery rate, time to next meaningful action, approval/apply rate for staged outputs.
- Guardrail: cancellation rate, undo/edit rate, repeated confirmation fatigue, support tickets about "what happened", accessibility status-message issues.
