# Design Governance Workflow

Use this when the user asks for 设计规范, 视觉统一, 交互一致性, UI 审查, or aligning pages/components with product standards.

This workflow complements Laws of UX: laws explain *why*; this checklist enforces *what* must be true before shipping.

## Mandatory Progress Checklist

Copy and execute in order:

```text
Design Governance Progress
- [ ] Step 1: Define scope and target surfaces
- [ ] Step 2: Run strict design checklist audit (five domains)
- [ ] Step 3: Classify findings (P0/P1/P2/P3)
- [ ] Step 4: Apply minimal consistent fixes
- [ ] Step 5: Validate accessibility and interaction states
- [ ] Step 6: Summarize decisions and residual risks
```

## Step 1: Define Scope

Capture and lock:

- **Target**: `single component` | `single page` | `cross-page flow`
- **Goal**: `new spec` | `align existing UI` | `cleanup inconsistencies`
- **Constraints**: keep existing architecture; avoid broad refactor unless requested

If ambiguous, ask for one preferred baseline screen or file path.

## Step 2: Five-Domain Audit

### A) Visual Hierarchy

- [ ] Information appears once per page (no duplicate stats/titles).
- [ ] Primary action is visually dominant and unique.
- [ ] Secondary actions use subdued visual weight (`outline` / `ghost` / `secondary`).
- [ ] Spacing rhythm is consistent inside the same section.
- [ ] Color usage is restrained (neutral + one accent strategy; token-only).
- [ ] Shadows/borders are consistent across sibling cards/blocks.
- [ ] Visual style matches the product type and task density; expressive styling does not weaken scanability.
- [ ] Light and dark mode contrast works for text, muted text, cards, borders, and charts.

### B) Interaction Consistency

- [ ] Click targets are clear and predictable.
- [ ] Click/tap targets meet mobile comfort expectations, especially icon-only controls and dense chip rows.
- [ ] Hover/focus/disabled/loading states exist for interactive controls.
- [ ] Hover and active states do not shift layout or resize targets.
- [ ] Long-running actions expose specific progress, completion, partial failure, and recovery states.
- [ ] Agentic or automated flows separate routine automation from preference-sensitive pause/confirm moments.
- [ ] Critical actions require confirmation when destructive (`AlertDialog`).
- [ ] Sticky/fixed bars do not cover key content or safe areas.
- [ ] Empty states provide next action, not only description.
- [ ] Step transitions preserve context (no confusing route jumps).
- [ ] Global shortcuts do not fire inside inputs (`INPUT` / `TEXTAREA` / `contenteditable`).
- [ ] Exempt regions use `data-skip-workspace-cmdk` where needed.

### C) Copywriting Consistency

- [ ] Labels are short and action-oriented.
- [ ] Same concept uses one term everywhere (问卷 / 匹配 / 工作台 / 项目清单 / 文书).
- [ ] No mixed status vocab sets for the same state.
- [ ] Numeric/meta info is concise and comparable (same order + icons in cards).
- [ ] Tooltip/`aria-label` exists when icon-only controls are used.

### D) Component Consistency

- [ ] Reuse `@/components/ui` primitives before custom wrappers.
- [ ] Same component role → same visual variant and size.
- [ ] Similar cards/lists share structure and spacing logic.
- [ ] Form fields use `Field*` layout (label / description / error placement).
- [ ] Status tags/badges follow unified chip/tag tokens.
- [ ] Functional icons come from one consistent icon system; emoji are not used as app UI icons.

### E) Accessibility Baseline

- [ ] Icon-only buttons include `aria-label`.
- [ ] Decorative icons use `aria-hidden` when appropriate.
- [ ] Keyboard navigation works for major path actions (`Enter`/`Space` on `role="button"`).
- [ ] State is not conveyed by color only.
- [ ] Status messages for progress, completion, and errors are perceivable without unnecessary focus movement.
- [ ] Contrast is acceptable for text and essential indicators in light and dark themes.
- [ ] Motion respects reduced-motion preferences when animation is nonessential.

## Step 3: Severity

| Level | Definition |
|-------|------------|
| **P0** | Blocks flow, causes wrong action, or breaks accessibility basics |
| **P1** | Major confusion, abandonment risk, or repeated errors in core flow |
| **P2** | Noticeable friction, inconsistency, or cognitive load with workaround |
| **P3** | Polish, clarity, edge-case refinement |

Fix order: P0 → P1 → P2 → P3.

## Step 4: Execution Rules

1. Prefer smallest viable change that resolves the issue.
2. Preserve existing product language and component ecosystem.
3. Remove redundant UI before adding new UI.
4. Avoid new color semantics unless required; register in product spec if added.
5. Keep dense screens readable via progressive disclosure (collapse/expand/hover detail).
6. Theme changes only in `app/globals.css`; sync product spec tables when tokens change.

## Step 5: Validation

After edits:

- No new lint errors in changed files.
- Core path works: entry → action → feedback → next step.
- Long tasks work: start → progress → pause/cancel/resume or background → completion/partial failure → next step.
- Focus order and keyboard operation remain usable.
- State and count displays stay synchronized after actions.
- Desktop and mobile layouts: no overlap, truncation, or unstable controls.
- Professional UI delivery: no emoji-as-icons, invisible glass, hidden content behind fixed bars, or unintended mobile horizontal scroll.

## Step 6: Delivery Format

1. What changed and why (product language first).
2. Fixes grouped by P0/P1/P2/P3.
3. Trade-offs or deferred items.
4. Optional next-pass improvements only after core fixes.

## PR Self-Check (BuddyUp / v0-ai)

```text
- [ ] 视觉层级：一屏内主 CTA 唯一且最突出
- [ ] 色彩：无随意 hex；语义色来自 token；深色模式无断裂
- [ ] 间距：同区块 gap/padding 节奏一致
- [ ] 专业质感：图标、字体、卡片、边框、阴影、浅/深色对比统一
- [ ] 交互：快捷键不误伤输入区；模态选用正确（不可逆→AlertDialog）
- [ ] 导航：上下文不丢（工作台详情、问卷步骤、面包屑）
- [ ] 控件状态：hover/focus/disabled/loading 齐全
- [ ] 长任务：进度、暂停/取消/恢复、部分失败与下一步清楚
- [ ] Agentic 流程：自动处理与用户决策边界清楚
- [ ] 可点击非按钮：role、tabIndex、Enter/Space、无冒泡冲突
- [ ] 固定底栏：不挡主操作与安全区
- [ ] 组件：优先 shadcn/ui；同类卡片结构一致
- [ ] 表单：Field 规范；空状态有主操作
- [ ] 引导：data-tour 已登记；storage key 走 onboarding-keys
- [ ] 文案：术语统一；无重复统计堆砌
```

## Default Product Defaults (Unless User Overrides)

- Copy concise; reduce decorative wording.
- Avoid repeated overview metrics on the same screen.
- Use icon + value patterns for dense metadata when already established.
- Keep list/card styling lightweight and consistent.
- Preserve local-first workflow cues between questionnaire → match → workspace → writing.
- Guest/local storage must be perceptible when data is not cloud-synced.

## Trigger Phrases

Use proactively when user mentions:

- 设计规范 / 设计规范整理
- 视觉统一 / 交互一致性
- UI 审查 / UI 整理
- 信息层级优化 / 无障碍检查
- align with product design standards
