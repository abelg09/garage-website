import { createClient } from "next-sanity";

export const apiVersion = "2026-04-15";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const hasSanityConfig = Boolean(sanityProjectId && sanityDataset);

export const client = createClient({
  projectId: sanityProjectId || "garagecms1",
  dataset: sanityDataset,
  apiVersion,
  useCdn: true,
  perspective: "published"
});
