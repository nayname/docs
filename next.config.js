/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cosmos.network'],
    formats: ['image/avif', 'image/webp'],
  },
  i18n: {
    locales: ['en', 'en-US'],
    defaultLocale: 'en',
    localeDetection: false
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
}

export default nextConfig 