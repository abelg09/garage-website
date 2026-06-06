import { createClient } from "@sanity/client";

export const apiVersion = "2026-04-15";

export const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
export const sanityDataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || "production";

export const hasSanityConfig = Boolean(sanityProjectId && sanityDataset);

export const client = createClient({
  projectId: sanityProjectId || "garagecms1",
  dataset: sanityDataset,
  apiVersion,
  useCdn: true,
  perspective: "published"
});
