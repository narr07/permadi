# Example: E-commerce Checkout UX Review

## Context

- Surface: mobile checkout page
- Task: complete payment
- Pain points: high abandonment on shipping step

## Verdict

- Score: 6.8/10
- Release risk: medium
- Main UX issue: the shipping step asks users to compare too many options before they can continue.

## Keep

- The checkout sequence follows a familiar cart -> shipping -> payment -> confirmation order.
- Required address and payment fields are separated enough to preserve task structure.

## Findings

- [P1] Too many shipping options shown at once creates decision paralysis.
  - Recommendation: show one recommended option + "view all methods."
  - Laws: Hick's Law, Choice Overload.
  - Tag: `Validated`

- [P1] Pay button is visually weak and below fold on small screens.
  - Recommendation: sticky primary CTA in thumb zone.
  - Laws: Fitts's Law, Selective Attention.
  - Tag: `Validated`

- [P2] Coupon, points, invoice settings are mixed with required fields.
  - Recommendation: collapse optional settings under "Advanced payment options."
  - Laws: Tesler's Law, Cognitive Load.
  - Tag: `Contextual`

## Quick Wins

- [ ] Default to the recommended shipping method and move alternatives behind "view all methods."
- [ ] Add a sticky mobile pay CTA once required fields are valid.
- [ ] Collapse coupon, points, and invoice controls into one optional section.

## Acceptance Checks

- Checkout completion rate increases without higher refund/dispute rates.
- Median time from shipping step to payment confirmation decreases.
- Repeated tap rate on pay CTA decreases.
- Users can still switch shipping methods after accepting the recommendation.
- Sticky CTA remains visible and non-overlapping at 390px mobile width.

## Metrics

- Primary: shipping-step completion rate, checkout completion rate, median time to payment confirmation.
- Guardrail: refund/dispute rate, support tickets about wrong shipping method, coupon usage error rate.

## Visual Evidence (Example Structure)

![Figure 1 - Checkout before](../assets/images/checkout-before.svg)
Figure 1. Before: shipping options and optional tools are mixed, causing decision overload.

![Figure 2 - Checkout after](../assets/images/checkout-after.svg)
Figure 2. After: recommended shipping shown by default, advanced options collapsed, sticky pay CTA added.

![Figure 3 - Funnel by step](../assets/images/checkout-funnel.svg)
Figure 3. Supporting metric view: drop-off by step to validate whether shipping-step changes improve completion.
