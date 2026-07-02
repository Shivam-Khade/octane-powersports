/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: true,
      },
      {
        source: '/m/login',
        destination: '/',
        permanent: true,
      },
      {
        source: '/m/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/product/K&N-OIL-FILTER-KN-204',
        destination: '/product/knn-oilfilter-bikes-superbikes-adventurebikes',
        permanent: true,
      },
      {
        source: '/product/K%26N-OIL-FILTER-KN-204',
        destination: '/product/knn-oilfilter-bikes-superbikes-adventurebikes',
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
