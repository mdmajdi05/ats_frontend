import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

const PRIVATE_PATHS = [
  '/dashboard/',
  '/admin/',
  '/superadmin/',
  '/dev/',
  '/api/',
  '/_next/',
  '/login?',
  '/register',
  '/unauthorized',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rules for search engines — allow everything public
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // AI/LLM crawlers — explicitly allowed for AI search visibility
      // (ChatGPT Search, Perplexity, Claude, Gemini, Bing AI)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Google-CloudScheduler',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'ccbot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'ImagesiftBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
