import { useEffect } from 'react';

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [name, content] = selector.match(/\[(.+?)="(.+?)"\]/)?.slice(1) ?? [];
    if (name && content) element.setAttribute(name, content);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

export function usePageMeta({ title, description, path = '/', image = '/resources/picture.webp', type = 'website' }) {
  useEffect(() => {
    const url = `https://olayresportfolio.vercel.app${path}`;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', `https://olayresportfolio.vercel.app${image}`);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', `https://olayresportfolio.vercel.app${image}`);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = url;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [description, image, path, title, type]);
}
