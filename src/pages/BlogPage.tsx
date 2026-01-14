import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/blog';
import { BlogListSkeleton } from '@/components/common';
import { SEO } from '@/components/seo';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const POSTS_PER_PAGE = 6;

export function BlogPage() {
  const { posts, loading, error } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach((post) => {
      post.postCategories.forEach(({ category }) => {
        if (category?.name) {
          categorySet.add(category.name);
        }
      });
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = !selectedCategory ||
        post.postCategories.some(({ category }) => category?.name === selectedCategory);

      const matchesSearch = !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error loading posts</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Blog"
        description="Explore my latest posts on web development, technology, and building things."
      />

      <div className="py-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personal writing on web development, technology, and what I’m learning.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                <Badge
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleCategoryChange(null)}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            {/* Active filters indicator */}
            {(selectedCategory || searchQuery) && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>
                  Showing {filteredPosts.length} of {posts.length} posts
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </motion.div>

          {/* Posts Grid */}
          {loading ? (
            <BlogListSkeleton count={6} />
          ) : paginatedPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground mb-4">
                No posts found matching your criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mt-12"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
