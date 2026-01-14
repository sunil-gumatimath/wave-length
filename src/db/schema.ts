import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatar: text('avatar'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  authorId: integer('author_id').references(() => users.id).notNull(),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  postCategories: many(postCategories),
  comments: many(comments),
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const postCategories = pgTable('post_categories', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
});

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
