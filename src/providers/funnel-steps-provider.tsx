import { createContext, useMemo } from "react";
// TYPES
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";
import type { FunnelPagesEntry } from "@funnelSteps/registry";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import type { FunnelPageType, FunnelType } from "@/lib/types";

export type FunnelStepsContextType = {
  instanceId: symbol;
  selectedPageId: string | undefined;
  pages: FunnelPageType[];
  funnelId: string;
  subAccountId: string;
  funnel: FunnelType;
  setSelectedPageId: Dispatch<SetStateAction<string | undefined>>;
  getFunnelPagesLength: () => number;
  registerFunnelPage: (entry: FunnelPagesEntry) => CleanupFn;
  reorderFunnelPage: (args: {
    startIndex: number;
    indexOfTarget: number;
    closestEdgeOfTarget: Edge | null;
  }) => void;
};

export const FunnelStepsContext = createContext<FunnelStepsContextType | null>(
  null,
);

export type FunnelStepsProviderProps = FunnelStepsContextType & {
  children: ReactNode;
};

export function FunnelStepsProvider({
  children,
  instanceId,
  getFunnelPagesLength,
  registerFunnelPage,
  reorderFunnelPage,
  selectedPageId,
  setSelectedPageId,
  pages,
  funnelId,
  subAccountId,
  funnel,
}: FunnelStepsProviderProps) {
  const contextValue: FunnelStepsContextType = useMemo(() => {
    return {
      children,
      instanceId,
      getFunnelPagesLength,
      registerFunnelPage,
      reorderFunnelPage,
      selectedPageId,
      setSelectedPageId,
      pages,
      funnelId,
      subAccountId,
      funnel,
    };
  }, [
    pages,
    children,
    instanceId,
    selectedPageId,
    setSelectedPageId,
    reorderFunnelPage,
    registerFunnelPage,
    getFunnelPagesLength,
    funnelId,
    subAccountId,
    funnel,
  ]);

  return (
    <FunnelStepsContext.Provider value={contextValue}>
      {children}
    </FunnelStepsContext.Provider>
  );
}
