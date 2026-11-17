export interface ServiceDetailData {
  slug: string;
  number: string;
  category: string;
  heroHeading: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage: string;
  heroImageObjectPos?: string;
  whatWeDesignEyebrow: string;
  whatWeDesignHeading: string;
  whatWeDesignHighlight: string;
  features: {
    number: string;
    title: string;
    description: string;
    image: string;
    imageObjectPos?: string;
  }[];
  deliverablesEyebrow: string;
  deliverablesHeading: string;
  deliverablesHighlight: string;
  deliverablesImage: string;
  deliverablesImageObjectPos?: string;
  deliverablesList: {
    number: string;
    title: string;
    description: string;
  }[];
  processHeading: string;
  processSteps: {
    number: string;
    title: string;
    description: string;
  }[];
  faqSubtitle: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
}

export const servicesData: Record<string, ServiceDetailData> = {
  'brand-architecture-identity-systems': {
    slug: 'brand-architecture-identity-systems',
    number: '01',
    category: 'BRAND STRATEGY',
    heroHeading: 'BRAND ARCHITECTURE &',
    heroHighlight: 'IDENTITY SYSTEMS.',
    heroDescription: 'Define what your brand stands for and build a visual system that makes it recognizable everywhere.',
    heroImage: '/images/brand-hero-hd.jpg',
    heroImageObjectPos: 'right center',
    whatWeDesignEyebrow: 'WHAT WE DESIGN',
    whatWeDesignHeading: 'ONE IDENTITY.',
    whatWeDesignHighlight: 'EVERY TOUCHPOINT.',
    features: [
      {
        number: '01',
        title: 'SOCIAL MEDIA & AD CREATIVES',
        description: 'Platform-specific creative that captures attention and communicates clearly, tailored to your audience and goals.',
        image: '/images/brand-social-hd.jpg',
        imageObjectPos: 'center'
      },
      {
        number: '02',
        title: 'BRAND VISUAL IDENTITY',
        description: "A consistent visual identity built on color, type, and design systems that reflect your brand's personality and stay consistent everywhere.",
        image: '/images/brand-identity-hd.jpg',
        imageObjectPos: 'center'
      },
      {
        number: '03',
        title: 'CAMPAIGN & PROMOTIONAL DESIGN',
        description: 'Clear, memorable visuals for product launches, campaigns, and promotions that communicate your message and convert effectively.',
        image: '/images/brand-campaign-hd.jpg',
        imageObjectPos: 'center'
      }
    ],
    deliverablesEyebrow: 'THE DELIVERABLES',
    deliverablesHeading: 'WHAT YOU ',
    deliverablesHighlight: 'WALK AWAY WITH.',
    deliverablesImage: '/images/brand-deliverables-hd.jpg',
    deliverablesImageObjectPos: 'center',
    deliverablesList: [
      {
        number: '01',
        title: 'Positioning & Brand Architecture',
        description: 'A clear market position and structure for your offers.'
      },
      {
        number: '02',
        title: 'Visual Identity System',
        description: 'Logo suite, color, typography, and graphic elements.'
      },
      {
        number: '03',
        title: 'Brand Guidelines',
        description: 'A practical reference for using the identity consistently.'
      },
      {
        number: '04',
        title: 'Launch-Ready Templates',
        description: 'Reusable layouts for social, ads, and campaigns.'
      }
    ],
    processHeading: 'FROM STRATEGY TO LAUNCH.',
    processSteps: [
      {
        number: '01',
        title: 'DISCOVER',
        description: 'Audit the brand, audience, and category.'
      },
      {
        number: '02',
        title: 'DEFINE',
        description: 'Set the positioning and agree on a creative direction.'
      },
      {
        number: '03',
        title: 'DESIGN',
        description: 'Build and refine the identity across key touchpoints.'
      },
      {
        number: '04',
        title: 'DELIVER',
        description: 'Hand over the guidelines, assets, and templates.'
      }
    ],
    faqSubtitle: 'Everything you need to know about our Brand Architecture & Identity Systems process.',
    faqs: [
      {
        question: 'What kind of design services do you offer?',
        answer: 'We provide end-to-end brand identity design, including brand positioning, naming, logo systems, typography, color architecture, packaging, collateral, marketing assets, and comprehensive digital guidelines.'
      },
      {
        question: 'Do you customize designs according to my brand?',
        answer: 'Every project is built completely from scratch based on in-depth market audits, audience psychology, and competitive differentiation tailored strictly to your industry.'
      },
      {
        question: 'Can you handle ongoing design requirements?',
        answer: 'Yes, after launch we provide retainer support for ongoing creative production, campaign rollouts, packaging extensions, and marketing design.'
      },
      {
        question: 'How do you ensure designs perform well?',
        answer: 'Our identity systems are battle-tested for real-world application across mobile feeds, print, signage, and digital product interfaces to ensure immediate brand recall and high readability.'
      },
      {
        question: 'Which tools do you use for designing?',
        answer: 'We utilize Figma, Adobe Illustrator, Photoshop, After Effects, and Cinema 4D for 3D packaging and identity rollouts.'
      }
    ],
    ctaHeading: 'BUILD A BRAND PEOPLE RECOGNIZE.',
    ctaDescription: "Let's create a visual identity that works across every touchpoint.",
    ctaButtonText: 'BOOK A STRATEGY CALL'
  },

  'narrative-engineering': {
    slug: 'narrative-engineering',
    number: '02',
    category: 'CONTENT & MESSAGING',
    heroHeading: 'NARRATIVE ENGINEERING &',
    heroHighlight: 'STORY SYSTEMS.',
    heroDescription: 'Tell stories that shape how audiences see your brand and turn complex value into undeniable market desire.',
    heroImage: '/images/about-content-hd.jpg',
    heroImageObjectPos: 'center center',
    whatWeDesignEyebrow: 'WHAT WE CRAFT',
    whatWeDesignHeading: 'WORDS THAT SELL.',
    whatWeDesignHighlight: 'STORIES THAT SCALE.',
    features: [
      {
        number: '01',
        title: 'SCROLL-STOPPING SOCIAL COPY',
        description: 'Platform-native hooks and punchy editorial frameworks tailored to capture attention in cluttered feeds.',
        image: '/images/home-narrative.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '02',
        title: 'HIGH-CONVERTING SCRIPTS',
        description: 'Direct-response video scripts, commercial storyboards, and founder video narratives engineered for high retention.',
        image: '/images/about-branding-hd.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '03',
        title: 'EXECUTIVE & BRAND POSITIONING',
        description: 'Manifesto writing, category definition, and founder-led thought leadership that establish industry dominance.',
        image: '/images/insights-conference-hd.jpg',
        imageObjectPos: 'center center'
      }
    ],
    deliverablesEyebrow: 'THE DELIVERABLES',
    deliverablesHeading: 'WHAT YOU ',
    deliverablesHighlight: 'WALK AWAY WITH.',
    deliverablesImage: '/images/home-narrative.jpg',
    deliverablesImageObjectPos: 'center center',
    deliverablesList: [
      {
        number: '01',
        title: 'Core Messaging Bible',
        description: 'Value proposition matrix, taglines, pillars, and distinct tone of voice guidelines.'
      },
      {
        number: '02',
        title: 'Multi-Channel Script Vault',
        description: 'Production-ready scripts for paid social, YouTube, podcasts, and commercial spots.'
      },
      {
        number: '03',
        title: 'Landing Page & Email Playbook',
        description: 'High-converting website copy frameworks and email nurture sequences.'
      },
      {
        number: '04',
        title: 'Syndication Matrix',
        description: 'Structured workflows to repurpose pillar content across 5+ distribution channels.'
      }
    ],
    processHeading: 'FROM INSIGHT TO STORY.',
    processSteps: [
      {
        number: '01',
        title: 'AUDIT',
        description: 'Analyze audience pain points, objections, and category language.'
      },
      {
        number: '02',
        title: 'FRAME',
        description: 'Define your core brand thesis, emotional anchors, and signature POV.'
      },
      {
        number: '03',
        title: 'SCRIPT',
        description: 'Draft, test, and polish high-impact copy and video scripts.'
      },
      {
        number: '04',
        title: 'SYNDICATE',
        description: 'Deploy copy across platforms and optimize based on performance.'
      }
    ],
    faqSubtitle: 'Everything you need to know about our Narrative Engineering process.',
    faqs: [
      {
        question: 'How is narrative engineering different from regular copywriting?',
        answer: 'Copywriting writes lines; narrative engineering builds a strategic belief framework. We map out what your customer must believe before they buy and architect every piece of content to build that belief.'
      },
      {
        question: 'Do you write for technical B2B or consumer D2C brands?',
        answer: 'Both. We specialize in making complex B2B products intuitive and compelling, and giving D2C brands cultural depth that commands higher price points.'
      },
      {
        question: 'Can you match our founder’s voice?',
        answer: 'Yes. We conduct in-depth voice extraction interviews to codify cadence, vocabulary, and perspective into a scalable voice matrix.'
      },
      {
        question: 'How do you measure narrative success?',
        answer: 'We measure through concrete business metrics: average watch time, hook retention, CTR on paid ads, conversion rate on landing pages, and organic engagement.'
      },
      {
        question: 'Do you produce the final videos or just write scripts?',
        answer: 'We provide full creative direction, storyboards, and production coordination in tandem with our creative studio partners.'
      }
    ],
    ctaHeading: 'TELL STORIES THAT MOVE MARKETS.',
    ctaDescription: "Let's build a narrative engine that turns casual viewers into loyal evangelists.",
    ctaButtonText: 'BOOK A STRATEGY CALL'
  },

  'performance-paid-intelligence': {
    slug: 'performance-paid-intelligence',
    number: '03',
    category: 'PERFORMANCE MARKETING',
    heroHeading: 'PERFORMANCE &',
    heroHighlight: 'PAID INTELLIGENCE.',
    heroDescription: 'Turn paid media into predictable, scalable revenue with mathematical precision and ruthless creative iteration.',
    heroImage: '/images/about-performance-hd.jpg',
    heroImageObjectPos: 'center center',
    whatWeDesignEyebrow: 'WHAT WE ENGINEER',
    whatWeDesignHeading: 'DATA-BACKED CAMPAIGNS.',
    whatWeDesignHighlight: 'MEASURABLE PROFIT.',
    features: [
      {
        number: '01',
        title: 'PAID SOCIAL (META & TIKTOK)',
        description: 'High-velocity creative testing paired with algorithmic media buying to uncover breakout winners at scale.',
        image: '/images/project-digital-growth.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '02',
        title: 'HIGH-INTENT SEARCH & PMAX',
        description: 'Capture active demand on Google Search and YouTube with tightly segmented keyword trees and conversion bidding.',
        image: '/images/home-intelligence.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '03',
        title: 'SERVER-SIDE TRACKING & CAPI',
        description: 'Robust first-party data tracking infrastructure that overcomes privacy blockers and feeds clean signals to ad algorithms.',
        image: '/images/about-experience-hd.jpg',
        imageObjectPos: 'center center'
      }
    ],
    deliverablesEyebrow: 'THE DELIVERABLES',
    deliverablesHeading: 'WHAT YOU ',
    deliverablesHighlight: 'WALK AWAY WITH.',
    deliverablesImage: '/images/about-performance-hd.jpg',
    deliverablesImageObjectPos: 'center center',
    deliverablesList: [
      {
        number: '01',
        title: 'Unit Economics & Media Model',
        description: 'Detailed financial modeling on CAC, target ROAS, payback velocity, and LTV.'
      },
      {
        number: '02',
        title: 'Weekly Creative Testing Factory',
        description: 'Continuous pipeline of fresh hooks, angles, and direct-response creatives.'
      },
      {
        number: '03',
        title: 'Custom Attribution Dashboard',
        description: 'Live executive dashboards tracking real revenue, MER, and blended acquisition costs.'
      },
      {
        number: '04',
        title: 'Audience & Retargeting Architecture',
        description: 'Full-funnel segmentation capturing buyers at every phase of intent.'
      }
    ],
    processHeading: 'FROM AUDIT TO COMPOUNDING SCALE.',
    processSteps: [
      {
        number: '01',
        title: 'DIAGNOSE',
        description: 'Audit tracking, past account data, funnels, and unit economics.'
      },
      {
        number: '02',
        title: 'ARCHITECT',
        description: 'Restructure campaigns, install server-side CAPI, and prepare initial creative batches.'
      },
      {
        number: '03',
        title: 'TEST & SCALE',
        description: 'Run rapid creative sprints and aggressively allocate budget to top performers.'
      },
      {
        number: '04',
        title: 'COMPOUND',
        description: 'Expand to complementary channels and maximize customer lifetime value.'
      }
    ],
    faqSubtitle: 'Everything you need to know about our Performance & Paid Intelligence process.',
    faqs: [
      {
        question: 'What ad platforms do you specialize in?',
        answer: 'We specialize in Meta (Facebook & Instagram), Google (Search, Shopping, Performance Max, YouTube), TikTok, and LinkedIn Ads.'
      },
      {
        question: 'What is your minimum monthly ad spend requirement?',
        answer: 'We typically manage accounts spending anywhere from $10,000/month to $250,000+/month to ensure statistically valid testing velocity.'
      },
      {
        question: 'Do you create the ad creatives in-house?',
        answer: 'Yes! Performance marketing is 80% creative. Our creative studio scripts, designs, and edits custom video and static assets weekly.'
      },
      {
        question: 'How do you handle iOS tracking changes and attribution?',
        answer: 'We implement Conversions API (CAPI) server-side tracking, UTM hygiene, and blended MER (Marketing Efficiency Ratio) models for 100% data visibility.'
      },
      {
        question: 'How quickly can we expect to see results?',
        answer: 'Initial baseline optimizations and creative tests yield clarity within the first 14–21 days, with scalable momentum building across 60–90 days.'
      }
    ],
    ctaHeading: 'TURN AD SPEND INTO PREDICTABLE REVENUE.',
    ctaDescription: "Let's engineer a performance engine that scales sustainably and profitably.",
    ctaButtonText: 'BOOK A STRATEGY CALL'
  },

  'influence-cultural-capital': {
    slug: 'influence-cultural-capital',
    number: '04',
    category: 'CREATOR & INFLUENCE',
    heroHeading: 'INFLUENCE &',
    heroHighlight: 'CULTURAL CAPITAL.',
    heroDescription: 'Build genuine cultural relevance through creator collaborations, ambassador networks, and community-driven movements.',
    heroImage: '/images/home-influence.jpg',
    heroImageObjectPos: 'center center',
    whatWeDesignEyebrow: 'WHAT WE ACTIVATE',
    whatWeDesignHeading: 'ORGANIC RELEVANCE.',
    whatWeDesignHighlight: 'CREATOR ADVOCACY.',
    features: [
      {
        number: '01',
        title: 'TIER-1 CREATOR PARTNERSHIPS',
        description: 'Strategic matchmaking, contract negotiation, and co-created storytelling with influential voices in your niche.',
        image: '/images/project-disco.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '02',
        title: 'MICRO-INFLUENCER SEEDING FACTORY',
        description: 'Systematized gifting and seeding campaigns that produce hundreds of authentic reviews and UGC assets monthly.',
        image: '/images/insights-hero-hd.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '03',
        title: 'CREATOR WHITELISTING & SPARK ADS',
        description: 'Run targeted dark ads directly from creator handles to drastically boost CTR and trust.',
        image: '/images/home-influence.jpg',
        imageObjectPos: 'center center'
      }
    ],
    deliverablesEyebrow: 'THE DELIVERABLES',
    deliverablesHeading: 'WHAT YOU ',
    deliverablesHighlight: 'WALK AWAY WITH.',
    deliverablesImage: '/images/home-influence.jpg',
    deliverablesImageObjectPos: 'center center',
    deliverablesList: [
      {
        number: '01',
        title: 'Vetted Creator Roster',
        description: 'Pre-screened list of creators audited for authentic engagement, audience demographics, and brand safety.'
      },
      {
        number: '02',
        title: 'Comprehensive Briefing Kits',
        description: 'Clear creative boundaries that empower creators while guaranteeing message accuracy.'
      },
      {
        number: '03',
        title: 'Perpetual Asset Rights Vault',
        description: 'High-res library of creator content licensed for paid ads, web, and email.'
      },
      {
        number: '04',
        title: 'Earned Media & ROI Scorecard',
        description: 'Granular tracking of affiliate sales, coupon codes, and brand sentiment uplift.'
      }
    ],
    processHeading: 'FROM SCOUTING TO VIRALITY.',
    processSteps: [
      {
        number: '01',
        title: 'SCOUT',
        description: 'Identify authentic creators whose values and audiences match your brand.'
      },
      {
        number: '02',
        title: 'ALIGN',
        description: 'Craft personalized offers, establish usage rights, and distribute creative briefs.'
      },
      {
        number: '03',
        title: 'ACTIVATE',
        description: 'Coordinate simultaneous post schedules for maximum cultural impact.'
      },
      {
        number: '04',
        title: 'AMPLIFY',
        description: 'Whitelist top organic performers into paid media ad funnels.'
      }
    ],
    faqSubtitle: 'Everything you need to know about our Creator & Influence process.',
    faqs: [
      {
        question: 'How do you prevent influencer fraud and fake followers?',
        answer: 'We utilize deep audience analytics tools that verify follower authenticity, engagement ratios, and demographic concentration before signing any creator.'
      },
      {
        question: 'Do we own the content created by influencers?',
        answer: 'Yes, our contracts strictly negotiate paid usage rights and whitelisting permissions so you can run the assets in your ad accounts indefinitely.'
      },
      {
        question: 'How do we track direct sales from influencer posts?',
        answer: 'Through custom trackable links, dedicated discount codes, and post-purchase attribution surveys.'
      },
      {
        question: 'Can you work with gifting/seeding or do we need paid sponsorships?',
        answer: 'We utilize a hybrid model: gifting and product seeding for high-volume UGC, and paid contracts for guaranteed deliverable dates and whitelisting.'
      },
      {
        question: 'What industries do you have creator networks in?',
        answer: 'We maintain relationships across D2C lifestyle, tech & SaaS, fintech, health & wellness, beauty, and fashion.'
      }
    ],
    ctaHeading: 'HARNESS THE POWER OF CULTURE.',
    ctaDescription: "Let's turn trusted creators into your brand's most potent growth advocates.",
    ctaButtonText: 'BOOK A STRATEGY CALL'
  },

  'digital-experience-design': {
    slug: 'digital-experience-design',
    number: '05',
    category: 'PRODUCT & WEB DESIGN',
    heroHeading: 'DIGITAL EXPERIENCES &',
    heroHighlight: 'CONVERSION SYSTEMS.',
    heroDescription: 'Craft immersive, lightning-fast digital products and web flagships that turn first-time visitors into lifelong buyers.',
    heroImage: '/images/about-experience-hd.jpg',
    heroImageObjectPos: 'center center',
    whatWeDesignEyebrow: 'WHAT WE BUILD',
    whatWeDesignHeading: 'IMMERSIVE INTERFACES.',
    whatWeDesignHighlight: 'FLAWLESS UTILITY.',
    features: [
      {
        number: '01',
        title: 'HIGH-CONVERTING ECOMMERCE & LANDING PAGES',
        description: 'High-speed storefronts and sales funnels built with obsessive attention to checkout ergonomics and zero friction.',
        image: '/images/courses-hero-monitor.png',
        imageObjectPos: 'center center'
      },
      {
        number: '02',
        title: 'BESPOKE BRAND FLAGSHIP SITES',
        description: 'Elevated web experiences with custom typography, fluid animations, and modern responsive layouts that captivate.',
        image: '/images/about-experience-hd.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '03',
        title: 'SCALABLE FIGMA DESIGN SYSTEMS',
        description: 'Comprehensive UI component libraries that ensure rapid future development and brand consistency.',
        image: '/images/academy-design-v2.png',
        imageObjectPos: 'center center'
      }
    ],
    deliverablesEyebrow: 'THE DELIVERABLES',
    deliverablesHeading: 'WHAT YOU ',
    deliverablesHighlight: 'WALK AWAY WITH.',
    deliverablesImage: '/images/about-experience-hd.jpg',
    deliverablesImageObjectPos: 'center center',
    deliverablesList: [
      {
        number: '01',
        title: 'Master Figma UI Kit',
        description: 'Full atomic design tokens, typography scales, mobile/desktop components, and states.'
      },
      {
        number: '02',
        title: 'Interactive Prototypes',
        description: 'Clickable user flows demonstrating motion, navigation, and user journey transitions.'
      },
      {
        number: '03',
        title: 'Production-Ready Code / CMS',
        description: 'Clean, performant React/Next.js/Shopify code scoring 90+ on Core Web Vitals.'
      },
      {
        number: '04',
        title: 'Conversion Optimization Blueprint',
        description: 'Post-launch CRO testing roadmap with Heatmap setup and A/B test schedules.'
      }
    ],
    processHeading: 'FROM CONCEPT TO LAUNCH.',
    processSteps: [
      {
        number: '01',
        title: 'RESEARCH',
        description: 'Study user journeys, competitor flows, and conversion friction.'
      },
      {
        number: '02',
        title: 'WIREFRAME',
        description: 'Map information architecture and low-fidelity structural layouts.'
      },
      {
        number: '03',
        title: 'DESIGN',
        description: 'Apply high-fidelity brand visual systems, micro-interactions, and assets.'
      },
      {
        number: '04',
        title: 'ENGINEER',
        description: 'Develop responsive, accessible, blazing-fast production code.'
      }
    ],
    faqSubtitle: 'Everything you need to know about our Digital Experience Design process.',
    faqs: [
      {
        question: 'What technology stack do you build websites with?',
        answer: 'We build with modern frameworks like React, Next.js, Tailwind CSS, Shopify Plus, and headless CMS platforms like Sanity and Supabase.'
      },
      {
        question: 'Are your websites optimized for mobile and speed?',
        answer: 'Always. We engineer every experience mobile-first with sub-second page loads and 90+ Google Lighthouse performance ratings.'
      },
      {
        question: 'Can you redesign our existing site without losing SEO rankings?',
        answer: 'Yes. We perform thorough 301 redirect mapping, meta hierarchy preservation, and canonical auditing to protect and enhance existing SEO value.'
      },
      {
        question: 'Do you offer ongoing website maintenance after launch?',
        answer: 'Yes, we provide ongoing retainer plans covering speed optimization, security updates, CRO experimentation, and new feature releases.'
      },
      {
        question: 'Will our internal team be able to edit content easily?',
        answer: 'Yes! We configure intuitive content management systems so your marketing team can update copy, banners, and blogs without touching code.'
      }
    ],
    ctaHeading: 'BUILD A DIGITAL EXPERIENCE THAT CONVERTS.',
    ctaDescription: "Let's create a web presence that elevates your brand and accelerates sales.",
    ctaButtonText: 'BOOK A STRATEGY CALL'
  },

  'market-intelligence-growth-advisory': {
    slug: 'market-intelligence-growth-advisory',
    number: '06',
    category: 'STRATEGY & ADVISORY',
    heroHeading: 'MARKET INTELLIGENCE &',
    heroHighlight: 'GROWTH ADVISORY.',
    heroDescription: 'Arm your leadership with proprietary competitor insights, customer research, and strategic clarity to capture uncontested market share.',
    heroImage: '/images/insights-aeo-hd.jpg',
    heroImageObjectPos: 'center center',
    whatWeDesignEyebrow: 'WHAT WE DELIVER',
    whatWeDesignHeading: 'STRATEGIC CLARITY.',
    whatWeDesignHighlight: 'UNCONTESTED ADVANTAGE.',
    features: [
      {
        number: '01',
        title: 'COMPETITOR INTELLIGENCE & WHITE SPACE AUDIT',
        description: 'Granular teardown of competitor funnels, pricing structures, and overlooked market niches you can dominate.',
        image: '/images/insights-search-hd.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '02',
        title: 'CUSTOMER INTENT & BEHAVIOR MAPPING',
        description: 'Qualitative customer interviews and sentiment mining that reveal true buying triggers and hidden objections.',
        image: '/images/insights-aeo-hd.jpg',
        imageObjectPos: 'center center'
      },
      {
        number: '03',
        title: 'GO-TO-MARKET (GTM) EXECUTION ROADMAP',
        description: 'Clear, phased 12-month commercial strategy covering pricing, product bundling, and channel sequencing.',
        image: '/images/about-hero-hd.jpg',
        imageObjectPos: 'center center'
      }
    ],
    deliverablesEyebrow: 'THE DELIVERABLES',
    deliverablesHeading: 'WHAT YOU ',
    deliverablesHighlight: 'WALK AWAY WITH.',
    deliverablesImage: '/images/insights-aeo-hd.jpg',
    deliverablesImageObjectPos: 'center center',
    deliverablesList: [
      {
        number: '01',
        title: 'Market Intelligence Dossier',
        description: 'Benchmarking data, category sizing, competitor pricing gaps, and risk factors.'
      },
      {
        number: '02',
        title: 'Ideal Customer Profile (ICP) Playbook',
        description: 'Psychographic breakdown, objection-handling scripts, and buyer triggers.'
      },
      {
        number: '03',
        title: 'Go-To-Market Master Blueprint',
        description: 'Phased commercial roadmap with exact KPI milestones and budget allocations.'
      },
      {
        number: '04',
        title: 'Executive Advisory Sessions',
        description: 'Direct recurring advisory with senior growth partners to resolve strategic bottlenecks.'
      }
    ],
    processHeading: 'FROM RESEARCH TO EXECUTION.',
    processSteps: [
      {
        number: '01',
        title: 'INVESTIGATE',
        description: 'Deep data gathering across market reports, customer interviews, and ad archives.'
      },
      {
        number: '02',
        title: 'SYNTHESIZE',
        description: 'Distill data into actionable market patterns and category vulnerabilities.'
      },
      {
        number: '03',
        title: 'STRATEGIZE',
        description: 'Formulate your unique market position and unfair competitive advantages.'
      },
      {
        number: '04',
        title: 'ADVISE',
        description: 'Guide executive implementation and monitor commercial milestones.'
      }
    ],
    faqSubtitle: 'Everything you need to know about our Growth Advisory process.',
    faqs: [
      {
        question: 'Who is this advisory service intended for?',
        answer: 'CEOs, founders, and CMOs of ambitious companies preparing for rapid scaling, fundraising, brand repositioning, or entering new market territories.'
      },
      {
        question: 'How is this different from traditional management consulting?',
        answer: 'We don’t produce 100-page theoretical slide decks that gather dust. We deliver practical, battle-tested execution playbooks built by operators who run digital campaigns daily.'
      },
      {
        question: 'What is the time commitment required from our executive team?',
        answer: 'Initial briefing interviews require 3–5 hours across week one. Ongoing advisory sessions are structured into concise bi-weekly 60-minute strategy sprints.'
      },
      {
        question: 'Can you help us with pricing and offer restructuring?',
        answer: 'Yes! Offer architecture and value perception are among the highest-leverage growth drivers we specialize in optimizing.'
      },
      {
        question: 'How do you ensure confidentiality of sensitive business data?',
        answer: 'We sign strict non-disclosure agreements (NDAs) prior to accessing any proprietary data or internal financials.'
      }
    ],
    ctaHeading: 'CLAIM UNCONTESTED CATEGORY LEADERSHIP.',
    ctaDescription: "Let's uncover the untapped levers that will power your next stage of growth.",
    ctaButtonText: 'BOOK A STRATEGY CALL'
  }
};
