/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cryptologos.cc",
        pathname: "/logos/**",
      },
    ],
  },
};

module.exports = nextConfig;
