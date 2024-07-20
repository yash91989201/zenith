"use client"
import { useContext, useCallback } from "react";
import { PipelineDndContext } from "@providers/pipeline-dnd-provider";
import { api } from "@/trpc/react";
import type { LaneDetailType, TicketType, UpsertTicketType } from "@/lib/types";

export function usePipelineDnd() {
  // TODO: find better way to implement this 
  const context = useContext(PipelineDndContext);
  if (!context) {
    throw new Error("usePipelineDnd must be used within a PipelineDndProvider");
  }

  const apiUtils = api.useUtils();

  const {
    lane,
    ticket,
    ticketModal,
    pipelineId,
    subAccountId,
    deleteLaneModal,
    updateLaneModal,
    deleteTicketModal,
    setLane,
    setTicket,
    setTicketData,
  } = context;

  const { mutateAsync: saveActivityLog } = api.notification.saveActivityLog.useMutation();
  const { mutateAsync: deleteLane, isPending: deletingLane } = api.lane.delete.useMutation();
  const { mutateAsync: deleteTicket, isPending: deletingTicket } = api.ticket.deleteTicket.useMutation();

  const openUpdateLaneModal = useCallback((lane: LaneDetailType) => {
    setLane(lane);
    updateLaneModal.open();
  }, [setLane, updateLaneModal]);

  const openDeleteLaneModal = useCallback((lane: LaneDetailType) => {
    setLane(lane);
    deleteLaneModal.open();
  }, [setLane, deleteLaneModal]);

  const openUpdateTicketModal = useCallback((ticketData: UpsertTicketType) => {
    setTicketData(ticketData);
    ticketModal.open();
  }, [setTicketData, ticketModal]);

  const openDeleteTicketModal = useCallback((ticket: TicketType) => {
    setTicket(ticket);
    deleteTicketModal.open();
  }, [setTicket, deleteTicketModal]);

  const deleteLaneAction = useCallback(async () => {
    if (!lane) return;

    const actionRes = await deleteLane({ laneId: lane.id });

    if (actionRes.status === "SUCCESS") {
      await apiUtils.lane.getDetail.refetch({ pipelineId });
      await saveActivityLog({
        subAccountId,
        activity: `Deleted a lane | ${lane.name}`,
      });
      await apiUtils.user.getNotifications.invalidate({ subAccountId });
    }
  }, [lane, deleteLane, apiUtils, pipelineId, saveActivityLog, subAccountId]);

  const deleteTicketAction = useCallback(async () => {
    if (!ticket) return;

    const actionRes = await deleteTicket(ticket);

    if (actionRes.status === "SUCCESS") {
      await apiUtils.lane.getDetail.refetch({ pipelineId });
      await saveActivityLog({
        subAccountId,
        activity: `Deleted a ticket | ${ticket.name}`,
      });
      await apiUtils.user.getNotifications.invalidate({ subAccountId });
    }
  }, [ticket, deleteTicket, apiUtils, pipelineId, saveActivityLog, subAccountId]);

  return {
    ...context,
    openUpdateTicketModal,
    deleteLaneAction,
    openUpdateLaneModal,
    deleteTicketAction,
    openDeleteTicketModal,
    deletingLane,
    deletingTicket,
    openDeleteLaneModal,
  };
}
