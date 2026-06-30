import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Banana = page scroll indicator + back-to-top.
 * An outlined banana fills yellow from the tip up as you scroll the page; once you're
 * past the fold it nudges into a clickable "back to top" control. The hand-drawn banana
 * art can be swapped for the designer's export by replacing BANANA_BODY / BANANA_STEM.
 */
const BANANA_BODY =
  "M48 26 C 14 92, 18 190, 96 236 C 108 230, 116 218, 108 205 C 44 176, 46 96, 70 44 C 76 31, 62 20, 48 26 Z";
const BANANA_STEM = "M48 26 C 44 18, 40 14, 33 16";
const VIEW_H = 260;

export function BananaScrollProgress() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const clipY = useTransform(progress, [0, 1], [VIEW_H, 0]);
  const clipH = useTransform(progress, [0, 1], [0, VIEW_H]);

  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setScrolled(v > 0.06));

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  return (
    <button
      type="button"
      className={`banana-scroll${scrolled ? " banana-scroll--active" : ""}`}
      aria-label="Scroll progress — back to top"
      title="Back to top"
      onClick={toTop}
    >
      <svg viewBox="0 0 140 260" aria-hidden="true">
        <defs>
          <clipPath id="banana-fill-clip">
            <motion.rect
              x="0"
              width="140"
              y={reduced ? 0 : clipY}
              height={reduced ? VIEW_H : clipH}
            />
          </clipPath>
        </defs>
        <path className="banana-track" d={BANANA_BODY} />
        <path className="banana-fill" d={BANANA_BODY} clipPath="url(#banana-fill-clip)" />
        <path className="banana-outline" d={BANANA_BODY} />
        <path className="banana-outline" d={BANANA_STEM} />
      </svg>
    </button>
  );
}
