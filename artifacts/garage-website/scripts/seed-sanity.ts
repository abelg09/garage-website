import { createClient, type SanityAssetDocument } from "@sanity/client";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fallbackContent } from "../src/lib/fallback-data";
import type { CrewMosaicCell, ImageAsset } from "../src/lib/types";

const apiVersion = "2026-04-15";

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.VITE_SANITY_PROJECT_ID ||
  "garagecms1";

const dataset =
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  "production";

const token = process.env.SANITY_AUTH_TOKEN;

if (!token) {
  throw new Error("SANITY_AUTH_TOKEN is required to seed Sanity content.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(appRoot, "public");
const uploadedAssets = new Map<string, Promise<SanityAssetDocument | undefined>>();

const mimeByExtension: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function key(value: string): string {
  return value.replace(/[^A-Za-z0-9_]/g, "");
}

function publicFilePath(src: string): string | undefined {
  if (!src) return undefined;

  const pathname = src.startsWith("http")
    ? new URL(src).pathname
    : src;

  const relative = decodeURIComponent(pathname)
    .replace(/^\/+/, "")
    .replace(/^garage-website\//, "");

  const filePath = path.join(publicRoot, relative);
  return existsSync(filePath) ? filePath : undefined;
}

async function uploadImage(image: ImageAsset | undefined) {
  const filePath = image?.src ? publicFilePath(image.src) : undefined;
  if (!filePath) {
    if (image?.src) console.warn(`Skipping missing local image: ${image.src}`);
    return undefined;
  }

  if (!uploadedAssets.has(filePath)) {
    uploadedAssets.set(filePath, client.assets.upload("image", createReadStream(filePath), {
      filename: path.basename(filePath),
      contentType: mimeByExtension[path.extname(filePath).toLowerCase()],
    }));
  }

  return uploadedAssets.get(filePath);
}

async function imageField(image: ImageAsset | undefined) {
  const asset = await uploadImage(image);
  if (!asset) return undefined;

  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt: image?.alt ?? "",
  };
}

function prune<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(prune).filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([childKey, child]) => [childKey, prune(child)])
    ) as T;
  }

  return value;
}

async function seed() {
  console.log(`Seeding Sanity project ${projectId}/${dataset}`);

  const siteSettings = prune({
    _id: "siteSettings",
    _type: "siteSettings",
    title: fallbackContent.site.title,
    email: fallbackContent.site.email,
    address: fallbackContent.site.address,
    wordmark: await imageField(fallbackContent.site.wordmark),
    contactCollage: await imageField(fallbackContent.contact.collage),
    emailLabel: fallbackContent.contact.emailLabel,
    addressLabel: fallbackContent.contact.addressLabel,
    formLabel: fallbackContent.contact.formLabel,
    nameLabel: fallbackContent.contact.nameLabel,
    emailFieldLabel: fallbackContent.contact.emailFieldLabel,
    messageLabel: fallbackContent.contact.messageLabel,
    submitLabel: fallbackContent.contact.submitLabel,
    submittingLabel: fallbackContent.contact.submittingLabel,
    requiredMessage: fallbackContent.contact.requiredMessage,
    successMessage: fallbackContent.contact.successMessage,
    genericErrorMessage: fallbackContent.contact.genericErrorMessage,
    networkErrorMessage: fallbackContent.contact.networkErrorMessage,
  });

  const homePage = prune({
    _id: "homePage",
    _type: "homePage",
    heroHeadline: fallbackContent.home.heroHeadline,
    heroBody: fallbackContent.home.heroBody,
    heroGarageClosed: await imageField(fallbackContent.home.heroGarageClosed),
    heroGarageOpen: await imageField(fallbackContent.home.heroGarageOpen),
    heroBanana: await imageField(fallbackContent.home.heroBanana),
    introKicker: fallbackContent.home.introKicker,
    introTitle: fallbackContent.home.introTitle,
    introBody: fallbackContent.home.introBody,
    garageFacade: await imageField(fallbackContent.home.garageFacade),
    garageOrigin: await imageField(fallbackContent.home.garageOrigin),
    garageOriginLabel: fallbackContent.home.garageOriginLabel,
    heroCollage: await imageField(fallbackContent.home.heroCollage),
  });

  const serviceSettings = prune({
    _id: "serviceSettings",
    _type: "serviceSettings",
    eyebrow: fallbackContent.services.eyebrow,
    title: fallbackContent.services.title,
    tagline: fallbackContent.services.tagline,
    ctaLabel: fallbackContent.services.ctaLabel,
    ctaHref: fallbackContent.services.ctaHref,
    items: fallbackContent.services.items.map((service) => ({
      _key: key(service.id),
      id: service.id,
      icon: service.icon,
      title: service.title,
      description: service.description,
    })),
  });

  await client.createOrReplace(siteSettings);
  await client.createOrReplace(homePage);
  await client.createOrReplace(serviceSettings);

  for (const [index, project] of fallbackContent.projects.entries()) {
    await client.createOrReplace(prune({
      _id: `project.${project.id}`,
      _type: "project",
      title: project.title,
      slug: { _type: "slug", current: project.id },
      client: project.client,
      category: project.category,
      summary: project.summary,
      impact: project.impact,
      cover: await imageField(project.cover),
      gallery: await Promise.all(project.gallery.map(async (image) => ({
        _key: key(`${project.id}-${image.src}`),
        ...(await imageField(image)),
      }))),
      orderRank: index,
      hidden: false,
    }));
  }

  for (const [index, clientItem] of fallbackContent.clients.entries()) {
    await client.createOrReplace(prune({
      _id: `client.${clientItem.id}`,
      _type: "client",
      name: clientItem.name,
      slug: { _type: "slug", current: clientItem.id },
      logo: await imageField(clientItem.logo),
      orderRank: index,
      hidden: false,
    }));
  }

  for (const [index, member] of fallbackContent.crew.entries()) {
    await client.createOrReplace(prune({
      _id: `crewMember.${member.id}`,
      _type: "crewMember",
      name: member.name,
      slug: { _type: "slug", current: member.id },
      role: member.role,
      tier: member.tier ?? "team",
      portrait: await imageField(member.portrait),
      crop: member.crop,
      bio: member.bio,
      orderRank: index,
      hidden: false,
    }));
  }

  const cells = await Promise.all(fallbackContent.crewMosaic.map(async (cell: CrewMosaicCell) => {
    if (cell.kind === "crew") {
      return {
        _key: key(cell.id),
        id: cell.id,
        kind: "crew",
        member: { _type: "reference", _ref: `crewMember.${cell.crewId}` },
      };
    }

    return prune({
      _key: key(cell.id),
      id: cell.id,
      kind: "office",
      image: await imageField(cell.image),
      split: cell.split,
      crop: cell.crop,
    });
  }));

  await client.createOrReplace(prune({
    _id: "crewMosaic",
    _type: "crewMosaic",
    cells,
  }));

  console.log("Sanity seed complete.");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
