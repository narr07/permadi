---
name: en-artikelgen
description: In-depth SEO-driven blog article generator for English content powered by Google Trends intelligence, bilingual technical translator (EN <-> ID) with Nuxt Content MDC syntax protection, and flat design visual illustration generator with teal/emerald brand palette (#14b898). Use when drafting new English blog posts, researching real-time Google search trends, optimizing on-page SEO, translating articles (content/en <-> content/id), or generating blog prompt assets.
license: MIT
---

# EN-ArtikelGen: SEO Content (Google Trends Driven), Translator & Visual Studio

Specialized skill for the English blog publishing workflow within the Nuxt Content ecosystem (`content/en/blog` & `content/id/blog`). It integrates 4 primary capabilities:

1. **Google Trends Intelligence**: Fetch real-time Google search trend data (`daily-trends`, `realtime-trends`, `autocomplete`, `related-queries`, `related-topics`) to discover rising breakout queries, evaluate search interest, and provide trending angle suggestions before drafting.
2. **Article Generator (English SEO-Driven & MDC)**: Craft 1,500–2,000+ word comprehensive articles using the BLUF methodology, active voice, trend-backed on-page SEO, and native Nuxt MDC components.
3. **Technical Translator (EN ↔ ID)**: Accurately translate blog articles while preserving 100% of MDC syntax, frontmatter schema, code blocks, and internal asset paths.
4. **Brand Visual Generator**: Produce flat vector illustration prompts and guidelines (16:9 Landscape) strictly tailored to the brand's teal/emerald palette (#14b898).

---

## Operational Modes & When to Use

| Mode | User Trigger / Request | Primary Reference |
|---|---|---|
| **📈 Research & Write Article** | "Write an article about X with Google Trends", "Generate an SEO blog post on Y" | [references/article-generator-seo.md](references/article-generator-seo.md) |
| **🌐 Translate** | "Translate this post to Indonesian/English", "Sync blog content" | [references/translator.md](references/translator.md) |
| **🎨 Visuals & Images** | "Create image prompt for this article", "Generate featured banner" | [references/image-generator.md](references/image-generator.md) |

---

## 0. Google Trends Research Workflow (Pre-Writing)

Before drafting an article, leverage Google Trends script commands to identify rising search interest:

```bash
# Autocomplete search suggestions
node .agents/skills/en-artikelgen/scripts/trends.mjs autocomplete "<keyword>" --hl en-US

# Daily / real-time trending topics
node .agents/skills/en-artikelgen/scripts/trends.mjs daily-trends --geo US
node .agents/skills/en-artikelgen/scripts/trends.mjs realtime-trends --geo US --hours 24

# Related queries & breakout topics
node .agents/skills/en-artikelgen/scripts/trends.mjs related-queries "<keyword>" --geo US
node .agents/skills/en-artikelgen/scripts/trends.mjs related-topics "<keyword>" --geo US
```

Provide a brief **Google Trends Recommendation Summary** to the user prior to the code block:
- *Top Trending Angle*: The highest intent sub-topic or current breakout theme.
- *Recommended Secondary Keywords*: High-velocity search terms to incorporate.

---

## 1. Writing Standards & Content Format (Quick Ref)

- **Default Language**: Native, natural, professional English.
- **Grammar & Sentence Patterns**: Active voice (≥85%), present tense for facts/instructions, varied rhythm (Flesch Reading Ease 60–70).
- **BLUF (Bottom Line Up Front)**: First sentence of every section (`##`) immediately delivers the core takeaway or answer.
- **Paragraphs**: 2–4 sentences per paragraph. Eliminate dense text walls.
- **Hook & Outcome**: Primary keyword and the core value proposition must appear naturally in the first 100 words.
- **Links**: Minimum 2–3 internal links (`/blog/related-slug`) and 2–3 external authoritative citations.
- **Closing & FAQ Components**:
  - Closing section MUST use `::conclusion ... ::`.
  - FAQ at the end MUST use `::faq` + `::faq-item{question="..."}` (or `::accordion`).
- **Output Presentation**: ALWAYS provide the final article draft in **ONE** complete fenced code block `~~~~md ... ~~~~` (from YAML frontmatter to the final FAQ) for seamless copying into a `.md` file. All commentary/notes to the user must reside outside the code block.

### Standard Frontmatter Schema (`content/en/blog` / `content/id/blog`)

```yaml
---
title: "Engaging Article Title with Keyword: Value Proposition"
category: technology
date: YYYY-MM-DD
description: Compelling 140-160 character meta description featuring the primary keyword and a clear call-to-read.
tags:
  - tag1
  - tag2
---
```

---

## 2. Nuxt Content MDC Component Cheatsheet

Use semantically correct MDC components:

| Need | MDC Syntax | Purpose |
|---|---|---|
| **Conclusion** | `::conclusion ... ::` | Summarize outcome & guide reader choice |
| **FAQ Accordion** | `::faq` <br> `::faq-item{question="..."} ... ::` <br> `::` | 3–5 essential collapsible questions |
| **Note / Info** | `::note ... ::` | Supplementary background context |
| **Tip / Recommendation** | `::tip ... ::` | Best practices & efficiency suggestions |
| **Warning** | `::warning ... ::` | Potential pitfalls & things to watch out for |
| **Caution** | `::caution ... ::` | Destructive actions / critical errors |
| **Sequential Steps** | `::steps` <br> `### Title Without Number` <br> `::` | Step numbers auto-render; do not hardcode numbers |
| **Option Tabs** | `::tabs` <br> `:::tabs-item{label="..."}` <br> `::` | Side-by-side alternatives / tab views |
| **Image Carousel** | `::carousel` (YAML items) | Multi-image gallery |
| **CTA Button** | `:u-button{to="..." label="..." icon="..."}` | External link or action button |
| **Inline Badge** | `:badge[text]{color="primary"}` | Status, version, or highlighted term |

---

## 3. Translation Engine Rules (EN ↔ ID)

When translating between `content/en/blog` and `content/id/blog`:
1. **Keep 100% Intact (DO NOT translate or modify)**:
   - All fenced code blocks (` ``` `) and inline code (`` `code` ``).
   - MDC component tags (`::conclusion`, `::faq`, `::steps`, etc.) and prop keys (`question="..."`, `label="..."`).
   - YAML frontmatter keys (`title:`, `category:`, `date:`, `description:`, `tags:`).
   - Slugs, dates, URL links, and asset image paths (e.g. `/article/font3.webp`).
2. **Translate**:
   - Narrative frontmatter values (`title`, `description`), heading titles, body paragraphs, callout text, and FAQ questions/answers.
3. Preserve identical heading levels (#, ##, ###) and component positioning 1-to-1.

---

## 4. Visual Identity & Brand Palette (#14b898)

Every illustration and featured banner must strictly conform to the brand visual system:
- **Style**: Flat vector illustration, clean sharp outlines, minimalist cartoon, modern.
- **Aspect Ratio**: 16:9 Landscape (standard web featured banner).
- **Strict Restrictions**: NO text/typography inside images, no watermarks, no 3D renders, no photorealistic elements.
- **Brand Palette Roles**:

| Role | Hex | Description |
|---|---|---|
| **Background (Light)** | `#f0fdfa` (50), `#ccfbf2` (100) | Pale mint / soft greenish off-white |
| **Bright Accents** | `#99f6e4` (200), `#5eeacf` (300), `#2bd4b5` (400) | Bright light teal |
| **Primary Brand Focus** | `#14b898` (500) | Vibrant teal / emerald (main subject/character) |
| **Dark Accents (Depth/Shadow)**| `#0d947a` (600), `#0f7662` (700), `#115e4f` (800) | Dark greenish teal |
| **Line Art (Outlines)** | `#134e43` (900) | Deep dark forest green outline |
| **Deepest Contrast** | `#042f27` (950) | Near-black green for minor details |

- **Image Alt Text**: Maximum 125 characters, descriptive, naturally embedding the primary keyword.

---

## Detailed References (Load as Needed)

- 📖 [references/article-generator-seo.md](references/article-generator-seo.md): Google Trends Integration, English 9-Stage SEO Checklist, BLUF guidelines, wordiness elimination table, and complete draft template.
- 🎨 [references/image-generator.md](references/image-generator.md): AI prompt templates, visual composition rules, and WebP asset standards.
- 🌐 [references/translator.md](references/translator.md): Technical translation workflow preserving MDC and code integrity.
