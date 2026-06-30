# GARAGE — illustration assets

Drop the designer's **transparent** exports (from `Garage Site_03.ai`) into this folder using
the exact filenames below. The site already references these paths — as soon as a file exists it
replaces the built-in hand-drawn stand-in automatically. **No code change needed.**

Until a file is present, a marker-style SVG placeholder renders, so the site never looks broken.

| File | Where it shows | Format | Recommended size | Status |
|------|----------------|--------|------------------|--------|
| `toolbox.png` | Home hero — the big tool chest with the vertical **GARAGE** label | PNG (transparent) or SVG | ~1200 × 1000, trimmed | **needed** — falls back to an inline SVG chest |

### Optional (nice-to-have)
These currently render as inline SVG doodles. Export only if you want the designer's exact linework.

| File | Where it shows | Notes |
|------|----------------|-------|
| `banana.svg` | The scroll-progress banana (bottom-right) | Keep it a **single-path SVG** if possible — the banana "fills" with scroll, which needs vector. Ping me to wire a custom path. |
| `star.svg`, `loop.svg`, `spark.svg` | Hero accent doodles | Small marker scribbles. |

## Export tips (Illustrator)
- Select the artwork → **File ▸ Export ▸ Export As** → PNG, **Use Artboards** off, **Background: Transparent**.
- Trim tight to the artwork (no big empty margins) so it scales predictably in the layout.
- Black linework on transparent works best — the hero ground is yellow, so avoid a white fill behind the art.
- SVG is preferred for crisp scaling where the art is pure linework (toolbox, doodles).

The hero `toolbox.png` is referenced from `src/components/GarageSite.tsx` (`<Illustration src="/assets/illustrations/toolbox.png" …>`); the fallback chest lives in the same file (`ToolboxDoodle`).
