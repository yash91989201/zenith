import { env } from "@/env"
import Stripe from "stripe"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  appInfo: {
    name: "Zenith",
    version: "0.1.0"
  }
})