import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="relative flex h-full w-full flex-col items-center justify-center px-6 md:px-0 md:pt-36">
        <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)]" />

        <p className="text-center">Run your agency, in one place</p>
        <div className="relative bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          <h1 className="text-center text-9xl font-bold md:text-[300px] ">
            Plura
          </h1>
        </div>
        <div className="relative flex items-center justify-center md:-mt-[70px]">
          <Image
            src="/assets/preview.png"
            alt="preview"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-muted"
          />
          <div className="absolute bottom-0 left-0 right-0 top-1/2 z-10 bg-gradient-to-t dark:from-background"></div>
        </div>
      </section>
      <section className="-mt-20 flex flex-col items-center justify-center gap-4 md:mt-20 xl:mt-48">
        <h2 className="text-center text-4xl">Choose what fits you right</h2>
        <p className="max-w-md text-center text-muted-foreground">
          Our straightforward pricing plans are tailored to meet your needs. If
          you are not ready to commit you can get started for free
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {pricingCards.map((card) => (
            <Card
              key={card.priceId}
              className={cn(
                "mx-auto w-[300px] flex-col justify-between",
                card.title === "Unlimited Saas" && "border-2 border-primary",
              )}
            >
              <CardHeader>
                <CardTitle
                  className={cn(
                    card.title !== "Unlimited Saas" && "text-muted-foreground",
                  )}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold ">{card.price}</span>
                {card.price !== "Free" && (
                  <span className="text-4xl font-bold ">/m</span>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={buttonVariants({
                    variant: "default",
                    className: cn(
                      "w-full font-medium",
                      card.title !== "Unlimited Saas" && "bg-muted-foreground",
                    ),
                  })}
                >
                  Start now
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
