import { useEffect } from 'react';

export function usePortfolioEffects() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = [...document.querySelectorAll('.reveal')];
    reveals.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${(index % 3) * 45}ms`);
    });

    if (reducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(element => element.classList.add('visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const image = document.querySelector('.about-img-wrapper img');
    if (!image) return undefined;
    const show = () => image.classList.add('loaded');
    if (image.complete) show();
    else image.addEventListener('load', show, { once: true });
    return () => image.removeEventListener('load', show);
  }, []);
}
