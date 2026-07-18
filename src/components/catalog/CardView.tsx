'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ImageOff, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCardConfig } from '@/types';

interface CardViewItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  data: Record<string, unknown>;
  cardConfig?: Record<string, unknown>;
}

interface CardViewProps {
  items: CardViewItem[];
  cardConfig?: Record<string, unknown>;
}

export default function CardView({ items, cardConfig }: CardViewProps) {
  const showImage = getCardConfig(cardConfig, 'showImage', true) as boolean;
  const gridCols = getCardConfig(cardConfig, 'gridCols', 3) as number;
  const placeholder = getCardConfig(cardConfig, 'placeholder', '') as string;
  const showTitle = getCardConfig(cardConfig, 'showTitle', true) as boolean;
  const showDescription = getCardConfig(cardConfig, 'showDescription', true) as boolean;
  const showButton = getCardConfig(cardConfig, 'showButton', true) as boolean;
  const buttonLabel = getCardConfig(cardConfig, 'buttonLabel', 'View Details') as string;
  const fields = getCardConfig(cardConfig, 'fields', []) as string[];
  const titleField = getCardConfig(cardConfig, 'titleField', undefined) as string | undefined;
  const descField = getCardConfig(cardConfig, 'descField', undefined) as string | undefined;
  const imageField = getCardConfig(cardConfig, 'imageField', undefined) as string | undefined;

  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const gridClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  }[gridCols] || 'sm:grid-cols-2 lg:grid-cols-3';

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p>No items to display.</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-5', gridClass)}>
      {items.map((item) => {
        const cardTitle = titleField ? String(item.data?.[titleField] ?? '') : item.title;
        const cardDesc = descField ? String(item.data?.[descField] ?? '') : item.description;
        const cardImage = imageField ? String(item.data?.[imageField] ?? '') : item.image;
        const hasImgError = imgErrors.has(item.id);

        return (
        <div
          key={item.id}
          className="bg-white border border-silver rounded-xl overflow-hidden hover:shadow-md hover:border-orange/30 transition-all duration-200 flex flex-col"
        >
          {showImage && cardImage && !hasImgError && (
            <div className="aspect-video bg-bg overflow-hidden">
              <img
                src={cardImage}
                alt={cardTitle}
                width={640}
                height={360}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={() => setImgErrors((prev) => new Set(prev).add(item.id))}
              />
            </div>
          )}
          {showImage && ((!cardImage || hasImgError) && placeholder) && (
            <div className="aspect-video bg-bg flex items-center justify-center">
              <img src={placeholder} alt="Part placeholder image" width={640} height={360} loading="lazy" className="w-full h-full object-cover opacity-50" />
            </div>
          )}
          {showImage && (!cardImage || hasImgError) && !placeholder && (
            <div className="aspect-video bg-bg flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-silver-dark/60" />
            </div>
          )}

          <div className="p-4 flex-1 flex flex-col">
            {showTitle && (
              <h3 className="font-semibold text-text mb-1 line-clamp-2">{cardTitle}</h3>
            )}
            {showDescription && cardDesc && (
              <p className="text-xs text-text-muted line-clamp-3 mb-3 flex-1">{cardDesc}</p>
            )}

            {fields.length > 0 && (
              <div className="space-y-1 mb-3">
                {fields.map((field) => {
                  const val = item.data?.[field];
                  if (val === undefined || val === null) return null;
                  return (
                    <div key={field} className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-text-muted capitalize">{field}:</span>
                      <span className="text-text">{String(val)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {showButton && (
              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-navy hover:bg-navy-dark rounded-lg px-3.5 py-2 transition-colors text-center">
                  {buttonLabel}
                </div>
                <Link
                  href={`/parts/compare?ids=${item.id},`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange hover:text-orange-dark transition-colors"
                >
                  <Scale className="w-3 h-3" />
                  Compare
                </Link>
              </div>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}
