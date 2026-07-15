'use client'

import { useCallback, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCountryStore } from '@/lib/country-store'
import { getCountry, DEFAULT_COUNTRY, COUNTRY_CODES } from '@/lib/countries'

export function useCountry() {
  const params = useParams()
  const router = useRouter()
  const { country, setCountry } = useCountryStore()

  const countryCode = (params?.country as string) || country || DEFAULT_COUNTRY
  const countryConfig = getCountry(countryCode)

  const switchCountry = useCallback((newCode: string) => {
    const currentPath = window.location.pathname
    const segments = currentPath.split('/').filter(Boolean)

    if (COUNTRY_CODES.includes(segments[0])) {
      segments[0] = newCode
    } else {
      segments.unshift(newCode)
    }

    setCountry(newCode)
    router.push(`/${segments.join('/')}${window.location.search}`)
  }, [router, setCountry])

  const localizeHref = useCallback((path: string) => {
    if (!path.startsWith('/')) return path
    if (COUNTRY_CODES.includes(path.split('/')[1])) return path
    return `/${countryCode}${path}`
  }, [countryCode])

  return { country: countryCode, countryConfig, switchCountry, localizeHref }
}
