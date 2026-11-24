import { useState } from 'react';
import AppLink from '../components/AppLink';
import DisplayControls from '../components/DisplayControls';
import { Lightbox } from '../components/Modals';
import ResponsiveImage from '../components/ResponsiveImage';
import { experiences } from '../data/siteData';
import { usePageMeta } from '../hooks/usePageMeta';

const experienceGroups = [
  { id: 'professional', title: 'Professional work', description: 'Internship, full-stack development, and independent client work.' },
  { id: 'projects', title: 'Project leadership and collaboration', description: 'Capstone leadership and team-based product development.' },
  { id: 'background', title: 'Early technical background', description: 'The communities and independent projects that introduced me to software and game systems.' },
];

function ExperiencePageCard({ entry, index, onPreview }) {
  const projectGrid = entry.contributionLayout === 'project-grid';
  const contributionOnly = entry.contributions?.length > 0 && !entry.outcome && !entry.technologies?.length && !projectGrid;

  return (
    <article className="experience-page-card">
      {entry.image ? <button className="experience-page-image" type="button" onClick={() => onPreview({ src: entry.webp || entry.image, alt: entry.alt })} aria-label={`Preview ${entry.title}`}><ResponsiveImage item={entry} sizes="(max-width: 767px) calc(100vw - 4rem), (max-width: 1023px) 44vw, 25rem" eager={index === 0} /></button> : <div className="experience-page-current" aria-hidden="true">{entry.mark || 'now'}</div>}
      <div className="experience-page-copy">
        <div className="experience-page-meta"><span>{entry.year} · {String(index + 1).padStart(2, '0')}</span>{entry.status && <span className="experience-page-status">{entry.status}</span>}</div>
        <h3>{entry.title}</h3>
        <p className="experience-page-role">{entry.role}</p>
        <p className="experience-page-org">{entry.organization}</p>
        <p>{entry.description}</p>
      </div>
      {(entry.contributions?.length > 0 || entry.outcome || entry.technologies?.length > 0 || entry.links?.length > 0) && <div className="experience-page-details">
        {entry.contributions?.length > 0 && <section className={`experience-page-detail${projectGrid ? ' experience-page-detail--projects' : ''}${contributionOnly ? ' experience-page-detail--wide' : ''}`} aria-label={entry.contributionLabel || 'Selected contributions'}>
          <p className="experience-page-label">{entry.contributionLabel || 'Selected contributions'}</p>
          <ul>{entry.contributions.map(contribution => {
            if (typeof contribution === 'string') return <li key={contribution}>{contribution}</li>;
            return <li key={contribution.name}>
              <div className="experience-page-project-heading">
                <h4>{contribution.name}</h4>
                {contribution.links?.length > 0 && <div className="experience-page-project-links">
                  {contribution.links.map(link => {
                    const icon = link.external
                      ? <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M5 11 11 5M5.5 5H11v5.5" /></svg>
                      : <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4.25 2.5h5l2.5 2.5v8.5h-7.5zM9.25 2.75V5h2.25M6.25 8h3.5M6.25 10.25h3.5" /></svg>;
                    return link.external
                      ? <a key={link.href} href={link.href} target="_blank" rel="noreferrer" aria-label={`${link.label} (opens in a new tab)`}>{link.label}{icon}</a>
                      : <AppLink key={link.href} to={link.href}>{link.label}{icon}</AppLink>;
                  })}
                </div>}
              </div>
              <p>{contribution.description}</p>
            </li>;
          })}</ul>
        </section>}
        {entry.outcome && <section className="experience-page-outcome" aria-label="Outcome">
          <p className="experience-page-label">Outcome</p>
          <p>{entry.outcome}</p>
        </section>}
        {entry.technologies?.length > 0 && <p className="experience-page-technologies"><span className="experience-page-label">Tools</span>{entry.technologies.join(' · ')}</p>}
        {entry.links?.length > 0 && <div className="experience-page-links">
          {entry.links.map((link, linkIndex) => {
            const className = linkIndex === 0 ? 'experience-page-link-primary' : undefined;
            const arrow = <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M5 11 11 5M5.5 5H11v5.5" /></svg>;
            return link.external
              ? <a className={className} key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}{arrow}</a>
              : <AppLink className={className} key={link.href} to={link.href}>{link.label}{arrow}</AppLink>;
          })}
        </div>}
      </div>}
    </article>
  );
}

export default function ExperiencesPage() {
  const [preview, setPreview] = useState(null);
  usePageMeta({ title: 'Experience | Rafhael James Olayres', description: 'The development journey and current work of Rafhael James Olayres.', path: '/experiences' });

  return (
    <>
      <a className="skip-link" href="#experiences-page">Skip to experience</a>
      <header className="case-nav"><AppLink to="/" className="identity-name">James Olayres</AppLink><div><DisplayControls /><AppLink to="/#experience">home ↩</AppLink></div></header>
      <main id="experiences-page" className="experiences-page">
        <div className="halftone experiences-page-halftone" aria-hidden="true" />
        <header className="experiences-page-header"><p className="section-heading">the path so far</p><h1>experience</h1><p>Professional roles, project leadership, and the early technical work that shaped how I build.</p></header>
        {experienceGroups.map(group => {
          const entries = experiences.filter(entry => entry.group === group.id);
          if (!entries.length) return null;
          return <section className="experience-page-group" key={group.id} aria-labelledby={`experience-group-${group.id}`}>
            <header className="experience-page-group-header"><h2 id={`experience-group-${group.id}`}>{group.title}</h2><p>{group.description}</p></header>
            <div className="experience-page-list">{entries.map(entry => <ExperiencePageCard key={entry.title} entry={entry} index={experiences.indexOf(entry)} onPreview={setPreview} />)}</div>
          </section>;
        })}
        <p className="experiences-page-footer"><AppLink to="/#experience">← back to portfolio</AppLink></p>
      </main>
      <Lightbox preview={preview} onClose={() => setPreview(null)} />
    </>
  );
}
