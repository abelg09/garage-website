import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "wouter";

import { SiteHeader } from "../components/GarageSite";
import type { GarageContent } from "../lib/types";

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function CaseStudy({ content }: { content: GarageContent }) {
  const params = useParams();
  const projectIndex = content.projects.findIndex((item) => item.id === params.id);
  const project = projectIndex >= 0 ? content.projects[projectIndex] : undefined;
  const nextProject = project
    ? content.projects[(projectIndex + 1) % content.projects.length]
    : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  if (!project) {
    return (
      <>
        <SiteHeader wordmark={content.site.wordmark} />
        <main>
          <section className="section-band case-missing">
            <div className="section-inner">
              <p className="eyebrow">Not found</p>
              <h1 className="section-title">This case study doesn&rsquo;t exist</h1>
              <Link href="/work" className="case-back">
                <ArrowLeft aria-hidden="true" /> Back to all work
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  const uniqueGallery = project.gallery.filter((img) => img.src !== project.cover.src);

  return (
    <>
      <SiteHeader wordmark={content.site.wordmark} />
      <main>
        <article className="case-study">

          {/* ── Full-bleed cinematic hero ── */}
          <section className="case-hero-fullbleed" aria-labelledby="case-title">
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              className="case-hero-img"
            />
            <div className="case-hero-gradient" aria-hidden="true" />
            <div className="case-hero-content">
              <div className="case-hero-nav">
                <Link href="/work" className="case-back case-back--light">
                  <ArrowLeft aria-hidden="true" /> All work
                </Link>
              </div>
              <motion.div
                className="case-hero-meta"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <p className="eyebrow case-hero-category">{project.category}</p>
                <h1 id="case-title" className="case-title-hero">{project.title}</h1>
                <p className="case-client-hero">{project.client}</p>
              </motion.div>
            </div>
          </section>

          {/* ── Brief + Impact sidebar ── */}
          <section className="section-band case-brief" aria-label="Campaign brief">
            <div className="section-inner case-brief-inner">
              <motion.div
                className="case-brief-summary"
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <p className="eyebrow case-section-label">The Brief</p>
                <p className="case-summary">{project.summary}</p>
              </motion.div>

              <motion.aside
                className="case-brief-aside"
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                <dl className="case-meta-list">
                  <div className="case-meta-item">
                    <dt className="eyebrow">Client</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div className="case-meta-item">
                    <dt className="eyebrow">Category</dt>
                    <dd>{project.category}</dd>
                  </div>
                </dl>
                <div className="case-impact-aside">
                  <p className="eyebrow case-section-label">Impact</p>
                  <p className="case-impact-text">{project.impact}</p>
                </div>
              </motion.aside>
            </div>
          </section>

          {/* ── Gallery (only renders when there are additional images beyond the cover) ── */}
          {uniqueGallery.length > 0 && (
            <section className="section-band case-gallery" aria-label="Project gallery">
              <div className="section-inner case-gallery-grid">
                {uniqueGallery.map((image, index) => (
                  <motion.figure
                    className="case-gallery-item"
                    key={`${image.src}-${index}`}
                    variants={reveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" />
                  </motion.figure>
                ))}
              </div>
            </section>
          )}

          {/* ── Next project teaser ── */}
          {nextProject && (
            <motion.section
              className="case-next"
              aria-label="Next project"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={nextProject.cover.src}
                alt=""
                className="case-next-img"
                aria-hidden="true"
                loading="lazy"
              />
              <div className="case-next-gradient" aria-hidden="true" />
              <Link href={`/work/${nextProject.id}`} className="case-next-link">
                <span className="eyebrow case-next-eyebrow">Next Project</span>
                <span className="case-next-title">{nextProject.title}</span>
                <span className="case-next-client">{nextProject.client}</span>
                <ArrowUpRight className="case-next-arrow" aria-hidden="true" />
              </Link>
            </motion.section>
          )}

          {/* ── Footer ── */}
          <section className="section-band case-footer">
            <div className="section-inner case-footer-inner">
              <Link href="/work" className="case-back">
                <ArrowLeft aria-hidden="true" /> All work
              </Link>
              <a href={`${import.meta.env.BASE_URL}#contact`} className="work-viewall">
                Start a project <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </section>

        </article>
      </main>
    </>
  );
}
