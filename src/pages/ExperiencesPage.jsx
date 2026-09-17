import ThemeControl from '../components/ThemeControl';
import { experiences } from '../data/siteData';
import { usePageMeta } from '../hooks/usePageMeta';

function ExperiencePageCard({ entry, index }) {
  return (
    <article className="experience-page-card">
      {entry.image ? <div className="experience-page-image"><img src={entry.image} alt={entry.alt} /></div> : <div className="experience-page-current" aria-hidden="true">now</div>}
      <div className="experience-page-copy">
        <span>{entry.year} · {String(index + 1).padStart(2, '0')}</span>
        <h2>{entry.title}</h2>
        <p className="experience-page-org">{entry.organization}</p>
        <p>{entry.description}</p>
      </div>
    </article>
  );
}

export default function ExperiencesPage() {
  usePageMeta({ title: 'Experience | Rafhael James Olayres', description: 'The development journey and current work of Rafhael James Olayres.', path: '/experiences' });

  return (
    <>
      <a className="skip-link" href="#experiences-page">Skip to experience</a>
      <header className="case-nav"><a href="/" className="identity-name">James Olayres</a><div><ThemeControl /><a href="/#experience">home ↩</a></div></header>
      <main id="experiences-page" className="experiences-page">
        <div className="halftone experiences-page-halftone" aria-hidden="true" />
        <header className="experiences-page-header"><p className="section-heading">the path so far</p><h1>experience</h1><p>From game communities and ROM hacking to freelance web development and full-stack product work.</p></header>
        <div className="experience-page-list">{experiences.map((entry, index) => <ExperiencePageCard key={entry.title} entry={entry} index={index} />)}</div>
        <p className="experiences-page-footer"><a href="/#experience">← back to portfolio</a></p>
      </main>
    </>
  );
}
