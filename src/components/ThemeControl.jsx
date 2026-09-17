import { useEffect, useState } from 'react';

const themes = [
  { id: 'system', icon: '◌', label: 'System' },
  { id: 'light', icon: '☼', label: 'Light' },
  { id: 'dark', icon: '◐', label: 'Dark' },
];

const applyTheme = theme => {
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
};

export default function ThemeControl() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'system');

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('portfolio-theme', theme);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystem = () => theme === 'system' && applyTheme('system');
    media.addEventListener('change', syncSystem);
    return () => media.removeEventListener('change', syncSystem);
  }, [theme]);

  return (
    <div className="theme-control" role="group" aria-label="Theme">
      {themes.map(option => (
        <button key={option.id} className={theme === option.id ? 'active' : ''} type="button" onClick={() => setTheme(option.id)} aria-label={`Use ${option.label.toLowerCase()} theme`} aria-pressed={theme === option.id}>
          <span aria-hidden="true">{option.icon}</span>
        </button>
      ))}
    </div>
  );
}
