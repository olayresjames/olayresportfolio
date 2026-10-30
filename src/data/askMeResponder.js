import { awards, certifications, education, projects, skillGroups } from './siteData';

const normalize = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#.\s]/g, ' ').replace(/\s+/g, ' ').trim();
const has = (query, phrase) => Boolean(phrase) && ` ${query} `.includes(` ${normalize(phrase)} `);
const matches = (query, pattern) => pattern.test(query);
const uniqueLinks = links => links.filter((link, index) => links.findIndex(item => item.href === link.href) === index);
const starters = ['Tell me about Point Nemo', 'What have you built?', 'What tech do you use?', 'How can I contact you?'];
const listedSkills = skillGroups.flatMap(([group, skills]) => skills.map(name => ({ name, group })));
const projectSkills = [...new Set(projects.flatMap(project => project.technologies || []))]
  .filter(name => !listedSkills.some(skill => normalize(skill.name) === normalize(name)))
  .map(name => ({ name, group: 'Project technologies' }));
const skillNames = [...listedSkills, ...projectSkills];
const skillAliases = {
  'HTML5 & CSS3': ['html', 'css'],
  'React.js': ['react', 'reactjs'],
  'React Native + Expo': ['react native', 'expo'],
  'Node.js': ['node', 'nodejs'],
  'PostgreSQL': ['postgres'],
  'Google Gemini API': ['gemini'],
  'Local AI (Ollama)': ['ollama', 'local ai'],
  'OpenAI API': ['openai'],
  'Progressive Web Apps': ['pwa'],
};

function short(text, limit = 290) {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  let result = '';
  for (const sentence of sentences) {
    if ((result + sentence).trim().length > limit) break;
    result += sentence;
  }
  if (result.trim()) return result.trim();
  return `${clean.slice(0, limit - 1).replace(/\s+\S*$/, '').trim()}…`;
}

function response(topic, answer, links = topic?.links || [], suggestions) {
  return {
    id: topic?.id || 'fallback',
    topicId: topic?.id,
    answer: short(answer, 420),
    links: uniqueLinks(links).slice(0, 3),
    suggestions: suggestions || (topic?.name
      ? ['What was your role?', 'What tech did it use?', 'Can I see it?']
      : starters),
  };
}

function namedProjects(query, topics) {
  return topics.filter(topic => topic.name && [topic.name, ...(topic.aliases || [])].some(alias => {
    const value = normalize(alias);
    return value.length > 2 && has(query, value);
  }));
}

function findSkill(query) {
  return skillNames.flatMap(skill => [skill.name, ...(skillAliases[skill.name] || [])]
    .map(alias => ({ ...skill, alias: normalize(alias) })))
    .filter(item => (item.alias.length > 2 || item.alias.includes('#')) && has(query, item.alias))
    .sort((a, b) => b.alias.length - a.alias.length)[0];
}

function projectUses(project, term) {
  const topicStack = [...project.technologies, ...project.caseStudyMeta
    .filter(([label]) => /stack|technology/i.test(label))
    .map(([, value]) => value)].map(normalize);
  const aliases = [term.name, ...(skillAliases[term.name] || [])].map(normalize);
  return topicStack.some(entry => aliases.some(alias => has(entry, alias) || entry.includes(`${alias} `)));
}

function projectOverview(topic) {
  const source = projects.find(project => project.id === topic.id);
  const summary = source?.summary || source?.description || topic.answer.replace(`${topic.name}: `, '');
  const lead = /^[Aa]n? /.test(summary) ? `${topic.name} is ${summary[0].toLowerCase()}${summary.slice(1)}` : `${topic.name} ${summary[0].toLowerCase()}${summary.slice(1)}`;
  return short(`${lead} ${source?.proof || ''}`, 280);
}

const projectIntents = [
  { name: 'role', test: /\b(role|responsibility|responsibilities|contribution|contributed|your part|my part|what did you do|what did you build|who built)\b/, labels: /^(my role|role|what i built)$/ },
  { name: 'team', test: /\b(team|teammate|teammates|collaborator|collaborators|who worked|who made)\b/, labels: /^(team|team members|project context)$/ },
  { name: 'problem', test: /\b(problem|challenge|pain point|why build|why did|need for|goal)\b/, labels: /^(the problem|the challenge|goals)$/ },
  { name: 'result', test: /\b(result|outcome|impact|learned|lesson|achieved)\b/, labels: /^(result|outcome|what i learned)$/ },
  { name: 'privacy', test: /\b(privacy|private|offline|local|cloud|internet|on device|data stored)\b/, labels: /(local first study flow|network boundary|on device persistence)/ },
  { name: 'security', test: /\b(security|secure|authentication|authorization|permissions|permission|protected|protect|login|access control|row level)\b/, labels: /(security decisions|technical approach)/ },
  { name: 'documents', test: /\b(pdfs?|documents?|uploads?|extract|extraction|files?)\b/, labels: /(document processing|local document library|project details|the solution)/ },
  { name: 'ai', test: /\b(ai|model|ollama|gemini|qwen|inference|question generation)\b/, labels: /(ai behavior|study content|ai and art disclosures)/ },
  { name: 'features', test: /\b(feature|features|capability|capabilities|function|functions|how does|how do|work|works|workflow|build|built|make|support)\b/, labels: /(what i built|the solution|operations|project details|study content|depth zone encounters)/ },
];

function projectDetail(topic, intent) {
  const detail = topic.details?.find(([label]) => intent.labels.test(normalize(label)));
  if (detail) return short(detail[1]);
  const factKey = { role: 'Role', problem: 'Problem', result: 'Result', features: 'Built' }[intent.name];
  return factKey ? short(topic.facts?.[factKey]) : '';
}

function answerProject(topic, query) {
  const source = projects.find(project => project.id === topic.id);
  const links = topic.links || [];
  if (matches(query, /\b(demo|live|website|site|play|download|repository|repo|github|link|try it|see it)\b/)) {
    const wanted = matches(query, /\b(repo|repository|github|source)\b/) ? /repo|source|github/i : /demo|live|play|project|case study/i;
    const link = links.find(item => wanted.test(item.label)) || links[0];
    return response(topic, link ? `Sure, here's the link for ${topic.name}.` : `I don't have a public link for ${topic.name} listed here.`, link ? [link] : []);
  }

  if (matches(query, /\b(current|ongoing|status|finished|released|when|date|year)\b/)) {
    const status = source?.date || topic.caseStudyMeta.find(([label]) => /status/i.test(label))?.[1];
    return response(topic, status ? `${topic.name} is listed as ${status}.` : `I don't have a date or status listed for ${topic.name}.`);
  }

  const term = findSkill(query);
  if (term && (matches(query, /\b(use|uses|used|built with|made with|include|includes|have|has|stack|tech|technology|framework)\b/) || query.split(' ').length <= 3)) {
    if (matches(query, /\b(does|did|is|was|has|have)\b/) && !matches(query, /\b(what|which|how)\b/)) {
      return response(topic, projectUses(topic, term)
        ? `Yes, ${term.name} is listed for ${topic.name}.`
        : `I don't see ${term.name} listed for ${topic.name}.`);
    }
    if (query.split(' ').length <= 3) return response(topic, projectUses(topic, term)
      ? `Yes, ${term.name} is listed for ${topic.name}.`
      : `I don't see ${term.name} listed for ${topic.name}.`);
  }
  if (matches(query, /\b(tech|technology|technologies|stack|framework|language|tools|database|coded|built with|made with|what did you use|what do you use|used to build)\b/)) {
    const stack = topic.caseStudyMeta.find(([label]) => /stack|technology/i.test(label))?.[1];
    const domainOnly = ['camp-navi', 'pnp-assignment-system'].includes(topic.id);
    const answer = domainOnly
      ? `The portfolio describes ${topic.name}'s capabilities, but doesn't list its software stack.`
      : `${topic.name} uses ${stack || topic.technologies.join(', ') || 'a stack that is not listed here'}${topic.id === 'point-nemo' ? ', plus Ollama for local AI' : ''}.`;
    return response(topic, answer);
  }

  const intent = projectIntents.find(item => item.test.test(query));
  if (intent) {
    const detail = projectDetail(topic, intent);
    if (detail) return response(topic, detail);
    if (intent.name === 'role' && topic.id === 'point-nemo') {
      return response(topic, 'I built Point Nemo with team pointnemo. The case study names the team, but doesn’t assign individual feature ownership.');
    }
    return response(topic, `I don't have that ${intent.name} detail for ${topic.name} here.`, links);
  }

  if (matches(query, /\b(more|detail|explain|elaborate)\b/)) {
    const details = topic.details?.filter(([label]) => /^(the project|project details|the solution|what i built)$/i.test(label)).slice(0, 1);
    if (details?.length) return response(topic, short(details[0][1]));
  }
  return response(topic, projectOverview(topic));
}

function projectList(query, topics) {
  const term = findSkill(query);
  let matchesProjects = topics.filter(topic => topic.name);
  let label = 'projects';
  if (term) {
    matchesProjects = matchesProjects.filter(topic => projectUses(topic, term));
    label = `projects using ${term.name}`;
  } else if (matches(query, /\b(game|games|rpg)\b/)) {
    matchesProjects = matchesProjects.filter(topic => projects.find(project => project.id === topic.id)?.categories?.includes('game') || /game|rpg/i.test(projects.find(project => project.id === topic.id)?.category || '') || /game|rpg/i.test(topic.answer));
    label = 'game projects';
  } else if (matches(query, /\b(ai|artificial intelligence)\b/)) {
    matchesProjects = matchesProjects.filter(topic => projects.find(project => project.id === topic.id)?.categories?.includes('ai') || projects.find(project => project.id === topic.id)?.category === 'ai');
    label = 'AI projects';
  } else if (matches(query, /\b(mobile|android|ios)\b/)) {
    matchesProjects = matchesProjects.filter(topic => projects.find(project => project.id === topic.id)?.technologies?.some(value => /react native|expo/i.test(value)));
    label = 'mobile projects';
  } else if (matches(query, /\b(current|ongoing|now)\b/)) {
    matchesProjects = matchesProjects.filter(topic => /current|present/i.test(projects.find(project => project.id === topic.id)?.date || ''));
    label = 'current projects';
  } else if (matches(query, /\bpnp\b/)) {
    matchesProjects = matchesProjects.filter(topic => ['pnp-idtms', 'pais-2', 'camp-navi', 'pnp-assignment-system'].includes(topic.id));
    label = 'PNP projects';
  }
  if (!matchesProjects.length) return response({ id: 'projects', links: [{ label: 'View projects', href: '#projects' }] }, `I don't see any ${label} listed here.`);
  const names = matchesProjects.slice(0, 5).map(topic => topic.name).join(', ');
  const more = matchesProjects.length > 5 ? `, and ${matchesProjects.length - 5} more` : '';
  return response({ id: 'projects', links: [{ label: 'View projects', href: '#projects' }] }, `I have ${matchesProjects.length} ${label}: ${names}${more}.`, undefined, ['Tell me about Point Nemo', 'Which projects use React?', 'Show me game projects']);
}

function genericAnswer(topic, query) {
  switch (topic.id) {
    case 'skills': {
      const term = findSkill(query);
      if (term) {
        const examples = projects.filter(project => project.technologies?.some(value => has(normalize(value), term.alias))).slice(0, 2).map(project => project.name);
        const detail = term.group === 'Project technologies' ? 'appears in my projects' : `is in my ${term.group.toLowerCase()} stack`;
        return response(topic, `Yes, ${term.name} ${detail}${examples.length ? `; examples include ${examples.join(' and ')}` : ''}.`, topic.links);
      }
      const group = skillGroups.find(([name]) => {
        const normalized = normalize(name);
        return has(query, normalized) || (name === 'Backend & DB' && matches(query, /\b(backend|database|sql)\b/)) || (name === 'AI / APIs' && matches(query, /\b(ai|apis|models)\b/));
      });
      if (group) return response(topic, `${group[0]}: ${group[1].join(', ')}.`, topic.links);
      return response(topic, 'I mainly work with React, TypeScript, Node.js, Express, and databases such as Supabase and SQLite. I also build mobile apps with React Native and work with local and cloud AI.', topic.links);
    }
    case 'experience': return response(topic, matches(query, /\binternship\b/)
      ? 'At my Camp Crame internship, I’m building the PNP Internship Database Tracking Management System, including its React interface, Express API, and data model.'
      : 'I’ve done freelance web development since 2023 and currently work on the PNP internship system at Camp Crame. I also built Point Nemo with a hackathon team.', topic.links);
    case 'current-work': return response(topic, 'Right now I’m developing the PNP Internship Database Tracking Management System and leading the AgapAI capstone team.', topic.links);
    case 'education': return response(topic, `I'm studying ${education[0].degree} at ${education[0].school} (${education[0].period}).`, topic.links);
    case 'certifications': return response(topic, `I have ${certifications.length} certifications listed, including ${certifications.slice(0, 2).map(item => item.title).join(' and ')}.`, topic.links);
    case 'recognition': return response(topic, awards.length ? `Reset: Endless Horror won ${awards[0].category}.` : 'I don’t have any awards listed yet.', topic.links);
    case 'ai': return response(topic, 'I’ve worked on AgapAI, which uses a Gemini powered assistant, and Point Nemo, which uses Ollama for local question generation.', topic.links);
    case 'mobile': return response(topic, 'I built the React Native and Expo app for AgapAI, alongside its website and admin endpoint.', topic.links);
    case 'profile':
    case 'role': return response(topic, 'I’m Rafhael James Olayres, a full stack developer and IT student. I build web, mobile, and AI integrated products.', topic.links);
    default: return response(topic, short(topic.answer), topic.links);
  }
}

export function respondToAskMe(message, context = {}, topics) {
  if (typeof message !== 'string') return response(null, "I couldn't read that. Could you type it again?");
  if (message.length > 300) return response(null, 'Could you keep that under 300 characters?');
  const query = normalize(message);
  if (!query) return response(null, 'What would you like to know?');
  if (matches(query, /^(hi|hello|hey|yo|good morning|good afternoon|good evening|kumusta|kamusta)( how are you)?$/)) {
    return response({ id: 'greeting' }, 'Hey! What would you like to know about my work?', [], starters);
  }
  if (matches(query, /^(thanks|thank you|thx|salamat|thanks a lot)( for that)?$/)) {
    return response({ id: 'thanks' }, 'You’re welcome! Anything else you’re curious about?', [], starters);
  }
  if (matches(query, /^(how are you|how s it going|what s up)$/)) return response({ id: 'small-talk' }, 'Doing well, thanks for asking! What’s on your mind?', [], starters);
  if (matches(query, /^(who are you|are you (a )?(bot|human|real)|is this (a )?(bot|ai)|how do you work)$/)) {
    return response({ id: 'identity' }, 'I’m an offline guide to Rafhael’s portfolio. I answer from the information on this site, in his voice.', [], starters);
  }
  if (matches(query, /^(help|what can i ask|what can you do|topics)$/)) return response({ id: 'help' }, 'Ask me about projects, tools, experience, school, or how to reach me. You can ask follow-up questions too.', [], starters);

  const projectTopics = topics.filter(topic => topic.name && topic.technologies);
  const explicit = namedProjects(query, projectTopics);
  if (explicit.length > 1) {
    const useTech = matches(query, /\b(stack|tech|technology|technologies|framework|language|built with)\b/);
    const lines = explicit.slice(0, 3).map(topic => useTech
      ? `${topic.name}: ${topic.caseStudyMeta.find(([label]) => /stack|technology/i.test(label))?.[1] || topic.technologies.join(', ')}.`
      : `${topic.name}: ${short(projectOverview(topic), 145)}`);
    return response(explicit[0], lines.join(' '), explicit.flatMap(topic => topic.links || []), ['What was your role?', 'Which projects use React?', 'Show me all projects']);
  }
  if (explicit.length === 1) return answerProject(explicit[0], query);

  const asksProjects = matches(query, /\b(project|projects|apps|games|portfolio|work you built|things you built)\b/);
  const listIntent = matches(query, /\b(which|what|show|list|any|all|your|have|built|made|use|uses|using)\b/);
  if (asksProjects && matches(query, /\b(favorite|favourite|best|most proud)\b/)) {
    return response({ id: 'projects', links: [{ label: 'View projects', href: '#projects' }] }, "I haven't named a single favorite, but Point Nemo, AgapAI, and the PNP internship system are good places to start.");
  }
  if (asksProjects && listIntent) return projectList(query, projectTopics);
  if (has(query, 'pnp') && matches(query, /\b(work|built|make|projects|systems|internship)\b/)) return projectList(query, projectTopics);

  const previous = topics.find(topic => topic.id === context?.previousTopicId);
  const personalTopicChange = matches(query, /\b(contact|email|resume|school|education|experience|available|hire|social|instagram|facebook|linkedin|github|music|award|certification)\b/) || matches(query, /\byour (skills|projects|background|name)\b/);
  if (previous?.name && previous.technologies && !personalTopicChange) {
    const followUp = matches(query, /\b(it|its|that|this|there|more|detail|role|team|tech|stack|frontend|backend|database|feature|work|built|why|how|when|demo|link|security|privacy|result|problem)\b/);
    if (followUp || query.split(' ').length <= 4) return answerProject(previous, query);
  }

  const term = findSkill(query);
  if (term && matches(query, /\b(which|what|show|list|any)\b/) && matches(query, /\b(project|projects|apps|work)\b/)) return projectList(query, projectTopics);

  const genericTopics = topics.filter(topic => !projectTopics.includes(topic));
  const queryWords = new Set(query.split(' '));
  const ranked = genericTopics.map(topic => {
    let score = 0;
    for (const phrase of topic.phrases || []) if (has(query, phrase)) score += 10;
    for (const keyword of topic.keywords || []) if (has(query, keyword) || (!normalize(keyword).includes(' ') && queryWords.has(normalize(keyword)))) score += normalize(keyword).includes(' ') ? 6 : 3;
    return { topic, score: score ? score + (topic.priority || 1) * 0.25 : 0 };
  }).sort((a, b) => b.score - a.score);
  if (ranked[0]?.score >= 3) {
    const topic = ranked[0].topic;
    if (topic.id === 'projects') return projectList(query, projectTopics);
    return genericAnswer(topic, query);
  }
  if (term) return genericAnswer(genericTopics.find(topic => topic.id === 'skills'), query);

  return response(null, "I don't have a reliable answer for that in my portfolio. Ask me about a project or how to get in touch, and I'll keep it specific.", [{ label: 'View projects', href: '#projects' }], starters);
}
