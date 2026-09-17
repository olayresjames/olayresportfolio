import { useEffect, useRef } from 'react';

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModal(open, onClose) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    document.body.classList.add('overlay-open');
    const modal = modalRef.current;
    const first = modal?.querySelector(focusableSelector) ?? modal;
    window.requestAnimationFrame(() => first?.focus());

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !modal) return;
      const focusable = [...modal.querySelectorAll(focusableSelector)].filter(element => element.offsetParent !== null);
      if (!focusable.length) return;
      const firstItem = focusable[0];
      const lastItem = focusable.at(-1);
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('overlay-open');
      previousFocus.current?.focus?.();
    };
  }, [onClose, open]);

  return modalRef;
}
