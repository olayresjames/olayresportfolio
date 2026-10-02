import { awards, caseStudies, certifications, education, experiences, projects, skillGroups } from './siteData';

const normalize = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#.\s]/g, ' ').replace(/\s+/g, ' ').trim();
const stopWords = new Set(['a', 'about', 'an', 'and', 'are', 'can', 'could', 'do', 'does', 'for', 'from', 'have', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'please', 'show', 'tell', 'that', 'the', 'this', 'to', 'what', 'when', 'where', 'which', 'who', 'why', 'with', 'would', 'you', 'your']);
const words = value => new Set(normalize(value).split(' ').filter(word => word.length > 1 && !stopWords.has(word)));
const caseStudyFor = project => Object.values(caseStudies).find(study => study.path === project.caseStudyUrl);
const blockValue = (study, labels) => study?.blocks.find(([label]) => labels.includes(label))?.[1];
const listWords = values => values.length < 2 ? values.join('') : `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;

const projectTopics = projects.map(project => {
  const study = caseStudyFor(project);
  const projectWords = project.name.toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 3);
  const extraKeywords = {
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
    name: project.name,
    technologies: project.technologies || [],
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
    name: 'skills and tools',
    keywords: ['skill', 'skills', 'stack', 'technology', 'technologies', 'tools', 'tech', 'framework', 'backend', 'frontend', ...skillGroups.flatMap(([, skills]) => skills)],
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
    links: [{ label: 'Download 2026 résumé', href: '/resources/olayres-resume-2026.pdf' }],
  },
];

export function scoreTopic(topic, query, queryWords) {
  let score = 0;
  for (const phrase of topic.phrases || []) {
    const normalizedPhrase = normalize(phrase);
    if (normalizedPhrase && (query === normalizedPhrase || query.includes(normalizedPhrase))) score += query === normalizedPhrase ? 14 : 10;
  }
  for (const keyword of topic.keywords || []) {
    const normalizedKeyword = normalize(keyword);
    if (normalizedKeyword.includes(' ') ? query.includes(normalizedKeyword) : queryWords.has(normalizedKeyword)) score += normalizedKeyword.includes(' ') ? 6 : 3;
  }
  return score ? score + (topic.priority || 1) * 0.25 : 0;
}

const starterSuggestions = ['What projects have you built?', 'What is in your tech stack?', 'Tell me about AgapAI', 'How can I contact you?'];

function suggestionsFor(topic) {
  if (!topic) return starterSuggestions;
  if (topic.name && topic.technologies?.length) return [`What technologies did you use for ${topic.name}?`, `Tell me more about ${topic.name}`, 'Show me another project'];
  const suggestions = {
    projects: ['Tell me about AgapAI', 'What is in your tech stack?', 'Show me your résumé'],
    skills: ['Tell me about AgapAI', 'Show me selected projects', 'Show me your résumé'],
    role: ['What projects have you built?', 'What is in your tech stack?', 'Where can I see your experience?'],
    experience: ['What did you build at your internship?', 'Show me the PNP IDTMS project', 'Show me your résumé'],
    education: ['What projects have you built?', 'What technologies do you use?', 'How can I contact you?'],
    availability: ['What kind of work are you open to?', 'How can I contact you?', 'Show me your projects'],
    contact: ['Are you available for work?', 'Show me your résumé', 'What projects have you built?'],
  };
  return suggestions[topic.id] || starterSuggestions;
}

const makeAnswer = (topic, answer = topic.answer, links = topic.links || []) => ({
  id: topic.id,
  topicId: topic.id,
  answer,
  links,
  suggestions: suggestionsFor(topic),
});

function getContextualAnswer(query, previousTopicId) {
  const previousTopic = askMeTopics.find(topic => topic.id === previousTopicId);
  if (!previousTopic) return null;
  const namedProject = projectTopics.find(topic => query.includes(normalize(topic.name)) || query.includes(normalize(topic.id)));
  if (namedProject && namedProject.id !== previousTopic.id) return null;

  const wantsTechnology = /\b(tech|technology|technologies|stack|framework|language|languages|tools)\b/.test(query);
  if (wantsTechnology && previousTopic.technologies?.length) {
    return makeAnswer(previousTopic, `${previousTopic.name} uses ${listWords(previousTopic.technologies)}.`, previousTopic.links);
  }

  const specificCategories = new Set(['availability', 'contact', 'experience', 'education', 'certifications', 'recognition', 'location', 'resume', 'role', 'ai', 'mobile', 'pnp-details']);
  const queryWords = words(query);
  const changesTopic = askMeTopics.some(topic => topic.id !== previousTopic.id && specificCategories.has(topic.id) && scoreTopic(topic, query, queryWords) >= 3);
  if (changesTopic) return null;

  const wantsDemo = /\b(demo|live site|website|link)\b/.test(query);
  if (wantsDemo && previousTopic.name) {
    const demoLink = previousTopic.links?.find(link => /demo|live/i.test(link.label));
    if (demoLink) return makeAnswer(previousTopic, `Here is the live demo for ${previousTopic.name}.`, [demoLink]);
    return makeAnswer(previousTopic, `I don’t have a live demo listed for ${previousTopic.name}. You can still explore its case study or repository.`, previousTopic.links);
  }

  const asksForMore = /\b(more|details|detail|elaborate|expand|explain|again|that|this|it)\b/.test(query);
  if (asksForMore && query.split(' ').length <= 6) {
    return makeAnswer(previousTopic, `Here’s more about ${previousTopic.name || previousTopic.id}:\n\n${previousTopic.answer}`);
  }
  return null;
}

export function getAskMeAnswer(message, context = {}) {
  if (typeof message !== 'string') {
    return { id: 'input-error', answer: 'I couldn’t read that question. Please try typing it again.', suggestions: starterSuggestions };
  }
  if (message.length > 300) {
    return { id: 'input-error', answer: 'That question is a bit long for this portfolio guide. Try shortening it to 300 characters or fewer.', suggestions: starterSuggestions };
  }
  const query = normalize(message);
  if (!query) {
    return { id: 'input-error', answer: 'Type a question or choose one of the prompts below to get started.', suggestions: starterSuggestions };
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|kumusta|kamusta)$/.test(query)) {
    return { id: 'greeting', answer: 'Hi! I can help you explore the projects, skills, experience, and contact details in this portfolio. What would you like to know?', suggestions: starterSuggestions };
  }
  if (/^(thanks|thank you|thx|salamat|thanks a lot)$/.test(query)) {
    return { id: 'thanks', answer: 'You’re welcome. Want to explore a project or ask about something else?', suggestions: starterSuggestions };
  }
  if (/^(help|what can i ask|what can you do|topics)$/.test(query)) {
    return { id: 'help', answer: 'Ask about a project, a technology, experience, education, availability, or contact details. You can also choose a prompt below.', suggestions: starterSuggestions };
  }

  const contextualAnswer = getContextualAnswer(query, context?.previousTopicId);
  if (contextualAnswer) return contextualAnswer;

  const queryWords = words(message);
  const ranked = askMeTopics.map(topic => ({ topic, score: scoreTopic(topic, query, queryWords) })).sort((a, b) => b.score - a.score);
  const best = ranked[0];

  if (!best || best.score < 3) {
    return {
      id: 'fallback',
      answer: 'I couldn’t find that detail in the portfolio yet. I can answer questions about projects, technologies, experience, education, availability, and contact details. Try adding a project name or choosing a prompt below.',
      links: [{ label: 'View projects', href: '#projects' }],
      suggestions: starterSuggestions,
    };
  }

  const asksForMultiple = /\b(and|also|compare|difference|versus|vs)\b/.test(query);
  const related = asksForMultiple ? ranked.slice(1).find(item => item.score >= 4.5) : null;
  const answer = related ? `${best.topic.answer}\n\nAlso relevant — ${related.topic.name || related.topic.id}: ${related.topic.answer}` : best.topic.answer;
  const links = [...(best.topic.links || []), ...(related?.topic.links || [])].filter((link, index, list) => list.findIndex(item => item.href === link.href) === index);

  return { ...makeAnswer(best.topic, answer, links), suggestions: suggestionsFor(best.topic) };
}
