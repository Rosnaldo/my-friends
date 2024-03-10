const path = require('path');
const isProd = process.env.NEXT_ENVIRONMENT === 'production'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  assetPrefix: isProd ? 'dev.my-friends.com' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgbr.imovelwebcdn.com',
        port: '',
        pathname: '*/**',
      },
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
        port: '',
        pathname: '*/**',
      },
    ],
  },
  transpilePackages: ["common-types"],
}

module.exports = withBundleAnalyzer(nextConfig)
