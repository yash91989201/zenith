import { createContext, useMemo } from "react";
// TYPES
import type { ReactNode } from "react";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";

export type PipelineDndContextType = {
  instanceId: symbol;

  registerTicket: (args: {
    ticketId: string;
    entry: {
      element: HTMLElement;
      // actionMenuTrigger: HTMLElement;
    };
  }) => CleanupFn;

  registerLane: (args: {
    laneId: string;
    entry: {
      element: HTMLElement;
    };
  }) => CleanupFn;

  reorderTicket: (args: {
    laneId: string;
    startIndex: number;
    finishIndex: number;
  }) => void;

  moveTicket: (args: {
    startLaneId: string;
    finishLaneId: string;
    ticketIndexInStartLane: number;
    ticketIndexInFinishLane?: number;
  }) => void;

  reorderLane: (args: { startIndex: number; finishIndex: number }) => void;
};

export const PipelineDndContext = createContext<PipelineDndContextType | null>(
  null,
);

export type PipelineDndProviderProps = PipelineDndContextType & {
  children: ReactNode;
};

export function PipelineDndProvider({
  reorderLane,
  instanceId,
  registerLane,
  registerTicket,
  moveTicket,
  reorderTicket,
  children,
}: PipelineDndProviderProps) {
  const contextValue: PipelineDndContextType = useMemo(() => {
    return {
      instanceId,
      registerTicket,
      registerLane,
      moveTicket,
      reorderLane,
      reorderTicket,
    };
  }, [
    reorderLane,
    registerLane,
    registerTicket,
    instanceId,
    moveTicket,
    reorderTicket,
  ]);

  return (
    <PipelineDndContext.Provider value={contextValue}>
      {children}
    </PipelineDndContext.Provider>
  );
}
