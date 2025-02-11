# permadi.dev

This is a Nuxt.js project configured with various useful modules and features. The app is built using Nuxt 3 and includes functionalities such as internationalization, image optimization, SEO optimization, social media sharing, security headers, and more.

## Features

- **Modules**: Uses a set of Nuxt modules for improving app functionality:
- [`@nuxt/eslint`](https://eslint.nuxt.com/): Linting configuration.
- [`@nuxtjs/i18n`](https://i18n.nuxtjs.org/): Internationalization support with multiple languages.
- [`@nuxt/image`](https://image.nuxt.com/): Image optimization.
- [`@vueuse/nuxt`](https://vueuse.org/): Useful Vue composition API utilities.
- [`nuxt-security`](https://nuxt-security.vercel.app/): Enhances security headers.
- [`@nuxt/content`](https://content.nuxt.com/): Content management.
- [`@nuxtjs/seo`](https://nuxtseo.com/): SEO optimization.
- [`@stefanobartoletti/nuxt-social-share`](https://nuxt-social-share.stefanobartoletti.it/): Social media share buttons.
- [`@nuxthub/core`](https://hub.nuxt.com/): Integrates with Nuxthub for previewing and deployment.

## Installation

### Prerequisites

- Node.js
- pnpm (package manager)

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/narr07/permadi
   cd permadi
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables (if needed).

### Development

Run the development server:

```bash
pnpm dev
```

### Build

To build the project for production:

```bash
pnpm build
```

### Generate Static Files

For static site generation:

```bash
pnpm generate
```

### Preview

Preview the site:

```bash
pnpm preview
```

### Deploy

To deploy using Nuxthub:

```bash
pnpm deploy
```

## Configuration

The project includes several custom configurations in `nuxt.config.js`, including:

- **Content Database**: The project uses `d1` for the content database, bound to `permadi`.
- **Social Share**: Base URL is set to `https://permadi.dev`.
- **SEO**: Site metadata like description, URL, and locale are pre-configured.
- **Security**: Security headers like `ContentSecurityPolicy`, `X-Frame-Options`, and `ReferrerPolicy` are enabled for better app protection.

## Localization

This app is set up with two languages:

- `id`: Indonesian
- `en`: English

It uses `@nuxtjs/i18n` to detect and manage languages, with support for lazy loading of translation files.

## Performance Optimization

The project uses `nuxt-booster` for detecting performance issues and optimizing SSR. Key configurations include:

- **Lazy Loading**: Components and assets are lazily loaded.
- **Image Optimization**: Images are optimized with the `ipx` provider and support for `webp` format.

## Scripts

- **Build**: `pnpm build`
- **Development**: `pnpm dev`
- **Generate**: `pnpm generate`
- **Preview**: `pnpm preview`
- **Deploy**: `pnpm deploy`
- **Lint**: `pnpm lint`
- **Fix Linting**: `pnpm lint:fix`

## Deployment

To deploy the app, you can use `Nuxthub` for easy deployment:

```bash
pnpm deploy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Nuxt.js](https://nuxtjs.org/)
- [Vue.js](https://vuejs.org/)
- [pnpm](https://pnpm.io/)

---

Feel free to make contributions or raise issues to help improve the project.
