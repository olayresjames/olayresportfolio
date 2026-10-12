import { awards, certifications, education, experiences, featuredSongs, projects, skillGroups } from './siteData';
import { caseStudies } from './caseStudyData';

const normalize = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#.\s]/g, ' ').replace(/\s+/g, ' ').trim();
const stopWords = new Set(['a', 'about', 'an', 'and', 'are', 'can', 'could', 'do', 'does', 'for', 'from', 'have', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'please', 'show', 'tell', 'that', 'the', 'this', 'to', 'what', 'when', 'where', 'which', 'who', 'why', 'with', 'would', 'you', 'your']);
const words = value => new Set(normalize(value).split(' ').filter(word => word.length > 1 && !stopWords.has(word)));
const listWords = values => values.length < 2 ? values.join('') : `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;

const projectTopics = projects.map(project => {
  const projectWords = project.name.toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 3);
  const projectAliases = {
    'point-nemo': ['pointnemo', 'team pointnemo'],
    agapai: ['agap ai'],
    'pnp-idtms': ['pnp itms', 'pnp internship system', 'internship database tracking management system'],
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
  'Ollama (local inference)': ['ollama', 'local inference'],
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
    answer: `My listed experience includes ${experienceList}. I’m currently developing the PNP Internship Database Tracking Management System and completing an internship with the Camp Crame ITMS Office under SPMT.`,
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
    answer: 'My current work includes the PNP Internship Database Tracking Management System, a role-aware platform for attendance and internship administration, and AgapAI, a mobile and web emergency support and health platform for seniors, guardians, and local responders. I am also studying Information Technology at Pamantasan ng Lungsod ng Valenzuela.',
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
    answer: 'My AI-related work includes AgapAI, an emergency support platform with a Gemini-powered assistant, and Point Nemo, a local-first study app that uses Ollama for question generation by default. Point Nemo keeps document text, prompts, and answers on the user’s computer during its study flow; its default model is qwen2.5:1.5b.',
    links: [{ label: 'Explore Point Nemo', href: '/point-nemo-case-study.html' }, { label: 'Explore AgapAI', href: '/agapai-case-study.html' }],
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

const starterSuggestions = ['What projects have you built?', 'What is in your tech stack?', 'Tell me about Point Nemo', 'How can I contact you?'];

function suggestionsFor(topic) {
  if (!topic) return starterSuggestions;
  if (topic.name && topic.technologies?.length) return [`What technologies did you use for ${topic.name}?`, `Tell me more about ${topic.name}`, 'Show me another project'];
  const suggestions = {
    projects: ['Tell me about Point Nemo', 'What is in your tech stack?', 'Show me your résumé'],
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

function answerSkillQuestion(topic, query) {
  if (topic.id !== 'skills') return null;
  const queryWords = words(query);
  const skillEntries = skillGroups.flatMap(([group, skills]) => skills.map(skill => ({
    group,
    skill,
    aliases: [skill, ...(skillAliases[skill] || [])].map(normalize),
  })));
  const projectTechnologyEntries = projectTechnologyTerms
    .filter(skill => !skillGroupAliases.some(alias => normalize(alias) === normalize(skill)))
    .map(skill => ({ group: 'Project technologies', skill, aliases: [normalize(skill)] }));
  const entries = [...skillEntries, ...projectTechnologyEntries];
  const match = entries
    .flatMap(entry => entry.aliases.map(alias => ({ ...entry, alias })))
    .filter(entry => entry.alias.length > 1 && (entry.alias.includes(' ') ? query.includes(entry.alias) : queryWords.has(entry.alias)))
    .sort((a, b) => b.alias.length - a.alias.length)[0];

  if (match) {
    const projectsUsingSkill = projectTopics.filter(project => {
      const listedTech = normalize([
        ...project.technologies,
        ...project.caseStudyMeta.filter(([label]) => /stack|technology/i.test(label)).map(([, value]) => value),
      ].join(' '));
      return match.aliases.some(alias => alias.length > 1 && listedTech.includes(alias));
    }).slice(0, 5).map(project => project.name);
    const usage = projectsUsingSkill.length
      ? `Portfolio examples include ${listWords(projectsUsingSkill)}.`
      : 'The portfolio does not tie it to a specific project.';
    return makeAnswer(topic, `${match.skill} is listed under ${match.group}. ${usage}`);
  }

  const groupIntents = [
    { pattern: /\b(language|languages|programming|code in)\b/, name: 'Languages' },
    { pattern: /\b(frontend|front end|interface|ui|framework|library|libraries)\b/, name: 'Frontend' },
    { pattern: /\b(backend|back end|database|databases|sql|server)\b/, name: 'Backend & DB' },
    { pattern: /\b(ai|artificial intelligence|api|apis|models)\b/, name: 'AI / APIs' },
    { pattern: /\b(network|networking|subnet|ip configuration)\b/, name: 'Networking' },
    { pattern: /\b(tool|tools|workflow|editor|libraries)\b/, name: 'Tools & Workflow' },
    { pattern: /\b(quality|accessibility|responsive|deployment|debugging)\b/, name: 'Quality & Delivery' },
  ];
  const groups = groupIntents
    .filter(item => item.pattern.test(query))
    .map(intent => skillGroups.find(([name]) => name === intent.name))
    .filter(Boolean);
  if (groups.length) return makeAnswer(topic, groups.map(([name, skills]) => `${name}: ${skills.join(', ')}`).join('\n\n'));
  return null;
}

const projectDetailIntents = [
  { pattern: /\b(team|teammate|teammates|collaborator|collaborators|built with|who worked)\b/, labels: /^(team|project context)$/ },
  { pattern: /\b(privacy|private|offline|local|cloud|internet|network|sent|stored|on device)\b/, labels: /(local-first study flow|network boundary|on-device persistence|security decisions)/ },
  { pattern: /\b(pdf|document|documents|file|files|upload|uploads|extract|extraction|processing)\b/, labels: /(document processing|local document library|pdf text|image collection)/ },
  { pattern: /\b(security|secure|authentication|authorization|permission|access|protect)\b/, labels: /(security decisions|technical approach|operations)/ },
  { pattern: /\b(ai|model|ollama|gemini|qwen|inference)\b/, labels: /(ai behavior|what i built|ai and art disclosures)/ },
  { pattern: /\b(role|responsibilit|contribution|contribute|owned|my part|your part|handle|what.*work on|worked on)\b/, labels: /^(my role|role)$/ },
  { pattern: /\b(problem|challenge|need|goal|why)\b/, labels: /(the problem|the challenge|goals)$/ },
  { pattern: /\b(result|outcome|impact|learned|lesson)\b/, labels: /^(result|outcome|what i learned)$/ },
  { pattern: /\b(save|saving|load|loading|persistence|persist)\b/, labels: /(loading and persistence|on-device persistence)/ },
  { pattern: /\b(architecture|architect|how.*built|what.*build|what.*built|how.*work|workflow|feature|features|capability|support|does it)\b/, labels: /(what i built|the solution|the project|project details|operations|tile-based world|stable frame rendering|attendance|study content|depth-zone encounters)/ },
];

function answerProjectQuestion(topic, query) {
  if (!projectTopics.some(project => project.id === topic.id)) return null;

  const intent = projectDetailIntents.find(item => item.pattern.test(query));
  if (intent) {
    const detail = topic.details.find(([label]) => intent.labels.test(normalize(label)));
    if (detail) return makeAnswer(topic, `${topic.name}\n\n${detail[0]}: ${detail[1]}`);

    if (intent.labels.source === '^(my role|role)$' && topic.facts.Role) {
      return makeAnswer(topic, `${topic.name}\n\nRole: ${topic.facts.Role}`);
    }
    if (intent.labels.source === '^(my role|role)$' && topic.id === 'point-nemo') {
      return makeAnswer(topic, 'Point Nemo was built by team pointnemo. The case study names the team members but does not assign individual feature ownership.');
    }
  }

  const queryWords = words(query);
  const mentionsListedTechnology = allSkillAliases.some(value => {
    const alias = normalize(value);
    return alias.length > 1 && (alias.includes(' ') ? query.includes(alias) : queryWords.has(alias));
  });
  const wantsTechnology = /\b(tech|technology|technologies|stack|framework|language|languages|tools|database|api)\b/.test(query) || mentionsListedTechnology;
  if (wantsTechnology) {
    const stack = topic.caseStudyMeta.find(([label]) => /stack|technology/i.test(label))?.[1];
    const domainOnlyTechnologies = ['camp-navi', 'pnp-assignment-system'].includes(topic.id);
    if (domainOnlyTechnologies) {
      return makeAnswer(topic, `${topic.name} is described in terms of ${listWords(topic.technologies)}. The portfolio does not list its software frameworks or programming languages.`);
    }
    const technologies = stack || (topic.technologies.length ? listWords(topic.technologies) : 'the portfolio does not list a software stack for this project');
    const note = topic.id === 'point-nemo' ? ' The listed project stack also includes Ollama for local AI inference.' : '';
    return makeAnswer(topic, `${topic.name} uses ${technologies}.${note}`);
  }
  return null;
}

function answerMultipleProjects(query) {
  const mentionedProjects = projectTopics.filter(topic => [topic.name, ...(topic.aliases || [])]
    .some(alias => normalize(alias).length > 2 && query.includes(normalize(alias))));
  if (mentionedProjects.length < 2) return null;

  const answers = mentionedProjects.map(topic => {
    const detail = answerProjectQuestion(topic, query);
    return `${topic.name}\n${detail?.answer || topic.answer}`;
  });
  const links = mentionedProjects.flatMap(topic => topic.links || [])
    .filter((link, index, allLinks) => allLinks.findIndex(item => item.href === link.href) === index);
  return makeAnswer(mentionedProjects[0], answers.join('\n\n'), links);
}

function getContextualAnswer(query, previousTopicId) {
  const previousTopic = askMeTopics.find(topic => topic.id === previousTopicId);
  if (!previousTopic) return null;
  const namedProject = projectTopics.find(topic => query.includes(normalize(topic.name)) || query.includes(normalize(topic.id)) || (topic.phrases || []).some(phrase => normalize(phrase).length > 5 && query.includes(normalize(phrase))));
  if (namedProject && namedProject.id !== previousTopic.id) return null;

  const projectAnswer = answerProjectQuestion(previousTopic, query);
  if (projectAnswer) return projectAnswer;
  const skillAnswer = answerSkillQuestion(previousTopic, query);
  if (skillAnswer) return skillAnswer;

  const wantsTechnology = /\b(tech|technology|technologies|stack|framework|language|languages|tools)\b/.test(query);
  if (wantsTechnology && previousTopic.name && previousTopic.technologies?.length) {
    return makeAnswer(previousTopic, `${previousTopic.name} uses ${listWords(previousTopic.technologies)}.`);
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
    const expandedDetails = previousTopic.details?.slice(0, 3).map(([label, detail]) => `${label}: ${detail}`).join('\n\n');
    return makeAnswer(previousTopic, `Here is more about ${previousTopic.name || previousTopic.id}:\n\n${expandedDetails || previousTopic.answer}`);
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

  const multipleProjectsAnswer = answerMultipleProjects(query);
  if (multipleProjectsAnswer) return multipleProjectsAnswer;

  const contextualAnswer = getContextualAnswer(query, context?.previousTopicId);
  if (contextualAnswer) return contextualAnswer;

  const mentionsProject = projectTopics.some(topic => [topic.name, ...(topic.aliases || [])]
    .some(alias => normalize(alias).length > 2 && query.includes(normalize(alias))));
  const skillsTopic = askMeTopics.find(topic => topic.id === 'skills');
  if (!mentionsProject) {
    const skillAnswer = answerSkillQuestion(skillsTopic, query);
    if (skillAnswer) return skillAnswer;
  }

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

  const projectAnswer = answerProjectQuestion(best.topic, query);
  if (projectAnswer) return projectAnswer;
  const skillAnswer = answerSkillQuestion(best.topic, query);
  if (skillAnswer) return skillAnswer;

  const asksForMultiple = /\b(and|also|compare|difference|versus|vs)\b/.test(query);
  const related = asksForMultiple ? ranked.slice(1).find(item => item.score >= 4.5) : null;
  const answer = related ? `${best.topic.answer}\n\nAlso relevant — ${related.topic.name || related.topic.id}: ${related.topic.answer}` : best.topic.answer;
  const links = [...(best.topic.links || []), ...(related?.topic.links || [])].filter((link, index, list) => list.findIndex(item => item.href === link.href) === index);

  return { ...makeAnswer(best.topic, answer, links), suggestions: suggestionsFor(best.topic) };
}
