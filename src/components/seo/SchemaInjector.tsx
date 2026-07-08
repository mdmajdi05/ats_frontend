'use client';

import { useEffect, useState } from 'react';
import { schemaService } from '@/services/schemaService';

interface Props {
  pageKey: string;
  staticSchemas?: Record<string, unknown>[];
}

interface SeoConfig {
  label?: string;
  schemaJson?: Record<string, unknown> | null;
  faqItems?: { question: string; answer: string }[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
  canonicalUrl?: string | null;
  extraHead?: Record<string, unknown> | null;
  updatedAt?: string;
}

type SeoConfigMap = Record<string, SeoConfig>;

function toSafeJson(data: Record<string, unknown>): string {
  try {
    return JSON.stringify(data).replace(/</g, '\\u003c');
  } catch {
    return '{}';
  }
}

async function loadLocalConfig(): Promise<SeoConfigMap> {
  try {
    const res = await fetch('/data/seo-config.json', {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export function SchemaInjector({ pageKey, staticSchemas = [] }: Props) {
  const [schemas, setSchemas] = useState<string[]>(() =>
    staticSchemas.map(toSafeJson),
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1st: Try local JSON file (always available, even when backend is down)
      const localConfig = await loadLocalConfig();
      const localPage = localConfig[pageKey];

      // 2nd: Try backend for fresher data
      const backendPage = await schemaService.getPublic(pageKey);

      if (cancelled) return;

      const merged = [...staticSchemas.map(toSafeJson)];
      const source = backendPage || localPage;

      if (source) {
        if (source.schemaJson && typeof source.schemaJson === 'object') {
          merged.push(toSafeJson(source.schemaJson as Record<string, unknown>));
        }
        if (Array.isArray(source.faqItems) && source.faqItems.length > 0) {
          merged.push(
            toSafeJson({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: source.faqItems.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            }),
          );
        }
      }

      setSchemas(merged);
    }

    load();

    return () => { cancelled = true; };
  }, [pageKey]);

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: s }} />
      ))}
    </>
  );
}
