/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  // Add webpack configuration for better chunk handling
  webpack: (config, { isServer }) => {
    // Optimize chunks for production
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
          },
        },
      }
    }
    return config
  },
  // Optimize for production builds
  poweredByHeader: false,
  compress: true,
  // Improve error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.githubusercontent.com"
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "nerd-nest.harshalranjhani.in",
      },
    ]
  }
}
