"use client";
import { memo, useCallback, useEffect, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
// UTILS
import { api } from "@/trpc/react";
import { createRegistry } from "@funnelStepsEditor/registry";
// TYPES
import type { FunnelPageType, FunnelType } from "@/lib/types";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
// UI
import { AutoScrollArea } from "@ui/scroll-area";
// CUSTOM COMPONENTS
import { FunnelStepsProvider } from "@/providers/funnel-steps-provider";
import { StepUpdatePane } from "@funnelStepsEditor/step-update-pane";
// ICONS
import { FunnelStep } from "@/components/funnel/funnel-steps-editor/funnel-step";

type FunnelStepsEditorState = {
  pages: FunnelPageType[];
  lastCardMoved: {
    page: FunnelPageType;
    previousIndex: number;
    currentIndex: number;
  } | null;
};

type Props = {
  funnel: FunnelType;
  pages: FunnelPageType[];
};

export const FunnelStepsEditor = memo(({ funnel, pages }: Props) => {
  const { id: funnelId } = funnel;
  const apiUtils = api.useUtils();

  const [currentPage, setCurrentPage] = useState(pages[0]);

  const [registry] = useState(createRegistry);
  const [instanceId] = useState(() => Symbol("instance-id"));
  const [editorState, setEditorState] = useState<FunnelStepsEditorState>({
    pages,
    lastCardMoved: null,
  });
  // const scrollableRef = useRef<HTMLDivElement | null>(null);

  const { mutate: reorderFunnelPageMutation } =
    api.funnelPage.reorder.useMutation({
      onMutate: async ({ funnelPages: pages }) => {
        const prevFunnelPages = apiUtils.funnelPage.getAll.getData({
          funnelId,
        });
        if (!prevFunnelPages) return;

        apiUtils.funnelPage.getAll.setData({ funnelId }, () => pages);

        return { prevFunnelPages };
      },
      onError: (_error, _newLanes, ctx) => {
        apiUtils.funnelPage.getAll.setData(
          { funnelId },
          () => ctx?.prevFunnelPages,
        );
      },
      onSettled: async () => {
        await apiUtils.funnelPage.getAll.refetch({ funnelId });
      },
    });

  const reorderFunnelPage = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      });

      if (finishIndex === startIndex) return;

      setEditorState((currState) => {
        const page = currState.pages[startIndex];

        if (!page) return currState;

        const reorderedPages = reorder({
          list: currState.pages,
          startIndex,
          finishIndex,
        }).map((page, index) => ({ ...page, order: index }));

        reorderFunnelPageMutation({ funnelPages: reorderedPages });

        return {
          pages: reorderedPages,
          lastCardMoved: {
            page,
            previousIndex: startIndex,
            currentIndex: finishIndex,
            numberOfFunnelPage: currState.pages.length,
          },
        };
      });
    },
    [reorderFunnelPageMutation],
  );

  useEffect(() => {
    setEditorState((currState) => ({
      ...currState,
      pages,
    }));
  }, [pages]);

  useEffect(() => {
    // invariant(scrollableRef.current);

    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop({ location, source }) {
          const target = location.current.dropTargets[0];

          if (!target) {
            return;
          }

          const sourceFunnelPageId = source.data.funnelPageId;
          const targetFunnelPageId = target.data.funnelPageId;

          if (sourceFunnelPageId === targetFunnelPageId) {
            return;
          }

          const startIndex = source.data.index as number;
          const indexOfTarget = target.data.index as number;

          if (indexOfTarget < 0) return;

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          reorderFunnelPage({
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget,
          });
        },
      }),
    );
  }, [instanceId, pages, reorderFunnelPage]);

  return (
    <FunnelStepsProvider
      funnel={funnel}
      instanceId={instanceId}
      pages={pages}
      registerFunnelPage={registry.registerFunnelPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      reorderFunnelPage={reorderFunnelPage}
    >
      <div className="flex flex-col gap-3 xl:h-[640px] xl:flex-row">
        <div className="flex h-[480px] flex-col gap-3 rounded-md bg-card p-3 xl:flex-[0.25]">
          <AutoScrollArea className="flex-1">
            <div className="m-4 space-y-3">
              {editorState.pages.map((page) => (
                <FunnelStep key={page.id} page={page} />
              ))}
            </div>
          </AutoScrollArea>
        </div>

        <aside className="bg-muted xl:flex-[0.75]">
          <StepUpdatePane />
        </aside>
      </div>
    </FunnelStepsProvider>
  );
});

FunnelStepsEditor.displayName = "FunnelStepsEditor";
