import { usePageMeta } from '../hooks/usePageMeta';
import AppLink from '../components/AppLink';

export default function NotFoundPage() {
  usePageMeta({ title: 'Page Not Found | Rafhael James Olayres', description: 'The requested portfolio page could not be found.', path: window.location.pathname });
  return (
    <main className="case-study" id="main-content">
      <span className="case-kicker">404 / Page not found</span>
      <h1>Lost in the metaverse?</h1>
      <p className="case-lede">The page you requested does not exist.</p>
      <p className="case-footer"><AppLink className="btn-primary" to="/">Return home</AppLink></p>
    </main>
  );
}
