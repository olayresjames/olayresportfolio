import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { playUiTone } from '../utils/uiSounds';

export default function NavigationSoundListener() {
  const { pathname, search, hash } = useLocation();
  const previousLocation = useRef({ pathname, search, hash });

  useEffect(() => {
    const previous = previousLocation.current;
    if (previous.pathname !== pathname || previous.search !== search || previous.hash !== hash) {
      playUiTone('navigation');
    }
    previousLocation.current = { pathname, search, hash };
  }, [pathname, search, hash]);

  useEffect(() => {
    const interactiveSelector = 'a[href], button:not(:disabled), summary, [role="button"], [role="option"], select, input[type="checkbox"], input[type="radio"], input[type="range"]';
    const onControlHover = event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      if (!(event.target instanceof Element)) return;

      const control = event.target.closest(interactiveSelector);
      if (!control || control.matches(':disabled, [aria-disabled="true"]')) return;
      if (event.relatedTarget instanceof Node && control.contains(event.relatedTarget)) return;

      playUiTone('hover');
    };

    const onControlClick = event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const control = event.target.closest(interactiveSelector);
      if (!control || control.matches(':disabled, [aria-disabled="true"]')) return;

      const link = control.closest('a[href]');
      if (!link) {
        playUiTone('control');
        return;
      }
      if (link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      const opensNewTab = link.target && link.target !== '_self';
      if (destination.origin !== current.origin || opensNewTab) {
        playUiTone('control');
        return;
      }
      if (destination.pathname === current.pathname && destination.search === current.search && destination.hash === current.hash) return;

      playUiTone('navigation');
    };

    let previousHash = window.location.hash;
    const onHashChange = () => {
      if (window.location.hash === previousHash) return;
      previousHash = window.location.hash;
      playUiTone('navigation');
    };

    document.addEventListener('pointerover', onControlHover, true);
    document.addEventListener('click', onControlClick, true);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('pointerover', onControlHover, true);
      document.removeEventListener('click', onControlClick, true);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return null;
}
