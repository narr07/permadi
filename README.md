# 🌐 Permadi.dev — Portfolio & Technical Blog

<div align="center">

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.5.2-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.5.41-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-Atomic%20CSS-333333?style=flat&logo=unocss&logoColor=white)](https://unocss.dev)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=flat&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Bun](https://img.shields.io/badge/Package%20Manager-Bun-FBF0DF?style=flat&logo=bun&logoColor=black)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Personal Portfolio, Showcase of Projects & Technical Blog of Dinar Permadi Yusup (Permadi).**  
Live Website: [https://permadi.dev](https://permadi.dev)

</div>

---

## 🌟 Key Features

### 🍱 1. Modern Bento Grid Design System
- **Premium Visual Aesthetics**: Embraces the *Bento Grid Layout* philosophy featuring smooth rounded corners (`rounded-bento`), high-contrast subtle borders, glassmorphism, and responsive micro-animations.
- **Harmonious Typography**: A distinct typographic combination of **Barlow** (bold, structured headings) and **Plus Jakarta Sans** (clean, readable body text) structured with Golden Ratio spacing.
- **Dark & Light Mode**: Built-in automatic and manual theme switching via `@nuxtjs/color-mode`, styled with custom *Deep Forest Emerald* tones (`#002420` & `#042f27`).

### 🌐 2. Bilingual Support (i18n)
- **Full Internationalization**: Complete support for **Indonesian (`/id`)** and **English (`/en`)** powered by `@nuxtjs/i18n`.
- **Automatic Slug Mapping**: Seamless language transitions across blog articles and projects using cross-language `idBlog` / `idItem` resolution.
- **Smart Locale Switcher**: Responsive language toggling in the header and mobile navigation drawer.

### 📝 3. Nuxt Content v3 Engine
- **Structured Collections**: Powered by SQLite / Cloudflare D1 local database storage for articles (`blog_id`, `blog_en`) and portfolio projects (`projek_id`, `projek_en`).
- **MDC (Markdown Components)**: Advanced custom Markdown rendering components (`ProseImg`, `ProsePre` with Shiki syntax highlighting, `ProseCode`, and a clean single-row `ContentToc`).
- **Nuxt Studio Integration**: Full compatibility with the Nuxt Studio visual editor for editing and publishing Markdown content.

### 🔌 4. AI-Ready & Nuxt MCP Server Toolkit
- **Model Context Protocol (MCP)**: Native MCP server endpoint at `/mcp` using `@nuxtjs/mcp-toolkit`, enabling direct integration with AI-powered IDEs (Cursor, VS Code, Claude Desktop, Windsurf):
  - **Tools**: `get_profile`, `get_site_info`, `get_tech_stack`, `search_articles`, `search_projects`, `get_article_content`.
  - **Resources**: `permadi://profile`.
  - **Prompts**: `/ask_permadi`, `/explore_project`, `/summarize_article`, `/design_system_consultation` (with dynamic autocomplete queried directly from Nuxt Content).
- **Nuxt LLMs (`nuxt-llms`)**: Bilingual `/llms.txt` standard discovery endpoint and raw markdown access via `/raw/<path>.md`.

### 📡 6. Native Zero-Dependency RSS / ATOM / JSON Feeds
Automated syndication across 3 standard feed formats built with 100% native Nitro server routes (zero external packages):
- **RSS 2.0**: [`/feed.xml`](https://permadi.dev/feed.xml)
- **ATOM 1.0**: [`/feed.atom`](https://permadi.dev/feed.atom)
- **JSON Feed 1.1**: [`/feed.json`](https://permadi.dev/feed.json)

### 📲 7. Bento Social Share & Interactivity
- **Bento Social Share Card**: Interactive sharing buttons located at the footer of each blog post for **X (Twitter)**, **WhatsApp**, **LinkedIn**, **Telegram**, **Threads**, **Facebook**, along with an animated **Copy Link** button providing instant feedback.
- **Table of Contents (TOC)**: Desktop sticky navigation and collapsible mobile table of contents for long-form reading.

### ⚡ 8. Advanced Performance & SEO
- **Cloudflare Pages Edge SSG**: 100% pre-rendered static site generation for sub-100ms global edge delivery.
- **Nuxt SEO Meta-Module**:
  - Dynamic OpenGraph Image generation using Bento Satori templates (`@nuxtjs/og-image`).
  - Automated multi-lingual sitemaps (`/sitemap_index.xml`, `/__sitemap__/id-ID.xml`, `/__sitemap__/en-US.xml`).
  - Structured Schema.org JSON-LD and `robots.txt` generation.
- **Cloudflare Web Analytics (RUM)**: Real-time Core Web Vitals performance telemetry via `@nuxt/scripts` without cookies or third-party tracking overhead.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Nuxt 4.5.2](https://nuxt.com) (with Nitro 2.13.4 & Vite 8.2.1) |
| **UI Library** | [Vue 3.5.41](https://vuejs.org) + [UnoCSS](https://unocss.dev) |
| **Content** | [@nuxt/content v3](https://content.nuxt.com) + [Nuxt Studio](https://nuxt.studio) |
| **AI Assistant** | [Google Gemini API](https://ai.google.dev/) + [Marked](https://marked.js.org/) |
| **Icons** | [@iconify-json/hugeicons](https://hugeicons.com), `@iconify-json/simple-icons`, `@iconify-json/lucide` |
| **i18n** | [@nuxtjs/i18n v10](https://i18n.nuxtjs.org) |
| **SEO & Social** | [@nuxtjs/seo](https://nuxtseo.com), `@stefanobartoletti/nuxt-social-share` |
| **MCP & LLMs** | [@nuxtjs/mcp-toolkit](https://mcp-toolkit.nuxt.dev), [nuxt-llms](https://github.com/harlan-zw/nuxt-llms) |
| **Analytics** | [@nuxt/scripts](https://scripts.nuxt.com) (Cloudflare Web Analytics RUM) |
| **Package Manager** | [Bun](https://bun.sh) |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com) |

---

## 📁 Project Structure

```text
permadi/
├── app/
│   ├── app.vue                  # Root App template, SEO, analytics, and feeds
│   ├── components/              # Vue Components (Bento Header, Share, TOC, etc.)
│   │   ├── ArticleShare.vue     # Bento Social Share component
│   │   ├── ContentToc.vue       # Sticky & Mobile Table of Contents
│   │   ├── AppHeader.vue        # Main Navigation Header & Locale Switcher
│   │   └── content/             # Markdown Prose Custom Components
│   └── pages/                   # File-based Routing (Nuxt 4 app/ directory)
│       ├── index.vue            # Home / Hero Section
│       ├── blog/                # Blog Listing & Dynamic [slug].vue
│       ├── projek/              # Portfolio Showcase & Case Studies
│       ├── tentang.vue          # About Me & Philosophy
│       ├── kontak.vue           # Contact & Social Links
│       └── galeri.vue           # Media & Showcase Gallery
├── content/                     # Markdown Collections (blog_id, blog_en, projek_id, etc.)
├── content.config.ts            # Nuxt Content v3 Collections Schema
├── server/
│   ├── api/                     # Nitro API endpoints (e.g. cloudinary-gallery)
│   ├── mcp/                     # MCP Server definitions
│   │   ├── tools/               # MCP Tools (get_profile, search_articles, etc.)
│   │   ├── resources/           # MCP Resources (permadi://profile)
│   │   └── prompts/             # Dynamic MCP Prompts (ask_permadi, summarize_article, etc.)
│   ├── routes/                  # Native Feed routes (feed.xml, feed.atom, feed.json)
│   └── utils/                   # Server Utilities & Zero-Dependency Feed Generator
├── uno.config.ts                # UnoCSS Configuration & Design Tokens
├── nuxt.config.ts               # Nuxt Configuration
├── .npmrc                       # Build configuration for Cloudflare Pages
└── package.json                 # Project dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Bun](https://bun.sh) (recommended) or Node.js `>= 20.x` installed on your system.

### 2. Environment Variables Setup
Create a `.env` file in the root directory:
```ini
# Optional: Cloudflare Web Analytics & Analytics ID
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 3. Install Dependencies
```bash
bun install
```

### 4. Start Development Server
```bash
bun run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Build for Production
```bash
bun run build
```

### 6. Preview Production Build Locally
```bash
bun run preview
```

---

## 🔌 Connecting IDEs to the MCP Server

You can connect **Cursor**, **VS Code**, or **Claude Desktop** directly to this website's MCP server endpoint to query portfolio items, site architecture, and blog posts:

1. **Local Development**: `http://localhost:3000/mcp`
2. **Production Endpoint**: `https://permadi.dev/mcp`

### Cursor Configuration Example (`.cursor/mcp.json`):
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

## 📄 License

Licensed under the [MIT License](LICENSE).  
Crafted with passion by **[Dinar Permadi Yusup](https://permadi.dev)** (@narr07).
