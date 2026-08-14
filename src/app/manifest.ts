import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_SHORT_NAME, SITE_DESC, SITE_URL } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESC,
    id: `${SITE_URL}/`,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    categories: ['business', 'shopping', 'industrial'],
    background_color: '#0A1628',
    theme_color: '#4F46E5',
    lang: 'en',
    dir: 'ltr',
    icons: [
      { src: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
