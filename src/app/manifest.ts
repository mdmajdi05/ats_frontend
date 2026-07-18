import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AeroTurbineSpare',
    short_name: 'AeroTurbine',
    description: 'Global supplier of gas turbine spare parts',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1628',
    theme_color: '#4F46E5',
    icons: [
      { src: '/logo.png', sizes: '192x192', type: 'image/png' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
