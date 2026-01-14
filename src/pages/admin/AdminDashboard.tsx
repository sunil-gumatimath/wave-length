import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePosts, usePostMutations } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Helper to safely format dates
function safeFormatDate(date: Date | string | null | undefined, formatStr: string): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return isNaN(d.getTime()) ? 'Invalid Date' : format(d, formatStr);
  } catch {
    return 'Invalid Date';
  }
}

export function AdminDashboard() {
  const { posts, loading, error, refetch } = usePosts();
  const { deletePost, loading: deleting } = usePostMutations();

  const handleDelete = async (id: number, title: string) => {
    const success = await deletePost(id);
    if (success) {
      toast.success(`"${title}" deleted successfully`);
      refetch();
    } else {
      toast.error('Failed to delete post');
    }
  };

  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Button asChild>
            <Link to="/admin/posts/new">Create New Post</Link>
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No posts yet</p>
                    <Button asChild>
                      <Link to="/admin/posts/new">Create your first post</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="font-medium hover:underline"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.author.avatar && (
                          <img src={post.author.avatar} alt={post.author.name} className="w-5 w-5 rounded-full" />
                        )}
                        <span>{post.author.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.publishedAt
                        ? safeFormatDate(post.publishedAt, 'MMM d, yyyy')
                        : 'Draft'}
                    </TableCell>
                    <TableCell>
                      {safeFormatDate(post.updatedAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/posts/${post.id}/edit`}>Edit</Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={deleting}>
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id, post.title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
