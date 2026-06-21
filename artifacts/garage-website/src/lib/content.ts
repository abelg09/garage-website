import { client, hasSanityConfig } from "./sanity-client";
import { garageContentQuery } from "./sanity-queries";
import { fallbackContent } from "./fallback-data";
import { resolveImage } from "./sanity-image";
import type {
  ClientLogo,
  ContactContent,
  CrewMember,
  CrewMosaicCell,
  CropSettings,
  GarageContent,
  ImageAsset,
  Project,
  ServiceIconKey,
  ServiceItem,
  ServicesContent,
} from "./types";

type SanityImageLike = Partial<ImageAsset> & {
  asset?: unknown;
  crop?: unknown;
  hotspot?: unknown;
};

type MaybeProject = Partial<Omit<Project, "cover" | "gallery">> & {
  cover?: SanityImageLike;
  gallery?: SanityImageLike[];
};

type MaybeClient = Partial<Omit<ClientLogo, "logo">> & {
  logo?: SanityImageLike;
};

type MaybeCrewMember = Partial<Omit<CrewMember, "portrait">> & {
  portrait?: SanityImageLike;
};

type MaybeCrewMosaicCell = Partial<{
  id: string;
  kind: "crew" | "office";
  crewId: string;
  image: SanityImageLike;
  split: "top" | "bottom";
  crop: CropSettings;
}>;

type MaybeServices = Partial<Omit<ServicesContent, "items">> & {
  items?: Partial<ServiceItem>[];
};

type MaybeContact = Partial<Omit<ContactContent, "collage">> & {
  collage?: SanityImageLike;
};

type MaybeContent = Partial<Omit<GarageContent, "projects" | "clients" | "crew" | "crewMosaic" | "services" | "contact">> & {
  site?: Partial<Omit<GarageContent["site"], "wordmark">> & { wordmark?: SanityImageLike };
  home?: Partial<Omit<GarageContent["home"], "garageFacade" | "garageOrigin" | "heroCollage">> & {
    garageFacade?: SanityImageLike;
    garageOrigin?: SanityImageLike;
    heroCollage?: SanityImageLike;
  };
  projects?: MaybeProject[];
  clients?: MaybeClient[];
  crew?: MaybeCrewMember[];
  crewMosaic?: MaybeCrewMosaicCell[];
  services?: MaybeServices;
  contact?: MaybeContact;
};

function byId<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

const fallbackProjects = byId(fallbackContent.projects);
const fallbackClients = byId(fallbackContent.clients);
const fallbackCrew = byId(fallbackContent.crew);
const fallbackMosaic = byId(fallbackContent.crewMosaic);

function validImage(image: SanityImageLike | undefined, fallback: ImageAsset): ImageAsset {
  return resolveImage(image, fallback);
}

function mergeProjects(projects: MaybeProject[] | undefined): Project[] {
  if (!projects?.length) return fallbackContent.projects;

  return projects.map((project, index) => {
    const fallback = fallbackProjects.get(project.id ?? "") ?? fallbackContent.projects[index] ?? fallbackContent.projects[0];
    const cover = validImage(project.cover, fallback.cover);
    const fallbackGallery = fallback.gallery.length ? fallback.gallery : [fallback.cover];
    const sourceGallery = project.gallery?.length ? project.gallery : fallbackGallery;

    return {
      ...fallback,
      ...project,
      id: project.id || fallback.id,
      title: project.title || fallback.title,
      client: project.client || fallback.client,
      category: project.category || fallback.category,
      summary: project.summary || fallback.summary,
      impact: project.impact || fallback.impact,
      cover,
      gallery: sourceGallery.map((image, galleryIndex) =>
        validImage(image, fallbackGallery[galleryIndex] ?? cover)
      ),
    };
  });
}

function mergeClients(clients: MaybeClient[] | undefined): ClientLogo[] {
  if (!clients?.length) return fallbackContent.clients;

  return clients.map((client, index) => {
    const fallback = fallbackClients.get(client.id ?? "") ?? fallbackContent.clients[index];
    const logoFallback = fallback?.logo;
    const logo = client.logo || logoFallback
      ? validImage(client.logo, logoFallback ?? { src: "", alt: `${client.name ?? fallback?.name ?? "Client"} logo` })
      : undefined;

    return {
      id: client.id || fallback?.id || `client-${index + 1}`,
      name: client.name || fallback?.name || "Client",
      ...(logo?.src ? { logo } : {}),
    };
  });
}

function mergeCrew(crew: MaybeCrewMember[] | undefined): CrewMember[] {
  if (!crew?.length) return fallbackContent.crew;

  return crew.map((member, index) => {
    const fallback = fallbackCrew.get(member.id ?? "") ?? fallbackContent.crew[index] ?? fallbackContent.crew[0];

    return {
      ...fallback,
      ...member,
      id: member.id || fallback.id,
      name: member.name || fallback.name,
      role: member.role || fallback.role,
      tier: member.tier || fallback.tier,
      portrait: validImage(member.portrait, fallback.portrait ?? { src: "", alt: `${member.name ?? fallback.name} portrait` }),
      crop: member.crop ?? fallback.crop,
      bio: member.bio?.length ? member.bio : fallback.bio,
    };
  });
}

function mergeCrewMosaic(mosaic: MaybeCrewMosaicCell[] | undefined): CrewMosaicCell[] {
  if (!mosaic?.length) return fallbackContent.crewMosaic;

  return mosaic.flatMap((cell, index): CrewMosaicCell[] => {
    const fallback = fallbackMosaic.get(cell.id ?? "") ?? fallbackContent.crewMosaic[index];
    const id = cell.id || fallback?.id || `mosaic-${index + 1}`;

    if (cell.kind === "crew") {
      const fallbackCrewCell = fallback?.kind === "crew" ? fallback : undefined;
      const crewId = cell.crewId || fallbackCrewCell?.crewId;
      return crewId ? [{ id, kind: "crew", crewId }] : [];
    }

    if (cell.kind !== "office") return [];

    const fallbackOfficeCell = fallback?.kind === "office" ? fallback : undefined;
    const imageFallback = fallbackOfficeCell?.image ?? { src: "", alt: "Garage office" };

    return [{
      id,
      kind: "office",
      image: validImage(cell.image, imageFallback),
      split: cell.split ?? fallbackOfficeCell?.split,
      crop: cell.crop ?? fallbackOfficeCell?.crop,
    }];
  });
}

function isServiceIcon(value: unknown): value is ServiceIconKey {
  return value === "target" || value === "film" || value === "share" || value === "camera" || value === "monitor";
}

function mergeServices(services: MaybeServices | undefined): ServicesContent {
  if (!services) return fallbackContent.services;

  const fallbackItems = byId(fallbackContent.services.items);
  const sourceItems = services.items?.length ? services.items : fallbackContent.services.items;

  return {
    ...fallbackContent.services,
    ...services,
    eyebrow: services.eyebrow || fallbackContent.services.eyebrow,
    title: services.title || fallbackContent.services.title,
    tagline: services.tagline || fallbackContent.services.tagline,
    ctaLabel: services.ctaLabel || fallbackContent.services.ctaLabel,
    ctaHref: services.ctaHref || fallbackContent.services.ctaHref,
    items: sourceItems.map((item, index) => {
      const fallback = fallbackItems.get(item.id ?? "") ?? fallbackContent.services.items[index] ?? fallbackContent.services.items[0];
      return {
        id: item.id || fallback.id,
        icon: isServiceIcon(item.icon) ? item.icon : fallback.icon,
        title: item.title || fallback.title,
        description: item.description || fallback.description,
      };
    }),
  };
}

function mergeContact(contact: MaybeContact | undefined): ContactContent {
  if (!contact) return fallbackContent.contact;

  return {
    ...fallbackContent.contact,
    ...contact,
    collage: validImage(contact.collage, fallbackContent.contact.collage),
    emailLabel: contact.emailLabel || fallbackContent.contact.emailLabel,
    addressLabel: contact.addressLabel || fallbackContent.contact.addressLabel,
    formLabel: contact.formLabel || fallbackContent.contact.formLabel,
    nameLabel: contact.nameLabel || fallbackContent.contact.nameLabel,
    emailFieldLabel: contact.emailFieldLabel || fallbackContent.contact.emailFieldLabel,
    messageLabel: contact.messageLabel || fallbackContent.contact.messageLabel,
    submitLabel: contact.submitLabel || fallbackContent.contact.submitLabel,
    submittingLabel: contact.submittingLabel || fallbackContent.contact.submittingLabel,
    requiredMessage: contact.requiredMessage || fallbackContent.contact.requiredMessage,
    successMessage: contact.successMessage || fallbackContent.contact.successMessage,
    genericErrorMessage: contact.genericErrorMessage || fallbackContent.contact.genericErrorMessage,
    networkErrorMessage: contact.networkErrorMessage || fallbackContent.contact.networkErrorMessage,
  };
}

function mergeContent(data: MaybeContent | null): GarageContent {
  if (!data) return fallbackContent;

  return {
    site: {
      ...fallbackContent.site,
      ...data.site,
      title: data.site?.title || fallbackContent.site.title,
      email: data.site?.email || fallbackContent.site.email,
      wordmark: validImage(data.site?.wordmark, fallbackContent.site.wordmark),
      address: data.site?.address?.length ? data.site.address : fallbackContent.site.address,
    },
    home: {
      ...fallbackContent.home,
      ...data.home,
      introKicker: data.home?.introKicker || fallbackContent.home.introKicker,
      introTitle: data.home?.introTitle || fallbackContent.home.introTitle,
      introBody: data.home?.introBody?.length ? data.home.introBody : fallbackContent.home.introBody,
      garageFacade: validImage(data.home?.garageFacade, fallbackContent.home.garageFacade),
      garageOrigin: validImage(data.home?.garageOrigin, fallbackContent.home.garageOrigin),
      garageOriginLabel: data.home?.garageOriginLabel || fallbackContent.home.garageOriginLabel,
      heroCollage: validImage(data.home?.heroCollage, fallbackContent.home.heroCollage),
    },
    projects: mergeProjects(data.projects),
    clients: mergeClients(data.clients),
    crew: mergeCrew(data.crew),
    crewMosaic: mergeCrewMosaic(data.crewMosaic),
    services: mergeServices(data.services),
    contact: mergeContact(data.contact),
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
