import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Target, Film, Share2, Camera, Monitor } from "lucide-react";
import { BlurRevealText } from "./BlurRevealText";
import type { ServiceIconKey, ServicesContent, ServiceItem } from "../lib/types";

type ServiceDef = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const iconMap: Record<ServiceIconKey, LucideIcon> = {
  target: Target,
  film: Film,
  share: Share2,
  camera: Camera,
  monitor: Monitor,
};

function toServiceDef(service: ServiceItem): ServiceDef {
  return {
    id: service.id,
    icon: iconMap[service.icon] ?? Target,
    title: service.title,
    description: service.description,
  };
}

function useIsMobile(breakpoint = 760) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

function ServiceCard({
  service,
  index,
  total,
  scrollYProgress,
  reduced,
  isMobile,
}: {
  service: ServiceDef;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
  isMobile: boolean;
}) {
  const isLast = index === total - 1;
  const scaleInput: [number, number] = isLast
    ? [0, 1]
    : [(index + 1) / total, Math.min((index + 2) / total, 1)];

  const scale = useTransform(scrollYProgress, scaleInput, isLast ? [1, 1] : [1, 0.94]);
  const opacity = useTransform(scrollYProgress, scaleInput, isLast ? [1, 1] : [1, 0.58]);

  const Icon = service.icon;

  const desktopStyle = !isMobile && !reduced ? { scale, opacity } : {};
  const mobileAnim = isMobile
    ? {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const, amount: 0.25 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      }
    : {};

  return (
    <div
      className="svc-sticky-wrap"
      style={{
        zIndex: index + 1,
        top: `calc(var(--header-height) + 2rem + ${index * 8}px)`,
      }}
    >
      <motion.article
        className="svc-card"
        style={desktopStyle}
        aria-label={service.title}
        {...mobileAnim}
      >
        <div className="svc-card-icon" aria-hidden="true">
          <Icon size={28} strokeWidth={1.4} aria-hidden />
        </div>
        <div className="svc-card-body">
          <h3 className="svc-card-title">{service.title}</h3>
          <p className="svc-card-desc">{service.description}</p>
        </div>
      </motion.article>
    </div>
  );
}

export function ServicesStack({ content }: { content: ServicesContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const services = content.items.map(toServiceDef);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-band expertise-section svc-section"
      aria-labelledby="expertise-title"
    >
      <div className="svc-container">
        <div className="svc-left">
          <span className="svc-eyebrow" aria-hidden="true">{content.eyebrow}</span>
          <h2 className="expertise-heading">
            <BlurRevealText text={content.title} id="expertise-title" />
          </h2>
          <p className="expertise-tagline">
            {content.tagline}
          </p>
          <a href={content.ctaHref} className="svc-cta">
            {content.ctaLabel} <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="svc-right" aria-label="Our services">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              total={services.length}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
