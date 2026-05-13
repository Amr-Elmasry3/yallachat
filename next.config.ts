import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        "https://doot-light.react.themesbrand.com/static/media/pattern-05.ffd181cdf9a08b200998.png",
      ),
      new URL(
        "https://www.react.pixelstrap.net/chatzy/static/media/02.97f109c811d5f291b6ac.png",
      ),
      new URL("https://res.cloudinary.com/**"),
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
