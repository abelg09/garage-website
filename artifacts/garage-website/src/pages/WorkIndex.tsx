import { useEffect } from "react";

import { publicAsset } from "../lib/public-asset";
import type { GarageContent } from "../lib/types";

const v2 = (name: string) => publicAsset(`v2/${name}.webp`);

/* V3 work page — one case block per project, modelled on the
   whiteriversmedia case layout: big title, intro paragraph, media. */
export function WorkIndex({ content }: { content: GarageContent }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const home = (hash: string) => `${import.meta.env.BASE_URL}${hash}`;

  return (
    <div
      className="v3 v3-workpage"
      style={{
        "--v3-texture": `url("${v2("texture")}")`,
        "--v3-fabric": `url("${v2("fabric-navy")}")`,
        "--v3-menu-tear": `url("${v2("menu-tear")}")`,
      } as React.CSSProperties}
    >
      <header className="v3-wp-bar v3-fabric">
        <a href={home("")} aria-label="Garage home">
          <img className="v3-wp-wordmark" src={v2("wordmark-white")} alt="GARAGE" />
        </a>
        <nav aria-label="Menu">
          <a href={home("#story")}>about us</a>
          <a href={home("work")} aria-current="page">work</a>
          <a href={home("#crew")}>crew</a>
          <a href={home("#contact")}>contact us</a>
        </nav>
      </header>

      <main className="v3-wp-main">
        <h1 className="v3-wp-title">Work</h1>
        {content.projects.map((project) => {
          const gallery = project.gallery.filter((g) => g.src !== project.cover.src);
          return (
            <section className="v3-case" key={project.id} aria-label={project.client}>
              <p className="v3-case-meta">
                {project.client} · {project.category}
              </p>
              <h2 className="v3-case-title">{project.title}</h2>
              <p className="v3-case-copy">{project.summary}</p>
              {project.impact ? <p className="v3-case-copy">{project.impact}</p> : null}
              <div className={`v3-case-media${gallery.length ? "" : " v3-case-media--solo"}`}>
                <img className="v3-case-cover" src={project.cover.src} alt={project.cover.alt} loading="lazy" />
                {gallery.map((g) => (
                  <img key={g.src} className="v3-case-shot" src={g.src} alt={g.alt} loading="lazy" />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="v3-wp-footer v3-fabric">
        <a href={home("#contact")} className="v3-wp-cta">
          let&rsquo;s go bananas!
        </a>
      </footer>
    </div>
  );
}
