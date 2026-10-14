import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const BLOG_URL = 'https://olayresjames-blog.vercel.app';
const COVER_BUCKET = 'blog-images';
const COVER_URL_TTL = 3600;

async function resolveCoverUrl(post) {
  if (!post.cover_image_path) return null;

  const { data, error } = await supabase.storage
    .from(COVER_BUCKET)
    .createSignedUrl(post.cover_image_path, COVER_URL_TTL);

  if (error) {
    console.warn('[Blog] Failed to resolve cover URL:', error.message);
    return null;
  }

  return data.signedUrl;
}

export function useLatestPosts(limit = 3) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('title, slug, excerpt, category, tags, cover_image_path, cover_image_alt, published_at, featured')
          .eq('status', 'published')
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;
        if (!data?.length) {
          setPosts([]);
          return;
        }

        const postsWithCovers = await Promise.all(
          data.map(async post => ({
            ...post,
            coverUrl: await resolveCoverUrl(post),
          }))
        );

        if (!cancelled) setPosts(postsWithCovers);
      } catch (err) {
        if (!cancelled) {
          console.error('[Blog] Failed to fetch posts:', err);
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();

    return () => { cancelled = true; };
  }, [limit]);

  return { posts, loading, error };
}

export { BLOG_URL };
