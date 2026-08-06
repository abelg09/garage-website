import { publicAsset } from "../lib/public-asset";

export const v2 = (name: string) => publicAsset(`v2/${name}.webp`);

export const home = (hash: string) => `${import.meta.env.BASE_URL}${hash}`;

export const workPageVars = () =>
  ({
    "--v3-texture": `url("${v2("texture")}")`,
    "--v3-fabric": `url("${v2("fabric-navy")}")`,
    "--v3-menu-tear": `url("${v2("menu-tear")}")`,
  }) as React.CSSProperties;

/* torn navy bar shared by /work and the case pages */
export function WorkBar() {
  return (
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
  );
}

export function WorkFooter() {
  return (
    <footer className="v3-wp-footer v3-fabric">
      <a href={home("#contact")} className="v3-wp-cta">
        let&rsquo;s go bananas!
      </a>
    </footer>
  );
}
