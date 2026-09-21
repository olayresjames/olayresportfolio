import { useEffect, useState } from 'react';
import { projects } from '../../data/siteData';
import ResponsiveImage from '../ResponsiveImage';

const filters = [['all', 'all'], ['ai', 'ai'], ['fullstack', 'full-stack'], ['frontend', 'frontend']];

function DeckCard({ project, position, onActivate, onPreview }) {
  const active = position === 'center';
  const activateWithKeyboard = event => {
    if (!active && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <article
      className={`deck-card is-${position} ${project.featured ? 'featured' : ''}`}
      role={active ? 'group' : 'button'}
      tabIndex={position === 'hidden' ? -1 : 0}
      aria-label={active ? `${project.name}, selected project` : `Show ${project.name}`}
      aria-hidden={position === 'hidden'}
      onClick={active ? undefined : onActivate}
      onKeyDown={activateWithKeyboard}
    >
      <button
        type="button"
        className={`deck-preview ${project.previewFit === 'contain' ? 'is-contain' : ''}`}
        aria-label={`Preview ${project.name}`}
        onClick={event => {
          event.stopPropagation();
          if (active) onPreview({ src: project.webp || project.image, alt: project.alt });
          else onActivate();
        }}
      >
        <ResponsiveImage item={project} sizes="(max-width: 700px) 80vw, 360px" />
        <span className="deck-preview-kicker">{project.featured ? 'featured case study' : project.date === 'Current' ? 'current build' : 'selected work'}</span>
        <span className="deck-preview-label">preview <span aria-hidden="true">↗</span></span>
      </button>
      <div className="deck-tags">
        <span className={project.featured ? 'inverted-tag' : ''}>{project.featured ? 'featured project' : project.tag}</span>
        <span>{project.date}</span>
      </div>

      <div className="deck-heading">
        <h3>{project.name}</h3>
      </div>

      <p className="deck-description">{project.summary || project.description}</p>
      {project.proof && <p className="deck-proof">{project.proof}</p>}
      <p className="deck-technologies">{project.technologies.join(' · ')}</p>

      <div className="deck-links" aria-hidden={!active}>
        {project.caseStudyUrl && <a tabIndex={active ? 0 : -1} href={project.caseStudyUrl} onClick={event => event.stopPropagation()}>case study ↗</a>}
        {project.liveUrl && <a tabIndex={active ? 0 : -1} href={project.liveUrl} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>live demo ↗</a>}
        {project.url && <a tabIndex={active ? 0 : -1} href={project.url} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>{project.linkLabel?.toLowerCase() || 'view project'} ↗</a>}
      </div>
    </article>
  );
}

export default function Projects({ onPreview }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const visible = projects.filter(project => activeFilter === 'all' || project.category === activeFilter);

  useEffect(() => setActiveIndex(0), [activeFilter]);

  const move = direction => setActiveIndex(index => (index + direction + visible.length) % visible.length);
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
        <a href="/projects">all projects →</a>
      </div>
      <p className="section-intro reveal">Products, experiments, and interfaces spanning civic technology, AI integration, web platforms, and games.</p>
      <div className="filter-row reveal" role="group" aria-label="Filter projects">
        {filters.map(([value, label]) => <button key={value} type="button" aria-pressed={activeFilter === value} onClick={() => setActiveFilter(value)}>{label}</button>)}
      </div>

      <div className="project-deck reveal" aria-live="polite">
        {visible.map((project, index) => (
          <DeckCard key={project.id} project={project} position={positionFor(index)} onActivate={() => setActiveIndex(index)} onPreview={onPreview} />
        ))}
      </div>

      <div className="deck-controls reveal">
        <button type="button" onClick={() => move(-1)} aria-label="Previous project">← prev</button>
        <span><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(visible.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => move(1)} aria-label="Next project">next →</button>
      </div>
    </section>
  );
}
