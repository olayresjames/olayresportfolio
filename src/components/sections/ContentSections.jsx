import { useEffect, useState } from 'react';
import { certifications, education, experiences, galleryItems, skillGroups } from '../../data/siteData';

export function Experience({ onOpenResume }) {
  const _entries = [
    {
      year: '2026',
      role: 'IT Intern',
      organization: 'Camp Crame ITMS Office · SPMT',
      description: 'Supporting information technology operations while gaining practical experience in a professional government environment.',
    },
    {
      year: '2023—2027',
      role: 'BS Information Technology',
      organization: 'Pamantasan ng Lungsod ng Valenzuela',
      description: 'Developing a foundation across software engineering, networking, databases, game development, and emerging technologies.',
    },
    {
      year: 'Now',
      role: 'Independent Developer',
      organization: 'AgapAI and selected client work',
      description: 'Designing and shipping useful web and mobile products with a focus on AI integration and user-centered workflows.',
    },
  ];
  return (
    <section id="experience" className="editorial-section">
      <div className="section-header reveal"><h2>03 — experience</h2><div className="section-header-actions"><a href="/experiences">full experience →</a><button className="text-button" type="button" onClick={onOpenResume}>view résumé ↗</button></div></div>
      <div className="timeline">
        {experiences.map(entry => (
          <article className="timeline-entry reveal" key={entry.title}>
            <time>{entry.year}</time>
            <div><h3>{entry.title}</h3><p className="timeline-org">{entry.organization}</p><p>{entry.description}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" className="editorial-section">
      <div className="section-header reveal"><h2>04 — education</h2><span>academic foundation</span></div>
      <div className="education-list">
        {education.map(item => (
          <article className="education-entry reveal" key={item.degree}>
            <time>{item.period}</time>
            <div><h3>{item.degree}</h3><p className="education-school">{item.school}</p><p>{item.detail}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="stack" className="editorial-section">
      <div className="section-header reveal"><h2>05 — stack</h2><a href="/stack">expanded stack →</a></div>
      <div className="stack-list reveal">
        {skillGroups.map(([group, skills]) => (
          <div className="stack-row" key={group}><h3>{group}</h3><p>{skills.join(' · ')}</p></div>
        ))}
      </div>
    </section>
  );
}

export function Certifications({ onPreview }) {
  return (
    <section id="certifications" className="editorial-section">
      <div className="section-header reveal"><h2>06 — certifications</h2><a href="/certifications">all certifications →</a></div>
      <p className="section-intro reveal">Credentials across frontend development and Python computing—each verifiable at its source.</p>
      <div className="certification-grid reveal">
        {certifications.slice(0, 3).map(certificate => (
          <article className="certification-card" key={`${certificate.title}-${certificate.version}`}>
            <button type="button" className="certification-icon" aria-label={`Preview ${certificate.title} certificate`} onClick={() => onPreview({ src: certificate.image, alt: `${certificate.title} certificate` })}>fcc</button>
            <h3>{certificate.title}</h3>
            <p>{certificate.issuer}</p>
            <span className="certification-version">{certificate.version}</span>
            <div className="certification-actions">
              <a href={certificate.verify} target="_blank" rel="noreferrer">verify ↗</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Gallery({ onPreview }) {
  return (
    <section id="gallery" className="editorial-section">
      <div className="section-header reveal"><h2>07 — gallery</h2><a href="/gallery">full gallery →</a></div>
      <p className="section-intro reveal">Selected moments, artifacts, and milestones from the work behind the projects.</p>
      <div className="portfolio-gallery-grid reveal">
        {galleryItems.slice(0, 3).map((item, index) => (
          <article className="portfolio-gallery-card" key={item.title}>
            <button className="portfolio-gallery-image" type="button" onClick={() => onPreview({ src: item.image, alt: item.alt })} aria-label={`Preview ${item.title}`}><img src={item.image} alt={item.alt} /></button>
            <div className="portfolio-gallery-copy"><span>{String(index + 1).padStart(2, '0')} / gallery</span><h3>{item.title}</h3></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function GitHubSection() {
  const contributionYear = 2026;
  const [contributionData, setContributionData] = useState(null);
  useEffect(() => {
    fetch('/github-contributions.json').then(response => response.ok ? response.json() : Promise.reject(new Error('Contribution data unavailable'))).then(setContributionData).catch(() => {});
  }, []);
  const commits = [
    ['PNP IDTMS', 'build internship attendance workflow', 'now', 'main'],
    ['AgapAI', 'connect emergency support flows', '2026', 'feature/dispatch'],
    ['Foliofy', 'ship browser-side document exports', '2026', 'main'],
    ['Reset', 'polish game interface interactions', '2026', 'release'],
    ['Portfolio', 'refine visual system and content', '2025', 'main'],
  ];
  const yearDays = contributionData?.[contributionYear]?.days || {};
  const firstDay = new Date(`${contributionYear}-01-01T00:00:00Z`);
  const lastDay = new Date(`${contributionYear}-12-31T00:00:00Z`);
  const calendarStart = new Date(firstDay);
  calendarStart.setUTCDate(calendarStart.getUTCDate() - calendarStart.getUTCDay());
  const calendarEnd = new Date(lastDay);
  calendarEnd.setUTCDate(calendarEnd.getUTCDate() + (6 - calendarEnd.getUTCDay()));
  const weekCount = Math.round((calendarEnd - calendarStart) / 604800000) + 1;
  const contributionWeeks = Array.from({ length: weekCount }, (_, weekIndex) => Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(calendarStart);
    date.setUTCDate(calendarStart.getUTCDate() + (weekIndex * 7) + dayIndex);
    const entry = yearDays[date.toISOString().slice(0, 10)];
    return entry ? entry.level : 0;
  }));
  const monthLabels = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(Date.UTC(contributionYear, monthIndex, 1));
    const weekIndex = Math.floor((monthStart - calendarStart) / 604800000) + 1;
    return { label: monthStart.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }), weekIndex };
  });
  const selectedContributions = contributionData?.[contributionYear];
  const contributionTotal = selectedContributions?.total ?? 0;
  return (
    <section id="github" className="editorial-section">
      <div className="section-header reveal"><h2>08 — github</h2><a href="https://github.com/olayresjames" target="_blank" rel="noreferrer">@olayresjames ↗</a></div>
      <a className="github-panel reveal" href="https://github.com/olayresjames" target="_blank" rel="noreferrer">
        <span className="github-mark" aria-hidden="true">&lt;/&gt;</span>
        <div><h3>Code, experiments, and works in progress</h3><p>Explore project repositories and the implementation behind my work.</p></div>
        <span aria-hidden="true">↗</span>
      </a>
      <div className="commit-history reveal" aria-label="Selected commit history">
        <div className="commit-history-header"><span>selected activity</span><span>latest commits</span></div>
        <ol>
          {commits.map(([project, message, date, branch]) => (
            <li key={`${project}-${message}`}>
              <span className="commit-node" aria-hidden="true" />
              <div className="commit-copy"><strong>{project}</strong><span>{message}</span></div>
              <span className="commit-branch">{branch}</span>
              <time>{date}</time>
            </li>
          ))}
        </ol>
      </div>
      <div className="contribution-panel reveal">
        <div className="contribution-header"><strong>{contributionTotal} contributions in {contributionYear}</strong><span>activity map</span></div>
        <div className="contribution-scroll">
          <div className="contribution-months" aria-hidden="true">{monthLabels.map(({ label, weekIndex }) => <span key={`${contributionYear}-${label}`} style={{ gridColumn: weekIndex }}>{label}</span>)}</div>
          <div className="contribution-grid" aria-label="Contribution activity heatmap">
            {contributionWeeks.map((week, weekIndex) => week.map((level, dayIndex) => {
              const date = new Date(calendarStart);
              date.setUTCDate(calendarStart.getUTCDate() + (weekIndex * 7) + dayIndex);
              const dateKey = date.toISOString().slice(0, 10);
              const count = yearDays[dateKey]?.count || 0;
              return <span key={dateKey} className={`contribution-cell level-${level}`} title={`${count} contribution${count === 1 ? '' : 's'} on ${dateKey}`} />;
            }))}
          </div>
        </div>
        <div className="contribution-footer"><span>less</span><div className="contribution-legend" aria-hidden="true">{[0, 1, 2, 3, 4].map(level => <span key={level} className={`contribution-cell level-${level}`} />)}</div><span>more</span></div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="editorial-section contact-section">
      <div className="halftone halftone-footer" aria-hidden="true" />
      <p className="section-heading reveal">09 — contact</p>
      <h2 className="reveal">Let’s build something useful.</h2>
      <p className="reveal">I’m open to internships, freelance work, and thoughtful collaborations.</p>
      <div className="text-links reveal">
        <a href="mailto:olayres.rafhaeljames@gmail.com">email ↗</a>
        <a href="https://github.com/olayresjames" target="_blank" rel="noreferrer">github ↗</a>
        <a href="https://linkedin.com/in/james-olayres-888721410" target="_blank" rel="noreferrer">linkedin ↗</a>
      </div>
    </section>
  );
}
