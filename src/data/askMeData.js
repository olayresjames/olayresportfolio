import { awards, certifications, education, experiences, featuredSongs, projects, skillGroups, socialProfiles } from './siteData';
import { caseStudies } from './caseStudyData';
import { respondToAskMe } from './askMeResponder';

const normalize = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#.\s]/g, ' ').replace(/\s+/g, ' ').trim();
const listWords = values => values.length < 2 ? values.join('') : `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;

const projectTopics = projects.map(project => {
  const projectWords = project.name.toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 3);
  const projectAliases = {
    'point-nemo': ['pointnemo', 'team pointnemo'],
    agapai: ['agap ai'],
    'pnp-idtms': ['pnp idtms', 'idtms', 'pnp itms', 'pnp internship system', 'internship database tracking management system'],
    'pais-2': ['pais 2', 'personnel assignment information system'],
    'camp-navi': ['camp navi', 'camp crame navigation'],
    'pnp-assignment-system': ['pnp survey system', 'personnel assignment survey'],
    'legend-of-cee': ['legend of cee', 'shadows of the ruined king'],
    foliofy: ['folio fy'],
    reset: ['reset endless horror', 'endless horror'],
  }[project.id] || [];
  const extraKeywords = {
    'point-nemo': ['point nemo', 'hackathon', 'study expedition', 'local first', 'local-first', 'ollama', 'qwen', 'sonar', 'depth zones', 'creature encounters', 'pdf study'],
    agapai: ['emergency', 'sos', 'senior', 'seniors', 'guardian', 'guardians', 'rescue', 'health monitoring', 'gemini', 'capstone'],
    'pnp-idtms': ['pnp', 'internship', 'attendance', 'dtr', 'database', 'camp crame', 'supabase'],
    'pais-2': ['pnp', 'internship', 'personnel', 'assignment', 'hr', 'uniformed', 'civilian', 'camp crame'],
    'camp-navi': ['camp crame', 'geofencing', 'navigation', 'security', 'checkpoints', 'routes'],
    'pnp-assignment-system': ['pnp', 'survey', 'preferred locations', 'assignment', 'uniformed personnel', 'movement'],
    foliofy: ['documents', 'document', 'word', 'pdf', 'images', 'image collections', 'indexeddb', 'export'],
    reset: ['horror', 'game', 'time loop', 'itch'],
    pagpag: ['card game', 'game logic', 'gameplay'],
    'sword-phantasia': ['rpg', 'tkinter', 'pygame', 'desktop game'],
    suriel: ['cafe', 'ordering', 'reservations', 'supabase'],
    verdemelt: ['storefront', 'ecommerce', 'shop', 'tailwind'],
  }[project.id] || [];

  const caseStudyKeys = {
    'point-nemo': 'pointNemo',
    'legend-of-cee': 'legendOfCee',
    'pnp-idtms': 'pnp',
    agapai: 'agapai',
    foliofy: 'foliofy',
  };
  const caseStudy = caseStudies[caseStudyKeys[project.id]];
  const details = [
    ...(caseStudy?.blocks || []),
    ...(caseStudy?.architecture || []).map(section => [section.title, section.description]),
  ];
  let answer = `${project.name}: ${caseStudy?.lede || project.summary || project.description}`;
  if (project.proof) answer += ` ${project.proof}`;
  const facts = Object.fromEntries(project.facts || []);
  if (facts.Role) answer += `\n\nRole: ${facts.Role}`;
  if (facts.Problem || facts.Challenge) answer += `\n\nProblem: ${facts.Problem || facts.Challenge}`;
  if (facts.Built || facts.Solution) answer += `\n\nBuilt: ${facts.Built || facts.Solution}`;

  return {
    id: project.id,
    name: project.name,
    aliases: projectAliases,
    technologies: project.technologies || [],
    facts,
    details,
    caseStudyMeta: caseStudy?.meta || [],
    keywords: [project.id, ...projectWords, ...projectAliases, ...extraKeywords, ...project.technologies],
    phrases: [project.name, ...projectAliases, ...extraKeywords.filter(keyword => keyword.includes(' '))],
    priority: 3,
    answer,
    links: [
      ...(project.caseStudyUrl ? [{ label: 'Read case study', href: project.caseStudyUrl }] : []),
      ...(project.liveUrl ? [{ label: 'Open live demo', href: project.liveUrl, external: true }] : []),
      ...(project.url ? [{ label: project.linkLabel || 'View project', href: project.url, external: true }] : []),
    ],
  };
});

const skillAliases = {
  'HTML5 & CSS3': ['html', 'html5', 'css', 'css3'],
  'React.js': ['react', 'reactjs', 'react js'],
  'React Native + Expo': ['react native', 'expo'],
  'Node.js': ['node', 'nodejs', 'node js'],
  'Express': ['express', 'expressjs', 'express js'],
  'Tailwind CSS': ['tailwind'],
  'Progressive Web Apps': ['pwa', 'progressive web app'],
  'PostgreSQL': ['postgres', 'postgresql'],
  'JWT Authentication': ['jwt', 'authentication'],
  'Google Gemini API': ['gemini', 'google gemini'],
  'Local AI (Ollama)': ['ollama', 'local ai', 'local inference'],
  'OpenAI API': ['openai'],
};
const projectTechnologyTerms = [...new Set(projects.flatMap(project => project.technologies || []))];
const skillGroupAliases = skillGroups.flatMap(([, skills]) => skills.flatMap(skill => [skill, ...(skillAliases[skill] || [])]));
const allSkillAliases = [...skillGroupAliases, ...projectTechnologyTerms];
const experienceList = experiences.map(item => `${item.title} (${item.year})`).join('; ');
const featuredSongList = featuredSongs.map(([title]) => title).join(', ');
const certificationList = certifications.map(item => `${item.title} — ${item.issuer}`).join('; ');

export const askMeTopics = [
  ...projectTopics,
  {
    id: 'projects',
    keywords: ['project', 'projects', 'work', 'portfolio', 'built', 'made', 'featured'],
    phrases: ['what have you built', 'selected work', 'what projects'],
    priority: 2,
    answer: `I have built ${projects.length} selected projects across civic technology, AI integration, web platforms, productivity tools, and games. The portfolio includes ${projects.map(project => project.name).join(', ')}.`,
    links: [{ label: 'View selected projects', href: '#projects' }],
  },
  {
    id: 'skills',
    name: 'skills and tools',
    keywords: ['skill', 'skills', 'stack', 'technology', 'technologies', 'tools', 'tech', 'framework', 'backend', 'frontend', 'database', 'databases', 'programming language', 'languages', 'networking', 'deployment', 'ai', ...allSkillAliases],
    phrases: ['what do you use', 'what technologies'],
    priority: 2,
    answer: `My current stack includes:\n\n${skillGroups.map(([group, skills]) => `${group}: ${skills.join(', ')}`).join('\n\n')}`,
    links: [{ label: 'View full stack', href: '#stack' }],
  },
  {
    id: 'profile',
    keywords: ['rafhael', 'james', 'olayres', 'name', 'profile', 'bio', 'background'],
    phrases: ['what is your name', 'who is rafhael james olayres', 'tell me about rafhael'],
    priority: 3,
    answer: 'I am Rafhael James Olayres, a full-stack developer and BS Information Technology student at Pamantasan ng Lungsod ng Valenzuela in Valenzuela City, Philippines. I build web, mobile, and AI-integrated products, and have worked on freelance web development since 2023.',
    links: [{ label: 'Read about me', href: '#about' }, { label: 'View experience', href: '#experience' }],
  },
  {
    id: 'role',
    keywords: ['developer', 'designer', 'role', 'specialize', 'specialty', 'focus', 'full stack', 'full-stack', 'student'],
    phrases: ['what do you do', 'who are you', 'tell me about yourself'],
    priority: 2,
    answer: 'I’m a full-stack developer and IT student building practical web, mobile, and AI-powered products. I also work across product design, frontend architecture, database-backed systems, and user-centered workflows.',
    links: [{ label: 'Read about me', href: '#about' }],
  },
  {
    id: 'experience',
    keywords: ['experience', 'work history', 'internship', 'freelance', 'background', 'current'],
    phrases: ['where have you worked'],
    priority: 2,
    answer: `My listed experience includes ${experienceList}. I’m currently developing the PNP Internship Database Tracking Management System and completing an internship with the Camp Crame ITMS Office under the Special Project Management Team.`,
    links: [{ label: 'View experience', href: '#experience' }],
  },
  {
    id: 'education',
    keywords: ['education', 'school', 'study', 'student', 'degree', 'university', 'college'],
    phrases: ['where do you study', 'what are you studying'],
    priority: 2,
    answer: `I am pursuing a BS Information Technology degree at ${education[0].school} during ${education[0].period}. My studies cover software engineering, networking, databases, game development, and emerging technologies.`,
    links: [{ label: 'View education', href: '#education' }],
  },
  {
    id: 'current-work',
    name: 'current work',
    keywords: ['currently', 'current work', 'working on', 'right now', 'ongoing', 'present'],
    phrases: ['what are you working on', 'what are you building now', 'current projects'],
    priority: 3,
    answer: 'My current work includes the PNP Internship Database Tracking Management System and AgapAI, an emergency support and health platform for seniors, guardians, and local responders. I am the tech lead for our AgapAI capstone team and developed its mobile app, website, and admin endpoint. I am also studying Information Technology at Pamantasan ng Lungsod ng Valenzuela.',
    links: [
      { label: 'Explore PNP IDTMS', href: '/pnp-idtms-case-study.html' },
      { label: 'Explore AgapAI', href: '/agapai-case-study.html' },
    ],
  },
  {
    id: 'ai',
    keywords: ['ai', 'gemini', 'openai', 'artificial intelligence', 'assistant'],
    phrases: ['how do you use ai'],
    priority: 3,
    answer: 'My AI-related work includes AgapAI, where I am tech lead for the capstone team and developed the mobile app, website, and admin endpoint, with a Gemini-powered assistant. It also includes Point Nemo, a local-first study app that uses Ollama for question generation by default. Point Nemo keeps document text, prompts, and answers on the user’s computer during its study flow; its default model is qwen2.5:1.5b.',
    links: [{ label: 'Explore Point Nemo', href: '/point-nemo-case-study.html' }, { label: 'Explore AgapAI', href: '/agapai-case-study.html' }],
  },
  {
    id: 'mobile',
    keywords: ['mobile', 'android', 'ios', 'expo', 'react native', 'app'],
    phrases: ['mobile development'],
    priority: 3,
    answer: 'I am the tech lead for the AgapAI capstone team and developed its React Native and Expo mobile app, website, and admin endpoint. The platform supports emergency rescue, health monitoring, AI assistance, and connected workflows for seniors, guardians, and local responders.',
    links: [{ label: 'Explore AgapAI', href: '/agapai-case-study.html' }],
  },
  {
    id: 'pnp-details',
    keywords: ['dtr', 'qr', 'face verification', 'row level security', 'authorization', 'intern records'],
    phrases: ['how does pnp work', 'pnp system'],
    priority: 4,
    answer: 'The PNP Internship Database Tracking Management System centralizes attendance, daily time records, intern documents, evaluations, projects, calendar events, announcements, notifications, and legal consent. Its attendance flow uses time-sensitive QR scanning and face verification, with authorization across the frontend, API, and database.',
    links: [{ label: 'Read PNP case study', href: '/pnp-idtms-case-study.html' }],
  },
  {
    id: 'music',
    keywords: ['music', 'song', 'songs', 'artist', 'esskid', 'soundcloud', 'youtube', 'hobby', 'hobbies'],
    phrases: ['what music do you make', 'what do you do outside coding'],
    priority: 2,
    answer: `Outside development, I make music as esskid and share songs on SoundCloud and YouTube. Featured tracks include ${featuredSongList}.`,
    links: [
      { label: 'SoundCloud', href: 'https://soundcloud.com/esskid', external: true },
      { label: 'YouTube', href: 'https://www.youtube.com/@esskidwsg', external: true },
      { label: 'Music and hobbies', href: '#hobbies' },
    ],
  },
  {
    id: 'certifications',
    keywords: ['certificate', 'certification', 'freecodecamp', 'credential'],
    phrases: ['what certifications'],
    priority: 2,
    answer: `My listed certifications include ${certificationList}. Each certificate has a verification link on the portfolio.`,
    links: [{ label: 'View certifications', href: '#certifications' }],
  },
  {
    id: 'recognition',
    keywords: ['award', 'awards', 'trophy', 'people choice', 'first place', 'recognition'],
    priority: 3,
    answer: awards.length ? `Reset: Endless Horror received ${awards.map(award => `${award.title} (${award.category})`).join(', ')}.` : 'There are no awards listed yet.',
    links: [{ label: 'View awards and gallery', href: '/certifications' }],
  },
  {
    id: 'location',
    keywords: ['location', 'based', 'where', 'city', 'philippines', 'valenzuela'],
    phrases: ['where are you based'],
    priority: 2,
    answer: 'I’m based in Valenzuela City, Philippines.',
    links: [{ label: 'View contact section', href: '#contact' }],
  },
  {
    id: 'availability',
    keywords: ['available', 'hire', 'hiring', 'freelance', 'collaboration', 'collaborate', 'opportunity'],
    phrases: ['are you available', 'can i hire you'],
    priority: 4,
    answer: 'I’m open to internships, freelance work, and thoughtful collaborations.',
    links: [
      { label: 'Send me an email', href: 'mailto:olayres.rafhaeljames@gmail.com' },
      { label: 'View contact section', href: '#contact' },
    ],
  },
  {
    id: 'social',
    name: 'social media',
    keywords: ['social', 'social media', 'facebook', 'instagram', 'jmsolyrs', 'follow', 'profiles', 'handle'],
    phrases: ['where can i follow you', 'what are your social media accounts', 'contact you on facebook', 'contact you on instagram'],
    priority: 4,
    answer: `You can find me on ${listWords(socialProfiles.map(([, platform, handle]) => `${platform} (${handle})`))}.`,
    links: socialProfiles.map(([, platform, , href]) => ({ label: platform, href, external: true })),
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'message', 'linkedin', 'github'],
    phrases: ['how can i contact you', 'how do i reach you'],
    priority: 4,
    answer: 'You can reach me by email or connect with me on GitHub and LinkedIn.',
    links: [
      { label: 'Email me', href: 'mailto:olayres.rafhaeljames@gmail.com' },
      { label: 'GitHub', href: 'https://github.com/olayresjames', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/james-olayres-888721410', external: true },
    ],
  },
  {
    id: 'resume',
    keywords: ['resume', 'résumé', 'cv', 'curriculum'],
    phrases: ['show me your resume', 'download your resume'],
    priority: 4,
    answer: 'You can download my résumé from the portfolio navigation or use the link below.',
    links: [{ label: 'Download 2026 résumé', href: '/resources/olayres-resume-2026.pdf' }],
  },
];

export function scoreTopic(topic, query, queryWords) {
  let score = 0;
  const paddedQuery = ` ${query} `;
  for (const phrase of topic.phrases || []) {
    const value = normalize(phrase);
    if (value && paddedQuery.includes(` ${value} `)) score += query === value ? 14 : 10;
  }
  for (const keyword of topic.keywords || []) {
    const value = normalize(keyword);
    if (value && (value.includes(' ') ? paddedQuery.includes(` ${value} `) : queryWords.has(value))) score += value.includes(' ') ? 6 : 3;
  }
  return score ? score + (topic.priority || 1) * 0.25 : 0;
}

export function getAskMeAnswer(message, context = {}) {
  return respondToAskMe(message, context, askMeTopics);
}
