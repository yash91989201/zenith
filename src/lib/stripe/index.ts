import Stripe from "stripe"
// UTILS
import { env } from "@/env"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  appInfo: {
    name: "Zenith",
    version: "0.1.0"
  }
})

export function getStripeOAuthLink({
  state,
  accountType,
}: {
  state: string;
  accountType: "agency" | "subaccount";
}) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${env.NEXT_PUBLIC_URL}/${accountType}&state=${state}`
}