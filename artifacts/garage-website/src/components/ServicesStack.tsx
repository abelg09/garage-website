import { ArrowUpRight } from "lucide-react";
import { BlurRevealText } from "./BlurRevealText";

// Mirrors lib/fallback-data.ts `services` so the section still reads well if no prop is passed.
const FALLBACK_SERVICES = [
  "Brand Strategy & Creatives",
  "Content Production",
  "Website & Apps",
  "Email Marketing",
  "Influencer Marketing",
  "Social Listening & Analytics",
  "Ecomm Marketing",
  "SEO / SEM",
  "CRM / ORM",
  "Mobile Marketing",
  "Media Planning & Buying",
  "Performance Marketing",
  "Tech Solutions with AR / VR",
];

const MARQUEE_WORDS = [
  "Strategy",
  "Creative",
  "Film",
  "Social",
  "Web & Apps",
  "Performance",
  "Content",
  "AR / VR",
];

/**
 * Expertise — a bold full-width "capabilities index" (warhol / amo / koto reference):
 * a marquee of keywords over a numbered big-type list, each row sweeping yellow on hover.
 */
export function ServicesStack({ services }: { services?: string[] }) {
  const list = services && services.length ? services : FALLBACK_SERVICES;

  return (
    <section id="services" className="section-band expertise2" aria-labelledby="expertise-title">
      <div className="expertise2-marquee" aria-hidden="true">
        <div className="expertise2-marquee-track">
          {[0, 1].map((dup) => (
            <span className="expertise2-marquee-row" key={dup}>
              {MARQUEE_WORDS.map((word) => (
                <span className="expertise2-marquee-word" key={word}>
                  {word}
                  <i>✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="expertise2-inner">
        <div className="expertise2-head">
          <p className="eyebrow eyebrow--marker">What we do</p>
          <h2 className="expertise2-title">
            <BlurRevealText text="Expertise" id="expertise-title" />
          </h2>
          <p className="expertise2-lead">
            Full-stack creative capability — from first insight to final frame. One garage,
            every discipline under the same roof.
          </p>
          <a href="#contact" className="expertise2-cta">
            Start a project <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <ol className="expertise2-list">
          {list.map((name, index) => (
            <li className="expertise2-row" key={name}>
              <span className="expertise2-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="expertise2-name">{name}</span>
              <ArrowUpRight className="expertise2-arrow" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
