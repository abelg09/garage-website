export const imageFields = `{
  "src": asset->url,
  "alt": coalesce(alt, asset->altText, "")
}`;

export const garageContentQuery = `{
  "site": *[_type == "siteSettings"][0]{
    title,
    email,
    address,
    "wordmark": wordmark${imageFields}
  },
  "home": *[_type == "homePage"][0]{
    introKicker,
    introTitle,
    introBody,
    "garageFacade": garageFacade${imageFields},
    "garageOrigin": garageOrigin${imageFields},
    garageOriginLabel,
    "heroCollage": heroCollage${imageFields}
  },
  "projects": *[_type == "project"] | order(orderRank asc, title asc) {
    "id": slug.current,
    title,
    client,
    category,
    summary,
    impact,
    "cover": cover${imageFields},
    "gallery": gallery[]${imageFields}
  },
  "clients": *[_type == "client"] | order(orderRank asc, name asc) {
    "id": slug.current,
    name,
    "logo": logo${imageFields}
  },
  "crew": *[_type == "crewMember"] | order(orderRank asc, name asc) {
    "id": slug.current,
    name,
    role,
    "portrait": portrait${imageFields},
    "bio": bio[]
  },
  "services": *[_type == "service"] | order(orderRank asc, title asc).title,
  "contact": *[_type == "siteSettings"][0]{
    "collage": contactCollage${imageFields}
  }
}`;
