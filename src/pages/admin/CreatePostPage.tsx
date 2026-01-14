import { usePostMutations } from '@/hooks/usePosts';
import { PostForm } from '@/components/blog/PostForm';
import { toast } from 'sonner';
import type { NewPost } from '@/db/schema';

export function CreatePostPage() {
  const { createPost, loading, error } = usePostMutations();

  const handleSubmit = async (data: NewPost) => {
    const result = await createPost(data);
    if (result) {
      toast.success('Post created successfully!');
      return result;
    } else {
      toast.error(error ?? 'Failed to create post');
      return null;
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <PostForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
