import ResponsiveImage from '../components/ResponsiveImage';
import ThemeControl from '../components/ThemeControl';
import { usePageMeta } from '../hooks/usePageMeta';

export default function CaseStudyPage({ study }) {
  usePageMeta({
    title: study.pageTitle,
    description: study.description,
    path: study.path,
    image: study.webp,
    type: 'article',
  });

  return (
    <>
      <a className="skip-link" href="#case-content">Skip to content</a>
      <header className="case-nav"><a href="/" className="identity-name">James Olayres</a><div><ThemeControl /><a href="/#projects">projects ↩</a></div></header>
      <main id="case-content" className="case-study">
        <span className="case-kicker">{study.kicker}</span>
        <h1>{study.title}</h1>
        <p className="case-lede">{study.lede}</p>
        <div className="case-actions">
          {study.actions.map(([label, url]) => <a key={label} className="text-button" href={url} target="_blank" rel="noopener noreferrer">{label} <span aria-hidden="true">↗</span></a>)}
        </div>
        <div className="case-hero"><ResponsiveImage item={study} sizes="(max-width: 768px) 92vw, 100vw" eager /></div>
        <div className="case-grid">
          {study.blocks.map(([title, copy]) => <section className="case-block" key={title}><h2>{title}</h2><p>{copy}</p></section>)}
        </div>
        <p className="case-footer"><a className="text-button" href="/#projects">← Back to selected projects</a></p>
      </main>
    </>
  );
}
