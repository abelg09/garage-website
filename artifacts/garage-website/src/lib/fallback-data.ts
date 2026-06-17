import type { GarageContent } from "./types";

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
  reviews: [
    {
      id: "review-ananya",
      quote: "GARAGE brought a scrappy, fearless energy to our campaign. The kind of agency that actually thinks before it executes — rare and necessary.",
      reviewer: "Ananya Kapoor",
      role: "CMO, Grameen Kulfi",
      initials: "AK"
    },
    {
      id: "review-rohit",
      quote: "The team understood the brand before they understood the brief. The work felt like it came from inside the company, not outside it.",
      reviewer: "Rohit Mehta",
      role: "VP Brand, Johnson Consumer",
      initials: "RM"
    },
    {
      id: "review-priya",
      quote: "What impressed us most was the restraint. GARAGE knows when to be loud and when to let the product breathe. That discipline is hard to find.",
      reviewer: "Priya Nair",
      role: "Head of Marketing, IFB Industries",
      initials: "PN"
    },
    {
      id: "review-siddharth",
      quote: "Every brief we gave them came back sharper. They don't just answer the question — they find the better question underneath it.",
      reviewer: "Siddharth Rao",
      role: "Brand Lead, Tata Consumer",
      initials: "SR"
    },
    {
      id: "review-meera",
      quote: "The Jameson campaign was the most creatively confident work our brand has run in five years. GARAGE delivered without ego.",
      reviewer: "Meera Iyer",
      role: "Marketing Director, Pernod Ricard",
      initials: "MI"
    },
    {
      id: "review-karan",
      quote: "They move fast and still get it right. In a category crowded with slow agencies, GARAGE is a breath of actual fresh air.",
      reviewer: "Karan Malhotra",
      role: "Co-founder, Plum Goodness",
      initials: "KM"
    }
  ],
  clients: [
    "Grameen Kulfi",
    "H&R Johnson",
    "Croma",
    "Nippon India Mutual Fund",
    "Tata Sons",
    "Kalpa-Taru",
    "Jameson",
    "Marvel",
    "Senco Gold & Diamonds",
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
      tier: "leader",
      portrait: { src: "/crew/ashish.jpg", alt: "Ashish Chakravarty portrait" },
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
      portrait: { src: "/crew/swati.jpg", alt: "Swati Bobde portrait" },
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
      portrait: { src: "/crew/bryan.jpg", alt: "Bryan Elijah portrait" },
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
      portrait: { src: "/crew/utsav.jpg", alt: "Utsav Shinde portrait" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "rujvi-sankpal",
      name: "Rujvi Sankpal",
      role: "Art Director",
      tier: "team",
      portrait: { src: "/crew/rujvi.jpg", alt: "Rujvi Sankpal portrait" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "aniket-sharma",
      name: "Aniket Sharma",
      role: "Copywriter",
      tier: "team",
      portrait: { src: "/crew/aniket.jpg", alt: "Aniket Sharma portrait" },
      bio: ["Copywriter at Garage Worldwide."]
    },
    {
      id: "vedant-sarda",
      name: "Vedant Sarda",
      role: "Copywriter",
      tier: "team",
      portrait: { src: "/crew/vedant.jpg", alt: "Vedant Sarda portrait" },
      bio: ["Copywriter at Garage Worldwide."]
    },
    {
      id: "shay-dsouza",
      name: "Shay D\u2019Souza",
      role: "Account Executive",
      tier: "team",
      portrait: { src: "/crew/shay.jpg", alt: "Shay D\u2019Souza portrait" },
      bio: ["Account Executive at Garage Worldwide."]
    },
    {
      id: "mobaiyana-parveen",
      name: "Mobaiyana Parveen",
      role: "Copywriter",
      tier: "team",
      portrait: { src: "/crew/mobaiyana.jpg", alt: "Mobaiyana Parveen portrait" },
      bio: ["Copywriter at Garage Worldwide."]
    },
    {
      id: "aryan-sunil",
      name: "Aryan Sunil",
      role: "Junior Visualiser",
      tier: "team",
      portrait: { src: "/crew/aryan.jpg", alt: "Aryan Sunil portrait" },
      bio: ["Junior Visualiser at Garage Worldwide."]
    },
    {
      id: "pranali-pawar",
      name: "Pranali Pawar",
      role: "Sr. Account Executive",
      tier: "team",
      portrait: { src: "/crew/pranali.jpg", alt: "Pranali Pawar portrait" },
      bio: ["Sr. Account Executive at Garage Worldwide."]
    },
    {
      id: "tanvi-mahabre",
      name: "Tanvi Mahabre",
      role: "Art Director",
      tier: "team",
      portrait: { src: "/crew/tanvi.jpg", alt: "Tanvi Mahabre portrait" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "kyle-misquitta",
      name: "Kyle Misquitta",
      role: "Account Executive",
      tier: "team",
      portrait: { src: "/crew/kyle.jpg", alt: "Kyle Misquitta portrait" },
      bio: ["Account Executive at Garage Worldwide."]
    },
    {
      id: "samir-pinzara",
      name: "Samir Pinzara",
      role: "Account Executive",
      tier: "team",
      portrait: { src: "/crew/samir.jpg", alt: "Samir Pinzara portrait" },
      bio: ["Account Executive at Garage Worldwide."]
    },
    {
      id: "adwait-gurav",
      name: "Adwait Gurav",
      role: "Art Director",
      tier: "team",
      portrait: { src: "/crew/adwait.jpg", alt: "Adwait Gurav portrait" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "saniya-jadhav",
      name: "Saniya Jadhav",
      role: "Art Director",
      tier: "team",
      portrait: { src: "/crew/saniya.jpg", alt: "Saniya Jadhav portrait" },
      bio: ["Art Director at Garage Worldwide."]
    },
    {
      id: "christine",
      name: "Christine",
      role: "Team",
      tier: "team",
      portrait: { src: "/crew/christine.jpg", alt: "Christine portrait" },
      bio: ["Team member at Garage Worldwide."]
    },
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
