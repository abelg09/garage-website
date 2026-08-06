import { useEffect } from "react";
import { Link } from "wouter";

import { WorkBar, WorkFooter, workPageVars } from "../v3/WorkChrome";
import type { GarageContent } from "../lib/types";

/* /work — the work index, modelled on whiteriversmedia.com/our-work:
   a staggered two-column grid of cover tiles. */
export function WorkIndex({ content }: { content: GarageContent }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="v3 v3-workpage" style={workPageVars()}>
      <WorkBar />
      <main className="v3-wp-main">
        <h1 className="v3-wp-title">Work</h1>
        <p className="v3-wi-tag">All the things we make, parked in one garage.</p>
        <div className="v3-wi-grid">
          {content.projects.map((project) => (
            <Link href={`/work/${project.id}`} className="v3-wi-tile" key={project.id}>
              <span className="v3-wi-media">
                <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
              </span>
              <span className="v3-wi-name">{project.title}</span>
              <span className="v3-wi-sub">
                {project.client} · {project.category}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <WorkFooter />
    </div>
  );
}
