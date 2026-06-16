import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "wouter";

import { SiteHeader } from "../components/GarageSite";
import type { GarageContent } from "../lib/types";

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

export function CaseStudy({ content }: { content: GarageContent }) {
  const params = useParams();
  const project = content.projects.find((item) => item.id === params.id);

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

  return (
    <>
      <SiteHeader wordmark={content.site.wordmark} />
      <main>
        <article className="case-study">
          <section className="section-band case-hero" aria-labelledby="case-title">
            <div className="section-inner">
              <Link href="/work" className="case-back">
                <ArrowLeft aria-hidden="true" /> All work
              </Link>
              <p className="eyebrow case-category">{project.category}</p>
              <h1 id="case-title" className="case-title">
                {project.title}
              </h1>
              <p className="case-client">{project.client}</p>
              <p className="case-summary">{project.summary}</p>
              <dl className="case-impact">
                <dt className="eyebrow">Impact</dt>
                <dd>{project.impact}</dd>
              </dl>
            </div>
          </section>

          <section className="case-cover" aria-hidden="true">
            <img src={project.cover.src} alt={project.cover.alt} />
          </section>

          {project.gallery.length > 0 ? (
            <section className="section-band case-gallery" aria-label="Project gallery">
              <div className="section-inner case-gallery-grid">
                {project.gallery.map((image, index) => (
                  <motion.figure
                    className="case-gallery-item"
                    key={`${image.src}-${index}`}
                    variants={reveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45 }}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" />
                  </motion.figure>
                ))}
              </div>
            </section>
          ) : null}

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
