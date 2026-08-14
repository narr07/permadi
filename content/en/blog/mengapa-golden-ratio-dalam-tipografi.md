---
title: "Why Use the Golden Ratio (φ ≈ 1.618) in Web Typography Scales?"
description: "Exploring mathematical aesthetic ratios to create natural, harmonious text hierarchies."
date: "2026-07-28"
tags: ["Typography", "Design Theory", "CSS", "Math"]
cover: "/blog/golden-ratio-type.jpg"
aspectRatio: "aspect-article"
readTime: "5 min read"
featured: false
---

# Why Use the Golden Ratio ($\phi \approx 1.618$) in Web Typography Scales?

Modular scales in graphic design and typography have been used for centuries by Renaissance architects and artists. In modern web engineering, typography scales derived from the **Golden Ratio ($\phi \approx 1.618$)** provide dramatic yet natural visual progression.

## The Golden Ratio Scale (`g0` to `g6`)

In the permadi.dev design system, the scale is mapped as follows:

- `text-g0` (~0.5 - 0.62rem): Metadata, tags, small captions.
- `text-g1` (~0.8 - 1.0rem): Body text & default descriptions.
- `text-g2` (~1.2 - 1.62rem): Medium bento card titles (1×2, 2×1).
- `text-g3` (~1.8 - 2.62rem): Large card titles (2×2).
- `text-g4` (~2.62 - 4.24rem): Hero headlines.
- `text-g5` - `text-g6` (~4.24 - 11rem): Display and showcase headers.

Utilizing CSS `clamp()`, typography scales fluidly across all viewport widths.
