"use client";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { FunnelType } from "@/lib/types";
// CUSTOM COMPONENTS
import { FunnelStepsEditor } from "@/components/funnel/funnel-steps-editor";
import { CreateFunnelStepButton } from "@/components/funnel/create-funnel-step-button";
// ICONS
import { Filter } from "lucide-react";

type Props = {
  funnel: FunnelType;
};

export function FunnelPagesView({ funnel }: Props) {
  const { id: funnelId, subAccountId } = funnel;

  const { data: pages = [], isLoading } = api.funnelPage.getAll.useQuery({
    funnelId,
  });

  if (isLoading) {
    return <>funnel steps loading</>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 rounded-md bg-card p-3">
        <Filter className="size-6 stroke-[2]" />
        <h2 className="flex-1 text-xl">Funnel Steps</h2>
        <CreateFunnelStepButton
          funnelId={funnelId}
          subAccountId={subAccountId}
        />
      </div>

      <FunnelStepsEditor funnel={funnel} pages={pages} />
    </div>
  );
}
