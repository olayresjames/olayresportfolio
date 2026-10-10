import { useEffect, useRef, useState } from 'react';
import AppLink from '../AppLink';
import { projects } from '../../data/siteData';
import ResponsiveImage from '../ResponsiveImage';

const filters = [['all', 'all'], ['ai', 'ai'], ['fullstack', 'full-stack'], ['frontend', 'frontend'], ['game', 'games']];

function ProjectIcon({ name }) {
  const paths = {
    caseStudy: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    external: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    code: <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6M14 4l-4 16" /></>,
    previous: <><path d="m15 18-6-6 6-6" /></>,
    next: <><path d="m9 18 6-6-6-6" /></>,
  };

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function DeckCard({ project, position, onActivate, onPreview }) {
  const active = position === 'center';
  const previewContent = (
    <>
      {project.image ? <ResponsiveImage item={project} sizes="(max-width: 700px) 80vw, 360px" /> : (
        <span className="deck-placeholder-copy" aria-hidden="true">
          <strong>{project.name}</strong>
          <small>local-first study expedition</small>
        </span>
      )}
      {(project.featured || project.date === 'Current') && <span className="deck-preview-kicker">{project.featured ? 'featured case study' : 'current build'}</span>}
      {project.image && <span className="deck-preview-label">preview <span aria-hidden="true">↗</span></span>}
    </>
  );

  return (
    <article
      className={`deck-card is-${position} ${project.featured ? 'featured' : ''}`}
      aria-label={`${project.name}${active ? ', selected project' : ''}`}
      aria-hidden={position === 'hidden'}
    >
      {project.image || !active ? (
        <button
          type="button"
          className={`deck-preview ${project.previewFit === 'contain' ? 'is-contain' : ''} ${!project.image ? 'deck-preview-placeholder' : ''}`}
          aria-label={`${active ? 'Preview' : 'Select'} ${project.name}`}
          tabIndex={position === 'hidden' ? -1 : 0}
          onClick={() => {
            if (active && project.image) onPreview({ src: project.webp || project.image, alt: project.alt });
            else if (!active) onActivate();
          }}
        >
          {previewContent}
          {!project.image && <span className="deck-preview-label">select <span aria-hidden="true">↗</span></span>}
        </button>
      ) : (
        <div className="deck-preview deck-preview-placeholder" aria-hidden="true">{previewContent}</div>
      )}
      <div className="deck-tags">
        <span className={project.featured ? 'inverted-tag' : ''}>{project.featured ? 'featured project' : project.tag}</span>
        {project.venue && <span>{project.venue}</span>}
        <span>{project.date}</span>
      </div>

      <div className="deck-heading">
        <h3>{project.name}</h3>
      </div>

      <p className="deck-description">{project.summary || project.description}</p>
      {project.proof && <p className="deck-proof">{project.proof}</p>}
      <p className="deck-technologies">{project.technologies.join(' · ')}</p>

      <div className="deck-links" aria-hidden={!active}>
        {project.caseStudyUrl && (
          <AppLink className="deck-action" tabIndex={active ? 0 : -1} to={project.caseStudyUrl} aria-label={`Open ${project.name} case study`} title="Case study" onClick={event => event.stopPropagation()}>
            <ProjectIcon name="caseStudy" />
          </AppLink>
        )}
        {project.liveUrl && (
          <a className="deck-action" tabIndex={active ? 0 : -1} href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live demo`} title="Live demo" onClick={event => event.stopPropagation()}>
            <ProjectIcon name="external" />
          </a>
        )}
        {project.url && (
          <a className="deck-action" tabIndex={active ? 0 : -1} href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} ${project.linkLabel || 'project link'}`} title={project.linkLabel || 'View project'} onClick={event => event.stopPropagation()}>
            <ProjectIcon name={/github|source|repository/i.test(`${project.linkLabel || ''} ${project.url}`) ? 'code' : 'external'} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects({ onPreview }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(null);
  const suppressClick = useRef(false);
  const swipeResetTimer = useRef(null);
  const visible = projects.filter(project => activeFilter === 'all' || (project.categories || [project.category]).includes(activeFilter));

  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  useEffect(() => () => window.clearTimeout(swipeResetTimer.current), []);

  const move = direction => setActiveIndex(index => (index + direction + visible.length) % visible.length);
  const handleTouchStart = event => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = event => {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

    move(deltaX < 0 ? 1 : -1);
    suppressClick.current = true;
    window.clearTimeout(swipeResetTimer.current);
    swipeResetTimer.current = window.setTimeout(() => {
      suppressClick.current = false;
    }, 400);
  };
  const handleDeckClickCapture = event => {
    if (!suppressClick.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
    window.clearTimeout(swipeResetTimer.current);
  };
  const positionFor = index => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex - 1 + visible.length) % visible.length) return 'left';
    if (index === (activeIndex + 1) % visible.length) return 'right';
    return 'hidden';
  };

  return (
    <section id="projects" className="editorial-section wide-section projects-section">
      <div className="section-header reveal">
        <h2>02 — projects</h2>
        <AppLink to="/projects">all projects →</AppLink>
      </div>
      <p className="section-intro reveal">Products, experiments, and interfaces spanning civic technology, AI integration, web platforms, and games.</p>
      <div className="filter-row reveal" role="group" aria-label="Filter projects">
        {filters.map(([value, label]) => <button key={value} type="button" aria-pressed={activeFilter === value} onClick={() => setActiveFilter(value)}>{label}</button>)}
      </div>

      <div
        className="project-deck reveal"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
        onClickCapture={handleDeckClickCapture}
      >
        {visible.map((project, index) => (
          <DeckCard key={project.id} project={project} position={positionFor(index)} onActivate={() => setActiveIndex(index)} onPreview={onPreview} />
        ))}
      </div>

      <div className="deck-controls reveal">
        <button type="button" onClick={() => move(-1)} aria-label="Previous project" title="Previous project"><ProjectIcon name="previous" /></button>
        <span><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(visible.length).padStart(2, '0')}</span>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {visible[activeIndex]?.name}, project {activeIndex + 1} of {visible.length}
        </span>
        <button type="button" onClick={() => move(1)} aria-label="Next project" title="Next project"><ProjectIcon name="next" /></button>
      </div>
    </section>
  );
}
