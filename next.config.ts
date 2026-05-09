import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'maps.googleapis.com' }],
  },
}

export default nextConfig
