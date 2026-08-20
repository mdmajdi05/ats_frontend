import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

// Agent Skills Discovery index (RFC v0.2.0)
// Points agents at skill files that describe how to use the site's tools.
const SKILL_SHA256 = '419202c25a4d190c992bf38731bc584162edce250b24da286db06fa713b3bb46';

export async function GET() {
  const index = {
    $schema: 'https://agentskills.io/schema.json',
    skills: [
      {
        name: 'ats-parts-lookup',
        type: 'markdown',
        description:
          'Search AeroTurbineSpare gas turbine spare parts by part number, NSN, or CAGE code and request quotes.',
        url: `${SITE_URL}/.well-known/agent-skills/ats-parts-lookup/SKILL.md`,
        sha256: SKILL_SHA256,
      },
    ],
  };

  return new Response(JSON.stringify(index, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}