import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import { caseStudyPaths } from './data/routes';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'));
const StackPage = lazy(() => import('./pages/StackPage'));
const CaseStudyRoute = lazy(() => import('./pages/CaseStudyRoute'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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

function routeElement(element) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
        {element}
      </Suspense>
    </RouteErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Routes>
        <Route path="/" element={routeElement(<HomePage />)} />
        <Route path="/projects" element={routeElement(<ProjectsPage />)} />
        <Route path="/certifications" element={routeElement(<CertificationsPage />)} />
        <Route path="/gallery" element={routeElement(<GalleryPage />)} />
        <Route path="/experiences" element={routeElement(<ExperiencesPage />)} />
        <Route path="/stack" element={routeElement(<StackPage />)} />
        <Route path={caseStudyPaths.legendOfCee} element={routeElement(<CaseStudyRoute studyKey="legendOfCee" />)} />
        <Route path={caseStudyPaths.pointNemo} element={routeElement(<CaseStudyRoute studyKey="pointNemo" />)} />
        <Route path={caseStudyPaths.agapai} element={routeElement(<CaseStudyRoute studyKey="agapai" />)} />
        <Route path={caseStudyPaths.foliofy} element={routeElement(<CaseStudyRoute studyKey="foliofy" />)} />
        <Route path={caseStudyPaths.pnp} element={routeElement(<CaseStudyRoute studyKey="pnp" />)} />
        <Route path="*" element={routeElement(<NotFoundPage />)} />
      </Routes>
    </BrowserRouter>
  );
}
