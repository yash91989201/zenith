"use client";
import { createContext, useMemo, useState } from "react";
// TYPES
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { LaneDetailType, TicketType, UpsertTicketType } from "@/lib/types";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";

type PipelineUtilityModalsContextProps = {
  createLaneModal: ReturnType<typeof useToggle>;
  updateLaneModal: ReturnType<typeof useToggle>;
  deleteLaneModal: ReturnType<typeof useToggle>;
  ticketModal: ReturnType<typeof useToggle>;
  deleteTicketModal: ReturnType<typeof useToggle>;
  lane?: LaneDetailType;
  setLane: Dispatch<SetStateAction<LaneDetailType | undefined>>;
  pipelineId: string;
  subAccountId: string;
  ticket?: TicketType;
  setTicket: Dispatch<SetStateAction<TicketType | undefined>>;
  ticketData?: UpsertTicketType;
  setTicketData: Dispatch<SetStateAction<UpsertTicketType | undefined>>;
};

export const PipelineUtilityModalsContext = createContext<
  PipelineUtilityModalsContextProps | undefined
>(undefined);

type PipelineUtilityModalsProviderProps = {
  children: ReactNode;
  pipelineId: string;
  subAccountId: string;
};

export const PipelineUtilityModalsProvider: React.FC<
  PipelineUtilityModalsProviderProps
> = ({ pipelineId, subAccountId, children }) => {
  const createLaneModal = useToggle(false);
  const updateLaneModal = useToggle(false);
  const deleteLaneModal = useToggle(false);
  const ticketModal = useToggle(false);
  const deleteTicketModal = useToggle(false);

  const [lane, setLane] = useState<LaneDetailType | undefined>();
  const [ticket, setTicket] = useState<TicketType | undefined>();
  const [ticketData, setTicketData] = useState<UpsertTicketType | undefined>();

  const value = useMemo(
    () => ({
      createLaneModal,
      updateLaneModal,
      deleteLaneModal,
      ticketModal,
      deleteTicketModal,
      lane,
      setLane,
      pipelineId,
      subAccountId,
      ticket,
      setTicket,
      ticketData,
      setTicketData,
    }),
    [
      createLaneModal,
      updateLaneModal,
      deleteLaneModal,
      ticketModal,
      deleteTicketModal,
      lane,
      setLane,
      pipelineId,
      subAccountId,
      ticket,
      setTicket,
      ticketData,
      setTicketData,
    ],
  );

  return (
    <PipelineUtilityModalsContext.Provider value={value}>
      {children}
    </PipelineUtilityModalsContext.Provider>
  );
};
