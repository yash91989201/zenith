"use client";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { FunnelType } from "@/lib/types";
// UI
import { ScrollArea } from "@ui/scroll-area";
// CUSTOM COMPONENTS
import { FunnelStepDnd } from "@funnelSteps/funnel-step-dnd";
import { FunnelPagesDnd } from "@funnelSteps/funnel-pages-dnd";
import { StepUpdatePane } from "@funnelSteps/step-update-pane";
import { CreateFunnelStepButton } from "@funnelSteps/create-funnel-step-button";
// ICONS
import { Filter } from "lucide-react";

type Props = {
  funnel: FunnelType;
};

export function FunnelSteps({ funnel }: Props) {
  const { id: funnelId, subAccountId } = funnel;

  const { data: pages = [], isLoading } = api.funnelPage.getAll.useQuery({
    funnelId,
  });

  if (isLoading) {
    return <>funnel steps loading</>;
  }

  return (
    <FunnelPagesDnd
      funnel={funnel}
      funnelPages={pages}
      funnelId={funnelId}
      subAccountId={subAccountId}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 rounded-md bg-card p-3">
          <Filter className="size-6 stroke-[2]" />
          <h2 className="flex-1 text-xl">Funnel Steps</h2>
          <CreateFunnelStepButton />
        </div>

        <div className="flex flex-col gap-3 lg:h-[800px] lg:flex-row">
          <div className="flex flex-col gap-3 rounded-md bg-card p-3 lg:flex-[0.25]">
            <ScrollArea className="flex-1">
              <FunnelStepDnd />
            </ScrollArea>
          </div>

          <aside className="bg-muted lg:flex-[0.75]">
            <StepUpdatePane />
          </aside>
        </div>
      </div>
    </FunnelPagesDnd>
  );
}
