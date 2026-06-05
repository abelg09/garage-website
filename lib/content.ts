import { client, hasSanityConfig } from "@/lib/sanity.client";
import { garageContentQuery } from "@/lib/sanity.queries";
import { fallbackContent } from "@/lib/fallback-data";
import type { GarageContent, ImageAsset } from "@/lib/types";

type MaybeContent = Partial<GarageContent>;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function withBasePath(src: string): string {
  if (!basePath || !src.startsWith("/") || src.startsWith("//")) return src;
  if (src === basePath || src.startsWith(`${basePath}/`)) return src;
  return `${basePath}${src}`;
}

function validImage(image: ImageAsset | undefined, fallback: ImageAsset): ImageAsset {
  if (!image?.src) return fallback;
  return {
    src: image.src,
    alt: image.alt || fallback.alt
  };
}

function normalizeImage(image: ImageAsset): ImageAsset {
  return {
    ...image,
    src: withBasePath(image.src)
  };
}

function normalizeContent(content: GarageContent): GarageContent {
  return {
    ...content,
    site: {
      ...content.site,
      wordmark: normalizeImage(content.site.wordmark)
    },
    home: {
      ...content.home,
      heroCollage: normalizeImage(content.home.heroCollage)
    },
    projects: content.projects.map((project) => ({
      ...project,
      cover: normalizeImage(project.cover),
      gallery: project.gallery.map(normalizeImage)
    })),
    clients: content.clients.map((clientLogo) => ({
      ...clientLogo,
      logo: clientLogo.logo ? normalizeImage(clientLogo.logo) : undefined
    })),
    crew: content.crew.map((member) => ({
      ...member,
      portrait: member.portrait ? normalizeImage(member.portrait) : undefined
    })),
    contact: {
      collage: normalizeImage(content.contact.collage)
    }
  };
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
      introBody: data.home?.introBody?.length
        ? data.home.introBody
        : fallbackContent.home.introBody,
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
  if (!hasSanityConfig) return normalizeContent(fallbackContent);

  try {
    const data = await client.fetch<MaybeContent>(
      garageContentQuery,
      {},
      { next: { revalidate: 60 } }
    );
    return normalizeContent(mergeContent(data));
  } catch {
    return normalizeContent(fallbackContent);
  }
}
