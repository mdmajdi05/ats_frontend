import type { Metadata } from 'next'
import { getCountry, COUNTRIES, COUNTRY_CODES } from '@/lib/countries'
import GeoDetector from '@/components/country/GeoDetector'

const BASE_URL = 'https://aeroturbinespare.com'

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  const cfg = getCountry(country)

  if (!cfg) return {}

  const languages: Record<string, string> = {}
  for (const code of COUNTRY_CODES) {
    const c = COUNTRIES[code]
    languages[c.locale] = `${BASE_URL}/${code}`
  }
  languages['x-default'] = BASE_URL

  return {
    alternates: {
      canonical: `${BASE_URL}/${country}`,
      languages,
    },
    openGraph: {
      locale: cfg.locale,
    },
  }
}

export default function CountryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <GeoDetector>{children}</GeoDetector>
}
