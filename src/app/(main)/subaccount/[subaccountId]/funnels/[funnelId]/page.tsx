import BlurPage from "@global/blur-page";
import { buttonVariants } from "@ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { FunnelSteps } from "@/components/funnel/funnel-steps";
import { FunnelSettings } from "@/components/funnel/funnel-settings";

type Props = {
  params: {
    subaccountId: string;
    funnelId: string;
  };
};

export default async function FunnelPage({ params }: Props) {
  const funnel = await api.funnel.getById({ funnelId: params.funnelId });

  if (!funnel) {
    return redirect(`/subaccount/${params.subaccountId}/funnels`);
  }

  return (
    <BlurPage>
      <Tabs defaultValue="steps" className="w-full">
        <div className="flex items-center gap-3">
          <Link
            className={cn(
              buttonVariants({
                variant: "link",
                size: "icon",
              }),
              "text-muted-foreground hover:text-primary hover:no-underline",
            )}
            href={`/subaccount/${params.subaccountId}/funnels`}
          >
            <CircleChevronLeft className="size-9 stroke-[1.5]" />
          </Link>
          <h1 className="flex-1 py-3 text-3xl">{funnel.name}</h1>
          <TabsList className="grid  w-1/4 grid-cols-2 bg-transparent ">
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnel}
            pages={funnel.funnelPages}
            funnelId={params.funnelId}
            subAccountId={params.subaccountId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            funnel={funnel}
            subAccountId={params.subaccountId}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
}
