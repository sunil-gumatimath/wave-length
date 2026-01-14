import { useState, useEffect, useCallback } from 'react';
import type { Post, NewPost } from '@/db/schema';
import type { PostWithRelations } from '@/types/blog';
import * as postService from '@/services/postService';

interface UsePostsReturn {
  posts: PostWithRelations[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UsePostReturn {
  post: PostWithRelations | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UsePostMutationsReturn {
  createPost: (data: NewPost) => Promise<Post | null>;
  updatePost: (id: number, data: Partial<NewPost>) => Promise<Post | null>;
  deletePost: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

// Hook to fetch all posts
export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

// Hook to fetch a single post by ID
export function usePost(id: number | null): UsePostReturn {
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (id === null) {
      setPost(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await postService.getPostById(id);
      setPost(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
}

// Hook to fetch a single post by slug
export function usePostBySlug(slug: string | null): UsePostReturn {
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await postService.getPostBySlug(slug);
      setPost(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
}

// Hook for CRUD mutations
export function usePostMutations(): UsePostMutationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(async (data: NewPost): Promise<Post | null> => {
    try {
      setLoading(true);
      setError(null);
      const newPost = await postService.createPost(data);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: number, data: Partial<NewPost>): Promise<Post | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedPost = await postService.updatePost(id, data);
      return updatedPost ?? null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await postService.deletePost(id);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPost, updatePost, deletePost, loading, error };
}
