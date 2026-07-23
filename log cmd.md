# Nuxt 4 Project Setup and Configuration Log

This document lists the steps to initialize, configure, and prepare a Nuxt 4 content-driven project. It captures the setup workflow, dependency installation, and agent skill configurations.

::note
This project uses Bun as the primary package manager and runtime, but you can also use pnpm or npm.
::

## Step-by-Step Initialization

::steps
### Initialize Nuxt Project

Create a new Nuxt application with the content-driven template. Run the creation command in your workspace folder.

```bash [Terminal]
bun create nuxt@latest .
```

Choose the `content` template and select `bun` as the package manager. Initialize a Git repository when prompted.

### Install Core Modules

Add the required Nuxt modules to your project. Use the `nuxi module add` command to configure the dependencies and automatically update `nuxt.config.ts`.

```bash [Terminal]
npx nuxt@latest module add vueuse
npx nuxt@latest module add seo
npx nuxt@latest module add studio
npx nuxt@latest module add eslint
npx nuxt@latest module add ui
```

::tip
ESLint and Nuxt UI v4 are added to ensure codebase quality and clean design.
::

### Configure Agent Skills

Install specialized agent skills to extend the capabilities of coding assistants. You must link these skills to the `antigravity` agent.

```bash [Terminal]
npx skilld add @nuxtjs/seo --agent antigravity
npx -y skilld add gh:antfu/skills -s nuxt
npx -y skilld add gh:onmax/nuxt-skills -s nuxt-ui
npx -y skilld add gh:onmax/nuxt-skills -s nuxt-studio
npx -y skilld add gh:onmax/nuxt-skills -s nuxt-content
npx -y skilld add gh:onmax/nuxt-skills -s motion
npx -y skilld add gh:onmax/nuxt-skills -s document-writer
```

### Set up Linting and Code Formatting

Install the `@antfu/eslint-config` styling rules. This command initializes the configuration files and creates vscode configuration templates.

```bash [Terminal]
pnpm dlx @antfu/eslint-config@latest
```

::important
After configuring the linting rules, run the package manager installation to sync dependencies.
::

```bash [Terminal]
bun install
```

### Launch the Development Server

Start the local development server to test the initialization. When you first launch the server, Nuxt Content automatically prompts and installs the required `better-sqlite3` driver.

```bash [Terminal]
bun dev
```
::

## Troubleshooting

### EPERM Symlink Failures on Windows

When configuring skills with `skilld prepare` on Windows systems, the installer may encounter `EPERM` error codes.

```text [Error Log]
Error: EPERM: operation not permitted, symlink 'E:\website\permadi\node_modules\nuxt' -> 'E:\website\permadi\.agent\skills\nuxt\.skilld\pkg'
```

::warning
To resolve this issue, run your terminal with Administrator privileges or use `pnpm install` which handles symlinking differently under Windows security policies.
::

### OG Image Signature Secrets

Nuxt OG Image warns about signing URLs with auto-generated secrets during builds.

```text [Log Message]
[WARN] OG image URLs are signed with an auto-generated secret that changes every build.
```

Generate a stable secret to override this warning:

```bash [Terminal]
npx nuxt-og-image generate-secret
```