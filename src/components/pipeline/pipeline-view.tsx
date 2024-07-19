"use client";

import { UpsertLaneForm } from "@/components/pipeline/upsert-lane-form";
import { Button } from "@/components/ui/button";
import { useToggle } from "@/hooks/use-toggle";
import type {
  LaneDetailType,
  LaneType,
  PipelineType,
  TicketAndTagsType,
  TicketType,
} from "@/lib/types";
import { api } from "@/trpc/react";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PipelineLane } from "@/components/pipeline/pipeline-lane";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { SortableContext } from "@dnd-kit/sortable";

type Props = {
  pipelineId: string;
  subAccountId: string;
  pipeline: PipelineType;
};

export function PipelineView({ pipeline, pipelineId, subAccountId }: Props) {
  const createLaneModal = useToggle(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const { data: lanes = [] } = api.lane.getDetail.useQuery({
    pipelineId,
  });

  const ticketsFromAllLanes: TicketAndTagsType[] = [];
  lanes.forEach((lane) => {
    lane.tickets.forEach((ticket) => {
      ticketsFromAllLanes.push(ticket);
    });
  });

  const { mutateAsync: updateLaneOrder, isPending: updatingLaneOrder } =
    api.lane.updateOrder.useMutation();

  const { mutateAsync: updateTicketOrder, isPending: updatingTicketOrder } =
    api.ticket.updateOrder.useMutation();

  const handleAddLane = () => {
    //
  };

  const handleDragEnd = () => {
    //
  };

  return (
    <>
      <div className="animate-automation-zoom-in rounded-xl bg-white/60 p-3 dark:bg-background/60">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipeline.name}</h1>
          <Button className="gap-3" onClick={createLaneModal.open}>
            <Plus />
            <span>Create Lane</span>
          </Button>
        </div>

        <ScrollArea className="my-3 w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max gap-3 p-3">
            <DndContext sensors={sensors} collisionDetection={closestCorners}>
              <SortableContext items={lanes.map((l) => l.id)}>
                {lanes.map((lane) => (
                  <PipelineLane
                    key={lane.id}
                    lane={lane}
                    tickets={lane.tickets}
                    subAccountId={subAccountId}
                    pipelineId={pipelineId}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {lanes.length === 0 && (
          <div className="flex w-full items-center justify-center ">
            <div className="opacity-100">
              <Flag className="size-48 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={createLaneModal.isOpen}
        onOpenChange={createLaneModal.toggle}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new lane</DialogTitle>
            <DialogDescription>You can add ticket to lanes</DialogDescription>
          </DialogHeader>
          <UpsertLaneForm
            modalChild
            pipelineId={pipelineId}
            subAccountId={subAccountId}
            onClose={createLaneModal.close}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
