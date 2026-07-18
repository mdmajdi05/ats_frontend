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
      default: 'Gas Turbine Spare Parts Supplier | GE, Siemens & Rolls-Royce',
      template: '%s | AeroTurbineSpare',
    },
    description:
      'Source gas turbine spare parts for GE, Siemens & Rolls-Royce. New, refurbished & serviceable blades, nozzles & combustion parts. Get a quote today.',
    alternates: {
      canonical: isDefault ? BASE_URL : `${BASE_URL}/${country}`,
      languages,
    },
    openGraph: {
      title: 'Gas Turbine Spare Parts Supplier',
      description:
        'Source gas turbine parts for GE, Siemens & Rolls-Royce. 24-hr quotes, worldwide shipping.',
      url: isDefault ? BASE_URL : `${BASE_URL}/${country}`,
      siteName: 'Aero Turbine Spares',
      type: 'website',
      locale: cfg.locale,
      images: [{ url: `${BASE_URL}/images/og-cover.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gas Turbine Spare Parts Supplier',
      description: 'GE, Siemens & Rolls-Royce parts. 24-hr quotes. Worldwide shipping.',
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
