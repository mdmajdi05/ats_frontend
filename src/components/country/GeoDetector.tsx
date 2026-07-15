'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCountryStore } from '@/lib/country-store'
import { COUNTRY_CODES, DEFAULT_COUNTRY, COUNTRY_COOKIE } from '@/lib/countries'
import { detectCountryFromTimezone } from '@/lib/timezone-map'

export default function GeoDetector({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const params = useParams()
  const { setCountry } = useCountryStore()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const currentCountry = (params?.country as string) || ''
    const cookieCountry = getCookie(COUNTRY_COOKIE)

    if (cookieCountry && COUNTRY_CODES.includes(cookieCountry)) {
      if (cookieCountry !== currentCountry && currentCountry) {
        router.replace(`/${cookieCountry}${window.location.pathname.replace(/^\/[^/]+/, '') || '/'}${window.location.search}`)
      }
      return
    }

    const detected = detectCountryFromTimezone()
    const target = detected && COUNTRY_CODES.includes(detected) ? detected : DEFAULT_COUNTRY

    setCountry(target)
    document.cookie = `${COUNTRY_COOKIE}=${encodeURIComponent(target)};path=/;max-age=${365*24*60*60};sameSite=lax`

    if (!currentCountry || target !== currentCountry) {
      const destPath = window.location.pathname.replace(/^\/[^/]+/, '') || '/'
      router.replace(`/${target}${destPath}${window.location.search}`)
    }
  }, [router, setCountry, params])

  return <>{children}</>
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}
