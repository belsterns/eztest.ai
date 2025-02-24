/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: '/backend/api/v1/:path*' },
      { source: '/:path*', destination: '/frontend/pages/:path*' },
      { source: '/assets/:path*', destination: '/frontend/assets/:path*' }
    ];
  }
};

export default nextConfig;

