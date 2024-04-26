/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/cleansnip",
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "no-cors",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
