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
      }
    ];
  }
};

export default nextConfig;
