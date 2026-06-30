import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { Link, useLocation } from "wouter";

import type { CrewMember, GarageContent, ImageAsset, Project } from "../lib/types";
import { ServicesStack } from "./ServicesStack";
import { ContactForm } from "./ContactForm";
import { BananaScrollProgress } from "./BananaScrollProgress";

type GarageSiteProps = {
  content: GarageContent;
};

type NavItem = { label: string } & ({ hash: string } | { to: string });

const navItems: NavItem[] = [
  { label: "About", hash: "about" },
  { label: "Work", to: "/work" },
  { label: "Clients", hash: "clients" },
  { label: "Crew", hash: "crew" },
  { label: "Services", hash: "services" },
  { label: "Contact", hash: "contact" }
];

const reveal = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0 }
};

import { BlurRevealText } from "./BlurRevealText";
export { BlurRevealText };

export function GarageSite({ content }: GarageSiteProps) {
  useHashScrollOnMount();

  return (
    <>
      <SiteHeader wordmark={content.site.wordmark} />
      <main>
        <HeroSection content={content} />
        <AboutStory content={content} />
        <p className="option-flag"><span>Work — Option 1 · Horizontal-scroll gallery</span></p>
        <WorkSection projects={content.projects} />
        <p className="option-flag"><span>Work — Option 2 · Editorial hover-reveal list</span></p>
        <WorkListSection projects={content.projects} />
        <ClientsSection clients={content.clients} />
        <p className="option-flag"><span>Crew — Option 1 · Names-wall (koto)</span></p>
        <CrewSection crew={content.crew} />
        <p className="option-flag"><span>Crew — Option 2 · Sliced portrait strips</span></p>
        <CrewSlices crew={content.crew} />
        <ServicesStack services={content.services} />
        <ContactSection content={content} />
      </main>
      <BananaScrollProgress />
    </>
  );
}

function useHashScrollOnMount() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash || hash.length < 2) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
}

export function SiteHeader({ wordmark }: { wordmark: ImageAsset }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/" || location === "";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const hashHref = (id: string) => (isHome ? `#${id}` : `${import.meta.env.BASE_URL}#${id}`);

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="GARAGE home">
        <img src={wordmark.src} alt={wordmark.alt} width={360} height={120} />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) =>
          "to" in item ? (
            <Link key={item.label} href={item.to}>
              {item.label}
            </Link>
          ) : (
            <a key={item.label} href={hashHref(item.hash)}>
              {item.label}
            </a>
          )
        )}
      </nav>
      <button
        className="icon-button mobile-menu-button"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          >
            {navItems.map((item) =>
              "to" in item ? (
                <Link key={item.label} href={item.to} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={hashHref(item.hash)} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              )
            )}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function HeroSection({ content }: { content: GarageContent }) {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const isMobile = useMediaMax(760);
  const cinematic = !reduced && !isMobile;

  // rAF poll of the section's scroll position → no measurement race, no scroll-event
  // dependency. 0 = closed shutter, 1 = fully open.
  const heroProgress = useMotionValue(0);
  useEffect(() => {
    if (!cinematic) {
      heroProgress.set(0);
      return;
    }
    let raf = 0;
    const tick = () => {
      const sec = heroRef.current;
      if (sec) {
        const secTop = sec.getBoundingClientRect().top + window.scrollY;
        const scrollable = Math.max(1, sec.offsetHeight - window.innerHeight);
        heroProgress.set(Math.min(1, Math.max(0, (window.scrollY - secTop) / scrollable)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cinematic, heroProgress]);

  const shutterY = useTransform(heroProgress, [0, 0.46], ["0%", "-118%"]);
  const shutterOpacity = useTransform(heroProgress, [0.4, 0.5], [1, 0]);
  const cueOpacity = useTransform(heroProgress, [0, 0.1], [1, 0]);
  const copyOpacity = useTransform(heroProgress, [0.3, 0.5], [0, 1]);
  const copyY = useTransform(heroProgress, [0.3, 0.5], [42, 0]);
  const artOpacity = useTransform(heroProgress, [0.24, 0.46], [0, 1]);
  const artScale = useTransform(heroProgress, [0.24, 0.58], [0.92, 1]);

  const heroArt = (
    <Illustration
      src="/assets/illustrations/toolbox.png"
      alt={`${content.site.title} tool chest`}
      className="illus-toolbox"
    >
      <ToolboxDoodle wordmark={content.site.title} />
    </Illustration>
  );

  const heroCopy = (
    <>
      <span className="hero2-spark" aria-hidden="true">
        <Doodle name="spark" />
      </span>
      <p className="eyebrow hero2-eyebrow">{content.site.title} Worldwide</p>
      <h1 className="hero2-headline">
        <span>Big ideas</span>
        <span>start at</span>
        <span className="hero2-headline-brand">Garage</span>
      </h1>
      <p className="hero2-blurb">
        Every icon starts somewhere — a garage, an idea, a decision to begin.
        That&rsquo;s Garage: an ad agency built on instinct over excess.
        We don&rsquo;t wait for perfect conditions.
      </p>
      <a className="hero2-cta" href="#work">
        See the work <ArrowUpRight aria-hidden="true" />
      </a>
    </>
  );

  // Single <section> element (heroRef never swaps) — pinned shutter reveal on desktop,
  // plain hero on mobile / reduced-motion.
  return (
    <section
      id="about"
      ref={heroRef}
      className={`hero2${cinematic ? " hero2-pinned" : ""}`}
      aria-label="About GARAGE"
      style={cinematic ? { height: "190vh" } : undefined}
    >
      {cinematic ? (
        <div className="hero2-stage">
          <Doodle name="star" className="hero2-doodle hero2-doodle--star" />
          <Doodle name="loop" className="hero2-doodle hero2-doodle--loop" />
          <div className="hero2-inner">
            <motion.div className="hero2-art" style={{ opacity: artOpacity, scale: artScale }}>
              {heroArt}
            </motion.div>
            <motion.div className="hero2-copy" style={{ opacity: copyOpacity, y: copyY }}>
              {heroCopy}
            </motion.div>
          </div>

          <motion.div
            className="hero2-shutter"
            style={{ y: shutterY, opacity: shutterOpacity }}
            aria-hidden="true"
          >
            <GarageShutter wordmark={content.site.title} />
            <motion.span className="hero2-shutter-cue" style={{ opacity: cueOpacity }}>
              <span>scroll</span>
              <ChevronDown aria-hidden="true" />
            </motion.span>
          </motion.div>
        </div>
      ) : (
        <>
          <Doodle name="star" className="hero2-doodle hero2-doodle--star" />
          <Doodle name="loop" className="hero2-doodle hero2-doodle--loop" />
          <div className="hero2-inner">
            <div className="hero2-art">{heroArt}</div>
            <div className="hero2-copy">{heroCopy}</div>
          </div>
          <a className="hero2-scrollcue" href="#work" aria-label="Scroll to our work">
            <span>scroll</span>
            <ChevronDown aria-hidden="true" />
          </a>
        </>
      )}
    </section>
  );
}

/** Hand-marker closed roll-up garage shutter — the cinematic hero overlay that lifts on scroll. */
function GarageShutter({ wordmark }: { wordmark: string }) {
  const slats = Array.from({ length: 9 }, (_, i) => {
    const y = 250 + i * 50;
    return <path key={i} d={`M250 ${y} q250 -12 500 0`} />;
  });
  return (
    <svg className="garage-shutter-svg" viewBox="0 0 1000 780" role="img" aria-label={`${wordmark} shutter`}>
      <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        {/* top roll / canister */}
        <path
          d="M206 66 q-72 -6 -74 72 q-2 80 72 86 q300 24 596 4 q72 -5 72 -84 q0 -78 -74 -80 q-296 -24 -592 -2 z"
          fill="rgba(0,0,0,0.03)"
        />
        <path d="M250 92 q250 -16 500 4" />
        {/* side posts */}
        <path d="M170 232 l6 520 M830 232 l-6 520" />
        {/* opening top edge */}
        <path d="M212 226 q288 -14 576 0" />
        {/* slats */}
        {slats}
        {/* handle slot */}
        <path d="M466 716 q42 -10 80 0" strokeWidth="14" />
        {/* base line */}
        <path d="M178 752 q322 18 644 0" />
      </g>
    </svg>
  );
}

/** The longer origin story — cream editorial band right under the hero. Reuses home copy. */
function AboutStory({ content }: { content: GarageContent }) {
  return (
    <section className="section-band about-story" aria-label="The original startup room">
      <div className="section-inner about-story-inner">
        <div className="about-story-head">
          <p className="eyebrow eyebrow--marker">{content.home.introKicker}</p>
          <h2 className="about-story-title">{content.home.introTitle}</h2>
        </div>
        <div className="about-story-body">
          {content.home.introBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Image with a graceful hand-drawn fallback. Drop the designer's transparent export at
 * `src` (see public/assets/illustrations/README) and it replaces the inline doodle stand-in.
 */
function Illustration({
  src,
  alt,
  className,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`illus${className ? ` ${className}` : ""}`}>
      {failed ? (
        children ?? <span className="illus-fallback" role="img" aria-label={alt} />
      ) : (
        <img src={src} alt={alt} loading="eager" onError={() => setFailed(true)} />
      )}
    </span>
  );
}

/** Hand-marker tool chest stand-in (until the designer's toolbox.png is exported). */
function ToolboxDoodle({ wordmark }: { wordmark: string }) {
  return (
    <svg className="toolbox-doodle" viewBox="0 0 520 430" role="img" aria-label={`${wordmark} tool chest`}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* lid */}
        <path d="M70 96 q-14 -2 -16 22 q-1 26 14 30 q200 16 384 2 q16 -3 15 -28 q-1 -24 -16 -24 q-190 -16 -381 -4 z" fill="rgba(0,0,0,0.04)" />
        <path d="M96 78 q170 -16 332 0" />
        {/* cabinet body */}
        <path d="M58 150 l8 250 q1 14 16 14 l356 0 q15 0 16 -14 l8 -250" />
        {/* legs */}
        <path d="M74 414 l-2 14 M446 414 l2 14" />
        {/* drawers */}
        <path d="M70 200 l380 0 M66 250 l388 0 M64 300 l392 0 M62 350 l396 0" />
        {/* drawer handles */}
        <path d="M150 175 l60 0 M310 175 l60 0 M150 225 l60 0 M310 225 l60 0 M150 275 l60 0 M310 275 l60 0 M150 325 l60 0 M310 325 l60 0" strokeWidth="9" />
      </g>
      {/* GARAGE plaque */}
      <g transform="translate(232 168)">
        <rect x="0" y="0" width="56" height="200" rx="6" fill="currentColor" />
      </g>
      <text
        x="260"
        y="268"
        transform="rotate(-90 260 268)"
        textAnchor="middle"
        className="toolbox-doodle-word"
      >
        {wordmark}
      </text>
    </svg>
  );
}

/** Small reusable marker doodles (stars, sparks, loops) for the playful accents. */
function Doodle({ name, className }: { name: "star" | "spark" | "loop"; className?: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "star") {
    return (
      <svg className={className} viewBox="0 0 60 60" aria-hidden="true">
        <path d="M30 6 l7 16 l17 2 l-13 12 l4 17 l-15 -9 l-15 9 l4 -17 l-13 -12 l17 -2 z" {...common} />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg className={className} viewBox="0 0 60 60" aria-hidden="true">
        <path d="M14 30 h12 M46 30 h-12 M30 14 v12 M30 46 v-12 M19 19 l7 7 M41 41 l-7 -7 M41 19 l-7 7 M19 41 l7 -7" {...common} />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 120 60" aria-hidden="true">
      <path d="M6 40 q20 -34 44 -20 q18 11 4 26 q-12 12 -22 -2 q-7 -12 10 -20 q22 -10 60 6" {...common} />
    </svg>
  );
}

function useMediaMax(px: number) {
  const [match, setMatch] = useState(
    () => typeof window !== "undefined" && window.matchMedia(`(max-width:${px}px)`).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${px}px)`);
    const onChange = () => setMatch(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [px]);
  return match;
}

// Work — pinned horizontal-scroll gallery (oddlymade / koto reference).
// Vertical page scroll drives the track sideways; stacks vertically on mobile / reduced-motion.
function WorkSection({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const isMobile = useMediaMax(860);
  const horizontal = !isMobile && !reduced;

  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    if (!horizontal) {
      setMaxX(0);
      return;
    }
    const measure = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      setMaxX(Math.max(0, track.scrollWidth - stage.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    const imgs = Array.from(trackRef.current?.querySelectorAll("img") ?? []);
    imgs.forEach((img) => img.addEventListener("load", measure));
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [horizontal, projects.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 28, mass: 0.4 });

  const sectionStyle = horizontal && maxX > 0 ? { height: `calc(100svh + ${maxX}px)` } : undefined;

  return (
    <section
      id="work"
      className={`section-band work2${horizontal ? "" : " work2--stacked"}`}
      aria-labelledby="work-title"
      ref={sectionRef}
      style={sectionStyle}
    >
      <div className="work2-stage" ref={stageRef}>
        <div className="work2-head">
          <div>
            <p className="eyebrow eyebrow--marker">Selected work</p>
            <h2 id="work-title" className="work2-title">Our Works</h2>
          </div>
          <Link className="work2-viewall" href="/work">
            View all <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <motion.div
          className="work2-track"
          ref={trackRef}
          style={horizontal ? { x } : undefined}
          role="list"
        >
          {projects.map((project, index) => (
            <Link
              key={project.id}
              className="work2-card"
              href={`/work/${project.id}`}
              role="listitem"
              aria-labelledby={`work-card-${project.id}`}
            >
              <span className="work2-card-media">
                <span className="work2-card-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
                <span className="work2-card-cta">
                  View Case Study <ArrowUpRight aria-hidden="true" />
                </span>
              </span>
              <span className="work2-card-meta">
                <span className="work2-card-tag">{project.category}</span>
                <span className="work2-card-titles">
                  <span className="work2-card-title" id={`work-card-${project.id}`}>
                    {project.title}
                  </span>
                  <span className="work2-card-client">{project.client}</span>
                </span>
              </span>
            </Link>
          ))}
          <Link className="work2-card work2-card--all" href="/work" aria-label="View all work">
            <span className="work2-all-inner">
              All<br />work <ArrowUpRight aria-hidden="true" />
            </span>
          </Link>
        </motion.div>

        <div className="work2-progress" aria-hidden="true">
          <motion.span style={horizontal ? { scaleX: scrollYProgress } : undefined} />
        </div>
      </div>
    </section>
  );
}

const WORKLIST_PUCK = 116;
const WORKLIST_EASE: [number, number, number, number] = [0.215, 0.61, 0.355, 1]; // ≈ GSAP power3.out

// Work — Option 2: oddlymade-style editorial list. SCROLL-DRIVEN — the section pins and the
// active project advances with scroll: each opens (left-to-right), then shrinks diagonally away
// as the next opens. Cursor-following "View Project" puck on the active image.
function WorkListSection({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const isMobile = useMediaMax(760);
  const total = projects.length;

  const [active, setActive] = useState(0);
  const prevRef = useRef(-1); // the row currently closing
  const lastRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (isMobile) return;
    const idx = Math.max(0, Math.min(total - 1, Math.floor(p * total)));
    if (idx !== lastRef.current) {
      prevRef.current = lastRef.current;
      lastRef.current = idx;
      setActive(idx);
    }
  });

  // Cursor-following puck over the active image.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.5 });
  const py = useSpring(my, { stiffness: 260, damping: 28, mass: 0.5 });
  const trackPuck = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - WORKLIST_PUCK / 2);
    my.set(e.clientY - r.top - WORKLIST_PUCK / 2);
  };

  return (
    <section
      id="work-list"
      ref={sectionRef}
      className={`section-band worklist-section${isMobile ? "" : " worklist-scroll"}`}
      aria-label="Work — editorial list"
      style={isMobile ? undefined : { height: `${total * 72 + 40}vh` }}
    >
      <div className="worklist-pin">
        <div className="worklist-inner">
          <header className="worklist-head">
            <p className="eyebrow eyebrow--marker">Selected work</p>
            <h2 className="worklist-h">Work</h2>
          </header>

          <div className="worklist-colhead" aria-hidden="true">
            <span>Brand</span>
            <span>Project</span>
            <span>Category</span>
          </div>

          <ul className="worklist" role="list">
            {projects.map((project, i) => {
              const isActive = active === i;
              // open (active) · closing (just left → shrinks diagonally) · closed
              const phase =
                isMobile || isActive ? "open" : i === prevRef.current ? "closing" : "closed";
              const innerAnim =
                phase === "open"
                  ? { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
                  : phase === "closing"
                    ? { opacity: 0, scale: 0.42, clipPath: "inset(0% 0% 0% 0%)" }
                    : { opacity: 0, scale: 1, clipPath: "inset(0% 100% 0% 0%)" };
              return (
                <li key={project.id} className={`worklist-row${isActive ? " is-active" : ""}`}>
                  <Link
                    href={`/work/${project.id}`}
                    className="worklist-link"
                    aria-label={`${project.client} — ${project.title}`}
                  >
                    <span className="worklist-cell worklist-brand">
                      <span className="worklist-idx" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {project.client}
                    </span>
                    <span className="worklist-cell worklist-project">{project.title}</span>
                    <span className="worklist-cell worklist-cat">
                      {project.category}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </Link>

                  <motion.div
                    className="worklist-reveal"
                    initial={false}
                    animate={{ height: phase === "open" ? "auto" : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.55, ease: WORKLIST_EASE }}
                  >
                    <Link
                      href={`/work/${project.id}`}
                      className="worklist-media"
                      onMouseMove={isMobile ? undefined : trackPuck}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <motion.span
                        className="worklist-media-inner"
                        initial={false}
                        animate={innerAnim}
                        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: WORKLIST_EASE }}
                      >
                        <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
                      </motion.span>
                      {!isMobile ? (
                        <motion.span className="worklist-puck" style={{ x: px, y: py }} aria-hidden="true">
                          View
                          <br />
                          Project
                        </motion.span>
                      ) : null}
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ClientsSection({ clients }: { clients: GarageContent["clients"] }) {
  return (
    <section id="clients" className="section-band clients-section" aria-labelledby="clients-title">
      <div className="section-inner">
        <SectionHeading id="clients-title">Clients</SectionHeading>
        <motion.div
          className="client-grid"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          {clients.map((client) => (
            <div
              className={`client-logo client-logo-${clientLogoSlug(client)}`}
              key={client.id}
              role="img"
              aria-label={`${client.name} client logo`}
            >
              {client.logo?.src ? (
                <img
                  src={client.logo.src}
                  alt={client.logo.alt}
                  style={{ width: "100%", maxWidth: "170px", height: "auto", display: "block" }}
                />
              ) : (
                <ClientWordmark name={client.name} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function clientLogoSlug(client: GarageContent["clients"][number]) {
  return (client.id || client.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ClientWordmark({ name }: { name: string }) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  switch (slug) {
    case "grameen-kulfi":
      return (
        <span className="client-mark client-mark-badge">
          <b>Grameen</b>
          <small>Kulfi</small>
        </span>
      );
    case "johnson":
      return (
        <span className="client-mark client-mark-johnson">
          <i aria-hidden="true" />
          <b>Johnson</b>
          <small>{"Designers' Choice"}</small>
        </span>
      );
    case "croma":
      return <span className="client-mark client-mark-croma">croma</span>;
    case "nippon-india-mutual-fund":
      return (
        <span className="client-mark client-mark-nippon">
          <i aria-hidden="true" />
          <b>Nippon India</b>
          <small>Mutual Fund</small>
        </span>
      );
    case "tata":
      return (
        <span className="client-mark client-mark-tata">
          <i aria-hidden="true">T</i>
          <b>Tata</b>
        </span>
      );
    case "kalpa-taru":
      return (
        <span className="client-mark client-mark-kalpa">
          <i aria-hidden="true" />
          <b>Kalpa-Taru</b>
        </span>
      );
    case "jameson":
      return <span className="client-mark client-mark-jameson">Jameson</span>;
    case "marvel":
      return (
        <span className="client-mark client-mark-marvel">
          <i aria-hidden="true" />
          <b>Marvel</b>
        </span>
      );
    case "senco":
      return (
        <span className="client-mark client-mark-senco">
          <b>Senco</b>
          <small>Gold & Diamonds</small>
        </span>
      );
    case "ifb":
      return (
        <span className="client-mark client-mark-ifb">
          <b>IFB</b>
          <small>www.ifbappliances.com</small>
        </span>
      );
    case "plum":
      return (
        <span className="client-mark client-mark-plum">
          pl<span aria-hidden="true">u</span>m
        </span>
      );
    case "south-indian-bank":
      return (
        <span className="client-mark client-mark-sib">
          <i aria-hidden="true" />
          <b>South Indian Bank</b>
        </span>
      );
    case "jacob-s-creek":
      return (
        <span className="client-mark client-mark-jacobs">
          <i aria-hidden="true" />
          <b>{"Jacob's Creek"}</b>
        </span>
      );
    case "imperial-blue":
      return (
        <span className="client-mark client-mark-imperial">
          <b>Imperial Blue</b>
          <small>Imported Grain Spirit</small>
        </span>
      );
    default:
      return <span className="client-mark">{name}</span>;
  }
}

function CrewSection({ crew }: { crew: CrewMember[] }) {
  // selectedIndex → full-bio modal · activeIndex → name-wall spotlight
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = selectedIndex === null ? null : crew[selectedIndex];
  const active = crew[activeIndex] ?? crew[0];

  const close = () => setSelectedIndex(null);
  const previous = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current - 1 + crew.length) % crew.length));
  const next = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current + 1) % crew.length));

  return (
    <section id="crew" className="section-band crew-section crew-wall-section" aria-labelledby="crew-title">
      <div className="section-inner">
        <SectionHeading id="crew-title">Crew</SectionHeading>
        <p className="crew-wall-sub">
          The people who start it messy and sign their name to the work. Hover a name to
          meet them — click to read the full story.
        </p>

        <div className="crew-wall">
          <div className="crew-spotlight">
            <button
              type="button"
              className="crew-spotlight-card"
              onClick={() => setSelectedIndex(activeIndex)}
              aria-label={`Read ${active.name}'s bio`}
            >
              <span className="crew-spotlight-photo">
                {active.portrait?.src ? (
                  <img
                    key={active.id}
                    src={active.portrait.src}
                    alt={active.portrait.alt}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                  />
                ) : (
                  <span aria-hidden="true" />
                )}
              </span>
              <span className="crew-spotlight-meta">
                <span className="crew-spotlight-name">{active.name}</span>
                <span className="crew-spotlight-role">{active.role}</span>
                <span className="crew-spotlight-loc">Mumbai</span>
                <span className="crew-spotlight-cta">
                  Read bio <ArrowUpRight aria-hidden="true" />
                </span>
              </span>
            </button>
          </div>

          <ul className="crew-names" role="list">
            {crew.map((member, index) => (
              <li key={member.id}>
                <button
                  type="button"
                  className={`crew-name${index === activeIndex ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setSelectedIndex(index)}
                >
                  <span className="crew-name-text">{member.name}</span>
                  <span className="crew-name-role">{member.role}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <CrewModal
        member={selected}
        onClose={close}
        onPrevious={previous}
        onNext={next}
      />
    </section>
  );
}

// Crew — Option 2: black-and-white sliced portrait strips. Hover expands a strip to the full
// face (in colour) with name + designation; click opens the bio.
function CrewSlices({ crew }: { crew: CrewMember[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : crew[selectedIndex];
  const close = () => setSelectedIndex(null);
  const previous = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current - 1 + crew.length) % crew.length));
  const next = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current + 1) % crew.length));

  return (
    <section id="crew-slices" className="section-band crew-slices-section" aria-labelledby="crew-slices-title">
      <div className="section-inner">
        <SectionHeading id="crew-slices-title">Crew</SectionHeading>
        <p className="crew-wall-sub">
          One garage, many faces. Hover a strip to meet them — click for the full story.
        </p>
      </div>
      <div className="crew-slices" role="list">
        {crew.map((member, index) => (
          <button
            key={member.id}
            type="button"
            className="crew-slice"
            role="listitem"
            onClick={() => setSelectedIndex(index)}
            aria-label={`${member.name}, ${member.role}`}
          >
            <span
              className="crew-slice-img"
              style={member.portrait?.src ? { backgroundImage: `url("${member.portrait.src}")` } : undefined}
            />
            <span className="crew-slice-shade" aria-hidden="true" />
            <span className="crew-slice-meta">
              <b className="crew-slice-name">{member.name}</b>
              <small className="crew-slice-role">{member.role}</small>
            </span>
          </button>
        ))}
      </div>
      <CrewModal member={selected} onClose={close} onPrevious={previous} onNext={next} />
    </section>
  );
}

function CrewModal({
  member,
  onClose,
  onPrevious,
  onNext
}: {
  member: CrewMember | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return undefined;

    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusFirst = window.setTimeout(() => {
      const first = modalRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      first?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); onPrevious(); }
      if (event.key === "ArrowRight") { event.preventDefault(); onNext(); }
      if (event.key === "Tab") {
        const focusable = Array.from(
          modalRef.current?.querySelectorAll<HTMLElement>(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
          ) ?? []
        ).filter((node) => !node.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusFirst);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousActive?.focus();
    };
  }, [member, onClose, onNext, onPrevious]);

  return (
    <AnimatePresence>
      {member ? (
        <motion.div
          className="modal-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="crew-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crew-modal-title"
            ref={modalRef}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            data-testid="crew-modal"
          >
            <div className="modal-toolbar">
              <button className="icon-button" type="button" aria-label="Previous crew member" onClick={onPrevious}>
                <ChevronLeft aria-hidden="true" />
              </button>
              <button className="icon-button" type="button" aria-label="Next crew member" onClick={onNext}>
                <ChevronRight aria-hidden="true" />
              </button>
              <button className="icon-button" type="button" aria-label="Close crew profile" onClick={onClose}>
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="modal-portrait">
              {member.portrait?.src ? (
                <img
                  src={member.portrait.src}
                  alt={member.portrait.alt}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span aria-hidden="true" />
              )}
            </div>
            <div className="modal-copy">
              <p className="eyebrow">{member.role}</p>
              <h3 id="crew-modal-title">{member.name}</h3>
              {member.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}


function ContactSection({ content }: { content: GarageContent }) {
  const mapQuery = encodeURIComponent(content.site.address.join(" "));

  return (
    <section id="contact" className="section-band contact-section" aria-labelledby="contact-title">
      <div className="section-inner contact-layout">
        <div>
          <SectionHeading id="contact-title">Contact</SectionHeading>
          <div className="contact-columns">
            <div>
              <p className="eyebrow">Email</p>
              <a href={`mailto:${content.site.email}`}>{content.site.email}</a>
            </div>
            <div>
              <p className="eyebrow">Address</p>
              <a
                href={`https://maps.google.com/?q=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
              >
                {content.site.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
        <motion.div
          className="contact-collage"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={content.contact.collage.src}
            alt={content.contact.collage.alt}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeading({ children, id }: { children: string; id: string }) {
  return (
    <motion.h2
      id={id}
      className="section-title"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  );
}
