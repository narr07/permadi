# Professional UI Delivery

Use this reference when designing, implementing, or reviewing visible UI quality: landing pages, dashboards, SaaS screens, admin panels, ecommerce pages, portfolios, mobile apps, forms, modals, navbars, cards, tables, charts, and frontend components.

This file distills the attached `ui-ux-pro-max` guidance into this repo's static skill format. Do not depend on `.claude/skills/.../scripts/search.py`; that search tool is not part of this skill.

## Priority Order

Run checks in this order when time is limited:

| Priority | Area | Impact |
|---|---|---|
| 1 | Accessibility | Critical |
| 2 | Touch and interaction | Critical |
| 3 | Performance and motion | High |
| 4 | Layout and responsive behavior | High |
| 5 | Typography and color | Medium |
| 6 | Animation | Medium |
| 7 | Style fit and consistency | Medium |
| 8 | Charts and data | Low |

## Design Direction Pass

Before building a new UI, identify:

- Product type: SaaS, ecommerce, portfolio, dashboard, landing page, admin panel, service business, mobile app.
- Audience and task: first-time visitor, evaluator, operator, expert, returning customer.
- Style intent: minimal, professional, editorial, playful, elegant, brutalist, dark, data-dense, mobile-first.
- Industry constraints: healthcare, fintech, education, beauty, gaming, developer tool, local service, enterprise.
- Stack and component system: HTML/Tailwind, React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, shadcn/ui.

Match style to the product. Operational tools should stay quiet, dense, and scannable. Marketing surfaces can be more expressive, but still need a clear first action and accessible contrast.

## Critical Checks

### Accessibility

- Normal body text reaches at least 4.5:1 contrast.
- Every interactive element has a visible focus state.
- Meaningful images have useful alt text; decorative images are hidden from assistive tech.
- Icon-only controls have accessible names.
- Tab order follows the visual and task order.
- Form inputs have associated labels and nearby error messages.
- Color is not the only way to identify state.

### Touch And Interaction

- Touch targets are at least 44x44 px or have equivalent spacing.
- Primary actions use click/tap, not hover-only behavior.
- Buttons show loading/disabled states during async operations.
- Errors appear near the problem and explain recovery.
- Clickable cards, rows, and custom controls have clear hover/focus/active feedback.
- Pointer cursor appears on clickable elements when the platform convention expects it.

### Performance And Motion

- Images are optimized, sized, lazy-loaded when appropriate, and not layout-shifting.
- Async content reserves space to avoid content jumps.
- Motion respects `prefers-reduced-motion`.
- Micro-interactions usually stay in the 150-300 ms range.
- Prefer transform and opacity for animation; avoid animating layout dimensions unless necessary.

### Layout And Responsive

- Mobile body text is readable, usually at least 16 px.
- No horizontal scroll at common mobile widths.
- Fixed navbars, bottom bars, and floating controls do not cover content or safe areas.
- Containers use consistent max-width and spacing rhythm.
- Related controls stay visually grouped after responsive reflow.
- Z-index follows a deliberate scale instead of one-off large numbers.

### Typography And Color

- Body line-height is comfortable, usually around 1.5-1.75.
- Long-form line length stays readable, usually around 65-75 characters.
- Heading and body fonts match the product personality and remain legible.
- Muted text still passes contrast in light and dark themes.
- Palette is not one-note; color supports hierarchy, status, and brand instead of decorating everything.

### Style Fit

- Use one coherent visual style across pages.
- Use icons from one consistent set, such as Lucide, Heroicons, or the product's existing icon system.
- Avoid emoji as UI icons in professional app interfaces.
- Avoid hover scale effects that shift layout or make dense tools feel unstable.
- Glass effects need enough opacity and border contrast in light mode.

### Charts And Data

- Match chart type to the question: trend, comparison, distribution, composition, relationship, flow, funnel, timeline.
- Provide table or text alternatives for important data when accessibility matters.
- Use accessible color palettes and direct labels where possible.
- Do not use decorative chart types when the user needs precise comparison.

## Common Professional UI Failures

| Failure | Fix |
|---|---|
| Emoji used as app icons | Use SVG icons from a consistent icon set |
| Invisible glass cards in light mode | Increase opacity, add visible borders, test on real backgrounds |
| Body text too light | Use stronger neutral text colors and verify contrast |
| Hover changes move layout | Use color, border, shadow, or opacity transitions instead |
| Fixed nav covers content | Add offset, safe-area padding, and viewport checks |
| Mixed container widths | Choose a small set of layout widths and reuse them |
| Mobile horizontal scroll | Check wide tables, cards, code blocks, and absolute-positioned elements |
| Async content jumps | Reserve dimensions or use skeletons with stable sizing |

## Pre-Delivery Checklist

### Visual Quality

- [ ] No emoji used as functional UI icons.
- [ ] Icons come from one consistent icon set and use stable sizing.
- [ ] Hover and active states do not shift layout.
- [ ] Brand marks or logos are verified rather than guessed.
- [ ] Theme colors use the project's token system when one exists.

### Interaction

- [ ] Clickable elements visibly respond to hover/focus/active states.
- [ ] Focus states are visible for keyboard users.
- [ ] Transitions feel responsive and do not exceed the task's patience.
- [ ] Loading, disabled, error, empty, and success states exist where relevant.

### Light And Dark Mode

- [ ] Text, borders, cards, charts, and status colors remain legible in both modes.
- [ ] Transparent surfaces remain visible in light mode.
- [ ] Muted text is readable, not merely aesthetically soft.

### Layout

- [ ] Check 375 px, 768 px, 1024 px, and 1440 px widths when feasible.
- [ ] No content is hidden behind fixed navbars or sticky action bars.
- [ ] No unintended horizontal scroll on mobile.
- [ ] Toolbars, counters, chips, and buttons have stable dimensions.

### Accessibility

- [ ] Images and icons have correct alt or hidden semantics.
- [ ] Form controls have labels.
- [ ] Color is not the only state indicator.
- [ ] Motion respects reduced-motion preferences.
