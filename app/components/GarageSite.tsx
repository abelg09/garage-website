"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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

const garageEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

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
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: garageEase };

  return (
    <section id="about" className="hero-section section-band" aria-label="About GARAGE">
      <div className="hero-stage">
        <Image
          src={content.home.heroCollage.src}
          alt={content.home.heroCollage.alt}
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <motion.div
          className="hero-copy"
          initial={false}
          animate={open ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={reduceMotion ? { duration: 0 } : { delay: 0.22, duration: 0.48 }}
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
        <AnimatePresence initial={false}>
          {!open ? (
            <motion.button
              type="button"
              className="garage-door"
              data-testid="garage-door"
              aria-label="Open Garage"
              onClick={() => setOpen(true)}
              initial={{ y: 0 }}
              exit={{ y: "-105%" }}
              transition={transition}
            >
              <span className="door-slats" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <motion.span
                    key={index}
                    initial={{ x: index % 2 === 0 ? -18 : 18, opacity: 0.74 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.42,
                      delay: reduceMotion ? 0 : index * 0.035
                    }}
                  />
                ))}
              </span>
              <span className="door-label">
                <span>OPEN</span>
                <strong>GARAGE</strong>
              </span>
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
      <a className="down-link" href="#work" aria-label="Go to Work section">
        <ChevronDown aria-hidden="true" />
      </a>
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
