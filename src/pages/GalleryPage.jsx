import { useState } from 'react';
import AppLink from '../components/AppLink';
import ThemeControl from '../components/ThemeControl';
import ResponsiveImage from '../components/ResponsiveImage';
import { Lightbox } from '../components/Modals';
import { galleryGroups } from '../data/siteData';
import { usePageMeta } from '../hooks/usePageMeta';

function GalleryPageCard({ item, index, total, onPreview }) {
  return (
    <article className="gallery-page-card">
      <button className="gallery-page-image" type="button" onClick={() => onPreview({ src: item.image, alt: item.alt, caption: item.title })} aria-label={`Preview ${item.title}`}><ResponsiveImage item={item} sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw" /></button>
      <div className="gallery-page-card-copy">
        <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <h3>{item.title}</h3>
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
        <div className="gallery-page-albums">
          {galleryGroups.map(group => (
            <section className="gallery-album" key={group.id} aria-labelledby={`album-${group.id}`}>
              <header className="gallery-album-header">
                <div>
                  <span>{String(group.items.length).padStart(2, '0')} photos</span>
                  <h2 id={`album-${group.id}`}>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
                {group.byline && <small>{group.byline}</small>}
              </header>
              <div className="gallery-page-list">
                {group.items.map((item, index) => <GalleryPageCard key={item.title} item={item} index={index} total={group.items.length} onPreview={setPreview} />)}
              </div>
            </section>
          ))}
        </div>
        <p className="gallery-page-footer"><AppLink to="/#about">← back to portfolio</AppLink></p>
      </main>
      <Lightbox preview={preview} onClose={() => setPreview(null)} />
    </>
  );
}
