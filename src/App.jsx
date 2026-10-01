import { useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import GalleryPage from './pages/GalleryPage';
import ExperiencesPage from './pages/ExperiencesPage';
import StackPage from './pages/StackPage';
import { caseStudies } from './data/siteData';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        target?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
      } else if (previousPath.current !== pathname && navigationType !== 'POP') {
        window.scrollTo(0, 0);
      }
      previousPath.current = pathname;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, navigationType]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path={caseStudies.legendOfCee.path} element={<CaseStudyPage study={caseStudies.legendOfCee} />} />
        <Route path={caseStudies.agapai.path} element={<CaseStudyPage study={caseStudies.agapai} />} />
        <Route path={caseStudies.foliofy.path} element={<CaseStudyPage study={caseStudies.foliofy} />} />
        <Route path={caseStudies.pnp.path} element={<CaseStudyPage study={caseStudies.pnp} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
