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
  summary:
    'Statistics graduate from ITS with a professional background in data engineering, IT operations, Astro web development, browser extensions, backend tooling, and offensive security practice.',
};

export const services = [
  {
    title: 'High-Performance Web Architecture',
    slug: 'web-architecture',
    description: 'Minimalist, ultra-fast, and SEO-optimized web products built with Astro and TypeScript.',
    detailedDescription: 'I specialize in moving away from heavy, slow frameworks to lightweight, static-first architectures. This results in superior SEO ranking, near-instant load times, and reduced maintenance costs.',
    features: ['Astro & TypeScript implementation', 'Core Web Vitals optimization', 'Responsive Glassmorphism UI', 'Headless CMS integration'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop', // 1:1 placeholder
    category: 'Development',
    cta: 'Discuss your project',
  },
  {
    title: 'Security Assessment & Risk Review',
    slug: 'security-review',
    description: 'Vulnerability assessments and red-team perspective audits for web applications and infrastructure.',
    detailedDescription: 'Leveraging my experience as a cybersecurity writer and researcher, I identify critical security gaps in your systems before they can be exploited by attackers.',
    features: ['Web application pentesting', 'Infrastructure security review', 'Risk mitigation roadmap', 'Security writing & documentation'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', // 1:1 placeholder
    category: 'Security',
    cta: 'Secure your assets',
  },
  {
    title: 'Resilient Data Infrastructure',
    slug: 'data-engineering',
    description: 'Automated ETL pipelines and database architecture for reliable business intelligence.',
    detailedDescription: 'I build the "plumbing" for your data, ensuring it flows correctly from sources to your reporting tools with high integrity and minimal downtime.',
    features: ['ETL pipeline automation', 'Database optimization (SQL/NoSQL)', 'BI tool integration', 'Data warehouse mapping'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop', 
    category: 'Data',
    cta: 'Optimize your data',
  },
  {
    title: 'Custom Browser Solutions',
    slug: 'browser-extensions',
    description: 'Specialized browser extensions for productivity, automation, and content filtering.',
    detailedDescription: 'Custom browser tools tailored to specific workflow needs, from DOM-level filtering to automated data extraction and privacy enhancement.',
    features: ['Chrome & Firefox extension development', 'Workflow automation tools', 'Content & privacy filtering', 'TypeScript-based extension core'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop', 
    category: 'Automation',
    cta: 'Build your tool',
  },
  {
    title: 'Infrastructure & IT Operations',
    slug: 'it-operations',
    description: 'Reliable VPS hosting, corporate email, and secure server configuration for growing teams.',
    detailedDescription: 'Strategic setup and management of your digital foundation, ensuring high availability and professional-grade communication systems.',
    features: ['VPS & Hosting management', 'Corporate email setup', 'Security configuration', 'Operational IT support'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop', 
    category: 'Infrastructure',
    cta: 'Set up foundation',
  },
];

export const heroMetrics = [
  { label: 'Production Sites', value: '10+' },
  { label: 'Security Articles', value: '70+' },
  { label: 'Astro Theme', value: 'Zenix' },
  { label: 'Data Experience', value: '5y+' },
];

export const capabilities = [
  'Astro, TypeScript, Tailwind, and static-first web products',
  'VPS, hosting, corporate email, website, and e-commerce operations',
  'ETL architecture, PostgreSQL, SQL Server, NoSQL, dashboards, and reporting',
  'Browser extensions, privacy tooling, and red-team security writing',
  'Rust backend services with Axum, Tokio, PostgreSQL, and SQLx',
];

export const experience = [
  {
    date: 'Apr 2023 - Present',
    role: 'System Architect',
    company: 'PT Tripower Solar Nusantara',
    location: 'Yogyakarta',
    content:
      'Supports VPS servers, internal hosting, corporate email, security configuration, websites, e-commerce product databases, and onsite IT operations.',
    bullets: [
      'Develops and maintains aesi.or.id, solar-nusantara.id, sonus-hub.id, sonus-epc.id, and indonesia-terang.id.',
      'Organizes e-commerce product data structures, updates, and integration needs.',
      'Keeps operational infrastructure stable across departments.',
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

export const projects = [
  {
    name: 'Zenix Theme',
    domain: 'Astro Theme Directory',
    category: 'Astro',
    description: 'High-performance, minimalist Astro theme for technical personal brands.',
    outcome: 'Published on official Astro theme directory',
    href: 'https://zenix.farros.co',
    image: '/projects/zenix-farros-co.png',
    size: 'small',
  },
  {
    name: 'KIW Commerce',
    domain: 'Industrial E-commerce',
    category: 'E-commerce',
    description: 'Procurement platform for industrial, energy, and utility materials.',
    outcome: 'Product catalog, procurement flow, B2B/B2G commerce',
    href: 'https://shop.kiw.co.id',
    image: '/projects/shop-kiw-co-id.png',
    size: 'large',
  },
  {
    name: 'AESI Marketplace',
    domain: 'Solar Association Commerce',
    category: 'E-commerce',
    description: 'Marketplace experience for Indonesia solar energy association commerce needs.',
    outcome: 'Association storefront and product discovery',
    href: 'https://ecommerce.aesi.or.id',
    image: '/projects/ecommerce-aesi-or-id.png',
    size: 'small',
  },
  {
    name: 'Ngajiin',
    domain: 'Education Platform',
    category: 'Education',
    description: 'Islamic learning platform for streamlined student management and progress tracking.',
    outcome: 'Learning management, student monitoring',
    href: 'https://ngajiin.web.id',
    image: '/projects/ngajiin-web-id.png',
    size: 'small',
  },
  {
    name: 'SonusHUB',
    domain: 'B2B Marketplace',
    category: 'Marketplace',
    description: 'Marketplace for electrical and renewable energy materials.',
    outcome: 'Marketplace experience, supplier navigation, commerce handoff',
    href: 'https://sonushub.id',
    image: '/projects/sonushub-id.png',
    size: 'medium',
  },
  {
    name: 'AESI',
    domain: 'Solar Association',
    category: 'Association',
    description: 'Main web presence for Asosiasi Energi Surya Indonesia.',
    outcome: 'Association identity, member access, public information',
    href: 'https://aesi.or.id',
    image: '/projects/aesi-or-id.png',
    size: 'small',
  },
  {
    name: 'Solar Nusantara',
    domain: 'Renewable Energy',
    category: 'Energy',
    description: 'Renewable energy company website and operational digital presence.',
    outcome: 'Brand site, energy services, infrastructure visibility',
    href: 'https://solar-nusantara.id',
    image: '/projects/solar-nusantara-id.png',
    size: 'medium',
  },
  {
    name: 'SonusHUB Profile',
    domain: 'Electrical Materials',
    category: 'Marketplace',
    description: 'B2B material platform for electrical and renewable energy needs.',
    outcome: 'Lead generation, product positioning, partner trust',
    href: 'https://sonus-hub.id',
    image: '/projects/sonus-hub-id.png',
    size: 'small',
  },
  {
    name: 'Sonus EPC',
    domain: 'Clean Energy EPC',
    category: 'Energy',
    description: 'Clean and renewable energy solutions website for EPC services.',
    outcome: 'Service communication and project positioning',
    href: 'https://sonus-epc.id',
    image: '/projects/sonus-epc-id.png',
    size: 'small',
  },
  {
    name: 'Indonesia Terang',
    domain: 'Sustainability',
    category: 'Energy',
    description: 'Energy and sustainability platform for impact-oriented reporting.',
    outcome: 'Sustainability communication and reporting presence',
    href: 'https://indonesia-terang.id',
    image: '/projects/indonesia-terang-id.png',
    size: 'small',
  },
  {
    name: 'Kidiko',
    domain: 'AI Education',
    category: 'Education',
    description: 'AI learning platform for WhatsApp-based student questions and teacher monitoring.',
    outcome: 'AI product page, education positioning, conversion flow',
    href: 'https://kidiko.id',
    image: '/projects/kidiko-id.png',
    size: 'small',
  },
  {
    name: 'Aurora Nutrima',
    domain: 'Industrial Catering',
    category: 'Industrial Services',
    description: 'Industrial catering website for business-scale food service operations.',
    outcome: 'Service trust, client communication, lead generation',
    href: 'https://aurora-nutrima.id',
    image: '/projects/aurora-nutrima-id.png',
    size: 'small',
  },
];

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
  { name: 'Services', href: '/#services' },
  { name: 'Work', href: '/#projects' },
  { name: 'Profile', href: '/#about' },
  { name: 'CV', href: '/cv' },
  { name: 'Contact', href: `mailto:${profile.email}` },
];

export const searchItems = [
  { title: 'Services', description: 'View professional advisory services.', href: '/#services', type: 'Services' },
  ...services.map((item) => ({ title: item.title, description: item.description, href: `/services/${item.slug}`, type: 'Service' })),
  { title: 'View CV', description: 'Open the designed web CV page.', href: '/cv', type: 'CV' },
  { title: 'Download PDF', description: 'Download the 2026 CV PDF.', href: profile.cvPath, type: 'Document' },
  { title: 'Certificates', description: 'Review highlighted certificates and credentials.', href: '/cv#certificates', type: 'CV' },
  { title: 'Writing', description: 'Read cybersecurity and engineering notes.', href: profile.medium, type: 'Writing' },
  ...featuredWork.map((item) => ({ title: item.name, description: item.description, href: item.href, type: item.type })),
  ...projects.map((item) => ({ title: item.name, description: item.description, href: item.href, type: item.category })),
];
