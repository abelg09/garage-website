import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

import type { GarageContent, Project } from "../lib/types";
import { publicAsset } from "../lib/public-asset";
import "./v3.css";

const v2 = (name: string) => publicAsset(`v2/${name}.webp`);

function useMax(px: number) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(`(max-width:${px}px)`).matches);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${px}px)`);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    window.addEventListener("resize", on);
    return () => { mq.removeEventListener("change", on); window.removeEventListener("resize", on); };
  }, [px]);
  return m;
}

const MENU_ITEMS: [string, string][] = [
  ["about us", "story"],
  ["work", "/work"],
  ["crew", "crew"],
  ["contact us", "contact"],
];

export function GarageV3({ content }: { content: GarageContent }) {
  // arriving with a hash (e.g. from /work's nav) skips the intro and
  // lands directly on the section
  const [introDone, setIntroDone] = useState(() => typeof window !== "undefined" && !!window.location.hash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [overCream, setOverCream] = useState(false);
  const [teamFlipped, setTeamFlipped] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const t = window.setTimeout(
      () => document.getElementById(hash)?.scrollIntoView({ behavior: "auto", block: "start" }),
      120
    );
    return () => window.clearTimeout(t);
  }, []);

  // The design file only shows the white wordmark on navy pages — fade it
  // out while the cream Work/Brands pages sit under it.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const work = document.getElementById("work");
      const crew = document.getElementById("crew");
      if (!work || !crew) return;
      const y = 70;
      setOverCream(work.getBoundingClientRect().top <= y && crew.getBoundingClientRect().top > y);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    if (id.startsWith("/")) {
      navigate(id);
      return;
    }
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <div className="v3" style={{ "--v3-texture": `url("${v2("texture")}")`, "--v3-fabric": `url("${v2("fabric-navy")}")`, "--v3-menu-tear": `url("${v2("menu-tear")}")` } as React.CSSProperties}>
      {!introDone ? <IntroLoader onDone={() => setIntroDone(true)} /> : null}
      <HeroGarage active={introDone} />
      <AboutV3 />
      <WorkV3 projects={content.projects} />
      <BrandsV3 clients={content.clients} flipped={teamFlipped} />
      <TeamFlip crew={content.crew} flipped={teamFlipped} setFlipped={setTeamFlipped} />
      <ContactV3 site={content.site} />
      <img className={`v3-wordmark-fixed${menuOpen || overCream ? " is-hidden" : ""}`} src={v2("wordmark-white")} alt="GARAGE" />
      <button
        type="button"
        className={`v3-banana-corner${menuOpen ? " is-open" : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <img src={v2("banana")} alt="" />
      </button>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="v3-menu v3-fabric"
            initial={{ y: "-104%" }}
            animate={{ y: 0 }}
            exit={{ y: "-104%" }}
            transition={{ duration: 0.34, ease: [0.22, 0.8, 0.3, 1] }}
          >
            <img className="v3-menu-wordmark" src={v2("wordmark-white")} alt="" aria-hidden="true" />
            <nav aria-label="Menu">
              {MENU_ITEMS.map(([label, id]) => (
                <button key={id} type="button" onClick={() => go(id)}>
                  {label}
                </button>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ── Intro: designer frames pop in sequence on the textured orange ── */
function IntroLoader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const [frame, setFrame] = useState(0);
  const frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => v2(`intro-${n}`));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (reduced) {
      onDone();
      return;
    }
    let cycles = 0;
    const timer = window.setInterval(() => {
      setFrame((f) => {
        if (f >= frames.length - 1) {
          cycles += 1;
          if (cycles >= 2) {
            window.clearInterval(timer);
            window.setTimeout(onDone, 250);
            return f;
          }
          return 0;
        }
        return f + 1;
      });
    }, 100);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <motion.div
      className="v3-intro v3-tex"
      onClick={onDone}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      aria-hidden="true"
    >
      {frames.map((src, i) => (
        <img key={src} src={src} alt="" className={i === frame ? "is-on" : ""} loading="eager" />
      ))}
    </motion.div>
  );
}

/* ── Hero: closed shutter lifts on scroll to reveal the navy GARAGE door ── */
function HeroGarage({ active }: { active: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const progress = useMotionValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      return;
    }
    let raf = 0;
    const tick = () => {
      const sec = ref.current;
      if (sec) {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        const scrollable = Math.max(1, sec.offsetHeight - window.innerHeight);
        progress.set(Math.min(1, Math.max(0, (window.scrollY - top) / scrollable)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, progress]);

  const shutterY = useTransform(progress, [0.04, 0.5], ["0%", "-104%"]);
  const doorScale = useTransform(progress, [0.04, 0.6], [1.06, 1]);
  const cueOpacity = useTransform(progress, [0, 0.1], [1, 0]);

  return (
    <section id="about" ref={ref} className="v3-hero" aria-label="GARAGE">
      <div className="v3-hero-stage">
        <motion.div className="v3-hero-door v3-fabric" style={{ scale: reduced ? 1 : doorScale }}>
          <img className="v3-door-art" src={v2("door-art")} alt="Hand-drawn garage door with GARAGE painted on it" />
        </motion.div>
        <motion.div className="v3-hero-shutter" style={{ y: reduced ? "-104%" : shutterY }} aria-hidden="true">
          <img src={v2("shutter")} alt="" />
        </motion.div>
        {active ? (
          <motion.span className="v3-hero-cue" style={{ opacity: cueOpacity }}>
            scroll to open
            <ChevronDown aria-hidden="true" />
          </motion.span>
        ) : null}
      </div>
    </section>
  );
}

/* ── Sticky navy menu with torn bottom edge (page 9) ── */
function HeaderV3() {
  const items = [
    ["About us", "about"],
    ["Work", "work"],
    ["Crew", "crew"],
    ["Contact us", "contact"],
  ];
  return (
    <header className="v3-header v3-fabric">
      <img className="v3-header-wordmark" src={v2("wordmark-white")} alt="GARAGE" />
      <nav className="v3-header-nav" aria-label="Primary">
        {items.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

/* ── About (page 10) ── */
function AboutV3() {
  return (
    <section id="story" className="v3-about-wrap" aria-label="About Garage">
      <div className="v3-about-navy v3-fabric">
        <img className="v3-about-horns" src={v2("horns-fill")} alt="" aria-hidden="true" />
        <div className="v3-about-navy-inner">
          <h2 className="v3-about-headline">
            The best ideas often have
            <br />
            one place in common. A garage.
          </h2>
        </div>
      </div>
      <div className="v3-about-cream">
        <div className="v3-about-cream-inner">
          <h3 className="v3-og-title">
            The
            <br />
            OG startup
            <br />
            room.
          </h3>
          <p className="v3-og-copy">
            HP in 1939. Apple in 1976. Amazon in 1994…{" "}
            <br />
            And here we are.{" "}
            <br />
            Fueled by (frankly, an insane amount of){" "}
            <br />
            free bananas and fresh coffee,{" "}
            <br />
            we&rsquo;re an unserious bunch that likes{" "}
            <br />
            to make seriously good work.
          </p>
        </div>
        <img className="v3-about-stairs" src={v2("stairs-new")} alt="" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ── Work (page 11 + fleshandbones-style filters) ── */
const WORK_FILTERS: { label: string; match: (p: Project) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "Campaigns", match: (p) => /campaign/i.test(p.category) },
  { label: "Films", match: (p) => /film/i.test(p.category) },
  { label: "Digital & Social", match: (p) => /digital|social/i.test(p.category) },
];

/* these three show only on /work and their case pages, not the home grid */
const HOME_WORK_HIDDEN = new Set(["croma", "johnson", "south-indian-bank"]);

function WorkV3({ projects }: { projects: Project[] }) {
  const shown = projects.filter((p) => !HOME_WORK_HIDDEN.has(p.id));

  return (
    <section id="work" className="v3-work" aria-labelledby="v3-work-title">
      <div className="v3-work-inner">
        <div className="v3-work-head">
          <h2 id="v3-work-title" className="v3-work-title">
            Work
          </h2>
          <img className="v3-work-couch" src={v2("couch")} alt="" aria-hidden="true" />
        </div>
        <div className="v3-work-grid">
          {shown.map((project, index) => (
            <div
              key={project.id}
              style={{ "--i": index } as React.CSSProperties}
              className="v3-work-cell"
            >
              <Link href={`/work/${project.id}`} className="v3-work-card">
                <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
                <span className="v3-work-card-strip">
                  <span className="v3-work-card-brand">{project.client}</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Brands (page 12) ── */
function BrandsV3({ clients, flipped }: { clients: GarageContent["clients"]; flipped: boolean }) {
  const withLogos = clients.filter((c) => c.logo);
  return (
    <section className="v3-brands" aria-labelledby="v3-brands-title">
      <div className="v3-brands-inner">
        <h2 id="v3-brands-title" className="v3-brands-title">
          Brands
        </h2>
        <div className="v3-brands-marquee" aria-label="Our brands">
          <div className="v3-brands-track">
            {[0, 1].map((dup) => (
              <div className="v3-brands-row" key={dup} aria-hidden={dup === 1}>
                {withLogos.map((client) => (
                  <span className="v3-brand-box" key={`${dup}-${client.name}`}>
                    <img src={client.logo!.src} alt={dup === 0 ? client.name : ""} loading="lazy" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <img
        className="v3-torn-orange"
        src={v2(flipped ? "torn-og" : "torn-navy")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}

/* ── Team flip (pages 13–16): OGs ⇄ Crew, flipped by the banana ── */
const OG_ZONES = [
  {
    key: "bryan", name: "Bryan Elijah", role: "Creative Head", left: "9%", width: "27%", cx: 22,
    bio: [
      "Bryan Elijah is a seasoned creative professional with over 20 years of experience delivering innovative campaigns across digital media, integrated marketing, and branding. Known for his work in the luxury automobile and high-end sectors, his agency background includes Rediffusion, Creativeland, Law & Kenneth, and Percept.",
      "Bryan has crafted impactful brand experiences for leading clients like Mercedes-Benz, Taj Hotels, and Electrolux. His work has earned top industry honors at Goafest, Spikes Asia, Effies, DMA, and Adfest, along with finalist recognition at D&AD, One Show Design, and New York Festivals.",
    ],
  },
  {
    key: "swati", name: "Swati Bobde", role: "Chief Operating Officer", left: "69%", width: "27%", cx: 82,
    bio: [
      "Swati Bobde is a growth leader, entrepreneur, and brand strategist with over 20 years of experience scaling brands and agencies. With hands-on expertise across advertising, design, digital, and production, she brings a rare end-to-end perspective to brand building. Her work has earned top industry honors, including Cannes Lions and Kyoorius awards.",
      "Swati co-founded Clay Strategy & Design and held leadership roles at Publicis, JWT, and Rediffusion. She has partnered with Global and APAC leadership across Emerging Markets, driving strategy for top brands like Garnier, Lakm\u00e9, Kellogg's, Marico, Colgate, and HDFC Ergo.",
      "As COO of Garage Worldwide, Swati shapes agency strategy and delivers measurable business impact by integrating creativity, technology, and culture.",
    ],
  },
  {
    key: "ashish", name: "Ashish Chakravarty", role: "Managing Partner & CCO", left: "38%", width: "30%", cx: 53,
    bio: [
      "Ashish Chakravarty is one of India's most awarded creative leaders, with over two decades of experience shaping iconic brands. Consistently ranked among the country's top creative directors, including Campaign India's No. 1 Creative Director (2026). He regularly chairs global award juries and mentors international talent through the London International Awards program.",
      "With nearly 500 awards from Cannes Lions, D&AD, One Show, Clio, Spikes Asia, and Effies, Ashish has led creative strategy at top agencies. His portfolio spans major global, homegrown, and political clients, including Nestl\u00e9, Coca-Cola, Dabur, Air India, Microsoft, Britannia, ITC, and the Government of India.",
      "As Managing Partner and CCO of Garage Worldwide, Ashish drives creative vision, brand strategy, and growth through bold, high-impact ideas.",
    ],
  },
];

// x/y/w/h = hover zone; lx/ly = the design's exact label anchor (page 16), % of the 16:9 frame
/* crew hover cards: zone = where the person stands on the clean scene,
   card = the artboard's card box (both in % of the 16:9 frame) */
const CREW_MEMBERS = [
  { key: "maithili", name: "Maithili", role: "SR. Account Executive", bio: "Carries the weight of the room’s fitness journey. Always on ‘get set go’ mode.", zone: { x: 17, y: 8, w: 12, h: 30 }, card: { x: 18.5, y: 29.44, w: 13.44 } },
  { key: "utsav", name: "Utsav", role: "Art Director", bio: "Weekly wallpaper supplier and heavy biker. Has a magic hat that he uses to keep pulling out references.", zone: { x: 31, y: 6, w: 12, h: 30 }, card: { x: 32.69, y: 25.44, w: 12.69 } },
  { key: "abhay", name: "Abhay", role: "Account Executive", bio: "In-house sports and adventure junkie. Keeps plans A, B, C ready (up to Z if required).", zone: { x: 44, y: 4, w: 13, h: 28 }, card: { x: 44.63, y: 22.89, w: 15.31 } },
  { key: "tanvi", name: "Tanvi", role: "SR. Visualizer", bio: "Dad-humour representative. Outpaces Ai when it comes to incorporating feedback.", zone: { x: 58, y: 7, w: 12, h: 29 }, card: { x: 59.94, y: 26.78, w: 12 } },
  { key: "kyle", name: "Kyle", role: "Account Manager", bio: "CMMO - Chief music and magic officer. More resourceful than Doremon.", zone: { x: 70, y: 9, w: 12, h: 29 }, card: { x: 72.25, y: 26.11, w: 9.38 } },
  { key: "aryan", name: "Aryan", role: "Junior Visualizer", bio: "Moves like Jaggu and loves birthdays & farewells (for the cake). The bigger the work-pile, the wider the smile.", zone: { x: 11, y: 38, w: 13, h: 28 }, card: { x: 12.88, y: 47.11, w: 12.63 } },
  { key: "rujvi", name: "Rujvi", role: "SR. Visualizer", bio: "Quietest, until you really know her. Currently overthinking a layout and making ‘just one small change’ for the 47th time.", zone: { x: 26, y: 37, w: 13, h: 28 }, card: { x: 26.94, y: 47.89, w: 14.94 } },
  { key: "vedant", name: "Vedant", role: "Copywriter", bio: "Part-time bartender, full time couch-hogger. Big fan of to-do lists.", zone: { x: 43, y: 34, w: 13, h: 29 }, card: { x: 44.44, y: 48.33, w: 10.69 } },
  { key: "aniket", name: "Aniket", role: "SR. Copywriter", bio: "Loves rewatching movies and talking about movies and well, movies. The hindi dictionary of the office.", zone: { x: 59, y: 37, w: 13, h: 27 }, card: { x: 61.75, y: 48.67, w: 14.88 } },
  { key: "saniya", name: "Saniya", role: "Visualizer", bio: "Resident party-planner and tea-giver. Works just as well in a team as she does solo.", zone: { x: 75, y: 37, w: 13, h: 28 }, card: { x: 77.13, y: 47.44, w: 12.81 } },
  { key: "mobaiyana", name: "Mobaiyana", role: "Copywriter", bio: "Usual over-thinker, occasional song hummer, and often caught daydreaming (she’s just crafting a headline).", zone: { x: 13, y: 66, w: 14, h: 30 }, card: { x: 16, y: 75.89, w: 11.69 } },
  { key: "madhurenu", name: "Madhurenu", role: "Creative Director", bio: "Turns thoughts into words and words into trouble. The good kind. Talks cars all the time. Lives in the Garage.", zone: { x: 28, y: 64, w: 14, h: 32 }, card: { x: 29, y: 79.56, w: 11.5 } },
  { key: "samir", name: "Samir", role: "SR. Account Manager", bio: "Has more shoes than some people have clothes. Loves a good brainstorming sesh.", zone: { x: 43, y: 62, w: 14, h: 34 }, card: { x: 43.63, y: 75, w: 15.06 } },
  { key: "pranali", name: "Pranali", role: "SR. Account Manager", bio: "Certified yapper and kadak chai lover. Powered by enthusiasm, especially if it’s Shawn Mendes-related.", zone: { x: 58, y: 65, w: 13, h: 31 }, card: { x: 60.75, y: 78.78, w: 11.69 } },
  { key: "adwait", name: "Adwait", role: "Art Director", bio: "90% screen-time = football, remaining 10% = soccer. Has a filing system for his filing system.", zone: { x: 72, y: 63, w: 14, h: 33 }, card: { x: 73.5, y: 74.78, w: 12.63 } },
];

function TeamFlip({
  crew,
  flipped,
  setFlipped,
}: {
  crew: GarageContent["crew"];
  flipped: boolean;
  setFlipped: (v: boolean) => void;
}) {
  const compact = useMax(900);
  const [ogActive, setOgActive] = useState<string | null>(null);
  // debounced hover: moving between a face zone and its card must never
  // drop the card (the overlay steals the zone's mouseleave)
  const ogTimer = useRef<number | undefined>(undefined);
  const ogEnter = (key: string) => {
    window.clearTimeout(ogTimer.current);
    setOgActive(key);
  };
  const ogLeave = () => {
    window.clearTimeout(ogTimer.current);
    ogTimer.current = window.setTimeout(() => setOgActive(null), 160);
  };
  const [crewActive, setCrewActive] = useState<string | null>(null);
  const crewTimer = useRef<number | undefined>(undefined);
  const crewEnter = (key: string) => {
    window.clearTimeout(crewTimer.current);
    setCrewActive(key);
  };
  const crewLeave = () => {
    window.clearTimeout(crewTimer.current);
    crewTimer.current = window.setTimeout(() => setCrewActive(null), 160);
  };

  return (
    <section id="crew" className={`v3-team${flipped ? " is-flipped" : ""}`} aria-label="Meet the team">
      <div className="v3-team-flipper">
        <div className="v3-team-face v3-team-face--ogs v3-fabric">
          <h2 className="v3-team-title">
            meet the og<span className="v3-title-s">s</span>
          </h2>
          <div className="v3-ogs-stage">
            <img src={v2("ogs14")} alt="The three Garage founders" loading="lazy" decoding="async" />
            {OG_ZONES.map((zone) => (
              <button
                key={`tap-${zone.key}`}
                type="button"
                className="v3-og-tap"
                style={{ left: zone.left, width: zone.width }}
                aria-label={`Show ${zone.name}`}
                onMouseEnter={compact ? undefined : () => ogEnter(zone.key)}
                onMouseLeave={compact ? undefined : ogLeave}
                onClick={() => setOgActive(ogActive === zone.key ? null : zone.key)}
              />
            ))}
            {OG_ZONES.filter((z) => z.key === ogActive).map((zone) => (
              <span
                key={zone.key}
                className={`v3-og-card v3-og-card--pop ${zone.cx < 35 ? "v3-og-card--edge-l" : zone.cx > 65 ? "v3-og-card--edge-r" : ""}`}
                data-key={zone.key}
                style={{ "--cx": `${zone.cx}%`, ...(zone.cx >= 35 && zone.cx <= 65 ? { left: `${zone.cx}%` } : null) } as React.CSSProperties}
                onMouseEnter={compact ? undefined : () => ogEnter(zone.key)}
                onMouseLeave={compact ? undefined : ogLeave}
              >
                <span className="v3-og-card-name">
                  {zone.name}
                  <br />
                  {/* demo Mader maps "&" to a watermark glyph — draw it in Lacquer */}
                  {zone.role.split("&").flatMap((part, i) =>
                    i === 0 ? [part] : [<span key={`amp-${i}`} className="v3-amp">&</span>, part]
                  )}
                </span>
                <span
                  className="v3-og-card-bio"
                  ref={(el) => {
                    if (!el) return;
                    const more = el.parentElement?.querySelector<HTMLElement>(".v3-og-card-more");
                    if (more) more.style.opacity = el.scrollHeight > el.clientHeight + 12 ? "1" : "0";
                  }}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const more = el.parentElement?.querySelector<HTMLElement>(".v3-og-card-more");
                    if (more)
                      more.style.opacity =
                        el.scrollTop + el.clientHeight >= el.scrollHeight - 10 ? "0" : "1";
                  }}
                >
                  {zone.bio.map((para) => (
                    <span key={para.slice(0, 24)} className="v3-og-card-para">{para}</span>
                  ))}
                </span>
                <span className="v3-og-card-more" aria-hidden="true">↓</span>
              </span>
            ))}
          </div>
        </div>

        <div className="v3-team-face v3-team-face--crew v3-tex">
          <div className="v3-crew-stage">
            <div className="v3-crew-frame">
              <img src={v2("crew-scene3")} alt="The Garage crew" loading="lazy" decoding="async" />
              {CREW_MEMBERS.map((m) => (
                <button
                  key={`tap-${m.key}`}
                  type="button"
                  className="v3-crew-zone"
                  style={{ left: `${m.zone.x}%`, top: `${m.zone.y}%`, width: `${m.zone.w}%`, height: `${m.zone.h}%` }}
                  aria-label={`Show ${m.name}`}
                  onMouseEnter={compact ? undefined : () => crewEnter(m.key)}
                  onMouseLeave={compact ? undefined : crewLeave}
                  onClick={() => setCrewActive(crewActive === m.key ? null : m.key)}
                />
              ))}
              {CREW_MEMBERS.filter((m) => m.key === crewActive).map((m) => (
                <span
                  key={m.key}
                  className="v3-crew-card"
                  style={{ left: `${m.card.x}%`, top: `${m.card.y}%`, width: `${m.card.w}%` } as React.CSSProperties}
                  onMouseEnter={compact ? undefined : () => crewEnter(m.key)}
                  onMouseLeave={compact ? undefined : crewLeave}
                >
                  {/* the designer's exact card, cut from the artboard's card layer */}
                  <img src={publicAsset(`v2/crew-cards/${m.key}.webp`)} alt={`${m.name}, ${m.role}. ${m.bio}`} decoding="async" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`v3-team-switch${flipped ? " is-on" : ""}`}
        role="switch"
        aria-checked={flipped}
        onClick={() => setFlipped(!flipped)}
      >
        <span className="v3-team-switch-label">meet the</span>
        <span className="v3-team-switch-track" aria-hidden="true">
          <i>{flipped ? "crew" : "ogs"}</i>
          <b />
        </span>
      </button>
    </section>
  );
}

/* ── Contact (page 17) ── */
function ContactV3({ site }: { site: GarageContent["site"] }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const { name, email, phone, topic, message } = form;
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        email: email.trim(),
        message: [topic && `Topic: ${topic}`, phone && `Phone: ${phone}`, message].filter(Boolean).join("\n"),
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(String(res.status));
      toast.success("Message sent — let's go bananas!");
      setForm({ name: "", email: "", phone: "", topic: "", message: "" });
    } catch {
      toast.error(`Couldn't send right now — email us at ${site.email}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="v3-contact v3-fabric" aria-labelledby="v3-contact-title">
      <div className="v3-contact-inner">
        <div className="v3-contact-plate-wrap">
          <h2 id="v3-contact-title" className="v3-contact-plate">
            Contact us
          </h2>
          <img className="v3-contact-phone" src={v2("phone-tight")} alt="" aria-hidden="true" />
        </div>
        <div className="v3-contact-grid">
          <div className="v3-contact-info">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <p style={{ margin: 0 }}>
              {site.address.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <div className="v3-contact-social">
              <a href="https://www.instagram.com/garageworldwide/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/garage-worldwide/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M8 10v7M8 7v.1M12 17v-4a2.2 2.2 0 0 1 4.4 0v4" />
                </svg>
              </a>
            </div>
          </div>
          <form className="v3-form" onSubmit={handleSubmit}>
            <div className="v3-field">
              <label htmlFor="v3-name">Name</label>
              <input id="v3-name" value={form.name} onChange={update("name")} autoComplete="name" />
            </div>
            <div className="v3-field">
              <label htmlFor="v3-email">Email</label>
              <input id="v3-email" type="email" value={form.email} onChange={update("email")} autoComplete="email" />
            </div>
            <div className="v3-field">
              <label htmlFor="v3-phone">Phone</label>
              <input id="v3-phone" value={form.phone} onChange={update("phone")} autoComplete="tel" />
            </div>
            <div className="v3-field">
              <label htmlFor="v3-topic">Topic</label>
              <input id="v3-topic" value={form.topic} onChange={update("topic")} />
            </div>
            <div className="v3-field v3-field--message">
              <label htmlFor="v3-message">Message</label>
              <textarea id="v3-message" value={form.message} onChange={update("message")} />
            </div>
            <div className="v3-form-actions">
              <button type="submit" className="v3-submit" disabled={submitting}>
                {submitting ? "Sending…" : "Let's go bananas!"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
