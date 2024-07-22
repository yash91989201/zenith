import invariant from "tiny-invariant";
import { memo, useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
// UTILS
import { cn, formatAmount } from "@/lib/utils";
// TYPES
import type { TagColor, TicketAndTagsType } from "@/lib/types";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
// CUSTOM HOOKS
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Button } from "@ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
// CUSTOM COMPONENTS
import { Tag } from "@global/tag";
import { TicketMenu } from "@/components/pipeline/pipeline-dnd/ticket-menu";
// ICONS
import { User2, LinkIcon, Contact2, GripVertical } from "lucide-react";

type State =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "dragging" };

type Props = {
  ticket: TicketAndTagsType;
};

const idleState: State = { type: "idle" };
const draggingState: State = { type: "dragging" };

export const PipelineTicket = memo(({ ticket }: Props) => {
  const ticketId = ticket.id;

  const [state, setState] = useState<State>(idleState);
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const ticketHandleRef = useRef<HTMLButtonElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const { instanceId, registerTicket } = usePipelineDnd();

  useEffect(() => {
    const element = ticketRef.current;
    const dragHandle = ticketHandleRef.current;

    invariant(element);
    invariant(dragHandle);

    return combine(
      registerTicket({
        ticketId,
        entry: {
          element,
        },
      }),
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({ type: "ticket", ticketId, instanceId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setState({ type: "preview", container, rect });
              return () => setState(draggingState);
            },
          });
        },
        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      // creating a drop target for dropping tickets in different lanes
      dropTargetForExternal({ element }),
      // creating drop target for reordering tickets in same lane
      dropTargetForElements({
        element,
        getIsSticky: () => true,
        canDrop: ({ source }) => {
          return (
            source.data.type === "ticket" &&
            source.data.instanceId === instanceId
          );
        },
        getData: ({ input, element }) => {
          const data = { type: "ticket", ticketId };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDrag: (args) => {
          if (args.source.data.ticketId !== ticketId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragEnter: (args) => {
          if (args.source.data.ticketId !== ticketId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      }),
    );
  }, [instanceId, ticketId, ticket, registerTicket]);

  return (
    <Card
      ref={ticketRef}
      className={cn(
        state.type === "dragging" && "shadow-md",
        "select-none bg-white shadow-none transition-all dark:bg-slate-900",
      )}
    >
      <CardHeader className="space-y-3 p-3">
        <CardTitle className="flex items-center justify-between gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="size-7 cursor-grab"
            ref={ticketHandleRef}
          >
            <GripVertical className="size-4" />
          </Button>
          <p className="flex flex-1 flex-col gap-1">
            <span>{ticket.name}</span>
            <span className="text-[0.65rem] text-muted-foreground">
              {new Date().toLocaleDateString()}
            </span>
          </p>
          <TicketMenu ticket={ticket} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3 pt-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {ticket.tags.map((tag) => (
            <Tag
              key={tag.id}
              title={tag.name}
              colorName={tag.color as TagColor}
            />
          ))}
        </div>
        <CardDescription className="w-full">
          {ticket.description}
        </CardDescription>
        {ticket.customer && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 text-muted-foreground transition-all hover:bg-muted">
                <LinkIcon className="size-3" />
                <span className="text-xs font-bold">Contact</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="right" className="w-fit">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback className="bg-primary">
                    {ticket.customer.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    {ticket.customer.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {ticket.customer.email}
                  </p>
                  <div className="flex items-center pt-2">
                    <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      Joined
                      {ticket.customer.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </CardContent>
      <CardFooter className="m-0 flex items-center justify-between border-t-[1px] border-muted-foreground/20 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage alt="contact" src={ticket.assigned?.avatarUrl} />
            <AvatarFallback className="bg-primary text-sm text-white">
              {ticket.assigned?.name}
              {!ticket.assignedUserId && <User2 className="size-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <span className="text-sm text-muted-foreground">
              {ticket.assignedUserId ? "Assigned to" : "Not Assigned"}
            </span>
            {ticket.assignedUserId && (
              <span className="w-24 overflow-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                {ticket.assigned?.name}
              </span>
            )}
          </div>
        </div>
        <span className="text-sm font-bold">
          {ticket.value && formatAmount(+ticket.value)}
        </span>
      </CardFooter>
      {closestEdge && <DropIndicator edge={closestEdge} gap="gap-3" />}
    </Card>
  );
});

PipelineTicket.displayName = "Pipeline Ticket";
