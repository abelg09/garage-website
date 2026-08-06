import { useEffect } from "react";
import { Link, useRoute } from "wouter";

import { WorkBar, WorkFooter, workPageVars } from "../v3/WorkChrome";
import type { GarageContent } from "../lib/types";

/* /work/:id — one campaign per page, modelled on
   whiteriversmedia.com/our-work/sharktankindia: big title, story,
   media, then links to more work. */
export function CaseStudy({ content }: { content: GarageContent }) {
  const [, params] = useRoute("/work/:id");
  const project = content.projects.find((p) => p.id === params?.id) ?? content.projects[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  const gallery = project.gallery.filter((g) => g.src !== project.cover.src);
  const others = content.projects.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <div className="v3 v3-workpage" style={workPageVars()}>
      <WorkBar />
      <main className="v3-wp-main">
        <section className="v3-case v3-case--page" aria-label={project.client}>
          <p className="v3-case-meta">
            {project.client} · {project.category}
          </p>
          <h1 className="v3-case-title v3-case-title--page">{project.title}</h1>
          <p className="v3-case-copy">{project.summary}</p>
          {project.impact ? <p className="v3-case-copy">{project.impact}</p> : null}
          <div className={`v3-case-media${gallery.length ? "" : " v3-case-media--solo"}`}>
            <img className="v3-case-cover" src={project.cover.src} alt={project.cover.alt} />
            {gallery.map((g) => (
              <img key={g.src} className="v3-case-shot" src={g.src} alt={g.alt} loading="lazy" />
            ))}
          </div>
        </section>

        <nav className="v3-case-more" aria-label="More work">
          <p className="v3-case-more-label">more from the garage</p>
          {others.map((p) => (
            <Link href={`/work/${p.id}`} className="v3-case-more-link" key={p.id}>
              <span className="v3-case-more-name">{p.title}</span>
              <span className="v3-case-more-client">{p.client}</span>
            </Link>
          ))}
          <Link href="/work" className="v3-case-more-all">
            all work →
          </Link>
        </nav>
      </main>
      <WorkFooter />
    </div>
  );
}
