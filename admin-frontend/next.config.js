/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/admin',
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
