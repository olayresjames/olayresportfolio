import { useState } from 'react';
import AppLink from '../components/AppLink';
import ThemeControl from '../components/ThemeControl';
import { Lightbox } from '../components/Modals';
import { galleryItems } from '../data/siteData';
import { usePageMeta } from '../hooks/usePageMeta';

function GalleryPageCard({ item, index, onPreview }) {
  return (
    <article className="gallery-page-card">
      <button className="gallery-page-image" type="button" onClick={() => onPreview({ src: item.image, alt: item.alt })} aria-label={`Preview ${item.title}`}><img src={item.image} alt={item.alt} /></button>
      <div className="gallery-page-card-copy">
        <span>{String(index + 1).padStart(2, '0')} / gallery</span>
        <h2>{item.title}</h2>
        <p>{item.caption}</p>
      </div>
    </article>
  );
}

export default function GalleryPage() {
  const [preview, setPreview] = useState(null);
  usePageMeta({ title: 'Gallery | Rafhael James Olayres', description: 'A visual archive of projects, awards, and selected moments from Rafhael James Olayres.', path: '/gallery' });

  return (
    <>
      <a className="skip-link" href="#gallery-page">Skip to gallery</a>
      <header className="case-nav">
        <AppLink to="/" className="identity-name">James Olayres</AppLink>
        <div><ThemeControl /><AppLink to="/#about">home ↩</AppLink></div>
      </header>
      <main id="gallery-page" className="gallery-page">
        <div className="halftone gallery-page-halftone" aria-hidden="true" />
        <header className="gallery-page-header">
          <p className="section-heading">visual archive</p>
          <h1>gallery</h1>
          <p>Selected moments, artifacts, and milestones from the work behind the projects.</p>
        </header>
        <div className="gallery-page-list">{galleryItems.map((item, index) => <GalleryPageCard key={item.title} item={item} index={index} onPreview={setPreview} />)}</div>
        <p className="gallery-page-footer"><AppLink to="/#about">← back to portfolio</AppLink></p>
      </main>
      <Lightbox preview={preview} onClose={() => setPreview(null)} />
    </>
  );
}
