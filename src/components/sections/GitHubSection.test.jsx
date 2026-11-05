import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { GitHubSection } from './ContentSections';

const contributionData = {
  2025: {
    total: 6,
    weeks: [[
      { date: '2025-01-01', count: 1, level: 1 },
      { date: '2025-01-02', count: 0, level: 0 },
      { date: '2025-01-03', count: 2, level: 2 },
      { date: '2025-01-04', count: 0, level: 0 },
      { date: '2025-01-05', count: 3, level: 3 },
    ]],
  },
};

const originalScrollTo = HTMLElement.prototype.scrollTo;

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => contributionData })));
  vi.stubGlobal('matchMedia', vi.fn(query => ({ media: query, matches: false })));
  HTMLElement.prototype.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalScrollTo) HTMLElement.prototype.scrollTo = originalScrollTo;
  else delete HTMLElement.prototype.scrollTo;
});

async function renderChart() {
  const view = render(<GitHubSection />);
  await waitFor(() => expect(screen.getByRole('button', { name: '2025-01-05: 3 contributions' })).toBeTruthy());
  return view;
}

describe('contribution chart', () => {
  it('previews a hovered day and restores the pinned day afterward', async () => {
    const { container } = await renderChart();
    const detail = container.querySelector('.contribution-detail');
    const pinned = screen.getByRole('button', { name: '2025-01-05: 3 contributions' });
    const preview = screen.getByRole('button', { name: '2025-01-01: 1 contribution' });

    fireEvent.click(pinned);
    expect(pinned.getAttribute('aria-pressed')).toBe('true');
    fireEvent.mouseEnter(preview);
    expect(within(detail).getByText('previewing day')).toBeTruthy();
    expect(within(detail).getByText('1 contribution')).toBeTruthy();
    expect(preview.getAttribute('aria-pressed')).toBe('false');

    fireEvent.mouseLeave(preview);
    expect(within(detail).getByText('selected day')).toBeTruthy();
    expect(within(detail).getByText('3 contributions')).toBeTruthy();
    expect(pinned.getAttribute('aria-pressed')).toBe('true');
  });

  it('pins a clicked day and navigates between active days', async () => {
    const { container } = await renderChart();
    const detail = container.querySelector('.contribution-detail');
    const middle = screen.getByRole('button', { name: '2025-01-03: 2 contributions' });

    fireEvent.click(middle);
    expect(middle.getAttribute('aria-pressed')).toBe('true');
    expect(within(detail).getByText('selected day')).toBeTruthy();
    expect(within(detail).getByText('2 contributions')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Previous active day' }));
    expect(screen.getByRole('button', { name: '2025-01-01: 1 contribution' }).getAttribute('aria-pressed')).toBe('true');
    expect(within(detail).getByText('1 contribution')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Previous active day' }).disabled).toBe(true);
    expect(HTMLElement.prototype.scrollTo).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Next active day' }));
    expect(middle.getAttribute('aria-pressed')).toBe('true');
  });
});
