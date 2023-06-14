/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "minerva123.s3.ap-south-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
