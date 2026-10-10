import { useCallback } from 'react';
import { useModal } from '../hooks/useModal';

export function Lightbox({ preview, onClose }) {
  const close = useCallback(() => onClose(), [onClose]);
  const modalRef = useModal(Boolean(preview), close);
  if (!preview) return null;
  const items = preview.items || [preview];
  const currentIndex = preview.index ?? 0;
  const hasNavigation = items.length > 1;
  const current = items[currentIndex] || items[0];
  const move = direction => preview.onNavigate?.((currentIndex + direction + items.length) % items.length);

  return (
    <div
      ref={modalRef}
      id="lightbox-modal"
      className="modal-overlay visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onMouseDown={event => event.target === event.currentTarget && onClose()}
      onKeyDown={event => {
        if (!hasNavigation) return;
        if (event.key === 'ArrowLeft') move(-1);
        if (event.key === 'ArrowRight') move(1);
      }}
    >
      <h2 id="lightbox-title" className="sr-only">{current.caption || 'Image preview'}</h2>
      <button className="lightbox-close-btn" aria-label="Close image preview" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      {hasNavigation && <button type="button" className="lightbox-nav lightbox-prev" aria-label="Previous image" onClick={() => move(-1)}>‹</button>}
      <figure className="lightbox-figure">
        <img src={current.src} alt={current.alt} tabIndex="-1" />
        {(current.caption || current.actionHref) && <figcaption>
          {current.caption && <span>{current.caption}</span>}
          {current.actionHref && <a href={current.actionHref} target="_blank" rel="noreferrer">{current.actionLabel || 'Verify with issuer'} ↗</a>}
        </figcaption>}
      </figure>
      {hasNavigation && <button type="button" className="lightbox-nav lightbox-next" aria-label="Next image" onClick={() => move(1)}>›</button>}
      {hasNavigation && <span className="lightbox-counter" aria-live="polite">{currentIndex + 1} / {items.length}</span>}
    </div>
  );
}

export function ResumeModal({ open, onClose }) {
  const close = useCallback(() => onClose(), [onClose]);
  const modalRef = useModal(open, close);
  if (!open) return null;
  return (
    <div
      ref={modalRef}
      id="resume-view-modal"
      className="modal-overlay visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-view-title"
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <div className="modal-content resume-view-container" tabIndex="-1">
        <div className="resume-wrapper-header">
          <span id="resume-view-title" className="resume-title">Resume</span>
          <div className="resume-header-actions">
            <a href="/resources/olayres-resume-2026.pdf" download="Rafhael_James_Olayres_Resume_2026.pdf" className="resume-download-link">Download 2026 PDF ↓</a>
            <button className="resume-close-button" aria-label="Close resume preview" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>
        <object data="/resources/olayres-resume-2026.pdf" type="application/pdf">
          <iframe src="/resources/olayres-resume-2026.pdf" title="Rafhael James Olayres 2026 resume">
            <p className="resume-fallback">Your browser does not support embedded PDFs. <a href="/resources/olayres-resume-2026.pdf" download>Download the 2026 PDF</a>.</p>
          </iframe>
        </object>
      </div>
    </div>
  );
}
