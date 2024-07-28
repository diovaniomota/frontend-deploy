const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1'],
  },
  exportTrailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return defaultPathMap;
  },
};
