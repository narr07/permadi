# Blog Translation Engine Reference (EN ↔ ID)

Technical specification for bidirectional translation between English and Indonesian blog articles within Nuxt Content, ensuring 100% integrity of code, MDC syntax, and frontmatter.

---

## 1. Core Principle: Structural & Code Integrity

Preserving code and syntax accuracy is paramount. Translation must never break MDC parsing, corrupt component attributes, or alter internal file routing.

---

## 2. Elements That MUST Remain 100% Intact (Do Not Translate)

| Element | Example | Rule |
|---|---|---|
| **Fenced Code Blocks** | ````bash [Terminal] ... ```` | Keep entire block and inner code unchanged |
| **Inline Code** | `` `nuxt.config.ts` ``, `` `TrueType` `` | Leave verbatim inside backticks |
| **MDC Component Tags** | `::conclusion`, `::faq`, `::steps`, `::tip`, `::note` | NEVER translate component names |
| **MDC Slot Names** | `#default`, `#header` | NEVER translate slot names |
| **YAML Frontmatter Keys**| `title:`, `category:`, `date:`, `description:`, `tags:` | Keys must remain standard lowercase English |
| **Static Frontmatter Values** | `date: 2026-03-06`, `category: art` | Keep non-narrative metadata identical |
| **Asset Paths & URLs** | `](/article/font3.webp)`, `](/blog/font-history)` | Keep all paths, anchors, and URLs identical |
| **Brand & Tech Names** | `Nuxt`, `Apple`, `Adobe`, `PostScript` | Preserve canonical brand terminology |

---

## 3. Elements to Translate

1. **Frontmatter Prose**:
   - `title`: Translate persuasively with target-language SEO adjustments.
   - `description`: Translate while maintaining 140–160 character limit.
   - `tags`: Adjust to target-language equivalents where appropriate (e.g. `font`, `designer`).
2. **Body Prose**:
   - All heading text (`#`, `##`, `###`).
   - Body paragraphs, bullet lists, and blockquotes.
   - Image alt text: `![Target language descriptive alt text](/article/image.webp)`.
   - Callout narratives (`::note`, `::tip`, `::conclusion`).
   - MDC text prop values: `::faq-item{question="Translated question?"}`.

---

## 4. Execution Workflow

1. **Detect Source & Target**:
   - From `content/en/blog/*.md` → Translate into Indonesian for `content/id/blog/*.md`.
   - From `content/id/blog/*.md` → Translate into English for `content/en/blog/*.md`.
2. **Quality & Natural Flow**:
   - Ensure native fluency without robotic literal word-for-word translation.
   - Clarify ambiguous technical terms before translating.
3. **Output Presentation**:
   - Return translated content within ONE complete fenced code block (`~~~~md ... ~~~~`).
   - Guarantee exact 1-to-1 parity of heading hierarchy and component ordering.
