/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  webpack: (config) => {
    // eslint-disable-next-line
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    // eslint-disable-next-line
    return config;
  },
  output: "standalone",
};

export default config;
