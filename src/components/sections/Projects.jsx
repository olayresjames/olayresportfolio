import { useEffect, useRef, useState } from 'react';
import AppLink from '../AppLink';
import { projects } from '../../data/siteData';
import ResponsiveImage from '../ResponsiveImage';

const filters = [['all', 'all'], ['ai', 'ai'], ['fullstack', 'full-stack'], ['frontend', 'frontend'], ['game', 'games']];

function DeckCard({ project, position, onActivate, onPreview }) {
  const active = position === 'center';

  return (
    <article
      className={`deck-card is-${position} ${project.featured ? 'featured' : ''}`}
      aria-label={`${project.name}${active ? ', selected project' : ''}`}
      aria-hidden={position === 'hidden'}
    >
      <button
        type="button"
        className={`deck-preview ${project.previewFit === 'contain' ? 'is-contain' : ''}`}
        aria-label={`${active ? 'Preview' : 'Select'} ${project.name}`}
        tabIndex={position === 'hidden' ? -1 : 0}
        onClick={() => {
          if (active) onPreview({ src: project.webp || project.image, alt: project.alt });
          else onActivate();
        }}
      >
        <ResponsiveImage item={project} sizes="(max-width: 700px) 80vw, 360px" />
        {(project.featured || project.date === 'Current') && <span className="deck-preview-kicker">{project.featured ? 'featured case study' : 'current build'}</span>}
        <span className="deck-preview-label">{active ? 'preview' : 'select'} <span aria-hidden="true">↗</span></span>
      </button>
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
        {project.caseStudyUrl && <AppLink tabIndex={active ? 0 : -1} to={project.caseStudyUrl} onClick={event => event.stopPropagation()}>case study ↗</AppLink>}
        {project.liveUrl && <a tabIndex={active ? 0 : -1} href={project.liveUrl} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>live demo ↗</a>}
        {project.url && <a tabIndex={active ? 0 : -1} href={project.url} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>{project.linkLabel?.toLowerCase() || 'view project'} ↗</a>}
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
        <button type="button" onClick={() => move(-1)} aria-label="Previous project">← prev</button>
        <span><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(visible.length).padStart(2, '0')}</span>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {visible[activeIndex]?.name}, project {activeIndex + 1} of {visible.length}
        </span>
        <button type="button" onClick={() => move(1)} aria-label="Next project">next →</button>
      </div>
    </section>
  );
}
