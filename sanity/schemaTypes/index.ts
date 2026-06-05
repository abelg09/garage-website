import { clientLogo } from "@/sanity/schemaTypes/client";
import { crewMember } from "@/sanity/schemaTypes/crewMember";
import { homePage } from "@/sanity/schemaTypes/homePage";
import { project } from "@/sanity/schemaTypes/project";
import { service } from "@/sanity/schemaTypes/service";
import { siteSettings } from "@/sanity/schemaTypes/siteSettings";

export const schemaTypes = [
  siteSettings,
  homePage,
  project,
  clientLogo,
  crewMember,
  service
];
