import { MetadataRoute } from 'next';

/**
 * @fileOverview Robots.txt generator for guiding search engines.
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://roktodao.pro.bd';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/dashboard/', 
        '/login/', 
        '/messages/',
        '/forgot/',
        '/reset-otp/',
        '/reset-question/',
        '/reset-password/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
