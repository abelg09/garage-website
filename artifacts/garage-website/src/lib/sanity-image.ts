import imageUrlBuilder from "@sanity/image-url";

import { client, hasSanityConfig } from "./sanity-client";
import { publicAsset } from "./public-asset";
import type { ImageAsset } from "./types";

type SanityImageLike = Partial<ImageAsset> & {
  asset?: unknown;
  crop?: unknown;
  hotspot?: unknown;
};

const builder = hasSanityConfig ? imageUrlBuilder(client) : null;

export function resolveImage(image: SanityImageLike | undefined, fallback: ImageAsset): ImageAsset {
  if (!image) return fallback;

  const src = image.asset && builder
    ? builder.image(image).auto("format").url()
    : image.src;

  if (!src) return fallback;

  return {
    src: publicAsset(src),
    alt: image.alt || fallback.alt,
  };
}
