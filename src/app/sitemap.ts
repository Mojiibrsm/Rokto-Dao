import { MetadataRoute } from 'next';
import { getBlogs, getDonors } from '@/lib/sheets';

/**
 * @fileOverview SEO friendly dynamic sitemap generator.
 * Automatically indexes all pages, blog posts, and donor profiles.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap blog error:', error);
  }

  let donorEntries: MetadataRoute.Sitemap = [];
  try {
    const donors = await getDonors();
    donorEntries = donors.map((donor) => ({
      url: `${baseUrl}/donors/${donor.phone}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const, // Fast update for new donors
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap donor error:', error);
  }

  return [...staticRoutes, ...blogEntries, ...donorEntries];
}
