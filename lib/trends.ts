import { Trend, Signal } from "@/types";

// Trend center positions (React Flow units — large canvas)
export const TRENDS: Trend[] = [
  {
    id: "ai-creativity",
    name: "The Machine That Replaced Your Moodboard",
    description: "AI isn't a tool anymore — it's a creative collaborator that designs faster, cheaper, and stranger than any human team. Fashion is only beginning to reckon with what that means.",
    color: "#FF2D78",
    relevanceScore: 88,
    redditQuery: "AI fashion design generative",
    newsQuery: "AI generative fashion design",
    position: { x: 520, y: 380 },
    whyRelevant: "AI is compressing creative cycles by 10x. Brands that don't integrate AI into design, forecasting, and campaigns will be out-produced by those that do. The competitive advantage is structural, not marginal — it compounds every quarter.",
    nextSteps: [
      "Audit which creative workflows can be AI-augmented this quarter and run a 30-day pilot",
      "Test one AI-generated campaign concept with a controlled consumer group and measure recall vs. traditional creative",
      "Draft an AI ethics policy covering synthetic models, attribution, and data provenance before regulation forces your hand",
    ],
  },
  {
    id: "digital-identity",
    name: "Dressing the Self You Are Online",
    description: "Your avatar's outfit matters as much as what you wore to dinner. Digital fashion, virtual personas, and online self-expression are becoming billion-dollar identity markets.",
    color: "#FFE600",
    relevanceScore: 82,
    redditQuery: "digital identity avatar virtual fashion",
    newsQuery: "digital identity virtual avatar fashion",
    position: { x: 1100, y: 220 },
    whyRelevant: "The next generation measures social status as much by digital appearance as physical. Brands that only exist physically are invisible to the demographic most likely to drive culture for the next 20 years. Digital drops carry zero inventory risk.",
    nextSteps: [
      "Map your brand's current presence (or absence) across Roblox, Fortnite, and Ready Player Me",
      "Commission one digital-only drop to test virtual commerce mechanics without physical production risk",
      "Study how gaming fashion economics differ from physical — scarcity, resale, and community dynamics all work differently",
    ],
  },
  {
    id: "ar-commerce",
    name: "Try Before You Never Buy",
    description: "AR try-on is collapsing the distance between desire and purchase. Virtual fitting rooms are cutting returns, lifting conversion, and making physical retail look slow.",
    color: "#7B2FFF",
    relevanceScore: 79,
    redditQuery: "AR VR shopping try-on retail",
    newsQuery: "augmented reality virtual try-on shopping",
    position: { x: 1700, y: 380 },
    whyRelevant: "AR try-on is already delivering measurable ROI — 30–50% lower returns, 2–3x higher conversion. It's no longer experimental. Brands without it are at a structural conversion disadvantage, especially as mobile AR becomes the default browsing behaviour.",
    nextSteps: [
      "Integrate AR try-on SDK (Snap, Zakeke, or native) into product pages for your top 20 SKUs and track return rates before/after",
      "Brief your wholesale buyers on virtual showroom capabilities — 40% already prefer virtual to physical visits",
      "Test AR-first product reveals in campaign launches to measure pre-purchase engagement",
    ],
  },
  {
    id: "biotech-beauty",
    name: "The Lab Is the New Beauty Counter",
    description: "Bioprinted skin. Microbiome formulas. Fermentation actives. The beauty industry is becoming a biotech industry — and the brands that understand biology will win.",
    color: "#00FF87",
    relevanceScore: 71,
    redditQuery: "biotech skincare microbiome beauty science",
    newsQuery: "biotech beauty skincare innovation",
    position: { x: 280, y: 900 },
    whyRelevant: "Consumer sophistication about ingredients is accelerating faster than most brands' R&D cycles. The brands that own efficacy narratives backed by biology command 3–5x premium pricing. Biotech is now table stakes for prestige positioning.",
    nextSteps: [
      "Audit your ingredient portfolio against microbiome, postbiotic, and exosome pipelines — identify one to pilot in the next NPD cycle",
      "Commission an independent clinical study on a hero ingredient; peer-reviewed data is becoming the minimum threshold for prestige credibility",
      "Map the regulatory status of your most innovative ingredients in key markets (EU, US, South Korea) — biotech ingredients face inconsistent global rules",
    ],
  },
  {
    id: "sustainable-materials",
    name: "Fashion Made From Air and Fungus",
    description: "Mycelium leather. Algae fibre. Carbon-captured nylon. A generation of radical materials is replacing conventional inputs — and making sustainability a design advantage, not a compromise.",
    color: "#FF6B35",
    relevanceScore: 74,
    redditQuery: "sustainable fashion materials mycelium algae",
    newsQuery: "sustainable bio-materials fashion innovation",
    position: { x: 900, y: 980 },
    whyRelevant: "EU Digital Product Passport regulation makes material traceability mandatory for all fashion sold in Europe from 2027. Brands caught greenwashing face fines up to €4M. The sustainable materials story must become supply-chain fact, not marketing copy.",
    nextSteps: [
      "Begin lifecycle analysis (LCA) for your top 5 materials before DPP compliance becomes mandatory in 2027",
      "Pilot one alternative material (mycelium, algae, or carbon-captured) in a limited collection to test consumer response and supply chain viability",
      "Audit your supplier tier 2 and tier 3 data — most brands can't answer basic DPP questions about their own supply chains",
    ],
  },
  {
    id: "3d-printing",
    name: "The Printer That Ate the Factory",
    description: "Zero inventory. No waste. Shoes in 45 minutes. 3D printing is rewriting the rules of fashion manufacturing — and the brands piloting it now are building an insurmountable lead.",
    color: "#00D4FF",
    relevanceScore: 61,
    redditQuery: "3D printing fashion footwear manufacturing",
    newsQuery: "3D printing fashion manufacturing",
    position: { x: 1500, y: 960 },
    whyRelevant: "3D printing solves fashion's two most expensive problems: overstock and speed-to-market. Early movers building IP in printable design accumulate a manufacturing and creative lead that compounds. The technology window for first-mover advantage is 18–36 months.",
    nextSteps: [
      "Identify one product category (accessories, footwear, eyewear) suitable for a 3D printing pilot and commission a cost comparison vs. traditional manufacturing",
      "Explore IP ownership structure for your digital design files — this is the new product archive",
      "Connect with Zellerfeld, Stratasys, or EOS for a design collaboration conversation on your highest-waste category",
    ],
  },
  {
    id: "wearables",
    name: "Your Body Is Now a Dashboard",
    description: "Rings, patches, and smart fabrics are turning health data into a continuous stream. The question isn't whether consumers will wear health tech — it's whether fashion brands will design it.",
    color: "#0066FF",
    relevanceScore: 67,
    redditQuery: "smart wearables health ring fitness tracker",
    newsQuery: "smart wearables health monitoring",
    position: { x: 1950, y: 820 },
    whyRelevant: "Health data is becoming a lifestyle accessory. Fashion brands that design beautiful wearable hardware will own a category that tech companies cannot win on aesthetics alone. The market is open and the consumer demand signal is unambiguous.",
    nextSteps: [
      "Commission consumer research: would your customer wear a health-tracking piece from your brand, and at what price point?",
      "Identify 2–3 health sensor companies (Valencell, MC10, Movella) for a co-design conversation on embedding sensors in existing product lines",
      "Study the Ray-Ban Meta case study in detail — the lesson is 'fashion-first, tech-second' and it's directly applicable to your brand",
    ],
  },
  {
    id: "neurotech",
    name: "Skincare for Your Nervous System",
    description: "Adaptogens in your serum. EEG-validated ingredients. Brain-computer interfaces on the horizon. Neurotechnology is quietly redefining what beauty and wellness products are supposed to do.",
    color: "#FF00C1",
    relevanceScore: 48,
    redditQuery: "neurotech BCI brain computer interface wellness",
    newsQuery: "neurotech consumer brain computer interface",
    position: { x: 460, y: 1480 },
    whyRelevant: "Neurotech is 3–7 years from consumer mainstream, but the brands that build literacy now will set the category agenda. Neurocosmetics, stress-responsive products, and biofeedback beauty are all nascent but growing at 40%+ annually.",
    nextSteps: [
      "Brief your R&D team on neurocosmetics ingredients (ashwagandha, l-theanine, lion's mane) and their regulatory status in your key markets",
      "Monitor Neuralink and consumer BCI timelines quarterly — build an internal briefing document now so the team isn't scrambling when it becomes mainstream news",
      "Map the overlap between your customer's existing wellness routines and stress management — this is the entry point for neurocosmetics positioning",
    ],
  },
  {
    id: "spatial-computing",
    name: "Shopping in a World That Doesn't Exist Yet",
    description: "Spatial commerce isn't the metaverse hype cycle — it's the quiet infrastructure being built right now inside Vision Pro apps and virtual showrooms. First-movers will own the format.",
    color: "#C8FF00",
    relevanceScore: 58,
    redditQuery: "spatial computing Apple Vision Pro metaverse",
    newsQuery: "spatial computing Apple Vision Pro brands",
    position: { x: 1100, y: 1500 },
    whyRelevant: "Spatial commerce is the next retail format. Brands establishing presence in Vision Pro and Galaxy XR now will own brand recall when the devices reach mass market. Net-a-Porter is already reporting 3x conversion vs. its standard app in spatial.",
    nextSteps: [
      "Greenlight a Vision Pro brand experience — even a minimal one — within the next 6 months to start building spatial design capability",
      "Assign one person to monitor spatial platform developments (visionOS updates, Samsung Galaxy XR, Decentraland) and circulate a monthly briefing",
      "Brief your 3D/design team on the additional requirements for spatial content vs. standard e-commerce assets",
    ],
  },
  {
    id: "longevity",
    name: "The Business of Never Getting Old",
    description: "Longevity isn't a niche biohacking obsession anymore — it's a mainstream cultural obsession with a $600B market attached. Every beauty, wellness, and lifestyle brand needs a position on it.",
    color: "#FF3333",
    relevanceScore: 73,
    redditQuery: "longevity anti-aging biohacking health",
    newsQuery: "longevity anti-ageing culture wellness",
    position: { x: 1750, y: 1460 },
    whyRelevant: "Longevity has moved from biohacker niche to mainstream with 400K-strong Reddit communities and Andrew Huberman at 8M YouTube subscribers. Every beauty, wellness, and lifestyle brand now competes in the longevity space whether they know it or not.",
    nextSteps: [
      "Reframe your brand's core product benefits through a longevity lens — 'protection', 'restoration', and 'biological age' are the new positioning vocabulary",
      "Commission consumer research on how your customer thinks about ageing, health optimisation, and biological vs. chronological age",
      "Identify one longevity clinic group or community for a strategic partnership — these are the new luxury wellness channels",
    ],
  },
];

export const SIGNALS: Signal[] = [
  // ─── AI & Generative Creativity ───────────────────────────────────────────
  {
    id: "ai-s1", trendId: "ai-creativity",
    title: "Midjourney used for luxury mood boards",
    summary: "Major fashion houses are using Midjourney and Adobe Firefly to generate seasonal mood boards and concept visuals, compressing 3-week creative processes into hours.",
    source: "news", sourceName: "Business of Fashion", sourceUrl: "https://businessoffashion.com",
    date: "2026-05-12", crossLinks: ["did-s2", "did-s4"],
  },
  {
    id: "ai-s2", trendId: "ai-creativity",
    title: "AI synthetic models in H&M campaigns",
    summary: "H&M and Levi's are deploying AI-generated models to diversify campaign imagery without photoshoots. Raises major questions around transparency and authenticity.",
    source: "news", sourceName: "Vogue Business", sourceUrl: "https://voguebusiness.com",
    date: "2026-04-28", crossLinks: ["did-s1"],
  },
  {
    id: "ai-s3", trendId: "ai-creativity",
    title: "Cala: AI from brief to tech pack",
    summary: "Cala's AI can take a concept brief and output production-ready tech packs. Early adopters report 60% faster development cycles.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-05-20", crossLinks: [],
  },
  {
    id: "ai-s4", trendId: "ai-creativity",
    title: "Designers fear displacement — r/femalefashionadvice",
    summary: "r/femalefashionadvice and r/malefashionadvice threads show growing anxiety among junior designers about AI replacing entry-level creative roles.",
    source: "reddit", sourceName: "r/femalefashionadvice", sourceUrl: "https://reddit.com/r/femalefashionadvice",
    date: "2026-06-01", crossLinks: [],
  },
  {
    id: "ai-s5", trendId: "ai-creativity",
    title: "AI trend forecasting vs WGSN",
    summary: "Startups like Heuritech and Trendalytics are using computer vision on social media to predict microtrends 6 months out — threatening traditional forecasting agencies.",
    source: "news", sourceName: "WWD", sourceUrl: "https://wwd.com",
    date: "2026-05-08", crossLinks: ["did-s3"],
  },
  {
    id: "ai-s6", trendId: "ai-creativity",
    title: "Sora video generation enters fashion film",
    summary: "OpenAI's Sora is being used by independent directors to produce fashion short films at near-zero budget. A Vogue-published film was entirely AI-generated.",
    source: "news", sourceName: "Vogue", sourceUrl: "https://vogue.com",
    date: "2026-05-30", crossLinks: [],
  },
  {
    id: "ai-s7", trendId: "ai-creativity",
    title: "Adobe Firefly: textile pattern generation at scale",
    summary: "Fashion studios are using Firefly's vector generation to produce print patterns in bulk. Hundreds of colourways in an afternoon — what took weeks now takes hours.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-06-09", crossLinks: ["ai-s3"],
  },
  {
    id: "ai-s8", trendId: "ai-creativity",
    title: "200 designers sue Stability AI for style theft",
    summary: "A coalition of 200 independent fashion designers filed a class action suit against Stability AI for training on their work without consent. Landmark case for creative IP.",
    source: "news", sourceName: "The Guardian", sourceUrl: "https://theguardian.com",
    date: "2026-06-11", crossLinks: [],
  },
  {
    id: "ai-s9", trendId: "ai-creativity",
    title: "AI colourway sampling cuts cost 70%",
    summary: "Brands using AI to generate and approve colourways virtually before physical sampling report 70% cost savings. Physical strike-offs are becoming the exception.",
    source: "news", sourceName: "Business of Fashion", sourceUrl: "https://businessoffashion.com",
    date: "2026-05-03", crossLinks: ["sus-s3"],
  },
  {
    id: "ai-s10", trendId: "ai-creativity",
    title: "Gen Z designers AI-native from day one — Parsons, CSM",
    summary: "Fashion school students at Parsons and CSM are submitting AI-generated portfolios. Educators are split on whether to embrace or ban. The generation has already decided.",
    source: "reddit", sourceName: "r/fashiondesign", sourceUrl: "https://reddit.com/r/fashiondesign",
    date: "2026-06-13", crossLinks: ["ai-s4"],
  },
  {
    id: "ai-s11", trendId: "ai-creativity",
    title: "CLO 3D + GPT: AI co-pilot for tech packs",
    summary: "CLO 3D's AI assistant auto-generates construction notes, BOM, and tolerances from a 3D garment. The technical designer role is being fundamentally redefined.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-04-17", crossLinks: [],
  },
  {
    id: "ai-s12", trendId: "ai-creativity",
    title: "AI-only fashion accounts hit 10M followers on Instagram",
    summary: "AI-only fashion accounts with no human creators are amassing huge followings. @AIRunway and @NeuralCouture generate daily AI looks that outperform human creator accounts in engagement.",
    source: "reddit", sourceName: "r/artificial", sourceUrl: "https://reddit.com/r/artificial",
    date: "2026-06-02", crossLinks: ["did-s5"],
  },
  {
    id: "ai-s13", trendId: "ai-creativity",
    title: "Midjourney v7: photorealistic fabric simulation",
    summary: "Midjourney v7's fabric simulation is photorealistic enough to fool buyers. First reports of returns from AI-generated product imagery appearing in consumer complaints.",
    source: "news", sourceName: "Wired", sourceUrl: "https://wired.com",
    date: "2026-06-14", crossLinks: [],
  },

  // ─── Digital Identity ──────────────────────────────────────────────────────
  {
    id: "did-s1", trendId: "digital-identity",
    title: "DressX passes 4M digital garments sold",
    summary: "Digital fashion platform DressX has passed 4M digital garment sales. Consumers are spending real money on clothes they'll only wear in photos and online.",
    source: "news", sourceName: "Vogue Business", sourceUrl: "https://voguebusiness.com",
    date: "2026-05-15", crossLinks: ["ai-s2", "arc-s1"],
  },
  {
    id: "did-s2", trendId: "digital-identity",
    title: "Balenciaga, Gucci, Burberry all active inside Fortnite",
    summary: "Luxury fashion's entry into gaming is deepening. Balenciaga, Gucci and Burberry have active in-game presences with millions of digital item sales across platforms.",
    source: "reddit", sourceName: "r/gaming", sourceUrl: "https://reddit.com/r/gaming",
    date: "2026-04-10", crossLinks: ["ai-s1", "spc-s1"],
  },
  {
    id: "did-s3", trendId: "digital-identity",
    title: "Avatar appearance carries same social weight as physical dress — arXiv study",
    summary: "Research from Stanford shows Gen Z treats avatar appearance with the same social weight as physical dress. Digital exclusives create identical scarcity dynamics to limited physical drops.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-03-22", crossLinks: ["ai-s5"],
  },
  {
    id: "did-s4", trendId: "digital-identity",
    title: "Ready Player Me: 40M avatars across 10,000 apps",
    summary: "Cross-platform avatar system Ready Player Me has 40M avatars across 10,000 apps. A universal digital self is becoming infrastructure, not novelty.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-05-30", crossLinks: ["ai-s1", "spc-s3"],
  },
  {
    id: "did-s5", trendId: "digital-identity",
    title: "YouTube 'fit check' format spawns virtual variant — 2B+ views",
    summary: "YouTube's fit-check video format — 2B+ views — is spawning a virtual variant where creators style their digital avatars and rate digital-only outfits.",
    source: "youtube", sourceName: "YouTube Trends", sourceUrl: "https://youtube.com",
    date: "2026-06-05", crossLinks: ["arc-s2"],
  },
  {
    id: "did-s6", trendId: "digital-identity",
    title: "Roblox pays fashion creators $100M in UGC earnings",
    summary: "Roblox has paid fashion creators $100M in UGC earnings. Teen designers are running real fashion businesses inside games — a generation learning commerce through play.",
    source: "news", sourceName: "Bloomberg", sourceUrl: "https://bloomberg.com",
    date: "2026-05-26", crossLinks: ["spc-s1"],
  },
  {
    id: "did-s7", trendId: "digital-identity",
    title: "Digital fashion NFTs: quiet comeback with utility hooks",
    summary: "After the 2022 collapse, digital fashion NFTs are returning with utility — exclusive access, physical twins, and brand loyalty programmes attached to ownership.",
    source: "reddit", sourceName: "r/web3fashion", sourceUrl: "https://reddit.com/r/web3",
    date: "2026-05-19", crossLinks: [],
  },

  // ─── AR / VR Commerce ─────────────────────────────────────────────────────
  {
    id: "arc-s1", trendId: "ar-commerce",
    title: "Snap AR try-on reaches 250M users — 2.4x purchase intent",
    summary: "Snap's AR try-on tool has reached 250M users. Brands report 2.4x higher purchase intent and 30% lower return rates for AR-viewed products.",
    source: "news", sourceName: "TechCrunch", sourceUrl: "https://techcrunch.com",
    date: "2026-05-18", crossLinks: ["did-s1", "spc-s2"],
  },
  {
    id: "arc-s2", trendId: "ar-commerce",
    title: "Nike, Net-a-Porter launch spatial flagship on Vision Pro",
    summary: "Nike, Porsche and Net-a-Porter have launched spatial commerce experiences on Vision Pro. Immersive retail is becoming a serious brand channel.",
    source: "news", sourceName: "Dezeen", sourceUrl: "https://dezeen.com",
    date: "2026-04-22", crossLinks: ["did-s5", "spc-s1"],
  },
  {
    id: "arc-s3", trendId: "ar-commerce",
    title: "L'Oréal + Sephora AR makeup: 70% conversion vs 40% without",
    summary: "L'Oréal and Sephora's AR makeup try-on is reducing beauty purchase uncertainty. 70% of users who try AR convert versus 40% without — the ROI case is indisputable.",
    source: "news", sourceName: "Vogue Business", sourceUrl: "https://voguebusiness.com",
    date: "2026-05-02", crossLinks: ["bio-s1"],
  },
  {
    id: "arc-s4", trendId: "ar-commerce",
    title: "AR fatigue emerging — r/malefashionadvice",
    summary: "r/malefashionadvice discussing 'AR try-on fatigue' — the gap between realistic AR preview and actual product is creating a new form of buyer disappointment.",
    source: "reddit", sourceName: "r/malefashionadvice", sourceUrl: "https://reddit.com/r/malefashionadvice",
    date: "2026-06-08", crossLinks: [],
  },
  {
    id: "arc-s5", trendId: "ar-commerce",
    title: "ORDRE and NuOrder: 40% of buyers now prefer virtual showrooms",
    summary: "B2B fashion is adopting virtual showrooms. ORDRE and NuOrder report 40% of wholesale buyers now prefer virtual to physical showroom visits.",
    source: "news", sourceName: "WWD", sourceUrl: "https://wwd.com",
    date: "2026-05-25", crossLinks: ["spc-s2"],
  },
  {
    id: "arc-s6", trendId: "ar-commerce",
    title: "Pinterest AR try-on rolls out to 300M users",
    summary: "Pinterest's AR try-on for jewellery, sunglasses and now clothing has 300M monthly users. Discovery-to-purchase in a single AR session is now possible.",
    source: "news", sourceName: "TechCrunch", sourceUrl: "https://techcrunch.com",
    date: "2026-06-06", crossLinks: ["did-s5"],
  },
  {
    id: "arc-s7", trendId: "ar-commerce",
    title: "Zalando: AR-previewed items return at 18% vs 38% industry average",
    summary: "Zalando's internal data shows AR-previewed items return at 18% vs 38% industry average. The ROI case for AR investment is now indisputable.",
    source: "news", sourceName: "Vogue Business", sourceUrl: "https://voguebusiness.com",
    date: "2026-04-20", crossLinks: [],
  },
  {
    id: "arc-s8", trendId: "ar-commerce",
    title: "50+ DTC brands deploy IKEA Place-style 'see it on your body' AR",
    summary: "IKEA Place's 'see it in your home' model is being cloned for fashion. 'See it on your body' AR integrations are arriving in 50+ DTC brands via white-label SDK.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-05-07", crossLinks: [],
  },

  // ─── Biotech Beauty ───────────────────────────────────────────────────────
  {
    id: "bio-s1", trendId: "biotech-beauty",
    title: "L'Oréal + Poietis: bioprinted skin replaces 30% of animal testing",
    summary: "L'Oréal's partnership with Poietis for bioprinted skin has replaced 30% of animal testing. EU cosmetics regulation is accelerating this shift across the industry.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-04-14", crossLinks: ["arc-s3", "lon-s2"],
  },
  {
    id: "bio-s2", trendId: "biotech-beauty",
    title: "Gallinée raises $20M — microbiome skincare goes mainstream",
    summary: "Microbiome-focused skincare brand Gallinée raised $20M to scale. Consumer familiarity with 'good bacteria' from gut health is unlocking the skin market.",
    source: "news", sourceName: "Business of Fashion", sourceUrl: "https://businessoffashion.com",
    date: "2026-05-06", crossLinks: ["lon-s1"],
  },
  {
    id: "bio-s3", trendId: "biotech-beauty",
    title: "Fermentation actives overtake synthetics on r/SkincareAddiction",
    summary: "K-beauty's fermentation techniques are going global. Fermented ingredients (galactomyces, bifida) outperform synthetics in community recommendations on r/SkincareAddiction.",
    source: "reddit", sourceName: "r/SkincareAddiction", sourceUrl: "https://reddit.com/r/SkincareAddiction",
    date: "2026-05-29", crossLinks: [],
  },
  {
    id: "bio-s4", trendId: "biotech-beauty",
    title: "AI + microbiome analysis = personalised serum on demand",
    summary: "Startups are combining skin microbiome analysis with AI to formulate personalised serums on demand — a subscription skincare that evolves with your skin biology.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-06-02", crossLinks: ["ai-s3"],
  },
  {
    id: "bio-s5", trendId: "biotech-beauty",
    title: "Ashwagandha, reishi, lion's mane appearing in topical skincare formulas",
    summary: "Adaptogens from wellness are appearing in topical formulas. The wellness-to-beauty ingredient pipeline is accelerating as consumer crossover between supplement and skincare culture deepens.",
    source: "news", sourceName: "Allure", sourceUrl: "https://allure.com",
    date: "2026-05-11", crossLinks: ["neu-s2", "lon-s3"],
  },
  {
    id: "bio-s6", trendId: "biotech-beauty",
    title: "Geltor lab-grown collagen: animal-free, identical performance",
    summary: "Geltor and Modern Meadow are producing collagen via precision fermentation — identical to bovine but animal-free. High-end brands already formulating with it for 2027 launches.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-04-01", crossLinks: ["lon-s2"],
  },
  {
    id: "bio-s7", trendId: "biotech-beauty",
    title: "Exosome serums: stem cell tech crosses into $400+ consumer beauty",
    summary: "Exosomes — cell-derived vesicles from regenerative medicine — are appearing in $400+ serums. Backed by clinical data, but the regulatory grey zone is narrowing fast.",
    source: "news", sourceName: "Allure", sourceUrl: "https://allure.com",
    date: "2026-05-24", crossLinks: ["lon-s2"],
  },
  {
    id: "bio-s8", trendId: "biotech-beauty",
    title: "Postbiotics: the ingredient category after probiotics",
    summary: "Postbiotics (metabolic byproducts of probiotics) are the emerging hero ingredient. More stable than live cultures, with stronger clinical backing. r/SkincareAddiction is driving mainstream awareness.",
    source: "reddit", sourceName: "r/SkincareAddiction", sourceUrl: "https://reddit.com/r/SkincareAddiction",
    date: "2026-06-08", crossLinks: ["bio-s3"],
  },
  {
    id: "bio-s9", trendId: "biotech-beauty",
    title: "Ginkgo Bioworks uses CRISPR to design novel fragrance molecules",
    summary: "Ginkgo Bioworks is using synthetic biology to design fragrance molecules impossible to source naturally. Luxury perfumers including LVMH fragrance houses are early adopters.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-03-18", crossLinks: ["sus-s1"],
  },
  {
    id: "bio-s10", trendId: "biotech-beauty",
    title: "r/DIYBeauty meets biohacking: users sourcing peptides and growth factors directly",
    summary: "DIY skincare communities are cross-pollinating with biohacking — users attempting to source peptides, retinoids, and growth factors directly from research suppliers. Safety and regulatory concerns are rising.",
    source: "reddit", sourceName: "r/DIYBeauty", sourceUrl: "https://reddit.com/r/DIYBeauty",
    date: "2026-05-18", crossLinks: ["neu-s4"],
  },

  // ─── Sustainable Materials ────────────────────────────────────────────────
  {
    id: "sus-s1", trendId: "sustainable-materials",
    title: "Bolt Threads Mylo adopted by Hermès and Stella McCartney",
    summary: "Mylo mycelium leather has been adopted by Hermès and Stella McCartney. First commercial-scale production run sold out in 48 hours.",
    source: "news", sourceName: "Dezeen", sourceUrl: "https://dezeen.com",
    date: "2026-04-05", crossLinks: ["3dp-s3"],
  },
  {
    id: "sus-s2", trendId: "sustainable-materials",
    title: "Algaeing secures three fashion group partnerships for algae-based fibre",
    summary: "Algaeing has secured three fashion group partnerships to replace synthetic dyes and fibres with algae-based alternatives. Production is carbon-negative.",
    source: "news", sourceName: "Fast Company", sourceUrl: "https://fastcompany.com",
    date: "2026-05-17", crossLinks: ["3dp-s2"],
  },
  {
    id: "sus-s3", trendId: "sustainable-materials",
    title: "Greenwashing fatigue: consumers demanding LCA data, not 'recycled' labels",
    summary: "r/SustainableFashion community discussions show increasing consumer sophistication — demanding lifecycle analysis (LCA) data, not just recycled labels.",
    source: "reddit", sourceName: "r/SustainableFashion", sourceUrl: "https://reddit.com/r/SustainableFashion",
    date: "2026-06-03", crossLinks: [],
  },
  {
    id: "sus-s4", trendId: "sustainable-materials",
    title: "AirCarbon (greenhouse-gas-captured plastic) entering fashion production",
    summary: "Newlight Technologies' AirCarbon, made from captured greenhouse gas, is entering fashion production. Dell and IKEA already use it at scale. Fashion brands are piloting.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-04-30", crossLinks: ["3dp-s1"],
  },
  {
    id: "sus-s5", trendId: "sustainable-materials",
    title: "Material science creators boom — 'Material Matters' hits 2M subscribers",
    summary: "Channels explaining biomaterials and sustainable chemistry are exploding. Material Matters has 2M subscribers, signalling consumer hunger for materials literacy.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-05-24", crossLinks: [],
  },
  {
    id: "sus-s6", trendId: "sustainable-materials",
    title: "Piñatex moves into Nike mainline — 100K unit run sells out",
    summary: "Ananas Anam's Piñatex (pineapple leaf leather) has moved from niche to Nike mainline. First 100K unit run sold out within days, triggering rapid capacity expansion.",
    source: "news", sourceName: "Fast Company", sourceUrl: "https://fastcompany.com",
    date: "2026-05-05", crossLinks: [],
  },
  {
    id: "sus-s7", trendId: "sustainable-materials",
    title: "Econyl regenerated nylon from ocean plastic enters Gucci and Valentino",
    summary: "Prada Re-Nylon and Econyl's regenerated nylon from ocean plastic is entering Gucci and Valentino mainline collections. Premium sustainability is losing its contradiction.",
    source: "news", sourceName: "Dezeen", sourceUrl: "https://dezeen.com",
    date: "2026-04-26", crossLinks: ["sus-s3"],
  },
  {
    id: "sus-s8", trendId: "sustainable-materials",
    title: "Colorifix raises $30M for carbon-negative biological dyeing",
    summary: "Colorifix's biological dyeing process uses 50x less water and is carbon-negative. Post-Series B with Adidas and M&S as active pilots.",
    source: "news", sourceName: "Business of Fashion", sourceUrl: "https://businessoffashion.com",
    date: "2026-06-03", crossLinks: [],
  },
  {
    id: "sus-s9", trendId: "sustainable-materials",
    title: "EU Digital Product Passport: mandatory material traceability from 2027",
    summary: "EU Digital Product Passport regulation mandates material traceability for all fashion sold in Europe from 2027. Brands scrambling to comply — most cannot answer basic DPP questions.",
    source: "news", sourceName: "WWD", sourceUrl: "https://wwd.com",
    date: "2026-05-28", crossLinks: ["sus-s3", "sus-s4"],
  },

  // ─── 3D Printing ──────────────────────────────────────────────────────────
  {
    id: "3dp-s1", trendId: "3d-printing",
    title: "Zellerfeld 3D-printing fully recyclable shoes in 45 minutes",
    summary: "Zellerfeld is 3D-printing fully recyclable shoes in 45 minutes per pair. ASICS and New Balance are in pilot programmes. The factory model is under threat.",
    source: "news", sourceName: "Wired", sourceUrl: "https://wired.com",
    date: "2026-04-18", crossLinks: ["sus-s4"],
  },
  {
    id: "3dp-s2", trendId: "3d-printing",
    title: "Multi-material FDM printing breaks the fashion flexibility barrier",
    summary: "New multi-material FDM printers combine rigid and flexible filaments in one print — solving the wearability problem that blocked fashion 3D printing for a decade.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-05-03", crossLinks: ["sus-s2"],
  },
  {
    id: "3dp-s3", trendId: "3d-printing",
    title: "Iris van Herpen AW26: 100% 3D printed, in 8 major museums",
    summary: "Van Herpen's AW26 collection was 100% 3D printed. Acquired by 8 major museums. 3D printing is now legitimate couture, not novelty.",
    source: "news", sourceName: "Dezeen", sourceUrl: "https://dezeen.com",
    date: "2026-03-30", crossLinks: ["sus-s1"],
  },
  {
    id: "3dp-s4", trendId: "3d-printing",
    title: "r/3Dprinting x r/fashiondesign: DIY accessory community exploding",
    summary: "r/3Dprinting and r/fashiondesign crossover communities are growing rapidly. Consumers designing and printing their own accessories at home represent a new form of fashion production.",
    source: "reddit", sourceName: "r/3Dprinting", sourceUrl: "https://reddit.com/r/3Dprinting",
    date: "2026-05-28", crossLinks: [],
  },
  {
    id: "3dp-s5", trendId: "3d-printing",
    title: "Custom 3D-printed makeup applicators shaped to individual face profiles",
    summary: "Niche brands offering custom 3D-printed makeup applicators shaped to individual lip and face profiles. Small but signals a personalisation wave.",
    source: "news", sourceName: "Allure", sourceUrl: "https://allure.com",
    date: "2026-06-07", crossLinks: ["bio-s4"],
  },

  // ─── Wearables ────────────────────────────────────────────────────────────
  {
    id: "wear-s1", trendId: "wearables",
    title: "Oura Ring Gen 4 sells 2M units — health rings go mainstream",
    summary: "Oura Ring Gen 4 sold 2M units in 2025. Health rings are mainstream accessories — the question is whether fashion brands can design into this form factor before tech companies own it aesthetically.",
    source: "news", sourceName: "TechCrunch", sourceUrl: "https://techcrunch.com",
    date: "2026-04-08", crossLinks: ["lon-s1", "neu-s1"],
  },
  {
    id: "wear-s2", trendId: "wearables",
    title: "Google x Levi's Jacquard: gesture control and health sensing in denim",
    summary: "Jacquard by Google's latest iteration integrates gesture control and health sensing into standard denim weaves. The tech is invisible — just denim.",
    source: "news", sourceName: "Wired", sourceUrl: "https://wired.com",
    date: "2026-05-14", crossLinks: ["neu-s3"],
  },
  {
    id: "wear-s3", trendId: "wearables",
    title: "CGM patches worn openly as health status signals — fashion brands take note",
    summary: "CGM patches (Abbott Libre, Dexcom) are being worn openly as health signals. Fashion brands are exploring decorative patch covers — a new category emerging from medical devices.",
    source: "reddit", sourceName: "r/diabetes_t1", sourceUrl: "https://reddit.com/r/diabetes_t1",
    date: "2026-06-04", crossLinks: ["lon-s2"],
  },
  {
    id: "wear-s4", trendId: "wearables",
    title: "Wearable hauls replacing tech reviews on YouTube",
    summary: "Health wearable unboxings and reviews are merging with fashion haul culture on YouTube. Creators are styling Oura, Whoop, and patches as accessories, not gadgets.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-05-31", crossLinks: [],
  },
  {
    id: "wear-s5", trendId: "wearables",
    title: "Tag Heuer + Movado embedding health monitoring in luxury jewellery",
    summary: "Tag Heuer, Movado, and emerging jewellery brands are partnering with sensor companies to embed health monitoring in luxury jewellery. A new price-point opportunity opens.",
    source: "news", sourceName: "Bloomberg", sourceUrl: "https://bloomberg.com",
    date: "2026-05-09", crossLinks: ["lon-s1"],
  },
  {
    id: "wear-s6", trendId: "wearables",
    title: "Ray-Ban Meta success is about aesthetics, not AI — the lesson for fashion",
    summary: "Ray-Ban Meta's success is less about AI features and more about looking like sunglasses. The lesson for fashion brands: wearable tech must be fashion first, always.",
    source: "news", sourceName: "Wired", sourceUrl: "https://wired.com",
    date: "2026-04-15", crossLinks: ["did-s1"],
  },
  {
    id: "wear-s7", trendId: "wearables",
    title: "Neutrogena x L'Oréal race to own UV tracking patch market",
    summary: "UV monitoring skin patches are becoming fashion accessories. Branded patch covers from suncare companies signal a new wearable-beauty category forming at the intersection of fashion and health.",
    source: "news", sourceName: "Allure", sourceUrl: "https://allure.com",
    date: "2026-05-20", crossLinks: ["bio-s7"],
  },
  {
    id: "wear-s8", trendId: "wearables",
    title: "Femtech wearables growing 200% YoY — fastest category in health tech",
    summary: "Menstrual cycle health tracking wearables (Emmaline, Tempdrop) are growing 200% YoY. Femtech is the fastest growing wearable category and largely ignored by fashion.",
    source: "news", sourceName: "TechCrunch", sourceUrl: "https://techcrunch.com",
    date: "2026-06-01", crossLinks: ["lon-s3"],
  },
  {
    id: "wear-s9", trendId: "wearables",
    title: "Eight Sleep Pod Pro at $3K+ appearing in fashion editorials",
    summary: "Sleep optimisation devices are becoming lifestyle status symbols. Eight Sleep's Pod Pro at $3K+ is crossing from bedroom to fashion editorial — sleep tech as luxury.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-05-13", crossLinks: ["lon-s2"],
  },
  {
    id: "wear-s10", trendId: "wearables",
    title: "LVMH + Kering embed NFC authentication chips in stitching",
    summary: "LVMH and Kering are embedding NFC chips in stitching for provenance verification. The chip also unlocks loyalty experiences — new owner registration triggers brand interactions.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-04-28", crossLinks: ["did-s7"],
  },
  {
    id: "wear-s11", trendId: "wearables",
    title: "r/wearables: users sacrifice 20% of features for better design",
    summary: "r/wearables community survey shows users would sacrifice 20% of features for better aesthetics. The data that doesn't get worn is worthless — fashion brands have a structural advantage.",
    source: "reddit", sourceName: "r/wearables", sourceUrl: "https://reddit.com/r/wearables",
    date: "2026-06-12", crossLinks: [],
  },

  // ─── Neurotech ────────────────────────────────────────────────────────────
  {
    id: "neu-s1", trendId: "neurotech",
    title: "Muse EEG headband: 500K active users, meditation goes biometric",
    summary: "Muse's EEG headband has 500K active users. Meditation and stress measurement is becoming data-driven — opening neurocosmetics and stress-responsive product categories.",
    source: "news", sourceName: "MIT Technology Review", sourceUrl: "https://technologyreview.com",
    date: "2026-04-25", crossLinks: ["wear-s1", "lon-s3"],
  },
  {
    id: "neu-s2", trendId: "neurotech",
    title: "Neurocosmetics: brands formulating products targeting the nervous system",
    summary: "Brands are formulating products that target the nervous system — adaptogens, ashwagandha, and EEG-validated ingredients for 'skin stress response' as a clinical category.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-05-19", crossLinks: ["bio-s5"],
  },
  {
    id: "neu-s3", trendId: "neurotech",
    title: "Neuralink human trials: reading and writing brain signals confirmed",
    summary: "Neuralink's human trials show bidirectional reading/writing capability. Consumer applications are 5+ years away but the cultural conversation is now — brands should build literacy.",
    source: "news", sourceName: "Wired", sourceUrl: "https://wired.com",
    date: "2026-03-15", crossLinks: ["wear-s2"],
  },
  {
    id: "neu-s4", trendId: "neurotech",
    title: "r/nootropics and beauty cross-pollinating — 'skin stack' terminology emerges",
    summary: "Cognitive enhancement community discussions increasingly bleed into skincare and beauty — 'skin stack' terminology borrowed from supplement culture is entering mainstream beauty vocabulary.",
    source: "reddit", sourceName: "r/nootropics", sourceUrl: "https://reddit.com/r/nootropics",
    date: "2026-05-27", crossLinks: ["bio-s5"],
  },
  {
    id: "neu-s5", trendId: "neurotech",
    title: "Calm hits 150M users — neurowellness becomes daily ritual",
    summary: "Calm (150M users) and Headspace are normalising daily neurowellness routines. Brands that connect to this ritual have a powerful behaviour anchor for product integration.",
    source: "news", sourceName: "Fast Company", sourceUrl: "https://fastcompany.com",
    date: "2026-04-19", crossLinks: ["lon-s3"],
  },

  // ─── Spatial Computing ────────────────────────────────────────────────────
  {
    id: "spc-s1", trendId: "spatial-computing",
    title: "Apple Vision Pro hits 2M units — spatial app ecosystem growing",
    summary: "Vision Pro hit 2M units in 18 months — slower than iPhone but faster than iPad. Spatial app ecosystem is growing. Fashion brands building experiences now get first-mover advantage.",
    source: "news", sourceName: "Bloomberg", sourceUrl: "https://bloomberg.com",
    date: "2026-05-21", crossLinks: ["did-s2", "arc-s2"],
  },
  {
    id: "spc-s2", trendId: "spatial-computing",
    title: "Net-a-Porter Vision Pro app: 3x conversion vs standard app",
    summary: "Net-a-Porter's Vision Pro app lets users browse a life-size virtual boutique. Conversion rate is 3x their standard app — presence and scale matter in spatial commerce.",
    source: "news", sourceName: "Vogue Business", sourceUrl: "https://voguebusiness.com",
    date: "2026-05-16", crossLinks: ["arc-s1", "arc-s5"],
  },
  {
    id: "spc-s3", trendId: "spatial-computing",
    title: "Open Metaverse ID: a persistent digital self across all platforms",
    summary: "Cross-platform avatar standards (Open Metaverse ID, Ready Player Me) are enabling a persistent digital self. Your digital identity follows you across games, apps, and workplaces.",
    source: "hackernews", sourceName: "Hacker News", sourceUrl: "https://news.ycombinator.com",
    date: "2026-06-01", crossLinks: ["did-s4"],
  },
  {
    id: "spc-s4", trendId: "spatial-computing",
    title: "visionOS tutorials up 400% YoY — spatial creator category emerges",
    summary: "A new creator category is emerging: spatial experience designers. YouTube tutorials on visionOS development are up 400% YoY as the platform matures.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-05-27", crossLinks: [],
  },
  {
    id: "spc-s5", trendId: "spatial-computing",
    title: "r/VisionPro: power users building vs mainstream users returning devices",
    summary: "r/VisionPro shows a split community: power users building spatial workflows vs mainstream users returning devices. The use case gap is real and brand experiences need to solve it.",
    source: "reddit", sourceName: "r/VisionPro", sourceUrl: "https://reddit.com/r/VisionPro",
    date: "2026-06-09", crossLinks: [],
  },
  {
    id: "spc-s6", trendId: "spatial-computing",
    title: "Samsung Galaxy XR at $999 forces fashion brands onto two spatial platforms",
    summary: "Samsung's Android XR headset at $999 opens spatial computing to a broader audience. Fashion brands must now design for two competing spatial platforms simultaneously.",
    source: "news", sourceName: "TechCrunch", sourceUrl: "https://techcrunch.com",
    date: "2026-05-29", crossLinks: ["arc-s2"],
  },
  {
    id: "spc-s7", trendId: "spatial-computing",
    title: "Decentraland Fashion Week 2026: 2M virtual attendees, Valentino + Diesel host",
    summary: "Decentraland's 2026 Fashion Week drew 2M virtual attendees. Valentino and Diesel hosted spatial shows. The format is maturing from gimmick to genuine brand channel.",
    source: "news", sourceName: "Vogue Business", sourceUrl: "https://voguebusiness.com",
    date: "2026-03-25", crossLinks: ["did-s2", "spc-s1"],
  },
  {
    id: "spc-s8", trendId: "spatial-computing",
    title: "Dolby Atmos spatial audio + fashion shows: immersive front-row post-show",
    summary: "Spatial audio is being layered onto fashion show recordings for Vision Pro — creating immersive front-row experiences available post-show to anyone with a headset.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-04-30", crossLinks: [],
  },

  // ─── Longevity ────────────────────────────────────────────────────────────
  {
    id: "lon-s1", trendId: "longevity",
    title: "Bryan Johnson Blueprint: $2M/year protocol spawns mass-market version",
    summary: "Bryan Johnson's extreme longevity protocol has spawned a mass-market version. Supplement brands, beauty lines, and wearable companies are all 'longevity' branding now.",
    source: "news", sourceName: "Wired", sourceUrl: "https://wired.com",
    date: "2026-04-12", crossLinks: ["bio-s2", "wear-s1", "wear-s5"],
  },
  {
    id: "lon-s2", trendId: "longevity",
    title: "Senolytics (quercetin, fisetin) entering premium skincare formulation",
    summary: "Senolytic compounds backed by peer-reviewed research — not just marketing language — are entering premium skincare. A new functional anti-ageing category is forming.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-05-04", crossLinks: ["bio-s1", "wear-s3"],
  },
  {
    id: "lon-s3", trendId: "longevity",
    title: "Longevity clinics: $10B industry by 2028, opening in every major city",
    summary: "Longevity clinics offering NAD+ drips, epigenetic testing, and personalised protocols are opening in every major city. A new luxury health category with fashion brand adjacency.",
    source: "news", sourceName: "Bloomberg", sourceUrl: "https://bloomberg.com",
    date: "2026-05-22", crossLinks: ["bio-s5", "neu-s1", "neu-s5"],
  },
  {
    id: "lon-s4", trendId: "longevity",
    title: "r/longevity hits 400K members — demanding, literate, brand-skeptical",
    summary: "r/longevity has 400K members discussing supplements, protocols, and research. It's consumer-driven longevity science — highly demanding and deeply skeptical of marketing claims.",
    source: "reddit", sourceName: "r/longevity", sourceUrl: "https://reddit.com/r/longevity",
    date: "2026-06-06", crossLinks: [],
  },
  {
    id: "lon-s5", trendId: "longevity",
    title: "Huberman, Attia, Patrick collectively surpass fitness creators in YouTube views",
    summary: "Andrew Huberman, Peter Attia, and Rhonda Patrick have collectively surpassed traditional fitness creators. Longevity content is the new wellness genre — and its audience buys differently.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-05-13", crossLinks: [],
  },
  {
    id: "lon-s6", trendId: "longevity",
    title: "Off-label rapamycin prescriptions up 400% at US longevity clinics",
    summary: "Off-label rapamycin prescriptions for longevity are up 400% in US longevity clinics. A transplant rejection drug is becoming a lifestyle supplement for the upper-middle class.",
    source: "arxiv", sourceName: "arXiv", sourceUrl: "https://arxiv.org",
    date: "2026-04-07", crossLinks: ["lon-s3"],
  },
  {
    id: "lon-s7", trendId: "longevity",
    title: "TruDiagnostic biological age tests available DTC for $200",
    summary: "Biological age tests (TruAge, Elysium Index) are now available DTC for $200. Consumers are tracking biological vs chronological age — a new performance metric for wellness brands.",
    source: "news", sourceName: "Bloomberg", sourceUrl: "https://bloomberg.com",
    date: "2026-05-01", crossLinks: ["wear-s1"],
  },
  {
    id: "lon-s8", trendId: "longevity",
    title: "500K cold plunge tubs sold — recovery culture is the new fitness culture",
    summary: "Plunge and Polar Monkeys have sold 500K cold plunge tubs. From biohacker niche to suburban backyard staple in 18 months. Recovery culture is the new fitness culture.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-05-19", crossLinks: ["neu-s1"],
  },
  {
    id: "lon-s9", trendId: "longevity",
    title: "VO2 max scores shared on social as health status signals",
    summary: "VO2 max scores are being shared on social media as health status signals. Apple Watch adding VO2 max to watch faces. Fitness data is the new luxury flex.",
    source: "reddit", sourceName: "r/longevity", sourceUrl: "https://reddit.com/r/longevity",
    date: "2026-06-08", crossLinks: ["wear-s4"],
  },
  {
    id: "lon-s10", trendId: "longevity",
    title: "Beauty-from-within collagen supplements: $8B category by 2027",
    summary: "Ingestible collagen supplements are the fastest-growing beauty category. Vital Proteins (now Nestlé) signals that food is the new skincare — and the market will be $8B by 2027.",
    source: "news", sourceName: "Business of Fashion", sourceUrl: "https://businessoffashion.com",
    date: "2026-04-23", crossLinks: ["bio-s6"],
  },
  {
    id: "lon-s11", trendId: "longevity",
    title: "NAD+ drip bars opening next to concept stores in Milan, NYC, Seoul",
    summary: "IV therapy and NAD+ drip bars are opening next to concept stores in key fashion capitals. Luxury wellness experiences are becoming part of fashion retail neighbourhoods.",
    source: "news", sourceName: "Vogue", sourceUrl: "https://vogue.com",
    date: "2026-05-08", crossLinks: ["lon-s3"],
  },
  {
    id: "lon-s12", trendId: "longevity",
    title: "Bakuchiol, HPR, retinaldehyde race to replace retinol",
    summary: "Bakuchiol, HPR, and retinaldehyde are competing to replace retinol. The skincare industry is in active ingredient upheaval — whoever wins the replacement race gets a decade of market share.",
    source: "news", sourceName: "Allure", sourceUrl: "https://allure.com",
    date: "2026-06-05", crossLinks: ["bio-s7"],
  },
  {
    id: "lon-s13", trendId: "longevity",
    title: "Centenarian lifestyle content hits 300M views/month on YouTube",
    summary: "Content following the daily routines of 100+ year-olds is exploding. Okinawan diet, Sardinian movement patterns, and Seventh-Day Adventist habits are now mainstream consumer topics.",
    source: "youtube", sourceName: "YouTube", sourceUrl: "https://youtube.com",
    date: "2026-06-01", crossLinks: [],
  },
];

// Compute positions for all signal nodes orbiting their parent trend
export function computeLayout(): {
  trends: (Trend & { radius: number })[];
  signalPositions: Map<string, { x: number; y: number }>;
} {
  const MIN_RADIUS = 55;
  const MAX_RADIUS = 110;
  const ORBIT_PADDING = 200;
  const SIGNAL_W = 190;
  const SIGNAL_H = 64;

  const signalPositions = new Map<string, { x: number; y: number }>();
  const trends = TRENDS.map((t) => {
    const radius = MIN_RADIUS + (t.relevanceScore / 100) * (MAX_RADIUS - MIN_RADIUS);
    const signals = SIGNALS.filter((s) => s.trendId === t.id);
    const orbitRadius = radius + ORBIT_PADDING;
    signals.forEach((sig, i) => {
      const angle = (2 * Math.PI * i) / signals.length - Math.PI / 2;
      const x = t.position.x + orbitRadius * Math.cos(angle) - SIGNAL_W / 2;
      const y = t.position.y + orbitRadius * Math.sin(angle) - SIGNAL_H / 2;
      signalPositions.set(sig.id, { x, y });
    });
    return { ...t, radius };
  });

  return { trends, signalPositions };
}

export function getSourceIcon(source: Signal["source"]): string {
  return {
    reddit: "🔴",
    news: "📰",
    youtube: "▶️",
    arxiv: "🔬",
    hackernews: "🟠",
    manual: "✦",
  }[source ?? "manual"] ?? "✦";
}
