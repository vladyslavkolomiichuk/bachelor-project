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
};

export default nextConfig;
