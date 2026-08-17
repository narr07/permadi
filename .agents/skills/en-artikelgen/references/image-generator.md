# Blog Visual & Image Generator Guide (Brand Color System)

Technical specification for crafting modern, **flat vector illustration** prompts and featured banner assets strictly anchored in the brand's signature teal/emerald color palette (**#14b898**).

---

## 1. Visual Style Guidelines

- **Design Style**: Modern Flat Vector Illustration, Clean Line Art, Minimalist Cartoon.
- **Linework & Characters**: Sharp, consistent outlines (not rough pencil sketches), balanced proportions, smooth flat color fills without unnecessary noise.
- **Compositional Focus**: One clear visual focal message per image, uncluttered layout, and generous breathing room.
- **Aspect Ratio**: **16:9 Landscape** (standard web banner and article illustration format).
- **Strict Restrictions**:
  - ❌ **NO text, letters, words, or numbers inside the image**.
  - ❌ NO watermarks, third-party logos, or copyrighted trademarks.
  - ❌ NO 3D rendering, photorealism, or photographic textures.
  - ❌ NO identifiable real people or sensitive themes.

---

## 2. Official Brand Color System (Mandatory)

Every image must be strictly governed by the brand's teal/emerald color hierarchy:

| Color Role | Hex Code | Shade | Characteristic / Purpose |
|---|---|---|---|
| **Background (Light Canvas)** | `#f0fdfa` | 50 | Pale mint / soft greenish off-white (default solid background) |
| **Background (Alt)** | `#ccfbf2` | 100 | Very light mint green |
| **Light Accent 1** | `#99f6e4` | 200 | Bright soft teal |
| **Light Accent 2** | `#5eeacf` | 300 | Vivid light teal |
| **Medium Accent** | `#2bd4b5` | 400 | Fresh emerald |
| **Primary Brand Focus** | `#14b898` | 500 | **Vibrant teal/emerald (main subject & characters)** |
| **Dark Accent (Shadows)** | `#0d947a` | 600 | Dark greenish teal (shadows and depth) |
| **Medium Shadow** | `#0f7662` | 700 | Deep teal shadow |
| **Deep Shadow** | `#115e4f` | 800 | Dark forest teal |
| **Line Art (Outlines)** | `#134e43` | 900 | Dark forest green linework (replaces pure black) |
| **Deepest Contrast** | `#042f27` | 950 | Deepest forest green (minor contrast accents) |

### Color Rules:
1. **Background**: Predominantly `#f0fdfa` or `#ccfbf2`. If scene context is needed, maintain dominant teal tints.
2. **Main Subject**: Center around `#14b898` with `#0d947a` shadows and `#134e43` outlines.
3. **Natural Colors**: Real-world colors (skin tones, sky, fire) are permitted only as minor functional details and must remain harmonious with the teal palette.

---

## 3. AI Image Generation Prompt Template

When prompting AI image generation models (Imagen, DALL-E 3, Midjourney, generate_image, etc.):

```text
A modern flat vector illustration of [MAIN OBJECT & ACTION DESCRIPTION], minimalist cartoon style with clean sharp outlines in dark forest green #134e43 and smooth flat color fills. Color palette strictly dominated by teal and emerald green accents: background in pale mint #f0fdfa, primary subject highlighted with vivid teal #14b898 and dark emerald accents #0d947a, balanced bright highlights #99f6e4. Simple and elegant composition, uncluttered, professional graphic design, 16:9 aspect ratio, no text, no letters, no words, no watermark, no 3D elements, no realistic photo details.
```

---

## 4. Asset Storage & Markdown Formatting

1. **File Format**: Optimized WebP (`.webp`) under 150 KB.
2. **Storage Location**: `/public/article/` or `/public/assets/blog/`.
3. **Alt Text**: Max 125 characters, accessible, naturally integrating the primary keyword.

```md
![Modern flat vector illustration comparing digital TTF and OTF font formats on a screen](/article/image-name.webp)
```
