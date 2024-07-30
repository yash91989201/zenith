"use client";
import invariant from "tiny-invariant";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  extractClosestEdge,
  attachClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
// UTILS
import { cn } from "@/lib/utils";
// TYPES
import type { FunnelPageType } from "@/lib/types";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
// CUSTOM HOOKS
import { useFunnelSteps } from "@/hooks/useFunnelSteps";
// UI
import { Button } from "@ui/button";
// ICONS
import { ArrowDown, GripVertical, Mail } from "lucide-react";

type Props = {
  page: FunnelPageType;
};

type State =
  | {
      type: "idle";
    }
  | {
      type: "preview";
      container: HTMLElement;
    }
  | {
      type: "is-dragging";
    };

const idle: State = { type: "idle" };
const dragging: State = { type: "is-dragging" };

export function FunnelStep({ page }: Props) {
  const { id: funnelPageId, order: index } = page;

  const [state, setState] = useState<State>(idle);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const funnelPageRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);

  const { pages, instanceId, currentPage, setCurrentPage, registerFunnelPage } =
    useFunnelSteps();

  useEffect(() => {
    const element = funnelPageRef.current;
    const dragHandle = dragHandleRef.current;

    invariant(element);
    invariant(dragHandle);

    const data = {
      index,
      instanceId,
      funnelPageId,
    };

    return combine(
      registerFunnelPage({
        funnelPageId,
        entry: element,
      }),
      // makes the element draggable
      draggable({
        element,
        dragHandle,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            render({ container }) {
              setState({ type: "preview", container });

              return () => setState(dragging);
            },
          });
        },

        onDragStart: () => setState(dragging),
        onDrop: () => setState(idle),
      }),

      dropTargetForElements({
        element,
        getData: ({ input, element }) => {
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        canDrop: ({ source }) => {
          return (
            source.element !== element && source.data.instanceId === instanceId
          );
        },
        onDrag: ({ source, self }) => {
          const isSource = source.element === element;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data.index;
          invariant(typeof sourceIndex === "number");

          const isItemBeforeSource = index === sourceIndex - 1;
          const isItemAfterSource = index === sourceIndex + 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top");

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave: () => {
          setState(idle);
          setClosestEdge(null);
        },
        onDrop: () => {
          setState(idle);
          setClosestEdge(null);
        },
      }),
    );
  }, [registerFunnelPage, instanceId, funnelPageId, index]);

  return (
    <>
      <div
        ref={funnelPageRef}
        className={cn(
          state.type === "is-dragging" && "opacity-80",
          "relative mb-3 flex select-none items-center gap-3 rounded-md border p-3 dark:border-gray-700",
        )}
        onClick={() => setCurrentPage(page)}
      >
        <Button size="icon" variant="ghost" ref={dragHandleRef}>
          <GripVertical className="size-4 cursor-grab" />
        </Button>
        <p className="relative flex size-10 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
          <Mail className="size-5" />
          {pages.length !== page.order && (
            <span className="absolute left-1/2 top-14 -translate-x-1/2">
              <ArrowDown className="size-4" />
            </span>
          )}
        </p>
        <div className="flex flex-col gap-1.5">
          <p className="flex-1">{page.name}</p>
          <span className="text-sm text-muted-foreground">
            {page.visits} visits
          </span>
        </div>

        {currentPage?.id === page.id && (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-green-500" />
        )}
        {closestEdge && <DropIndicator edge={closestEdge} gap={"4px"} />}
      </div>

      {state.type === "preview"
        ? createPortal(<FunnelStepDragPreview page={page} />, state.container)
        : null}
    </>
  );
}

function FunnelStepDragPreview({ page }: { page: FunnelPageType }) {
  return (
    <div className="relative flex w-72 select-none items-center gap-3 rounded-md border bg-white p-3 dark:border-gray-700">
      <Button size="icon" variant="ghost">
        <GripVertical className="size-4 cursor-grab" />
      </Button>
      <p className="relative flex size-10 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
        <Mail className="size-5" />
      </p>
      <div className="flex flex-col gap-1.5">
        <p className="flex-1">{page.name}</p>
        <span className="text-sm text-muted-foreground">
          {page.visits} visits
        </span>
      </div>
    </div>
  );
}
