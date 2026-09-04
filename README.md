# permadi.dev

Personal portfolio and technical blog of Dinar Permadi Yusup.

Live: [https://permadi.dev](https://permadi.dev)

---

## Architecture & Features

### 1. Interface & Design System
- **Layout**: Bento-grid layout with responsive breakpoint scaling (`sm`, `md`, `lg`, `xl`).
- **Styling**: Atomic CSS via [UnoCSS](https://unocss.dev) (`@unocss/nuxt`, preset-wind3, preset-icons, preset-typography). Zero Tailwind runtime dependency.
- **Color Themes**: Light and dark mode support powered by `@nuxtjs/color-mode`, using a deep pine palette (`#002420`, `#042f27`) and high-contrast typography.
- **Typography**: Self-hosted web fonts via `@nuxt/fonts` (Barlow for headings, Plus Jakarta Sans for body text, JetBrains Mono for code).
- **Animations**: Gesture and scroll micro-interactions built with `motion-v`.

### 2. Bilingual Routing (i18n)
- **Engine**: Internationalization via `@nuxtjs/i18n` with route prefixes:
  - English: `/en`
  - Bahasa Indonesia: `/id`
- **Cross-language Resolution**: Synchronized dynamic slug mapping for blog articles and portfolio case studies using shared identifiers (`idBlog`, `idItem`).
- **Locale Switcher**: Header and mobile navigation switcher with automatic browser detection and persistent cookie preference.

### 3. Content Management
- **Engine**: [@nuxt/content v3](https://content.nuxt.com) backed by SQLite / Cloudflare D1 local database storage.
- **Collections**:
  - `blog_id` / `blog_en`: Articles and tutorials.
  - `projek_id` / `projek_en`: Case studies and design archives.
  - `pages_id` / `pages_en`: Static page content.
- **Custom MDC Components**:
  - Code blocks with Shiki syntax highlighting (`ProsePre`).
  - Interactive table of contents (`ContentToc`).
  - Interactive FAQs (`Faq`, `FaqItem`) with automated Schema.org FAQPage generation.
  - Satori Bento OpenGraph social cards (`@nuxtjs/og-image`).

### 4. Model Context Protocol (MCP) & LLM Endpoints
- **MCP Endpoint**: Native server at `/mcp` via `@nuxtjs/mcp-toolkit`. Allows direct connection from AI IDEs (Cursor, VS Code, Claude Desktop, Windsurf):
  - **Tools**: `get_profile`, `get_site_info`, `get_tech_stack`, `search_articles`, `search_projects`, `get_article_content`.
  - **Resources**: `permadi://profile`.
  - **Prompts**: `/ask_permadi`, `/explore_project`, `/summarize_article`, `/design_system_consultation`.
- **LLM Discovery**: Standard `/llms.txt` and raw Markdown endpoints at `/raw/<path>.md` via `nuxt-llms`.

### 5. Content Syndication (Feeds)
Native zero-dependency feed endpoints generated on Nitro server routes:
- **RSS 2.0**: [`/feed.xml`](https://permadi.dev/feed.xml)
- **ATOM 1.0**: [`/feed.atom`](https://permadi.dev/feed.atom)
- **JSON Feed 1.1**: [`/feed.json`](https://permadi.dev/feed.json)

### 6. Performance & SEO
- **Static Edge Delivery**: Pre-rendered via Nitro `cloudflare_pages` preset for Cloudflare Pages global edge distribution.
- **Meta & Structured Data**: Multi-lingual XML sitemaps, `robots.txt`, and Schema.org JSON-LD (`Person`, `BlogPosting`, `ImageGallery`, `BreadcrumbList`) configured via `@nuxtjs/seo`.
- **Cache Headers**: 1-year immutable caching on static assets (`_nuxt/*`, `_fonts/*`, `/icons/*`, `/logo/*`, `*.svg`).

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | [Nuxt 4.5.2](https://nuxt.com) (Nitro 2.13.4, Vite 8.2.2) |
| Core | [Vue 3.5.42](https://vuejs.org) + [TypeScript 5.9.3](https://www.typescriptlang.org) |
| Styling | [UnoCSS 66.10](https://unocss.dev) |
| Content | [@nuxt/content 3.16](https://content.nuxt.com) |
| Motion | [motion-v 2.4](https://motion.dev) |
| Internationalization | [@nuxtjs/i18n 10.6](https://i18n.nuxtjs.org) |
| SEO & OpenGraph | [@nuxtjs/seo 5.3](https://nuxtseo.com) |
| MCP Server | [@nuxtjs/mcp-toolkit 0.19](https://mcp-toolkit.nuxt.dev) |
| Package Manager | [Bun 1.3.14](https://bun.sh) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) |

---

## Project Structure

```text
permadi/
├── app/
│   ├── app.vue                  # App root, global metadata, font injection
│   ├── assets/css/main.css      # Core resets and accessible focus rules
│   ├── components/              # Vue components (Header, TOC, Bento cards, Share)
│   │   └── content/             # MDC components for Markdown rendering
│   └── pages/                   # File-based routes (home, blog, projek, tentang, kontak, galeri)
├── content/                     # Markdown sources organized by locale
│   ├── en/                      # English collections
│   └── id/                      # Indonesian collections
├── content.config.ts            # Content schema definitions (Zod)
├── server/
│   ├── api/                     # Nitro API routes (reactions, views, gallery)
│   ├── mcp/                     # MCP Tools, Prompts, and Resources
│   ├── routes/                  # Static feed endpoints (RSS, ATOM, JSON)
│   └── utils/                   # Server helpers (feed generation, database queries)
├── uno.config.ts                # UnoCSS rules, theme tokens, and shortcuts
├── nuxt.config.ts               # Nuxt modules, routeRules, and headers
└── package.json                 # Scripts and dependencies
```

---

## Development & Deployment

### Prerequisites
- [Bun](https://bun.sh) `>= 1.3` (or Node.js `>= 20.x`)

### Setup
```bash
# Clone the repository
git clone https://github.com/narr07/permadi.git
cd permadi

# Install dependencies
bun install
```

### Commands

| Command | Description |
|---|---|
| `bun run dev` | Start local development server at `http://localhost:3000` |
| `bun run build` | Build static production assets for Cloudflare Pages |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint check |
| `bun run lint:fix` | Fix ESLint issues automatically |
| `bun run audit` | Run Unlighthouse audit on live site |

---

## MCP Server Connection

To connect an AI IDE to the site's local or production MCP server:

- **Local URL**: `http://localhost:3000/mcp`
- **Production URL**: `https://permadi.dev/mcp`

### Configuration (`.cursor/mcp.json` or equivalent)
```json
{
  "mcpServers": {
    "permadi-dev": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

## License

[MIT](LICENSE) © [Dinar Permadi Yusup](https://permadi.dev)
