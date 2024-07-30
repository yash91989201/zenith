import invariant from "tiny-invariant";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { createRegistry } from "@/components/pipeline/pipeline-dnd/registry";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { LaneDetailType } from "@/lib/types";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
// UI
import { AutoScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// CUSTOM COMPONENTS
import { PipelineDndProvider } from "@/providers/pipeline-dnd-provider";
import { PipelineLane } from "@/components/pipeline/pipeline-dnd/pipeline-lane";

type Outcome =
  | {
      type: "lane-reorder";
      laneId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "ticket-reorder";
      laneId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "ticket-move";
      finishLaneId: string;
      ticketIndexInStartLane: number;
      ticketIndexInFinishLane: number;
    };

type Trigger = "pointer" | "keyboard";

type Operation = {
  trigger: Trigger;
  outcome: Outcome;
};

type PipelineDndState = {
  lanes: LaneDetailType[];
  lanesId: string[];
  lastOperation: Operation | null;
};

type Props = {
  lanes: LaneDetailType[];
  subAccountId: string;
  pipelineId: string;
};

export const PipelineDnd = memo(
  ({ lanes, subAccountId, pipelineId }: Props) => {
    const apiUtils = api.useUtils();
    const lanesId = useMemo(() => lanes.map((lane) => lane.id), [lanes]);

    const [registry] = useState(createRegistry);
    const [instanceId] = useState(() => Symbol("instance-id"));
    const [laneState, setLaneState] = useState<PipelineDndState>({
      lanes: lanes,
      lanesId,
      lastOperation: null,
    });
    const { lastOperation } = laneState;
    const stableLanes = useRef(laneState);

    const { mutate: updateLaneOrder } = api.lane.updateOrder.useMutation({
      onMutate: ({ lanes }) => {
        const prevLanes = apiUtils.lane.getDetail.getData({ pipelineId });

        apiUtils.lane.getDetail.setData({ pipelineId }, () => lanes);
        return { prevLanes };
      },
      onError: (_error, _newLanes, ctx) => {
        apiUtils.lane.getDetail.setData({ pipelineId }, () => ctx?.prevLanes);
      },
      onSettled: async () => {
        await apiUtils.lane.getDetail.refetch({ pipelineId });
      },
    });

    const { mutate: updateTicketOrder } = api.ticket.updateOrder.useMutation({
      onMutate: ({ laneId, tickets }) => {
        const prevLanes = apiUtils.lane.getDetail.getData({ pipelineId });
        if (!prevLanes) return;

        const updatedLanes = prevLanes.map((lane) => {
          if (lane.id === laneId) {
            const updatedTickets = tickets.map((ticket) => {
              const ticketFromLane = lane.tickets.find(
                (t) => t.id === ticket.id,
              )!;

              return {
                ...ticketFromLane,
                ...ticket,
              };
            });
            return {
              ...lane,
              tickets: updatedTickets,
            };
          }
          return lane;
        });

        apiUtils.lane.getDetail.setData({ pipelineId }, () => updatedLanes);

        return { updatedLanes };
      },
      onError: (_error, _newLanes, ctx) => {
        apiUtils.lane.getDetail.setData(
          { pipelineId },
          () => ctx?.updatedLanes,
        );
      },
      onSettled: async () => {
        await apiUtils.lane.getDetail.refetch({ pipelineId });
      },
    });

    const reorderLane = useCallback(
      ({
        startIndex,
        finishIndex,
        trigger = "pointer",
      }: {
        startIndex: number;
        finishIndex: number;
        trigger?: Trigger;
      }) => {
        setLaneState((currLaneData) => {
          const outcome: Outcome = {
            type: "lane-reorder",
            laneId: currLaneData.lanesId[startIndex]!,
            startIndex,
            finishIndex,
          };

          const orderedLanesId = reorder({
            list: currLaneData.lanesId,
            startIndex,
            finishIndex,
          });

          const orderedLanes = reorder({
            list: currLaneData.lanes,
            startIndex,
            finishIndex,
          });

          const lanesWithUpdatedOrderValue = orderedLanes.map(
            (lane, index) => ({
              ...lane,
              order: index,
            }),
          );

          updateLaneOrder({ lanes: lanesWithUpdatedOrderValue });

          return {
            ...currLaneData,
            lanesId: orderedLanesId,
            lanes: lanesWithUpdatedOrderValue,
            lastOperation: {
              outcome,
              trigger: trigger,
            },
          };
        });
      },
      [updateLaneOrder],
    );

    const reorderTicket = useCallback(
      ({
        laneId,
        startIndex,
        finishIndex,
        trigger = "pointer",
      }: {
        laneId: string;
        startIndex: number;
        finishIndex: number;
        trigger?: Trigger;
      }) => {
        setLaneState((currLaneData) => {
          const sourceLane = currLaneData.lanes.find(
            (lane) => lane.id === laneId,
          );

          if (!sourceLane) return currLaneData;

          const updatedTickets = reorder({
            list: sourceLane.tickets,
            startIndex,
            finishIndex,
          });

          const updatedTicketsOrder = updatedTickets.map((ticket, index) => ({
            ...ticket,
            order: index,
          }));

          const updatedSourceLane: LaneDetailType = {
            ...sourceLane,
            tickets: updatedTicketsOrder,
          };

          const updatedLanes = currLaneData.lanes.map((lane) => {
            if (lane.id === laneId) {
              return updatedSourceLane;
            }
            return lane;
          });

          const outcome: Outcome | null = {
            laneId,
            startIndex,
            finishIndex,
            type: "lane-reorder",
          };

          updateTicketOrder({
            laneId: sourceLane.id,
            tickets: updatedTicketsOrder,
          });

          return {
            ...currLaneData,
            lanes: updatedLanes,
            lastOperation: {
              trigger: trigger,
              outcome,
            },
          };
        });
      },
      [updateTicketOrder],
    );

    const moveTicket = useCallback(
      ({
        startLaneId,
        finishLaneId,
        ticketIndexInStartLane,
        ticketIndexInFinishLane,
        trigger = "keyboard",
      }: {
        startLaneId: string;
        finishLaneId: string;
        ticketIndexInStartLane: number;
        ticketIndexInFinishLane?: number;
        trigger?: "pointer" | "keyboard";
      }) => {
        // invalid cross column movement
        if (startLaneId === finishLaneId) return;

        setLaneState((currLaneState) => {
          const sourceLane = currLaneState.lanes.find(
            (lane) => lane.id === startLaneId,
          );
          const destinationLane = currLaneState.lanes.find(
            (lane) => lane.id === finishLaneId,
          );

          if (!sourceLane || !destinationLane) return currLaneState;

          const ticket = sourceLane.tickets[ticketIndexInStartLane]!;
          const ticketId = ticket.id;

          const destinationTickets = Array.from(destinationLane.tickets);

          // Going into the first position if no index is provided
          const newIndexInDestination = ticketIndexInFinishLane ?? 0;
          destinationTickets.splice(newIndexInDestination, 0, ticket);

          const updatedSourceLaneTickets = sourceLane.tickets
            .filter((ticket) => ticket.id !== ticketId)
            .map((ticket, index) => ({ ...ticket, order: index }));

          const updatedDestinationLaneTickets = destinationTickets.map(
            (ticket, index) => ({
              ...ticket,
              order: index,
              laneId: destinationLane.id,
            }),
          );

          const updatedSourceLane = {
            ...sourceLane,
            tickets: updatedSourceLaneTickets,
          };

          const updatedDestinationLane = {
            ...destinationLane,
            tickets: updatedDestinationLaneTickets,
          };

          const newLanesState = currLaneState.lanes.map((lane) => {
            if (updatedSourceLane.id === lane.id) {
              return updatedSourceLane;
            }
            if (updatedDestinationLane.id === lane.id) {
              return updatedDestinationLane;
            }

            return lane;
          });

          const outcome: Outcome | null = {
            type: "ticket-move",
            finishLaneId,
            ticketIndexInStartLane,
            ticketIndexInFinishLane: newIndexInDestination,
          };

          updateTicketOrder({
            laneId: sourceLane.id,
            tickets: updatedSourceLaneTickets,
          });
          updateTicketOrder({
            laneId: destinationLane.id,
            tickets: updatedDestinationLaneTickets,
          });

          return {
            ...currLaneState,
            lanes: newLanesState,
            lastOperation: {
              outcome,
              trigger,
            },
          };
        });
      },
      [updateTicketOrder],
    );

    useEffect(() => {
      stableLanes.current = laneState;
    }, [laneState]);

    useEffect(() => {
      setLaneState({
        lanes: lanes,
        lanesId: lanes.map((lane) => lane.id),
        lastOperation: null,
      });
    }, [lanes]);

    useEffect(() => {
      if (!lastOperation) return;

      const { outcome, trigger } = lastOperation;

      if (outcome.type === "lane-reorder") {
        const { finishIndex } = outcome;
        const { lanes, lanesId } = stableLanes.current;

        const sourceLane = lanes.find(
          (lane) => lane.id === lanesId[finishIndex],
        )!;

        const laneEntry = registry.getLane(sourceLane.id);
        triggerPostMoveFlash(laneEntry.element);

        return;
      }

      if (outcome.type === "ticket-reorder") {
        const { lanes } = stableLanes.current;
        const { laneId, finishIndex } = outcome;

        const lane = lanes.find((lane) => lane.id === laneId);
        if (!lane) return;

        const ticket = lane.tickets[finishIndex];
        if (!ticket) return;

        const entry = registry.getTicket(ticket.id);
        triggerPostMoveFlash(entry.element);

        if (trigger !== "keyboard") return;

        return;
      }
    }, [lastOperation, registry]);

    useEffect(() => {
      return combine(
        monitorForElements({
          canMonitor: ({ source }) => source.data.instanceId === instanceId,
          onDrop: ({ location, source }) => {
            // didn't drop on anything
            if (!location.current.dropTargets.length) return;

            if (source.data.type === "lane") {
              const startIndex = laneState.lanes.findIndex(
                (lane) => lane.id === source.data.laneId,
              );

              const target = location.current.dropTargets[0]!;

              const indexOfTarget = laneState.lanes.findIndex(
                (lane) => lane.id === target.data.laneId,
              );

              const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                target.data,
              );

              const finishIndex = getReorderDestinationIndex({
                startIndex,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "horizontal",
              });
              reorderLane({ startIndex, finishIndex, trigger: "pointer" });
              return;
            }

            if (source.data.type === "ticket") {
              const ticketId = source.data.ticketId;
              invariant(typeof ticketId === "string");

              const sourceLane = laneState.lanes.find((lane) =>
                lane.tickets.find((ticket) => ticket.id === ticketId),
              );

              if (!sourceLane) return;

              const sourceLaneId = sourceLane.id;
              const sourceTicketIndex = sourceLane.tickets.findIndex(
                (ticket) => ticket.id === ticketId,
              );

              if (location.current.dropTargets.length === 1) {
                const [destinationLaneRecord] = location.current.dropTargets;
                if (!destinationLaneRecord) return;

                const destinationLaneId = destinationLaneRecord.data.laneId;
                invariant(typeof destinationLaneId === "string");

                const destinationLane = laneState.lanes.find(
                  (lane) => lane.id === destinationLaneId,
                );

                if (!destinationLane) return;

                // same lane - reorder ticket
                if (sourceLaneId === destinationLaneId) {
                  const destinationIndex = getReorderDestinationIndex({
                    startIndex: sourceTicketIndex,
                    indexOfTarget: sourceLane.tickets.length - 1,
                    closestEdgeOfTarget: null,
                    axis: "vertical",
                  });

                  reorderTicket({
                    laneId: sourceLane.id,
                    startIndex: sourceTicketIndex,
                    finishIndex: destinationIndex,
                    trigger: "pointer",
                  });
                  return;
                }

                moveTicket({
                  startLaneId: sourceLane.id,
                  finishLaneId: destinationLane.id,
                  ticketIndexInStartLane: sourceTicketIndex,
                  trigger: "pointer",
                });
              }

              if (location.current.dropTargets.length === 2) {
                const [destinationTicketRecord, destinationLaneRecord] =
                  location.current.dropTargets;

                if (!destinationTicketRecord || !destinationLaneRecord) return;

                const destinationTicketId =
                  destinationTicketRecord?.data.ticketId;
                const destinationLaneId = destinationLaneRecord.data.laneId;

                invariant(typeof destinationLaneId === "string");
                invariant(typeof destinationTicketId === "string");

                const destinationLane = laneState.lanes.find(
                  (lane) => lane.id === destinationLaneId,
                );

                if (!destinationLane) return;

                const destinationTicketIndex =
                  destinationLane.tickets.findIndex(
                    (ticket) => ticket.id === destinationTicketId,
                  );

                const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                  destinationLaneRecord?.data,
                );

                // reordering in the same lane
                if (sourceLane.id === destinationLane.id) {
                  const destinationIndex = getReorderDestinationIndex({
                    startIndex: sourceTicketIndex,
                    indexOfTarget: destinationTicketIndex,
                    closestEdgeOfTarget,
                    axis: "vertical",
                  });

                  reorderTicket({
                    laneId: sourceLane.id,
                    startIndex: sourceTicketIndex,
                    finishIndex: destinationIndex,
                    trigger: "pointer",
                  });
                  return;
                }

                const destinationIndex =
                  closestEdgeOfTarget === "bottom"
                    ? destinationTicketIndex + 1
                    : destinationTicketIndex;

                moveTicket({
                  ticketIndexInStartLane: sourceTicketIndex,
                  startLaneId: sourceLane.id,
                  finishLaneId: destinationLane.id,
                  ticketIndexInFinishLane: destinationIndex,
                  trigger: "pointer",
                });
                return;
              }
            }
          },
        }),
      );
    }, [instanceId, laneState.lanes, reorderLane, reorderTicket, moveTicket]);

    return (
      <PipelineDndProvider
        lanes={laneState.lanes}
        instanceId={instanceId}
        registerLane={registry.registerLane}
        registerTicket={registry.registerTicket}
        reorderLane={reorderLane}
        reorderTicket={reorderTicket}
        moveTicket={moveTicket}
      >
        <AutoScrollArea className="whitespace-nowrap rounded-md border">
          <div className="flex w-full gap-3 p-3 pb-6">
            {laneState.lanes.map((lane) => (
              <PipelineLane
                key={lane.id}
                lane={lane}
                tickets={lane.tickets}
                subAccountId={subAccountId}
                pipelineId={pipelineId}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </AutoScrollArea>
      </PipelineDndProvider>
    );
  },
);

PipelineDnd.displayName = "Pipeline Drag & Drop";

export const PipelineDndSkeleton = () => {
  return <div></div>;
};
