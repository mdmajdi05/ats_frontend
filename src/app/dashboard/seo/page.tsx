'use client';

import Link from 'next/link';
import {
  Globe, FileJson, GitFork, Tag, Search, BarChart3,
  BookOpen, Edit3, Settings, ExternalLink,
} from 'lucide-react';

const SEO_SECTIONS = [
  { href: '/dashboard/seo/schemas',   icon: FileJson,   label: 'Schema Manager',    desc: 'Manage JSON-LD schemas per page, regenerate all schemas to frontend files' },
  { href: '/dashboard/seo/sitemap',   icon: GitFork,    label: 'Sitemap Manager',   desc: 'View sitemap structure, regenerate sitemap.xml data' },
  { href: '/dashboard/seo/meta',      icon: Tag,        label: 'Meta Tags',         desc: 'Edit meta titles, descriptions, OG images per page' },
  { href: '/dashboard/seo/layout',    icon: Edit3,      label: 'Layout SEO',        desc: 'Configure head scripts, global meta, and layout settings' },
  { href: '/dashboard/seo/content',   icon: BookOpen,   label: 'Website Content',   desc: 'Edit text content displayed on website pages' },
  { href: '/dashboard/seo/blog',      icon: Globe,      label: 'Blog SEO',          desc: 'View and optimize SEO for all blog posts' },
  { href: '/dashboard/seo/links',     icon: ExternalLink, label: 'Link Checker',     desc: 'Audit internal and external links across the site' },
  { href: '/dashboard/seo/settings',  icon: Settings,   label: 'SEO Settings',      desc: 'Configure SEO defaults, robots, and indexing rules' },
];

export default function SEOOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange" />
          SEO Manager
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Full control over schemas, sitemaps, meta tags, blog SEO, and website content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEO_SECTIONS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border border-silver p-5 hover:border-orange/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange/20 transition-colors">
                <Icon className="w-5 h-5 text-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-navy text-sm group-hover:text-orange transition-colors">
                  {label}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
