---
name: swiss-design
description: Master Swiss International Style (Die Neue Graphik) design system. Framework-agnostic guide for crafting rigorous, grid-driven, typographic, and objective web interfaces. Focuses on mathematical 12-column grids, grotesque typography, opacity-based hierarchy, structural whitespace, single-accent discipline, the Grayscale and Squint verification tests, and strict anti-slop rules. Use whenever designing, evaluating, or refactoring website UI/UX.
---

# Swiss International Typographic Style (Master Design Skill)

> **"Order is the basis of all visual communication. The grid is an organizational system that enables the designer to achieve clarity, objectivity, and functional rhythm."**  
> *— Josef Müller-Brockmann, Grid Systems in Graphic Design*

This skill is a **framework-agnostic design specification** based on the Swiss International Typographic Style (*Die Neue Graphik*, Zurich and Basel schools, 1950s–1960s). It provides universal visual, architectural, and typographic rules for web interfaces—independent of any programming language, framework, or utility library.

---

## 1. Core Philosophy: Clarity Through Reduction

The foundational purpose of Swiss Design is **objective communication**. Visual design is not an ornamental canvas; it is a logical, structured discipline designed to transmit information with immediate legibility, high contrast, and structural elegance.

### The Four Foundational Laws
1. **Reduction (Form Follows Function)**: If a visual element does not contribute to clarity or structural hierarchy, eliminate it. Always ask: *"Can I remove this without losing meaning?"*
2. **Mathematical Grid**: The grid is the design. Elements align strictly along column and baseline coordinates. Alignment creates semantic relationship; misalignment creates disorder.
3. **Controlled Hierarchy**: Guide the reader's eye through distinct ratios in scale, weight, and spatial grouping. Maintain a strict maximum of **3 hierarchy levels** per visual scene.
4. **Typography as Architecture**: Grotesque typography carries the structural and aesthetic weight of the page. Scale, posture, and whitespace replace decorative graphics.

### The Two Mandatory Verification Tests
Before completing any design, evaluate it against these two non-negotiable checks:

1. **The Grayscale Test**: Convert the layout to pure monochrome (`filter: grayscale(1)`). If visual priority, readability, or grouping collapses, the structural foundation is weak. Re-establish hierarchy through scale, font weight, and spatial distance before reintroducing color.
2. **The Squint Test**: Defocus or blur your vision while viewing the layout. What element dominates your field of view? That element must be your primary message. If multiple elements compete equally, the hierarchy is broken.

---

## 2. The Six Invariant Principles

### Principle 1: The Grid is the Design
* Build every layout upon a modular grid (standard: **12 columns** on desktop, collapsing rationally to **4 columns** on tablet and **1–2 columns** on mobile).
* Use a fixed base unit (standard: **8px**) for all vertical and horizontal intervals (8px, 16px, 24px, 32px, 48px, 64px, 96px, 128px).
* Avoid arbitrary percentage widths or magic-number offsets. Every edge must align with a grid line.

### Principle 2: Mobile-First & Controlled Asymmetry
* Begin with the narrowest viewport (320px) to guarantee total clarity, then scale systematically to large displays (1440px+).
* Desktop asymmetry must be mathematically anchored to grid tracks (e.g., an 8:4 or 7:5 column split). When scaling down, asymmetric compositions must gracefully collapse into clean, single-column vertical sequences.

### Principle 3: Whitespace as Structural Volume
* Whitespace (*negative space*) is an active visual volume, not unused canvas.
* Generous spatial margins create breathing room, enhance perceived value, and isolate focal anchors. Never crowd elements together simply because space exists.

### Principle 4: Hierarchy via Opacity, Not Hue Churn
* Establish contrast and reading order by adjusting **scale, weight, and opacity**—never by introducing a spectrum of decorative colors.
* Text hierarchy standard:
  * **Primary (100% opacity)**: Essential headlines, key figures, active focal points.
  * **Secondary (70% opacity)**: Section subtitles, body copy, key labels.
  * **Tertiary / Meta (40% opacity)**: Captions, dates, units, index numbers, technical metadata.
  * **Ghost / Border (12%–20% opacity)**: Hairline structural rules, table dividers.

### Principle 5: Single Signal Accent Color
* A palette consists of a neutral baseline (paper light or architectural dark) plus **one primary signal accent** (e.g., Swiss Red `#e8341c`, Cobalt Blue `#003b8e`, or Signal Teal `#14b898`).
* Use the signal color with extreme restraint: for interactive anchors, primary actions, active state markers, or critical status cues. If everything is colorful, nothing has priority.

### Principle 6: Narrow Reading Columns
* Paragraph text must strictly adhere to an optimal line length: **45 to 65 characters** (`max-width: 60ch`).
* Unconstrained full-width text blocks cause eye fatigue and destroy reading rhythm.

---

## 3. Typographic Architecture & Rules

Swiss Design is defined by objective, unadorned **Grotesque / Neo-Grotesque** typography.

### Font Selection & Character
* **Primary Family**: Pure Grotesque or Neo-Grotesque (e.g., Helvetica, Neue Haas Grotesk, Akzidenz-Grotesk, Barlow, IBM Plex Sans, Inter, or system sans-serif).
* **Technical / Tabular Data**: Clean monospace (e.g., JetBrains Mono, Roboto Mono, SF Mono) for numeric matrices, serials, and timestamps.
* **Prohibited**: Script fonts, decorative novelty fonts, whimsical display fonts, or unmotivated serif/sans clashes.

### Typographic Hierarchy Ratio

| Role | Weight | Relative Scale | Case & Tracking | Alignment |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | Bold or Heavy (700–800) | `clamp(2.5rem, 5vw, 4.5rem)` | Tight tracking (`-0.03em`), leading `0.95–1.05` | Flush-left |
| **Section Title H2** | Bold (700–800) | `clamp(1.75rem, 3vw, 2.5rem)` | Tight tracking (`-0.02em`), leading `1.15–1.2` | Flush-left |
| **Module Title H3** | SemiBold / Bold (600–700) | `1.25rem – 1.5rem` | Normal / subtle tight tracking, leading `1.25` | Flush-left |
| **Body Paragraph** | Regular (400) | `0.9375rem – 1.0625rem` | Normal tracking, leading `1.6–1.7`, `max-w: 60ch` | Flush-left, ragged-right |
| **Eyebrow / Section Label** | Bold (700) | `0.6875rem – 0.75rem` | Uppercase, wide tracking (`+0.12em` to `+0.15em`) | Flush-left |
| **Metadata / Index** | Medium (500) | `0.75rem – 0.8125rem` | Monospace, `font-variant-numeric: tabular-nums` | Flush-left or Right-aligned |

### Typographic Hygiene Checklist
* **Alignment**: Always use **flush-left, ragged-right** for body text. Never center longform paragraphs; never justify text with uneven word gaps.
* **Widow Prevention**: Employ balanced line breaks on headlines (`text-wrap: balance`).
* **Punctuation Standards**:
  * Use the true ellipsis character `…` (`&#8230;`), never three periods `...`.
  * Use the en-dash `–` (`&ndash;`) for number/date ranges (e.g., `1960–1972`, `Index 01–08`).
  * Use true typographic quotes `“` `”` and `‘` `’`, never straight programming quotes `"` `'`.
* **Tabular Numbers**: Always declare `font-variant-numeric: tabular-nums` on tabular data, counters, and pricing tables so digits align vertically.

---

## 4. Universal Color & Contrast Tokens

Regardless of color names, structure colors into clear functional roles:

### Universal Token Hierarchy (CSS Custom Properties)

```css
:root {
  /* Surface & Ink (Light Mode: High contrast paper) */
  --color-canvas: #f8fafa;       /* Crisp, cool background */
  --color-surface: #ffffff;      /* Module plate background */
  --color-hairline: #deeae9;     /* 1px structural division line */
  --color-ink-primary: #001e1c;  /* 100% contrast primary text */
  --color-ink-secondary: rgba(0, 30, 28, 0.70); /* Supporting information */
  --color-ink-tertiary: rgba(0, 30, 28, 0.40);  /* Labels, metadata */
  
  /* Signal Accent (Single active color) */
  --color-signal: #14b898;       /* Primary signal for focus/action */
  --color-signal-subtle: rgba(20, 184, 152, 0.10); /* Quiet tint */
  
  /* Spatial Units */
  --unit-base: 8px;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Architectural Dark (Avoid pitch black #000000) */
    --color-canvas: #001e1c;
    --color-surface: #002b27;
    --color-hairline: #134e43;
    --color-ink-primary: #f8fafa;
    --color-ink-secondary: rgba(248, 250, 250, 0.70);
    --color-ink-tertiary: rgba(248, 250, 250, 0.40);
    
    --color-signal: #2bd4b5;
    --color-signal-subtle: rgba(43, 212, 181, 0.15);
  }
}
```

---

## 5. Architectural Component Vocabulary

### The Five Canonical Swiss Patterns

1. **Hairline Spec Table**:
   * Data presented in strict tabular grids with continuous 1px hairline rules.
   * Monospace digits aligned right with tabular figures; labels aligned left.
2. **Numbered Index Rail**:
   * Systematic sequential index markers (`01`, `02`, `03`) preceding module titles.
   * Clarifies process, navigation, or chapter structure without decorative icons.
3. **Rectangular Plate Modules (Bento Architecture)**:
   * Self-contained content areas defined by **hairline borders and subtle tonal contrast**, rather than soft blurry shadows.
   * Corner radius: either sharp (`0px`) or disciplined micro-radius (`8px–12px`). Never balloon-like or over-rounded.
4. **Captioned Documentary Media**:
   * High-contrast photography, schematic diagrams, or technical vectors.
   * Full-bleed or strictly flush with the grid boundary. Accompanied by a quiet, structured caption beneath the image.
5. **Structural Hairline Dividers (Rules)**:
   * Clean horizontal or vertical rules (`1px solid var(--color-hairline)`) that compartmentalize content areas without requiring heavy container nesting.

---

## 6. Motion & Interactive Restraint

Swiss Design values stability and intentionality over theatrics. Motion must provide functional reassurance rather than entertainment.

* **Motion Dial**: Restrict motion to **low intensity (Level 1–3)**.
* **Permitted Properties**: Only animate `transform` and `opacity`. Never animate `width`, `height`, `margin`, or coordinate offsets.
* **Duration & Easing**: Short durations (120ms to 200ms) with clean cubic-bezier easing (`ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`).
* **Allowed Effects**:
  * Precision line-drawing or hairline reveals.
  * Subtle vertical fade-shifts (4px–8px translate).
  * Instantaneous or crisp hover transitions on text underlines and active borders.
* **Strictly Prohibited**:
  * Continuous floating or bobbing loops.
  * Elastic bounce, wobble, or jelly physics.
  * Decorative particle effects, smoke, or canvas noise.

---

## 7. Anti-AI Slop Guardrails (Forbidden Patterns)

When reviewing or creating interfaces, immediately reject and correct these common AI tropes:

| AI Slop Anti-Pattern | Swiss Correction |
| :--- | :--- |
| **Purple/Neon gradient text on H1** | Solid, high-contrast grotesque type in primary ink color. |
| **Nested box inside box (card spam)** | Single-level modules separated by 1px hairline rules or generous whitespace. |
| **Floating colored blur orbs in background** | Clean, flat, architectural canvas without decorative light leaks. |
| **Generic heavy drop-shadows (`shadow-2xl`)** | 1px hairline borders (`border: 1px solid var(--color-hairline)`) and subtle tonal shifts. |
| **Centered long paragraphs** | Left-aligned, ragged-right typography constrained to `max-w: 60ch`. |
| **Emoji decoration in headers and labels** | Plain text labels or precision geometric symbols with identical stroke weights. |
| **Generic empty fluff copy** ("*Empower your journey*") | Specific, concise, descriptive headers with factual clarity. |

---

## 8. Universal Implementation Blueprint (Pure HTML & CSS)

This minimal reference demonstrates the 12-column modular grid, hairline division, grotesque hierarchy, and index rail using standard HTML5 and CSS:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swiss International Style Specification</title>
  <style>
    :root {
      --canvas: #f8fafa;
      --surface: #ffffff;
      --hairline: #deeae9;
      --ink-primary: #001e1c;
      --ink-secondary: rgba(0, 30, 28, 0.70);
      --ink-tertiary: rgba(0, 30, 28, 0.40);
      --signal: #0f7662;
      --font-grotesque: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --canvas: #001e1c;
        --surface: #002b27;
        --hairline: #134e43;
        --ink-primary: #f8fafa;
        --ink-secondary: rgba(248, 250, 250, 0.70);
        --ink-tertiary: rgba(248, 250, 250, 0.40);
        --signal: #2bd4b5;
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--canvas);
      color: var(--ink-primary);
      font-family: var(--font-grotesque);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 48px 24px;
    }

    /* 12-Column Modular Grid */
    .swiss-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 24px;
    }

    .lead-module {
      grid-column: span 12;
      background: var(--surface);
      border: 1px solid var(--hairline);
      padding: 48px;
    }

    @media (min-width: 768px) {
      .lead-module { grid-column: span 8; }
      .side-module { grid-column: span 4; }
    }

    .side-module {
      grid-column: span 12;
      background: var(--surface);
      border: 1px solid var(--hairline);
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .eyebrow {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--signal);
      margin-bottom: 16px;
    }

    h1 {
      font-size: clamp(2.25rem, 4vw, 3.5rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 24px;
      text-wrap: balance;
    }

    p {
      color: var(--ink-secondary);
      font-size: 1rem;
      max-width: 60ch;
    }

    .metric-value {
      font-family: var(--font-mono);
      font-size: 3.5rem;
      font-weight: 700;
      color: var(--signal);
      font-variant-numeric: tabular-nums;
      margin: 24px 0;
    }

    .spec-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
    }

    .spec-table th, .spec-table td {
      border-bottom: 1px solid var(--hairline);
      padding: 12px 0;
      text-align: left;
      font-size: 0.875rem;
    }

    .spec-table td:last-child {
      text-align: right;
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body>
  <main class="container">
    <div class="swiss-grid">
      <!-- Lead Module -->
      <section class="lead-module">
        <div class="eyebrow">01 // MODULAR SYSTEM</div>
        <h1>Objective clarity through disciplined reduction.</h1>
        <p>
          Information arranged along strict geometric coordinates. Every element earns its position through semantic utility rather than arbitrary decoration.
        </p>
      </section>

      <!-- Side Specification Rail -->
      <aside class="side-module">
        <div>
          <div class="eyebrow">02 // METRICS</div>
          <div class="metric-value">99.8%</div>
        </div>
        <table class="spec-table">
          <tr>
            <th>Grid Track</th>
            <td>12-COL</td>
          </tr>
          <tr>
            <th>Base Unit</th>
            <td>8px</td>
          </tr>
          <tr>
            <th>Reading Width</th>
            <td>&le; 60ch</td>
          </tr>
        </table>
      </aside>
    </div>
  </main>
</body>
</html>
```
