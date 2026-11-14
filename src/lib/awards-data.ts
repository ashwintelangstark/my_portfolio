// Technical Certificates (Anthropic Claude Academy)
import badgeClaude101 from "@/assets/certificates/claude-academy-badge-claude-101.png";
import badgeClaudePlatform101 from "@/assets/certificates/claude-academy-badge-claude-platform-101.png";
import badgeClaudeCodeInAction from "@/assets/certificates/claude-academy-badge-claude-code-in-action.png";
import badgeHumanAgentTeams from "@/assets/certificates/claude-academy-badge-building-effective-human-agent-teams.png";
import badgeMcpIntro from "@/assets/certificates/claude-academy-badge-introduction-to-model-context-protocol.png";
import badgeMcpAdvanced from "@/assets/certificates/claude-academy-badge-model-context-protocol-advanced-topics.png";
import badgeEvalsIntro from "@/assets/certificates/claude-academy-badge-introduction-to-evals.png";
import badgeCapabilitiesLimitations from "@/assets/certificates/claude-academy-badge-ai-capabilities-and-limitations.png";
import badgeBuilders from "@/assets/certificates/claude-academy-badge-ai-fluency-for-builders.png";
import badgeFrameworkFoundations from "@/assets/certificates/claude-academy-badge-ai-fluency-framework-foundations.png";
import badgeCowork from "@/assets/certificates/claude-academy-badge-introduction-to-claude-cowork.png";
import badgeTag from "@/assets/certificates/claude-academy-badge-introduction-to-claude-tag.png";
import badgeEnterprise from "@/assets/certificates/claude-academy-badge-deploying-claude-enterprise-with-confidence.png";
import badgeCreativeWork from "@/assets/certificates/claude-academy-badge-ai-fluency-for-creative-work.png";
import badgeSmallBusiness from "@/assets/certificates/claude-academy-badge-ai-fluency-for-small-businesses.png";
import badgeEducators from "@/assets/certificates/claude-academy-badge-ai-fluency-for-educators.png";
import badgeK12Educators from "@/assets/certificates/claude-academy-badge-ai-fluency-for-k-12-educators.png";
import badgeNonprofits from "@/assets/certificates/claude-academy-badge-ai-fluency-for-nonprofits.png";
import badgeStudents from "@/assets/certificates/claude-academy-badge-ai-fluency-for-students.png";
import badgeTeachingFluency from "@/assets/certificates/claude-academy-badge-teaching-ai-fluency.png";

// Literary & Professional Awards
import imgBooksBrewHonours from "@/assets/awards/booksbrew-author-honours.png";
import imgBooksBrewPost from "@/assets/awards/booksbrew-post.png";
import vidBooksBrewRatings from "@/assets/awards/booksbrew-ratings.mp4";
import vidBooksBrewRecognition from "@/assets/awards/booksbrew-recognition.mp4";

import imgSahityakoshSamman from "@/assets/awards/sahityakosh-samman.png";
import imgSahityakoshMedals from "@/assets/awards/sahityakosh-samman-medals.png";

import imgWorldBookDayCert from "@/assets/awards/world-book-day-honours-certificate.png";
import imgWorldBookDayTrophy from "@/assets/awards/world-book-day-honours.png";

import imgWritersExcellenceCert from "@/assets/awards/writers-excellence-certificate.png";
import vidWritersExcellenceBook from "@/assets/awards/writers-excellence-book-feature.mp4";
import vidWritersStoryMagazine from "@/assets/awards/writers-story-digital-magazine-feature.mp4";

export interface TechnicalCertificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  projectImpact: string;
  image: string;
}

export interface AwardMedia {
  type: "image" | "video";
  src: string;
  title: string;
  alt?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  category: string;
  presentationReason: string;
  media: AwardMedia[];
}

export const technicalCertificates: TechnicalCertificate[] = [
  {
    id: "claude-101",
    title: "Claude 101 – Foundations of Large Language Models",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "This certification established core mastery over Anthropic's foundation model architecture, token dynamics, and prompting paradigms. It directly empowered my work on JANUARY and Nova, enabling me to design resilient system prompts, conversational state management, and fallback model routing that maintain context coherence across multi-turn interactions.",
    image: badgeClaude101,
  },
  {
    id: "claude-platform-101",
    title: "Claude Platform 101 – API & Architecture",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Covering Anthropic's developer platform, API parameters, and rate-limiting best practices, this credential was instrumental in building the dynamic model-routing architecture in JANUARY. It enabled seamless integration between Anthropic APIs, token optimization, and structured streaming responses in production applications.",
    image: badgeClaudePlatform101,
  },
  {
    id: "claude-code-in-action",
    title: "Claude Code in Action – Agentic Coding Workflows",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "This training focused on leveraging AI agents for deep software engineering, debugging, and continuous refactoring. Applying these agentic code execution strategies helped accelerate full-stack development cycles across Mindspace AI, ARGUS & Co., and the Vision-Based Robot Simulator, maintaining rigorous code quality and rapid iteration.",
    image: badgeClaudeCodeInAction,
  },
  {
    id: "human-agent-teams",
    title: "Building Effective Human-Agent Teams – Collaborative Intelligence",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Mastering human-in-the-loop workflows and role delegation directly shaped the multi-agent architecture in ARGUS & Co. and Mindspace AI. It provided the blueprints for designing specialized agent personas (such as Detective Argus, Apex, and market agents BULL, BEAR, STAG, RABBIT) that collaborate transparently with human investigators and analysts without sacrificing human oversight.",
    image: badgeHumanAgentTeams,
  },
  {
    id: "mcp-intro",
    title: "Introduction to Model Context Protocol (MCP) – Tool Integration",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "This certification established deep expertise in the Model Context Protocol (MCP), standardizing how AI systems securely query databases, file systems, and external APIs. I implemented these core MCP concepts into ARGUS & Co.'s case ingestion engine and JANUARY's desktop tooling to connect LLMs dynamically to local execution environments.",
    image: badgeMcpIntro,
  },
  {
    id: "mcp-advanced",
    title: "Model Context Protocol (MCP): Advanced Topics – Scalable Protocols",
    issuer: "Claude Academy · Anthropic",
    date: "November 2026",
    projectImpact:
      "Diving into advanced MCP servers, transports, multiplexing, and authorization models, this certification enabled robust, secure communication boundaries in complex multi-agent architectures. It informed the forensic document retrieval and tool orchestration layers that empower ARGUS & Co. to safely correlate evidence and inspect archives.",
    image: badgeMcpAdvanced,
  },
  {
    id: "evals-intro",
    title: "Introduction to Evals – Quantitative AI Benchmarking",
    issuer: "Claude Academy · Anthropic",
    date: "November 2026",
    projectImpact:
      "This credential solidified the principles of evaluating LLM outputs through systematic, reproducible test suites and rubrics. Applying these evaluation methodologies helped benchmark prediction accuracy and explainability in Mindspace AI's simulated market forecasts and verify contradiction detection reliability in ARGUS & Co.",
    image: badgeEvalsIntro,
  },
  {
    id: "capabilities-limitations",
    title: "AI Capabilities and Limitations – Responsible Engineering",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Understanding the exact boundary conditions, failure modes, and hallucination risks of foundation models allowed me to implement responsible guardrails across all my AI systems. In Mindspace AI and ARGUS & Co., it drove the design of explicit uncertainty estimation, historical data timestamps, and evidence traceability to ensure users distinguish model assumptions from ground-truth evidence.",
    image: badgeCapabilitiesLimitations,
  },
  {
    id: "ai-fluency-builders",
    title: "AI Fluency for Builders – Engineering with Generative AI",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Focused on transforming generative AI concepts into robust technical products, this certification accelerated my end-to-end prototyping workflow. It directly guided the development of EduForge's intelligent authoring platform and STARK-VISION's edge-first client architecture, combining modern UI frameworks with generative capabilities.",
    image: badgeBuilders,
  },
  {
    id: "framework-foundations",
    title: "AI Fluency Framework: Foundations – Core Conceptual Literacy",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "This foundational certification provided structured taxonomies for evaluating AI use cases, cognitive automation, and prompt engineering strategies. It provided the conceptual baseline that informed my research in deep learning model evaluation during my IIIT Dharwad internship and subsequent multimodal engineering initiatives.",
    image: badgeFrameworkFoundations,
  },
  {
    id: "claude-cowork",
    title: "Introduction to Claude Cowork – Collaborative Productivity",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Covering dynamic document co-creation and iterative AI-assisted synthesis, this knowledge helped streamline customer communication and automated CRM workflows in Nova, as well as rapid content curation for the Indira Pachhi brand transformation project.",
    image: badgeCowork,
  },
  {
    id: "claude-tag",
    title: "Introduction to Claude Tag – Structured Extraction & Schema Parsing",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "This certification developed precision skills in XML tag delineation, structured JSON parsing, and schema adherence for Claude models. It proved critical for ARGUS & Co. when parsing unstructured legal testimonies, forensic reports, and timeline records into structured schemas for contradiction analysis.",
    image: badgeTag,
  },
  {
    id: "enterprise-deployment",
    title: "Deploying Claude Enterprise with Confidence – Security & Governance",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Focused on enterprise-grade data privacy, governance, IAM roles, and compliance, this certification guided the secure architecture of Nova and InQuote. It ensured that customer data in PostgreSQL and Supabase remained insulated and complied with production deployment standards.",
    image: badgeEnterprise,
  },
  {
    id: "creative-work",
    title: "AI Fluency for Creative Work – Generative Visuals & Design",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Exploring the synergy between creative direction, narrative pacing, and generative media, this certification directly inspired the atmospheric Western noir aesthetics of ARGUS & Co. and the 3D brand storytelling developed for the Indira Pachhi interactive web experience.",
    image: badgeCreativeWork,
  },
  {
    id: "small-businesses",
    title: "AI Fluency for Small Businesses – High-Impact Digitization",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "This program highlighted cost-effective automation, operational leverage, and digital growth for family enterprises. I applied these exact frameworks while leading marketing for Indira Pachhi's Pickles and developing Nova, establishing modern digital channels that bridged traditional heritage with contemporary e-commerce.",
    image: badgeSmallBusiness,
  },
  {
    id: "educators",
    title: "AI Fluency for Educators – Pedagogical Integration",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Gaining insights into educational technology, curriculum integration, and AI-assisted tutoring directly empowered the creation of EduForge for NLE's Mahesh PU College, ensuring the automated question paper generation and evaluation aligned with rigorous examination standards.",
    image: badgeEducators,
  },
  {
    id: "k12-educators",
    title: "AI Fluency for K-12 Educators – Adaptive Learning Systems",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Focusing on foundational learning environments, this certification informed the dynamic content management and educational user experience developed for NLE's Rotary School website, creating accessible digital touchpoints for parents, teachers, and students.",
    image: badgeK12Educators,
  },
  {
    id: "nonprofits",
    title: "AI Fluency for Nonprofits – Mission-Driven Technology",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Exploring mission-driven technology deployment, resource-efficient architectures, and community outreach helped me structure public-interest and educational initiatives, ensuring software solutions remain accessible, inclusive, and privacy-conscious.",
    image: badgeNonprofits,
  },
  {
    id: "students",
    title: "AI Fluency for Students – Research & Self-Directed Learning",
    issuer: "Claude Academy · Anthropic",
    date: "October 2026",
    projectImpact:
      "Cultivating disciplined research methodologies and critical verification habits, this training supported my academic research projects, including the CNN object tracking and YOLOv8 industrial drone inspection simulations in Webots.",
    image: badgeStudents,
  },
  {
    id: "teaching-fluency",
    title: "Teaching AI Fluency – Mentorship & Knowledge Transfer",
    issuer: "Claude Academy · Anthropic",
    date: "November 2026",
    projectImpact:
      "This credential honed my ability to translate complex AI architectures, agentic frameworks, and computer vision models into clear, actionable knowledge for team members, stakeholders, and academic audiences across research publications and collaborative workshops.",
    image: badgeTeachingFluency,
  },
];

export const awardsList: AwardItem[] = [
  {
    id: "booksbrew-honours",
    title: "BooksBrew Annual Author Recognition & Bookfest Honours",
    organization: "BooksBrew Annual Bookfest Edition",
    year: "2025",
    category: "Literary Award & Global Author Feature",
    presentationReason:
      "Presented by BooksBrew during their Annual Bookfest Edition in recognition of exemplary literary contributions and outstanding book outreach across domains. The honour celebrated my published book, 'The Parting Promise: Last Words We Shared', for achieving exceptional reader ratings and widespread critical appreciation across BooksBrew's global reading community.",
    media: [
      {
        type: "image",
        src: imgBooksBrewHonours,
        title: "Honorary Certificate 2025",
        alt: "BooksBrew Annual Bookfest Honorary Certificate awarded to Ashwin Telang",
      },
      {
        type: "image",
        src: imgBooksBrewPost,
        title: "Featured Author Announcement",
        alt: "BooksBrew Featured Author Announcement for The Parting Promise by Ashwin Telang",
      },
      {
        type: "video",
        src: vidBooksBrewRecognition,
        title: "Official Bookfest Recognition Video",
      },
      {
        type: "video",
        src: vidBooksBrewRatings,
        title: "Global Readerbase Ratings & Reviews Showcase",
      },
    ],
  },
  {
    id: "sahityakosh-samman",
    title: "Sahityakosh Samman – Author Awardee",
    organization: "Sahityakosh National Literature Board",
    year: "2024",
    category: "National Literary Honours",
    presentationReason:
      "Presented by Sahityakosh in their 2024 Author Annual Recognition ceremony for excellence in literary endeavours. This prestigious accolade and accompanying ceremonial insignia medals were conferred to acknowledge creative storytelling depth, emotional resonance, and impactful contributions to contemporary literature through published authorship.",
    media: [
      {
        type: "image",
        src: imgSahityakoshSamman,
        title: "Sahityakosh Samman Award Plaque",
        alt: "Sahityakosh Samman 2024 Author Awardee Plaque presented to Ashwin Telang",
      },
      {
        type: "image",
        src: imgSahityakoshMedals,
        title: "Ceremonial Award Medals",
        alt: "Sahityakosh Samman Ceremonial Medals of Honour presented to Ashwin Telang",
      },
    ],
  },
  {
    id: "world-book-day-honours",
    title: "World Book Day Book Honour – WritersGlobal",
    organization: "WritersGlobal · World Book Day",
    year: "2024",
    category: "International Literary Recognition",
    presentationReason:
      "Conferred on World Book Day (April 23, 2024) under the global Indigenous Languages initiative by WritersGlobal. Presented in recognition of significant literary endeavors and published authorship with cross-domain outreach, honoring dedication to creative expression under the tenet 'Create | Innovate | Inspire'.",
    media: [
      {
        type: "image",
        src: imgWorldBookDayCert,
        title: "World Book Day Glass Plaque Award",
        alt: "WritersGlobal World Book Day 2024 Book Honour Certificate presented to Ashwin Telang",
      },
      {
        type: "image",
        src: imgWorldBookDayTrophy,
        title: "Commemorative Pedestal Award",
        alt: "World Book Day 2024 Commemorative Award Trophy presented to Ashwin Telang",
      },
    ],
  },
  {
    id: "writers-excellence-feature",
    title: "Writers Excellence Global Feature & Certificate of Appreciation",
    organization: "Writers Excellence & Writers Story",
    year: "2024",
    category: "Literary Feature & Appreciation Award",
    presentationReason:
      "Awarded by Writers Excellence in their 2024 Global Feature Edition for the published literary work 'The Parting Promise: Last Words We Shared'. Presented in appreciation of literary craftsmanship, narrative impact, and expansive cross-domain outreach, accompanied by a dedicated book showcase and feature spread in Writer's Story Digital Magazine.",
    media: [
      {
        type: "image",
        src: imgWritersExcellenceCert,
        title: "Certificate of Appreciation",
        alt: "Writers Excellence 2024 Certificate of Appreciation presented to Ashwin Telang for The Parting Promise",
      },
      {
        type: "video",
        src: vidWritersExcellenceBook,
        title: "Writers Excellence Book Feature Presentation",
      },
      {
        type: "video",
        src: vidWritersStoryMagazine,
        title: "Writer's Story Digital Magazine Feature",
      },
    ],
  },
];
