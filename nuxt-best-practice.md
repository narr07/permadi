# Nuxt accessibility

> Best practices for accessibility in Nuxt apps.

Most of what makes an app accessible is not specific to Nuxt: color contrast, form semantics, and ARIA work the same here as in any Vue or plain HTML application, and the [resources](#useful-resources) at the end of this guide cover them well.

What Nuxt does change is navigation. Once your app has hydrated, it routes on the client, so the document is never reloaded and the browser no longer announces a new page or resets focus for you. Nuxt ships with features that fill some of that gap, and a few conventions cover the rest. This guide outlines best practices for handling that.

<tip>

[`@nuxt/a11y`](https://github.com/nuxt/a11y) surfaces accessibility problems in your components while you develop, alongside the practices below. It is in alpha, so expect its API to change.

</tip>

## Route Announcements

Screen readers announce a full page load by themselves, but they have no way of knowing that a client-side navigation happened. [`<NuxtRouteAnnouncer>`](/docs/4.x/api/components/nuxt-route-announcer) solves this by rendering a hidden live region and writing the new page title into it after every navigation:

```vue [app.vue]
<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
```

The announcer reads the title that Unhead rendered, so it is only as useful as your titles are. If two routes share the same `<title>`, users hear nothing on the way between them.

When you need to announce something else, or to change how urgently it is announced, use [`useRouteAnnouncer`](/docs/4.x/api/composables/use-route-announcer):

```vue [app/pages/search.vue]
<script setup lang="ts">
const { set } = useRouteAnnouncer()
const { data: results } = await useFetch('/api/search')

watch(results, (results) => {
  set(`${results?.length ?? 0} results found`)
})
</script>
```

<read-more title="NuxtRouteAnnouncer" to="/docs/4.x/api/components/nuxt-route-announcer">



</read-more>

For in-page updates that are not navigations, such as form validation or toasts, use [`<NuxtAnnouncer>`](/docs/4.x/api/components/nuxt-announcer) with [`useAnnouncer`](/docs/4.x/api/composables/use-announcer) instead.

## Page Titles

Because the route announcer follows the document title, giving every route a distinct title is the single most valuable thing you can do. Set a global template in `app.vue` and let each page fill in its own part:

```vue [app.vue]
<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} - Nuxt` : 'Nuxt',
})
</script>
```

```vue [app/pages/about.vue]
<script setup lang="ts">
useHead({
  title: 'About us',
})
</script>
```

If your titles come from route metadata rather than from the page itself, you can read [`definePageMeta`](/docs/4.x/directory-structure/app/pages#page-metadata) values from [`useRoute`](/docs/4.x/api/composables/use-route) in a layout.

<read-more title="SEO and Meta" to="/docs/4.x/getting-started/seo-meta#dynamic-title">



</read-more>

## Links

Use [`<NuxtLink>`](/docs/4.x/api/components/nuxt-link) for in-app navigation. It renders a real `<a href="...">`, which means it is focusable, appears in the tab order, and works with middle-click and "open in new tab", all of which you would have to reimplement on a `<div>` with a `@click` handler calling `navigateTo`.

```vue
<template>
  <NuxtLink to="/about">About page</NuxtLink>
</template>
```

In a menu or a set of breadcrumbs, the link matching the current route already exposes `aria-current="page"`, so assistive technology can tell which item you are on. Where a different token describes the relationship better, such as a step in a multi-page form, set [`ariaCurrentValue`](/docs/4.x/api/components/nuxt-link#routerlink):

```vue
<template>
  <NuxtLink
    to="/checkout/payment"
    aria-current-value="step"
  >Payment</NuxtLink>
</template>
```

Links to files in your `public/` directory, or to another app on the same origin, are not routes that Vue Router knows about. Mark them as [`external`](/docs/4.x/api/components/nuxt-link#handling-static-file-and-cross-app-links) so the browser performs a real navigation instead of failing to match a route.

<read-more title="NuxtLink" to="/docs/4.x/api/components/nuxt-link">



</read-more>

## Focus Management

After a client-side navigation, focus stays where it was, which is usually the link the user just activated. Vue Router does not move it and neither does Nuxt, so a keyboard user can end up tabbing through the whole header again to reach the content that just changed.

A skip link as the first tab stop of your app is the conventional fix, and it helps on the initial page load too:

```vue [app.vue]
<template>
  <a
    class="skip-link"
    href="#main"
  >Skip to main content</a>
  <AppHeader />
  <main
    id="main"
    tabindex="-1"
  >
    <NuxtPage />
  </main>
</template>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  position: static;
}
</style>
```

`<main>` is not focusable on its own, so it needs `tabindex="-1"` to accept focus from the skip link or from a script. Use `-1` rather than a positive value, which would move the element in the tab order and surprise everyone else.

If it suits your app, you can go further and move focus to the main region after every navigation from a plugin:

```ts [app/plugins/focus-main.client.ts]
export default defineNuxtPlugin(() => {
  useRouter().afterEach((to, from) => {
    if (to.path === from.path) {
      return
    }
    nextTick(() => document.getElementById('main')?.focus())
  })
})
```

<tip>

Navigate around your app with the keyboard alone. Tabbing from the skip link into `<main>` after a couple of navigations will surface most focus problems quickly.

</tip>

## Scroll Behavior

Nuxt scrolls to the top on a new route, restores the previous position when the user goes back, and scrolls to hash targets. If you need something different, such as smooth scrolling or a different offset, configure [`scrollBehaviorType`](/docs/4.x/guide/recipes/custom-routing#scroll-behavior-for-hash-links) or write your own `scrollBehavior` in [`router.options.ts`](/docs/4.x/guide/recipes/custom-routing#router-options). Bear in mind that smooth scrolling should respect the user's `prefers-reduced-motion` setting.

<read-more title="Custom routing" to="/docs/4.x/guide/recipes/custom-routing">



</read-more>

## Useful Resources

- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
- [MDN: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)



# Dev Containers

> Set up or open a Nuxt project in a dev container for a consistent development environment.

## Setting Up a Dev Container

If you're starting a new Nuxt project and want to develop inside a dev container, you can add the configuration yourself.

<read-more target="_blank" to="https://code.visualstudio.com/docs/devcontainers/containers">

Read more about dev containers

</read-more>

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Docker Engine](https://docs.docker.com/engine/)

### Create the Configuration

Create a `.devcontainer/` folder in your project root with these two files:

```json [devcontainer.json]
{
  "name": "nuxt-devcontainer",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "../"
  },
  "forwardPorts": [3000],
  "portsAttributes": {
    "3000": {
      "label": "Application",
      "onAutoForward": "openPreview"
    }
  },
  "mounts": [
    "type=volume,target=${containerWorkspaceFolder}/node_modules"
  ],
  "postStartCommand": "pnpm install && pnpm dev:prepare"
}
```

```dockerfile [Dockerfile]
FROM node:lts

WORKDIR /app

RUN npm i -g corepack && corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./
RUN pnpm install --frozen-lockfile

COPY . .
```

This configuration uses Node.js LTS and enables pnpm via corepack. It forwards port 3000 for the Nuxt dev server and persists `node_modules` in a Docker volume to avoid reinstallation on container restarts.

<tip>

To use a different package manager, replace `corepack enable` with your preferred manager (for example, `npm install -g yarn`) and update the `postStartCommand` accordingly.

</tip>

## Opening an Existing Dev Container

If a project already includes a dev container configuration, you can open it using any of these methods:

### 1. VS Code Prompt

When you open the project in VS Code, you should see a notification in the bottom right corner:

> "Reopen in Dev Containers"

Click this button to build and open the project in a dev container.

### 2. Command Palette

If you dismiss the prompt or want to manually trigger it:

1. Open the Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
2. Search for **"Dev Containers: Reopen in Container"**
3. Select it

VS Code will build the container and reopen your project.

### 3. Dev Containers CLI

For advanced users or CI workflows, you can use the Dev Containers CLI directly:

```bash
# Install the CLI (if not already installed)
npm install -g @devcontainers/cli

# Build and open the project in a container
devcontainer up --workspace-folder .

# After making changes to .devcontainer, rebuild
devcontainer build
```

## Next Steps

Once the container is running:

```bash
pnpm dev
```

Your Nuxt app will be available at [http://localhost:3000](http://localhost:3000).



# Nuxt and Hydration

> Why fixing hydration issues is important

When developing, you may face hydration issues. Don't ignore those warnings.

## Why Is It Important to Fix Them?

Hydration mismatches are not just warnings - they are indicators of serious problems that can break your application:

### Performance Impact

- **Increased time to interactive**: Hydration errors force Vue to re-render the entire component tree, which will increase the time for your Nuxt app to become interactive
- **Poor user experience**: Users may see content flashing or unexpected layout shifts

### Functionality Issues

- **Broken interactivity**: Event listeners may not attach properly, leaving buttons and forms non-functional
- **State inconsistencies**: Application state can become out of sync between what the user sees and what the application thinks is rendered
- **SEO problems**: Search engines may index different content than what users actually see

## How to Detect Them

### Development Console Warnings

Vue will log hydration mismatch warnings in the browser console during development:

![Screenshot of Vue hydration mismatch warning in the browser console](/assets/docs/best-practices/vue-console-hydration.png)

## Common Reasons

### Browser-only APIs in Server Context

**Problem**: Using browser-specific APIs during server-side rendering.

```html
<template>
  <div>User preference: {{ userTheme }}</div>
</template>

<script setup>
// This will cause hydration mismatch!
// localStorage doesn't exist on the server!
const userTheme = localStorage.getItem('theme') || 'light'
</script>
```

**Solution**: You can use [`useCookie`](/docs/4.x/api/composables/use-cookie):

```html
<template>
  <div>User preference: {{ userTheme }}</div>
</template>

<script setup>
// This works on both server and client
const userTheme = useCookie('theme', { default: () => 'light' })
</script>
```

### Inconsistent Data

**Problem**: Different data between server and client.

```html
<template>
  <div>{{ Math.random() }}</div>
</template>
```

**Solution**: Use SSR-friendly state:

```html
<template>
  <div>{{ state }}</div>
</template>

<script setup>
const state = useState('random', () => Math.random())
</script>
```

### Conditional Rendering Based on Client State

**Problem**: Using client-only conditions during SSR.

```html
<template>
  <div v-if="window?.innerWidth > 768">
    Desktop content
  </div>
</template>
```

**Solution**: Use media queries or handle it client-side:

```html
<template>
  <div class="responsive-content">
    <div class="hidden md:block">Desktop content</div>
    <div class="md:hidden">Mobile content</div>
  </div>
</template>
```

### Third-party Libraries with Side Effects

**Problem**: Libraries that modify the DOM or have browser dependencies (this happens a LOT with tag managers).

```html
<script setup>
if (import.meta.client) {
    const { default: SomeBrowserLibrary } = await import('browser-only-lib')
    SomeBrowserLibrary.init()
}
</script>
```

**Solution**: Initialise libraries after hydration has completed:

```html
<script setup>
onMounted(async () => {
  const { default: SomeBrowserLibrary } = await import('browser-only-lib')
  SomeBrowserLibrary.init()
})
</script>
```

### Dynamic Content Based on Time

**Problem**: Content that changes based on current time.

```html
<template>
  <div>{{ greeting }}</div>
</template>

<script setup>
const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : 'Good afternoon'
</script>
```

**Solution**: Use [`NuxtTime`](/docs/4.x/api/components/nuxt-time) component or handle it client-side:

```html
<template>
  <div>
    <NuxtTime :date="new Date()" format="HH:mm" />
  </div>
</template>
```

```html
<template>
  <div>
    <ClientOnly>
      {{ greeting }}
      <template #fallback>
        Hello!
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
const greeting = ref('Hello!')

onMounted(() => {
  const hour = new Date().getHours()
  greeting.value = hour < 12 ? 'Good morning' : 'Good afternoon'
})
</script>
```

## In Summary

1. **Use SSR-friendly composables**: [`useFetch`](/docs/4.x/api/composables/use-fetch), [`useAsyncData`](/docs/4.x/api/composables/use-async-data), [`useState`](/docs/4.x/api/composables/use-state)
2. **Wrap client-only code**: Use [`ClientOnly`](/docs/4.x/api/components/client-only) component for browser-specific content
3. **Consistent data sources**: Ensure server and client uses the same data
4. **Avoid side effects in setup**: Move browser-dependent code to `onMounted`

<tip>

You can read the [Vue documentation on SSR hydration mismatch](https://vuejs.org/guide/scaling-up/ssr#hydration-mismatch) for a better understanding of hydration.

</tip>



# Nuxt performance

> Best practices for improving performance of Nuxt apps.

Nuxt comes with built-in features designed to improve your application's performance and contribute to better [Core Web Vitals](https://web.dev/articles/vitals). There are also multiple Nuxt core modules that assist in improving performance in specific areas. This guide outlines best practices to optimize performance of your Nuxt application.

## Built-in Features

Nuxt offers several built-in features that help you optimize performance of your website. Understanding how these features work is crucial for achieving blazingly-fast performance.

### Links

[`<NuxtLink>`](/docs/4.x/api/components/nuxt-link) is a drop-in replacement for both Vue Router's `<RouterLink>` component and HTML's `<a>` tag. It intelligently determines whether the link is internal or external and renders it accordingly with available optimizations (prefetching, default attributes, etc.)

```html
<template>
  <NuxtLink to="/about">About page</NuxtLink>
</template>

<!-- Which will render to with Vue Router & Smart Prefetching -->
<a href="/about">About page</a>
```

Nuxt automatically includes smart prefetching. That means it detects when a link is visible (by default), either in the viewport or when scrolling and prefetches the JavaScript for those pages so that they are ready when the user clicks the link.

You can also opt for prefetching on interaction instead:

```ts
export default defineNuxtConfig({
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
          visibility: false,
        },
      },
    },
  },
})
```

<read-more title="NuxtLink" to="/docs/4.x/api/components/nuxt-link">



</read-more>

### Hybrid Rendering

In more complex applications, we may need a full control over how our application is rendered to support cases where some pages could be generated at build time, while others should be client-side rendered

Hybrid rendering allows different caching rules per route using Route Rules and decides how the server should respond to a new request on a given URL:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': {
      prerender: true,
    },
    '/products/**': {
      swr: 3600,
    },
    '/blog': {
      isr: 3600,
    },
    '/admin/**': {
      ssr: false,
    },
  },
})
```

Nuxt server will automatically register corresponding middleware and wrap routes with cache handlers using Nitro caching layer.

<read-more title="Hybrid rendering" to="/docs/4.x/guide/concepts/rendering#hybrid-rendering">



</read-more>

### Lazy Loading Components

To dynamically import a component (also known as lazy-loading a component) all you need to do is add the Lazy prefix to the component's name. This is useful if the component is not always needed.

```html
<script setup lang="ts">
const show = ref(false)
</script>

<template>
  <div>
    <h1>Mountains</h1>
    <LazyMountainsList v-if="show" />
    <button v-if="!show" @click="show = true">Show List</button>
  </div>
</template>
```

By using the Lazy prefix you can delay loading the component code until the right moment, which can be helpful for optimizing your JavaScript bundle size.

<read-more title="Lazy loading components" to="/docs/4.x/directory-structure/app/components#dynamic-imports">



</read-more>

### Lazy Hydration

It is not always necessary to hydrate (or make interactive) all the components of your site on the initial load. Using lazy hydration, you can control when components can have their code loaded, which can improve the time-to-interactive metric for your app. Nuxt allows you to control when components become interactive with lazy hydration (added in Nuxt v3.16).

```html
<template>
  <div>
    <LazyMyComponent hydrate-on-visible />
  </div>
</template>
```

To optimize your app, you may want to delay the hydration of some components until they're visible, or until the browser is done with more important tasks.

<read-more title="Lazy hydration" to="/docs/4.x/directory-structure/app/components#delayed-or-lazy-hydration">



</read-more>

For content and marketing sites that need little or no client-side interactivity, you can go further and combine prerendering, the `noScripts` route rule, [server components](/docs/4.x/guide/concepts/server-components) and lazy hydration to ship near-zero JavaScript.

<read-more title="Mostly-static sites" to="/docs/4.x/guide/recipes/mostly-static-sites">



</read-more>

### Fetching data

To avoid fetching same data twice (once on the server and once on client) Nuxt provides [`useFetch`](/docs/4.x/api/composables/use-fetch) and [`useAsyncData`](/docs/4.x/api/composables/use-async-data). They ensure that if an API call is made on the server, the data is forwarded to the client in the payload instead of being fetched again.

<read-more title="Data fetching" to="/docs/4.x/getting-started/data-fetching">



</read-more>

## Core Nuxt Modules

Apart from Nuxt's built-in features, there are also core modules maintained by the Nuxt team which help improve performance even further. These modules help handle assets such as images, custom fonts, or third party scripts.

### Images

Unoptimized images can have a significant negative impact on your website performance, specifically the [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp) score.

In Nuxt we can use [Nuxt Image](https://image.nuxt.com/) module that is a plug-and-play image optimization for Nuxt apps. It allows resizing and transforming your images using built-in optimizer or your favorite images CDN.

<video-accordion title="Watch the video by LearnVue about Nuxt Image" video-id="_UBff2eqGY0">



</video-accordion>

[`<NuxtImg>`](/docs/4.x/api/components/nuxt-img) is a drop-in replacement for the native `<img>` tag that comes with following enhancements:

- Uses built-in provider to optimize local and remote images
- Converts `src` to provider optimized URLs with modern formats such as WebP or Avif
- Automatically resizes images based on `width` and `height`
- Generates responsive `sizes` when providing sizes option
- Supports native `lazy loading` as well as other `<img>` attributes

Images in your website can usually be separated by importance; the ones that are needed to be delivered first at initial load (i.e. `Largest Contentful Paint`), and the ones that can be loaded later or when specifically needed. For that, we could use the following optimizations:

```html
<template>
  <!-- 🚨 Needs to be loaded ASAP -->
  <NuxtImg
    src="/hero-banner.jpg"
    format="webp"
    :preload="{ fetchPriority: 'high' }"
    loading="eager"
    width="200"
    height="100"
  />

  <!-- 🐌 Can be loaded later -->
  <NuxtImg
    src="/facebook-logo.jpg"
    format="webp"
    loading="lazy"
    fetchpriority="low"
    width="200"
    height="100"
  />
</template>
```

<read-more title="Nuxt Image" to="https://image.nuxt.com/usage/nuxt-img">



</read-more>

### Fonts

[Nuxt Fonts](https://fonts.nuxt.com/) will automatically optimize your fonts (including custom fonts) and remove external network requests for improved privacy and performance.

It includes built-in automatic self-hosting for any font file which means you can optimally load web fonts with reduced layout shift, thanks to the underlying package [fontaine](https://github.com/unjs/fontaine).

<video-accordion title="Watch the talk by Daniel Roe about the idea behind Nuxt Fonts" video-id="D3F683UViBY">



</video-accordion>

Nuxt Fonts processes all your CSS and does the following things automatically when it encounters a font-family declaration.

1. **Resolves fonts** – Looks for font files in public/, then checks web providers like Google, Bunny, and Fontshare.
2. **Generates @font-face rules** – Injects CSS rules to load fonts from the correct sources.
3. **Proxies & caches fonts** – Rewrites URLs to `/_fonts`, downloads and caches fonts locally.
4. **Creates fallback metrics** – Adjusts local system fonts to match web fonts, reducing layout shift ([CLS](https://web.dev/articles/cls)).
5. **Includes fonts in build** – Bundles fonts with your project, hashing file names and setting long-lived cache headers.

It supports multiple providers that are designed to be pluggable and extensible, so no matter your setup you should be able to use an existing provider or write your own.

### Scripts

Third-party resources like analytics tools, video embeds, maps, and social media integrations enhance website functionality but can significantly degrade user experience and negatively impact [Interaction to Next Paint (INP)](https://web.dev/articles/inp) and Largest Contentful Paint (LCP) scores.

[Nuxt Scripts](https://scripts.nuxt.com/) lets you load third-party scripts with better performance, privacy, security and DX.

<video-accordion title="Watch the video by Alex Lichter about Nuxt Scripts" video-id="sjMqUUvH9AE">



</video-accordion>

Nuxt Scripts provides an abstraction layer on top of third-party scripts, providing SSR support and type-safety and while still giving you full low-level control over how a script is loaded.

```ts
const { onLoaded, proxy } = useScriptGoogleAnalytics(
  {
    id: 'G-1234567',
    scriptOptions: {
      trigger: 'manual',
    },
  },
)
// queue events to be sent when ga loads
proxy.gtag('config', 'UA-123456789-1')
// or wait until ga is loaded
onLoaded((gtag) => {
  // script loaded
})
```

<read-more title="Nuxt Scripts" to="https://scripts.nuxt.com/scripts">



</read-more>

## Profiling Tools

To improve performance, we need to first know how to measure it, starting with measuring performance during development - on local environment, and then moving to auditing application that are deployed on production.

### Nuxi Analyze

[This](/docs/4.x/api/commands/analyze) command of `nuxt` allows you to analyze the production bundle of your Nuxt application. It leverages `vite-bundle-visualizer` (similar to `webpack-bundle-analyzer`) to generate a visual representation of your application's bundle, making it easier to identify which components take up the most space.

When you see a large block in the visualization, it often signals an opportunity for optimization—whether by splitting it into smaller parts, implementing lazy loading, or replacing it with a more efficient alternative, especially for third-party libraries.

Large blocks containing multiple elements can often be reduced by importing only the necessary components rather than entire modules while large standalone blocks may be better suited for lazy loading rather than being included in the main bundle.

### Nuxt DevTools

The [Nuxt DevTools](https://devtools.nuxt.com/) gives you insights and transparency about your Nuxt App to identify performance gaps and seamlessly manage your app configurations.

![Nuxt DevTools example](https://user-images.githubusercontent.com/11247099/217670806-fb39aeff-3881-44e5-b9c8-6c757f5925fc.png)

It comes with several features we can use to measure performance of Nuxt apps:

1. **Timeline** – Tracks time spent on rendering, updating, and initializing components to identify performance bottlenecks.
2. **Assets** – Displays file sizes (e.g., images) without transformations.
3. **Render Tree** – Shows connections between Vue components, scripts, and styles to optimize dynamic loading.
4. **Inspect** – Lists all files used in the Vue app with their size and evaluation time.

### Chrome DevTools

Chrome DevTools come with two useful tabs for measuring performance; `Performance` and `Lighthouse`.

When you open the [Performance](https://developer.chrome.com/docs/devtools/performance/overview) panel, it instantly shows your local **Largest Contentful Paint (LCP)** and **Cumulative Layout Shift (CLS)** scores (good, needs improvement, or bad).

If you interact with the page, it also captures **Interaction to Next Paint (INP)**, giving you a full view of your Core Web Vitals based on your device and network.

![Chrome DevTools Performance Panel](https://developer.chrome.com/static/docs/devtools/performance/image/cpu-throttling_856.png)

[Lighthouse](https://developer.chrome.com/docs/devtools/lighthouse) audits performance, accessibility, SEO, progressive web apps, and best practices. It runs tests on your page and generates a report. Use failing audits as a guide to improve your site.

![Lighthouse](https://developer.chrome.com/static/docs/lighthouse/images/lighthouse-overview_720.png)

Each audit has a reference document explaining why the audit is important, as well as how to fix it.

### PageSpeed Insights

[PageSpeed Insights (PSI)](https://developers.google.com/speed/docs/insights/v5/about) reports on the user experience of a page on both mobile and desktop devices, and provides suggestions on how that page may be improved.

It provides both lab and field data about a page. Lab data is useful for debugging issues, as it is collected in a controlled environment while field data is useful for capturing true, real-world user experience.

### Web Page Test

[WebPageTest](https://www.webpagetest.org/) is a web performance tool providing deep diagnostic information about how a page performs under a variety of conditions.

Each test can be run from different locations around the world, on real browsers, over any number of customizable network conditions.

## Common Problems

When building more complex Nuxt applications, you will probably encounter some of the problems listed below. Understanding these problems and fixing them will help you improve performance of your website.

### Overusing plugins

**Problem**: A large number of plugins can cause performance issues, especially if they require expensive computations or take too long to initialize. Since plugins run during the hydration phase, inefficient setups can block rendering and degrade the user experience.

**Solution**: Inspect your plugins and see if some of them could be implemented rather as a composable or utility function instead.

### Unused code / dependencies

**Problem**: With the development of the project, there can be a case where there will be some unused code or a dependency. This additional functionality may not be used or needed while it will be increase the bundle size of our project.

**Solution**: Inspect your `package.json` for unused dependencies and analyze your code for unused utils/composables/functions.

### Not using Vue Performance tips

**Problem**: [Vue documentation](https://vuejs.org/guide/best-practices/performance) lists several Performance improvements we can use in our Nuxt projects as well but as they are part of Vue documentation, developers tend to forget about it and focus on Nuxt specific improvements only - while Nuxt application is still a Vue project.

**Solution**: Use concepts such as `shallowRef`, `v-memo`, `v-once`, etc to improve performance.

### Not following patterns

**Problem**: The more people are currently working on the project, the more difficult it will be to maintain the stable codebase. Developers have a tendency to introduce new concepts they've seen in another project which can cause conflicts and problems with performance.

**Solution**: Establish rules and patterns in the project such as [Good practices and Design Patterns for Vue Composables](https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk)

### Trying to load everything at the same time

**Problem**: When a page is loaded and it is not correctly instructed about the order of loading elements it will result in fetching everything at the same time - which can be slow and result in bad User Experience.

**Solution**: Use concepts such as Progressive Enhancement where core webpage content is set first, then more nuanced and technically rigorous layers of presentation and features are added on top as the browser/internet connection allow.

## Useful Resources

To learn more about various techniques for improving performance, take a look at the following resources:

1. [Apply instant loading with the PRPL pattern](https://web.dev/articles/apply-instant-loading-with-prpl)
2. [Perceived performance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Perceived_performance)
3. [Understanding Critical Rendering Path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path)



# Nuxt Plugins

> Best practices when using Nuxt plugins.

Plugins in Nuxt allow you to extend your application with additional functionality. However, improper use can lead to performance bottlenecks. This guide outlines best practices to optimize your Nuxt plugins.

## Avoid Costly Plugin Setup

A large number of plugins can cause performance issues, especially if they require expensive computations or take too long to initialize. Since plugins run during the hydration phase, inefficient setups can block rendering and degrade the user experience.

## Use Composition Whenever Possible

Whenever possible, favor composition over plugins. Just like in Vue, many utilities and composables can be used directly without the need for a plugin. This keeps your project lightweight and improves maintainability.

## If `async`, Enable `parallel`

By default, all plugins loads synchronously.
When defining asynchronous plugins, setting `parallel: true` allows multiple plugins to load concurrently, improving performance by preventing blocking operations.
