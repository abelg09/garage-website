"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  useTransform
} from "motion/react";

import type { CrewMember, GarageContent, ImageAsset, Project } from "@/lib/types";

type GarageSiteProps = {
  content: GarageContent;
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Crew", href: "#crew" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" }
];

const reveal = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0 }
};

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
        <CrewSection crew={content.crew} />
        <ServicesSection services={content.services} />
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
        <Image src={wordmark.src} alt={wordmark.alt} width={360} height={120} priority />
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

    if (!section) {
      return;
    }

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

    return () => {
      delete root.dataset.reducedMotion;
    };
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
    useTransform(heroProgress, [0, 0.35, 1], [1, 1.36, 1.36]),
    { stiffness: 92, damping: 24, mass: 0.35 }
  );
  const cameraY = useSpring(
    useTransform(heroProgress, [0, 0.35, 1], ["0%", "-4.5%", "-4.5%"]),
    { stiffness: 92, damping: 24, mass: 0.35 }
  );
  const shutterY = useSpring(
    useTransform(heroProgress, [0.35, 0.7], ["0%", "-112%"]),
    { stiffness: 100, damping: 26, mass: 0.36 }
  );
  const portalOpacity = useTransform(heroProgress, [0.3, 0.52], [0.1, 1]);
  const copyOpacity = useTransform(heroProgress, [0.62, 0.85], [0, 1]);
  const copyY = useTransform(heroProgress, [0.62, 0.85], [28, 0]);
  const backdropOpacity = useTransform(heroProgress, [0.62, 0.85], [0, 0.62]);
  const openShutterStyle = { y: shutterY };
  const cameraStyle = { scale: cameraScale, y: cameraY };
  const copyStyle = { opacity: copyOpacity, y: copyY };

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
          <Image
            src={content.home.heroCollage.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-image"
          />
        </motion.div>
        <div className="garage-scene-shell">
          <motion.div className="garage-camera" style={cameraStyle} data-testid="garage-camera">
            <div className="garage-facade" data-testid="garage-facade">
              <Image
                src={content.home.garageFacade.src}
                alt={content.home.garageFacade.alt}
                fill
                priority
                sizes="(max-width: 760px) 220vw, 130vw"
                className="garage-facade-image"
              />
            </div>
            <motion.div
              className="garage-portal garage-portal-main"
              style={{ opacity: portalOpacity }}
              data-testid="garage-portal"
            >
              <div className="garage-origin" data-testid="garage-origin">
                <Image
                  src={content.home.garageOrigin.src}
                  alt={content.home.garageOrigin.alt}
                  fill
                  loading="eager"
                  sizes="(max-width: 760px) 90vw, 44vw"
                  className="garage-origin-image"
                />
                <p className="garage-origin-label" data-testid="garage-origin-label">
                  {content.home.garageOriginLabel}
                </p>
              </div>
              <motion.div
                className="garage-shutter"
                data-testid="garage-shutter"
                style={openShutterStyle}
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
          style={copyStyle}
        >
          <div className="equation-mark" aria-hidden="true">
            =
          </div>
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
  const [expandedId, setExpandedId] = useState(projects[0]?.id ?? "");
  const expanded = projects.find((project) => project.id === expandedId);

  return (
    <section id="work" className="section-band work-section" aria-labelledby="work-title">
      <div className="section-inner">
        <SectionHeading id="work-title">Work</SectionHeading>
        <div className="work-grid">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;
            return (
              <motion.article
                key={project.id}
                className="work-item"
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  type="button"
                  className="work-card"
                  aria-expanded={isExpanded}
                  aria-controls="work-detail"
                  onClick={() => setExpandedId(isExpanded ? "" : project.id)}
                >
                  <span className="image-frame">
                    <Image
                      src={project.cover.src}
                      alt={project.cover.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, 33vw"
                    />
                  </span>
                  <span className="work-name">
                    {project.title}
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </button>
              </motion.article>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key={expanded.id}
              id="work-detail"
              className="work-detail"
              data-testid="work-detail"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.28 }}
            >
              <div>
                <p className="eyebrow">{expanded.category}</p>
                <h3>{expanded.client}</h3>
              </div>
              <div className="detail-copy">
                <p>{expanded.summary}</p>
                <p>{expanded.impact}</p>
              </div>
              <div className="detail-gallery">
                {expanded.gallery.map((image) => (
                  <div className="detail-image" key={`${expanded.id}-${image.src}`}>
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 28vw" />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
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
            <div className="client-logo" key={client.id}>
              {client.logo?.src ? (
                <Image src={client.logo.src} alt={client.logo.alt} fill sizes="180px" />
              ) : (
                <span>{client.name}</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
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
                  <Image
                    src={member.portrait.src}
                    alt={member.portrait.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
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

    const previousActive = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusFirst = window.setTimeout(() => {
      const first = modalRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      first?.focus();
    }, 0);

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
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
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
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
                <Image src={member.portrait.src} alt={member.portrait.alt} fill sizes="(max-width: 760px) 100vw, 36vw" />
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

function ServicesSection({ services }: { services: string[] }) {
  const columns = useMemo(() => {
    const midpoint = Math.ceil(services.length / 2);
    return [services.slice(0, midpoint), services.slice(midpoint)];
  }, [services]);

  return (
    <section id="services" className="section-band services-section" aria-labelledby="services-title">
      <div className="section-inner">
        <SectionHeading id="services-title">Services</SectionHeading>
        <motion.div
          className="services-grid"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          {columns.map((column, index) => (
            <ul key={index}>
              {column.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
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
          <Image
            src={content.contact.collage.src}
            alt={content.contact.collage.alt}
            fill
            sizes="(max-width: 980px) 100vw, 42vw"
          />
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeading({
  children,
  id
}: {
  children: string;
  id: string;
}) {
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
