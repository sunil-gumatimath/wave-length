import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { getLocalDb } from './local-client';

import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// Get the proxy URL for raw SQL queries (bypassing Drizzle)
export function getProxyUrl(): string {
  const dbUrl = import.meta.env.VITE_DATABASE_URL;
  if (!dbUrl) {
    throw new Error('VITE_DATABASE_URL is not set. Please add it to your .env file.');
  }

  // Local development - return the proxy URL
  if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
    return dbUrl.startsWith('postgres') ? 'http://localhost:3000' : dbUrl;
  }

  // Production - for now, throw an error as raw SQL is only for local dev
  // In production, we'd need a different approach (server-side API or edge function)
  throw new Error('Raw SQL queries are only supported in local development.');
}

export function getDb(): NeonHttpDatabase<typeof schema> {
  const dbUrl = import.meta.env.VITE_DATABASE_URL;
  if (!dbUrl) {
    throw new Error('VITE_DATABASE_URL is not set. Please add it to your .env file.');
  }

  // Local development with Bun proxy
  if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
    const httpUrl = dbUrl.startsWith('postgres') ? 'http://localhost:3000' : dbUrl;
    return getLocalDb(httpUrl, schema) as any;
  }

  // Production with Neon
  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

