import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

import { SiteHeader } from "../components/GarageSite";
import type { GarageContent } from "../lib/types";

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

export function WorkIndex({ content }: { content: GarageContent }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SiteHeader wordmark={content.site.wordmark} />
      <main>
        <section className="section-band work-index" aria-labelledby="work-index-title">
          <div className="section-inner">
            <p className="eyebrow">Selected Work</p>
            <h1 id="work-index-title" className="section-title work-index-title">
              Case Studies
            </h1>
            <div className="work-index-grid">
              {content.projects.map((project, index) => (
                <motion.article
                  className="work-index-card"
                  key={project.id}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45 }}
                >
                  <Link href={`/work/${project.id}`} className="work-index-link">
                    <span className="work-index-media">
                      <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
                    </span>
                    <span className="work-index-body">
                      <span className="work-index-meta">
                        <span className="work-index-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="work-index-category">{project.category}</span>
                      </span>
                      <span className="work-index-name">{project.title}</span>
                      <span className="work-index-client">{project.client}</span>
                      <span className="work-index-summary">{project.summary}</span>
                      <span className="work-index-cta">
                        View case study <ArrowUpRight aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
