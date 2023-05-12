/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.scdn.co"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
