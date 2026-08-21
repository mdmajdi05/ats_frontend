import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/providers/QueryProvider';
import DataRefreshProvider from '@/providers/DataRefreshProvider';
import ChatProvider from '@/components/chat/ChatProvider';
import { NotificationProvider } from '@/hooks/useNotifications';
import NotificationToastHandler from '@/components/notifications/NotificationToastHandler';
import QuickContactDrawer from '@/components/ui/QuickContactDrawer';
import GAClient from '@/components/analytics/GAClient';
import { OrganizationJsonLd, WebsiteJsonLd, FAQJsonLd, LocalBusinessJsonLd, ServiceJsonLd, SpeakableJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SITE_NAME, SITE_SHORT_NAME, SITE_DESC, SITE_DEFAULT_TITLE, SITE_TITLE_TEMPLATE, SITE_KEYWORDS, OG_IMAGE } from '@/lib/constants';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional',
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'optional',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESC,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_NAME }],
  publisher: SITE_NAME,
  category: 'aerospace',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description:
      'Gas turbine spare parts supplier for GE, Siemens, Rolls-Royce & Solar. New, refurbished & serviceable blades, nozzles & combustion parts. 24-hour quotes.',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Turbine Spare Parts Supplier',
    description:
      'GE, Siemens, Rolls-Royce & Solar turbine parts. 24-hour quotes. Worldwide shipping.',
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: '48x48' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: SITE_SHORT_NAME,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: true,
  },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true },
  verification: {
    google: 'Ukz08W_xKDohmTpZtp7l4D0zSfCOqIGrW3kL8RVe3OM',
    other: {
      'msvalidate.01': '9F862232AE6757CA6076FEA30220EEFB',
    },
  },
  other: {
    'google-site-verification': 'Ukz08W_xKDohmTpZtp7l4D0zSfCOqIGrW3kL8RVe3OM',
    'geo.region': 'US',
    'geo.placename': 'United States',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A1628',
  colorScheme: 'dark',
  interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://api.aeroturbinespare.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://api.aeroturbinespare.com" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#4F46E5] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <FAQJsonLd />
        <LocalBusinessJsonLd />
        <ServiceJsonLd />
        <SpeakableJsonLd />
        <QueryProvider>
          <DataRefreshProvider>
            <NotificationProvider>
              {children}
              <NotificationToastHandler />
              <ChatProvider />
              <QuickContactDrawer />
            </NotificationProvider>
          </DataRefreshProvider>
        </QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0A1628',
              color: '#E8EDF2',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00A651', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#E8751A', secondary: '#fff' } },
          }}
        />

        <GAClient />
        <Script id="sw-unregister" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(regs) {
              regs.forEach(function(reg) { reg.unregister(); });
            });
          }
        `}</Script>
      </body>
    </html>
  );
}
