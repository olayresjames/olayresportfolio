import { awards, caseStudies, certifications, education, experiences, projects, skillGroups } from './siteData';

const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#.\s]/g, ' ').replace(/\s+/g, ' ').trim();
const words = value => new Set(normalize(value).split(' ').filter(word => word.length > 2));
const caseStudyFor = project => Object.values(caseStudies).find(study => study.path === project.caseStudyUrl);
const blockValue = (study, labels) => study?.blocks.find(([label]) => labels.includes(label))?.[1];

const projectTopics = projects.map(project => {
  const study = caseStudyFor(project);
  const projectWords = project.name.toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 3);
  const extraKeywords = {
    agapai: ['emergency', 'sos', 'senior', 'seniors', 'guardian', 'guardians', 'rescue', 'health monitoring', 'gemini'],
    'pnp-idtms': ['pnp', 'internship', 'attendance', 'dtr', 'database', 'camp crame', 'supabase'],
    foliofy: ['documents', 'document', 'word', 'pdf', 'images', 'image collections', 'indexeddb', 'export'],
    reset: ['horror', 'game', 'time loop', 'itch'],
    pagpag: ['card game', 'game logic', 'gameplay'],
    'sword-phantasia': ['rpg', 'tkinter', 'pygame', 'desktop game'],
    suriel: ['cafe', 'ordering', 'reservations', 'supabase'],
    verdemelt: ['storefront', 'ecommerce', 'shop', 'tailwind'],
  }[project.id] || [];

  let answer = `${project.name}: ${project.summary || project.description}`;
  if (project.proof) answer += ` ${project.proof}`;
  if (study) {
    const role = blockValue(study, ['My role']);
    const problem = blockValue(study, ['The problem', 'The challenge']);
    const solution = blockValue(study, ['What I built', 'The solution']);
    if (role) answer += `\n\nRole: ${role}`;
    if (problem) answer += `\n\nProblem: ${problem}`;
    if (solution) answer += `\n\nBuilt: ${solution}`;
  }

  return {
    id: project.id,
    keywords: [project.id, ...projectWords, ...extraKeywords, ...project.technologies],
    phrases: [project.name, ...(extraKeywords.filter(keyword => keyword.includes(' ')))],
    priority: 3,
    answer,
    links: [
      ...(project.caseStudyUrl ? [{ label: 'Read case study', href: project.caseStudyUrl }] : []),
      ...(project.liveUrl ? [{ label: 'Open live demo', href: project.liveUrl, external: true }] : []),
      ...(project.url ? [{ label: project.linkLabel || 'View project', href: project.url, external: true }] : []),
    ],
  };
});

const skillList = skillGroups.flatMap(([, skills]) => skills).join(', ');
const experienceList = experiences.map(item => `${item.title} (${item.year})`).join('; ');
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
    keywords: ['skill', 'skills', 'stack', 'technology', 'technologies', 'tools', 'tech', 'framework', 'backend', 'frontend'],
    phrases: ['what do you use', 'what technologies'],
    priority: 2,
    answer: `My current stack includes ${skillList}.`,
    links: [{ label: 'View full stack', href: '#stack' }],
  },
  {
    id: 'role',
    keywords: ['developer', 'designer', 'role', 'specialize', 'specialty', 'focus'],
    phrases: ['what do you do', 'who are you'],
    priority: 2,
    answer: 'I’m a full-stack developer and IT student building practical web, mobile, and AI-powered products. I also work across product design, frontend architecture, database-backed systems, and user-centered workflows.',
    links: [{ label: 'Read about me', href: '#about' }],
  },
  {
    id: 'experience',
    keywords: ['experience', 'work history', 'internship', 'freelance', 'background', 'current'],
    phrases: ['where have you worked'],
    priority: 2,
    answer: `My listed experience includes ${experienceList}. I’m currently developing the PNP Internship Database Tracking Management System and completing an internship with the Camp Crame ITMS Office under SPMT.`,
    links: [{ label: 'View experience', href: '#experience' }],
  },
  {
    id: 'education',
    keywords: ['education', 'school', 'study', 'student', 'degree', 'university', 'college'],
    phrases: ['where do you study', 'what are you studying'],
    priority: 2,
    answer: `I am pursuing a BS Information Technology degree at ${education[0].school}, from ${education[0].period}. My studies cover software engineering, networking, databases, game development, and emerging technologies.`,
    links: [{ label: 'View education', href: '#education' }],
  },
  {
    id: 'ai',
    keywords: ['ai', 'gemini', 'openai', 'artificial intelligence', 'assistant'],
    phrases: ['how do you use ai'],
    priority: 3,
    answer: 'My AI-related work includes AgapAI, an emergency support platform with a Gemini-powered assistant, and AI/API integration across product workflows. My listed AI tools include Google Gemini API and OpenAI API.',
    links: [{ label: 'Explore AgapAI', href: '/agapai-case-study.html' }],
  },
  {
    id: 'mobile',
    keywords: ['mobile', 'android', 'ios', 'expo', 'react native', 'app'],
    phrases: ['mobile development'],
    priority: 3,
    answer: 'My mobile-focused work includes AgapAI, built with React Native and Expo. Its scope includes emergency rescue, health monitoring, AI assistance, and connected workflows for seniors, guardians, and local responders.',
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
    answer: awards.length ? `The portfolio includes ${awards.map(award => award.title).join(', ')}.` : 'There are no awards listed yet.',
    links: [{ label: 'View gallery', href: '#gallery' }],
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
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'message', 'linkedin', 'github', 'social'],
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
    links: [{ label: 'Download résumé', href: '/resources/olayres-resume.pdf' }],
  },
];

export function scoreTopic(topic, query, queryWords) {
  let score = topic.priority || 1;
  for (const phrase of topic.phrases || []) if (query.includes(normalize(phrase))) score += 10;
  for (const keyword of topic.keywords || []) {
    const normalizedKeyword = normalize(keyword);
    if (normalizedKeyword.includes(' ') ? query.includes(normalizedKeyword) : queryWords.has(normalizedKeyword)) score += normalizedKeyword.includes(' ') ? 6 : 2;
  }
  return score;
}

export function getAskMeAnswer(message) {
  const query = normalize(message);
  const queryWords = words(message);
  const ranked = askMeTopics.map(topic => ({ topic, score: scoreTopic(topic, query, queryWords) })).sort((a, b) => b.score - a.score);
  const best = ranked[0];

  if (!best || best.score < 3) {
    return {
      id: 'fallback',
      answer: 'I can answer about my projects, case studies, technologies, AI and mobile work, experience, education, certifications, résumé, availability, location, and contact details. Try asking about AgapAI, Foliofy, PNP IDTMS, or my stack.',
      links: [{ label: 'View projects', href: '#projects' }],
    };
  }

  const related = ranked.find(item => item.topic.id !== best.topic.id && item.score >= Math.max(5, best.score * 0.62));
  const answer = related ? `${best.topic.answer}\n\nRelated: ${related.topic.answer}` : best.topic.answer;
  const links = [...(best.topic.links || []), ...(related?.topic.links || [])].filter((link, index, list) => list.findIndex(item => item.href === link.href) === index);

  return { id: best.topic.id, answer, links };
}
