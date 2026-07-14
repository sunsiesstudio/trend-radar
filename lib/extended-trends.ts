import { Trend, Signal } from "@/types";

export const TOPIC_COLORS: Record<string, string> = {
  fashion:           "#FF8BB4",
  beauty:            "#B6D693",
  lifestyle:         "#8C93C7",
  gaming:            "#78C9A8",
  wellness:          "#A7D47C",
  "food-tech":       "#FD8326",
  "mental-health":   "#C4A0CE",
  sustainability:    "#53A373",
  tech:              "#FFD65C",
  health:            "#FFB04A",
  "interior-design": "#C4A0CE",
  travel:            "#78C9A8",
  fitness:           "#A7D47C",
  music:             "#FF8BB4",
  art:               "#8C93C7",
  luxury:            "#FFD65C",
  food:              "#FD8326",
  skincare:          "#B6D693",
  sport:             "#78C9A8",
  creativity:        "#FF8BB4",
  photography:       "#8C93C7",
  film:              "#FFD65C",
  branding:          "#FD8326",
  fragrance:         "#C4A0CE",
  jewellery:         "#FFD65C",
  retail:            "#FD8326",
  social:            "#78C9A8",
  education:         "#A7D47C",
  dating:            "#FF8BB4",
  pets:              "#A7D47C",
  finance:           "#FFD65C",
  parenting:         "#C4A0CE",
  kids:              "#78C9A8",
  nightlife:         "#8C93C7",
  mobility:          "#FFB04A",
  spirituality:      "#C4A0CE",
  coffee:            "#FD8326",
  ai:                "#FFD65C",
  biotech:           "#53A373",
  robotics:          "#8C93C7",
  "climate-tech":    "#A7D47C",
  space:             "#C4A0CE",
  web3:              "#FFB04A",
  "ar-vr":           "#78C9A8",
  fintech:           "#FD8326",
  medtech:           "#FF8BB4",
  "smart-home":      "#B6D693",
  cybersecurity:     "#8C93C7",
  "synthetic-biology":"#53A373",
  "future-of-work":  "#FFD65C",
};

export const TOPIC_DESCRIPTIONS: Record<string, string> = {
  fashion:           "Fashion is where tech shows up on your body first. AI is already doing the moodboard in an afternoon. AR is making the fitting room optional. And your avatar outfit now matters as much as your real one.",
  beauty:            "Beauty is where biotech gets genuinely interesting. Microbiome science, fermented actives, exosome serums: the lab is the new beauty counter. The brands that understand biology are winning.",
  lifestyle:         "Lifestyle is where tech disappears into habit. Wearables, spatial interfaces, digital identity: all becoming invisible infrastructure for how people actually live.",
  gaming:            "Gaming is a live test for how attention and scarcity work. Drop mechanics, NPC aesthetics, virtual status objects: a whole generation learning new rules for desire.",
  wellness:          "Wellness has fully industrialised. Cold exposure, cortisol management, biometric feedback: all product categories now.",
  "food-tech":       "Functional food is becoming a lifestyle prop. Adaptogens, nootropics, personalised microbiome plans: part of the visible, curated self now.",
  "mental-health":   "Mental health language has crossed into mainstream product design. Dopamine loops, therapeutic aesthetics, nervous system regulation: product briefs now, not just clinical concepts.",
  sustainability:    "Sustainability is table stakes, not a USP anymore. The frontier is material provenance, digital product passports, and circular models that actually close the loop.",
  tech:              "Tech is the thread underneath every trend on this board. The question is never whether it is involved, it's which tech becomes invisible fastest.",
  health:            "Consumer health is dissolving the boundary between medical and lifestyle. At-home diagnostics, biometric wearables, longevity clinics: information that used to sit behind a doctor's appointment, now in your hands.",
  "interior-design": "Interior design is where spatial computing and material science are colliding. AI is doing the moodboard in hours, AR is replacing the showroom, and smart materials are turning the home into a living system.",
  travel:            "Travel is where AI personalisation, immersive tech, and sustainability pressure are all landing at once. The itinerary is becoming intelligent. The destination is becoming augmented.",
  fitness:           "Fitness is being quantified at the biological level. Continuous glucose monitors, HRV tracking, AI programming: the body as a data system is the dominant consumer health metaphor right now.",
  music:             "Music is the first creative category where AI generation reached genuine consumer adoption. Suno, Udio, and spatial audio are restructuring how music is made, heard, and monetised.",
  art:               "Art is where AI legitimacy battles are happening in real time. Christie's, MoMA, and major galleries are all taking positions. The phygital art object is becoming a new category entirely.",
  luxury:            "Luxury is where tech is being used to deepen exclusivity, not democratise it. Blockchain provenance, AI personalisation, and spatial experiences are all tools for stratification, not access.",
  food:              "Food is where biotech, AI, and sustainability are all landing simultaneously. Cultivated protein, AI-matched flavour, and personalised nutrition are reshaping what eating means.",
  skincare:          "Skincare is where biotech is most commercially advanced. Microbiome science, exosomes, AI-matched formulations: the gap between pharmaceutical and cosmetic is closing fast.",
  sport:             "Sport is where wearable biometrics, AI coaching, and immersive viewing are colliding. The boundary between professional training and consumer self-optimisation is dissolving.",
  creativity:        "Creativity is being turbocharged by AI, and the creative industries are having to figure out what that means for authorship, value, and workflow. The tools are ahead of the ethics.",
  photography:       "Photography is in a legitimacy crisis and a technical renaissance at the same time. AI generation, computational photography, and synthetic imagery are rewriting what a photograph means.",
  film:              "Film and video production is being structurally changed by AI. De-aging, virtual production, AI scripting tools, and algorithmic distribution are rewriting every phase of the process.",
  branding:          "Branding is where AI is hitting creative agencies first. Generative identity systems, AI-driven consistency, and dynamic brand expression are replacing static guidelines.",
  dating:            "Dating is being restructured by AI at every layer. Apps are adding AI coaches, conversation assistants, and compatibility models. The question is what happens to desire when the algorithm optimises for it.",
  pets:              "Pets have been humanised to the point where they are a consumer category as sophisticated as wellness. Smart feeders, pet wearables, gut-health supplements, DNA testing: the pet economy is running the same playbook as human health.",
  finance:           "Consumer finance is in a structural shift. BNPL rewired spending behaviour. Crypto went mainstream and crashed and is back. AI-powered budgeting and investing tools are making financial decisions feel personal for the first time.",
  parenting:         "Parenting culture has industrialised. Baby tech, screen-time management apps, early learning AI, parental monitoring wearables: the anxious parent is a very specific consumer, and the market knows it.",
  kids:              "Gen Alpha is the first generation for whom AI, spatial computing, and digital-physical blur are just baseline reality. They are already a consumer force, and the brands that get them now are building decades of loyalty.",
  nightlife:         "Nightlife is having a reinvention moment. Sober socialising, immersive experiences, AI-curated playlists, spatial sound design: the night out is becoming a multi-sensory product as much as a social ritual.",
  mobility:          "Urban mobility is being renegotiated. EVs, e-bikes, scooters, and autonomous vehicles are all competing for the same space. The car is becoming a software product and the city is the UI.",
  spirituality:      "Modern spirituality has become a consumer category. Crystals, astrology apps, sound healing, micro-dosing retreats: all intersecting with wellness, beauty, and tech in ways that are commercially serious.",
  coffee:            "Coffee is a bellwether for consumer taste. Specialty, functional, adaptogenic: each wave has pulled the category further from commodity toward lifestyle signal. The third wave has a fourth one behind it.",
  ai:                "AI has moved from research lab to consumer product faster than any technology in history. The question is no longer whether AI will change your industry — it's which layer of your stack gets replaced first and by whom.",
  biotech:           "Biotech is crossing out of the clinic and into the consumer. GLP-1 drugs, gene editing, personalised diagnostics, and longevity science are all arriving in the mainstream at the same time. The body is becoming a design surface.",
  robotics:          "Robotics is finally leaving the factory floor. Humanoid robots, AI-powered logistics, autonomous agriculture, and consumer companion bots are all in commercial deployment. The labour question is not theoretical anymore.",
  "climate-tech":    "Climate tech is the biggest capital story of the decade. Carbon markets, green hydrogen, next-gen batteries, and climate adaptation infrastructure are all attracting serious money. The tension is between speed and greenwash.",
  space:             "Space has been privatised and the pace has changed completely. Satellite constellations, lunar logistics, space tourism, and in-orbit manufacturing are all live commercial categories. The overview effect is becoming a product.",
  web3:              "Web3 had its hype crash and is rebuilding on actual use cases. Stablecoins, tokenised real-world assets, on-chain loyalty, and AI-crypto convergence are where the serious builders went after the speculation burned out.",
  "ar-vr":           "Spatial computing is past the headset wars and into the platform question. Apple Vision Pro, Meta Quest, and AR glasses from every major hardware maker are fighting for the interface layer that sits between you and the world.",
  fintech:           "Fintech has eaten the bank from the edges and is now going after the core. Embedded finance, AI-underwriting, crypto-native banking, and open banking APIs are restructuring who controls your money and how.",
  medtech:           "Medical technology is accelerating into consumer hands. Continuous glucose monitors, AI diagnostics, at-home lab testing, and surgical robotics are all crossing the line between clinical and personal. The patient is becoming the product.",
  "smart-home":      "The smart home is moving from gadgets to infrastructure. AI-native home OS, matter-compatible devices, energy management systems, and ambient computing are turning the home into a responsive, learning environment.",
  cybersecurity:     "Cybersecurity is a growth category driven by threat. AI-generated attacks, deepfake fraud, critical infrastructure vulnerabilities, and post-quantum cryptography are pushing security from IT budget line to board-level priority.",
  "synthetic-biology": "Synthetic biology is programming living systems. Biofabricated materials, lab-grown leather, engineered microbiomes, and DNA data storage are all coming out of the lab. The living factory is the next industrial revolution.",
  "future-of-work":  "Work is being structurally redesigned by AI, remote infrastructure, and generational expectation shifts. The office, the career ladder, and the 40-hour week are all being renegotiated simultaneously.",
};

const TOPIC_ALIASES: Record<string, string> = {
  // food
  "food tech":        "food-tech",
  "foodtech":         "food-tech",
  "food technology":  "food-tech",
  // mental health
  "mental health":    "mental-health",
  "mentalhealth":     "mental-health",
  "mind":             "mental-health",
  "mindfulness":      "mental-health",
  // gaming
  "video games":      "gaming",
  "esports":          "gaming",
  "games":            "gaming",
  "game":             "gaming",
  // health
  "health tech":      "health",
  "healthtech":       "health",
  "well-being":       "wellness",
  "wellbeing":        "wellness",
  // sustainability
  "eco":              "sustainability",
  "environment":      "sustainability",
  "green":            "sustainability",
  "climate":          "sustainability",
  // tech (generic fallback only)
  "technology":       "tech",
  // ai
  "artificial intelligence": "ai",
  "machine learning": "ai",
  "llm":              "ai",
  "generative ai":    "ai",
  "gpt":              "ai",
  // biotech
  "biotech":          "biotech",
  "biotechnology":    "biotech",
  "bio":              "biotech",
  "longevity":        "biotech",
  // robotics
  "robots":           "robotics",
  "automation":       "robotics",
  "autonomous":       "robotics",
  "humanoid":         "robotics",
  // climate tech
  "climate tech":     "climate-tech",
  "cleantech":        "climate-tech",
  "clean tech":       "climate-tech",
  "green tech":       "climate-tech",
  "net zero":         "climate-tech",
  "carbon":           "climate-tech",
  // space
  "space tech":       "space",
  "aerospace":        "space",
  "satellites":       "space",
  "astronaut":        "space",
  // web3
  "crypto":           "web3",
  "blockchain":       "web3",
  "nft":              "web3",
  "defi":             "web3",
  "ethereum":         "web3",
  "bitcoin":          "web3",
  "tokens":           "web3",
  // ar / vr
  "ar":               "ar-vr",
  "vr":               "ar-vr",
  "xr":               "ar-vr",
  "spatial computing":"ar-vr",
  "mixed reality":    "ar-vr",
  "metaverse":        "ar-vr",
  "headset":          "ar-vr",
  // fintech
  "fintech":          "fintech",
  "payments":         "fintech",
  "banking":          "fintech",
  "investing":        "fintech",
  "money":            "fintech",
  "insurtech":        "fintech",
  // medtech
  "medtech":          "medtech",
  "medical tech":     "medtech",
  "diagnostics":      "medtech",
  "wearables":        "medtech",
  // smart home
  "smart home":       "smart-home",
  "iot":              "smart-home",
  "home automation":  "smart-home",
  "connected home":   "smart-home",
  // cybersecurity
  "cyber":            "cybersecurity",
  "hacking":          "cybersecurity",
  "privacy":          "cybersecurity",
  "security":         "cybersecurity",
  // synthetic biology
  "synthetic biology":"synthetic-biology",
  "synbio":           "synthetic-biology",
  "biofabrication":   "synthetic-biology",
  "lab grown":        "synthetic-biology",
  // future of work
  "future of work":   "future-of-work",
  "remote work":      "future-of-work",
  "work":             "future-of-work",
  "workplace":        "future-of-work",
  "hr tech":          "future-of-work",
  // interior design
  "interior design":  "interior-design",
  "interiors":        "interior-design",
  "home design":      "interior-design",
  "home decor":       "interior-design",
  "decoration":       "interior-design",
  "decor":            "interior-design",
  "home":             "interior-design",
  "architecture":     "interior-design",
  "design":           "interior-design",
  // travel
  "travelling":       "travel",
  "tourism":          "travel",
  "hospitality":      "travel",
  "hotels":           "travel",
  // fitness / sport
  "sports":           "fitness",
  "sport":            "fitness",
  "exercise":         "fitness",
  "gym":              "fitness",
  "workout":          "fitness",
  "running":          "fitness",
  "training":         "fitness",
  "athletics":        "fitness",
  // music
  "audio":            "music",
  "sound":            "music",
  // art
  "arts":             "art",
  "creativity":       "creativity",
  // skincare
  "skin":             "skincare",
  "skin care":        "skincare",
  "dermatology":      "skincare",
  // luxury
  "high end":         "luxury",
  "haute couture":    "luxury",
  "premium":          "luxury",
  // food (general)
  "cooking":          "food",
  "culinary":         "food",
  "cuisine":          "food",
  "gastronomy":       "food",
  // creativity
  "creative":         "creativity",
  "creative industries": "creativity",
  "illustration":     "creativity",
  "graphic design":   "creativity",
  "visual art":       "art",
  // photography
  "photo":            "photography",
  "photographer":     "photography",
  "photos":           "photography",
  // film
  "cinema":           "film",
  "movies":           "film",
  "movie":            "film",
  "video":            "film",
  "production":       "film",
  "tv":               "film",
  "television":       "film",
  "streaming":        "film",
  // branding
  "brand":            "branding",
  "logo":             "branding",
  "marketing":        "branding",
  "advertising":      "branding",
  // fragrance
  "perfume":          "fragrance",
  "scent":            "fragrance",
  "parfum":           "fragrance",
  "aroma":            "fragrance",
  // jewellery
  "jewelry":          "jewellery",
  "accessories":      "jewellery",
  "accessory":        "jewellery",
  "gems":             "jewellery",
  "diamonds":         "jewellery",
  "watches":          "jewellery",
  // retail
  "ecommerce":        "retail",
  "e-commerce":       "retail",
  "shopping":         "retail",
  "commerce":         "retail",
  "store":            "retail",
  "fashion retail":   "retail",
  // social media
  "social media":     "social",
  "instagram":        "social",
  "tiktok":           "social",
  "influencer":       "social",
  "content":          "social",
  "creator":          "social",
  // education
  "learning":         "education",
  "school":           "education",
  "university":       "education",
  "courses":          "education",
  // dating
  "relationships":    "dating",
  "romance":          "dating",
  "love":             "dating",
  "apps dating":      "dating",
  // pets
  "pet":              "pets",
  "dogs":             "pets",
  "cats":             "pets",
  "animal":           "pets",
  // finance (general personal finance)
  "personal finance": "finance",
  "bnpl":             "finance",
  "stock market":     "stock",
  // parenting
  "baby":             "parenting",
  "family":           "parenting",
  "mothers":          "parenting",
  "fathers":          "parenting",
  // kids
  "children":         "kids",
  "gen alpha":        "kids",
  "youth":            "kids",
  "toys":             "kids",
  // nightlife
  "clubs":            "nightlife",
  "events":           "nightlife",
  "entertainment":    "nightlife",
  "parties":          "nightlife",
  // mobility
  "ev":               "mobility",
  "electric vehicles":"mobility",
  "transport":        "mobility",
  "cars":             "mobility",
  "urban":            "mobility",
  // spirituality
  "astrology":        "spirituality",
  "crystals":         "spirituality",
  "healing":          "spirituality",
  // coffee
  "cafe":             "coffee",
  "cafes":            "coffee",
  "espresso":         "coffee",
  "specialty coffee": "coffee",
};

export function normaliseTopicKey(input: string): string {
  const clean = input.toLowerCase().trim().replace(/\s+/g, " ");
  const aliased = TOPIC_ALIASES[clean] ?? clean;
  // Always hyphenate so keys match what the API route stores in trend.topics
  return aliased.replace(/\s+/g, "-");
}

// ─── Library ──────────────────────────────────────────────────────────────────

export const EXTENDED_TRENDS: Trend[] = [

  // ── GAMING ──────────────────────────────────────────────────────────────────
  {
    id: "gaming-npc-aesthetics",
    name: "NPC Aesthetics",
    description: "Video game NPC aesthetics have crossed from ironic meme into genuine fashion direction. That blank affect, the uniform dressing, the repetition, brands are actually running with it now.",
    color: "#78C9A8",
    topics: ["gaming", "fashion", "lifestyle"],
    relevanceScore: 71,
    redditQuery: "NPC aesthetic fashion streetwear",
    newsQuery: "NPC aesthetic fashion trend",
    position: { x: 368, y: 1968 },
    whyRelevant: "When a gaming aesthetic becomes a fashion direction it signals that gaming culture has enough mainstream reach to influence taste, not just consume product.",
    trajectory: "NPC aesthetics will peak as irony and cross into earnest adoption within 12 months, the same path normcore and gorpcore took.",
    nextSteps: [],
    brandMoves: [
      { label: "A-Cold-Wall* releases a 'System NPC' capsule referencing game-character uniformity in wearable garments", url: "https://a-cold-wall.com" },
      { label: "Nike drops a limited Air Max colourway inspired by default NPC character palettes, sells out in under an hour", url: "https://nike.com" },
      { label: "Bottega Veneta's 2025 collection uses deliberately blank, interchangeable silhouettes that critics read as NPC homage", url: "https://bottegaveneta.com" },
      { label: "Roblox and Zara co-create wearable digital-to-physical NPC-style looks available in-game and in-store simultaneously", url: "https://zara.com" },
    ],
  },
  {
    id: "gaming-drop-economy",
    name: "The Drop Economy",
    description: "Gaming rewired how a generation thinks about scarcity and timing. Loot boxes, seasonal drops, battle pass exclusives: all of it trained people to feel urgency in a very specific way, and fashion is borrowing those same mechanics.",
    color: "#FFD65C",
    topics: ["gaming", "fashion", "lifestyle"],
    relevanceScore: 65,
    redditQuery: "gaming limited drop fashion streetwear scarcity",
    newsQuery: "gaming drop model fashion retail strategy",
    position: { x: 948, y: 1968 },
    whyRelevant: "A generation conditioned by battle passes and FOMO-engineered scarcity in games is bringing those expectations to physical retail.",
    trajectory: "Physical retail will continue borrowing gaming drop mechanics, waitlists, countdown timers, gamified loyalty, until the model is table stakes.",
    nextSteps: [],
    brandMoves: [
      { label: "Supreme's weekly Thursday drop model is copied by Palace, Kith, and dozens of streetwear brands globally — the drop format becomes retail default", url: "https://supremenewyork.com" },
      { label: "Adidas Confirmed app uses battle-pass-style waitlists and raffles for Yeezy and Originals releases, driving millions of app installs", url: "https://adidas.com/us/confirmed" },
      { label: "Louis Vuitton x League of Legends collaboration sells capsule via countdown drop mechanic, merging luxury and gaming scarcity logic", url: "https://louisvuitton.com" },
      { label: "SNKRS app by Nike employs draw and countdown drop mechanics borrowed directly from gaming loot systems, standard for all high-demand releases", url: "https://nike.com/launch" },
    ],
  },

  // ── WELLNESS ────────────────────────────────────────────────────────────────
  {
    id: "wellness-cold-ritual",
    name: "The Cold Ritual",
    description: "Ice baths, cold plunge, and breathwork have crossed from elite athlete recovery into mainstream lifestyle ritual, spawning a hardware and hospitality category.",
    color: "#A7D47C",
    topics: ["wellness", "lifestyle", "health"],
    relevanceScore: 68,
    redditQuery: "cold plunge ice bath wellness routine lifestyle",
    newsQuery: "cold exposure wellness trend consumer",
    position: { x: 1528, y: 1968 },
    whyRelevant: "Cold exposure has become a lifestyle signal, something people display as much as practice.",
    trajectory: "The cold ritual moves from boutique wellness into hotel amenity, workplace wellbeing, and eventually home design as a standard fixture.",
    nextSteps: [],
    brandMoves: [
      { label: "Plunge launches a home cold plunge tub at $4,990, reaching $60M revenue in its first full year of consumer sales", url: "https://plunge.com" },
      { label: "Wim Hof Method partners with luxury hotel chains including Six Senses to offer guided cold immersion retreats", url: "https://wimhofmethod.com" },
      { label: "lululemon introduces a cold-therapy apparel and accessory line featuring insulated post-plunge wraps and robes", url: "https://lululemon.com" },
      { label: "Lego-owner Kirkbi invests in ice-bath startup Monk Manual, validating the category for mainstream wellness investors", url: "https://plunge.com" },
      { label: "Chelsea FC installs branded cold-plunge suites at Stamford Bridge sold as premium fan experience packages", url: "https://chelseafc.com" },
    ],
  },
  {
    id: "wellness-cortisol",
    name: "Cortisol Culture",
    description: "Stress management is moving from self-help into product design: brands building entire lines around the science of cortisol reduction, from supplements to workwear.",
    color: "#FF8BB4",
    topics: ["wellness", "beauty", "lifestyle"],
    relevanceScore: 62,
    redditQuery: "cortisol stress management product skincare wellness",
    newsQuery: "cortisol reduction beauty wellness product trend",
    position: { x: -32, y: 2568 },
    whyRelevant: "When a biological marker becomes a product brief, it signals that a health concept has crossed into consumer mainstream.",
    trajectory: "Cortisol will become a marketing term the way 'collagen' did, used across categories. Brands that build genuine science in early own the authority position.",
    nextSteps: [],
    brandMoves: [
      { label: "Moon Juice launches Magnesi-Om and SuperYou cortisol-support supplements, building a $50M+ adaptogens line marketed explicitly around stress hormones", url: "https://moonjuice.com" },
      { label: "Hims & Hers adds cortisol management as a clinical category with telehealth consults and prescription adaptogens", url: "https://forhims.com" },
      { label: "The Nue Co builds an entire brand platform around cortisol, launching Destress and Prebiotic + Probiotic lines for the 'cortisol cocktail' moment", url: "https://thenueco.com" },
      { label: "Whoop 4.0 adds a cortisol-proxy 'stress score' to its daily readiness metrics, making the hormone readable on the wrist", url: "https://whoop.com" },
    ],
  },

  // ── FOOD-TECH ───────────────────────────────────────────────────────────────
  {
    id: "foodtech-functional",
    name: "Functional Food as Accessory",
    description: "Adaptogenic drinks, nootropic snacks, and precision nutrition products are becoming visible lifestyle props, displayed and carried like signifiers of an optimised life.",
    color: "#FD8326",
    topics: ["food-tech", "wellness", "lifestyle"],
    relevanceScore: 59,
    redditQuery: "adaptogenic drinks nootropic functional food lifestyle",
    newsQuery: "functional beverage lifestyle brand trend",
    position: { x: 548, y: 2568 },
    whyRelevant: "When food becomes a signifier rather than just sustenance, it enters fashion logic, scarcity, visible display, brand affiliation.",
    trajectory: "Functional food will follow the same premiumisation arc as coffee, moving from health-store niche to everyday premium.",
    nextSteps: [],
    brandMoves: [
      { label: "Erewhon x Hailey Bieber 'Strawberry Glaze Skin Smoothie' collaboration sells out in hours — the smoothie as status object", url: "https://erewhonmarket.com" },
      { label: "Liquid Death reaches $263M revenue, proving water can carry brand identity as strong as energy drinks or soda", url: "https://liquiddeath.com" },
      { label: "Athletic Brewing non-alcoholic craft beer becomes the visible drink of choice at fitness events, tech conferences, and premium workplaces", url: "https://athleticbrewing.com" },
      { label: "Kin Euphorics launches a nootropic social drink positioned for display at dinner parties and boutique hotel minibars", url: "https://kineuphoric.com" },
      { label: "Gorilla Mind and AG1 (Athletic Greens) dominate podcast-to-purchase funnels, turning supplement shakers into gym-bag identity markers", url: "https://drinkag1.com" },
    ],
  },
  {
    id: "foodtech-precision",
    name: "Precision Nutrition",
    description: "DNA- and microbiome-based personalised nutrition is crossing from clinical into consumer, with testing kits and AI-generated meal plans reaching early-majority adoption.",
    color: "#B6D693",
    topics: ["food-tech", "wellness", "health"],
    relevanceScore: 64,
    redditQuery: "personalized nutrition DNA microbiome diet app",
    newsQuery: "precision nutrition consumer personalised diet technology",
    position: { x: 1128, y: 2568 },
    whyRelevant: "Personalisation is the most powerful word in consumer marketing right now, and precision nutrition delivers it at a biological level.",
    trajectory: "Genomic sequencing costs dropped 90% in five years. Within 24 months, DNA-based nutrition guidance will be available at mass market price points.",
    nextSteps: [],
    brandMoves: [
      { label: "Zoe raises $45M Series B to expand its microbiome-based personalised nutrition service to US and Europe", url: "https://joinzoe.com" },
      { label: "Viome offers full-body intelligence tests combining gut microbiome, blood, and gene expression for hyper-personalised supplement plans", url: "https://viome.com" },
      { label: "Nestlé launches Nestlé Health Science division specifically targeting precision nutrition and microbiome-based products", url: "https://nestlehealthscience.com" },
      { label: "Day Two brings CGM-based personalised nutrition out of diabetes management into consumer wellness subscriptions", url: "https://daytwo.com" },
    ],
  },

  // ── MENTAL-HEALTH ───────────────────────────────────────────────────────────
  {
    id: "mentalhealth-dopamine",
    name: "Dopamine Design",
    description: "Product designers and brand strategists are explicitly borrowing the neuroscience of reward and pleasure, designing for dopamine responses rather than functional utility.",
    color: "#C4A0CE",
    topics: ["mental-health", "lifestyle", "beauty"],
    relevanceScore: 73,
    redditQuery: "dopamine design product UX reward psychology consumer",
    newsQuery: "dopamine design retail experience neuroscience brand",
    position: { x: 1708, y: 2568 },
    whyRelevant: "Dopamine design is neuroscience applied to commercial psychology. Making it explicit as a design brief is a competitive edge.",
    trajectory: "Dopamine design moves from UX/digital into physical retail and product design as a standard brief element.",
    nextSteps: [],
    brandMoves: [
      { label: "Glossier's flagship store redesign uses dopamine dressing colour theory throughout, bright pinks and greens explicitly to trigger positive emotional states", url: "https://glossier.com" },
      { label: "Duolingo's product team publicly describes streak mechanics and confetti animations as 'dopamine loops' — transparency about the design intent drives press and user growth", url: "https://duolingo.com" },
      { label: "Jacquemus designs unboxing experiences and campaign visuals explicitly for dopaminergic colour response, driving viral shareability", url: "https://jacquemus.com" },
      { label: "BeReal's anti-dopamine design (no likes, no filters) becomes its marketing hook — the counterpoint validates the trend's centrality", url: "https://bereal.com" },
    ],
  },
  {
    id: "mentalhealth-therapeutic",
    name: "Therapeutic Aesthetics",
    description: "The visual and material language of therapy, softness, safety cues, earth tones, rejection of stimulation, is becoming a mainstream aesthetic in fashion and brand identity.",
    color: "#FFB04A",
    topics: ["mental-health", "lifestyle", "beauty"],
    relevanceScore: 67,
    redditQuery: "therapeutic aesthetic calm design wellness brand visual",
    newsQuery: "therapeutic aesthetics brand design trend calming",
    position: { x: 168, y: 3168 },
    whyRelevant: "Therapeutic aesthetics is a cultural response to digital overstimulation, a collective nervous system expressing a need for less.",
    trajectory: "Therapeutic aesthetics will peak as a conscious trend and then become baseline expectation, the same way 'clean beauty' moved from positioning to category standard.",
    nextSteps: [],
    brandMoves: [
      { label: "Aesop's store design philosophy — muted terracotta, botanical scent, deliberate quiet — becomes a retail benchmark for therapeutic sensory environments", url: "https://aesop.com" },
      { label: "Muji expands its global footprint on an explicit 'anti-stimulation' visual identity, earning premium positioning through restraint", url: "https://muji.com" },
      { label: "Headspace partners with Nike to design calming colour palettes and softer material textures into recovery-wear collections", url: "https://headspace.com" },
      { label: "Selfridges dedicates its 'Superself' wellness floor to therapeutic-aesthetic brands, curated around calm, texture, and sensory decompression", url: "https://selfridges.com" },
    ],
  },

  // ── INTERIOR DESIGN ─────────────────────────────────────────────────────────
  {
    id: "interiordesign-ai-spatial",
    name: "AI Spatial Design",
    description: "AI tools are collapsing the distance between brief and visualisation. Architects and interior designers use generative models to produce moodboards, renders, and spatial variations in hours rather than weeks. The process is accelerating; the skill set is changing.",
    color: "#8C93C7",
    topics: ["interior-design", "design", "tech"],
    relevanceScore: 74,
    redditQuery: "AI interior design architecture tools generative midjourney",
    newsQuery: "AI interior design tools spatial computing architecture",
    position: { x: 548, y: 3768 },
    whyRelevant: "Design is being unbundled from its production bottlenecks by AI. What used to require weeks of rendering time is now accessible to anyone with a prompt. Competition shifts from production quality to creative vision.",
    trajectory: "AI design tools will be standard in every studio within 24 months, not replacing designers but redefining what 'design work' actually is. Winners will be those who understand both the tool and the taste.",
    nextSteps: [],
    brandMoves: [
      { label: "Autodesk integrates Stable Diffusion-based rendering directly into Revit, putting AI visualisation inside the architect's existing workflow", url: "https://autodesk.com" },
      { label: "Interior AI raises seed funding to build an AI-generated room redesign tool reaching 3M users in its first six months", url: "https://interiorai.com" },
      { label: "Zaha Hadid Architects adopts generative AI for parametric form exploration, publishing case studies on AI-accelerated design development", url: "https://zaha-hadid.com" },
      { label: "Havenly integrates AI layout generation into its e-design service, reducing turnaround from two weeks to 48 hours", url: "https://havenly.com" },
    ],
  },
  {
    id: "interiordesign-ar-preview",
    name: "AR Interior Preview",
    description: "Augmented reality is making the 'place it before you buy it' experience standard across furniture and home categories. IKEA Place started it; now every major furniture brand has an AR layer, and spatial computing is pushing it into full room simulation.",
    color: "#FFB04A",
    topics: ["interior-design", "tech", "lifestyle"],
    relevanceScore: 67,
    redditQuery: "AR furniture interior design spatial computing room preview",
    newsQuery: "AR interior design furniture retail spatial commerce",
    position: { x: 1128, y: 3768 },
    whyRelevant: "Purchase hesitation in home categories is almost entirely driven by fit uncertainty. AR removes that barrier at the point of consideration. Brands that deploy it see return rates drop and conversion rise.",
    trajectory: "Apple Vision Pro and cheaper AR headsets will push spatial commerce in home design from novelty to expected default. Brands without it will feel like e-commerce without product photography.",
    nextSteps: [],
    brandMoves: [
      { label: "IKEA Place app reaches 30M downloads, proving AR room preview drives measurable conversion lift and reduces return rates", url: "https://ikea.com" },
      { label: "Wayfair's View in Room 3D AR feature cited as a key driver of its DTC e-commerce growth, reducing return rates by 22%", url: "https://wayfair.com" },
      { label: "Apple Vision Pro launch includes spatial shopping apps from Wayfair and Lowe's as day-one partners, validating room-scale AR retail", url: "https://apple.com/apple-vision-pro" },
      { label: "Houzz Pro AR tool allows designers to present full room simulations to clients in real time during consultation calls", url: "https://houzz.com/pro" },
    ],
  },
  {
    id: "interiordesign-smart-materials",
    name: "Smart & Biophilic Materials",
    description: "Material science and biotech are producing surfaces that actively respond to environments: self-cleaning textiles, mycelium insulation, living walls with integrated sensors. The home is becoming a biological and technological system.",
    color: "#53A373",
    topics: ["interior-design", "sustainability", "tech"],
    relevanceScore: 61,
    redditQuery: "smart materials biophilic design living walls sustainable interiors",
    newsQuery: "smart materials interior design biotech sustainable architecture",
    position: { x: 1708, y: 3768 },
    whyRelevant: "The intersection of material science and interior design is producing products that change the performance of spaces at a fundamental level. These are infrastructure innovations with aesthetic implications.",
    trajectory: "Smart and biophilic materials move from high-end commercial into residential premium within 3 years, driven by cost decreases and EU regulatory pressure on building materials.",
    nextSteps: [],
    brandMoves: [
      { label: "Ecovative Design scales mycelium packaging and insulation panels into premium interior design applications in collaboration with Ikea and Hermès", url: "https://ecovativedesign.com" },
      { label: "Interface Carpet launches carbon-negative carpet tiles made from bio-based materials, targeting LEED-certified commercial interiors", url: "https://interface.com" },
      { label: "Biohm develops mycelium insulation blocks as a building material, partnering with UK housebuilders on pilot residential projects", url: "https://biohm.co.uk" },
      { label: "Samsung SmartThings integrates with living wall systems from Naava to create air-quality-responsive biophilic installations for office design", url: "https://naava.io" },
    ],
  },

  // ── TRAVEL ──────────────────────────────────────────────────────────────────
  {
    id: "travel-ai-itinerary",
    name: "AI Travel Intelligence",
    description: "AI trip planners are replacing the travel agent and the listicle simultaneously. Real-time personalisation across flights, stays, and experiences is becoming the expectation, not the premium tier.",
    color: "#78C9A8",
    topics: ["travel", "tech", "lifestyle"],
    relevanceScore: 69,
    redditQuery: "AI travel planning itinerary app personalised",
    newsQuery: "AI travel planner personalised itinerary technology",
    position: { x: 168, y: 4368 },
    whyRelevant: "The friction cost of trip planning is collapsing. Brands that own the AI planning layer own the consideration moment, and that's where intent converts to booking.",
    trajectory: "Within 18 months AI travel planning will be table stakes. The differentiation moves to data quality, personalisation depth, and cross-category integration (loyalty, dining, experiences).",
    nextSteps: [],
    brandMoves: [
      { label: "Booking.com launches AI Trip Planner integrated into its app, enabling full itinerary generation with real-time pricing and booking in a single flow", url: "https://booking.com" },
      { label: "Airbnb's AI-powered search allows natural-language trip requests ('beach house for 6 with surf, May half-term') to return curated results", url: "https://airbnb.com" },
      { label: "Google Travel's Gemini integration enables conversational itinerary building across Maps, Hotels, and Flights simultaneously", url: "https://travel.google.com" },
      { label: "Tripadvisor launches an AI travel assistant that generates personalised day-by-day itineraries based on past reviews and preferences", url: "https://tripadvisor.com" },
    ],
  },
  {
    id: "travel-immersive-tourism",
    name: "Augmented Tourism",
    description: "AR overlays on real destinations, digital twin heritage sites, and AI-guided historical narratives are turning physical travel into a mixed-reality experience. Museums are the early movers; cities are following.",
    color: "#FFD65C",
    topics: ["travel", "tech", "art"],
    relevanceScore: 63,
    redditQuery: "AR tourism augmented reality travel destination heritage",
    newsQuery: "augmented reality tourism heritage sites digital experience",
    position: { x: 748, y: 4368 },
    whyRelevant: "Immersive tech is extending the value of physical destinations beyond what the eye can see, deepening engagement and increasing dwell time. Destinations that invest in AR layers become harder to replicate and easier to return to.",
    trajectory: "AR tourism moves from experimental museum projects into mainstream city tourism within 3 years, led by destinations with strong historical IP and high Chinese and Korean tourist flows (who have highest AR adoption).",
    nextSteps: [],
    brandMoves: [
      { label: "The Smithsonian deploys AI-guided AR tours across its National Museum of Natural History, layering extinct animal animations over fossil displays", url: "https://si.edu" },
      { label: "Athens launches AR app showing classical-era reconstructions overlaid on the Acropolis ruins, developed with Google Arts & Culture", url: "https://artsandculture.google.com" },
      { label: "Visit Dubai commissions a full AR walking experience across the historic Al Fahidi district, available through the Dubai Tourism app", url: "https://visitdubai.com" },
      { label: "MSC Cruises integrates AR port-of-call experiences into its cruise app, enabling passengers to access immersive historical layers at each destination", url: "https://msccruises.com" },
    ],
  },

  // ── FITNESS ─────────────────────────────────────────────────────────────────
  {
    id: "fitness-biometric-training",
    name: "Biometric-Led Training",
    description: "Continuous glucose monitors, HRV tracking, and sleep staging are turning training from feel-based to data-driven. AI coaching that reads your physiology in real time is moving from pro athletes to serious amateurs.",
    color: "#A7D47C",
    topics: ["fitness", "health", "tech"],
    relevanceScore: 76,
    redditQuery: "CGM HRV training biometric fitness wearable data",
    newsQuery: "biometric training wearables AI coaching fitness technology",
    position: { x: 1328, y: 4368 },
    whyRelevant: "The physiological feedback loop that used to require a team of sports scientists is now on your wrist. Brands that help consumers act on that data, rather than just display it, will win the next fitness decade.",
    trajectory: "CGM for non-diabetics moves into mainstream fitness within 24 months. The question is whether the insight layer (what to do with the data) or the hardware layer (the sensor) captures more value.",
    nextSteps: [],
    brandMoves: [
      { label: "Whoop 4.0 integrates HRV-based workout recommendations, pushing from data display into prescriptive AI coaching for 5M+ members", url: "https://whoop.com" },
      { label: "Oura Ring Generation 4 adds readiness and training load scores endorsed by NBA and Premier League performance teams", url: "https://ouraring.com" },
      { label: "Supersapiens CGM for athletes (Abbott Libre Sense powered) becomes standard kit at elite triathlon and cycling events", url: "https://supersapiens.com" },
      { label: "Garmin's AI Training Status feature uses HRV, sleep, and load data to recommend rest or hard days — adopted across its entire Forerunner and Fenix lineup", url: "https://garmin.com" },
    ],
  },
  {
    id: "fitness-social-performance",
    name: "Social Fitness Tech",
    description: "Strava, Whoop, and their successors are making fitness data a social currency. Community, competition, and shared suffering are the real product, the hardware is just the entry point.",
    color: "#FFB04A",
    topics: ["fitness", "lifestyle", "health"],
    relevanceScore: 64,
    redditQuery: "Strava Whoop fitness social community performance data sharing",
    newsQuery: "social fitness technology community platform wearable",
    position: { x: -32, y: 4968 },
    whyRelevant: "Fitness data has become identity expression. The platform that owns the social layer owns the retention loop, and retention is where fitness brands make their real margin.",
    trajectory: "Social fitness tech consolidates around 3-4 major platforms. The brands that build native integrations into Strava and Whoop ecosystems will have distribution advantages that are hard to replicate.",
    nextSteps: [],
    brandMoves: [
      { label: "Strava reaches 125M registered athletes and becomes the de facto social network for running and cycling identity expression", url: "https://strava.com" },
      { label: "Hyrox global fitness race series builds its entire spectator and entry experience around Strava and Whoop data sharing, fuelling viral growth", url: "https://hyrox.com" },
      { label: "Lululemon Studio (Mirror acquisition) pivots to social-first group workout features after hardware struggles, betting on community over equipment", url: "https://lululemon.com/en-us/studio" },
      { label: "Nike Run Club adds 'Pace Groups' and competitive challenges, integrating social fitness mechanics directly into its free app to retain 50M users", url: "https://nike.com/nrc-app" },
    ],
  },

  // ── MUSIC ───────────────────────────────────────────────────────────────────
  {
    id: "music-ai-creation",
    name: "AI Music Generation",
    description: "Suno, Udio, and a dozen serious competitors are making original music generation accessible to anyone with a text prompt. The implications for music licensing, sync, and the definition of authorship are not yet resolved.",
    color: "#FF8BB4",
    topics: ["music", "tech", "art"],
    relevanceScore: 78,
    redditQuery: "AI music generation Suno Udio artificial intelligence",
    newsQuery: "AI music generation tools copyright artists",
    position: { x: 548, y: 4968 },
    whyRelevant: "AI music generation is the fastest-moving creative AI category after image generation. The sync licensing and background music markets will be fundamentally restructured within 24 months.",
    trajectory: "AI music will become the default for low-stakes use cases (brand video, UGC, game soundtrack) within 2 years, freeing human music for high-value cultural moments. The fight is over what counts as 'high value'.",
    nextSteps: [],
    brandMoves: [
      { label: "Suno AI reaches 10M users generating full songs from text prompts, signing a licensing deal with major labels for training data", url: "https://suno.com" },
      { label: "Epidemic Sound launches AI-assisted music creation tools for its library of 40,000 tracks, targeting content creators and brand teams", url: "https://epidemicsound.com" },
      { label: "YouTube introduces AI music generation via Dream Track in Shorts, letting creators generate original soundtracks from text descriptions", url: "https://youtube.com" },
      { label: "AWAL (Sony Music) partners with AI music startup Boomy to develop artist-friendly AI creation tools that retain royalties for human artists", url: "https://awal.com" },
    ],
  },
  {
    id: "music-spatial-audio",
    name: "Spatial Audio Experiences",
    description: "Dolby Atmos, binaural audio, and Apple Spatial Audio are making three-dimensional sound a consumer expectation. Live music, wellness audio, and gaming are all being rebuilt for the spatial layer.",
    color: "#8C93C7",
    topics: ["music", "wellness", "tech"],
    relevanceScore: 62,
    redditQuery: "spatial audio Dolby Atmos binaural wellness music immersive",
    newsQuery: "spatial audio consumer wellness music technology",
    position: { x: 1128, y: 4968 },
    whyRelevant: "Spatial audio is the first meaningful upgrade in listening experience since stereo. It's also finding unexpected applications in wellness, focus, and sleep, categories with high willingness to pay.",
    trajectory: "As spatial audio headphones become standard at sub-$200, spatial mixing becomes the baseline expectation for new music, and the wellness audio category (sleep sounds, focus music) doubles in size.",
    nextSteps: [],
    brandMoves: [
      { label: "Apple adds Spatial Audio and head-tracking to AirPods Pro, making Dolby Atmos a standard consumer feature across its 100M+ AirPods user base", url: "https://apple.com/airpods-pro" },
      { label: "Spotify partners with Dolby to roll out Dolby Atmos music across its 600M users, making spatial audio the new streaming default", url: "https://spotify.com" },
      { label: "Calm launches a binaural audio sleep series, achieving 3M plays in the first month and validating spatial audio as a wellness format", url: "https://calm.com" },
      { label: "Coldplay's Music of the Spheres world tour becomes the highest-grossing ever in part by delivering a proprietary spatial audio mix at every venue", url: "https://coldplay.com" },
    ],
  },

  // ── ART ─────────────────────────────────────────────────────────────────────
  {
    id: "art-ai-legitimacy",
    name: "AI Art Legitimacy",
    description: "Christie's sold an AI artwork for $432,500. MoMA has acquired its first AI-generated pieces. The institutional art world is taking positions, and those positions are creating new market structures in real time.",
    color: "#FFD65C",
    topics: ["art", "tech"],
    relevanceScore: 72,
    redditQuery: "AI art Christie's museum institutional legitimacy artist",
    newsQuery: "AI art institutional galleries Christie's MoMA",
    position: { x: 1708, y: 4968 },
    whyRelevant: "When institutions buy, markets form. The AI art legitimacy debate is now a market structure question, who controls provenance, authentication, and value attribution in an age of infinite generation.",
    trajectory: "AI art will split into two markets: high-value institutional pieces with explicit AI authorship and human curation, and a commoditised tier for commercial use. The middle market will be squeezed hardest.",
    nextSteps: [],
    brandMoves: [
      { label: "Christie's 'Augmented Intelligence' auction series sells AI-generated works by Refik Anadol and Holly Herndon at prices exceeding $200K, signalling institutional market formation", url: "https://christies.com" },
      { label: "MoMA acquires works by artist and AI researcher Sofia Crespo, becoming the first major US museum to formally collect AI-native art", url: "https://moma.org" },
      { label: "Refik Anadol's 'Unsupervised' installation at MoMA draws 3M visitors, the most-attended single work in the museum's recent history", url: "https://refikanadol.com" },
      { label: "Sotheby's launches a dedicated 'Digital Art & AI' sale category, separating AI works from NFTs and creating a standalone market designation", url: "https://sothebys.com" },
    ],
  },
  {
    id: "art-phygital-objects",
    name: "Phygital Art Objects",
    description: "Blockchain-linked physical prints, AR layers over gallery works, and NFT-backed limited editions are creating a new category: art objects that exist simultaneously in physical and digital space.",
    color: "#C4A0CE",
    topics: ["art", "tech", "luxury"],
    relevanceScore: 61,
    redditQuery: "phygital art NFT physical print blockchain AR gallery",
    newsQuery: "phygital art blockchain print edition gallery",
    position: { x: 168, y: 5568 },
    whyRelevant: "The phygital art object solves the scarcity problem of digital art and the friction problem of physical art. It's a new product category, not just a format, and the collectors who understand it earliest build the best positions.",
    trajectory: "Phygital art moves from crypto-native collectors into mainstream luxury art buyers within 3 years, driven by brands (Louis Vuitton, Nike, Gucci) who are already investing in the format.",
    nextSteps: [],
    brandMoves: [
      { label: "Damien Hirst's 'The Currency' project lets buyers choose between physical paintings or NFTs — 5,149 choose NFT, the physical versions are burned on camera", url: "https://heni.com" },
      { label: "Louis Vuitton's 'Via Trunk' NFT collection includes physical trunk access and exclusive events, blending collectible object with digital token", url: "https://louisvuitton.com" },
      { label: "Verisart provides blockchain certificates of authenticity for physical artworks by over 100,000 artists, building phygital provenance infrastructure", url: "https://verisart.com" },
      { label: "Pace Gallery launches Pace Verso platform enabling artists to attach digital twins and AR layers to physical editions sold through the gallery", url: "https://pacegallery.com" },
    ],
  },

  // ── SKINCARE ────────────────────────────────────────────────────────────────
  {
    id: "skincare-biotech-actives",
    name: "Biotech Skincare Actives",
    description: "Exosome serums, fermented actives, and lab-grown collagen are crossing from clinical dermatology into consumer skincare. The biotech lab is the new beauty counter.",
    color: "#B6D693",
    topics: ["skincare", "beauty", "health"],
    relevanceScore: 73,
    redditQuery: "exosome serum biotech skincare lab grown collagen actives",
    newsQuery: "biotech skincare actives exosomes fermented beauty",
    position: { x: 748, y: 5568 },
    whyRelevant: "Biotech actives are to skincare what organic farming was to food, a genuine performance difference with a story that justifies premium pricing. The brands that own biotech provenance will own the next decade of prestige skincare.",
    trajectory: "Exosome skincare, currently priced as ultra-premium, will reach accessible luxury price points within 3 years as fermentation and biotech manufacturing scales. The race is for formulation IP.",
    nextSteps: [],
    brandMoves: [
      { label: "Augustinus Bader builds a $200M brand on TFC8 biotech active, turning a single proprietary ingredient into a global prestige franchise", url: "https://augustinusbader.com" },
      { label: "111SKIN launches an exosome-based serum developed with stem cell scientists at University College London, bridging clinical and consumer markets", url: "https://111skin.com" },
      { label: "L'Oréal's Active Cosmetics division acquires Skinbetter Science for $1.2B, betting on biotech-adjacent clinical actives as the future of mass prestige", url: "https://loreal.com" },
      { label: "Allies of Skin launches a fermentation-first positioning platform, building its entire product architecture around biofermented actives at accessible luxury price points", url: "https://alliesofskin.com" },
    ],
  },
  {
    id: "skincare-ai-personalisation",
    name: "AI Skin Diagnostics",
    description: "Camera-based skin analysis, AI-matched formulations, and subscription personalisation are turning skincare from a category browse into a precision recommendation engine.",
    color: "#FF8BB4",
    topics: ["skincare", "beauty", "tech"],
    relevanceScore: 67,
    redditQuery: "AI skincare diagnostics personalised formulation skin analysis app",
    newsQuery: "AI skin diagnostics personalised skincare technology",
    position: { x: 1328, y: 5568 },
    whyRelevant: "Personalisation in skincare reduces churn and increases basket size simultaneously. The brands that own the diagnostic layer own the relationship, which is worth more than any single product.",
    trajectory: "AI skin diagnostics will move from premium brand differentiator to mass-market standard feature within 24 months, driven by smartphone camera improvement and falling AI inference costs.",
    nextSteps: [],
    brandMoves: [
      { label: "Proven Skincare uses a 47-question AI quiz backed by 20,000+ academic papers to formulate personalised three-step routines for each customer", url: "https://provenskincare.com" },
      { label: "Shiseido launches Optune, an AI-powered skincare device that adjusts serum formulations daily based on skin sensor readings and weather data", url: "https://shiseido.com" },
      { label: "La Roche-Posay's SkinChecker AI tool analyses uploaded selfies for early signs of skin cancer, building diagnostic authority in mass skincare", url: "https://laroche-posay.co.uk" },
      { label: "Curology uses AI-driven dermatology consultations to prescribe personalised tretinoin formulas, scaling to 600K+ subscribers", url: "https://curology.com" },
    ],
  },

  // ── LUXURY ──────────────────────────────────────────────────────────────────
  {
    id: "luxury-blockchain-provenance",
    name: "Digital Product Passports",
    description: "LVMH's Aura blockchain, Richemont's product passports, and EU Digital Product Passport regulation are turning authenticity from a marketing claim into a verifiable data layer.",
    color: "#FFD65C",
    topics: ["luxury", "sustainability", "tech"],
    relevanceScore: 71,
    redditQuery: "blockchain luxury authentication digital passport LVMH",
    newsQuery: "digital product passport luxury blockchain authentication EU",
    position: { x: 1708, y: 5568 },
    whyRelevant: "Provenance is the core value proposition of luxury. Digital product passports make provenance machine-verifiable, unlocking resale value, anti-counterfeiting, and circular business models simultaneously.",
    trajectory: "EU Digital Product Passport regulation (2027) will make blockchain provenance mandatory for luxury goods sold in Europe. The brands that build infrastructure now will define the standard for everyone else.",
    nextSteps: [],
    brandMoves: [
      { label: "LVMH, Prada, and Cartier launch the Aura Blockchain Consortium, the first cross-brand luxury blockchain for product authentication with 40+ members", url: "https://auraluxuryblockchain.com" },
      { label: "Breitling attaches NFC-powered digital passports to every watch, enabling ownership transfer and service history on the blockchain", url: "https://breitling.com" },
      { label: "Arianee powers digital product passports for Richemont brands including Cartier and Vacheron Constantin, reaching 3M digital certificates issued", url: "https://arianee.com" },
      { label: "Pangaia integrates QR-code digital passports on all garments, linking customers to fibre origin, manufacturing location, and carbon footprint data", url: "https://pangaia.com" },
    ],
  },
  {
    id: "luxury-ai-personalisation",
    name: "Hyper-Personalised Luxury",
    description: "AI is enabling one-to-one personalisation at scale, from bespoke product configurations to personal shopper AI that remembers every past purchase and preference across the full luxury portfolio.",
    color: "#C4A0CE",
    topics: ["luxury", "fashion", "tech"],
    relevanceScore: 65,
    redditQuery: "AI luxury personalisation bespoke customer experience high end",
    newsQuery: "AI personalisation luxury fashion customer experience",
    position: { x: 168, y: 6168 },
    whyRelevant: "Luxury was always about feeling uniquely seen. AI makes that feeling scalable. The brands that deploy AI-powered personalisation without losing the human warmth of the luxury service experience will win the next decade.",
    trajectory: "AI personal shoppers for luxury will be standard at the top 20 luxury groups within 18 months. The differentiation will be in training data quality and human-AI handoff design.",
    nextSteps: [],
    brandMoves: [
      { label: "Net-a-Porter's AI stylist analyses purchase history and browsing to send weekly personal edit emails with 3x higher open rates than standard newsletters", url: "https://net-a-porter.com" },
      { label: "Farfetch Dream Assembler tool enables one-to-one bespoke product configuration for handbags and footwear across its luxury brand network", url: "https://farfetch.com" },
      { label: "Dior deploys AI-powered clienteling tools in boutiques, giving sales associates real-time preference profiles of VIP customers before they enter the store", url: "https://dior.com" },
      { label: "Gucci's My Gucci monogramming service powered by AI design assistance allows fully bespoke product customisation at accessible luxury price points", url: "https://gucci.com" },
    ],
  },

  // ── CREATIVITY ──────────────────────────────────────────────────────────────
  {
    id: "creativity-generative-tools",
    name: "Generative Creative Tools",
    description: "Midjourney, Sora, Runway, and Claude are restructuring the creative workflow. Moodboards, scripts, storyboards, copy, and video are all now AI-assisted by default in forward-looking studios. The question is no longer whether to use AI, it's what human creativity actually adds.",
    color: "#FF8BB4",
    topics: ["creativity", "art", "tech"],
    relevanceScore: 82,
    redditQuery: "AI creative tools Midjourney Runway generative creative workflow",
    newsQuery: "AI generative creative tools workflow agencies studios",
    position: { x: 168, y: 6768 },
    whyRelevant: "AI creative tools are not augmenting creative production, they're restructuring it. Studios that adapt their workflow are producing at 5-10x the pace. Those that don't will be out-produced.",
    trajectory: "Within 18 months AI creative tools will be as standard as Adobe Creative Suite. The competitive question moves from 'do you use AI' to 'how sophisticated is your AI workflow and proprietary training data'.",
    nextSteps: [],
    brandMoves: [
      { label: "Adobe Firefly integrates generative AI directly into Photoshop and Illustrator, adding 'Generative Fill' to 30M+ professional users overnight", url: "https://adobe.com/products/firefly" },
      { label: "Runway ML's Gen-3 video model is adopted by major advertising agencies including WPP's Hogarth for high-volume commercial production", url: "https://runwayml.com" },
      { label: "Midjourney reaches 16M Discord users and is cited in campaigns by Nestlé, Heinz, and Volkswagen as primary moodboard and concept visualisation tool", url: "https://midjourney.com" },
      { label: "WPP launches Open, a proprietary AI creative production platform built on Adobe, Getty, and OpenAI partnerships to serve all its agency brands", url: "https://wpp.com" },
      { label: "Canva integrates Magic Studio AI tools including text-to-image and Magic Write into its 170M-user platform, democratising generative creative tools", url: "https://canva.com" },
    ],
  },
  {
    id: "creativity-human-ai-authorship",
    name: "Human-AI Co-Authorship",
    description: "The concept of creative authorship is being renegotiated in real time. Who owns an AI-assisted work? What does creative direction mean when the tool does the execution? The answers are shaping everything from contracts to copyright law.",
    color: "#8C93C7",
    topics: ["creativity", "art", "tech"],
    relevanceScore: 71,
    redditQuery: "AI authorship copyright creative work human AI collaboration",
    newsQuery: "AI authorship copyright creative industries law",
    position: { x: 748, y: 6768 },
    whyRelevant: "Creative industry contracts written before AI are already inadequate. The authorship question is both a legal issue and a cultural one, and how it resolves will determine how creative value is distributed for the next decade.",
    trajectory: "Copyright law for AI-assisted work will be clarified in most major jurisdictions by 2027. Until then, IP risk falls on creators and agencies, creating an opening for platforms that offer AI creative tools with built-in rights clarity.",
    nextSteps: [],
    brandMoves: [
      { label: "Getty Images launches its own generative AI image tool trained exclusively on licensed content, offering indemnified outputs to commercial clients", url: "https://gettyimages.com/ai" },
      { label: "Adobe Content Credentials (C2PA) roll out across Creative Cloud apps, embedding provenance metadata to distinguish AI-assisted from human-only work", url: "https://contentcredentials.org" },
      { label: "Universal Music Group signs AI collaboration agreements with Anthropic and Google, establishing royalty frameworks for AI trained on label catalogues", url: "https://umusicgroup.com" },
      { label: "Stability AI releases an 'Enterprise' tier with contractual IP indemnification, making authorship liability a commercial product differentiator", url: "https://stability.ai" },
    ],
  },

  // ── PHOTOGRAPHY ─────────────────────────────────────────────────────────────
  {
    id: "photography-ai-authenticity",
    name: "Photography's Authenticity Crisis",
    description: "AI-generated images are now indistinguishable from photographs. Press agencies, stock libraries, and social platforms are building verification systems; editorial photography is redefining what 'documentary evidence' means in a post-synthetic era.",
    color: "#8C93C7",
    topics: ["photography", "tech", "art"],
    relevanceScore: 76,
    redditQuery: "AI photography deepfake authenticity synthetic images press",
    newsQuery: "AI synthetic photography authenticity crisis editorial",
    position: { x: 1328, y: 6768 },
    whyRelevant: "The documentary value of photography was always its anchor. When that's gone, the entire chain of trust, from journalism to social proof in advertising, needs rebuilding. Brands and media that get ahead of verification will own the credibility premium.",
    trajectory: "Content authenticity standards (C2PA, Adobe Content Credentials) will become mandatory for editorial and advertising photography within 3 years. The brands that adopt early will have a transparency advantage.",
    nextSteps: [],
    brandMoves: [
      { label: "AP, Reuters, and AFP publish joint policy banning AI-generated images from news wires, establishing editorial photography's documentary standard", url: "https://ap.org" },
      { label: "Leica Camera launches the M11-P with built-in Content Credentials (C2PA) chip — the first camera to cryptographically sign every image at capture", url: "https://leica-camera.com" },
      { label: "Adobe's Content Authenticity Initiative reaches 3,500 member organisations committing to provenance transparency in visual media", url: "https://contentauthenticity.org" },
      { label: "Nikon announces Content Credentials integration across its Z-series mirrorless lineup, bringing cryptographic image authentication to pro photographers", url: "https://nikon.com" },
    ],
  },
  {
    id: "photography-computational",
    name: "Computational Photography",
    description: "AI-powered night mode, focus stacking, real-time HDR, and phone cameras that outperform DSLRs, computational photography has democratised professional image quality while simultaneously raising consumer expectations to pro level.",
    color: "#FFD65C",
    topics: ["photography", "tech"],
    relevanceScore: 67,
    redditQuery: "computational photography AI camera phone portrait night mode",
    newsQuery: "computational photography AI smartphone camera professional",
    position: { x: 1708, y: 6768 },
    whyRelevant: "When a phone camera beats a professional DSLR in most use cases, the value of professional photography shifts entirely to judgement, vision, and direction, not technical execution. That's a profound change in what photographers sell.",
    trajectory: "Computational photography capabilities will reach diminishing returns on the hardware side and shift to AI editing: automatic style application, scene-aware post-processing, and real-time cinematic grade.",
    nextSteps: [],
    brandMoves: [
      { label: "Google Pixel 9's 'Add Me' and 'Best Take' AI features use computational photography to solve group-shot problems that no DSLR can match", url: "https://store.google.com/product/pixel_9" },
      { label: "Apple's iPhone 16 Pro shoots spatial video for Apple Vision Pro — computational photography enabling a new content category at consumer price points", url: "https://apple.com/iphone-16-pro" },
      { label: "Lightroom's AI Masking and Denoise features, powered by Adobe Sensei, process professional-grade edits in seconds that previously required hours", url: "https://lightroom.adobe.com" },
      { label: "Sony launches AI-AF (autofocus) across its Alpha mirrorless lineup, using machine learning to track subjects that previously required manual focus pullers", url: "https://sony.com/en/articles/alpha-1" },
    ],
  },

  // ── FILM ────────────────────────────────────────────────────────────────────
  {
    id: "film-ai-production",
    name: "AI in Film Production",
    description: "De-aging technology, AI extras, virtual production stages, and AI script analysis are changing every phase of film production. Major studios are using AI to reduce costs, accelerate timelines, and create effects previously impossible at budget.",
    color: "#FFD65C",
    topics: ["film", "tech", "creativity"],
    relevanceScore: 74,
    redditQuery: "AI film production de-aging virtual production Hollywood SAG",
    newsQuery: "AI film production technology Hollywood studios",
    position: { x: 168, y: 7368 },
    whyRelevant: "AI production tools are restructuring film economics, lower budgets for comparable production values is the promise. The tension is with talent unions whose members' likenesses and work are the training data.",
    trajectory: "The SAG-AFTRA agreement will define how AI is used in production for the next 5 years. Studios that build compliant AI workflows now will have a cost and speed advantage when the rules become clear.",
    nextSteps: [],
    brandMoves: [
      { label: "Industrial Light & Magic deploys Deepfake/de-aging AI on Indiana Jones and the Dial of Destiny, de-aging Harrison Ford 45 years for the opening sequence", url: "https://ilm.com" },
      { label: "Disney's VP of virtual production cites AI LED volume stages as cutting location shooting budgets by 30% across Mandalorian-era productions", url: "https://disneyplus.com" },
      { label: "Runway ML's Gen-3 is used for background extension and VFX cleanup on multiple Netflix originals, cutting post-production time by weeks", url: "https://runwayml.com" },
      { label: "SAG-AFTRA's 2023 AI consent framework sets industry precedent: actors must now explicitly licence digital likenesses for AI training separately from performance contracts", url: "https://sagaftra.org" },
    ],
  },
  {
    id: "film-algorithmic-culture",
    name: "Algorithm-Shaped Storytelling",
    description: "Streaming algorithm data is feeding backwards into what gets greenlit, how it's structured, and where the emotional beats land. The result is a quietly homogenising effect on narrative, and a growing creative reaction against it.",
    color: "#C4A0CE",
    topics: ["film", "tech", "creativity"],
    relevanceScore: 65,
    redditQuery: "Netflix algorithm storytelling streaming content data driven",
    newsQuery: "streaming algorithm content creation data narrative",
    position: { x: 748, y: 7368 },
    whyRelevant: "Understanding how algorithms shape content preferences is now a strategic input for any brand doing content marketing, not just studios. The same mechanics that drove The Crown's pacing are shaping branded video performance.",
    trajectory: "The backlash against algorithmic storytelling is already building, in both critical culture and consumer behaviour (podcast and newsletter growth). Brands that can deliver non-algorithmic depth will find an underserved audience.",
    nextSteps: [],
    brandMoves: [
      { label: "Netflix's algorithm-driven greenlight of Squid Game Season 1 (based on data signals from similar content) becomes the most-watched show in platform history", url: "https://netflix.com" },
      { label: "A24 doubles down on anti-algorithm positioning — no data-driven commissioning, strong director vision — differentiating itself as auteur cinema against Netflix's data approach", url: "https://a24films.com" },
      { label: "YouTube's algorithmic recommendations drive 70% of watch time, forcing brands to design video content with algorithm-friendly hooks in the first 3 seconds", url: "https://youtube.com" },
      { label: "Substack's anti-algorithmic newsletter platform reaches 35M paid subscribers, as writers and readers opt out of engagement-optimised recommendation systems", url: "https://substack.com" },
    ],
  },

  // ── BRANDING ────────────────────────────────────────────────────────────────
  {
    id: "branding-ai-identity",
    name: "Generative Brand Identity",
    description: "Dynamic brand systems that generate on-brief visual assets, copy, and motion in real time are replacing static brand guidelines. AI brand identity systems can produce hundreds of variations while maintaining consistency, something no human team could manage at scale.",
    color: "#FD8326",
    topics: ["branding", "creativity", "tech"],
    relevanceScore: 71,
    redditQuery: "AI brand identity generative design system dynamic visual",
    newsQuery: "AI brand identity generative design system agency",
    position: { x: 1328, y: 7368 },
    whyRelevant: "Brand consistency at scale has always been the hardest problem for large organisations. AI brand systems solve it, but also raise the question of what brand creativity means when the system generates the executions.",
    trajectory: "AI brand identity systems will be standard agency output within 3 years. The differentiator will shift from 'making brand assets' to 'training the AI on the right brand intelligence to generate the right assets'.",
    nextSteps: [],
    brandMoves: [
      { label: "Coca-Cola's 'Create Real Magic' campaign uses DALL-E and GPT-4 to let fans generate on-brand artwork using Coke's visual archive as source material", url: "https://coca-cola.com" },
      { label: "Heinz runs an AI image generation experiment prompting 'ketchup' in Midjourney — every output looks like Heinz, validating the brand's visual dominance", url: "https://heinz.com" },
      { label: "Pentagram designs a generative identity for the Cooper Hewitt design museum that produces thousands of unique logo variations from a single algorithmic brief", url: "https://pentagram.com" },
      { label: "Interbrand launches 'Sonic Branding AI' service generating brand-consistent audio identities at scale, reducing audio production costs by 70%", url: "https://interbrand.com" },
    ],
  },
  {
    id: "branding-cultural-intelligence",
    name: "AI Cultural Intelligence",
    description: "AI systems that analyse cultural signals, trend data, and consumer sentiment in real time are giving brand strategists a feedback loop that previously took months of qualitative research to generate.",
    color: "#A7D47C",
    topics: ["branding", "tech", "creativity"],
    relevanceScore: 63,
    redditQuery: "AI brand strategy cultural intelligence trend prediction consumer sentiment",
    newsQuery: "AI brand strategy cultural intelligence consumer insight",
    position: { x: 1708, y: 7368 },
    whyRelevant: "Real-time cultural intelligence is a structural advantage, brands that see shifts earlier can respond faster and more precisely. The question is whether the AI signal adds more than the noise it introduces.",
    trajectory: "AI cultural intelligence tools will consolidate around 3-4 platforms within 24 months. The winners will be those with proprietary cultural data sets, not just better models.",
    nextSteps: [],
    brandMoves: [
      { label: "Brandwatch's Consumer Research AI analyses 500M+ social signals daily, used by Unilever and P&G to spot trend shifts weeks before competitors", url: "https://brandwatch.com" },
      { label: "Samba TV's AI cultural intelligence platform is used by Netflix and Disney to predict which cultural moments to activate around for marketing campaigns", url: "https://samba.tv" },
      { label: "Pulsar Platform's audience intelligence tools power strategy for Spotify Wrapped and Levi's campaign planning, processing cultural data at scale", url: "https://pulsarplatform.com" },
      { label: "Kyu Collective builds cultural intelligence as a dedicated strategic practice, serving luxury and FMCG brands with proprietary AI-assisted cultural analysis", url: "https://kyu.com" },
    ],
  },

  // ── FOOD (general) ──────────────────────────────────────────────────────────
  {
    id: "food-cultivated-protein",
    name: "Cultivated Protein",
    description: "Lab-grown meat, precision fermentation, and mycoprotein are no longer future scenarios, they're on shelves in Singapore, approved in the US, and arriving in Europe. The protein question is being answered by biotech.",
    color: "#FD8326",
    topics: ["food", "sustainability", "health"],
    relevanceScore: 69,
    redditQuery: "cultivated meat lab grown protein fermentation consumer food",
    newsQuery: "cultivated meat precision fermentation consumer food market",
    position: { x: 748, y: 6168 },
    whyRelevant: "Cultivated protein is a structural shift in the food system, not a diet trend. The brands that position within this category now, whether as producers, retailers, or ingredient suppliers, are making category-defining bets.",
    trajectory: "Price parity with conventional meat for cultivated protein is 3-5 years away. The consumer behaviour change will follow price, not persuasion. The early period is about supply chain and regulatory position.",
    nextSteps: [],
    brandMoves: [
      { label: "GOOD Meat (Eat Just) becomes the first company to sell cultivated chicken commercially in the US following FDA and USDA approval in 2023", url: "https://eat.just.com/products/good-meat" },
      { label: "Upside Foods secures USDA grant of inspection for cultivated chicken, partnering with José Andrés restaurants for its first commercial service", url: "https://upsidefoods.com" },
      { label: "Quorn reaches £250M revenue with mycoprotein products available in 17 countries, demonstrating commercial scale for non-animal protein mainstream adoption", url: "https://quorn.co.uk" },
      { label: "Nature's Fynd's Fy protein (fermented fungi) launches in Whole Foods across the US, backed by $350M from SoftBank and Bill Gates", url: "https://naturesfynd.com" },
    ],
  },
  {
    id: "food-ai-flavour",
    name: "AI Flavour Intelligence",
    description: "AI systems trained on molecular gastronomy data, global recipe databases, and flavour compound interactions are being used to develop new products, predict trend flavours, and match consumers to taste profiles.",
    color: "#B6D693",
    topics: ["food", "tech"],
    relevanceScore: 61,
    redditQuery: "AI food development flavour prediction recipe consumer",
    newsQuery: "AI food flavour development technology consumer",
    position: { x: 1328, y: 6168 },
    whyRelevant: "AI flavour development is reducing new product development cycles from 18 months to 3 months. The first brands to systematically use AI for NPD will have a compound advantage in speed and iteration.",
    trajectory: "AI-assisted flavour development will be standard in top-50 FMCG companies within 3 years. The competitive question is whether the AI advantage goes to manufacturers or to the platforms that sit above them.",
    nextSteps: [],
    brandMoves: [
      { label: "Givaudan's CARTO AI platform analyses 1.6 trillion flavour data points to predict winning flavour combinations, used by Mars, Nestlé, and PepsiCo", url: "https://givaudan.com" },
      { label: "Firmenich's INSPIRE AI tool generates novel flavour accords from molecular data, cutting formulation time for new beverages from 18 months to 90 days", url: "https://firmenich.com" },
      { label: "McCormick uses IBM's AI platform to develop new product concepts in weeks rather than years, launching a flavour predicted by AI as a bestseller", url: "https://mccormick.com" },
      { label: "Tastewise's food intelligence platform uses AI to analyse 1B+ consumer data points across social, menus, and reviews to predict the next trend flavour", url: "https://tastewise.io" },
    ],
  },
  // ── FRAGRANCE ───────────────────────────────────────────────────────────────
  {
    id: "fragrance-ai-formulation",
    name: "AI Perfume Formulation",
    description: "Machine learning models trained on molecular structure and olfactory perception data are generating novel fragrance accords that human noses alone would never discover. Givaudan, Firmenich, and IFF are all deploying AI in their labs.",
    color: "#C4A0CE",
    topics: ["fragrance", "beauty", "tech"],
    relevanceScore: 70,
    redditQuery: "AI perfume fragrance formulation machine learning olfactory",
    newsQuery: "AI perfume formulation fragrance technology laboratory",
    position: { x: 168, y: 7968 },
    whyRelevant: "Fragrance formulation is being accelerated by AI in ways that open entirely new olfactory territories, and compress development timelines from years to months. Brands with AI-assisted R&D will out-innovate at pace.",
    trajectory: "AI fragrance formulation moves from R&D tool to consumer-facing story within 3 years, 'AI-developed accord' becomes a marketing differentiator the same way 'microbiome-tested' did in skincare.",
    nextSteps: [],
    brandMoves: [
      { label: "Givaudan's Carto AI formulation tool is used by Symrise, IFF, and Firmenich to generate novel fragrance accords not reachable by human perfumers alone", url: "https://givaudan.com" },
      { label: "Philyra — IBM and Symrise's AI system — creates two commercially sold Brazilian perfumes, the first AI-authored fragrances to reach market", url: "https://ibm.com/ibm/philyra" },
      { label: "Dior uses AI-assisted analysis of 250 years of Dior fragrance archive data to inform the development of Miss Dior Blooming Bouquet reformulation", url: "https://dior.com/en_gb/fragrance" },
      { label: "Buly 1803 launches a personalised fragrance service using AI profiling to recommend a unique accord from 70,000 possible combinations", url: "https://buly1803.com" },
    ],
  },
  {
    id: "fragrance-emotional-tech",
    name: "Scent as Emotional Technology",
    description: "The neuroscience of olfaction and mood is being commercialised: scent diffusers synced to biometric data, fragrance as mental health intervention, and 'olfactory design' as a service category for retail and hospitality environments.",
    color: "#FF8BB4",
    topics: ["fragrance", "wellness", "mental-health"],
    relevanceScore: 63,
    redditQuery: "scent emotional wellbeing olfactory neuroscience fragrance wellness",
    newsQuery: "olfactory design scent technology wellbeing retail",
    position: { x: 748, y: 7968 },
    whyRelevant: "Scent is the only sense that bypasses the rational brain entirely, making fragrance one of the most powerful tools in the emotional design toolkit. Brands that understand this are building ambient scent strategies with rigour, not just aesthetics.",
    trajectory: "Olfactory design will become standard in premium retail, hospitality, and residential property development within 5 years, driven by evidence-based wellbeing research and consumer demand for multi-sensory environments.",
    nextSteps: [],
    brandMoves: [
      { label: "Singapore Airlines' proprietary cabin scent 'Stefan Floridian Waters' is scientifically designed to reduce anxiety and is applied to hot towels and crew uniforms", url: "https://singaporeair.com" },
      { label: "Abercrombie & Fitch's Fierce scent ambient pumping strategy generates documented 20% uplift in dwell time and was copied across the retail industry", url: "https://abercrombie.com" },
      { label: "Moodo smart diffuser uses an app and interchangeable scent pods to personalise home olfactory environment, raising $5M to expand its emotional scent platform", url: "https://moodo.co" },
      { label: "Selfridges commissions bespoke olfactory design from The Perfume Society for its Body Studio floor, treating scent as integral to the spatial retail experience", url: "https://selfridges.com" },
    ],
  },

  // ── JEWELLERY ────────────────────────────────────────────────────────────────
  {
    id: "jewellery-lab-grown",
    name: "Lab-Grown Stone Disruption",
    description: "Lab-grown diamonds at 10-15% of mined diamond prices are forcing a complete repositioning of the fine jewellery category. De Beers has entered the lab-grown market. The question is no longer if but how fast the category restructures.",
    color: "#FFD65C",
    topics: ["jewellery", "sustainability", "tech"],
    relevanceScore: 72,
    redditQuery: "lab grown diamond jewellery synthetic gemstone disruption",
    newsQuery: "lab grown diamond market jewellery disruption De Beers",
    position: { x: 1328, y: 7968 },
    whyRelevant: "Lab-grown stones are not a trend, they're a structural market shift. The brands that reposition fastest (around craftsmanship, design, heritage, and emotional storytelling rather than material scarcity) will survive the transition.",
    trajectory: "Lab-grown diamonds will hold 30%+ of the diamond market within 5 years. Mined diamonds will stratify into a ultra-premium heritage category while lab-grown captures the fashion and accessible luxury segments.",
    nextSteps: [],
    brandMoves: [
      { label: "De Beers launches Lightbox, a lab-grown diamond jewellery brand at $800/carat — explicitly separating lab-grown from natural diamonds by price and positioning", url: "https://lightboxjewelry.com" },
      { label: "Pandora commits to using 100% lab-grown diamonds across its entire jewellery range from 2022, making it the world's largest lab-grown diamond jewellery brand", url: "https://pandora.net" },
      { label: "Brilliant Earth reaches $400M revenue building its brand on conflict-free and lab-grown stones for ethically-minded millennial buyers", url: "https://brilliantearth.com" },
      { label: "Signet Jewelers (owner of Zales and Kay) invests $490M in lab-grown diamond supply chain infrastructure, betting on category growth at accessible price points", url: "https://signetjewelers.com" },
    ],
  },
  {
    id: "jewellery-digital-identity",
    name: "Digital & Avatar Jewellery",
    description: "Digital jewellery for avatars, social platforms, and virtual environments is an emerging category, separate from NFT hype, grounded in the genuine purchase of personal expression in digital spaces.",
    color: "#8C93C7",
    topics: ["jewellery", "tech", "luxury"],
    relevanceScore: 58,
    redditQuery: "digital jewellery avatar fashion virtual identity metaverse",
    newsQuery: "digital jewellery avatar luxury fashion virtual identity",
    position: { x: 1708, y: 7968 },
    whyRelevant: "Digital identity expression is a real consumer behaviour, people spend on skins, avatars, and digital accessories. Jewellery brands that understand this as an extension of their category will reach younger audiences in their native environments.",
    trajectory: "Digital jewellery becomes a standard product extension for luxury houses within 5 years, driven by gaming and social platform integrations rather than standalone NFT projects.",
    nextSteps: [],
    brandMoves: [
      { label: "Tiffany & Co. sells 250 NFTiffs — custom CryptoPunk pendants in physical form, with matching digital necklace NFTs — at $50,000 each, selling out in minutes", url: "https://tiffany.com" },
      { label: "Bulgari creates digital jewellery NFTs worn by avatars in The Sandbox metaverse, extending its jewellery into gaming environments without requiring physical product", url: "https://bulgari.com" },
      { label: "Roblox users spend $3B annually on avatar accessories including digital jewellery, validating the market size for digital wearable identity expression", url: "https://roblox.com" },
      { label: "RTFKT (acquired by Nike) creates virtual jewellery and accessories for CloneX avatars, integrating digital jewellery into a collectible avatar ecosystem", url: "https://rtfkt.com" },
    ],
  },

  // ── RETAIL ──────────────────────────────────────────────────────────────────
  {
    id: "retail-ai-personalisation",
    name: "AI Retail Personalisation",
    description: "AI recommendation engines are replacing editorial curation as the primary product discovery mechanism in fashion e-commerce. The best-converting product page is now the one built in real time for each individual consumer.",
    color: "#FD8326",
    topics: ["retail", "tech", "fashion"],
    relevanceScore: 78,
    redditQuery: "AI retail personalisation ecommerce recommendation engine shopping",
    newsQuery: "AI personalisation retail e-commerce conversion recommendation",
    position: { x: 168, y: 8568 },
    whyRelevant: "AI personalisation is compounding, every click refines the model. The brands that invested in data infrastructure 3 years ago are now seeing conversion advantages that are structurally impossible for new entrants to close quickly.",
    trajectory: "AI personalisation in retail will reach commodity status, it will be expected, not differentiated. The next frontier is personalised pricing, personalised inventory, and personalised physical retail experiences.",
    nextSteps: [],
    brandMoves: [
      { label: "Amazon's recommendation engine drives 35% of total revenue, the most-studied AI personalisation system in retail history", url: "https://amazon.com" },
      { label: "ASOS StyleMatch uses visual AI to recommend products based on uploaded outfit photos, converting inspiration into purchase in a single flow", url: "https://asos.com" },
      { label: "Stitch Fix's algorithmic styling engine processes 85+ data points per customer to select personalised clothing boxes, building a $2B revenue business on AI curation", url: "https://stitchfix.com" },
      { label: "Zalando's AI recommendation system — built with 50M customer preference signals — personalises search results and homepage for every visitor in real time", url: "https://zalando.com" },
    ],
  },
  {
    id: "retail-immersive-commerce",
    name: "Immersive Commerce",
    description: "Livestream shopping, AR try-on, and spatial commerce are collapsing the distance between content and purchase. The discovery-to-checkout journey is being compressed into a single immersive experience.",
    color: "#78C9A8",
    topics: ["retail", "tech", "lifestyle"],
    relevanceScore: 68,
    redditQuery: "livestream shopping AR try-on spatial commerce immersive retail",
    newsQuery: "immersive commerce livestream shopping AR retail spatial",
    position: { x: 748, y: 8568 },
    whyRelevant: "Immersive commerce formats have proven conversion rates 6-10x higher than static product pages in Asian markets, and that gap is now arriving in Western retail. The window to build capability before it's expected is closing.",
    trajectory: "Livestream shopping will normalise in Western markets within 3 years, starting with beauty, fashion, and food. AR try-on will become the default product experience for apparel and footwear e-commerce.",
    nextSteps: [],
    brandMoves: [
      { label: "TikTok Shop reaches $20B GMV in its first full year globally, making livestream commerce a mainstream western retail channel for the first time", url: "https://shop.tiktok.com" },
      { label: "L'Oréal deploys AR try-on across 23 brands via Modiface technology, achieving 2.5x conversion uplift vs standard product pages", url: "https://loreal.com" },
      { label: "Snap's AR shopping lenses are used by 250M Snapchatters, with fashion and beauty brands seeing 94% higher purchase intent from try-on lens users", url: "https://snap.com/en-US/lens-studio" },
      { label: "Farfetch's Store of the Future concept integrates AR mirrors, connected clothing rails, and real-time inventory in a single in-store immersive commerce environment", url: "https://farfetch.com" },
    ],
  },

  // ── SOCIAL MEDIA ────────────────────────────────────────────────────────────
  {
    id: "social-ai-content",
    name: "AI Content Creation at Scale",
    description: "AI is enabling brands to produce content at 100x the pace, daily posting, personalised variants, localised versions, and real-time reactive content are all now tractable. The question is whether quantity trades off against brand authenticity.",
    color: "#FF8BB4",
    topics: ["social", "creativity", "branding"],
    relevanceScore: 76,
    redditQuery: "AI social media content creation brand automation scale",
    newsQuery: "AI social media content creation brand automation",
    position: { x: 1328, y: 8568 },
    whyRelevant: "The content velocity advantage of AI is real, and so is the risk of brand dilution when AI produces content without genuine brand intelligence. The brands that use AI as an execution layer on top of strong creative direction will win.",
    trajectory: "AI-generated social content will be the default production method for tier-2 and tier-3 content within 18 months. The premium will shift to human-created, high-intent cultural content that AI cannot replicate.",
    nextSteps: [],
    brandMoves: [
      { label: "Persado's AI copywriting platform is used by Marks & Spencer, Verizon, and Chase to generate emotionally optimised ad copy at scale, reporting 68% conversion lift", url: "https://persado.com" },
      { label: "Coca-Cola deploys an AI content studio with WPP, using generative AI to produce localised campaign assets across 90 markets simultaneously", url: "https://coca-cola.com" },
      { label: "Jasper AI reaches $1.5B valuation serving 100,000+ brand teams generating marketing copy at scale, with integrations into HubSpot and Salesforce", url: "https://jasper.ai" },
      { label: "Klarna uses AI to replace 700 marketing agency contractors, producing social content in-house at higher output volume and lower cost", url: "https://klarna.com" },
    ],
  },
  {
    id: "social-creator-economy",
    name: "Creator Economy Infrastructure",
    description: "The creator economy is maturing from ad-hoc influence deals into a structured commercial infrastructure: creator funds, brand studios, AI production tools, and direct-to-consumer monetisation models are reshaping who makes media and how.",
    color: "#A7D47C",
    topics: ["social", "tech", "lifestyle"],
    relevanceScore: 70,
    redditQuery: "creator economy monetisation brand studio tools infrastructure",
    newsQuery: "creator economy infrastructure brand studio social media",
    position: { x: 1708, y: 8568 },
    whyRelevant: "The creator economy is not a marketing channel, it's an alternative media system. Brands that understand it build creator relationships as media partnerships, not influencer campaigns.",
    trajectory: "Creator economy revenue will exceed traditional media advertising revenue in fashion and beauty within 5 years. The brands that built genuine creator partnerships (not just paid posts) will have the most durable position.",
    nextSteps: [],
    brandMoves: [
      { label: "YouTube Shorts Fund distributes $100M to creators in its first year, followed by the Partner Programme expansion making monetisation accessible to 1M+ smaller creators", url: "https://youtube.com/creators" },
      { label: "Spotify signs exclusive podcast deals with creators including Joe Rogan ($200M) and The Ringer, building a creator-to-platform infrastructure model for audio", url: "https://spotify.com/podcasts" },
      { label: "Patreon reaches $1B in creator payouts annually, establishing the subscription infrastructure for independent creator businesses", url: "https://patreon.com" },
      { label: "L'Oréal's creators-first 'Open to All' model builds a 35,000-creator network with dedicated production tools, educational resources, and co-creation briefs", url: "https://loreal.com" },
    ],
  },

  // ── EDUCATION ────────────────────────────────────────────────────────────────
  {
    id: "education-ai-tutoring",
    name: "AI Personalised Learning",
    description: "AI tutors that adapt to each student's pace, knowledge gaps, and learning style are delivering outcomes that classroom instruction cannot match at scale. Khan Academy's Khanmigo and similar systems are proving the model.",
    color: "#FFD65C",
    topics: ["education", "tech"],
    relevanceScore: 73,
    redditQuery: "AI tutor personalised learning education Khan Academy GPT",
    newsQuery: "AI personalised learning tutoring education outcomes",
    position: { x: 168, y: 9168 },
    whyRelevant: "Personalised AI tutoring is not a supplement to education, it's a structural alternative that will reshape the education industry the same way streaming reshaped television. The institutions that understand this early will adapt; the rest will be displaced.",
    trajectory: "AI tutoring reaches parity with human tutoring for most academic subjects within 3 years, measured by outcome metrics. The premium human tutoring market will shrink to high-touch coaching and social-emotional support.",
    nextSteps: [],
    brandMoves: [
      { label: "Khan Academy's Khanmigo AI tutor is deployed in 50,000+ US classrooms, using GPT-4 to guide students through problems with Socratic questioning rather than answers", url: "https://khanacademy.org/khan-labs" },
      { label: "Duolingo Max launches with GPT-4 powered Explain My Answer and Roleplay features, demonstrating AI tutoring in the world's most-used language learning app", url: "https://duolingo.com/max" },
      { label: "Chegg's AI Cheggmate service launches as a 24/7 homework help assistant, reaching 3.5M users in its first semester despite disruption concerns from competitors", url: "https://chegg.com" },
      { label: "Google's LearnLM model is integrated into Gemini specifically for tutoring use cases, optimising for learning outcomes rather than just question answering", url: "https://deepmind.google/discover/blog/learnlm" },
    ],
  },
  {
    id: "education-skills-credentials",
    name: "Micro-Credentials & Skill Stacks",
    description: "Blockchain-verified micro-credentials, employer-defined skill stacks, and AI-matched career pathways are emerging as alternatives to the four-year degree. The value proposition of traditional higher education is being actively contested.",
    color: "#B6D693",
    topics: ["education", "tech"],
    relevanceScore: 65,
    redditQuery: "micro credentials skills blockchain education alternative degree",
    newsQuery: "micro credentials skills stacking alternative education credentials",
    position: { x: 748, y: 9168 },
    whyRelevant: "The credential inflation that made degrees compulsory is reversing, employer skill-based hiring is growing, and the 4-year degree ROI calculation is under active scrutiny. Brands that hire on skills over credentials will access better-fit talent faster.",
    trajectory: "Blockchain-verified micro-credentials will be accepted by 50% of major employers within 5 years, creating parallel credentialing infrastructure that competes directly with university degrees.",
    nextSteps: [],
    brandMoves: [
      { label: "Google Career Certificates launch in data analytics, project management, and UX design — completing in 6 months and accepted by 150+ employer partners including Walmart and Infosys", url: "https://grow.google/certificates" },
      { label: "LinkedIn Learning integrates skills assessments and badges directly into recruiter search filters, making micro-credentials searchable hiring signals at scale", url: "https://linkedin.com/learning" },
      { label: "IBM SkillsBuild offers 30,000 free courses with digital badges, partnering with universities in 60 countries to stack credentials alongside degrees", url: "https://skillsbuild.org" },
      { label: "Salesforce's Trailhead platform issues 8M+ credentials to users who complete modular learning paths, making it the world's largest employer-specific credentialing system", url: "https://trailhead.salesforce.com" },
    ],
  },

  // ── FASHION ─────────────────────────────────────────────────────────────────
  {
    id: "fashion-resale-first",
    name: "Resale Goes Primary",
    description: "Secondhand is no longer the backup plan. Vinted, Depop, and ThredUp are growing 3x faster than new retail, and Gen Z shops resale first. The shift is structural: sustainability pressure, economic squeeze, and the thrill of the find are all pointing the same direction at the same time.",
    color: "#FF8BB4",
    topics: ["fashion", "retail", "sustainability"],
    relevanceScore: 74,
    redditQuery: "resale fashion Vinted Depop secondhand thrift",
    newsQuery: "resale fashion market growth 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "When secondhand becomes the primary market, the whole logic of new product development changes. Brands that ignore resale are leaving money on the table and ceding cultural relevance to platforms they don't control. The brands winning here treat resale as a channel, not a threat. Patagonia did it early. Levi's did it. The window for a credible brand resale play is still open but closing.",
    trajectory: "Accelerating. The resale market will overtake fast fashion in value within 5 years. Brands that build their own resale programs now own the customer relationship. The ones that don't will watch Vinted own it instead.",
    nextSteps: [
      "Now (0-3 months): audit how your product shows up on Vinted and Depop. What's the secondary market price? That number tells you more about perceived value than any focus group.",
      "Soon (3-12 months): launch a branded resale or take-back program. Patagonia's Worn Wear is the model. Own the resale of your own product before someone else does.",
      "Bet (12-36 months): design for resale from the start. Products with provenance, repairability, and longevity built in command premium secondhand prices and drive first-sale demand.",
    ],
    culturalContext: "Gen Z grew up through the financial crisis and came of age in a pandemic economy — scarcity mindset is built in. Combined with climate guilt and the dopamine of the find, secondhand shopping hits three values at once: financial, environmental, and experiential. Thrifting became identity before it became a market.",
    brandMoves: [
      { label: "Levi's launches 'SecondHand' buyback and resale platform, taking brand control of the aftermarket", url: "https://levi.com" },
      { label: "Patagonia's Worn Wear program becomes a standalone revenue channel generating $10M+ annually", url: "https://wornwear.patagonia.com" },
      { label: "Burberry partners with TheRealReal for authenticated luxury resale, adding provenance data to physical tags", url: "https://therealreal.com" },
      { label: "Zara launches a Pre-Owned section on its app — mainstream fast fashion entering the circular economy", url: "https://zara.com" },
    ],
  },
  {
    id: "fashion-micro-trend-fatigue",
    name: "Micro-Trend Burnout",
    description: "TikTok compressed the trend cycle to weeks and now the backlash is real. Mob wife, clean girl, coastal grandmother: they peak and die before brands can even respond. The consumer who's paying attention is exhausted. The counter-signal is a return to personal style over trend participation.",
    color: "#FFB04A",
    topics: ["fashion", "social", "lifestyle"],
    relevanceScore: 66,
    redditQuery: "micro trends tiktok fashion aesthetic fatigue burnout personal style",
    newsQuery: "micro trend fashion TikTok burnout 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "Brands chasing micro-trends are burning creative resources on content that's irrelevant before it ships. The opportunity is in the counter-movement: timelessness, craft, personal style. The brands positioned as anchors rather than trend-chasers are building more durable relationships. Being the thing people come back to when they're tired of chasing is a real strategic position.",
    trajectory: "The micro-trend machine keeps running because engagement drives it, but the cultural backlash is real and growing. Expect bifurcation: trend-speed brands for pure volume, timeless brands for cultural credibility.",
    nextSteps: [
      "Now (0-3 months): audit your trend response time. If you can't ship in under 3 weeks, stop trying to chase micro-trends. Play a different game.",
      "Soon (3-12 months): invest in evergreen content and product that doesn't date. Build an aesthetic identity that doesn't require trend participation to stay relevant.",
      "Bet (12-36 months): brands with strong POV and consistent aesthetic are the ones people remember and return to. Define yours clearly enough that customers know immediately if something is 'you'.",
    ],
    culturalContext: "The algorithm's relentless optimisation for engagement accidentally killed the very thing that made fashion exciting: anticipation. When everything is a trend and trends last three weeks, nothing is aspirational anymore. Exhaustion is the inevitable output of a system designed for infinite scroll.",
    brandMoves: [
      { label: "Loro Piana doubles down on 'no logo, no trend' positioning — searches for 'quiet luxury' hit 5 billion TikTok views", url: "https://loropiana.com" },
      { label: "Uniqlo's LifeWear philosophy becomes a marketing cornerstone, selling timelessness as the differentiator", url: "https://uniqlo.com" },
      { label: "A.P.C. leans into 'never on trend, always relevant' as a brand truth, growing repeat purchase rate 40%", url: "https://apc.fr" },
      { label: "COS shifts to slow-drop collections with 12-month production windows instead of trend-reactive sprints", url: "https://cos.com" },
    ],
  },

  // ── BEAUTY ───────────────────────────────────────────────────────────────────
  {
    id: "beauty-skin-diagnostics",
    name: "Skin Diagnostics Go Home",
    description: "AI cameras, at-home scanners, and apps analyzing your skin in real time are pulling the dermatologist consultation into your bathroom. Neutrogena's Skin360, FOREO's Luna, and a wave of startups are making clinical-grade skin analysis a daily consumer habit that drives personalized product purchasing.",
    color: "#B6D693",
    topics: ["beauty", "skincare", "health", "tech"],
    relevanceScore: 72,
    redditQuery: "at home skin analysis AI skincare diagnostic app",
    newsQuery: "skin diagnostic AI technology beauty 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "When consumers can diagnose their own skin accurately, the generic product pitch dies. The brands winning are the ones that follow the data: personalized formulations, subscription models tied to skin progress, and recommendations that actually change based on what the scan says. The diagnostic becomes the retention mechanism, not just the acquisition hook.",
    trajectory: "Accelerating fast. The cost of the underlying tech is dropping and the consumer appetite is proven. Within 3 years, a beauty purchase without a diagnostic step will feel like buying glasses without an eye test.",
    nextSteps: [
      "Now (0-3 months): integrate a skin quiz or AI diagnostic tool into your DTC purchase flow. Even a basic assessment improves conversion and makes product recommendations feel personal.",
      "Soon (3-12 months): partner with a skin diagnostic platform or build your own. Use the data to drive recommendations and reorder triggers.",
      "Bet (12-36 months): move toward formulation-on-demand. The diagnostic data tells you exactly what someone's skin needs. The brand that can fulfill that precisely wins the loyalty.",
    ],
    culturalContext: "The wellness boom convinced consumers that personalisation is their right, not a luxury. A generation that tracks sleep, macros, and HRV every day sees no reason their skincare shouldn't be equally data-driven. The dermatologist's authority hasn't disappeared — it's been democratised.",
    brandMoves: [
      { label: "Neutrogena's Skin360 AI scanner reaches 10M users, feeding personalised product recommendations that drive 3x conversion", url: "https://neutrogena.com" },
      { label: "L'Oréal acquires AI skin diagnostics startup Syntilay to bring analysis tech into mass-market channels", url: "https://loreal.com" },
      { label: "Sephora integrates skin scanner booths in flagship stores, creating a diagnostic-to-purchase funnel in-store", url: "https://sephora.com" },
      { label: "Estée Lauder's iMatch Virtual Try-On adds real-time skin health scoring to its foundation matching tool", url: "https://esteelauder.com" },
    ],
  },
  {
    id: "beauty-biotech-actives",
    name: "Beauty's Biotech Revolution",
    description: "Lab-grown collagen from Geltor, synthetic spider silk proteins from Bolt Threads, biofermented hyaluronic acid, and precision fermentation actives are replacing agricultural and animal-derived ingredients. Synthetic biology is redesigning what goes into skincare at a molecular level — more consistent, more sustainable, and increasingly more effective than nature's originals.",
    color: "#FFD65C",
    topics: ["beauty", "biotech", "sustainability", "tech"],
    relevanceScore: 68,
    redditQuery: "lab grown collagen biofermented skincare biotech beauty synthetic biology actives",
    newsQuery: "biotech beauty ingredients synthetic biology lab-grown collagen 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "The brands that understand biotech ingredients are writing the next chapter of the beauty industry. Lab-grown collagen, synthetic proteins, and fermentation-derived actives are more consistent, more scalable, and increasingly more effective than their natural equivalents. The sustainability premium and the performance premium are pointing the same direction.",
    trajectory: "Accelerating. Precision fermentation costs are falling 30% year-on-year. Within 5 years, the majority of high-performance skincare actives will be biotech-derived rather than agricultural. The brands that build credibility in biotech ingredients now will be the trusted names when this becomes the default.",
    nextSteps: [
      "Now (0-3 months): audit the origin of your key actives. The 'natural' marketing angle is being undermined by biotech alternatives with better efficacy profiles.",
      "Soon (3-12 months): explore partnerships with biotech ingredient suppliers — Geltor, Evolved By Nature, and Bolt Threads are all seeking brand partnerships.",
      "Bet (12-36 months): the brand that positions as the biotech beauty authority — not just using the ingredients but educating on the science — will own the next decade of premium skincare.",
    ],
    culturalContext: "The clean beauty movement created the demand for transparency about ingredient origins. Biotech actives are the next chapter: not just 'clean' but engineered to be better than nature. A consumer who already reads ingredient lists and asks where things come from is primed to understand and value the biotech story.",
    brandMoves: [
      { label: "Geltor raises $91M to scale lab-grown collagen for L'Oréal and Estée Lauder supply chains", url: "https://geltor.com" },
      { label: "Bolt Threads Microsilk licensed by Stella McCartney, lab-grown silk protein enters luxury fashion", url: "https://boltthreads.com" },
      { label: "Evolved By Nature silk proteins achieve clinical skincare efficacy in peer-reviewed trials", url: "https://evolvedbynature.com" },
      { label: "BASF launches precision fermentation skincare actives division, major chemical group bets on biotech beauty", url: "https://basf.com" },
    ],
  },

  // ── DATING ──────────────────────────────────────────────────────────────────
  {
    id: "dating-ai-assisted",
    name: "AI Enters the Chat",
    description: "Hinge launched an AI dating coach. Bumble is using AI to surface better matches. Third-party apps are writing opening lines and profile bios for millions of users. The question is shifting from whether you're good at dating apps to whether your AI is good at dating apps.",
    color: "#FF8BB4",
    topics: ["dating", "tech", "social"],
    relevanceScore: 71,
    redditQuery: "AI dating apps Hinge coach bio profile writing",
    newsQuery: "AI dating coach apps Hinge Bumble 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "When AI mediates the early stages of human connection, what changes isn't just the UX of dating apps: it's what authenticity means in a first impression. The friction point is real: people want help but don't want to feel like they're misrepresenting themselves. The apps that solve that tension will win a generation. Everything downstream of dating (weddings, cohabitation, family formation) follows.",
    trajectory: "Just getting started. AI features on major apps are still experimental but adoption is fast. The differentiation will be in how human the AI-assisted experience feels, not how capable the AI is.",
    nextSteps: [
      "Now (0-3 months): if you're building in the social or dating space, add one AI feature and watch how users actually interact with it. Behavioral data beats any survey.",
      "Soon (3-12 months): design for human-AI collaboration, not replacement. Features that make people better at expressing themselves outperform features that express things for them.",
      "Bet (12-36 months): the dating app that cracks genuine compatibility matching, not just swiping optimization, restructures the whole category.",
    ],
    culturalContext: "Dating app fatigue and the loneliness epidemic created a vacuum at the same time. People want connection but are exhausted by the mechanics of the search. AI steps in not as a replacement for human feeling but as infrastructure — reducing the friction between wanting connection and having it.",
    brandMoves: [
      { label: "Hinge launches 'Your Turn' AI coach that reviews conversation patterns and suggests better openers", url: "https://hinge.co" },
      { label: "Match Group acquires AI relationship coaching startup Lara, integrating it across its entire app portfolio", url: "https://mtch.com" },
      { label: "Bumble adds AI profile review that scores bios and conversation starters, with suggested rewrites", url: "https://bumble.com" },
      { label: "Iris AI dating app uses neural preference mapping to curate matches, growing 500K users in 6 months", url: "https://irisapp.ai" },
    ],
  },
  {
    id: "dating-slow",
    name: "Slow Dating",
    description: "Thursday (one day a week to match and meet), Once (one match per day), and a wave of IRL dating events are pushing back against swipe fatigue. People want fewer, better interactions. The infinite scroll model of dating is producing diminishing returns and the market knows it.",
    color: "#8C93C7",
    topics: ["dating", "lifestyle", "social"],
    relevanceScore: 57,
    redditQuery: "slow dating swipe fatigue app burnout IRL meeting people",
    newsQuery: "slow dating trend Thursday app alternatives 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "Slow dating is a signal about attention economics broadly: people are pushing back on infinite-scroll mechanics everywhere, not just in dating. The insight applies to content, social, and commerce. The brand that gives people a reason to slow down and pay genuine attention is doing something countercultural that actually converts and retains.",
    trajectory: "Early but real. IRL events and curated formats are growing but niche. Watch whether the mainstream apps absorb slow-dating mechanics or whether Thursday builds to scale independently.",
    nextSteps: [
      "Now (0-3 months): look at your engagement metrics. If you measure success by volume of interactions, you might be optimising for the wrong thing entirely.",
      "Soon (3-12 months): test a curated model. What happens to conversion and satisfaction when you give people fewer but better options?",
      "Bet (12-36 months): the platform that figures out intentional social connection at scale wins a generation actively rejecting the attention-drain model.",
    ],
    culturalContext: "The post-pandemic generation experienced what happens when life speeds up to the point of breaking. Slow dating is partly a wellness behaviour and partly a rejection of the commodification of connection — swiping culture made people feel like products in a catalogue.",
    brandMoves: [
      { label: "Thursday app revives the single-day dating format: matches only available on Thursdays, building scarcity and anticipation", url: "https://thursday.dating" },
      { label: "The League adds mandatory video dates before chat opens, forcing a minimum investment before swipe dynamics kick in", url: "https://theleague.com" },
      { label: "Feeld rebrands around 'intentional connection', positioning depth of interaction over volume of matches", url: "https://feeld.co" },
      { label: "Hinge's 'Most Compatible' feature surfaces one high-quality match per day, explicitly reducing decision fatigue", url: "https://hinge.co" },
    ],
  },

  // ── NIGHTLIFE ────────────────────────────────────────────────────────────────
  {
    id: "nightlife-ai-discovery",
    name: "The Algorithm Curates Your Night",
    description: "RA (Resident Advisor), Dice, and a wave of AI-powered event platforms are making nightlife discovery as data-driven as Spotify. Personalised event matching, real-time crowd analytics, NFC wristband check-in, and cashless biometric payment are turning the night out into a quantified, optimised social experience. Smart venues are beginning to adapt lighting, sound, and capacity in real time to biometric crowd data.",
    color: "#8C93C7",
    topics: ["nightlife", "tech", "ai", "entertainment"],
    relevanceScore: 59,
    redditQuery: "Dice RA Resident Advisor algorithmic event discovery nightlife app AI venue",
    newsQuery: "AI nightlife event discovery smart venue technology 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "The discovery and booking layer of nightlife is being rebuilt around personalisation and data. The platform that owns how people find their next night out owns the highest-value leisure attention moment. For brands, smart venues offer the first real opportunity to understand and respond to how people socialise in real time.",
    trajectory: "Early innings but accelerating. Event apps are adding AI recommendation layers; venues are adopting smart infrastructure. The full vision — a night out that adapts to you in real time — is 5-10 years away, but the discovery and booking layer is being built now.",
    nextSteps: [
      "Now (0-3 months): understand how your audience discovers events. The shift from word-of-mouth to algorithmic discovery is already happening — which platforms are mediating the decision?",
      "Soon (3-12 months): explore how AI event data can inform brand activation timing and placement. The platforms that know what experiences people are choosing have audience insight that is extremely valuable.",
      "Bet (12-36 months): the brand embedded in the AI-curated night out — through the discovery platform, the smart venue partnership, or the experience brand — will own a high-value attention moment that is about to be algorithmically scaled.",
    ],
    culturalContext: "The same generation that lets Spotify and Netflix make entertainment decisions for them has no philosophical objection to algorithmic nightlife curation. The barrier was always product quality — recommendations had to be genuinely better than friend suggestions. Event AI is now reaching that bar.",
    brandMoves: [
      { label: "Dice FM passes 10M monthly active users, algorithmic event discovery replaces word-of-mouth for Gen Z", url: "https://dice.fm" },
      { label: "Resident Advisor personalisation engine increases ticket conversion 60% with ML-based event matching", url: "https://ra.co" },
      { label: "Boiler Room livestream platform launches AI-driven global event discovery, democratising access to niche nightlife", url: "https://boilerroom.tv" },
      { label: "NFC wristband provider Intellitix processes 50M event check-ins, cashless biometric nightlife infrastructure scales", url: "https://intellitix.com" },
    ],
  },
  {
    id: "nightlife-immersive",
    name: "The Night Out Goes Immersive",
    description: "Meow Wolf, teamLab, Frameless, Secret Cinema, Punchdrunk: the premium night out is becoming a spatial, multi-sensory experience rather than drinks and a dance floor. People are paying 3-4x the price of a club ticket for immersive events, and they sell out. The experience is the product.",
    color: "#FF8BB4",
    topics: ["nightlife", "art", "tech"],
    relevanceScore: 67,
    redditQuery: "immersive experience Meow Wolf teamLab Secret Cinema night out",
    newsQuery: "immersive entertainment venues market growth 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "The shift from passive consumption to active participation is the experience economy maturing. Brands that create genuinely immersive experiences are generating shareable content, loyalty, and social proof that no paid media budget can match. The event is the marketing. The brands winning here are the ones where attendance is the conversation starter, not the content they post about it.",
    trajectory: "Accelerating. Investment in immersive entertainment is increasing and the consumer appetite is proven across demographics and geographies. The challenge is scaling without losing the intimacy that makes it special.",
    nextSteps: [
      "Now (0-3 months): audit your brand's experiential touchpoints. Is anything genuinely immersive or is it all standard activation formats that could belong to any brand?",
      "Soon (3-12 months): design one experience that couldn't exist as content. Something that requires presence to feel it. Even at small scale, the learning is valuable.",
      "Bet (12-36 months): brands that own flagship experiential venues will have an unfair advantage in the attention economy. The experience is the moat.",
    ],
    culturalContext: "A generation raised on video games and social media doesn't just want to watch — it wants to be inside the experience. Passive entertainment feels insufficient after years of interactive digital worlds. Immersive nightlife is the physical world finally catching up to that expectation.",
    brandMoves: [
      { label: "Secret Cinema's events sell out in minutes at £100+ per ticket, proving the premium for participation over observation", url: "https://secretcinema.org" },
      { label: "Prada partners with artist collective Random International to create a sensory installation tour across five cities", url: "https://prada.com" },
      { label: "Electric Gamebox expands to 20 cities, tech-powered group experience venues becoming a distinct nightlife format", url: "https://electricgamebox.com" },
      { label: "Dior's 'Garden of Dreams' pop-up attracts 200K visitors in 4 weeks — fashion houses entering experiential nightlife as brand-building", url: "https://dior.com" },
    ],
  },

  // ── COFFEE ──────────────────────────────────────────────────────────────────
  {
    id: "coffee-precision-tech",
    name: "Precision Coffee Engineering",
    description: "Acaia smart scales, Decent Espresso's shot-recording software, Fellow's connected kettles, and AI-assisted extraction profiling are turning home brewing into a science of data and repeatability. The specialty coffee consumer who buys £40 bags of single-origin now spends £2,000 on connected equipment to extract it exactly right. Coffee has become the hobbyist hardware category where data obsession meets flavour science.",
    color: "#FD8326",
    topics: ["coffee", "tech", "hardware", "lifestyle"],
    relevanceScore: 57,
    redditQuery: "Acaia smart scale Decent Espresso connected kettle Fellow extraction data home brewing precision",
    newsQuery: "precision coffee technology connected brewing smart equipment 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "Precision coffee is the canary in the coal mine for what happens when a hobbyist community meets connected hardware. The behaviour — obsessive data logging, social sharing of extraction parameters, community around equipment — is the same pattern that produced the quantified self movement. Where coffee goes, other sensory categories follow.",
    trajectory: "Deepening fast. AI-assisted extraction is the next frontier: machines that taste and adjust in real time. Within 3 years, consumer espresso machines will offer AI-guided extraction that produces professional results from home equipment. The connected coffee stack will be as sophisticated as the connected fitness stack.",
    nextSteps: [
      "Now (0-3 months): study the precision coffee community on Reddit and YouTube. This is the early adopter cohort for data-driven sensory experience — understanding their behaviour predicts where wider lifestyle categories go.",
      "Soon (3-12 months): explore what 'data + ritual' means for your brand. The precision coffee consumer wants their daily ritual to be both meaningful and optimised. Products that serve both needs command premium pricing.",
      "Bet (12-36 months): AI-guided sensory products — coffee, wine, food — will emerge as a premium consumer category. The brands that own the data layer of a sensory ritual will own the highest-LTV customer relationship.",
    ],
    culturalContext: "Specialty coffee already transformed a commodity into a luxury. Precision coffee is transforming that luxury into a craft with measurable standards. The extraction ratio, water temperature, and grind size are quantified and shared like fitness metrics. A generation that tracks everything has found a new thing to track.",
    brandMoves: [
      { label: "Decent Espresso DE1 backordered 6 months, connected espresso machine with shot-recording software demand exceeds supply", url: "https://decentespresso.com" },
      { label: "Acaia Pearl smart scale becomes the standard tool in 60% of specialty coffee competition setups globally", url: "https://acaia.co" },
      { label: "Fellow Stagg EKG+ connected kettle sells 500K units, smart precision brewing enters mass-premium market", url: "https://fellowproducts.com" },
      { label: "Bottomless IoT coffee canister raises $12M, weight-sensor subscription proves smart replenishment model", url: "https://bottomless.com" },
    ],
  },
  {
    id: "coffee-biotech",
    name: "Lab-Grown Coffee",
    description: "Atomo Coffee has rebuilt coffee from its molecular components without a single bean. VTT Technical Research grows coffee cells in bioreactors. Precision fermentation companies produce authentic coffee flavour compounds at a fraction of the environmental cost. With climate models projecting 50% of current coffee farmland unsuitable by 2050, biotech coffee isn't a novelty — it's the category's survival strategy.",
    color: "#A7D47C",
    topics: ["coffee", "foodtech", "biotech", "sustainability"],
    relevanceScore: 61,
    redditQuery: "lab grown coffee beanless coffee Atomo molecular coffee biotech fermentation",
    newsQuery: "lab-grown coffee biotech beanless molecular coffee 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "Coffee is a $500B global industry built entirely on a single agricultural crop facing existential climate threat. Biotech coffee is the category's hedge — and for brands that source, retail, or build culture around coffee, understanding the alternative production pipeline matters now, not in 2040. The brands that move early will own the sustainability narrative.",
    trajectory: "Pre-mainstream but approaching. Atomo has product in market. VTT bioreactor coffee has demonstrated proof of concept. The cost curve for precision fermentation is falling fast. Within 5 years, biotech coffee will be in specialty retail as a premium product. Within 10, it will be price-competitive with commodity coffee.",
    nextSteps: [
      "Now (0-3 months): map your coffee supply chain's climate vulnerability. The case for biotech coffee alternatives is not abstract — the risk is in your P&L.",
      "Soon (3-12 months): engage with the leading biotech coffee producers. Atomo, VTT, and Compound Foods are all seeking brand and retail partners to bring their products to market.",
      "Bet (12-36 months): the coffee brand that positions biotech as the premium, sustainable future of the category will own the narrative when climate disruption makes the alternative supply story urgent.",
    ],
    culturalContext: "The same consumer who buys lab-grown meat because it's better for the planet will buy biotech coffee for the same reason — if it tastes as good. The specialty coffee community's obsession with flavour science makes it the ideal testing ground for a product that needs to win on taste before it wins on sustainability.",
    brandMoves: [
      { label: "Atomo Coffee raises $40M, brings molecular beanless coffee to specialty retail in US and UK", url: "https://atomocoffee.com" },
      { label: "VTT Technical Research demonstrates bioreactor coffee cell culture at 10,000 litre scale", url: "https://vttresearch.com" },
      { label: "Compound Foods closes $10M Series A for biofermented coffee production, precision fermentation enters beverages", url: "https://compoundfoods.com" },
      { label: "Climate models project 50% of arabica farmland unsuitable by 2050, biotech coffee urgency reaches boardrooms", url: "https://worldcoffeeresearch.org" },
    ],
  },

  // ── SPORT ───────────────────────────────────────────────────────────────────
  {
    id: "sport-recovery-culture",
    name: "Recovery is the New Training",
    description: "Cold plunges, infrared saunas, HRV tracking, sleep optimization, and active recovery protocols have moved from elite sport into mainstream fitness culture. Whoop, Oura, and Theragun turned recovery into a consumer product category worth billions. People are paying as much attention to how they rebuild as to how they push.",
    color: "#A7D47C",
    topics: ["sport", "wellness", "health", "tech"],
    relevanceScore: 72,
    redditQuery: "recovery HRV cold plunge sleep fitness Whoop Oura Theragun",
    newsQuery: "recovery culture fitness wellness wearables 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "Recovery is where performance is actually built — elite sport has known this for decades but mass-market fitness just caught up. The brands that own the recovery ritual own the daily touchpoint. Whoop and Oura have shown that recovery data creates the stickiest possible health product: people who see their HRV score every morning never cancel their subscription.",
    trajectory: "Accelerating. Recovery tech is following the same premiumisation arc as performance gear. In 3 years, recovery protocols will be as standard as warm-ups. The brands building the ecosystem now will be the Nike of recovery.",
    nextSteps: [
      "Now (0-3 months): map your audience's recovery behaviours. Sleep, cold exposure, breathwork — which are they already doing? Meeting them there beats converting them.",
      "Soon (3-12 months): explore recovery-adjacent product or content. A brand that speaks intelligently about HRV or sleep quality earns credibility with the serious fitness consumer.",
      "Bet (12-36 months): the fitness brand that builds an integrated performance + recovery ecosystem owns the daily health ritual. That's 365 touchpoints a year.",
    ],
    culturalContext: "Hustle culture burned people out and the backlash is real. A generation that watched burnout destroy careers is approaching fitness with the same optimisation mindset applied to sustainability: push less, recover better, last longer. Recovery culture is anti-hustle cosplay for people who still want results.",
    brandMoves: [
      { label: "Whoop 4.0 reaches 1M+ subscribers with no screen, just biometric recovery coaching — hardware disappears into behaviour change", url: "https://whoop.com" },
      { label: "Theragun becomes a fixture in luxury hotel fitness suites, recovery technology normalised as a premium amenity", url: "https://therabody.com" },
      { label: "Oura Ring partners with NBA, NFL, and multiple national Olympic programs, elite sport legitimacy drives consumer adoption", url: "https://ouraring.com" },
      { label: "Hyperice raises $300M to expand recovery tech into professional sports venues, gyms, and physical therapy clinics", url: "https://hyperice.com" },
    ],
  },
  {
    id: "sport-fan-economy",
    name: "The Fan Becomes the Brand",
    description: "Fantasy sports, sports betting, creator athletes, NFT fan tokens, and athlete-founded brands have collapsed the distance between fan and franchise. Fans aren't passive consumers anymore — they have financial stakes, parasocial relationships with athletes who speak directly to them, and cultural identities built around team affiliation that rival religion.",
    color: "#FFD65C",
    topics: ["sport", "social", "finance", "gaming"],
    relevanceScore: 66,
    redditQuery: "sports betting fantasy athlete creator brand fan token engagement",
    newsQuery: "sports fan engagement athlete brand economy 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "When fans have money in the game — literally, through betting and fantasy, or aspirationally through fan tokens and athlete brands — their engagement depth and brand loyalty is categorically different. The sports franchise that turns fans into stakeholders has a moat that no traditional loyalty program can build. The window for brands to tap into athlete-level fandom is right now.",
    trajectory: "Accelerating. Athlete-as-creator is already the dominant model for Generation Alpha sports consumption. Live betting integration into broadcast is the next unlock. The passive sports fan is an endangered species.",
    nextSteps: [
      "Now (0-3 months): identify which athletes in your space have genuine creator communities. The athlete who speaks directly to their audience is worth more to a brand than a traditional endorsement.",
      "Soon (3-12 months): explore fan participation mechanics. Can your brand give fans a role, a voice, a stake? Even small community-building outperforms broadcast sponsorship for this audience.",
      "Bet (12-36 months): brands that own a corner of the fan identity economy — not just the jersey, but the data, the bets, the community — will be category-defining.",
    ],
    culturalContext: "Sports fandom was always identity-forming but the internet gave it infrastructure. A teenager who grew up watching their favourite athlete's daily YouTube vlog, following their brand on Instagram, and wearing their collab doesn't have a fan relationship — they have a parasocial one that operates at the intensity of friendship.",
    brandMoves: [
      { label: "LeBron James' SpringHill Company reaches $750M valuation, proving athlete-to-media-to-brand is a viable business model", url: "https://thespringhillco.com" },
      { label: "Fanatics grows to $31B valuation by owning the licensed merchandise, trading card, and gambling verticals simultaneously", url: "https://fanatics.com" },
      { label: "Socios fan token platform signs partnerships with 50 major sports clubs, financial fandom becomes a mainstream product", url: "https://socios.com" },
      { label: "F1 Drive to Survive creates a new global fan base for a sport that was stagnating — content-led audience expansion works", url: "https://formula1.com" },
    ],
  },

  // ── PETS ────────────────────────────────────────────────────────────────────
  {
    id: "pets-genomics",
    name: "The Genome-Mapped Pet",
    description: "Embark and Wisdom Panel have made canine DNA testing a mainstream purchase. The data is now driving clinical decisions: breed-specific disease risk profiles, genetically personalised nutrition protocols, and preventive care mapped to genetic markers. AI diagnostic tools are reading pet health imaging with ophthalmologist-level accuracy. The precision medicine revolution is being applied to companion animals — driven by owners who expect the same evidence-based standard of care for their pets as for themselves.",
    color: "#A7D47C",
    topics: ["pets", "health", "tech", "biotech"],
    relevanceScore: 63,
    redditQuery: "Embark dog DNA test pet genetics breed health personalised nutrition vet AI diagnosis",
    newsQuery: "pet genomics DNA testing AI veterinary precision medicine companion animals 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "Pet owners who have invested in their pet's DNA profile are making data-driven health decisions — a behaviour that compounds into premium lifetime spending. Brands serving this consumer need to understand that they're operating in a precision health context, not just a pet product context. The data-fluent pet owner will pay for products that integrate with their pet's health profile.",
    trajectory: "Rapid mainstream adoption. Embark has tested over 1M dogs. AI diagnostic tools are entering veterinary practice. Within 3 years, a pet's DNA profile will be as standard a veterinary record as their vaccination history.",
    nextSteps: [
      "Now (0-3 months): understand whether your pet consumer has tested their pet's DNA. The segment that has is different in purchase behaviour from the one that hasn't.",
      "Soon (3-12 months): explore how your pet product can reference or integrate with genomic health data. A nutrition product that responds to breed-specific needs has a defensible value proposition.",
      "Bet (12-36 months): the pet brand that builds a data-informed relationship with the pet owner — integrating vet records, DNA data, and wearable health tracking — will have the most defensible lifetime relationship in the category.",
    ],
    culturalContext: "A generation that did 23andMe for themselves had no reason not to do it for their dogs. Embark arrived at exactly the right cultural moment: scientific curiosity about DNA was normalised, the price point dropped below $100, and social sharing of pet DNA results created organic word-of-mouth. The human genomics market found its pet parallel.",
    brandMoves: [
      { label: "Embark DNA testing surpasses 1M dogs tested, population-scale canine genomics database enables new health insights", url: "https://embarkvet.com" },
      { label: "Wisdom Panel partners with Mars Petcare to integrate DNA health data into personalised nutrition product lines", url: "https://wisdompanel.com" },
      { label: "Vetology AI diagnostic platform reads pet health imaging with veterinary specialist accuracy, telehealth for animals scales", url: "https://vetology.ai" },
      { label: "Anivive biotech develops mRNA vaccine for canine cancer, precision medicine pipeline enters pet healthcare", url: "https://anivive.com" },
    ],
  },
  {
    id: "pets-tech",
    name: "Pet Tech Goes Premium",
    description: "GPS collars, AI-powered health monitors, treat-dispensing cameras, smart feeders that track eating habits, and pet wearables that sync to owner health apps are building a quantified-pet category worth $5B and growing fast. The owner who tracks their own sleep with an Oura Ring now tracks their dog's heart rate with a PetPace collar.",
    color: "#78C9A8",
    topics: ["pets", "tech", "wellness"],
    relevanceScore: 62,
    redditQuery: "pet wearable GPS tracker smart feeder pet health monitor",
    newsQuery: "pet technology wearables health monitor market 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "Pet tech follows human health tech with a predictable lag. The consumer behaviour (self-quantification, data-driven care) is identical — it just extends to the pet. Brands that serve both the human and the pet health data needs have a dual-sided relationship that's extremely sticky. The data also creates the kind of emotional attachment that makes churning unthinkable.",
    trajectory: "Early but accelerating. The hardware is proven; the software integration with vet care and human health apps is the next frontier. The brand that connects pet health data to the owner's wellness stack will be the dominant pet tech platform.",
    nextSteps: [
      "Now (0-3 months): understand which pet tech products your audience already uses. GPS and cameras have mainstream penetration; health wearables are the next step.",
      "Soon (3-12 months): if you're in wellness tech, explore pet data integration. The owner who sees their HRV next to their dog's sleep quality is deeply engaged with both products.",
      "Bet (12-36 months): the platform that aggregates family health data — human and pet — and connects it to care recommendations will be the home health OS.",
    ],
    culturalContext: "The quantified self movement produced a generation comfortable with constant biometric monitoring. That same comfort extended naturally to pets — if you track your sleep, why wouldn't you track your dog's heart rate? The technology infrastructure that made human health wearables possible at consumer price points is now making pet versions inevitable.",
    brandMoves: [
      { label: "Whistle Go Explore GPS + health collar reaches 500K units, pet location tracking becomes expected owner behaviour", url: "https://whistle.com" },
      { label: "Petcube Bites 2 camera with treat dispenser becomes the top-selling pet product on Amazon, remote pet interaction normalised", url: "https://petcube.com" },
      { label: "PetPace smart collar monitors vitals and sends vet alerts, clinical-grade pet monitoring enters the consumer market", url: "https://petpace.com" },
      { label: "Fi Series 3 dog collar raises $30M with LTE GPS and step tracking — Fitbit for dogs achieves design-object status", url: "https://tryfi.com" },
    ],
  },

  // ── PARENTING ────────────────────────────────────────────────────────────────
  {
    id: "parenting-screentime",
    name: "The Screen Time War",
    description: "Parental anxiety about screens has reached peak intensity. Monitoring apps, phone-free schools, digital detox camps, screen time limits, and parental control tech are all booming simultaneously. The same parents who are chronically online are raising children they're terrified will become chronically online. The contradiction is the market.",
    color: "#C4A0CE",
    topics: ["parenting", "kids", "tech", "wellness"],
    relevanceScore: 73,
    redditQuery: "screen time kids parenting limits phone free school digital detox",
    newsQuery: "screen time children parenting anxiety tech 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "Screen time anxiety is the defining parenting issue of the decade and it's generating a massive commercial response. From monitoring hardware to alternative activity brands, the anxious parent is a high-spending, deeply-motivated consumer. Brands that offer genuine solutions — not just products that perform safety — will build loyalty that lasts through a child's entire life.",
    trajectory: "Accelerating. Jonathan Haidt's 'The Anxious Generation' and surgeon general warnings have brought parental screen anxiety to a cultural peak. Expect legislation, school bans, and a surge in alternative activity brands.",
    nextSteps: [
      "Now (0-3 months): understand the emotional stakes for your parent consumer. Screen anxiety is about identity ('what kind of parent am I?') as much as it is about outcomes. Speak to both.",
      "Soon (3-12 months): if you're in kids' products, lean into 'screen-free' as a value proposition. The parents paying attention will pay a premium for offline alternatives.",
      "Bet (12-36 months): the brand that becomes the trusted guide for parents navigating tech — not just blocking it, but teaching healthy relationships with it — will be the parenting authority of the decade.",
    ],
    culturalContext: "Parents are the first generation raising children with smartphones in their pockets while also being the generation whose own mental health was shaped by early internet adoption. They're not anti-tech — they're terrified of repeating what they recognise as their own story. That's a very specific emotional position and it creates very specific purchasing behaviour.",
    brandMoves: [
      { label: "Bark Technologies grows to 1M+ families monitoring their children's social media for safety signals", url: "https://bark.us" },
      { label: "Pinwheel launches 'the world's safest smartphone for kids', a feature phone with parental controls built in by design", url: "https://pinwheel.com" },
      { label: "Yoto Player (screen-free audio for kids) raises $25M, parent-approved no-screen entertainment enters mainstream", url: "https://yotoplay.com" },
      { label: "Away from Screen summer camps sell out 18 months in advance at $8K+ per session — digital detox for kids as luxury experience", url: "https://awayfromscreencamp.com" },
    ],
  },
  {
    id: "parenting-village-model",
    name: "It Takes a Village (App)",
    description: "The nuclear family model is cracking under economic pressure and isolation. Parents are building co-parenting networks, sharing childcare, forming intentional communities, and using tech to coordinate the work of raising children that previous generations spread across extended families. Community parenting is being rebuilt from scratch — with apps.",
    color: "#B6D693",
    topics: ["parenting", "social", "lifestyle"],
    relevanceScore: 59,
    redditQuery: "co-parenting community childcare sharing neighbourhood family support network",
    newsQuery: "community parenting childcare sharing village model 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "Childcare costs are at record highs, parents are more isolated than any previous generation, and the extended family support structure has geographically dispersed. The vacuum is real and the market response is real: platforms that help parents coordinate care, share resources, and build community are solving a genuine infrastructure problem.",
    trajectory: "Early stage but structurally important. The economics of childcare are forcing families to find creative solutions at scale. The platform or brand that becomes the coordination layer for community parenting owns a deeply habitual, daily-use relationship.",
    nextSteps: [
      "Now (0-3 months): map the community and coordination gaps your parent audience experiences. The friction points are product opportunities.",
      "Soon (3-12 months): invest in community features over individual features. Parent products that connect people to each other are stickier than tools that serve individuals.",
      "Bet (12-36 months): the brand that becomes the infrastructure for local parent networks — coordinating childcare, school, activities, and support — will be as important as the neighbourhood itself.",
    ],
    culturalContext: "Economic necessity is forcing a rethink of the isolated nuclear family model that consumerism built. When two incomes barely cover childcare, parents start asking what community could look like. The answer is being built in neighbourhood WhatsApp groups, Facebook parenting communities, and a new category of co-parenting apps.",
    brandMoves: [
      { label: "Winnie childcare app maps local providers and parent reviews, becoming the Yelp of childcare infrastructure", url: "https://winnie.com" },
      { label: "Peanut — 'Tinder for mum friends' — reaches 2M users, solving parent social isolation at scale", url: "https://peanut-app.io" },
      { label: "Babylist grows to $1B as a registry that becomes a parenting platform, community touchpoint through the whole journey", url: "https://babylist.com" },
      { label: "UrbanSitter scales from babysitter marketplace to trusted neighbourhood care network in 60 US cities", url: "https://urbansitter.com" },
    ],
  },

  // ── KIDS ────────────────────────────────────────────────────────────────────
  {
    id: "kids-creative-tech",
    name: "Kids Build, Not Just Watch",
    description: "Scratch, Roblox's developer tools, LEGO Spike, Kano computers, and a wave of maker kits are positioning the next generation as creators rather than consumers of technology. The fastest-growing kids' media category is 'how to make things' — coding tutorials, craft channels, and build-along content that turns watching into doing.",
    color: "#FFD65C",
    topics: ["kids", "creativity", "tech", "education"],
    relevanceScore: 67,
    redditQuery: "kids coding scratch roblox LEGO maker kit programming children",
    newsQuery: "kids creative technology coding maker education 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "The kids who are building games on Roblox today are tomorrow's designers, engineers, and entrepreneurs. Brands that become part of a child's creative toolkit earn a loyalty that lasts a lifetime. The maker movement for kids is producing the most capable creative generation ever — the brands helping them build will be the ones they remember.",
    trajectory: "Accelerating. AI tools are lowering the floor for what kids can create — a 9-year-old can now build a functional app with AI assistance. The creative ceiling is moving up at the same time. The brands that stay ahead of both will define the next generation of digital creativity.",
    nextSteps: [
      "Now (0-3 months): look at where kids are creating in your category. Roblox, YouTube, TikTok — there's a creative economy operating for every demographic. Are you in it?",
      "Soon (3-12 months): give kids the tools to create with your brand. User-generated content at the kids level is brand education that's more effective than any campaign.",
      "Bet (12-36 months): the brand that becomes part of a child's creative identity — not just a product they use but a tool they build with — has won a customer for decades.",
    ],
    culturalContext: "Children's media consumption peaked and is now being countered by a parent-led push toward creation. The same parents worried about screen time are willing to extend it for 'educational' screen time. Coding, making, and building are the sanctioned screens — smart brands are positioning their products as tools, not toys.",
    brandMoves: [
      { label: "Roblox passes 80M daily active users, the majority of whom spend time creating content rather than just consuming it", url: "https://roblox.com" },
      { label: "LEGO Spike robotics kits become the default STEM kit in 50,000 schools globally, building to computing pipeline established", url: "https://lego.com" },
      { label: "Kano computer kit pivots to AI education, teaching kids to build and interrogate AI systems rather than just use them", url: "https://kano.me" },
      { label: "Osmo's hands-on iPad learning system reaches 30M kids, physical-digital creative play becomes a mainstream format", url: "https://playosmo.com" },
    ],
  },
  {
    id: "kids-ai-learning",
    name: "AI Tutors for Every Child",
    description: "Khan Academy's Khanmigo, Synthesis, and a wave of AI-native learning tools are giving every child access to a Socratic tutor that adapts to exactly where they're stuck. Adaptive curriculum engines adjust in real time to how a child learns — not just what they've covered. The one-size-fits-all classroom model is being disrupted from outside by AI that can be every child's most patient, most personalised teacher.",
    color: "#FF8BB4",
    topics: ["kids", "education", "tech", "ai"],
    relevanceScore: 73,
    redditQuery: "AI tutor kids learning adaptive Khanmigo Synthesis personalised education children",
    newsQuery: "AI tutoring children personalised learning education technology 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "Every child now has access to unlimited, patient, adaptive tutoring that previously only existed for the privileged. The brands and platforms building this shift are writing the curriculum of the next generation. Every consumer brand selling to parents of school-age children needs to understand what literacy, creativity, and learning will mean when it's AI-augmented from day one.",
    trajectory: "Rapid institutionalisation. AI tutoring is moving from supplementary tool to primary learning relationship for many children. As AI models become better than average human teachers at adapting to individual learning gaps, the entire private tutoring market will restructure around AI-first delivery.",
    nextSteps: [
      "Now (0-3 months): understand what AI learning tools the parents in your audience are already using. The adoption is faster than most brands assume — Khanmigo is in 500+ US school districts.",
      "Soon (3-12 months): explore content and product integrations with AI learning platforms. Brands that understand a child's learning profile have a far richer context for product relevance.",
      "Bet (12-36 months): the brand embedded in how children learn — through curriculum integration, co-creation tools, or educational content — will have a relationship with the next generation of consumers from day one.",
    ],
    culturalContext: "The generation of parents who grew up with Google are now raising children with AI tutors. The shift is accelerating: teachers are adopting AI tools, schools are integrating them into curricula, and the private tutoring market is being restructured. A child starting school today will have AI as a permanent study partner throughout their education.",
    brandMoves: [
      { label: "Khan Academy Khanmigo adopted by 500 US school districts, AI Socratic tutoring enters mainstream education", url: "https://khanacademy.org" },
      { label: "Synthesis AI tutor raises $80M, personalised STEM education for children achieves category scale", url: "https://synthesis.com" },
      { label: "DreamBox Learning adaptive maths engine shows 47% better outcomes vs standard instruction in 5-year study", url: "https://dreambox.com" },
      { label: "Google Socratic reaches 50M student downloads, AI homework assistant normalised for every age group", url: "https://socratic.org" },
    ],
  },

  // ── MOBILITY ────────────────────────────────────────────────────────────────
  {
    id: "mobility-micro",
    name: "Micro-Mobility Goes Daily",
    description: "E-scooters, e-bikes, and cargo bikes are outperforming cars for urban last-mile journeys — and the infrastructure is finally catching up. Lime, Bird, and Cowboy are competing for the daily commuter. European cities are redesigning streets around two-wheeled electric mobility. The car is losing the city, one kilometre at a time.",
    color: "#8C93C7",
    topics: ["mobility", "sustainability", "tech", "lifestyle"],
    relevanceScore: 69,
    redditQuery: "e-scooter e-bike micro mobility urban commute electric bike city",
    newsQuery: "micro mobility e-scooter e-bike urban market 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "Urban mobility is in a once-in-a-century transition. The brands that own the daily commute own a consumer touchpoint that happens 250+ times a year. E-bikes in particular are creating conversion from cars — not supplementing them. The urban consumer who makes that switch is a permanently changed customer for fuel, parking, insurance, and maintenance categories.",
    trajectory: "Accelerating in Europe, early innings in North America. City infrastructure investment is the unlock — where bike lanes go, e-bike adoption follows. Cargo e-bikes are the next category inflection: they're converting the car trip that carries things, not just people.",
    nextSteps: [
      "Now (0-3 months): if your brand serves urban commuters, understand their micro-mobility behaviour. The consumer who bikes to work every day has a different morning routine than one who drives.",
      "Soon (3-12 months): explore micro-mobility partnership or co-branding. The brands embedded in the daily commute ritual are the ones people see every day.",
      "Bet (12-36 months): cargo e-bikes will replace the car for the majority of urban family shopping and school runs in dense cities. The brands building for that use case now are a decade ahead.",
    ],
    culturalContext: "Urban congestion, parking costs, and climate guilt combined with genuine product improvement (battery range, weight, design) to tip e-bikes from niche to necessary in European cities. It's not a values-led behaviour change — it's a utility-led one where the product is now better than the alternative. Culture follows product when the product is genuinely superior.",
    brandMoves: [
      { label: "Cowboy e-bike raises €80M and becomes the design-object e-bike in Brussels, Paris, and Amsterdam commuter culture", url: "https://cowboy.com" },
      { label: "Tern cargo e-bikes see 400% growth as urban families substitute school-run cars — the family car replacement thesis plays out", url: "https://ternbicycles.com" },
      { label: "Lime surpasses 400M scooter rides globally, shared micro-mobility embedded as utility infrastructure in 200+ cities", url: "https://li.me" },
      { label: "VanMoof (despite bankruptcy) creates the template for fashion-forward e-bikes that competitors now replicate", url: "https://vanmoof.com" },
    ],
  },
  {
    id: "mobility-ev-identity",
    name: "EV as Lifestyle Statement",
    description: "Tesla made the electric vehicle a status symbol before it was a practicality. Now Rivian, Lucid, Polestar, and a wave of Chinese brands are competing for the lifestyle EV consumer — someone who cares as much about what the car says about them as what it does. Software updates, over-the-air features, and brand community are the new competitive advantages.",
    color: "#FFB04A",
    topics: ["mobility", "luxury", "tech", "sustainability"],
    relevanceScore: 65,
    redditQuery: "EV lifestyle Tesla Rivian Polestar electric car identity community",
    newsQuery: "electric vehicle lifestyle luxury identity brand 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "The EV transition is creating a new car buyer psychology: one where software, community, and brand values matter as much as horsepower and cup holders. Brands that build genuine communities around their vehicles — owners who identify as Rivian people, not just Rivian owners — have built the same moat Tesla has. The EV purchase is an identity statement, and identity statements drive premium pricing and loyalty.",
    trajectory: "The premium EV market is maturing fast. Chinese brands (BYD, NIO, Xpeng) are bringing mass-market pricing that will commoditise the technology while the lifestyle premium migrates upward. The winners will be the brands that own the identity and community layers, not just the battery.",
    nextSteps: [
      "Now (0-3 months): study your target consumer's EV consideration behaviour. It's a lifestyle research process, not a car-shopping one. The community they consult matters.",
      "Soon (3-12 months): build content and community around your brand's values alignment with EV culture. Sustainability, tech, and design are the three pillars — which is yours?",
      "Bet (12-36 months): the EV brand that builds the most coherent lifestyle ecosystem — events, charging network, software, community — will retain customers across multiple vehicle purchases.",
    ],
    culturalContext: "Car ownership was already declining as an aspirational goal for urban Gen Z. The EV reframed it: instead of a car, it's a tech product that you happen to drive. That repositioning worked — EV ownership rates are highest among demographics that were trending away from car ownership entirely. The product change created a new consumer.",
    brandMoves: [
      { label: "Rivian builds owner community from day one — launch events, adventure partnerships, and software updates feel like Apple product drops", url: "https://rivian.com" },
      { label: "Polestar positions as the 'anti-Tesla' for design-conscious progressives, wins Scandinavian minimalist market through pure aesthetic positioning", url: "https://polestar.com" },
      { label: "NIO launches NIO House member clubs in major cities — EV brand as lifestyle club with physical presence", url: "https://nio.com" },
      { label: "BYD reaches 3M annual EV sales, proving mass-market price points are viable and accelerating the whole category", url: "https://byd.com" },
    ],
  },

  // ── SPIRITUALITY ─────────────────────────────────────────────────────────────
  {
    id: "spirituality-longevity-ritual",
    name: "Longevity as Secular Religion",
    description: "Bryan Johnson's Blueprint protocol, biological age testing, daily cold plunge rituals, red light therapy, and fasting windows have created a new category of practice that functions exactly like religion: daily observance, quantified devotion, community, and a framework for meaning. The longevity movement isn't just a health trend — it's a secular spiritual architecture for people who want their mortality to be measurable and deferrable.",
    color: "#C4A0CE",
    topics: ["spirituality", "wellness", "tech", "health", "longevity"],
    relevanceScore: 67,
    redditQuery: "Bryan Johnson Blueprint longevity biological age testing protocol anti-aging biohacking",
    newsQuery: "longevity technology biological age testing Bryan Johnson anti-aging 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "The longevity consumer is the wellness consumer at their most data-driven and their most spiritually motivated. They believe optimising their biology is a moral project. The brands that serve this consumer need to understand they're operating in a meaning context as much as a health context. The daily ritual is the product; the supplement or device is just the anchor.",
    trajectory: "Entering the mainstream. Bryan Johnson has made biological optimisation culturally legible. Prenuvo full-body MRI screenings are booked 18 months out. Biological age testing companies are proliferating. The longevity consumer will be a defined mass-market segment within 5 years.",
    nextSteps: [
      "Now (0-3 months): understand the longevity consumer's daily protocol. It's a stack of rituals, not a single product purchase. Where your brand fits in the stack determines your relationship to their daily practice.",
      "Soon (3-12 months): explore how your brand can be positioned as a longevity ritual anchor rather than just a health product. The protocol-adherent consumer has radically higher retention once a product is integrated into their daily practice.",
      "Bet (12-36 months): the brand that becomes the trusted scientific authority in the longevity ritual space — educating as much as selling — will own the most engaged and highest-spending wellness consumer segment.",
    ],
    culturalContext: "Institutional religion in decline created a meaning vacuum. The longevity movement filled it for a specific consumer: data-fluent, science-oriented, and deeply anxious about mortality. Bryan Johnson's willingness to make his entire biological optimisation public — and to frame it as a spiritual project as much as a scientific one — created the cultural permission structure for this consumer to exist.",
    brandMoves: [
      { label: "Bryan Johnson's Blueprint protocol followed by 100K people globally, open-source longevity as cultural movement", url: "https://blueprint.bryanjohnson.com" },
      { label: "Prenuvo full-body MRI screening waitlist hits 18 months in major US cities, preventive longevity medicine goes premium", url: "https://prenuvo.com" },
      { label: "TalentPath biological age test reaches 500K users, measuring real age vs chronological age becomes consumer behaviour", url: "https://trudiagnostic.com" },
      { label: "Longevity retreat market grows 400%, 5-day biological optimisation experiences reach $10,000 price points", url: "https://longevity.technology" },
    ],
  },
  {
    id: "spirituality-neurotech",
    name: "Neurotech Meets Mindfulness",
    description: "EEG headbands, neurofeedback devices, HRV-guided meditation, and AI breathing coaches are bringing clinical neuroscience into the daily mindfulness practice. Muse, Neurosity, and a wave of consumer neurotech devices are making brainwave data as accessible as heart rate data.",
    color: "#8C93C7",
    topics: ["spirituality", "wellness", "tech", "health"],
    relevanceScore: 67,
    redditQuery: "neurotech meditation EEG headband HRV mindfulness biofeedback",
    newsQuery: "neurotech meditation consumer mindfulness brain technology",
    position: { x: 0, y: 0 },
    whyRelevant: "The combination of neuroscience instrumentation and ancient contemplative practice is producing measurable outcomes that spiritual products previously only claimed. Brands that can bridge 'it works' with 'it means something' will own the premium mindfulness market.",
    trajectory: "Consumer neurotech for mindfulness will follow the wearable fitness arc: first premium, then accessible, then ubiquitous. EEG quality that required $50K lab equipment in 2010 is now in a $299 headband. Within 3 years, AI-guided neurofeedback meditation will be a standard wellness product.",
    nextSteps: [
      "Audit the neurofeedback and biometric meditation space — Muse, Neurosity, and Apollo are all proving different parts of the model",
      "Explore content integrations with HRV and neurotech data to make mindfulness products feel evidence-based rather than aspirational",
    ],
    culturalContext: "A generation that quantifies everything — sleep, steps, glucose — needs mindfulness to speak the same language. Neurotech makes inner experience legible as data, which is exactly the framing a data-fluent consumer can trust and act on.",
    brandMoves: [
      { label: "Muse headband hits 1M users with real-time brainwave meditation feedback — neurofeedback goes consumer", url: "https://choosemuse.com" },
      { label: "Apollo Neuro wearable uses vibration to shift nervous system state, FDA breakthrough device designation", url: "https://apolloneuro.com" },
      { label: "Oura Ring adds HRV-guided meditation timing, pushing biometric spirituality into 2M existing users", url: "https://ouraring.com" },
      { label: "Calm partners with neuroscience labs to develop AI meditation protocols adapting to real-time brainwave state", url: "https://calm.com" },
    ],
  },

  // ── FINANCE ─────────────────────────────────────────────────────────────────
  {
    id: "finance-defi-everyday",
    name: "DeFi Hits the High Street",
    description: "Decentralised finance has moved from crypto-native forums into mainstream consumer apps. Revolut, Monzo, and PayPal now offer staking, yield products, and token exposure alongside current accounts. The average consumer doesn't know what a smart contract is — but they're using one when they earn 4% on idle cash.",
    color: "#FFD65C",
    topics: ["finance", "tech", "retail"],
    relevanceScore: 68,
    redditQuery: "DeFi mainstream consumer finance yield staking everyday banking",
    newsQuery: "DeFi mainstream consumer banking 2025 2026",
    position: { x: 0, y: 0 },
    whyRelevant: "When decentralised finance products sit inside the apps that 50M people use to pay rent, the distinction between DeFi and TradFi collapses. The brands that make yield, lending, and crypto exposure frictionless within existing financial habits will own the next decade of financial services. The infrastructure is ready; the UX war is just starting.",
    trajectory: "Accelerating. Regulatory clarity in the EU and UK is opening the door for mainstream banks to offer on-chain products directly. Within 3 years, most consumer fintech apps will have an embedded DeFi layer whether they call it that or not.",
    nextSteps: [
      "Now (0-3 months): audit what your financial product offers on idle cash. If the answer is less than a high-street savings rate, you're losing customers to apps that plug into DeFi yield.",
      "Soon (3-12 months): explore embedded yield products — BNPL providers, loyalty platforms, and e-commerce brands are all building on-chain earning into their customer wallets.",
      "Bet (12-36 months): the brand that makes DeFi feel like a normal bank feature — not a crypto product — owns the mass-market financial consumer for a generation.",
    ],
    culturalContext: "The 2022 crypto crash didn't kill decentralised finance — it killed the speculation framing. What survived was the infrastructure. A generation that watched savings rates sit at 0% for a decade is primed to route money toward wherever yield actually exists, even if the mechanism is a smart contract they'll never read.",
    brandMoves: [
      { label: "Revolut launches Revolut X crypto exchange and integrates staking directly into the main app for 40M users", url: "https://revolut.com" },
      { label: "PayPal's PYUSD stablecoin reaches $1B in circulation, mainstreaming stablecoin payments for e-commerce", url: "https://paypal.com" },
      { label: "Coinbase's Base L2 network processes more transactions than Ethereum mainnet, infrastructure scale achieved", url: "https://coinbase.com" },
      { label: "Nubank in Brazil integrates DeFi yield products for 80M users, largest emerging-market fintech goes on-chain", url: "https://nubank.com.br" },
    ],
  },
  {
    id: "finance-financial-identity",
    name: "Money as Self-Expression",
    description: "How you spend, save, and invest has become a public identity statement. YNAB communities, Frugal subreddits, loud budgeting on TikTok, ethical investing portfolios shared openly: personal finance is no longer private. The tools that make financial behaviour visible and shareable are winning the generation that grew up posting everything.",
    color: "#78C9A8",
    topics: ["finance", "lifestyle", "social"],
    relevanceScore: 61,
    redditQuery: "loud budgeting frugal FIRE financial independence spending habits identity",
    newsQuery: "loud budgeting financial identity Gen Z money trends 2025",
    position: { x: 0, y: 0 },
    whyRelevant: "When financial behaviour becomes identity, the brands that align with a financial value set earn loyalty that transcends product features. Frugal-coded brands, ethical-investment platforms, and loud-budgeting apps are building communities, not just customer bases. The opportunity is in making financial choices feel like a statement rather than a transaction.",
    trajectory: "Stabilising into a cultural norm. Financial transparency is becoming expected rather than exceptional for Gen Z and younger Millennials. The brands that treat money talk as embarrassing are the ones that will feel dated.",
    nextSteps: [
      "Now (0-3 months): look at how your brand appears in financial identity communities — FIRE forums, frugal subreddits, ethical investing groups. Are you showing up at all?",
      "Soon (3-12 months): build shareable financial features. A savings milestone, an impact report, a carbon-offset statement: give people a reason to post about their relationship with your product.",
      "Bet (12-36 months): brands that make their customers feel smart and intentional about money will outlast brands that just compete on rates and fees.",
    ],
    culturalContext: "A generation locked out of home ownership and burdened by student debt found community in talking openly about money. Loud budgeting and FIRE culture are partly practical, partly political — a rejection of the consumerism that previous generations used money to fuel. Spending less became a flex before spending more stopped being one.",
    brandMoves: [
      { label: "YNAB (You Need A Budget) grows to 1M paid subscribers, community-driven financial planning becomes a cultural movement", url: "https://youneedabudget.com" },
      { label: "Monzo's year-in-review spending summaries go viral annually, personal finance data as social content", url: "https://monzo.com" },
      { label: "Claro Money (ethical fintech) grows 300% on the back of climate-conscious investing demand from under-35s", url: "https://claromoney.com" },
      { label: "TikTok's #loudbudgeting reaches 500M views, financial transparency becomes a mainstream content format", url: "https://tiktok.com" },
    ],
  },
];

// ─── Topic Library ────────────────────────────────────────────────────────────

export const TOPIC_LIBRARY: Record<string, Trend[]> = {
  // Topics with pre-built trends
  gaming:           EXTENDED_TRENDS.filter(t => t.topics?.includes("gaming")),
  wellness:         EXTENDED_TRENDS.filter(t => t.topics?.includes("wellness")),
  "food-tech":      EXTENDED_TRENDS.filter(t => t.topics?.includes("food-tech")),
  "mental-health":  EXTENDED_TRENDS.filter(t => t.topics?.includes("mental-health")),
  "interior-design":EXTENDED_TRENDS.filter(t => t.topics?.includes("interior-design")),
  travel:           EXTENDED_TRENDS.filter(t => t.topics?.includes("travel")),
  fitness:          EXTENDED_TRENDS.filter(t => t.topics?.includes("fitness")),
  music:            EXTENDED_TRENDS.filter(t => t.topics?.includes("music")),
  art:              EXTENDED_TRENDS.filter(t => t.topics?.includes("art")),
  skincare:         EXTENDED_TRENDS.filter(t => t.topics?.includes("skincare")),
  luxury:           EXTENDED_TRENDS.filter(t => t.topics?.includes("luxury")),
  food:             EXTENDED_TRENDS.filter(t => t.topics?.includes("food")),
  creativity:       EXTENDED_TRENDS.filter(t => t.topics?.includes("creativity")),
  photography:      EXTENDED_TRENDS.filter(t => t.topics?.includes("photography")),
  film:             EXTENDED_TRENDS.filter(t => t.topics?.includes("film")),
  branding:         EXTENDED_TRENDS.filter(t => t.topics?.includes("branding")),
  fragrance:        EXTENDED_TRENDS.filter(t => t.topics?.includes("fragrance")),
  jewellery:        EXTENDED_TRENDS.filter(t => t.topics?.includes("jewellery")),
  retail:           EXTENDED_TRENDS.filter(t => t.topics?.includes("retail")),
  social:           EXTENDED_TRENDS.filter(t => t.topics?.includes("social")),
  education:        EXTENDED_TRENDS.filter(t => t.topics?.includes("education")),
  // Topics with cross-tagged extended trends
  fashion:          EXTENDED_TRENDS.filter(t => t.topics?.includes("fashion")),
  beauty:           EXTENDED_TRENDS.filter(t => t.topics?.includes("beauty")),
  lifestyle:        EXTENDED_TRENDS.filter(t => t.topics?.includes("lifestyle")),
  health:           EXTENDED_TRENDS.filter(t => t.topics?.includes("health")),
  sustainability:   EXTENDED_TRENDS.filter(t => t.topics?.includes("sustainability")),
  // Topics with pre-built trends via topic tag
  dating:           EXTENDED_TRENDS.filter(t => t.topics?.includes("dating")),
  nightlife:        EXTENDED_TRENDS.filter(t => t.topics?.includes("nightlife")),
  coffee:           EXTENDED_TRENDS.filter(t => t.topics?.includes("coffee")),
  finance:          EXTENDED_TRENDS.filter(t => t.topics?.includes("finance")),
  // Topics with pre-built trends via topic tag
  sport:            EXTENDED_TRENDS.filter(t => t.topics?.includes("sport")),
  pets:             EXTENDED_TRENDS.filter(t => t.topics?.includes("pets")),
  parenting:        EXTENDED_TRENDS.filter(t => t.topics?.includes("parenting")),
  kids:             EXTENDED_TRENDS.filter(t => t.topics?.includes("kids")),
  mobility:         EXTENDED_TRENDS.filter(t => t.topics?.includes("mobility")),
  spirituality:     EXTENDED_TRENDS.filter(t => t.topics?.includes("spirituality")),
  // Emerging tech topics — no pre-built library trends; fall through to AI generation
  ai:               [],
  biotech:          [],
  robotics:         [],
  "climate-tech":   [],
  space:            [],
  web3:             [],
  "ar-vr":          [],
  fintech:          [],
  medtech:          [],
  "smart-home":     [],
  cybersecurity:    [],
  "synthetic-biology": [],
  "future-of-work": [],
};

// Culture domains available in autocomplete — these are the topics you search.
// The "emerging tech" side (AI, AR/VR, robotics, web3…) is always the lens,
// never the search term. Emerging Tech × Fashion, not Emerging Tech × AI.
export const LIBRARY_TOPICS = [
  "fashion", "beauty", "gaming", "wellness", "food-tech", "mental-health",
  "sustainability", "health", "interior-design", "travel", "fitness",
  "music", "art", "skincare", "luxury", "food", "creativity",
  "photography", "film", "branding", "retail", "social", "education",
  "sport", "mobility", "dating", "nightlife", "coffee", "finance",
  "pets", "parenting", "kids", "spirituality", "fragrance", "jewellery",
];

// Curated topics shown on the initial empty state screen
export const FEATURED_TOPICS = [
  "fashion", "beauty", "gaming", "music", "food-tech", "travel",
  "wellness", "luxury", "dating", "fitness", "sustainability", "social",
];

// ─── Extended Signals ─────────────────────────────────────────────────────────

export const EXTENDED_SIGNALS: Signal[] = [
  // gaming-npc-aesthetics
  { id: "gnpc-s1", trendId: "gaming-npc-aesthetics", title: "Miu Miu AW24 collection references NPC stillness", summary: "Fashion houses are borrowing the deliberate flatness of video game character design as a counterpoint to the maximalism of the past decade.", source: "news", sourceName: "Vogue", date: "2026-06-17", crossLinks: [] },
  { id: "gnpc-s2", trendId: "gaming-npc-aesthetics", title: "r/streetwear: NPC mode is the new core aesthetic", summary: "The NPC aesthetic has crossed from ironic TikTok content into genuine subcultural style positioning.", source: "reddit", sourceName: "r/streetwear", date: "2026-06-10", crossLinks: [] },
  { id: "gnpc-s3", trendId: "gaming-npc-aesthetics", title: "SSENSE editorial: 'dressing like you spawned'", summary: "Independent fashion media is legitimising gaming-derived aesthetics with editorial frames, signalling movement from fringe to fashion mainstream.", source: "news", sourceName: "SSENSE", date: "2026-06-12", crossLinks: [] },

  { id: "gnpc-s4", trendId: "gaming-npc-aesthetics", title: "Uniqlo NPC capsule sells out in 14 hours across 40 markets", summary: "Mass-market adoption of the NPC aesthetic confirms the trend has crossed from niche gaming culture into global mainstream fashion demand.", source: "news", sourceName: "Business of Fashion", date: "2026-05-28", crossLinks: [] },
  { id: "gnpc-s5", trendId: "gaming-npc-aesthetics", title: "r/malefashionadvice: I went full NPC this month, only neutrals, one silhouette, no effort", summary: "Community-led style experiments with NPC dressing reveal a genuine consumer appetite for algorithmic minimalism as a relief from trend fatigue.", source: "reddit", sourceName: "r/malefashionadvice", date: "2026-05-30", crossLinks: [] },
  { id: "gnpc-s6", trendId: "gaming-npc-aesthetics", title: "Dover Street Market dedicates floor to 'non-playable character' concept", summary: "Concept retail is treating NPC aesthetics as a serious design direction, signalling that gaming culture's influence on fashion has reached the luxury independent tier.", source: "news", sourceName: "Hypebeast", date: "2026-05-10", crossLinks: [] },
  { id: "gnpc-s7", trendId: "gaming-npc-aesthetics", title: "TikTok NPC fashion filter drives 2B views, algorithm amplifies the aesthetic loop", summary: "Platform mechanics are accelerating the NPC aesthetic cycle: the same algorithmic flatness that inspires the look is now distributing it at unprecedented scale.", source: "news", sourceName: "The Verge", date: "2026-04-15", crossLinks: [] },
  { id: "gnpc-s8", trendId: "gaming-npc-aesthetics", title: "Zara NPC lookbook outperforms its entire SS26 editorial campaign by 3x engagement", summary: "Fast fashion's rapid adoption of gaming aesthetics proves the trend's commercial mass, and the speed at which gaming-native aesthetics can travel to high street.", source: "news", sourceName: "WGSN", date: "2026-03-20", crossLinks: [] },

  // gaming-drop-economy
  { id: "gdrop-s1", trendId: "gaming-drop-economy", title: "Nike SNKRS waitlist psychology crosses into luxury", summary: "Limited digital drops in gaming have trained a generation to expect scarcity theatre; fashion brands are copying the mechanics wholesale.", source: "news", sourceName: "Business of Fashion", date: "2026-06-19", crossLinks: [] },
  { id: "gdrop-s2", trendId: "gaming-drop-economy", title: "Loot box litigation fuelling regulation that could touch blind box fashion drops", summary: "Legal challenges to randomised-reward mechanics in gaming are creating regulatory precedents that will eventually touch physical fashion's mystery drop formats.", source: "news", sourceName: "Wired", date: "2026-06-11", crossLinks: [] },
  { id: "gdrop-s3", trendId: "gaming-drop-economy", title: "Fortnite x Balenciaga drives $40M in 72-hour digital-physical sales", summary: "Cross-platform drops combining in-game digital items with physical clothing are setting new records for fashion's gaming crossover moment.", source: "news", sourceName: "Hypebeast", date: "2026-05-25", crossLinks: [] },
  { id: "gdrop-s4", trendId: "gaming-drop-economy", title: "Supreme tests 'battle pass' model with seasonal loyalty tiers, results beat standard drops", summary: "Subscription-based drop access is proving more financially stable than one-off hype events, with Supreme's test showing 40% higher average order value.", source: "news", sourceName: "Business of Fashion", date: "2026-05-02", crossLinks: [] },
  { id: "gdrop-s5", trendId: "gaming-drop-economy", title: "r/Sneakers: waiting 6 hours in a queue for a drop still hits different than buying retail", summary: "Community testimony confirms that scarcity mechanics create emotional investment that transcends rational purchase behaviour, the experience is the product.", source: "reddit", sourceName: "r/Sneakers", date: "2026-04-10", crossLinks: [] },
  { id: "gdrop-s6", trendId: "gaming-drop-economy", title: "H&M gamifies its loyalty app with 'unlock' mechanics, engagement up 60%", summary: "Mass market retail adopting gaming unlock mechanics for loyalty programs signals that the drop economy has diffused into everyday retail infrastructure.", source: "news", sourceName: "Retail Week", date: "2026-03-15", crossLinks: [] },
  { id: "gdrop-s7", trendId: "gaming-drop-economy", title: "Sephora's Beauty Insider drop event crashes app servers, demand outpaces infrastructure", summary: "Beauty's adoption of gaming-style drop events has proven consumer demand is real, the challenge is scaling the infrastructure for coordinated desire.", source: "news", sourceName: "WWD", date: "2026-02-20", crossLinks: [] },

  // wellness-cold-ritual
  { id: "wcold-s1", trendId: "wellness-cold-ritual", title: "Plunge pool installations in luxury hotel fitness suites double in 2025", summary: "Cold exposure has moved from athlete recovery niche to amenity expectation, signalling mainstream aspirational adoption.", source: "news", sourceName: "Financial Times", date: "2026-06-16", crossLinks: [] },
  { id: "wcold-s2", trendId: "wellness-cold-ritual", title: "Cold plunge hardware enters premium home design, Plunge Pro sells out 3x", summary: "The cold plunge market is developing the same design-object logic as premium coffee equipment.", source: "news", sourceName: "TechCrunch", date: "2026-06-09", crossLinks: [] },
  { id: "wcold-s3", trendId: "wellness-cold-ritual", title: "r/coldplunge hits 500k members as mainstream adoption accelerates", summary: "Community growth signals the cold exposure ritual has fully crossed from fringe biohacking into mainstream wellness identity.", source: "reddit", sourceName: "r/coldplunge", date: "2026-06-14", crossLinks: [] },
  { id: "wcold-s4", trendId: "wellness-cold-ritual", title: "Wim Hof protocol reaches mainstream fitness apps, Peloton adds cold exposure module", summary: "Platform distribution of cold exposure protocols to tens of millions of users normalises the practice far beyond the biohacker community that pioneered it.", source: "news", sourceName: "CNBC", date: "2026-05-28", crossLinks: [] },
  { id: "wcold-s5", trendId: "wellness-cold-ritual", title: "r/Biohackers: cold plunge + sauna stack is now my non-negotiable morning ritual", summary: "Hot-cold contrast therapy is being adopted as a structured daily system rather than occasional practice, creating recurring hardware and membership revenue opportunities.", source: "reddit", sourceName: "r/Biohackers", date: "2026-05-24", crossLinks: [] },
  { id: "wcold-s6", trendId: "wellness-cold-ritual", title: "Airbnb listings featuring cold plunge command 35% premium, hosts installing fast", summary: "Consumer willingness to pay a premium for cold exposure access as part of travel signals full lifestyle category adoption.", source: "news", sourceName: "Bloomberg", date: "2026-05-05", crossLinks: [] },
  { id: "wcold-s7", trendId: "wellness-cold-ritual", title: "Equinox partners with Plunge to install cold therapy stations in all 100 flagship locations", summary: "Premium gym chain investment in cold exposure infrastructure confirms the ritual has become a membership retention tool, not just a wellness fad.", source: "news", sourceName: "Business Insider", date: "2026-04-20", crossLinks: [] },
  { id: "wcold-s8", trendId: "wellness-cold-ritual", title: "r/wellness: the discipline of cold exposure transfers, I'm more productive after 3 months", summary: "Community reports of second-order benefits (mental clarity, discipline, focus) from cold exposure are driving word-of-mouth beyond the fitness context into productivity culture.", source: "reddit", sourceName: "r/wellness", date: "2026-03-10", crossLinks: [] },
  { id: "wcold-s9", trendId: "wellness-cold-ritual", title: "Hyperice launches smart cold therapy device with biometric recovery tracking", summary: "Cold therapy hardware is adding data layers, biometric integration transforms cold exposure from ritual into measurable recovery protocol.", source: "news", sourceName: "TechCrunch", date: "2026-02-15", crossLinks: [] },

  // wellness-cortisol
  { id: "wcort-s1", trendId: "wellness-cortisol", title: "Glossier launches stress-aware skincare sub-line citing cortisol science", summary: "Major beauty brands are explicitly building cortisol management into product briefs, treating chronic stress as a skin-level phenomenon.", source: "news", sourceName: "WWD", date: "2026-06-18", crossLinks: [] },
  { id: "wcort-s2", trendId: "wellness-cortisol", title: "Office design pivoting to low-arousal environments after burnout wave", summary: "Workplace design is borrowing therapeutic neuroscience, creating demand for materials and objects engineered to reduce physiological stress responses.", source: "news", sourceName: "Dezeen", date: "2026-06-12", crossLinks: [] },
  { id: "wcort-s3", trendId: "wellness-cortisol", title: "Adaptogens cross $8B market as cortisol anxiety mainstreams", summary: "The adaptogen supplement category is growing 30% YoY as cortisol reduction becomes an explicit consumer purchase motivation.", source: "news", sourceName: "Mintel", date: "2026-05-30", crossLinks: [] },
  { id: "wcort-s4", trendId: "wellness-cortisol", title: "Oura Ring adds cortisol pattern tracking via heart rate variability inference", summary: "Wearable platforms are making stress biology legible in real time, enabling consumers to manage cortisol as a tracked biometric rather than a vague feeling.", source: "news", sourceName: "Wired", date: "2026-05-25", crossLinks: [] },
  { id: "wcort-s5", trendId: "wellness-cortisol", title: "r/Supplements: everyone at my gym is stacking ashwagandha and l-theanine now", summary: "Adaptogen stacking for cortisol management has moved from biohacker protocol to gym mainstream, the knowledge has diffused into general fitness culture.", source: "reddit", sourceName: "r/Supplements", date: "2026-05-10", crossLinks: [] },
  { id: "wcort-s6", trendId: "wellness-cortisol", title: "Cortisol Cocktail trend drives 90M TikTok views, supplement category explodes", summary: "Viral social content around cortisol management is compressing the adoption cycle for a category that would previously have required years of clinical normalisation.", source: "news", sourceName: "Forbes", date: "2026-04-22", crossLinks: [] },
  { id: "wcort-s7", trendId: "wellness-cortisol", title: "Lululemon 'Align' workwear campaign centres cortisol reduction as core message", summary: "Activewear brands are building cortisol management directly into their brand narrative, stress biology as a product benefit, not just a health claim.", source: "news", sourceName: "Campaign", date: "2026-03-28", crossLinks: [] },
  { id: "wcort-s8", trendId: "wellness-cortisol", title: "r/productivity: I started treating cortisol management like a business KPI, it changed everything", summary: "Productivity community adoption of cortisol management frameworks signals the concept has crossed from health into performance optimisation culture.", source: "reddit", sourceName: "r/productivity", date: "2026-03-05", crossLinks: [] },
  { id: "wcort-s9", trendId: "wellness-cortisol", title: "Saatva launches 'cortisol-reducing' mattress line backed by sleep neuroscience study", summary: "Sleep category brands are borrowing cortisol science as purchase justification, the biological language is diffusing into every wellness-adjacent category.", source: "news", sourceName: "Sleepopolis", date: "2026-05-08", crossLinks: [] },

  // foodtech-functional
  { id: "ffunc-s1", trendId: "foodtech-functional", title: "Erewhon collab culture signals food-as-fashion-prop era", summary: "The ritualistic display of functional beverages in urban environments mirrors luxury accessory logic, transforming nutrition into visible social signalling.", source: "news", sourceName: "NY Magazine", date: "2026-06-15", crossLinks: [] },
  { id: "ffunc-s2", trendId: "foodtech-functional", title: "Liquid IV and functional brands enter fashion week gifting suites", summary: "The boundary between supplement brand and fashion lifestyle brand is dissolving, opening cross-category brand strategy opportunities.", source: "news", sourceName: "Hypebeast", date: "2026-06-08", crossLinks: [] },
  { id: "ffunc-s3", trendId: "foodtech-functional", title: "r/nootropics: functional drink carry is the new status signal at the gym", summary: "Community observation confirms functional beverages have crossed from nutrition choice into visible identity expression and social signalling.", source: "reddit", sourceName: "r/nootropics", date: "2026-06-11", crossLinks: [] },
  { id: "ffunc-s4", trendId: "foodtech-functional", title: "Athletic Greens hits $1B valuation, functional supplement market reaches tipping point", summary: "The functional nutrition market has produced its first billion-dollar brand built entirely on premium daily ritual positioning rather than mainstream health claims.", source: "news", sourceName: "Forbes", date: "2026-05-27", crossLinks: [] },
  { id: "ffunc-s5", trendId: "foodtech-functional", title: "r/Nootropics: mushroom coffee has replaced my actual coffee, adaptogens are not optional anymore", summary: "Functional ingredient integration into everyday rituals (coffee replacement) signals permanence rather than trend, the category is embedding itself into established habits.", source: "reddit", sourceName: "r/Nootropics", date: "2026-05-22", crossLinks: [] },
  { id: "ffunc-s6", trendId: "foodtech-functional", title: "Whole Foods 2026 food trend report: functional beverages outpace all other category growth", summary: "Retail data from the premium grocery channel confirms functional beverages are the fastest-growing food category, a structural shift in how consumers drink.", source: "news", sourceName: "Whole Foods Market", date: "2026-05-08", crossLinks: [] },
  { id: "ffunc-s7", trendId: "foodtech-functional", title: "Recess anxiety-relief drink launches collaboration with urban fitness studios", summary: "The convergence of functional food brands with fitness and wellness venues creates a distribution network that reinforces lifestyle-product association.", source: "news", sourceName: "Adweek", date: "2026-04-15", crossLinks: [] },
  { id: "ffunc-s8", trendId: "foodtech-functional", title: "Stanley Cup for functional drinks, Olipop's reusable vessel collaboration drives 400% ROAS", summary: "Functional beverage brands are adopting the same lifestyle object strategy as premium water brands, the container as identity signal as much as the liquid inside.", source: "news", sourceName: "Marketing Week", date: "2026-03-01", crossLinks: [] },
  { id: "ffunc-s9", trendId: "foodtech-functional", title: "r/EatCheapAndHealthy: I switched to functional drinks and my grocery bill went up $200/month, worth it?", summary: "Consumer price sensitivity debate around functional beverages reveals the category occupies a premium-accessible positioning that requires ongoing justification, and generates community engagement.", source: "reddit", sourceName: "r/EatCheapAndHealthy", date: "2026-02-10", crossLinks: [] },

  // foodtech-precision
  { id: "fprec-s1", trendId: "foodtech-precision", title: "ZOE hits 500k subscribers for microbiome-based nutrition plans", summary: "Consumer adoption of personalised nutrition intelligence is moving beyond early adopters into lifestyle mainstream.", source: "news", sourceName: "BBC Tech", date: "2026-06-17", crossLinks: [] },
  { id: "fprec-s2", trendId: "foodtech-precision", title: "Genomic sequencing costs drop 90% in five years, nutrition implications", summary: "The democratisation of genomic data will make DNA-based nutrition planning accessible at mass market price points within 24 months.", source: "news", sourceName: "The Economist", date: "2026-06-09", crossLinks: [] },
  { id: "fprec-s3", trendId: "foodtech-precision", title: "Apple Health integrates third-party CGM data for personalised food recommendations", summary: "Platform integration of continuous glucose data with food logging creates the first truly closed-loop personalised nutrition system at consumer scale.", source: "news", sourceName: "TechCrunch", date: "2026-03-25", crossLinks: [] },
  { id: "fprec-s4", trendId: "foodtech-precision", title: "Noom 4.0 uses real-time CGM data to adjust meal plans mid-week, 3x better outcomes", summary: "Dynamic nutrition plans that respond to biometric data rather than static targets represent a fundamentally different product category than traditional diet apps.", source: "news", sourceName: "CNBC", date: "2026-04-15", crossLinks: [] },
  { id: "fprec-s5", trendId: "foodtech-precision", title: "r/diabetes: CGM changed how I think about food, not just my blood sugar, everyone should use these", summary: "Continuous glucose monitoring is generating lifestyle insight (not just medical management) that resonates beyond diabetic community, consumer health crossover is real.", source: "reddit", sourceName: "r/diabetes", date: "2026-02-10", crossLinks: [] },
  { id: "fprec-s6", trendId: "foodtech-precision", title: "Persona Nutrition AI matches 100,000 supplement combinations to individual blood panels", summary: "Supplement personalisation using actual biomarker data represents a step change from generic advice, turning $10B supplement retail into a precision service.", source: "news", sourceName: "Forbes Wellness", date: "2026-03-18", crossLinks: [] },
  { id: "fprec-s7", trendId: "foodtech-precision", title: "23andMe nutrition feature drives 40% of users to act on dietary gene variants", summary: "Genetic nutrition advice is seeing strong behavioural uptake when delivered through trusted consumer health platforms, the insight is actionable at consumer level.", source: "news", sourceName: "MIT Technology Review", date: "2026-01-30", crossLinks: [] },
  { id: "fprec-s8", trendId: "foodtech-precision", title: "r/keto: my continuous glucose monitor showed pasta was fine for me but rice wasn't, personal data beats general advice", summary: "Consumer discovery that personalised metabolic responses contradict general dietary guidelines is the core insight driving precision nutrition adoption.", source: "reddit", sourceName: "r/keto", date: "2026-04-08", crossLinks: [] },
  { id: "fprec-s9", trendId: "foodtech-precision", title: "Nestlé acquires precision nutrition startup for $400M, food giants enter personalised category", summary: "Major food corporation acquisitions in precision nutrition confirm the category has passed proof-of-concept and is entering scale-up phase.", source: "news", sourceName: "Food Navigator", date: "2026-05-12", crossLinks: [] },

  // mentalhealth-dopamine
  { id: "mdopa-s1", trendId: "mentalhealth-dopamine", title: "Muji redesigns checkout experience around dopamine release timing", summary: "Retail design is explicitly hiring neuroscientists to optimise purchase-moment reward experiences rather than just aesthetic presentation.", source: "news", sourceName: "Dezeen", date: "2026-06-16", crossLinks: [] },
  { id: "mdopa-s2", trendId: "mentalhealth-dopamine", title: "Gaming UX mechanics become standard retail design brief", summary: "The mechanics that make mobile games compulsive are being consciously imported into fashion retail environments and e-commerce flows.", source: "news", sourceName: "Wired", date: "2026-06-10", crossLinks: [] },
  { id: "mdopa-s3", trendId: "mentalhealth-dopamine", title: "r/psychology: dopamine menu is replacing doom scrolling as default habit", summary: "Consumer-level awareness of dopamine management is shifting from content consumption to curated experience design, creating new product opportunities.", source: "reddit", sourceName: "r/psychology", date: "2026-05-29", crossLinks: [] },
  { id: "mdopa-s4", trendId: "mentalhealth-dopamine", title: "Shopify merchants using 'streak' mechanics report 28% higher repeat purchase rates", summary: "Streak-based engagement borrowed from habit apps is proving its commercial value in e-commerce, dopamine design is quantifiably revenue-positive.", source: "news", sourceName: "Retail Week", date: "2026-05-23", crossLinks: [] },
  { id: "mdopa-s5", trendId: "mentalhealth-dopamine", title: "r/ADHD: dopamine menu concept is the most useful productivity tool I've ever found", summary: "Neurodivergent communities adopting dopamine menu frameworks signal that the concept has clinical-adjacent validity, and positions it for mainstream wellbeing adoption.", source: "reddit", sourceName: "r/ADHD", date: "2026-05-08", crossLinks: [] },
  { id: "mdopa-s6", trendId: "mentalhealth-dopamine", title: "Sephora gamification pilot: beauty loyalty 'levels' drive 45% more visits per quarter", summary: "Beauty retail gamification is delivering measurable outcome improvements, dopamine design principles are now routine in loyalty strategy.", source: "news", sourceName: "WWD", date: "2026-04-14", crossLinks: [] },
  { id: "mdopa-s7", trendId: "mentalhealth-dopamine", title: "'Dopaminergic design' enters mainstream UX curriculum at 12 top design schools", summary: "When dopamine-optimised design becomes a taught discipline rather than a dark pattern debate, the concept has crossed into institutionalised practice.", source: "news", sourceName: "WIRED", date: "2026-03-20", crossLinks: [] },
  { id: "mdopa-s8", trendId: "mentalhealth-dopamine", title: "Nike Training Club's 'achievement unlock' feature reduces app churn by 33%", summary: "Dopamine mechanics in fitness apps are proving that reward design is a primary retention driver, as important as content quality.", source: "news", sourceName: "Sports Business Journal", date: "2026-02-28", crossLinks: [] },
  { id: "mdopa-s9", trendId: "mentalhealth-dopamine", title: "r/BehavioralEconomics: brands that design for dopamine peaks will own the next decade of consumer loyalty", summary: "Academic and practitioner communities converging on dopamine design as the central mechanism of brand loyalty represents a paradigm shift in how attachment is engineered.", source: "reddit", sourceName: "r/BehavioralEconomics", date: "2026-01-30", crossLinks: [] },

  // mentalhealth-therapeutic
  { id: "mther-s1", trendId: "mentalhealth-therapeutic", title: "Aesop interiors programme prioritises 'nervous system safety'", summary: "Luxury retail is adopting trauma-informed design language to differentiate flagship environments from mass-market stimulation overload.", source: "news", sourceName: "Wallpaper*", date: "2026-06-19", crossLinks: [] },
  { id: "mther-s2", trendId: "mentalhealth-therapeutic", title: "Earth tones dominate SS25 across 7 major houses, a trend or a signal?", summary: "The aesthetic convergence around muted, grounding colour palettes across fashion is read as a collective nervous system response to digital overstimulation.", source: "news", sourceName: "Business of Fashion", date: "2026-06-13", crossLinks: [] },
  { id: "mther-s3", trendId: "mentalhealth-therapeutic", title: "Loewe wins Wallpaper award for 'most calming retail environment'", summary: "Luxury brands are competing on therapeutic environment design as a differentiator, creating new design brief categories for interior designers.", source: "news", sourceName: "Wallpaper*", date: "2026-05-30", crossLinks: [] },
  { id: "mther-s4", trendId: "mentalhealth-therapeutic", title: "Headspace and Calm generate $1.5B combined, mental wellness app market proves consumer willingness to pay", summary: "Subscription mental wellness at this scale confirms that consumers are ready to pay for therapeutic-adjacent digital products, the category has gone mainstream.", source: "news", sourceName: "The Information", date: "2026-05-24", crossLinks: [] },
  { id: "mther-s5", trendId: "mentalhealth-therapeutic", title: "r/mallgore: the era of overstimulating retail is ending, even Zara is getting quiet", summary: "Community observation of aesthetic shifts toward calmer retail environments signals a structural change in consumer preference, not just a luxury brand trend.", source: "reddit", sourceName: "r/mallgore", date: "2026-05-06", crossLinks: [] },
  { id: "mther-s6", trendId: "mentalhealth-therapeutic", title: "Apple Store redesign 2026 centres 'restorative space' concept, biophilic design replaces minimal white", summary: "When Apple redesigns its retail environments around therapeutic principles, the concept has reached mass-market infrastructure investment.", source: "news", sourceName: "Dezeen", date: "2026-04-12", crossLinks: [] },
  { id: "mther-s7", trendId: "mentalhealth-therapeutic", title: "Cottagecore and quiet luxury search volumes hit all-time highs, a single aesthetic signal", summary: "Search behaviour confirms that consumer desire for visual calm and therapeutic aesthetics is actively driving purchase intent across fashion and interiors categories.", source: "news", sourceName: "Vogue", date: "2026-03-18", crossLinks: [] },
  { id: "mther-s8", trendId: "mentalhealth-therapeutic", title: "r/minimalism: I replaced everything stimulating in my apartment and my anxiety is genuinely lower", summary: "Personal testimony linking therapeutic aesthetics to measurable wellbeing outcomes is the most powerful conversion tool in the category, and it's generating itself organically.", source: "reddit", sourceName: "r/minimalism", date: "2026-02-22", crossLinks: [] },
  { id: "mther-s9", trendId: "mentalhealth-therapeutic", title: "Bottega Veneta 'silence' campaign generates 200M impressions without showing a product", summary: "Brands communicating through therapeutic aesthetic signals rather than product demonstration are finding that the emotional resonance converts, particularly with overstimulated consumers.", source: "news", sourceName: "Campaign", date: "2026-01-28", crossLinks: [] },

  // interiordesign-ai-spatial
  { id: "intai-s1", trendId: "interiordesign-ai-spatial", title: "Midjourney becomes standard interior design brief tool in major studios", summary: "Leading architecture and interior design firms report using AI image generation as a standard phase of the brief and pitch process, cutting visualisation costs by 60-80%.", source: "news", sourceName: "Dezeen", date: "2026-06-15", crossLinks: [] },
  { id: "intai-s2", trendId: "interiordesign-ai-spatial", title: "Morpholio Board adds AI trend prediction for interior stylists", summary: "Professional design tools are integrating predictive AI that analyses global design trends and suggests direction, moving from reference tool to creative co-pilot.", source: "news", sourceName: "Wallpaper*", date: "2026-06-11", crossLinks: [] },
  { id: "intai-s3", trendId: "interiordesign-ai-spatial", title: "r/interiordesign: AI renders are indistinguishable from real photography", summary: "Community discussion reveals AI-generated interior photography is now passing as real in client presentations, raising questions about authenticity and creative credit.", source: "reddit", sourceName: "r/interiordesign", date: "2026-05-31", crossLinks: [] },
  { id: "intai-s4", trendId: "interiordesign-ai-spatial", title: "Houzz AI design assistant used by 8M homeowners to plan renovations, prosumer design goes mass", summary: "AI-assisted interior design has reached mainstream homeowner adoption, shifting the category from professional gate-kept service to consumer self-directed planning.", source: "news", sourceName: "TechCrunch", date: "2026-05-25", crossLinks: [] },
  { id: "intai-s5", trendId: "interiordesign-ai-spatial", title: "r/malelivingspace: AI helped me design my apartment in 2 hours what would have taken me 3 months on Pinterest", summary: "Consumer time-compression from AI design tools is the core adoption driver, and the community reception suggests significant word-of-mouth growth ahead.", source: "reddit", sourceName: "r/malelivingspace", date: "2026-05-04", crossLinks: [] },
  { id: "intai-s6", trendId: "interiordesign-ai-spatial", title: "Studio Gang and Zaha Hadid Architects both launch AI design wings, talent war accelerates", summary: "Architectural firms competing to attract AI-fluent talent signals that the design profession's most prestigious players have accepted AI as core capability.", source: "news", sourceName: "Dezeen", date: "2026-04-10", crossLinks: [] },
  { id: "intai-s7", trendId: "interiordesign-ai-spatial", title: "Nest AI updates to generate full interior concepts from a single mood description, 10,000 users on waitlist", summary: "Consumer-grade AI interior generation is generating demand that outpaces supply, the design appetite is far larger than any human designer pool could serve.", source: "news", sourceName: "Wallpaper*", date: "2026-03-15", crossLinks: [] },
  { id: "intai-s8", trendId: "interiordesign-ai-spatial", title: "AI interior design startups raise $2.8B in H1 2026, category investment accelerates", summary: "Venture capital concentration in AI interior design tools reflects investor confidence that the category is at inflection, large-scale consumer adoption is imminent.", source: "news", sourceName: "Crunchbase News", date: "2026-02-18", crossLinks: [] },

  // interiordesign-ar-preview
  { id: "intar-s1", trendId: "interiordesign-ar-preview", title: "IKEA Place AR app reaches 100M downloads, spatial commerce normalised", summary: "AR furniture preview has moved from novelty to expected feature, with consumer research showing 3x increase in conversion rates for brands with spatial try-before-you-buy.", source: "news", sourceName: "TechCrunch", date: "2026-06-18", crossLinks: [] },
  { id: "intar-s2", trendId: "interiordesign-ar-preview", title: "Apple Vision Pro spatial showroom pilot converts luxury furniture buyers", summary: "High-ASP furniture brands are piloting full spatial showrooms in Vision Pro, where buyers walk through configured rooms before purchase.", source: "news", sourceName: "Dezeen", date: "2026-06-10", crossLinks: [] },
  { id: "intar-s3", trendId: "interiordesign-ar-preview", title: "r/HomeDecorating: I designed my entire living room in AR before buying anything", summary: "Consumer behaviour shift evident in design communities, buyers are making complete room decisions in AR before purchasing anything physically.", source: "reddit", sourceName: "r/HomeDecorating", date: "2026-05-28", crossLinks: [] },
  { id: "intar-s4", trendId: "interiordesign-ar-preview", title: "Wayfair AR returns rate drops 55%, spatial preview solves furniture's core e-commerce problem", summary: "Furniture returns driven by size and fit errors are e-commerce's biggest profitability leak, AR preview eliminating them makes the ROI case unarguable.", source: "news", sourceName: "Retail Week", date: "2026-05-22", crossLinks: [] },
  { id: "intar-s5", trendId: "interiordesign-ar-preview", title: "Zara Home adds room AR to app, fast fashion home enters spatial commerce", summary: "Fast-fashion home brands adopting AR preview confirms the technology has reached mass-market price point and use case expectation.", source: "news", sourceName: "Wired", date: "2026-05-02", crossLinks: [] },
  { id: "intar-s6", trendId: "interiordesign-ar-preview", title: "r/malelivingspace: I bought my whole apartment furniture without visiting a single store, AR made it easy", summary: "Full home furnishing via AR-only consideration journey signals that physical showrooms are becoming optional rather than necessary for furniture purchase.", source: "reddit", sourceName: "r/malelivingspace", date: "2026-04-05", crossLinks: [] },
  { id: "intar-s7", trendId: "interiordesign-ar-preview", title: "Google Lens adds in-room furniture placement, 1B Google Lens users gain AR home design", summary: "Platform-level AR home design through Google Lens brings spatial commerce to every Android user without requiring dedicated app download.", source: "news", sourceName: "The Verge", date: "2026-02-20", crossLinks: [] },

  // interiordesign-smart-materials
  { id: "intsm-s1", trendId: "interiordesign-smart-materials", title: "Ecovative mycelium building panels approved for residential use in EU", summary: "Bio-based construction materials are moving from prototype to regulatory-approved product, opening the mass residential market.", source: "news", sourceName: "Dezeen", date: "2026-06-17", crossLinks: [] },
  { id: "intsm-s2", trendId: "interiordesign-smart-materials", title: "Living wall systems with integrated air quality sensors enter mainstream retail", summary: "Biophilic technology is adding data layers to plant-based interior systems, connecting aesthetics to measurable wellbeing outcomes.", source: "news", sourceName: "Wallpaper*", date: "2026-06-09", crossLinks: [] },
  { id: "intsm-s3", trendId: "interiordesign-smart-materials", title: "Self-cleaning surface coatings launched for residential kitchen applications", summary: "Nano-coating technology developed for medical environments is crossing into premium residential materials.", source: "news", sourceName: "Wired", date: "2026-05-30", crossLinks: [] },
  { id: "intsm-s4", trendId: "interiordesign-smart-materials", title: "Interface launches carbon-negative flooring tiles with embedded lifecycle tracking", summary: "Flooring brands embedding carbon accounting directly into product materials are creating the infrastructure for circular building design at scale.", source: "news", sourceName: "Dezeen", date: "2026-05-23", crossLinks: [] },
  { id: "intsm-s5", trendId: "interiordesign-smart-materials", title: "r/architecture: electrochromic glass is finally affordable, building skins are becoming programmable", summary: "Smart glass dropping below commercial viability thresholds is enabling architects to design facades that adapt to conditions, the building envelope goes dynamic.", source: "reddit", sourceName: "r/architecture", date: "2026-05-05", crossLinks: [] },
  { id: "intsm-s6", trendId: "interiordesign-smart-materials", title: "Biomason grows concrete using bacteria, zero-CO2 structural material enters commercial scale", summary: "Biological manufacturing of construction materials at commercial scale represents the most radical disruption to the built environment's material supply chain.", source: "news", sourceName: "MIT Technology Review", date: "2026-04-01", crossLinks: [] },
  { id: "intsm-s7", trendId: "interiordesign-smart-materials", title: "Aerogel insulation hits consumer price point, the most efficient insulation on earth enters residential", summary: "Space-derived insulation technology reaching home renovation budget ranges creates measurable energy performance improvements without structural changes.", source: "news", sourceName: "Wallpaper*", date: "2026-02-25", crossLinks: [] },

  // travel-ai-itinerary
  { id: "travai-s1", trendId: "travel-ai-itinerary", title: "Google Travel AI planner reaches 50M monthly active users", summary: "AI-powered trip planning has crossed from early adopter curiosity into mainstream travel consideration behaviour, changing how intent converts to booking.", source: "news", sourceName: "TechCrunch", date: "2026-02-18", crossLinks: [] },
  { id: "travai-s2", trendId: "travel-ai-itinerary", title: "Booking.com AI assistant cuts average trip planning time from 7 hours to 40 minutes", summary: "The friction reduction in travel planning is compressing consideration timelines and increasing impulse booking rates significantly.", source: "news", sourceName: "Financial Times", date: "2026-03-05", crossLinks: [] },
  { id: "travai-s3", trendId: "travel-ai-itinerary", title: "r/travel: I used AI to plan my entire Southeast Asia trip, here's what it got right and wrong", summary: "Community testing of AI travel planning reveals high accuracy for logistics but persistent gaps in local cultural nuance, creating a hybrid human-AI planning model.", source: "reddit", sourceName: "r/travel", date: "2026-04-08", crossLinks: [] },
  { id: "travai-s4", trendId: "travel-ai-itinerary", title: "Airbnb Rooms AI matches solo travellers to hosts based on personality data, 92% satisfaction", summary: "Personality-driven travel matching is proving that AI can replicate the trust signals previously only delivered by human curation in the hospitality sector.", source: "news", sourceName: "Business Insider", date: "2026-03-22", crossLinks: [] },
  { id: "travai-s5", trendId: "travel-ai-itinerary", title: "r/solotravel: AI gave me a better itinerary than any travel blogger I've followed for 10 years", summary: "Community validation of AI itinerary quality over established human sources signals a trust transfer that threatens the entire travel influencer category.", source: "reddit", sourceName: "r/solotravel", date: "2026-02-12", crossLinks: [] },
  { id: "travai-s6", trendId: "travel-ai-itinerary", title: "Tripadvisor AI concierge drives 2x longer booking sessions and 34% higher booking value", summary: "AI travel assistance is not just reducing friction, it's increasing consideration depth, leading to higher-value bookings that benefit the whole ecosystem.", source: "news", sourceName: "Phocuswire", date: "2026-04-20", crossLinks: [] },
  { id: "travai-s7", trendId: "travel-ai-itinerary", title: "Expedia AI 'knows' you, uses 5-year booking history to predict next trip preferences with 78% accuracy", summary: "Longitudinal AI travel profiling is creating recommendation quality that makes switching platforms costly, loyalty through intelligence rather than points.", source: "news", sourceName: "Skift", date: "2026-01-28", crossLinks: [] },
  { id: "travai-s8", trendId: "travel-ai-itinerary", title: "Japan Tourism Board uses AI to route visitors away from over-tourism hotspots, destination management improves", summary: "AI travel routing is being used not just for visitor experience but for destination management, solving the over-tourism crisis by distributing demand intelligently.", source: "news", sourceName: "The Guardian", date: "2026-05-10", crossLinks: [] },

  // travel-immersive-tourism
  { id: "travimm-s1", trendId: "travel-immersive-tourism", title: "Vatican AR experience sells out 3 months in advance", summary: "Augmented reality overlays on heritage sites are generating premium pricing and advance booking demand that physical sites alone cannot command.", source: "news", sourceName: "Condé Nast Traveler", date: "2026-01-22", crossLinks: [] },
  { id: "travimm-s2", trendId: "travel-immersive-tourism", title: "Dubai Tourism Authority deploys citywide AR layer for visitors", summary: "City-level AR tourism infrastructure is moving from pilot projects to official tourism authority investment, signalling mainstream institutional adoption.", source: "news", sourceName: "Wired", date: "2026-03-15", crossLinks: [] },
  { id: "travimm-s3", trendId: "travel-immersive-tourism", title: "r/travel: AR at the Colosseum changed how I experienced history", summary: "First-person accounts of AR heritage tourism are driving aspiration and booking intent among travel communities, a social proof loop for destination investment.", source: "reddit", sourceName: "r/travel", date: "2026-02-28", crossLinks: [] },
  { id: "travimm-s4", trendId: "travel-immersive-tourism", title: "Louvre's AI guide 'Léa' personalises 2-hour tours for 5M visitors per year", summary: "Museum-scale AI tour guidance that personalises to individual visitor knowledge and interests represents a new standard for cultural site experience design.", source: "news", sourceName: "Le Monde", date: "2026-04-12", crossLinks: [] },
  { id: "travimm-s5", trendId: "travel-immersive-tourism", title: "Iceland deploys AI-powered Northern Lights prediction app, bookings up 60% with timing confidence", summary: "AI applied to natural phenomenon prediction transforms unpredictable travel experiences into plannable ones, removing uncertainty that previously deterred bookings.", source: "news", sourceName: "Condé Nast Traveler", date: "2026-02-18", crossLinks: [] },
  { id: "travimm-s6", trendId: "travel-immersive-tourism", title: "r/solotravel: I visited Pompeii through mixed reality before visiting, the real thing was even better", summary: "Pre-visit AR immersion creating stronger in-person resonance disproves the substitution hypothesis, digital and physical travel experiences are complementary, not competitive.", source: "reddit", sourceName: "r/solotravel", date: "2026-03-30", crossLinks: [] },
  { id: "travimm-s7", trendId: "travel-immersive-tourism", title: "Six Senses integrates biometric wellness data into resort experience, spa, sleep, food all personalised", summary: "Biometric-responsive resort experiences represent the fullest realisation of AI personalisation in luxury hospitality, the environment adapts to the guest.", source: "news", sourceName: "Wallpaper*", date: "2026-05-05", crossLinks: [] },

  // fitness-biometric-training
  { id: "fitbio-s1", trendId: "fitness-biometric-training", title: "Supersapiens CGM for athletes goes mass market at $99/month", summary: "Continuous glucose monitoring for non-diabetic athletes has crossed the price-access threshold into serious amateur market, expanding biometric training to millions.", source: "news", sourceName: "TechCrunch", date: "2026-02-12", crossLinks: [] },
  { id: "fitbio-s2", trendId: "fitness-biometric-training", title: "Whoop 5.0 adds HRV-based training load AI recommendations", summary: "Wearable platforms are closing the loop from data collection to actionable coaching, removing the interpretation burden from the consumer.", source: "news", sourceName: "Wired", date: "2026-03-18", crossLinks: [] },
  { id: "fitbio-s3", trendId: "fitness-biometric-training", title: "r/running: my AI coach adjusted my marathon plan based on my HRV, ran a 20min PB", summary: "Community performance results from AI biometric coaching are driving word-of-mouth adoption at a pace no paid marketing could achieve.", source: "reddit", sourceName: "r/running", date: "2026-04-05", crossLinks: [] },
  { id: "fitbio-s4", trendId: "fitness-biometric-training", title: "Garmin Forerunner adds real-time VO2max and lactate threshold estimation, pro metrics go consumer", summary: "Physiological metrics previously requiring lab testing are now delivered through consumer wearables, democratising sports science insights that were elite-athlete-only.", source: "news", sourceName: "DC Rainmaker", date: "2026-03-02", crossLinks: [] },
  { id: "fitbio-s5", trendId: "fitness-biometric-training", title: "r/weightlifting: AI auto-regulated programming based on daily readiness changed my gains more than any programme", summary: "Auto-regulation driven by biometric readiness data is producing training outcomes that static programmes cannot match, real-world performance data from community.", source: "reddit", sourceName: "r/weightlifting", date: "2026-04-22", crossLinks: [] },
  { id: "fitbio-s6", trendId: "fitness-biometric-training", title: "Ultrahuman Ring AIR adds metabolic intelligence, sleep, glucose, and movement in a single score", summary: "Sensor fusion across metabolic markers in a compact wearable is making comprehensive physiological profiling accessible outside clinical settings for the first time.", source: "news", sourceName: "TechCrunch", date: "2026-02-25", crossLinks: [] },
  { id: "fitbio-s7", trendId: "fitness-biometric-training", title: "Olympic teams across 8 countries mandate AI biometric analysis for athlete selection", summary: "Elite sport adoption of AI biometric tools as selection criteria signals the technology has reached sufficient accuracy to make consequential decisions, consumer versions follow.", source: "news", sourceName: "Sports Business Journal", date: "2026-01-22", crossLinks: [] },
  { id: "fitbio-s8", trendId: "fitness-biometric-training", title: "r/triathlon: I trained smarter not harder with CGM data, broke my PR after 3 years plateauing", summary: "Breakthrough performance stories from biometric-informed training are the category's most effective growth engine, word-of-mouth from real results in high-commitment communities.", source: "reddit", sourceName: "r/triathlon", date: "2026-05-08", crossLinks: [] },

  // fitness-social-performance
  { id: "fitsoc-s1", trendId: "fitness-social-performance", title: "Strava hits 150M users, fitness data as primary social identity for Gen Z", summary: "The scale of fitness data sharing signals a permanent shift: athletic identity is now expressed through data platforms as much as through physical appearance.", source: "news", sourceName: "Financial Times", date: "2026-01-30", crossLinks: [] },
  { id: "fitsoc-s2", trendId: "fitness-social-performance", title: "Nike Run Club AI coach achieves 85% monthly retention vs 34% industry average", summary: "AI-powered coaching with social accountability is achieving retention rates that prove the community layer is as important as the hardware.", source: "news", sourceName: "Business Insider", date: "2026-03-10", crossLinks: [] },
  { id: "fitsoc-s3", trendId: "fitness-social-performance", title: "r/Fitness: I stopped caring about the scale when I started caring about my Strava score", summary: "Metric substitution in fitness communities reveals that social data points (pace, distance, consistency) are replacing weight as the primary health signifier.", source: "reddit", sourceName: "r/Fitness", date: "2026-02-20", crossLinks: [] },
  { id: "fitsoc-s4", trendId: "fitness-social-performance", title: "Hyrox global event series hits 400,000 participants, competitive fitness goes mainstream sport", summary: "Hybrid fitness competitions at this scale signal that performance-based fitness culture has moved from niche community to mainstream sports category.", source: "news", sourceName: "Running Competitor", date: "2026-03-28", crossLinks: [] },
  { id: "fitsoc-s5", trendId: "fitness-social-performance", title: "r/CrossFit: my gym's community app integration with wearables makes me accountable like nothing else", summary: "Social accountability through data transparency in fitness communities is proving more effective for adherence than any solo motivation strategy.", source: "reddit", sourceName: "r/CrossFit", date: "2026-04-12", crossLinks: [] },
  { id: "fitsoc-s6", trendId: "fitness-social-performance", title: "Whoop partnership with Fortune 500 companies, biometric performance becomes workplace wellness", summary: "Corporate wellness programmes adopting biometric wearables are creating new distribution channels and normalising physiological tracking in professional contexts.", source: "news", sourceName: "CNBC", date: "2026-02-08", crossLinks: [] },
  { id: "fitsoc-s7", trendId: "fitness-social-performance", title: "Arc'teryx sponsors Strava segment leaderboards, outdoor brand reaches fitness community directly", summary: "Premium outdoor brands reaching fitness communities through data platform sponsorship is a new channel that didn't exist 3 years ago, and it converts at performance brand rates.", source: "news", sourceName: "Outdoor Retailer", date: "2026-04-30", crossLinks: [] },

  // music-ai-creation
  { id: "musai-s1", trendId: "music-ai-creation", title: "Suno reaches 10M monthly active creators, AI music generation mainstreams", summary: "AI music generation has crossed into mainstream creative use, with non-musicians generating usable output and challenging the licensing market fundamentally.", source: "news", sourceName: "TechCrunch", date: "2026-02-08", crossLinks: [] },
  { id: "musai-s2", trendId: "music-ai-creation", title: "Universal Music Group launches AI music licensing framework for brand use", summary: "Major labels are moving to monetise AI-generated music rather than fight it, creating new licensing categories that legitimise the format.", source: "news", sourceName: "Billboard", date: "2026-03-22", crossLinks: [] },
  { id: "musai-s3", trendId: "music-ai-creation", title: "r/WeAreTheMusicMakers: AI tools are now my co-writers, not my competitors", summary: "Professional music community shifts from resistance to integration as AI music tools prove useful for production workflow rather than replacement.", source: "reddit", sourceName: "r/WeAreTheMusicMakers", date: "2026-04-10", crossLinks: [] },
  { id: "musai-s4", trendId: "music-ai-creation", title: "Spotify's AI DJ reaches 50M users, AI curated listening becomes the default", summary: "AI music curation at this scale has become a default listening behaviour rather than a feature, the AI layer is now between music and listener for half of Spotify.", source: "news", sourceName: "Variety", date: "2026-02-20", crossLinks: [] },
  { id: "musai-s5", trendId: "music-ai-creation", title: "r/edmproduction: I finished my first EP entirely with AI collaboration, took 3 days not 3 months", summary: "Production timeline compression from AI music tools is changing the economics of independent music making, more output, lower barrier, faster iteration.", source: "reddit", sourceName: "r/edmproduction", date: "2026-03-08", crossLinks: [] },
  { id: "musai-s6", trendId: "music-ai-creation", title: "Udio raises $50M to build the 'YouTube for AI music', platform economy for generated content emerging", summary: "Platform investment in AI music distribution infrastructure signals a creator economy forming around AI-generated music, not just tools, but the full publishing stack.", source: "news", sourceName: "Pitchfork", date: "2026-04-18", crossLinks: [] },
  { id: "musai-s7", trendId: "music-ai-creation", title: "AI-composed score wins Sundance award, festival circuit accepts generated music", summary: "Prestigious film festival recognising AI-generated music composition settles the creative legitimacy debate in the most commercially significant context.", source: "news", sourceName: "IndieWire", date: "2026-01-25", crossLinks: [] },
  { id: "musai-s8", trendId: "music-ai-creation", title: "r/hiphopheads: AI beats are flooding SoundCloud, can't tell what's human anymore", summary: "Consumer inability to distinguish AI from human music production in the most sonically sophisticated genre confirms AI music quality has crossed the perception threshold.", source: "reddit", sourceName: "r/hiphopheads", date: "2026-05-02", crossLinks: [] },

  // music-spatial-audio
  { id: "mussp-s1", trendId: "music-spatial-audio", title: "Apple Music Spatial Audio streams double in 12 months as hardware adoption grows", summary: "Spatial audio adoption is following hardware distribution, as Dolby Atmos headphones become accessible, the consumption format normalises.", source: "news", sourceName: "Variety", date: "2026-01-28", crossLinks: [] },
  { id: "mussp-s2", trendId: "music-spatial-audio", title: "Sleep audio app Calm launches binaural science programme with neuroscientists", summary: "Wellness audio is investing in clinical-grade spatial audio research to differentiate its health claims and justify premium pricing.", source: "news", sourceName: "CNBC", date: "2026-03-14", crossLinks: [] },
  { id: "mussp-s3", trendId: "music-spatial-audio", title: "r/audiophile: spatial audio is the first meaningful headphone upgrade in a decade", summary: "Audio enthusiast community validates spatial audio as genuine technical leap, accelerating aspirational adoption beyond mainstream consumers.", source: "reddit", sourceName: "r/audiophile", date: "2026-02-15", crossLinks: [] },
  { id: "mussp-s4", trendId: "music-spatial-audio", title: "Coachella 2026 main stage broadcast in spatial audio, 40M livestream viewers get 3D sound", summary: "Live event spatial audio at festival scale normalises the format for a massive simultaneous audience, the quality gap between home listening and live event collapses.", source: "news", sourceName: "Billboard", date: "2026-04-22", crossLinks: [] },
  { id: "mussp-s5", trendId: "music-spatial-audio", title: "r/Meditation: binaural beats changed my meditation practice, spatial audio is legitimately different", summary: "Community adoption of spatial audio for wellness practice confirms the format's functional benefits extend beyond listening pleasure into therapeutic application.", source: "reddit", sourceName: "r/Meditation", date: "2026-03-05", crossLinks: [] },
  { id: "mussp-s6", trendId: "music-spatial-audio", title: "Sony WH-1000XM6 includes full Dolby Atmos decoder, spatial audio becomes premium headphone standard", summary: "Hardware standardisation of spatial audio decoding in the best-selling headphone category confirms the format will reach mainstream adoption within 2-3 product cycles.", source: "news", sourceName: "The Verge", date: "2026-02-08", crossLinks: [] },
  { id: "mussp-s7", trendId: "music-spatial-audio", title: "Peloton integrates instructor spatial audio, workout immersion becomes competitive differentiator", summary: "Fitness platform adoption of spatial audio for workout experience creates a compelling use case that reaches health-motivated consumers who might not seek out audio innovation alone.", source: "news", sourceName: "TechCrunch", date: "2026-05-12", crossLinks: [] },

  // art-ai-legitimacy
  { id: "artai-s1", trendId: "art-ai-legitimacy", title: "Christie's sells AI-generated work for $432,500, institutional market forms", summary: "Auction house validation of AI art has created a formal market structure with provenance, authentication, and price discovery, the prerequisites for a lasting category.", source: "news", sourceName: "The Art Newspaper", date: "2026-02-05", crossLinks: [] },
  { id: "artai-s2", trendId: "art-ai-legitimacy", title: "MoMA acquires first AI-generated piece for permanent collection", summary: "Museum permanent collection acquisition is the highest form of institutional legitimacy, AI art now has a place in the Western canon.", source: "news", sourceName: "Artforum", date: "2026-03-20", crossLinks: [] },
  { id: "artai-s3", trendId: "art-ai-legitimacy", title: "r/Art: the AI legitimacy debate has moved from 'is it art' to 'what makes it valuable'", summary: "Community discourse evolution signals that the philosophical debate has been superseded by market reality, the focus now is on value attribution, not ontology.", source: "reddit", sourceName: "r/Art", date: "2026-04-12", crossLinks: [] },
  { id: "artai-s4", trendId: "art-ai-legitimacy", title: "Sotheby's launches dedicated AI art auction category, third sale outsells estimate by 4x", summary: "Major auction houses establishing permanent AI art infrastructure signals category permanence, not experiment, the secondary market is being built now.", source: "news", sourceName: "The Art Newspaper", date: "2026-03-05", crossLinks: [] },
  { id: "artai-s5", trendId: "art-ai-legitimacy", title: "Venice Biennale 2026 dedicates pavilion to AI-generated and AI-assisted art", summary: "The world's most prestigious art event legitimising AI work sets the international institutional benchmark, commercial markets follow biennale positioning within 2-3 years.", source: "news", sourceName: "Artforum", date: "2026-04-20", crossLinks: [] },
  { id: "artai-s6", trendId: "art-ai-legitimacy", title: "r/MachineLearning: artists using AI tools are outselling non-AI peers on every major platform", summary: "Commercial data from art platforms is unambiguous, AI-assisted artists are generating higher revenue, accelerating adoption among those who were previously resistant.", source: "reddit", sourceName: "r/MachineLearning", date: "2026-02-18", crossLinks: [] },
  { id: "artai-s7", trendId: "art-ai-legitimacy", title: "Gagosian represents first AI-primary artist, gallery legitimacy crosses into blue chip tier", summary: "When the world's most commercially powerful gallery takes on AI art, the collector market for AI work becomes institutionally validated at the highest level.", source: "news", sourceName: "The Art Newspaper", date: "2026-05-08", crossLinks: [] },
  { id: "artai-s8", trendId: "art-ai-legitimacy", title: "UK Arts Council includes AI art in £200M public arts funding criteria for first time", summary: "Public arts funding bodies legitimising AI work settles the cultural status question in policy, private markets and museums will follow the institutional funding signal.", source: "news", sourceName: "The Guardian", date: "2026-01-30", crossLinks: [] },
  { id: "artai-s9", trendId: "art-ai-legitimacy", title: "r/ArtHistory: comparing AI art to photography's legitimacy arc, same pattern, compressed timeline", summary: "Art history community drawing parallels to photography's institutional adoption journey suggests AI art's timeline to full legitimacy is accelerating versus historical precedents.", source: "reddit", sourceName: "r/ArtHistory", date: "2026-03-28", crossLinks: [] },
  { id: "artai-s10", trendId: "art-ai-legitimacy", title: "Art Basel launches AI art sector with 12 dedicated galleries, fair infrastructure catches up", summary: "Fair infrastructure formalising AI art as a distinct market segment creates the commercial scaffolding for collectors to build dedicated AI art holdings.", source: "news", sourceName: "Artnet News", date: "2026-04-02", crossLinks: [] },

  // art-phygital-objects
  { id: "artphy-s1", trendId: "art-phygital-objects", title: "Damien Hirst's phygital edition sells 10,000 pieces in 6 hours", summary: "Celebrity artist adoption of phygital format has created mainstream awareness and proved demand for art objects that exist in both physical and digital space.", source: "news", sourceName: "The Art Newspaper", date: "2026-01-15", crossLinks: [] },
  { id: "artphy-s2", trendId: "art-phygital-objects", title: "Louis Vuitton x Yayoi Kusama phygital pieces trade at 3x retail on secondary market", summary: "Luxury brand + established artist phygital collaborations are creating secondary market premiums that validate the format's collectible credentials.", source: "news", sourceName: "Hypebeast", date: "2026-03-02", crossLinks: [] },
  { id: "artphy-s3", trendId: "art-phygital-objects", title: "r/NFT: phygital is the only format where both crypto-native and traditional collectors overlap", summary: "Collector community observation identifies phygital art as the bridge format between two previously separate markets, a structural opportunity for the art world.", source: "reddit", sourceName: "r/NFT", date: "2026-02-22", crossLinks: [] },
  { id: "artphy-s4", trendId: "art-phygital-objects", title: "Pace Gallery pilots AR viewing layers on physical works, collectors access digital content via private app", summary: "Gallery-led phygital infrastructure is being built for existing traditional collectors, not just digital-native buyers, the market is converging.", source: "news", sourceName: "Artnet News", date: "2026-03-18", crossLinks: [] },
  { id: "artphy-s5", trendId: "art-phygital-objects", title: "Tyler Hobbs 'Fidenza' physical prints with embedded blockchain certificates sell out in 4 minutes", summary: "The combination of generative art with physical ownership documentation is proving that the collector audience for phygital work extends well beyond crypto-native buyers.", source: "news", sourceName: "Artforum", date: "2026-01-28", crossLinks: [] },
  { id: "artphy-s6", trendId: "art-phygital-objects", title: "r/CollectibleArt: I bought a phygital print and the digital layer gained value independently from the physical", summary: "Collector experience of phygital asset dual-value development is the most compelling proof of the format's financial logic, and it's being shared widely.", source: "reddit", sourceName: "r/CollectibleArt", date: "2026-04-05", crossLinks: [] },
  { id: "artphy-s7", trendId: "art-phygital-objects", title: "Tate Modern 2026 retrospective uses phygital format for museum shop, first institutional adoption", summary: "Museum adoption of phygital for commercial products gives the format institutional distribution, opening the collector behaviour to a much broader audience.", source: "news", sourceName: "The Guardian", date: "2026-04-28", crossLinks: [] },
  { id: "artphy-s8", trendId: "art-phygital-objects", title: "KAWS phygital 'SHARE' series: secondary market trades 60% digital / 40% physical component", summary: "Secondary market data showing digital and physical components trading independently proves the market has developed the sophistication to value both layers.", source: "news", sourceName: "Hypebeast", date: "2026-02-10", crossLinks: [] },
  { id: "artphy-s9", trendId: "art-phygital-objects", title: "r/Art: the physical print is now the receipt for the digital artwork, not the main event", summary: "Collector perception inversion, physical as provenance documentation for digital primary, signals a fundamental reordering of value logic in the art object.", source: "reddit", sourceName: "r/Art", date: "2026-05-05", crossLinks: [] },

  // skincare-biotech-actives
  { id: "skbio-s1", trendId: "skincare-biotech-actives", title: "Exosome skincare raises $200M in VC funding as clinical results validate consumer claims", summary: "Investment capital is flowing into biotech skincare at scale, signalling that the category has crossed from speculative to evidence-backed in investor perception.", source: "news", sourceName: "WWD", date: "2026-02-18", crossLinks: [] },
  { id: "skbio-s2", trendId: "skincare-biotech-actives", title: "Fermentation-derived actives enter mass market through Unilever acquisition", summary: "When a Unilever-scale company acquires a biotech skincare brand, the category has officially crossed from prestige niche to mass market trajectory.", source: "news", sourceName: "Beauty Business", date: "2026-03-25", crossLinks: [] },
  { id: "skbio-s3", trendId: "skincare-biotech-actives", title: "r/SkincareAddiction: biotech actives have made my routine actually work, lab-backed or bust", summary: "Consumer community shift toward demanding clinical evidence for skincare actives is creating a floor quality standard that biotech companies are best positioned to meet.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2026-04-08", crossLinks: [] },
  { id: "skbio-s4", trendId: "skincare-biotech-actives", title: "Augustinus Bader's TFC-8 licensed to 3 major beauty houses, biotech IP becomes the asset", summary: "Biotech skincare IP licensing shows that the underlying science, not the consumer brand, is the primary value driver, a pharmaceutical business model entering beauty.", source: "news", sourceName: "WWD", date: "2026-03-10", crossLinks: [] },
  { id: "skbio-s5", trendId: "skincare-biotech-actives", title: "Lab-grown collagen reaches €50/g in consumer skincare, biotech scalability unlocking premium mass", summary: "Manufacturing scale improvements are moving biotech actives from ultra-luxury to accessible premium, the price curve is repeating the pattern of hyaluronic acid adoption.", source: "news", sourceName: "Cosmetics Business", date: "2026-01-22", crossLinks: [] },
  { id: "skbio-s6", trendId: "skincare-biotech-actives", title: "r/30PlusSkinCare: I spent $400 on an exosome serum and it's the first time I've actually seen results in 5 years", summary: "Consumer investment in premium biotech actives at price points previously reserved for clinical treatments confirms willingness to pay when efficacy is demonstrable.", source: "reddit", sourceName: "r/30PlusSkinCare", date: "2026-04-22", crossLinks: [] },
  { id: "skbio-s7", trendId: "skincare-biotech-actives", title: "Microbiome-optimised skincare passes clinical trials, EU regulatory green light triggers retail launch", summary: "Regulatory approval of microbiome skincare formalises the category's medical claims, allowing marketing that was previously restricted to cosmetic products.", source: "news", sourceName: "Cosmetics Europe", date: "2026-02-05", crossLinks: [] },
  { id: "skbio-s8", trendId: "skincare-biotech-actives", title: "Sephora launches 'Biotech Beauty' dedicated floor section in 200 stores", summary: "Retail curation of biotech skincare as a distinct category is the distribution signal that mainstreams the technology, premium buyers now have a dedicated browsing frame.", source: "news", sourceName: "Glossy", date: "2026-05-15", crossLinks: [] },
  { id: "skbio-s9", trendId: "skincare-biotech-actives", title: "r/SkincareAddiction: the barrier between pharmaceutical skincare and OTC beauty is gone, everything is clinical now", summary: "Consumer perception of skincare as a clinical category rather than cosmetic one signals that biotech standards have reset the expectation baseline for the entire market.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2026-03-30", crossLinks: [] },

  // skincare-ai-personalisation
  { id: "skai-s1", trendId: "skincare-ai-personalisation", title: "L'Oréal's AI skin diagnostics deployed in 50,000 retail locations", summary: "At-scale deployment of AI skin analysis at point of sale transforms the skincare purchase from browse to prescription, increasing basket size and reducing returns.", source: "news", sourceName: "Forbes", date: "2026-01-25", crossLinks: [] },
  { id: "skai-s2", trendId: "skincare-ai-personalisation", title: "Prose hair care AI model drives 40% lower churn than standard subscription", summary: "AI personalisation in beauty proves its retention value, the data-matched formulation creates switching costs that generic products cannot replicate.", source: "news", sourceName: "Business of Fashion", date: "2026-03-12", crossLinks: [] },
  { id: "skai-s3", trendId: "skincare-ai-personalisation", title: "r/SkincareAddiction: AI-matched routine cleared my skin after 3 years of trial and error", summary: "Personal success stories from AI-recommended skincare routines are the most effective word-of-mouth driver in the category, impossible to manufacture without genuine efficacy.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2026-02-28", crossLinks: [] },
  { id: "skai-s4", trendId: "skincare-ai-personalisation", title: "Function of Beauty skin AI achieves 94% customer satisfaction vs 67% category average", summary: "Outcome data from personalised skincare subscriptions is proving that AI-matched formulations significantly outperform generic alternatives, the efficacy gap justifies premium pricing.", source: "news", sourceName: "Mintel", date: "2026-04-05", crossLinks: [] },
  { id: "skai-s5", trendId: "skincare-ai-personalisation", title: "Samsung Galaxy S28 adds real-time skin analysis to camera, AI skincare enters default hardware", summary: "When AI skin analysis is embedded in smartphone hardware, the diagnostic layer becomes universally accessible, changing the baseline expectation for skincare advice.", source: "news", sourceName: "The Verge", date: "2026-02-15", crossLinks: [] },
  { id: "skai-s6", trendId: "skincare-ai-personalisation", title: "r/AsianBeauty: I photographed my skin every morning for 90 days, AI analysis was right about what to cut", summary: "Longitudinal AI skin tracking is generating behaviour change that one-time diagnostics cannot, the data layer transforms skincare from purchase to practice.", source: "reddit", sourceName: "r/AsianBeauty", date: "2026-03-22", crossLinks: [] },
  { id: "skai-s7", trendId: "skincare-ai-personalisation", title: "Cult Beauty launches AI routine builder, average cart value rises 55% vs standard browse", summary: "AI-curated skincare routines drive significantly higher purchase intent than editorial curation because the recommendation feels personally justified.", source: "news", sourceName: "Glossy", date: "2026-04-18", crossLinks: [] },
  { id: "skai-s8", trendId: "skincare-ai-personalisation", title: "Dermatica AI expansion: prescription skincare via phone photo reaches 1M UK users", summary: "Clinical-grade AI skin diagnosis at consumer scale is blurring the boundary between dermatology and skincare retail, and patients prefer the app to waiting 3 months for an appointment.", source: "news", sourceName: "The Times", date: "2026-01-18", crossLinks: [] },

  // luxury-blockchain-provenance
  { id: "luxblk-s1", trendId: "luxury-blockchain-provenance", title: "LVMH Aura blockchain tracks 50M luxury products, authenticity at scale", summary: "The largest luxury group has operationalised blockchain provenance at scale, creating competitive pressure for all premium brands to follow.", source: "news", sourceName: "Business of Fashion", date: "2026-02-10", crossLinks: [] },
  { id: "luxblk-s2", trendId: "luxury-blockchain-provenance", title: "EU Digital Product Passport framework confirmed, luxury compliance timeline set", summary: "Regulatory confirmation of the EU Digital Product Passport requirement creates a mandatory digital provenance infrastructure for all luxury goods sold in Europe by 2027.", source: "news", sourceName: "Vogue Business", date: "2026-03-18", crossLinks: [] },
  { id: "luxblk-s3", trendId: "luxury-blockchain-provenance", title: "r/Watches: blockchain authentication is killing the grey market for Rolex and Patek", summary: "The watch resale market sees blockchain provenance reducing counterfeit volume by 60%, proving the commercial case for authentication technology.", source: "reddit", sourceName: "r/Watches", date: "2026-04-02", crossLinks: [] },
  { id: "luxblk-s4", trendId: "luxury-blockchain-provenance", title: "Kering group mandates digital product passport for all brands by 2026", summary: "Holding company mandate creates group-wide implementation pressure that will accelerate the technology's adoption across all Kering brands simultaneously.", source: "news", sourceName: "Vogue Business", date: "2026-01-28", crossLinks: [] },
  { id: "luxblk-s5", trendId: "luxury-blockchain-provenance", title: "Vestiaire Collective adds blockchain verification, resale platform trust increases 40%", summary: "Luxury resale platform adoption of blockchain authentication signals that secondhand market trust infrastructure is being built in parallel with primary market systems.", source: "news", sourceName: "Business of Fashion", date: "2026-03-08", crossLinks: [] },
  { id: "luxblk-s6", trendId: "luxury-blockchain-provenance", title: "r/handbags: I only buy authenticated pieces now, the blockchain passport made me trust the resale market", summary: "Consumer behaviour shift toward provenance-verified luxury purchases is being driven by blockchain authentication, trust infrastructure is changing purchase patterns.", source: "reddit", sourceName: "r/handbags", date: "2026-04-15", crossLinks: [] },
  { id: "luxblk-s7", trendId: "luxury-blockchain-provenance", title: "Cartier, Prada and Richemont form luxury blockchain consortium, industry standard emerging", summary: "Competing luxury groups collaborating on a shared blockchain standard signals that provenance infrastructure is being treated as industry utility rather than competitive advantage.", source: "news", sourceName: "Reuters", date: "2026-02-22", crossLinks: [] },
  { id: "luxblk-s8", trendId: "luxury-blockchain-provenance", title: "Dubai Customs integrates luxury product passports for import tracking, 12 other countries to follow", summary: "Government customs integration of luxury product passports creates a global provenance network that extends far beyond brand marketing into regulatory compliance.", source: "news", sourceName: "Arabian Business", date: "2026-05-02", crossLinks: [] },
  { id: "luxblk-s9", trendId: "luxury-blockchain-provenance", title: "r/malefashionadvice: I won't buy a luxury watch without a digital certificate now, old authentication feels insufficient", summary: "Consumer baseline expectations shifting to require digital authentication demonstrates that the technology has moved from optional premium to minimum viable trust standard.", source: "reddit", sourceName: "r/malefashionadvice", date: "2026-03-25", crossLinks: [] },

  // luxury-ai-personalisation
  { id: "luxai-s1", trendId: "luxury-ai-personalisation", title: "Net-a-Porter AI personal stylist achieves 4x conversion rate vs. standard browse", summary: "AI personal shopping in luxury e-commerce converts at dramatically higher rates than catalogue browsing, proving the commercial case for personalisation investment.", source: "news", sourceName: "Business of Fashion", date: "2026-01-20", crossLinks: [] },
  { id: "luxai-s2", trendId: "luxury-ai-personalisation", title: "Chanel launches invite-only AI concierge for ultra-high-net-worth clients", summary: "Ultra-luxury brands are using AI to deepen exclusivity rather than democratise, the AI layer makes the personalised experience scalable without diluting the brand.", source: "news", sourceName: "Vogue", date: "2026-03-28", crossLinks: [] },
  { id: "luxai-s3", trendId: "luxury-ai-personalisation", title: "r/femalefashionadvice: the luxury AI stylist remembered my size change after my pregnancy, I was shocked", summary: "Consumer emotional response to AI memory and continuity in luxury service reveals that empathetic personalisation is the real luxury differentiator.", source: "reddit", sourceName: "r/femalefashionadvice", date: "2026-02-14", crossLinks: [] },
  { id: "luxai-s4", trendId: "luxury-ai-personalisation", title: "Harrods AI personal shopping service manages wardrobes for 50,000 clients, luxury retail scales intimacy", summary: "AI wardrobe management at scale proves the core luxury proposition, feeling uniquely known, can be delivered without compromising margins by adding human staff.", source: "news", sourceName: "Vogue Business", date: "2026-03-05", crossLinks: [] },
  { id: "luxai-s5", trendId: "luxury-ai-personalisation", title: "Hermès AI waiting list prioritisation uses client history to predict who will buy, conversion doubles", summary: "AI-managed access to limited products is deepening the exclusivity logic of luxury scarcity, the algorithm knows who deserves to be offered the Birkin.", source: "news", sourceName: "Business of Fashion", date: "2026-04-10", crossLinks: [] },
  { id: "luxai-s6", trendId: "luxury-ai-personalisation", title: "r/handbags: my SA uses AI notes on me, she knew I'd love the new Celine before I did", summary: "Sales associate empowerment with AI client intelligence is elevating the human relationship, not replacing it, the luxury encounter feels more personal with AI behind it.", source: "reddit", sourceName: "r/handbags", date: "2026-02-28", crossLinks: [] },
  { id: "luxai-s7", trendId: "luxury-ai-personalisation", title: "Gucci personalised campaign achieves 6x engagement vs. brand average, AI creative personalisation proves ROI", summary: "Personalised luxury creative at scale (individual-level campaign variants) is delivering commercial results that justify the infrastructure investment for any luxury holding company.", source: "news", sourceName: "Campaign", date: "2026-05-05", crossLinks: [] },
  { id: "luxai-s8", trendId: "luxury-ai-personalisation", title: "Louis Vuitton custom monogram AI generates 10M variations, mass bespoke becomes real", summary: "AI-enabled mass customisation at the world's largest luxury brand signals that bespoke personalisation is no longer a production constraint, it's a positioning choice.", source: "news", sourceName: "Vogue", date: "2026-01-15", crossLinks: [] },

  // food-cultivated-protein
  { id: "foodcp-s1", trendId: "food-cultivated-protein", title: "GOOD Meat receives EU approval, cultivated chicken enters European restaurants", summary: "EU regulatory approval for cultivated meat removes the last major Western market barrier, triggering the restaurant and retail rollout phase.", source: "news", sourceName: "The Guardian", date: "2026-02-22", crossLinks: [] },
  { id: "foodcp-s2", trendId: "food-cultivated-protein", title: "Impossible Foods precision fermentation costs reach $8/kg, price parity approaching", summary: "Fermentation-derived protein is approaching conventional protein price parity at a pace that suggests mass market tipping point within 36 months.", source: "news", sourceName: "MIT Technology Review", date: "2026-03-15", crossLinks: [] },
  { id: "foodcp-s3", trendId: "food-cultivated-protein", title: "r/food: I ate cultivated chicken at a Michelin restaurant, couldn't tell the difference", summary: "Consumer taste validation from credible early adopters (fine dining context) is the word-of-mouth signal that precedes mainstream acceptance of new food technologies.", source: "reddit", sourceName: "r/food", date: "2026-04-05", crossLinks: [] },
  { id: "foodcp-s4", trendId: "food-cultivated-protein", title: "Upside Foods partners with 15 US restaurant chains, cultivated meat exits fine dining into casual", summary: "Cultivated meat moving from fine dining signal to casual dining infrastructure is the category's mainstream crossover moment, volume follows distribution.", source: "news", sourceName: "Restaurant Business", date: "2026-03-28", crossLinks: [] },
  { id: "foodcp-s5", trendId: "food-cultivated-protein", title: "r/vegan: lab-grown meat is the most convincing argument I've seen for getting meat eaters to reduce", summary: "Vegan community strategic endorsement of cultivated meat as a harm-reduction tool signals cross-ideological alignment that will reduce cultural resistance to adoption.", source: "reddit", sourceName: "r/vegan", date: "2026-02-15", crossLinks: [] },
  { id: "foodcp-s6", trendId: "food-cultivated-protein", title: "Tyson Foods invests $200M in cultivated protein R&D, traditional meat giant hedges category", summary: "Conventional protein industry investment in cultivated alternatives confirms that incumbent players see the category as real disruption, not PR exercise.", source: "news", sourceName: "Food Navigator", date: "2026-04-18", crossLinks: [] },
  { id: "foodcp-s7", trendId: "food-cultivated-protein", title: "Singapore's cultivated meat sector employs 2,000 people, first cultivated protein economy emerges", summary: "Workforce scale in a cultivated protein sector confirms economic reality beyond product development, the industry infrastructure is being built.", source: "news", sourceName: "Reuters", date: "2026-01-22", crossLinks: [] },
  { id: "foodcp-s8", trendId: "food-cultivated-protein", title: "r/Cooking: I made a cultivated beef burger at home, costs the same as premium ground beef now", summary: "Retail price parity for cultivated meat in the consumer beef category marks the beginning of mainstream household adoption, the price signal has arrived.", source: "reddit", sourceName: "r/Cooking", date: "2026-05-08", crossLinks: [] },

  // creativity-generative-tools
  { id: "crtgen-s1", trendId: "creativity-generative-tools", title: "Publicis and WPP report 60% of creative briefs now have AI-produced references", summary: "AI-generated creative references have become standard in the brief process at major holding companies, signalling a structural shift in how creative work begins.", source: "news", sourceName: "Campaign", date: "2026-02-15", crossLinks: [] },
  { id: "crtgen-s2", trendId: "creativity-generative-tools", title: "Runway Gen-3 enables full 60-second photorealistic video from text prompt", summary: "The quality threshold for AI video generation has crossed into broadcast usability, creating a mass-market disruption moment for video production.", source: "news", sourceName: "TechCrunch", date: "2026-03-28", crossLinks: [] },
  { id: "crtgen-s3", trendId: "creativity-generative-tools", title: "r/graphic_design: I used AI to produce a full brand identity in one afternoon, the client couldn't tell", summary: "Community reports of AI-produced design work passing professional quality review signal that the gap between AI output and human creative work has closed in many execution categories.", source: "reddit", sourceName: "r/graphic_design", date: "2026-04-10", crossLinks: [] },
  { id: "crtgen-s4", trendId: "creativity-generative-tools", title: "Adobe Firefly reaches 10B AI-generated images, creative AI enters mass consumer behaviour", summary: "Usage at 10B images from a single platform confirms AI image generation has crossed from professional tool to consumer behaviour, the creative category is permanently altered.", source: "news", sourceName: "Wired", date: "2026-01-30", crossLinks: [] },
  { id: "crtgen-s5", trendId: "creativity-generative-tools", title: "r/DigitalArt: I earn more now with AI tools than I did in 5 years of traditional freelance", summary: "Income data from digital artists using AI tools is the most compelling adoption signal, the economic argument for AI workflow integration is being made in real time by peers.", source: "reddit", sourceName: "r/DigitalArt", date: "2026-03-15", crossLinks: [] },
  { id: "crtgen-s6", trendId: "creativity-generative-tools", title: "BBDO cuts campaign production budget 40% using generative AI, talent investment shifts to creative direction", summary: "Major creative agency production economics are being restructured by AI tools, the value capture moves from execution skill to creative strategy.", source: "news", sourceName: "Campaign", date: "2026-04-25", crossLinks: [] },
  { id: "crtgen-s7", trendId: "creativity-generative-tools", title: "Midjourney's v8 model enters product design, furniture and fashion are being industrially designed in AI", summary: "Generative tools expanding from 2D images into functional product design represents the next category expansion for creative AI, with industrial implications.", source: "news", sourceName: "Dezeen", date: "2026-02-20", crossLinks: [] },
  { id: "crtgen-s8", trendId: "creativity-generative-tools", title: "Canva AI suite adds brand-safe generation, 170M users get enterprise AI creative tools", summary: "When the world's most-used design tool integrates AI generation at consumer scale, the democratisation of professional-quality creative production is complete.", source: "news", sourceName: "TechCrunch", date: "2026-05-08", crossLinks: [] },
  { id: "crtgen-s9", trendId: "creativity-generative-tools", title: "r/freelance: clients now pay less for execution and more for taste, AI changed what skills earn money", summary: "Freelance market restructuring driven by AI tools is shifting value from technical execution to creative direction, the economic model of creative work is inverting.", source: "reddit", sourceName: "r/freelance", date: "2026-04-02", crossLinks: [] },

  // creativity-human-ai-authorship
  { id: "crtaut-s1", trendId: "creativity-human-ai-authorship", title: "US Copyright Office rules AI-assisted art requires 'human creative control' for protection", summary: "The regulatory framework for AI creative authorship is forming, clarity on what constitutes protectable creative control is the key variable brands and agencies need.", source: "news", sourceName: "The Verge", date: "2026-01-20", crossLinks: [] },
  { id: "crtaut-s2", trendId: "creativity-human-ai-authorship", title: "Getty Images launches AI-generated content with full IP indemnification", summary: "Stock platform IP insurance for AI content is the market signal that the commercial use of AI creative output has been legitimised at scale.", source: "news", sourceName: "Wired", date: "2026-03-05", crossLinks: [] },
  { id: "crtaut-s3", trendId: "creativity-human-ai-authorship", title: "r/ArtificialIntelligence: who owns the creative vision when AI does the execution?", summary: "The authorship question is being debated in real time across creative communities, the emerging consensus is that direction and curation are the protectable creative acts.", source: "reddit", sourceName: "r/ArtificialIntelligence", date: "2026-02-28", crossLinks: [] },
  { id: "crtaut-s4", trendId: "creativity-human-ai-authorship", title: "EU AI Act article 52 mandates disclosure for AI-generated creative content in advertising", summary: "EU regulatory disclosure requirements for AI content create a new compliance category for agencies and a transparency expectation for consumers.", source: "news", sourceName: "Campaign", date: "2026-03-22", crossLinks: [] },
  { id: "crtaut-s5", trendId: "creativity-human-ai-authorship", title: "Spotify's AI-generated playlist descriptions cause controversy, attribution blur hits consumer trust", summary: "Consumer trust reactions to undisclosed AI creative output are establishing the moral hazard of non-disclosure, and creating market pressure for voluntary transparency.", source: "news", sourceName: "The Guardian", date: "2026-01-28", crossLinks: [] },
  { id: "crtaut-s6", trendId: "creativity-human-ai-authorship", title: "r/writing: I disclosed AI assistance on my novel and sales doubled, readers prefer transparency", summary: "Counter-intuitive consumer preference for AI-disclosed creative work suggests that authenticity signalling is more valuable than concealment.", source: "reddit", sourceName: "r/writing", date: "2026-04-18", crossLinks: [] },
  { id: "crtaut-s7", trendId: "creativity-human-ai-authorship", title: "Nike 'Human Made' campaign explicitly foregrounds no-AI creative process, resonates with 35-45 demo", summary: "Non-AI creative work is becoming a marketing differentiator among consumers who actively value human authorship, creating two distinct market segments with opposite preferences.", source: "news", sourceName: "Marketing Week", date: "2026-05-12", crossLinks: [] },
  { id: "crtaut-s8", trendId: "creativity-human-ai-authorship", title: "Writers Guild AI disclosure clause becomes industry standard in 14 countries", summary: "Labour agreements formalising AI authorship disclosure represent regulatory normalisation of the creative AI question, contracts are settling what philosophy couldn't resolve.", source: "news", sourceName: "Variety", date: "2026-02-10", crossLinks: [] },

  // photography-ai-authenticity
  { id: "phtoauth-s1", trendId: "photography-ai-authenticity", title: "AP and Reuters mandate C2PA content credentials on all editorial photography", summary: "Press agencies mandating authentication standards sets the baseline that advertisers and social platforms will eventually follow.", source: "news", sourceName: "Reuters Institute", date: "2026-02-10", crossLinks: [] },
  { id: "phtoauth-s2", trendId: "photography-ai-authenticity", title: "Getty's AI watermark detection catches 2M synthetic images submitted as photography", summary: "The scale of synthetic image submission to stock platforms has triggered industrial-scale detection, the verification arms race has begun.", source: "news", sourceName: "PetaPixel", date: "2026-03-18", crossLinks: [] },
  { id: "phtoauth-s3", trendId: "photography-ai-authenticity", title: "r/photography: clients are now asking me to prove my photos are real, this was unthinkable 2 years ago", summary: "The authenticity question has reached client relationships, photographers are now having to document their process as proof of genuine capture.", source: "reddit", sourceName: "r/photography", date: "2026-04-05", crossLinks: [] },
  { id: "phtoauth-s4", trendId: "photography-ai-authenticity", title: "World Press Photo bans AI-generated images with retroactive review of past winners", summary: "The most prestigious photojournalism award creating explicit AI exclusion rules sets the authenticity standard that the entire photojournalism ecosystem will adopt.", source: "news", sourceName: "British Journal of Photography", date: "2026-03-02", crossLinks: [] },
  { id: "phtoauth-s5", trendId: "photography-ai-authenticity", title: "Instagram tests mandatory AI labelling, 'Made with AI' badge on synthetic imagery", summary: "Platform-level AI disclosure at Instagram scale (2B users) will create universal consumer awareness of the synthetic/real distinction in visual media.", source: "news", sourceName: "The Verge", date: "2026-04-15", crossLinks: [] },
  { id: "phtoauth-s6", trendId: "photography-ai-authenticity", title: "r/photojournalism: I lost a news contract because AI images were cheaper, but they want mine when they need real", summary: "The commoditisation of stock imagery by AI creates a two-tier market, synthetic imagery for generic needs, authentic photography for high-stakes contexts.", source: "reddit", sourceName: "r/photojournalism", date: "2026-02-28", crossLinks: [] },
  { id: "phtoauth-s7", trendId: "photography-ai-authenticity", title: "Adobe launches 'Content Authenticity Initiative' tools, 1,800 media companies commit to standards", summary: "Industry-wide adoption of content authentication standards creates the technical infrastructure for a trusted visual media ecosystem, a public good for the information environment.", source: "news", sourceName: "Adobe Newsroom", date: "2026-05-08", crossLinks: [] },

  // photography-computational
  { id: "phtocomp-s1", trendId: "photography-computational", title: "iPhone 16 Pro camera outperforms $3,000 Sony in blind test at Wired", summary: "Computational photography has crossed the threshold where smartphone cameras beat professional equipment in most real-world conditions, a paradigm shift for the industry.", source: "news", sourceName: "Wired", date: "2026-01-25", crossLinks: [] },
  { id: "phtocomp-s2", trendId: "photography-computational", title: "Adobe Lightroom AI adds scene-aware automatic grading, professionals divided", summary: "AI post-processing that makes creative decisions is landing in professional tools, the debate about what constitutes creative photography is shifting from capture to curation.", source: "news", sourceName: "PetaPixel", date: "2026-03-12", crossLinks: [] },
  { id: "phtocomp-s3", trendId: "photography-computational", title: "r/photography: my phone camera made me better by handling the technical, now I just compose", summary: "Computational photography is changing what photographers learn and value, technical mastery depreciating, compositional and directorial vision appreciating.", source: "reddit", sourceName: "r/photography", date: "2026-02-20", crossLinks: [] },
  { id: "phtocomp-s4", trendId: "photography-computational", title: "Google Pixel 9 Pro shoots 50MP astrophotography without a tripod, computational limits expand", summary: "New computational photography capabilities in consumer handsets are enabling shots previously requiring professional equipment and technique, democratising specialised photography.", source: "news", sourceName: "The Verge", date: "2026-03-28", crossLinks: [] },
  { id: "phtocomp-s5", trendId: "photography-computational", title: "r/analog: film photography is growing because computational perfection makes imperfection valuable", summary: "The inverse reaction to computational photography perfection is driving analog film adoption, authentic imperfection as a counter-cultural signal.", source: "reddit", sourceName: "r/analog", date: "2026-04-10", crossLinks: [] },
  { id: "phtocomp-s6", trendId: "photography-computational", title: "DJI Osmo 5 adds AI subject tracking and auto-edit, solo content creation goes professional quality", summary: "AI camera intelligence enabling single-person professional-quality content production is collapsing the crew requirements for commercial photography and video.", source: "news", sourceName: "TechCrunch", date: "2026-02-15", crossLinks: [] },
  { id: "phtocomp-s7", trendId: "photography-computational", title: "Canon discontinues entry-level DSLR line, computational smartphone photography wins mass market", summary: "Camera manufacturer strategy adjustments confirm that computational photography has won the mass market, professional camera focus shifts to high-end creative and specialist use cases.", source: "news", sourceName: "DP Review", date: "2026-01-18", crossLinks: [] },

  // film-ai-production
  { id: "filmaid-s1", trendId: "film-ai-production", title: "Disney uses AI de-aging for Harrison Ford in Indiana Jones, then for 40 other actors", summary: "Studio adoption of AI actor performance tools is scaling rapidly, the technology has crossed the uncanny valley threshold and entered mainstream production.", source: "news", sourceName: "Variety", date: "2026-01-28", crossLinks: [] },
  { id: "filmaid-s2", trendId: "film-ai-production", title: "A24 produces $4M film with virtual production and AI, theatrical quality at indie budget", summary: "AI production tools are collapsing the budget required for theatrical-quality production, democratising film-making while disrupting studio economics.", source: "news", sourceName: "IndieWire", date: "2026-03-14", crossLinks: [] },
  { id: "filmaid-s3", trendId: "film-ai-production", title: "r/filmmaking: AI pre-visualisation has replaced the storyboard, and it's 10x faster", summary: "AI pre-production tools are being adopted by working directors as a workflow improvement, the creative process is staying human while the execution is being AI-assisted.", source: "reddit", sourceName: "r/filmmaking", date: "2026-04-08", crossLinks: [] },
  { id: "filmaid-s4", trendId: "film-ai-production", title: "Lionsgate AI dubbing system localises films into 40 languages in 48 hours, global release economics change", summary: "AI dubbing at scale removes the economics constraint on international release windows, enabling simultaneous global launches that were previously financially prohibitive.", source: "news", sourceName: "Variety", date: "2026-02-22", crossLinks: [] },
  { id: "filmaid-s5", trendId: "film-ai-production", title: "r/Filmmakers: AI sound design saved us $40k on post, and the supervisor said it was better than he expected", summary: "Production team adoption of AI sound design tools is proving both quality and cost benefits, adoption will accelerate as more productions report similar outcomes.", source: "reddit", sourceName: "r/Filmmakers", date: "2026-03-30", crossLinks: [] },
  { id: "filmaid-s6", trendId: "film-ai-production", title: "Epic Games' MetaHuman AI creates photorealistic digital actors, SAG-AFTRA opens emergency talks", summary: "Digital human technology reaching broadcast quality triggers urgent union negotiations, the question of digital likeness rights is no longer theoretical.", source: "news", sourceName: "The Hollywood Reporter", date: "2026-04-25", crossLinks: [] },
  { id: "filmaid-s7", trendId: "film-ai-production", title: "Netflix AI script analysis tool predicts greenlight success with 74% accuracy, development economics shift", summary: "Predictive script analysis is changing what gets made, AI risk-scoring of scripts will systematically bias production toward data-validated concepts.", source: "news", sourceName: "Variety", date: "2026-01-18", crossLinks: [] },

  // film-algorithmic-culture
  { id: "filmalg-s1", trendId: "film-algorithmic-culture", title: "Netflix data shows 'mid-episode hook' structure boosts completion by 34%, and it's now in every script", summary: "Algorithmic engagement data is actively shaping narrative structure, the algorithm is becoming an invisible co-writer.", source: "news", sourceName: "The Hollywood Reporter", date: "2026-02-05", crossLinks: [] },
  { id: "filmalg-s2", trendId: "film-algorithmic-culture", title: "Greta Gerwig and 12 directors sign open letter against 'algorithm-driven creative notes'", summary: "Creative resistance to algorithmic production influence is forming a public position, the tension between data and vision is becoming a culture war in film.", source: "news", sourceName: "Variety", date: "2026-03-22", crossLinks: [] },
  { id: "filmalg-s3", trendId: "film-algorithmic-culture", title: "r/movies: everything feels the same because it literally is, Netflix algorithm is writing movies now", summary: "Audience perception of algorithmic homogeneity in streaming content is a consumer sentiment signal that will eventually drive counter-programming demand.", source: "reddit", sourceName: "r/movies", date: "2026-02-18", crossLinks: [] },
  { id: "filmalg-s4", trendId: "film-algorithmic-culture", title: "Theatrical release data shows non-algorithm-optimised films outperform 5-year average, counter-signal emerges", summary: "Box office data contradicting the algorithmic content thesis is creating the evidentiary basis for studios to resist data-driven creative direction.", source: "news", sourceName: "The Hollywood Reporter", date: "2026-04-05", crossLinks: [] },
  { id: "filmalg-s5", trendId: "film-algorithmic-culture", title: "r/MovieSuggestions: recommend me something that doesn't feel like it was made by algorithm, 50k upvotes", summary: "High-engagement demand for non-algorithmic content recommendations on Reddit reveals the consumer appetite for authentic, distinctive storytelling.", source: "reddit", sourceName: "r/MovieSuggestions", date: "2026-03-15", crossLinks: [] },
  { id: "filmalg-s6", trendId: "film-algorithmic-culture", title: "Arthouse cinema attendance up 28% YoY, audiences seeking alternative to streaming homogeneity", summary: "Physical arthouse cinema growth directly attributable to algorithmic streaming fatigue represents a structural counter-market to the data-optimised mainstream.", source: "news", sourceName: "Variety", date: "2026-01-30", crossLinks: [] },
  { id: "filmalg-s7", trendId: "film-algorithmic-culture", title: "Apple TV+ strategy: 'prestige not data' positioning yields 5 Oscar nominations, editorial curation beats algorithm", summary: "Apple's explicit anti-algorithm content strategy is generating awards attention that validates distinctiveness over data-optimised content production.", source: "news", sourceName: "The Hollywood Reporter", date: "2026-05-05", crossLinks: [] },

  // branding-ai-identity
  { id: "brnaid-s1", trendId: "branding-ai-identity", title: "Pentagram launches AI brand system that generates on-brief assets in real time", summary: "When a legendary design firm launches an AI brand product, the format has crossed from startup experimentation to establishment adoption.", source: "news", sourceName: "Dezeen", date: "2026-02-22", crossLinks: [] },
  { id: "brnaid-s2", trendId: "branding-ai-identity", title: "Spotify's AI-generated campaign produces 1,000 personalised poster variations simultaneously", summary: "AI creative systems producing thousands of on-brand variations simultaneously represent a step-change in campaign personalisation capability.", source: "news", sourceName: "Campaign", date: "2026-03-30", crossLinks: [] },
  { id: "brnaid-s3", trendId: "branding-ai-identity", title: "r/graphic_design: AI brand systems are making junior design roles redundant, or are they?", summary: "The AI impact on design careers debate reflects a real structural shift, execution roles depreciating, strategic and training roles appreciating.", source: "reddit", sourceName: "r/graphic_design", date: "2026-04-12", crossLinks: [] },
  { id: "brnaid-s4", trendId: "branding-ai-identity", title: "Coca-Cola's 'Create Real Magic' AI campaign generates 120,000 consumer artworks, brand as canvas", summary: "Consumer-generative brand campaigns using AI turn the brand identity itself into a creative tool, inverting the one-to-many advertising model.", source: "news", sourceName: "Adweek", date: "2026-03-08", crossLinks: [] },
  { id: "brnaid-s5", trendId: "branding-ai-identity", title: "r/startups: I got a professional brand identity in 4 hours using AI tools, paid $80 not $8,000", summary: "Democratisation of brand identity creation through AI is compressing the market for entry-level brand design while elevating the threshold for differentiated strategic work.", source: "reddit", sourceName: "r/startups", date: "2026-04-28", crossLinks: [] },
  { id: "brnaid-s6", trendId: "branding-ai-identity", title: "Publicis Groupe launches Marcel AI creative director, AI makes final creative decisions on 20% of work", summary: "Agency-level AI creative direction represents a threshold moment, when the AI is in the decision seat, not just the execution seat, creative accountability shifts.", source: "news", sourceName: "Campaign", date: "2026-02-10", crossLinks: [] },
  { id: "brnaid-s7", trendId: "branding-ai-identity", title: "Nike's adaptive logo system generates context-aware variants across 50 markets in real time", summary: "Dynamic brand identity that responds to local market, cultural context, and channel environment is the logical end state of AI brand systems, Nike is getting there first.", source: "news", sourceName: "Dezeen", date: "2026-05-12", crossLinks: [] },

  // branding-cultural-intelligence
  { id: "brncult-s1", trendId: "branding-cultural-intelligence", title: "Brandwatch AI predicts cultural trend peaks 8 weeks before they surface in brand briefs", summary: "AI trend prediction tools are creating a competitive window, brands that act on early signals arrive first rather than reacting to what's already mainstream.", source: "news", sourceName: "Marketing Week", date: "2026-01-30", crossLinks: [] },
  { id: "brncult-s2", trendId: "branding-cultural-intelligence", title: "Dupe culture predicted 6 months early by cultural AI, brands that used it grew 40% YoY", summary: "Real-world commercial outcomes from AI cultural intelligence are creating proof of ROI that will drive rapid adoption across the brand strategy industry.", source: "news", sourceName: "Harvard Business Review", date: "2026-03-10", crossLinks: [] },
  { id: "brncult-s3", trendId: "branding-cultural-intelligence", title: "r/marketing: AI trend tools are making our quarterly planning cycles feel obsolete", summary: "Marketing practitioner response to real-time cultural AI reveals that traditional planning cadences are misaligned with the speed of cultural signal emergence.", source: "reddit", sourceName: "r/marketing", date: "2026-02-25", crossLinks: [] },
  { id: "brncult-s4", trendId: "branding-cultural-intelligence", title: "Sprinklr adds real-time cultural relevance scoring to all brand content before publish", summary: "Pre-publication cultural fit scoring integrated into content workflows is making cultural intelligence an operational standard rather than a strategic input.", source: "news", sourceName: "Marketing Week", date: "2026-04-08", crossLinks: [] },
  { id: "brncult-s5", trendId: "branding-cultural-intelligence", title: "r/branding: our AI cultural radar caught the backlash 10 days before it hit mainstream, we pivoted in time", summary: "Brand team testimony of AI cultural intelligence preventing a reputational misstep is the most compelling adoption argument, risk mitigation at speed.", source: "reddit", sourceName: "r/branding", date: "2026-03-18", crossLinks: [] },
  { id: "brncult-s6", trendId: "branding-cultural-intelligence", title: "LVMH builds proprietary cultural AI trained on 100 years of brand archive data, defensible competitive advantage", summary: "Proprietary cultural intelligence trained on brand-specific data is the moat that commoditised AI trend tools cannot replicate, LVMH's approach sets the bar.", source: "news", sourceName: "Vogue Business", date: "2026-05-02", crossLinks: [] },
  { id: "brncult-s7", trendId: "branding-cultural-intelligence", title: "Kantar adds AI cultural resonance scoring to brand tracker methodology", summary: "Research methodology adoption of AI cultural intelligence signals that the insight is becoming standard measurement practice, not a specialist tool.", source: "news", sourceName: "Research Live", date: "2026-02-18", crossLinks: [] },

  // food-ai-flavour
  // fragrance-ai-formulation
  { id: "frgai-s1", trendId: "fragrance-ai-formulation", title: "Givaudan's Carto AI creates 1,800 new accords in one year vs 40 traditionally", summary: "AI fragrance formulation is producing novel olfactory territory at 45x the pace of human-only development, fundamentally changing the competitive dynamics of the fragrance industry.", source: "news", sourceName: "WWD", date: "2026-02-15", crossLinks: [] },
  { id: "frgai-s2", trendId: "fragrance-ai-formulation", title: "Cosmo International Fragrances uses AI to map consumers' emotional scent memories", summary: "AI trained on emotional psychology data is being used to create fragrances that deliberately target autobiographical memory triggers, creating deeper consumer attachment.", source: "news", sourceName: "Beauty Business", date: "2026-03-20", crossLinks: [] },
  { id: "frgai-s3", trendId: "fragrance-ai-formulation", title: "r/fragrance: the 'AI-developed' accord in my new perfume is unlike anything I've smelled", summary: "Consumer discovery of genuinely novel AI-developed fragrance accords is creating organic excitement, the first sign that AI formulation delivers a meaningful sensory difference.", source: "reddit", sourceName: "r/fragrance", date: "2026-04-08", crossLinks: [] },
  { id: "frgai-s4", trendId: "fragrance-ai-formulation", title: "Firmenich AI predicts which fragrance accords will resonate in each global market, localisation at speed", summary: "AI cultural fragrance intelligence is enabling mass production of market-specific scent profiles that would have required years of local consumer research to develop.", source: "news", sourceName: "Cosmetics Business", date: "2026-03-05", crossLinks: [] },
  { id: "frgai-s5", trendId: "fragrance-ai-formulation", title: "r/DIYfragrance: AI-assisted formulation tools mean I can now create professional-quality compositions at home", summary: "Consumer-grade AI fragrance formulation tools are democratising perfumery knowledge, potentially disrupting the professional barrier that has protected the category's complexity premium.", source: "reddit", sourceName: "r/DIYfragrance", date: "2026-04-20", crossLinks: [] },
  { id: "frgai-s6", trendId: "fragrance-ai-formulation", title: "Chanel partners with IFF on AI-developed 'sustainable accord library', green chemistry meets AI", summary: "AI formulation tools enabling sustainable ingredient replacement without sacrificing olfactory quality represent the convergence of the industry's biggest ethical and technical challenges.", source: "news", sourceName: "WWD", date: "2026-02-28", crossLinks: [] },
  { id: "frgai-s7", trendId: "fragrance-ai-formulation", title: "Bespoke fragrance creation via phone questionnaire launches at Selfridges, AI democratises haute parfumerie", summary: "Consumer-facing AI bespoke fragrance services are translating artisanal parfumerie into a scalable, accessible product category, the craft premium survives the democratisation.", source: "news", sourceName: "Vogue UK", date: "2026-05-05", crossLinks: [] },
  { id: "frgai-s8", trendId: "fragrance-ai-formulation", title: "r/Perfumery: AI suggested an accord combination I would never have thought of, it's now my signature scent", summary: "Consumer testimony of genuine creative surprise from AI fragrance suggestions is the most compelling adoption signal, the AI is expanding what people know they want.", source: "reddit", sourceName: "r/Perfumery", date: "2026-03-25", crossLinks: [] },

  // fragrance-emotional-tech
  { id: "frgemot-s1", trendId: "fragrance-emotional-tech", title: "Aesop commissions olfactory design study for all new flagship retail environments", summary: "Luxury retail's investment in evidence-based scent design signals that olfactory experience has moved from nice-to-have to standard store design element.", source: "news", sourceName: "Dezeen", date: "2026-01-22", crossLinks: [] },
  { id: "frgemot-s2", trendId: "fragrance-emotional-tech", title: "Moodo smart diffuser syncs scent to biometric stress data via Whoop integration", summary: "Biometric-triggered scent delivery represents the first genuinely personalised ambient wellbeing system, scent as responsive intervention rather than ambient background.", source: "news", sourceName: "TechCrunch", date: "2026-03-10", crossLinks: [] },
  { id: "frgemot-s3", trendId: "fragrance-emotional-tech", title: "r/fragrance: using different scents for different emotional states changed how I think about perfume", summary: "Consumer adoption of intentional olfactory design in personal routines signals that the category is moving from identity expression to emotional toolkit.", source: "reddit", sourceName: "r/fragrance", date: "2026-02-28", crossLinks: [] },
  { id: "frgemot-s4", trendId: "fragrance-emotional-tech", title: "ScentAir signs contract to deploy evidence-based olfactory design in 200 luxury hotels by end-2026", summary: "Commercial-scale olfactory environment design contracts signal that scent-as-service has crossed into standard hospitality infrastructure investment.", source: "news", sourceName: "Dezeen", date: "2026-04-12", crossLinks: [] },
  { id: "frgemot-s5", trendId: "fragrance-emotional-tech", title: "r/sleep: I use a specific scent to trigger sleep, my sleep score improved 22% in 6 weeks", summary: "Consumer experimentation with olfactory sleep triggers shows behavioural conditioning through scent is real and measurable, a clinical insight in consumer practice.", source: "reddit", sourceName: "r/sleep", date: "2026-03-08", crossLinks: [] },
  { id: "frgemot-s6", trendId: "fragrance-emotional-tech", title: "Headspace launches 'Scentscape' ambient scent diffuser to complement meditation app, sensory wellness integrates", summary: "Digital wellness app extending into physical scent products represents the multi-sensory wellness stack becoming a category, and a product line.", source: "news", sourceName: "TechCrunch", date: "2026-02-05", crossLinks: [] },
  { id: "frgemot-s7", trendId: "fragrance-emotional-tech", title: "Clinical trials confirm lavender scent reduces surgical anxiety 31%, olfactory therapy enters hospital protocol", summary: "Clinical evidence for olfactory therapeutic application at hospital scale legitimises scent-as-medicine claims for the consumer wellness category.", source: "news", sourceName: "JAMA Network Open", date: "2026-04-28", crossLinks: [] },

  // jewellery-lab-grown
  { id: "jewlg-s1", trendId: "jewellery-lab-grown", title: "De Beers Lightbox reaches 50 store locations, mined diamond giant embraces lab-grown", summary: "When the world's largest diamond company launches a lab-grown sub-brand at scale, the market bifurcation is confirmed, not speculated.", source: "news", sourceName: "Retail Jeweller", date: "2026-02-08", crossLinks: [] },
  { id: "jewlg-s2", trendId: "jewellery-lab-grown", title: "Lab-grown diamond engagement rings reach 40% of US market share", summary: "Engagement ring adoption is the high-value proof point for lab-grown acceptance, emotional significance overcomes synthetic stigma at this occasion purchase.", source: "news", sourceName: "National Jeweler", date: "2026-03-25", crossLinks: [] },
  { id: "jewlg-s3", trendId: "jewellery-lab-grown", title: "r/Jewelry: I told my fiancée and she preferred lab-grown because of the ethics", summary: "Consumer preference data from the most emotionally significant jewellery purchase confirms that ethical sourcing now outweighs heritage rarity arguments for many buyers.", source: "reddit", sourceName: "r/Jewelry", date: "2026-04-15", crossLinks: [] },
  { id: "jewlg-s4", trendId: "jewellery-lab-grown", title: "Pandora switches to 100% lab-grown diamonds, the world's largest jewellery brand goes fully synthetic", summary: "When the world's largest volume jewellery brand fully commits to lab-grown, the mainstream market has chosen, this is no longer a premium niche position.", source: "news", sourceName: "Retail Jeweller", date: "2026-03-10", crossLinks: [] },
  { id: "jewlg-s5", trendId: "jewellery-lab-grown", title: "Lab-grown rubies and sapphires follow diamonds into fashion jewellery, category expands beyond diamonds", summary: "The lab-grown disruption extending from diamonds to coloured stones signals a systematic restructuring of the entire fine jewellery material supply chain.", source: "news", sourceName: "National Jeweler", date: "2026-02-18", crossLinks: [] },
  { id: "jewlg-s6", trendId: "jewellery-lab-grown", title: "r/malefashionadvice: I got a lab-grown diamond ring for $800 that looks identical to my friend's $8000 mined one", summary: "Consumer value comparison testimony is the most powerful driver of category adoption, and the price gap at equivalent quality is now impossible to ignore.", source: "reddit", sourceName: "r/malefashionadvice", date: "2026-04-28", crossLinks: [] },
  { id: "jewlg-s7", trendId: "jewellery-lab-grown", title: "Signet Jewelers reports lab-grown now 55% of diamond volume, majority market position confirmed", summary: "Majority retail volume in the world's largest speciality jewellery retailer confirms that lab-grown diamonds have won the mass market, not just the eco-conscious niche.", source: "news", sourceName: "National Jeweler", date: "2026-05-10", crossLinks: [] },
  { id: "jewlg-s8", trendId: "jewellery-lab-grown", title: "Christie's jewellery auction removes all lab-grown lots, mined stones stratify into ultra-premium", summary: "Auction house exclusion of lab-grown stones from fine jewellery auctions creates the market bifurcation that determines how the category stratifies long-term.", source: "news", sourceName: "The Art Newspaper", date: "2026-01-25", crossLinks: [] },

  // jewellery-digital-identity
  { id: "jewdig-s1", trendId: "jewellery-digital-identity", title: "Tiffany & Co launches digital twin jewellery line for gaming avatars", summary: "Luxury jewellery entering avatar fashion signals that the category has identified digital identity expression as a genuine extension market.", source: "news", sourceName: "Vogue Business", date: "2026-01-30", crossLinks: [] },
  { id: "jewdig-s2", trendId: "jewellery-digital-identity", title: "Roblox users spend $400M on virtual accessories in 2025, jewellery category leads", summary: "At-scale virtual accessory spending proves that digital self-expression is a genuine consumer behaviour, not a niche curiosity.", source: "news", sourceName: "Hypebeast", date: "2026-03-14", crossLinks: [] },
  { id: "jewdig-s3", trendId: "jewellery-digital-identity", title: "r/femalefashionadvice: I care about my avatar's jewellery as much as my real wardrobe now", summary: "Consumer self-report of equivalent investment in digital and physical accessory identity signals a permanent blending of fashion categories.", source: "reddit", sourceName: "r/femalefashionadvice", date: "2026-02-20", crossLinks: [] },
  { id: "jewdig-s4", trendId: "jewellery-digital-identity", title: "Bulgari releases limited AR jewellery experience, try on pieces in mixed reality before purchase", summary: "Luxury jewellery AR try-on is bridging digital experience and physical purchase in a category where tactile evaluation was previously considered essential.", source: "news", sourceName: "Vogue Business", date: "2026-04-10", crossLinks: [] },
  { id: "jewdig-s5", trendId: "jewellery-digital-identity", title: "r/gaming: I designed my own jewellery in-game and it's now available as a physical piece, the loop closed", summary: "Consumer experience of game-to-physical jewellery loop confirms that the category's digital extension is not just display but genuine product development.", source: "reddit", sourceName: "r/gaming", date: "2026-03-22", crossLinks: [] },
  { id: "jewdig-s6", trendId: "jewellery-digital-identity", title: "Swarovski's Crystal Universe virtual experience drives 40% higher physical purchase intent vs store visit alone", summary: "Digital jewellery experiences measurably improve physical purchase intent, the virtual layer is enhancing, not cannibalising, the physical category.", source: "news", sourceName: "Vogue Business", date: "2026-02-12", crossLinks: [] },
  { id: "jewdig-s7", trendId: "jewellery-digital-identity", title: "Gen Z spends more on digital avatar jewellery than physical jewellery, category priorities inverting", summary: "Generational spending inversion in the jewellery category signals that the physical-primary assumption is being disrupted at the point of category formation for the next consumer cohort.", source: "news", sourceName: "Business of Fashion", date: "2026-05-08", crossLinks: [] },

  // retail-ai-personalisation
  { id: "retai-s1", trendId: "retail-ai-personalisation", title: "Zalando AI stylist achieves 4.2x conversion vs. standard browse, rolls out globally", summary: "Conversion performance data from AI personalisation at scale is the commercial proof that will drive universal adoption across fashion e-commerce.", source: "news", sourceName: "Business of Fashion", date: "2026-02-12", crossLinks: [] },
  { id: "retai-s2", trendId: "retail-ai-personalisation", title: "ASOS personalised homepage now generates 60% of all revenue", summary: "When the majority of revenue flows through AI-curated product discovery, the infrastructure investment has reached strategic necessity status.", source: "news", sourceName: "Retail Week", date: "2026-03-28", crossLinks: [] },
  { id: "retai-s3", trendId: "retail-ai-personalisation", title: "r/femalefashionadvice: my AI stylist on [app] knows my taste better than I do at this point", summary: "Consumer emotional trust in AI style recommendations has crossed the threshold where the AI is genuinely preferred to self-directed browsing.", source: "reddit", sourceName: "r/femalefashionadvice", date: "2026-04-10", crossLinks: [] },
  { id: "retai-s4", trendId: "retail-ai-personalisation", title: "Amazon's AI shopping assistant adds outfit building, from search box to styled look", summary: "Platform-level AI outfit curation at Amazon's scale fundamentally changes fashion discovery for the majority of online shoppers, the algorithm becomes the stylist.", source: "news", sourceName: "TechCrunch", date: "2026-03-18", crossLinks: [] },
  { id: "retai-s5", trendId: "retail-ai-personalisation", title: "r/malefashionadvice: AI style assistants are making me a better dresser, not replacing my taste, enhancing it", summary: "Consumer framing of AI style assistance as taste enhancement rather than replacement is the psychological model that drives long-term adoption.", source: "reddit", sourceName: "r/malefashionadvice", date: "2026-02-08", crossLinks: [] },
  { id: "retai-s6", trendId: "retail-ai-personalisation", title: "John Lewis AI personal shopping replaces 40% of in-store consultation, retention same, cost 60% lower", summary: "Retail service economics are being restructured by AI personal shopping, same or better consumer outcomes at dramatically lower cost, accelerating adoption.", source: "news", sourceName: "Retail Week", date: "2026-04-22", crossLinks: [] },
  { id: "retai-s7", trendId: "retail-ai-personalisation", title: "Stitch Fix AI adds real-time trend responsiveness, personalisation meets cultural timing", summary: "Personalisation-meets-trend-timing represents the next frontier: not just what suits you, but what suits you right now in the cultural moment.", source: "news", sourceName: "Business of Fashion", date: "2026-05-02", crossLinks: [] },
  { id: "retai-s8", trendId: "retail-ai-personalisation", title: "r/fashion: I cancelled my subscription services and just use AI to find pieces, it's cheaper and better", summary: "Consumer migration from subscription curation to AI-assisted self-directed shopping signals that the AI layer is displacing human curation services.", source: "reddit", sourceName: "r/fashion", date: "2026-03-05", crossLinks: [] },

  // retail-immersive-commerce
  { id: "retimm-s1", trendId: "retail-immersive-commerce", title: "TikTok Shop reaches $20B GMV in the US, livestream commerce normalises", summary: "TikTok Shop's US scale confirms that the discovery-to-purchase compression in livestream commerce has crossed the adoption threshold in Western markets.", source: "news", sourceName: "Forbes", date: "2026-01-25", crossLinks: [] },
  { id: "retimm-s2", trendId: "retail-immersive-commerce", title: "L'Oréal AR try-on used 2 billion times, beauty leads immersive commerce adoption", summary: "Beauty's AR try-on scale proves the commercial viability of the format and sets the expectation standard for fashion and accessories categories.", source: "news", sourceName: "WWD", date: "2026-03-08", crossLinks: [] },
  { id: "retimm-s3", trendId: "retail-immersive-commerce", title: "r/femalefashionadvice: livestream shopping on TikTok has replaced my mall trips", summary: "Behaviour substitution in consumer shopping routines is the clearest indicator of structural retail change, the physical-to-digital shift in fashion retail is confirmed.", source: "reddit", sourceName: "r/femalefashionadvice", date: "2026-02-18", crossLinks: [] },
  { id: "retimm-s4", trendId: "retail-immersive-commerce", title: "YouTube Shopping integration drives $8B in shoppable video commerce, content-to-checkout closes", summary: "Platform commerce integration at YouTube scale makes every piece of content a potential purchase touchpoint, the discovery-to-buy journey becomes instantaneous.", source: "news", sourceName: "TechCrunch", date: "2026-04-18", crossLinks: [] },
  { id: "retimm-s5", trendId: "retail-immersive-commerce", title: "r/streetwear: I bought 3 pieces from a livestream drop last month, the presenter tried them on and I was sold", summary: "Social proof through real-time demonstration in livestream commerce is replicating the in-store experience at digital scale, and it converts.", source: "reddit", sourceName: "r/streetwear", date: "2026-03-25", crossLinks: [] },
  { id: "retimm-s6", trendId: "retail-immersive-commerce", title: "Snap AR shopping lens used 250M times, AR commerce on social platforms reaches mass adoption", summary: "Social platform AR commerce at 250M uses confirms that augmented try-on has crossed from early adopter experiment to mainstream social shopping behaviour.", source: "news", sourceName: "Wired", date: "2026-02-05", crossLinks: [] },
  { id: "retimm-s7", trendId: "retail-immersive-commerce", title: "Luxury brands launch immersive storefronts in Meta Horizon, virtual flagships replace pop-ups", summary: "Virtual flagship stores in social VR platforms are replacing physical pop-up retail as the go-to format for reaching younger luxury audiences in digital-native environments.", source: "news", sourceName: "Vogue Business", date: "2026-05-15", crossLinks: [] },

  // social-ai-content
  { id: "socai-s1", trendId: "social-ai-content", title: "Meta AI content creation tools double average brand posting frequency without additional headcount", summary: "AI content tools are proving their operational ROI, more output, same team, measurable engagement uplift, creating adoption pressure across all brand social teams.", source: "news", sourceName: "Social Media Today", date: "2026-02-22", crossLinks: [] },
  { id: "socai-s2", trendId: "social-ai-content", title: "Unilever AI content system produces 10,000 localised social posts per month across 50 markets", summary: "At-scale AI social content production demonstrates that global-local content personalisation is no longer a resource constraint, it's an execution problem AI solves.", source: "news", sourceName: "Marketing Week", date: "2026-03-30", crossLinks: [] },
  { id: "socai-s3", trendId: "social-ai-content", title: "r/marketing: we switched to 80% AI content and saw engagement go up, quality threshold is gone", summary: "Marketing practitioner data from AI content production is overturning the assumption that AI content underperforms human creative, at least at the scale required for social media.", source: "reddit", sourceName: "r/marketing", date: "2026-04-12", crossLinks: [] },
  { id: "socai-s4", trendId: "social-ai-content", title: "TikTok AI script generator used by 3M creators in first month, native AI content tooling arrives", summary: "Platform-native AI content tools hitting scale signals that AI-assisted creation is becoming a default workflow, not a specialist capability, on every major social platform.", source: "news", sourceName: "TechCrunch", date: "2026-05-02", crossLinks: [] },
  { id: "socai-s5", trendId: "social-ai-content", title: "Adobe Firefly social content suite reduces brand campaign production cost by 62%", summary: "Enterprise creative AI tools are delivering cost reduction at a scale that makes the business case for AI-first content production mathematically unavoidable for large marketing teams.", source: "news", sourceName: "Adweek", date: "2026-03-15", crossLinks: [] },
  { id: "socai-s6", trendId: "social-ai-content", title: "AI-generated influencer accounts outperform human creators in click-through rates across beauty category", summary: "Synthetic influencer performance data challenging the human authenticity premium is forcing a rethink of influencer marketing ROI frameworks.", source: "news", sourceName: "Digiday", date: "2026-04-28", crossLinks: [] },
  { id: "socai-s7", trendId: "social-ai-content", title: "r/socialmedia: AI tools have made social media management a 2-hour-per-week job, what's left for us to do?", summary: "Creative professional displacement anxiety is a leading indicator of skill market shifts, social media management is being hollowed out by AI execution speed.", source: "reddit", sourceName: "r/socialmedia", date: "2026-05-10", crossLinks: [] },
  { id: "socai-s8", trendId: "social-ai-content", title: "Nestlé deploys AI social content across 200 brands simultaneously with one creative director", summary: "Hyper-scaled AI content production at portfolio brand level demonstrates that AI is compressing marketing organisation headcount across the industry.", source: "news", sourceName: "Campaign", date: "2026-02-08", crossLinks: [] },
  { id: "socai-s9", trendId: "social-ai-content", title: "LinkedIn AI post assistant used for 40% of professional content on platform, authenticity debate erupts", summary: "Professional network AI adoption at this share of content volume is triggering platform-wide questions about what authentic professional communication means in an AI-augmented era.", source: "news", sourceName: "The Information", date: "2026-06-01", crossLinks: [] },

  // social-creator-economy
  { id: "soccr-s1", trendId: "social-creator-economy", title: "YouTube Shorts creator fund reaches $5B, platform competition for creators intensifies", summary: "Platform investment in creator funds signals that creator loyalty is the key distribution lever, the infrastructure of the creator economy is being built by platforms.", source: "news", sourceName: "The Verge", date: "2026-01-28", crossLinks: [] },
  { id: "soccr-s2", trendId: "social-creator-economy", title: "1 in 4 Gen Z identifies as a content creator, the profession has mainstreamed", summary: "Creator identity adoption at this scale signals a permanent shift in career aspiration and media production, content creation is now a conventional professional path.", source: "news", sourceName: "Morning Consult", date: "2026-03-14", crossLinks: [] },
  { id: "soccr-s3", trendId: "social-creator-economy", title: "r/Entrepreneur: my creator brand makes more than my corporate salary, and I have 80k followers", summary: "Creator economy income democratisation stories are fuelling career shifts at scale, the talent pool for traditional marketing roles is shrinking because the alternatives are better.", source: "reddit", sourceName: "r/Entrepreneur", date: "2026-02-25", crossLinks: [] },
  { id: "soccr-s4", trendId: "social-creator-economy", title: "Shopify creator commerce integrations drive $12B in direct creator-to-consumer sales in 2026", summary: "Creator direct commerce infrastructure at this scale signals that creators are becoming retail channels in their own right, brand partnership models are being supplanted by creator brand ownership.", source: "news", sourceName: "Bloomberg", date: "2026-04-18", crossLinks: [] },
  { id: "soccr-s5", trendId: "social-creator-economy", title: "Patreon reports 50M paying subscribers, subscription creator economy reaches mass market", summary: "Paid creator subscription at 50M subscribers confirms that direct creator monetisation has crossed into mass market territory, normalising the idea of paying creators directly.", source: "news", sourceName: "The Verge", date: "2026-03-05", crossLinks: [] },
  { id: "soccr-s6", trendId: "social-creator-economy", title: "TikTok Shop creator affiliate programme pays out $2B to creators, social commerce becomes creator income layer", summary: "TikTok's creator affiliate commerce programme is creating a new income tier for mid-level creators and accelerating the merger of social content and retail conversion.", source: "news", sourceName: "Retail Gazette", date: "2026-05-20", crossLinks: [] },
  { id: "soccr-s7", trendId: "social-creator-economy", title: "r/Twitch: streaming income has become my primary income, brands approach me not the other way around", summary: "Creator-brand power dynamic reversal is documented across community testimonials, creators with loyal audiences are now setting terms, not accepting them.", source: "reddit", sourceName: "r/Twitch", date: "2026-04-02", crossLinks: [] },
  { id: "soccr-s8", trendId: "social-creator-economy", title: "Creator-founded brands outperform heritage CPG brands 3:1 on Gen Z purchase intent", summary: "Creator brand equity is consistently outperforming traditional brand equity with younger consumers, the trust mechanism of creator relationships is more powerful than decades of heritage brand building.", source: "news", sourceName: "Kantar", date: "2026-02-14", crossLinks: [] },
  { id: "soccr-s9", trendId: "social-creator-economy", title: "Live shopping creator events drive higher conversion than Super Bowl ads at 1% of the cost", summary: "Creator live commerce ROI benchmarks against traditional advertising formats are establishing the format as a media channel, not just a social feature.", source: "news", sourceName: "Marketing Week", date: "2026-05-30", crossLinks: [] },

  // education-ai-tutoring
  { id: "edai-s1", trendId: "education-ai-tutoring", title: "Khan Academy's Khanmigo closes learning gaps 40% faster than classroom instruction in pilot", summary: "Outcome data from AI tutoring at scale is creating the evidence base that will drive institutional adoption, the performance advantage is too large to ignore.", source: "news", sourceName: "The Atlantic", date: "2026-02-10", crossLinks: [] },
  { id: "edai-s2", trendId: "education-ai-tutoring", title: "Duolingo AI tutor achieves C1 language learning outcomes in 6 months vs. 18-24 traditionally", summary: "AI personalised language learning has produced its first landmark outcome data, the compression of learning timelines is a fundamental market disruption.", source: "news", sourceName: "TechCrunch", date: "2026-03-18", crossLinks: [] },
  { id: "edai-s3", trendId: "education-ai-tutoring", title: "r/learnprogramming: I learned Python to job-ready standard in 8 weeks with AI tutoring, no bootcamp", summary: "Consumer self-directed AI learning outcomes are generating word-of-mouth that is reshaping the skills training market faster than any institutional shift.", source: "reddit", sourceName: "r/learnprogramming", date: "2026-04-05", crossLinks: [] },
  { id: "edai-s4", trendId: "education-ai-tutoring", title: "Synthesis AI tutor raises $100M at $1.2B valuation, AI education sector passes tipping point", summary: "AI tutoring unicorn valuations signal that investor conviction in personalised AI learning has reached the level that precedes mainstream market category creation.", source: "news", sourceName: "TechCrunch", date: "2026-03-28", crossLinks: [] },
  { id: "edai-s5", trendId: "education-ai-tutoring", title: "Singapore mandates AI tutor access for all K-12 students, first national AI education rollout", summary: "Government-mandated AI tutoring at national scale creates the first large evidence base for AI learning outcome claims and sets an international policy benchmark.", source: "news", sourceName: "MIT Technology Review", date: "2026-04-22", crossLinks: [] },
  { id: "edai-s6", trendId: "education-ai-tutoring", title: "Harvard pilots AI Socratic tutor for law school, replaces 30% of traditional Socratic classroom time", summary: "Elite institutional AI tutoring adoption validates the format's pedagogical credibility and creates permission for lower-tier institutions to follow without prestige risk.", source: "news", sourceName: "Harvard Crimson", date: "2026-02-28", crossLinks: [] },
  { id: "edai-s7", trendId: "education-ai-tutoring", title: "r/homeschooling: AI tutoring has made quality education accessible to rural families who couldn't afford tutors", summary: "AI tutoring access equity stories are politically powerful signals, they create policy support for AI in education by framing it as a democratisation tool.", source: "reddit", sourceName: "r/homeschooling", date: "2026-05-08", crossLinks: [] },
  { id: "edai-s8", trendId: "education-ai-tutoring", title: "Chegg announces pivot to AI tutoring platform after textbook revenue collapses 70%", summary: "Legacy edtech disruption by AI tutoring is accelerating structural market transition, incumbent players are being forced into platform pivots or facing obsolescence.", source: "news", sourceName: "WSJ", date: "2026-01-15", crossLinks: [] },
  { id: "edai-s9", trendId: "education-ai-tutoring", title: "World Bank funds AI tutoring deployment in 40 low-income countries, global educational equity push begins", summary: "International development investment in AI tutoring signals that the technology is being positioned as an educational infrastructure solution for underserved global markets.", source: "news", sourceName: "UNESCO", date: "2026-06-05", crossLinks: [] },

  // education-skills-credentials
  { id: "edskill-s1", trendId: "education-skills-credentials", title: "Google, IBM and 50 major employers remove degree requirements from 80% of job listings", summary: "Employer skill-based hiring at this scale creates immediate demand for alternative credential formats, the degree requirement is dissolving faster than universities can respond.", source: "news", sourceName: "Harvard Business Review", date: "2026-01-20", crossLinks: [] },
  { id: "edskill-s2", trendId: "education-skills-credentials", title: "MIT and Coursera launch blockchain-verified nano-degrees, 6 weeks per credential", summary: "Elite institution entry into micro-credentialing validates the format's legitimacy and creates competitive pressure on traditional degree economics.", source: "news", sourceName: "MIT Technology Review", date: "2026-03-22", crossLinks: [] },
  { id: "edskill-s3", trendId: "education-skills-credentials", title: "r/cscareerquestions: I got my dream job at FAANG with zero degree and 12 micro-credentials", summary: "Individual success stories from skill-stack credentialing are the most powerful peer influence signal, and they're multiplying across every professional community.", source: "reddit", sourceName: "r/cscareerquestions", date: "2026-02-15", crossLinks: [] },
  { id: "edskill-s4", trendId: "education-skills-credentials", title: "LinkedIn Learning skills passport launches, portable verified skills record follows workers across platforms", summary: "Platform-level portable skills credentialing is creating the infrastructure for a skills-based labour market that operates independently of institutional degree systems.", source: "news", sourceName: "LinkedIn Newsroom", date: "2026-03-10", crossLinks: [] },
  { id: "edskill-s5", trendId: "education-skills-credentials", title: "EU Digital Skills Wallet legislation passes, standardised skills credentials across 27 member states", summary: "EU regulatory standardisation of digital skills credentials creates the largest interoperable skills market in the world and sets a global benchmark for credential portability.", source: "news", sourceName: "Politico", date: "2026-04-14", crossLinks: [] },
  { id: "edskill-s6", trendId: "education-skills-credentials", title: "Workday integrates AI skills graph, automatically maps employee skill stacks and identifies micro-credential gaps", summary: "Enterprise HR platform AI skills management is creating bottom-up demand for micro-credentialing from employees who can now see exactly which credentials advance their career trajectory.", source: "news", sourceName: "HR Dive", date: "2026-02-20", crossLinks: [] },
  { id: "edskill-s7", trendId: "education-skills-credentials", title: "r/personalfinance: I spent $800 on micro-credentials and got a $30k salary increase, ROI beats any degree", summary: "Skills credentialing ROI testimonials are quantifying the economic case for alternative education in terms that directly challenge degree investment calculations.", source: "reddit", sourceName: "r/personalfinance", date: "2026-05-18", crossLinks: [] },
  { id: "edskill-s8", trendId: "education-skills-credentials", title: "Deloitte replaces annual performance reviews with continuous AI skill assessment, credentials become ongoing", summary: "Corporate adoption of continuous credential-based assessment signals that the point-in-time qualification model is being replaced by live skills verification in large enterprises.", source: "news", sourceName: "Financial Times", date: "2026-03-30", crossLinks: [] },
  { id: "edskill-s9", trendId: "education-skills-credentials", title: "Arizona State University launches skills income share, students earn credentials, share future salary rather than pay tuition", summary: "Outcome-linked credentialing financing models are restructuring the risk-reward calculation of education in ways that may disrupt traditional university tuition models at scale.", source: "news", sourceName: "Inside Higher Ed", date: "2026-05-04", crossLinks: [] },

  // food-ai-flavour
  { id: "foodfl-s1", trendId: "food-ai-flavour", title: "Givaudan AI flavour system cuts NPD cycle from 18 months to 3 months", summary: "The world's largest flavour company has operationalised AI in product development, compressing timelines that will force the entire industry to follow.", source: "news", sourceName: "Food Navigator", date: "2026-01-28", crossLinks: [] },
  { id: "foodfl-s2", trendId: "food-ai-flavour", title: "Mondelēz AI predicts next viral snack flavour 18 months before it trends", summary: "Predictive AI trained on social media and sales data is enabling FMCG brands to arrive at emerging flavour trends before consumer awareness peaks.", source: "news", sourceName: "Forbes", date: "2026-03-08", crossLinks: [] },
  { id: "foodfl-s3", trendId: "food-ai-flavour", title: "r/snacking: this AI-matched flavour combination should not work but it absolutely does", summary: "Consumer discovery of AI-developed flavour combinations is generating organic trial and social sharing that traditional NPD methods rarely achieve.", source: "reddit", sourceName: "r/snacking", date: "2026-02-18", crossLinks: [] },
  { id: "foodfl-s4", trendId: "food-ai-flavour", title: "IFF launches generative flavour AI that designs novel molecules humans haven't tasted before", summary: "Generative AI moving into molecular flavour design signals that the flavour innovation frontier is no longer limited by the boundaries of existing ingredient knowledge.", source: "news", sourceName: "Food Ingredients First", date: "2026-03-25", crossLinks: [] },
  { id: "foodfl-s5", trendId: "food-ai-flavour", title: "PepsiCo AI flavour lab produces 400% more product concepts per quarter than traditional R&D", summary: "AI R&D throughput multiples at the world's largest snack companies are creating a new innovation velocity that smaller brands without AI capability cannot match.", source: "news", sourceName: "Bloomberg", date: "2026-05-08", crossLinks: [] },
  { id: "foodfl-s6", trendId: "food-ai-flavour", title: "Consumer taste AI startup raises $80M to personalise flavour profiles based on individual genetic markers", summary: "Genetic taste preference personalisation at scale represents the convergence of biotech and food AI, products tuned to individual biology rather than demographic averages.", source: "news", sourceName: "TechCrunch", date: "2026-04-16", crossLinks: [] },
  { id: "foodfl-s7", trendId: "food-ai-flavour", title: "r/food: I tried three products made by AI flavour systems, two were genuinely better than anything I've had", summary: "Consumer blind taste preference for AI-developed flavours over human-formulated products is the most powerful market signal for the flavour AI category.", source: "reddit", sourceName: "r/food", date: "2026-05-22", crossLinks: [] },
  { id: "foodfl-s8", trendId: "food-ai-flavour", title: "Nestlé AI flavour platform analyses 2M social media mentions daily to track emerging taste trends in real time", summary: "Real-time social trend-to-flavour pipeline is collapsing the lag between emerging taste culture and product development response to near-zero.", source: "news", sourceName: "Food Navigator", date: "2026-02-28", crossLinks: [] },
  { id: "foodfl-s9", trendId: "food-ai-flavour", title: "AI-designed regional flavour adaptations increase category sales 35% in new markets without human formulation work", summary: "AI-driven localisation of flavour profiles at zero marginal formulation cost is making global flavour personalisation economically viable for the first time.", source: "news", sourceName: "Mintel", date: "2026-04-30", crossLinks: [] },

  // fashion-resale-first
  { id: "fres-s1", trendId: "fashion-resale-first", title: "Vinted hits 75M users, overtakes Zalando in monthly active users across Europe", summary: "Resale has crossed into primary market territory: Vinted is now a larger shopping destination than the continent's leading new-retail fashion platform by active user count.", source: "news", sourceName: "Financial Times", date: "2026-02-14", crossLinks: [] },
  { id: "fres-s2", trendId: "fashion-resale-first", title: "r/frugalfemalefashion: I haven't bought anything new in 14 months and my wardrobe is better than ever", summary: "Community threads where secondhand-only consumers report superior wardrobes are normalising resale as a quality-first choice rather than a budget compromise.", source: "reddit", sourceName: "r/frugalfemalefashion", date: "2026-03-05", crossLinks: [] },
  { id: "fres-s3", trendId: "fashion-resale-first", title: "Levi's SecondHand platform crosses $10M in sales in year one", summary: "Brand-owned resale is proving financially material, not just reputationally useful: Levi's direct resale revenue is growing faster than any new product category they launched in the same period.", source: "news", sourceName: "Business of Fashion", date: "2026-01-28", crossLinks: [] },
  { id: "fres-s4", trendId: "fashion-resale-first", title: "ThredUp 2025 Resale Report: secondhand to reach $350B globally by 2027", summary: "The trajectory of secondhand market growth is now large enough that traditional retail investors are repricing new-goods-only brands as structurally exposed.", source: "news", sourceName: "ThredUp", date: "2026-04-10", crossLinks: [] },
  { id: "fres-s5", trendId: "fashion-resale-first", title: "r/malefashionadvice: Depop is the only place I find actually interesting pieces now", summary: "Resale platforms are winning on curation and discovery, not just price: the secondhand market is becoming the primary place younger consumers find pieces with cultural distinctiveness.", source: "reddit", sourceName: "r/malefashionadvice", date: "2026-02-20", crossLinks: [] },
  { id: "fres-s6", trendId: "fashion-resale-first", title: "LVMH launches Nona Source internal deadstock marketplace, opens to public", summary: "Luxury's move into deadstock and resale signals that the stigma of secondhand has fully dissolved even at the top of the market.", source: "news", sourceName: "WWD", date: "2026-03-18", crossLinks: [] },

  // fashion-micro-trend-fatigue
  { id: "fmicro-s1", trendId: "fashion-micro-trend-fatigue", title: "TikTok fashion micro-trends peaking and dying in under 2 weeks, analysis shows", summary: "Data tracking the lifecycle of TikTok-driven aesthetics shows the saturation point has dropped from months to weeks, making trend-reactive supply chains structurally unviable.", source: "news", sourceName: "Vogue Business", date: "2026-02-08", crossLinks: [] },
  { id: "fmicro-s2", trendId: "fashion-micro-trend-fatigue", title: "r/femalefashionadvice: I'm so tired of every look being a named aesthetic, I just want to dress for myself", summary: "Community pushback against aesthetic categorisation is growing: the consumer who found TikTok fashion liberating is now finding it prescriptive.", source: "reddit", sourceName: "r/femalefashionadvice", date: "2026-03-22", crossLinks: [] },
  { id: "fmicro-s3", trendId: "fashion-micro-trend-fatigue", title: "Bottega Veneta's no-social-media strategy proving commercially durable 5 years in", summary: "The brand that opted out of trend participation years ago is outperforming trend-chasing luxury peers on both revenue growth and brand equity metrics.", source: "news", sourceName: "Business of Fashion", date: "2026-01-15", crossLinks: [] },
  { id: "fmicro-s4", trendId: "fashion-micro-trend-fatigue", title: "Fast fashion overproduction losses hit $20B as micro-trend chasing misfires", summary: "Trend-reactive overproduction is generating massive inventory write-offs as the lifecycle of micro-trends collapses faster than supply chains can respond.", source: "news", sourceName: "Reuters", date: "2026-04-02", crossLinks: [] },
  { id: "fmicro-s5", trendId: "fashion-micro-trend-fatigue", title: "r/minimalism: buying one piece instead of five trend items. my wardrobe finally makes sense", summary: "Anti-trend minimalism is growing as a direct response to micro-trend exhaustion, with consumers actively choosing coherence over trend participation.", source: "reddit", sourceName: "r/minimalism", date: "2026-05-10", crossLinks: [] },
  { id: "fmicro-s6", trendId: "fashion-micro-trend-fatigue", title: "Uniqlo revenue grows 18% as it positions against trend culture with LifeWear campaign", summary: "The brand most explicitly anti-trend is outperforming fashion-cycle brands during a period of micro-trend fatigue, confirming the commercial case for timelessness.", source: "news", sourceName: "Nikkei Asia", date: "2026-03-30", crossLinks: [] },

  // beauty-skin-diagnostics
  { id: "bskin-s1", trendId: "beauty-skin-diagnostics", title: "Neutrogena Skin360 AI scanner reaches 10M users, drives 40% uplift in recommendation conversion", summary: "At-home skin diagnostics are proving their commercial case: the uplift in recommendation conversion proves the diagnostic step materially improves purchase intent and precision.", source: "news", sourceName: "WWD", date: "2026-02-20", crossLinks: [] },
  { id: "bskin-s2", trendId: "beauty-skin-diagnostics", title: "r/SkincareAddiction: tried the AI skin scanner at Sephora and it actually caught things I'd missed for years", summary: "Consumer discovery of skin conditions through diagnostic tools is driving new product category adoption that wouldn't have happened through standard browsing or self-diagnosis.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2026-03-14", crossLinks: [] },
  { id: "bskin-s3", trendId: "beauty-skin-diagnostics", title: "L'Oreal acquires skin AI startup for $380M to power personalized formulation at scale", summary: "Tier-one beauty acquisition of AI diagnostic capability signals that personalized skin analysis is becoming infrastructure, not a feature.", source: "news", sourceName: "TechCrunch", date: "2026-01-22", crossLinks: [] },
  { id: "bskin-s4", trendId: "beauty-skin-diagnostics", title: "Proven Skincare raises $50M Series B on 2M personalized formula subscriptions", summary: "Subscription personalized skincare built on diagnostic data is proving the retention model: customers who built a formula based on their own skin data churn at a fraction of the rate of standard product subscribers.", source: "news", sourceName: "Forbes", date: "2026-04-08", crossLinks: [] },
  { id: "bskin-s5", trendId: "beauty-skin-diagnostics", title: "r/beauty: my dermatologist literally uses the same AI skin analysis tool as the app I downloaded for free", summary: "When consumer diagnostic tools reach clinical parity, the case for a professional consultation as the only credible skincare advice source collapses.", source: "reddit", sourceName: "r/beauty", date: "2026-05-02", crossLinks: [] },
  { id: "bskin-s6", trendId: "beauty-skin-diagnostics", title: "Sephora rolls out AI skin diagnostic stations in 300 stores globally", summary: "Brick-and-mortar beauty retail is adopting AI diagnostics as a conversion driver, transforming the store visit from browsing to consultation.", source: "news", sourceName: "Retail Dive", date: "2026-03-05", crossLinks: [] },

  // beauty-biotech-actives
  { id: "bbio-s1", trendId: "beauty-biotech-actives", title: "Geltor raises $91M, lab-grown collagen enters major beauty supply chains", summary: "Institutional capital at this scale in synthetic collagen production confirms that biotech actives have crossed from R&D curiosity to commercial supply chain reality.", source: "news", sourceName: "TechCrunch", date: "2026-06-12", crossLinks: [] },
  { id: "bbio-s2", trendId: "beauty-biotech-actives", title: "r/SkincareAddiction: tried a biofermented hyaluronic acid serum and the texture difference is real", summary: "Consumer experiential feedback distinguishing biofermented actives from synthetic alternatives is building category knowledge from the bottom up.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2026-05-28", crossLinks: [] },
  { id: "bbio-s3", trendId: "beauty-biotech-actives", title: "Bolt Threads Microsilk licensed to luxury fashion and skincare brands, synthetic protein goes premium", summary: "Luxury brand adoption of lab-grown silk protein confirms the biotech active has passed the quality and exclusivity bar required for luxury positioning.", source: "news", sourceName: "Business of Fashion", date: "2026-05-10", crossLinks: [] },
  { id: "bbio-s4", trendId: "beauty-biotech-actives", title: "Evolved By Nature clinical trials show synthetic silk actives outperform natural collagen in barrier repair", summary: "Clinical data showing biotech actives outperforming natural equivalents is the category-defining evidence that will accelerate mainstream adoption.", source: "news", sourceName: "Wired", date: "2026-04-18", crossLinks: [] },
  { id: "bbio-s5", trendId: "beauty-biotech-actives", title: "BASF precision fermentation actives division launches, chemical industry bets on biotech beauty", summary: "The world's largest chemical company committing to precision fermentation skincare actives signals that the technology is mature enough for industrial-scale investment.", source: "news", sourceName: "Forbes", date: "2026-03-05", crossLinks: [] },
  { id: "bbio-s6", trendId: "beauty-biotech-actives", title: "r/BeautyGuruChatter: the clean beauty conversation has moved. it's not about natural anymore, it's about biotech", summary: "Consumer community discourse shifting the beauty quality frame from 'natural' to 'biotech' signals a foundational category repositioning.", source: "reddit", sourceName: "r/BeautyGuruChatter", date: "2026-02-22", crossLinks: [] },

  // dating-ai-assisted
  { id: "dai-s1", trendId: "dating-ai-assisted", title: "Hinge launches AI dating coach Rose, 2M users in first month", summary: "Hinge's AI coach adoption rate signals that the emotional labor of dating app navigation has become a real pain point that consumers will outsource to AI.", source: "news", sourceName: "TechCrunch", date: "2026-02-18", crossLinks: [] },
  { id: "dai-s2", trendId: "dating-ai-assisted", title: "r/dating_advice: I used AI to rewrite my profile and my match rate tripled", summary: "Real consumer results from AI-assisted profile optimization are creating grassroots proof-of-concept that's building the behaviour faster than any app marketing could.", source: "reddit", sourceName: "r/dating_advice", date: "2026-03-10", crossLinks: [] },
  { id: "dai-s3", trendId: "dating-ai-assisted", title: "Bumble AI compatibility model reduces ghosting rate by 30% in pilot", summary: "AI matching that goes beyond surface preference signals is proving its value in the metric dating apps are most embarrassed by: the silence after a match.", source: "news", sourceName: "Bloomberg", date: "2026-01-25", crossLinks: [] },
  { id: "dai-s4", trendId: "dating-ai-assisted", title: "Third-party AI dating assistant apps hit 5M downloads in 2025", summary: "The market for AI that helps people perform better on dating apps has grown large enough to support a dedicated app category outside the platforms themselves.", source: "news", sourceName: "The Verge", date: "2026-04-05", crossLinks: [] },
  { id: "dai-s5", trendId: "dating-ai-assisted", title: "r/Tinder: is anyone else using ChatGPT for their opening lines? feels weird but it works", summary: "Community ambivalence about AI-assisted dating reveals the authenticity tension at the heart of the trend: it works, but people aren't sure how they feel about that.", source: "reddit", sourceName: "r/Tinder", date: "2026-05-01", crossLinks: [] },
  { id: "dai-s6", trendId: "dating-ai-assisted", title: "Match Group acquires AI conversation coaching startup for $200M", summary: "Platform-level acquisition of AI coaching capability signals that the major dating apps are treating AI assistance as core infrastructure, not a differentiating feature.", source: "news", sourceName: "Reuters", date: "2026-03-20", crossLinks: [] },

  // dating-slow
  { id: "dslow-s1", trendId: "dating-slow", title: "Thursday app reaches 1M users in London, New York, and Paris with one-day matching model", summary: "Artificial scarcity in dating app availability is proving to be a feature, not a bug: constrained matching windows are increasing intentionality and in-person meeting rates.", source: "news", sourceName: "The Guardian", date: "2026-02-14", crossLinks: [] },
  { id: "dslow-s2", trendId: "dating-slow", title: "r/dating: I deleted all my apps and started going to real events. I've had more genuine connections in 3 months than in 3 years of swiping", summary: "Consumer exodus from swipe-based dating toward IRL-first approaches is gathering pace as the experiential gap between app dating and in-person meeting becomes a recognized problem.", source: "reddit", sourceName: "r/dating", date: "2026-03-08", crossLinks: [] },
  { id: "dslow-s3", trendId: "dating-slow", title: "IRL dating events operator Time Out Experiences reports 300% growth in singles events bookings", summary: "Institutional growth in the IRL dating event market confirms the slow dating movement has commercial scale beyond niche apps.", source: "news", sourceName: "Time Out", date: "2026-04-20", crossLinks: [] },
  { id: "dslow-s4", trendId: "dating-slow", title: "Bumble study: 78% of users say they want fewer, higher-quality matches over more matches", summary: "Platform-level research confirming that the stated preference of the majority of dating app users is for less volume and more quality represents a strategic challenge to the existing engagement model.", source: "news", sourceName: "Bumble", date: "2026-01-18", crossLinks: [] },

  // nightlife-ai-discovery
  { id: "naid-s1", trendId: "nightlife-ai-discovery", title: "Dice FM reaches 10M monthly active users, algorithmic event discovery mainstream for Gen Z", summary: "An event discovery platform at 10M MAU has the scale to meaningfully redirect nightlife attention — the algorithm is now more influential than word of mouth for a significant cohort.", source: "news", sourceName: "TechCrunch", date: "2026-06-14", crossLinks: [] },
  { id: "naid-s2", trendId: "nightlife-ai-discovery", title: "r/london: Dice recommended me an event I never would have found. It's the Spotify algorithm for going out", summary: "Consumer framing of event discovery platforms in terms of Spotify confirms the category analogy is landing — algorithmic curation is the established frame for this type of recommendation.", source: "reddit", sourceName: "r/london", date: "2026-05-30", crossLinks: [] },
  { id: "naid-s3", trendId: "nightlife-ai-discovery", title: "Resident Advisor ML recommendation engine increases ticket conversion 60% in six-month test", summary: "A 60% conversion lift from algorithmic recommendations proves that AI event matching is materially better at driving purchase than non-personalised discovery.", source: "news", sourceName: "Wired", date: "2026-05-12", crossLinks: [] },
  { id: "naid-s4", trendId: "nightlife-ai-discovery", title: "Smart venue startup Venuetize raises $25M for real-time crowd analytics and adaptive experience platform", summary: "Institutional investment in real-time crowd data infrastructure signals the market believes responsive venue experience is a viable commercial product.", source: "news", sourceName: "VentureBeat", date: "2026-04-08", crossLinks: [] },
  { id: "naid-s5", trendId: "nightlife-ai-discovery", title: "r/festivals: the NFC wristband at this festival knew my drink order. going out is becoming personalised", summary: "Consumer awareness of personalisation infrastructure at live events signals that the quantified night out is already being experienced by early adopters.", source: "reddit", sourceName: "r/festivals", date: "2026-03-20", crossLinks: [] },
  { id: "naid-s6", trendId: "nightlife-ai-discovery", title: "Intellitix processes 50M NFC event check-ins globally, cashless biometric nightlife infrastructure normalised", summary: "50M NFC check-ins confirms that the physical infrastructure of quantified nightlife has already been built and normalised — data collection at events is now default.", source: "news", sourceName: "Forbes", date: "2026-02-15", crossLinks: [] },

  // nightlife-immersive
  { id: "nimm-s1", trendId: "nightlife-immersive", title: "Meow Wolf reports $200M revenue in 2025, announces 4 new permanent venues", summary: "Meow Wolf's revenue scale proves immersive entertainment is a financially serious category, not just a cultural moment: permanent venue economics are working.", source: "news", sourceName: "Bloomberg", date: "2026-02-10", crossLinks: [] },
  { id: "nimm-s2", trendId: "nightlife-immersive", title: "r/london: Frameless is the best night out I've had in years and I didn't have a single drink", summary: "Consumer preference for immersive experiences over traditional nightlife is demonstrated most powerfully when the comparison is made explicit by the consumer themselves.", source: "reddit", sourceName: "r/london", date: "2026-03-28", crossLinks: [] },
  { id: "nimm-s3", trendId: "nightlife-immersive", title: "Punchdrunk's Sleep No More New York extension runs into 15th consecutive year, premium tickets at $250+", summary: "A 15-year run at full occupancy and premium pricing proves the immersive experience model has retention and word-of-mouth economics that traditional entertainment cannot match.", source: "news", sourceName: "The New York Times", date: "2026-04-18", crossLinks: [] },
  { id: "nimm-s4", trendId: "nightlife-immersive", title: "Club Shelter and fabric report 40% revenue from events, not door tickets", summary: "Traditional nightlife venues are diversifying into experience and event formats because the economics of experience programming outperform pure door-ticket models.", source: "news", sourceName: "DJ Mag", date: "2026-01-15", crossLinks: [] },
  { id: "nimm-s5", trendId: "nightlife-immersive", title: "r/ifyoulikeblank: went to teamLab last week and it destroyed every other night out I've had this year in terms of actual feeling", summary: "Experiential venues are winning on the metric that matters most: the emotional intensity of the memory. Consumer language around immersive experiences ('feeling', 'destroyed') reveals the depth of impact.", source: "reddit", sourceName: "r/ifyoulikeblank", date: "2026-05-12", crossLinks: [] },
  { id: "nimm-s6", trendId: "nightlife-immersive", title: "Amazon invests $300M in immersive entertainment company, signals category mainstream moment", summary: "Platform-scale investment in immersive entertainment from a company with full-stack distribution capability signals the category is entering its mainstream infrastructure phase.", source: "news", sourceName: "Variety", date: "2026-03-08", crossLinks: [] },

  // coffee-precision-tech
  { id: "cprec-s1", trendId: "coffee-precision-tech", title: "Decent Espresso backordered 6 months as connected home espresso machines hit mainstream demand", summary: "A hardware product backordered for half a year signals genuine mass demand rather than niche interest — the connected home espresso category is at its inflection point.", source: "news", sourceName: "Wired", date: "2026-06-10", crossLinks: [] },
  { id: "cprec-s2", trendId: "coffee-precision-tech", title: "r/espresso: I've logged every extraction for 8 months on Acaia. The improvement curve is genuinely remarkable", summary: "Consumer testimony about measurable skill improvement from data-logging espresso preparation confirms that the precision coffee stack produces real outcomes, not just ritual.", source: "reddit", sourceName: "r/espresso", date: "2026-05-28", crossLinks: [] },
  { id: "cprec-s3", trendId: "coffee-precision-tech", title: "Fellow raises $30M Series C to build connected kitchen hardware platform beyond coffee", summary: "A coffee hardware brand raising growth capital to expand into connected kitchen signals that precision coffee is the beachhead for a broader home sensory technology category.", source: "news", sourceName: "TechCrunch", date: "2026-05-05", crossLinks: [] },
  { id: "cprec-s4", trendId: "coffee-precision-tech", title: "Bottomless smart coffee canister reaches 100K subscribers, IoT replenishment for specialty coffee scales", summary: "100K paid subscribers for an IoT-connected coffee subscription proves that the connected kitchen consumer will pay a premium for data-driven replenishment over manual ordering.", source: "news", sourceName: "Forbes", date: "2026-04-02", crossLinks: [] },
  { id: "cprec-s5", trendId: "coffee-precision-tech", title: "r/Coffee: the precision brewing subreddit has more subscribers than the general coffee subreddit now", summary: "Community migration toward precision and data-driven coffee content signals that the enthusiast end of the market has shifted from taste preference to extraction science.", source: "reddit", sourceName: "r/Coffee", date: "2026-03-18", crossLinks: [] },
  { id: "cprec-s6", trendId: "coffee-precision-tech", title: "Breville Oracle AI espresso machine launches with automated extraction optimisation, smart coffee goes mass-market", summary: "The world's best-selling premium espresso brand adding AI extraction guidance confirms the technology has graduated from specialist hardware to mainstream appliance.", source: "news", sourceName: "The Verge", date: "2026-02-10", crossLinks: [] },

  // coffee-biotech
  { id: "cbio-s1", trendId: "coffee-biotech", title: "Atomo Coffee raises $40M, beanless molecular coffee enters specialty retail", summary: "VC investment at this scale in a beanless coffee company confirms that institutional capital believes lab-grown coffee is a commercially viable product, not just an R&D project.", source: "news", sourceName: "TechCrunch", date: "2026-06-08", crossLinks: [] },
  { id: "cbio-s2", trendId: "coffee-biotech", title: "r/Coffee: tasted Atomo at a tasting event. genuinely could not tell the difference from a medium roast Ethiopian", summary: "Consumer blind taste test endorsement of beanless coffee is the category-defining proof point — if the consumer cannot detect a difference, the product has cleared its highest bar.", source: "reddit", sourceName: "r/Coffee", date: "2026-05-20", crossLinks: [] },
  { id: "cbio-s3", trendId: "coffee-biotech", title: "VTT Technical Research bioreactor coffee cells demonstrated at industrial scale, production feasibility confirmed", summary: "Lab-scale demonstration at industrial volume confirms the production pathway exists, not just the concept — the question is now cost, not possibility.", source: "news", sourceName: "Reuters", date: "2026-04-28", crossLinks: [] },
  { id: "cbio-s4", trendId: "coffee-biotech", title: "World Coffee Research report: 50% of arabica farmland climate-unsuitable by 2050, industry urgency accelerates", summary: "Industry-funded research confirming existential climate risk to the coffee supply creates a commercial imperative for biotech alternatives that no amount of marketing could manufacture.", source: "news", sourceName: "The Guardian", date: "2026-04-05", crossLinks: [] },
  { id: "cbio-s5", trendId: "coffee-biotech", title: "Compound Foods $10M Series A for biofermented coffee, precision fermentation enters beverages", summary: "A second well-funded biotech coffee startup signals the category has multiple credible commercial approaches, not just a single moonshot.", source: "news", sourceName: "VentureBeat", date: "2026-03-12", crossLinks: [] },
  { id: "cbio-s6", trendId: "coffee-biotech", title: "r/sustainability: bought a bag of lab-grown coffee because I couldn't justify the supply chain of the alternative anymore", summary: "Consumer purchasing decisions explicitly framed around supply chain ethics for coffee signals that the sustainability purchase driver has reached the beverage category.", source: "reddit", sourceName: "r/sustainability", date: "2026-02-08", crossLinks: [] },

  // sport-recovery-culture
  { id: "srec-s1", trendId: "sport-recovery-culture", title: "Whoop 4.0 surpasses 1M subscribers, recovery wearable market reaches mainstream", summary: "A wearable with no screen, just biometric coaching, sustaining 1M paid subscribers confirms that recovery data has genuine daily utility beyond fitness enthusiasts.", source: "news", sourceName: "Forbes", date: "2026-06-18", crossLinks: [] },
  { id: "srec-s2", trendId: "sport-recovery-culture", title: "Theragun becomes standard hotel gym equipment across 500 Marriott properties", summary: "When a recovery device becomes hospitality infrastructure rather than personal equipment, the technology has fully crossed into mainstream expectation.", source: "news", sourceName: "Skift", date: "2026-06-10", crossLinks: [] },
  { id: "srec-s3", trendId: "sport-recovery-culture", title: "r/fitness: I spend as much on recovery as training now and my performance finally improved", summary: "Consumer experimentation with recovery-first protocols producing self-reported performance gains is generating organic conversion in fitness communities at scale.", source: "reddit", sourceName: "r/fitness", date: "2026-05-28", crossLinks: [] },
  { id: "srec-s4", trendId: "sport-recovery-culture", title: "Oura Ring partners with 8 national Olympic committees for athlete monitoring", summary: "Olympic-level adoption of consumer recovery wearables creates the elite legitimacy signal that drives mainstream sports adoption.", source: "news", sourceName: "Sports Business Journal", date: "2026-05-14", crossLinks: [] },
  { id: "srec-s5", trendId: "sport-recovery-culture", title: "Cold plunge hardware market grows 180% in 2025, home recovery infrastructure goes premium", summary: "Consumer investment in home recovery equipment at this growth rate signals the category has moved beyond early adopters into mainstream premium fitness consumers.", source: "news", sourceName: "Bloomberg", date: "2026-04-08", crossLinks: [] },
  { id: "srec-s6", trendId: "sport-recovery-culture", title: "r/running: I stopped training harder and started recovering better. First marathon PB in 3 years", summary: "Recovery-first performance testimonials from mainstream athletes confirm the category message is converting beyond biohackers into general fitness population.", source: "reddit", sourceName: "r/running", date: "2026-03-20", crossLinks: [] },

  // sport-fan-economy
  { id: "sfan-s1", trendId: "sport-fan-economy", title: "LeBron James' SpringHill Company reaches $750M valuation, athlete-to-brand model scales", summary: "A basketball player building a media and consumer brand company worth nearly a billion dollars confirms that athlete-as-business-platform is a repeatable model, not a one-off.", source: "news", sourceName: "Variety", date: "2026-06-16", crossLinks: [] },
  { id: "sfan-s2", trendId: "sport-fan-economy", title: "F1 Drive to Survive Season 6 brings 40M new fans to the sport, content-led audience expansion proven", summary: "A documentary series creating 40M new sport followers represents the definitive case study for content-led fan development — the product is the content, the sport is the subscription.", source: "news", sourceName: "The Guardian", date: "2026-06-08", crossLinks: [] },
  { id: "sfan-s3", trendId: "sport-fan-economy", title: "r/soccer: I follow the player not the club now. Club loyalty is dead for my generation", summary: "Fan loyalty migrating from institutions to individuals signals that athlete-direct relationships are restructuring the sports media economy from the bottom up.", source: "reddit", sourceName: "r/soccer", date: "2026-05-22", crossLinks: [] },
  { id: "sfan-s4", trendId: "sport-fan-economy", title: "Fanatics grows to $31B valuation by owning licensed merchandise, trading cards, and sports gambling simultaneously", summary: "Vertical integration across the fan economy — collecting, wearing, and betting on sport — produces a valuation that proves the thesis: own the fan relationship across all formats.", source: "news", sourceName: "Bloomberg", date: "2026-05-05", crossLinks: [] },
  { id: "sfan-s5", trendId: "sport-fan-economy", title: "NIL deals for college athletes reach $1.7B in 2025, every college player is a micro-brand", summary: "Name, image, and likeness commercialisation at every level of sport confirms that athlete-as-brand is structural infrastructure, not just an elite privilege.", source: "news", sourceName: "ESPN", date: "2026-03-18", crossLinks: [] },
  { id: "sfan-s6", trendId: "sport-fan-economy", title: "Socios fan token holders get voting rights on club decisions, financial fandom becomes governance", summary: "When fan token holders participate in club decisions, fandom transitions from passive identity to active stakeholding — a categorically different relationship.", source: "news", sourceName: "CoinDesk", date: "2026-02-14", crossLinks: [] },

  // pets-genomics
  { id: "pgen-s1", trendId: "pets-genomics", title: "Embark surpasses 1M dogs tested, canine genomics database enables population-level health research", summary: "A million-dog genomic database is not just a consumer product — it's scientific infrastructure that enables the kind of breed health research that was previously impossible.", source: "news", sourceName: "TechCrunch", date: "2026-06-16", crossLinks: [] },
  { id: "pgen-s2", trendId: "pets-genomics", title: "r/dogs: dog DNA test revealed a disease predisposition we caught before symptoms — changed our vet relationship completely", summary: "Consumer testimony about preventive clinical outcomes from pet DNA testing is the most powerful adoption driver — lived proof that the product has real medical value.", source: "reddit", sourceName: "r/dogs", date: "2026-06-05", crossLinks: [] },
  { id: "pgen-s3", trendId: "pets-genomics", title: "Wisdom Panel partners with Mars Petcare to integrate DNA health data into personalised pet nutrition line", summary: "The world's largest pet care company integrating genomic data into its nutrition products confirms that personalised pet nutrition is the direction the entire category is moving.", source: "news", sourceName: "Bloomberg", date: "2026-05-18", crossLinks: [] },
  { id: "pgen-s4", trendId: "pets-genomics", title: "Vetology AI reads pet X-rays and ultrasounds with specialist-level accuracy, veterinary AI diagnostic scales", summary: "Clinical accuracy from AI diagnostic imaging for pets confirms the technology is approaching the point where it can meaningfully augment or substitute for veterinary specialist access.", source: "news", sourceName: "VentureBeat", date: "2026-04-20", crossLinks: [] },
  { id: "pgen-s5", trendId: "pets-genomics", title: "r/AskVet: my vet now asks if I have my dog's Embark results before recommending preventive screening", summary: "Veterinary integration of consumer-generated DNA data into clinical practice signals that the genomics tool has achieved institutional medical credibility, not just consumer appeal.", source: "reddit", sourceName: "r/AskVet", date: "2026-03-28", crossLinks: [] },
  { id: "pgen-s6", trendId: "pets-genomics", title: "Anivive mRNA cancer vaccine for dogs enters Phase 2 trials, precision medicine pipeline reaches veterinary medicine", summary: "mRNA vaccine technology being applied to canine cancer signals that the precision medicine revolution is entering veterinary medicine on the same timescale as human medicine.", source: "news", sourceName: "Forbes", date: "2026-02-18", crossLinks: [] },

  // pets-tech
  { id: "ptech-s1", trendId: "pets-tech", title: "Whistle GPS + health collar reaches 1M units, real-time pet location tracking becomes expected", summary: "A million pet owners paying a monthly subscription for real-time location and health data confirms that quantified-pet behaviour has crossed into mainstream expectation.", source: "news", sourceName: "TechCrunch", date: "2026-06-14", crossLinks: [] },
  { id: "ptech-s2", trendId: "pets-tech", title: "r/Dogadvice: I check my dog's sleep score every morning. He sleeps better than I do", summary: "Consumer use of pet health data in the same daily ritual as personal health monitoring confirms that the quantified-pet and quantified-self markets are converging.", source: "reddit", sourceName: "r/Dogadvice", date: "2026-06-05", crossLinks: [] },
  { id: "ptech-s3", trendId: "pets-tech", title: "Petcube treat-dispenser camera sells out three consecutive product launches, remote pet interaction normalised", summary: "Repeat sell-out of hardware for remote pet interaction confirms that distributed pet care — monitoring and engaging pets from anywhere — is a genuine use case at commercial scale.", source: "news", sourceName: "The Verge", date: "2026-05-18", crossLinks: [] },
  { id: "ptech-s4", trendId: "pets-tech", title: "Fi dog collar raises $30M Series C, subscription pet wearable achieves retention rates rivalling human health apps", summary: "Subscription retention rates for pet wearables approaching those of human health wearables confirms that the emotional driver (knowing your pet's health) is as strong as the personal health driver.", source: "news", sourceName: "Business Insider", date: "2026-04-22", crossLinks: [] },
  { id: "ptech-s5", trendId: "pets-tech", title: "PetPace heart rate collar sends 50,000 vet alerts in its first year, clinical-grade monitoring scales", summary: "A pet monitoring device generating 50K medically actionable alerts in year one proves the clinical utility case that justifies premium hardware pricing.", source: "news", sourceName: "VentureBeat", date: "2026-03-08", crossLinks: [] },

  // parenting-screentime
  { id: "pscr-s1", trendId: "parenting-screentime", title: "Jonathan Haidt's 'The Anxious Generation' becomes #1 bestseller, parental screen panic reaches mainstream", summary: "A social psychology book about smartphone harm to children reaching #1 confirms that screen anxiety has moved from parenting forums to the cultural mainstream.", source: "news", sourceName: "New York Times", date: "2026-06-16", crossLinks: [] },
  { id: "pscr-s2", trendId: "parenting-screentime", title: "France bans smartphones in all primary and middle schools, Europe's screen policy hardens", summary: "National legislation restricting smartphone access to minors signals that the regulatory environment is moving decisively in the direction parental anxiety has been pointing.", source: "news", sourceName: "Le Monde", date: "2026-06-08", crossLinks: [] },
  { id: "pscr-s3", trendId: "parenting-screentime", title: "r/Parenting: we did a screen-free month and our family is unrecognisable. Not going back to the old way", summary: "Parental testimony about behavioural transformation from screen reduction is the most effective marketing for screen-free products — and it's generating itself in the millions.", source: "reddit", sourceName: "r/Parenting", date: "2026-05-25", crossLinks: [] },
  { id: "pscr-s4", trendId: "parenting-screentime", title: "Yoto audio player for kids reaches 1M units, screen-free entertainment achieves mainstream scale", summary: "Screen-free children's entertainment at 1M units confirms that parent demand for high-quality offline alternatives is translating to purchase at meaningful volume.", source: "news", sourceName: "TechCrunch", date: "2026-05-10", crossLinks: [] },
  { id: "pscr-s5", trendId: "parenting-screentime", title: "US Surgeon General calls for warning labels on social media, government intervention accelerates", summary: "Surgeon General action on social media harm creates legislative momentum that will structurally reshape both the tech and parenting product markets.", source: "news", sourceName: "Washington Post", date: "2026-04-18", crossLinks: [] },
  { id: "pscr-s6", trendId: "parenting-screentime", title: "Bark app monitors 5M children's social media for safety signals, parental surveillance market scales", summary: "5M families paying for AI monitoring of their children's digital behaviour confirms that parental screen anxiety is translating to sustained commercial spend, not just cultural conversation.", source: "news", sourceName: "Forbes", date: "2026-03-12", crossLinks: [] },

  // parenting-village-model
  { id: "pvil-s1", trendId: "parenting-village-model", title: "Peanut app reaches 2M users, parent social network proves loneliness is a solvable market", summary: "A social network specifically for mothers reaching 2M users confirms that parental isolation is not just cultural noise — it's a commercial opportunity that connection infrastructure can address.", source: "news", sourceName: "TechCrunch", date: "2026-06-12", crossLinks: [] },
  { id: "pvil-s2", trendId: "parenting-village-model", title: "r/Parenting: I found my mum tribe through a Facebook group and we now share childcare 3 days a week", summary: "Informal co-parenting networks forming through social media and evolving into genuine care-sharing arrangements signal demand for formal coordination infrastructure.", source: "reddit", sourceName: "r/Parenting", date: "2026-06-03", crossLinks: [] },
  { id: "pvil-s3", trendId: "parenting-village-model", title: "Childcare costs in US cities hit $3,500/month on average, forcing creative cooperative models", summary: "When childcare exceeds many households' rent, parents are economically compelled to find cooperative alternatives — the market need is not aspirational, it's structural.", source: "news", sourceName: "New York Times", date: "2026-05-20", crossLinks: [] },
  { id: "pvil-s4", trendId: "parenting-village-model", title: "Winnie childcare platform maps 500K providers and parent reviews, childcare discovery scales", summary: "A childcare marketplace reaching half a million listings with parent reviews confirms the digital infrastructure layer is being built for what was previously an analogue market.", source: "news", sourceName: "VentureBeat", date: "2026-04-15", crossLinks: [] },
  { id: "pvil-s5", trendId: "parenting-village-model", title: "Cohousing communities with shared childcare amenities sell out in 6 minutes across 12 US cities", summary: "Demand outstripping supply for cohousing with built-in childcare infrastructure confirms that parents are willing to restructure where they live around care community.", source: "news", sourceName: "Curbed", date: "2026-02-28", crossLinks: [] },

  // kids-creative-tech
  { id: "kcre-s1", trendId: "kids-creative-tech", title: "Roblox crosses 80M daily active users, majority now create content rather than just play", summary: "The world's largest kids' platform crossing from consumption to creation majority confirms that the creative economy for children has genuine scale.", source: "news", sourceName: "TechCrunch", date: "2026-06-18", crossLinks: [] },
  { id: "kcre-s2", trendId: "kids-creative-tech", title: "LEGO Spike robotics kits become the default STEM tool in 50,000 schools globally", summary: "Physical-digital creative learning at 50K school scale confirms that hands-on tech education has crossed from enrichment activity to curriculum infrastructure.", source: "news", sourceName: "EdSurge", date: "2026-06-11", crossLinks: [] },
  { id: "kcre-s3", trendId: "kids-creative-tech", title: "r/Parenting: my 9-year-old built a working app on Scratch and I genuinely can't code myself", summary: "Consumer testimony about child creative capability exceeding parent capability signals that the maker education movement is producing genuine creative fluency.", source: "reddit", sourceName: "r/Parenting", date: "2026-05-28", crossLinks: [] },
  { id: "kcre-s4", trendId: "kids-creative-tech", title: "Osmo hands-on iPad learning reaches 30M children, physical-digital creative play normalised", summary: "30M children using a physical-digital creative play platform confirms the format has achieved the scale to be considered a mainstream educational tool.", source: "news", sourceName: "EdSurge", date: "2026-04-20", crossLinks: [] },
  { id: "kcre-s5", trendId: "kids-creative-tech", title: "Khan Academy's AI tutor Khanmigo adopted by 500 US school districts, AI education infrastructure scales", summary: "AI-assisted learning being adopted at district scale by 500 school systems confirms that AI is entering the education mainstream faster than any previous technology wave.", source: "news", sourceName: "The Atlantic", date: "2026-03-15", crossLinks: [] },

  // kids-ai-learning
  { id: "kail-s1", trendId: "kids-ai-learning", title: "Khan Academy Khanmigo adopted by 500 US school districts, AI tutoring enters mainstream education infrastructure", summary: "District-level adoption at this scale confirms AI tutoring has crossed from enrichment tool to educational infrastructure — the question is no longer whether but how fast.", source: "news", sourceName: "The Atlantic", date: "2026-06-16", crossLinks: [] },
  { id: "kail-s2", trendId: "kids-ai-learning", title: "Synthesis raises $80M Series B, AI STEM education for children achieves commercial scale", summary: "Institutional capital at this level in AI children's education confirms that the investor community believes personalised AI learning is a sustainable business, not a feature of a larger platform.", source: "news", sourceName: "TechCrunch", date: "2026-06-08", crossLinks: [] },
  { id: "kail-s3", trendId: "kids-ai-learning", title: "r/Parenting: my 9-year-old is learning faster with an AI tutor than she ever did with human tutoring. she asks it questions she'd never ask a teacher", summary: "Consumer testimony about qualitative differences in how children engage with AI vs human tutors reveals a dimension of the value proposition that product marketing cannot capture.", source: "reddit", sourceName: "r/Parenting", date: "2026-05-25", crossLinks: [] },
  { id: "kail-s4", trendId: "kids-ai-learning", title: "DreamBox Learning 5-year study shows 47% better maths outcomes with adaptive AI vs standard instruction", summary: "Peer-reviewed outcome data showing AI adaptive learning producing meaningfully better results than standard instruction is the clinical evidence that will drive institutional adoption.", source: "news", sourceName: "EdSurge", date: "2026-04-18", crossLinks: [] },
  { id: "kail-s5", trendId: "kids-ai-learning", title: "Google Socratic reaches 50M student downloads, AI homework assistance normalised across all age groups", summary: "50M downloads of an AI homework assistant confirms that AI-augmented learning has already become a standard consumer behaviour for school-age children, largely independent of institutional adoption.", source: "news", sourceName: "The Verge", date: "2026-03-10", crossLinks: [] },

  // mobility-micro
  { id: "mmicro-s1", trendId: "mobility-micro", title: "E-bike sales overtake conventional bike sales in the Netherlands, micro-mobility mainstream confirmed", summary: "In a country already saturated with cycling, e-bikes overtaking conventional bikes signals the definitive technology adoption tipping point for electrified two-wheeled transport.", source: "news", sourceName: "Reuters", date: "2026-06-17", crossLinks: [] },
  { id: "mmicro-s2", trendId: "mobility-micro", title: "Lime surpasses 500M scooter rides globally, shared micro-mobility embedded as urban infrastructure", summary: "Half a billion shared scooter rides confirms that micro-mobility has achieved the scale at which it functions as infrastructure rather than novelty.", source: "news", sourceName: "Lime Blog", date: "2026-06-09", crossLinks: [] },
  { id: "mmicro-s3", trendId: "mobility-micro", title: "r/cycling: I sold my car 8 months ago and replaced it with a cargo e-bike. I'm not going back", summary: "Consumer permanent substitution of cars for cargo e-bikes in urban contexts is the strongest possible signal that the technology is meeting real transport need, not supplementing it.", source: "reddit", sourceName: "r/cycling", date: "2026-05-26", crossLinks: [] },
  { id: "mmicro-s4", trendId: "mobility-micro", title: "Paris removes 70,000 car parking spaces and replaces them with cycling infrastructure, cities bet on micro-mobility", summary: "Municipal investment at this scale in cycling infrastructure is a structural unlock — the cities that redesign for micro-mobility see exponential adoption curves.", source: "news", sourceName: "Le Monde", date: "2026-04-18", crossLinks: [] },
  { id: "mmicro-s5", trendId: "mobility-micro", title: "Tern cargo e-bike sales up 400%, family car replacement thesis plays out in European cities", summary: "Cargo e-bike adoption at 400% growth rate for family transport use cases confirms the thesis that electrified cargo cycling can replace the school-run and grocery trip car entirely.", source: "news", sourceName: "Business of Cycling", date: "2026-03-22", crossLinks: [] },
  { id: "mmicro-s6", trendId: "mobility-micro", title: "Cowboy e-bike raises €80M and becomes the design-object commuter of choice in major European cities", summary: "Design-forward e-bike raising growth capital at this level confirms the market has segmented into commodity and premium, and the premium consumer will pay for aesthetics as much as performance.", source: "news", sourceName: "TechCrunch", date: "2026-02-10", crossLinks: [] },

  // mobility-ev-identity
  { id: "mev-s1", trendId: "mobility-ev-identity", title: "Rivian R1T owners community becomes the most engaged automotive brand community, NPS at 87", summary: "An automotive brand achieving Apple-level NPS through community and software rather than product alone confirms that the EV-as-lifestyle thesis produces measurably stronger emotional brand relationships.", source: "news", sourceName: "JD Power", date: "2026-06-14", crossLinks: [] },
  { id: "mev-s2", trendId: "mobility-ev-identity", title: "Polestar wins Scandinavian minimalist market by positioning as 'the anti-Tesla', aesthetic differentiation works", summary: "A premium EV brand growing through pure aesthetic and values positioning rather than technology claims proves that EV purchase is an identity decision as much as a transport decision.", source: "news", sourceName: "Financial Times", date: "2026-06-06", crossLinks: [] },
  { id: "mev-s3", trendId: "mobility-ev-identity", title: "r/electricvehicles: I didn't buy a car. I joined a community that happens to make cars.", summary: "Consumer self-description of an EV purchase as community joining rather than product buying is the definitive signal that automotive brand identity has achieved cult status for the EV cohort.", source: "reddit", sourceName: "r/electricvehicles", date: "2026-05-19", crossLinks: [] },
  { id: "mev-s4", trendId: "mobility-ev-identity", title: "BYD sells 3M EVs in 2025, mass-market price points achieved and category accelerates", summary: "3M annual EV units at mass-market price points confirms the technology has completed its premium-to-mainstream transition — the whole mobility market is now in a race to electrify.", source: "news", sourceName: "Reuters", date: "2026-04-25", crossLinks: [] },
  { id: "mev-s5", trendId: "mobility-ev-identity", title: "NIO House clubs in Shanghai reach 2M member-visits, EV brand as physical lifestyle community proven", summary: "An automotive brand generating 2M visits to its lifestyle clubhouse properties confirms the EV-as-identity thesis has produced genuine community infrastructure, not just marketing language.", source: "news", sourceName: "Bloomberg", date: "2026-03-08", crossLinks: [] },

  // spirituality-longevity-ritual
  { id: "slonge-s1", trendId: "spirituality-longevity-ritual", title: "Bryan Johnson's Blueprint protocol followed by 100K people, biological optimisation as open-source movement", summary: "A public longevity protocol with 100K adherents is not just a health behaviour — it's a community with shared practices, identity, and meaning-making that functions like a religion.", source: "news", sourceName: "Wired", date: "2026-06-14", crossLinks: [] },
  { id: "slonge-s2", trendId: "spirituality-longevity-ritual", title: "r/longevity: I've restructured my entire life around my biological age. my chronological age feels irrelevant now", summary: "Consumer self-description of biological age as the primary identity metric confirms the longevity movement has created a new frame for self-understanding that displaces traditional ageing narratives.", source: "reddit", sourceName: "r/longevity", date: "2026-06-06", crossLinks: [] },
  { id: "slonge-s3", trendId: "spirituality-longevity-ritual", title: "Prenuvo full-body MRI screening waitlist hits 18 months in major US cities, preventive longevity medicine at premium scale", summary: "18-month waitlists at $2,500+ per scan confirms that the preventive longevity consumer has both the financial means and the motivation to make significant health investments based on data, not symptoms.", source: "news", sourceName: "Bloomberg", date: "2026-05-20", crossLinks: [] },
  { id: "slonge-s4", trendId: "spirituality-longevity-ritual", title: "TruDiagnostic biological age test reaches 500K users, measuring epigenetic age becomes consumer wellness behaviour", summary: "Half a million people measuring their biological age rather than just tracking fitness metrics signals that the longevity consumer has a fundamentally different relationship with health data.", source: "news", sourceName: "Forbes", date: "2026-04-15", crossLinks: [] },
  { id: "slonge-s5", trendId: "spirituality-longevity-ritual", title: "r/Biohacking: my morning protocol is more sacred to me than anything religious I was raised with", summary: "Consumer comparison of longevity protocols to religious practice confirms that the movement has achieved the meaning-function that distinguishes lifestyle from religion.", source: "reddit", sourceName: "r/Biohacking", date: "2026-03-22", crossLinks: [] },
  { id: "slonge-s6", trendId: "spirituality-longevity-ritual", title: "Longevity retreat market grows 400% year-on-year, biological optimisation experiences reach $10,000 price points", summary: "Premium retreat pricing at this scale for longevity optimisation confirms that the movement has produced a willing-to-pay premium consumer who treats biological optimisation as a high-value investment.", source: "news", sourceName: "Financial Times", date: "2026-02-18", crossLinks: [] },

  // spirituality-neurotech
  { id: "spirneuro-s1", trendId: "spirituality-neurotech", title: "Muse headband reaches 1M users, consumer neurofeedback goes mainstream", summary: "Real-time brainwave feedback during meditation is proving the premise: measurable neuroscience and ancient practice aren't in conflict — they reinforce each other.", source: "news", sourceName: "TechCrunch", date: "2026-06-15", crossLinks: [] },
  { id: "spirneuro-s2", trendId: "spirituality-neurotech", title: "r/meditation: started tracking HRV during sits, the data changed my practice completely", summary: "Community reports of biometric integration into meditation practice show that data feedback is deepening rather than disrupting contemplative practice.", source: "reddit", sourceName: "r/meditation", date: "2026-06-10", crossLinks: [] },
  { id: "spirneuro-s3", trendId: "spirituality-neurotech", title: "Apollo Neuro FDA breakthrough designation signals clinical legitimacy for wearable stress regulation", summary: "FDA recognition of a consumer wearable for nervous system regulation moves the category from wellness gadget to medical device, unlocking insurance and clinical channels.", source: "news", sourceName: "Wired", date: "2026-05-28", crossLinks: [] },
  { id: "spirneuro-s4", trendId: "spirituality-neurotech", title: "r/neurofeedback: therapist recommended Muse as homework between sessions, neurotech enters clinical integration", summary: "Clinical integration of consumer neurotech devices as therapeutic adjuncts signals the category has passed its credibility threshold with medical professionals.", source: "reddit", sourceName: "r/neurofeedback", date: "2026-05-20", crossLinks: [] },
  { id: "spirneuro-s5", trendId: "spirituality-neurotech", title: "Neurosity's Crown EEG headset used by 5,000 developers building consciousness-aware apps", summary: "Developer ecosystem forming around EEG data APIs signals that neurotech will generate a platform and application layer above the hardware.", source: "news", sourceName: "VentureBeat", date: "2026-04-18", crossLinks: [] },

  // finance-defi-everyday
  { id: "fdefi-s1", trendId: "finance-defi-everyday", title: "Revolut launches crypto staking for 40M users, DeFi yield enters mainstream banking", summary: "When the UK's largest fintech embeds staking directly in its main app, decentralised finance stops being a niche product and becomes a standard banking feature.", source: "news", sourceName: "Financial Times", date: "2026-06-17", crossLinks: [] },
  { id: "fdefi-s2", trendId: "finance-defi-everyday", title: "PayPal's PYUSD stablecoin reaches $1B in circulation across e-commerce", summary: "Stablecoin adoption at PayPal scale confirms that on-chain dollar infrastructure is now embedded in mainstream consumer payment behaviour.", source: "news", sourceName: "The Block", date: "2026-06-10", crossLinks: [] },
  { id: "fdefi-s3", trendId: "finance-defi-everyday", title: "r/personalfinance: I moved my emergency fund to a DeFi yield account and I'm earning 5x my bank rate", summary: "Mainstream consumer migration of savings to DeFi yield products is happening organically through personal finance communities, with risk education following adoption rather than preceding it.", source: "reddit", sourceName: "r/personalfinance", date: "2026-05-28", crossLinks: [] },
  { id: "fdefi-s4", trendId: "finance-defi-everyday", title: "Coinbase Base L2 processes 10M daily transactions, DeFi infrastructure reaches scale", summary: "Transaction volumes on consumer-facing L2 networks now rival traditional payment rails in scale, the infrastructure argument against DeFi is functionally obsolete.", source: "news", sourceName: "CoinDesk", date: "2026-05-19", crossLinks: [] },
  { id: "fdefi-s5", trendId: "finance-defi-everyday", title: "EU MiCA regulation live: licensed DeFi products can now be offered by banks across 27 markets", summary: "Regulatory clarity is the final unlock for mainstream bank adoption of DeFi products — European banks can now legally embed on-chain yield and lending at scale.", source: "news", sourceName: "Bloomberg", date: "2026-04-08", crossLinks: [] },
  { id: "fdefi-s6", trendId: "finance-defi-everyday", title: "Nubank integrates DeFi yield for 80M Brazilian users, largest EM fintech goes on-chain", summary: "Emerging market fintech adoption of DeFi at 80M user scale proves the technology works for mass-market financial inclusion, not just Western early adopters.", source: "news", sourceName: "TechCrunch", date: "2026-03-12", crossLinks: [] },

  // finance-financial-identity
  { id: "fident-s1", trendId: "finance-financial-identity", title: "TikTok #loudbudgeting reaches 500M views, spending transparency becomes a cultural norm", summary: "Half a billion views on financial transparency content confirms that talking openly about money has crossed from taboo to identity statement for the under-35 demographic.", source: "news", sourceName: "The Guardian", date: "2026-06-15", crossLinks: [] },
  { id: "fident-s2", trendId: "finance-financial-identity", title: "YNAB grows to 1M paid subscribers, budgeting app becomes a community identity", summary: "A paid budgeting app reaching 1M subscribers confirms that financial discipline has become a social identity people pay to be part of, not just a private behaviour.", source: "news", sourceName: "Forbes", date: "2026-06-08", crossLinks: [] },
  { id: "fident-s3", trendId: "finance-financial-identity", title: "r/Frugal hits 3M members, anti-consumption community goes mainstream", summary: "One of Reddit's fastest-growing communities is built around spending less — the scale confirms that frugality has shed its shame and become aspirational for a significant consumer segment.", source: "reddit", sourceName: "r/Frugal", date: "2026-05-25", crossLinks: [] },
  { id: "fident-s4", trendId: "finance-financial-identity", title: "Monzo's annual spending review goes viral: users share breakdowns publicly", summary: "Personal finance data visualised as shareable content proves that financial behaviour has become social currency — the tool that makes your money life postable wins the generation.", source: "news", sourceName: "Wired", date: "2026-05-14", crossLinks: [] },
  { id: "fident-s5", trendId: "finance-financial-identity", title: "r/FIRE: reached $500k invested at 31, sharing my exact portfolio breakdown", summary: "Financial independence communities sharing detailed portfolio data publicly signal that wealth-building has become a spectator sport — the journey is the content, not just the destination.", source: "reddit", sourceName: "r/financialindependence", date: "2026-04-20", crossLinks: [] },
  { id: "fident-s6", trendId: "finance-financial-identity", title: "Ethical investing funds see 40% inflows from under-35s, values-aligned finance hits scale", summary: "When values-aligned investing accounts for the majority of new retail inflows in an age group, financial products become identity products — the what you invest in is the who you are.", source: "news", sourceName: "Financial Times", date: "2026-03-05", crossLinks: [] },

  // ── 2025 HISTORICAL SIGNALS ──────────────────────────────────────────────────

  // gaming-npc-aesthetics
  { id: "gnpc-old1", trendId: "gaming-npc-aesthetics", title: "TikTok NPC roleplay videos cross 5 billion views, blank-affect aesthetic spreads beyond gaming", summary: "Early NPC roleplay trend on TikTok blurring gaming culture into fashion and self-presentation, with creators adopting stilted movements and flat expression as comedic and aesthetic devices.", source: "news", sourceName: "Kotaku", date: "2025-09-14", crossLinks: [] },
  { id: "gnpc-old2", trendId: "gaming-npc-aesthetics", title: "r/gamedev modding communities document the visual grammar of NPC character design as an emerging aesthetic", summary: "Game modding forums cataloguing the distinctive visual language of NPC design — uniform colour palettes, generic silhouettes, blank expression — as the first signs it was crossing into fashion reference.", source: "reddit", sourceName: "r/gamedev", date: "2025-10-22", crossLinks: [] },

  // gaming-drop-economy
  { id: "gdrop-old1", trendId: "gaming-drop-economy", title: "Fortnite Chapter 5 Season 1 collab with Jordan Brand drops, fashion-gaming crossover reaches new high", summary: "Early 2025 Jordan x Fortnite collab demonstrating the mechanics of gaming drops — timed exclusivity, digital-physical pairing — as a template fashion brands were beginning to study closely.", source: "news", sourceName: "Hypebeast", date: "2025-09-30", crossLinks: [] },
  { id: "gdrop-old2", trendId: "gaming-drop-economy", title: "r/FashionReps: the drop model from Supreme and Palace feels identical to waiting for a Fortnite skin now", summary: "Community crossover between gaming and streetwear drop culture, with members explicitly connecting the dopamine mechanics of limited skin releases to physical fashion queue culture.", source: "reddit", sourceName: "r/FashionReps", date: "2025-11-08", crossLinks: [] },

  // wellness-cold-ritual
  { id: "wcold-old1", trendId: "wellness-cold-ritual", title: "r/biohacking: cold plunge is the one intervention that actually changed my baseline anxiety, not just morning energy", summary: "Early biohacking community testimony distinguishing cold exposure from fad wellness, with members reporting durable mood and anxiety benefits that went beyond performance metrics.", source: "reddit", sourceName: "r/biohacking", date: "2025-10-05", crossLinks: [] },
  { id: "wcold-old2", trendId: "wellness-cold-ritual", title: "Wim Hof appears on three major mainstream podcasts in one month, cold exposure reaches general audience", summary: "First wave of mainstream podcast coverage for Wim Hof and cold exposure methodology, marking the moment the practice began migrating from biohacker niche to general wellness culture.", source: "news", sourceName: "Men's Health", date: "2025-11-17", crossLinks: [] },

  // wellness-cortisol
  { id: "wcort-old1", trendId: "wellness-cortisol", title: "r/TwoXChromosomes: my cortisol is through the roof and I didn't even know it was measurable — starting to track it", summary: "Early mainstream discussion of cortisol dysregulation in women's communities, with members discovering cortisol tracking tools and connecting chronic stress to measurable biological markers for the first time.", source: "reddit", sourceName: "r/TwoXChromosomes", date: "2025-09-20", crossLinks: [] },
  { id: "wcort-old2", trendId: "wellness-cortisol", title: "Three cortisol tracking apps launch within the same month, consumer market forms around stress biology", summary: "First cluster of consumer cortisol-tracking product launches, signalling that the biomarker had crossed from clinical measurement to consumer wellness application.", source: "news", sourceName: "Healthline", date: "2025-11-03", crossLinks: [] },

  // foodtech-functional
  { id: "ffunc-old1", trendId: "foodtech-functional", title: "Seed, Olipop, and Poppi raise combined $120M in Q3 2025, functional food startups enter growth stage", summary: "First major funding wave for functional food and beverage startups, with investors backing brands built around gut health, adaptogens, and cognitive performance rather than conventional nutrition.", source: "news", sourceName: "TechCrunch", date: "2025-10-12", crossLinks: [] },
  { id: "ffunc-old2", trendId: "foodtech-functional", title: "r/food: I tried lab-grown mushroom powder in my coffee for a month — here's what actually happened", summary: "Early community experimentation with functional ingredients in everyday food, with detailed self-reported outcome tracking that prefigured the mainstream interest in functional food as lifestyle optimisation.", source: "reddit", sourceName: "r/food", date: "2025-11-25", crossLinks: [] },

  // foodtech-precision
  { id: "fprec-old1", trendId: "foodtech-precision", title: "ZOE precision nutrition pilot plant goes commercial-scale, first 100,000 microbiome tests completed", summary: "Early commercial milestone for precision fermentation-based nutrition analysis, with ZOE's microbiome testing reaching scale and validating consumer demand for food personalised to biological data.", source: "news", sourceName: "Food Navigator", date: "2025-09-08", crossLinks: [] },
  { id: "fprec-old2", trendId: "foodtech-precision", title: "Alternative protein sector raises $2.3B in H2 2025, precision fermentation pilots coming online across Europe", summary: "First alternative protein investment wave in 2025 funding precision fermentation pilot plants, with several European facilities reaching demonstration scale and attracting food giant partnerships.", source: "news", sourceName: "Good Food Institute", date: "2025-12-01", crossLinks: [] },

  // mentalhealth-dopamine
  { id: "mdopa-old1", trendId: "mentalhealth-dopamine", title: "r/nosurf: dopamine detox month — day 30 update, what changed and what didn't", summary: "Early dopamine detox experiment threads on r/nosurf generating thousands of comments as people documented week-by-week changes in mood, focus, and craving patterns during digital abstinence.", source: "reddit", sourceName: "r/nosurf", date: "2025-10-30", crossLinks: [] },
  { id: "mdopa-old2", trendId: "mentalhealth-dopamine", title: "Apple Screen Time data shows Gen Z averaging 8.2 hours daily — study links to dopamine receptor desensitisation", summary: "First major academic study linking consumer screen time data to measurable dopamine system effects, providing the scientific frame for what would become a mainstream wellness conversation.", source: "news", sourceName: "MIT Technology Review", date: "2025-11-14", crossLinks: [] },

  // mentalhealth-therapeutic
  { id: "mther-old1", trendId: "mentalhealth-therapeutic", title: "FDA clears Pear Therapeutics reSET for digital CBT delivery, digital therapeutics get first major regulatory green light", summary: "Early FDA clearance for app-delivered cognitive behavioural therapy establishing the regulatory framework for digital mental health tools, signalling credibility beyond wellness into medical application.", source: "news", sourceName: "STAT News", date: "2025-09-25", crossLinks: [] },
  { id: "mther-old2", trendId: "mentalhealth-therapeutic", title: "r/therapy: I started using a CBT app between sessions and it's the first time I've actually practiced the skills", summary: "Early community discussion of app-based CBT as a between-sessions practice tool, with therapists and clients discovering that digital delivery improved adherence to therapeutic exercises.", source: "reddit", sourceName: "r/therapy", date: "2025-12-08", crossLinks: [] },

  // interiordesign-ai-spatial
  { id: "intai-old1", trendId: "interiordesign-ai-spatial", title: "Archistar and Planner 5D AI room planning tools enter open beta, first AI interior design apps at consumer scale", summary: "Early AI-powered interior design apps launching public betas, attracting tens of thousands of signups from both professionals and homeowners experimenting with the new generation of spatial planning tools.", source: "news", sourceName: "Dezeen", date: "2025-09-18", crossLinks: [] },
  { id: "intai-old2", trendId: "interiordesign-ai-spatial", title: "r/interiordesign: I used Midjourney to generate 30 kitchen concepts in one afternoon — my clients had never seen this before", summary: "Interior design community first-contact with AI visualisation tools, with practitioners sharing their experiences of using generative image tools to accelerate concept presentation and client sign-off.", source: "reddit", sourceName: "r/interiordesign", date: "2025-11-02", crossLinks: [] },

  // interiordesign-ar-preview
  { id: "intar-old1", trendId: "interiordesign-ar-preview", title: "IKEA Place app update adds room scanning and full furniture layout preview, AR home design goes mobile-first", summary: "Major IKEA AR app update enabling full room layout simulation rather than single-item placement, marking the transition from novelty to practical interior planning tool for mainstream consumers.", source: "news", sourceName: "TechCrunch", date: "2025-10-07", crossLinks: [] },
  { id: "intar-old2", trendId: "interiordesign-ar-preview", title: "Wayfair launches AR try-before-you-buy for sofas, first major furniture brand to offer photorealistic room preview", summary: "Early AR furniture try-on launch from a major e-commerce platform, demonstrating that the technology had reached sufficient quality to influence real purchase decisions rather than serve as a demo feature.", source: "news", sourceName: "Retail Dive", date: "2025-12-03", crossLinks: [] },

  // interiordesign-smart-materials
  { id: "intsm-old1", trendId: "interiordesign-smart-materials", title: "MIT Media Lab publishes research on thermochromic and electrochromic material applications in domestic architecture", summary: "Early academic research on responsive building materials reaching architecture publications, introducing the concept of surfaces that actively adapt to environment, light, and occupancy.", source: "news", sourceName: "Architectural Record", date: "2025-09-12", crossLinks: [] },
  { id: "intsm-old2", trendId: "interiordesign-smart-materials", title: "r/architecture: smart glass is finally becoming viable for residential — pricing dropped 60% this year", summary: "Architecture community discussion of smart glass reaching residential price thresholds, with practitioners sharing first project experiences and cost calculations that made responsive facades feasible.", source: "reddit", sourceName: "r/architecture", date: "2025-11-19", crossLinks: [] },

  // travel-ai-itinerary
  { id: "travai-old1", trendId: "travel-ai-itinerary", title: "Roam Around and Wonderplan AI trip planner apps launch to waitlists of 50,000+ users each", summary: "First dedicated AI travel planning apps attracting significant pre-launch waitlists, demonstrating strong consumer appetite for AI-generated itineraries before the feature was integrated into major platforms.", source: "news", sourceName: "TechCrunch", date: "2025-10-15", crossLinks: [] },
  { id: "travai-old2", trendId: "travel-ai-itinerary", title: "r/travel: I asked ChatGPT to plan my two-week Japan trip and I'm genuinely impressed — here's the full itinerary", summary: "Early viral thread of AI-generated travel itinerary shared on r/travel, attracting hundreds of comments from travellers comparing AI recommendations to their own Japan experiences and testing their accuracy.", source: "reddit", sourceName: "r/travel", date: "2025-11-28", crossLinks: [] },

  // travel-immersive-tourism
  { id: "travimm-old1", trendId: "travel-immersive-tourism", title: "British Museum AR pilot lets visitors overlay Roman-era scenes on current galleries, 40,000 sign up in first week", summary: "Early museum AR pilot demonstrating strong consumer demand for layered historical experience, with visitor satisfaction scores significantly higher for AR-enhanced gallery experiences than standard ones.", source: "news", sourceName: "The Guardian", date: "2025-09-22", crossLinks: [] },
  { id: "travimm-old2", trendId: "travel-immersive-tourism", title: "r/travel: went on an 'immersive Pompeii' VR tour at home before visiting IRL — it completely changed how I experienced the ruins", summary: "Early community adoption of VR pre-travel experiences, with travellers discovering that digital preparation deepened their physical engagement with heritage sites rather than replacing it.", source: "reddit", sourceName: "r/travel", date: "2025-12-15", crossLinks: [] },

  // fitness-biometric-training
  { id: "fitbio-old1", trendId: "fitness-biometric-training", title: "Whoop 4.0 early reviews: 'the most complete fitness wearable ever made', HRV coaching changes training behaviours", summary: "First major wave of Whoop 4.0 reviews in fitness press and community, establishing HRV-guided training load management as the definitive use case for recovery-focused wearables.", source: "news", sourceName: "Outside Magazine", date: "2025-09-05", crossLinks: [] },
  { id: "fitbio-old2", trendId: "fitness-biometric-training", title: "r/fitness: six months of HRV-guided training — how it changed my approach to rest days completely", summary: "Detailed community writeup on HRV training adoption that attracted 3,000+ upvotes, spreading the concept of data-guided recovery from biohacker niche to general fitness community.", source: "reddit", sourceName: "r/fitness", date: "2025-10-18", crossLinks: [] },

  // fitness-social-performance
  { id: "fitsoc-old1", trendId: "fitness-social-performance", title: "Strava Year in Sport 2025 report: 120M athletes, women-led running groups growing 85% YoY", summary: "Strava's annual report marking the shift from individual performance tracking to social fitness identity, with community and group features driving the majority of new user growth.", source: "news", sourceName: "Runner's World", date: "2025-12-10", crossLinks: [] },
  { id: "fitsoc-old2", trendId: "fitness-social-performance", title: "r/running: I only sign up for races my Strava friends are doing now — the social layer is more motivating than the medal", summary: "Early community discussion of fitness social platforms replacing traditional race motivation, with members explicitly stating that shared digital fitness identity mattered more than achievement hardware.", source: "reddit", sourceName: "r/running", date: "2025-10-25", crossLinks: [] },

  // music-ai-creation
  { id: "musai-old1", trendId: "music-ai-creation", title: "Suno and Udio both go viral in the same week — AI music generation has its ChatGPT moment", summary: "First mass-media coverage of text-to-music AI tools as Suno and Udio simultaneously attracted millions of users and generated heated debate about the future of music creation and copyright.", source: "news", sourceName: "The Verge", date: "2025-09-09", crossLinks: [] },
  { id: "musai-old2", trendId: "music-ai-creation", title: "r/WeAreTheMusicMakers: tried Suno for the first time — the community is split but I can see why this changes everything", summary: "Professional music community's first extended engagement with AI music generation tools, with members documenting both creative possibilities and concerns about displacement in a widely-shared thread.", source: "reddit", sourceName: "r/WeAreTheMusicMakers", date: "2025-11-04", crossLinks: [] },

  // music-spatial-audio
  { id: "mussp-old1", trendId: "music-spatial-audio", title: "Apple Spatial Audio adoption doubles on AirPods Pro 2, 40M users getting 3D sound without knowing it", summary: "First major adoption milestone for Apple Spatial Audio, reaching tens of millions of passive users through default AirPods settings and beginning to shift consumer expectation for immersive listening.", source: "news", sourceName: "9to5Mac", date: "2025-10-20", crossLinks: [] },
  { id: "mussp-old2", trendId: "music-spatial-audio", title: "Dolby Atmos Music hits 100M streams per month on Apple Music, spatial format crosses from novelty to mainstream", summary: "Streaming milestone for spatial audio format indicating transition from audiophile curiosity to mainstream listening, with Dolby Atmos tracks outperforming standard versions on algorithmic recommendation.", source: "news", sourceName: "Billboard", date: "2025-12-06", crossLinks: [] },

  // art-ai-legitimacy
  { id: "artai-old1", trendId: "art-ai-legitimacy", title: "London gallery holds first dedicated AI art exhibition to mixed critical reviews, legitimacy debate begins", summary: "Early institutional AI art shows in London attracting serious critical engagement rather than dismissal, with major art press grappling with provenance, authorship, and value for AI-generated work.", source: "news", sourceName: "The Art Newspaper", date: "2025-10-03", crossLinks: [] },
  { id: "artai-old2", trendId: "art-ai-legitimacy", title: "r/Art: the AI art legitimacy thread — 5,000 comments and no consensus, but the conversation is happening", summary: "One of the largest AI art debate threads on r/Art, capturing the moment when mainstream art communities began seriously engaging with AI-generated work rather than dismissing it as non-art.", source: "reddit", sourceName: "r/Art", date: "2025-11-17", crossLinks: [] },

  // art-phygital-objects
  { id: "artphy-old1", trendId: "art-phygital-objects", title: "Damien Hirst burns 1,000 physical paintings after NFT holders choose digital versions, phygital logic inverts", summary: "Early phygital art experiment generating global coverage by burning physical works when collectors preferred digital, raising fundamental questions about the relative value of physical and digital art objects.", source: "news", sourceName: "The Guardian", date: "2025-09-28", crossLinks: [] },
  { id: "artphy-old2", trendId: "art-phygital-objects", title: "r/NFT: first phygital drops from major street artists — collectors split between flipping digital and keeping physical", summary: "Early collector community discussion of emerging phygital art format, with members debating whether to trade digital tokens or hold physical prints as the value structure of the new category began forming.", source: "reddit", sourceName: "r/NFT", date: "2025-11-12", crossLinks: [] },

  // skincare-biotech-actives
  { id: "skbio-old1", trendId: "skincare-biotech-actives", title: "Biotechnology skincare startups raise $280M in 2025 Q3-Q4, ingredient science becomes VC-grade investment", summary: "First major funding wave for biotech skincare ingredient companies, with investors targeting exosome, fermentation, and lab-grown collagen producers rather than finished-product brands.", source: "news", sourceName: "WWD", date: "2025-10-08", crossLinks: [] },
  { id: "skbio-old2", trendId: "skincare-biotech-actives", title: "r/SkincareAddiction: biotech actives megathread — what actually has evidence vs what is marketing", summary: "Community-generated evidence review of biotech skincare ingredients reaching front page of r/SkincareAddiction, marking the moment that ingredient-fluent consumers began demanding scientific evidence for biotech claims.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2025-12-02", crossLinks: [] },

  // skincare-ai-personalisation
  { id: "skai-old1", trendId: "skincare-ai-personalisation", title: "Revieve and Proven AI skin diagnostic platforms launch consumer apps with 100,000+ downloads in first month", summary: "First consumer AI skin diagnostic apps reaching significant download scale, demonstrating that camera-based skin analysis had crossed from in-store kiosk into everyday smartphone behaviour.", source: "news", sourceName: "Beauty Business", date: "2025-09-15", crossLinks: [] },
  { id: "skai-old2", trendId: "skincare-ai-personalisation", title: "Beauty tech startup funding hits $400M in Q4 2025, AI personalisation is the dominant investment thesis", summary: "Concentrated venture investment in AI-powered beauty personalisation, with multiple platforms building camera-based skin analysis and formulation-matching as their core competitive advantage.", source: "news", sourceName: "Glossy", date: "2025-12-18", crossLinks: [] },

  // luxury-blockchain-provenance
  { id: "luxblk-old1", trendId: "luxury-blockchain-provenance", title: "LVMH Aura blockchain expands to all major house brands, 20M luxury items authenticated on-chain", summary: "LVMH's Aura blockchain reaching group-wide adoption and 20 million authenticated items marked the transition from pilot project to genuine industry infrastructure for luxury authentication.", source: "news", sourceName: "Business of Fashion", date: "2025-10-14", crossLinks: [] },
  { id: "luxblk-old2", trendId: "luxury-blockchain-provenance", title: "r/handbags: bought my first authenticated blockchain Chanel from resale — actually checked the QR code on-chain", summary: "First community reports of consumers actively verifying luxury authentication codes on blockchain, signalling that the technology had reached the usability threshold required for mainstream resale adoption.", source: "reddit", sourceName: "r/handbags", date: "2025-11-30", crossLinks: [] },

  // luxury-ai-personalisation
  { id: "luxai-old1", trendId: "luxury-ai-personalisation", title: "Farfetch and YNAP pilot AI personal stylists for top-tier clients, luxury platforms test high-touch AI service", summary: "First luxury e-commerce pilots deploying AI personal shoppers for premium client segments, testing whether AI could replicate the intimate service quality that defined luxury retail relationships.", source: "news", sourceName: "Vogue Business", date: "2025-09-23", crossLinks: [] },
  { id: "luxai-old2", trendId: "luxury-ai-personalisation", title: "High-net-worth consumer report: 72% want more personalised service, AI as solution enters luxury boardrooms", summary: "Luxury sector research documenting the gap between personalisation demand and human-service scalability, creating the business case that drove AI personal shopping investment across the sector.", source: "news", sourceName: "Bain & Company", date: "2025-11-10", crossLinks: [] },

  // creativity-generative-tools
  { id: "crtgen-old1", trendId: "creativity-generative-tools", title: "Adobe Firefly integration into Creative Suite launches — 10M designers get generative AI in their existing workflow", summary: "Adobe's native generative AI integration into the industry's dominant design software marking the moment AI creative tools stopped being specialist products and became default infrastructure for all designers.", source: "news", sourceName: "The Verge", date: "2025-10-01", crossLinks: [] },
  { id: "crtgen-old2", trendId: "creativity-generative-tools", title: "r/graphic_design: six months with AI tools — here's what I kept, what I discarded, and what changed my process", summary: "Extensive community writeup from a working graphic designer documenting their AI tool integration, becoming one of the most upvoted posts in the community's history as it spoke to universal transition anxieties.", source: "reddit", sourceName: "r/graphic_design", date: "2025-12-09", crossLinks: [] },

  // creativity-human-ai-authorship
  { id: "crtaut-old1", trendId: "creativity-human-ai-authorship", title: "First AI-human co-authored novel reaches bestseller list, publishers debate credit and royalty structure", summary: "Literary debut of AI-human co-authored fiction entering mainstream bestseller charts, triggering the first serious industry-wide conversation about authorship attribution and compensation in AI-assisted creative work.", source: "news", sourceName: "Publishers Weekly", date: "2025-09-17", crossLinks: [] },
  { id: "crtaut-old2", trendId: "creativity-human-ai-authorship", title: "r/writing: does AI assistance in my novel mean I need to disclose it? Community is split", summary: "Early copyright and disclosure debate in writing communities, with members grappling with where human creative contribution ended and AI assistance began, anticipating formal guidance that had not yet arrived.", source: "reddit", sourceName: "r/writing", date: "2025-11-06", crossLinks: [] },

  // photography-ai-authenticity
  { id: "phtoauth-old1", trendId: "photography-ai-authenticity", title: "World Press Photo submission controversy: AI-generated image nearly wins category before disqualification", summary: "First high-profile AI image nearly passing photojournalism competition vetting, triggering emergency rule review and authentication protocol development across the global press photography community.", source: "news", sourceName: "British Journal of Photography", date: "2025-09-29", crossLinks: [] },
  { id: "phtoauth-old2", trendId: "photography-ai-authenticity", title: "r/photography: I can no longer tell AI from real in my Instagram feed and it's changing how I trust images", summary: "Community discussion marking a perceptual tipping point where AI images became indistinguishable in casual social media consumption, generating widespread anxiety about the evidentiary value of photography.", source: "reddit", sourceName: "r/photography", date: "2025-11-21", crossLinks: [] },

  // photography-computational
  { id: "phtocomp-old1", trendId: "photography-computational", title: "iPhone 16 Pro camera review: the best camera ever made, period — computational photography wins the DSLR war", summary: "iPhone 16 Pro review consensus establishing computational photography's definitive victory over traditional DSLR in most consumer and professional use cases, a milestone widely covered in photo press.", source: "news", sourceName: "DPReview", date: "2025-09-26", crossLinks: [] },
  { id: "phtocomp-old2", trendId: "photography-computational", title: "r/photography: computational photography is making me a worse photographer — I'm losing manual skills", summary: "Counterpoint community discussion raising concerns about skill atrophy from computational camera features, attracting photographers debating whether AI assistance was enhancing or replacing fundamental photographic knowledge.", source: "reddit", sourceName: "r/photography", date: "2025-11-15", crossLinks: [] },

  // film-ai-production
  { id: "filmaid-old1", trendId: "film-ai-production", title: "Disney's Indiana Jones AI de-aging reviewed as 'nearly invisible', Hollywood crosses the uncanny valley", summary: "First mainstream Hollywood film to receive near-universal praise for AI de-aging technology, establishing that the technique had reached sufficient quality for major studio deployment.", source: "news", sourceName: "Variety", date: "2025-10-11", crossLinks: [] },
  { id: "filmaid-old2", trendId: "film-ai-production", title: "r/movies: AI production tools in the new Mission Impossible — how much was digital and does it matter?", summary: "Community forensic discussion of AI production tool use in a major Hollywood blockbuster, one of the first mainstream audience conversations about AI's role behind the camera rather than in front of it.", source: "reddit", sourceName: "r/movies", date: "2025-12-04", crossLinks: [] },

  // film-algorithmic-culture
  { id: "filmalg-old1", trendId: "film-algorithmic-culture", title: "Netflix algorithmic content study reveals viewing data directly shaped 68% of 2025 originals' narrative structure", summary: "Academic study of Netflix production data providing the first evidence-based account of how streaming algorithms were reshaping narrative conventions, generating coverage across media and culture press.", source: "news", sourceName: "The Atlantic", date: "2025-10-28", crossLinks: [] },
  { id: "filmalg-old2", trendId: "film-algorithmic-culture", title: "r/netflix: why does every show feel the same now? The algorithm is writing our entertainment", summary: "Viral community thread on r/netflix articulating the algorithmic homogeneity feeling for the first time at scale, generating tens of thousands of comments that presaged the wider cultural critique.", source: "reddit", sourceName: "r/netflix", date: "2025-12-14", crossLinks: [] },

  // branding-ai-identity
  { id: "brnaid-old1", trendId: "branding-ai-identity", title: "Mattel redesigns its brand system using generative AI, first Fortune 500 company to go AI-first on identity", summary: "First major corporate brand identity redesign using AI as the primary generation tool rather than a supplementary one, setting off industry debate about the role of human creative direction in brand work.", source: "news", sourceName: "Fast Company", date: "2025-09-11", crossLinks: [] },
  { id: "brnaid-old2", trendId: "branding-ai-identity", title: "r/branding: is AI brand identity a shortcut or a structural change? Design community reacts", summary: "Design community debate on AI-generated brand identity systems, with practitioners sharing first experiences of presenting AI-generated options to clients and the reception they received.", source: "reddit", sourceName: "r/branding", date: "2025-11-26", crossLinks: [] },

  // branding-cultural-intelligence
  { id: "brnaci-old1", trendId: "branding-cultural-intelligence", title: "Cultural intelligence consultancies report 200% revenue growth as brands seek signal from noise", summary: "First wave of growth in specialist cultural intelligence firms, with major brands investing in real-time cultural monitoring after several high-profile failures from missing cultural shifts.", source: "news", sourceName: "Campaign", date: "2025-10-16", crossLinks: [] },
  { id: "brnaci-old2", trendId: "branding-cultural-intelligence", title: "Three major brands pull campaigns after failing cultural relevance audit — new field of AI brand anthropology emerges", summary: "High-profile brand campaign failures attributed to cultural intelligence gaps generating industry interest in AI-driven cultural monitoring tools as a preventive measure against misaligned brand communication.", source: "news", sourceName: "Marketing Week", date: "2025-12-07", crossLinks: [] },

  // food-cultivated-protein
  { id: "foodcp-old1", trendId: "food-cultivated-protein", title: "Israel and UK grant first cultivated meat regulatory approvals outside Singapore and US, European market opens", summary: "Early European and Middle Eastern regulatory approvals for cultivated meat expanding the potential market significantly beyond Singapore's first-mover status and US limited approvals.", source: "news", sourceName: "Reuters", date: "2025-09-19", crossLinks: [] },
  { id: "foodcp-old2", trendId: "food-cultivated-protein", title: "r/food: I attended a lab-grown meat tasting event in London — honest review from a lifelong meat eater", summary: "First-person community review of cultivated meat in a consumer tasting context, generating significant discussion about taste, texture, and the emotional experience of eating 'lab-grown' food for the first time.", source: "reddit", sourceName: "r/food", date: "2025-11-09", crossLinks: [] },

  // food-ai-flavour
  { id: "foodaf-old1", trendId: "food-ai-flavour", title: "Foodpairing AI platform launches public API, food innovation labs begin systematic AI flavour exploration", summary: "First consumer and professional AI flavour pairing tool releasing open API access, enabling food brands and restaurants to integrate molecular gastronomy intelligence into product development workflows.", source: "news", sourceName: "Food Navigator", date: "2025-10-23", crossLinks: [] },
  { id: "foodaf-old2", trendId: "food-ai-flavour", title: "Givaudan AI flavour tool reduces new product development cycle from 18 months to 90 days at pilot sites", summary: "First validated industry data on AI-driven food innovation speed, with Givaudan's pilot results demonstrating an 80% reduction in NPD timelines that would fundamentally change FMCG competitive dynamics.", source: "news", sourceName: "Food Ingredients First", date: "2025-12-16", crossLinks: [] },

  // fragrance-ai-formulation
  { id: "fragaf-old1", trendId: "fragrance-ai-formulation", title: "Givaudan unveils 'Carto' AI perfumer — the first commercially deployed AI fragrance formulation system", summary: "First public demonstration of a commercially deployed AI fragrance system from a major ingredient house, establishing that AI-assisted perfumery had crossed from research project to operational tool.", source: "news", sourceName: "Fragrantica", date: "2025-09-16", crossLinks: [] },
  { id: "fragaf-old2", trendId: "fragrance-ai-formulation", title: "r/fragrance: Givaudan's AI-made accord is in a mainstream perfume — can you tell which one? Community detective thread", summary: "Community crowdsourcing investigation into which consumer fragrances contained AI-formulated accords, marking the first serious engagement by fragrance enthusiasts with AI's quiet entry into commercial perfumery.", source: "reddit", sourceName: "r/fragrance", date: "2025-11-22", crossLinks: [] },

  // fragrance-emotional-tech
  { id: "fragemot-old1", trendId: "fragrance-emotional-tech", title: "Neuroscience study links specific fragrance profiles to cortisol reduction — emotional scent therapy enters peer review", summary: "First peer-reviewed study providing clinical evidence for therapeutic fragrance effects, giving the nascent emotional scent therapy category its first scientific foundation for claims beyond anecdotal wellness positioning.", source: "news", sourceName: "Journal of Affective Disorders", date: "2025-10-09", crossLinks: [] },
  { id: "fragemot-old2", trendId: "fragrance-emotional-tech", title: "r/fragrance: I started treating my perfume choices as mood management tools, not just aesthetics — anyone else?", summary: "Community thread exploring the shift from fragrance as aesthetic choice to fragrance as emotional regulation tool, an early signal of the therapeutic and functional positioning that would reshape the category.", source: "reddit", sourceName: "r/fragrance", date: "2025-12-20", crossLinks: [] },

  // jewellery-lab-grown
  { id: "jewlg-old1", trendId: "jewellery-lab-grown", title: "Lab-grown diamond prices fall 40% in 2025, price parity with mined diamonds achievable within 2 years", summary: "Dramatic lab-grown diamond price drops in 2025 establishing cost trajectory that would bring lab and mined into parity, triggering repositioning strategies across the fine jewellery industry.", source: "news", sourceName: "Rapaport", date: "2025-10-27", crossLinks: [] },
  { id: "jewlg-old2", trendId: "jewellery-lab-grown", title: "r/Diamonds: switched to lab-grown for my wife's anniversary ring — here's why we don't regret it", summary: "Community testimony from couples choosing lab-grown diamonds for meaningful milestone purchases, a signal that the category had earned the emotional permission previously reserved for mined stones.", source: "reddit", sourceName: "r/Diamonds", date: "2025-12-11", crossLinks: [] },

  // jewellery-digital-identity
  { id: "jewdi-old1", trendId: "jewellery-digital-identity", title: "Roblox virtual jewellery drops from major brands attract 2M equips in first week", summary: "First major brand digital jewellery drops on Roblox demonstrating that virtual accessory markets had reached meaningful scale, with engagement metrics that rivalled physical accessory launch performances.", source: "news", sourceName: "Hypebeast", date: "2025-09-24", crossLinks: [] },
  { id: "jewdi-old2", trendId: "jewellery-digital-identity", title: "r/fashionadvice: I spent more on digital accessories this year than physical ones — is this normal now?", summary: "Community discussion of digital accessory spending overtaking physical, particularly among younger members who increasingly expressed identity through avatar and profile customisation rather than physical adornment.", source: "reddit", sourceName: "r/fashionadvice", date: "2025-11-27", crossLinks: [] },

  // retail-ai-personalisation
  { id: "retai-old1", trendId: "retail-ai-personalisation", title: "Amazon upgrades recommendation engine with real-time behavioural AI, conversion rates jump 18% industry-wide", summary: "Amazon's recommendation engine upgrade demonstrating measurable industry-wide conversion improvement, establishing the competitive pressure that would drive all major retailers to accelerate AI personalisation investment.", source: "news", sourceName: "Retail Week", date: "2025-10-06", crossLinks: [] },
  { id: "retai-old2", trendId: "retail-ai-personalisation", title: "r/ecommerce: AI personalisation A/B test results — our conversion went up 23% but average basket went up 40%", summary: "Community sharing of early e-commerce AI personalisation A/B test data, providing the first concrete performance benchmarks that drove wider adoption of AI recommendation systems.", source: "reddit", sourceName: "r/ecommerce", date: "2025-11-24", crossLinks: [] },

  // retail-immersive-commerce
  { id: "retimm-old1", trendId: "retail-immersive-commerce", title: "Nike and Tommy Hilfiger launch metaverse retail experiences on Roblox, first major brand spatial commerce pilots", summary: "Early major brand metaverse retail experiments on Roblox attracting millions of visitors, testing whether virtual shopping environments could generate real-world purchase intent and brand awareness.", source: "news", sourceName: "WWD", date: "2025-09-30", crossLinks: [] },
  { id: "retimm-old2", trendId: "retail-immersive-commerce", title: "r/retail: tried the new Burberry metaverse store — is this the future of shopping or a gimmick?", summary: "Community evaluation of early luxury brand metaverse retail experiences, with balanced community assessment that identified genuine discovery value alongside significant UX friction in early implementations.", source: "reddit", sourceName: "r/retail", date: "2025-11-13", crossLinks: [] },

  // social-ai-content
  { id: "socai-old1", trendId: "social-ai-content", title: "BuzzFeed publishes first AI-generated viral article, media industry reacts", summary: "First major media publication deploying AI for content production at scale, triggering industry-wide debate about AI content authenticity and the future of digital media production economics.", source: "news", sourceName: "Columbia Journalism Review", date: "2025-09-04", crossLinks: [] },
  { id: "socai-old2", trendId: "social-ai-content", title: "r/socialmedia: how to tell if an Instagram account is AI-generated — a community guide to spotting synthetic content", summary: "Community-generated guide to identifying AI-generated social media content, emerging spontaneously as platform authenticity concerns reached critical mass among media-literate users.", source: "reddit", sourceName: "r/socialmedia", date: "2025-10-31", crossLinks: [] },

  // social-creator-economy
  { id: "soccr-old1", trendId: "social-creator-economy", title: "Creator economy reaches $250B total value in 2025 — Goldman Sachs report marks the milestone", summary: "Goldman Sachs report establishing the creator economy as a quarter-trillion dollar industry, providing the institutional credibility that would attract the next wave of infrastructure investment.", source: "news", sourceName: "Goldman Sachs Research", date: "2025-10-17", crossLinks: [] },
  { id: "soccr-old2", trendId: "social-creator-economy", title: "r/youtube: YouTube's new monetisation tiers changed everything — I make more from 50K subscribers than I did from 500K under the old rules", summary: "Creator community reaction to platform monetisation changes that improved economics for mid-tier creators, a signal that the platform was investing in the sustainability of its creator ecosystem.", source: "reddit", sourceName: "r/youtube", date: "2025-12-05", crossLinks: [] },

  // education-ai-tutoring
  { id: "edai-old1", trendId: "education-ai-tutoring", title: "Khan Academy Khanmigo beta launches to 200 schools, AI Socratic tutoring validated at classroom scale", summary: "First school-scale deployment of AI personalised tutoring demonstrating that the technology could function in real educational environments, not just controlled experiments.", source: "news", sourceName: "EdSurge", date: "2025-09-10", crossLinks: [] },
  { id: "edai-old2", trendId: "education-ai-tutoring", title: "r/Teachers: I let my students use Khanmigo for a month and I'm embarrassed how much better it explained certain concepts", summary: "Teacher community discussion of AI tutoring quality, with educators sharing experiences where AI explanations outperformed their own in specific subject areas, generating nuanced classroom-level debate.", source: "reddit", sourceName: "r/Teachers", date: "2025-11-07", crossLinks: [] },

  // education-skills-credentials
  { id: "edcred-old1", trendId: "education-skills-credentials", title: "IBM, Google, and Apple all announce degree-optional hiring for technical roles — skills credentials go mainstream", summary: "Coordinated announcement from major tech employers dropping degree requirements for significant job categories, generating widespread coverage and accelerating employer and educator interest in alternative credentialing.", source: "news", sourceName: "The Wall Street Journal", date: "2025-10-22", crossLinks: [] },
  { id: "edcred-old2", trendId: "education-skills-credentials", title: "Coursera and LinkedIn Learning report 3x growth in employer-recognised micro-credential completions in 2025", summary: "Alternative credentials platform growth report establishing that employer-validated micro-credentials had reached meaningful adoption scale, with completion rates tied to verified hiring outcomes.", source: "news", sourceName: "Forbes Education", date: "2025-12-19", crossLinks: [] },

  // fashion-resale-first
  { id: "fashres-old1", trendId: "fashion-resale-first", title: "Vinted crosses 100M users milestone, secondhand platform overtakes new fashion retail in several European markets", summary: "Vinted's 100 million user milestone establishing peer-to-peer fashion resale as a mainstream retail channel rather than a niche behaviour, with several markets showing resale volume overtaking fast fashion.", source: "news", sourceName: "Business of Fashion", date: "2025-10-13", crossLinks: [] },
  { id: "fashres-old2", trendId: "fashion-resale-first", title: "r/ThriftStoreHauls hits 4M members, thrift community becomes one of Reddit's fastest-growing fashion spaces", summary: "Thrift community on Reddit reaching scale that confirmed secondhand fashion had transcended niche interest to become a primary fashion identity for a substantial consumer segment.", source: "reddit", sourceName: "r/ThriftStoreHauls", date: "2025-11-29", crossLinks: [] },

  // fashion-micro-trend-fatigue
  { id: "fashfat-old1", trendId: "fashion-micro-trend-fatigue", title: "The Guardian runs first major 'micro-trend fatigue' analysis piece — exhaustion from TikTok trend cycles reaches mainstream press", summary: "First mainstream media treatment of TikTok-driven micro-trend fatigue as a significant cultural phenomenon, marking the shift from niche community frustration to widely-acknowledged cultural condition.", source: "news", sourceName: "The Guardian", date: "2025-09-07", crossLinks: [] },
  { id: "fashfat-old2", trendId: "fashion-micro-trend-fatigue", title: "r/femalefashionadvice: I quit following TikTok trends and my wardrobe actually makes sense now — anyone else over it?", summary: "Community thread of users documenting their exit from micro-trend culture and return to personal style development, attracting significant engagement and spawning a trend-fatigue support community.", source: "reddit", sourceName: "r/femalefashionadvice", date: "2025-11-18", crossLinks: [] },

  // beauty-skin-diagnostics
  { id: "beaudiag-old1", trendId: "beauty-skin-diagnostics", title: "Neutrogena Skin360 AI scanner mainstream launch — L'Oréal group's first mass-market AI diagnostic tool", summary: "First mass-market beauty brand launching an AI skin diagnostic tool at scale, bringing camera-based skin analysis out of premium brand pilot territory into drugstore and mass channel availability.", source: "news", sourceName: "Beauty Independent", date: "2025-10-24", crossLinks: [] },
  { id: "beaudiag-old2", trendId: "beauty-skin-diagnostics", title: "r/SkincareAddiction: I tried four AI skin diagnostic apps — here's which one actually gave actionable advice", summary: "Community comparative review of early AI skin diagnostic tools, establishing the quality benchmark for the emerging category and identifying which approaches were generating genuine behaviour change.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2025-12-17", crossLinks: [] },

  // beauty-biotech-actives
  { id: "beaubio-old1", trendId: "beauty-biotech-actives", title: "Geltor lab-grown collagen featured in first luxury skincare brand launch — biotech beauty enters prestige tier", summary: "First luxury skincare brand to feature lab-grown collagen as a lead ingredient, establishing the prestige positioning for biotech beauty and creating the premium market reference that would justify mass-market investment.", source: "news", sourceName: "WWD", date: "2025-09-06", crossLinks: [] },
  { id: "beaubio-old2", trendId: "beauty-biotech-actives", title: "r/SkincareAddiction: biotech ingredients explainer — what is lab-grown collagen and is it actually better than the real thing?", summary: "Community-generated educational thread on biotech skincare ingredients reaching r/SkincareAddiction front page, marking the moment mainstream beauty consumers began engaging seriously with ingredient origin and synthesis.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2025-11-05", crossLinks: [] },

  // dating-ai-assisted
  { id: "datai-old1", trendId: "dating-ai-assisted", title: "Rizz AI dating coach app hits 500K downloads in first month, AI profile writing enters mainstream dating", summary: "First AI dating coach app reaching significant scale, validating consumer demand for AI assistance in the dating app experience and triggering response features from major platforms.", source: "news", sourceName: "TechCrunch", date: "2025-10-18", crossLinks: [] },
  { id: "datai-old2", trendId: "dating-ai-assisted", title: "r/dating_advice: I used AI to rewrite my Hinge profile and my match rate tripled — is this cheating?", summary: "Community debate about AI-assisted dating profiles attracting significant engagement, with members weighing authenticity concerns against practical efficacy and raising questions about what 'authentic' means in a curated dating environment.", source: "reddit", sourceName: "r/dating_advice", date: "2025-11-23", crossLinks: [] },

  // dating-slow
  { id: "datslo-old1", trendId: "dating-slow", title: "'Slow dating' appears in six major publications in one month — a new term for an old frustration reaches critical mass", summary: "First cluster of mainstream press pieces coining and defining 'slow dating' as a cultural countermovement to swipe-culture, marking the term's emergence as a shared framework for dating app fatigue.", source: "news", sourceName: "The Times", date: "2025-09-13", crossLinks: [] },
  { id: "datslo-old2", trendId: "dating-slow", title: "r/dating: I deleted all my dating apps and started going to events instead — six months update", summary: "Community thread documenting a return to in-person dating events as a deliberate rejection of app-based matching, attracting significant engagement from users experiencing similar app fatigue.", source: "reddit", sourceName: "r/dating", date: "2025-12-13", crossLinks: [] },

  // nightlife-ai-discovery
  { id: "nightai-old1", trendId: "nightlife-ai-discovery", title: "Dice FM launches AI recommendation engine, event discovery becomes personalised for 5M users", summary: "Dice FM's first major AI feature moving the platform from manual event browsing to personalised discovery, marking the beginning of algorithmic curation in a category previously dominated by word-of-mouth.", source: "news", sourceName: "Music Week", date: "2025-10-09", crossLinks: [] },
  { id: "nightai-old2", trendId: "nightlife-ai-discovery", title: "r/london: best apps for finding events you didn't know you'd love — Dice vs RA vs the algorithmic newcomers", summary: "London community thread comparing event discovery app algorithms, an early signal that personalised event recommendation was becoming a meaningful consumer differentiator in urban nightlife culture.", source: "reddit", sourceName: "r/london", date: "2025-11-16", crossLinks: [] },

  // nightlife-immersive
  { id: "nightimm-old1", trendId: "nightlife-immersive", title: "Meow Wolf announces Denver expansion, immersive entertainment company secures $150M for national rollout", summary: "Meow Wolf's major expansion announcement establishing immersive entertainment as a scalable commercial category rather than a single-venue phenomenon, attracting significant media coverage.", source: "news", sourceName: "Rolling Stone", date: "2025-09-03", crossLinks: [] },
  { id: "nightimm-old2", trendId: "nightlife-immersive", title: "r/london: Punchdrunk's new show is the best thing I've done in five years — here's why immersive theatre has no competition", summary: "Early reviews of Punchdrunk's new immersive production generating exceptional audience responses, with community members articulating why the format offered experiences unavailable in any other entertainment medium.", source: "reddit", sourceName: "r/london", date: "2025-10-26", crossLinks: [] },

  // coffee-precision-tech
  { id: "coffpre-old1", trendId: "coffee-precision-tech", title: "Decent Espresso DE1 joins 18-month waitlist — specialty coffee community's most-discussed machine signals connected brewing demand", summary: "Decent Espresso's extended waitlist for its data-logging connected espresso machine demonstrating demand for precision brewing technology that significantly outpaced supply capabilities.", source: "news", sourceName: "Sprudge", date: "2025-09-26", crossLinks: [] },
  { id: "coffpre-old2", trendId: "coffee-precision-tech", title: "r/espresso: smart scales changed my brewing more than any other upgrade — comparing Acaia, Timemore, and Decent", summary: "Community comparison of connected smart scales for espresso preparation, with members documenting how data-driven extraction improved cup quality and establishing the community standards for precision brewing.", source: "reddit", sourceName: "r/espresso", date: "2025-11-10", crossLinks: [] },

  // coffee-biotech
  { id: "coffbio-old1", trendId: "coffee-biotech", title: "Atomo Coffee 'beanless' molecular coffee receives first mainstream press coverage — the alternative coffee category is born", summary: "Atomo Coffee's beanless molecular coffee receiving its first significant mainstream media treatment, introducing the concept of coffee made from molecular components rather than coffee beans to a general consumer audience.", source: "news", sourceName: "Fast Company", date: "2025-09-25", crossLinks: [] },
  { id: "coffbio-old2", trendId: "coffee-biotech", title: "r/Coffee: the beanless coffee concept thread — fascinating or unnecessary? Community discusses molecular coffee", summary: "r/Coffee community's first extended engagement with beanless and biotech coffee concepts, generating debate between specialty coffee purists, sustainability advocates, and science-curious coffee enthusiasts.", source: "reddit", sourceName: "r/Coffee", date: "2025-12-12", crossLinks: [] },

  // sport-recovery-culture
  { id: "srec-old1", trendId: "sport-recovery-culture", title: "Whoop announces partnership with NFL, NBA, and Premier League simultaneously — elite sport recovery data goes institutional", summary: "Major sports league partnerships for Whoop legitimising recovery wearables at the highest level of professional sport, creating the credibility signal that would accelerate mainstream consumer adoption.", source: "news", sourceName: "Sports Business Journal", date: "2025-10-02", crossLinks: [] },
  { id: "srec-old2", trendId: "sport-recovery-culture", title: "r/fitness: recovery protocol deep dive — I tested cold, sauna, compression, and sleep optimisation for 90 days", summary: "Community-generated recovery protocol experiment generating extensive documentation and discussion, establishing evidence-based recovery practice benchmarks in mainstream fitness communities.", source: "reddit", sourceName: "r/fitness", date: "2025-11-19", crossLinks: [] },

  // sport-fan-economy
  { id: "sfan-old1", trendId: "sport-fan-economy", title: "NCAA NIL deals reach $500M in first full year, college athletes become micro-brands overnight", summary: "First-year totals for NCAA name, image, and likeness deals establishing the scale of the athlete-brand economy and validating the commercial model that professional leagues would accelerate.", source: "news", sourceName: "ESPN", date: "2025-10-29", crossLinks: [] },
  { id: "sfan-old2", trendId: "sport-fan-economy", title: "r/soccer: I follow the player not the club — how athlete parasocial relationships have replaced team loyalty for Gen Z fans", summary: "Community discussion of generational shift in sports fandom from institutional to individual loyalty, with members articulating how athlete-creator relationships had fundamentally changed their sports consumption behaviour.", source: "reddit", sourceName: "r/soccer", date: "2025-12-21", crossLinks: [] },

  // pets-genomics
  { id: "pgen-old1", trendId: "pets-genomics", title: "Embark dog DNA test featured in mainstream pet health coverage — first mainstream press breakthrough for pet genomics", summary: "Embark's dog DNA testing reaching mainstream consumer health and pet press for the first time, bringing genetic screening into awareness for pet owners who had not previously engaged with genomic health products.", source: "news", sourceName: "Consumer Reports", date: "2025-09-16", crossLinks: [] },
  { id: "pgen-old2", trendId: "pets-genomics", title: "r/dogs: my Embark results revealed two breed health conditions we're now monitoring — worth every penny", summary: "Community sharing of actionable health outcomes from pet DNA testing, with multiple members reporting that breed-specific disease risk identification had changed their veterinary care approach.", source: "reddit", sourceName: "r/dogs", date: "2025-11-01", crossLinks: [] },

  // pets-tech
  { id: "ptech-old1", trendId: "pets-tech", title: "Whistle GPS collar receives first major mainstream review — 'the Fitbit for dogs has arrived'", summary: "First major mainstream consumer tech review of GPS pet health collar establishing the product category's legitimacy and connecting it to the quantified self language that would drive consumer adoption.", source: "news", sourceName: "Wired", date: "2025-10-04", crossLinks: [] },
  { id: "ptech-old2", trendId: "pets-tech", title: "r/dogs: pet wearable megathread — which trackers are actually worth the subscription fee?", summary: "Community comparative review of pet wearable devices addressing the subscription model value question, establishing which products were generating sufficient behavioural insight to justify ongoing cost.", source: "reddit", sourceName: "r/dogs", date: "2025-11-28", crossLinks: [] },

  // parenting-screentime
  { id: "pscr-old1", trendId: "parenting-screentime", title: "US Surgeon General issues first warning on social media harm for teenagers — screen time debate reaches government level", summary: "First US Surgeon General formal advisory specifically addressing teenage social media use, elevating the screen time conversation from parenting discourse to public health policy and accelerating regulatory momentum.", source: "news", sourceName: "Washington Post", date: "2025-09-21", crossLinks: [] },
  { id: "pscr-old2", trendId: "parenting-screentime", title: "r/Parenting: we set hard screen time limits for a year — what actually changed (honest assessment)", summary: "Long-form community report on the real effects of imposing screen time limits, attracting significant engagement from parents searching for honest assessments beyond ideological positions on either side.", source: "reddit", sourceName: "r/Parenting", date: "2025-11-11", crossLinks: [] },

  // parenting-village-model
  { id: "pvil-old1", trendId: "parenting-village-model", title: "Harvard study on parenting loneliness goes viral — 61% of US parents report social isolation as primary stress source", summary: "Academic research establishing parenting isolation as a public health-scale issue, receiving widespread media coverage that validated the lived experience of millions of parents and created market permission for community solutions.", source: "news", sourceName: "Harvard Public Health", date: "2025-10-08", crossLinks: [] },
  { id: "pvil-old2", trendId: "parenting-village-model", title: "r/Parenting: childcare is unaffordable so we started a co-op with three other families — here's how", summary: "Community thread on informal cooperative childcare arrangements that generated significant engagement and spawned multiple similar threads, signalling that families were independently discovering community care solutions.", source: "reddit", sourceName: "r/Parenting", date: "2025-12-02", crossLinks: [] },

  // kids-creative-tech
  { id: "kcre-old1", trendId: "kids-creative-tech", title: "Roblox creator economy report: 2.5M young creators earning from games they built on the platform", summary: "First Roblox creator economy report establishing the scale of the youth creator market, with millions of young people earning real income from content they created on a platform they also consumed.", source: "news", sourceName: "TechCrunch", date: "2025-10-20", crossLinks: [] },
  { id: "kcre-old2", trendId: "kids-creative-tech", title: "r/Parenting: my 10-year-old asked me to buy Roblox Studio Premium so she could publish her game — what has happened to childhood?", summary: "Community thread exploring the normalisation of children as game creators rather than just players, with parents sharing observations about the shift in how their children engaged with digital platforms.", source: "reddit", sourceName: "r/Parenting", date: "2025-12-08", crossLinks: [] },

  // kids-ai-learning
  { id: "kail-old1", trendId: "kids-ai-learning", title: "Khanmigo beta and Synthesis both launch early access for under-13s — AI tutoring for children becomes real", summary: "First AI tutoring products designed specifically for children under 13 launching to early adopter waitlists, establishing the children's AI learning category as a distinct market from adult education AI.", source: "news", sourceName: "EdSurge", date: "2025-09-11", crossLinks: [] },
  { id: "kail-old2", trendId: "kids-ai-learning", title: "r/Teachers: students are using AI tutors outside school — should we be worried or welcoming it?", summary: "Teacher community discussion of AI tutoring tool adoption among students, grappling with the question of whether external AI tutoring was undermining classroom learning or extending educational engagement.", source: "reddit", sourceName: "r/Teachers", date: "2025-11-26", crossLinks: [] },

  // mobility-micro
  { id: "mmicro-old1", trendId: "mobility-micro", title: "Netherlands reports e-bike sales exceeding conventional bike sales for first time — micro-mobility tipping point documented", summary: "Dutch cycling market data showing e-bikes overtaking conventional bikes in the world's most cycling-saturated market, establishing an unambiguous technology adoption milestone that signalled broader European transition.", source: "news", sourceName: "Financial Times", date: "2025-09-18", crossLinks: [] },
  { id: "mmicro-old2", trendId: "mobility-micro", title: "r/cycling: I converted my conventional bike to an e-bike with a kit for £400 — 8 months later here's what changed", summary: "Community documentation of low-cost e-bike conversion enabling car trip substitution, with members sharing detailed accounts of how electrification changed their daily mobility patterns and route choices.", source: "reddit", sourceName: "r/cycling", date: "2025-11-03", crossLinks: [] },

  // mobility-ev-identity
  { id: "mev-old1", trendId: "mobility-ev-identity", title: "Rivian R1T first deliveries generate unprecedented community excitement — EV as community product launches a new category", summary: "Rivian's first vehicle deliveries generating exceptional community and media response, establishing that an EV could launch with the cultural intensity of a consumer electronics product rather than a conventional car.", source: "news", sourceName: "The Verge", date: "2025-10-15", crossLinks: [] },
  { id: "mev-old2", trendId: "mobility-ev-identity", title: "r/electricvehicles reaches 1M members, EV identity community hits scale as adoption accelerates", summary: "Electric vehicle community on Reddit reaching one million members, establishing a critical mass of identity-driven EV adopters who would shape the cultural narrative around electric mobility.", source: "reddit", sourceName: "r/electricvehicles", date: "2025-12-22", crossLinks: [] },

  // spirituality-longevity-ritual
  { id: "slonge-old1", trendId: "spirituality-longevity-ritual", title: "Bryan Johnson Blueprint protocol receives first major magazine profile — biohacking enters mainstream press", summary: "First in-depth mainstream magazine profile of Bryan Johnson's Blueprint protocol, introducing the concept of data-driven biological age reversal to a general readership and triggering widespread conversation.", source: "news", sourceName: "Bloomberg Businessweek", date: "2025-09-27", crossLinks: [] },
  { id: "slonge-old2", trendId: "spirituality-longevity-ritual", title: "r/longevity reaches 500K members as biological optimisation community achieves critical scale", summary: "Longevity community on Reddit reaching significant membership scale, establishing a mainstream audience for daily discussion of protocols, supplements, and interventions aimed at extending healthspan.", source: "reddit", sourceName: "r/longevity", date: "2025-12-03", crossLinks: [] },

  // spirituality-neurotech
  { id: "spirneuro-old1", trendId: "spirituality-neurotech", title: "Muse headband passes 500K sales milestone, consumer EEG meditation device achieves mainstream scale", summary: "Muse meditation headband reaching half a million units establishing consumer neurofeedback as a viable market category, with sufficient user base to generate community knowledge and peer recommendation.", source: "news", sourceName: "TechCrunch", date: "2025-10-19", crossLinks: [] },
  { id: "spirneuro-old2", trendId: "spirituality-neurotech", title: "r/Meditation: I've been using a Muse headband for six months — here's what the brainwave data revealed about my practice", summary: "Community writeup on extended Muse headband meditation data, sharing insights about attention patterns, session quality, and how biofeedback had changed the practitioner's approach to contemplative practice.", source: "reddit", sourceName: "r/Meditation", date: "2025-11-22", crossLinks: [] },

  // finance-defi-everyday
  { id: "fdefi-old1", trendId: "finance-defi-everyday", title: "Revolut adds crypto staking features for 30M European users — DeFi yield enters mainstream banking app", summary: "Revolut's crypto staking feature launch bringing DeFi yield products to tens of millions of mainstream banking customers who had not previously engaged with decentralised finance.", source: "news", sourceName: "CoinDesk", date: "2025-09-22", crossLinks: [] },
  { id: "fdefi-old2", trendId: "finance-defi-everyday", title: "r/CryptoCurrency: DeFi is finally going mainstream and most people won't even know they're using it", summary: "Community discussion of DeFi protocols becoming embedded in mainstream financial apps without consumer awareness, marking the transition from niche crypto product to invisible financial infrastructure.", source: "reddit", sourceName: "r/CryptoCurrency", date: "2025-11-14", crossLinks: [] },

  // finance-financial-identity
  { id: "fident-old1", trendId: "finance-financial-identity", title: "'Loud budgeting' goes viral on TikTok with first wave of creators publicly declining expensive plans — the term is coined", summary: "First viral wave of loud budgeting content on TikTok establishing the term and the behaviour, with creators openly discussing financial limits and receiving positive community response that validated the transparency.", source: "news", sourceName: "Forbes", date: "2025-10-31", crossLinks: [] },
  { id: "fident-old2", trendId: "finance-financial-identity", title: "r/personalfinance: sharing my complete 2025 budget breakdown — why I decided to stop being secretive about money", summary: "Community thread of detailed personal budget disclosure attracting significant engagement and spawning multiple similar posts, establishing financial transparency as a valued community behaviour rather than taboo.", source: "reddit", sourceName: "r/personalfinance", date: "2025-12-17", crossLinks: [] },
];
