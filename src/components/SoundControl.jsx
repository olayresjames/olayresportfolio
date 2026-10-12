import { createContext, useContext, useState } from 'react';
import { getUiSoundEnabled, setUiSoundEnabled } from '../utils/uiSounds';

const SoundPreferenceContext = createContext(null);

export function SoundPreferenceProvider({ children }) {
  const [enabled, setEnabled] = useState(getUiSoundEnabled);
  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setUiSoundEnabled(next);
  };

  return (
    <SoundPreferenceContext.Provider value={{ enabled, toggle }}>
      {children}
    </SoundPreferenceContext.Provider>
  );
}

export default function SoundControl() {
  const preference = useContext(SoundPreferenceContext);
  const enabled = preference?.enabled ?? false;

  return (
    <button
      className="sound-control"
      type="button"
      onClick={preference?.toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn navigation sounds off' : 'Turn navigation sounds on'}
      title={`Navigation sounds ${enabled ? 'on' : 'off'}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {enabled ? <path d="M15.5 8.5a5 5 0 0 1 0 7" /> : <path d="m16 9 5 6m0-6-5 6" />}
      </svg>
    </button>
  );
}
