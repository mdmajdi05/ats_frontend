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

const USER_AGENTS = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Google-CloudScheduler', 'Applebot-Extended', 'bingbot', 'ccbot', 'ImagesiftBot', 'FacebookBot'];

export const dynamic = 'force-static';

export async function GET() {
  const rules = USER_AGENTS.map(
    (ua) => `User-Agent: ${ua}\nAllow: /\nDisallow: ${PRIVATE_PATHS.join('\nDisallow: ')}`
  ).join('\n\n');

  const robots = `# AeroTurbineSpare robots.txt
# AI content usage preferences (Content-Signals, https://contentsignals.org/)
# - ai-train:  NO training on site content
# - search:    YES to AI search engines / answer engines
# - ai-input:  NO use as raw model input
Content-Signal: ai-train=no, search=yes, ai-input=no

${rules}

Sitemap: ${SITE_URL}/sitemap.xml
Host: ${SITE_URL}
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
