export const imageFields = `{
  asset,
  crop,
  hotspot,
  "src": asset->url,
  "alt": coalesce(alt, asset->altText, "")
}`;

export const cropFields = `{
  position,
  zoom,
  origin
}`;

export const garageContentQuery = `{
  "site": *[_type == "siteSettings"][0]{
    title,
    email,
    address,
    "wordmark": wordmark${imageFields}
  },
  "home": *[_type == "homePage"][0]{
    heroHeadline,
    heroBody,
    "heroGarageClosed": heroGarageClosed${imageFields},
    "heroGarageOpen": heroGarageOpen${imageFields},
    "heroBanana": heroBanana${imageFields},
    introKicker,
    introTitle,
    introBody,
    "garageFacade": garageFacade${imageFields},
    "garageOrigin": garageOrigin${imageFields},
    garageOriginLabel,
    "heroCollage": heroCollage${imageFields}
  },
  "projects": *[_type == "project" && hidden != true] | order(orderRank asc, title asc) {
    "id": slug.current,
    title,
    client,
    category,
    summary,
    impact,
    "cover": cover${imageFields},
    "gallery": coalesce(gallery[]${imageFields}, [])
  },
  "clients": *[_type == "client" && hidden != true] | order(orderRank asc, name asc) {
    "id": slug.current,
    name,
    "logo": logo${imageFields}
  },
  "crew": *[_type == "crewMember" && hidden != true] | order(orderRank asc, name asc) {
    "id": slug.current,
    name,
    role,
    tier,
    "portrait": portrait${imageFields},
    crop${cropFields},
    "bio": coalesce(bio, [])
  },
  "crewMosaic": *[_type == "crewMosaic"][0].cells[]{
    "id": coalesce(id, _key),
    kind,
    "crewId": member->slug.current,
    "image": image${imageFields},
    split,
    crop${cropFields}
  },
  "services": *[_type == "serviceSettings"][0]{
    eyebrow,
    title,
    tagline,
    ctaLabel,
    ctaHref,
    "items": coalesce(items[]{
      "id": coalesce(id, _key),
      icon,
      title,
      description
    }, [])
  },
  "contact": *[_type == "siteSettings"][0]{
    "collage": contactCollage${imageFields},
    emailLabel,
    addressLabel,
    formLabel,
    nameLabel,
    emailFieldLabel,
    messageLabel,
    submitLabel,
    submittingLabel,
    requiredMessage,
    successMessage,
    genericErrorMessage,
    networkErrorMessage
  }
}`;
