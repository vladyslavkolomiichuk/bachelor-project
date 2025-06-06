/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "books.google.com" },
      { hostname: "covers.openlibrary.org" },
      { hostname: "images.isbndb.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "300mb",
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias.canvas = false;
    }
    return config;
  },
};

export default nextConfig;
