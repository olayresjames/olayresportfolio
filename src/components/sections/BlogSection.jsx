import { useEffect, useRef, useState } from 'react';
import { useLatestPosts, BLOG_URL } from '../../hooks/useLatestPosts';

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function formatDate(dateString) {
  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return null;
  }
}

function PostCard({ post, position, onActivate }) {
  const active = position === 'center';
  const formattedDate = formatDate(post.published_at);
  const category = post.category
    ? post.category.charAt(0).toUpperCase() + post.category.slice(1)
    : null;

  return (
    <article
      className={`blog-card${position ? ` is-${position}` : ''}${post.featured ? ' featured' : ''}`}
      aria-label={`${post.title}${post.featured ? ', featured post' : ''}${active ? ', current post' : ''}`}
      aria-hidden={position === 'hidden'}
    >
      <a
        href={`${BLOG_URL}/blog/${post.slug}`}
        target="_blank"
        rel="noreferrer"
        className="blog-card-link"
        tabIndex={active ? 0 : -1}
        aria-label={`Read "${post.title}" on the blog (opens in new tab)`}
      >
        {post.coverUrl ? (
          <div className="blog-card-cover">
            <img
              src={post.coverUrl}
              alt={post.cover_image_alt || ''}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="blog-card-cover blog-card-cover-placeholder" aria-hidden="true">
            <span>{post.title}</span>
          </div>
        )}
        <div className="blog-card-body">
          <div className="blog-card-meta">
            {post.featured && <span className="blog-card-featured">featured</span>}
            {category && <span className="blog-card-category">{category}</span>}
            {formattedDate && <time dateTime={post.published_at}>{formattedDate}</time>}
          </div>
          <h3 className="blog-card-title">{post.title}</h3>
          {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
          <span className="blog-card-cta">
            Read post <ExternalLinkIcon />
          </span>
        </div>
      </a>
      {!active && (
        <button
          type="button"
          className="deck-select"
          onClick={onActivate}
          aria-label={`Show ${post.title}`}
        />
      )}
    </article>
  );
}

export default function BlogSection() {
  const { posts, loading, error } = useLatestPosts(3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStart = useRef(null);
  const swipeResetTimer = useRef(null);

  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 767px)');
    if (!media) return undefined;
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const featuredIndex = posts.findIndex(post => post.featured);
      setActiveIndex(featuredIndex >= 0 ? featuredIndex : 0);
    }
  }, [loading, posts]);

  useEffect(() => () => window.clearTimeout(swipeResetTimer.current), []);

  const move = direction => setActiveIndex(index => (index + direction + posts.length) % posts.length);

  const handleTouchStart = event => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = event => {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

    move(deltaX < 0 ? 1 : -1);
    window.clearTimeout(swipeResetTimer.current);
    swipeResetTimer.current = window.setTimeout(() => {}, 400);
  };

  const handleDeckClickCapture = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const positionFor = index => {
    if (!isMobile) return null;
    if (index === activeIndex) return 'center';
    if (index === (activeIndex - 1 + posts.length) % posts.length) return 'left';
    if (index === (activeIndex + 1) % posts.length) return 'right';
    return 'hidden';
  };

  if (error || (!loading && posts.length === 0)) return null;

  return (
    <section id="blog" className="editorial-section wide-section blog-section">
      <div className="section-header">
        <h2>05 — latest posts</h2>
        <a href={BLOG_URL} target="_blank" rel="noreferrer" className="section-header-action">
          view all posts →
        </a>
      </div>
      <p className="section-intro">Notes, essays, and works in progress from the blog.</p>
      <div
        className="blog-grid"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        onTouchCancel={isMobile ? () => { touchStart.current = null; } : undefined}
        onClickCapture={isMobile ? handleDeckClickCapture : undefined}
      >
        {loading
          ? Array.from({ length: 3 }, (_, i) => <div key={i} className="blog-card blog-skeleton" aria-hidden="true" />)
          : posts.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              position={positionFor(index)}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
      </div>
      {isMobile && !loading && posts.length > 0 && (
        <div className="blog-dots" role="tablist" aria-label="Blog post navigation">
          {posts.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to post ${index + 1}: ${post.title}`}
              className={`blog-dot${index === activeIndex ? ' active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
