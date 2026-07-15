const TIMEZONE_COUNTRY: Record<string, string> = {
  // North America
  'America/New_York': 'us',
  'America/Chicago': 'us',
  'America/Denver': 'us',
  'America/Los_Angeles': 'us',
  'America/Anchorage': 'us',
  'Pacific/Honolulu': 'us',
  'America/Phoenix': 'us',
  'America/Detroit': 'us',
  'America/Indiana/Indianapolis': 'us',

  // Europe
  'Europe/Berlin': 'de',
  'Europe/Paris': 'fr',
  'Europe/London': 'gb',
  'Europe/Madrid': 'es',
  'Europe/Rome': 'it',
  'Europe/Amsterdam': 'nl',
  'Europe/Brussels': 'be',
  'Europe/Stockholm': 'se',
  'Europe/Copenhagen': 'dk',
  'Europe/Oslo': 'no',
  'Europe/Helsinki': 'fi',
  'Europe/Vienna': 'at',
  'Europe/Warsaw': 'pl',
  'Europe/Prague': 'cz',
  'Europe/Budapest': 'hu',
  'Europe/Dublin': 'ie',
  'Europe/Athens': 'gr',
  'Europe/Lisbon': 'pt',
  'Europe/Bucharest': 'ro',
  'Europe/Sofia': 'bg',
  'Europe/Zagreb': 'hr',
  'Europe/Bratislava': 'sk',
  'Europe/Ljubljana': 'si',
  'Europe/Tallinn': 'ee',
  'Europe/Riga': 'lv',
  'Europe/Vilnius': 'lt',
  'Europe/Luxembourg': 'lu',
  'Europe/Malta': 'mt',
  'Europe/Nicosia': 'cy',
  'Europe/Monaco': 'fr',
  'Europe/Vaduz': 'ch',
  'Europe/Zurich': 'ch',
  'Europe/Reykjavik': 'gb',

  // Middle East
  'Asia/Dubai': 'ae',
  'Asia/Riyadh': 'sa',
  'Asia/Qatar': 'qa',
  'Asia/Kuwait': 'kw',
  'Asia/Muscat': 'om',
  'Asia/Bahrain': 'bh',
  'Asia/Amman': 'jo',
  'Asia/Jerusalem': 'il',
  'Asia/Beirut': 'lb',
  'Asia/Baghdad': 'iq',
  'Asia/Damascus': 'sy',
  'Asia/Istanbul': 'tr',
}

export function detectCountryFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) return null
    return TIMEZONE_COUNTRY[tz] || null
  } catch {
    return null
  }
}
