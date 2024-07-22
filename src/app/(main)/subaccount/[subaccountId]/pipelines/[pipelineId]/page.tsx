import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// PROVIDERS
import { PipelineUtilityModalsProvider } from "@/providers/pipeline-utility-modals-provider";
// CUSTOM COMPONENTS
import { PipelineView } from "@/components/pipeline/pipeline-view";
import PipelineSettings from "@/components/pipeline/pipeline-settings";
import { PipelineInfoBar } from "@/components/pipeline/pipeline-info-bar";
import { PipelineUtilityModals } from "@/components/pipeline/pipeline-utility-modals";

type Props = {
  params: {
    subaccountId: string;
    pipelineId: string;
  };
};

export default async function PipelinePage({ params }: Props) {
  const pipeline = await api.pipeline.getById({ id: params.pipelineId });

  if (!pipeline) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);
  }

  await api.pipeline.getSubAccountPipelines.prefetch({
    subAccountId: params.subaccountId,
  });

  await api.lane.getDetail.prefetch({ pipelineId: params.pipelineId });

  return (
    <PipelineUtilityModalsProvider
      pipelineId={params.pipelineId}
      subAccountId={params.subaccountId}
    >
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="mb-4 h-16 w-full justify-between rounded-none border-b-2 bg-transparent px-0">
          <PipelineInfoBar
            pipelineId={params.pipelineId}
            subAccountId={params.subaccountId}
          />
          <div>
            <TabsTrigger value="view" className="w-40 bg-transparent">
              Pipeline View
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-40 bg-transparent">
              Settings
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="view">
          <PipelineView
            pipeline={pipeline}
            pipelineId={params.pipelineId}
            subAccountId={params.subaccountId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <PipelineSettings
            pipelineId={params.pipelineId}
            subAccountId={params.subaccountId}
          />
        </TabsContent>
      </Tabs>
      <PipelineUtilityModals />
    </PipelineUtilityModalsProvider>
  );
}
