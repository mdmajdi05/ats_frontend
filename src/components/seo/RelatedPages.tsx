import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type RelatedPage = {
  href: string;
  label: string;
  description: string;
};

export default function RelatedPages({
  prefix = '',
  title = 'Related Parts & Resources',
  links,
}: {
  prefix?: string;
  title?: string;
  links: RelatedPage[];
}) {
  if (!links.length) return null;

  return (
    <section className="bg-bg py-16 px-4 border-t border-silver">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-orange text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-orange" />
            Internal Links
          </div>
          <h2 className="text-3xl font-black text-text">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`${prefix}${link.href}`}
              className="group bg-white border border-silver rounded-2xl p-6 hover:border-orange/40 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <span className="font-bold text-text group-hover:text-orange transition-colors mb-2 flex items-center gap-2">
                {link.label}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="text-sm text-text-muted leading-relaxed">{link.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
