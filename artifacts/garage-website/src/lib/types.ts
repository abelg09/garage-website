export type ImageAsset = {
  src: string;
  alt: string;
};

export type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  impact: string;
  cover: ImageAsset;
  gallery: ImageAsset[];
};

export type ClientLogo = {
  id: string;
  name: string;
  logo?: ImageAsset;
};

export type CrewMember = {
  id: string;
  name: string;
  role: string;
  tier?: "leader" | "team";
  portrait?: ImageAsset;
  bio: string[];
};

export type Review = {
  id: string;
  quote: string;
  reviewer: string;
  role: string;
  initials: string;
};

export type GarageContent = {
  site: {
    title: string;
    email: string;
    address: string[];
    wordmark: ImageAsset;
  };
  home: {
    introKicker: string;
    introTitle: string;
    introBody: string[];
    garageFacade: ImageAsset;
    garageOrigin: ImageAsset;
    garageOriginLabel: string;
    heroCollage: ImageAsset;
  };
  projects: Project[];
  clients: ClientLogo[];
  reviews: Review[];
  crew: CrewMember[];
  services: string[];
  contact: {
    collage: ImageAsset;
  };
};
