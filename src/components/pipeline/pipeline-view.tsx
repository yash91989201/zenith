"use client";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { PipelineType } from "@/lib/types";
// CUSTOM HOOKS
import { PipelineDnd } from "@pipelineDnd/index";
import { CreateLaneButton } from "@/components/pipeline/pipeline-utility-modals/create-lane-button";
// ICONS
import { Flag } from "lucide-react";

type Props = {
  pipelineId: string;
  subAccountId: string;
  pipeline: PipelineType;
};

export function PipelineView({ pipeline, pipelineId, subAccountId }: Props) {
  const { data: lanes = [], isLoading } = api.lane.getDetail.useQuery({
    pipelineId,
  });

  return (
    <div className="animate-automation-zoom-in space-y-3 rounded-xl bg-white/60 p-3 dark:bg-background/60">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{pipeline.name}</h1>
        <CreateLaneButton />
      </div>
      {isLoading ? (
        <>loading skeleton here</>
      ) : (
        <PipelineDnd
          lanes={lanes}
          subAccountId={subAccountId}
          pipelineId={pipelineId}
        />
      )}

      {!isLoading && lanes.length === 0 && (
        <div className="flex w-full items-center justify-center ">
          <div className="opacity-100">
            <Flag className="size-48 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
