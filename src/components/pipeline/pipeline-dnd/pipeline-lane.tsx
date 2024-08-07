"use client";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
// UTILS
import { cn, formatAmount, randomColor } from "@/lib/utils";
// TYPES
import type { LaneDetailType, TicketAndTagsType } from "@/lib/types";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
// PROVIDERS
import { LaneProvider } from "@/providers/lane-provider";
// CUSTOM HOOKS
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
// UI
import { Badge } from "@ui/badge";
import { AutoScrollArea } from "@ui/scroll-area";
// CUSTOM COMPONENTS
import { PipelineTicket } from "@pipelineDnd/pipeline-ticket";
import { LaneMenu } from "@/components/pipeline/pipeline-dnd/lane-menu";

type Props = {
  pipelineId: string;
  subAccountId: string;
  lane: LaneDetailType;
  tickets: TicketAndTagsType[];
};

type State =
  | { type: "idle" }
  | { type: "is-ticket-over" }
  | { type: "is-lane-over"; closestEdge: Edge | null }
  | { type: "generate-safari-lane-preview"; container: HTMLElement }
  | { type: "generate-lane-preview" };

// preventing re-renders with stable state objects
const idle: State = { type: "idle" };
const isTicketOver: State = { type: "is-ticket-over" };

export const PipelineLane = memo(
  ({ pipelineId, subAccountId, lane, tickets }: Props) => {
    const laneId = lane.id;
    const color = useMemo(() => randomColor.pastel(), []);
    const laneAmount = useMemo(
      () => tickets.reduce((total, ticket) => total + Number(ticket.value), 0),
      [tickets],
    );

    const stableTickets = useRef(tickets);
    const [state, setState] = useState<State>(idle);
    const laneRef = useRef<HTMLDivElement | null>(null);
    const laneInnerRef = useRef<HTMLDivElement | null>(null);
    const laneHeaderRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const { instanceId, registerLane } = usePipelineDnd();

    useEffect(() => {
      stableTickets.current = tickets;
    }, [tickets]);

    useEffect(() => {
      invariant(laneRef.current);
      invariant(laneInnerRef.current);
      invariant(laneHeaderRef.current);

      return combine(
        registerLane({
          laneId,
          entry: {
            element: laneRef.current,
          },
        }),
        // register the lane as a draggable item using the lanRef and laneHeaderRef
        draggable({
          element: laneRef.current,
          dragHandle: laneHeaderRef.current,
          getInitialData: () => ({ laneId, type: "lane", instanceId }),
          onGenerateDragPreview: ({ nativeSetDragImage }) => {
            const isSafari: boolean =
              navigator.userAgent.includes("AppleWebKit") &&
              !navigator.userAgent.includes("Chrome");

            if (!isSafari) {
              setState({ type: "generate-lane-preview" });
              return;
            }

            setCustomNativeDragPreview({
              nativeSetDragImage,
              getOffset: centerUnderPointer,
              render: ({ container }) => {
                setState({
                  type: "generate-safari-lane-preview",
                  container,
                });
                return () => setState(idle);
              },
            });
          },
          onDragStart: () => {
            setIsDragging(true);
          },
          onDrop: () => {
            setState(idle);
            setIsDragging(false);
          },
        }),
        // create a target for ticket to be dropped using laneInnerRef
        dropTargetForElements({
          element: laneInnerRef.current,
          getData: () => ({ laneId }),
          canDrop: ({ source }) => {
            return (
              source.data.instanceId === instanceId &&
              source.data.type === "ticket"
            );
          },
          getIsSticky: () => true,
          onDragEnter: () => setState(isTicketOver),
          onDragLeave: () => setState(idle),
          onDragStart: () => setState(isTicketOver),
          onDrop: () => setState(idle),
        }),
        // create a target for lane to be dropped using laneRef
        dropTargetForElements({
          element: laneRef.current,
          getIsSticky: () => true,
          canDrop: ({ source }) => {
            return (
              source.data.instanceId === instanceId &&
              source.data.type === "lane"
            );
          },
          getData: ({ input, element }) => {
            const data = {
              type: "lane",
              laneId,
            };
            return attachClosestEdge(data, {
              input,
              element,
              allowedEdges: ["left", "right"],
            });
          },
          onDragEnter: (args) => {
            setState({
              type: "is-lane-over",
              closestEdge: extractClosestEdge(args.self.data),
            });
          },
          onDrag: (args) => {
            // skip react re-render if edge is not changing
            setState((current) => {
              const closestEdge: Edge | null = extractClosestEdge(
                args.self.data,
              );
              if (
                current.type === "is-lane-over" &&
                current.closestEdge === closestEdge
              ) {
                return current;
              }
              return {
                type: "is-lane-over",
                closestEdge,
              };
            });
          },
          onDragLeave: () => {
            setState(idle);
          },
          onDrop: () => {
            setState(idle);
          },
        }),
      );
    }, [instanceId, laneId, registerLane]);

    const getTicketIndex = useCallback((ticketId: string) => {
      return stableTickets.current.findIndex(
        (ticket) => ticket.id === ticketId,
      );
    }, []);

    const getNumTickets = useCallback(() => {
      return stableTickets.current.length;
    }, []);

    return (
      <LaneProvider
        laneId={laneId}
        getNumTickets={getNumTickets}
        getTicketIndex={getTicketIndex}
      >
        <div
          ref={laneRef}
          className={cn(
            isDragging ? "opacity-75" : "",
            "h-[700px] w-96 shrink-0 overflow-hidden  rounded-lg bg-slate-200/30 dark:bg-background/20",
          )}
        >
          <div ref={laneInnerRef} className="flex h-full flex-col">
            <div
              className="flex cursor-grab select-none items-center justify-between gap-3  bg-slate-200/60 p-3 backdrop-blur-lg dark:bg-background/40"
              ref={laneHeaderRef}
            >
              <span
                className="size-5 rounded-full"
                style={{ background: color }}
              />
              <p className="flex-1 text-sm font-bold">{lane.name}</p>
              <Badge className="bg-white text-black">
                {formatAmount(laneAmount)}
              </Badge>
              <LaneMenu
                lane={lane}
                pipelineId={pipelineId}
                subAccountId={subAccountId}
              />
            </div>

            <AutoScrollArea
              className={cn(
                "flex-1",
                state.type === "is-ticket-over" && "bg-primary/10",
              )}
            >
              <div className="m-4 space-y-3">
                {tickets.map((ticket) => (
                  <PipelineTicket key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </AutoScrollArea>
          </div>
          {state.type === "is-lane-over" && state.closestEdge && (
            <DropIndicator edge={state.closestEdge} gap="gap-1" />
          )}
        </div>
      </LaneProvider>
    );
  },
);

PipelineLane.displayName = "Pipeline Lane";
