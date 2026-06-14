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
