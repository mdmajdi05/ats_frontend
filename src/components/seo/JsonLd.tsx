const siteUrl = 'https://aeroturbinespare.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AeroTurbineSpare',
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  description:
    'Global supplier of gas turbine spare parts and services for power generation, oil & gas, marine, and industrial operators.',
  areaServed: ['United States', 'Russia'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-8304784587',
    contactType: 'sales',
    areaServed: ['US', 'RU'],
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://www.linkedin.com/company/aeroturbinespare',
    'https://twitter.com/aeroturbinespare',
  ],
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

const FAQ_SCHEMA = [
  {
    '@type': 'Question',
    name: 'What certifications do your gas turbine parts carry?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Every part ships with AS9100 and AS9120-backed documentation, plus manufacturer certificates of conformance and material traceability where applicable.',
    },
  },
  {
    '@type': 'Question',
    name: 'Do you ship internationally?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes, to 150+ countries, including full export documentation for turbine and control system components.',
    },
  },
  {
    '@type': 'Question',
    name: 'How fast can I get a quote?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Our standard quote response time is under 24 hours. For AOG urgent requests, we prioritize within 4 hours.',
    },
  },
  {
    '@type': 'Question',
    name: 'What is a CAGE code and why is it important?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'A CAGE code is a unique identifier assigned to suppliers by the Department of Defense. All our parts are cross-referenced by CAGE code to ensure authenticity and compliance with military standards.',
    },
  },
  {
    '@type': 'Question',
    name: 'How do you ensure parts are counterfeit-free?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'We maintain a strict Zero Counterfeit Policy with supplier qualification audits, incoming inspection, dimensional verification, and chain-of-custody documentation.',
    },
  },
  {
    '@type': 'Question',
    name: 'Can you source hard-to-find or obsolete parts?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Absolutely. We specialize in sourcing hard-to-find, obsolete, and legacy components for both commercial and military aircraft through our global supplier network.',
    },
  },
];

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

export function FAQJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_SCHEMA,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema as unknown as Record<string, unknown>) }}
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
