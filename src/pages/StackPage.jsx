import ThemeControl from '../components/ThemeControl';
import { skillGroups } from '../data/siteData';
import { usePageMeta } from '../hooks/usePageMeta';

const iconPaths = {
  Languages: 'M4 5h16M4 12h16M4 19h10',
  Frontend: 'M4 5h16v14H4zM8 9h8M8 13h5',
  'Backend & DB': 'M5 7c0-2 14-2 14 0v10c0 2-14 2-14 0zM5 7c0 2 14 2 14 0M5 12c0 2 14 2 14 0',
  'AI / APIs': 'M12 4v16M4 12h16M7 7l10 10M17 7L7 17',
  Networking: 'M5 6h5v5H5zM14 13h5v5h-5zM10 8h4v8h-4z',
  'Tools & Workflow': 'M5 5h14v14H5zM8 9h8M8 13h5',
  'Quality & Delivery': 'M5 12l4 4L19 6',
  Practices: 'M5 7h14M5 12h14M5 17h9',
};

const iconSlugs = {
  TypeScript: 'typescript', JavaScript: 'javascript', 'HTML5 & CSS3': 'html5', Python: 'python', C: 'c', 'C++': 'cplusplus', 'C#': 'dotnet', PHP: 'php',
  'React.js': 'react', 'React Native + Expo': 'react', 'React Router': 'reactrouter', 'Tailwind CSS': 'tailwindcss', Vite: 'vite', PWA: 'pwa',
  'Node.js': 'nodedotjs', Express: 'express', Firebase: 'firebase', Supabase: 'supabase', MySQL: 'mysql', PostgreSQL: 'postgresql', 'REST APIs': 'fastapi',
  'Google Gemini API': 'googlegemini', 'API integration': 'postman',
  'Git & GitHub': 'github', Postman: 'postman', npm: 'npm',
  'CI/CD (Vercel)': 'vercel',
};

const skillIconPaths = {
  'OpenAI API': 'M12 3v18M3 12h18M5.5 6.5l13 11M18.5 6.5l-13 11',
  'VS Code': 'M8 5l-4 3v8l4 3 8-4v-6L8 5zm0 0v14m8-10 4 3v6l-4 3',
  IndexedDB: 'M5 7c0-2 14-2 14 0v10c0 2-14 2-14 0zM5 7c0 2 14 2 14 0M5 12c0 2 14 2 14 0',
  'docx.js': 'M7 3h7l4 4v14H7zM14 3v5h5M9 13h6M9 17h6',
  jsPDF: 'M6 4h9l3 3v13H6zM15 4v4h4M8 14h8M8 17h5',
  FullCalendar: 'M5 5h14v14H5zM8 3v4M16 3v4M5 9h14',
  Tkinter: 'M4 5h16v14H4zM4 9h16M8 7h.01M11 7h.01M14 7h.01',
  Pygame: 'M7 14l-2 4M17 14l2 4M9 10h6M12 8v4M9 10v4M7 12h4',
};

function SkillIcon({ group, skill }) {
  const slug = skill && iconSlugs[skill];
  const path = skillIconPaths[skill] || iconPaths[group];
  return <span className="stack-skill-icon" aria-hidden="true">{slug ? <img src={`https://cdn.simpleicons.org/${slug}`} alt="" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>}</span>;
}

export default function StackPage() {
  usePageMeta({ title: 'Stack | Rafhael James Olayres', description: 'The technologies, tools, and practices used by Rafhael James Olayres.', path: '/stack' });

  return (
    <>
      <a className="skip-link" href="#stack-page">Skip to stack</a>
      <header className="case-nav"><a href="/" className="identity-name">James Olayres</a><div><ThemeControl /><a href="/#stack">home ↩</a></div></header>
      <main id="stack-page" className="stack-page">
        <div className="halftone stack-page-halftone" aria-hidden="true" />
        <header className="stack-page-header"><p className="section-heading">tools, systems, and practice</p><h1>stack</h1><p>A closer look at the technologies and working practices behind my projects.</p></header>
        <div className="stack-detail-grid">
          {skillGroups.map(([group, skills]) => (
            <section className="stack-detail-group" key={group}>
              <header><SkillIcon group={group} /><div><span>category</span><h2>{group}</h2></div></header>
              <ul>{skills.map(skill => <li key={skill}><SkillIcon group={group} skill={skill} /><span>{skill}</span></li>)}</ul>
            </section>
          ))}
        </div>
        <p className="stack-page-footer"><a href="/#stack">← back to portfolio</a></p>
      </main>
    </>
  );
}
