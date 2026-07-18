export { default } from '@/app/blog/[slug]/page'

export async function generateStaticParams() {
  try {
    const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');
    const res = await fetch(`${API}/blog/posts?limit=20&sort=publishedAt:desc`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const posts = json.data ?? [];
    return posts.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}