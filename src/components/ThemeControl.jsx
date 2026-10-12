import { useEffect, useState } from 'react';

const themes = [
  { id: 'system', icon: '◌', label: 'System' },
  { id: 'light', icon: '☼', label: 'Light' },
  { id: 'dark', icon: '◐', label: 'Dark' },
];

let themeWashFrame = 0;
let themeWashTimer = 0;

const clearThemeWash = root => {
  if (themeWashFrame) window.cancelAnimationFrame(themeWashFrame);
  if (themeWashTimer) window.clearTimeout(themeWashTimer);
  themeWashFrame = 0;
  themeWashTimer = 0;
  root.classList.remove('theme-wash');
};

const applyTheme = (theme, animate = false) => {
  const root = document.documentElement;
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  const previous = root.dataset.theme;

  if (previous !== resolved) {
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const previousBackground = getComputedStyle(root).getPropertyValue('--background').trim();
      clearThemeWash(root);
      root.style.setProperty('--theme-wash-color', previousBackground);
      themeWashFrame = window.requestAnimationFrame(() => {
        root.classList.add('theme-wash');
        themeWashFrame = 0;
      });
      themeWashTimer = window.setTimeout(() => clearThemeWash(root), 300);
    } else {
      clearThemeWash(root);
    }
  }

  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#0c0c0f' : '#f8fafc');
};

export default function ThemeControl() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'system');

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('portfolio-theme', theme);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystem = () => theme === 'system' && applyTheme('system', true);
    media.addEventListener('change', syncSystem);
    return () => media.removeEventListener('change', syncSystem);
  }, [theme]);

  return (
    <div className="theme-control" role="group" aria-label="Theme">
      {themes.map(option => (
        <button key={option.id} className={theme === option.id ? 'active' : ''} type="button" onClick={() => { applyTheme(option.id, true); setTheme(option.id); }} aria-label={`Use ${option.label.toLowerCase()} theme`} aria-pressed={theme === option.id}>
          <span aria-hidden="true">{option.icon}</span>
        </button>
      ))}
    </div>
  );
}
