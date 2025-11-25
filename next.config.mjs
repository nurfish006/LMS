/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: true,
    appIsrStatus: false,
  },
  experimental: {
    allowedOrigins: ['*'],
  },
}

export default nextConfig
