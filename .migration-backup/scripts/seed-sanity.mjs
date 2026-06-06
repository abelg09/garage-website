import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN before seeding."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-04-15",
  useCdn: false
});

const assetPath = (name) => resolve(process.cwd(), "public/assets/ppt", name);
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function imageField(filename, alt) {
  const asset = await client.assets.upload("image", createReadStream(assetPath(filename)), {
    filename
  });

  return {
    _type: "image",
    alt,
    asset: {
      _type: "reference",
      _ref: asset._id
    }
  };
}

async function upsert(doc) {
  await client.createOrReplace(doc);
  console.log(`seeded ${doc._id}`);
}

const services = [
  "Brand Strategy & Creatives",
  "Content Production",
  "Website & Apps",
  "Email Marketing",
  "Influencer Marketing",
  "Social Listening & Analytics",
  "Ecomm Marketing",
  "SEO / SEM",
  "CRM / ORM",
  "Mobile Marketing",
  "Media Planning & Buying",
  "Performance Marketing",
  "Tech Solutions with AR / VR"
];

const clientNames = [
  "Grameen Kulfi",
  "Johnson",
  "Croma",
  "Nippon India Mutual Fund",
  "Tata",
  "Kalpa-Taru",
  "Jameson",
  "Marvel",
  "Senco",
  "IFB",
  "Plum",
  "South Indian Bank",
  "Jacob's Creek",
  "Imperial Blue"
];

async function seed() {
  const wordmark = await imageField("garage-wordmark.png", "GARAGE wordmark");
  const heroCollage = await imageField(
    "hero-garage-collage.jpg",
    "Black and white collage of famous garages and early workspaces"
  );
  const garageFacade = await imageField(
    "garage-facade.png",
    "Industrial red facade with a single closed metal garage shutter"
  );
  const garageOrigin = await imageField(
    "garage-origin.png",
    "Black and white collage of early garages for Apple, Google, Amazon, Harley, Disney, and Mattel"
  );
  const contactCollage = await imageField(
    "contact-office-collage.jpg",
    "Black and white GARAGE office contact collage"
  );
  const workOverview = await imageField(
    "work-overview.jpg",
    "GARAGE work overview with three featured projects"
  );
  const grameenWork = await imageField(
    "work-grameen-kulfi.jpg",
    "Grameen Kulfi campaign visuals"
  );
  const placeholderWork = await imageField(
    "work-placeholder-grid.jpg",
    "Outlined work grid placeholder from the GARAGE deck"
  );
  const crewAshish = await imageField(
    "crew-ashish-portrait.jpg",
    "Ashish Chakravarty portrait"
  );

  await upsert({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "GARAGE",
    email: "hello@garage-india.in",
    address: [
      "Ground Floor,",
      "Amit Industrial Estste,",
      "Dr. S. S. Rao Road,",
      "Parel East,",
      "Mumbai, 400012"
    ],
    wordmark,
    contactCollage
  });

  await upsert({
    _id: "homePage",
    _type: "homePage",
    introKicker: "About Garage",
    introTitle: "The original startup room.",
    introBody: [
      "Every icon starts somewhere. Different decades, same origin story: a garage, an idea, and no excuse not to build.",
      "Garage is not about square footage. It is about hunger, limited resources, unlimited belief, late nights, scrappy solutions, and work that has to earn attention because it cannot buy it.",
      "We are an ad agency built on that same principle. We start with what is real: the product, the people, the story, and the nerve to begin before everything feels ready."
    ],
    garageFacade,
    garageOrigin,
    garageOriginLabel: "Where it all started",
    heroCollage
  });

  const projects = [
    {
      title: "Grameen Kulfi",
      client: "Grameen Kulfi",
      category: "Campaign",
      cover: grameenWork,
      gallery: [grameenWork, workOverview]
    },
    {
      title: "Johnson",
      client: "Johnson",
      category: "Brand film",
      cover: workOverview,
      gallery: [workOverview]
    },
    {
      title: "Jameson",
      client: "Jameson",
      category: "Digital",
      cover: placeholderWork,
      gallery: [placeholderWork]
    }
  ];

  await Promise.all(
    projects.map((project, index) =>
      upsert({
        _id: `project.${slug(project.title)}`,
        _type: "project",
        title: project.title,
        slug: { _type: "slug", current: slug(project.title) },
        orderRank: index + 1,
        client: project.client,
        category: project.category,
        summary:
          "A PPT-seeded GARAGE case study that can be expanded with final campaign assets and copy in Sanity.",
        impact:
          "Designed for fast recognition, responsive galleries, and a clean editorial rhythm inside the single-page site.",
        cover: project.cover,
        gallery: project.gallery
      })
    )
  );

  await Promise.all(
    clientNames.map((name, index) =>
      upsert({
        _id: `client.${slug(name)}`,
        _type: "client",
        name,
        slug: { _type: "slug", current: slug(name) },
        orderRank: index + 1
      })
    )
  );

  const crew = [
    {
      name: "Ashish Chakravarty",
      role: "Managing Partner and Chief Creative Officer",
      portrait: crewAshish,
      bio: [
        "Ashish Chakravarty is one of India’s most awarded and respected creative leaders, with more than two decades of senior creative leadership experience.",
        "Today, Ashish is the Managing Partner and Chief Creative Officer of Garage Worldwide, a new-age agency built at the crossroads of strategy, creativity, and technology."
      ]
    },
    {
      name: "Swati Bobde",
      role: "Strategy and Brand Partner",
      bio: [
        "Swati brings sharp brand thinking, business context, and calm momentum to campaigns that need to move from insight to impact."
      ]
    },
    {
      name: "Qaid Vora",
      role: "Creative Partner",
      bio: [
        "Qaid shapes creative direction for brands that need work with appetite, clarity, and enough nerve to be remembered."
      ]
    }
  ];

  await Promise.all(
    crew.map((member, index) =>
      upsert({
        _id: `crewMember.${slug(member.name)}`,
        _type: "crewMember",
        name: member.name,
        slug: { _type: "slug", current: slug(member.name) },
        orderRank: index + 1,
        role: member.role,
        portrait: member.portrait,
        bio: member.bio
      })
    )
  );

  await Promise.all(
    services.map((title, index) =>
      upsert({
        _id: `service.${slug(title)}`,
        _type: "service",
        title,
        orderRank: index + 1
      })
    )
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
