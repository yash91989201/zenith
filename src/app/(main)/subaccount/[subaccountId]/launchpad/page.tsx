import Link from "next/link";
import Image from "next/image";
import { eq } from "drizzle-orm";
// DB TABLES
import { SubAccountTable } from "@/server/db/schema";
// UTILS
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import { stripe } from "@/lib/stripe";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Button } from "@ui/button";
// CUSTOM COMPONENTS
import BlurPage from "@global/blur-page";
// ICONS
import { CheckCircleIcon } from "lucide-react";

type Props = {
  params: {
    subaccountId: string;
  };
  searchParams: {
    state?: string;
    code?: string;
  };
};

export default async function LaunchPadPage({ params, searchParams }: Props) {
  const subAccount = await api.subAccount.getById({ id: params.subaccountId });

  if (!subAccount) return;

  const subAccountDetails =
    subAccount.address &&
    subAccount.subAccountLogo &&
    subAccount.city &&
    subAccount.companyEmail &&
    subAccount.companyPhone &&
    subAccount.country &&
    subAccount.name &&
    subAccount.state;

  let connectedStripeAccount = subAccount.connectAccountId === null;

  if (searchParams.code) {
    if (!connectedStripeAccount) {
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: searchParams.code,
        });

        await db
          .update(SubAccountTable)
          .set({ connectAccountId: response.stripe_user_id })
          .where(eq(SubAccountTable.id, subAccount.id));

        connectedStripeAccount = true;
      } catch (error) {
        console.log("🔴 Could not connect stripe account");
      }
    }
  }

  return (
    <BlurPage>
      <div className="flex flex-col items-center justify-center">
        <div className="h-full w-full max-w-[800px]">
          <Card className="border-none ">
            <CardHeader>
              <CardTitle>Lets get started!</CardTitle>
              <CardDescription>
                Follow the steps below to get your account setup correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex h-20 w-full items-center justify-between rounded-lg border p-3 ">
                <div className="flex items-center gap-3">
                  <Image
                    src="/appstore.png"
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p>Save the website as a shortcut on your mobile devide</p>
                </div>
                <Button>Start</Button>
              </div>
              <div className="flex h-20 w-full items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/stripelogo.png"
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain "
                  />
                  <p>
                    Connect your stripe account to accept payments. Stripe is
                    used to run payouts.
                  </p>
                </div>
                {(subAccount.connectAccountId ?? connectedStripeAccount) ? (
                  <CheckCircleIcon
                    size={50}
                    className=" flex-shrink-0 p-2 text-primary"
                  />
                ) : (
                  <Link
                    className="rounded-md bg-primary px-3 py-2 text-white"
                    href={``}
                  >
                    Start
                  </Link>
                )}
              </div>
              <div className="flex h-20 w-full items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={subAccount.subAccountLogo}
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain p-3"
                  />
                  <p>Fill in all your business details.</p>
                </div>
                {subAccountDetails ? (
                  <CheckCircleIcon
                    size={50}
                    className=" flex-shrink-0 p-2 text-primary"
                  />
                ) : (
                  <Link
                    className="rounded-md bg-primary px-3 py-2 text-white"
                    href={`/subaccount/${params.subaccountId}/settings`}
                  >
                    Start
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlurPage>
  );
}
