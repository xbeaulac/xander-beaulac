import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination:
          "https://docs.google.com/document/d/16AFFCZI-t5xr9_4XJtL9KRd-Lrt2qV9i/edit?usp=sharing&ouid=111632038240813900288&rtpof=true&sd=true",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
