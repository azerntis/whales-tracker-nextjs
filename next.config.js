/** @type {import('next').NextConfig} */
const withLess = require("next-with-less");

const nextConfig = {};

module.exports = withLess({
  lessLoaderOptions: {
    /* ... */
  },
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});
