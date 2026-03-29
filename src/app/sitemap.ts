import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/sheets';

/**
 * @fileOverview SEO এর জন্য ডাইনামিক সাইটম্যাপ জেনারেটর। 
 * এটি সাইটের সব স্ট্যাটিক পেজ এবং ব্লগের লিঙ্কগুলো সার্চ ইঞ্জিনের কাছে পৌঁছে দেয়।
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://roktodao.com';

  // ১. সাইটের সাধারণ বা স্ট্যাটিক লিঙ্কসমূহ
  const routes = [
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

  // ২. ব্লগের ডাইনামিক লিঙ্কসমূহ (গুগল শিট থেকে সংগৃহীত)
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
    console.error('Sitemap blog generation error:', error);
  }

  return [...routes, ...blogEntries];
}
