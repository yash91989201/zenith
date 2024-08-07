import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    S3_ENDPOINT: z.string(),
    S3_PORT: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    PUSHER_APP_ID: z.string(),
    PUSHER_APP_KEY: z.string(),
    PUSHER_APP_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    ZENITH_PRODUCT_ID: z.string(),
    STRIPE_WEBHOOK_SECRET_LIVE: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SCHEME: z.string(),
    NEXT_PUBLIC_URL: z.string(),
    NEXT_PUBLIC_DOMAIN: z.string(),
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_CLIENT_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_PLATFORM_ONETIME_FEE: z.string(),
    NEXT_PUBLIC_PLATFORM_AGENY_PERCENT: z.string(),
    NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // CLIENT SIDE ENV'S
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_SCHEME: process.env.NEXT_PUBLIC_SCHEME,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    NEXT_PUBLIC_STRIPE_CLIENT_ID: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_PLATFORM_ONETIME_FEE:
      process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE,
    NEXT_PUBLIC_PLATFORM_AGENY_PERCENT:
      process.env.NEXT_PUBLIC_PLATFORM_AGENY_PERCENT,
    NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT:
      process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT,
    // SERVER SIDE ENV'S
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_PORT: process.env.S3_PORT,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ZENITH_PRODUCT_ID: process.env.ZENITH_PRODUCT_ID,
    STRIPE_WEBHOOK_SECRET_LIVE: process.env.STRIPE_WEBHOOK_SECRET_LIVE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
