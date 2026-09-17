import { useState } from 'react';

export default function SoundControl() {
  const [muted, setMuted] = useState(() => localStorage.getItem('portfolio-sound-muted') === 'true');
  const toggle = () => setMuted(current => {
    const next = !current;
    localStorage.setItem('portfolio-sound-muted', String(next));
    return next;
  });
  return <button className="sound-control" type="button" onClick={toggle} aria-pressed={muted} aria-label={muted ? 'Enable sound' : 'Mute sound'}><span aria-hidden="true">{muted ? '×' : '◖'}</span></button>;
}
