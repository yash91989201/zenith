import { createContext, useMemo } from "react";
// TYPES
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";
import type { FunnelPagesEntry } from "@/components/funnel/funnel-steps-editor/registry";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import type { FunnelPageType, FunnelType } from "@/lib/types";

export type FunnelStepsContextType = {
  instanceId: symbol;
  pages: FunnelPageType[];
  funnel: FunnelType;
  currentPage: FunnelPageType | undefined;
  setCurrentPage: Dispatch<SetStateAction<FunnelPageType | undefined>>;
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
  registerFunnelPage,
  reorderFunnelPage,
  setCurrentPage,
  currentPage,
  pages,
  funnel,
}: FunnelStepsProviderProps) {
  const contextValue: FunnelStepsContextType = useMemo(() => {
    return {
      children,
      instanceId,
      registerFunnelPage,
      reorderFunnelPage,
      setCurrentPage,
      currentPage,
      pages,
      funnel,
    };
  }, [
    pages,
    children,
    instanceId,
    reorderFunnelPage,
    registerFunnelPage,
    funnel,
    setCurrentPage,
    currentPage,
  ]);

  return (
    <FunnelStepsContext.Provider value={contextValue}>
      {children}
    </FunnelStepsContext.Provider>
  );
}
