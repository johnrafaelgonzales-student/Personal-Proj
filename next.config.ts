import type {NextConfig} from 'next';

/**
 * @type {import('next').NextConfig}
 * This object holds the configuration for the Next.js application.
 */
const nextConfig: NextConfig = {
  /* config options here */

  // TypeScript configuration
  typescript: {
    // Setting this to true allows the project to build even if there are TypeScript errors.
    // This is useful during development but should be used with caution in production.
    ignoreBuildErrors: true,
  },
  // ESLint configuration
  eslint: {
    // Setting this to true tells Next.js not to run ESLint during the build process.
    // Linting can be done separately as part of a CI/CD pipeline.
    ignoreDuringBuilds: true,
  },
  // Image optimization configuration
  images: {
    // Defines a list of allowed hostnames for externally hosted images.
    // This is a security measure to prevent loading images from untrusted sources.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
