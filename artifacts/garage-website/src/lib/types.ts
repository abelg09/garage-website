export type ImageAsset = {
  src: string;
  alt: string;
};

export type CropSettings = {
  position?: string;
  zoom?: number;
  origin?: string;
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
  crop?: CropSettings;
  bio: string[];
};

export type CrewMosaicCell =
  | {
      id: string;
      kind: "crew";
      crewId: string;
    }
  | {
      id: string;
      kind: "office";
      image: ImageAsset;
      split?: "top" | "bottom";
      crop?: CropSettings;
    };

export type ServiceIconKey =
  | "target"
  | "film"
  | "share"
  | "camera"
  | "monitor";

export type ServiceItem = {
  id: string;
  icon: ServiceIconKey;
  title: string;
  description: string;
};

export type ServicesContent = {
  eyebrow: string;
  title: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  items: ServiceItem[];
};

export type ContactContent = {
  collage: ImageAsset;
  emailLabel: string;
  addressLabel: string;
  formLabel: string;
  nameLabel: string;
  emailFieldLabel: string;
  messageLabel: string;
  submitLabel: string;
  submittingLabel: string;
  requiredMessage: string;
  successMessage: string;
  genericErrorMessage: string;
  networkErrorMessage: string;
};

export type GarageContent = {
  site: {
    title: string;
    email: string;
    address: string[];
    wordmark: ImageAsset;
  };
  home: {
    heroHeadline: string;
    heroBody: string[];
    heroGarageClosed: ImageAsset;
    heroGarageOpen: ImageAsset;
    heroBanana: ImageAsset;
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
  crew: CrewMember[];
  crewMosaic: CrewMosaicCell[];
  services: ServicesContent;
  contact: ContactContent;
};
