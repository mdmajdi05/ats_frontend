import { Metadata } from 'next';
import Link from 'next/link';
import PostContentClient from './PostContent.client';
import localPosts from '@/data/blog-posts.json';
import type { BlogPost, SchemaOverrides } from '@/types/blog';

export const revalidate = 600;

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:4000/api/v1').replace(/\/$/, '');

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blog/posts/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data as BlogPost;
    }
  } catch {}
  const local = localPosts.find((p) => p.slug === slug);
  if (local) return local as unknown as BlogPost;
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDesc || post.excerpt || '';
  const canonical = post.canonicalUrl || `https://aeroturbinespare.com/blog/${post.slug}`;
  const robotsIndex = post.robotsIndex !== false;
  const robotsFollow = post.robotsFollow !== false;

  return {
    title,
    description,
    metadataBase: new URL('https://aeroturbinespare.com'),
    alternates: { canonical },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: [post.author.fullName],
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#0A1628] mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-[#4F46E5] font-semibold hover:underline">← Back to Blog</Link>
        </div>
      </>
    );
  }

  return <PostContentClient post={post} />;
}
