/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["puppeteer", "pdf-parse"],
  },
  webpack: (config) => {
    // Add support for native node modules
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      http: false,
      https: false,
      child_process: false,
    };
    
    return config;
  },
};

module.exports = nextConfig; 