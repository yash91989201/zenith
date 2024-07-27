import { toast } from "sonner";
import { useMemo, useState, useTransition } from "react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { PaymentElement, useElements } from "@stripe/react-stripe-js";
// SCHEMAS
// UTILS
import { api } from "@/trpc/react";
import { cn, formatAmount } from "@/lib/utils";
import { getStripe } from "@/lib/stripe/stripe-client";
// TYPES
import type { PriceList, SubscriptionType } from "@/lib/types";
import type { StripeElementsOptions } from "@stripe/stripe-js";
// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/card";
// ICONS
import { Loader2 } from "lucide-react";
// CONSTANTS
import { PRICING_CARDS } from "@/constants";

type Props = {
  defaultPriceId: SubscriptionType["plan"];
  customerId: string;
  planExists: boolean;
  prices: PriceList["data"];
  children: React.ReactNode;
};

export function SubscriptionForm({
  defaultPriceId,
  prices,
  planExists,
  customerId,
  children,
}: Props) {
  const [selectedPriceId, setSelectedPriceId] =
    useState<SubscriptionType["plan"]>(defaultPriceId);

  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ subscriptionId: "", clientSecret: "" });

  const { mutateAsync: createSubscription, isPending: creatingSubscription } =
    api.stripe.createSubscription.useMutation();

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "flat",
      },
    }),
    [subscription],
  );

  const handleCreateSubscription = async (
    priceId: SubscriptionType["plan"],
  ) => {
    setSelectedPriceId(priceId);
    const actionRes = await createSubscription({
      customerId,
      priceId,
    });

    if (actionRes.status === "SUCCESS" && actionRes.data !== undefined) {
      setSubscription(actionRes.data);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage your plan</DialogTitle>
          <DialogDescription>
            You can change your plan any time from the billing page
          </DialogDescription>
        </DialogHeader>
        <div className="border-none transition-all">
          <div className="flex flex-col gap-4">
            {prices?.map((price) => (
              <Card
                onClick={() =>
                  handleCreateSubscription(price.id as SubscriptionType["plan"])
                }
                key={price.id}
                className={cn(
                  selectedPriceId === price.id && "border-primary",
                  "relative cursor-pointer transition-all",
                )}
              >
                <CardHeader>
                  <CardTitle className="space-y-1.5">
                    {price.unit_amount
                      ? formatAmount(price.unit_amount / 100, {
                          notation: "standard",
                        })
                      : "0"}
                    <p className="text-sm text-muted-foreground">
                      {price.nickname}
                    </p>
                  </CardTitle>
                  <CardDescription>
                    {
                      PRICING_CARDS.find((p) => p.priceId === price.id)
                        ?.description
                    }
                  </CardDescription>
                </CardHeader>
                {selectedPriceId === price.id && (
                  <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </Card>
            ))}

            {creatingSubscription && (
              <div className="flex h-40 w-full items-center justify-center">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}

            {options.clientSecret && !planExists && (
              <>
                <Separator />
                <h1 className="text-xl">Payment Method</h1>
                <Elements stripe={getStripe()} options={options}>
                  <PaymentForm selectedPriceId={selectedPriceId} />
                </Elements>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PaymentForm = ({
  selectedPriceId,
}: {
  selectedPriceId: string | null | undefined;
}) => {
  const elements = useElements();
  const stripeHook = useStripe();
  const [priceError, setPriceError] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPriceId) {
      setPriceError("You need to select a plan to subscribe.");
      return;
    }
    setPriceError("");
    if (!stripeHook || !elements) return;

    startTransition(async () => {
      const { error } = await stripeHook.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
        },
      });

      if (error) {
        toast.error("Payment failed", {
          description: error.message,
        });
        return;
      }

      toast.success("Payment successful", {
        description: "Your payment has been successfully processed. ",
      });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <small className="text-destructive">{priceError}</small>
      <PaymentElement />
      <Button
        disabled={!stripeHook || isPending}
        className="mt-4 w-full gap-1.5"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Processing Payment</span>
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
};
