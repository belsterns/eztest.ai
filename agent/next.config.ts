import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false, // Disable body parsing for GitHub webhooks
  },
};

export default nextConfig;
