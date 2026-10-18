import { projects } from '../../data/siteData';

export default function Hero({ onOpenResume }) {
  const shippedProjectCount = projects.filter(project => !/\bcurrent\b|\bpresent\b/i.test(project.date || '')).length;
  const portraits = [
    ['/resources/id-picture-v2.png', '/resources/id-picture-v2.webp', '/resources/id-picture-v2-800.webp', 'Black shirt portrait of Rafhael James Olayres'],
    ['/resources/hero-portrait-black-cutout.png', '/resources/hero-portrait-black-cutout.webp', '/resources/hero-portrait-black-cutout-800.webp', 'Black shirt portrait of Rafhael James Olayres'],
    ['/resources/hero-portrait-white-cutout.png', '/resources/hero-portrait-white-cutout.webp', '/resources/hero-portrait-white-cutout-800.webp', 'White shirt portrait of Rafhael James Olayres'],
    ['/resources/masked-variant.png', '/resources/masked-variant.webp', null, 'Portrait in a black web-patterned mask'],
  ];

  return (
    <section id="about" className="hero editorial-section">
      <div className="hero-grid">
        <div className="portrait-wrap reveal">
          <div className="halftone halftone-portrait" aria-hidden="true" />
          <div className="portrait-rotator" aria-label="Portrait of Rafhael James Olayres">
            {portraits.map(([src, webp, webpSmall, alt], index) => <picture key={src}>
              <source srcSet={webpSmall ? `${webpSmall} 800w, ${webp} 1254w` : `${webp} 500w`} sizes="(max-width: 768px) 78vw, 332px" type="image/webp" />
              <img className={index === 0 ? 'is-primary' : ''} src={src} alt={index === 0 ? alt : ''} width={webpSmall ? 1254 : 500} height={webpSmall ? 1254 : 500} decoding="async" fetchPriority={index === 0 ? 'high' : undefined} aria-hidden={index === 0 ? undefined : 'true'} />
            </picture>)}
          </div>
        </div>
        <div className="hero-copy">
          <p className="hero-kicker reveal">Full-stack developer · IT student · Valenzuela, PH</p>
          <h1 className="reveal">Rafhael James Olayres</h1>
          <p className="hero-lede reveal">I’m a full-stack developer and IT student building practical web, mobile, and AI-powered products.</p>
          <p className="hero-secondary reveal">Right now I’m developing the PNP Internship Database Tracking Management System with the Camp Crame ITMS Office’s Special Project Management Team while studying BSIT at PLV.</p>
          <div className="text-links hero-links reveal" aria-label="Profile and portfolio links">
            <a href="https://github.com/olayresjames" target="_blank" rel="noreferrer">github ↗</a>
            <a href="https://linkedin.com/in/james-olayres-888721410" target="_blank" rel="noreferrer">linkedin ↗</a>
            <a href="mailto:olayres.rafhaeljames@gmail.com">email ↗</a>
            <a href="#projects">projects ↗</a>
            <button className="text-button" type="button" onClick={onOpenResume}>résumé ↗</button>
          </div>
          <p className="hero-availability reveal">Open to internships, freelance work, and thoughtful collaborations.</p>
        </div>
      </div>
      <div className="hero-affiliations reveal" aria-label="Current work, education, and project experience">
        <a className="hero-affiliation" href="#experience">
          <span className="hero-affiliation-mark" aria-hidden="true">PNP</span>
          <span><strong>Camp Crame ITMS Office</strong><small>Full-stack project developer · current</small></span>
        </a>
        <a className="hero-affiliation" href="#education">
          <span className="hero-affiliation-mark" aria-hidden="true">PLV</span>
          <span><strong>Pamantasan ng Lungsod ng Valenzuela</strong><small>BS Information Technology · 2023–2027</small></span>
        </a>
        <a className="hero-affiliation" href="#projects">
          <span className="hero-affiliation-mark" aria-hidden="true">PN</span>
          <span><strong>AppBuildersPH Hackathon</strong><small>Point Nemo · 2026</small></span>
        </a>
      </div>
      <dl className="stats-row reveal">
        <div><dt>Projects shipped</dt><dd>{String(shippedProjectCount).padStart(2, '0')}</dd></div>
        <div><dt>Independent development since</dt><dd>2023</dd></div>
        <div><dt>Based in</dt><dd>Valenzuela, PH</dd></div>
      </dl>
    </section>
  );
}
