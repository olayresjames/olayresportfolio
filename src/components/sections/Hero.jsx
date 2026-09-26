export default function Hero() {
  const portraits = [
    ['/resources/id-picture-v2.png', 'Black shirt portrait of Rafhael James Olayres'],
    ['/resources/hero-portrait-black-cutout.png', 'Black shirt portrait of Rafhael James Olayres'],
    ['/resources/hero-portrait-white-cutout.png', 'White shirt portrait of Rafhael James Olayres'],
  ];

  return (
    <section id="about" className="hero editorial-section">
      <div className="hero-grid">
        <div className="portrait-wrap reveal">
          <div className="portrait-backdrop" aria-hidden="true">
            <span className="portrait-monogram">RJ</span>
          </div>
          <div className="halftone halftone-portrait" aria-hidden="true" />
          <div className="portrait-rotator" aria-label="Portrait of Rafhael James Olayres">
            {portraits.map(([src, alt], index) => <img key={src} className={index === 0 ? 'is-primary' : ''} src={src} alt={index === 0 ? alt : ''} width="1254" height="1254" decoding="async" fetchPriority={index === 0 ? 'high' : undefined} aria-hidden={index === 0 ? undefined : 'true'} />)}
          </div>
          <div className="portrait-caption" aria-hidden="true">
            <span>RJO</span>
            <span>01 / 27</span>
          </div>
        </div>
        <div className="hero-copy">
          <p className="section-heading reveal">01 — about</p>
          <h1 className="reveal">Rafhael James Olayres</h1>
          <p className="hero-lede reveal">I’m a full-stack developer and IT student building practical web, mobile, and AI-powered products.</p>
          <p className="hero-secondary reveal">Right now I’m developing the PNP Internship Database Tracking Management System, studying at Pamantasan ng Lungsod ng Valenzuela, and completing an internship with the Camp Crame ITMS Office under SPMT.</p>
          <div className="about-details reveal">
            <div><span>working across</span><strong>React, React Native, Firebase, Supabase, and AI integrations</strong></div>
            <div><span>open to</span><strong>Internships, freelance work, and thoughtful collaborations</strong></div>
          </div>
          <div className="hero-actions reveal">
            <a className="button button-primary" href="#projects">view selected work <span aria-hidden="true">↗</span></a>
            <a className="button button-secondary" href="/resources/olayres-resume-2026.pdf" download="Rafhael_James_Olayres_Resume_2026.pdf">download résumé <span aria-hidden="true">↓</span></a>
          </div>
          <div className="text-links reveal" aria-label="Social links">
            <a href="https://github.com/olayresjames" target="_blank" rel="noreferrer">github ↗</a>
            <a href="https://linkedin.com/in/james-olayres-888721410" target="_blank" rel="noreferrer">linkedin ↗</a>
            <a href="mailto:olayres.rafhaeljames@gmail.com">email ↗</a>
          </div>
        </div>
      </div>
      <dl className="stats-row reveal">
        <div><dt>Projects</dt><dd>8 shipped</dd></div>
        <div><dt>Education</dt><dd>BSIT · PLV ’27</dd></div>
        <div><dt>Focus</dt><dd>AI + full-stack</dd></div>
        <div><dt>Based in</dt><dd>Valenzuela, PH</dd></div>
      </dl>
    </section>
  );
}
