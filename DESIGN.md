# DESIGN.md: permadi.dev

Design system of permadi.dev, the personal site of a primary school teacher and software developer. It is written so that another AI agent or designer can rebuild the same look in a new project. Values are taken from the live code: `uno.config.ts`, `app/assets/css/main.css`, and the `Swiss*` home components.

## 1. Character

- **Swiss International Typographic Style, editorial.** Flush-left type, a strict grid, hairline rules, and no decoration that has no job.
- **Rectilinear.** Every corner is square. `border-radius: 0` is enforced globally, including on buttons, inputs, images, badges, and focus rings.
- **Framed page.** The whole site is a single bordered column (`max-width: 72rem`) on a slightly darker canvas. Inside it, sections are panels separated by 1px rules, not floating cards with gaps.
- **Teal ink, one warm accent.** A deep green-teal family does almost all the work. Amber `#f9bc60` is the only warm color, used sparingly (dark-mode labels, markers, blockquote rule).
- **Printed feel.** A faint paper grain sits on the page background only. Panels, cards, and the header cover it.
- **Mono for metadata.** Labels, nav, dates, categories, buttons, and tags are uppercase monospace with wide tracking. Headings are a heavy grotesk with tight tracking. Body text is a calm sans.
- Light and dark mode are both first-class. The default follows the system preference.

## 2. Color tokens

### Semantic tokens (CSS variables)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#f8fafa` | `#001e1c` | Page background outside the framed column |
| `--ink` | `#001e1c` | `#f8fafa` | Body text |
| `--heading` | `#001e1c` | `#f8fafa` | Headings |
| `--card` | `#ffffff` | `#002b27` | Cards and raised panels |
| `--border-clean` | `#115e4f` | `#134e43` | All structural rules and borders |
| `--muted` | `#0f7662` | `#84a8a4` | Secondary text and icons |
| `--accent` | `#f9bc60` | `#f9bc60` | Single warm accent |

Framed column and header background: `#ffffff` (light), `#001e1c` (dark).
Row hover tint: `#e2f4f0` (light), `#003832` (dark).
Subtle panel tint (identity rail, footer strips): `slate-50` at 50% (light), `#002420` at 30–50% (dark).

### Brand scale (teal)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|
| `#f0fdfa` | `#ccfbf2` | `#99f6e4` | `#5eeacf` | `#2bd4b5` | `#14b898` | `#0e7e68` | `#0f7662` | `#115e4f` | `#134e43` | `#042f27` |

### Neutral scale (green-tinted slate, replaces default gray)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|
| `#f8fafa` | `#eff6f5` | `#deeae9` | `#c5d9d7` | `#84a8a4` | `#537c77` | `#375c58` | `#224844` | `#0a2f2c` | `#001e1c` | `#000c0a` |

### Color rules

- Structural borders in light mode are **brand-800 `#115e4f`**, not gray. They read as dark green hairlines. Dark mode uses `#134e43`.
- Primary action fill is **brand-500 `#14b898` with dark text `slate-900`**. Never put white text on brand-500 (contrast too low).
- Links: `#0f7662` (light) / `#2bd4b5` (dark), weight 600, underline at 40% opacity, 1.5px thick, 3px offset.
- Section labels: brand-700 in light mode, **amber accent in dark mode**.
- Active filter/tab is fully inverted: `#001e1c` background with white text (light); `#f8fafa` background with `#001e1c` text (dark).
- Text selection: `#14b898` background, white text.
- No gradients, no glows, no colored shadows. The only fill gradient allowed is the loading skeleton shimmer.

## 3. Typography

| Role | Family | Weights | Fallback for other projects |
|---|---|---|---|
| Heading | Permadi Heading (custom grotesk) | 400, 700, **900** | A heavy neo-grotesk, e.g. Inter Tight 800–900 |
| Body | Permadi Body (custom sans) | 400, 700 | Inter / system-ui |
| Mono | Permadi Mono (custom mono) | 400 | JetBrains Mono / IBM Plex Mono |

The three Permadi fonts are self-hosted WOFF2 with `font-display: swap`. Do not copy them into other projects without permission. Use the fallbacks instead.

### Scale (UnoCSS shortcuts)

| Name | Spec |
|---|---|
| Hero / page title | Heading 900, `text-4xl` → `sm:text-6xl`, line-height 0.95–1.05, `tracking-tight`, `text-balance` |
| Section H2 | Heading 900, `text-2xl` → `sm:text-4xl`, `leading-tight` |
| H3 / card title large | Heading 900, `text-xl` → `sm:text-2xl` |
| Card title | Heading 900, `text-lg` |
| Prose H2 | Heading 700, `clamp(1.45rem, 2.8vw, 1.85rem)`, letter-spacing −0.025em |
| Prose H3 | Heading 700, `clamp(1.2rem, 2vw, 1.375rem)`, preceded by a mono `#` mark at 35% opacity |
| Body | Body 400, 16px root, line-height 1.65, max ~60ch |
| Lead / subtitle | Body, `text-base` → `sm:text-lg`, slate-700 / slate-200, max-width `xl` |
| Meta | Mono, `text-xs`, slate-600/700, `tabular-nums` |
| Section label | Mono, 11px, bold, uppercase, tracking `0.15–0.2em`, brand-700 / amber in dark |
| Nav, buttons, tags | Mono, `text-xs`, bold, uppercase, tracking `wider`/`widest` |

Type is always flush left. Do not center body copy or headlines except inside small square plaques.

## 4. Layout and grid

- **Shell:** one centered column, `max-width: 72rem` (`max-w-6xl`), `border-x` 1px rule, white/`#001e1c` fill, on the `--canvas` background with grain. Min height 100vh. `overflow-x: clip`.
- **Inner container:** `px-4 sm:px-6 lg:px-8`.
- **Grid:** 12 columns on desktop (`lg`), 6 on tablet (`sm`), 1 on mobile. Gap 16px → 24px when gaps are used.
- **Panels instead of floating cards:** home sections are full-width bands with `border-b`. Columns inside a band are split with `border-r` hairlines (e.g. hero = 4-col identity rail + 8-col statement; projects = 3 equal columns). Content padding is `p-6 sm:p-8 lg:p-10`.
- **Section header strip:** a full-width row with a mono section label, `px-6 py-4 sm:px-8 sm:py-5`, `border-b`.
- **Section footer strip:** a tinted row, right-aligned mono link "VIEW ALL …" with underline offset 4px.
- **Breakpoints:** sm 640, md 768, lg 1024, xl 1280, 2xl 1536, 3xl 1920.
- **Aspect ratios:** photo 3:2, profile 1:1, article cover 5:3, thumbnail 4:3.
- Scroll padding top 5.5rem for the sticky header. Header height ≈ 65px (`--app-header-height`).
- Pressing **G** on the home page toggles a 12-column grid overlay. It is a dev aid, not part of the visual design.

## 5. Components

### Header
Sticky, `border-b`, solid background (no blur). Left: 24px round logo + "DINAR PERMADI" in mono bold uppercase, tracking 0.12em. Right: mono uppercase nav (`text-xs`, gap 20px). The active item is brand-700, bold, with an underline. Then a 1px vertical divider, then square icon buttons for search, an ID/EN segmented switch, and theme toggle. A 2px reading-progress bar in brand-500 runs along the bottom edge.
Mobile: icon buttons + hamburger. The menu is a full-height sheet with numbered rows (`01`, `02` in mono) and large heading-900 labels. An arrow marks the current page, so the active state is not shown by color alone.

### Buttons
- **Primary:** brand-500 fill, slate-900 text, mono bold uppercase `text-xs`, tracking wider/widest, min-height 48px, padding `px-6 py-3.5`. Hover brand-400, `-translate-y-0.5`. Active `scale(0.97)`.
- **Outline:** 1px border (slate-300 light / `#134e43` dark), same type. Hover: border and text turn brand.
- **Icon button:** 40×40 square, 1px border, hover border brand-500, active `scale(0.92)`.
- Two CTAs sit side by side above a top hairline. On mobile they become a 2-column grid.

### Filter tabs and tags
- Tabs: mono bold uppercase small boxes with 1px border. Active = inverted (see color rules). A counter on the right edge: "SHOWING 58 OF 58 ARTICLES" in mono.
- Tags: `#tag` in mono uppercase 10–11px inside a 1px dark-green outline box.

### Article list rows (journal)
Full-width link rows separated by `divide-y` hairlines. Desktop is a 12-col grid: title (8 cols, heading 900, `text-lg`), category (2 cols, mono 11px uppercase, centered), date (2 cols, mono `tabular-nums`, right). Hover tints the row `#e2f4f0` / `#003832` and turns the title brand. Min height 56px.

### Article cards (blog index)
Featured article: full-width panel with mono meta line `CATEGORY · YYYY-MM-DD`, a large heading, a one-line excerpt, tags, then a hairline and a footer row "16 MIN READ" + primary button "READ FULL ARTICLE ↗".
Grid cards: 3 columns split by vertical hairlines. Category in brand mono, date in mono on the right, heading-700 title, short excerpt, hairline, then a mono "READ ARTICLE ↗" link.

### Spec rows (identity rail)
Label left, value right, mono `text-xs`, each row with a bottom hairline (`swiss-spec-row`). Example: `STATUS · OPEN FOR COLLABORATION` (value in brand), `LOCATION · Majalengka, West Java`.

### Logo plaque
A bordered square box with a mono header tag ("■ OFFICIAL LOGO", with a small pulsing brand square) above a hairline, and the round teal logo centered (132px). The border turns brand on hover and the logo scales to 1.05.

### Footer
Home: a slim mono strip with copyright, feedback trigger, and a "BACK TO TOP ↑" outline button.
Inner pages: a newsletter band (mono label + heading-900 title + short copy + form), a platform rail of bordered social link tiles (icon, name, @handle), then the copyright strip.

### Prose (articles)
- Blockquote: no italics, `#eff6f5` background, 4px left rule `#0f7662` (amber in dark), padding 1rem 1.25rem.
- Inline code: mono 0.85em, brand-700 text on `#ccfbf2`, **1px dashed** `#14b898` border.
- Lists: markers brand-700 (amber in dark). Ordered markers are bold.
- Tables: full width, collapsed, header row on the canvas color, bold. Cells padded `0.85rem 1.25rem`, 1px bottom rules.
- `hr`: 1px `#deeae9`, 2.5rem vertical margin.
- Callouts (note, tip, warning, caution), steps, tabs, accordions, and code groups all follow the same square, bordered, hairline language.

### Floating chat launcher
Bottom-right square button with 1px border, chat icon + "Ask AI" in heading bold. It stays still during page transitions.

## 6. Effects

### Paper grain (page background only)
```css
body::after {
	content: '';
	position: fixed;
	inset: 0;
	z-index: -1; /* behind content: header, cards, panels cover it */
	pointer-events: none;
	opacity: var(--grain-opacity); /* 0.18 light, 0.22 dark */
	background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	background-size: 220px 220px;
	will-change: transform;
}
@media print, (forced-colors: active) { body::after { display: none; } }
```
Keep the body background transparent (color lives on `html`) so the grain is not hidden. Do not use `mix-blend-mode`. It forces a full-page repaint on scroll.

### Shadows and depth
Flat. Depth comes from borders and tint, not shadows. `shadow-xs` is allowed only on the primary CTA.

## 7. Motion

- Fast and functional: 150ms for color, border, and press states; 200–260ms for panels.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for entering, `cubic-bezier(0.2, 0, 0, 1)` for collapsing panels.
- Press feedback: `active:scale-[0.97]` on buttons, `0.92` on icon buttons, `-translate-y-0.5` on hover for CTAs.
- Page transitions (View Transitions API): the old page fades out in 120ms, the new one rises 10px and fades in over 260ms. Header and chat launcher are excluded so they never move. The transition backdrop uses `--canvas` to avoid a white flash in dark mode.
- Accordions animate `grid-template-rows: 0fr → 1fr` (no JS height measuring).
- Status dot: small square pulsing (`scale 1 → 1.22`, 2.4s).
- `prefers-reduced-motion: reduce` disables all animation and transitions.

## 8. Accessibility

- Focus: `2px solid #14b898` outline, 2px offset (`#2bd4b5` in dark). Never remove it without a replacement.
- Skip link to `#main`, styled as a brand-500 block when focused.
- Tap targets ≥ 44px (social tiles `min-h-11`, CTAs `min-h-12`, list rows 56px).
- Active nav state uses weight + underline/arrow, not color alone.
- Body text targets WCAG AA or better. Headings in prose use the darkest ink (`#001e1c` / `#f8fafa`).
- Bilingual (ID/EN). Keep labels short enough for both languages.

## 9. Do / Don't

**Do**
- Split space with 1px dark-green hairlines and full-width bands.
- Use mono uppercase for every label, meta line, nav item, and button.
- Keep headlines very heavy (900) and tightly tracked. Keep body calm and readable.
- Use amber only as a small accent.

**Don't**
- Rounded corners, pills, or circles on UI (the round logo and status dot are the only round shapes).
- Drop shadows, glassmorphism, blur, gradients, or neon glows.
- Gray borders in light mode (borders are dark green).
- Centered hero layouts, emoji in UI, or decorative illustrations behind text.
- White text on `#14b898`.

## 10. Copy-paste starters

### CSS variables
```css
:root {
	--canvas: #f8fafa; --ink: #001e1c; --heading: #001e1c; --card: #ffffff;
	--border-clean: #115e4f; --muted: #0f7662; --accent: #f9bc60;
	--grain-opacity: 0.18;
}
.dark {
	--canvas: #001e1c; --ink: #f8fafa; --heading: #f8fafa; --card: #002b27;
	--border-clean: #134e43; --muted: #84a8a4; --accent: #f9bc60;
	--grain-opacity: 0.22;
}
* { border-radius: 0 !important; }
::selection { background: #14b898; color: #fff; }
:focus-visible { outline: 2px solid #14b898; outline-offset: 2px; }
.dark :focus-visible { outline-color: #2bd4b5; }
```

### Tailwind / UnoCSS theme
```js
theme: {
	fontFamily: {
		sans: ['"Permadi Body"', 'system-ui', 'sans-serif'],
		heading: ['"Permadi Heading"', 'sans-serif'],
		mono: ['"Permadi Mono"', 'monospace'],
	},
	colors: {
		brand: { 50: '#f0fdfa', 100: '#ccfbf2', 200: '#99f6e4', 300: '#5eeacf', 400: '#2bd4b5', 500: '#14b898', 600: '#0e7e68', 700: '#0f7662', 800: '#115e4f', 900: '#134e43', 950: '#042f27' },
		slate: { 50: '#f8fafa', 100: '#eff6f5', 200: '#deeae9', 300: '#c5d9d7', 400: '#84a8a4', 500: '#537c77', 600: '#375c58', 700: '#224844', 800: '#0a2f2c', 900: '#001e1c', 950: '#000c0a' },
		accent: '#f9bc60',
	},
}
```

### Key shortcuts
```js
'swiss-container': 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
'swiss-card-flat': 'border border-brand-800 dark:border-[#134e43] bg-white dark:bg-[#002b27] p-6',
'swiss-h1': 'font-heading font-900 text-4xl sm:text-6xl tracking-tight text-slate-900 dark:text-slate-50 leading-[0.95] text-balance',
'swiss-meta': 'font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums',
'section-label': 'uppercase tracking-[0.15em] text-[11px] font-bold text-brand-800 dark:text-accent',
'swiss-spec-row': 'flex items-baseline justify-between py-2.5 border-b border-brand-800 dark:border-[#134e43] text-xs sm:text-sm',
```
