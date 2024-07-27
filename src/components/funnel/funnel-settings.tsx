// UTILS
import { api } from "@/trpc/server";
// TYPES
import type { FunnelWithPagesType } from "@/lib/types";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
// CUSTOM COMPONENTS
import { FunnelForm } from "@/components/funnel/funnel-form";
import { FunnelProductTable } from "@/components/funnel/funnel-product-table";

type Props = {
  subAccountId: string;
  funnel: FunnelWithPagesType;
};

export async function FunnelSettings({ subAccountId, funnel }: Props) {
  //TODO: connect stripe to sell products

  const subAccount = await api.subAccount.getById({ id: subAccountId });

  if (!subAccount) return;

  if (!subAccount.connectAccountId) return;

  const products = await api.stripe.getConnectAccountProducts({
    stripeAccount: subAccount.connectAccountId,
  });

  return (
    <div className="flex flex-col gap-3 xl:flex-row">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {subAccount.connectAccountId ? (
              <FunnelProductTable funnel={funnel} products={products} />
            ) : (
              "Connect your stripe account to sell products."
            )}
          </>
        </CardContent>
      </Card>
      <div className="w-96">
        <FunnelForm funnel={funnel} subAccountId={subAccountId} />
      </div>
    </div>
  );
}

export default FunnelSettings;
