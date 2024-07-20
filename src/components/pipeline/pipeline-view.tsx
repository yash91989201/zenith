"use client";

import type { PipelineType } from "@/lib/types";
import { api } from "@/trpc/react";
import { Flag } from "lucide-react";

import { CreateLaneButton } from "@/components/pipeline/create-lane-button";
import { PipelineLane } from "@/components/pipeline/pipeline-lane";
import { PipelineUtilityModals } from "@/components/pipeline/pipeline-utility-modals";
import { PipelineDndProvider } from "@/providers/pipeline-dnd-provider";

type Props = {
  pipelineId: string;
  subAccountId: string;
  pipeline: PipelineType;
};

export function PipelineView({ pipeline, pipelineId, subAccountId }: Props) {
  const { data: lanes = [] } = api.lane.getDetail.useQuery({
    pipelineId,
  });

  return (
    <PipelineDndProvider pipelineId={pipelineId} subAccountId={subAccountId}>
      <div className="animate-automation-zoom-in rounded-xl bg-white/60 p-3 dark:bg-background/60">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipeline.name}</h1>
          <CreateLaneButton />
        </div>
        <div className="flex w-max gap-3 p-3 pb-6">
          {lanes.map((lane) => (
            <PipelineLane
              key={lane.id}
              lane={lane}
              tickets={lane.tickets}
              subAccountId={subAccountId}
              pipelineId={pipelineId}
            />
          ))}
        </div>
        {lanes.length === 0 && (
          <div className="flex w-full items-center justify-center ">
            <div className="opacity-100">
              <Flag className="size-48 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <PipelineUtilityModals />
    </PipelineDndProvider>
  );
}
