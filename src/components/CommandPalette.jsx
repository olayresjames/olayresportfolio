import { useEffect, useRef, useState } from 'react';
import usePlatformShortcuts from '../hooks/usePlatformShortcuts';

const commands = [
  ['Ask me anything', 'ask-me'],
  ['About', '#about'],
  ['Projects', '#projects'],
  ['Experience', '#experience'],
  ['Education', '#education'],
  ['Stack', '#stack'],
  ['Certifications', '#certifications'],
  ['Gallery', '#gallery'],
  ['GitHub', '#github'],
  ['Contact', '#contact'],
];

export default function CommandPalette({ open, onClose, onAskMe }) {
  const { askShortcut } = usePlatformShortcuts();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const filtered = commands.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActive(0);
    document.body.classList.add('overlay-open');
    window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => document.body.classList.remove('overlay-open');
  }, [open]);

  if (!open) return null;

  const select = command => {
    if (!command) return;
    onClose();
    if (command[1] === 'ask-me') {
      onAskMe();
      return;
    }
    if (command[1].startsWith('/')) {
      window.location.href = command[1];
      return;
    }
    window.requestAnimationFrame(() => document.querySelector(command[1])?.scrollIntoView({ behavior: 'smooth' }));
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape') onClose();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(index => Math.min(index + 1, filtered.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(index => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      select(filtered[active]);
    }
  };

  return (
    <div className="command-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={handleKeyDown}>
        <div className="command-input-row">
          <span aria-hidden="true">›</span>
          <input ref={inputRef} value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} placeholder="Navigate to…" aria-label="Search commands" />
          <kbd>esc</kbd>
        </div>
        <div className="command-results" role="listbox">
          {filtered.map((command, index) => (
            <button key={command[1]} type="button" role="option" aria-selected={active === index} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onClick={() => select(command)}>
              <span>{command[0]}</span><span>{command[1] === 'ask-me' ? askShortcut : 'jump ↵'}</span>
            </button>
          ))}
          {!filtered.length && <p className="command-empty">No matching section.</p>}
        </div>
        <div className="command-footer"><span>↑↓ move</span><span>enter select</span></div>
      </div>
    </div>
  );
}
