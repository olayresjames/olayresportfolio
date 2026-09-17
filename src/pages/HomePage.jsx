import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Footer, PageUpButton, ScrollProgress } from '../components/SiteChrome';
import { Lightbox, ResumeModal } from '../components/Modals';
import Hero from '../components/sections/Hero';
import Projects from '../components/sections/Projects';
import { Certifications, Contact, Education, Experience, Gallery, GitHubSection, Skills } from '../components/sections/ContentSections';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePortfolioEffects } from '../hooks/usePortfolioEffects';

const description = 'Rafhael James Olayres is a full-stack developer and IT student building useful web, mobile, and AI-powered products from Valenzuela City, Philippines.';

export default function HomePage() {
  const [preview, setPreview] = useState(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  usePageMeta({ title: 'Rafhael James Olayres | Full-Stack Developer', description });
  usePortfolioEffects();

  return (
    <>
      <ScrollProgress />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Projects onPreview={setPreview} />
        <Experience onOpenResume={() => setResumeOpen(true)} />
        <Education />
        <Skills />
        <Certifications onPreview={setPreview} />
        <Gallery />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />
      <PageUpButton />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <Lightbox preview={preview} onClose={() => setPreview(null)} />
    </>
  );
}
