/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

export default nextConfig;
