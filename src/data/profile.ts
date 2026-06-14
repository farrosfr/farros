export const profile = {
  name: 'Mochammad Farros Fatchur Roji',
  shortName: 'Farros',
  title: 'Full-Stack Developer | Astro Contributor | Browser Extension Developer | Red Team Operator',
  email: 'hello@farros.co',
  cvPath: '/CV_Farros_2026.pdf',
  website: 'https://farros.co',
  github: 'https://github.com/farrosfr',
  linkedin: 'https://linkedin.com/in/farrosfr',
  x: 'https://x.com/farrosfr_',
  medium: 'https://farrosfr.medium.com',
  whatsapp: '6282234057613',
  /**
   * Static availability signal. Used by the AvailabilityBadge component
   * on the home page and /contact. To go from "available" to "busy" or
   * to update the next slot, just edit the values below and rebuild.
   *
   *   status:    'available' | 'limited' | 'busy'
   *   label:     short headline (3-5 words)
   *   nextSlot:  optional, e.g. 'From July 2026' or 'Currently full'
   */
  availability: {
    status: 'available' as 'available' | 'limited' | 'busy',
    label: 'Available for new work',
    nextSlot: 'Booking engagements starting Q3 2026',
  },
  summary:
    'Statistics graduate from ITS with a professional background in data engineering, IT operations, Astro web development, browser extensions, backend tooling, and offensive security practice.',
};

// Project screenshots live in /src/assets/projects/. The data layer only
// stores the filename; the consuming .astro component uses import.meta.glob
// (which works correctly in .astro context) to resolve ImageMetadata, then
// passes it to <Image /> from astro:assets for AVIF/WebP + srcset + lazy.
export type ProjectEntry = {
  name: string;
  domain: string;
  category: string;
  /** Top-level filter bucket for the /web-porto filter chips. */
  filterCategory: 'commerce' | 'education' | 'energy' | 'other';
  description: string;
  /** Longer form description surfaced in the project lightbox. */
  details: string;
  /** Optional stack/tech list, surfaced in the project lightbox. */
  stack?: string[];
  outcome: string;
  href: string;
  image: string;
  size: 'small' | 'medium' | 'large';
  featured?: boolean;
};

export const services = [
  {
    title: 'High-Performance Web Architecture',
    slug: 'web-architecture',
    description: 'Minimalist, ultra-fast, and SEO-optimized web products built with Astro and TypeScript.',
    detailedDescription: 'I specialize in moving away from heavy, slow frameworks to lightweight, static-first architectures. This results in superior SEO ranking, near-instant load times, and reduced maintenance costs.',
    features: ['Astro & TypeScript implementation', 'Core Web Vitals optimization', 'Responsive Glassmorphism UI', 'Headless CMS integration'],
    image: '/services/web-architecture.svg',
    category: 'Development',
    cta: 'Discuss your project',
    priceRange: 'Project-based, typically $1.5k–$8k',
    duration: '2–6 weeks per engagement',
    process: [
      { step: '01', title: 'Discovery call', description: 'We map your goals, audience, and current bottlenecks in a 30-minute conversation. No slides, just your stack and where you want to go.' },
      { step: '02', title: 'Architecture brief', description: 'You get a written document covering recommended framework, hosting, data model, and a phased delivery plan within 3 business days.' },
      { step: '03', title: 'Build & iterate', description: 'Weekly demos against a shared preview URL. You approve section-by-section, so there are no big reveal surprises at the end.' },
      { step: '04', title: 'Launch & handoff', description: 'Deployment to your domain, monitoring wired up, and a short Loom walkthrough so your team can own the site after launch.' },
    ],
    deliverables: [
      'Production site deployed to your domain with HTTPS',
      'Source code in your own Git repository',
      'Lighthouse score report (target: 95+ on all four metrics)',
      'CMS or content schema documentation',
      '30-day post-launch bug fix window',
    ],
    goodFit: [
      'You have a slow or hard-to-update marketing/product site',
      'You want SEO and Core Web Vitals you can actually measure',
      'You prefer a small stack you can hand to one developer',
      'You are launching a new product and want a fast first impression',
    ],
    notGoodFit: [
      'You need a fully custom CMS with role-based workflows',
      'You want a real-time dashboard or heavy app logic in the browser',
      'The site is content-first but you need a publishing team of 20+',
    ],
    faqs: [
      { question: 'Do you work with existing sites or only new builds?', answer: 'Both. For existing sites I usually propose a phased migration where the new architecture lives at a new path or subdomain first, then the old site is redirected once parity is confirmed.' },
      { question: 'Which frameworks do you recommend?', answer: 'Astro for content-first and marketing sites, Next.js or SvelteKit for app-heavy products, and Hugo or Eleventy for documentation. I will always tell you when a heavier framework is unnecessary.' },
      { question: 'Can you integrate with our existing CMS or CRM?', answer: 'Yes. Common pairings in my recent work include Sanity, Contentful, Strapi, and WordPress headless. For CRM it is usually HubSpot or Pipedrive via their public APIs.' },
      { question: 'What happens after launch?', answer: 'You get a 30-day bug fix window and optional monthly care plans starting at a few hundred dollars per month for hosting, dependency updates, and small content edits.' },
    ],
  },
  {
    title: 'Security Assessment & Risk Review',
    slug: 'security-review',
    description: 'Vulnerability assessments and red-team perspective audits for web applications and infrastructure.',
    detailedDescription: 'Leveraging my experience as a cybersecurity writer and researcher, I identify critical security gaps in your systems before they can be exploited by attackers.',
    features: ['Web application pentesting', 'Infrastructure security review', 'Risk mitigation roadmap', 'Security writing & documentation'],
    image: '/services/security-review.svg',
    category: 'Security',
    cta: 'Secure your assets',
    priceRange: 'Project-based, typically $1k–$6k',
    duration: '1–4 weeks per engagement',
    process: [
      { step: '01', title: 'Scope definition', description: 'We agree on the targets in writing: which apps, which infrastructure, and which kinds of issues you want surfaced. No vague "test everything" briefs.' },
      { step: '02', title: 'Recon & threat model', description: 'I map the attack surface, identify the most likely attacker profiles, and produce a short threat model that drives the rest of the engagement.' },
      { step: '03', title: 'Hands-on testing', description: 'Manual and assisted testing against the agreed scope, with weekly progress notes so you are never surprised by what the final report says.' },
      { step: '04', title: 'Report & walkthrough', description: 'A written report prioritised by impact, plus a live walkthrough with your engineering team to make sure the fixes are actually actionable.' },
    ],
    deliverables: [
      'Written report ranked by severity and exploitability',
      'Reproduction steps for every confirmed finding',
      'Remediation guidance mapped to your current stack',
      'A 30-minute walkthrough call with your engineering team',
      'Optional re-test 30 days after fixes land',
    ],
    goodFit: [
      'You ship a web product and want a fresh set of eyes before launch',
      'Your team has limited offensive security experience',
      'You want a written artefact to share with investors, partners, or auditors',
      'You prefer a small, written engagement over a long retainer',
    ],
    notGoodFit: [
      'You need a continuous 24/7 monitoring or SOC offering',
      'You are looking for compliance certification (SOC 2, ISO 27001) execution',
      'Your environment requires on-site physical access testing',
    ],
    faqs: [
      { question: 'Do you run automated scanners or is this manual?', answer: 'Both, but the value is in the manual review. Automated scanners produce most of their findings from public signature databases; the manual layer is what catches business-logic and chained-vulnerability issues.' },
      { question: 'Will the report name a CVSS score for each issue?', answer: 'Yes, with a caveat: severity is rated by exploitability and business impact, not just the raw CVSS. I find that a CVSS-only ranking often buries the issues that actually matter to your product.' },
      { question: 'Can you sign an NDA?', answer: 'Yes. I am happy to sign your mutual NDA before any scope document is exchanged, and the report itself is delivered only to the contacts you nominate.' },
      { question: 'Do you help with remediation?', answer: 'The report includes remediation guidance for every finding, and a 30-minute walkthrough is included. I can quote a separate remediation sprint if your team would rather hand the fixes to me.' },
    ],
  },
  {
    title: 'Resilient Data Infrastructure',
    slug: 'data-engineering',
    description: 'Automated ETL pipelines and database architecture for reliable business intelligence.',
    detailedDescription: 'I build the "plumbing" for your data, ensuring it flows correctly from sources to your reporting tools with high integrity and minimal downtime.',
    features: ['ETL pipeline automation', 'Database optimization (SQL/NoSQL)', 'BI tool integration', 'Data warehouse mapping'],
    image: '/services/data-engineering.svg',
    category: 'Data',
    cta: 'Optimize your data',
    priceRange: 'Project-based, typically $2k–$12k',
    duration: '3–8 weeks per engagement',
    process: [
      { step: '01', title: 'Data audit', description: 'We inventory your current sources, schemas, and reporting tools. I produce a one-page map that names every moving piece and where it tends to break.' },
      { step: '02', title: 'Pipeline design', description: 'A written design for the new flows, including source-of-truth decisions, retry/back-off strategy, and the BI tool that will own reporting.' },
      { step: '03', title: 'Build & backfill', description: 'I build the pipelines in your own repo and run a one-time backfill so your dashboards have historical context on day one.' },
      { step: '04', title: 'Hand-off & monitoring', description: 'Runbooks, monitoring hooks, and a recorded walkthrough for the team that will own the pipelines after handoff.' },
    ],
    deliverables: [
      'ETL pipeline code in your repository',
      'One-time historical backfill completed',
      'Runbook covering common failure modes',
      'Monitoring or alerting hooks into your existing stack',
      'Recorded walkthrough for the operating team',
    ],
    goodFit: [
      'You have a reporting stack that is held together by manual exports',
      'Your team spends more time fixing data issues than analysing it',
      'You are moving from a monolith database to a warehouse-style layout',
      'You want to retire an ETL tool that is no longer maintainable',
    ],
    notGoodFit: [
      'You need a real-time streaming architecture (Kafka, Flink, etc.)',
      'You want a fully managed SaaS data platform rolled out across the company',
      'You are still deciding on your BI tool and want a vendor selection sprint',
    ],
    faqs: [
      { question: 'Which warehouses and BI tools do you work with?', answer: 'On the warehouse side it is mostly PostgreSQL, BigQuery, and Snowflake. For BI: Metabase, Apache Superset, Tableau, Power BI, and IBM Cognos for older enterprise setups.' },
      { question: 'Do you write pipelines in Python or in a managed tool?', answer: 'Both. I default to Python with SQL where you need full control, and to dbt or Airflow where the team already has the operational muscle. The choice is driven by your team, not mine.' },
      { question: 'Can you take over an existing broken pipeline?', answer: 'Yes, that is a common starting point. The first week is usually a triage where I document what is actually broken and propose a phased recovery plan.' },
      { question: 'How do you handle sensitive data?', answer: 'I work in your environment, not mine. Secrets stay in your secret manager, sample data is used where possible, and I can sign an NDA or work under your existing DPA.' },
    ],
  },
  {
    title: 'AI & Automation',
    slug: 'ai-automation',
    description: 'Practical AI assistants, workflow automation, and integrations that reduce repetitive operational work.',
    detailedDescription: 'I design AI-assisted workflows and automation layers that connect existing tools, clean up manual handoffs, and make day-to-day operations faster without forcing teams into an oversized platform rebuild.',
    features: ['AI assistant workflow design', 'Internal tool and API integrations', 'Process automation for repetitive tasks', 'Reporting, routing, and handoff automation'],
    image: '/services/ai-automation.svg',
    category: 'AI',
    cta: 'Automate your workflow',
    priceRange: 'Project-based, typically $1.5k–$10k',
    duration: '2–6 weeks per engagement',
    process: [
      { step: '01', title: 'Workflow audit', description: 'We sit with the people who actually do the work and list the top five repetitive tasks. I write them up as a short list of candidate automations.' },
      { step: '02', title: 'Automation design', description: 'A one-pager per chosen workflow: trigger, inputs, decision points, the AI or integration layer, and what success looks like for the human at the end.' },
      { step: '03', title: 'Build & test', description: 'The automation is built in your own environment, tested against real samples, and rolled out behind a flag so your team can adopt at their own pace.' },
      { step: '04', title: 'Measure & iterate', description: 'Two weeks of post-launch observation, a written summary of what actually changed for the team, and a backlog of follow-up automations.' },
    ],
    deliverables: [
      'Working automation in your environment',
      'A short written playbook for the team that will own it',
      'A list of edge cases the automation does not yet cover',
      'A backlog of follow-up automations ranked by impact',
    ],
    goodFit: [
      'You have a small team doing too much manual handoff work',
      'You already pay for tools whose APIs you have never used',
      'You want a measurable reduction in repetitive operational tasks',
      'You prefer a thin layer of AI over a full platform replacement',
    ],
    notGoodFit: [
      'You want a custom-trained foundation model on your own data',
      'You need 24/7 production monitoring for an AI system',
      'The task is too vaguely defined to know what "done" looks like',
    ],
    faqs: [
      { question: 'Which AI providers do you usually work with?', answer: 'OpenAI and Anthropic for hosted models, Ollama for local inference, and Hugging Face for open-source options. The choice is driven by the data and the latency/cost tradeoffs you can accept.' },
      { question: 'Can you integrate with our existing tools?', answer: 'Yes. Most modern SaaS tools have a public API or a webhook, and the ones that do not usually have a Zapier/Make/n8n bridge that is good enough for a first pass.' },
      { question: 'How do you handle hallucination risk?', answer: 'For every workflow we agree on what the AI is allowed to do autonomously and what needs a human in the loop. The deliverable always includes the human-review step where it is required.' },
      { question: 'Do you build chatbots?', answer: 'I build chatbots only when they are the right shape for the problem. Most of my recent work is backend automation with a chat interface, not a customer-facing chat widget.' },
    ],
  },
  {
    title: 'Custom Browser Solutions',
    slug: 'browser-extensions',
    description: 'Specialized browser extensions for productivity, automation, and content filtering.',
    detailedDescription: 'Custom browser tools tailored to specific workflow needs, from DOM-level filtering to automated data extraction and privacy enhancement.',
    features: ['Chrome & Firefox extension development', 'Workflow automation tools', 'Content & privacy filtering', 'TypeScript-based extension core'],
    image: '/services/browser-extensions.svg',
    category: 'Automation',
    cta: 'Build your tool',
    priceRange: 'Project-based, typically $1.5k–$7k',
    duration: '2–5 weeks per engagement',
    process: [
      { step: '01', title: 'Behaviour spec', description: 'We agree on the exact behaviour the extension will and will not have, the sites it must work on, and the permissions it will request from the browser.' },
      { step: '02', title: 'Prototype', description: 'A working prototype against your target site(s) so you can dogfood the workflow before we invest in polish and edge cases.' },
      { step: '03', title: 'Build & review', description: 'The full extension is built in your repo, with a privacy policy, store listing copy, and screenshots ready for submission.' },
      { step: '04', title: 'Submit & support', description: 'Submission to the Chrome Web Store and Firefox Add-ons, plus a 30-day window for store-review fixes and small UX tweaks.' },
    ],
    deliverables: [
      'Extension source in your Git repository',
      'Packaged build ready for store submission',
      'Privacy policy and store listing copy',
      'Submission to Chrome Web Store and Firefox Add-ons',
      '30-day post-submission support window',
    ],
    goodFit: [
      'You have a workflow that runs entirely in the browser',
      'You want a privacy-respecting alternative to a SaaS tool',
      'You need DOM-level automation that no off-the-shelf tool offers',
      'You are comfortable shipping a small piece of software to a store',
    ],
    notGoodFit: [
      'You need a full cross-platform desktop application',
      'You want to scrape content behind a login in a way that violates the site ToS',
      'The "extension" is really a SaaS dashboard with a tiny browser surface',
    ],
    faqs: [
      { question: 'Do you publish under your account or mine?', answer: 'Yours. Extensions live in your developer account on the Chrome Web Store and on addons.mozilla.org, so you own the distribution and the user list from day one.' },
      { question: 'How do you handle content scripts and permissions?', answer: 'I write the smallest possible permission set. Most of my extensions ship with no `<all_urls>` permission and instead register against the specific host patterns the spec calls out.' },
      { question: 'Can you work on top of an existing extension?', answer: 'Yes, after a short code review. I will quote a refactor first if the existing codebase has not been touched in a long time and the manifest version is behind.' },
      { question: 'What about the Firefox vs Chrome differences?', answer: 'The Manifest V3 gap has narrowed, but there are still real differences. I always test on both browsers during the build phase and document any places where the behaviour diverges.' },
    ],
  },
  {
    title: 'Infrastructure & IT Operations',
    slug: 'it-operations',
    description: 'Reliable VPS hosting, corporate email, and secure server configuration for growing teams.',
    detailedDescription: 'Strategic setup and management of your digital foundation, ensuring high availability and professional-grade communication systems.',
    features: ['VPS & Hosting management', 'Corporate email setup', 'Security configuration', 'Operational IT support'],
    image: '/services/it-operations.svg',
    category: 'Infrastructure',
    cta: 'Set up foundation',
    priceRange: 'Monthly retainer or one-off setup',
    duration: 'Ongoing or 1–3 weeks for setup',
    process: [
      { step: '01', title: 'Environment review', description: 'I review your current hosting, mail, and domain setup and write up what is healthy, what is risky, and what is overdue for an upgrade.' },
      { step: '02', title: 'Architecture plan', description: 'A written plan covering server choice, mail provider, DNS layout, backup cadence, and the security baseline you can hand to an auditor.' },
      { step: '03', title: 'Build & migrate', description: 'The new environment is built in parallel where possible, then cut over with a documented rollback path. Mail migration includes a warm-up window.' },
      { step: '04', title: 'Operate & support', description: 'Optional monthly retainer for patching, monitoring, and small changes. You always keep admin access; I am there to back you up, not to lock you in.' },
    ],
    deliverables: [
      'Documented infrastructure architecture',
      'Server and mail configuration as code (Ansible or scripts)',
      'Backup verification report',
      'A short runbook for the on-call owner',
      'Optional monthly retainer for ongoing operations',
    ],
    goodFit: [
      'You are tired of an unmanaged VPS that pages you at 3am',
      'Your corporate email deliverability is hurting your domain reputation',
      'You want infrastructure as code, not a "tribal knowledge" server',
      'You are growing and need someone to own the operational layer',
    ],
    notGoodFit: [
      'You want a fully managed cloud platform migration (GCP / AWS) at scale',
      'You need 24/7 NOC or on-call rotation across time zones',
      'You are looking for office-network or endpoint-management work',
    ],
    faqs: [
      { question: 'Which cloud providers do you work with?', answer: 'Mostly Hetzner, DigitalOcean, and Vultr for smaller projects, with AWS and GCP for clients that are already on them. I will tell you when a hyperscaler is overkill.' },
      { question: 'Do you handle corporate email deliverability?', answer: 'Yes. SPF, DKIM, DMARC, IP warming, and feedback loops are part of the standard setup. Most of the deliverability issues I see are configuration, not infrastructure.' },
      { question: 'Can you take over an existing server I do not understand?', answer: 'Yes, after an audit. The first deliverable is a written assessment of what is there, what is risky, and what the cleanup plan would look like.' },
      { question: 'What is the monthly retainer for?', answer: 'Patching, monitoring, small changes, and a 4-hour response window for incident triage. It is meant to keep a small team off the on-call rotation, not to replace an internal ops team.' },
    ],
  },
];

export const heroMetrics = [
  { label: 'Production Sites', value: '10+' },
  { label: 'Security Articles', value: '70+' },
  { label: 'Astro Theme', value: '1' },
  { label: 'Data Experience', value: '5y+' },
];

export const capabilities = [
  'Astro, TypeScript, Tailwind, and static-first web products',
  'AI-assisted workflows, automation systems, and practical tool integrations',
  'VPS, hosting, corporate email, website, and e-commerce operations',
  'ETL architecture, PostgreSQL, SQL Server, NoSQL, dashboards, and reporting',
  'Browser extensions, privacy tooling, and red-team security writing',
  'Rust backend services with Axum, Tokio, PostgreSQL, and SQLx',
];

export const experience = [
  {
    date: 'Jan 2026 - Present',
    role: 'System Architect',
    company: 'Solar Nusantara',
    location: 'Yogyakarta',
    content:
      'Leads architecture, design, and maintenance for company websites and platforms including solar-nusantara.id, sonus-hub.id, sonus-epc.id, and indonesia-terang.id.',
    bullets: [
      'Defines system architecture, technology stack selection, and long-term scalability.',
      'Modernizes public web platforms with Astro-focused performance and SEO practices.',
      'Maintains production websites and platform reliability for renewable energy operations.',
    ],
  },
  {
    date: 'Sep 2023 - Present',
    role: 'Cybersecurity Writer',
    company: 'Medium',
    location: 'Remote',
    content:
      'Writes practical cybersecurity notes with a red-team perspective across Medium publications such as InfoSec Write-ups, System Weakness, and OSINT Team.',
    bullets: ['Published 70+ cybersecurity articles.', 'Focuses on offensive security, OSINT, and applied security learning.'],
  },
  {
    date: 'Sep 2023 - Dec 2025',
    role: 'Information Technology Engineer',
    company: 'Solar Nusantara',
    location: 'Yogyakarta',
    content:
      'Designed, installed, maintained, tested, configured, and troubleshot server, mail, website, and networking systems for operational needs.',
    bullets: [
      'Maintained internal hosting, company websites, mail systems, and supporting infrastructure.',
      'Handled troubleshooting and configuration work across server, website, and network systems.',
    ],
  },
  {
    date: 'Apr 2023 - Sep 2023',
    role: 'Data Specialist',
    company: 'PT Tripower Solar Nusantara',
    location: 'Yogyakarta',
    content:
      'Led digital-sector responsibilities from database management to corporate and e-commerce website development and maintenance.',
    bullets: [
      'Managed database and web operations across corporate and commerce sites.',
      'Supported product data structure and digital workflow needs.',
    ],
  },
  {
    date: 'Nov 2019 - Apr 2023',
    role: 'Data Engineer',
    company: 'PT Multipolar Technology Tbk',
    location: 'Tangerang',
    content:
      'Served on a Big Data team building ETL flows, data warehouse mappings, internal dashboards, and reporting systems for client analytics.',
    bullets: [
      'Worked with PostgreSQL, SQL Server, NoSQL, Talend, SSIS, IBM Cognos, DevExpress, Tableau, Power BI, Superset, R, and Python.',
      'Collaborated on data platform applications used for analysis and reporting.',
    ],
  },
];

export const projects: ProjectEntry[] = [
  {
    name: 'Zenix Theme',
    domain: 'Astro Theme Directory',
    category: 'Astro',
    filterCategory: 'other',
    description: 'High-performance, minimalist Astro theme for technical personal brands.',
    details: 'A free, open-source Astro theme built around content-first design and a small component surface. Ships with dark mode, a 3-col service grid, a writing section, and a contact form. Designed to be cloned and re-skinned without touching the framework layer.',
    stack: ['Astro', 'TypeScript', 'UnoCSS', 'MDX'],
    outcome: 'Published on official Astro theme directory',
    href: 'https://zenix.farros.co',
    image: 'zenix-farros-co.png',
    size: 'small',
    featured: true,
  },
  {
    name: 'KIW Commerce',
    domain: 'Industrial E-commerce',
    category: 'E-commerce',
    filterCategory: 'commerce',
    description: 'Procurement platform for industrial, energy, and utility materials.',
    details: 'A B2B/B2G procurement platform for industrial and energy-sector buyers. Built around long-form product specs, request-for-quote flows, and account-based pricing. Focus on reducing the friction of large-catalog technical purchasing.',
    stack: ['Astro', 'TypeScript', 'PostgreSQL'],
    outcome: 'Product catalog, procurement flow, B2B/B2G commerce',
    href: 'https://shop.kiw.co.id',
    image: 'shop-kiw-co-id.png',
    size: 'large',
    featured: true,
  },
  {
    name: 'Gladys',
    domain: 'AI Education',
    category: 'Education',
    filterCategory: 'education',
    description: 'AI education companion website for helping high school students explore majors and career paths.',
    details: 'Landing site for an AI companion that helps Indonesian high-school students explore majors, career paths, and study tracks. Conversational UX in Bahasa Indonesia, with a soft conversion funnel toward the parent product.',
    stack: ['Astro', 'TypeScript'],
    outcome: 'Education landing page, service positioning, conversion flow',
    href: 'https://tentang.gladys.id',
    image: 'tentang-gladys-id.png',
    size: 'medium',
    featured: true,
  },
  {
    name: 'AESI Marketplace',
    domain: 'Solar Association Commerce',
    category: 'E-commerce',
    filterCategory: 'commerce',
    description: 'Marketplace experience for Indonesia solar energy association commerce needs.',
    details: 'Marketplace storefront for the Indonesian Solar Energy Association (AESI), giving member companies a shared commerce surface for solar products, services, and partner offers. Designed for low-bandwidth browsing and WhatsApp handoff.',
    stack: ['WordPress', 'WooCommerce'],
    outcome: 'Association storefront and product discovery',
    href: 'https://ecommerce.aesi.or.id',
    image: 'ecommerce-aesi-or-id.png',
    size: 'small',
    featured: true,
  },
  {
    name: 'Ngajiin',
    domain: 'Education Platform',
    category: 'Education',
    filterCategory: 'education',
    description: 'Islamic learning platform for streamlined student management and progress tracking.',
    details: 'A web platform for Islamic learning programs, focused on simplifying student onboarding, lesson scheduling, and progress reporting for parents and teachers. Lightweight, mobile-first, and built for low-end devices on Indonesian networks.',
    stack: ['Astro', 'TypeScript'],
    outcome: 'Learning management, student monitoring',
    href: 'https://ngajiin.web.id',
    image: 'ngajiin-web-id.png',
    size: 'small',
    featured: true,
  },
  {
    name: 'SonusHUB',
    domain: 'B2B Marketplace',
    category: 'Marketplace',
    filterCategory: 'commerce',
    description: 'Marketplace for electrical and renewable energy materials.',
    details: 'A B2B marketplace for sourcing electrical and renewable energy materials, with a focus on supplier discovery, RFQ flows, and category navigation across hundreds of SKUs.',
    stack: ['Astro', 'TypeScript'],
    outcome: 'Marketplace experience, supplier navigation, commerce handoff',
    href: 'https://sonushub.id',
    image: 'sonushub-id.png',
    size: 'medium',
    featured: true,
  },
  {
    name: 'AESI',
    domain: 'Solar Association',
    category: 'Association',
    filterCategory: 'other',
    description: 'Main web presence for Asosiasi Energi Surya Indonesia.',
    details: 'Public information site for the Indonesian Solar Energy Association: member directory, news, event calendar, and policy briefs. Designed to be a long-form reading experience for industry stakeholders.',
    stack: ['WordPress'],
    outcome: 'Association identity, member access, public information',
    href: 'https://aesi.or.id',
    image: 'aesi-or-id.png',
    size: 'small',
  },
  {
    name: 'Solar Nusantara',
    domain: 'Renewable Energy',
    category: 'Energy',
    filterCategory: 'energy',
    description: 'Renewable energy company website and operational digital presence.',
    details: 'Corporate site for Solar Nusantara, a renewable energy services and operations company. Public-facing service explanations, project portfolio, and an enquiry flow for EPC and O&M work.',
    stack: ['Astro', 'TypeScript'],
    outcome: 'Brand site, energy services, infrastructure visibility',
    href: 'https://solar-nusantara.id',
    image: 'solar-nusantara-id.png',
    size: 'medium',
  },
  {
    name: 'SonusHUB Profile',
    domain: 'Electrical Materials',
    category: 'Marketplace',
    filterCategory: 'commerce',
    description: 'B2B material platform for electrical and renewable energy needs.',
    details: 'Sister site to SonusHUB, focused on profile pages for partner brands and material categories. Acts as a lead-generation front door for the parent marketplace.',
    stack: ['Astro', 'TypeScript'],
    outcome: 'Lead generation, product positioning, partner trust',
    href: 'https://sonus-hub.id',
    image: 'sonus-hub-id.png',
    size: 'small',
  },
  {
    name: 'Sonus EPC',
    domain: 'Clean Energy EPC',
    category: 'Energy',
    filterCategory: 'energy',
    description: 'Clean and renewable energy solutions website for EPC services.',
    details: 'Marketing site for the EPC (engineering, procurement, construction) arm of the Sonus group, covering solar and BESS project delivery. Long-form project pages and a heavy emphasis on technical credibility.',
    stack: ['Astro'],
    outcome: 'Service communication and project positioning',
    href: 'https://sonus-epc.id',
    image: 'sonus-epc-id.png',
    size: 'small',
  },
  {
    name: 'Indonesia Terang',
    domain: 'Sustainability',
    category: 'Energy',
    filterCategory: 'energy',
    description: 'Energy and sustainability platform for impact-oriented reporting.',
    details: 'A sustainability and impact-reporting platform for Indonesian energy access programs. Designed for editorial-style storytelling around projects, with a focus on data visualisations of energy access and emissions impact.',
    stack: ['Astro'],
    outcome: 'Sustainability communication and reporting presence',
    href: 'https://indonesia-terang.id',
    image: 'indonesia-terang-id.png',
    size: 'small',
  },
  {
    name: 'Kidiko',
    domain: 'AI Education',
    category: 'Education',
    filterCategory: 'education',
    description: 'AI learning platform for WhatsApp-based student questions and teacher monitoring.',
    details: 'A WhatsApp-native AI learning companion for K-12 students, with a teacher dashboard for monitoring engagement and outcomes. Web landing page targets school procurement and parent sign-up.',
    stack: ['Astro', 'TypeScript'],
    outcome: 'AI product page, education positioning, conversion flow',
    href: 'https://kidiko.id',
    image: 'kidiko-id.png',
    size: 'small',
  },
  {
    name: 'Aurora Nutrima',
    domain: 'Industrial Catering',
    category: 'Industrial Services',
    filterCategory: 'commerce',
    description: 'Industrial catering website for business-scale food service operations.',
    details: 'Corporate site for an industrial catering operator serving factory sites, mining camps, and remote work locations. Service descriptions, certifications, and an enquiry flow for B2B contracts.',
    stack: ['WordPress'],
    outcome: 'Service trust, client communication, lead generation',
    href: 'https://aurora-nutrima.id',
    image: 'aurora-nutrima-id.png',
    size: 'small',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const featuredWork = [
  {
    name: 'Zenix',
    type: 'Astro Theme',
    href: 'https://astro.build/themes/details/zenix/',
    description: 'Free Astro theme published on the official Astro theme directory.',
  },
  {
    name: 'NoA Blocker',
    type: 'Firefox Add-on',
    href: 'https://addons.mozilla.org/en-US/firefox/addon/noa-blocker/',
    description: 'DOM-level keyword and content filtering browser extension.',
  },
  {
    name: 'farrosfr.com',
    type: 'Writing',
    href: 'https://farrosfr.com',
    description: 'Substack custom domain for cybersecurity and engineering writing.',
  },
];

export const certificates = [
  { year: '2026', name: 'Intermediate SQL Server', issuer: 'DataCamp', group: 'Data/SQL' },
  { year: '2026', name: 'Introduction to SQL Server', issuer: 'DataCamp', group: 'Data/SQL' },
  { year: '2025', name: 'Cyber Security 101', issuer: 'TryHackMe', group: 'Cybersecurity' },
  { year: '2025', name: 'Introduction to Cyber Security', issuer: 'TryHackMe', group: 'Cybersecurity' },
  { year: '2025', name: 'Cybersecurity for Small and Medium Size Business', issuer: 'EC-Council', group: 'Cybersecurity' },
  { year: '2025', name: 'Introduction to Cybersecurity', issuer: 'Cisco', group: 'Cybersecurity' },
  { year: '2025', name: 'Pre Security', issuer: 'TryHackMe', group: 'Cybersecurity' },
  { year: '2024', name: 'Foundations of Prompt Engineering', issuer: 'AWS', group: 'AI' },
  { year: '2024', name: 'Introduction to Generative AI', issuer: 'AWS', group: 'AI' },
  { year: '2024', name: 'Working with the OpenAI API', issuer: 'DataCamp', group: 'AI' },
  { year: '2024', name: 'Responsive Web Design', issuer: 'freeCodeCamp', group: 'Web Development' },
  { year: '2024', name: 'Introduction to Information Security', issuer: 'Cyber Academy Indonesia', group: 'Cybersecurity' },
  { year: '2019', name: 'R Programming for Data Science', issuer: 'idata1011 Data Science Community', group: 'Data/SQL' },
];

export const awards = [
  {
    title: 'Finalist of Open Covid-19 Competition with Artificial Intelligence',
    issuer: 'BISA AI',
    date: 'May 2020',
    description: 'Research journal on Twitter social network analysis for Covid-19 topics.',
  },
  {
    title: '1st Winner of Challenge 3 Data Waste Hackathon',
    issuer: 'Second Muse',
    date: 'Oct 2019',
    description: 'Built Yo Waste, a platform for garbage price data and city waste prediction education.',
  },
  {
    title: 'Digital Talent Internet of Things Scholarship Awardee',
    issuer: 'Ministry of Research, Technology and Higher Education Indonesia',
    date: 'Aug 2019',
    description: 'IoT scholarship associated with Institut Teknologi Sepuluh Nopember.',
  },
  {
    title: 'Grand Finalist Data Mining GemasTIK 11th',
    issuer: 'Ministry of Research, Technology and Higher Education Indonesia',
    date: 'Nov 2018',
    description: 'Journal series classification using KNN for final-stage analysis.',
  },
];

export const navItems = [
  { name: 'Web Porto', href: '/web-porto/' },
  { name: 'Writing', href: '/writing' },
  { name: 'CV', href: '/cv' },
  { name: 'Contact', href: '/contact' },
];

export const searchItems = [
  { title: 'Services', description: 'View professional advisory services.', href: '/#services', type: 'Services' },
  { title: 'Writing', description: 'Notes on security, data, and engineering from farrosfr.com.', href: '/writing', type: 'Writing' },
  { title: 'Web Portfolio', description: 'See the full website portfolio.', href: '/web-porto/', type: 'Portfolio' },
  { title: 'Contact', description: 'Send a message or find direct lines (email, WhatsApp, social).', href: '/contact', type: 'Contact' },
  ...services.map((item) => ({ title: item.title, description: item.description, href: `/services/${item.slug}`, type: 'Service' })),
  { title: 'View CV', description: 'Open the designed web CV page.', href: '/cv', type: 'CV' },
  { title: 'Download PDF', description: 'Download the 2026 CV PDF.', href: profile.cvPath, type: 'Document' },
  { title: 'Certificates', description: 'Review highlighted certificates and credentials.', href: '/cv#certificates', type: 'CV' },
  { title: 'Writing', description: 'Read cybersecurity and engineering notes.', href: profile.medium, type: 'Writing' },
  { title: 'Send message', description: 'Open the contact form.', href: '/contact', type: 'Contact' },
  ...featuredWork.map((item) => ({ title: item.name, description: item.description, href: item.href, type: item.type })),
  ...projects.map((item) => ({ title: item.name, description: item.description, href: item.href, type: item.category })),
];
