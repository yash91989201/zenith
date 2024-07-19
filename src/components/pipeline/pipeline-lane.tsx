"use client";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { useToggle } from "@/hooks/use-toggle";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
// UTILS
import { api } from "@/trpc/react";
import { cn, formatAmount, randomColor } from "@/lib/utils";
// TYPES
import type { LaneDetailType, TicketAndTagsType } from "@/lib/types";
// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Badge } from "@ui/badge";
// CUSTOM COMPONENTS
import { PipelineTicket } from "@/components/pipeline/pipeline-ticket";
import { UpsertLaneForm } from "@/components/pipeline/upsert-lane-form";
import { UpsertTicketForm } from "@/components/pipeline/upsert-ticket-form";
// ICONS
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";

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
  const router = useRouter();
  const apiUtils = api.useUtils();

  const ticketModal = useToggle(false);
  const updateLaneModal = useToggle(false);

  const {
    attributes,
    transform,
    transition,
    isDragging,
    setNodeRef,
    listeners,
  } = useSortable({
    id: lane.id,
  });

  const color = useMemo(() => randomColor.pastel(), []);
  const laneAmount = useMemo(() => {
    return tickets.reduce((total, ticket) => total + Number(ticket.value), 0);
  }, [tickets]);

  const { mutateAsync: deleteLane } = api.lane.delete.useMutation();
  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const deleteLaneAction = async () => {
    const actionRes = await deleteLane({ laneId: lane.id });
    if (actionRes.status === "SUCCESS") {
      await apiUtils.lane.getDetail.refetch({ pipelineId });
      await saveActivityLog({
        subAccountId,
        activity: `Deleted a lane | ${lane.name}`,
      });
      await apiUtils.user.getNotifications.invalidate({ subAccountId });
      router.refresh();
    }
  };

  return (
    <>
      <div
        className={cn(isDragging ? "opacity-75" : "", "h-full")}
        ref={setNodeRef}
        {...attributes}
        style={{ transition, transform: CSS.Translate.toString(transform) }}
      >
        <AlertDialog>
          <DropdownMenu>
            <div className="relative h-[700px] w-96 shrink-0 overflow-hidden rounded-lg bg-slate-200/30 dark:bg-background/20 ">
              <div
                {...listeners}
                className="flex cursor-grab select-none items-center justify-between gap-3 border-b bg-slate-200/60 p-3 py-4 backdrop-blur-lg dark:bg-background/40"
              >
                <span
                  className="size-5 rounded-full"
                  style={{ background: color }}
                />
                <p className="flex-1 text-sm font-bold">{lane.name}</p>
                <Badge className="bg-white text-black">
                  {formatAmount(laneAmount)}
                </Badge>
                <DropdownMenuTrigger>
                  <MoreVertical className="size-5 cursor-pointer text-muted-foreground" />
                </DropdownMenuTrigger>
              </div>

              <div className="max-h-[700px] space-y-3 overflow-auto p-3">
                <SortableContext items={tickets.map((t) => t.id)}>
                  {tickets.map((ticket) => (
                    <PipelineTicket
                      key={ticket.id}
                      ticket={ticket}
                      laneId={lane.id}
                      pipelineId={pipelineId}
                      subAccountId={subAccountId}
                    />
                  ))}
                </SortableContext>
              </div>

              <DropdownMenuContent>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-3"
                  onClick={updateLaneModal.open}
                >
                  <Edit className="size-4" />
                  Edit
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="flex items-center gap-3">
                    <Trash className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-3"
                  onClick={ticketModal.open}
                >
                  <PlusCircleIcon className="size-4" />
                  Create Ticket
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive"
                  onClick={deleteLaneAction}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </DropdownMenu>
        </AlertDialog>
      </div>

      <Dialog
        open={updateLaneModal.isOpen}
        onOpenChange={updateLaneModal.toggle}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update lane</DialogTitle>
            <DialogDescription>lane info</DialogDescription>
          </DialogHeader>
          <UpsertLaneForm
            modalChild
            lane={lane}
            subAccountId={subAccountId}
            pipelineId={pipelineId}
            onClose={updateLaneModal.close}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={ticketModal.isOpen} onOpenChange={ticketModal.toggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save ticket</DialogTitle>
            <DialogDescription>add ticket and tags</DialogDescription>
          </DialogHeader>
          <UpsertTicketForm
            modalChild
            laneId={lane.id}
            pipelineId={pipelineId}
            subAccountId={subAccountId}
            onClose={ticketModal.close}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
