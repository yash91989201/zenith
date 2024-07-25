import { eq } from "drizzle-orm"
// DB TABLES
import { AgencyTable, SubscriptionTable } from "@/server/db/schema"
// UTILS
import { db } from "@/server/db"
// TYPES
import type Stripe from "stripe"

export async function subscriptionCreated({ subscription, customerId }: {
  subscription: Stripe.Subscription,
  customerId: string
}) {
  try {
    const agency = await db.query.AgencyTable.findFirst({
      where: eq(AgencyTable.customerId, customerId),
      with: {
        subAccounts: true,
      }
    })

    if (!agency) {
      throw new Error('Could not find and agency to upsert the subscription')
    }

    const agencySubscription = await db.query.SubscriptionTable.findFirst({
      where: eq(SubscriptionTable.agencyId, agency.id)
    })

    const subscriptionData = {
      active: subscription.status === 'active',
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
      /* @ts-expect-error payment intent is available */
      priceId: subscription.plan.id ?? "",
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
      subscriptionId: subscription.id,
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
      /* @ts-expect-error payment intent is available */
      plan: subscription.plan.id,
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
    }

    if (!agencySubscription) {
      const [createAgencySubscriptionQuery] = await db.insert(SubscriptionTable).values(subscriptionData)

      if (createAgencySubscriptionQuery.affectedRows === 0) throw new Error("")

      return {
        status: "SUCCESS",
        message: "Stripe subscription created"
      }
    }

    const [updateAgencySubscriptionQuery] = await db
      .update(SubscriptionTable)
      .set(subscriptionData)
      .where(
        eq(SubscriptionTable.agencyId, agency.id)
      )

    if (updateAgencySubscriptionQuery.affectedRows === 0) throw new Error("")

    return {
      status: "SUCCESS",
      message: "Stripe subscription created"
    }
  } catch (error) {
    return {
      status: "FAILED",
      message: "Unable to create subscription"
    }
  }
}