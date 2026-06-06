import type { GarageContent } from "@/lib/types";

const ppt = "/assets/ppt/";

export const fallbackContent: GarageContent = {
  site: {
    title: "GARAGE",
    email: "hello@garage-india.in",
    address: [
      "Ground Floor,",
      "Amit Industrial Estste,",
      "Dr. S. S. Rao Road,",
      "Parel East,",
      "Mumbai, 400012"
    ],
    wordmark: {
      src: `${ppt}garage-wordmark.png`,
      alt: "GARAGE wordmark"
    }
  },
  home: {
    introKicker: "About Garage",
    introTitle: "The original startup room.",
    introBody: [
      "Every icon starts somewhere. Apple in 1976. HP in 1939. Amazon in 1994. Google in 1998. Microsoft in 1975. Different decades, same origin story: a garage, an idea, and no excuse not to build.",
      "Garage is not about square footage. It is about hunger, limited resources, unlimited belief, late nights, scrappy solutions, and work that has to earn attention because it cannot buy it.",
      "We are an ad agency built on that same principle. We start with what is real: the product, the people, the story, and the nerve to begin before everything feels ready."
    ],
    garageFacade: {
      src: `${ppt}garage-facade.png`,
      alt: "Industrial red facade with a single closed metal garage shutter"
    },
    garageOrigin: {
      src: `${ppt}garage-origin.png`,
      alt: "Black and white collage of early garages for Apple, Google, Amazon, Harley, Disney, and Mattel"
    },
    garageOriginLabel: "Where it all started",
    heroCollage: {
      src: `${ppt}hero-garage-collage.jpg`,
      alt: "Black and white collage of famous garages and early workspaces"
    }
  },
  projects: [
    {
      id: "grameen-kulfi",
      title: "Grameen Kulfi",
      client: "Grameen Kulfi",
      category: "Campaign",
      summary:
        "A colourful kulfi campaign placed inside GARAGE's restrained editorial world, giving the work room to be loud without disrupting the site.",
      impact:
        "Built for fast product recognition, crisp campaign recall, and easy extension into future gallery assets.",
      cover: {
        src: `${ppt}work-grameen-kulfi.jpg`,
        alt: "Grameen Kulfi campaign visuals"
      },
      gallery: [
        {
          src: `${ppt}work-grameen-kulfi.jpg`,
          alt: "Grameen Kulfi campaign page from the GARAGE deck"
        },
        {
          src: `${ppt}work-overview.jpg`,
          alt: "GARAGE work overview with three featured projects"
        }
      ]
    },
    {
      id: "johnson",
      title: "Johnson",
      client: "Johnson",
      category: "Brand film",
      summary:
        "A reserved, monochrome presentation treatment for a brand story that can grow into a full case study.",
      impact:
        "The inline detail format lets this project expand with video, stills, and copy once final assets are approved.",
      cover: {
        src: `${ppt}work-overview.jpg`,
        alt: "GARAGE work overview showing Johnson project thumbnail"
      },
      gallery: [
        {
          src: `${ppt}work-overview.jpg`,
          alt: "Work overview slide from the GARAGE deck"
        }
      ]
    },
    {
      id: "jameson",
      title: "Jameson",
      client: "Jameson",
      category: "Digital",
      summary:
        "A flexible case-study placeholder seeded from the PPT, ready for real campaign assets through Sanity.",
      impact:
        "Keeps the Work grid production-ready while the final campaign archive is still being assembled.",
      cover: {
        src: `${ppt}work-placeholder-grid.jpg`,
        alt: "Outlined work grid placeholder from the GARAGE deck"
      },
      gallery: [
        {
          src: `${ppt}work-placeholder-grid.jpg`,
          alt: "Placeholder work grid from the GARAGE deck"
        }
      ]
    }
  ],
  clients: [
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
  ].map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name })),
  crew: [
    {
      id: "ashish-chakravarty",
      name: "Ashish Chakravarty",
      role: "Managing Partner and Chief Creative Officer",
      portrait: {
        src: `${ppt}crew-ashish-portrait.jpg`,
        alt: "Ashish Chakravarty portrait"
      },
      bio: [
        "Ashish Chakravarty is one of India’s most awarded and respected creative leaders, with more than two decades of senior creative leadership experience across influential agencies and global brands.",
        "His work spans brands such as Nestle, Coca-Cola, Dabur, Air India, Microsoft, Hero, Lupin, ITC, Britannia, Domino’s, General Motors, Docomo, Emami, and many others.",
        "Today, Ashish is the Managing Partner and Chief Creative Officer of Garage Worldwide, a new-age agency built at the crossroads of strategy, creativity, and technology."
      ]
    },
    {
      id: "swati-bobde",
      name: "Swati Bobde",
      role: "Strategy and Brand Partner",
      bio: [
        "Swati brings sharp brand thinking, business context, and calm momentum to campaigns that need to move from insight to impact.",
        "Her full production biography can be managed in Sanity as soon as the approved profile copy and portrait are supplied."
      ]
    },
    {
      id: "qaid-vora",
      name: "Qaid Vora",
      role: "Creative Partner",
      bio: [
        "Qaid shapes creative direction for brands that need work with appetite, clarity, and enough nerve to be remembered.",
        "This profile is intentionally CMS-ready, with placeholders used until final portraits and biography copy are available."
      ]
    },
    {
      id: "name-surname-1",
      name: "Name Surname",
      role: "Client Partner",
      bio: [
        "Placeholder profile reserved for the next GARAGE crew member. Add the final portrait, role, and biography in Sanity."
      ]
    },
    {
      id: "name-surname-2",
      name: "Name Surname",
      role: "Production Partner",
      bio: [
        "Placeholder profile reserved for the next GARAGE crew member. Add the final portrait, role, and biography in Sanity."
      ]
    }
  ],
  services: [
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
  ],
  contact: {
    collage: {
      src: `${ppt}contact-office-collage.jpg`,
      alt: "Black and white GARAGE office contact collage"
    }
  }
};
