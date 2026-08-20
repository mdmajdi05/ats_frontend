/**
 * Single source of truth for site-wide constants.
 *
 * ⚠️ SEO RULE: Kabhi bhi company info (URL, name, email, phone) hardcode mat karo —
 * hamesha yahan se import karo. Ek jagah badlo = sab jagah change.
 *
 * ✅ Usage:
 *   import { SITE_URL, SITE_NAME, SITE_DESC, OG_IMAGE, SITE } from '@/lib/constants'
 *
 * Fields (alphabetical order maintain karo):
 *  - address:  Postal address for LocalBusiness schema
 *  - cageCode: CAGE code
 *  - certifications: Quality certifications
 *  - email / phone
 *  - name / shortName: Brand name (OG siteName consistency)
 *  - url: Root URL (no trailing slash)
 *  - description: Default meta description (~155 chars)
 *  - keywords: Global keyword list
 *  - ogImage: Default OpenGraph image (1200×630)
 *  - twitterHandle
 *  - locale: og:locale (en_US — US-based business)
 */

export const SITE_URL = 'https://aeroturbinespare.com';
export const SITE_NAME = 'AeroTurbineSpare';
export const SITE_SHORT_NAME = 'AeroTurbine';

/** Root layout template — pages sirf "%s" ki jagah title dete hain. */
export const SITE_TITLE_TEMPLATE = '%s | AeroTurbineSpare';
export const SITE_DEFAULT_TITLE = 'Gas Turbine Spare Parts Supplier | GE, Siemens & Rolls-Royce';

/** Default meta description (~155 chars) */
export const SITE_DESC =
  'Source gas turbine spare parts for GE, Siemens & Rolls-Royce. New, refurbished & serviceable blades, nozzles & combustion parts. Get a quote today.';

/** Default OpenGraph image (1200×630) — public/images/og-cover.jpg */
export const OG_IMAGE = '/images/og-cover.jpg';

/**
 * ── SEO length limits (single source of truth) ─────────────────────────
 * Title aur description ke limits sirf yahan define hote hain — har jaga
 * `seoMeta()` (src/lib/seo.ts) inhe central apply karta hai, isliye
 * pura codebase ek jaisa hi enforce karta hai.
 * - Blog CMS (blog-form.ts zod) bhi yahi 60/160 use karta hai.
 * - SERPPreview / SEOSidebar optimal range: title 50–60, desc 120–160.
 */
export const SEO_TITLE_MAX = 60;
export const SEO_DESC_MAX = 160;
export const SEO_TITLE_IDEAL_MIN = 50;
export const SEO_DESC_IDEAL_MIN = 120;

/**
 * Segment-title budget AFTER the layout template appends " | AeroTurbineSpare".
 * Rendered <title> = segment + suffix, so the segment must be clamped tighter
 * than SEO_TITLE_MAX for the full rendered title to stay ≤ 60.
 */
export const SEO_TITLE_TEMPLATE_SUFFIX = SITE_TITLE_TEMPLATE.replace('%s', ''); // ' | AeroTurbineSpare'
export const SEO_TITLE_SEGMENT_MAX = SEO_TITLE_MAX - SEO_TITLE_TEMPLATE_SUFFIX.length; // 41

export const SITE_EMAIL = 'sales@aeroturbinespare.com';

/**
 * ── Contact / Phone (single source of truth) ───────────────────────────
 * Saray phone numbers EK jagah (yahan) se manage hote hain — kahin bhi
 * hardcode mat karna, hamesha ye variables use karo.
 * Abhi blank rakha gaya hai — jab numbers milein to yahan fill karo
 * (ya Admin > Branding > Contact se data me save karo).
 *
 * PRIMARY / SECONDARY: 2 alag contact numbers ho sakte hain.
 * WHATSAPP: WhatsApp ke liye alag number (chat config ko override karta hai).
 */
export const SITE_PHONE_PRIMARY: string   = '';   // primary contact number (blank abhi)
export const SITE_PHONE_SECONDARY: string = '';   // secondary contact number (blank abhi)
export const SITE_PHONE_WHATSAPP: string  = '';   // whatsapp number (blank abhi)

/** Display format (e.g. "+1 305 555 0123") — backward-compatible */
export const SITE_PHONE = SITE_PHONE_PRIMARY;

/** tel: link format (digits only, "+" prefix) */
export const SITE_PHONE_TEL = SITE_PHONE_PRIMARY ? `+${SITE_PHONE_PRIMARY.replace(/\D/g, '')}` : '';

export const SITE_CAGE_CODE = '8ATR9';
export const SITE_CERTIFICATIONS = ['ISO 9001:2015', 'AS9120 Rev B'];

export const SITE_ADDRESS = {
  street: '1360-1362 NW 78th Ave',
  city: 'Doral',
  state: 'FL',
  zip: '33126',
  country: 'US',
} as const;

export const SITE_LOCALE = 'en_US';
export const SITE_TWITTER_HANDLE = '@AeroTurbineSpare';

export const SITE_SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/aeroturbinespare',
  twitter: 'https://twitter.com/aeroturbinespare',
} as const;

/** Global keywords (root layout) */
export const SITE_KEYWORDS = [
  'gas turbine spare parts', 'turbine services', 'GE turbines', 'Siemens turbines',
  'Rolls-Royce turbines', 'Solar Turbines', 'NSN parts', 'CAGE code',
  'aerospace parts', 'turbine components', 'MRO supplies', 'aircraft parts',
  'aerospace procurement', 'military parts', 'jet engine parts',
  'aircraft components', 'aviation parts', 'defense parts',
  'AS9120', 'ISO 9001', 'aerospace distributor',
  'turbine blades', 'landing gear', 'avionics',
  'AOG parts', 'aircraft on ground', 'FAA certified parts',
  'EASA parts', 'CAGE 8ATR9',
] as const;

/** All-in-one site config object (backward compatible with old `siteConfig`) */
export const SITE = {
  url: SITE_URL,
  name: SITE_NAME,
  shortName: SITE_SHORT_NAME,
  description: SITE_DESC,
  ogImage: OG_IMAGE,
  twitterHandle: SITE_TWITTER_HANDLE,
  locale: SITE_LOCALE,
  address: SITE_ADDRESS,
  phone: SITE_PHONE,
  phoneTel: SITE_PHONE_TEL,
  phonePrimary: SITE_PHONE_PRIMARY,
  phoneSecondary: SITE_PHONE_SECONDARY,
  whatsappNumber: SITE_PHONE_WHATSAPP,
  email: SITE_EMAIL,
  cageCode: SITE_CAGE_CODE,
  certifications: [...SITE_CERTIFICATIONS],
} as const;
