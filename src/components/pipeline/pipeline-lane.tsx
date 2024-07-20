"use client";
import { useMemo } from "react";
// UTILS
import { formatAmount, randomColor } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { LaneDetailType, TicketAndTagsType } from "@/lib/types";
// UI
import { Badge } from "@ui/badge";
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
// CUSTOM COMPONENTS
import { PipelineTicket } from "@/components/pipeline/pipeline-ticket";
// ICONS
import { Button } from "@/components/ui/button";
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
import {
  ArrowRightLeft,
  Edit,
  MoreVertical,
  PlusCircleIcon,
  Trash,
} from "lucide-react";

type Props = {
  pipelineId: string;
  subAccountId: string;
  lane: LaneDetailType;
  tickets: TicketAndTagsType[];
};

export function PipelineLane({
  pipelineId,
  subAccountId,
  lane,
  tickets,
}: Props) {
  const { openUpdateLaneModal, ticketModal, openDeleteLaneModal } =
    usePipelineDnd();

  const color = useMemo(() => randomColor.pastel(), []);
  const laneAmount = useMemo(
    () => tickets.reduce((total, ticket) => total + Number(ticket.value), 0),
    [tickets],
  );

  const { data: pipelines = [] } = api.pipeline.getSubAccountPipelines.useQuery(
    {
      subAccountId,
    },
  );

  const switchablePipelines = pipelines.filter(
    (pipeline) => pipeline.id !== pipelineId,
  );

  return (
    <div className="h-[700px] w-96 shrink-0 bg-slate-200/30 dark:bg-background/20">
      <div className="flex cursor-grab select-none items-center justify-between gap-3 rounded-t-lg border-b bg-slate-200/60 p-3 backdrop-blur-lg dark:bg-background/40">
        <span className="size-5 rounded-full" style={{ background: color }} />
        <p className="flex-1 text-sm font-bold">{lane.name}</p>
        <Badge className="bg-white text-black">
          {formatAmount(laneAmount)}
        </Badge>
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
                    <DropdownMenuItem key={pipeline.id}>
                      {pipeline.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              className="flex items-center gap-3"
              onClick={() => openDeleteLaneModal(lane)}
            >
              <Trash className="size-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-3"
              onClick={ticketModal.open}
            >
              <PlusCircleIcon className="size-4" />
              Create Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {tickets.map((ticket) => (
        <PipelineTicket key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
