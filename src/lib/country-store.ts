'use client'

import { create } from 'zustand'
import { getCookie, setCookie } from './utils'

const COOKIE_NAME = 'ats_country'

interface CountryStore {
  country: string
  setCountry: (code: string) => void
  init: () => void
}

export const useCountryStore = create<CountryStore>((set) => ({
  country: 'us',
  setCountry: (code: string) => {
    setCookie(COOKIE_NAME, code, 365)
    set({ country: code })
  },
  init: () => {
    const saved = getCookie(COOKIE_NAME)
    if (saved) set({ country: saved })
  },
}))
