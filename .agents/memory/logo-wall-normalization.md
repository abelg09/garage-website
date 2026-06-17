---
name: Logo wall uniform sizing
description: How GARAGE client logos are made to look the same size despite different shapes
---

# Client logo wall — equal-area normalization

Client logos in the GARAGE clients section live in
`artifacts/garage-website/public/clients/*.png` and must look uniform on the wall.

**Rule:** raw brand logos have wildly different internal padding and aspect ratios, so a
CSS bounding box alone (max-width/max-height) makes tightly-cropped logos look huge and
padded ones look tiny. Fix it at the image level, not just CSS:

1. `magick <f> -fuzz 5% -trim +repage <f>` — strip transparent/whitespace padding so the
   content bounds are tight and comparable.
2. Normalize every logo to the **same optical content area** and center it on an identical
   transparent canvas. Script: scale factor `s = sqrt(T/(w*h))` with target area `T≈45600`,
   resize, then `-background none -gravity center -extent 540x260`. All output PNGs become
   540×260 with equal-area logos centered.
3. CSS/JSX then renders them all at one width (`width:100%; max-width:170px; height:auto`),
   so identical canvas + equal area ⇒ uniform appearance.

**Why:** a user repeatedly flagged Jameson huge vs Johnson tiny. Trimming made their aspect
ratios match; equal-area normalization balanced square/circular logos (Grameen Kulfi, South
Indian Bank) against wide wordmarks.

**How to apply:** when adding a new client logo, run the trim + equal-area-extent pipeline
on it before committing, or the wall will look inconsistent again.
