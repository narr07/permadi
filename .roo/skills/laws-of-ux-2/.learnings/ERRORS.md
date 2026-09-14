# Errors

Failed checks, broken assumptions, tool failures, and verification issues captured while using this skill.

Use `references/self-iteration-workflow.md` for entry format and promotion rules.

---

## [ERR-20260628-001] playwright-browser-cache-mismatch

**Logged**: 2026-06-28T22:31:17Z
**Priority**: medium
**Status**: pending
**Area**: screenshot

### Summary
Playwright screenshot capture can fail when the Node REPL resolves one Playwright version while `npx playwright install` downloads another browser cache version.

### Context
- Operation attempted: Launch Chromium from the Node REPL to capture desktop and mobile UX screenshots.
- Expected: Browser launches from the freshly installed Playwright cache.
- Actual: The REPL looked for an older `chromium_headless_shell-1200` path while `npx playwright install chromium` downloaded `chromium_headless_shell-1228`.

### Suggested Fix
When this mismatch appears, locate the installed executable under `~/Library/Caches/ms-playwright` and pass `executablePath` explicitly to `chromium.launch()` before continuing visual verification.

### Metadata
- Reproducible: unknown
- Related Files: references/self-iteration-workflow.md

---
