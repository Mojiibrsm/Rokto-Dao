import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/sheets';

/**
 * @fileOverview SEO ফ্রেন্ডলি ডাইনামিক সাইটম্যাপ জেনারেটর।
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // আপনার ডোমেইন অনুযায়ী আপডেট করা হয়েছে
  const baseUrl = 'https://roktodao.pro.bd';

  const staticRoutes = [
    '',
    '/about',
    '/donors',
    '/requests',
    '/eligibility',
    '/blog',
    '/team',
    '/contact',
    '/privacy',
    '/terms',
    '/register',
    '/login'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getBlogs();
    blogEntries = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.createdat || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap blog error:', error);
  }

  return [...staticRoutes, ...blogEntries];
}
