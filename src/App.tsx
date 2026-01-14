import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/blog/Layout';
import { HomePage } from '@/pages/HomePage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { AboutPage } from '@/pages/AboutPage';
import { AdminDashboard, CreatePostPage, EditPostPage } from '@/pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="about" element={<AboutPage />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/posts/new" element={<CreatePostPage />} />
          <Route path="admin/posts/:id/edit" element={<EditPostPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
