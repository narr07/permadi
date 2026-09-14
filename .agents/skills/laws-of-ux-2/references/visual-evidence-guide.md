# Visual Evidence Guide

Use visuals whenever they can reduce ambiguity or improve persuasion.

## When Images Are Required

- UI review findings with layout, hierarchy, spacing, or affordance issues.
- Interaction/state issues (loading, disabled, error, success, empty).
- Flow-level friction across multiple screens.
- Any recommendation likely to be debated by stakeholders.

## Recommended Visual Set

- Before screenshot: mark the issue area.
- After mockup or annotated suggestion: show the proposed change.
- Optional supporting visual:
  - Click/attention heatmap
  - Funnel step chart
  - Task flow diagram

## Minimum Annotation Rules

- Every image needs:
  - title
  - what to look at
  - why it matters
- Use numbered callouts for 2+ issues on one screen.
- Keep one image focused on one main finding when possible.

## Caption Format

```markdown
![Figure X - short title](/absolute/path/to/image.png)
Figure X. What changed, expected user impact, and related law.
```

## Pairing Visuals With Findings

- P0/P1 findings: strongly recommended to include before/after visuals.
- P2 findings: include visuals when issue is spatial or state-based.
- P3 findings: visuals optional unless requested.
