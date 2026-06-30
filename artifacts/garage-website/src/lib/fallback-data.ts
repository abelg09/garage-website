import type { GarageContent } from "./types";
import { publicAsset } from "./public-asset";

const ppt = publicAsset("assets/ppt/");
const revamp = publicAsset("assets/revamp/");
const clientLogo = (file: string) => publicAsset(`clients/${file}`);
const crewPortrait = (file: string) => publicAsset(`crew/${file.replace(/\.[^.]+$/, ".webp")}`);
const crewImage = (file: string) => publicAsset(`crew/${file.replace(/\.[^.]+$/, ".webp")}`);

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
    heroHeadline: "Big ideas start at Garage",
    heroBody: [
      "Every icon starts somewhere - a garage, an idea, a decision to begin that's garage. An ad agency built on instinct over excess. We don't wait for perfect conditions."
    ],
    heroGarageClosed: {
      src: `${revamp}garage-closed.webp`,
      alt: "Hand-drawn closed GARAGE shutter"
    },
    heroGarageOpen: {
      src: `${revamp}garage-open.webp`,
      alt: "Hand-drawn open GARAGE storefront"
    },
    heroBanana: {
      src: `${revamp}banana-scroll.webp`,
      alt: "Hand-drawn banana scroll marker"
    },
    introKicker: "About Garage",
    introTitle: "Built To Start Things.",
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
      src: `${ppt}garage-origin-clean.webp`,
      alt: "Black and white collage of early startup garages"
    },
    garageOriginLabel: "Where it all started",
    heroCollage: {
      src: `${ppt}hero-garage-collage.jpg`,
      alt: "Black and white collage of famous garages and early workspaces"
    }
  },
  projects: [
    {
      id: "senco-gold",
      title: "Khushiyon Ki Reet",
      client: "Senco Gold & Diamonds",
      category: "Integrated Campaign",
      summary:
        "Celebrating Senco's 85-year journey through the tagline \u2018Khushiyon Ki Reet\u2019 (Tradition of Joy). The campaign establishes that every Senco piece embodies heritage, craftsmanship, and the enduring happiness of both creating and wearing something truly special. Weddings were chosen as the central theme, promoting the Vivaah Collection as the perfect choice for life's most cherished moments.",
      impact:
        "The #AapkaShukriya film — a heartfelt tribute to the karigars behind every Senco masterpiece — celebrated artisan craftsmanship and cultural heritage, driving brand love and digital engagement across the campaign.",
      cover: {
        src: `${ppt}work-senco.jpg`,
        alt: "Senco Gold & Diamonds — Khushiyon Ki Reet campaign visual"
      },
      gallery: [
        {
          src: `${ppt}work-senco.jpg`,
          alt: "Senco Gold & Diamonds — Khushiyon Ki Reet campaign visual"
        }
      ]
    },
    {
      id: "south-indian-bank",
      title: "Trust meets Tech since 1929",
      client: "South Indian Bank",
      category: "Brand Campaign",
      summary:
        "SIB has a legacy of over 90 years but was perceived as old, traditional, and PSU-type by younger audiences — despite having technology on par with any private bank. The challenge: drive new customer acquisition among a tech-savvy, younger South Indian demographic.",
      impact:
        "The creative strategy wove SIB's technology advances into a trusted-banking-partner narrative, centred on the newly launched Mirror+ App. Younger customer testimonials on social and a showcase of new asset and liability products anchored the campaign film \u2018Trust meets Tech since 1929\u2019.",
      cover: {
        src: `${ppt}work-sib.jpg`,
        alt: "South Indian Bank — Trust meets Tech since 1929 campaign"
      },
      gallery: [
        {
          src: `${ppt}work-sib.jpg`,
          alt: "South Indian Bank — Trust meets Tech since 1929 campaign"
        }
      ]
    },
    {
      id: "grameen-kulfi",
      title: "Jaldi Kya Hai?",
      client: "Grameen Kulfi",
      category: "Campaign",
      summary:
        "A kulfi crafted with so much care, it deserves to be savoured. This campaign positioned Grameen Kulfi as an antidote to today's fast-paced world — celebrating slow living, mindful indulgence, and the craftsmanship behind every kulfi. Flavours include Desi Malai, Kesar Pista, Alphonso Mango and more; available in stick, slice, and matka formats.",
      impact:
        "The wedding film and conference film carried the \u2018Jaldi Kya Hai?\u2019 platform across occasions, building brand recall around the idea of unhurried, traditional indulgence in a market dominated by fast snacking.",
      cover: {
        src: `${ppt}work-grameen-kulfi-new.png`,
        alt: "Grameen Kulfi — Jaldi Kya Hai? campaign visual"
      },
      gallery: [
        {
          src: `${ppt}work-grameen-kulfi-new.png`,
          alt: "Grameen Kulfi — Jaldi Kya Hai? campaign visual"
        }
      ]
    },
    {
      id: "johnson",
      title: "Dada Jackson & Ram–Shyam",
      client: "H&R Johnson",
      category: "Brand Film",
      summary:
        "An integrated campaign highlighting the real-world benefits of Johnson's innovative tile solutions through two lighthearted, performance-driven films. Dada Jackson demonstrates unshakable confidence on MaxGrip anti-skid tiles; Ram and Shyam deliver comic contrast showcasing Cool-Roof tiles.",
      impact:
        "By blending functional innovation with entertainment, the films achieved high recall and everyday relevance — making tile performance tangible and memorable for consumers across retail and digital.",
      cover: {
        src: `${ppt}work-johnson.jpg`,
        alt: "H&R Johnson — Dada Jackson MaxGrip campaign visual"
      },
      gallery: [
        {
          src: `${ppt}work-johnson.jpg`,
          alt: "H&R Johnson — Dada Jackson MaxGrip campaign visual"
        }
      ]
    },
    {
      id: "nippon-india-mf",
      title: "GOAT Campaign",
      client: "Nippon India Mutual Fund",
      category: "Digital & Social",
      summary:
        "To build a stronger connection with younger audiences, GARAGE partnered with Nippon India Mutual Fund to launch a Gen Z-first social ecosystem — simplifying mutual funds by speaking the audience's language, both verbally and visually. From leveraging Gen Z slang to culturally relevant, thumb-stopping content, finance was made less intimidating and more relatable.",
      impact:
        "The GOAT campaign, Diwali Vox Pop series, and New Year \u2018Grape Theory\u2019 film drove curiosity and meaningful engagement across Instagram, Facebook, and YouTube — positioning Nippon India as the GOAT of mutual funds among India's Gen Z investors.",
      cover: {
        src: `${ppt}work-nippon.jpg`,
        alt: "Nippon India Mutual Fund — GOAT campaign visual"
      },
      gallery: [
        {
          src: `${ppt}work-nippon.jpg`,
          alt: "Nippon India Mutual Fund — GOAT campaign visual"
        }
      ]
    },
    {
      id: "tata-sons",
      title: "The Quiet Little Kid",
      client: "Tata Sons",
      category: "Digital & Creative Strategy",
      summary:
        "The Tata Building India School Essay Competition is one of the Tata Group's key initiatives to ignite the imagination of the young and instil a spirit of nation building. Over 15+ years it has touched 33+ million school students, with participation from 500+ cities in 13 languages.",
      impact:
        "The \u2018Quiet Little Kid\u2019 launch film celebrated children who know the answer but lack the confidence to say it — earning strong digital reach across English and Hindi versions, and amplified through a full teaser-to-sustenance content arc on social media.",
      cover: {
        src: `${ppt}work-tata.jpg`,
        alt: "Tata Sons — The Quiet Little Kid essay competition film"
      },
      gallery: [
        {
          src: `${ppt}work-tata.jpg`,
          alt: "Tata Sons — The Quiet Little Kid essay competition film"
        }
      ]
    }
  ],
  clients: [
    { name: "Grameen Kulfi",          logo: clientLogo("grameen-kulfi.png")   },
    { name: "H&R Johnson",            logo: clientLogo("johnson.png")         },
    { name: "Croma",                  logo: clientLogo("croma.png")           },
    { name: "Nippon India Mutual Fund", logo: clientLogo("nippon.png")        },
    { name: "Tata Sons",              logo: clientLogo("tata.png")            },
    { name: "Kalpa-Taru",             logo: clientLogo("kalpataru.png")       },
    { name: "Jameson",                logo: clientLogo("jameson.png")         },
    { name: "Marvel",                 logo: null                           },
    { name: "Senco Gold & Diamonds",  logo: clientLogo("senco.png")           },
    { name: "IFB",                    logo: clientLogo("ifb.png")             },
    { name: "Plum",                   logo: clientLogo("plum.png")            },
    { name: "South Indian Bank",      logo: clientLogo("south-indian-bank.png") },
    { name: "Jacob's Creek",          logo: clientLogo("jacobs-creek.png")   },
    { name: "Imperial Blue",          logo: clientLogo("imperial-blue.png")  },
  ].map(({ name, logo }) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    ...(logo ? { logo: { src: logo, alt: `${name} logo` } } : {}),
  })),
  crew: [
    {
      id: "ashish-chakravarty",
      name: "Ashish Chakravarty",
      role: "Managing Partner and Chief Creative Officer",
      tier: "leader",
      portrait: { src: crewPortrait("ashish.jpg"), alt: "Ashish Chakravarty portrait" },
      crop: { position: "50% 47%", zoom: 1.12, origin: "50% 30%" },
      bio: [
        "Ashish Chakravarty is one of India's most awarded and respected creative leaders. Over a career spanning more than two decades, he has held senior creative leadership roles at some of the country's most influential agencies and worked on some of the world's biggest global brands as well as India's most iconic homegrown names.",
        "His body of work spans brands such as Nestle, Coca-Cola, Dabur, Air India, Microsoft, Hero, Lupin, ITC, Britannia, Domino's, General Motors, Docomo, Emami, Campa, and assignments for the Government of India and BJP, among many others. Across categories and markets, Ashish has created talked-about campaigns, enduring brand platforms, and long-term narratives that have shaped how brands are built and remembered.",
        "His work has been recognised extensively in India and internationally, winning at the world's most prestigious award shows including Cannes Lions, D&AD, The One Show, Clio, Spikes Asia, and Effies, with a career tally approaching 500 awards. He is frequently invited to serve on \u2014 and chair \u2014 award juries across global markets, and has also mentored young creative talent worldwide through the London International Awards programme.",
        "Ashish has consistently featured among the industry's top creative leaders. He has been ranked among India's top Creative Directors by The Economic Times for three consecutive years, named the No. 1 Creative Director in India by Campaign\u2019s 2026 global rankings, and previously recognised as one of the Top 50 Executive Creative Directors globally by international Most Won rankings.",
        "Today, Ashish is the Managing Partner and Chief Creative Officer of Garage Worldwide \u2014 a new-age agency built to significantly boost brands. Founded in partnership with Raj Kamble of Famous Innovations, Garage sits at the crossroads of strategy, creativity, and technology. He remains deeply hands-on, shaping brand strategy, creative direction, and client partnerships to ensure every engagement delivers meaningful, measurable impact in a fast-evolving global market."
      ]
    },
    {
      id: "swati-bobde",
      name: "Swati Bobde",
      role: "Chief Operating Officer",
      tier: "leader",
      portrait: { src: crewPortrait("swati.jpg"), alt: "Swati Bobde portrait" },
      crop: { position: "50% 45%", zoom: 1.08, origin: "50% 32%" },
      bio: [
        "Swati Bobde is a business leader, entrepreneur, and brand strategist with over two decades of experience spanning advertising, design, branding, production, and business transformation.",
        "Prior to joining Garage Worldwide, she held senior leadership roles at Publicis, was a co-founder of Clay Strategy & Design, worked across leading agencies including JWT and Rediffusion, and spent time in production as an Executive Producer. Throughout her career, she has successfully led multi-crore business portfolios, built and scaled brands, delivered award-winning integrated campaigns, driven significant revenue growth, and partnered with global teams across Asia-Pacific markets.",
        "Over the years, Swati has worked on both global and India's most recognised brands, including Garnier, Lakme, Kellogg's, Sunsilk, Marico, Godrej, Colgate, Taj Hotels, Johnson & Johnson, Yatra, Sugar Free, Nycil, Listerine, and Tang, among others.",
        "Today, as Chief Operating Officer of Garage Worldwide, she leads business operations, growth, client partnerships, and organisational development, helping shape the agency's vision while driving sustainable growth and measurable business impact for clients."
      ]
    },
    {
      id: "bryan-elijah",
      name: "Bryan Elijah",
      role: "Creative Head \u2013 Art",
      tier: "leader",
      portrait: { src: crewPortrait("bryan.jpg"), alt: "Bryan Elijah portrait" },
      crop: { position: "50% 10%", zoom: 1.34, origin: "50% 28%" },
      bio: [
        "Bryan brings over 20 years of experience in the advertising industry, consistently delivering innovative campaigns across digital media, integrated marketing, and branding \u2014 with a particular mark in the luxury automobile sector.",
        "His career spans leading agencies including Rediffusion, Creativeland, Percept/H, IBD Percept, Law & Kenneth, and RMG David, where he shaped campaigns that resonate with audiences across high-end and mass-market brands alike.",
        "Bryan's work has been recognised at Goafest, Spikes Asia, Effies, DMA, and Adfest, and he has been a finalist at D&AD, One Show Design, and NYFest."
      ]
    },
    {
      id: "utsav-shinde",
      name: "Utsav Shinde",
      role: "Art Director",
      tier: "team",
      portrait: { src: crewPortrait("utsav.jpg"), alt: "Utsav Shinde portrait" },
      crop: { position: "20% 50%" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "rujvi-sankpal",
      name: "Rujvi Sankpal",
      role: "Art Director",
      tier: "team",
      portrait: { src: crewPortrait("rujvi.jpg"), alt: "Rujvi Sankpal portrait" },
      crop: { position: "50% 54%" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "aniket-sharma",
      name: "Aniket Sharma",
      role: "Copywriter",
      tier: "team",
      portrait: { src: crewPortrait("aniket.jpg"), alt: "Aniket Sharma portrait" },
      crop: { position: "50% 18%" },
      bio: ["Copywriter at Garage Worldwide."]
    },
    {
      id: "vedant-sarda",
      name: "Vedant Sarda",
      role: "Copywriter",
      tier: "team",
      portrait: { src: crewPortrait("vedant.jpg"), alt: "Vedant Sarda portrait" },
      crop: { position: "50% 34%" },
      bio: ["Copywriter at Garage Worldwide."]
    },
    {
      id: "shay-dsouza",
      name: "Shay D\u2019Souza",
      role: "Account Executive",
      tier: "team",
      portrait: { src: crewPortrait("shay.jpg"), alt: "Shay D\u2019Souza portrait" },
      crop: { position: "50% 24%", zoom: 1.04, origin: "50% 35%" },
      bio: ["Account Executive at Garage Worldwide."]
    },
    {
      id: "mobaiyana-parveen",
      name: "Mobaiyana Parveen",
      role: "Copywriter",
      tier: "team",
      portrait: { src: crewPortrait("mobaiyana.jpg"), alt: "Mobaiyana Parveen portrait" },
      crop: { position: "29% 50%" },
      bio: ["Copywriter at Garage Worldwide."]
    },
    {
      id: "aryan-sunil",
      name: "Aryan Sunil",
      role: "Junior Visualiser",
      tier: "team",
      portrait: { src: crewPortrait("aryan.jpg"), alt: "Aryan Sunil portrait" },
      crop: { position: "50% 72%" },
      bio: ["Junior Visualiser at Garage Worldwide."]
    },
    {
      id: "pranali-pawar",
      name: "Pranali Pawar",
      role: "Sr. Account Executive",
      tier: "team",
      portrait: { src: crewPortrait("pranali.jpg"), alt: "Pranali Pawar portrait" },
      crop: { position: "50% 8%" },
      bio: ["Sr. Account Executive at Garage Worldwide."]
    },
    {
      id: "tanvi-mahabre",
      name: "Tanvi Mahabre",
      role: "Art Director",
      tier: "team",
      portrait: { src: crewPortrait("tanvi.jpg"), alt: "Tanvi Mahabre portrait" },
      crop: { position: "50% 36%" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "kyle-misquitta",
      name: "Kyle Misquitta",
      role: "Account Executive",
      tier: "team",
      portrait: { src: crewPortrait("kyle.jpg"), alt: "Kyle Misquitta portrait" },
      crop: { position: "42% 50%" },
      bio: ["Account Executive at Garage Worldwide."]
    },
    {
      id: "samir-pinzara",
      name: "Samir Pinzara",
      role: "Account Executive",
      tier: "team",
      portrait: { src: crewPortrait("samir.jpg"), alt: "Samir Pinzara portrait" },
      crop: { position: "50% 0%" },
      bio: ["Account Executive at Garage Worldwide."]
    },
    {
      id: "adwait-gurav",
      name: "Adwait Gurav",
      role: "Art Director",
      tier: "team",
      portrait: { src: crewPortrait("adwait.jpg"), alt: "Adwait Gurav portrait" },
      crop: { position: "44% 50%", zoom: 1.18, origin: "43% 36%" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "saniya-jadhav",
      name: "Saniya Jadhav",
      role: "Art Director",
      tier: "team",
      portrait: { src: crewPortrait("saniya.jpg"), alt: "Saniya Jadhav portrait" },
      crop: { position: "41% 50%" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "christine",
      name: "Christine",
      role: "Team",
      tier: "team",
      portrait: { src: crewPortrait("christine.jpg"), alt: "Christine portrait" },
      crop: { position: "50% 14%" },
      bio: ["Team member at Garage Worldwide."]
    },
  ],
  crewMosaic: [
    { id: "crew-utsav-shinde", kind: "crew", crewId: "utsav-shinde" },
    {
      id: "office-trophies",
      kind: "office",
      image: { src: crewImage("office-trophies.jpg"), alt: "Garage trophies" },
      crop: { position: "40% 50%" }
    },
    { id: "crew-rujvi-sankpal", kind: "crew", crewId: "rujvi-sankpal" },
    { id: "crew-aniket-sharma", kind: "crew", crewId: "aniket-sharma" },
    { id: "crew-vedant-sarda", kind: "crew", crewId: "vedant-sarda" },
    { id: "crew-shay-dsouza", kind: "crew", crewId: "shay-dsouza" },
    { id: "crew-mobaiyana-parveen", kind: "crew", crewId: "mobaiyana-parveen" },
    {
      id: "office-chandelier",
      kind: "office",
      image: { src: crewImage("office-chandelier.jpg"), alt: "Headlights chandelier" }
    },
    { id: "crew-aryan-sunil", kind: "crew", crewId: "aryan-sunil" },
    {
      id: "office-stools",
      kind: "office",
      image: { src: crewImage("office-stools.jpg"), alt: "Garage workspace" },
      crop: { position: "16% 50%" }
    },
    { id: "crew-pranali-pawar", kind: "crew", crewId: "pranali-pawar" },
    {
      id: "office-mural-top",
      kind: "office",
      image: { src: crewImage("office-mural.jpg"), alt: "Rules mural" },
      split: "top",
      crop: { position: "70% 30%" }
    },
    { id: "crew-tanvi-mahabre", kind: "crew", crewId: "tanvi-mahabre" },
    { id: "crew-kyle-misquitta", kind: "crew", crewId: "kyle-misquitta" },
    { id: "crew-samir-pinzara", kind: "crew", crewId: "samir-pinzara" },
    { id: "crew-adwait-gurav", kind: "crew", crewId: "adwait-gurav" },
    {
      id: "office-mural-bottom",
      kind: "office",
      image: { src: crewImage("office-mural.jpg"), alt: "Garage office interior" },
      split: "bottom",
      crop: { position: "80% 100%" }
    },
    {
      id: "office-entrepreneur",
      kind: "office",
      image: { src: crewImage("office-entrepreneur.jpg"), alt: "Entrepreneur Mindsets Welcome" },
      crop: { position: "50% 50%", zoom: 1.7, origin: "38% 44%" }
    },
    { id: "crew-saniya-jadhav", kind: "crew", crewId: "saniya-jadhav" },
    { id: "crew-christine", kind: "crew", crewId: "christine" }
  ],
  services: {
    eyebrow: "[ Expertise ]",
    title: "Expertise",
    tagline: "Full-stack creative capability — from first insight to final frame.",
    ctaLabel: "Get in Touch",
    ctaHref: "#contact",
    items: [
      {
        id: "brand-strategy",
        icon: "target",
        title: "Brand Strategy",
        description: "We excavate the real story, then build the system that tells it across every touchpoint."
      },
      {
        id: "campaign-production",
        icon: "film",
        title: "Campaign Production",
        description: "From concept to final frame, we make work that earns attention and earns space in culture."
      },
      {
        id: "digital-social",
        icon: "share",
        title: "Digital & Social",
        description: "Platform-native content built for the scroll, the share, and the second look."
      },
      {
        id: "content-studio",
        icon: "camera",
        title: "Content Studio",
        description: "Photo, video, copy, and design — produced in-house so nothing gets lost in translation."
      },
      {
        id: "website-apps",
        icon: "monitor",
        title: "Website & Apps",
        description: "Interfaces that match the ambition of the brand behind them."
      }
    ]
  },
  contact: {
    collage: {
      src: `${ppt}contact-office-collage.jpg`,
      alt: "Black and white GARAGE office contact collage"
    },
    emailLabel: "Email",
    addressLabel: "Address",
    formLabel: "Send a message",
    nameLabel: "Name",
    emailFieldLabel: "Email",
    messageLabel: "Message",
    submitLabel: "Send message",
    submittingLabel: "Sending…",
    requiredMessage: "Please fill in your name, email, and message.",
    successMessage: "Thanks — your message is on its way.",
    genericErrorMessage: "Something went wrong. Please try again.",
    networkErrorMessage: "Network error. Please try again."
  }
};
