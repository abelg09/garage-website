---
name: GARAGE case-study cover images are slides, not photos
description: Why every work/case-study image surface must use object-fit:contain and 16:9 framing
---

GARAGE case-study cover images are 16:9 presentation/PPT slides with text, logos, and branding baked into the pixels — they are NOT bleed-friendly photographs.

**Rule:** Any surface that displays a case-study cover (home work deck, /work listing cards, /work/:id hero) must use `object-fit: contain` and shape the container to `aspect-ratio: 16/9` (on a dark backdrop). Never use `object-fit: cover`, and never give the container a height that differs from the image ratio.

**Why:** `cover` (or a viewport-tall hero) crops the slide and silently cuts off the headline/brand mark, which the user repeatedly reported as "images getting cut off." A 16:9 container with `contain` shows the whole slide with zero letterboxing.

**How to apply:** When adding/editing any work-image component, set the wrapper to `aspect-ratio: 16/9` and the `<img>` to `object-fit: contain`. For the detail hero, keep `aspect-ratio:16/9` + `max-height: calc(100svh - header)` rather than a fixed tall height, so desktop stays dramatic and mobile doesn't letterbox.
