import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import Projects from './Projects';
import { projects } from '../../data/siteData';

afterEach(cleanup);

function renderProjects(onPreview = vi.fn()) {
  return render(
    <MemoryRouter>
      <Projects onPreview={onPreview} />
    </MemoryRouter>,
  );
}

function selectedCard() {
  return document.querySelector('.deck-card.is-center');
}

describe('project deck', () => {
  it('keeps controls inside offscreen cards out of keyboard navigation', () => {
    const { container } = renderProjects();

    for (const card of container.querySelectorAll('.deck-card.is-hidden')) {
      expect(card.getAttribute('aria-hidden')).toBe('true');
      for (const control of card.querySelectorAll('button, a')) {
        expect(control.getAttribute('tabindex')).toBe('-1');
      }
    }
  });

  it('lets the visible neighbor be selected with its preview button', () => {
    renderProjects();

    fireEvent.click(screen.getByRole('button', { name: `Select ${projects[1].name}` }));

    expect(within(selectedCard()).getByRole('heading', { name: projects[1].name })).toBeTruthy();
  });

  it('opens the selected project preview', () => {
    const onPreview = vi.fn();
    renderProjects(onPreview);

    fireEvent.click(screen.getByRole('button', { name: `Preview ${projects[0].name}` }));

    expect(onPreview).toHaveBeenCalledWith({ src: projects[0].webp || projects[0].image, alt: projects[0].alt });
  });

  it('changes projects after a horizontal swipe', () => {
    const { container } = renderProjects();
    const deck = container.querySelector('.project-deck');

    fireEvent.touchStart(deck, { touches: [{ identifier: 1, target: deck, clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(deck, { changedTouches: [{ identifier: 1, target: deck, clientX: 100, clientY: 105 }] });

    expect(within(selectedCard()).getByRole('heading', { name: projects[1].name })).toBeTruthy();
  });

  it('passes axe accessibility checks in JSDOM for the project deck', async () => {
    const { container } = renderProjects();

    const results = await axe.run(container.querySelector('.project-deck'), {
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(results.violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
  });
});
