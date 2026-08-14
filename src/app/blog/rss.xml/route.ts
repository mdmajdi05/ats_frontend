import { SITE_URL, SITE_NAME } from '@/lib/constants';
import localPosts from '@/data/blog/posts.json';

type RssPost = {
  slug?: string;
  title?: string;
  publishedAt?: string;
  excerpt?: string;
  metaDesc?: string;
  content?: string;
  status?: string;
  metaTitle?: string;
  author?: { fullName?: string };
  categories?: { name: string }[];
};

const RSS_DESC = 'Latest news, guides and technical articles from AeroTurbineSpare on gas turbine spare parts, aerospace components, NSN and CAGE code sourcing, inspection and procurement.';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = (localPosts as RssPost[])
    .filter((p) => p.status === 'Published' && p.slug)
    .sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())
    .slice(0, 20);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const desc = stripHtml(post.excerpt || post.metaDesc || '');
      const content = post.content || '';
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : '';
      const author = post.author?.fullName ? `<author>${escapeXml(post.author.fullName)}</author>` : '';
      const cats = (post.categories ?? [])
        .map((c) => `<category>${escapeXml(c.name)}</category>`)
        .join('');
      return `    <item>
      <title>${escapeXml(post.metaTitle || post.title || '')}</title>
      <link>${url}</link>
      <guid isPermaLink="false">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${author}
      <description>${escapeXml(desc)}</description>
      <content:encoded><![CDATA[${escapeXml(content)}]]></content:encoded>
      ${cats}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)} - Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(RSS_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <ttl>60</ttl>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
