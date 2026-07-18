import type { Metadata } from 'next'
import { getCountry, COUNTRIES, COUNTRY_CODES, DEFAULT_COUNTRY } from '@/lib/countries'
import GeoDetector from '@/components/country/GeoDetector'

const BASE_URL = 'https://aeroturbinespare.com'

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
      default: 'Global Gas Turbine Services & Spare Parts Supplier | AeroTurbineSpare',
      template: '%s | AeroTurbineSpare',
    },
    description:
      'Source gas turbine spare parts for GE, Siemens, Rolls-Royce & Solar Turbines. 86,000+ NSN/CAGE parts. ISO 9001 & AS9120 certified. 24-hr quotes. Ships to 150+ countries.',
    alternates: {
      canonical: isDefault ? BASE_URL : `${BASE_URL}/${country}`,
      languages,
    },
    openGraph: {
      title: 'Global Gas Turbine Services & Spare Parts Supplier',
      description:
        'Sourcing gas turbine spare parts and field services for GE, Siemens, Rolls-Royce, Solar Turbines. 86,000+ parts. 24-hr quotes. Worldwide shipping.',
      url: isDefault ? BASE_URL : `${BASE_URL}/${country}`,
      siteName: 'AeroTurbineSpare',
      type: 'website',
      locale: cfg.locale,
      images: [{ url: `${BASE_URL}/images/og-cover.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Global Gas Turbine Services & Spare Parts Supplier',
      description: '86,000+ NSN/CAGE parts. 24-hr quotes. Ships to 150+ countries.',
      images: [`${BASE_URL}/images/og-cover.jpg`],
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
