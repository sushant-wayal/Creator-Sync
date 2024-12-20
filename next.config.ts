import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '**'
      }
    ]
  }
};

export default nextConfig;
