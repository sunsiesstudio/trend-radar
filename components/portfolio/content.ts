// Editable content for the portfolio homepage.
// Swap placeholder links (marked TODO) for the real ones when ready.

export const PROFILE = {
  name: "Martina Soles",
  role: "UX Researcher & Interaction Designer",
  subrole: "Cultural Intelligence · Creative Strategy",
  tagline: "I read culture before it becomes a trend, then design what comes next.",
  email: "martinasoles@gmail.com",
};

export const ABOUT_PARAGRAPHS = [
  "I'm a UX researcher and interaction designer with a background in cultural intelligence and a focus on creative strategy. The throughline in all of it is the same: catch a weak signal early, and turn it into a framework other people can actually act on.",
  "Most of my recent work sits at the edge of emerging technology — crypto and AI-native companies, plus enterprise clients in automotive, hospitality and telecoms who need to understand what's coming next. I keep building tools for exactly that; this site runs on one of them.",
  "I started out doing lifestyle, beauty and fashion work in my very first internship, and it's a space I'd love to do more of again — cultural intelligence reads a fragrance launch just as well as it reads a Layer 2 protocol.",
  "Alongside client work I write a Substack on emerging tech — it began as a weekly news roundup and has turned into longer essays (occasional rants) about where technology is actually taking us.",
];

export const ASIDE = "Off the clock: mum to a cat and a baby boy.";

export const SERVICES = [
  { title: "Cultural Intelligence & Trend Research", desc: "Reading weak signals across tech and culture before they're consensus." },
  { title: "UX Research", desc: "Interviews, usability testing, and ongoing research calls." },
  { title: "Interaction Design", desc: "Turning research into interfaces and product decisions." },
  { title: "Frameworks & Trend Reports", desc: "Structured tools that make a client's team faster at spotting what's next." },
  { title: "Workshops & Facilitation", desc: "Leading teams through research synthesis and strategy sessions." },
  { title: "Creative Strategy Consulting", desc: "Positioning and concept direction for brands entering new territory." },
];

export type CaseStudy = {
  id: string;
  category: string;
  title: string;
  client?: string;
  description: string;
  tags: string[];
  href?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "be-in-crypto",
    category: "Emerging Tech",
    title: "Brand design & rebrand",
    client: "Be In Crypto",
    description: "Brand identity work for a crypto-native media company navigating a fast-moving, trust-sensitive market.",
    tags: ["Crypto", "Brand Design", "Rebrand"],
  },
  {
    id: "ai-native",
    category: "Emerging Tech",
    title: "UX research for AI-native products",
    description: "Research calls and interaction design for early-stage AI companies figuring out how people actually want to work with their tools.",
    tags: ["AI", "UX Research", "Interaction Design"],
  },
  {
    id: "guestline",
    category: "Industry Innovation",
    title: "Product design & case studies",
    client: "Guestline",
    description: "Product design work in hospitality tech — translating operator needs into usable software.",
    tags: ["Hospitality", "Product Design"],
  },
  {
    id: "industry-research",
    category: "Industry Innovation",
    title: "Strategy & research across automotive and telecoms",
    description: "Cultural intelligence and trend research for enterprise clients tracking shifts in mobility and connectivity.",
    tags: ["Automotive", "Telecoms", "Strategy"],
  },
  {
    id: "emotional-privacy",
    category: "Speculative & R&D",
    title: "End of Emotional Privacy",
    description: "A speculative wearable bodysuit that reads emotion — researched and designed to provoke a conversation about where affective computing is headed.",
    tags: ["Speculative Design", "Wearables", "Research"],
  },
  {
    id: "phobos",
    category: "Speculative & R&D",
    title: "Phobos",
    description: "Speculative design concept exploring emerging tech's edges.",
    tags: ["Speculative Design"],
  },
  {
    id: "sunsies",
    category: "Products & Ventures",
    title: "Sunsies — 3D-printed home decor",
    description: "A shop I started designing and 3D-printing home decor objects, born out of the same hands-on curiosity that drives the research work.",
    tags: ["3D Printing", "Product", "Founder"],
  },
  {
    id: "augmented-rarity",
    category: "Products & Ventures",
    title: "Augmented Rarity — tools & trend intelligence",
    description: "My own practice for building trend-research tools. The signal radar this site links to is one of them.",
    tags: ["Tools Building", "Trend Research"],
    href: "/radar",
  },
];

export const SPEAKING = [
  "Podcast conversation on emerging tech and culture",
  "Podcast conversation on creative strategy",
  "Industry summit talk",
  "Course guest lecture",
];

// TODO: replace with your real Substack URL
export const SUBSTACK_URL = "#";
// TODO: replace with your real LinkedIn URL
export const LINKEDIN_URL = "#";
