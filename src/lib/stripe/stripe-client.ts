import { env } from "@/env"
import { loadStripe } from "@stripe/stripe-js"
import type { Stripe } from "@stripe/stripe-js"

let stripe: Stripe | null

export async function getStripe(connectedAccountId?: string) {
  if (!stripe) {
    stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
      stripeAccount: connectedAccountId
    })
  }
  return stripe
}