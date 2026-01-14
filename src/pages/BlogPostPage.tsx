import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, Calendar, MessageCircle, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePostBySlug, usePosts } from '@/hooks/usePosts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MarkdownRenderer, CommentForm, RelatedPosts } from '@/components/blog';
import { ReadingProgress, BlogPostSkeleton } from '@/components/common';
import { SEO } from '@/components/seo';
import { calculateReadingTime } from '@/lib/reading-time';
import { toast } from 'sonner';

// Helper to safely convert date values to ISO strings
function toISOString(date: Date | string | null | undefined): string | undefined {
  if (!date) return undefined;
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

// Helper to safely format dates
function safeFormatDate(date: Date | string | null | undefined, formatStr: string): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return isNaN(d.getTime()) ? 'N/A' : format(d, formatStr);
  } catch {
    return 'N/A';
  }
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error, refetch } = usePostBySlug(slug ?? null);
  const { posts } = usePosts();

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const categories = post.postCategories
    .map((pc) => pc.category?.name)
    .filter(Boolean);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt || undefined}
        image={post.coverImage || undefined}
        type="article"
        author={post.author.name}
        publishedTime={toISOString(post.publishedAt)}
        modifiedTime={toISOString(post.updatedAt)}
        tags={categories as string[]}
      />
      <ReadingProgress />

      <article className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {post.postCategories.length > 0 ? (
                  post.postCategories.map(({ category }) => (
                    category && (
                      <Badge key={category.id} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        {category.name}
                      </Badge>
                    )
                  ))
                ) : (
                  <Badge variant="secondary">Article</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
              )}
            </header>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={post.author.avatar ?? undefined} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.bio || "Author"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-auto text-sm text-muted-foreground">
                {post.publishedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {safeFormatDate(post.publishedAt, 'MMMM d, yyyy')}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {readingTime.text}
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments.length} comments
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-8">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <motion.div
                className="aspect-video rounded-xl overflow-hidden mb-8 shadow-lg"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            <Separator className="mb-8" />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MarkdownRenderer content={post.content} />
            </motion.div>

            <Separator className="my-12" />

            {/* Comments Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Comments ({post.comments.length})
              </h2>

              {/* Add Comment Form */}
              <CommentForm postId={post.id} onCommentAdded={refetch} />

              {/* Comments List */}
              {post.comments.length > 0 ? (
                <div className="space-y-6 mt-8">
                  {post.comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-muted/30 rounded-lg"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatar ?? undefined} alt={comment.author.name} />
                        <AvatarFallback>
                          {comment.author.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {safeFormatDate(comment.createdAt, "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic mt-6 text-center py-8 bg-muted/30 rounded-lg">
                  Be the first to leave a comment!
                </p>
              )}
            </section>

            {/* Related Posts */}
            {posts.length > 1 && (
              <RelatedPosts currentPost={post} allPosts={posts} />
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-8 border-t">
              <Button variant="ghost" asChild>
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
}
