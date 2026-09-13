---
name: swiss-design-unocss
description: Swiss International Typographic Style implementation engine powered by UnoCSS. Provides production-ready UnoCSS configuration, shortcuts, typography rules, 12-column modular grid classes, opacity-based hierarchy, hairline borders, and anti-slop utility patterns for Vue, Nuxt, and modern web apps. Use when building, styling, or refactoring UI components with UnoCSS following Swiss Design principles.
---

# Swiss International Style with UnoCSS

> **"A grid system is not a cage, but a foundation for mathematical freedom."**  
> *— Josef Müller-Brockmann*

This skill translates the timeless principles of the **Swiss International Typographic Style** (*Die Neue Graphik*) into high-performance, atomic utility patterns using **UnoCSS**. It leverages UnoCSS's variant grouping, shortcuts, theme engine, and typography preset to enforce mathematical rigor, hairline precision, and pure objective layout hierarchy.

---

## 1. Core Principles in UnoCSS Syntax

| Swiss Principle | UnoCSS Implementation & Class Pattern |
| :--- | :--- |
| **12-Column Grid** | `grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6` |
| **8px Base Unit** | All spatial tokens use 8px multiples: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px), `py-16` (64px), `py-24` (96px). |
| **Opacity Hierarchy** | Primary: `text-slate-900 dark:text-slate-50` (100%)<br>Secondary: `text-slate-900/70 dark:text-slate-50/70` (70%)<br>Tertiary/Meta: `text-slate-900/40 dark:text-slate-50/40` (40%)<br>Ghost rule: `border-slate-200/80 dark:border-[#134e43]` |
| **Single Signal Accent** | Solid: `bg-brand-500 text-white`<br>Active indicator: `border-brand-500/60`<br>Subtle tint: `bg-brand-500/10 text-brand-700 dark:text-brand-300` |
| **Narrow Reading Column** | `max-w-[60ch]` on body copy to ensure 45–65 characters per line. |
| **Hairline Over Shadow** | Replace heavy shadows (`shadow-xl`) with crisp 1px borders: `border border-slate-200/80 dark:border-[#134e43] shadow-none` |
| **Flush-Left Typography** | `text-left` always. Headlines use `font-heading font-800 tracking-tight text-balance`. |
| **Tabular Numbers** | `tabular-nums font-mono` for all metrics, dates, and tables. |

---

## 2. UnoCSS Configuration Reference (`uno.config.ts`)

Embed these theme settings, typography rules, and shortcuts into your `uno.config.ts`:

```typescript
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind3({
      dark: 'class',
    }),
    presetIcons({
      scale: 1.1,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography({
      cssExtend: {
        'h1,h2,h3,h4,h5,h6': {
          'font-family': "'Barlow', sans-serif",
          'font-weight': '800',
          'letter-spacing': '-0.03em',
          'line-height': '1.05',
        },
        'p, li': {
          'line-height': '1.65',
          'max-width': '60ch',
        },
        'table': {
          'width': '100%',
          'border-collapse': 'collapse',
        },
        'th, td': {
          'padding': '0.75rem 1rem',
          'border-bottom': '1px solid var(--swiss-border)',
        },
      },
    }),
  ],

  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],

  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      heading: ['Barlow', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
    },
    colors: {
      brand: {
        50: '#f0fdfa',
        100: '#ccfbf2',
        200: '#99f6e4',
        300: '#5eeacf',
        400: '#2bd4b5',
        500: '#14b898', // Primary Signal
        600: '#0d947a',
        700: '#0f7662',
        800: '#115e4f',
        900: '#134e43',
        950: '#042f27',
      },
      slate: {
        50: '#f8fafa', // Cool Light Paper
        100: '#eff6f5',
        200: '#deeae9', // Hairline Border (Light)
        300: '#c5d9d7',
        400: '#84a8a4',
        500: '#537c77',
        600: '#375c58',
        700: '#224844',
        800: '#0a2f2c',
        900: '#001e1c', // Abyssal Forest Charcoal (Dark)
        950: '#000c0a',
      },
      accent: '#f9bc60', // Warm Gold Signal
    },
  },

  shortcuts: {
    // Structural Grid & Container
    'swiss-container': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'swiss-grid-12': 'grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-auto',

    // Modular Asymmetry Layout Splits
    'swiss-lead-8': 'col-span-1 sm:col-span-6 lg:col-span-8 p-6 sm:p-8 border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27]',
    'swiss-rail-4': 'col-span-1 sm:col-span-6 lg:col-span-4 p-6 sm:p-8 border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] flex flex-col justify-between',
    'swiss-card-4': 'col-span-1 sm:col-span-3 lg:col-span-4 p-6 border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27]',
    'swiss-card-6': 'col-span-1 sm:col-span-6 lg:col-span-6 p-6 sm:p-8 border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27]',

    // Typographic Hierarchy
    'swiss-eyebrow': 'text-[11px] font-bold tracking-[0.15em] uppercase text-brand-700 dark:text-accent font-sans',
    'swiss-h1': 'font-heading font-800 text-4xl sm:text-6xl tracking-tight text-slate-900 dark:text-slate-50 leading-[0.95] text-balance',
    'swiss-h2': 'font-heading font-800 text-2xl sm:text-4xl tracking-tight text-slate-900 dark:text-slate-50 leading-tight',
    'swiss-h3': 'font-heading font-800 text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-slate-50 leading-snug',
    'swiss-body': 'font-sans text-sm sm:text-base text-slate-900/70 dark:text-slate-50/70 leading-relaxed max-w-[60ch]',
    'swiss-meta': 'font-mono text-xs text-slate-900/40 dark:text-slate-50/40 tabular-nums',

    // Structural Hairlines & Tables
    'swiss-hairline-b': 'border-b border-slate-200/80 dark:border-[#134e43]',
    'swiss-hairline-t': 'border-t border-slate-200/80 dark:border-[#134e43]',
    'swiss-spec-row': 'flex items-baseline justify-between py-2.5 swiss-hairline-b text-xs sm:text-sm',

    // Buttons & Interactivity (Restrained Motion)
    'swiss-btn-primary': 'inline-flex items-center justify-center gap-2 px-5 py-2.5 font-sans font-700 text-sm text-white bg-brand-900 hover:bg-brand-950 dark:bg-brand-500 dark:text-slate-950 dark:hover:bg-brand-400 active:scale-[0.98] transition-transform duration-150',
    'swiss-btn-outline': 'inline-flex items-center justify-center gap-2 px-5 py-2.5 font-sans font-600 text-sm text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-[#134e43] hover:border-brand-500 dark:hover:border-brand-400 active:scale-[0.98] transition-colors duration-150',
    'swiss-status-dot': 'w-2 h-2 rounded-full bg-brand-500 inline-block shadow-[0_0_0_4px_#ccfbf2] dark:shadow-[0_0_0_4px_rgba(20,184,152,0.2)]',
  },
})
```

---

## 3. Production Component Recipes (UnoCSS)

### Recipe 1: The Asymmetric Modular Hero + Spec Rail

```html
<section class="swiss-container py-12 sm:py-20">
  <div class="swiss-grid-12">
    <!-- Lead Section: 8 Columns -->
    <div class="swiss-lead-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="swiss-status-dot"></span>
        <span class="swiss-eyebrow">01 // INTERNATIONAL STYLE</span>
      </div>
      <h1 class="swiss-h1">
        Mathematical order over decorative indulgence.
      </h1>
      <p class="swiss-body mt-6">
        Every line of text, interval of whitespace, and dividing rule is placed with absolute geometric intent. Objective hierarchy creates instant clarity.
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-4">
        <a href="#spec" class="swiss-btn-primary">View Specification</a>
        <a href="#archive" class="swiss-btn-outline">Archive 01–06</a>
      </div>
    </div>

    <!-- Side Rail: 4 Columns (Metadata & Performance Indicator) -->
    <div class="swiss-rail-4">
      <div>
        <div class="swiss-eyebrow">02 // INDEX SPECIFICATION</div>
        <div class="font-mono text-5xl sm:text-6xl font-800 text-brand-500 dark:text-brand-400 tabular-nums my-6 tracking-tight">
          0.12<span class="text-xs text-slate-900/40 dark:text-slate-50/40 font-normal">s</span>
        </div>
        <p class="text-xs text-slate-900/70 dark:text-slate-50/70 leading-normal">
          First contentful paint baseline rendered on an 8px grid track.
        </p>
      </div>

      <!-- Spec Table -->
      <div class="mt-8 pt-4 swiss-hairline-t">
        <div class="swiss-spec-row">
          <span class="text-slate-900/70 dark:text-slate-50/70">Grid System</span>
          <span class="font-mono text-slate-900 dark:text-slate-50 tabular-nums">12-COL</span>
        </div>
        <div class="swiss-spec-row">
          <span class="text-slate-900/70 dark:text-slate-50/70">Scale Ratio</span>
          <span class="font-mono text-slate-900 dark:text-slate-50 tabular-nums">1.250</span>
        </div>
        <div class="swiss-spec-row border-none">
          <span class="text-slate-900/70 dark:text-slate-50/70">Reading Measure</span>
          <span class="font-mono text-slate-900 dark:text-slate-50 tabular-nums">60ch</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### Recipe 2: The Numbered Index Rail (3-Column Triad)

```html
<section class="swiss-container py-12">
  <div class="swiss-hairline-b pb-4 mb-6 flex items-baseline justify-between">
    <span class="swiss-eyebrow">MODULE INDEX // 2026</span>
    <span class="swiss-meta">SERIES A</span>
  </div>

  <div class="swiss-grid-12">
    <!-- Card 01 -->
    <article class="swiss-card-4 group hover:(border-brand-500/60 dark:border-brand-400/60) transition-colors duration-150">
      <div class="swiss-meta group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">01.01</div>
      <h3 class="swiss-h3 mt-3 mb-2">Spatial Reduction</h3>
      <p class="swiss-body text-xs">
        Eliminate extraneous cards, gradients, and frames. Let whitespace establish structural perimeter.
      </p>
    </article>

    <!-- Card 02 -->
    <article class="swiss-card-4 group hover:(border-brand-500/60 dark:border-brand-400/60) transition-colors duration-150">
      <div class="swiss-meta group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">01.02</div>
      <h3 class="swiss-h3 mt-3 mb-2">Grotesque Hierarchy</h3>
      <p class="swiss-body text-xs">
        Communicate emphasis via mathematical weight (400 vs 800) and scale, never by introducing rainbow colors.
      </p>
    </article>

    <!-- Card 03 -->
    <article class="swiss-card-4 group hover:(border-brand-500/60 dark:border-brand-400/60) transition-colors duration-150">
      <div class="swiss-meta group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">01.03</div>
      <h3 class="swiss-h3 mt-3 mb-2">Single Signal Action</h3>
      <p class="swiss-body text-xs">
        One clear teal accent focuses user intent. Secondary information rests in monochromatic calm.
      </p>
    </article>
  </div>
</section>
```

---

## 4. UnoCSS Verification Utilities (Grayscale & Squint Tests)

You can test your layout directly in the browser by applying these quick verification utilities to the root container or `<body>`:

```html
<!-- The Grayscale Test in UnoCSS: -->
<!-- Does the hierarchy, contrast, and layout hold when color is completely absent? -->
<div class="filter grayscale">
  <!-- your swiss layout -->
</div>

<!-- The Squint Test in UnoCSS: -->
<!-- Does the primary headline or focal element dominate immediately when blurred? -->
<div class="filter blur-sm">
  <!-- your swiss layout -->
</div>
```

---

## 5. UnoCSS Anti-AI Slop Rules (Strictly Prohibited Classes)

When generating or inspecting UnoCSS markup, instantly reject and refactor these anti-patterns:

| Prohibited AI Anti-Pattern | Bad UnoCSS Usage | Correct Swiss UnoCSS Alternative |
| :--- | :--- | :--- |
| **Purple/Neon gradient text** | `bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent` | `text-slate-900 dark:text-slate-50 font-heading font-800` |
| **Heavy card drop-shadows** | `shadow-2xl shadow-indigo-500/20` | `border border-slate-200/80 dark:border-[#134e43] shadow-none` |
| **Floating colored blur orbs** | `absolute w-72 h-72 rounded-full bg-purple-500/30 blur-3xl` | **DELETE**. Use pure background canvas `bg-slate-50 dark:bg-slate-900`. |
| **Nested card spam** | `div.card > div.card-body > div.inner-card` | Flat modular plate with `swiss-hairline-t` or `swiss-hairline-b` dividers. |
| **Centered long paragraphs** | `text-center max-w-xl mx-auto` (on long copy) | `text-left max-w-[60ch]` (flush-left, ragged-right). |
| **Over-rounded balloons** | `rounded-3xl` or `rounded-full` on content boxes | Sharp corners (`rounded-none`) or controlled micro-radius (`rounded-lg` / `rounded-bento`). |
| **Motion wobble/bounce** | `animate-bounce` or `hover:scale-110 duration-500` | `active:scale-[0.98] transition-transform duration-150` (restrained, functional). |

---

## 6. Developer Checklist for UnoCSS Components

1. **Grid**: Is the container wrapped with `swiss-container` and `swiss-grid-12`?
2. **Typography**: Are headlines using `font-heading font-800 tracking-tight` with `text-balance`?
3. **Line Length**: Does body copy have `max-w-[60ch]`?
4. **Contrast**: Is text hierarchy handled via opacities (`text-slate-900`, `/70`, `/40`) rather than decorative colors?
5. **Hairlines**: Are modules delimited with 1px hairline borders (`border-slate-200/80 dark:border-[#134e43]`) instead of fuzzy drop-shadows?
6. **Verification**: Does the layout pass `grayscale` and `blur-sm` checks without losing meaning?
