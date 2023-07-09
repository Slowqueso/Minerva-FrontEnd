/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "minerva123.s3.ap-south-1.amazonaws.com",
      "upload.wikimedia.org",
      "wikimedia.org",
      "*",
      "static.wikia.nocookie.net",
      "assets-global.website-files.com",
    ],
  },
};

module.exports = nextConfig;
