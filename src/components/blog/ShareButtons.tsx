'use client';

import { useState } from 'react';
import { Share2, Globe, Send, MessageCircle, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Globe,
      bg: 'bg-[#1877F2] hover:bg-[#166FE5]',
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Send,
      bg: 'bg-[#1DA1F2] hover:bg-[#1A91DA]',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`,
      icon: Share2,
      bg: 'bg-[#0A66C2] hover:bg-[#095AAE]',
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
      bg: 'bg-[#25D366] hover:bg-[#22C35E]',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-col items-start gap-3 mt-10 pt-6 border-t border-[#E8EDF2]">
      <span className="text-sm font-semibold text-[#4A4A6A] flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share this article
      </span>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${link.bg} text-white text-xs font-semibold px-3 py-2 rounded-full transition-all hover:scale-105 active:scale-95`}
              aria-label={`Share on ${link.name}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{link.name}</span>
            </a>
          );
        })}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 bg-[#E8EDF2] hover:bg-[#D1D9E6] text-[#4A4A6A] text-xs font-semibold px-3 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
