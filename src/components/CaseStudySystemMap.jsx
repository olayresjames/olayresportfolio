import { useState } from 'react';

export default function CaseStudySystemMap({ title, stages }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = stages[activeIndex];

  return (
    <section className="case-system-map" aria-labelledby="system-map-title">
      <header className="case-system-map-header">
        <div>
          <p className="case-section-label">interactive system map</p>
          <h2 id="system-map-title">How the pieces connect</h2>
        </div>
        <span>{title}</span>
      </header>
      <ol className="case-system-map-track" aria-label="System layers">
        {stages.map((stage, index) => (
          <li key={stage.label} className={activeIndex === index ? 'is-active' : ''}>
            <button
              type="button"
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            >
              <span className="case-system-map-node" aria-hidden="true">0{index + 1}</span>
              <span>{stage.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="case-system-map-detail" aria-live="polite" aria-atomic="true">
        <span>{activeStage.label}</span>
        <div>
          <h3>{activeStage.title}</h3>
          <p>{activeStage.description}</p>
        </div>
      </div>
    </section>
  );
}
