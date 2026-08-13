import { useEffect, useRef, useState } from "react";
import { Link, useRoute } from "wouter";

import { WorkBar, WorkFooter, workPageVars } from "../v3/WorkChrome";
import { caseMedia } from "../lib/case-media";
import { publicAsset } from "../lib/public-asset";
import type { GarageContent } from "../lib/types";

/* one carousel post = one box: swipe / arrows, auto-advance every 3s */
function CaseCarousel({ srcs, resolve, client, small }: { srcs: string[]; resolve: (f: string) => string; client: string; small?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const paused = useRef(false);
  const [idx, setIdx] = useState(0);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = ((i % srcs.length) + srcs.length) % srcs.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!paused.current) go(idxRef.current + 1);
    }, 3000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcs.length]);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const n = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    idxRef.current = n;
    setIdx(n);
  };

  const hold = () => {
    paused.current = true;
  };
  const release = () => {
    window.setTimeout(() => {
      paused.current = false;
    }, 3500);
  };

  return (
    <div
      className={`v3-carousel${small ? " v3-carousel--sm" : ""}`}
      onMouseEnter={hold}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onTouchStart={hold}
      onTouchEnd={release}
    >
      <div className="v3-carousel-track" ref={track} onScroll={onScroll}>
        {srcs.map((f) => (
          <img key={f} src={resolve(f)} alt={`${client} carousel creative`} loading="lazy" decoding="async" />
        ))}
      </div>
      <button type="button" className="v3-carousel-btn v3-carousel-btn--prev" aria-label="Previous" onClick={() => go(idxRef.current - 1)}>
        ‹
      </button>
      <button type="button" className="v3-carousel-btn v3-carousel-btn--next" aria-label="Next" onClick={() => go(idxRef.current + 1)}>
        ›
      </button>
      <div className="v3-carousel-dots" aria-hidden="true">
        {srcs.map((f, i) => (
          <span key={f} className={i === idx ? "is-on" : ""} />
        ))}
      </div>
    </div>
  );
}

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
            media.map((sec) => {
              const secStrips = sec.items.filter((m) => m.t === "strip");
              const secLoose = sec.items.filter((m) => m.t !== "strip");
              return (
                <section className="v3-case-sec" key={sec.label} aria-label={sec.label}>
                  <h2 className="v3-case-cat">{sec.label}</h2>
                  {secStrips.length ? (
                    <div className="v3-case-carousels">
                      {secStrips.map((s, i) =>
                        s.t === "strip" ? (
                          <CaseCarousel key={`${sec.label}-strip-${i}`} srcs={s.srcs} resolve={caseImg} client={project.client} small={s.sm} />
                        ) : null
                      )}
                    </div>
                  ) : null}
                  {secLoose.length ? (
                    <div className="v3-case-masonry">
                      {secLoose.map((m) =>
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
                            className={m.sm ? "v3-case-img--sm" : undefined}
                            src={caseImg(m.src)}
                            alt={`${project.client} — ${sec.label}`}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null
                      )}
                    </div>
                  ) : null}
                </section>
              );
            })
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
