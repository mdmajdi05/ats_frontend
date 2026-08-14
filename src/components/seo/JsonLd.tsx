import { SITE_URL, SITE_NAME, SITE_EMAIL, SITE_PHONE_TEL, SITE_ADDRESS, SITE_SOCIAL, SITE_CAGE_CODE, SITE_CERTIFICATIONS } from '@/lib/constants';

const siteUrl = SITE_URL;

const hasPhone = Boolean(SITE_PHONE_TEL);

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'Global supplier of gas turbine spare parts and services for power generation, oil & gas, marine, and industrial operators.',
  foundingDate: '2009',
  email: SITE_EMAIL,
  ...(hasPhone ? { telephone: SITE_PHONE_TEL } : {}),
  slogan: 'Certified gas turbine spare parts, delivered worldwide.',
  priceRange: '$$',
  areaServed: ['United States', 'Russia', 'United Kingdom', 'Germany', 'France', 'UAE', 'Saudi Arabia', 'India', 'China', 'Japan', 'South Korea', 'Brazil', 'Australia', 'Canada', 'Italy', 'Spain', 'Netherlands', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Egypt', 'Turkey', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Mexico', 'Argentina', 'Colombia', 'Chile', 'Peru', 'South Africa', 'Nigeria', 'Kenya', 'Morocco', 'Poland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Czech Republic', 'Romania', 'Ukraine', 'Israel', 'Jordan', 'Lebanon', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'New Zealand'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_ADDRESS.street,
    addressLocality: SITE_ADDRESS.city,
    addressRegion: SITE_ADDRESS.state,
    postalCode: SITE_ADDRESS.zip,
    addressCountry: SITE_ADDRESS.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    ...(hasPhone ? { telephone: SITE_PHONE_TEL } : {}),
    contactType: 'sales',
    areaServed: 'Worldwide',
    availableLanguage: ['English', 'Hindi', 'Arabic', 'Russian'],
  },
  knowsAbout: [
    'Gas turbine spare parts',
    'Aerospace components',
    'NSN parts',
    'CAGE code',
    'Turbine blades & nozzles',
    'Combustion systems',
    'Speedtronic controls',
    'MRO supplies',
  ],
  hasCredential: SITE_CERTIFICATIONS.map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'certification',
    name: c,
  })),
  sameAs: [SITE_SOCIAL.linkedin, SITE_SOCIAL.twitter],
  taxID: SITE_CAGE_CODE,
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
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
    name: 'What paperwork comes with your parts?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Every part ships with AS9100 and AS9120 documentation, plus manufacturer certificates and material traceability. We share all of this with your quote, not after you have already paid.',
    },
  },
  {
    '@type': 'Question',
    name: 'How fast can you get me a quote?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Most requests get a response within 24 hours. If you have an unplanned outage, let us know and we will try to turn it around the same day.',
    },
  },
  {
    '@type': 'Question',
    name: 'Do you ship outside the US?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes, we ship to over 150 countries. We handle the export paperwork for turbine and control system components, including items with dual-use restrictions.',
    },
  },
  {
    '@type': 'Question',
    name: 'What is a CAGE code and why does it matter?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'It is a unique ID for the manufacturer or supplier of a part, used in defense and government procurement. For turbine buyers, it confirms you are getting the part from the company that actually made it, not a lookalike from some unverified source.',
    },
  },
  {
    '@type': 'Question',
    name: 'How do you stop counterfeit parts?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Every part goes through inspection and documentation checks before it ships. If we cannot verify where a part came from, we do not stock it, no matter how badly someone needs it.',
    },
  },
  {
    '@type': 'Question',
    name: 'Can you find obsolete or discontinued parts?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'That is actually where we do our best work. Legacy Mark V control cards, discontinued combustion hardware, older Speedtronic components. Our network of 1,200 suppliers means we can often find parts that other distributors have given up on.',
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
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  image: `${siteUrl}/logo.png`,
  url: siteUrl,
  ...(hasPhone ? { telephone: SITE_PHONE_TEL } : {}),
  email: SITE_EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_ADDRESS.street,
    addressLocality: SITE_ADDRESS.city,
    addressRegion: SITE_ADDRESS.state,
    postalCode: SITE_ADDRESS.zip,
    addressCountry: SITE_ADDRESS.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.8111,
    longitude: -80.3417,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '15:00',
    },
  ],
  sameAs: [SITE_SOCIAL.linkedin, SITE_SOCIAL.twitter],
};

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(localBusinessSchema) }}
    />
  );
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Gas Turbine Spare Parts Sourcing & Supply',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
  },
  areaServed: 'Worldwide',
  description:
    'Certified gas turbine spare parts sourcing for GE, Siemens, Rolls-Royce, and Solar Turbines. NSN/CAGE-referenced inventory, ISO 9001 & AS9120 certified, 24-hour quotes, AOG emergency response.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Gas Turbine Parts Catalog',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Hot Gas Path Components' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Control System Modules' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Combustion Hardware' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Rotating Assembly Parts' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Lube Oil & Hydraulic Systems' } },
    ],
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
};

export function ServiceJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(serviceSchema) }}
    />
  );
}

export function AboutPageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About AeroTurbineSpare',
    url: `${siteUrl}/about`,
    description:
      'AeroTurbineSpare is an ISO 9001:2015 and AS9120 Rev B certified gas turbine spare parts distributor. CAGE 8ATR9. Serving OEMs, MROs, and defense contractors in 150+ countries since 2009.',
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
      foundingDate: '2009',
      numberOfEmployees: { '@type': 'QuantitativeValue', value: 50 },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}

export function ContactPageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact AeroTurbineSpare',
    url: `${siteUrl}/contact`,
    description:
      'Contact AeroTurbineSpare for aerospace parts inquiries, RFQ submissions, technical support, and AOG emergency assistance.',
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        ...(hasPhone ? { telephone: SITE_PHONE_TEL } : {}),
        contactType: 'sales',
        email: SITE_EMAIL,
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Hindi', 'Arabic', 'Russian'],
      },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}

export function QualityPageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Quality Assurance â€” AeroTurbineSpare',
    url: `${siteUrl}/quality`,
    description:
      'ISO 9001:2015 and AS9120 Rev B quality assurance program. 100% inspection, full traceability, anti-counterfeit policy, 12-month defect warranty.',
    about: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    hasPart: {
      '@type': 'HowTo',
      name: 'AeroTurbineSpare Parts Inspection Process',
      step: [
        { '@type': 'HowToStep', name: 'Visual Inspection', text: 'Physical inspection of every incoming part for damage, wear, and cosmetic defects.' },
        { '@type': 'HowToStep', name: 'Dimensional Verification', text: 'Cross-reference against OEM specifications and technical drawings.' },
        { '@type': 'HowToStep', name: 'Documentation Check', text: 'Verify CAGE codes, NSN markings, condition codes, and manufacturer certificates.' },
        { '@type': 'HowToStep', name: 'Chain of Custody', text: 'Full traceability documentation from source to shipment.' },
      ],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}

export function ReviewJsonLd({ reviews, aggregateRating }: {
  reviews: { author: string; rating: number; body: string; date: string }[];
  aggregateRating: { ratingValue: number; reviewCount: number };
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      bestRating: 5,
      reviewCount: aggregateRating.reviewCount,
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewBody: r.body,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}

export function ItemListJsonLd({ items, pageTitle }: {
  items: { name: string; url: string; description?: string; image?: string }[];
  pageTitle: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      ...(item.image ? { image: item.image } : {}),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}

export function SpeakableJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AeroTurbineSpare â€” Gas Turbine Spare Parts',
    url: siteUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-heading', '.seo-description'],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}
