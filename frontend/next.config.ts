import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
    "rc-input",
  ],
  env: {
    NEXT_APP_HOST_DOMAIN: process.env.NEXT_APP_HOST_DOMAIN,
    NEXT_APP_QUERY_URL: process.env.NEXT_APP_QUERY_URL,
  },
};

export default nextConfig;
