import { useState } from 'react';
import { awards, certifications } from '../data/siteData';
import ThemeControl from '../components/ThemeControl';
import { Lightbox } from '../components/Modals';
import { usePageMeta } from '../hooks/usePageMeta';

function CertificationCard({ certificate }) {
  return (
    <article className="certification-page-card">
      <div className="certification-icon" aria-hidden="true">fcc</div>
      <h2>{certificate.title}</h2>
      <p>{certificate.issuer}</p>
      <span>{certificate.version}</span>
      <a href={certificate.verify} target="_blank" rel="noreferrer">‹ verify ›</a>
    </article>
  );
}

function AwardCard({ award, onPreview }) {
  return (
    <article className="award-card">
      <button type="button" className="award-preview" onClick={() => onPreview({ src: award.image, alt: award.alt })} aria-label={`Preview ${award.title} award image`}>
        <img src={award.image} alt={award.alt} />
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
    description: 'Verified frontend development and Python certifications earned by Rafhael James Olayres.',
    path: '/certifications',
  });

  return (
    <>
      <a className="skip-link" href="#certifications-page">Skip to certifications</a>
      <header className="case-nav">
        <a href="/" className="identity-name">James Olayres</a>
        <div><ThemeControl /><a href="/#certifications">home ↩</a></div>
      </header>
      <main id="certifications-page" className="certifications-page">
        <div className="halftone certifications-page-halftone" aria-hidden="true" />
        <header className="certifications-page-header">
          <p className="section-heading">verified credentials</p>
          <h1>certifications</h1>
          <p>Credentials across frontend development and Python computing—each verifiable at its source.</p>
        </header>
        <p className="certification-category">freeCodeCamp</p>
        <div className="certification-page-deck">
          {certifications.map(certificate => <CertificationCard key={`${certificate.title}-${certificate.version}`} certificate={certificate} />)}
        </div>
        <section className="awards-section" aria-labelledby="awards-heading">
          <p className="certification-category" id="awards-heading">awards & recognition</p>
          <div className="awards-grid">
            {awards.map(award => <AwardCard key={award.title} award={award} onPreview={setPreview} />)}
          </div>
        </section>
        <p className="certifications-page-footer"><a href="/#certifications">← back to portfolio</a></p>
      </main>
      <Lightbox preview={preview} onClose={() => setPreview(null)} />
    </>
  );
}
