import { useEffect, useRef, useState } from 'react';

export function ScrollProgress() {
  const fillRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
      frame = 0;
    };
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><span ref={fillRef} /></div>;
}

export function PageUpButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 240;
      setVisible(window.scrollY > 400 && !nearBottom);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <button
      id="page-up-action"
      className={`page-up-action ${visible ? 'visible' : ''}`}
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
    </button>
  );
}

export function Footer() {
  return <footer><p>© 2026 Rafhael James Olayres</p><p>BSIT · PLV · Valenzuela City, PH</p></footer>;
}
