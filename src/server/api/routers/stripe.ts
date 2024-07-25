import { eq } from "drizzle-orm";
// DB SCHEMAS
import { AgencyTable, SubscriptionTable, } from "@/server/db/schema";
// SCHEMAS
import {
  CreateCustomerSchema,
  CreateSubscriptionSchema,
  CreateCheckoutSessionSchema,
  CreateStripeSubscriptionSchema,
  GetConnectAccountProductsSchema
} from "@/lib/schema";
// UTILS
import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { SubscriptionInsertType } from "@/lib/types";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.input(CreateCheckoutSessionSchema).mutation(async ({ input }) => {
    const { prices, subAccountConnectAccountId } = input

    const subscriptionPrice = prices.find((price) => price.recurring)

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        line_items: prices.map(price => ({
          price: price.productId,
          quantitiy: 1
        })),
        ...(
          subscriptionPrice === undefined ?
            {
              payment_intent_data: {
                metadata: { connectAccountPayments: 'true' },
                application_fee_amount:
                  Number(env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE) * 100,
              },
              mode: subscriptionPrice !== undefined ? 'subscription' : 'payment',
              ui_mode: 'embedded',
              redirect_on_completion: 'never',
            }
            :
            {
              subscription_data: {
                metadata: {
                  connectAccountSubscriptions: "true",
                },
                application_fee_percent: Number(env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT)
              }
            }
        ),
      },
        {
          stripeAccount: subAccountConnectAccountId
        }
      )

      if (checkoutSession.client_secret === null) throw new Error()

      return {
        status: "SUCCESS",
        message: "Checkout session created",
        data: {
          clientSecret: checkoutSession.client_secret
        }
      }
    } catch (error) {
      return {
        status: "FAILED",
        message: "Unable to create checkout session"
      }
    }
  }),

  getConnectAccountProducts: protectedProcedure.input(GetConnectAccountProductsSchema).query(async ({ input }) => {
    const products = await stripe.products.list({
      limit: 50,
      expand: ["data.default_price"]
    }, {
      stripeAccount: input.stripeAccount
    })

    return products.data
  }),

  createCustomer: protectedProcedure.input(CreateCustomerSchema).mutation(async ({ input }) => {
    try {
      const customer = await stripe.customers.create({
        name: input.name,
        email: input.email,
        address: input.address,
        shipping: input.shipping,
      })
      return {
        status: "SUCCESS",
        message: "Customer created",
        data: {
          customerId: customer.id
        }
      }
    } catch (error) {
      return {
        status: "FAILED",
        message: "Unable to create customer"
      }
    }
  }),

  createSubscription: protectedProcedure.input(CreateSubscriptionSchema).mutation(async ({ ctx, input }) => {
    try {
      const agency = await ctx.db.query.AgencyTable.findFirst({
        where: eq(AgencyTable.customerId, input.customerId),
        with: {
          subscription: true
        }
      })

      if (agency?.subscription?.active) {

        if (agency?.subscription.subscriptionId) {
          const currentSubscriptionDetails = await stripe.subscriptions.retrieve(agency?.subscription.subscriptionId)

          if (!currentSubscriptionDetails) throw new Error("")

          const subscription = await stripe.subscriptions.update(
            agency?.subscription.subscriptionId,
            {
              items: [
                {
                  id: currentSubscriptionDetails.items.data[0]?.id ?? "",
                  deleted: true,
                },
                {
                  price: input.priceId ?? undefined
                }
              ],
              expand: ["latest_invoice.payment_intent"]
            }
          )

          return {
            status: "SUCCESS",
            message: "Subscription created",
            data: {
              subscriptionId: subscription.id,
              /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
              /* @ts-expect-error payment intent is available */
              clientSecret: subscription?.latest_invoice?.payment_intent?.client_secret
              /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
            }
          }
        }

        return {
          status: "FAILED",
          message: "No subscription exists"
        }
      } else {
        const subscription = await stripe.subscriptions.create({
          customer: input.customerId,
          items: [
            {
              price: input.priceId ?? undefined,
            }
          ],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"]
        })

        return {
          status: "SUCCESS",
          message: "Subscription created",
          data: {
            subscriptionId: subscription.id,
            /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
            /* @ts-expect-error payment intent is available */
            clientSecret: subscription?.latest_invoice?.payment_intent?.client_secret
            /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
          }
        }
      }
    } catch (error) {
      return {
        status: "FAILED",
        message: "Unable to create subscription, try again"
      }
    }
  }),

  upsertSubscription: protectedProcedure.input(CreateStripeSubscriptionSchema).mutation(async ({ ctx, input }): ProcedureStatus<SubscriptionInsertType> => {
    const { customerId, subscription } = input
    try {
      const agency = await ctx.db.query.AgencyTable.findFirst({
        where: eq(AgencyTable.customerId, customerId)
      })
      if (!agency) throw new Error("No agency found")

      const subscriptionData: SubscriptionInsertType = {
        active: subscription.status === "active",
        agencyId: agency.id,
        customerId,
        currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
        subscriptionId: subscription.id,
        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        /* @ts-expect-error payment intent is available */
        priceId: subscription.plan.id,
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        /* @ts-expect-error payment intent is available */
        plan: subscription.plan.id as SubscriptionInsertType["plan"],
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
      }

      const existingSubscription = await ctx.db.query.SubscriptionTable.findFirst({
        where: eq(SubscriptionTable.agencyId, agency.id)
      })

      if (!existingSubscription) {
        const [createSubscriptionQuery] = await ctx.db.insert(SubscriptionTable).values(subscriptionData)

        if (createSubscriptionQuery.affectedRows === 0) throw new Error("Creating subscription failed")

        return {
          status: "SUCCESS",
          message: "done"
        }
      }

      const [updateSubscriptionQuery] = await ctx.db.update(SubscriptionTable).set(subscriptionData).where(eq(SubscriptionTable.id, subscription.id))

      if (updateSubscriptionQuery.affectedRows === 0) throw new Error("Updating subscription failed")

      return {
        status: "SUCCESS",
        message: "done"
      }

    } catch (error) {
      return procedureError<SubscriptionInsertType>(error)
    }
  }),
});