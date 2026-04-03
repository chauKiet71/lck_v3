/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [
      {
        source: '/0931308082',
        destination: 'https://zalo.me/0931308082',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
