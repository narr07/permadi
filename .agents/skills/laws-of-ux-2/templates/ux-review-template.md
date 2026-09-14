# UX Review Template (Reusable)

Use this template when running a structured UX review.

## Input Block

- Product/page:
- Target users:
- Core task:
- Device context:
- Constraints (time, engineering, compliance):
- Known business goal:
- Known pain points:
- Available evidence (analytics, recordings, interviews):
- Existing patterns to preserve:
- Release decision needed:

## Output Block

```markdown
**Scope**
- Reviewed surface:
- User task:
- Constraints:
- Assumptions:

**Verdict**
- Score:
- Release risk:
- Main UX issue:

**Keep**
- Pattern:
- Why it helps:

**Findings**
- [P0/P1/P2/P3] Issue: user impact. Recommendation. (Evidence: metric/observation/screenshot)

**Quick Wins**
- [ ] Fix:
- [ ] Fix:
- [ ] Fix:

**Applied Laws**
- Law -> why it applies here -> what changed in the recommendation

**Tradeoffs**
- Benefit:
- Cost:
- Risk:

**Acceptance Checks**
- Check: expected behavior and pass condition
- Long task / agentic check if relevant: progress, pause/cancel/resume, recovery, and user decision boundary
- Professional UI check if relevant: contrast, focus, touch targets, icon consistency, responsive layout, and no layout-shifting hover

**Evidence Tags**
- Recommendation -> Validated / Contextual / Experimental

**Metrics**
- Primary metric(s):
- Guardrail metric(s):
- Instrumentation needed:

**Visual Evidence**
- Before image:
- After image:
- Optional support visual (heatmap/funnel/flow):
- Caption(s):

**Experiment Plan (if needed)**
- Hypothesis:
- Variant:
- Success metric:
- Guardrail metric:
```
