-- Ted Blog Database Schema
-- Run this to initialize a fresh database

-- 1. Users Table (Authors)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 3. Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id INTEGER NOT NULL REFERENCES users(id),
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 4. Post Categories Junction Table
CREATE TABLE IF NOT EXISTS post_categories (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

-- 5. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Users (Authors)
INSERT INTO users (name, email, avatar, bio) VALUES
('Sarah Chen', 'sarah@wavelength.dev', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 'Senior Frontend Engineer at Google. Passionate about React, performance optimization, and creating beautiful user experiences.'),
('Marcus Johnson', 'marcus@wavelength.dev', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 'Full-stack developer and open source contributor. I love building tools that make developers lives easier.'),
('Emily Rodriguez', 'emily@wavelength.dev', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', 'UI/UX Designer turned Frontend Developer. Bridging the gap between design and code.'),
('David Kim', 'david@wavelength.dev', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', 'Backend architect with 10+ years experience. Node.js, PostgreSQL, and cloud infrastructure expert.'),
('Priya Patel', 'priya@wavelength.dev', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', 'DevOps Engineer and Technical Writer. Making complex topics accessible to everyone.')
ON CONFLICT (email) DO NOTHING;

-- Insert Categories
INSERT INTO categories (name, slug) VALUES
('JavaScript', 'javascript'),
('React', 'react'),
('TypeScript', 'typescript'),
('CSS', 'css'),
('Node.js', 'nodejs'),
('DevOps', 'devops'),
('Career', 'career'),
('Web Development', 'web-development'),
('Performance', 'performance'),
('Design', 'design')
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Posts
INSERT INTO posts (title, slug, excerpt, content, cover_image, author_id, published_at) VALUES 
(
  'Understanding React Server Components in 2026', 
  'understanding-react-server-components-2026', 
  'A comprehensive guide to React Server Components - what they are, how they work, and why they matter for modern web development.',
  '# Understanding React Server Components in 2026

React Server Components (RSC) have revolutionized how we build React applications. Lets dive deep into what makes them special.

## What Are Server Components?

Server Components are React components that render exclusively on the server. Unlike traditional Server-Side Rendering (SSR), they never hydrate on the client.

## Key Benefits

### 1. Zero Bundle Size Impact
Server Components dont add to your JavaScript bundle.

### 2. Direct Backend Access
Query the database directly from your components.

### 3. Streaming and Suspense
Components can stream as theyre ready.

---

*Ready to start building with Server Components?*',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
  1, 
  NOW()
),
(
  'Modern CSS: Container Queries and Beyond', 
  'modern-css-container-queries-beyond',
  'Discover how container queries are changing responsive design forever.',
  '# Modern CSS: Container Queries and Beyond

CSS has evolved dramatically. Container queries are just the beginning.

## The Problem with Media Queries

Media queries only know about the viewport.

## Enter Container Queries

Now components can respond to their container.

---

*CSS is more powerful than ever!*',
  'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200',
  3, 
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Link Posts to Categories
INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id FROM posts p, categories c
WHERE p.slug = 'understanding-react-server-components-2026' AND c.slug = 'react'
ON CONFLICT DO NOTHING;

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id FROM posts p, categories c
WHERE p.slug = 'understanding-react-server-components-2026' AND c.slug = 'javascript'
ON CONFLICT DO NOTHING;

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id FROM posts p, categories c
WHERE p.slug = 'modern-css-container-queries-beyond' AND c.slug = 'css'
ON CONFLICT DO NOTHING;

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id FROM posts p, categories c
WHERE p.slug = 'modern-css-container-queries-beyond' AND c.slug = 'design'
ON CONFLICT DO NOTHING;

-- Insert Comments
INSERT INTO comments (content, post_id, author_id)
SELECT 'Great explanation! This cleared up a lot of confusion.', p.id, 2
FROM posts p WHERE p.slug = 'understanding-react-server-components-2026'
ON CONFLICT DO NOTHING;

INSERT INTO comments (content, post_id, author_id)
SELECT 'Container queries are a game changer!', p.id, 1
FROM posts p WHERE p.slug = 'modern-css-container-queries-beyond'
ON CONFLICT DO NOTHING;
