import { format } from "date-fns";
// UTILS
import { env } from "@/env";
import { api } from "@/trpc/server";
import { stripe } from "@/lib/stripe";
import { cn, formatAmount } from "@/lib/utils";
// UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Separator } from "@ui/separator";
// CUSTOM COMPONENTS
import { PricingCard } from "@/components/agency/billing/pricing-card";
// CONSTANTS
import { ADD_ON_PRODUCTS, PRICING_CARDS } from "@/constants";

type Props = {
  params: {
    agencyId: string;
  };
};

export default async function BillingPage({ params }: Props) {
  const agency = await api.agency.getSubscription({
    agencyId: params.agencyId,
  });

  if (!agency) return null;

  const prices = await stripe.prices.list({
    product: env.ZENITH_PRODUCT_ID,
  });

  const addOns = await stripe.products.list({
    ids: ADD_ON_PRODUCTS.map((product) => product.id),
    expand: ["data.default_price"],
  });

  const currentPlanDetails = PRICING_CARDS.find(
    (pricing) => pricing.priceId === agency.subscription?.priceId,
  );

  const charges = await stripe.charges.list({
    limit: 50,
    customer: agency.customerId,
  });

  const allCharges = [
    ...charges.data.map((charge) => ({
      description: charge.description,
      id: charge.id,
      date: format(new Date(charge.created * 1000), "DD,MMM,yy"),
      status: "Paid",
      amount: formatAmount(charge.amount * 100),
    })),
  ];

  const subscriptionActive = agency.subscription?.active === true;

  return (
    <>
      <h1 className="py-3 text-4xl">Billing</h1>
      <Separator />
      <h2 className="mt-3 text-xl">Current Plan</h2>
      <div className="my-3 flex flex-col justify-between gap-6 lg:flex-row">
        <PricingCard
          planExists={subscriptionActive}
          prices={prices.data}
          buttonCta={subscriptionActive ? "Change Plan" : "Get Started"}
          customerId={
            agency.subscription?.customerId !== undefined
              ? agency.subscription?.customerId
              : (agency.customerId ?? "")
          }
          description={
            subscriptionActive
              ? (currentPlanDetails?.description ?? "Let's get started")
              : "Let's get started, pick a plan that's best for you"
          }
          duration="/ mo"
          features={
            agency.subscription?.active === true
              ? (currentPlanDetails?.features ?? [])
              : (currentPlanDetails?.features ??
                PRICING_CARDS.find((pricing) => pricing.title === "Starter")
                  ?.features ??
                [])
          }
          highlightDescription={
            subscriptionActive
              ? "Want to upgrade your plan? You can do this here. If you have further questions you can contact support@zenith.com"
              : ""
          }
          highlightTitle="Plan Options"
          price={
            subscriptionActive === true ? (currentPlanDetails?.price ?? 0) : 0
          }
          title={
            subscriptionActive
              ? (currentPlanDetails?.title ?? "Starter")
              : "Starter"
          }
        />

        {addOns.data.map((addOn) => (
          <PricingCard
            planExists={agency.subscription?.active === true}
            prices={prices.data}
            customerId={agency.customerId ?? ""}
            key={addOn.id}
            price={
              //@ts-expect-error stripe error
              addOn.default_price?.unit_amount
                ? //@ts-expect-error stripe error
                  addOn.default_price.unit_amount / 100
                : 0
            }
            buttonCta="Subscribe"
            description="Dedicated support line & teams channel for support"
            duration="/ month"
            features={[]}
            title="24/7 priority support"
            highlightTitle="Get support now!"
            highlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))}
      </div>

      <h2 className="py-3 text-xl">Payment History</h2>
      <Table className="rounded-md border-[1px] border-border bg-card">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead className="w-[200px]">Invoice Id</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="w-[200px]">Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="truncate font-medium">
          {allCharges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>{charge.description}</TableCell>
              <TableCell className="text-muted-foreground">
                {charge.id}
              </TableCell>
              <TableCell>{charge.date}</TableCell>
              <TableCell>
                <p
                  className={cn(
                    charge.status.toLowerCase() === "paid" &&
                      "text-emerald-500",
                    charge.status.toLowerCase() === "pending" &&
                      "text-orange-600",
                    charge.status.toLowerCase() === "failed" && "text-red-600",
                  )}
                >
                  {charge.status.toUpperCase()}
                </p>
              </TableCell>
              <TableCell className="text-right">{charge.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
