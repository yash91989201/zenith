import Link from "next/link";
import { redirect } from "next/navigation";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { buttonVariants } from "@ui/button";
// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
// CUSTOM COMPONNETS
import BlurPage from "@global/blur-page";
import { FunnelSettings } from "@/components/funnel/funnel-settings";
import { FunnelPagesView } from "@/components/funnel/funnel-pages-view";
// ICONS
import { CircleChevronLeft } from "lucide-react";

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

  void api.funnelPage.getAll.prefetch({ funnelId: funnel.id });

  return (
    <BlurPage>
      <Tabs defaultValue="steps" className="w-full">
        <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center">
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
            <CircleChevronLeft className="size-6 stroke-[1.5]" />
          </Link>
          <h1 className="flex-1 py-3 text-3xl">{funnel.name}</h1>
          <TabsList className="grid w-full grid-cols-2 bg-transparent lg:w-1/4 ">
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="steps">
          <FunnelPagesView funnel={funnel} />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings funnel={funnel} />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
}
