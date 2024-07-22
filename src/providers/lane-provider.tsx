import { createContext, useMemo } from "react";
import type { ReactNode } from "react";

export type LaneContextProps = {
  laneId: string;
  getTicketIndex: (ticketId: string) => number;
  getNumTickets: () => number;
};

export const LaneContext = createContext<LaneContextProps | null>(null);

export type LaneProviderProps = LaneContextProps & {
  children: ReactNode;
};

export function LaneProvider({
  children,
  laneId,
  getNumTickets,
  getTicketIndex,
}: LaneProviderProps) {
  const contextValue: LaneContextProps = useMemo(() => {
    return { laneId, getTicketIndex, getNumTickets };
  }, [laneId, getTicketIndex, getNumTickets]);

  return (
    <LaneContext.Provider value={contextValue}>{children}</LaneContext.Provider>
  );
}
