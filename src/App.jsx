import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CaseStudyPage from './pages/CaseStudyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import GalleryPage from './pages/GalleryPage';
import ExperiencesPage from './pages/ExperiencesPage';
import StackPage from './pages/StackPage';
import { caseStudies } from './data/siteData';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path={caseStudies.agapai.path} element={<CaseStudyPage study={caseStudies.agapai} />} />
        <Route path={caseStudies.foliofy.path} element={<CaseStudyPage study={caseStudies.foliofy} />} />
        <Route path={caseStudies.pnp.path} element={<CaseStudyPage study={caseStudies.pnp} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
