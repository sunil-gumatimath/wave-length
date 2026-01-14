import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Post, NewPost } from '@/db/schema';
import { generateSlug } from '@/services/postService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, Save, X, Image, FileText, Link as LinkIcon } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

// Validation schema
const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  authorId: z.number(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: Post | null;
  onSubmit: (data: NewPost) => Promise<Post | null>;
  loading?: boolean;
}

export function PostForm({ post, onSubmit, loading = false }: PostFormProps) {
  const navigate = useNavigate();
  const isEditing = !!post;
  const [showPreview, setShowPreview] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      coverImage: post?.coverImage || '',
      authorId: post?.authorId || 1,
    },
  });

  const title = watch('title');
  const content = watch('content');
  const coverImage = watch('coverImage');

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      setValue('slug', generateSlug(title));
    }
  }, [title, autoSlug, setValue]);

  const handleFormSubmit = async (data: PostFormValues) => {
    const result = await onSubmit({
      ...data,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
    } as NewPost);
    if (result) {
      navigate('/admin');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Update your blog post' : 'Write a new blog post'}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showPreview ? (
            <div className="prose dark:prose-invert max-w-none">
              <h1>{title || 'Untitled Post'}</h1>
              {coverImage && (
                <img src={coverImage} alt={title} className="rounded-lg w-full aspect-video object-cover" />
              )}
              <MarkdownRenderer content={content || '*No content yet...*'} />
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter post title"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="post-url-slug"
                  className={errors.slug ? 'border-destructive' : ''}
                  onChange={(e) => {
                    setValue('slug', e.target.value);
                    setAutoSlug(false);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly version of the title. {autoSlug && '(Auto-generated from title)'}
                </p>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="coverImage" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Cover Image URL
                </Label>
                <Input
                  id="coverImage"
                  type="url"
                  {...register('coverImage')}
                  placeholder="https://example.com/image.jpg"
                  className={errors.coverImage ? 'border-destructive' : ''}
                />
                {errors.coverImage && (
                  <p className="text-sm text-destructive">{errors.coverImage.message}</p>
                )}
                {coverImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Brief description of the post (shown on cards)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  A short summary that appears on blog cards and in search results.
                </p>
              </div>

              <Separator />

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Write your post content here... (Markdown supported)"
                  rows={20}
                  className={`font-mono text-sm ${errors.content ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Supports Markdown: **bold**, *italic*, # headings, ```code```, etc.</span>
                  <span>{content.length} characters</span>
                </div>
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                {isDirty && (
                  <span className="text-xs text-muted-foreground self-center ml-auto">
                    Unsaved changes
                  </span>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
