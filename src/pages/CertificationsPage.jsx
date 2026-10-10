import { useState } from 'react';
import AppLink from '../components/AppLink';
import { awards, certifications } from '../data/siteData';
import ThemeControl from '../components/ThemeControl';
import { Lightbox } from '../components/Modals';
import { usePageMeta } from '../hooks/usePageMeta';

function CertificationCard({ certificate, onPreview }) {
  const mark = certificate.mark || (certificate.issuer === 'freeCodeCamp' ? 'fcc' : certificate.issuer.slice(0, 2).toUpperCase());
  return (
    <article
      className={`certification-page-card${certificate.certificateFile ? ' certification-page-card--preview' : ''}`}
      role={certificate.certificateFile ? 'button' : undefined}
      tabIndex={certificate.certificateFile ? 0 : undefined}
      aria-label={certificate.certificateFile ? `View ${certificate.title} certificate` : undefined}
      onClick={certificate.certificateFile ? () => onPreview({ src: certificate.certificateFile, alt: certificate.certificateFileAlt, caption: certificate.title, actionHref: certificate.certificateVerifyUrl, actionLabel: certificate.certificateVerifyLabel }) : undefined}
      onKeyDown={certificate.certificateFile ? event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onPreview({ src: certificate.certificateFile, alt: certificate.certificateFileAlt, caption: certificate.title, actionHref: certificate.certificateVerifyUrl, actionLabel: certificate.certificateVerifyLabel });
        }
      } : undefined}
    >
      <div className="certification-icon" aria-hidden="true">{mark}</div>
      <h2>{certificate.title}</h2>
      <p>{certificate.issuer}</p>
      <span>{certificate.version}</span>
      <div className="certification-actions">
        {certificate.certificateFile ? <span>{certificate.certificateFileLabel || 'click to view'}</span> : <a href={certificate.verify} target="_blank" rel="noreferrer">‹ verify ›</a>}
      </div>
    </article>
  );
}

function AwardCard({ award, onPreview }) {
  return (
    <article className="award-card">
      <button type="button" className="award-preview" onClick={() => onPreview({ src: award.webp || award.image, alt: award.alt })} aria-label={`Preview ${award.title} award image`}>
        <picture>{award.webp && <source srcSet={award.webp} type="image/webp" />}<img src={award.image} alt={award.alt} /></picture>
      </button>
      <div>
        <h2>{award.title}</h2>
        <p>{award.category}</p>
      </div>
    </article>
  );
}

export default function CertificationsPage() {
  const [preview, setPreview] = useState(null);

  usePageMeta({
    title: 'Certifications | Rafhael James Olayres',
    description: 'Verified software development credentials and a 2026 hackathon certificate earned by Rafhael James Olayres.',
    path: '/certifications',
  });

  return (
    <>
      <a className="skip-link" href="#certifications-page">Skip to certifications</a>
      <header className="case-nav">
        <AppLink to="/" className="identity-name">James Olayres</AppLink>
        <div><ThemeControl /><AppLink to="/#certifications">home ↩</AppLink></div>
      </header>
      <main id="certifications-page" className="certifications-page">
        <div className="halftone certifications-page-halftone" aria-hidden="true" />
        <header className="certifications-page-header">
          <p className="section-heading">verified credentials</p>
          <h1>certifications</h1>
          <p>Software development credentials and a 2026 hackathon certificate, with verification links to their sources.</p>
        </header>
        <p className="certification-category">AppBuildersPH</p>
        <div className="certification-page-deck">
          {certifications.filter(certificate => certificate.issuer === 'AppBuildersPH').map(certificate => <CertificationCard key={`${certificate.title}-${certificate.version}`} certificate={certificate} onPreview={setPreview} />)}
        </div>
        <p className="certification-category">freeCodeCamp</p>
        <div className="certification-page-deck">
          {certifications.filter(certificate => certificate.issuer === 'freeCodeCamp').map(certificate => <CertificationCard key={`${certificate.title}-${certificate.version}`} certificate={certificate} onPreview={setPreview} />)}
        </div>
        <section className="awards-section" aria-labelledby="awards-heading">
          <p className="certification-category" id="awards-heading">awards & recognition</p>
          <div className="awards-grid">
            {awards.map(award => <AwardCard key={award.title} award={award} onPreview={setPreview} />)}
          </div>
        </section>
        <p className="certifications-page-footer"><AppLink to="/#certifications">← back to portfolio</AppLink></p>
      </main>
      <Lightbox preview={preview} onClose={() => setPreview(null)} />
    </>
  );
}
