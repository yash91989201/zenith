"use client";
import type { PriceList, SubscriptionType } from "@/lib/types";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SubscriptionForm } from "@/components/agency/billing/subscription-form";

type Props = {
  features: string[];
  buttonCta: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  highlightTitle: string;
  highlightDescription: string;
  customerId: string;
  prices: PriceList["data"];
  planExists: boolean;
};

export function PricingCard({
  features,
  buttonCta,
  title,
  description,
  price,
  duration,
  highlightTitle,
  highlightDescription,
  customerId,
  prices,
  planExists,
}: Props) {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  return (
    <Card className="flex flex-col justify-between lg:w-1/2">
      <div>
        <CardHeader className="flex flex-col justify-between md:!flex-row">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <p className="text-3xl font-bold">
            {formatAmount(price, { notation: "standard" })}
            <small className="text-xs font-light text-muted-foreground">
              {duration}
            </small>
          </p>
        </CardHeader>
        <CardContent>
          <ul>
            {features.map((feature) => (
              <li
                key={feature}
                className="ml-4 list-disc text-muted-foreground"
              >
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      <CardFooter>
        <Card className="w-full">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg border p-4 md:!flex-row">
            <div>
              <p>{highlightTitle}</p>
              <p className="text-sm text-muted-foreground">
                {highlightDescription}
              </p>
            </div>

            <SubscriptionForm
              defaultPriceId={plan as SubscriptionType["plan"]}
              customerId={customerId}
              prices={prices}
              planExists={planExists}
            >
              <Button className="w-full md:w-fit">{buttonCta}</Button>
            </SubscriptionForm>
          </div>
        </Card>
      </CardFooter>
    </Card>
  );
}
