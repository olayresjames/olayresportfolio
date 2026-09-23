import { useEffect, useState } from 'react';
import CommandPalette from './CommandPalette';
import ThemeControl from './ThemeControl';
import AskMe from './AskMe';
import usePlatformShortcuts from '../hooks/usePlatformShortcuts';

const links = [
  ['01', 'about', 'about'],
  ['02', 'projects', 'projects'],
  ['03', 'experience', 'experience'],
  ['04', 'education', 'education'],
  ['05', 'stack', 'stack'],
  ['06', 'certifications', 'certifications'],
  ['07', 'gallery', 'gallery'],
  ['08', 'github', 'github'],
  ['09', 'social', 'social'],
  ['10', 'hobbies', 'hobbies'],
  ['11', 'contact', 'contact'],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [askMeOpen, setAskMeOpen] = useState(false);
  const { paletteShortcut, askShortcut } = usePlatformShortcuts();
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting && setActiveSection(entry.target.id));
    }, { rootMargin: '-35% 0px -55% 0px' });
    links.forEach(([, , id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(open => !open);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        setMenuOpen(false);
        setPaletteOpen(false);
        setAskMeOpen(true);
      }
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.toggle('menu-open', menuOpen);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const openAskMe = () => { setMenuOpen(false); setPaletteOpen(false); setAskMeOpen(true); };
  const navList = className => (
    <ul className={className}>
      {links.map(([number, label, id]) => (
        <li key={id}>
          <a href={`#${id}`} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined} onClick={closeMenu}>
            <span>{activeSection === id ? '→' : number}</span>{label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-identity">
          <a href="#about" className="identity-name">James Olayres</a>
          <span>full-stack developer</span>
          <span>Valenzuela City, PH</span>
        </div>
        <nav aria-label="Primary navigation">{navList('sidebar-links')}</nav>
        <div className="sidebar-secondary">
          <a href="/resources/olayres-resume.pdf" download="Rafhael_James_Olayres_Resume.pdf">resume ↓</a>
          <a href="https://github.com/olayresjames" target="_blank" rel="noreferrer">github ↗</a>
          <a href="https://linkedin.com/in/james-olayres-888721410" target="_blank" rel="noreferrer">linkedin ↗</a>
        </div>
        <div className="sidebar-tools">
          <p className="sidebar-contact-copy">For work, collabs &amp; everything<br />else, reach me at</p>
          <a className="sidebar-email" href="mailto:olayres.rafhaeljames@gmail.com"><span aria-hidden="true">✉</span> olayres.rafhaeljames@gmail.com</a>
          <button className="ask-me-sidebar-link" type="button" onClick={openAskMe}>ask me <kbd>{askShortcut}</kbd></button>
          <button className="command-hint" type="button" onClick={() => setPaletteOpen(true)}>command palette <kbd>{paletteShortcut}</kbd></button>
          <div className="sidebar-controls"><ThemeControl /></div>
        </div>
      </aside>

      <header className="mobile-nav">
        <a href="#about" className="identity-name" onClick={closeMenu}>James Olayres</a>
        <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? 'close' : 'menu'}</button>
      </header>
      <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">{navList('mobile-links')}</nav>
        <div className="mobile-menu-footer">
          <button className="ask-me-sidebar-link" type="button" onClick={openAskMe}>ask me <kbd>{askShortcut}</kbd></button>
          <button className="command-hint" type="button" onClick={() => { setMenuOpen(false); setPaletteOpen(true); }}>command palette <kbd>{paletteShortcut}</kbd></button>
          <div className="sidebar-controls"><ThemeControl /></div>
        </div>
      </div>
      <AskMe open={askMeOpen} onClose={() => setAskMeOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onAskMe={openAskMe} />
    </>
  );
}
