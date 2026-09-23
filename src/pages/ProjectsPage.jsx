import ResponsiveImage from '../components/ResponsiveImage';
import ThemeControl from '../components/ThemeControl';
import { projects } from '../data/siteData';
import { usePageMeta } from '../hooks/usePageMeta';

function ProjectRow({ project }) {
  return (
    <article className="all-project-card">
      <div className="all-project-image">
        <ResponsiveImage item={project} sizes="(max-width: 767px) 100vw, 160px" />
      </div>
      <div className="all-project-content">
        <div className="all-project-tags">
          <span className={project.featured ? 'inverted-tag' : ''}>{project.featured ? 'featured project' : project.tag}</span>
          {project.venue && <span>{project.venue}</span>}
          <span>{project.date}</span>
        </div>
        <h2>{project.name}</h2>
        <p>{project.summary || project.description}</p>
        <p className="all-project-tech">{project.technologies.join(' · ')}</p>
        <div className="all-project-links">
          {project.caseStudyUrl && <a href={project.caseStudyUrl}>case study ↗</a>}
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">live demo ↗</a>}
          {project.url && <a href={project.url} target="_blank" rel="noreferrer">{project.linkLabel?.toLowerCase() || 'view project'} ↗</a>}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  usePageMeta({
    title: 'Projects | Rafhael James Olayres',
    description: 'Selected web, mobile, AI, and game development projects by Rafhael James Olayres.',
    path: '/projects',
  });

  return (
    <>
      <a className="skip-link" href="#projects-page">Skip to projects</a>
      <header className="case-nav">
        <a href="/" className="identity-name">James Olayres</a>
        <div><ThemeControl /><a href="/#projects">home ↩</a></div>
      </header>
      <main id="projects-page" className="projects-page">
        <div className="halftone projects-page-halftone" aria-hidden="true" />
        <header className="projects-page-header">
          <p className="section-heading">selected work</p>
          <h1>projects</h1>
          <p>Products and platforms I’ve designed and shipped—spanning civic technology, generative AI, consumer applications, web platforms, and games.</p>
        </header>
        <div className="all-projects-list">
          {projects.map(project => <ProjectRow key={project.id} project={project} />)}
        </div>
        <p className="projects-page-footer"><a href="/#projects">← back to portfolio</a></p>
      </main>
    </>
  );
}
