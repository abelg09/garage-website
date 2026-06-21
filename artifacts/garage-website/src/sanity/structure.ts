import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "homePage", "crewMosaic", "serviceSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("GARAGE CMS")
    .items([
      S.listItem()
        .title("Site and Contact Settings")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Home / About")
        .schemaType("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Services")
        .schemaType("serviceSettings")
        .child(S.document().schemaType("serviceSettings").documentId("serviceSettings")),
      S.listItem()
        .title("Crew Mosaic")
        .schemaType("crewMosaic")
        .child(S.document().schemaType("crewMosaic").documentId("crewMosaic")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const schemaType = item.getSchemaType();
        const schemaTypeName = typeof schemaType === "string" ? schemaType : schemaType?.name;
        return schemaTypeName ? !singletonTypes.has(schemaTypeName) : true;
      }),
    ]);
