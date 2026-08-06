import { useEffect } from "react";
import { Link, useRoute } from "wouter";

import { WorkBar, WorkFooter, workPageVars } from "../v3/WorkChrome";
import { caseMedia } from "../lib/case-media";
import { publicAsset } from "../lib/public-asset";
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

  const media = caseMedia[project.id];
  const caseImg = (f: string) => publicAsset(`v2/case/${project.id}/${f}`);
  // fall back to the small gallery when a brand has no delivered folder
  const gallery = media ? [] : project.gallery.filter((g) => g.src !== project.cover.src);
  const others = content.projects.filter((p) => p.id !== project.id).slice(0, 3);
  const strips = media?.filter((m) => m.t === "strip") ?? [];
  const loose = media?.filter((m) => m.t !== "strip") ?? [];

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
          {!media ? (
            <div className={`v3-case-media${gallery.length ? "" : " v3-case-media--solo"}`}>
              <img className="v3-case-cover" src={project.cover.src} alt={project.cover.alt} />
              {gallery.map((g) => (
                <img key={g.src} className="v3-case-shot" src={g.src} alt={g.alt} loading="lazy" />
              ))}
            </div>
          ) : (
            <>
              {strips.map((s, i) =>
                s.t === "strip" ? (
                  <div className="v3-case-strip" key={`strip-${i}`} aria-label="Carousel post — scroll">
                    {s.srcs.map((f) => (
                      <img key={f} src={caseImg(f)} alt={`${project.client} carousel creative`} loading="lazy" decoding="async" />
                    ))}
                  </div>
                ) : null
              )}
              <div className="v3-case-masonry">
                {loose.map((m) =>
                  m.t === "vid" ? (
                    <video
                      key={m.src}
                      className="v3-case-video"
                      src={caseImg(m.src)}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : m.t === "img" ? (
                    <img
                      key={m.src}
                      src={caseImg(m.src)}
                      alt={`${project.client} campaign creative`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null
                )}
              </div>
            </>
          )}
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
