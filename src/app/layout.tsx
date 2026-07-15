import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/providers/QueryProvider';
import DataRefreshProvider from '@/providers/DataRefreshProvider';
import ChatProvider from '@/components/chat/ChatProvider';
import { NotificationProvider } from '@/hooks/useNotifications';
import NotificationToastHandler from '@/components/notifications/NotificationToastHandler';
import { OrganizationJsonLd, WebsiteJsonLd, FAQJsonLd } from '@/components/seo/JsonLd';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aeroturbinespare.com'),
  title: {
    default: 'Global Gas Turbine Services & Spare Parts Supplier | AeroTurbineSpare',
    template: '%s | AeroTurbineSpare',
  },
  description:
    'Global supplier of gas turbine spare parts and services for GE, Siemens, Rolls-Royce & Solar Turbines platforms. NSN/CAGE-referenced parts, 24-hr quotes, shipping to USA, Russia & 150+ countries.',
  keywords: [
    'gas turbine spare parts', 'turbine services', 'GE turbines', 'Siemens turbines',
    'Rolls-Royce turbines', 'Solar Turbines', 'NSN parts', 'CAGE code',
    'aerospace parts', 'turbine components', 'MRO supplies', 'aircraft parts',
    'aerospace procurement', 'military parts', 'jet engine parts',
    'aircraft components', 'aviation parts', 'defense parts',
    'AS9120', 'ISO 9001', 'aerospace distributor',
    'turbine blades', 'landing gear', 'avionics',
    'AOG parts', 'aircraft on ground', 'FAA certified parts',
    'EASA parts', 'CAGE 8ATR9',
  ],
  authors: [{ name: 'AeroTurbineSpare' }],
  publisher: 'AeroTurbineSpare',
  category: 'aerospace',
  openGraph: {
    type: 'website',
    siteName: 'AeroTurbineSpare',
    title: 'Global Gas Turbine Services & Spare Parts Supplier',
    description:
      'Sourcing gas turbine spare parts and field services for GE, Siemens, Rolls-Royce, Solar Turbines & more. NSN/CAGE-referenced inventory, 24-hr quotes, worldwide shipping.',
    url: 'https://aeroturbinespare.com/',
    locale: 'en_US',
    images: [{ url: '/images/og-cover.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Gas Turbine Services & Spare Parts Supplier',
    description:
      'Sourcing gas turbine spare parts and field services for GE, Siemens, Rolls-Royce, Solar Turbines & more. NSN/CAGE-referenced, worldwide shipping.',
    images: ['/images/og-cover.svg'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'Ukz08W_xKDohmTpZtp7l4D0zSfCOqIGrW3kL8RVe3OM',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <FAQJsonLd />
        <QueryProvider>
          <DataRefreshProvider>
            <NotificationProvider>
              {children}
              <NotificationToastHandler />
              <ChatProvider />
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

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QH0HYG18PL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QH0HYG18PL');
          `}
        </Script>
      </body>
    </html>
  );
}
