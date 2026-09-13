---
name: en-artikelgen
description: In-depth SEO-driven blog article generator for English content with Human-Grade tone (Anti-AI Writing Style) powered by Google Trends intelligence, bilingual technical translator (EN <-> ID) with Nuxt Content MDC syntax protection, and flat design visual illustration generator with teal/emerald brand palette (#14b898). Fully compatible with Gemini Spark and IDEs. Use when drafting new English blog posts, researching real-time Google search trends, optimizing on-page SEO, translating articles (content/en <-> content/id), or generating blog prompt assets.
license: MIT
---

# EN-ArtikelGen: Human-Grade SEO Content (Google Trends Intelligence), Translator & Visual Studio

Specialized skill for the English blog publishing workflow within the Nuxt Content ecosystem (`content/en/blog` & `content/id/blog`), enforcing **authentic human practitioner writing standards (*Anti-AI Voice*)** without robotic buzzwords or uniform sentence patterns.

---

## 🧠 MANDATORY HUMAN-GRADE WRITING RULES (ANTI-AI PROTOCOL)

Every generated article **MUST PASS HUMAN REVIEW**. No corporate filler, formulaic structure, or robotic tone.

### 1. Banned AI Buzzwords & Robotic Clichés (STRICTLY PROHIBITED)

| Category | ❌ Banned AI Clichés | ✅ Human Practitioner Alternative |
| :--- | :--- | :--- |
| **Introductory Fluff** | *"In today's fast-paced digital world...", "In the ever-evolving landscape of...", "In recent years, technology has revolutionized..."* | Open directly with the core problem, a counterintuitive observation, or a real-world dilemma. |
| **Meta-Talk & Filler** | *"Let's delve into...", "Dive deep into...", "It is important to note that...", "Needless to say..."* | Remove the meta-talk completely. Deliver the factual argument directly. |
| **Empty Buzzwords** | *"Game-changer", "Revolutionize", "Tapestry", "Beacon of", "Crucial role", "Harness the power", "Paradigm shift"* | Use concrete engineering or instructional metrics (*"cuts cold-start latency by 40%"*). |
| **Repetitive Transitions** | *"Furthermore,", "Moreover,", "In addition,", "Additionally,"* (at every paragraph start) | Connect paragraphs via natural train of thought, rhetorical questions, or cause-and-effect bridges. |
| **Formulaic Conclusions** | *"In conclusion,", "To sum up,", "All in all,", "In summary...", "Ultimately,..."* | Deliver an **Actionable Decision Framework** (when to choose Option A vs Option B). |

---

### 2. Sentence Length Dynamics (*High Burstiness*)
AI models default to uniform sentence lengths (~15–20 words). Human writing features a natural musical cadence:
* **Ultra-Short Sentences (1–5 words)**: For emphasis, punches, and sharp transitions (*"The result? Complete silence."*, *"Don't do this."*, *"Classroom reality hits differently."*).
* **Medium Sentences (10–18 words)**: For clear, direct instructional points.
* **Long Flowing Sentences (20–35 words)**: To articulate nuanced logic, conditionals, or real-world trade-offs.
* **Dynamic Paragraph Heights**: Mix 1-sentence punch paragraphs with 3–4 sentence explanatory blocks. Never produce identical text walls.

---

### 3. Practitioner Experience & Real-World Friction
* **Acknowledge Downsides & Trade-offs**: Every architectural pattern or teaching method has costs. Point out limitations honestly (*"This approach is blazing fast, but memory usage scales linearly with active WebSocket connections."*).
* **Common Pitfalls & Anti-Patterns**: Highlight mistakes that practitioners actually make in production or in the classroom.
* **Have a Firm Stance**: Take a decisive perspective based on engineering/pedagogical reality rather than safe, generic middle-ground summaries.

---

## 0. Google Trends Research in Gemini Spark (Pre-Writing Intelligence)

Gemini Spark utilizes native **Google Search & Google Trends web grounding** to discover real-time search interest before drafting:

1. **Trend Discovery & Query Mapping**:
   - Extract current breakout queries and rising topics from Google Trends.
   - Aggregate high-frequency *People Also Ask* queries and search autocomplete patterns.
2. **Present Trending Angle Summary (Before Code Block)**:
   - *Top Trending Angle*: 2–3 high-interest angles backed by actual search intent.
   - *Recommended Secondary Keywords*: High-velocity target search terms.
3. **Integrate into Content Hierarchy**:
   - Primary breakout keyword must appear in the **H1 Title** and naturally within the **first 100 words**.
   - Sub-queries are converted into section subheadings (`##` and `###`).
   - Frequent user questions are mapped into `::faq` + `::faq-item` components.

---

## 1. Writing Standards & Content Format (Quick Ref)

- **Default Language**: Native, natural, engaging professional English.
- **Hook & Direct Answer (BLUF Chunk)**: Deliver a concise definitive answer/problem diagnosis in **40–60 words (~250–400 characters)** within the opening section for Google Featured Snippets & AI answers.
- **Paragraphs**: Keep regular text paragraphs between **1 sentence (~50–100 chars)** and **2–4 sentences (< 5 lines on mobile)** to avoid walls of text.
- **Featured Image (Shared Single Asset)**: Use the **EXACT SAME image path and filename** as the ID version (e.g. `![Descriptive English alt text](/article/slug-name.webp)`), only varying the alt text (**min 10 characters, max 125 characters**).
- **Links**: Minimum 2–3 internal links (`/blog/related-slug`) and 2–3 external authoritative citations.
- **Closing & FAQ Components**:
  - Closing section MUST use `::conclusion ... ::` (Decision Guide).
  - FAQ at the end MUST use `::faq` + `::faq-item{question="..."}`.
- **Output Presentation**: ALWAYS provide the final article draft in **ONE** complete fenced code block `~~~~md ... ~~~~`.

### 📏 Character & Word Limits Protocol (Google SEO, AEO & GEO Standards)

| Element | Minimum | Maximum / Target | SEO & AI Search (AEO/GEO) Rationale |
| :--- | :--- | :--- | :--- |
| **Title Tag (`title`)** | 50 chars | 58–60 chars (~550 px) | Total $\le$ 70 chars with suffix ` \| Permadi`. Prevents SERP truncation and rewrite. |
| **Meta Description** | 70 chars | 105 chars (Mobile) / 135–160 (Desktop) | Prevents clipping on mobile screens while optimizing desktop SERP snippet CTR. |
| **URL Slug** | 10 chars | 17–40 chars (< 5 words) | Medium-length slugs (especially 21–25 chars) achieve the highest citation rate in AI search. |
| **H1 Tag** | 20 chars (~3–4 words) | 60–70 chars (~8–10 words) | Aligned with Title tag; clear, punchy topical foundation. |
| **H2 & H3 Subheadings** | 15 chars (~2–3 words) | 50–60 chars (4–8 words) | Focused scanning for human readers and clean semantic parsing for LLM indexers. |
| **Direct Answer (BLUF)** | 40 words (~250 chars) | 60 words (~400 chars) | Optimal window to trigger Google Featured Snippets and instant AI Overviews. |
| **Regular Paragraph** | 1 sentence (~50–100 chars) | 2–4 sentences (< 5 mobile lines) | Eliminates mobile fatigue and forms self-contained modular chunks. |
| **Image Alt Text** | 10 chars | 125 chars | Screen reader accessibility and Google image indexer prioritization. |

### Standard Frontmatter Schema (`content/en/blog` / `content/id/blog`)
* **`title`**: **Min 50, Max 50–58 characters** (strictly **<= 70 characters with spaces** including the site suffix ` | Permadi`). **AVOID COLONS (`:`) IN TITLES** unless strictly necessary; write natural, fluid headlines instead of formulaic `Topic: Subtopic`.
* **`description`**: **Min 70 chars, 105 chars (safe mobile limit), up to 135–160 characters (desktop)**. Compelling meta description with primary keyword.
* **URL Slug**: **10–40 characters** (< 5 words, sweet spot 21–25 chars).
* **`tags`**: 3–5 target keywords, **all of which MUST appear 1–3 times in the body text** (TF-IDF completeness).

```yaml
---
title: "Practical Guide to Modern Graphic and UI Design" # Natural headline without colons, 50-58 chars (total <= 70)
category: technology
date: YYYY-MM-DD
description: Practical guide to choosing modern graphic and UI design styles for functional and engaging web interfaces. # 70-105 chars (mobile) / 135-160 (desktop)
tags:
  - primary-keyword
  - secondary-keyword
  - lsi-keyword
---
```

---

## 2. Nuxt Content MDC Component Cheatsheet

| Need | MDC Syntax | Purpose |
|---|---|---|
| **Conclusion** | `::conclusion ... ::` | Outcome-driven decision guide |
| **FAQ Accordion** | `::faq` <br> `::faq-item{question="..."} ... ::` <br> `::` | 3–5 essential collapsible questions |
| **Note / Info** | `::note ... ::` | Supplementary background context |
| **Tip / Recommendation** | `::tip ... ::` | Field-tested practitioner advice |
| **Warning** | `::warning ... ::` | Critical pitfalls & anti-patterns |
| **Caution** | `::caution ... ::` | High-risk operations / errors |
| **Sequential Steps** | `::steps` <br> `### Title Without Number` <br> `::` | Step numbers auto-render |

---

## 3. Translation Engine Rules (EN ↔ ID)

When translating between `content/en/blog` and `content/id/blog`:
1. **Keep 100% Intact (DO NOT translate or modify)**:
   - All fenced code blocks (` ``` `) and inline code (`` `code` ``).
   - MDC component tags (`::conclusion`, `::faq`, `::steps`, etc.) and prop keys (`question="..."`).
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

## Detailed References

- 📖 [references/article-generator-seo.md](references/article-generator-seo.md): Trends Research, 9-Stage SEO Checklist, Anti-AI Protocol, and complete template.
- 🎨 [references/image-generator.md](references/image-generator.md): AI prompt templates, visual composition rules, and WebP asset standards.
- 🌐 [references/translator.md](references/translator.md): Technical translation workflow preserving MDC and code integrity.
