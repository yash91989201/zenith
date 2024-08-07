import { memo, useCallback } from "react";
// TYPES
import type { TicketAndTagsType } from "@/lib/types";
// CUSTOM HOOKS
import { useLane } from "@/hooks/use-lane";
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
import { Edit, Trash, MoreHorizontalIcon, BringToFront } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type Props = {
  ticket: TicketAndTagsType;
};

export const TicketMenu = memo(({ ticket }: Props) => {
  const ticketId = ticket.id;
  const apiUtils = api.useUtils();

  const { openDeleteTicketModal, openUpdateTicketModal, pipelineId } =
    usePipelineDndUtilityModals();

  const { lanes, reorderTicket } = usePipelineDnd();
  const { laneId, getNumTickets, getTicketIndex } = useLane();

  const numCards = getNumTickets();
  const startIndex = getTicketIndex(ticketId);
  const switchableLanes = lanes.filter((lane) => lane.id !== laneId);

  const { mutateAsync: changeTicketLane } = api.ticket.changeLane.useMutation();

  const changeTicketLaneAction = async (laneId: string) => {
    const actionRes = await changeTicketLane({
      laneId,
      ticketId,
    });
    if (actionRes.status === "SUCCESS") {
      toast.success(actionRes.message);

      await apiUtils.lane.getDetail.refetch({ pipelineId });
    } else {
      toast.error(actionRes.message);
    }
  };

  const moveToTop = useCallback(() => {
    reorderTicket({ laneId, startIndex, finishIndex: 0 });
  }, [laneId, reorderTicket, startIndex]);

  const moveUp = useCallback(() => {
    reorderTicket({ laneId, startIndex, finishIndex: startIndex - 1 });
  }, [laneId, reorderTicket, startIndex]);

  const moveDown = useCallback(() => {
    reorderTicket({ laneId, startIndex, finishIndex: startIndex + 1 });
  }, [laneId, reorderTicket, startIndex]);

  const moveToBottom = useCallback(() => {
    reorderTicket({ laneId, startIndex, finishIndex: numCards - 1 });
  }, [laneId, reorderTicket, startIndex, numCards]);

  const isMoveUpDisabled = startIndex === 0;
  const isMoveDownDisabled = startIndex === numCards - 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6">
          <MoreHorizontalIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={() =>
            openUpdateTicketModal({
              ticket: ticket,
              tags: ticket.tags,
            })
          }
        >
          <Edit className="size-4" />
          Edit Ticket
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={() => openDeleteTicketModal(ticket)}
        >
          <Trash className="size-4" />
          Delete Ticket
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <BringToFront className="mr-2 h-4 w-4" />
            <span>Reorder</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={moveUp} disabled={isMoveUpDisabled}>
                Move Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveToTop} disabled={isMoveUpDisabled}>
                Move to top
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={moveDown}
                disabled={isMoveDownDisabled}
              >
                Move down
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={moveToBottom}
                disabled={isMoveDownDisabled}
              >
                Move to bottom
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <BringToFront className="mr-2 h-4 w-4" />
            <span>Change lane</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {switchableLanes.map((lane) => (
                <DropdownMenuItem
                  key={lane.id}
                  onClick={() => changeTicketLaneAction(lane.id)}
                >
                  {lane.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

TicketMenu.displayName = "Ticket Menu";
