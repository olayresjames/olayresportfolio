export default function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite" aria-atomic="true">
      <div className="route-loading-content">
        <div className="route-loading-brand" aria-hidden="true">
          <span className="route-loading-mark" />
          <span className="route-loading-eyebrow">Portfolio</span>
          <span className="route-loading-name">James Olayres</span>
        </div>
        <div className="route-loading-track" aria-hidden="true" />
        <p className="route-loading-label">Loading portfolio…</p>
      </div>
    </div>
  );
}
