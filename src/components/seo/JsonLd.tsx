const siteUrl = 'https://aeroturbinespare.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AeroTurbineSpare',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'Global supplier of certified aerospace parts, NSN components, turbine spares, and MRO supplies. ISO 9001 & AS9120B certified.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9354764587',
    contactType: 'sales',
    availableLanguage: ['English'],
  },
  sameAs: ['https://linkedin.com/company/aeroturbinespare'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AeroTurbineSpare',
  url: siteUrl,
  description:
    'Source certified aerospace parts fast. NSN, CAGE, turbine components, MRO supplies.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/catalog?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

function safeJson(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(organizationSchema) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(websiteSchema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://aeroturbinespare.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}
