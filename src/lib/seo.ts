import type { Metadata } from 'next'
import { COUNTRIES, COUNTRY_CODES, DEFAULT_COUNTRY, getCountry } from './countries'
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESC,
  OG_IMAGE,
  SITE,
  SEO_TITLE_MAX,
  SEO_DESC_MAX,
  SEO_TITLE_SEGMENT_MAX,
} from './constants'

const DEFAULT_DESC = SITE_DESC;
const DEFAULT_OG_IMAGE = OG_IMAGE;

/**
 * Truncate a string to `maxLen`, preferring a word boundary, appending "…".
 * Saray SEO titles/descriptions yahi se clamp hote hain — limits har jagah
 * ek jaisi rahengi.
 */
export function truncateSeo(text: string, maxLen: number): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  let cut = t.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.7) cut = cut.slice(0, lastSpace);
  return `${cut.trimEnd()}…`;
}

/** Remove any trailing "| AeroTurbineSpare" / "— AeroTurbineSpare" so the layout template doesn't double-append the brand. */
export function stripBrandSuffix(title: string): string {
  return title
    .replace(/\s*\|\s*AeroTurbineSpare\s*$/i, '')
    .replace(/\s*[—–-]\s*AeroTurbineSpare\s*$/i, '')
    .trim();
}

/** Clamp a meta title segment to a max (defaults to SEO_TITLE_MAX). */
export function clampTitle(title: string, max: number = SEO_TITLE_MAX): string {
  return truncateSeo(stripBrandSuffix(title), max);
}

/** Clamp a meta description to SEO_DESC_MAX (160). */
export function clampDescription(desc: string): string {
  return truncateSeo(desc, SEO_DESC_MAX);
}

export function buildHreflang(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const code of COUNTRY_CODES) {
    const locale = COUNTRIES[code].locale.replace('_', '-').toLowerCase();
    languages[locale] = code === DEFAULT_COUNTRY ? `${SITE_URL}${path}` : `${SITE_URL}/${code}${path}`;
  }
  languages['x-default'] = `${SITE_URL}${path}`;
  return languages;
}

export interface SeoMetaInput {
  /** Page title (no site suffix — layout template adds it) */
  title: string;
  /** Meta description (~155 chars) */
  description: string;
  /** URL path, e.g. "/catalog" or "/parts/gear-boxes" */
  path: string;
  /** Keywords array or comma-separated string */
  keywords?: string[] | string;
  /** Custom OpenGraph title (defaults to `title`) */
  ogTitle?: string;
  /** Custom OpenGraph description (defaults to `description`) */
  ogDescription?: string;
  /** Custom Twitter title (defaults to `ogTitle`) */
  twitterTitle?: string;
  /** Custom Twitter description (defaults to `ogDescription`) */
  twitterDescription?: string;
  /** OpenGraph/Twitter image (defaults to site OG image) */
  ogImage?: string;
  /** Set true to noindex the page */
  noIndex?: boolean;
  /** Set true to nofollow the page */
  noFollow?: boolean;
  /** Override canonical URL (absolute). When set, hreflang uses `path` as usual. */
  canonical?: string;
  /** Optional country code to build a localized canonical */
  country?: string;
  /** Deep-merge extra OpenGraph fields (article tags, publishedTime, authors...) */
  openGraph?: Metadata['openGraph'];
  /** Deep-merge extra Twitter fields */
  twitter?: Metadata['twitter'];
}

/**
 * Central metadata builder — one place for the boilerplate that every page repeats:
 * canonical, hreflang, OpenGraph, Twitter, and robots. Pages supply content
 * (title/description/keywords/path); this handles the structure.
 *
 * Usage:
 *   export const metadata = seoMeta({ title, description, path, keywords })
 *
 * Dynamic pages (data from API) can call it inside generateMetadata().
 */
export function seoMeta(input: SeoMetaInput): Metadata {
  const country = input.country || DEFAULT_COUNTRY;
  const cfg = getCountry(country);
  const isDefault = country === DEFAULT_COUNTRY;

  const url = isDefault
    ? `${SITE_URL}${input.path}`
    : `${SITE_URL}/${country}${input.path}`;

  const image = input.ogImage || DEFAULT_OG_IMAGE;
  // Rendered <title> = segment + " | AeroTurbineSpare" (layout template).
  // Clamp the SEGMENT to SEO_TITLE_SEGMENT_MAX so the FULL title stays ≤ 60.
  const title = clampTitle(input.title, SEO_TITLE_SEGMENT_MAX);
  const description = clampDescription(input.description);
  const ogTitle = clampTitle(input.ogTitle || title, SEO_TITLE_MAX);
  const ogDescription = clampDescription(input.ogDescription || description);
  const twitterTitle = clampTitle(input.twitterTitle || ogTitle, SEO_TITLE_MAX);
  const twitterDescription = clampDescription(input.twitterDescription || ogDescription);

  const canonical = input.canonical || url;

  const merge = <T extends object>(obj?: T | null): Partial<T> =>
    obj ? (Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>) : {};

  const metadata: Metadata = {
    title,
    description,
    keywords: Array.isArray(input.keywords)
      ? input.keywords.join(', ')
      : input.keywords,
    alternates: {
      canonical,
      languages: buildHreflang(input.path),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: cfg.locale,
      images: [{ url: image, width: 1200, height: 630 }],
      ...merge(input.openGraph),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [image],
      ...merge(input.twitter),
    },
    robots: {
      index: input.noIndex ? false : true,
      follow: input.noFollow ? false : true,
    },
  };

  return metadata;
}

/** @deprecated — use `SITE` from '@/lib/constants' instead */
export const siteConfig = SITE;

export function buildMetadata(overrides: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
  country?: string;
}) {
  const country = overrides.country || DEFAULT_COUNTRY;
  const cfg = getCountry(country);
  const isDefault = country === DEFAULT_COUNTRY;

  const title = overrides.title
    ? `${overrides.title} | AeroTurbineSpare`
    : 'AeroTurbineSpare — Precision Aerospace Parts Sourcing';
  const description = overrides.description || DEFAULT_DESC;
  const url = isDefault
    ? (overrides.path ? `${SITE_URL}${overrides.path}` : SITE_URL)
    : (overrides.path ? `${SITE_URL}/${country}${overrides.path}` : `${SITE_URL}/${country}`);
  const image = overrides.ogImage || DEFAULT_OG_IMAGE;

  const languages: Record<string, string> = {};
  for (const code of COUNTRY_CODES) {
    const c = COUNTRIES[code];
    const locale = c.locale.replace('_', '-').toLowerCase();
    languages[locale] = code === DEFAULT_COUNTRY
      ? `${SITE_URL}${overrides.path || ''}`
      : `${SITE_URL}/${code}${overrides.path || ''}`;
  }
  languages['x-default'] = `${SITE_URL}${overrides.path || ''}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website' as const,
      locale: cfg.locale,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image],
    },
    robots: overrides.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    keywords: (overrides.keywords || []).join(', '),
  };
}

export function jsonLdOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESC,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
        contactType: 'sales',
        email: siteConfig.email,
        hoursAvailable: 'Mo-Fr 07:00-19:00',
      },
      {
        '@type': 'ContactPoint',
        ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
        contactType: 'emergency',
        description: 'AOG Emergency Line (24/7)',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/aeroturbinespare',
    ],
  };
}

export function jsonLdWebsite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESC,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/catalog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[], country?: string) {
  const prefix = country ? `/${country}` : '';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${prefix}${item.url}`,
    })),
  };
}

export function jsonLdProduct(product: {
  name: string;
  description: string;
  sku: string;
  mpn: string;
  brand: string;
  image?: string;
  offers: {
    price: number;
    currency?: string;
    availability: 'InStock' | 'LimitedAvailability' | 'OutOfStock';
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    mpn: product.mpn,
    image: product.image,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.currency || 'USD',
      availability: `https://schema.org/${product.offers.availability}`,
    },
  };
}

export function jsonLdFAQ(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export const HOMEPAGE_FAQ = [
  {
    question: 'How do I request a quote for aerospace parts?',
    answer: 'Simply use our search bar to find your part by NSN, CAGE code, or part number, or submit a detailed RFQ directly through our website. Our team reviews every request and responds within 24 hours with a competitive, certified quote — no account required.',
  },
  {
    question: 'What certifications does AeroTurbineSpare hold?',
    answer: 'We are ISO 9001:2015 and AS9120 Rev B certified, with CAGE code 8ATR9. Every part is inspected, documented, and traced to its original source. Our quality management system is audited annually by accredited third-party certification bodies.',
  },
  {
    question: 'Do you ship to my country?',
    answer: 'We ship to over 150 countries worldwide through our global logistics network. We handle all export compliance and ITAR documentation. Whether you are in Europe, the Middle East, Asia, Africa, or North America, we can deliver to your facility.',
  },
  {
    question: 'What is your AOG (Aircraft on Ground) response time?',
    answer: 'Our AOG priority response team is available 24/7. Flag your RFQ as urgent, and we escalate to our rapid-response team for a 4-hour turnaround. Call our AOG emergency line for immediate assistance.',
  },
  {
    question: 'Do you provide traceability documentation with parts?',
    answer: 'Yes. Every shipment includes a Certificate of Conformance (CoC), traceability documentation back to the OEM or approved supplier, and airworthiness approval tags (8130-3, EASA Form 1, or equivalent) where applicable. Full documentation is non-negotiable.',
  },
  {
    question: 'Can you source hard-to-find or obsolete parts?',
    answer: 'Absolutely. We specialize in sourcing parts that other distributors cannot locate — legacy military components, obsolete part numbers, and hard-to-find commercial aviation parts. Our global supplier network of over 1,200 certified OEM manufacturers makes this possible.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept wire transfers, letters of credit (LC), and credit cards for qualified orders. Net terms may be available for established customers with approved credit. Contact our sales team for specific payment arrangements.',
  },
  {
    question: 'How do I sell my excess inventory to AeroTurbineSpare?',
    answer: 'Use our Sell Inventory page to submit your excess stock. Upload your inventory list, and our procurement team will review it and respond with a competitive offer. We purchase certified aerospace parts from quality suppliers worldwide.',
  },
];
