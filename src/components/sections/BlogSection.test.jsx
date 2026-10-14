import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import BlogSection from './BlogSection';
import { useLatestPosts } from '../../hooks/useLatestPosts';

vi.mock('../../hooks/useLatestPosts', () => ({
  useLatestPosts: vi.fn(),
  BLOG_URL: 'https://olayresjames-blog.vercel.app',
}));

afterEach(cleanup);

function renderBlog() {
  return render(
    <MemoryRouter>
      <BlogSection />
    </MemoryRouter>,
  );
}

describe('blog section', () => {
  it('renders loading skeletons while fetching', () => {
    vi.mocked(useLatestPosts).mockReturnValue({ posts: [], loading: true, error: null });
    const { container } = renderBlog();

    expect(container.querySelectorAll('.blog-skeleton')).toHaveLength(3);
  });

  it('renders latest posts with links to the blog', async () => {
    const posts = [
      {
        slug: 'hello-world',
        title: 'Hello World',
        excerpt: 'First post',
        category: 'notes',
        cover_image_path: 'a/hello.webp',
        cover_image_alt: 'Hello cover',
        published_at: '2026-10-01T00:00:00.000Z',
        coverUrl: 'https://example.com/hello.webp',
        featured: true,
      },
      {
        slug: 'second-post',
        title: 'Second Post',
        excerpt: 'Second post excerpt',
        category: 'essays',
        cover_image_path: null,
        cover_image_alt: null,
        published_at: '2026-09-01T00:00:00.000Z',
        coverUrl: null,
      },
    ];
    vi.mocked(useLatestPosts).mockReturnValue({ posts, loading: false, error: null });
    renderBlog();

    const firstCard = screen.getByRole('link', { name: /read "hello world" on the blog/i });
    expect(firstCard.getAttribute('href')).toBe('https://olayresjames-blog.vercel.app/blog/hello-world');
    expect(firstCard.getAttribute('target')).toBe('_blank');
    expect(firstCard.getAttribute('rel')).toBe('noreferrer');
    expect(within(firstCard).getByRole('heading', { name: 'Hello World' })).toBeTruthy();
  });

  it('hides section when there are no posts', () => {
    vi.mocked(useLatestPosts).mockReturnValue({ posts: [], loading: false, error: null });
    const { container } = renderBlog();

    expect(container.querySelector('#blog')).toBeNull();
  });

  it('hides section on fetch error', () => {
    vi.mocked(useLatestPosts).mockReturnValue({ posts: [], loading: false, error: new Error('fail') });
    const { container } = renderBlog();

    expect(container.querySelector('#blog')).toBeNull();
  });

  it('passes axe accessibility checks when posts render', async () => {
    const posts = [
      {
        slug: 'hello-world',
        title: 'Hello World',
        excerpt: 'First post',
        category: 'notes',
        cover_image_path: null,
        cover_image_alt: null,
        published_at: '2026-10-01T00:00:00.000Z',
        coverUrl: null,
      },
    ];
    vi.mocked(useLatestPosts).mockReturnValue({ posts, loading: false, error: null });
    renderBlog();

    await waitFor(() => {
      expect(document.querySelectorAll('.blog-skeleton')).toHaveLength(0);
    });

    const results = await axe.run(document.querySelector('#blog'), {
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(results.violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
  });
});
