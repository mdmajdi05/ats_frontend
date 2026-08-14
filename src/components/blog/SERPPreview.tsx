'use client';

import { SITE_URL, SEO_TITLE_MAX, SEO_DESC_MAX, SEO_TITLE_IDEAL_MIN, SEO_DESC_IDEAL_MIN } from '@/lib/constants';

interface Props {
  title: string;
  description: string;
  slug: string;
  canonicalUrl?: string | null;
}

export default function SERPPreview({ title, description, slug, canonicalUrl }: Props) {
  const displayUrl = canonicalUrl || `${SITE_URL}/blog/${slug}`;
  const displayTitle = title.length > SEO_TITLE_MAX ? title.slice(0, SEO_TITLE_MAX - 3) + '...' : title;
  const displayDesc = description.length > SEO_DESC_MAX ? description.slice(0, SEO_DESC_MAX - 3) + '...' : description;

  return (
    <div className="border border-[#E8EDF2] rounded-xl overflow-hidden bg-white">
      <div className="bg-[#F8FAFC] px-3 py-2 border-b border-[#E8EDF2]">
        <span className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">SERP Preview</span>
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs text-[#4A4A6A] truncate">{displayUrl}</p>
        <p className="text-sm text-[#1a0dab] font-medium leading-snug hover:underline cursor-pointer">{displayTitle}</p>
        <p className="text-xs text-[#545454] leading-relaxed">{displayDesc}</p>
      </div>
      <div className="px-3 py-1.5 bg-[#F8FAFC] border-t border-[#E8EDF2] flex items-center gap-2">
        <span className="text-[10px] text-[#C0C9D5]">
          {title.length}/{SEO_TITLE_MAX} · {description.length}/{SEO_DESC_MAX}
        </span>
        {title.length > SEO_TITLE_MAX && <span className="text-[10px] text-amber-500">Title too long</span>}
        {description.length > SEO_DESC_MAX && <span className="text-[10px] text-amber-500">Desc too long</span>}
        {title.length < SEO_TITLE_IDEAL_MIN && <span className="text-[10px] text-amber-500">Title too short</span>}
        {description.length < SEO_DESC_IDEAL_MIN && <span className="text-[10px] text-amber-500">Desc too short</span>}
        {title.length >= SEO_TITLE_IDEAL_MIN && title.length <= SEO_TITLE_MAX && description.length >= SEO_DESC_IDEAL_MIN && description.length <= SEO_DESC_MAX && (
          <span className="text-[10px] text-green-600">Optimal</span>
        )}
      </div>
    </div>
  );
}
