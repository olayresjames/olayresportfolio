import ThemeControl from '../components/ThemeControl';
import { galleryItems } from '../data/siteData';
import { usePageMeta } from '../hooks/usePageMeta';

function GalleryPageCard({ item, index }) {
  return (
    <article className="gallery-page-card">
      <div className="gallery-page-image"><img src={item.image} alt={item.alt} /></div>
      <div className="gallery-page-card-copy">
        <span>{String(index + 1).padStart(2, '0')} / gallery</span>
        <h2>{item.title}</h2>
        <p>{item.caption}</p>
      </div>
    </article>
  );
}

export default function GalleryPage() {
  usePageMeta({ title: 'Gallery | Rafhael James Olayres', description: 'A visual archive of projects, awards, and selected moments from Rafhael James Olayres.', path: '/gallery' });

  return (
    <>
      <a className="skip-link" href="#gallery-page">Skip to gallery</a>
      <header className="case-nav">
        <a href="/" className="identity-name">James Olayres</a>
        <div><ThemeControl /><a href="/#about">home ↩</a></div>
      </header>
      <main id="gallery-page" className="gallery-page">
        <div className="halftone gallery-page-halftone" aria-hidden="true" />
        <header className="gallery-page-header">
          <p className="section-heading">visual archive</p>
          <h1>gallery</h1>
          <p>Selected moments, artifacts, and milestones from the work behind the projects.</p>
        </header>
        <div className="gallery-page-list">{galleryItems.map((item, index) => <GalleryPageCard key={item.title} item={item} index={index} />)}</div>
        <p className="gallery-page-footer"><a href="/#about">← back to portfolio</a></p>
      </main>
    </>
  );
}
