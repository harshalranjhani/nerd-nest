/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com'
      }
    ]
  }
}
