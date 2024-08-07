import Link from "next/link";
import Image from "next/image";
// UTILS
import { api } from "@/trpc/server";
import { buttonVariants } from "@/components/ui/button";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Button } from "@ui/button";
// ICONS
import { CheckCircle } from "lucide-react";
import { getStripeOAuthLink, stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { AgencyTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function LaunchpadPage({
  params,
  searchParams,
}: {
  params: { agencyId: string };
  searchParams: { code: string };
}) {
  const agency = await api.agency.getById({ agencyId: params.agencyId });

  if (!agency) return;

  const agencyDetails =
    agency.address &&
    agency.address &&
    agency.agencyLogo &&
    agency.city &&
    agency.companyEmail &&
    agency.companyPhone &&
    agency.country &&
    agency.name &&
    agency.state &&
    agency.zipCode;

  if (!agencyDetails) return;

  const stripeOAuthLink = getStripeOAuthLink({
    accountType: "agency",
    state: `launchpad___${agency.id}`,
  });

  let connectedStripeAccount = agency.connectAccountId === null;

  if (searchParams.code) {
    if (!connectedStripeAccount) {
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: searchParams.code,
        });

        await db
          .update(AgencyTable)
          .set({ connectAccountId: response.stripe_user_id })
          .where(eq(AgencyTable.id, agency.id));

        connectedStripeAccount = true;
      } catch (error) {
        console.log("🔴 Could not connect stripe account");
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-full w-full max-w-3xl">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Let&apos;s get started</CardTitle>
            <CardDescription>
              Follow steps below to setup your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Image
                  src="/appstore.png"
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>Save the website as a shortcut on your mobile device</p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Image
                  src="/stripelogo.png"
                  alt="stripe logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>
                  Connect your Stripe account to accept your payments and see
                  your dashboard
                </p>
              </div>
              {agency.connectAccountId ? (
                <CheckCircle className="size-12 shrink-0 p-2 text-primary" />
              ) : (
                <Link href={stripeOAuthLink} className={buttonVariants()}>
                  Update agency
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Image
                  src={agency.agencyLogo}
                  alt="logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>Fill in all your business details</p>
              </div>
              {agencyDetails ? (
                <CheckCircle className="size-12 shrink-0 p-2 text-primary" />
              ) : (
                <Link
                  href={`/agency/${agency.id}/settings`}
                  className={buttonVariants()}
                >
                  Update agency
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
