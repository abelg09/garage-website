import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";
import { apiVersion, sanityDataset, sanityProjectId } from "@/lib/sanity.client";

export default defineConfig({
  name: "garage",
  title: "GARAGE",
  projectId: sanityProjectId || "garagecms1",
  dataset: sanityDataset,
  apiVersion,
  basePath: "/studio",
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes
  }
});
