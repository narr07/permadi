# Chinese Open UX Notes (Structured)

This file captures practical Chinese-language UX explainer patterns and examples in a reusable format.
It is not a source of hard scientific proof. Use it for examples, framing, and communication style.

## Why This Exists

- Many users think and communicate UX concepts through Chinese article-style examples.
- This file helps convert those examples into implementation-level guidance without copying long prose.

## Reusable Example Bank

### Hick's Law

- Typical scenario: too many menu options or simultaneous settings.
- Translation to design:
  - Split decisions into staged steps.
  - Group by intent, not by backend structure.
  - Promote one recommended path.
- Common Chinese example style:
  - "综合平台先大类后小类，降低一次性决策压力。"

### Fitts's Law

- Typical scenario: hard-to-tap primary actions on mobile.
- Translation to design:
  - Increase primary target size and hit area.
  - Place frequent actions near natural thumb zone.
  - Add friction for destructive actions when needed.
- Common Chinese example style:
  - "关键按钮放在拇指易触达区域，危险操作增加操作距离。"

### Miller / Working Memory

- Typical scenario: users must remember codes, fields, or cross-screen values.
- Translation to design:
  - Use chunked formatting (e.g., phone, bank card, order ID).
  - Keep related references visible.
  - Reduce cross-screen memory burden.
- Caution:
  - Avoid rigidly enforcing 7 +/- 2 as a universal limit.

### Tesler's Law

- Typical scenario: complex product domains (finance, creator tools, enterprise SaaS).
- Translation to design:
  - Decide where complexity should live: defaults, automation, or advanced mode.
  - Hide only timing, not meaning.
- Common Chinese example style:
  - "复杂度不会消失，只会转移。"

### Jakob's Law

- Typical scenario: introducing a new flow that breaks platform conventions.
- Translation to design:
  - Keep familiar interaction semantics for common UI patterns.
  - Innovate on value, not basic control meaning.
- Common Chinese example style:
  - "同功能尽量同表达，降低学习成本。"

### Von Restorff Effect

- Typical scenario: everything is highlighted and nothing stands out.
- Translation to design:
  - Keep baseline visual harmony.
  - Spend contrast budget only on key actions/signals.
- Common Chinese example style:
  - "都突出等于都不突出。"

### Doherty Threshold

- Typical scenario: response delays causing repeated taps and anxiety.
- Translation to design:
  - Give immediate local feedback.
  - Show progress and preserve user intent during waits.
- Common Chinese example style:
  - "先给反馈，再等结果。"

## How To Use In Outputs

- For Chinese-facing reviews, prefer plain language:
  - "问题是什么 -> 对用户影响 -> 怎么改 -> 怎么验收"
- Avoid over-theoretical wording unless explicitly requested.
- Combine one law + one concrete UI change + one acceptance check.
