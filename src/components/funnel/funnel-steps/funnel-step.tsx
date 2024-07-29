"use client";
import invariant from "tiny-invariant";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
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
    }
  | {
      type: "is-dragging-over";
      closestEdge: Edge | null;
    };

const idle: State = { type: "idle" };
const dragging: State = { type: "is-dragging" };

export function FunnelStep({ page }: Props) {
  const funnelPageId = page.id;
  const {
    getFunnelPagesLength,
    instanceId,
    registerFunnelPage,
    setSelectedPageId,
    selectedPageId,
  } = useFunnelSteps();

  const funnelPages = getFunnelPagesLength();

  const [state, setState] = useState<State>(idle);

  const funnelPageRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    invariant(funnelPageRef.current);
    invariant(handleRef.current);

    const element = funnelPageRef.current;

    return combine(
      registerFunnelPage({
        funnelPageId,
        entry: funnelPageRef.current,
      }),

      draggable({
        element: funnelPageRef.current,
        dragHandle: handleRef.current,
        getInitialData: () => ({
          instanceId,
          funnelPageId,
        }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: "preview",
                container,
              });
              return () => setState(idle);
            },
          });
        },
        onDragStart: () => setState(dragging),
        onDrop: () => setState(idle),
      }),

      dropTargetForElements({
        element,
        getData: () => ({ funnelPageId }),
        canDrop: ({ source }) => {
          // not allowing dropping on yourself
          if (source.element === element) {
            return false;
          }
          return true;
        },
        getIsSticky: () => true,
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
          setState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave: () => setState(idle),
        onDrop: () => setState(idle),
      }),
    );
  }, [registerFunnelPage, instanceId, funnelPageId]);

  return (
    <>
      <div
        ref={funnelPageRef}
        className="relative mb-3 flex select-none items-center gap-3 rounded-md border p-3 dark:border-gray-700"
        onClick={() => setSelectedPageId(page.id)}
      >
        <Button size="icon" variant="ghost" ref={handleRef}>
          <GripVertical className="size-4 cursor-grab" />
        </Button>
        <p className="relative flex size-10 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
          <Mail className="size-5" />
          {funnelPages - 1 !== page.order && (
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

        {selectedPageId === page.id && (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-green-500" />
        )}

        {state.type === "is-dragging-over" && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap={"2px"} />
        )}
      </div>

      {state.type === "preview"
        ? createPortal(
            <FunnelStepDragPreview funnelPages={funnelPages} page={page} />,
            state.container,
          )
        : null}
    </>
  );
}

function FunnelStepDragPreview({
  page,
  funnelPages,
}: {
  funnelPages: number;
  page: FunnelPageType;
}) {
  return (
    <div className="relative flex w-72 select-none items-center gap-3 rounded-md border bg-white p-3 dark:border-gray-700">
      <Button size="icon" variant="ghost">
        <GripVertical className="size-4 cursor-grab" />
      </Button>
      <p className="relative flex size-10 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
        <Mail className="size-5" />
        {funnelPages - 1 !== page.order && (
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
    </div>
  );
}
