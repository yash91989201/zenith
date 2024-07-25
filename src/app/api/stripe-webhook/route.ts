import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
// UTILS
import { env } from '@/env'
import { stripe } from '@/lib/stripe'
import { subscriptionCreated } from '@/server/helpers/stripe'
// TYPES
import type Stripe from 'stripe'
import type { NextRequest } from 'next/server'

const stripeWebhookEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event
  const body = await req.text()
  const stripeSignature = headers().get('Stripe-Signature')

  try {
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET

    if (!stripeSignature || !webhookSecret) {
      throw new Error('🔴 Error Stripe webhook secret or the signature does not exist.')
    }

    stripeEvent = stripe.webhooks.constructEvent(body, stripeSignature, webhookSecret)

    if (!stripeWebhookEvents.has(stripeEvent.type)) {
      throw new Error("Event not found")
    }

    const subscription = stripeEvent.data.object as Stripe.Subscription

    if (
      subscription.metadata.connectAccountPayments &&
      subscription.metadata.connectAccountSubscriptions
    ) {
      throw new Error('SKIPPED FROM WEBHOOK 💳 because subscription was from a connected account not for the application')
    }
    console.log(subscription)
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        if (subscription.status === 'active') {
          await subscriptionCreated({
            subscription,
            customerId: subscription.customer as string
          })
          console.log('CREATED FROM WEBHOOK 💳', subscription)
        } else {
          console.log(
            'SKIPPED AT CREATED FROM WEBHOOK 💳 because subscription status is not active',
            subscription
          )
          break
        }
      }
      default:
        console.log('👉🏻 Unhandled relevant event!', stripeEvent.type)
    }

    return NextResponse.json(
      {
        webhookActionReceived: true,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    // console.log(error)
    return new NextResponse('🔴 Webhook Error', { status: 400 })
  }
}