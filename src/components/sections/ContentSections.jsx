import { useEffect, useState } from 'react';
import AppLink from '../AppLink';
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
      <div className="section-header reveal"><h2>03 — experience</h2><div className="section-header-actions"><AppLink to="/experiences">full experience →</AppLink><button className="text-button" type="button" onClick={onOpenResume}>view résumé ↗</button></div></div>
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
      <div className="section-header reveal"><h2>05 — stack</h2><AppLink to="/stack">expanded stack →</AppLink></div>
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
      <div className="section-header reveal"><h2>06 — certifications</h2><AppLink to="/certifications">all certifications →</AppLink></div>
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
      <div className="section-header reveal"><h2>07 — gallery</h2><AppLink to="/gallery">full gallery →</AppLink></div>
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
  const currentYear = new Date().getUTCFullYear();
  const [contributionData, setContributionData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [tooltipDate, setTooltipDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  useEffect(() => {
    fetch('/github-contributions.json').then(response => response.ok ? response.json() : Promise.reject(new Error('Contribution data unavailable'))).then(setContributionData).catch(() => {});
  }, []);
  const projectUpdates = [
    { name: 'PNP IDTMS', summary: 'Internship attendance and records in one workflow.', status: 'current project', href: '/pnp-idtms-case-study.html' },
    { name: 'AgapAI', summary: 'Emergency support connecting seniors, guardians, and responders.', status: 'case study', href: '/agapai-case-study.html' },
    { name: 'Foliofy', summary: 'Organize image collections and export Word or PDF documents.', status: 'case study', href: '/foliofy-case-study.html' },
    { name: 'Reset', summary: 'A time-loop horror game with interactive encounters.', status: 'play the game', href: 'https://deckode.itch.io/reset-the-endless-horror' },
    { name: 'Portfolio', summary: 'Selected work, experiments, and the process behind them.', status: 'this site', href: '#about' },
  ];
  const availableYears = Object.keys(contributionData || {}).map(Number).sort((a, b) => b - a);
  const contributionYear = availableYears.includes(selectedYear)
    ? selectedYear
    : availableYears.includes(currentYear) ? currentYear : availableYears[0] || currentYear;
  const selectedContributions = contributionData?.[contributionYear];
  const firstDay = new Date(`${contributionYear}-01-01T00:00:00Z`);
  const yearDays = {};
  let dayOffset = 0;
  (selectedContributions?.weeks || []).forEach(week => {
    week.forEach(day => {
      if (day && typeof day === 'object' && day.date) {
        yearDays[day.date] = { level: day.level || 0, count: day.count ?? null };
        return;
      }
      const date = new Date(firstDay);
      date.setUTCDate(firstDay.getUTCDate() + dayOffset);
      yearDays[date.toISOString().slice(0, 10)] = { level: day || 0, count: null };
      dayOffset += 1;
    });
  });
  const lastDay = new Date(`${contributionYear}-12-31T00:00:00Z`);
  const calendarStart = new Date(firstDay);
  calendarStart.setUTCDate(calendarStart.getUTCDate() - calendarStart.getUTCDay());
  const calendarEnd = new Date(lastDay);
  calendarEnd.setUTCDate(calendarEnd.getUTCDate() + (6 - calendarEnd.getUTCDay()));
  const weekCount = Math.round((calendarEnd - calendarStart) / 604800000) + 1;
  const contributionWeeks = Array.from({ length: weekCount }, (_, weekIndex) => Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(calendarStart);
    date.setUTCDate(calendarStart.getUTCDate() + (weekIndex * 7) + dayIndex);
    const dateKey = date.toISOString().slice(0, 10);
    return { dateKey, level: yearDays[dateKey]?.level || 0 };
  }));
  const monthLabels = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(Date.UTC(contributionYear, monthIndex, 1));
    const weekIndex = Math.floor((monthStart - calendarStart) / 604800000) + 1;
    return { label: monthStart.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }), weekIndex };
  });
  const contributionTotal = selectedContributions?.total ?? 0;
  const todayKey = new Date().toISOString().slice(0, 10);
  const statsEnd = contributionYear === currentYear ? new Date(`${todayKey}T00:00:00Z`) : lastDay;
  let longestStreak = 0;
  let activeDays = 0;
  let runningStreak = 0;
  for (let date = new Date(firstDay); date <= statsEnd; date.setUTCDate(date.getUTCDate() + 1)) {
    const entry = yearDays[date.toISOString().slice(0, 10)];
    if ((entry?.count ?? entry?.level ?? 0) > 0) {
      activeDays += 1;
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  }
  let currentStreak = null;
  if (contributionYear === currentYear) {
    const cursor = new Date(`${todayKey}T00:00:00Z`);
    if ((yearDays[todayKey]?.count ?? yearDays[todayKey]?.level ?? 0) === 0) cursor.setUTCDate(cursor.getUTCDate() - 1);
    currentStreak = 0;
    while (cursor >= firstDay && (yearDays[cursor.toISOString().slice(0, 10)]?.count ?? yearDays[cursor.toISOString().slice(0, 10)]?.level ?? 0) > 0) {
      currentStreak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
  }
  const selectedDay = yearDays[selectedDate];
  const tooltipDay = tooltipDate ? yearDays[tooltipDate] : null;
  const selectedDateLabel = new Date(`${selectedDate}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
  const tooltipDateObject = tooltipDate ? new Date(`${tooltipDate}T00:00:00Z`) : null;
  const tooltipDayNumber = tooltipDateObject?.getUTCDate();
  const ordinalSuffix = tooltipDayNumber == null ? '' : tooltipDayNumber % 100 >= 11 && tooltipDayNumber % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[tooltipDayNumber % 10] || 'th');
  const tooltipDateLabel = tooltipDateObject && `${tooltipDateObject.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })} ${tooltipDayNumber}${ordinalSuffix}`;
  const tooltipMessage = tooltipDay?.count == null
    ? `${tooltipDay?.level ? 'Activity recorded' : 'No contributions'} on ${tooltipDateLabel}.`
    : `${tooltipDay.count} contribution${tooltipDay.count === 1 ? '' : 's'} on ${tooltipDateLabel}.`;
  const showContributionTooltip = (dateKey, target) => {
    const panel = target.closest('.contribution-panel');
    if (!panel) return;
    const panelRect = panel.getBoundingClientRect();
    const cellRect = target.getBoundingClientRect();
    const halfTooltipWidth = Math.min(132, Math.max(0, panelRect.width / 2 - 8));
    const centerX = cellRect.left + (cellRect.width / 2) - panelRect.left;
    const left = Math.min(Math.max(centerX, halfTooltipWidth + 8), panelRect.width - halfTooltipWidth - 8);
    const below = cellRect.top - panelRect.top < 56;
    setSelectedDate(dateKey);
    setTooltipDate(dateKey);
    setTooltipPosition({ left, top: below ? cellRect.bottom - panelRect.top + 8 : cellRect.top - panelRect.top - 8, below });
  };
  const closeContributionTooltip = () => {
    setTooltipDate(null);
    setTooltipPosition(null);
  };
  const hideContributionTooltip = target => {
    if (target.matches(':hover') || target === document.activeElement) return;
    closeContributionTooltip();
  };
  const selectContributionYear = year => {
    setSelectedYear(year);
    setSelectedDate(year === currentYear ? todayKey : `${year}-01-01`);
    closeContributionTooltip();
  };
  const moveSelectedDate = (event, dateKey) => {
    const dayOffsets = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
    if (event.key === 'Escape') {
      closeContributionTooltip();
      return;
    }
    if (!(event.key in dayOffsets)) return;
    event.preventDefault();
    const nextDate = new Date(`${dateKey}T00:00:00Z`);
    nextDate.setUTCDate(nextDate.getUTCDate() + dayOffsets[event.key]);
    const nextDateKey = nextDate.toISOString().slice(0, 10);
    if (nextDate.getUTCFullYear() !== contributionYear) return;
    setSelectedDate(nextDateKey);
    document.querySelector(`[data-contribution-date="${nextDateKey}"]`)?.focus();
  };
  return (
    <section id="github" className="editorial-section">
      <div className="section-header reveal"><h2>08 — github</h2><a href="https://github.com/olayresjames" target="_blank" rel="noreferrer">@olayresjames ↗</a></div>
      <a className="github-panel reveal" href="https://github.com/olayresjames" target="_blank" rel="noreferrer">
        <span className="github-mark" aria-hidden="true">&lt;/&gt;</span>
        <div><h3>Code, experiments, and works in progress</h3><p>Explore project repositories and the implementation behind my work.</p></div>
        <span aria-hidden="true">↗</span>
      </a>
      <div className="project-updates reveal" aria-label="Selected projects">
        <div className="project-updates-header"><span>selected work</span><span>projects, case studies, and demos</span></div>
        <ol>
          {projectUpdates.map(update => {
            const content = (
              <>
                <span className="project-update-copy"><strong>{update.name}</strong><span>{update.summary}</span></span>
                <span className="project-update-status">{update.status}</span>
              </>
            );
            const link = update.href.startsWith('/') && !update.href.startsWith('/#')
              ? <AppLink className="project-update-link" to={update.href}>{content}</AppLink>
              : <a className="project-update-link" href={update.href} target={update.href.startsWith('http') ? '_blank' : undefined} rel={update.href.startsWith('http') ? 'noreferrer' : undefined}>{content}</a>;

            return (
              <li key={update.name}>
                <span className="project-update-node" aria-hidden="true" />
                {link}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="contribution-panel reveal">
        <div className="contribution-toolbar">
          <div className="contribution-heading">
            <div className="contribution-header"><strong>{contributionTotal.toLocaleString()} contributions in {contributionYear}</strong><span>activity map</span></div>
            <p>Hover or select a day to inspect activity</p>
          </div>
          {availableYears.length > 1 && <div className="contribution-years" role="group" aria-label="Contribution year">
            {availableYears.map(year => <button key={year} type="button" className={year === contributionYear ? 'active' : ''} aria-pressed={year === contributionYear} onClick={() => selectContributionYear(year)}>{year}</button>)}
          </div>}
        </div>
        <div className="contribution-stats" role="group" aria-label="Contribution streak statistics">
          <div className="contribution-stat"><strong>{currentStreak === null ? '—' : currentStreak}<span>{currentStreak === null ? '' : 'd'}</span></strong><small>current streak</small></div>
          <div className="contribution-stat"><strong>{longestStreak}<span>d</span></strong><small>longest streak</small></div>
          <div className="contribution-stat"><strong>{activeDays}</strong><small>active days</small></div>
        </div>
        <div className="contribution-detail" aria-live="polite">
          <div><span>selected day</span><strong>{selectedDateLabel}</strong></div>
          <strong>{selectedDay?.count == null ? (selectedDay?.level ? 'Activity recorded' : 'No contributions') : `${selectedDay.count} contribution${selectedDay.count === 1 ? '' : 's'}`}</strong>
        </div>
        <div className="contribution-scroll" onScroll={closeContributionTooltip}>
          <div className="contribution-months" aria-hidden="true">{monthLabels.map(({ label, weekIndex }) => <span key={`${contributionYear}-${label}`} style={{ gridColumn: weekIndex }}>{label}</span>)}</div>
          <div className="contribution-grid" role="group" aria-label={`Contribution activity in ${contributionYear}`}>
            {contributionWeeks.map(week => week.map(({ dateKey, level }) => {
              if (Number(dateKey.slice(0, 4)) !== contributionYear) return <span key={dateKey} className="contribution-cell level-0" aria-hidden="true" />;
              const entry = yearDays[dateKey];
              const dayCount = entry?.count;
              const dayDescription = dayCount == null ? (level ? 'Activity recorded' : 'No contributions') : `${dayCount} contribution${dayCount === 1 ? '' : 's'}`;
              return <button key={dateKey} type="button" className={`contribution-cell level-${level}${selectedDate === dateKey ? ' is-selected' : ''}`} data-contribution-date={dateKey} aria-label={`${dateKey}: ${dayDescription}`} aria-pressed={selectedDate === dateKey} tabIndex={selectedDate === dateKey ? 0 : -1} onMouseEnter={event => showContributionTooltip(dateKey, event.currentTarget)} onMouseLeave={event => { if (!event.relatedTarget?.closest?.('.contribution-grid button.contribution-cell')) hideContributionTooltip(event.currentTarget); }} onFocus={event => showContributionTooltip(dateKey, event.currentTarget)} onBlur={event => hideContributionTooltip(event.currentTarget)} onClick={event => showContributionTooltip(dateKey, event.currentTarget)} onKeyDown={event => moveSelectedDate(event, dateKey)} />;
            }))}
          </div>
        </div>
        {tooltipDate && tooltipPosition && <div className={`contribution-tooltip${tooltipPosition.below ? ' is-below' : ''}`} style={{ left: tooltipPosition.left, top: tooltipPosition.top }} aria-hidden="true">{tooltipMessage}</div>}
        <div className="contribution-footer"><span>less</span><div className="contribution-legend" aria-hidden="true">{[0, 1, 2, 3, 4].map(level => <span key={level} className={`contribution-cell level-${level}`} />)}</div><span>more</span></div>
      </div>
    </section>
  );
}

export function SocialMedia() {
  const profiles = [
    ['01', 'Facebook', 'jmsolyrs', 'https://www.facebook.com/jmsolyrs'],
    ['02', 'Instagram', '@jmsolyrs', 'https://www.instagram.com/jmsolyrs/?hl=en'],
  ];

  return (
    <section id="social" className="editorial-section">
      <div className="section-header reveal"><h2>09 — social media</h2><span>find me elsewhere</span></div>
      <p className="section-intro reveal">A few places to follow along outside of the portfolio.</p>
      <div className="social-grid reveal">
        {profiles.map(([number, platform, handle, href]) => (
          <a className="social-card" key={platform} href={href} target="_blank" rel="noreferrer">
            <span className="social-card-number">{number}</span>
            <span className="social-card-copy"><span>{platform}</span><strong>{handle}</strong></span>
            <span className="social-card-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Hobbies() {
  const songs = [
    ['motion', 'https://youtu.be/p_kUmmd3PVg'],
    ['sincity', 'https://youtu.be/_CUu6VfzuFY'],
    ['get that', 'https://youtu.be/NU2d52qCEbc'],
    ['baguvix · esskid ft. tuz', 'https://youtu.be/BHmWAR5VSrU'],
    ['bara bara · esskid and tuz', 'https://youtu.be/SOD2YxGD1tc'],
  ];

  return (
    <section id="hobbies" className="editorial-section hobbies-section">
      <div className="section-header reveal"><h2>10 — hobbies</h2><span>music / esskid</span></div>
      <div className="hobby-intro reveal">
        <div>
          <p className="hobby-kicker">outside the build</p>
          <h3>I sometimes make music as <em>esskid</em>.</h3>
          <p>I drop songs on SoundCloud and YouTube from time to time, usually with friends and collaborators.</p>
        </div>
        <div className="text-links hobby-platforms" aria-label="esskid music profiles">
          <a href="https://soundcloud.com/esskid" target="_blank" rel="noreferrer">soundcloud ↗</a>
          <a href="https://www.youtube.com/@esskidwsg" target="_blank" rel="noreferrer">youtube ↗</a>
        </div>
      </div>
      <div className="featured-songs reveal">
        <div className="featured-songs-header"><span>featured songs</span><span>esskid / youtube</span></div>
        <ol>
          {songs.map(([title, href], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <a href={href} target="_blank" rel="noreferrer">{title} <span aria-hidden="true">↗</span></a>
              {index === songs.length - 1 && <small>our first officially recorded song</small>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="editorial-section contact-section">
      <div className="halftone halftone-footer" aria-hidden="true" />
      <p className="section-heading reveal">11 — contact</p>
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
