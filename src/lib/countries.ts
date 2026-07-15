export interface Country {
  code: string
  name: string
  region: 'north-america' | 'eu' | 'middle-east' | 'asia' | 'other'
  currency: string
  locale: string
  phonePrefix: string
  flag: string
}

export const COUNTRIES: Record<string, Country> = {
  us: { code: 'us', name: 'United States', region: 'north-america', currency: 'USD', locale: 'en_US', phonePrefix: '+1', flag: '🇺🇸' },

  // ── European Union ──
  at: { code: 'at', name: 'Austria', region: 'eu', currency: 'EUR', locale: 'de_AT', phonePrefix: '+43', flag: '🇦🇹' },
  be: { code: 'be', name: 'Belgium', region: 'eu', currency: 'EUR', locale: 'nl_BE', phonePrefix: '+32', flag: '🇧🇪' },
  bg: { code: 'bg', name: 'Bulgaria', region: 'eu', currency: 'BGN', locale: 'bg_BG', phonePrefix: '+359', flag: '🇧🇬' },
  hr: { code: 'hr', name: 'Croatia', region: 'eu', currency: 'EUR', locale: 'hr_HR', phonePrefix: '+385', flag: '🇭🇷' },
  cy: { code: 'cy', name: 'Cyprus', region: 'eu', currency: 'EUR', locale: 'el_CY', phonePrefix: '+357', flag: '🇨🇾' },
  cz: { code: 'cz', name: 'Czech Republic', region: 'eu', currency: 'CZK', locale: 'cs_CZ', phonePrefix: '+420', flag: '🇨🇿' },
  dk: { code: 'dk', name: 'Denmark', region: 'eu', currency: 'DKK', locale: 'da_DK', phonePrefix: '+45', flag: '🇩🇰' },
  ee: { code: 'ee', name: 'Estonia', region: 'eu', currency: 'EUR', locale: 'et_EE', phonePrefix: '+372', flag: '🇪🇪' },
  fi: { code: 'fi', name: 'Finland', region: 'eu', currency: 'EUR', locale: 'fi_FI', phonePrefix: '+358', flag: '🇫🇮' },
  fr: { code: 'fr', name: 'France', region: 'eu', currency: 'EUR', locale: 'fr_FR', phonePrefix: '+33', flag: '🇫🇷' },
  de: { code: 'de', name: 'Germany', region: 'eu', currency: 'EUR', locale: 'de_DE', phonePrefix: '+49', flag: '🇩🇪' },
  gr: { code: 'gr', name: 'Greece', region: 'eu', currency: 'EUR', locale: 'el_GR', phonePrefix: '+30', flag: '🇬🇷' },
  hu: { code: 'hu', name: 'Hungary', region: 'eu', currency: 'HUF', locale: 'hu_HU', phonePrefix: '+36', flag: '🇭🇺' },
  ie: { code: 'ie', name: 'Ireland', region: 'eu', currency: 'EUR', locale: 'en_IE', phonePrefix: '+353', flag: '🇮🇪' },
  it: { code: 'it', name: 'Italy', region: 'eu', currency: 'EUR', locale: 'it_IT', phonePrefix: '+39', flag: '🇮🇹' },
  lv: { code: 'lv', name: 'Latvia', region: 'eu', currency: 'EUR', locale: 'lv_LV', phonePrefix: '+371', flag: '🇱🇻' },
  lt: { code: 'lt', name: 'Lithuania', region: 'eu', currency: 'EUR', locale: 'lt_LT', phonePrefix: '+370', flag: '🇱🇹' },
  lu: { code: 'lu', name: 'Luxembourg', region: 'eu', currency: 'EUR', locale: 'lb_LU', phonePrefix: '+352', flag: '🇱🇺' },
  mt: { code: 'mt', name: 'Malta', region: 'eu', currency: 'EUR', locale: 'mt_MT', phonePrefix: '+356', flag: '🇲🇹' },
  nl: { code: 'nl', name: 'Netherlands', region: 'eu', currency: 'EUR', locale: 'nl_NL', phonePrefix: '+31', flag: '🇳🇱' },
  pl: { code: 'pl', name: 'Poland', region: 'eu', currency: 'PLN', locale: 'pl_PL', phonePrefix: '+48', flag: '🇵🇱' },
  pt: { code: 'pt', name: 'Portugal', region: 'eu', currency: 'EUR', locale: 'pt_PT', phonePrefix: '+351', flag: '🇵🇹' },
  ro: { code: 'ro', name: 'Romania', region: 'eu', currency: 'RON', locale: 'ro_RO', phonePrefix: '+40', flag: '🇷🇴' },
  sk: { code: 'sk', name: 'Slovakia', region: 'eu', currency: 'EUR', locale: 'sk_SK', phonePrefix: '+421', flag: '🇸🇰' },
  si: { code: 'si', name: 'Slovenia', region: 'eu', currency: 'EUR', locale: 'sl_SI', phonePrefix: '+386', flag: '🇸🇮' },
  es: { code: 'es', name: 'Spain', region: 'eu', currency: 'EUR', locale: 'es_ES', phonePrefix: '+34', flag: '🇪🇸' },
  se: { code: 'se', name: 'Sweden', region: 'eu', currency: 'SEK', locale: 'sv_SE', phonePrefix: '+46', flag: '🇸🇪' },
  gb: { code: 'gb', name: 'United Kingdom', region: 'eu', currency: 'GBP', locale: 'en_GB', phonePrefix: '+44', flag: '🇬🇧' },

  // ── Middle East ──
  bh: { code: 'bh', name: 'Bahrain', region: 'middle-east', currency: 'BHD', locale: 'ar_BH', phonePrefix: '+973', flag: '🇧🇭' },
  iq: { code: 'iq', name: 'Iraq', region: 'middle-east', currency: 'IQD', locale: 'ar_IQ', phonePrefix: '+964', flag: '🇮🇶' },
  il: { code: 'il', name: 'Israel', region: 'middle-east', currency: 'ILS', locale: 'he_IL', phonePrefix: '+972', flag: '🇮🇱' },
  jo: { code: 'jo', name: 'Jordan', region: 'middle-east', currency: 'JOD', locale: 'ar_JO', phonePrefix: '+962', flag: '🇯🇴' },
  kw: { code: 'kw', name: 'Kuwait', region: 'middle-east', currency: 'KWD', locale: 'ar_KW', phonePrefix: '+965', flag: '🇰🇼' },
  lb: { code: 'lb', name: 'Lebanon', region: 'middle-east', currency: 'LBP', locale: 'ar_LB', phonePrefix: '+961', flag: '🇱🇧' },
  om: { code: 'om', name: 'Oman', region: 'middle-east', currency: 'OMR', locale: 'ar_OM', phonePrefix: '+968', flag: '🇴🇲' },
  qa: { code: 'qa', name: 'Qatar', region: 'middle-east', currency: 'QAR', locale: 'ar_QA', phonePrefix: '+974', flag: '🇶🇦' },
  sa: { code: 'sa', name: 'Saudi Arabia', region: 'middle-east', currency: 'SAR', locale: 'ar_SA', phonePrefix: '+966', flag: '🇸🇦' },
  sy: { code: 'sy', name: 'Syria', region: 'middle-east', currency: 'SYP', locale: 'ar_SY', phonePrefix: '+963', flag: '🇸🇾' },
  tr: { code: 'tr', name: 'Turkey', region: 'middle-east', currency: 'TRY', locale: 'tr_TR', phonePrefix: '+90', flag: '🇹🇷' },
  ae: { code: 'ae', name: 'UAE', region: 'middle-east', currency: 'AED', locale: 'ar_AE', phonePrefix: '+971', flag: '🇦🇪' },
  ye: { code: 'ye', name: 'Yemen', region: 'middle-east', currency: 'YER', locale: 'ar_YE', phonePrefix: '+967', flag: '🇾🇪' },
}

export const COUNTRY_CODES = Object.keys(COUNTRIES)

export const REGIONS: Record<string, { label: string; order: number }> = {
  'north-america': { label: 'North America', order: 0 },
  'eu': { label: 'Europe', order: 1 },
  'middle-east': { label: 'Middle East', order: 2 },
  'asia': { label: 'Asia', order: 3 },
  'other': { label: 'Other', order: 4 },
}

export function getCountry(code: string): Country {
  return COUNTRIES[code] || COUNTRIES.us
}

export function getCountriesByRegion(): Record<string, Country[]> {
  const grouped: Record<string, Country[]> = {}
  for (const c of Object.values(COUNTRIES)) {
    if (!grouped[c.region]) grouped[c.region] = []
    grouped[c.region].push(c)
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name))
  }
  return grouped
}

export const DEFAULT_COUNTRY = 'us'

export const COUNTRY_COOKIE = 'ats_country'
