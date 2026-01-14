import type { PostWithRelations } from "@/types/blog";
import { BlogCard } from "./BlogCard";

interface RelatedPostsProps {
    currentPost: PostWithRelations;
    allPosts: PostWithRelations[];
    limit?: number;
}

export function RelatedPosts({
    currentPost,
    allPosts,
    limit = 3,
}: RelatedPostsProps) {
    // Find related posts based on categories
    const currentCategoryIds = currentPost.postCategories
        .map((pc) => pc.category?.id)
        .filter(Boolean);

    const relatedPosts = allPosts
        .filter((post) => {
            // Exclude current post
            if (post.id === currentPost.id) return false;

            // Check if post shares any category with current post
            const postCategoryIds = post.postCategories
                .map((pc) => pc.category?.id)
                .filter(Boolean);

            return postCategoryIds.some((id) => currentCategoryIds.includes(id));
        })
        .slice(0, limit);

    // If not enough related posts by category, fill with recent posts
    if (relatedPosts.length < limit) {
        const remaining = limit - relatedPosts.length;
        const otherPosts = allPosts
            .filter(
                (post) =>
                    post.id !== currentPost.id &&
                    !relatedPosts.some((rp) => rp.id === post.id)
            )
            .slice(0, remaining);
        relatedPosts.push(...otherPosts);
    }

    if (relatedPosts.length === 0) return null;

    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
}
