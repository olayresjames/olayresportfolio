import { useEffect, useState } from 'react';

const titles = [
  'IT Student',
  'Full-Stack Developer',
  'Game Developer',
  'Web Developer',
  'AI Enthusiast',
  'Emerging Technologist',
  'Creative Coder',
  'Lifelong Learner',
];

export function useTypewriter() {
  const [text, setText] = useState('');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setText('Full-Stack Developer');
      return undefined;
    }

    let titleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const type = () => {
      const current = titles[titleIndex];
      charIndex += deleting ? -1 : 1;
      setText(current.slice(0, charIndex));

      let delay = deleting ? 30 : Math.random() * 40 + 50;
      if (!deleting && charIndex === current.length) {
        deleting = true;
        delay = 2000;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        delay = 500;
      }
      timer = window.setTimeout(type, delay);
    };

    timer = window.setTimeout(type, 1000);
    return () => window.clearTimeout(timer);
  }, []);

  return text;
}
