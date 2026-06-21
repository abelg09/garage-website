import { defineCliConfig } from "sanity/cli";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.VITE_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "garagecms1";

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

const basePath =
  process.env.SANITY_STUDIO_BASEPATH ||
  process.env.SANITY_STUDIO_BASE_PATH ||
  "/studio";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  project: {
    basePath,
  },
});
