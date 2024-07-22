"use client";
import { memo, useCallback } from "react";
import { toast } from "sonner";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { LaneDetailType } from "@/lib/types";
// CUSTOM HOOKS
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
import { usePipelineDndUtilityModals } from "@/hooks/use-pipeline-utility-modals";
// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Button } from "@ui/button";
// ICONS
import {
  Edit,
  Trash,
  BringToFront,
  MoreVertical,
  PlusCircleIcon,
  ArrowRightLeft,
} from "lucide-react";

type Props = {
  pipelineId: string;
  subAccountId: string;
  lane: LaneDetailType;
};

export const LaneMenu = memo(({ pipelineId, subAccountId, lane }: Props) => {
  const laneId = lane.id;

  const apiUtils = api.useUtils();
  const { lanes, reorderLane } = usePipelineDnd();
  const { openUpdateLaneModal, openDeleteLaneModal, openCreateTicketModal } =
    usePipelineDndUtilityModals();

  const startIndex = lanes.findIndex((lane) => lane.id === laneId);
  const isMoveLeftDisabled = startIndex === 0;
  const isMoveRightDisabled = startIndex === lanes.length - 1;

  const { data: pipelines = [] } = api.pipeline.getSubAccountPipelines.useQuery(
    {
      subAccountId,
    },
  );

  const { mutateAsync: changeLanePipeline } =
    api.lane.changePipeline.useMutation();

  const switchablePipelines = pipelines.filter(
    (pipeline) => pipeline.id !== pipelineId,
  );

  const moveLeft = useCallback(() => {
    reorderLane({
      startIndex,
      finishIndex: startIndex - 1,
    });
  }, [reorderLane, startIndex]);

  const moveRight = useCallback(() => {
    reorderLane({
      startIndex,
      finishIndex: startIndex + 1,
    });
  }, [reorderLane, startIndex]);

  const changeLanePipelineAction = async (pipelineId: string) => {
    const actionRes = await changeLanePipeline({
      laneId,
      pipelineId,
    });
    if (actionRes.status === "SUCCESS") {
      toast.success(actionRes.message);

      await apiUtils.lane.getDetail.refetch({ pipelineId: lane.pipelineId });
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="size-7">
          <MoreVertical className="size-4 cursor-pointer text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={() => openUpdateLaneModal(lane)}
        >
          <Edit className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={() => openDeleteLaneModal(lane)}
        >
          <Trash className="size-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            <span>Change pipeline</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {switchablePipelines.map((pipeline) => (
                <DropdownMenuItem
                  key={pipeline.id}
                  onClick={() => changeLanePipelineAction(pipeline.id)}
                >
                  {pipeline.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <BringToFront className="mr-2 h-4 w-4" />
            <span>Reorder</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={moveLeft}
                disabled={isMoveLeftDisabled}
              >
                Move left
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={moveRight}
                disabled={isMoveRightDisabled}
              >
                Move right
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={() => openCreateTicketModal(lane)}
        >
          <PlusCircleIcon className="size-4" />
          Create Ticket
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

LaneMenu.displayName = "Lane drop down menu";
