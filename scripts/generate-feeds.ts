import { drizzle } from 'drizzle-orm/postgres-js';
import { desc } from 'drizzle-orm';
import postgres from 'postgres';
import { writeFile } from 'node:fs/promises';
import * as schema from '../src/db/schema';

type FeedPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function normalizeSiteUrl(input: string | undefined): string {
  if (!input) return '';
  return input.replace(/\/$/, '');
}

function joinUrl(siteUrl: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

async function getPosts(): Promise<FeedPost[]> {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.VITE_DATABASE_URL;
  if (!databaseUrl) return [];

  const queryClient = postgres(databaseUrl, { prepare: false });
  const db = drizzle(queryClient, { schema });

  const rows = await db
    .select({
      title: schema.posts.title,
      slug: schema.posts.slug,
      excerpt: schema.posts.excerpt,
      publishedAt: schema.posts.publishedAt,
      updatedAt: schema.posts.updatedAt,
    })
    .from(schema.posts)
    .orderBy(desc(schema.posts.publishedAt));

  await queryClient.end({ timeout: 5 });

  return rows;
}

function toRssXml(params: {
  siteUrl: string;
  siteName: string;
  description: string;
  posts: FeedPost[];
}): string {
  const { siteUrl, siteName, description, posts } = params;
  const lastBuildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = joinUrl(siteUrl, `/blog/${post.slug}`);
      const pubDate = (post.publishedAt ?? post.updatedAt).toUTCString();
      const itemDescription = post.excerpt?.trim() || '';

      return [
        '<item>',
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `<pubDate>${escapeXml(pubDate)}</pubDate>`,
        itemDescription ? `<description>${escapeXml(itemDescription)}</description>` : '',
        '</item>',
      ]
        .filter(Boolean)
        .join('');
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `<title>${escapeXml(siteName)}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<description>${escapeXml(description)}</description>`,
    '<language>en</language>',
    `<lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>`,
    items,
    '</channel>',
    '</rss>',
  ].join('');
}

function toSitemapXml(params: { siteUrl: string; posts: FeedPost[] }): string {
  const { siteUrl, posts } = params;

  const staticUrls = [
    { loc: joinUrl(siteUrl, '/'), lastmod: new Date() },
    { loc: joinUrl(siteUrl, '/blog'), lastmod: new Date() },
    { loc: joinUrl(siteUrl, '/about'), lastmod: new Date() },
  ];

  const postUrls = posts.map((post) => ({
    loc: joinUrl(siteUrl, `/blog/${post.slug}`),
    lastmod: post.updatedAt,
  }));

  const urls = [...staticUrls, ...postUrls]
    .map((u) => {
      const lastmod = u.lastmod.toISOString();
      return `<url><loc>${escapeXml(u.loc)}</loc><lastmod>${escapeXml(lastmod)}</lastmod></url>`;
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('');
}

function toRobotsTxt(siteUrl: string): string {
  return [`User-agent: *`, `Allow: /`, `Sitemap: ${joinUrl(siteUrl, '/sitemap.xml')}`, ''].join('\n');
}

async function main() {
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL ?? process.env.VITE_SITE_URL);
  const siteName = process.env.SITE_NAME ?? process.env.VITE_SITE_NAME ?? 'Wavelength';
  const description =
    process.env.SITE_DESCRIPTION ??
    process.env.VITE_DEFAULT_DESCRIPTION ??
    'Personal blog about web development, technology, and building things.';

  if (!siteUrl) {
    await writeFile('public/robots.txt', `User-agent: *\nAllow: /\n`, 'utf8');
    await writeFile('public/sitemap.xml', toSitemapXml({ siteUrl: 'http://localhost', posts: [] }), 'utf8');
    await writeFile('public/rss.xml', toRssXml({ siteUrl: 'http://localhost', siteName, description, posts: [] }), 'utf8');
    return;
  }

  const posts = await getPosts();
  await writeFile('public/robots.txt', toRobotsTxt(siteUrl), 'utf8');
  await writeFile('public/sitemap.xml', toSitemapXml({ siteUrl, posts }), 'utf8');
  await writeFile('public/rss.xml', toRssXml({ siteUrl, siteName, description, posts }), 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

