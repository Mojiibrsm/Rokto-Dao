import { MetadataRoute } from 'next';

/**
 * @fileOverview Robots.txt জেনারেটর যা সার্চ ইঞ্জিনকে সাইট ইনডেক্স করতে গাইড করে।
 */

export default function robots(): MetadataRoute.Robots {
  // আপনার ডোমেইন অনুযায়ী আপডেট করা হয়েছে
  const baseUrl = 'https://roktodao.bartanow.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/login/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
