import { client, hasSanityConfig } from "./sanity-client";
import { garageContentQuery } from "./sanity-queries";
import { fallbackContent } from "./fallback-data";
import { publicAsset } from "./public-asset";
import type { GarageContent, ImageAsset } from "./types";

type MaybeContent = Partial<GarageContent>;

function validImage(image: ImageAsset | undefined, fallback: ImageAsset): ImageAsset {
  if (!image?.src) return fallback;
  return { src: publicAsset(image.src), alt: image.alt || fallback.alt };
}

function mergeContent(data: MaybeContent | null): GarageContent {
  if (!data) return fallbackContent;

  return {
    site: {
      ...fallbackContent.site,
      ...data.site,
      wordmark: validImage(data.site?.wordmark, fallbackContent.site.wordmark),
      address: data.site?.address?.length ? data.site.address : fallbackContent.site.address
    },
    home: {
      ...fallbackContent.home,
      ...data.home,
      introBody: data.home?.introBody?.length ? data.home.introBody : fallbackContent.home.introBody,
      garageFacade: validImage(data.home?.garageFacade, fallbackContent.home.garageFacade),
      garageOrigin: validImage(data.home?.garageOrigin, fallbackContent.home.garageOrigin),
      garageOriginLabel: data.home?.garageOriginLabel || fallbackContent.home.garageOriginLabel,
      heroCollage: validImage(data.home?.heroCollage, fallbackContent.home.heroCollage)
    },
    projects: data.projects?.length ? data.projects : fallbackContent.projects,
    clients: data.clients?.length ? data.clients : fallbackContent.clients,
    crew: data.crew?.length ? data.crew : fallbackContent.crew,
    services: data.services?.length ? data.services : fallbackContent.services,
    contact: {
      collage: validImage(data.contact?.collage, fallbackContent.contact.collage)
    }
  };
}

export async function getGarageContent(): Promise<GarageContent> {
  if (!hasSanityConfig) return fallbackContent;

  try {
    const data = await client.fetch<MaybeContent>(garageContentQuery, {});
    return mergeContent(data);
  } catch {
    return fallbackContent;
  }
}
