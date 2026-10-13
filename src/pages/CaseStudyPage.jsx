import ResponsiveImage from '../components/ResponsiveImage';
import AppLink from '../components/AppLink';
import CaseStudySystemMap from '../components/CaseStudySystemMap';
import DisplayControls from '../components/DisplayControls';
import { usePageMeta } from '../hooks/usePageMeta';
import { useState } from 'react';
import { Lightbox } from '../components/Modals';

export default function CaseStudyPage({ study }) {
  const [previewIndex, setPreviewIndex] = useState(null);
  const gallerySections = study.gallerySections || [];
  const caseImages = [...(study.image ? [study] : []), ...(study.artGallery || []), ...(study.gallery || []), ...gallerySections.flatMap(section => section.items)].map(item => ({
    src: item.image,
    alt: item.alt,
    caption: item.caption,
  }));
  const gallerySectionOffset = sectionIndex => (study.image ? 1 : 0)
    + (study.artGallery?.length || 0)
    + (study.gallery?.length || 0)
    + gallerySections.slice(0, sectionIndex).reduce((count, section) => count + section.items.length, 0);
  const openPreview = index => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);
  const preview = previewIndex === null ? null : {
    ...caseImages[previewIndex],
    items: caseImages,
    index: previewIndex,
    onNavigate: setPreviewIndex,
  };
  const caseHero = study.image && <div className={`case-hero${study.imageAtBottom ? ' case-hero-bottom' : ''}`}><button type="button" className="case-image-trigger" onClick={() => openPreview(0)} aria-label="Open cover art in full view"><ResponsiveImage item={study} sizes="(max-width: 768px) 92vw, 100vw" eager /></button></div>;

  usePageMeta({
    title: study.pageTitle,
    description: study.description,
    path: study.path,
    image: study.shareImage || study.webp,
    type: 'article',
  });

  return (
    <>
      <a className="skip-link" href="#case-content">Skip to content</a>
      <header className="case-nav"><AppLink to="/" className="identity-name">James Olayres</AppLink><div><DisplayControls /><AppLink to="/#projects">projects ↩</AppLink></div></header>
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
        {study.image && !study.imageAtBottom && caseHero}
        {study.videoId && <section className="case-video-section" aria-labelledby="case-video-heading">
          <p className="case-section-label" id="case-video-heading">project video</p>
          <div className="case-video-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(study.videoId)}?rel=0`}
              title={study.videoTitle || `${study.title} project video`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>}
        {study.architecture && <CaseStudySystemMap title={study.title} stages={study.architecture} />}
        <p className="case-section-label">project breakdown</p>
        <div className="case-grid">
          {study.blocks.map(([title, copy]) => <section className="case-block" key={title}><h2>{title}</h2><p>{copy}</p></section>)}
        </div>
        {!study.imageAtBottom && <p className="case-footer"><AppLink className="text-button" to="/#projects">← Back to selected projects</AppLink></p>}
        {study.artGallery?.length > 0 && <section className="case-gallery case-art-gallery" aria-labelledby="case-art-heading">
          <p className="case-section-label" id="case-art-heading">visual language</p>
          <div className="case-gallery-grid case-art-grid">
            {study.artGallery.map((item, index) => <figure key={item.image} className="case-gallery-item">
              <button type="button" className="case-image-trigger case-gallery-image" onClick={() => openPreview(index + (study.image ? 1 : 0))} aria-label={`Open ${item.caption} in full view`}><ResponsiveImage item={item} sizes="(max-width: 768px) 92vw, 27vw" /></button>
              <figcaption>{item.caption}</figcaption>
            </figure>)}
          </div>
        </section>}
        {study.gallery?.length > 0 && <section className="case-gallery" aria-labelledby="case-gallery-heading">
          <p className="case-section-label" id="case-gallery-heading">{study.galleryHeading || 'gameplay screenshots'}</p>
          <div className="case-gallery-grid">
            {study.gallery.map((item, index) => <figure key={item.image} className="case-gallery-item">
              <button type="button" className="case-image-trigger case-gallery-image" onClick={() => openPreview((study.image ? 1 : 0) + (study.artGallery?.length || 0) + index)} aria-label={`Open ${item.caption} in full view`}><ResponsiveImage item={item} sizes="(max-width: 768px) 92vw, 27vw" /></button>
              <figcaption>{item.caption}</figcaption>
            </figure>)}
          </div>
        </section>}
        {gallerySections.map((section, sectionIndex) => {
          const startIndex = gallerySectionOffset(sectionIndex);
          const headingId = `case-gallery-heading-${sectionIndex}`;
          return <section className="case-gallery case-gallery-role" key={section.heading} aria-labelledby={headingId}>
            <p className="case-section-label" id={headingId}>{section.heading}</p>
            {section.description && <p className="case-gallery-intro">{section.description}</p>}
            <div className="case-gallery-grid">
              {section.items.map((item, index) => <figure key={item.image} className="case-gallery-item">
                <button type="button" className="case-image-trigger case-gallery-image" onClick={() => openPreview(startIndex + index)} aria-label={`Open ${item.caption} in full view`}><ResponsiveImage item={item} sizes="(max-width: 768px) 92vw, 27vw" /></button>
                <figcaption>{item.caption}</figcaption>
              </figure>)}
            </div>
          </section>;
        })}
        {study.imageAtBottom && caseHero}
        {study.imageAtBottom && <p className="case-footer"><AppLink className="text-button" to="/#projects">← Back to selected projects</AppLink></p>}
      </main>
      <Lightbox preview={preview} onClose={closePreview} />
    </>
  );
}
