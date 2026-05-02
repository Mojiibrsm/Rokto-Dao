import { MetadataRoute } from 'next';

/**
 * @fileOverview PWA Manifest configuration for RoktoDao.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'রক্তদাও - RoktoDao',
    short_name: 'RoktoDao',
    description: 'বাংলাদেশে রক্তদাতা খুঁজুন ও জীবন বাঁচান',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#d31d2a',
    icons: [
      {
        src: 'https://roktodao.pro.bd/files/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://roktodao.pro.bd/files/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
