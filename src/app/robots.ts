import { MetadataRoute } from 'next';

/**
 * @fileOverview Robots.txt জেনারেটর যা সার্চ ইঞ্জিনকে সাইট ইনডেক্স করতে গাইড করে।
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://roktodao.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/login/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
