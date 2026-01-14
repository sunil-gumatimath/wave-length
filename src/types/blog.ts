import type { User, Category, Post, Comment } from '@/db/schema';

export type PostWithRelations = Post & {
    author: User;
    postCategories: {
        category: Category;
    }[];
    comments: (Comment & { author: User })[];
};
