/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/auth/:path*', destination: '/backend/api/v1/auth/:path*' },
      { source: '/api/v1/:path*', destination: '/backend/api/v1/:path*' },
      { source: '/:path*', destination: '/frontend/pages/:path*' },
      { source: '/assets/:path*', destination: '/frontend/assets/:path*' }
    ];
  },
  reactStrictMode: true,
  output: "standalone",
};

export default nextConfig;

