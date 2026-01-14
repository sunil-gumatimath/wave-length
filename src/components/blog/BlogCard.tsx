import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PostWithRelations } from '@/types/blog';
import { calculateReadingTime } from '@/lib/reading-time';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: PostWithRelations;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const readingTime = calculateReadingTime(post?.content || '');

  if (!post) return null;

  const author = post.author || { name: 'Unknown', avatar: null };
  const categoriesList = post.postCategories || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {post.coverImage && (
          <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        )}
        <CardHeader className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {categoriesList.length > 0 ? (
              categoriesList.slice(0, 2).map(({ category }) => (
                category && (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {category.name}
                  </Badge>
                )
              ))
            ) : (
              <Badge variant="secondary">Article</Badge>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Clock className="h-3 w-3" />
              {readingTime.text}
            </div>
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            <Link
              to={`/blog/${post.slug}`}
              className="hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {post.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage src={author.avatar ?? undefined} alt={author.name} />
                <AvatarFallback className="text-xs">
                  {author.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{author.name}</span>
                {post.publishedAt && (
                  <span className="text-xs text-muted-foreground">
                    {(() => {
                      try {
                        const date = new Date(post.publishedAt);
                        if (isNaN(date.getTime())) return '';
                        return format(date, 'MMM d, yyyy');
                      } catch (e) {
                        return '';
                      }
                    })()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link
            to={`/blog/${post.slug}`}
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 group/link"
          >
            Read more
            <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
