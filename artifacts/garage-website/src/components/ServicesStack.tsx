import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Target, Film, Share2, Camera, Monitor } from "lucide-react";
import { BlurRevealText } from "./GarageSite";

type ServiceDef = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const SERVICES: ServiceDef[] = [
  {
    id: "brand-strategy",
    icon: Target,
    title: "Brand Strategy",
    description:
      "We excavate the real story, then build the system that tells it across every touchpoint.",
  },
  {
    id: "campaign-production",
    icon: Film,
    title: "Campaign Production",
    description:
      "From concept to final frame, we make work that earns attention and earns space in culture.",
  },
  {
    id: "digital-social",
    icon: Share2,
    title: "Digital & Social",
    description:
      "Platform-native content built for the scroll, the share, and the second look.",
  },
  {
    id: "content-studio",
    icon: Camera,
    title: "Content Studio",
    description:
      "Photo, video, copy, and design — produced in-house so nothing gets lost in translation.",
  },
  {
    id: "website-apps",
    icon: Monitor,
    title: "Website & Apps",
    description: "Interfaces that match the ambition of the brand behind them.",
  },
];

function ServiceCard({
  service,
  index,
  total,
  scrollYProgress,
  reduced,
}: {
  service: ServiceDef;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}) {
  const isLast = index === total - 1;
  const scaleInput: [number, number] = isLast ? [0, 1] : [(index + 1) / total, Math.min((index + 2) / total, 1)];
  const scaleOutput: [number, number] = isLast ? [1, 1] : [1, 0.94];
  const opacityOutput: [number, number] = isLast ? [1, 1] : [1, 0.58];

  const scale = useTransform(scrollYProgress, scaleInput, scaleOutput);
  const opacity = useTransform(scrollYProgress, scaleInput, opacityOutput);

  const Icon = service.icon;

  return (
    <div className="svc-sticky-wrap" style={{ zIndex: index + 1 }}>
      <motion.article
        className="svc-card"
        style={reduced ? {} : { scale, opacity }}
        aria-label={service.title}
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

export function ServicesStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

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
        {/* ── Left: Sticky panel ── */}
        <div className="svc-left">
          <span className="svc-eyebrow" aria-hidden="true">[ Expertise ]</span>
          <h2 className="expertise-heading">
            <BlurRevealText text="Expertise" id="expertise-title" />
          </h2>
          <p className="expertise-tagline">
            Full-stack creative capability — from first insight to final frame.
          </p>
          <a href="#contact" className="svc-cta">
            Get in Touch <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* ── Right: Stacking cards ── */}
        <div className="svc-right" aria-label="Our services">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              total={SERVICES.length}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
