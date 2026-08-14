import type { Metadata } from 'next'
import { getCountry, COUNTRIES, COUNTRY_CODES, DEFAULT_COUNTRY } from '@/lib/countries'
import GeoDetector from '@/components/country/GeoDetector'
import { SITE_URL, SITE_NAME, SITE_DEFAULT_TITLE, SITE_TITLE_TEMPLATE, SITE_DESC, OG_IMAGE } from '@/lib/constants'

const BASE_URL = SITE_URL

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  const cfg = getCountry(country)

  if (!cfg) return {}

  const isDefault = country === DEFAULT_COUNTRY

  const languages: Record<string, string> = {}
  for (const code of COUNTRY_CODES) {
    const c = COUNTRIES[code]
    const locale = c.locale.replace('_', '-').toLowerCase()
    languages[locale] = code === DEFAULT_COUNTRY ? BASE_URL : `${BASE_URL}/${code}`
  }
  languages['x-default'] = BASE_URL

  return {
    title: {
      default: SITE_DEFAULT_TITLE,
      template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DESC,
    keywords: [
      'gas turbine spare parts',
      'turbine parts supplier',
      'GE turbine parts',
      'Siemens turbine parts',
      'Rolls-Royce turbine parts',
      'NSN parts',
      'CAGE code parts',
      'AOG parts',
      'turbine parts RFQ',
    ],
    alternates: {
      canonical: isDefault ? BASE_URL : `${BASE_URL}/${country}`,
      languages,
    },
    openGraph: {
      title: 'Gas Turbine Spare Parts Supplier',
      description:
        'Source gas turbine spare parts for GE, Siemens & Rolls-Royce. New & refurbished blades, nozzles & combustion parts. 24-hour quotes, worldwide shipping.',
      url: isDefault ? BASE_URL : `${BASE_URL}/${country}`,
      siteName: SITE_NAME,
      type: 'website',
      locale: cfg.locale,
      images: [{ url: `${BASE_URL}${OG_IMAGE}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gas Turbine Spare Parts Supplier',
      description: 'GE, Siemens & Rolls-Royce turbine parts. New & refurbished. 24-hour quotes.',
      images: [`${BASE_URL}${OG_IMAGE}`],
    },
    robots: { index: true, follow: true },
  }
}

export default function CountryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <GeoDetector>{children}</GeoDetector>
}
