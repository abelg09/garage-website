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

import type { CrewMember, GarageContent, ImageAsset, Project, Review } from "../lib/types";

type GarageSiteProps = {
  content: GarageContent;
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Reviews", href: "#reviews" },
  { label: "Crew", href: "#crew" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" }
];

const reveal = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0 }
};

function BlurRevealText({ text, className, id }: { text: string; className?: string; id?: string }) {
  return (
    <span className={className} id={id} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="blur-char"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function GarageSite({ content }: GarageSiteProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <Header
        wordmark={content.site.wordmark}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <HeroSection content={content} />
        <WorkSection projects={content.projects} />
        <ClientsSection clients={content.clients} />
        <ReviewsSection reviews={content.reviews} />
        <CrewSection crew={content.crew} />
        <ExpertiseSection services={content.services} />
        <ContactSection content={content} />
      </main>
    </>
  );
}

function Header({
  wordmark,
  menuOpen,
  setMenuOpen
}: {
  wordmark: ImageAsset;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#about" aria-label="GARAGE home">
        <img src={wordmark.src} alt={wordmark.alt} width={360} height={120} />
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
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
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function HeroSection({ content }: { content: GarageContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const heroProgress = useMotionValue(0);
  const { scrollY } = useScroll();

  const updateHeroProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const stickyTop = Number.parseFloat(rootStyle.getPropertyValue("--header-height")) || 0;
    const stage = section.querySelector<HTMLElement>(".hero-stage");
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const stageHeight = stage?.offsetHeight ?? Math.max(1, window.innerHeight - stickyTop);
    const start = Math.max(0, sectionTop - stickyTop);
    const end = Math.max(start + 1, sectionTop + section.offsetHeight - stickyTop - stageHeight);
    const nextProgress = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
    heroProgress.set(nextProgress);
  }, [heroProgress]);

  useMotionValueEvent(scrollY, "change", updateHeroProgress);

  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion === true) {
      root.dataset.reducedMotion = "true";
    } else {
      delete root.dataset.reducedMotion;
    }
    return () => { delete root.dataset.reducedMotion; };
  }, [prefersReducedMotion]);

  useEffect(() => {
    updateHeroProgress();
    window.addEventListener("resize", updateHeroProgress);
    window.addEventListener("orientationchange", updateHeroProgress);
    return () => {
      window.removeEventListener("resize", updateHeroProgress);
      window.removeEventListener("orientationchange", updateHeroProgress);
    };
  }, [updateHeroProgress]);

  const cameraScale = useSpring(
    useTransform(heroProgress, [0, 0.22, 1], [1, 1.36, 1.36]),
    { stiffness: 92, damping: 24, mass: 0.35 }
  );
  const cameraY = useSpring(
    useTransform(heroProgress, [0, 0.22, 1], ["0%", "-4.5%", "-4.5%"]),
    { stiffness: 92, damping: 24, mass: 0.35 }
  );
  const shutterY = useSpring(
    useTransform(heroProgress, [0.22, 0.48], ["0%", "-112%"]),
    { stiffness: 100, damping: 26, mass: 0.36 }
  );
  const portalOpacity = useTransform(heroProgress, [0.2, 0.4], [0.1, 1]);
  const copyOpacity = useTransform(heroProgress, [0.45, 0.6], [0, 1]);
  const copyY = useTransform(heroProgress, [0.45, 0.6], [28, 0]);
  const backdropOpacity = useTransform(heroProgress, [0.45, 0.6], [0, 0.62]);

  return (
    <section
      id="about"
      className="hero-section section-band"
      aria-label="About GARAGE"
      ref={sectionRef}
      data-testid="hero-scroll"
    >
      <div className="hero-stage">
        <motion.div
          className="hero-backdrop"
          style={{ opacity: backdropOpacity }}
          aria-hidden="true"
        >
          <img
            src={content.home.heroCollage.src}
            alt=""
            className="hero-image"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </motion.div>
        <div className="garage-scene-shell">
          <motion.div className="garage-camera" style={{ scale: cameraScale, y: cameraY }} data-testid="garage-camera">
            <div className="garage-facade" data-testid="garage-facade">
              <img
                src={content.home.garageFacade.src}
                alt={content.home.garageFacade.alt}
                className="garage-facade-image"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              />
            </div>
            <motion.div
              className="garage-portal garage-portal-main"
              style={{ opacity: portalOpacity }}
              data-testid="garage-portal"
            >
              <div className="garage-origin" data-testid="garage-origin">
                <img
                  src={content.home.garageOrigin.src}
                  alt={content.home.garageOrigin.alt}
                  className="garage-origin-image"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                />
                <p className="garage-origin-label" data-testid="garage-origin-label">
                  {content.home.garageOriginLabel}
                </p>
              </div>
              <motion.div
                className="garage-shutter"
                data-testid="garage-shutter"
                style={{ y: shutterY }}
              >
                <span />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="hero-copy"
          data-testid="hero-copy"
          initial={false}
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <div className="equation-mark" aria-hidden="true">=</div>
          <p className="eyebrow">{content.home.introKicker}</p>
          <h1>{content.home.introTitle}</h1>
          {content.home.introBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </motion.div>
        <a className="down-link" href="#work" aria-label="Go to Work section">
          <ChevronDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function WorkSection({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="work"
      className="section-band work-section"
      aria-labelledby="work-title"
      ref={sectionRef}
      style={{ minHeight: `${projects.length * 100}vh` }}
    >
      <div className="work-sticky-stage">
        <div className="work-stage-header">
          <motion.h2
            id="work-title"
            className="work-title-stack"
            aria-label="Work"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <span aria-hidden="true">Our Works</span>
            <span aria-hidden="true">Our Works</span>
            <span aria-hidden="true">Our Works</span>
          </motion.h2>
        </div>
        <div className="work-deck" role="list">
          {projects.map((project, index) => (
            <DeckCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeckCard({
  project,
  index,
  total,
  scrollYProgress,
}: {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const N = total;
  const isFirst = index === 0;
  const isLast = index === N - 1;

  const gap = N > 1 ? 1 / (N - 1) : 1;
  const activeAt = index * gap;

  const slideInStart = isFirst ? 0 : Math.max(0, activeAt - gap * 0.5);
  const slideInEnd = isFirst ? 0 : activeAt;

  const pushOutStart = isLast ? 1 : activeAt + gap * 0.2;
  const pushOutEnd = isLast ? 1 : activeAt + gap * 0.9;

  const y = useTransform(
    scrollYProgress,
    isFirst ? [0, 1] : [slideInStart, slideInEnd],
    isFirst ? ["0%", "0%"] : ["calc(100% - 72px)", "0%"]
  );
  const scale = useTransform(
    scrollYProgress,
    [pushOutStart, pushOutEnd],
    isLast ? [1, 1] : [1, 0.88]
  );
  const opacity = useTransform(
    scrollYProgress,
    [pushOutStart, pushOutEnd],
    isLast ? [1, 1] : [1, 0.42]
  );

  const projectNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      className="work-deck-card"
      role="listitem"
      style={{ y, scale, opacity, zIndex: index + 1 }}
      aria-labelledby={`deck-title-${project.id}`}
    >
      <div className="wdc-inner">
        <span className="wdc-index" aria-hidden="true">{projectNumber}</span>
        <div className="wdc-body">
          <div className="wdc-meta">
            <span className="wdc-category">{project.category}</span>
            <span className="wdc-client">{project.client}</span>
          </div>
          <h3 className="wdc-title" id={`deck-title-${project.id}`}>
            {project.title}
          </h3>
          <p className="wdc-summary">{project.summary}</p>
          <span className="wdc-cta">
            View Case Study <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
        <div className="wdc-image">
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <span className="wdc-image-overlay" aria-hidden="true" />
        </div>
      </div>
    </motion.article>
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
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : crew[selectedIndex];

  const selectCrew = (index: number) => setSelectedIndex(index);
  const close = () => setSelectedIndex(null);
  const previous = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current - 1 + crew.length) % crew.length));
  const next = () =>
    setSelectedIndex((current) => (current === null ? 0 : (current + 1) % crew.length));

  return (
    <section id="crew" className="section-band crew-section" aria-labelledby="crew-title">
      <div className="section-inner">
        <SectionHeading id="crew-title">Crew</SectionHeading>
        <motion.div
          className="crew-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
        >
          {crew.map((member, index) => (
            <motion.button
              key={member.id}
              type="button"
              className="crew-card"
              variants={reveal}
              onClick={() => selectCrew(index)}
              data-testid={`crew-card-${index}`}
            >
              <span className="crew-photo">
                {member.portrait?.src ? (
                  <img
                    src={member.portrait.src}
                    alt={member.portrait.alt}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span aria-hidden="true" />
                )}
              </span>
              <span className="crew-overlay">
                <span>{member.name}</span>
                <small>{member.role}</small>
              </span>
              <span className="crew-name">{member.name}</span>
            </motion.button>
          ))}
        </motion.div>
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

function ExpertiseSection({ services }: { services: string[] }) {
  return (
    <section id="services" className="section-band expertise-section" aria-labelledby="expertise-title">
      <div className="section-inner expertise-layout">
        <div className="expertise-left">
          <h2 className="expertise-heading">
            <BlurRevealText text="Expertise" id="expertise-title" />
          </h2>
          <motion.p
            className="expertise-tagline"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.28 }}
          >
            Full-stack creative capability — from first insight to final frame.
          </motion.p>
        </div>
        <motion.div
          className="expertise-pills"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.18 }}
        >
          {services.map((service) => (
            <span key={service} className="expertise-pill">{service}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section id="reviews" className="section-band reviews-section" aria-labelledby="reviews-title">
      <div className="section-inner">
        <h2 className="section-title reviews-heading">
          <BlurRevealText text="Reviews" id="reviews-title" />
        </h2>
        <motion.div
          className="reviews-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.13 } }
          }}
        >
          {reviews.map((review) => (
            <motion.article
              key={review.id}
              className="review-card"
              variants={reveal}
            >
              <div className="review-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="review-star" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <blockquote className="review-quote">
                <p>"{review.quote}"</p>
              </blockquote>
              <div className="reviewer">
                <div className="reviewer-avatar" aria-hidden="true">
                  {review.initials}
                </div>
                <div className="reviewer-info">
                  <strong className="reviewer-name">{review.reviewer}</strong>
                  <span className="reviewer-role">{review.role}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
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
