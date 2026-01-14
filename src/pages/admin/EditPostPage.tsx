import { useParams, useNavigate } from 'react-router-dom';
import { usePost, usePostMutations } from '@/hooks/usePosts';
import { PostForm } from '@/components/blog/PostForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { NewPost } from '@/db/schema';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id, 10) : null;
  
  const { post, loading: loadingPost, error: fetchError } = usePost(postId);
  const { updatePost, loading: updating, error: updateError } = usePostMutations();

  const handleSubmit = async (data: NewPost) => {
    if (!postId) return null;
    
    const result = await updatePost(postId, data);
    if (result) {
      toast.success('Post updated successfully!');
      return result;
    } else {
      toast.error(updateError ?? 'Failed to update post');
      return null;
    }
  };

  if (loadingPost) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (fetchError || !post) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            {fetchError ?? 'Post not found'}
          </h1>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <PostForm post={post} onSubmit={handleSubmit} loading={updating} />
      </div>
    </div>
  );
}
