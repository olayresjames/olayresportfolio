import { Component } from 'react';

export default class RouteErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="route-error" role="alert">
          <p className="section-heading">PAGE ERROR</p>
          <h1>This page could not be displayed.</h1>
          <p>Reload the page to try again, or return to the portfolio home page.</p>
          <div className="route-error-actions">
            <button type="button" className="button" onClick={() => window.location.reload()}>Reload page</button>
            <a className="text-button" href="/">Return home</a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
