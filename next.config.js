/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude test files and directories
    config.module.rules.push({
      test: /\.test\.(js|ts|jsx|tsx)$/,
      use: 'null-loader',
    });

    return config;
  },
}

module.exports = nextConfig 