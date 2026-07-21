import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

import type { GarageContent, Project } from "../lib/types";
import { publicAsset } from "../lib/public-asset";
import "./v3.css";

const v2 = (name: string) => publicAsset(`v2/${name}.webp`);

const MENU_ITEMS: [string, string][] = [
  ["about us", "story"],
  ["work", "work"],
  ["crew", "crew"],
  ["contact us", "contact"],
];

export function GarageV3({ content }: { content: GarageContent }) {
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <div className="v3" style={{ "--v3-texture": `url("${v2("texture")}")`, "--v3-fabric": `url("${v2("fabric-navy")}")` } as React.CSSProperties}>
      {!introDone ? <IntroLoader onDone={() => setIntroDone(true)} /> : null}
      <HeroGarage active={introDone} />
      <AboutV3 />
      <WorkV3 projects={content.projects} />
      <BrandsV3 clients={content.clients} />
      <TeamFlip crew={content.crew} />
      <ContactV3 site={content.site} />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
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
  const frames = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => v2(`intro-${n}`));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (reduced) {
      onDone();
      return;
    }
    const timer = window.setInterval(() => {
      setFrame((f) => {
        if (f >= frames.length - 1) {
          window.clearInterval(timer);
          window.setTimeout(onDone, 350);
          return f;
        }
        return f + 1;
      });
    }, 300);
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
        <img className="v3-hero-wordmark" src={v2("wordmark-white")} alt="GARAGE" />
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
        <div className="v3-about-navy-inner">
          <img className="v3-about-horns" src={v2("horns")} alt="" aria-hidden="true" />
          <h2 className="v3-about-headline">
            Historically, the best ideas have one place in common. A garage.
          </h2>
        </div>
      </div>
      <img className="v3-torn" src={v2("torn-edge")} alt="" aria-hidden="true" />
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
            HP in 1939. Apple in 1976. Amazon in 1994… the list goes on. We&rsquo;re continuing this
            rich tradition.
            <br />
            Fresh ideas, fresher faces, and the freshest resources all come together to create
            something real. And something that works.
            <br />
            Because for us as an integrated ad&#8209;agency, there&rsquo;s no better world than an
            ideas world.
          </p>
          <img className="v3-about-stairs" src={v2("stairs")} alt="" aria-hidden="true" />
        </div>
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

function WorkV3({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState(0);
  const shown = projects.filter(WORK_FILTERS[filter].match);

  return (
    <section id="work" className="v3-work" aria-labelledby="v3-work-title">
      <div className="v3-work-inner">
        <div className="v3-work-head">
          <h2 id="v3-work-title" className="v3-work-title">
            Work
          </h2>
          <img className="v3-work-couch" src={v2("couch")} alt="" aria-hidden="true" />
        </div>
        <p className="v3-work-sub">All the things we make, parked in one garage.</p>
        <div className="v3-work-filters" role="tablist" aria-label="Filter work">
          {WORK_FILTERS.map((f, i) => (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={filter === i}
              className={`v3-work-pill${filter === i ? " is-active" : ""}`}
              onClick={() => setFilter(i)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="v3-work-grid" key={WORK_FILTERS[filter].label}>
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
                  <span className="v3-work-card-view">View case ↗</span>
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
function BrandsV3({ clients }: { clients: GarageContent["clients"] }) {
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
                    <span className="v3-brand-band">{client.name.toLowerCase()}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="v3-brands-diagonal">
        <div className="v3-brands-diagonal-fill v3-tex" />
      </div>
    </section>
  );
}

/* ── Team flip (pages 13–16): OGs ⇄ Crew, flipped by the banana ── */
const OG_ZONES = [
  { key: "bryan", name: "Bryan Elijah", role: "Art Head", left: "8%", width: "28%", cx: 22 },
  { key: "swati", name: "Swati Bobde", role: "Business Head & COO", left: "37%", width: "26%", cx: 50 },
  { key: "ashish", name: "Ashish Chakravarty", role: "Managing Partner & CCO", left: "64%", width: "28%", cx: 78 },
];

// x/y/w/h = hover zone; lx/ly = the design's exact label anchor (page 16), % of the 16:9 frame
const CREW_ZONES: { name: string; role: string; x: number; y: number; w: number; h: number; lx: number; ly: number }[] = [
  { name: "Aryan", role: "Junior Visualizer", x: 10, y: 22, w: 11, h: 38, lx: 15.4, ly: 41 },
  { name: "Rujvi", role: "Sr. Visualizer", x: 23, y: 33, w: 10, h: 36, lx: 24.6, ly: 46.4 },
  { name: "Utsav", role: "Art Director", x: 31, y: 13, w: 10, h: 32, lx: 31.3, ly: 25 },
  { name: "Vedant", role: "Copywriter", x: 41, y: 31, w: 11, h: 38, lx: 40.4, ly: 46 },
  { name: "Tanvi", role: "Visualizer", x: 48, y: 13, w: 10, h: 34, lx: 46.4, ly: 23.5 },
  { name: "Aniket", role: "Sr. Copywriter", x: 55, y: 33, w: 11, h: 36, lx: 56.6, ly: 53 },
  { name: "Kyle", role: "Account Manager", x: 64, y: 16, w: 12, h: 34, lx: 71.6, ly: 21.6 },
  { name: "Saniya", role: "Visualizer", x: 74, y: 31, w: 11, h: 36, lx: 80.6, ly: 43.8 },
  { name: "Mobaiyana", role: "Copywriter", x: 8, y: 60, w: 13, h: 36, lx: 10, ly: 76.2 },
  { name: "Bryan", role: "Art Head", x: 26, y: 55, w: 11, h: 41, lx: 27.9, ly: 72.2 },
  { name: "Samir", role: "Sr. Account Manager", x: 40, y: 53, w: 12, h: 43, lx: 51.8, ly: 68.6 },
  { name: "Pranali", role: "Sr. Account Manager", x: 55, y: 56, w: 13, h: 40, lx: 66.4, ly: 73.7 },
  { name: "Adwait", role: "Art Director", x: 71, y: 55, w: 16, h: 41, lx: 83.6, ly: 76.2 },
];

function TeamFlip({ crew }: { crew: GarageContent["crew"] }) {
  const [flipped, setFlipped] = useState(false);
  const [ogHover, setOgHover] = useState<string | null>(null);
  const [crewHover, setCrewHover] = useState<string | null>(null);

  const bioFor = (key: string) => {
    const member = crew.find((m) => m.id.startsWith(key));
    return member?.bio?.[0] ?? "";
  };

  return (
    <section id="crew" className={`v3-team${flipped ? " is-flipped" : ""}`} aria-label="Meet the team">
      <div className="v3-team-flipper">
        <div className="v3-team-face v3-team-face--ogs v3-fabric">
          <h2 className="v3-team-title">Meet the OGs</h2>
          <div className="v3-ogs-stage">
            <img src={v2("ogs")} alt="The three Garage founders" />
            {OG_ZONES.map((zone) => (
              <span
                key={zone.key}
                className="v3-og-zone"
                style={{ left: zone.left, width: zone.width }}
                onMouseEnter={() => setOgHover(zone.key)}
                onMouseLeave={() => setOgHover(null)}
                onClick={() => setOgHover(ogHover === zone.key ? null : zone.key)}
              />
            ))}
            <AnimatePresence>
              {OG_ZONES.filter((z) => z.key === ogHover).map((zone) => (
                <motion.span
                  key={zone.key}
                  className={`v3-og-card ${OG_ZONES.findIndex((z) => z.key === zone.key) % 2 ? "v3-og-card--r" : "v3-og-card--l"}`}
                  style={{ left: `${zone.cx}%` }}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span className="v3-og-card-name">
                    {zone.name}
                    <br />
                    {zone.role}
                  </span>
                  <span className="v3-og-card-bio">{bioFor(zone.key)}</span>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="v3-team-face v3-team-face--crew v3-tex">
          <div className="v3-crew-stage">
            <div className="v3-crew-frame">
            <img src={v2("crew-scene")} alt="The Garage crew" />
            {CREW_ZONES.map((zone) => (
              <span
                key={zone.name}
                className="v3-crew-zone"
                style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                onMouseEnter={() => setCrewHover(zone.name)}
                onMouseLeave={() => setCrewHover(null)}
                onClick={() => setCrewHover(crewHover === zone.name ? null : zone.name)}
              />
            ))}
            <AnimatePresence>
              {CREW_ZONES.filter((z) => z.name === crewHover).map((zone) => (
                <motion.span
                  key={zone.name}
                  className="v3-crew-label"
                  style={{ left: `${zone.lx}%`, top: `${zone.ly}%` }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {zone.name}
                  <small>{zone.role}</small>
                </motion.span>
              ))}
            </AnimatePresence>
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
        <span className="v3-team-switch-label">{flipped ? "meet the ogs" : "meet the crew"}</span>
        <span className="v3-team-switch-track" aria-hidden="true">
          <i>{flipped ? "on" : "off"}</i>
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
          <img className="v3-contact-phone" src={v2("phone")} alt="" aria-hidden="true" />
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
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
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
            <div className="v3-field v3-field--full">
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
