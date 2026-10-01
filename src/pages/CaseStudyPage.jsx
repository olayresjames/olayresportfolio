import ResponsiveImage from '../components/ResponsiveImage';
import AppLink from '../components/AppLink';
import CaseStudySystemMap from '../components/CaseStudySystemMap';
import ThemeControl from '../components/ThemeControl';
import { usePageMeta } from '../hooks/usePageMeta';
import { useState } from 'react';
import { Lightbox } from '../components/Modals';

export default function CaseStudyPage({ study }) {
  const [previewIndex, setPreviewIndex] = useState(null);
  const caseImages = [study, ...(study.artGallery || []), ...(study.gallery || [])].map(item => ({
    src: item.image,
    alt: item.alt,
    caption: item.caption,
  }));
  const openPreview = index => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);
  const preview = previewIndex === null ? null : {
    ...caseImages[previewIndex],
    items: caseImages,
    index: previewIndex,
    onNavigate: setPreviewIndex,
  };

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
      <header className="case-nav"><AppLink to="/" className="identity-name">James Olayres</AppLink><div><ThemeControl /><AppLink to="/#projects">projects ↩</AppLink></div></header>
      <main id="case-content" className="case-study">
        <span className="case-kicker">{study.kicker}</span>
        <h1>{study.title}</h1>
        <p className="case-lede">{study.lede}</p>
        <div className="case-actions">
          {study.actions.map(([label, url]) => <a key={label} className="text-button" href={url} target="_blank" rel="noopener noreferrer">{label} <span aria-hidden="true">↗</span></a>)}
        </div>
        {study.meta && <dl className="case-meta">
          {study.meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>}
        <div className="case-hero"><button type="button" className="case-image-trigger" onClick={() => openPreview(0)} aria-label="Open cover art in full view"><ResponsiveImage item={study} sizes="(max-width: 768px) 92vw, 100vw" eager /></button></div>
        {study.architecture && <CaseStudySystemMap title={study.title} stages={study.architecture} />}
        <p className="case-section-label">project breakdown</p>
        <div className="case-grid">
          {study.blocks.map(([title, copy]) => <section className="case-block" key={title}><h2>{title}</h2><p>{copy}</p></section>)}
        </div>
        <p className="case-footer"><AppLink className="text-button" to="/#projects">← Back to selected projects</AppLink></p>
        {study.artGallery?.length > 0 && <section className="case-gallery case-art-gallery" aria-labelledby="case-art-heading">
          <p className="case-section-label" id="case-art-heading">visual language</p>
          <div className="case-gallery-grid case-art-grid">
            {study.artGallery.map((item, index) => <figure key={item.image} className="case-gallery-item">
              <button type="button" className="case-image-trigger case-gallery-image" onClick={() => openPreview(index + 1)} aria-label={`Open ${item.caption} in full view`}><ResponsiveImage item={item} sizes="(max-width: 768px) 92vw, 27vw" /></button>
              <figcaption>{item.caption}</figcaption>
            </figure>)}
          </div>
        </section>}
        {study.gallery?.length > 0 && <section className="case-gallery" aria-labelledby="case-gallery-heading">
          <p className="case-section-label" id="case-gallery-heading">gameplay screenshots</p>
          <div className="case-gallery-grid">
            {study.gallery.map((item, index) => <figure key={item.image} className="case-gallery-item">
              <button type="button" className="case-image-trigger case-gallery-image" onClick={() => openPreview(1 + (study.artGallery?.length || 0) + index)} aria-label={`Open ${item.caption} in full view`}><ResponsiveImage item={item} sizes="(max-width: 768px) 92vw, 27vw" /></button>
              <figcaption>{item.caption}</figcaption>
            </figure>)}
          </div>
        </section>}
      </main>
      <Lightbox preview={preview} onClose={closePreview} />
    </>
  );
}
