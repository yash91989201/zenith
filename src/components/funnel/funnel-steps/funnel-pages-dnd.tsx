import { useCallback, useEffect, useState } from "react";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
// UTILS
import { api } from "@/trpc/react";
import { createRegistry } from "@funnelSteps/registry";
// TYPES
import type { FunnelPageType, FunnelType } from "@/lib/types";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
// CUSTOM COMPONENTS
import { FunnelStepsProvider } from "@/providers/funnel-steps-provider";

type FunnelPagesState = {
  funnelPages: FunnelPageType[];
  lastCardMoved: {
    funnelPage: FunnelPageType;
    previousIndex: number;
    currentIndex: number;
    numberOfFunnelPage: number;
  } | null;
};

type Props = {
  funnelId: string;
  funnel: FunnelType;
  subAccountId: string;
  funnelPages: FunnelPageType[];
  children: React.ReactNode;
};

export function FunnelPagesDnd({
  funnelId,
  subAccountId,
  funnel,
  funnelPages: initialFunnelPage,
  children,
}: Props) {
  const apiUtils = api.useUtils();
  const [{ funnelPages }, setFunnelPages] = useState<FunnelPagesState>({
    funnelPages: initialFunnelPage,
    lastCardMoved: null,
  });

  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(
    funnelPages[0]?.id,
  );

  const [registry] = useState(createRegistry);

  const [instanceId] = useState(() => Symbol("instance-id"));

  const { mutate: reorderFunnelPageMutation } =
    api.funnelPage.reorder.useMutation({
      onMutate: async ({ funnelPages }) => {
        const prevFunnelPages = apiUtils.funnelPage.getAll.getData({
          funnelId,
        });
        if (!prevFunnelPages) return;

        apiUtils.funnelPage.getAll.setData({ funnelId }, () => funnelPages);

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

      setFunnelPages((currFunnelPages) => {
        const funnelPage = currFunnelPages.funnelPages[startIndex];

        if (!funnelPage) return currFunnelPages;

        const updatedFunnelPages = reorder({
          list: currFunnelPages.funnelPages,
          startIndex,
          finishIndex,
        });

        const funnelPagesWithUpdatedOrder = updatedFunnelPages.map(
          (page, index) => ({ ...page, order: index }),
        );

        reorderFunnelPageMutation({ funnelPages: funnelPagesWithUpdatedOrder });

        return {
          funnelPages: updatedFunnelPages,
          lastCardMoved: {
            funnelPage,
            previousIndex: startIndex,
            currentIndex: finishIndex,
            numberOfFunnelPage: currFunnelPages.funnelPages.length,
          },
        };
      });
    },
    [reorderFunnelPageMutation],
  );

  useEffect(() => {
    setFunnelPages((prev) => ({ ...prev, funnelPages: initialFunnelPage }));
  }, [initialFunnelPage]);

  useEffect(() => {
    return monitorForElements({
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

        const startIndex = funnelPages.findIndex(
          (item) => item.id === sourceFunnelPageId,
        );

        const indexOfTarget = funnelPages.findIndex(
          (item) => item.id === targetFunnelPageId,
        );

        if (indexOfTarget < 0) return;

        const closestEdgeOfTarget = extractClosestEdge(target.data);

        reorderFunnelPage({
          startIndex,
          indexOfTarget,
          closestEdgeOfTarget,
        });
      },
    });
  }, [instanceId, funnelPages, reorderFunnelPage]);

  const getFunnelPagesLength = useCallback(
    () => funnelPages.length,
    [funnelPages.length],
  );

  return (
    <FunnelStepsProvider
      funnel={funnel}
      funnelId={funnelId}
      subAccountId={subAccountId}
      pages={funnelPages}
      instanceId={instanceId}
      selectedPageId={selectedPageId}
      setSelectedPageId={setSelectedPageId}
      reorderFunnelPage={reorderFunnelPage}
      getFunnelPagesLength={getFunnelPagesLength}
      registerFunnelPage={registry.registerFunnelPage}
    >
      {children}
    </FunnelStepsProvider>
  );
}
