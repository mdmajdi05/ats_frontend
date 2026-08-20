import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

// RFC 9727 API Catalog (application/linkset+json)
// Describes the AeroTurbineSpare REST API so AI agents can discover it.
export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: 'https://api.aeroturbinespare.com/api/v1',
        'service-doc': [
          {
            href: `${SITE_URL}/`,
            type: 'text/html',
            title: 'AeroTurbineSpare website',
          },
        ],
        'service-desc': [
          {
            href: 'https://api.aeroturbinespare.com/api/v1/openapi.json',
            type: 'application/openapi+json',
            title: 'AeroTurbineSpare OpenAPI description',
          },
        ],
        status: [
          {
            href: 'https://api.aeroturbinespare.com/health',
            type: 'application/json',
            title: 'API health check',
          },
        ],
      },
      {
        anchor: `${SITE_URL}/api/lead/submit`,
        'service-doc': [
          {
            href: `${SITE_URL}/`,
            type: 'text/html',
            title: 'AeroTurbineSpare website',
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}