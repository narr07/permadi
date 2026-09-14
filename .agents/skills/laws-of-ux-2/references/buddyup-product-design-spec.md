# BuddyUp / v0-ai Product Design Spec

Executable design rules distilled from the product codebase (`app/globals.css`, `components/ui/*`, business components). Use with `references/design-governance-workflow.md` for reviews and with `references/laws-map.md` for rationale.

**Single source of truth for tokens**: `app/globals.css` (not `styles/globals.css`). Class merging: `lib/utils.ts` → `cn()`. Components: `@/components/ui` per `components.json` (shadcn new-york, neutral).

---

## 1. Design Tone & Product Context

- **Visual**: light default; Notion-like ink `#37352f`, sidebar `#FBFBFA`, list hover/selected as translucent gray overlays. Restrained, information-dense but clear hierarchy.
- **Stack**: Tailwind CSS v4 + `@theme inline`; shadcn/ui + Radix; lucide-react; `cn()` for classes.
- **Theme**: `next-themes`; new semantic colors need `:root` and `.dark`.
- **Core flow** (consistent patterns end-to-end): **问卷 → 匹配 → 工作台 → 文书**. Same button hierarchy, card density, empty states, and terminology across stages.

---

## 2. Color System

### Core semantic (light)

| Token | Value (typical) | Use |
|-------|-----------------|-----|
| `--background` | `#ffffff` | `bg-background` |
| `--foreground` | `#37352f` | `text-foreground` |
| `--muted` / `--muted-foreground` | `#f7f7f5` / `#91918e` | weak bg / secondary text |
| `--border` / `--input` | `#edeceb` | dividers, inputs |
| `--primary` | `#2378d9` | primary actions, emphasis |
| `--primary-foreground` | `#ffffff` | on primary buttons |
| `--accent` | `#f1f1ef` | ghost/outline hover |
| `--destructive` | oklch red | danger |
| `--ring` | `#2378d9` | focus ring |

### Surfaces & interaction

| Token | Use |
|-------|-----|
| `--surface-canvas` | main canvas |
| `--surface-muted` / `--surface-muted-hover` | secondary blocks |
| `--interactive-hover` / `--interactive-active` | **list rows** Notion-style |

### Sidebar

`--sidebar` `#fbfbfa`; width desktop `16rem`, mobile sheet `18rem`, collapsed `3rem`; **⌘/Ctrl+B** toggle.

### Tags / status

Use `--tag-*`, `--chip-info-*`, `--chip-accent-*`, `--status-dot-*` — **no ad-hoc hex**. New colors: `:root` + `.dark` + document here.

### Charts

`--chart-1` … `--chart-5` — keep order stable for recharts legends.

---

## 3. Typography

| Variable | rem | Tailwind |
|----------|-----|----------|
| `--type-2xl` … `--type-xs` | 1.5 … 0.75 | `text-2xl` … `text-xs` |
| `--type-ui-label` | 0.6875 (11px) | `text-ui-label` |

**Utility classes**: `.type-spec-title` (18 bold), `.type-spec-lead`, `.type-spec-body`, `.type-spec-body-soft`, `.type-spec-caption-soft`.

**Section labels**: `.ui-section-heading` (11px, tracked), `.ui-field-label`.

**Conventions**: buttons `text-sm font-medium`; inputs `text-base` mobile → `md:text-sm` (avoid iOS zoom).

---

## 4. Radius, Border, Shadow

- Base `--radius: 0.375rem` → `radius-sm` … `radius-xl` scale.
- Buttons/inputs: `rounded-md`.
- Card: `rounded-xl border shadow-sm py-6 gap-6`.
- Light cards: `.ui-card`, `.ui-card-inset`, `.ui-card-inset-soft`.
- Page shell: `.ui-page-shell` — subtle vertical gradient.

---

## 5. Layout Patterns

- List rows: `hover:bg-interactive-hover`, selected `bg-interactive-active`.
- Scroll hide: `.hide-scrollbar`.
- Fixed/sticky footers: reserve `padding-bottom` / safe-area; never block primary CTA.

---

## 6. Interaction Rules

### Principles

- Predictable control behavior site-wide.
- Recoverable destructive actions; clear feedback (Toast, inline, `aria-live`).
- Prefer inline expand over modal unless flow must block.
- Keyboard parity for custom click targets.

### Global shortcuts

| Shortcut | Behavior |
|----------|----------|
| **⌘/Ctrl+B** | Sidebar toggle / mobile sheet |
| **⌘/Ctrl+K** | Workspace command palette |

**⌘K constraints**: do not open when focus in input/textarea/contenteditable or inside `[data-skip-workspace-cmdk]`.

### Modal selection

| Component | When |
|-----------|------|
| **Dialog** | forms, config, non-blocking supplement |
| **AlertDialog** | delete, clear, irreversible |
| **Sheet** | mobile sidebar, filters |
| **Drawer (vaul)** | mobile bottom short flows — avoid double full-screen overlays |

**z-index**: overlays `z-50`; spotlight tour higher (e.g. 60).

### Navigation & context

- Workspace detail: switch in-page; don't lose list context without reason.
- Questionnaire: prev/next with `aria-label`; visible step indicator.
- Breadcrumb: `aria-label="breadcrumb"`, current `aria-current="page"`.

### Forms

- Submit: `type="submit"`; disable or loading while submitting.
- Errors: `FieldError`, `aria-invalid`, `aria-describedby`.

### Clickable cards

- `role="button"`, `tabIndex={0}`, **Enter + Space** (`Space` → `preventDefault`).
- Stop propagation on nested buttons.

### Async feedback

- Long ops: `Spinner` or `Skeleton`, not silent disabled.
- Success: Sonner Toast (theme-bound).
- Failure: actionable copy; field errors near fields.
- Assistant bubbles: `aria-live="polite"`; trigger `aria-label`.

### Touch

- Min ~44×44px hit targets; mobile sidebar via Sheet; input `text-base` until `md`.

### Focus & disabled

- `focus-visible:ring-ring/50 ring-[3px]`; invalid → `ring-destructive`.
- Disabled: `pointer-events-none opacity-50`.

### Tooltips

- Sidebar: `delayDuration={0}`; keep site-wide consistent.

---

## 7. Component API (`components/ui`)

### Button

- **variant**: `default` | `secondary` | `outline` | `ghost` | `link` | `destructive`
- **size**: `default` | `sm` | `lg` | `icon` | `icon-sm` | `icon-lg`
- Icon-only: **`aria-label`** required; SVG default `size-4`

### Card

`Card` → `CardHeader` / `CardTitle` / `CardDescription` / `CardAction` → `CardContent` → `CardFooter`; default `px-6`, keep `rounded-xl` / `shadow-sm` rhythm.

### Field

`FieldSet`, `FieldGroup`, `Field`, `FieldLabel`, `FieldContent`, `FieldDescription`, `FieldError`; `orientation`: vertical | horizontal | responsive; errors `role="alert"`.

### Input / Textarea

`h-9`, `rounded-md`, `px-3`; placeholder `text-muted-foreground`.

### Empty

Dashed border container; **must include next-step action** (button or link), not description-only.

### Dialog / Sheet

Overlay `bg-black/50`; content `rounded-lg border p-6 shadow-lg`; close with `sr-only` "Close".

### Toast

`Toaster` uses `--popover`, `--popover-foreground`, `--border`.

---

## 8. Business Patterns

### ProgramCard (match)

- `rounded-xl border`; selected `border-2` + left bar `w-1.5 bg-foreground/70` (`aria-hidden`).
- Category badge: `bg-muted text-muted-foreground text-[10px] uppercase tracking-wide`.
- Keyboard-accessible card as in §6.

### Workspace badges

Prefer `bg-chip-info-bg text-chip-info-text` and related chip/tag tokens for new status labels.

---

## 9. Copy & Information Architecture

- Short, action-oriented buttons.
- **One term per concept** across 问卷 / 匹配 / 工作台 / 项目清单 / 文书.
- Card metadata: consistent icon order (e.g. deadline, cost).
- Icon-only: `aria-label` or tooltip + visible text; decorative → `aria-hidden`.

---

## 10. Experience Goals

- **Local-first clarity**: when guest/local-only, surface "数据仅本地保存" (e.g. GuestBanner) — don't imply cloud sync.
- **Always a next step** in main flows; no dead-end copy-only screens.
- **Control during long tasks**: staged progress + copy, not infinite spinner alone.
- **Recovery**: undo Toast, back, or `AlertDialog` for irreversible ops.
- **One meaning per screen**: no duplicate metrics; compress overview vs detail views.
- **One primary CTA** per screen (`default` variant).
- **Progress visible** in questionnaire (desktop steps + mobile "步骤 x/n"); required fields marked `*`.

### Loading

- Full page: centered spinner on stable shell background.
- Blocks: Skeleton matching final layout.
- Long tasks: title + muted explanation + progress block.

### Empty / error / success

- Empty: `Empty*` + primary action.
- Errors: `FieldError` first; global/network via Alert or Dialog with retry path.
- Success: Toast; sync visible state if user may navigate away.

### Progressive disclosure

- Card scan line: title, key meta, primary action; details in expand.
- Expand/collapse labels and icons stay consistent; short animation.

### Test / demo entry

- Global test menu: clear `aria-label`, low visual noise.
- Replay tours via URL param or menu + clear `localStorage` keys — don't force on production users.

---

## 11. Onboarding & Spotlight (`BubbleSpotlightTour`)

### Step structure

`targetSelector`, `title`, `description`; optional `finishButtonLabel`. `padding` on highlight rect. `allowMissingTarget: true` → full dim + bubble explaining prerequisite.

### Persistence

`finishStorageKey` → localStorage `"1"`; keys in `lib/onboarding-keys.ts` / `lib/buddyup-local-storage.ts` — no scattered string literals.

### Keyboard

Focus primary button on open; **Escape** finishes and cleans up. Decorative mask `aria-hidden`.

### `data-tour` anchors

Stable `[data-tour="kebab-case"]` on guided elements. Register new IDs in spec when adding steps.

| ID | Meaning |
|----|---------|
| `match-category-filter` | Match tier filter |
| `match-school-list` | School list |
| `match-program-toolbar` | Program toolbar / bulk |
| `match-program-add` | Add to list (single tour target) |
| `match-bottom-cta` | Bottom bar to workspace |
| `workspace-sidebar-shell` | Workspace sidebar |
| `workspace-buddy-anchor` | Buddy assistant anchor |

### Match tour

Auto on first match without `buddyup_onboarding_match_spotlight_v1`; `?replaySpotlight=1` replays. Steps: filter → schools → toolbar → add (if any) → bottom CTA (`allowMissingTarget` when bar missing). Dynamic bottom copy when selection empty.

### Workspace tour

When dashboard, no school/project selected, desktop, keys clear: sidebar (incl. ⌘K) → list (empty → match) → buddy. Replay via test menu / `openWorkspaceSpotlightReplay`.

### Copy style

Title ≤ ~12 chars; description 1–3 sentences, value then action; **⌘/Ctrl** for shortcuts; neutral helpful tone.

### Frequency

One storage key per tour version; bump `_v2` on breaking changes; never stack multiple full-screen tours in one session.

---

## 12. Accessibility Baseline

- Icon buttons: `aria-label`
- State not color-only
- Keyboard main paths; visible `focus-visible`
- Forms: labels, `aria-invalid`, announced errors
- Contrast check after theme changes (light + dark)

---

## 13. Maintenance

| Change type | Action |
|-------------|--------|
| Theme token | Edit `app/globals.css` + update this doc |
| New semantic color | `:root`, `.dark`, §2 table |
| New shadcn component | `components.json`, `cn`/slot style |
| New global shortcut | §6 table + input exemption rules |
| New tour step | `data-tour` table + onboarding key export |

---

## 14. Laws → Product Quick Map

| Product moment | Apply first |
|----------------|-------------|
| Questionnaire steps | Goal-Gradient, Hick's Law, Miller's Law |
| Match list density | Chunking, Von Restorff (one primary CTA), Progressive disclosure |
| Long match generation | Doherty Threshold, Peak-End Rule |
| Workspace ⌘K | Jakob's Law, Fitts's Law |
| Destructive remove | Peak-End, Postel's Law, confirm + recover |
| First-time tour | Paradox of Active User, selective attention |
| Local-only data | Mental model, trust (Aesthetic-Usability secondary) |

See `references/laws-map.md` for full law definitions.
